import { describe, expect, it } from 'vitest'

import { buildVarPartSteps, segStats, prefix } from '../varPartSteps.js'

/** 独立参考：暴力 O(n^2) 算段方差（不用前缀和），用来核对 O(1) 公式。 */
function varBrute(a) {
  if (a.length === 0) return 0
  const mean = a.reduce((x, y) => x + y, 0) / a.length
  return a.reduce((s, v) => s + (v - mean) * (v - mean), 0) / a.length
}

const DEFAULT_SEQ = [2, 8, 3, 9, 4, 7]

describe('方差切分 · 主例', () => {
  it('最优切点 2，两段方差和 14.6875（脚本核实过）', () => {
    const s = buildVarPartSteps({})
    const last = s[s.length - 1]
    expect(last.bestI).toBe(2)
    expect(last.best).toBeCloseTo(14.6875, 6)
    expect(last.answer).toBeCloseTo(14.6875, 6)
  })

  it('切点 1/2/3/4/5 的合计值与暴力法一致', () => {
    const s = buildVarPartSteps({})
    const scans = s.filter((f) => f.phase === 'scan')
    expect(scans.map((f) => f.i)).toEqual([1, 2, 3, 4, 5])
    const want = [5.36, 14.6875, 11.11111111111111, 11.5, 7.76]
    scans.forEach((f, k) => {
      expect(f.total).toBeCloseTo(want[k], 4)
      expect(f.total).toBeCloseTo(varBrute(DEFAULT_SEQ.slice(0, f.i)) + varBrute(DEFAULT_SEQ.slice(f.i)), 6)
    })
  })

  it('切成两段比不切更大（本题的反直觉点）', () => {
    const whole = varBrute(DEFAULT_SEQ)
    expect(whole).toBeCloseTo(6.9166666, 5)
    const last = buildVarPartSteps({}).at(-1)
    expect(last.best).toBeGreaterThan(whole)
  })

  it('帧数 = init + (n-1) 个 scan + done', () => {
    expect(buildVarPartSteps({}).length).toBe(1 + 5 + 1)
    expect(buildVarPartSteps({ seq: [1, 2, 3, 4] }).length).toBe(1 + 3 + 1)
  })
})

describe('方差切分 · 前缀和公式', () => {
  it('segStats 与暴力法在随机序列的所有区间上一致', () => {
    const seq = [3, -1, 4, 1, 5, 9, 2, 6, 5, 3]
    const pre = prefix(seq)
    for (let l = 0; l < seq.length; l += 1) {
      for (let r = l + 1; r <= seq.length; r += 1) {
        const got = segStats(seq, pre, l, r)
        const brute = varBrute(seq.slice(l, r))
        expect(got.len).toBe(r - l)
        expect(got.var, `[${l},${r})`).toBeCloseTo(brute, 9)
        expect(got.mean).toBeCloseTo(seq.slice(l, r).reduce((a, b) => a + b, 0) / (r - l), 9)
      }
    }
  })

  it('负数序列也成立（平方和公式不假设非负）', () => {
    const seq = [-5, 5, -3, 3]
    const pre = prefix(seq)
    for (let i = 1; i < seq.length; i += 1) {
      const f = buildVarPartSteps({ seq }).filter((x) => x.phase === 'scan' && x.i === i)[0]
      expect(f.total).toBeCloseTo(varBrute(seq.slice(0, i)) + varBrute(seq.slice(i)), 9)
    }
  })

  it('单点段方差为 0；全相等序列任何切法合计都是 0', () => {
    const s = buildVarPartSteps({ seq: [7, 7, 7, 7] })
    for (const f of s.filter((x) => x.phase === 'scan')) {
      expect(f.total).toBe(0)
    }
    expect(s.at(-1).best).toBe(0)
  })

  it('best/bestI 逐帧单调不减（扫描过程中只更新更好解）', () => {
    const s = buildVarPartSteps({})
    let prev = -Infinity
    let prevI = -1
    for (const f of s) {
      if (f.phase === 'init') continue
      expect(f.best).toBeGreaterThanOrEqual(prev - 1e-12)
      if (f.best > prev + 1e-12) {
        expect(f.bestI).not.toBe(prevI)
      }
      prev = f.best
      prevI = f.bestI
    }
  })

  it('输入校验：长度 < 2 或含非有限值回落默认', () => {
    expect(buildVarPartSteps({ seq: [1] })[0].seq).toEqual(DEFAULT_SEQ)
    expect(buildVarPartSteps({ seq: [1, 2, 'x'] })[0].seq).toEqual(DEFAULT_SEQ)
    expect(buildVarPartSteps({})[0].seq).toEqual(DEFAULT_SEQ)
  })
})
