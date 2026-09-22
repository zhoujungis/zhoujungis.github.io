/**
 * removeNthFromEnd.js — 「删除链表的倒数第 N 个结点」(LeetCode 19) 的
 * 交互式推演动画。
 *
 * 和系列里其它动画一样是 vanilla JS：正文要过三道清洗（Python-Markdown →
 * bleach → DOMPurify），svg/style/script 都不在白名单里，动画只能在客户端
 * 现场构建，文章里只留占位符：
 *
 *     <div class="algo-viz algo-viz--lc19"></div>
 *
 * 结构分工：
 *     ./removeNthSteps.js  纯状态机，产出每一步快照（有单测）
 *     ./widgetChrome.js    公共外壳：容器 / 说明文字 / 控制条 / svg 小工具
 *     本文件               只负责把快照画成 SVG
 *
 * 画面上有信息量的三样东西：
 *
 * 1. **dummy 虚线框**。它在链表里本不存在，但它是「删头不需要特判」的
 *    直接证据——fast 和 slow 的第一步都踩在它身上。
 *
 * 2. **「间隔」标注线**。同步阶段画在节点上方，数字始终是 n+1 不变。
 *    这条线就是循环不变量本身，读者不需要自己心算两个指针差几个身位。
 *
 * 3. **删除弧线**。最后一步，前驱的出边断开、一条跨过被删节点的弧线接上，
 *    被删节点变灰。直白地展示「删除 = 改一个 next」。
 *
 * 用法：
 *     import { mountRemoveNthFromEnd } from '@/viz/removeNthFromEnd'
 *     const handle = mountRemoveNthFromEnd(host, { values: [1,2,3,4,5], n: 2 })
 *     handle.destroy()
 */

import { buildRemoveNthSteps } from './removeNthSteps'
import {
  ensureChromeStyles,
  renderRichText,
  createControls,
  createPlayer,
  svgEl as svg,
  svgArrow,
} from './widgetChrome'

const STYLE_ID = 'rnth-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NODE_W = 64
const NODE_H = 50
const GAP = 42
const PAD = 48
const NODE_TOP = 88
const NODE_CY = NODE_TOP + NODE_H / 2 // 113
const GAPLINE_CY = 40 // 间隔标注线
const FAST_CY = 196
const SLOW_CY = 236
const CHIP_W = 56
const CHIP_H = 26
const HEIGHT = 272
const NULL_PAD = 26

const PLAY_MS = 1150

const STYLES = `
.rnth {
  --rnth-fast: var(--accent-secondary, #a45f45);
  --rnth-slow: var(--accent, #3f6b57);
  --rnth-edge: var(--text-secondary, #657168);
  --rnth-cut: #b3452e;
}
html.theme-dark .rnth {
  --rnth-fast: #e0a06a;
  --rnth-slow: #7fc3a4;
  --rnth-cut: #e07a5f;
}
.rnth__svg { min-width: 520px; }

.rnth-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, fill 0.26s ease, opacity 0.26s ease;
}
.rnth-node--dummy .rnth-node__box { stroke-dasharray: 5 3; }
.rnth-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 19px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rnth-node--dummy .rnth-node__value { font-size: 14px; fill: var(--text-secondary, #657168); }
/* 被删节点：变灰、虚线、半透明 */
.rnth-node.is-cut .rnth-node__box {
  stroke: var(--text-secondary, #657168);
  stroke-dasharray: 5 3;
  opacity: 0.55;
}
.rnth-node.is-cut .rnth-node__value { opacity: 0.45; text-decoration: line-through; }

.rnth-edge { opacity: 0; transition: opacity 0.26s ease; }
.rnth-edge.is-on { opacity: 1; }
.rnth-edge__line { stroke: var(--rnth-edge); stroke-width: 1.8; stroke-linecap: round; }
.rnth-edge__head { fill: var(--rnth-edge); }

.rnth-arc { opacity: 0; transition: opacity 0.26s ease; }
.rnth-arc.is-on { opacity: 1; }
.rnth-arc__line {
  fill: none;
  stroke: var(--rnth-cut);
  stroke-width: 2.2;
  stroke-linecap: round;
}
.rnth-arc__head { fill: var(--rnth-cut); }

.rnth-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.rnth-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 间隔标注线：双向箭头 + 中央标签 */
.rnth-gapline { opacity: 0; transition: opacity 0.26s ease; }
.rnth-gapline.is-on { opacity: 1; }
.rnth-gapline__line {
  stroke: var(--rnth-fast);
  stroke-width: 1.6;
  stroke-dasharray: 5 3;
}
.rnth-gapline__head { fill: var(--rnth-fast); }
.rnth-gapline__tag-bg { fill: var(--surface-muted, #ecefe8); }
.rnth-gapline__tag {
  fill: var(--rnth-fast);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rnth-tick {
  stroke: var(--text-secondary, #657168);
  stroke-width: 1;
  stroke-dasharray: 3 3;
  opacity: 0;
}
.rnth-chip { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.rnth-chip__box { rx: 13; ry: 13; }
.rnth-chip__text {
  font-size: 12.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rnth-chip--fast .rnth-chip__box { fill: var(--rnth-fast); }
.rnth-chip--fast .rnth-chip__text { fill: #fff; }
.rnth-chip--slow .rnth-chip__box { fill: var(--rnth-slow); }
.rnth-chip--slow .rnth-chip__text { fill: #fff; }
@media (prefers-reduced-motion: reduce) {
  .rnth-chip, .rnth-edge, .rnth-arc, .rnth-gapline, .rnth-node__box { transition: none; }
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
 *   values?: number[],
 *   n?: number,            // 删除倒数第几个，默认 2
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 * @returns {{ destroy: () => void }}
 */
export function mountRemoveNthFromEnd(host, options = {}) {
  if (!host || host.dataset.rnthMounted === '1') {
    return { destroy() {} }
  }
  host.dataset.rnthMounted = '1'
  ensureStyles()

  const values = Array.isArray(options.values) && options.values.length
    ? options.values
    : [1, 2, 3, 4, 5]
  const n = Math.min(Math.max(Math.trunc(options.n) || 2, 1), values.length)
  const autoplay = options.autoplay !== false

  const steps = buildRemoveNthSteps(values, n)
  const L = values.length
  const slots = L + 1 // slot 0 = dummy，1..L = 节点

  const width = 2 * PAD + slots * NODE_W + (slots - 1) * GAP
  const slotLeft = (s) => PAD + s * (NODE_W + GAP)
  const slotCenter = (s) => slotLeft(s) + NODE_W / 2
  const nullX = width - NULL_PAD

  // ── SVG 骨架：只建一次，之后改属性/类名让 CSS 过渡生效 ───────────────────
  const root = document.createElement('div')
  root.className = 'viz rnth'

  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  root.appendChild(stage)

  const svgRoot = svg('svg', {
    class: 'viz__svg rnth__svg',
    viewBox: `0 0 ${width} ${HEIGHT}`,
    role: 'img',
    'aria-label': `删除倒数第 ${n} 个节点推演动画：${values.join(' → ')}`,
  })
  stage.appendChild(svgRoot)

  // 右端的 ∅
  svgRoot.appendChild(svg('circle', { class: 'rnth-null__ring', cx: nullX, cy: NODE_CY, r: 15 }))
  const nullText = svg('text', { class: 'rnth-null__text', x: nullX, y: NODE_CY })
  nullText.textContent = '∅'
  svgRoot.appendChild(nullText)

  // chip 引线（画在节点下层）
  const tickFast = svg('line', { class: 'rnth-tick' })
  const tickSlow = svg('line', { class: 'rnth-tick' })
  svgRoot.append(tickFast, tickSlow)

  // 相邻 slot 之间的正向箭头（slot 0..L-1 → slot+1）
  const gapEdges = []
  for (let s = 0; s < L; s += 1) {
    const from = slotLeft(s) + NODE_W
    const to = slotLeft(s + 1)
    const edge = svgArrow(from, to, NODE_CY, 1, 'rnth-edge')
    svgRoot.appendChild(edge)
    gapEdges.push(edge)
  }
  // 尾节点 → ∅
  const tailEdge = svgArrow(slotLeft(L) + NODE_W, nullX - 15, NODE_CY, 1, 'rnth-edge')
  svgRoot.appendChild(tailEdge)

  // 删除弧线（几何在 paint 里按 cutSlot 现算）
  const arcLine = svg('path', { class: 'rnth-arc__line' })
  const arcHead = svg('path', { class: 'rnth-arc__head' })
  const arcG = svg('g', { class: 'rnth-arc' })
  arcG.append(arcLine, arcHead)
  svgRoot.appendChild(arcG)

  // 节点（含 dummy）
  const nodeGroups = []
  for (let s = 0; s < slots; s += 1) {
    const g = svg('g', { class: `rnth-node${s === 0 ? ' rnth-node--dummy' : ''}` })
    g.appendChild(
      svg('rect', {
        class: 'rnth-node__box',
        x: slotLeft(s),
        y: NODE_TOP,
        width: NODE_W,
        height: NODE_H,
        rx: 9,
      }),
    )
    const t = svg('text', { class: 'rnth-node__value', x: slotCenter(s), y: NODE_CY })
    t.textContent = s === 0 ? 'dummy' : String(values[s - 1])
    g.appendChild(t)
    svgRoot.appendChild(g)
    nodeGroups.push(g)
  }

  // 间隔标注线（画在节点上方）
  const gapG = svg('g', { class: 'rnth-gapline' })
  const gapLine = svg('line', { class: 'rnth-gapline__line' })
  const gapHeadL = svg('path', { class: 'rnth-gapline__head' })
  const gapHeadR = svg('path', { class: 'rnth-gapline__head' })
  const gapTagBg = svg('rect', { class: 'rnth-gapline__tag-bg', x: -26, y: -9, width: 52, height: 18, rx: 6 })
  const gapTag = svg('text', { class: 'rnth-gapline__tag', x: 0, y: 0 })
  gapG.append(gapLine, gapHeadL, gapHeadR, gapTagBg, gapTag)
  svgRoot.appendChild(gapG)

  // 指针 chip
  function makeChip(kind, label) {
    const g = svg('g', { class: `rnth-chip rnth-chip--${kind}` })
    g.appendChild(
      svg('rect', {
        class: 'rnth-chip__box',
        x: -CHIP_W / 2,
        y: -CHIP_H / 2,
        width: CHIP_W,
        height: CHIP_H,
      }),
    )
    const t = svg('text', { class: 'rnth-chip__text', x: 0, y: 0 })
    t.textContent = label
    return g
  }
  const chipFast = makeChip('fast', 'fast')
  const chipSlow = makeChip('slow', 'slow')
  svgRoot.append(chipFast, chipSlow)

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

  const chipX = (slot) => (slot === null ? nullX : slotCenter(slot))

  function setChip(chip, tick, slot, cy) {
    const x = chipX(slot)
    chip.style.transform = `translate(${x}px, ${cy}px)`
    chip.style.opacity = '1'
    tick.setAttribute('x1', x)
    tick.setAttribute('x2', x)
    tick.setAttribute('y1', cy - CHIP_H / 2)
    tick.setAttribute('y2', NODE_TOP + NODE_H)
    tick.style.opacity = '0.65'
  }

  function paintArc(step) {
    const cutSlot = step.cutSlot
    if (cutSlot === null || step.links[cutSlot - 1] !== cutSlot + 1) {
      arcG.classList.remove('is-on')
      return
    }
    // 前驱（cutSlot-1）→ 新目标（cutSlot+1），拱向上的弧线
    const fromX = slotLeft(cutSlot - 1) + NODE_W
    const toX = slotLeft(cutSlot + 1)
    const fromY = NODE_CY
    const toY = NODE_CY
    const lift = 44
    const c1x = fromX + (toX - fromX) * 0.3
    const c2x = fromX + (toX - fromX) * 0.7
    arcLine.setAttribute(
      'd',
      `M ${fromX} ${fromY} C ${c1x} ${fromY - lift}, ${c2x} ${toY - lift}, ${toX - 8} ${toY}`,
    )
    // 箭头尖端朝右，略微下压贴合弧线终点
    arcHead.setAttribute(
      'd',
      `M ${toX} ${toY} L ${toX - 9} ${toY - 5.5} L ${toX - 9} ${toY + 5.5} Z`,
    )
    arcG.classList.add('is-on')
  }

  function paintGap(step) {
    const show = step.gap !== null && step.gap > 0 && step.fast !== null
    gapG.classList.toggle('is-on', show)
    if (!show) return
    const x1 = slotCenter(step.slow)
    const x2 = slotCenter(step.fast)
    gapLine.setAttribute('x1', x1)
    gapLine.setAttribute('x2', x2)
    gapLine.setAttribute('y1', GAPLINE_CY)
    gapLine.setAttribute('y2', GAPLINE_CY)
    const head = 7
    gapHeadL.setAttribute('d', `M ${x1} ${GAPLINE_CY} L ${x1 + head} ${GAPLINE_CY - 4.5} L ${x1 + head} ${GAPLINE_CY + 4.5} Z`)
    gapHeadR.setAttribute('d', `M ${x2} ${GAPLINE_CY} L ${x2 - head} ${GAPLINE_CY - 4.5} L ${x2 - head} ${GAPLINE_CY + 4.5} Z`)
    gapTagBg.setAttribute('x', (x1 + x2) / 2 - 26)
    gapTagBg.setAttribute('y', GAPLINE_CY - 9)
    gapTag.setAttribute('x', (x1 + x2) / 2)
    gapTag.setAttribute('y', GAPLINE_CY)
    gapTag.textContent = `间隔 ${step.gap}`
  }

  function paint(_index, step) {
    // 节点状态：被删的灰掉
    for (let s = 0; s < slots; s += 1) {
      nodeGroups[s].classList.toggle('is-cut', step.cutSlot !== null && s === step.cutSlot)
    }

    // 出边：links[s] === s+1 亮直箭头；否则灭
    for (let s = 0; s < L; s += 1) {
      gapEdges[s].classList.toggle('is-on', step.links[s] === s + 1)
    }
    tailEdge.classList.toggle('is-on', step.links[L] === null)

    paintArc(step)
    paintGap(step)

    if (step.fast === null) {
      chipFast.style.transform = `translate(${nullX}px, ${FAST_CY}px)`
      chipFast.style.opacity = '1'
      tickFast.style.opacity = '0'
    } else {
      setChip(chipFast, tickFast, step.fast, FAST_CY)
    }
    setChip(chipSlow, tickSlow, step.slow, SLOW_CY)

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
      delete host.dataset.rnthMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

export default mountRemoveNthFromEnd
