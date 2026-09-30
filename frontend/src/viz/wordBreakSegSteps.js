/**
 * wordBreakSegSteps.js — 「单词拆分」(LC 139) 的第二视角：**表算完之后，怎么把 s 真的切成词**。
 *
 * 纯函数，不碰 DOM。渲染层是 wordBreakSeg.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * dp 表只回答了"能不能"，它**没有记住"怎么切"**。要还原切分，就沿着
 * dp 从右往左走：
 *
 *     pos = n
 *     while pos > 0:
 *         找一个 j ∈ [max(0, pos - maxLen), pos - 1]，使 dp[j] = true 且 s[j:pos] ∈ dict
 *         命中 → 最后一段就是 s[j:pos]，pos = j，继续往左
 *     走到 pos = 0 就切完了
 *
 * 关键点：**不需要额外记 cut 表**。任意一个满足 `dp[j] = true && s[j:pos] ∈ dict`
 * 的 j 都能接上 —— dp[j] 已经保证了前缀 s[0:j] 可拆，s[j:pos] 本身是个词，
 * 两段接起来就是 s[0:pos] 的一个合法切分。dp 表本身就是"每个位置能不能拼出"
 * 的完整信息，回溯只是把它读出来。
 *
 * 这条回溯顺手就解释了 LC 140（单词拆分 II）：要**列出所有**切分方案时，
 * 把"找到一个就停"换成"DFS 枚举所有 j"即可，配上记忆化就是 140 的标准解。
 *
 * 与动画一的分工：动画一逐格**填** dp（枚举"最后一个词"），
 * 动画二拿**算好的** dp 逐段**切** s（枚举"最后一段从短到长"）。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'scan' | 'done'
 *   desc: string
 *   s: string
 *   words: string[]
 *   n: number
 *   maxLen: number
 *   pos: number            // 当前右端（从 n 往左挪；init/done 为 -1）
 *   j: number              // 本帧试的切分点（-1 表示 init/done）
 *   seg: string            // 候选最后一段 s[j:pos]
 *   dpJ: boolean           // dp[j]（全程不变，是算好的表）
 *   inDict: boolean        // seg 是否在字典里
 *   hit: boolean           // dpJ && inDict：这一段被锁定
 *   lo: number             // 窗口左端 max(0, pos - maxLen)
 *   hi: number             // 窗口右端 pos - 1
 *   dp: boolean[]          // 完整 dp 表（全程不变）
 *   locked: Array<{start, end, word}>  // 已锁定的段，按 start 升序（从左到右）
 *   segments: string[]     // done 帧：完整切分（从左到右）
 *   chain: number[]        // done 帧：pos 回溯链 n → ... → 0
 *   result: boolean
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. dp 全程逐格不变，dp[0] 恒为 true，result === dp[n]；
 *   2. scan 帧：lo === max(0, pos - maxLen)、hi === pos - 1、lo <= j <= hi、
 *      seg === s.slice(j, pos)、dpJ === dp[j]、inDict === dict.has(seg)；
 *   3. hit === (dpJ && inDict)；hit 帧把 {start: j, end: pos, word: seg} 加入 locked；
 *   4. locked 各段互不重叠、按 start 升序、首尾相接（第 k 段的 end === 第 k+1 段的 start）；
 *   5. pos 只在 hit 帧更新，且严格递减；第一个 hit 的 end === n；
 *   6. result 为 true 时：segments 拼起来 === s、每段都在字典里、locked 覆盖 [0, n)；
 *      为 false 时：没有任何 hit 帧、segments 为空；
 *   7. dp 与 buildWordBreakSteps 的最终 dp 逐格一致（两台机器同一张表）；
 *      segments 与独立参考解（枚举所有切分 / 逐位置可达）相容。
 */

const DEFAULT_S = 'applepenapple'
const DEFAULT_WORDS = ['apple', 'pen']

function normalize(options = {}) {
  const s = typeof options.s === 'string' && options.s.length > 0 ? options.s : DEFAULT_S
  const raw = Array.isArray(options.words) ? options.words : []
  const words = [...new Set(raw.filter((w) => typeof w === 'string' && w.length > 0))]
  return { s, words: words.length > 0 ? words : [...DEFAULT_WORDS] }
}

export function buildWordBreakSegSteps(options = {}) {
  const { s, words } = normalize(options)
  const n = s.length
  const maxLen = words.reduce((m, w) => Math.max(m, w.length), 0)
  const dict = new Set(words)

  // 先把 dp 表算出来（与动画一同一台机器：枚举"最后一个词"，正序填）
  const dp = new Array(n + 1).fill(false)
  dp[0] = true
  for (let i = 1; i <= n; i += 1) {
    const lo = Math.max(0, i - maxLen)
    for (let j = lo; j < i; j += 1) {
      if (dp[j] && dict.has(s.slice(j, i))) {
        dp[i] = true
        break
      }
    }
  }

  const steps = []
  const locked = []
  const chain = [n]
  let pos = n
  let result = dp[n]

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      s,
      words: [...words],
      n,
      maxLen,
      pos: -1,
      j: -1,
      seg: '',
      dpJ: false,
      inDict: false,
      hit: false,
      lo: 0,
      hi: -1,
      dp: [...dp],
      locked: locked.map((r) => ({ ...r })),
      segments: [],
      chain: [...chain],
      result,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `先把 dp 表算出来（与动画一同一台机器）：\`dp[i] = OR( dp[j] && s[j:i] ∈ dict )\`，` +
      `底座 \`dp[0] = true\`，窗口 \`j ∈ [i - ${maxLen}, i - 1]\`（\`maxLen = ${maxLen}\`）。` +
      `\`s = "${s}"\`（${n} 个字符），字典 \`[${words.map((w) => `"${w}"`).join(', ')}]\`，` +
      `\`dp[${n}] = ${result}\`。` +
      `这一遍不看"怎么填表"，而看**"表算好之后，怎么把 s 真的切成词"** —— ` +
      `dp 只回答了"能不能"，它没有记住"怎么切"。做法是从右往左走：` +
      `在位置 \`pos\` 找一个切分点 \`j\`，使 \`dp[j] = true\` 且 \`s[j:pos]\` 在字典里，` +
      `那 \`s[j:pos]\` 就可以当**最后一个词**，然后把 \`pos\` 挪到 \`j\` 继续往左 —— 走到 \`pos = 0\` 就切完了。` +
      `扫描方向是 \`j\` 从 \`pos - 1\` 递减（最后一段**从短到长**）。`,
  )

  while (pos > 0) {
    const lo = Math.max(0, pos - maxLen)
    const hi = pos - 1
    let hit = false

    for (let j = hi; j >= lo; j -= 1) {
      const seg = s.slice(j, pos)
      const dpJ = dp[j]
      const inDict = dict.has(seg)
      const ok = dpJ && inDict
      const windowNote =
        lo > 0
          ? `窗口左端 \`${lo} = ${pos} - ${maxLen}\`：再往左的最后一段就超过 ${maxLen} 个字符了。`
          : ''

      if (ok) {
        locked.push({ start: j, end: pos, word: seg })
        locked.sort((a, b) => a.start - b.start)
        chain.push(j)
        const nextPos = j
        snap(
          'scan',
          `右端 \`pos = ${pos}\`：从 \`j = ${hi}\` 往左试，到 \`j = ${j}\` **命中** —— ` +
            `\`dp[${j}] = true\`、\`s[${j}:${pos}] = "${seg}"\` 在字典里。` +
            `于是最后一段锁定为 \`"${seg}"\`，把 \`pos\` 挪到 \`${nextPos}\`，继续往左找剩下的前缀。` +
            windowNote,
          { pos, j, seg, dpJ, inDict, hit: true, lo, hi },
        )
        pos = nextPos
        hit = true
        break
      }

      snap(
        'scan',
        `右端 \`pos = ${pos}\`，试 \`j = ${j}\`：候选最后一段 \`s[${j}:${pos}] = "${seg}"\` —— ` +
          (dpJ
            ? `\`dp[${j}] = true\`（前缀拼得出）没问题，但 \`"${seg}"\` 不在字典里，这条路作废。`
            : `\`dp[${j}] = false\` —— 前缀 \`"${s.slice(0, j)}"\` 自己就拼不出来，后面接什么词都没用，跳过。`) +
          windowNote,
        { pos, j, seg, dpJ, inDict, hit: false, lo, hi },
      )
    }

    if (!hit) break
  }

  const segments = locked.map((r) => r.word)

  snap(
    'done',
    (result
      ? `切完：\`${segments.join(' | ')}\`（${segments.length} 段），切分点链 \`${chain.join(' → ')}\`。` +
        `整个过程**没有额外的 cut 表** —— \`dp\` 表本身就是"每个位置能不能拼出"的完整信息：` +
        `只要 \`dp[j] = true\` 且 \`s[j:pos]\` 是词，这一段就一定接得上。` +
        `把"找到一个就停"换成"DFS 枚举所有 j"、再配记忆化，就是 LC 140 单词拆分 II 的标准解。`
      : `\`dp[${n}] = false\`：从 \`pos = ${n}\` 往左一个能接上的 j 都没有，整串切不开。` +
        `回溯的前提是 \`dp[${n}] = true\` —— dp 为 false 时连第一步都迈不出去。`) +
      `回头对照：动画一是**填表**（枚举"最后一个词"、正序推进），动画二是**读表**（从 n 往回切）—— ` +
      `同一张 \`dp\`，一个负责"能不能"，一个负责"怎么切"。`,
    { done: true, segments, chain: [...chain] },
  )

  return steps
}
