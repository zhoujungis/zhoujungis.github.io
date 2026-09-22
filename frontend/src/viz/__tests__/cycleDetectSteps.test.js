import { describe, it, expect } from 'vitest'
import {
  buildCycleDetectSteps,
  cycleIndexOf,
  gcd,
  willMeet,
} from '../cycleDetectSteps'

/** 文章里的演示链表：1→2→…→13，环入口是 5（下标 4），所以 a = 4、b = 9。 */
const DEMO = {
  values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  cycleStart: 4,
}

/** 独立的暴力模拟：直接按「走节点」推，不复用被测代码的推导。 */
function bruteForce(a, b, fastStep, cap = 6 * (a + b) + 64) {
  const n = a + b
  const nxt = (i) => (i === null || i >= n ? null : i + 1 < n ? i + 1 : a)
  let slow = 0
  let fast = 0
  for (let k = 1; k <= cap; k += 1) {
    for (let s = 0; s < fastStep && fast !== null; s += 1) fast = nxt(fast)
    slow = nxt(slow)
    if (slow !== null && slow === fast) return k
    if (fast === null) return null
  }
  return null
}

describe('buildCycleDetectSteps — 环形链表 Floyd 判圈推演', () => {
  it('演示用例：1→…→13 入口 5，第 9 步在节点 10 相遇', () => {
    const steps = buildCycleDetectSteps(DEMO)
    const last = steps[steps.length - 1]
    expect(last.phase).toBe('met')
    expect(last.met).toBe(true)
    expect(last.done).toBe(true)
    expect(last.steps).toBe(9)
    expect(last.slow).toBe(9)
    expect(last.fast).toBe(9)
    expect(DEMO.values[last.slow]).toBe(10)
  })

  it('步数 = 1 起始 + 相遇步数（相遇那步直接收尾，没有多余一帧）', () => {
    const steps = buildCycleDetectSteps(DEMO)
    expect(steps).toHaveLength(1 + 9)
    expect(steps[0].phase).toBe('init')
    expect(steps.slice(1, -1).every((s) => s.phase === 'move')).toBe(true)
  })

  it('慢指针进环后，gap 每步恰好减 1：5 → 4 → 3 → 2 → 1 → 0', () => {
    const steps = buildCycleDetectSteps(DEMO)
    // 慢指针第 4 步才进环（a = 4），从那一帧开始 gap 才有定义
    const gapped = steps.filter((s) => s.gap !== null && s.steps >= 4)
    expect(gapped.map((s) => s.gap)).toEqual([5, 4, 3, 2, 1, 0])
  })

  it('慢指针进环之前 gap 是 null（环上距离还没定义）', () => {
    const steps = buildCycleDetectSteps(DEMO)
    for (const s of steps.filter((x) => x.steps < 4)) {
      expect(s.gap).toBeNull()
    }
  })

  it('快指针比慢指针多走的格数，在相遇时是环长的整数倍', () => {
    const steps = buildCycleDetectSteps(DEMO)
    const last = steps[steps.length - 1]
    const closing = last.closing
    expect((last.steps * closing) % last.cycle.length).toBe(0)
  })

  it('无环：快指针走出链表后收尾，返回 end 而不是 met', () => {
    const steps = buildCycleDetectSteps({
      values: [1, 2, 3, 4, 5, 6],
      cycleStart: null,
    })
    const last = steps[steps.length - 1]
    expect(last.phase).toBe('end')
    expect(last.met).toBe(false)
    expect(last.done).toBe(true)
    expect(last.cycle).toBeNull()
    expect(steps.every((s) => s.gap === null)).toBe(true)
  })

  it('无环时不会有 met 帧', () => {
    for (const len of [1, 2, 3, 5, 8]) {
      const steps = buildCycleDetectSteps({
        values: Array.from({ length: len }, (_, i) => i + 1),
        cycleStart: null,
      })
      expect(steps.some((s) => s.met)).toBe(false)
    }
  })

  it('空链表只有一帧 end', () => {
    const steps = buildCycleDetectSteps({ values: [], cycleStart: null })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('end')
    expect(steps[0].done).toBe(true)
  })

  it('环长 1（自环）：入口节点指向自己', () => {
    // 1→2→3→(回到 3)，a = 2、b = 1
    const steps = buildCycleDetectSteps({ values: [1, 2, 3], cycleStart: 2 })
    const last = steps[steps.length - 1]
    expect(last.phase).toBe('met')
    expect(last.cycle).toEqual({ start: 2, length: 1 })
    expect(last.slow).toBe(last.fast)
  })

  it('整条链表就是一个环（a = 0）也能相遇', () => {
    const steps = buildCycleDetectSteps({
      values: [1, 2, 3, 4, 5, 6, 7],
      cycleStart: 0,
    })
    const last = steps[steps.length - 1]
    expect(last.phase).toBe('met')
    expect(last.cycle).toEqual({ start: 0, length: 7 })
    expect(last.steps).toBe(7) // b/gcd(1, b) = 7
  })

  it('快慢指针速度相同（fastStep = 1）→ 相对速度 0，不相遇', () => {
    const steps = buildCycleDetectSteps({ ...DEMO, fastStep: 1 })
    expect(steps).toHaveLength(2)
    expect(steps[0].closing).toBe(0)
    expect(steps[1].phase).toBe('end')
    expect(steps[1].met).toBe(false)
    expect(steps[1].desc).toContain('相对速度是 0')
  })

  it('快 3 慢 1 也必然相遇（推翻「环长偶数时快 3 永不相遇」的流传说法）', () => {
    const steps = buildCycleDetectSteps({ ...DEMO, fastStep: 3 })
    const last = steps[steps.length - 1]
    expect(last.phase).toBe('met')
    expect(last.closing).toBe(2)
    expect((last.steps * last.closing) % last.cycle.length).toBe(0)
  })

  it('暴力枚举：fastStep ∈ {2,3,4,5}、a ∈ [0,12]、b ∈ [1,12] 全部相遇', () => {
    for (let fastStep = 2; fastStep <= 5; fastStep += 1) {
      for (let a = 0; a <= 12; a += 1) {
        for (let b = 1; b <= 12; b += 1) {
          const n = a + b
          const values = Array.from({ length: n }, (_, i) => i + 1)
          const steps = buildCycleDetectSteps({ values, cycleStart: a, fastStep })
          const last = steps[steps.length - 1]
          expect(
            last.phase,
            `fastStep=${fastStep} a=${a} b=${b} 竟然没相遇`,
          ).toBe('met')
          // 与独立实现的步数一致
          expect(last.steps).toBe(bruteForce(a, b, fastStep))
        }
      }
    }
  })

  it('相遇步数 = 不小于 a 的最小 (b / gcd(closing, b)) 的倍数', () => {
    for (let fastStep = 2; fastStep <= 4; fastStep += 1) {
      const closing = fastStep - 1
      for (let a = 0; a <= 8; a += 1) {
        for (let b = 1; b <= 8; b += 1) {
          const unit = b / gcd(closing, b)
          let expected = unit
          while (expected < a) expected += unit
          const steps = buildCycleDetectSteps({
            values: Array.from({ length: a + b }, (_, i) => i + 1),
            cycleStart: a,
            fastStep,
          })
          expect(
            steps[steps.length - 1].steps,
            `fastStep=${fastStep} a=${a} b=${b}`,
          ).toBe(expected)
        }
      }
    }
  })

  it('每一帧的 cycle / fastStep / closing 都是自洽的', () => {
    const steps = buildCycleDetectSteps(DEMO)
    for (const s of steps) {
      expect(s.cycle).toEqual({ start: 4, length: 9 })
      expect(s.fastStep).toBe(2)
      expect(s.closing).toBe(1)
    }
  })

  it('快照互相独立：改一帧不影响另一帧', () => {
    const steps = buildCycleDetectSteps(DEMO)
    const before = steps[3].cycle.start
    steps[5].cycle.start = 999
    expect(steps[3].cycle.start).toBe(before)
  })

  it('无环时 fastStep = 1 也不会假装成环', () => {
    const steps = buildCycleDetectSteps({
      values: [1, 2, 3],
      cycleStart: null,
      fastStep: 1,
    })
    expect(steps.some((s) => s.met)).toBe(false)
    expect(steps[steps.length - 1].done).toBe(true)
  })
})

describe('cycleIndexOf / gcd / willMeet', () => {
  it('cycleIndexOf：环上节点给序号，直段和空值给 null', () => {
    expect(cycleIndexOf(4, 4, 9)).toBe(0)
    expect(cycleIndexOf(12, 4, 9)).toBe(8)
    expect(cycleIndexOf(3, 4, 9)).toBeNull() // 直段
    expect(cycleIndexOf(null, 4, 9)).toBeNull()
    expect(cycleIndexOf(4, null, 9)).toBeNull()
    expect(cycleIndexOf(4, 4, 0)).toBeNull()
  })

  it('gcd', () => {
    expect(gcd(1, 9)).toBe(1)
    expect(gcd(2, 9)).toBe(1)
    expect(gcd(2, 8)).toBe(2)
    expect(gcd(0, 5)).toBe(5)
  })

  it('willMeet：相对速度 1 时任何距离都相遇', () => {
    for (let b = 1; b <= 12; b += 1) {
      for (let gap = 0; gap < b; gap += 1) {
        expect(willMeet(gap, 1, b)).toBe(true)
      }
    }
  })

  it('willMeet：相对速度与环长不互素时，距离可能永远跳不到 0', () => {
    // 环长 6、相对速度 2（快 3 慢 1），距离 1 → 3 → 5 → 1 … 永远不是 0
    expect(willMeet(1, 2, 6)).toBe(false)
    expect(willMeet(3, 2, 6)).toBe(false)
    expect(willMeet(5, 2, 6)).toBe(false)
    // 偶数距离可以
    expect(willMeet(2, 2, 6)).toBe(true)
    expect(willMeet(4, 2, 6)).toBe(true)
    // 环长奇数时 gcd(2, b) = 1，任何距离都相遇
    for (let gap = 0; gap < 5; gap += 1) expect(willMeet(gap, 2, 5)).toBe(true)
  })

  it('Floyd 的 D₀ = (a·closing) mod b 永远满足 willMeet —— 这是"必然相遇"的根', () => {
    for (let fastStep = 2; fastStep <= 5; fastStep += 1) {
      const closing = fastStep - 1
      for (let a = 0; a <= 12; a += 1) {
        for (let b = 1; b <= 12; b += 1) {
          const d0 = (a * closing) % b
          expect(
            willMeet(d0, closing, b),
            `fastStep=${fastStep} a=${a} b=${b} d0=${d0}`,
          ).toBe(true)
        }
      }
    }
  })
})
