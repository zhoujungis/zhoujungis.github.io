import { describe, it, expect } from 'vitest'
import { buildSteps } from '../linkedListSteps'

describe('buildSteps — 反转链表推演', () => {
  it('步数 = 1 + 3n（初始 + 每个节点 3 步）', () => {
    expect(buildSteps([1, 2, 3, 4, 5])).toHaveLength(16)
    expect(buildSteps([1])).toHaveLength(4)
    expect(buildSteps([])).toHaveLength(1)
  })

  it('空链表只有一步，且直接结束', () => {
    const steps = buildSteps([])
    expect(steps[0].phase).toBe('init')
    expect(steps[0].curr).toBeNull()
    expect(steps[0].prev).toBeNull()
    expect(steps[0].done).toBe(true)
  })

  it('单节点链表：走完一轮后 prev 指向它、curr 为 null', () => {
    const steps = buildSteps([7])
    expect(steps[0]).toMatchObject({ prev: null, curr: 0, next: null })
    const last = steps[steps.length - 1]
    expect(last.prev).toBe(0)
    expect(last.curr).toBeNull()
    expect(last.nextOf).toEqual([null])
    expect(last.done).toBe(true)
  })

  it('最后一步：所有箭头反向，且只有首节点指向 ∅', () => {
    const steps = buildSteps([1, 2, 3, 4, 5])
    const last = steps[steps.length - 1]
    // 原本 nextOf = [1,2,3,4,null]；反转后 = [null,0,1,2,3]
    expect(last.nextOf).toEqual([null, 0, 1, 2, 3])
    expect(last.prev).toBe(4)
    expect(last.curr).toBeNull()
    expect(last.done).toBe(true)
  })

  it('每个节点恰好被翻转一次（curr.next = prev 只发生 n 次）', () => {
    const steps = buildSteps([1, 2, 3, 4, 5])
    expect(steps.filter((s) => s.phase === 'flip')).toHaveLength(5)
    expect(steps.filter((s) => s.phase === 'read-next')).toHaveLength(5)
    expect(steps.filter((s) => s.phase === 'advance')).toHaveLength(5)
  })

  it('翻转发生在读完 next 之后，顺序不能颠倒', () => {
    const steps = buildSteps([1, 2, 3])
    const phases = steps.map((s) => s.phase)
    expect(phases).toEqual([
      'init',
      'read-next', 'flip', 'advance',
      'read-next', 'flip', 'advance',
      'read-next', 'flip', 'advance',
    ])
  })

  it('read-next 步里 next 一定等于 curr 原本的 next（不会读到已被改写的值）', () => {
    const values = [10, 20, 30, 40]
    const steps = buildSteps(values)
    // 第 0 步时每个节点的原始 next
    const original = steps[0].nextOf.slice()

    for (const step of steps) {
      if (step.phase !== 'read-next') continue
      expect(step.next).toBe(original[step.curr])
    }
  })

  it('每个快照的 nextOf 都是独立副本（改后一步不会污染前一步）', () => {
    const steps = buildSteps([1, 2, 3])
    const first = steps[0].nextOf
    const last = steps[steps.length - 1].nextOf
    expect(first).toEqual([1, 2, null])
    expect(last).toEqual([null, 0, 1])
    expect(first).not.toBe(last)
  })

  it('prev 永远落后 curr 一步（或在两端）', () => {
    const steps = buildSteps([1, 2, 3, 4, 5])
    for (const step of steps) {
      if (step.prev === null || step.curr === null) continue
      expect(step.curr - step.prev).toBeGreaterThan(0)
    }
  })

  it('说明文字里带上了真实数值，不是占位符', () => {
    const steps = buildSteps([1, 2, 3])
    expect(steps[0].desc).toContain('1')
    const flip = steps.find((s) => s.phase === 'flip')
    expect(flip.desc).toContain('∅')
    const advance = steps[steps.length - 1]
    expect(advance.desc).toContain('3')
  })

  it('说明文字里的反引号成对出现（奇数个会让等宽片段渲染错位）', () => {
    for (const values of [[], [1], [1, 2, 3, 4, 5]]) {
      for (const step of buildSteps(values)) {
        const ticks = (step.desc.match(/`/g) || []).length
        expect(ticks % 2, `步 ${step.phase} 的反引号是奇数: ${step.desc}`).toBe(0)
      }
    }
  })

  it('非数字元素（比如字符串）也能正常推演', () => {
    const steps = buildSteps(['a', 'b'])
    const last = steps[steps.length - 1]
    expect(last.nextOf).toEqual([null, 0])
    expect(last.desc).toContain('b')
  })
})
