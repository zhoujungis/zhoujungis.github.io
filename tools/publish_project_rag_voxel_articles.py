"""Publish the ShuGe RAG and Block World 3D project articles.

Usage:
    backend/venv/Scripts/python.exe tools/publish_project_rag_voxel_articles.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_project_rag_voxel_articles.py --skip-cover-check

Idempotent by slug: existing articles are updated, not duplicated.

Covers live in this repo (``tools/make_shuge_cover.py`` and
``tools/make_block_world_cover.py`` -> ``frontend/public/photos/`` + ``photos/``).
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
        "slug": "shuge-cloudflare-rag",
        "title": "書閣 ShuGe：在边缘搭一套可引用页码的 RAG",
        "excerpt": (
            "書閣把上传、解析、分块、向量化、倒排索引、混合检索和流式问答塞进 Cloudflare "
            "Pages Functions：解析 12 种格式，标题感知分块，D1 手写 BM25，Vectorize 语义召回，"
            "RRF 融合加四权重重排，引用精确到页码。代价同样明确：400 词上限截断 99.7% 的块，"
            "哈希向量只懂词面，D1 回退要扫 4,000 行，长文档受 waitUntil 生命周期约束。"
        ),
        "tags": [
            {"slug": "cloudflare", "name": "Cloudflare"},
            {"slug": "rag", "name": "RAG"},
            {"slug": "hono", "name": "Hono"},
            {"slug": "d1", "name": "D1"},
            {"slug": "retrieval", "name": "检索"},
        ],
        "figures": [
            "29 条", "50MB", "2MB", "200MB", "10,000", "1024 维",
            "120,000", "400 词", "4,000", "360", "80", "64 个",
            "2,000", "6,000", "0.78", "0.18", "0.09", "0.12",
            "0.35", "0.65", "0.22", "0.32", "五路",
            "563,852", "1,191", "539.8", "329.6", "554", "392,611",
            "475,979", "119,950", "99.7%", "1,326", "526,680", "96.2%",
            "0.01–0.08", "57–182", "530–700",
            "chunk_keywords", "message_sources", "waitUntil", "Vectorize",
        ],
    },
    {
        "slug": "block-world-3d-voxel-engine",
        "title": "方块世界 3D：一台纯 JS 体素引擎的四道闸",
        "excerpt": (
            "方块世界 3D 只在渲染层用 Three.js，地形、区块、光照、物理、红石、生物 AI 和存档"
            "全部自己写：28×28 Worker 预采样、251 层字符串键 Map、1 字节装天光与火把光、"
            "InstancedMesh 合批、4,096 预算的更新队列、v1→v6 存档迁移。实测约 5 ms/区块，"
            "80 字节/方块键；代价是红石不完整、内存偏高、云存档 schema 落后两个版本。"
        ),
        "tags": [
            {"slug": "threejs", "name": "Three.js"},
            {"slug": "voxel", "name": "体素"},
            {"slug": "game-dev", "name": "游戏开发"},
            {"slug": "electron", "name": "Electron"},
            {"slug": "performance", "name": "性能优化"},
        ],
        "figures": [
            "528", "332", "835", "263", "34", "251", "17", "40", "20", "13",
            "81", "28×28", "784", "63,504", "4.8–5.9 ms", "385–479",
            "16,384", "80 字节", "149 MB", "1.9–3.7", "16–30", "0.05–0.06",
            "23.5", "4,096", "15 秒", "6.5 秒", "0.4 秒", "1.2 秒", "0.5 秒",
            "1.6", "0.10", "1.43", "56", "3.8", "900", "32", "500 KB",
            "75 条", "38", "34 ms", "100", "4,000", "15,000", "20 MB", "25",
            "103", "2.3 万行", "87 KB", "6.5%", "3–6", "128", ".065",
            "v6", "v4", "10,000", "120,000",
            "ensureChunks", "blockUpdateQueue", "InstancedMesh",
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
