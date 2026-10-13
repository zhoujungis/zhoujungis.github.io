"""nim_bench.py — 「石子游戏 / Nim 博弈」异或判据的实证与性能实测。

题目（面经高频 · Nim 类博弈）：

    N 堆石子，两人轮流从**任意一堆**取走**任意正数**颗，取到最后一颗的人获胜。
    给定初始局面，判断先手是否必胜。

结论：先手必胜 <=> 各堆大小的**异或和不为 0**（Bouton 定理 1901）。

本脚本做两件事 —— 都在文章里被引用，所以数字必须是跑出来的：

1. 实证（不是"跑一个例子看着对"）
   - 穷举所有小局面（堆数 <= 5、每堆 <= 9，共 2002 个）：异或判据与朴素博弈搜索逐个对照；
   - 三条不变量按"走法"逐条核对，而不是只看结论：
       I1 终局（无石子可走）是必败态；
       I2 异或为 0 时**任何**走法都让异或非 0（0 态守不住）；
       I3 异或非 0 时**存在**走法让异或回 0（非 0 态守得住）；
   - 必胜走法个数公式 `#{p : p ^ S < p}` 与「枚举所有走法」的结果一致；
   - 反 Nim（取走最后一颗者输）的判据也一起穷举验证。

2. 性能实测：异或 O(n) / O(1) 空间 vs 朴素博弈搜索
   朴素搜索的原始状态空间是 prod(p_i + 1)；排序去重成规范形后降到 C(m + k, k)。
   两者都随规模爆炸，异或判据一遍扫完。超出预算的档位只给推算值（不硬跑）。

纯标准库、确定性，一次运行：
    set PYTHONIOENCODING=utf-8 && python tools/nim_bench.py
"""

import itertools
import random
import sys
import time

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


# ── 1. 判据（要验证的对象）─────────────────────────────────────────────────
def xor_sum(piles):
    s = 0
    for p in piles:
        s ^= p
    return s


def xor_win(piles):
    """Bouton 判据：异或和非 0 则先手必胜。"""
    return xor_sum(piles) != 0


def misere_win(piles):
    """反 Nim（取最后一颗者输）判据：有堆 > 1 时看异或，全为 1 时看堆数奇偶。"""
    if all(p <= 1 for p in piles):
        return len(piles) % 2 == 0
    return xor_sum(piles) != 0


def winning_moves(piles):
    """所有「一步把异或打成 0」的走法：把第 i 堆 p 改成 p ^ S（只保留更小的）。"""
    s = xor_sum(piles)
    return [(i, p ^ s) for i, p in enumerate(piles) if (p ^ s) < p]


def successors(piles):
    """局面的所有后继（升序规范形，空堆移除）。"""
    for i, p in enumerate(piles):
        for take in range(1, p + 1):
            nxt = list(piles)
            nxt[i] = p - take
            if nxt[i] == 0:
                nxt.pop(i)
            yield tuple(sorted(nxt))


def _apply(piles, i, new_pile):
    nxt = list(piles)
    nxt[i] = new_pile
    if nxt[i] == 0:
        nxt.pop(i)
    return tuple(sorted(nxt))


# ── 2. 朴素博弈搜索（记忆化；规范形 = 升序元组）───────────────────────────
_WIN_MEMO = {}
_MISERE_MEMO = {}


def clear_memos():
    _WIN_MEMO.clear()
    _MISERE_MEMO.clear()


def brute_win(piles):
    """正常玩法：取走最后一颗者**获胜**；无路可走 = 必败。"""
    seen = set()

    def win(state):
        if state in _WIN_MEMO:
            return _WIN_MEMO[state]
        seen.add(state)
        res = False
        for nxt in successors(state):
            if not win(nxt):
                res = True
                break
        _WIN_MEMO[state] = res
        return res

    return win(tuple(sorted(p for p in piles if p > 0))), seen


def brute_win_misere(piles):
    """反玩法：取走最后一颗者**落败**；轮到无石子可走 = 上一手取走了最后一颗 → 此人获胜。"""
    seen = set()

    def win(state):
        if state in _MISERE_MEMO:
            return _MISERE_MEMO[state]
        seen.add(state)
        res = not state
        if not res:
            for nxt in successors(state):
                if not win(nxt):
                    res = True
                    break
        _MISERE_MEMO[state] = res
        return res

    return win(tuple(sorted(p for p in piles if p > 0))), seen


# ── 3. 实证 ────────────────────────────────────────────────────────────────
def multiset_cases(max_pile, max_piles):
    """所有「堆数 <= max_piles、每堆 <= max_pile」的升序多重集（含空局面）。"""
    yield tuple()
    for k in range(1, max_piles + 1):
        yield from itertools.combinations_with_replacement(range(1, max_pile + 1), k)


def check_exhaustive(max_pile=9, max_piles=5):
    """穷举小局面：判据、三条不变量、必胜走法计数、反 Nim 规则。"""
    total = 0
    n_terminal = n_zero = n_nonzero = 0
    moves_from_zero = 0
    all_states = set()
    misere_states = set()

    for piles in multiset_cases(max_pile, max_piles):
        total += 1
        s = xor_sum(piles)

        want, seen = brute_win(piles)
        all_states |= seen
        if want != (s != 0):
            raise AssertionError(f"异或判据与搜索不一致：{piles} xor={s} brute={want}")

        want_m, seen_m = brute_win_misere(piles)
        misere_states |= seen_m
        if want_m != misere_win(piles):
            raise AssertionError(f"反 Nim 判据不一致：{piles}")

        succ = list(successors(piles))
        if not succ:
            if s != 0:
                raise AssertionError(f"终局异或应为 0：{piles}")
            n_terminal += 1
        if s == 0:
            for nxt in succ:
                moves_from_zero += 1
                if xor_sum(nxt) == 0:
                    raise AssertionError(f"I2 破了：0 态 {piles} 走到 {nxt} 仍是 0")
            n_zero += 1
        else:
            if not any(xor_sum(nxt) == 0 for nxt in succ):
                raise AssertionError(f"I3 破了：{piles} 没有回到 0 态的走法")
            n_nonzero += 1

        by_enum = len([1 for i, p in enumerate(piles) for t in range(1, p + 1)
                       if xor_sum(_apply(piles, i, p - t)) == 0])
        if by_enum != len(winning_moves(piles)):
            raise AssertionError(f"必胜走法数不一致：{piles} {by_enum} vs {len(winning_moves(piles))}")

    return total, n_terminal, n_zero, n_nonzero, moves_from_zero, len(all_states), len(misere_states)


def check_random_moves(rng, samples=300):
    """随机较大局面上复检必胜走法计数公式。"""
    checked = 0
    while checked < samples:
        k = rng.randint(1, 6)
        piles = tuple(rng.randint(1, 40) for _ in range(k))
        if not xor_win(piles):
            continue
        by_enum = len([1 for i, p in enumerate(piles) for t in range(1, p + 1)
                       if xor_sum(_apply(piles, i, p - t)) == 0])
        if by_enum != len(winning_moves(piles)):
            raise AssertionError(f"计数不一致：{piles}")
        checked += 1
    return checked


# ── 4. 性能实测 ────────────────────────────────────────────────────────────
def _ms(seconds):
    return seconds * 1000.0


def canonical_states(m, k):
    """堆数 k、每堆 <= m 的升序多重集个数 = C(m + k, k)。"""
    return len(list(itertools.combinations_with_replacement(range(1, m + 1), k)))


def bench_naive_vs_xor(budget=60_000):
    """朴素搜索 vs 异或判据；规范形状态数超预算的档位只给推算值。"""
    print("== 2. 朴素博弈搜索 vs 异或判据（同一台机器、同一次运行）==")
    print(f"{'局面':<14} {'原始状态空间':>14} {'规范形':>10} {'实访状态':>10} {'朴素耗时':>12} {'异或':>10}")
    rows = []
    for m, k in ((7, 4), (15, 4), (31, 4), (15, 5), (31, 5), (63, 4)):
        raw = (m + 1) ** k
        canon = canonical_states(m, k)
        label = f"每堆 {m} × {k} 堆"

        if canon > budget:
            print(f"{label:<14} {raw:>14,} {canon:>10,} {'—':>10} {'跳过（超预算）':>14} {'—':>10}")
            rows.append((m, k, raw, canon, None, None))
            continue

        piles = tuple([m] * k)
        clear_memos()  # 冷启动：计时必须从零开始算
        t0 = time.perf_counter()
        want, seen = brute_win(piles)
        dt_brute = time.perf_counter() - t0
        t0 = time.perf_counter()
        got = xor_win(piles)
        dt_xor = time.perf_counter() - t0
        assert want == got, f"{piles} 两种判据不一致"

        print(f"{label:<14} {raw:>14,} {canon:>10,} {len(seen):>10,} {_ms(dt_brute):>10.1f}ms "
              f"{dt_xor * 1e6:>8.2f}µs")
        rows.append((m, k, raw, canon, dt_brute, dt_xor))

    print("  超预算档位的推算（原始状态空间按 prod(p_i+1)，规范形按 C(m+k, k)）：")
    for m, k in ((31, 5), (63, 4), (63, 10)):
        print(f"    每堆 {m} × {k} 堆 → 原始 {(m + 1) ** k:,}，规范形 "
              f"{canonical_states(m, k):,}")
    return rows


def bench_large_xor():
    """异或判据在大 n 上：一遍扫描，O(1) 空间。"""
    print("== 3. 异或判据的线性缩放（朴素搜索在这些规模上无从下手）==")
    rng = random.Random(1901)
    print(f"{'堆数 n':>10} {'耗时':>10} {'每堆':>9} {'异或和':>12} {'先手':>6}")
    for n in (1_000, 100_000, 1_000_000):
        piles = [rng.getrandbits(30) for _ in range(n)]
        t0 = time.perf_counter()
        s = xor_sum(piles)
        dt = time.perf_counter() - t0
        print(f"{n:>10,} {_ms(dt):>8.1f}ms {dt / n * 1e9:>7.1f}ns {s:>12,} "
              f"{'必胜' if s else '必败':>6}")

    piles = [10 ** 18, 10 ** 18 - 1]
    t0 = time.perf_counter()
    s = xor_sum(piles)
    dt = time.perf_counter() - t0
    print(f"  两堆各约 10^18 颗：异或 {s} → {'先手必胜' if s else '先手必败'}（{dt * 1e6:.2f}µs）")
    return None


def main():
    print("== 1. 实证：穷举小局面 + 三条不变量 + 反 Nim ==")
    total, n_terminal, n_zero, n_nonzero, moves, states, m_states = check_exhaustive(9, 5)
    print(f"  穷举 {total} 个局面（堆数 <= 5、每堆 <= 9）：异或判据 == 朴素搜索  OK")
    print(f"  反 Nim（取走最后一颗者输）判据 == 朴素搜索  OK（{m_states} 个搜索状态）")
    print(f"  I1 终局必败态 {n_terminal} 个；I2 0 态局面 {n_zero} 个，其 {moves} 条走法全部离开 0 态  OK")
    print(f"  I3 非 0 态局面 {n_nonzero} 个，每个都存在回到 0 态的走法  OK")
    print(f"  必胜走法计数 #{'p : p ^ S < p'} 与枚举一致  OK（搜索共 {states} 个状态）")

    rng = random.Random(1901)
    n = check_random_moves(rng)
    print(f"  随机较大局面复检：{n} 个异或非 0 局面  OK")

    print()
    bench_naive_vs_xor()
    print()
    bench_large_xor()
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
