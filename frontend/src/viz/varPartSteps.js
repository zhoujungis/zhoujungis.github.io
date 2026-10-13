/**
 * varPartSteps.js — 「序列切分使方差和最大」的状态机（k = 2 这一层）。
 *
 * 题意：把序列切成若干段，使各段内部方差之和最大。DP：
 *   dp[i][j] = max_{k} dp[k][j-1] + var(k+1..i)
 * k = 2 时退化成一次扫描：枚举切点 i，左边方差 + 右边方差取最大。
 * 这正是 DP 的第一层（dp[i][1] = var(1..i)），后面 j 层是同一个式子往上叠。
 *
 * 两个必须说清的点：
 * 1) 段方差用一阶/二阶前缀和 O(1) 算，否则每切点重算是 O(n^3)；
 * 2) 「切分会变小」是直觉错的本源 —— [2,8,3,9,4,7] 全序列方差只有 6.92，
 *    切成两段能到 14.69。因为两段均值差得远，各自的离散被放大了。
 *    离差平方和分解 SS_total = SS_within + SS_between 永远成立，
 *    但「方差」各除各的长度，换算只在等长切分时才成立。
 *
 * 通用坑：A / V / Z。
 */

const DEFAULT_SEQ = [2, 8, 3, 9, 4, 7]

function asSeq(value) {
  if (!Array.isArray(value) || value.length < 2) return DEFAULT_SEQ.slice()
  const seq = value.map((v) => Number(v))
  const ok = seq.every((v) => Number.isFinite(v)) && seq.length >= 2 && seq.length <= 24
  return ok ? seq : DEFAULT_SEQ.slice()
}

/** 一阶/二阶前缀和：O(1) 算任意区间的均值与总体方差。 */
function prefix(seq) {
  const s1 = [0]
  const s2 = [0]
  for (const v of seq) {
    s1.push(s1[s1.length - 1] + v)
    s2.push(s2[s2.length - 1] + v * v)
  }
  return { s1, s2 }
}

function segStats(seq, pre, l, r) {
  // 区间 [l, r) 的均值与总体方差（除以长度）
  const len = r - l
  if (len <= 0) return { len: 0, mean: 0, var: 0 }
  const sum = pre.s1[r] - pre.s1[l]
  const sq = pre.s2[r] - pre.s2[l]
  const mean = sum / len
  const varr = Math.max(0, sq / len - (sum / len) * (sum / len))
  return { len, mean, var: varr }
}

function fmt(x) {
  return Number.isInteger(x) ? String(x) : x.toFixed(2)
}

/**
 * 构造帧序列（k = 2 的扫描层）。
 * @param {{ seq?: number[] }} [options]
 */
export function buildVarPartSteps(options = {}) {
  const seq = asSeq(options.seq)
  const n = seq.length
  const pre = prefix(seq)
  const steps = []

  let bestI = -1
  let best = -Infinity

  const snap = (phase, i, extra) => {
    steps.push({
      phase,
      i,
      seq: seq.slice(),
      n,
      meanL: null,
      varL: null,
      meanR: null,
      varR: null,
      total: null,
      best,
      bestI,
      answer: null,
      done: false,
      desc: '',
      ...extra,
    })
  }

  const whole = segStats(seq, pre, 0, n)
  snap('init', null, {
    desc:
      `序列 (${seq.join(', ')})，切成 2 段，使两段方差之和最大。` +
      `先记住两个工具：一阶前缀和给区间和，二阶前缀和给区间平方和 —— ` +
      `两者一减，均值与方差都是 O(1)。`,
  })

  for (let i = 1; i < n; i += 1) {
    const l = segStats(seq, pre, 0, i)
    const r = segStats(seq, pre, i, n)
    const total = l.var + r.var
    if (total > best) {
      best = total
      bestI = i
    }
    snap('scan', i, {
      meanL: l.mean,
      varL: l.var,
      meanR: r.mean,
      varR: r.var,
      total,
      desc:
        `切点 ${i}：左边 (${seq.slice(0, i).join(', ')}) 均值 ${fmt(l.mean)}、方差 ${fmt(l.var)}；` +
        `右边 (${seq.slice(i).join(', ')}) 均值 ${fmt(r.mean)}、方差 ${fmt(r.var)}；` +
        `合计 ${fmt(total)}${total === best && i === bestI ? ' —— 目前最优' : ''}。`,
    })
  }

  snap('done', null, {
    best,
    bestI,
    answer: best,
    done: true,
    desc:
      `最优切点 = ${bestI}，两段方差和 = ${fmt(best)}。` +
      `对比一下：不切（k = 1）时方差只有 ${fmt(whole.var)} —— **切成两段反而更大**，` +
      `因为两段的均值（${fmt(segStats(seq, pre, 0, bestI).mean)} 与 ${fmt(segStats(seq, pre, bestI, n).mean)}）差得远，` +
      `各自的离散被单独放大了。切成 k 段就是把这个扫描叠 k 层：dp[i][j] = max_{k} dp[k][j-1] + var(k+1..i)。`,
  })

  return steps
}

export { segStats, prefix }
