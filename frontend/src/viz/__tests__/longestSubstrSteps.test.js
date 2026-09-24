import { describe, expect, it } from 'vitest'
import { buildLongestSubstrSteps } from '../longestSubstrSteps'

// 演示串（和状态机默认值、文章正文逐字一致）：
//   "abcabcbb"  →  3（"abc"）
const DEMO = 'abcabcbb'

const final = (values, opts = {}) => buildLongestSubstrSteps({ values, ...opts }).at(-1)

/** 独立参考解一：教科书滑动窗口（set + while 收缩）—— 和状态机的"跳跃版"完全不同的实现路径。 */
function refBySet(s) {
  const chars = Array.from(s)
  let left = 0
  let ans = 0
  const win = new Set()
  for (let right = 0; right < chars.length; right += 1) {
    while (win.has(chars[right])) {
      win.delete(chars[left])
      left += 1
    }
    win.add(chars[right])
    ans = Math.max(ans, right - left + 1)
  }
  return ans
}

/** 独立参考解二：暴力枚举所有子串。 */
function refByBrute(s) {
  const chars = Array.from(s)
  let best = 0
  for (let i = 0; i < chars.length; i += 1) {
    const seen = new Set()
    for (let j = i; j < chars.length; j += 1) {
      if (seen.has(chars[j])) break
      seen.add(chars[j])
      best = Math.max(best, j - i + 1)
    }
  }
  return best
}

/**
 * 「漏掉 >= left 判据」的错误写法 —— 专门用来证明那个条件不能省。
 * 本题文章的核心反例就建立在这个对照上。
 */
function buggyNoGuard(s) {
  const chars = Array.from(s)
  const last = {}
  let left = 0
  let ans = 0
  for (let right = 0; right < chars.length; right += 1) {
    const ch = chars[right]
    if (last[ch] !== undefined) left = last[ch] + 1 // ❌ 无条件，left 会倒退
    last[ch] = right
    ans = Math.max(ans, right - left + 1)
  }
  return ans
}

const INPUTS = [
  DEMO,
  'bbbbb',
  'pwwkew',
  '',
  ' ',
  'a',
  'au',
  'dvdf',
  'anviaj',
  'abba',
  'abcba',
  'abcdefg',
  'abacabadabacaba',
  'tmmzuxt',
  'ohvhjdml',
  'aab',
  'abb',
  'aaabbbccc',
  '1234567890',
  'abbaabba',
  'abcdeafgh',
  'aa',
  'aba',
]

describe('longestSubstrSteps — 主流程（LC 3 官方例 "abcabcbb"）', () => {
  it('答案是 3', () => {
    const last = final(DEMO)
    expect(last.phase).toBe('done')
    expect(last.done).toBe(true)
    expect(last.ans).toBe(3)
  })

  it('10 帧（init + 8 个字符 + done）', () => {
    expect(buildLongestSubstrSteps({ values: DEMO })).toHaveLength(10)
  })

  it('第一帧是 init、right 还没动', () => {
    const first = buildLongestSubstrSteps({ values: DEMO })[0]
    expect(first.phase).toBe('init')
    expect(first.right).toBe(-1)
    expect(first.ans).toBe(0)
    expect(first.lastSeen).toEqual({})
  })

  it('前 3 步是 expand（abc 都是新字符），之后 5 步全是 slide', () => {
    const phases = buildLongestSubstrSteps({ values: DEMO }).map((s) => s.phase)
    expect(phases).toEqual([
      'init',
      'expand',
      'expand',
      'expand',
      'slide',
      'slide',
      'slide',
      'slide',
      'slide',
      'done',
    ])
  })

  it('第 4 步（下标 3 的 a）left 从 0 跳到 1', () => {
    const steps = buildLongestSubstrSteps({ values: DEMO })
    const s = steps[4]
    expect(s.phase).toBe('slide')
    expect(s.right).toBe(3)
    expect(s.ch).toBe('a')
    expect(s.hitIdx).toBe(0)
    expect(s.prevLeft).toBe(0)
    expect(s.left).toBe(1)
  })

  it('最优窗口是 [0, 2] = "abc"', () => {
    const last = final(DEMO)
    expect(last.bestRange).toEqual([0, 2])
    expect(Array.from(DEMO).slice(0, 3).join('')).toBe('abc')
  })
})

describe('longestSubstrSteps — 核心不变量：left 单调不减', () => {
  it('left 每一步都不会变小（含收尾帧）', () => {
    // ⚠️ 这是本题的灵魂：左指针一旦倒退，"窗口内无重复"的不变量立刻破掉。
    // 这里能**不排除 done 帧**，是因为状态机的收尾帧刻意保留了 left 的真实值 ——
    // 最优窗口由 bestRange 单独表达，交给渲染层去画（见 longestSubstrSteps.js 末尾注释）。
    for (const s of INPUTS) {
      let prev = 0
      for (const st of buildLongestSubstrSteps({ values: s })) {
        expect(st.left).toBeGreaterThanOrEqual(prev)
        prev = st.left
      }
    }
  })

  it('slide 帧里 left 一定变大了（否则就不该叫 slide）', () => {
    for (const s of INPUTS) {
      for (const st of buildLongestSubstrSteps({ values: s })) {
        if (st.phase !== 'slide') continue
        expect(st.left).toBeGreaterThan(st.prevLeft)
      }
    }
  })

  it('left 永远不超过 right + 1', () => {
    for (const s of INPUTS) {
      for (const st of buildLongestSubstrSteps({ values: s })) {
        if (st.right < 0) continue
        expect(st.left).toBeLessThanOrEqual(st.right + 1)
      }
    }
  })
})

describe('longestSubstrSteps — 核心不变量：窗口内永远没有重复字符', () => {
  it('每一帧的窗口 [left, right] 里，字符两两不同', () => {
    // 这条是滑动窗口正确性的定义性断言 —— 任何一帧窗口里出现重复，
    // 都说明 left 该跳而没跳（或者跳错了）。
    for (const s of INPUTS) {
      const chars = Array.from(s)
      for (const st of buildLongestSubstrSteps({ values: s })) {
        if (st.right < 0) continue
        const inner = chars.slice(st.left, st.right + 1)
        expect(new Set(inner).size).toBe(inner.length)
      }
    }
  })

  it('窗口内的每个字符，在 lastSeen 里都指向窗口内的位置', () => {
    for (const s of INPUTS) {
      const chars = Array.from(s)
      for (const st of buildLongestSubstrSteps({ values: s })) {
        if (st.right < 0) continue
        // 收尾帧的窗口是 [left, n-1]，lastSeen 也是最终状态，两者时间点一致 —— 所以不用排除
        for (let i = st.left; i <= st.right; i += 1) {
          expect(st.lastSeen[chars[i]]).toBeGreaterThanOrEqual(st.left)
          expect(st.lastSeen[chars[i]]).toBeLessThanOrEqual(st.right)
        }
      }
    }
  })
})

describe('longestSubstrSteps — ans 与 bestRange', () => {
  it('ans 单调不减', () => {
    for (const s of INPUTS) {
      let prev = 0
      for (const st of buildLongestSubstrSteps({ values: s })) {
        expect(st.ans).toBeGreaterThanOrEqual(prev)
        prev = st.ans
      }
    }
  })

  it('windowLen 恒等于 right - left + 1', () => {
    for (const s of INPUTS) {
      for (const st of buildLongestSubstrSteps({ values: s })) {
        if (st.right < 0) continue
        expect(st.windowLen).toBe(st.right - st.left + 1)
      }
    }
  })

  it('ans 恒等于到目前为止见过的最大 windowLen', () => {
    // 注意别写成 `expect(st.ans).toBe(Math.max(best, st.ans))` —— 那是循环论证，
    // 拿 st.ans 自己校验自己，永远为真。必须用**独立累积的 best** 去比。
    for (const s of INPUTS) {
      let best = 0
      for (const st of buildLongestSubstrSteps({ values: s })) {
        if (st.right >= 0) best = Math.max(best, st.windowLen)
        expect(st.ans).toBe(best)
      }
      expect(final(s).ans).toBe(refBySet(s))
    }
  })

  it('bestRange 的字符无重复，且长度等于 ans', () => {
    for (const s of INPUTS) {
      const chars = Array.from(s)
      const last = final(s)
      if (last.bestRange === null) {
        expect(last.ans).toBe(0)
        continue
      }
      const [l, r] = last.bestRange
      const inner = chars.slice(l, r + 1)
      expect(new Set(inner).size).toBe(inner.length)
      expect(inner.length).toBe(last.ans)
    }
  })

  it('bestRange 只在 ans 被刷新时改（ans 不变则区间不动）', () => {
    for (const s of INPUTS) {
      const steps = buildLongestSubstrSteps({ values: s })
      let prevAns = 0
      let prevRange = null
      for (const st of steps) {
        const rangeKey = st.bestRange ? st.bestRange.join(',') : null
        if (st.ans === prevAns) {
          expect(rangeKey).toBe(prevRange)
        } else {
          expect(st.ans).toBeGreaterThan(prevAns)
          prevAns = st.ans
          prevRange = rangeKey
        }
      }
    }
  })
})

describe('longestSubstrSteps — lastSeen 的维护', () => {
  it('每一步（非 init/done）之后，当前字符的位置都被更新成 right', () => {
    for (const s of INPUTS) {
      const chars = Array.from(s)
      for (const st of buildLongestSubstrSteps({ values: s })) {
        if (st.right < 0 || st.phase === 'done') continue
        expect(st.lastSeen[chars[st.right]]).toBe(st.right)
      }
    }
  })

  it('lastSeen 里的每个位置都不超过当前 right', () => {
    for (const s of INPUTS) {
      for (const st of buildLongestSubstrSteps({ values: s })) {
        if (st.right < 0) continue
        for (const v of Object.values(st.lastSeen)) {
          expect(v).toBeLessThanOrEqual(st.right)
        }
      }
    }
  })

  it('lastSeen 的键集合 = 已出现过的字符集合', () => {
    for (const s of INPUTS) {
      const chars = Array.from(s)
      for (const st of buildLongestSubstrSteps({ values: s })) {
        if (st.right < 0) continue
        // 状态机保证收尾帧的 right 是 n-1（真实值），所以这里也不需要排除 done
        const seen = new Set(chars.slice(0, st.right + 1))
        expect(new Set(Object.keys(st.lastSeen))).toEqual(seen)
      }
    }
  })

  it('lastSeen 的键数不超过字符集大小', () => {
    for (const s of INPUTS) {
      expect(Object.keys(final(s).lastSeen).length).toBeLessThanOrEqual(new Set(Array.from(s)).size)
    }
  })
})

describe('longestSubstrSteps — 回归：判据必须是「位置还在窗口内」', () => {
  // ⚠️ 一组回归测试。「漏掉 >= left 判断、只要出现过就把 left 挪过去」
  // 是这道题最经典的错误写法 —— `left` 会倒退，窗口里重新混进已经排除的字符。
  it('"abba" 的最后一帧是 expand 而不是 slide（a 的旧位置已在窗口外）', () => {
    const steps = buildLongestSubstrSteps({ values: 'abba' })
    const last = steps.at(-2) // 帧 4，下标 3 的 'a'
    expect(last.right).toBe(3)
    expect(last.ch).toBe('a')
    expect(last.outsideWindow).toBe(true) // ← 出现过，但在窗口左边之外
    expect(last.hitIdx).toBe(0) // 旧位置是 0
    expect(last.left).toBe(2) // 而 left 已经是 2 —— 所以不算重复，left 原地不动
    expect(last.phase).toBe('expand')
  })

  it('"abba" 的答案是 2，而漏掉判据的写法会错答 3', () => {
    expect(final('abba').ans).toBe(2)
    expect(refBySet('abba')).toBe(2)
    expect(buggyNoGuard('abba')).toBe(3) // ← 证明那个判据不能省
  })

  it('一组「漏判据就会错」的反例，正确实现全部与参考解一致', () => {
    const BAD_CASES = ['abba', 'abcba', 'abbaabba', 'dvdf', 'abacabadabacaba']
    for (const s of BAD_CASES) {
      expect(final(s).ans).toBe(refBySet(s))
    }
    // 至少要对 abba / abcba / abbaabba 这三个确实会错，回归才有意义
    expect(buggyNoGuard('abba')).not.toBe(refBySet('abba'))
    expect(buggyNoGuard('abcba')).not.toBe(refBySet('abcba'))
    expect(buggyNoGuard('abbaabba')).not.toBe(refBySet('abbaabba'))
  })

  it('outsideWindow 只在这种情况下为 true：出现过、且位置在 left 左边', () => {
    for (const s of INPUTS) {
      const chars = Array.from(s)
      for (const st of buildLongestSubstrSteps({ values: s })) {
        if (!st.outsideWindow) continue
        expect(st.hitIdx).not.toBeNull()
        expect(st.hitIdx).toBeLessThan(st.left)
        expect(chars[st.hitIdx]).toBe(st.ch)
      }
    }
  })
})

describe('longestSubstrSteps — 与两个独立参考解三向交叉', () => {
  it.each(INPUTS.map((s) => ({ s })))('$s 与 set 版 / 暴力版一致', ({ s }) => {
    const got = final(s).ans
    expect(got).toBe(refBySet(s))
    expect(got).toBe(refByBrute(s))
  })

  it('主例的答案能被暴力版复现', () => {
    expect(final(DEMO).ans).toBe(refByBrute(DEMO))
  })

  it('长串也能对上（200 个字符的周期性串）', () => {
    const long = 'abcdefghij'.repeat(20)
    expect(final(long).ans).toBe(refBySet(long))
    expect(final(long).ans).toBe(10)
  })

  it('长串（含大量重复）', () => {
    const long = 'aabbccddeeffgghhiijj'.repeat(5)
    expect(final(long).ans).toBe(refBySet(long))
    expect(final(long).ans).toBe(2)
  })
})

describe('longestSubstrSteps — 边界情况', () => {
  it('空串只有一帧 done、答案是 0', () => {
    const steps = buildLongestSubstrSteps({ values: '' })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].ans).toBe(0)
    expect(steps[0].bestRange).toBeNull()
  })

  it('空串不会被默认值顶掉（守卫用的是 typeof 而不是 ||）', () => {
    // 如果守卫写成 options.values || 'abcabcbb'，空串会被换成默认串
    expect(buildLongestSubstrSteps({ values: '' }).at(-1).ans).toBe(0)
  })

  it('单字符 → 1', () => {
    expect(final('a').ans).toBe(1)
    expect(final('a').bestRange).toEqual([0, 0])
  })

  it('空格也是一个正常字符', () => {
    expect(final(' ').ans).toBe(1)
    expect(final('a b').ans).toBe(3)
  })

  it('全相同字符 → 1', () => {
    expect(final('bbbbb').ans).toBe(1)
    expect(final('aaaaaaaa').ans).toBe(1)
  })

  it('全不相同字符 → 字符串长度', () => {
    expect(final('abcdefg').ans).toBe(7)
    expect(final('1234567890').ans).toBe(10)
  })

  it('两个字符相同 → 1（不是 2）', () => {
    expect(final('aa').ans).toBe(1)
  })

  it('官方第二例 "bbbbb" → 1', () => {
    expect(final('bbbbb').ans).toBe(1)
  })

  it('官方第三例 "pwwkew" → 3', () => {
    expect(final('pwwkew').ans).toBe(3)
    expect(final('pwwkew').bestRange).toEqual([2, 4])
  })

  it('emoji / 非 BMP 字符按"一个字"算，不会被拆成两半', () => {
    // ⚠️ 用 s.split('') 或 s[i] 会按 UTF-16 码元切，把 emoji 拆成两个代理项，
    // 于是"两个不同的字符"被算成两个不同字符 —— 答案会偏大。
    const s = '😀😀'
    expect(final(s).ans).toBe(1)
    const step = buildLongestSubstrSteps({ values: s })
    expect(step).toHaveLength(4) // init + 2 字符 + done
    expect(step.at(-1).ans).toBe(1)
  })

  it('emoji 混普通字符', () => {
    const s = 'a😀b'
    expect(final(s).ans).toBe(3)
    expect(buildLongestSubstrSteps({ values: s }).at(-1).ans).toBe(refBySet(s))
  })

  it('maxSteps 截断不会死循环', () => {
    const steps = buildLongestSubstrSteps({ values: DEMO, maxSteps: 3 })
    expect(steps.length).toBeLessThanOrEqual(5)
    expect(steps.at(-1).phase).toBe('done')
  })
})

describe('longestSubstrSteps — 帧结构', () => {
  it('每帧都有必需字段', () => {
    for (const st of buildLongestSubstrSteps({ values: DEMO })) {
      expect(st).toHaveProperty('phase')
      expect(st).toHaveProperty('desc')
      expect(typeof st.desc).toBe('string')
      expect(st.desc.length).toBeGreaterThan(0)
      expect(typeof st.left).toBe('number')
      expect(typeof st.ans).toBe('number')
      expect(st).toHaveProperty('lastSeen')
      expect(typeof st.done).toBe('boolean')
    }
  })

  it('最后一帧一定是 done', () => {
    for (const s of INPUTS) {
      const last = buildLongestSubstrSteps({ values: s }).at(-1)
      expect(last.phase).toBe('done')
      expect(last.done).toBe(true)
    }
  })

  it('phase 只出现在允许的集合里', () => {
    const ALLOWED = new Set(['init', 'expand', 'slide', 'done'])
    for (const s of INPUTS) {
      for (const st of buildLongestSubstrSteps({ values: s })) {
        expect(ALLOWED.has(st.phase)).toBe(true)
      }
    }
  })

  it('desc 里的 ** 成对出现（markdown 安全）', () => {
    for (const s of INPUTS) {
      for (const st of buildLongestSubstrSteps({ values: s })) {
        expect(((st.desc.match(/\*\*/g) || []).length) % 2).toBe(0)
      }
    }
  })

  it('合法输入下首尾帧结构一致（空串例外：它只有一帧 done）', () => {
    for (const s of INPUTS) {
      const steps = buildLongestSubstrSteps({ values: s })
      if (s.length === 0) {
        expect(steps).toHaveLength(1)
        expect(steps[0].phase).toBe('done')
        continue
      }
      expect(steps[0].phase).toBe('init')
      expect(steps.at(-1).phase).toBe('done')
    }
  })

  it('非空串的帧数 = 字符数 + 2（init + 每字符一帧 + done）', () => {
    for (const s of INPUTS) {
      if (s.length === 0) continue
      expect(buildLongestSubstrSteps({ values: s })).toHaveLength(Array.from(s).length + 2)
    }
  })

  it('right 从 -1 一路递增到 n-1（done 帧除外）', () => {
    for (const s of INPUTS) {
      if (s.length === 0) continue
      const n = Array.from(s).length
      const rs = buildLongestSubstrSteps({ values: s })
        .filter((st) => st.phase !== 'done')
        .map((st) => st.right)
      expect(rs).toEqual([-1, ...Array.from({ length: n }, (_, i) => i)])
    }
  })
})
