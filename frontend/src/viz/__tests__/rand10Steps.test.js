/**
 * rand10Steps.test.js — LC 470「拒绝采样」状态机单测。
 *
 * 交叉验证：状态机 vs 独立参考实现（直接按算法模拟 rolls 脚本）。
 * 逐帧钉死：accept/reject 判据、输出映射、调用计数。
 * 结构验证：49 状态里每个输出的前像数恰好 4。
 * 统计验证：固定种子 LCG 造 rand7，跑 5 万次 rand10 —— 频数均匀、均值 ≈ 2.45。
 */
import { describe, it, expect } from 'vitest'
import { buildRand10Steps, RAND10_DEFAULT_ROLLS } from '../rand10Steps.js'

/** 参考实现：直接按算法跑同一串 rolls。 */
const refRun = (from, to, rolls) => {
  const size = from * from
  const acceptLimit = Math.floor(size / to) * to
  const outputs = []
  let rejects = 0
  for (let i = 0; i + 1 < rolls.length; i += 2) {
    const value = (rolls[i] - 1) * from + rolls[i + 1]
    if (value <= acceptLimit) outputs.push(((value - 1) % to) + 1)
    else rejects += 1
  }
  return { outputs, rejects }
}

describe('rand10Steps（LC 470 拒绝采样）', () => {
  it('默认脚本：14 帧、1 次拒绝、输出 [8,3,2,6,10]、E=2.45', () => {
    const steps = buildRand10Steps()
    expect(steps).toHaveLength(14)
    expect(steps[0].phase).toBe('init')
    expect(steps.at(-1).phase).toBe('done')
    expect(steps.at(-1).outputs).toEqual([8, 3, 2, 6, 10])
    expect(steps.at(-1).rejects).toBe(1)
    expect(steps.at(-1).calls).toBe(12)
    expect(steps.at(-1).expect).toBeCloseTo(2.45, 5)
    expect(refRun(7, 10, RAND10_DEFAULT_ROLLS)).toEqual({ outputs: [8, 3, 2, 6, 10], rejects: 1 })
  })

  it('accept 帧：v ≤ 40 且 output === (v-1) % to + 1；reject 帧：v > 40', () => {
    const steps = buildRand10Steps()
    let calls = 0
    let attempts = 0
    for (const f of steps) {
      if (f.phase === 'roll') {
        attempts += 1
        calls += 2
        expect(f.cellValue).toBe((f.a - 1) * f.from + f.b)
        expect(f.cellValue).toBeGreaterThanOrEqual(1)
        expect(f.cellValue).toBeLessThanOrEqual(f.size)
      }
      if (f.phase === 'accept') {
        expect(f.cellValue).toBeLessThanOrEqual(f.acceptLimit)
        expect(f.output).toBe(((f.cellValue - 1) % f.to) + 1)
        expect(f.output).toBeGreaterThanOrEqual(1)
        expect(f.output).toBeLessThanOrEqual(f.to)
        expect(f.outputs.at(-1)).toBe(f.output)
      }
      if (f.phase === 'reject') {
        expect(f.cellValue).toBeGreaterThan(f.acceptLimit)
        expect(f.output).toBeNull()
      }
      expect(f.calls).toBe(calls)
      expect(f.attempts).toBe(attempts)
    }
    const accepts = steps.filter((f) => f.phase === 'accept').length
    const rejects = steps.filter((f) => f.phase === 'reject').length
    expect(attempts).toBe(accepts + rejects)
  })

  it('结构：49 个状态里每个输出恰好 4 个前像、拒绝 9 格', () => {
    const from = 7
    const to = 10
    const size = from * from
    const acceptLimit = 40
    const preimage = new Array(to).fill(0)
    let rejects = 0
    for (let v = 1; v <= size; v += 1) {
      if (v <= acceptLimit) preimage[((v - 1) % to) + 1 - 1] += 1
      else rejects += 1
    }
    expect(preimage).toEqual(new Array(to).fill(4))
    expect(rejects).toBe(9)
    // 与状态机帧字段一致
    const steps = buildRand10Steps()
    expect(steps[0].acceptLimit).toBe(acceptLimit)
    expect(steps[0].perOutput).toBe(4)
  })

  it('百度变体（1..5 → 1..7）：21 = 3 × 7、E = 50/21 ≈ 2.381', () => {
    const steps = buildRand10Steps({
      from: 5,
      to: 7,
      rolls: [4, 5, 5, 4, 1, 1, 2, 3],
    })
    const done = steps.at(-1)
    // [4,5] → (3)*5+5 = 20 ≤ 21 → 输出 (20-1)%7+1 = 6
    // [5,4] → (4)*5+4 = 24 > 21 → 拒绝
    // [1,1] → 1 → 输出 1
    // [2,3] → (1)*5+3 = 8 → 输出 (8-1)%7+1 = 1
    expect(done.outputs).toEqual([6, 1, 1])
    expect(done.rejects).toBe(1)
    expect(done.acceptLimit).toBe(21)
    expect(done.perOutput).toBe(3)
    expect(done.expect).toBeCloseTo(50 / 21, 5)
  })

  it('统计验证：固定种子 5 万次输出 —— 频数均匀、调用均值 ≈ 2.45', () => {
    // mulberry32：低位质量足够好（LCG 直接 % 7 会因低位相关性造成可见偏斜）
    let seed = 470
    const mulberry32 = () => {
      seed = (seed + 0x6d2b79f5) | 0
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
    const rand7 = () => Math.floor(mulberry32() * 7) + 1
    const counts = new Array(10).fill(0)
    let calls = 0
    const N = 50000
    for (let i = 0; i < N; i += 1) {
      let out = null
      while (out === null) {
        const v = (rand7() - 1) * 7 + rand7()
        calls += 2
        if (v <= 40) out = ((v - 1) % 10) + 1
      }
      counts[out - 1] += 1
    }
    // 每个输出期望 5000 次；固定种子下是确定值，给 ±6% 的宽松界
    for (const c of counts) {
      expect(c).toBeGreaterThan(4700)
      expect(c).toBeLessThan(5300)
    }
    // 理论期望 2.45；实测均值应在 [2.3, 2.6]
    const avg = calls / N
    expect(avg).toBeGreaterThan(2.3)
    expect(avg).toBeLessThan(2.6)
  })

  it('非法输入回退默认', () => {
    const steps = buildRand10Steps({ from: 1, to: 999, rolls: [1] })
    expect(steps[0].from).toBe(7)
    expect(steps[0].to).toBe(10)
    expect(steps.at(-1).outputs.length).toBeGreaterThan(0)
  })
})
