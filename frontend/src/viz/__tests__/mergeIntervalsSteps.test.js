import { describe, expect, it } from 'vitest'

import { buildMergeIntervalsSteps } from '../mergeIntervalsSteps.js'

// ── 独立参考解 ──────────────────────────────────────────────────────────────
/** 排序 + 扫描（独立实现）。 */
function refScan(intervals) {
  if (!intervals.length) return []
  const s = [...intervals].sort((a, b) => a[0] - b[0])
  const out = [[...s[0]]]
  for (let i = 1; i < s.length; i += 1) {
    const last = out[out.length - 1]
    if (s[i][0] <= last[1]) last[1] = Math.max(last[1], s[i][1])
    else out.push([...s[i]])
  }
  return out
}

/** 暴力图连通分量 —— 完全独立的一条路。 */
function refBrute(intervals) {
  const n = intervals.length
  if (!n) return []
  const parent = Array.from({ length: n }, (_, i) => i)
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])))
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const [a1, a2] = intervals[i]
      const [b1, b2] = intervals[j]
      if (a1 <= b2 && b1 <= a2) parent[find(i)] = find(j)
    }
  }
  const groups = new Map()
  for (let i = 0; i < n; i += 1) {
    const root = find(i)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root).push(intervals[i])
  }
  return [...groups.values()].map((g) => [Math.min(...g.map((x) => x[0])), Math.max(...g.map((x) => x[1]))])
}

const norm = (list) =>
  [...list]
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])
    .map((r) => r.join(','))
    .join(';')

const CASES = [
  [[1, 3], [2, 6], [8, 10], [15, 18]],
  [[1, 4], [4, 5]],
  [[1, 4], [0, 4]],
  [[1, 4], [2, 3]],
  [[1, 4], [0, 2], [3, 5]],
  [[2, 6], [1, 3], [8, 10]],
  [[5, 5], [1, 2], [1, 2]],
  [[1, 10], [2, 3], [4, 5], [6, 7]],
  [[1, 1]],
  [[3, 5], [1, 2], [4, 6], [0, 8]],
]

function final(intervals) {
  return buildMergeIntervalsSteps({ intervals }).at(-1)
}

describe('答案与两个独立参考解交叉验证', () => {
  it.each(CASES.map((c, i) => [JSON.stringify(c), i]))(
    'case %d: %s（状态机 / 扫描 / 暴力连通分量 三方一致）',
    (_, i) => {
      const intervals = CASES[i]
      const want = norm(refScan(intervals))
      expect(norm(final(intervals).result)).toBe(want)
      expect(norm(refBrute(intervals))).toBe(want)
    },
  )

  it('官方例：[[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]', () => {
    expect(final(CASES[0]).result).toEqual([
      [1, 6],
      [8, 10],
      [15, 18],
    ])
  })
})

describe('语义钉子：端点相触算重叠（<= 不是 <）', () => {
  it('[[1,4],[4,5]] → [[1,5]]：写成 < 会错拆成两段', () => {
    expect(final([[1, 4], [4, 5]]).result).toEqual([[1, 5]])
  })

  it('延伸必须取 max（新区间可能整体被罩住）：[[1,10],[2,3],[4,5],[6,7]] → [[1,10]]', () => {
    expect(final([[1, 10], [2, 3], [4, 5], [6, 7]]).result).toEqual([[1, 10]])
  })
})

describe('必须先排序', () => {
  it('乱序输入 [[2,6],[1,3],[8,10]] 也能正确合并成 [[1,6],[8,10]]', () => {
    expect(final([[2, 6], [1, 3], [8, 10]]).result).toEqual([
      [1, 6],
      [8, 10],
    ])
  })

  it('除 init 帧外，sorted 帧都严格按左端点有序', () => {
    for (const intervals of CASES) {
      for (const s of buildMergeIntervalsSteps({ intervals })) {
        if (s.phase === 'init') continue
        for (let i = 1; i < s.sorted.length; i += 1) {
          expect(s.sorted[i][0]).toBeGreaterThanOrEqual(s.sorted[i - 1][0])
        }
      }
    }
  })
})

describe('逐帧不变量', () => {
  it('cur 与 result 的所有段互不重叠且左端递增', () => {
    for (const intervals of CASES) {
      for (const s of buildMergeIntervalsSteps({ intervals })) {
        const segs = [...s.result]
        if (s.curStart !== null && !s.done) segs.push([s.curStart, s.curEnd])
        for (let i = 1; i < segs.length; i += 1) {
          expect(segs[i][0]).toBeGreaterThan(segs[i - 1][1])
        }
      }
    }
  })

  it('每个已处理区间都被 cur 或 result 罩住（不丢段）', () => {
    for (const intervals of CASES) {
      for (const s of buildMergeIntervalsSteps({ intervals })) {
        if (s.curStart === null || s.idx === null) continue
        for (let i = 0; i <= s.idx; i += 1) {
          const [st, en] = s.sorted[i]
          const covered =
            (st >= s.curStart && en <= s.curEnd) || s.result.some(([a, b]) => st >= a && en <= b)
          expect(covered).toBe(true)
        }
      }
    }
  })

  it('result 内部的段左端递增', () => {
    for (const intervals of CASES) {
      for (const s of buildMergeIntervalsSteps({ intervals })) {
        for (let i = 1; i < s.result.length; i += 1) {
          expect(s.result[i][0]).toBeGreaterThan(s.result[i - 1][1])
        }
      }
    }
  })

  it('extend 帧：比较值确实是 <= curEnd；close 帧：确实 > curEnd', () => {
    for (const intervals of CASES) {
      for (const s of buildMergeIntervalsSteps({ intervals })) {
        if (s.phase !== 'extend' && s.phase !== 'close') continue
        const start = s.sorted[s.idx][0]
        // cmp 是基于延伸/收段**前**的 curEnd 判的，帧里的 curEnd 已经是更新后的值；
        // 这里只验证结果方向与 cmp 一致
        if (s.cmp === 'overlap') expect(start).toBeLessThanOrEqual(s.curEnd)
        if (s.cmp === 'gap') {
          // close 帧里 cur 已经换成了新区间，重新看 result 的最后一段
          const lastClosed = s.result[s.result.length - 1]
          expect(start).toBeGreaterThan(lastClosed[1])
        }
      }
    }
  })
})

describe('输入保护与收尾帧', () => {
  it('不修改调用方传进来的数组（含顺序）', () => {
    const src = [[2, 6], [1, 3], [8, 10]]
    const snapshot = JSON.stringify(src)
    buildMergeIntervalsSteps({ intervals: src })
    expect(JSON.stringify(src)).toBe(snapshot)
  })

  it('done 帧保留 cur 的真实值，且 cur 已收进 result', () => {
    for (const intervals of CASES) {
      const last = final(intervals)
      expect(last.result.at(-1)).toEqual([last.curStart, last.curEnd])
    }
  })

  it('空输入：单帧 done，result 为空', () => {
    const steps = buildMergeIntervalsSteps({ intervals: [] })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].result).toEqual([])
  })

  it('主例：7 帧，2 轮 close', () => {
    const steps = buildMergeIntervalsSteps({ intervals: CASES[0] })
    expect(steps).toHaveLength(7)
    expect(steps.filter((s) => s.phase === 'close')).toHaveLength(2)
    expect(steps.filter((s) => s.phase === 'extend')).toHaveLength(1)
  })
})
