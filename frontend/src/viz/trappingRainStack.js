/**
 * trappingRainStack.js — 「接雨水」(LeetCode 42) **单调栈解法** 推演动画的 SVG 渲染层。
 *
 * 逻辑全在 trappingRainStackSteps.js 里。和双指针那个动画（trappingRainWater.js）
 * 画的是同一排柱子，但**多两块、少一块**：
 *
 *   多：① 柱状图下方一列**栈格子**（栈底 → 栈顶，显示栈内下标与高度）
 *       ② 本帧结算的那一**层**，画成一个金色边框的矩形 —— 这是"横着切"的直接证据
 *   少：没有左/右指针（这个解法是一个栈 + 一个扫描下标 `i`）
 *
 * ⚠️ 通用坑（系列里踩过，这里直接规避）：
 *   A. 所有 CSS 变量都带字面量兜底。
 *   K. 分层绘制：水 → 柱子 → 强调层 → 栈与标签。
 *   L. 「被强调的层」和「已接住的水」是两种状态，样式必须分开
 *      （都用蓝色的话，读者分不清哪些是本帧新加的）。
 *   Q. 柱宽 / 栈格宽度按数组长度自适应。
 */

import { buildTrappingRainStackSteps } from './trappingRainStackSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'trs-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NOTE_Y = 54
const BANNER_TOP = 88
const BANNER_H = 46

const CHART_H = 158
const BASE_Y = 320
const BAR_W_MAX = 46
const BAR_GAP = 3
const BAR_TEXT_DY = 14

const IDX_Y = 336
const SCAN_TRI_DY = 20          // 扫描下标 i 在柱子上方多高

const STACK_TITLE_Y = 362
const SLOT_TOP = 376
const SLOT_W_MAX = 34
const SLOT_H = 34
const SLOT_GAP = 4

const LABEL_X = 26
const AVAIL = 604

const PLAY_MS = 1100            // 帧数多（22 帧），节奏快一点

const STYLES = `
.trs {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.trs__svg { width: 100%; height: auto; display: block; }

.trs-note {
  fill: var(--trs-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.trs-ground { stroke: var(--trs-line-strong, #9aa39c); stroke-width: 2; }

/* ── 柱子 ─────────────────────────────────────────────────────────────── */
.trs-bar__box {
  fill: var(--trs-bar-fill, #efece4);
  stroke: var(--trs-line, #c3c9c2);
  stroke-width: 1.5;
}
.trs-bar__h {
  fill: var(--trs-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 已接住的水（常态蓝色） */
.trs-bar__water {
  fill: var(--trs-water, #7fa8c9);
  stroke: var(--trs-water-line, #4a7fa8);
  stroke-width: 1.5;
}
/* ⚠️ 本帧**新增**的那一层：淡金填充 + 金色实线边框。
   初版用 rgba 半透明 + 虚线 —— 虚线在视觉语言里是"被排除/禁用"，
   而这里恰恰是"本帧刚加上的水"，语义完全反了；半透明叠在已有的蓝色水上
   又会混成一种说不清的灰。改成实线 + 不透明淡金，和水（蓝）一眼分开。 */
.trs-layer {
  fill: var(--trs-layer-fill, #fdeecb);
  stroke: var(--trs-gold, #c2872f);
  stroke-width: 2.5;
}
/* 扫描下标 i 指向的柱子 */
.trs-bar.is-scan .trs-bar__box {
  fill: var(--trs-hot-fill, #fdf1ec);
  stroke: var(--trs-hot, #a45f45);
  stroke-width: 3;
}
.trs-bar.is-scan .trs-bar__h { fill: var(--trs-hot, #a45f45); }

/* 扫描指针：柱子上方朝下的三角 */
.trs-scan__tri { fill: var(--trs-hot, #a45f45); }
.trs-scan__text {
  fill: var(--trs-hot, #a45f45);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.trs-idx {
  fill: var(--trs-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 栈 ───────────────────────────────────────────────────────────────── */
.trs-stack__title {
  fill: var(--trs-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trs-slot__box {
  fill: var(--trs-fill, #ffffff);
  stroke: var(--trs-line, #c3c9c2);
  stroke-width: 1.5;
}
.trs-slot__idx {
  fill: var(--trs-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trs-slot__h {
  fill: var(--trs-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 栈顶那一格 */
.trs-slot.is-top .trs-slot__box {
  fill: var(--trs-gold-fill, #fdf6e8);
  stroke: var(--trs-gold, #c2872f);
  stroke-width: 2.5;
}
.trs-slot.is-top .trs-slot__idx { fill: var(--trs-gold, #c2872f); }
.trs-stack__empty {
  fill: var(--trs-dim, #b9b9b3);
  font-size: 13px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.trs-banner__box {
  fill: var(--trs-banner-fill, #f4f2ec);
  stroke: var(--trs-line, #c3c9c2);
  stroke-width: 1.5;
}
.trs-banner__seg {
  fill: var(--trs-muted, #657168);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trs-banner__label {
  fill: var(--trs-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trs-banner__ans {
  fill: var(--trs-water-line, #4a7fa8);
  font-size: 21px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.trs-empty__text {
  fill: var(--trs-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
}
`

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLES
  document.head.appendChild(style)
}

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{
 *   height?: number[],
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 */
export function mountTrappingRainStack(host, options = {}) {
  if (!host || host.dataset.trsMounted === '1') return { destroy() {} }
  host.dataset.trsMounted = '1'
  ensureStyles()

  const steps = buildTrappingRainStackSteps(options)
  const autoplay = options.autoplay !== false

  const height = steps[0].height
  const n = height.length

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz trs'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  if (n < 3) {
    const w0 = 620
    const h0 = 120
    const s0 = mk('svg', { class: 'viz__svg trs__svg', viewBox: `0 0 ${w0} ${h0}`, role: 'img' })
    const t0 = mk('text', { class: 'trs-empty__text', x: w0 / 2, y: h0 / 2 })
    t0.textContent = `只有 ${n} 根柱子，围不出凹槽，接不住水`
    s0.appendChild(t0)
    stage.appendChild(s0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.trsMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  // ── 柱宽自适应 ───────────────────────────────────────────────────────────
  let barW = BAR_W_MAX
  const needW0 = n * barW + (n - 1) * BAR_GAP
  if (needW0 > AVAIL) {
    barW = Math.max(8, Math.floor((AVAIL - (n - 1) * BAR_GAP) / n))
  }
  const rowW = n * barW + (n - 1) * BAR_GAP
  const width = Math.max(660, LABEL_X * 2 + rowW)
  const ROW_LEFT = (width - rowW) / 2
  const barX = (i) => ROW_LEFT + i * (barW + BAR_GAP)
  const barCX = (i) => barX(i) + barW / 2

  const maxH = Math.max(...height)
  const UNIT_H = CHART_H / Math.max(maxH, 1)
  const yOf = (h) => BASE_Y - h * UNIT_H

  // ── 栈格宽度自适应 ───────────────────────────────────────────────────────
  let slotW = SLOT_W_MAX
  const needS0 = n * slotW + (n - 1) * SLOT_GAP
  if (needS0 > AVAIL) {
    slotW = Math.max(14, Math.floor((AVAIL - (n - 1) * SLOT_GAP) / n))
  }
  const slotW0 = n * slotW + (n - 1) * SLOT_GAP
  const SLOT_LEFT = (width - slotW0) / 2

  const BANNER_W = width - LABEL_X * 2
  const height_px = SLOT_TOP + SLOT_H + 20

  const svgRoot = mk('svg', {
    class: 'viz__svg trs__svg',
    viewBox: `0 0 ${width} ${height_px}`,
    role: 'img',
    'aria-label': '接雨水单调栈推演动画',
  })
  stage.appendChild(svgRoot)

  // 分层：水 → 柱子 → 强调层 → 栈与文字（见文件头坑 K）
  const waterLayer = mk('g', { class: 'trs-waters' })
  const barLayer = mk('g', { class: 'trs-bars' })
  const layerLayer = mk('g', { class: 'trs-layers' })
  const markLayer = mk('g', { class: 'trs-marks' })
  svgRoot.appendChild(waterLayer)
  svgRoot.appendChild(barLayer)
  svgRoot.appendChild(layerLayer)
  svgRoot.appendChild(markLayer)

  // ── 顶部小字 + 地面 ──────────────────────────────────────────────────────
  const note = mk('text', { class: 'trs-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = `横着切：栈内高度递减，遇到更高的柱子就结算一层`
  markLayer.appendChild(note)
  markLayer.appendChild(
    mk('line', {
      class: 'trs-ground',
      x1: ROW_LEFT - 10,
      y1: BASE_Y,
      x2: ROW_LEFT + rowW + 10,
      y2: BASE_Y,
    }),
  )

  // ── 柱子 + 水 ────────────────────────────────────────────────────────────
  const barEls = []
  for (let i = 0; i < n; i += 1) {
    const x = barX(i)
    const g = mk('g', { class: 'trs-bar' })
    g.appendChild(
      mk('rect', {
        class: 'trs-bar__box',
        x,
        y: yOf(height[i]),
        width: barW,
        height: Math.max(2, height[i] * UNIT_H),
        rx: 3,
      }),
    )
    const ht = mk('text', { class: 'trs-bar__h', x: barCX(i), y: BASE_Y - BAR_TEXT_DY })
    ht.textContent = String(height[i])
    g.appendChild(ht)
    barLayer.appendChild(g)

    const w = mk('rect', {
      class: 'trs-bar__water',
      x,
      y: yOf(height[i]),
      width: barW,
      height: 0,
      rx: 2,
    })
    waterLayer.appendChild(w)
    barEls.push({ g, w, id: i })
  }

  // 本帧新增的那一层（一个矩形，覆盖整个凹槽的宽度）
  const layerRect = mk('rect', { class: 'trs-layer', x: 0, y: 0, width: 0, height: 0, rx: 2 })
  layerLayer.appendChild(layerRect)

  // ── 下标 ─────────────────────────────────────────────────────────────────
  for (let i = 0; i < n; i += 1) {
    const t = mk('text', { class: 'trs-idx', x: barCX(i), y: IDX_Y })
    t.textContent = String(i)
    markLayer.appendChild(t)
  }

  // ── 扫描下标 i 的指针（柱子上方）──
  const scanTri = mk('path', { class: 'trs-scan__tri', d: 'M 0 0 L 0 0 L 0 0' })
  const scanText = mk('text', { class: 'trs-scan__text', x: 0, y: 0 })
  markLayer.appendChild(scanTri)
  markLayer.appendChild(scanText)

  // ── 栈 ───────────────────────────────────────────────────────────────────
  const stackTitle = mk('text', { class: 'trs-stack__title', x: LABEL_X, y: STACK_TITLE_Y })
  stackTitle.textContent = '栈（左 = 栈底，右 = 栈顶）· 只存下标'
  markLayer.appendChild(stackTitle)
  const stackEmpty = mk('text', {
    class: 'trs-stack__empty',
    x: SLOT_LEFT,
    y: SLOT_TOP + SLOT_H / 2,
  })
  stackEmpty.textContent = '（栈是空的）'
  markLayer.appendChild(stackEmpty)

  const slotEls = []
  for (let k = 0; k < n; k += 1) {
    const x = SLOT_LEFT + k * (slotW + SLOT_GAP)
    const g = mk('g', { class: 'trs-slot' })
    g.appendChild(mk('rect', { class: 'trs-slot__box', x, y: SLOT_TOP, width: slotW, height: SLOT_H, rx: 5 }))
    const idxT = mk('text', { class: 'trs-slot__idx', x: x + slotW / 2, y: SLOT_TOP + 13 })
    g.appendChild(idxT)
    const hT = mk('text', { class: 'trs-slot__h', x: x + slotW / 2, y: SLOT_TOP + 26 })
    g.appendChild(hT)
    markLayer.appendChild(g)
    slotEls.push({ g, idxT, hT })
  }

  // ── 横幅 ─────────────────────────────────────────────────────────────────
  markLayer.appendChild(
    mk('rect', {
      class: 'trs-banner__box',
      x: LABEL_X,
      y: BANNER_TOP,
      width: BANNER_W,
      height: BANNER_H,
      rx: 9,
    }),
  )
  const segMain = mk('text', {
    class: 'trs-banner__seg',
    x: LABEL_X + 18,
    y: BANNER_TOP + BANNER_H / 2,
  })
  markLayer.appendChild(segMain)
  const ansLabel = mk('text', {
    class: 'trs-banner__label',
    x: LABEL_X + BANNER_W - 68,
    y: BANNER_TOP + BANNER_H / 2,
  })
  ansLabel.textContent = '累计水量'
  markLayer.appendChild(ansLabel)
  const ansVal = mk('text', {
    class: 'trs-banner__ans',
    x: LABEL_X + BANNER_W - 18,
    y: BANNER_TOP + BANNER_H / 2,
  })
  ansVal.textContent = '0'
  markLayer.appendChild(ansVal)

  // ── 每帧重绘 ─────────────────────────────────────────────────────────────
  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const stack = step.stack ?? []
    const i = step.i
    const water = step.water
    const isDone = step.phase === 'done'

    // ── 水 + 柱子状态 ──
    for (const el of barEls) {
      const { g, w, id } = el
      const wh = water[id]
      if (wh > 0) {
        w.setAttribute('y', yOf(height[id] + wh))
        w.setAttribute('height', wh * UNIT_H)
        w.style.opacity = '1'
      } else {
        w.style.opacity = '0'
        w.setAttribute('height', 0)
      }
      const cls = ['trs-bar']
      if (!isDone && id === i) cls.push('is-scan')
      g.setAttribute('class', cls.join(' '))
    }

    // ── 本帧新增的那一层 ──
    if (!isDone && step.phase === 'settle' && step.leftBound !== null && step.layerH > 0) {
      const x1 = barX(step.leftBound + 1)
      const x2 = barX(step.rightBound - 1) + barW
      const yTop = yOf(step.level)
      const yBot = yOf(height[step.bottom])
      layerRect.setAttribute('x', x1)
      layerRect.setAttribute('y', yTop)
      layerRect.setAttribute('width', Math.max(2, x2 - x1))
      layerRect.setAttribute('height', Math.max(2, yBot - yTop))
      layerRect.style.opacity = '1'
    } else {
      layerRect.style.opacity = '0'
    }

    // ── 扫描指针 ──
    if (!isDone && i >= 0 && i < n) {
      const cx = barCX(i)
      const tip = yOf(height[i]) - 6
      scanTri.setAttribute('d', `M ${cx - 7} ${tip - 11} L ${cx + 7} ${tip - 11} L ${cx} ${tip} z`)
      scanText.setAttribute('x', cx)
      scanText.setAttribute('y', tip - SCAN_TRI_DY)
      scanText.textContent = `i=${i}`
      scanTri.style.opacity = '1'
      scanText.style.opacity = '1'
    } else {
      scanTri.style.opacity = '0'
      scanText.style.opacity = '0'
    }

    // ── 栈 ──
    stackEmpty.style.opacity = stack.length === 0 ? '1' : '0'
    slotEls.forEach((slot, k) => {
      const idx = stack[k]
      if (idx === undefined) {
        slot.g.style.opacity = '0'
        return
      }
      slot.g.style.opacity = '1'
      slot.idxT.textContent = String(idx)
      slot.hT.textContent = `h=${height[idx]}`
      // 栈顶那一格强调
      slot.g.setAttribute('class', k === stack.length - 1 ? 'trs-slot is-top' : 'trs-slot')
    })

    // ── 横幅 ──
    if (isDone) {
      segMain.textContent = `结束 · 共 ${step.total} 单位`
    } else if (step.phase === 'settle' && step.leftBound !== null) {
      segMain.textContent =
        `槽底 ${step.bottom}(h=${height[step.bottom]}) · 边界 [${step.leftBound}, ${step.rightBound}]` +
        ` · ${step.width}×${step.layerH} = +${step.gained}`
    } else if (step.phase === 'settle') {
      segMain.textContent = `弹出 ${step.bottom}，栈空 —— 没有左边界，这一层为 0`
    } else if (step.phase === 'push') {
      segMain.textContent = `压入 ${i}（h=${height[i]}）`
    } else {
      // init 帧：初版漏了这个分支，落进"结束"里，一开场就显示"共 0 单位"
      segMain.textContent = `等待开始 · 遇到更高的柱子就结算一层`
    }
    ansVal.textContent = String(step.total)

    renderRichText(desc, step.desc)
  }

  rootEl.appendChild(desc)
  const controls = createControls()
  rootEl.appendChild(controls.root)

  host.textContent = ''
  host.appendChild(rootEl)
  ensureChromeStyles()

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

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
      delete host.dataset.trsMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
