/**
 * rotOrangeDistSteps.test.js — LC 994「腐烂的橘子」时间戳 / 距离场状态机单测。
 *
 * 交叉验证：状态机 vs ① 独立参考解「逐源单源 BFS 取 min」得到距离场
 * ② 逐分钟全局同步模拟（在 rotOrangeSteps.test.js 里同款，这里独立一份）。
 * 逐帧钉死：每个格子只盖一次章、源 = 0、stamp === 到最近源距离、
 * fresh 减少量 = 盖章数、maxStamp 单调。
 */
import { describe, it, expect } from 'vitest'
import { buildRotOrangeDistSteps } from '../rotOrangeDistSteps.js'

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]]

/** 参考解一：对每个源各跑一次单源 BFS，逐格取 min，得到「到最近源距离」。 */
const refDistField = (grid) => {
  const m = grid.length
  const n = grid[0].length
  const INF = Infinity
  const dist = Array.from({ length: m }, () => new Array(n).fill(INF))
  const sources = []
  let fresh = 0
  for (let r = 0; r < m; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (grid[r][c] === 2) sources.push([r, c])
      else if (grid[r][c] === 1) fresh += 1
    }
  }
  for (const [sr, sc] of sources) {
    const d = Array.from({ length: m }, () => new Array(n).fill(INF))
    d[sr][sc] = 0
    const q = [[sr, sc]]
    for (let head = 0; head < q.length; head += 1) {
      const [r, c] = q[head]
      for (const [dr, dc] of DIRS) {
        const nr = r + dr
        const nc = c + dc
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue
        if (grid[nr][nc] === 0 || d[nr][nc] !== INF) continue
        d[nr][nc] = d[r][c] + 1
        q.push([nr, nc])
      }
    }
    for (let r = 0; r < m; r += 1) {
      for (let c = 0; c < n; c += 1) {
        if (grid[r][c] !== 0) dist[r][c] = Math.min(dist[r][c], d[r][c])
      }
    }
  }
  return { dist, fresh }
}

const refAnswer = (grid) => {
  const m = grid.length
  const n = grid[0].length
  const { dist, fresh } = refDistField(grid)
  if (fresh === 0) return 0
  let answer = 0
  for (let r = 0; r < m; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (grid[r][c] === 0) continue
      if (dist[r][c] === Infinity) return -1
      answer = Math.max(answer, dist[r][c])
    }
  }
  return answer
}

/** 参考解二：逐分钟全局同步模拟。 */
const refSimulate = (grid) => {
  const m = grid.length
  const n = grid[0].length
  const g = grid.map((r) => [...r])
  let fresh = g.flat().filter((v) => v === 1).length
  let minute = 0
  while (fresh > 0) {
    const toRot = new Set()
    for (let r = 0; r < m; r += 1) {
      for (let c = 0; c < n; c += 1) {
        if (g[r][c] !== 2) continue
        for (const [dr, dc] of DIRS) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < m && nc >= 0 && nc < n && g[nr][nc] === 1) toRot.add(`${nr},${nc}`)
        }
      }
    }
    if (toRot.size === 0) break
    for (const key of toRot) {
      const [r, c] = key.split(',').map(Number)
      g[r][c] = 2
      fresh -= 1
    }
    minute += 1
  }
  return fresh === 0 ? minute : -1
}

const DEFAULT_GRID = [
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1],
]

const CASES = [
  { grid: DEFAULT_GRID, want: 4 },
  { grid: [[2, 1, 1], [0, 1, 1], [1, 0, 1]], want: -1 },
  { grid: [[2, 2], [2, 2]], want: 0 },
  { grid: [[1, 1], [1, 1]], want: -1 },
  { grid: [[0]], want: 0 },
  { grid: [[2]], want: 0 },
  { grid: [[1]], want: -1 },
  { grid: [[2, 1]], want: 1 },
  { grid: [[1, 1, 1, 1, 1, 2]], want: 5 },
  { grid: [[2], [1], [1], [1]], want: 3 },
  { grid: [[2, 0, 1, 0]], want: -1 },
  { grid: [[2, 1, 1, 1, 2]], want: 2 },
]

describe('rotOrangeDistSteps（LC 994 时间戳 / 距离场）', () => {
  it.each(CASES)('答案与两个参考解一致：want %#', (c) => {
    const steps = buildRotOrangeDistSteps({ grid: c.grid })
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    expect(done.answer).toBe(c.want)
    expect(done.answer).toBe(refAnswer(c.grid))
    expect(done.answer).toBe(refSimulate(c.grid))
  })

  it.each(CASES)('盖章值与「到最近源距离」逐格一致：%j', (c) => {
    const m = c.grid.length
    const n = c.grid[0].length
    const steps = buildRotOrangeDistSteps({ grid: c.grid })
    const done = steps.at(-1)
    const { dist } = refDistField(c.grid)

    for (let r = 0; r < m; r += 1) {
      for (let cc = 0; cc < n; cc += 1) {
        if (c.grid[r][cc] === 0) {
          expect(done.stamp[r][cc]).toBeNull()
        } else if (dist[r][cc] === Infinity) {
          expect(done.stamp[r][cc]).toBeNull()
        } else {
          expect(done.stamp[r][cc]).toBe(dist[r][cc])
        }
      }
    }
  })

  it.each(CASES)('帧骨架与不变量：%j', (c) => {
    const steps = buildRotOrangeDistSteps({ grid: c.grid })
    const m = c.grid.length
    const n = c.grid[0].length

    expect(steps[0].phase).toBe('init')
    expect(steps.at(-1).phase).toBe('done')

    // 初始化：源盖章 0
    for (const [r, cc] of steps[0].sources) expect(steps[0].stamp[r][cc]).toBe(0)

    // stamped 全局互不相交、且每个格子盖章值 === 所在帧的 minute
    const seen = new Set()
    for (const f of steps) {
      for (const [r, cc] of f.stamped) {
        const key = `${r},${cc}`
        expect(seen.has(key)).toBe(false)
        seen.add(key)
        expect(f.stamp[r][cc]).toBe(f.minute)
        expect(c.grid[r][cc]).not.toBe(0) // 空格永远不会被盖章
      }
    }

    // fresh 减少量 = 本帧盖章数；maxStamp 单调不减
    let prevFresh = steps[0].fresh
    let prevMax = steps[0].maxStamp
    for (const f of steps.slice(1)) {
      if (f.phase === 'stamp') {
        expect(f.fresh).toBe(prevFresh - f.stamped.length)
        expect(f.maxStamp).toBeGreaterThanOrEqual(prevMax)
      }
      prevFresh = f.fresh
      prevMax = f.maxStamp
    }

    // done：maxStamp === 全部 stamp 的最大值；answer 与 fresh 的关系正确
    const done = steps.at(-1)
    let mx = 0
    let freshLeft = 0
    for (let r = 0; r < m; r += 1) {
      for (let cc = 0; cc < n; cc += 1) {
        if (done.stamp[r][cc] !== null) mx = Math.max(mx, done.stamp[r][cc])
        if (done.grid[r][cc] === 1) freshLeft += 1
      }
    }
    expect(done.maxStamp).toBe(mx)
    expect(done.fresh).toBe(freshLeft)
    if (done.answer === -1) {
      expect(freshLeft).toBeGreaterThan(0)
    } else {
      expect(freshLeft).toBe(0)
      expect(done.answer).toBe(mx)
    }
  })

  it('默认网格：init + 4×stamp + done = 6 帧，最大时间戳 4', () => {
    const steps = buildRotOrangeDistSteps()
    expect(steps).toHaveLength(6)
    expect(steps.filter((f) => f.phase === 'stamp')).toHaveLength(4)
    expect(steps.at(-1).answer).toBe(4)
    // 逐帧的盖章集合
    const sets = steps.filter((f) => f.phase === 'stamp').map((f) => f.stamped.map((p) => p.join(',')))
    expect(sets[0]).toEqual(['0,1', '1,0'])
    expect(sets[1]).toEqual(['0,2', '1,1'])
    expect(sets[2]).toEqual(['2,1'])
    expect(sets[3]).toEqual(['2,2'])
  })

  it('全烂 / 无源：init + done 两帧', () => {
    const a = buildRotOrangeDistSteps({ grid: [[2, 2], [2, 2]] })
    expect(a).toHaveLength(2)
    expect(a.at(-1).answer).toBe(0)
    const b = buildRotOrangeDistSteps({ grid: [[0, 0]] })
    expect(b).toHaveLength(2)
    expect(b.at(-1).answer).toBe(0)
  })

  it('死路网格不会凭空多出一帧空盖章', () => {
    // [[2,0],[0,1]]：第 1 分钟扩散不出任何新格子 → 不应出现 stamp 帧
    const steps = buildRotOrangeDistSteps({ grid: [[2, 0], [0, 1]] })
    expect(steps.filter((f) => f.phase === 'stamp')).toHaveLength(0)
    expect(steps.at(-1).answer).toBe(-1)
  })

  it('非法输入回退默认', () => {
    expect(buildRotOrangeDistSteps({ grid: [] })[0].grid).toEqual(DEFAULT_GRID)
    expect(buildRotOrangeDistSteps({ grid: null })[0].grid).toEqual(DEFAULT_GRID)
  })

  it('随机交叉：400 组小网格 vs 两个参考解', () => {
    let rng = 9940
    const rand = (n) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % n
    }
    for (let t = 0; t < 400; t += 1) {
      const m = 1 + rand(5)
      const n = 1 + rand(5)
      const grid = Array.from({ length: m }, () => Array.from({ length: n }, () => rand(3)))
      const steps = buildRotOrangeDistSteps({ grid })
      expect(steps.at(-1).answer).toBe(refAnswer(grid))
      expect(steps.at(-1).answer).toBe(refSimulate(grid))
    }
  })
})
