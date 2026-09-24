import { describe, expect, it } from 'vitest'
import { buildInvertTreeSteps, buildTree } from '../invertTreeSteps'

// 演示结构（和状态机默认值、文章正文逐字一致）：
//         4                 4
//        / \               / \
//       2   7      →      7   2
//      / \ / \           / \ / \
//     1  3 6  9         9  6 3  1
//   层序数组: [4, 2, 7, 1, 3, 6, 9]
//   节点表: 0=4  1=2  2=7  3=1  4=3  5=6  6=9
const DEMO = [4, 2, 7, 1, 3, 6, 9]

const final = (values, opts = {}) => buildInvertTreeSteps({ values, ...opts }).at(-1)

/** 由 sideOf 推出每个节点「id → 路径」（L/R 串）。根是空串。 */
// ⚠️ 键必须用 **节点 id**，不能用节点值 —— 值可能重复（`[0,0,0]` 三个节点值全是 0），
// 用值当键会互相覆盖、节点凭空消失。（系列里 LC 124 已经踩过一次同样的坑。）
function pathsFrom(values, sideOf) {
  const { nodes, root } = buildTree(values)
  if (root === -1) return {}
  const out = {}
  for (const n of nodes) {
    let col = ''
    let cur = n.id
    while (nodes[cur].parent !== -1) {
      col = (sideOf[cur] === 'R' ? 'R' : 'L') + col
      cur = nodes[cur].parent
    }
    out[n.id] = col
  }
  return out
}

/** 独立参考解：真·递归翻转，返回「id → 翻转后路径」。 */
function refFlipped(values) {
  const { nodes, root } = buildTree(values)
  if (root === -1) return {}

  const build = (id) =>
    id === null || id === undefined || nodes[id] === undefined
      ? null
      : { id, l: build(nodes[id].left), r: build(nodes[id].right) }

  const flip = (t) => (t === null ? null : { id: t.id, l: flip(t.r), r: flip(t.l) })

  const out = {}
  const walk = (t, path) => {
    if (t === null) return
    out[t.id] = path
    walk(t.l, path + 'L')
    walk(t.r, path + 'R')
  }
  walk(flip(build(root)), '')
  return out
}

/** 初始（未翻转）的「id → 路径」。 */
function initialPaths(values) {
  const { nodes } = buildTree(values)
  const side = {}
  for (const n of nodes) if (n.parent !== -1) side[n.id] = n.side
  return pathsFrom(values, side)
}

/** `[4,2,7,1,3,6,9]` 的节点表：0=4 根 · 1=2 · 2=7 · 3=1 · 4=3 · 5=6 · 6=9 */
const D = { '4': 0, '2': 1, '7': 2, '1': 3, '3': 4, '6': 5, '9': 6 }

const ALL_TREES = [
  DEMO,
  [1],
  [1, 2],
  [1, null, 2],
  [1, 2, 3],
  [1, 2, null, 3],
  [1, null, 2, null, null, null, 3],
  [1, 2, 3, 4, 5, 6, 7],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [-1, -2, -3],
  [4, 2, 7, 1, 3, 6, 9, null, null, null, null, null, null, 8, 10],
]

describe('invertTreeSteps — 演示树结构', () => {
  it('节点编号与官方样例一致', () => {
    const { nodes, root } = buildTree(DEMO)
    expect(root).toBe(0)
    expect(nodes.map((n) => n.value)).toEqual([4, 2, 7, 1, 3, 6, 9])
  })

  it('父子关系正确', () => {
    const { nodes } = buildTree(DEMO)
    expect(nodes[0].left).toBe(1) // 4 -> 2
    expect(nodes[0].right).toBe(2) // 4 -> 7
    expect(nodes[1].left).toBe(3) // 2 -> 1
    expect(nodes[1].right).toBe(4) // 2 -> 3
    expect(nodes[2].left).toBe(5) // 7 -> 6
    expect(nodes[2].right).toBe(6) // 7 -> 9
  })

  it('左右角色初始值正确', () => {
    const { nodes } = buildTree(DEMO)
    expect(nodes[1].side).toBe('L') // 2 是左
    expect(nodes[2].side).toBe('R') // 7 是右
    expect(nodes[3].side).toBe('L') // 1 是 2 的左
    expect(nodes[6].side).toBe('R') // 9 是 7 的右
  })
})

describe('invertTreeSteps — 主流程（LC 226 官方例）', () => {
  it('12 帧', () => {
    expect(buildInvertTreeSteps({ values: DEMO })).toHaveLength(12)
  })

  it('第一帧是 init、栈为空、current 指向根', () => {
    const first = buildInvertTreeSteps({ values: DEMO })[0]
    expect(first.phase).toBe('init')
    expect(first.stack).toEqual([])
    expect(first.current).toBe(0)
  })

  it('最后一帧是 done、栈为空', () => {
    const last = final(DEMO)
    expect(last.phase).toBe('done')
    expect(last.done).toBe(true)
    expect(last.stack).toEqual([])
  })

  it('翻转结果和真·递归翻转完全一致', () => {
    const { nodes } = buildTree(DEMO)
    const got = pathsFrom(DEMO, final(DEMO).sideOf)
    const want = refFlipped(DEMO)
    expect(got).toEqual(want)
    expect(nodes.length).toBeGreaterThan(0)
  })

  it('演示例的翻转结果是 2→R, 7→L, 1→RR, 3→RL, 6→LR, 9→LL', () => {
    const p = pathsFrom(DEMO, final(DEMO).sideOf)
    expect(p[D['2']]).toBe('R')
    expect(p[D['7']]).toBe('L')
    expect(p[D['1']]).toBe('RR')
    expect(p[D['3']]).toBe('RL')
    expect(p[D['6']]).toBe('LR')
    expect(p[D['9']]).toBe('LL')
    expect(p[D['4']]).toBe('')
  })
})

describe('invertTreeSteps — 核心不变量：路径逐位取反', () => {
  it('每个节点翻转后的路径 = 初始路径逐位取反（L↔R）', () => {
    for (const values of ALL_TREES) {
      const init = initialPaths(values)
      const after = pathsFrom(values, final(values).sideOf)
      for (const key of Object.keys(init)) {
        // 路径是自顶向下的 L/R 串；逐位取反后**顺序不变**（每一位独立翻转）
        const expectFlipped = [...init[key]].map((c) => (c === 'L' ? 'R' : 'L')).join('')
        expect(after[key]).toBe(expectFlipped)
      }
    }
  })

  it('再翻一次就还原：把结果路径再逐位取反 == 初始路径', () => {
    for (const values of ALL_TREES) {
      const init = initialPaths(values)
      const after = pathsFrom(values, final(values).sideOf)
      for (const key of Object.keys(init)) {
        const back = [...after[key]].map((c) => (c === 'L' ? 'R' : 'L')).join('')
        expect(back).toBe(init[key])
      }
    }
  })

  it('翻转不改变层级：每个节点的路径长度 == 它的初始 depth', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      const after = pathsFrom(values, final(values).sideOf)
      for (const n of nodes) {
        expect(after[n.id].length).toBe(n.depth)
      }
    }
  })

  it('翻转改变了左右：只要树不是退化成一条链，至少有一个节点换了边', () => {
    // 完全对称的满二叉树里，每个节点都会换边
    const after = pathsFrom(DEMO, final(DEMO).sideOf)
    const init = initialPaths(DEMO)
    expect(after).not.toEqual(init)
  })

  it('单节点树种"翻转"是恒等变换', () => {
    expect(pathsFrom([1], final([1]).sideOf)).toEqual({ 0: '' })
  })
})

describe('invertTreeSteps — 每个非叶节点恰好交换一次', () => {
  it('swapped 覆盖全部非叶节点，且无重复', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      const last = final(values)
      const nonLeaf = nodes.filter((n) => n.left !== null || n.right !== null)
      expect(last.swapped.length).toBe(nonLeaf.length)
      expect(new Set(last.swapped).size).toBe(last.swapped.length)
      for (const n of nonLeaf) expect(last.swapped).toContain(n.id)
    }
  })

  it('叶子节点从不进 swapped', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      const last = final(values)
      const leaves = nodes.filter((n) => n.left === null && n.right === null)
      for (const n of leaves) expect(last.swapped).not.toContain(n.id)
    }
  })

  it('swap 帧的数量 == 非叶节点数量', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      const nonLeaf = nodes.filter((n) => n.left !== null || n.right !== null).length
      const swapFrames = buildInvertTreeSteps({ values }).filter((s) => s.phase === 'swap').length
      expect(swapFrames).toBe(nonLeaf)
    }
  })

  it('leaf 帧的数量 == 叶子节点数量', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      const leaves = nodes.filter((n) => n.left === null && n.right === null).length
      const leafFrames = buildInvertTreeSteps({ values }).filter((s) => s.phase === 'leaf').length
      expect(leafFrames).toBe(leaves)
    }
  })

  it('swapped 单调增长（每个节点只加一次，从不移除）', () => {
    for (const values of ALL_TREES) {
      let prev = 0
      for (const s of buildInvertTreeSteps({ values })) {
        expect(s.swapped.length).toBeGreaterThanOrEqual(prev)
        prev = s.swapped.length
      }
    }
  })

  it('每个 swap 帧都带一对要互换的孩子', () => {
    for (const values of ALL_TREES) {
      for (const s of buildInvertTreeSteps({ values })) {
        if (s.phase !== 'swap') continue
        expect(Array.isArray(s.swapPair)).toBe(true)
        expect(s.swapPair).toHaveLength(2)
        // 至少一边非空（全是 null 就走 leaf 分支了）
        expect(s.swapPair[0] !== null || s.swapPair[1] !== null).toBe(true)
      }
    }
  })
})

describe('invertTreeSteps — 回归：单侧空树必须访问到所有节点', () => {
  // ⚠️ 这是一条**回归测试**。
  // 初版在交换后如果"交换得到的左孩子"是 null，就把 stage 直接跳到 'right'，
  // 于是 left 阶段被整个跳过 —— 而原来那个左孩子正等着在 left 阶段被递归
  //（交换后它是右孩子）。症状：`[1,2,null,3]` 只交换了根，整条左链一个节点都没访问。
  it('[1,2,null,3]：根交换后左变空，但深层节点仍必须被访问', () => {
    //   1                1
    //  /        →         \
    // 2                    2
    // /                     \
    // 3                      3
    const values = [1, 2, null, 3]
    const { nodes } = buildTree(values)
    const last = final(values)
    // 两个非叶节点：1 和 2
    expect(last.swapped).toHaveLength(2)
    expect(last.swapped).toContain(0) // 根
    expect(last.swapped).toContain(1) // 值 2
    // 翻转结果：2 到右边、3 继续挂在 2 的右边（id: 0=1, 1=2, 2=3）
    expect(pathsFrom(values, last.sideOf)).toEqual({ 0: '', 1: 'R', 2: 'RR' })
    expect(nodes.length).toBe(3)
  })

  it('[1,null,2,null,null,null,3]：右链翻转后变左链', () => {
    //   1            1
    //    \     →      \
    //     2              2
    //      \              \
    //       3              3
    const values = [1, null, 2, null, null, null, 3]
    const last = final(values)
    expect(last.swapped).toHaveLength(2)
    // id: 0=1, 1=2, 2=3 —— 翻转后 2 与 3 都跑到左边
    expect(pathsFrom(values, last.sideOf)).toEqual({ 0: '', 1: 'L', 2: 'LL' })
  })

  it('所有含单侧空孩子的树都能访问到全部节点', () => {
    // ⚠️ 每个数组都必须是**合法**的层序编码：下标 i 的节点，孩子必须在 2i+1 / 2i+2。
    // 像 `[1, null, 2, 3]` 这种，下标 3 的父是下标 1（null），是孤儿节点，
    // buildTree 会把它建成 parent === -1 的孤立节点 —— 参考解从根走根本到不了它。
    const CASES = [
      [1, 2],
      [1, null, 2],
      [1, 2, null, 3],
      [1, null, 2, null, null, null, 3],
      [1, 2, 3, null, null, 4],
      [1, 2, 3, 4, null, null, null],
      [1, 2, null, 3, 4],
      [1, 2, 3, null, 4],
    ]
    for (const values of CASES) {
      const { nodes, root } = buildTree(values)
      const last = final(values)
      const nonLeaf = nodes.filter((n) => n.left !== null || n.right !== null).length
      expect(last.swapped).toHaveLength(nonLeaf)
      // 路径映射必须覆盖所有节点，且与参考解一致
      expect(Object.keys(pathsFrom(values, last.sideOf))).toHaveLength(nodes.length)
      expect(pathsFrom(values, last.sideOf)).toEqual(refFlipped(values))
      expect(root).toBe(0)
    }
  })
})

describe('invertTreeSteps — sideOf 与递归栈', () => {
  it('sideOf 只包含非根节点，且取值只有 L / R', () => {
    for (const values of ALL_TREES) {
      const { nodes, root } = buildTree(values)
      const side = final(values).sideOf
      expect(Object.prototype.hasOwnProperty.call(side, root)).toBe(false)
      expect(Object.keys(side)).toHaveLength(nodes.length - 1)
      for (const v of Object.values(side)) expect(['L', 'R']).toContain(v)
    }
  })

  it('sideOf 的键集合恒等于非根节点集合（每帧都不多不少）', () => {
    for (const values of ALL_TREES) {
      const { nodes, root } = buildTree(values)
      const expected = nodes.filter((n) => n.id !== root).map((n) => String(n.id)).sort()
      for (const s of buildInvertTreeSteps({ values })) {
        expect(Object.keys(s.sideOf).sort()).toEqual(expected)
      }
    }
  })

  it('栈底永远是根；栈里就是从根到当前节点的那条路径', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      for (const s of buildInvertTreeSteps({ values })) {
        if (s.stack.length === 0) continue
        expect(s.stack[0].id).toBe(0)
        // 相邻两项必须是父子
        for (let i = 0; i + 1 < s.stack.length; i += 1) {
          expect(nodes[s.stack[i + 1].id].parent).toBe(s.stack[i].id)
        }
      }
    }
  })

  it('depth 始终等于 stack.length - 1', () => {
    for (const values of ALL_TREES) {
      for (const s of buildInvertTreeSteps({ values })) {
        expect(s.depth).toBe(s.stack.length - 1)
      }
    }
  })

  it('每个节点最多进栈一次（连续出现、不复活）', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      const steps = buildInvertTreeSteps({ values })
      for (const n of nodes) {
        const seen = steps.map((s) => s.stack.some((f) => f.id === n.id))
        const firstIdx = seen.indexOf(true)
        expect(firstIdx).toBeGreaterThan(-1)
        const lastIdx = seen.lastIndexOf(true)
        expect(seen.slice(firstIdx, lastIdx + 1).every(Boolean)).toBe(true)
      }
    }
  })

  it('递归最大深度 == 树高', () => {
    for (const values of ALL_TREES) {
      const { nodes } = buildTree(values)
      const treeH = Math.max(...nodes.map((n) => n.depth))
      const maxSeen = Math.max(...buildInvertTreeSteps({ values }).map((s) => s.depth))
      expect(maxSeen).toBe(treeH)
    }
  })
})

describe('invertTreeSteps — 不变量（多组输入）', () => {
  it('每帧都有必需字段', () => {
    for (const s of buildInvertTreeSteps({ values: DEMO })) {
      expect(s).toHaveProperty('phase')
      expect(s).toHaveProperty('desc')
      expect(Array.isArray(s.stack)).toBe(true)
      expect(Array.isArray(s.swapped)).toBe(true)
      expect(s).toHaveProperty('sideOf')
      expect(typeof s.done).toBe('boolean')
    }
  })

  it('最后一帧一定是 done', () => {
    for (const values of ALL_TREES) {
      const last = buildInvertTreeSteps({ values }).at(-1)
      expect(last.phase).toBe('done')
      expect(last.done).toBe(true)
    }
  })

  it('desc 每帧都不为空', () => {
    for (const values of ALL_TREES) {
      for (const s of buildInvertTreeSteps({ values })) {
        expect(s.desc.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('phase 只出现在允许的集合里', () => {
    const ALLOWED = new Set(['init', 'swap', 'leaf', 'descend', 'done'])
    for (const values of ALL_TREES) {
      for (const s of buildInvertTreeSteps({ values })) {
        expect(ALLOWED.has(s.phase)).toBe(true)
      }
    }
  })

  it('desc 里的 ** 成对出现（markdown 安全）', () => {
    for (const s of buildInvertTreeSteps({ values: DEMO })) {
      expect(((s.desc.match(/\*\*/g) || []).length) % 2).toBe(0)
    }
  })

  it('合法输入下首尾帧结构一致', () => {
    for (const values of ALL_TREES) {
      const steps = buildInvertTreeSteps({ values })
      expect(steps[0].phase).toBe('init')
      expect(steps.at(-1).phase).toBe('done')
    }
  })

  it('maxFrames 截断不会死循环', () => {
    const steps = buildInvertTreeSteps({ values: DEMO, maxFrames: 3 })
    expect(steps.length).toBeLessThanOrEqual(5)
    expect(steps.at(-1).phase).toBe('done')
  })
})

describe('invertTreeSteps — 边界情况', () => {
  it('空树只有一帧 done', () => {
    const steps = buildInvertTreeSteps({ values: [] })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].swapped).toEqual([])
  })

  it('首元素是 null 也算空树', () => {
    expect(buildInvertTreeSteps({ values: [null] })).toHaveLength(1)
  })

  it('单节点树：只有 init + leaf + done，交换数 0', () => {
    const steps = buildInvertTreeSteps({ values: [1] })
    expect(steps.map((s) => s.phase)).toEqual(['init', 'leaf', 'done'])
    expect(steps.at(-1).swapped).toEqual([])
  })

  it('两层满树：12 → 21', () => {
    const values = [1, 2, 3] // id: 0=1, 1=2, 2=3
    const last = final(values)
    expect(last.swapped).toHaveLength(1)
    expect(pathsFrom(values, last.sideOf)).toEqual({ 0: '', 1: 'R', 2: 'L' })
  })

  it('负数节点正常翻转', () => {
    const values = [-1, -2, -3] // id: 0=-1, 1=-2, 2=-3
    const last = final(values)
    expect(pathsFrom(values, last.sideOf)).toEqual({ 0: '', 1: 'R', 2: 'L' })
  })

  it('0 值节点不被当成空（值全相同也不能丢节点）', () => {
    // ⚠️ 三个节点值都是 0 —— 如果路径映射用值当键，这里只会剩 1 个键。
    const values = [0, 0, 0]
    const last = final(values)
    const paths = pathsFrom(values, last.sideOf)
    expect(Object.keys(paths)).toHaveLength(3)
    expect(paths).toEqual({ 0: '', 1: 'R', 2: 'L' })
    expect(last.swapped).toHaveLength(1)
    expect(last.swapped).toContain(0)
  })

  it('深偏斜树不会爆栈', () => {
    const values = [1]
    for (let i = 2; i <= 60; i += 1) values.push(i)
    const last = final(values)
    expect(last.done).toBe(true)
    expect(last.swapped.length).toBeGreaterThan(1)
  })
})

describe('invertTreeSteps — 多组输入与参考解一致', () => {
  it.each(ALL_TREES.map((v) => ({ values: v })))(
    '$values 与真递归参考解一致',
    ({ values }) => {
      const got = pathsFrom(values, final(values).sideOf)
      expect(got).toEqual(refFlipped(values))
    },
  )

  it('满二叉树 15 节点：每一层都完全镜像', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    const after = pathsFrom(values, final(values).sideOf)
    // 这棵树是满的，所以 id = 值 - 1
    expect(after[1]).toBe('R') // 值 2：L → R
    expect(after[2]).toBe('L') // 值 3：R → L
    expect(after[7]).toBe('RRR') // 值 8：LLL → RRR
    expect(after[14]).toBe('LLL') // 值 15：RRR → LLL
  })

  it('翻转是自逆运算：对翻转结果再取反 == 初始', () => {
    const values = DEMO
    const init = initialPaths(values)
    const after = pathsFrom(values, final(values).sideOf)
    const twice = {}
    for (const k of Object.keys(after)) {
      twice[k] = [...after[k]].map((c) => (c === 'L' ? 'R' : 'L')).join('')
    }
    expect(twice).toEqual(init)
  })
})
