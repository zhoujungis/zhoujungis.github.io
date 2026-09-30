/**
 * lisDpSteps.js — 「最长递增子序列」(LC 300) 的 O(n^2) 动态规划推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 lisDp.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 「子序列」可以跳着挑，这是全部难度的来源：一个元素要不要，取决于它前面
 * 已经挑了什么。所以状态必须**加一个锚** ——
 *
 *     dp[i] = 以 nums[i] **结尾**的最长递增子序列长度
 *
 * 有了「以谁结尾」这个锚，问题就从「整段怎么挑」退化成「我接在谁后面」：
 *
 *     dp[i] = 1 + max(dp[j])  对 j < i 且 nums[j] < nums[i]
 *     找不到这样的 j 就单独成串，取 1
 *
 * 注意 dp 是「以 i 结尾」而不是「前 i 个里最长」—— 后者写不出转移，
 * 因为「前 i 个里最长」的那条链未必能接上 nums[i]。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'scan' | 'settle' | 'done'
 *   desc: string
 *   nums, n
 *   i: number|null          // 当前正在定型的右端点
 *   j: number|null          // 本帧回看的左端点（scan 帧）
 *   ok: boolean             // nums[j] < nums[i]，能不能接
 *   better: boolean         // 接上去比当前最好成绩更长
 *   dp: number[]            // 快照；dp[i] 在扫描中就是「当前最好成绩」
 *   parent: number[]        // 最优前驱（-1 表示没有）—— 渲染层用它回溯高亮链
 *   cands: number[]         // 本轮所有满足 nums[j] < nums[i] 的 j
 *   best, bestJ             // 本帧的最好成绩与前驱
 *   settled: number         // 已定型的下标个数
 *   answer: number          // max(dp[0..settled-1])
 *   bestEnd: number|null    // 目前的全局最优链的末端下标（done 帧用）
 *   done: boolean
 *
 * ⚠️ `dp[i]` 在 scan 帧里是**就地生长**的（每刷新一次就写进去），不是等
 * settle 帧才落笔。这样 dp 快照逐帧自洽，渲染层不必猜「这一格现在算不算数」。
 */

const DEFAULT_NUMS = [10, 9, 2, 5, 3, 7, 101, 18]

export function buildLisDpSteps(options = {}) {
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
      j: null,
      ok: false,
      better: false,
      dp: [],
      parent: [],
      cands: [],
      best: null,
      bestJ: null,
      settled: 0,
      answer: 0,
      bestEnd: null,
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
    `给了数组 \`[${nums.join(', ')}]\`，要**最长严格递增子序列**的长度。注意「子序列」不是「子数组」：` +
      `元素可以跳着挑，只要保持原来的先后顺序 —— 这一点正是难度的全部来源。` +
      `破局的办法是给状态**加一个锚**：\`dp[i]\` 表示**以 \`nums[i]\` 结尾**的最长递增子序列长度。` +
      `锚一加上，问题就从「整段怎么挑」退化成「我接在谁后面」：` +
      `\`dp[i] = 1 + max(dp[j])\`，其中 \`j < i\` 且 \`nums[j] < nums[i]\`；接不上就单独成串，取 \`1\`。` +
      `最后答案是**整个 \`dp\` 数组的最大值**，不是 \`dp[n - 1]\`。`,
  )

  const dp = new Array(n).fill(1)
  const parent = new Array(n).fill(-1)
  let answer = 0
  let bestEnd = null

  for (let i = 0; i < n; i += 1) {
    const xi = nums[i]
    let best = 1
    let bestJ = -1
    const cands = []
    dp[i] = 1
    parent[i] = -1

    for (let j = 0; j < i; j += 1) {
      const xj = nums[j]
      const ok = xj < xi
      if (ok) cands.push(j)
      const better = ok && dp[j] + 1 > best

      const parts = [`回看 \`j = ${j}\`（值 \`${xj}\`）：`]
      if (!ok) {
        parts.push(`\`${xj} >= ${xi}\` —— **接不上**：递增序列里下一个数必须严格更大。`)
      } else if (better) {
        const prevBest = best
        best = dp[j] + 1
        bestJ = j
        parts.push(
          `\`${xj} < ${xi}\` 能接，而且 \`dp[${j}] + 1 = ${dp[j]} + 1 = ${best}\`，` +
            `**比当前最好成绩 \`${prevBest}\` 更长** —— 刷新：\`dp[${i}] = ${best}\`，` +
            `最优前驱 \`parent[${i}] = ${j}\`。`,
        )
      } else {
        parts.push(
          `\`${xj} < ${xi}\` 能接，但 \`dp[${j}] + 1 = ${dp[j] + 1} <= ${best}\`，` +
            `**不如下面那条链长**，不刷新。`,
        )
      }

      if (better) {
        dp[i] = best
        parent[i] = bestJ
      }
      parts.push(
        `本轮能接的前驱有 \`${cands.length}\` 个 \`[${cands.join(', ')}]\`，` +
          `此刻 \`dp[${i}] = ${best}\`。`,
      )

      snap('scan', parts.join(''), {
        i,
        j,
        ok,
        better,
        dp: dp.slice(),
        parent: parent.slice(),
        cands: cands.slice(),
        best,
        bestJ,
        settled: i,
        answer,
        bestEnd,
      })
    }

    dp[i] = best
    parent[i] = bestJ
    const prevAnswer = answer
    if (best > answer) {
      answer = best
      bestEnd = i
    }

    snap(
      'settle',
      `\`i = ${i}\`（值 \`${xi}\`）这一轮扫完、定型：` +
        (bestJ >= 0
          ? `最优前驱是 \`j = ${bestJ}\`（值 \`${nums[bestJ]}\`，\`dp = ${dp[bestJ]}\`），` +
            `所以 \`dp[${i}] = ${best}\` —— 就是把 \`${xi}\` 接在 \`j = ${bestJ}\` 那条链的尾巴上。`
          : `前面没有任何比 \`${xi}\` 小的元素，接不上任何人，只能自己单独成串：\`dp[${i}] = 1\`。`) +
        (best > prevAnswer
          ? `**全局最长刷新到 \`${answer}\`**（链的末端是 \`i = ${bestEnd}\`）。`
          : `全局最长仍然是 \`${answer}\`，没有被刷新。`),
      {
        i,
        dp: dp.slice(),
        parent: parent.slice(),
        cands: cands.slice(),
        best,
        bestJ,
        settled: i + 1,
        answer,
        bestEnd,
      },
    )
  }

  snap(
    'done',
    `\`${n}\` 个位置全部定型：\`dp = [${dp.join(', ')}]\`。` +
      `答案是**整个 \`dp\` 的最大值** \`${answer}\`，出现在 \`i = ${bestEnd}\`（值 \`${nums[bestEnd]}\`）—— ` +
      `**不是 \`dp[${n - 1}] = ${dp[n - 1]}\`**，这是本题第一大坑，而官方样例恰好让两者相等。` +
      `金框那条就是一条最长递增子序列，长度 \`${answer}\`。` +
      `复杂度：每个 \`i\` 都要往回看一遍，时间 \`O(n^2)\`；\`dp\` 和 \`parent\` 各 \`O(n)\` 空间。` +
      `想压到 \`O(n log n)\`，得换一套记账方式 —— 看下一个动画。`,
    {
      i: n - 1,
      dp: dp.slice(),
      parent: parent.slice(),
      settled: n,
      answer,
      bestEnd,
      done: true,
    },
  )

  return steps
}
