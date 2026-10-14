/**
 * kmpSteps.test.js — 「KMP 求 next 数组」主状态机单测。
 *
 * 交叉验证：状态机 vs 独立的 O(n^2) 参考解（对每个 i 暴力枚举最长相等真前后缀）。
 * 逐帧钉死：回放一致、compare/retreat/assign 三类帧的自洽，knownCount 单调。
 */
import { describe, it, expect } from 'vitest'
import { buildKmpSteps, KMP_DEFAULT_P } from '../kmpSteps.js'

/** 独立参考解：对每个 i 暴力枚举最长相等真前后缀（真 = 长度严格小于 i+1）。 */
function refNext(p) {
  const n = p.length
  const next = new Array(n).fill(0)
  for (let i = 0; i < n; i += 1) {
    let best = 0
    for (let len = 1; len <= i; len += 1) {
      let ok = true
      for (let k = 0; k < len; k += 1) {
        if (p[k] !== p[i - len + 1 + k]) {
          ok = false
          break
        }
      }
      if (ok) best = len
    }
    next[i] = best
  }
  return next
}

describe('kmpSteps（KMP 求 next）', () => {
  it('默认 p = "abacaba"：16 帧、next = [0,0,1,0,1,2,3]、比较 7 次、回退 1 次', () => {
    const steps = buildKmpSteps()
    expect(steps).toHaveLength(16)
    expect(steps[0].p).toBe(KMP_DEFAULT_P)
    expect(steps[0].n).toBe(7)
    expect(steps[0].phase).toBe('init')
    expect(steps.at(-1).phase).toBe('done')
    expect(steps.at(-1).next).toEqual([0, 0, 1, 0, 1, 2, 3])
    expect(steps.at(-1).next).toEqual(refNext(KMP_DEFAULT_P))
    expect(steps.at(-1).comparisons).toBe(7)
    expect(steps.at(-1).retreats).toBe(1)
    expect(steps.at(-1).knownCount).toBe(7)
    const seq = steps.map((f) => f.phase)
    expect(seq).toEqual([
      'init',
      'compare', 'assign', // i1
      'compare', 'assign', // i2
      'compare', 'retreat', 'compare', 'assign', // i3
      'compare', 'assign', // i4
      'compare', 'assign', // i5
      'compare', 'assign', // i6
      'done',
    ])
  })

  it('逐帧不变量', () => {
    const steps = buildKmpSteps()
    const { p, n } = steps[0]

    // 1. 回放一致
    expect(steps[0].prevNext).toEqual(steps[0].next)
    for (let k = 1; k < steps.length; k += 1) {
      expect(steps[k].prevNext).toEqual(steps[k - 1].next)
    }
    expect(steps.at(-1).prevNext).toEqual(steps.at(-1).next)

    let prevComparisons = 0
    let prevRetreats = 0
    let prevKnown = 1
    for (let k = 1; k < steps.length; k += 1) {
      const f = steps[k]
      const g = steps[k - 1]
      // 计数器单调 + 每帧增量
      expect(f.comparisons).toBeGreaterThanOrEqual(prevComparisons)
      expect(f.retreats).toBeGreaterThanOrEqual(prevRetreats)

      if (f.phase === 'compare') {
        // 2. compare 帧：j 不动、next 不变、match 自洽、比较数 +1
        expect(f.jAfter).toBe(f.jBefore)
        expect(f.next).toEqual(f.prevNext)
        expect(f.match).toBe(p[f.i] === p[f.jBefore])
        expect(f.comparisons).toBe(prevComparisons + 1)
        expect(f.retreats).toBe(prevRetreats)
      } else if (f.phase === 'retreat') {
        // 3. retreat 帧：j 后退、源与目标自洽、retreats +1、紧跟在失败 compare 后
        expect(f.jBefore).toBeGreaterThan(0)
        expect(f.jAfter).toBe(f.prevNext[f.jBefore - 1])
        expect(f.jAfter).toBeLessThan(f.jBefore)
        expect(f.next).toEqual(f.prevNext)
        expect(f.retreats).toBe(prevRetreats + 1)
        expect(f.comparisons).toBe(prevComparisons)
        expect(g.phase).toBe('compare')
        expect(g.match).toBe(false)
        expect(g.i).toBe(f.i)
      } else if (f.phase === 'assign') {
        // 4. assign 帧：next[i] = jAfter、j 增量 ∈ {0,1} 且差 1 ⇔ match、其余项不变
        expect(f.next[f.i]).toBe(f.jAfter)
        const delta = f.jAfter - f.jBefore
        expect([0, 1]).toContain(delta)
        expect(delta === 1).toBe(f.match)
        expect(f.knownCount).toBe(f.i + 1)
        for (let t = 0; t < n; t += 1) {
          if (t !== f.i) expect(f.next[t]).toBe(f.prevNext[t])
        }
      }

      expect(f.knownCount).toBeGreaterThanOrEqual(prevKnown)
      prevComparisons = f.comparisons
      prevRetreats = f.retreats
      prevKnown = f.knownCount
    }
    expect(prevComparisons).toBe(steps.at(-1).comparisons)
    expect(prevKnown).toBe(n)
  })

  it('随机交叉：600 条串 vs 直接枚举参考解', () => {
    let rng = 20261014
    const rand = (m) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % m
    }
    const alpha = 'abc'
    for (let k = 0; k < 600; k += 1) {
      const len = 1 + rand(12)
      let s = ''
      for (let t = 0; t < len; t += 1) s += alpha[rand(alpha.length)]
      const steps = buildKmpSteps({ p: s })
      const done = steps.at(-1)
      expect(done.next).toEqual(refNext(s))
      expect(done.n).toBe(s.length)
      // 每个已定项的 knownCount 与实际相符
      expect(done.knownCount).toBe(s.length)
    }
  })

  it('非法入参回退默认串', () => {
    expect(buildKmpSteps({ p: '' }).at(-1).p).toBe(KMP_DEFAULT_P)
    expect(buildKmpSteps({ p: 123 }).at(-1).p).toBe(KMP_DEFAULT_P)
    expect(buildKmpSteps({}).at(-1).next).toEqual([0, 0, 1, 0, 1, 2, 3])
  })

  it('单串 "aaaa"：全回退式前进，next = [0,1,2,3]', () => {
    const steps = buildKmpSteps({ p: 'aaaa' })
    expect(steps.at(-1).next).toEqual(refNext('aaaa'))
    expect(steps.at(-1).next).toEqual([0, 1, 2, 3])
    expect(steps.at(-1).retreats).toBe(0)
  })
})
