"""Reproduce the idempotency / duplicate-submission benchmarks for the article.

Companion to ``article/api-idempotency-deep-dive.md``.

Usage:
    python tools/bench_idempotency.py
    python tools/bench_idempotency.py --threads 8 --replays 5

Pure standard library. A fresh temp SQLite database is created (WAL mode) and
deleted afterwards -- the blog backend's db.sqlite3 is never touched.

The race being reproduced is a *concurrency* property: check-then-insert has a
TOCTOU window no matter which database backs it. A 10ms "business logic" sleep
sits between the check and the insert to widen the window to what a real
service looks like (validate, compute price, call inventory ...).

Experiments
    E0  environment
    E1  double-click race: N threads submit the same order, four defenses
    E2  payment-callback replay: state machine rejects illegal transitions
    E3  idempotency key + request fingerprint: same key, different body
"""

import argparse
import hashlib
import json
import os
import sqlite3
import statistics
import tempfile
import threading
import time
import uuid
from concurrent.futures import ThreadPoolExecutor

BUSINESS_LOGIC_MS = 10  # widen the check→insert window like real services


def banner(text):
    print("\n" + "=" * 72 + f"\n{text}\n" + "=" * 72)


def connect(db_path):
    conn = sqlite3.connect(db_path, timeout=15)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=15000")
    conn.isolation_level = None  # autocommit, like Django's default
    return conn


def setup(db_path):
    conn = connect(db_path)
    conn.executescript(
        """
        CREATE TABLE orders_naive (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            amount TEXT NOT NULL
        );
        CREATE TABLE orders_unique (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            amount TEXT NOT NULL,
            UNIQUE (user_id, product_id)
        );
        CREATE TABLE orders_idem (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            amount TEXT NOT NULL,
            UNIQUE (user_id, product_id)
        );
        CREATE TABLE idempotency (
            idem_key TEXT PRIMARY KEY,
            request_hash TEXT NOT NULL,
            status TEXT NOT NULL,           -- PROCESSING / SUCCESS
            response TEXT                   -- cached JSON result
        );
        CREATE TABLE payments (
            order_no TEXT PRIMARY KEY,
            status TEXT NOT NULL,           -- PENDING / PAID / SHIPPED
            paid_at TEXT
        );
        """
    )
    conn.close()


# ── E1: double-click race ─────────────────────────────────────────────
def e1_race(db_path, threads):
    banner(f"E1 用户双击竞态：{threads} 线程同时提交 user=1 的同一笔订单")

    results = {}

    # A. check-then-insert, no constraint (the bug)
    def a_worker(user_id, product_id, amount):
        conn = connect(db_path)
        try:
            row = conn.execute(
                "SELECT COUNT(*) FROM orders_naive WHERE user_id=? AND product_id=?",
                (user_id, product_id),
            ).fetchone()
            time.sleep(BUSINESS_LOGIC_MS / 1000)        # <-- 业务逻辑耗时，窗口变宽
            if row[0] == 0:
                conn.execute(
                    "INSERT INTO orders_naive (user_id, product_id, amount) VALUES (?,?,?)",
                    (user_id, product_id, amount),
                )
                return "created"
            return "skipped"
        finally:
            conn.close()

    with ThreadPoolExecutor(max_workers=threads) as pool:
        list(pool.map(lambda _: a_worker(1, 100, "99.00"), range(threads)))
    count = connect(db_path).execute("SELECT COUNT(*) FROM orders_naive").fetchone()[0]
    results["A"] = count
    print(f"  A 无防护（查-插）           订单 {count:>3} 条  ← 期望 1 条，多出 {count - 1} 条重复")

    # B. unique constraint + swallow IntegrityError
    def b_worker(user_id, product_id, amount):
        conn = connect(db_path)
        try:
            row = conn.execute(
                "SELECT COUNT(*) FROM orders_unique WHERE user_id=? AND product_id=?",
                (user_id, product_id),
            ).fetchone()
            time.sleep(BUSINESS_LOGIC_MS / 1000)
            if row[0] > 0:
                return "skipped"
            try:
                conn.execute(
                    "INSERT INTO orders_unique (user_id, product_id, amount) VALUES (?,?,?)",
                    (user_id, product_id, amount),
                )
                return "created"
            except sqlite3.IntegrityError:
                return "unique-blocked"                 # 兜底生效
        finally:
            conn.close()

    with ThreadPoolExecutor(max_workers=threads) as pool:
        outcomes = list(pool.map(lambda _: b_worker(1, 100, "99.00"), range(threads)))
    count = connect(db_path).execute("SELECT COUNT(*) FROM orders_unique").fetchone()[0]
    results["B"] = count
    blocked = outcomes.count("unique-blocked")
    print(f"  B 唯一约束兜底              订单 {count:>3} 条  | {blocked} 个请求被 IntegrityError 拦下")

    # C. idempotency table: INSERT-first, winner executes, losers read result
    def c_worker(idem_key, user_id, product_id, amount):
        conn = connect(db_path)
        try:
            cur = conn.execute(
                "INSERT OR IGNORE INTO idempotency (idem_key, request_hash, status) "
                "VALUES (?,?, 'PROCESSING')",
                (idem_key, f"{user_id}:{product_id}:{amount}"),
            )
            if cur.rowcount == 1:                       # 抢到执行权
                time.sleep(BUSINESS_LOGIC_MS / 1000)
                cur2 = conn.execute(
                    "INSERT INTO orders_idem (user_id, product_id, amount) VALUES (?,?,?)",
                    (user_id, product_id, amount),
                )
                order_id = cur2.lastrowid
                conn.execute(
                    "UPDATE idempotency SET status='SUCCESS', response=? WHERE idem_key=?",
                    (json.dumps({"order_id": order_id}), idem_key),
                )
                return order_id
            # 没抢到：等结果（简化为轮询一次后读）
            for _ in range(50):
                row = conn.execute(
                    "SELECT status, response FROM idempotency WHERE idem_key=?", (idem_key,)
                ).fetchone()
                if row and row[0] == "SUCCESS":
                    return json.loads(row[1])["order_id"]
                time.sleep(0.005)
            return None
        finally:
            conn.close()

    key = str(uuid.uuid4())
    with ThreadPoolExecutor(max_workers=threads) as pool:
        order_ids = list(pool.map(lambda _: c_worker(key, 1, 100, "99.00"), range(threads)))
    count = connect(db_path).execute("SELECT COUNT(*) FROM orders_idem").fetchone()[0]
    consistent = len(set(order_ids)) == 1 and order_ids[0] is not None
    results["C"] = count
    print(
        f"  C 幂等表（先抢占位）        订单 {count:>3} 条  | "
        f"{threads} 个请求拿到的 order_id {'完全一致' if consistent else '不一致!'} ({order_ids[0]})"
    )
    return results


# ── E2: callback replay + state machine ───────────────────────────────
def e2_replay(db_path, replays):
    banner(f"E2 支付回调重放：同一条「已支付」回调投递 {replays} 次")

    conn = connect(db_path)
    conn.execute("INSERT INTO payments (order_no, status) VALUES ('ORD-2026-001', 'PENDING')")

    # A. naive: UPDATE payments SET status='PAID' WHERE order_no=?   (无条件)
    paid_count = 0
    for _ in range(replays):
        cur = conn.execute(
            "UPDATE payments SET status='PAID', paid_at=datetime('now') WHERE order_no='ORD-2026-001'"
        )
        paid_count += cur.rowcount          # 每次都"成功"，重复执行副作用
    status = conn.execute("SELECT status FROM payments WHERE order_no='ORD-2026-001'").fetchone()[0]
    print(f"  A 无条件更新    「支付成功」逻辑执行了 {paid_count} 次（含发短信/记账） | 终态 {status}")

    # B. state machine: UPDATE ... WHERE status='PENDING'
    conn.execute("UPDATE payments SET status='PENDING' WHERE order_no='ORD-2026-001'")
    accepted = 0
    for _ in range(replays):
        cur = conn.execute(
            "UPDATE payments SET status='PAID', paid_at=datetime('now') "
            "WHERE order_no='ORD-2026-001' AND status='PENDING'"      # 只认 PENDING
        )
        accepted += cur.rowcount           # 只有第一次是 1，其余是 0
    status = conn.execute("SELECT status FROM payments WHERE order_no='ORD-2026-001'").fetchone()[0]
    print(f"  B 条件更新      「支付成功」逻辑执行了 {accepted} 次（其余幂等跳过）   | 终态 {status}")

    # C. illegal transition: SHIPPED → PAID must be rejected
    conn.execute("UPDATE payments SET status='SHIPPED' WHERE order_no='ORD-2026-001'")
    cur = conn.execute(
        "UPDATE payments SET status='PAID' WHERE order_no='ORD-2026-001' AND status='PENDING'"
    )
    illegal_ok = cur.rowcount
    print(f"  C 非法跳转      已发货订单再收「支付」回调 → {'被拒绝 ✅' if illegal_ok == 0 else '竟然成功了 ❌'}")
    conn.close()
    return accepted


# ── E3: idempotency key + request fingerprint ─────────────────────────
def e3_fingerprint(db_path, hits=100):
    banner(f"E3 幂等键 + 请求指纹：同 key 打 {hits} 次，body 不同会怎样")

    def request_hash(body: str) -> str:
        return hashlib.sha256(body.encode()).hexdigest()[:16]

    def call(idem_key, body, execute_business):
        conn = connect(db_path)
        try:
            row = conn.execute(
                "SELECT request_hash, status, response FROM idempotency WHERE idem_key=?",
                (idem_key,),
            ).fetchone()
            if row is None:
                conn.execute(
                    "INSERT INTO idempotency (idem_key, request_hash, status) VALUES (?,?, 'PROCESSING')",
                    (idem_key, request_hash(body)),
                )
                result = execute_business()             # 业务只在这一条路径执行
                conn.execute(
                    "UPDATE idempotency SET status='SUCCESS', response=? WHERE idem_key=?",
                    (json.dumps(result), idem_key),
                )
                return result, "executed"
            if row[1] != "SUCCESS":
                return None, "still-processing"         # 并发中的后来者应等待或 409
            if row[0] != request_hash(body):
                return None, "REJECTED: key 已被其他请求体占用"   # 同 key 不同 body
            return json.loads(row[2]), "replayed"       # 直接返回缓存结果
        finally:
            conn.close()

    # 同 key 同 body 重试 100 次
    key = "idem-" + uuid.uuid4().hex[:8]
    exec_count = 0

    def business():
        nonlocal exec_count
        exec_count += 1
        return {"order_id": 4242}

    outcomes = [call(key, '{"user":1,"product":100}', business) for _ in range(hits)]
    replayed = sum(1 for _, tag in outcomes if tag == "replayed")
    consistent = len({json.dumps(r, sort_keys=True) for r, _ in outcomes}) == 1
    print(f"  同 key + 同 body   ×{hits}: 业务执行 {exec_count} 次 | {replayed} 次复用缓存 | "
          f"响应{'全部一致 ✅' if consistent else '不一致 ❌'}")

    # 同 key 不同 body（用户改了参数重试）
    result, tag = call(key, '{"user":1,"product":200}', business)      # body 变了
    print(f"  同 key + 不同 body ×1 : {tag}（改参重试被识别，避免结果串台）")
    conn = connect(db_path)
    conn.close()
    return exec_count


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--threads", type=int, default=8)
    ap.add_argument("--replays", type=int, default=5)
    args = ap.parse_args()

    banner("E0 环境与参数")
    print(f"  Python     : 3.13.x（标准库 sqlite3，WAL 模式）")
    print(f"  双击线程数 : {args.threads}")
    print(f"  回调重放数 : {args.replays}")
    print(f"  业务耗时   : {BUSINESS_LOGIC_MS} ms（模拟校验/计价，放大查-插窗口）")
    print("  数据库     : 临时 SQLite，跑完自删，不碰 backend/db.sqlite3")

    db_path = os.path.join(tempfile.gettempdir(), "bench_idempotency.sqlite")
    if os.path.exists(db_path):
        os.remove(db_path)
    setup(db_path)

    try:
        e1 = e1_race(db_path, args.threads)
        accepted = e2_replay(db_path, args.replays)
        exec_count = e3_fingerprint(db_path)

        banner("汇总")
        print(f"  双击竞态   期望 1 条订单：无防护 {e1['A']} 条 → 唯一约束 {e1['B']} 条 → 幂等表 {e1['C']} 条")
        print(f"  回调重放   {args.replays} 次投递：无条件更新执行 {args.replays} 次 → 状态机只执行 {accepted} 次")
        print(f"  幂等键     100 次重试：业务只执行 {exec_count} 次")
    finally:
        for suffix in ("", "-wal", "-shm"):
            try:
                os.remove(db_path + suffix)
            except OSError:
                pass


if __name__ == "__main__":
    main()
