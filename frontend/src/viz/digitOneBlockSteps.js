/**
 * digitOneBlockSteps.js — 「1~n 中数字 1 出现的个数」的第二个状态机：数轴上的周期块。
 *
 * 分工：digitOneSteps.js 演示「公式怎么用」（三件套逐位扫），
 * 本文件演示「公式从哪来」—— 先不碰公式，直接在数轴上看 1 的分布。
 *
 * 观察（0 ~ 47 的网格）：
 *   个位：每 10 个数一个循环，每个循环里个位为 1 的恰好 1 个（1、11、21…）—— 散点。
 *   十位：每 100 个数一个循环，每个循环里十位为 1 的恰好连续 10 个（10-19）—— 整块。
 * 于是每个数位的账本都是同一句话：
 *
 *     完整循环数 × 每循环贡献 + 零头里那一截
 *
 *   - 个位（weight = 1）：0~47 有 4 个完整十连 × 1 = 4；零头 40~47 里 41 踩线 → +1
 *   - 十位（weight = 10）：0~47 有 0 个完整百块 × 10 = 0；零头 0~47 里 10-19 整块都在 → +10
 *
 * 把这句话翻译成公式就是 higher / cur / lower 三件套：
 *   完整循环数 = higher，每循环贡献 = weight，零头里那一截看 cur（0 / 1 / >1 三分支）。
 *
 * 网格规模：只支持 10 <= n <= 99（两个数位，100 格以内画得下）；
 * 再大的 n 交给主动画的公式版，数轴反而看不清。
 *
 * 帧序列：init + 每个数位 2 帧（pattern 看分布 / count 记账本）+ done。
 * 通用坑：A / V。
 */

const DEFAULT_N = 47
const POS_NAMES = ['个位', '十位', '百位', '千位', '万位', '十万位', '百万位', '千万位', '亿位', '十亿位']

export function buildDigitOneBlockSteps(options = {}) {
  const raw = options.n
  const n = Number.isInteger(raw) && raw >= 10 && raw <= 99 ? raw : DEFAULT_N
  const posCount = String(n).length
  const steps = []
  const positions = [] // 已记完账的数位（累计条用）
  let total = 0

  let ctx = {
    posIndex: -1,
    weight: 0,
    cycle: 0,
    fullBlocks: 0,
    runLen: 0,
    positionTotal: 0,
    highlighted: [],
  }

  const snap = (phase, extra) => {
    steps.push({
      phase,
      n,
      cols: 10,
      posCount,
      posIndex: ctx.posIndex,
      posName: ctx.posIndex >= 0 ? POS_NAMES[ctx.posIndex] : '',
      weight: ctx.weight,
      cycle: ctx.cycle,
      fullBlocks: ctx.fullBlocks,
      runLen: ctx.runLen,
      positionTotal: ctx.positionTotal,
      highlighted: ctx.highlighted.slice(),
      positions: positions.map((p) => ({ ...p })),
      total,
      done: phase === 'done',
      desc: '',
      ...extra,
    })
  }

  // 当前数位上，0 ~ n 里哪些数的这一位是 1
  const highlightedFor = (weight) => {
    const out = []
    for (let v = 0; v <= n; v += 1) {
      if (Math.floor(v / weight) % 10 === 1) out.push(v)
    }
    return out
  }

  snap('init', {
    desc:
      `换个角度：先别管公式，看看 1 在数轴上长什么样。下面是 0 ~ ${n}，` +
      `一个数位一个数位地看过去。0 本身没有 1，放进来只是让每一行凑整。`,
  })

  for (let i = 0; i < posCount; i += 1) {
    const weight = 10 ** i
    const cycle = weight * 10
    const fullBlocks = Math.floor(n / cycle)
    const remainder = n % cycle
    // 零头里那一截：每个循环的 1 从块内偏移 weight 处开始，连续 weight 个
    const runLen = Math.max(0, Math.min(remainder - weight + 1, weight))
    const positionTotal = fullBlocks * weight + runLen
    const highlighted = highlightedFor(weight)

    ctx = { posIndex: i, weight, cycle, fullBlocks, runLen, positionTotal, highlighted }
    snap('pattern', {
      desc:
        `看${POS_NAMES[i]}：每 ${cycle} 个数一个循环，每个循环里${POS_NAMES[i]}为 1 的恰好 ${weight} 个` +
        (weight > 1
          ? `，而且是连成一片的（${highlighted[0]} ~ ${highlighted[highlighted.length - 1]}）`
          : '，是个孤零零的散点') +
        '。',
    })

    total += positionTotal
    positions.push({
      posIndex: i,
      posName: POS_NAMES[i],
      weight,
      cycle,
      fullBlocks,
      runLen,
      positionTotal,
    })
    snap('count', {
      desc:
        `${POS_NAMES[i]}账本：0 ~ ${n} 里有 ${fullBlocks} 个完整循环，每个贡献 ${weight} 个 → ` +
        `${fullBlocks * weight}；剩下的零头 ${fullBlocks * cycle} ~ ${n} 里，1 那一截` +
        `${runLen > 0 ? `数出 ${runLen} 个` : '还没开始'}。${POS_NAMES[i]}合计 ${positionTotal}。`,
    })
  }

  snap('done', {
    posIndex: -1,
    posName: '',
    weight: 0,
    cycle: 0,
    fullBlocks: 0,
    runLen: 0,
    positionTotal: 0,
    highlighted: [],
    desc:
      `合计 ${total}。「完整循环数 × 每循环贡献 + 零头里那一截」—— 这就是公式的原型。` +
      `把它翻译成代码，就是下一个动画里的 higher / cur / lower 三件套。`,
  })

  return steps
}
