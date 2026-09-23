/**
 * levelOrder.js — 「二叉树的层序遍历」(LeetCode 102) 的交互式推演动画。
 *
 * 和系列里其它动画一样是 vanilla JS：正文要过三道清洗（Python-Markdown →
 * bleach → DOMPurify），svg/style/script 都不在白名单里，动画只能在客户端
 * 现场构建，文章里只留占位符：
 *
 *     <div class="algo-viz algo-viz--lc102"></div>
 *
 * 结构分工：
 *     ./levelOrderSteps.js  纯状态机，产出每一步快照（有单测）
 *     ./widgetChrome.js     公共外壳：容器 / 说明文字 / 控制条 / svg 小工具
 *     本文件                只负责把快照画成 SVG
 *
 * ── 画面怎么表达"分层" ────────────────────────────────────────────────────
 *
 * 层序遍历是**树**上的 BFS，可视化要同时讲清两件事，它们在不同的地方：
 *
 * 1. **树本体（静态）**：节点按层铺开、左右孩子的边画出来。这里是"谁是谁的
 *    孩子"，遍历过程中不变。
 *
 * 2. **队列（动态，本题的看点）**：树下面是一条横向的队列条。节点出队、孩子
 *    入队，队列的两端一直在动。**层的边界就落在队列中间** —— 每层开头把
 *    队列长度快照下来，那一段就是这一层。
 *
 * 所以布局是上下两块：上面画树（带游标高亮），下面画队列（带"这一层"的
 * 括号标注）。两块之间用一条高亮连线把"刚出队的节点"和"队首"连起来。
 *
 * 第三个信息是**结果累积**：右侧（或底部）逐层堆出 `[[3],[9,20],[15,7]]`。
 * 这个放在队列条的右端，跟着一层层长出来。
 *
 * ── 关键实现点（都是踩过坑的）─────────────────────────────────────────────
 *
 * - **所有 CSS 变量都带字面量兜底**（`var(--x-y, #fallback)`）。viz-shot.mjs
 *   把 SVG 单独序列化时，声明在 SVG 外层 div 上的变量解析不了，笔画会整条
 *   消失。这是系列里最贵的坑，见 skill 的坑 A。
 *
 * - **树的横向位置要按"满二叉树坐标"算，不能按同层序号排。** 如果同一层
 *   第 k 个节点就放在第 k 列，那 `9`（左孩子）和 `20`（右孩子）会挨在一起，
 *   边的交叉/重叠看不出来。正确做法是让每个节点占据它在满二叉树里的
 *   "槽位"：深度 d 的槽位宽按 2^(maxDepth-d) 递减，节点居中于自己的槽 ——
 *   这样左右关系一眼可见，`15`/`7` 也自然落在 `20` 下面。
 *
 * 用法：
 *     import { mountLevelOrder } from '@/viz/levelOrder'
 *     const handle = mountLevelOrder(host)
 *     handle.destroy()
 */

import { buildLevelOrderSteps, buildTree } from './levelOrderSteps'
import {
  ensureChromeStyles,
  renderRichText,
  createControls,
  createPlayer,
  svgEl as svg,
} from './widgetChrome'

const STYLE_ID = 'lvo-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NODE_R = 22 // 树节点画成圆
const LEVEL_GAP = 84 // 树层与层之间的垂直距离
const TREE_TOP = 66
// 队列条纵向位置由树的高度决定（见 mount 里计算），这里只声明相对偏移
const QUEUE_TOP_GAP = 56 // 树底部到队列条的间距
const QUEUE_W = 54 // 队列格子宽
const QUEUE_H = 40
const QUEUE_GAP = 10
const QUEUE_PAD_LEFT = 110 // 队列/结果内容区的左边界
const LABEL_X = 30 // 左侧 "queue" / "res" 标签的锚点（左对齐）
const PLAY_MS = 1150

// 结果区的纵向偏移依赖队列条底部，在 mount 里按实际行高算（见 RESULT_TOP）

const STYLES = `
.lvo {
  --lvo-node: var(--text-primary, #1f2a24);
  --lvo-edge: var(--text-secondary, #657168);
  --lvo-hot: var(--accent-secondary, #a45f45);
  --lvo-ok: var(--accent, #3f6b57);
  --lvo-queue: var(--accent, #3f6b57);
  --lvo-dim: #9aa39c;
}
html.theme-dark .lvo {
  --lvo-hot: #e0a06a;
  --lvo-ok: #7fc3a4;
  --lvo-queue: #7fc3a4;
  --lvo-dim: #6c766e;
}
.lvo__svg { min-width: 620px; }

/* ── 树 ───────────────────────────────────────────────────────────────── */
.lvo-edge__line { stroke: var(--lvo-edge, #657168); stroke-width: 1.6; fill: none; opacity: 0.75; }
.lvo-node__circle {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease, stroke-width 0.24s ease, fill 0.24s ease;
}
.lvo-node__value {
  fill: var(--lvo-node, #1f2a24);
  font-size: 16px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: fill 0.24s ease;
}
/* 已经出过队（本轮之前的层）*/
.lvo-node.is-done .lvo-node__circle { stroke: var(--lvo-ok, #3f6b57); stroke-width: 1.8; fill: rgba(63, 107, 87, 0.07); }
.lvo-node.is-done .lvo-node__value { fill: var(--lvo-ok, #3f6b57); }
/* 正在被处理的那个节点 */
.lvo-node.is-current .lvo-node__circle {
  stroke: var(--lvo-hot, #a45f45);
  stroke-width: 3;
  fill: rgba(164, 95, 69, 0.13);
}
.lvo-node.is-current .lvo-node__value { fill: var(--lvo-hot, #a45f45); font-weight: 700; }
/* 这一层里还没出队的节点 */
.lvo-node.is-pending .lvo-node__circle { stroke: var(--lvo-queue, #3f6b57); stroke-width: 2.2; }
/* 刚入队的孩子 */
.lvo-node.is-fresh .lvo-node__circle {
  stroke: var(--lvo-queue, #3f6b57);
  stroke-width: 2.6;
  fill: rgba(63, 107, 87, 0.1);
}

/* 层标注（左侧 "第 0 层" 之类）*/
.lvo-layer__text {
  fill: var(--text-secondary, #657168);
  font-size: 12px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-layer__line { stroke: var(--glass-border, #dce2da); stroke-width: 1; stroke-dasharray: 3 4; opacity: 0.8; }
.lvo-layer__text.is-active { fill: var(--lvo-hot, #a45f45); }
.lvo-layer__line.is-active { stroke: var(--lvo-hot, #a45f45); stroke-dasharray: none; opacity: 1; }

/* ── 队列 ─────────────────────────────────────────────────────────────── */
.lvo-q__label {
  fill: var(--text-secondary, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-q__cell {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease, fill 0.24s ease, opacity 0.24s ease;
}
.lvo-q__value {
  fill: var(--lvo-node, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 属于"当前这一层"的格子 */
.lvo-q__cell.is-layer { stroke: var(--lvo-hot, #a45f45); stroke-width: 2.2; }
.lvo-q__value.is-layer { fill: var(--lvo-hot, #a45f45); }
/* 这一层里已经出过队的（画成淡出）*/
.lvo-q__cell.is-out { stroke: var(--lvo-dim, #9aa39c); opacity: 0.34; stroke-dasharray: 4 3; }
.lvo-q__value.is-out { fill: var(--lvo-dim, #9aa39c); opacity: 0.34; }
/* 刚入队的 */
.lvo-q__cell.is-fresh { stroke: var(--lvo-queue, #3f6b57); stroke-width: 2.4; fill: rgba(63, 107, 87, 0.1); }

/* 队首标记 */
.lvo-q__head {
  fill: var(--lvo-hot, #a45f45);
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-q__headline { stroke: var(--lvo-hot, #a45f45); stroke-width: 1.4; }

/* "这一层 size = n" 的括号标注 */
.lvo-brace__line { stroke: var(--lvo-hot, #a45f45); stroke-width: 1.8; fill: none; }
.lvo-brace__text {
  fill: var(--lvo-hot, #a45f45);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-brace { opacity: 0; transition: opacity 0.24s ease; }
.lvo-brace.is-on { opacity: 1; }

/* ── 结果累积 ─────────────────────────────────────────────────────────── */
.lvo-res__title {
  fill: var(--text-secondary, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-res__text {
  fill: var(--lvo-node, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lvo-res__text.is-active { fill: var(--lvo-hot, #a45f45); }
.lvo-res__text.is-done { fill: var(--lvo-ok, #3f6b57); }

/* 空树提示 */
.lvo-empty__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}

@media (prefers-reduced-motion: reduce) {
  .lvo-node__circle, .lvo-q__cell, .lvo-brace { transition: none; }
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
 *   values?: (number|null)[],
 *   mode?: 'plain' | 'zigzag',
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 * @returns {{ destroy: () => void }}
 */
export function mountLevelOrder(host, options = {}) {
  if (!host || host.dataset.lvoMounted === '1') {
    return { destroy() {} }
  }
  host.dataset.lvoMounted = '1'
  ensureStyles()

  const steps = buildLevelOrderSteps(options)
  const autoplay = options.autoplay !== false

  // 结构从状态机的默认值反推（状态机已经把 values 归一化了）
  const values = Array.isArray(options.values)
    ? options.values
    : [3, 9, 20, null, null, 15, 7]
  const { nodes, root } = buildTree(values)
  const valueOf = (id) => nodes[id].value
  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0)

  // ── 树布局 ───────────────────────────────────────────────────────────────
  // 「满二叉树槽位」坐标：深度 d 的层有 2^d 个槽位，节点居中于自己的槽。
  // 这样左右孩子会自然分列父节点两侧，`15`/`7` 也落在 `20` 的正下方。
  // 槽位总宽由最深的那层决定（2^maxDepth 个），再按叶子层宽度定缩放。
  const LEAF_STEP = 56 // 最深一层相邻槽位的间距
  // 每个节点在"满二叉树"里的路径（根 → 它的左右序列）。用这一步中转，
  // 就能把路径当二进制数读出列号 —— 比从 parent 边算边乘清楚得多。
  const pathOf = new Map()
  pathOf.set(root, [])
  for (const node of nodes) {
    if (node.parent === -1) continue
    pathOf.set(node.id, [...(pathOf.get(node.parent) ?? []), node.side])
  }
  /**
   * 深度 d 的槽位宽。深度 d 那层有 2^d 个槽，最深一层（2^maxDepth 个）取
   * LEAF_STEP，往上一层槽位翻倍 —— 这样各层左端对齐、总宽一致，
   * 同一列上的父子自然上下对齐。
   */
  const slotUnit = (d) => LEAF_STEP * 2 ** Math.max(0, maxDepth - d)
  /**
   * 节点横向位置：path 当二进制数读出列号 col，深度 d 的槽心 = (col + 0.5) * unit。
   * 这样左右孩子自然分列父节点两侧，`15`/`7` 也落在 `20` 的正下方。
   */
  const treeX = (node) => {
    let col = 0
    for (const side of pathOf.get(node.id) ?? []) col = col * 2 + (side === 'R' ? 1 : 0)
    return (col + 0.5) * slotUnit(node.depth)
  }
  // 总宽 = 最深一层（2^maxDepth 个槽）× 叶子层的槽宽。
  // 各层左端对齐、总宽相同，所以用哪一层算都一样。
  const treeWidth = 2 ** maxDepth * LEAF_STEP
  const LABEL_W = 96 // 左侧留给"queue" / "res" / "第 n 层"标签
  const PAD = 40

  const width = Math.max(620, LABEL_W + treeWidth + PAD * 2)
  // 树在画布里居中（窄树的画布下限是 620，直接左对齐会显得偏在一角）
  const TREE_LEFT = (width - treeWidth) / 2

  // 纵向是"树 → 队列条 → 结果区"三段，逐段推下去，别写死 ——
  // 树的深度一变（比如换成一棵五层的树），写死的坐标就会压在一起。
  const treeBottom = TREE_TOP + maxDepth * LEVEL_GAP + NODE_R
  const QUEUE_Y = treeBottom + QUEUE_TOP_GAP

  // 队列条要摆下两行附属标注，行高必须显式记账，否则 head 和括号会叠字：
  //   格子下沿 (QUEUE_Y + 20) → head 竖线 34 → head 基线 48 → 括号横线 68 → 括号文字基线 81
  const QUEUE_HALF = QUEUE_H / 2
  const HEAD_LINE_TOP = QUEUE_HALF + 14 // 34
  const HEAD_LINE_BOTTOM = QUEUE_HALF + 22 // 42
  const HEAD_TEXT_DY = QUEUE_HALF + 28 // 48（基线）
  const BRACE_Y_DY = QUEUE_HALF + 48 // 68
  const BRACE_TEXT_DY = QUEUE_HALF + 61 // 81（基线）
  const QUEUE_BLOCK_BOTTOM = QUEUE_Y + BRACE_TEXT_DY

  const RESULT_GAP = 34 // 队列括号底 → 结果区首行基线
  const RESULT_TOP = QUEUE_BLOCK_BOTTOM + RESULT_GAP
  const RESULT_LINE_H = 22
  const height = RESULT_TOP + Math.max(1, maxDepth + 1) * RESULT_LINE_H + 18

  const posOf = (id) => {
    const node = nodes[id]
    return {
      x: TREE_LEFT + treeX(node),
      y: TREE_TOP + node.depth * LEVEL_GAP,
    }
  }
  const rowCy = (depth) => TREE_TOP + depth * LEVEL_GAP

  // ── 队列条布局 ───────────────────────────────────────────────────────────
  // 队列最长能有多长？最坏情况是"最宽的一层 + 它的孩子"，直接算一个上界。
  const maxQueue = Math.max(
    1,
    ...steps.map((s) => s.queue.length),
    ...steps.map((s) => s.queue.length + s.enqueued.length),
  )
  const qCellX = (i) => QUEUE_PAD_LEFT + i * (QUEUE_W + QUEUE_GAP)

  // ── SVG 骨架 ─────────────────────────────────────────────────────────────
  const rootEl = document.createElement('div')
  rootEl.className = 'viz lvo'

  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const svgRoot = svg('svg', {
    class: 'viz__svg lvo__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '层序遍历推演动画',
  })
  stage.appendChild(svgRoot)

  // 空树：只留一行提示
  if (root === -1) {
    const t = svg('text', {
      class: 'lvo-empty__text',
      x: width / 2,
      y: height / 2,
    })
    t.textContent = '空树 —— 直接返回 []'
    svgRoot.appendChild(t)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    return { destroy() { host.textContent = ''; delete host.dataset.lvoMounted; document.getElementById(STYLE_ID)?.remove() } }
  }

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  // 层标注（左侧）
  const layerLabels = []
  for (let d = 0; d <= maxDepth; d += 1) {
    const y = rowCy(d)
    const line = svg('line', {
      class: 'lvo-layer__line',
      x1: 62,
      y1: y,
      x2: TREE_LEFT + treeWidth + 14,
      y2: y,
    })
    const t = svg('text', { class: 'lvo-layer__text', x: 56, y })
    t.textContent = `第 ${d} 层`
    svgRoot.append(line, t)
    layerLabels.push({ line, t })
  }

  // 树的边（静态，画在节点下面）
  const edgeG = svg('g', { class: 'lvo-edges' })
  svgRoot.appendChild(edgeG)
  for (const node of nodes) {
    for (const childId of [node.left, node.right]) {
      if (childId === null || childId === undefined) continue
      const p1 = posOf(node.id)
      const p2 = posOf(childId)
      const line = svg('line', {
        class: 'lvo-edge__line',
        x1: p1.x,
        y1: p1.y + NODE_R,
        x2: p2.x,
        y2: p2.y - NODE_R,
      })
      edgeG.appendChild(line)
    }
  }

  // 树的节点
  const nodeGs = new Map()
  for (const node of nodes) {
    const p = posOf(node.id)
    const g = svg('g', { class: 'lvo-node' })
    g.setAttribute('transform', `translate(${p.x} ${p.y})`)
    g.appendChild(svg('circle', { class: 'lvo-node__circle', cx: 0, cy: 0, r: NODE_R }))
    const t = svg('text', { class: 'lvo-node__value', x: 0, y: 0 })
    t.textContent = String(node.value)
    g.appendChild(t)
    svgRoot.appendChild(g)
    nodeGs.set(node.id, g)
  }

  // ── 队列条 ───────────────────────────────────────────────────────────────
  // 标签基线对齐格子垂直中心，读起来才像"这一行的注解"
  const qLabel = svg('text', { class: 'lvo-q__label', x: LABEL_X, y: QUEUE_Y + 5 })
  qLabel.textContent = 'queue'
  svgRoot.appendChild(qLabel)

  // 队列格子池：按 maxQueue 预建，多的隐藏
  const qCells = []
  for (let i = 0; i < maxQueue; i += 1) {
    const g = svg('g', { class: 'lvo-q__cell-g' })
    g.setAttribute('transform', `translate(${qCellX(i)} ${QUEUE_Y - QUEUE_H / 2})`)
    const rect = svg('rect', {
      class: 'lvo-q__cell',
      x: 0,
      y: 0,
      width: QUEUE_W,
      height: QUEUE_H,
      rx: 8,
    })
    const t = svg('text', { class: 'lvo-q__value', x: QUEUE_W / 2, y: QUEUE_H / 2 })
    g.append(rect, t)
    svgRoot.appendChild(g)
    qCells.push({ g, rect, t })
  }

  // 队首标记（一条小竖线 + "head" 字样）
  const headLine = svg('line', { class: 'lvo-q__headline' })
  const headText = svg('text', { class: 'lvo-q__head' })
  headText.textContent = 'head'
  svgRoot.append(headLine, headText)

  // "这一层 size = n" 的括号标注（队列下方）
  const braceG = svg('g', { class: 'lvo-brace' })
  const bracePath = svg('path', { class: 'lvo-brace__line' })
  const braceText = svg('text', { class: 'lvo-brace__text' })
  braceG.append(bracePath, braceText)
  svgRoot.appendChild(braceG)

  // ── 结果累积条 ───────────────────────────────────────────────────────────
  const resTitle = svg('text', { class: 'lvo-res__title', x: LABEL_X, y: RESULT_TOP })
  resTitle.textContent = 'res'
  svgRoot.appendChild(resTitle)

  /** 结果文本按"每层一行"堆；层数不多，直接预建。 */
  const resLines = []
  for (let d = 0; d < Math.max(1, maxDepth + 1); d += 1) {
    const t = svg('text', {
      class: 'lvo-res__text',
      x: QUEUE_PAD_LEFT,
      y: RESULT_TOP + d * RESULT_LINE_H,
    })
    svgRoot.appendChild(t)
    resLines.push(t)
  }

  // 说明文字 + 控制条
  const desc = descEl()
  rootEl.appendChild(desc)
  const controls = createControls()
  rootEl.appendChild(controls.root)

  host.textContent = ''
  host.appendChild(rootEl)

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  function paint(_index, step) {
    const inQueue = new Set(step.queue)
    const freshSet = new Set(step.enqueued)
    // 这一层里"还没出队"的格子数：状态机给了 size 和 consumed，
    // 队列前 (levelSize - consumed) 个就是还没轮到的。
    const remainingInLayer = Math.max(0, step.levelSize - step.consumed)

    // 节点状态
    for (const [id, g] of nodeGs) {
      const node = nodes[id]
      const isCurrent = step.current === id
      const isFresh = freshSet.has(id)
      // 处理完的层（深度小于当前层）统一样式
      const isDone = step.levelIndex >= 0 && node.depth < step.levelIndex && !isCurrent
      // 这一层还没出队、也不是刚入队的节点
      const isPending =
        step.levelIndex >= 0 &&
        node.depth === step.levelIndex &&
        inQueue.has(id) &&
        !isFresh &&
        !isCurrent

      g.classList.toggle('is-done', isDone)
      g.classList.toggle('is-current', isCurrent)
      g.classList.toggle('is-pending', isPending)
      g.classList.toggle('is-fresh', isFresh)
    }

    // 层标注高亮
    layerLabels.forEach(({ line, t }, d) => {
      const active = d === step.levelIndex
      line.classList.toggle('is-active', active)
      t.classList.toggle('is-active', active)
    })

    // 队列格子
    qCells.forEach((cell, i) => {
      const id = step.queue[i]
      if (id === undefined) {
        cell.g.style.opacity = '0'
        return
      }
      cell.g.style.opacity = '1'
      cell.t.textContent = String(valueOf(id))

      const isFresh = freshSet.has(id)
      const inLayer = step.levelIndex >= 0 && step.phase !== 'init'
      // 前 remainingInLayer 个是"这一层还没出队"的，再往右就出过队了
      const isOut = inLayer && !isFresh && i >= remainingInLayer

      cell.rect.setAttribute(
        'class',
        `lvo-q__cell${isFresh ? ' is-fresh' : inLayer ? ' is-layer' : ''}${isOut ? ' is-out' : ''}`,
      )
      cell.t.setAttribute(
        'class',
        `lvo-q__value${isFresh || inLayer ? ' is-layer' : ''}${isOut ? ' is-out' : ''}`,
      )
    })

    // 队首标记（竖线 + "head"，占第 1 行）
    if (step.queue.length) {
      const x = qCellX(0) + QUEUE_W / 2
      headLine.setAttribute('x1', x)
      headLine.setAttribute('x2', x)
      headLine.setAttribute('y1', QUEUE_Y + HEAD_LINE_TOP)
      headLine.setAttribute('y2', QUEUE_Y + HEAD_LINE_BOTTOM)
      headText.setAttribute('x', x)
      headText.setAttribute('y', QUEUE_Y + HEAD_TEXT_DY)
      headLine.style.opacity = '1'
      headText.style.opacity = '1'
    } else {
      headLine.style.opacity = '0'
      headText.style.opacity = '0'
    }

    // "这一层 size = n" 括号：框住队列前 levelSize 个格子（占第 2 行）
    if (step.levelIndex >= 0 && step.levelSize > 0 && step.phase !== 'init') {
      const x1 = qCellX(0) - 5
      const x2 = qCellX(step.levelSize - 1) + QUEUE_W + 5
      const yb = QUEUE_Y + BRACE_Y_DY
      bracePath.setAttribute(
        'd',
        `M ${x1} ${yb - 7} L ${x1} ${yb} L ${x2} ${yb} L ${x2} ${yb - 7}`,
      )
      braceText.setAttribute('x', (x1 + x2) / 2)
      braceText.setAttribute('y', QUEUE_Y + BRACE_TEXT_DY)
      braceText.textContent = `这一层 size = ${step.levelSize}`
      braceG.classList.add('is-on')
    } else {
      braceG.classList.remove('is-on')
    }

    // 结果累积
    resLines.forEach((t, d) => {
      const lv = step.results[d]
      if (!lv) {
        t.textContent = ''
        t.setAttribute('class', 'lvo-res__text')
        return
      }
      t.textContent = `[${lv.join(', ')}]`
      const isClosing = d === step.levelIndex && step.phase === 'close'
      t.setAttribute('class', `lvo-res__text${isClosing ? ' is-done' : ' is-active'}`)
    })

    renderRichText(desc, step.desc)
  }

  const player = createPlayer({
    steps,
    controls,
    intervalMs: PLAY_MS,
    onRender: paint,
  })
  player.jumpTo(Math.trunc(options.initialStep) || 0)

  let observer = null
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
    observer.observe(rootEl)
  }

  return {
    destroy() {
      if (observer) {
        observer.disconnect()
        observer = null
      }
      player.destroy()
      host.textContent = ''
      delete host.dataset.lvoMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

export default mountLevelOrder
