/**
 * removeDupSteps.js — 「删除排序链表中的重复元素 II」(LeetCode 82) 推演的状态机
 * （纯函数，不碰 DOM）。
 *
 * 和系列里其它动画一样单独拆出来：这是动画里唯一有"逻辑"的地方，最容易错，
 * 也最容易测；渲染层（removeDups2.js）只负责把快照画成 SVG。
 *
 * ── 算法本身 ──────────────────────────────────────────────────────────────
 *
 * 链表已排序，所以**重复的元素一定是连续的**。这题要删掉"所有出现过重复的
 * 值"，一个都不留 —— 这跟 LC 83（保留一个）是两回事。
 *
 * 做法是 dummy 哨兵 + 双指针 prev / curr：
 *
 *   dummy.next = head          # 头节点也可能被删，必须先架个"前任"
 *   prev, curr = dummy, head
 *   while curr:
 *       if curr.next and curr.val == curr.next.val:
 *           dup = curr.val              # 记住这个值
 *           while curr and curr.val == dup:
 *               curr = curr.next        # 整段跳过
 *           prev.next = curr            # 一次接上，中间整段被摘掉
 *       else:
 *           prev = curr                 # 没重复，prev 才前进
 *           curr = curr.next
 *   return dummy.next
 *
 * 两个关键点，也是这篇要讲清楚的：
 *
 *   1. **dummy 存在的唯一理由是"头节点可能被删"**。若 head.val 有重复，
 *      head 自己就要被摘掉，而摘掉一个节点需要**它的前驱**。没有 dummy 时
 *      头节点没有前驱，就没法删 —— 只能写一堆特判。
 *
 *   2. **prev 只在"确定 curr 不是重复段成员"时才前进**。这是最容易写错的
 *      地方：一旦发现重复，curr 就被推着往前跑，prev 留在原地**等着**，
 *      直到 curr 跑出重复段，再用 prev.next = curr 一次接上。
 *      如果跟着一起推，被摘掉的那段中间就会出现 prev 悬空。
 *
 * ── 编码 ─────────────────────────────────────────────────────────────────
 *
 * 用「节点池 + 一条路径」来编码：
 *
 *   pool[i]      = 第 i 个节点的值（整个结构里每个节点唯一）
 *   path[]       = 链表从头到尾经过的节点下标
 *   dummy        = 哨兵，在渲染层表达式上是"最左侧的一个虚线节点"
 *
 * 与 LC 160 那种"两条链"不同，这里只有一条链，所以状态短得多。但
 * **步骤里必须同时记录 prev 和 curr 两处落点** —— 动画的看点就在
 * "curr 冲进重复段、prev 停在原地等"这个错位上。
 *
 * 一个 step 长这样：
 *   {
 *     phase: 'init' | 'scan' | 'dup-start' | 'skip' | 'unlink' | 'advance' | 'done',
 *     desc:  string,
 *     prev:  number,          // prev 指向的 pool 下标（-1 表示 dummy）
 *     curr:  number,          // curr 指向的 pool 下标（等于 path.length 表示 ∅）
 *     dupStart, dupEnd: number|null,  // 正在处理的重复段区间（左闭右开）
 *     removed: number[],      // 已经被摘掉的 pool 下标（累计）
 *     removedNow: number[],   // 这一帧刚摘掉的
 *     kept: number[],         // 最终保留下来的 pool 下标
 *     done: boolean,
 *   }
 *
 * ── 阿里变体 ──────────────────────────────────────────────────────────────
 *
 * 「保留重复元素只留一个」：1→1→1→2→3→3→4 → 1→3。注意这不等于 LC 83 ——
 * LC 83 是每个值都留一个（结果 1→2→3→4），阿里这个变体是**只有重复过的
 * 值才留一个，没重复过的值照常留**。所以它其实是「LC 82 的删除 + LC 83
 * 的保留一个」的混合体，代码上就是把 `prev.next = curr` 换成
 * "接上重复段的**最后一个**节点"，即 `prev = dupEnd - 1` 那一格。
 * 本状态机用 `mode: 'remove-all' | 'keep-one'` 两个模式同时支持。
 */

const DUMMY = -1

/**
 * 从 index 起、"值相同的连续区间"长度（至少 1）；越界返回 0。
 *
 * 判的是**值相等**而不是下标相邻：排序链表里同值必然相邻，把这两件事合成
 * 一个判据，状态机和单测都能直接复用。pool 与 path 分开传，所以这里必须
 * 通过 `valueAt` 间接比较 —— 直接比 pool 下标会是错的。
 *
 * 抽成导出函数是为了让单测能独立验证"重复段边界"这一层，而不是只能
 * 从整段帧序列反推。
 */
export function runLengthFrom(pool, path, index) {
  if (!Array.isArray(path) || index < 0 || index >= path.length) return 0
  const v = pool[path[index]]
  let n = 1
  while (index + n < path.length && pool[path[index + n]] === v) n += 1
  return n
}

/**
 * 构造推演步骤。
 *
 * @param {{
 *   pool?: (number|string)[],
 *   path?: number[],
 *   mode?: 'remove-all' | 'keep-one',
 * }} [options]
 * @returns {object[]}
 */
export function buildRemoveDupSteps(options = {}) {
  const pool = Array.isArray(options.pool) && options.pool.length
    ? options.pool
    : [1, 2, 3, 3, 4, 4, 5]
  // 演示用的默认结构（和文章正文里的例子逐字一致）：
  //   1 → 2 → 3 → 3 → 4 → 4 → 5   →   1 → 2 → 5
  //   pool 下标: 0=1  1=2  2=3  3=3  4=4  5=4  6=5
  // 判 `Array.isArray` 而不是 `.length` —— 显式传进来的空链表是合法输入。
  const path = Array.isArray(options.path)
    ? options.path
    : [0, 1, 2, 3, 4, 5, 6]
  const mode = options.mode === 'keep-one' ? 'keep-one' : 'remove-all'

  const label = (slot) =>
    slot === DUMMY || slot === null || slot === undefined
      ? 'dummy'
      : slot >= path.length
        ? '∅'
        : String(pool[path[slot]])

  /** 第 index 格（path 下标）的值；越界返回 null。 */
  const valueAt = (index) =>
    index < 0 || index >= path.length ? null : pool[path[index]]

  /** 从 index 起、连续同值的区间长度（至少 1）；越界返回 0。 */
  const runAt = (index) => runLengthFrom(pool, path, index)

  // ── 先算最终结果（"保留 / 摘掉"两组下标）────────────────────────────────
  const finalKept = []
  const finalRemoved = []
  {
    let i = 0
    while (i < path.length) {
      const run = runAt(i)
      if (run > 1) {
        if (mode === 'keep-one') {
          for (let k = i; k < i + run - 1; k += 1) finalRemoved.push(k)
          finalKept.push(i + run - 1)
        } else {
          for (let k = i; k < i + run; k += 1) finalRemoved.push(k)
        }
      } else {
        finalKept.push(i)
      }
      i += run
    }
  }

  const steps = []
  const removedSoFar = []
  const snap = (phase, desc, extra = {}) =>
    steps.push({
      phase,
      desc,
      prev: DUMMY,
      curr: 0,
      dupStart: null,
      dupEnd: null,
      removed: [...removedSoFar],
      removedNow: [],
      kept: [...finalKept],
      mode,
      done: false,
      ...extra,
    })

  // ── 0. 空链表 ────────────────────────────────────────────────────────────
  if (path.length === 0) {
    snap('done', '链表是空的 —— 没有节点可删，直接返回 `null`。', {
      curr: 0,
      prev: DUMMY,
      done: true,
    })
    return steps
  }

  snap(
    'init',
    `链表 ${path.map((_, i) => label(i)).join(' → ')} 已经**排好序**，` +
      '所以重复的元素一定挨在一起。' +
      '目标是**把所有出现过的重复值都删干净**（一个都不留），' +
      (mode === 'keep-one'
        ? '不过这次用阿里变体的规则：**重复过的值留下一个**。'
        : '这就是本题（LC 82）的要求，注意跟"只留一个"不是一回事。') +
      ' 先在头上架一个 `dummy` 哨兵 —— 头节点自己也可能是重复段的一员。',
    { prev: DUMMY, curr: 0 },
  )

  // ── 主循环 ───────────────────────────────────────────────────────────────
  let i = 0
  while (i < path.length) {
    const run = runAt(i)

    if (run > 1) {
      // ① 发现重复段
      const dupStart = i
      const dupEnd = i + run
      const dupValue = valueAt(i)
      snap(
        'dup-start',
        `\`curr\` 在 ${label(i)}，它的值和下一个节点相同（都是 ${dupValue}）——` +
          `**发现一段重复，长度 ${run}**。` +
          '`prev` 就此**停住不动**，因为一会儿要把整段一次摘掉，' +
          '摘的动作得由 `prev.next = curr` 完成，prev 必须留在这一段的**前一个**位置。',
        {
          prev: i - 1 < 0 ? DUMMY : i - 1,
          curr: i,
          dupStart,
          dupEnd,
        },
      )

      // ② 整段跳过：curr 从 dupStart 一路推到 dupEnd，一步一格。
      //    共 run 帧。第一帧的下一个仍是同值节点（"还得继续跳"），
      //    最后一帧才跨到重复段之外 —— 两种说法分开写，免得出现
      //    "往前一格到 3"（原地不动）这种自相矛盾的描述。
      for (let k = dupStart; k < dupEnd; k += 1) {
        const toIsStillDup = k + 1 < dupEnd
        snap(
          'skip',
          `\`curr\` 从 ${label(k)} 往前一格到 ${label(k + 1)}（值都是 ` +
            `${valueAt(k)}）——` +
            (toIsStillDup
              ? ' 后面**还有同值的节点**，重复段没走完，继续往前。'
              : ' 这一步跨出了重复段。') +
            ' 全程 **`prev` 一动没动** —— 它守在重复段前面的那个节点上，等着被接上。',
          {
            prev: i - 1 < 0 ? DUMMY : i - 1,
            curr: k + 1,
            dupStart,
            dupEnd,
          },
        )
      }

      // ③ 摘链
      if (mode === 'keep-one') {
        // 保留一个：把重复段的**最后一个**节点留下
        const keepIdx = dupEnd - 1
        for (let k = dupStart; k < keepIdx; k += 1) {
          removedSoFar.push(k)
        }
        const newly = Array.from({ length: keepIdx - dupStart }, (_, n) => dupStart + n)
        snap(
          'unlink',
          `**阿里变体：留下一个。** 把重复段里的 ${dupStart} 到 ${keepIdx - 1} 号节点` +
            `（值都是 ${dupValue}）摘掉，只留最后一个 ${label(keepIdx)}。` +
            `\`prev.next\` 指向 ${label(keepIdx)}。`,
          {
            prev: keepIdx,
            curr: dupEnd,
            dupStart,
            dupEnd,
            removedNow: newly,
          },
        )
      } else {
        for (let k = dupStart; k < dupEnd; k += 1) {
          removedSoFar.push(k)
        }
        const newly = Array.from({ length: run }, (_, n) => dupStart + n)
        const tail = dupEnd < path.length ? label(dupEnd) : '∅'
        snap(
          'unlink',
          `**整段摘掉。** \`prev.next = curr\` 一次接上 ${tail} ——` +
            ` 中间的 ${run} 个节点（值都是 ${dupValue}）全被摘出链表，一个不留。` +
            '这一步就是本题跟 LC 83 的分水岭：**LC 83 会留下一个，这里一个都不留。**',
          {
            prev: i - 1 < 0 ? DUMMY : i - 1,
            curr: dupEnd,
            dupStart,
            dupEnd,
            removedNow: newly,
          },
        )
        // prev 前进到"这段之后的那个节点的前驱"位置 → 也就是 dupEnd-1
        // （占位，下一轮循环会重新按实际情况定位）
      }

      i = dupEnd
      // prev 现在指向"刚刚接上的那个节点"；下一轮如果 curr 不再重复，
      // advance 会把 prev 推到 curr。
      const prevAfter = mode === 'keep-one' ? dupEnd - 1 : i - 1
      if (i < path.length) {
        snap(
          'advance',
          `刚才那一段处理完了：\`prev\` 现在停在 ${label(prevAfter)}，` +
            `\`curr\` 落在 ${label(i)}。**只有确定 curr 不再是重复段成员时，prev 才跟着前进。**`,
          { prev: prevAfter, curr: i },
        )
      }
      continue
    }

    // 没有重复：prev 和 curr 一起前进
    snap(
      'scan',
      `\`curr\` 在 ${label(i)}，它的值（${valueAt(i)}）跟下一个` +
        `${i + 1 < path.length ? `（${label(i + 1)}）` : '（没有下一个了）'}` +
        ` 不相同 —— 这个节点不属于任何重复段，**安全保留**。` +
        '于是 `prev` 也前进一格，跟 `curr` 挨着一起往右走。',
      {
        prev: i - 1 < 0 ? DUMMY : i - 1,
        curr: i,
      },
    )
    i += 1
  }

  // ── 收尾 ─────────────────────────────────────────────────────────────────
  const srcText = path.map((_, idx) => label(idx)).join(' → ')
  const keptText = finalKept.map((idx) => label(idx)).join(' → ')
  const removedText = finalRemoved.length
    ? finalRemoved.map((idx) => label(idx)).join('、')
    : '（无）'
  snap(
    'done',
    `\`curr\` 走到了 ∅，循环结束。返回 \`dummy.next\`。\n\n` +
      `- 原链表：${srcText}\n` +
      `- 结果：**${keptText || '（空）'}**\n` +
      `- 被摘掉的节点：${removedText}\n\n` +
      (mode === 'keep-one'
        ? '阿里变体的结果里，**重复过的值各留了一个**，没重复过的值原样保留。'
        : '**所有出现过的重复值都被删干净了** —— 这就是 LC 82 跟 LC 83 的区别。') +
      ' 全程只用了两根指针，额外空间 `O(1)`。',
    { prev: DUMMY, curr: path.length, done: true },
  )
  return steps
}

export default buildRemoveDupSteps
