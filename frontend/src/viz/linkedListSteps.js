/**
 * linkedListSteps.js — 「反转链表」推演过程的状态机（纯函数，不碰 DOM）。
 *
 * 单独拆出来的原因：这是整个动画唯一有"逻辑"的地方，最容易错，也最容易测。
 * 动画层（linkedListReverse.js）只负责把这里产出的快照画成 SVG。
 *
 * 一个 step 长这样：
 *   {
 *     phase: 'init' | 'read-next' | 'flip' | 'advance',
 *     desc:  string,          // 中文说明，直接显示给读者
 *     prev:  number | null,   // prev 指针所在节点的下标
 *     curr:  number | null,
 *     next:  number | null,
 *     nextOf: (number|null)[],// nextOf[i] = 节点 i 的 next 指向谁
 *     done:  boolean,         // 是否是最后一步
 *   }
 *
 * 循环体对应经典的四行，这里把后两行并成一步，共 3 步：
 *     next = curr.next            ① 先记住下一个，否则掉头后就找不到路了
 *     curr.next = prev            ② 把指针掉头
 *     prev = curr; curr = next    ③ 两个指针一起前移
 *
 * 步数 = 1（初始）+ 3 × n。
 */

export function buildSteps(values) {
  const n = values.length
  // nextOf[i] = 节点 i 的 next 指向的下标；null 表示指向空
  const nextOf = Array.from({ length: n }, (_, i) => (i + 1 < n ? i + 1 : null))
  const steps = []

  let prev = null
  let curr = n > 0 ? 0 : null
  let next = null

  const snap = (phase, desc) =>
    steps.push({ phase, desc, prev, curr, next, nextOf: [...nextOf], done: false })

  const label = (i) => (i === null ? '∅' : String(values[i]))

  if (n === 0) {
    snap('init', '空链表。`head` 本身就是 ∅，直接返回 ∅ —— 这是必须单独处理的第一种边界。')
    steps[0].done = true
    return steps
  }

  snap(
    'init',
    `初始状态：\`prev\` 先站在 ∅（反转后头节点会变成尾节点，它的 \`next\` 必须指向空），` +
      `\`curr\` 指向头节点 ${label(curr)}。`,
  )

  while (curr !== null) {
    next = nextOf[curr]
    snap(
      'read-next',
      `① \`next = curr.next\`，先记住 ${label(next)}。` +
        `这一步看着多余，其实是整个算法的命门：一旦 ② 把 \`curr\` 的指针掉头，` +
        `通往后面节点的唯一线索就断了，所以必须提前存好。`,
    )

    nextOf[curr] = prev
    snap(
      'flip',
      `② \`curr.next = prev\`，把 ${label(curr)} 的箭头掉个头，指向 ${label(prev)}。` +
        (prev === null ? ` 因为 \`prev\` 还是 ∅，${label(curr)} 就成了新的尾节点。` : ''),
    )

    prev = curr
    curr = next
    snap(
      'advance',
      curr === null
        ? `③ \`prev = curr\`，\`curr = next\` = ∅。curr 走出了链表，循环结束 —— ` +
          `返回 \`prev\`（${label(prev)}），它就是反转后的新头节点。`
        : `③ \`prev\` 和 \`curr\` 一起右移：\`prev\` 指向 ${label(prev)}，\`curr\` 指向 ${label(curr)}。准备处理下一个节点。`,
    )
  }

  steps[steps.length - 1].done = true
  return steps
}

export default buildSteps
