/**
 * mergeSteps.js — 「合并两个有序链表」推演过程的状态机（纯函数，不碰 DOM）。
 *
 * 单独拆出来的原因和 linkedListSteps.js 一样：这是唯一有"逻辑"的地方，
 * 最容易错，也最容易测。渲染层（mergeTwoLists.js）只负责把快照画成 SVG。
 *
 * 一个 step 长这样：
 *   {
 *     phase: 'init' | 'compare' | 'take' | 'append-rest' | 'done',
 *     desc:  string,          // 中文说明，直接显示给读者
 *     p1:    number | null,   // A 的当前候选下标；null = A 已走完
 *     p2:    number | null,
 *     taken: [{list, i}],     // 已经接到结果链表上的节点，按先后顺序
 *     rest:  null | {list, from},  // append-rest 步：剩下的整段从哪开始
 *     done:  boolean,
 *   }
 *
 * 循环体只有两件事：
 *     比较 a[p1] 和 b[p2]        ① compare
 *     取小的那个接到结果尾部，指针前移  ② take
 *
 * 关键优化在循环外：**一个链表走空之后，另一条剩下的不用再逐个比较，
 * 整段接上就行** —— 因为两条链表各自都是有序的。
 */

const label = (v) => String(v)

export function buildMergeSteps(a, b) {
  const A = Array.isArray(a) ? a : []
  const B = Array.isArray(b) ? b : []
  const steps = []
  const taken = []
  let i = 0
  let j = 0

  const snap = (phase, desc, extra = {}) =>
    steps.push({
      phase,
      desc,
      p1: i < A.length ? i : null,
      p2: j < B.length ? j : null,
      taken: taken.map((t) => ({ ...t })),
      rest: null,
      done: false,
      ...extra,
    })

  const valueAt = (list, index) => (list === 'a' ? A[index] : B[index])

  // ── 空链表的两种边界，直接说清楚 ─────────────────────────────────────────
  if (A.length === 0 && B.length === 0) {
    snap('init', '两条链表都是空的。哑结点后面什么都没有，返回 ∅。')
    steps[0].done = true
    return steps
  }
  if (A.length === 0 || B.length === 0) {
    const which = A.length === 0 ? 'A' : 'B'
    const other = which === 'A' ? 'B' : 'A'
    const otherVals = (other === 'A' ? A : B).map(label).join('、')
    snap(
      'init',
      `${which} 是空链表，那么「合并」就是原样返回 ${other}（${otherVals}）—— ` +
        `一个空链表和一个有序链表合并，结果就是那个有序链表本身。`,
    )
    steps[0].done = true
    return steps
  }

  snap(
    'init',
    `两个指针各站在自己链表的头部：\`p1\` 指向 A 的 ${label(A[0])}，` +
      `\`p2\` 指向 B 的 ${label(B[0])}。结果链表先放一个**哑结点**当锚点 —— ` +
      `它不是答案的一部分，只是为了让我们不必特判「第一个节点该接谁」，最后返回 \`dummy.next\` 就行。`,
  )

  // ── 主循环：两条链表都还有货的时候，逐个比较 ─────────────────────────────
  while (i < A.length && j < B.length) {
    const takeA = A[i] <= B[j]
    snap(
      'compare',
      `比较 \`p1\` 的 ${label(A[i])} 和 \`p2\` 的 ${label(B[j])}：` +
        (takeA
          ? `${label(A[i])} ≤ ${label(B[j])}，取 A 的 ${label(A[i])}。` +
            (A[i] === B[j] ? '（相等时取哪边都行，习惯上取 A）' : '')
          : `${label(B[j])} < ${label(A[i])}，取 B 的 ${label(B[j])}。`),
      { cursor: takeA ? 'a' : 'b' },
    )

    if (takeA) {
      taken.push({ list: 'a', i })
      i += 1
    } else {
      taken.push({ list: 'b', i: j })
      j += 1
    }
    const pickedValue = valueAt(taken[taken.length - 1].list, taken[taken.length - 1].i)
    snap(
      'take',
      `把 ${label(pickedValue)} 接到结果链表的尾部，然后 ` +
        `${takeA ? '`p1`' : '`p2`'} 前移一格。` +
        (takeA && i >= A.length ? ' A 走完了。' : '') +
        (!takeA && j >= B.length ? ' B 走完了。' : ''),
      { picked: takeA ? 'a' : 'b' },
    )
  }

  // ── 收尾：一个链表空了，另一条整段接上 ───────────────────────────────────
  // 每次循环只取走一个节点，所以循环结束时必有一侧刚好走空、
  // 另一侧至少还剩 1 个 —— 非空输入一定会走到这里一次。
  if (i < A.length || j < B.length) {
    const which = i < A.length ? 'a' : 'b'
    const from = i < A.length ? i : j
    const restVals = (which === 'a' ? A.slice(i) : B.slice(j)).map(label).join('、')
    const remaining = which === 'a' ? A : B
    // 指针快照要在推进之前取：收尾这一步里，走空的那侧指针指向 ∅，
    // 另一侧的指针仍站在剩余段的第一个节点上（渲染层据此画 chip）。
    const p1AtRest = i < A.length ? i : null
    const p2AtRest = j < B.length ? j : null
    for (let k = from; k < remaining.length; k += 1) taken.push({ list: which, i: k })
    if (which === 'a') i = A.length
    else j = B.length

    snap(
      'append-rest',
      `${which === 'a' ? 'B' : 'A'} 已经走完了，${which === 'a' ? 'A' : 'B'} 剩下的 ` +
        `${restVals} 全部原样接到结果尾部。**这是整道题最容易被忽略的一步**：` +
        `两条链表各自都是有序的，所以剩下这段不需要再逐个比较，直接整段接上就对。`,
      { rest: { list: which, from }, p1: p1AtRest, p2: p2AtRest },
    )
  }

  const merged = taken.map((t) => label(valueAt(t.list, t.i))).join(' → ')
  snap(
    'done',
    `两条链表都走完了。结果链表是 ${merged} —— 但别忘了开头那个哑结点，` +
      `它不是答案的一部分，所以返回 \`dummy.next\`。`,
  )
  steps[steps.length - 1].done = true

  return steps
}

export default buildMergeSteps
