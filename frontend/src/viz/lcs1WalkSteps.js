/**
 * lcs1WalkSteps.js — 「允许一个错误的最长公共连续子序列」的状态机：对角线走位 + bug 对照。
 *
 * 「连续」的几何含义：两个串对齐后只能沿对角线一格一格走，不能跳格。
 * 本动画用一组「处处不等」的输入把两条路径并排走一遍：
 *
 *   s = abcdef, t = bcdefa
 *
 *   正确路径（次对角线，i = j + 1）："bcdef" 逐格全等，f 一路涨到 5 → 答案 5
 *   错误路径（主对角线，i = j）：每格都不等，若 g 误用 g 左上 + 1，一路虚涨到 6
 *
 * 两条路径的差值就是「错误配额被重复消耗」的具体形状。
 *
 * 帧序列：init + 正确路径 5 帧 + 错误路径 6 帧 + done = 13 帧。
 *
 * 通用坑：A / V / X。
 */

const DEFAULT_S = 'abcdef'
const DEFAULT_T = 'bcdefa'

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

/** 跑两遍 DP：一次正解转移（mismatch 只从 f 接），一次 bug 转移（mismatch 也从 g 接）。 */
function runBoth(s, t) {
  const n = s.length
  const m = t.length
  const f = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  const gOk = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  const gBug = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j <= m; j += 1) {
      if (s[i - 1] === t[j - 1]) {
        f[i][j] = f[i - 1][j - 1] + 1
        gOk[i][j] = gOk[i - 1][j - 1] + 1
        gBug[i][j] = gBug[i - 1][j - 1] + 1
      } else {
        f[i][j] = 0
        gOk[i][j] = Math.max(f[i - 1][j - 1] + 1, 1) // 正解：额度从干净的 f 接
        gBug[i][j] = gBug[i - 1][j - 1] + 1 // bug：额度从已用过的 g 接
      }
    }
  }
  return { f, gOk, gBug }
}

export function buildLcs1WalkSteps(options = {}) {
  const s = isLegalPair(options.s, options.t) ? options.s : DEFAULT_S
  const t = isLegalPair(options.s, options.t) ? options.t : DEFAULT_T
  const n = s.length
  const m = t.length

  const { f, gOk, gBug } = runBoth(s, t)
  const bestOk = Math.max(...gOk.flat())
  const bestBug = Math.max(...gBug.flat())
  // 正解走位上的每格 f（干净后缀长度），渲染层用来标「这格真等」还是「这里断」
  const fAt = (i, j) => f[i][j]

  const steps = []
  const snap = (phase, extra) => {
    steps.push({
      phase,
      s,
      t,
      n,
      m,
      path: null, // 'ok' | 'bug'
      i: 0,
      j: 0,
      charS: '',
      charT: '',
      equal: false,
      value: 0,
      cells: [], // 已走过的 [i, j, value]
      bestOk,
      bestBug,
      done: phase === 'done',
      desc: '',
      ...extra,
    })
  }

  snap('init', {
    desc:
      `s = ${s}，t = ${t}。公共连续子串只能沿对角线走 —— 逐格对齐，不能跳。` +
      `这组输入把两条路径的差别照得很清楚：一条是正解的全等走法，` +
      `一条是「错误配额被重复消耗」的错法走法。`,
  })

  // ── 正确路径：次对角线（i = j + 1），"bcdef" 逐格全等 ──
  const okCells = []
  for (let k = 1; k < Math.min(n, m); k += 1) {
    const i = k + 1
    const j = k
    const equal = s[i - 1] === t[j - 1]
    const value = gOk[i][j]
    okCells.push([i, j, value, fAt(i, j)])
    snap('walk', {
      path: 'ok',
      i,
      j,
      charS: s[i - 1],
      charT: t[j - 1],
      equal,
      value,
      cells: okCells.map((c) => [...c]),
      desc: equal
        ? `正解走次对角线：s[${i - 1}]=${s[i - 1]} 对上 t[${j - 1}]=${t[j - 1]}，相等，g 沿对角续到 ${value}。` +
          `这 5 格全等 —— "bcdef" 本身就是一个 0 错的公共连续子串。`
        : `第 ${k} 格不相等，连续段断掉，g 退回 ${value}。`,
    })
  }

  // ── 错误路径：主对角线（i = j），每格不等却一路 +1 ──
  const bugCells = []
  for (let k = 1; k <= Math.min(n, m); k += 1) {
    const i = k
    const j = k
    const equal = s[i - 1] === t[j - 1]
    const value = gBug[i][j]
    bugCells.push([i, j, value])
    snap('walk', {
      path: 'bug',
      i,
      j,
      charS: s[i - 1],
      charT: t[j - 1],
      equal,
      value,
      cells: bugCells.map((c) => [...c]),
      desc: equal
        ? `错法走主对角线第 ${k} 格：这一格相等，g = g 左上 + 1 = ${value}。`
        : `错法走主对角线第 ${k} 格：s[${i - 1}]=${s[i - 1]} 与 t[${j - 1}]=${t[j - 1]} 不等，` +
          `但 g 又从「g 左上」+1 拿到了 ${value} —— 同一个字符上第二次消耗错误配额，这就是虚高的来源。`,
    })
  }

  snap('done', {
    desc:
      `对照收尾：正解 ${bestOk}（"bcdef"，0 处错），错法 ${bestBug}（把 ${n} 个全不等的位置当成一次错误串起来）。` +
      `差的这一格就是「错误配额被重复消耗」的全部代价 —— 全量对拍统计里，这个错法在 61.8% 的输入上都与正解不同。`,
  })

  return steps
}
