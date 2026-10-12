/**
 * islandsSteps.test.js — LC 200「岛屿数量」染色法（DFS）状态机单测。
 *
 * 交叉验证：状态机（显式栈 DFS）vs 独立参考解（BFS flood fill）。
 * 逐帧钉死：visited 只落陆地、每格恰好被压栈一次、seed 帧数 = 岛屿数、
 * pop 帧弹的是上一帧栈顶、结束计数一致。
 */
import { describe, it, expect } from 'vitest'
import { buildIslandsSteps } from '../islandsSteps.js'

// 独立参考解：BFS 数连通块
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

const DEFAULT_GRID = [
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 1],
]

const CASES = [
  { grid: DEFAULT_GRID, want: 3 },
  { grid: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], want: 0 },
  { grid: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], want: 1 },
  { grid: [[1]], want: 1 },
  { grid: [[0]], want: 0 },
  { grid: [[1, 0, 1, 1, 0, 1]], want: 3 },
  { grid: [[1], [0], [1]], want: 2 },
  { grid: [[1, 0], [0, 1]], want: 2 }, // 对角不算连通
  { grid: [[1, 1, 1, 1, 1, 1, 1]], want: 1 }, // 长蛇单行
  { grid: [[1, 0, 1, 0], [0, 1, 0, 1], [1, 0, 1, 0], [0, 1, 0, 1]], want: 8 },
]

describe('islandsSteps（LC 200 染色 DFS）', () => {
  it.each(CASES)('结果与 BFS 参考解一致：want %#', (c) => {
    const steps = buildIslandsSteps({ grid: c.grid })
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    expect(done.count).toBe(c.want)
    expect(done.count).toBe(refCount(c.grid))
  })

  it.each(CASES)('帧骨架与不变量：%j', (c) => {
    const steps = buildIslandsSteps({ grid: c.grid })
    const { m, n } = steps[0]
    const landCount = c.grid.flat().filter((v) => v === 1).length

    expect(steps[0].phase).toBe('init')
    expect(steps.at(-1).phase).toBe('done')

    // seed 帧数 === 岛屿数
    const seeds = steps.filter((f) => f.phase === 'seed')
    expect(seeds).toHaveLength(c.want)

    // visited 只落在陆地上；depth === frontier.length
    for (const f of steps) {
      for (let r = 0; r < m; r += 1) {
        for (let cc = 0; cc < n; cc += 1) {
          if (f.visited[r][cc]) expect(f.grid[r][cc]).toBe(1)
        }
      }
      expect(f.depth).toBe(f.frontier.length)
    }

    // 每个陆地格恰好被「压栈」一次：所有 pushed 的并集 = 陆地格，且无重复
    const allPushed = steps.flatMap((f) => f.pushed)
    const keys = allPushed.map((p) => `${p[0]},${p[1]}`)
    expect(keys).toHaveLength(landCount)
    expect(new Set(keys).size).toBe(landCount)

    // seed 帧：栈里只有该 seed，count 递增 1
    let prevCount = 0
    for (const seed of seeds) {
      expect(seed.frontier).toEqual([seed.cur])
      expect(seed.count).toBe(prevCount + 1)
      prevCount = seed.count
    }

    // pop 帧：弹的是上一帧的栈顶；栈长 = 上一帧栈长 − 1 + 本帧 pushed 数
    for (let i = 1; i < steps.length; i += 1) {
      const f = steps[i]
      const p = steps[i - 1]
      if (f.phase !== 'pop') continue
      expect(p.frontier.at(-1)).toEqual(f.cur)
      expect(f.frontier.length).toBe(p.frontier.length - 1 + f.pushed.length)
      expect(f.count).toBe(p.count)
    }

    // 结尾：所有陆地都被访问
    const done = steps.at(-1)
    for (let r = 0; r < m; r += 1) {
      for (let cc = 0; cc < n; cc += 1) {
        if (done.grid[r][cc] === 1) expect(done.visited[r][cc]).toBe(true)
      }
    }
  })

  it('默认网格：12 帧、3 座岛、seed=3 / pop=7', () => {
    const steps = buildIslandsSteps()
    expect(steps).toHaveLength(12)
    expect(steps.filter((f) => f.phase === 'seed')).toHaveLength(3)
    expect(steps.filter((f) => f.phase === 'pop')).toHaveLength(7)
    expect(steps.at(-1).count).toBe(3)
    // seed 依次落在三座岛的第一个格子
    expect(steps.filter((f) => f.phase === 'seed').map((f) => f.cur)).toEqual([
      [0, 0],
      [2, 2],
      [3, 3],
    ])
  })

  it('全水：只有 init + done 两帧，答案 0', () => {
    const steps = buildIslandsSteps({ grid: [[0, 0], [0, 0]] })
    expect(steps).toHaveLength(2)
    expect(steps.at(-1).count).toBe(0)
  })

  it('非法输入回退默认', () => {
    expect(buildIslandsSteps({ grid: [] })[0].grid).toEqual(DEFAULT_GRID)
    expect(buildIslandsSteps({ grid: null })[0].grid).toEqual(DEFAULT_GRID)
  })

  it("接受字符 '1'/'0' 输入", () => {
    const steps = buildIslandsSteps({ grid: [['1', '0'], ['0', '1']] })
    expect(steps.at(-1).count).toBe(2)
  })

  it('随机交叉：400 组小网格 vs BFS 参考解', () => {
    let rng = 200
    const rand = (n) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % n
    }
    for (let t = 0; t < 400; t += 1) {
      const m = 1 + rand(6)
      const n = 1 + rand(6)
      const grid = Array.from({ length: m }, () => Array.from({ length: n }, () => rand(2)))
      const steps = buildIslandsSteps({ grid })
      expect(steps.at(-1).count).toBe(refCount(grid))
    }
  })
})
