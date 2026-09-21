import { describe, it, expect } from 'vitest'
import { buildMergeSteps } from '../mergeSteps'

const valAt = (a, b) => (t) => (t.list === 'a' ? a : b)[t.i]

describe('buildMergeSteps — 合并两个有序链表推演', () => {
  it('步数符合结构：1 + 2×循环次数 + 收尾 + 完成（非空输入必有收尾）', () => {
    // [1,2,4] 与 [1,3,4]：循环 5 次（10 步）+ B 残段收尾 + done
    expect(buildMergeSteps([1, 2, 4], [1, 3, 4])).toHaveLength(13)
    // [1] 与 [2]：循环 1 次后 A 走空，B 的 2 整段接上
    expect(buildMergeSteps([1], [2])).toHaveLength(5)
    // [1,2] 与 [3]：循环 2 次后 A 恰好走空，B 的 3 收尾
    expect(buildMergeSteps([1, 2], [3])).toHaveLength(7)
    // [1,5,9] 与 [2]：循环 2 次后 B 走空，A 剩 5、9 收尾
    expect(buildMergeSteps([1, 5, 9], [2])).toHaveLength(7)
  })

  it('合并结果正确：1,2,4 与 1,3,4 合并得 1,1,2,3,4,4', () => {
    const a = [1, 2, 4]
    const b = [1, 3, 4]
    const steps = buildMergeSteps(a, b)
    const last = steps[steps.length - 1]
    expect(last.taken.map(valAt(a, b))).toEqual([1, 1, 2, 3, 4, 4])
    expect(last.done).toBe(true)
  })

  it('相等值时取 A（习惯约定，且说明文字里讲清楚）', () => {
    const steps = buildMergeSteps([1, 2, 4], [1, 3, 4])
    // 第 1 步是比较 1 vs 1，第 2 步把 A 的 1 接上
    expect(steps[1].phase).toBe('compare')
    expect(steps[1].cursor).toBe('a')
    expect(steps[2].taken[0]).toEqual({ list: 'a', i: 0 })
    expect(steps[1].desc).toContain('相等')
  })

  it('compare → take 严格交替，compare 步高亮的是本轮胜出的那一边', () => {
    const steps = buildMergeSteps([1, 2, 4], [1, 3, 4])
    const phases = steps.map((s) => s.phase)
    expect(phases[0]).toBe('init')
    expect(phases[phases.length - 1]).toBe('done')
    // 中间的循环体：compare/take 交替
    const loop = phases.slice(1, -2)
    for (let k = 0; k < loop.length; k += 2) {
      expect(loop[k]).toBe('compare')
      expect(loop[k + 1]).toBe('take')
    }
    // 第 2 轮比较是 2 vs 1，B 胜
    expect(steps[3].cursor).toBe('b')
  })

  it('指针越过链表尾后变成 null（渲染层靠它画 ∅）', () => {
    const steps = buildMergeSteps([1, 2, 4], [1, 3, 4])
    const restStep = steps.find((s) => s.phase === 'append-rest')
    // 收尾时 A 已走完（p1 = null），B 还剩一个（p2 = 2）
    expect(restStep.p1).toBeNull()
    expect(restStep.p2).toBe(2)
    const last = steps[steps.length - 1]
    expect(last.p1).toBeNull()
    expect(last.p2).toBeNull()
  })

  it('收尾步：剩的是 B，整段从断点接上，rest 标记来源', () => {
    const steps = buildMergeSteps([1, 2, 4], [1, 3, 4])
    const restStep = steps.find((s) => s.phase === 'append-rest')
    expect(restStep.rest).toEqual({ list: 'b', from: 2 })
    expect(restStep.taken[restStep.taken.length - 1]).toEqual({ list: 'b', i: 2 })
    expect(restStep.desc).toContain('整段')
  })

  it('收尾步：剩的是 A 时同理（B 先耗尽的场景）', () => {
    const steps = buildMergeSteps([1, 5, 9], [2])
    const restStep = steps.find((s) => s.phase === 'append-rest')
    expect(restStep.rest).toEqual({ list: 'a', from: 1 })
    const b = [2]
    expect(restStep.taken.slice(2).map(valAt([1, 5, 9], b))).toEqual([5, 9])
  })

  it('非空输入必有收尾步：循环一次只取一个节点，另一侧必有剩余', () => {
    for (const [a, b] of [[[1], [2]], [[1, 2], [3]], [[2], [1, 2]]]) {
      expect(buildMergeSteps(a, b).some((s) => s.phase === 'append-rest')).toBe(true)
    }
  })

  it('两条空链表：只有一步，直接结束', () => {
    const steps = buildMergeSteps([], [])
    expect(steps).toHaveLength(1)
    expect(steps[0]).toMatchObject({ phase: 'init', done: true })
    expect(steps[0].taken).toEqual([])
  })

  it('一方为空：一步结束，说明文字讲清「合并 = 原样返回另一条」', () => {
    const steps = buildMergeSteps([], [2, 3])
    expect(steps).toHaveLength(1)
    expect(steps[0].done).toBe(true)
    expect(steps[0].desc).toContain('A 是空链表')
    expect(steps[0].desc).toContain('2、3')

    const flipped = buildMergeSteps([4], [])
    expect(flipped).toHaveLength(1)
    expect(flipped[0].desc).toContain('B 是空链表')
  })

  it('taken 快照是独立副本，后一步的操作不会污染前一步', () => {
    const a = [1, 2, 4]
    const b = [1, 3, 4]
    const steps = buildMergeSteps(a, b)
    const second = steps[2].taken // 已接 1 个：A 的 1
    const fourth = steps[4].taken // 已接 2 个：A 的 1、B 的 1
    expect(second).not.toBe(fourth)
    expect(second.map(valAt(a, b))).toEqual([1])
    expect(fourth.map(valAt(a, b))).toEqual([1, 1])
  })

  it('说明文字带真实数值，不是占位符', () => {
    const steps = buildMergeSteps([1, 2, 4], [1, 3, 4])
    expect(steps[0].desc).toContain('哑结点')
    expect(steps[1].desc).toContain('1')
    expect(steps[steps.length - 1].desc).toContain('dummy.next')
  })

  it('说明文字里的反引号和双星号都成对出现（渲染层按标记切分，奇数会错位）', () => {
    for (const [a, b] of [[], [1], [1, 2, 4], [1, 3, 4], [1, 5, 9], [2]]) {
      for (const step of buildMergeSteps(a, b)) {
        const ticks = (step.desc.match(/`/g) || []).length
        expect(ticks % 2, `反引号奇数: ${step.desc}`).toBe(0)
        const stars = (step.desc.match(/\*\*/g) || []).length
        expect(stars % 2, `双星号奇数: ${step.desc}`).toBe(0)
      }
    }
  })

  it('非数字元素（字符串）也能按同样规则合并', () => {
    const steps = buildMergeSteps(['a', 'c'], ['b'])
    const last = steps[steps.length - 1]
    expect(last.taken.map(valAt(['a', 'c'], ['b']))).toEqual(['a', 'b', 'c'])
    expect(last.desc).toContain('c')
  })
})
