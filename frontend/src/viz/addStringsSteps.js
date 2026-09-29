/**
 * addStringsSteps.js — 「字符串相加」(LC 415) 竖式加法解法的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 addStrings.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 不能转整数、没有大数类型 —— 把所有捷径排除掉，剩下的就是**小学列竖式**：
 * 从个位起，每一位算「两位数字 + 低位进位」，写下个位、把进位带上去。
 *
 *   "456"
 * +  "77"
 * ------
 *   "533"      6+7=13 写 3 进 1；5+7+1=13 写 3 进 1；4+0+1=5 写 5 进 0
 *
 * 三个实现要点（也是三个坑）：
 * 1. **对齐**：双指针从两个串的**末尾**（个位）出发；一侧走完后该侧补 0
 *    （`i >= 0 ? num1[i] - 48 : 0`），不是跳过；
 * 2. **循环条件是三连 or**：`i >= 0 || j >= 0 || carry > 0` —— 漏掉 carry
 *    会丢最高位（"999" + "1" 得 "000" 而不是 "1000"）；
 * 3. **结果低位在前**：push 生成的是从个位往高位，最后 reverse 再 join；
 *    用 unshift 每帧头插是 O(n^2)。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'digit' | 'done'
 *   desc: string
 *   num1, num2: string
 *   col: number          // 当前列号（0 = 最高位 … maxLen-1 = 个位）
 *   i, j: number|null    // 两串当前下标（< 0 表示该侧已走完，本帧补 0）
 *   digitA, digitB       // 本帧参与相加的两个数字（补零后）
 *   zeroA, zeroB: bool   // 该侧是否是补零
 *   carryIn              // 从低位带上来的进位
 *   sum                  // digitA + digitB + carryIn
 *   out                  // 写下的本位 = sum % 10
 *   carryOut             // 带上一位的进位 = sum >= 10 ? 1 : 0
 *   resLow: number[]     // 已写出的低位结果（低位在前，push 顺序）
 *   maxLen               // 较长串的长度（渲染层据此对齐格子）
 *   done: boolean
 *
 * ⚠️ 每帧 = 恰好处理一列（一次「加-写-进」决策），digitA/digitB/sum/out
 * 互相自洽，单测逐帧校验。
 */

const DEFAULT_NUM1 = '456'
const DEFAULT_NUM2 = '77'

export function buildAddStringsSteps(options = {}) {
  const num1 = typeof options.num1 === 'string' && options.num1.length > 0 ? options.num1 : DEFAULT_NUM1
  const num2 = typeof options.num2 === 'string' && options.num2.length > 0 ? options.num2 : DEFAULT_NUM2

  const steps = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      num1,
      num2,
      col: -1,
      i: null,
      j: null,
      digitA: 0,
      digitB: 0,
      zeroA: false,
      zeroB: false,
      carryIn: 0,
      sum: 0,
      out: 0,
      carryOut: 0,
      resLow: [],
      maxLen: Math.max(num1.length, num2.length),
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `给了两个字符串形式的非负整数：\`${num1}\` 和 \`${num2}\`。` +
      `题目禁止转整数、也没有大数类型 —— 这不是刁难，而是**排除法**：把「先转数字再算」的捷径全部排除，` +
      `剩下的就是**小学列竖式** —— 从个位起，每一位算「两位数字 + 低位进位」，写下个位、把进位带上去。` +
      `双指针 \`i\`、\`j\` 从两个串的**末尾**（个位）出发，指针不断左移对齐数位；` +
      `循环条件是**三连 or**：\`i >= 0 || j >= 0 || carry > 0\` —— 前两个管「还有数位没加」，` +
      `carry 管「最后还有进位要长出一位」。`,
  )

  let i = num1.length - 1
  let j = num2.length - 1
  let carry = 0
  const resLow = []
  const maxLen = Math.max(num1.length, num2.length)
  let stepNo = 0

  while (i >= 0 || j >= 0 || carry > 0) {
    stepNo += 1
    const col = maxLen - stepNo
    const a = i >= 0 ? num1.charCodeAt(i) - 48 : 0
    const b = j >= 0 ? num2.charCodeAt(j) - 48 : 0
    const zeroA = i < 0
    const zeroB = j < 0
    const sum = a + b + carry
    const out = sum % 10
    const carryOut = sum >= 10 ? 1 : 0
    resLow.push(out)

    const posName = colName(col, maxLen)
    const parts = []
    parts.push(`**${posName}（第 \`${stepNo}\` 列）**：`)
    parts.push(zeroA ? `\`0\`（补零，num1 已走完）` : `\`${a}\``)
    parts.push(` + `)
    parts.push(zeroB ? `\`0\`（补零，num2 已走完）` : `\`${b}\``)
    parts.push(` + 进位 \`${carry}\` = \`${sum}\``)
    if (sum >= 10) {
      parts.push(` —— 满十进一：**写下 \`${out}\`，进位 \`${carryOut}\` 带上一位**。`)
    } else {
      parts.push(` —— 不满十：**写下 \`${out}\`，进位归 \`${carryOut}\`**。`)
    }
    parts.push(i - 1 >= 0 || j - 1 >= 0 || carryOut > 0
      ? `指针左移：\`i → ${i - 1}\`，\`j → ${j - 1}\`。`
      : `两串都走完、进位也是 0 —— 循环终止。`)

    snap('digit', parts.join(''), {
      col,
      i,
      j,
      digitA: a,
      digitB: b,
      zeroA,
      zeroB,
      carryIn: carry,
      sum,
      out,
      carryOut,
      resLow: resLow.slice(),
    })

    i -= 1
    j -= 1
    carry = carryOut
  }

  const result = resLow.slice().reverse().join('')
  snap(
    'done',
    `所有列处理完，进位 \`0\`，循环停。结果低位在前（push 顺序就是从个位往高位），` +
      `**reverse 后 join 成字符串：答案 = "${result}"**。` +
      `回头看整个流程：每列只有一次「加-写-进」决策，时间 \`O(max(m, n))\`，` +
      `除结果串外**额外空间 O(1)**。` +
      `三个坑对照：一侧走完要**补 0** 而不是跳过；循环条件**漏掉 carry** 会丢最高位` +
      `（\`"999" + "1"\` 会得 \`"000"\`）；结果用 \`push\` + 末尾 \`reverse\`，` +
      `别用 \`unshift\` 头插（每帧 O(n)，整体 O(n^2)）。`,
    {
      col: -1,
      i: -1,
      j: -1,
      resLow: resLow.slice(),
      result,
      carryOut: 0,
    },
  )

  return steps
}

/** 列名：个位/十位/百位/千位，更高位用「10^k 位」。 */
function colName(col, maxLen) {
  const fromRight = maxLen - 1 - col
  const names = ['个位', '十位', '百位', '千位']
  if (fromRight < names.length) return names[fromRight]
  return `10^${fromRight} 位`
}
