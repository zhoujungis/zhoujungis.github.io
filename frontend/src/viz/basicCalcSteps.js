/**
 * basicCalcSteps.js — 「基本计算器」(LC 224) 单栈解法的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 basicCalc.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 224 只有 `+` `-` 两种运算符 —— **同级、左结合**，所以根本不需要"优先级"这套机器：
 * 每个数字前面挂一个符号 `sign`，从左到右一路累加就行。
 * 唯一的复杂度来自**括号**：看到 `(` 时，括号里面是一个独立的小表达式，
 * 但它的值要**乘上括号外的符号**再并回外面的累加和。
 * 于是栈里存的不是数字，而是**括号上下文** `{外面的累计值, 括号外的符号}`：
 *   `(`：把当前 (result, sign) 压栈，进括号"重启"一个干净的累加器；
 *   `)`：括号内算完得 inner，弹栈合并 `result = 外层result + 外层sign * inner`。
 * 这正是 LC 20 的"括号配对"长了算术能力：栈依旧存"还没闭合的上一层"，
 * 只不过那层从"等哪个右括号"升级成了"等一个数值"。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'number' | 'sign' | 'open' | 'close' | 'done'
 *   desc: string
 *   expr: string            // 原始表达式
 *   tokens: string[]        // 词法切分结果（数字是整串，如 '12'）
 *   pos: number|null        // 本帧消费的 token 下标
 *   token: string|null      // 本帧消费的 token
 *   result: number          // 本帧动作**之后**的当前层累计值
 *   prev: number            // 本帧动作**之前**的累计值（帧内自洽校验用）
 *   sign: 1 | -1            // 本帧之后的符号（number 帧即贡献它的符号）
 *   stack: [{result, sign}] // 括号上下文栈，底 → 顶
 *   value: number|null      // number 帧：解析出的数值
 *   contribution: number|null // number 帧：sign * value
 *   pushed: {result, sign}|null // open 帧：压入的上下文
 *   popped: {result, sign}|null // close 帧：弹出的上下文
 *   inner: number|null      // close 帧：括号内算完的值
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. number 帧：result === prev + contribution 且 contribution === sign * value；
 *   2. sign 帧：result 不变，sign === (token === '+' ? 1 : -1)；
 *   3. open 帧：prev === pushed.result，帧后 result === 0、sign === 1、栈 +1；
 *   4. close 帧：prev === inner，result === popped.result + popped.sign * inner，栈 -1；
 *   5. 跨帧：每个 close 弹出的上下文 === 最近一个未配对 open 压入的（LIFO）；
 *      括号深度全程 >= 0，done 帧为 0。
 */

const DEFAULT_EXPR = '1 + 2 - (3 + 4) - 5'

/** 词法切分：连续数字合成一个 token，空格丢弃，其余单字符成 token。 */
export function tokenizeCalc(expr) {
  const out = []
  let i = 0
  while (i < expr.length) {
    const c = expr[i]
    if (c === ' ') {
      i += 1
      continue
    }
    if (c >= '0' && c <= '9') {
      let j = i
      while (j < expr.length && expr[j] >= '0' && expr[j] <= '9') j += 1
      out.push(expr.slice(i, j))
      i = j
      continue
    }
    out.push(c)
    i += 1
  }
  return out
}

export function buildBasicCalcSteps(options = {}) {
  const expr =
    typeof options.expr === 'string' && options.expr.trim() !== ''
      ? options.expr
      : DEFAULT_EXPR
  const tokens = tokenizeCalc(expr)

  const steps = []
  let result = 0
  let sign = 1
  const stack = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      expr,
      tokens,
      pos: null,
      token: null,
      result,
      prev: result,
      sign,
      stack: stack.map((s) => ({ ...s })),
      value: null,
      contribution: null,
      pushed: null,
      popped: null,
      inner: null,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `表达式 \`${expr}\` 只含数字、\`+\`、\`-\`、括号 —— **没有优先级要处理**（加减同级、左结合）。` +
      `所以不用双栈、不用调度场：一个累计值 \`result\`、一个符号 \`sign\` 从左到右扫就够。` +
      `唯一的麻烦是**括号**：\`-\`(3+4)\` 里整个括号要**乘以前面的负号**并回外层。` +
      `办法：看到 \`(\` 就把「**外层累计值 + 括号外符号**」这对上下文压栈、进括号重启累加器；` +
      `看到 \`)\` 弹栈合并 \`result = 外层result + 外层sign * 括号内值\`。` +
      `这就是 LC 20 的括号配对长了算术能力 —— 栈照旧存"没闭合的上一层"，只是那层从"等哪个右括号"升级成"等一个数值"。`,
    { result: 0, prev: 0, sign: 1, stack: [] },
  )

  for (let i = 0; i < tokens.length; i += 1) {
    const tok = tokens[i]

    if (tok >= '0' && tok <= '9') {
      const value = Number(tok)
      const contribution = sign * value
      const prev = result
      result += contribution
      snap(
        'number',
        `**\`${tok}\`**：数字带着当前符号入账 —— \`result += sign * ${value}\` = \`${prev}\` + \`${contribution}\` = \`${result}\`。` +
          `同级左结合意味着数字**没有资格等待**：符号已定，立刻结算进累计值。`,
        { pos: i, token: tok, prev, value, contribution },
      )
      continue
    }

    if (tok === '+' || tok === '-') {
      sign = tok === '+' ? 1 : -1
      snap(
        'sign',
        `**\`${tok}\`**：只是给**下一个数字**登记符号 \`sign = ${sign}\`，累计值不动（\`${result}\`）。` +
          `加减同级，所以这个符号不需要和任何"栈顶运算符"比优先级 —— 直接覆盖即可。`,
        { pos: i, token: tok },
      )
      continue
    }

    if (tok === '(') {
      const pushed = { result, sign }
      stack.push({ result, sign })
      const prev = result
      result = 0
      sign = 1
      snap(
        'open',
        `**\`(\`**：进入新括号层。把上下文 \`{result: ${pushed.result}, sign: ${pushed.sign > 0 ? '+1' : '-1'}}\` 压栈 —— ` +
          `记的是"**外层已累计多少**"和"**这个括号整体该乘什么符号**"。` +
          `然后重启一个干净的累加器：\`result = 0\`、\`sign = +1\`。`,
        { pos: i, token: tok, prev, pushed },
      )
      continue
    }

    if (tok === ')') {
      const inner = result
      const popped = stack.pop()
      const prev = result
      result = popped.result + popped.sign * inner
      snap(
        'close',
        `**\`)\`**：括号内算完，\`inner = ${inner}\`。弹栈合并：` +
          `\`result = ${popped.result} + (${popped.sign > 0 ? '+' : '-'}1) * ${inner} = ${result}\` —— ` +
          `括号作为一个**整体数值**、乘上括号外的符号，并回外层累计值。一层上下文就此闭合。`,
        { pos: i, token: tok, prev, inner, popped },
      )
      continue
    }

    snap('sign', `未知 token \`${tok}\`，跳过。`, { pos: i, token: tok })
  }

  snap(
    'done',
    `扫完：\`${expr}\` = **\`${result}\`**。全程只有一个累计值 + 一个符号，` +
      `栈仅在括号进出时动 —— 空间 \`O(括号嵌套深度)\`，时间 \`O(n)\`。` +
      `两个要点：① 加减同级左结合，数字来一个结一个，**不需要运算符栈**；` +
      `② 栈存的不是中间结果本身，是"**外层欠账**"：外层累计 + 括号符号，闭合时一并清算。`,
    { done: true },
  )

  return steps
}
