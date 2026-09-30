/**
 * editDistanceSteps.js — 「编辑距离」(LC 72) 的状态机。
 *
 * 两个锚：dp[i][j] = a 的前 i 个字符 变成 b 的前 j 个字符 的最少操作数。
 * 三种「收尾操作」恰好对应三个邻居：
 *   对角 dp[i-1][j-1] —— 替换 a[i-1]（字符相同时不付钱）
 *   上方 dp[i-1][j]   —— 删掉 a[i-1]
 *   左方 dp[i][j-1]   —— 插入 b[j-1]
 *
 * 同一个帧流同时服务两种画法：
 *   mode 'grid' —— 完整二维表，逐格点亮
 *   mode 'roll' —— 同一张表淡化，只留一行（滚动数组）+ 存下来的 prev
 *
 * 为了让「对角线被覆盖」这件事可以被单测钉死，每帧都带滚动数组的真实快照：
 *   saved            —— 本格用的 prev，必须等于 dp[i-1][j-1]
 *   bufBefore[j]     —— 必须等于 dp[i-1][j]（上方，还没被覆盖）
 *   bufBefore[j-1]   —— 必须等于 dp[i][j-1]（左方，刚被写进去）
 * 三条都是纯数据推导，渲染层不参与。
 *
 * 通用坑：A（CSS 变量兜底）/ V（互斥状态在 JS 里选好）/ Z（反引号一层）。
 */

const DEFAULT_WORD1 = 'horse'
const DEFAULT_WORD2 = 'ros'

const OP_NAME = {
  match: '相同（不付钱）',
  replace: '替换',
  delete: '删除',
  insert: '插入',
}

function asChars(value, fallback) {
  return Array.from(typeof value === 'string' ? value : fallback)
}

function cellDesc(a, b, i, j, info) {
  const chA = a[i - 1]
  const chB = b[j - 1]
  if (info.match) {
    return (
      `a 的 「${chA}」 和 b 的 「${chB}」 一样 —— 这一对不用付钱，直接抄对角 ` +
      `dp[${i - 1}][${j - 1}] = ${info.diag}。另外两个邻居连看都不用看：` +
      `它们各自至少要再收 1，永远赢不了。`
    )
  }
  const parts = [
    `替换：对角 ${info.diag} + 1 = ${info.diag + 1}`,
    `删除：上方 ${info.up} + 1 = ${info.up + 1}`,
    `插入：左方 ${info.left} + 1 = ${info.left + 1}`,
  ]
  let tail = `最小的是${OP_NAME[info.op]}，所以 dp[${i}][${j}] = ${info.value}。`
  if (info.ties.length > 1) {
    const names = info.ties.map((t) => OP_NAME[t]).join(' / ')
    tail +=
      `（有 ${info.ties.length} 个方向并列最小：${names} —— 数值上一模一样，` +
      `只有把操作序列打出来时才分得出高下。）`
  }
  return `a 的 「${chA}」 对 b 的 「${chB}」 不相同，三种收尾取最小：${parts.join('；')}。${tail}`
}

/**
 * 构造帧序列。
 * @param {{ word1?: string, word2?: string }} [options]
 */
export function buildEditDistanceSteps(options = {}) {
  const a = asChars(options.word1, DEFAULT_WORD1)
  const b = asChars(options.word2, DEFAULT_WORD2)
  const m = a.length
  const n = b.length

  const dp = []
  for (let i = 0; i <= m; i += 1) dp.push(new Array(n + 1).fill(0))

  // 滚动数组：长度 n+1，一开始正好是第 0 行
  const buf = []
  for (let j = 0; j <= n; j += 1) buf.push(j)

  const steps = []

  const snap = (phase, i, j, extra) => {
    steps.push({
      phase,
      i,
      j,
      word1: a,
      word2: b,
      m,
      n,
      dp: dp.map((row) => row.slice()),
      buf: buf.slice(),
      bufBefore: null,
      charA: i !== null && i > 0 ? a[i - 1] : null,
      charB: j !== null && j > 0 ? b[j - 1] : null,
      op: null,
      ties: [],
      match: false,
      diag: null,
      up: null,
      left: null,
      value: null,
      saved: null,
      answer: null,
      done: false,
      desc: '',
      ...extra,
    })
  }

  // ---- 第 0 行
  for (let j = 0; j <= n; j += 1) dp[0][j] = j
  snap('init', null, null, {
    desc:
      `先把第 0 行填成 0 … ${n}：空串变成 b 的前 j 个字符，只能一个字符一个字符地插入，` +
      `代价恰好是 j。这一行不是凑数用的，它就是「前缀型 dp」的语义本身。` +
      `滚动数组的初值就是这个第 0 行。`,
  })

  for (let i = 1; i <= m; i += 1) {
    // ---- 第 i 行的左边界
    const rowStartBuf = buf.slice()
    let prev = dp[i - 1][0]
    dp[i][0] = i
    buf[0] = i
    snap('col', i, 0, {
      bufBefore: rowStartBuf,
      saved: prev,
      diag: prev,
      value: i,
      desc:
        `第 ${i} 行先补左边界：a 的前 ${i} 个字符要变成空串，只能全删掉，` +
        `所以 dp[${i}][0] = ${i}。顺手把上一行的 dp[${i - 1}][0] = ${prev} 存进 prev —— ` +
        `它是这一行第一格的对角，等下一格要用。`,
    })

    for (let j = 1; j <= n; j += 1) {
      const bufBefore = buf.slice()
      const upOld = buf[j] // = dp[i-1][j]，写完就没了
      const diag = dp[i - 1][j - 1]
      const up = dp[i - 1][j]
      const left = dp[i][j - 1]
      const isMatch = a[i - 1] === b[j - 1]
      const low = Math.min(diag, up, left)
      const ties = []
      if (diag === low) ties.push('replace')
      if (up === low) ties.push('delete')
      if (left === low) ties.push('insert')
      const op = isMatch ? 'match' : ties[0]
      const value = isMatch ? diag : low + 1
      dp[i][j] = value
      buf[j] = value
      snap('cell', i, j, {
        bufBefore,
        saved: prev,
        diag,
        up,
        left,
        value,
        op,
        ties,
        match: isMatch,
        desc: cellDesc(a, b, i, j, { match: isMatch, op, diag, up, left, value, ties }),
      })
      prev = upOld
    }
  }

  snap('done', m, n, {
    value: dp[m][n],
    answer: dp[m][n],
    done: true,
    desc:
      `右下角 dp[${m}][${n}] = ${dp[m][n]} 就是答案：a 整个变成 b 最少要 ${dp[m][n]} 步。` +
      `注意只有右下角这一个格子是答案 —— 第一行是「空串长成 b」，第一列是「a 缩成空串」，` +
      `它们只是把边界说清楚。` +
      (n > 0
        ? `另外：滚动数组跑到最后，buf 只留下最后一行，答案还是 buf[${n}] = ${dp[m][n]}。`
        : ''),
  })

  return steps
}

export { OP_NAME }
