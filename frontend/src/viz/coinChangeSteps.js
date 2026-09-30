/**
 * coinChangeSteps.js — 「零钱兑换」(LC 322) 的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 coinChange.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 每种硬币**数量不限**，求凑出 amount 的**最少枚数**。这是最标准的
 * 「完全背包 · 求最小值」：
 *     dp[x] = 凑出金额 x 的最少硬币枚数
 *     dp[0] = 0        （零元一枚都不用）
 *     dp[x] = min over c ( dp[x-c] + 1 )     x 从 1 到 amount **正序**
 * 语义：把硬币 c 当作"最后一枚"去试 —— 剩下 x-c 的最优解再补一枚。
 *
 * 三个必须讲清的点：
 *   1. **正序**推进金额：算 dp[x] 时 dp[x-c] (x-c < x) 已经算好，
 *      而且它**允许自己已经用过硬币 c** —— 这就是"硬币无限复用"的来源。
 *      把金额反过来遍历，dp[x-c] 还是"没碰过 c"的旧值，语义立刻退化成
 *      每枚硬币最多用一次（0-1 背包）—— 这正是动画 2 对照的内容。
 *   2. 用 **∞** 初始化而不是 0：用 0 初始化等于"任何金额都凑得出、且一枚就够"，
 *      答案会大面积变成 1。∞ 才是"先假定凑不出"。
 *   3. **前驱链回溯**：只记枚数答案无法还原"用了哪些硬币"。再开一个
 *      `chosen[x]` = dp[x] 取到最小值时选中的那枚硬币，从 amount 顺着
 *      `x → x - chosen[x]` 走回 0，路径上的硬币就是最优组合。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'fill' | 'trace' | 'done'
 *   desc: string
 *   coins: number[]        // 面额（拷贝；已过滤掉非正整数）
 *   amount: number
 *   a: number              // 本帧高亮的金额格（init/done 为 -1）
 *   dp: number[]           // 本帧动作**之后**的完整 dp 快照（不可达为 Infinity）
 *   prevDp: number[]       // 本帧动作**之前**的 dp 快照
 *   trials: Array<{coin, idx, prev, value, ok, reachable}>
 *                          // fill 帧：每个硬币的候选（idx < 0 表示超出金额）
 *   best: number|null      // fill 帧：dp[a]（可能仍是 Infinity）
 *   fromCoin: number|null  // fill 帧：获胜硬币（首个严格更小者）
 *   sourceIdx: number|null // 本帧依赖的来源下标（fill: a-fromCoin；trace: a-traceCoin）
 *   traceIdx: number       // trace 帧：当前回溯到的金额（其余为 -1）
 *   traceCoin: number|null // trace 帧：本步选中的硬币
 *   picked: number[]       // trace 帧：已回溯出的硬币（回溯顺序）
 *   combination: number[]  // done 帧：还原出的最优组合（正向）
 *   result: number         // 目前答案（不可达为 -1）
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 回放一致：prevDp === 上一帧的 dp（trace 帧的 dp 不变）；
 *   2. dp[0] === 0，其余 dp[x] 要么是 Infinity，要么 >= 1（凑不出 vs 至少一枚）；
 *   3. fill 帧只在 a 这一格发生变化：dp[i] === prevDp[i] (i !== a)；
 *   4. dp[a] === min over 可用硬币的 (prevDp[a-c] + 1)，且
 *      fromCoin === 第一个取到该最小值的硬币；比较用**更新前**的 dp；
 *   5. trace 帧：dp[a] === dp[a - traceCoin] + 1，且 a 严格递减、最终落到 0；
 *   6. done 帧：result === dp[amount]（Infinity → -1）；
 *      可达时 combination 之和 === amount、长度 === result；
 *   7. dp[amount] 与"外层面额 / 内层金额正序"的完全背包参考解一致。
 */

const DEFAULT_COINS = [1, 2, 5]
const DEFAULT_AMOUNT = 11
const INF = Infinity

/** 供测试与渲染层复用的"不可达"常量。 */
export const COIN_CHANGE_INF = INF

/** 把外部入参收敛成合法的 (coins, amount)：面额只留正整数，金额只留非负整数。 */
function normalize(options = {}) {
  const raw = Array.isArray(options.coins) ? options.coins : []
  const coins = raw.filter((c) => Number.isInteger(c) && c > 0)
  const amount =
    Number.isInteger(options.amount) && options.amount >= 0 ? options.amount : DEFAULT_AMOUNT
  return { coins: coins.length > 0 ? coins : [...DEFAULT_COINS], amount }
}

const fmt = (v) => (v === INF ? '∞' : String(v))

export function buildCoinChangeSteps(options = {}) {
  const { coins, amount } = normalize(options)

  const steps = []
  const dp = new Array(amount + 1).fill(INF)
  dp[0] = 0
  const chosen = new Array(amount + 1).fill(null)

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      coins: [...coins],
      amount,
      a: -1,
      dp: [...dp],
      prevDp: [...dp],
      trials: [],
      best: null,
      fromCoin: null,
      sourceIdx: null,
      traceIdx: -1,
      traceCoin: null,
      picked: [],
      combination: [],
      result: dp[amount] === INF ? -1 : dp[amount],
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `硬币面额 \`[${coins.join(', ')}]\`，目标金额 \`${amount}\`，每种硬币**数量不限**，求最少枚数。` +
      `定义 \`dp[x]\` = 凑出金额 \`x\` 的**最少硬币枚数**：边界 \`dp[0] = 0\`（零元一枚都不用），` +
      `其余全部初始化成 **∞** —— 先假定凑不出，凑得出再往下降。` +
      `递推式 \`dp[x] = min( dp[x-c] + 1 )\`：把每枚硬币当作"最后一枚"试一遍，` +
      `看剩下的 \`x-c\` 最少要几枚、再补上这一枚。金额 \`x\` 从 1 到 ${amount} **正序**推进，` +
      `算 \`dp[x]\` 时用到的 \`dp[x-c]\`（下标更小）早已就绪 —— 这正是"硬币可以重复用"的开关。`,
  )

  for (let a = 1; a <= amount; a += 1) {
    const prevDp = [...dp]
    const trials = []
    let best = INF
    let fromCoin = null

    for (const c of coins) {
      const idx = a - c
      if (idx < 0) {
        trials.push({ coin: c, idx: -1, prev: null, value: INF, ok: false, reachable: false })
        continue
      }
      const prev = prevDp[idx]
      const value = prev + 1 // prev === Infinity 时结果仍是 Infinity
      const ok = value < best // 首个严格更小者获胜（同分不换，保证组合确定）
      if (ok) {
        best = value
        fromCoin = c
      }
      trials.push({ coin: c, idx, prev, value, ok, reachable: prev !== INF })
    }

    dp[a] = best
    chosen[a] = fromCoin

    const detail = trials
      .map((t) =>
        t.idx < 0
          ? `\`${t.coin}\` 比 ${a} 大，跳过`
          : t.prev === INF
            ? `\`${t.coin}\`：dp[${t.idx}] = ∞ 此路不通`
            : `\`${t.coin}\`：dp[${t.idx}] + 1 = ${t.prev} + 1 = ${t.value}${t.ok ? ' ✓' : ''}`,
      )
      .join('；')

    const sourceIdx = fromCoin === null ? null : a - fromCoin
    const msg =
      `金额 **${a}**：逐个试硬币 —— ${detail}。` +
      (fromCoin === null
        ? `三种试法全不可达，\`dp[${a}] = ∞\`（此刻还凑不出）。`
        : `最小是 ${best}（最后一枚用 \`${fromCoin}\`，来源 \`dp[${sourceIdx}] = ${fmt(prevDp[sourceIdx])}\`），` +
          `\`dp[${a}] = ${best}\`。`) +
      `注意比较用的是**更新前**的 dp，且来源格 \`${sourceIdx ?? '—'}\` 下标更小、**可能已经用过这枚硬币** —— ` +
      `无限复用就发生在这一步。`

    snap('fill', msg, {
      a,
      prevDp,
      trials,
      best,
      fromCoin,
      sourceIdx,
    })
  }

  const reachable = dp[amount] !== INF
  const picked = []
  const chain = [amount]

  if (reachable && amount > 0) {
    let cursor = amount
    while (cursor > 0) {
      const c = chosen[cursor]
      const next = cursor - c
      picked.push(c)
      chain.push(next)
      snap(
        'trace',
        `**回溯**：\`dp[${cursor}] = ${fmt(dp[cursor])}\`，取到它的最后一枚是 \`${c}\`，` +
          `于是跳到 \`dp[${next}] = ${fmt(dp[next])}\`（${fmt(dp[cursor])} = ${fmt(dp[next])} + 1）。` +
          `已锁定的硬币：${picked.map((v) => `\`${v}\``).join(' + ')}。` +
          `只记枚数还原不出组合，靠的就是这张 \`chosen\` 前驱表。`,
        {
          a: cursor,
          traceIdx: cursor,
          traceCoin: c,
          sourceIdx: next,
          picked: [...picked],
        },
      )
      cursor = next
    }
  }

  const combination = [...picked].reverse()

  snap(
    'done',
    reachable
      ? amount === 0
        ? `返回 **0**：金额为 0，一枚都不用凑。`
        : `返回 **${dp[amount]}**：组合 \`${combination.join(' + ')} = ${amount}\`，共 ${combination.length} 枚。` +
          `回溯链 \`${chain.join(' → ')}\`。` +
          `复盘：\`dp[x]\` 只在正序推进下才允许"自己再叠一枚自己"，` +
          `这是完全背包与 0-1 背包的**唯一**分界线（见动画 2）。`
      : `返回 **-1**：\`dp[${amount}] = ∞\`，任何硬币组合都凑不出 ${amount}。` +
        `注意 ∞ 在比较里会一路"沉底"—— 只有真正可达的路径才有机会刷新它。`,
    {
      a: -1,
      combination,
      picked: [...picked],
      done: true,
    },
  )

  return steps
}
