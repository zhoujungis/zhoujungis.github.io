/**
 * removeDups2.js — 「删除排序链表中的重复元素 II」(LeetCode 82) 的交互式推演动画。
 *
 * 和系列里其它动画一样是 vanilla JS：正文要过三道清洗（Python-Markdown →
 * bleach → DOMPurify），svg/style/script 都不在白名单里，动画只能在客户端
 * 现场构建，文章里只留占位符：
 *
 *     <div class="algo-viz algo-viz--lc82"></div>
 *
 * 结构分工：
 *     ./removeDupSteps.js  纯状态机，产出每一步快照（有单测）
 *     ./widgetChrome.js    公共外壳：容器 / 说明文字 / 控制条 / svg 小工具
 *     本文件               只负责把快照画成 SVG
 *
 * ── 画面怎么表达"删除一段" ────────────────────────────────────────────────
 *
 * 这题的看点不是"两个指针怎么走"，而是**两个指针走得不整齐**：
 * `curr` 一头扎进重复段往前冲，`prev` 却钉在原地等 —— 等到 `curr` 冲出
 * 重复段，才用一条新边把 prev 直接接到 curr。所以画面要突出三件事：
 *
 * 1. **dummy 虚线节点**。挂在整个链表最左边。它是"头节点也可能被删"的
 *    唯一保证 —— 头节点没有前驱，硬删就是写不出来的。这个节点在内存里
 *    并不存在，所以画成虚线。
 *
 * 2. **重复段高亮**。正在处理的那一段重复节点整体套一层橙色框，
 *    让"这一整段要被摘掉"变成一个视觉对象，而不是靠读者自己数。
 *
 * 3. **错位的双游标**。`prev` 挂在节点下方、`curr` 挂在节点上方，中间拉
 *    一条引线。重复段里 `curr` 往右跑而 `prev` 不动时，两条引线会明显
 *    错开 —— 这正是"为什么 prev 不能跟着走"的图解。
 *
 * 4. **摘链弧线**。`unlink` 帧画一条从 `prev` 越过整段重复节点、
 *    落到 `curr` 的弧线；被摘的节点同时变灰打叉。
 *
 * 用法：
 *     import { mountRemoveDups2 } from '@/viz/removeDups2'
 *     const handle = mountRemoveDups2(host)
 *     handle.destroy()
 */

import { buildRemoveDupSteps } from './removeDupSteps'
import {
  ensureChromeStyles,
  renderRichText,
  createControls,
  createPlayer,
  svgEl as svg,
} from './widgetChrome'

const STYLE_ID = 'rd2-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
// 纵向分六条带，从下到上没有遮挡：
//   CHIP_PREV_CY       prev 徽标（节点下方）
//   ROW_TOP            链表本体
//   DUP_LABEL_CY       重复段标注（框上方）
//   CHIP_CURR_CY       curr 徽标（节点上方）
//   NOTE_CY            顶部一句话
//   VERDICT_CY         底部判定横幅
const DUMMY_SLOT = 0 // slot 0 固定留给 dummy
const NODE_W = 62
const NODE_H = 48
const GAP = 38
const PAD = 44
const ROW_TOP = 150
const ROW_CY = ROW_TOP + NODE_H / 2
const CHIP_W = 58
const CHIP_H = 24
const CHIP_CURR_CY = ROW_TOP - 62
const CHIP_PREV_CY = ROW_TOP + NODE_H + 66
const DUP_LABEL_CY = ROW_TOP - 34
const DUP_FRAME_PAD = 8
const NOTE_CY = 46
const VERDICT_CY = 372
const NULL_PAD = 46

const PLAY_MS = 1150

const STYLES = `
.rd2 {
  --rd2-prev: var(--accent, #3f6b57);
  --rd2-curr: var(--accent-secondary, #a45f45);
  --rd2-edge: var(--text-secondary, #657168);
  --rd2-cut: #b3452e;
  --rd2-dup: #c8873f;
}
html.theme-dark .rd2 {
  --rd2-prev: #7fc3a4;
  --rd2-curr: #e0a06a;
  --rd2-cut: #e07a5f;
  --rd2-dup: #e8b06a;
}
.rd2__svg { min-width: 600px; }

.rd2-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, opacity 0.26s ease;
}
/* dummy 是哨兵，内存里不存在 —— 画虚线 */
.rd2-node--dummy .rd2-node__box { stroke-dasharray: 5 4; }
.rd2-node--dummy .rd2-node__value { font-size: 13px; fill: var(--text-secondary, #657168); }
.rd2-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 18px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 被摘掉的节点：变灰 + 虚线 + 划掉 */
.rd2-node.is-cut .rd2-node__box {
  stroke: var(--text-secondary, #657168);
  stroke-dasharray: 5 3;
  opacity: 0.5;
}
.rd2-node.is-cut .rd2-node__value { opacity: 0.42; text-decoration: line-through; }
/* 正在被处理的重复段成员 */
.rd2-node.is-dup .rd2-node__box { stroke: var(--rd2-dup, #c8873f); stroke-width: 2.2; }
/* 游标落点 */
.rd2-node.is-prev .rd2-node__box { stroke: var(--rd2-prev, #3f6b57); stroke-width: 2.6; }
.rd2-node.is-curr .rd2-node__box { stroke: var(--rd2-curr, #a45f45); stroke-width: 2.6; }

/* 重复段整体外框 */
.rd2-dupframe { opacity: 0; transition: opacity 0.26s ease; }
.rd2-dupframe.is-on { opacity: 1; }
.rd2-dupframe__box {
  fill: rgba(200, 135, 63, 0.09);
  stroke: var(--rd2-dup, #c8873f);
  stroke-width: 2;
  stroke-dasharray: 6 4;
}
.rd2-dupframe__tag-bg { fill: var(--surface-muted, #ecefe8); }
.rd2-dupframe__tag {
  fill: var(--rd2-dup, #c8873f);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rd2-edge { opacity: 0; transition: opacity 0.26s ease; }
.rd2-edge.is-on { opacity: 1; }
.rd2-edge__line { stroke: var(--rd2-edge, #657168); stroke-width: 1.8; stroke-linecap: round; }
.rd2-edge__head { fill: var(--rd2-edge, #657168); }

/* 摘链弧线 */
.rd2-arc { opacity: 0; transition: opacity 0.26s ease; }
.rd2-arc.is-on { opacity: 1; }
.rd2-arc__line {
  fill: none;
  stroke: var(--rd2-cut, #b3452e);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-dasharray: 7 4;
}
.rd2-arc__head { fill: var(--rd2-cut, #b3452e); }
.rd2-arc__tag-bg { fill: var(--surface-muted, #ecefe8); }
.rd2-arc__tag {
  fill: var(--rd2-cut, #b3452e);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rd2-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.rd2-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'Segoe UI Symbol', 'DejaVu Sans', Arial, sans-serif;
}

.rd2-note__text {
  fill: var(--text-secondary, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
}
.rd2-note__line {
  stroke: var(--text-secondary, #657168);
  stroke-width: 1;
  stroke-dasharray: 3 3;
  opacity: 0.7;
}

.rd2-chip { transition: transform 0.34s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.rd2-chip__box { rx: 12; ry: 12; }
.rd2-chip__text {
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: #fff;
}
.rd2-chip--prev .rd2-chip__box { fill: var(--rd2-prev, #3f6b57); }
.rd2-chip--curr .rd2-chip__box { fill: var(--rd2-curr, #a45f45); }
.rd2-lead { stroke-width: 1.4; opacity: 0.85; }
.rd2-lead--prev { stroke: var(--rd2-prev, #3f6b57); }
.rd2-lead--curr { stroke: var(--rd2-curr, #a45f45); }

/* 底部判定横幅 */
.rd2-verdict__box {
  fill: none;
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.rd2-verdict__text {
  fill: var(--text-secondary, #657168);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rd2-verdict.is-ok .rd2-verdict__box { fill: var(--rd2-prev, #3f6b57); stroke: var(--rd2-prev, #3f6b57); }
.rd2-verdict.is-ok .rd2-verdict__text { fill: #fff; }
.rd2-verdict.is-cut .rd2-verdict__box { fill: var(--rd2-cut, #b3452e); stroke: var(--rd2-cut, #b3452e); }
.rd2-verdict.is-cut .rd2-verdict__text { fill: #fff; }

@media (prefers-reduced-motion: reduce) {
  .rd2-node__box, .rd2-chip, .rd2-edge, .rd2-arc, .rd2-dupframe { transition: none; }
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
 *   path?: number[],
 *   mode?: 'remove-all' | 'keep-one',
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 * @returns {{ destroy: () => void }}
 */
export function mountRemoveDups2(host, options = {}) {
  if (!host || host.dataset.rd2Mounted === '1') {
    return { destroy() {} }
  }
  host.dataset.rd2Mounted = '1'
  ensureStyles()

  const steps = buildRemoveDupSteps(options)
  const autoplay = options.autoplay !== false

  // 结构从状态机的默认值反推（状态机已经把 pool / path 归一化了）
  const pool = Array.isArray(options.pool) && options.pool.length
    ? options.pool
    : [1, 2, 3, 3, 4, 4, 5]
  const path = Array.isArray(options.path)
    ? options.path
    : [0, 1, 2, 3, 4, 5, 6]
  const mode = options.mode === 'keep-one' ? 'keep-one' : 'remove-all'

  // slot 0 = dummy，slot k+1 = path[k]。统一用 slot 做坐标，节点绘制和
  // 游标定位都走 slot，省掉一层 dummy 的偏移换算（这是 LC 19 那篇的做法）。
  const L = path.length
  const slots = L + 1
  const slotOfPathIndex = (k) => (k < 0 ? DUMMY_SLOT : k + 1)
  const pathIndexOfSlot = (s) => s - 1

  const width = 2 * PAD + slots * NODE_W + (slots - 1) * GAP
  const slotLeft = (s) => PAD + s * (NODE_W + GAP)
  const slotCenter = (s) => slotLeft(s) + NODE_W / 2
  const height = VERDICT_CY + 44
  const nullX = width - NULL_PAD

  // ── SVG 骨架 ─────────────────────────────────────────────────────────────
  const root = document.createElement('div')
  root.className = 'viz rd2'

  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  root.appendChild(stage)

  const svgRoot = svg('svg', {
    class: 'viz__svg rd2__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': `删除排序链表中重复元素的推演动画：${path.map((i) => pool[i]).join(' → ')}`,
  })
  stage.appendChild(svgRoot)

  // 顶部一句话（说明当前在做什么）
  const noteG = svg('g', { class: 'rd2-note' })
  const noteLine = svg('line', { class: 'rd2-note__line' })
  const noteText = svg('text', { class: 'rd2-note__text', x: width / 2, y: NOTE_CY })
  noteG.append(noteLine, noteText)
  svgRoot.appendChild(noteG)

  // 右端 ∅
  svgRoot.appendChild(svg('circle', { class: 'rd2-null__ring', cx: nullX, cy: ROW_CY, r: 14 }))
  const nullText = svg('text', { class: 'rd2-null__text', x: nullX, y: ROW_CY })
  nullText.textContent = '∅'
  svgRoot.appendChild(nullText)

  // 游标引线（画在节点下层）
  const leadCurr = svg('line', { class: 'rd2-lead rd2-lead--curr' })
  const leadPrev = svg('line', { class: 'rd2-lead rd2-lead--prev' })
  svgRoot.append(leadCurr, leadPrev)

  // 边：不预先建固定骨架，每帧按当前真实的 next 结构重画。
  // 理由见 liveNextOf —— 摘链之后 prev 会直接跳到 curr，落点不是物理右邻，
  // 固定的 slot_i → slot_{i+1} 骨架根本画不出那条"跨过一段"的边。
  const edgeLayer = svg('g', { class: 'rd2-edges' })
  svgRoot.appendChild(edgeLayer)
  // 边池：按需增长，多余的隐藏（避免每帧增删 DOM）
  const edgePool = []
  function edgeAt(i) {
    while (edgePool.length <= i) {
      const g = svg('g', { class: 'rd2-edge' })
      const line = svg('line', { class: 'rd2-edge__line' })
      const head = svg('path', { class: 'rd2-edge__head' })
      g.append(line, head)
      edgeLayer.appendChild(g)
      edgePool.push({ g, line, head })
    }
    return edgePool[i]
  }

  /** 画一条从 fromSlot 右侧到 toSlot 左侧的边（同行走直线）。 */
  function drawEdge(e, fromSlot, toSlot) {
    const x1 = slotLeft(fromSlot) + NODE_W + 3
    const x2 = slotLeft(toSlot)
    const y = ROW_CY
    e.line.setAttribute('x1', x1)
    e.line.setAttribute('y1', y)
    e.line.setAttribute('x2', x2 - 9)
    e.line.setAttribute('y2', y)
    e.head.setAttribute('d', `M ${x2} ${y} L ${x2 - 9} ${y - 5.5} L ${x2 - 9} ${y + 5.5} Z`)
  }

  /** 画从 fromSlot 指向 ∅ 的尾边。 */
  function drawTailEdge(e, fromSlot) {
    const x1 = slotLeft(fromSlot) + NODE_W + 3
    const x2 = nullX - 14
    const y = ROW_CY
    e.line.setAttribute('x1', x1)
    e.line.setAttribute('y1', y)
    e.line.setAttribute('x2', x2 - 9)
    e.line.setAttribute('y2', y)
    e.head.setAttribute('d', `M ${x2} ${y} L ${x2 - 9} ${y - 5.5} L ${x2 - 9} ${y + 5.5} Z`)
  }

  // 摘链弧线（几何在 paint 里按 prev/curr 现算）
  const arcG = svg('g', { class: 'rd2-arc' })
  const arcLine = svg('path', { class: 'rd2-arc__line' })
  const arcHead = svg('path', { class: 'rd2-arc__head' })
  const arcTagBg = svg('rect', { class: 'rd2-arc__tag-bg', x: -66, y: -9, width: 132, height: 18, rx: 6 })
  const arcTag = svg('text', { class: 'rd2-arc__tag', x: 0, y: 0 })
  arcG.append(arcLine, arcHead, arcTagBg, arcTag)
  svgRoot.appendChild(arcG)

  // 重复段整体外框
  const dupG = svg('g', { class: 'rd2-dupframe' })
  const dupBox = svg('rect', { class: 'rd2-dupframe__box', x: 0, y: 0, width: 0, height: 0, rx: 14 })
  const dupTagBg = svg('rect', { class: 'rd2-dupframe__tag-bg', x: -50, y: -9, width: 100, height: 18, rx: 6 })
  const dupTag = svg('text', { class: 'rd2-dupframe__tag', x: 0, y: 0 })
  dupG.append(dupBox, dupTagBg, dupTag)
  svgRoot.appendChild(dupG)

  // 节点（slot 0 = dummy）
  const nodeGroups = []
  for (let s = 0; s < slots; s += 1) {
    const g = svg('g', { class: `rd2-node${s === DUMMY_SLOT ? ' rd2-node--dummy' : ''}` })
    g.appendChild(
      svg('rect', {
        class: 'rd2-node__box',
        x: slotLeft(s),
        y: ROW_TOP,
        width: NODE_W,
        height: NODE_H,
        rx: 9,
      }),
    )
    const t = svg('text', { class: 'rd2-node__value', x: slotCenter(s), y: ROW_CY })
    t.textContent = s === DUMMY_SLOT ? 'dummy' : String(pool[path[pathIndexOfSlot(s)]])
    g.appendChild(t)
    svgRoot.appendChild(g)
    nodeGroups.push(g)
  }

  // 游标 chip
  function makeChip(kind, text) {
    const g = svg('g', { class: `rd2-chip rd2-chip--${kind}` })
    g.appendChild(
      svg('rect', { class: 'rd2-chip__box', x: -CHIP_W / 2, y: -CHIP_H / 2, width: CHIP_W, height: CHIP_H }),
    )
    const t = svg('text', { class: 'rd2-chip__text', x: 0, y: 0 })
    t.textContent = text
    g.appendChild(t)
    return g
  }
  const chipCurr = makeChip('curr', 'curr')
  const chipPrev = makeChip('prev', 'prev')
  svgRoot.append(chipCurr, chipPrev)

  // 底部判定横幅
  const verdictG = svg('g', { class: 'rd2-verdict' })
  const vbW = 264
  const verdictBox = svg('rect', {
    class: 'rd2-verdict__box',
    x: (width - vbW) / 2,
    y: VERDICT_CY - 18,
    width: vbW,
    height: 36,
    rx: 18,
  })
  const verdictText = svg('text', { class: 'rd2-verdict__text', x: width / 2, y: VERDICT_CY })
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

  /** curr 走到 ∅ 时把徽标放到 ∅ 上方。 */
  const chipAnchor = (pathIdx) =>
    pathIdx >= L ? { x: nullX, onNull: true } : { x: slotCenter(slotOfPathIndex(pathIdx)), onNull: false }

  /**
   * 当前帧里"每个 slot 的 next 指向哪个 slot"。
   *
   * 不能简单地用 slot i → slot i+1：摘掉一段之后，`prev.next` 会**跳过**
   * 中间那几个节点直接连到 `curr`。而 prev 落在哪个 path 下标上、curr 在
   * 哪个上，状态机已经算好了 —— 这里直接照着它重建链表结构。
   *
   * 返回 Map<slot, slot>；指向 ∅ 的用 -1 表示。
   *
   * 构造规则（和算法的 `prev.next = curr` 完全对应）：
   *   - dummy 的 next = 第一个未被摘掉的节点（prev 还停在 dummy 时就是 curr）
   *   - 每个未被摘掉、且不是 curr 的存活节点，next = 它右边下一个存活节点
   *   - prev 的 next = curr（这就是那一句 `prev.next = curr`）
   */
  function liveNextOf(step) {
    const removedSet = new Set(step.removed)
    // 存活的 path 下标（升序）
    const alive = []
    for (let k = 0; k < L; k += 1) if (!removedSet.has(k)) alive.push(k)

    const next = new Map()
    const prevPathIdx = step.prev // -1 表示 dummy
    const currPathIdx = step.curr // 可能等于 L（指向 ∅）

    // 先按"跳过被摘节点"的默认规则连好链路
    for (let n = 0; n < alive.length; n += 1) {
      const k = alive[n]
      const nxt = n + 1 < alive.length ? alive[n + 1] : -1
      next.set(slotOfPathIndex(k), nxt === -1 ? -1 : slotOfPathIndex(nxt))
    }
    // dummy 的 next：它右边第一个存活节点
    next.set(DUMMY_SLOT, alive.length ? slotOfPathIndex(alive[0]) : -1)

    // 关键修正：curr 尚未被摘（正在跳过中）时，它左边仍然是 prev（不是物理左邻）
    // prev 的 next 直接指向 curr —— 这正是 `prev.next = curr` 那一句。
    if (prevPathIdx >= -1) {
      const prevSlot = prevPathIdx === -1 ? DUMMY_SLOT : slotOfPathIndex(prevPathIdx)
      const target = currPathIdx >= L ? -1 : slotOfPathIndex(currPathIdx)
      next.set(prevSlot, target)
    }
    // 被摘掉的节点：不再参与任何出边
    for (const k of removedSet) next.set(slotOfPathIndex(k), null)
    return next
  }

  /** 当前帧里最右那个还挂在链上的 slot（用来画指向 ∅ 的尾边）；全空返回 null。 */
  function tailSlotOf(step) {
    const removedSet = new Set(step.removed)
    // 找最后一个存活、且它的 next 是 ∅ 的节点
    const next = liveNextOf(step)
    let best = null
    for (const [from, to] of next) {
      if (to !== -1) continue
      if (from === DUMMY_SLOT) continue
      if (removedSet.has(pathIndexOfSlot(from))) continue
      if (best === null || from > best) best = from
    }
    return best
  }

  function paintArc(step) {
    // 只在"摘链"那一帧亮：从 prev 越过整段重复节点连到 curr
    const show = (step.phase === 'unlink' || step.phase === 'advance') && step.removedNow.length > 0
    arcG.classList.toggle('is-on', show)
    if (!show) return
    const prevSlot = step.prev === -1 ? DUMMY_SLOT : slotOfPathIndex(step.prev)
    const currSlot = step.curr >= L ? null : slotOfPathIndex(step.curr)
    if (currSlot === null) return
    // 从 prev 节点右侧出来，拱过被摘的那一段，落到 curr
    const fromX = slotLeft(prevSlot) + NODE_W
    const toX = slotLeft(currSlot)
    if (toX <= fromX) return
    const lift = 58
    const c1x = fromX + (toX - fromX) * 0.28
    const c2x = fromX + (toX - fromX) * 0.72
    arcLine.setAttribute(
      'd',
      `M ${fromX + 3} ${ROW_CY} C ${c1x} ${ROW_CY - lift}, ${c2x} ${ROW_CY - lift}, ${toX - 9} ${ROW_CY}`,
    )
    arcHead.setAttribute('d', `M ${toX} ${ROW_CY} L ${toX - 9} ${ROW_CY - 5.5} L ${toX - 9} ${ROW_CY + 5.5} Z`)
    const midX = (fromX + toX) / 2
    arcTagBg.setAttribute('x', midX - 66)
    arcTagBg.setAttribute('y', ROW_CY - lift - 9)
    arcTag.setAttribute('x', midX)
    arcTag.setAttribute('y', ROW_CY - lift)
    arcTag.textContent = 'prev.next = curr'
  }

  function paint(_index, step) {
    const removedSet = new Set(step.removed)
    const inDup = (pathIdx) =>
      step.dupStart !== null && step.dupEnd !== null &&
      pathIdx >= step.dupStart && pathIdx < step.dupEnd

    // 节点状态
    for (let s = 0; s < slots; s += 1) {
      if (s === DUMMY_SLOT) {
        nodeGroups[s].classList.toggle('is-prev', step.prev === -1)
        nodeGroups[s].classList.toggle('is-curr', false)
        continue
      }
      const k = pathIndexOfSlot(s)
      nodeGroups[s].classList.toggle('is-cut', removedSet.has(k))
      nodeGroups[s].classList.toggle('is-dup', inDup(k) && !removedSet.has(k))
      nodeGroups[s].classList.toggle('is-prev', step.prev === k)
      nodeGroups[s].classList.toggle('is-curr', step.curr === k)
    }

    // ── 出边：按**真实的 next 结构**画，而不是按 slot 相邻关系 ──────────────
    // 这是本题动画的核心：摘掉一段之后，prev 的 next 直接跳到 curr，
    // 中间那几个节点两边都不再挂边。所以每帧都重新算一遍"谁指向谁"，
    // 并且允许画出"跨过被摘节点"的长边。
    const liveNext = liveNextOf(step)
    let ei = 0
    for (const [from, to] of liveNext) {
      if (to === null) continue // 被摘掉的节点：不出边
      const e = edgeAt(ei)
      ei += 1
      e.g.classList.add('is-on')
      if (to === -1) drawTailEdge(e, from)
      else drawEdge(e, from, to)
    }
    for (let k = ei; k < edgePool.length; k += 1) edgePool[k].g.classList.remove('is-on')

    paintArc(step)

    // 重复段外框
    const showDup = step.dupStart !== null && step.dupEnd !== null && step.dupEnd > step.dupStart
    dupG.classList.toggle('is-on', showDup)
    if (showDup) {
      const s1 = slotOfPathIndex(step.dupStart)
      const s2 = slotOfPathIndex(step.dupEnd - 1)
      dupBox.setAttribute('x', slotLeft(s1) - DUP_FRAME_PAD)
      dupBox.setAttribute('y', ROW_TOP - DUP_FRAME_PAD)
      dupBox.setAttribute(
        'width',
        slotLeft(s2) + NODE_W - slotLeft(s1) + DUP_FRAME_PAD * 2,
      )
      dupBox.setAttribute('height', NODE_H + DUP_FRAME_PAD * 2)
      const midX = (slotLeft(s1) + slotLeft(s2) + NODE_W) / 2
      const run = step.dupEnd - step.dupStart
      dupTag.textContent = `重复段 ${run} 个`
      dupTagBg.setAttribute('x', midX - 50)
      dupTagBg.setAttribute('y', DUP_LABEL_CY - 9)
      dupTag.setAttribute('x', midX)
      dupTag.setAttribute('y', DUP_LABEL_CY)
    }

    // 游标 chip：curr 在上、prev 在下，各自贴着自己那一侧
    const ca = chipAnchor(step.curr)
    const prevSlot = step.prev === -1 ? DUMMY_SLOT : slotOfPathIndex(step.prev)
    const px = slotCenter(prevSlot)
    chipCurr.setAttribute('transform', `translate(${ca.x} ${CHIP_CURR_CY})`)
    chipPrev.setAttribute('transform', `translate(${px} ${CHIP_PREV_CY})`)
    chipCurr.style.opacity = '1'
    chipPrev.style.opacity = '1'
    leadCurr.setAttribute('x1', ca.x)
    leadCurr.setAttribute('x2', ca.x)
    leadCurr.setAttribute('y1', CHIP_CURR_CY + CHIP_H / 2)
    leadCurr.setAttribute('y2', ROW_TOP - 2)
    leadPrev.setAttribute('x1', px)
    leadPrev.setAttribute('x2', px)
    leadPrev.setAttribute('y1', CHIP_PREV_CY - CHIP_H / 2)
    leadPrev.setAttribute('y2', ROW_TOP + NODE_H + 2)

    // 顶部一句话
    if (showDup) {
      const midX = slotCenter(slotOfPathIndex(step.dupEnd - 1))
      noteText.textContent = 'curr 冲进重复段，prev 原地等 —— 错位就是这么来的'
      noteLine.setAttribute('x1', midX)
      noteLine.setAttribute('x2', midX)
      noteLine.setAttribute('y1', NOTE_CY + 11)
      noteLine.setAttribute('y2', DUP_LABEL_CY - 12)
      noteG.style.opacity = '1'
    } else {
      noteG.style.opacity = '0'
    }

    // 判定横幅
    verdictG.setAttribute('class', 'rd2-verdict')
    let vText = '准备开始'
    if (step.phase === 'done') {
      verdictG.classList.add('is-ok')
      const keptText = step.kept.map((k) => pool[path[k]]).join(' → ')
      vText = keptText ? `✓ ${keptText || '空'}` : '✓ 全部被删，返回空链表'
    } else if (step.phase === 'unlink') {
      verdictG.classList.add('is-cut')
      vText = mode === 'keep-one' ? '摘掉多余的，留一个' : '整段摘掉，一个不留'
    } else if (step.phase === 'dup-start') {
      vText = '发现重复段'
    } else if (step.phase === 'skip') {
      vText = 'curr 在重复段里往前冲…'
    } else if (step.phase === 'scan' || step.phase === 'advance') {
      vText = '两个指针一起前进'
    } else if (step.phase === 'init') {
      vText = '架好 dummy 与 prev / curr'
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
      delete host.dataset.rd2Mounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

export default mountRemoveDups2
