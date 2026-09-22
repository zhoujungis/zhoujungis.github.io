import { describe, it, expect } from 'vitest'
import {
  buildReorderSteps,
  midSlotOf,
  walkFrom,
  reorderedValues,
} from '../reorderSteps'

/** 文章里的演示用例：1→2→3→4 → 1→4→2→3 */
const DEMO = [1, 2, 3, 4]

/** 独立暴力模拟：直接用数组下标算重排结果，不复用被测代码的指针操作。 */
function bruteReorder(values) {
  const L = values.length
  const out = []
  for (let i = 0; i < Math.floor(L / 2); i += 1) out.push(values[i], values[L - 1 - i])
  if (L % 2 === 1) out.push(values[Math.floor(L / 2)])
  return out
}

/** 从某一帧的 links 快照读出「从 slot 0 出发的整条链」的值序列。 */
function chainOf(step, values) {
  return walkFrom(0, step.links).map((s) => values[s])
}

/** 检查这一帧画面上没有重复格子、也没有丢格子。 */
function expectCoversAll(step, L) {
  const all = [...step.merged, ...step.front, ...step.back]
  expect(new Set(all).size).toBe(L)
  expect(all.sort((a, b) => a - b)).toEqual([...Array(L).keys()])
}

describe('midSlotOf — 中点取法（奇数时中间节点归前半段）', () => {
  it('各长度下 slow 停在前半段的最后一个节点', () => {
    expect(midSlotOf(2)).toBe(0) // 前 [0]     后 [1]
    expect(midSlotOf(3)).toBe(1) // 前 [0,1]   后 [2]
    expect(midSlotOf(4)).toBe(1) // 前 [0,1]   后 [2,3]
    expect(midSlotOf(5)).toBe(2) // 前 [0,1,2] 后 [3,4]
    expect(midSlotOf(6)).toBe(2) // 前 [0,1,2] 后 [3,4,5]
  })
})

describe('buildReorderSteps — 重排链表推演', () => {
  it('演示用例：最终链是 1→4→2→3', () => {
    const steps = buildReorderSteps(DEMO)
    const last = steps[steps.length - 1]
    expect(last.done).toBe(true)
    expect(chainOf(last, DEMO)).toEqual([1, 4, 2, 3])
    expect(bruteReorder(DEMO)).toEqual([1, 4, 2, 3])
  })

  it('步数 = 1 初始 + 1 找中点 + 1 断开 + 2 反转 + 4 合并帧 + 1 收尾', () => {
    const steps = buildReorderSteps(DEMO)
    expect(steps).toHaveLength(10)
    expect(steps.map((s) => s.phase)).toEqual([
      'init', 'mid', 'split', 'rev', 'rev', 'merge', 'merge', 'merge', 'merge', 'done',
    ])
  })

  it('断开帧把前半段尾的 next 置空，两段彻底分开', () => {
    const steps = buildReorderSteps(DEMO)
    const split = steps.find((s) => s.phase === 'split')
    expect(split.links[1]).toBeNull() // 2 的 next 断开
    expect(split.cutEdge).toEqual([1, 2])
    // 两条链各自走到底，互不相连
    expect(walkFrom(0, split.links)).toEqual([0, 1])
    expect(walkFrom(2, split.links)).toEqual([2, 3])
  })

  it('反转完成后，后半段变成 4→3', () => {
    const steps = buildReorderSteps(DEMO)
    const lastRev = steps.filter((s) => s.phase === 'rev').at(-1)
    expect(walkFrom(3, lastRev.links).map((s) => DEMO[s])).toEqual([4, 3])
  })

  it('合并阶段每帧都覆盖全部节点（画面上不重不漏）', () => {
    const steps = buildReorderSteps(DEMO)
    for (const s of steps) expectCoversAll(s, DEMO.length)
  })

  it('阶段条在 ①②③ 三段里依次推进', () => {
    const steps = buildReorderSteps(DEMO)
    expect(steps[0].stage).toBe(0)
    expect(steps.filter((s) => s.phase === 'mid').every((s) => s.stage === 1)).toBe(true)
    expect(steps.filter((s) => s.phase === 'split' || s.phase === 'rev')
      .every((s) => s.stage === 2)).toBe(true)
    expect(steps.filter((s) => s.phase === 'merge' || s.phase === 'done')
      .every((s) => s.stage === 3)).toBe(true)
  })

  it('奇数长度 [1,2,3]：得到 1→3→2，中间节点留在原位', () => {
    const steps = buildReorderSteps([1, 2, 3])
    expect(chainOf(steps.at(-1), [1, 2, 3])).toEqual([1, 3, 2])
  })

  it('奇数长度 [1,2,3,4,5]：得到 1→5→2→4→3', () => {
    const steps = buildReorderSteps([1, 2, 3, 4, 5])
    expect(chainOf(steps.at(-1), [1, 2, 3, 4, 5])).toEqual([1, 5, 2, 4, 3])
  })

  it('长度 1 和 2：单节点原样返回，两节点顺序不变', () => {
    const one = buildReorderSteps([7])
    expect(one).toHaveLength(1)
    expect(one[0].done).toBe(true)
    expect(chainOf(one[0], [7])).toEqual([7])

    const two = buildReorderSteps([1, 2])
    expect(chainOf(two.at(-1), [1, 2])).toEqual([1, 2])
  })

  it('与暴力模拟对照：2~9 各长度的最终链都一致', () => {
    for (let L = 2; L <= 9; L += 1) {
      const values = [...Array(L).keys()].map((i) => i + 1)
      const steps = buildReorderSteps(values)
      expect(chainOf(steps.at(-1), values)).toEqual(bruteReorder(values))
      expect(reorderedValues(values)).toEqual(bruteReorder(values))
    }
  })

  it('最终链没有环（每个 slot 最多出现一次）', () => {
    for (let L = 2; L <= 9; L += 1) {
      const values = [...Array(L).keys()].map((i) => i + 1)
      const last = buildReorderSteps(values).at(-1)
      const chain = walkFrom(0, last.links)
      expect(chain.length).toBe(L)
      expect(new Set(chain).size).toBe(L)
    }
  })
})
