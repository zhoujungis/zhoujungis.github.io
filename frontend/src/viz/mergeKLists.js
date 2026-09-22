/**
 * mergeKLists.js — 「合并 K 个升序链表」(LeetCode 23) 小顶堆解法的交互式推演动画。
 *
 * 为什么是 vanilla JS 而不是 .vue 组件：和 linkedListReverse.js / mergeTwoLists.js
 * 完全一样 —— 正文要过三道清洗（Python-Markdown → bleach → DOMPurify），
 * svg/style/script 都不在白名单里，动画只能在客户端现场构建，文章里只留占位符：
 *
 *     <div class="algo-viz algo-viz--lc23"></div>
 *
 * 结构分工：
 *     ./mergeKListsSteps.js   纯状态机，产出每一步快照（有单测）
 *     ./widgetChrome.js       公共外壳：容器 / 说明文字 / 控制条 / svg 小工具
 *     本文件                  只负责把快照画成 SVG
 *
 * 画面是三块：
 *     ┌ 源链表 ────────────────┐   ┌ 堆：只有 K 个候选 ─────┐
 *     │ A → [1][4] → ∅          │   │        (0)  ← 堆顶      │
 *     │ B → [2][5] → ∅          │   │       ╱   ╲            │
 *     │ C → [3][6] → ∅          │   │    (1)     (2)         │
 *     │ D → [0][7] → ∅          │   │   ╱                    │
 *     └────────────────────────┘   │ (3)                    │
 *                                  └────────────────────────┘
 *     结果 → [dummy]→[0]→[1]→ … → ∅                    tail ↑
 *
 * 三个刻意的设计决定：
 *
 * 1. **堆槽的位置只由数组下标决定，不随堆的当前大小重排。** 位置公式用满二叉树的
 *    几何（深度 d 的第 p 个槽，x = (p+0.5)/2^d × 树宽）。所以出堆 / 入堆时，
 *    还在堆里的节点待在原地不动，只有「槽里换了个人」—— 这正是堆数组的视觉对应物。
 *    如果按当前节点数重新排布，每步都会整体抖动，读者什么都看不清。
 *
 * 2. **每条链表当前的头部用本链表主色实线标出**，因为「头部就在堆里」是这道题的
 *    核心不变式 —— 头部高亮的那些节点，就是堆里那 K 个候选。
 *
 * 3. **结果行的槽全部预建、按来源染色**，出现时上浮淡入。颜色直接暴露每个节点
 *    是谁给的，不需要额外图例。
 *
 * 用法：
 *     import { mountMergeKLists } from '@/viz/mergeKLists'
 *     const handle = mountMergeKLists(host, { lists: [[1,4],[2,5],[3,6],[0,7]] })
 *     handle.destroy()
 */

import { buildMergeKListsSteps } from './mergeKListsSteps'
import {
  ensureChromeStyles,
  removeChromeStyles,
  renderRichText,
  createControls,
  createPlayer,
  svgEl as svg,
} from './widgetChrome'

const STYLE_ID = 'mkl-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NODE_W = 52
const NODE_H = 40
const PITCH = 74 // 节点左缘间距 = NODE_W + 间隙 22
const LABEL_W = 58 // 行标签列宽（源链表行与结果行共用，左右对齐）
const RING_R = 15
const NULL_PAD = 26
const CHIP_W = 40
const CHIP_H = 22
const CHIP_DY = 16
const ROW_PITCH = 66
const TOP_TOP = 34
const BAND_GAP = 36

// 堆树：槽位尺寸固定，位置由满二叉树几何决定
const TN_W = 40
const TN_H = 28
const TREE_W = 168
const TREE_PAD_L = 12
const LEVEL_H = 46
const HEAP_CAPTION_H = 22
const HEAP_GAP = 56 // 源链表块与堆面板之间的间距
const HEAP_PANEL_W = TREE_PAD_L + TREE_W

const PLAY_MS = 1250

let instances = 0

/** 每条链表的配色。超过 6 条就循环取用（演示用例是 4 条）。 */
const LIST_COLORS = ['l0', 'l1', 'l2', 'l3', 'l4', 'l5']
const listClass = (li) => `mkl-${LIST_COLORS[li % LIST_COLORS.length]}`

const STYLES = `
/* 只有这块 SVG 的样式是 LC 23 专属的；容器 / 说明 / 控制条在外壳里
   （widgetChrome.js 的 .viz*），三个动画共用。 */
.mkl {
  --mkl-l0: #3f6b57;
  --mkl-l1: #a45f45;
  --mkl-l2: #3f5f8a;
  --mkl-l3: #7a5a9c;
  --mkl-l4: #8a6a2f;
  --mkl-l5: #2f7078;
  --mkl-edge: var(--text-secondary, #657168);
  --mkl-gold: #c89a46;
}
html.theme-dark .mkl {
  --mkl-l0: #8fb29c;
  --mkl-l1: #d18a6f;
  --mkl-l2: #8ab0d8;
  --mkl-l3: #b79ad6;
  --mkl-l4: #d9b063;
  --mkl-l5: #7fc3c8;
  --mkl-gold: #d9b063;
}
.mkl__svg { min-width: 560px; }

/* 每条链表一个色系：--c 是主色，--c-bg 是它的浅色底 */
.mkl-l0 { --c: var(--mkl-l0); --c-bg: rgba(63, 107, 87, 0.16); }
.mkl-l1 { --c: var(--mkl-l1); --c-bg: rgba(164, 95, 69, 0.16); }
.mkl-l2 { --c: var(--mkl-l2); --c-bg: rgba(63, 95, 138, 0.16); }
.mkl-l3 { --c: var(--mkl-l3); --c-bg: rgba(122, 90, 156, 0.16); }
.mkl-l4 { --c: var(--mkl-l4); --c-bg: rgba(138, 106, 47, 0.16); }
.mkl-l5 { --c: var(--mkl-l5); --c-bg: rgba(47, 112, 120, 0.16); }

.mkl-row-label {
  fill: var(--mkl-edge);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: fill 0.26s ease, opacity 0.26s ease;
}
.mkl-row-label.is-live { fill: var(--c); }
.mkl-row-label.is-dead { opacity: 0.42; }

.mkl-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease,
    opacity 0.26s ease;
}
.mkl-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: opacity 0.26s ease;
}
/* 源链表：已取走的节点压暗；当前头部用本链表主色实线标出 */
.mkl-src.is-taken .mkl-node__box { opacity: 0.3; }
.mkl-src.is-taken .mkl-node__value { opacity: 0.4; }
.mkl-src.is-head .mkl-node__box {
  stroke: var(--c);
  stroke-width: 2.6;
  fill: var(--c-bg);
}

.mkl-edge__line { stroke: var(--mkl-edge); stroke-width: 1.8; stroke-linecap: round; }
.mkl-edge__head { fill: var(--mkl-edge); }
.mkl-redge { opacity: 0; transition: opacity 0.3s ease; }
.mkl-redge.is-on { opacity: 1; }

/* 行尾 ∅ */
.mkl-null__ring {
  fill: none;
  stroke: var(--mkl-edge);
  stroke-width: 1.4;
  stroke-dasharray: 4 3;
  transition: stroke 0.26s ease, opacity 0.26s ease;
}
.mkl-null__text {
  fill: var(--mkl-edge);
  font-size: 11px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: fill 0.26s ease, opacity 0.26s ease;
}
/* 整条链表走完：行尾 ∅ 亮成本链表主色（加粗一点，细虚线在缩略尺寸下会糊成灰） */
.mkl-src.is-dead .mkl-null__ring { stroke: var(--c); stroke-width: 2.2; opacity: 1; }
.mkl-src.is-dead .mkl-null__text { fill: var(--c); opacity: 1; }
.mkl-src.is-dead .mkl-edge__line,
.mkl-src.is-dead .mkl-edge__head { opacity: 0.45; }

/* 哑结点：虚线框，明确它不是答案的一部分 */
.mkl-dummy__box {
  fill: none;
  stroke: var(--mkl-edge);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.mkl-dummy__text {
  fill: var(--mkl-edge);
  font-size: 10px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 堆 ───────────────────────────────────────────────────────────────── */
.mkl-heap__caption {
  fill: var(--text-secondary, #657168);
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
}
.mkl-hslot { transition: opacity 0.3s ease; }
.mkl-hslot.is-off { opacity: 0; }
.mkl-hnode__box {
  fill: var(--c-bg, rgba(101, 113, 104, 0.16));
  stroke: var(--c, #657168);
  stroke-width: 1.8;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease;
}
.mkl-hnode__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 本步动过的槽：加粗 + 着色，让「槽里换了个人」看得见 */
.mkl-hslot.is-moved .mkl-hnode__box { stroke-width: 3.6; }
.mkl-hslot.is-moved .mkl-hnode__value { fill: var(--c, #1f2a24); }
/* 堆顶：金边 + 一个「堆顶」小标 */
.mkl-hslot.is-root .mkl-hnode__box { stroke: var(--mkl-gold); stroke-width: 2.8; }
.mkl-heap__root-tag {
  fill: var(--mkl-gold);
  font-size: 10.5px;
  font-weight: 700;
  dominant-baseline: central;
  transition: opacity 0.3s ease;
}
.mkl-heap__root-tag.is-off { opacity: 0; }
.mkl-hedge__line { stroke: var(--mkl-edge); stroke-width: 1.5; stroke-linecap: round; }

/* 结果槽：出现前隐藏并下沉 10px，出现时上浮淡入 */
.mkl-rslot {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.mkl-rslot.is-filled { opacity: 1; transform: translateY(0); }
.mkl-rslot .mkl-node__box { fill: var(--c-bg); stroke: var(--c); }
.mkl-rslot.is-new .mkl-node__box { stroke-width: 2.8; }

.mkl-chip { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.mkl-chip__box { rx: 11; ry: 11; }
.mkl-chip__text {
  font-size: 11px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mkl-chip--tail .mkl-chip__box { fill: var(--mkl-gold); }
.mkl-chip--tail .mkl-chip__text { fill: #2a2113; }

@media (prefers-reduced-motion: reduce) {
  .mkl-chip, .mkl-rslot, .mkl-redge, .mkl-node__box, .mkl-node__value,
  .mkl-hnode__box, .mkl-hslot, .mkl-heap__root-tag, .mkl-null__ring, .mkl-row-label {
    transition: none;
  }
  .mkl-rslot { transform: none; }
}
`

function ensureStyles() {
  ensureChromeStyles() // 容器 / 说明 / 控制条，三个动画共用
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLES
  document.head.appendChild(style)
}

/** 满二叉树里第 i 个槽的位置（相对树内容左上角）。只看下标，不看当前堆大小。 */
function treePos(i) {
  const depth = Math.floor(Math.log2(i + 1))
  const posInLevel = i - (2 ** depth - 1)
  return {
    x: ((posInLevel + 0.5) / 2 ** depth) * TREE_W,
    y: depth * LEVEL_H,
  }
}

/**
 * 挂载动画。
 * @param {HTMLElement} host 占位元素（会被填满）
 * @param {{
 *   lists?: Array<Array<number|string>>,
 *   autoplay?: boolean,    // 滚动到可见时自动播一次；生成封面截图时要关掉
 *   initialStep?: number,  // 从第几步开始（0 = 初始状态）
 * }} [options]
 * @returns {{ destroy: () => void }}
 */
export function mountMergeKLists(host, options = {}) {
  if (!host || host.dataset.mklMounted === '1') {
    return { destroy() {} }
  }
  host.dataset.mklMounted = '1'
  ensureStyles()
  instances += 1

  const lists =
    Array.isArray(options.lists) && options.lists.length
      ? options.lists
      : [
          [1, 4],
          [2, 5],
          [3, 6],
          [0, 7],
        ]
  const autoplay = options.autoplay !== false

  const steps = buildMergeKListsSteps(lists)
  const K = lists.length
  const slots = Math.max(1, K) // 堆槽位数（建满，每步切显隐）
  const maxLen = lists.reduce((m, l) => Math.max(m, l.length), 0)
  const N = lists.reduce((sum, l) => sum + l.length, 0)
  const nR = 1 + N // dummy + 结果节点数

  // 结果行：从 LABEL_W 起排
  const slotLeft = (k) => LABEL_W + k * PITCH
  const slotCenter = (k) => slotLeft(k) + NODE_W / 2
  const rowEndX = (m) => (m <= 0 ? LABEL_W : LABEL_W + (m - 1) * PITCH + NODE_W)
  const nullX = (m) => rowEndX(m) + NULL_PAD

  // ── 整体尺寸 ─────────────────────────────────────────────────────────────
  const srcBlockH = slots * ROW_PITCH - (ROW_PITCH - NODE_H)
  const maxDepth = Math.floor(Math.log2(slots))
  const heapTreeH = maxDepth * LEVEL_H + TN_H
  const heapPanelH = HEAP_CAPTION_H + heapTreeH
  const topBandH = Math.max(srcBlockH, heapPanelH)
  const resultTop = TOP_TOP + topBandH + BAND_GAP
  const height = resultTop + NODE_H + CHIP_DY + 20

  const srcGroupW = nullX(maxLen) + RING_R
  const topGroupW = srcGroupW + HEAP_GAP + HEAP_PANEL_W
  const resultW = nullX(nR) + RING_R + 12
  const width = Math.max(topGroupW + 36, resultW)

  // 顶栏（源链表 + 堆）作为一组水平居中，结果行占满全宽
  const groupX = Math.round((width - topGroupW) / 2)
  const heapX = groupX + srcGroupW + HEAP_GAP
  const treeX = (i) => heapX + TREE_PAD_L + treePos(i).x
  const treeY = (i) => TOP_TOP + Math.max(0, Math.round((topBandH - heapPanelH) / 2)) +
    HEAP_CAPTION_H + treePos(i).y

  // ── 一次性把 SVG 骨架建好，之后只改属性/类名，这样 CSS 过渡才能生效 ──────
  const root = document.createElement('div')
  root.className = 'viz mkl'

  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  root.appendChild(stage)

  const svgRoot = svg('svg', {
    class: 'viz__svg mkl__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': `合并 ${K} 个升序链表的小顶堆推演动画`,
  })
  stage.appendChild(svgRoot)

  function arrow(parent, fromX, toX, cy, className) {
    const g = svg('g', { class: className })
    g.appendChild(
      svg('line', { class: 'mkl-edge__line', x1: fromX, y1: cy, x2: toX - 9, y2: cy }),
    )
    g.appendChild(
      svg('path', {
        class: 'mkl-edge__head',
        d: `M ${toX} ${cy} L ${toX - 9} ${cy - 5.5} L ${toX - 9} ${cy + 5.5} Z`,
      }),
    )
    parent.appendChild(g)
    return g
  }

  function nullMarker(parent, x, cy) {
    parent.appendChild(svg('circle', { class: 'mkl-null__ring', cx: x, cy, r: RING_R }))
    const t = svg('text', { class: 'mkl-null__text', x, y: cy })
    t.textContent = '∅'
    parent.appendChild(t)
  }

  function makeNode(parent, value, left, top, cls) {
    const g = svg('g', { class: `mkl-node ${cls}` })
    g.appendChild(
      svg('rect', {
        class: 'mkl-node__box',
        x: left,
        y: top,
        width: NODE_W,
        height: NODE_H,
        rx: 8,
      }),
    )
    const t = svg('text', {
      class: 'mkl-node__value',
      x: left + NODE_W / 2,
      y: top + NODE_H / 2,
    })
    t.textContent = String(value)
    g.appendChild(t)
    parent.appendChild(g)
    return g
  }

  // ── 源链表（每行一个 <g>，行内节点位置固定不动）──────────────────────────
  const srcRows = lists.map((values, li) => {
    const top = TOP_TOP + li * ROW_PITCH
    const cy = top + NODE_H / 2
    const g = svg('g', { class: `mkl-src ${listClass(li)}` })

    const labelEl = svg('text', { class: 'mkl-row-label', x: groupX + LABEL_W / 2 - 6, y: cy })
    labelEl.textContent = String.fromCharCode(65 + li)
    g.appendChild(labelEl)

    const nodes = values.map((v, i) => makeNode(g, v, groupX + LABEL_W + i * PITCH, top, ''))
    // 静态箭头：源链表的内部连接从不变
    for (let k = 0; k < values.length - 1; k += 1) {
      arrow(
        g,
        groupX + LABEL_W + k * PITCH + NODE_W,
        groupX + LABEL_W + (k + 1) * PITCH,
        cy,
        '',
      )
    }
    if (values.length > 0) {
      arrow(g, groupX + rowEndX(values.length), groupX + nullX(values.length) - RING_R, cy, '')
    }
    nullMarker(g, groupX + nullX(values.length), cy)
    svgRoot.appendChild(g)
    return { g, labelEl, nodes, values }
  })

  // ── 堆面板 ───────────────────────────────────────────────────────────────
  const heapG = svg('g', { class: 'mkl-heap' })
  svgRoot.appendChild(heapG)

  const caption = svg('text', {
    class: 'mkl-heap__caption',
    x: heapX + TREE_PAD_L + TREE_W / 2,
    y: TOP_TOP + Math.max(0, Math.round((topBandH - heapPanelH) / 2)) + HEAP_CAPTION_H / 2,
  })
  heapG.appendChild(caption)

  // 树边：按下标建满（槽位位置固定），每步只切显隐
  const hedgeGroups = []
  for (let i = 1; i < slots; i += 1) {
    const parent = (i - 1) >> 1
    const g = svg('g', { class: 'mkl-hedge' })
    g.appendChild(
      svg('line', {
        class: 'mkl-hedge__line',
        x1: treeX(parent),
        y1: treeY(parent) + TN_H,
        x2: treeX(i),
        y2: treeY(i),
      }),
    )
    heapG.appendChild(g)
    hedgeGroups.push({ g, child: i })
  }

  // 堆槽：位置由下标决定，内容每步重填
  const hSlots = []
  for (let i = 0; i < slots; i += 1) {
    const g = svg('g', { class: 'mkl-hslot is-off' })
    g.appendChild(
      svg('rect', {
        class: 'mkl-hnode__box',
        x: treeX(i) - TN_W / 2,
        y: treeY(i),
        width: TN_W,
        height: TN_H,
        rx: 7,
      }),
    )
    const t = svg('text', {
      class: 'mkl-hnode__value',
      x: treeX(i),
      y: treeY(i) + TN_H / 2,
    })
    g.appendChild(t)
    heapG.appendChild(g)
    hSlots.push({ g, textEl: t })
  }

  const rootTag = svg('text', {
    class: 'mkl-heap__root-tag',
    x: treeX(0) + TN_W / 2 + 24,
    y: treeY(0) + TN_H / 2,
  })
  rootTag.textContent = '堆顶'
  heapG.appendChild(rootTag)

  // ── 结果行 ───────────────────────────────────────────────────────────────
  const resultG = svg('g', { class: 'mkl-result' })
  svgRoot.appendChild(resultG)

  const resultCy = resultTop + NODE_H / 2
  const resultLabel = svg('text', { class: 'mkl-row-label', x: 26, y: resultCy })
  resultLabel.textContent = '结果'
  resultG.appendChild(resultLabel)

  const dummyG = svg('g', { class: 'mkl-dummy' })
  dummyG.appendChild(
    svg('rect', {
      class: 'mkl-dummy__box',
      x: slotLeft(0),
      y: resultTop,
      width: NODE_W,
      height: NODE_H,
      rx: 8,
    }),
  )
  const dummyText = svg('text', { class: 'mkl-dummy__text', x: slotCenter(0), y: resultCy })
  dummyText.textContent = 'dummy'
  dummyG.appendChild(dummyText)
  resultG.appendChild(dummyG)

  // 结果行箭头（跟着节点出现）+ 行尾 ∅
  const rEdges = []
  for (let k = 1; k < nR; k += 1) {
    rEdges.push(arrow(resultG, slotLeft(k - 1) + NODE_W, slotLeft(k), resultCy, 'mkl-redge'))
  }
  nullMarker(resultG, nullX(nR), resultCy)
  const tailEmptyEdge = arrow(resultG, rowEndX(nR), nullX(nR) - RING_R, resultCy, 'mkl-redge')

  // 结果槽：顺序按**最终取用顺序**预建（不是按输入顺序！），出现前隐藏。
  // 最后一步的 taken 就是完整计划 —— 每个槽将来会是谁，从第一步就定下来了。
  const plan = steps[steps.length - 1].taken
  const rSlots = plan.map((t, idx) =>
    makeNode(
      resultG,
      lists[t.list][t.i],
      slotLeft(idx + 1),
      resultTop,
      `mkl-rslot ${listClass(t.list)}`,
    ),
  )

  const tailChip = svg('g', { class: 'mkl-chip mkl-chip--tail' })
  tailChip.appendChild(
    svg('rect', {
      class: 'mkl-chip__box',
      x: -CHIP_W / 2,
      y: -CHIP_H / 2,
      width: CHIP_W,
      height: CHIP_H,
    }),
  )
  const tailText = svg('text', { class: 'mkl-chip__text', x: 0, y: 0 })
  tailText.textContent = 'tail'
  tailChip.appendChild(tailText)
  resultG.appendChild(tailChip)

  // ── 说明文字 + 控制条（外壳见 widgetChrome.js）───────────────────────────
  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')
  root.appendChild(desc)

  const controls = createControls()
  root.appendChild(controls.root)

  host.textContent = ''
  host.appendChild(root)

  let observer = null

  function paint(_index, step) {
    const heapSize = step.heap.length
    const movedSet = new Set(step.moved)

    // 源链表：已取走 / 当前头部 / 整条走完
    srcRows.forEach((row, li) => {
      const cur = step.cursors[li]
      row.g.classList.toggle('is-dead', cur === null)
      row.labelEl.classList.toggle('is-live', cur !== null)
      row.labelEl.classList.toggle('is-dead', cur === null)
      row.nodes.forEach((nodeG, i) => {
        nodeG.classList.toggle('is-taken', cur === null || i < cur)
        nodeG.classList.toggle('is-head', cur === i)
      })
    })

    // 堆：槽位不动，只换内容和显隐
    hSlots.forEach((slot, i) => {
      if (i >= heapSize) {
        slot.g.setAttribute('class', 'mkl-hslot is-off')
        return
      }
      const node = step.heap[i]
      slot.textEl.textContent = String(lists[node.list][node.i])
      slot.g.setAttribute(
        'class',
        `mkl-hslot ${listClass(node.list)}${movedSet.has(i) ? ' is-moved' : ''}` +
          (i === 0 ? ' is-root' : ''),
      )
    })
    hedgeGroups.forEach((edge) => {
      edge.g.style.display = edge.child < heapSize ? '' : 'none'
    })

    caption.textContent =
      heapSize === 0
        ? '堆：空了 —— 全部节点已取出'
        : `堆：只有 ${heapSize} 个候选（每条链表当前的头部）`
    rootTag.classList.toggle('is-off', heapSize === 0)

    // 结果槽：本步「新出现」的加粗
    const newFrom = step.phase === 'take' ? step.taken.length : Number.POSITIVE_INFINITY
    rSlots.forEach((g, idx) => {
      const k = idx + 1
      const filled = k <= step.taken.length
      g.classList.toggle('is-filled', filled)
      g.classList.toggle('is-new', filled && k >= newFrom)
    })

    // 结果行箭头：第 k 条亮 = 第 k 个槽已接上；末尾 ∅ 在 done 时亮
    rEdges.forEach((g, idx) => g.classList.toggle('is-on', idx + 1 <= step.taken.length))
    tailEmptyEdge.classList.toggle('is-on', step.done)

    // tail 指针压在最后一个已接节点下方
    const tailSlot = Math.min(step.taken.length, nR - 1)
    tailChip.style.transform =
      `translate(${slotCenter(tailSlot)}px, ${resultTop + NODE_H + CHIP_DY}px)`

    renderRichText(desc, step.desc)
  }

  const player = createPlayer({
    steps,
    controls,
    intervalMs: PLAY_MS,
    onRender: paint,
  })
  player.jumpTo(Math.trunc(options.initialStep) || 0)

  // 滚动到可见时自动播一次 —— 读者不用先找播放键
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
      delete host.dataset.mklMounted
      instances -= 1
      if (instances <= 0) {
        document.getElementById(STYLE_ID)?.remove()
        removeChromeStyles()
      }
    },
  }
}

export default mountMergeKLists
