/**
 * lcs1Steps.js — 「允许一个错误的最长公共连续子序列」的状态机：双状态 DP 逐行推进。
 *
 * 先澄清题面：「连续」= 子串（substring），不是子序列（subsequence）。
 * 连续意味着对齐时只能沿对角线走，不能跳格 —— 这是与普通 LCS 的分水岭。
 *
 * 两个状态：
 *   f[i][j]  以 s[i-1]、t[j-1] 结尾的最长公共子串长度，**全程字符相等**
 *   g[i][j]  以 s[i-1]、t[j-1] 结尾的最长公共子串长度，**至多一处不等**
 *
 * 转移（s[i-1] === t[j-1] 时）：
 *   f[i][j] = f[i-1][j-1] + 1
 *   g[i][j] = g[i-1][j-1] + 1     ← 相等，不消耗错误额度
 * 转移（s[i-1] !== t[j-1] 时）：
 *   f[i][j] = 0                   ← 断了
 *   g[i][j] = max(f[i-1][j-1] + 1, 1)   ← **必须引用 f，不是 g**
 *
 * 那一处不等是整题的分水岭：g 只能从「干净的 f」接过错误配额再 +1。
 * 若写成 g[i-1][j-1] + 1，同一个字符上就能反复消耗配额，答案会虚高。
 *
 * 帧序列：init + 每行 1 帧（整行填完，末格作为讲解格）+ done，共 8 帧。
 * 逐格 36 帧太长，逐行 8 帧节奏刚好，且讲解格落在关键那一格。
 *
 * 通用坑：A / V / X。
 */

const DEFAULT_S = 'abcdef'
const DEFAULT_T = 'abcdxf' // e→x，一处替换

export function judgeLcs1(s, t) {
  /** 与状态机同源的判定（单测里与独立参考解交叉用）。 */
  const n = s.length
  const m = t.length
  const f = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  const g = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j <= m; j += 1) {
      if (s[i - 1] === t[j - 1]) {
        f[i][j] = f[i - 1][j - 1] + 1
        g[i][j] = g[i - 1][j - 1] + 1
      } else {
        f[i][j] = 0
        g[i][j] = Math.max(f[i - 1][j - 1] + 1, 1)
      }
    }
  }
  let best = 0
  for (let i = 1; i <= n; i += 1) for (let j = 1; j <= m; j += 1) best = Math.max(best, g[i][j])
  return { best, f, g }
}

function isLegalPair(s, t) {
  return (
    typeof s === 'string' &&
    typeof t === 'string' &&
    s.length > 0 &&
    t.length > 0 &&
    s.length <= 8 &&
    t.length <= 8 &&
    /^[a-z]+$/.test(s) &&
    /^[a-z]+$/.test(t)
  )
}

export function buildLcs1Steps(options = {}) {
  const s = isLegalPair(options.s, options.t) ? options.s : DEFAULT_S
  const t = isLegalPair(options.s, options.t) ? options.t : DEFAULT_T
  const n = s.length
  const m = t.length

  const steps = []
  const snap = (phase, extra) => {
    steps.push({
      phase,
      s,
      t,
      n,
      m,
      i: 0,
      cell: null, // { j, f, g, fDiag, gDiag, equal, rule }
      filled: 0, // 已完成的行数
      best: 0,
      done: phase === 'done',
      desc: '',
      ...extra,
    })
  }

  snap('init', {
    desc:
      `s = ${s}，t = ${t}，各 ${n} 个字符。求允许至多一处不等的最长公共连续子串。` +
      `表格两行状态：f 是全程相等的干净后缀，g 是至多一处不等的后缀。` +
      `关键只有一条 —— 不等的时候，g 只能从 f 接过额度再 +1。`,
  })

  const f = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  const g = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  let best = 0

  for (let i = 1; i <= n; i += 1) {
    // 本行末格作为讲解格（走对角线视觉上的最新一格）
    for (let j = 1; j <= m; j += 1) {
      const equal = s[i - 1] === t[j - 1]
      const fDiag = f[i - 1][j - 1]
      const gDiag = g[i - 1][j - 1]
      if (equal) {
        f[i][j] = fDiag + 1
        g[i][j] = gDiag + 1
      } else {
        f[i][j] = 0
        g[i][j] = Math.max(fDiag + 1, 1)
      }
      if (g[i][j] > best) best = g[i][j]
    }
    // 讲解格取对角线格 (i, i)：与「连续 = 沿对角线走」的心智模型一致，
    // 主例的关键格（e 对 x）正好落在第 5 行对角线上
    const j = Math.min(i, m)
    const equal = s[i - 1] === t[j - 1]
    const gDiag = g[i - 1][j - 1]
    const cell = {
      j,
      f: f[i][j],
      g: g[i][j],
      fDiag: f[i - 1][j - 1],
      gDiag,
      equal,
      rule: equal
        ? `s[${i - 1}]=${s[i - 1]} 与 t[${j - 1}]=${t[j - 1]} 相等：g = g 左上 + 1 = ${gDiag} + 1 = ${g[i][j]}，不消耗额度`
        : `s[${i - 1}]=${s[i - 1]} 与 t[${j - 1}]=${t[j - 1]} 不等：f 断成 0，g = f 左上 + 1 = ${f[i - 1][j - 1]} + 1 = ${g[i][j]}` +
          (gDiag + 1 !== g[i][j] ? `（若误用 g 左上 + 1 会得到 ${gDiag + 1}，虚高）` : ''),
    }
    snap('row', {
      i,
      cell,
      filled: i,
      best,
      desc: `第 ${i} 行填完：${Array.from({ length: m }, (_, k) => g[i][k + 1]).join('、')}。` + cell.rule,
    })
  }

  snap('done', {
    i: n,
    filled: n,
    best,
    desc:
      `扫完整张表，最大的 g 值是 ${best}：${s} 与 ${t} 只有 e/x 这一处不同，` +
      `所以 6 个字符整体就算一段带 1 处错的公共连续子串。` +
      `整题 O(n × m) 时间、O(n × m) 空间（滚动数组可压到 O(min(n, m))）。`,
  })

  return steps
}
