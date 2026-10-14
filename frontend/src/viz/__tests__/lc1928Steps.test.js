/**
 * lc1928Steps.test.js — LC 1928「规定时间内到达终点的最小花费」主状态机单测。
 *
 * 交叉验证：状态机（分层图 `dp[t][v]` 按 t 正序松弛）vs 两个独立参考解 ——
 * ① 小顶堆 Dijkstra，状态是 `(cost, t, v)`，按 cost 出堆、超时状态不推入；
 * ② 暴力枚举所有简单路径，筛掉总时间 > maxTime 的，取最小通行费。
 * 逐帧钉死：回放一致、relax 帧自洽、improved 只动一格、dp 不可回退、
 * cutCount 单调不减且等于独立重算的剪枝条数、best 单调不增且等于当帧
 * `min over t of dp[t][target]`、done 帧链自洽（相邻态之间确有边）。
 */
import { describe, it, expect } from 'vitest'
import {
  buildLc1928Steps,
  LC1928_DEFAULT_FEES,
  LC1928_DEFAULT_EDGES,
  LC1928_DEFAULT_MAX_TIME,
} from '../lc1928Steps.js'

const INF = Infinity

/** 独立参考解 ①：小顶堆 Dijkstra on (cost, t, v)，超时状态直接不推入。 */
function refHeap(n, fees, edges, maxTime) {
  const target = n - 1
  const adj = Array.from({ length: n }, () => [])
  for (const [x, y, time] of edges) {
    adj[x].push([y, time])
    adj[y].push([x, time])
  }
  const heap = []
  const push = (item) => {
    heap.push(item)
    let i = heap.length - 1
    while (i > 0) {
      const p = (i - 1) >> 1
      if (heap[p][0] <= heap[i][0]) break
      ;[heap[p], heap[i]] = [heap[i], heap[p]]
      i = p
    }
  }
  const pop = () => {
    const top = heap[0]
    const last = heap.pop()
    if (heap.length) {
      heap[0] = last
      let i = 0
      for (;;) {
        const l = 2 * i + 1
        const r = l + 1
        let m = i
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r
        if (m === i) break
        ;[heap[m], heap[i]] = [heap[i], heap[m]]
        i = m
      }
    }
    return top
  }
  const settled = new Set()
  push([fees[0], 0, 0])
  while (heap.length) {
    const [cost, t, v] = pop()
    const key = t * n + v
    if (settled.has(key)) continue
    settled.add(key)
    if (v === target) return cost
    for (const [to, time] of adj[v]) {
      const nt = t + time
      if (nt > maxTime) continue
      push([cost + fees[to], nt, to])
    }
  }
  return -1
}

/** 独立参考解 ②：暴力枚举所有简单路径（小图用）。 */
function refBrute(n, fees, edges, maxTime) {
  const target = n - 1
  const adj = Array.from({ length: n }, () => [])
  for (const [x, y, time] of edges) {
    adj[x].push([y, time])
    adj[y].push([x, time])
  }
  let best = INF
  const seen = new Array(n).fill(false)
  const go = (v, t, cost) => {
    if (t > maxTime) return
    if (v === target) {
      if (cost < best) best = cost
      return
    }
    for (const [to, time] of adj[v]) {
      if (seen[to]) continue
      seen[to] = true
      go(to, t + time, cost + fees[to])
      seen[to] = false
    }
  }
  seen[0] = true
  go(0, 0, fees[0])
  return best === INF ? -1 : best
}

// 官方题面：贵路 0→3→4→5 只要 1+10+15 = 26 分钟（便宜路 0→1→2→5 要 30 分钟）
const OFFICIAL_FEES = [5, 1, 2, 20, 20, 3]
const OFFICIAL_EDGES = [
  [0, 1, 10],
  [1, 2, 10],
  [2, 5, 10],
  [0, 3, 1],
  [3, 4, 10],
  [4, 5, 15],
]

const CASES = [
  // 默认题面：官方拓扑 + 时间缩到 2/2/2 与 1/1/1 → maxTime=5 时贵路达标
  { opts: {}, answer: 48 },
  { opts: { maxTime: 6 }, answer: 11 },
  { opts: { maxTime: 3 }, answer: 48 },
  { opts: { maxTime: 2 }, answer: -1 },
  { opts: { maxTime: 7 }, answer: 11 },
  { opts: { maxTime: 1 }, answer: -1 },
  // 官方三示例
  { opts: { fees: OFFICIAL_FEES, edges: OFFICIAL_EDGES, maxTime: 30 }, answer: 11 },
  { opts: { fees: OFFICIAL_FEES, edges: OFFICIAL_EDGES, maxTime: 29 }, answer: 48 },
  { opts: { fees: OFFICIAL_FEES, edges: OFFICIAL_EDGES, maxTime: 25 }, answer: -1 },
  // 小图 / 重边 / 零费 / 不连通
  { opts: { fees: [0, 5], edges: [[0, 1, 1]], maxTime: 1 }, answer: 5 },
  { opts: { fees: [0, 5], edges: [[0, 1, 3]], maxTime: 2 }, answer: -1 },
  { opts: { fees: [1, 2, 3], edges: [[0, 1, 1]], maxTime: 5 }, answer: -1 },
  { opts: { fees: [0, 10], edges: [[0, 1, 1], [0, 1, 5]], maxTime: 1 }, answer: 10 },
  { opts: { fees: [0, 0, 0], edges: [[0, 1, 1], [1, 2, 1]], maxTime: 2 }, answer: 0 },
  {
    opts: { fees: [4, 9, 7, 3], edges: [[0, 1, 2], [1, 3, 4], [0, 2, 1], [2, 3, 1]], maxTime: 2 },
    answer: 14,
  },
]

describe('lc1928Steps（LC 1928 分层图）', () => {
  it.each(CASES)('答案与两个独立参考解一致（case %#）', ({ opts, answer }) => {
    const steps = buildLc1928Steps(opts)
    const { n, fees, edges, maxTime, target } = steps[0]
    const done = steps.at(-1)
    expect(done.answer).toBe(answer)
    expect(done.best === INF ? -1 : done.best).toBe(answer)
    expect(refHeap(n, fees, edges, maxTime)).toBe(answer)
    expect(refBrute(n, fees, edges, maxTime)).toBe(answer)
    expect(done.dp.map((row) => row[target])).toContain(answer === -1 ? INF : answer)
  })

  it.each(CASES)('帧骨架与逐帧不变量（case %#）', ({ opts }) => {
    const steps = buildLc1928Steps(opts)
    const { n, fees, edges, maxTime, target } = steps[0]
    const relax = steps.filter((f) => f.phase === 'relax')
    expect(steps[0].phase).toBe('init')
    expect(steps.at(-1).phase).toBe('done')
    expect(steps.at(-1).done).toBe(true)
    expect(steps.filter((f) => f.phase === 'done')).toHaveLength(1)

    // 1. 回放一致：每帧的"动作前"就是上一帧的"动作后"
    expect(steps[0].prevDp).toEqual(steps[0].dp)
    for (let i = 1; i < steps.length; i += 1) {
      expect(steps[i].prevDp).toEqual(steps[i - 1].dp)
    }
    expect(steps.at(-1).prevDp).toEqual(steps.at(-1).dp)

    for (const f of relax) {
      // 2. relax 帧自洽
      expect(f.v).toBeGreaterThanOrEqual(0)
      expect(f.v).toBeLessThan(n)
      expect(f.u).toBeGreaterThanOrEqual(0)
      expect(f.u).toBeLessThan(n)
      expect(f.v).not.toBe(f.u)
      expect(f.et).toBeGreaterThanOrEqual(1)
      expect(f.arr).toBe(f.t + f.et)
      expect(Number.isFinite(f.from)).toBe(true)
      expect(f.from).toBe(f.prevDp[f.t][f.v])
      expect(f.cand).toBe(f.from + fees[f.u])
      expect(f.arr).toBeLessThanOrEqual(maxTime)
      // 3. old / improved
      expect(f.old).toBe(f.prevDp[f.arr][f.u])
      expect(f.improved).toBe(f.cand < f.old)
      let diff = 0
      let diffAt = null
      for (let t = 0; t <= maxTime; t += 1) {
        for (let v = 0; v < n; v += 1) {
          if (f.prevDp[t][v] !== f.dp[t][v]) {
            diff += 1
            diffAt = [t, v]
          }
        }
      }
      expect(diff).toBe(f.improved ? 1 : 0)
      if (f.improved) {
        expect(diffAt).toEqual([f.arr, f.u])
        expect(f.dp[f.arr][f.u]).toBe(f.cand)
      } else {
        expect(f.dp).toEqual(f.prevDp)
      }
      // 4. dp 不可回退
      for (let t = 0; t <= maxTime; t += 1) {
        for (let v = 0; v < n; v += 1) {
          if (Number.isFinite(f.prevDp[t][v])) {
            expect(f.dp[t][v]).toBeLessThanOrEqual(f.prevDp[t][v])
          }
        }
      }
      // 6. best 就是当帧 min over t of dp[t][target]
      expect(f.best).toBe(Math.min(...f.dp.map((row) => row[target])))
    }

    // 5. cutCount：单调不减，且等于"可达格的出边中 arr > maxTime"的条数
    const finalDp = steps.at(-1).dp
    let recomputed = 0
    let totalOut = 0
    for (let t = 0; t <= maxTime; t += 1) {
      for (let v = 0; v < n; v += 1) {
        if (finalDp[t][v] === INF) continue
        for (const [x, y, time] of edges) {
          if (x === v) {
            totalOut += 1
            if (t + time > maxTime) recomputed += 1
          }
          if (y === v) {
            totalOut += 1
            if (t + time > maxTime) recomputed += 1
          }
        }
      }
    }
    let prevCut = 0
    for (const f of steps) {
      expect(f.cutCount).toBeGreaterThanOrEqual(prevCut)
      prevCut = f.cutCount
    }
    expect(steps.at(-1).cutCount).toBe(recomputed)
    expect(relax.length).toBe(totalOut - recomputed)

    // 6-7. best 单调不增、answer 换算
    let prevBest = INF
    for (const f of steps) {
      expect(f.best).toBeLessThanOrEqual(prevBest)
      prevBest = f.best
      expect(f.answer).toBe(f.best === INF ? -1 : f.best)
    }

    // 8. done 帧链自洽
    const done = steps.at(-1)
    if (done.answer === -1) {
      expect(done.chain).toEqual([])
      expect(done.cities).toEqual([])
      expect(Math.min(...done.dp.map((row) => row[target]))).toBe(INF)
    } else {
      expect(done.chain.length).toBeGreaterThan(0)
      expect(done.chain[0]).toEqual({ t: 0, v: 0 })
      expect(done.chain.at(-1)).toEqual({ t: done.bestT, v: target })
      expect(done.dp[done.bestT][target]).toBe(done.answer)
      expect(done.cities).toEqual(done.chain.map((s) => s.v))
      expect(done.cities[0]).toBe(0)
      expect(done.cities.at(-1)).toBe(target)
      let sum = fees[0]
      for (let k = 1; k < done.chain.length; k += 1) {
        const a = done.chain[k - 1]
        const b = done.chain[k]
        expect(b.t).toBeGreaterThan(a.t)
        const times = edges
          .filter(([x, y]) => (x === a.v && y === b.v) || (x === b.v && y === a.v))
          .map((e) => e[2])
        expect(times).toContain(b.t - a.t)
        sum += fees[b.v]
      }
      expect(sum).toBe(done.answer)
    }
  })

  it('默认题面：19 帧，relax 序列与答案 48 钉死', () => {
    const steps = buildLc1928Steps()
    expect(steps).toHaveLength(19)
    expect(steps[0].fees).toEqual(LC1928_DEFAULT_FEES)
    expect(steps[0].edges).toEqual(LC1928_DEFAULT_EDGES)
    expect(steps[0].maxTime).toBe(LC1928_DEFAULT_MAX_TIME)
    expect(steps[0].target).toBe(5)
    expect(steps[0].dp[0][0]).toBe(5)
    expect(
      steps.filter((f) => f.phase === 'relax').map((f) => [f.t, f.v, f.u, f.arr, f.from, f.cand, f.improved]),
    ).toEqual([
      [0, 0, 1, 2, 5, 6, true],
      [0, 0, 3, 1, 5, 25, true],
      [1, 3, 0, 2, 25, 30, true],
      [1, 3, 4, 2, 25, 45, true],
      [2, 0, 1, 4, 30, 31, true],
      [2, 0, 3, 3, 30, 50, true],
      [2, 1, 0, 4, 6, 11, true],
      [2, 1, 2, 4, 6, 8, true],
      [2, 4, 3, 3, 45, 65, false],
      [2, 4, 5, 3, 45, 48, true],
      [3, 3, 0, 4, 50, 55, false],
      [3, 3, 4, 4, 50, 70, true],
      [3, 5, 2, 5, 48, 50, true],
      [3, 5, 4, 4, 48, 68, true],
      [4, 0, 3, 5, 11, 31, true],
      [4, 4, 3, 5, 68, 88, false],
      [4, 4, 5, 5, 68, 71, true],
    ])
    const done = steps.at(-1)
    expect(done.answer).toBe(48)
    expect(done.bestT).toBe(3)
    expect(done.cutCount).toBe(11)
    expect(done.chain).toEqual([
      { t: 0, v: 0 },
      { t: 1, v: 3 },
      { t: 2, v: 4 },
      { t: 3, v: 5 },
    ])
    expect(done.cities).toEqual([0, 3, 4, 5])
    expect(done.desc).toContain('LC 322')
    expect(done.desc).toContain('分层图')
  })

  it('默认拓扑下 maxTime 差 1 分钟，答案就在便宜路与贵路之间跳', () => {
    const ans = (maxTime) => buildLc1928Steps({ maxTime }).at(-1).answer
    expect(ans(1)).toBe(-1) // 2 ≥ 1：两条路都超时
    expect(ans(2)).toBe(-1)
    expect(ans(3)).toBe(48) // 贵路 3 分钟刚好赶上
    expect(ans(5)).toBe(48)
    expect(ans(6)).toBe(11) // 便宜路 6 分钟刚好赶上
    expect(ans(9)).toBe(11)
    const cheap = buildLc1928Steps({ maxTime: 6 }).at(-1)
    expect(cheap.cities).toEqual([0, 1, 2, 5])
    const pricey = buildLc1928Steps({ maxTime: 5 }).at(-1)
    expect(pricey.cities).toEqual([0, 3, 4, 5])
  })

  it('三个官方示例逐一命中：30→11 / 29→48 / 25→-1', () => {
    const base = { fees: OFFICIAL_FEES, edges: OFFICIAL_EDGES }
    const a = buildLc1928Steps({ ...base, maxTime: 30 }).at(-1)
    expect(a.answer).toBe(11)
    expect(a.cities).toEqual([0, 1, 2, 5])
    expect(a.bestT).toBe(30)
    const b = buildLc1928Steps({ ...base, maxTime: 29 }).at(-1)
    expect(b.answer).toBe(48)
    expect(b.cities).toEqual([0, 3, 4, 5])
    expect(b.bestT).toBe(26)
    const c = buildLc1928Steps({ ...base, maxTime: 25 }).at(-1)
    expect(c.answer).toBe(-1)
    expect(c.cities).toEqual([])
  })

  it('非法入参回退默认题面', () => {
    const steps = buildLc1928Steps({ fees: [1], edges: 'nope', maxTime: 0 })
    expect(steps[0].fees).toEqual(LC1928_DEFAULT_FEES)
    expect(steps[0].edges).toEqual(LC1928_DEFAULT_EDGES)
    expect(steps[0].maxTime).toBe(LC1928_DEFAULT_MAX_TIME)
    expect(steps.at(-1).answer).toBe(48)
  })

  it('自环 / 越界 / time < 1 的边被静默过滤', () => {
    const steps = buildLc1928Steps({
      fees: [3, 4],
      edges: [
        [0, 0, 1], // 自环
        [0, 5, 2], // 越界
        [0, 1, 0], // 耗时 0
        [0, 1, 2], // 合法
      ],
      maxTime: 2,
    })
    expect(steps[0].edges).toEqual([[0, 1, 2]])
    expect(steps.at(-1).answer).toBe(7)
    expect(steps.at(-1).cities).toEqual([0, 1])
  })

  it('随机交叉：400 组 vs 小顶堆 Dijkstra + 暴力枚举', () => {
    let rng = 20261014
    const rand = (m) => {
      rng = (rng * 1103515245 + 12345) % 2147483648
      return rng % m
    }
    for (let k = 0; k < 400; k += 1) {
      const n = 2 + rand(5)
      const fees = Array.from({ length: n }, () => rand(10))
      const edgeCount = 1 + rand(7)
      const edges = []
      for (let e = 0; e < edgeCount; e += 1) {
        const x = rand(n)
        let y = rand(n)
        if (x === y) y = (x + 1) % n
        edges.push([x, y, 1 + rand(4)])
      }
      const maxTime = 1 + rand(8)
      const steps = buildLc1928Steps({ fees, edges, maxTime })
      const s0 = steps[0]
      const heap = refHeap(s0.n, s0.fees, s0.edges, s0.maxTime)
      expect(refBrute(s0.n, s0.fees, s0.edges, s0.maxTime)).toBe(heap)
      expect(steps.at(-1).answer).toBe(heap)
      // 顺带把帧不变量也扫一遍
      for (const f of steps.filter((x) => x.phase === 'relax')) {
        expect(f.cand).toBe(f.from + s0.fees[f.u])
        expect(f.improved).toBe(f.cand < f.old)
        expect(f.best).toBe(Math.min(...f.dp.map((row) => row[s0.target])))
      }
    }
  })
})
