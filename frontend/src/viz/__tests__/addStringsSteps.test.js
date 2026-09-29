/**
 * addStringsSteps.test.js — LC 415「字符串相加」状态机单测。
 *
 * 三向交叉：状态机 vs BigInt 参考解（仅测试用，题面禁用但最可信）
 * vs padStart 逐位参考解。逐帧不变量：sum/out/carryOut 自洽、
 * carryIn 接上一帧 carryOut、resLow 尾部 = 本帧 out。
 */
import { describe, it, expect } from 'vitest'
import { buildAddStringsSteps } from '../addStringsSteps.js'

const refBigInt = (a, b) => (BigInt(a) + BigInt(b)).toString()

const refPad = (a, b) => {
  const n = Math.max(a.length, b.length)
  const x = a.padStart(n, '0').split('').map(Number)
  const y = b.padStart(n, '0').split('').map(Number)
  const res = []
  let c = 0
  for (let k = n - 1; k >= 0; k -= 1) {
    const s = x[k] + y[k] + c
    res.push(s % 10)
    c = s >= 10 ? 1 : 0
  }
  if (c > 0) res.push(c)
  return res.reverse().join('')
}

const CASES = [
  ['456', '77'],
  ['0', '0'],
  ['999', '1'],
  ['1', '9999'],
  ['1', '1'],
  ['5', '5'],
  ['9', '9'],
  ['123456789', '987654321'],
  ['100', '0'],
  ['584', '9845'],
  ['99', '99'],
  ['400', '700'],
]

describe('buildAddStringsSteps — 结果正确性（三向交叉）', () => {
  for (const [a, b] of CASES) {
    it(`${a} + ${b}`, () => {
      const steps = buildAddStringsSteps({ num1: a, num2: b })
      const done = steps[steps.length - 1]
      expect(done.phase).toBe('done')
      expect(done.result).toBe(refBigInt(a, b))
      expect(done.result).toBe(refPad(a, b))
    })
  }
})

describe('buildAddStringsSteps — 主例帧结构', () => {
  const steps = buildAddStringsSteps({})
  const digits = steps.filter((s) => s.phase === 'digit')

  it('init → 3 个 digit → done，共 5 帧', () => {
    expect(steps.length).toBe(5)
    expect(steps[0].phase).toBe('init')
    expect(digits.length).toBe(3)
    expect(steps[4].phase).toBe('done')
  })

  it('主例 456 + 77 = 533', () => {
    expect(steps[4].result).toBe('533')
  })

  it('init 帧不含任何计算结果', () => {
    expect(steps[0].resLow).toEqual([])
    expect(steps[0].col).toBe(-1)
  })

  it('done 帧带全渲染层要用的字段', () => {
    const d = steps[4]
    expect(d.result).toBe('533')
    expect(d.resLow).toEqual([3, 3, 5])
    expect(d.num1).toBe('456')
    expect(d.num2).toBe('77')
    expect(d.maxLen).toBe(3)
  })
})

describe('buildAddStringsSteps — 逐帧不变量（所有用例）', () => {
  for (const [a, b] of CASES) {
    it(`${a} + ${b}：sum/out/carryOut 自洽 + carry 链连续 + resLow 尾部`, () => {
      const steps = buildAddStringsSteps({ num1: a, num2: b })
      let prevCarryOut = 0
      for (const s of steps) {
        if (s.phase === 'digit') {
          expect(s.sum).toBe(s.digitA + s.digitB + s.carryIn)
          expect(s.out).toBe(s.sum % 10)
          expect(s.carryOut).toBe(s.sum >= 10 ? 1 : 0)
          expect(s.carryIn).toBe(prevCarryOut)
          expect([0, 1]).toContain(s.carryIn)
          // digitA / digitB 与原串对应位一致（补零侧除外）
          if (s.i >= 0) expect(s.num1[s.i]).toBe(String(s.digitA))
          if (s.j >= 0) expect(s.num2[s.j]).toBe(String(s.digitB))
          if (s.i < 0) expect(s.digitA).toBe(0)
          if (s.j < 0) expect(s.digitB).toBe(0)
          expect(s.resLow[s.resLow.length - 1]).toBe(s.out)
          prevCarryOut = s.carryOut
        }
        if (s.phase === 'digit' || s.phase === 'done') {
          prevCarryOut = s.phase === 'digit' ? s.carryOut : prevCarryOut
        }
      }
    })

    it(`${a} + ${b}：col 单调递减且不越界`, () => {
      const steps = buildAddStringsSteps({ num1: a, num2: b })
      const digits = steps.filter((s) => s.phase === 'digit')
      const maxLen = steps[0].maxLen
      digits.forEach((s, k) => {
        expect(s.col).toBe(maxLen - 1 - k)
        expect(s.col).toBeGreaterThanOrEqual(-1)
      })
    })

    it(`${a} + ${b}：结果无前导零（"0" 除外）`, () => {
      const steps = buildAddStringsSteps({ num1: a, num2: b })
      const done = steps[steps.length - 1]
      if (done.result !== '0') {
        expect(done.result[0]).not.toBe('0')
      }
    })
  }
})

describe('buildAddStringsSteps — 本题特有易错点', () => {
  it('"999" + "1"：连续进位并长出第 4 位（循环条件漏 carry 的经典反例）', () => {
    const steps = buildAddStringsSteps({ num1: '999', num2: '1' })
    const done = steps[steps.length - 1]
    expect(done.result).toBe('1000')
    // 4 个 digit 帧：3 列 + 进位溢出的第 4 列
    expect(steps.filter((s) => s.phase === 'digit').length).toBe(4)
    // 前 3 列 carryOut 全是 1
    const digits = steps.filter((s) => s.phase === 'digit')
    expect(digits[0].carryOut).toBe(1)
    expect(digits[1].carryOut).toBe(1)
    expect(digits[2].carryOut).toBe(1)
    expect(digits[3].carryOut).toBe(0)
  })

  it('"0" + "0"：结果是 "0" 而不是空串或 "00"', () => {
    const steps = buildAddStringsSteps({ num1: '0', num2: '0' })
    const done = steps[steps.length - 1]
    expect(done.result).toBe('0')
    expect(done.resLow).toEqual([0])
  })

  it('长度不等的对齐：补零发生在最高位侧（最后一帧），个位两串都有数', () => {
    const steps = buildAddStringsSteps({ num1: '584', num2: '9845' })
    const digits = steps.filter((s) => s.phase === 'digit')
    // 个位列两串都有数
    expect(digits[0].zeroA).toBe(false)
    expect(digits[0].zeroB).toBe(false)
    // 最高位列（第 4 帧）：num1 只有 3 位，已走完 → 补 0
    expect(digits[3].zeroA).toBe(true)
    expect(digits[3].digitA).toBe(0)
    expect(digits[3].zeroB).toBe(false)
    expect(digits[3].digitB).toBe(9)
  })

  it('等长且无溢出：全程无补零', () => {
    const steps = buildAddStringsSteps({ num1: '123', num2: '456' })
    for (const s of steps) {
      expect(s.zeroA).toBe(false)
      expect(s.zeroB).toBe(false)
    }
  })

  it('等长但溢出（456+771=1227）：溢出帧两侧都补零', () => {
    const steps = buildAddStringsSteps({ num1: '456', num2: '771' })
    const digits = steps.filter((s) => s.phase === 'digit')
    expect(digits.length).toBe(4)
    expect(digits[3].zeroA).toBe(true)
    expect(digits[3].zeroB).toBe(true)
    expect(digits[3].digitA).toBe(0)
    expect(digits[3].digitB).toBe(0)
    expect(digits[3].sum).toBe(1)
  })

  it('不修改输入（num1/num2 字段全程保持原样）', () => {
    const steps = buildAddStringsSteps({ num1: '123', num2: '456' })
    for (const s of steps) {
      expect(s.num1).toBe('123')
      expect(s.num2).toBe('456')
    }
  })

  it('进位链：done 帧 carry 终值为 0（否则还会长出一位）', () => {
    for (const [a, b] of CASES) {
      const steps = buildAddStringsSteps({ num1: a, num2: b })
      const digits = steps.filter((s) => s.phase === 'digit')
      expect(digits[digits.length - 1].carryOut).toBe(0)
    }
  })

  it('digit 帧数 = max(len) 或 max(len)+1（仅溢出时多一帧）', () => {
    for (const [a, b] of CASES) {
      const steps = buildAddStringsSteps({ num1: a, num2: b })
      const nDigits = steps.filter((s) => s.phase === 'digit').length
      const maxLen = Math.max(a.length, b.length)
      expect([maxLen, maxLen + 1]).toContain(nDigits)
      // 多一帧当且仅当有溢出
      expect(nDigits === maxLen + 1).toBe(refBigInt(a, b).length === maxLen + 1)
    }
  })
})
