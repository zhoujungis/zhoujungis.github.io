/**
 * cycleEntry.js — 「环形链表 II」(LeetCode 142) 找环入口的交互式推演动画。
 *
 * 和 cycleDetect.js 共用同一套「直段 + 环」骨架（cycleLayout.js），所以两个动画
 * 画出来**确实是同一条链表**：同一个入口、同一个环长、同一个相遇点。文章里前后
 * 两段能无缝接上。
 *
 * 文章里只留占位符：
 *
 *     <div class="algo-viz algo-viz--lc142"></div>
 *
 * 画面比 LC 141 多两样东西，它们就是这道题的全部：
 *
 * 1. **直段下方那条尺寸线** = 「ptr1 从 head 走到入口还差几步」。左端跟着 ptr1
 *    往右收，长度肉眼可见地缩短。
 *
 * 2. **环内那条弧** = 「ptr2 从当前位置沿环走到入口还差几步」。同样每步缩短一格。
 *
 * 关键在于**两个数同步递减**（a ≡ b - x (mod b) 的直接后果），所以两段会同时归零，
 * 两个指针就在入口碰头。作者视角看，这就是「两条路一样长」。
 *
 * 另外标了一个橙色虚线框：第一阶段的**相遇点**。ptr2 就是从那里出发的。
 *
 * 用法：
 *     import { mountCycleEntry } from '@/viz/cycleEntry'
 *     const handle = mountCycleEntry(host, { values: [...], cycleStart: 4 })
 *     handle.destroy()
 */

import { buildCycleEntrySteps } from './cycleEntrySteps'
import {
  ensureChromeStyles,
  renderRichText,
  createControls,
  createPlayer,
  svgEl as svg,
} from './widgetChrome'
import {
  ensureLayoutStyles,
  buildCycleFrame,
  chipAnchor,
  ringAngle,
  NODE_W,
  NODE_H,
  CHIP_H,
} from './cycleLayout'

const STYLE_ID = 'cye-styles'

const ARC_INSET = 42
const BAR_DY = 56 // 直段下方尺寸线的位置（相对行中线）
const CHIP_W = 32
const CHIP_SEP = 17
const PLAY_MS = 1250

const STYLES = `
.cye { --cye-p1: #2f6f4f; --cye-p2: #b4682c; }
html.theme-dark .cye { --cye-p1: #7fc3a4; --cye-p2: #e0a06a; }
.cye__svg { min-width: 520px; }

/* 相遇点：橙色虚线框，常驻 */
.cye-meet__box {
  fill: none;
  stroke: var(--cye-p2);
  stroke-width: 1.6;
  stroke-dasharray: 3 3;
  opacity: 0.85;
}

/* 尺寸线（直段那条） */
.cye-bar { transition: opacity 0.3s ease; }
.cye-bar.is-off { opacity: 0; }
.cye-bar__line { stroke: var(--cye-p1); stroke-width: 2; stroke-linecap: round; }
.cye-bar__tick { stroke: var(--cye-p1); stroke-width: 2; stroke-linecap: round; }

/* 环内那条弧 */
.cye-arc { transition: opacity 0.3s ease; }
.cye-arc.is-off { opacity: 0; }
.cye-arc__line {
  fill: none;
  stroke: var(--cye-p2);
  stroke-width: 2.2;
  stroke-dasharray: 7 4;
  stroke-linecap: round;
}
.cye-arc__head { fill: var(--cye-p2); }

/* 两个「还差几步」读数，配色和各自的指针一致 */
.cye-tag-bg { fill: var(--surface-muted, #ecefe8); }
.cye-tag {
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-variant-numeric: tabular-nums;
}
.cye-tag--p1 { fill: var(--cye-p1); }
.cye-tag--p2 { fill: var(--cye-p2); }

@media (prefers-reduced-motion: reduce) {
  .cye-bar, .cye-arc { transition: none; }
}
`

function ensureStyles() {
  ensureChromeStyles()
  ensureLayoutStyles()
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLES
  document.head.appendChild(style)
}

function makeChip(parent, kind, label) {
  const g = svg('g', { class: `cyc-chip cyc-chip--${kind}` })
  g.appendChild(
    svg('rect', {
      class: 'cyc-chip__box',
      x: -CHIP_W / 2,
      y: -CHIP_H / 2,
      width: CHIP_W,
      height: CHIP_H,
    }),
  )
  const t = svg('text', { class: 'cyc-chip__text', x: 0, y: 0 })
  t.textContent = label
  g.appendChild(t)
  parent.appendChild(g)
  return g
}

/** 一个「还差 N 步」读数：底 + 文字，整体靠 transform 移动。 */
function makeTag(parent, kind) {
  const g = svg('g', { class: `cye-tag-group cye-tag-group--${kind}` })
  const bg = svg('rect', {
    class: 'cye-tag-bg',
    x: -38,
    y: -10,
    width: 76,
    height: 20,
    rx: 6,
  })
  const t = svg('text', { class: `cye-tag cye-tag--${kind}`, x: 0, y: 0 })
  g.append(bg, t)
  parent.appendChild(g)
  return { g, t, bg }
}

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{
 *   values?: Array<number|string>,
 *   cycleStart?: number|null,
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 * @returns {{ destroy: () => void }}
 */
export function mountCycleEntry(host, options = {}) {
  if (!host || host.dataset.cyeMounted === '1') {
    return { destroy() {} }
  }
  host.dataset.cyeMounted = '1'
  ensureStyles()

  const steps = buildCycleEntrySteps(options)
  const values = Array.isArray(options.values) && options.values.length
    ? options.values
    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  const head = steps[0]
  const cycleStart = Number.isInteger(head.a) && head.b > 0 ? head.a : null
  const autoplay = options.autoplay !== false

  const root = document.createElement('div')
  root.className = 'viz cye'

  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  root.appendChild(stage)

  const svgRoot = svg('svg', {
    class: 'viz__svg cye__svg',
    viewBox: '0 0 700 400',
    role: 'img',
    'aria-label': '环形链表找入口推演动画',
  })
  stage.appendChild(svgRoot)

  const frame = buildCycleFrame(svgRoot, { values, cycleStart })
  svgRoot.setAttribute('viewBox', `0 0 ${frame.width} ${frame.height}`)
  svgRoot.setAttribute('width', frame.width)
  svgRoot.setAttribute('height', frame.height)

  const entryNode = frame.at(frame.a)

  // ── 相遇点常驻标记 ───────────────────────────────────────────────────────
  let meetBox = null
  if (Number.isInteger(head.meetAt) && frame.at(head.meetAt)) {
    const c = frame.at(head.meetAt)
    const g = svg('g', { class: 'cye-meet' })
    g.appendChild(
      svg('rect', {
        class: 'cye-meet__box',
        x: c.cx - NODE_W / 2 - 6,
        y: c.cy - NODE_H / 2 - 6,
        width: NODE_W + 12,
        height: NODE_H + 12,
        rx: 12,
      }),
    )
    svgRoot.appendChild(g)
    meetBox = g
  }

  // ── 直段下方的尺寸线 ─────────────────────────────────────────────────────
  const barG = svg('g', { class: 'cye-bar' })
  const barLine = svg('path', { class: 'cye-bar__line' })
  const barTickL = svg('path', { class: 'cye-bar__tick' })
  const barTickR = svg('path', { class: 'cye-bar__tick' })
  barG.append(barLine, barTickL, barTickR)
  svgRoot.appendChild(barG)
  const barTag = makeTag(svgRoot, 'p1')

  // ── 环内的弧 ─────────────────────────────────────────────────────────────
  const arcG = svg('g', { class: 'cye-arc' })
  const arcLine = svg('path', { class: 'cye-arc__line' })
  const arcHead = svg('path', { class: 'cye-arc__head' })
  arcG.append(arcLine, arcHead)
  svgRoot.appendChild(arcG)
  const arcTag = makeTag(svgRoot, 'p2')

  // ── 指针徽标 ─────────────────────────────────────────────────────────────
  const chip1 = makeChip(svgRoot, 'p1', 'P1')
  const chip2 = makeChip(svgRoot, 'p2', 'P2')

  /** 徽标落点：见 cycleLayout.chipAnchor（入口节点朝下，其余沿半径朝外）。 */
  function chipPos(index, slot) {
    return chipAnchor(frame.at(index), frame, slot, CHIP_SEP)
  }

  const place = (chip, pos) => {
    if (!pos) {
      chip.style.opacity = '0'
      return
    }
    chip.style.opacity = '1'
    chip.setAttribute('transform', `translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)})`)
  }

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
    const b = frame.b
    const sameNode = step.ptr1 !== null && step.ptr1 === step.ptr2

    frame.nodes.forEach((nd) => {
      const isP1 = nd.index === step.ptr1
      const isP2 = nd.index === step.ptr2
      nd.g.classList.toggle('is-slow', isP1 && !isP2)
      nd.g.classList.toggle('is-fast', isP2 && !isP1)
      nd.g.classList.toggle('is-both', isP1 && isP2)
    })

    place(chip1, step.ptr1 === null ? null : chipPos(step.ptr1, sameNode ? -1 : 0))
    place(chip2, step.ptr2 === null ? null : chipPos(step.ptr2, sameNode ? 1 : 0))

    if (meetBox) meetBox.style.opacity = step.phase === 'found' ? '0.45' : '1'

    // ── 直段尺寸线：从 ptr1 当前位置拉到入口 ──────────────────────────────
    const p1Node = step.ptr1 === null ? null : frame.at(step.ptr1)
    const showBar = !!p1Node && step.remain1 > 0 && !!entryNode
    barG.classList.toggle('is-off', !showBar)
    barTag.g.style.opacity = showBar ? '1' : '0'
    if (showBar) {
      const y = frame.rowY + BAR_DY
      const x1 = p1Node.cx
      const x2 = entryNode.cx
      barLine.setAttribute('d', `M ${x1} ${y} L ${x2} ${y}`)
      barTickL.setAttribute('d', `M ${x1} ${y - 6} L ${x1} ${y + 6}`)
      barTickR.setAttribute('d', `M ${x2} ${y - 6} L ${x2} ${y + 6}`)
      barTag.g.setAttribute('transform', `translate(${((x1 + x2) / 2).toFixed(1)} ${y})`)
      barTag.t.textContent = `还差 ${step.remain1} 步`
    }

    // ── 环内弧：从 ptr2 当前位置沿环前进 remain2 步到入口 ──────────────────
    const k2 = step.ptr2 === null ? -1 : frame.ringKOf(step.ptr2)
    const showArc = b > 0 && k2 >= 0 && step.remain2 > 0 && !step.passed2
    arcG.classList.toggle('is-off', !showArc)
    arcTag.g.style.opacity = showArc ? '1' : '0'
    if (showArc) {
      const r = frame.radius - ARC_INSET
      const a0 = ringAngle(k2, b)
      const a1 = ringAngle(k2 + step.remain2, b)
      const span = a1 - a0
      const toXY = (deg) => {
        const t = (deg * Math.PI) / 180
        return { x: frame.ringCenter.x + r * Math.cos(t), y: frame.ringCenter.y + r * Math.sin(t) }
      }
      const p0 = toXY(a0)
      const p1 = toXY(a1)
      arcLine.setAttribute(
        'd',
        `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A ${r} ${r} 0 ${span > 180 ? 1 : 0} 1 ` +
          `${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`,
      )
      const t1 = (a1 * Math.PI) / 180
      const tx = -Math.sin(t1)
      const ty = Math.cos(t1)
      const head = 9
      const w = 5
      arcHead.setAttribute(
        'd',
        `M ${p1.x} ${p1.y} ` +
          `L ${p1.x - tx * head - ty * w} ${p1.y - ty * head + tx * w} ` +
          `L ${p1.x - tx * head + ty * w} ${p1.y - ty * head - tx * w} Z`,
      )
      const am = a0 + span / 2
      const tm = (am * Math.PI) / 180
      arcTag.g.setAttribute(
        'transform',
        `translate(${(frame.ringCenter.x + r * Math.cos(tm)).toFixed(1)} ` +
          `${(frame.ringCenter.y + r * Math.sin(tm)).toFixed(1)})`,
      )
      arcTag.t.textContent = `还差 ${step.remain2} 步`
    }

    renderRichText(desc, step.desc)
  }

  const player = createPlayer({ steps, controls, intervalMs: PLAY_MS, onRender: paint })
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
      delete host.dataset.cyeMounted
      // 只摘自己那份。chrome / layout 是和 LC 141 共用的，见 cycleDetect.js 的注释。
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

export default mountCycleEntry
