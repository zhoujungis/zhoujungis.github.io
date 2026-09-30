/**
 * wordBreakSteps.test.js — LC 139「单词拆分」主视角状态机单测。
 *
 * 交叉验证：状态机（自底向上、枚举"最后一个词"）vs 两个独立参考解 ——
 * ① 逐位置 BFS（把字符串下标当图上的点，每个词是一条边，看 n 可不可达）；
 * ② 自顶向下递归记忆化。
 * 逐帧钉死：回放一致、dp 只可能 false→true、窗口端点、dpJ/seg/inDict/hit 自洽、
 * 每个 i 至多一帧 hit 且是最后一帧（短路）、cut 链与 segments 对齐。
 */
import { describe, it, expect } from 'vitest'
import {
  buildWordBreakSteps,
  WORD_BREAK_DEFAULT_S,
  WORD_BREAK_DEFAULT_WORDS,
} from '../wordBreakSteps.js'

// 独立参考解 ①：逐位置 BFS（返回可达集合）
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

// 独立参考解 ②：自顶向下递归记忆化
const refRec = (s, words) => {
  const n = s.length
  const memo = new Array(n + 1).fill(null)
  const go = (p) => {
    if (p === n) return true
    if (memo[p] !== null) return memo[p]
    let r = false
    for (const w of words) {
      if (s.startsWith(w, p) && go(p + w.length)) {
        r = true
        break
      }
    }
    memo[p] = r
    return r
  }
  return go(0)
}

// 独立参考解 ③：枚举所有切分方案（小输入用）
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
  { s: 'leetcode', words: ['leet', 'code'] }, // 题面示例 → true
  { s: 'leetcode', words: ['leet', 'code', 'le', 'et', 'tcode'] }, // 多解 → true
  { s: 'catsandog', words: ['cats', 'dog', 'sand', 'and', 'cat'] }, // 面经反例 → false
  { s: 'catsanddog', words: ['cat', 'cats', 'and', 'sand', 'dog'] }, // → true
  { s: 'aaaaaa', words: ['a', 'aa', 'aaa'] }, // 全 a → true
  { s: 'a', words: ['a'] }, // 整串即一个词 → true
  { s: 'a', words: ['b'] }, // 一个字符都不匹配 → false
  { s: 'ab', words: ['a'] }, // 尾巴剩下 → false
  { s: 'abc', words: ['a', 'bc'] }, // 两段 → true
  { s: 'cars', words: ['car', 'ca', 'rs'] }, // 前缀陷阱 → true
  { s: 'goalspecial', words: ['go', 'goal', 'goals', 'special'] }, // 长词优先 → true
  { s: 'bb', words: ['a', 'b', 'bbb', 'bbbb'] }, // 只有 'b' 能拼 → true
]

const optsOf = (c) => (c.s ? c : { s: WORD_BREAK_DEFAULT_S, words: WORD_BREAK_DEFAULT_WORDS })

const probesOf = (steps) => steps.filter((f) => f.phase === 'probe')

describe('wordBreakSteps（LC 139）', () => {
  it.each(CASES)('最终结果与 BFS / 递归两个参考解一致：%j', (c) => {
    const steps = buildWordBreakSteps(optsOf(c))
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    const { s, words } = steps[0]
    expect(done.result).toBe(refBfs(s, words))
    expect(done.result).toBe(refRec(s, words))
  })

  it.each(CASES)('帧骨架与逐帧不变量：%j', (c) => {
    const steps = buildWordBreakSteps(optsOf(c))
    const { s, words, n, maxLen } = steps[0]
    expect(steps[0].phase).toBe('init')
    expect(steps.at(-1).done).toBe(true)
    expect(maxLen).toBe(Math.max(...words.map((w) => w.length)))

    const reach = reachSet(s, words)
    for (let x = 0; x <= n; x += 1) expect(steps.at(-1).dp[x]).toBe(reach[x])
    for (const f of steps) expect(f.dp[0]).toBe(true)

    for (let k = 1; k < steps.length; k += 1) {
      const f = steps[k]
      const p = steps[k - 1]
      for (let x = 0; x <= n; x += 1) {
        expect(f.prevDp[x]).toBe(p.dp[x]) // 回放一致
        expect(p.dp[x] === true && f.dp[x] === false).toBe(false) // 不可回退
      }
    }

    // 每个 i 至少一帧，且至多一帧 hit（命中即短路 → hit 必是最后一帧）
    const byI = new Map()
    for (const f of probesOf(steps)) {
      const lo = Math.max(0, f.i - maxLen)
      const hi = f.i - 1
      expect(f.lo).toBe(lo)
      expect(f.hi).toBe(hi)
      if (f.j >= 0) {
        expect(f.j).toBeGreaterThanOrEqual(lo)
        expect(f.j).toBeLessThanOrEqual(hi)
        expect(f.dpJ).toBe(f.prevDp[f.j])
        expect(f.dpJ).toBe(true) // 只在 dp[j] = true 的切分点发帧
        expect(f.seg).toBe(s.slice(f.j, f.i))
        expect(f.inDict).toBe(words.includes(f.seg))
        expect(f.hit).toBe(f.dpJ && f.inDict)
        if (f.hit) {
          expect(f.dp[f.i]).toBe(true)
          expect(f.cut[f.i]).toBe(f.j)
        }
      } else {
        expect(f.hit).toBe(false)
        expect(f.skipped).toBeGreaterThanOrEqual(1)
      }
      if (!byI.has(f.i)) byI.set(f.i, [])
      byI.get(f.i).push(f)
    }
    for (let i = 1; i <= n; i += 1) expect(byI.has(i)).toBe(true)
    for (const [i, fs] of byI) {
      const hits = fs.filter((f) => f.hit)
      expect(hits.length).toBeLessThanOrEqual(1)
      if (hits.length === 1) expect(fs.at(-1)).toBe(hits[0])
    }

    const done = steps.at(-1)
    if (done.result) {
      expect(done.segments.join('')).toBe(s) // 拼回原串
      expect(done.segments.length).toBeGreaterThanOrEqual(1)
      expect(done.segments.every((w) => words.includes(w))).toBe(true)
      expect(done.chain[0]).toBe(n)
      expect(done.chain.at(-1)).toBe(0)
      expect(done.chain).toHaveLength(done.segments.length + 1)
      const ltr = [...done.chain].reverse()
      ltr.slice(0, -1).forEach((_, t) => {
        expect(done.segments[t]).toBe(s.slice(ltr[t], ltr[t + 1]))
      })
      expect(refAll(s, words)).toContain(done.segments.join('|'))
    } else {
      expect(done.segments).toEqual([])
      expect(done.chain).toEqual([n])
    }
  })

  it('默认题面：17 帧，dp 轨迹与切分钉死 → true（apple | pen | apple）', () => {
    const steps = buildWordBreakSteps()
    expect(steps).toHaveLength(17)
    expect(steps.map((f) => f.phase)).toEqual([
      'init',
      ...Array(15).fill('probe'),
      'done',
    ])
    expect(steps.at(-1).dp).toEqual([
      true, false, false, false, false, true, false, false,
      true, false, false, false, false, true,
    ])
    expect(steps.at(-1).result).toBe(true)
    expect(steps.at(-1).segments).toEqual(['apple', 'pen', 'apple'])
    expect(steps.at(-1).chain).toEqual([13, 8, 5, 0])

    // 逐帧 [i, j, hit, skipped]
    expect(probesOf(steps).map((f) => [f.i, f.j, f.hit, f.skipped])).toEqual([
      [1, 0, false, 0],
      [2, 0, false, 0],
      [3, 0, false, 0],
      [4, 0, false, 0],
      [5, 0, true, 0],
      [6, 5, false, 4],
      [7, 5, false, 3],
      [8, 5, true, 2],
      [9, 5, false, 1],
      [9, 8, false, 3],
      [10, 5, false, 0],
      [10, 8, false, 2],
      [11, 8, false, 2],
      [12, 8, false, 1],
      [13, 8, true, 0],
    ])
    // 每个 i 的最终 dp[i]（true 的三处正是三次命中）
    expect(probesOf(steps).map((f) => f.hit)).toEqual([
      false, false, false, false, true, false, false, true, false,
      false, false, false, false, false, true,
    ])
  })

  it('命中即短路：i = 5 只有一帧，且 dp[5] 直接为 true', () => {
    const steps = buildWordBreakSteps()
    const at5 = probesOf(steps).filter((f) => f.i === 5)
    expect(at5).toHaveLength(1)
    expect(at5[0].j).toBe(0)
    expect(at5[0].seg).toBe('apple')
    expect(at5[0].hit).toBe(true)
    expect(at5[0].skipped).toBe(0) // 一次命中，后面 4 个切分点根本没试
  })

  it('maxLen 窗口真的在剪枝：i = 6 的左端是 1 而不是 0', () => {
    const f = probesOf(buildWordBreakSteps()).find((x) => x.i === 6)
    expect(f.lo).toBe(1) // 6 - maxLen(5)
    expect(f.skipped).toBe(4) // 窗口内 1..4 全部 dp[j] = false
    expect(f.j).toBe(5)
    expect(f.seg).toBe('p')
  })

  it('无解：dp[9] = false、result false、cut 断在中间（前缀仍有可达格）', () => {
    const steps = buildWordBreakSteps({
      s: 'catsandog',
      words: ['cats', 'dog', 'sand', 'and', 'cat'],
    })
    const done = steps.at(-1)
    expect(done.result).toBe(false)
    expect(done.segments).toEqual([])
    expect(done.chain).toEqual([9]) // 没切成功，链只有起点 n
    expect(done.dp).toEqual([true, false, false, true, true, false, false, true, false, false])
    expect(done.cut.slice(1)).toEqual([null, null, 0, 0, null, null, 3, null, null])
    expect(done.desc).toContain('false')
  })

  it('一个命中都没有：每一步都停在 dp[i] = false', () => {
    const steps = buildWordBreakSteps({ s: 'ba', words: ['a'] })
    expect(probesOf(steps).some((f) => f.hit)).toBe(false)
    expect(steps.at(-1).dp).toEqual([true, false, false])
    expect(steps.at(-1).result).toBe(false)
  })

  it('题面示例 leetcode：cut 链 8 → 4 → 0，两段 leet | code', () => {
    const done = buildWordBreakSteps({ s: 'leetcode', words: ['leet', 'code'] }).at(-1)
    expect(done.result).toBe(true)
    expect(done.segments).toEqual(['leet', 'code'])
    expect(done.chain).toEqual([8, 4, 0])
    expect(done.cut[4]).toBe(0)
    expect(done.cut[8]).toBe(4)
  })

  it('整串就是一个词：dp[0] = true 是唯一底座，j = 0 一次命中', () => {
    const steps = buildWordBreakSteps({ s: 'leet', words: ['leet'] })
    expect(steps.at(-1).result).toBe(true)
    expect(steps.at(-1).segments).toEqual(['leet'])
    expect(steps.at(-1).chain).toEqual([4, 0])
    const at4 = probesOf(steps).find((f) => f.i === 4)
    expect(at4.j).toBe(0)
    expect(at4.dpJ).toBe(true) // 全靠 dp[0] 这一格
    expect(at4.hit).toBe(true)
  })

  it('没有任何 j 可试：i 帧退化成"整窗 dp[j] 全 false"的汇总帧', () => {
    const steps = buildWordBreakSteps({ s: 'ba', words: ['a'] })
    const at2 = probesOf(steps).find((f) => f.i === 2)
    expect(at2.j).toBe(-1) // 窗口 j = 1 的 dp[1] 是 false，一个都不试
    expect(at2.hit).toBe(false)
    expect(at2.skipped).toBe(1)
    expect(steps.at(-1).result).toBe(false)
    // 窗内有 dp[j] = true 可试时，这种汇总帧不会出现
    const steps2 = buildWordBreakSteps({ s: 'aa', words: ['a'] })
    expect(probesOf(steps2).every((f) => f.j >= 0)).toBe(true)
    expect(steps2.at(-1).result).toBe(true)
  })

  it('done 帧 desc 点名切分、复用与 322 的对照', () => {
    const done = buildWordBreakSteps().at(-1)
    expect(done.desc).toContain('apple | pen | apple')
    expect(done.desc).toContain('13 → 8 → 5 → 0')
    expect(done.desc).toContain('词可重复使用')
    expect(done.desc).toContain('LC 322')
  })

  it('init 帧 desc 讲清 dp[0] 底座、maxLen 窗口与短路', () => {
    const init = buildWordBreakSteps()[0]
    expect(init.desc).toContain('dp[0] = true')
    expect(init.desc).toContain('最后一个词')
    expect(init.desc).toContain('命中即短路')
    expect(init.desc).toContain('maxLen')
  })

  it('随机交叉：400 组 vs BFS + 递归 + 合法切分', () => {
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
      const steps = buildWordBreakSteps({ s, words })
      const done = steps.at(-1)
      expect(done.result).toBe(refBfs(s, words))
      expect(done.result).toBe(refRec(s, words))
      for (const f of probesOf(steps)) {
        expect(f.inDict).toBe(words.includes(f.seg))
        expect(f.hit).toBe(f.dpJ && f.inDict)
        if (f.j >= 0) expect(f.seg).toBe(s.slice(f.j, f.i))
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
    const d1 = buildWordBreakSteps({ s: '', words: [] })
    expect(d1[0].s).toBe(WORD_BREAK_DEFAULT_S)
    expect(d1[0].words).toEqual(WORD_BREAK_DEFAULT_WORDS)
    expect(buildWordBreakSteps({ s: null, words: [''] })[0].s).toBe(WORD_BREAK_DEFAULT_S)
    expect(buildWordBreakSteps({ s: 42, words: [3, null] })[0].words).toEqual(
      WORD_BREAK_DEFAULT_WORDS,
    )
    expect(buildWordBreakSteps({ words: undefined })[0].words).toEqual(WORD_BREAK_DEFAULT_WORDS)
  })

  it('字典去重且过滤非法词条，帧里是拷贝不受外部改动影响', () => {
    const input = ['abc', 'abc', 'a', 7, '']
    const steps = buildWordBreakSteps({ s: 'abc', words: input })
    input.push('zzz')
    for (const f of steps) expect(f.words).toEqual(['abc', 'a'])
    expect(steps.at(-1).result).toBe(true)
  })
})
