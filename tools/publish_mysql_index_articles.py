"""Publish the three MySQL index deep-dive articles.

Usage:
    backend/venv/Scripts/python.exe tools/publish_mysql_index_articles.py --dry-run --skip-cover-check
    backend/venv/Scripts/python.exe tools/publish_mysql_index_articles.py

Idempotent by slug: an existing article is updated instead of duplicated.

Sources live in ``article/<slug>.md``. Covers are repo-native PNGs written by
``tools/make_mysql_index_covers.py`` to both ``frontend/public/photos/`` and
``photos/``; they must be DEPLOYED before this script runs. Two-stage order:
deploy the PNGs, run this script, then build + deploy again.
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

CATEGORY = {"name": "数据库内核", "slug": "database", "description": "数据库内核"}

TAGS = [
    {"slug": "database", "name": "数据库"},
    {"slug": "storage-engine", "name": "存储引擎"},
    {"slug": "performance", "name": "性能优化"},
    {"slug": "backend-dev", "name": "后端"},
]

ARTICLES = [
    {
        "slug": "mysql-clustered-index-vs-secondary-index",
        "title": "MySQL 聚簇索引与二级索引：回表到底贵在哪",
        "excerpt": (
            "InnoDB 的表本身就是一棵聚簇索引，叶子存整行；二级索引叶子只存索引列加主键。"
            "本文用执行计划、buffer pool 与索引使用统计解释回表的三笔成本，"
            "并给出覆盖索引的适用边界。"
        ),
        "cover": "https://zhoujungis.github.io/photos/mysql-clustered-index-cover.png",
        "figures": [
            "DB_TRX_ID", "DB_ROLL_PTR", "DB_ROW_ID", "n_uniq",
            "idx_user", "idx_status", "Using index", "Using index condition",
            "Innodb_buffer_pool_reads", "Innodb_buffer_pool_read_requests",
            "Handler_read_key", "Handler_read_rnd_next",
            "table_io_waits_summary_by_index_usage", "UUID_TO_BIN",
            "OPTIMIZE TABLE", "聚簇索引", "二级索引", "回表", "覆盖索引",
        ],
    },
    {
        "slug": "mysql-composite-index-leftmost-prefix",
        "title": "MySQL 联合索引最左前缀：为什么 (a,b) 查不了 b",
        "excerpt": (
            "INDEX(a,b) 是按先 a 后 b 排序的一棵 B+ 树，不是两棵。本文从记录排序规则"
            "推出最左前缀，讲清范围列之后为什么断档、key_len 怎么反推用了几列，"
            "以及联合索引列顺序的决策方法。"
        ),
        "cover": "https://zhoujungis.github.io/photos/mysql-composite-index-cover.png",
        "figures": [
            "idx_uid_kind_ts", "key_len", "Using index", "Using index condition",
            "Using filesort", "Using temporary", "Using index for group-by",
            "Using index for skip scan", "index_merge", "Cardinality",
            "ANALYZE TABLE", "optimizer_switch", "skip_scan",
            "index_condition_pushdown", "COUNT(DISTINCT", "最左前缀",
            "联合索引", "范围查询", "覆盖索引", "字典序",
        ],
    },
    {
        "slug": "mysql-explain-type-all-ref-range",
        "title": "MySQL EXPLAIN 执行计划：从 ALL 到 ref 怎么看",
        "excerpt": (
            "type 是访问方式，不是性能评分。本文按从 const 到 ALL 的顺序解释每种访问类型，"
            "讲清 key_len 的逐字节算法、rows 与 filtered 的估算含义、"
            "Extra 里哪些信号要处理，并给出拿到慢 SQL 后的排查顺序。"
        ),
        "cover": "https://zhoujungis.github.io/photos/mysql-explain-cover.png",
        "figures": [
            "eq_range_index_dive_limit", "optimizer_trace", "OPTIMIZER_TRACE",
            "EXPLAIN ANALYZE", "EXPLAIN FORMAT=JSON", "used_key_parts",
            "attached_condition", "query_cost", "Using index for skip scan",
            "Using index for group-by", "Backward index scan",
            "Range checked for each record", "Select tables optimized away",
            "Impossible WHERE", "no matching row in const table", "eq_ref",
            "ref_or_null", "index_merge", "unique_subquery", "index_subquery",
            "TempTable", "temptable_max_ram", "Created_tmp_disk_tables",
            "ANALYZE TABLE", "UPDATE HISTOGRAM", "FORCE INDEX", "possible_keys",
            "filtered", "Using filesort", "Using temporary",
        ],
    },
    {
        "slug": "mysql-mvcc-version-chain-read-view",
        "title": "MySQL MVCC：版本链与 Read View 是怎么判可见性的",
        "excerpt": (
            "InnoDB 一行只有一份最新记录，旧值挂在 undo log 里，用 DB_ROLL_PTR 串成版本链。"
            "本文讲清隐藏列、undo 记录、Read View 的四个字段与完整可见性规则，"
            "并解释 RC 与 RR 的真实差别、快照读与当前读的边界。"
        ),
        "cover": "https://zhoujungis.github.io/photos/mysql-mvcc-cover.png",
        "figures": [
            "DB_TRX_ID", "DB_ROLL_PTR", "DB_ROW_ID", "m_ids",
            "m_up_limit_id", "m_low_limit_id", "m_creator_trx_id",
            "ReadView", "read0types.h", "History list length", "INNODB_TRX",
            "transaction_isolation", "WITH CONSISTENT SNAPSHOT", "FOR SHARE",
            "innodb_lock_wait_timeout", "data_locks",
            "events_transactions_current", "PAGE_GARBAGE",
            "版本链", "快照读", "当前读", "长事务",
        ],
    },
    {
        "slug": "btree-delete-merge-redistribute",
        "title": "B+ 树删除：页合并、借位与根收缩",
        "excerpt": (
            "B+ 树删除的第一动作永远是在叶子页里移除一个键，真正麻烦的是页快空了怎么办。"
            "本文讲清借位与合并的判定、父页分隔键与根收缩，"
            "并对照 InnoDB 的标记删除与 SQLite 的 balance_nonroot 重排。"
        ),
        "cover": "https://zhoujungis.github.io/photos/btree-delete-cover.png",
        "figures": [
            "balance_nonroot", "balance_deeper", "balance_shallower",
            "btreeDeleteRow", "sqlite3BtreeDelete", "nCell", "nFree",
            "nFrag", "PAGE_N_RECS", "PAGE_GARBAGE", "PAGE_FREE",
            "innodb_fill_factor", "innodb_page_size", "OPTIMIZE TABLE",
            "data_free", "VACUUM", "freelist", "delete mark", "purge",
            "History list length", "下溢", "借位", "合并", "根收缩",
        ],
    },
]

MARKDOWN_EXTENSIONS = ["fenced_code", "codehilite", "tables", "extra", "toc"]
VIZ_PLACEHOLDER_CLASSES = []


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
        return False
    except ImportError:
        pass
    candidates = [
        ROOT / "backend" / "venv" / "Scripts" / "python.exe",
        ROOT / "backend" / "venv" / "bin" / "python",
    ]
    for candidate in candidates:
        if not candidate.exists():
            continue
        if Path(sys.executable).resolve() == candidate.resolve():
            break
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
    bad = re.findall(r"^- \d+\.", content, flags=re.M)
    if bad:
        raise SystemExit(
            f"TOC bug detected: {len(bad)} list item(s) start with `- <number>`."
        )
    toc_block = re.search(r"\*\*目录\*\*\n(.*?)\n\n", content, flags=re.S)
    if not toc_block:
        raise SystemExit("TOC block `**目录**` not found.")
    toc = [
        line[2:].strip()
        for line in toc_block.group(1).splitlines()
        if line.startswith("- ")
    ]
    h2 = [line[3:].strip() for line in content.splitlines() if line.startswith("## ")]
    if toc != h2:
        raise SystemExit(
            "TOC / H2 mismatch:\n"
            f"  TOC ({len(toc)}): {toc}\n"
            f"  H2  ({len(h2)}): {h2}"
        )
    print(f"  TOC check: OK ({len(toc)} entries match H2 headings)")


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
        raise SystemExit(f"Animation placeholder(s) DID NOT survive: {missing}")

    polluted = 0
    for block in re.findall(r"<pre\b[^>]*>.*?</pre>", cleaned, flags=re.DOTALL):
        polluted += len(re.findall(r"</?(?:em|strong)\b", block))
    if polluted:
        raise SystemExit(
            f"Code blocks contain {polluted} <em>/<strong> tag(s)."
        )

    prose = re.sub(r"<pre\b[^>]*>.*?</pre>", "", cleaned, flags=re.DOTALL)
    prose = re.sub(r"<code\b[^>]*>.*?</code>", "", prose, flags=re.DOTALL)
    if re.search(r"\*\*", prose):
        raise SystemExit("Rendered HTML still contains a bare `**`.")
    print(f"  viz check: OK ({len(re.findall(r'<pre', cleaned))} code blocks clean)")


def check_numbers(content, figures):
    missing = [e for e in figures if e not in content]
    if missing:
        raise SystemExit(f"Number check failed — not found in text: {missing}")
    print(f"  number check: OK ({len(figures)} expected figures present)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", action="append", default=None,
                        help="limit to one or more slugs")
    parser.add_argument("--skip-cover-check", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    _reexec_with_markdown()

    selected = [a for a in ARTICLES if not args.slug or a["slug"] in args.slug]
    if not selected:
        raise SystemExit("No article matched --slug.")

    prepared = []
    for article in selected:
        source = ROOT / "article" / f"{article['slug']}.md"
        if not source.exists():
            raise SystemExit(f"Source Markdown not found: {source}")
        content = strip_frontmatter(source.read_text(encoding="utf-8"))
        print(f"\n=== {article['slug']} ===")
        print(f"Source: {source.name} ({len(content)} chars)")
        chinese = len(re.findall(r"[一-鿿㐀-䶿]", content))
        english = len(re.findall(r"[a-zA-Z]+", content))
        print(f"Reading time (backend formula): {max(1, (chinese + english) // 250 + 1)} min")
        check_toc(content)
        check_viz(content)
        check_numbers(content, article["figures"])
        print(f"Cover: {article['cover']}")
        if not args.skip_cover_check and not cover_is_live(article["cover"]):
            raise SystemExit(
                f"Cover URL is not reachable — refusing to publish {article['slug']}.\n"
                "  Deploy the PNG first, then re-run this script (idempotent by slug)."
            )
        prepared.append((article, content))

    if args.dry_run:
        print("\n--dry-run: local checks passed, no API calls made.")
        for article, _ in prepared:
            print(f"Would publish: {article['slug']} ({article['title']})")
        return

    category = category_id()
    tags = tag_ids()
    if not tags:
        raise SystemExit("No article tags could be resolved; aborting.")

    for article, content in prepared:
        payload = {
            "title": article["title"],
            "content": content,
            "excerpt": article["excerpt"],
            "cover_image": article["cover"],
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
            raise SystemExit(f"Article API request failed for {article['slug']}.")
        print(f"Article {action}: {result.get('id')} {result.get('slug', article['slug'])}")
        print(f"Cover: {result.get('cover_image')}")
        print(f"Live URL: https://zhoujungis.github.io/article/{article['slug']}/")


if __name__ == "__main__":
    main()
