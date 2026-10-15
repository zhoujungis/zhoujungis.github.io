import { describe, expect, it } from 'vitest'

import { buildBitmapTwoBitSteps, STATE_LABEL } from '../bitmapTwoBitSteps.js'

/** 独立参考解：Counter 口径的三集合。 */
function refSets(input) {
  const c = new Map()
  for (const v of input) c.set(v, (c.get(v) || 0) + 1)
  const distinct = [...c.keys()].sort((a, b) => a - b)
  return {
    distinct,
    dups: distinct.filter((v) => c.get(v) >= 2),
    uniques: distinct.filter((v) => c.get(v) === 1),
  }
}

const last = (input) => {
  const s = buildBitmapTwoBitSteps(input === undefined ? {} : { input })
  return s[s.length - 1]
}

describe('2-bit 位图 · 主例 [3,7,3,3,12,7]', () => {
  it('8 帧：init + 6 个数各 1 帧 + done', () => {
    const steps = buildBitmapTwoBitSteps({})
    expect(steps.map((s) => s.phase)).toEqual([
      'init', 'step', 'step', 'step', 'step', 'step', 'step', 'done',
    ])
  })

  it('转移序列：0→1、0→1、1→2、2→2、0→1、1→2', () => {
    const steps = buildBitmapTwoBitSteps({})
    expect(steps.filter((s) => s.phase === 'step').map((s) => [s.value, s.from, s.to])).toEqual([
      [3, 0, 1],
      [7, 0, 1],
      [3, 1, 2],
      [3, 2, 2],
      [12, 0, 1],
      [7, 1, 2],
    ])
  })

  it('三集合：distinct [3,7,12]、dups [3,7]、uniques [12]', () => {
    const f = last()
    expect(f.distinct).toEqual([3, 7, 12])
    expect(f.dups).toEqual([3, 7])
    expect(f.uniques).toEqual([12])
  })

  it('终态 states 数组：3 和 7 是 2（多次），12 是 1（一次），其余 0', () => {
    const f = last()
    expect(f.states[3]).toBe(2)
    expect(f.states[7]).toBe(2)
    expect(f.states[12]).toBe(1)
    expect(f.states.filter((s) => s !== 0).length).toBe(3)
  })
})

describe('2-bit 位图 · 帧级不变量', () => {
  const INPUTS = [
    [3, 7, 3, 3, 12, 7],
    [1],
    [5, 5, 5, 5, 5],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [15, 0, 15, 8, 8, 8],
  ]

  it('状态单调不减：任何数的状态只会 0→1→2，不会回落', () => {
    for (const input of INPUTS) {
      const steps = buildBitmapTwoBitSteps({ input })
      const seen = new Map()
      for (const s of steps) {
        if (s.phase !== 'step') continue
        const prev = seen.get(s.value) ?? 0
        expect(s.from, JSON.stringify(input)).toBe(prev)
        expect(s.to >= s.from, JSON.stringify(input)).toBe(true)
        seen.set(s.value, s.to)
      }
    }
  })

  it('三集合恒等式：distinct = dups ∪ uniques（不相交）', () => {
    for (const input of INPUTS) {
      for (const s of buildBitmapTwoBitSteps({ input })) {
        expect([...s.dups, ...s.uniques].sort((a, b) => a - b), JSON.stringify(input))
          .toEqual(s.distinct)
      }
    }
  })

  it('done 帧三集合与 Counter 参考解一致', () => {
    for (const input of INPUTS) {
      const r = refSets(input)
      const f = last(input)
      expect(f.distinct, JSON.stringify(input)).toEqual(r.distinct)
      expect(f.dups, JSON.stringify(input)).toEqual(r.dups)
      expect(f.uniques, JSON.stringify(input)).toEqual(r.uniques)
    }
  })
})

describe('2-bit 位图 · 与 Counter 参考解随机对拍', () => {
  it('3000 组随机输入（长度 1~14，值域 0~15）三重一致', () => {
    let mismatches = 0
    for (let t = 0; t < 3000; t += 1) {
      const n = 1 + Math.floor(Math.random() * 14)
      const input = Array.from({ length: n }, () => Math.floor(Math.random() * 16))
      const f = last(input)
      const r = refSets(input)
      if (JSON.stringify(f.distinct) !== JSON.stringify(r.distinct)) mismatches += 1
      if (JSON.stringify(f.dups) !== JSON.stringify(r.dups)) mismatches += 1
      if (JSON.stringify(f.uniques) !== JSON.stringify(r.uniques)) mismatches += 1
    }
    expect(mismatches).toBe(0)
  })
})

describe('2-bit 位图 · 边界与非法输入', () => {
  it('单元素输入：该数唯一，无重复', () => {
    const f = last([9])
    expect(f.distinct).toEqual([9])
    expect(f.dups).toEqual([])
    expect(f.uniques).toEqual([9])
  })

  it('同一数五次：dups 有它，uniques 为空', () => {
    const f = last([5, 5, 5, 5, 5])
    expect(f.distinct).toEqual([5])
    expect(f.dups).toEqual([5])
    expect(f.uniques).toEqual([])
  })

  it('非法输入回退默认牌 [3,7,3,3,12,7]', () => {
    const def = buildBitmapTwoBitSteps({})
    expect(def[0].input).toEqual([3, 7, 3, 3, 12, 7])
    for (const bad of [[], [16], [-1], [2.5], null, 'x', 7]) {
      const steps = buildBitmapTwoBitSteps({ input: bad })
      expect(steps[0].input, JSON.stringify(bad)).toEqual([3, 7, 3, 3, 12, 7])
    }
  })

  it('STATE_LABEL 覆盖四个状态', () => {
    expect(STATE_LABEL[0]).toContain('00')
    expect(STATE_LABEL[1]).toContain('01')
    expect(STATE_LABEL[2]).toContain('10')
    expect(STATE_LABEL[3]).toContain('11')
  })
})
