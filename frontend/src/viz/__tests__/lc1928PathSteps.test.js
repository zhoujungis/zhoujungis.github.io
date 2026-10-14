/**
 * lc1928PathSteps.test.js — LC 1928 第二视角状态机单测：
 * 「只图便宜」与「守时间窗」两条路的对照，以及沿前驱表回溯状态链。
 *
 * 交叉验证：answer === 守时间窗的独立解（小顶堆 Dijkstra on (cost,t,v)），
 * 且 === 主状态机（buildLc1928Steps）终态的 answer。
 * 逐帧钉死：cheap / best 的 cities & arriveAt 自洽（相邻城市确有边、
 * 到达时刻之差恰是那条边的耗时）、best.chain 与 cities 对齐、
 * cheap.fee ≤ best.fee（无视时间窗的搜索空间更大；若 cheap 可行则取等）、
 * back 帧 cursor 递减且 revealedStates 递增。
 */
import { describe, it, expect } from 'vitest'
import {
  buildLc1928PathSteps,
  LC1928PATH_DEFAULT_FEES,
  LC1928PATH_DEFAULT_EDGES,
  LC1928PATH_DEFAULT_MAX_TIME,
} from '../lc1928PathSteps.js'
import { buildLc1928Steps } from '../lc1928Steps.js'

const INF = Infinity

/** 独立参考解：小顶堆 Dijkstra on (cost, t, v)。 */
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
  { opts: {}, answer: 48 },
  { opts: { maxTime: 6 }, answer: 11 },
  { opts: { maxTime: 2 }, answer: -1 },
  { opts: { fees: OFFICIAL_FEES, edges: OFFICIAL_EDGES, maxTime: 30 }, answer: 11 },
  { opts: { fees: OFFICIAL_FEES, edges: OFFICIAL_EDGES, maxTime: 29 }, answer: 48 },
  { opts: { fees: OFFICIAL_FEES, edges: OFFICIAL_EDGES, maxTime: 25 }, answer: -1 },
  { opts: { fees: [0, 5], edges: [[0, 1, 1]], maxTime: 1 }, answer: 5 },
  { opts: { fees: [1, 2, 3], edges: [[0, 1, 1]], maxTime: 5 }, answer: -1 },
  { opts: { fees: [0, 0, 0], edges: [[0, 1, 1], [1, 2, 1]], maxTime: 2 }, answer: 0 },
]

/**
 * 一条"路"的自洽性：首尾城市、相邻城市之间确有边、到达时刻严格递增
 * 且相邻差恰是那条边的耗时、fee 是沿途通行费之和、valid 按 maxTime 判。
 */
function checkPath(p, { n, fees, edges, maxTime, target }) {
  expect(p.cities[0]).toBe(0)
  expect(p.cities.at(-1)).toBe(target)
  expect(p.arriveAt[0]).toBe(0)
  expect(p.arriveAt).toHaveLength(p.cities.length)
  expect(p.fee).toBe(p.cities.reduce((sum, c) => sum + fees[c], 0))
  expect(p.totalTime).toBe(p.arriveAt.at(-1))
  // best 不携带 valid（它在时间窗内一定可行）；cheap 才需要判它会不会超时。
  if (p.valid !== undefined) expect(p.valid).toBe(p.totalTime <= maxTime)
  for (let k = 1; k < p.cities.length; k += 1) {
    expect(p.arriveAt[k]).toBeGreaterThan(p.arriveAt[k - 1])
    const times = edges
      .filter(([x, y]) => (x === p.cities[k - 1] && y === p.cities[k]) || (x === p.cities[k] && y === p.cities[k - 1]))
      .map((e) => e[2])
    expect(times).toContain(p.arriveAt[k] - p.arriveAt[k - 1])
  }
  expect(n).toBeGreaterThan(1)
}

describe('lc1928PathSteps（LC 1928 便宜路 vs 守时路 + 前驱回溯）', () => {
  it.each(CASES)('answer 与独立 Dijkstra、主状态机一致（case %#）', ({ opts, answer }) => {
    const steps = buildLc1928PathSteps(opts)
    const s0 = steps[0]
    const done = steps.at(-1)
    expect(done.answer).toBe(answer)
    expect(refHeap(s0.n, s0.fees, s0.edges, s0.maxTime)).toBe(answer)
    expect(buildLc1928Steps(opts).at(-1).answer).toBe(answer)
    expect(done.answer).toBe(done.best ? done.best.fee : -1)
  })

  it.each(CASES)('两条路与帧骨架的逐帧不变量（case %#）', ({ opts, answer }) => {
    const steps = buildLc1928PathSteps(opts)
    const s0 = steps[0]
    const done = steps.at(-1)
    const ctx = { ...s0, edges: s0.edges }

    expect(steps[0].phase).toBe('init')
    expect(done.phase).toBe('done')
    expect(done.done).toBe(true)
    expect(steps.filter((f) => f.done)).toHaveLength(1)

    // 帧序：init → [cheap] → [best, back×L] → done
    const phases = steps.map((f) => f.phase)
    expect(phases[0]).toBe('init')
    expect(phases.at(-1)).toBe('done')
    expect(phases.filter((p) => p === 'cheap').length).toBe(done.cheap ? 1 : 0)
    expect(phases.filter((p) => p === 'best').length).toBe(done.best ? 1 : 0)

    // cheap / best 结构自洽
    if (done.cheap) checkPath(done.cheap, ctx)
    if (done.best) {
      checkPath(done.best, ctx)
      expect(done.best.chain[0]).toEqual({ t: 0, v: 0 })
      expect(done.best.chain.at(-1)).toEqual({ t: done.best.totalTime, v: done.best.cities.at(-1) })
      done.best.chain.forEach((s, k) => {
        expect(s.v).toBe(done.best.cities[k])
        expect(s.t).toBe(done.best.arriveAt[k])
      })
      for (let k = 1; k < done.best.chain.length; k += 1) {
        const a = done.best.chain[k - 1]
        const b = done.best.chain[k]
        const times = s0.edges
          .filter(([x, y]) => (x === a.v && y === b.v) || (x === b.v && y === a.v))
          .map((e) => e[2])
        expect(times).toContain(b.t - a.t)
      }
      expect(done.best.totalTime).toBeLessThanOrEqual(s0.maxTime)
    }

    // 无视时间窗的搜索空间更大，它的最优值只会更小或相等 —— 便宜路超时就作废，
    // 守时路反而更贵；反过来，若便宜路自己就来得及，它正是守时的最优解（取等）。
    if (done.best && done.cheap) {
      expect(done.cheap.fee).toBeLessThanOrEqual(done.best.fee)
      if (done.cheap.valid) expect(done.best.fee).toBe(done.cheap.fee)
    }
    // 不可达时没有任何路
    if (answer === -1) {
      expect(done.best).toBe(null)
      expect(done.desc).toContain('-1')
    }

    // back 帧：cursor 从 L-1 递减到 0，revealedStates 递增
    const backs = steps.filter((f) => f.phase === 'back')
    if (done.best) {
      const L = done.best.chain.length
      expect(backs).toHaveLength(L)
      expect(backs.map((f) => f.cursor)).toEqual(Array.from({ length: L }, (_, i) => L - 1 - i))
      expect(backs.map((f) => f.revealedStates)).toEqual(Array.from({ length: L }, (_, i) => i + 1))
    } else {
      expect(backs).toHaveLength(0)
    }

    // 非 back 帧（init / cheap / best）的 cursor / revealedStates 是干净值
    for (const f of steps.filter((x) => x.phase !== 'back' && x.phase !== 'done')) {
      expect(f.cursor).toBe(-1)
      expect(f.revealedStates).toBe(0)
    }
    // done 帧收尾在揭示完的状态上（无解时停在 0）
    expect(done.cursor).toBe(0)
    expect(done.revealedStates).toBe(done.best ? done.best.chain.length : 0)
  })

  it('默认题面：8 帧，便宜路 11（6 分钟超时）与最优路 48（3 分钟）钉死', () => {
    const steps = buildLc1928PathSteps()
    expect(steps).toHaveLength(8)
    expect(steps.map((f) => f.phase)).toEqual(['init', 'cheap', 'best', 'back', 'back', 'back', 'back', 'done'])
    expect(steps[0].fees).toEqual(LC1928PATH_DEFAULT_FEES)
    expect(steps[0].edges).toEqual(LC1928PATH_DEFAULT_EDGES)
    expect(steps[0].maxTime).toBe(LC1928PATH_DEFAULT_MAX_TIME)

    const done = steps.at(-1)
    expect(done.cheap).toEqual({
      cities: [0, 1, 2, 5],
      arriveAt: [0, 2, 4, 6],
      fee: 11,
      totalTime: 6,
      valid: false,
      found: true,
    })
    expect(done.best).toEqual({
      cities: [0, 3, 4, 5],
      arriveAt: [0, 1, 2, 3],
      fee: 48,
      totalTime: 3,
      chain: [
        { t: 0, v: 0 },
        { t: 1, v: 3 },
        { t: 2, v: 4 },
        { t: 3, v: 5 },
      ],
    })
    expect(done.answer).toBe(48)
    expect(done.desc).toContain('48')
    expect(done.desc).toContain('前驱表')
    expect(done.desc).toContain('LC 743')

    // 便宜路作废：贵路贵得多，却是唯一来得及的
    const cheapFrame = steps.find((f) => f.phase === 'cheap')
    expect(cheapFrame.desc).toContain('超时')
    expect(cheapFrame.desc).toContain('便宜 ≠ 来得及')
    const bestFrame = steps.find((f) => f.phase === 'best')
    expect(bestFrame.desc).toContain('唯一来得及')
  })

  it('maxTime 放宽到 6：便宜路自己就成了最优解', () => {
    const done = buildLc1928PathSteps({ maxTime: 6 }).at(-1)
    expect(done.cheap.valid).toBe(true)
    expect(done.cheap.fee).toBe(11)
    expect(done.best.fee).toBe(11)
    expect(done.best.cities).toEqual([0, 1, 2, 5])
    expect(done.answer).toBe(11)
  })

  it('官方 maxTime=29：最便宜的路 30 分钟超时，最优路 26 分钟、48 块', () => {
    const base = { fees: OFFICIAL_FEES, edges: OFFICIAL_EDGES }
    const done = buildLc1928PathSteps({ ...base, maxTime: 29 }).at(-1)
    expect(done.cheap).toMatchObject({ cities: [0, 1, 2, 5], fee: 11, totalTime: 30, valid: false })
    expect(done.best).toMatchObject({ cities: [0, 3, 4, 5], fee: 48, totalTime: 26 })
    expect(done.answer).toBe(48)
  })

  it('官方 maxTime=25：连贵路也来不及 —— 无可行路，返回 -1', () => {
    const base = { fees: OFFICIAL_FEES, edges: OFFICIAL_EDGES }
    const done = buildLc1928PathSteps({ ...base, maxTime: 25 }).at(-1)
    expect(done.cheap).toMatchObject({ totalTime: 30, valid: false })
    expect(done.best).toBe(null)
    expect(done.answer).toBe(-1)
    expect(done.desc).toContain('没有可行路')
    expect(done.desc).toContain('可行性')
  })

  it('不连通的图：cheap 也没有（found = null）', () => {
    const steps = buildLc1928PathSteps({ fees: [1, 2, 3], edges: [[0, 1, 1]], maxTime: 5 })
    expect(steps.at(-1).cheap).toBe(null)
    expect(steps.at(-1).best).toBe(null)
    expect(steps.at(-1).answer).toBe(-1)
    expect(steps.map((f) => f.phase)).toEqual(['init', 'done'])
  })
})
