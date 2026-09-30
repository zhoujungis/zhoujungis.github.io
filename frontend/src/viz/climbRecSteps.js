/**
 * climbRecSteps.js — 「爬楼梯」(LC 70) 的第二个状态机：朴素递归的调用序列。
 *
 * 不带记忆化的 f(k) = f(k-1) + f(k-2)，前序 DFS（和真实程序的执行顺序一致）。
 * 每次调用记一帧，标出「这个值之前已经被算过」—— 重复子问题的现场：
 *   n=6 时总共 25 次调用，去重后只有 7 个不同的 k，f(2) 被算了 5 次；
 *   叶子（f(0)/f(1)）恰好 13 个 = ways(6)。
 *
 * 渲染层自己按同样的顺序重建树形（叶子分配列、内部节点取孩子中点），
 * 状态机只负责顺序、重复标记和计数 —— 保持纯数据、可断言。
 */

const DEFAULT_N = 6

/**
 * 构造帧序列。
 * @param {{ n?: number }} [options]
 */
export function buildClimbRecSteps(options = {}) {
  const n = Number.isInteger(options.n) && options.n >= 2 ? options.n : DEFAULT_N

  const order = [] // { idx, value, depth, path, dup, leaf, ord }
  const seen = new Map()
  let leaves = 0

  const walk = (value, depth, path) => {
    const ord = seen.get(value) || 0 // 这是第几次调用它（0 起）
    seen.set(value, ord + 1)
    const isLeaf = value < 2
    if (isLeaf) leaves += 1
    order.push({
      idx: order.length,
      value,
      depth,
      path,
      dup: ord > 0,
      leaf: isLeaf,
      ord,
      distinct: seen.size, // 到这次调用为止出现过的不同 k 的个数（运行值，不是终值）
    })
    if (value >= 2) {
      walk(value - 1, depth + 1, path + 'L')
      walk(value - 2, depth + 1, path + 'R')
    }
  }
  walk(n, 0, '')

  const steps = []
  let dupSoFar = 0
  for (const node of order) {
    if (node.dup) dupSoFar += 1
    steps.push({
      phase: 'call',
      n,
      node,
      revealed: order.slice(0, node.idx + 1),
      stackPath: node.path,
      calls: node.idx + 1,
      dupCalls: dupSoFar,
      distinct: node.distinct,
      // seen.size 是「到目前为止出现过的不同 k 的个数」——注意它是单调的，
      // 但帧与帧之间不会回退，符合直觉
      answer: null,
      done: false,
      desc: '',
    })
  }

  steps.push({
    phase: 'done',
    n,
    node: null,
    revealed: order.slice(),
    stackPath: '',
    calls: order.length,
    dupCalls: dupSoFar,
    distinct: seen.size,
    leaves,
    answer: null,
    done: true,
    desc: '',
  })

  // desc 在计数齐了之后统一填（done 帧用终值口径）
  for (let k = 0; k < steps.length; k += 1) {
    const s = steps[k]
    if (s.phase === 'done') {
      s.desc =
        `整棵递归树 ${order.length} 个节点、${leaves} 个叶子（叶子数 = ways(${n})）。` +
        `其中只有 ${seen.size} 个不同的 k —— f(2) 被从头算了 ${seen.get(2) || 0} 次，` +
        `f(0) ${seen.get(0) || 0} 次。记忆化之后，同样的信息只需要 ${n + 1} 个格子、` +
        `${n + 1} 次加法。`
      continue
    }
    const { value, depth, dup, idx, ord } = s.node
    s.desc = dup
      ? `第 ${idx + 1} 次调用 f(${value}) —— 这是第 ${ord + 1} 次算它，` +
        `前 ${ord} 次全白算：它下面挂着一整棵相同的子树，每次都要重长一遍。`
      : `第 ${idx + 1} 次调用 f(${value})（深度 ${depth}）。` +
        (value >= 2
          ? `它要先等 f(${value - 1}) 和 f(${value - 2}) 回来。`
          : `叶子：直接返回 1。`)
  }

  return steps
}
