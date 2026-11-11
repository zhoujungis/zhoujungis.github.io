"""先确认这台机器的 fsync 到底多贵，再谈“提交策略”。

如果 os.fsync 本身就接近零成本，说明写入落到了带写缓存的卷上，
SQLite 的 synchronous=FULL 也测不出真实价格——那这篇文章的数字就不能用。
"""

import os
import sqlite3
import tempfile
import time

N = 2000

# 1) 原始 fsync 成本
fd, path = tempfile.mkstemp(prefix="bench_fsync_")
try:
    os.write(fd, b"x" * 4096)
    t0 = time.perf_counter()
    for _ in range(N):
        os.write(fd, b"y" * 4096)
        os.fsync(fd)
    fsync_ms = (time.perf_counter() - t0) / N * 1000
finally:
    os.close(fd)
    os.remove(path)

print(f"os.fsync x {N}: {fsync_ms:.3f} ms each")

# 2) SQLite 的默认 pragma
p = tempfile.mktemp(suffix=".db")
con = sqlite3.connect(p)
print("journal_mode  :", con.execute("PRAGMA journal_mode").fetchone()[0])
print("synchronous   :", con.execute("PRAGMA synchronous").fetchone()[0])
print("temp_store    :", con.execute("PRAGMA temp_store").fetchone()[0])
con.execute("PRAGMA journal_mode=WAL")
print("after WAL     :", con.execute("PRAGMA journal_mode").fetchone()[0])
con.close()
os.remove(p)

# 3) 单次提交的真实耗时：1 行 / 100 行 / 1000 行 各提交 200 次
for rows_per_commit in (1, 100, 1000):
    p = tempfile.mktemp(suffix=".db")
    con = sqlite3.connect(p)
    con.execute("PRAGMA journal_mode=WAL")
    con.execute("PRAGMA synchronous=FULL")
    con.execute("CREATE TABLE t (i INTEGER, s TEXT)")
    con.commit()
    commits = 200
    t0 = time.perf_counter()
    for c in range(commits):
        for r in range(rows_per_commit):
            con.execute("INSERT INTO t VALUES (?, ?)", (r, "x" * 120))
        con.commit()
    per_commit = (time.perf_counter() - t0) / commits * 1000
    total_rows = commits * rows_per_commit
    print(f"{rows_per_commit:5d} rows/commit x {commits} commits: {per_commit:8.3f} ms/commit  ({total_rows} rows)")
    con.close()
    for suf in ("", "-wal", "-shm"):
        try:
            os.remove(p + suf)
        except OSError:
            pass
