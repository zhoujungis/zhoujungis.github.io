/**
 * kadane.js — 「最大子数组和」(LeetCode 53) 推演动画的 SVG 渲染层。
 *
 * 逻辑全在 kadaneSteps.js 里，这里只负责把一帧快照画出来。要画五块：
 *
 *   1. 数组格子行  —— 每格一个值
 *   2. 当前色带    —— 格子上方一条带，覆盖 `nums[start..end]`（绿色）
 *   3. 被丢弃的段   —— restart 帧：上一段格子变灰虚线（这是"扔掉负资产"的动作）
 *   4. 最优区间线  —— 格子下方一条金色实线 + 标签 `[3..6] · 和 6`
 *   5. 横幅 + i 指针
 *
 * ⚠️ **两个视觉通道分开用**，避免状态打架（见 SKILL 坑 L / 坑 V）：
 *   - 格子**底色** = 是否在当前子数组里（绿）
 *   - 格子**边框** = 最优区间（金）/ 当前 i（橙）/ 被丢弃（灰虚线）
 *   也就是说"我现在跟踪哪一段"和"历史最好的是哪一段"分别走 fill 和 stroke，
 *   不会互相覆盖。
 *
 * ⚠️ 通用坑（系列里踩过，这里直接规避）：
 *   A. 所有 CSS 变量都带字面量兜底。
 *   K. 分层绘制：色带 → 格子 → 强调线 → 指针与标签。
 *   Q. 格宽按数组长度自适应。
 *   X. 横幅多段文字的 x 统一从左往右固定偏移。
 */

import { buildKadaneSteps } from './kadaneSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'kd-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const I_TAG_TOP = 142          // i 标签
const I_TRI_DY = 24            // 三角底端到格子上沿的余量
const BAND_TOP = 180           // 当前子数组色带
const BAND_H = 16

const CELL_Y = 202
const CELL_H = 52
const CELL_W_MAX = 58
const CELL_GAP = 6

const BEST_LINE_Y = 260        // 最优区间金线
const IDX_Y = 276
const BEST_TEXT_Y = 298

const LABEL_X = 26
const AVAIL = 604

const PLAY_MS = 1250

const STYLES = `
.kd {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.kd__svg { width: 100%; height: auto; display: block; }

.kd-note {
  fill: var(--kd-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 当前子数组色带 ───────────────────────────────────────────────────── */
.kd-band {
  fill: var(--kd-ok, #3f6b57);
  opacity: 0.85;
}
.kd-band__end { stroke: var(--kd-ok, #3f6b57); stroke-width: 2.5; }

/* ── 格子 ─────────────────────────────────────────────────────────────── */
.kd-cell__box {
  fill: var(--kd-fill, #ffffff);
  stroke: var(--kd-line, #c3c9c2);
  stroke-width: 1.5;
}
.kd-cell__value {
  fill: var(--kd-ink, #1f2a24);
  font-size: 18px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一（底色）：在当前子数组里 */
.kd-cell.is-inwin .kd-cell__box {
  fill: var(--kd-ok-fill, #eef5f1);
}
/* 通道二（边框）：最优区间内 —— 金色 */
.kd-cell.is-inbest .kd-cell__box {
  stroke: var(--kd-gold, #c2872f);
  stroke-width: 2.5;
}
/* 通道二（边框）：当前 i —— 橙色，优先级高于最优金色 */
.kd-cell.is-cur .kd-cell__box {
  stroke: var(--kd-hot, #a45f45);
  stroke-width: 3;
}
.kd-cell.is-cur .kd-cell__value { fill: var(--kd-hot, #a45f45); }
/* 被丢弃的那一段：整格灰虚线（放最后，整体覆盖） */
.kd-cell.is-dropped .kd-cell__box {
  fill: var(--kd-dim-fill, #f4f3ef);
  stroke: var(--kd-dim, #b9b9b3);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.kd-cell.is-dropped .kd-cell__value { fill: var(--kd-dim, #b9b9b3); }

/* ── 最优区间线 ───────────────────────────────────────────────────────── */
.kd-best__line { stroke: var(--kd-gold, #c2872f); stroke-width: 2.5; }
.kd-best__tick { stroke: var(--kd-gold, #c2872f); stroke-width: 2; }
.kd-best__text {
  fill: var(--kd-gold, #c2872f);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── i 指针 ───────────────────────────────────────────────────────────── */
.kd-i__tri { fill: var(--kd-hot, #a45f45); }
.kd-i__tag { fill: var(--kd-hot, #a45f45); }
.kd-i__text {
  fill: var(--kd-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.kd-idx {
  fill: var(--kd-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.kd-banner__box {
  fill: var(--kd-banner-fill, #f4f2ec);
  stroke: var(--kd-line, #c3c9c2);
  stroke-width: 1.5;
}
.kd-banner__seg {
  fill: var(--kd-muted, #657168);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kd-banner__best {
  fill: var(--kd-gold, #c2872f);
  font-size: 19px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.kd-empty__text {
  fill: var(--kd-muted, #657168);
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
 *   nums?: number[],
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 */
export function mountKadane(host, options = {}) {
  if (!host || host.dataset.kdMounted === '1') return { destroy() {} }
  host.dataset.kdMounted = '1'
  ensureStyles()

  const steps = buildKadaneSteps(options)
  const autoplay = options.autoplay !== false

  const nums = steps[0].nums
  const n = nums.length

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz kd'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  if (n === 0) {
    const w0 = 620
    const h0 = 120
    const s0 = mk('svg', { class: 'viz__svg kd__svg', viewBox: `0 0 ${w0} ${h0}`, role: 'img' })
    const t0 = mk('text', { class: 'kd-empty__text', x: w0 / 2, y: h0 / 2 })
    t0.textContent = '空数组 —— 凑不出子数组'
    s0.appendChild(t0)
    stage.appendChild(s0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.kdMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  // ── 格宽自适应 ───────────────────────────────────────────────────────────
  let cellW = CELL_W_MAX
  const needW0 = n * cellW + (n - 1) * CELL_GAP
  if (needW0 > AVAIL) {
    cellW = Math.max(14, Math.floor((AVAIL - (n - 1) * CELL_GAP) / n))
  }
  const rowW = n * cellW + (n - 1) * CELL_GAP
  const width = Math.max(660, LABEL_X * 2 + rowW)
  const ROW_LEFT = (width - rowW) / 2
  const cellX = (i) => ROW_LEFT + i * (cellW + CELL_GAP)
  const cellCX = (i) => cellX(i) + cellW / 2

  const CELL_BOTTOM = CELL_Y + CELL_H
  const BANNER_W = width - LABEL_X * 2
  const height = BEST_TEXT_Y + 22

  const svgRoot = mk('svg', {
    class: 'viz__svg kd__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '最大子数组和 Kadane 推演动画',
  })
  stage.appendChild(svgRoot)

  // 分层：色带 → 格子 → 最优线 → 指针与文字（见文件头坑 K）
  const bandLayer = mk('g', { class: 'kd-bands' })
  const cellLayer = mk('g', { class: 'kd-cells' })
  const bestLayer = mk('g', { class: 'kd-bests' })
  const markLayer = mk('g', { class: 'kd-marks' })
  svgRoot.appendChild(bandLayer)
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(bestLayer)
  svgRoot.appendChild(markLayer)

  // ── 顶部小字 + 横幅 ──────────────────────────────────────────────────────
  const note = mk('text', { class: 'kd-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = `cur = max(x, cur + x) —— 每步只问一句：带上前面那段，是赚了还是亏了`
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', {
      class: 'kd-banner__box',
      x: LABEL_X,
      y: BANNER_TOP,
      width: BANNER_W,
      height: BANNER_H,
      rx: 9,
    }),
  )
  // ⚠️ 三段文字的 x 统一从左往右（见坑 X），只有最右那段用 text-anchor: end
  const segCur = mk('text', {
    class: 'kd-banner__seg',
    x: LABEL_X + 18,
    y: BANNER_TOP + BANNER_H / 2,
  })
  const segBest = mk('text', {
    class: 'kd-banner__seg',
    x: LABEL_X + 170,
    y: BANNER_TOP + BANNER_H / 2,
  })
  const bestVal = mk('text', {
    class: 'kd-banner__best',
    x: LABEL_X + BANNER_W - 18,
    y: BANNER_TOP + BANNER_H / 2,
  })
  markLayer.appendChild(segCur)
  markLayer.appendChild(segBest)
  markLayer.appendChild(bestVal)

  // ── 当前子数组色带 ────────────────────────────────────────────────────────
  const band = mk('rect', { class: 'kd-band', x: 0, y: BAND_TOP, width: 0, height: BAND_H, rx: 4 })
  const bandL = mk('line', { class: 'kd-band__end', x1: 0, y1: BAND_TOP - 4, x2: 0, y2: BAND_TOP + BAND_H + 4 })
  const bandR = mk('line', { class: 'kd-band__end', x1: 0, y1: BAND_TOP - 4, x2: 0, y2: BAND_TOP + BAND_H + 4 })
  bandLayer.appendChild(band)
  bandLayer.appendChild(bandL)
  bandLayer.appendChild(bandR)

  // ── 格子 ──────────────────────────────────────────────────────────────────
  const cellEls = []
  for (let i = 0; i < n; i += 1) {
    const x = cellX(i)
    const g = mk('g', { class: 'kd-cell' })
    g.appendChild(mk('rect', { class: 'kd-cell__box', x, y: CELL_Y, width: cellW, height: CELL_H, rx: 6 }))
    const v = mk('text', { class: 'kd-cell__value', x: cellCX(i), y: CELL_Y + CELL_H / 2 })
    v.textContent = String(nums[i])
    g.appendChild(v)
    cellLayer.appendChild(g)
    cellEls.push({ g, id: i })
  }

  // ── 下标 ──────────────────────────────────────────────────────────────────
  for (let i = 0; i < n; i += 1) {
    const t = mk('text', { class: 'kd-idx', x: cellCX(i), y: IDX_Y })
    t.textContent = String(i)
    markLayer.appendChild(t)
  }

  // ── 最优区间线 + 标签 ─────────────────────────────────────────────────────
  const bestLine = mk('line', { class: 'kd-best__line', x1: 0, y1: BEST_LINE_Y, x2: 0, y2: BEST_LINE_Y })
  const bestTickL = mk('line', { class: 'kd-best__tick', x1: 0, y1: CELL_BOTTOM + 2, x2: 0, y2: BEST_LINE_Y })
  const bestTickR = mk('line', { class: 'kd-best__tick', x1: 0, y1: CELL_BOTTOM + 2, x2: 0, y2: BEST_LINE_Y })
  const bestText = mk('text', { class: 'kd-best__text', x: 0, y: BEST_TEXT_Y })
  bestLayer.appendChild(bestLine)
  bestLayer.appendChild(bestTickL)
  bestLayer.appendChild(bestTickR)
  bestLayer.appendChild(bestText)

  // ── i 指针 ────────────────────────────────────────────────────────────────
  const iTri = mk('path', { class: 'kd-i__tri', d: 'M 0 0 L 0 0 L 0 0' })
  const iTag = mk('rect', { class: 'kd-i__tag', x: 0, y: I_TAG_TOP, width: 54, height: 22, rx: 6 })
  const iText = mk('text', { class: 'kd-i__text', x: 0, y: I_TAG_TOP + 11 })
  markLayer.appendChild(iTri)
  markLayer.appendChild(iTag)
  markLayer.appendChild(iText)

  // ── 每帧重绘 ─────────────────────────────────────────────────────────────
  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const i = step.i
    const isDone = step.phase === 'done'
    // ⚠️ 收尾帧保留语义字段的真实值，但画面只强调"最优区间"，不再画 i 指针
    // 与"当前这段"的色带 —— 见 SKILL 的收尾帧约定。

    const inWin = new Set()
    for (let k = step.start; k <= step.end; k += 1) inWin.add(k)
    const inBest = new Set()
    for (let k = step.bestStart; k <= step.bestEnd; k += 1) inBest.add(k)
    const dropped = new Set()
    if (!isDone && step.dropped) {
      for (let k = step.dropped.from; k <= step.dropped.to; k += 1) dropped.add(k)
    }

    for (const el of cellEls) {
      const { g, id } = el
      // 互斥：dropped 整格覆盖；其余用 fill（当前段）与 stroke（最优 / i）两条通道
      const cls = ['kd-cell']
      if (dropped.has(id)) {
        cls.push('is-dropped')
      } else {
        if (inWin.has(id)) cls.push('is-inwin')
        if (inBest.has(id)) cls.push('is-inbest')
        if (!isDone && id === i) cls.push('is-cur')
      }
      g.setAttribute('class', cls.join(' '))
    }

    // ── 当前子数组色带 ──
    if (isDone || step.end < step.start) {
      band.style.opacity = '0'
      bandL.style.opacity = '0'
      bandR.style.opacity = '0'
    } else {
      const x1 = cellX(step.start)
      const x2 = cellX(step.end) + cellW
      band.setAttribute('x', x1)
      band.setAttribute('width', Math.max(2, x2 - x1))
      band.style.opacity = '1'
      bandL.setAttribute('x1', x1)
      bandL.setAttribute('x2', x1)
      bandR.setAttribute('x1', x2)
      bandR.setAttribute('x2', x2)
      bandL.style.opacity = '1'
      bandR.style.opacity = '1'
    }

    // ── 最优区间线 ──
    const bx1 = cellX(step.bestStart)
    const bx2 = cellX(step.bestEnd) + cellW
    bestTickL.setAttribute('x1', bx1)
    bestTickL.setAttribute('x2', bx1)
    bestTickR.setAttribute('x1', bx2)
    bestTickR.setAttribute('x2', bx2)
    bestLine.setAttribute('x1', bx1)
    bestLine.setAttribute('x2', bx2)
    bestText.setAttribute('x', (bx1 + bx2) / 2)
    bestText.textContent = `最优 nums[${step.bestStart}..${step.bestEnd}] · 和 ${step.best}`

    // ── i 指针 ──
    if (!isDone && i >= 0 && i < n) {
      const cx = cellCX(i)
      const tip = CELL_Y - 6
      iTri.setAttribute('d', `M ${cx - 7} ${tip - 11} L ${cx + 7} ${tip - 11} L ${cx} ${tip} z`)
      iTri.style.opacity = '1'
      iTag.setAttribute('x', cx - 27)
      iText.setAttribute('x', cx)
      iText.textContent = `i=${i}`
      iTag.style.opacity = '1'
      iText.style.opacity = '1'
    } else {
      iTri.style.opacity = '0'
      iTag.style.opacity = '0'
      iText.style.opacity = '0'
    }

    // ── 横幅 ──
    segCur.textContent = `cur = ${step.cur}（当前这段）`
    segBest.textContent = `best = ${step.best}`
    bestVal.textContent = isDone ? `答案 ${step.best}` : `最优 ${step.best}`

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
      delete host.dataset.kdMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
