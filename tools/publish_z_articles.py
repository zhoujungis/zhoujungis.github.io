"""Publish the Z Desktop and Z Memory project articles.

Usage:
    backend/venv/Scripts/python.exe tools/publish_z_articles.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_z_articles.py --skip-cover-check

Idempotent by slug: existing articles are updated, not duplicated.

Both covers live in this repo (``tools/make_z_desktop_cover.py`` and
``tools/make_z_memory_cover.py`` -> ``frontend/public/photos/`` + ``photos/``).
Deploy them before the default (cover-checked) run; while deploying, use
``--skip-cover-check`` because the PNG is not live yet. After the deploy, run
again without the flag so the same script proves the cover is reachable.
"""

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

API = API_URL
ROOT = Path(__file__).resolve().parent.parent

CATEGORY = {
    "name": "项目实战",
    "slug": "projects",
    "description": "从零实现：桌面应用、数据流水线与本地 Agent",
}

MARKDOWN_EXTENSIONS = ["fenced_code", "codehilite", "tables", "extra", "toc"]

ARTICLES = [
    {
        "slug": "z-desktop-permission-gate",
        "title": "Z Desktop：44 个本机工具怎么过闸",
        "excerpt": (
            "Z Desktop 把 44 个本机工具收进一个 Rust 入口：五级风险里 CRITICAL 直接拦截，"
            "HIGH 每次确认，Always-allow 只对 MEDIUM 及以下生效；Shell 命令按分号与管道拆段"
            "后取最高风险，路径沙箱只守写入。文章拆开审批队列、命令分级、Agent Loop 四道刹车"
            "与 44 个工具的上限，并列出七个仍然存在的绕过面。"
        ),
        "tags": [
            {"slug": "rust", "name": "Rust"},
            {"slug": "tauri", "name": "Tauri"},
            {"slug": "agent", "name": "Agent"},
            {"slug": "desktop-app", "name": "桌面应用"},
            {"slug": "security", "name": "安全"},
        ],
        "figures": [
            "44 个", "20 个 Tauri 命令", "五级风险", "request_tool_execution",
            "CRITICAL", "SAFE", "MEDIUM", "HIGH",
            "auto_approve_safe = true", "max_steps = 30", "1–200",
            "31 条", "35 条", "split_segments", "echo ok && rm -rf ./build",
            "approval_required", "pending_approvals", "approval_rules",
            "check_path", "C:\\Windows", "PathOp::Mutate", "PathOp::Read",
            "4000 字符", "8000 字符", "2 MB", "50 MB", "100 KB", "20000",
            "AutomationId", "taskkill /PID <pid> /T /F", "42 个", "fail-open",
            "44 个工具",
        ],
    },
    {
        "slug": "z-memory-explainable-provenance",
        "title": "Z Memory：让 AI 记住并说清理由",
        "excerpt": (
            "Z Memory 不用向量库：记忆是带来源、可信度、关系与事件的结构化记录，写入先当候选、"
            "审核后再入库；同类型相似度超过 0.82 合并，冲突只并置不覆盖，旧记录归档并留下 "
            "supersedes。检索把 FTS5、384 维本地哈希向量与五个评分因子拆开返回。文章也交代"
            "哈希向量不懂语义、扫描是 O(n)、rrf_k 是死配置这些真实边界。"
        ),
        "tags": [
            {"slug": "rust", "name": "Rust"},
            {"slug": "tauri", "name": "Tauri"},
            {"slug": "memory", "name": "记忆系统"},
            {"slug": "sqlite", "name": "SQLite"},
            {"slug": "local-first", "name": "本地优先"},
        ],
        "figures": [
            "十二张普通表", "FTS5", "memory_candidates", "memory_conflicts",
            "memory_events", "audit_log", "200,000", "max_candidates",
            "min_importance = 0.2", "0.82", "384", "local-hash-v1",
            "0.60 / 0.40", "bm25", "memory_fts", "3650", "180", "3 天",
            "12 条", "4000 字符", "35 个 Tauri 命令", "z-memory-cli",
            "24 条", "14 个", "rrf_k: 60.0", "different_choice", "0.55",
            "supersedes", "contradicts", "8000 字符", "7 天",
        ],
    },
]

COVER_BASE = "https://zhoujungis.github.io/photos"


def strip_frontmatter(md: str) -> str:
    return re.sub(r"^---\n.*?\n---\n", "", md, flags=re.S).strip()


def api(method, path, data=None):
    request = urllib.request.Request(f"{API}{path}", method=method)
    request.add_header("Content-Type", "application/json")
    request.add_header("Authorization", f"Bearer {get_token()}")
    if data is not None:
        request.data = json.dumps(data, ensure_ascii=False).encode("utf-8")
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            body = response.read()
            if not body or response.status == 204:
                return None
            return json.loads(body)
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        print(f"{method} {path} -> HTTP {error.code}: {detail[:500]}", file=sys.stderr)
        return None
    except urllib.error.URLError as error:
        print(f"{method} {path} -> connection error: {error}", file=sys.stderr)
        return None


def paginated(path):
    data = api("GET", path)
    if isinstance(data, dict) and "results" in data:
        items = list(data["results"])
        url = data.get("next")
        while url:
            request = urllib.request.Request(url, method="GET")
            request.add_header("Authorization", f"Bearer {get_token()}")
            with urllib.request.urlopen(request, timeout=60) as response:
                data = json.loads(response.read())
            items.extend(data.get("results", []))
            url = data.get("next")
        return items
    return data or []


def cover_is_live(url):
    for method in ("HEAD", "GET"):
        request = urllib.request.Request(url, method=method)
        if method == "GET":
            request.add_header("Range", "bytes=0-2048")
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                if 200 <= response.status < 300:
                    return True
        except (urllib.error.HTTPError, urllib.error.URLError) as error:
            print(f"  cover check ({method}) failed: {error}", file=sys.stderr)
    return False


def category_id():
    for item in paginated("/categories/"):
        if item.get("slug") == CATEGORY["slug"]:
            print(f"  category {CATEGORY['name']}: reused id={item['id']}")
            return item["id"]
    created = api("POST", "/admin/categories/", CATEGORY)
    if created:
        print(f"  category {CATEGORY['name']}: created id={created['id']}")
        return created["id"]
    return None


def tag_ids(tags):
    existing = paginated("/tags/")
    by_slug = {item["slug"]: item["id"] for item in existing}
    by_name = {item["name"]: item["id"] for item in existing}
    ids = []
    for tag in tags:
        if tag["slug"] in by_slug:
            ids.append(by_slug[tag["slug"]])
            print(f"  tag {tag['name']}: reused slug (id={by_slug[tag['slug']]})")
            continue
        if tag["name"] in by_name:
            ids.append(by_name[tag["name"]])
            print(f"  tag {tag['name']}: reused name -> id={by_name[tag['name']]}")
            continue
        created = api("POST", "/admin/tags/", tag)
        if created:
            ids.append(created["id"])
            by_slug[tag["slug"]] = created["id"]
            print(f"  tag {tag['name']}: created id={created['id']}")
    return ids


def _reexec_with_markdown():
    try:
        import markdown  # noqa: F401
        return
    except ImportError:
        pass
    for name in ("Scripts/python.exe", "bin/python"):
        candidate = ROOT / "backend" / "venv" / name
        if not candidate.exists():
            continue
        if Path(sys.executable).resolve() == candidate.resolve():
            break
        probe = subprocess.run([str(candidate), "-c", "import markdown"], capture_output=True)
        if probe.returncode == 0:
            print(f"  guards: re-running under {candidate.name}")
            os.execv(str(candidate), [str(candidate), *sys.argv])
    raise SystemExit(
        "Refusing to publish: no interpreter with `markdown` found.\n"
        "  Use backend/venv/Scripts/python.exe."
    )


def check_toc(content, slug):
    bad = re.findall(r"^- \d+\.", content, flags=re.M)
    if bad:
        raise SystemExit(f"[{slug}] TOC bug: {len(bad)} item(s) start with `- <number>`.")

    toc_block = content.split("**目录**", 1)
    if len(toc_block) != 2:
        raise SystemExit(f"[{slug}] missing **目录** block")
    toc_lines = []
    started = False
    for line in toc_block[1].splitlines():
        if line.startswith("- "):
            toc_lines.append(line[2:].strip())
            started = True
        elif started:
            break
    headings = [line[3:].strip() for line in content.splitlines() if line.startswith("## ")]
    if toc_lines != headings:
        raise SystemExit(
            f"[{slug}] TOC does not match H2 headings:\n  toc={toc_lines}\n  h2={headings}"
        )
    print(f"  TOC check: OK ({len(toc_lines)} entries)")


def check_viz(content, slug):
    import bleach
    import markdown

    html = markdown.Markdown(extensions=MARKDOWN_EXTENSIONS).convert(content)
    cleaned = bleach.clean(
        html,
        tags=bleach.sanitizer.ALLOWED_TAGS
        | {
            "h1", "h2", "h3", "h4", "h5", "h6",
            "img", "pre", "code", "span", "div",
            "table", "thead", "tbody", "tr", "th", "td",
            "hr", "br", "sup", "sub", "figure", "figcaption",
        },
        attributes={
            **bleach.sanitizer.ALLOWED_ATTRIBUTES,
            "div": ["class"],
            "span": ["class"],
            "code": ["class"],
            "pre": ["class"],
        },
        protocols=["http", "https", "mailto"],
        strip=True,
    )

    polluted = 0
    for block in re.findall(r"<pre\b[^>]*>.*?</pre>", cleaned, flags=re.DOTALL):
        polluted += len(re.findall(r"</?(?:em|strong)\b", block))
    if polluted:
        raise SystemExit(f"[{slug}] {polluted} <em>/<strong> inside code blocks")

    prose = re.sub(r"<pre\b[^>]*>.*?</pre>", "", cleaned, flags=re.DOTALL)
    if re.search(r"\*\*", prose):
        raise SystemExit(f"[{slug}] rendered prose still contains a bare `**`")
    print(f"  viz check: OK ({len(re.findall('<pre', cleaned))} code blocks clean)")


def check_numbers(content, article):
    missing = [figure for figure in article["figures"] if figure not in content]
    if missing:
        raise SystemExit(f"[{article['slug']}] missing figures: {missing}")
    print(f"  number check: OK ({len(article['figures'])} figures present)")


def publish(article, category, tags, cover):
    source = ROOT / "article" / f"{article['slug']}.md"
    if not source.exists():
        raise SystemExit(f"Source Markdown not found: {source}")
    content = strip_frontmatter(source.read_text(encoding="utf-8"))
    chinese = len(re.findall(r"[一-鿿㐀-䶿]", content))
    english = len(re.findall(r"[a-zA-Z]+", content))
    print(f"\n== {article['slug']} ({len(content)} chars, "
          f"~{max(1, (chinese + english) // 250 + 1)} min)")

    check_toc(content, article["slug"])
    check_viz(content, article["slug"])
    check_numbers(content, article)

    payload = {
        "title": article["title"],
        "content": content,
        "excerpt": article["excerpt"],
        "cover_image": cover,
        "status": "published",
        "is_top": False,
        "tags_ids": tags,
    }
    if category is not None:
        payload["category_id"] = category

    existing = api("GET", f"/articles/{article['slug']}/")
    if existing:
        result = api("PUT", f"/admin/articles/{existing['id']}/", payload)
        action = "updated"
    else:
        result = api("POST", "/admin/articles/", {**payload, "slug": article["slug"]})
        action = "created"
    if not result:
        raise SystemExit(f"API request failed for {article['slug']}")
    print(f"  article {action}: id={result.get('id')} slug={result.get('slug', article['slug'])}")
    print(f"  cover: {result.get('cover_image')}")
    print(f"  live: https://zhoujungis.github.io/article/{article['slug']}/")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-cover-check", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    _reexec_with_markdown()

    covers = {
        article["slug"]: f"{COVER_BASE}/{article['slug']}-cover.png"
        for article in ARTICLES
    }

    if not args.skip_cover_check:
        for slug, url in covers.items():
            print(f"Cover {slug}: {url}")
            if not cover_is_live(url):
                raise SystemExit(
                    f"Cover not reachable: {url}\n"
                    "  Deploy the PNG first, or pass --skip-cover-check while deploying."
                )

    if args.dry_run:
        for article in ARTICLES:
            source = ROOT / "article" / f"{article['slug']}.md"
            content = strip_frontmatter(source.read_text(encoding="utf-8"))
            print(f"\n--dry-run: {article['slug']}")
            check_toc(content, article["slug"])
            check_viz(content, article["slug"])
            check_numbers(content, article)
        print("\n--dry-run: local guards passed, no API calls made.")
        return

    category = category_id()
    for article in ARTICLES:
        ids = tag_ids(article["tags"])
        if not ids:
            raise SystemExit(f"no tags resolved for {article['slug']}")
        publish(article, category, ids, covers[article["slug"]])


if __name__ == "__main__":
    main()
