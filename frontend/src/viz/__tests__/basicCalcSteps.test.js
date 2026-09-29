/**
 * basicCalcSteps.test.js — LC 224「基本计算器」状态机单测。
 *
 * 交叉验证：状态机（sign + 括号上下文栈）vs 独立参考解（递归下降，实现路径完全不同）。
 * 逐帧钉死：number 结算自洽、sign 帧不动 result、open 重启 + 压栈、close 合并 + 弹栈、
 * open/close 的 LIFO 配对、括号深度全程 >= 0 且收尾为 0。
 */
import { describe, it, expect } from 'vitest'
import { buildBasicCalcSteps, tokenizeCalc } from '../basicCalcSteps.js'

// 参考解：递归下降 expr := factor (('+'|'-') factor)*，factor := 数字 | '(' expr ')'
const ref224 = (s) => {
  let i = 0
  const skip = () => { while (s[i] === ' ') i += 1 }
  const parseExpr = () => {
    let v = parseFactor()
    for (;;) {
      skip()
      if (s[i] === '+') { i += 1; v += parseFactor() }
      else if (s[i] === '-') { i += 1; v -= parseFactor() }
      else return v
    }
  }
  const parseFactor = () => {
    skip()
    if (s[i] === '(') { i += 1; const v = parseExpr(); skip(); i += 1; return v }
    let j = i
    while (j < s.length && s[j] >= '0' && s[j] <= '9') j += 1
    const v = Number(s.slice(i, j))
    i = j
    return v
  }
  return parseExpr()
}

const CASES = [
  null, // 默认 '1 + 2 - (3 + 4) - 5' → -9
  '1+1',
  ' 2-1 + 2 ',
  '(1+(4+5+2)-3)+(6+8)', // LeetCode 官方示例 → 23
  '0',
  '42',
  '1-(2+3)', // 括号前负号 → -4
  '(1)', // 单层空操作
  '1-11', // 多位数不被拆散
  '10-(2+(3-4))', // 三层嵌套 → 5
  '((((5))))', // 深嵌套
  '1 + 2 - 3 + 4 - 5', // 无括号纯加减 → -1
]

describe('basicCalcSteps（LC 224）', () => {
  it.each(CASES)('最终结果与递归下降参考解一致：%s', (expr) => {
    const steps = buildBasicCalcSteps(expr == null ? {} : { expr })
    const done = steps[steps.length - 1]
    expect(done.phase).toBe('done')
    expect(done.result).toBe(ref224(expr ?? '1 + 2 - (3 + 4) - 5'))
  })

  it.each(CASES)('逐帧不变量：%s', (expr) => {
    const e = expr ?? '1 + 2 - (3 + 4) - 5'
    const steps = buildBasicCalcSteps({ expr: e })
    let depth = 0
    const opens = []
    for (let f = 1; f < steps.length - 1; f += 1) {
      const fr = steps[f]
      const tok = fr.tokens[fr.pos]
      expect(fr.token).toBe(tok)
      if (fr.phase === 'number') {
        expect(fr.result).toBe(fr.prev + fr.contribution)
        expect(fr.contribution).toBe(fr.sign * fr.value)
        expect(fr.stack.length).toBe(depth)
      } else if (fr.phase === 'sign') {
        expect(fr.result).toBe(fr.prev)
        expect(fr.sign).toBe(tok === '+' ? 1 : -1)
      } else if (fr.phase === 'open') {
        expect(fr.prev).toBe(fr.pushed.result)
        expect(fr.result).toBe(0)
        expect(fr.sign).toBe(1)
        expect(fr.stack.length).toBe(depth + 1)
        expect(fr.stack[depth]).toEqual(fr.pushed)
        depth += 1
        opens.push(fr.pushed)
      } else if (fr.phase === 'close') {
        expect(depth).toBeGreaterThan(0)
        const want = opens.pop()
        depth -= 1
        expect(fr.popped).toEqual(want) // LIFO：弹的必是最近压的
        expect(fr.prev).toBe(fr.inner)
        expect(fr.result).toBe(fr.popped.result + fr.popped.sign * fr.inner)
        expect(fr.stack.length).toBe(depth)
      } else {
        throw new Error(`中间帧出现非法 phase: ${fr.phase}`)
      }
    }
    expect(depth).toBe(0)
    expect(opens.length).toBe(0)
  })

  it('默认表达式：13 帧（init + 11 token + done），答案 -9', () => {
    const steps = buildBasicCalcSteps()
    expect(steps).toHaveLength(13)
    expect(steps[0].phase).toBe('init')
    expect(steps.at(-1).result).toBe(-9)
    expect(steps.map((f) => f.phase)).toEqual([
      'init',
      'number', 'sign', 'number', 'sign', 'open',
      'number', 'sign', 'number', 'close',
      'sign', 'number',
      'done',
    ])
  })

  it('括号上下文栈只在 open/close 帧变化', () => {
    const steps = buildBasicCalcSteps()
    for (let f = 1; f < steps.length; f += 1) {
      const before = steps[f - 1].stack.length
      const after = steps[f].stack.length
      if (steps[f].phase === 'open') expect(after).toBe(before + 1)
      else if (steps[f].phase === 'close') expect(after).toBe(before - 1)
      else expect(after).toBe(before)
    }
  })

  it('tokenize：空格丢弃、连续数字合成一个 token', () => {
    expect(tokenizeCalc(' 12 +3 ')).toEqual(['12', '+', '3'])
    expect(tokenizeCalc('(1-2)')).toEqual(['(', '1', '-', '2', ')'])
    expect(tokenizeCalc('100')).toEqual(['100'])
  })

  it('所有帧共享同一份 tokens / expr', () => {
    const steps = buildBasicCalcSteps({ expr: '1-(2+3)' })
    for (const fr of steps) {
      expect(fr.expr).toBe('1-(2+3)')
      expect(fr.tokens).toEqual(['1', '-', '(', '2', '+', '3', ')'])
    }
  })

  it('init/done 帧不消费 token（pos 为 null）', () => {
    const steps = buildBasicCalcSteps()
    expect(steps[0].pos).toBeNull()
    expect(steps.at(-1).pos).toBeNull()
    for (let f = 1; f < steps.length - 1; f += 1) {
      expect(steps[f].pos).toBe(f - 1)
    }
  })

  it('desc 非空且含关键数值', () => {
    const steps = buildBasicCalcSteps({ expr: '1-(2+3)' })
    const close = steps.find((f) => f.phase === 'close')
    expect(close.desc).toContain('5')
    expect(close.desc).toContain('-4')
  })
})
