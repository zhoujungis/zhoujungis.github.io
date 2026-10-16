"""Publish the aidevops project-introduction article -- the first entry in
the "项目实践" category for this package.

Usage:
    backend/venv/Scripts/python.exe tools/publish_aidevops_article.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_aidevops_article.py

Idempotent by slug: an existing article is updated instead of duplicated.

Source Markdown: ``article/aidevops-terminal-client.md``.

Project article (no algo-viz animations): the guard therefore asserts the
OPPOSITE of the algorithm pipeline -- zero animation placeholders may
survive, because a stray one would render as a blank block.

Spine claims (verified against PyPI and the GitHub README on 2026-10-16):
- aidevops 0.2.0, Python >= 3.11, MIT, published 2026-10-14;
- client-only architecture (Django + PostgreSQL + Redis backend over HTTP);
- the budget/design invariants: AI proposes only, 13 read-only tools,
  approve/reject confirm flow with AuditLog, 10-signal explainable risk;
- scriptable: global --json, stderr-only upgrade notices, AIDEVOPS_TOKEN;
- engineering: 50 client tests (incl. Textual pilot), 569 backend tests,
  tag-triggered trusted publishing to PyPI.

Same guard set as publish_lcs1_article.py, minus the animation checks.
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
SOURCE = (
    Path(__file__).resolve().parent.parent
    / "article"
    / "aidevops-terminal-client.md"
)

ARTICLE_TITLE = "【开源】aidevops 技术拆解：研发数据关联与可解释风险"
ARTICLE_SLUG = "aidevops-terminal-client"
ARTICLE_EXCERPT = (
    "AI DevOps / QA Copilot 的终端客户端（CLI + 全屏 TUI）已发布到 PyPI："
    "pip install aidevops 即可安装。它把「需求 → 代码 → 测试 → Bug → 发布」"
    "链路上孤立的研发数据关联起来：一条命令拿到一次提交的完整关联链，"
    "10 信号可解释风险分，AI 只提议、人确认后才执行，全程可审计。"
    "本文讲清楚它解决什么问题、怎么用、为什么是现在这个形状。"
)
# 封面沿用首页项目卡片的那张终端截图（tools 里由 make_aidevops_cover.py 生成），
# 这里是 webp 转 png 的仓库文件，必须先部署才可访问。
ARTICLE_COVER = "https://zhoujungis.github.io/photos/aidevops-cover.png"

CATEGORY = {"name": "项目实践", "slug": "project-practice", "description": "真实项目的全栈实践与复盘"}

TAGS = [
    {"slug": "aidevops", "name": "aidevops"},
    {"slug": "devops", "name": "DevOps"},
    {"slug": "open-source", "name": "开源"},
    {"slug": "python", "name": "Python"},
]

# 文章正文里必须出现的关键事实，用来兜住「正文被改坏了」这类事故。
EXPECTED_FIGURES = [
    "pipx install aidevops",
    "pip install aidevops",
    "aidevops upgrade",
    "Python ≥ 3.11",
    "MIT",
    "aidevops login",
    "login --no-browser",
    "aidevops org-add",
    "aidevops use",
    "aidevops status",
    "aidevops connections",
    "connection-verify",
    "repo-add",
    "aidevops sync",
    "aidevops explain <sha>",
    "aidevops risk <sha>",
    "module-risk",
    "data_gaps",
    "aidevops proposals",
    "aidevops approve",
    "aidevops reject",
    "analyse -a test-generation --wait",
    "aidevops trace",
    "aidevops tui",
    "aidevops audit",
    "10 个信号",
    "13 个",
    "AuditLog",
    "0600",
    "--json",
    "AIDEVOPS_TOKEN",
    "AIDEVOPS_BASE_URL",
    "AIDEVOPS_NO_UPDATE_CHECK",
    "stderr",
    "Typer",
    "Textual",
    "Rich",
    "httpx",
    "Django + PostgreSQL + Redis",
    "50 个客户端测试",
    "569 个测试",
    "trusted publishing",
    "%LOCALAPPDATA%",
    "~/.config/aidevops/",
    "Celery",
    "Webhook",
    "项目完全开源",
]

# 与 backend/articles/models.py 逐字一致
MARKDOWN_EXTENSIONS = ["fenced_code", "codehilite", "tables", "extra", "toc"]


def strip_frontmatter(md: str) -> str:
    """Remove a leading YAML frontmatter block if present."""
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
    """HEAD first; fall back to a ranged GET because some CDNs reject HEAD."""
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


def tag_ids():
    existing = paginated("/tags/")
    by_slug = {item["slug"]: item["id"] for item in existing}
    by_name = {item["name"]: item["id"] for item in existing}
    ids = []
    for tag in TAGS:
        if tag["slug"] in by_slug:
            ids.append(by_slug[tag["slug"]])
            print(f"  tag {tag['name']}: reused slug {tag['slug']} (id={by_slug[tag['slug']]})")
            continue
        if tag["name"] in by_name:
            ids.append(by_name[tag["name"]])
            print(f"  tag {tag['name']}: reused name -> id={by_name[tag['name']]}")
            continue
        created = api("POST", "/admin/tags/", tag)
        if created:
            ids.append(created["id"])
            print(f"  tag {tag['name']}: created id={created['id']}")
    return ids


def _reexec_with_markdown():
    """Re-run under an interpreter that has `markdown` installed."""
    try:
        import markdown  # noqa: F401
        return False
    except ImportError:
        pass

    root = Path(__file__).resolve().parent.parent
    candidates = [
        root / "backend" / "venv" / "Scripts" / "python.exe",  # Windows
        root / "backend" / "venv" / "bin" / "python",          # POSIX
    ]
    for candidate in candidates:
        if not candidate.exists():
            continue
        if Path(sys.executable).resolve() == candidate.resolve():
            break  # already running under it, and it still has no markdown
        probe = subprocess.run([str(candidate), "-c", "import markdown"], capture_output=True)
        if probe.returncode == 0:
            print(f"  guards: re-running under {candidate.name} "
                  f"(this interpreter has no `markdown`)")
            os.execv(str(candidate), [str(candidate), *sys.argv])
    raise SystemExit(
        "Refusing to publish: no interpreter with `markdown` found, so the "
        "placeholder / code-block guards cannot run.\n"
        "  Use backend/venv/Scripts/python.exe (or backend/venv/bin/python)."
    )


def check_toc(content):
    """Guard against the `- 1. xxx` markdown bug that renders every TOC entry as 1."""
    bad = re.findall(r"^- \d+\.", content, flags=re.M)
    if bad:
        raise SystemExit(
            f"TOC bug detected: {len(bad)} list item(s) start with `- <number>.`.\n"
            "  Markdown renders these as nested <ol> starting at 1 for every entry.\n"
            "  Remove the manual numbers and use a flat `- ` list."
        )
    print("  TOC check: OK (no `- <n>.` numbering)")


def check_viz(content):
    """Project article: NO animation placeholders may exist, stray or not."""
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
            "hr", "br", "sup", "sub",
            "figure", "figcaption",
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

    placeholders = re.findall(r"algo-viz--\w+", cleaned)
    if placeholders:
        raise SystemExit(
            f"Animation placeholder(s) found in a PROJECT article: {sorted(set(placeholders))}\n"
            "  This article has no animations; a stray placeholder renders as a blank\n"
            "  block. Remove it or move it to the algorithm article it belongs to."
        )

    # Code blocks must not be touched by markdown emphasis rules.
    polluted = 0
    for block in re.findall(r"<pre\b[^>]*>.*?</pre>", cleaned, flags=re.DOTALL):
        polluted += len(re.findall(r"</?(?:em|strong)\b", block))
    if polluted:
        raise SystemExit(
            f"Code blocks contain {polluted} <em>/<strong> tag(s) — markdown emphasis "
            "mangled the source. Usually a non-intraword `_` pair or a bare `*`."
        )

    # Bare `**` check must skip code spans: globs like `src/auth/**` are legal
    # inline code, not unbalanced bold. Same order as the md-level guard:
    # drop fenced blocks, then inline code spans, then count.
    html_no_code = re.sub(r"<pre\b[^>]*>.*?</pre>", "", cleaned, flags=re.DOTALL)
    html_no_code = re.sub(r"<code\b[^>]*>.*?</code>", "", html_no_code, flags=re.DOTALL)
    if re.search(r"\*\*", html_no_code):
        raise SystemExit("Rendered HTML still contains a bare `**` — unbalanced bold.")

    print(
        f"  viz check: OK (0 placeholders as expected; "
        f"{len(re.findall(r'<pre', cleaned))} code blocks clean)"
    )


def check_numbers(content):
    """Headline figures / identifiers that must appear in the text."""
    missing = [e for e in EXPECTED_FIGURES if e not in content]
    if missing:
        raise SystemExit(f"Number check failed — not found in text: {missing}")
    print(f"  number check: OK ({len(EXPECTED_FIGURES)} expected figures present)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cover", default=ARTICLE_COVER)
    parser.add_argument("--skip-cover-check", action="store_true")
    parser.add_argument("--dry-run", action="store_true",
                        help="只做本地校验（frontmatter/目录/占位符/数字/封面），不碰 API")
    args = parser.parse_args()

    # Do this before printing anything so the re-exec output stays clean.
    _reexec_with_markdown()

    if not SOURCE.exists():
        raise SystemExit(f"Source Markdown not found: {SOURCE}")
    content = strip_frontmatter(SOURCE.read_text(encoding="utf-8"))
    print(f"Source: {SOURCE.name} ({len(content)} chars)")

    chinese = len(re.findall(r"[一-鿿㐀-䶿]", content))
    english = len(re.findall(r"[a-zA-Z]+", content))
    print(f"Reading time (backend formula): {max(1, (chinese + english) // 250 + 1)} min")

    check_toc(content)
    check_viz(content)
    check_numbers(content)

    print(f"Cover: {args.cover}")
    if not args.skip_cover_check and not cover_is_live(args.cover):
        raise SystemExit(
            "Cover URL is not reachable — refusing to publish.\n"
            "  This cover is a repo file (photos/aidevops-cover.png),\n"
            "  so it only becomes reachable AFTER the deploy that ships it.\n"
            "  Deploy first, then publish. Override with --skip-cover-check only if\n"
            "  you are certain the same deploy carries the image."
        )

    if args.dry_run:
        print("\n--dry-run: local checks passed, no API calls made.")
        print(f"Would publish: {ARTICLE_SLUG} ({ARTICLE_TITLE})")
        return

    category = category_id()
    tags = tag_ids()
    if not tags:
        raise SystemExit("No article tags could be resolved; aborting.")

    payload = {
        "title": ARTICLE_TITLE,
        "content": content,
        "excerpt": ARTICLE_EXCERPT,
        "cover_image": args.cover,
        "status": "published",
        "is_top": False,
        "tags_ids": tags,
    }
    if category is not None:
        payload["category_id"] = category

    existing = api("GET", f"/articles/{ARTICLE_SLUG}/")
    if existing:
        result = api("PUT", f"/admin/articles/{existing['id']}/", payload)
        action = "updated"
    else:
        result = api("POST", "/admin/articles/", {**payload, "slug": ARTICLE_SLUG})
        action = "created"

    if not result:
        raise SystemExit("Article API request failed.")
    print(f"Article {action}: {result.get('id')} {result.get('slug', ARTICLE_SLUG)}")
    print(f"Cover: {result.get('cover_image')}")
    print(f"Live URL: https://zhoujungis.github.io/article/{ARTICLE_SLUG}/")


if __name__ == "__main__":
    main()
