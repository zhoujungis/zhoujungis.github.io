"""Publish the LC 165 (Compare Version Numbers) article -- the twenty-fifth algorithm entry.

Usage:
    backend/venv/Scripts/python.exe tools/publish_lc165_article.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_lc165_article.py

Idempotent by slug: an existing article is updated instead of duplicated.

Source Markdown: ``article/lc-165-compare-version-numbers.md``.

One animation: ``algo-viz--lc165`` (per-column comparison over normalized
revision numbers, one compare-and-verdict decision per frame).

Spine claims guarded by the number check:
- normalize first, then compare column by column: strip leading zeros
  ("000" -> "0", keep one digit), missing revision counts as "0";
- the neat fact: after stripping, numeric comparison degenerates to
  "longer wins, equal length compares lexicographically" -- no numeric
  conversion anywhere, immune to parseInt precision traps;
- first decisive column short-circuits the whole comparison (1 / -1 / 0);
- pinned counterexamples: "1.2" vs "1.10" (lexicographic chars would
  flip it), 21-digit revisions differing in the last digit (parseInt
  collapses both to the same float, string method stays correct);
- variants: parseInt pitfall, in-place two-pointer version, shared trick
  with LC 415 signed-addition absolute-value comparison.

Same guard set as publish_lc415_article.py. Cover check: repo file,
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
    / "lc-165-compare-version-numbers.md"
)

ARTICLE_TITLE = "【LC 165】比较版本号：归一化后逐列比 —— 剥前导零 + 缺位补零"
ARTICLE_SLUG = "lc-165-compare-version-numbers"
ARTICLE_EXCERPT = (
    "两条规则（忽略前导零、缺失修订号视为 0）都指向同一个动作："
    "先归一化，再逐列比较。剥完前导零后有个漂亮事实："
    "比数值退化为先比长度、等长比字典序 —— 全程不转数字，"
    "免疫超长修订号的 parseInt 精度陷阱（只差末位的 21 位数会被判成相等）。"
    "与 LC 415 负数变体比绝对值是同一招。附 5 帧可回放逐列比较动画。"
)
# 自制封面（tools/make_lc236_cover.py 生成），仓库文件，必须先部署才可访问。
ARTICLE_COVER = "https://zhoujungis.github.io/photos/lc-165-cover.png"

CATEGORY = {"name": "算法", "slug": "algorithm", "description": "算法题解与推演"}

TAGS = [
    {"slug": "algorithm", "name": "算法"},
    {"slug": "two-pointers", "name": "双指针"},
    {"slug": "leetcode", "name": "LeetCode"},
    {"slug": "interview", "name": "面试"},
]

# 文章正文里必须出现的关键数字/标识，用来兜住「正文被改坏了」这类事故。
EXPECTED_FIGURES = [
    "LC 165",
    "LC 415",
    "LC 8",
    "LC 71",
    "归一化",
    "前导零",
    "补零",
    "字典序",
    "先比长度",
    "短路",
    "split",
    "strip_zeros",
    "cmp_norm",
    "parseInt",
    "Long",
    "compareTo",
    "1.02.3",
    "1.2.10",
    "1.01",
    "1.001",
    "1.10",
    "10.4",
    "1.04",
    "0.0",
    "000",
    "21 位",
    "2^53",
    "O(m + n)",
    "O(1)",
    "双指针",
    "原地",
]

# 动画占位符必须活下来
VIZ_PLACEHOLDER_CLASSES = ["algo-viz--lc165"]

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
            "  This cover is a repo file (photos/lc-165-cover.png),\n"
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
