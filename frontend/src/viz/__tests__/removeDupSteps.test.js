import { describe, expect, it } from 'vitest'
import { buildRemoveDupSteps, runLengthFrom } from '../removeDupSteps'

// 演示结构（和状态机的默认值、文章正文逐字一致）：
//   pool 下标: 0=1  1=2  2=3  3=3  4=4  5=4  6=5
//   1 → 2 → 3 → 3 → 4 → 4 → 5    →    1 → 2 → 5
const POOL = [1, 2, 3, 3, 4, 4, 5]
const PATH = [0, 1, 2, 3, 4, 5, 6]

/** 取第 i 帧里 prev 指向的"值"（-1 表示 dummy）。 */
const prevVal = (step, pool = POOL, path = PATH) =>
  step.prev === -1 ? 'dummy' : pool[path[step.prev]]

/** 取第 i 帧里 curr 指向的"值"（越界表示 ∅）。 */
const currVal = (step, pool = POOL, path = PATH) =>
  step.curr >= path.length ? '∅' : pool[path[step.curr]]

const DEMO = (opts = {}) => buildRemoveDupSteps({ pool: POOL, path: PATH, ...opts })

describe('removeDupSteps — 重复段识别', () => {
  it('runLengthFrom 找到同值的连续区间长度', () => {
    // pool: 1 2 3 3 4 4 5 —— 下标 2 起是"3 3"，长度 2
    expect(runLengthFrom(POOL, PATH, 2)).toBe(2)
    expect(runLengthFrom(POOL, PATH, 4)).toBe(2)
    // 下标 0 的 1 只出现一次
    expect(runLengthFrom(POOL, PATH, 0)).toBe(1)
    // 越界
    expect(runLengthFrom(POOL, PATH, 7)).toBe(0)
    expect(runLengthFrom(POOL, PATH, -1)).toBe(0)
  })

  it('连续三连也算一整段', () => {
    const pool = [1, 1, 1, 2]
    const path = [0, 1, 2, 3]
    expect(runLengthFrom(pool, path, 0)).toBe(3)
    expect(runLengthFrom(pool, path, 1)).toBe(2)
  })

  it('判据是「值相等」而不是「下标相邻」', () => {
    // 相邻但值不同 —— 不是重复段
    const pool = [1, 2, 3]
    const path = [0, 1, 2]
    expect(runLengthFrom(pool, path, 0)).toBe(1)
    // 值相同的节点即使在 pool 里隔着距离，只要在 path 上相邻就算同一段
    const pool2 = [9, 1, 9]
    const path2 = [0, 2]
    expect(runLengthFrom(pool2, path2, 0)).toBe(2)
  })
})

describe('removeDupSteps — remove-all（本题语义：一个都不留）', () => {
  it('默认例 1 2 3 3 4 4 5 → 保留 1 2 5', () => {
    const steps = DEMO()
    const last = steps.at(-1)
    expect(last.phase).toBe('done')
    expect(last.kept.map((i) => POOL[PATH[i]])).toEqual([1, 2, 5])
    expect(last.removed.map((i) => POOL[PATH[i]])).toEqual([3, 3, 4, 4])
  })

  it('只有单次出现的值才留下；出现过重复的值一个不留', () => {
    // 1 1 1 2 3 3 4 —— 重复过的 1 和 3 全删，只剩 2 和 4
    const pool = [1, 1, 1, 2, 3, 3, 4]
    const path = [0, 1, 2, 3, 4, 5, 6]
    const last = buildRemoveDupSteps({ pool, path }).at(-1)
    expect(last.kept.map((i) => pool[path[i]])).toEqual([2, 4])
  })

  it('头节点重复时被摘掉 —— 这正是必须用 dummy 的场景', () => {
    const pool = [1, 1, 2]
    const path = [0, 1, 2]
    const steps = buildRemoveDupSteps({ pool, path })
    const last = steps.at(-1)
    expect(last.kept.map((i) => pool[path[i]])).toEqual([2])
    expect(last.removed).toEqual([0, 1])
    // prev 停在 dummy 上完成摘链
    const unlink = steps.find((s) => s.phase === 'unlink')
    expect(unlink.prev).toBe(-1)
  })

  it('尾节点重复时也被摘掉', () => {
    const pool = [1, 2, 2]
    const path = [0, 1, 2]
    const last = buildRemoveDupSteps({ pool, path }).at(-1)
    expect(last.kept.map((i) => pool[path[i]])).toEqual([1])
  })
})

describe('removeDupSteps — keep-one（阿里变体：重复的留一个）', () => {
  it('重复过的值留一个，没重复的值原样保留', () => {
    // 1 1 1 2 3 3 4 → 1 2 3 4
    const pool = [1, 1, 1, 2, 3, 3, 4]
    const path = [0, 1, 2, 3, 4, 5, 6]
    const last = buildRemoveDupSteps({ pool, path, mode: 'keep-one' }).at(-1)
    expect(last.kept.map((i) => pool[path[i]])).toEqual([1, 2, 3, 4])
    // 摘掉的是重复段里除最后一个之外的部分：1 的前两个、3 的第一个
    expect(last.removed.map((i) => pool[path[i]])).toEqual([1, 1, 3])
  })

  it('默认例在 keep-one 下变成 1 2 3 4 5', () => {
    const last = DEMO({ mode: 'keep-one' }).at(-1)
    expect(last.kept.map((i) => POOL[PATH[i]])).toEqual([1, 2, 3, 4, 5])
  })

  it('跟 LC 83（每个值都留一个）不是一回事', () => {
    // LC 83 会把 2 也留下（它本来就只出现一次），所以两者对"没重复的值"处理相同；
    // 但对"全相同"的链表，keep-one 留 1 个、remove-all 留 0 个
    const pool = [5, 5, 5], path = [0, 1, 2]
    expect(buildRemoveDupSteps({ pool, path, mode: 'keep-one' }).at(-1).kept).toHaveLength(1)
    expect(buildRemoveDupSteps({ pool, path, mode: 'remove-all' }).at(-1).kept).toHaveLength(0)
  })
})

describe('removeDupSteps — prev / curr 推进', () => {
  it('发现重复时 curr 前冲而 prev 停住 —— 错位是本题的看图重点', () => {
    const steps = DEMO()
    // 只看第一段重复（dup-start 到紧随其后的 unlink），prev 应当一直没动。
    // 注意不能 slice 到末尾 —— 那样会跨到第二段重复，那时 prev 已经合法地前移了。
    const startIdx = steps.findIndex((s) => s.phase === 'dup-start')
    const start = steps[startIdx]
    const endIdx = steps.findIndex((s, i) => i > startIdx && s.phase === 'unlink')
    const seg = steps.slice(startIdx + 1, endIdx)
    const skips = seg.filter((s) => s.phase === 'skip')
    expect(skips.length).toBeGreaterThan(0)
    for (const s of skips) expect(s.prev).toBe(start.prev)
    // curr 则在往右走
    expect(skips.at(-1).curr).toBeGreaterThan(start.curr)
  })

  it('没重复时 prev 跟着 curr 一起前进', () => {
    const pool = [1, 2, 3]
    const path = [0, 1, 2]
    const steps = buildRemoveDupSteps({ pool, path })
    const scans = steps.filter((s) => s.phase === 'scan')
    expect(scans.length).toBeGreaterThan(0)
    // scan 帧里 prev 永远紧邻 curr 左边（或 dummy）
    for (const s of scans) {
      expect(s.prev).toBe(s.curr - 1)
    }
  })

  it('每一段重复内部 prev 都不动，段与段之间才前移', () => {
    const steps = DEMO()
    const starts = steps
      .map((s, i) => (s.phase === 'dup-start' ? i : -1))
      .filter((i) => i >= 0)
    const ends = steps
      .map((s, i) => (s.phase === 'unlink' ? i : -1))
      .filter((i) => i >= 0)
    expect(starts).toHaveLength(2)
    expect(ends).toHaveLength(2)
    // 每一段：段内所有 skip 帧的 prev 都等于 dup-start 帧的 prev
    for (let n = 0; n < starts.length; n += 1) {
      const anchor = steps[starts[n]].prev
      for (let i = starts[n]; i <= ends[n]; i += 1) {
        expect(steps[i].prev).toBe(anchor)
      }
    }
    // 段与段之间 prev 确实前移了
    expect(steps[ends[1]].prev).toBeGreaterThan(steps[ends[0]].prev)
  })

  it('摘链帧的 prev 落在重复段前的那个节点（或 dummy）上', () => {
    const steps = DEMO()
    const unlinks = steps.filter((s) => s.phase === 'unlink')
    expect(unlinks).toHaveLength(2)
    // 第一段重复是 path 下标 2、3（值 3 3），prev 应在 path 下标 1（值 2）
    expect(prevVal(unlinks[0])).toBe(2)
    expect(unlinks[0].dupStart).toBe(2)
    expect(unlinks[0].dupEnd).toBe(4)
    // 第二段是 path 下标 4、5（值 4 4），prev 应在 path 下标 3 上
    expect(unlinks[1].dupStart).toBe(4)
    expect(unlinks[1].dupEnd).toBe(6)
  })

  it('每一帧 prev 都停在 curr 左边或 dummy（不会越过 curr）', () => {
    for (const s of DEMO()) {
      if (s.curr > PATH.length) continue
      // prev 是 dummy(-1) 或某个真实下标，且不应当超过 curr 之前
      expect(s.prev).toBeGreaterThanOrEqual(-1)
    }
  })
})

describe('removeDupSteps — 帧结构', () => {
  it('默认例的 phase 序列包含两轮 dup-start / skip×2 / unlink', () => {
    const phases = DEMO().map((s) => s.phase)
    expect(phases[0]).toBe('init')
    expect(phases.at(-1)).toBe('done')
    expect(phases.filter((p) => p === 'dup-start')).toHaveLength(2)
    expect(phases.filter((p) => p === 'unlink')).toHaveLength(2)
    expect(phases.filter((p) => p === 'skip')).toHaveLength(4)
  })

  it('removedNow 只在摘链那一帧非空，且累加进 removed', () => {
    const steps = DEMO()
    for (const s of steps) {
      if (s.phase !== 'unlink') expect(s.removedNow).toEqual([])
    }
    const unlinks = steps.filter((s) => s.phase === 'unlink')
    expect(unlinks[0].removedNow).toEqual([2, 3])
    expect(unlinks[0].removed).toEqual([2, 3])
    expect(unlinks[1].removedNow).toEqual([4, 5])
    expect(unlinks[1].removed).toEqual([2, 3, 4, 5])
  })

  it('只有最后一帧 done', () => {
    expect(DEMO().filter((s) => s.done)).toHaveLength(1)
  })
})

describe('removeDupSteps — 边界', () => {
  it('空链表：一帧返回，标记 done', () => {
    const steps = buildRemoveDupSteps({ pool: [], path: [] })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].done).toBe(true)
    expect(steps[0].kept).toEqual([])
  })

  it('单节点：原样保留', () => {
    const steps = buildRemoveDupSteps({ pool: [7], path: [0] })
    expect(steps.at(-1).kept).toEqual([0])
    expect(steps.at(-1).removed).toEqual([])
  })

  it('全相同：remove-all 全删，返回空', () => {
    const pool = [5, 5, 5, 5]
    const path = [0, 1, 2, 3]
    const last = buildRemoveDupSteps({ pool, path }).at(-1)
    expect(last.kept).toEqual([])
    expect(last.removed).toHaveLength(4)
  })

  it('完全没有重复：kept 等于原链表', () => {
    const pool = [1, 2, 3, 4]
    const path = [0, 1, 2, 3]
    const steps = buildRemoveDupSteps({ pool, path })
    expect(steps.at(-1).kept).toEqual([0, 1, 2, 3])
    expect(steps.at(-1).removed).toEqual([])
    expect(steps.filter((s) => s.phase === 'unlink')).toHaveLength(0)
  })

  it('整条链只有一段重复，且占满整个链表', () => {
    const pool = [2, 2]
    const path = [0, 1]
    const steps = buildRemoveDupSteps({ pool, path })
    const last = steps.at(-1)
    expect(last.kept).toEqual([])
    expect(steps.find((s) => s.phase === 'unlink').prev).toBe(-1)
  })
})

describe('removeDupSteps — 不变量', () => {
  const CASES = [
    { pool: POOL, path: PATH },
    { pool: [1, 1, 2], path: [0, 1, 2] },
    { pool: [1, 2, 2], path: [0, 1, 2] },
    { pool: [5, 5, 5, 5], path: [0, 1, 2, 3] },
    { pool: [1, 2, 3], path: [0, 1, 2] },
    { pool: [1], path: [0] },
    { pool: [], path: [] },
  ]

  it('kept 与 removed 互斥且并集等于全部节点', () => {
    for (const c of CASES) {
      const last = buildRemoveDupSteps(c).at(-1)
      const all = new Set([...last.kept, ...last.removed])
      expect(all.size).toBe(c.path.length)
      expect(last.kept.length + last.removed.length).toBe(c.path.length)
    }
  })

  it('kept 保持原链表顺序（升序下标）', () => {
    for (const c of CASES) {
      const kept = buildRemoveDupSteps(c).at(-1).kept
      expect(kept).toEqual([...kept].sort((x, y) => x - y))
    }
  })

  it('每帧都有非空描述', () => {
    for (const s of DEMO()) {
      expect(typeof s.desc).toBe('string')
      expect(s.desc.length).toBeGreaterThan(10)
    }
  })

  it('每个 pool 节点最多被摘一次', () => {
    const steps = DEMO()
    const seen = []
    for (const s of steps) for (const k of s.removedNow) seen.push(k)
    expect(new Set(seen).size).toBe(seen.length)
  })

  it('curr 单调不减（算法只往右走，从不回头）', () => {
    const steps = DEMO().filter((s) => s.phase !== 'done')
    let prev = -1
    for (const s of steps) {
      expect(s.curr).toBeGreaterThanOrEqual(prev)
      prev = s.curr
    }
  })

  it('两个模式对「没有重复」的输入给出相同结果', () => {
    const pool = [1, 2, 3]
    const path = [0, 1, 2]
    const a = buildRemoveDupSteps({ pool, path }).at(-1)
    const b = buildRemoveDupSteps({ pool, path, mode: 'keep-one' }).at(-1)
    expect(a.kept).toEqual(b.kept)
    expect(a.removed).toEqual(b.removed)
  })
})
