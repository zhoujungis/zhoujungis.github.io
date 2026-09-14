"""Reproduce the migration-cost benchmarks for the article.

Companion to ``article/django-zero-downtime-migration.md``.

Measures, on a throwaway SQLite table that mirrors ``articles_article``
(same columns, same wide TEXT payloads):

  E1  直接 ALTER TABLE ADD COLUMN（可空列）        —— 毫秒级
  E2  Django 式的整表重建（NOT NULL 列）           —— 线性代价 + 2× 磁盘峰值
  E3  CREATE INDEX                                 —— 线性代价
  E4  DDL 期间并发写入被阻塞多久
  E5  ALTER TABLE DROP COLUMN
  E6  体积账：表 vs 索引（dbstat 精确统计）

Usage:
    python tools/bench_migration.py
    python tools/bench_migration.py --rows 100000
"""

import argparse
import os
import sqlite3
import tempfile
import threading
import time

COLUMNS = (
    "id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,"
    " content TEXT NOT NULL, html_content TEXT NOT NULL, excerpt TEXT NOT NULL,"
    " status TEXT NOT NULL, is_top INTEGER NOT NULL DEFAULT 0,"
    " views_count INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL,"
    " updated_at TEXT NOT NULL, category_id INTEGER, cover_image TEXT NOT NULL DEFAULT '',"
    " likes_count INTEGER NOT NULL DEFAULT 0, scheduled_at TEXT"
)

INSERT_SQL = (
    "INSERT INTO articles_article (title, slug, content, html_content, excerpt, status,"
    " is_top, views_count, created_at, updated_at, category_id, cover_image, likes_count,"
    " scheduled_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
)

# E4 用的最小写入：必须补齐所有 NOT NULL 列（E2 重建后默认值会丢）
PROBE_INSERT = (
    "INSERT INTO articles_article (title, slug, content, html_content, excerpt, status,"
    " is_top, views_count, created_at, updated_at, cover_image, likes_count)"
    " VALUES ('probe','probe-{}','','','','draft',0,0,'','','',0)"
)


def banner(text):
    print("\n" + "=" * 74 + f"\n{text}\n" + "=" * 74)


def human(nbytes):
    value = float(nbytes)
    for unit in ("B", "KB", "MB", "GB"):
        if value < 1024 or unit == "GB":
            return f"{value:.1f} {unit}"
        value /= 1024


def dbstat(cur):
    """Exact on-disk size per table/index, via the dbstat virtual table."""
    return {
        name: size
        for name, size in cur.execute(
            "SELECT name, sum(pgsize) FROM dbstat GROUP BY name"
        )
    }


def build(path, rows):
    if os.path.exists(path):
        os.remove(path)
    con = sqlite3.connect(path)
    con.execute("PRAGMA journal_mode=OFF")
    con.execute("PRAGMA synchronous=OFF")
    cur = con.cursor()
    cur.execute(f"CREATE TABLE articles_article ({COLUMNS})")

    base = time.mktime((2020, 1, 1, 0, 0, 0, 0, 0, -1))
    body = "Django 事务、索引与迁移实战。 " * 40  # ~600 bytes of CJK per row
    batch = []
    for i in range(rows):
        status = "published" if (i % 10) != 0 else "draft"
        created = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(base + i * 37))
        batch.append((
            f"article {i}", f"article-{i}", body, f"<p>{body}</p>", body[:200],
            status, 0, i % 5000, created, created, i % 4, "", i % 3, None,
        ))
        if len(batch) >= 5000:
            cur.executemany(INSERT_SQL, batch)
            batch = []
    if batch:
        cur.executemany(INSERT_SQL, batch)
    con.commit()
    cur.execute("CREATE INDEX articles_article_category_id_idx ON articles_article (category_id)")
    con.commit()
    return con


def e1_add_column_nullable(cur, path):
    banner("E1 直接 ALTER TABLE ADD COLUMN（可空列）")
    before = os.path.getsize(path)
    t0 = time.perf_counter()
    cur.execute('ALTER TABLE articles_article ADD COLUMN "notification_sent" bool NULL')
    ms = (time.perf_counter() - t0) * 1000
    after = os.path.getsize(path)
    print(f"  耗时      : {ms:.1f} ms")
    print(f"  文件体积  : {human(before)} -> {human(after)}")
    print("  SQLite 只改 schema 元数据，不碰已有行 —— 这就是「先加可空列」的价值")


def e2_django_style_rebuild(cur, path):
    banner("E2 Django 式整表重建（NOT NULL 列，SQLite 上 AddField 的真实做法）")
    before = os.path.getsize(path)
    ddl = [
        'CREATE TABLE "new__articles_article" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,'
        ' "notification_sent" bool NOT NULL, "title" varchar(200) NOT NULL,'
        ' "slug" varchar(200) NOT NULL UNIQUE, "content" text NOT NULL,'
        ' "html_content" text NOT NULL, "excerpt" text NOT NULL,'
        ' "status" varchar(16) NOT NULL, "is_top" bool NOT NULL,'
        ' "views_count" integer unsigned NOT NULL, "created_at" datetime NOT NULL,'
        ' "updated_at" datetime NOT NULL, "category_id" bigint NULL,'
        ' "cover_image" varchar(200) NOT NULL, "likes_count" integer unsigned NOT NULL,'
        ' "scheduled_at" datetime NULL)',
        'INSERT INTO "new__articles_article" ("id","title","slug","content","html_content",'
        '"excerpt","status","is_top","views_count","created_at","updated_at","category_id",'
        '"cover_image","likes_count","scheduled_at","notification_sent")'
        ' SELECT "id","title","slug","content","html_content","excerpt","status","is_top",'
        '"views_count","created_at","updated_at","category_id","cover_image","likes_count",'
        '"scheduled_at", 0 FROM "articles_article"',
        'DROP TABLE "articles_article"',
        'ALTER TABLE "new__articles_article" RENAME TO "articles_article"',
        'CREATE INDEX "articles_article_category_id_idx" ON "articles_article" ("category_id")',
    ]
    t0 = time.perf_counter()
    peak = before
    for stmt in ddl:
        cur.execute(stmt)
        peak = max(peak, os.path.getsize(path))
    ms = (time.perf_counter() - t0) * 1000
    cur.execute('ALTER TABLE articles_article DROP COLUMN "notification_sent"')
    cur.connection.commit()
    print(f"  耗时      : {ms:.1f} ms   ← 全表拷贝 + 全索引重建")
    print(f"  峰值体积  : {human(peak)}（原表 {human(before)}，约 2×）")
    print("  期间整张表被独占：读要排队，写要排队")


def e3_create_index(cur, path):
    banner("E3 CREATE INDEX（上一篇那条索引）")
    t0 = time.perf_counter()
    cur.execute(
        'CREATE INDEX "articles_status_top_created_idx"'
        ' ON articles_article ("status", "is_top" DESC, "created_at" DESC)'
    )
    cur.connection.commit()
    ms = (time.perf_counter() - t0) * 1000
    sizes = dbstat(cur)
    print(f"  耗时      : {ms:.1f} ms")
    print(f"  索引体积  : {human(sizes.get('articles_status_top_created_idx', 0))}")


def e4_ddl_blocks_writers(path):
    banner("E4 DDL 期间，并发写入被阻塞多久")
    con_w = sqlite3.connect(path, timeout=60)
    try:
        cur_w = con_w.cursor()
        t0 = time.perf_counter()
        cur_w.execute(PROBE_INSERT.format("base"))
        con_w.commit()
        baseline = (time.perf_counter() - t0) * 1000
        print(f"  基线（无 DDL 竞争）INSERT : {baseline:.1f} ms")

        state = {}

        def make_index():
            # SQLite 连接不能跨线程复用，必须在工作线程里自己开
            con_ddl = sqlite3.connect(path, timeout=60)
            try:
                state["t0"] = time.perf_counter()
                con_ddl.execute(
                    'CREATE INDEX "articles_status_created_probe_idx"'
                    ' ON articles_article ("status", "created_at" DESC)'
                )
                con_ddl.commit()
                state["ddl_ms"] = (time.perf_counter() - state["t0"]) * 1000
            except Exception as exc:  # noqa: BLE001
                state["error"] = f"{type(exc).__name__}: {exc}"
            finally:
                con_ddl.close()

        worker = threading.Thread(target=make_index)
        worker.start()
        time.sleep(0.15)  # 让 DDL 先拿到写锁

        t0 = time.perf_counter()
        try:
            cur_w.execute(PROBE_INSERT.format("during"))
            con_w.commit()
            blocked = (time.perf_counter() - t0) * 1000
            print(f"  DDL 期间 INSERT          : {blocked:.1f} ms  ← 被写锁挡住，等 DDL 做完")
        except Exception as exc:  # noqa: BLE001
            blocked = (time.perf_counter() - t0) * 1000
            print(f"  DDL 期间 INSERT          : {type(exc).__name__}（等了 {blocked:.1f} ms）")
            print(f"      {exc}")

        worker.join()
        if "error" in state:
            print(f"  DDL 线程异常             : {state['error']}")
        print(f"  本次 CREATE INDEX 总耗时 : {state.get('ddl_ms', 0):.1f} ms")
    finally:
        con_w.close()


def e5_drop_column(cur, path):
    banner("E5 ALTER TABLE DROP COLUMN")
    t0 = time.perf_counter()
    cur.execute('ALTER TABLE articles_article ADD COLUMN "to_be_dropped" text')
    add_ms = (time.perf_counter() - t0) * 1000
    t0 = time.perf_counter()
    cur.execute('ALTER TABLE articles_article DROP COLUMN "to_be_dropped"')
    drop_ms = (time.perf_counter() - t0) * 1000
    cur.connection.commit()
    print(f"  ADD COLUMN   : {add_ms:.1f} ms")
    print(f"  DROP COLUMN  : {drop_ms:.1f} ms   ← SQLite 3.35+ 仍然是整表重建")


def e6_sizes(cur, path):
    banner("E6 体积账：表 vs 索引（dbstat 精确统计）")
    sizes = dbstat(cur)
    total = sum(sizes.values())
    print(f"  文件大小 : {human(os.path.getsize(path))}")
    print(f"  逻辑合计 : {human(total)}")
    for name, size in sorted(sizes.items(), key=lambda kv: -kv[1]):
        pct = size / total * 100
        print(f"    {name or '(free pages)':38s} {human(size):>10s}  {pct:5.1f}%")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--rows", type=int, default=200_000)
    args = parser.parse_args()

    path = os.path.join(tempfile.gettempdir(), "bench_migration.sqlite")
    con = build(path, args.rows)
    cur = con.cursor()
    rows = cur.execute("SELECT count(*) FROM articles_article").fetchone()[0]
    print(f"scratch db : {path}")
    print(f"rows       : {rows:,}   体积 {human(os.path.getsize(path))}")

    try:
        e1_add_column_nullable(cur, path)
        con.commit()
        e2_django_style_rebuild(cur, path)
        e3_create_index(cur, path)
        e4_ddl_blocks_writers(path)
        e5_drop_column(cur, path)
        e6_sizes(cur, path)
    finally:
        con.close()
        time.sleep(0.2)
        try:
            os.remove(path)
        except PermissionError:
            print(f"(临时库未删除：{path})")
        print("\ndone.")


if __name__ == "__main__":
    main()
