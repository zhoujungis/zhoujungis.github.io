/**
 * lisBinarySteps.js — 「最长递增子序列」(LC 300) 的 O(n log n) 二分推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 lisBinary.js。
 *
 * ── 换一套记账 ────────────────────────────────────────────────────────────
 * `dp[i] = 以 nums[i] 结尾` 的问题是「结尾是谁」有 n 种可能，没法二分。
 * 换一个锚：**按下标（长度）记账，只留「该长度下最小的末尾值」**：
 *
 *     tails[len] = 所有长度为 len + 1 的递增子序列中，末尾元素的最小值
 *
 * 这个定义有个漂亮的性质：**tails 本身严格递增**（反证：若 tails[a] >= tails[b]
 * 且 a < b，那把长度为 b+1、末尾为 tails[b] 的那条子序列砍到前 a+1 项，末尾
 * 一定小于 tails[a]，与「tails[a] 是同长度下最小」矛盾）。
 *
 * 于是每来一个 x，只需要在 tails 里找**第一个 >= x 的位置 pos**（bisect_left）：
 *   - pos 存在 → 把 tails[pos] 换成 x（同长度下末尾更小了，**更利于后面接**）；
 *   - pos 就是末尾之外 → 说明 x 比所有末尾都大，**追加**，长度 +1。
 * 答案 = tails 的长度。
 *
 * ⚠️ tails **不是**那条最长递增子序列本身，它只是「每个长度下的最优末尾」的
 * 登记表。长度是对的，内容被覆盖过。这是本解法最容易被误解的一点。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'bisect' | 'place' | 'done'
 *   desc: string
 *   nums, n
 *   i, x                    // 当前元素下标与值
 *   tails: number[]         // 快照（place 帧是处理之后的）
 *   lo, hi, mid             // bisect 帧的搜索区间与探针（闭开区间 [lo, hi)）
 *   goRight: boolean        // tails[mid] < x → 往右收，否则往左收
 *   pos: number|null        // 二分收敛得到的位置
 *   kind: 'replace'|'append'
 *   prevVal: number|null    // replace 时被换掉的旧值
 *   answer: number          // = tails.length，即「目前找到的最长长度」
 *   done: boolean
 */

const DEFAULT_NUMS = [10, 9, 2, 5, 3, 7, 101, 18]

export function buildLisBinarySteps(options = {}) {
  const raw = Array.isArray(options.nums) ? options.nums : DEFAULT_NUMS
  const nums = raw.slice()
  const n = nums.length
  const steps = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      nums,
      n,
      i: null,
      x: null,
      tails: [],
      lo: null,
      hi: null,
      mid: null,
      goRight: null,
      pos: null,
      kind: null,
      prevVal: null,
      answer: 0,
      done: phase === 'done',
      ...extra,
    })
  }

  if (n === 0) {
    snap('done', '数组为空 —— 没有任何子序列，答案是 `0`。', { done: true })
    return steps
  }

  snap(
    'init',
    `同一个数组 \`[${nums.join(', ')}]\`，这次要在 \`O(n log n)\` 里做完。` +
      `上一版按「以 \`i\` 结尾」记账，结尾有 \`n\` 种可能，没法二分；` +
      `这一版换一个锚 —— **按下标（也就是长度）记账**：` +
      `\`tails[len]\` 表示**所有长度为 \`len + 1\` 的递增子序列里，末尾元素的最小值**。` +
      `这个定义自带一个漂亮性质：**\`tails\` 本身严格递增**。` +
      `于是每来一个 \`x\`，只要在 \`tails\` 里找**第一个 \`>= x\` 的位置**：` +
      `找到了就把它换成 \`x\`（同长度下末尾更小，对后面更有利），没找到就**追加**、长度加一。` +
      `**答案就是 \`tails\` 的长度。**`,
  )

  const tails = []

  for (let i = 0; i < n; i += 1) {
    const x = nums[i]
    let lo = 0
    let hi = tails.length

    while (lo < hi) {
      const mid = (lo + hi) >> 1
      const goRight = tails[mid] < x
      snap(
        'bisect',
        `\`i = ${i}\`（值 \`${x}\`）在 \`tails = [${tails.join(', ')}]\` 里二分，` +
          `找**第一个 \`>= ${x}\` 的位置**。当前区间 \`[${lo}, ${hi})\`，探针 \`mid = ${mid}\`：` +
          `\`tails[${mid}] = ${tails[mid]}\` —— ` +
          (goRight
            ? `\`${tails[mid]} < ${x}\`，这个位置**不是**答案，往右收：\`lo = ${mid + 1}\`。`
            : `\`${tails[mid]} >= ${x}\`，这个位置**可能就是**答案，且左边也可能有，往左收：\`hi = ${mid}\`。`),
        { i, x, tails: tails.slice(), lo, hi, mid, goRight, answer: tails.length },
      )
      if (goRight) lo = mid + 1
      else hi = mid
    }

    const pos = lo
    const kind = pos < tails.length ? 'replace' : 'append'
    let prevVal = null

    if (kind === 'replace') {
      prevVal = tails[pos]
      tails[pos] = x
    } else {
      tails.push(x)
    }

    snap(
      'place',
      kind === 'replace'
        ? `二分收敛：区间收缩到空，\`pos = ${pos}\`。\`tails[${pos}] = ${prevVal}\` 是**第一个 \`>= ${x}\` 的位置**，` +
            `把它换成 \`${x}\` —— 长度 \`${pos + 1}\` 这一档的末尾值从 \`${prevVal}\` 降到 \`${x}\`，` +
            `**同长度下末尾更小，对后面接数更有利**。长度不变：答案仍是 \`${tails.length}\`。` +
            `注意：\`tails\` 里的 **\`${prevVal}\` 被覆盖掉了**，它并不代表「原序列里 \`${prevVal}\` 被删了」—— tails 只是登记表。`
        : `二分收敛：区间收缩到空，\`pos = ${pos}\`，正好是 \`tails\` 的末尾之外 —— ` +
            `说明 \`${x}\` 比当前所有末尾都大，可以**追加**。长度 \`${pos}\` 变 \`${pos + 1}\`，` +
            `**答案涨到 \`${tails.length}\`**。`,
      {
        i,
        x,
        tails: tails.slice(),
        lo: pos,
        hi: pos,
        mid: null,
        pos,
        kind,
        prevVal,
        answer: tails.length,
      },
    )
  }

  snap(
    'done',
    `\`${n}\` 个元素处理完，\`tails = [${tails.join(', ')}]\`，**答案 = 长度 = ${tails.length}**。` +
      `三点必须记住：① \`tails\` **不是**那条最长递增子序列 —— 它只是「每个长度下的最小末尾」` +
      `登记表，位置会被后来的更小值覆盖（你可以回放看看金框那几步），但**长度一定是正确答案**；` +
      `② 每个元素只做一次二分，时间 \`O(n log n)\`，\`tails\` 最多 \`O(n)\` 空间；` +
      `③ 求「最长不减」子序列时二分换成 \`bisect_right\`（找第一个 \`> x\` 的位置），否则相等元素会被误替换。`,
    { i: n - 1, tails: tails.slice(), answer: tails.length, done: true },
  )

  return steps
}
