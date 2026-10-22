"""Publish the NanoBrowser deep-dive article.

Usage:
    backend/venv/Scripts/python.exe tools/publish_nanobrowser_article.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_nanobrowser_article.py

Idempotent by slug: an existing article is updated instead of duplicated.

Source Markdown: ``article/nanobrowser-tauri-webview2.md``.

This is a technical deep-dive (no animations), so ``VIZ_PLACEHOLDER_CLASSES``
is empty: the file guards TOC numbering, code-block emphasis pollution, a bare
``**`` and the headline figures only.

Cover: a repo-native PNG (``tools/make_nanobrowser_cover.py``, written to both
``frontend/public/photos/`` and ``photos/``). Because the cover lives in this
repo it must be DEPLOYED before this script runs, or the cover-reachability
check fails -- standard two-stage order: deploy the PNG, re-run this script
(idempotent by slug), then build + deploy again.
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
    / "nanobrowser-tauri-webview2.md"
)

ARTICLE_TITLE = "NanoBrowser 拆解：手写进程内 CDP"
ARTICLE_SLUG = "nanobrowser-tauri-webview2"
ARTICLE_EXCERPT = (
    "NanoBrowser 是一个用 Rust + Tauri 2 手写的极轻量桌面浏览器：它不打包 Chromium，"
    "直接驱动系统已装的 WebView2，于是 GUI 二进制只有 4.52 MB、无界面 agent 只有 "
    "4.24 MB。它有三个反常识的决定——不造引擎、永不开调试端口、连 DevTools 要用的 "
    "WebSocket 服务端都手写。本文把它逐层拆开：单窗口里 shell / tab-<id> / devtools "
    "三类兄弟 HWND 的拓扑与 z-order 覆层技巧、基于 ICoreWebView2::"
    "CallDevToolsProtocolMethod 的进程内 CDP 内核（无 id 信封、按序号关联、回调跑在 "
    "UI 线程、Condvar 等待）、手写 SHA-1 握手与帧编解码的 loopback 桥、把官方 DevTools "
    "前端塞进同窗口子 webview 的停靠面板（含 #nanoSide 片段陷阱）、纯 HTML/JS 零框架"
    "前端、nanoagent 的可信输入与 MCP 九个工具，以及捕获期脱敏与五道安全防线。"
)
# 站内自制封面（tools/make_nanobrowser_cover.py，双份落盘），必须先部署才能通过封面可达性检查。
ARTICLE_COVER = "https://zhoujungis.github.io/photos/nanobrowser-cover.png"

CATEGORY = {
    "name": "项目实践",
    "slug": "project-practice",
    "description": "动手做过的项目与工程复盘",
}

TAGS = [
    {"slug": "rust", "name": "Rust"},
    {"slug": "tauri", "name": "Tauri"},
    {"slug": "webview2", "name": "WebView2"},
    {"slug": "mcp", "name": "MCP"},
    {"slug": "zero-framework", "name": "零框架"},
    {"slug": "desktop-app", "name": "桌面应用"},
]

# 文章正文里必须出现的关键数字/标识，用来兜住「正文被改坏了」这类事故。
EXPECTED_FIGURES = [
    "NanoBrowser",
    "nanobrowser.exe",
    "nanoagent.exe",
    "4.52 MB",
    "4.24 MB",
    "2.12.4",
    "0.57.0",
    "0.39.1",
    "0.62.2",
    "opt-level = \"s\"",
    "panic = \"abort\"",
    "withGlobalTauri",
    "ICoreWebView2::CallDevToolsProtocolMethod",
    "AtomicU64",
    "Condvar",
    "GetDevToolsProtocolEventReceiver",
    "tab-<id>",
    "shell_h",
    "STRIP_H",
    "SetWindowPos",
    "SWP_NOACTIVATE",
    "create_new",
    "unique_path",
    "ZOOM_STEPS",
    "Sec-WebSocket-Key",
    "101 Switching Protocols",
    "16384",
    "25 毫秒",
    "70 KB",
    "MIN_H",
    "DEFAULT_H",
    "MIN_W",
    "DEFAULT_W",
    "split_geometry",
    "clamp_axis",
    "devtools://devtools/bundled/inspector.html",
    "#nanoSide",
    "nano-dt.invalid",
    "NewWindowResponse::Deny",
    "Schema.getDomains",
    "startScreencast",
    "Input.dispatchMouseEvent",
    "Input.insertText",
    "Page.captureScreenshot",
    "600",
    "50",
    "nanobrowser-agent",
    "browser_navigate",
    "browser_traffic",
    "browser_eval",
    "JSON-RPC 2.0",
    "MAX_BODY",
    "4096",
    "MAX_VALUE",
    "MAX_ENTRIES",
    "requestId",
    "24 位十六进制",
    "new_token()",
    "tab_id_by_token",
    "tab-remote",
    "core:event:allow-emit",
    "nano://newtab",
    "NANO_DATA_DIR",
    "NANOBROWSER_AGENT_DIR",
    "NANOBROWSER_DATA_DIR",
    "profile.json",
    ".profile.tmp",
    "nanoagent --mcp",
    "rsproxy",
    "favicon_for",
    "parse_input",
    "looks_like_url",
    "suppressClick",
    "resolvedDark()",
]

# 本文不含动画占位符（技术深挖文，不是算法推演文）。
VIZ_PLACEHOLDER_CLASSES = []

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
            f"TOC bug detected: {len(bad)} list item(s) start with `- <number>`.\n"
            "  Markdown renders these as nested <ol> starting at 1 for every entry.\n"
            "  Remove the manual numbers and use a flat `- ` list."
        )
    print("  TOC check: OK (no `- <n>.` numbering)")


def check_viz(content):
    """Placeholders (if any) must survive markdown + bleach, and code blocks must stay clean."""
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

    missing = [c for c in VIZ_PLACEHOLDER_CLASSES if c not in cleaned]
    if missing:
        raise SystemExit(
            f"Animation placeholder(s) did NOT survive the pipeline: {missing}\n"
            f"  In source: "
            f"{ {c: content.count(c) for c in VIZ_PLACEHOLDER_CLASSES} }\n"
            f"  After bleach: { {c: cleaned.count(c) for c in VIZ_PLACEHOLDER_CLASSES} }\n"
            "  The page would render fine but WITHOUT that animation — silent loss.\n"
            "  Check that each div is on its own line surrounded by blank lines, and\n"
            "  that the class attribute is not being stripped."
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

    if re.search(r"\*\*", cleaned):
        raise SystemExit("Rendered HTML still contains a bare `**` — unbalanced bold.")

    print(
        f"  viz check: OK ({len(VIZ_PLACEHOLDER_CLASSES)} placeholders survived; "
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
            "  This cover is a repo-native PNG, so a failure here means the asset\n"
            "  has not been deployed yet. Deploy photos/nanobrowser-cover.png first,\n"
            "  then re-run this script (it is idempotent by slug)."
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
