"""Publish "Agent 提示注入：谁说的话算指令".

Usage:
    backend/venv/Scripts/python.exe tools/publish_agent_prompt_injection_article.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_agent_prompt_injection_article.py

Idempotent by slug: an existing article is updated instead of duplicated.

Source Markdown: ``article/agent-prompt-injection-boundary.md``.

Technical deep-dive (no animations), so ``VIZ_PLACEHOLDER_CLASSES`` is empty:
the guards cover TOC numbering, code-block emphasis pollution, a bare ``**``,
headline figures, and cover reachability.

Cover: ``tools/make_agent_prompt_injection_cover.py`` writes the same PNG to both
``frontend/public/photos/`` and ``photos/``. Because the cover is repo-native it
must be DEPLOYED before this script runs; standard two-stage order: deploy the
PNG, run this script, then build + deploy again.
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
    / "agent-prompt-injection-boundary.md"
)

ARTICLE_TITLE = "Agent 提示注入：谁说的话算指令"
ARTICLE_SLUG = "agent-prompt-injection-boundary"
ARTICLE_EXCERPT = (
    "提示注入不是「模型被骗」，而是「一段数据被放进了指令该在的位置」。"
    "本文把这句话拆成三个可检查的位置：system 里的项目文件、role 为 tool 的工具输出、"
    "跨会话注入的记忆块；再逐条回源码核对 NanoHermes 的闸门立在哪一层——"
    "命令白名单只认程序不认参数，读文件没有边界，默认 auto_approve 让最严的审批策略失效。"
)
ARTICLE_COVER = "https://zhoujungis.github.io/photos/agent-prompt-injection-cover.png"

CATEGORY = {
    "name": "AI编程",
    "slug": "ai-coding",
    "description": "AI 编程工具、Agent 工程与模型应用实践",
}

TAGS = [
    {"slug": "agent", "name": "Agent"},
    {"slug": "agent-engineering", "name": "Agent 工程"},
    {"slug": "security", "name": "安全"},
    {"slug": "architecture", "name": "架构设计"},
]

# 正文里必须出现的关键数字/标识，用来兜住「正文被改坏了」这类事故。
# 注意：frontmatter 会被 strip_frontmatter 剥掉，所以标题词不能放进来。
EXPECTED_FIGURES = [
    # 数据结构与函数
    "system_prompt",
    "prompt::project_docs",
    "read_head",
    "MAX_PROJECT_DOCS",
    "read_to_string",
    "NANOHERMES.md",
    "AGENTS.md",
    "set_memory_block",
    "retrieve_block",
    "render_block",
    "excerpt_from",
    "worth_distilling",
    "had_tools",
    "mcp_get_prompt",
    "set_block",
    "compact_with",
    "summarize_messages",
    "insert(1",
    # 动作侧
    "needs_approval",
    "is_trusted_command",
    "TRUSTED_BINARIES",
    "TRUSTED_GIT_SUBCOMMANDS",
    "git_subcommand_is_read_only",
    "--config-env",
    "--output",
    "CONFIRM_LOCK",
    "check_write",
    "canonical_with_missing",
    "WorkspaceWrite",
    "SandboxMode::ReadOnly",
    "resolve",
    "MAX_FILE_BYTES",
    # 出口侧
    "validate_target",
    "is_forbidden_ip",
    "ToSocketAddrs",
    "web_fetch",
    "web_search",
    "redirects(0)",
    "EGRESS_ALLOW",
    # 结构侧
    "allowed_tools",
    "run_subagent_inner",
    "def.prompt",
    "check_tool",
    "blocked_tools",
    "build_tools",
    "PreToolUse",
    "PostToolUse",
    # 数字
    "20000 字符",
    "64 KB",
    "4 MB",
    "5 MB",
    "500 条",
    "2.39",
    "169.254.169.254",
    "100.64/10",
    "90%",
    # 关键表述
    "三道边界",
    "完整链路",
    "位置就是权限",
    "洗白路径",
    "来源信封",
    "能力边界",
    "出站白名单",
    "fail-closed",
    "四字段",
    "分层防御表",
    "五个可执行的思想实验",
    "越权率",
    "泄漏率",
    "持久化污染率",
    "五个常见误区",
    "小结：三句话",
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
        raise SystemExit(f"Animation placeholder(s) did NOT survive the pipeline: {missing}")

    # Code blocks must not be touched by markdown emphasis rules.
    polluted = 0
    for block in re.findall(r"<pre\b[^>]*>.*?</pre>", cleaned, flags=re.DOTALL):
        polluted += len(re.findall(r"</?(?:em|strong)\b", block))
    if polluted:
        raise SystemExit(
            f"Code blocks contain {polluted} <em>/<strong> tag(s) — markdown emphasis "
            "mangled the source. Usually a non-intraword `_` pair or a bare `*`."
        )

    # `**` is legal inside inline code (e.g. a glob pattern `src/**/*.ts`), so
    # only prose outside <pre>/<code> is checked for unbalanced bold.
    prose = re.sub(r"<pre\b[^>]*>.*?</pre>", "", cleaned, flags=re.DOTALL)
    prose = re.sub(r"<code\b[^>]*>.*?</code>", "", prose, flags=re.DOTALL)
    if re.search(r"\*\*", prose):
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
            "  has not been deployed yet. Deploy photos/agent-prompt-injection-cover.png\n"
            "  first, then re-run this script (it is idempotent by slug)."
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
