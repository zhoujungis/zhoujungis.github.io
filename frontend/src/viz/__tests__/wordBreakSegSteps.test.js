/**
 * wordBreakSegSteps.test.js — LC 139「单词拆分」第二视角状态机单测：
 * 拿算好的 dp 表，从 n 往左把 s 一段一段切成词。
 *
 * 交叉验证：dp 与逐位置 BFS 的可达集合逐格一致，且与主状态机
 * （buildWordBreakSteps）的终态 dp 完全相同；切出来的 segments 必须
 * 是"枚举所有切分方案"里的一个。
 * 逐帧钉死：dp 全程不变、扫描窗口端点、dpJ/seg/inDict/hit 自洽、
 * locked 互不重叠且首尾相接、pos 严格递减、首个 hit 的 end === n。
 */
import { describe, it, expect } from 'vitest'
import { buildWordBreakSegSteps } from '../wordBreakSegSteps.js'
import { buildWordBreakSteps, WORD_BREAK_DEFAULT_S, WORD_BREAK_DEFAULT_WORDS } from '../wordBreakSteps.js'

const reachSet = (s, words) => {
  const n = s.length
  const seen = new Array(n + 1).fill(false)
  seen[0] = true
  const queue = [0]
  for (let head = 0; head < queue.length; head += 1) {
    const p = queue[head]
    for (const w of words) {
      if (s.startsWith(w, p)) {
        const next = p + w.length
        if (!seen[next]) {
          seen[next] = true
          queue.push(next)
        }
      }
    }
  }
  return seen
}
const refBfs = (s, words) => reachSet(s, words)[s.length]

const refAll = (s, words) => {
  const out = []
  const go = (p, acc) => {
    if (p === s.length) {
      out.push(acc.join('|'))
      return
    }
    for (const w of words) {
      if (s.startsWith(w, p)) {
        acc.push(w)
        go(p + w.length, acc)
        acc.pop()
      }
    }
  }
  go(0, [])
  return out
}

const CASES = [
  {}, // 默认 applepenapple / [apple, pen] → true
  { s: 'leetcode', words: ['leet', 'code'] },
  { s: 'leetcode', words: ['leet', 'code', 'le', 'et', 'tcode'] },
  { s: 'catsandog', words: ['cats', 'dog', 'sand', 'and', 'cat'] }, // false
  { s: 'catsanddog', words: ['cat', 'cats', 'and', 'sand', 'dog'] },
  { s: 'aaaaaa', words: ['a', 'aa', 'aaa'] },
  { s: 'a', words: ['a'] },
  { s: 'a', words: ['b'] },
  { s: 'ab', words: ['a'] },
  { s: 'abc', words: ['a', 'bc'] },
  { s: 'cars', words: ['car', 'ca', 'rs'] },
  { s: 'goalspecial', words: ['go', 'goal', 'goals', 'special'] },
]

const optsOf = (c) => (c.s ? c : { s: WORD_BREAK_DEFAULT_S, words: WORD_BREAK_DEFAULT_WORDS })
const scansOf = (steps) => steps.filter((f) => f.phase === 'scan')

describe('wordBreakSegSteps（LC 139 切分还原）', () => {
  it.each(CASES)('dp 与 BFS 可达集合、主状态机逐格一致：%j', (c) => {
    const { s, words } = optsOf(c)
    const steps = buildWordBreakSegSteps({ s, words })
    const dp = steps[0].dp
    const reach = reachSet(s, words)
    const mainDp = buildWordBreakSteps({ s, words }).at(-1).dp
    expect(dp).toHaveLength(s.length + 1)
    for (let x = 0; x <= s.length; x += 1) {
      expect(dp[x]).toBe(reach[x])
      expect(dp[x]).toBe(mainDp[x])
    }
    expect(dp[0]).toBe(true)
    expect(steps.at(-1).result).toBe(refBfs(s, words))
    expect(steps.at(-1).result).toBe(dp[s.length])
  })

  it.each(CASES)('帧骨架与逐帧不变量：%j', (c) => {
    const { s, words } = optsOf(c)
    const steps = buildWordBreakSegSteps({ s, words })
    const { n, maxLen } = steps[0]
    const dp = steps[0].dp
    expect(steps[0].phase).toBe('init')
    expect(steps.at(-1).done).toBe(true)
    expect(maxLen).toBe(Math.max(...words.map((w) => w.length)))

    // dp 全程不变
    for (const f of steps) expect(f.dp).toEqual(dp)

    for (const f of scansOf(steps)) {
      const lo = Math.max(0, f.pos - maxLen)
      const hi = f.pos - 1
      expect(f.lo).toBe(lo)
      expect(f.hi).toBe(hi)
      expect(f.j).toBeGreaterThanOrEqual(lo)
      expect(f.j).toBeLessThanOrEqual(hi)
      expect(f.seg).toBe(s.slice(f.j, f.pos))
      expect(f.dpJ).toBe(dp[f.j])
      expect(f.inDict).toBe(words.includes(f.seg))
      expect(f.hit).toBe(f.dpJ && f.inDict)

      const sorted = [...f.locked].sort((a, b) => a.start - b.start)
      sorted.forEach((r, t) => {
        expect(r.start).toBeLessThan(r.end)
        expect(r.word).toBe(s.slice(r.start, r.end))
        expect(words).toContain(r.word)
        if (t > 0) expect(sorted[t - 1].end).toBe(r.start) // 首尾相接
      })
      if (f.hit) {
        expect(f.locked.some((r) => r.start === f.j && r.end === f.pos)).toBe(true)
      }
    }

    // pos 严格递减、首个 hit 从 n 起步、最后一个 hit 落在 0
    const hits = scansOf(steps).filter((f) => f.hit)
    hits.slice(1).forEach((f, t) => expect(f.pos).toBeLessThan(hits[t].pos))
    if (hits.length) {
      expect(hits[0].pos).toBe(n)
      expect(hits.at(-1).j).toBe(0)
    }

    const done = steps.at(-1)
    if (done.result) {
      const sorted = [...done.locked].sort((a, b) => a.start - b.start)
      expect(sorted[0].start).toBe(0)
      expect(sorted.at(-1).end).toBe(n)
      expect(sorted.every((r) => words.includes(r.word))).toBe(true)
      expect(done.segments.join('')).toBe(s)
      expect(done.chain[0]).toBe(n)
      expect(done.chain.at(-1)).toBe(0)
      expect(done.chain).toHaveLength(done.segments.length + 1)
      if (n <= 14) expect(refAll(s, words)).toContain(done.segments.join('|'))
    } else {
      expect(scansOf(steps).some((f) => f.hit)).toBe(false)
      expect(done.segments).toEqual([])
      expect(done.locked).toEqual([])
    }
  })

  it('默认题面：15 帧，逐帧 [pos, j, hit] 与三段切分钉死', () => {
    const steps = buildWordBreakSegSteps()
    expect(steps).toHaveLength(15)
    expect(scansOf(steps).map((f) => [f.pos, f.j, f.hit])).toEqual([
      [13, 12, false],
      [13, 11, false],
      [13, 10, false],
      [13, 9, false],
      [13, 8, true],
      [8, 7, false],
      [8, 6, false],
      [8, 5, true],
      [5, 4, false],
      [5, 3, false],
      [5, 2, false],
      [5, 1, false],
      [5, 0, true],
    ])
    expect(steps.at(-1).segments).toEqual(['apple', 'pen', 'apple'])
    expect(steps.at(-1).chain).toEqual([13, 8, 5, 0])
    expect(steps.at(-1).result).toBe(true)
    // locked 逐步长大：1 段 → 2 段 → 3 段
    expect(scansOf(steps).find((f) => f.hit).locked).toEqual([
      { start: 8, end: 13, word: 'apple' },
    ])
    expect(steps.filter((f) => f.hit).length).toBe(3)
  })

  it('题面示例 leetcode：locked 覆盖 [0, 8)，链条 8 → 4 → 0', () => {
    const steps = buildWordBreakSegSteps({ s: 'leetcode', words: ['leet', 'code'] })
    const done = steps.at(-1)
    expect(done.result).toBe(true)
    expect(done.locked).toEqual([
      { start: 0, end: 4, word: 'leet' },
      { start: 4, end: 8, word: 'code' },
    ])
    expect(done.segments).toEqual(['leet', 'code'])
    expect(done.chain).toEqual([8, 4, 0])
  })

  it('无解 catsandog：没有一帧 hit，更没有锁定段', () => {
    const steps = buildWordBreakSegSteps({
      s: 'catsandog',
      words: ['cats', 'dog', 'sand', 'and', 'cat'],
    })
    expect(steps.at(-1).result).toBe(false)
    expect(steps.filter((f) => f.hit)).toHaveLength(0)
    expect(steps.at(-1).locked).toEqual([])
    expect(steps.at(-1).segments).toEqual([])
    expect(steps.at(-1).desc).toContain('false')
    // 唯一的 pos = 9 把窗口 [5, 8] 里的 j 从右往左试了个遍，一个都接不上
    const at9 = scansOf(steps).filter((f) => f.pos === 9)
    expect(at9.map((f) => f.j)).toEqual([8, 7, 6, 5])
    expect(at9.every((f) => f.hit === false)).toBe(true)
    expect(steps).toHaveLength(6)
  })

  it('回溯不需要额外的 cut 表：dp[j] 为真 + 这一段是词就够了', () => {
    const steps = buildWordBreakSegSteps({ s: 'abc', words: ['a', 'bc'] })
    const hits = steps.filter((f) => f.hit)
    expect(hits.map((f) => [f.pos, f.j, f.seg])).toEqual([
      [3, 1, 'bc'],
      [1, 0, 'a'],
    ])
    // 两帧 hit 的 dpJ 都直接来自 dp 表，且 dp 表在整段过程中一模一样
    for (const f of hits) expect(f.dpJ).toBe(f.dp[f.j])
    expect(hits[1].dp).toEqual(hits[0].dp)
  })

  it('扫描方向是从右往左（最后一段从短到长）', () => {
    const f = scansOf(buildWordBreakSegSteps()).filter((x) => x.pos === 8)
    expect(f.map((x) => x.j)).toEqual([7, 6, 5]) // 7 最短（"n"），5 命中（"pen"）
    expect(f.map((x) => x.seg)).toEqual(['n', 'en', 'pen'])
    expect(f.map((x) => x.hit)).toEqual([false, false, true])
  })

  it('done 帧 desc 点名 LC 140 与两个动画的分工', () => {
    const done = buildWordBreakSegSteps().at(-1)
    expect(done.desc).toContain('apple | pen | apple')
    expect(done.desc).toContain('13 → 8 → 5 → 0')
    expect(done.desc).toContain('LC 140')
    expect(done.desc).toContain('填表')
  })

  it('随机交叉：400 组 vs BFS 可达 + 枚举所有方案', () => {
    let rng = 20260930
    const rand = (m) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % m
    }
    const ALPHA = ['ab', 'abc', 'abcd']
    for (let t = 0; t < 400; t += 1) {
      const alpha = ALPHA[rand(ALPHA.length)]
      const n = 1 + rand(13)
      let s = ''
      for (let k = 0; k < n; k += 1) s += alpha[rand(alpha.length)]
      const words = []
      for (let w = 0, k = 1 + rand(4); w < k; w += 1) {
        let len = 1 + rand(5)
        let word = ''
        for (let q = 0; q < len; q += 1) word += alpha[rand(alpha.length)]
        if (!words.includes(word)) words.push(word)
      }
      const steps = buildWordBreakSegSteps({ s, words })
      const done = steps.at(-1)
      expect(done.result).toBe(refBfs(s, words))
      expect(steps[0].dp).toEqual(buildWordBreakSteps({ s, words }).at(-1).dp)
      for (const f of scansOf(steps)) {
        expect(f.seg).toBe(s.slice(f.j, f.pos))
        expect(f.dpJ).toBe(steps[0].dp[f.j])
        expect(f.inDict).toBe(words.includes(f.seg))
        expect(f.hit).toBe(f.dpJ && f.inDict)
      }
      if (done.result) {
        expect(done.segments.join('')).toBe(s)
        expect(done.segments.every((w) => words.includes(w))).toBe(true)
        expect(refAll(s, words)).toContain(done.segments.join('|'))
      } else {
        expect(done.segments).toEqual([])
      }
    }
  })

  it('非法输入回退默认：空/非字符串 s、空字典、脏词条', () => {
    const d1 = buildWordBreakSegSteps({ s: '', words: [] })
    expect(d1[0].s).toBe(WORD_BREAK_DEFAULT_S)
    expect(d1[0].words).toEqual(WORD_BREAK_DEFAULT_WORDS)
    expect(buildWordBreakSegSteps({ s: null, words: [''] })[0].s).toBe(WORD_BREAK_DEFAULT_S)
    expect(buildWordBreakSegSteps({ s: 7, words: [null, ''] })[0].words).toEqual(
      WORD_BREAK_DEFAULT_WORDS,
    )
    expect(buildWordBreakSegSteps({ s: 'abc', words: ['abc', 'abc', 'a', 9, ''] })[0].words).toEqual(
      ['abc', 'a'],
    )
  })
})
