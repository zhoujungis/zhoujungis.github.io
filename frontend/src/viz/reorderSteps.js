/**
 * reorderSteps.js — 「重排链表」(LeetCode 143) 推演的状态机（纯函数，不碰 DOM）。
 *
 * 和 removeNthSteps.js 一样单独拆出来：这是动画里唯一有"逻辑"的地方，最容易错，
 * 也最容易测；渲染层（reorderList.js）只负责把快照画成 SVG。
 *
 * 位置编码：slot = 节点在原链表里的下标 0..L-1。
 *
 * 一个 step 长这样：
 *   {
 *     phase: 'init' | 'mid' | 'split' | 'rev' | 'merge' | 'done',
 *     stage: 0 | 1 | 2 | 3,   // 顶部阶段条高亮哪一格（0 = 还没开始）
 *     desc:  string,
 *     links: (number|null)[], // links[i] = 节点 i 的 next 指向谁
 *     merged: number[],       // 已经交替插好的节点（按结果顺序）
 *     front: number[],        // 前半段还没插进去的（按链表顺序）
 *     back:  number[],        // 后半段还没插进去的（按链表顺序，反转后是倒着的）
 *     chips: { kind, label, slot }[],   // 这一帧要显示的指针徽标
 *     cutEdge: [number, number] | null, // 刚被切断的那条边（灰色虚线，示意「已断开」）
 *     done:  boolean,
 *   }
 *
 * 算法（文章正文的写法）：
 *   ① slow/fast 找中点（slow 停在前半段最后一个节点）
 *   ② slow.next = None 断开 + 迭代反转后半段（LC 206）
 *   ③ 交替合并：每次改两个 next
 * 步数 = 1 初始 + ⌊(L-1)/2⌋ 找中点 + 1 断开 + ⌈L/2⌉ 反转 + 2·⌊L/2⌋ 合并帧 + 1 收尾。
 */

/** 找中点：返回 slow 停在的 slot —— 前半段的最后一个节点。 */
export function midSlotOf(length) {
  if (length <= 0) return null
  let slow = 0
  let fast = 1
  while (fast < length && fast + 1 < length) {
    slow += 1
    fast += 2
  }
  return slow
}

/** 顺着 links 从 start 走到链尾，返回沿途 slot（渲染层用它排位置）。 */
export function walkFrom(start, links) {
  const out = []
  let cur = start
  const seen = new Set()
  while (cur !== null && cur !== undefined && !seen.has(cur)) {
    seen.add(cur)
    out.push(cur)
    cur = links[cur]
  }
  return out
}

/** 题目定义的重排结果（对着示例写，仅用于 desc 展示与断言）。 */
export function reorderedValues(values) {
  const L = values.length
  const out = []
  for (let i = 0; i < Math.floor(L / 2); i += 1) {
    out.push(values[i], values[L - 1 - i])
  }
  if (L % 2 === 1) out.push(values[Math.floor(L / 2)])
  return out
}

export function buildReorderSteps(values) {
  const L = values.length
  const links = Array.from({ length: L }, (_, i) => (i + 1 < L ? i + 1 : null))
  const label = (slot) => (slot === null ? '∅' : String(values[slot]))
  const steps = []

  const snap = (phase, desc, extra = {}) =>
    steps.push({
      phase,
      stage: 0,
      desc,
      links: [...links],
      merged: [],
      front: [],
      back: [],
      chips: [],
      cutEdge: null,
      done: false,
      ...extra,
    })

  /** 剩余部分要排掉已经并入 merged 的节点，否则画面上会出现重复格子。 */
  const remainder = (start, merged) =>
    walkFrom(start, links).filter((s) => !merged.includes(s))

  if (L <= 1) {
    snap('init', L === 0
      ? '空链表，没什么可重排的。'
      : '只有一个节点，重排之后还是它自己 —— 直接返回。', { front: walkFrom(0, links) })
    steps[0].done = true
    return steps
  }

  snap(
    'init',
    '目标：前半段顺序不变，后半段倒过来插进缝隙 —— ' +
      `也就是要把 ${values.join(' → ')} 变成 ` +
      `${reorderedValues(values).join(' → ')}。全程只改指针，一个值都不动。`,
    { front: walkFrom(0, links) },
  )

  // ── ① 找中点 ────────────────────────────────────────────────────────────
  const mid = midSlotOf(L)
  let slow = 0
  let fast = 1
  let moveCount = 0
  while (fast < L && fast + 1 < L) {
    slow += 1
    fast += 2
    moveCount += 1
    snap(
      'mid',
      `① 快慢指针找中点（第 ${moveCount} 步）：\`fast\` 一次跨两格到 ${label(fast < L ? fast : null)}，` +
        `\`slow\` 一次挪一格到 ${label(slow)}。` +
        (slow === mid
          ? ` \`fast\` 走不动了 —— \`slow\` 停在 **${label(slow)}**，正是前半段的最后一个节点。`
          : ''),
      {
        stage: 1,
        front: walkFrom(0, links),
        chips: [
          { kind: 'slow', label: 'slow', slot: slow },
          { kind: 'fast', label: 'fast', slot: fast < L ? fast : null },
        ],
      },
    )
  }

  // ── ② 断开 ──────────────────────────────────────────────────────────────
  const backHead = mid + 1
  links[mid] = null
  snap(
    'split',
    `② **\`slow.next = None\`** —— 断开。这一步看着多余，其实是防环的命门：` +
      `前半段的尾巴要是还搭在后半段上，第 ③ 步合并时指针会绕成环，链表再也走不到头。` +
      `现在前段是 ${values.slice(0, mid + 1).map(String).join(' → ')}，后段是 ` +
      `${values.slice(backHead).map(String).join(' → ')}。`,
    {
      stage: 2,
      front: walkFrom(0, links),
      back: walkFrom(backHead, links),
      cutEdge: [mid, backHead],
    },
  )

  // ── ② 反转后半段（LC 206 的逐字复刻）────────────────────────────────────
  let prev = null
  let curr = backHead
  while (curr !== null) {
    const nxt = links[curr]
    links[curr] = prev
    const flipped = curr
    prev = curr
    curr = nxt
    snap(
      'rev',
      curr === null
        ? `反转最后一步：\`${label(flipped)}.next\` 指向 ${label(links[flipped])}，后半段变成 ` +
          `${walkFrom(prev, links).map(label).join(' → ')}。这是 LC 206 的逐字复刻，只是起点换成了 \`second\`。`
        : `反转后半段：\`${label(flipped)}.next\` 掉头指向 ${label(links[flipped])}，` +
          `\`prev\` 前移到 ${label(prev)}，\`curr\` 前移到 ${label(curr)}。`,
      {
        stage: 2,
        front: walkFrom(0, links),
        back: walkFrom(prev, links).concat(walkFrom(curr, links)),
        chips: [
          { kind: 'prev', label: 'prev', slot: prev },
          { kind: 'curr', label: 'curr', slot: curr },
        ],
      },
    )
  }

  // ── ③ 交替合并 ──────────────────────────────────────────────────────────
  let first = 0
  let second = prev
  const merged = []
  while (second !== null) {
    const t1 = links[first]
    const t2 = links[second]

    // 前半这个 → 后半这个
    links[first] = second
    merged.push(first, second)
    snap(
      'merge',
      `③ \`first.next = second\`：\`${label(first)}\` 的箭头改指向 ${label(second)}，` +
        `把后半段的头节点拽了上来。\`t1\`(\`${label(t1)}\`) 和 \`t2\`(\`${label(t2)}\`) 提前记住了两条链的下家 —— ` +
        `改指针之前先把路记住，和反转链表里那个 \`nxt\` 是同一个道理。`,
      {
        stage: 3,
        merged: [...merged],
        front: remainder(t1, merged),
        back: remainder(t2, merged),
        chips: [
          { kind: 'first', label: 'first', slot: first },
          { kind: 'second', label: 'second', slot: second },
        ],
      },
    )

    // 后半这个 → 前半的下家
    links[second] = t1
    snap(
      'merge',
      t2 === null
        ? `③ \`second.next = t1\`：\`${label(second)}\` 接回 ${label(t1)}。后半段用完了（` +
          `\`second\` 变成 ∅），循环结束 —— 条件写的是 \`while second\`，因为后半段更短。`
        : `③ \`second.next = t1\`：\`${label(second)}\` 接回 ${label(t1)}。` +
          `两个指针各自前移：\`first\` → ${label(t1)}，\`second\` → ${label(t2)}。`,
      {
        stage: 3,
        merged: [...merged],
        front: remainder(t1, merged),
        back: remainder(t2, merged),
        chips: [
          { kind: 'first', label: 'first', slot: t1 },
          { kind: 'second', label: 'second', slot: t2 },
        ],
      },
    )

    first = t1
    second = t2
  }

  // ── ④ 收尾 ──────────────────────────────────────────────────────────────
  const finalChain = walkFrom(0, links)
  snap(
    'done',
    `重排完成：${finalChain.map(label).join(' → ')}。**头节点还是原来的 ${label(0)}** —— ` +
      '所以这题不需要返回新头，Java 的签名就是 `void`。',
    { stage: 3, merged: finalChain },
  )

  steps[steps.length - 1].done = true
  return steps
}

export default buildReorderSteps
