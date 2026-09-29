/**
 * calcIIISteps.js — 「基本计算器 III」(LC 772) 双栈解法的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 calcIII.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 772 = 224 加上 `*` `/` —— 一旦**优先级不再统一**，"来一个结一个"就失效了：
 * `2+3*4` 里的 `+` 不能急着算，得**等右边的乘法结账**。
 * 经典答案：**双栈调度场**（Dijkstra shunting-yard）。
 *   `nums` 存操作数，`ops` 存运算符（括号也进 ops，但只是个"挡板"）。
 * 核心纪律只有一条：新运算符来临时，把栈顶**所有优先级 >= 它**的运算符
 * 依次弹出结算（`>=` 保证同级左结合：`10-2-3` 从左算），再把自己压进去。
 * 于是 `ops` 栈**从底到顶优先级严格递增** —— 这条不变量是整个算法的骨架。
 * 括号：`(` 压栈当挡板（不参与优先级比较）；`)` 一路结算到 `(` 为止，
 * 括号内就变成一个数，回到外层继续受外层纪律管。
 * 整数除法**向零截断**：`Math.trunc(a / b)`（`Math.floor` 在负数上是坑：
 * `-3/2` 应得 `-1`，floor 给 `-2`）。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'number' | 'open' | 'operator' | 'close' | 'flush' | 'done'
 *   desc: string
 *   expr / tokens / pos / token   // 同 224
 *   nums: number[]                // 本帧动作后的数值栈，底 → 顶
 *   ops: string[]                 // 本帧动作后的运算符栈（含 '('），底 → 顶
 *   value: number|null            // number 帧：压入的值
 *   pushedOp: string|null         // operator 帧：结算完后压入的运算符
 *   applies: [{a, op, b, res}]    // 本帧内依次弹出的结算（按发生顺序）
 *   parenPopped: boolean          // close 帧：是否弹掉了 '('
 *   result: number|null           // done 帧的答案
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 每个 apply 自洽：res === a op b（除法 Math.trunc 向零截断）；
 *   2. 回放一致：上一帧的 (nums, ops) 依次执行本帧 applies
 *      （各弹 2 数 1 符、压 1 结果），再按帧型补 push value / pushedOp /
 *      弹 '('，必须精确得到本帧的 (nums, ops)；
 *   3. 优先级纪律：operator 帧里每个被结算的 op 满足 prec(op) >= prec(token)；
 *      结算完的 ops 栈顶（若是运算符）必 < prec(token)；
 *   4. 栈形不变量：**每个括号层内**（相邻 '(' 之间的段）运算符从底到顶优先级严格递增；
 *      跨层的运算符在栈里共存，段间无大小关系；
 *   5. flush 帧后 ops 为空、nums 恰剩 1 个 —— 即答案。
 */

const DEFAULT_EXPR = '2*(5+5*2)/3+(6/2+8)'

const PREC = { '+': 1, '-': 1, '*': 2, '/': 2 }

/** 词法切分：连续数字合成一个 token，空格丢弃，其余单字符成 token。 */
export function tokenizeCalcIII(expr) {
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

/** 弹一次结算：b、a 依次出 nums，op 出 ops，结果压回 nums。 */
function applyTop(nums, ops) {
  const op = ops.pop()
  const b = nums.pop()
  const a = nums.pop()
  let res
  if (op === '+') res = a + b
  else if (op === '-') res = a - b
  else if (op === '*') res = a * b
  else res = Math.trunc(a / b)
  nums.push(res)
  return { a, op, b, res }
}

export function buildCalcIIISteps(options = {}) {
  const expr =
    typeof options.expr === 'string' && options.expr.trim() !== ''
      ? options.expr
      : DEFAULT_EXPR
  const tokens = tokenizeCalcIII(expr)

  const steps = []
  const nums = []
  const ops = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      expr,
      tokens,
      pos: null,
      token: null,
      nums: nums.slice(),
      ops: ops.slice(),
      value: null,
      pushedOp: null,
      applies: [],
      parenPopped: false,
      result: null,
      done: phase === 'done',
      ...extra,
    })
  }

  const fmtApply = (ap) =>
    `${ap.a} ${ap.op} ${ap.b} = ${ap.res}`

  snap(
    'init',
    `表达式 \`${expr}\` 在 224 之上加了 \`*\` \`/\` —— **优先级不再统一**，` +
      `\`2+3*4\` 的 \`+\` 不能急着算，得**等右边乘法结账**。来一个结一个失效，` +
      `就需要 Dijkstra 的**双栈调度场**：\`nums\` 存操作数、\`ops\` 存运算符（\`(\` 也进 ops 当挡板）。` +
      `唯一纪律：新运算符来临，把栈顶所有**优先级 >= 它**的都弹出结算（\`>=\` 顺带保证同级左结合），再压自己。` +
      `于是 \`ops\` 里**每层括号内部**从底到顶优先级严格递增 —— 这条不变量就是算法骨架。` +
      `除法一律 \`Math.trunc\` **向零截断**。`,
    { nums: [], ops: [] },
  )

  for (let i = 0; i < tokens.length; i += 1) {
    const tok = tokens[i]

    if (tok >= '0' && tok <= '9') {
      const value = Number(tok)
      nums.push(value)
      snap(
        'number',
        `**\`${tok}\`**：数字直接进 \`nums\`（栈顶 \`${nums[nums.length - 1]}\`）。` +
          `数字永远不主动结算 —— **什么时候算，是运算符的事**。`,
        { pos: i, token: tok, value },
      )
      continue
    }

    if (tok === '(') {
      ops.push('(')
      snap(
        'open',
        `**\`(\`**：压进 \`ops\` 当**挡板** —— 它不比优先级、不参与结算，` +
          `作用只有一个：让后面进来的运算符在它面前停下，把括号内圈成独立小天地。`,
        { pos: i, token: tok },
      )
      continue
    }

    if (tok === ')') {
      const applies = []
      while (ops.length > 0 && ops[ops.length - 1] !== '(') {
        applies.push(applyTop(nums, ops))
      }
      ops.pop() // 弹掉 '('
      snap(
        'close',
        `**\`)\`**：一路结算到挡板为止：${applies.map(fmtApply).join('，')}。` +
          `再把 \`(\` 弹掉 —— 括号内已塌缩成 \`nums\` 顶上的**一个数**，` +
          `回到外层，继续受外层运算符的优先级纪律管。`,
        { pos: i, token: tok, applies, parenPopped: true },
      )
      continue
    }

    // 运算符：先结算栈顶所有优先级 >= tok 的，再压自己
    const applies = []
    while (
      ops.length > 0 &&
      ops[ops.length - 1] !== '(' &&
      PREC[ops[ops.length - 1]] >= PREC[tok]
    ) {
      applies.push(applyTop(nums, ops))
    }
    ops.push(tok)
    snap(
      'operator',
      `**\`${tok}\`**：先看栈顶 —— ` +
        (applies.length > 0
          ? `优先级 \`>= ${tok}\` 的先结账：${applies.map(fmtApply).join('，')}；`
          : `没有可结算的（栈空、或遇 \`(\` 挡板、或栈顶优先级更低）；`) +
        `然后 \`'${tok}'\` 压入 \`ops\`。` +
        (applies.length > 0
          ? `高优先级的先走，\`${tok}\` 排队 —— 这就是"优先级"在栈里的样子。`
          : `\`${tok}\` 在等它的右操作数（或更晚的更高优先级）。`),
      { pos: i, token: tok, applies, pushedOp: tok },
    )
  }

  // 收尾：剩余运算符从顶到底全部结算
  const flushApplies = []
  while (ops.length > 0) {
    flushApplies.push(applyTop(nums, ops))
  }
  snap(
    'flush',
    `**扫完收尾**：\`ops\` 里剩的运算符从栈顶到底依次结算：${flushApplies.map(fmtApply).join('，')}。` +
      `栈形不变量（从底到顶优先级严格递增）保证"从顶到底结算"这个顺序` +
      `**恰好就是正确的运算顺序** —— 低优先级的本来就沉在栈底，轮到最后。`,
    { applies: flushApplies },
  )

  const result = nums.length === 1 ? nums[0] : null
  snap(
    'done',
    `\`${expr}\` = **\`${result}\`**。双栈各司其职：\`nums\` 只进不出地攒操作数、` +
      `被结算时才吐结果；\`ops\` 靠**优先级比较**决定谁先结账。` +
      `三个记忆锚点：① 结算判据 \`栈顶优先级 >= 新运算符\`（\`>=\` = 左结合）；` +
      `② \`(\` 是挡板、\`)\` 结算到挡板；③ 除法 \`Math.trunc\` 向零截断，\`floor\` 在负数上是坑。`,
    { result, done: true },
  )

  return steps
}
