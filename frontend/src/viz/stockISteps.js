/**
 * stockISteps.js — 「买卖股票的最佳时机 I」(LC 121) 的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 stockI.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 121 只许买卖**一次**，且必须先买后卖。暴力是 O(n²) 枚举所有 (买, 卖) 对；
 * 一维扫描把它压成两个变量：
 *   minPrice —— **截至昨天**出现过的最低价（我此刻手里那笔"最便宜的买入"）；
 *   best     —— 以"今天卖出"为前提能得到的历史最大利润。
 * 每来一天只做两件事：先用今天的价格卖一把（candidate = price - minPrice），
 * 再把今天纳入历史最低价（minPrice = min(minPrice, price)）。
 * **顺序不能反**：先更新 minPrice 再算 candidate，等于"今天买今天卖"，
 * candidate 恒为 0 —— 这正是 121 最常见的写错姿势。
 *
 * 换个说法：minPrice 是"历史最低价"，best 是"如果今天清仓、史上最赚的一天"。
 * 答案 = max over 卖出日 (price[卖出日] - min(price[买入日..卖出日-1]))。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'scan' | 'done'
 *   desc: string
 *   prices: number[]      // 每日价格（拷贝）
 *   day: number           // 本帧处理的交易日（init 帧为 0，即"第 0 天建仓"）
 *   price: number|null    // scan 帧：prices[day]
 *   prevPrice: number|null// scan 帧：prices[day-1]（供渲染层画箭头）
 *   minPrice: number      // 本帧动作**之后**的历史最低价
 *   prevMin: number       // 本帧动作**之前**的历史最低价
 *   candidate: number|null// scan 帧：price - prevMin（今天卖出的账面利润）
 *   best: number          // 本帧动作**之后**的最大利润
 *   prevBest: number      // 本帧动作**之前**的最大利润
 *   updated: 'best' | 'minPrice' | 'none' | null
 *              // scan 帧：本帧更新了哪个变量（both 不可能，见下）；init/done 为 null
 *   result: number        // 目前的答案（= best）
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 回放一致：prevMin/prevBest === 上一帧的 minPrice/best；
 *   2. candidate === price - prevMin（先卖后更新的直接证据）；
 *   3. best === max(prevBest, candidate) 且 minPrice === min(prevMin, price)；
 *   4. best 单调不减、minPrice 单调不增；
 *   5. updated 只能是 'best' | 'minPrice' | 'none' —— 'both' 逻辑上不可能
 *      （price < prevMin ⇒ candidate < 0 ⇒ best 不动；price > prevMin ⇒ minPrice 不动）；
 *   6. done 帧：result === 暴力双循环的最大利润（全程下跌则为 0，即"不买"）。
 */

const DEFAULT_PRICES = [7, 1, 5, 3, 6, 4]

export function buildStockISteps(options = {}) {
  const prices =
    Array.isArray(options.prices) && options.prices.length > 0
      ? [...options.prices]
      : [...DEFAULT_PRICES]

  const steps = []
  let minPrice = prices[0]
  let best = 0

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      prices: [...prices],
      day: 0,
      price: null,
      prevPrice: null,
      minPrice,
      prevMin: minPrice,
      candidate: null,
      best,
      prevBest: best,
      updated: null,
      result: best,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `价格序列 \`[${prices.join(', ')}]\`。只许**买卖一次**（先买后卖），求最大利润。` +
      `暴力枚举所有 (买, 卖) 对是 \`O(n²)\`；一维扫描只需两个变量：` +
      `\`minPrice\` = **截至昨天**的历史最低价（我手里最便宜的那笔买入），` +
      `\`best\` = 历史最大的"今天卖出"利润。开局第 0 天：\`minPrice = ${prices[0]}\`，还没卖过，\`best = 0\`。` +
      `每天两件事、**顺序固定**：先按今天的价格卖一把，再把今天并入历史最低价 —— 反了就变成"今天买今天卖"。`,
    { day: 0, minPrice: prices[0], prevMin: prices[0], best: 0, prevBest: 0 },
  )

  for (let day = 1; day < prices.length; day += 1) {
    const price = prices[day]
    const prevPrice = prices[day - 1]
    const prevMin = minPrice
    const prevBest = best
    const candidate = price - prevMin

    const newBest = Math.max(prevBest, candidate)
    const newMin = Math.min(prevMin, price)
    const updated = newBest > prevBest ? 'best' : newMin < prevMin ? 'minPrice' : 'none'

    best = newBest
    minPrice = newMin

    let msg
    if (updated === 'best') {
      msg =
        `**第 ${day} 天** \`price = ${price}\`：先卖一把 —— \`candidate = ${price} - ${prevMin} = ${candidate}\`，` +
        `\`best = max(${prevBest}, ${candidate}) = ${best}\` **刷新**！` +
        `历史最低价仍是 \`${prevMin}\`（今天比它贵，不更新）。` +
        `注意 candidate 用的是**更新前**的 minPrice —— 先卖后记，顺序即题意。`
    } else if (updated === 'minPrice') {
      msg =
        `**第 ${day} 天** \`price = ${price}\`：卖一把 \`candidate = ${price} - ${prevMin} = ${candidate} ≤ ${prevBest}\`，` +
        `best 不动；但今天比历史最低价还便宜，\`minPrice = ${minPrice}\` **刷新** —— ` +
        `它在等未来某一天把这笔"便宜买入"卖出去。全程最低价是不断**下台阶**的。`
    } else {
      msg =
        `**第 ${day} 天** \`price = ${price}\`：\`candidate = ${price} - ${prevMin} = ${candidate} ≤ best = ${best}\`，` +
        `且 \`price ≥ minPrice\` 也不刷新历史最低 —— 两变量**原地不动**。` +
        `大多数日子都是这种"路过帧"：扫描的常态是不动，动的那几帧才是答案的来路。`
    }
    snap('scan', msg, {
      day,
      price,
      prevPrice,
      minPrice,
      prevMin,
      candidate,
      best,
      prevBest,
      updated,
    })
  }

  snap(
    'done',
    `返回 **\`${best}\`**。复盘：${prices.length - 1} 次路过，best 只在上坡日刷新、` +
      `minPrice 只在下台阶日刷新 —— 两个单调变量把 O(n²) 的对枚举压成 O(n)。` +
      `若全程下跌，candidate 恒为负，best 停在 0（语义 = **干脆不买**，这也是 121 的合法答案）。` +
      `记住这两个变量的含义：minPrice 是"最便宜的昨天"，best 是"最赚的卖出日"。`,
    { done: true, result: best, day: prices.length - 1 },
  )

  return steps
}
