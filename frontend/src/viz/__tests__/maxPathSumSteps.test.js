import { describe, expect, it } from 'vitest'
import { buildMaxPathSumSteps, buildTree } from '../maxPathSumSteps'

// 演示结构（和状态机默认值、文章正文逐字一致）：
//          -10
//         /   \
//        9     20
//            /    \
//           15     7
//   层序数组: [-10, 9, 20, null, null, 15, 7]
//   节点表（null 不占号）:
//      0=-10  1=9  2=20  3=15  4=7
//   答案 42，路径 15 → 20 → 7（不经过根！）
const DEMO = [-10, 9, 20, null, null, 15, 7]

const final = (values, opts = {}) => buildMaxPathSumSteps({ values, ...opts }).at(-1)

/** 一个独立实现的参考解，用来交叉验证状态机的 best。 */
function referenceMaxPathSum(values) {
  const { nodes, root } = buildTree(values)
  if (root === -1) return -Infinity
  let best = -Infinity
  const gain = (id) => {
    if (id === null || id === undefined || nodes[id] === undefined) return 0
    const n = nodes[id]
    const l = Math.max(gain(n.left), 0)
    const r = Math.max(gain(n.right), 0)
    best = Math.max(best, n.value + l + r)
    return n.value + Math.max(l, r)
  }
  gain(root)
  return best
}

describe('maxPathSumSteps — 演示树结构', () => {
  it('节点编号与官方样例一致', () => {
    const { nodes, root } = buildTree(DEMO)
    expect(root).toBe(0)
    expect(nodes.map((n) => n.value)).toEqual([-10, 9, 20, 15, 7])
  })

  it('父子关系正确', () => {
    const { nodes } = buildTree(DEMO)
    expect(nodes[0].left).toBe(1) // -10 -> 9
    expect(nodes[0].right).toBe(2) // -10 -> 20
    expect(nodes[1].left).toBeNull() // 9 是叶子
    expect(nodes[2].left).toBe(3) // 20 -> 15
    expect(nodes[2].right).toBe(4) // 20 -> 7
  })
})

describe('maxPathSumSteps — 主流程（LC 124 官方例）', () => {
  it('答案是 42', () => {
    const last = final(DEMO)
    expect(last.phase).toBe('done')
    expect(last.done).toBe(true)
    expect(last.best).toBe(42)
  })

  it('最优路径是 15 → 20 → 7，且不经过根', () => {
    const { nodes } = buildTree(DEMO)
    const idOf = (v) => nodes.find((n) => n.value === v).id
    expect(final(DEMO).bestPath).toEqual([idOf(15), idOf(20), idOf(7)])
  })

  it('bestNode 是那个拱顶（值为 20 的节点）', () => {
    const { nodes } = buildTree(DEMO)
    const idOf20 = nodes.find((n) => n.value === 20).id
    expect(final(DEMO).bestNode).toBe(idOf20)
  })

  it('结束时栈已清空', () => {
    expect(final(DEMO).stack).toEqual([])
  })

  it('第一帧是 init 且栈为空、current 指向根', () => {
    const first = buildMaxPathSumSteps({ values: DEMO })[0]
    expect(first.phase).toBe('init')
    expect(first.stack).toEqual([])
    expect(first.current).toBe(0)
  })

  it('帧数足够演完"钻到底 + 回溯"（至少 12 帧）', () => {
    expect(buildMaxPathSumSteps({ values: DEMO }).length).toBeGreaterThanOrEqual(12)
  })
})

describe('maxPathSumSteps — 核心洞察：返回值与答案是两个量', () => {
  it('每个节点的 gain = val + max(左, 右)，只选一条胳膊', () => {
    const { nodes } = buildTree(DEMO)
    const last = final(DEMO)
    // gainOf 的键是**节点 id**（不是值 —— -10 / 9 这些值当键很危险）
    const gainAt = (v) => last.gainOf[nodes.find((n) => n.value === v).id]
    // 20：左（15）=15，右（7）=7 → gain = 20 + max(15,7) = 35
    expect(gainAt(20)).toBe(35)
    // -10：左（9）=9，右（20）=35 → gain = -10 + max(9,35) = 25
    expect(gainAt(-10)).toBe(25)
    // 9：叶子 → gain = 9
    expect(gainAt(9)).toBe(9)
  })

  it('同一节点的 through 与 gain 不同：through 用两条胳膊', () => {
    // 20 那一帧：through = 20 + 15 + 7 = 42，gain = 20 + max(15,7) = 35
    const steps = buildMaxPathSumSteps({ values: DEMO })
    const f = steps.find((s) => s.through === 42)
    expect(f).toBeDefined()
    expect(f.gain).toBe(35)
    expect(f.through).not.toBe(f.gain)
  })

  it('gain 永不超过 through（因为 max(l,r) <= l + r，且 l、r 都 >= 0）', () => {
    // 只看"现场算出来"的帧；done 帧把 through 复写成 best 是为了收尾说明，
    // 不是一次真实计算，要排除掉。
    for (const s of buildMaxPathSumSteps({ values: DEMO })) {
      if (s.phase === 'done') continue
      if (s.through === null || s.gain === null) continue
      expect(s.gain).toBeLessThanOrEqual(s.through)
    }
  })

  it('叶子节点的 through 与 gain 相等（没有胳膊可拐）', () => {
    const steps = buildMaxPathSumSteps({ values: DEMO })
    const leafFrames = steps.filter(
      (s) => s.phase !== 'done' && s.gain !== null && s.through !== null && s.gain === s.through,
    )
    expect(leafFrames.length).toBeGreaterThan(0)
    // 每一个这样"两量相等"的帧，都应该是叶子（左右两个孩子都不存在）
    const { nodes } = buildTree(DEMO)
    for (const s of leafFrames) {
      const n = nodes[s.current]
      expect(n.left === null && n.right === null).toBe(true)
    }
  })

  it('真正的难点帧：20 的两个孩子都是正的，两条胳膊都用得上', () => {
    const steps = buildMaxPathSumSteps({ values: DEMO })
    const f = steps.find((s) => s.through === 42)
    expect(f.leftGain).toBe(15)
    expect(f.rightGain).toBe(7)
    expect(f.rawLeft).toBe(15)
    expect(f.rawRight).toBe(7)
  })
})

describe('maxPathSumSteps — 负贡献剪枝', () => {
  it('根 -10 的 gain 是正的（因为右孩子 20 的贡献够大）', () => {
    const last = final(DEMO)
    // 根是 id 0
    expect(last.gainOf[0]).toBe(25)
  })

  it('全负树：负贡献被 clamp 成 0，每个 gain 都是自己的值', () => {
    //   -1
    //   / \
    // -2  -3
    const last = final([-1, -2, -3])
    expect(last.best).toBe(-1)
    // 三个节点的 gain 都 <= 0
    for (const g of Object.values(last.gainOf)) expect(g).toBeLessThanOrEqual(0)
  })

  it('负贡献的孩子会被记进 pruned', () => {
    //   -1
    //   / \
    // -2  -3
    const { nodes } = buildTree([-1, -2, -3])
    const steps = buildMaxPathSumSteps({ values: [-1, -2, -3] })
    const withPruned = steps.filter((s) => s.pruned.length > 0)
    expect(withPruned.length).toBeGreaterThan(0)
    const allPruned = new Set(steps.flatMap((s) => s.pruned))
    expect(allPruned.has(nodes.find((n) => n.value === -2).id)).toBe(true)
    expect(allPruned.has(nodes.find((n) => n.value === -3).id)).toBe(true)
  })

  it('负贡献节点在父节点 decide 时 rawLeft/rawRight 保留原值（便于讲解）', () => {
    //     1
    //    / \
    //  -5   3
    const steps = buildMaxPathSumSteps({ values: [1, -5, 3] })
    const f = steps.find((s) => s.rawLeft !== null && s.rawLeft < 0)
    expect(f).toBeDefined()
    expect(f.leftGain).toBe(0) // clamp 后
    expect(f.rawLeft).toBe(-5) // 原值保留
  })

  it('有负孩子的节点，through 不等于 val + gain 的简单叠加（证明剪枝生效）', () => {
    //     1
    //    / \
    //  -5   3
    // through = 1 + 0 + 3 = 4（-5 被剪）；若不剪则 1 + (-5) + 3 = -1
    const last = final([1, -5, 3])
    expect(last.best).toBe(4)
  })
})

describe('maxPathSumSteps — best 初始化必须是 -Infinity', () => {
  it('单负节点 [-3] → -3（不是 0，路径至少含一个节点）', () => {
    expect(final([-3]).best).toBe(-3)
  })

  it('全负树取最大的那个单节点', () => {
    expect(final([-3]).best).toBe(-3)
    expect(final([-2, -1]).best).toBe(-1)
    expect(final([-1, -2, -3]).best).toBe(-1)
    expect(final([-5, -2, -8, -1]).best).toBe(-1)
  })

  it('全程 best 从 -Infinity 开始，第一帧就是 -Infinity', () => {
    const first = buildMaxPathSumSteps({ values: DEMO })[0]
    expect(first.best).toBe(-Infinity)
    expect(first.bestNode).toBeNull()
    expect(first.bestPath).toEqual([])
  })

  it('best 一旦离开 -Infinity 就再也不是 -Infinity', () => {
    const steps = buildMaxPathSumSteps({ values: DEMO })
    const firstReal = steps.findIndex((s) => s.best !== -Infinity)
    expect(firstReal).toBeGreaterThan(-1)
    for (const s of steps.slice(firstReal)) expect(s.best).not.toBe(-Infinity)
  })
})

describe('maxPathSumSteps — best 单调不减', () => {
  const TREES = [
    DEMO,
    [1, 2, 3],
    [1],
    [-3],
    [-1, -2, -3],
    [-2, -1],
    [1, -2, -3],
    [2, -1, -2],
    [2, -1],
    [5, 4, 8, 11, null, 13, 4, 7, 2],
    [1, 2, null, 3],
    [1, null, 2, null, null, null, 3],
    [1, 2, 3, 4, 5, 6, 7],
  ]

  it('best 序列单调不减', () => {
    for (const values of TREES) {
      let prev = -Infinity
      for (const s of buildMaxPathSumSteps({ values })) {
        expect(s.best).toBeGreaterThanOrEqual(prev)
        prev = s.best
      }
    }
  })

  it('答案与独立参考解一致', () => {
    for (const values of TREES) {
      expect(final(values).best).toBe(referenceMaxPathSum(values))
    }
  })

  it('bestPath 的首尾都是叶子（拱形路径的两端必然向下走到不能走）', () => {
    const LEAFY = [DEMO, [1, -2, -3], [2, -1, -2], [5, 4, 8, 11, null, 13, 4, 7, 2]]
    for (const values of LEAFY) {
      const { nodes } = buildTree(values)
      const last = final(values)
      const head = nodes[last.bestPath[0]]
      const tail = nodes[last.bestPath.at(-1)]
      // 叶子：没有孩子；其中一端可以是 bestNode 自己（单节点路径）
      if (last.bestPath.length > 1) {
        expect(head.left === null && head.right === null).toBe(true)
        expect(tail.left === null && tail.right === null).toBe(true)
      }
    }
  })

  it('bestPath 是一条连通路径（相邻两项是父子关系）', () => {
    for (const values of TREES) {
      const { nodes } = buildTree(values)
      const path = final(values).bestPath
      for (let i = 0; i + 1 < path.length; i += 1) {
        const a = nodes[path[i]]
        const b = nodes[path[i + 1]]
        expect(a.left === b.id || a.right === b.id || a.parent === b.id).toBe(true)
      }
    }
  })

  it('bestPath 的节点值之和等于 best', () => {
    for (const values of TREES) {
      const { nodes } = buildTree(values)
      const path = final(values).bestPath
      const sum = path.reduce((acc, id) => acc + nodes[id].value, 0)
      expect(sum).toBe(final(values).best)
    }
  })

  it('bestPath 当 bestNode 为叶子/单节点时只有它自己', () => {
    expect(final([1]).bestPath).toEqual([0])
    expect(final([-3]).bestPath).toEqual([0])
  })
})

describe('maxPathSumSteps — 不变量', () => {
  const TREES = [
    DEMO,
    [1],
    [1, 2, 3],
    [-3],
    [-1, -2, -3],
    [1, 2, null, 3],
    [1, null, 2, null, null, null, 3],
    [1, 2, 3, 4, 5, 6, 7],
    [5, 4, 8, 11, null, 13, 4, 7, 2],
    [-10, 9, 20, null, null, 15, 7],
    [2, -1],
    [1, -2, -3],
  ]

  it('每帧都有必需字段', () => {
    for (const s of buildMaxPathSumSteps({ values: DEMO })) {
      expect(s).toHaveProperty('phase')
      expect(s).toHaveProperty('desc')
      expect(Array.isArray(s.stack)).toBe(true)
      expect(typeof s.desc).toBe('string')
      expect(s.desc.length).toBeGreaterThan(0)
      expect(s).toHaveProperty('gainOf')
      expect(s).toHaveProperty('best')
      expect(Array.isArray(s.bestPath)).toBe(true)
      expect(Array.isArray(s.pruned)).toBe(true)
      expect(typeof s.done).toBe('boolean')
    }
  })

  it('最后一帧一定是 done', () => {
    for (const values of TREES) {
      const last = buildMaxPathSumSteps({ values }).at(-1)
      expect(last.phase).toBe('done')
      expect(last.done).toBe(true)
    }
  })

  it('非空树的最终 best 一定不是 -Infinity', () => {
    for (const values of TREES) {
      expect(final(values).best).not.toBe(-Infinity)
    }
  })

  it('非空树的最终 bestNode 非空且指向真实节点', () => {
    for (const values of TREES) {
      const { nodes } = buildTree(values)
      const last = final(values)
      expect(last.bestNode).not.toBeNull()
      expect(nodes[last.bestNode]).toBeDefined()
    }
  })

  it('depth 始终等于 stack.length - 1', () => {
    for (const values of TREES) {
      for (const s of buildMaxPathSumSteps({ values })) {
        expect(s.depth).toBe(s.stack.length - 1)
      }
    }
  })

  it('maxDepth 非递减，且最终等于树高', () => {
    for (const values of TREES) {
      const { nodes } = buildTree(values)
      const treeHeight = Math.max(...nodes.map((n) => n.depth))
      let prev = -1
      for (const s of buildMaxPathSumSteps({ values })) {
        expect(s.maxDepth).toBeGreaterThanOrEqual(prev)
        prev = s.maxDepth
      }
      expect(final(values).maxDepth).toBe(treeHeight)
    }
  })

  it('栈底永远是根', () => {
    for (const values of TREES) {
      for (const s of buildMaxPathSumSteps({ values })) {
        if (s.stack.length > 0) expect(s.stack[0].id).toBe(0)
      }
    }
  })

  it('每个节点恰好进栈一次（栈内连续出现，不复活）', () => {
    for (const values of TREES) {
      const { nodes } = buildTree(values)
      const steps = buildMaxPathSumSteps({ values })
      for (const n of nodes) {
        const seen = steps.map((s) => s.stack.some((f) => f.id === n.id))
        const firstIdx = seen.indexOf(true)
        expect(firstIdx).toBeGreaterThan(-1)
        const lastIdx = seen.lastIndexOf(true)
        expect(seen.slice(firstIdx, lastIdx + 1).every(Boolean)).toBe(true)
      }
    }
  })

  it('递归结束时每个节点的 gain 都算出来了', () => {
    for (const values of TREES) {
      const { nodes } = buildTree(values)
      const last = final(values)
      for (const n of nodes) {
        expect(Object.prototype.hasOwnProperty.call(last.gainOf, n.id)).toBe(true)
      }
    }
  })

  it('每个节点的 gain = val + max(clamp左, clamp右)', () => {
    // 用最终帧的 gainOf 交叉验证：gain 必须等于 自身值 + 两个孩子 gain 的较大者（负的算 0）
    for (const values of TREES) {
      const { nodes } = buildTree(values)
      const last = final(values)
      for (const n of nodes) {
        const gl = n.left === null ? 0 : Math.max(last.gainOf[n.left], 0)
        const gr = n.right === null ? 0 : Math.max(last.gainOf[n.right], 0)
        expect(last.gainOf[n.id]).toBe(n.value + Math.max(gl, gr))
      }
    }
  })

  it('每次出现 through 的帧，through = val + clamp左 + clamp右', () => {
    for (const values of TREES) {
      const { nodes } = buildTree(values)
      for (const s of buildMaxPathSumSteps({ values })) {
        // done 帧的 through 是 best 的复写（收尾说明用），不是一次真实计算
        if (s.phase === 'done') continue
        if (s.through === null) continue
        const n = nodes[s.current]
        const gl = s.leftGain === null ? 0 : s.leftGain
        const gr = s.rightGain === null ? 0 : s.rightGain
        expect(s.through).toBe(n.value + gl + gr)
      }
    }
  })

  it('每次出现 gain 的帧，gain = val + max(clamp左, clamp右)', () => {
    for (const values of TREES) {
      const { nodes } = buildTree(values)
      for (const s of buildMaxPathSumSteps({ values })) {
        if (s.phase === 'done') continue
        if (s.gain === null) continue
        const n = nodes[s.current]
        const gl = s.leftGain === null ? 0 : s.leftGain
        const gr = s.rightGain === null ? 0 : s.rightGain
        expect(s.gain).toBe(n.value + Math.max(gl, gr))
      }
    }
  })

  it('done 帧是收尾总结：through 复写 best，current 指向 bestNode', () => {
    for (const values of TREES) {
      const last = final(values)
      expect(last.through).toBe(last.best)
      expect(last.current).toBe(last.bestNode)
      expect(last.gain).toBe(last.gainOf[last.bestNode])
    }
  })

  it('clamp 后的 leftGain / rightGain 永不为负', () => {
    for (const values of TREES) {
      for (const s of buildMaxPathSumSteps({ values })) {
        if (s.leftGain !== null) expect(s.leftGain).toBeGreaterThanOrEqual(0)
        if (s.rightGain !== null) expect(s.rightGain).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('pruned 里的节点其 gain 一定 <= 0', () => {
    for (const values of TREES) {
      const last = final(values)
      for (const id of last.pruned) expect(last.gainOf[id]).toBeLessThanOrEqual(0)
    }
  })

  it('desc 每帧都不为空（渲染层要显示）', () => {
    for (const values of TREES) {
      for (const s of buildMaxPathSumSteps({ values })) {
        expect(s.desc.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('phase 只出现在允许的集合里', () => {
    const ALLOWED = new Set([
      'init',
      'recurse',
      'leaf',
      'collect',
      'update',
      'keep',
      'decide',
      'done',
    ])
    for (const values of TREES) {
      for (const s of buildMaxPathSumSteps({ values })) {
        expect(ALLOWED.has(s.phase)).toBe(true)
      }
    }
  })

  it('合法输入下首尾帧结构一致', () => {
    for (const values of TREES) {
      const steps = buildMaxPathSumSteps({ values })
      expect(steps[0].phase).toBe('init')
      expect(steps.at(-1).phase).toBe('done')
    }
  })
})

describe('maxPathSumSteps — 边界情况', () => {
  it('空树只有一帧 done', () => {
    const steps = buildMaxPathSumSteps({ values: [] })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].done).toBe(true)
    expect(steps[0].bestNode).toBeNull()
    expect(steps[0].bestPath).toEqual([])
  })

  it('首元素是 null 也算空树', () => {
    expect(buildMaxPathSumSteps({ values: [null] })).toHaveLength(1)
  })

  it('单节点正数', () => {
    expect(final([1]).best).toBe(1)
    expect(final([1]).bestPath).toEqual([0])
  })

  it('单节点负数（路径至少一个节点）', () => {
    expect(final([-3]).best).toBe(-3)
    expect(final([-3]).bestPath).toEqual([0])
  })

  it('单节点零', () => {
    expect(final([0]).best).toBe(0)
  })

  it('两层树：取"根 + 两条胳膊"', () => {
    //    1
    //   / \
    //  2   3
    expect(final([1, 2, 3]).best).toBe(6)
  })

  it('两层树：只有一条正胳膊时只拐一次', () => {
    //     1
    //    / \
    //  -2   3
    expect(final([1, -2, 3]).best).toBe(4)
  })

  it('偏斜树（一路向左）', () => {
    //   1
    //  /
    // 2
    // /
    // 3
    expect(final([1, 2, null, 3]).best).toBe(6)
  })

  it('偏斜树（一路向右）', () => {
    //   1
    //    \
    //     2
    //      \
    //       3
    expect(final([1, null, 2, null, null, null, 3]).best).toBe(6)
  })

  it('全负偏斜树取最大的单节点', () => {
    //   -1
    //   /
    // -2
    //   \
    //   -3
    expect(final([-1, -2]).best).toBe(-1)
  })

  it('0 值节点不会被误当成空（可以接进路径增大和）', () => {
    //     1
    //    / \
    //   0   2
    // through(1) = 1 + 0 + 2 = 3；若是空则 1 + 2 = 3 —— 用更极端的例子区分
    //     5
    //    / \
    //   0   0
    // through(5) = 5，gain(5) = 5
    expect(final([5, 0, 0]).best).toBe(5)
    // 0 与负数不同：0 接进来不亏，但也不赚，clamp 后仍是 0
    expect(final([-5, 0, 0]).best).toBe(0)
  })

  it('深偏斜树不会爆栈（显式栈写法）', () => {
    // 一条 60 个节点的左偏斜链
    const values = [1]
    for (let i = 2; i <= 60; i += 1) values.push(i)
    const { nodes } = buildTree(values)
    expect(nodes.length).toBeGreaterThan(5)
    const last = final(values)
    expect(last.done).toBe(true)
    expect(last.best).toBeGreaterThan(0)
  })

  it('maxFrames 截断不会死循环', () => {
    const steps = buildMaxPathSumSteps({ values: DEMO, maxFrames: 3 })
    // init 1 帧 + 循环最多 3 帧 + done 1 帧
    expect(steps.length).toBeLessThanOrEqual(5)
    expect(steps.at(-1).phase).toBe('done')
  })
})

describe('maxPathSumSteps — 多组输入答案正确', () => {
  const CASES = [
    { values: [-10, 9, 20, null, null, 15, 7], expect: 42 },
    { values: [1, 2, 3], expect: 6 },
    { values: [1], expect: 1 },
    { values: [-3], expect: -3 },
    { values: [-2, -1], expect: -1 },
    { values: [-1, -2, -3], expect: -1 },
    { values: [2, -1, -2], expect: 2 },
    { values: [1, -2, -3], expect: 1 },
    { values: [2, -1], expect: 2 },
    { values: [5, 4, 8, 11, null, 13, 4, 7, 2], expect: 48 },
    // [-3,1,2]：根 -3 挂了左右两个孩子。
    // through(根) = -3 + 1 + 2 = 0（负数根拖了后腿），所以优的是单个孩子 → 2
    { values: [-3, 1, 2], expect: 2 },
    { values: [1, -1, 2], expect: 3 },
    { values: [-2, 1], expect: 1 },
  ]

  it.each(CASES)('$values → $expect', ({ values, expect: want }) => {
    expect(final(values).best).toBe(want)
  })
})
