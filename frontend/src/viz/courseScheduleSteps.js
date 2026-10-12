/**
 * courseScheduleSteps.js — 「课程表」(LC 207 / 210) 的 Kahn 算法推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 courseSchedule.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 「能不能修完所有课」= 有向图有没有环；「修课顺序」= 拓扑序。
 * Kahn（入度表 + 队列）：先修课指向后修课（prerequisites 的 [a, b] 是 b → a），
 * 把所有**入度为 0** 的课（没有任何先修）放进队列；每取出一门课，就把它
 * 所有后继的入度减 1，减到 0 的入队。跑完后：
 *   - 出队数量 == numCourses → 能修完，出队顺序就是一个合法拓扑序（210 的答案）；
 *   - 出队数量 <  numCourses → 剩下的课都在环里（或依赖环），返回 false。
 *
 * 帧设计（默认 4 门课，prereq = [[1,0],[2,0],[3,1],[3,2]]，答案 [0,1,2,3]）：
 *   init —— 建图完毕，入度表算出，全部 0 入度课入队
 *   pop  —— 取出一门课：记入 order，后继入度 −1，新的 0 入度课入队
 *   done —— 全部修完（possible=true，order 即答案）或有环（false）
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'pop' | 'done'
 *   desc: string
 *   numCourses: number
 *   edges: [b, a][]            // 先修 b → 后修 a（由 prerequisites 转换）
 *   indegree: number[]         // 本帧的入度快照
 *   queue: number[]            // 当前队列（0 入度的课）
 *   order: number[]            // 已确定的修课顺序（出队顺序）
 *   cur: number | null         // pop 帧的主角
 *   relaxed: [v, indeg][]      // pop 帧：被减入度的后继及其新值
 *   enqueued: number[]         // pop 帧：本帧新入队的课
 *   stuck: number[]            // done 帧（有环）：始终没能修完的课
 *   answer: { possible: boolean, order: number[] } | null
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. init 的队列 = 全部 0 入度课（升序）；每门课最多入队一次、最多出队一次；
 *   2. pop 帧的 cur === 上一帧队首；order 恰好在 pop 帧追加 cur；
 *   3. 每门课的入度只会被「已出队的前驱」减少，且不会变成负数；
 *   4. done.answer.possible === (order.length === numCourses)，
 *      且与独立参考解（DFS 三色判环 + 逐边核验拓扑序）一致。
 */

const DEFAULT_NUM_COURSES = 4
const DEFAULT_PREREQUISITES = [
  [1, 0],
  [2, 0],
  [3, 1],
  [3, 2],
]

/** 供测试与渲染层复用的默认题面。 */
export const COURSE_DEFAULT_NUM = DEFAULT_NUM_COURSES
export const COURSE_DEFAULT_PREREQUISITES = DEFAULT_PREREQUISITES

function normalize(options = {}) {
  const rawNum = Number.isInteger(options.numCourses) ? options.numCourses : DEFAULT_NUM_COURSES
  const numCourses = rawNum >= 0 ? rawNum : DEFAULT_NUM_COURSES
  const rawPre = Array.isArray(options.prerequisites) ? options.prerequisites : DEFAULT_PREREQUISITES
  const prerequisites = rawPre
    .filter(
      (pair) =>
        Array.isArray(pair) &&
        pair.length === 2 &&
        Number.isInteger(pair[0]) &&
        Number.isInteger(pair[1]) &&
        pair[0] >= 0 &&
        pair[0] < numCourses &&
        pair[1] >= 0 &&
        pair[1] < numCourses,
    )
    .map((pair) => [pair[0], pair[1]])
  return { numCourses, prerequisites }
}

export function buildCourseScheduleSteps(options = {}) {
  const { numCourses, prerequisites } = normalize(options)

  // b → a：先修 b 指向后修 a
  const edges = prerequisites.map(([a, b]) => [b, a])
  const adj = Array.from({ length: numCourses }, () => [])
  const indegree = new Array(numCourses).fill(0)
  for (const [from, to] of edges) {
    adj[from].push(to)
    indegree[to] += 1
  }
  for (const list of adj) list.sort((a, b) => a - b)

  const steps = []
  const queue = []
  const order = []
  const everEnqueued = new Set()

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      numCourses,
      edges: edges.map((e) => [...e]),
      indegree: [...indegree],
      queue: [...queue],
      order: [...order],
      cur: null,
      relaxed: [],
      enqueued: [],
      stuck: [],
      answer: null,
      done: phase === 'done',
      ...extra,
    })
  }

  for (let v = 0; v < numCourses; v += 1) {
    if (indegree[v] === 0) {
      queue.push(v)
      everEnqueued.add(v)
    }
  }

  snap(
    'init',
    `把 prerequisites 的 \`[a, b]\` 读成有向边 **b → a**（修 a 之前必须先修 b），先算出入度表：` +
      `入度 = 它有多少门**没修的先修课**。入度为 0 的课没有任何前置，可以立刻开修 —— ` +
      `第 0 层起点是 \`{${queue.join(', ')}}\`，全部入队。` +
      `**入度为 0 的课永远可以第一个修**，这是 Kahn 的全部起点。`,
  )

  while (queue.length > 0) {
    const cur = queue.shift()
    order.push(cur)
    const relaxed = []
    const enqueued = []
    for (const next of adj[cur]) {
      indegree[next] -= 1
      relaxed.push([next, indegree[next]])
      if (indegree[next] === 0 && !everEnqueued.has(next)) {
        queue.push(next)
        everEnqueued.add(next)
        enqueued.push(next)
      }
    }
    snap(
      'pop',
      `修完第 \`${order.length}\` 门课 \`${cur}\`：它的后继 ` +
        (relaxed.length > 0
          ? `${relaxed.map(([v, d]) => `\`${v}\`(入度→${d})`).join('、')}` +
            (enqueued.length > 0 ? `，其中 \`${enqueued.join('、')}\` 入度减到 0，可以开修了 →` : `，都还有前置没修 →`) +
            `入队 \`{${queue.join(', ') || '空'}}\`。`
          : `（没有后继），队列 \`{${queue.join(', ') || '空'}}\`。`) +
        `\`order = [${order.join(', ')}]\`。`,
      { cur, relaxed, enqueued },
    )
  }

  const possible = order.length === numCourses
  const stuck = []
  for (let v = 0; v < numCourses; v += 1) {
    if (!order.includes(v)) stuck.push(v)
  }

  if (possible) {
    snap(
      'done',
      `队列空、且**出队数量 ${order.length} == numCourses ${numCourses}**：没有课被卡住，` +
        `说明图里没有环，**返回 true**；而 \`[${order.join(', ')}]\` 本身就是一个合法修课顺序 —— ` +
        `210 的答案（任意一个拓扑序都合法）。`,
      { answer: { possible: true, order: [...order] }, stuck },
    )
  } else {
    snap(
      'done',
      `队列提前枯竭：只修完了 ${order.length} / ${numCourses} 门课，` +
        `剩下的 \`{${stuck.join(', ')}}\` 有前置没修完 —— 它们**互相等待**（在环里）或被环卡住，` +
        `**返回 false**。判据：**出队数量 == numCourses**，不是「队列空了」。`,
      { answer: { possible: false, order: [...order] }, stuck },
    )
  }

  return steps
}
