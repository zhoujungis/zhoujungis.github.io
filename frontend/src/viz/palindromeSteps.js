/**
 * palindromeSteps.js — 「回文链表」(LeetCode 234) 推演的状态机（纯函数，不碰 DOM）。
 *
 * 和系列里其它动画一样单独拆出来：这是动画里唯一有"逻辑"的地方，最容易错，
 * 也最容易测；渲染层（palindromeList.js）只负责把快照画成 SVG。
 *
 * 位置编码：slot = 节点在原链表里的下标 0..L-1。
 *
 * 一个 step 长这样：
 *   {
 *     phase: 'init' | 'mid' | 'split' | 'rev' | 'cmp' | 'done',
 *     stage: 0 | 1 | 2 | 3,   // 顶部阶段条高亮哪一格（0 = 还没开始）
 *     desc:  string,
 *     links: (number|null)[], // links[i] = 节点 i 的 next 指向谁
 *     front: number[],        // 上行：前半段（按链表顺序，不含中点）
 *     back:  number[],        // 下行：后半段（反转后是从尾到中点，反转中则是"已反转 + 未处理"）
 *     pairs: { f, b, ok }[],  // 已经比过的配对（f = 前半段 slot，b = 后半段 slot）
 *     active: { f, b, ok } | null,  // 当前正在比的那一对
 *     verdict: true | false | null, // 这一帧的结论（null = 还没结论）
 *     chips: { kind, label, slot }[],  // 这一帧要显示的指针徽标
 *     done:  boolean,
 *   }
 *
 * 算法（文章正文的写法）：
 *   ① slow = fast = head，fast 一次两格 slow 一次一格，fast 走完时 slow 在后半段开头
 *   ② 迭代反转后半段（LC 206），注意不需要 slow.next = None
 *   ③ p1 / p2 逐位比值，循环条件 while p2
 *
 * 步数 = 1 初始 + ⌊L/2⌋ 找中点 + 1 切开 + ⌈L/2⌉ 反转 + ⌈L/2⌉ 比较 + 1 收尾。
 */

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

/**
 * 找中点：返回 slow 停在的 slot —— **后半段的第一个节点**。
 *
 * 注意和 LC 143 的 midSlotOf 不一样：那边 slow 停在前半段最后一个
 * （slow=head, fast=head.next），这边两个指针都从 head 出发。
 */
export function midSlotOf(length) {
  if (length <= 0) return null
  let slow = 0
  let fast = 0
  while (fast < length && fast + 1 < length) {
    slow += 1
    fast += 2
  }
  return slow
}

/** 题目定义的判定（对着示例写，仅用于 desc 展示与断言）。 */
export function isPalindromeValues(values) {
  const L = values.length
  for (let i = 0; i < Math.floor(L / 2); i += 1) {
    if (values[i] !== values[L - 1 - i]) return false
  }
  return true
}

/** 需要比较的配对下标（对称位置）——含奇数长度时中点自己跟自己比的那一次。 */
export function pairSlotsOf(length) {
  const mid = midSlotOf(length)
  if (mid === null) return []
  const out = []
  for (let k = 0; length - 1 - k >= mid; k += 1) {
    out.push([k, length - 1 - k])
  }
  return out
}

export function buildPalindromeSteps(values) {
  const L = values.length
  const links = Array.from({ length: L }, (_, i) => (i + 1 < L ? i + 1 : null))
  const label = (s) => (s === null || s === undefined ? '∅' : String(values[s]))
  const steps = []

  const snap = (phase, desc, extra = {}) =>
    steps.push({
      phase,
      stage: 0,
      desc,
      links: [...links],
      front: [],
      back: [],
      pairs: [],
      active: null,
      verdict: null,
      chips: [],
      done: false,
      ...extra,
    })

  if (L === 0) {
    snap(
      'init',
      '空链表。正着读、反着读都是「什么都没有」—— **空链表也算回文**，返回 `true`。',
      { stage: 0, done: true, verdict: true },
    )
    return steps
  }

  const expect = isPalindromeValues(values)
  const mirror = values
    .slice()
    .reverse()
    .join(' → ')

  snap(
    'init',
    `判断 ${values.join(' → ')} 是不是回文。核心一句话：**把后半段反转过来（${mirror}），` +
      '它应该跟前半段逐位相同**。全程只改指针、只比值，不开数组。',
    { front: walkFrom(0, links) },
  )

  if (L === 1) {
    snap(
      'done',
      '只有一个节点，正着读反着读都是它自己 —— **是回文**，返回 `true`。',
      { front: [0], stage: 3, done: true, verdict: true },
    )
    return steps
  }

  // ── ① 找中点 ────────────────────────────────────────────────────────────
  const mid = midSlotOf(L)
  let slow = 0
  let fast = 0
  let move = 0
  while (fast < L && fast + 1 < L) {
    slow += 1
    fast += 2
    move += 1
    const ranOut = fast >= L
    snap(
      'mid',
      `① \`fast\` 一次跨两格、\`slow\` 一次一格：第 ${move} 步后 ` +
        `\`slow\` 走到 ${label(slow)}、\`fast\` 走到 ${label(fast)}。` +
        (ranOut
          ? ` \`fast\` 冲出链表了 —— \`slow\` 停在 ${label(slow)} 上，**这就是后半段的开头**。`
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

  const frontSlots = Array.from({ length: mid }, (_, i) => i)
  const backSlots = Array.from({ length: L - mid }, (_, i) => mid + i)
  const frontText = frontSlots.map(label).join(' → ')
  const backText = backSlots.map(label).join(' → ')

  // ── ② 切开 + 反转后半段 ─────────────────────────────────────────────────
  snap(
    'split',
    `② 后半段 ${backText} 整体下移一行，前半段是 ${frontText}。` +
      '接下来反转下行 —— 反转完它从左到右读起来，应该跟上行一模一样。' +
      '注意这里**不需要断开**：反转时中点 ' + label(mid) +
      ' 的 `next` 会被置空，前半段的尾巴走到它自然就停了。',
    {
      stage: 2,
      front: frontSlots,
      back: backSlots,
      chips: [{ kind: 'curr', label: 'curr', slot: mid }],
    },
  )

  let revHead = null
  let curr = mid
  let revCount = 0
  while (curr !== null) {
    const nxt = links[curr]
    links[curr] = revHead
    revHead = curr
    curr = nxt
    revCount += 1
    const order = [
      ...walkFrom(revHead, links),
      ...(curr === null ? [] : walkFrom(curr, links)),
    ]
    snap(
      'rev',
      `② 第 ${revCount} 个节点掉头：\`curr\` 的 \`next\` 改成 \`prev\`，` +
        `也就是 ${label(revHead)} → ${label(links[revHead])}。` +
        (curr === null
          ? ' 后半段反转完成，\`prev\` 站在新的段头（原来的尾节点）上。'
          : ` \`curr\` 前移到 ${label(curr)}，剩下的还没处理。`),
      {
        stage: 2,
        front: frontSlots,
        back: order,
        chips: [
          { kind: 'prev', label: 'prev', slot: revHead },
          ...(curr === null ? [] : [{ kind: 'curr', label: 'curr', slot: curr }]),
        ],
      },
    )
  }

  const backOrder = walkFrom(L - 1, links) // 反转后的后半段：从尾到中点

  // ── ③ 逐对比较 ──────────────────────────────────────────────────────────
  const pairs = []
  const pairSlots = pairSlotsOf(L)
  for (let k = 0; k < pairSlots.length; k += 1) {
    const [f, b] = pairSlots[k]
    const self = f === b
    const ok = values[f] === values[b]
    const pair = { f, b, ok }
    pairs.push(pair)

    const head = `③ 第 ${k + 1} / ${pairSlots.length} 对：`
    const body = self
      ? `\`p1\` 和 \`p2\` 都走到了中点 ${label(f)} 上 —— **中点跟自己比，必然相等**，这一对是白送的。`
      : `\`p1\` 指向 ${label(f)}、\`p2\` 指向 ${label(b)}，` +
        `${values[f]} ${ok ? '==' : '!='} ${values[b]} —— ` +
        (ok ? '相等，两个指针一起往前。' : '**不相等，直接返回 `false`**，后面几对不用比了。')

    snap('cmp', head + body, {
      stage: 3,
      front: frontSlots,
      back: backOrder,
      pairs: [...pairs],
      active: pair,
      verdict: ok ? null : false,
      done: !ok,
      chips: self
        ? [{ kind: 'p1', label: 'p1/p2', slot: f }]
        : [
            { kind: 'p1', label: 'p1', slot: f },
            { kind: 'p2', label: 'p2', slot: b },
          ],
    })

    if (!ok) return steps
  }

  snap(
    'done',
    `③ \`p2\` 走到 ∅，${pairSlots.length} 对全部相等 —— **${values.join(' → ')} 是回文链表**，返回 \`true\`。`,
    {
      stage: 3,
      front: frontSlots,
      back: backOrder,
      pairs: [...pairs],
      active: null,
      verdict: true,
      done: true,
    },
  )
  return steps
}

export default buildPalindromeSteps
