/**
 * removeNthSteps.js — 「删除链表的倒数第 N 个结点」(LeetCode 19) 推演的状态机
 * （纯函数，不碰 DOM）。
 *
 * 和 linkedListSteps.js / cycleDetectSteps.js 一样单独拆出来：这是动画里唯一
 * 有"逻辑"的地方，最容易错，也最容易测；渲染层（removeNthFromEnd.js）只负责
 * 把快照画成 SVG。
 *
 * 位置编码（slot）：0 = dummy 哑结点，1..L = 第 i 个节点，null = ∅（null）。
 * 渲染层负责把 slot 换算成画布坐标。
 *
 * 一个 step 长这样：
 *   {
 *     phase: 'init' | 'lead' | 'sync' | 'cut' | 'done',
 *     desc:   string,          // 中文说明，直接显示给读者
 *     fast:   number | null,   // fast 指针的 slot
 *     slow:   number | null,   // slow 指针的 slot
 *     gap:    number | null,   // 两者间隔（fastSlot - slowSlot），null = 未定义
 *     links:  (number|null)[], // links[slot] = slot 的 next；下标 0 是 dummy
 *     cutSlot: number | null,  // 被删除节点的 slot（cut/done 帧高亮用）
 *     leadTotal / syncTotal: number, // 各阶段的总步数（desc 里显示进度）
 *     done:   boolean,
 *   }
 *
 * 算法约定（文章正文的写法）：
 *   dummy + fast 先走 n+1 步 + while (fast) 同步前进 + slow.next = slow.next.next
 *   步数 = 1（初始）+ (n+1)（先走）+ (L-n)（同步）+ 1（删除）+ 1（收尾）。
 */

export function buildRemoveNthSteps(values, n) {
  const L = values.length
  // links[slot]：slot 的 next 指向谁。links[0] 是 dummy，恒指向 1（头节点）。
  const links = Array.from({ length: L + 1 }, (_, slot) => (slot + 1 <= L ? slot + 1 : null))
  const steps = []

  const label = (slot) => {
    if (slot === null) return '∅'
    if (slot === 0) return 'dummy'
    return String(values[slot - 1])
  }
  const snap = (phase, desc, extra = {}) =>
    steps.push({
      phase,
      desc,
      fast: 0,
      slow: 0,
      gap: null,
      links: [...links],
      cutSlot: null,
      leadTotal: n + 1,
      syncTotal: Math.max(0, L - n),
      done: false,
      ...extra,
    })

  if (L === 0) {
    snap('init', '空链表：没有可删的节点，返回 `∅` 即可。')
    steps[0].done = true
    return steps
  }

  snap(
    'init',
    '先接一个哑结点 `dummy`，`fast` 和 `slow` 都从它出发。有它在，「删头节点」就不再需要特判。',
  )

  // ── ① fast 先走 n+1 步，slow 原地不动 ────────────────────────────────────
  let fast = 0
  for (let k = 1; k <= n + 1; k += 1) {
    fast = links[fast]
    const gap = fast - 0
    snap(
      'lead',
      k === 1
        ? `① \`fast\` 先走：第 1 / ${n + 1} 步，指向 ${label(fast)}。约定是先走 **n+1 = ${n + 1}** 步 —— 要定位的是待删节点的**前驱**，所以多退这一步。`
        : fast === null
          ? `① \`fast\` 第 ${k} / ${n + 1} 步落到了 ∅ —— \`n\` 正好等于链长，要删的就是**头节点**。同步阶段将一步不走，\`slow\` 会留在 \`dummy\` 上。`
          : `① \`fast\` 继续走：第 ${k} / ${n + 1} 步，指向 ${label(fast)}。` +
            (k === n + 1
              ? `间隔锁死为 **n+1 = ${n + 1}**， \`slow\` 从现在起一步不会再被落下。`
              : `\`slow\` 原地不动，间隔拉开到 ${gap}。`),
      { fast, gap: fast === null ? null : gap },
    )
  }

  // ── ② 同步前进：fast 走到 null，slow 停在前驱 ────────────────────────────
  let slow = 0
  let move = 0
  while (fast !== null) {
    fast = links[fast]
    slow = links[slow]
    move += 1
    const isLast = fast === null
    snap(
      'sync',
      isLast
        ? `② \`fast\` 撞到了 ∅，停下。\`slow\` 停在 ${label(slow)} —— 正是**倒数第 n+1 个**节点，待删节点 ${label(slow + 1)} 的**前驱**。`
        : `② 两个指针一起走（第 ${move} / ${L - n} 步）：\`fast\` 在 ${label(fast)}，\`slow\` 在 ${label(slow)}。间隔保持 ${fast - slow} 不变 —— 这就是循环不变量。`,
      { fast, slow, gap: isLast ? null : fast - slow },
    )
  }

  // ── ③ 删除：slow.next 跨过待删节点 ───────────────────────────────────────
  const cutSlot = slow + 1
  links[slow] = links[cutSlot]
  snap(
    'cut',
    `③ \`slow.next = slow.next.next\`：${label(slow)} 的箭头跨过 ${label(cutSlot)}，直接指向 ${label(links[slow])}。节点 ${label(cutSlot)} 被摘掉 —— 注意它还在内存里，只是没人再引用它。`,
    { slow, cutSlot },
  )

  // ── ④ 收尾 ────────────────────────────────────────────────────────────────
  snap(
    'done',
    `④ 返回 \`dummy.next\`（**不是 head**——如果删的是头节点，head 已经不在链上了）。得到 ${values
      .filter((_, i) => i !== cutSlot - 1)
      .map(String)
      .join(' → ')}。全程只扫了**一趟**。`,
    { slow, cutSlot },
  )

  steps[steps.length - 1].done = true
  return steps
}

export default buildRemoveNthSteps
