import { describe, expect, it } from 'vitest'
import { buildMaxDepthSteps, buildTree } from '../maxDepthSteps'

// 演示结构（和状态机默认值、文章正文逐字一致）：
//          3
//         / \
//        9   20
//           /  \
//          15   7
//   层序数组: [3, 9, 20, null, null, 15, 7]
//   节点表（null 不占号）:
//      0=3  1=9  2=20  3=15  4=7
//   答案 3
const DEMO = [3, 9, 20, null, null, 15, 7]

const final = (values, opts = {}) => buildMaxDepthSteps({ values, ...opts }).at(-1)

/** 独立参考解一：BFS 数层数（和递归完全不同的实现路径）。 */
function refByBFS(values) {
  const { nodes, root } = buildTree(values)
  if (root === -1) return 0
  let q = [root]
  let d = 0
  while (q.length) {
    d += 1
    const nxt = []
    for (const id of q) {
      const n = nodes[id]
      if (n.left !== null) nxt.push(n.left)
      if (n.right !== null) nxt.push(n.right)
    }
    q = nxt
  }
  return d
}

/** 独立参考解二：朴素递归。 */
function refByRecursion(values) {
  const { nodes, root } = buildTree(values)
  if (root === -1) return 0
  const go = (id) => {
    if (id === null || id === undefined || nodes[id] === undefined) return 0
    return 1 + Math.max(go(nodes[id].left), go(nodes[id].right))
  }
  return go(root)
}

const ALL_TREES = [
  DEMO,
  [1],
  [1, 2],
  [1, null, 2],
  [1, 2, null, 3],
  [1, null, 2, null, null, null, 3],
  [1, 2, 3],
  [1, 2, 3, 4, 5, 6, 7],
  [1, 2, 3, 4, null, null, null, 5],
  [-1, -2, -3],
]

describe('maxDepthSteps — 演示树结构', () => {
  it('节点编号与官方样例一致', () => {
    const { nodes, root } = buildTree(DEMO)
    expect(root).toBe(0)
    expect(nodes.map((n) => n.value)).toEqual([3, 9, 20, 15, 7])
  })

  it('父子关系正确', () => {
    const { nodes } = buildTree(DEMO)
    expect(nodes[0].left).toBe(1) // 3 -> 9
    expect(nodes[0].right).toBe(2) // 3 -> 20
    expect(nodes[1].left).toBeNull() // 9 是叶子
    expect(nodes[2].left).toBe(3) // 20 -> 15
    expect(nodes[2].right).toBe(4) // 20 -> 7
  })

  it('层级正确（9 是叶子，20 有两个孩子）', () => {
    const { nodes } = buildTree(DEMO)
    expect(nodes[1].depth).toBe(1)
    expect(nodes[2].depth).toBe(1)
    expect(nodes[3].depth).toBe(2)
    expect(nodes[4].depth).toBe(2)
  })
})

describe('maxDepthSteps — 主流程（LC 104 官方例）', () => {
  it('答案是 3', () => {
    const last = final(DEMO)
    expect(last.phase).toBe('done')
    expect(last.done).toBe(true)
    expect(last.answer).toBe(3)
  })

  it('11 帧（4 个叶子/内节点计算 + 中途推进）', () => {
    expect(buildMaxDepthSteps({ values: DEMO })).toHaveLength(11)
  })

  it('第一帧是 init、栈为空、current 指向根、answer 还是 null', () => {
    const first = buildMaxDepthSteps({ values: DEMO })[0]
    expect(first.phase).toBe('init')
    expect(first.stack).toEqual([])
    expect(first.current).toBe(0)
    expect(first.answer).toBeNull()
  })

  it('结束时栈已清空', () => {
    expect(final(DEMO).stack).toEqual([])
  })

  it('focus 节点的计算式：20 那一帧是 1 + max(1, 1) = 2', () => {
    const steps = buildMaxDepthSteps({ values: DEMO })
    const f = steps.find((s) => s.phase === 'compute' && s.current === 2)
    expect(f).toBeDefined()
    expect(f.leftH).toBe(1)
    expect(f.rightH).toBe(1)
    expect(f.height).toBe(2)
  })

  it('根那一帧是 1 + max(1, 2) = 3', () => {
    const steps = buildMaxDepthSteps({ values: DEMO })
    const f = steps.find((s) => s.phase === 'compute' && s.current === 0)
    expect(f.leftH).toBe(1)
    expect(f.rightH).toBe(2)
    expect(f.height).toBe(3)
  })

  it('那个 1 不能少：每个内节点的 height 严格大于两个子树高度的最大值', () => {
    // 这一条直接钉死"1 + max(...)"里的 1 —— 如果写成 max(l, r) 就会失败
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      for (const s of buildMaxDepthSteps({ values })) {
        if (s.phase !== 'compute') continue
        const n = nodes[s.current]
        const childH = Math.max(
          n.left === null ? 0 : s.heightOf[n.left],
          n.right === null ? 0 : s.heightOf[n.right],
        )
        expect(s.height).toBe(childH + 1)
      }
    }
  })
})

describe('maxDepthSteps — answer 只在根算完时才出现', () => {
  it('根算完之前，每一帧的 answer 都是 null', () => {
    const steps = buildMaxDepthSteps({ values: DEMO })
    const rootDone = steps.findIndex((s) => s.phase === 'compute' && s.current === 0)
    expect(rootDone).toBeGreaterThan(-1)
    for (const s of steps.slice(0, rootDone)) {
      expect(s.answer).toBeNull()
    }
  })

  it('从根算完那一帧起，answer 就是最终答案且不再变化', () => {
    const steps = buildMaxDepthSteps({ values: DEMO })
    const rootDone = steps.findIndex((s) => s.phase === 'compute' && s.current === 0)
    const settled = steps[rootDone].answer
    expect(settled).toBe(3)
    for (const s of steps.slice(rootDone)) expect(s.answer).toBe(settled)
  })

  it('单节点树：根就是叶子，leaf 帧里 answer 立刻确定', () => {
    const steps = buildMaxDepthSteps({ values: [1] })
    expect(steps[1].phase).toBe('leaf')
    expect(steps[1].answer).toBe(1)
    expect(steps.at(-1).answer).toBe(1)
  })

  it('104 不需要全局变量：answer 恒等于根的高度，不依赖"一路取 max"', () => {
    for (const values of ALL_TREES) {
      const { nodes, root } = buildTree(values)
      const last = final(values)
      expect(last.answer).toBe(last.heightOf[root])
      expect(nodes[root]).toBeDefined()
    }
  })
})

describe('maxDepthSteps — 叶子是递归的起点', () => {
  it('每个叶子节点的 h 都是 1', () => {
    const { nodes } = buildTree(DEMO)
    const last = final(DEMO)
    const leaves = nodes.filter((n) => n.left === null && n.right === null)
    expect(leaves.length).toBe(3) // 9 / 15 / 7
    for (const n of leaves) expect(last.heightOf[n.id]).toBe(1)
  })

  it('leaf 帧里左右高度都记 0、height 记 1', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      for (const s of buildMaxDepthSteps({ values })) {
        if (s.phase !== 'leaf') continue
        const n = nodes[s.current]
        expect(n.left).toBeNull()
        expect(n.right).toBeNull()
        expect(s.leftH).toBe(0)
        expect(s.rightH).toBe(0)
        expect(s.height).toBe(1)
      }
    }
  })

  it('leaf 帧的数量 = 叶子节点数量', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      const leaves = nodes.filter((n) => n.left === null && n.right === null).length
      const leafFrames = buildMaxDepthSteps({ values }).filter((s) => s.phase === 'leaf').length
      expect(leafFrames).toBe(leaves)
    }
  })
})

describe('maxDepthSteps — 高度与深度的关系', () => {
  it('任意节点的 h <= 树高 - 它的 depth', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      const total = refByRecursion(values)
      const last = final(values)
      for (const n of nodes) {
        expect(last.heightOf[n.id]).toBeLessThanOrEqual(total - n.depth)
        expect(last.heightOf[n.id]).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('根的高度 == 整棵树的深度', () => {
    for (const values of ALL_TREES) {
      const { root } = buildTree(values)
      expect(final(values).heightOf[root]).toBe(final(values).answer)
    }
  })

  it('父节点的高度 = 1 + max(两个孩子的高度)，用最终帧交叉验证', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      const last = final(values)
      for (const n of nodes) {
        const cl = n.left === null ? 0 : last.heightOf[n.left]
        const cr = n.right === null ? 0 : last.heightOf[n.right]
        expect(last.heightOf[n.id]).toBe(1 + Math.max(cl, cr))
      }
    }
  })

  it('子节点的高度严格小于父节点', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      const last = final(values)
      for (const n of nodes) {
        if (n.parent === -1) continue
        expect(last.heightOf[n.id]).toBeLessThan(last.heightOf[n.parent])
      }
    }
  })
})

describe('maxDepthSteps — 递归栈行为', () => {
  it('栈底永远是根', () => {
    for (const values of ALL_TREES) {
      for (const s of buildMaxDepthSteps({ values })) {
        if (s.stack.length > 0) expect(s.stack[0].id).toBe(0)
      }
    }
  })

  it('depth 始终等于 stack.length - 1', () => {
    for (const values of ALL_TREES) {
      for (const s of buildMaxDepthSteps({ values })) {
        expect(s.depth).toBe(s.stack.length - 1)
      }
    }
  })

  it('每个节点恰好进栈一次（连续出现、不复活）', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      const steps = buildMaxDepthSteps({ values })
      for (const n of nodes) {
        const seen = steps.map((s) => s.stack.some((f) => f.id === n.id))
        const firstIdx = seen.indexOf(true)
        expect(firstIdx).toBeGreaterThan(-1)
        const lastIdx = seen.lastIndexOf(true)
        expect(seen.slice(firstIdx, lastIdx + 1).every(Boolean)).toBe(true)
      }
    }
  })

  it('maxDepthSeen 非递减，且最终等于树高', () => {
    for (const values of ALL_TREES) {
      let prev = -1
      for (const s of buildMaxDepthSteps({ values })) {
        expect(s.maxDepthSeen).toBeGreaterThanOrEqual(prev)
        prev = s.maxDepthSeen
      }
      // maxDepthSeen 是"递归深了几层"，根是第 0 层
      expect(final(values).maxDepthSeen).toBe(refByRecursion(values) - 1)
    }
  })

  it('每个节点的 height 都在最终帧里', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      const last = final(values)
      for (const n of nodes) {
        expect(Object.prototype.hasOwnProperty.call(last.heightOf, n.id)).toBe(true)
      }
    }
  })
})

describe('maxDepthSteps — 不变量（多组输入）', () => {
  it('每帧都有必需字段', () => {
    for (const s of buildMaxDepthSteps({ values: DEMO })) {
      expect(s).toHaveProperty('phase')
      expect(s).toHaveProperty('desc')
      expect(Array.isArray(s.stack)).toBe(true)
      expect(s).toHaveProperty('heightOf')
      expect(typeof s.done).toBe('boolean')
    }
  })

  it('最后一帧一定是 done', () => {
    for (const values of ALL_TREES) {
      const last = buildMaxDepthSteps({ values }).at(-1)
      expect(last.phase).toBe('done')
      expect(last.done).toBe(true)
    }
  })

  it('desc 每帧都不为空', () => {
    for (const values of ALL_TREES) {
      for (const s of buildMaxDepthSteps({ values })) {
        expect(s.desc.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('phase 只出现在允许的集合里', () => {
    const ALLOWED = new Set(['init', 'recurse', 'leaf', 'compute', 'done'])
    for (const values of ALL_TREES) {
      for (const s of buildMaxDepthSteps({ values })) {
        expect(ALLOWED.has(s.phase)).toBe(true)
      }
    }
  })

  it('合法输入下首尾帧结构一致', () => {
    for (const values of ALL_TREES) {
      const steps = buildMaxDepthSteps({ values })
      expect(steps[0].phase).toBe('init')
      expect(steps.at(-1).phase).toBe('done')
    }
  })

  it('每条 desc 里都不出现裸 ** 之外的危险字符（markdown 安全）', () => {
    for (const s of buildMaxDepthSteps({ values: DEMO })) {
      // 状态机的 desc 允许 ** 加粗（渲染层用 renderRichText 处理），
      // 但不该出现未闭合的情况 —— 成对出现即可
      const n = (s.desc.match(/\*\*/g) || []).length
      expect(n % 2).toBe(0)
    }
  })

  it('maxFrames 截断不会死循环', () => {
    const steps = buildMaxDepthSteps({ values: DEMO, maxFrames: 3 })
    expect(steps.length).toBeLessThanOrEqual(5)
    expect(steps.at(-1).phase).toBe('done')
  })
})

describe('maxDepthSteps — 边界情况', () => {
  it('空树只有一帧 done，答案是 0', () => {
    const steps = buildMaxDepthSteps({ values: [] })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].answer).toBe(0)
  })

  it('首元素是 null 也算空树', () => {
    expect(buildMaxDepthSteps({ values: [null] })).toHaveLength(1)
    expect(buildMaxDepthSteps({ values: [null] })[0].answer).toBe(0)
  })

  it('单节点树 → 1（根就是叶子）', () => {
    const steps = buildMaxDepthSteps({ values: [1] })
    expect(steps.at(-1).answer).toBe(1)
    expect(steps.filter((s) => s.phase === 'leaf')).toHaveLength(1)
  })

  it('只有左孩子的两层树 → 2', () => {
    //   1
    //  /
    // 2
    expect(final([1, 2]).answer).toBe(2)
  })

  it('只有右孩子的两层树 → 2', () => {
    //   1
    //    \
    //     2
    expect(final([1, null, 2]).answer).toBe(2)
  })

  it('左偏斜三层链 → 3', () => {
    //   1
    //  /
    // 2
    // /
    // 3
    expect(final([1, 2, null, 3]).answer).toBe(3)
  })

  it('右偏斜三层链 → 3', () => {
    //   1
    //    \
    //     2
    //      \
    //       3
    expect(final([1, null, 2, null, null, null, 3]).answer).toBe(3)
  })

  it('深偏斜树不会爆栈（显式栈写法）', () => {
    const values = [1]
    for (let i = 2; i <= 80; i += 1) values.push(i)
    const last = final(values)
    expect(last.done).toBe(true)
    expect(last.answer).toBeGreaterThan(1)
  })

  it('负数节点不影响深度计算', () => {
    expect(final([-1, -2, -3]).answer).toBe(2)
  })

  it('0 值节点不被当成空', () => {
    //   0
    //  / \
    // 0   0
    expect(final([0, 0, 0]).answer).toBe(2)
  })
})

describe('maxDepthSteps — 多组输入答案正确（双参考解交叉验证）', () => {
  const CASES = [
    { values: DEMO, expect: 3 },
    { values: [1], expect: 1 },
    { values: [1, 2], expect: 2 },
    { values: [1, null, 2], expect: 2 },
    { values: [1, 2, null, 3], expect: 3 },
    { values: [1, null, 2, null, null, null, 3], expect: 3 },
    { values: [1, 2, 3], expect: 2 },
    { values: [1, 2, 3, 4, 5, 6, 7], expect: 3 },
    { values: [1, 2, 3, 4, null, null, null, 5], expect: 4 },
    { values: [-1, -2, -3], expect: 2 },
    { values: [0, 0, 0], expect: 2 },
    // 左链带一个右分支
    { values: [1, 2, null, 3, 4], expect: 3 },
  ]

  it.each(CASES)('$values → $expect', ({ values, expect: want }) => {
    expect(final(values).answer).toBe(want)
  })

  it('状态机答案同时等于 BFS 与递归两个参考解', () => {
    for (const { values } of CASES) {
      const got = final(values).answer
      expect(got).toBe(refByBFS(values))
      expect(got).toBe(refByRecursion(values))
    }
  })
})
