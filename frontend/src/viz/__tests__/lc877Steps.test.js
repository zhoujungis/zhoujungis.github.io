import { describe, expect, it } from 'vitest'

import { buildLc877Steps } from '../lc877Steps.js'

/** 独立参考：偶数堆时 Alex 必拿 max(奇位和, 偶位和)，Lee 拿剩下的。 */
function paritySums(piles) {
  let even = 0
  let odd = 0
  piles.forEach((v, i) => {
    if (i % 2 === 0) even += v
    else odd += v
  })
  return { even, odd }
}

describe('LC 877 · 主例与结论', () => {
  it('[5,3,4,5]：Alex 9 : 8 Lee，先手必胜', () => {
    const s = buildLc877Steps({})
    const last = s[s.length - 1]
    expect(last.answer).toBe(true)
    expect(last.alex).toBe(9)
    expect(last.lee).toBe(8)
    expect(last.moves.length).toBe(4)
  })

  it('帧数 = init + parity + n 个 take + done', () => {
    expect(buildLc877Steps({}).length).toBe(2 + 4 + 1)
    expect(buildLc877Steps({ piles: [1, 5, 2] }).length).toBe(2 + 3 + 1)
  })

  it('Alex 拿到的就是较大的那个奇偶和', () => {
    for (const piles of [
      [5, 3, 4, 5],
      [1, 5, 2],
      [3, 7, 2, 1, 8, 4],
      [10, 1, 1, 10],
    ]) {
      const s = buildLc877Steps({ piles })
      const last = s[s.length - 1]
      const { even, odd } = paritySums(piles)
      if (piles.length % 2 === 0) {
        expect(last.alex, JSON.stringify(piles)).toBe(Math.max(even, odd))
        expect(last.lee).toBe(Math.min(even, odd))
      }
      expect(last.alex + last.lee).toBe(piles.reduce((a, b) => a + b, 0))
    }
  })
})

describe('LC 877 · 对局合法性', () => {
  it('每一步都从当前头部或尾部取，且每堆只被取一次', () => {
    const s = buildLc877Steps({})
    const moves = s[s.length - 1].moves
    const remaining = new Set(moves.map((_, i) => i))
    expect(remaining.size).toBe(4)
    for (const m of moves) {
      const lo = Math.min(...remaining)
      const hi = Math.max(...remaining)
      // 没被取走的堆是一段连续区间，两端就是当前唯一可取的堆
      expect(m.idx === lo || m.idx === hi, JSON.stringify(m)).toBe(true)
      remaining.delete(m.idx)
    }
    expect(remaining.size).toBe(0)
  })

  it('Alex 取的全是他锁定那一队的下标；两人严格交替', () => {
    const s = buildLc877Steps({})
    const moves = s[s.length - 1].moves
    moves.forEach((m, k) => {
      expect(m.who).toBe(k % 2 === 0 ? 'alex' : 'lee')
      if (m.who === 'alex') {
        const want = s[0].target === 'even' ? 0 : 1
        expect(m.idx % 2).toBe(want)
      }
    })
  })

  it('逐帧的比分单调、终值等于两人总和', () => {
    const s = buildLc877Steps({})
    let prevA = 0
    let prevL = 0
    for (const f of s) {
      if (f.phase !== 'take') continue
      expect(f.alex).toBeGreaterThanOrEqual(prevA)
      expect(f.lee).toBeGreaterThanOrEqual(prevL)
      expect(f.alex + f.lee).toBeLessThanOrEqual(17)
      prevA = f.alex
      prevL = f.lee
    }
    expect(prevA).toBe(9)
    expect(prevL).toBe(8)
  })

  it('输入校验：非正数回落默认 [5,3,4,5]', () => {
    expect(buildLc877Steps({ piles: [1, 0, 2] })[0].piles).toEqual([5, 3, 4, 5])
    expect(buildLc877Steps({ piles: [] })[0].piles).toEqual([5, 3, 4, 5])
  })
})
