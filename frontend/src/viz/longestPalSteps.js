/**
 * longestPalSteps.js — 「最长回文子串」(LC 5) 中心扩展解法的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 longestPal.js。
 * （文件名避开 LC 234 回文链表已占用的 palindromeSteps.js。）
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 回文 = 关于中心对称。所以**枚举中心，而不是枚举子串**：
 * 子串有 O(n²) 个、每个验回文 O(n) → O(n³)；中心只有 **2n-1 个**
 * （n 个「字符中心」管奇数回文 + n-1 个「间隙中心」管偶数回文），
 * 每个中心向两边扩展，总时间 O(n²)，空间 O(1)。
 *
 * 最经典的坑：**只写 `expand(i, i)` 就漏掉了所有偶数回文** ——
 * "abba"、"cbbd" 的中心是两个字符之间的间隙，不在任何字符上。
 * 所以中心要交错枚举：字符中心、间隙中心、字符中心、……
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'center' | 'done'
 *   desc: string
 *   chars: string[]          // Array.from 拆的字符（emoji 安全，见 SKILL LC 3）
 *   n
 *   centerIdx: number        // 第几个中心（0 起，共 2n-1）
 *   centerType: 'char' | 'gap' | null
 *   ci: number|null          // 中心位置：char → 字符下标；gap → 左字符下标
 *   l, r: number|null        // 扩展完成后的回文区间（len 0 时为 null）
 *   len: number              // 该中心的最长回文长度
 *   pal: string|null         // 该中心的最长回文串
 *   bestL, bestR: number|null // 当前全局最优区间（含本帧更新）
 *   bestLen: number
 *   bestUpdated: boolean
 *   done: boolean
 *
 * ⚠️ 每帧 = 恰好处理一个中心；[l, r] 必须真的是回文、len = r - l + 1，
 * 单测逐帧校验（这条直接钉死扩展逻辑）。
 */

const DEFAULT_S = 'babad'

export function buildLongestPalSteps(options = {}) {
  const raw = typeof options.s === 'string' && options.s.length > 0 ? options.s : DEFAULT_S
  const chars = Array.from(raw) // emoji / 非 BMP 安全
  const n = chars.length
  const s = chars

  const steps = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      chars,
      n,
      centerIdx: -1,
      centerType: null,
      ci: null,
      l: null,
      r: null,
      len: 0,
      pal: null,
      bestL: null,
      bestR: null,
      bestLen: 0,
      bestUpdated: false,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `给了字符串 \`${raw}\`（\`${n}\` 个字符）。求最长回文子串。` +
      `枚举所有子串要 \`O(n^2)\` 个、每个验回文又要 \`O(n)\` —— \`O(n^3)\` 起步。` +
      `换个角度：**回文是关于中心对称的，枚举中心就够了** —— 中心只有 **\`2n-1 = ${2 * n - 1}\` 个**：` +
      `\`${n}\` 个字符中心（管奇数回文，如 \`"bab"\`）+ \`${n - 1}\` 个间隙中心（管偶数回文，如 \`"abba"\`）。` +
      `每个中心向两边扩展到不能再扩，总时间 \`O(n^2)\`，**空间 O(1)**。` +
      `下面按「字符 0 · 间隙 0 · 字符 1 · 间隙 1 · …」交错的顺序扫过所有中心。`,
  )

  let bestL = null
  let bestR = null
  let bestLen = 0
  let centerIdx = 0

  // 展开一个中心并把结果做成一帧
  const recordCenter = (centerType, ci) => {
    let l = null
    let r = null
    if (centerType === 'char') {
      l = ci
      r = ci
      while (l > 0 && r < n - 1 && s[l - 1] === s[r + 1]) {
        l -= 1
        r += 1
      }
    } else if (s[ci] === s[ci + 1]) {
      l = ci
      r = ci + 1
      while (l > 0 && r < n - 1 && s[l - 1] === s[r + 1]) {
        l -= 1
        r += 1
      }
    }
    const len = l === null ? 0 : r - l + 1
    const pal = l === null ? null : chars.slice(l, r + 1).join('')
    const bestUpdated = len > bestLen
    if (bestUpdated) {
      bestL = l
      bestR = r
      bestLen = len
    }

    const posName = centerType === 'char' ? `\`s[${ci}]\`` : `\`s[${ci}]|s[${ci + 1}]\` 之间`
    const parts = []
    parts.push(`**中心 \`${centerIdx + 1}/${2 * n - 1}\`（${centerType === 'char' ? '字符中心' : '间隙中心'} ${posName}）**：`)
    if (l === null) {
      parts.push(
        centerType === 'gap'
          ? `两侧字符 \`${s[ci]}\` ≠ \`${s[ci + 1]}\`，连最小的偶数回文都构不成 —— 长度 0，跳过。`
          : `扩展结果就是它自己，长度 1。`,
      )
    } else {
      parts.push(
        `向两边扩展到 \`[${l}, ${r}]\`，回文 **"${pal}"**，长度 \`${len}\`` +
          (bestUpdated
            ? ` —— **超过当前最优（原 \`${bestLen}\`），更新最优**。`
            : `，不超过当前最优（\`${bestLen}\`），最优保持。`),
      )
    }

    snap('center', parts.join(''), {
      centerIdx,
      centerType,
      ci,
      l,
      r,
      len,
      pal,
      bestL,
      bestR,
      bestLen,
      bestUpdated,
    })

    centerIdx += 1
  }

  for (let i = 0; i < n; i += 1) {
    recordCenter('char', i)
    if (i < n - 1) recordCenter('gap', i)
  }

  snap(
    'done',
    `\`${2 * n - 1}\` 个中心全部扫完，最优回文 **"${chars.slice(bestL, bestR + 1).join('')}"**（\`[${bestL}, ${bestR}]\`，长度 \`${bestLen}\`）。` +
      `回头看：每个中心只向两边扫一次，总时间 \`O(n^2)\`、**空间 O(1)** —— ` +
      `比 DP 的 \`O(n^2)\` 空间省一个量级。两个提醒：` +
      `间隙中心（偶数回文）是最容易漏的，\`"abba"\`、\`"cbbd"\` 全靠它们；` +
      `同长度时先到先得（\`"babad"\` 的 \`"bab"\` 先于 \`"aba"\` 出现）。`,
    { centerIdx: 2 * n - 1, bestL, bestR, bestLen, done: true },
  )

  return steps
}
