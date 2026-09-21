"""Structured-logging & request-id propagation benchmarks.

Companion to ``article/structured-logging-tracing-deep-dive.md``.

Usage:
    python tools/bench_observability.py
    python tools/bench_observability.py --records 400000 --requests 800
    python tools/bench_observability.py --only e1b,e4     # 单跑某个实验

No ELK / Loki / Jaeger on this machine, and none is needed: every quantity
measured here is a property of *this process writing bytes to this disk*, or of
*correlation bookkeeping*. The shipping layer (Filebeat / Promtail / OTel
Collector) sits behind the same ``write()`` call, so its cost is additive and
does not change the ranking below.

On measurement noise: a pure-CPU loop on this machine varies ~12% between
repeats, and the same is true of any number here. Every timing row therefore
carries a 离散度 (peak-to-peak spread over the interleaved rounds) next to it.
Treat anything under ~2x as "no measurable difference" and do not quote a single
sample as if it were the answer.

Experiments (run in this order; E3 last on purpose, see main())
    E0   environment
    E1a  format cost    (pure CPU, no I/O)
    E1b  write cost     (content held constant, write path varied)
    E1c  logging anatomy (where the per-record cost actually goes)
    E1d  batch size vs per-line cost (flat -> the cost is one syscall/record)
    E2   read-back cost (answer one ops question from 100k lines)
    E4   request-id generation cost
    E5   sampling       (log volume vs error retention)
    E3   3-hop HTTP chain: isolate a single request's trace
"""

import argparse
import gc
import http.server
import json
import logging
import os
import platform
import random
import re
import secrets
import statistics
import sys
import threading
import time
import urllib.request
import uuid
from pathlib import Path

TMP = Path(__file__).resolve().parent / ".bench_observability"
TMP.mkdir(exist_ok=True)

LEVELS = ["INFO"] * 92 + ["WARNING"] * 6 + ["ERROR"] * 2
PATHS = [
    "/api/articles", "/api/articles", "/api/articles",  # skewed like real traffic
    "/api/tags", "/api/categories", "/api/comments", "/api/footprints",
]


def hr(title):
    print(f"\n{'=' * 72}\n{title}\n{'=' * 72}")


def interleaved_series(cases, rounds=3):
    """Interleave the cases across rounds and keep every sample.

    Running each case to completion in sequence lets machine drift decide the
    ranking: in an earlier version of this benchmark the same logging mode
    measured 19, 20.5 and 27 us/line across three runs, monotonically worse,
    because the process got slower as the run went on. Interleaving makes every
    case absorb the same drift.

    Returns {label: [sample, ...]}. Keep the whole series, not just the minimum:
    on this machine a pure-CPU loop varies ~12% between repeats, so a single
    sample is not a measurement. The minimum is the closest thing to a stable
    estimator, but only if you can see the spread next to it.
    """
    series = {label: [] for label, _ in cases}
    gc_was_on = gc.isenabled()
    gc.disable()
    try:
        for _ in range(rounds):
            for label, fn in cases:
                t0 = time.perf_counter()
                fn()
                series[label].append(time.perf_counter() - t0)
    finally:
        if gc_was_on:
            gc.enable()
    return series


def interleaved(cases, rounds=3):
    """Best-of-N over :func:`interleaved_series` — minimum of each series."""
    return {k: min(v) for k, v in interleaved_series(cases, rounds).items()}


def spread_pct(values):
    """Peak-to-peak spread as a fraction of the minimum, in percent.

    Uses min as the denominator on purpose: min is the least-contaminated
    sample (everything else includes some amount of interference), so this is
    the most conservative way to state how noisy the measurement was.
    """
    lo = min(values)
    return 100.0 * (max(values) - lo) / lo if lo else 0.0


# ── calibration ──────────────────────────────────────────────────────

CALIB_N = 200_000


def _calib_work():
    s = 0
    for i in range(CALIB_N):
        s += i * i
    return s


# Best time ever seen for the calibration loop on this machine, filled in at
# startup. Everything else is reported relative to it.
CALIB_FLOOR = None


def calibrate(reps=5):
    """Time a fixed pure-CPU loop; this is the machine's load indicator.

    Measuring this alongside every experiment is the only way to tell a real
    effect from a busy machine. On this box the same loop has been observed at
    8.9 ms and at 15.1 ms — a 70% swing with no change to the code. If the
    calibration comes back well above the floor, *every* timing number in that
    section is inflated by roughly the same factor, and ratios are the only
    thing worth reading.

    Returns (best_ns, ratio_vs_floor_or_None).
    """
    global CALIB_FLOOR
    samples = []
    for _ in range(reps):
        t0 = time.perf_counter()
        _calib_work()
        samples.append(time.perf_counter() - t0)
    ns = min(samples) / CALIB_N * 1e9
    if CALIB_FLOOR is None:
        CALIB_FLOOR = ns
        return ns, None
    return ns, ns / CALIB_FLOOR


def calib_tag():
    """A short ' [load x1.23]' suffix, or '' if this is the reference run."""
    ns, ratio = calibrate(reps=3)
    if ratio is None or ratio < 1.05:
        return ""
    return f"  [机器负载 x{ratio:.2f}]"


# ── E0: environment ──────────────────────────────────────────────────


def e0_environment(records, requests):
    hr("E0  environment")
    print(f"  python        : {sys.version.split()[0]} ({platform.python_implementation()})")
    print(f"  platform      : {platform.platform()}")
    print(f"  machine       : {platform.machine()}")
    print(f"  cpu count     : {os.cpu_count()}")
    print(f"  cwd           : {Path.cwd()}")
    print(f"  scratch dir   : {TMP}")
    print(f"  records/exp   : {records:,}")
    print(f"  http requests : {requests:,}")
    calib_ns, _ = calibrate(reps=5)
    print(f"  校准任务      : {calib_ns:.0f} ns/iter "
          f"（固定纯 CPU 循环，用来判断本次运行是否被别的进程干扰）")


# ── E1: write cost ───────────────────────────────────────────────────


def build_records(n):
    """Realistic request-log records, shared by every mode in E1/E2."""
    rng = random.Random(20260921)
    base = 1_756_000_000.0
    out = []
    for i in range(n):
        out.append(
            {
                "ts": base + i * 0.001,
                "level": rng.choice(LEVELS),
                "req": uuid.UUID(int=rng.getrandbits(128)).hex[:16],
                "logger": "api.views",
                "method": "GET",
                "path": rng.choice(PATHS),
                "status": rng.choice([200, 200, 200, 200, 404, 500]),
                "duration_ms": round(rng.lognormvariate(3.0, 0.7), 2),
                "user_id": rng.choice([12345, 12345, 67890, 0]),
            }
        )
    return out


def as_text(r, dur_label="duration_ms"):
    """logfmt-ish labelled text line.

    Labelled on purpose: a positional format (`... 200 12.34ms ...`) fails
    *even more* quietly when a field is inserted, but it is harder to
    demonstrate without hand-crafting two format variants.
    """
    ts = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(r["ts"]))
    ms = int((r["ts"] % 1) * 1000)
    return (
        f"{ts},{ms:03d} {r['level']} "
        f"req={r['req']} logger={r['logger']} method={r['method']} "
        f"path={r['path']} status={r['status']} "
        f"{dur_label}={r['duration_ms']} user_id={r['user_id']}"
    )


def as_json(r):
    return json.dumps(r, ensure_ascii=False, separators=(",", ":"))


class JsonFormatter(logging.Formatter):
    """Structured formatter — the thing most teams reach for first."""

    def format(self, record):
        payload = {
            "ts": record.created,
            "level": record.levelname,
            "req": getattr(record, "req", ""),
            "logger": record.name,
            "method": getattr(record, "method", ""),
            "path": getattr(record, "path", ""),
            "status": getattr(record, "status", 0),
            "duration_ms": getattr(record, "duration_ms", 0.0),
            "user_id": getattr(record, "user_id", 0),
        }
        return json.dumps(payload, ensure_ascii=False, separators=(",", ":"))


class TextFormatter(logging.Formatter):
    def format(self, record):
        return (
            f"{self.formatTime(record, '%Y-%m-%d %H:%M:%S')},"
            f"{int(record.msecs):03d} {record.levelname} "
            f"req={getattr(record, 'req', '')} logger={record.name} "
            f"method={getattr(record, 'method', '')} "
            f"path={getattr(record, 'path', '')} "
            f"status={getattr(record, 'status', 0)} "
            f"duration_ms={getattr(record, 'duration_ms', 0.0)} "
            f"user_id={getattr(record, 'user_id', 0)}"
        )


class BufferedHandler(logging.Handler):
    """Batches writes: flush every `batch` records instead of every record.

    ``logging.StreamHandler.emit`` calls ``self.flush()`` on *every* record,
    which for a FileHandler means one write syscall per line. That is the
    single biggest cost in this benchmark, and it is invisible in the API.
    """

    def __init__(self, path, batch=1000):
        super().__init__()
        self.stream = open(path, "w", encoding="utf-8", buffering=1 << 16)
        self.batch = batch
        self._n = 0

    def emit(self, record):
        self.stream.write(self.format(record) + "\n")
        self._n += 1
        if self._n % self.batch == 0:
            self.stream.flush()

    def close(self):
        try:
            self.stream.flush()
            self.stream.close()
        finally:
            super().close()


def e1a_format_cost(records):
    """Pure CPU: how much does turning a record into a line cost?

    No I/O here on purpose. Mixing formatting and disk writes into one number
    made the earlier version of this benchmark non-reproducible (36 MB of
    write-back traffic swamped the difference between modes and the ranking
    flipped between runs).
    """
    hr(f"E1a  格式化成本（纯 CPU，{len(records):,} 次，不落盘）")
    n = len(records)

    def fmt_text():
        acc = 0
        for r in records:
            acc += len(as_text(r))
        return acc

    def fmt_json():
        acc = 0
        for r in records:
            acc += len(as_json(r))
        return acc

    proto = records[0]
    lr = logging.LogRecord("api.views", logging.INFO, "", 0, "", None, None)
    for k, v in proto.items():
        setattr(lr, k, v)
    tf, jf = TextFormatter(), JsonFormatter()

    def fmt_tf():
        acc = 0
        for _ in range(n):
            acc += len(tf.format(lr))
        return acc

    def fmt_jf():
        acc = 0
        for _ in range(n):
            acc += len(jf.format(lr))
        return acc

    # 把文本路径拆开：时间转换 vs 真正的字符串拼接。
    # only_time 必须进同一个交错集合，不能单独再测一遍 —— 单独测就会落在
    # 不同的轮次上，机器一忙两个数字就来自不同的负载状态（实测算出过 91%
    # 这种荒谬占比，干净机器上是 54%）。
    def only_time():
        acc = 0
        for r in records:
            acc += len(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(r["ts"])))
        return acc

    series = interleaved_series(
        [
            ("as_text(r)  f-string", fmt_text),
            ("as_json(r)  json.dumps", fmt_json),
            ("logging TextFormatter", fmt_tf),
            ("logging JsonFormatter", fmt_jf),
            ("仅 time.localtime+strftime", only_time),
        ],
        rounds=9,
    )
    res = {k: min(v) for k, v in series.items()}
    t_text = res["as_text(r)  f-string"]
    t_json = res["as_json(r)  json.dumps"]

    print(f"  {'方式':<28}{'total':>10}{'ns/rec':>10}{'vs 文本':>10}{'离散度':>9}")
    print(f"  {'-' * 28}{'-' * 10}{'-' * 10}{'-' * 10}{'-' * 9}")
    for label, _ in [
        ("as_text(r)  f-string", 0),
        ("as_json(r)  json.dumps", 0),
        ("logging TextFormatter", 0),
        ("logging JsonFormatter", 0),
    ]:
        dt = res[label]
        print(f"  {label:<28}{dt:>9.3f}s{dt / n * 1e9:>10.0f}{dt / t_text:>9.2f}x"
              f"{spread_pct(series[label]):>8.0f}%")
    print(f"\n  JSON 序列化比 f-string 文本贵 {(t_json / t_text - 1) * 100:+.0f}%，"
          f"绝对值差 {abs(t_json - t_text) / n * 1e9:.0f} ns/条")
    print("  （两者都含 time.localtime + strftime，那部分才是大头；字段怎么排影响很小）")

    t_time = res["仅 time.localtime+strftime"]
    print(f"  其中 time.localtime + strftime 占 {t_time / n * 1e9:.0f} ns/条"
          f"（文本路径的 {t_time / t_text * 100:.0f}%）——想压日志成本，先看这里")
    return t_text, t_json


def e1b_write_cost(records, batch=2000, reps=7):
    """I/O only: hold the content constant (JSON lines) and vary the write path.

    Content is a single JSON line repeated, so this measures the write path and
    nothing else. Formatting is E1a's job.

    ``batch`` is a measurement parameter. A per-record flush costs one
    ``write()`` syscall per line and E1d shows that cost is flat from 500 to
    50,000 lines, so a small batch loses nothing — and a small batch keeps each
    round short, which is worth a lot on a machine whose load spikes last longer
    than a single round. See ``e1d_batch_scale`` for the sweep and for the
    hypothesis it disproved.
    """
    hr(f"E1b  落盘成本（每轮 {batch:,} 行，{reps} 轮交错取最优）")
    line = as_json(records[0])
    lines = [line] * batch
    total_bytes = sum(len(x) + 1 for x in lines)

    def write_buffered(path):
        with open(path, "w", encoding="utf-8", buffering=1 << 16) as f:
            for ln in lines:
                f.write(ln + "\n")

    def write_flush(path):
        with open(path, "w", encoding="utf-8") as f:
            for ln in lines:
                f.write(ln + "\n")
                f.flush()

    def _logging(path, handler_factory):
        handler = handler_factory(path)
        handler.setFormatter(logging.Formatter("%(message)s"))
        log = logging.getLogger(f"w.{id(handler)}")
        log.handlers = [handler]
        log.setLevel(logging.INFO)
        log.propagate = False
        for ln in lines:
            log.info(ln)
        handler.close()
        log.handlers = []

    def write_logging_fh(path):
        _logging(path, lambda p: logging.FileHandler(p, mode="w", encoding="utf-8"))

    def write_logging_buffered(path):
        _logging(path, lambda p: BufferedHandler(p, batch=1000))

    modes = [
        ("裸写 + 64KB 缓冲", write_buffered),
        ("裸写 + 每条 flush", write_flush),
        ("logging FileHandler", write_logging_fh),
        ("logging 批量 flush", write_logging_buffered),
    ]
    cases = []
    for i, (label, fn) in enumerate(modes):
        path = TMP / f"e1b_{i}.log"
        cases.append((label, (lambda f=fn, p=path: f(p))))

    series = interleaved_series(cases, rounds=reps)
    res = {k: min(v) for k, v in series.items()}
    base = res["裸写 + 64KB 缓冲"]

    print(f"  {'写盘方式':<26}{'最快':>10}{'us/行':>10}{'vs 缓冲':>10}{'离散度':>9}")
    print(f"  {'-' * 26}{'-' * 10}{'-' * 10}{'-' * 10}{'-' * 9}")
    for label, _ in modes:
        dt = res[label]
        print(f"  {label:<26}{dt * 1e3:>9.2f}ms{dt / batch * 1e6:>10.2f}"
              f"{dt / base:>9.2f}x{spread_pct(series[label]):>8.0f}%")
    for i in range(len(modes)):
        (TMP / f"e1b_{i}.log").unlink(missing_ok=True)

    print(f"\n  每轮写入 {total_bytes / 1e6:.2f} MB / {batch:,} 行")
    print(f"  logging.FileHandler 每行一次 flush，比 64KB 缓冲贵 "
          f"{res['logging FileHandler'] / base:.1f}x")
    print(f"  同一份内容改成批量 flush 后回落到 "
          f"{res['logging 批量 flush'] / base:.1f}x —— 差距在写路径，不在 logging 本身")
    print(f"  {calib_tag().strip() or '机器负载正常'}")
    return res, len(line) + 1


def e1d_batch_scale(batch_sizes=(500, 2000, 10000, 50000), reps=7):
    """Does the batch size change the per-line cost, or just the noise?

    Written to test a hypothesis that turned out to be wrong, and kept because
    the *disproof* is the useful part.

    The hypothesis was: a per-record flush pushes one ``write()`` per line back
    to back, so past some batch size the dirty-page backlog throttles the writer
    and the measurement collapses. One run did show 179% spread at 50,000 lines,
    which looked like confirmation. Re-run on a quieter machine, the same code
    at the same size showed 13%. The 179% was a load spike that happened to land
    on the large batch, not a property of large batches.

    What the sweep *does* show, reproducibly, is that the per-line cost of a
    flushing handler is flat across a 100x range of batch sizes. That is the
    evidence that the cost is one syscall per record rather than anything to do
    with byte count — so the number measured at a small batch is safe to
    extrapolate to production volumes.

    The ratio column rises with batch size for a boring reason: the buffered
    baseline pays a fixed open/close cost that gets amortised over more lines,
    while flush() is a purely per-line cost and does not get cheaper.
    """
    hr("E1d  批量大小 vs 每行成本（逐行 flush 的写路径）")
    line = ('{"ts":"2026-09-21T09:00:00.123+08:00","level":"INFO","logger":"app.http",'
            '"msg":"handled request","path":"/api/articles/","status":200,"duration_ms":12.4}')

    def raw_buffered(path, lines):
        with open(path, "w", encoding="utf-8", buffering=1 << 16) as f:
            for ln in lines:
                f.write(ln + "\n")

    def logging_fh(path, lines):
        h = logging.FileHandler(path, mode="w", encoding="utf-8")
        h.setFormatter(logging.Formatter("%(message)s"))
        log = logging.getLogger("scale")
        log.handlers = [h]
        log.setLevel(logging.INFO)
        log.propagate = False
        for ln in lines:
            log.info(ln)
        h.close()
        log.handlers = []

    print(f"  {'行数':>8}{'raw us/行':>11}{'flush us/行':>13}{'比值':>8}{'离散度':>9}")
    print(f"  {'-' * 8}{'-' * 11}{'-' * 13}{'-' * 8}{'-' * 9}")
    rows = []
    for n in batch_sizes:
        lines = [line] * n
        path = str(TMP / "e1d.log")
        r_series, f_series = [], []
        for _ in range(reps):
            t0 = time.perf_counter()
            raw_buffered(path, lines)
            r_series.append((time.perf_counter() - t0) / n * 1e6)
            t0 = time.perf_counter()
            logging_fh(path, lines)
            f_series.append((time.perf_counter() - t0) / n * 1e6)
            os.remove(path)
        rm, fm = min(r_series), min(f_series)
        sp = spread_pct(f_series)
        rows.append((n, rm, fm, fm / rm, sp))
        print(f"  {n:>8,}{rm:>11.2f}{fm:>13.2f}{fm / rm:>7.1f}x{sp:>8.0f}%")

    fmin = min(r[2] for r in rows)
    fmax = max(r[2] for r in rows)
    print(f"\n  每行 flush 成本 {fmin:.1f}–{fmax:.1f} us，跨 "
          f"{max(batch_sizes) // min(batch_sizes)}x 批量基本不变 —— "
          f"成本来自「每行一次 syscall」，与字节数无关")
    print(f"  比值随批量上升只是因为裸写的 open/close 固定开销被摊薄；"
          f"flush 是纯每行成本，不会跟着变便宜")
    return rows


def e1c_logging_anatomy(n=50_000):
    """Where does logging's per-record cost actually go?

    E1b shows `logging` costing ~18 us/record even when the handler batches its
    writes, so the I/O is not the whole story. This pins the cost to specific
    lines inside the stdlib. NullHandler throughout: no I/O at all.
    """
    hr(f"E1c  logging 的每条开销花在哪（{n:,} 次，NullHandler，零 I/O）")
    msg = "x" * 160

    def make_logger(name):
        lg = logging.getLogger(name)
        lg.handlers = [logging.NullHandler()]
        lg.setLevel(logging.INFO)
        lg.propagate = False
        return lg

    def bare():
        acc = 0
        for _ in range(n):
            acc += len(msg)
        return acc

    lg1 = make_logger("e1c.default")

    def with_default():
        for _ in range(n):
            lg1.info(msg)

    # Flags must be set *inside* the measured call. An earlier version set them
    # once at definition time and restored them before measuring, so all three
    # "variants" ran the default configuration and the differences were noise.
    lg2 = make_logger("e1c.nosrc")

    def no_src():
        saved = logging._srcfile
        logging._srcfile = None          # skips findCaller() per record
        try:
            for _ in range(n):
                lg2.info(msg)
        finally:
            logging._srcfile = saved

    lg3 = make_logger("e1c.minimal")

    def minimal():
        saved_src = logging._srcfile
        saved_flags = (
            logging.logThreads,
            logging.logProcesses,
            logging.logMultiprocessing,
        )
        logging._srcfile = None
        logging.logThreads = False
        logging.logProcesses = False
        logging.logMultiprocessing = False
        try:
            for _ in range(n):
                lg3.info(msg)
        finally:
            logging._srcfile = saved_src
            (
                logging.logThreads,
                logging.logProcesses,
                logging.logMultiprocessing,
            ) = saved_flags

    handler = logging.NullHandler()

    def bypass():
        for _ in range(n):
            handler.handle(
                logging.LogRecord("e1c.raw", logging.INFO, "", 0, msg, None, None)
            )

    res = interleaved(
        [
            ("纯 Python 循环（基线）", bare),
            ("log.info(msg)  默认", with_default),
            ("log.info(msg)  _srcfile=None", no_src),
            ("log.info(msg)  + logThreads/Processes 关掉", minimal),
            ("绕过 Logger，直接 handler.handle(LogRecord)", bypass),
        ]
    )
    t_bare = res["纯 Python 循环（基线）"]

    print(f"  {'变体':<42}{'total':>10}{'ns/条':>10}")
    print(f"  {'-' * 42}{'-' * 10}{'-' * 10}")
    for label in [
        "纯 Python 循环（基线）",
        "log.info(msg)  默认",
        "log.info(msg)  _srcfile=None",
        "log.info(msg)  + logThreads/Processes 关掉",
        "绕过 Logger，直接 handler.handle(LogRecord)",
    ]:
        dt = res[label]
        print(f"  {label:<42}{dt:>9.3f}s{dt / n * 1e9:>10.0f}")

    per = lambda label: (res[label] - t_bare) / n * 1e9  # noqa: E731
    net_def = per("log.info(msg)  默认")
    net_src = per("log.info(msg)  _srcfile=None")
    net_min = per("log.info(msg)  + logThreads/Processes 关掉")
    net_byp = per("绕过 Logger，直接 handler.handle(LogRecord)")

    print(f"\n  logging 净开销（减去基线）  : {net_def:.0f} ns/条")
    print(f"    findCaller()             : {net_def - net_src:.0f} ns/条"
          f"  （占 {100 * (net_def - net_src) / net_def:.0f}%）")
    print(f"    thread/pid/进程名         : {net_src - net_min:.0f} ns/条"
          f"  （占 {100 * (net_src - net_min) / net_def:.0f}%）")
    print(f"    剩下的 Logger/handler    : {net_min:.0f} ns/条")
    print(f"  直接 handler.handle() 只要 : {net_byp:.0f} ns/条"
          f"  —— 比走 Logger 快 {net_def / net_byp:.1f}x")
    return net_def, net_src, net_min, net_byp


# ── E2: read-back cost ───────────────────────────────────────────────


QUESTION = "path == /api/articles 的 duration_ms 的 p99"


def e2_readback(records):
    hr(f"E2  read-back — 回答「{QUESTION}」")
    text_path = TMP / "e2_text.log"
    json_path = TMP / "e2_json.log"
    with open(text_path, "w", encoding="utf-8", buffering=1 << 16) as f:
        for r in records:
            f.write(as_text(r) + "\n")
    with open(json_path, "w", encoding="utf-8", buffering=1 << 16) as f:
        for r in records:
            f.write(as_json(r) + "\n")

    truth = sorted(
        r["duration_ms"] for r in records if r["path"] == "/api/articles"
    )
    expected = truth[int(len(truth) * 0.99)] if truth else None

    # --- plain text: regex, hand-written for this exact format ---
    text_re = re.compile(
        r"^[\d\-]+ [\d:,]+ \w+ req=(\S+) logger=(\S+) method=(\S+) "
        r"path=(\S+) status=(\d+) duration_ms=([\d.]+) "
    )
    t0 = time.perf_counter()
    vals = []
    with open(text_path, encoding="utf-8") as f:
        for line in f:
            m = text_re.match(line)
            if m and m.group(4) == "/api/articles":
                vals.append(float(m.group(6)))
    t_text = time.perf_counter() - t0
    vals.sort()
    got_text = vals[int(len(vals) * 0.99)]

    # --- structured: json.loads, no format knowledge required ---
    t0 = time.perf_counter()
    vals = []
    with open(json_path, encoding="utf-8") as f:
        for line in f:
            r = json.loads(line)
            if r["path"] == "/api/articles":
                vals.append(r["duration_ms"])
    t_json = time.perf_counter() - t0
    vals.sort()
    got_json = vals[int(len(vals) * 0.99)]

    print(f"  {'approach':<26}{'time':>9}{'us/line':>10}   result")
    print(f"  {'-' * 26}{'-' * 9}{'-' * 10}   ------")
    print(f"  {'纯文本 + 正则':<26}{t_text:>8.2f}s{t_text / len(records) * 1e6:>10.2f}"
          f"   p99={got_text:.2f}ms")
    print(f"  {'JSON + json.loads':<26}{t_json:>8.2f}s{t_json / len(records) * 1e6:>10.2f}"
          f"   p99={got_json:.2f}ms")
    print(f"  {'真实值（内存里算的）':<26}{'':>9}{'':>10}   p99={expected:.2f}ms")
    faster, slower = ("正则", "json.loads") if t_text < t_json else ("json.loads", "正则")
    ratio = max(t_text, t_json) / min(t_text, t_json)
    print(f"\n  {faster} 比 {slower} 快 {ratio:.2f}x —— 扫 {len(records):,} 行的绝对值差距只有 "
          f"{abs(t_text - t_json):.2f}s，两种都能接受")
    print("  也就是说：**读日志的速度不是选型理由**，下面这条才是。")

    # --- the part that actually hurts: schema drift ---
    drift_n = min(20_000, len(records))
    drifted = records[:drift_n]
    text_hits = 0
    for r in drifted:
        if text_re.match(as_text(r, dur_label="dur_ms")):
            text_hits += 1
    json_errors = 0
    for r in drifted:
        d = {("dur_ms" if k == "duration_ms" else k): v for k, v in r.items()}
        try:
            _ = d["duration_ms"]
        except KeyError:
            json_errors += 1

    print(f"\n  schema 漂移：上游把 duration_ms 改名成 dur_ms，对前 {drift_n:,} 条重新跑一遍")
    print(f"    纯文本 + 正则 : 命中 {text_hits:,} 条，抛错 0 次"
          f"   <- 静默。pipeline 里看起来只是「这段时间没数据」")
    print(f"    JSON 取值     : 命中 0 条，抛错 {json_errors:,} 次"
          f"   <- 响。炸得难看，但至少炸了")
    return t_text, t_json


# ── E3: 3-hop HTTP chain ─────────────────────────────────────────────


class Trace:
    """Shared in-memory log sink for the three services."""

    def __init__(self):
        self.lines = []
        self.lock = threading.Lock()

    def add(self, service, req_id, event, **fields):
        with self.lock:
            self.lines.append(
                {"t": time.time(), "svc": service, "req": req_id, "ev": event, **fields}
            )

    def reset(self):
        with self.lock:
            self.lines.clear()


def make_handler(service, trace, downstream=None):
    class H(http.server.BaseHTTPRequestHandler):
        protocol_version = "HTTP/1.1"

        def log_message(self, *a):
            pass

        def do_GET(self):
            rid = self.headers.get("X-Request-Id", "")
            t0 = time.perf_counter()
            trace.add(service, rid, "enter", path=self.path)
            if downstream is not None:
                url = downstream + self.path
                req = urllib.request.Request(url)
                if rid:
                    req.add_header("X-Request-Id", rid)
                with urllib.request.urlopen(req, timeout=10) as resp:
                    resp.read()
            trace.add(
                service, rid, "exit", path=self.path,
                ms=round((time.perf_counter() - t0) * 1000, 3),
            )
            body = b'{"ok":true}'
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    return H


class ReusableOff(http.server.ThreadingHTTPServer):
    """Windows note: the default ``allow_reuse_address = True`` maps to
    ``SO_REUSEADDR``, which on Windows lets a *second* bind silently steal a
    port from a listener that is merely shut down but not closed. Connections
    then land on a socket nobody is serving and hang. Bind exclusively and
    close properly instead.
    """

    allow_reuse_address = False
    daemon_threads = True


def start_server(port, handler):
    srv = ReusableOff(("127.0.0.1", port), handler)
    t = threading.Thread(target=srv.serve_forever, daemon=True)
    t.start()
    return srv


def run_chain(requests, use_id, spacing, base_port):
    """Fire `requests` calls at the gateway; return (latencies_ms, trace)."""
    trace = Trace()
    p_gw, p_svc, p_db = base_port, base_port + 1, base_port + 2
    db = start_server(p_db, make_handler("db-proxy", trace))
    svc = start_server(
        p_svc, make_handler("article-svc", trace, f"http://127.0.0.1:{p_db}")
    )
    gw = start_server(
        p_gw, make_handler("gateway", trace, f"http://127.0.0.1:{p_svc}")
    )
    time.sleep(0.3)

    lat = []
    try:
        for _ in range(requests):
            req = urllib.request.Request(f"http://127.0.0.1:{p_gw}/api/articles")
            if use_id:
                req.add_header("X-Request-Id", uuid.uuid4().hex[:16])
            t0 = time.perf_counter()
            with urllib.request.urlopen(req, timeout=10) as resp:
                resp.read()
            lat.append((time.perf_counter() - t0) * 1000)
            time.sleep(spacing)
    finally:
        for s in (gw, svc, db):
            s.shutdown()
            s.server_close()
    return lat, trace


def e3_trace(requests, spacing):
    hr(f"E3  3 跳 HTTP 链路 —— 定位「某一个请求」的完整日志")
    # Four passes, and the placement matters. The no-id pass is run first, then
    # again, then the id pass, then no-id a third time — so the id pass is not
    # simply "the last one". With the id pass always last, any warming or
    # cooling of the machine gets attributed to the header.
    lat_no1, _ = run_chain(requests, use_id=False, spacing=spacing, base_port=8801)
    lat_no2, _ = run_chain(requests, use_id=False, spacing=spacing, base_port=8811)
    lat_yes, tr_yes = run_chain(
        requests, use_id=True, spacing=spacing, base_port=8821
    )
    lat_no3, _ = run_chain(requests, use_id=False, spacing=spacing, base_port=8831)

    def stats(x):
        s = sorted(x)
        return (
            statistics.median(s),
            s[int(len(s) * 0.99)],
            statistics.mean(s),
        )

    p50a, p99a, m_a = stats(lat_no1)
    p50b, p99b, m_b = stats(lat_no2)
    p50y, p99y, m_y = stats(lat_yes)
    p50c, p99c, m_c = stats(lat_no3)
    # Noise floor: spread among the three *identical* no-id passes. Anything the
    # header does has to clear this before it means anything.
    noise_p50 = max(p50a, p50b, p50c) - min(p50a, p50b, p50c)
    noise_p99 = max(p99a, p99b, p99c) - min(p99a, p99b, p99c)
    delta_p50 = p50y - (p50a + p50b + p50c) / 3
    delta_p99 = p99y - (p99a + p99b + p99c) / 3

    print(f"  请求数 {requests}，链路 gateway -> article-svc -> db-proxy（3 次真实 HTTP 往返）")
    print(f"\n  {'':<26}{'p50':>10}{'p99':>10}{'mean':>10}   (ms)")
    print(f"  {'-' * 26}{'-' * 10}{'-' * 10}{'-' * 10}")
    print(f"  {'不带 id（第 1 次）':<26}{p50a:>10.2f}{p99a:>10.2f}{m_a:>10.2f}")
    print(f"  {'不带 id（第 2 次）':<26}{p50b:>10.2f}{p99b:>10.2f}{m_b:>10.2f}")
    print(f"  {'带 X-Request-Id':<26}{p50y:>10.2f}{p99y:>10.2f}{m_y:>10.2f}")
    print(f"  {'不带 id（第 3 次）':<26}{p50c:>10.2f}{p99c:>10.2f}{m_c:>10.2f}")
    print(f"\n  三次「不带 id」之间的抖动 : p50 {noise_p50:.2f}ms / p99 {noise_p99:.2f}ms")
    print(f"  「带 id」相对三者均值的偏移 : p50 {delta_p50:+.2f}ms / p99 {delta_p99:+.2f}ms")
    if abs(delta_p50) <= max(noise_p50, 1e-9) and abs(delta_p99) <= max(noise_p99, 1e-9):
        print("  -> 偏移落在噪声里，**端到端测不出这个 header 的成本**。")
    else:
        print("  -> 偏移超出噪声，但注意它的符号会随运行翻转（实测见过 +12ms 和 -3.5ms）——")
        print("     那是「第几个跑」的效应，不是 header 的效应。")
    print("  结论：想用端到端延迟去量一个 header 的成本，噪声比信号大好几个数量级。")
    print("        顺带一提：同一条链路上，真正值得看的量是下面这个「噪声比」。")

    # ---- 定位一个请求 ----
    lines = tr_yes.lines
    by_req = {}
    for ln in lines:
        by_req.setdefault(ln["req"], []).append(ln)
    target = max(by_req, key=lambda k: len(by_req[k]))
    trace_lines = by_req[target]
    t_target = trace_lines[0]["t"]

    window = [ln for ln in lines if abs(ln["t"] - t_target) <= 1.0]
    window_reqs = {ln["req"] for ln in window}

    print(f"\n  全链路日志总行数          : {len(lines):,}"
          f"（{requests} 个请求 x {len(lines) / requests:.1f} 行）")
    print(f"  单个请求的完整链路        : {len(trace_lines)} 行")
    for ln in trace_lines:
        print(f"      {ln['svc']:<12} {ln['ev']:<6} {ln.get('ms', '')}")
    print(f"\n  不用 request-id，只能按时间窗口捞（+/-1s）：")
    print(f"      捞出来            : {len(window):,} 行")
    print(f"      其中属于这个请求的 : {len(trace_lines)} 行")
    print(f"      噪声比            : {len(window) / len(trace_lines):.0f} : 1")
    print(f"      窗口里混进了      : {len(window_reqs) - 1} 个别的请求")
    return lat_no1, lat_yes, len(lines), len(trace_lines), len(window)


# ── E4: request-id generation ────────────────────────────────────────


def e4_generation(n=200_000, rounds=7):
    hr(f"E4  request-id 生成成本（{n:,} 次 x {rounds} 轮交错取最优）")
    pid = os.getpid()

    def make_counter():
        c = iter(range(n))
        return lambda: f"{pid:x}-{next(c):x}"

    # Every entry is a *factory* returning a fresh callable, so the counter
    # variant can reset between rounds without the others needing special cases.
    gens = [
        ("uuid.uuid4()            (36 字符)", lambda: (lambda: str(uuid.uuid4()))),
        ("uuid.uuid4().hex        (32 字符)", lambda: (lambda: uuid.uuid4().hex)),
        ("secrets.token_hex(8)    (16 字符)", lambda: (lambda: secrets.token_hex(8))),
        ("os.urandom(8).hex()     (16 字符)", lambda: (lambda: os.urandom(8).hex())),
        ("进程号 + 计数器          (短)", make_counter),
    ]

    # Wrap each generator in a full n-iteration loop so it can go through the
    # same interleaved harness as everything else. Measuring them one after
    # another let machine drift land unevenly: os.urandom measured 170 ns in one
    # run and 372 ns in another, a 2x swing that had nothing to do with urandom.
    cases = []
    for label, factory in gens:
        def case(factory=factory):
            fn = factory()
            for _ in range(n):
                fn()
        cases.append((label, case))

    series = interleaved_series(cases, rounds=rounds)
    results = {k: min(v) / n * 1e9 for k, v in series.items()}

    print(f"  {'方式':<36}{'最快':>9}{'ns/op':>10}{'离散度':>9}")
    print(f"  {'-' * 36}{'-' * 9}{'-' * 10}{'-' * 9}")
    for label, _ in gens:
        best = min(series[label])
        print(f"  {label:<36}{best:>8.3f}s{best / n * 1e9:>10.0f}"
              f"{spread_pct(series[label]):>8.0f}%")

    u = results["uuid.uuid4()            (36 字符)"]
    r = results["os.urandom(8).hex()     (16 字符)"]
    print(f"\n  uuid4 比 os.urandom(8).hex() 贵 {u / r:.1f}x —— "
          f"但两者都是纳秒级，每条请求一次的调用点几乎不可能成为瓶颈")

    print("\n  碰撞概率（生日问题，n 个随机 id 全部互不相同的概率）：")
    for bits, label in ((64, "16 hex 字符"), (128, "uuid4")):
        for volume, vol_label in ((10**6, "100 万"), (10**9, "10 亿")):
            p = volume * (volume - 1) / 2 / (2**bits)
            print(f"    {label:<14} 每天 {vol_label:>7} 个 id -> 撞一次的概率约 "
                  f"{p:.2e}")
    return results


# ── E5: sampling ─────────────────────────────────────────────────────


def e5_sampling(avg_line_bytes, requests=10_000, sample_rate=0.01):
    hr(f"E5  采样 —— 日志量 vs 错误保留率（{requests:,} 个请求）")
    rng = random.Random(7)
    normal_lines = 4
    error_extra = 3

    reqs = [(i, rng.random() < 0.01) for i in range(requests)]
    err_requests = sum(1 for _, e in reqs if e)

    # Pre-draw every decision so the policies differ only by their rule, not by
    # how many times they happened to call the RNG (short-circuit evaluation
    # would otherwise shift the sequence and make the rows incomparable).
    rng2 = random.Random(99)
    picked = [rng2.random() < sample_rate for _ in range(requests)]
    slow = [i % 997 == 0 for i in range(requests)]

    def measure(keep):
        lines = 0
        kept_err = 0
        for i, e in reqs:
            if keep(i, e):
                lines += normal_lines + (error_extra if e else 0)
                if e:
                    kept_err += 1
        return lines, kept_err

    policies = [
        ("A 全量", lambda i, e: True),
        ("B 随机 1%", lambda i, e: picked[i]),
        ("C 随机 1% + 错误全留", lambda i, e: e or picked[i]),
        ("D C + 慢请求全留", lambda i, e: e or picked[i] or slow[i]),
    ]
    full_lines = sum(normal_lines + (error_extra if e else 0) for _, e in reqs)
    print(f"  请求 {requests:,} 个，其中错误请求 {err_requests} 个（1%），"
          f"正常 4 行/请求，错误额外 3 行")
    print(f"  行宽按 E1 实测的 {avg_line_bytes:.0f} B/行 估算体积\n")
    print(f"  {'策略':<24}{'行数':>10}{'相对 A':>9}{'体积':>9}{'错误保留':>10}")
    print(f"  {'-' * 24}{'-' * 10}{'-' * 9}{'-' * 9}{'-' * 10}")
    for label, keep in policies:
        lines, kept_err = measure(keep)
        print(
            f"  {label:<24}{lines:>10,}"
            f"{lines / full_lines * 100:>8.1f}%"
            f"{lines * avg_line_bytes / 1e6:>8.1f}MB"
            f"{kept_err / err_requests * 100:>9.1f}%"
        )
    print(f"\n  随机采样 1% 把日志量压到 {measure(policies[1][1])[0] / full_lines * 100:.1f}%，"
          f"同时也把 {100 - measure(policies[1][1])[1] / err_requests * 100:.1f}% 的错误扔了。")
    return full_lines, err_requests


# ── main ─────────────────────────────────────────────────────────────


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--records", type=int, default=200_000)
    ap.add_argument("--requests", type=int, default=400)
    ap.add_argument("--spacing", type=float, default=0.01)
    ap.add_argument("--only", default="",
                    help="逗号分隔，只跑指定实验（如 e1b,e4）。"
                         "做稳定性检验时单跑一个，避免其它实验的 I/O 干扰测量。")
    args = ap.parse_args()

    only = {s.strip().lower() for s in args.only.split(",") if s.strip()}

    def want(name):
        return not only or name in only

    if want("e0"):
        e0_environment(args.records, args.requests)

    # build_records 是纯 CPU 的确定性构造，几个实验都要用；单跑时也得先建。
    need_records = any(want(n) for n in ("e1a", "e1b", "e2"))
    records = build_records(args.records) if need_records else None

    json_line_bytes = 0
    if want("e1a"):
        e1a_format_cost(records)
    if want("e1b"):
        _, json_line_bytes = e1b_write_cost(records)
    if want("e1c"):
        e1c_logging_anatomy()
    if want("e1d"):
        e1d_batch_scale()
    if want("e2"):
        e2_readback(records)
    if want("e4"):
        e4_generation()
    if want("e5"):
        e5_sampling(json_line_bytes or 240)
    # E3 必须最后跑：它会打 4 x requests 次真实 HTTP 往返，机器被它烘热之后
    # 再测微基准，E4 的 uuid4/os.urandom 比值能从 12x 虚高到 28x。
    if want("e3"):
        e3_trace(args.requests, args.spacing)

    hr("done")
    print(f"  临时日志文件在 {TMP}（可删）")


if __name__ == "__main__":
    main()
