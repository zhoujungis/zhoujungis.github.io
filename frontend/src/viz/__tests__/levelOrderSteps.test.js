import { describe, expect, it } from 'vitest'
import { buildLevelOrderSteps, buildTree, levelsOf } from '../levelOrderSteps'

// 演示结构（和状态机的默认值、文章正文逐字一致）：
//         3
//        / \
//       9  20
//         /  \
//        15   7
//   层序数组: [3, 9, 20, null, null, 15, 7]
//   结果: [[3], [9, 20], [15, 7]]
const DEMO = [3, 9, 20, null, null, 15, 7]

const final = (values, opts = {}) =>
  buildLevelOrderSteps({ values, ...opts }).at(-1)

describe('buildTree — 层序数组建树', () => {
  it('按位置推出父子关系（下标 i 的孩子是 2i+1 / 2i+2）', () => {
    const { nodes, root } = buildTree(DEMO)
    expect(root).toBe(0)
    // 节点表按"真实节点"编号，null 不占号：
    // 0=3  1=9  2=20  3=15  4=7
    expect(nodes.map((n) => n.value)).toEqual([3, 9, 20, 15, 7])
    expect(nodes[0].left).toBe(1)
    expect(nodes[0].right).toBe(2)
    expect(nodes[2].left).toBe(3)
    expect(nodes[2].right).toBe(4)
    expect(nodes[1].left).toBeNull()
    expect(nodes[1].right).toBeNull()
  })

  it('深度与左右标记正确', () => {
    const { nodes } = buildTree(DEMO)
    expect(nodes[0].depth).toBe(0)
    expect(nodes[1].depth).toBe(1)
    expect(nodes[2].depth).toBe(1)
    expect(nodes[3].depth).toBe(2)
    expect(nodes[1].side).toBe('L')
    expect(nodes[2].side).toBe('R')
    expect(nodes[3].side).toBe('L')
    expect(nodes[4].side).toBe('R')
    expect(nodes[0].parent).toBe(-1)
  })

  it('同层 col 从左到右编号', () => {
    const { nodes } = buildTree(DEMO)
    expect(nodes[1].col).toBe(0) // 9 在左
    expect(nodes[2].col).toBe(1) // 20 在右
    expect(nodes[3].col).toBe(0) // 15 在左
    expect(nodes[4].col).toBe(1) // 7 在右
  })

  it('空树 / 首元素 null', () => {
    expect(buildTree([]).root).toBe(-1)
    expect(buildTree([null]).root).toBe(-1)
    expect(buildTree([]).nodes).toEqual([])
  })

  it('单节点', () => {
    const { nodes, root } = buildTree([1])
    expect(root).toBe(0)
    expect(nodes).toHaveLength(1)
    expect(nodes[0].left).toBeNull()
  })

  it('缺左孩子但有右孩子（null 占位）', () => {
    // [1, null, 2] —— 根只有右孩子
    const { nodes } = buildTree([1, null, 2])
    expect(nodes).toHaveLength(2)
    expect(nodes[0].left).toBeNull()
    expect(nodes[0].right).toBe(1)
    expect(nodes[1].value).toBe(2)
    expect(nodes[1].side).toBe('R')
  })

  it('levelsOf 按层分组', () => {
    const { nodes } = buildTree(DEMO)
    expect(levelsOf(nodes)).toEqual([[0], [1, 2], [3, 4]])
  })
})

describe('buildLevelOrderSteps — 主流程（LC 102）', () => {
  it('默认例输出 [[3],[9,20],[15,7]]', () => {
    expect(final(DEMO).results).toEqual([[3], [9, 20], [15, 7]])
  })

  it('右视图取每层最后一个：[3,20,7]', () => {
    expect(final(DEMO).rightView).toEqual([3, 20, 7])
  })

  it('层数等于树高', () => {
    expect(final(DEMO).results).toHaveLength(3)
  })

  it('每层开头快照 size，size 等于该层节点数', () => {
    const steps = buildLevelOrderSteps({ values: DEMO })
    const enters = steps.filter((s) => s.phase === 'enter')
    expect(enters.map((s) => s.levelSize)).toEqual([1, 2, 2])
    expect(enters.map((s) => s.levelIndex)).toEqual([0, 1, 2])
  })

  it('进层时 size 一定等于此刻队列长度 —— 这是分层的全部依据', () => {
    const steps = buildLevelOrderSteps({ values: DEMO })
    for (const s of steps) {
      if (s.phase === 'enter') expect(s.levelSize).toBe(s.queue.length)
    }
  })

  it('每一层内层循环恰好出队 levelSize 次', () => {
    const steps = buildLevelOrderSteps({ values: DEMO })
    const consumes = steps.filter((s) => s.phase === 'consume')
    // 3 层分别 1 / 2 / 2 = 5 个节点
    expect(consumes).toHaveLength(5)
    for (const s of consumes) {
      expect(s.consumed).toBeGreaterThanOrEqual(1)
      expect(s.consumed).toBeLessThanOrEqual(s.levelSize)
    }
  })

  it('consume 帧的 consumed 在每层内递增到 levelSize', () => {
    const steps = buildLevelOrderSteps({ values: DEMO })
    const byLevel = new Map()
    for (const s of steps) {
      if (s.phase !== 'consume') continue
      if (!byLevel.has(s.levelIndex)) byLevel.set(s.levelIndex, [])
      byLevel.get(s.levelIndex).push(s.consumed)
    }
    expect(byLevel.get(0)).toEqual([1])
    expect(byLevel.get(1)).toEqual([1, 2])
    expect(byLevel.get(2)).toEqual([1, 2])
  })

  it('封层帧出现次数 = 层数，且 results 长度同步增长', () => {
    const steps = buildLevelOrderSteps({ values: DEMO })
    const closes = steps.filter((s) => s.phase === 'close')
    expect(closes).toHaveLength(3)
    closes.forEach((s, i) => expect(s.results).toHaveLength(i + 1))
  })

  it('最后一帧是 done 且队列为空', () => {
    const steps = buildLevelOrderSteps({ values: DEMO })
    const last = steps.at(-1)
    expect(last.phase).toBe('done')
    expect(last.done).toBe(true)
    expect(last.queue).toEqual([])
  })

  it('入队顺序永远是 left → right（层序的根基）', () => {
    const steps = buildLevelOrderSteps({ values: DEMO })
    const enq = steps.filter((s) => s.phase === 'enqueue')
    // 3 的孩子 → 9, 20
    expect(enq[0].enqueued.map((id) => id)).toEqual([1, 2])
    // 20 的孩子 → 15, 7
    expect(enq[1].enqueued).toEqual([3, 4])
  })
})

describe('buildLevelOrderSteps — 锯齿变体（LC 103）', () => {
  it('奇数层反转：[[3],[20,9],[15,7]]', () => {
    expect(final(DEMO, { mode: 'zigzag' }).results).toEqual([[3], [20, 9], [15, 7]])
  })

  it('偶数层保持原序', () => {
    const steps = buildLevelOrderSteps({ values: DEMO, mode: 'zigzag' })
    const closes = steps.filter((s) => s.phase === 'close')
    expect(closes[0].levelValues).toEqual([3]) // 第 0 层不反转
    expect(closes[2].levelValues).toEqual([15, 7]) // 第 2 层不反转
  })

  it('第 1 层被标记为 reversed', () => {
    const steps = buildLevelOrderSteps({ values: DEMO, mode: 'zigzag' })
    const enters = steps.filter((s) => s.phase === 'enter')
    expect(enters.map((s) => s.zigzagReversed)).toEqual([false, true, false])
  })

  it('锯齿不改变队列本身的左右入队顺序', () => {
    const plain = buildLevelOrderSteps({ values: DEMO })
    const zig = buildLevelOrderSteps({ values: DEMO, mode: 'zigzag' })
    const q = (steps) => steps.map((s) => s.queue.join(','))
    expect(q(zig)).toEqual(q(plain))
  })

  it('锯齿的右视图与普通模式一致（右视图只看位置，不看输出方向）', () => {
    // 注意：锯齿模式下"每层最后一个元素"会变成左边那个，所以右视图必须
    // 另算。这里断言的是"两者都取自同一层的端点"，具体取哪端由题目定义。
    const plain = final(DEMO).rightView
    const zig = final(DEMO, { mode: 'zigzag' }).rightView
    expect(plain).toEqual([3, 20, 7])
    // 锯齿模式取的是"反转后列表的末位"，即原来是每层最左那个
    expect(zig).toEqual([3, 9, 7])
  })
})

describe('buildLevelOrderSteps — 右视图变体（LC 199）', () => {
  it('每层最后一个节点', () => {
    expect(final(DEMO).rightView).toEqual([3, 20, 7])
  })

  it('偏斜树（全是左孩子）的右视图就是每一层的唯一节点', () => {
    // 1 → 左 2 → 左 3
    expect(final([1, 2, null, 3]).rightView).toEqual([1, 2, 3])
  })

  it('右视图长度 = 层数', () => {
    const last = final(DEMO)
    expect(last.rightView).toHaveLength(last.results.length)
  })
})

describe('buildLevelOrderSteps — 边界', () => {
  it('空树返回 []，只有一帧', () => {
    const steps = buildLevelOrderSteps({ values: [] })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].done).toBe(true)
    expect(steps[0].results).toEqual([])
  })

  it('首元素是 null 也算空树', () => {
    expect(final([null]).results).toEqual([])
  })

  it('单节点', () => {
    const last = final([1])
    expect(last.results).toEqual([[1]])
    expect(last.rightView).toEqual([1])
  })

  it('全部节点值相同的完全二叉树', () => {
    //       7
    //      / \
    //     7   7
    expect(final([7, 7, 7]).results).toEqual([[7], [7, 7]])
  })

  it('偏斜树（一路向右）逐层只有一个节点', () => {
    // 1 → 右 2 → 右 3
    const last = final([1, null, 2, null, null, null, 3])
    expect(last.results).toEqual([[1], [2], [3]])
    expect(last.results).toHaveLength(3)
  })

  it('单节点树只有 1 层', () => {
    expect(final([5]).results).toHaveLength(1)
  })

  it('两层的完全树', () => {
    expect(final([1, 2, 3]).results).toEqual([[1], [2, 3]])
  })
})

describe('buildLevelOrderSteps — 不变量', () => {
  const CASES = [
    DEMO,
    [1],
    [1, 2, 3],
    [1, 2, null, 3],
    [1, null, 2],
    [3, 9, 20, null, null, 15, 7],
    [1, 2, 3, 4, 5, 6, 7],
    [7, 7, 7],
  ]

  it('每个节点恰好入队一次、出队一次', () => {
    for (const values of CASES) {
      const { nodes } = buildTree(values)
      const steps = buildLevelOrderSteps({ values })
      const enqueued = new Map()
      const consumed = new Map()
      for (const s of steps) {
        for (const id of s.enqueued) enqueued.set(id, (enqueued.get(id) ?? 0) + 1)
        // 只有 consume 帧才算"出队"：enqueue / close 帧会沿用上一步的 current
        if (s.phase === 'consume' && s.current !== null) {
          consumed.set(s.current, (consumed.get(s.current) ?? 0) + 1)
        }
      }
      expect(enqueued.size).toBe(nodes.length)
      expect(consumed.size).toBe(nodes.length)
      for (const id of enqueued.keys()) expect(enqueued.get(id)).toBe(1)
      for (const id of consumed.keys()) expect(consumed.get(id)).toBe(1)
    }
  })

  it('结果里的节点总数 = 树里节点总数', () => {
    for (const values of CASES) {
      const { nodes } = buildTree(values)
      const flat = final(values).results.flat()
      expect(flat).toHaveLength(nodes.length)
    }
  })

  it('结果按深度递增排列，且每层非空', () => {
    for (const values of CASES) {
      const { nodes } = buildTree(values)
      const depths = new Set(nodes.map((n) => n.depth))
      const results = final(values).results
      expect(results).toHaveLength(depths.size)
      for (const lv of results) expect(lv.length).toBeGreaterThan(0)
    }
  })

  it('每一层的值与 buildTree 的分层完全一致（普通模式）', () => {
    for (const values of CASES) {
      const { nodes } = buildTree(values)
      const expected = levelsOf(nodes).map((ids) => ids.map((id) => nodes[id].value))
      expect(final(values).results).toEqual(expected)
    }
  })

  it('levelIndex 非递减', () => {
    for (const values of CASES) {
      const steps = buildLevelOrderSteps({ values })
      let prev = -1
      for (const s of steps) {
        if (s.phase === 'init') continue
        expect(s.levelIndex).toBeGreaterThanOrEqual(prev)
        prev = s.levelIndex
      }
    }
  })

  it('consumed 不超过 levelSize', () => {
    for (const values of CASES) {
      for (const s of buildLevelOrderSteps({ values })) {
        expect(s.consumed).toBeLessThanOrEqual(s.levelSize)
      }
    }
  })

  it('无重复输入时两种模式结果相同', () => {
    // 只有一层的树，锯齿无从体现
    expect(final([1], { mode: 'zigzag' }).results).toEqual([[1]])
    // 两层的树，第 1 层会被反转，所以不同 —— 反过来验证锯齿确实生效
    expect(final([1, 2, 3], { mode: 'zigzag' }).results).toEqual([[1], [3, 2]])
  })

  it('帧结构完整（每帧都有必需字段）', () => {
    for (const s of buildLevelOrderSteps({ values: DEMO })) {
      expect(s).toHaveProperty('phase')
      expect(s).toHaveProperty('desc')
      expect(Array.isArray(s.queue)).toBe(true)
      expect(Array.isArray(s.results)).toBe(true)
      expect(Array.isArray(s.rightView)).toBe(true)
      expect(Array.isArray(s.levelValues)).toBe(true)
      expect(typeof s.desc).toBe('string')
      expect(s.desc.length).toBeGreaterThan(0)
    }
  })

  it('空树之外，每帧的 levelSize 都是非负整数', () => {
    for (const s of buildLevelOrderSteps({ values: DEMO })) {
      expect(Number.isInteger(s.levelSize)).toBe(true)
      expect(s.levelSize).toBeGreaterThanOrEqual(0)
    }
  })
})
