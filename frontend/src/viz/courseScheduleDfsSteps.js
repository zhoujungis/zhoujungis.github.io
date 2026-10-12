/**
 * courseScheduleDfsSteps.js — 「课程表」(LC 207 / 210) 的第二个视角：
 * DFS 三色标记（白 / 灰 / 黑）。
 *
 * 纯函数，不碰 DOM。渲染层是 courseScheduleDfs.js。
 *
 * ── 与 courseScheduleSteps.js 的关系 ─────────────────────────────────────
 * 同一张图、同一个问题，换一台机器：
 *   白（0）= 没访问过；灰（1）= 正在递归栈里（在探它的邻居）；
 *   黑（2）= 已确认安全（所有后继都处理完了）。
 * DFS 沿边走，如果碰到一个**灰**邻居 —— 它就在当前递归栈里，边指回了
 * 祖先，说明有环（207 返回 false）。节点变黑时追加到**后序**列表，
 * **后序的反转就是拓扑序**（210 的答案）。
 *
 * 帧设计（默认 4 门课，答案 [0,2,1,3]）：
 *   init   —— 全白、栈空
 *   enter  —— 白 → 灰：开始探索一门课，压入递归栈
 *   finish —— 灰 → 黑：这门课的后继全部安全，弹栈并追加后序
 *   cycle  —— 发现灰邻居（边指回递归栈里的节点）→ 有环，done(false)
 *   done   —— 全部变黑：后序反转 = 拓扑序，done(true)
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'enter' | 'finish' | 'cycle' | 'done'
 *   desc: string
 *   numCourses: number
 *   edges: [b, a][]            // 先修 b → 后修 a
 *   color: (0|1|2)[]           // 本帧的颜色快照
 *   stack: number[]            // 当前递归栈（灰节点，底 → 顶）
 *   post: number[]             // 后序列表（finish 时追加）
 *   cur: number | null         // enter / finish 帧的主角
 *   target: number | null      // cycle 帧：被指回的灰节点
 *   answer: { possible, order } | null
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. enter：白 → 灰且入栈；finish：灰 → 黑且弹栈 + 追加后序；
 *   2. 颜色只按 白 → 灰 → 黑 演进，绝不回退；
 *   3. cycle 帧的 target 当时必须是灰、且在栈里；
 *   4. done.possible === !发现过环；possible 时 order = 后序反转，
 *      且逐边核验是合法拓扑序；
 *   5. 每个节点恰好 enter 一次、finish 一次（无环时）。
 */

const DEFAULT_NUM_COURSES = 4
const DEFAULT_PREREQUISITES = [
  [1, 0],
  [2, 0],
  [3, 1],
  [3, 2],
]

/** 供测试与渲染层复用的默认题面。 */
export const COURSE_DFS_DEFAULT_NUM = DEFAULT_NUM_COURSES
export const COURSE_DFS_DEFAULT_PREREQUISITES = DEFAULT_PREREQUISITES

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

export function buildCourseScheduleDfsSteps(options = {}) {
  const { numCourses, prerequisites } = normalize(options)

  const edges = prerequisites.map(([a, b]) => [b, a])
  const adj = Array.from({ length: numCourses }, () => [])
  for (const [from, to] of edges) adj[from].push(to)
  for (const list of adj) list.sort((a, b) => a - b)

  const steps = []
  const color = new Array(numCourses).fill(0)
  const stack = []
  const post = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      numCourses,
      edges: edges.map((e) => [...e]),
      color: [...color],
      stack: [...stack],
      post: [...post],
      cur: null,
      target: null,
      answer: null,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `DFS 三色标记：**白** = 没碰过、**灰** = 正在递归栈里（还没探完它的邻居）、` +
      `**黑** = 已确认安全。沿边往下走：碰到**白**就入栈变灰继续；碰到**灰**，` +
      `说明边指回了当前递归栈里的节点 —— **有环**；碰到**黑**直接跳过（它的路已经验过安全）。` +
      `一门课**变黑时**追加到后序列表，**后序反转就是拓扑序**。`,
  )

  let cycle = null

  outer: for (let start = 0; start < numCourses; start += 1) {
    if (color[start] !== 0) continue
    color[start] = 1
    stack.push(start)
    snap(
      'enter',
      `出发：课程 \`${start}\` 白 → 灰，压入递归栈 \`[${stack.join(', ')}]\` —— ` +
        `开始探测它的后继（先修课指向后修课）。`,
      { cur: start },
    )
    const frames = [{ node: start, idx: 0 }]

    while (frames.length > 0) {
      const top = frames[frames.length - 1]
      const node = top.node
      const neighbors = adj[node]
      if (top.idx < neighbors.length) {
        const next = neighbors[top.idx]
        top.idx += 1
        if (color[next] === 1) {
          cycle = { from: node, to: next }
          snap(
            'cycle',
            `探到课程 \`${node}\` 的后继 \`${next}\` —— 它是**灰色**、还在递归栈里 ` +
              `\`[${stack.join(', ')}]\`：边 \`${node} → ${next}\` 指回了祖先，` +
              `**环被抓住**（课程 ${next} → … → ${node} → ${next}）。有环 = 有课永远修不完 → 返回 **false**。`,
            { cur: node, target: next },
          )
          break outer
        }
        if (color[next] === 0) {
          color[next] = 1
          stack.push(next)
          frames.push({ node: next, idx: 0 })
          snap(
            'enter',
            `课程 \`${node}\` 的后继 \`${next}\` 是白色的：白 → 灰，压栈 ` +
              `\`[${stack.join(', ')}]\`，继续往下探。`,
            { cur: next },
          )
        }
        // color === 2（黑）→ 跳过，不发帧
      } else {
        frames.pop()
        stack.pop()
        color[node] = 2
        post.push(node)
        snap(
          'finish',
          `课程 \`${node}\` 的邻居全部处理完：灰 → 黑，弹栈（栈 = \`[${stack.join(', ') || '空'}]\`），` +
            `追加后序 \`[${post.join(', ')}]\` —— 它的所有**后继**都已排在它后面。`,
          { cur: node },
        )
      }
    }
  }

  if (cycle) {
    snap(
      'done',
      `发现过环（\`${cycle.from} → ${cycle.to}\` 的灰色回边）：**返回 false**，不存在任何修课顺序。` +
        `三色法的判环口径：**只要出现过灰色回边，就有环** —— 黑色邻居不算（那是另一条安全的路汇合）。`,
      { answer: { possible: false, order: [] }, cur: cycle.from, target: cycle.to },
    )
  } else {
    const order = [...post].reverse()
    snap(
      'done',
      `所有课程都变黑，没有灰色回边 → **返回 true**；后序 \`[${post.join(', ')}]\` 反转得到 ` +
        `\`[${order.join(', ')}]\` —— 一个合法修课顺序（210 的答案）。` +
        `注意：它是**后序的反转**，不是后序本身 —— 后序最后才轮到「所有后继都安全的起点」。`,
      { answer: { possible: true, order } },
    )
  }

  return steps
}
