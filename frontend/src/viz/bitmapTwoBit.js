/**
 * bitmapTwoBit.js — 2-bit 位图的 SVG 渲染层：去重 + 数重复 + 找唯一。
 *
 * 对应文章里的「动画二」：占位符 algo-viz--bitmap2bit。
 * 视觉分四段：
 *   1. 顶部横幅：阶段 / 动作 / 关键值
 *   2. 状态阵列：16 个数一格，格内显示 2-bit 状态（00/01/10/11），
 *      当前数高亮，转移瞬间烫金
 *   3. 转移表：四行 from → to（00→01 新数 / 01→10 二见 / 10→10 保持 / 11→10 兜底）
 *   4. 三集合：出现过 / 重复了 / 只一次，各一行 chips
 *
 * 通用坑：A（CSS 变量字面量兜底）/ K（标记层后挂）/ X（横幅多段固定偏移）。
 */

import { buildBitmapTwoBitSteps, STATE_LABEL } from './bitmapTwoBitSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'bm2-styles'
const PLAY_MS = 1000

const STYLES = `
.bm2 { display: flex; flex-direction: column; gap: 14px; }
.bm2__svg { width: 100%; height: auto; display: block; }

.bm2-note {
  fill: var(--bm2-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.bm2-banner__box {
  fill: var(--bm2-banner, #f4f3ef);
  stroke: var(--bm2-line, #c3c9c2);
  stroke-width: 1.5;
}
.bm2-banner__seg {
  fill: var(--bm2-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.bm2-banner__val {
  fill: var(--bm2-gold, #c2872f);
  font-size: 16px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm2-seclabel {
  fill: var(--bm2-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 状态阵列 ---- */
.bm2-cell__box {
  fill: var(--bm2-fill, #ffffff);
  stroke: var(--bm2-line, #c3c9c2);
  stroke-width: 1.3;
}
.bm2-cell__v {
  fill: var(--bm2-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
.bm2-cell__st {
  fill: var(--bm2-dim, #9aa39c);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm2-cell.is-once .bm2-cell__box { stroke: var(--bm2-green, #3f6b57); }
.bm2-cell.is-once .bm2-cell__st { fill: var(--bm2-green, #3f6b57); }
.bm2-cell.is-many .bm2-cell__box {
  fill: var(--bm2-gold-fill, #fdf3e3);
  stroke: var(--bm2-gold, #c2872f);
  stroke-width: 2;
}
.bm2-cell.is-many .bm2-cell__st { fill: var(--bm2-gold, #c2872f); }
.bm2-cell.is-cur .bm2-cell__box {
  stroke: var(--bm2-cur, #a45f45);
  stroke-width: 3;
}
.bm2-cell.is-cur .bm2-cell__v { fill: var(--bm2-cur, #a45f45); font-weight: 700; }
.bm2-cell.is-flash .bm2-cell__box { stroke: var(--bm2-cur, #a45f45); stroke-width: 3; }
.bm2-cell.is-reserved .bm2-cell__st { fill: #7a5aa8; }

/* ---- 转移表 ---- */
.bm2-tr__box {
  fill: var(--bm2-fill, #ffffff);
  stroke: var(--bm2-line, #c3c9c2);
  stroke-width: 1.2;
}
.bm2-tr__cond {
  fill: var(--bm2-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm2-tr__desc {
  fill: var(--bm2-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.bm2-tr__arrow {
  fill: var(--bm2-dim, #9aa39c);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.bm2-tr.is-on .bm2-tr__box {
  fill: var(--bm2-gold-fill, #fdf3e3);
  stroke: var(--bm2-gold, #c2872f);
  stroke-width: 2.2;
}
.bm2-tr.is-on .bm2-tr__cond { fill: var(--bm2-gold, #c2872f); }

/* ---- 三集合 ---- */
.bm2-set__label {
  fill: var(--bm2-muted, #657168);
  font-size: 12px;
  font-anchor: start;
  dominant-baseline: central;
}
.bm2-pill__box {
  fill: var(--bm2-fill, #ffffff);
  stroke: var(--bm2-line, #c3c9c2);
  stroke-width: 1.3;
}
.bm2-pill__val {
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm2-pill.is-green .bm2-pill__box { stroke: var(--bm2-green, #3f6b57); }
.bm2-pill.is-green .bm2-pill__val { fill: var(--bm2-green, #3f6b57); }
.bm2-pill.is-gold .bm2-pill__box { stroke: var(--bm2-gold, #c2872f); }
.bm2-pill.is-gold .bm2-pill__val { fill: var(--bm2-gold, #c2872f); }
.bm2-pill.is-off { opacity: 0; }
.bm2-set__empty {
  fill: var(--bm2-dim, #9aa39c);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

.bm2-phasetext {
  fill: var(--bm2-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLES
  document.head.appendChild(style)
}

function makeDesc() {
  const p = document.createElement('p')
  p.className = 'viz__desc'
  p.setAttribute('aria-live', 'polite')
  return p
}

// ── 布局常量（纵向逐段推，坑 E） ────────────────────────────────────────────
const W = 680
const NOTE_Y = 20
const BANNER_Y = 36
const BANNER_H = 40
const CELLS_LABEL_Y = 100
const CELL_W = 36
const CELL_H = 40
const CELL_GAP = 6
const CELLS_Y = 112
const TRANS_LABEL_Y = 178
const TRANS_Y = 188
const TRANS_H = 26
const TRANS_GAP = 5
const SETS_LABEL_Y = 320
const SET_ROW_Y = 332
const SET_ROW_H = 30
const PHASE_Y = 452
const H = 470

const SIZE = 16
const TRANSITIONS = [
  { from: 0, to: 1, cond: '00 → 01', desc: '第一次见到：翻低位，记「一次」' },
  { from: 1, to: 2, cond: '01 → 10', desc: '第二次见到：清低位置高位，升级成「多次」' },
  { from: 2, to: 2, cond: '10 → 10', desc: '已经是多次：保持，不再加码' },
  { from: 3, to: 2, cond: '11 → 10', desc: '保留态兜底：同样视作多次' },
]

export function mountBitmapTwoBit(host, options = {}) {
  if (!host || host.dataset.bm2Mounted === '1') return { destroy() {} }
  host.dataset.bm2Mounted = '1'
  ensureStyles()

  const steps = buildBitmapTwoBitSteps(options)
  const s0 = steps[0]

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg bm2__svg',
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    'aria-label': '2-bit 位图动画：去重、数重复、找只出现一次的数',
  })
  const cellLayer = mk('g', { class: 'bm2-cells' })
  const markLayer = mk('g', { class: 'bm2-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer) // 标记层后挂 = 永远压在图形上（坑 K）

  const note = mk('text', { class: 'bm2-note', x: 30, y: NOTE_Y })
  note.textContent = `输入 ${s0.input.join('、')} · 每个数 2 bit：00 未出现 / 01 一次 / 10 多次 / 11 保留`
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'bm2-banner__box', x: 30, y: BANNER_Y, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segPhase = mk('text', { class: 'bm2-banner__seg', x: 46, y: BANNER_Y + BANNER_H / 2 })
  const segAct = mk('text', { class: 'bm2-banner__seg', x: 150, y: BANNER_Y + BANNER_H / 2 })
  const segVal = mk('text', { class: 'bm2-banner__val', x: W - 46, y: BANNER_Y + BANNER_H / 2 })
  markLayer.append(segPhase, segAct, segVal)

  // ── 状态阵列 ──
  const cellsLabel = mk('text', { class: 'bm2-seclabel', x: 30, y: CELLS_LABEL_Y })
  cellsLabel.textContent = '16 个数的状态格（上：数值，下：2-bit 状态）'
  markLayer.appendChild(cellsLabel)

  const rowW = SIZE * CELL_W + (SIZE - 1) * CELL_GAP
  const cellsLeft = (W - rowW) / 2
  const cellEls = []
  for (let v = 0; v < SIZE; v += 1) {
    const x = cellsLeft + v * (CELL_W + CELL_GAP)
    const g = mk('g', { class: 'bm2-cell' })
    g.appendChild(
      mk('rect', { class: 'bm2-cell__box', x, y: CELLS_Y, width: CELL_W, height: CELL_H, rx: 6 }),
    )
    const val = mk('text', { class: 'bm2-cell__v', x: x + CELL_W / 2, y: CELLS_Y + 12 })
    val.textContent = String(v)
    const st = mk('text', { class: 'bm2-cell__st', x: x + CELL_W / 2, y: CELLS_Y + 28 })
    st.textContent = '00'
    g.append(val, st)
    cellLayer.appendChild(g)
    cellEls.push({ g, st, v })
  }

  // ── 转移表 ──
  const transLabel = mk('text', { class: 'bm2-seclabel', x: 30, y: TRANS_LABEL_Y })
  transLabel.textContent = '状态转移表（金色 = 本轮命中）'
  markLayer.appendChild(transLabel)

  const trEls = TRANSITIONS.map((t, k) => {
    const y = TRANS_Y + k * (TRANS_H + TRANS_GAP)
    const g = mk('g', { class: 'bm2-tr' })
    g.appendChild(
      mk('rect', { class: 'bm2-tr__box', x: 30, y, width: W - 60, height: TRANS_H, rx: 7 }),
    )
    const cond = mk('text', { class: 'bm2-tr__cond', x: 46, y: y + TRANS_H / 2 })
    cond.textContent = t.cond
    const arrow = mk('text', { class: 'bm2-tr__arrow', x: 130, y: y + TRANS_H / 2 })
    arrow.textContent = '→'
    const desc = mk('text', { class: 'bm2-tr__desc', x: 156, y: y + TRANS_H / 2 })
    desc.textContent = t.desc
    g.append(cond, arrow, desc)
    cellLayer.appendChild(g)
    return { g, def: t }
  })

  // ── 三集合 ──
  const setsLabel = mk('text', { class: 'bm2-seclabel', x: 30, y: SETS_LABEL_Y })
  setsLabel.textContent = '一遍扫完，三个问题同时有答案'
  markLayer.appendChild(setsLabel)

  const PILL_W = 40
  const PILL_GAP = 8
  const setRows = [
    { key: 'distinct', label: '出现过', cls: 'is-green' },
    { key: 'dups', label: '重复（≥2 次）', cls: 'is-gold' },
    { key: 'uniques', label: '只一次', cls: 'is-green' },
  ]
  const setRowEls = setRows.map((row, ri) => {
    const y = SET_ROW_Y + ri * SET_ROW_H
    const label = mk('text', { class: 'bm2-seclabel', x: 30, y: y + 13 })
    label.textContent = row.label
    const pills = []
    for (let i = 0; i < SIZE; i += 1) {
      const x = 150 + i * (PILL_W + PILL_GAP)
      const g = mk('g', { class: `bm2-pill is-off ${row.cls}` })
      g.appendChild(
        mk('rect', { class: 'bm2-pill__box', x, y: y + 2, width: PILL_W, height: 22, rx: 6 }),
      )
      const val = mk('text', { class: 'bm2-pill__val', x: x + PILL_W / 2, y: y + 13 })
      g.appendChild(val)
      cellLayer.appendChild(g)
      pills.push({ g, val })
    }
    markLayer.appendChild(label)
    return { row, pills }
  })

  const phaseText = mk('text', { class: 'bm2-phasetext', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  function paint(_index, step) {
    if (!step) return

    // 状态格
    cellEls.forEach(({ g, st, v }) => {
      const state = step.states[v]
      const cls = ['bm2-cell']
      if (state === 1) cls.push('is-once')
      else if (state === 2) cls.push('is-many')
      else if (state === 3) cls.push('is-reserved')
      if (step.value === v && step.phase === 'step') cls.push('is-cur')
      g.setAttribute('class', cls.join(' '))
      st.textContent = state.toString(2).padStart(2, '0')
    })

    // 转移表：命中行烫金
    trEls.forEach(({ g, def }) => {
      const on = step.phase === 'step' && step.from === def.from && step.to === def.to
      g.setAttribute('class', `bm2-tr ${on ? 'is-on' : ''}`)
    })

    // 三集合
    setRowEls.forEach(({ row, pills }) => {
      const list = step[row.key]
      pills.forEach((p, i) => {
        if (i >= list.length) {
          p.g.setAttribute('class', `bm2-pill is-off ${row.cls}`)
          return
        }
        p.g.setAttribute('class', `bm2-pill ${row.cls}`)
        p.val.textContent = String(list[i])
      })
    })

    // 横幅
    if (step.phase === 'init') {
      segPhase.textContent = '准备'
      segAct.textContent = '全 00 起步'
      segVal.textContent = `${SIZE} 个数 × 2 bit`
    } else if (step.phase === 'done') {
      segPhase.textContent = '扫描完成'
      segAct.textContent = `重复 ${step.dups.length} · 唯一 ${step.uniques.length}`
      segVal.textContent = `distinct ${step.distinct.length}`
    } else {
      segPhase.textContent = `数 ${step.value}`
      segAct.textContent = STATE_LABEL[step.from].split(' ')[0] + ' → ' + STATE_LABEL[step.to].split(' ')[0]
      segVal.textContent = step.to === 2 ? '记多次' : step.to === 1 ? '记一次' : ''
    }

    phaseText.textContent =
      step.phase === 'init'
        ? '1-bit 位图只回答「出现过没有」；每个数加到 2 bit，就能同时区分一次和多次。'
        : step.phase === 'done'
          ? '空间是 1-bit 位图的两倍，换来「次数分档」：去重、数重复、找唯一一次全解决。'
          : ''

    renderRichText(descEl, step.desc)
  }

  const descEl = makeDesc()
  const rootEl = document.createElement('div')
  rootEl.className = 'viz bm2'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  stage.appendChild(svgRoot)
  rootEl.appendChild(stage)
  rootEl.appendChild(descEl)
  const controls = createControls()
  rootEl.appendChild(controls.root)
  host.textContent = ''
  host.appendChild(rootEl)
  ensureChromeStyles()

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const player = createPlayer({ steps, controls, intervalMs: PLAY_MS, onRender: paint })
  player.jumpTo(Math.trunc(options.initialStep) || 0)

  let observer = null
  if (options.autoplay !== false && !reduced && typeof IntersectionObserver === 'function') {
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
      delete host.dataset.bm2Mounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
