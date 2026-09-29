/**
 * bracketsSteps.test.js — LC 20「有效的括号」状态机单测。
 *
 * 交叉验证：状态机 vs 栈+映射表参考解 vs 反复消除相邻配对参考解
 * （完全不同构的第三种写法）。三种失败模式各钉一例。
 */
import { describe, it, expect } from 'vitest'
import { buildBracketsSteps } from '../bracketsSteps.js'

const PAIRS = { '(': ')', '[': ']', '{': '}' }
const OPENS = new Set(Object.keys(PAIRS))

const refStack = (s) => {
  const st = []
  for (const ch of Array.from(s)) {
    if (OPENS.has(ch)) st.push(ch)
    else {
      if (st.length === 0) return false
      if (PAIRS[st[st.length - 1]] !== ch) return false
      st.pop()
    }
  }
  return st.length === 0
}

const refReduce = (s) => {
  let cur = s
  let changed = true
  while (changed) {
    changed = false
    for (const [o, c] of [['()', ''], ['[]', ''], ['{}', '']]) {
      const nxt = cur.split(o).join(c)
      if (nxt !== cur) {
        cur = nxt
        changed = true
      }
    }
  }
  return cur === ''
}

const CASES = [
  '{[()]}',
  '()',
  '()[]{}',
  '(]',
  '([)]',
  '{[]}',
  '(',
  ']',
  '())',
  '(()',
  '',
  '((((',
  '([{}])',
  '{[}',
  '[({})]',
]

describe('buildBracketsSteps — 结果正确性（两参考解交叉）', () => {
  for (const s of CASES) {
    it(`"${s}"`, () => {
      const steps = buildBracketsSteps({ s })
      const done = steps[steps.length - 1]
      const valid = done.verdict === 'valid'
      expect(valid).toBe(refStack(s))
      expect(valid).toBe(refReduce(s))
    })
  }
})

describe('buildBracketsSteps — 主例帧结构', () => {
  const steps = buildBracketsSteps({ s: '{[()]}' })
  const pushes = steps.filter((s) => s.phase === 'push')
  const matches = steps.filter((s) => s.phase === 'match')

  it('init + 3 push + 3 match + done = 8 帧', () => {
    expect(steps.length).toBe(8)
    expect(pushes.length).toBe(3)
    expect(matches.length).toBe(3)
    expect(steps[7].phase).toBe('done')
  })

  it('主例 {[()]} 有效', () => {
    expect(steps[7].verdict).toBe('valid')
  })

  it('push 帧：栈里只有左括号，expect 为 null', () => {
    for (const f of pushes) {
      expect(f.expect).toBeNull()
      for (const c of f.stack) expect(OPENS.has(c)).toBe(true)
    }
  })

  it('match 帧：popped 与当前字符配对，栈深递减 3 → 2 → 1 → 0', () => {
    const depths = matches.map((f) => f.stack.length)
    expect(depths).toEqual([2, 1, 0])
    for (const f of matches) {
      expect(PAIRS[f.popped]).toBe(f.ch)
      expect(f.expect).toBe(f.ch)
    }
  })

  it('最后一个 match 帧后栈恰好为空', () => {
    expect(matches[2].stack).toEqual([])
  })
})

describe('buildBracketsSteps — 逐帧不变量（所有用例）', () => {
  for (const s of CASES) {
    it(`"${s}"：栈里只可能有左括号 + 配对关系正确 + 提前失败后立即 done`, () => {
      const steps = buildBracketsSteps({ s })
      let sawFail = false
      for (const fr of steps) {
        for (const c of fr.stack) {
          expect(OPENS.has(c)).toBe(true)
        }
        if (fr.phase === 'match') {
          expect(PAIRS[fr.popped]).toBe(fr.ch)
        }
        if (fr.phase === 'mismatch') {
          expect(fr.expect).not.toBe(fr.ch)
        }
        if (fr.phase === 'unmatched') {
          expect(fr.stack.length).toBe(0)
        }
        if (fr.verdict !== null && fr.verdict !== 'valid') sawFail = true
        if (sawFail && fr.phase !== 'done') {
          expect(fr.verdict).not.toBeNull()
        }
      }
      const done = steps[steps.length - 1]
      expect(done.phase).toBe('done')
      // 方向性断言：valid → 栈必空；leftover → 栈必非空。
      // ⚠️ 不能写成"栈空 iff valid"—— unmatched 失败时栈也是空的（栈空只是必要条件）
      if (done.verdict === 'valid') expect(done.stack.length).toBe(0)
      if (done.verdict === 'leftover') expect(done.stack.length).toBeGreaterThan(0)
    })
  }
})

describe('buildBracketsSteps — 三种失败模式各钉一例', () => {
  it('失败模式一：类型不匹配（"(]" 与 "([)]"）', () => {
    const s1 = buildBracketsSteps({ s: '(]' })
    expect(s1[s1.length - 1].verdict).toBe('mismatch')
    const s2 = buildBracketsSteps({ s: '([)]' })
    // 第 4 个字符 ) 撞上栈顶 [
    const mm = s2.find((f) => f.phase === 'mismatch')
    expect(mm.i).toBe(2)
    expect(mm.ch).toBe(')')
    expect(mm.stack).toEqual(['(', '['])
    expect(s2[s2.length - 1].verdict).toBe('mismatch')
  })

  it('失败模式二：右括号没人接（"())" 的最后一个 )）', () => {
    const steps = buildBracketsSteps({ s: '())' })
    const un = steps.find((f) => f.phase === 'unmatched')
    expect(un.i).toBe(2)
    expect(un.ch).toBe(')')
    expect(un.stack).toEqual([])
    expect(steps[steps.length - 1].verdict).toBe('unmatched')
  })

  it('失败模式三：左括号没闭合（"(()" 剩一个 (）', () => {
    const steps = buildBracketsSteps({ s: '(()' })
    const done = steps[steps.length - 1]
    expect(done.verdict).toBe('leftover')
    expect(done.stack).toEqual(['('])
  })

  it('空串：有效（循环不进，栈天然为空）', () => {
    const steps = buildBracketsSteps({ s: '' })
    expect(steps.length).toBe(2)
    expect(steps[1].verdict).toBe('valid')
  })

  it('单字符："(" leftover、"]" unmatched', () => {
    const a = buildBracketsSteps({ s: '(' })
    expect(a[a.length - 1].verdict).toBe('leftover')
    const b = buildBracketsSteps({ s: ']' })
    expect(b[b.length - 1].verdict).toBe('unmatched')
  })

  it('"(((("：全 push 后 leftover，栈深 4', () => {
    const steps = buildBracketsSteps({ s: '((((' })
    const done = steps[steps.length - 1]
    expect(done.verdict).toBe('leftover')
    expect(done.stack).toEqual(['(', '(', '(', '('])
  })

  it('不修改输入（s/chars 字段全程保持）', () => {
    const steps = buildBracketsSteps({ s: '{[()]}' })
    for (const f of steps) {
      expect(f.s).toBe('{[()]}')
      expect(f.chars).toEqual(['{', '[', '(', ')', ']', '}'])
    }
  })
})
