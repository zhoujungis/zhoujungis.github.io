/**
 * minStackSteps.js — 「最小栈」(LC 155) 辅助栈解法的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 minStack.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * push / pop / top 都是栈的本职工作，唯独 **getMin 要求 O(1)** ——
 * 栈只能看到栈顶，最小值却可能在任何一层。想 O(1) 拿到最小值，
 * 就必须**提前把每一层的最小值记下来**：最小值不是"当前状态"，是**历史**。
 *
 * 做法：**辅助栈（同步栈）**。主栈每进一个元素 x，辅助栈同步记录
 * "x 入栈那一刻，整个栈的最小值"。于是辅助栈顶恒等于主栈全体的最小值 ——
 * getMin 就是 O(1) 读辅助栈顶。pop 时两栈一起弹，**旧的最小值自动恢复** ——
 * 这正是"为什么最小值必须按层存"：pop 之后要回到过去。
 *
 * 判据是 `<=` 而不是 `<`：相等的当前最小值也要再压一份。
 * 否则 push(2), push(2), pop 之后辅助栈提前弹空，getMin 就错了（见 9.1）。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'push' | 'getMin' | 'pop' | 'top' | 'done'
 *   desc: string
 *   ops: [{op, val?}]       // 操作序列（默认 = LeetCode 官方示例）
 *   opIdx: number|null      // 本帧执行的操作下标
 *   main: number[]          // 主栈，底 → 顶
 *   mins: number[]          // 辅助栈，底 → 顶（非增：mins[t] <= mins[t-1]）
 *   minPushed: boolean      // push 帧：本值是否同步压入辅助栈
 *   popped: number|null     // pop 帧：主栈弹出的值
 *   minPopped: number|null  // pop 帧：辅助栈同步弹出的值（没弹则 null）
 *   result: number|null     // getMin / top 帧的返回值
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 主栈非空时，mins 栈顶 === min(main)（辅助栈顶恒为全栈最小值）；
 *   2. mins 从底到顶**非增**（每次压入的都是"当时及以后"的最小值）；
 *   3. len(mins) <= len(main)（辅助栈是主栈的"抽样历史"，不是复制品）。
 */

const DEFAULT_OPS = [
  { op: 'push', val: -2 },
  { op: 'push', val: 0 },
  { op: 'push', val: -3 },
  { op: 'getMin' },
  { op: 'pop' },
  { op: 'top' },
  { op: 'getMin' },
]

const OP_LABEL = {
  push: (v) => `push(${v})`,
  pop: () => 'pop()',
  top: () => 'top()',
  getMin: () => 'getMin()',
}

export function buildMinStackSteps(options = {}) {
  const ops = Array.isArray(options.ops) && options.ops.length > 0
    ? options.ops.map((o) => ({ ...o }))
    : DEFAULT_OPS.map((o) => ({ ...o }))

  const steps = []
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      ops,
      opIdx: null,
      main: main.slice(),
      mins: mins.slice(),
      minPushed: false,
      popped: null,
      minPopped: null,
      result: null,
      done: phase === 'done',
      ...extra,
    })
  }

  const main = []
  const mins = []

  snap(
    'init',
    `设计一个栈，在 \`push\` / \`pop\` / \`top\` 之外还要支持 \`getMin\` —— ` +
      `取栈内**最小元素**，且 \`getMin\` 必须是 \`O(1)\`。` +
      `难点：栈只能看到栈顶，最小值可能埋在任意一层；每次现扫是 \`O(n)\`。` +
      `思路：**最小值是历史，必须按层存** —— 开一个辅助栈，` +
      `主栈每进一个元素，辅助栈同步记下"这一刻全栈的最小值"。` +
      `于是辅助栈顶恒等于全栈最小值，\`getMin\` 直接读栈顶；` +
      `\`pop\` 时两栈一起弹，**旧的最小值自动恢复**。` +
      `操作序列：\`${ops.map((o) => OP_LABEL[o.op](o.val)).join(' → ')}\`。`,
    { main: [], mins: [] },
  )

  for (let i = 0; i < ops.length; i += 1) {
    const o = ops[i]

    if (o.op === 'push') {
      const x = Number(o.val)
      const before = mins.length > 0 ? mins[mins.length - 1] : null
      const minPushed = mins.length === 0 || x <= before
      main.push(x)
      if (minPushed) mins.push(x)
      const after = mins[mins.length - 1]
      snap(
        'push',
        `**\`push(${x})\`**：主栈压入 \`${x}\`。辅助栈判据 \`x <= 当前最小值\`${before === null ? '（辅助栈为空）' : `（栈顶 \`${before}\`）`}：` +
          (minPushed
            ? `\`${x}\` ${before === null ? '是第一个元素' : `不比当前最小值 \`${before}\` 大`} —— 压入辅助栈，` +
              `记录"**${x} 入栈这一刻**，全栈最小值是 \`${after}\`"。`
            : `\`${x} > ${before}\`，它入栈后最小值没变 —— 辅助栈**不压**（留空档）。` +
              `此刻全栈最小值仍是 \`${after}\`。`) +
          `主栈（底→顶）\`[${main.join(', ')}]\`，辅助栈 \`[${mins.join(', ')}]\`。`,
        { opIdx: i, minPushed, result: null },
      )
      continue
    }

    if (o.op === 'pop') {
      if (main.length === 0) {
        snap('pop', `**\`pop()\`**：栈已空，无操作。`, { opIdx: i })
        continue
      }
      const popped = main.pop()
      let minPopped = null
      if (mins.length > 0 && mins[mins.length - 1] === popped) {
        minPopped = mins.pop()
      }
      const nowMin = mins.length > 0 ? mins[mins.length - 1] : null
      snap(
        'pop',
        `**\`pop()\`**：主栈弹出栈顶 \`${popped}\`。` +
          (minPopped !== null
            ? `它**正是**辅助栈顶 \`${minPopped}\`（说明它入栈时就是当时的最小值）—— 两栈同步弹出，` +
              `栈里**恢复出更早的最小值 \`${nowMin}\`** —— 这就是"按层存历史"的意义：` +
              `pop 之后要回到过去，旧最小值必须本来就存着。`
            : `\`${popped}\` 不是当前最小值（辅助栈顶是 \`${mins[mins.length - 1]}\`），辅助栈**不动** —— ` +
              `它入栈时就没压过，弹它不影响最小值。`) +
          `主栈 \`[${main.join(', ')}]\`，辅助栈 \`[${mins.join(', ')}]\`。`,
        { opIdx: i, popped, minPopped },
      )
      continue
    }

    if (o.op === 'top') {
      const result = main.length > 0 ? main[main.length - 1] : null
      snap(
        'top',
        `**\`top()\`**：读主栈栈顶 \`${result}\`（空栈返回 \`null\`）。栈的本职工作，\`O(1)\`。`,
        { opIdx: i, result },
      )
      continue
    }

    if (o.op === 'getMin') {
      const result = mins.length > 0 ? mins[mins.length - 1] : null
      snap(
        'getMin',
        `**\`getMin()\` → \`${result}\`**：直接读辅助栈顶 —— \`O(1)\`。` +
          `辅助栈顶恒等于 \`min(主栈全体)\`（不变量，见说明），所以这一步**不需要扫主栈**。`,
        { opIdx: i, result },
      )
      continue
    }

    snap('push', `未知操作 \`${o.op}\`，跳过。`, { opIdx: i })
  }

  const finalMin = mins.length > 0 ? mins[mins.length - 1] : null
  snap(
    'done',
    `七个操作走完：主栈 \`[${main.join(', ')}]\`，辅助栈 \`[${mins.join(', ')}]\`，当前最小值 \`${finalMin}\`。` +
      `四个操作全 \`O(1)\`，代价是辅助栈的 \`O(n)\` 空间 —— 用空间换"记住历史"。` +
      `两个要点：① 辅助栈存的是"**每一刻**的最小值"，不是"最小值本身"，所以 pop 能恢复过去；` +
      `② 压入判据是 \`<=\`（相等也压）—— 用 \`<\` 会在重复最小值 pop 后提前弹空。`,
    { done: true },
  )

  return steps
}
