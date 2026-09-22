#!/usr/bin/env python
"""LC 141/142「环形链表」的精确计数 —— 不是计时。

为什么不用计时
──────────────
这台机器的噪声底 12%，跨会话能涨到 57%（见 skill reliable-microbenchmarking）。
而「相遇步数」「快慢指针距离」「相遇点下标」都是**确定性算术**：同一份输入跑一百遍
都是同一个数，不受机器负载影响。正文里每个数字都由这个脚本产出，可复现：

    backend/venv/Scripts/python.exe tools/count_lc141_work.py

下标模型
────────
链表按遍历顺序排成 0 .. a+b-1：

    0 .. a-1      直段（head 到入口的前一个节点）
    a .. a+b-1    环，其中下标 a 就是入口
    末节点 a+b-1 的 next 指回 a

所以 `a` 同时是「入口下标」和「直段长度」，`b` 是环长，n = a + b。

gap 的口径
──────────
gap = (slow_ring - fast_ring) mod b，即**快指针沿前进方向走到慢指针还差几格**。
慢指针进环那一刻 gap0 = (-a · closing) mod b，其中 closing = fast_step - 1。
之后每步 gap 减 closing（模 b），所以 gap 依次是 gap0, gap0-closing, gap0-2·closing …
相遇就是 gap 命中 0。

正文用的演示链表是 1→2→…→13、入口是 5，即 a = 4、b = 9。
"""

from __future__ import annotations

from math import gcd

# ── 模型 ────────────────────────────────────────────────────────────────────


def advance(i: int, k: int, a: int, b: int) -> int:
    """从下标 i 走 k 步后的下标（链表成环，永远不会走出界）。"""
    n = a + b
    p = i
    for _ in range(k):
        p = p + 1 if p + 1 < n else a
    return p


def simulate(a: int, b: int, fast_step: int, cap: int | None = None):
    """标准 Floyd：两指针**同起点**（都从下标 0 出发）。

    返回 (相遇步数 t, 相遇下标, 是否相遇)。不相遇时前两项为 None。
    """
    if a + b == 0:
        return None, None, False
    if a == 0:
        # 头节点本身就在环上：两指针一开始就重合在入口。数学上 t = 0 就「相遇」了，
        # 但循环从 t = 1 起步会漏掉这一帧（闭式解给的是 0），所以单独分支。
        return 0, 0, True
    cap = cap if cap is not None else 2 * (a + b) + 8
    slow = fast = 0
    for t in range(1, cap + 1):
        slow = advance(slow, 1, a, b)
        fast = advance(fast, fast_step, a, b)
        if slow == fast:
            return t, slow, True
    return None, None, False


def gap_series(a: int, b: int, fast_step: int):
    """慢指针进环之后的 gap 序列（到相遇为止）。用于正文里的 5→4→3→2→1→0。"""
    closing = fast_step - 1
    gap0 = (-a * closing) % b
    out = []
    gap = gap0
    while True:
        out.append(gap)
        if gap == 0:
            return out
        gap = (gap - closing) % b
        if len(out) > 4 * b + 8:  # 安全阀：closing 与 b 不互质且 gap0 不可达时会走到这
            return out


def ring_meet_steps(b: int, closing: int, gap0: int, cap: int | None = None):
    """两指针**都在环上**、初始 gap = gap0 时的相遇步数；不相遇返回 None。

    这是「起始位置可以不同」的一般情形。标准 Floyd 只是它取 gap0 = (-a·closing) mod b 的特例。
    """
    if closing <= 0:
        return 0 if gap0 % b == 0 else None
    cap = cap if cap is not None else 4 * b + 8
    gap = gap0 % b
    for k in range(cap + 1):
        if gap == 0:
            return k
        gap = (gap - closing) % b
    return None


def steps_closed_form(a: int, b: int, closing: int) -> int:
    """总相遇步数的闭式解：**不小于 a 的最小 (b / gcd(closing, b)) 的倍数**。

    推导：gap0 = (-a·closing) mod b，令 k 为「慢指针进环后再走几步」，
    解 closing·k ≡ -a·closing (mod b)。两边除以 g = gcd(closing, b) 得
    (closing/g)·k ≡ -(closing/g)·a (mod b/g)，而 closing/g 与 b/g 互质，
    于是 k ≡ -a (mod b/g)，最小的 k 让 t = a + k 恰好是 m = b/g 的倍数。
    """
    if b <= 0 or closing <= 0:
        return a  # 退化：相对速度非正，不存在「追上」这回事
    m = b // gcd(closing, b)
    return -(-a // m) * m


# ── 报告 ────────────────────────────────────────────────────────────────────

DEMO_A, DEMO_B = 4, 9  # 1→…→13，入口 5
DEMO_FAST = 2

GRID_A = range(0, 15)
GRID_B = range(1, 15)
FAST_STEPS = (2, 3, 4, 5)


def section_demo() -> None:
    t, meet, ok = simulate(DEMO_A, DEMO_B, DEMO_FAST)
    a, b = DEMO_A, DEMO_B
    assert ok, "演示链表居然不相遇？"
    x = (t - a) % b
    gaps = gap_series(a, b, DEMO_FAST)

    print("一、演示链表 1→2→…→13（入口 5，a = 4，b = 9，快 2 慢 1）")
    print("-" * 78)
    print(f"  相遇步数 t            : {t}")
    print(f"  相遇节点              : 下标 {meet}（值 {meet + 1}）")
    print(f"  慢指针走过的步数      : {t}")
    print(f"  快指针走过的格数      : {t * DEMO_FAST}")
    print(f"  快指针多走的格数      : {t * (DEMO_FAST - 1)} = {t * (DEMO_FAST - 1) // b} × b（环长 {b}）")
    print(f"  慢指针进环时的 gap    : {gaps[0]}  ← (-a·closing) mod b = {(-a * 1) % b}")
    print(f"  gap 序列              : {' → '.join(map(str, gaps))}   （每步减 closing = 1）")
    print(f"  相遇点距入口 x        : {x}")
    print(f"  a + x                 : {a + x} = {b} × {(a + x) // b}   ← 正好整数圈，LC 142 的全部依据")
    print(f"  第二阶段两指针各走    : {a} 步（从 head）/ {a} 步（从相遇点）")
    print(f"  两阶段指针移动总次数  : {t * (1 + DEMO_FAST)} + {2 * a} = {t * (1 + DEMO_FAST) + 2 * a}"
          f"   （链表只有 {a + b} 个节点）")
    print()


def section_must_meet() -> None:
    print("二、「只要 fast_step ≥ 2 就必然相遇」—— 同起点暴力枚举")
    print("-" * 78)
    print(f"  {'快指针步数':<12} {'closing':<9} {'枚举对数':<10} {'不相遇对数':<12} {'占比'}")
    for fs in FAST_STEPS:
        total = bad = 0
        for a in GRID_A:
            for b in GRID_B:
                total += 1
                if not simulate(a, b, fs)[2]:
                    bad += 1
        share = f"{bad / total:.1%}"
        print(f"  {fs:<12} {fs - 1:<9} {total:<10} {bad:<12} {share}")
    print()
    print("  流传的「快 3 慢 1、环长为偶数时永不相遇」在同起点 Floyd 下**一次都没出现**。")
    print("  下一节给出原因。")
    print()


def section_divisibility() -> None:
    print("三、为什么必然相遇：gap0 天生就是 gcd(closing, b) 的倍数")
    print("-" * 78)
    print("  同余式 closing·k ≡ gap0 (mod b) 有解 ⟺ gcd(closing, b) 整除 gap0。")
    print("  而同起点时 gap0 = (-a·closing) mod b —— 它本身就是 closing 的倍数模 b，")
    print("  所以必然被 gcd(closing, b) 整除，方程必然有解。")
    print()
    print(f"  {'快指针步数':<12} {'枚举对数':<10} {'gap0 不被 gcd 整除的对数'}")
    for fs in FAST_STEPS:
        closing = fs - 1
        total = bad = 0
        for a in GRID_A:
            for b in GRID_B:
                total += 1
                g = gcd(closing, b)
                if ((-a * closing) % b) % g != 0:
                    bad += 1
        print(f"  {fs:<12} {total:<10} {bad}")
    print()
    print("  三行都是 0 —— 这就是「必然相遇」的代数根，而不是「运气好」。")
    print()


def section_closed_form() -> None:
    print("四、相遇步数的闭式解，与暴力模拟逐项对照")
    print("-" * 78)
    mismatches = []
    for fs in FAST_STEPS:
        closing = fs - 1
        for a in GRID_A:
            for b in GRID_B:
                got = simulate(a, b, fs)[0]
                want = steps_closed_form(a, b, closing)
                if got != want:
                    mismatches.append((fs, a, b, got, want))
    print(f"  闭式：t = 不小于 a 的最小 (b / gcd(closing, b)) 的倍数")
    print(f"  枚举 {len(list(GRID_A)) * len(list(GRID_B)) * len(FAST_STEPS)} 组，"
          f"与暴力模拟不符的：{len(mismatches)} 组")
    print()
    print(f"  {'a':<4} {'b':<4} {'快 2':<7} {'快 3':<7} {'快 4':<7} {'快 5'}")
    for a in (0, 1, 4, 7, 12):
        for b in (1, 2, 5, 6, 9, 12):
            row = []
            for fs in FAST_STEPS:
                t, _, _ = simulate(a, b, fs)
                row.append(str(t) if t is not None else "—")
            print(f"  {a:<4} {b:<4} {row[0]:<7} {row[1]:<7} {row[2]:<7} {row[3]}")
    print()


def section_closing_one() -> None:
    print("五、为什么必须是 closing = 1：LC 142 的「回 head」解法只在此时成立")
    print("-" * 78)
    print("  LC 142 第二阶段要求：从相遇点走 a 步**也**落在入口，即 (x + a) mod b == 0。")
    print("  由 t = a + x 且 t 是 b/gcd(closing, b) 的倍数可知：只有 gcd(closing, b) = 1")
    print("  时 t 才必然是 b 的倍数。closing ≥ 2 且与 b 不互质时就会失效。")
    print()
    print(f"  {'快指针步数':<12} {'closing':<9} {'枚举对数':<10} {'(a+x) mod b ≠ 0':<16} {'成立占比'}")
    for fs in FAST_STEPS:
        closing = fs - 1
        total = bad = 0
        for a in GRID_A:
            for b in GRID_B:
                total += 1
                t = steps_closed_form(a, b, closing)
                x = (t - a) % b
                if (x + a) % b != 0:
                    bad += 1
        print(f"  {fs:<12} {closing:<9} {total:<10} {bad:<16} {1 - bad / total:.1%}")
    print()
    print("  快 2（closing = 1）100% 成立；快 3 / 快 4 就开始漏 —— 环长为偶数时漏得最狠。")
    print("  这就是「快慢指针只能走 2 和 1」的第二条理由（第一条是相对速度必须为正）。")
    print()


def section_other_start() -> None:
    print("六、那流传的说法错在哪：两指针**起始位置不同**时它是对的")
    print("-" * 78)
    print("  若两指针一开始就都在环上、初始 gap = d0（d0 是任意的），")
    print("  相遇条件只剩「gcd(closing, b) 整除 d0」—— d0 不再被保证。")
    print()
    print(f"  {'b':<4} {'closing':<9} {'gcd':<5} {'d0=1':<8} {'d0=2':<8} {'d0=3'}")
    for b in (4, 6, 8, 9, 12):
        for closing in (1, 2):
            g = gcd(closing, b)
            row = []
            for d0 in (1, 2, 3):
                k = ring_meet_steps(b, closing, d0)
                row.append("相遇" if k is not None else "错过")
            print(f"  {b:<4} {closing:<9} {g:<5} {row[0]:<8} {row[1]:<8} {row[2]}")
    print()
    print("  看 b = 6、closing = 2、d0 = 1：gcd = 2 不整除 1，永远错过 —— 反例是真的，")
    print("  但它要求「两个指针不同起点」。标准 Floyd 两指针同起点，gap0 被 gcd 锁死，")
    print("  所以碰不到这个坑。**把不同起点的结论套到同起点上，就是那个流传错误的来源。**")
    print()


def section_space() -> None:
    n = DEMO_A + DEMO_B
    print("七、O(1) 空间：进阶要求的那句话")
    print("-" * 78)
    print(f"  演示链表 n = {n} 个节点。")
    print("  哈希表法：每访问一个节点就往 set 里塞一个，最坏要存 n 个节点引用 → O(n) 空间。")
    print("  Floyd  ：全程只有 slow / fast 两个指针变量，与 n 无关 → O(1) 空间。")
    print(f"  判环阶段的时间：快指针每步走 2 格，进环后最多 b - 1 步追上，总步数 O(n)。")
    print("  所以「O(n) 时间 + O(1) 空间」是可以同时成立的 —— 代价是常数更大、且必须能改指针。")
    print()


def main() -> int:
    print("LC 141/142「环形链表」精确计数（确定性算术，非计时）")
    print("=" * 78)
    print()
    section_demo()
    section_must_meet()
    section_divisibility()
    section_closed_form()
    section_closing_one()
    section_other_start()
    section_space()
    print("=" * 78)
    print("一句话：同起点 Floyd 下 gap0 = (-a·closing) mod b 必然被 gcd(closing, b) 整除，")
    print("所以任何 fast_step ≥ 2 都必然相遇；而 closing = 1 是让 LC 142 成立的唯一取值。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
