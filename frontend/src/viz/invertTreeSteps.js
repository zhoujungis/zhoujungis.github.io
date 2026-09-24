/**
 * invertTreeSteps.js — 「翻转二叉树」(LeetCode 226) 推演的状态机
 * （纯函数，不碰 DOM）。
 *
 * ── 算法 ──────────────────────────────────────────────────────────────────
 *
 *     def invertTree(node):
 *         if not node: return None
 *         node.left, node.right = node.right, node.left    # 交换自己的两个孩子
 *         invertTree(node.left)
 *         invertTree(node.right)
 *         return node
 *
 * ── 这题真正在考什么 ──────────────────────────────────────────────────────
 *
 * 一句话：**遍历每个节点，把它的两个孩子换一次。**
 *
 * 所以**遍历顺序完全不影响结果** —— 前序（先换自己再递归）、
 * 后序（先递归两个孩子再换自己）都对。只要保证「每个节点恰好换一次」。
 *
 * 唯一的翻车写法是把交换插在两个递归**中间**：
 *
 *     invertTree(node.left)      # 先翻了左子树
 *     node.left, node.right = node.right, node.left   # 再交换 —— 左子树白翻了！
 *     invertTree(node.right)
 *
 * 这时 `node.left` 指向的已经是"翻好过的左子树"，一交换它就跑到右边去，
 * 而右边那个 **从来没被翻过**。所以交换要么放最前面，要么放最后面。
 *
 * ── 树怎么会"动"？—— 用路径逐位取反来表达翻转 ────────────────────────────
 *
 * 翻转二叉树有一个极漂亮的等价说法：
 *
 *     **把每个节点从根到它的路径逐位取反（L↔R），节点就翻好了。**
 *
 * 验证一下演示树 `[4,2,7,1,3,6,9]`：
 *
 *   节点  原路径    翻转后
 *    2    [L]   →  [R]
 *    7    [R]   →  [L]
 *    1    [L,L] →  [R,R]
 *    3    [L,R] →  [R,L]
 *    6    [R,L] →  [L,R]
 *    9    [R,R] →  [L,L]
 *
 * 所以状态机不存"某个节点该画在哪"，只存每个节点**相对父亲的左右角色**
 * （`sideOf`，'L' 或 'R'）。位置由「沿 parent 链拼出路径 → 按满二叉树槽位法
 * 算列号」推出来。交换一次就是**改一个节点的 role**，节点的 x 坐标自然
 * 跟着跳到镜子里的位置 —— 这就是渲染层"看到树在翻"的来源。
 *
 * 注意每一层的交换**只管自己这一层**（只改直接孩子相对于自己的 role），
 * 更深层的取反由更深的那次交换负责。累积起来正好是完整翻转。
 *
 * ── 一个 step 长这样 ─────────────────────────────────────────────────────
 *   {
 *     phase: 'init' | 'swap' | 'leaf' | 'descend' | 'done',
 *     desc:  string,
 *     current: number|null,        // 这一帧聚焦的节点
 *     swapPair: [number|null, number|null] | null,  // 本帧互换的两个孩子
 *     swapped: number[],           // 已经交换过孩子的节点 id
 *     sideOf: {[id]: 'L'|'R'},     // 当前左右角色（根不在此表）
 *     stack: {id}[],               // 递归栈 = 从根到当前的路径
 *     depth: number,               // 递归深度
 *     done: boolean,
 *   }
 *
 * ── 变体 ─────────────────────────────────────────────────────────────────
 *
 * 101（对称二叉树）本质就是"这棵树是不是和它自己翻过来的样子相同"，
 * 用双指针镜像递归。951（等价翻转二叉树）是"两棵树能否通过若干次翻转变相同"。
 * 两个都在文章里用代码讲，不给状态机开 mode（形状不同，硬塞进同一骨架会误导）。
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
export function buildInvertTreeSteps(options = {}) {
  // 默认例：LeetCode 226 官方样例树，翻转前后分别是
  //        4                4
  //       / \              / \
  //      2   7     →      7   2
  //     / \ / \          / \ / \
  //    1  3 6  9        9  6 3  1
  // 选它的理由：左右两边形状完全一致，翻转后**每一层的镜像关系一眼可见**。
  const values = Array.isArray(options.values)
    ? options.values
    : [4, 2, 7, 1, 3, 6, 9]

  const { nodes, root } = buildTree(values)

  // 空树：直接返回 None
  if (root === -1) {
    return [
      {
        phase: 'done',
        desc: '**空树** —— 没什么可翻的，直接返回 `None`。',
        current: null,
        swapPair: null,
        swapped: [],
        sideOf: {},
        stack: [],
        depth: -1,
        done: true,
      },
    ]
  }

  const valueOf = (id) =>
    id === null || id === undefined || nodes[id] === undefined ? null : nodes[id].value

  const maxFrames = Number.isInteger(options.maxFrames) ? options.maxFrames : 400

  // 每个节点相对父亲的左右角色。初始值直接取 buildTree 给的结构。
  // 根没有父亲，不进这张表。
  const sideOf = {}
  for (const n of nodes) {
    if (n.parent !== -1) sideOf[n.id] = n.side
  }

  /** 当前谁是 parentId 的 side 侧孩子（id 可能为 null）。 */
  const childId = (parentId, side) => {
    for (const n of nodes) {
      if (n.parent === parentId && sideOf[n.id] === side) return n.id
    }
    return null
  }

  const steps = []
  const swapped = []
  const stack = []
  let guard = 0

  /** 拍一帧。 */
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      current: null,
      swapPair: null,
      swapped: [...swapped],
      sideOf: { ...sideOf },
      stack: stack.map((f) => ({ id: f.id })),
      depth: stack.length - 1,
      done: phase === 'done',
      ...extra,
    })
  }

  const total = nodes.length

  snap(
    'init',
    `翻转二叉树 —— **把每个节点的两个孩子交换一次**。` +
      `关键要意识到：**交换和递归的先后顺序不影响结果**，` +
      `因为每个节点是各自独立地换自己的两个孩子，谁先谁后都不干涉。` +
      `所以前序（先换再递归）和后序（先递归再换）都对 —— ` +
      `但**交换绝不能插在两个递归中间**，那样会让已经翻好的子树白翻一遍。` +
      `这棵树一共 ${total} 个节点，我们从根 \`${valueOf(root)}\` 开始，一层层往下换。`,
    { current: root },
  )

  stack.push({ id: root, stage: 'enter' })

  while (stack.length > 0) {
    guard += 1
    if (guard > maxFrames) break

    const frame = stack[stack.length - 1]
    const node = nodes[frame.id]

    // ── enter：交换自己的两个孩子，然后往左子树走 ─────────────────────────
    if (frame.stage === 'enter') {
      const l = childId(frame.id, 'L')
      const r = childId(frame.id, 'R')

      // 叶子：两个孩子都不存在，"交换两个 None"是空操作
      if (l === null && r === null) {
        snap(
          'leaf',
          `\`${valueOf(frame.id)}\` 是**叶子节点**，两个孩子都是空的。` +
            `交换两个 \`None\` 是**空操作** —— 所以叶子在这里直接返回。` +
            `这也说明：**真正发生变化的只有非叶节点**。`,
          { current: frame.id },
        )
        stack.pop()
        continue
      }

      // 交换：左孩子变右、右孩子变左
      if (l !== null) sideOf[l] = 'R'
      if (r !== null) sideOf[r] = 'L'
      swapped.push(frame.id)

      snap(
        'swap',
        `\`${valueOf(frame.id)}\` —— **交换它的两个孩子**：` +
          (l !== null && r !== null
            ? `\`${valueOf(l)}\` 和 \`${valueOf(r)}\` 互换位置。`
            : l !== null
              ? `原来只有左孩子 \`${valueOf(l)}\`，换成右孩子（另一边仍是空）。`
              : `原来只有右孩子 \`${valueOf(r)}\`，换成左孩子（另一边仍是空）。`) +
          ` 这是这一帧**唯一**发生的事，别多做也别少做。`,
        { current: frame.id, swapPair: [l, r] },
      )

      frame.stage = 'left'
      // 交换之后，左孩子变成了原来的右孩子 r。
      // ⚠️ 注意这里**不能**在 r 为 null 时直接把 stage 跳到 'right' ——
      // 那样会跳过 left 阶段，而"原来那个左孩子 l"正等着在 left 阶段被递归
      // （交换后它是右孩子）。初版就是这么写的，`[1,2,null,3]` 立刻暴雷：
      // 根交换后左边变成空，直接跳 right 就 pop 了，整条左链一个节点都没访问。
      if (r !== null) {
        stack.push({ id: r, stage: 'enter' })
      }
      continue
    }

    // ── left：左子树翻完了，去右边的子树 ─────────────────────────────────
    if (frame.stage === 'left') {
      // 交换之后，右孩子变成了原来的左孩子 l
      const r = childId(frame.id, 'R')
      if (r !== null) {
        snap(
          'descend',
          `\`${valueOf(frame.id)}\` 的左子树已经翻完，回到它身上，` +
            `接着递归进**右子树** \`${valueOf(r)}\`。` +
            `注意这个"右子树"其实是**交换前那个左孩子** —— ` +
            `因为这一层的交换已经发生过了，角色的名字不能想当然。`,
          { current: frame.id },
        )
        frame.stage = 'right'
        stack.push({ id: r, stage: 'enter' })
      } else {
        frame.stage = 'right'
      }
      continue
    }

    // ── right：两边都翻完，退栈 ───────────────────────────────────────────
    stack.pop()
  }

  // ── done ─────────────────────────────────────────────────────────────────
  snap(
    'done',
    `递归结束，栈空了。**翻转完成** —— 一共交换了 \`${swapped.length}\` 个非叶节点的孩子。` +
      `现在整棵树上，每个节点从根到它的路径都**逐位取反**过了：` +
      `左变成了右、右变成了左，于是每一层都成了原来那一层的**镜像**。` +
      `时间复杂度 O(n)（每个节点恰好访问一次），空间 O(h)（递归栈深 = 树高）。`,
    { current: root, done: true },
  )

  return steps
}
