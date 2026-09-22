import { describe, expect, it } from 'vitest'
import {
  buildPalindromeSteps,
  isPalindromeValues,
  midSlotOf,
  pairSlotsOf,
  walkFrom,
} from '../palindromeSteps'

/** 顺着 links 从 0 走到链尾，返回沿途的值（用来断言"当前链表长什么样"）。 */
function snapshotList(step, values) {
  return walkFrom(0, step.links).map((slot) => values[slot])
}

const DEMO = [1, 2, 2, 1]

describe('palindromeSteps — 找中点', () => {
  it('midSlotOf 停在后半段的第一个节点（中间节点归后半段）', () => {
    expect(midSlotOf(1)).toBe(0)
    expect(midSlotOf(2)).toBe(1)
    expect(midSlotOf(3)).toBe(1)
    expect(midSlotOf(4)).toBe(2)
    expect(midSlotOf(5)).toBe(2)
    expect(midSlotOf(6)).toBe(3)
    expect(midSlotOf(7)).toBe(3)
  })

  it('pairSlotsOf 是对称位置，奇数长度多出中点自比那一对', () => {
    expect(pairSlotsOf(4)).toEqual([[0, 3], [1, 2]])
    expect(pairSlotsOf(5)).toEqual([[0, 4], [1, 3], [2, 2]])
    expect(pairSlotsOf(1)).toEqual([[0, 0]])
  })
})

describe('palindromeSteps — 帧结构', () => {
  it('[1,2,2,1]：9 帧，阶段顺序 init → mid → split → rev → cmp → done', () => {
    const steps = buildPalindromeSteps(DEMO)
    expect(steps).toHaveLength(9)
    expect(steps.map((s) => s.phase)).toEqual([
      'init', 'mid', 'mid', 'split', 'rev', 'rev', 'cmp', 'cmp', 'done',
    ])
    expect(steps.map((s) => s.stage)).toEqual([0, 1, 1, 2, 2, 2, 3, 3, 3])
  })

  it('只有最后一帧 done，结论为 true', () => {
    const steps = buildPalindromeSteps(DEMO)
    expect(steps.filter((s) => s.done)).toHaveLength(1)
    const last = steps.at(-1)
    expect(last.done).toBe(true)
    expect(last.verdict).toBe(true)
    expect(last.pairs).toHaveLength(2)
    expect(last.pairs.every((p) => p.ok)).toBe(true)
  })

  it('找中点阶段：slow 逐帧前进，最后一帧停在后半段开头', () => {
    const steps = buildPalindromeSteps(DEMO)
    const mid = steps.filter((s) => s.phase === 'mid')
    expect(mid).toHaveLength(2)
    expect(mid[0].chips.find((c) => c.kind === 'slow').slot).toBe(1)
    expect(mid[1].chips.find((c) => c.kind === 'slow').slot).toBe(2)
    // fast 冲出链表：chip 挂在 ∅ 上
    expect(mid[1].chips.find((c) => c.kind === 'fast').slot).toBe(null)
  })

  it('反转阶段：back 从原顺序变成反转后的顺序', () => {
    const steps = buildPalindromeSteps(DEMO)
    const rev = steps.filter((s) => s.phase === 'rev')
    expect(rev).toHaveLength(2)
    expect(rev[0].back).toEqual([2, 3])
    expect(rev.at(-1).back).toEqual([3, 2])
    // 中点（slot 2）的 next 被反转置空
    expect(rev.at(-1).links[2]).toBe(null)
    expect(rev.at(-1).links[3]).toBe(2)
  })

  it('前半段链走到中点就停（反转顺手把中点 next 置空，所以不用断开）', () => {
    const steps = buildPalindromeSteps(DEMO)
    const last = steps.at(-1)
    expect(walkFrom(0, last.links)).toEqual([0, 1, 2])
    expect(snapshotList(last, DEMO)).toEqual([1, 2, 2])
  })

  it('每一帧的 front 都不含中点，back 覆盖后半段全部节点', () => {
    const steps = buildPalindromeSteps(DEMO)
    for (const s of steps) {
      if (!s.back.length) continue
      expect(new Set([...s.front, ...s.back]).size).toBe(s.front.length + s.back.length)
      expect(s.front).toEqual([0, 1])
      expect([...s.back].sort()).toEqual([2, 3])
    }
  })
})

describe('palindromeSteps — 判定', () => {
  it('回文 → true；非回文 → false', () => {
    expect(isPalindromeValues([1, 2, 2, 1])).toBe(true)
    expect(isPalindromeValues([1, 2, 3, 2, 1])).toBe(true)
    expect(isPalindromeValues([1, 2, 3])).toBe(false)
    expect(isPalindromeValues([1, 2])).toBe(false)
  })

  it('非回文 [1,2,3]：比到第 1 对就 false，提前收尾', () => {
    const steps = buildPalindromeSteps([1, 2, 3])
    const last = steps.at(-1)
    expect(last.done).toBe(true)
    expect(last.verdict).toBe(false)
    expect(last.pairs).toHaveLength(1)
    expect(last.pairs[0]).toEqual({ f: 0, b: 2, ok: false })
    // 没有多余的 done 帧
    expect(steps.filter((s) => s.done)).toHaveLength(1)
  })

  it('[1,2]：p2 只有后半段一个节点，判定 false', () => {
    const steps = buildPalindromeSteps([1, 2])
    expect(steps.at(-1).verdict).toBe(false)
  })

  it('[1,1]：判定 true', () => {
    const steps = buildPalindromeSteps([1, 1])
    expect(steps.at(-1).verdict).toBe(true)
  })

  it('奇数长度 [1,2,3,2,1]：最后一帧是中点自比', () => {
    const steps = buildPalindromeSteps([1, 2, 3, 2, 1])
    const last = steps.at(-1)
    expect(last.verdict).toBe(true)
    expect(last.pairs).toHaveLength(3)
    expect(last.pairs.at(-1)).toEqual({ f: 2, b: 2, ok: true })
  })

  it('空链表：1 帧直接 true', () => {
    const steps = buildPalindromeSteps([])
    expect(steps).toHaveLength(1)
    expect(steps[0].done).toBe(true)
    expect(steps[0].verdict).toBe(true)
  })

  it('单节点：直接 true', () => {
    const steps = buildPalindromeSteps([7])
    expect(steps.at(-1).done).toBe(true)
    expect(steps.at(-1).verdict).toBe(true)
  })
})

describe('palindromeSteps — 不变量', () => {
  it('init / mid 阶段不改动拓扑（links 保持原始链）', () => {
    for (const values of [[1, 2, 2, 1], [1, 2, 3, 2, 1], [1, 2, 3]]) {
      const steps = buildPalindromeSteps(values)
      const initial = steps[0].links.join(',')
      for (const s of steps) {
        if (s.phase === 'init' || s.phase === 'mid') {
          expect(s.links.join(',')).toBe(initial)
        }
      }
    }
  })

  it('cmp / done 帧里，每对配对的两个值都参与过判定', () => {
    const steps = buildPalindromeSteps(DEMO)
    const last = steps.at(-1)
    for (const { f, b, ok } of last.pairs) {
      expect(DEMO[f] === DEMO[b]).toBe(ok)
    }
  })

  it('p1 走的路径 = front 顺序 + 中点，p2 走的路径 = back 顺序', () => {
    const steps = buildPalindromeSteps([1, 2, 3, 2, 1])
    const cmp = steps.filter((s) => s.phase === 'cmp')
    expect(cmp).toHaveLength(3)
    expect(cmp[0].active).toEqual({ f: 0, b: 4, ok: true })
    expect(cmp[1].active).toEqual({ f: 1, b: 3, ok: true })
    expect(cmp[2].active).toEqual({ f: 2, b: 2, ok: true })
    // back 顺序恒为反转后的后半段
    for (const s of cmp) expect(s.back).toEqual([4, 3, 2])
  })

  it('每帧的 chips 不超过 2 个，slot 都在合法范围内或是 null', () => {
    for (const values of [[1, 2, 2, 1], [1, 2, 3, 2, 1], [1, 2, 3], [1]]) {
      for (const s of buildPalindromeSteps(values)) {
        expect(s.chips.length).toBeLessThanOrEqual(2)
        for (const c of s.chips) {
          expect(c.slot === null || (c.slot >= 0 && c.slot < values.length)).toBe(true)
          expect(typeof c.label).toBe('string')
          expect(c.label.length).toBeGreaterThan(0)
        }
      }
    }
  })
})
