/**
 * compareVersionSteps.js — 「比较版本号」(LC 165) 的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 compareVersion.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 两条规则把所有比较归到同一条铁轨上：**先把每个修订号归一化，再逐列比较**。
 * 归一化 = 剥前导零（缺失修订号视为 "0"）。
 *
 * 归一化之后有个漂亮的事实：**「比数值」退化为「先比长度、等长再比字典序」**
 * —— 因为剥完前导零的数字串没有前导零，更长的一定更大；等长时字符序 = 数值序。
 * 这样全程不需要任何数字转换，**天然免疫超长修订号的精度陷阱**
 * （"999...9"（30 位）经 parseInt 全变成 1e30，两串比出假的相等）。
 * 这个「先长度后字典序」和 LC 415 含负数变体里比绝对值是同一个技巧。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'compare' | 'done'
 *   desc: string
 *   rev1: string[]         // version1 按 '.' 切开的修订号（原始串，含前导零）
 *   rev2: string[]
 *   col: number            // 当前列（0 起）
 *   raw1, raw2: string|null // 本列两侧原始修订号（缺失为 null → 补 0）
 *   val1, val2: string      // 归一化后的值（剥前导零；缺失侧为 "0"）
 *   isPad1, isPad2: bool    // 该侧是否是补零
 *   verdict: '' | 'equal' | 'less' | 'greater'
 *   result: number|null    // 仅 done 帧：1 / -1 / 0
 *   done: boolean
 *
 * ⚠️ 每帧 = 恰好比较一列（归一化 + 长度/字典序比较 + 裁决），verdict 与
 * val1/val2 的数值关系互洽，单测逐帧校验。compare 短路后立即 done。
 */

const DEFAULT_V1 = '1.02.3'
const DEFAULT_V2 = '1.2.10'

/** 剥前导零："0002" → "2"，全零/空串 → "0"。 */
export function stripZeros(s) {
  let i = 0
  while (i < s.length - 1 && s[i] === '0') i += 1
  return s.slice(i)
}

/** 归一化后的数字串比较：先长度后字典序。返回 -1/0/1。 */
export function cmpNorm(a, b) {
  if (a.length !== b.length) return a.length < b.length ? -1 : 1
  if (a === b) return 0
  return a < b ? -1 : 1
}

export function buildCompareVersionSteps(options = {}) {
  const v1 = typeof options.version1 === 'string' && options.version1.length > 0 ? options.version1 : DEFAULT_V1
  const v2 = typeof options.version2 === 'string' && options.version2.length > 0 ? options.version2 : DEFAULT_V2

  const rev1 = v1.split('.')
  const rev2 = v2.split('.')
  const cols = Math.max(rev1.length, rev2.length)

  const steps = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      rev1,
      rev2,
      col: -1,
      raw1: null,
      raw2: null,
      val1: '',
      val2: '',
      isPad1: false,
      isPad2: false,
      verdict: '',
      result: null,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `给了两个版本号：\`${v1}\` 和 \`${v2}\`。按 \`.\` 切成修订号数组：` +
      `\`[${rev1.map((r) => `"${r}"`).join(', ')}]\` 和 \`[${rev2.map((r) => `"${r}"`).join(', ')}]\`。` +
      `比较规则把所有情况归到同一条铁轨：**先把每个修订号归一化（剥前导零，缺失视为 0），再逐列比较，**` +
      `第一列分出胜负就短路返回。归一化后「比数值」有个漂亮的事实：` +
      `**先比长度、等长再比字典序** —— 剥完前导零的数字串更长的一定更大，` +
      `全程不用转数字，天然免疫超长修订号的 \`parseInt\` 精度陷阱。`,
  )

  for (let col = 0; col < cols; col += 1) {
    const has1 = col < rev1.length
    const has2 = col < rev2.length
    const raw1 = has1 ? rev1[col] : null
    const raw2 = has2 ? rev2[col] : null
    const val1 = stripZeros(has1 ? raw1 : '0')
    const val2 = stripZeros(has2 ? raw2 : '0')
    const c = cmpNorm(val1, val2)
    const verdict = c === 0 ? 'equal' : c < 0 ? 'less' : 'greater'

    const parts = []
    parts.push(`**第 \`${col + 1}\` 列**：`)
    parts.push(has1 ? `\`${raw1}\`` : `\`0\`（补零，v1 修订号已用完）`)
    parts.push(` vs `)
    parts.push(has2 ? `\`${raw2}\`` : `\`0\`（补零，v2 修订号已用完）`)
    const norm1 = raw1 !== null && raw1 !== val1
    const norm2 = raw2 !== null && raw2 !== val2
    if (norm1 || norm2 || !has1 || !has2) {
      const segs = []
      segs.push(has1 ? `"${raw1}" → "${val1}"` : null)
      segs.push(has2 ? `"${raw2}" → "${val2}"` : null)
      const shown = segs.filter(Boolean).join(' 与 ')
      parts.push(` —— 剥前导零归一化：${shown}。`)
    } else {
      parts.push(' —— 本列无需剥零。')
    }
    if (val1.length !== val2.length) {
      parts.push(
        `比长度：\`${val1.length}\` vs \`${val2.length}\` —— **长的一定大**（剥完前导零没有前导零）。`,
      )
    }
    if (verdict === 'equal') {
      parts.push(`**等长且逐字符相同 → 数值相等**，进下一列。`)
    } else if (verdict === 'less') {
      parts.push(
        `**\`${val1}\` < \`${val2}\`，第一列分出胜负，短路返回 \`-1\`。**` +
          (val1.length === val2.length
            ? `注意不是字符比较：字符序里 \`${val1[0]}\` 可能大于 \`${val2[0]}\`，等长时字符序才恰好等于数值序。`
            : `字符比较会在这里翻车：字符序看首字符，数值看位数。`),
      )
    } else {
      parts.push(
        `**\`${val1}\` > \`${val2}\`，第一列分出胜负，短路返回 \`1\`。**` +
          (val1.length === val2.length
            ? `等长逐字符比较，字符序 = 数值序。`
            : `比长度就分出了：位数多的大。`),
      )
    }

    snap('compare', parts.join(''), {
      col,
      raw1,
      raw2,
      val1,
      val2,
      isPad1: !has1,
      isPad2: !has2,
      verdict,
    })

    if (verdict !== 'equal') {
      const res = verdict === 'less' ? -1 : 1
      snap(
        'done',
        `第 \`${col + 1}\` 列分出胜负，后面的列不用看（短路）。**返回 \`${res}\`**：` +
          `\`${v1}\` ${res < 0 ? '<' : '>'} \`${v2}\`。`,
        { col, result: res, verdict },
      )
      return steps
    }
  }

  snap(
    'done',
    `所有列都相等（包括补零列）。**返回 \`0\`**：\`${v1}\` 与 \`${v2}\` 版本号相等 —— ` +
      `\`"1.01"\` 与 \`"1.001"\`、\`"1.0"\` 与 \`"1.0.0"\` 都在这条路上归为相等。`,
    { col: cols - 1, result: 0, verdict: 'equal' },
  )
  return steps
}
