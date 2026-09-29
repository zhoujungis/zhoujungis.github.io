/**
 * longestPalSteps.test.js — LC 5「最长回文子串」状态机单测。
 *
 * 多参考解交叉：状态机（中心扩展）vs 暴力 O(n^3)（同为先到先得）vs DP。
 * 逐帧不变量：每个 center 帧的 [l, r] 必须真的是回文（这条直接钉死扩展逻辑）、
 * len = r - l + 1、bestLen 单调不减。
 */
import { describe, it, expect } from 'vitest'
import { buildLongestPalSteps } from '../longestPalSteps.js'

const isPal = (arr, l, r) => {
  while (l < r) {
    if (arr[l] !== arr[r]) return false
    l += 1
    r -= 1
  }
  return true
}

const brute = (str) => {
  const a = Array.from(str)
  const n = a.length
  let bestL = 0
  let bestR = 0
  for (let l = 0; l < n; l += 1) {
    for (let r = l; r < n; r += 1) {
      if (isPal(a, l, r) && r - l > bestR - bestL) {
        bestL = l
        bestR = r
      }
    }
  }
  return [bestL, bestR]
}

const dpRef = (str) => {
  const a = Array.from(str)
  const n = a.length
  const dp = Array.from({ length: n }, () => Array(n).fill(false))
  let bestL = 0
  let bestR = 0
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = i; j < n; j += 1) {
      dp[i][j] = a[i] === a[j] && (j - i < 2 || dp[i + 1][j - 1])
      if (dp[i][j] && j - i > bestR - bestL) {
        bestL = i
        bestR = j
      }
    }
  }
  return [bestL, bestR]
}

const CASES = [
  'babad',
  'cbbd',
  'abba',
  'a',
  'ac',
  'aaaa',
  'bananas',
  'abcba',
  'abacdfgdcaba',
  'forgeeksskeegfor',
  'aabbaab',
  '🚀🚀ab🚀ba',
  'xxabccbayz',
]

describe('buildLongestPalSteps — 结果正确性（多参考解交叉）', () => {
  for (const str of CASES) {
    it(`"${str}"`, () => {
      const steps = buildLongestPalSteps({ s: str })
      const done = steps[steps.length - 1]
      const chars = Array.from(str)
      const [bl, br] = brute(str)
      const [dl, dr] = dpRef(str)
      // 长度与两个参考解一致
      expect(done.bestLen).toBe(br - bl + 1)
      expect(done.bestLen).toBe(dr - dl + 1)
      // 区间与暴力解（同为先到先得）逐位一致
      expect(done.bestL).toBe(bl)
      expect(done.bestR).toBe(br)
      // 结果确实是回文（码点坐标系；⚠️ 别用 str.slice 比对 —— 它按 UTF-16 码元索引，emoji 串上与码点索引错位）
      expect(isPal(chars, done.bestL, done.bestR)).toBe(true)
    })
  }
})

describe('buildLongestPalSteps — 主例帧结构', () => {
  const steps = buildLongestPalSteps({})
  const centers = steps.filter((s) => s.phase === 'center')

  it('init → 9 个 center → done，共 11 帧（2n-1 = 9 个中心）', () => {
    expect(steps.length).toBe(11)
    expect(steps[0].phase).toBe('init')
    expect(centers.length).toBe(9)
    expect(steps[10].phase).toBe('done')
  })

  it('主例 babad → "bab"（先到先得，"aba" 不更新）', () => {
    expect(steps[10].bestL).toBe(0)
    expect(steps[10].bestR).toBe(2)
  })

  it('字符中心与间隙中心交错出现', () => {
    const types = centers.map((s) => s.centerType)
    expect(types).toEqual(['char', 'gap', 'char', 'gap', 'char', 'gap', 'char', 'gap', 'char'])
  })

  it('中心 2（char@1）扩展出 "bab" 并更新最优；中心 4（char@2）的 "aba" 不更新', () => {
    const c2 = centers[2]
    expect(c2.l).toBe(0)
    expect(c2.r).toBe(2)
    expect(c2.pal).toBe('bab')
    expect(c2.bestUpdated).toBe(true)
    const c4 = centers[4]
    expect(c4.pal).toBe('aba')
    expect(c4.len).toBe(3)
    expect(c4.bestUpdated).toBe(false)
  })

  it('所有 gap 帧在 babad 里都构不成偶数回文（长度 0）', () => {
    for (const s of centers) {
      if (s.centerType === 'gap') {
        expect(s.l).toBeNull()
        expect(s.len).toBe(0)
      }
    }
  })

  it('done 帧带全渲染层要用的字段', () => {
    const d = steps[10]
    expect(d.chars).toEqual(['b', 'a', 'b', 'a', 'd'])
    expect(d.bestLen).toBe(3)
    expect(d.bestL).toBe(0)
    expect(d.bestR).toBe(2)
  })
})

describe('buildLongestPalSteps — 逐帧不变量（所有用例）', () => {
  for (const str of CASES) {
    it(`"${str}"：每个 center 帧的 [l, r] 真的是回文 + len 自洽 + bestLen 单调`, () => {
      const steps = buildLongestPalSteps({ s: str })
      const chars = Array.from(str)
      let prevBest = 0
      let prevCenterIdx = -1
      for (const s of steps) {
        if (s.phase !== 'center') continue
        // 中心单调递增
        expect(s.centerIdx).toBeGreaterThan(prevCenterIdx)
        prevCenterIdx = s.centerIdx
        if (s.l !== null) {
          expect(s.len).toBe(s.r - s.l + 1)
          // ⭐ 核心：扩展出的区间必须真的是回文
          expect(isPal(chars, s.l, s.r)).toBe(true)
          expect(s.pal).toBe(chars.slice(s.l, s.r + 1).join(''))
          // 中心必须在区间内
          if (s.centerType === 'char') {
            expect(s.l).toBeLessThanOrEqual(s.ci)
            expect(s.r).toBeGreaterThanOrEqual(s.ci)
          } else {
            expect(s.l).toBeLessThanOrEqual(s.ci)
            expect(s.r).toBeGreaterThanOrEqual(s.ci + 1)
          }
        } else {
          expect(s.len).toBe(0)
        }
        expect(s.bestLen).toBeGreaterThanOrEqual(prevBest)
        prevBest = s.bestLen
      }
    })
  }
})

describe('buildLongestPalSteps — 本题特有易错点', () => {
  it('"cbbd" → "bb"：偶数回文全靠间隙中心', () => {
    const steps = buildLongestPalSteps({ s: 'cbbd' })
    const centers = steps.filter((s) => s.phase === 'center')
    // 中心 2/7 是字符中心 'b'（len 1）；中心 3/7 是 gap(1,2) 'b'=='b' → "bb"
    const gap1 = centers[3]
    expect(gap1.centerType).toBe('gap')
    expect(gap1.ci).toBe(1)
    expect(gap1.pal).toBe('bb')
    expect(gap1.bestUpdated).toBe(true)
    expect(steps[steps.length - 1].bestLen).toBe(2)
  })

  it('"abba" → "abba"：间隙中心 + 两侧继续扩展', () => {
    const steps = buildLongestPalSteps({ s: 'abba' })
    const done = steps[steps.length - 1]
    expect(done.bestLen).toBe(4)
    expect(done.bestL).toBe(0)
    expect(done.bestR).toBe(3)
    // 只有偶数中心能构成全串回文 —— 若只枚举字符中心，答案会是 "a" 或 "b"（len 1）
    const centers = steps.filter((s) => s.phase === 'center')
    const charMax = Math.max(...centers.filter((c) => c.centerType === 'char').map((c) => c.len))
    expect(charMax).toBe(1)
  })

  it('"ac" → "a"：无任何回文时返回单字符（先到先得）', () => {
    const steps = buildLongestPalSteps({ s: 'ac' })
    const done = steps[steps.length - 1]
    expect(done.bestLen).toBe(1)
    expect(done.bestL).toBe(0)
  })

  it('"aaaa" → "aaaa"：连续相同字符，字符与间隙中心都要顶到边界', () => {
    const steps = buildLongestPalSteps({ s: 'aaaa' })
    const done = steps[steps.length - 1]
    expect(done.bestLen).toBe(4)
    expect(done.bestL).toBe(0)
    expect(done.bestR).toBe(3)
  })

  it('emoji 输入：Array.from 拆字符不拆代理对', () => {
    const steps = buildLongestPalSteps({ s: '🚀🚀ab🚀ba' })
    const done = steps[steps.length - 1]
    expect(done.bestLen).toBe(5)
    expect(done.chars.length).toBe(7) // 不是 UTF-16 码元的 10
    expect(done.chars.slice(done.bestL, done.bestR + 1).join('')).toBe('ab🚀ba')
  })

  it('中心总数恒为 2n-1（含 done 前的所有 center 帧）', () => {
    for (const str of CASES) {
      const steps = buildLongestPalSteps({ s: str })
      const n = Array.from(str).length
      expect(steps.filter((s) => s.phase === 'center').length).toBe(2 * n - 1)
    }
  })
})
