#!/usr/bin/env python
"""LC 23「合并 K 个升序链表」三种解法的精确工作量计数。

为什么不用计时
──────────────
这台机器的噪声底 12%，跨会话能涨到 57%（见 skill reliable-microbenchmarking）。
但"比较次数"和"节点访问次数"是**确定性算术** —— 同一份输入跑一百遍都是同一个数，
不受机器负载影响，也不受语言/实现常数影响（只要算法骨架一样）。

所以文章里的那张对比表用的是**计数**，不是**计时**。这是可复现的：
    backend/venv/Scripts/python.exe tools/count_lc23_work.py

三种解法
────────
  1. sequential  顺序两两合并：result = lists[0]；逐条往后 mergeTwoLists
  2. divide      分治两两合并：每轮两两配对，⌈log₂k⌉ 轮
  3. heap        最小堆：堆里只放 k 个头部

统计口径
────────
  cmp     键比较次数（元素值之间的 < 比较）
  visits  节点被读入输出的次数（每被搬一次算一次，反映"每个节点被摸了几遍"）
"""

from __future__ import annotations

import heapq
import random
from dataclasses import dataclass


@dataclass
class Stats:
    cmp: int = 0
    visits: int = 0

    def reset(self) -> None:
        self.cmp = 0
        self.visits = 0


STATS = Stats()


# ── 带计数的比较键 ───────────────────────────────────────────────────────────
class Cmp:
    """包一层，让每一次 `<` 都被记下来。

    堆里塞 (Cmp(val), i, node)：元组比较先比 Cmp，值相等时才去比 i。
    所以"值相等的两个元素"在 Python 里不会比到 node 本身 ——
    这正是正文里说的"塞个序号垫背"的写法。
    """

    __slots__ = ("v",)

    def __init__(self, v):
        self.v = v

    def __lt__(self, other):
        STATS.cmp += 1
        return self.v < other.v

    def __eq__(self, other):
        return self.v == other.v

    def __le__(self, other):
        STATS.cmp += 1
        return self.v <= other.v

    def __repr__(self):
        return f"Cmp({self.v})"


@dataclass
class Node:
    val: int
    next: "Node | None" = None


def make_lists(k: int, n: int, seed: int = 20260922) -> list[list[int]]:
    """k 条长度 n 的升序链表（值域放宽到 k*n*4，避免太多相等值干扰比较计数）。"""
    rng = random.Random(seed)
    hi = max(10, k * n * 4)
    return [sorted(rng.randrange(hi) for _ in range(n)) for _ in range(k)]


def to_nodes(values: list[int]) -> Node | None:
    head = None
    for v in reversed(values):
        head = Node(v, head)
    return head


def walk(head: Node | None) -> list[int]:
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out


# ── 1. 顺序两两合并 ─────────────────────────────────────────────────────────
def merge_two(a: Node | None, b: Node | None) -> Node | None:
    """LC 21 的解法：哑结点 + tail 指针。计数版。"""
    dummy = Node(-1)
    tail = dummy
    while a and b:
        STATS.cmp += 1
        if a.val <= b.val:
            tail.next = a
            a = a.next
        else:
            tail.next = b
            b = b.next
        tail = tail.next
        STATS.visits += 1
    rest = a or b
    while rest:  # 整段接上：不用比较，但每个节点都被摸了一次
        STATS.visits += 1
        rest = rest.next
    tail.next = a or b
    return dummy.next


def sequential(heads: list[Node | None]) -> Node | None:
    result = heads[0] if heads else None
    for head in heads[1:]:
        result = merge_two(result, head)
    return result


# ── 2. 分治两两合并 ─────────────────────────────────────────────────────────
def divide(heads: list[Node | None]) -> Node | None:
    level = list(heads)
    if not level:
        return None
    while len(level) > 1:
        nxt = []
        for i in range(0, len(level), 2):
            if i + 1 < len(level):
                nxt.append(merge_two(level[i], level[i + 1]))
            else:
                nxt.append(level[i])  # 轮空，原样进下一轮
        level = nxt
    return level[0]


# ── 3. 最小堆 ───────────────────────────────────────────────────────────────
def heap_merge(heads: list[Node | None]) -> Node | None:
    dummy = Node(-1)
    tail = dummy
    heap: list[tuple[Cmp, int, Node]] = []
    for i, head in enumerate(heads):
        if head:
            heapq.heappush(heap, (Cmp(head.val), i, head))
    while heap:
        _, i, node = heapq.heappop(heap)
        tail.next = node
        tail = tail.next
        STATS.visits += 1
        nxt = node.next
        if nxt:
            STATS.visits += 1
            heapq.heappush(heap, (Cmp(nxt.val), i, nxt))
    return dummy.next


# ── 报告 ────────────────────────────────────────────────────────────────────
# 选例思路：最后两组 N 都是 10,000，但 k 差 10 倍 —— 正好暴露 sequential 对 k 的依赖。
# 不选 (1000, 1000)：sequential 要摸 5×10⁸ 个节点，Python 里跑不动，
# 而它的增长规律已经被前三组钉死了（随 k 近似平方增长）。
CASES = [
    # (k, n) —— k 条链表，每条 n 个节点
    (4, 8),
    (8, 100),
    (100, 100),
    (1000, 10),
]


def measure(k, n):
    values = make_lists(k, n)
    rows = {}

    # 每次都用全新的节点对象，避免解法之间互相污染 next 指针
    def fresh():
        return [to_nodes(l) for l in values]

    STATS.reset()
    out_seq = sequential(fresh())
    rows["sequential"] = (STATS.cmp, STATS.visits)

    STATS.reset()
    out_dc = divide(fresh())
    rows["divide"] = (STATS.cmp, STATS.visits)

    STATS.reset()
    out_heap = heap_merge(fresh())
    rows["heap"] = (STATS.cmp, STATS.visits)

    expected = sorted(v for l in values for v in l)
    for label, out in (("sequential", out_seq), ("divide", out_dc), ("heap", out_heap)):
        got = walk(out)
        assert got == expected, f"{label} 结果错误：{len(got)} vs {len(expected)}"

    return rows, len(expected)


def main() -> int:
    print("LC 23 三种解法的精确工作量计数（确定性算术，非计时）")
    print("=" * 78)
    for k, n in CASES:
        rows, total = measure(k, n)
        print(f"\nk = {k}，每条 {n} 个节点，N = {total}")
        print(f"  {'解法':<12} {'比较次数':>14} {'节点访问':>14}   {'相对最少比较':>12}")
        base = min(v[0] for v in rows.values())
        for label, (cmp, visits) in rows.items():
            print(f"  {label:<12} {cmp:>14,} {visits:>14,}   {cmp / base:>11.2f}x")
    print()
    print("读法：sequential 的比较次数随 k 近似平方增长；divide 与 heap 近似线性于 N·log k。")
    print("注意 heap 的常数比 divide 大 —— 每个节点进出堆各一次，每次最多 log₂k 次比较。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
