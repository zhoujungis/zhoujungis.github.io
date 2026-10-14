/**
 * lc1928PathSteps.js — 「规定时间内到达终点的最小花费」(LC 1928) 的第二视角：
 * **"便宜但超时" 与 "守时但更贵" 的对照，以及最优路的前驱回溯**。
 *
 * 纯函数，不碰 DOM。渲染层是 lc1928Path.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 动画一（lc1928Steps.js）把 \`dp[t][v]\` 一层层填了出来。这一遍回答两件事：
 *
 *   1. **两维到底差在哪**：如果只看通行费、**不看时间**，最便宜的路是哪条？
 *      它多半会**超时**。而守住 maxTime 的最优路往往**贵得多** ——
 *      这正是 "一维 dp[v] 会漏解" 的现场演示：便宜与"来得及"是两码事。
 *   2. **怎么把路还原出来**：dp 表本身只算了花费，**路藏在"前驱表"里**。
 *      从 `dp[t][n-1]` 取到最小值的那个状态 `(bestT, n-1)` 出发，反复问
 *      "我是从哪个状态来的"（`prev[arr][u] = (t, v)`），就能退回到 `(0, 0)`，
 *      再把城市与到达时刻一并读出来。
 *
 * 对照的两个解：
 *   · **无视时间窗的贪心**：只按 `passingFees` 跑 Dijkstra（边权 = 到达城市的费用），
 *     得到最便宜的城市序列，**再算它要花多少时间**。若超过 maxTime，判为超时作废。
 *   · **守时间窗的最优**：就是动画一的分层图 DP 结果，从 `(bestT, target)` 回溯。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'cheap' | 'best' | 'back' | 'done'
 *   desc: string
 *   n: number
 *   maxTime: number
 *   fees: number[]
 *   edges: number[][]
 *   target: number
 *   cheap: { cities, arriveAt, fee, totalTime, valid, found } | null
 *         arriveAt[k] = 到达第 k 个城市的时刻（arriveAt[0] = 0）
 *   best: { cities, arriveAt, fee, totalTime, chain } | null
 *         chain = [{t, v}, ...] 从 (0,0) 到 (bestT, target) 的状态序列
 *   answer: number                 // 守时间窗的最优花费；不可达为 -1
 *   cursor: number                 // back 帧：chain 中当前停的下标（从末尾递减；否则 -1）
 *   revealedStates: number         // back 帧：已回溯出的状态数（含当前）
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. cheap / best 存在时：cities 首元素是 0、末元素是 target（或 cheap 不可达时为 null）；
 *      相邻两城市之间确实有边；arriveAt 严格递增且相邻差 === 那条边的耗时；
 *      totalTime === arriveAt.at(-1)；fee === 沿途 passingFees 之和；
 *      valid === (totalTime ≤ maxTime)；
 *   2. best.chain 与 best.cities 对齐：chain[k].v === cities[k]、chain[k].t === arriveAt[k]；
 *      chain 末元素是 (bestT, target)，首元素是 (0, 0)；相邻两态 t 差 === 边耗时；
 *   3. answer === (best ? best.fee : -1)；best.fee === 动画一终态的 answer；
 *   4. cheap.fee ≤ best.fee（无视时间窗的搜索空间更大，其最优值只会更小或相等）；
 *      若 cheap.valid 成立，则 best.fee === cheap.fee（此时贪心那条本身可行，就是最优）；
 *   5. back 帧：cursor 从 chain.length - 1 递减到 0，逐帧 revealedStates 递增，
 *      desc 点名当步的前驱；首帧的 cursor 是 chain.length - 1；
 *   6. answer 与独立参考解（小顶堆 Dijkstra on (cost,t,v)）一致。
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

export const LC1928PATH_DEFAULT_FEES = DEFAULT_FEES
export const LC1928PATH_DEFAULT_EDGES = DEFAULT_EDGES
export const LC1928PATH_DEFAULT_MAX_TIME = DEFAULT_MAX_TIME

const INF = Infinity

function normalize(options = {}) {
  const source = Array.isArray(options.fees) && options.fees.length >= 2 ? options.fees : undefined
  const fees = Array.isArray(source)
    ? source.map((f) => (typeof f === 'number' && Number.isFinite(f) && f >= 0 ? Math.trunc(f) : 0))
    : [...DEFAULT_FEES]
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

/** 两城市之间最快的边耗时（无重边时就是那条边的耗时；都不可达返回 null）。 */
function edgeTime(edges, a, b) {
  let best = null
  for (const [x, y, time] of edges) {
    if ((x === a && y === b) || (x === b && y === a)) {
      if (best === null || time < best) best = time
    }
  }
  return best
}

/** 标签拼接：给定城市序列，按边耗时递推到达时刻。 */
function chainFrom(edges, cities) {
  const arriveAt = [0]
  for (let k = 1; k < cities.length; k += 1) {
    const dt = edgeTime(edges, cities[k - 1], cities[k])
    if (dt === null) return null
    arriveAt.push(arriveAt[k - 1] + dt)
  }
  return arriveAt
}

/** 无视时间窗：只按通行费跑 Dijkstra（边权 = 到达城市的费用）。 */
function cheapestByFee(n, fees, edges, target) {
  const adj = Array.from({ length: n }, () => [])
  for (const [x, y, time] of edges) {
    adj[x].push({ to: y, time })
    adj[y].push({ to: x, time })
  }
  const dist = new Array(n).fill(INF)
  const parent = new Array(n).fill(-1)
  const done = new Array(n).fill(false)
  dist[0] = fees[0]
  for (let k = 0; k < n; k += 1) {
    let pick = -1
    for (let v = 0; v < n; v += 1) {
      if (done[v] || dist[v] === INF) continue
      if (pick === -1 || dist[v] < dist[pick]) pick = v
    }
    if (pick === -1) break
    done[pick] = true
    for (const { to } of adj[pick]) {
      if (done[to]) continue
      const cand = dist[pick] + fees[to]
      if (cand < dist[to]) {
        dist[to] = cand
        parent[to] = pick
      }
    }
  }
  if (dist[target] === INF) return null
  const cities = []
  for (let v = target; v !== -1; v = parent[v]) cities.push(v)
  cities.reverse()
  if (cities[0] !== 0) return null
  return { cities, fee: dist[target] }
}

/** 守时间窗：分层图 DP，返回最优值与前驱表可回溯的状态链。 */
function layeredBest(n, fees, edges, maxTime) {
  const target = n - 1
  const adj = Array.from({ length: n }, () => [])
  for (const [x, y, time] of edges) {
    adj[x].push({ to: y, time })
    adj[y].push({ to: x, time })
  }
  const dp = Array.from({ length: maxTime + 1 }, () => new Array(n).fill(INF))
  const prev = Array.from({ length: maxTime + 1 }, () => new Array(n).fill(null))
  dp[0][0] = fees[0]
  let best = INF
  let bestT = -1
  for (let t = 0; t <= maxTime; t += 1) {
    for (let v = 0; v < n; v += 1) {
      if (dp[t][v] === INF) continue
      for (const { to: u, time: et } of adj[v]) {
        const arr = t + et
        if (arr > maxTime) continue
        const cand = dp[t][v] + fees[u]
        if (cand < dp[arr][u]) {
          dp[arr][u] = cand
          prev[arr][u] = { t, v }
          if (u === target && cand < best) {
            best = cand
            bestT = arr
          }
        }
      }
    }
  }
  if (best === INF) return { fee: INF, chain: [], bestT: -1 }
  const chain = []
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
  return { fee: best, chain, bestT }
}

/**
 * 构造第二视角的推演帧。
 * @param {{ fees?: number[], edges?: number[][], maxTime?: number }} [options]
 */
export function buildLc1928PathSteps(options = {}) {
  const { n, fees, edges, maxTime } = normalize(options)
  const target = n - 1

  const cheapRaw = cheapestByFee(n, fees, edges, target)
  const bestRaw = layeredBest(n, fees, edges, maxTime)

  const cheap = cheapRaw
    ? (() => {
        const arriveAt = chainFrom(edges, cheapRaw.cities)
        if (!arriveAt) return null
        return {
          cities: [...cheapRaw.cities],
          arriveAt,
          fee: cheapRaw.fee,
          totalTime: arriveAt[arriveAt.length - 1],
          valid: arriveAt[arriveAt.length - 1] <= maxTime,
          found: true,
        }
      })()
    : null

  const best =
    bestRaw.chain.length > 0
      ? {
          cities: bestRaw.chain.map((s) => s.v),
          arriveAt: bestRaw.chain.map((s) => s.t),
          fee: bestRaw.fee,
          totalTime: bestRaw.chain[bestRaw.chain.length - 1].t,
          chain: bestRaw.chain.map((s) => ({ ...s })),
        }
      : null

  const answer = best ? best.fee : -1
  const answerText = best ? String(best.fee) : '-1'

  const steps = []
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      n,
      maxTime,
      fees: [...fees],
      edges: edges.map((e) => [...e]),
      target,
      cheap: cheap
        ? {
            cities: [...cheap.cities],
            arriveAt: [...cheap.arriveAt],
            fee: cheap.fee,
            totalTime: cheap.totalTime,
            valid: cheap.valid,
            found: true,
          }
        : null,
      best: best
        ? {
            cities: [...best.cities],
            arriveAt: [...best.arriveAt],
            fee: best.fee,
            totalTime: best.totalTime,
            chain: best.chain.map((s) => ({ ...s })),
          }
        : null,
      answer,
      cursor: -1,
      revealedStates: 0,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `动画一把分层图 \`dp[t][v]\` 填好了。这一遍回答两件事：` +
      `**(1) 只图便宜会怎样** —— 完全不看时间、只按通行费找最便宜的路，它会走哪条、要花多久？` +
      `**(2) 守住 maxTime = ${maxTime} 的最优路是哪条** —— 然后从最优终点状态沿**前驱表**回退，` +
      `把城市序列与每个到达时刻一并还原出来。` +
      `注意 dp 表本身只记了**花费**，路藏在 \`prev[arr][u] = (t, v)\` 里：` +
      `"我在 t' 时刻、城市 u，是从哪个状态走过来的"。`,
  )

  if (cheap) {
    snap(
      'cheap',
      cheap.valid
        ? `先看**无视时间窗**的贪心：只按通行费找最便宜的路，得到 \`${cheap.cities.join(' → ')}\`，` +
          `通行费 \`${cheap.fee}\`、耗时 **${cheap.totalTime}** —— 恰好 \`≤ maxTime = ${maxTime}\`，` +
          `所以这一条**本身就是可行解**（这说明本题里"最便宜"和"来得及"这回碰巧不冲突）。`
        : `先看**无视时间窗**的贪心：只按通行费找最便宜的路，得到 \`${cheap.cities.join(' → ')}\`，` +
          `通行费只要 \`${cheap.fee}\` —— 比后面那条便宜得多。可它要花 **${cheap.totalTime}** 分钟，` +
          `\`${cheap.totalTime} > maxTime = ${maxTime}\`，**超时，直接作废**。` +
          `这就是本题的命门：**便宜 ≠ 来得及**。如果只用一个一维的 \`dp[v]\`（到 v 的最少花费），` +
          `就会把这条便宜路记成"到终点的最优解"，把时间这一维整个漏掉 —— 于是得到错误的答案。`,
      { cheap },
    )
  }

  if (best) {
    snap(
      'best',
      `再看**守住时间窗**的最优路：在 \`t ≤ ${maxTime}\` 的所有状态里，` +
        `\`dp[t][${target}]\` 的最小值出现在 **\`(t = ${best.totalTime}, 城市 ${target})\`**，价值 \`${best.fee}\`。` +
        `从它沿前驱回退，得到的城市序列是 \`${best.cities.join(' → ')}\`，` +
        `到达时刻 \`${best.arriveAt.join(', ')}\`，共 **${best.totalTime}** 分钟。` +
        (cheap && !cheap.valid
          ? `对照上面那条：它贵得多（\`${best.fee}\` vs \`${cheap.fee}\`），却是**唯一来得及**的 —— ` +
            `时间窗一卡，"最便宜"就必须让位给"刚好赶得上"。`
          : `它比贪心那条不可能更便宜（\`${best.fee} ≤ ${cheap ? cheap.fee : best.fee}\`），` +
            `因为它在"守时"的基础上还要最省。`),
      { best },
    )

    // 从终点状态沿前驱回退，逐帧揭开
    for (let cursor = best.chain.length - 1; cursor >= 0; cursor -= 1) {
      const state = best.chain[cursor]
      const pred = cursor > 0 ? best.chain[cursor - 1] : null
      const last = cursor === best.chain.length - 1
      snap(
        'back',
        (last
          ? `回退的起点是终点状态 \`(t = ${state.t}, 城市 ${state.v})\` —— 也就是 \`dp[${state.t}][${state.v}] = ${best.fee}\` 那一格。`
          : `回退到状态 \`(t = ${state.t}, 城市 ${state.v})\`。`) +
          (pred
            ? `它的前驱是 \`(t = ${pred.t}, 城市 ${pred.v})\`：也就是说，是在 **t = ${pred.t}** 从城市 ${pred.v} ` +
              `走了一条耗时 **${state.t - pred.t}** 的边过来的（\`${state.t - pred.t} = ${state.t} - ${pred.t}\`）。`
            : `它是链的源头 \`(0, 0)\` —— \`dp[0][0] = fees[0] = ${fees[0]}\`，起点也要付自己的通行费。到达 \`(0, 0)\` 就退完了。`),
        { cursor, revealedStates: best.chain.length - cursor },
      )
    }
  }

  snap(
    'done',
    (best
      ? `还原完毕：\`${best.cities.join(' → ')}\`，到达时刻 \`${best.arriveAt.join(', ')}\`，` +
        `总时间 \`${best.totalTime} ≤ ${maxTime}\`，通行费 \`${best.cities.map((c) => fees[c]).join(' + ')} = ${best.fee}\`。` +
        `回头看两层对照：**隐藏时间的贪心**给出 \`${cheap ? `${cheap.fee}（超时 ${cheap.totalTime}）` : '无'}\`，` +
        `**守住时间窗的答案**是 \`${answerText}\` —— 一维 dp 会把前者当成答案，` +
        `而分层图（把时刻并进状态）才拿得到后者。路不是 dp 值直接给的，是从**前驱表**一段段退回来的。`
      : `扫描完所有时刻，\`dp[t][${target}]\` 在 \`t ≤ ${maxTime}\` 内始终是 \`∞\`：**没有可行路**。` +
        `此时不管贪心那条便宜路多便宜，只要它超时，答案就是 \`-1\` —— ` +
        `**可行性与最优性是两个问题**：先要"走得通且不超时"，才谈得上"最便宜"。`) +
      `这也正是 **LC 1928** 与 **LC 743**（网络延迟时间）、**LC 1631**（最小体力消耗路径）那类"最短路"的分界：` +
      `它们的代价维度可以直接相加比较，而这里**时间是一个硬约束**，` +
      `所以状态 \`(t, v)\` 必须二维展开。`,
    { done: true, cursor: 0, revealedStates: best ? best.chain.length : 0 },
  )

  return steps
}
