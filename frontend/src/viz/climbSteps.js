/**
 * climbSteps.js — 「爬楼梯」(LC 70) 的状态机：dp 填表 + 可选的 int32 溢出标记。
 *
 * 核心语义：到第 i 阶的「最后一步」只有两种来路 —— 从 i-1 迈 1 阶、从 i-2 迈 2 阶。
 * 这两类按「最后一步的迈法」分类：互斥（一步不可能同时是 1 阶和 2 阶）且完备
 * （最后一步只有这两种），所以 dp[i] = dp[i-1] + dp[i-2] —— 加法原理。
 *
 * 同一条帧流服务两种画法：
 *   默认      —— n=10 填表（每个格子显示走法数，两条弧线汇入当前格）
 *   int32Mode —— n=50，limit = 2147483647，从第 46 格起标红（美团社招 n=80 的溢出故事）
 *
 * 数字红线：ways(n) = Fib(n+1)。ways(45)=1836311903 是 int32 最后一个装得下的，
 * ways(46)=2971215073 溢出；int64 撑到 ways(91)，ways(92) 溢出；
 * JS 的 Number（double）在 ways(78) 起就丢整数精度（> 2^53）。
 * 溢出演示只跑到 n=50（ways(50)=20365011074 < 2^53），快照里的值都是精确的。
 */

const DEFAULT_N = 10
const DEFAULT_INT32 = 2147483647

function cellDesc(i, dp, limit) {
  const a = dp[i - 1]
  const b = dp[i - 2]
  const sum = a + b
  let tail = ''
  if (limit !== null && sum > limit) {
    tail = ` 注意：${sum} 已经超过 int32 上限 ${limit} —— 从这一阶起，Java 的 int 先于算法爆掉。`
  }
  return (
    `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${a} + ${b} = ${sum}。` +
    `前一类以 1 阶收尾、后一类以 2 阶收尾，互斥且完备，所以直接相加。${tail}`
  )
}

/**
 * 构造帧序列。
 * @param {{ n?: number, int32Limit?: number | null }} [options]
 */
export function buildClimbSteps(options = {}) {
  const n = Number.isInteger(options.n) && options.n >= 0 ? options.n : DEFAULT_N
  const limit =
    options.int32Limit === null || options.int32Limit === undefined
      ? null
      : Number(options.int32Limit) || DEFAULT_INT32

  const dp = new Array(n + 1).fill(0)
  dp[0] = 1
  if (n >= 1) dp[1] = 1

  const steps = []
  const snap = (phase, i, from, extra) => {
    steps.push({
      phase,
      i,
      from,
      n,
      limit,
      dp: dp.slice(),
      value: null,
      over: false,
      lastOk: null,
      answer: null,
      done: false,
      desc: '',
      ...extra,
    })
  }

  snap('init', null, null, {
    desc:
      `dp[0] = 1：站在地面不动也算一种走法 —— 递推的起点；dp[1] = 1：只能迈一步。` +
      `接下来每一阶的走法数，都只由它前面两阶决定。`,
  })

  for (let i = 2; i <= n; i += 1) {
    snap('from1', i, i - 1, {
      desc:
        `到第 ${i} 阶的最后一步是「从第 ${i - 1} 阶迈 1 阶」—— 这类走法数恰好等于` +
        `到第 ${i - 1} 阶的走法数：dp[${i - 1}] = ${dp[i - 1]}。`,
    })
    snap('from2', i, i - 2, {
      desc:
        `另一类最后一步是「从第 ${i - 2} 阶迈 2 阶」—— dp[${i - 2}] = ${dp[i - 2]} 种。` +
        `按最后一步分类：两类互斥（一步不可能既是 1 又是 2）、又覆盖所有可能，可以相加。`,
    })
    dp[i] = dp[i - 1] + dp[i - 2]
    const over = limit !== null && dp[i] > limit
    snap('settle', i, null, {
      value: dp[i],
      over,
      desc: cellDesc(i, dp, limit),
    })
  }

  let lastOk = null
  if (limit !== null) {
    for (let k = 0; k <= n; k += 1) {
      if (dp[k] <= limit) lastOk = k
    }
  }
  snap('done', n, null, {
    value: dp[n],
    answer: dp[n],
    over: limit !== null && dp[n] > limit,
    lastOk,
    done: true,
    desc:
      limit !== null
        ? ` ways(${n}) = ${dp[n]}。int32 在第 ${lastOk === null ? '-' : lastOk + 1} 阶就装不下了，` +
          `int64 也只能撑到第 91 阶 —— 美团追问「n=80」真正考的是类型，不是算法。`
        : ` 到第 ${n} 阶共有 ${dp[n]} 种走法 —— 答案就是 dp[${n}]，它正是斐波那契数。`,
  })

  return steps
}
