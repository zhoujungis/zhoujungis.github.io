import { describe, it, expect } from 'vitest'
import { buildMergeKDCSeps } from '../mergeKDCSeps'

const DEMO = [[7], [2], [5], [1], [8], [3], [6], [4]]

describe('buildMergeKDCSeps — 合并 K 个升序链表（分治两两合并）推演', () => {
  it('步数 = 1 起始 + ⌈log₂K⌉ 轮 + 1 收尾', () => {
    expect(buildMergeKDCSeps(DEMO)).toHaveLength(1 + 3 + 1) // K=8 → 3 轮
    expect(buildMergeKDCSeps([[1], [2], [3], [4]])).toHaveLength(1 + 2 + 1) // K=4 → 2 轮
    expect(buildMergeKDCSeps([[1], [2]])).toHaveLength(1 + 1 + 1) // K=2 → 1 轮
    // K=5 → ⌈log₂5⌉ = 3 轮
    expect(buildMergeKDCSeps([[1], [2], [3], [4], [5]])).toHaveLength(1 + 3 + 1)
  })

  it('合并结果正确：[[7],[2],[5],[1],[8],[3],[6],[4]] → 1..8', () => {
    const steps = buildMergeKDCSeps(DEMO)
    const last = steps[steps.length - 1]
    expect(last.levels[last.levels.length - 1].lists).toEqual([[1, 2, 3, 4, 5, 6, 7, 8]])
    expect(last.done).toBe(true)
  })

  it('每一层的节点总数都是 N（只是分组粒度变粗）—— 这是"每轮 O(N)"的可视证据', () => {
    const steps = buildMergeKDCSeps(DEMO)
    const last = steps[steps.length - 1]
    const N = 8
    for (const level of last.levels) {
      const total = level.lists.reduce((sum, l) => sum + l.length, 0)
      expect(total).toBe(N)
    }
  })

  it('每轮之后链表条数严格减半（向上取整），最后一轮剩 1 条', () => {
    const steps = buildMergeKDCSeps(DEMO)
    const last = steps[steps.length - 1]
    const counts = last.levels.map((lv) => lv.lists.length)
    expect(counts).toEqual([8, 4, 2, 1])
    for (let r = 1; r < counts.length; r += 1) {
      expect(counts[r]).toBe(Math.ceil(counts[r - 1] / 2))
    }
  })

  it('每一轮的 from 指向上一层真实的配对下标，且不重不漏', () => {
    const steps = buildMergeKDCSeps(DEMO)
    const last = steps[steps.length - 1]
    for (let r = 1; r < last.levels.length; r += 1) {
      const prevCount = last.levels[r - 1].lists.length
      const from = last.levels[r].from
      const covered = []
      from.forEach(([i, j]) => {
        expect(i).toBeGreaterThanOrEqual(0)
        expect(i).toBeLessThan(prevCount)
        covered.push(i)
        if (j >= 0) {
          expect(j).toBeLessThan(prevCount)
          covered.push(j)
        } else {
          // 轮空只可能出现在最后一条
          expect(i).toBe(prevCount - 1)
        }
      })
      expect([...covered].sort((a, b) => a - b)).toEqual(
        Array.from({ length: prevCount }, (_, k) => k),
      )
    }
  })

  it('奇数条时最后一条轮空（from 里用 -1 标记），不丢节点', () => {
    const steps = buildMergeKDCSeps([[1], [2], [3]])
    const last = steps[steps.length - 1]
    expect(last.levels[1].from).toEqual([
      [0, 1],
      [2, -1],
    ])
    expect(last.levels[1].lists).toEqual([[1, 2], [3]])
    expect(last.levels[2].lists).toEqual([[1, 2, 3]])
    const mergeStep = steps.find((s) => s.phase === 'merge' && s.rounds === 1)
    expect(mergeStep.desc).toContain('轮空')
  })

  it('每轮的工作量（被摸到的节点数）不超过 N', () => {
    const steps = buildMergeKDCSeps(DEMO)
    for (const s of steps.filter((x) => x.phase === 'merge')) {
      const m = /被摸到的节点一共 (\d+) 个/.exec(s.desc)
      expect(m, `读不到工作量: ${s.desc}`).not.toBeNull()
      expect(Number(m[1])).toBeLessThanOrEqual(8)
    }
  })

  it('levels 快照是独立副本，后一步的合并不会污染前一步', () => {
    const steps = buildMergeKDCSeps(DEMO)
    expect(steps[0].levels).toHaveLength(1)
    expect(steps[1].levels).toHaveLength(2)
    expect(steps[0].levels[0].lists).toEqual(DEMO.map((l) => l.slice()))
    expect(steps[0].levels[0].from).toBeNull()
    // 第 1 轮的合并结果不能出现在起始步里
    expect(steps[0].levels[0].lists).not.toEqual(steps[1].levels[1].lists)
  })

  it('activeLevel 指向本步刚出现的那一层', () => {
    const steps = buildMergeKDCSeps(DEMO)
    expect(steps.map((s) => s.activeLevel)).toEqual([0, 1, 2, 3, 3])
    expect(steps.map((s) => s.rounds)).toEqual([0, 1, 2, 3, 3])
  })

  it('空数组：只有一步，直接结束', () => {
    const steps = buildMergeKDCSeps([])
    expect(steps).toHaveLength(1)
    expect(steps[0]).toMatchObject({ phase: 'init', done: true })
    expect(steps[0].levels).toEqual([])
    expect(steps[0].desc).toContain('空数组')
  })

  it('只有一条链表：一步结束，轮数为 0', () => {
    const steps = buildMergeKDCSeps([[3, 1, 2].sort()])
    expect(steps).toHaveLength(1)
    expect(steps[0].done).toBe(true)
    expect(steps[0].desc).toContain('⌈log₂1⌉ = 0')
  })

  it('空链表参与合并时按"空 + x = x"处理', () => {
    const steps = buildMergeKDCSeps([[], [2, 3], [], [1]])
    const last = steps[steps.length - 1]
    expect(last.levels[last.levels.length - 1].lists).toEqual([[1, 2, 3]])
  })

  it('各条链表长度不等也能合并正确', () => {
    const lists = [[1, 5, 9], [2], [0, 3, 4, 10], [6, 7]]
    const steps = buildMergeKDCSeps(lists)
    const last = steps[steps.length - 1]
    expect(last.levels[last.levels.length - 1].lists).toEqual([
      [0, 1, 2, 3, 4, 5, 6, 7, 9, 10],
    ])
  })

  it('入参不被修改', () => {
    const lists = [
      [1, 4],
      [2, 5],
    ]
    const copy = JSON.parse(JSON.stringify(lists))
    buildMergeKDCSeps(lists)
    expect(lists).toEqual(copy)
  })

  it('说明文字里的反引号和双星号都成对出现（渲染层按标记切分，奇数会错位）', () => {
    for (const lists of [[], [[]], DEMO, [[1], [2], [3]], [[1, 2], [3]]]) {
      for (const step of buildMergeKDCSeps(lists)) {
        const ticks = (step.desc.match(/`/g) || []).length
        expect(ticks % 2, `反引号奇数: ${step.desc}`).toBe(0)
        const stars = (step.desc.match(/\*\*/g) || []).length
        expect(stars % 2, `双星号奇数: ${step.desc}`).toBe(0)
      }
    }
  })

  it('末步说明文字里点出 O(N log K) 与轮数', () => {
    const steps = buildMergeKDCSeps(DEMO)
    const last = steps[steps.length - 1]
    expect(last.desc).toContain('O(N log K)')
    expect(last.desc).toContain('3 轮')
  })
})
