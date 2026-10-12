/**
 * rotOrangeSteps.test.js — LC 994「腐烂的橘子」多源 BFS 分层状态机单测。
 *
 * 交叉验证：状态机（分层队列）vs 独立参考解（逐分钟全局同步模拟）
 * vs 第二个参考解（距离场 BFS）。
 * 逐帧钉死：layer/rot 成对、minute 只在 rot 帧 +1、fresh 减少量 = 新腐烂数、
 * 每格最多腐烂一次、rot 后队列 = 本帧新腐烂。
 */
import { describe, it, expect } from 'vitest'
import { buildRotOrangeSteps } from '../rotOrangeSteps.js'

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]]

/** 参考解一：逐分钟全局同步模拟（不依赖 BFS 语义）。 */
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

/** 参考解二：多源 BFS 距离场（队列存 (r,c,t)，与分层写法互为独立实现）。 */
const refBfs = (grid) => {
  const m = grid.length
  const n = grid[0].length
  const g = grid.map((r) => [...r])
  let fresh = 0
  const queue = []
  for (let r = 0; r < m; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (g[r][c] === 2) queue.push([r, c, 0])
      else if (g[r][c] === 1) fresh += 1
    }
  }
  let answer = 0
  for (let head = 0; head < queue.length; head += 1) {
    const [r, c, t] = queue[head]
    answer = Math.max(answer, t)
    for (const [dr, dc] of DIRS) {
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && g[nr][nc] === 1) {
        g[nr][nc] = 2
        fresh -= 1
        queue.push([nr, nc, t + 1])
      }
    }
  }
  return fresh === 0 ? answer : -1
}

const DEFAULT_GRID = [
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1],
]

const CASES = [
  { grid: DEFAULT_GRID, want: 4 },
  { grid: [[2, 1, 1], [0, 1, 1], [1, 0, 1]], want: -1 }, // 经典不可达
  { grid: [[2, 2], [2, 2]], want: 0 }, // 全烂
  { grid: [[1, 1], [1, 1]], want: -1 }, // 没有源
  { grid: [[0]], want: 0 },
  { grid: [[2]], want: 0 },
  { grid: [[1]], want: -1 },
  { grid: [[2, 1]], want: 1 },
  { grid: [[1, 1, 1, 1, 1, 2]], want: 5 }, // 单行长链
  { grid: [[2], [1], [1], [1]], want: 3 },
  { grid: [[2, 0, 1, 0]], want: -1 }, // 新鲜橘子被空格隔开
  { grid: [[2, 1, 1, 1, 2]], want: 2 }, // 两个源相向扩散
]

describe('rotOrangeSteps（LC 994 多源 BFS 分层）', () => {
  it.each(CASES)('答案与两个独立参考解一致：want %#', (c) => {
    const steps = buildRotOrangeSteps({ grid: c.grid })
    const done = steps.at(-1)
    expect(done.phase).toBe('done')
    expect(done.answer).toBe(c.want)
    expect(done.answer).toBe(refSimulate(c.grid))
    expect(done.answer).toBe(refBfs(c.grid))
  })

  it.each(CASES)('帧骨架与不变量：%j', (c) => {
    const steps = buildRotOrangeSteps({ grid: c.grid })
    const { m, n } = steps[0]
    const initialRotten = c.grid.flat().filter((v) => v === 2).length
    const initialFresh = c.grid.flat().filter((v) => v === 1).length

    // init 帧：全部源都在队列里
    expect(steps[0].phase).toBe('init')
    expect(steps[0].queue).toHaveLength(initialRotten)
    expect(new Set(steps[0].queue.map((p) => p.join(','))).size).toBe(initialRotten)
    expect(steps[0].fresh).toBe(initialFresh)
    expect(steps[0].minute).toBe(0)

    const layers = steps.filter((f) => f.phase === 'layer')
    const rots = steps.filter((f) => f.phase === 'rot')
    expect(layers).toHaveLength(rots.length)

    // 成对结构：init → layer → rot → layer → rot ... → done
    const middle = steps.slice(1, -1)
    middle.forEach((f, i) => {
      expect(f.phase).toBe(i % 2 === 0 ? 'layer' : 'rot')
    })

    // minute 只在 rot 帧 +1
    let prevMinute = 0
    let prevFresh = initialFresh
    const allNew = []
    for (const f of steps.slice(1)) {
      if (f.phase === 'rot') {
        expect(f.minute).toBe(prevMinute + 1)
        expect(f.fresh).toBe(prevFresh - f.newlyRotted.length)
        // rot 后队列 = 本帧新腐烂
        expect(f.queue.map((p) => p.join(','))).toEqual(f.newlyRotted.map((p) => p.join(',')))
      } else if (f.phase === 'layer') {
        expect(f.minute).toBe(prevMinute)
        expect(f.fresh).toBe(prevFresh)
        // layer 帧的 layer === 队列
        expect(f.layer.map((p) => p.join(','))).toEqual(f.queue.map((p) => p.join(',')))
      }
      prevMinute = f.minute
      prevFresh = f.fresh
      allNew.push(...f.newlyRotted)
    }

    // 每格最多腐烂一次：newlyRotted 互不相交、不含源；并集 = 全部非源陆地
    const keys = allNew.map((p) => p.join(','))
    expect(new Set(keys).size).toBe(keys.length)
    const sourceKeys = new Set(steps[0].sources.map((p) => p.join(',')))
    for (const k of keys) expect(sourceKeys.has(k)).toBe(false)
    const rotCount = c.grid.flat().filter((v) => v === 1).length
    if (steps.at(-1).answer !== -1) {
      expect(new Set(keys).size).toBe(rotCount)
      expect(keys).toHaveLength(rotCount)
    } else {
      expect(keys.length).toBeLessThan(rotCount)
    }

    // done 帧的 grid：答案非 -1 时所有橘子都是 2
    const done = steps.at(-1)
    if (done.answer !== -1) {
      for (let r = 0; r < m; r += 1) {
        for (let cc = 0; cc < n; cc += 1) {
          expect(done.grid[r][cc]).not.toBe(1)
        }
      }
      expect(done.fresh).toBe(0)
    } else {
      expect(done.fresh).toBeGreaterThan(0)
    }
  })

  it('默认网格：init + 4×(layer+rot) + done = 10 帧，答案 4', () => {
    const steps = buildRotOrangeSteps()
    expect(steps).toHaveLength(10)
    expect(steps.filter((f) => f.phase === 'layer')).toHaveLength(4)
    expect(steps.filter((f) => f.phase === 'rot')).toHaveLength(4)
    expect(steps.at(-1).answer).toBe(4)
    // 第 2 分钟同时腐烂 (0,2) 与 (1,1)
    const secondRot = steps.filter((f) => f.phase === 'rot')[1]
    expect(secondRot.newlyRotted.map((p) => p.join(','))).toEqual(['0,2', '1,1'])
  })

  it('全部腐烂：init + done = 2 帧，答案 0', () => {
    const steps = buildRotOrangeSteps({ grid: [[2, 2], [2, 2]] })
    expect(steps).toHaveLength(2)
    expect(steps.at(-1).answer).toBe(0)
  })

  it('无法到达：done 帧 answer = -1 且 fresh > 0', () => {
    const steps = buildRotOrangeSteps({ grid: [[2, 0, 1, 0]] })
    expect(steps.at(-1).answer).toBe(-1)
    expect(steps.at(-1).fresh).toBe(1)
  })

  it('非法输入回退默认', () => {
    expect(buildRotOrangeSteps({ grid: [] })[0].grid).toEqual(DEFAULT_GRID)
    expect(buildRotOrangeSteps({ grid: null })[0].grid).toEqual(DEFAULT_GRID)
  })

  it("接受字符 '0'/'1'/'2' 输入", () => {
    const steps = buildRotOrangeSteps({ grid: [['2', '1'], ['1', '2']] })
    expect(steps.at(-1).answer).toBe(1)
  })

  it('随机交叉：400 组小网格 vs 两个参考解', () => {
    let rng = 994
    const rand = (n) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % n
    }
    for (let t = 0; t < 400; t += 1) {
      const m = 1 + rand(5)
      const n = 1 + rand(5)
      const grid = Array.from({ length: m }, () => Array.from({ length: n }, () => rand(3)))
      const steps = buildRotOrangeSteps({ grid })
      const want = refSimulate(grid)
      expect(steps.at(-1).answer).toBe(want)
      expect(steps.at(-1).answer).toBe(refBfs(grid))
    }
  })
})
