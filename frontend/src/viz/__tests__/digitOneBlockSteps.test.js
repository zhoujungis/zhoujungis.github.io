import { describe, expect, it } from 'vitest'

import { buildDigitOneBlockSteps } from '../digitOneBlockSteps.js'
import { buildDigitOneSteps } from '../digitOneSteps.js'

/** 独立参考解：字符串暴力。 */
function brute(n) {
  let c = 0
  for (let x = 1; x <= n; x += 1) c += String(x).split('').filter((ch) => ch === '1').length
  return c
}

/** 当前数位上，0 ~ n 里哪些数的这一位是 1（独立重写，不依赖被测实现）。 */
function refHighlight(n, weight) {
  const out = []
  for (let v = 0; v <= n; v += 1) {
    if (Math.floor(v / weight) % 10 === 1) out.push(v)
  }
  return out
}

const last = (n) => {
  const s = buildDigitOneBlockSteps({ n })
  return s[s.length - 1]
}

describe('数轴周期块 · 主例 n=47', () => {
  it('个位 5 + 十位 10 = 15，共 6 帧', () => {
    const steps = buildDigitOneBlockSteps({ n: 47 })
    expect(steps.length).toBe(6)
    expect(steps[0].phase).toBe('init')
    expect(steps[1].phase).toBe('pattern')
    expect(steps[2].phase).toBe('count')
    expect(steps[3].phase).toBe('pattern')
    expect(steps[4].phase).toBe('count')
    expect(steps[5].phase).toBe('done')
    const f = steps[5]
    expect(f.total).toBe(15)
    expect(f.positions.map((p) => p.positionTotal)).toEqual([5, 10])
  })

  it('个位是散点：高亮 1、11、21、31、41；4 个完整十连 + 零头 1 个', () => {
    const ones = buildDigitOneBlockSteps({ n: 47 })[1]
    expect(ones.posIndex).toBe(0)
    expect(ones.weight).toBe(1)
    expect(ones.cycle).toBe(10)
    expect(ones.fullBlocks).toBe(4)
    expect(ones.runLen).toBe(1)
    expect(ones.positionTotal).toBe(5)
    expect(ones.highlighted).toEqual([1, 11, 21, 31, 41])
  })

  it('十位是整块：高亮 10-19；0 个完整百块 + 零头里整块 10 个', () => {
    const tens = buildDigitOneBlockSteps({ n: 47 })[3]
    expect(tens.posIndex).toBe(1)
    expect(tens.weight).toBe(10)
    expect(tens.cycle).toBe(100)
    expect(tens.fullBlocks).toBe(0)
    expect(tens.runLen).toBe(10)
    expect(tens.positionTotal).toBe(10)
    expect(tens.highlighted).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
  })

  it('账本恒等式：fullBlocks × weight + runLen === positionTotal', () => {
    for (const n of [10, 13, 25, 47, 63, 88, 99]) {
      for (const s of buildDigitOneBlockSteps({ n })) {
        if (s.weight === 0) continue
        expect(s.fullBlocks * s.weight + s.runLen).toBe(s.positionTotal)
        // 高亮格子数就等于这一位的总数（账本和图案必须对得上）
        expect(s.highlighted.length).toBe(s.positionTotal)
      }
    }
  })
})

describe('数轴周期块 · 两个视角必须给出同一个答案', () => {
  it('n = 10..99：块动画终帧 === 逐位公式终帧 === 暴力解', () => {
    for (let n = 10; n <= 99; n += 1) {
      const blockTotal = last(n).total
      const formulaTotal = buildDigitOneSteps({ n }).slice(-1)[0].total
      expect(blockTotal, `block(${n})`).toBe(brute(n))
      expect(formulaTotal, `formula(${n})`).toBe(brute(n))
    }
  })

  it('高亮集合与独立重写一致；count 帧的累计等于已记账之和', () => {
    for (const n of [10, 37, 47, 55, 99]) {
      const steps = buildDigitOneBlockSteps({ n })
      let running = 0
      steps.forEach((s, i) => {
        if (s.weight > 0) {
          expect(s.highlighted, `n=${n} frame ${i} highlight`).toEqual(refHighlight(n, s.weight))
        }
        if (s.phase === 'count') {
          running += s.positionTotal
          expect(s.positions.length).toBe(s.posIndex + 1)
        }
        expect(s.total, `n=${n} frame ${i} total`).toBe(running)
      })
    }
  })
})

describe('数轴周期块 · 边界与回退', () => {
  it('网格只支持两位数：非法 / 越界输入回退 47', () => {
    for (const bad of [undefined, 5, 100, 3.5, 'x', -1]) {
      expect(buildDigitOneBlockSteps({ n: bad })[0].n).toBe(47)
    }
  })

  it('默认参数就是 47', () => {
    expect(buildDigitOneBlockSteps()[0].n).toBe(47)
  })

  it('done 帧没有当前数位，高亮清空（坑 J）', () => {
    const f = last(47)
    expect(f.posIndex).toBe(-1)
    expect(f.weight).toBe(0)
    expect(f.highlighted).toEqual([])
    expect(f.total).toBe(15)
  })
})
