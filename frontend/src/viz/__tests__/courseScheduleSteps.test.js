/**
 * courseScheduleSteps.test.js — LC 207/210 Kahn（入度表 + 队列）状态机单测。
 *
 * 交叉验证：状态机 vs ① 独立 Kahn 参考解 ② 独立三色 DFS 判环
 * ③ 「返回的 order 是否是合法拓扑序」逐边核验。
 * 逐帧钉死：init 队列 = 全部 0 入度、每课最多出入队一次、入度单调减不越界、
 * order 恰在 pop 帧追加、done.possible 与三个参考解一致。
 */
import { describe, it, expect } from 'vitest'
import { buildCourseScheduleSteps } from '../courseScheduleSteps.js'

/** 参考解一：独立 Kahn（返回 { possible, order }）。 */
const refKahn = (numCourses, prerequisites) => {
  const adj = Array.from({ length: numCourses }, () => [])
  const indeg = new Array(numCourses).fill(0)
  for (const [a, b] of prerequisites) {
    adj[b].push(a)
    indeg[a] += 1
  }
  const q = []
  for (let v = 0; v < numCourses; v += 1) if (indeg[v] === 0) q.push(v)
  const order = []
  while (q.length) {
    const cur = q.shift()
    order.push(cur)
    for (const next of adj[cur]) {
      indeg[next] -= 1
      if (indeg[next] === 0) q.push(next)
    }
  }
  return { possible: order.length === numCourses, order }
}

/** 参考解二：独立三色 DFS 判环。 */
const refHasCycle = (numCourses, prerequisites) => {
  const adj = Array.from({ length: numCourses }, () => [])
  for (const [a, b] of prerequisites) adj[b].push(a)
  const color = new Array(numCourses).fill(0) // 0 白 1 灰 2 黑
  let cycle = false
  const dfs = (v) => {
    color[v] = 1
    for (const next of adj[v]) {
      if (color[next] === 1) cycle = true
      else if (color[next] === 0) dfs(next)
    }
    color[v] = 2
  }
  for (let v = 0; v < numCourses; v += 1) if (color[v] === 0) dfs(v)
  return cycle
}

/** 核验 order 是合法拓扑序：每条边 b → a 都满足 pos[b] < pos[a]。 */
const isTopoOrder = (order, prerequisites) => {
  const pos = new Map(order.map((v, i) => [v, i]))
  for (const [a, b] of prerequisites) {
    if (!(pos.get(b) < pos.get(a))) return false
  }
  return true
}

const DEFAULTS = { numCourses: 4, prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]] }

const CASES = [
  { numCourses: 4, prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]], want: true },
  { numCourses: 2, prerequisites: [[1, 0]], want: true },
  { numCourses: 2, prerequisites: [[1, 0], [0, 1]], want: false },
  { numCourses: 1, prerequisites: [[0, 0]], want: false }, // 自环
  { numCourses: 5, prerequisites: [], want: true },
  { numCourses: 0, prerequisites: [], want: true },
  { numCourses: 3, prerequisites: [[1, 0], [1, 0], [2, 1]], want: true }, // 重边
  { numCourses: 4, prerequisites: [[1, 0], [2, 1], [3, 2]], want: true }, // 单链
  { numCourses: 6, prerequisites: [[1, 0], [3, 2], [4, 3]], want: true }, // 两个连通块
  { numCourses: 4, prerequisites: [[1, 0], [2, 1], [1, 2], [3, 0]], want: false }, // 环 + 悬挂
]

describe('courseScheduleSteps（LC 207/210 Kahn）', () => {
  it.each(CASES)('possibility 与两个参考解一致：want %#', (c) => {
    const steps = buildCourseScheduleSteps(c)
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    const ref = refKahn(c.numCourses, c.prerequisites)
    expect(done.answer.possible).toBe(c.want)
    expect(done.answer.possible).toBe(ref.possible)
    expect(done.answer.possible).toBe(!refHasCycle(c.numCourses, c.prerequisites))
  })

  it.each(CASES)('帧骨架与不变量：%j', (c) => {
    const steps = buildCourseScheduleSteps(c)
    const init = steps[0]
    const done = steps.at(-1)

    // init：队列 = 全部 0 入度（升序），order 为空
    const zeroDeg = []
    const indeg0 = new Array(c.numCourses).fill(0)
    for (const [a, b] of c.prerequisites) indeg0[a] += 1
    for (let v = 0; v < c.numCourses; v += 1) if (indeg0[v] === 0) zeroDeg.push(v)
    expect(init.phase).toBe('init')
    expect(init.queue).toEqual(zeroDeg)
    expect(init.order).toEqual([])
    expect(init.indegree).toEqual(indeg0)

    // 逐帧：cur === 上一帧队首；order 追加 cur；入度单调减不越界；每课出入队 ≤ 1 次
    const everEnq = new Set(init.queue)
    const popFrames = steps.filter((f) => f.phase === 'pop')
    let prev = init
    for (const f of popFrames) {
      expect(f.cur).toBe(prev.queue[0])
      expect(f.order).toEqual([...prev.order, f.cur])
      expect(f.order.filter((v) => v === f.cur)).toHaveLength(1)
      for (let v = 0; v < c.numCourses; v += 1) {
        expect(f.indegree[v]).toBeGreaterThanOrEqual(0)
        expect(f.indegree[v]).toBeLessThanOrEqual(prev.indegree[v])
      }
      // 重边会让同一节点在 relaxed 里出现多次（逐边减），取每个节点最后一次的值核验
      const lastRelax = new Map()
      for (const [v, d] of f.relaxed) lastRelax.set(v, d)
      for (const [v, d] of lastRelax) expect(f.indegree[v]).toBe(d)
      for (const v of f.enqueued) {
        expect(everEnq.has(v)).toBe(false)
        everEnq.add(v)
        expect(f.indegree[v]).toBe(0)
      }
      expect(new Set(f.queue).size).toBe(f.queue.length) // 队列不重复
      prev = f
    }

    // done：possible 与出队数一致；stuck 互补；拓扑序核验
    expect(done.order).toHaveLength(popFrames.length)
    expect(done.answer.possible).toBe(done.order.length === c.numCourses)
    const stuck = []
    for (let v = 0; v < c.numCourses; v += 1) if (!done.order.includes(v)) stuck.push(v)
    expect(done.stuck).toEqual(stuck)
    if (done.answer.possible) {
      expect(new Set(done.answer.order).size).toBe(c.numCourses)
      expect(isTopoOrder(done.answer.order, c.prerequisites)).toBe(true)
      expect(done.stuck).toEqual([])
    } else {
      expect(stuck.length).toBeGreaterThan(0)
    }
  })

  it('默认题面：init + 4×pop + done = 6 帧，order = [0,1,2,3]', () => {
    const steps = buildCourseScheduleSteps()
    expect(steps).toHaveLength(6)
    expect(steps.at(-1).answer).toEqual({ possible: true, order: [0, 1, 2, 3] })
    const pops = steps.filter((f) => f.phase === 'pop')
    expect(pops.map((f) => f.cur)).toEqual([0, 1, 2, 3])
    // 第 1 帧 pop(0)：后继 1、2 都减到 0 并入队
    expect(pops[0].relaxed).toEqual([[1, 0], [2, 0]])
    expect(pops[0].enqueued).toEqual([1, 2])
    // pop(1)：3 的入度 2 → 1，还差一个
    expect(pops[1].relaxed).toEqual([[3, 1]])
    expect(pops[1].enqueued).toEqual([])
    // pop(2)：3 的入度 1 → 0，入队
    expect(pops[2].relaxed).toEqual([[3, 0]])
    expect(pops[2].enqueued).toEqual([3])
  })

  it('有环：done 帧 false 且 stuck 非空', () => {
    const steps = buildCourseScheduleSteps({ numCourses: 2, prerequisites: [[1, 0], [0, 1]] })
    const done = steps.at(-1)
    expect(done.answer.possible).toBe(false)
    expect(done.stuck).toEqual([0, 1])
  })

  it('非法输入回退默认', () => {
    expect(buildCourseScheduleSteps({ numCourses: 'x', prerequisites: null })[0].numCourses).toBe(
      DEFAULTS.numCourses,
    )
    const steps = buildCourseScheduleSteps({ numCourses: 3, prerequisites: [[9, 0], [1, 2]] })
    // 越界边被过滤：[1, 2] 合法、[9, 0] 不合法
    expect(steps[0].edges).toEqual([[2, 1]])
    expect(steps.at(-1).answer.possible).toBe(true)
  })

  it('随机交叉：400 组小图 vs 参考解 + 拓扑序核验', () => {
    let rng = 2070
    const rand = (n) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % n
    }
    for (let t = 0; t < 400; t += 1) {
      const numCourses = 1 + rand(6)
      const edgeCount = rand(9)
      const prerequisites = []
      for (let i = 0; i < edgeCount; i += 1) {
        prerequisites.push([rand(numCourses), rand(numCourses)])
      }
      const steps = buildCourseScheduleSteps({ numCourses, prerequisites })
      const done = steps.at(-1)
      expect(done.answer.possible).toBe(refKahn(numCourses, prerequisites).possible)
      expect(done.answer.possible).toBe(!refHasCycle(numCourses, prerequisites))
      if (done.answer.possible) {
        expect(isTopoOrder(done.answer.order, prerequisites)).toBe(true)
      }
    }
  })
})
