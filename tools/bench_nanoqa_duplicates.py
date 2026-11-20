# -*- coding: utf-8 -*-
"""Duplicate-case detector cost bench.

`backend/apps/ai/services/duplicate_detector.py` compares every pair of cases in a
project with difflib.SequenceMatcher over `title + steps` text, then keeps the
pairs above SIMILARITY_THRESHOLD. That is O(n^2) SequenceMatcher calls with no
blocking/window, so cost grows quadratically with the number of cases.

This script reproduces that exact loop with the real constants and measures how
many comparisons one project scan performs, and how long it takes as case counts
grow. No Django involved: only the text assembly and the comparison loop are
copied out.

Usage: python tools/bench_nanoqa_duplicates.py
"""

import random
import time
from difflib import SequenceMatcher

SIMILARITY_THRESHOLD = 0.6
MAX_PAIRS = 50

ACTIONS = [
    "进入登录页面", "输入正确账号密码", "点击登录按钮", "校验首页元素",
    "进入订单列表", "筛选近七天订单", "点击订单详情", "校验金额字段",
    "发起退款申请", "上传退款凭证", "提交退款", "校验退款状态",
    "切换多语言", "校验文案渲染", "刷新页面", "校验登录态保持",
]
EXPECTED = [
    "页面加载正常", "登录成功并跳转", "列表展示正确", "金额与订单一致",
    "退款单创建成功", "状态流转为审核中", "文案无缺失", "登录态不丢失",
]


def case_text(index: int, rng: random.Random) -> str:
    """Build a `title + steps` string shaped like the real detector input."""
    title = f"订单退款流程验证用例 {index % 37}"
    steps = []
    for _ in range(rng.randint(2, 6)):
        steps.append(f"{rng.choice(ACTIONS)} {rng.choice(EXPECTED)}")
    return f"{title} {' '.join(steps)}"


def find_duplicates(texts):
    """Exact copy of find_duplicates' comparison loop (no Django calls)."""
    pairs = []
    for i in range(len(texts)):
        for j in range(i + 1, len(texts)):
            similarity = SequenceMatcher(None, texts[i][1], texts[j][1]).ratio()
            if similarity >= SIMILARITY_THRESHOLD:
                pairs.append({
                    "case_a": texts[i][0],
                    "case_b": texts[j][0],
                    "similarity": round(similarity, 4),
                })
    pairs.sort(key=lambda item: (-item["similarity"], item["case_a"], item["case_b"]))
    return pairs[:MAX_PAIRS]


def run(case_count: int, seed: int = 7):
    rng = random.Random(seed)
    texts = [(pk, case_text(pk, rng)) for pk in range(1, case_count + 1)]
    started = time.perf_counter()
    pairs = find_duplicates(texts)
    elapsed = time.perf_counter() - started
    comparisons = case_count * (case_count - 1) // 2
    return comparisons, elapsed, len(pairs)


def main():
    print("NanoQA duplicate-case detector bench")
    print(f"threshold={SIMILARITY_THRESHOLD}  returned pairs capped at {MAX_PAIRS}")
    print("")
    print(f"{'cases':>7} {'comparisons':>12} {'seconds':>10} {'ms/1k cmp':>11} {'pairs>=0.6':>11}")

    rows = []
    for case_count in (100, 200, 400, 800):
        comparisons, elapsed, pair_count = run(case_count)
        rows.append((case_count, comparisons, elapsed))
        print(f"{case_count:>7} {comparisons:>12,} {elapsed:>10.3f} "
              f"{elapsed / comparisons * 1e6:>11.3f} {pair_count:>11}")

    print("")
    print("quadratic growth check (comparisons should scale ~4x per doubling):")
    for previous, current in zip(rows, rows[1:]):
        ratio = current[1] / previous[1]
        print(f"  {previous[0]:>5} -> {current[0]:>5} cases: "
              f"{ratio:.2f}x comparisons, {current[2] / previous[2]:.2f}x time")

    print("")
    print("extrapolated single-project scans (linear fit through the 400/800 points):")
    per_comparison = (rows[-1][2] - rows[-2][2]) / (rows[-1][1] - rows[-2][1])
    for case_count in (1600, 2000, 5000):
        comparisons = case_count * (case_count - 1) // 2
        print(f"  {case_count:>5} cases: {comparisons:>12,} comparisons "
              f"~= {comparisons * per_comparison:>7.1f} s")


if __name__ == "__main__":
    main()
