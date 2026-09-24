"""Publish the LC 15 (3Sum) article — the sixteenth algorithm entry.

Usage:
    backend/venv/Scripts/python.exe tools/publish_lc15_article.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_lc15_article.py

Idempotent by slug: an existing article is updated instead of duplicated.
Credentials are read by ``tools._auth`` from the environment or ``tools/.env``.

Source Markdown: ``article/lc-15-3sum.md``.

Second **array / two-pointer** entry (LC 3 was the sliding-window one), and the
direct successor of LC 1: same "fix one value, solve the rest" idea, but the
moment the answer must be the SET of all solutions, the hash table loses and
sorting + two pointers wins.

Same guard set as publish_lc1_article.py (adapted, not shared, so each
article's invariants live next to its own constants):
- TOC check: no ``- <n>.`` numbering bug.
- viz check: the placeholder must survive markdown + bleach —
  ``.algo-viz--lc155`` (sorted cells + i anchor + L/R two-row pins + hit cells
  + collected triplets).
- number check: headline figures must be present in the text. The four spine
  claims are: the two de-duplication sites (``nums[i] == nums[i - 1]``
  pre-skip vs ``nums[l] == nums[l + 1]`` post-hit), the two counter-examples
  that official samples do NOT expose (``[-1, -1, 0, 1]`` and
  ``[-2, 0, 0, 2, 2]``), the ``nums[i] > 0`` prune, and the JS
  default-string-sort trap. If the prose and the state machine
  (threeSumSteps.js) drift apart, this guard catches it.
- cover check: the cover is a repo file (photos/ + frontend/public/photos/),
  so it only becomes reachable AFTER the deploy that ships it.
  Deploy first, then publish.
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
    / "lc-15-3sum.md"
)

ARTICLE_TITLE = "【LC 15】三数之和：难点从来不是双指针，而是「只有两处」的去重"
ARTICLE_SLUG = "lc-15-3sum"
ARTICLE_EXCERPT = (
    "三数之和的骨架十分钟就能背下来，但它的难点（去重）背下来不算会 —— "
    "因为去重只有两处，形态还完全不同：一处在外层、事前跳过，用 `continue`；"
    "一处在内层、命中后跳过，用 `while`。前者挡「起点重复」，后者挡「配对数重复」。"
    "更麻烦的是，官方样例恰好两处都不会触发，跑通它根本证明不了去重写对了。"
    "本文给出双指针单调性的正确性论证、15 帧完整推演动画、"
    "两组「官方样例测不出」的反例对照，以及 16 / 18 / 259 / 611 / 923 一整条演化路线。"
)
# 自制封面（tools/make_lc236_cover.py 生成），仓库文件，必须先部署才可访问。
ARTICLE_COVER = "https://zhoujungis.github.io/photos/lc-15-cover.png"

CATEGORY = {"name": "算法", "slug": "algorithm", "description": "算法题解与推演"}

TAGS = [
    {"slug": "algorithm", "name": "算法"},
    {"slug": "two-pointers", "name": "双指针"},
    {"slug": "leetcode", "name": "LeetCode"},
    {"slug": "interview", "name": "面试"},
]

# 文章正文里必须出现的关键数字/标识，用来兜住「正文被改坏了」这类事故。
EXPECTED_FIGURES = [
    "LC 15",
    "LC 16",
    "LC 18",
    "LC 259",
    "LC 611",
    "LC 923",
    "LC 1",
    "LC 3",
    "[-1, 0, 1, 2, -1, -4]",
    "[-4, -1, -1, 0, 1, 2]",
    "[0, 0, 0, 0]",
    "[-2, 0, 0, 2, 2]",
    "[-1, -1, 0, 1]",
    "[0, 0, 0]",
    "[1, 2, 3]",
    "[0, 1, 1]",
    "nums[i] == nums[i - 1]",
    "nums[l] == nums[l + 1]",
    "nums[r] == nums[r - 1]",
    "nums[i] > 0",
    "n - 2",
    "i > 0",
    "l < r",
    "threeSum",
    "threeSumClosest",
    "fourSum",
    "threeSumSmaller",
    "count += r - l",
    "Arrays.asList",
    "Timsort",
    "双轴快排",
    "双指针",
    "哈希表",
    "去重",
    "剪枝",
    "单调性",
    "continue",
    "两数之和",
    "四数之和",
    "最接近",
    "O(n³)",
    "O(n²)",
    "O(n log n)",
    "O(1)",
]

# 动画占位符必须活下来
VIZ_PLACEHOLDER_CLASSES = ["algo-viz--lc15"]

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
            f"TOC bug detected: {len(bad)} list item(s) start with `- <number>.`.\n"
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
            "  This cover is a repo file (photos/lc-15-cover.png),\n"
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
