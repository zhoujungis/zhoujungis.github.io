import { describe, it, expect } from 'vitest'
import { buildMergeKListsSteps } from '../mergeKListsSteps'

const valAt = (lists) => (t) => lists[t.list][t.i]

/** 小顶堆不变式：每个节点都不大于它的两个孩子（比较键 = 值, 链表序号）。 */
function isMinHeap(step, lists) {
  const key = (n) => [lists[n.list][n.i], n.list]
  const less = (a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])
  const h = step.heap
  for (let i = 0; i < h.length; i += 1) {
    for (const child of [2 * i + 1, 2 * i + 2]) {
      if (child < h.length && less(key(h[child]), key(h[i]))) return false
    }
  }
  return true
}

const DEMO = [
  [1, 4],
  [2, 5],
  [3, 6],
  [0, 7],
]

describe('buildMergeKListsSteps — 合并 K 个升序链表（小顶堆）推演', () => {
  it('步数 = 1 建堆 + N 次取节点 + 1 收尾', () => {
    expect(buildMergeKListsSteps(DEMO)).toHaveLength(1 + 8 + 1)
    // K=3，节点数 3+3+2=8：1 + 8 + 1
    expect(buildMergeKListsSteps([[1, 4, 5], [1, 3, 4], [2, 6]])).toHaveLength(10)
    // 单条链表：还是 1 + N + 1
    expect(buildMergeKListsSteps([[3, 1, 2].sort()])).toHaveLength(5)
  })

  it('合并结果正确：[[1,4],[2,5],[3,6],[0,7]] → 0..7', () => {
    const lists = DEMO
    const steps = buildMergeKListsSteps(lists)
    const last = steps[steps.length - 1]
    expect(last.taken.map(valAt(lists))).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
    expect(last.done).toBe(true)
  })

  it('K 条各不相同的长度也能合并正确', () => {
    const lists = [[1, 5, 9], [2], [0, 3, 4, 10]]
    const steps = buildMergeKListsSteps(lists)
    const last = steps[steps.length - 1]
    expect(last.taken.map(valAt(lists))).toEqual([0, 1, 2, 3, 4, 5, 9, 10])
  })

  it('核心不变式：堆里永远只有「每条链表当前头部」，元素个数 ≤ K', () => {
    const steps = buildMergeKListsSteps(DEMO)
    for (const step of steps) {
      expect(step.heap.length).toBeLessThanOrEqual(DEMO.length)
      // 堆里每个元素都必须正好是它所在链表的当前头
      for (const n of step.heap) {
        expect(step.cursors[n.list]).toBe(n.i)
      }
    }
  })

  it('核心不变式：每一步的堆都是合法小顶堆', () => {
    for (const lists of [DEMO, [[1, 4, 5], [1, 3, 4], [2, 6]], [[5], [5], [5]], [[2, 2], [1, 1]]]) {
      for (const step of buildMergeKListsSteps(lists)) {
        expect(isMinHeap(step, lists), `heap 失序: ${JSON.stringify(step.heap)}`).toBe(true)
      }
    }
  })

  it('堆顶就是当前全局最小 —— 每步取走的都等于所有未取节点里的最小值', () => {
    const lists = DEMO
    const steps = buildMergeKListsSteps(lists)
    const all = lists.flat().sort((a, b) => a - b)
    steps
      .filter((s) => s.phase === 'take')
      .forEach((s, k) => {
        expect(lists[s.popped.list][s.popped.i]).toBe(all[k])
      })
  })

  it('出堆的元素本步一定不在堆里；入堆的元素本步一定在堆里', () => {
    for (const step of buildMergeKListsSteps(DEMO).filter((s) => s.phase === 'take')) {
      const inHeap = (n) => step.heap.some((h) => h.list === n.list && h.i === n.i)
      expect(inHeap(step.popped)).toBe(false)
      if (step.pushed) expect(inHeap(step.pushed)).toBe(true)
    }
  })

  it('链表走完后 cursors 变 null，且不再补位（堆会随之变小）', () => {
    const steps = buildMergeKListsSteps(DEMO)
    const sizes = steps.map((s) => s.heap.length)
    // 4 → …→ 0 单调不增（堆只会因为链表耗尽而变小）
    for (let k = 1; k < sizes.length; k += 1) {
      expect(sizes[k]).toBeLessThanOrEqual(sizes[k - 1])
    }
    expect(sizes[0]).toBe(4)
    expect(sizes[sizes.length - 1]).toBe(0)

    const lastPush = steps.filter((s) => s.phase === 'take' && s.pushed).length
    // 每条链表最后一个节点被取走时不会补位 → 入堆次数 = N - K
    expect(lastPush).toBe(8 - 4)

    const final = steps[steps.length - 1]
    expect(final.cursors).toEqual([null, null, null, null])
  })

  it('值相等时按链表序号定序（推演可复现，也对应 Python 里用序号垫背的写法）', () => {
    const lists = [[1, 2], [1, 2]]
    const steps = buildMergeKListsSteps(lists)
    const last = steps[steps.length - 1]
    expect(last.taken).toEqual([
      { list: 0, i: 0 },
      { list: 1, i: 0 },
      { list: 0, i: 1 },
      { list: 1, i: 1 },
    ])
    // 建堆那一步：两个 1 并列时 A 在前
    expect(steps[0].heap[0]).toEqual({ list: 0, i: 0 })
  })

  it('空数组：只有一步，直接结束', () => {
    const steps = buildMergeKListsSteps([])
    expect(steps).toHaveLength(1)
    expect(steps[0]).toMatchObject({ phase: 'init', done: true })
    expect(steps[0].taken).toEqual([])
    expect(steps[0].desc).toContain('空数组')
  })

  it('全是空链表：只有一步，说明文字点出「堆建起来是空的」', () => {
    const steps = buildMergeKListsSteps([[], [], []])
    expect(steps).toHaveLength(1)
    expect(steps[0].done).toBe(true)
    expect(steps[0].desc).toContain('全是空的')
  })

  it('部分链表为空：只把非空的头部入堆', () => {
    const lists = [[], [2, 3], [], [1]]
    const steps = buildMergeKListsSteps(lists)
    expect(steps[0].heap).toHaveLength(2)
    expect(steps[0].desc).toContain('2 条链表的')
    const last = steps[steps.length - 1]
    expect(last.taken.map(valAt(lists))).toEqual([1, 2, 3])
  })

  it('单条链表：结果就是它本身（堆里始终只有 1 个元素）', () => {
    const lists = [[1, 2, 3]]
    const steps = buildMergeKListsSteps(lists)
    expect(steps.filter((s) => s.phase === 'take')).toHaveLength(3)
    for (const step of steps) expect(step.heap.length).toBeLessThanOrEqual(1)
    expect(steps[steps.length - 1].taken.map(valAt(lists))).toEqual([1, 2, 3])
  })

  it('taken 快照是独立副本，后一步的操作不会污染前一步', () => {
    const lists = DEMO
    const steps = buildMergeKListsSteps(lists)
    // steps[0] 是建堆，之后每步取一个：steps[k] 的 taken 长度就是 k
    const second = steps[2].taken
    const fourth = steps[4].taken
    expect(second).not.toBe(fourth)
    expect(second.map(valAt(lists))).toEqual([0, 1])
    expect(fourth.map(valAt(lists))).toEqual([0, 1, 2, 3])
  })

  it('入参不被修改', () => {
    const lists = [
      [1, 4],
      [2, 5],
    ]
    const copy = JSON.parse(JSON.stringify(lists))
    buildMergeKListsSteps(lists)
    expect(lists).toEqual(copy)
  })

  it('说明文字里的反引号和双星号都成对出现（渲染层按标记切分，奇数会错位）', () => {
    for (const lists of [[], [[]], DEMO, [[1], [2], [3]], [[], [4]]]) {
      for (const step of buildMergeKListsSteps(lists)) {
        const ticks = (step.desc.match(/`/g) || []).length
        expect(ticks % 2, `反引号奇数: ${step.desc}`).toBe(0)
        const stars = (step.desc.match(/\*\*/g) || []).length
        expect(stars % 2, `双星号奇数: ${step.desc}`).toBe(0)
      }
    }
  })

  it('说明文字带真实数值，不是占位符', () => {
    const steps = buildMergeKListsSteps(DEMO)
    expect(steps[0].desc).toContain('头节点')
    expect(steps[0].desc).toContain('不是 8 个')
    expect(steps[1].desc).toContain('堆顶')
    expect(steps[steps.length - 1].desc).toContain('dummy.next')
  })

  it('字符串元素也能按同样规则合并', () => {
    const lists = [
      ['a', 'd'],
      ['b', 'c'],
    ]
    const steps = buildMergeKListsSteps(lists)
    expect(steps[steps.length - 1].taken.map(valAt(lists))).toEqual(['a', 'b', 'c', 'd'])
  })
})
