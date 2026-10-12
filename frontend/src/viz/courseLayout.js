/**
 * courseLayout.js — 课程表动画的图布局与箭头几何（两个渲染层共用）。
 *
 * 布局：先跑一遍 Kahn 拿到**无环节点**的拓扑序，再按拓扑序做最长路径分层
 * （保证每条边都指向更右一列）；环里的节点（剥不掉）统一放最后一列 ——
 * 视觉上就是「卡在后面出不来」。整张图水平居中。
 */

export const COURSE_NODE_R = 24

/**
 * 计算节点坐标。
 * @param {number} numCourses
 * @param {[number, number][]} edges  // 先修 → 后修
 * @param {{ cx?: number, cy?: number, colGap?: number, rowGap?: number }} [opts]
 * @returns {{ positions: { x: number, y: number }[], acyclic: number[] }}
 */
export function layoutCourses(numCourses, edges, opts = {}) {
  const cx = opts.cx ?? 330
  const cy = opts.cy ?? 158
  const colGap = opts.colGap ?? 208
  const rowGap = opts.rowGap ?? 84

  const adj = Array.from({ length: numCourses }, () => [])
  const indeg = new Array(numCourses).fill(0)
  for (const [from, to] of edges) {
    adj[from].push(to)
    indeg[to] += 1
  }

  // Kahn：拿到无环节点的拓扑序
  const indeg2 = [...indeg]
  const queue = []
  for (let v = 0; v < numCourses; v += 1) if (indeg2[v] === 0) queue.push(v)
  const acyclic = []
  while (queue.length > 0) {
    const cur = queue.shift()
    acyclic.push(cur)
    for (const next of adj[cur]) {
      indeg2[next] -= 1
      if (indeg2[next] === 0) queue.push(next)
    }
  }

  // 拓扑序内做最长路径分层（每条边都指向更右一列）
  const level = new Array(numCourses).fill(null)
  for (const v of acyclic) level[v] = 0
  for (const cur of acyclic) {
    for (const next of adj[cur]) {
      if (level[next] !== null) {
        level[next] = Math.max(level[next], level[cur] + 1)
      }
    }
  }
  let maxLevel = 0
  for (const v of acyclic) maxLevel = Math.max(maxLevel, level[v])
  // 环里的节点统一放最后一列
  let sawStuck = false
  for (let v = 0; v < numCourses; v += 1) {
    if (level[v] === null) {
      level[v] = maxLevel + 1
      sawStuck = true
    }
  }
  if (sawStuck) maxLevel += 1

  const columns = new Map()
  for (let v = 0; v < numCourses; v += 1) {
    if (!columns.has(level[v])) columns.set(level[v], [])
    columns.get(level[v]).push(v)
  }

  const positions = new Array(numCourses)
  for (const [lv, nodes] of columns) {
    nodes.sort((a, b) => a - b)
    nodes.forEach((v, i) => {
      const x = cx + (lv - maxLevel / 2) * colGap
      const y = cy + (i - (nodes.length - 1) / 2) * rowGap
      positions[v] = { x, y }
    })
  }
  return { positions, acyclic }
}

/**
 * 从圆边缘到圆边缘的箭头几何（含箭头三角的点串）。
 * @param {{x:number,y:number}} from
 * @param {{x:number,y:number}} to
 * @param {number} radius
 * @param {number} [arrow] 箭头长度
 */
export function edgeGeometry(from, to, radius, arrow = 9) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const x1 = from.x + ux * radius
  const y1 = from.y + uy * radius
  const x2 = to.x - ux * (radius + 2)
  const y2 = to.y - uy * (radius + 2)
  const px = -uy
  const py = ux
  const bx = x2 - ux * arrow
  const by = y2 - uy * arrow
  const head = [
    [x2, y2],
    [bx + px * arrow * 0.55, by + py * arrow * 0.55],
    [bx - px * arrow * 0.55, by - py * arrow * 0.55],
  ]
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')
  return { x1, y1, x2, y2, head }
}
