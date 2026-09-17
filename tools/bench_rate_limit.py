"""Verify the rate limiter implementations used in the rate-limit article.

Fake clock keeps runs deterministic. No third-party dependencies.

Findings from the first run (all expectations corrected here):
  - Sliding window counter V1 (single-bucket estimator) was WRONG: 600/s.
    Fixed by estimating over the FULL window (see SlidingWindowCounter).
  - Leaky bucket allows an initial burst of `capacity` before reaching
    steady state; total in 1s is capacity + rate*(1 - capacity/inflow),
    not simply `rate`. Test expectation corrected.
"""

from collections import deque


class Clock:
    def __init__(self):
        self.t = 0.0

    def advance(self, dt):
        self.t += dt


class FixedWindowLimiter:
    def __init__(self, limit, window, clock):
        self.limit = limit
        self.window = window
        self.clock = clock
        self.count = 0
        self.window_id = int(clock.t // window)

    def allow(self):
        wid = int(self.clock.t // self.window)
        if wid != self.window_id:
            self.window_id = wid
            self.count = 0
        if self.count < self.limit:
            self.count += 1
            return True
        return False


class SlidingWindowLogLimiter:
    def __init__(self, limit, window, clock):
        self.limit = limit
        self.window = window
        self.clock = clock
        self.log = deque()

    def allow(self):
        now = self.clock.t
        while self.log and now - self.log[0] >= self.window:
            self.log.popleft()
        if len(self.log) < self.limit:
            self.log.append(now)
            return True
        return False


class SlidingWindowCounter:
    """Full-window rolling estimate across `buckets` sub-buckets."""

    def __init__(self, limit, window, buckets, clock):
        self.limit = limit
        self.window = window
        self.bucket_size = window / buckets
        self.n = buckets
        self.clock = clock
        self.counts = {}

    def _bucket(self, ts):
        return int(ts // self.bucket_size)

    def allow(self):
        now = self.clock.t
        current = self._bucket(now)
        for b in list(self.counts):
            if b < current - self.n:
                del self.counts[b]

        elapsed = (now % self.bucket_size) / self.bucket_size
        estimate = 0.0
        for b, c in self.counts.items():
            if b == current - self.n:
                weight = max(0.0, 1.0 - elapsed)
            else:
                weight = 1.0
            estimate += c * weight

        if estimate < self.limit:
            self.counts[current] = self.counts.get(current, 0) + 1
            return True
        return False


class TokenBucketLimiter:
    def __init__(self, rate, capacity, clock):
        self.rate = rate
        self.capacity = capacity
        self.clock = clock
        self.tokens = float(capacity)
        self.last_refill = clock.t

    def allow(self, n=1):
        now = self.clock.t
        self.tokens = min(self.capacity, self.tokens + (now - self.last_refill) * self.rate)
        self.last_refill = now
        if self.tokens >= n:
            self.tokens -= n
            return True
        return False


class LeakyBucketLimiter:
    def __init__(self, capacity, leak_rate, clock):
        self.capacity = capacity
        self.leak_rate = leak_rate
        self.clock = clock
        self.water = 0.0
        self.last_leak = clock.t

    def allow(self):
        now = self.clock.t
        self.water = max(0.0, self.water - (now - self.last_leak) * self.leak_rate)
        self.last_leak = now
        if self.water + 1 <= self.capacity:
            self.water += 1
            return True
        return False


def seq(limiter, times):
    p = sum(1 for t in times if limiter.allow())
    return p, len(times) - p


def r(name, passed, expected, lo, hi):
    ok = lo <= passed <= hi
    print(f"[{'OK ' if ok else 'FAIL'}] {name}: passed={passed} (expect ~{expected})")


def main():
    print("Rate limiter verification (fake clock, no dependencies)")
    print("-" * 64)

    # 1. Fixed window 2x boundary overflow
    clock = Clock()
    lim = FixedWindowLimiter(10, 1.0, clock)
    clock.t = 0.99
    p1, _ = seq(lim, [0.99] * 10)
    clock.t = 1.01
    p2, _ = seq(lim, [1.01] * 10)
    r("Fixed window boundary overflow", p1 + p2, "20 = 2x", 20, 20)

    # 2. Sliding log: no overflow
    clock = Clock()
    lim = SlidingWindowLogLimiter(10, 1.0, clock)
    clock.t = 0.99
    p1, _ = seq(lim, [0.99] * 10)
    clock.t = 1.01
    p2, _ = seq(lim, [1.01] * 10)
    r("Sliding window log (no overflow)", p1 + p2, 10, 10, 10)

    # 3. Sliding window counter: uniform 1000 req in 1s, limit=100
    for buckets in (6, 10):
        clock = Clock()
        lim = SlidingWindowCounter(100, 1.0, buckets, clock)
        p = sum(1 for i in range(1000) if setattr(clock, "t", i / 1000.0) is None and lim.allow())
        r(f"Sliding window counter (buckets={buckets})", p, 100, 99, 101)

    # 4. Token bucket: initial burst = capacity, then rate
    clock = Clock()
    lim = TokenBucketLimiter(100, 100, clock)
    p = 0
    for i in range(500):
        if lim.allow():
            p += 1
        clock.advance(0.002)
    r("Token bucket burst (cap=rate=100, 1s)", p, "~200", 195, 205)

    # 5. Token bucket drained: pure rate
    clock = Clock()
    lim = TokenBucketLimiter(100, 100, clock)
    lim.tokens = 0.0
    p = sum(1 for i in range(1000) if setattr(clock, "t", i / 1000.0) is None and lim.allow())
    r("Token bucket drained (pure rate)", p, 100, 99, 101)

    # 6. Leaky bucket: initial fill = capacity, then constant leak rate
    clock = Clock()
    lim = LeakyBucketLimiter(100, 100, clock)
    p = sum(1 for i in range(1000) if setattr(clock, "t", i / 1000.0) is None and lim.allow())
    r("Leaky bucket (cap=rate=100, 1s)", p, "~200 (100 fill + 100 leak)", 195, 205)

    # 7. Leaky bucket steady-state rate after initial fill
    clock = Clock()
    lim = LeakyBucketLimiter(100, 100, clock)
    passed_t = []
    for i in range(1000):
        clock.t = i / 1000.0
        if lim.allow():
            passed_t.append(clock.t)
    steady = [t for t in passed_t if t >= 0.2]
    rate = len(steady) / 0.8 if steady else 0
    ok = 98 <= rate <= 102
    print(f"[{'OK ' if ok else 'FAIL'}] Leaky bucket steady-state rate: "
          f"{rate:.0f}/s (expect ~100/s)")

    print("-" * 64)
    print("done")


if __name__ == "__main__":
    main()
