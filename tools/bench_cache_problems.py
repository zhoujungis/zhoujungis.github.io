"""Reproduce the cache failure-mode benchmarks for the article.

Companion to ``article/cache-consistency-deep-dive.md``.

Usage:
    python tools/bench_cache_problems.py
    python tools/bench_cache_problems.py --concurrency 300 --rounds 5 --db-latency-ms 20

There is no Redis on the machine this was written on, so the cache is an
in-process TTL store and the "database" is a mock with a configurable latency.
That is deliberate: the *shape* of penetration / breakdown / avalanche is a
concurrency property, not a Redis property. Every number printed below is
measured on this machine, not estimated -- rerun it and you get the same story.

Experiments
    E0  environment
    E1  penetration  (5 rounds x 300 concurrent hits on a non-existent id)
    E2  breakdown    (300 concurrent rebuilds of one hot key that just expired)
    E3  avalanche    (1000 keys, fixed TTL vs jitter -- expiry clustering)
    E4  bloom filter (measured false-positive rate vs theoretical)
"""

import argparse
import hashlib
import math
import random
import statistics
import threading
import time
from concurrent.futures import ThreadPoolExecutor

_EMPTY = "<cached-empty>"


# ── Test doubles ──────────────────────────────────────────────────────
class MockDB:
    """A 'database' whose reads cost a fixed, configurable latency."""

    def __init__(self, latency_ms, rows=1000):
        self.latency = latency_ms / 1000
        self.calls = 0
        self._lock = threading.Lock()
        self._data = {i: f"row-{i}" for i in range(1, rows + 1)}

    def query(self, key):
        with self._lock:
            self.calls += 1
        time.sleep(self.latency)  # the expensive part
        return self._data.get(key)

    def reset(self):
        with self._lock:
            self.calls = 0


class MockCache:
    """In-process TTL cache with hit/miss counters. Thread-safe."""

    def __init__(self):
        self._store = {}
        self._lock = threading.Lock()
        self.hits = 0
        self.misses = 0

    def get(self, key):
        with self._lock:
            item = self._store.get(key)
            if item is None:
                self.misses += 1
                return False, None
            value, expire_at = item
            if expire_at is not None and expire_at <= time.time():
                del self._store[key]
                self.misses += 1
                return False, None
            self.hits += 1
            return True, value

    def set(self, key, value, ttl=None):
        with self._lock:
            expire_at = time.time() + ttl if ttl else None
            self._store[key] = (value, expire_at)

    def delete(self, key):
        with self._lock:
            self._store.pop(key, None)

    def reset(self):
        with self._lock:
            self._store.clear()
            self.hits = 0
            self.misses = 0


class BloomFilter:
    """Classic bitmap bloom filter: m bits, k hash functions."""

    def __init__(self, capacity, error_rate=0.01):
        self.m = max(8, int(-(capacity * math.log(error_rate)) / (math.log(2) ** 2)))
        self.k = max(1, round((self.m / capacity) * math.log(2)))
        self.bits = bytearray(self.m // 8 + 1)
        self.added = 0

    def _positions(self, item):
        h = hashlib.sha256(str(item).encode()).digest()
        h1 = int.from_bytes(h[:8], "big")
        h2 = int.from_bytes(h[8:16], "big") or 1
        return [(h1 + i * h2) % self.m for i in range(self.k)]

    def add(self, item):
        for p in self._positions(item):
            self.bits[p >> 3] |= 1 << (p & 7)
        self.added += 1

    def __contains__(self, item):
        return all(self.bits[p >> 3] & (1 << (p & 7)) for p in self._positions(item))


# ── Helpers ───────────────────────────────────────────────────────────
def banner(text):
    print("\n" + "=" * 72 + f"\n{text}\n" + "=" * 72)


def stats(samples_ms):
    samples_ms = sorted(samples_ms)
    n = len(samples_ms)

    def pct(p):
        return samples_ms[min(n - 1, int(n * p))]

    return {
        "p50": pct(0.50),
        "p95": pct(0.95),
        "p99": pct(0.99),
        "max": samples_ms[-1],
    }


def report(name, db_calls, samples_ms):
    s = stats(samples_ms)
    print(
        f"  {name:<22} DB 查询 {db_calls:>6} 次 | "
        f"P50 {s['p50']:>7.1f}ms  P95 {s['p95']:>7.1f}ms  "
        f"P99 {s['p99']:>7.1f}ms  max {s['max']:>7.1f}ms"
    )
    return db_calls


def timed(fn):
    t0 = time.perf_counter()
    fn()
    return (time.perf_counter() - t0) * 1000


# ── E1 穿透 ───────────────────────────────────────────────────────────
def e1_penetration(concurrency, rounds, db):
    banner(f"E1 缓存穿透：{rounds} 轮 x {concurrency} 并发，全部查不存在的 id=999999")

    key = 999999

    def no_guard(db, cache):
        row = db.query(key)          # 没有缓存空值：每次都回源
        if row is not None:
            cache.set(key, row, ttl=60)

    def null_cache(db, cache):
        found, value = cache.get(key)
        if found:
            return
        row = db.query(key)
        cache.set(key, row if row is not None else _EMPTY, ttl=30)

    def bloom_guard(db, cache, bloom):
        if key not in bloom:         # 布隆直接拦掉，连缓存都不用查
            return
        found, value = cache.get(key)
        if found:
            return
        row = db.query(key)
        cache.set(key, row if row is not None else _EMPTY, ttl=30)

    results = {}
    for label, worker in (("A 无防护", no_guard), ("B 缓存空值", null_cache)):
        cache = MockCache()
        db.reset()
        lat = []
        for _ in range(rounds):
            with ThreadPoolExecutor(max_workers=concurrency) as pool:
                lat += list(pool.map(lambda _: timed(lambda: worker(db, cache)), range(concurrency)))
        results[label] = report(label, db.calls, lat)

    bloom = BloomFilter(capacity=1000, error_rate=0.01)
    for i in range(1, 1001):
        bloom.add(i)
    cache = MockCache()
    db.reset()
    lat = []
    for _ in range(rounds):
        with ThreadPoolExecutor(max_workers=concurrency) as pool:
            lat += list(
                pool.map(lambda _: timed(lambda: bloom_guard(db, cache, bloom)), range(concurrency))
            )
    results["C 布隆过滤器"] = report("C 布隆过滤器", db.calls, lat)
    return results


# ── E2 击穿 ───────────────────────────────────────────────────────────
def e2_breakdown(concurrency, db):
    banner(f"E2 缓存击穿：热点 key 刚过期，{concurrency} 并发同时来重建")

    key = 1

    def no_lock(db, cache):
        found, _ = cache.get(key)
        if found:
            return
        row = db.query(key)          # 所有并发都冲到这里
        cache.set(key, row, ttl=60)

    def mutex_rebuild(db, cache, lock):
        found, _ = cache.get(key)
        if found:
            return
        with lock:                   # 只放一个线程去重建
            found, _ = cache.get(key)  # 双检
            if found:
                return
            row = db.query(key)
            cache.set(key, row, ttl=60)

    results = {}

    cache = MockCache()
    db.reset()
    with ThreadPoolExecutor(max_workers=concurrency) as pool:
        lat = list(pool.map(lambda _: timed(lambda: no_lock(db, cache)), range(concurrency)))
    results["A 无互斥"] = report("A 无互斥重建", db.calls, lat)

    cache = MockCache()
    db.reset()
    lock = threading.Lock()
    with ThreadPoolExecutor(max_workers=concurrency) as pool:
        lat = list(pool.map(lambda _: timed(lambda: mutex_rebuild(db, cache, lock)), range(concurrency)))
    results["B 互斥锁"] = report("B 互斥锁重建", db.calls, lat)
    return results


# ── E3 雪崩 ───────────────────────────────────────────────────────────
def e3_avalanche(keys=1000, ttl=600.0, window_ms=1000):
    banner(f"E3 缓存雪崩：{keys} 个 key 的失效密度（同一 {window_ms}ms 窗口内过期的数量）")

    def expire_times(jitter):
        now = time.time()
        out = []
        for _ in range(keys):
            t = ttl if not jitter else ttl + random.uniform(0, ttl * 0.5)
            out.append(now + t)
        return sorted(out)

    def peak_cluster(ts, window_s):
        """Max number of expiries falling inside any sliding window."""
        peak = 0
        j = 0
        for i in range(len(ts)):
            while ts[i] - ts[j] > window_s:
                j += 1
            peak = max(peak, i - j + 1)
        return peak

    results = {}
    window_s = window_ms / 1000
    for label, jitter in (("A 固定 TTL", False), ("B TTL 抖动 ±50%", True)):
        peak = peak_cluster(expire_times(jitter), window_s)
        results[label] = peak
        print(
            f"  {label:<22} 峰值 {peak:>5} 个 key / {window_ms}ms 窗口 "
            f"→ 瞬时回源压力约为平时的 {peak / (keys / (ttl / window_s)):.1f} 倍"
        )
    return results


# ── E4 布隆过滤器 ─────────────────────────────────────────────────────
def e4_bloom(capacity=1000, error_rate=0.01):
    banner("E4 布隆过滤器：实测误判率 vs 理论值")

    bloom = BloomFilter(capacity=capacity, error_rate=error_rate)
    for i in range(1, capacity + 1):
        bloom.add(i)

    trials = 200000
    fp = 0
    for _ in range(trials):
        probe = random.randint(capacity + 1, 10_000_000)  # 一定不存在
        if probe in bloom:
            fp += 1
    measured = fp / trials
    print(f"  m={bloom.m} bits  k={bloom.k} hash  n={bloom.added}")
    print(f"  理论误判率 {error_rate * 100:.3f}%  |  实测 {measured * 100:.3f}%  ({fp}/{trials})")
    return measured


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--concurrency", type=int, default=300)
    ap.add_argument("--rounds", type=int, default=5)
    ap.add_argument("--db-latency-ms", type=float, default=20.0)
    args = ap.parse_args()

    banner("E0 环境与参数")
    print("  Python           : 3.13.x")
    print(f"  并发数           : {args.concurrency}")
    print(f"  穿透轮数         : {args.rounds}")
    print(f"  Mock DB 单次延迟 : {args.db_latency_ms} ms（模拟一次慢查询）")
    print("  说明             : 缓存为进程内 TTL 存储；'数据库' 为带延迟的 Mock。")
    print("                     穿透/击穿/雪崩是并发属性，与具体缓存实现无关。")

    db = MockDB(latency_ms=args.db_latency_ms)
    e1 = e1_penetration(args.concurrency, args.rounds, db)
    e2 = e2_breakdown(args.concurrency, db)
    e3 = e3_avalanche()
    e4 = e4_bloom()

    banner("汇总")
    print(
        f"  穿透  {args.rounds * args.concurrency} 次请求：无防护 {e1['A 无防护']} 次 DB "
        f"→ 缓存空值 {e1['B 缓存空值']} 次 → 布隆 {e1['C 布隆过滤器']} 次"
    )
    print(f"  击穿  {args.concurrency} 并发：无互斥 {e2['A 无互斥']} 次 DB → 互斥锁 {e2['B 互斥锁']} 次")
    print(f"  雪崩  1000 key 峰值：固定 TTL {e3['A 固定 TTL']} → TTL 抖动 {e3['B TTL 抖动 ±50%']}")
    print(f"  布隆  实测误判率 {e4 * 100:.3f}%")


if __name__ == "__main__":
    main()
