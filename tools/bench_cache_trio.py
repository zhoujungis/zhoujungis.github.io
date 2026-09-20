"""Advanced cache failure-mode benchmarks for the trio follow-up article.

Companion to ``article/cache-trio-deep-dive.md`` (the deeper follow-up to
``cache-consistency-deep-dive.md``).

Usage:
    python tools/bench_cache_trio.py
    python tools/bench_cache_trio.py --concurrency 500 --n-bloom 200000

No Redis on this machine either -- same rationale as bench_cache_problems.py:
the phenomena measured here (call-amplification, false-positive rates,
cache-layer traffic) are concurrency/probability properties, not Redis
properties. Every number is measured on this machine, not estimated.

Experiments
    E0  environment
    E1  singleflight    (N concurrent misses on the same key -> how many DB calls)
    E2  bloom params    (target p = 5% / 1% / 0.1% -> memory, k, measured FPR)
    E3  local cache     (skewed key popularity: requests, Redis ops, p99 with/without L1)
"""

import argparse
import hashlib
import math
import platform
import random
import statistics
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor


# ── E1: singleflight ─────────────────────────────────────────────────


class MockDB:
    def __init__(self, latency_ms, rows=10_000):
        self.latency = latency_ms / 1000
        self.calls = 0
        self._lock = threading.Lock()
        self._data = {i: f"row-{i}" for i in range(1, rows + 1)}

    def query(self, key):
        with self._lock:
            self.calls += 1
        time.sleep(self.latency)
        return self._data.get(key)

    def reset(self):
        with self._lock:
            self.calls = 0


class FlightGroup:
    """Minimal singleflight: coalesce concurrent loads of the same key.

    The first caller runs the loader; everyone else blocks on its future.
    Exceptions are shared with the followers (error sharing), like Go's
    golang.org/x/sync/singleflight.
    """

    def __init__(self):
        self._lock = threading.Lock()
        self._inflight: dict[str, threading.Event] = {}
        self._results: dict[str, tuple] = {}

    def run(self, key, fn):
        with self._lock:
            event = self._inflight.get(key)
            owner = event is None
            if owner:
                event = threading.Event()
                self._inflight[key] = event
        if not owner:
            event.wait()
            result = self._results.get(key, (None, None))
            if result[1] is not None:
                raise result[1]
            return result[0]
        try:
            value = fn()
            self._results[key] = (value, None)
            return value
        except Exception as exc:  # noqa: BLE001 - deliberate error sharing
            self._results[key] = (None, exc)
            raise
        finally:
            # Publish the result BEFORE waking the followers: they read
            # ``self._results[key]`` right after the event fires, so the
            # entry is kept until the next flight for the same key.
            with self._lock:
                del self._inflight[key]
            event.set()


def e1_singleflight(concurrency, db_latency_ms):
    db = MockDB(db_latency_ms)
    flights = FlightGroup()

    def plain_load():
        return db.query(42)  # every thread misses -> every thread hits the DB

    def flight_load():
        return flights.run("item:42", lambda: db.query(42))

    print(f"\n── E1  singleflight: {concurrency} concurrent misses, "
          f"DB latency {db_latency_ms} ms ──")
    for name, fn in (("no singleflight (naive)", plain_load),
                     ("singleflight", flight_load)):
        db.reset()
        t0 = time.perf_counter()
        with ThreadPoolExecutor(max_workers=concurrency) as pool:
            list(pool.map(lambda _: fn(), range(concurrency)))
        elapsed = time.perf_counter() - t0
        print(f"    {name:<24} DB calls: {db.calls:>5}  "
              f"wall time: {elapsed * 1000:8.1f} ms  "
              f"amplification: x{db.calls / concurrency:.2f}")


# ── E2: bloom filter parameters ──────────────────────────────────────

class Bloom:
    """Standard bloom filter with double hashing (Kirsch-Mitzenmacher)."""

    def __init__(self, expected_items: int, target_fp: float):
        self.m = math.ceil(-expected_items * math.log(target_fp) / (math.log(2) ** 2))
        self.k = max(1, round(self.m / expected_items * math.log(2)))
        self.bits = bytearray((self.m + 7) // 8)
        self.fp_count = 0

    def _indexes(self, item: str):
        digest = hashlib.sha256(item.encode()).digest()
        h1 = int.from_bytes(digest[:8], "big")
        h2 = int.from_bytes(digest[8:16], "big") | 1
        for i in range(self.k):
            yield (h1 + i * h2) % self.m

    def add(self, item: str):
        for idx in self._indexes(item):
            self.bits[idx >> 3] |= 1 << (idx & 7)

    def __contains__(self, item: str) -> bool:
        return all(self.bits[idx >> 3] >> (idx & 7) & 1 for idx in self._indexes(item))


def e2_bloom(n, targets):
    print(f"\n── E2  bloom filter: n = {n:,} items ──")
    print("    target p   m (bits)   m/n   k   memory    measured FP   theoretical")
    random.seed(2026)
    members = [f"item-{i}" for i in range(n)]
    for p in targets:
        bloom = Bloom(n, p)
        for item in members:
            bloom.add(item)
        probes = 100_000
        false_pos = sum(1 for i in range(probes)
                        if f"miss-{i}" in bloom)
        measured = false_pos / probes
        theoretical = (1 - math.exp(-bloom.k * n / bloom.m)) ** bloom.k
        print(f"    {p:>7.3f}   {bloom.m:>9,}  {bloom.m / n:>5.1f}  {bloom.k:>2}  "
              f"{len(bloom.bits) / 1e6:>6.2f}MB   {measured:>10.4%}   {theoretical:>10.4%}")


# ── E3: local cache (L1) under skewed popularity ─────────────────────

def zipf_keys(n_keys, n_requests, seed=7):
    rng = random.Random(seed)
    weights = [1 / (i + 1) for i in range(n_keys)]
    return [f"article:{rng.choices(range(n_keys), weights)[0]}" for _ in range(n_requests)]


def e3_local_cache_fixed(n_requests, n_keys, redis_latency_ms):
    keys = zipf_keys(n_keys, n_requests)
    print(f"\n── E3  local cache: {n_requests:,} requests over {n_keys:,} keys "
          f"(skewed popularity), Redis latency {redis_latency_ms} ms ──")

    def run(use_l1: bool):
        redis_ops = 0
        l1: dict[str, float] = {}
        l1_cap = max(1, n_keys // 10)   # 10% of key space in memory
        l1_ttl = 1.0                    # 1 s, well below Redis TTL
        latencies = []
        for key in keys:
            t0 = time.perf_counter()
            now = time.monotonic()
            if use_l1:
                exp = l1.get(key)
                if exp is not None and exp > now:
                    latencies.append(time.perf_counter() - t0)
                    continue
                if exp is not None:
                    del l1[key]
            redis_ops += 1
            time.sleep(redis_latency_ms / 1000)
            if use_l1:
                if len(l1) >= l1_cap:
                    l1.pop(next(iter(l1)))  # FIFO eviction, good enough here
                l1[key] = time.monotonic() + l1_ttl
            latencies.append(time.perf_counter() - t0)
        total_redis = redis_ops * redis_latency_ms / 1000
        return redis_ops, total_redis, statistics.quantiles(latencies, n=20)[-1]

    for label, use_l1 in (("no local cache", False), ("with L1 (cap 10% keys, TTL 1s)", True)):
        redis_ops, total_redis, p95 = run(use_l1)
        print(f"    {label:<32} Redis ops: {redis_ops:>8,}  "
              f"Redis time: {total_redis * 1000:>9.0f} ms  "
              f"p95 latency: {p95 * 1000:6.3f} ms  "
              f"L1 hit-rate: {1 - redis_ops / n_requests:.1%}")


# ── main ──────────────────────────────────────────────────────────────

def _raise_timer_resolution():
    """Windows: time.sleep(0.001) costs ~15 ms by default; ask for 1 ms."""
    if platform.system() == "Windows":
        import ctypes

        winmm = ctypes.windll.winmm
        winmm.timeBeginPeriod(1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--concurrency", type=int, default=300)
    parser.add_argument("--db-latency-ms", type=int, default=20)
    parser.add_argument("--n-bloom", type=int, default=100_000)
    parser.add_argument("--n-requests", type=int, default=10_000)
    parser.add_argument("--n-keys", type=int, default=1_000)
    parser.add_argument("--redis-latency-ms", type=float, default=1.0)
    args = parser.parse_args()

    print("══ cache trio advanced benchmarks ══")
    _raise_timer_resolution()
    print(f"E0  python {platform.python_version()} on {platform.system()} "
          f"{platform.release()} ({platform.machine()})")

    e1_singleflight(args.concurrency, args.db_latency_ms)
    e2_bloom(args.n_bloom, (0.05, 0.01, 0.001))
    e3_local_cache_fixed(args.n_requests, args.n_keys, args.redis_latency_ms)


if __name__ == "__main__":
    sys.exit(main())
