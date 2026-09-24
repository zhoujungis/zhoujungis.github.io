/**
 * maxDepthSteps.js — 「二叉树的最大深度」(LeetCode 104) 推演的状态机
 * （纯函数，不碰 DOM）。
 *
 * ── 算法 ──────────────────────────────────────────────────────────────────
 *
 *     def maxDepth(node):
 *         if not node: return 0
 *         return 1 + max(maxDepth(node.left), maxDepth(node.right))
 *
 * 这题是「后序递归」最干净的形态：**必须先问完两棵子树，才能定自己**。
 * 那个 `1` 就是"把自己这一层算上"。
 *
 * ── 为什么必须是后序 ──────────────────────────────────────────────────────
 *
 * 因为"子树的高度"是**从下面冒上来的信息**。父节点手里没有它，只能先向下要。
 * 硬用先序也能写，但得额外传一个 depth 参数进去（自顶向下累加），
 * 绕了一圈，而且拿不到"子树高度"这个中间量 —— 后面 LC 110 平衡二叉树
 * 那种"顺便判断左右差"的需求就没法做了。
 *
 * ── 和 LC 124 / 236 的关系 ────────────────────────────────────────────────
 *
 * 三题共用同一个「显式栈 + stage 状态机」骨架，但返回值语义依次变复杂：
 *
 *   104：返回值 = 子树高度     一个纯数，没有附加含义
 *   236：返回值 = 三种身份     null / 只是信使 / 答案本身
 *   124：返回值 = 两个不同的量 向上汇报的 gain ≠ 更新答案的 through
 *
 * 104 还有一点很特别：**它不需要任何全局变量**。答案就是根的高度，
 * 只能等根算完才知道 —— 中途任何一帧都无法预判最终答案。
 * 对比 124 的 `best` 是"一路取 max"、中途不停被刷新，是完全相反的节奏。
 *
 * ── 编码 ─────────────────────────────────────────────────────────────────
 *
 * 树沿用层序数组编码（同 levelOrderSteps.js 的 buildTree），节点表字段：
 *   node.left / node.right   左右孩子 id（没有为 null）
 *   node.parent              父节点 id（根为 -1）
 *   node.side                'L' | 'R' | null
 *   node.depth               第几层（根为 0）
 *
 * 递归用**显式栈**模拟（要能逐帧暂停，不能用真递归）。栈帧 { id, stage }：
 *   stage 'enter'  → 刚进来，决定先去哪边
 *   stage 'left'   → 左子树正在跑
 *   stage 'right'  → 右子树正在跑
 *   stage 'decide' → 两个孩子都回来了，算自己的高度
 *
 * 一个 step 长这样：
 *   {
 *     phase: 'init' | 'recurse' | 'leaf' | 'compute' | 'done',
 *     desc:  string,
 *     stack: {id, stage}[],     // 当前递归栈（栈底是根）
 *     current: number|null,     // 这一帧聚焦的节点
 *     leftH: number|null,       // 左子树高度（叶子记 0）
 *     rightH: number|null,
 *     height: number|null,      // 本节点的高度 = 1 + max(左, 右)
 *     heightOf: {[id]: number}, // 已算完节点的高度
 *     answer: number|null,      // 最终答案（只有根算完才有值，此前是 null）
 *     depth: number,            // 当前递归深度（= stack.length - 1）
 *     maxDepthSeen: number,     // 这一帧达到过的最大递归深度
 *     done: boolean,
 *   }
 *
 * ── 变体 ─────────────────────────────────────────────────────────────────
 *
 * 111（最小深度）是本题的**陷阱版**：`1 + min(左, 右)` 是错的，
 * 因为"空子树"不是叶子。详见文章第五节。
 * 110（平衡二叉树）复用同一骨架，把"高度"当返回值、顺便判左右差。
 * 543（直径）在 LC 124 那篇已经讲过。
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
export function buildMaxDepthSteps(options = {}) {
  // 默认例：LeetCode 104 官方样例树，答案 3。
  // 这棵树的形状很适合演示：根 3 的左孩子 9 是叶子（高度 1），
  // 右孩子 20 有两个孩子（高度 2），所以根的 1 + max(1, 2) = 3 ——
  // 正好让读者看到"左右不一样时取大的那个"。
  const values = Array.isArray(options.values)
    ? options.values
    : [3, 9, 20, null, null, 15, 7]

  const { nodes, root } = buildTree(values)

  // 空树：题目里 root 非空，但状态机要能安全处理
  if (root === -1) {
    return [
      {
        phase: 'done',
        desc: '**空树** —— 深度记 `0`。这是递归的出口条件，也是整道题的基线。',
        stack: [],
        current: null,
        leftH: null,
        rightH: null,
        height: null,
        heightOf: {},
        answer: 0,
        depth: -1,
        maxDepthSeen: 0,
        done: true,
      },
    ]
  }

  const valueOf = (id) =>
    id === null || id === undefined || nodes[id] === undefined ? null : nodes[id].value

  const maxFrames = Number.isInteger(options.maxFrames) ? options.maxFrames : 400

  const steps = []
  const heightOf = {}          // 已算完节点的高度
  let answer = null            // 只有根算完才有值
  let maxDepthSeen = 0
  let guard = 0

  const stack = []

  /** 拍一帧。 */
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      stack: stack.map((f) => ({ id: f.id, stage: f.stage })),
      current: null,
      leftH: null,
      rightH: null,
      height: null,
      heightOf: { ...heightOf },
      answer,
      depth: stack.length - 1,
      maxDepthSeen,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `要求**最大深度**，也就是"从根往下最多能走几层"。` +
      `做法是**后序递归**：每个节点先问出左右子树各自的高度，` +
      `再取较大的那个、**加 1**（加的这个 1 就是自己这一层）。` +
      `注意那个 \`1\` 不能少 —— 它代表的正是"把自己算进去"。` +
      `栈底是根 \`${valueOf(root)}\`。`,
    { current: root },
  )

  stack.push({ id: root, stage: 'enter' })

  while (stack.length > 0) {
    guard += 1
    if (guard > maxFrames) break

    const frame = stack[stack.length - 1]
    const node = nodes[frame.id]
    maxDepthSeen = Math.max(maxDepthSeen, stack.length - 1)

    // ── enter：决定先去哪边 ───────────────────────────────────────────────
    if (frame.stage === 'enter') {
      if (node.left === null && node.right === null) {
        // 叶子：两边都是空（高度 0），所以自己的高度 = 1 + max(0, 0) = 1
        heightOf[frame.id] = 1
        if (frame.id === root) answer = 1
        snap(
          'leaf',
          `进入 \`${valueOf(frame.id)}\` —— **叶子节点**，左右子树都不存在。` +
            `按定义空子树高度是 \`0\`，所以它自己的高度 = \`1 + max(0, 0) = 1\`。` +
            `**叶子是整条递归链的起点** —— 高度就是从这里开始一层层往上冒的。`,
          { current: frame.id, leftH: 0, rightH: 0, height: 1 },
        )
        stack.pop()
        continue
      }

      const goLeft = node.left !== null
      snap(
        'recurse',
        `进入 \`${valueOf(frame.id)}\` —— 它 **还不能下结论**：` +
          `自己的高度取决于子树的高度，所以必须**先下去问**。` +
          (goLeft
            ? `先向左子树 \`${valueOf(node.left)}\` 递归。`
            : `它没有左孩子（左边高度直接记 \`0\`），直接向右子树 \`${valueOf(node.right)}\` 递归。`),
        { current: frame.id },
      )
      frame.stage = goLeft ? 'left' : 'right'
      stack.push({ id: goLeft ? node.left : node.right, stage: 'enter' })
      continue
    }

    // ── left 回来了：接右子树，或直接进 decide ─────────────────────────────
    if (frame.stage === 'left') {
      if (node.right !== null) {
        const lh = heightOf[node.left]
        snap(
          'recurse',
          `左子树 \`${valueOf(node.left)}\` 回来了，报告高度 **\`${lh}\`**。` +
            `先把它记在手边，接着向右子树 \`${valueOf(node.right)}\` 递归 —— ` +
            `**还没到算自己高度的时候**，因为 \`max\` 要两个数都拿到才敢取。`,
          { current: frame.id, leftH: lh },
        )
        frame.stage = 'right'
        stack.push({ id: node.right, stage: 'enter' })
        continue
      }
      // 没有右孩子 → 右边高度是 0，直接进 decide
      frame.stage = 'decide'
      continue
    }

    // ── right 回来了：进 decide ───────────────────────────────────────────
    if (frame.stage === 'right') {
      frame.stage = 'decide'
      continue
    }

    // ── decide：算自己的高度 ──────────────────────────────────────────────
    const lh = node.left === null ? 0 : heightOf[node.left]
    const rh = node.right === null ? 0 : heightOf[node.right]
    const h = 1 + Math.max(lh, rh)
    heightOf[frame.id] = h
    const isRoot = frame.id === root
    if (isRoot) answer = h

    const loser =
      lh === rh
        ? '两边一样高，取哪个都行'
        : lh > rh
          ? `右边 \`${rh}\` 更矮，被淘汰（\`max\` 只要大的那个）`
          : `左边 \`${lh}\` 更矮，被淘汰（\`max\` 只要大的那个）`

    snap(
      'compute',
      `\`${valueOf(frame.id)}\` 的左右子树都回来了：左 **\`${lh}\`**、右 **\`${rh}\`**。` +
        `算自己的高度：\`1 + max(${lh}, ${rh}) = ${h}\` —— ` +
        `**那个 \`1\` 是把自己这一层算上**，这是本题唯一容易漏的地方。` +
        `（${loser}。）` +
        (isRoot
          ? ` **根算完了，答案就是它：\`${h}\`。** 注意在这之前，` +
            `中间任何一帧都没有人能提前说出最终答案 —— 高度是从最深的叶子` +
            `一层层冒上来的，必须等根拿到左右两个数才定得下来。`
          : ` 把这个高度汇报给父节点。`),
      { current: frame.id, leftH: lh, rightH: rh, height: h },
    )

    stack.pop()
  }

  // ── done ─────────────────────────────────────────────────────────────────
  snap(
    'done',
    `递归结束，栈空了。**最大深度 = \`${answer}\`**。` +
      `回头看整条链路：叶子报 \`1\` → 父节点 \`1 + max(…) \` → 一层层加 1 → ` +
      `根报出最终答案。**每个节点只被访问一次**，所以是 O(n)。` +
      `另外注意 104 全程**没有任何全局变量** —— 答案不是"一路取 max 攒出来的"，` +
      `而是根那一次计算的返回值本身。` +
      `（对比 LC 124 的 \`best\`：那个才是需要一路刷新的全局最优。）`,
    { current: root, height: answer, done: true },
  )

  return steps
}
