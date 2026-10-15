import { describe, expect, it } from 'vitest'

import { buildLcs1WalkSteps } from '../lcs1WalkSteps.js'
import { judgeLcs1 } from '../lcs1Steps.js'

const walk = buildLcs1WalkSteps({})
const walks = walk.filter((x) => x.phase === 'walk')
const done = walk[walk.length - 1]

describe('走位对照 · 帧序列', () => {
  it('13 帧：init + 正解 5 步 + 错法 6 步 + done', () => {
    expect(walk.length).toBe(13)
    expect(walk.map((x) => (x.path ? x.phase + ':' + x.path : x.phase))).toEqual([
      'init',
      'walk:ok', 'walk:ok', 'walk:ok', 'walk:ok', 'walk:ok',
      'walk:bug', 'walk:bug', 'walk:bug', 'walk:bug', 'walk:bug', 'walk:bug',
      'done',
    ])
  })

  it('正解路径：次对角线 5 步全等，g 逐格 1..5', () => {
    const ok = walks.filter((x) => x.path === 'ok')
    expect(ok.map((x) => [x.i, x.j])).toEqual([[2, 1], [3, 2], [4, 3], [5, 4], [6, 5]])
    expect(ok.map((x) => x.equal)).toEqual([true, true, true, true, true])
    expect(ok.map((x) => x.value)).toEqual([1, 2, 3, 4, 5])
  })

  it('错法路径：主对角线 6 步全不等，g 仍逐格 1..6（虚高）', () => {
    const bug = walks.filter((x) => x.path === 'bug')
    expect(bug.map((x) => [x.i, x.j])).toEqual([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]])
    expect(bug.map((x) => x.equal)).toEqual([false, false, false, false, false, false])
    expect(bug.map((x) => x.value)).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('cells 累积：每步比上一步多一个格', () => {
    walks.forEach((x) => {
      expect(x.cells.length).toBe(
        x.path === 'ok' ? x.i - 1 : x.i,
      )
      const last = x.cells[x.cells.length - 1]
      expect([last[0], last[1], last[2]]).toEqual([x.i, x.j, x.value])
    })
  })

  it('正解路径的 cells 带 f 值（全等格 f = g）', () => {
    walks.filter((x) => x.path === 'ok').forEach((x) => {
      x.cells.forEach((c) => expect(c[3]).toBe(c[2]))
    })
  })
})

describe('走位对照 · 结论', () => {
  it('正解 5 vs 错法 6，与 judgeLcs1 一致', () => {
    expect(done.bestOk).toBe(5)
    expect(done.bestBug).toBe(6)
    expect(done.bestOk).toBe(judgeLcs1('abcdef', 'bcdefa').best)
    expect(done.bestBug).toBeGreaterThan(done.bestOk)
  })

  it('正解 5 对应 "bcdef"（0 处错的公共子串）', () => {
    // 独立确认：bcdef 两串都是 0 错公共子串，长度 5
    const s = 'abcdef'
    const t = 'bcdefa'
    expect(s.slice(1, 6)).toBe('bcdef')
    expect(t.slice(0, 5)).toBe('bcdef')
    expect('bcdef'.length).toBe(5)
  })

  it('错法 6 = 两个串的全长（6 个不等位置被当成一次错误）', () => {
    const s = 'abcdef'
    const t = 'bcdefa'
    let bad = 0
    for (let i = 0; i < 6; i += 1) if (s[i] !== t[i]) bad += 1
    expect(bad).toBe(6)
  })
})

describe('走位对照 · 边界与非法输入', () => {
  it('非法输入回退主例 abcdef / bcdefa', () => {
    const def = buildLcs1WalkSteps({})
    expect(def[0].s).toBe('abcdef')
    expect(def[0].t).toBe('bcdefa')
    for (const bad of [{ s: '', t: 'x' }, { s: 'ABC', t: 'abc' }, { s: null, t: null }, {}]) {
      const steps = buildLcs1WalkSteps(bad)
      expect(steps[0].s, JSON.stringify(bad)).toBe('abcdef')
      expect(steps[0].t, JSON.stringify(bad)).toBe('bcdefa')
    }
  })

  it('合法短输入照单全收（ab / ba）', () => {
    const steps = buildLcs1WalkSteps({ s: 'ab', t: 'ba' })
    expect(steps[0].s).toBe('ab')
    expect(steps[0].t).toBe('ba')
    const d = steps[steps.length - 1]
    expect(d.bestOk).toBe(judgeLcs1('ab', 'ba').best)
    expect(d.bestBug).toBe(2)
  })
})
