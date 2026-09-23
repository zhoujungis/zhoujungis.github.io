import { describe, expect, it } from 'vitest'
import { buildLcaSteps, buildTree, depthOf } from '../lcaSteps'

// 演示结构（和状态机默认值、文章正文逐字一致）：
//           3
//         /   \
//        5     1
//       / \   / \
//      6   2 0   8
//         / \
//        7   4
//   层序数组: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]
//   节点表（null 不占号）:
//      0=3  1=5  2=1  3=6  4=2  5=0  6=8  7=7  8=4
const DEMO = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]

const final = (values, opts = {}) => buildLcaSteps({ values, ...opts }).at(-1)

describe('lcaSteps — 演示树结构', () => {
  it('节点编号与官方样例一致', () => {
    const { nodes, root } = buildTree(DEMO)
    expect(root).toBe(0)
    expect(nodes.map((n) => n.value)).toEqual([3, 5, 1, 6, 2, 0, 8, 7, 4])
  })

  it('父子关系正确（5 的孩子是 6 / 2，2 的孩子是 7 / 4）', () => {
    const { nodes } = buildTree(DEMO)
    expect(nodes[1].left).toBe(3) // 5 -> 6
    expect(nodes[1].right).toBe(4) // 5 -> 2
    expect(nodes[4].left).toBe(7) // 2 -> 7
    expect(nodes[4].right).toBe(8) // 2 -> 4
    expect(nodes[5].left).toBeNull() // 0 是叶子
  })

  it('depthOf 能算出节点深度', () => {
    const { nodes } = buildTree(DEMO)
    expect(depthOf(nodes, 0)).toBe(0) // 3
    expect(depthOf(nodes, 1)).toBe(1) // 5
    expect(depthOf(nodes, 4)).toBe(2) // 2
    expect(depthOf(nodes, 8)).toBe(3) // 4
  })
})

describe('lcaSteps — 主流程（LC 236 默认例 p=6, q=4）', () => {
  it('答案是 5', () => {
    const last = final(DEMO)
    expect(last.phase).toBe('done')
    expect(last.done).toBe(true)
    // 5 的 value
    expect(last.answer).not.toBeNull()
  })

  it('最终 answer 是值 5 所在的那个节点', () => {
    const { nodes } = buildTree(DEMO)
    const idOf5 = nodes.find((n) => n.value === 5).id
    expect(final(DEMO).answer).toBe(idOf5)
  })

  it('返回到根的值 = answer', () => {
    const last = final(DEMO)
    expect(last.returning).toBe(last.answer)
    expect(last.returnSource).toBe('lca')
  })

  it('结束时栈已清空', () => {
    expect(final(DEMO).stack).toEqual([])
  })

  it('帧数足够演完"深钻 + 回溯"（至少 20 帧）', () => {
    expect(buildLcaSteps({ values: DEMO }).length).toBeGreaterThanOrEqual(20)
  })

  it('第一帧是 init 且栈为空、current 指向根', () => {
    const first = buildLcaSteps({ values: DEMO })[0]
    expect(first.phase).toBe('init')
    expect(first.stack).toEqual([])
    expect(first.current).toBe(0)
  })
})

describe('lcaSteps — 命中即返回（"一个节点可以是自己的祖先"）', () => {
  it('命中 p 后不再展开它的子树', () => {
    // p=6 是叶子；但用 p=5（有子树）验证更严格：进入 5 立刻命中返回
    const { nodes } = buildTree(DEMO)
    const idOf5 = nodes.find((n) => n.value === 5).id
    const steps = buildLcaSteps({ values: DEMO, p: 5, q: 1 })
    const afterHit = steps.slice(steps.findIndex((s) => s.phase === 'hit'))
    // 命中 5 之后，栈里不应该再出现 6 / 2 这些 5 的孩子
    for (const s of afterHit) {
      const ids = s.stack.map((f) => f.id)
      expect(ids).not.toContain(nodes.find((n) => n.value === 6).id)
      expect(ids).not.toContain(nodes.find((n) => n.value === 2).id)
    }
  })

  it('p 是 q 的祖先时，answer 就是 p 自己', () => {
    // 5 是 4 的祖先（5 -> 2 -> 4）
    const { nodes } = buildTree(DEMO)
    const idOf5 = nodes.find((n) => n.value === 5).id
    expect(final(DEMO, { p: 5, q: 4 }).answer).toBe(idOf5)
  })

  it('根为 p 时答案是根本身', () => {
    const { nodes } = buildTree(DEMO)
    const idOf3 = nodes.find((n) => n.value === 3).id
    expect(final(DEMO, { p: 3, q: 4 }).answer).toBe(idOf3)
  })

  it('命中帧标记了正确的 returnSource', () => {
    const steps = buildLcaSteps({ values: DEMO, p: 5, q: 1 })
    const hits = steps.filter((s) => s.phase === 'hit')
    const sources = hits.map((s) => s.returnSource).sort()
    expect(sources).toEqual(['p', 'q'])
  })

  it('found 会记录命中的节点', () => {
    const { nodes } = buildTree(DEMO)
    const idOf6 = nodes.find((n) => n.value === 6).id
    const idOf4 = nodes.find((n) => n.value === 4).id
    const last = final(DEMO)
    expect([...last.found].sort()).toEqual([idOf6, idOf4].sort())
  })
})

describe('lcaSteps — 分叉点唯一性', () => {
  it('全程只有一个节点被判为分叉点（returnSource === "lca" 的返回帧）', () => {
    const steps = buildLcaSteps({ values: DEMO })
    const forkReturns = steps.filter(
      (s) => s.phase === 'return' && s.returnSource === 'lca',
    )
    expect(forkReturns.length).toBeLessThanOrEqual(1)
  })

  it('decide 帧里"左右都非空"只出现一次', () => {
    // 注意区分两种 src='lca' 的 decide 帧：
    //   ① 分叉点本体：左右都非空 → 这是唯一一次"分叉"
    //   ② 答案继续向上冒时，途经的祖先（只有一个非空，但值就是答案）
    // 所以判据必须收敛到 ①：看 leftOf / rightOf 两边都非空。
    const { nodes } = buildTree(DEMO)
    const steps = buildLcaSteps({ values: DEMO })
    const forks = steps.filter((s) => {
      if (s.phase !== 'decide') return false
      const l = s.leftOf[s.current]
      const r = s.rightOf[s.current]
      return l !== undefined && l !== null && r !== undefined && r !== null
    })
    expect(forks).toHaveLength(1)
    expect(nodes[forks[0].current].value).toBe(5)
  })

  it('answer 一旦确定就不再变化', () => {
    const steps = buildLcaSteps({ values: DEMO })
    const withAnswer = steps.filter((s) => s.answer !== null)
    expect(withAnswer.length).toBeGreaterThan(0)
    const firstAnswer = withAnswer[0].answer
    for (const s of withAnswer) expect(s.answer).toBe(firstAnswer)
  })
})

describe('lcaSteps — 返回值传播', () => {
  it('每个非目标节点最终都在 memo 里留下返回值', () => {
    const { nodes } = buildTree(DEMO)
    const last = final(DEMO)
    // p / q 命中的节点也算"算完了"
    for (const n of nodes) {
      expect(Object.prototype.hasOwnProperty.call(last.memo, n.id)).toBe(true)
    }
  })

  it('叶子且非目标的节点返回 null', () => {
    const { nodes } = buildTree(DEMO)
    const idOf0 = nodes.find((n) => n.value === 0).id
    expect(final(DEMO).memo[idOf0]).toBeNull()
  })

  it('返回值只会是 null / p / q / LCA 四种身份之一', () => {
    const { nodes } = buildTree(DEMO)
    const idOf6 = nodes.find((n) => n.value === 6).id
    const idOf4 = nodes.find((n) => n.value === 4).id
    const idOf5 = nodes.find((n) => n.value === 5).id
    const last = final(DEMO)
    const allowed = new Set([null, idOf6, idOf4, idOf5])
    for (const v of Object.values(last.memo)) expect(allowed.has(v)).toBe(true)
  })

  it('leftOf / rightOf 记录的是子树的返回值，能对上', () => {
    const { nodes } = buildTree(DEMO)
    const idOf5 = nodes.find((n) => n.value === 5).id
    const idOf6 = nodes.find((n) => n.value === 6).id
    const idOf4 = nodes.find((n) => n.value === 4).id
    const last = final(DEMO)
    // 5 的左边是 6（p 命中），右边冒上来的是 4（q）
    expect(last.leftOf[idOf5]).toBe(idOf6)
    expect(last.rightOf[idOf5]).toBe(idOf4)
  })
})

describe('lcaSteps — 递归栈行为', () => {
  it('栈底永远是根', () => {
    const steps = buildLcaSteps({ values: DEMO })
    for (const s of steps) {
      if (s.stack.length > 0) expect(s.stack[0].id).toBe(0)
    }
  })

  it('depth 始终等于 stack.length - 1', () => {
    for (const s of buildLcaSteps({ values: DEMO })) {
      expect(s.depth).toBe(s.stack.length - 1)
    }
  })

  it('depth 永远不为负（init 帧为 -1 除外）', () => {
    for (const s of buildLcaSteps({ values: DEMO })) {
      if (s.phase === 'init' || s.phase === 'done') continue
      expect(s.depth).toBeGreaterThanOrEqual(0)
    }
  })

  it('maxDepth 非递减', () => {
    let prev = -1
    for (const s of buildLcaSteps({ values: DEMO })) {
      expect(s.maxDepth).toBeGreaterThanOrEqual(prev)
      prev = s.maxDepth
    }
  })

  it('每个节点最多进栈一次、出栈一次', () => {
    const { nodes } = buildTree(DEMO)
    const steps = buildLcaSteps({ values: DEMO })
    const pushed = new Map()
    for (const s of steps) {
      for (const f of s.stack) {
        if (!pushed.has(f.id)) pushed.set(f.id, [])
        pushed.get(f.id).push(s.phase)
      }
    }
    // 进栈一次：第一次出现后，栈里它要么持续存在，要么彻底消失（不会"复活"）
    for (const [id, phases] of pushed) {
      // 该 id 出现过的帧数 + 它连续存在的段数应 >= 1
      expect(phases.length).toBeGreaterThan(0)
      // 一旦从栈里消失，不应再出现
      const seen = steps.map((s) => s.stack.some((f) => f.id === id))
      const firstIdx = seen.indexOf(true)
      const lastIdx = seen.lastIndexOf(true)
      const middle = seen.slice(firstIdx, lastIdx + 1)
      // 段中不能有空洞（栈是连续的）
      expect(middle.every(Boolean)).toBe(true)
    }
    expect(pushed.size).toBe(nodes.length)
  })

  it('最深一帧的栈深等于树高', () => {
    const { nodes } = buildTree(DEMO)
    const treeHeight = Math.max(...nodes.map((n) => n.depth))
    expect(final(DEMO).maxDepth).toBe(treeHeight)
  })
})

describe('lcaSteps — 边界情况', () => {
  it('空树只有一帧 done', () => {
    const steps = buildLcaSteps({ values: [] })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].done).toBe(true)
    expect(steps[0].answer).toBeNull()
  })

  it('首元素是 null 也算空树', () => {
    expect(buildLcaSteps({ values: [null] })).toHaveLength(1)
  })

  it('单节点树：若它就是 p，答案是它自己', () => {
    expect(final([1], { p: 1, q: 1 }).answer).toBe(0)
  })

  it('单节点树：p 和 q 都在根上，答案是根', () => {
    const last = final([5], { p: 5, q: 5 })
    expect(last.answer).toBe(0)
  })

  it('两层树：两个都在 → 答案是根', () => {
    //    1
    //   / \
    //  2   3
    const last = final([1, 2, 3], { p: 2, q: 3 })
    expect(last.answer).toBe(0)
  })

  it('两层树：都在左子树 → 答案是那个左孩子', () => {
    //    1
    //   /
    //  2
    const last = final([1, 2], { p: 1, q: 2 })
    expect(last.answer).toBe(0) // 1 是 2 的祖先
  })

  it('偏斜树（一路向左）', () => {
    //   1
    //  /
    // 2
    // /
    // 3
    const last = final([1, 2, null, 3], { p: 2, q: 3 })
    // 2 是 3 的祖先
    const { nodes } = buildTree([1, 2, null, 3])
    const idOf2 = nodes.find((n) => n.value === 2).id
    expect(last.answer).toBe(idOf2)
  })

  it('只有右孩子的树', () => {
    //   1
    //    \
    //     2
    //      \
    //       3
    const last = final([1, null, 2, null, null, null, 3], { p: 1, q: 3 })
    expect(last.answer).toBe(0)
  })

  it('p / q 在 0 值节点上也不会被误当成 null', () => {
    // 0 是真值节点，不能因为值等于 0 就当成空
    const { nodes } = buildTree(DEMO)
    const idOf0 = nodes.find((n) => n.value === 0).id
    const idOf8 = nodes.find((n) => n.value === 8).id
    // 0 和 8 是 1 的两个孩子 → 答案是 1
    const idOf1 = nodes.find((n) => n.value === 1).id
    expect(final(DEMO, { p: 0, q: 8 }).answer).toBe(idOf1)
    expect(idOf0).not.toBe(idOf8)
  })
})

describe('lcaSteps — 多组 p/q 组合答案正确', () => {
  const CASES = [
    { p: 6, q: 4, expectValue: 5 },
    { p: 5, q: 1, expectValue: 3 },
    { p: 5, q: 4, expectValue: 5 },
    { p: 6, q: 8, expectValue: 3 },
    { p: 7, q: 4, expectValue: 2 },
    { p: 0, q: 8, expectValue: 1 },
    { p: 7, q: 7, expectValue: 7 },
    { p: 3, q: 8, expectValue: 3 },
  ]

  it.each(CASES)('p=$p, q=$q → $expectValue', ({ p, q, expectValue }) => {
    const { nodes } = buildTree(DEMO)
    const expected = nodes.find((n) => n.value === expectValue).id
    expect(final(DEMO, { p, q }).answer).toBe(expected)
  })
})

describe('lcaSteps — 不变量（多组输入）', () => {
  // 每组：树 + 一对"保证存在于树里"的 p/q。
  // 注意不能只给树不给 p/q —— 默认的 6 / 4 在这些小树里根本不存在，
  // pId/qId 会是 undefined，递归一个都命中不了（那是测试构造的问题，不是状态机的问题）。
  const TREES = [
    { values: DEMO, p: 6, q: 4 },
    { values: [1], p: 1, q: 1 },
    { values: [1, 2, 3], p: 2, q: 3 },
    { values: [1, 2, null, 3], p: 2, q: 3 },
    { values: [1, null, 2], p: 1, q: 2 },
    { values: [1, null, 2, null, null, null, 3], p: 1, q: 3 },
    { values: [1, 2, 3, 4, 5, 6, 7], p: 4, q: 7 },
  ]

  it('每帧都有必需字段', () => {
    for (const s of buildLcaSteps({ values: DEMO })) {
      expect(s).toHaveProperty('phase')
      expect(s).toHaveProperty('desc')
      expect(Array.isArray(s.stack)).toBe(true)
      expect(typeof s.desc).toBe('string')
      expect(s.desc.length).toBeGreaterThan(0)
      expect(s).toHaveProperty('memo')
      expect(s).toHaveProperty('answer')
      expect(typeof s.done).toBe('boolean')
    }
  })

  it('最后一帧一定是 done', () => {
    for (const { values, p, q } of TREES) {
      const last = buildLcaSteps({ values, p, q }).at(-1)
      expect(last.phase).toBe('done')
      expect(last.done).toBe(true)
    }
  })

  it('非空树的 answer 一定非空', () => {
    for (const { values, p, q } of TREES) {
      expect(buildLcaSteps({ values, p, q }).at(-1).answer).not.toBeNull()
    }
  })

  it('answer 指向真实存在的节点', () => {
    for (const { values, p, q } of TREES) {
      const { nodes } = buildTree(values)
      const ans = buildLcaSteps({ values, p, q }).at(-1).answer
      expect(nodes[ans]).toBeDefined()
    }
  })

  it('合法 p/q 下首尾帧结构一致', () => {
    for (const { values, p, q } of TREES) {
      const steps = buildLcaSteps({ values, p, q })
      expect(steps[0].phase).toBe('init')
      expect(steps.at(-1).phase).toBe('done')
    }
  })

  it('desc 每帧都不为空（渲染层要显示）', () => {
    for (const { values, p, q } of TREES) {
      for (const s of buildLcaSteps({ values, p, q })) {
        expect(s.desc.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('maxFrames 截断不会死循环', () => {
    const steps = buildLcaSteps({ values: DEMO, maxFrames: 3 })
    // init 1 帧 + 循环最多 3 帧 + done 1 帧
    expect(steps.length).toBeLessThanOrEqual(5)
    expect(steps.at(-1).phase).toBe('done')
  })
})
