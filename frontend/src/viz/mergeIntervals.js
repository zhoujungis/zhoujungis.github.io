/**
 * mergeIntervals.js — 「合并区间」(LeetCode 56) 推演动画的 SVG 渲染层。
 *
 * 逻辑全在 mergeIntervalsSteps.js 里，这里只负责把一帧快照画出来。要画五块：
 *
 *   1. 数轴刻度     —— 顶部一条带刻度的横轴，值 → x 的映射全程一致
 *   2. 输入区       —— 排序后的区间，一行一条横条（行首标 [s,e]），当前行橙色描边
 *   3. 结果区       —— 同一根数轴下方：已收的段绿色实条 + 当前合并区间金色条
 *   4. 当前合并条   —— extend 帧肉眼可见地"延伸"，这是本动画的灵魂动作
 *   5. 横幅         —— 当前区间 / 比较 / 结果段数
 *
 * ⚠️ 两条视觉通道（SKILL 坑 V）：条的 fill = 归属（输入白 / 已收绿 / 当前金），
 *    stroke = 本帧强调（当前处理行橙粗）。数轴映射统一，三区共享。
 *
 * ⚠️ 通用坑：A（CSS 变量字面量兜底）/ X（横幅 x 从左往右）/ 红线 4（ASCII 标签）。
 */

import { buildMergeIntervalsSteps } from './mergeIntervalsSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'mi-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const AXIS_Y = 152
const PLOT_LABEL_W = 92 // 行首标签区宽度
const ROW_H = 34
const ROW_GAP = 8

const RESULT_GAP = 34 // 输入区与结果区标签的间距
const RESULT_ROW_H = 40

const LABEL_X = 26
const AVAIL = 604

const PLAY_MS = 1250

const STYLES = `
.mi {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.mi__svg { width: 100%; height: auto; display: block; }

.mi-note {
  fill: var(--mi-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.mi-banner__box {
  fill: var(--mi-banner, #f4f3ef);
  stroke: var(--mi-line, #c3c9c2);
  stroke-width: 1.5;
}
.mi-banner__seg {
  fill: var(--mi-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mi-banner__ans {
  fill: var(--mi-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 数轴 ─────────────────────────────────────────────────────────────── */
.mi-axis__line { stroke: var(--mi-line, #c3c9c2); stroke-width: 1.5; }
.mi-axis__tick { stroke: var(--mi-line, #c3c9c2); stroke-width: 1; }
.mi-axis__num {
  fill: var(--mi-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 区间条 ───────────────────────────────────────────────────────────── */
.mi-bar { rx: 8; }
.mi-bar__box {
  fill: var(--mi-fill, #ffffff);
  stroke: var(--mi-line, #c3c9c2);
  stroke-width: 1.5;
}
.mi-bar__text {
  fill: var(--mi-ink, #1f2a24);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mi-bar__label {
  fill: var(--mi-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一（底色）：已收进结果的段 */
.mi-bar.is-done .mi-bar__box {
  fill: var(--mi-ok-fill, #eef5f1);
  stroke: var(--mi-ok, #3f6b57);
  stroke-width: 2;
}
.mi-bar.is-done .mi-bar__text { fill: var(--mi-ok, #3f6b57); }
/* 通道一（底色）：当前合并区间 */
.mi-bar.is-cur .mi-bar__box {
  fill: var(--mi-gold-fill, #fdf3e3);
}
/* 通道二（边框）：本帧正在处理的行 */
.mi-bar.is-active .mi-bar__box {
  stroke: var(--mi-hot, #a45f45);
  stroke-width: 3;
}

/* ── 结果区 ───────────────────────────────────────────────────────────── */
.mi-result__label {
  fill: var(--mi-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mi-result__cur {
  fill: var(--mi-gold-fill, #fdf3e3);
  stroke: var(--mi-gold, #c2872f);
  stroke-width: 2.5;
}
.mi-result__seg {
  fill: var(--mi-ok, #3f6b57);
  opacity: 0.9;
}

.mi-empty__text {
  fill: var(--mi-muted, #657168);
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
 * @param {{ intervals?: number[][], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountMergeIntervals(host, options = {}) {
  if (!host || host.dataset.miMounted === '1') return { destroy() {} }
  host.dataset.miMounted = '1'
  ensureStyles()

  const steps = buildMergeIntervalsSteps(options)
  const autoplay = options.autoplay !== false

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz mi'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  const n0 = steps[0].intervals.length
  if (n0 === 0) {
    const w0 = 620
    const h0 = 120
    const s0 = mk('svg', { class: 'viz__svg mi__svg', viewBox: `0 0 ${w0} ${h0}`, role: 'img' })
    const t0 = mk('text', { class: 'mi-empty__text', x: w0 / 2, y: h0 / 2 })
    t0.textContent = '空输入 —— 直接返回空数组'
    s0.appendChild(t0)
    stage.appendChild(s0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    ensureChromeStyles()
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.miMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  // ── 数轴映射（全程一致）───────────────────────────────────────────────────
  const allVals = steps[0].sorted.length ? steps[0].sorted.flat() : steps[0].intervals.flat()
  const maxV = Math.max(...allVals, 1)
  const minV = Math.min(...allVals, 0)
  const width = 660
  const PLOT_LEFT = LABEL_X + PLOT_LABEL_W
  const PLOT_W = width - PLOT_LEFT - LABEL_X
  const xOf = (v) => PLOT_LEFT + ((v - minV) / (maxV - minV || 1)) * PLOT_W

  const nRows = Math.max(steps[0].sorted.length, steps[0].intervals.length, 1)
  const INPUT_H = nRows * (ROW_H + ROW_GAP) + ROW_GAP
  const RESULT_LABEL_Y = AXIS_Y + 24 + INPUT_H + RESULT_GAP
  const RESULT_Y = RESULT_LABEL_Y + 16
  const height = RESULT_Y + RESULT_ROW_H + 40

  const svgRoot = mk('svg', {
    class: 'viz__svg mi__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '合并区间 推演动画',
  })
  stage.appendChild(svgRoot)

  const barLayer = mk('g', { class: 'mi-bars' })
  const markLayer = mk('g', { class: 'mi-marks' })
  svgRoot.appendChild(barLayer)
  svgRoot.appendChild(markLayer)

  // ── 顶部小字 + 横幅 ──────────────────────────────────────────────────────
  const note = mk('text', { class: 'mi-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = '按左端点排序后，每个区间只和「当前合并区间」比一次'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', {
      class: 'mi-banner__box',
      x: LABEL_X,
      y: BANNER_TOP,
      width: width - LABEL_X * 2,
      height: BANNER_H,
      rx: 9,
    }),
  )
  const segCur = mk('text', { class: 'mi-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'mi-banner__seg', x: LABEL_X + 240, y: BANNER_TOP + BANNER_H / 2 })
  const ansVal = mk('text', {
    class: 'mi-banner__ans',
    x: width - LABEL_X - 18,
    y: BANNER_TOP + BANNER_H / 2,
  })
  markLayer.appendChild(segCur)
  markLayer.appendChild(segAct)
  markLayer.appendChild(ansVal)

  // ── 数轴 ─────────────────────────────────────────────────────────────────
  const axisLine = mk('line', { class: 'mi-axis__line', x1: PLOT_LEFT, y1: AXIS_Y, x2: PLOT_LEFT + PLOT_W, y2: AXIS_Y })
  markLayer.appendChild(axisLine)
  const tickStep = maxV - minV <= 12 ? 1 : maxV - minV <= 30 ? 2 : 5
  for (let v = Math.ceil(minV); v <= maxV; v += tickStep) {
    const x = xOf(v)
    markLayer.appendChild(mk('line', { class: 'mi-axis__tick', x1: x, y1: AXIS_Y - 4, x2: x, y2: AXIS_Y + 4 }))
    const t = mk('text', { class: 'mi-axis__num', x, y: AXIS_Y - 14 })
    t.textContent = String(v)
    markLayer.appendChild(t)
  }

  // ── 输入区（排序后，每行一条）────────────────────────────────────────────
  const barEls = []
  for (let i = 0; i < nRows; i += 1) {
    const y = AXIS_Y + 24 + i * (ROW_H + ROW_GAP)
    const g = mk('g', { class: 'mi-bar' })
    const label = mk('text', { class: 'mi-bar__label', x: LABEL_X, y: y + ROW_H / 2 })
    g.appendChild(label)
    const box = mk('rect', { class: 'mi-bar__box', x: 0, y, width: 10, height: ROW_H, rx: 8 })
    g.appendChild(box)
    const text = mk('text', { class: 'mi-bar__text', x: 0, y: y + ROW_H / 2 })
    g.appendChild(text)
    barLayer.appendChild(g)
    barEls.push({ g, label, box, text, y })
  }

  // ── 结果区 ───────────────────────────────────────────────────────────────
  const resultLabel = mk('text', { class: 'mi-result__label', x: LABEL_X, y: RESULT_LABEL_Y })
  markLayer.appendChild(resultLabel)
  const curBox = mk('rect', { class: 'mi-result__cur', x: 0, y: RESULT_Y, width: 0, height: RESULT_ROW_H, rx: 8 })
  markLayer.appendChild(curBox)
  const segBoxes = []
  for (let i = 0; i < nRows; i += 1) {
    const box = mk('rect', { class: 'mi-result__seg', x: 0, y: RESULT_Y, width: 0, height: RESULT_ROW_H, rx: 8 })
    markLayer.appendChild(box)
    segBoxes.push(box)
  }

  // ── 每帧重绘 ─────────────────────────────────────────────────────────────
  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const { sorted, result } = step
    const phase = step.phase
    const isDone = phase === 'done'
    const curOpen = step.curStart !== null && !isDone

    // 输入区：init 帧画原始乱序（与 sort 后对比），其余帧画排序结果
    const rows = phase === 'init' ? step.intervals : sorted
    barEls.forEach((el, i) => {
      const iv = rows[i]
      if (!iv) {
        el.g.style.opacity = '0'
        return
      }
      el.g.style.opacity = '1'
      const [s, e] = iv
      el.label.textContent = `[${s},${e}]`
      const x1 = xOf(s)
      const x2 = xOf(e)
      el.box.setAttribute('x', x1)
      el.box.setAttribute('width', Math.max(8, x2 - x1))
      el.text.setAttribute('x', (x1 + x2) / 2)
      el.text.textContent = `${s} - ${e}`
      const cls = ['mi-bar']
      // 已处理的行：它的段已被 cur 或 result 罩住 → 绿
      const handled = i <= (step.idx ?? -1)
      if (handled && !isDone) cls.push('is-done')
      if (i === step.idx && !isDone) cls.push('is-active')
      el.g.setAttribute('class', cls.join(' '))
    })

    // 结果区：已收的段（绿）+ 当前合并区间（金，随 extend 延伸）
    segBoxes.forEach((box, i) => {
      const seg = result[i]
      if (!seg) {
        box.style.opacity = '0'
        return
      }
      box.style.opacity = '1'
      const x1 = xOf(seg[0])
      const x2 = xOf(seg[1])
      box.setAttribute('x', x1)
      box.setAttribute('width', Math.max(6, x2 - x1))
    })

    resultLabel.textContent = `结果（已收 ${result.length} 段）`

    if (curOpen) {
      const x1 = xOf(step.curStart)
      const x2 = xOf(step.curEnd)
      curBox.setAttribute('x', x1)
      curBox.setAttribute('width', Math.max(6, x2 - x1))
      curBox.style.opacity = '1'
    } else {
      curBox.style.opacity = '0'
    }

    // 横幅
    segCur.textContent = curOpen ? `当前 [${step.curStart}, ${step.curEnd}]` : '当前 -'
    if (phase === 'init') {
      segAct.textContent = '先按左端点排序'
    } else if (phase === 'sort') {
      segAct.textContent = '排序完成，开始扫描'
    } else if (phase === 'start') {
      segAct.textContent = '第一段直接入座'
    } else if (phase === 'extend') {
      segAct.textContent = `${step.sorted[step.idx][0]} <= ${step.curEnd} → 延伸（max 保底）`
    } else if (phase === 'close') {
      segAct.textContent = `${step.sorted[step.idx][0]} > ${step.curEnd} → 收段、新开`
    } else {
      segAct.textContent = '最后一段收进结果'
    }
    ansVal.textContent = isDone ? `${step.result.length} 段` : `结果 ${step.result.length} 段`

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
      delete host.dataset.miMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
