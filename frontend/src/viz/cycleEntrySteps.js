/**
 * cycleEntrySteps.js — 「环形链表 II」(LeetCode 142) 找环入口的状态机。
 *
 * 纯函数，不碰 DOM。渲染层（cycleEntry.js）只负责把快照画成 SVG。
 *
 * ── 这个动画要证明的事 ────────────────────────────────────────────────────
 *
 * 设直段长 a（head 到入口的步数）、环长 b、相遇点距入口 x 步。
 *
 * 相遇那一刻，慢指针走了 a + x，快指针走了 2(a + x)，而快指针比慢指针多走的
 * 步数必然是环长的整数倍：
 *
 *     2(a + x) - (a + x) = a + x = m·b        (m 是某个正整数)
 *
 * 于是
 *
 *     a ≡ -x ≡ b - x  (mod b)
 *
 * 含义：**从 head 走 a 步到入口，从相遇点走 b - x 步也到入口，两者相差恰好整数圈。**
 *
 * 所以第二阶段的做法是：一个指针放回 head，另一个留在相遇点，**两者都改成每步
 * 走 1 格**。走满 a 步时，前者正好到入口，后者也正好（又）到入口 —— 相遇处即入口。
 *
 * 这个动画的可视化重点就是「两条路一样长」：左边 a 段、右边 b - x 段，
 * 两个剩余步数读数同步递减到 0。
 *
 * ⚠️ 这个解法**依赖相对速度是 1**。如果第一题用「快 3 慢 1」，只能推出
 * `2(a + x) = m·b`（closing = 2），环长为偶数时 a + x ≡ 0 (mod b) 不再成立，
 * 「回 head 同速前进」就找不到入口了。这是「快慢指针只能走 2 和 1」的真正理由之一。
 *
 * ── 一个 step 长这样 ─────────────────────────────────────────────────────
 *   {
 *     phase:      'meet' | 'walk' | 'found' | 'none',
 *     desc:       string,
 *     ptr1:       number,   // 从 head 出发的指针所在节点下标
 *     ptr2:       number,   // 从相遇点出发的指针所在节点下标
 *     walked:     number,   // 第二阶段已走步数
 *     remain1:    number,   // head → 入口 还差几步
 *     remain2:    number,   // 相遇点 → 入口 还差几步（已越过入口则按绕圈重算）
 *     passed2:    boolean,  // ptr2 是否已经越过入口（a > b - x 时会发生）
 *     entry:      number,   // 入口节点下标
 *     meetAt:     number,   // 第一阶段相遇点下标
 *     a, b, x, m: number,   // 直段长 / 环长 / 相遇点距入口 / a + x = m·b 里的 m
 *     done:       boolean,
 *   }
 */

import { buildCycleDetectSteps } from './cycleDetectSteps'

/** 文章里的演示链表：1→2→…→13，入口是 5（a = 4）、环长 9、相遇点是 10。 */
const DEFAULT_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
const DEFAULT_CYCLE_START = 4

export function buildCycleEntrySteps(options = {}) {
  const values = Array.isArray(options.values)
    ? options.values.slice()
    : DEFAULT_VALUES.slice()
  const n = values.length
  const rawStart = options.cycleStart === undefined ? DEFAULT_CYCLE_START : options.cycleStart

  const steps = []
  const snap = (phase, desc, extra = {}) =>
    steps.push({
      phase,
      desc,
      ptr1: null,
      ptr2: null,
      walked: 0,
      remain1: 0,
      remain2: 0,
      passed2: false,
      entry: null,
      meetAt: null,
      a: 0,
      b: 0,
      x: 0,
      m: 0,
      done: false,
      ...extra,
    })

  if (n === 0) {
    snap('none', '链表是空的，没有环，返回 `null`。', { done: true })
    return steps
  }

  // ── 第一阶段：直接复用 LC 141 的状态机找相遇点 ──────────────────────────
  // 复用而不是重写，是为了保证两个动画停在**同一个节点**上 —— 文章里前后呼应。
  const phase1 = buildCycleDetectSteps({ values, cycleStart: rawStart })
  const firstLast = phase1[phase1.length - 1]

  if (!firstLast.met) {
    snap(
      'none',
      `这条链表没有环（快指针已经走到末尾），所以 LC 142 直接返回 \`null\` —— ` +
        `入口根本不存在。`,
      { done: true },
    )
    return steps
  }

  const a = firstLast.cycle.start
  const b = firstLast.cycle.length
  const meetAt = firstLast.slow
  const x = (meetAt - a) % b
  const total = a + x
  const m = total / b
  const toEntry2 = b - x // ptr2 第一次到达入口要走的步数

  const label = (i) => (Number.isInteger(i) && i >= 0 && i < n ? String(values[i]) : '∅')
  const next = (i) => {
    if (!Number.isInteger(i) || i >= n) return null
    return i + 1 < n ? i + 1 : a
  }

  const syncNote =
    a === toEntry2
      ? `这里 a 恰好等于 b - x，所以两个指针会**同步**抵达入口。`
      : `注意 a = ${a} 而 b - x = ${toEntry2}，后者更小 —— ptr2 会先路过入口、` +
        `绕回来之后才和 ptr1 碰上。同余式只管「差整数圈」，不管谁先到。`

  snap(
    'meet',
    `第一阶段的终点：慢指针和快指针在节点 ${label(meetAt)} 相遇。设入口是 ` +
      `${label(a)}、直段长 \`a = ${a}\`、环长 \`b = ${b}\`、相遇点距入口 \`x = ${x}\`，` +
      `那么 \`a + x = ${total} = ${m} × b\`，也就是 \`a ≡ b - x (mod b)\`。` +
      `现在**把 ptr1 放回 head、ptr2 留在相遇点，两者都改成每步走 1 格**：` +
      `ptr1 要走到入口差 **${a} 步**，ptr2 沿环走到入口差 **${toEntry2} 步**。${syncNote}`,
    { ptr1: 0, ptr2: meetAt, walked: 0, remain1: a, remain2: toEntry2, entry: a, meetAt, a, b, x, m },
  )

  // a = 0 意味着头节点本身就是入口，ptr1 一开始就站在答案上。
  // （此时 Floyd 的相遇点也是入口，x = 0，所以 ptr1 和 ptr2 已经重合。）
  if (a === 0) {
    snap(
      'found',
      `**入口就是头节点 ${label(0)}。** 这里 a = 0，头节点本身就在环上 —— ` +
        `ptr1 一步都不用走，而相遇点也正好是入口（x = 0），所以两个指针一开始就重合。` +
        `LC 142 返回这个节点。`,
      { ptr1: 0, ptr2: meetAt, walked: 0, remain1: 0, remain2: 0, entry: 0, meetAt, a, b, x, m, done: true },
    )
    return steps
  }

  // ── 第二阶段：两者同速前进，走满 a 步 ────────────────────────────────────
  // a 步之后 ptr1 必然在入口；ptr2 走 a 步也必然落在入口（因为 a ≡ b - x (mod b)）。
  let p1 = 0
  let p2 = meetAt

  for (let k = 1; k <= a; k += 1) {
    p1 = next(p1)
    p2 = next(p2)
    const remain1 = a - k
    const remain2Raw = toEntry2 - k
    const passed2 = remain2Raw < 0
    const remain2 = passed2 ? ((remain2Raw % b) + b) % b : remain2Raw

    if (p1 === p2) {
      snap(
        'found',
        `**两个指针在节点 ${label(p1)} 相遇 —— 这就是环的入口。** 从 head 走了 ${k} 步，` +
          `从相遇点也走了 ${k} 步。回到那条同余式：a = ${a} 步到入口、b - x = ${toEntry2} 步` +
          `也到入口，两者相差 ${m > 1 ? `${m} 圈` : '零圈'}，所以它们必然在入口碰头。` +
          `LC 142 返回这个节点。`,
        {
          ptr1: p1,
          ptr2: p2,
          walked: k,
          remain1,
          remain2,
          passed2,
          entry: a,
          meetAt,
          a,
          b,
          x,
          m,
          done: true,
        },
      )
      return steps
    }

    snap(
      'walk',
      `走了 ${k} 步。ptr1 到 ${label(p1)}（离入口还差 **${remain1} 步**）、` +
        `ptr2 到 ${label(p2)}（离入口还差 **${remain2} 步**）。` +
        (passed2
          ? `注意 ptr2 已经**越过**了入口，它要再绕一圈回来 —— 但同余式保证它绕回入口的` +
            `那一刻，ptr1 也正好走到。`
          : `两个剩余步数**同步递减**，这是「两条路一样长」的直接体现。`),
      {
        ptr1: p1,
        ptr2: p2,
        walked: k,
        remain1,
        remain2,
        passed2,
        entry: a,
        meetAt,
        a,
        b,
        x,
        m,
      },
    )
  }

  // 兜底：正常情况下 a 步之后必然 found（见文件头推导）。
  snap(
    'found',
    `走了 ${a} 步仍未同时落在入口，这不该发生 —— 请检查输入。`,
    { ptr1: p1, ptr2: p2, walked: a, entry: a, meetAt, a, b, x, m, done: true },
  )
  return steps
}

export default buildCycleEntrySteps
