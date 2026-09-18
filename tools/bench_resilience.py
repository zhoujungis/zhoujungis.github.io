"""Measure timeout / retry / circuit-breaker / bulkhead behaviour under a slow downstream.

No third-party dependencies. Real threads, real sleeps, real concurrency.

Model
-----
  clients (closed loop, C threads)
      -> server pool (W workers; emulates gunicorn/tomcat worker threads)
          -> downstream executor (large; emulates the network/IO layer)
              -> Downstream (latency + failure profile over time)

Six experiments:
  A. no timeout vs timeout               -> worker-pool exhaustion
  B. retry count 0..3                    -> retry amplification
  C. fixed backoff vs jitter             -> recovery spike (thundering herd)
  D. no breaker vs breaker               -> fail-fast, downstream load, recovery detection
  E. unlimited retries vs retry budget   -> amplification cap
  F. shared pool vs bulkhead             -> dependency isolation
"""

import argparse
import random
import statistics
import threading
import time
from collections import Counter
from concurrent.futures import ThreadPoolExecutor

DOWNSTREAM_EXECUTOR = None  # created in main()


class Downstream:
    """A dependency whose latency/failure profile changes over time."""

    def __init__(self, latency_fn, fail_fn=None, name="downstream"):
        self.latency_fn = latency_fn
        self.fail_fn = fail_fn or (lambda t: False)
        self.name = name
        self.t0 = None
        self.lock = threading.Lock()
        self.calls = 0
        self.inflight = 0
        self.max_inflight = 0
        self.starts = []  # call start timestamps, for QPS histograms

    def start(self):
        self.t0 = time.perf_counter()

    def now(self):
        return time.perf_counter() - self.t0

    def call(self):
        with self.lock:
            self.calls += 1
            self.inflight += 1
            if self.inflight > self.max_inflight:
                self.max_inflight = self.inflight
            t = self.now()
            self.starts.append(t)
        try:
            latency = self.latency_fn(t)
            failing = self.fail_fn(t)
            time.sleep(latency)
            if failing:
                raise DownstreamError("downstream error")
            return "ok"
        finally:
            with self.lock:
                self.inflight -= 1

    def qps_histogram(self, bucket=0.25):
        hist = Counter()
        for t in self.starts:
            hist[int(t // bucket)] += 1
        return hist

    def peak_qps(self, bucket=0.25):
        hist = self.qps_histogram(bucket)
        return (max(hist.values()) / bucket) if hist else 0.0


class DownstreamError(Exception):
    pass


class CircuitOpen(Exception):
    pass


class CircuitBreaker:
    """Time-window failure-rate breaker with half-open probing."""

    def __init__(self, name, window=1.0, min_calls=20, threshold=0.5,
                 cooldown=2.0, probes=3, clock=None):
        self.name = name
        self.window = window
        self.min_calls = min_calls
        self.threshold = threshold
        self.cooldown = cooldown
        self.probes = probes
        self.clock = clock
        self.lock = threading.Lock()
        self.events = []  # (t, ok: bool)
        self.state = "closed"
        self.opened_at = 0.0
        self.probe_left = 0
        self.probe_ok = 0
        self.open_count = 0
        self.rejected = 0

    def _prune(self, now):
        cut = now - self.window
        while self.events and self.events[0][0] < cut:
            self.events.pop(0)

    def allow(self):
        now = self.clock()
        with self.lock:
            self._prune(now)
            if self.state == "open":
                if now - self.opened_at >= self.cooldown:
                    self.state = "half-open"
                    self.probe_left = self.probes
                    self.probe_ok = 0
                else:
                    self.rejected += 1
                    return False
            if self.state == "half-open":
                if self.probe_left <= 0:
                    self.rejected += 1
                    return False
                self.probe_left -= 1
            return True

    def record(self, ok):
        now = self.clock()
        with self.lock:
            self.events.append((now, bool(ok)))
            self._prune(now)
            if self.state == "half-open":
                if ok:
                    self.probe_ok += 1
                    if self.probe_ok >= 1:  # first success closes
                        self.state = "closed"
                        self.events.clear()
                else:
                    self.state = "open"
                    self.opened_at = now
                    self.open_count += 1
                return
            total = len(self.events)
            if total >= self.min_calls:
                fails = sum(1 for _, ok_ in self.events if not ok_)
                if fails / total >= self.threshold:
                    self.state = "open"
                    self.opened_at = now
                    self.open_count += 1
                    self.events.clear()


class RetryBudget:
    """Cap retries at a fraction of recent successful traffic."""

    def __init__(self, ratio=0.1, window=1.0, clock=None):
        self.ratio = ratio
        self.window = window
        self.clock = clock
        self.lock = threading.Lock()
        self.success = 0
        self.retries = 0
        self.window_start = clock()
        self.denied = 0

    def allow(self):
        now = self.clock()
        with self.lock:
            if now - self.window_start >= self.window:
                keep = self.success * 0.5  # decay instead of hard reset
                self.success = keep
                self.retries = 0
                self.window_start = now
            if self.retries <= self.ratio * max(self.success, 10):
                self.retries += 1
                return True
            self.denied += 1
            return False

    def record_success(self):
        with self.lock:
            self.success += 1


class Result:
    def __init__(self, name):
        self.name = name
        self.latencies = []
        self.ok = 0
        self.fail = 0
        self.fallback = 0
        self.rejected = 0

    @property
    def total(self):
        return self.ok + self.fail + self.fallback + self.rejected

    def p(self, q):
        if not self.latencies:
            return 0.0
        data = sorted(self.latencies)
        idx = min(len(data) - 1, int(round((q / 100) * (len(data) - 1))))
        return data[idx]


def call_with_retry(ds, timeout, retries, backoff=0.0, jitter=0.0,
                    breaker=None, budget=None, fallback=None, rng=None):
    """One logical user request. Returns ('ok'|'fallback'|'fail', attempts)."""
    rng = rng or random
    attempts = 0
    for attempt in range(retries + 1):
        if attempt > 0:
            delay = backoff * (2 ** (attempt - 1))
            if jitter:
                delay = rng.uniform(0, delay) if jitter >= 1 else rng.uniform(delay * (1 - jitter), delay)
            time.sleep(delay)
            if budget is not None and not budget.allow():
                return ("fallback" if fallback else "fail"), attempts, "budget"
        if breaker is not None and not breaker.allow():
            if fallback is not None:
                return "fallback", attempts, "open"
            return "fail", attempts, "open"
        attempts += 1
        started = time.perf_counter()
        try:
            future = DOWNSTREAM_EXECUTOR.submit(ds.call)
            future.result(timeout=timeout)
            if breaker is not None:
                breaker.record(True)
            if budget is not None:
                budget.record_success()
            return "ok", attempts, None
        except Exception:
            if breaker is not None:
                breaker.record(False)
    return ("fallback" if fallback else "fail"), attempts, "exhausted"


def run_experiment(name, duration, clients, request_fn, ds_list, collect_fn=None):
    """Closed-loop driver: `clients` threads each loop until `duration` elapses."""
    for ds in ds_list:
        ds.start()
    t0 = time.perf_counter()
    clock = lambda: time.perf_counter() - t0  # noqa: E731
    results = []
    lock = threading.Lock()

    def worker():
        local = []
        while True:
            now = time.perf_counter() - t0
            if now >= duration:
                break
            started = time.perf_counter()
            outcome = request_fn(clock)
            end = time.perf_counter()
            elapsed = end - started
            local.append((outcome, elapsed, now, end - t0))
        with lock:
            results.extend(local)

    def target():
        while True:
            pass

    threads = [threading.Thread(target=worker) for _ in range(clients)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    elapsed = time.perf_counter() - t0

    agg = Result(name)
    attempts_hist = Counter()
    per_second = Counter()
    for outcome, latency, start, end in results:
        agg.latencies.append(latency)
        per_second[int(end)] += 1
        if outcome == "ok":
            agg.ok += 1
        elif outcome == "fallback":
            agg.fallback += 1
        elif outcome == "rejected":
            agg.rejected += 1
        else:
            agg.fail += 1
        if collect_fn:
            collect_fn(outcome, latency, start)
    return agg, elapsed, attempts_hist, per_second


def percentile(values, q):
    if not values:
        return 0.0
    data = sorted(values)
    idx = min(len(data) - 1, int(round((q / 100) * (len(data) - 1))))
    return data[idx]


def fmt(seconds):
    return f"{seconds * 1000:.0f}ms"


# --------------------------------------------------------------------------
# A. no timeout vs timeout
# --------------------------------------------------------------------------

def exp_a(scale=1.0):
    print("\n" + "=" * 72)
    print("A. 没有超时的代价：下游 3 秒就恢复了，你的服务 8 秒还没缓过来")
    print("=" * 72)
    print("   场景：下游 t<3s 期间 RT 从 30ms 劣化到 5s（近乎挂死），3s 后完全恢复")
    W = 20           # server worker threads
    C = 60           # concurrent clients (closed loop)
    DURATION = 8.0
    OUTAGE = 3.0
    rows = []
    for label, timeout in (("无超时 (None)", None), ("超时 200ms", 0.2)):
        ds = Downstream(lambda t: 5.0 if t < OUTAGE else 0.03, name="slow")
        pool = ThreadPoolExecutor(max_workers=W)

        def request(clock, ds=ds, pool=pool, timeout=timeout):
            fut = pool.submit(call_with_retry, ds, timeout, 0)
            try:
                outcome, _, _ = fut.result(timeout=timeout * 3 + 30 if timeout else None)
                return outcome
            except Exception:
                return "fail"

        agg, elapsed, _, per_second = run_experiment(label, DURATION, C, request, [ds])
        rows.append((label, agg, elapsed, ds))
        print(f"{label:14s} 完成 {agg.total:6d} 条 / {elapsed:5.2f}s => 吞吐 {agg.total / elapsed:7.1f}/s | "
              f"成功 {agg.ok:6d} 失败 {agg.fail:6d} | "
              f"p50 {fmt(percentile(agg.latencies, 50)):>8s} "
              f"p99 {fmt(percentile(agg.latencies, 99)):>8s} "
              f"max {fmt(max(agg.latencies)):>8s} | "
              f"下游调用 {ds.calls:6d} 峰值并发 {ds.max_inflight:3d}")
        timeline = " / ".join(str(per_second.get(s, 0)) for s in range(int(elapsed) + 1))
        print(f"{'':14s} 每秒完成数: {timeline}   ← 下游 t=3s 已恢复")
        pool.shutdown(wait=False)
    return rows


# --------------------------------------------------------------------------
# B. retry amplification
# --------------------------------------------------------------------------

def exp_b():
    print("\n" + "=" * 72)
    print("B. 重试放大：下游已经慢了，你还往上面压 3 倍流量")
    print("=" * 72)
    W, C, DURATION = 20, 40, 6.0
    rows = []
    for retries in (0, 1, 2, 3):
        ds = Downstream(lambda t: 1.0, name="slow")
        pool = ThreadPoolExecutor(max_workers=W)

        def request(clock, ds=ds, pool=pool, retries=retries):
            fut = pool.submit(call_with_retry, ds, 0.15, retries, backoff=0.1)
            try:
                outcome, _, _ = fut.result(timeout=30)
                return outcome
            except Exception:
                return "fail"

        agg, elapsed, _, per_second = run_experiment(f"retries={retries}", DURATION, C, request, [ds])
        rows.append((retries, agg, elapsed, ds))
        amp = ds.calls / max(agg.total, 1)
        pool.shutdown(wait=False)
        print(f"retries={retries}  用户请求 {agg.total:5d} | 下游调用 {ds.calls:5d} "
              f"| 放大倍数 x{amp:.2f} | 用户吞吐 {agg.total / elapsed:6.1f}/s "
              f"| 失败率 {agg.fail / max(agg.total, 1) * 100:5.1f}% "
              f"| 下游峰值并发 {ds.max_inflight:3d}")
    return rows


# --------------------------------------------------------------------------
# C. fixed backoff vs jitter (thundering herd at recovery)
# --------------------------------------------------------------------------

def exp_c():
    """Clients retry on their own thread (no server-pool bottleneck), so the
    *timing* of retries is what we measure. Downstream is the bottleneck."""
    print("\n" + "=" * 72)
    print("C. 重试风暴：下游刚恢复，就被整齐划一的重试波二次打死")
    print("=" * 72)
    print("   场景：120 个客户端同步打（模拟定时任务/缓存同时失效），"
          "下游 t∈[1s,5s] 宕机，退避基数 300ms，最多重试 3 次")
    C, DURATION = 120, 9.0
    OUTAGE = (1.0, 5.0)
    THINK = 0.30
    rows = []
    for label, jitter in (("固定退避 (无抖动)", 0.0), ("全抖动 full jitter", 1.0)):
        rng = random.Random(20260918)
        ds = Downstream(lambda t: 1.5 if OUTAGE[0] <= t < OUTAGE[1] else 0.03, name="flaky")
        ds.start()
        stop = threading.Event()
        t0 = time.perf_counter()

        def client(seed):
            rnd = random.Random(seed)
            while not stop.is_set():
                for attempt in range(4):
                    if attempt:
                        base = 0.3 * (2 ** (attempt - 1))
                        delay = rnd.uniform(0, base) if jitter else base
                        time.sleep(delay)
                    try:
                        DOWNSTREAM_EXECUTOR.submit(ds.call).result(timeout=0.12)
                        break
                    except Exception:
                        continue
                time.sleep(THINK)

        threads = [threading.Thread(target=client, args=(i,)) for i in range(C)]
        for t in threads:
            t.start()
        time.sleep(DURATION)
        stop.set()
        for t in threads:
            t.join()

        hist = ds.qps_histogram(0.1)          # 100ms buckets
        total_buckets = int(DURATION / 0.1)
        counts = [hist.get(b, 0) for b in range(total_buckets)]
        check = lambda t: OUTAGE[0] - 0.2 <= t < OUTAGE[1] + 0.3  # noqa: E731
        steady = [c for b, c in enumerate(counts) if not check(b * 0.1)]
        post = [c for b, c in enumerate(counts) if b * 0.1 >= OUTAGE[1] + 0.3]
        peak_all = max(counts) / 0.1
        peak_post = max(post) / 0.1
        mean_post = (sum(post) / len(post)) / 0.1
        mean_all = (sum(steady) / len(steady)) / 0.1
        cv = statistics.pstdev(post) / max(mean_post * 0.1, 1e-9)  # on raw counts
        # timeline around recovery: t = 4.6s .. 6.4s
        window = [counts[int(round((4.6 + 0.1 * k) / 0.1))] for k in range(19)]
        rows.append((label, peak_all, mean_all, peak_post, mean_post, cv, window))
        print(f"{label:20s} 全周期峰值 {peak_all:6.0f}/s | 恢复后峰值 {peak_post:6.0f}/s "
              f"| 恢复后均值 {mean_post:6.0f}/s | 突刺比 x{peak_post / max(mean_post, 1):.2f} "
              f"| 变异系数 CV={cv:.2f}")
        print(f"{'':20s} t=4.6s→6.4s 每 100ms 下游调用数: {' '.join(str(c) for c in window)}")
    return rows


# --------------------------------------------------------------------------
# D. circuit breaker
# --------------------------------------------------------------------------

def open_loop(duration, rate, workers, queue_size, handler, ds):
    """Open-loop driver with a bounded accept queue.

    Requests arrive at a fixed `rate`; when the queue is full the request is
    rejected immediately (HTTP 503), exactly like a saturated server.
    Returns (records, elapsed) where records = [(outcome, latency, submit_t)].
    """
    ds.start()
    t0 = time.perf_counter()
    queue = __import__("queue").Queue(maxsize=queue_size)
    records = []
    lock = threading.Lock()
    stopped = threading.Event()

    def worker():
        while not stopped.is_set():
            try:
                item = queue.get(timeout=0.05)
            except Exception:
                continue
            if item is None:
                break
            submit_t = item
            started = time.perf_counter()
            try:
                outcome = handler()
            except Exception:
                outcome = "fail"
            latency = time.perf_counter() - started
            with lock:
                records.append((outcome, latency, submit_t))
            queue.task_done()

    threads = [threading.Thread(target=worker, daemon=True) for _ in range(workers)]
    for t in threads:
        t.start()

    interval = 1.0 / rate
    sent = 0
    next_at = 0.0
    while True:
        now = time.perf_counter() - t0
        if now >= duration:
            break
        if now >= next_at:
            if not queue.full():
                queue.put(now)
                sent += 1
            else:
                with lock:
                    records.append(("rejected", 0.0, now))
            next_at += interval
        time.sleep(0.0005)
    stopped.set()
    elapsed = time.perf_counter() - t0
    for t in threads:
        t.join(timeout=2)
    return records, elapsed, sent


def exp_d():
    print("\n" + "=" * 72)
    print("D. 熔断器：快速失败 + 停止踩踏 + 自动探测恢复")
    print("=" * 72)
    print("   场景：开环定速 150  req/s，服务 25 worker + 队列 40，"
          "下游 t∈[1s,6s] RT=2s，超时 150ms")
    RATE, W, QSIZE, DURATION = 150, 25, 40, 10.0
    OUTAGE = (1.0, 6.0)
    rows = []
    for label, use_breaker in (("无熔断（超时+2次重试）", False), ("有熔断 + 降级兜底", True)):
        ds = Downstream(lambda t: 2.0 if OUTAGE[0] <= t < OUTAGE[1] else 0.03, name="flaky")
        ds.start()
        breaker = None
        if use_breaker:
            breaker = CircuitBreaker("ds", window=1.0, min_calls=15, threshold=0.5,
                                     cooldown=1.5, probes=3,
                                     clock=lambda: time.perf_counter() - ds.t0)
        first_ok_after = [None]

        def handler(ds=ds, breaker=breaker, probe=first_ok_after):
            outcome, _, _ = call_with_retry(ds, 0.15, 2, backoff=0.1,
                                            breaker=breaker,
                                            fallback="cached" if use_breaker else None)
            if outcome == "ok" and (time.perf_counter() - ds.t0) > OUTAGE[1] and probe[0] is None:
                probe[0] = time.perf_counter() - ds.t0
            return outcome

        records, elapsed, sent = open_loop(DURATION, RATE, W, QSIZE, handler, ds)
        agg = Result(label)
        outage_lat, healthy_lat = [], []
        for outcome, latency, submit_t in records:
            agg.latencies.append(latency)
            if outcome == "ok":
                agg.ok += 1
            elif outcome == "fallback":
                agg.fallback += 1
            elif outcome == "rejected":
                agg.rejected += 1
                continue          # rejected never entered a worker: no latency
            else:
                agg.fail += 1
            (outage_lat if OUTAGE[0] <= submit_t < OUTAGE[1] else healthy_lat).append(latency)
        detect = (first_ok_after[0] - OUTAGE[1]) if first_ok_after[0] else None
        goodput = agg.ok / elapsed
        served = agg.total
        extra = f"熔断触发 {breaker.open_count} 次，快速拒绝 {breaker.rejected} 次" if breaker else "—"
        rows.append((label, agg, ds, detect, outage_lat))
        print(f"{label:22s} 提交 {served:5d} => 成功 {agg.ok:5d} 降级 {agg.fallback:5d} "
              f"失败 {agg.fail:5d} 拒绝 {agg.rejected:5d}")
        print(f"{'':22s} 故障期延迟 p50 {fmt(percentile(outage_lat, 50)):>8s} "
              f"p95 {fmt(percentile(outage_lat, 95)):>8s} | "
              f"下游调用 {ds.calls:5d} | 有效吞吐 {goodput:6.1f}/s | {extra}")
        print(f"{'':22s} 恢复探测延迟: {detect * 1000:.0f}ms" if detect else f"{'':22s} 恢复未被探测")
    return rows


# --------------------------------------------------------------------------
# E. retry budget
# --------------------------------------------------------------------------

def exp_e():
    print("\n" + "=" * 72)
    print("E. 重试预算：给重试装一个总闸门")
    print("=" * 72)
    print("   场景：下游 5% 慢、30% 概率返回错误，客户端最多重试 3 次（理论放大上限 x1.52）")
    W, C, DURATION = 20, 40, 6.0
    rows = []

    for label, ratio in (("不设预算（3 次重试）", None),
                         ("预算 50%", 0.5),
                         ("预算 20%", 0.2)):
        random.seed(7)
        ds = Downstream(lambda t: 0.05, fail_fn=lambda t: random.random() < 0.30, name="partial")
        ds.start()
        budget = RetryBudget(ratio=ratio, clock=lambda: time.perf_counter() - ds.t0) if ratio else None
        pool = ThreadPoolExecutor(max_workers=W)

        def request(clock, ds=ds, pool=pool, budget=budget):
            fut = pool.submit(call_with_retry, ds, 0.15, 3, backoff=0.05,
                              budget=budget, fallback="cached")
            try:
                outcome, _, _ = fut.result(timeout=30)
                return "fallback" if outcome == "fallback" else outcome
            except Exception:
                return "fail"

        agg, elapsed, _, per_second = run_experiment(label, DURATION, C, request, [ds])
        amp = ds.calls / max(agg.total, 1)
        denied = budget.denied if budget else 0
        rows.append((label, agg, elapsed, ds, amp, denied))
        pool.shutdown(wait=False)
        print(f"{label:24s} 用户请求 {agg.total:5d} | 下游调用 {ds.calls:5d} | 放大 x{amp:.2f} "
              f"| 预算拒绝 {denied:5d} | 拿兜底 {agg.fallback:5d} "
              f"| 真实成功率 {agg.ok / max(agg.total, 1) * 100:5.1f}%")

    print("\n   —— 同一套配置，下游彻底不可用（100% 失败）——")
    for label, ratio in (("不设预算（3 次重试）", None), ("预算 20%", 0.2)):
        random.seed(7)
        ds = Downstream(lambda t: 1.0, name="dead")   # 1s RT，远超 150ms 超时 => 必超时
        ds.start()
        budget = RetryBudget(ratio=ratio, clock=lambda: time.perf_counter() - ds.t0) if ratio else None
        pool = ThreadPoolExecutor(max_workers=W)

        def request(clock, ds=ds, pool=pool, budget=budget):
            fut = pool.submit(call_with_retry, ds, 0.15, 3, backoff=0.05,
                              budget=budget, fallback="cached")
            try:
                outcome, _, _ = fut.result(timeout=30)
                return "fallback" if outcome == "fallback" else outcome
            except Exception:
                return "fail"

        agg, elapsed, _, per_second = run_experiment(label, DURATION, C, request, [ds])
        amp = ds.calls / max(agg.total, 1)
        denied = budget.denied if budget else 0
        rows.append((label, agg, elapsed, ds, amp, denied))
        pool.shutdown(wait=False)
        print(f"{label:24s} 用户请求 {agg.total:5d} | 下游调用 {ds.calls:5d} | 放大 x{amp:.2f} "
              f"| 预算拒绝 {denied:5d} | 下游峰值并发 {ds.max_inflight:4d}")
    return rows


# --------------------------------------------------------------------------
# F. bulkhead
# --------------------------------------------------------------------------

def exp_f():
    print("\n" + "=" * 72)
    print("F. 舱壁隔离：别让一个慢依赖拖死另一个健康依赖")
    print("=" * 72)
    C_A, C_B, DURATION = 25, 25, 6.0
    rows = []
    for label, mode in (("共享线程池 (20)", "shared"), ("隔离线程池 (10+10)", "split")):
        slow = Downstream(lambda t: 1.0, name="A-slow")
        fast = Downstream(lambda t: 0.03, name="B-fast")
        if mode == "shared":
            pools = {"A": ThreadPoolExecutor(max_workers=20), "B": ThreadPoolExecutor(max_workers=20)}
            pools["B"] = pools["A"]
        else:
            pools = {"A": ThreadPoolExecutor(max_workers=10), "B": ThreadPoolExecutor(max_workers=10)}

        lat_a, lat_b = [], []

        def worker(which):
            ds = slow if which == "A" else fast
            pool = pools[which]
            t0 = time.perf_counter()
            while time.perf_counter() - t0 < DURATION:
                started = time.perf_counter()
                try:
                    pool.submit(call_with_retry, ds, 0.2, 1).result(timeout=30)
                except Exception:
                    pass
                (lat_a if which == "A" else lat_b).append(time.perf_counter() - started)

        slow.start()
        fast.start()
        threads = [threading.Thread(target=worker, args=("A",)) for _ in range(C_A)]
        threads += [threading.Thread(target=worker, args=("B",)) for _ in range(C_B)]
        t0 = time.perf_counter()
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        elapsed = time.perf_counter() - t0
        rows.append((label, lat_a, lat_b, elapsed))
        print(f"{label:22s} A(慢) p95 {fmt(percentile(lat_a, 95)):>8s} n={len(lat_a):5d} | "
              f"B(健康) p50 {fmt(percentile(lat_b, 50)):>8s} "
              f"p95 {fmt(percentile(lat_b, 95)):>8s} n={len(lat_b):5d} | "
              f"B 吞吐 {len(lat_b) / elapsed:6.1f}/s")
        for p in set(pools.values()):
            p.shutdown(wait=False)
    return rows


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", default="")
    args = parser.parse_args()
    global DOWNSTREAM_EXECUTOR
    DOWNSTREAM_EXECUTOR = ThreadPoolExecutor(max_workers=400)

    only = args.only.upper()
    if only in ("", "A"):
        exp_a()
    if only in ("", "B"):
        exp_b()
    if only in ("", "C"):
        exp_c()
    if only in ("", "D"):
        exp_d()
    if only in ("", "E"):
        exp_e()
    if only in ("", "F"):
        exp_f()

    DOWNSTREAM_EXECUTOR.shutdown(wait=False)
    print("\ndone.")


if __name__ == "__main__":
    main()
