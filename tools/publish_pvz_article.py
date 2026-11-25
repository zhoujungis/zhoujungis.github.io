"""Publish the 花园保卫战 (PvZ vanilla-JS engine) deep-dive article.

Usage:
    backend/venv/Scripts/python.exe tools/publish_pvz_article.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_pvz_article.py --skip-cover-check

Idempotent by slug: an existing article is updated instead of duplicated.

Source Markdown: ``article/pvz-vanilla-js-canvas-engine.md``.
Cover: ``tools/make_pvz_cover.py`` writes the PNG to both
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
SOURCE = ROOT / "article" / "pvz-vanilla-js-canvas-engine.md"

ARTICLE_TITLE = "花园保卫战：用 3700 行原生 JS 手搓一个植物大战僵尸"
ARTICLE_SLUG = "pvz-vanilla-js-canvas-engine"
ARTICLE_EXCERPT = (
    "花园保卫战是一个零依赖、零构建、纯原生 JavaScript 写的植物大战僵尸同人游戏：全部逻辑塞在"
    "一个 3731 行的 game.js 里，一个 IIFE 包住整台引擎，146 个函数、81 个 draw*、60 个关卡、24 "
    "种植物、16 种僵尸、4 种模式、16 个 Playwright E2E 套件。难的不是把豌豆画出来，而是四件事："
    "素材在 GIF、PNG、代码手绘之间无缝回退；同一套网格撑起水面、迷雾、屋顶斜坡三种地形；僵尸波次"
    "在前期递进与收尾全类型登场之间编排；旧存档迁移进新章节而不丢进度。文章给出游戏循环的 dt 封顶、"
    "波次调度、迷雾 destination-out 挖洞、屋顶坡度正反变换、测试钩子与 file:// 下截图取像素的真实实现。"
)
ARTICLE_COVER = "https://blog.zhoujun.dev/photos/pvz-vanilla-js-canvas-engine-cover.png"

CATEGORY = {
    "name": "项目实战",
    "slug": "projects",
    "description": "从零实现：桌面客户端、数据流水线与本地 Agent",
}

TAGS = [
    {"slug": "javascript", "name": "JavaScript"},
    {"slug": "game-dev", "name": "游戏开发"},
    {"slug": "project-practice", "name": "项目实战"},
]

EXPECTED_FIGURES = [
    "花园保卫战",
    "3,731 行",
    "146 个函数",
    "81 个 `draw*`",
    "60 个关卡",
    "24 种植物",
    "16 种僵尸",
    "requestAnimationFrame",
    "Math.min(.034",
    "makeSchedule",
    "updatePlants",
    "updateZombies",
    "updateProjectiles",
    "destination-out",
    "slopeAt",
    "sceneY",
    "boardYFromScene",
    "canPlantAt",
    "lilypad",
    "STATIC_SPRITES",
    "drawSprite",
    "window.__pvzTest",
    "updateOnce",
    "decodePngPixel",
    "pvz-version",
    "OLD_LEVEL_IDS",
    "ZPUZZLE_COSTS",
    "beginEndlessWave",
    "16 个 Playwright",
    "Canvas 2D",
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
        raise SystemExit("Cover URL is not reachable — deploy photos/pvz-*.png first.")

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
