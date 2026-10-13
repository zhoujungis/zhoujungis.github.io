/**
 * eliminateSum10OrderSteps.js — 「消除顺序不影响结果」的双路线推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 eliminateSum10Order.js。
 *
 * ── 为什么要单独做一支动画 ────────────────────────────────────────────────
 * 栈模拟只能给出**一个**结果；面试官真正想追问的是"换个消除顺序，结果会不会变"。
 * 这题的答案是"不会"，理由是系统**合流**：每一步恰好删 2 个字符（终止），
 * 而唯一的重叠形态是临界对 `a b a`（`a + b = 10`）—— 先消左边那对、还是先消
 * 右边那对，剩下的都是 `a`。于是不管按什么顺序消，最后都停在同一个不可约形上。
 *
 * 这支动画让两条**不同的**消法并排跑：路线 A 每次消最左边那一对、路线 B 每次消
 * 最右边那一对。默认输入 `191191` 下，两条路线的中途形态确实不同
 * （`1191` vs `1911`），**终点却完全一样**（`11`）。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'step' | 'done'
 *   desc: string
 *   s, chars: string[], n
 *   turn: 'A' | 'B' | null      // 本帧是哪条路线走了一步
 *   a / b: {                    // 两条路线各自的当前状态
 *     alive: number[]           //   还没被消掉的字符（原串下标，升序）
 *     removed: [number, number]|null  // 走到这一状态时消掉的那一对
 *     done: boolean             //   已经消无可消
 *     steps: number             //   已消除对数
 *   }
 *   converged: boolean|null     // done 帧：两条路线终点是否相同
 *   result: string|null         // done 帧：共同终点（相同才有值）
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 每帧的 alive 都是升序、且是上一帧 alive 去掉一对（或不变）；
 *   2. removed 的两个下标相邻且互补（和为 10）；
 *   3. steps === 初始长度 - alive.length 的一半；
 *   4. 终态不可约（alive 里没有相邻互补对），且两路线终态字符串相同。
 */

const DEFAULT_S = '191191'

function pairSum(a, b) {
  return a.charCodeAt(0) - 48 + (b.charCodeAt(0) - 48)
}

/** 一条路线：每次消 leftmost ? 最左那一对 : 最右那一对，直到消无可消。 */
function route(chars, leftmost) {
  const states = []
  let alive = chars.map((_, i) => i)
  let removed = null

  for (;;) {
    const pairs = []
    for (let k = 0; k + 1 < alive.length; k += 1) {
      if (pairSum(chars[alive[k]], chars[alive[k + 1]]) === 10) pairs.push(k)
    }
    const done = pairs.length === 0
    states.push({ alive: alive.slice(), removed, done, steps: states.length })
    if (done) break

    const pick = leftmost ? pairs[0] : pairs[pairs.length - 1]
    removed = [alive[pick], alive[pick + 1]]
    alive = alive.filter((_, idx) => idx !== pick && idx !== pick + 1)
  }

  return states
}

const aliveStr = (chars, state) => state.alive.map((k) => chars[k]).join('')

export function buildEliminateSum10OrderSteps(options = {}) {
  const s = typeof options.s === 'string' ? options.s : DEFAULT_S
  const chars = Array.from(s)
  const n = chars.length

  const statesA = route(chars, true)
  const statesB = route(chars, false)

  const frames = []
  const snap = (phase, desc, extra = {}) => {
    frames.push({
      phase,
      desc,
      s,
      chars,
      n,
      turn: null,
      a: statesA[0],
      b: statesB[0],
      converged: null,
      result: null,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `同一个串 \`${s}\`，两条路线并排跑：**A 每次消最左边那一对**，**B 每次消最右边那一对**。` +
      `这两条路线一开始就分道扬镳（可消的对互相重叠 —— 比如开头的 \`191\`，` +
      `先消左边的 \`1 9\` 还是先消右边的 \`9 1\`，剩下的形态不同）。` +
      `题面能放心地问"最后剩下的串"，靠的就是两条路线**最后会撞在同一个地方**。`,
  )

  let ai = 0
  let bi = 0
  while (ai < statesA.length - 1 || bi < statesB.length - 1) {
    if (ai < statesA.length - 1) {
      ai += 1
      const st = statesA[ai]
      const [x, y] = st.removed
      snap(
        'step',
        `**路线 A**（消最左）：消掉 \`${chars[x]}\`（下标 ${x}）和 \`${chars[y]}\`（下标 ${y}）—— ` +
          `\`${chars[x]} + ${chars[y]} = 10\`。剩下的串是 \`${aliveStr(chars, st)}\`。` +
          `注意它出现的**位置**：被消掉的两个字符不在串尾，消完两边立刻接上。`,
        { turn: 'A', a: st, b: statesB[bi] },
      )
    }
    if (bi < statesB.length - 1) {
      bi += 1
      const st = statesB[bi]
      const [x, y] = st.removed
      snap(
        'step',
        `**路线 B**（消最右）：消掉 \`${chars[x]}\`（下标 ${x}）和 \`${chars[y]}\`（下标 ${y}）—— ` +
          `\`${chars[x]} + ${chars[y]} = 10\`。剩下的串是 \`${aliveStr(chars, st)}\`。` +
          `同一时刻 A 停在中途形态 \`${aliveStr(chars, statesA[ai])}\` —— ` +
          `**两条路线的中途形态并不一样**。`,
        { turn: 'B', a: statesA[ai], b: st },
      )
    }
  }

  const lastA = statesA[statesA.length - 1]
  const lastB = statesB[statesB.length - 1]
  const resA = aliveStr(chars, lastA)
  const resB = aliveStr(chars, lastB)
  const converged = resA === resB

  snap(
    'done',
    converged
      ? `两条路线都消无可消了：**A 停在 \`${resA}\`，B 停在 \`${resB}\` —— 完全一样**。` +
        `A 消了 \`${lastA.steps}\` 对、B 消了 \`${lastB.steps}\` 对，次数相同、终点相同。` +
        `这不是巧合：每一步恰好删 2 个字符（终止），而唯一会互相干扰的形态是临界对 ` +
        `\`a b a\`（\`a + b = 10\`）—— 先消左边那对还是右边那对，剩下的都是 \`a\`。` +
        `所以"最后剩下的串"没有歧义，"最短剩余长度"就是 \`${resA.length}\`，栈模拟给的就是它。`
      : `两条路线停在了不同的串上：A = \`${resA}\`、B = \`${resB}\` —— ` +
        `说明这个规则**不合流**，题目就得改成"求最短"的搜索问题了。`,
    { turn: null, a: lastA, b: lastB, converged, result: converged ? resA : null, done: true },
  )

  return frames
}

export { DEFAULT_S }
