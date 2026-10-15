"""Publish the REA (Reverse Engineer Anything) article.

Usage:
    backend/venv/Scripts/python.exe tools/publish_rea_article.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_rea_article.py

Idempotent by slug: an existing article is updated instead of duplicated.

Source Markdown: ``article/rea-reverse-engineer-anything.md``.

No animation in this one (it is a technology deep-dive, not an algorithm
walkthrough), so the placeholder guard list is empty and only the general
guards run: TOC numbering, code-block emphasis pollution, unbalanced bold,
and the headline-figure check.

Spine claims guarded by the number check:
- REA = Reverse Engineer Anything, repo ``morluto/rea``, site rea.tools;
  it is an MCP server + CLI, NOT a decompiler -- it orchestrates Hopper /
  Ghidra / IDA and returns Evidence;
- the hype numbers: 1,373 new stars on Oct 4 climbing to 31,255 on Oct 11,
  11.5 万 stars on Oct 12, 15.7 万 on Oct 13 (snapshots differ by source);
- three-layer structure: contract layer (one kernel, two entry points),
  provider bridge (authenticated local socket to headless Ghidra, Hopper
  launched on demand, JEB via REA_JEB_MCP_URL), engine layer;
- Evidence anatomy: normalized_result / evidence_id / raw_result /
  mandatory analysis_profile; unknown ledger; call graph never implies
  "no calls" from an empty list plus partial coverage;
- lossless parsing: har-schema@2.0.0 + lossless-json@4.3.1 pinned,
  numeric_literals, binary_fields, "missing != empty";
- redaction writes null, never a replacement marker;
- api-surface inference: numeric/uuid/hex/iso-date segment rules, read on
  the still-encoded path BEFORE WHATWG dot-segment removal, so
  /a/%2e%2e/admin stays different from /admin;
- budgets: 32 MiB / 96 MiB / 64 levels, 192 MiB old-gen heap, Windows
  Job Object 704 MiB, 10 MiB MCP receive buffer, REA_MCP_MAX_RESPONSE_BYTES;
- prompt-injection stance: target text is data; the untrusted_content
  marker ships on success AND failure, driven by returnsTargetContent.

Cover check: the cover is a site-hosted PNG (frontend/public/photos/ +
photos/), so it must be deployed BEFORE publishing -- standard two-stage
order: deploy the PNG, re-run this script (idempotent by slug, so id=109 is
updated), then build + deploy again to refresh the page / articles.json /
rss.xml.
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
    / "rea-reverse-engineer-anything.md"
)

ARTICLE_TITLE = "一周 15 万 Star 的 REA：让 Agent 逆向一切的开源 MCP Server"
ARTICLE_SLUG = "rea-reverse-engineer-anything"
ARTICLE_EXCERPT = (
    "REA（Reverse Engineer Anything）是 2026 年 10 月第一周霸榜 GitHub Trending "
    "的开源项目：一个把 Hopper / Ghidra / IDA 编排给编程助手的 MCP 服务器 + CLI。"
    "它不是反编译器，核心资产是那套可追溯的证据模型——每条结论都要挂上产物摘要、"
    "字节区间或 JSON 指针，模型没查清的部分必须显式记为「残留未知项」。本文拆解它"
    "的三层架构（契约层 / provider 桥 / 引擎层）、无损解析与零改写脱敏、抓包到路径"
    "模板的推断算法、资源预算与快照生命周期，以及「把目标里的文字当数据」这条提示"
    "注入防线，并给出能力矩阵、四个官方案例、六条避坑清单，以及「软件壁垒还剩几层」"
    "的判断。"
)
# 站内自制封面（tools/make_rea_cover.py，双份落盘），必须先部署才能通过封面可达性检查。
ARTICLE_COVER = "https://zhoujungis.github.io/photos/rea-cover.png"

CATEGORY = {
    "name": "科技前沿",
    "slug": "tech-frontier",
    "description": "前沿技术与未来趋势观察",
}

TAGS = [
    {"slug": "rea", "name": "REA"},
    {"slug": "mcp", "name": "MCP"},
    {"slug": "reverse-engineering", "name": "逆向工程"},
    {"slug": "agent", "name": "Agent"},
    {"slug": "open-source", "name": "开源"},
    {"slug": "security", "name": "安全"},
]

# 文章正文里必须出现的关键数字/标识，用来兜住「正文被改坏了」这类事故。
EXPECTED_FIGURES = [
    "Reverse Engineer Anything",
    "morluto/rea",
    "rea.tools",
    "MCP",
    "1,373",
    "31,255",
    "11.5 万 Star",
    "15.7 万",
    "always-bump-minor",
    "incomplete evidence never implies equivalence",
    "normalized_result",
    "evidence_id",
    "raw_result",
    "analysis_profile",
    "residual_unknowns",
    "har-schema@2.0.0",
    "lossless-json@4.3.1",
    "numeric_literals",
    "binary_fields",
    "sensitive_values",
    "sensitive_values_unretained",
    "{numeric}",
    "{uuid}",
    "{hex}",
    "{iso-date}",
    "url-redacted",
    "url-unparseable",
    "/a/%2e%2e/admin",
    "REA_MCP_MAX_RESPONSE_BYTES",
    "REA_JEB_MCP_URL",
    "REA_ANALYSIS_PROVIDER",
    "REA_GHIDRA_STARTUP_TIMEOUT_MS",
    "192 MiB",
    "704 MiB",
    "artifact_changed",
    "untrusted_content",
    "returnsTargetContent",
    "npx rea-agents setup",
    "3,205",
    "DX-Ball",
    "Chrome 小恐龙",
    "Notion",
    "JEB",
    "Apidog",
    "软件壁垒分五层",
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
            "  This cover is an external URL, so a failure here means the host\n"
            "  is blocking us (or the asset is gone). Re-check the URL, or pass\n"
            "  --skip-cover-check if you are certain the same deploy carries it."
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
