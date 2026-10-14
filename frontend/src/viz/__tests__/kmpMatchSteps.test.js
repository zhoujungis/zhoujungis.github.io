/**
 * kmpMatchSteps.test.js — 「KMP 匹配（含暴力对照）」状态机单测。
 *
 * 交叉验证：状态机 vs 独立参考解（暴力 O(n*m) 匹配 + O(n^2) 前缀函数）。
 * 逐帧钉死：i 永不回退、回退帧紧跟失败 compare、found 帧自洽、计数器单调。
 */
import { describe, it, expect } from 'vitest'
import {
  buildKmpMatchSteps,
  prefixFunction,
  KMP_MATCH_DEFAULT_TEXT,
  KMP_MATCH_DEFAULT_P,
} from '../kmpMatchSteps.js'

/** 独立参考解：暴力匹配，返回首次出现的起点或 -1。 */
function refMatch(text, p) {
  const m = text.length
  const n = p.length
  for (let s = 0; s + n <= m; s += 1) {
    let k = 0
    while (k < n && text[s + k] === p[k]) k += 1
    if (k === n) return s
  }
  return -1
}

/** 独立参考解：O(n^2) 前缀函数。 */
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

describe('kmpMatchSteps（KMP 匹配）', () => {
  it('默认 text="abababacaba"、p="abacaba"：18 帧、命中 index=4、KMP 13 次 vs 暴力 17 次', () => {
    const steps = buildKmpMatchSteps()
    expect(steps).toHaveLength(18)
    expect(steps[0].text).toBe(KMP_MATCH_DEFAULT_TEXT)
    expect(steps[0].p).toBe(KMP_MATCH_DEFAULT_P)
    expect(steps[0].next).toEqual([0, 0, 1, 0, 1, 2, 3])
    expect(steps[0].next).toEqual(refNext(KMP_MATCH_DEFAULT_P))
    expect(steps.map((f) => f.phase).filter((x) => x === 'compare')).toHaveLength(13)
    expect(steps.map((f) => f.phase).filter((x) => x === 'retreat')).toHaveLength(2)
    expect(steps.map((f) => f.phase).filter((x) => x === 'found')).toHaveLength(1)
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    expect(done.found).toBe(true)
    expect(done.index).toBe(4)
    expect(done.index).toBe(refMatch(KMP_MATCH_DEFAULT_TEXT, KMP_MATCH_DEFAULT_P))
    expect(done.kmpComparisons).toBe(13)
    expect(done.bruteComparisons).toBe(17)
    expect(KMP_MATCH_DEFAULT_TEXT.slice(4, 4 + KMP_MATCH_DEFAULT_P.length)).toBe(KMP_MATCH_DEFAULT_P)
  })

  it('逐帧不变量', () => {
    const steps = buildKmpMatchSteps()
    const { text, p, n } = steps[0]

    let prevComparisons = 0
    let prevRetreats = 0
    let prevI = -1
    for (let k = 1; k < steps.length; k += 1) {
      const f = steps[k]
      const g = steps[k - 1]

      if (f.phase === 'compare') {
        const match = text[f.i] === p[f.jBefore]
        expect(f.match).toBe(match)
        const delta = f.jAfter - f.jBefore
        expect([0, 1]).toContain(delta)
        expect(delta === 1).toBe(match)
        expect(f.matched).toBe(f.jAfter)
        expect(f.kmpComparisons).toBe(prevComparisons + 1)
        // i 永不回退
        if (prevI >= 0) expect(f.i).toBeGreaterThanOrEqual(prevI)
      } else if (f.phase === 'retreat') {
        expect(f.jBefore).toBeGreaterThan(0)
        expect(f.jAfter).toBe(f.next[f.jBefore - 1])
        expect(f.jAfter).toBeLessThan(f.jBefore)
        expect(f.match).toBe(false)
        expect(f.kmpComparisons).toBe(prevComparisons)
        expect(f.i).toBe(g.i)
        expect(g.phase).toBe('compare')
        expect(g.match).toBe(false)
      } else if (f.phase === 'found') {
        expect(f.jAfter).toBe(n)
        expect(f.index).toBe(f.i - n + 1)
        expect(text.slice(f.index, f.index + n)).toBe(p)
      } else if (f.phase === 'done') {
        if (f.found) expect(f.index).toBeGreaterThanOrEqual(0)
        else expect(f.index).toBe(-1)
      }

      expect(f.kmpComparisons).toBeGreaterThanOrEqual(prevComparisons)
      expect(f.bruteComparisons).toBe(steps[0].bruteComparisons) // 常量参照
      prevComparisons = f.kmpComparisons
      prevRetreats = f.retreats ?? prevRetreats
      if (f.i >= 0) prevI = f.i
    }
    expect(steps.at(-1).kmpComparisons).toBeLessThanOrEqual(steps[0].bruteComparisons)
    expect(prevComparisons).toBe(steps.at(-1).kmpComparisons)
    void prevRetreats
  })

  it('随机交叉：600 组 vs 暴力匹配 + 前缀函数参考解', () => {
    let rng = 20261014
    const rand = (m) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % m
    }
    const alpha = 'ab'
    for (let k = 0; k < 600; k += 1) {
      const plen = 1 + rand(5)
      let p = ''
      for (let t = 0; t < plen; t += 1) p += alpha[rand(alpha.length)]
      const tlen = plen + rand(10)
      let text = ''
      for (let t = 0; t < tlen; t += 1) text += alpha[rand(alpha.length)]
      const steps = buildKmpMatchSteps({ text, p })
      const done = steps.at(-1)
      expect(done.index).toBe(refMatch(text, p))
      expect(steps[0].next).toEqual(refNext(p))
      expect(prefixFunction(p)).toEqual(refNext(p))
      expect(done.found).toBe(done.index >= 0)
      // 顺带扫一遍内容不变量
      for (const f of steps) {
        expect(f.bruteComparisons).toBe(steps[0].bruteComparisons)
        if (f.phase === 'compare') {
          expect(f.match).toBe(text[f.i] === p[f.jBefore])
        }
      }
    }
  })

  it('未命中：index = -1', () => {
    const steps = buildKmpMatchSteps({ text: 'ababab', p: 'abaab' })
    const done = steps.at(-1)
    expect(done.found).toBe(false)
    expect(done.index).toBe(-1)
    expect(refMatch('ababab', 'abaab')).toBe(-1)
  })

  it('非法入参回退默认串', () => {
    const done = buildKmpMatchSteps({ text: '', p: '' }).at(-1)
    expect(done.text).toBe(KMP_MATCH_DEFAULT_TEXT)
    expect(done.index).toBe(4)
  })
})
