import { describe, expect, it } from 'vitest'

import { buildClimbSteps } from '../climbSteps.js'
import { buildClimbRecSteps } from '../climbRecSteps.js'

const INT32 = 2147483647

/** 独立参考解：组合数公式 sum C(n-k, k) —— 与 dp 完全不同的推导路线。 */
function brute(n) {
  let sum = 0
  for (let k = 0; k <= Math.floor(n / 2); k += 1) {
    let c = 1
    for (let t = 0; t < k; t += 1) c = (c * (n - k - t)) / (t + 1)
    sum += Math.round(c)
  }
  return sum
}

const answer = (n) => {
  const s = buildClimbSteps({ n })
  return s[s.length - 1].answer
}

describe('LC 70 buildClimbSteps · 答案', () => {
  it('小值直接钉死（1,2,3,5,8…是斐波那契）', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(answer)).toEqual([
      1, 2, 3, 5, 8, 13, 21, 34, 55, 89,
    ])
  })

  it('与组合数公式在 n=0..40 上一致', () => {
    for (let n = 0; n <= 40; n += 1) {
      expect(answer(n), `n=${n}`).toBe(brute(n))
    }
  })

  it('边界：n=0（不动也算一种）与 n=1', () => {
    expect(answer(0)).toBe(1)
    expect(answer(1)).toBe(1)
    const s0 = buildClimbSteps({ n: 0 })
    expect(s0.length).toBe(2)
    expect(s0[0].dp).toEqual([1])
  })

  it('溢出阈值（脚本核实过的精确值）：ways(45) 是 int32 最后一个，ways(46) 爆', () => {
    expect(answer(45)).toBe(1836311903)
    expect(answer(46)).toBe(2971215073)
    expect(answer(45)).toBeLessThanOrEqual(INT32)
    expect(answer(46)).toBeGreaterThan(INT32)
  })

  it('溢出模式：lastOk = 45，settle(46) 标红', () => {
    const s = buildClimbSteps({ n: 50, int32Limit: INT32 })
    expect(s[s.length - 1].lastOk).toBe(45)
    const f45 = s.find((f) => f.phase === 'settle' && f.i === 45)
    const f46 = s.find((f) => f.phase === 'settle' && f.i === 46)
    expect(f45.over).toBe(false)
    expect(f46.over).toBe(true)
    expect(f46.value).toBe(2971215073)
  })

  it('不传 int32Limit 时永远不标红', () => {
    const s = buildClimbSteps({ n: 50 })
    for (const f of s) expect(f.over).toBe(false)
    expect(s[s.length - 1].lastOk).toBeNull()
  })
})

describe('LC 70 buildClimbSteps · 帧结构与不变量', () => {
  it('帧数 = 2 + (n-1)*3（init/done + 每阶 from1/from2/settle）', () => {
    for (const n of [2, 5, 10, 50]) {
      expect(buildClimbSteps({ n }).length, `n=${n}`).toBe(2 + (n - 1) * 3)
    }
  })

  it('settle 帧的 value 就是 dp[i]，dp 快照单调不回退', () => {
    const s = buildClimbSteps({ n: 10 })
    const fin = s[s.length - 1].dp
    for (const f of s) {
      for (let k = 0; k <= 10; k += 1) {
        if (f.dp[k] !== 0) expect(f.dp[k]).toBe(fin[k])
      }
      if (f.phase === 'settle') {
        expect(f.value).toBe(f.dp[f.i])
        expect(f.value).toBe(f.dp[f.i - 1] + f.dp[f.i - 2])
      }
      if (f.phase !== 'done') expect(f.answer).toBeNull()
      expect(f.desc.length).toBeGreaterThan(0)
    }
  })

  it('done 帧保留真实字段（answer / dp / over）', () => {
    const s = buildClimbSteps({ n: 10 })
    const last = s[s.length - 1]
    expect(last.done).toBe(true)
    expect(last.answer).toBe(89)
    expect(last.dp[10]).toBe(89)
    expect(last.i).toBe(10)
  })

  it('from1 / from2 帧的 from 指向正确的来路', () => {
    const s = buildClimbSteps({ n: 10 })
    const f1 = s.find((f) => f.phase === 'from1' && f.i === 5)
    const f2 = s.find((f) => f.phase === 'from2' && f.i === 5)
    expect(f1.from).toBe(4)
    expect(f2.from).toBe(3)
  })
})

describe('LC 70 buildClimbRecSteps · 递归树', () => {
  /** 独立参考：自顶向下统计每个 k 被调用的次数。 */
  function refCounts(n) {
    const c = {}
    c[n] = 1
    for (let k = n; k >= 2; k -= 1) {
      c[k - 1] = (c[k - 1] || 0) + c[k]
      c[k - 2] = (c[k - 2] || 0) + c[k]
    }
    return c
  }

  it('n=6：25 次调用、18 次重复、13 个叶子（= ways(6)）、7 个不同的 k', () => {
    const s = buildClimbRecSteps({ n: 6 })
    const done = s[s.length - 1]
    expect(done.calls).toBe(25)
    expect(done.dupCalls).toBe(18)
    expect(done.leaves).toBe(13)
    expect(done.distinct).toBe(7)
    expect(s.length).toBe(26)
  })

  it('调用次数逐值对上独立参考（n=2..8）', () => {
    for (const n of [2, 3, 4, 5, 6, 7, 8]) {
      const s = buildClimbRecSteps({ n })
      const done = s[s.length - 1]
      const c = refCounts(n)
      const total = Object.values(c).reduce((a, b) => a + b, 0)
      expect(done.calls, `n=${n}`).toBe(total)
      expect(done.leaves, `n=${n} 叶子应=ways(n)`).toBe(brute(n))
      expect(done.distinct, `n=${n}`).toBe(n + 1)
      // 叶子数 = f(0) 与 f(1) 的调用次数之和
      expect(done.leaves).toBe((c[0] || 0) + (c[1] || 0))
    }
  })

  it('逐帧口径：ord 是运行值、revealed 是前缀、path 走回同一个 k', () => {
    const s = buildClimbRecSteps({ n: 6 })
    const seen = new Map()
    for (let k = 0; k < s.length - 1; k += 1) {
      const f = s[k]
      const { value, ord, idx, dup, path } = f.node
      expect(ord).toBe(seen.get(value) || 0)
      expect(dup).toBe(ord > 0)
      expect(f.revealed.length).toBe(idx + 1)
      expect(f.calls).toBe(idx + 1)
      // path 逐步 -1(L) / -2(R)，终点必须等于 value
      let cur = 6
      for (const side of path) {
        cur += side === 'L' ? -1 : -2
        expect(cur).toBeGreaterThanOrEqual(0)
      }
      expect(cur).toBe(value)
      seen.set(value, ord + 1)
    }
  })

  it('n=6 时 f(2) 被算 5 次、f(0) 5 次、f(1) 8 次', () => {
    const s = buildClimbRecSteps({ n: 6 })
    const counts = {}
    for (const f of s) {
      if (f.phase === 'call') counts[f.node.value] = (counts[f.node.value] || 0) + 1
    }
    expect(counts).toEqual({ 0: 5, 1: 8, 2: 5, 3: 3, 4: 2, 5: 1, 6: 1 })
  })
})
