/**
 * courseScheduleDfsSteps.test.js — LC 207/210 DFS 三色标记状态机单测。
 *
 * 交叉验证：状态机 vs ① 独立三色 DFS 判环 ② 独立 Kahn（判 possible）
 * ③ 返回 order 的逐边拓扑序核验。
 * 逐帧钉死：颜色只按 白→灰→黑 演进、enter 入栈 / finish 弹栈+后序、
 * cycle 帧 target 必是栈中的灰节点、每节点 enter/finish 各一次（无环时）。
 */
import { describe, it, expect } from 'vitest'
import { buildCourseScheduleDfsSteps } from '../courseScheduleDfsSteps.js'

const refHasCycle = (numCourses, prerequisites) => {
  const adj = Array.from({ length: numCourses }, () => [])
  for (const [a, b] of prerequisites) adj[b].push(a)
  const color = new Array(numCourses).fill(0)
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

const refKahn = (numCourses, prerequisites) => {
  const adj = Array.from({ length: numCourses }, () => [])
  const indeg = new Array(numCourses).fill(0)
  for (const [a, b] of prerequisites) {
    adj[b].push(a)
    indeg[a] += 1
  }
  const q = []
  for (let v = 0; v < numCourses; v += 1) if (indeg[v] === 0) q.push(v)
  let done = 0
  while (q.length) {
    const cur = q.shift()
    done += 1
    for (const next of adj[cur]) {
      indeg[next] -= 1
      if (indeg[next] === 0) q.push(next)
    }
  }
  return done === numCourses
}

const isTopoOrder = (order, prerequisites) => {
  const pos = new Map(order.map((v, i) => [v, i]))
  for (const [a, b] of prerequisites) {
    if (!(pos.get(b) < pos.get(a))) return false
  }
  return true
}

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

describe('courseScheduleDfsSteps（LC 207/210 DFS 三色）', () => {
  it.each(CASES)('possibility 与参考解一致：want %#', (c) => {
    const steps = buildCourseScheduleDfsSteps(c)
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    expect(done.answer.possible).toBe(c.want)
    expect(done.answer.possible).toBe(!refHasCycle(c.numCourses, c.prerequisites))
    expect(done.answer.possible).toBe(refKahn(c.numCourses, c.prerequisites))
  })

  it.each(CASES)('颜色演进与栈/后序不变量：%j', (c) => {
    const steps = buildCourseScheduleDfsSteps(c)
    const n = c.numCourses
    const enters = steps.filter((f) => f.phase === 'enter').length
    const finishes = steps.filter((f) => f.phase === 'finish').length

    let prev = null
    for (const f of steps) {
      // 颜色只按 0→1→2 演进，绝不回退
      if (prev) {
        for (let v = 0; v < n; v += 1) {
          expect(f.color[v]).toBeGreaterThanOrEqual(prev.color[v])
        }
      }
      if (f.phase === 'enter') {
        expect(prev.color[f.cur]).toBe(0)
        expect(f.color[f.cur]).toBe(1)
        expect(f.stack[f.stack.length - 1]).toBe(f.cur)
      } else if (f.phase === 'finish') {
        expect(prev.color[f.cur]).toBe(1)
        expect(f.color[f.cur]).toBe(2)
        expect(prev.stack[prev.stack.length - 1]).toBe(f.cur)
        expect(f.post[f.post.length - 1]).toBe(f.cur)
      } else if (f.phase === 'cycle') {
        expect(f.color[f.target]).toBe(1)
        expect(f.stack).toContain(f.target)
      }
      prev = f
    }

    const done = steps.at(-1)
    if (done.answer.possible) {
      expect(enters).toBe(n)
      expect(finishes).toBe(n)
      expect([...done.post].reverse()).toEqual(done.answer.order)
      expect(isTopoOrder(done.answer.order, c.prerequisites)).toBe(true)
      expect(done.stack).toEqual([])
    } else {
      expect(steps.some((f) => f.phase === 'cycle')).toBe(true)
      expect(done.answer.order).toEqual([])
    }
  })

  it('默认题面：10 帧、后序反转 = [0,2,1,3]、DFS 与 Kahn 给出不同的合法序', () => {
    const steps = buildCourseScheduleDfsSteps()
    expect(steps).toHaveLength(10)
    const phases = steps.map((f) => f.phase)
    expect(phases).toEqual([
      'init',
      'enter',
      'enter',
      'enter',
      'finish',
      'finish',
      'enter',
      'finish',
      'finish',
      'done',
    ])
    expect(steps.at(-1).answer).toEqual({ possible: true, order: [0, 2, 1, 3] })
    expect(steps.at(-1).post).toEqual([3, 1, 2, 0])
    // 默认题面的 Kahn 答案是 [0,1,2,3] —— 两台机器给的顺序不同但都合法
    expect(isTopoOrder([0, 1, 2, 3], [[1, 0], [2, 0], [3, 1], [3, 2]])).toBe(true)
    expect(isTopoOrder([0, 2, 1, 3], [[1, 0], [2, 0], [3, 1], [3, 2]])).toBe(true)
  })

  it('两节点互环：init + enter×2 + cycle + done = 5 帧', () => {
    const steps = buildCourseScheduleDfsSteps({ numCourses: 2, prerequisites: [[1, 0], [0, 1]] })
    expect(steps).toHaveLength(5)
    const cyc = steps.find((f) => f.phase === 'cycle')
    expect(cyc.cur).toBe(1)
    expect(cyc.target).toBe(0)
    expect(steps.at(-1).answer.possible).toBe(false)
  })

  it('非法输入回退默认', () => {
    expect(
      buildCourseScheduleDfsSteps({ numCourses: null, prerequisites: 'x' })[0].numCourses,
    ).toBe(4)
    const steps = buildCourseScheduleDfsSteps({ numCourses: 3, prerequisites: [[9, 0], [1, 2]] })
    expect(steps[0].edges).toEqual([[2, 1]])
    expect(steps.at(-1).answer.possible).toBe(true)
  })

  it('随机交叉：400 组小图 vs 参考解 + 拓扑序核验', () => {
    let rng = 20700
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
      const steps = buildCourseScheduleDfsSteps({ numCourses, prerequisites })
      const done = steps.at(-1)
      expect(done.answer.possible).toBe(!refHasCycle(numCourses, prerequisites))
      expect(done.answer.possible).toBe(refKahn(numCourses, prerequisites))
      if (done.answer.possible) {
        expect(isTopoOrder(done.answer.order, prerequisites)).toBe(true)
        expect(done.answer.order).toHaveLength(numCourses)
      }
    }
  })
})
