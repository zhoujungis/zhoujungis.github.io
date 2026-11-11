"""一次 fsync 能摊薄多少行：SQLite 提交策略实测。

先量这台机器 fsync 的真实价格，再看「每次提交 1 / 10 / 100 / 1000 行」
和「整批一个事务」的吞吐差异——也就是 group commit 到底在救什么。

跑法（Windows）::

    set PYTHONIOENCODING=utf-8 && python tools/bench_sqlite_commit.py

纯标准库，可复现：固定行宽、固定提交次数、每档跑 3 轮取中位数。
"""

import os
import sqlite3
import statistics
import tempfile
import time

COMMITS = 200          # 每档固定提交次数，保证 fsync 次数可比
BATCHES = (1, 10, 100, 1000)
PAYLOAD = "x" * 120    # 每行带负载，避免整行落在同一页被压缩掉差异
RUNS = 3


def fresh_db(wal: bool) -> "tuple[sqlite3.Connection, str]":
    path = tempfile.mktemp(prefix="bench_commit_", suffix=".db")
    conn = sqlite3.connect(path)
    if wal:
        conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA synchronous=FULL")
    conn.execute("CREATE TABLE t (i INTEGER, kind TEXT, payload TEXT)")
    conn.commit()
    return conn, path


def cleanup(conn, path):
    conn.close()
    for suffix in ("", "-wal", "-shm"):
        try:
            os.remove(path + suffix)
        except OSError:
            pass


def fsync_price() -> float:
    """单次 FlushFileBuffers 的耗时（中位数，毫秒）。"""
    fd, path = tempfile.mkstemp(prefix="bench_fsync_")
    samples = []
    try:
        os.write(fd, b"x" * 4096)
        for _ in range(200):
            t0 = time.perf_counter()
            os.write(fd, b"y" * 4096)
            os.fsync(fd)
            samples.append((time.perf_counter() - t0) * 1000)
    finally:
        os.close(fd)
        os.remove(path)
    return statistics.median(samples)


def run_batch(wal: bool, rows_per_commit: int) -> "tuple[float, float]":
    """返回 (总秒数, 写入行数)。"""
    conn, path = fresh_db(wal)
    try:
        t0 = time.perf_counter()
        for c in range(COMMITS):
            for r in range(rows_per_commit):
                conn.execute(
                    "INSERT INTO t (i, kind, payload) VALUES (?, ?, ?)",
                    (r, "click", PAYLOAD),
                )
            conn.commit()
        elapsed = time.perf_counter() - t0
        rows = COMMITS * rows_per_commit
    finally:
        cleanup(conn, path)
    return elapsed, rows


def run_single_transaction(wal: bool, rows: int) -> "tuple[float, float]":
    conn, path = fresh_db(wal)
    try:
        t0 = time.perf_counter()
        for r in range(rows):
            conn.execute(
                "INSERT INTO t (i, kind, payload) VALUES (?, ?, ?)",
                (r, "click", PAYLOAD),
            )
        conn.commit()
        elapsed = time.perf_counter() - t0
    finally:
        cleanup(conn, path)
    return elapsed, rows


def median_run(fn, *args):
    samples, rows = [], 0
    for _ in range(RUNS):
        elapsed, rows = fn(*args)
        samples.append(elapsed)
    return statistics.median(samples), rows


def report(label, seconds, rows):
    print(
        f"{label:30s} {seconds:8.3f} s   {rows:>8d} rows   "
        f"{rows / seconds:>10.0f} rows/s   {seconds / rows * 1e6:8.1f} us/row"
    )
    return rows / seconds


def main():
    print(f"fsync median: {fsync_price():.3f} ms")
    print(f"payload={len(PAYLOAD)}B  commits/case={COMMITS}  runs={RUNS}  (median)\n")

    for wal in (False, True):
        mode = "WAL" if wal else "rollback journal"
        print(f"== {mode} + synchronous=FULL ==")
        print(f"{'commit strategy':30s} {'wall':>10s}   {'rows':>11s}   {'throughput':>15s}   {'per row':>13s}")
        baseline = None
        for batch in BATCHES:
            seconds, rows = median_run(run_batch, wal, batch)
            tps = report(f"{batch} row(s) per commit", seconds, rows)
            if baseline is None:
                baseline = tps
        seconds, rows = median_run(run_single_transaction, wal, 20000)
        tps = report("20000 rows, one commit", seconds, rows)
        print(f"{'':30s} 单事务 vs 逐行提交：{tps / baseline:,.0f}x\n")

    # 把「20k 行、逐行提交」外推成真实等待时间
    per_row_seconds, _ = median_run(run_batch, False, 1)
    per_commit_ms = per_row_seconds / COMMITS * 1000
    print(f"逐行提交 20000 行 ≈ {per_commit_ms * 20000 / 1000:.1f} s（按 {per_commit_ms:.2f} ms/commit 外推）")
    single_seconds, _ = median_run(run_single_transaction, False, 20000)
    print(f"同样 20000 行放进一个事务 ≈ {single_seconds:.2f} s")


if __name__ == "__main__":
    main()
