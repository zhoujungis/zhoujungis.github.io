/**
 * eliminateSum10Order.js — 「消除顺序不影响结果」双路线对比的 SVG 渲染层。
 *
 * 两行格子（同一串的两种消法）：A 每次消最左那一对、B 每次消最右那一对。
 * 本帧被消掉的两格画成红虚线，更早消掉的画成灰虚线，跑完还活着的格子是绿框。
 * 底部结论条在两条路线都停住后给出"终点是否相同"。
 */

import { buildEliminateSum10OrderSteps } from './eliminateSum10OrderSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'elimsum10order-styles'

const NOTE_Y = 28
const CHIP_H = 38
const CHIP_GAP = 6
const CHIPS_X = 150
const CHIPS_RIGHT = 634

const ROW_A_Y = 84
const ROW_B_Y = 192
const ROW_LABEL_X = 26

const CARD_Y = 276
const CARD_H = 52

const PLAY_MS = 1400

const STYLES = `
.evo {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.evo__svg { width: 100%; height: auto; display: block; }

.evo-note {
  fill: var(--evo-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.evo-row__label {
  fill: var(--evo-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.evo-row.is-turn .evo-row__label { fill: var(--evo-gold, #c2872f); }
.evo-row__summary {
  fill: var(--evo-ink, #1f2a24);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.evo-chip__box {
  fill: var(--evo-fill, #ffffff);
  stroke: var(--evo-line, #c3c9c2);
  stroke-width: 1.5;
}
.evo-chip__val {
  fill: var(--evo-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.evo-chip__idx {
  fill: var(--evo-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 本帧被消掉：红虚线 */
.evo-chip.is-elim .evo-chip__box {
  fill: none;
  stroke: var(--evo-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 3;
}
.evo-chip.is-elim .evo-chip__val { fill: var(--evo-hot, #a45f45); }
/* 更早消掉：灰虚线 */
.evo-chip.is-gone .evo-chip__box {
  fill: none;
  stroke: var(--evo-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.5;
}
.evo-chip.is-gone .evo-chip__val { fill: var(--evo-dim, #9aa39c); }
.evo-chip.is-gone { opacity: 0.8; }
/* 终态还活着：绿框 */
.evo-chip.is-end .evo-chip__box {
  fill: var(--evo-ok-fill, #eef4ef);
  stroke: var(--evo-ok, #3f6b57);
  stroke-width: 3;
}
.evo-chip.is-end .evo-chip__val { fill: var(--evo-ok, #3f6b57); }

.evo-card__box {
  fill: var(--evo-banner, #f4f3ef);
  stroke: var(--evo-line, #c3c9c2);
  stroke-width: 1.5;
}
.evo-card__title {
  fill: var(--evo-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.evo-card__value {
  fill: var(--evo-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.evo-card__value.is-ok { fill: var(--evo-ok, #3f6b57); }
.evo-card__value.is-hot { fill: var(--evo-hot, #a45f45); }
`

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLES
  document.head.appendChild(style)
}

const aliveString = (chars, state) => state.alive.map((k) => chars[k]).join('')

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{ s?: string, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountEliminateSum10Order(host, options = {}) {
  if (!host || host.dataset.elimsum10OrderMounted === '1') return { destroy() {} }
  host.dataset.elimsum10OrderMounted = '1'
  ensureStyles()

  const steps = buildEliminateSum10OrderSteps(options)
  const autoplay = options.autoplay !== false
  const s0 = steps[0]
  const chars = s0.chars
  const n = s0.n

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz evo'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = CARD_Y + CARD_H + 16

  const svgRoot = mk('svg', {
    class: 'viz__svg evo__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '相邻和为 10 消除 两种消法对比动画',
  })
  stage.appendChild(svgRoot)

  const note = mk('text', { class: 'evo-note', x: 26, y: NOTE_Y })
  note.textContent = '同一个串、两种消法：A 每次消最左那一对，B 每次消最右那一对'
  svgRoot.appendChild(note)

  // 格子宽度按串长自适应，长串压格子而不是溢出画布
  const chipW = Math.min(34, Math.floor((CHIPS_RIGHT - CHIPS_X - (n - 1) * CHIP_GAP) / Math.max(1, n)))

  const buildRow = (y, label, cls) => {
    const g = mk('g', { class: `evo-row ${cls}` })
    const lab = mk('text', { class: 'evo-row__label', x: ROW_LABEL_X, y: y + CHIP_H / 2 })
    lab.textContent = label
    g.appendChild(lab)
    const chips = []
    for (let k = 0; k < n; k += 1) {
      const cg = mk('g', { class: 'evo-chip' })
      const x = CHIPS_X + k * (chipW + CHIP_GAP)
      cg.appendChild(mk('rect', { class: 'evo-chip__box', x, y, width: chipW, height: CHIP_H, rx: 5 }))
      const val = mk('text', { class: 'evo-chip__val', x: x + chipW / 2, y: y + CHIP_H / 2 - 5 })
      val.textContent = chars[k]
      cg.appendChild(val)
      const idx = mk('text', { class: 'evo-chip__idx', x: x + chipW / 2, y: y + CHIP_H - 9 })
      idx.textContent = String(k)
      cg.appendChild(idx)
      g.appendChild(cg)
      chips.push(cg)
    }
    const summary = mk('text', { class: 'evo-row__summary', x: CHIPS_X, y: y + CHIP_H + 18 })
    g.appendChild(summary)
    svgRoot.appendChild(g)
    return { g, chips, summary }
  }

  const rowA = buildRow(ROW_A_Y, 'A 消最左', 'evo-row--a')
  const rowB = buildRow(ROW_B_Y, 'B 消最右', 'evo-row--b')

  svgRoot.appendChild(
    mk('rect', { class: 'evo-card__box', x: 26, y: CARD_Y, width: width - 52, height: CARD_H, rx: 9 }),
  )
  const cardTitle = mk('text', { class: 'evo-card__title', x: width / 2, y: CARD_Y + 17 })
  const cardValue = mk('text', { class: 'evo-card__value', x: width / 2, y: CARD_Y + 37 })
  svgRoot.appendChild(cardTitle)
  svgRoot.appendChild(cardValue)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paintRoute(row, state, moved, isTurn, allDone, converged) {
    const aliveSet = new Set(state.alive)
    const elimSet = new Set(moved ? state.removed || [] : [])
    row.chips.forEach((cg, k) => {
      const cls = ['evo-chip']
      if (elimSet.has(k)) cls.push('is-elim')
      else if (!aliveSet.has(k)) cls.push('is-gone')
      else if (allDone && converged) cls.push('is-end')
      cg.setAttribute('class', cls.join(' '))
    })
    row.g.setAttribute('class', `evo-row ${row === rowA ? 'evo-row--a' : 'evo-row--b'}${isTurn ? ' is-turn' : ''}`)
    row.summary.textContent = `当前串 "${aliveString(chars, state)}" · 已消 ${state.steps} 对${state.done ? ' · 消无可消' : ''}`
  }

  function paint(_index, step) {
    if (!step) return
    const isDone = step.phase === 'done'
    const converged = step.converged === true
    paintRoute(rowA, step.a, step.turn === 'A', step.turn === 'A', isDone, converged)
    paintRoute(rowB, step.b, step.turn === 'B', step.turn === 'B', isDone, converged)

    if (isDone) {
      cardTitle.textContent = converged
        ? '两条路线的终点'
        : '两条路线的终点（不相同 —— 规则不合流）'
      cardValue.textContent = converged
        ? `相同："${step.result}" —— 消除顺序不影响结果`
        : `A "${aliveString(chars, step.a)}" ≠ B "${aliveString(chars, step.b)}"`
      cardValue.setAttribute('class', `evo-card__value ${converged ? 'is-ok' : 'is-hot'}`)
    } else {
      cardTitle.textContent = '本帧走的路线'
      cardValue.textContent = step.turn === 'A' ? 'A：消最左边那一对' : 'B：消最右边那一对'
      cardValue.setAttribute('class', 'evo-card__value')
    }

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
      delete host.dataset.elimsum10OrderMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
