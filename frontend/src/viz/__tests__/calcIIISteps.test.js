/**
 * calcIIISteps.test.js — LC 772「基本计算器 III」状态机单测。
 *
 * 交叉验证：双栈调度场 vs 独立参考解（带优先级的递归下降）。
 * 逐帧钉死：每个 apply 自洽（res === a op b）、**回放一致**（上一帧栈 + 本帧动作
 * 必须精确得到本帧栈）、operator 帧的优先级纪律、每层括号内 ops 栈形严格递增、
 * flush 帧排空。除法向零截断专例（trunc vs floor 的分水岭）。
 */
import { describe, it, expect } from 'vitest'
import { buildCalcIIISteps, tokenizeCalcIII } from '../calcIIISteps.js'

const PREC = { '+': 1, '-': 1, '*': 2, '/': 2 }
const calc = (a, op, b) =>
  op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : Math.trunc(a / b)

// 参考解：expr := term (('+'|'-') term)*；term := factor (('*'|'/') factor)*（向零截断）
const ref772 = (s) => {
  let i = 0
  const skip = () => { while (s[i] === ' ') i += 1 }
  const parseExpr = () => {
    let v = parseTerm()
    for (;;) {
      skip()
      if (s[i] === '+') { i += 1; v += parseTerm() }
      else if (s[i] === '-') { i += 1; v -= parseTerm() }
      else return v
    }
  }
  const parseTerm = () => {
    let v = parseFactor()
    for (;;) {
      skip()
      if (s[i] === '*') { i += 1; v *= parseFactor() }
      else if (s[i] === '/') { i += 1; v = Math.trunc(v / parseFactor()) }
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
  null, // 默认 '2*(5+5*2)/3+(6/2+8)' → 21
  '2+3*4', // 优先级：乘法先结算 → 14
  '14-3*2', // 8
  '10/3/2', // 左结合：(10/3)/2 = 1
  '2*(3-5)', // 负中间值 → -4
  '1-(2+3*4)', // -13
  '0',
  '7',
  '2/2+3*3-4/2', // 1 + 9 - 2 = 8
  '(3-5)/2*3', // -3
  '1+2*3-4/2+5', // 10
  '100/(2+3)/2', // 10
  '8-8/4', // 6
  ' 2 * ( 5 + 5 * 2 ) / 3 + ( 6 / 2 + 8 ) ', // 带空格的官方示例
]

describe('calcIIISteps（LC 772）', () => {
  it.each(CASES)('最终结果与递归下降参考解一致：%s', (expr) => {
    const steps = buildCalcIIISteps(expr == null ? {} : { expr })
    const done = steps[steps.length - 1]
    expect(done.phase).toBe('done')
    expect(done.result).toBe(ref772(expr ?? '2*(5+5*2)/3+(6/2+8)'))
  })

  it.each(CASES)('逐帧回放 + 优先级 + 栈形不变量：%s', (expr) => {
    const e = expr ?? '2*(5+5*2)/3+(6/2+8)'
    const steps = buildCalcIIISteps({ expr: e })
    for (let f = 1; f < steps.length; f += 1) {
      const fr = steps[f]
      const prev = steps[f - 1]
      // 回放：上一帧栈 + applies + 本帧动作 === 本帧栈
      let n = prev.nums.slice()
      let o = prev.ops.slice()
      for (const ap of fr.applies) {
        expect(ap.res).toBe(calc(ap.a, ap.op, ap.b))
        expect(o.pop()).toBe(ap.op)
        expect(n.pop()).toBe(ap.b)
        expect(n.pop()).toBe(ap.a)
        n.push(ap.res)
      }
      if (fr.phase === 'number') n.push(fr.value)
      if (fr.phase === 'open') o.push('(')
      if (fr.phase === 'operator') {
        expect(fr.pushedOp).toBe(fr.token)
        o.push(fr.pushedOp)
      }
      if (fr.phase === 'close') {
        expect(o.pop()).toBe('(')
      }
      expect(n).toEqual(fr.nums)
      expect(o).toEqual(fr.ops)

      // 优先级纪律（operator 帧）
      if (fr.phase === 'operator') {
        for (const ap of fr.applies) {
          expect(PREC[ap.op]).toBeGreaterThanOrEqual(PREC[fr.token])
        }
        const below = fr.ops[fr.ops.length - 2]
        if (below && below !== '(') {
          expect(PREC[below]).toBeLessThan(PREC[fr.token])
        }
      }
      // 栈形：每层括号内（相邻 '(' 之间的段）从底到顶严格递增
      let seg = []
      const checkSeg = () => {
        for (let k = 1; k < seg.length; k += 1) {
          expect(PREC[seg[k - 1]]).toBeLessThan(PREC[seg[k]])
        }
        seg = []
      }
      for (const x of fr.ops) {
        if (x === '(') checkSeg()
        else seg.push(x)
      }
      checkSeg()
    }
  })

  it('默认表达式：22 帧（init + 19 token + flush + done），答案 21', () => {
    const steps = buildCalcIIISteps()
    expect(steps).toHaveLength(22)
    expect(steps[0].phase).toBe('init')
    expect(steps.at(-2).phase).toBe('flush')
    expect(steps.at(-1).result).toBe(21)
  })

  it('flush 帧排空：ops 为空、nums 恰剩 1', () => {
    for (const expr of CASES.filter(Boolean)) {
      const steps = buildCalcIIISteps({ expr })
      const flush = steps.at(-2)
      expect(flush.phase).toBe('flush')
      expect(flush.ops).toEqual([])
      expect(flush.nums).toHaveLength(1)
    }
  })

  it('结算次数守恒：applies 总数 === 运算符总数', () => {
    for (const expr of CASES.filter(Boolean)) {
      const steps = buildCalcIIISteps({ expr })
      const nApply = steps.reduce((s, f) => s + f.applies.length, 0)
      const nOp = steps[0].tokens.filter((t) => t in PREC).length
      expect(nApply).toBe(nOp)
    }
  })

  it('除法向零截断：(1-4)/2 = -1（floor 会错给 -2）', () => {
    const steps = buildCalcIIISteps({ expr: '(1-4)/2' })
    expect(steps.at(-1).result).toBe(-1)
    expect(Math.floor(-3 / 2)).toBe(-2) // 反例锚点：floor 是坑
  })

  it('同级左结合：10-2-3 先结 10-2，10/3/2 先结 10/3', () => {
    const s1 = buildCalcIIISteps({ expr: '10-2-3' })
    const opFrame = s1.find((f) => f.phase === 'operator' && f.token === '-')
    const second = s1.filter((f) => f.phase === 'operator')[1]
    expect(second.applies).toHaveLength(1)
    expect(second.applies[0]).toEqual({ a: 10, op: '-', b: 2, res: 8 })
    const s2 = buildCalcIIISteps({ expr: '10/3/2' })
    const flush = s2.at(-2)
    expect(flush.applies[0].res).toBe(1)
    expect(s2.at(-1).result).toBe(1)
    expect(opFrame).toBeTruthy()
  })

  it('括号挡板：open 后的运算符帧不结算括号外的内容', () => {
    const steps = buildCalcIIISteps({ expr: '2*(3+4)' })
    const plus = steps.find((f) => f.phase === 'operator' && f.token === '+')
    expect(plus.applies).toHaveLength(0) // '*' 被 '(' 挡住
    expect(plus.ops).toEqual(['*', '(', '+'])
  })

  it('tokenize：空格丢弃、多位数合成、四则与括号单列', () => {
    expect(tokenizeCalcIII(' 23 *(4+5) /2 ')).toEqual(['23', '*', '(', '4', '+', '5', ')', '/', '2'])
  })

  it('所有帧共享同一份 tokens / expr', () => {
    const steps = buildCalcIIISteps({ expr: '2*3' })
    for (const fr of steps) {
      expect(fr.expr).toBe('2*3')
      expect(fr.tokens).toEqual(['2', '*', '3'])
    }
  })
})
