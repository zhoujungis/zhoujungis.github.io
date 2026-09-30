/**
 * coinChangeOrder.js — 「金额正序 vs 逆序」对照动画的 SVG 渲染层。
 *
 * 上下两块面板：上 = 正序（完全背包，本轮从左往右扫），
 * 下 = 逆序（0-1 背包，本轮从右往左扫）。两块面板的方程逐字相同，
 * 每帧按"本轮第几步"对齐：上面处理金额 j、下面处理金额 amount+1-j。
 *
 * 看点是**来源格的颜色**：正序面板读到的来源格是本轮已经刷过的新值（绿），
 * 逆序面板读到的是本轮还没碰过的旧值（灰）。同一格，两种年代。
 */

import { buildCoinChangeOrderSteps } from './coinChangeOrderSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'coinorder-styles'

const INF = Infinity

const NOTE_Y = 30
const LBL_A_Y = 58
const CELL_A_Y = 66
const CELL_H = 38
const CAP_A_Y = 118
const LBL_B_Y = 148
const CELL_B_Y = 156
const CAP_B_Y = 208
const BANNER_Y = 226
const BANNER_H = 46
const PANEL_Y = 286
const PANEL_H = 54
const PHASE_Y = 358

const AVAIL = 604
const PLAY_MS = 850

const STYLES = `
.cco { display: flex; flex-direction: column; gap: 14px; }
.cco__svg { width: 100%; height: auto; display: block; }

.cco-note {
  fill: var(--cco-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-note--r { text-anchor: end; }

.cco-title { font-size: 13px; font-weight: 800; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.cco-title--asc { fill: var(--cco-ok, #3f6b57); }
.cco-title--desc { fill: var(--cco-hot, #a45f45); }

.cco-cell__box {
  fill: var(--cco-fill, #ffffff); stroke: var(--cco-line, #c3c9c2); stroke-width: 1.5;
}
.cco-cell__val {
  fill: var(--cco-ink, #1f2a24); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-cell__idx {
  fill: var(--cco-dim, #9aa39c); font-size: 9px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-cell.is-unreach .cco-cell__val { fill: var(--cco-dim, #9aa39c); font-weight: 500; }
.cco-cell.is-unreach .cco-cell__box { stroke-dasharray: 3 3; }
.cco-cell.is-scanned .cco-cell__box { fill: var(--cco-scan, #f2f6f3); }
.cco-cell.is-from .cco-cell__box {
  fill: var(--cco-ok-fill, #eef5f1); stroke: var(--cco-ok, #3f6b57); stroke-width: 2.5;
}
.cco-cell.is-from .cco-cell__val { fill: var(--cco-ok, #3f6b57); }
.cco-cell.is-target .cco-cell__box {
  fill: var(--cco-gold-fill, #fdf3e3); stroke: var(--cco-gold, #c2872f); stroke-width: 3;
}
.cco-cell.is-target .cco-cell__val { fill: var(--cco-gold, #c2872f); }

.cco-cap {
  fill: var(--cco-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-cap--asc { fill: var(--cco-ok, #3f6b57); }
.cco-cap--desc { fill: var(--cco-hot, #a45f45); }

.cco-banner__box {
  fill: var(--cco-banner, #f4f3ef); stroke: var(--cco-line, #c3c9c2); stroke-width: 1.5;
}
.cco-banner__text {
  fill: var(--cco-ink, #1f2a24); font-size: 12.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-banner__text.is-ok { fill: var(--cco-ok, #3f6b57); }
.cco-banner__text.is-warn { fill: var(--cco-hot, #a45f45); }

.cco-panel__box {
  fill: var(--cco-fill, #ffffff); stroke: var(--cco-line, #c3c9c2); stroke-width: 1.5;
}
.cco-panel__label {
  fill: var(--cco-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-panel__num {
  fill: var(--cco-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cco-panel__num.is-asc { fill: var(--cco-ok, #3f6b57); }
.cco-panel__num.is-desc { fill: var(--cco-hot, #a45f45); }
.cco-panel__num.is-dead { fill: var(--cco-dim, #9aa39c); }

.cco-phase__text {
  fill: var(--cco-muted, #657168); font-size: 13px; font-weight: 600;
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

const fmt = (v) => (v === INF ? '∞' : String(v))

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{ coins?: number[], amount?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountCoinChangeOrder(host, options = {}) {
  if (!host || host.dataset.coinorderMounted === '1') return { destroy() {} }
  host.dataset.coinorderMounted = '1'
  ensureStyles()

  const steps = buildCoinChangeOrderSteps(options)
  const autoplay = options.autoplay !== false
  const coins = steps[0].coins
  const amount = steps[0].amount

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz cco'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg cco__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '零钱兑换 LC322 金额正序与逆序对照动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'cco-note', x: 26, y: NOTE_Y })
  note.textContent = '同一行方程，只差内层金额的方向'
  markLayer.appendChild(note)
  const tgt = mk('text', { class: 'cco-note cco-note--r', x: width - 26, y: NOTE_Y })
  tgt.textContent = `硬币 [${coins.join(', ')}] · 目标 ${amount}`
  markLayer.appendChild(tgt)

  const n = amount + 1
  const gap = 5
  const cw = Math.min(46, Math.floor((AVAIL - (n - 1) * gap) / Math.max(1, n)))
  const totalW = n * cw + (n - 1) * gap
  const x0 = (width - totalW) / 2

  const buildRow = (y) => {
    const els = []
    for (let x = 0; x <= amount; x += 1) {
      const px = x0 + x * (cw + gap)
      const g = mk('g', { class: 'cco-cell' })
      g.appendChild(mk('rect', { class: 'cco-cell__box', x: px, y, width: cw, height: CELL_H, rx: 5 }))
      const val = mk('text', { class: 'cco-cell__val', x: px + cw / 2, y: y + CELL_H / 2 - 5 })
      g.appendChild(val)
      const idxEl = mk('text', { class: 'cco-cell__idx', x: px + cw / 2, y: y + CELL_H / 2 + 11 })
      idxEl.textContent = String(x)
      g.appendChild(idxEl)
      cellLayer.appendChild(g)
      els.push({ g, val, cx: px + cw / 2 })
    }
    return els
  }

  // 正序面板
  const titleA = mk('text', { class: 'cco-title cco-title--asc', x: 26, y: LBL_A_Y })
  titleA.setAttribute('text-anchor', 'start')
  titleA.textContent = `正序 1 → ${amount}　完全背包（硬币可复用）`
  const titleB = mk('text', { class: 'cco-title cco-title--desc', x: 26, y: LBL_B_Y })
  titleB.setAttribute('text-anchor', 'start')
  titleB.textContent = `逆序 ${amount} → 1　0-1 背包（每枚最多一次）`
  markLayer.append(titleA, titleB)

  const rowA = buildRow(CELL_A_Y)
  const rowB = buildRow(CELL_B_Y)

  const capA = mk('text', { class: 'cco-cap cco-cap--asc', x: width / 2, y: CAP_A_Y })
  const capB = mk('text', { class: 'cco-cap cco-cap--desc', x: width / 2, y: CAP_B_Y })
  markLayer.append(capA, capB)

  markLayer.appendChild(mk('rect', { class: 'cco-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'cco-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  markLayer.appendChild(mk('rect', { class: 'cco-panel__box', x: 26, y: PANEL_Y, width: width - 52, height: PANEL_H, rx: 9 }))
  const mkStat = (label, cx) => {
    const l = mk('text', { class: 'cco-panel__label', x: cx, y: PANEL_Y + 15 })
    l.textContent = label
    const v = mk('text', { class: 'cco-panel__num', x: cx, y: PANEL_Y + 37 })
    markLayer.append(l, v)
    return v
  }
  const coinNum = mkStat('coin', width / 2 - 175)
  const stepNum = mkStat('本轮第几步', width / 2 - 45)
  const ascNum = mkStat('正序 dp[amount]', width / 2 + 95)
  const descNum = mkStat('逆序 dp[amount]', width / 2 + 220)

  const phaseText = mk('text', { class: 'cco-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paintRow(row, arr, targetIdx, sourceIdx, scannedFrom, scannedTo) {
    row.forEach((el, x) => {
      const cls = ['cco-cell']
      if (x === targetIdx) cls.push('is-target')
      else if (x === sourceIdx) cls.push('is-from')
      else if (x >= scannedFrom && x <= scannedTo) cls.push('is-scanned')
      if (arr[x] === INF) cls.push('is-unreach')
      el.g.setAttribute('class', cls.join(' '))
      el.val.textContent = fmt(arr[x])
    })
  }

  function paint(_index, step) {
    if (!step) return
    const isUpdate = step.phase === 'update'
    const c = step.coin
    const ascSrc = isUpdate && c !== null && step.a - c >= 0 ? step.a - c : null
    const descSrc = isUpdate && c !== null && step.descA - c >= 0 ? step.descA - c : null

    paintRow(rowA, step.dpAsc, isUpdate ? step.a : -1, ascSrc, isUpdate ? 1 : -1, isUpdate ? step.a : -1)
    paintRow(rowB, step.dpDesc, isUpdate ? step.descA : -1, descSrc, isUpdate ? step.descA : -1, isUpdate ? amount : -1)

    if (isUpdate) {
      capA.textContent = `本轮已扫 1 → ${step.a}　dp[${step.a}] = ${fmt(step.dpAsc[step.a])}`
      capB.textContent = `本轮已扫 ${step.descA} → ${amount}　dp[${step.descA}] = ${fmt(step.dpDesc[step.descA])}`
    } else if (step.phase === 'done') {
      capA.textContent = `终态 dp[${amount}] = ${fmt(step.dpAsc[amount])}`
      capB.textContent = `终态 dp[${amount}] = ${fmt(step.dpDesc[amount])}`
    } else {
      capA.textContent = `dp[0] = 0，其余 ∞`
      capB.textContent = `dp[0] = 0，其余 ∞`
    }

    if (isUpdate) {
      const left =
        step.ascRead === null
          ? `a=${step.a} 装不下`
          : `a=${step.a}: dp[${ascSrc}]+1 = ${fmt(step.ascValue)}${step.ascUpdated ? ' ✓' : ''}`
      const right =
        step.descRead === null
          ? `a=${step.descA} 装不下`
          : `a=${step.descA}: 旧 dp[${descSrc}]+1 = ${fmt(step.descValue)}${step.descUpdated ? ' ✓' : ''}`
      banner.textContent = `正序｜${left}　　逆序｜${right}`
      banner.setAttribute('class', 'cco-banner__text' + (step.ascUpdated ? ' is-ok' : ''))
    } else if (step.phase === 'done') {
      banner.textContent = `正序 = ${step.result}　≠　逆序 = ${step.descResult} —— 方向一换，题意就变了`
      banner.setAttribute('class', 'cco-banner__text' + (step.descResult === -1 ? ' is-warn' : ''))
    } else {
      banner.textContent = `dp[a] = min(dp[a], dp[a-c] + 1)　两边一字不差`
      banner.setAttribute('class', 'cco-banner__text')
    }

    coinNum.textContent = c === null ? '—' : String(c)
    stepNum.textContent = step.step === 0 ? '—' : String(step.step)
    ascNum.textContent = String(step.ascResult)
    ascNum.setAttribute('class', 'cco-panel__num' + (step.ascResult === -1 ? ' is-dead' : ' is-asc'))
    descNum.textContent = String(step.descResult)
    descNum.setAttribute('class', 'cco-panel__num' + (step.descResult === -1 ? ' is-dead' : ' is-desc'))

    if (step.phase === 'init') phaseText.textContent = '两块面板：外层面额、内层金额，只差遍历方向'
    else if (isUpdate) {
      phaseText.textContent = step.ascUpdated
        ? '正序读到的是"本轮的新值"，于是能再叠一枚同一硬币'
        : '正序这一步没刷新；逆序读到的永远是"上一轮的老值"'
    } else phaseText.textContent = step.descResult === -1 ? '逆序把每枚硬币都锁成一次 —— 就不再是这道题了' : '正序 = 完全背包，是 LC 322 的正确方向'

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
      delete host.dataset.coinorderMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
