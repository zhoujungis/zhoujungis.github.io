/**
 * greatestSumDiv3DpSteps.js — 「可被三整除的最大和」(LC 1262) 取模 dp 视角的状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 greatestSumDiv3Dp.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 贪心依赖"元素全为正"。换成**三格滚动 dp** 则对负数也成立：
 *     dp[j] = 当前前缀里，子集和 ≡ j (mod 3) 的最大和（j ∈ {0,1,2}）
 *     初值 dp = [0, −∞, −∞]      （空集：和 0、余 0）
 *     对每个 x：先拷贝 old = dp；再 old[j] != −∞ 时
 *         dp[(j + x%3) % 3] = max(dp[...], old[j] + x)
 *
 * 三个必须讲清的点：
 *   1. **先快照再写** = 0-1 背包的"每件只用一次"；不拷贝则同一个 x 会被用两次。
 *   2. **−∞ 当不可达**：用 0 会让余 1/余 2 一开始就"可达且和为 0"，max 选错。
 *   3. **只用三个状态**：余数只有 3 种，空间 O(1)。
 *
 * 帧字段：
 *   phase: 'init' | 'fill' | 'done'
 *   desc: string
 *   nums: number[]          // 原数组（拷贝）
 *   n: number
 *   i: number               // fill 帧：正在处理的下标（其余 -1）
 *   x: number               // fill 帧：当前元素
 *   rem: number             // x 对 3 的余数（0..2）
 *   dp: number[]            // 本帧动作**之后**的状态（不可达为 −Infinity）
 *   prevDp: number[]        // 本帧动作**之前**的状态
 *   transitions: Array<{from, to, prev, value, ok}>
 *                           // fill 帧：每个可达旧状态的候选转移
 *   result: number          // dp[0]
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 回放一致：prevDp === 上一帧的 dp；
 *   2. dp[0] 恒可达（>= 0），即一定存在"和能凑成余 0"的子集（空集兜底）；
 *   3. fill 帧只在 (j + rem) % 3 这些目标格上变化，且只增不减；
 *   4. transitions 恰覆盖所有 prevDp[j] != −∞ 的 j，其 to 两两不同（加法是双射）；
 *   5. result === dp[0]，且与"枚举全部子集"的暴力参考解一致。
 */

const DEFAULT_NUMS = [3, 6, 5, 1, 8]
const NEG = -Infinity

/** 供测试与渲染层复用的常量。 */
export const GREATEST_SUM_DIV3_NEG = NEG
export const GREATEST_SUM_DIV3_DP_DEFAULT_NUMS = DEFAULT_NUMS

function normalize(options = {}) {
  const raw = Array.isArray(options.nums) ? options.nums : []
  const nums = raw.filter((v) => Number.isInteger(v))
  return { nums: nums.length > 0 ? nums : [...DEFAULT_NUMS] }
}

export function buildGreatestSumDiv3DpSteps(options = {}) {
  const { nums } = normalize(options)
  const n = nums.length

  const steps = []
  const dp = [0, NEG, NEG]

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      nums: [...nums],
      n,
      i: -1,
      x: 0,
      rem: 0,
      dp: [...dp],
      prevDp: [...dp],
      transitions: [],
      result: dp[0],
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `换一台机器：**三格滚动 dp**。定义 \`dp[j]\` = 当前已扫描的前缀里，` +
      `子集和 \`≡ j (mod 3)\` 的**最大和**（j ∈ {0, 1, 2}）。` +
      `初值 \`dp = [0, −∞, −∞]\`：空集的和是 0、余 0；余 1、余 2 暂时不可达，给 \`−∞\`。` +
      `对每个元素 \`x\`，先**快照** \`old = dp\`，再枚举旧状态 \`j\`：` +
      `\`dp[(j + x%3) % 3] = max(dp[...], old[j] + x)\`。` +
      `**先快照再写**是 0-1 背包的"每件只用一次"——不拷贝的话，同一个 \`x\` 会被用两遍。`,
  )

  for (let i = 0; i < n; i += 1) {
    const x = nums[i]
    const rem = ((x % 3) + 3) % 3
    const prevDp = [...dp]
    const transitions = []
    for (let j = 0; j < 3; j += 1) {
      if (prevDp[j] === NEG) continue
      const to = (j + rem) % 3
      const value = prevDp[j] + x
      const ok = value > dp[to]
      if (ok) dp[to] = value
      transitions.push({ from: j, to, prev: prevDp[j], value, ok })
    }

    const detail = transitions
      .map((t) => `\`dp[${t.from}]\`(=${fmt(t.prev)}) + ${x} → \`dp[${t.to}]\` = ${t.value}${t.ok ? ' ✓' : '（没刷新）'}`)
      .join('；')

    snap(
      'fill',
      `处理 \`nums[${i}] = ${x}\`（余 ${rem}）：逐个试旧状态 —— ${detail}。` +
        `本轮只有 \`to\` 指向的那几格可能被刷新：加法 \`(j + ${rem}) % 3\` 是**双射**，` +
        `不同的 \`j\` 落在不同的 \`to\` 上，互不打架。` +
        `当前 \`dp = [${dp.map(fmt).join(', ')}]\`。` +
        `注意读的是**快照 \`old\`**，所以这个元素只被用了一次。`,
      { i, x, rem, prevDp, transitions },
    )
  }

  snap(
    'done',
    `返回 **${dp[0]}**（\`dp[0]\`）。最终 \`dp = [${dp.map(fmt).join(', ')}]\` —— ` +
      `余 1、余 2 那两格是**中间产物**：它们留着，是为了后面还能被别的数"救"回到余 0。` +
      `与贪心对照：贪心靠"元素全为正 + 削最小"，dp 不依赖正负，且同样 \`O(n)\` / \`O(1)\`。`,
    { done: true },
  )

  return steps
}

function fmt(v) {
  return v === NEG ? '−∞' : String(v)
}
