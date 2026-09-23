/**
 * lcaSteps.js — 「二叉树的最近公共祖先」(LeetCode 236) 推演的状态机
 * （纯函数，不碰 DOM）。
 *
 * 和系列里其它动画一样单独拆出来：这是动画里唯一有"逻辑"的地方，最容易错，
 * 也最容易测；渲染层（lca.js）只负责把快照画成 SVG。
 *
 * ── 算法本身 ──────────────────────────────────────────────────────────────
 *
 * 后序 DFS，每个节点向上"汇报"自己在子树里找到了什么：
 *
 *     def dfs(node):
 *         if not node or node is p or node is q:
 *             return node                     # ← 命中就返回，不再往下
 *         left  = dfs(node.left)
 *         right = dfs(node.right)
 *         if left and right:
 *             return node                     # ← 左右都非空 = 分叉点 = LCA
 *         return left or right                # ← 只有一个非空，如实上报
 *
 * 这题的全部难点在这句：**"一个节点也可以是它自己的祖先"**。
 * 它是靠 `node is p or node is q` 这一行"命中即返回"自动处理的 —— 递归走到 p
 * 就不再往下探，p 自己作为"找到的标记"向上冒。等 q 从另一侧冒上来，两条汇报
 * 在某个节点汇合，那个节点就是答案。**不需要为"p 是 q 的祖先"单独写分支。**
 *
 * 返回值只有三种含义，必须分清楚（这是本题最容易被问倒的地方）：
 *
 *   null        → 这棵子树里 p、q 一个都没有
 *   p 或 q 本身 → 这棵子树里**只找到了一个**（是"标记"，不是答案）
 *   LCA 自己    → 已经确定答案了，继续向上冒
 *
 * 注意中间那行：返回 p/q 的时候它**只是信使**，不代表 p/q 就是 LCA。
 * 只有当某个节点的左右两边都非空时，它才是真正的答案。
 *
 * ── 编码 ─────────────────────────────────────────────────────────────────
 *
 * 树沿用层序数组编码（同 levelOrderSteps.js 的 buildTree），节点表字段：
 *
 *   node.left / node.right   左右孩子 id（没有为 null）
 *   node.parent              父节点 id（根为 -1）
 *   node.side                'L' | 'R' | null
 *   node.depth               第几层（根为 0）
 *
 * 递归状态用**显式栈**模拟（不能用真递归 —— 状态机要能逐帧暂停）。
 * 栈里每一项是 { id, stage }：
 *
 *   stage 'enter'  → 刚进入这个节点，还没决定返回值
 *   stage 'left'   → 左子树已回来，正在等右子树
 *   stage 'right'  → 右子树也回来了，马上要算自己的返回值
 *
 * 一个 step 长这样：
 *   {
 *     phase: 'init' | 'enter' | 'hit' | 'recurse' | 'collect' | 'decide' |
 *            'return' | 'done',
 *     desc:  string,
 *     stack: {id, stage}[],     // 当前递归栈（栈底是根）
 *     current: number|null,     // 这一帧聚焦的节点
 *     returning: number|null,   // 这一帧正在向上返回的值所在节点
 *     returnSource: string,     // 返回值是谁（'p'|'q'|'lca'|'null'）
 *     memo: {[id]: number|null},// 已经算完的节点 → 它的返回值（null 表示空）
 *     leftOf: {[id]: number|null},  // 左子树的返回值（还没算完的记录 undefined）
 *     rightOf: {[id]: number|null},
 *     depth: number,            // 当前递归深度（= stack.length - 1）
 *     maxDepth: number,         // 这一帧达到过的最大深度（画"最深处"标记用）
 *     found: number[],          // 已经"命中"过的 p / q 节点 id
 *     answer: number|null,      // 已确定的答案
 *     done: boolean,
 *   }
 *
 * ── 两个变体 ──────────────────────────────────────────────────────────────
 *
 * 235（BST 版）：不给状态机开 mode —— 它的形状完全不同（从上往下一次走一条路，
 * 没有回溯），套进这个"后序回溯"的骨架反而是误导。文章里单独用代码讲。
 *
 * 1650（带父指针）：同理，本质是"两条链表求交点"，和链表系列共用思路。
 */

import { buildTree } from './levelOrderSteps.js'

export { buildTree }

/**
 * 找出某个节点 id 在"从根到它的路径"上的位置，以及它的深度。
 * @param {{parent:number}[]} nodes
 * @param {number} id
 */
function depthOf(nodes, id) {
  let d = 0
  let cur = id
  while (cur !== -1 && cur !== null && cur !== undefined) {
    cur = nodes[cur].parent
    d += 1
  }
  return d - 1
}

/**
 * 构造推演步骤。
 *
 * @param {{
 *   values?: (number|null)[],
 *   p?: number|null,
 *   q?: number|null,
 *   maxFrames?: number,
 * }} [options]
 * @returns {object[]}
 */
export function buildLcaSteps(options = {}) {
  // 默认例：LeetCode 236 官方样例树 + p=6, q=4 → 5。
  // 之所以不用 p=5, q=1（官方第一例）：那组里 5 和 1 是根的两个孩子，
  // 递归第 2 帧就命中、总共只有 8 帧，根本看不出"后序回溯"的味道。
  // p=6 和 q=4 都埋在 5 的子树深处，能把"先钻到底、再一层层往上报"演完整。
  const values = Array.isArray(options.values)
    ? options.values
    : [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]

  const { nodes, root } = buildTree(values)

  // 空树：出一帧就收工
  if (root === -1) {
    return [
      {
        phase: 'done',
        desc: '**空树**，直接返回 `null`。',
        stack: [],
        current: null,
        returning: null,
        returnSource: 'null',
        memo: {},
        leftOf: {},
        rightOf: {},
        depth: -1,
        maxDepth: 0,
        found: [],
        answer: null,
        done: true,
      },
    ]
  }

  const valueOf = (id) => (id === null || id === undefined ? null : nodes[id].value)

  /** 按值找节点 id；选项里传的是题目里的"节点"，这里用值指代。 */
  const idByValue = new Map()
  for (const n of nodes) idByValue.set(n.value, n.id)

  // p / q 的默认值：6 和 4 —— 见上面注释（要的是"深"，不是"官方第一例"）
  const pId = options.p === undefined || options.p === null
    ? idByValue.get(6)
    : idByValue.get(options.p)
  const qId = options.q === undefined || options.q === null
    ? idByValue.get(4)
    : idByValue.get(options.q)

  const maxFrames = Number.isInteger(options.maxFrames) ? options.maxFrames : 400

  const steps = []
  const memo = {} // 已算完节点的返回值（null 合法，用 hasOwnProperty 区分"没算"）
  const leftOf = {}
  const rightOf = {}
  const found = []
  let answer = null
  let maxDepthSeen = 0
  let guard = 0

  const label = (id) => {
    if (id === null || id === undefined) return 'null'
    const v = valueOf(id)
    if (id === pId) return `${v}（p）`
    if (id === qId) return `${v}（q）`
    return String(v)
  }
  /** 返回值的中文说法。 */
  const explainReturn = (id) => {
    if (id === null || id === undefined) return '`null`（这棵子树里一个都没找到）'
    if (id === pId) return `\`${valueOf(id)}\` —— **这是 p 本身，向上当成"p 在这里"的标记**（它不是答案，只是信使）`
    if (id === qId) return `\`${valueOf(id)}\` —— **这是 q 本身，向上当成"q 在这里"的标记**`
    return `\`${valueOf(id)}\` —— **这就是答案（LCA），继续向上冒就行了**`
  }

  /** 拍一帧。stack 是 {id, stage} 数组，这里只记录快照。 */
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      stack: stack.map((f) => ({ id: f.id, stage: f.stage })),
      current: null,
      returning: null,
      returnSource: 'null',
      memo: { ...memo },
      leftOf: { ...leftOf },
      rightOf: { ...rightOf },
      depth: stack.length - 1,
      maxDepth: maxDepthSeen,
      found: [...found],
      answer,
      done: phase === 'done',
      ...extra,
    })
  }

  // ── 显式栈 DFS ────────────────────────────────────────────────────────────
  //
  // 每个栈帧形如 { id, stage, from }：
  //   stage 'enter'  → 还没看子树
  //   stage 'left'   → 左子树正在跑
  //   stage 'right'  → 右子树正在跑
  //   stage 'decide' → 两个孩子都回来了，算自己的返回值
  //
  // 子树的返回值靠 `deliver` 写回父帧的 leftOf / rightOf。**注意 deliver 必须在
  // `pop()` 之前调用**，否则栈顶已经不是父节点了，值会记到爷爷身上
  // （初版就踩了这个坑：主例只出了 8 帧，子树完全没被展开）。
  const stack = []

  snap(
    'init',
    `要找 \`${label(pId)}\` 和 \`${label(qId)}\` 的最近公共祖先。` +
      `**用一个显式栈模拟递归**：每次调用 \`dfs(node)\` 就压栈，返回就出栈。` +
      `栈底是根 \`${valueOf(root)}\`，栈越深说明递归钻得越深。`,
    { current: root },
  )

  stack.push({ id: root, stage: 'enter', from: null })

  while (stack.length > 0) {
    guard += 1
    if (guard > maxFrames) break

    const frame = stack[stack.length - 1]
    const node = nodes[frame.id]
    maxDepthSeen = Math.max(maxDepthSeen, stack.length - 1)

    // ── enter：base case 只有两条（空 / 命中） ──────────────────────────────
    if (frame.stage === 'enter') {
      if (frame.id === pId || frame.id === qId) {
        const isP = frame.id === pId
        memo[frame.id] = frame.id
        if (!found.includes(frame.id)) found.push(frame.id)
        // 命中时还无法确定是不是答案 —— 要等另一个目标是否在它的子树里冒上来。
        // 但如果这是**第二个**命中的目标，说明第一个目标已经在这条链的上方，
        // 那第一个目标就是"祖先即答案"的情形。真正下定论统一放在 while 循环结束后的
        // 收尾里（看根的返回值），所以这里只记录，不写 answer。
        snap(
          'hit',
          `进入 \`${label(frame.id)}\` —— **命中！**` +
            `这就是 \`node is p or node is q\` 那一行。` +
            `**命中就立刻返回，不再往下探它的子树**：` +
            `如果另一个目标在它的子树里，那它自己就是答案（"一个节点也可以是它自己的祖先"）；` +
            `如果不在，它也只是个"我在这儿"的标记。两种情况都只需要把**它自己**往上报。`,
          {
            current: frame.id,
            returning: frame.id,
            returnSource: isP ? 'p' : 'q',
          },
        )
        const ret = frame.id
        stack.pop()
        deliverRet(frame, ret)
        continue
      }

      if (node.left === null && node.right === null) {
        // 叶子且不是目标 → 什么都没找到
        memo[frame.id] = null
        snap(
          'return',
          `进入 \`${valueOf(frame.id)}\` —— **叶子节点，而且不是 p 也不是 q**。` +
            `它的子树是空的，一个目标都没有，所以向父节点汇报 \`null\`。`,
          { current: frame.id, returning: null, returnSource: 'null' },
        )
        const ret = null
        stack.pop()
        deliverRet(frame, ret)
        continue
      }

      if (node.left !== null) {
        snap(
          'recurse',
          `进入 \`${valueOf(frame.id)}\` —— 它不是 p 也不是 q，**不能立刻下结论**，` +
            `必须先把左右两棵子树都问一遍（这就是"后序"的含义）。` +
            `先向左子树 \`${valueOf(node.left)}\` 递归。`,
          { current: frame.id },
        )
        frame.stage = 'left'
        stack.push({ id: node.left, stage: 'enter', from: 'L' })
        continue
      }

      // 只有右孩子，跳过左直接问右
      snap(
        'recurse',
        `进入 \`${valueOf(frame.id)}\` —— 它不是 p 也不是 q，**必须先问子树**。` +
          `它没有左孩子，直接转向右子树 \`${valueOf(node.right)}\` 递归。`,
        { current: frame.id },
      )
      leftOf[frame.id] = null
      frame.stage = 'right'
      stack.push({ id: node.right, stage: 'enter', from: 'R' })
      continue
    }

    // ── left 回来了：如果还有右孩子就接着问，否则进入 decide ────────────────
    if (frame.stage === 'left') {
      if (node.right !== null) {
        snap(
          'recurse',
          `\`${valueOf(frame.id)}\` 的左子树回来了，返回值是 ${explainReturn(leftOf[frame.id])}。` +
            `**先把它记在手边，接着向右子树 \`${valueOf(node.right)}\` 递归** —— ` +
            `两边都问完，才能判断自己是不是那个分叉点。`,
          { current: frame.id, returning: leftOf[frame.id] },
        )
        frame.stage = 'right'
        stack.push({ id: node.right, stage: 'enter', from: 'R' })
        continue
      }
      // 没有右孩子 → 右子树的返回值就是 null
      rightOf[frame.id] = null
      frame.stage = 'decide'
      continue
    }

    // ── right 回来了：进入 decide ───────────────────────────────────────────
    if (frame.stage === 'right') {
      frame.stage = 'decide'
      continue
    }

    // ── decide：左右都有了，算自己的返回值 ──────────────────────────────────
    const l = leftOf[frame.id] === undefined ? null : leftOf[frame.id]
    const r = rightOf[frame.id] === undefined ? null : rightOf[frame.id]

    snap(
      'collect',
      `\`${valueOf(frame.id)}\` 的左右子树都回来了：` +
        `左 = ${explainReturn(l)}，右 = ${explainReturn(r)}。**现在到做判断的时候了。**`,
      { current: frame.id },
    )

    let ret
    if (l !== null && r !== null) {
      // 分叉点：左右各有一个目标 → 自己就是 LCA
      ret = frame.id
      memo[frame.id] = frame.id
      if (answer === null) answer = frame.id
      snap(
        'decide',
        `**左右都非空 —— 两个目标刚好在 \`${valueOf(frame.id)}\` 这里分叉！**` +
          `这是全树唯一一个"左边有一个、右边有一个"的节点，` +
          `所以它就是最近公共祖先：返回自己 \`${valueOf(frame.id)}\`。` +
          `（再往上的祖先虽然也同时包含 p 和 q，但都不是"最近"的了。）`,
        { current: frame.id, returning: frame.id, returnSource: 'lca' },
      )
    } else if (l !== null || r !== null) {
      ret = l !== null ? l : r
      memo[frame.id] = ret
      // 如果冒上来的这个值**本身就是已经确定的答案**，那它是在"继续向上传递答案"，
      // 不是在传 p/q 标记了 —— 标成 'lca' 才不会让读者误以为答案还没找到。
      const alreadyAnswer = answer !== null && ret === answer
      snap(
        'decide',
        alreadyAnswer
          ? `只有一个非空（${l !== null ? '左' : '右'}边是 ${explainReturn(ret)}），` +
              `**这就是已经确定的答案，继续往上冒**。\`${valueOf(frame.id)}\` 只是路过，` +
              `它虽然也同时是 p 和 q 的祖先，但不是"最近"的那个。`
          : `只有一个非空（${l !== null ? '左' : '右'}边是 ${explainReturn(ret)}），` +
              `说明两个目标**都在同一侧子树里**，\`${valueOf(frame.id)}\` 不是分叉点。` +
              `如实把这唯一的返回值往上报 —— 这里**不改变它**，只负责传递。`,
        {
          current: frame.id,
          returning: ret,
          returnSource: alreadyAnswer ? 'lca' : ret === pId ? 'p' : 'q',
        },
      )
    } else {
      ret = null
      memo[frame.id] = null
      snap(
        'decide',
        `左右都是 \`null\` —— 这棵子树里 p 和 q 一个都没有，` +
          `向上汇报 \`null\`。父节点收到它，等于"这条分支可以忽略了"。`,
        { current: frame.id, returning: null, returnSource: 'null' },
      )
    }

    stack.pop()
    deliverRet(frame, ret)
  }

  // ── done ─────────────────────────────────────────────────────────────────
  //
  // answer 的最终裁定放在这里，而不是散落在各个分支里。原因：
  //   * 分叉点情形  → decide 阶段就能确定（左右都非空），提前写 answer 是为了让
  //                   中间帧的可视化能显示"答案已浮出"；
  //   * 祖先情形    → 命中那个祖先时**根本走不到 decide**（命中即返回），
  //                   所以只能靠"根最终冒出来的返回值"来定。
  // 两种情形殊途同归：**递归结束时从根冒出来的那个值，就是答案。**
  // （分叉点会一路向上冒到根；祖先自己也一路冒到根。）
  const rootReturn = memo[root]
  if (answer === null && rootReturn !== undefined && rootReturn !== null) {
    answer = rootReturn
  }

  const ansNode = answer === null ? root : answer
  snap(
    'done',
    answer === null
      ? `递归结束，栈空了。**返回值一路冒到根，但没有任何节点出现"左右都非空"** —— ` +
          `说明 p 和 q 不在一棵树上（在本题约束下不会发生）。`
      : `递归结束，栈空了。最终从根 \`${valueOf(root)}\` 冒出来的返回值是 ` +
          `\`${valueOf(ansNode)}\`，它就是 \`${label(pId)}\` 和 \`${label(qId)}\` 的**最近公共祖先**。`,
    { current: ansNode, returning: ansNode, returnSource: 'lca', done: true },
  )

  /**
   * 把刚算完的 `frame` 的返回值写回它父帧的 leftOf / rightOf。
   *
   * **必须在 `stack.pop()` 之前调用** —— 此刻栈顶还是 `frame` 自己，
   * `frame.from` 记录了"我是父节点的左孩子还是右孩子"。
   */
  function deliverRet(frame, ret) {
    if (frame.from === null) return // 根，没有父节点
    const parentFrame = stack[stack.length - 1]
    if (!parentFrame) return
    if (frame.from === 'L') leftOf[parentFrame.id] = ret
    else rightOf[parentFrame.id] = ret
  }

  return steps
}

export { depthOf }
