"""Publish the KMP (next array) article.

Usage:
    backend/venv/Scripts/python.exe tools/publish_kmp_article.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_kmp_article.py

Idempotent by slug: an existing article is updated instead of duplicated.

Source Markdown: ``article/kmp-next-array.md``.

Two animations: ``algo-viz--kmp`` (the prefix table: a ``p`` cell row plus a
``next`` cell row; comparison frames outline ``p[i]`` / ``p[j]`` and green the
matched border ``p[0..j-1]`` against ``p[i-j..i-1]``, the retreat frame draws a
dashed link from ``p[j]`` to the ``next[j-1]`` cell, the assign frame paints
``next[i]`` gold; a five-slot panel tracks i / j / comparisons / retreats /
cells fixed) and ``algo-viz--kmpmatch`` (``text`` row plus a ``p`` row that
slides so ``p[j]`` sits exactly under ``text[i]``; a retreat frame bends a
dashed arc from the old j to the new j while ``text[i]`` stays put, the hit
frame paints ``text[index..index+n-1]`` and the whole pattern gold; the panel
contrasts KMP's live comparison count against brute force's static total).

Spine claims guarded by the number check:
- next[i] = the length of the longest equal PROPER prefix-suffix of p[0..i];
  "proper" excludes the substring itself, which is exactly why next[0] = 0
  holds by definition;
- the second definition (Yan Weimin, Data Structures) keys next[0] = -1 and
  describes p[0..i-1]; the two arrays differ by one whole shift:
  B = [-1] + A[0..n-2]; for "abacaba" the answers are [0,0,1,0,1,2,3] and
  [-1,0,0,1,0,1,2] -- ask which definition is in play BEFORE answering;
- the machine is "matching the pattern against itself": j is both the matched
  prefix length and the index to compare next; the invariant entering a
  comparison is p[0..j-1] == p[i-j..i-1];
- on a mismatch, retreat via next[j-1] inside a while loop (not if); read
  next[j] and the whole table shifts by one;
- match with the same table: text[i] vs p[j], i is never rewound (rewinding i
  collapses to the brute force O(n x m)); on j == n the answer is i - n + 1;
- default instance p = "abacaba" gives next = [0,0,1,0,1,2,3] in 7 comparisons
  and exactly 1 retreat (at i = 3);
- default match text = "abababacaba" hits at index 4 with 13 comparisons
  against brute force's 17 (s = 0/1/2/3 restart from scratch);
- O(n) amortized: j grows by at most 1 per step and retreats only give that
  growth back, so total while-iterations are linear;
- family: 28 is the match itself, 459 turns next into a period test, 214 asks
  for the longest palindromic prefix, 1392 is literally next[n-1], 686 allows
  the text to be built on the fly.

Same guard set as publish_lc1928_article.py. Cover check: repo file, deploy
first then publish.
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
    / "kmp-next-array.md"
)

ARTICLE_TITLE = "【KMP】求 next 数组：自己跟自己的最长相等前后缀"
ARTICLE_SLUG = "kmp-next-array"
ARTICLE_EXCERPT = (
    "求 p = \"abacaba\" 的 next 数组，按最长相等真前后缀的定义答案是 "
    "[0,0,1,0,1,2,3]。真正的门槛不在六行模板，而在定义：next[i] 统计的是 "
    "p[0..i] 还是 p[0..i-1]、首位取 0 还是 -1 —— 严蔚敏那版首项记作 -1，"
    "同一条串的答案是 [-1,0,0,1,0,1,2]，两者只差一次整体移位 "
    "（B = [-1] + A[0..n-2]），面试前必须确认用哪种。核心机制是"
    "「自己跟自己匹配」：j 既是已匹配前缀长度、也是下一个要和 p[i] 比的下标，"
    "失配就沿 next[j-1] 回退。附两个可回放动画（求 next 表 / KMP 匹配 vs "
    "暴力对照，13 次比较对 17 次）、Java 两种定义各一版，"
    "以及 28/459/214/1392/686 的同族对照。"
)
# 自制封面（tools/make_kmp_cover.py 生成），仓库文件，必须先部署才可访问。
ARTICLE_COVER = "https://zhoujungis.github.io/photos/kmp-cover.png"

CATEGORY = {"name": "算法", "slug": "algorithm", "description": "算法题解与推演"}

TAGS = [
    {"slug": "algorithm", "name": "算法"},
    {"slug": "string", "name": "字符串"},
    {"slug": "leetcode", "name": "LeetCode"},
    {"slug": "interview", "name": "面试"},
]

# 文章正文里必须出现的关键数字/标识，用来兜住「正文被改坏了」这类事故。
EXPECTED_FIGURES = [
    "KMP",
    "next 数组",
    "abacaba",
    "[0,0,1,0,1,2,3]",
    "[-1,0,0,1,0,1,2]",
    "最长相等真前后缀",
    "严蔚敏",
    "前缀函数",
    "B = [-1] + A[0..n-2]",
    "自己跟自己匹配",
    "next[j-1]",
    "next[0] = 0",
    "next[6] = 3",
    "abababacaba",
    "index = 10 - 7 + 1 = 4",
    "7 次比较",
    "1 次回退",
    "13",
    "17",
    "暴力比较",
    "均摊",
    "回退",
    "charAt(",
    "strStr",
    "O(n + m)",
    "O(n × m)",
    "O(n²)",
    "LC 28",
    "LC 459",
    "LC 214",
    "LC 1392",
    "LC 686",
    "重复的子字符串",
    "最短回文串",
    "最长快乐前缀",
    "重复叠加字符串匹配",
]

# 动画占位符必须活下来
VIZ_PLACEHOLDER_CLASSES = ["algo-viz--kmp", "algo-viz--kmpmatch"]

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
            "  This cover is a repo file (photos/kmp-cover.png),\n"
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
