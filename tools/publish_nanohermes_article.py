"""Publish the NanoHermes deep-dive article.

Usage:
    backend/venv/Scripts/python.exe tools/publish_nanohermes_article.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_nanohermes_article.py

Idempotent by slug: an existing article is updated instead of duplicated.

Source Markdown: ``article/nanohermes-rust-coding-agent.md``.

This is a technical deep-dive (no animations), so ``VIZ_PLACEHOLDER_CLASSES``
is empty: the file guards TOC numbering, code-block emphasis pollution, a bare
``**`` and the headline figures only.

Cover: a repo-native PNG (``tools/make_nanohermes_cover.py``, written to both
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
    / "nanohermes-rust-coding-agent.md"
)

ARTICLE_TITLE = (
    "NanoHermes 拆解：一个不依赖 async 运行时的 Rust 终端编码 Agent"
)
ARTICLE_SLUG = "nanohermes-rust-coding-agent"
ARTICLE_EXCERPT = (
    "NanoHermes 是一个 Rust 写的轻量 coding agent：单二进制、常驻内存主要跟上下文"
    "长度相关，同一套代码同时是 CLI/REPL、Tauri 桌面应用和可部署的 HTTP daemon。"
    "它的技术密度不在功能清单，而在三条约束纪律——没有 async 运行时（阻塞 ureq + "
    "作用域线程并发）、只依赖三个 crate（连 libc 都不用，Landlock 与 SIGINT 接管"
    "走自己写的裸系统调用 shim）、所有输出都有上限（工具结果 20 KB、命令输出每路 "
    "256 KB、读文件 4 MB 硬拒）。本文逐层拆开：Agent::run 主循环与步骤边界中断、"
    "并发工具调用按序回收、12 万字符触发的上下文压缩、零依赖的中文 BM25 记忆、"
    "MCP 的 stdio 与 streamable-HTTP 双传输、Skills 渐进式披露、子代理任务板与 "
    "Condvar 门控、钩子一票否决、Landlock 沙箱与三级审批、Ctrl-C 标志位与 /undo，"
    "以及 Tauri 四栏外壳的流式隔离与 daemon 部署。"
)
# 站内自制封面（tools/make_nanohermes_cover.py，双份落盘），必须先部署才能通过封面可达性检查。
ARTICLE_COVER = "https://zhoujungis.github.io/photos/nanohermes-cover.png"

CATEGORY = {
    "name": "项目实践",
    "slug": "project-practice",
    "description": "动手做过的项目与工程复盘",
}

TAGS = [
    {"slug": "rust", "name": "Rust"},
    {"slug": "agent", "name": "Agent"},
    {"slug": "mcp", "name": "MCP"},
    {"slug": "tauri", "name": "Tauri"},
    {"slug": "desktop-app", "name": "桌面应用"},
]

# 文章正文里必须出现的关键数字/标识，用来兜住「正文被改坏了」这类事故。
EXPECTED_FIGURES = [
    "NanoHermes",
    "agent --daemon",
    "opt-level = \"z\"",
    "panic = \"abort\"",
    "serde_json",
    "ureq",
    "base64",
    "withGlobalTauri",
    "decorations: false",
    "target/release/agent",
    "CONTEXT_CHAR_BUDGET",
    "120_000",
    "KEEP_RECENT",
    "12 万字符",
    "MAX_PARALLEL_SUBAGENTS",
    "4 个并发",
    "RESULT_PREVIEW",
    "500",
    "HOOK_TIMEOUT_SECS",
    "30 秒",
    "MAX_BODY_CHARS",
    "20 KB",
    "256 KB",
    "4 MB",
    "2 MB",
    "200 条",
    "500 个文件",
    "50 项",
    "k1 = 1.2",
    "b = 0.75",
    "windows(2)",
    "content",
    "Content-Length",
    "Mcp-Session-Id",
    "2024-11-05",
    "Accept: application/json, text/event-stream",
    "mcp_list_resources",
    "mcp_get_prompt",
    "SKILL.md",
    ".nanohermes",
    "PreToolUse",
    "PostToolUse",
    "NANOHERMES_TOOL_NAME",
    "NANOHERMES_HOOK_EVENT",
    "Condvar",
    "GateGuard",
    "std::thread::scope",
    "tool_call_id",
    "untrusted",
    "on-request",
    "Landlock",
    "pre_exec",
    "SIG_DFL",
    "nanohermes_sigrestorer",
    "mov rax, 15",
    "SIGINT",
    "/undo",
    "/compact",
    "X-Session-Id",
    "8787",
    "NoNewPrivileges",
    "ProtectSystem=strict",
    "ReadWritePaths",
    "deploy-debian.sh",
    "nanohermes://delta|tool|note|usage",
    "40 毫秒",
    "spawn_blocking",
    "get_settings",
    "stop_task",
    "App.e2e.test.tsx",
    "e2e_mock_llm.rs",
    "mock_mcp_server.py",
    "cargo test",
    "read_capped",
    "interrupt::take()",
    "compact_with",
    "retrieve_block",
    "set_memory_block",
    "is_trusted_command",
    "TRUSTED_BINARIES",
    "git_subcommand_is_read_only",
    "read_ndjson",
    "cloud_read_stream",
    "1024 px",
    "12 MB",
    "MIT",
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
            "  has not been deployed yet. Deploy photos/nanohermes-cover.png first,\n"
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
