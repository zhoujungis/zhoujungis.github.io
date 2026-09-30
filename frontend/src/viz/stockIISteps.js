/**
 * stockIISteps.js — 「买卖股票的最佳时机 II」(LC 122) 的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 stockII.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 122 可以**无限次**买卖（同样先买后卖、手里最多一股），求最大利润。
 * 两条路殊途同归：
 *   贪心：利润 = 所有**正差**之和（Σ max(0, price[d] - price[d-1])）——
 *         每一段上坡都吃下，下坡不持仓；
 *   状态机 DP：每天收盘后世界只有两种状态 ——
 *         cash = 手里**没票**的最大利润，hold = 手里**有票**的最大利润。
 *         cash = max(昨天也空仓, 昨天持股今天卖) = max(prevCash, prevHold + price)
 *         hold = max(昨天也持股, 昨天空仓今天买) = max(prevHold, prevCash - price)
 * 开局第 0 天只有两个选择：空仓 cash=0，或以 prices[0] 建仓 hold=-prices[0]。
 *
 * 动画**同时跑两条路**：每帧给出 diff = price - prevPrice、贪心是否吃下这段
 * （take）、贪心累计（greedy），与 DP 的 cash/hold 并排 —— 你会看到
 * **每一帧 greedy === cash**，这就是"贪心是状态机的特例"的现场证明。
 * 309（冷冻期）/ 714（手续费）/ 123（限两笔）改的都只是这两行转移方程。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'scan' | 'done'
 *   desc: string
 *   prices: number[]
 *   day: number            // 本帧处理的交易日（init 帧为 0 = 建仓日）
 *   price: number|null     // scan 帧：prices[day]
 *   prevPrice: number|null // scan 帧：prices[day-1]
 *   diff: number|null      // scan 帧：price - prevPrice
 *   take: boolean|null     // scan 帧：贪心是否吃下这段（diff > 0）
 *   greedy: number         // 本帧之后：正差累计
 *   prevGreedy: number
 *   cash: number           // 本帧之后：空仓最大利润
 *   hold: number           // 本帧之后：持股最大利润
 *   prevCash: number, prevHold: number
 *   sellValue: number|null // scan 帧：prevHold + price（今天卖的候选）
 *   buyValue: number|null  // scan 帧：prevCash - price（今天买的候选）
 *   cashFrom: 'sell' | 'keep' | null   // cash 转移来自哪支
 *   holdFrom: 'buy' | 'keep' | null    // hold 转移来自哪支
 *   result: number         // = cash（终态空仓才是答案）
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 回放一致：prevCash/prevHold/prevGreedy === 上一帧的 cash/hold/greedy；
 *   2. 转移方程：cash === max(prevCash, prevHold + price)、
 *      hold === max(prevHold, prevCash - price)（用**更新前**的 cash 买）；
 *   3. cash >= hold 恒成立（价格非负时：持股永远不比空仓"更赚"——票还没变现）；
 *   4. cash 单调不减（空仓的钱不会凭空变少）；hold 可上可下；
 *   5. greedy === cash **逐帧相等**（贪心 ≡ 状态机）；
 *   6. done 帧：result === 正差之和 === 自顶向下递归参考解；
 *   7. take === (diff > 0)，greedy === prevGreedy + (take ? diff : 0)。
 */

const DEFAULT_PRICES = [7, 1, 5, 3, 6, 4]

export function buildStockIISteps(options = {}) {
  const prices =
    Array.isArray(options.prices) && options.prices.length > 0
      ? [...options.prices]
      : [...DEFAULT_PRICES]

  const steps = []
  let cash = 0
  let hold = -prices[0]
  let greedy = 0

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      prices: [...prices],
      day: 0,
      price: null,
      prevPrice: null,
      diff: null,
      take: null,
      greedy,
      prevGreedy: greedy,
      cash,
      hold,
      prevCash: cash,
      prevHold: hold,
      sellValue: null,
      buyValue: null,
      cashFrom: null,
      holdFrom: null,
      result: cash,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `价格序列 \`[${prices.join(', ')}]\`。可**无限次**买卖（先买后卖、同时最多持一股），求最大利润。` +
      `每天收盘只有两种状态：\`cash\` = 空仓的最大利润，\`hold\` = 持股的最大利润。` +
      `开局第 0 天：要么什么都没干 \`cash = 0\`，要么以 \`prices[0] = ${prices[0]}\` 建仓 \`hold = -${prices[0]}\`` +
      `（负利润 —— 钱变成票了）。贪心侧同步开局：还没有任何差，\`greedy = 0\`。`,
    { day: 0, cash: 0, hold: -prices[0], prevCash: 0, prevHold: -prices[0], greedy: 0, prevGreedy: 0 },
  )

  for (let day = 1; day < prices.length; day += 1) {
    const price = prices[day]
    const prevPrice = prices[day - 1]
    const prevCash = cash
    const prevHold = hold
    const prevGreedy = greedy
    const diff = price - prevPrice
    const take = diff > 0
    const sellValue = prevHold + price
    const buyValue = prevCash - price

    const newCash = Math.max(prevCash, sellValue)
    const newHold = Math.max(prevHold, buyValue)
    const newGreedy = prevGreedy + (take ? diff : 0)

    cash = newCash
    hold = newHold
    greedy = newGreedy

    const cashFrom = sellValue > prevCash ? 'sell' : 'keep'
    const holdFrom = buyValue > prevHold ? 'buy' : 'keep'

    snap(
      'scan',
      `**第 ${day} 天** \`price = ${price}\`，差值 \`diff = ${price} - ${prevPrice} = ${diff > 0 ? '+' : ''}${diff}\`。` +
        (take
          ? `上坡 → 贪心**吃下**这段：\`greedy = ${prevGreedy} + ${diff} = ${greedy}\`。`
          : `下坡 → 贪心**跳过**（不持仓躲过去）：\`greedy\` 保持 ${greedy}。`) +
        ` DP 侧两条转移同时打分：` +
        `\`cash = max(空仓不动 ${prevCash}, 今天卖 ${prevHold} + ${price} = ${sellValue}) = ${cash}\`；` +
        `\`hold = max(持股不动 ${prevHold}, 今天买 ${prevCash} - ${price} = ${buyValue}) = ${hold}\`。` +
        `注意 hold 用的 buyValue 是**更新前**的 cash —— 卖和买不能在同一天既变现又建仓（先卖后买等价于"换仓"，题意允许）。` +
        `看面板：\`greedy\` 与 \`cash\` **逐帧相等** —— 贪心就是这台状态机在"每天必做决定"下的投影。`,
      {
        day,
        price,
        prevPrice,
        diff,
        take,
        greedy,
        prevGreedy,
        cash,
        hold,
        prevCash,
        prevHold,
        sellValue,
        buyValue,
        cashFrom,
        holdFrom,
      },
    )
  }

  snap(
    'done',
    `终态取 **\`cash = ${cash}\`**（答案必在空仓侧 —— 持股未变现不算利润）。` +
      `复盘：正差之和 = ${greedy}，与 cash 全程逐帧相等，两条路一个终点。` +
      `等价操作是把每段上坡拆成独立交易：` +
      `${prices
        .slice(1)
        .map((p, i) => ({ d: i + 1, diff: p - prices[i] }))
        .filter((s) => s.diff > 0)
        .map((s) => `第 ${s.d - 1}→${s.d} 天 +${s.diff}`)
        .join('，') || '（全程无上坡）'}。` +
      `冷冻期 309 给 cash 加一支"昨天刚卖"、手续费 714 在卖的那支减 fee、限两笔 123 把 cash/hold 复制成四变量 —— 方程一改，机器照跑。`,
    { done: true, result: cash, day: prices.length - 1 },
  )

  return steps
}
