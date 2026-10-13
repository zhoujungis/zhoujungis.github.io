/**
 * digitOneSteps.js — 「1~n 中数字 1 出现的个数」(LC 233) 的状态机：逐数位扫描。
 *
 * 核心思想（文章第一节就点破）：
 *   1 ~ n 里数字 1 的总数 = 每个数位上 1 的个数之和。
 *   单个数位上 1 的个数只由三个值决定 —— higher / cur / lower 三件套：
 *
 *     higher = n / (weight * 10)   当前位之上的部分
 *     cur    = (n / weight) % 10   当前位
 *     lower  = n % weight          当前位之下的部分
 *
 *   以个位（weight = 1）为例：每 10 个数，个位是 1 的恰好 1 个。
 *   所以 0 ~ n 里有 higher 个完整「十连」，每个贡献 1 个个位 1；
 *   不满的末连里要看 cur：
 *     cur = 0  → 末连还没走到 1，一个不多给          → higher * weight
 *     cur = 1  → 正好踩在 1 那一截的起点，数到 lower  → higher * weight + lower + 1
 *     cur > 1  → 1 那一截已整个走完，末连也满额       → (higher + 1) * weight
 *   十位 / 百位 / 千位同理，只是「每 10 个」变成「每 100 / 1000 个」、
 *   「连续 1 个」变成「连续 10 / 100 个」—— 这正是 weight 的含义。
 *
 * 循环条件必须是 weight <= n（不是 weight < n）：n 恰好是 10 的幂时，
 * 最高位那个数位也必须扫（n = 10 时十位贡献 1）。官方样例 n = 13 恰好
 * 掩盖这个 bug（13 的最高位在十位，weight = 10 < 13 照样进循环）。
 *
 * 帧序列：init + 每个数位 2 帧（split 三件套 / contribute 计贡献）+ done。
 * done 帧不复写语义字段（坑 J）：total 是真累加出来的，指针类字段保持最后一拍的真实值。
 *
 * 通用坑：A / V / X。
 */

const DEFAULT_N = 1304
const POS_NAMES = ['个位', '十位', '百位', '千位', '万位', '十万位', '百万位', '千万位', '亿位', '十亿位']

export function buildDigitOneSteps(options = {}) {
  // 演示规模上限 6 位：再大的 n 数位条和累计 chips 在 680 宽画布里排不下，
  // 而复杂度讨论（n = 21 亿）本来就不靠动画演示。非法输入回退默认值。
  const n = Number.isInteger(options.n) && options.n >= 0 && options.n <= 999999
    ? options.n
    : DEFAULT_N

  const digits = String(n).split('').map(Number) // 高位 -> 低位，如 1304 -> [1, 3, 0, 4]
  const posCount = digits.length
  const positions = [] // 已处理完的数位记录（累加区用）
  const steps = []
  let total = 0

  let ctx = { posIndex: -1, weight: 0, higher: 0, cur: 0, lower: 0, branch: null, contribution: null }

  const snap = (phase, extra) => {
    steps.push({
      phase,
      n,
      digits,
      posCount,
      posIndex: ctx.posIndex,
      posName: ctx.posIndex >= 0 ? POS_NAMES[ctx.posIndex] : '',
      weight: ctx.weight,
      higher: ctx.higher,
      cur: ctx.cur,
      lower: ctx.lower,
      branch: ctx.branch,
      contribution: ctx.contribution,
      positions: positions.map((p) => ({ ...p })),
      total,
      done: phase === 'done',
      desc: '',
      ...extra,
    })
  }

  snap('init', {
    desc:
      `统计 1 ~ ${n} 里数字 1 出现的总次数。n 共 ${posCount} 个数位，这套公式只扫 ${posCount} 轮，` +
      `和逐个数字检查完全不是一个量级。做法：把每个数位单独拿出来数，` +
      `某一位上 1 的个数只由「高于它的部分、当前位、低于它的部分」三件套决定。`,
  })

  for (let i = 0; i < posCount; i += 1) {
    const weight = 10 ** i
    // n = 0 时一次都不进（1 <= 0 不成立），答案自然是 0
    if (weight > n) break

    const higher = Math.floor(n / (weight * 10))
    const cur = Math.floor(n / weight) % 10
    const lower = n % weight

    ctx = { posIndex: i, weight, higher, cur, lower, branch: null, contribution: null }
    snap('split', {
      desc:
        `第 ${i + 1} 个数位（${POS_NAMES[i]}，权值 ${weight}）拆三件套：` +
        `高于它的部分 ${higher}，当前位 ${cur}，低于它的部分 ${lower}。`,
    })

    const branch = cur === 0 ? 'zero' : cur === 1 ? 'one' : 'many'
    const contribution =
      branch === 'zero'
        ? higher * weight
        : branch === 'one'
          ? higher * weight + lower + 1
          : (higher + 1) * weight

    total += contribution
    positions.push({
      posIndex: i,
      posName: POS_NAMES[i],
      weight,
      higher,
      cur,
      lower,
      branch,
      contribution,
    })
    ctx = { posIndex: i, weight, higher, cur, lower, branch, contribution }

    const branchDesc =
      branch === 'zero'
        ? `当前位是 0：${POS_NAMES[i]}上每 ${weight * 10} 个数连出 ${weight} 个 1，` +
          `${higher} 个完整大块给出 ${higher * weight} 个；当前块还没走到 1 那一截，一个不多给。`
        : branch === 'one'
          ? `当前位是 1：正好踩在 1 那一截的起点。${higher} 个完整大块给出 ${higher * weight} 个；` +
            `当前块里从 1 开始一路数到 ${lower}，又多出 ${lower + 1} 个。`
          : `当前位是 ${cur}：1 那一截已经整个走完。${higher} 个完整大块给出 ${higher * weight} 个；` +
            `当前块也满额，再拿 ${weight} 个。`
    snap('contribute', {
      desc: `${branchDesc}这一位合计 ${contribution}，累计 ${total}。`,
    })
  }

  snap('done', {
    posIndex: -1,
    posName: '',
    weight: 0,
    higher: 0,
    cur: 0,
    lower: 0,
    branch: null,
    contribution: null,
    desc:
      positions.length === 0
        ? '1 ~ 0 里一个整数都没有，答案就是 0 —— 公式同样适用，只是循环一次都不进。'
        : `${posCount} 个数位全部扫完：${positions.map((p) => p.contribution).join(' + ')} = ${total}。` +
          `这就是 1 ~ ${n} 中数字 1 出现的总次数。时间是 O(数位个数)，也就是 O(log n)：` +
          `n 换成 21 亿也只要 10 轮。`,
  })

  return steps
}
