/**
 * bitmapTwoBitSteps.js — 2-bit 位图的状态机：去重 + 数重复 + 找唯一。
 *
 * 1-bit 位图只能回答「出现过没有」。要同时回答三个问题
 * （哪些数出现过 / 哪些重复了 / 哪些只出现一次），给每个数 2 bit：
 *
 *   00 未出现  →  01 出现一次  →  10 出现多次  →  （11 保留态，两次以上都是 10）
 *
 * 转移表：
 *   add 一个 v：00 → 01（置低位）
 *              01 → 10（清低位置高位：一次变多次）
 *              10 → 10（保持）
 *              11 → 10（兜底，视作多次）
 *
 * 为什么不是「00/01/10/11 分别表示 0/1/2/3 次」：那样第 4 次会溢出，
 * 而「是否重复」只需要区分「一次」和「多次」两档，10 就是多次的垃圾桶。
 *
 * 帧序列：init + 每个输入数 1 帧（转移 + 三集合快照）+ done。
 *
 * 演示规模：值域 0~15（一个字装 16 个数，每数 2 bit 恰好占满 32 位字）。
 *
 * 通用坑：A / V / X。
 */

const DEFAULT_INPUT = [3, 7, 3, 3, 12, 7]
const SIZE = 16 // 值域 0..15

export const STATE_LABEL = { 0: '00 未出现', 1: '01 一次', 2: '10 多次', 3: '11 保留' }

export function buildBitmapTwoBitSteps(options = {}) {
  const input =
    Array.isArray(options.input) &&
    options.input.length > 0 &&
    options.input.every((v) => Number.isInteger(v) && v >= 0 && v < SIZE)
      ? options.input.slice()
      : DEFAULT_INPUT.slice()

  const steps = []
  const states = new Array(SIZE).fill(0) // 每数 2 bit：0/1/2/3

  const sets = () => {
    const distinct = []
    const dups = []
    const uniques = []
    for (let v = 0; v < SIZE; v += 1) {
      if (states[v] === 1) {
        distinct.push(v)
        uniques.push(v)
      } else if (states[v] === 2 || states[v] === 3) {
        distinct.push(v)
        dups.push(v)
      }
    }
    return { distinct, dups, uniques }
  }

  const snap = (phase, extra) => {
    const s = sets()
    steps.push({
      phase,
      input,
      size: SIZE,
      value: null,
      from: 0,
      to: 0,
      states: states.slice(),
      distinct: s.distinct,
      dups: s.dups,
      uniques: s.uniques,
      done: phase === 'done',
      desc: '',
      ...extra,
    })
  }

  snap('init', {
    desc:
      `还是这批数：${input.join('、')}，但换成 2-bit 位图 —— 每个数占 2 bit，` +
      `四个状态：00 未出现、01 出现一次、10 出现多次（11 保留）。` +
      `一遍扫完，三个问题同时有答案：哪些出现过、哪些重复了、哪些只出现一次。`,
  })

  input.forEach((v, i) => {
    const from = states[v]
    let to = from
    if (from === 0) to = 1
    else if (from === 1) to = 2
    else if (from === 3) to = 2
    states[v] = to

    snap('step', {
      value: v,
      from,
      to,
      desc:
        `第 ${i + 1} 个数 ${v}：状态 ${STATE_LABEL[from]} → ${STATE_LABEL[to]}。` +
        (from === 0
          ? `第一次见到：00 翻 01。`
          : from === 1
            ? `第二次见到：01 翻 10 —— 「一次」升级成「多次」。`
            : `已经记着是多次了：10 保持。`),
    })
  })

  snap('done', {
    value: null,
    desc:
      `扫描一遍收答案：出现过 ${steps[steps.length - 1].distinct.length} 个` +
      `（${steps[steps.length - 1].distinct.join('、')}），` +
      `重复 ${steps[steps.length - 1].dups.length} 个（${steps[steps.length - 1].dups.join('、') || '无'}），` +
      `只出现一次 ${steps[steps.length - 1].uniques.length} 个（${steps[steps.length - 1].uniques.join('、') || '无'}）。` +
      `空间代价是 1-bit 位图的两倍，换来「次数分档」这个新维度。`,
  })

  return steps
}
