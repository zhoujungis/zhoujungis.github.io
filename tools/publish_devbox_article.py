"""Publish the DevBox (registry-driven toolbox) deep-dive article.

Usage:
    backend/venv/Scripts/python.exe tools/publish_devbox_article.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_devbox_article.py --skip-cover-check

Idempotent by slug: an existing article is updated instead of duplicated.

Source Markdown: ``article/devbox-registry-driven-toolbox.md``.
Cover: ``tools/make_devbox_cover.py`` writes the PNG to both
``frontend/public/photos/`` and ``photos/``; deploy the image before running
without ``--skip-cover-check``.
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

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

API = API_URL
ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "article" / "devbox-registry-driven-toolbox.md"

ARTICLE_TITLE = "DevBox：把 42 个在线工具做成一个可维护的产品，而不是 42 个页面"
ARTICLE_SLUG = "devbox-registry-driven-toolbox"
ARTICLE_EXCERPT = (
    "DevBox 是一个 Vue 3 + TypeScript + Vite 的浏览器端开发者工具箱：42 个工具、8 个分类、"
    "34 个 processor、31 份单元测试，全部本地完成，零账号、零后端数据库。难点不是那 42 个算法，"
    "而是四个工程边界：新增工具靠填一条 ToolDefinition，路由、搜索、分类、收藏、sitemap 全部派生；"
    "数据流向写进类型（local / external / mixed）决定页面要不要警告；每种输入都必须有上限——"
    "正则拦嵌套量词、源码卡 100 万字符、CIDR 拦前缀 33；默认不上传，只有 3 个工具发外部请求且必须"
    "写明目标域名。文章给出注册表、懒加载、ReDoS 防护、RFC 6238 向量测试、AES 载荷格式、启发式评分器、"
    "CodeMirror 重配置与 CSP 的真实实现，也把「HTTP Ping 不是 ICMP」「AI 检测不能证明作者」"
    "「CSP 被迫放开 connect-src」这些边界写清楚。"
)
ARTICLE_COVER = "https://blog.zhoujun.dev/photos/devbox-registry-driven-toolbox-cover.png"

CATEGORY = {
    "name": "项目实战",
    "slug": "projects",
    "description": "从零实现：桌面客户端、数据流水线与本地 Agent",
}

TAGS = [
    {"slug": "vue", "name": "Vue"},
    {"slug": "typescript", "name": "TypeScript"},
    {"slug": "frontend-architecture", "name": "前端架构"},
    {"slug": "security", "name": "安全"},
    {"slug": "project-practice", "name": "项目实战"},
]

EXPECTED_FIGURES = [
    "DevBox",
    "42 个工具",
    "8 个分类",
    "34 个 processor",
    "31 份",
    "ToolDefinition",
    "16,595 字节",
    "component: () => Promise<Component>",
    "processing?: 'local' | 'external' | 'mixed'",
    "searchTools",
    "getToolByPath",
    "includedRoutes",
    "MAX_PATTERN_LENGTH",
    "MAX_TEXT_LENGTH",
    "NESTED_QUANTIFIER_PATTERN",
    "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ",
    "94287082",
    "287082",
    "PBKDF2",
    "150000",
    "AES-GCM",
    "fatal: true",
    "HS_ALGOS",
    "diff |=",
    ">>> 0",
    "cloudflare-dns.com",
    "application/dns-json",
    "mode: 'no-cors'",
    "MAX_SOURCE_LENGTH",
    "不能证明",
    "Compartment",
    "theme-init.js",
    "aria-activedescendant",
    "safeGet",
    "connect-src",
    "globPatterns",
    "Vue 3",
]

MARKDOWN_EXTENSIONS = ["fenced_code", "codehilite", "tables", "extra", "toc"]


def strip_frontmatter(md: str) -> str:
    return re.sub(r"^---\n.*?\n---\n", "", md, flags=re.S).strip()


def api(method, path, data=None):
    request = urllib.request.Request(f"{API}{path}", method=method)
    request.add_header("Content-Type", "application/json")
    request.add_header("Authorization", f"Bearer {get_token()}")
    if data is not None:
        request.data = json.dumps(data, ensure_ascii=False).encode("utf-8")
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
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
    try:
        import markdown  # noqa: F401
        return
    except ImportError:
        pass

    for name in ("Scripts/python.exe", "bin/python"):
        candidate = ROOT / "backend" / "venv" / name
        if candidate.exists() and Path(sys.executable).resolve() != candidate.resolve():
            probe = subprocess.run([str(candidate), "-c", "import markdown"], capture_output=True)
            if probe.returncode == 0:
                print(f"  guards: re-running under {candidate.name}")
                os.execv(str(candidate), [str(candidate), *sys.argv])
    raise SystemExit("Refusing to publish: no interpreter with `markdown` found.")


def check_toc(content):
    bad = re.findall(r"^- \d+\.", content, flags=re.M)
    if bad:
        raise SystemExit(f"TOC bug: {len(bad)} list item(s) start with `- <number>`.")

    block = content.split("**目录**", 1)
    if len(block) != 2:
        raise SystemExit("找不到 **目录** 块")
    toc_lines = []
    started = False
    for line in block[1].splitlines():
        if line.startswith("- "):
            toc_lines.append(line[2:].strip())
            started = True
        elif started:
            break
    headings = [line[3:].strip() for line in content.splitlines() if line.startswith("## ")]
    if toc_lines != headings:
        raise SystemExit(f"目录与 H2 不一致：\n  toc={toc_lines}\n  h2={headings}")
    print(f"  TOC check: OK ({len(toc_lines)} entries)")


def check_viz(content):
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
        raise SystemExit(f"Code blocks contain {polluted} <em>/<strong> tag(s).")

    prose = re.sub(r"<pre\b[^>]*>.*?</pre>", "", cleaned, flags=re.DOTALL)
    if re.search(r"\*\*", prose):
        raise SystemExit("Rendered prose still contains a bare `**`.")
    print(f"  viz check: OK ({len(re.findall('<pre', cleaned))} code blocks clean)")


def check_numbers(content):
    missing = [e for e in EXPECTED_FIGURES if e not in content]
    if missing:
        raise SystemExit(f"Number check failed — not found: {missing}")
    print(f"  number check: OK ({len(EXPECTED_FIGURES)} figures present)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cover", default=ARTICLE_COVER)
    parser.add_argument("--skip-cover-check", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

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
        raise SystemExit("Cover URL is not reachable — deploy photos/devbox-*.png first.")

    if args.dry_run:
        print("\n--dry-run: local checks passed, no API calls made.")
        print(f"Would publish: {ARTICLE_SLUG} ({ARTICLE_TITLE})")
        return

    category = category_id()
    if category is None:
        raise SystemExit("No project category could be resolved; aborting.")
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
        "category_id": category,
    }

    existing = api("GET", f"/articles/{ARTICLE_SLUG}/")
    if existing:
        result = api("PUT", f"/admin/articles/{existing['id']}/", payload)
        action = "updated"
    else:
        result = api("POST", "/admin/articles/", {**payload, "slug": ARTICLE_SLUG})
        action = "created"

    if not result:
        raise SystemExit("Article API request failed.")
    print(f"Article {action}: id={result.get('id')} slug={result.get('slug', ARTICLE_SLUG)}")
    print(f"Cover: {result.get('cover_image')}")
    print(f"Live URL: https://blog.zhoujun.dev/article/{ARTICLE_SLUG}/")


if __name__ == "__main__":
    main()
