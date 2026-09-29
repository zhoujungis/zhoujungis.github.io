/**
 * rotateSteps.js — 「轮转数组」(LeetCode 189) 三次翻转解法的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 rotate.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 向右轮转 k 位，用三次**原地翻转**合成，全程 O(1) 额外空间：
 *
 *   1. 整体翻转        [1,2,3,4,5,6,7] → [7,6,5,4,3,2,1]
 *   2. 翻转前 k 个     [7,6,5]         → [5,6,7]
 *   3. 翻转后 n-k 个   [4,3,2,1]       → [1,2,3,4]
 *   结果               [5,6,7,1,2,3,4]
 *
 * 为什么成立：**"轮转" = 把数组在 k 处切成两段后交换两段的左右位置**。
 * 整体翻转先把两段的**内部顺序**全部倒过来、并让两段就位（左段跑到右边），
 * 再各自把内部顺序翻回来 —— 交换位置与恢复顺序，正好是两次独立的"反转"。
 * 反转是自己的逆运算（翻转两次 = 恒等），所以两步各自可逆、合成出轮转。
 *
 * ── 两个坑 ────────────────────────────────────────────────────────────────
 * 1. **k 必须先对 n 取模**：k 可能大于 n（k = n 时等于没转）。取模后 k = 0
 *    直接返回；
 * 2. **Python 切片法的 k=0 坑**：`nums[-k:]` 在 k=0 时是 `nums[-0:]` = **整个
 *    数组**（-0 === 0），结果变成"数组接上自己"—— 必须先取模并特判 k=0，
 *    或者写成 `nums[n-k:]`。本文的切片解法里有专门标注。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'flip' | 'done'
 *   desc: string
 *   arr: number[]          // 当前数组（原地交换后的样子）
 *   n, k                   // k 已取模
 *   round: number          // 第几次翻转（1 整体 / 2 前 k / 3 后 n-k）
 *   roundName: string      // '整体翻转' | '翻转前 k' | '翻转后 n-k'
 *   flipRange: [a, b]|null // 本轮翻转的区间（含两端）
 *   i, j: number|null      // 本帧交换的两格（左右指针）
 *   swapsDone: number      // 本轮已完成的交换次数
 *   done: boolean
 *
 * ⚠️ 每帧 = 一对交换（swap 后快照），i/j 就是刚交换的两格。
 * ⚠️ done 帧带全渲染层要用的字段（SKILL 坑 Z 强制流程第 4 条）。
 */

const DEFAULT_NUMS = [1, 2, 3, 4, 5, 6, 7]
const DEFAULT_K = 3

export function buildRotateSteps(options = {}) {
  const raw = Array.isArray(options.nums) ? options.nums : DEFAULT_NUMS
  const arr = raw.slice()
  const n = arr.length

  const rawK = Number.isInteger(options.k) ? options.k : DEFAULT_K
  // ⚠️ k 先对 n 取模：k 可能大于 n；取模后 k ∈ [0, n-1]
  const k = n > 0 ? ((rawK % n) + n) % n : 0

  const steps = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      arr: arr.slice(),
      n,
      k,
      round: 0,
      roundName: '',
      flipRange: null,
      i: null,
      j: null,
      swapsDone: 0,
      done: phase === 'done',
      ...extra,
    })
  }

  if (n === 0) {
    snap('done', '输入是空的，没有可轮转的元素。')
    return steps
  }

  snap(
    'init',
    `给了 \`${n}\` 个数 \`[${arr.join(', ')}]\`，向右轮转 \`${rawK}\` 位。` +
      `先取模：\`k = ${rawK} mod ${n} = ${k}\`（轮转 n 位等于没转，k 可能比 n 大）。` +
      (k === 0
        ? `取模后 k = 0 —— 数组不变，直接结束。`
        : `要求的进阶是 **O(1) 额外空间**，排除"再开一个数组按位搬运"，剩下的是**三次原地翻转**：` +
          `① 整体翻转；② 翻转前 k 个；③ 翻转后 n-k 个。` +
          `原理一句话：**轮转 = 两段交换左右位置**，整体翻转让两段就位（内部顺序全倒），` +
          `再各自翻回来 —— 反转是自己的逆运算，两次反转让内部顺序复原。`),
  )

  if (k === 0) {
    snap(
      'done',
      `取模后 \`k = 0\`，数组不变：\`[${arr.join(', ')}]\`。` +
        `顺带一个语言坑：Python 切片写法 \`nums[-k:] + nums[:-k]\` 在 k=0 时会炸 —— ` +
        `\`-0\` 就是 \`0\`，\`nums[-0:]\` 是**整个数组**，结果变成"数组接上自己"。` +
        `所以切片法必须先取模、再特判 k=0（或写 \`nums[n-k:]\`）。`,
    )
    return steps
  }

  const rounds = [
    { a: 0, b: n - 1, name: '整体翻转' },
    { a: 0, b: k - 1, name: '翻转前 k' },
    { a: k, b: n - 1, name: '翻转后 n-k' },
  ]

  let roundNo = 0
  for (const { a, b, name } of rounds) {
    roundNo += 1
    let swapsDone = 0
    let i = a
    let j = b
    while (i < j) {
      const tmp = arr[i]
      arr[i] = arr[j]
      arr[j] = tmp
      swapsDone += 1
      snap(
        'flip',
        `**第 \`${roundNo}\` 次（${name}，区间 \`[${a}, ${b}]\`）**：交换 \`i = ${i}\` 与 \`j = ${j}\` —— ` +
          `\`${arr[j]}\` 和 \`${arr[i]}\` 换位（swap 后），数组变成 \`[${arr.join(', ')}]\`。` +
          `双指针向中间收拢：\`i → ${i + 1}\`，\`j → ${j - 1}\`。` +
          (i + 1 < j - 1 ? ` 还有交换要做。` : i + 1 === j - 1 ? ` 还剩中间一对。` : ` 本轮翻转完成。`),
        {
          round: roundNo,
          roundName: name,
          flipRange: [a, b],
          i,
          j,
          swapsDone,
        },
      )
      i += 1
      j -= 1
    }
    if (swapsDone === 0) {
      snap(
        'flip',
        `**第 \`${roundNo}\` 次（${name}，区间 \`[${a}, ${b}]\`）**：区间长度不足 2，` +
          `不需要交换（k = 1 时"前 k 个"就是单元素，天然有序）。`,
        { round: roundNo, roundName: name, flipRange: [a, b], i: null, j: null, swapsDone: 0 },
      )
    }
  }

  snap(
    'done',
    `三次翻转完成。**答案 = [${arr.join(', ')}]**。` +
      `回头看这三步：每一步都只做**原地交换**，总共 ${roundNo} 轮、每轮扫描一半区间，` +
      `时间 \`O(n)\`，**额外空间 O(1)** —— 这就是题目进阶要的答案。` +
      `对照另一种 O(1) 解法"环状替换"（从 0 出发按 \`(i + k) mod n\` 跳环，需要数 gcd 圈），` +
      `三次翻转不需要任何数论，好写好记 —— 面试首选。`,
    { arr: arr.slice(), round: 3, roundName: '完成', done: true },
  )

  return steps
}
