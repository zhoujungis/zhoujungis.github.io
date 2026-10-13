/**
 * eliminateSum10OrderSteps.test.js — 双路线（最左 / 最右）状态机单测。
 *
 * 交叉验证：状态机的两条路线 vs 独立实现的参考路线（同样的"最左/最右优先"）。
 * 逐帧钉死：alive 升序且只减、removed 是上一状态里相邻且互补的一对、
 * steps === (n - alive.length) / 2、终态不可约、两路线终点相同。
 */
import { describe, it, expect } from 'vitest'
import { buildEliminateSum10OrderSteps } from '../eliminateSum10OrderSteps.js'

// ── 参考解：独立实现的"最左 / 最右优先"消法，返回每一步剩下的串 ──
function refRoute(s, leftmost) {
  const chars = Array.from(s)
  let alive = chars.map((_, i) => i)
  const out = [alive.map((k) => chars[k]).join('')]
  for (;;) {
    const pairs = []
    for (let k = 0; k + 1 < alive.length; k += 1) {
      if (Number(chars[alive[k]]) + Number(chars[alive[k + 1]]) === 10) pairs.push(k)
    }
    if (pairs.length === 0) return out
    const at = leftmost ? pairs[0] : pairs[pairs.length - 1]
    alive = alive.filter((_, idx) => idx !== at && idx !== at + 1)
    out.push(alive.map((k) => chars[k]).join(''))
  }
}

function mulberry32(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const CASES = ['191191', '5512', '55128921', '12345678', '555555', '918', '991', '']

describe('buildEliminateSum10OrderSteps — 两条路线与参考解一致', () => {
  CASES.forEach((s, ci) => {
    it(`case ${ci}: ${s || '(空串)'}`, () => {
      const frames = buildEliminateSum10OrderSteps({ s })
      const wantA = refRoute(s, true)
      const wantB = refRoute(s, false)
      // 帧数 = init + A 的步数 + B 的步数 + done
      expect(frames.length).toBe(1 + (wantA.length - 1) + (wantB.length - 1) + 1)

      // 每条路线的每一步都要在帧里出现，且顺序正确
      const seenA = frames.map((f) => f.a.alive.map((k) => f.chars[k]).join(''))
      const seenB = frames.map((f) => f.b.alive.map((k) => f.chars[k]).join(''))
      const uniqA = seenA.filter((v, i) => i === 0 || v !== seenA[i - 1])
      const uniqB = seenB.filter((v, i) => i === 0 || v !== seenB[i - 1])
      expect(uniqA).toEqual(wantA)
      expect(uniqB).toEqual(wantB)

      // 终点：两条路线相同，且等于参考解
      const last = frames.at(-1)
      expect(last.converged).toBe(true)
      expect(last.result).toBe(wantA.at(-1))
      expect(wantA.at(-1)).toBe(wantB.at(-1))
    })
  })
})

describe('buildEliminateSum10OrderSteps — 默认主例的形态差异', () => {
  const frames = buildEliminateSum10OrderSteps({})
  it('默认输入 191191：init + 4 步 + done = 6 帧', () => {
    expect(frames.length).toBe(6)
    expect(frames[0].phase).toBe('init')
    expect(frames.at(-1).phase).toBe('done')
    expect(frames.filter((f) => f.turn === 'A').length).toBe(2)
    expect(frames.filter((f) => f.turn === 'B').length).toBe(2)
  })
  it('中途形态确实不同：A 走到 1191 时 B 是 1911', () => {
    const f = frames.find((x) => x.turn === 'B')
    expect(f.a.alive.map((k) => f.chars[k]).join('')).toBe('1191')
    expect(f.b.alive.map((k) => f.chars[k]).join('')).toBe('1911')
  })
  it('终点相同：都是 11', () => {
    expect(frames.at(-1).result).toBe('11')
  })
  it('每帧 desc 的 ** 成对', () => {
    for (const f of frames) {
      expect(((f.desc.match(/\*\*/g) || []).length) % 2).toBe(0)
    }
  })
})

describe('buildEliminateSum10OrderSteps — 逐帧不变量', () => {
  CASES.forEach((s, ci) => {
    it(`case ${ci}: alive 升序、removed 互补且相邻、终态不可约`, () => {
      const frames = buildEliminateSum10OrderSteps({ s })
      for (const f of frames) {
        for (const side of ['a', 'b']) {
          const st = f[side]
          const chars = f.chars
          // alive 升序
          for (let t = 1; t < st.alive.length; t += 1) {
            expect(st.alive[t]).toBeGreaterThan(st.alive[t - 1])
          }
          // steps 与长度关系
          expect(st.steps).toBe((f.n - st.alive.length) / 2)
          // removed 是"上一状态"里相邻且互补的一对
          if (st.removed) {
            const [x, y] = st.removed
            expect(Number(chars[x]) + Number(chars[y])).toBe(10)
            expect(st.alive.includes(x)).toBe(false)
            expect(st.alive.includes(y)).toBe(false)
          }
        }
      }
      // 终态不可约
      const last = frames.at(-1)
      for (const side of ['a', 'b']) {
        const str = last[side].alive.map((k) => last.chars[k]).join('')
        for (let t = 1; t < str.length; t += 1) {
          expect(Number(str[t - 1]) + Number(str[t])).not.toBe(10)
        }
      }
    })
  })
})

describe('buildEliminateSum10OrderSteps — 合流性（随机串）', () => {
  it('100 条随机串：最左 / 最右两路线终点相同，且 coincident 与参考解一致', () => {
    const rng = mulberry32(2026)
    for (let t = 0; t < 100; t += 1) {
      const n = Math.floor(rng() * 25)
      const s = Array.from({ length: n }, () => String(1 + Math.floor(rng() * 9))).join('')
      const frames = buildEliminateSum10OrderSteps({ s })
      const last = frames.at(-1)
      expect(last.converged, `s=${s}`).toBe(true)
      expect(last.result, `s=${s}`).toBe(refRoute(s, true).at(-1))
      expect(refRoute(s, true).at(-1), `s=${s}`).toBe(refRoute(s, false).at(-1))
    }
  })

  it('918 在本题规则下仍然合流（唯一那对 9+1 消掉后剩 8）—— 反例靠换规则才成立', () => {
    const last = buildEliminateSum10OrderSteps({ s: '918' }).at(-1)
    expect(last.converged).toBe(true)
    expect(last.result).toBe('8')
  })
})

describe('buildEliminateSum10OrderSteps — 边界', () => {
  it('空串：只有 init + done', () => {
    const frames = buildEliminateSum10OrderSteps({ s: '' })
    expect(frames.length).toBe(2)
    expect(frames.at(-1).result).toBe('')
  })
  it('无可消对：两条路线一步没走，终点就是原串', () => {
    const frames = buildEliminateSum10OrderSteps({ s: '12345678' })
    expect(frames.length).toBe(2)
    expect(frames.at(-1).result).toBe('12345678')
  })
})
