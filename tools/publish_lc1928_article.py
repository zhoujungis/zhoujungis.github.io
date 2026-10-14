"""Publish the LC 1928 (Minimum Cost to Reach Destination in Time) article.

Usage:
    backend/venv/Scripts/python.exe tools/publish_lc1928_article.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_lc1928_article.py

Idempotent by slug: an existing article is updated instead of duplicated.

Source Markdown: ``article/lc-1928-min-cost.md``.

Two animations: ``algo-viz--lc1928`` (the layered graph table: rows = time t,
columns = city v, cells = ``dp[t][v]``; one relax per frame drawn as a dashed
arrow from ``(t, v)`` to ``(t+et, u)``, the target cell framed gold when the
candidate wins and dashed orange when it is a losing duplicate; a gold ring
tracks the current best ``dp[bestT][target]``; relaxations that overshoot
``maxTime`` emit no frame and only bump the "pruned" counter) and
``algo-viz--lc1928path`` (the same graph, cheap-but-late versus on-time best,
followed by a right-to-left predecessor walk that reveals the state chain).

Spine claims guarded by the number check:
- dp[t][v] = the min fee to arrive at city v EXACTLY at time t; the only base
  is dp[0][0] = passingFees[0] (the start city is paid for too);
- dp[t + et][u] = min( dp[t + et][u], dp[t][v] + passingFees[u] ), t ascending:
  the layered graph; answering at t <= maxTime is not enough -- the answer is
  min over t <= maxTime of dp[t][n-1];
- a one-dimensional dp[v] loses the "arrived at which time" dimension and will
  mistake a cheap-but-late path for the answer: the official example flips the
  answer from 11 to 48 when maxTime moves by ONE minute (30 vs 29);
- overshooting relaxations (arr > maxTime) are pruned -- time never rewinds;
- the default shrunk instance reproduces the same conflict: cheap 11 costs
  6 minutes (> 5), on-time 48 costs 3; the answer dp[3][5] = 48 beats the later
  dp[5][5] = 71;
- the path is not in the values: prev[arr][u] = (t, v) walks back to (0, 0);
- heap Dijkstra on (cost, t, v) is the equivalent view, first pop wins;
- family: 787 swaps maxTime for K stops, 743 drops the window, 1631/1514 swap
  the aggregation to max / product, 1976 swaps min for counting.

Same guard set as publish_lc139_article.py. Cover check: repo file,
deploy first then publish.
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
    / "lc-1928-min-cost.md"
)

ARTICLE_TITLE = "【LC 1928】规定时间内到达终点的最小花费：分层图上的 dp"
ARTICLE_SLUG = "lc-1928-min-cost"
ARTICLE_EXCERPT = (
    "1928 看上去是最短路，门槛却在一处反直觉：时间不能被压缩。一维的 "
    "dp[v] 只记花费、丢掉「第几时刻到的」，会把超时的便宜路错当答案 —— "
    "官方示例里 maxTime 只差 1 分钟（30 与 29），答案就从 11 跳到 48。"
    "修法是把时刻并进状态、摊成一张分层图（官方提示）："
    "dp[t][v] = 恰在时刻 t 到达城市 v 的最小通行费，dp[0][0] = passingFees[0]，"
    "dp[t+et][u] = min( .. , dp[t][v] + fees[u] )，答案取 min over t ≤ maxTime。"
    "附两个可回放动画、Java 三种写法（分层图 DP / 小顶堆 Dijkstra / 前驱回溯），"
    "以及 787/743/1631/1514/1976 的同族对照。"
)
# 自制封面（tools/make_lc1928_cover.py 生成），仓库文件，必须先部署才可访问。
ARTICLE_COVER = "https://zhoujungis.github.io/photos/lc-1928-cover.png"

CATEGORY = {"name": "算法", "slug": "algorithm", "description": "算法题解与推演"}

TAGS = [
    {"slug": "algorithm", "name": "算法"},
    {"slug": "dp", "name": "动态规划"},
    {"slug": "leetcode", "name": "LeetCode"},
    {"slug": "interview", "name": "面试"},
]

# 文章正文里必须出现的关键数字/标识，用来兜住「正文被改坏了」这类事故。
EXPECTED_FIGURES = [
    "LC 1928",
    "LC 787",
    "LC 743",
    "LC 1631",
    "LC 1514",
    "LC 1976",
    "分层图",
    "maxTime",
    "passingFees",
    "dp[0][0] = passingFees[0]",
    "dp[t][v]",
    "dp[t+et][u]",
    "min over t",
    "arr > maxTime",
    "t + et",
    "∞",
    "无向边",
    "重边",
    "前驱表",
    "prev[arr][u]",
    "0 → 1 → 2 → 5",
    "0 → 3 → 4 → 5",
    "dp[1][3] = 25",
    "dp[3][5] = 48",
    "dp[5][5] = 71",
    "已剪枝 = 11",
    "便宜但慢",
    "贵但快",
    "超时",
    "O(maxTime × E)",
    "Integer.MAX_VALUE",
    "PriorityQueue",
    "Dijkstra",
    "BFS",
    "col0 = {0}",
    "maxTime ≤ 1000",
    "K 站中转内最便宜的航班",
    "网络延迟时间",
    "最小体力消耗路径",
    "概率最大的路径",
    "到达目的地的方案数",
]

# 动画占位符必须活下来
VIZ_PLACEHOLDER_CLASSES = ["algo-viz--lc1928", "algo-viz--lc1928path"]

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
    """The animation placeholder must survive markdown + bleach intact."""
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
            "  This cover is a repo file (photos/lc-1928-cover.png),\n"
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
