"""Benchmark: distributed unique-ID generation.

Simulates and measures:
  1. Snowflake ID bit-layout sanity (time-ordered, 4096 ids/ms/worker)
  2. Snowflake under clock rollback: naive vs wait/last-ts guard (virtual clock)
  3. Throughput comparison: UUID4 vs Snowflake vs segment (号段) allocation

Pure stdlib, deterministic (seeded). Run: python tools/bench_distributed_id.py
"""

import random
import time
import uuid

random.seed(7)

# ── 1. snowflake layout ───────────────────────────────────────────────
TIMESTAMP_BITS, WORKER_BITS, SEQ_BITS = 41, 10, 12
SEQ_MASK = (1 << SEQ_BITS) - 1


def snowflake(ts_ms, worker, seq):
    return (ts_ms << 22) | (worker << SEQ_BITS) | seq


a = snowflake(1_000, 1, 0)
b = snowflake(1_001, 999, SEQ_MASK)
print(f"layout: ts={TIMESTAMP_BITS}b worker={WORKER_BITS}b seq={SEQ_BITS}b "
      f"-> ordered={b > a}, ids/ms/worker={SEQ_MASK + 1}, "
      f"ts-range={2**TIMESTAMP_BITS / 1000 / 86400 / 365:.0f} years")

# ── 2. clock rollback simulation (virtual clock, NTP step -50ms) ──────
N = 100_000
ROLLBACKS = 200          # injected rollback events during the run
ROLLBACK_MS = 50         # each rollback: clock steps back 50 ms


def gen_naive():
    """Standard but unguarded: seq++ within the same ms, resets on any ts change."""
    ids, collisions = set(), 0
    clock, last_ts, seq = 1_700_000_000_000, 0, 0
    events = sorted(random.sample(range(N), ROLLBACKS))
    ev = 0
    for i in range(N):
        if ev < len(events) and events[ev] == i:
            clock -= ROLLBACK_MS      # NTP steps the clock backwards
            ev += 1
        clock += 1                    # 1 ms of "real time" per id
        if clock == last_ts:
            seq += 1
        else:
            last_ts, seq = clock, 0
        fid = snowflake(clock, 1, seq)
        if fid in ids:
            collisions += 1
        ids.add(fid)
    return collisions


def gen_guarded():
    """Standard guard: never emit with ts <= last_ts (spin until clock passes)."""
    ids, collisions, spins = set(), 0, 0
    clock, last_ts, seq = 1_700_000_000_000, 0, 0
    events = sorted(random.sample(range(N), ROLLBACKS))
    ev = 0
    for i in range(N):
        if ev < len(events) and events[ev] == i:
            clock -= ROLLBACK_MS
            ev += 1
        clock += 1
        ts = clock
        while ts <= last_ts:
            spins += 1                # busy-wait for the clock to catch up
            ts = last_ts + 1
        last_ts = ts
        fid = snowflake(ts, 1, seq)
        if fid in ids:
            collisions += 1
        ids.add(fid)
    return collisions, spins


c_naive = gen_naive()
c_g, spins = gen_guarded()
print(f"clock rollback x{ROLLBACKS}: naive collisions={c_naive}, "
      f"guarded collisions={c_g} (guarded spins={spins})")

# ── 3. throughput: uuid4 vs snowflake vs segment ──────────────────────
N2 = 200_000

t0 = time.perf_counter()
for _ in range(N2):
    uuid.uuid4()
t_uuid = time.perf_counter() - t0

t0 = time.perf_counter()
last_ts, seq = 0, 0
for _ in range(N2):
    now = int(time.perf_counter() * 1000)
    if now == last_ts:
        seq = (seq + 1) & SEQ_MASK
    else:
        last_ts, seq = now, 0
    _ = snowflake(now, 1, seq)
t_snow = time.perf_counter() - t0

SEG = 10_000
print(f"throughput ({N2:,} ids): uuid4={N2/t_uuid:,.0f}/s  snowflake={N2/t_snow:,.0f}/s")
print(f"segment mode: {N2//SEG} db round-trips for {N2:,} ids "
      f"(at ~1ms/trip -> {N2/((N2//SEG)*0.001):,.0f} ids/s local ceiling)")
