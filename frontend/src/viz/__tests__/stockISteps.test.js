/**
 * stockISteps.test.js — LC 121「买卖股票的最佳时机 I」状态机单测。
 *
 * 交叉验证：状态机（minPrice/best 一维扫描）vs 独立参考解（暴力双循环枚举
 * 所有 (买, 卖) 对 —— 实现路径完全不同）。
 * 逐帧钉死：回放一致、candidate = price - prevMin（先卖后更新的直接证据）、
 * 两条转移方程、best 单调不减、minPrice 单调不增、both 不可能、done 答案。
 */
import { describe, it, expect } from 'vitest'
import { buildStockISteps } from '../stockISteps.js'

const DEFAULT_PRICES = [7, 1, 5, 3, 6, 4]

// 独立参考解：暴力双循环（先买后卖，允许一次都不买 → 下限 0）
const brute121 = (ps) => {
  let m = 0
  for (let i = 0; i < ps.length; i += 1) {
    for (let j = i + 1; j < ps.length; j += 1) {
      m = Math.max(m, ps[j] - ps[i])
    }
  }
  return m
}

const CASES = [
  {}, // 默认 [7,1,5,3,6,4] → 5
  { prices: [7, 6, 4, 3, 1] }, // 全程下跌 → 0（不买）
  { prices: [1, 2] }, // 最小上坡
  { prices: [2, 1] }, // 最小下跌
  { prices: [5] }, // 单元素：没得卖 → 0
  { prices: [1, 2, 3, 4, 5] }, // 单调上坡 → 连续持有 = 4
  { prices: [5, 4, 3, 2, 1] }, // 单调下跌
  { prices: [2, 4, 1] }, // 先赚后破底
  { prices: [3, 1, 4, 1, 5, 9, 2, 6] }, // 起伏
  { prices: [100000, 1, 99999] }, // 大数差
  { prices: [0, 0, 0] }, // 全平
  { prices: [-5, -1, -3] }, // 负价格（数学上合法）
]

const optsOf = (c) => (c.prices ? c : { prices: DEFAULT_PRICES })

describe('stockISteps（LC 121）', () => {
  it.each(CASES)('最终结果与暴力双循环一致：%j', (c) => {
    const steps = buildStockISteps(optsOf(c))
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    expect(done.result).toBe(brute121(steps[0].prices))
  })

  it.each(CASES)('逐帧不变量：%j', (c) => {
    const steps = buildStockISteps(optsOf(c))
    const { prices } = steps[0]
    for (let i = 1; i < steps.length; i += 1) {
      const f = steps[i]
      const p = steps[i - 1]
      // 回放一致：本帧动作前的两变量 === 上一帧动作后的两变量
      expect(f.prevMin).toBe(p.minPrice)
      expect(f.prevBest).toBe(p.best)
      if (f.phase === 'scan') {
        expect(f.day).toBe(i) // scan 帧号 === 交易日（init 占 0）
        expect(f.price).toBe(prices[f.day])
        expect(f.prevPrice).toBe(prices[f.day - 1])
        // candidate 用**更新前**的 minPrice —— 先卖后更新
        expect(f.candidate).toBe(f.price - f.prevMin)
        // 两条转移方程
        expect(f.best).toBe(Math.max(f.prevBest, f.candidate))
        expect(f.minPrice).toBe(Math.min(f.prevMin, f.price))
        // 单调性
        expect(f.best).toBeGreaterThanOrEqual(p.best)
        expect(f.minPrice).toBeLessThanOrEqual(p.minPrice)
        // updated 合法且与两变化位一致
        expect(['best', 'minPrice', 'none']).toContain(f.updated)
        const bUp = f.best > f.prevBest
        const mDown = f.minPrice < f.prevMin
        expect(bUp && mDown).toBe(false) // both 逻辑上不可能
        expect(f.updated === 'best').toBe(bUp)
        expect(f.updated === 'minPrice').toBe(!bUp && mDown)
        expect(f.updated === 'none').toBe(!bUp && !mDown)
      } else {
        expect(f.phase).toBe('done')
        expect(f.result).toBe(f.best)
        expect(f.best).toBe(p.best)
        expect(f.minPrice).toBe(p.minPrice)
      }
    }
  })

  it('默认序列：7 帧（init + 5 路过 + done），答案 5', () => {
    const steps = buildStockISteps()
    expect(steps).toHaveLength(7)
    expect(steps.map((f) => f.phase)).toEqual([
      'init', 'scan', 'scan', 'scan', 'scan', 'scan', 'done',
    ])
    expect(steps.at(-1).result).toBe(5)
    // updated 序列钉死：下台阶 / 刷新 / 路过 / 刷新 / 路过
    expect(steps.map((f) => f.updated)).toEqual([
      null, 'minPrice', 'best', 'none', 'best', 'none', null,
    ])
    // candidate 逐帧钉死
    expect(steps.slice(1, 6).map((f) => f.candidate)).toEqual([-6, 4, 2, 5, 3])
    // minPrice 下台阶：7 → 1 后不再动
    expect(steps.map((f) => f.minPrice)).toEqual([7, 1, 1, 1, 1, 1, 1])
  })

  it('单元素：init + done 两帧，答案 0', () => {
    const steps = buildStockISteps({ prices: [9] })
    expect(steps).toHaveLength(2)
    expect(steps[0].phase).toBe('init')
    expect(steps[1].phase).toBe('done')
    expect(steps[1].result).toBe(0)
  })

  it('全程下跌：candidate 恒负，best 停在 0（不买）', () => {
    const steps = buildStockISteps({ prices: [5, 4, 3, 2] })
    const scans = steps.filter((f) => f.phase === 'scan')
    for (const f of scans) expect(f.candidate).toBeLessThan(0)
    expect(steps.at(-1).result).toBe(0)
    expect(scans.every((f) => f.updated === 'minPrice')).toBe(true)
  })

  it('随机交叉：500 组 vs 暴力双循环', () => {
    let rng = 987654321
    const rand = (n) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % n
    }
    for (let t = 0; t < 500; t += 1) {
      const prices = Array.from({ length: 1 + rand(12) }, () => rand(50) - 5)
      const steps = buildStockISteps({ prices })
      expect(steps.at(-1).result).toBe(brute121(prices))
      // 逐帧转移方程复查
      for (let i = 1; i < steps.length; i += 1) {
        const f = steps[i]
        if (f.phase !== 'scan') continue
        expect(f.candidate).toBe(f.price - f.prevMin)
        expect(f.best).toBe(Math.max(f.prevBest, f.candidate))
        expect(f.minPrice).toBe(Math.min(f.prevMin, f.price))
      }
    }
  })

  it('非法输入回退默认：空数组 / null', () => {
    const empty = buildStockISteps({ prices: [] })
    expect(empty[0].prices).toEqual(DEFAULT_PRICES)
    const nul = buildStockISteps({ prices: null })
    expect(nul[0].prices).toEqual(DEFAULT_PRICES)
  })

  it('所有帧共享同一份 prices，且是拷贝', () => {
    const input = [1, 2, 3]
    const steps = buildStockISteps({ prices: input })
    input.push(99)
    for (const f of steps) expect(f.prices).toEqual([1, 2, 3])
  })

  it('desc 非空且含关键数值', () => {
    const steps = buildStockISteps()
    const hit = steps.find((f) => f.updated === 'best')
    expect(hit.desc).toContain('5')
    expect(hit.desc).toContain('4')
    const done = steps.at(-1)
    expect(done.desc).toContain('5')
  })
})
