/**
 * kadaneSteps.js — 「最大子数组和」(LeetCode 53) 推演的状态机
 * （纯函数，不碰 DOM）。
 *
 * ── 算法（Kadane）───────────────────────────────────────────────────────
 *
 *     def maxSubArray(nums):
 *         cur = best = nums[0]
 *         for x in nums[1:]:
 *             cur = max(x, cur + x)      # ← 整道题只有这一句
 *             best = max(best, cur)
 *         return best
 *
 * 带子数组位置的版本（本动画用这个，因为要画出区间）：
 *
 *     cur = best = nums[0]
 *     start = bestStart = bestEnd = 0
 *     for i in range(1, n):
 *         if cur < 0:                    # 前面那段是负资产 → 扔掉，从 i 重新开始
 *             cur = nums[i]
 *             start = i
 *         else:                          # 前面那段是正的 → 带上，只会更好
 *             cur = cur + nums[i]
 *         if cur > best:
 *             best = cur
 *             bestStart, bestEnd = start, i
 *
 * ── 整道题只有一句话 ────────────────────────────────────────────────────
 *
 * 从左到右扫，只维护一个量：**「以当前位置结尾的最大子数组和」**，记做 `cur`。
 * 扫到 `x` 时只有两种选择：
 *
 *     ① 接在当前这段后面 → `cur + x`
 *     ② 从 `x` 自己重新开始 → `x`
 *
 * 取更大的那个：`cur = max(x, cur + x)`。
 *
 * **这一步其实只在问一件事：带上前面那段，是赚了还是亏了？**
 *
 * 如果 `cur < 0`，那么 `cur + x < x` —— 前面那段是**负资产**，接上只会更差，
 * 不如从 `x` 重新开始。这就是 `cur < 0 → 重置` 这条规则的来历。
 * （等价关系：`cur + x > x` ⟺ `cur > 0`，所以"接上"的条件就是"前面那段为正"。）
 *
 * 全程再用一个 `best` 记录 `cur` 的历史最大值 —— 扫完就是答案。
 *
 * ── 一个必须点破的等价写法 ──────────────────────────────────────────────
 *
 *     cur = max(x, cur + x)          # 值视角：两个候选取大
 *     if cur < 0: 从 x 重新开始       # 位置视角：判据是"前面那段是不是负的"
 *
 * 这两句是同一件事的两种说法。写返回值用第一句，写"返回子数组本身"必须用第二句
 * （因为位置只存在于第二句里）。
 *
 * ── 一个 step 长这样 ────────────────────────────────────────────────────
 *   {
 *     phase: 'init' | 'extend' | 'restart' | 'done',
 *     desc:  string,
 *     nums: number[],        // 原数组（静态）
 *     i: number,             // 当前下标
 *     x: number|null,        // nums[i]
 *     cur: number,           // 当前子数组和（以 i 结尾的最大和）
 *     best: number,          // 历史最优
 *     start: number,         // 当前子数组起点
 *     end: number,           // 当前子数组终点（= i）
 *     bestStart: number,     // 最优区间起点
 *     bestEnd: number,       // 最优区间终点
 *     reset: boolean,        // 本帧是否发生了"重新开始"
 *     dropped: {from,to}|null,  // restart 帧：被扔掉的那一段（渲染层画成灰虚线）
 *     improved: boolean,     // 本帧是否刷新了 best
 *     done: boolean,
 *   }
 *
 * ── 变体（文章里用代码 / 表格讲，不给状态机开 mode）───────────────────
 *
 * 分治（四元组 l_sum / r_sum / i_sum / m_sum，O(n log n)）—— **形态完全不同**，
 * 是线段树的基础，文章单开一节。
 * LC 918 环形版（max(普通 Kadane, 总和 - 最小子数组和)）—— 环形，另开一节。
 * 121 买卖股票（差值版 Kadane）/ 152 乘积最大（同时维护最大和最小）
 * / 1191 K 次串联 / 1749 绝对值最大 —— 都在变体节用代码讲。
 */

const DEFAULT_NUMS = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

/**
 * 构造推演步骤。
 *
 * @param {{
 *   nums?: number[],
 *   maxSteps?: number,
 * }} [options]
 * @returns {object[]}
 */
export function buildKadaneSteps(options = {}) {
  // ⚠️ 空数组是合法输入（虽然题面保证 n >= 1），守卫用 Array.isArray，不能用 .length。
  const nums = Array.isArray(options.nums) ? options.nums : DEFAULT_NUMS
  const n = nums.length
  const maxSteps = Number.isInteger(options.maxSteps) ? options.maxSteps : 400

  const base = {
    nums: [...nums],
    i: -1,
    x: null,
    cur: 0,
    best: 0,
    start: 0,
    end: 0,
    bestStart: 0,
    bestEnd: 0,
    reset: false,
    dropped: null,
    improved: false,
  }

  if (n === 0) {
    return [
      {
        ...base,
        phase: 'done',
        desc:
          `**空数组** —— 一个元素都没有，凑不出子数组。题目保证 \`n >= 1\`，` +
          `但状态机要有安静的出口。`,
        done: true,
      },
    ]
  }

  const steps = []
  let cur = nums[0]
  let best = nums[0]
  let start = 0
  let end = 0
  let bestStart = 0
  let bestEnd = 0
  let guard = 0

  /** 拍一帧。 */
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      ...base,
      i: end,
      cur,
      best,
      start,
      end,
      bestStart,
      bestEnd,
      phase,
      desc,
      done: phase === 'done',
      ...extra,
    })
  }

  // ── 帧 1：立规则 ────────────────────────────────────────────────────────
  snap(
    'init',
    `要在 \`[${nums.join(', ')}]\` 里找一个**连续**的子数组，让它的和最大。` +
      `子数组至少要含一个元素，所以答案**不可能是 0**（全负数时答案是那个最大的负数）。` +
      `暴力枚举所有起点终点是 \`O(n²)\`（用前缀和能把内层降到 O(1)，但外层还是 n² 个组合）。` +
      `Kadane 的想法是：**从左到右扫，只维护一个量 —— 「以当前位置结尾的最大子数组和」**，记做 \`cur\`。` +
      `扫到 \`x\` 时只有两种选择：① 接在当前这段后面 → \`cur + x\`；② 从 \`x\` 自己重新开始 → \`x\`。` +
      `取更大的那个：\`cur = max(x, cur + x)\`。` +
      `**这一句从头到尾只在问一件事：带上前面那段，是赚了还是亏了？**` +
      `如果 \`cur < 0\`，那么 \`cur + x < x\` —— 前面那段是**负资产**，接上只会更差，` +
      `不如从 \`x\` 重新开始。全程再用一个 \`best\` 记录 \`cur\` 的历史最大值，扫完就是答案。` +
      `先从 \`nums[0] = ${nums[0]}\` 起步：\`cur = best = ${nums[0]}\`。`,
    { x: nums[0] },
  )

  for (let i = 1; i < n; i += 1) {
    guard += 1
    if (guard > maxSteps) break

    const x = nums[i]
    end = i
    const prevCur = cur
    const prevBest = best

    if (cur < 0) {
      // ── 重置：前面那段是负资产 ──
      const oldStart = start
      cur = x
      start = i
      const improved = cur > best
      if (improved) {
        best = cur
        bestStart = start
        bestEnd = i
      }
      snap(
        'restart',
        `\`i = ${i}\`，\`nums[${i}] = ${x}\`。当前这段的和 \`cur = ${prevCur}\` —— **它是负的**。` +
          `带上一段负数只会让总和变小：\`(${prevCur}) + ${x} = ${prevCur + x}\`，还不如 \`${x}\` 自己。` +
          `所以**把前面整段扔掉，从 \`${i}\` 重新开始**：\`cur = ${x}\`，` +
          `当前子数组收缩成 \`[${x}]\`（起点重设为 \`${i}\`）。` +
          (improved
            ? ` 再看全局：\`${x} > ${prevBest}\`，**刷新最优** —— \`best = ${best}\`，` +
              `最优区间记成 \`nums[${bestStart}..${bestEnd}]\`。`
            : ` 再看全局：\`${x}\` 没能超过历史最好的 \`${prevBest}\`，\`best\` 保持 \`${best}\`。`),
        { i, x, reset: true, improved, dropped: { from: oldStart, to: i - 1 } },
      )
    } else {
      // ── 接上：前面那段是正的 ──
      cur = cur + x
      const improved = cur > best
      if (improved) {
        best = cur
        bestStart = start
        bestEnd = i
      }
      snap(
        'extend',
        `\`i = ${i}\`，\`nums[${i}] = ${x}\`。当前这段的和 \`cur = ${prevCur}\` 是**非负的** —— ` +
          `带上它总不亏：\`${prevCur} + ${x} = ${cur}\`，比 \`${x}\` 自己更大。` +
          `所以**接上去**：\`cur = ${cur}\`，当前子数组变成 \`nums[${start}..${i}]\`。` +
          (improved
            ? ` 再看全局：\`${cur} > ${prevBest}\`，**刷新最优** —— \`best = ${best}\`，` +
              `最优区间记成 \`nums[${bestStart}..${bestEnd}]\`。`
            : ` 再看全局：\`${cur}\` 没超过历史最好的 \`${prevBest}\`，\`best\` 保持 \`${best}\`。`),
        { i, x, improved },
      )
    }
  }

  // ── 收尾 ────────────────────────────────────────────────────────────────
  // ⚠️ 收尾帧保留语义字段的**真实值**（cur / best / 各区间都是最后那一刻的状态），
  // 不去复写它们 —— 逐帧不变量在收尾帧依然成立，单测不用开例外。
  const sliceStr = nums.slice(bestStart, bestEnd + 1).join(', ')
  snap(
    'done',
    `扫描结束。**答案 = \`${best}\`**，对应的子数组是 \`nums[${bestStart}..${bestEnd}]\` = \`[${sliceStr}]\`。` +
      ` 回头看这趟做了什么：每个元素**只被看过一次**，每次只做两次比较 —— ` +
      `所以是 **\`O(n)\` 时间、\`O(1)\` 空间**。这已经是理论下界了：` +
      `至少得把每个元素看一遍，不可能比 \`O(n)\` 更快。` +
      `而那句 \`cur = max(x, cur + x)\` 从头到尾只在问一件事：**我前面那段，是资产还是负资产？**` +
      `负的就扔掉重起，正的就一起带上 —— 就这一条规则，把 \`O(n²)\` 压成了 \`O(n)\`。`,
    { i: n - 1, x: nums[n - 1], done: true },
  )

  return steps
}
