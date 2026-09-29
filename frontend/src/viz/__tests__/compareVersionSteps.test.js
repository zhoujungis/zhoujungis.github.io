/**
 * compareVersionSteps.test.js — LC 165「比较版本号」状态机单测。
 *
 * 多参考解交叉：状态机（纯字符串法）vs parseInt 逐位 vs BigInt 逐位。
 * 特殊钉子："1.2" vs "1.10"（字符比较反例）、30 位超长修订号
 * （parseInt 精度陷阱：只差末位的 21 位数会被 Number 判成相等）。
 */
import { describe, it, expect } from 'vitest'
import { buildCompareVersionSteps, stripZeros, cmpNorm } from '../compareVersionSteps.js'

const refParseInt = (a, b) => {
  const x = a.split('.').map(Number)
  const y = b.split('.').map(Number)
  const n = Math.max(x.length, y.length)
  for (let i = 0; i < n; i += 1) {
    const p = x[i] || 0
    const q = y[i] || 0
    if (p !== q) return p < q ? -1 : 1
  }
  return 0
}

const refBigInt = (a, b) => {
  const x = a.split('.')
  const y = b.split('.')
  const n = Math.max(x.length, y.length)
  for (let i = 0; i < n; i += 1) {
    const p = BigInt(x[i] || 0)
    const q = BigInt(y[i] || 0)
    if (p !== q) return p < q ? -1 : 1
  }
  return 0
}

const CASES = [
  ['1.02.3', '1.2.10'],
  ['1.01', '1.001'],
  ['1.0', '1.0.0'],
  ['1.0', '1.0.1'],
  ['1.2', '1.10'],
  ['10.4', '1.04'],
  ['0.1', '1.1'],
  ['1', '1.0.0.0'],
  ['0.0', '0'],
  ['1.2.3.4.5', '1.2.3.4.5'],
  ['1.000.0001', '1.0.1'],
  ['7.9.2', '7.10.1'],
]

describe('buildCompareVersionSteps — 结果正确性（多参考解交叉）', () => {
  for (const [a, b] of CASES) {
    it(`${a} vs ${b}`, () => {
      const steps = buildCompareVersionSteps({ version1: a, version2: b })
      const done = steps[steps.length - 1]
      expect(done.phase).toBe('done')
      expect(done.result).toBe(refBigInt(a, b))
      expect(done.result).toBe(refParseInt(a, b))
    })
  }
})

describe('buildCompareVersionSteps — 工具函数', () => {
  it('stripZeros：剥前导零，全零保留一个 0', () => {
    expect(stripZeros('000')).toBe('0')
    expect(stripZeros('0')).toBe('0')
    expect(stripZeros('0002')).toBe('2')
    expect(stripZeros('10')).toBe('10')
  })

  it('cmpNorm：先长度后字典序（契约：入参必须已归一化）', () => {
    expect(cmpNorm('3', '10')).toBe(-1)
    expect(cmpNorm('10', '3')).toBe(1)
    expect(cmpNorm('2', '2')).toBe(0)
    expect(cmpNorm('123', '124')).toBe(-1)
  })
})

describe('buildCompareVersionSteps — 主例帧结构', () => {
  const steps = buildCompareVersionSteps({})
  const compares = steps.filter((s) => s.phase === 'compare')

  it('init → 3 个 compare → done，共 5 帧', () => {
    expect(steps.length).toBe(5)
    expect(steps[0].phase).toBe('init')
    expect(compares.length).toBe(3)
    expect(steps[4].phase).toBe('done')
  })

  it('主例 1.02.3 vs 1.2.10 → -1', () => {
    expect(steps[4].result).toBe(-1)
  })

  it('第 2 列演示剥前导零（"02" → "2"）', () => {
    expect(compares[1].raw1).toBe('02')
    expect(compares[1].val1).toBe('2')
    expect(compares[1].verdict).toBe('equal')
  })

  it('第 3 列数值比较不等于字符比较（"3" < "10"）', () => {
    expect(compares[2].val1).toBe('3')
    expect(compares[2].val2).toBe('10')
    expect(compares[2].verdict).toBe('less')
  })

  it('done 帧带全渲染层要用的字段', () => {
    const d = steps[4]
    expect(d.result).toBe(-1)
    expect(d.rev1).toEqual(['1', '02', '3'])
    expect(d.rev2).toEqual(['1', '2', '10'])
  })
})

describe('buildCompareVersionSteps — 逐帧不变量（所有用例）', () => {
  for (const [a, b] of CASES) {
    it(`${a} vs ${b}：剥零正确 + verdict 与数值关系互洽`, () => {
      const steps = buildCompareVersionSteps({ version1: a, version2: b })
      for (const s of steps) {
        if (s.phase !== 'compare') continue
        if (s.isPad1) expect(s.val1).toBe('0')
        else expect(stripZeros(s.raw1)).toBe(s.val1)
        if (s.isPad2) expect(s.val2).toBe('0')
        else expect(stripZeros(s.raw2)).toBe(s.val2)
        // 剥零后无前导零（"0" 除外）
        if (s.val1 !== '0') expect(s.val1[0]).not.toBe('0')
        if (s.val2 !== '0') expect(s.val2[0]).not.toBe('0')
        const c = cmpNorm(s.val1, s.val2)
        const want = c === 0 ? 'equal' : c < 0 ? 'less' : 'greater'
        expect(s.verdict).toBe(want)
      }
    })

    it(`${a} vs ${b}：col 单调递增，compare 帧无 result，done 帧合法`, () => {
      const steps = buildCompareVersionSteps({ version1: a, version2: b })
      let prev = -1
      for (const s of steps) {
        if (s.phase === 'compare') {
          expect(s.col).toBeGreaterThan(prev)
          expect(s.result).toBeNull()
          prev = s.col
        }
      }
      const done = steps[steps.length - 1]
      expect([-1, 0, 1]).toContain(done.result)
    })

    it(`${a} vs ${b}：equal 短路后立即 done（不多出 compare 帧）`, () => {
      const steps = buildCompareVersionSteps({ version1: a, version2: b })
      const doneIdx = steps.findIndex((s) => s.phase === 'done')
      expect(doneIdx).toBe(steps.length - 1)
      const done = steps[doneIdx]
      // done 帧前最后一个 compare 帧：要么 equal（全等路径），要么带裁决
      const lastCmp = steps[doneIdx - 1]
      if (doneIdx > 1 && lastCmp.phase === 'compare') {
        expect(['equal', 'less', 'greater']).toContain(lastCmp.verdict)
        expect(done.result).toBe(lastCmp.verdict === 'equal' ? 0 : lastCmp.verdict === 'less' ? -1 : 1)
      }
    })
  }
})

describe('buildCompareVersionSteps — 本题特有易错点', () => {
  it('"1.2" vs "1.10"：数值 2 < 10 返回 -1（字符比较 \'2\' > \'1\' 会错成 1）', () => {
    const steps = buildCompareVersionSteps({ version1: '1.2', version2: '1.10' })
    expect(steps[steps.length - 1].result).toBe(-1)
  })

  it('超长修订号：只差末位的 21 位数，parseInt 判相等（精度陷阱），字符串法正确', () => {
    const a = '1.' + '1' + '0'.repeat(20) + '1'
    const b = '1.' + '1' + '0'.repeat(20) + '2'
    // 先证明陷阱存在
    expect(Number(a.split('.')[1])).toBe(Number(b.split('.')[1]))
    const s1 = buildCompareVersionSteps({ version1: a, version2: b })
    const s2 = buildCompareVersionSteps({ version1: b, version2: a })
    expect(s1[s1.length - 1].result).toBe(refBigInt(a, b))
    expect(s1[s1.length - 1].result).toBe(-1)
    expect(s2[s2.length - 1].result).toBe(1)
  })

  it('缺失修订号补 0："1.0" vs "1.0.0" → 0，"1" vs "1.0.0.0" → 0', () => {
    const s1 = buildCompareVersionSteps({ version1: '1.0', version2: '1.0.0' })
    expect(s1[s1.length - 1].result).toBe(0)
    const s2 = buildCompareVersionSteps({ version1: '1', version2: '1.0.0.0' })
    expect(s2[s2.length - 1].result).toBe(0)
    // 补零帧的 isPad 标记
    const cmps = s1.filter((s) => s.phase === 'compare')
    expect(cmps[2].isPad1).toBe(true)
    expect(cmps[2].isPad2).toBe(false)
    expect(cmps[2].val1).toBe('0')
  })

  it('"1.0" vs "1.0.1"：补零列之后还有非零列 → 返回 -1', () => {
    const steps = buildCompareVersionSteps({ version1: '1.0', version2: '1.0.1' })
    expect(steps[steps.length - 1].result).toBe(-1)
  })

  it('全零版本号："0.0" vs "0" → 0', () => {
    const steps = buildCompareVersionSteps({ version1: '0.0', version2: '0' })
    expect(steps[steps.length - 1].result).toBe(0)
  })

  it('比较在分出胜负的列短路（后面的 compare 帧不存在）', () => {
    const steps = buildCompareVersionSteps({ version1: '10.4', version2: '1.04' })
    // 第 1 列 10 > 1 短路：只有 1 个 compare 帧
    const cmps = steps.filter((s) => s.phase === 'compare')
    expect(cmps.length).toBe(1)
    expect(cmps[0].verdict).toBe('greater')
    expect(steps[steps.length - 1].result).toBe(1)
  })

  it('不修改输入（rev1/rev2 字段全程保持原始切分）', () => {
    const steps = buildCompareVersionSteps({ version1: '1.02.3', version2: '1.2.10' })
    for (const s of steps) {
      expect(s.rev1).toEqual(['1', '02', '3'])
      expect(s.rev2).toEqual(['1', '2', '10'])
    }
  })
})
