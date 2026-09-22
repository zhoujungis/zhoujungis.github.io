/**
 * cycleLayout.js — 「带环链表」两个动画（LC 141 判环 / LC 142 找入口）共用的几何骨架。
 *
 * 抽出来的原因：两个动画画的是**同一条链表**（同一个直段 + 同一个环、同一个入口），
 * 只是高亮的东西不同。骨架重写一遍就是两百行重复，而且两边的环半径算得不一样时
 * 视觉上会「不是同一条链表」。
 *
 * 画布结构：
 *
 *         入口
 *          ↓
 *   [1]→[2]→[3]→[4]╮
 *                ╭─╯ ╰─╮
 *               [9]   [5]        ← 环上的节点按角度铺开，环左点 = 入口
 *               [8]   [6]
 *                ╰─╮ ╭─╯
 *                  [7]
 *
 * 三个刻意的决定：
 *
 * 1. **环的左点就是入口节点。** 直段从左边水平接进来，所以「直段 → 入口 → 绕一圈
 *    回到入口」的读序和链表实际的 next 链完全一致，不需要读者在脑子里换方向。
 *
 * 2. **环上节点的角度 = 180° + k·(360°/b)**，即从环左点出发**顺时针**铺开。
 *    顺时针在屏幕坐标（y 向下）里对应 SVG 的 sweep-flag = 1，画距离弧时直接用。
 *
 * 3. **环半径由环长反推**（保证相邻节点不挤在一起），并且有下限 80 —— 环太小时
 *    中间那块读数区域会被节点占掉。
 *
 * 边一律画在节点**下面**（先 append 边、再 append 节点），节点填充不透明，
 * 于是视觉上就是「边从框到框」。箭头端点用射线与矩形的交点算，不用猜。
 */

import { svgEl as svg } from './widgetChrome'

const STYLE_ID = 'cyc-layout-styles'

export const NODE_W = 46
export const NODE_H = 30
export const PITCH = 70
export const TAIL_ARROW = 58 // 直段末端 → 环左点 的箭头预留长度
export const MARGIN_L = 24
export const MARGIN_R = 46
export const CHIP_H = 20
export const CHIP_DY = 30 // 节点中心 → 徽标中心（径向往外 / 垂直往下）
export const CHIP_SEP = 15 // 两枚徽标同处一个节点时的错开量
export const RING_TOP_PAD = 52 // 环最高点到画布顶的预留（要放指针徽标）
const BOTTOM_PAD = 20

const STYLES = `
.cyc-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease,
    opacity 0.26s ease;
}
.cyc-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: opacity 0.26s ease, fill 0.26s ease;
}
.cyc-edge__line { stroke: var(--text-secondary, #657168); stroke-width: 1.6; stroke-linecap: round; }
.cyc-edge__head { fill: var(--text-secondary, #657168); }
.cyc-edge { transition: opacity 0.26s ease; }
.cyc-edge.is-dim { opacity: 0.3; }

.cyc-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.6;
  stroke-dasharray: 4 3;
}
.cyc-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 11px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 入口标记：虚线外框 + 上方一个小标 */
.cyc-entry__box {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.4;
  stroke-dasharray: 5 4;
  opacity: 0.75;
}
.cyc-entry__tag {
  fill: var(--text-secondary, #657168);
  font-size: 10.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 指针所在节点的高亮。绿 = 慢 / ptr1，橙 = 快 / ptr2，两指针重合时用混合色。
   两个动画语义一致，所以放在共享样式里。 */
.cyc-node.is-slow .cyc-node__box {
  stroke: #2f6f4f;
  stroke-width: 2.6;
  fill: rgba(47, 111, 79, 0.16);
}
.cyc-node.is-fast .cyc-node__box {
  stroke: #b4682c;
  stroke-width: 2.6;
  fill: rgba(180, 104, 44, 0.16);
}
.cyc-node.is-both .cyc-node__box {
  stroke: #8a5a2b;
  stroke-width: 3.2;
  fill: rgba(138, 90, 43, 0.22);
}
.cyc-node.is-both .cyc-node__value { font-weight: 700; }
html.theme-dark .cyc-node.is-slow .cyc-node__box { stroke: #7fc3a4; }
html.theme-dark .cyc-node.is-fast .cyc-node__box { stroke: #e0a06a; }
html.theme-dark .cyc-node.is-both .cyc-node__box { stroke: #e8c08a; }

/* 指针徽标：单字，径向/垂直外移。两个字并排也只有 52 宽，不会压到邻居 */
.cyc-chip { transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.26s ease; }
.cyc-chip__box { rx: 9; ry: 9; }
.cyc-chip__text {
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.cyc-chip--slow .cyc-chip__box { fill: #2f6f4f; }
.cyc-chip--slow .cyc-chip__text { fill: #fff; }
.cyc-chip--fast .cyc-chip__box { fill: #b4682c; }
.cyc-chip--fast .cyc-chip__text { fill: #fff; }
.cyc-chip--p1 .cyc-chip__box { fill: #2f6f4f; }
.cyc-chip--p1 .cyc-chip__text { fill: #fff; }
.cyc-chip--p2 .cyc-chip__box { fill: #b4682c; }
.cyc-chip--p2 .cyc-chip__text { fill: #fff; }

@media (prefers-reduced-motion: reduce) {
  .cyc-node__box, .cyc-node__value, .cyc-edge, .cyc-chip { transition: none; }
}
`

export function ensureLayoutStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLES
  document.head.appendChild(style)
}

export function removeLayoutStyles() {
  document.getElementById(STYLE_ID)?.remove()
}

/** 环半径：按环长反推，保证相邻节点之间留得下 22px 空隙；下限 80。 */
export function ringRadius(b) {
  if (!Number.isInteger(b) || b <= 1) return 80
  const need = (NODE_W + 22) / (2 * Math.sin(Math.PI / b))
  return Math.max(80, Math.round(need))
}

/** 环上第 k 个节点的角度（度）。k = 0 是入口，落在环的左点（180°）。 */
export function ringAngle(k, b) {
  return 180 + (360 * k) / b
}

/** 环上第 k 个节点的中心坐标。角度增大 = 屏幕上顺时针。 */
export function ringPoint(k, b, cx, cy, r) {
  const t = (ringAngle(k, b) * Math.PI) / 180
  return { x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) }
}

/**
 * 从矩形中心沿单位方向 (dx, dy) 到矩形边界的距离。
 * 用来把「中心到中心」的连线裁到框边，箭头才落在框外而不是压在字上。
 */
export function boxEdgeDistance(dx, dy, w = NODE_W, h = NODE_H) {
  const ax = Math.abs(dx) < 1e-6 ? Infinity : w / 2 / Math.abs(dx)
  const ay = Math.abs(dy) < 1e-6 ? Infinity : h / 2 / Math.abs(dy)
  return Math.min(ax, ay)
}

/**
 * 一条带箭头的连线，端点裁到两个节点的框边。
 * @returns SVGElement 的 <g class="cyc-edge">
 */
export function nodeArrow(from, to, { head = 8, dim = false } = {}) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const d0 = boxEdgeDistance(ux, uy)
  const sx = from.x + ux * d0
  const sy = from.y + uy * d0
  const ex = to.x - ux * d0
  const ey = to.y - uy * d0

  const g = svg('g', { class: dim ? 'cyc-edge is-dim' : 'cyc-edge' })
  g.appendChild(
    svg('line', {
      class: 'cyc-edge__line',
      x1: sx,
      y1: sy,
      x2: ex - ux * head,
      y2: ey - uy * head,
    }),
  )
  // 箭头三角：以 (ex, ey) 为尖端，沿反方向张开
  const px = -uy
  const py = ux
  const w = 5.5
  g.appendChild(
    svg('path', {
      class: 'cyc-edge__head',
      d:
        `M ${ex} ${ey} ` +
        `L ${ex - ux * head + px * w} ${ey - uy * head + py * w} ` +
        `L ${ex - ux * head - px * w} ${ey - uy * head - py * w} Z`,
    }),
  )
  return g
}

/** 建一个节点（框 + 值）。 */
export function makeNode(parent, value, cx, cy, cls = '') {
  const g = svg('g', { class: `cyc-node ${cls}`.trim() })
  g.appendChild(
    svg('rect', {
      class: 'cyc-node__box',
      x: cx - NODE_W / 2,
      y: cy - NODE_H / 2,
      width: NODE_W,
      height: NODE_H,
      rx: 8,
    }),
  )
  const t = svg('text', { class: 'cyc-node__value', x: cx, y: cy })
  t.textContent = String(value)
  g.appendChild(t)
  parent.appendChild(g)
  return g
}

/** 行尾 ∅。 */
export function nullMarker(parent, x, cy) {
  const g = svg('g', { class: 'cyc-null' })
  g.appendChild(svg('circle', { class: 'cyc-null__ring', cx: x, cy, r: 15 }))
  const t = svg('text', { class: 'cyc-null__text', x, y: cy })
  t.textContent = '∅'
  g.appendChild(t)
  parent.appendChild(g)
  return g
}

/** 水平箭头（直段内部、直段→入口、无环时的收尾箭头）。 */
export function hArrow(parent, fromX, toX, cy) {
  const dir = toX > fromX ? 1 : -1
  const head = 8
  const g = svg('g', { class: 'cyc-edge' })
  g.appendChild(
    svg('line', {
      class: 'cyc-edge__line',
      x1: fromX,
      y1: cy,
      x2: toX - dir * head,
      y2: cy,
    }),
  )
  g.appendChild(
    svg('path', {
      class: 'cyc-edge__head',
      d: `M ${toX} ${cy} L ${toX - dir * head} ${cy - 5.5} L ${toX - dir * head} ${cy + 5.5} Z`,
    }),
  )
  parent.appendChild(g)
  return g
}

/**
 * 指针徽标的落点。环上节点沿半径朝外，直段节点朝下。
 *
 * **入口节点是例外**：它在环的左点，「朝外」正好指向直段，徽标会压在
 * 「直段末节点 → 入口」那条箭头上（实测截图里箭头被盖住了），所以改成朝下 ——
 * 那个方向是空的（环的左下弧离得远）。
 *
 * slot ≠ 0 时沿切向错开，供两枚徽标同处一个节点时并排使用。
 */
export function chipAnchor(nd, frame, slot = 0, sep = CHIP_SEP) {
  if (!nd) return null
  let dir
  if (nd.inRing && nd.index !== frame.a) {
    const dx = nd.cx - frame.ringCenter.x
    const dy = nd.cy - frame.ringCenter.y
    const len = Math.hypot(dx, dy) || 1
    dir = { x: dx / len, y: dy / len }
  } else {
    dir = { x: 0, y: 1 }
  }
  const base = { x: nd.cx + dir.x * CHIP_DY, y: nd.cy + dir.y * CHIP_DY }
  if (!slot) return base
  const perp = { x: -dir.y, y: dir.x }
  return { x: base.x + perp.x * slot * sep, y: base.y + perp.y * slot * sep }
}

/**
 * 建出「直段 + 环」的完整骨架（边 + 节点 + 入口标记）。
 *
 * @param {SVGGElement} parent
 * @param {{
 *   values: Array<number|string>,
 *   cycleStart: number|null,   // null = 无环，排成一行
 * }} opts
 * @returns {{
 *   a: number, b: number, hasCycle: boolean,
 *   width: number, height: number,
 *   rowY: number, ringCenter: {x,y}, radius: number,
 *   nodes: Array<{g: SVGGElement, cx: number, cy: number, index: number, inRing: boolean, ringK: number}>,
 *   ringKOf: (index: number) => number,
 *   at: (index: number) => {g, cx, cy} | undefined,
 * }}
 */
export function buildCycleFrame(parent, { values, cycleStart }) {
  const V = Array.isArray(values) ? values : []
  const n = V.length
  const hasCycle = Number.isInteger(cycleStart) && cycleStart >= 0 && cycleStart < n
  const a = hasCycle ? cycleStart : n
  const b = hasCycle ? n - a : 0

  const R = ringRadius(b)
  const rowY = R + NODE_H / 2 + RING_TOP_PAD
  const entryLeft = MARGIN_L + (a > 0 ? (a - 1) * PITCH + NODE_W + TAIL_ARROW : 0)
  const ringCx = entryLeft + NODE_W / 2 + R

  const width = hasCycle
    ? ringCx + R + NODE_W / 2 + MARGIN_R
    : entryLeft + NODE_W / 2 + 60
  const height = hasCycle
    ? rowY + R + NODE_H / 2 + CHIP_DY + CHIP_H / 2 + BOTTOM_PAD
    : rowY + NODE_H / 2 + CHIP_DY + CHIP_H / 2 + BOTTOM_PAD

  const centerOf = (index) => {
    if (index < a) {
      return { x: MARGIN_L + index * PITCH + NODE_W / 2, y: rowY }
    }
    return ringPoint(index - a, b, ringCx, rowY, R)
  }

  // ── 边先画（会被节点盖住中段，视觉上就是框到框）─────────────────────────
  const edges = []
  for (let i = 0; i < n - 1; i += 1) {
    edges.push(nodeArrow(centerOf(i), centerOf(i + 1)))
  }
  if (hasCycle) {
    // 收口边：环上最后一个节点 → 入口
    if (b === 1) {
      // 自环：画一个小圈，否则「自己指向自己」会退化成零长度线段
      const c = centerOf(a)
      const g = svg('g', { class: 'cyc-edge' })
      g.appendChild(
        svg('path', {
          class: 'cyc-edge__line',
          d:
            `M ${c.x} ${c.y - NODE_H / 2} ` +
            `C ${c.x - 30} ${c.y - NODE_H / 2 - 34}, ` +
            `${c.x + 30} ${c.y - NODE_H / 2 - 34}, ` +
            `${c.x} ${c.y - NODE_H / 2}`,
          fill: 'none',
        }),
      )
      g.appendChild(
        svg('path', {
          class: 'cyc-edge__head',
          d: `M ${c.x} ${c.y - NODE_H / 2} L ${c.x - 7} ${c.y - NODE_H / 2 - 13} L ${c.x + 7} ${c.y - NODE_H / 2 - 13} Z`,
        }),
      )
      edges.push(g)
    } else {
      edges.push(nodeArrow(centerOf(n - 1), centerOf(a)))
    }
  }
  for (const e of edges) parent.appendChild(e)

  // ── 节点 ─────────────────────────────────────────────────────────────────
  const nodes = V.map((value, index) => {
    const c = centerOf(index)
    const g = makeNode(parent, value, c.x, c.y)
    return { g, cx: c.x, cy: c.y, index, inRing: hasCycle && index >= a, ringK: hasCycle && index >= a ? index - a : -1 }
  })

  // ── 入口标记 ─────────────────────────────────────────────────────────────
  if (hasCycle && n > 0) {
    const c = centerOf(a)
    const g = svg('g', { class: 'cyc-entry' })
    g.appendChild(
      svg('rect', {
        class: 'cyc-entry__box',
        x: c.x - NODE_W / 2 - 5,
        y: c.y - NODE_H / 2 - 5,
        width: NODE_W + 10,
        height: NODE_H + 10,
        rx: 11,
      }),
    )
    // 标签用「入口」两个字而不是「环入口」：入口节点在环的左点，正上方偏右
    // 就是「入口 → 环上第 2 个节点」那条边，字一宽就会压上去（实测过）。
    const tag = svg('text', {
      class: 'cyc-entry__tag',
      x: c.x,
      y: c.y - NODE_H / 2 - 16,
    })
    tag.textContent = '入口'
    g.appendChild(tag)
    parent.appendChild(g)
  }

  let nullPos = null
  if (!hasCycle && n > 0) {
    const last = centerOf(n - 1)
    const tail = last.x + NODE_W / 2 + 30
    hArrow(parent, last.x + NODE_W / 2, tail - 15, rowY)
    nullMarker(parent, tail, rowY)
    nullPos = { x: tail, y: rowY }
  }

  return {
    a,
    b,
    hasCycle,
    width,
    height,
    rowY,
    ringCenter: { x: ringCx, y: rowY },
    radius: R,
    nullPos,
    nodes,
    ringKOf: (index) => (hasCycle && index >= a ? index - a : -1),
    at: (index) => nodes[index],
  }
}
