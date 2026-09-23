/**
 * maxPathSumSteps.js — 「二叉树中的最大路径和」(LeetCode 124) 推演的状态机
 * （纯函数，不碰 DOM）。
 *
 * 和系列里其它动画一样单独拆出来：这是动画里唯一有"逻辑"的地方，最容易错，
 * 也最容易测；渲染层（maxPathSum.js）只负责把快照画成 SVG。
 *
 * ── 算法本身 ──────────────────────────────────────────────────────────────
 *
 * 后序 DFS，每个节点同时算**两个不同的东西**：
 *
 *     def gain(node):
 *         if not node: return 0
 *         left  = max(gain(node.left),  0)     # ← 负贡献直接剪掉
 *         right = max(gain(node.right), 0)
 *         # ① 以 node 为"拱顶"的完整路径（可以拐弯，用两条胳膊）
 *         best = max(best, node.val + left + right)
 *         # ② 向上汇报的"单边最大贡献"（只能选一条胳膊）
 *         return node.val + max(left, right)
 *
 * ── 本题唯一真正的难点 ────────────────────────────────────────────────────
 *
 * **返回值（贡献值）和答案（完整路径和）是两个不同的量，必须分开算。**
 *
 *   | | 形状 | 用途 |
 *   |---|---|---|
 *   | 返回值 `node.val + max(left, right)` | 一条**直链**（一条胳膊） | 交给父节点继续往上接 |
 *   | 答案 `node.val + left + right` | 一个**拱形**（两条胳膊） | 以本节点为最高点，到此为止 |
 *
 * 为什么返回值只能选一条胳膊？因为**路径不能拐两次弯**。父节点拿到返回值后，
 * 会在它自己那里再拐一次；如果这里就把两条胳膊都用掉了，那父节点再拐就变成
 * "拐两次"的树杈，根本不是一条路径了。
 *
 * 而答案之所以能两条胳膊都用，是因为**它就在本节点处结束**，不再往上接。
 *
 * 一句话记法：**返回一条边，答案一个尖。**
 *
 * ── 负贡献剪枝 ────────────────────────────────────────────────────────────
 *
 * `max(gain(child), 0)` 里的那个 0 不是"防御性编程"，**它就是本题的优化本身**：
 * 如果某条胳膊的总和是负的，那把它接进来只会让路径变更小 —— 不如不接。
 * 返回 0 的含义是"别走我这边"，等价于"从当前节点直接停下"。
 *
 * ── 至少一个节点 ──────────────────────────────────────────────────────────
 *
 * 题目保证「路径至少包含一个节点」，所以 `best` 必须初始化成 `-Infinity`
 * **不能是 0**。否则 `[-3]` 这种全负树会错答 0（空路径），正确答案是 `-3`。
 *
 * ── 编码 ─────────────────────────────────────────────────────────────────
 *
 * 树沿用层序数组编码（同 levelOrderSteps.js 的 buildTree），节点表字段：
 *   node.left / node.right   左右孩子 id（没有为 null）
 *   node.parent              父节点 id（根为 -1）
 *   node.side                'L' | 'R' | null
 *   node.depth               第几层（根为 0）
 *
 * 递归状态用**显式栈**模拟（不能用真递归 —— 状态机要能逐帧暂停）。
 * 栈帧形如 { id, stage, from }：
 *   stage 'enter'  → 还没看子树
 *   stage 'left'   → 左子树正在跑
 *   stage 'right'  → 右子树正在跑
 *   stage 'decide' → 两个孩子都回来了，算自己的"贡献值"和"过自己的路径"
 *
 * 一个 step 长这样：
 *   {
 *     phase: 'init' | 'recurse' | 'leaf' | 'collect' | 'update' | 'keep' | 'done',
 *     desc:  string,
 *     stack: {id, stage}[],       // 当前递归栈（栈底是根）
 *     current: number|null,       // 这一帧聚焦的节点
 *     leftGain: number|null,      // 当前节点左子树的贡献值（已 clamp）
 *     rightGain: number|null,     // 右子树的贡献值（已 clamp）
 *     rawLeft: number|null,       // 未 clamp 的原始返回值（用于讲"负贡献被剪掉"）
 *     rawRight: number|null,
 *     through: number|null,       // 以当前节点为拱顶的完整路径和
 *     gain: number|null,          // 当前节点向上汇报的单边贡献
 *     gainOf: {[id]: number},     // 已算完节点的 gain
 *     best: number,               // 全局最优（可能为负）
 *     bestNode: number|null,      // 产生 best 的那个拱顶节点
 *     bestPath: number[],         // best 对应的完整路径（节点 id，按路径顺序）
 *     depth: number,              // 当前递归深度（= stack.length - 1）
 *     maxDepth: number,           // 这一帧达到过的最大深度
 *     pruned: number[],           // 被剪掉的（负贡献）孩子 id
 *     done: boolean,
 *   }
 *
 * ── 变体 ─────────────────────────────────────────────────────────────────
 *
 * 543（直径）是这个骨架的"边数版"：`through = leftDepth + rightDepth`、
 * 返回 `1 + max(leftDepth, rightDepth)`（**不需要 clamp**，深度永不为负）。
 * 687（最长同值路径）多加一层"值必须相等"的约束。文章里用代码讲，不给状态机开 mode。
 */

import { buildTree } from './levelOrderSteps.js'

export { buildTree }

/**
 * 构造推演步骤。
 *
 * @param {{
 *   values?: (number|null)[],
 *   maxFrames?: number,
 * }} [options]
 * @returns {object[]}
 */
export function buildMaxPathSumSteps(options = {}) {
  // 默认例：LeetCode 124 官方样例树，答案 42（路径 15 → 20 → 7）。
  // 这棵树特别适合演示：根是 -10（负数），最优路径根本不经过它 ——
  // 正好说明"路径不一定经过根节点"。
  const values = Array.isArray(options.values)
    ? options.values
    : [-10, 9, 20, null, null, 15, 7]

  const { nodes, root } = buildTree(values)

  // 空树：题目保证"至少一个节点"，但状态机要能安全处理
  if (root === -1) {
    return [
      {
        phase: 'done',
        desc: '**空树** —— 题目保证路径至少包含一个节点，空树不在输入范围内。',
        stack: [],
        current: null,
        leftGain: null,
        rightGain: null,
        rawLeft: null,
        rawRight: null,
        through: null,
        gain: null,
        gainOf: {},
        best: -Infinity,
        bestNode: null,
        bestPath: [],
        depth: -1,
        maxDepth: 0,
        pruned: [],
        done: true,
      },
    ]
  }

  const valueOf = (id) =>
    id === null || id === undefined || nodes[id] === undefined ? null : nodes[id].value

  const maxFrames = Number.isInteger(options.maxFrames) ? options.maxFrames : 400

  const steps = []
  const gainOf = {}            // 已算完节点的 gain
  const rawOf = {}             // 未 clamp 的原始返回值（讲剪枝用）
  const pruned = []            // 被剪掉的孩子 id
  let best = -Infinity
  let bestNode = null
  let bestPath = []
  let maxDepthSeen = 0
  let guard = 0

  /**
   * 重建「以 `apex` 为拱顶」的那条完整路径（节点 id 列表，按路径实际顺序）。
   *
   * 注意**不能只沿 parent 往上走** —— 拱顶路径是"左胳膊 → 拱顶 → 右胳膊"，
   * 两条胳膊都是**往下**的。初版写成 `pathFromNode` 只沿 parent 上行，
   * 于是 42 那条路被错写成 `20 → -10`（走去了根的方向），正确答案是 `15 → 20 → 7`。
   *
   * 正确做法：从拱顶出发，分别往左右各找"贡献最大的那一条下行链"，
   * 拼成 `左链(自底向上) + 拱顶 + 右链(自顶向下)`。
   */
  const buildArchPath = (apex) => {
    const downChain = (start) => {
      // 从 start 出发，一路选"贡献更大的那个孩子"，直到没有可走的孩子。
      // 只在孩子贡献 > 0 时才走（负贡献已被 clamp 掉，等于不走）。
      const chain = []
      let cur = start
      while (cur !== null && cur !== undefined && nodes[cur] !== undefined) {
        chain.push(cur)
        const nd = nodes[cur]
        const lGain = nd.left === null ? null : (rawOf[nd.left] ?? null)
        const rGain = nd.right === null ? null : (rawOf[nd.right] ?? null)
        const lOk = lGain !== null && lGain > 0
        const rOk = rGain !== null && rGain > 0
        if (!lOk && !rOk) break
        if (lOk && rOk) cur = lGain >= rGain ? nd.left : nd.right
        else cur = lOk ? nd.left : nd.right
      }
      return chain
    }
    const apexNode = nodes[apex]
    if (!apexNode) return []
    const leftChain =
      apexNode.left === null || !((rawOf[apexNode.left] ?? 0) > 0)
        ? []
        : downChain(apexNode.left)
    const rightChain =
      apexNode.right === null || !((rawOf[apexNode.right] ?? 0) > 0)
        ? []
        : downChain(apexNode.right)
    // 左链是"自拱顶往下"的顺序，路径要从最深的叶子开始，所以反转
    return [...leftChain.reverse(), apex, ...rightChain]
  }

  /** 拍一帧。 */
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      stack: stack.map((f) => ({ id: f.id, stage: f.stage })),
      current: null,
      leftGain: null,
      rightGain: null,
      rawLeft: null,
      rawRight: null,
      through: null,
      gain: null,
      gainOf: { ...gainOf },
      best,
      bestNode,
      bestPath: [...bestPath],
      depth: stack.length - 1,
      maxDepth: maxDepthSeen,
      pruned: [...pruned],
      done: phase === 'done',
      ...extra,
    })
  }

  // ── 显式栈 DFS ────────────────────────────────────────────────────────────
  const stack = []

  snap(
    'init',
    `要找**最大路径和**。关键是要同时算两个不同的东西：` +
      `① **向上汇报的单边贡献值** \`gain = val + max(左, 右)\`（一条胳膊，给父节点继续接）；` +
      `② **以本节点为拱顶的完整路径** \`through = val + 左 + 右\`（两条胳膊，到此为止）来更新全局最优。` +
      `**路径不能拐两次弯**，所以向上汇报时只能选一条胳膊 —— 这是本题全部难度的来源。` +
      `另外 \`max(gain, 0)\` 会剪掉负贡献：负的胳膊接进来只会让和变小。` +
      `栈底是根 \`${valueOf(root)}\`。`,
    { current: root },
  )

  stack.push({ id: root, stage: 'enter', from: null })

  while (stack.length > 0) {
    guard += 1
    if (guard > maxFrames) break

    const frame = stack[stack.length - 1]
    const node = nodes[frame.id]
    maxDepthSeen = Math.max(maxDepthSeen, stack.length - 1)

    // ── enter：决定先问哪边 ─────────────────────────────────────────────────
    if (frame.stage === 'enter') {
      if (node.left === null && node.right === null) {
        // 叶子：两边贡献都是 0，through = gain = val
        gainOf[frame.id] = node.value
        rawOf[frame.id] = node.value
        const through = node.value
        let updated = false
        if (through > best) {
          best = through
          bestNode = frame.id
          bestPath = buildArchPath(frame.id)
          updated = true
        }
        snap(
          updated ? 'update' : 'leaf',
          `进入 \`${valueOf(frame.id)}\` —— **叶子节点**，左右子树都不存在，两边贡献都是 \`0\`。` +
            `所以以它为拱顶的路径和就是它自己：\`${through}\`；向上汇报的贡献值也是 \`${through}\`。` +
            (updated
              ? `**刷新了全局最优** → \`best = ${best}\`。`
              : `没超过当前的 \`best = ${best}\`，保持不动。`),
          {
            current: frame.id,
            leftGain: 0,
            rightGain: 0,
            rawLeft: null,
            rawRight: null,
            through,
            gain: through,
          },
        )
        const ret = through
        stack.pop()
        continue
      }

      if (node.left !== null) {
        snap(
          'recurse',
          `进入 \`${valueOf(frame.id)}\` —— 它 **不能立刻下结论**：` +
            `拱顶路径和要用到左右两边的贡献，所以必须**先把两棵子树都问一遍**（后序）。` +
            `先向左子树 \`${valueOf(node.left)}\` 递归。`,
          { current: frame.id },
        )
        frame.stage = 'left'
        stack.push({ id: node.left, stage: 'enter', from: 'L' })
        continue
      }

      // 只有右孩子
      snap(
        'recurse',
        `进入 \`${valueOf(frame.id)}\` —— 它没有左孩子（左边贡献直接记 \`0\`），` +
          `直接向右子树 \`${valueOf(node.right)}\` 递归。`,
        { current: frame.id },
      )
      frame.stage = 'right'
      stack.push({ id: node.right, stage: 'enter', from: 'R' })
      continue
    }

    // ── left 回来了：接右子树或直接进 decide ────────────────────────────────
    if (frame.stage === 'left') {
      if (node.right !== null) {
        const rawL = rawOf[node.left]
        const clampedL = Math.max(rawL, 0)
        snap(
          'recurse',
          `\`${valueOf(frame.id)}\` 的左子树回来了，原始返回值是 \`${rawL}\`。` +
            (rawL < 0
              ? `**它是负的 —— 剪掉！** \`max(${rawL}, 0) = 0\`，` +
                `意思就是"这条路走进去只会更小，干脆不进去"。`
              : `它是非负的，保留：\`max(${rawL}, 0) = ${clampedL}\`。`) +
            ` 把左贡献 \`${clampedL}\` 记在手边，接着向右子树 \`${valueOf(node.right)}\` 递归。`,
          {
            current: frame.id,
            leftGain: clampedL,
            rawLeft: rawL,
          },
        )
        frame.stage = 'right'
        stack.push({ id: node.right, stage: 'enter', from: 'R' })
        continue
      }
      // 没有右孩子 → 右贡献是 0，直接进 decide
      frame.stage = 'decide'
      continue
    }

    // ── right 回来了：进 decide ─────────────────────────────────────────────
    if (frame.stage === 'right') {
      frame.stage = 'decide'
      continue
    }

    // ── decide：算贡献值和拱顶路径 ──────────────────────────────────────────
    const rawL = node.left === null ? null : rawOf[node.left]
    const rawR = node.right === null ? null : rawOf[node.right]
    const l = Math.max(rawL === null ? 0 : rawL, 0)
    const r = Math.max(rawR === null ? 0 : rawR, 0)

    snap(
      'collect',
      `\`${valueOf(frame.id)}\` 的左右子树都回来了：` +
        `左 = \`${rawL === null ? '（无）' : rawL}\` → 取 \`max(·, 0) = ${l}\`，` +
        `右 = \`${rawR === null ? '（无）' : rawR}\` → 取 \`max(·, 0) = ${r}\`。` +
        `**现在要同时算两个量，别搞混。**`,
      { current: frame.id, leftGain: l, rightGain: r, rawLeft: rawL, rawRight: rawR },
    )

    // ① 拱顶路径：两条胳膊都用上
    const through = node.value + l + r
    // ② 向上贡献：只能选一条胳膊
    const gain = node.value + Math.max(l, r)
    gainOf[frame.id] = gain
    rawOf[frame.id] = gain

    // 记录"被剪掉的胳膊"——左、右都要记，不能只记左边。
    // 这一步放在 decide 里（唯一的判定点），因为在那之前两个孩子才都拿到返回值。
    if (rawL !== null && rawL < 0 && node.left !== null && !pruned.includes(node.left)) {
      pruned.push(node.left)
    }
    if (rawR !== null && rawR < 0 && node.right !== null && !pruned.includes(node.right)) {
      pruned.push(node.right)
    }

    const updated = through > best
    if (updated) {
      best = through
      bestNode = frame.id
      bestPath = buildArchPath(frame.id)
    }

    const armWord =
      rawL !== null && rawL < 0 && rawR !== null && rawR < 0
        ? '两条胳膊都是负的、全被剪了'
        : rawL !== null && rawL < 0
          ? '左胳膊是负的被剪了'
          : rawR !== null && rawR < 0
            ? '右胳膊是负的被剪了'
            : '两条胳膊都留着'

    snap(
      updated ? 'update' : 'decide',
      `**算拱顶路径（可以拐弯，两条胳膊都用）**：` +
        `\`${valueOf(frame.id)} + ${l} + ${r} = ${through}\`` +
        `（${armWord}）。` +
        (updated
          ? ` **刷新了全局最优！** \`best\` 从 \`${best === through ? '（旧值更小）' : ''}\`` +
            `更新为 \`${through}\` —— 这条路径以 \`${valueOf(frame.id)}\` 为最高点，不再往上接。`
          : ` 没超过当前的 \`best = ${best}\`，保持不动。`) +
        ` 同时**算向上汇报的贡献值（只能选一条胳膊）**：` +
        `\`${valueOf(frame.id)} + max(${l}, ${r}) = ${gain}\` —— 这个值交给父节点，` +
        `父节点会在它那里再拐一次弯；如果这里两条胳膊都用掉，父节点再拐就**拐两次弯**了，不是一条路径。`,
      {
        current: frame.id,
        leftGain: l,
        rightGain: r,
        rawLeft: rawL,
        rawRight: rawR,
        through,
        gain,
      },
    )

    stack.pop()
  }

  // ── done ─────────────────────────────────────────────────────────────────
  snap(
    'done',
    `递归结束，栈空了。全局最优 **\`best = ${best}\`**，` +
      `对应的路径以 \`${valueOf(bestNode)}\` 为最高点：` +
      `\`${bestPath.map((id) => valueOf(id)).join(' → ')}\`。` +
      `注意**它完全不经过根 \`${valueOf(root)}\`** —— 题目说"路径不一定经过根节点"，` +
      `而这棵树的根是 \`${valueOf(root)}\`（负数），把根接进来只会让和变小，` +
      `所以递归时根的 \`through\` 反而不是最大的。` +
      (best < 0
        ? ` 另外 \`best\` 是负数 —— 说明全树都是负值，此时答案就是**最大的那个单节点**（路径至少含一个节点，不能返回空路径 0）。`
        : ''),
    { current: bestNode, returnSource: 'best', through: best, gain: gainOf[bestNode], done: true },
  )

  return steps
}
