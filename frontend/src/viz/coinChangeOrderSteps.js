/**
 * coinChangeOrderSteps.js — 「零钱兑换」里那个最经典的坑：**金额为什么要正序**。
 *
 * 纯函数，不碰 DOM。渲染层是 coinChangeOrder.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 换成背包的写法，LC 322 变成"外层面额、内层金额"的两层循环：
 *
 *     for c in coins:                 // 外层：一种一种硬币地放
 *         for a in ??:                // 内层：金额怎么遍历？
 *             if a >= c: dp[a] = min(dp[a], dp[a-c] + 1)
 *
 * 内层金额的遍历方向，决定了 `dp[a-c]` 被读到时是"什么年代"的值：
 *
 *   正序 (a: 1→amount) —— 完全背包
 *       读到的 `dp[a-c]` **本轮已经更新过**，它自己可能就是用硬币 c 凑出来的。
 *       于是 `dp[a] = dp[a-c] + 1` 允许"再叠一枚 c" —— 硬币可重复使用，
 *       `[1,2,5]` 凑 11 得 `5+5+1`，答案 **3**。这就是 LC 322 要的语义。
 *
 *   逆序 (a: amount→1) —— 0-1 背包
 *       读到的 `dp[a-c]` **还没被本轮碰过**（下标更小、要等下一轮才轮到），
 *       等于"每枚硬币最多用一次"。`[1,2,5]` 三枚总面额才 8，凑 11 永远无解，
 *       答案 **-1**。可以复现，但**不是** LC 322 的题意。
 *
 * 一句话：**正序 = 完全背包，逆序 = 0-1 背包**，差别只在 `dp[a-c]`
 * 是"这一轮的新值"还是"上一轮的老值"。这道题必须正序。
 *
 * 动画把两遍循环**按"本轮第几步"对齐**：第 j 帧里，
 * 正序面板处理金额 `j`（从左往右扫），逆序面板处理金额 `amount+1-j`
 * （从右往左扫）。两个面板各自严格按自己的方向推进，所以
 * "本轮已扫过的区间"一个在左、一个在右 —— 方向差一眼可见。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'update' | 'done'
 *   desc: string
 *   coins: number[]
 *   amount: number
 *   coinIndex: number      // 本帧在放第几枚硬币（init/done 为 -1）
 *   coin: number|null      // 本帧的硬币面额
 *   step: number           // 本轮第几步 j（init/done 为 0）
 *   a: number              // 正序面板本帧处理的金额 = j（init/done 为 -1）
 *   descA: number          // 逆序面板本帧处理的金额 = amount + 1 - j
 *   dpAsc: number[]        // 正序面板：本帧动作后
 *   prevDpAsc: number[]
 *   ascRead: number|null   // 正序读到的 dp[a-c]（本轮已更新过的"新值"）
 *   ascValue: number|null
 *   ascUpdated: boolean
 *   dpDesc: number[]       // 逆序面板：本帧动作后的"视图"（>= descA 的格子本轮已更新）
 *   prevDpDesc: number[]
 *   descRead: number|null  // 逆序读到的 dp[a-c]（本轮尚未碰过的"旧值"）
 *   descValue: number|null
 *   descUpdated: boolean
 *   ascResult: number      // 正序面板当前 dp[amount]（Infinity → -1）
 *   descResult: number     // 逆序面板当前 dp[amount]（Infinity → -1）
 *   result: number         // done 帧：正序答案（本题答案）
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 回放一致：prevDpAsc/prevDpDesc === 上一帧的 dpAsc/dpDesc；
 *   2. 更新帧只在 a（正序）/ descA（逆序）这一格变化，其余逐格相等；
 *   3. 正序转移：dpAsc[a] === min(prevDpAsc[a], prevDpAsc[a-c] + 1)；
 *      逆序转移：dpDesc[descA] === min(prevDpDesc[descA], descRead + 1)，
 *      且 `descRead` 恒等于**本轮硬币开始前**的 dp[descA-c]；
 *   4. 两块面板的 dp[0] 恒为 0，无解一律是 Infinity；
 *   5. done 帧：ascResult === 完全背包参考解；
 *      descResult === 用**枚举子集**算出的 0-1 背包参考解（每枚硬币最多一次）；
 *   6. dpAsc 终态 === buildCoinChangeSteps 的 dp（两种循环写法同解）。
 */

const DEFAULT_COINS = [1, 2, 5]
const DEFAULT_AMOUNT = 11
const INF = Infinity

function normalize(options = {}) {
  const raw = Array.isArray(options.coins) ? options.coins : []
  const coins = raw.filter((c) => Number.isInteger(c) && c > 0)
  const amount =
    Number.isInteger(options.amount) && options.amount >= 0 ? options.amount : DEFAULT_AMOUNT
  return { coins: coins.length > 0 ? coins : [...DEFAULT_COINS], amount }
}

const fmt = (v) => (v === INF ? '∞' : String(v))
const asResult = (v) => (v === INF ? -1 : v)

export function buildCoinChangeOrderSteps(options = {}) {
  const { coins, amount } = normalize(options)

  const steps = []
  let dpAsc = new Array(amount + 1).fill(INF)
  let dpDesc = new Array(amount + 1).fill(INF)
  dpAsc[0] = 0
  dpDesc[0] = 0

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      coins: [...coins],
      amount,
      coinIndex: -1,
      coin: null,
      step: 0,
      a: -1,
      descA: -1,
      dpAsc: [...dpAsc],
      prevDpAsc: [...dpAsc],
      ascRead: null,
      ascValue: null,
      ascUpdated: false,
      dpDesc: [...dpDesc],
      prevDpDesc: [...dpDesc],
      descRead: null,
      descValue: null,
      descUpdated: false,
      ascResult: asResult(dpAsc[amount]),
      descResult: asResult(dpDesc[amount]),
      result: asResult(dpAsc[amount]),
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `把 LC 322 写成背包：**外层面额、内层金额**。硬币 \`[${coins.join(', ')}]\`，目标 \`${amount}\`。` +
      `两块面板的方程**逐字相同**：\`dp[a] = min(dp[a], dp[a-c] + 1)\`；唯一的区别是内层金额的**遍历方向**。` +
      `左：\`a\` 从 1 到 ${amount} **正序**（本轮扫过的区间从左往右长）；` +
      `右：\`a\` 从 ${amount} 降到 1 **逆序**（往左长）。` +
      `开局两边都是 \`dp[0] = 0\`、其余 **∞**（先假定凑不出）。` +
      `每一帧同时推两格，盯住"来源格 \`dp[a-c]\` 读到的到底是本轮的新值还是上一轮的老值"。`,
  )

  for (let ci = 0; ci < coins.length; ci += 1) {
    const c = coins[ci]
    const descBase = [...dpDesc] // 本轮硬币开始前的快照 = 逆序读到的"旧值"来源
    const descPass = [...descBase] // 逆序这一遍的工作数组

    for (let j = 1; j <= amount; j += 1) {
      const ascA = j
      const descA = amount + 1 - j
      const prevDpAsc = [...dpAsc]
      const prevDpDesc = [...dpDesc] // 上一帧的视图（下标 >= descA+1 已是本轮新值）

      // ── 正序：读 ascA - c，那一格本轮已经刷过 ──
      let ascRead = null
      let ascValue = null
      let ascUpdated = false
      const ascIdx = ascA - c
      if (ascIdx >= 0) {
        ascRead = prevDpAsc[ascIdx]
        ascValue = ascRead + 1
        if (ascValue < prevDpAsc[ascA]) {
          dpAsc[ascA] = ascValue
          ascUpdated = true
        }
      }

      // ── 逆序：读 descA - c，那一格本轮还没轮到，仍是旧值 ──
      let descRead = null
      let descValue = null
      let descUpdated = false
      const descIdx = descA - c
      if (descIdx >= 0) {
        descRead = descBase[descIdx]
        descValue = descRead + 1
        if (descValue < descPass[descA]) {
          descPass[descA] = descValue
          descUpdated = true
        }
      }
      // 逆序面板此刻的视图：下标 >= descA 已是本轮新值，其余还是旧值
      dpDesc = descBase.map((v, x) => (x >= descA ? descPass[x] : v))

      const ascPart =
        ascIdx < 0
          ? `\`${ascA} < ${c}\` 装不下，跳过`
          : `来源 \`dp[${ascIdx}] = ${fmt(ascRead)}\` 是**本轮已经刷过的新值**，` +
            `\`+1 = ${ascValue}\` → ${ascUpdated ? `刷新成 **${dpAsc[ascA]}**` : `不优于现值 ${fmt(prevDpAsc[ascA])}`}`
      const descPart =
        descIdx < 0
          ? `\`${descA} < ${c}\` 装不下，跳过`
          : `来源 \`dp[${descIdx}] = ${fmt(descRead)}\` 还是**本轮没碰过的旧值**，` +
            `\`+1 = ${descValue}\` → ${descUpdated ? `刷新成 **${dpDesc[descA]}**` : `不优于现值 ${fmt(prevDpDesc[descA])}`}`

      snap(
        'update',
        `第 ${ci + 1} 枚硬币 \`c = ${c}\`，本轮第 ${j} 步。` +
          `**正序（左）处理金额 ${ascA}**：${ascPart}。` +
          `**逆序（右）处理金额 ${descA}**：${descPart}。` +
          `同一行代码，唯一差别是左边的 \`dp[a-c]\` 属于"本轮已经扫过的区间"，右边的不属于 —— ` +
          `于是左边能"再叠一枚 c"，右边不能。`,
        {
          coinIndex: ci,
          coin: c,
          step: j,
          a: ascA,
          descA,
          prevDpAsc,
          ascRead,
          ascValue,
          ascUpdated,
          prevDpDesc,
          descRead,
          descValue,
          descUpdated,
        },
      )
    }
  }

  const ascResult = asResult(dpAsc[amount])
  const descResult = asResult(dpDesc[amount])

  snap(
    'done',
    `终局：**正序 \`dp[${amount}] = ${fmt(dpAsc[amount])}\` → 答案 ${ascResult}**（完全背包，硬币可复用）；` +
      `逆序 \`dp[${amount}] = ${fmt(dpDesc[amount])}\` → ${descResult}（0-1 背包，每枚硬币最多一次）。` +
      (descResult === -1
        ? `逆序不是"算得慢"，而是**题意被改掉了**：三枚硬币总面额 ${coins.reduce((s, v) => s + v, 0)} < ${amount}，` +
          `每枚最多用一次永远凑不出。`
        : `逆序把每枚硬币都锁成一次，答案与正序不同 —— 同样的代码，换个方向就不是这道题了。`) +
      `记住这条分界线：**内层金额正序 = 完全背包**（322 对），**逆序 = 0-1 背包**` +
      `（416 分割等和、1049 最后一块石头这类"每件用一次"的用逆序）。` +
      `也能反过来记：正序读"同一轮已经写好的自己"，逆序读"上一轮留下的自己"。`,
    { done: true, result: ascResult },
  )

  return steps
}
