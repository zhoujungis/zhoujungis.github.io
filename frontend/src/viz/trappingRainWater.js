/**
 * trappingRainWater.js — 「接雨水」(LeetCode 42) **双指针解法** 推演动画的 SVG 渲染层。
 *
 * 逻辑全在 trappingRainWaterSteps.js 里，这里只负责把一帧快照画出来。要画四块：
 *
 *   1. 柱状图    —— 每根柱子画成实体矩形（浅米色），它头顶的水画成蓝色一层；
 *                    高度值统一贴在柱子**内部靠底部**，保证所有数字在同一水平线上
 *   2. 本帧强调   —— 刚结算的那一格金色粗边 + 外环
 *   3. 指针      —— `L` / `R` 两根，标签放在基线下方**两行**（它们会越靠越近）
 *   4. 横幅      —— 左：`leftMax` / `rightMax`；右：累计水量
 *
 * ⚠️ 通用坑（系列里踩过，这里直接规避）：
 *   A. 所有 CSS 变量都带字面量兜底 —— viz-shot.mjs 单独序列化 SVG 时，
 *      外层 div 上的变量解析不了，不带兜底整条样式失效。
 *   K. 分层绘制：水 → 柱子 → 强调层 → 指针与标签，别让后画的色块盖住先画的文字。
 *   L. 「指针指向的位置」和「被强调的答案」是两种状态，样式必须分开。
 *   W. 两根指针越靠越近时同一行会相撞 → 垂直错开成两行，这是最省事的解法。
 *   Q. 柱宽按数组长度自适应，长数组要缩窄而不是溢出画布。
 */

import { buildTrappingRainWaterSteps } from './trappingRainWaterSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'trw-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NOTE_Y = 54             // 顶部小字
const BANNER_TOP = 88
const BANNER_H = 46

const CHART_H = 158           // 柱状图区总高：最高那根柱子正好占满
const BASE_Y = 320            // 地面（基线）
const BAR_W_MAX = 46
const BAR_GAP = 3
const BAR_TEXT_DY = 14        // 高度值贴在柱子内部靠底部

const IDX_Y = 336             // 下标
const L_TAG_TOP = 352         // L 标签（第一行）
const R_TAG_TOP = 380         // R 标签（第二行）—— 和 L 错开，见坑 W
const TAG_H = 22
// ⚠️ 宽度按最长文案反推：`L=R=7` 有 5 个字符，12.5px 等宽约 38px + 左右各 8px = 54
const TAG_W = 54

const LABEL_X = 26
const AVAIL = 604             // 柱状图可用的最大宽度

const PLAY_MS = 1250

const STYLES = `
.trw {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.trw__svg { width: 100%; height: auto; display: block; }

/* ── 顶部小字 ─────────────────────────────────────────────────────────── */
.trw-note {
  fill: var(--trw-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 地面 ─────────────────────────────────────────────────────────────── */
.trw-ground { stroke: var(--trw-line-strong, #9aa39c); stroke-width: 2; }

/* ── 柱子 ─────────────────────────────────────────────────────────────── */
.trw-bar__box {
  fill: var(--trw-bar-fill, #efece4);
  stroke: var(--trw-line, #c3c9c2);
  stroke-width: 1.5;
}
.trw-bar__h {
  fill: var(--trw-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 水：画在柱子头顶 */
.trw-bar__water {
  fill: var(--trw-water, #7fa8c9);
  stroke: var(--trw-water-line, #4a7fa8);
  stroke-width: 1.5;
}
/* 本帧刚结算的那一格（金色粗边 + 外环）—— 和指针状态分开，见坑 L */
.trw-bar.is-cur .trw-bar__box {
  fill: var(--trw-gold-fill, #fdf6e8);
  stroke: var(--trw-gold, #c2872f);
  stroke-width: 3;
}
.trw-bar.is-cur .trw-bar__h { fill: var(--trw-gold, #c2872f); }
.trw-bar__ring {
  fill: none;
  stroke: var(--trw-gold, #c2872f);
  stroke-width: 2;
  opacity: 0;
}
.trw-bar.is-cur .trw-bar__ring { opacity: 1; }

/* ── 指针 ─────────────────────────────────────────────────────────────── */
.trw-pin__tag { fill: var(--trw-ok, #3f6b57); }
.trw-pin__tag.is-r { fill: var(--trw-cool, #4a5f8a); }
.trw-pin__text {
  fill: var(--trw-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trw-pin__tick { stroke: var(--trw-ok, #3f6b57); stroke-width: 2; }
.trw-pin__tick.is-r { stroke: var(--trw-cool, #4a5f8a); }

/* ── 下标 ─────────────────────────────────────────────────────────────── */
.trw-idx {
  fill: var(--trw-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.trw-banner__box {
  fill: var(--trw-banner-fill, #f4f2ec);
  stroke: var(--trw-line, #c3c9c2);
  stroke-width: 1.5;
}
.trw-banner__seg {
  fill: var(--trw-muted, #657168);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trw-banner__label {
  fill: var(--trw-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.trw-banner__ans {
  fill: var(--trw-water-line, #4a7fa8);
  font-size: 21px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.trw-empty__text {
  fill: var(--trw-muted, #657168);
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
export function mountTrappingRainWater(host, options = {}) {
  if (!host || host.dataset.trwMounted === '1') return { destroy() {} }
  host.dataset.trwMounted = '1'
  ensureStyles()

  const steps = buildTrappingRainWaterSteps(options)
  const autoplay = options.autoplay !== false

  const height = steps[0].height
  const n = height.length

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz trw'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  // ── 少于 3 根柱子：接不住水 ──────────────────────────────────────────────
  if (n < 3) {
    const w0 = 620
    const h0 = 120
    const s0 = mk('svg', { class: 'viz__svg trw__svg', viewBox: `0 0 ${w0} ${h0}`, role: 'img' })
    const t0 = mk('text', { class: 'trw-empty__text', x: w0 / 2, y: h0 / 2 })
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
        delete host.dataset.trwMounted
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

  // 高度单位按最高柱反推，让最高的柱子正好填满 CHART_H
  const maxH = Math.max(...height)
  const UNIT_H = CHART_H / Math.max(maxH, 1)
  const yOf = (h) => BASE_Y - h * UNIT_H

  const BANNER_W = width - LABEL_X * 2
  const height_px = R_TAG_TOP + TAG_H + 20

  const svgRoot = mk('svg', {
    class: 'viz__svg trw__svg',
    viewBox: `0 0 ${width} ${height_px}`,
    role: 'img',
    'aria-label': '接雨水双指针推演动画',
  })
  stage.appendChild(svgRoot)

  // 分层：水 → 柱子 → 强调环 → 指针与文字（见文件头坑 K）
  const waterLayer = mk('g', { class: 'trw-waters' })
  const barLayer = mk('g', { class: 'trw-bars' })
  const markLayer = mk('g', { class: 'trw-marks' })
  svgRoot.appendChild(waterLayer)
  svgRoot.appendChild(barLayer)
  svgRoot.appendChild(markLayer)

  // ── 顶部小字 + 地面 ──────────────────────────────────────────────────────
  const note = mk('text', { class: 'trw-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = `每格的水 = max(0, min(左最高, 右最高) - 自身高度) · 谁矮先结算谁`
  markLayer.appendChild(note)
  const ground = mk('line', {
    class: 'trw-ground',
    x1: ROW_LEFT - 10,
    y1: BASE_Y,
    x2: ROW_LEFT + rowW + 10,
    y2: BASE_Y,
  })
  markLayer.appendChild(ground)

  // ── 柱子 + 水 ────────────────────────────────────────────────────────────
  const barEls = []
  for (let i = 0; i < n; i += 1) {
    const x = barX(i)
    const g = mk('g', { class: 'trw-bar' })
    g.appendChild(
      mk('rect', {
        class: 'trw-bar__ring',
        x: x - 4,
        y: yOf(height[i]) - 4,
        width: barW + 8,
        height: Math.max(6, height[i] * UNIT_H + 8),
        rx: 5,
      }),
    )
    g.appendChild(
      mk('rect', {
        class: 'trw-bar__box',
        x,
        y: yOf(height[i]),
        width: barW,
        height: Math.max(2, height[i] * UNIT_H),
        rx: 3,
      }),
    )
    const ht = mk('text', { class: 'trw-bar__h', x: barCX(i), y: BASE_Y - BAR_TEXT_DY })
    ht.textContent = String(height[i])
    g.appendChild(ht)
    barLayer.appendChild(g)

    // 水画在柱子头顶（刚结算那格会被高亮，水层在下、柱层在上不会遮住）
    const w = mk('rect', {
      class: 'trw-bar__water',
      x,
      y: yOf(height[i]),
      width: barW,
      height: 0,
      rx: 2,
    })
    waterLayer.appendChild(w)
    barEls.push({ g, w, id: i })
  }

  // ── 下标 ─────────────────────────────────────────────────────────────────
  for (let i = 0; i < n; i += 1) {
    const t = mk('text', { class: 'trw-idx', x: barCX(i), y: IDX_Y })
    t.textContent = String(i)
    markLayer.appendChild(t)
  }

  /** 画一个指针标签 + 引线。 */
  function makePin(cls) {
    const tick = mk('line', { class: `trw-pin__tick ${cls}`, x1: 0, y1: 0, x2: 0, y2: 0 })
    const tag = mk('rect', { class: `trw-pin__tag ${cls}`, x: 0, y: 0, width: TAG_W, height: TAG_H, rx: 6 })
    const text = mk('text', { class: 'trw-pin__text', x: 0, y: 0 })
    markLayer.appendChild(tick)
    markLayer.appendChild(tag)
    markLayer.appendChild(text)
    return { tick, tag, text }
  }

  const lPin = makePin('is-l')
  const rPin = makePin('is-r')

  // ── 横幅 ─────────────────────────────────────────────────────────────────
  const bannerBox = mk('rect', {
    class: 'trw-banner__box',
    x: LABEL_X,
    y: BANNER_TOP,
    width: BANNER_W,
    height: BANNER_H,
    rx: 9,
  })
  markLayer.appendChild(bannerBox)
  const segL = mk('text', { class: 'trw-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  // ⚠️ x 用固定偏移而不是"从右往左数"—— 初版写在 BANNER_W - 150 处，
  // `rightMax = 0` 这串文字会和右边的「累计水量」标签直接重叠。
  const segR = mk('text', {
    class: 'trw-banner__seg',
    x: LABEL_X + 170,
    y: BANNER_TOP + BANNER_H / 2,
  })
  markLayer.appendChild(segL)
  markLayer.appendChild(segR)
  const ansLabel = mk('text', {
    class: 'trw-banner__label',
    x: LABEL_X + BANNER_W - 68,
    y: BANNER_TOP + BANNER_H / 2,
  })
  ansLabel.textContent = '累计水量'
  markLayer.appendChild(ansLabel)
  const ansVal = mk('text', {
    class: 'trw-banner__ans',
    x: LABEL_X + BANNER_W - 18,
    y: BANNER_TOP + BANNER_H / 2,
  })
  ansVal.textContent = '0'
  markLayer.appendChild(ansVal)

  // ── 每帧重绘 ─────────────────────────────────────────────────────────────
  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const l = step.l
    const r = step.r
    const curIdx = step.idx
    const water = step.water
    const isDone = step.phase === 'done'
    // ⚠️ 收尾帧保持语义字段真实值（l / r 就是指针相遇的位置），
    // 但画面只保留"已经接住的水"，不再强调指针 —— 见 SKILL 的收尾帧约定。

    // ── 水 + 柱子状态 ──
    for (const el of barEls) {
      const { g, w, id } = el
      const wh = water[id]
      if (wh > 0) {
        const top = yOf(height[id] + wh)
        w.setAttribute('y', top)
        w.setAttribute('height', wh * UNIT_H)
        w.style.opacity = '1'
      } else {
        w.style.opacity = '0'
        w.setAttribute('height', 0)
      }
      const cls = ['trw-bar']
      if (!isDone && id === curIdx) cls.push('is-cur')
      g.setAttribute('class', cls.join(' '))
    }

    // ── 指针 ──
    const pin = (p, idx, top, label) => {
      if (isDone || idx < 0 || idx >= n) {
        p.tick.style.opacity = '0'
        p.tag.style.opacity = '0'
        p.text.style.opacity = '0'
        return
      }
      const cx = barCX(idx)
      p.tick.setAttribute('x1', cx)
      p.tick.setAttribute('x2', cx)
      p.tick.setAttribute('y1', BASE_Y + 4)
      p.tick.setAttribute('y2', top - 3)
      p.tick.style.opacity = '1'
      p.tag.setAttribute('x', cx - TAG_W / 2)
      p.tag.setAttribute('y', top)
      p.text.setAttribute('x', cx)
      p.text.setAttribute('y', top + TAG_H / 2)
      // l == r 时（指针相遇）合并成一个标签，否则两个会完全重叠 —— 见坑 W
      p.text.textContent = l === r ? `${label === 'L' ? 'L=R' : 'R'}=${idx}` : `${label}=${idx}`
      p.tag.style.opacity = '1'
      p.text.style.opacity = '1'
    }
    if (l === r) {
      pin(lPin, l, L_TAG_TOP, 'L')
      rPin.tick.style.opacity = '0'
      rPin.tag.style.opacity = '0'
      rPin.text.style.opacity = '0'
    } else {
      pin(lPin, l, L_TAG_TOP, 'L')
      pin(rPin, r, R_TAG_TOP, 'R')
    }

    // ── 横幅 ──
    segL.textContent = `leftMax = ${step.leftMax}`
    segR.textContent = `rightMax = ${step.rightMax}`
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
      delete host.dataset.trwMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
