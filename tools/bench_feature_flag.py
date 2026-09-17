"""Feature-flag experiments for the article "灰度发布与特性开关".

Everything here is reproducible: pure stdlib, fixed inputs, no network.

Sections
  1. The modulo bug: growing a rollout reshuffles existing users
  2. Stable bucketing in a fixed bucket space
  3. Target vs observed rollout percentage
  4. Distribution uniformity
  5. Multi-instance determinism (no shared state)
  6. Per-flag salt decorrelation
  7. Evaluation cost: hash vs cached lookup vs remote call
  8. Sticky assignment
  9. Kill-switch fail-safe behaviour
"""

import hashlib
import time
from collections import Counter

BUCKET_SPACE = 10_000


# ── Hashing helpers ───────────────────────────────────────────────────
def _u64(key: str, salt: str = "") -> int:
    raw = f"{salt}:{key}".encode()
    return int(hashlib.blake2b(raw, digest_size=8).hexdigest(), 16)


def hash_user(user_id: str) -> int:
    """Stable 64-bit hash for a user id."""
    return _u64(user_id, "user")


def stable_bucket(user_id: str, salt: str = "flag", n: int = BUCKET_SPACE) -> int:
    """Stable bucket in [0, n). Independent of the rollout percentage."""
    return _u64(user_id, salt) % n


def in_rollout(user_id: str, percent: float, salt: str = "flag",
               n: int = BUCKET_SPACE) -> bool:
    return stable_bucket(user_id, salt, n) < n * percent / 100


def naive_modulo(user_id: str, percent: float, buckets: int) -> bool:
    """The classic bug: bucket count depends on the rollout size."""
    return (hash_user(user_id) % buckets) < buckets * percent / 100


# ── Tests ─────────────────────────────────────────────────────────────
def t1_modulo_reshuffle():
    users = [f"user-{i}" for i in range(20_000)]

    s10 = {u for u in users if in_rollout(u, 10, "rel-checkout")}
    s20 = {u for u in users if in_rollout(u, 20, "rel-checkout")}
    kept_stable = len(s10 & s20) / len(s10) * 100

    n10 = {u for u in users if naive_modulo(u, 10, 10)}
    n20 = {u for u in users if naive_modulo(u, 20, 20)}
    kept_naive = len(n10 & n20) / len(n10) * 100 if n10 else 0

    print("[1] 灰度从 10% 扩到 20% 后，原有用户是否保持")
    print(f"      固定桶空间（正确）: 保留 {kept_stable:6.1f}%  "
          f"{'OK' if kept_stable > 99.9 else 'FAIL'}")
    print(f"      动态取模（错误）  : 保留 {kept_naive:6.1f}%  <- 一半用户被踢出")
    return kept_stable, kept_naive


def t2_percentage_accuracy():
    users = [f"user-{i}" for i in range(200_000)]
    print("[2] 目标百分比 vs 实测百分比（20 万用户）")
    rows = []
    for target in (1, 5, 10, 25, 50, 90):
        hit = sum(1 for u in users if in_rollout(u, target, "rel-x"))
        actual = hit / len(users) * 100
        rows.append((target, actual, actual - target))
        print(f"      目标 {target:>3}%  ->  实测 {actual:7.3f}%  "
              f"(偏差 {actual - target:+.3f}pp)")
    return rows


def t3_uniformity():
    users = [f"user-{i}" for i in range(200_000)]
    buckets = 10
    counts = Counter(stable_bucket(u, "rel-x", buckets) for u in users)
    ideal = len(users) / buckets
    worst = max(abs(c - ideal) / ideal * 100 for c in counts.values())
    print(f"[3] 分桶均匀性（{buckets} 桶）: 最大偏差 {worst:.2f}%  "
          f"{'OK' if worst < 5 else 'FAIL'}")
    return worst


def t4_multi_instance():
    users = [f"user-{i}" for i in range(5_000)]
    inst = [{u: stable_bucket(u, "rel-checkout") for u in users} for _ in range(5)]
    base = inst[0]
    mism = sum(1 for i in inst[1:] for u in users if i[u] != base[u])
    print(f"[4] 5 个实例各自计算 5000 用户 → 不一致数: {mism}  "
          f"{'OK（纯函数，无需共享状态）' if mism == 0 else 'FAIL'}")
    return mism


def t5_salt_decorrelation():
    users = [f"user-{i}" for i in range(50_000)]

    a1 = {u for u in users if stable_bucket(u, "same-salt") < 2000}
    a2 = {u for u in users if stable_bucket(u, "same-salt") < 2000}
    same = len(a1 & a2) / len(a1) * 100

    b1 = {u for u in users if stable_bucket(u, "flag-A") < 2000}
    b2 = {u for u in users if stable_bucket(u, "flag-B") < 2000}
    diff = len(b1 & b2) / len(b1) * 100

    print("[5] 两个 20% 灰度实验的用户重叠率")
    print(f"      共用 salt : {same:5.1f}%  <- 同一批人，实验互相污染")
    print(f"      独立 salt : {diff:5.1f}%  <- 相互独立 "
          f"{'OK' if 18 <= diff <= 22 else 'CHECK'}")
    return same, diff


def t6_eval_cost():
    N = 200_000
    print(f"[6] 评估开销（{N:,} 次）")

    costs = {}
    for name in ("md5", "sha256", "blake2b"):
        def fn(i, _name=name):
            raw = f"flag:user-{i}".encode()
            if _name == "md5":
                return int(hashlib.md5(raw).hexdigest()[:8], 16) % BUCKET_SPACE
            if _name == "sha256":
                return int(hashlib.sha256(raw).hexdigest()[:8], 16) % BUCKET_SPACE
            return int(hashlib.blake2b(raw, digest_size=8).hexdigest(), 16) % BUCKET_SPACE

        t0 = time.perf_counter()
        for i in range(N):
            fn(i)
        ms = (time.perf_counter() - t0) * 1000
        costs[name] = ms / N * 1000
        print(f"      算哈希 {name:>8}: {ms:7.1f} ms  = {ms / N * 1000:6.3f} us/次")

    cfg = {"enabled": True, "percent": 25}
    pre = [i % BUCKET_SPACE for i in range(N)]
    t0 = time.perf_counter()
    hits = 0
    for b in pre:
        if cfg["enabled"] and b < cfg["percent"] * 100:
            hits += 1
    ms = (time.perf_counter() - t0) * 1000
    cached = ms / N * 1000
    print(f"      读缓存 + 比较   : {ms:7.1f} ms  = {cached:6.3f} us/次  "
          f"({hits:,} 次命中)")

    for rtt in (1, 5, 20):
        us = rtt * 1000
        print(f"      远程评估 @{rtt:>2}ms RTT: {us:7.0f} us/次  "
              f"({us / cached:,.0f}x 读缓存)")
    return costs, cached


def t7_sticky():
    u = "user-12345"
    answers = {in_rollout(u, 30, "rel-x") for _ in range(1000)}
    b1, b2 = stable_bucket(u, "rel-x"), stable_bucket(u, "rel-x")
    print(f"[7] 同一用户 1000 次评估结果集合: {answers}  "
          f"{'OK' if len(answers) == 1 else 'FAIL'}")
    print(f"      桶号可复现: {b1} == {b2}  {'OK' if b1 == b2 else 'FAIL'}")


def t8_kill_switch():
    def evaluate(remote, default):
        return default if remote is None else remote

    print("[8] 开关服务不可用时的兜底（None = 拉不到配置）")
    print(f"      default=True  兜底 -> {evaluate(None, True)}  (风险)")
    print(f"      default=False 兜底 -> {evaluate(None, False)}  "
          f"{'OK（fail-safe）' if evaluate(None, False) is False else 'FAIL'}")
    print("      时间滞后: 配置每 5s 刷新一次 → Kill Switch 最长 5s 生效")


if __name__ == "__main__":
    print("=" * 68)
    print("特性开关 / 灰度发布 实测（纯标准库，结果可复现）")
    print("=" * 68)
    t1_modulo_reshuffle()
    print()
    t2_percentage_accuracy()
    print()
    t3_uniformity()
    print()
    t4_multi_instance()
    print()
    t5_salt_decorrelation()
    print()
    t6_eval_cost()
    print()
    t7_sticky()
    print()
    t8_kill_switch()
    print("=" * 68)
