/**
 * lc1928Steps.js — 「规定时间内到达终点的最小花费」(LC 1928) 的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 lc1928.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 有 n 个城市（0..n-1），`edges[i] = [x, y, time]` 是一条**无向边**，
 * 边上只有**时间**、没有花费；每一座城市有一笔 `passingFees[v]`，
 * **每经过一座城市付一次**（含起点与终点）。求从 0 走到 n-1、
 * 在总时间 **≤ maxTime** 的前提下，**最少**要付多少通行费；走不到返回 -1。
 *
 * 最直觉的写法是 `dp[v]` = 到城市 v 的最少花费，一层一维跑最短路 —— 但它
 * **会漏解**。原因：时间**不能被压缩**，也不等价于花费。"便宜但慢"的路
 * 与"贵但快"的路是两条完全不同的事实，只记花费的那一维会把便宜的记下来、
 * 却忘了它已经超时。
 *
 * 于是把**时间并进状态**，做**分层图**（官方提示）：
 *     dp[t][v] = 恰好在时刻 t 到达城市 v 的最小通行费
 * 底座 `dp[0][0] = passingFees[0]`（起点也要付），其余全是 ∞。
 * 按 t **正序**向外松弛所有边：
 *     dp[t + et][u] = min( dp[t + et][u], dp[t][v] + passingFees[u] )
 * 语义：已经知道"t 时刻在 v、花了多少"，再走一步（耗时 et）到 u，
 * 就要多付 u 的通行费。答案 = `min over t ≤ maxTime of dp[t][n-1]`。
 *
 * 三个必须讲清的点：
 *   1. **为什么必须二维**：一维 dp[v] 只保留"到 v 的最小花费"，会丢掉
 *      "它是在第几时刻到的"。示例里最有名的一幕是 **maxTime 只差 1 分钟，
 *      答案就从便宜路跳到贵路** —— 时间差一点，整条路就换了。
 *   2. **只从"已到达"的格子出发**：dp[t][v] 仍是 ∞ 的格子不产生任何松弛，
 *      这也是"分层图上一层层向外扩散"的含义。
 *   3. **敲掉超时的松弛**：t + et > maxTime 的边**直接剪掉**，不进入后续层，
 *      因为时间只能往前走、不会回头 —— 迟到就是迟到。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'relax' | 'done'
 *   desc: string
 *   n: number
 *   maxTime: number
 *   fees: number[]                 // passingFees
 *   edges: number[][]              // [x, y, time]
 *   target: number                 // n - 1
 *   t: number                      // 源格时刻（init/done 为 -1）
 *   v: number                      // 源格城市（-1 = 无）
 *   u: number                      // 目标城市（-1 = 无）
 *   et: number                     // 这条边的时间
 *   arr: number                    // t + et
 *   from: number                   // 源格花费 dp[t][v]
 *   cand: number                   // from + fees[u]
 *   old: number                    // 刷新前 dp[arr][u]（∞ 表示从没到过）
 *   improved: boolean              // cand < old
 *   cutCount: number               // 到本帧为止被"时间窗"剪掉的松弛总数（arr > maxTime）
 *   prevDp: number[][]             // 本帧动作**之前**的 dp（∞ = 不可达）
 *   dp: number[][]                 // 本帧动作**之后**的 dp
 *   best: number                   // 当前"min over t of dp[t][target]"
 *   bestT: number                  // 取到 best 的时刻（-1 = 还没有）
 *   chain: Array<{t, v}>           // done 帧：从 (0,0) 到 (bestT,target) 的最优状态链
 *   cities: number[]               // done 帧：链上的城市序列
 *   answer: number                 // best === ∞ ? -1 : best
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 回放一致：prevDp === 上一帧的 dp；init/done 帧 prevDp === dp；
 *   2. relax 帧：u/v 都是合法城市、v ≠ u、et ≥ 1、arr === t + et、
 *      from === prevDp[t][v]（且 from < ∞，只在可达格上发帧）、
 *      cand === from + fees[u]、arr ≤ maxTime（超时的松弛不发帧）；
 *   3. old === prevDp[arr][u]，improved === (cand < old)；
 *      improved 时 dp[arr][u] === cand 且 dp 相对 prevDp **只有这一格**变化；
 *      非 improved 时 dp === prevDp；
 *   4. dp 不可回退：prevDp 里的有限值在 dp 里仍然 ≤（只会变小）；
 *   5. cutCount 单调不减，且等于"dp[t][v] 有限的 (t,v) 出发、arr > maxTime 的边"条数；
 *   6. best 单调不增，best === min over t of dp[t][target]（∞ 表示不可达）；
 *   7. answer === (best === Infinity ? -1 : best)；
 *   8. done 帧：chain 首元素是 (0,0)、末元素是 (bestT, target)；相邻两态
 *      满足 prev[t2][v2] === {t: t1, v: v1}，且 t2 - t1 恰是某条边的耗时；
 *      cities 沿链的城市序列、相邻城市之间有边；chain 上的花费和 === answer。
 *   9. answer 与独立参考解（小顶堆 Dijkstra 在 (cost, t, v) 上，或对
 *      dp 表的自洽重算）一致。
 */

const DEFAULT_FEES = [5, 1, 2, 20, 20, 3]
const DEFAULT_EDGES = [
  [0, 1, 2],
  [1, 2, 2],
  [2, 5, 2],
  [0, 3, 1],
  [3, 4, 1],
  [4, 5, 1],
]
const DEFAULT_MAX_TIME = 5

/** 供测试与渲染层复用的默认题面。 */
export const LC1928_DEFAULT_FEES = DEFAULT_FEES
export const LC1928_DEFAULT_EDGES = DEFAULT_EDGES
export const LC1928_DEFAULT_MAX_TIME = DEFAULT_MAX_TIME

const INF = Infinity

/** 把外部入参收敛成合法的 (n, fees, edges, maxTime)。 */
function normalize(options = {}) {
  const rawFees =
    Array.isArray(options.fees) && options.fees.length >= 2
      ? options.fees
      : options.fees !== undefined
        ? options.fees
        : undefined

  let fees
  if (Array.isArray(rawFees) && rawFees.length >= 2) {
    fees = rawFees.map((f) => (typeof f === 'number' && Number.isFinite(f) && f >= 0 ? Math.trunc(f) : 0))
  } else {
    fees = [...DEFAULT_FEES]
  }
  const n = fees.length

  const rawEdges = Array.isArray(options.edges) ? options.edges : []
  const edges = []
  for (const edge of rawEdges) {
    if (!Array.isArray(edge) || edge.length < 3) continue
    const [x, y, time] = edge
    if (!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(time)) continue
    if (x < 0 || x >= n || y < 0 || y >= n || x === y || time < 1) continue
    edges.push([x, y, time])
  }

  const fallbackEdges = DEFAULT_EDGES.filter(([x, y]) => x < n && y < n).map((e) => [...e])

  const maxTime =
    Number.isInteger(options.maxTime) && options.maxTime >= 1 ? options.maxTime : DEFAULT_MAX_TIME

  return { n, fees, edges: edges.length > 0 ? edges : fallbackEdges, maxTime }
}

export function buildLc1928Steps(options = {}) {
  const { n, fees, edges, maxTime } = normalize(options)
  const target = n - 1

  // 邻接表：按输入顺序挂出，反向边追加在后 —— 顺序固定，帧序列才可复现。
  const adj = Array.from({ length: n }, () => [])
  edges.forEach(([x, y, time]) => {
    adj[x].push({ to: y, time })
    adj[y].push({ to: x, time })
  })

  const dp = Array.from({ length: maxTime + 1 }, () => new Array(n).fill(INF))
  const prev = Array.from({ length: maxTime + 1 }, () => new Array(n).fill(null))
  dp[0][0] = fees[0]

  let best = target === 0 ? fees[0] : INF
  let bestT = target === 0 ? 0 : -1
  let cutCount = 0

  const steps = []
  const clone = (grid) => grid.map((row) => row.slice())

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      n,
      maxTime,
      fees: [...fees],
      edges: edges.map((e) => [...e]),
      target,
      t: -1,
      v: -1,
      u: -1,
      et: 0,
      arr: -1,
      from: INF,
      cand: INF,
      old: INF,
      improved: false,
      prevDp: clone(dp),
      dp: clone(dp),
      best,
      bestT,
      cutCount,
      answer: best === INF ? -1 : best,
      chain: [],
      cities: [],
      done: phase === 'done',
      ...extra,
    })
  }

  const edgeText = edges
    .map(([x, y, time]) => `\`${x}—${y}(${time})\``)
    .join('、')

  snap(
    'init',
    `给 ${n} 座城市（\`0..${target}\`）、无向边 ${edgeText}，以及每座城市的通行费 ` +
      `\`[${fees.join(', ')}]\`。每条边**只有时间、没有花费**；每**经过**一座城市要付一次它的通行费，` +
      `**含起点与终点**。问从 \`0\` 走到 \`${target}\`、总时间 **≤ maxTime = ${maxTime}** 时，` +
      `最少要付多少通行费。` +
      `定义分层图的格子 \`dp[t][v]\` = **恰好在时刻 \`t\` 到达城市 \`v\`** 的最小通行费：` +
      `底座 \`dp[0][0] = fees[0] = ${fees[0]}\`（起点也要付），其余全是 \`∞\`。` +
      `按 \`t\` **正序**逐层向外松弛所有边 —— 已经知道"t 时刻在 v、花了多少"，` +
      `再走一条耗时 \`et\` 的边到 \`u\`，就要多付 \`u\` 的通行费：` +
      `\`dp[t + et][u] = min( dp[t + et][u], dp[t][v] + fees[u] )\`。` +
      `答案取 \`min over t ≤ ${maxTime} of dp[t][${target}]\`（都到不了就是 -1）。` +
      `还有一条：\`arr = t + et > maxTime\` 的松弛**直接剪掉、不进入后续层** —— ` +
      `时间只能往前走、不会回头，迟到就是迟到（动画里这些被剪掉的松弛不进帧，` +
      `只累加到统计面板的"已剪枝"计数上）。` +
      `**为什么非要二维**：一维的 \`dp[v]\` 只记"到 v 的最少花费"，会忘掉"是第几时刻到的" ` +
      `—— 而时间不能被压缩，"便宜但超时"和"贵但达标"是两条不能互相顶替的路。`,
  )

  for (let t = 0; t <= maxTime; t += 1) {
    for (let v = 0; v < n; v += 1) {
      if (dp[t][v] === INF) continue // 还没到达的格子，不向外松弛
      for (const { to: u, time: et } of adj[v]) {
        const arr = t + et
        const from = dp[t][v]
        const cand = from + fees[u]

        if (arr > maxTime) {
          // 超过时间窗的松弛：不发帧（否则动画会被大量"被剪掉"的空帧淹没），
          // 只把条数记进 cutCount，由渲染层在统计面板里显示。
          cutCount += 1
          continue
        }

        const old = dp[arr][u]
        const improved = cand < old
        // prevDp 是「本帧动作**之前**」的 dp —— 必须在刷新之前克隆，
        // 否则克隆到的只是刷新之后的同一份，帧与帧之间就对不上账。
        const before = clone(dp)

        if (improved) {
          dp[arr][u] = cand
          prev[arr][u] = { t, v }
          if (u === target && cand < best) {
            best = cand
            bestT = arr
          }
        }

        const oldText = old === INF ? '∞（这一格从没到过）' : `\`${old}\``
        snap(
          'relax',
          improved
            ? `城市 **${v}** 在 **t = ${t}** 的花费是 \`${from}\`。走边 \`${v} → ${u}\`（耗 **${et}** 分钟）` +
              `在 **t' = ${arr}** 到达城市 **${u}**，加上它的通行费 \`fees[${u}] = ${fees[u]}\` 得 ` +
              `\`${from} + ${fees[u]} = ${cand}\`。原来这一格是 ${oldText}，` +
              `**${cand} < ${old === INF ? '∞' : old}**，于是刷新成 \`${cand}\`` +
              (u === target
                ? `，同时把当前答案压到 \`${best}\`（**min over t of dp[t][${target}]** 又降了一档）。`
                : `。`)
            : `城市 **${v}** 在 **t = ${t}** 的花费是 \`${from}\`。走边 \`${v} → ${u}\`（耗 **${et}** 分钟）` +
              `在 **t' = ${arr}** 到达城市 **${u}**，算得 \`${from} + ${fees[u]} = ${cand}\`，` +
              `但这一格已经是 ${oldText}、**不比我更差**。这一趟走得更晚还更贵，作废，` +
              `格子保持原值。`,
          { t, v, u, et, arr, from, cand, old, improved, prevDp: before },
        )
      }
    }
  }

  // 从最优终点状态沿前驱表回溯
  const chain = []
  if (bestT >= 0 && dp[bestT][target] !== INF) {
    let ct = bestT
    let cv = target
    const rev = [{ t: ct, v: cv }]
    let guard = maxTime + 2
    while (!(ct === 0 && cv === 0) && guard > 0) {
      const p = prev[ct][cv]
      if (!p) break
      rev.push({ t: p.t, v: p.v })
      ct = p.t
      cv = p.v
      guard -= 1
    }
    rev.reverse()
    chain.push(...rev)
  }
  const cities = chain.map((s) => s.v)

  snap(
    'done',
    (best === INF
      ? `扫描完所有时刻，\`dp[t][${target}]\` 在 \`t ≤ ${maxTime}\` 内始终是 \`∞\` —— ` +
        `**返回 -1**：在时间窗内根本走不到终点。注意这不是"最贵"的问题，是"无解"。`
      : `返回 **${best}**：在 \`t ≤ ${maxTime}\` 里，\`dp[t][${target}]\` 的最小值出现在 ` +
        `\`t = ${bestT}\`，值 \`${best}\`。沿前驱表从 \`(${bestT}, ${target})\` 回溯到 \`(0, 0)\`，` +
        `状态链 \`${chain.map((s) => `(${s.t},${s.v})`).join(' → ')}\`，` +
        `城市序列 \`${cities.join(' → ')}\`，途中共付 \`${fees[cities[0]]}` +
        `${cities.slice(1).map((c) => ` + ${fees[c]}`).join('')} = ${best}\` 的通行费。`) +
      `回头对照 LC 322 零钱兑换：那里 \`dp[x]\` 是**一维**的（凑出金额 x 的最少枚数），` +
      `因为"枚数"可以无限累加、彼此同质；而这里**时间是一个不能压缩的维度**，` +
      `"什么时候到"决定了"还能不能赶上截止"，所以状态必须把时刻一并带上 —— ` +
      `这正是**分层图**与普通最短路的区别。`,
    { chain, cities, done: true },
  )

  return steps
}
