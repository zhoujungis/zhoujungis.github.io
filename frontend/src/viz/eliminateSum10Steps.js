/**
 * eliminateSum10Steps.js — 腾讯面经「相邻和为 10 消除」栈模拟的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 eliminateSum10.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 题面说"消除后两边接在一起继续检查"，听起来需要真的去改字符串。栈的视角把它
 * 变成一行：**栈里存的就是当前串约化后的形态**，新数字只看栈顶 —— 栈顶是"左边
 * 最后一个还没被消掉的数字"，两者互补（和为 10）就一起消失，否则新数字入栈。
 * 弹出栈顶之后，新的栈顶天然就是"左边接过来的那个数字"，不需要任何拼接动作。
 *
 * 为什么用 `if` 而不是 `while`：一个数字最多消掉一个栈顶 —— 消掉之后它自己也
 * 消失了，不可能再跟新栈顶配对。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'push' | 'pop' | 'done'
 *   desc: string
 *   s, chars: string[], n
 *   i: number|null                 // 本帧扫到的下标（init/done 为 null 或 n-1）
 *   ch: string|null                // 本帧的字符
 *   topIdx: number|null            // 本帧看到的栈顶（原串下标）；push 帧是"入栈前的栈顶"
 *   topCh: string|null             // 栈顶字符
 *   stack: number[]                // 本帧处理完之后的栈（存原串下标，底 → 顶）
 *   eliminated: [number, number]|null   // 本帧消掉的两个原串下标
 *   gone: number[]                 // 累计被消掉的原串下标（升序）
 *   pops: number                   // 累计消除对数
 *   result: string|null            // 仅 done 帧给最终串
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. stack 严格递增（它存的是"当前串约化后的形态"，位置自然递增）；
 *   2. stack.length === (i + 1) - 2 * pops（每消一对少 2 个字符）；
 *   3. 处理完前缀 chars[0..i] 后，stack 里的字符 === 该前缀独立约化的结果；
 *   4. stack 里**不存在相邻互补对**（不可再约）；
 *   5. gone ∪ stack === 已处理的下标集合，且 gone.length === 2 * pops。
 */

const DEFAULT_S = '55128921'

const COMPLEMENT = { 1: 9, 2: 8, 3: 7, 4: 6, 5: 5, 6: 4, 7: 3, 8: 2, 9: 1 }

function pairSum(a, b) {
  return a.charCodeAt(0) - 48 + (b.charCodeAt(0) - 48)
}

export function buildEliminateSum10Steps(options = {}) {
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
      topIdx: null,
      topCh: null,
      stack: [],
      eliminated: null,
      gone: [],
      pops: 0,
      result: null,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `给了数字串 \`${s}\`（\`${n}\` 个字符）。规则：**相邻两数之和为 10 就可以消除**，` +
      `消除后两边接在一起继续检查。\`1~9\` 里每个数字只有**一个**补数（\`d\` 配 \`10-d\`，` +
      `\`5\` 配自己），所以新数字只需要看栈顶：互补就一起消失，否则入栈。` +
      `栈里存的就是**当前串约化后的形态** —— 题面那句"两边接在一起"，本质就是"弹掉栈顶"，` +
      `不用真的去拼接字符串。下面从 \`s[0]\` 开始逐位扫描。`,
  )

  const stack = []
  const gone = []
  let pops = 0

  for (let i = 0; i < n; i += 1) {
    const ch = chars[i]
    const topIdx = stack.length > 0 ? stack[stack.length - 1] : null
    const topCh = topIdx === null ? null : chars[topIdx]

    if (topIdx !== null && pairSum(topCh, ch) === 10) {
      stack.pop()
      gone.push(topIdx, i)
      pops += 1
      const nowTop = stack.length > 0 ? chars[stack[stack.length - 1]] : null
      snap(
        'pop',
        `\`s[${i}] = "${ch}"\`：栈顶是 \`"${topCh}"\`（下标 ${topIdx}）—— ` +
          `\`${topCh} + ${ch} = 10\`，**两个一起消失**。` +
          (nowTop === null
            ? `弹出后栈空了 —— 左边已经没有任何没消掉的数字。`
            : `弹出后新的栈顶是 \`"${nowTop}"\` —— 这就是"两边接在一起"：` +
              `下标 ${topIdx} 被消掉后，它左边的数字直接跟后面的字符相邻了，**栈自动完成这件事**。`),
        {
          i,
          ch,
          topIdx,
          topCh,
          stack: stack.slice(),
          eliminated: [topIdx, i],
          gone: gone.slice(),
          pops,
        },
      )
      continue
    }

    stack.push(i)
    const sum = topCh === null ? null : pairSum(topCh, ch)
    snap(
      'push',
      topCh === null
        ? `\`s[${i}] = "${ch}"\`：栈空 —— 左边没有还没消掉的数字跟它配，**入栈**。`
        : `\`s[${i}] = "${ch}"\`：栈顶 \`"${topCh}"\`（下标 ${topIdx}）—— ` +
          `\`${topCh} + ${ch} = ${sum}\`（≠ 10），消不掉，\`"${ch}"\` **入栈**，成为新的栈顶。`,
      {
        i,
        ch,
        topIdx,
        topCh,
        stack: stack.slice(),
        gone: gone.slice(),
        pops,
      },
    )
  }

  const result = stack.map((k) => chars[k]).join('')
  snap(
    'done',
    `\`${n}\` 个字符扫完，栈里剩下 \`${result}\`（长度 \`${n} - 2 × ${pops} = ${result.length}\`）：` +
      `一共消掉 \`${pops}\` 对。剩下的串里**没有任何相邻互补对**，已经消无可消（不可约形）。` +
      `而且这个结果是**唯一**的 —— 不管按什么顺序消，都会停在这里（临界对 \`a b a\` 两种消法都剩 \`a\`，` +
      `加上每步必减 2 的终止性）。所以"最短剩余长度"就是 \`${result.length}\`，不用搜索。`,
    {
      i: n > 0 ? n - 1 : null,
      ch: n > 0 ? chars[n - 1] : null,
      stack: stack.slice(),
      gone: gone.slice(),
      pops,
      result,
      done: true,
    },
  )

  return steps
}

export { COMPLEMENT, DEFAULT_S, pairSum }
