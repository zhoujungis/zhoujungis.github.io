"""eliminate_sum10_bench.py — 「相邻两数之和为 10 就消除」的实测与不变量校验。

题目（腾讯面经高频：2025.11–2026.4 至少 4 篇面经出现）：

    给一个只由 1~9 组成的数字串，相邻两个数字之和为 10 就可以消除，
    消除后两边接在一起继续检查。问最后剩下的串是什么（或剩余最短长度）。

本脚本做两件事 —— 都在文章里被引用，所以数字必须是跑出来的：

1. 正确性与唯一性校验（不是「跑一遍看着对」）
   - 穷举 1~9 上所有长度 <= 5 的串（66430 个），交叉比对四种实现：
     栈模拟 / 逐轮重扫 / 最左优先重扫 / 最右优先重扫；
   - 不可约性：结果内部不再含相邻互补对（再检查一遍也消不掉）；
   - 前缀不变量：栈模拟每一步的栈内容 == 该前缀独立约化后的结果；
   - 合流性实证：最左 / 最右 / 随机顺序三种消法在所有随机样本上同果；
   - 反例：规则放宽成「和为 10 或 9」后，顺序不同的确给出不同结果 ——
     说明「顺序无关」是本题规则的功劳，不是任何消除规则都成立。

2. 性能实测：栈 O(n) vs 朴素重扫 O(n^2)
   对抗输入 = "1"*N + "9"*N：任何时刻只有「交界处那一对」可消，
   朴素实现每次都要从串首重扫，退化成 O(n^2)。栈一遍扫完是 O(n)。

纯标准库、确定性（随机数固定种子），一次运行：
    set PYTHONIOENCODING=utf-8 && python tools/eliminate_sum10_bench.py
"""

import itertools
import random
import sys
import time

# ── Windows：控制台中文编码 + 计时器精度（15ms 粒度会污染 ms 级测量）───────
if sys.platform == "win32":  # pragma: no cover - 平台相关
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    try:
        import ctypes

        ctypes.windll.winmm.timeBeginPeriod(1)
    except Exception:
        pass

DIGITS = "123456789"
COMPLEMENT = {int(d): 10 - int(d) for d in DIGITS}

SAMPLES = 2000
SEED = 10


def _pair_sum(a: str, b: str) -> int:
    """'3' + '7' -> 10。用 ord 算术，避免热循环里反复 int()。"""
    return (ord(a) - 48) + (ord(b) - 48)


# ── 1. 四种实现 ────────────────────────────────────────────────────────────
def stack_reduce(s, trace=False):
    """栈模拟 O(n)：栈顶与当前数字互补就弹出，否则入栈。

    trace=True 时附带 (pops, max_depth) —— 文章里要用到最大栈深。
    """
    st = []
    pops = 0
    max_depth = 0
    for ch in s:
        if st and _pair_sum(st[-1], ch) == 10:
            st.pop()
            pops += 1
        else:
            st.append(ch)
        if len(st) > max_depth:
            max_depth = len(st)
    out = "".join(st)
    return (out, pops, max_depth) if trace else out


def naive_rounds(s):
    """逐轮重扫 O(n^2) 最坏：每轮从左到右删掉所有不相交的互补对，扫到不动。

    这是「消除后两边接在一起继续检查」最容易被写成的一版：
    一轮里刚接上的新邻居要等下一轮才被检查。
    """
    cur = s
    while True:
        out = []
        i = 0
        n = len(cur)
        removed = False
        while i < n:
            if i + 1 < n and _pair_sum(cur[i], cur[i + 1]) == 10:
                i += 2
                removed = True
            else:
                out.append(cur[i])
                i += 1
        if not removed:
            return cur
        cur = "".join(out)


def restart_reduce(s, leftmost=True, targets=(10,)):
    """最字面的暴力：找到一对能消的 -> 删掉 -> 从串首重新扫。O(n^2)。

    targets 用来演示「规则换了会怎样」：targets=(9, 10) 就是
    「相邻两数之和是 10 或 9 都能消」—— 那时合流性不再成立。
    """
    cur = s
    while True:
        idx = -1
        n = len(cur)
        rng = range(n - 1) if leftmost else range(n - 2, -1, -1)
        for i in rng:
            if _pair_sum(cur[i], cur[i + 1]) in targets:
                idx = i
                break
        if idx < 0:
            return cur
        cur = cur[:idx] + cur[idx + 2:]


def random_order_reduce(s, rng, targets=(10,)):
    """随机挑一对能消的立刻消掉 —— 用来验证「顺序不影响结果」。"""
    cur = list(s)
    while True:
        cands = [
            i
            for i in range(len(cur) - 1)
            if _pair_sum(cur[i], cur[i + 1]) in targets
        ]
        if not cands:
            return "".join(cur)
        i = rng.choice(cands)
        del cur[i:i + 2]


def is_irreducible(s):
    """不可约：串里不存在相邻互补对。"""
    return all(_pair_sum(s[i], s[i + 1]) != 10 for i in range(len(s) - 1))


# ── 2. 校验 ────────────────────────────────────────────────────────────────
def check_exhaustive(max_len=5):
    """穷举短串：四种实现必须完全一致，且结果不可约。"""
    total = 0
    for length in range(max_len + 1):
        for digits in itertools.product(DIGITS, repeat=length):
            s = "".join(digits)
            total += 1
            ref = stack_reduce(s)
            for name, got in (
                ("逐轮重扫", naive_rounds(s)),
                ("最左重扫", restart_reduce(s, True)),
                ("最右重扫", restart_reduce(s, False)),
            ):
                if got != ref:
                    raise AssertionError(f"{name} disagree on {s!r}: {got!r} != {ref!r}")
            if not is_irreducible(ref):
                raise AssertionError(f"结果 {ref!r} 由 {s!r} 得到，但仍可再消")
    return total


def check_prefix_invariant(rng, samples=200):
    """每一步的栈 == 该前缀独立约化后的结果。"""
    for _ in range(samples):
        n = rng.randint(1, 120)
        s = "".join(rng.choice(DIGITS) for _ in range(n))
        st = []
        for i, ch in enumerate(s):
            if st and _pair_sum(st[-1], ch) == 10:
                st.pop()
            else:
                st.append(ch)
            if "".join(st) != stack_reduce(s[: i + 1]):
                raise AssertionError(f"前缀不变量在第 {i} 步破了：{s!r}")
    return samples


def check_confluence(rng, samples=SAMPLES):
    """合流性实证：三种消除顺序必须给出同一结果。"""
    for _ in range(samples):
        n = rng.randint(0, 40)
        s = "".join(rng.choice(DIGITS) for _ in range(n))
        results = {
            stack_reduce(s),
            restart_reduce(s, True),
            restart_reduce(s, False),
            random_order_reduce(s, rng),
        }
        if len(results) != 1:
            raise AssertionError(f"三种顺序结果不同：{s!r} -> {results}")
    return samples


def check_counterexample():
    """规则放宽后顺序真的会影响结果 —— 两个反例。

    本题规则（配对唯一）是合流的；一旦某个数字能配第二个补数，
    合流性就塌了 —— 这时"栈模拟"只给出某个解，不保证最优。
    """
    cases = [
        ((9, 10), "918"),   # 1 既能配 9（=10）又能配 8（=9）
        ((10, 18), "991"),  # 9 既能配 1（=10）又能配 9（=18）
    ]
    out = []
    for targets, s in cases:
        left = restart_reduce(s, True, targets=targets)
        right = restart_reduce(s, False, targets=targets)
        if left == right:
            raise AssertionError(f"预期 {s} 在规则 {targets} 下两序不同果，实际相同")
        out.append((targets, s, left, right))
    return out


def check_shortest_equals_reduced(rng, samples=500):
    """「剩余最短长度」== 栈结果的长度：任何消法都停在这个不可约形上。"""
    for _ in range(samples):
        n = rng.randint(0, 30)
        s = "".join(rng.choice(DIGITS) for _ in range(n))
        best = len(stack_reduce(s))
        for _ in range(6):
            best = min(best, len(random_order_reduce(s, rng)))
        if best != len(stack_reduce(s)):
            raise AssertionError(f"{s!r} 存在更短的消法：{best}")
    return samples


# ── 3. 性能实测 ────────────────────────────────────────────────────────────
def _ms(seconds):
    return seconds * 1000.0


def _best_of(times, fn):
    """重复 times 次取最小耗时 —— 取最小比取平均稳，是微基准的惯例。"""
    best = None
    for _ in range(times):
        t0 = time.perf_counter()
        fn()
        dt = time.perf_counter() - t0
        if best is None or dt < best:
            best = dt
    return best


def bench_adversarial():
    """对抗输入 "1"*N + "9"*N：朴素重扫每次都从串首扫到交界处。"""
    print("== 2. 对抗输入 \"1\"*N + \"9\"*N（只有交界处那一对可消）==")
    print(
        f"{'n':>8} {'逐轮重扫':>12} {'最左重扫':>12} {'栈模拟':>13} "
        f"{'逐轮 n 翻倍':>12} {'栈 vs 逐轮':>11}"
    )
    rows = []
    prev_rounds = None
    for n_pairs in (1000, 2000, 4000):
        s = "1" * n_pairs + "9" * n_pairs
        n = len(s)

        # 正确性先验一遍（不计时），再各取最小耗时
        assert naive_rounds(s) == restart_reduce(s, True) == stack_reduce(s) == ""

        a = _best_of(3, lambda: naive_rounds(s))
        b = _best_of(3, lambda: restart_reduce(s, True))
        c = _best_of(5, lambda: stack_reduce(s))

        _, pops, max_depth = stack_reduce(s, trace=True)
        rows.append((n, a, b, c, pops, max_depth))
        growth = f"{a / prev_rounds:.1f}x" if prev_rounds else "—"
        prev_rounds = a
        print(
            f"{n:>8} {_ms(a):>10.1f}ms {_ms(b):>10.1f}ms {_ms(c):>11.3f}ms "
            f"{growth:>12} {a / c:>10.0f}x"
        )
    n, _, _, _, pops, max_depth = rows[-1]
    print(f"  （n={n}：栈消除 {pops} 对、最大栈深 {max_depth}、结果为空串）")
    return rows


def bench_scaling():
    """栈在大 n 上的线性缩放：三种形态各测一遍。"""
    print("== 3. 栈模拟的线性缩放（大 n）==")
    print(f"{'形态':<16} {'n':>9} {'耗时':>10} {'每字符':>9} {'消除次数':>9} {'最大栈深':>9}")
    cases = [
        ("对抗 1…9…", lambda n: "1" * (n // 2) + "9" * (n // 2)),
        ("全 5", lambda n: "5" * n),
        ("随机数字", None),
    ]
    rng = random.Random(SEED)
    for label, make in cases:
        for n in (100_000, 1_000_000):
            s = make(n) if make else "".join(rng.choice(DIGITS) for _ in range(n))
            t0 = time.perf_counter()
            out, pops, max_depth = stack_reduce(s, trace=True)
            dt = time.perf_counter() - t0
            print(
                f"{label:<16} {n:>9} {_ms(dt):>8.1f}ms {dt / n * 1e9:>7.1f}ns "
                f"{pops:>9} {max_depth:>9}"
            )
            assert len(out) == n - 2 * pops
    return None


def main():
    print("== 1. 正确性 / 唯一性校验 ==")
    total = check_exhaustive(5)
    print(f"  穷举 1~9 长度 <= 5 共 {total} 个串：栈 == 逐轮重扫 == 最左重扫 == 最右重扫  OK")

    rng = random.Random(SEED)
    print(f"  前缀不变量（每一步栈 == reduce(前缀)）：{check_prefix_invariant(rng)} 个随机串  OK")
    print(f"  不可约性（结果内无相邻互补对）：全部样本  OK")

    rng = random.Random(SEED)
    n_conf = check_confluence(rng)
    print(f"  合流性实证（最左/最右/随机顺序 三序同果）：{n_conf} 个随机串（长度 <= 40）  OK")

    rng = random.Random(SEED + 1)
    n_len = check_shortest_equals_reduced(rng)
    print(f"  「最短剩余长度」== 栈结果长度：{n_len} 个随机串 x 6 条随机路线  OK")

    for targets, s, left, right in check_counterexample():
        rule = " 或 ".join(str(t) for t in targets)
        print(f"  反例 · 规则放宽成「和为 {rule}」：{s} -> 最左 {left} / 最右 {right}  顺序影响结果")

    print()
    bench_adversarial()
    print()
    bench_scaling()
    print()
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
    if sys.platform == "win32":  # pragma: no cover - 平台相关
        try:
            import ctypes

            ctypes.windll.winmm.timeEndPeriod(1)
        except Exception:
            pass
