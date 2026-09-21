"""Publish the queueing-theory & capacity-planning article (theory-only).

Usage:
    python tools/publish_queueing_theory_article.py --dry-run
    python tools/publish_queueing_theory_article.py
    python tools/publish_queueing_theory_article.py --skip-cover-check

Idempotent by slug: an existing article is updated instead of duplicated.
Credentials are read by ``tools._auth`` from the environment or ``tools/.env``.

Source Markdown: ``article/queueing-theory-capacity-planning.md``.

This is the first article on the site that uses KaTeX (``$...$`` / ``$$...$$``),
so it carries a ``check_math`` guard — see that function for the failure mode.
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
    / "queueing-theory-capacity-planning.md"
)

ARTICLE_TITLE = "加到 8 台反而更慢：排队论与容量规划"
ARTICLE_SLUG = "queueing-theory-capacity-planning"
ARTICLE_EXCERPT = (
    "利用率 70% 延迟放大 3.3 倍、90% 是 10 倍；服务时间变异系数从 1 涨到 3，队列长度差 5 倍；"
    "扇出 100 个后端、每个 1% 慢，页面 63% 的时间是慢的。"
    "从 Little's Law 到通用可扩展定律，一套判断该不该扩容、扩到几台、留多少余量的定量框架。"
)
ARTICLE_COVER = (
    "https://images.unsplash.com/photo-1495364141860-b0d03eccd065"
    "?w=1200&q=80&auto=format&fit=crop"
)

CATEGORY = {"name": "技术教程", "slug": "tech", "description": "技术教程"}

TAGS = [
    {"slug": "backend-dev", "name": "后端"},
    {"slug": "performance", "name": "性能优化"},
    {"slug": "architecture", "name": "架构"},
    {"slug": "queueing-theory", "name": "排队论"},
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
            return item["id"]
    created = api("POST", "/admin/categories/", CATEGORY)
    return created.get("id") if created else None


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


def _reexec_with_markdown():
    """Re-run this script under an interpreter that has `markdown` installed.

    The guard below is the only thing standing between us and shipping raw LaTeX,
    so it must not silently no-op. Running this script with the managed Python
    (no `markdown`) used to print "SKIPPED" and carry on looking like a pass —
    exactly the silent-guard failure this file exists to prevent.

    Returns True if a re-exec was started (caller should stop).
    """
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
        probe = subprocess.run(
            [str(candidate), "-c", "import markdown"],
            capture_output=True,
        )
        if probe.returncode == 0:
            print(f"  math check: re-running under {candidate.name} "
                  f"(this interpreter has no `markdown`)")
            os.execv(str(candidate), [str(candidate), *sys.argv])
    return False


def check_math(content):
    """Guard against markdown emphasis mangling KaTeX source.

    The backend renders with Python-Markdown, then the frontend walks text nodes
    and hands anything containing `$...$` / `$$...$$` to KaTeX. That walker needs
    the whole expression inside ONE text node — if markdown inserts a tag in the
    middle, KaTeX never sees it and the raw LaTeX shows up on the page.

    Two ways markdown breaks math, both observed in practice:

    1. A non-intraword `_` pair. `C_s` is safe (intraword), but
       `\\text{a}_\\text{b} ... \\text{c}_\\text{d}` is not — the underscores sit
       next to `}`, so markdown pairs them into `<em>`.
    2. A bare `*`. `$N^*$` followed later in the same paragraph by `**bold**`
       donates its asterisk to the emphasis parser, breaking BOTH the math and
       the bold. Use `\\ast` (or `\\star`) instead of `*` in math.

    This check renders the article exactly as the backend does and fails if any
    math expression came out containing an emphasis tag.
    """
    if _reexec_with_markdown():
        return  # never reached: execv replaced the process
    try:
        import markdown
    except ImportError:
        raise SystemExit(
            "math check: cannot run — `markdown` is not installed for this "
            f"interpreter ({sys.executable}), and no backend venv was found.\n"
            "  Install it (`pip install markdown`) or run this script with the "
            "backend venv's Python. Refusing to publish with the guard disabled."
        )

    md = markdown.Markdown(
        extensions=["fenced_code", "codehilite", "tables", "extra", "toc"]
    )
    raw = md.convert(content)

    problems = []
    for m in re.finditer(r"\$\$.+?\$\$", raw, flags=re.S):
        if "<em>" in m.group(0) or "<strong>" in m.group(0):
            problems.append(("block", m.group(0)[:100]))
    for m in re.finditer(r"\$[^$\n]+?\$", raw):
        if "<em>" in m.group(0) or "<strong>" in m.group(0):
            problems.append(("inline", m.group(0)[:100]))

    n_src = content.count("$$") // 2
    n_out = raw.count("$$") // 2
    if n_src != n_out:
        problems.append(("count", f"{n_src} blocks in source, {n_out} after render"))

    if problems:
        lines = "\n".join(f"    [{kind}] {text}" for kind, text in problems)
        raise SystemExit(
            f"KaTeX source was mangled by markdown: {len(problems)} problem(s)\n"
            f"{lines}\n"
            "  Fix: rename non-intraword subscripts, or replace `*` with `\\ast`."
        )
    print(f"  math check: OK ({n_out} $$ blocks render intact)")


def check_numbers(content):
    """Sanity-check that headline figures are still the computed ones.

    This article is theory-only: every number comes from a closed-form queueing
    formula, so they are recomputable rather than measured. Guard the ones that
    appear in the title, the summary table and the section headings.
    """
    expected = ["3.33", "10.00", "5.0", "63.4", "30.8", "0.6687", "138x"]
    missing = [e for e in expected if e not in content]
    if missing:
        print(f"  number check: WARNING, not found in text: {missing}", file=sys.stderr)
    else:
        print("  number check: OK (headline figures present)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cover", default=ARTICLE_COVER)
    parser.add_argument("--skip-cover-check", action="store_true")
    parser.add_argument("--dry-run", action="store_true",
                        help="只做本地校验（frontmatter/目录/公式/数字/封面/时长），不碰 API")
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
    check_math(content)
    check_numbers(content)

    print(f"Cover: {args.cover}")
    if not args.skip_cover_check and not cover_is_live(args.cover):
        raise SystemExit(
            "Cover URL is not reachable — refusing to publish.\n"
            "  Use --skip-cover-check to override."
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
        payload["slug"] = ARTICLE_SLUG
        result = api("POST", "/admin/articles/", payload)
        action = "created"

    if not result:
        raise SystemExit("Article API request failed.")
    print(f"Article {action}: {result.get('id')} {result.get('slug', ARTICLE_SLUG)}")
    print(f"Cover: {result.get('cover_image')}")
    print(f"Live URL: https://zhoujungis.github.io/article/{ARTICLE_SLUG}/")


if __name__ == "__main__":
    main()
