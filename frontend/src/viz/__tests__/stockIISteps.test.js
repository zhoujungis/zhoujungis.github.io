/**
 * stockIISteps.test.js — LC 122「买卖股票的最佳时机 II」状态机单测。
 *
 * 交叉验证：状态机（cash/hold 双变量 DP）vs 两个独立参考解 ——
 * ① 自顶向下递归 dp(i, holding)（实现路径完全不同）；② 正差之和（贪心公式）。
 * 逐帧钉死：回放一致、两条转移方程、cash >= hold、cash 单调不减、
 * **greedy === cash 逐帧相等**（"贪心 ≡ 状态机"的现场证明）、take/diff 一致。
 */
import { describe, it, expect } from 'vitest'
import { buildStockIISteps } from '../stockIISteps.js'

const DEFAULT_PRICES = [7, 1, 5, 3, 6, 4]

// 独立参考解 ①：自顶向下递归（每天三选一：跳过 / 卖 / 买）
const ref122 = (ps) => {
  const memo = new Map()
  const dp = (i, holding) => {
    if (i >= ps.length) return 0
    const key = `${i}:${holding}`
    if (memo.has(key)) return memo.get(key)
    const skip = dp(i + 1, holding)
    const act = holding ? ps[i] + dp(i + 1, 0) : -ps[i] + dp(i + 1, 1)
    const v = Math.max(skip, act)
    memo.set(key, v)
    return v
  }
  return dp(0, 0)
}

// 独立参考解 ②：贪心正差之和
const greedyRef = (ps) =>
  ps.slice(1).reduce((s, p, i) => s + Math.max(0, p - ps[i]), 0)

const CASES = [
  {}, // 默认 [7,1,5,3,6,4] → 7
  { prices: [1, 2, 3, 4, 5] }, // 单调上坡 → 4（等价连续持有）
  { prices: [5, 4, 3, 2, 1] }, // 单调下跌 → 0
  { prices: [1, 2] }, // 最小上坡
  { prices: [2, 1] }, // 最小下跌
  { prices: [7] }, // 单元素 → 0
  { prices: [3, 3, 3] }, // 全平
  { prices: [1, 100000] }, // 大数差
  { prices: [2, 1, 2, 0, 1] }, // 多段小上坡
  { prices: [0, 4, 2, 5] }, // 含 0 价（cash>=hold 要求价格非负，与题意约束一致）
  { prices: [1, 2, 1, 2, 1, 2] }, // 锯齿
]

const optsOf = (c) => (c.prices ? c : { prices: DEFAULT_PRICES })

describe('stockIISteps（LC 122）', () => {
  it.each(CASES)('最终结果与递归/贪心两个参考解一致：%j', (c) => {
    const steps = buildStockIISteps(optsOf(c))
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    const ps = steps[0].prices
    expect(done.result).toBe(ref122(ps))
    expect(done.result).toBe(greedyRef(ps))
  })

  it.each(CASES)('逐帧不变量：%j', (c) => {
    const steps = buildStockIISteps(optsOf(c))
    const { prices } = steps[0]
    for (let i = 1; i < steps.length; i += 1) {
      const f = steps[i]
      const p = steps[i - 1]
      // 回放一致
      expect(f.prevCash).toBe(p.cash)
      expect(f.prevHold).toBe(p.hold)
      expect(f.prevGreedy).toBe(p.greedy)
      if (f.phase === 'scan') {
        expect(f.day).toBe(i) // scan 帧号 === 交易日（init 占 0）
        expect(f.price).toBe(prices[f.day])
        expect(f.prevPrice).toBe(prices[f.day - 1])
        expect(f.diff).toBe(f.price - f.prevPrice)
        expect(f.take).toBe(f.diff > 0)
        // 贪心累计
        expect(f.greedy).toBe(f.prevGreedy + (f.take ? f.diff : 0))
        // 两条转移方程（hold 用**更新前**的 cash 买）
        expect(f.sellValue).toBe(f.prevHold + f.price)
        expect(f.buyValue).toBe(f.prevCash - f.price)
        expect(f.cash).toBe(Math.max(f.prevCash, f.sellValue))
        expect(f.hold).toBe(Math.max(f.prevHold, f.buyValue))
        // 结构性不变量
        expect(f.cash).toBeGreaterThanOrEqual(f.hold) // 票没变现不更赚
        expect(f.cash).toBeGreaterThanOrEqual(p.cash) // 空仓的钱不减
        // 贪心 ≡ 状态机：逐帧相等
        expect(f.greedy).toBe(f.cash)
      } else {
        expect(f.phase).toBe('done')
        expect(f.result).toBe(f.cash)
        expect(f.cash).toBe(p.cash)
        expect(f.cash).toBe(f.greedy)
      }
    }
  })

  it('默认序列：7 帧，greedy/cash 轨迹钉死 → 7', () => {
    const steps = buildStockIISteps()
    expect(steps).toHaveLength(7)
    expect(steps.map((f) => f.phase)).toEqual([
      'init', 'scan', 'scan', 'scan', 'scan', 'scan', 'done',
    ])
    // hold 轨迹：-7 → -1 → -1 → 1 → 1 → 3 → 3
    expect(steps.map((f) => f.hold)).toEqual([-7, -7, -1, -1, 1, 1, 3, 3].slice(1))
    // cash === greedy 轨迹
    expect(steps.map((f) => f.cash)).toEqual([0, 0, 0, 4, 4, 7, 7, 7].slice(1))
    expect(steps.map((f) => f.greedy)).toEqual(steps.map((f) => f.cash))
    // diff / take 钉死
    expect(steps.slice(1, 6).map((f) => f.diff)).toEqual([-6, 4, -2, 3, -2])
    expect(steps.slice(1, 6).map((f) => f.take)).toEqual([false, true, false, true, false])
    expect(steps.at(-1).result).toBe(7)
  })

  it('单调上坡：DP 不频繁买卖也拿到连续持有的利润', () => {
    const steps = buildStockIISteps({ prices: [1, 2, 3, 4, 5] })
    expect(steps.at(-1).result).toBe(4)
    // 每天都"持股不动"优先：hold 始终 = -1（第 0 天建仓不换手）
    expect(steps.filter((f) => f.phase === 'scan').map((f) => f.hold)).toEqual([-1, -1, -1, -1])
  })

  it('单元素：init + done 两帧，答案 0', () => {
    const steps = buildStockIISteps({ prices: [7] })
    expect(steps).toHaveLength(2)
    expect(steps[0].hold).toBe(-7)
    expect(steps[1].result).toBe(0)
  })

  it('全程下跌：take 恒 false，cash 恒 0', () => {
    const steps = buildStockIISteps({ prices: [5, 4, 3, 2] })
    const scans = steps.filter((f) => f.phase === 'scan')
    expect(scans.every((f) => f.take === false)).toBe(true)
    expect(scans.every((f) => f.cash === 0)).toBe(true)
    expect(steps.at(-1).result).toBe(0)
  })

  it('随机交叉：500 组 vs 递归 + 正差和', () => {
    let rng = 24681357
    const rand = (n) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % n
    }
    for (let t = 0; t < 500; t += 1) {
      const prices = Array.from({ length: 1 + rand(12) }, () => rand(60)) // 非负：与题意约束一致
      const steps = buildStockIISteps({ prices })
      const done = steps.at(-1)
      expect(done.result).toBe(ref122(prices))
      expect(done.result).toBe(greedyRef(prices))
      for (const f of steps) expect(f.greedy).toBe(f.cash)
    }
  })

  it('非法输入回退默认：空数组 / null', () => {
    const empty = buildStockIISteps({ prices: [] })
    expect(empty[0].prices).toEqual(DEFAULT_PRICES)
    const nul = buildStockIISteps({ prices: null })
    expect(nul[0].prices).toEqual(DEFAULT_PRICES)
  })

  it('所有帧共享同一份 prices，且是拷贝', () => {
    const input = [1, 2, 3]
    const steps = buildStockIISteps({ prices: input })
    input.push(99)
    for (const f of steps) expect(f.prices).toEqual([1, 2, 3])
  })

  it('done 帧 desc 列出每段上坡', () => {
    const steps = buildStockIISteps()
    const done = steps.at(-1)
    expect(done.desc).toContain('第 1→2 天 +4')
    expect(done.desc).toContain('第 3→4 天 +3')
    expect(done.desc).toContain('7')
  })
})
