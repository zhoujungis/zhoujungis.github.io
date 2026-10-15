/**
 * bitmapSteps.js — 「海量数据统计：10 亿整数排序去重（位图）」的状态机：1-bit 位图。
 *
 * 核心思想（文章第一节就点破）：
 *   整数有界，就可以用「值域」换「空间」——值域里每个整数只占 1 bit，
 *   数据量再大位图也不变大。去重是天然结果（bit 只能置 1 一次），
 *   排序也是天然结果（按 bit 下标从小到大扫描，输出即有序）。
 *
 * 位运算三件套（32 位字）：
 *   word = v >> 5      v 落在第几个字（每字 32 个数）
 *   bit  = v & 31      v 是字内第几位
 *   置位 words[word] |= 1 << bit      查存 (words[word] >> bit) & 1
 *
 * 帧序列：init + 每个输入数 2 帧（locate 算 word/bit / act 置位或跳过）+ done。
 * done 帧不复写语义字段（坑 J）：distinct 是真实扫出来的，指针类字段保持最后一拍的值。
 *
 * 演示规模：值域 0~63（2 个字）—— 刚好够展示「跨字」和「字内高位」两种定位。
 *
 * 通用坑：A / V / X。
 */

const DEFAULT_INPUT = [37, 12, 37, 5, 63, 42] // 有重复、跨两个字、含字内高位
const SIZE = 64 // 值域 0..63

export function buildBitmapSteps(options = {}) {
  const input =
    Array.isArray(options.input) &&
    options.input.length > 0 &&
    options.input.every((v) => Number.isInteger(v) && v >= 0 && v < SIZE)
      ? options.input.slice()
      : DEFAULT_INPUT.slice()

  const steps = []
  const placed = [] // 已置位的值（按输入顺序）
  const skipped = [] // 因重复被跳过的值

  const snap = (phase, extra) => {
    steps.push({
      phase,
      input,
      size: SIZE,
      value: null,
      word: 0,
      bit: 0,
      already: false,
      placed: placed.slice(),
      skipped: skipped.slice(),
      distinct: placed.slice().sort((a, b) => a - b),
      done: phase === 'done',
      desc: '',
      ...extra,
    })
  }

  snap('init', {
    desc:
      `输入 ${input.length} 个整数：${input.join('、')}，值域 0 ~ ${SIZE - 1}。` +
      `位图的做法：开一片连续的内存，值域里每个整数对应 1 bit —— ` +
      `出现过就把那 1 bit 置 1。重复的数再到来时那一位已经是 1，天然去重；` +
      `最后按 bit 下标从小到大扫一遍，输出就是有序去重序列。`,
  })

  input.forEach((v, i) => {
    const word = v >> 5
    const bit = v & 31
    const already = placed.includes(v)

    snap('locate', {
      value: v,
      word,
      bit,
      already,
      desc:
        `第 ${i + 1} 个数 ${v}：算它落在哪 —— word = ${v} >> 5 = ${word}（第 ${word} 个字，每字装 32 个数），` +
        `bit = ${v} & 31 = ${bit}（字内第 ${bit} 位）。` +
        `换算成人话：${v} = ${word} × 32 + ${bit}。`,
    })

    if (already) {
      skipped.push(v)
      snap('act', {
        value: v,
        word,
        bit,
        already: true,
        desc:
          `这一位已经是 1 —— ${v} 之前出现过，直接跳过。` +
          `这就是位图去重：不需要哈希表、不需要比较，看一眼 bit 就够。`,
      })
    } else {
      placed.push(v)
      snap('act', {
        value: v,
        word,
        bit,
        already: false,
        desc:
          `这一位还是 0 —— 新数。执行置位：words[${word}] |= 1 << ${bit}。` +
          `注意是 |=（按位或）：只翻本位，同字其他位原样不动；写成 = 会把整个字冲掉。` +
          `已放入 ${placed.length} 个。`,
      })
    }
  })

  snap('done', {
    value: null,
    desc:
      `扫描全位图（0 到 ${SIZE - 1} 逐位看）：置了 1 的位依次是 ${placed.slice().sort((a, b) => a - b).join('、')}。` +
      `${input.length} 个输入去重后剩 ${placed.length} 个，且天然有序 —— ` +
      `这就是「10 亿个数排序去重」的全部魔法：值域 10^9 时位图只要 119 MiB，` +
      `而原数组是 4 GB。`,
  })

  return steps
}
