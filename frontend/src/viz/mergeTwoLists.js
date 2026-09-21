/**
 * mergeTwoLists.js — 「合并两个有序链表」(LeetCode 21) 的交互式推演动画。
 *
 * 为什么是 vanilla JS 而不是 .vue 组件：和 linkedListReverse.js 完全一样 ——
 * 正文要过三道清洗（Python-Markdown → bleach → DOMPurify），svg/style/script
 * 都不在白名单里，动画只能在客户端现场构建，文章里只留占位符：
 *
 *     <div class="algo-viz algo-viz--lc21"></div>
 *
 * 结构分工：
 *     ./mergeSteps.js      纯状态机，产出每一步快照（有单测）
 *     ./widgetChrome.js    公共外壳：容器 / 说明文字 / 控制条 / svg 小工具
 *     本文件               只负责把快照画成 SVG
 *
 * 画面是三行：
 *     p1 →  [A 链表]                     指针 chip 压在各自行的上缘
 *     p2 →  [B 链表]
 *           [dummy][结果链表…]  ← tail   结果行带哑结点，tail 指向尾节点
 *
 * compare 步：两个候选节点高亮 + 中间一个 vs 徽章，赢的那一边实线加粗；
 * take 步：被取走的节点在源行变淡，同时结果行末尾"弹出"一个新节点，
 * 按来源染色（绿 = 来自 A，橙 = 来自 B），一眼能看出每个节点是谁给的。
 *
 * 用法：
 *     import { mountMergeTwoLists } from '@/viz/mergeTwoLists'
 *     const handle = mountMergeTwoLists(host, { listA: [1, 2, 4], listB: [1, 3, 4] })
 *     handle.destroy()
 */

import { buildMergeSteps } from './mergeSteps'
import {
  ensureChromeStyles,
  removeChromeStyles,
  renderRichText,
  createControls,
  createPlayer,
  svgEl as svg,
} from './widgetChrome'

const STYLE_ID = 'mtl-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NODE_W = 60
const NODE_H = 44
const PITCH = 94 // 节点左缘间距 = NODE_W + 间隙 34
const PAD_L = 84 // 左侧留给行标签（A / B / 结果）
const ROW_A_TOP = 40
const ROW_B_TOP = 130
const ROW_R_TOP = 218
const VS_CY = (ROW_A_TOP + NODE_H + ROW_B_TOP) / 2 // 两行正中间，107
const CHIP_W = 38
const CHIP_H = 24
const CHIP_DY = 17 // chip 中心到所在行边缘的距离
const NULL_PAD = 26 // 行尾 ∅ 与最后一个节点右缘的间距
const RING_R = 15
const HEIGHT = 302

const PLAY_MS = 1150

let instances = 0

const STYLES = `
/* 只有这块 SVG 的样式是 LC 21 专属的；容器 / 说明 / 控制条在外壳里
   （widgetChrome.js 的 .viz*），两个动画共用。 */
.mtl {
  --mtl-a: var(--accent, #3f6b57);
  --mtl-b: var(--accent-secondary, #a45f45);
  --mtl-edge: var(--text-secondary, #657168);
  --mtl-gold: #c89a46;
}
html.theme-dark .mtl {
  --mtl-gold: #d9b063;
}
.mtl__svg { min-width: 520px; }
.mtl-row-label {
  fill: var(--text-secondary, #657168);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
}
.mtl-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease;
}
.mtl-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 17px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  transition: opacity 0.26s ease;
}
/* compare：两个候选节点虚线高亮，赢的一边实线加粗 */
.mtl-node--a.is-cand .mtl-node__box { stroke: var(--mtl-a); stroke-dasharray: 5 3; stroke-width: 2; }
.mtl-node--b.is-cand .mtl-node__box { stroke: var(--mtl-b); stroke-dasharray: 5 3; stroke-width: 2; }
.mtl-node.is-win .mtl-node__box { stroke-width: 3; stroke-dasharray: none; }
/* take：节点被摘走 —— 按来源染色变淡 */
.mtl-node--a.is-taken .mtl-node__box { fill: rgba(63, 107, 87, 0.16); stroke: var(--mtl-a); }
.mtl-node--b.is-taken .mtl-node__box { fill: rgba(164, 95, 69, 0.16); stroke: var(--mtl-b); }
.mtl-node.is-taken .mtl-node__value { opacity: 0.55; }
/* append-rest：剩余段在源行里整体高亮（虚线绿 = 即将并入结果） */
.mtl-node.is-rest .mtl-node__box { stroke: var(--mtl-a); stroke-width: 2.5; stroke-dasharray: 6 3; }
.mtl-edge__line {
  stroke: var(--mtl-edge);
  stroke-width: 1.8;
  stroke-linecap: round;
}
.mtl-edge__head { fill: var(--mtl-edge); }
/* 结果行的箭头跟着节点出现 */
.mtl-redge { opacity: 0; transition: opacity 0.3s ease; }
.mtl-redge.is-on { opacity: 1; }
/* 哑结点：虚线框，明确它不是答案的一部分 */
.mtl-dummy__box {
  fill: none;
  stroke: var(--mtl-edge, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.mtl-dummy__text {
  fill: var(--mtl-edge, #657168);
  font-size: 11px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 结果槽：出现前隐藏并下沉 10px，出现时上浮淡入 */
.mtl-rslot {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.mtl-rslot.is-filled { opacity: 1; transform: translateY(0); }
.mtl-rslot--from-a .mtl-node__box { fill: rgba(63, 107, 87, 0.16); stroke: var(--mtl-a); }
.mtl-rslot--from-b .mtl-node__box { fill: rgba(164, 95, 69, 0.16); stroke: var(--mtl-b); }
/* vs 徽章：位置也带过渡，从上一组候选滑到下一组 */
.mtl-vs {
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.3s ease;
}
.mtl-vs.is-on { opacity: 1; }
.mtl-vs__ring { fill: var(--surface, #fff); stroke: var(--mtl-b); stroke-width: 1.5; }
.mtl-vs__text {
  fill: var(--mtl-b);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mtl-chip { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.mtl-chip__box { rx: 12; ry: 12; }
.mtl-chip__text {
  font-size: 11.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mtl-chip--p1 .mtl-chip__box { fill: var(--mtl-a); }
.mtl-chip--p1 .mtl-chip__text { fill: #fff; }
.mtl-chip--p2 .mtl-chip__box { fill: var(--mtl-b); }
.mtl-chip--p2 .mtl-chip__text { fill: #fff; }
.mtl-chip--tail .mtl-chip__box { fill: var(--mtl-gold); }
.mtl-chip--tail .mtl-chip__text { fill: #2a2113; }
@media (prefers-reduced-motion: reduce) {
  .mtl-chip, .mtl-vs, .mtl-rslot, .mtl-redge, .mtl-node__box, .mtl-node__value { transition: none; }
  .mtl-rslot { transform: none; }
}
`

function ensureStyles() {
  ensureChromeStyles() // 容器 / 说明 / 控制条，和别的动画共用
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
 *   listA?: Array<number|string>,
 *   listB?: Array<number|string>,
 *   autoplay?: boolean,    // 滚动到可见时自动播一次；生成封面截图时要关掉
 *   initialStep?: number,  // 从第几步开始（0 = 初始状态）
 * }} [options]
 * @returns {{ destroy: () => void }}
 */
export function mountMergeTwoLists(host, options = {}) {
  if (!host || host.dataset.mtlMounted === '1') {
    return { destroy() {} }
  }
  host.dataset.mtlMounted = '1'
  ensureStyles()
  instances += 1

  const A = Array.isArray(options.listA) && options.listA.length ? options.listA : [1, 2, 4]
  const B = Array.isArray(options.listB) && options.listB.length ? options.listB : [1, 3, 4]
  const autoplay = options.autoplay !== false

  const steps = buildMergeSteps(A, B)

  // 结果行的完整"计划"：最终一步的 taken 就是全部节点及其来源。
  // 空链表边界情况下 plan 为空 —— 结果行只有 dummy，正好和说明文字对得上。
  const plan = steps[steps.length - 1].taken
  const valueOf = (t) => (t.list === 'a' ? A[t.i] : B[t.i])
  const nR = 1 + plan.length // dummy + 结果节点数

  const slotLeft = (k) => PAD_L + k * PITCH
  const slotCenter = (k) => slotLeft(k) + NODE_W / 2
  const rowEndX = (m) => (m <= 0 ? PAD_L : PAD_L + (m - 1) * PITCH + NODE_W)
  const nullX = (m) => (m <= 0 ? PAD_L : rowEndX(m) + NULL_PAD)

  const width =
    Math.max(rowEndX(A.length), rowEndX(B.length), rowEndX(nR)) + NULL_PAD + RING_R + 12

  // ── 一次性把 SVG 骨架建好，之后只改属性/类名，这样 CSS 过渡才能生效 ──────
  const root = document.createElement('div')
  root.className = 'viz mtl'

  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  root.appendChild(stage)

  const svgRoot = svg('svg', {
    class: 'viz__svg mtl__svg',
    viewBox: `0 0 ${width} ${HEIGHT}`,
    role: 'img',
    'aria-label': `合并两个有序链表推演动画：${A.join('、')} 与 ${B.join('、')}`,
  })
  stage.appendChild(svgRoot)

  // 行标签
  for (const [text, cy] of [
    ['A', ROW_A_TOP + NODE_H / 2],
    ['B', ROW_B_TOP + NODE_H / 2],
    ['结果', ROW_R_TOP + NODE_H / 2],
  ]) {
    const t = svg('text', { class: 'mtl-row-label', x: 30, y: cy })
    t.textContent = text
    svgRoot.appendChild(t)
  }

  // ∅ 标记（三行行尾 + 结果行）
  function nullMarker(x, cy) {
    svgRoot.appendChild(svg('circle', { class: 'mtl-dummy__box', cx: x, cy, r: RING_R }))
    const t = svg('text', { class: 'mtl-dummy__text', x, y: cy })
    t.textContent = '∅'
    svgRoot.appendChild(t)
  }

  /** 一条向右的箭头（直线 + 三角头），返回 g 以便后续按类名切换显隐 */
  function arrow(fromX, toX, cy, className) {
    const g = svg('g', { class: className })
    g.appendChild(
      svg('line', { class: 'mtl-edge__line', x1: fromX, y1: cy, x2: toX - 9, y2: cy }),
    )
    g.appendChild(
      svg('path', {
        class: 'mtl-edge__head',
        d: `M ${toX} ${cy} L ${toX - 9} ${cy - 5.5} L ${toX - 9} ${cy + 5.5} Z`,
      }),
    )
    svgRoot.appendChild(g)
    return g
  }

  // 源链表的箭头是静态的（动画不改原链表的内部连接），一次画好
  function sourceRow(m, top) {
    const cy = top + NODE_H / 2
    for (let k = 0; k < m - 1; k += 1) {
      arrow(slotLeft(k) + NODE_W, slotLeft(k + 1), cy, 'mtl-edge')
    }
    nullMarker(nullX(m), cy)
    if (m > 0) {
      arrow(rowEndX(m), nullX(m) - RING_R, cy, 'mtl-edge')
    }
  }
  sourceRow(A.length, ROW_A_TOP)
  sourceRow(B.length, ROW_B_TOP)

  // 结果行的箭头（跟着节点出现）+ 行尾 ∅
  const rEdges = []
  for (let k = 1; k < nR; k += 1) {
    rEdges.push(arrow(slotLeft(k - 1) + NODE_W, slotLeft(k), ROW_R_TOP + NODE_H / 2, 'mtl-edge mtl-redge'))
  }
  nullMarker(nullX(nR), ROW_R_TOP + NODE_H / 2)
  const tailEmptyEdge = arrow(
    rowEndX(nR),
    nullX(nR) - RING_R,
    ROW_R_TOP + NODE_H / 2,
    'mtl-edge mtl-redge',
  )

  // 节点：源两行 + 结果行（结果行预建、隐藏）
  function makeNode(value, k, top, boxClass) {
    const g = svg('g', { class: `mtl-node ${boxClass}` })
    g.appendChild(
      svg('rect', {
        class: 'mtl-node__box',
        x: slotLeft(k),
        y: top,
        width: NODE_W,
        height: NODE_H,
        rx: 9,
      }),
    )
    const t = svg('text', { class: 'mtl-node__value', x: slotCenter(k), y: top + NODE_H / 2 })
    t.textContent = String(value)
    g.appendChild(t)
    svgRoot.appendChild(g)
    return g
  }

  const aNodes = A.map((v, i) => makeNode(v, i, ROW_A_TOP, 'mtl-node--a'))
  const bNodes = B.map((v, i) => makeNode(v, i, ROW_B_TOP, 'mtl-node--b'))

  // 哑结点（结果行 slot 0）
  const dummy = svg('g', { class: 'mtl-dummy' })
  dummy.appendChild(
    svg('rect', {
      class: 'mtl-dummy__box',
      x: slotLeft(0),
      y: ROW_R_TOP,
      width: NODE_W,
      height: NODE_H,
      rx: 9,
    }),
  )
  const dummyText = svg('text', { class: 'mtl-dummy__text', x: slotCenter(0), y: ROW_R_TOP + NODE_H / 2 })
  dummyText.textContent = 'dummy'
  dummy.appendChild(dummyText)
  svgRoot.appendChild(dummy)

  const rSlots = plan.map((t, idx) =>
    makeNode(valueOf(t), idx + 1, ROW_R_TOP, `mtl-rslot mtl-rslot--from-${t.list}`),
  )

  // vs 徽章（compare 步才出现）
  const vsGroup = svg('g', { class: 'mtl-vs' })
  vsGroup.appendChild(svg('circle', { class: 'mtl-vs__ring', cx: 0, cy: 0, r: 13 }))
  const vsText = svg('text', { class: 'mtl-vs__text', x: 0, y: 0 })
  vsText.textContent = 'vs'
  vsGroup.appendChild(vsText)
  svgRoot.appendChild(vsGroup)

  // 指针 chip：p1 / p2 压在各自行的上缘，tail 在结果行下缘
  function makeChip(kind, label) {
    const g = svg('g', { class: `mtl-chip mtl-chip--${kind}` })
    g.appendChild(
      svg('rect', {
        class: 'mtl-chip__box',
        x: -CHIP_W / 2,
        y: -CHIP_H / 2,
        width: CHIP_W,
        height: CHIP_H,
      }),
    )
    const t = svg('text', { class: 'mtl-chip__text', x: 0, y: 0 })
    t.textContent = label
    g.appendChild(t)
    svgRoot.appendChild(g)
    return g
  }
  const chipP1 = makeChip('p1', 'p1')
  const chipP2 = makeChip('p2', 'p2')
  const chipTail = makeChip('tail', 'tail')

  // 说明文字 + 控制条（外壳见 widgetChrome.js）
  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')
  root.appendChild(desc)

  const controls = createControls()
  root.appendChild(controls.root)

  host.textContent = ''
  host.appendChild(root)

  let observer = null

  function setChip(chip, x, y) {
    chip.style.transform = `translate(${x}px, ${y}px)`
  }

  function paint(_index, step) {
    const takenKeys = new Set(step.taken.map((t) => `${t.list}:${t.i}`))

    // 源节点状态：被取走 / 参与比较 / 本轮胜出 / 剩余段
    aNodes.forEach((g, i) => {
      g.classList.toggle('is-taken', takenKeys.has(`a:${i}`))
      g.classList.toggle('is-cand', step.phase === 'compare' && step.p1 === i)
      g.classList.toggle(
        'is-win',
        step.phase === 'compare' && step.cursor === 'a' && step.p1 === i,
      )
      g.classList.toggle(
        'is-rest',
        step.phase === 'append-rest' && step.rest?.list === 'a' && i >= step.rest.from,
      )
    })
    bNodes.forEach((g, i) => {
      g.classList.toggle('is-taken', takenKeys.has(`b:${i}`))
      g.classList.toggle('is-cand', step.phase === 'compare' && step.p2 === i)
      g.classList.toggle(
        'is-win',
        step.phase === 'compare' && step.cursor === 'b' && step.p2 === i,
      )
      g.classList.toggle(
        'is-rest',
        step.phase === 'append-rest' && step.rest?.list === 'b' && i >= step.rest.from,
      )
    })

    // 结果槽：本步"新出现"的槽加 is-new，触发上浮动画
    const restCount = step.rest
      ? (step.rest.list === 'a' ? A.length : B.length) - step.rest.from
      : 0
    const newFrom =
      step.phase === 'take'
        ? step.taken.length // 只有最后一个槽是新的
        : step.phase === 'append-rest'
          ? step.taken.length - restCount + 1 // 整段都是新的
          : Number.POSITIVE_INFINITY
    rSlots.forEach((g, idx) => {
      const k = idx + 1
      const filled = k <= step.taken.length
      g.classList.toggle('is-filled', filled)
      g.classList.toggle('is-new', filled && k >= newFrom)
    })

    // 结果行箭头：第 k 条亮 = 第 k 个槽已接上；末尾 ∅ 在 done 时亮
    rEdges.forEach((g, idx) => g.classList.toggle('is-on', idx + 1 <= step.taken.length))
    tailEmptyEdge.classList.toggle('is-on', step.done)

    // vs 徽章：只在 compare 步出现，水平位置在两个候选正中间
    const showVs = step.phase === 'compare'
    vsGroup.classList.toggle('is-on', showVs)
    if (showVs) {
      const cx = (slotCenter(step.p1) + slotCenter(step.p2)) / 2
      vsGroup.style.transform = `translate(${cx}px, ${VS_CY}px)`
    }

    // 三个指针
    setChip(chipP1, step.p1 === null ? nullX(A.length) : slotCenter(step.p1), ROW_A_TOP - CHIP_DY)
    setChip(chipP2, step.p2 === null ? nullX(B.length) : slotCenter(step.p2), ROW_B_TOP - CHIP_DY)
    setChip(
      chipTail,
      slotCenter(Math.min(step.taken.length, nR - 1)),
      ROW_R_TOP + NODE_H + CHIP_DY,
    )

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
      delete host.dataset.mtlMounted
      instances -= 1
      if (instances <= 0) {
        document.getElementById(STYLE_ID)?.remove()
        removeChromeStyles()
      }
    },
  }
}

export default mountMergeTwoLists
