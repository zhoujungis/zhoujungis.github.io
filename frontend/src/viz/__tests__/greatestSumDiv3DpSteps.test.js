/**
 * greatestSumDiv3DpSteps.test.js — LC 1262「可被三整除的最大和」取模 dp 状态机单测。
 *
 * 交叉验证：状态机（三格滚动 dp）vs 独立参考解「枚举全部子集」（对负数同样成立）。
 * 逐帧钉死：回放一致、转移是双射、状态只增不减、dp[0] 恒可达、结果一致。
 */
import { describe, it, expect } from 'vitest'
import { buildGreatestSumDiv3DpSteps, GREATEST_SUM_DIV3_NEG as NEG } from '../greatestSumDiv3DpSteps.js'

const refBrute = (nums) => {
  let best = NEG
  for (let mask = 0; mask < 1 << nums.length; mask += 1) {
    let s = 0
    for (let i = 0; i < nums.length; i += 1) if (mask & (1 << i)) s += nums[i]
    if (((s % 3) + 3) % 3 === 0 && s > best) best = s
  }
  return best
}

const DEFAULT_NUMS = [3, 6, 5, 1, 8]

const CASES = [
  { nums: DEFAULT_NUMS }, // → 18
  { nums: [4] }, // → 0
  { nums: [1, 2, 3, 4, 4] }, // → 12
  { nums: [3, 6, 9] }, // → 18
  { nums: [1, 1, 1] }, // → 3
  { nums: [2, 2, 2] }, // → 6
  { nums: [-1, -2, -3] }, // → 0（空集）
  { nums: [-5, 3, 4] }, // → 3? 由暴力决定
  { nums: [0, 0, 7] }, // → 0
  { nums: [10, 11, 12] }, // → 33
]

describe('greatestSumDiv3DpSteps（LC 1262 取模 dp）', () => {
  it.each(CASES)('结果与暴力枚举一致（含负数）：%j', (c) => {
    const steps = buildGreatestSumDiv3DpSteps(c)
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    expect(done.result).toBe(refBrute(steps[0].nums))
  })

  it.each(CASES)('帧骨架与不变量：%j', (c) => {
    const steps = buildGreatestSumDiv3DpSteps(c)
    const { nums, n } = steps[0]

    expect(steps[0].phase).toBe('init')
    const fills = steps.filter((f) => f.phase === 'fill')
    expect(fills).toHaveLength(n)
    fills.forEach((f, k) => expect(f.i).toBe(k))

    for (let k = 1; k < steps.length; k += 1) {
      const f = steps[k]
      const p = steps[k - 1]
      // 回放一致
      expect(f.prevDp).toEqual(p.dp)
      // dp[0] 恒可达且 >= 0（空集兜底）
      expect(f.dp[0]).toBeGreaterThanOrEqual(0)
      // 状态只增不减
      for (let j = 0; j < 3; j += 1) {
        if (p.dp[j] === NEG) continue
        expect(f.dp[j] === NEG || f.dp[j] >= p.dp[j]).toBe(true)
      }
    }

    for (const f of fills) {
      // 转移覆盖所有可达旧状态，且 to 两两不同（加法是双射）
      const reachable = [0, 1, 2].filter((j) => f.prevDp[j] !== NEG)
      expect(f.transitions.map((t) => t.from)).toEqual(reachable)
      expect(new Set(f.transitions.map((t) => t.to)).size).toBe(f.transitions.length)
      for (const t of f.transitions) {
        expect(t.to).toBe((t.from + f.rem) % 3)
        expect(t.value).toBe(t.prev + f.x)
        // 目标格最终值 = max(旧目标值, 候选)
        expect(f.dp[t.to]).toBe(Math.max(f.prevDp[t.to], t.value === NEG ? NEG : t.value))
      }
    }
  })

  it('默认题面：[3,6,5,1,8] → 18，逐帧 dp 轨迹钉死', () => {
    const steps = buildGreatestSumDiv3DpSteps()
    expect(steps.map((f) => f.phase)).toEqual([
      'init', 'fill', 'fill', 'fill', 'fill', 'fill', 'done',
    ])
    expect(steps.filter((f) => f.phase === 'fill').map((f) => f.dp)).toEqual([
      [3, NEG, NEG],
      [9, NEG, NEG],
      [9, NEG, 14],
      [15, 10, 14],
      [18, 22, 23],
    ])
    expect(steps.at(-1).dp).toEqual([18, 22, 23])
    expect(steps.at(-1).result).toBe(18)
    expect(steps.at(-1).desc).toContain('18')
  })

  it('负数也成立：[-1,-2,-3] → 0（空集最优）', () => {
    const steps = buildGreatestSumDiv3DpSteps({ nums: [-1, -2, -3] })
    expect(steps.at(-1).result).toBe(0)
  })

  it('非法输入回退默认', () => {
    expect(buildGreatestSumDiv3DpSteps({ nums: [] })[0].nums).toEqual(DEFAULT_NUMS)
    expect(buildGreatestSumDiv3DpSteps({ nums: [1.5, 'x'] })[0].nums).toEqual(DEFAULT_NUMS)
    expect(buildGreatestSumDiv3DpSteps({ nums: null })[0].nums).toEqual(DEFAULT_NUMS)
  })

  it('随机交叉：500 组（含负数）vs 暴力枚举', () => {
    let rng = 1262
    const rand = (n) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % n
    }
    for (let t = 0; t < 500; t += 1) {
      const nums = Array.from({ length: 1 + rand(9) }, () => rand(21) - 10)
      const steps = buildGreatestSumDiv3DpSteps({ nums })
      expect(steps.at(-1).result).toBe(refBrute(nums))
    }
  })
})
