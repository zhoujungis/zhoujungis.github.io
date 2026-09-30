/**
 * stockII.js — 「买卖股票的最佳时机 II」(LC 122) 的 SVG 渲染层。
 *
 * 四段布局：顶部 = 价格格子行（当前日金框，相邻格之间挂差值徽章：
 * 上坡绿 +d、下坡灰 -d）；中部 = cash / hold 两个状态框（转移获胜方描金）；
 * 横幅 = 两条转移方程的现场打分；底部 = greedy / cash / hold / day 面板 ——
 * 盯住 greedy 与 cash 两列，**逐帧相等**。
 */

import { buildStockIISteps } from './stockIISteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'stockii-styles'

const NOTE_Y = 34
const CELL_Y = 72
const CELL_H = 42
const DIFF_Y = CELL_Y + CELL_H + 15
const STATE_Y = 148
const STATE_H = 58
const BANNER_Y = 224
const BANNER_H = 46
const PANEL_Y = 286
const PANEL_H = 56
const PHASE_Y = 364

const AVAIL = 604
const PLAY_MS = 1600

const STYLES = `
.sv2 { display: flex; flex-direction: column; gap: 14px; }
.sv2__svg { width: 100%; height: auto; display: block; }

.sv2-note {
  fill: var(--sv2-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-note--r { text-anchor: end; }

.sv2-cell__box {
  fill: var(--sv2-fill, #ffffff); stroke: var(--sv2-line, #c3c9c2); stroke-width: 1.5;
}
.sv2-cell__val {
  fill: var(--sv2-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-cell__idx {
  fill: var(--sv2-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-cell.is-past .sv2-cell__box { fill: var(--sv2-past, #eef0ec); }
.sv2-cell.is-today .sv2-cell__box {
  fill: var(--sv2-gold-fill, #fdf3e3); stroke: var(--sv2-gold, #c2872f); stroke-width: 3;
}
.sv2-cell.is-today .sv2-cell__val { fill: var(--sv2-gold, #c2872f); }

.sv2-diff {
  font-size: 11px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-diff.is-up { fill: var(--sv2-ok, #3f6b57); }
.sv2-diff.is-down { fill: var(--sv2-dim, #9aa39c); }
.sv2-diff.is-live { font-size: 13px; }

.sv2-state__box {
  fill: var(--sv2-fill, #ffffff); stroke: var(--sv2-line, #c3c9c2); stroke-width: 1.5;
}
.sv2-state__box.is-win { stroke: var(--sv2-gold, #c2872f); stroke-width: 3; }
.sv2-state__label {
  fill: var(--sv2-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-state__num {
  fill: var(--sv2-ink, #1f2a24); font-size: 24px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-state__num.is-final { fill: var(--sv2-ok, #3f6b57); }

.sv2-banner__box {
  fill: var(--sv2-banner, #f4f3ef); stroke: var(--sv2-line, #c3c9c2); stroke-width: 1.5;
}
.sv2-banner__text {
  fill: var(--sv2-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-banner__text.is-ok { fill: var(--sv2-ok, #3f6b57); }

.sv2-panel__box {
  fill: var(--sv2-fill, #ffffff); stroke: var(--sv2-line, #c3c9c2); stroke-width: 1.5;
}
.sv2-panel__label {
  fill: var(--sv2-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-panel__num {
  fill: var(--sv2-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sv2-panel__num.is-fresh { fill: var(--sv2-gold, #c2872f); }

.sv2-phase__text {
  fill: var(--sv2-muted, #657168); font-size: 13px; font-weight: 600;
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
export function mountStockII(host, options = {}) {
  if (!host || host.dataset.stockiiMounted === '1') return { destroy() {} }
  host.dataset.stockiiMounted = '1'
  ensureStyles()

  const steps = buildStockIISteps(options)
  const autoplay = options.autoplay !== false
  const prices = steps[0].prices

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz sv2'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg sv2__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '买卖股票最佳时机 II LC122 推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'sv2-note', x: 26, y: NOTE_Y })
  note.textContent = '贪心吃正差 ≡ 状态机 cash/hold —— 盯住两列逐帧相等'
  markLayer.appendChild(note)
  const tgt = mk('text', { class: 'sv2-note sv2-note--r', x: width - 26, y: NOTE_Y })
  tgt.textContent = '可无限次买卖'
  markLayer.appendChild(tgt)

  // 价格格子行
  const n = prices.length
  const cw = Math.min(64, Math.floor((AVAIL - (n - 1) * 6) / Math.max(1, n)))
  const gap = 6
  const totalW = n * cw + (n - 1) * gap
  const x0 = (width - totalW) / 2
  const cellEls = prices.map((v, idx) => {
    const x = x0 + idx * (cw + gap)
    const g = mk('g', { class: 'sv2-cell' })
    g.appendChild(mk('rect', { class: 'sv2-cell__box', x, y: CELL_Y, width: cw, height: CELL_H, rx: 6 }))
    const val = mk('text', { class: 'sv2-cell__val', x: x + cw / 2, y: CELL_Y + CELL_H / 2 - 5 })
    val.textContent = String(v)
    g.appendChild(val)
    const idxEl = mk('text', { class: 'sv2-cell__idx', x: x + cw / 2, y: CELL_Y + CELL_H / 2 + 12 })
    idxEl.textContent = String(idx)
    g.appendChild(idxEl)
    cellLayer.appendChild(g)
    return { g, cx: x + cw / 2, x }
  })

  // 相邻格之间的差值徽章（day d 挂在 d-1 与 d 的边界上）
  const diffEls = []
  for (let d = 1; d < n; d += 1) {
    const bx = cellEls[d - 1].x + cw + gap / 2
    const t = mk('text', { class: 'sv2-diff', x: bx, y: DIFF_Y })
    markLayer.appendChild(t)
    diffEls.push(t)
  }

  // cash / hold 双状态框
  const boxW = 250
  const boxGap = 40
  const bx0 = (width - boxW * 2 - boxGap) / 2
  const cashBox = mk('rect', { class: 'sv2-state__box', x: bx0, y: STATE_Y, width: boxW, height: STATE_H, rx: 10 })
  const holdBox = mk('rect', { class: 'sv2-state__box', x: bx0 + boxW + boxGap, y: STATE_Y, width: boxW, height: STATE_H, rx: 10 })
  const cashLbl = mk('text', { class: 'sv2-state__label', x: bx0 + boxW / 2, y: STATE_Y + 14 })
  cashLbl.textContent = 'cash（空仓最大利润）'
  const holdLbl = mk('text', { class: 'sv2-state__label', x: bx0 + boxW + boxGap + boxW / 2, y: STATE_Y + 14 })
  holdLbl.textContent = 'hold（持股最大利润）'
  const cashNum = mk('text', { class: 'sv2-state__num', x: bx0 + boxW / 2, y: STATE_Y + 38 })
  const holdNum = mk('text', { class: 'sv2-state__num', x: bx0 + boxW + boxGap + boxW / 2, y: STATE_Y + 38 })
  markLayer.append(cashBox, holdBox, cashLbl, holdLbl, cashNum, holdNum)

  // 转移方程横幅
  markLayer.appendChild(mk('rect', { class: 'sv2-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'sv2-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  // 面板
  markLayer.appendChild(mk('rect', { class: 'sv2-panel__box', x: 26, y: PANEL_Y, width: width - 52, height: PANEL_H, rx: 9 }))
  const mkStat = (label, cx) => {
    const l = mk('text', { class: 'sv2-panel__label', x: cx, y: PANEL_Y + 15 })
    l.textContent = label
    const v = mk('text', { class: 'sv2-panel__num', x: cx, y: PANEL_Y + 37 })
    markLayer.append(l, v)
    return v
  }
  const diffNum = mkStat('diff', width / 2 - 165)
  const greedyNum = mkStat('greedy', width / 2 - 55)
  const cashPNum = mkStat('cash', width / 2 + 55)
  const holdPNum = mkStat('hold', width / 2 + 165)

  const phaseText = mk('text', { class: 'sv2-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const todayIdx = step.phase === 'done' ? -1 : step.day

    cellEls.forEach((el, idx) => {
      const cls = ['sv2-cell']
      if (idx === todayIdx) cls.push('is-today')
      else if (step.phase !== 'init' && idx < step.day) cls.push('is-past')
      el.g.setAttribute('class', cls.join(' '))
    })

    // 差值徽章：只亮到当前日
    for (let d = 1; d < n; d += 1) {
      const t = diffEls[d - 1]
      if (step.phase === 'init' || d > step.day) {
        t.textContent = ''
        continue
      }
      const dv = prices[d] - prices[d - 1]
      const up = dv > 0
      const live = step.phase === 'scan' && d === step.day
      t.textContent = `${up ? '+' : ''}${dv}`
      t.setAttribute('class', `sv2-diff ${up ? 'is-up' : 'is-down'}` + (live ? ' is-live' : ''))
    }

    // 状态框
    cashNum.textContent = String(step.cash)
    holdNum.textContent = String(step.hold)
    cashBox.setAttribute('class', 'sv2-state__box' + (step.cashFrom === 'sell' ? ' is-win' : ''))
    holdBox.setAttribute('class', 'sv2-state__box' + (step.holdFrom === 'buy' ? ' is-win' : ''))
    cashNum.setAttribute('class', 'sv2-state__num' + (step.phase === 'done' ? ' is-final' : ''))
    holdNum.setAttribute('class', 'sv2-state__num')

    // 横幅
    if (step.phase === 'scan') {
      banner.textContent =
        `cash = max(${step.prevCash}, ${step.prevHold}+${step.price}=${step.sellValue}) = ${step.cash}   ` +
        `hold = max(${step.prevHold}, ${step.prevCash}-${step.price}=${step.buyValue}) = ${step.hold}`
      banner.setAttribute('class', 'sv2-banner__text' + (step.cash > step.prevCash ? ' is-ok' : ''))
    } else if (step.phase === 'done') {
      banner.textContent = `答案 = cash = ${step.result}（终态必须空仓；hold=${step.hold} 是"如果死拿"）`
      banner.setAttribute('class', 'sv2-banner__text is-ok')
    } else {
      banner.textContent = `开局：cash = 0（空仓）  hold = ${step.hold}（第 0 天建仓，钱变票）`
      banner.setAttribute('class', 'sv2-banner__text')
    }

    // 面板
    diffNum.textContent = step.diff === null ? '—' : `${step.diff > 0 ? '+' : ''}${step.diff}`
    diffNum.setAttribute('class', 'sv2-panel__num' + (step.phase === 'scan' ? ' is-fresh' : ''))
    greedyNum.textContent = String(step.greedy)
    greedyNum.setAttribute('class', 'sv2-panel__num' + (step.take ? ' is-fresh' : ''))
    cashPNum.textContent = String(step.cash)
    holdPNum.textContent = String(step.hold)

    // 底部状态行
    if (step.phase === 'init') phaseText.textContent = '每天收盘：要么空仓 cash，要么持股 hold'
    else if (step.take) phaseText.textContent = '上坡：贪心吃下 +差，DP 侧 cash 由"今天卖"刷新'
    else if (step.phase === 'done') phaseText.textContent = 'greedy 与 cash 全程逐帧相等 —— 贪心 ≡ 状态机'
    else phaseText.textContent = '下坡：贪心跳过，DP 侧 hold 由"低位补仓"刷新'

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
      delete host.dataset.stockiiMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
