"""Publish the five project deep-dive articles.

Usage:
    backend/venv/Scripts/python.exe tools/publish_project_articles.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_project_articles.py

Idempotent by slug: existing articles are updated instead of duplicated.

Order matters only for the two-stage cover flow: covers live in this repo
(``tools/make_project_covers.py`` -> ``frontend/public/photos/`` + ``photos/``),
so they must be DEPLOYED before this script runs, or the cover-reachability
check fails. After publishing, rebuild the frontend so the article pages and
topic listing are prerendered.
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

# 与 backend/articles/models.py 逐字一致
MARKDOWN_EXTENSIONS = ["fenced_code", "codehilite", "tables", "extra", "toc"]

ARTICLES = [
    {
        "slug": "nanoss-windows-ssh-client",
        "title": "NanoSSH：13 MB 的 Windows SSH 客户端怎么做",
        "excerpt": (
            "NanoSSH 用 Go + Wails 把 SSH 客户端压进一个 13.23 MB 的单文件 exe："
            "终端字节全程 []byte 直通，靠 16 KiB / 8 ms / 30 s 的 ack 闭环做端到端反压，"
            "known_hosts 走 TOFU 三档信任，凭据交给 Windows 凭据管理器。本文按十二个真实"
            "问题拆实现：base64 事件桥与 README 的出入、汉字跨块变 U+FFFD、PTY 宽高顺序、"
            "ssh-agent 命名管道、托盘无响应、14 MB 体积红线与高 DPI 闪烁。"
        ),
        "tags": [
            {"slug": "go", "name": "Go"},
            {"slug": "wails", "name": "Wails"},
            {"slug": "ssh", "name": "SSH"},
            {"slug": "desktop-app", "name": "桌面应用"},
            {"slug": "networking", "name": "网络"},
        ],
        "figures": [
            "13.23 MB", "14 MB", "16 KiB", "8 毫秒", "30 秒",
            "AckTermData", "pumpSession", "chunks", "known_hosts", "TOFU",
            "凭据管理器", "ssh-agent", "U+FFFD", "32 KiB", "8 MiB", "Mica", "0x8664",
        ],
    },
    {
        "slug": "micromd-3mb-markdown-reader",
        "title": "micromd：3 MB 的单文件 Markdown 阅读器",
        "excerpt": (
            "MicroMD 把 3.17 MiB 的 exe、零依赖的 HTML 界面和一个手写 Markdown 解析器装进"
            "同一个进程。它不打包 Chromium，直接驱动系统 WebView2；界面先落到 LOCALAPPDATA"
            "再以 file:// 导航；原生与 JS 之间只留三个绑定；解析器用两遍式同时守住转义与"
            "占位符。文章也逐个交代七个没完全解决的问题：大文件只降频、草稿配额空 catch、"
            "保存语义错位、没有文件监听与最近文件。"
        ),
        "tags": [
            {"slug": "go", "name": "Go"},
            {"slug": "webview2", "name": "WebView2"},
            {"slug": "markdown", "name": "Markdown"},
            {"slug": "desktop-app", "name": "桌面应用"},
            {"slug": "single-file", "name": "单文件"},
        ],
        "figures": [
            "3.17 MiB", "3,323,392", "4,943,872", "29,520", "LOCALAPPDATA",
            "file://", "BIG_DOC", "200000", "150ms", "MAX_DRAFT", "go-winres",
            "WebView2Loader.dll", "134 KB", "两遍",
        ],
    },
    {
        "slug": "interviewatlas-daily-crawl-llm-analysis",
        "title": "InterviewAtlas：3 万条面经的自动采集与 LLM 归纳",
        "excerpt": (
            "InterviewAtlas 用一条 GitHub Actions 流水线，把三个站点的面经变成 41,771 条"
            "结构化记录、157 家公司的可查询数据集。难点不在写爬虫，而在把增量判断做在请求"
            "之前、把落盘做成幂等、把模型调用做成可预算可缓存的两阶段 map-reduce。文章复盘"
            "两处静默失败：面试鸭的假成功，以及 Python 3.11 f-string 挡在编译期的分析链。"
        ),
        "tags": [
            {"slug": "python", "name": "Python"},
            {"slug": "github-actions", "name": "GitHub Actions"},
            {"slug": "llm", "name": "LLM"},
            {"slug": "crawler", "name": "爬虫"},
            {"slug": "data-pipeline", "name": "数据管道"},
        ],
        "figures": [
            "41,771", "157", "1,634", "158", "1,791", "35.9 MB", "92.3 MB",
            "known_urls", "manifest", "map-reduce", "GitHub Actions", "0/237",
            "Python 3.11", "f-string", "567",
        ],
    },
    {
        "slug": "nanoapi-wails-http-client",
        "title": "NanoAPI：用 Go + Wails 造一个够用的 Postman",
        "excerpt": (
            "NanoAPI 的取舍是「复用系统 WebView2 + 自建最小 HTTP 引擎 + 单 JSON 存储」，"
            "前端零 npm、直接 go:embed 进二进制，发布产物 10.8 MiB。真正难的不是把请求发出去，"
            "而是把超时、重定向、Windows 路径、multipart 边界和落盘可靠性逐一对齐：变量插值"
            "三层封顶、响应读 20 MB + 1 字节判截断、网络错误写进 Result.Error、存储走临时文件"
            "→ fsync → rename。"
        ),
        "tags": [
            {"slug": "go", "name": "Go"},
            {"slug": "wails", "name": "Wails"},
            {"slug": "http", "name": "HTTP"},
            {"slug": "curl", "name": "cURL"},
            {"slug": "desktop-app", "name": "桌面应用"},
        ],
        "figures": [
            "10.8 MiB", "11,341,824", "v2.17.0", "nanoapi-bundle", "20 MB",
            "50 MB", "Result.Error", "ErrorKind", "resolveRequest", "buildBody",
            "cookiejar", "RFC 5987", "200", "三层",
        ],
    },
    {
        "slug": "z-bot-local-first-ai-assistant",
        "title": "Z Bot：本地优先的私人 AI 助理怎么搭",
        "excerpt": (
            "Z Bot 的核心不是「接一个大模型」，而是把模型关进一个由主进程管理的盒子里："
            "数据库、密钥、工具执行和系统能力都留在主进程，Renderer 只有一层白名单 API；"
            "有副作用的动作先拿权限，拒绝变成工具结果而不是异常；记忆先用 SQLite FTS5 与"
            "trigram，不上向量库；上下文 72k 字符、Agent 20 步 / 30 工具 / 5 分钟、提醒定时器"
            "24.8 天，全部是写死的可审查上限。"
        ),
        "tags": [
            {"slug": "electron", "name": "Electron"},
            {"slug": "typescript", "name": "TypeScript"},
            {"slug": "agent", "name": "Agent"},
            {"slug": "sqlite", "name": "SQLite"},
            {"slug": "desktop-app", "name": "桌面应用"},
        ],
        "figures": [
            "Electron", "React 19", "node:sqlite", "FTS5", "72,000", "8,000",
            "20,000", "24,000", "Zod", "zbot-media://attachment/", "realpath",
            "64", "bm25", "setTimeout", "2_147_000_000", "AbortController",
            "32 个单测", "2 个 E2E",
        ],
    },
]


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


def resolve_tags(by_slug, by_name, tag):
    if tag["slug"] in by_slug:
        print(f"  tag {tag['name']}: reused slug {tag['slug']} (id={by_slug[tag['slug']]})")
        return by_slug[tag["slug"]]
    if tag["name"] in by_name:
        print(f"  tag {tag['name']}: reused name -> id={by_name[tag['name']]}")
        return by_name[tag["name"]]
    created = api("POST", "/admin/tags/", tag)
    if created:
        print(f"  tag {tag['name']}: created id={created['id']}")
        by_slug[tag["slug"]] = created["id"]
        return created["id"]
    return None


def _reexec_with_markdown():
    """Re-run under an interpreter that has `markdown` installed."""
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
        "Refusing to publish: no interpreter with `markdown` found, so the "
        "code-block guards cannot run.\n  Use backend/venv/Scripts/python.exe."
    )


def check_toc(content, slug):
    """Guard against the `- 1. xxx` markdown bug that renders every TOC entry as 1."""
    bad = re.findall(r"^- \d+\.", content, flags=re.M)
    if bad:
        raise SystemExit(
            f"[{slug}] TOC bug: {len(bad)} list item(s) start with `- <number>`.\n"
            "  Remove the manual numbers and use a flat `- ` list."
        )

    toc_block = content.split("**目录**", 1)
    if len(toc_block) != 2:
        raise SystemExit(f"[{slug}] 找不到 **目录** 块")
    toc_lines = []
    started = False
    for line in toc_block[1].splitlines():
        if line.startswith("- "):
            toc_lines.append(line[2:].strip())
            started = True
        elif started:
            break
    if toc_lines:
        headings = [
            line[3:].strip()
            for line in content.splitlines()
            if line.startswith("## ")
        ]
        if toc_lines != headings:
            raise SystemExit(
                f"[{slug}] 目录与 H2 不一致：\n  toc={toc_lines}\n  h2={headings}"
            )

    print(f"  TOC check: OK ({len(toc_lines)} entries, no manual numbering)")


def check_viz(content, slug):
    """Code-block emphasis pollution and a bare `**` must not reach the renderer."""
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

    polluted = 0
    for block in re.findall(r"<pre\b[^>]*>.*?</pre>", cleaned, flags=re.DOTALL):
        polluted += len(re.findall(r"</?(?:em|strong)\b", block))
    if polluted:
        raise SystemExit(
            f"[{slug}] Code blocks contain {polluted} <em>/<strong> tag(s) — "
            "markdown emphasis mangled the source."
        )

    # `**` inside a <pre> is legitimate code (e.g. JS exponentiation); only
    # a bare `**` in prose means unbalanced bold in the source.
    prose = re.sub(r"<pre\b[^>]*>.*?</pre>", "", cleaned, flags=re.DOTALL)
    if re.search(r"\*\*", prose):
        raise SystemExit(f"[{slug}] Rendered prose still contains a bare `**`.")

    print(f"  viz check: OK ({len(re.findall('<pre', cleaned))} code blocks clean)")


def check_numbers(content, article):
    missing = [e for e in article["figures"] if e not in content]
    if missing:
        raise SystemExit(f"[{article['slug']}] Number check failed — not found: {missing}")
    print(f"  number check: OK ({len(article['figures'])} figures present)")


def publish(article, category, tag_ids, cover):
    content = strip_frontmatter((ROOT / "article" / f"{article['slug']}.md")
                                .read_text(encoding="utf-8"))
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
        "tags_ids": tag_ids,
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
        raise SystemExit(f"[{article['slug']}] API request failed.")
    print(f"  {action}: id={result.get('id')} slug={result.get('slug', article['slug'])}")
    print(f"  cover: {result.get('cover_image')}")
    print(f"  live: https://zhoujungis.github.io/article/{article['slug']}/")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true",
                        help="只做本地校验（frontmatter/目录/代码块/数字/封面），不碰 API")
    parser.add_argument("--skip-cover-check", action="store_true")
    parser.add_argument("--only", help="只发布指定 slug")
    args = parser.parse_args()

    _reexec_with_markdown()

    if args.dry_run:
        for article in ARTICLES:
            if args.only and article["slug"] != args.only:
                continue
            cover = f"https://zhoujungis.github.io/photos/{article['slug']}-cover.png"
            publish_preview(article, cover, args.skip_cover_check)
        print("\n--dry-run: local checks passed, no API calls made.")
        return

    category = category_id()
    if category is None:
        raise SystemExit("No project category could be resolved; aborting.")

    existing_tags = paginated("/tags/")
    by_slug = {item["slug"]: item["id"] for item in existing_tags}
    by_name = {item["name"]: item["id"] for item in existing_tags}

    for article in ARTICLES:
        if args.only and article["slug"] != args.only:
            continue
        cover = f"https://zhoujungis.github.io/photos/{article['slug']}-cover.png"
        print(f"\nCover: {cover}")
        if not args.skip_cover_check and not cover_is_live(cover):
            raise SystemExit(
                f"Cover URL not reachable for {article['slug']}.\n"
                "  Deploy photos/<slug>-cover.png first, then re-run (idempotent by slug)."
            )
        tag_ids = []
        for tag in article["tags"]:
            tag_id = resolve_tags(by_slug, by_name, tag)
            if tag_id:
                tag_ids.append(tag_id)
        if not tag_ids:
            raise SystemExit(f"[{article['slug']}] No tags resolved; aborting.")
        publish(article, category, tag_ids, cover)


def publish_preview(article, cover, skip_cover_check):
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
    print(f"  cover: {cover}")
    if not skip_cover_check and not cover_is_live(cover):
        raise SystemExit(f"Cover URL is not reachable: {cover}")


if __name__ == "__main__":
    main()
