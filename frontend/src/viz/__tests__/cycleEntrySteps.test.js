import { describe, it, expect } from 'vitest'
import { buildCycleEntrySteps } from '../cycleEntrySteps'

/** 文章里的演示链表：1→2→…→13，入口是 5（a = 4），环长 9，相遇点是 10。 */
const DEMO = {
  values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  cycleStart: 4,
}

describe('buildCycleEntrySteps — 环形链表 II 找环入口推演', () => {
  it('演示用例：a = 4、b = 9、相遇点 x = 5、入口是节点 5', () => {
    const steps = buildCycleEntrySteps(DEMO)
    const first = steps[0]
    expect(first.phase).toBe('meet')
    expect(first.a).toBe(4)
    expect(first.b).toBe(9)
    expect(first.x).toBe(5)
    expect(first.m).toBe(1)
    expect(first.meetAt).toBe(9)
    expect(DEMO.values[first.meetAt]).toBe(10)
    expect(first.entry).toBe(4)
    expect(DEMO.values[first.entry]).toBe(5)
  })

  it('帧数 = 1 起手 + a 步（最后一帧是 found）', () => {
    const steps = buildCycleEntrySteps(DEMO)
    expect(steps).toHaveLength(1 + 4)
    expect(steps.map((s) => s.phase)).toEqual(['meet', 'walk', 'walk', 'walk', 'found'])
  })

  it('最后一帧：两个指针都停在入口', () => {
    const steps = buildCycleEntrySteps(DEMO)
    const last = steps[steps.length - 1]
    expect(last.phase).toBe('found')
    expect(last.done).toBe(true)
    expect(last.ptr1).toBe(4)
    expect(last.ptr2).toBe(4)
    expect(last.ptr1).toBe(last.entry)
    expect(last.walked).toBe(4)
    expect(last.remain1).toBe(0)
    expect(last.remain2).toBe(0)
  })

  it('a 恰好等于 b - x 时，两个剩余步数全程同步', () => {
    const steps = buildCycleEntrySteps(DEMO)
    expect(steps[0].a).toBe(steps[0].b - steps[0].x) // 4 === 9 - 5
    for (const s of steps) {
      expect(s.remain1, `walked=${s.walked} 时两个剩余步数不同步`).toBe(s.remain2)
      expect(s.passed2).toBe(false)
    }
    expect(steps.map((s) => s.remain1)).toEqual([4, 3, 2, 1, 0])
  })

  it('核心恒等式 a + x = m·b，且 a ≡ b - x (mod b)', () => {
    for (const [a, b] of [
      [4, 9],
      [0, 7],
      [1, 4],
      [10, 9],
      [2, 5],
      [7, 6],
      [3, 11],
    ]) {
      const steps = buildCycleEntrySteps({
        values: Array.from({ length: a + b }, (_, i) => i + 1),
        cycleStart: a,
      })
      const s = steps[0]
      expect(s.a).toBe(a)
      expect(s.b).toBe(b)
      expect(s.a + s.x, `a=${a} b=${b}`).toBe(s.m * b)
      expect(s.a % b).toBe((b - s.x) % b)
    }
  })

  it('暴力枚举：各种 (a, b) 都能在 a 步时于入口会合', () => {
    for (let a = 0; a <= 12; a += 1) {
      for (let b = 1; b <= 12; b += 1) {
        const steps = buildCycleEntrySteps({
          values: Array.from({ length: a + b }, (_, i) => i + 1),
          cycleStart: a,
        })
        const last = steps[steps.length - 1]
        expect(last.phase, `a=${a} b=${b} 没有找到入口`).toBe('found')
        expect(last.ptr1, `a=${a} b=${b}`).toBe(a)
        expect(last.ptr2, `a=${a} b=${b}`).toBe(a)
        expect(last.walked, `a=${a} b=${b}`).toBe(a)
      }
    }
  })

  it('a > b - x 时 ptr2 会先越过入口再绕回来（passed2 标记）', () => {
    // a = 10、b = 9：x = 8，所以 b - x = 1，ptr2 走 1 步就到入口，但还要再绕一圈
    const steps = buildCycleEntrySteps({
      values: Array.from({ length: 19 }, (_, i) => i + 1),
      cycleStart: 10,
    })
    const s0 = steps[0]
    expect(s0.a).toBe(10)
    expect(s0.b).toBe(9)
    expect(s0.x).toBe(8)
    expect(s0.remain2).toBe(1)
    expect(s0.remain1).toBe(10)

    const passed = steps.filter((s) => s.passed2)
    expect(passed.length).toBeGreaterThan(0)
    // 越过入口后剩余步数按绕圈重算，始终落在 [0, b)
    for (const s of passed) {
      expect(s.remain2).toBeGreaterThanOrEqual(0)
      expect(s.remain2).toBeLessThan(s0.b)
    }
    const last = steps[steps.length - 1]
    expect(last.ptr1).toBe(10)
    expect(last.ptr2).toBe(10)
  })

  it('a = 0：头节点就是入口，起手一帧就出结果', () => {
    const steps = buildCycleEntrySteps({
      values: [1, 2, 3, 4, 5],
      cycleStart: 0,
    })
    expect(steps).toHaveLength(2)
    expect(steps[0].a).toBe(0)
    expect(steps[1].phase).toBe('found')
    expect(steps[1].ptr1).toBe(0)
    expect(steps[1].ptr2).toBe(0)
    expect(steps[1].entry).toBe(0)
    expect(steps[1].done).toBe(true)
  })

  it('无环：只有一帧 none，没有入口', () => {
    const steps = buildCycleEntrySteps({
      values: [1, 2, 3, 4, 5, 6],
      cycleStart: null,
    })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('none')
    expect(steps[0].done).toBe(true)
    expect(steps[0].entry).toBeNull()
    expect(steps[0].desc).toContain('null')
  })

  it('空链表：一帧 none，不会被演示链表顶替', () => {
    const steps = buildCycleEntrySteps({ values: [], cycleStart: null })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('none')
    expect(steps[0].b).toBe(0)
  })

  it('环长 1（自环）：入口就是自环那个节点', () => {
    // 1→2→3→(回到 3)，a = 2、b = 1
    const steps = buildCycleEntrySteps({ values: [1, 2, 3], cycleStart: 2 })
    const last = steps[steps.length - 1]
    expect(last.phase).toBe('found')
    expect(last.entry).toBe(2)
    expect(last.ptr1).toBe(2)
    expect(last.ptr2).toBe(2)
  })

  it('与 LC 141 停在同一节点：meetAt 一致', () => {
    const steps = buildCycleEntrySteps(DEMO)
    expect(steps[0].meetAt).toBe(9)
    expect(steps[0].desc).toContain('10') // 相遇点的值
  })

  it('快照互相独立', () => {
    const steps = buildCycleEntrySteps(DEMO)
    const before = steps[0].entry
    steps[2].entry = 999
    expect(steps[0].entry).toBe(before)
  })

  it('每一帧的指针都落在合法下标内', () => {
    const steps = buildCycleEntrySteps(DEMO)
    const n = DEMO.values.length
    for (const s of steps) {
      expect(s.ptr1).toBeGreaterThanOrEqual(0)
      expect(s.ptr1).toBeLessThan(n)
      expect(s.ptr2).toBeGreaterThanOrEqual(0)
      expect(s.ptr2).toBeLessThan(n)
    }
  })
})
