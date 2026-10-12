/**
 * islandsUfSteps.test.js — LC 200「岛屿数量」并查集状态机单测。
 *
 * 交叉验证：状态机 vs ① BFS flood 参考解（岛屿数）② 独立的并查集模拟（逐事件）。
 * 逐帧钉死：add 帧数 = 陆地数、count = 陆地数 − 成功合并数、
 * union 只发生在与上/左陆地之间、parent 结构自洽（无环）。
 */
import { describe, it, expect } from 'vitest'
import { buildIslandsUfSteps } from '../islandsUfSteps.js'

const refCount = (grid) => {
  const m = grid.length
  const n = grid[0].length
  const seen = Array.from({ length: m }, () => new Array(n).fill(false))
  const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  let count = 0
  for (let r = 0; r < m; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (grid[r][c] !== 1 || seen[r][c]) continue
      count += 1
      const q = [[r, c]]
      seen[r][c] = true
      for (let h = 0; h < q.length; h += 1) {
        const [x, y] = q[h]
        for (const [dx, dy] of DIRS) {
          const nx = x + dx
          const ny = y + dy
          if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === 1 && !seen[nx][ny]) {
            seen[nx][ny] = true
            q.push([nx, ny])
          }
        }
      }
    }
  }
  return count
}

// 独立并查集模拟：逐事件产出 {type, merged, count}，与状态机对照
const simUf = (grid) => {
  const m = grid.length
  const n = grid[0].length
  const parent = new Map()
  const find = (k) => {
    let r = k
    while (parent.get(r) !== r) r = parent.get(r)
    return r
  }
  const events = []
  let count = 0
  for (let r = 0; r < m; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (grid[r][c] !== 1) continue
      parent.set(`${r},${c}`, `${r},${c}`)
      count += 1
      events.push({ type: 'add', count })
      for (const [pr, pc] of [[r - 1, c], [r, c - 1]]) {
        if (pr < 0 || pr >= m || pc < 0 || pc >= n || grid[pr][pc] !== 1) continue
        const a = find(`${r},${c}`)
        const b = find(`${pr},${pc}`)
        let merged = false
        if (a !== b) {
          parent.set(a, b)
          count -= 1
          merged = true
        }
        events.push({ type: 'union', merged, count })
      }
    }
  }
  return { count, events }
}

const DEFAULT_GRID = [
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 1],
]

const CASES = [
  { grid: DEFAULT_GRID },
  { grid: [[0, 0], [0, 0]] },
  { grid: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] },
  { grid: [[1]] },
  { grid: [[1, 0, 1, 1, 0, 1]] },
  { grid: [[1], [0], [1]] },
  { grid: [[1, 0], [0, 1]] },
  { grid: [[1, 1, 1, 1, 1, 1, 1]] },
  { grid: [[1, 1], [1, 0], [1, 1]] },
]

describe('islandsUfSteps（LC 200 并查集）', () => {
  it.each(CASES)('结果与 BFS 参考解一致：%j', (c) => {
    const steps = buildIslandsUfSteps({ grid: c.grid })
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    expect(done.count).toBe(refCount(c.grid))
    expect(done.count).toBe(simUf(c.grid).count)
  })

  it.each(CASES)('帧骨架与不变量：%j', (c) => {
    const steps = buildIslandsUfSteps({ grid: c.grid })
    const { m, n } = steps[0]
    const land = c.grid.flat().filter((v) => v === 1).length

    const adds = steps.filter((f) => f.phase === 'add')
    const unions = steps.filter((f) => f.phase === 'union')
    expect(adds).toHaveLength(land)

    // 逐事件对照独立模拟
    const sim = simUf(c.grid)
    const evs = steps
      .filter((f) => f.phase === 'add' || f.phase === 'union')
      .map((f) => ({ type: f.phase, merged: f.merged, count: f.count }))
    expect(evs.length).toBe(sim.events.length)
    evs.forEach((e, i) => {
      expect(e.type).toBe(sim.events[i].type)
      expect(e.count).toBe(sim.events[i].count)
      if (e.type === 'union') expect(e.merged).toBe(sim.events[i].merged)
    })

    // add 帧 count +1；union 帧 merged 与 count 变化一致
    let prev = 0
    for (const f of steps.slice(1)) {
      if (f.phase === 'add') expect(f.count).toBe(prev + 1)
      if (f.phase === 'union') expect(f.count).toBe(f.merged ? prev - 1 : prev)
      prev = f.count
    }

    // count === 陆地数 − 成功合并数
    const ok = unions.filter((f) => f.merged).length
    expect(steps.at(-1).count).toBe(land - ok)

    // union 帧的邻居必须是当前格的上方或左方，且两块都是陆地
    for (const f of unions) {
      const [fr, fc] = f.cur
      const [pr, pc] = f.neighbor
      const isUp = pr === fr - 1 && pc === fc
      const isLeft = pr === fr && pc === fc - 1
      expect(isUp || isLeft).toBe(true)
      expect(c.grid[fr][fc]).toBe(1)
      expect(c.grid[pr][pc]).toBe(1)
      expect(pr >= 0 && pr < m && pc >= 0 && pc < n).toBe(true)
    }

    // parent 结构自洽：只含陆地键、每个键最终走到自环（无环）
    const done = steps.at(-1)
    const parent = done.parent
    for (const k of Object.keys(parent)) {
      expect(parent[k]).toBeDefined()
      let x = k
      let steps2 = 0
      while (parent[x] !== x) {
        x = parent[x]
        steps2 += 1
        expect(steps2).toBeLessThan(1000)
      }
    }
    // 陆地格数 === parent 键数
    expect(Object.keys(parent)).toHaveLength(land)
  })

  it('默认网格：14 帧、add=7 / union=5、答案 3', () => {
    const steps = buildIslandsUfSteps()
    expect(steps.filter((f) => f.phase === 'add')).toHaveLength(7)
    expect(steps.filter((f) => f.phase === 'union')).toHaveLength(5)
    expect(steps.at(-1).count).toBe(3)
    expect(steps[0].phase).toBe('init')
    expect(steps.at(-1).phase).toBe('done')
  })

  it('全水：两帧，答案 0，parent 为空', () => {
    const steps = buildIslandsUfSteps({ grid: [[0, 0, 0]] })
    expect(steps).toHaveLength(2)
    expect(steps.at(-1).count).toBe(0)
    expect(steps.at(-1).parent).toEqual({})
  })

  it('非法输入回退默认', () => {
    expect(buildIslandsUfSteps({ grid: [] })[0].grid).toEqual(DEFAULT_GRID)
    expect(buildIslandsUfSteps({ grid: null })[0].grid).toEqual(DEFAULT_GRID)
  })

  it('随机交叉：400 组小网格 vs BFS + 独立并查集', () => {
    let rng = 2001
    const rand = (n) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % n
    }
    for (let t = 0; t < 400; t += 1) {
      const m = 1 + rand(6)
      const n = 1 + rand(6)
      const grid = Array.from({ length: m }, () => Array.from({ length: n }, () => rand(2)))
      const steps = buildIslandsUfSteps({ grid })
      expect(steps.at(-1).count).toBe(refCount(grid))
      expect(steps.at(-1).count).toBe(simUf(grid).count)
    }
  })
})
