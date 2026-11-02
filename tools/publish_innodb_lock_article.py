"""Publish the InnoDB Next-Key / gap-lock deep-dive article.

Usage:
    backend/venv/Scripts/python.exe tools/publish_innodb_lock_article.py --dry-run --skip-cover-check
    backend/venv/Scripts/python.exe tools/publish_innodb_lock_article.py

Idempotent by slug: an existing article is updated instead of duplicated.

Source Markdown: ``article/innodb-next-key-gap-lock-deep-dive.md``.

Principles + source-only technical article (no animations), so
``VIZ_PLACEHOLDER_CLASSES`` is empty: guards cover TOC numbering,
code-block emphasis pollution, a bare ``**``, quoted-source identifiers,
and cover reachability.

Cover: ``tools/make_innodb_lock_cover.py`` writes the same PNG to both
``frontend/public/photos/`` and ``photos/``. Repo-native PNG must be
DEPLOYED before this script runs; two-stage order: deploy the PNG, run
this script, then build + deploy again.
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
    / "innodb-next-key-gap-lock-deep-dive.md"
)

ARTICLE_TITLE = "InnoDB 锁的边界：Next-Key 与间隙锁"
ARTICLE_SLUG = "innodb-next-key-gap-lock-deep-dive"
ARTICLE_EXCERPT = (
    "InnoDB 锁的不是行，而是索引记录与记录之间的缝。本文从 MySQL 8.0 的 "
    "lock0lock.h、lock0lock.cc、lock0wait.cc、row0sel.cc 取证：4 位模式与 4 个标志位"
    "如何编码记录锁、间隙锁、Next-Key 与插入意向锁；唯一索引等值查询为何只加记录锁；"
    "范围查询如何用 row_can_be_in_range / gap_can_intersect_range 选出 "
    "LOCK_ORDINARY / LOCK_REC_NOT_GAP / LOCK_GAP；隐式锁怎样在冲突发生时才兑现；"
    "锁队列为何按 CATS 权重而不是 FIFO；死锁检测如何用染色 DFS 找环、验环并挑选受害者；"
    "最后给出一张 id = 1 / 5 / 10 / 15 的锁地图与一份排查清单。"
)
ARTICLE_COVER = "https://zhoujungis.github.io/photos/innodb-lock-cover.png"

CATEGORY = {"name": "数据库内核", "slug": "database", "description": "数据库内核"}

TAGS = [
    {"slug": "database", "name": "数据库"},
    {"slug": "storage-engine", "name": "存储引擎"},
    {"slug": "backend-dev", "name": "后端"},
]

# 正文里必须出现的关键标识/数字，用来兜住「正文被改坏了」这类事故。
# 注意：frontmatter 会被 strip_frontmatter 剥掉，所以标题词不能放进来。
EXPECTED_FIGURES = [
    # 锁编码
    "LOCK_MODE_MASK",
    "LOCK_TABLE",
    "LOCK_REC",
    "LOCK_WAIT",
    "LOCK_ORDINARY",
    "LOCK_GAP",
    "LOCK_REC_NOT_GAP",
    "LOCK_INSERT_INTENTION",
    # 范围与锁型选择
    "row_compare_row_to_range",
    "row_can_be_in_range",
    "gap_can_intersect_range",
    "DB_RECORD_NOT_FOUND",
    "PAGE_CUR_GE",
    # 插入与冲突
    "lock_rec_insert_check_and_lock",
    "lock_rec_has_to_wait_for_granted",
    "locksys::rec_lock_check_conflict",
    "lock_rec_other_has_conflicting",
    # 隐式锁
    "lock_rec_convert_impl_to_expl",
    "lock_rec_convert_impl_to_expl_for_trx",
    "lock_clust_rec_modify_check_and_lock",
    "DB_TRX_ID",
    "DB_ROLL_PTR",
    "PAGE_MAX_TRX_ID",
    # 隔离级别
    "skip_gap_locks",
    "releases_non_matching_rows",
    "allow_semi_consistent",
    # 队列与死锁
    "schedule_weight",
    "CATS",
    "lock_wait_check_candidate_cycle",
    "lock_wait_choose_victim",
    "trx_weight_ge",
    "reservation_no",
    # 页与 heap_no
    "PAGE_HEAP_NO_INFIMUM",
    "PAGE_HEAP_NO_SUPREMUM",
    "PAGE_HEAP_NO_USER_LOW",
    # 超时与错误码
    "innodb_lock_wait_timeout",
    "innodb_rollback_on_timeout",
    "HA_ERR_LOCK_DEADLOCK",
    "HA_ERR_LOCK_WAIT_TIMEOUT",
    "1213",
    "1205",
    "50",
    # 观测面
    "performance_schema.data_locks",
    "data_lock_waits",
    "LOCK_DATA",
    "LOCK_MODE",
    "INDEX_NAME",
    "supremum pseudo-record",
    # 源码文件
    "lock0lock.h",
    "lock0lock.cc",
    "lock0wait.cc",
    "row0sel.cc",
    "page0types.h",
    "trx0trx.h",
    # 关键表述与目录标题
    "Next-Key",
    "记录锁",
    "间隙锁",
    "插入意向锁",
    "隐式锁",
    "前言：一条 UPDATE 锁住了什么",
    "一张表的锁地图",
    "常见误区与排查清单",
    "结语：锁的边界",
]

# 本文不含动画占位符（技术深挖文）。
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
        raise SystemExit(f"Animation placeholder(s) DID NOT survive the pipeline: {missing}")

    # Code blocks must not be touched by markdown emphasis rules.
    polluted = 0
    for block in re.findall(r"<pre\b[^>]*>.*?</pre>", cleaned, flags=re.DOTALL):
        polluted += len(re.findall(r"</?(?:em|strong)\b", block))
    if polluted:
        raise SystemExit(
            f"Code blocks contain {polluted} <em>/<strong> tag(s) — markdown emphasis "
            "mangled the source. Usually a non-intraword `_` pair or a bare `*`."
        )

    # `**` is legal inside inline code (e.g. a glob pattern `src/**/*.ts`), so
    # only prose outside <pre>/<code> is checked for unbalanced bold.
    prose = re.sub(r"<pre\b[^>]*>.*?</pre>", "", cleaned, flags=re.DOTALL)
    prose = re.sub(r"<code\b[^>]*>.*?</code>", "", prose, flags=re.DOTALL)
    if re.search(r"\*\*", prose):
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
            "  This cover is a repo-native PNG, so a failure here means the asset\n"
            "  has not been deployed yet. Deploy photos/innodb-lock-cover.png\n"
            "  first, then re-run this script (it is idempotent by slug)."
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
