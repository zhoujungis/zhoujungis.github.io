/**
 * cycleDetect.js — 「环形链表」(LeetCode 141) Floyd 判圈的交互式推演动画。
 *
 * 和 linkedListReverse.js / mergeKLists.js 一样是 vanilla JS：正文要过三道清洗
 * （Python-Markdown → bleach → DOMPurify），svg/style/script 都不在白名单里，
 * 动画只能在客户端现场构建，文章里只留占位符：
 *
 *     <div class="algo-viz algo-viz--lc141"></div>
 *
 * 结构分工：
 *     ./cycleDetectSteps.js  纯状态机，产出每一步快照（有单测）
 *     ./cycleLayout.js       「直段 + 环」的共享几何骨架（LC 142 也用它）
 *     ./widgetChrome.js      公共外壳：容器 / 说明文字 / 控制条 / svg 小工具
 *     本文件                 只负责把快照画成 SVG
 *
 * 画面上有信息量的三样东西：
 *
 * 1. **两枚指针徽标**（绿「慢」/ 橙「快」），贴着节点画。徽标方向跟着节点走：
 *    直段上的节点徽标在下方，环上的节点徽标**沿半径朝外**，所以永远不会压到
 *    环里那块读数区，相邻节点的徽标也不会打架。
 *
 * 2. **环内那条虚线弧** = 「快指针沿环前进方向到慢指针还差几格」。这是整个动画的
 *    主角：相对速度是 1，所以它**每步缩短一格**，从 5 一路缩到 0，两个指针就碰上了。
 *    弧上的数字就是那个格数，读者不需要自己去数。
 *
 * 3. **环入口的虚线框**。判环本身不需要知道入口在哪，但标出来读者才有参照物，
 *    也让下一个动画（LC 142）的画面能无缝接上。
 *
 * 用法：
 *     import { mountCycleDetect } from '@/viz/cycleDetect'
 *     const handle = mountCycleDetect(host, { values: [...], cycleStart: 4 })
 *     handle.destroy()
 */

import { buildCycleDetectSteps } from './cycleDetectSteps'
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
  CHIP_H,
} from './cycleLayout'

const STYLE_ID = 'cyd-styles'

/** 距离弧画在环内多深的位置（相对环半径的内缩量）。 */
const ARC_INSET = 42
const CHIP_W = 26
const PLAY_MS = 1150

const STYLES = `
.cyd { --cyd-slow: #2f6f4f; --cyd-fast: #b4682c; }
html.theme-dark .cyd { --cyd-slow: #7fc3a4; --cyd-fast: #e0a06a; }
.cyd__svg { min-width: 520px; }

/* 距离弧：快指针沿环前进方向到慢指针的那段 */
.cyd-arc { transition: opacity 0.3s ease; }
.cyd-arc.is-off { opacity: 0; }
.cyd-arc__line {
  fill: none;
  stroke: var(--cyd-fast);
  stroke-width: 2.2;
  stroke-dasharray: 7 4;
  stroke-linecap: round;
}
.cyd-arc__head { fill: var(--cyd-fast); }
.cyd-arc__tag-bg { fill: var(--surface-muted, #ecefe8); }
.cyd-arc__tag {
  fill: var(--cyd-fast);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .cyd-arc { transition: none; }
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

/** 指针徽标：一个小圆角块 + 一个汉字。 */
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

/**
 * 挂载动画。
 * @param {HTMLElement} host 占位元素（会被填满）
 * @param {{
 *   values?: Array<number|string>,
 *   cycleStart?: number|null,   // null = 无环
 *   fastStep?: number,          // 快指针每步走几格，默认 2
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 * @returns {{ destroy: () => void }}
 */
export function mountCycleDetect(host, options = {}) {
  if (!host || host.dataset.cydMounted === '1') {
    return { destroy() {} }
  }
  host.dataset.cydMounted = '1'
  ensureStyles()

  const steps = buildCycleDetectSteps(options)
  const frameMeta = steps[0].cycle
  const values = Array.isArray(options.values) && options.values.length
    ? options.values
    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  const cycleStart = frameMeta ? frameMeta.start : null
  const autoplay = options.autoplay !== false

  const root = document.createElement('div')
  root.className = 'viz cyd'

  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  root.appendChild(stage)

  const W = 700
  const H = 400
  const svgRoot = svg('svg', {
    class: 'viz__svg cyd__svg',
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    'aria-label': 'Floyd 判圈（龟兔赛跑）推演动画',
  })
  stage.appendChild(svgRoot)

  // 几何骨架先建出来，才知道真实画布尺寸 —— 再用它收紧 viewBox
  const frame = buildCycleFrame(svgRoot, { values, cycleStart })
  svgRoot.setAttribute('viewBox', `0 0 ${frame.width} ${frame.height}`)
  svgRoot.setAttribute('width', frame.width)
  svgRoot.setAttribute('height', frame.height)

  // ── 距离弧（画在环内）────────────────────────────────────────────────────
  const arcG = svg('g', { class: 'cyd-arc is-off' })
  const arcLine = svg('path', { class: 'cyd-arc__line' })
  const arcHead = svg('path', { class: 'cyd-arc__head' })
  const arcTagBg = svg('rect', {
    class: 'cyd-arc__tag-bg',
    x: -30,
    y: -9,
    width: 60,
    height: 18,
    rx: 6,
  })
  const arcTag = svg('text', { class: 'cyd-arc__tag', x: 0, y: 0 })
  const arcTagG = svg('g', { class: 'cyd-arc__tag-group' })
  arcTagG.append(arcTagBg, arcTag)
  arcG.append(arcLine, arcHead, arcTagG)
  svgRoot.appendChild(arcG)

  // ── 指针徽标 ─────────────────────────────────────────────────────────────
  const slowChip = makeChip(svgRoot, 'slow', '慢')
  const fastChip = makeChip(svgRoot, 'fast', '快')

  /** 徽标落点：见 cycleLayout.chipAnchor（入口节点朝下，其余沿半径朝外）。 */
  function chipPos(index, slot) {
    return chipAnchor(frame.at(index), frame, slot)
  }

  const place = (chip, pos) => {
    if (!pos) {
      chip.style.opacity = '0'
      return
    }
    chip.style.opacity = '1'
    chip.setAttribute('transform', `translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)})`)
  }

  // ── 说明文字 + 控制条 ────────────────────────────────────────────────────
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
    const sameNode = step.slow !== null && step.slow === step.fast

    // 节点高亮：绿 = 慢，橙 = 快，重合时用混合色
    frame.nodes.forEach((nd) => {
      const isSlow = nd.index === step.slow
      const isFast = nd.index === step.fast
      nd.g.classList.toggle('is-slow', isSlow && !isFast)
      nd.g.classList.toggle('is-fast', isFast && !isSlow)
      nd.g.classList.toggle('is-both', isSlow && isFast)
    })

    place(slowChip, step.slow === null ? null : chipPos(step.slow, sameNode ? -1 : 0))
    place(fastChip, step.fast === null ? null : chipPos(step.fast, sameNode ? 1 : 0))

    // 距离弧：只有两指针都在环上、且还没相遇时才画
    const kf = step.fast === null ? -1 : frame.ringKOf(step.fast)
    const ks = step.slow === null ? -1 : frame.ringKOf(step.slow)
    const showArc = b > 0 && kf >= 0 && ks >= 0 && step.gap !== null && step.gap > 0
    arcG.classList.toggle('is-off', !showArc)
    if (showArc) {
      const r = frame.radius - ARC_INSET
      const dk = (ks - kf + b) % b
      const a0 = ringAngle(kf, b)
      const a1 = ringAngle(kf + dk, b)
      const span = a1 - a0
      const toXY = (deg) => {
        const t = (deg * Math.PI) / 180
        return { x: frame.ringCenter.x + r * Math.cos(t), y: frame.ringCenter.y + r * Math.sin(t) }
      }
      const p0 = toXY(a0)
      const p1 = toXY(a1)
      const largeArc = span > 180 ? 1 : 0
      arcLine.setAttribute(
        'd',
        `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A ${r} ${r} 0 ${largeArc} 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`,
      )

      // 箭头尖端沿切线方向（角度增大方向 = 屏幕上顺时针）
      const t1 = (a1 * Math.PI) / 180
      const tx = -Math.sin(t1)
      const ty = Math.cos(t1)
      const px = -ty
      const py = tx
      const head = 9
      const w = 5
      arcHead.setAttribute(
        'd',
        `M ${p1.x} ${p1.y} ` +
          `L ${p1.x - tx * head + px * w} ${p1.y - ty * head + py * w} ` +
          `L ${p1.x - tx * head - px * w} ${p1.y - ty * head - py * w} Z`,
      )

      const am = a0 + span / 2
      const tm = (am * Math.PI) / 180
      const mp = { x: frame.ringCenter.x + r * Math.cos(tm), y: frame.ringCenter.y + r * Math.sin(tm) }
      arcTagG.setAttribute('transform', `translate(${mp.x.toFixed(1)} ${mp.y.toFixed(1)})`)
      arcTag.textContent = `${step.gap} 格`
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
      delete host.dataset.cydMounted
      // 只摘自己那份样式。chrome / layout 是**两个动画共用**的，谁先被销毁谁就把
      // 它们摘掉的话，另一个还在页面上的动画会当场掉样式（LC 141 和 LC 142 必然
      // 同页出现）。它们幂等且只有几 KB，留着比摘掉安全。
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

export default mountCycleDetect
