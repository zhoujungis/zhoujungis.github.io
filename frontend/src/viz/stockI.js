/**
 * stockI.js — 「买卖股票的最佳时机 I」(LC 121) 的 SVG 渲染层。
 *
 * 三段布局：顶部 = 价格格子行（minPrice 所在格绿框、当前日金框、
 * "min" 指针在下、"today" 指针在上）；中部 = 动作横幅
 * （今天卖一把：price - minPrice = candidate vs best → 刷不刷新）；
 * 底部 = 双变量面板（minPrice / candidate / best）。
 *
 * 通用坑：A / K / V / W / 红线 4（照抄 binarySearch.js 的骨架）。
 */

import { buildStockISteps } from './stockISteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'stocki-styles'

const NOTE_Y = 34
const TODAY_LBL_Y = 62
const CELL_Y = 76
const CELL_H = 42
const MIN_Y = CELL_Y + CELL_H + 14
const MIN_LBL_Y = MIN_Y + 16

const BANNER_Y = 168
const BANNER_H = 46
const PANEL_Y = 228
const PANEL_H = 56
const PHASE_Y = 306

const AVAIL = 604
const PLAY_MS = 1500

const STYLES = `
.siv { display: flex; flex-direction: column; gap: 14px; }
.siv__svg { width: 100%; height: auto; display: block; }

.siv-note {
  fill: var(--siv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-note--r { text-anchor: end; }

.siv-cell__box {
  fill: var(--siv-fill, #ffffff); stroke: var(--siv-line, #c3c9c2); stroke-width: 1.5;
}
.siv-cell__val {
  fill: var(--siv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-cell__idx {
  fill: var(--siv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-cell.is-past .siv-cell__box { fill: var(--siv-past, #eef0ec); }
.siv-cell.is-min .siv-cell__box {
  fill: var(--siv-ok-fill, #eef5f1); stroke: var(--siv-ok, #3f6b57); stroke-width: 3;
}
.siv-cell.is-min .siv-cell__val { fill: var(--siv-ok, #3f6b57); }
.siv-cell.is-today .siv-cell__box {
  fill: var(--siv-gold-fill, #fdf3e3); stroke: var(--siv-gold, #c2872f); stroke-width: 3;
}
.siv-cell.is-today .siv-cell__val { fill: var(--siv-gold, #c2872f); }
.siv-cell.is-min.is-today .siv-cell__box {
  fill: var(--siv-gold-fill, #fdf3e3);
  stroke: var(--siv-gold, #c2872f); stroke-width: 3;
}

.siv-ptr { font-size: 11px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.siv-ptr--m { fill: var(--siv-ok, #3f6b57); }
.siv-ptr--t { fill: var(--siv-gold, #c2872f); }
.siv-tri--m { fill: var(--siv-ok, #3f6b57); }
.siv-tri--t { fill: var(--siv-gold, #c2872f); }

.siv-banner__box {
  fill: var(--siv-banner, #f4f3ef); stroke: var(--siv-line, #c3c9c2); stroke-width: 1.5;
}
.siv-banner__text {
  fill: var(--siv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-banner__text.is-ok { fill: var(--siv-ok, #3f6b57); }

.siv-panel__box {
  fill: var(--siv-fill, #ffffff); stroke: var(--siv-line, #c3c9c2); stroke-width: 1.5;
}
.siv-panel__label {
  fill: var(--siv-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-panel__num {
  fill: var(--siv-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.siv-panel__num.is-fresh { fill: var(--siv-gold, #c2872f); }
.siv-panel__num.is-final { fill: var(--siv-ok, #3f6b57); }

.siv-phase__text {
  fill: var(--siv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
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
 * @param {{ prices?: number[], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountStockI(host, options = {}) {
  if (!host || host.dataset.stockiMounted === '1') return { destroy() {} }
  host.dataset.stockiMounted = '1'
  ensureStyles()

  const steps = buildStockISteps(options)
  const autoplay = options.autoplay !== false
  const prices = steps[0].prices

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz siv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg siv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '买卖股票最佳时机 I LC121 推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'siv-note', x: 26, y: NOTE_Y })
  note.textContent = '先卖一把，再记最低价 —— 顺序即题意'
  markLayer.appendChild(note)
  const tgt = mk('text', { class: 'siv-note siv-note--r', x: width - 26, y: NOTE_Y })
  tgt.textContent = `只许买卖一次`
  markLayer.appendChild(tgt)

  // 价格格子行
  const n = prices.length
  const cw = Math.min(64, Math.floor((AVAIL - (n - 1) * 6) / Math.max(1, n)))
  const gap = 6
  const totalW = n * cw + (n - 1) * gap
  const x0 = (width - totalW) / 2
  // minPrice 所在下标（历史最低最早出现的位置，逐帧重算只为画指针）
  const minIdxOf = (step) => {
    let idx = 0
    for (let i = 1; i <= (step.phase === 'done' ? n - 1 : step.day); i += 1) {
      if (prices[i] < prices[idx]) idx = i
    }
    return idx
  }
  const cellEls = prices.map((v, idx) => {
    const x = x0 + idx * (cw + gap)
    const g = mk('g', { class: 'siv-cell' })
    g.appendChild(mk('rect', { class: 'siv-cell__box', x, y: CELL_Y, width: cw, height: CELL_H, rx: 6 }))
    const val = mk('text', { class: 'siv-cell__val', x: x + cw / 2, y: CELL_Y + CELL_H / 2 - 5 })
    val.textContent = String(v)
    g.appendChild(val)
    const idxEl = mk('text', { class: 'siv-cell__idx', x: x + cw / 2, y: CELL_Y + CELL_H / 2 + 12 })
    idxEl.textContent = String(idx)
    g.appendChild(idxEl)
    cellLayer.appendChild(g)
    return { g, cx: x + cw / 2 }
  })

  // today 指针（上）与 min 指针（下）
  const todayTri = mk('path', { class: 'siv-tri siv-tri--t', d: '' })
  const todayLbl = mk('text', { class: 'siv-ptr siv-ptr--t', x: 0, y: TODAY_LBL_Y })
  todayLbl.textContent = 'today'
  const minTri = mk('path', { class: 'siv-tri siv-tri--m', d: '' })
  const minLbl = mk('text', { class: 'siv-ptr siv-ptr--m', x: 0, y: MIN_LBL_Y })
  minLbl.textContent = 'min'
  markLayer.append(todayTri, todayLbl, minTri, minLbl)

  // 动作横幅
  markLayer.appendChild(mk('rect', { class: 'siv-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'siv-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  // 双变量面板
  markLayer.appendChild(mk('rect', { class: 'siv-panel__box', x: 26, y: PANEL_Y, width: width - 52, height: PANEL_H, rx: 9 }))
  const mkStat = (label, cx) => {
    const l = mk('text', { class: 'siv-panel__label', x: cx, y: PANEL_Y + 15 })
    l.textContent = label
    const v = mk('text', { class: 'siv-panel__num', x: cx, y: PANEL_Y + 37 })
    markLayer.append(l, v)
    return v
  }
  const minNum = mkStat('minPrice', width / 2 - 145)
  const candNum = mkStat('candidate', width / 2 - 48)
  const bestNum = mkStat('best', width / 2 + 48)
  const dayNum = mkStat('day', width / 2 + 145)

  const phaseText = mk('text', { class: 'siv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const minIdx = minIdxOf(step)
    const todayIdx = step.phase === 'done' ? -1 : step.day

    cellEls.forEach((el, idx) => {
      const cls = ['siv-cell']
      if (idx === todayIdx) cls.push('is-today')
      else if (idx === minIdx) cls.push('is-min')
      else if (step.phase !== 'init' && idx < step.day) cls.push('is-past')
      el.g.setAttribute('class', cls.join(' '))
    })

    const tri = (cx, y, dir) =>
      dir === 'down'
        ? `M ${cx - 6} ${y - 8} L ${cx + 6} ${y - 8} L ${cx} ${y + 1} Z`
        : `M ${cx - 6} ${y + 8} L ${cx + 6} ${y + 8} L ${cx} ${y - 1} Z`
    if (todayIdx >= 0) {
      const cx = cellEls[todayIdx].cx
      todayTri.setAttribute('d', tri(cx, CELL_Y - 4, 'down'))
      todayLbl.setAttribute('x', cx)
      todayTri.style.opacity = '1'; todayLbl.style.opacity = '1'
    } else {
      todayTri.setAttribute('d', ''); todayTri.style.opacity = '0'; todayLbl.style.opacity = '0'
    }
    const mcx = cellEls[minIdx].cx
    minTri.setAttribute('d', tri(mcx, MIN_Y, 'up'))
    minLbl.setAttribute('x', mcx)

    // 横幅
    if (step.phase === 'scan') {
      const sign = step.candidate > step.prevBest ? '>' : step.candidate < step.prevBest ? '<' : '='
      const act =
        step.updated === 'best'
          ? `best 刷新 → ${step.best}`
          : step.updated === 'minPrice'
            ? 'minPrice 下台阶'
            : '两变量不动（路过）'
      banner.textContent = `卖一把：${step.price} - ${step.prevMin} = ${step.candidate} ${sign} best ${step.prevBest}  →  ${act}`
      banner.setAttribute('class', 'siv-banner__text' + (step.updated === 'best' ? ' is-ok' : ''))
    } else if (step.phase === 'done') {
      banner.textContent = `最大利润 = ${step.result}（minPrice 等来的那次上坡）`
      banner.setAttribute('class', 'siv-banner__text is-ok')
    } else {
      banner.textContent = `开局：minPrice = ${step.minPrice}，best = 0（还没卖过）`
      banner.setAttribute('class', 'siv-banner__text')
    }

    // 面板
    minNum.textContent = String(step.minPrice)
    minNum.setAttribute('class', 'siv-panel__num' + (step.updated === 'minPrice' ? ' is-fresh' : ''))
    candNum.textContent = step.candidate === null ? '—' : String(step.candidate)
    candNum.setAttribute('class', 'siv-panel__num' + (step.phase === 'scan' ? ' is-fresh' : ''))
    bestNum.textContent = String(step.best)
    bestNum.setAttribute(
      'class',
      'siv-panel__num' +
        (step.phase === 'done' ? ' is-final' : step.updated === 'best' ? ' is-fresh' : ''),
    )
    dayNum.textContent = String(step.day)

    // 底部状态行
    if (step.phase === 'init') phaseText.textContent = '每天两件事：先卖一把，再记最低价'
    else if (step.updated === 'best') phaseText.textContent = '上坡日：candidate 超过 best，刷新'
    else if (step.updated === 'minPrice') phaseText.textContent = '下台阶日：更便宜的买入机会出现'
    else if (step.phase === 'done') phaseText.textContent = 'O(n)：两个单调变量吃掉 O(n²) 枚举'
    else phaseText.textContent = '路过日：既不上坡也不破底，什么都不动'

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
      delete host.dataset.stockiMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
