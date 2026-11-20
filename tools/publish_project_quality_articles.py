"""Publish the NanoQA and Routewise AI project articles.

Usage:
    backend/venv/Scripts/python.exe tools/publish_project_quality_articles.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_project_quality_articles.py --skip-cover-check

Idempotent by slug: existing articles are updated, not duplicated.

Covers live in this repo (``tools/make_nanoqa_cover.py`` and
``tools/make_routewise_cover.py`` -> ``frontend/public/photos/`` + ``photos/``).
Deploy them before the default (cover-checked) run; while deploying, use
``--skip-cover-check`` because the PNG is not live yet. After the deploy, run
again without the flag so the same script proves the cover is reachable.

Both articles are grounded in the real repositories and in two local benchmarks
committed alongside them:
  - tools/bench_nanoqa_duplicates.py      -> tools/bench_nanoqa_duplicates_output.txt
  - tools/bench_routewise_geo.mjs         -> tools/bench_routewise_geo_output.txt
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

for stream in (sys.stdout, sys.stderr):
    try:
        stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

CATEGORY = {
    "name": "项目实战",
    "slug": "projects",
    "description": "从零实现：桌面应用、数据流水线与本地 Agent",
}

MARKDOWN_EXTENSIONS = ["fenced_code", "codehilite", "tables", "extra", "toc"]

ARTICLES = [
    {
        "slug": "nanoqa-versioned-quality-loop",
        "title": "NanoQA：一套测试管理系统的四道硬边界",
        "excerpt": (
            "NanoQA 有 26 个模型、67 条路由、232 条后端测试。真正难的不是把 Excel 搬进网页，"
            "而是四条约束：用例版本化、执行结果绑定版本快照、并发编辑检测冲突、审计与业务写入同事务。"
            "代价也清楚：权限不做缓存所以每次请求多两次查询，重复检测是 O(n²) 的 800 条要跑 55.5 秒，"
            "AI 目前只有离线 Mock。"
        ),
        "tags": [
            {"slug": "django", "name": "Django"},
            {"slug": "drf", "name": "DRF"},
            {"slug": "vue", "name": "Vue"},
            {"slug": "architecture", "name": "架构"},
            {"slug": "database", "name": "数据库"},
        ],
        "figures": [
            "26 个模型", "67 条", "73 个", "232 条", "12,132", "17,395",
            "39 个", "55 个", "19 个", "36 个",
            "TestCaseVersion", "current_version", "test_case_version",
            "select_for_update", "NumberSequence", "SoftDeleteModel",
            "AuditService", "40002", "40003", "40004", "40007",
            "188 ms", "98 ms", "186 ms", "171 ms", "65 ms",
            "4,950", "19,900", "79,800", "319,600",
            "0.682", "3.887", "18.314", "55.534",
            "1,279,200", "198.5 s", "310.3 s", "1939.8 s",
            "content_changed", "27 个",
        ],
    },
    {
        "slug": "routewise-ai-geo-constrained-itinerary",
        "title": "Routewise AI：让模型吐出一份能落在地图上的行程",
        "excerpt": (
            "Routewise AI 让 gpt-5.6-luna 输出可直接画在真实地图上的行程。做法不是更好的提示词，"
            "而是四层约束叠起来：服务端固定城市排期、按 4 天切块并行请求、强制 JSON 并逐日做四类地理校验、"
            "失败时把拒绝原因塞回提示词重试一次。整条后端 1,101 行 TypeScript，没有服务器。"
            "代价明确：校验器只认距离不认语义，22–25 公里是折返规则的盲区。"
        ),
        "tags": [
            {"slug": "cloudflare", "name": "Cloudflare"},
            {"slug": "typescript", "name": "TypeScript"},
            {"slug": "llm", "name": "LLM"},
            {"slug": "realtime", "name": "实时"},
            {"slug": "frontend-architecture", "name": "前端架构"},
        ],
        "figures": [
            "1,101", "2,283", "28 个", "251 个", "491 行",
            "gpt-5.6-luna", "18_000", "210 秒", "1.2 秒", "30 秒",
            "15 km", "22 km", "6 km", "2.2", "25",
            "MAX_SAME_AREA_LEG_KM", "distanceKm", "routeDistance",
            "geographicIssues", "buildCitySchedule", "minimumSpanningTreeDistance",
            "3.3 km", "23.4 km", "26.1 km", "370.3 km", "14.1 km", "7.4 km",
            "1.08", "2.47", "2.45", "1.00", "1.91",
            "0.078 ms", "0.004 ms", "0.002 ms",
            "10 积分", "8 次", "PBKDF2",
            "enableChunked", "onChunkReceived", "waitUntil", "x-accel-buffering",
        ],
    },
]

COVER_BASE = "https://blog.zhoujun.dev/photos"
SITE_ORIGIN = "https://blog.zhoujun.dev"


def strip_frontmatter(md: str) -> str:
    return re.sub(r"^---\n.*?\n---\n", "", md, flags=re.S).strip()


def api(method, path, data=None):
    request = urllib.request.Request(f"{API}{path}", method=method)
    request.add_header("Content-Type", "application/json")
    request.add_header("Authorization", f"Bearer {get_token()}")
    if data is not None:
        request.data = json.dumps(data, ensure_ascii=False).encode("utf-8")
    try:
        with urllib.request.urlopen(request, timeout=180) as response:
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


def check_reading_time(content, slug, minimum=30):
    """Mirror frontend/src/utils/readingTime.js: code blocks are stripped first."""
    prose = re.sub(r"```[\s\S]*?```", "", content)
    prose = re.sub(r"`[^`]*`", "", prose)
    prose = re.sub(r"!\[.*?\]\(.*?\)", "", prose)
    prose = re.sub(r"\[([^\]]*)\]\(.*?\)", r"\1", prose)
    prose = re.sub(r"[#*>`~\-+|_:]", " ", prose)
    chinese = len(re.findall(r"[\u4e00-\u9fff\u3400-\u4dbf]", prose))
    english = len(re.findall(r"[a-zA-Z]+", prose))
    minutes = max(1, -(-(chinese + english) // 250))
    if minutes < minimum:
        raise SystemExit(
            f"[{slug}] reading time {minutes} min is below the {minimum} min floor "
            f"(prose units {chinese + english})"
        )
    print(f"  reading time: OK ({minutes} min, {chinese + english} prose units)")
    return minutes


def publish(article, category, tags, cover):
    source = ROOT / "article" / f"{article['slug']}.md"
    if not source.exists():
        raise SystemExit(f"Source Markdown not found: {source}")
    content = strip_frontmatter(source.read_text(encoding="utf-8"))
    print(f"\n== {article['slug']} ({len(content)} chars)")

    check_toc(content, article["slug"])
    check_viz(content, article["slug"])
    check_numbers(content, article)
    check_reading_time(content, article["slug"])

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
            absolute = f"{SITE_ORIGIN}{url}" if url.startswith("/") else url
            print(f"Cover {slug}: {absolute}")
            if not cover_is_live(absolute):
                raise SystemExit(
                    f"Cover not reachable: {absolute}\n"
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
            check_reading_time(content, article["slug"])
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
