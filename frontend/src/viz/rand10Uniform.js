/**
 * rand10Uniform.js — 「Rand10 均匀性证明」的 SVG 渲染层（LC 470 动画二）。
 *
 * 布局：左侧 = 7×7 的 49 格状态表 —— 按输出分组着色（每个输出一色、
 * 恰好 4 格），拒绝 9 格灰色；右侧 = 10 个输出的前像计数（逐组点亮）；
 * 横幅 + 状态行。
 */

import { buildRand10Board, buildRand10UniformSteps } from './rand10UniformSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'rand10uniform-styles'

const NOTE_Y = 28
const GRID_X = 30
const GRID_Y = 76
const CELL = 40
const CGAP = 4
const RIGHT_X = 350
const RIGHT_W = 284
const BANNER_Y = 392
const BANNER_H = 40
const PHASE_Y = 456

const PLAY_MS = 1150

/** 十个输出的自然色系（与站内配色统一的低饱和）。 */
const OUTPUT_COLORS = [
  '#79a892', '#c2872f', '#8aa0c0', '#b08fb0', '#a4b06a',
  '#c08a8a', '#7fa7a0', '#c7a76a', '#9aa3c7', '#b3a08a',
]

const STYLES = `
.rdp { display: flex; flex-direction: column; gap: 14px; }
.rdp__svg { width: 100%; height: auto; display: block; }

.rdp-note {
  fill: var(--rdp-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdp-note--r { text-anchor: end; }
.rdp-lbl { fill: var(--rdp-muted, #657168); font-size: 11.5px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rdp-cell__box { stroke: var(--rdp-line, #d8ded6); stroke-width: 1; }
.rdp-cell--reject .rdp-cell__box { fill: var(--rdp-reject, #e9e6e1); }
.rdp-cell--pending .rdp-cell__box { fill: var(--rdp-pending, #f6f7f4); }
.rdp-cell.is-live .rdp-cell__box { stroke: var(--rdp-gold, #c2872f); stroke-width: 2.5; }
.rdp-cell__num {
  fill: var(--rdp-dim, #b3bbb3); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdp-cell.is-colored .rdp-cell__num { fill: #ffffff; font-weight: 700; }
.rdp-cell--reject .rdp-cell__num { fill: var(--rdp-dim, #a8b0a8); }
.rdp-idx { fill: var(--rdp-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.rdp-legend__box { fill: var(--rdp-fill, #ffffff); stroke: var(--rdp-line, #c3c9c2); stroke-width: 1.5; }
.rdp-legend__box.is-on { stroke-width: 2.5; }
.rdp-legend__t { font-size: 11.5px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.rdp-legend__count { font-size: 11.5px; font-weight: 700; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rdp-note2 { fill: var(--rdp-muted, #657168); font-size: 12px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.rdp-note2 b { font-weight: 700; fill: var(--rdp-ink, #1f2a24); }

.rdp-banner__box { fill: var(--rdp-banner, #f4f3ef); stroke: var(--rdp-line, #c3c9c2); stroke-width: 1.5; }
.rdp-banner__text { fill: var(--rdp-hot, #a45f45); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdp-banner__text.is-ok { fill: var(--rdp-ok, #3f6b57); }

.rdp-phase__text { fill: var(--rdp-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
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
 * @param {{ from?: number, to?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountRand10Uniform(host, options = {}) {
  if (!host || host.dataset.rand10UniformMounted === '1') return { destroy() {} }
  host.dataset.rand10UniformMounted = '1'
  ensureStyles()

  const steps = buildRand10UniformSteps(options)
  const autoplay = options.autoplay !== false
  const { from, to, size, acceptLimit, perOutput } = steps[0]
  const { board } = buildRand10Board(from, to)

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz rdp'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg rdp__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': 'Rand10 均匀性证明推演动画',
  })
  stage.appendChild(svgRoot)

  const gridLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(gridLayer, markLayer)

  const note = mk('text', { class: 'rdp-note', x: 26, y: NOTE_Y })
  note.textContent = `${size} 格等概率（各 1/${size}）；被接受的 ${acceptLimit} 格恰好均分给 ${to} 个输出`
  markLayer.appendChild(note)
  const goal = mk('text', { class: 'rdp-note rdp-note--r', x: width - 26, y: NOTE_Y })
  goal.textContent = `每组 ${perOutput} 格`
  markLayer.appendChild(goal)

  // ── 状态表 ──
  const cellEls = []
  let colorOf = null
  for (let r = 0; r < from; r += 1) {
    const rowEls = []
    for (let c = 0; c < from; c += 1) {
      const x = GRID_X + c * (CELL + CGAP)
      const y = GRID_Y + r * (CELL + CGAP)
      const g = mk('g', { class: 'rdp-cell' })
      const box = mk('rect', { class: 'rdp-cell__box', x, y, width: CELL, height: CELL, rx: 5 })
      const num = mk('text', { class: 'rdp-cell__num', x: x + CELL / 2, y: y + CELL / 2 })
      num.textContent = String(board[r][c].value)
      g.append(box, num)
      gridLayer.appendChild(g)
      rowEls.push({ g, box })
    }
    cellEls.push(rowEls)
  }
  for (let i = 0; i < from; i += 1) {
    const ct = mk('text', { class: 'rdp-idx', x: GRID_X + i * (CELL + CGAP) + CELL / 2, y: GRID_Y - 14 })
    ct.textContent = String(i + 1)
    const rt = mk('text', { class: 'rdp-idx', x: GRID_X - 14, y: GRID_Y + i * (CELL + CGAP) + CELL / 2 })
    rt.textContent = String(i + 1)
    markLayer.append(ct, rt)
  }

  // ── 输出图例（2 列 × 5 行） ──
  const legendTitle = mk('text', { class: 'rdp-lbl', x: RIGHT_X, y: GRID_Y - 14 })
  legendTitle.textContent = '每个输出的前像（来源状态）'
  markLayer.appendChild(legendTitle)

  const legendW = 134
  const legendH = 26
  const legendRows = Math.ceil(to / 2)
  const legendEls = []
  for (let k = 1; k <= to; k += 1) {
    const col = k % 2 === 1 ? 0 : 1
    const row = Math.floor((k - 1) / 2)
    const x = RIGHT_X + col * (legendW + 16)
    const y = GRID_Y + row * (legendH + 6)
    const g = mk('g', { class: 'rdp-legend' })
    const box = mk('rect', { class: 'rdp-legend__box', x, y, width: legendW, height: legendH, rx: 6 })
    const t = mk('text', { class: 'rdp-legend__t', x: x + 12, y: y + legendH / 2 })
    const count = mk('text', { class: 'rdp-legend__count', x: x + legendW - 12, y: y + legendH / 2, 'text-anchor': 'end' })
    g.append(box, t, count)
    markLayer.appendChild(g)
    legendEls.push({ g, box, t, count })
  }

  const sumLine = mk('text', { class: 'rdp-note2', x: RIGHT_X, y: GRID_Y + legendRows * (legendH + 6) + 26 })
  const rejectLine = mk('text', { class: 'rdp-note2', x: RIGHT_X, y: GRID_Y + legendRows * (legendH + 6) + 50 })
  markLayer.append(sumLine, rejectLine)

  // ── 横幅 / 状态行 ──
  markLayer.appendChild(mk('rect', { class: 'rdp-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'rdp-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)
  const phaseText = mk('text', { class: 'rdp-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const revealed = step.revealed

    cellEls.forEach((rowEls, r) => {
      rowEls.forEach((el, c) => {
        const cell = board[r][c]
        const cls = ['rdp-cell']
        if (!cell.accepted) {
          cls.push('rdp-cell--reject')
          el.g.setAttribute('class', cls.join(' '))
          el.box.setAttribute('fill', '')
          return
        }
        if (cell.output !== null && cell.output <= revealed) {
          cls.push('is-colored')
          el.box.setAttribute('fill', OUTPUT_COLORS[(cell.output - 1) % OUTPUT_COLORS.length])
          if (cell.output === revealed) cls.push('is-live')
        } else {
          cls.push('rdp-cell--pending')
          el.box.setAttribute('fill', '')
        }
        el.g.setAttribute('class', cls.join(' '))
      })
    })

    legendEls.forEach((el, i) => {
      const k = i + 1
      const on = k <= revealed
      const color = OUTPUT_COLORS[(k - 1) % OUTPUT_COLORS.length]
      el.box.setAttribute('class', 'rdp-legend__box' + (on ? ' is-on' : ''))
      // 注意：presentation attribute 会被 CSS 类的 fill/stroke 盖掉 → 用 inline style
      el.box.style.fill = on ? color : ''
      el.box.style.stroke = on ? color : ''
      el.t.style.fill = on ? '#ffffff' : '#9aa39c'
      el.count.style.fill = on ? '#ffffff' : '#9aa39c'
      el.t.textContent = `输出 ${k}`
      el.count.textContent = `×${step.counts[i]}`
    })

    const revealedSum = step.counts.reduce((a, b) => a + b, 0)
    sumLine.textContent = `已点亮 ${revealedSum}/${acceptLimit} 格；每组恰好 ${perOutput} 格`
    rejectLine.textContent = `拒绝 ${size - acceptLimit} 格 → 重掷，不影响分布`

    if (step.phase === 'init') {
      banner.textContent = `全暗：${size} 个等概率状态，${acceptLimit} 个会被接受（接下来按输出逐组点亮）`
      banner.setAttribute('class', 'rdp-banner__text')
    } else if (step.phase === 'reveal') {
      banner.textContent = `点亮输出 ${revealed} 的 ${perOutput} 个来源状态`
      banner.setAttribute('class', 'rdp-banner__text is-ok')
    } else {
      banner.textContent = `${acceptLimit} 格 ÷ ${to} 组 = 每组 ${perOutput} 格，零重叠零遗漏 → 均匀性得证`
      banner.setAttribute('class', 'rdp-banner__text is-ok')
    }

    if (step.phase === 'init') phaseText.textContent = '证明的关键：不是「看起来均匀」，而是「每组格子数严格相等」'
    else if (step.phase === 'reveal') phaseText.textContent = '解 (v−1) % 10 + 1 = k 且 v ≤ 40 —— 每组恰好 4 个解'
    else phaseText.textContent = '拒绝只影响期望次数，不影响条件分布：重掷独立同分布'

    renderRichText(desc, step.desc)
  }

  rootEl.appendChild(desc)
  const controls = createControls()
  rootEl.appendChild(controls.root)

  host.textContent = ''
  host.appendChild(rootEl)
  ensureChromeStyles()

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const player = createPlayer({ steps, controls, intervalMs: PLAY_MS, onRender: paint })
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
      delete host.dataset.rand10UniformMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
