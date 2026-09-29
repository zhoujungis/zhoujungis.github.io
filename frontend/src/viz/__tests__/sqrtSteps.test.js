/**
 * sqrtSteps.test.js — LC 69「x 的平方根」二分解状态机单测。
 *
 * 交叉验证：状态机（边界二分）vs 独立参考解 Math.floor(Math.sqrt(x))，
 * 覆盖 0..100 全量 + 大数（含 2147395599 这类 int 溢出陷阱值）。
 * 逐帧钉死：回放一致、mid 公式、record_right/go_left 只动一边、
 * ans 单调不减、P(ans) 恒真、真解恒在 [ans, hi+1]、done 交叉、探测上界。
 */
import { describe, it, expect } from 'vitest'
import { buildSqrtSteps } from '../sqrtSteps.js'

const XS = [
  null, // 默认 x=8 → 2
  0, 1, 2, 3, 4, 8, 9, 15, 16, 17, 24, 25, 26,
  99, 100, 101, 2147395599, 2147483647, 1000000000,
]

describe('sqrtSteps（LC 69）', () => {
  it.each(XS)('最终结果与 Math.floor(sqrt) 一致：x=%s', (x) => {
    const steps = buildSqrtSteps(x == null ? {} : { x })
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    expect(done.ans).toBe(Math.floor(Math.sqrt(x ?? 8)))
  })

  it.each(XS)('逐帧不变量：x=%s', (x) => {
    const e = x ?? 8
    const steps = buildSqrtSteps({ x: e })
    const ref = Math.floor(Math.sqrt(e))
    expect(steps[0].lo).toBe(0)
    expect(steps[0].hi).toBe(e)
    expect(steps[0].ans).toBe(0)
    for (let i = 1; i < steps.length; i += 1) {
      const f = steps[i]
      const p = steps[i - 1]
      // 回放一致
      expect(f.prevLo).toBe(p.lo)
      expect(f.prevHi).toBe(p.hi)
      expect(f.prevAns).toBe(p.ans)
      if (f.phase === 'probe') {
        expect(f.mid).toBe(f.prevLo + ((f.prevHi - f.prevLo) >> 1))
        expect(f.mid).toBeGreaterThanOrEqual(f.prevLo)
        expect(f.mid).toBeLessThanOrEqual(f.prevHi)
        expect(f.sq).toBe(f.mid * f.mid)
        expect(f.le).toBe(f.sq <= e)
        if (f.action === 'record_right') {
          expect(f.le).toBe(true)
          expect(f.ans).toBe(f.mid) // 记候选
          expect(f.lo).toBe(f.mid + 1) // 只动左边界，继续向右
          expect(f.hi).toBe(f.prevHi)
        } else if (f.action === 'go_left') {
          expect(f.le).toBe(false)
          expect(f.ans).toBe(f.prevAns) // 候选不动
          expect(f.hi).toBe(f.mid - 1) // 只动右边界
          expect(f.lo).toBe(f.prevLo)
          expect(ref).toBeLessThan(f.mid) // 真解被压向左
        } else {
          throw new Error(`非法 action: ${f.action}`)
        }
        expect(f.ans).toBeGreaterThanOrEqual(p.ans) // ans 单调不减
        expect(f.ans * f.ans).toBeLessThanOrEqual(e) // P(ans) 恒真
        expect(f.ans).toBeLessThanOrEqual(ref) // 记下的都 ≤ 真解
        expect(ref).toBeLessThanOrEqual(f.hi + 1) // 真解不丢
      } else {
        expect(f.phase).toBe('done')
        expect(f.lo).toBe(f.hi + 1) // 闭区间为空的精确条件
        expect(f.ans).toBe(f.hi) // 区间空时，hi 恰是最后一个真（ans == hi == lo-1）
      }
    }
  })

  it.each(XS)('答案的双边校验 k²<=x<(k+1)²：x=%s', (x) => {
    const e = x ?? 8
    const a = buildSqrtSteps({ x: e }).at(-1).ans
    expect(a * a).toBeLessThanOrEqual(e)
    expect((a + 1) * (a + 1)).toBeGreaterThan(e)
  })

  it.each(XS)('探测次数不超 log₂(x+1)+1：x=%s', (x) => {
    const e = x ?? 8
    const steps = buildSqrtSteps({ x: e })
    const probes = steps.filter((f) => f.phase === 'probe').length
    expect(probes).toBeLessThanOrEqual(Math.floor(Math.log2(e + 1)) + 1)
  })

  it('默认 x=8：6 帧（init + 4 探 + done），答案 2', () => {
    const steps = buildSqrtSteps()
    expect(steps).toHaveLength(6)
    expect(steps.at(-1).ans).toBe(2)
    expect(steps.map((f) => f.action)).toEqual([
      null, 'go_left', 'record_right', 'record_right', 'go_left', null,
    ])
    expect(steps.map((f) => f.mid)).toEqual([null, 4, 1, 2, 3, null])
    expect(steps.map((f) => f.ans)).toEqual([0, 0, 1, 2, 2, 2])
  })

  it('完全平方数：最后一次 record 恰好落在 √x 上', () => {
    const steps = buildSqrtSteps({ x: 16 })
    const records = steps.filter((f) => f.action === 'record_right')
    expect(records.at(-1).mid).toBe(4)
    expect(steps.at(-1).ans).toBe(4)
  })

  it('x=0 与 x=1 的最小退化', () => {
    expect(buildSqrtSteps({ x: 0 }).at(-1).ans).toBe(0)
    expect(buildSqrtSteps({ x: 1 }).at(-1).ans).toBe(1)
  })

  it('溢出陷阱值：2147395599 的 mid² 在 JS 里不溢出（46340² 陷阱被避开）', () => {
    const steps = buildSqrtSteps({ x: 2147395599 })
    expect(steps.at(-1).ans).toBe(46339)
    // 46340² = 2147395600 = x + 1 —— 恰好压线，Java int 会在这里翻车
    expect(46340 * 46340).toBe(2147395600)
  })

  it('非法输入回退默认 x=8', () => {
    for (const bad of [-5, 1.5, NaN, '8']) {
      expect(buildSqrtSteps({ x: bad }).at(-1).ans).toBe(2)
    }
  })

  it('desc 非空且含关键数值', () => {
    const steps = buildSqrtSteps({ x: 8 })
    const rec = steps.find((f) => f.action === 'record_right')
    expect(rec.desc).toContain('1')
    expect(rec.desc).toContain('<=')
    const done = steps.at(-1)
    expect(done.desc).toContain('2')
    expect(done.desc).toContain('9')
  })
})
