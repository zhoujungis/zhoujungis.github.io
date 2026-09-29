/**
 * bracketsSteps.js — 「有效的括号」(LC 20) 栈解法的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 brackets.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * **栈不是选出来的，是被括号结构逼出来的**：最内层尚未闭合的左括号，
 * 必须先被闭合 —— 后开先闭，天然 LIFO。所以遇左括号记下"我在等什么"，
 * 遇右括号就去问栈顶"你是不是我等的那个"。
 *
 * 三种失败模式，各自对应代码里一处检查：
 *   1. **类型不匹配** —— 右括号与栈顶不是一对（"(]"）；
 *   2. **右括号没人接** —— 遇到右括号时栈已经空了（"())"）；
 *   3. **左括号没闭合** —— 扫完了栈里还留着（"(()"）。
 * 判有效 = 三类都没触发 **且** 最后栈为空。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'push' | 'match' | 'mismatch' | 'unmatched' | 'done'
 *   desc: string
 *   s, chars: string[], n
 *   i: number|null           // 当前字符下标
 *   ch: string|null          // 当前字符
 *   stack: string[]          // 当前栈（左括号，栈底在前）
 *   expect: string|null      // 右括号时期望的闭合符（左括号时为 null）
 *   popped: string|null      // 本帧弹出的栈顶（match / mismatch）
 *   verdict: null | 'valid' | 'mismatch' | 'unmatched' | 'leftover'
 *   done: boolean
 *
 * ⚠️ 每帧 = 恰好处理一个字符；push/match 后栈内容即该帧结局。
 * 逐帧校验：栈里只可能有左括号、match 帧弹出的必须是 expect 那个。
 */

const DEFAULT_S = '{[()]}'

const PAIRS = { '(': ')', '[': ']', '{': '}' }
const OPENS = new Set(Object.keys(PAIRS))

export function buildBracketsSteps(options = {}) {
  const s = typeof options.s === 'string' ? options.s : DEFAULT_S
  const chars = Array.from(s)
  const n = chars.length

  const steps = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      s,
      chars,
      n,
      i: null,
      ch: null,
      stack: [],
      expect: null,
      popped: null,
      verdict: null,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `给了括号串 \`${s}\`（\`${n}\` 个字符）。判断左括号是否被**正确类型**的右括号闭合、` +
      `且嵌套不乱。括号的结构决定了**最近打开的必须先关闭** —— 后开先闭就是 LIFO，` +
      `所以栈不是"想到用栈"，而是"括号天然就是栈"。` +
      `做法：遇左括号入栈（记下我在等什么），遇右括号就问栈顶"你是不是我等的那个"。` +
      `失败有三种：类型不匹配（\`"(]"\`）、右括号没人接（\`"())"\`，栈已空）、左括号没闭合（\`"(()"\`，栈有剩）。`,
  )

  const stack = []

  for (let i = 0; i < n; i += 1) {
    const ch = chars[i]

    if (OPENS.has(ch)) {
      stack.push(ch)
      snap(
        'push',
        `\`s[${i}] = "${ch}"\` 是左括号 —— **入栈**，记下"我在等 \`"${PAIRS[ch]}"\`"。` +
          `栈顶现在是 \`${ch}\`，它是**最内层尚未闭合**的那个 —— 下一个右括号必须先跟它配。`,
        { i, ch, stack: stack.slice(), expect: null },
      )
      continue
    }

    // 右括号
    if (stack.length === 0) {
      snap(
        'unmatched',
        `\`s[${i}] = "${ch}"\` 是右括号，但**栈是空的** —— 前面没有左括号在等它。` +
          `（失败模式二：右括号没人接，如 \`"())"\` 的最后一个 \`)\`。）即刻判无效，不用再看后面的字符。`,
        { i, ch, stack: stack.slice(), expect: null, verdict: 'unmatched' },
      )
      snap(
        'done',
        `**无效**：\`s[${i}] = "${ch}"\` 找不到匹配的左括号。` +
          `三种失败模式里的第二种 —— 右括号来时栈已空。`,
        { i, ch, stack: stack.slice(), verdict: 'unmatched', done: true },
      )
      return steps
    }

    const top = stack[stack.length - 1]
    const expect = PAIRS[top]
    if (expect === ch) {
      stack.pop()
      snap(
        'match',
        `\`s[${i}] = "${ch}"\` 是右括号 —— 栈顶 \`"${top}"\` 等的就是 \`"${expect}"\`，**配对成功，出栈**。` +
          (stack.length > 0
            ? `新的栈顶是 \`"${stack[stack.length - 1]}"\` —— 它成为"最内层尚未闭合"的那个。`
            : `栈空了 —— 目前为止全部闭合。`),
        { i, ch, stack: stack.slice(), expect, popped: top },
      )
    } else {
      snap(
        'mismatch',
        `\`s[${i}] = "${ch}"\` 是右括号，它要的是 \`"${ch}"\`，但栈顶 \`"${top}"\` 等的是 \`"${expect}"\` —— ` +
          `**类型不匹配**（失败模式一，如 \`"([)]"\` 里 \`)\` 撞上 \`[\`）。即刻判无效。`,
        { i, ch, stack: stack.slice(), expect, popped: null, verdict: 'mismatch' },
      )
      snap(
        'done',
        `**无效**：\`s[${i}] = "${ch}"\` 与栈顶 \`"${top}"\` 类型不匹配（栈顶在等 \`"${expect}"\`）。`,
        { i, ch, stack: stack.slice(), expect, verdict: 'mismatch', done: true },
      )
      return steps
    }
  }

  if (stack.length > 0) {
    snap(
      'done',
      `\`${n}\` 个字符扫完了，但**栈里还留着** \`${stack.map((c) => `"${c}"`).join('、')}\` —— ` +
        `失败模式三：左括号没闭合（如 \`"(()"\` 剩下的那个 \`(\`）。` +
        `栈非空即无效 —— 这是最容易漏的一处检查。`,
      { i: n - 1, stack: stack.slice(), verdict: 'leftover', done: true },
    )
    return steps
  }

  snap(
    'done',
    `\`${n}\` 个字符扫完，**栈也恰好空了** —— 每个左括号都被正确类型的右括号按后进先出的顺序闭合。**有效**。`,
    { i: n - 1, stack: stack.slice(), verdict: 'valid', done: true },
  )

  return steps
}
