/**
 * wordBreakSteps.js — 「单词拆分」(LC 139) 的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 wordBreak.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 给字符串 s 和字典 wordDict，问 s 能不能**整段**由字典里的词拼出来，词可重复使用。
 * 定义：
 *     dp[i] = s 的**前 i 个字符**能不能被字典拼出来
 *     dp[0] = true      （空串天然拼得出 —— 这是唯一的底座）
 *     dp[i] = OR over j<i ( dp[j] && s[j:i] ∈ dict )
 * 语义：**枚举"最后一个词"** —— 最后一段取 s[j:i]，只要它自己是词、
 * 且它前面的 s[0:j] 也拼得出（dp[j]），dp[i] 就成立。
 *
 * 三个必须讲清的点：
 *   1. **dp[0] = true 是唯一的底座**：一个字符都还没拼时算"已拼好"。
 *      写成 false 的话，`"leet"` 这种整串就是词的情况（j = 0）直接判死。
 *   2. 这是**完全背包**：词可以重复使用（`apple | pen | apple`）。dp 从 i = 1
 *      正序推到 n，算 dp[i] 时用到的 dp[j] (j < i) 早已就绪 —— 与 LC 322
 *      同一副骨架，只是把"求最少枚数"换成了"求可达性（布尔或）"。
 *   3. 两条纯效率优化，不改语义：
 *      · 字典用 **Set**：`dict.has(w)` 是哈希查找，而不是在 list 里逐个字符串比；
 *      · 切分点 j 只枚举 **maxLen 窗口内**（j >= i - maxLen）：最后一个词最长
 *        就是 maxLen，更靠左的 j 长度都对不上。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'probe' | 'done'
 *   desc: string
 *   s: string
 *   words: string[]        // 字典（已去重）
 *   n: number
 *   maxLen: number         // 字典里最长的词长（剪枝窗口的宽度）
 *   i: number              // 本帧在填的前缀长度（init/done 为 -1）
 *   j: number              // 本帧试的切分点（-1 表示整个窗口的 dp[j] 全为 false）
 *   seg: string            // 最后一段 s[j:i]
 *   dpJ: boolean           // dp[j]（本帧动作前的值）
 *   inDict: boolean        // seg 是否在字典里
 *   skipped: number        // 本帧之前因 dp[j] = false 被跳过的切分点数
 *   lo: number             // 窗口左端 max(0, i - maxLen)
 *   hi: number             // 窗口右端 i - 1
 *   hit: boolean           // 本帧是否命中（命中即 dp[i] = true 并短路）
 *   dp: boolean[]          // 本帧动作**之后**的 dp 快照
 *   prevDp: boolean[]      // 本帧动作**之前**的 dp 快照
 *   cut: (number|null)[]   // cut[i] = 首次命中时的切分点（还原切分用）
 *   result: boolean
 *   segments: string[]     // done 帧：还原出的切分（从左到右）
 *   chain: number[]        // done 帧：切分点回溯链 n → ... → 0
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 回放一致：prevDp === 上一帧的 dp；probe 帧只可能把 dp[i] 由 false 翻成 true；
 *   2. dp[0] 恒为 true；
 *   3. probe 帧（j >= 0）：dpJ === prevDp[j] === true、seg === s.slice(j, i)、
 *      inDict === dict.has(seg)，窗口 lo === max(0, i - maxLen)、hi === i - 1、lo <= j <= hi；
 *   4. hit 帧当且仅当 dpJ && inDict，且 dp[i] === true、cut[i] === j；命中后本 i 不再有帧；
 *   5. 每个 i 至多一帧 hit；hit 之后 dp[i] 在后续帧里恒为 true，且不再变回 false；
 *   6. done 帧：result === dp[n]；为 true 时 segments 拼起来 === s、
 *      每段都在字典里、段数 >= 1，且 cut 链自洽（cut[i] 处的 dp 为 true）；
 *   7. result 与"逐位置 BFS 可达"的独立参考解一致。
 */

const DEFAULT_S = 'applepenapple'
const DEFAULT_WORDS = ['apple', 'pen']

/** 供测试与渲染层复用的默认题面。 */
export const WORD_BREAK_DEFAULT_S = DEFAULT_S
export const WORD_BREAK_DEFAULT_WORDS = DEFAULT_WORDS

/** 把外部入参收敛成合法的 (s, words)：空串/非法字典一律回退默认。 */
function normalize(options = {}) {
  const s = typeof options.s === 'string' && options.s.length > 0 ? options.s : DEFAULT_S
  const raw = Array.isArray(options.words) ? options.words : []
  const words = [...new Set(raw.filter((w) => typeof w === 'string' && w.length > 0))]
  return { s, words: words.length > 0 ? words : [...DEFAULT_WORDS] }
}

export function buildWordBreakSteps(options = {}) {
  const { s, words } = normalize(options)
  const n = s.length
  const maxLen = words.reduce((m, w) => Math.max(m, w.length), 0)
  const dict = new Set(words)

  const steps = []
  const dp = new Array(n + 1).fill(false)
  dp[0] = true
  const cut = new Array(n + 1).fill(null)

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      s,
      words: [...words],
      n,
      maxLen,
      i: -1,
      j: -1,
      seg: '',
      dpJ: false,
      inDict: false,
      skipped: 0,
      lo: 0,
      hi: -1,
      hit: false,
      dp: [...dp],
      prevDp: [...dp],
      cut: [...cut],
      result: dp[n],
      segments: [],
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `给字符串 \`s = "${s}"\`（${n} 个字符）和字典 \`[${words.map((w) => `"${w}"`).join(', ')}]\`，` +
      `判断整个 s 能否由字典里的词**整段拼接**而成（词可以重复使用）。` +
      `定义 \`dp[i]\` = s 的**前 i 个字符**能否拼出：底座 \`dp[0] = true\`（空串天然拼得出），` +
      `其余先全部 \`false\`。递推 \`dp[i] = OR( dp[j] && s[j:i] ∈ dict )\` —— ` +
      `语义是**枚举"最后一个词"**：最后一段取 \`s[j:i]\`，只要它本身是词、` +
      `且它前面的 \`s[0:j]\` 拼得出（\`dp[j] = true\`），\`dp[i]\` 就成立。` +
      `字典里最长的词是 ${maxLen} 个字符，所以切分点只看窗口 \`j ∈ [i - ${maxLen}, i - 1]\`：` +
      `更靠左的 j 会让"最后一个词"长度超过 maxLen，不可能命中。` +
      `任何一个 j 命中，\`dp[i]\` 立刻置 true 并停止扫描（**命中即短路**）。`,
  )

  for (let i = 1; i <= n; i += 1) {
    const lo = Math.max(0, i - maxLen)
    const hi = i - 1
    let skipped = 0
    let fired = 0
    let hit = false

    for (let j = lo; j <= hi; j += 1) {
      if (!dp[j]) {
        skipped += 1
        continue
      }
      const prevDp = [...dp]
      const seg = s.slice(j, i)
      const inDict = dict.has(seg)
      if (inDict) {
        dp[i] = true
        cut[i] = j
        hit = true
      }
      fired += 1

      const windowNote =
        lo > 0
          ? `窗口左端 \`${lo} = ${i} - ${maxLen}\`：最后一词最长 ${maxLen}，更靠左的 j 连长度都对不上，不必看。`
          : ''
      const skipNote =
        skipped > 0
          ? `先跳过 ${skipped} 个 \`dp[j] = false\` 的切分点 —— 前一段自己都拼不出来，后面接什么词都白搭。`
          : ''

      snap(
        'probe',
        `前缀 **${i}**（即 \`s\` 的前 ${i} 个字符 \`"${s.slice(0, i)}"\`），窗口 \`j ∈ [${lo}, ${hi}]\`。` +
          skipNote +
          `盯住 \`j = ${j}\`：\`dp[${j}] = true\`（\`"${s.slice(0, j)}"\` 已拼得出），` +
          `再查最后一段 \`s[${j}:${i}] = "${seg}"\` —— ` +
          (inDict
            ? `**在字典里**，于是 \`dp[${i}] = true\`。命中即短路，本格剩下的切分点不用再试了。`
            : `不在字典里，这个切分点作废，接着试下一个 j。`) +
          windowNote,
        { i, j, seg, dpJ: prevDp[j], inDict, skipped, lo, hi, hit, prevDp },
      )
      if (hit) break
    }

    if (fired === 0) {
      snap(
        'probe',
        `前缀 **${i}**，窗口 \`j ∈ [${lo}, ${hi}]\` 里 ${skipped} 个切分点的 \`dp[j]\` 全是 \`false\` —— ` +
          `前一段自己就拼不出来，后面接什么词都白搭，\`dp[${i}] = false\`。` +
          `注意 \`dp\` 是**布尔可达性**：没人能走到 \`i\`，这一格就一直是 false，` +
          `不像 LC 322 那样还有"先设成 ∞、等路径来刷新"的余地。`,
        { i, j: -1, skipped, lo, hi, hit: false },
      )
    }
  }

  const result = dp[n]
  const segments = []
  const chain = [n]
  if (result) {
    let cursor = n
    while (cursor > 0) {
      const j = cut[cursor]
      segments.push(s.slice(j, cursor))
      chain.push(j)
      cursor = j
    }
    segments.reverse()
  }

  const reused = segments.length !== new Set(segments).size

  snap(
    'done',
    (result
      ? `返回 **true**：\`dp[${n}] = true\`，整个串拼得出来。` +
        `顺 \`cut\` 表回溯出切分点链 \`${chain.join(' → ')}\`，` +
        `即 \`${segments.join(' | ')}\`（${segments.length} 段）。` +
        (reused
          ? `注意 \`${segments.find((w, idx) => segments.indexOf(w) !== idx)}\` 用了不止一次 —— ` +
            `**词可重复使用**正是"完全背包"的语义，跟 LC 322 里硬币无限复用是同一件事。`
          : `每一段都在字典里，每段起点处 \`dp[j]\` 都是 true（所以 \`dp\` 表同时也是一张"可达位置"的清单）。`)
      : `返回 **false**：\`dp[${n}] = false\`，无论怎么切都有一段不在字典里。` +
        `注意 \`dp[i]\` 是**布尔或**：只要有一条通路能走到 i 就够，不必去数"有几种切法"。`) +
      `这也就是 139 与 322 的分工 —— 322 求**最少枚数**（min），139 求**能否到达**（OR）。`,
    { segments, chain, done: true },
  )

  return steps
}
