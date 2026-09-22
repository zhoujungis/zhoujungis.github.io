/**
 * cycleDetectSteps.js — 「环形链表」(LeetCode 141) Floyd 判圈的状态机。
 *
 * 纯函数，不碰 DOM（和 linkedListSteps.js / mergeSteps.js / mergeKListsSteps.js
 * 同一套路）。渲染层（cycleDetect.js）只负责把快照画成 SVG。
 *
 * ── 这个动画要回答的问题 ─────────────────────────────────────────────────
 *
 * 「为什么快指针走 2 步、慢指针走 1 步一定相遇？」
 *
 * 记慢指针进环那一刻，快指针在环上领先慢指针 D₀ 格（沿前进方向）。
 * 之后每走一步，快指针比慢指针多走 `closing = fastStep - 1` 格，所以
 *
 *     D_k = (D₀ - closing·k) mod b
 *
 * 相遇就是 D_k = 0。这个同余方程有解，当且仅当 `gcd(closing, b)` 整除 D₀。
 *
 * 关键在 D₀ 长什么样：两指针**同起点**（都从头节点出发），慢指针走到环入口
 * 用了 a 步，此时快指针一共走了 a·fastStep 格，所以
 *
 *     D₀ = (a·closing) mod b
 *
 * 它**必然是 gcd(closing, b) 的倍数** —— 于是方程一定有解，**必然相遇**。
 *
 * ⚠️ 由此推出一个和流传说法相反的结论：**只要 fastStep ≥ 2，快 3、快 4、快 5
 * 都必然相遇**，不存在「环长为偶数时快 3 慢 1 永不相遇」。那个奇偶反例是真的，
 * 但它要求两指针**起始位置不同**（此时 D₀ 不再被 gcd 整除）。标准 Floyd 是
 * 同起点，所以不会触发。单测里用暴力枚举把这条钉死了。
 *
 * 那「2 和 1」为什么是最优选择？两条：
 *   1. fastStep 必须 ≥ 2 —— 相对速度必须为正，否则两指针同步前进，永不相遇。
 *      2 是满足条件的最小值，快指针每步跳过的节点最少。
 *   2. closing = 1 时 D₀ + k ≡ 0 (mod b) 化简成 `a + x = m·b`（x 是相遇点到入口
 *      的距离）—— 这正是 LC 142「一个指针回 head、两者同速前进、在入口相遇」
 *      的全部依据。closing ≥ 2 时只能得到 `closing·(a+x) ≡ 0 (mod b)`，性质变脏，
 *      环长为偶数时那个解法直接失效。
 *
 * ── 一个 step 长这样 ─────────────────────────────────────────────────────
 *   {
 *     phase:    'init' | 'move' | 'met' | 'end',
 *     desc:     string,            // 中文说明，直接显示给读者
 *     slow:     number | null,     // 慢指针所在节点下标（null = 已走出链表）
 *     fast:     number | null,     // 快指针所在节点下标
 *     gap:      number | null,     // 快指针沿环前进方向到慢指针的距离；两者
 *                                  // 都在环上时才有值，0 表示已相遇
 *     cycle:    { start, length } | null,   // 环入口下标 / 环长；null = 无环
 *     fastStep: number,            // 快指针每步走几格（正常是 2）
 *     closing:  number,            // 相对速度 = fastStep - 1
 *     steps:    number,            // 已经走过的步数
 *     met:      boolean,
 *     done:     boolean,
 *   }
 *
 * ── 节点模型 ─────────────────────────────────────────────────────────────
 *
 * 链表按「从头开始的遍历顺序」排成一个数组：前 a 个是直段，之后 b 个是环，
 * 最后一个节点的 next 指回第 a 个。所以：
 *
 *   next(i) = i + 1        (i + 1 < n)
 *           = cycleStart   (i 是最后一个节点，且成环)
 *           = null         (i 是最后一个节点，且无环)
 *
 * a = cycleStart，b = n - cycleStart。
 */

/** 文章里的演示链表：1→2→…→13，入口是 5，所以 a = 4、b = 9。 */
const DEFAULT_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
const DEFAULT_CYCLE_START = 4

/**
 * 节点下标 → 它在环上的序号（0 = 入口节点）。不在环上、或根本没有环，返回 null。
 * 渲染层画「快指针到慢指针的距离」那条弧时要用它。
 */
export function cycleIndexOf(nodeIndex, cycleStart, cycleLength) {
  if (!Number.isInteger(nodeIndex)) return null
  if (!Number.isInteger(cycleStart) || !Number.isInteger(cycleLength) || cycleLength <= 0) {
    return null
  }
  if (nodeIndex < cycleStart) return null
  return (nodeIndex - cycleStart) % cycleLength
}

/** 最大公约数。 */
export function gcd(x, y) {
  let a = Math.abs(x)
  let b = Math.abs(y)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

/**
 * 给定「快指针领先慢指针 gap 格」这个初始距离，判断能否相遇。
 *
 * 距离序列是 gap, gap-closing, gap-2·closing, …（模环长），能命中 0 当且仅当
 * `gcd(closing, 环长)` 整除 gap。
 *
 * 注意：在 Floyd 的标准设定下 gap = (a·closing) mod b，**永远**满足这个整除条件，
 * 所以这个函数在本题里恒为 true —— 它是给「两指针起始位置不同」那种变体用的。
 */
export function willMeet(gap, closing, cycleLength) {
  if (!Number.isInteger(gap) || !Number.isInteger(closing) || cycleLength <= 0) return false
  return gap % gcd(closing, cycleLength) === 0
}

export function buildCycleDetectSteps(options = {}) {
  // 注意不能写成 `options.values.length` 来判断 —— 那样「显式传了空数组」会被
  // 当成「没传」，静默换成演示链表。空链表是一个要单独走的分支。
  const values = Array.isArray(options.values)
    ? options.values.slice()
    : DEFAULT_VALUES.slice()
  const n = values.length

  const fastStep =
    Number.isInteger(options.fastStep) && options.fastStep >= 1 ? options.fastStep : 2
  const closing = fastStep - 1

  const rawStart = options.cycleStart === undefined ? DEFAULT_CYCLE_START : options.cycleStart
  const hasCycle = Number.isInteger(rawStart) && rawStart >= 0 && rawStart < n
  const cycleStart = hasCycle ? rawStart : null
  const b = hasCycle ? n - cycleStart : 0
  const cycle = hasCycle ? { start: cycleStart, length: b } : null

  const steps = []
  const snap = (phase, desc, extra = {}) =>
    steps.push({
      phase,
      desc,
      slow: null,
      fast: null,
      gap: null,
      // 每帧一份新对象 —— 共享同一个 cycle 引用的话，渲染层或测试改一帧会连带
      // 改掉所有帧（这个坑被「快照互相独立」那条单测抓到过）。
      cycle: cycle ? { ...cycle } : null,
      fastStep,
      closing,
      steps: 0,
      met: false,
      done: false,
      ...extra,
    })

  if (n === 0) {
    snap('end', '链表是空的，连头节点都没有 —— 不存在环，返回 `false`。', { done: true })
    return steps
  }

  const next = (i) => {
    if (!Number.isInteger(i) || i >= n) return null
    if (i + 1 < n) return i + 1
    return hasCycle ? cycleStart : null
  }

  const label = (i) => (Number.isInteger(i) && i >= 0 && i < n ? String(values[i]) : '∅')

  /** 两者都在环上时，快指针沿环前进方向到慢指针还差几格。 */
  const gapOf = (s, f) => {
    if (!hasCycle) return null
    const cs = cycleIndexOf(s, cycleStart, b)
    const cf = cycleIndexOf(f, cycleStart, b)
    if (cs === null || cf === null) return null
    return (cs - cf + b) % b
  }

  let slow = 0
  let fast = 0

  const speedNote =
    closing <= 0
      ? `**两个指针速度一样，相对速度是 0** —— 它们会永远保持这个距离，不可能相遇。`
      : `快指针每步比慢指针多走 ${closing} 格 —— 这个相对速度恒定不变，是后面一切的起点。`

  snap(
    'init',
    `慢指针和快指针都站在头节点 ${label(0)}。快指针每步走 **${fastStep} 格**、慢指针走 1 格，` +
      speedNote,
    { slow, fast, steps: 0 },
  )

  if (closing <= 0) {
    snap(
      'end',
      `相对速度是 0，两指针永远同步前进，距离不会变 —— 不相遇。` +
        `所以快指针**至少要走 2 步**，这是「一定相遇」的第一道门槛。`,
      { slow, fast, done: true },
    )
    return steps
  }

  // 步数上限。closing = 1 时最多 a + b - 1 步；closing ≥ 2 只会更早（见文件头推导）。
  const cap = 2 * n + 8
  // 跳出循环的原因，决定收尾那帧说什么 —— 别把「没环」这种正常路径报成异常。
  let reason = 'cap'

  for (let k = 1; k <= cap; k += 1) {
    let f = fast
    for (let s = 0; s < fastStep && f !== null; s += 1) f = next(f)
    fast = f
    slow = next(slow)

    if (slow === null && fast === null) {
      reason = 'fell-off'
      break
    }

    const gap = gapOf(slow, fast)

    if (slow !== null && slow === fast) {
      // 相遇。快指针比慢指针多走的格数 = k·closing，它必然是环长 b 的整数倍。
      const why =
        closing === 1
          ? `相对速度是 1，所以「快指针沿环前进方向到慢指针的距离」每步**恰好减 1**；` +
            `它是在模 ${b} 的意义下减 1 的，必然依次经过 ${b - 1}、…、1、0 —— ` +
            `所以**一定相遇**，慢指针进环后最多 ${b - 1} 步。`
          : `相对速度是 ${closing}，距离每步减 ${closing}；它能减到 0，` +
            `是因为慢指针进环那一刻的距离恰好是 gcd(${closing}, ${b}) = ` +
            `${gcd(closing, b)} 的倍数。`
      snap(
        'met',
        `两者在节点 ${label(slow)} **相遇**。走了 ${k} 步，快指针比慢指针多走了 ` +
          `${k * closing} 格，正好是环长 ${b} 的整数倍 —— 这是相遇的代数原因。${why}`,
        { slow, fast, gap, steps: k, met: true, done: true },
      )
      return steps
    }

    if (fast === null) {
      reason = 'fell-off'
      break
    }

    // 三种处境要分开说，否则「快指针已经进环了」在两者都还在直段时会说错
    let where
    if (gap !== null) {
      where =
        `两者都在环上。快指针沿环前进方向到慢指针还差 **${gap} 格**，` +
        `比上一步少了 ${closing} —— 只要相对速度是 1，这个数每步必然减 1。`
    } else if (hasCycle && fast >= cycleStart) {
      where =
        `慢指针还在直段（第 ${slow + 1} 个节点），快指针已经进环了 —— ` +
        `慢指针没进环之前，两者不可能相遇。`
    } else {
      where =
        `两者都还在直段，快指针只是领先慢指针 ${fast - slow} 格，` +
        `距离还没有被环长约束住。`
    }

    snap('move', `慢指针到 ${label(slow)}、快指针到 ${label(fast)}。${where}`, {
      slow,
      fast,
      gap,
      steps: k,
    })
  }

  if (reason === 'fell-off') {
    snap(
      'end',
      `快指针走到了链表末尾（\`fast\` 或 \`fast.next\` 是空）—— **这条链表没有环**，返回 \`false\`。` +
        `一共走了 ${steps.length} 步：没有环时快指针每步走 ${fastStep} 格，最多 n / ${fastStep} 步就出界，` +
        `所以判环是 O(n) 时间、O(1) 空间。`,
      { slow, fast, done: true },
    )
    return steps
  }

  // 正常路径不会走到这里：closing ≥ 1 且两指针同起点时必然相遇（见文件头推导）。
  // 留一个兜底，免得真出问题时静默返回一个缺尾的 steps 数组。
  snap(
    'end',
    `走了 ${steps.length} 步仍未相遇，已超过步数上限 ${cap} —— 这是不该出现的情况，` +
      `请检查输入（两指针同起点时，任何 fastStep ≥ 2 都必然相遇）。`,
    { slow, fast, gap: gapOf(slow, fast), done: true },
  )
  return steps
}

export default buildCycleDetectSteps
