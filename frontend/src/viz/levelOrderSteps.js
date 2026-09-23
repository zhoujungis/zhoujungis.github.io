/**
 * levelOrderSteps.js — 「二叉树的层序遍历」(LeetCode 102) 推演的状态机
 * （纯函数，不碰 DOM）。
 *
 * 和系列里其它动画一样单独拆出来：这是动画里唯一有"逻辑"的地方，最容易错，
 * 也最容易测；渲染层（levelOrder.js）只负责把快照画成 SVG。
 *
 * ── 算法本身 ──────────────────────────────────────────────────────────────
 *
 * BFS + 队列。层序遍历的全部难点就一句话：
 *
 *     while queue:
 *         size = len(queue)        # ← 这一行是整道题的关键
 *         level = []
 *         for _ in range(size):
 *             node = queue.popleft()
 *             level.append(node.val)
 *             if node.left:  queue.append(node.left)
 *             if node.right: queue.append(node.right)
 *         res.append(level)
 *
 * `BFS + 队列` 本身是模板；真正决定这题对错的，是**进 while 的那一刻先把
 * 队列长度存下来**。因为内层 for 循环会一边出队、一边把左右孩子入队 ——
 * 如果直接写 `while queue` 拿实时长度，第二次判断时队列里已经混进了下一层
 * 的节点，层就被搅在一起了。
 *
 * 所以本题的核心快照是"层边界"：**每层开始时记下的那个 size，就是这一层的
 * 节点个数**。这个 size 同时给了我们三件事：
 *
 *   1. 分层（哪些节点属于同一层）
 *   2. 循环次数（这一层要出队几次）
 *   3. 变体的抓手（103 靠它决定反转；199 靠它取最后一个）
 *
 * ── 编码 ─────────────────────────────────────────────────────────────────
 *
 * 树用「带 null 的层序数组」编码（LeetCode 的输入格式），下标即节点 id：
 *
 *   node.left       左孩子 id（没有为 null）
 *   node.right      右孩子 id（没有为 null）
 *   node.parent     父节点 id（根为 -1）
 *   node.side       'L' | 'R' | null
 *   node.depth      第几层（根为 0）
 *   node.col        在这一层里排第几列（渲染层据此摆位置）
 *
 * 每帧记录**队列的实时内容**（数组，头部是队首），这是这个动画的看点：
 * 出队、入队都发生在队列的两端，而层边界恰好落在中间。
 *
 * 一个 step 长这样：
 *   {
 *     phase: 'init' | 'enter' | 'consume' | 'enqueue' | 'close' | 'done',
 *     desc:  string,
 *     queue: number[],        // 当前队列里的节点下标，队首在前
 *     levelIndex: number,     // 正在处理第几层（0 起）
 *     levelSize: number,      // 这一层的节点个数（进层时快照下来的 size）
 *     consumed: number,       // 这一层已出队几个
 *     current: number|null,   // 刚出队的节点下标
 *     enqueued: number[],     // 这一帧刚入队的
 *     levelValues: number[],  // 当前这一层已收集到的值（锯齿变体会反转）
 *     results: number[][],    // 已经封层的所有层（含当前层完成后的）
 *     rightView: number[],    // 变体：每层最后一个（右视图）
 *     mode: 'plain' | 'zigzag',
 *     zigzagReversed: boolean, // 当前这一层是否被反转（锯齿变体）
 *     done: boolean,
 *   }
 *
 * ── 两个变体 ──────────────────────────────────────────────────────────────
 *
 * 103 锯齿形：`mode: 'zigzag'`，逐层反转。状态机里体现在 levelValues 上 ——
 * 偶数层顺序收集、奇数层用 unshift 头插（等价于反转），results 里存的就是
 * 反转后的顺序。注意**队列本身的左右入队顺序永远不变**，变的只是"值往哪放"。
 *
 * 199 右视图：每层最后一个节点。不需要单独的状态机 —— `rightView` 字段在
 * 每一层封层时从 levelValues 里取末位，跟主流程同步产出。
 */

/**
 * 把「带 null 的层序数组」展开成节点表。
 *
 * 这是题面给的标准输入格式：`[3, 9, 20, null, null, 15, 7]`。null 表示
 * "这个位置没有节点"，但**它不是节点**，所以不占 id —— id 只发给真实节点。
 *
 * 用队列走一遍 BFS 建表：每个真实节点依次从数组里取两个孩子位置。
 * 返回的 id 顺序即"层序优先"顺序，跟遍历顺序一致，方便调试时对着看。
 *
 * @param {(number|null)[]} values
 * @returns {{ nodes: {id:number, value:number, parent:number, side:('L'|'R'|null), depth:number, col:number}[], root: number }}
 */
export function buildTree(values) {
  const arr = Array.isArray(values) ? values : []
  /** 结果节点表；id 是"第几个真实节点"，不是数组下标。 */
  const nodes = []
  // 空数组 / 首元素是 null → 空树
  if (arr.length === 0 || arr[0] === null || arr[0] === undefined) {
    return { nodes, root: -1 }
  }

  // 先给每个真实节点分配 id，并记下它在原数组里的位置
  const slotToId = new Map() // 数组下标 → 节点 id
  const idToSlot = [] // 节点 id → 数组下标
  for (let s = 0; s < arr.length; s += 1) {
    if (arr[s] === null || arr[s] === undefined) continue
    slotToId.set(s, nodes.length)
    idToSlot.push(s)
    nodes.push({
      id: nodes.length,
      value: arr[s],
      left: null,
      right: null,
      parent: -1,
      side: null,
      depth: 0,
      col: 0, // 占位，下面统一按层重算
    })
  }
  if (nodes.length === 0) return { nodes, root: -1 }

  // 按 BFS 顺序补父子关系：处理第 k 个真实节点时，它的两个孩子在数组里
  // 紧跟着按顺序排（这是"层序数组"这个编码格式的约定）。
  // 这里用"每个节点消耗数组里接下来的两个非占位项"来算 —— 但更稳的做法是
  // 用 slot→id 的映射直接查：子节点的数组下标由父节点的下标推出来。
  //
  // 层序数组的性质：节点在数组里的下标 i，左孩子下标 2i+1、右孩子 2i+2。
  // 这个性质对"完全二叉树"成立，而 LeetCode 的输入正是按这个位置编号的，
  // 空位用 null 占着 —— 所以直接按位置算，不需要消耗式指针。
  for (const node of nodes) {
    const slot = idToSlot[node.id]
    for (const [offset, side] of [[1, 'L'], [2, 'R']]) {
      const childSlot = 2 * slot + offset
      if (childSlot >= arr.length) continue
      const childId = slotToId.get(childSlot)
      if (childId === undefined) continue // 该位置是 null
      nodes[childId].parent = node.id
      nodes[childId].side = side
      nodes[childId].depth = node.depth + 1
      if (side === 'L') node.left = childId
      else node.right = childId
    }
  }

  // 按层重算 col（同层内从左到右第几个），渲染层用它来定横向位置
  const byDepth = new Map()
  for (const node of nodes) {
    if (!byDepth.has(node.depth)) byDepth.set(node.depth, [])
    byDepth.get(node.depth).push(node.id)
  }
  for (const ids of byDepth.values()) {
    ids.sort((a, b) => a - b) // id 顺序即层序顺序 → 同层从左到右
    ids.forEach((id, i) => {
      nodes[id].col = i
    })
  }

  return { nodes, root: 0 }
}

/**
 * 层序数组（含 null 占位）→ 按层分组的节点 id。
 * 单测用得到，也方便渲染层算每一层有几列。
 */
export function levelsOf(nodes) {
  const byDepth = new Map()
  for (const node of nodes) {
    if (!byDepth.has(node.depth)) byDepth.set(node.depth, [])
    byDepth.get(node.depth).push(node.id)
  }
  return [...byDepth.keys()]
    .sort((a, b) => a - b)
    .map((d) => byDepth.get(d).sort((a, b) => a - b))
}

/**
 * 构造推演步骤。
 *
 * @param {{
 *   values?: (number|null)[],
 *   mode?: 'plain' | 'zigzag',
 * }} [options]
 * @returns {object[]}
 */
export function buildLevelOrderSteps(options = {}) {
  // 演示用的默认树（和文章正文里的例子逐字一致）：
  //         3
  //        / \
  //       9  20
  //         /  \
  //        15   7
  //   层序数组: [3, 9, 20, null, null, 15, 7]
  //   结果: [[3], [9, 20], [15, 7]]
  const values = Array.isArray(options.values)
    ? options.values
    : [3, 9, 20, null, null, 15, 7]
  const mode = options.mode === 'zigzag' ? 'zigzag' : 'plain'

  const { nodes, root } = buildTree(values)
  const valueOf = (id) => nodes[id].value

  const results = []
  const rightView = []
  const steps = []
  /** 队列：存节点 id，队首在前。 */
  const queue = []

  const snap = (phase, desc, extra = {}) =>
    steps.push({
      phase,
      desc,
      queue: [...queue],
      levelIndex: -1,
      levelSize: 0,
      consumed: 0,
      current: null,
      enqueued: [],
      levelValues: [],
      results: results.map((lv) => [...lv]),
      rightView: [...rightView],
      mode,
      zigzagReversed: false,
      done: false,
      ...extra,
    })

  // ── 空树 ────────────────────────────────────────────────────────────────
  if (root === -1) {
    snap('done', '树是空的（`root` 是 `null`）—— 没有任何节点，直接返回空数组 `[]`。', {
      done: true,
    })
    return steps
  }

  snap(
    'init',
    '把根节点 `3` 入队。**队列是 BFS 的全部内存** —— 它是一个"待处理却还没轮到"的缓冲区，' +
      '而且天然按层排队：同一层的节点一定挨在一起，且比下一层先出队。' +
      ' 这正是层序遍历能"分层输出"的物理基础。',
    { enqueued: [root] },
  )
  queue.push(root)

  let levelIndex = 0
  while (queue.length > 0) {
    // ── 进层：快照 size ───────────────────────────────────────────────────
    const levelSize = queue.length
    const reversed = mode === 'zigzag' && levelIndex % 2 === 1
    /**
     * 这一层收集到的值。锯齿变体用"头插"代替"事后反转"：
     * 偶数层 push（左→右），奇数层 unshift（等价于右→左，但不用额外一次 reverse）。
     * ⚠️ 无论哪种模式，**左右孩子的入队顺序都保持 left → right 不变** ——
     * 变的只是"值往结果列表的哪一头放"。
     */
    const levelValues = []
    const put = (v) => {
      if (reversed) levelValues.unshift(v)
      else levelValues.push(v)
    }

    snap(
      'enter',
      `**进第 ${levelIndex} 层之前，先做一件最关键的事：把当前队列长度存下来。**` +
        ` 此刻队列里是 \`[${queue.map(valueOf).join(', ')}]\`，` +
        `所以 \`size = ${levelSize}\` —— 这 ${levelSize} 个节点就是第 ${levelIndex} 层的**全部成员**。` +
        ' 为什么要存：接下来的内层循环会一边出队、一边把左右孩子入队，' +
        '队列长度是**一直在变的**。如果拿实时长度当循环条件，下一层的节点会立刻被卷进来，' +
        '层就分不开了。' +
        (reversed
          ? ` 这是锯齿变体的奇数层 —— 顺序要**反过来**，所以这一层的值用头插收集。`
          : ''),
      { levelIndex, levelSize, levelValues: [...levelValues], zigzagReversed: reversed },
    )

    // ── 内层循环：出队 levelSize 次 ────────────────────────────────────────
    for (let k = 0; k < levelSize; k += 1) {
      const id = queue.shift()
      const node = nodes[id]
      const kids = []
      if (node.left !== undefined && node.left !== null) kids.push(node.left)
      if (node.right !== undefined && node.right !== null) kids.push(node.right)

      put(node.value)

      snap(
        'consume',
        `出队第 ${k + 1} / ${levelSize} 个节点：\`${node.value}\`。` +
          ` 把它记进第 ${levelIndex} 层的结果里` +
          (reversed ? '（头插到前面，因为这一层要从右往左）' : '') +
          (kids.length
            ? `。 它有两个孩子要处理：${kids.map((c) => `\`${valueOf(c)}\``).join(' 和 ')} —— 下面一步入队。`
            : `。 它是叶子节点，没有孩子要入队 —— 队列少了一个、没补上。`) +
          ` 已出队 ${k + 1} 个，这一层还剩 ${levelSize - k - 1} 个，` +
          '**出队的次数由进层时那个 `size` 决定，跟此刻队列多长无关。**',
        {
          levelIndex,
          levelSize,
          consumed: k + 1,
          current: id,
          levelValues: [...levelValues],
          zigzagReversed: reversed,
        },
      )

      // 入队左右孩子（叶子节点没有这一步，就不多出一帧）
      if (kids.length) {
        for (const c of kids) queue.push(c)
        snap(
          'enqueue',
          `把 \`${node.value}\` 的${kids.map((c) => ` \`${valueOf(c)}\``).join(' 和')}` +
            ' 入队。**注意它们排到了队尾** —— 在同层还没处理完的节点后面，' +
            `也就是第 ${levelIndex + 1} 层的位置。` +
            ' 队列"同层在前、下层在后"的次序，就是分层这件事的全部玄机。',
          {
            levelIndex,
            levelSize,
            consumed: k + 1,
            current: id,
            enqueued: kids,
            levelValues: [...levelValues],
            zigzagReversed: reversed,
          },
        )
      }
    }

    // ── 封层 ──────────────────────────────────────────────────────────────
    results.push([...levelValues])
    rightView.push(levelValues[levelValues.length - 1])

    snap(
      'close',
      `第 ${levelIndex} 层的 ${levelSize} 个节点全部出队，收工。` +
        ` 这一层的结果是 \`[${levelValues.join(', ')}]\`` +
        (reversed ? '（已按锯齿要求从右往左）' : '') +
        `。 此刻队列里是 \`[${queue.map(valueOf).join(', ')}]\` —— ` +
        (queue.length
          ? `正好是第 ${levelIndex + 1} 层，下一轮的 \`size\` 就会等于 ${queue.length}。`
          : '空了。') +
        (mode === 'zigzag'
          ? ' 下一层的收集方向要**反过来**（锯齿的本质：只改值的方向，不改队列的方向）。'
          : ''),
      {
        levelIndex,
        levelSize,
        consumed: levelSize,
        levelValues: [...levelValues],
        zigzagReversed: reversed,
      },
    )

    levelIndex += 1
  }

  // ── 收尾 ─────────────────────────────────────────────────────────────────
  const shape = results.map((lv) => `[${lv.join(', ')}]`).join(', ')
  snap(
    'done',
    `队列空了，遍历结束。返回 \`[${shape}]\`。\n\n` +
      `- 一共 ${results.length} 层\n` +
      `- 每层的节点数：${results.map((lv) => lv.length).join('、')}\n` +
      `- 锯齿变体的结果：\`[${results
        .map((lv, i) => `[${(mode === 'zigzag' ? lv : i % 2 === 1 ? [...lv].reverse() : lv).join(', ')}]`)
        .join(', ')}]\`\n` +
      `- 右视图（每层最后一个）：\`[${rightView.join(', ')}]\`\n\n` +
      '**每个节点恰好入队一次、出队一次**，所以整个遍历是线性时间；' +
      '队列里最多压着一层多的节点（最宽的那层 + 它的孩子），空间是 `O(n)`。',
    { levelIndex, done: true, levelValues: results[results.length - 1] ?? [] },
  )

  return steps
}

export default buildLevelOrderSteps
