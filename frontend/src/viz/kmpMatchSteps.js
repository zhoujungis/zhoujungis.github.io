/**
 * kmpMatchSteps.js — 「KMP 匹配（含暴力对照）」的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 kmpMatch.js。
 *
 * ── 主角 ────────────────────────────────────────────────────────────────────
 * 用动画一算好的 next 表，在主串 text 里找模式串 p 的第一次出现：
 *   j = 0
 *   for i = 0 .. m-1:
 *       while j > 0 and text[i] != p[j]:  j = next[j-1]   # 回退 j，i 不动
 *       if text[i] == p[j]:               j = j + 1
 *       if j == n:                        return i - n + 1
 *
 * 与暴力匹配（每个起点 s 都从头重比）的区别全在一句话：
 * **KMP 的主串指针 i 永不回头**。失配时只把 j 退到 next[j-1]，换个更短的
 * 候选前缀接着和同一个 text[i] 比 —— 省下的正是「已匹配那段里本来就有的
 * 相等前后缀」。所以总比较次数是 O(n + m)，而暴力是 O(n * m)。
 *
 * ── 帧字段 ──────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'compare' | 'retreat' | 'found' | 'done'
 *   desc: string
 *   text: string, p: string, n: number（p 长）, m: number（text 长）
 *   next: number[]                  // 从 p 现算的前缀函数
 *   i: number                       // 当前主串下标（init/done 为 -1）
 *   jBefore/jAfter: number          // 本帧动作前后的 j
 *   tch/pch: string                 // 参与比较的两字符
 *   match: boolean
 *   matched: number                 // jAfter（已匹配的模式串前缀长度）
 *   found: boolean
 *   index: number                   // 命中起点（未命中为 -1）
 *   kmpComparisons: number          // KMP 累计比较次数
 *   bruteComparisons: number        // 暴力发要比较的总次数（同输入上的常量参照）
 *   done: boolean
 *
 * ── 逐帧不变量（单测钉死）──────────────────────────────────────────────────
 *   1. compare 帧：jAfter - jBefore 属于 {0,1}，差 1 当且仅当 match === (text[i]===p[jBefore])；
 *      match 时 jAfter === jBefore + 1，否则 jAfter === jBefore；kmpComparisons 比上一帧多 1。
 *   2. retreat 帧：jBefore > 0，jAfter === next[jBefore-1]，且**紧接着一个失败 compare**；
 *      retreat 帧的 i 与上一个 compare 帧相同（i 不回退）。
 *   3. found 帧：jAfter === n，index === i - n + 1，且 text.slice(index, index+n) === p。
 *   4. done 帧：若 found 则 index >= 0；否则 index === -1。
 *   5. 默认 text="abababacaba"、p="abacaba"：18 帧 = init + 13 compare + 2 retreat
 *      + found + done，index = 4，kmpComparisons = 13，bruteComparisons = 17。
 *   6. 命中下标 / next 与独立参考解（暴力 O(n*m) 匹配 + O(n^2) 前缀函数）一致。
 */

export const KMP_MATCH_DEFAULT_TEXT = 'abababacaba'
export const KMP_MATCH_DEFAULT_P = 'abacaba'

/** 前缀函数：与 kmpSteps.js 的算法同源，供渲染层与测试复用。 */
export function prefixFunction(p) {
  const n = p.length
  const next = new Array(n).fill(0)
  let j = 0
  for (let i = 1; i < n; i += 1) {
    while (j > 0 && p[i] !== p[j]) j = next[j - 1]
    if (p[i] === p[j]) j += 1
    next[i] = j
  }
  return next
}

function normalize(options = {}) {
  const text =
    typeof options.text === 'string' && options.text.length >= 1 ? options.text : KMP_MATCH_DEFAULT_TEXT
  const p = typeof options.p === 'string' && options.p.length >= 1 ? options.p : KMP_MATCH_DEFAULT_P
  return { text, p }
}

/** 暴力匹配在同一输入上要比较多少次（循环到命中为止）。 */
function bruteCount(text, p) {
  const m = text.length
  const n = p.length
  let count = 0
  for (let s = 0; s + n <= m; s += 1) {
    let k = 0
    while (k < n) {
      count += 1
      if (text[s + k] !== p[k]) break
      k += 1
    }
    if (k === n) break
  }
  return count
}

export function buildKmpMatchSteps(options = {}) {
  const { text, p } = normalize(options)
  const n = p.length
  const m = text.length
  const next = prefixFunction(p)
  const bruteComparisons = bruteCount(text, p)
  const steps = []
  let j = 0
  let kmpComparisons = 0
  let retreats = 0
  let found = false
  let index = -1

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      text,
      p,
      n,
      m,
      next: next.slice(),
      i: -1,
      jBefore: j,
      jAfter: j,
      tch: '',
      pch: '',
      match: false,
      matched: j,
      found,
      index,
      kmpComparisons,
      bruteComparisons,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `主串 text = "${text}"（${m} 个字符），模式串 p = "${p}"（${n} 个字符），` +
      `借用动画一算好的 \`next = [${next.join(',')}]\`。匹配时把 \`j\` 当作「已匹配的模式串前缀长度」：` +
      `\`text[i]\` 与 \`p[j]\` 相等就 \`j += 1\`，一旦 \`j == n\` 就命中；不等且 \`j > 0\` 时 ` +
      `**主串指针 i 一动不动**，只把 \`j\` 退到 \`next[j-1]\` 接着比。` +
      `这正是 next 数组的用武之地 —— 暴力匹配会在每个失配处从 \`i - j + 1\` 重新开始，` +
      `而 KMP 把 \`i\` 领着一路向前、永不回头。`,
  )

  outer: for (let i = 0; i < m; i += 1) {
    let advanced = false

    while (j > 0) {
      const tch = text[i]
      const pch = p[j]
      const match = tch === pch
      kmpComparisons += 1
      const jBefore = j
      const jAfter = match ? j + 1 : j
      snap(
        'compare',
        `比较 \`text[${i}] = '${tch}'\` 与 \`p[${jBefore}] = '${pch}'\`：**${match ? '相等' : '不等'}**。` +
          (match
            ? `已匹配的模式串前缀长到 ${jAfter}。`
            : `不等 —— 但 \`i\` 不动，把 \`j\` 退到 \`next[${jBefore - 1}] = ${next[jBefore - 1]}\` 接着比。`),
        { i, jBefore, jAfter, tch, pch, match, matched: jAfter },
      )
      if (match) {
        j = jAfter
        advanced = true
        break
      }
      const to = next[jBefore - 1]
      retreats += 1
      snap(
        'retreat',
        `回退：\`j\` 从 ${jBefore} 跳到 \`next[${jBefore - 1}] = ${to}\`。**主串指针 \`i\` 一动不动**，` +
          `只换了个更短的候选前缀，继续和同一个 \`text[${i}]\` 比 —— 已匹配的那段 ` +
          `\`p[0..${jBefore - 1}]\` 里本就藏着长度 ${to} 的相等前后缀，不用重比。`,
        { i, jBefore, jAfter: to, tch, pch, match: false, matched: to },
      )
      j = to
    }

    if (!advanced) {
      const tch = text[i]
      const pch = p[0]
      const match = tch === pch
      kmpComparisons += 1
      const jAfter = match ? 1 : 0
      snap(
        'compare',
        `\`j = 0\`：直接拿 \`text[${i}] = '${tch}'\` 与 \`p[0] = '${pch}'\` 比，**${match ? '相等' : '不等'}**。` +
          (match ? `起步了，已匹配前缀长到 1。` : `\`j\` 停在 0，看主串的下一个字符。`),
        { i, jBefore: 0, jAfter, tch, pch, match, matched: jAfter },
      )
      j = jAfter
      if (match) advanced = true
    }

    if (j === n) {
      found = true
      index = i - n + 1
      snap(
        'found',
        `\`j == n = ${n}\` —— **命中！** 起点下标 = \`i - n + 1 = ${i} - ${n} + 1 = ${index}\`。` +
          `这一段的模式串与 \`text[${index}..${i}] = "${text.slice(index, i + 1)}"\` 逐字相等。` +
          `回头数代价：KMP 只比了 ${kmpComparisons} 次，暴力要 ${bruteComparisons} 次 —— ` +
          `差别就出在命中前，暴力在 \`s = 0, 1, 2, 3\` 每个起点都要**从头重比**。`,
        { i, jBefore: n - 1, jAfter: n, tch: text[i], pch: p[n - 1], match: true, matched: n },
      )
      break outer
    }
  }

  if (!found) {
    snap(
      'done',
      `主串扫描完，\`j\` 始终没到 \`n\` —— **没找到模式串**，返回 \`-1\`。`,
      { i: -1, jBefore: j, jAfter: j, matched: j, done: true },
    )
  } else {
    snap(
      'done',
      `返回 **${index}**：模式串 \`p\` 在主串里第一次出现于下标 ${index}。KMP 的 \`O(n + m)\` 来自 ` +
        `**主串指针永不回头**：整个匹配过程中 \`i\` 只往前走 m 步，\`j\` 的回退总量也不超过它的前进总量，` +
        `所以总比较次数是线性的 —— 这正是 next 数组买来的东西。` +
        `（本例 KMP ${kmpComparisons} 次 vs 暴力 ${bruteComparisons} 次。）`,
      { i: -1, jBefore: n, jAfter: n, matched: n, done: true },
    )
  }

  return steps
}
