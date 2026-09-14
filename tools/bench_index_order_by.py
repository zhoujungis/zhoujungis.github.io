"""Reproduce the benchmarks from article/django-slow-query-index-tuning.md.

Builds a throwaway 1,000,000-row SQLite table that mirrors
``backend/articles/models.py`` (same columns, same ``ordering``) and measures
the article-list query under four index configurations.

Usage:
    python tools/bench_index_order_by.py            # 100 万行（默认）
    python tools/bench_index_order_by.py --rows 200000

Nothing is written outside the system temp directory; the scratch database is
deleted on exit. The real ``backend/db.sqlite3`` is never touched.

Environment measured for the article:
    SQLite 3.50.4 / Python 3.13 / Django 6.0.6
    rows=1,000,000 (90% published) / 63 MB / median of 7 runs
"""

import argparse
import os
import sqlite3
import statistics
import tempfile
import time

LIST_Q = (
    "SELECT id, title FROM articles_article "
    "WHERE status='published' "
    "ORDER BY is_top DESC, created_at DESC LIMIT 10"
)
DEEP_Q = (
    "SELECT id, title FROM articles_article "
    "WHERE status='published' "
    "ORDER BY is_top DESC, created_at DESC LIMIT 10 OFFSET 900000"
)
COUNT_Q = "SELECT count(*) FROM articles_article WHERE status='published'"

# label -> DDL applied for that round (all other candidate indexes are dropped)
CONFIGS = [
    ("S0 无索引", ()),
    (
        "S1 线上现状 (status, created_at DESC)",
        ('CREATE INDEX idx_status_created ON articles_article(status, created_at DESC)',),
    ),
    (
        "S2 补列但方向错 (status, is_top, created_at DESC)",
        ('CREATE INDEX idx_status_top_created ON articles_article(status, is_top, created_at DESC)',),
    ),
    (
        "S3 列与方向全对齐 (status, is_top DESC, created_at DESC)",
        (
            'CREATE INDEX idx_status_top_desc_created '
            'ON articles_article(status, is_top DESC, created_at DESC)',
        ),
    ),
]

ALL_INDEXES = ("idx_status_created", "idx_status_top_created", "idx_status_top_desc_created")


def build(path, rows):
    if os.path.exists(path):
        os.remove(path)
    con = sqlite3.connect(path)
    con.execute("PRAGMA journal_mode=OFF")
    con.execute("PRAGMA synchronous=OFF")
    cur = con.cursor()
    cur.execute(
        """
        CREATE TABLE articles_article (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT NOT NULL,
            is_top INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            views_count INTEGER NOT NULL DEFAULT 0,
            category_id INTEGER
        )
        """
    )
    base = time.mktime((2018, 1, 1, 0, 0, 0, 0, 0, -1))
    batch = []
    for i in range(rows):
        status = "published" if (i % 10) != 0 else "draft"
        # A handful of pinned articles, exactly like a real blog.
        is_top = 1 if i in (7, 42, 1337, 99999, 500000) else 0
        created = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(base + i * 37))
        batch.append((f"article {i}", status, is_top, f"{created}.{i % 1000000:06d}", i % 5000, i % 4))
    cur.executemany(
        "INSERT INTO articles_article (title, status, is_top, created_at, views_count, category_id)"
        " VALUES (?,?,?,?,?,?)",
        batch,
    )
    con.commit()
    return con


def bench(cur, sql, runs):
    times = []
    for _ in range(runs):
        start = time.perf_counter()
        cur.execute(sql).fetchall()
        times.append((time.perf_counter() - start) * 1000)
    return statistics.median(times), min(times)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--rows", type=int, default=1_000_000)
    parser.add_argument("--runs", type=int, default=7)
    args = parser.parse_args()

    path = os.path.join(tempfile.gettempdir(), "bench_index_order_by.sqlite")
    con = build(path, args.rows)
    cur = con.cursor()

    published = cur.execute(
        "SELECT count(*) FROM articles_article WHERE status='published'"
    ).fetchone()[0]
    print(f"rows={args.rows:,}  published={published:,}  "
          f"size={os.path.getsize(path) / 1024 / 1024:.0f} MB  runs={args.runs}")

    try:
        for label, ddl in CONFIGS:
            for name in ALL_INDEXES:
                cur.execute(f"DROP INDEX IF EXISTS {name}")
            for stmt in ddl:
                cur.execute(stmt)
            con.commit()

            print("\n" + "=" * 72 + f"\n{label}\n" + "=" * 72)
            for name, sql in (("首页 LIMIT 10", LIST_Q),):
                median, best = bench(cur, sql, args.runs)
                print(f"  {name}: median {median:9.2f} ms | best {best:9.2f} ms")
                for row in cur.execute("EXPLAIN QUERY PLAN " + sql):
                    print(f"      PLAN  {row[3]}")
            if "S1" in label or "S3" in label:
                median, best = bench(cur, DEEP_Q, args.runs)
                print(f"  深翻页 OFFSET 900000: median {median:9.2f} ms | best {best:9.2f} ms")
                for row in cur.execute("EXPLAIN QUERY PLAN " + DEEP_Q):
                    print(f"      PLAN  {row[3]}")
            if "S1" in label:
                median, best = bench(cur, COUNT_Q, args.runs)
                print(f"  COUNT(*): median {median:9.2f} ms | best {best:9.2f} ms")
                for row in cur.execute("EXPLAIN QUERY PLAN " + COUNT_Q):
                    print(f"      PLAN  {row[3]}")
    finally:
        con.close()
        os.remove(path)
    print("\ndone.")


if __name__ == "__main__":
    main()
