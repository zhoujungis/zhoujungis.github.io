import { describe, expect, it } from 'vitest'

import { buildLcs1Steps, judgeLcs1 } from '../lcs1Steps.js'

/** 独立暴力：枚举所有对齐窗口，逐字符数 mismatch，取 ≤1 的最长。 */
function brute(s, t, k = 1) {
  let best = 0
  for (let i = 0; i < s.length; i += 1) {
    for (let j = 0; j < t.length; j += 1) {
      let len = 0
      let bad = 0
      while (i + len < s.length && j + len < t.length) {
        if (s[i + len] !== t[j + len]) {
          if (bad === k) break
          bad += 1
        }
        len += 1
      }
      best = Math.max(best, len)
    }
  }
  return best
}

const last = (s, t) => {
  const steps = buildLcs1Steps({ s, t })
  return steps[steps.length - 1]
}

describe('允许一错 LCS · 主例 abcdef vs abcdxf', () => {
  it('8 帧：init + 6 行 + done', () => {
    const steps = buildLcs1Steps({})
    expect(steps.map((x) => x.phase)).toEqual([
      'init', 'row', 'row', 'row', 'row', 'row', 'row', 'done',
    ])
  })

  it('答案 6，best 逐行 1..6', () => {
    const steps = buildLcs1Steps({})
    expect(steps.filter((x) => x.phase === 'row').map((x) => x.best)).toEqual([1, 2, 3, 4, 5, 6])
    expect(steps[steps.length - 1].best).toBe(6)
    expect(judgeLcs1('abcdef', 'abcdxf').best).toBe(6)
  })

  it('讲解格落在对角线上，第 5 行正好是 e 对 x 的不等格', () => {
    const steps = buildLcs1Steps({})
    const rows = steps.filter((x) => x.phase === 'row')
    expect(rows.map((x) => x.cell.j)).toEqual([1, 2, 3, 4, 5, 6])
    const key = rows[4].cell // 第 5 行
    expect(key.equal).toBe(false)
    expect(key.f).toBe(0)
    expect(key.g).toBe(5)
    expect(key.fDiag).toBe(4) // 来自 f 左上，不是 g 左上
    expect(key.g).toBe(key.fDiag + 1)
  })
})

describe('允许一错 LCS · 帧级不变量', () => {
  const PAIRS = [
    ['abcdef', 'abcdxf'],
    ['abcdef', 'bcdefa'],
    ['ab', 'ba'],
    ['abc', 'abc'],
    ['abc', 'xyz'],
    ['aaa', 'aa'],
  ]

  it('filled 随行数递增；best 单调不减', () => {
    for (const [s, t] of PAIRS) {
      const steps = buildLcs1Steps({ s, t })
      steps.filter((x) => x.phase === 'row').forEach((x, idx) => {
        expect(x.filled).toBe(idx + 1)
        if (idx > 0) expect(x.best).toBeGreaterThanOrEqual(steps[idx].best)
      })
    }
  })

  it('每帧 best 不超过较短串长度', () => {
    for (const [s, t] of PAIRS) {
      for (const x of buildLcs1Steps({ s, t })) {
        expect(x.best, `${s}/${t}`).toBeLessThanOrEqual(Math.min(s.length, t.length))
      }
    }
  })

  it('done 帧的 best 与 judgeLcs1 一致', () => {
    for (const [s, t] of PAIRS) {
      expect(last(s, t).best).toBe(judgeLcs1(s, t).best)
    }
  })

  it('done 帧没有 cell（坑 J：语义字段归零）', () => {
    expect(last('abcdef', 'abcdxf').cell).toBe(null)
  })
})

describe('允许一错 LCS · 与暴力参考解交叉', () => {
  it('1000 组随机输入（a-d 字母表，长度 1~7）逐一一致', () => {
    let mismatches = 0
    for (let t = 0; t < 1000; t += 1) {
      const n = 1 + Math.floor(Math.random() * 7)
      const m = 1 + Math.floor(Math.random() * 7)
      const s = Array.from({ length: n }, () => 'abcd'[Math.floor(Math.random() * 4)]).join('')
      const u = Array.from({ length: m }, () => 'abcd'[Math.floor(Math.random() * 4)]).join('')
      if (judgeLcs1(s, u).best !== brute(s, u)) mismatches += 1
    }
    expect(mismatches).toBe(0)
  })

  it('典型用例逐一命中', () => {
    const cases = [
      ['abcdef', 'abcdxf', 6],
      ['abcdef', 'bcdefa', 5],
      ['ab', 'ba', 1],
      ['abc', 'abc', 3],
      ['abc', 'xyz', 1],
      ['kitten', 'sitting', 5],
      ['abcdef', 'abdcef', 3], // c、d 对调 = 2 处错，只能取 3
      ['a', 'a', 1],
      ['a', 'b', 1],
    ]
    for (const [s, t, want] of cases) {
      expect(judgeLcs1(s, t).best, `${s}/${t}`).toBe(want)
    }
  })
})

describe('允许一错 LCS · 核心 bug：不等时误用 g 左上（可执行证明）', () => {
  /** 错法：mismatch 也从 g 左上 +1，错误配额在同一个字符上被反复消耗。 */
  function judgeBug(s, t) {
    const n = s.length
    const m = t.length
    const g = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
    for (let i = 1; i <= n; i += 1) {
      for (let j = 1; j <= m; j += 1) {
        g[i][j] = g[i - 1][j - 1] + 1 // 相等与不等走同一条路
      }
    }
    return Math.max(...g.flat())
  }

  it('"ab" vs "ba"：正解 1，错法 2', () => {
    expect(judgeLcs1('ab', 'ba').best).toBe(1)
    expect(judgeBug('ab', 'ba')).toBe(2)
  })

  it('"abcdef" vs "bcdefa"：正解 5，错法 6', () => {
    expect(judgeLcs1('abcdef', 'bcdefa').best).toBe(5)
    expect(judgeBug('abcdef', 'bcdefa')).toBe(6)
  })

  it('穷举 a/b/c 字母表、长度 0~4：错法在约六成输入上都与正解不同', () => {
    // 与 .shots/verify_lcs1.py 的穷举口径一致（正文引用的 61.8% 由此复现）
    const alphabet = ['a', 'b', 'c']
    const gen = (maxLen) => {
      const out = ['']
      let level = ['']
      for (let len = 1; len <= maxLen; len += 1) {
        const next = []
        for (const prefix of level) for (const ch of alphabet) next.push(prefix + ch)
        out.push(...next)
        level = next
      }
      return out
    }
    const pool = gen(4)
    let total = 0
    let diff = 0
    for (const s of pool) {
      for (const t of pool) {
        total += 1
        if (judgeBug(s, t) !== judgeLcs1(s, t).best) diff += 1
      }
    }
    expect(total).toBe(14641)
    const rate = (diff / total) * 100
    expect(rate).toBeGreaterThan(60)
    expect(rate).toBeLessThan(63)
  })

  it('正解的不等格永远满足 g = f 左上 + 1（而不是 g 左上 + 1）', () => {
    const { f, g } = judgeLcs1('abcdef', 'bcdefa')
    for (let i = 1; i <= 6; i += 1) {
      for (let j = 1; j <= 6; j += 1) {
        const s = 'abcdef'
        const t = 'bcdefa'
        if (s[i - 1] !== t[j - 1]) {
          expect(g[i][j], `(${i},${j})`).toBe(Math.max(f[i - 1][j - 1] + 1, 1))
        }
      }
    }
  })
})

describe('允许一错 LCS · 边界与非法输入', () => {
  it('空串、单字符', () => {
    expect(judgeLcs1('', 'abc').best).toBe(0)
    expect(judgeLcs1('a', 'a').best).toBe(1)
    expect(judgeLcs1('a', 'b').best).toBe(1)
  })

  it('非法输入回退主例 abcdef / abcdxf', () => {
    const def = buildLcs1Steps({})
    expect(def[0].s).toBe('abcdef')
    expect(def[0].t).toBe('abcdxf')
    for (const bad of [
      { s: '', t: 'abc' },
      { s: 'abc', t: '' },
      { s: 'ABC', t: 'abc' },
      { s: 'abcdefghijk', t: 'abc' },
      { s: 'ab', t: 'a1' },
      {},
    ]) {
      const steps = buildLcs1Steps(bad)
      expect(steps[0].s, JSON.stringify(bad)).toBe('abcdef')
      expect(steps[0].t, JSON.stringify(bad)).toBe('abcdxf')
    }
  })

  it('合法短输入照单全收', () => {
    const steps = buildLcs1Steps({ s: 'ab', t: 'ba' })
    expect(steps[0].s).toBe('ab')
    expect(steps[0].t).toBe('ba')
    expect(steps[steps.length - 1].best).toBe(1)
  })
})
