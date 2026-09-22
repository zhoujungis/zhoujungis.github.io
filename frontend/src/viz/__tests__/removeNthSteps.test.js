import { describe, it, expect } from 'vitest'
import { buildRemoveNthSteps } from '../removeNthSteps'

/** 文章里的演示用例：1→2→3→4→5，删倒数第 2 个（节点 4）。 */
const DEMO = { values: [1, 2, 3, 4, 5], n: 2 }

/**
 * 独立暴力模拟：直接按「指针走节点」推，不复用被测代码的循环结构。
 * 返回删除后的值序列；n 越界（> L）时抛错模拟真实实现的空指针。
 */
function bruteForce(values, n) {
  const L = values.length
  if (n > L) throw new Error('fast fell off the list')
  const next = Array.from({ length: L + 1 }, (_, i) => (i + 1 <= L ? i + 1 : null)) // slot: 0=dummy
  let fast = 0
  for (let k = 0; k < n + 1; k += 1) fast = next[fast]
  let slow = 0
  while (fast !== null) {
    fast = next[fast]
    slow = next[slow]
  }
  next[slow] = next[slow + 1]
  // 从 dummy.next（slot 1）收集存活的值
  const out = []
  let cur = next[0]
  while (cur !== null) {
    out.push(values[cur - 1])
    cur = next[cur]
  }
  return out
}

/** 把某一帧的 links 快照还原成当前存活的值序列。 */
function snapshotList(step, values) {
  const out = []
  let cur = step.links[0]
  while (cur !== null) {
    out.push(values[cur - 1])
    cur = step.links[cur]
  }
  return out
}

describe('buildRemoveNthSteps — 删除倒数第 N 个结点推演', () => {
  it('演示用例：最终删掉 4，得到 1→2→3→5', () => {
    const steps = buildRemoveNthSteps(DEMO.values, DEMO.n)
    const last = steps[steps.length - 1]
    expect(last.done).toBe(true)
    expect(last.cutSlot).toBe(4) // 节点 4 的 slot
    expect(snapshotList(last, DEMO.values)).toEqual([1, 2, 3, 5])
  })

  it('步数 = 1 初始 + (n+1) 先走 + (L-n) 同步 + 1 删除 + 1 收尾', () => {
    const steps = buildRemoveNthSteps(DEMO.values, DEMO.n)
    expect(steps).toHaveLength(1 + 3 + 3 + 1 + 1)
    expect(steps[0].phase).toBe('init')
    expect(steps.slice(1, 4).every((s) => s.phase === 'lead')).toBe(true)
    expect(steps.slice(4, 7).every((s) => s.phase === 'sync')).toBe(true)
    expect(steps[7].phase).toBe('cut')
    expect(steps[8].phase).toBe('done')
  })

  it('先走阶段 slow 始终停在 dummy（slot 0），间隔逐步拉开到 n+1', () => {
    const steps = buildRemoveNthSteps(DEMO.values, DEMO.n)
    const lead = steps.filter((s) => s.phase === 'lead')
    expect(lead.map((s) => s.fast)).toEqual([1, 2, 3])
    expect(lead.every((s) => s.slow === 0)).toBe(true)
    expect(lead[lead.length - 1].gap).toBe(3)
  })

  it('同步阶段间隔保持 n+1 不变（循环不变量），fast 最终落到 null', () => {
    const steps = buildRemoveNthSteps(DEMO.values, DEMO.n)
    const syncing = steps.filter((s) => s.phase === 'sync' && s.fast !== null)
    expect(syncing.map((s) => s.fast)).toEqual([4, 5])
    expect(syncing.every((s) => s.gap === 3)).toBe(true)
    const lastSync = steps.filter((s) => s.phase === 'sync').at(-1)
    expect(lastSync.fast).toBeNull()
    expect(lastSync.slow).toBe(3) // 节点 3 的 slot = 待删节点 4 的前驱
  })

  it('cut 帧：links 里 3 的出边直接指向 5，4 被摘掉', () => {
    const steps = buildRemoveNthSteps(DEMO.values, DEMO.n)
    const cut = steps.find((s) => s.phase === 'cut')
    expect(cut.links[3]).toBe(5) // slot 3（节点 3）→ slot 5（节点 5）
    expect(snapshotList(cut, DEMO.values)).toEqual([1, 2, 3, 5])
  })

  it('n = L（删头）：fast 先走恰好落到 null，slow 留在 dummy，结果为去掉头节点的链', () => {
    const steps = buildRemoveNthSteps([1, 2], 2)
    const last = steps[steps.length - 1]
    expect(last.cutSlot).toBe(1)
    expect(snapshotList(last, [1, 2])).toEqual([2])
    // fast 先走 n+1 = 3 步，从 dummy 出发正好落到 null（n 等于链长）
    const lead = steps.filter((s) => s.phase === 'lead')
    expect(lead).toHaveLength(3)
    expect(lead.at(-1).fast).toBeNull()
    // 同步阶段一步不走
    expect(steps.filter((s) => s.phase === 'sync')).toHaveLength(0)
  })

  it('n = 1（删尾）：删掉最后一个节点', () => {
    const steps = buildRemoveNthSteps([1, 2, 3], 1)
    const last = steps[steps.length - 1]
    expect(last.cutSlot).toBe(3)
    expect(snapshotList(last, [1, 2, 3])).toEqual([1, 2])
  })

  it('单节点链：n = 1 时返回空链', () => {
    const steps = buildRemoveNthSteps([7], 1)
    const last = steps[steps.length - 1]
    expect(last.cutSlot).toBe(1)
    expect(snapshotList(last, [7])).toEqual([])
  })

  it('与暴力模拟对照：多种 (values, n) 组合的最终链一致', () => {
    const cases = [
      [[1, 2, 3, 4, 5], 1],
      [[1, 2, 3, 4, 5], 2],
      [[1, 2, 3, 4, 5], 5],
      [[1, 2], 1],
      [[1], 1],
      [[1, 2, 3, 4, 6, 7, 8, 9, 10], 4],
    ]
    for (const [values, n] of cases) {
      const steps = buildRemoveNthSteps(values, n)
      const expected = bruteForce(values, n)
      expect(snapshotList(steps.at(-1), values)).toEqual(expected)
    }
  })

  it('只有 cut 及之后的帧改变拓扑，cut 之前所有帧保持初始 links', () => {
    const steps = buildRemoveNthSteps(DEMO.values, DEMO.n)
    const initial = steps[0].links.join(',')
    let mutated = false
    for (const s of steps.slice(1)) {
      if (s.phase === 'cut') mutated = true
      if (!mutated) {
        expect(s.links.join(',')).toBe(initial)
      } else {
        expect(s.links.join(',')).not.toBe(initial)
      }
    }
  })
})
