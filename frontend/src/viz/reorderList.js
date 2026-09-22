/**
 * reorderList.js — 「重排链表」(LeetCode 143) 的交互式推演动画。
 *
 * 和系列里其它动画一样是 vanilla JS：正文要过三道清洗（Python-Markdown →
 * bleach → DOMPurify），svg/style/script 都不在白名单里，动画只能在客户端
 * 现场构建，文章里只留占位符：
 *
 *     <div class="algo-viz algo-viz--lc143"></div>
 *
 * 结构分工：
 *     ./reorderSteps.js  纯状态机，产出每一步快照（有单测）
 *     ./widgetChrome.js  公共外壳：容器 / 说明文字 / 控制条 / svg 小工具
 *     本文件              只负责把快照画成 SVG
 *
 * 画面上有信息量的三样东西：
 *
 * 1. **顶部阶段条**。①②③ 三格，当前阶段亮起。这道题的价值就在于「拆成三步」，
 *    阶段条让读者随时知道自己在哪一步，也顺带说明每步对应哪道做过的题。
 *
 * 2. **上下两行**。找完中点并断开后，后半段整体下移一行；反转时它内部的箭头
 *    逐个掉头；合并时它的节点又一个个「跳」回上行。节点的移动带 CSS 过渡，
 *    重排这件事因此是看得见的，而不是只存在于文字里。
 *
 * 3. **断开的那条边**。画成灰色虚线留在画面上 —— 它提醒读者：少了这一刀，
 *    后面合并就会绕成环。
 *
 * 用法：
 *     import { mountReorderList } from '@/viz/reorderList'
 *     const handle = mountReorderList(host, { values: [1,2,3,4] })
 *     handle.destroy()
 */

import { buildReorderSteps } from './reorderSteps'
import {
  ensureChromeStyles,
  renderRichText,
  createControls,
  createPlayer,
  svgEl as svg,
} from './widgetChrome'

const STYLE_ID = 'rord-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NODE_W = 64
const NODE_H = 48
const GAP = 44
const PAD = 44
const ROW1_TOP = 118
const ROW2_TOP = 218
const CHIP_DY = -26 // chip 挂在节点上方
const STAGE_CY = 44
const CHIP_W = 58
const CHIP_H = 26
const NULL_EXTRA = 62 // 右端 ∅ 标记占的额外宽度

const PLAY_MS = 1250

const STAGES = ['① 找中点', '② 断开并反转', '③ 交替合并']

const STYLES = `
.rord {
  --rord-node: var(--text-primary, #1f2a24);
  --rord-edge: var(--text-secondary, #657168);
  --rord-a: var(--accent, #3f6b57);
  --rord-b: var(--accent-secondary, #a45f45);
  --rord-done: var(--accent, #3f6b57);
}
html.theme-dark .rord {
  --rord-b: #e0a06a;
  --rord-a: #7fc3a4;
}
.rord__svg { min-width: 520px; }

.rord-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease;
}
.rord-node__value {
  fill: var(--rord-node);
  font-size: 18px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rord-node.is-merged .rord-node__box { stroke: var(--rord-done); stroke-width: 2; }

/* 节点整体位移：重排的"动感"全靠它 */
.rord-node { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1); }

.rord-edge__line { stroke: var(--rord-edge); stroke-width: 1.8; stroke-linecap: round; fill: none; }
.rord-edge__head { fill: var(--rord-edge); }
.rord-edge--merged .rord-edge__line { stroke: var(--rord-done); }
.rord-edge--merged .rord-edge__head { fill: var(--rord-done); }
.rord-edge--cut .rord-edge__line {
  stroke: var(--rord-edge);
  stroke-dasharray: 4 4;
  opacity: 0.45;
}

.rord-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.rord-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 顶部阶段条 */
.rord-stage__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.rord-stage__text {
  fill: var(--text-secondary, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
}
.rord-stage.is-on .rord-stage__box { fill: var(--rord-done); stroke: var(--rord-done); }
.rord-stage.is-on .rord-stage__text { fill: #fff; }

.rord-chip { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.rord-chip__box { rx: 13; ry: 13; }
.rord-chip__text {
  font-size: 12.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rord-chip--slow .rord-chip__box,
.rord-chip--prev .rord-chip__box,
.rord-chip--first .rord-chip__box { fill: var(--rord-a); }
.rord-chip--fast .rord-chip__box,
.rord-chip--curr .rord-chip__box,
.rord-chip--second .rord-chip__box { fill: var(--rord-b); }
.rord-chip__text { fill: #fff; }
@media (prefers-reduced-motion: reduce) {
  .rord-node, .rord-chip, .rord-stage__box, .rord-node__box { transition: none; }
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
 * @param {{ values?: number[], autoplay?: boolean, initialStep?: number }} [options]
 * @returns {{ destroy: () => void }}
 */
export function mountReorderList(host, options = {}) {
  if (!host || host.dataset.rordMounted === '1') {
    return { destroy() {} }
  }
  host.dataset.rordMounted = '1'
  ensureStyles()

  const values = Array.isArray(options.values) && options.values.length
    ? options.values
    : [1, 2, 3, 4]
  const autoplay = options.autoplay !== false

  const steps = buildReorderSteps(values)
  const L = values.length

  const cols = Math.max(L, 1)
  const colX = (i) => PAD + i * (NODE_W + GAP)
  const nodeW = 2 * PAD + cols * NODE_W + (cols - 1) * GAP
  const width = nodeW + NULL_EXTRA
  const height = ROW2_TOP + NODE_H + 56
  const nullX = nodeW + NULL_EXTRA / 2

  const rowCy = (top) => top + NODE_H / 2

  // ── SVG 骨架 ────────────────────────────────────────────────────────────
  const root = document.createElement('div')
  root.className = 'viz rord'

  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  root.appendChild(stage)

  const svgRoot = svg('svg', {
    class: 'viz__svg rord__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': `重排链表推演动画：${values.join(' → ')}`,
  })
  stage.appendChild(svgRoot)

  // 顶部阶段条
  const stageGs = []
  const stageW = Math.min(150, (width - 2 * PAD - 2 * 16) / 3)
  const stageGap = 16
  const stageStartX = (width - (3 * stageW + 2 * stageGap)) / 2
  STAGES.forEach((text, i) => {
    const g = svg('g', { class: 'rord-stage' })
    const x = stageStartX + i * (stageW + stageGap)
    g.appendChild(
      svg('rect', {
        class: 'rord-stage__box',
        x,
        y: STAGE_CY - 15,
        width: stageW,
        height: 30,
        rx: 15,
      }),
    )
    const t = svg('text', { class: 'rord-stage__text', x: x + stageW / 2, y: STAGE_CY })
    t.textContent = text
    g.appendChild(t)
    svgRoot.appendChild(g)
    stageGs.push(g)
  })

  // 右端 ∅
  svgRoot.appendChild(svg('circle', { class: 'rord-null__ring', cx: nullX, cy: rowCy(ROW1_TOP), r: 15 }))
  const nullText = svg('text', { class: 'rord-null__text', x: nullX, y: rowCy(ROW1_TOP) })
  nullText.textContent = '∅'
  svgRoot.appendChild(nullText)

  // 边容器（每帧重建）
  const edgeG = svg('g', { class: 'rord-edges' })
  svgRoot.appendChild(edgeG)

  // 节点（内部坐标 0,0 起，靠 transform 移动）
  const nodeGs = []
  for (let i = 0; i < L; i += 1) {
    const g = svg('g', { class: 'rord-node' })
    g.appendChild(svg('rect', { class: 'rord-node__box', x: 0, y: 0, width: NODE_W, height: NODE_H, rx: 9 }))
    const t = svg('text', { class: 'rord-node__value', x: NODE_W / 2, y: NODE_H / 2 })
    t.textContent = String(values[i])
    g.appendChild(t)
    svgRoot.appendChild(g)
    nodeGs.push(g)
  }

  // 两个通用指针 chip（按帧切换 kind / 文案 / 位置）
  function makeChip() {
    const g = svg('g', { class: 'rord-chip' })
    g.appendChild(
      svg('rect', { class: 'rord-chip__box', x: -CHIP_W / 2, y: -CHIP_H / 2, width: CHIP_W, height: CHIP_H }),
    )
    const t = svg('text', { class: 'rord-chip__text', x: 0, y: 0 })
    g.appendChild(t)
    return { g, t }
  }
  const chips = [makeChip(), makeChip()]
  chips.forEach((c) => svgRoot.appendChild(c.g))

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')
  root.appendChild(desc)

  const controls = createControls()
  root.appendChild(controls.root)

  host.textContent = ''
  host.appendChild(root)

  let observer = null

  /** 一条普通边：同行相邻走直线，其余一律从节点底部绕行（带箭头）。 */
  function drawEdge(from, to, pos, cls) {
    const a = pos[from]
    const b = pos[to]
    const g = svg('g', { class: `rord-edge ${cls || ''}` })
    const sameRow = a.y === b.y
    const adjacent = sameRow && Math.abs(a.x - b.x) === NODE_W + GAP
    if (adjacent) {
      const y = a.y + NODE_H / 2
      const x1 = a.x + NODE_W
      const x2 = b.x
      g.appendChild(svg('line', { class: 'rord-edge__line', x1: x1 + 3, y1: y, x2: x2 - 9, y2: y }))
      g.appendChild(
        svg('path', { class: 'rord-edge__head', d: `M ${x2} ${y} L ${x2 - 9} ${y - 5.5} L ${x2 - 9} ${y + 5.5} Z` }),
      )
    } else {
      const y1 = a.y + NODE_H
      const y2 = b.y + NODE_H
      const drop = 38
      const c1x = a.x + NODE_W / 2
      const c2x = b.x + NODE_W / 2
      g.appendChild(
        svg('path', {
          class: 'rord-edge__line',
          d: `M ${c1x} ${y1} C ${c1x} ${y1 + drop}, ${c2x} ${y2 + drop}, ${c2x} ${y2 + 8}`,
        }),
      )
      // 箭头朝上，插进目标节点的下边缘
      g.appendChild(
        svg('path', { class: 'rord-edge__head', d: `M ${c2x} ${y2} L ${c2x - 5.5} ${y2 + 9} L ${c2x + 5.5} ${y2 + 9} Z` }),
      )
    }
    edgeG.appendChild(g)
  }

  function paint(_index, step) {
    // ── 位置：merged + front 在上行，back 在下行 ───────────────────────────
    const pos = new Array(L).fill(null)
    const rowOne = [...step.merged, ...step.front]
    rowOne.forEach((slot, i) => {
      pos[slot] = { x: colX(i), y: ROW1_TOP }
    })
    step.back.forEach((slot, i) => {
      pos[slot] = { x: colX(rowOne.length + i), y: ROW2_TOP }
    })
    // 兜底：任何没被安排到的节点（理论上不会）塞到上行末尾
    let spare = rowOne.length + step.back.length
    for (let i = 0; i < L; i += 1) {
      if (!pos[i]) {
        pos[i] = { x: colX(spare), y: ROW1_TOP }
        spare += 1
      }
    }

    const mergedSet = new Set(step.merged)
    for (let i = 0; i < L; i += 1) {
      const p = pos[i]
      nodeGs[i].setAttribute('transform', `translate(${p.x} ${p.y})`)
      nodeGs[i].classList.toggle('is-merged', mergedSet.has(i))
    }

    // ── 边：每帧重建 ──────────────────────────────────────────────────────
    edgeG.textContent = ''
    for (let i = 0; i < L; i += 1) {
      const to = step.links[i]
      if (to === null || to === undefined) continue
      if (to < 0 || to >= L) continue
      drawEdge(i, to, pos, step.phase === 'merge' || step.phase === 'done' ? 'rord-edge--merged' : '')
    }
    // 断开的那条边：灰虚线，无箭头
    if (step.cutEdge) {
      const [from, to] = step.cutEdge
      if (pos[from] && pos[to]) {
        const g = svg('g', { class: 'rord-edge rord-edge--cut' })
        const a = pos[from]
        const b = pos[to]
        g.appendChild(
          svg('line', {
            class: 'rord-edge__line',
            x1: a.x + NODE_W,
            y1: a.y + NODE_H / 2,
            x2: b.x,
            y2: b.y + NODE_H / 2,
          }),
        )
        edgeG.appendChild(g)
      }
    }

    // ── 阶段条 ────────────────────────────────────────────────────────────
    stageGs.forEach((g, i) => g.classList.toggle('is-on', step.stage === i + 1))

    // ── 指针 chip ─────────────────────────────────────────────────────────
    chips.forEach((chip, i) => {
      const spec = step.chips[i]
      if (!spec) {
        chip.g.style.opacity = '0'
        return
      }
      const p = spec.slot === null ? { x: nullX - NODE_W / 2, y: ROW1_TOP } : pos[spec.slot]
      chip.g.style.opacity = '1'
      chip.g.setAttribute('class', `rord-chip rord-chip--${spec.kind}`)
      chip.t.textContent = spec.label
      chip.g.setAttribute('transform', `translate(${p.x + NODE_W / 2} ${p.y + CHIP_DY})`)
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
      delete host.dataset.rordMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

export default mountReorderList
