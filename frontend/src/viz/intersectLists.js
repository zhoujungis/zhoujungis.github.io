/**
 * intersectLists.js — 「相交链表」(LeetCode 160) 的交互式推演动画。
 *
 * 和系列里其它动画一样是 vanilla JS：正文要过三道清洗（Python-Markdown →
 * bleach → DOMPurify），svg/style/script 都不在白名单里，动画只能在客户端
 * 现场构建，文章里只留占位符：
 *
 *     <div class="algo-viz algo-viz--lc160"></div>
 *
 * 结构分工：
 *     ./intersectSteps.js  纯状态机，产出每一步快照（有单测）
 *     ./widgetChrome.js    公共外壳：容器 / 说明文字 / 控制条 / svg 小工具
 *     本文件                只负责把快照画成 SVG
 *
 * ── 画面怎么表达"相交" ────────────────────────────────────────────────────
 *
 * 这是这个动画要解决的核心问题：两条链**共享一段尾部**，画成两条独立的
 * 横排就假了。做法是：
 *
 * 1. **Y 形布局**。A 占第一行（靠上），B 占第二行（靠下但更靠左）。两条链
 *    各自的独有段从左右两端往中间走，然后**在同一个 x 上并成一条**，
 *    公共段落在最上面一行（跟 A 独有段同一行），B 的那截用一个向上拱起的
 *    斜箭头汇进来 —— 这就是 Y 字的那一撇。
 *
 * 2. **公共段只有一份节点**。共享后缀的节点是"同一个盒子"，A 和 B 都指向它。
 *    这一步在渲染上就是：公共段的节点只画一次，坐标由共享位置决定，
 *    两条链的边都指过去。
 *
 * 3. **游标徽标 + 换头弧线**。pA / pB 各有一个徽标。**换头那一帧**会画一条
 *    从尾节点绕到对方头节点的虚线弧（带箭头）—— 那是这套解法里唯一一个
 *    反直觉的动作，值得单独停在画面上讲一遍。
 *
 * 4. **答案标记**。相交起始节点常驻一个橙色虚线框，最后一步和它重合。
 *
 * 用法：
 *     import { mountIntersectLists } from '@/viz/intersectLists'
 *     const handle = mountIntersectLists(host)
 *     handle.destroy()
 */

import { buildIntersectSteps, uniqueLengthsOf } from './intersectSteps'
import {
  ensureChromeStyles,
  renderRichText,
  createControls,
  createPlayer,
  svgEl as svg,
} from './widgetChrome'

const STYLE_ID = 'ints-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NODE_W = 62
const NODE_H = 46
const GAP = 40
const PAD = 46
// 三条横向"车道"，从上到下，互不重叠：
//   CHIP 车道（pA / pB 的徽标）  →  顶部标注
//   A 行 + 公共段
//   换头弧线车道（走中间那条空当）
//   B 行
//   CHIP 车道（pB 在 A 行时的备用位） →  判定横幅
const ROW_A = 150 // A / 公共段 所在行
const ROW_B = 286 // B 独有段所在行
const CHIP_ABOVE_A = ROW_A - 62 // pA 正常位置（A 行上方）
const CHIP_BELOW_B = ROW_B + 62 // pB 正常位置（B 行下方）
const HOP_LANE = (ROW_A + NODE_H + ROW_B) / 2 // 两行中间的换头弧线车道
const CHIP_W = 52
const CHIP_H = 24
const NULL_PAD = 34
const HOP_MARGIN = 30 // 左右两侧留一点余量，免得首尾节点贴边
const VERDICT_CY = 396
const TOP_NOTE_CY = 44
const ROW_LABEL_DX = -34

const PLAY_MS = 1250

const STYLES = `
.ints {
  --ints-node: var(--text-primary, #1f2a24);
  --ints-edge: var(--text-secondary, #657168);
  --ints-a: var(--accent, #3f6b57);
  --ints-b: var(--accent-secondary, #a45f45);
  --ints-ok: var(--accent, #3f6b57);
  --ints-bad: #c0392b;
}
html.theme-dark .ints {
  --ints-a: #7fc3a4;
  --ints-b: #e0a06a;
  --ints-bad: #ff8a7a;
}
.ints__svg { min-width: 560px; }

.ints-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease, stroke-width 0.24s ease, opacity 0.24s ease;
}
.ints-node__value {
  fill: var(--ints-node);
  font-size: 17px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 公共段节点：加粗描边，指出"这块是两条链共用的" */
.ints-node.is-shared .ints-node__box { stroke-dasharray: none; stroke-width: 1.5; }
.ints-node.is-shared .ints-node__value { font-weight: 700; }
/* 当前被游标指到的节点 */
.ints-node.is-cursor-a .ints-node__box { stroke: var(--ints-a); stroke-width: 2.5; }
.ints-node.is-cursor-b .ints-node__box { stroke: var(--ints-b); stroke-width: 2.5; }
.ints-node.is-meet .ints-node__box { stroke: var(--ints-ok); stroke-width: 3; fill: rgba(63, 107, 87, 0.08); }

/* 答案常驻标记（橙色虚线框） */
.ints-answer__box {
  fill: none;
  stroke: var(--ints-b);
  stroke-width: 2.2;
  stroke-dasharray: 6 4;
  opacity: 1;
}

.ints-edge__line { stroke: var(--ints-edge); stroke-width: 1.8; stroke-linecap: round; fill: none; }
.ints-edge__head { fill: var(--ints-edge); }
/* B 汇入公共段的斜边：用 B 的颜色区分"这撇是从 B 那边上来的" */
.ints-edge--b .ints-edge__line { stroke: var(--ints-b); }
.ints-edge--b .ints-edge__head { fill: var(--ints-b); }

/* chip 引线 */
.ints-lead { stroke-width: 1.4; opacity: 0.85; }
.ints-lead--a { stroke: var(--ints-a); }
.ints-lead--b { stroke: var(--ints-b); }

/* 换头弧线 */
.ints-hop { opacity: 0; transition: opacity 0.3s ease; }
.ints-hop.is-on { opacity: 1; }
.ints-hop__line {
  fill: none;
  stroke: var(--ints-b);
  stroke-width: 2.2;
  stroke-dasharray: 7 4;
  stroke-linecap: round;
}
.ints-hop--a .ints-hop__line { stroke: var(--ints-a); }
.ints-hop__head { fill: var(--ints-b); }
.ints-hop--a .ints-hop__head { fill: var(--ints-a); }
.ints-hop__tag-bg { fill: var(--surface-muted, #ecefe8); }
.ints-hop__tag {
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--ints-b);
}
.ints-hop--a .ints-hop__tag { fill: var(--ints-a); }

/* 行标签 */
.ints-row__text {
  fill: var(--text-secondary, #657168);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ints-row__text--a { fill: var(--ints-a); }
.ints-row__text--b { fill: var(--ints-b); }

/* 顶部那句"公共段从这里开始"的标注 */
.ints-shared-note__text {
  fill: var(--text-secondary, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
}
.ints-shared-note__line { stroke: var(--text-secondary, #657168); stroke-width: 1; stroke-dasharray: 3 3; opacity: 0.7; }

.ints-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.ints-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'Segoe UI Symbol', 'DejaVu Sans', Arial, sans-serif;
}

/* 底部判定横幅 */
.ints-verdict__box {
  fill: none;
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.ints-verdict__text {
  fill: var(--text-secondary, #657168);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
}
.ints-verdict.is-ok .ints-verdict__box { fill: var(--ints-ok); stroke: var(--ints-ok); }
.ints-verdict.is-ok .ints-verdict__text { fill: #fff; }
.ints-verdict.is-bad .ints-verdict__box { fill: var(--ints-bad); stroke: var(--ints-bad); }
.ints-verdict.is-bad .ints-verdict__text { fill: #fff; }

.ints-chip { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.ints-chip__box { rx: 12; ry: 12; }
.ints-chip__text {
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: #fff;
}
.ints-chip--a .ints-chip__box { fill: var(--ints-a); }
.ints-chip--b .ints-chip__box { fill: var(--ints-b); }

@media (prefers-reduced-motion: reduce) {
  .ints-node__box, .ints-chip, .ints-verdict__box, .ints-hop { transition: none; }
}
`

function ensureStyles() {
  ensureChromeStyles()
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLES
  document.head.appendChild(style)
}

/**
 * 挂载动画。
 * @param {HTMLElement} host 占位元素（会被填满）
 * @param {{
 *   pool?: (number|string)[],
 *   pathA?: number[],
 *   pathB?: number[],
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 * @returns {{ destroy: () => void }}
 */
export function mountIntersectLists(host, options = {}) {
  if (!host || host.dataset.intsMounted === '1') {
    return { destroy() {} }
  }
  host.dataset.intsMounted = '1'
  ensureStyles()

  const steps = buildIntersectSteps(options)
  const head = steps[0]
  const autoplay = options.autoplay !== false

  // 结构直接从状态机的默认值反推（状态机已经把 pool / pathA / pathB 归一化了）
  const pool = Array.isArray(options.pool) && options.pool.length
    ? options.pool
    : [1, 2, 3, 4, 5, 6, 7]
  const pathA = Array.isArray(options.pathA) ? options.pathA : [0, 1, 2, 3, 4]
  const pathB = Array.isArray(options.pathB) ? options.pathB : [5, 6, 3, 4]

  // 公共段长度：决定哪些节点是"共享"的
  const { a, b, c } = uniqueLengthsOf(pathA, pathB)
  const sharedSlots = c > 0 ? pathA.slice(a) : []
  const sharedSet = new Set(sharedSlots)
  const tailSlotA = a > 0 ? pathA[a - 1] : null
  const tailSlotB = b > 0 ? pathB[b - 1] : null

  // ── 布局 ─────────────────────────────────────────────────────────────────
  // A 行（上行）：A 的独有段 + 公共段，从左往右排
  // B 行（下行）：B 的独有段，左端对齐到 A 行第一个节点左边
  const maxCols = Math.max(pathA.length, pathB.length, 1)
  // 所有 x 坐标整体右移 HOP_MARGIN，给左侧那条换头回环让出空当
  const X_OFFSET = HOP_MARGIN
  const colX = (i) => X_OFFSET + PAD + i * (NODE_W + GAP)
  const nodeW = 2 * PAD + maxCols * NODE_W + (maxCols - 1) * GAP
  const width = nodeW + NULL_PAD * 2 + HOP_MARGIN * 2
  const height = VERDICT_CY + 44
  const rightNullX = X_OFFSET + nodeW + NULL_PAD

  // 公共段在 A 行里的列位置
  const sharedStartCol = a
  const rowCy = (top) => top + NODE_H / 2

  /** pool 下标 → {x, y, col}。公共段统一落在 A 行，独占节点落在自己那行。 */
  function posOf(slot) {
    const ia = pathA.indexOf(slot)
    const ib = pathB.indexOf(slot)
    if (ia >= 0 && sharedSet.has(slot)) {
      return { x: colX(sharedStartCol + (ia - a)), y: ROW_A, col: sharedStartCol + (ia - a) }
    }
    if (ia >= 0 && ib < 0) return { x: colX(ia), y: ROW_A, col: ia }
    if (ib >= 0 && ia < 0) return { x: colX(ib), y: ROW_B, col: ib }
    if (ia >= 0) return { x: colX(ia), y: ROW_A, col: ia }
    return { x: colX(ib), y: ROW_B, col: ib }
  }

  // ── SVG 骨架 ─────────────────────────────────────────────────────────────
  const root = document.createElement('div')
  root.className = 'viz ints'

  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  root.appendChild(stage)

  const svgRoot = svg('svg', {
    class: 'viz__svg ints__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': `相交链表推演动画`,
  })
  stage.appendChild(svgRoot)

  // 顶部：公共段标注
  const noteG = svg('g', { class: 'ints-shared-note' })
  const noteLine = svg('line', { class: 'ints-shared-note__line' })
  const noteText = svg('text', { class: 'ints-shared-note__text', x: width / 2, y: TOP_NOTE_CY })
  noteG.append(noteLine, noteText)
  svgRoot.appendChild(noteG)

  // 两个 ∅
  const nulls = []
  for (const [nx, ny] of [[rightNullX, rowCy(ROW_A)], [rightNullX, rowCy(ROW_B)]]) {
    svgRoot.appendChild(svg('circle', { class: 'ints-null__ring', cx: nx, cy: ny, r: 14 }))
    const t = svg('text', { class: 'ints-null__text', x: nx, y: ny })
    t.textContent = '∅'
    svgRoot.appendChild(t)
    nulls.push({ cx: nx, cy: ny })
  }

  const edgeG = svg('g', { class: 'ints-edges' })
  svgRoot.appendChild(edgeG)

  // 答案常驻标记
  const ansG = svg('g', { class: 'ints-answer' })
  const ansBox = svg('rect', {
    class: 'ints-answer__box',
    x: 0,
    y: 0,
    width: NODE_W + 14,
    height: NODE_H + 14,
    rx: 13,
  })
  ansG.appendChild(ansBox)
  svgRoot.appendChild(ansG)

  // 节点：整个结构里每个 pool 节点只画一次
  const nodeGs = new Map()
  for (const slot of new Set([...pathA, ...pathB])) {
    const p = posOf(slot)
    const g = svg('g', {
      class: `ints-node${sharedSet.has(slot) ? ' is-shared' : ''}`,
    })
    g.setAttribute('transform', `translate(${p.x} ${p.y})`)
    g.appendChild(svg('rect', { class: 'ints-node__box', x: 0, y: 0, width: NODE_W, height: NODE_H, rx: 9 }))
    const t = svg('text', { class: 'ints-node__value', x: NODE_W / 2, y: NODE_H / 2 })
    t.textContent = String(pool[slot])
    g.appendChild(t)
    svgRoot.appendChild(g)
    nodeGs.set(slot, g)
  }

  // 边：每条链的 next 关系，每个 (from) 只画一次，避免公共段被画两遍
  const edgeSpecs = []
  const pushPathEdges = (path, kind) => {
    for (let k = 0; k < path.length - 1; k += 1) {
      const from = path[k]
      const to = path[k + 1]
      // 公共段内部的边只画一次（用 A 的颜色）
      const key = `${from}->${to}`
      if (edgeSpecs.some((e) => e.key === key)) continue
      edgeSpecs.push({ key, from, to, kind })
    }
  }
  pushPathEdges(pathA, 'a')
  pushPathEdges(pathB, 'b')

  const edgeEls = []
  for (const spec of edgeSpecs) {
    const g = svg('g', { class: `ints-edge ints-edge--${spec.kind}` })
    const line = svg('path', { class: 'ints-edge__line' })
    const head = svg('path', { class: 'ints-edge__head' })
    g.append(line, head)
    edgeG.appendChild(g)
    edgeEls.push({ ...spec, g, line, head })
  }
  // 尾 → ∅
  const tailEdges = []
  {
    const g = svg('g', { class: 'ints-edge' })
    const line = svg('path', { class: 'ints-edge__line' })
    const head = svg('path', { class: 'ints-edge__head' })
    g.append(line, head)
    edgeG.appendChild(g)
    tailEdges.push({ g, line, head, slot: pathA[pathA.length - 1], row: ROW_A })
  }

  // 换头弧线（两条：pA 的、pB 的）
  const hops = {}
  for (const kind of ['a', 'b']) {
    const g = svg('g', { class: `ints-hop ints-hop--${kind}` })
    const line = svg('path', { class: 'ints-hop__line' })
    const head = svg('path', { class: 'ints-hop__head' })
    const tagBg = svg('rect', { class: 'ints-hop__tag-bg', x: -76, y: -9, width: 152, height: 18, rx: 6 })
    const tag = svg('text', { class: 'ints-hop__tag', x: 0, y: 0 })
    g.append(line, head, tagBg, tag)
    svgRoot.appendChild(g)
    hops[kind] = { g, line, head, tagBg, tag }
  }

  // 行标签
  const rowLabels = []
  if (a > 0) {
    const t = svg('text', { class: 'ints-row__text ints-row__text--a', x: colX(0) + ROW_LABEL_DX, y: rowCy(ROW_A) })
    t.textContent = 'A'
    svgRoot.appendChild(t)
    rowLabels.push(t)
  }
  if (b > 0) {
    const t = svg('text', { class: 'ints-row__text ints-row__text--b', x: colX(0) + ROW_LABEL_DX, y: rowCy(ROW_B) })
    t.textContent = 'B'
    svgRoot.appendChild(t)
    rowLabels.push(t)
  }

  // 游标 chip
  function makeChip(kind, text) {
    const g = svg('g', { class: `ints-chip ints-chip--${kind}` })
    g.appendChild(
      svg('rect', { class: 'ints-chip__box', x: -CHIP_W / 2, y: -CHIP_H / 2, width: CHIP_W, height: CHIP_H }),
    )
    const t = svg('text', { class: 'ints-chip__text', x: 0, y: 0 })
    t.textContent = text
    g.appendChild(t)
    return g
  }
  const chipA = makeChip('a', 'pA')
  const chipB = makeChip('b', 'pB')
  svgRoot.append(chipA, chipB)

  // chip 引线（画在节点下层）
  const leadA = svg('line', { class: 'ints-lead ints-lead--a' })
  const leadB = svg('line', { class: 'ints-lead ints-lead--b' })
  edgeG.append(leadA, leadB)

  // 底部判定横幅
  const verdictG = svg('g', { class: 'ints-verdict' })
  const vbW = 240
  const verdictBox = svg('rect', {
    class: 'ints-verdict__box',
    x: (width - vbW) / 2,
    y: VERDICT_CY - 18,
    width: vbW,
    height: 36,
    rx: 18,
  })
  const verdictText = svg('text', { class: 'ints-verdict__text', x: width / 2, y: VERDICT_CY })
  verdictG.append(verdictBox, verdictText)
  svgRoot.appendChild(verdictG)

  // 说明文字 + 控制条
  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')
  root.appendChild(desc)

  const controls = createControls()
  root.appendChild(controls.root)

  host.textContent = ''
  host.appendChild(root)

  let observer = null

  // 静态边几何
  for (const e of edgeEls) {
    const p1 = posOf(e.from)
    const p2 = posOf(e.to)
    drawEdge(e, p1, p2)
  }
  {
    const e = tailEdges[0]
    const p1 = posOf(e.slot)
    const y = p1.y + NODE_H / 2
    const x1 = p1.x + NODE_W + 3
    const x2 = rightNullX - 14
    e.line.setAttribute('d', `M ${x1} ${y} L ${x2 - 8} ${y}`)
    e.head.setAttribute('d', `M ${x2} ${y} L ${x2 - 9} ${y - 5.5} L ${x2 - 9} ${y + 5.5} Z`)
  }

  /**
   * 一条边。同行相邻走直线；跨行（B 的独有段尾巴汇入公共段）走一条向右上
   * 拱起的曲线 —— 那正是 Y 字右边那一撇。
   */
  function drawEdge(e, p1, p2) {
    const sameRow = p1.y === p2.y
    if (sameRow) {
      const y = p1.y + NODE_H / 2
      const x1 = p1.x + NODE_W
      const x2 = p2.x
      e.line.setAttribute('d', `M ${x1 + 3} ${y} L ${x2 - 9} ${y}`)
      e.head.setAttribute('d', `M ${x2} ${y} L ${x2 - 9} ${y - 5.5} L ${x2 - 9} ${y + 5.5} Z`)
      return
    }
    // 跨行：从源节点右侧水平出去，然后平滑爬升到目标节点左侧，箭头水平指向目标
    // —— 和普通边同一个"进入方式"，读起来统一。那正是 Y 字右边那一撇。
    const x1 = p1.x + NODE_W
    const y1 = p1.y + NODE_H / 2
    const x2 = p2.x
    const y2 = p2.y + NODE_H / 2
    const xa = x1 + 3
    const xb = x2 - 9
    // 控制点横向放在**区间外侧**（xa 再往右、xb 再往左），这样曲线是标准的
    // S 形：先水平出去，再爬升，最后水平进入。放在区间内侧会挤成一条竖线。
    const dx = Math.max(26, (xb - xa) * 0.45)
    e.line.setAttribute(
      'd',
      `M ${xa} ${y1} C ${xa + dx} ${y1}, ${xb - dx} ${y2}, ${xb} ${y2}`,
    )
    e.head.setAttribute('d', `M ${x2} ${y2} L ${x2 - 9} ${y2 - 5.5} L ${x2 - 9} ${y2 + 5.5} Z`)
  }

  /**
   * 换头弧线：从"刚才走到的尾节点"绕到"对方链表的头节点"。
   *
   * 几何上**就地绕**，不绕整个画布 —— 大回环在缩略图里就是一团乱线。
   * 做法是从源节点朝内的一侧出去，沿两行中间那条空当（HOP_LANE）横穿，
   * 再从目标节点的内侧拐进去，是一条紧凑的 S：
   *
   *   pB 换头：B 尾（下行靠右）→ 从节点**上方**出去 → 沿中间车道往左 →
   *            折上去进 A 的头（上行靠左）
   *   pA 换头：A 尾（上行靠右）→ 从节点**下方**出去 → 沿中间车道往左 →
   *            折下来进 B 的头（下行靠左）
   *
   * 两条路都是"往左横穿"，起点在右、终点在左，跟指针的移动方向一致。
   */
  function paintHop(kind, step, on) {
    const hop = hops[kind]
    hop.g.classList.toggle('is-on', on)
    if (!on) return
    const fromSlot = kind === 'a' ? step.fromA : step.fromB
    const on_ = kind === 'a' ? step.onA : step.onB
    const toPath = on_ === 'A' ? pathA : pathB
    if (fromSlot === null || fromSlot === undefined) return
    const p1 = posOf(fromSlot)
    const p2 = posOf(toPath[0])

        // 起点：源节点朝"中间车道"的那条边
    const x1 = p1.x + NODE_W / 2
    const y1 = kind === 'a' ? p1.y + NODE_H : p1.y // pA 在上一行 → 从下方出；pB → 从上方出
    // 终点：目标节点朝车道的那条边
    const x2 = p2.x + NODE_W / 2
    const y2 = kind === 'a' ? p2.y : p2.y + NODE_H // pA 去 B 行 → 落在上沿；pB 去 A 行 → 落在下沿

    const lane = HOP_LANE
    // 从源节点垂直走到车道，横穿到目标 x，再垂直进入目标节点
    hop.line.setAttribute(
      'd',
      `M ${x1} ${y1} L ${x1} ${lane} L ${x2} ${lane} L ${x2} ${y2}`,
    )
    // 箭头垂直进入目标
    const up = y2 < lane
    hop.head.setAttribute(
      'd',
      up
        ? `M ${x2} ${y2} L ${x2 - 5.5} ${y2 + 9} L ${x2 + 5.5} ${y2 + 9} Z`
        : `M ${x2} ${y2} L ${x2 - 5.5} ${y2 - 9} L ${x2 + 5.5} ${y2 - 9} Z`,
    )
    // 标签挂在车道中段（横穿那一段的中点），水平放置
    const tagX = (x1 + x2) / 2
    hop.tagBg.setAttribute('x', tagX - 76)
    hop.tagBg.setAttribute('y', lane - 9)
    hop.tag.setAttribute('x', tagX)
    hop.tag.setAttribute('y', lane)
    hop.tag.textContent = kind === 'a' ? 'pA 走完 A → 换到 B 的头' : 'pB 走完 B → 换到 A 的头'
  }

  /** 游标落在哪：按 (on, i) 查节点；i 越界表示已踩到 ∅ 上。 */
  function cursorPos(step, which) {
    const on = which === 'A' ? step.onA : step.onB
    const i = which === 'A' ? step.iA : step.iB
    const path = on === 'A' ? pathA : pathB
    if (i >= path.length) {
      const row = on === 'A' ? ROW_A : ROW_B
      return { x: rightNullX - NODE_W / 2, y: row, onNull: true }
    }
    const p = posOf(path[i])
    return { ...p, onNull: false }
  }

  function paint(_index, step) {
    const slotA = (() => {
      const p = step.onA === 'A' ? pathA : pathB
      return step.iA >= p.length ? null : p[step.iA]
    })()
    const slotB = (() => {
      const p = step.onB === 'A' ? pathA : pathB
      return step.iB >= p.length ? null : p[step.iB]
    })()

    // 节点状态
    for (const [slot, g] of nodeGs) {
      g.classList.toggle('is-cursor-a', slot === slotA)
      g.classList.toggle('is-cursor-b', slot === slotB && slot !== slotA)
      g.classList.toggle('is-meet', step.meet !== null && slot === step.meet)
    }

    // 答案标记：确定相交起始节点时常驻
    if (step.answer !== null && step.answer !== undefined) {
      const p = posOf(step.answer)
      ansBox.setAttribute('x', p.x - 7)
      ansBox.setAttribute('y', p.y - 7)
      ansG.style.opacity = '1'
    } else {
      ansG.style.opacity = '0'
    }

    // 顶部标注：公共段从哪开始
    if (step.answer !== null && step.answer !== undefined && c > 0) {
      const p = posOf(step.answer)
      const lx = p.x + NODE_W / 2
      noteText.textContent = `公共段从这里开始（两条链共用这 ${c} 个节点）`
      noteLine.setAttribute('x1', lx)
      noteLine.setAttribute('x2', lx)
      noteLine.setAttribute('y1', TOP_NOTE_CY + 11)
      noteLine.setAttribute('y2', ROW_A - 12)
      noteG.style.opacity = '1'
    } else {
      noteG.style.opacity = '0'
    }

    // 游标 chip：默认挂在"游标所在那一行"的外侧。
    // pA 挂 A 行上方；pB 挂 B 行下方 —— 但 pB 换头之后会走到 A 行上，
    // 那时它也必须跟着挪到 A 行上方（否则引线要横穿整张图）。
    // 两个游标踩到同一个节点时上下错开，避免叠在一起。
    const pa = cursorPos(step, 'A')
    const pb = cursorPos(step, 'B')
    const same = slotA !== null && slotA === slotB
    const aRow = pa.onNull ? ROW_A : pa.y
    const bRow = pb.onNull ? ROW_B : pb.y
    const chipYA = aRow === ROW_B ? CHIP_BELOW_B : CHIP_ABOVE_A
    const chipYB = bRow === ROW_A ? CHIP_ABOVE_A : CHIP_BELOW_B
    // 同节点时把 pA 再往上、pB 再往下让一点，两根引线不会重在一起
    const paCy = same ? chipYA - 14 : chipYA
    const pbCy = same ? chipYB + 14 : chipYB
    chipA.setAttribute('transform', `translate(${pa.x + NODE_W / 2} ${paCy})`)
    chipB.setAttribute('transform', `translate(${pb.x + NODE_W / 2} ${pbCy})`)
    chipA.style.opacity = '1'
    chipB.style.opacity = '1'

    // chip 引线：从徽标靠节点的那条边拉一条虚线到节点边缘。
    // 方向由"徽标在节点的上方还是下方"决定，而不是固定向上/向下 ——
    // 否则 pB 跑到 A 行时引线会穿过整张图。
    const lead = (chipCy, p) => {
      const up = chipCy < p.y
      const x = p.x + NODE_W / 2
      const y1 = up ? chipCy + CHIP_H / 2 : chipCy - CHIP_H / 2
      const y2 = up ? p.y - 2 : p.y + NODE_H + 2
      return { x, y1, y2 }
    }
    const la = lead(paCy, pa)
    const lb = lead(pbCy, pb)
    leadA.setAttribute('x1', la.x)
    leadA.setAttribute('x2', la.x)
    leadA.setAttribute('y1', la.y1)
    leadA.setAttribute('y2', la.y2)
    leadB.setAttribute('x1', lb.x)
    leadB.setAttribute('x2', lb.x)
    leadB.setAttribute('y1', lb.y1)
    leadB.setAttribute('y2', lb.y2)

    // 换头弧线
    paintHop('a', step, step.phase === 'jump' && step.jumpsA)
    paintHop('b', step, step.phase === 'jump' && step.jumpsB)

    // 判定横幅
    verdictG.setAttribute('class', 'ints-verdict')
    let vText = '准备开始'
    if (step.phase === 'found') {
      verdictG.classList.add('is-ok')
      vText = `✓ 相交于节点 ${pool[step.meet]}`
    } else if (step.phase === 'none') {
      verdictG.classList.add('is-bad')
      vText = '✗ 两条链表不相交'
    } else if (step.phase === 'jump') {
      vText = '换头中…'
    } else if (step.phase === 'walk') {
      vText = '同步前进中…'
    } else if (step.phase === 'init') {
      vText = '待判定'
    }
    verdictText.textContent = vText

    renderRichText(desc, step.desc)
  }

  const player = createPlayer({
    steps,
    controls,
    intervalMs: PLAY_MS,
    onRender: paint,
  })
  player.jumpTo(Math.trunc(options.initialStep) || 0)

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (autoplay && !reduced && typeof IntersectionObserver === 'function') {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect()
            observer = null
            player.play()
            return
          }
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(root)
  }

  return {
    destroy() {
      if (observer) {
        observer.disconnect()
        observer = null
      }
      player.destroy()
      host.textContent = ''
      delete host.dataset.intsMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

export default mountIntersectLists
