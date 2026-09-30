/**
 * coinChange.js — 「零钱兑换」(LC 322) 的 SVG 渲染层。
 *
 * 四段布局：顶部 = dp 格子行（0..amount 全部金额，当前金额金框、
 * 来源格绿框、底部一条弧线把来源指向当前）；中部 = 候选硬币行
 * （每枚硬币一格：dp[x-c] + 1 的现场打分，获胜者描金）；横幅 = 转移方程；
 * 底部 = dp[a] / fromCoin / result 面板。
 *
 * 回溯帧会把"已锁定的硬币"摆在候选行里 —— 只记枚数还原不出组合，
 * 靠 chosen 前驱表一步步走回 0。
 *
 * 通用坑：A / K / V / W / 红线 4（照抄 stockI.js 的骨架）。
 */

import { buildCoinChangeSteps } from './coinChangeSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'coinchange-styles'

const INF = Infinity

const NOTE_Y = 30
const CELL_Y = 56
const CELL_H = 44
const ARC_Y = 108
const TRIAL_Y = 120
const TRIAL_H = 48
const BANNER_Y = 184
const BANNER_H = 44
const PANEL_Y = 242
const PANEL_H = 54
const PHASE_Y = 316

const AVAIL = 604
const PLAY_MS = 1350

const STYLES = `
.ccv { display: flex; flex-direction: column; gap: 14px; }
.ccv__svg { width: 100%; height: auto; display: block; }

.ccv-note {
  fill: var(--ccv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-note--r { text-anchor: end; }

.ccv-cell__box {
  fill: var(--ccv-fill, #ffffff); stroke: var(--ccv-line, #c3c9c2); stroke-width: 1.5;
}
.ccv-cell__val {
  fill: var(--ccv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-cell__idx {
  fill: var(--ccv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-cell.is-past .ccv-cell__box { fill: var(--ccv-past, #eef0ec); }
.ccv-cell.is-unreach .ccv-cell__val { fill: var(--ccv-dim, #9aa39c); font-weight: 500; }
.ccv-cell.is-unreach .ccv-cell__box { stroke-dasharray: 3 3; }
.ccv-cell.is-source .ccv-cell__box {
  fill: var(--ccv-ok-fill, #eef5f1); stroke: var(--ccv-ok, #3f6b57); stroke-width: 3;
}
.ccv-cell.is-source .ccv-cell__val { fill: var(--ccv-ok, #3f6b57); }
.ccv-cell.is-target .ccv-cell__box {
  fill: var(--ccv-gold-fill, #fdf3e3); stroke: var(--ccv-gold, #c2872f); stroke-width: 3;
}
.ccv-cell.is-target .ccv-cell__val { fill: var(--ccv-gold, #c2872f); }
.ccv-cell.is-locked .ccv-cell__box {
  fill: var(--ccv-ok-fill, #eef5f1); stroke: var(--ccv-ok, #3f6b57); stroke-width: 2.5;
}
.ccv-cell.is-locked .ccv-cell__val { fill: var(--ccv-ok, #3f6b57); }

.ccv-arc { fill: none; stroke: var(--ccv-ok, #3f6b57); stroke-width: 2; opacity: 0.85; }
.ccv-arc__head { fill: var(--ccv-ok, #3f6b57); opacity: 0.85; }

.ccv-trial__box {
  fill: var(--ccv-fill, #ffffff); stroke: var(--ccv-line, #c3c9c2); stroke-width: 1.5;
}
.ccv-trial.is-win .ccv-trial__box { stroke: var(--ccv-gold, #c2872f); stroke-width: 3;
  fill: var(--ccv-gold-fill, #fdf3e3); }
.ccv-trial.is-dead .ccv-trial__box { stroke-dasharray: 3 3; fill: var(--ccv-past, #eef0ec); }
.ccv-trial__coin {
  fill: var(--ccv-ink, #1f2a24); font-size: 16px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-trial.is-win .ccv-trial__coin { fill: var(--ccv-gold, #c2872f); }
.ccv-trial__expr {
  fill: var(--ccv-muted, #657168); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-trial.is-win .ccv-trial__expr { fill: var(--ccv-gold, #c2872f); font-weight: 700; }
.ccv-trial__cap {
  fill: var(--ccv-dim, #9aa39c); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.ccv-banner__box {
  fill: var(--ccv-banner, #f4f3ef); stroke: var(--ccv-line, #c3c9c2); stroke-width: 1.5;
}
.ccv-banner__text {
  fill: var(--ccv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-banner__text.is-ok { fill: var(--ccv-ok, #3f6b57); }

.ccv-panel__box {
  fill: var(--ccv-fill, #ffffff); stroke: var(--ccv-line, #c3c9c2); stroke-width: 1.5;
}
.ccv-panel__label {
  fill: var(--ccv-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-panel__num {
  fill: var(--ccv-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ccv-panel__num.is-fresh { fill: var(--ccv-gold, #c2872f); }
.ccv-panel__num.is-final { fill: var(--ccv-ok, #3f6b57); }
.ccv-panel__num.is-dead { fill: var(--ccv-dim, #9aa39c); }

.ccv-phase__text {
  fill: var(--ccv-muted, #657168); font-size: 13px; font-weight: 600;
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
export function mountCoinChange(host, options = {}) {
  if (!host || host.dataset.coinchangeMounted === '1') return { destroy() {} }
  host.dataset.coinchangeMounted = '1'
  ensureStyles()

  const steps = buildCoinChangeSteps(options)
  const autoplay = options.autoplay !== false
  const coins = steps[0].coins
  const amount = steps[0].amount

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz ccv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg ccv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '零钱兑换 LC322 推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'ccv-note', x: 26, y: NOTE_Y })
  note.textContent = '正序推进金额：来源格下标更小、可能已用过这枚硬币'
  markLayer.appendChild(note)
  const tgt = mk('text', { class: 'ccv-note ccv-note--r', x: width - 26, y: NOTE_Y })
  tgt.textContent = `硬币 [${coins.join(', ')}] · 目标 ${amount}`
  markLayer.appendChild(tgt)

  // dp 格子行（0..amount）
  const n = amount + 1
  const gap = 5
  const cw = Math.min(52, Math.floor((AVAIL - (n - 1) * gap) / Math.max(1, n)))
  const totalW = n * cw + (n - 1) * gap
  const x0 = (width - totalW) / 2
  const cellEls = []
  for (let x = 0; x <= amount; x += 1) {
    const px = x0 + x * (cw + gap)
    const g = mk('g', { class: 'ccv-cell' })
    g.appendChild(mk('rect', { class: 'ccv-cell__box', x: px, y: CELL_Y, width: cw, height: CELL_H, rx: 6 }))
    const val = mk('text', { class: 'ccv-cell__val', x: px + cw / 2, y: CELL_Y + CELL_H / 2 - 6 })
    g.appendChild(val)
    const idxEl = mk('text', { class: 'ccv-cell__idx', x: px + cw / 2, y: CELL_Y + CELL_H / 2 + 13 })
    idxEl.textContent = String(x)
    g.appendChild(idxEl)
    cellLayer.appendChild(g)
    cellEls.push({ g, val, cx: px + cw / 2, x: px })
  }

  // 来源 → 当前 的弧线
  const arc = mk('path', { class: 'ccv-arc', d: '' })
  const arcHead = mk('path', { class: 'ccv-arc__head', d: '' })
  markLayer.append(arc, arcHead)

  // 候选硬币行
  const capText = mk('text', { class: 'ccv-trial__cap', x: 26, y: TRIAL_Y - 2 })
  capText.setAttribute('text-anchor', 'start')
  markLayer.appendChild(capText)

  const k = coins.length
  const tw = Math.min(160, Math.floor((AVAIL - (k - 1) * 10) / Math.max(1, k)))
  const tGap = 10
  const tTotal = k * tw + (k - 1) * tGap
  const tx0 = (width - tTotal) / 2
  const trialEls = coins.map((c, i) => {
    const x = tx0 + i * (tw + tGap)
    const g = mk('g', { class: 'ccv-trial' })
    g.appendChild(mk('rect', { class: 'ccv-trial__box', x, y: TRIAL_Y, width: tw, height: TRIAL_H, rx: 7 }))
    const coin = mk('text', { class: 'ccv-trial__coin', x: x + tw / 2, y: TRIAL_Y + 16 })
    coin.textContent = String(c)
    g.appendChild(coin)
    const expr = mk('text', { class: 'ccv-trial__expr', x: x + tw / 2, y: TRIAL_Y + 34 })
    g.appendChild(expr)
    markLayer.appendChild(g)
    return { g, coin, expr }
  })

  // 转移方程横幅
  markLayer.appendChild(mk('rect', { class: 'ccv-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'ccv-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  // 面板
  markLayer.appendChild(mk('rect', { class: 'ccv-panel__box', x: 26, y: PANEL_Y, width: width - 52, height: PANEL_H, rx: 9 }))
  const mkStat = (label, cx) => {
    const l = mk('text', { class: 'ccv-panel__label', x: cx, y: PANEL_Y + 15 })
    l.textContent = label
    const v = mk('text', { class: 'ccv-panel__num', x: cx, y: PANEL_Y + 37 })
    markLayer.append(l, v)
    return v
  }
  const aNum = mkStat('金额 a', width / 2 - 190)
  const dpNum = mkStat('dp[a]', width / 2 - 65)
  const fromNum = mkStat('fromCoin', width / 2 + 65)
  const resNum = mkStat('result', width / 2 + 190)

  const phaseText = mk('text', { class: 'ccv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const lockedIdx = new Set()
    if (step.phase === 'trace') {
      let cur = amount
      for (const c of step.picked) {
        lockedIdx.add(cur)
        cur -= c
      }
      lockedIdx.add(0)
    }

    cellEls.forEach((el, x) => {
      const cls = ['ccv-cell']
      const isTarget = x === step.a
      const isSource = step.sourceIdx !== null && x === step.sourceIdx
      if (isTarget) cls.push('is-target')
      else if (isSource) cls.push('is-source')
      else if (step.phase === 'trace' && lockedIdx.has(x)) cls.push('is-locked')
      else if (step.phase === 'fill' && x < step.a) cls.push('is-past')
      if (step.dp[x] === INF) cls.push('is-unreach')
      el.g.setAttribute('class', cls.join(' '))
      el.val.textContent = fmt(step.dp[x])
    })

    // 来源弧线
    if (step.sourceIdx !== null && step.sourceIdx !== step.a) {
      const sx = cellEls[step.sourceIdx].cx
      const tx = cellEls[step.a].cx
      arc.setAttribute('d', `M ${sx} ${CELL_Y + CELL_H} Q ${(sx + tx) / 2} ${ARC_Y} ${tx} ${CELL_Y + CELL_H + 1}`)
      const dir = tx > sx ? -1 : 1
      arcHead.setAttribute(
        'd',
        `M ${tx} ${CELL_Y + CELL_H + 1} L ${tx + dir * 6} ${CELL_Y + CELL_H - 5} L ${tx - dir * 6} ${CELL_Y + CELL_H - 5} Z`,
      )
    } else {
      arc.setAttribute('d', '')
      arcHead.setAttribute('d', '')
    }

    // 候选硬币行
    if (step.phase === 'fill') {
      capText.textContent = `试每一枚当"最后一枚"：`
      trialEls.forEach((el, i) => {
        const t = step.trials[i]
        el.g.style.display = ''
        el.g.setAttribute('class', 'ccv-trial' + (t.ok ? ' is-win' : t.idx < 0 || !t.reachable ? ' is-dead' : ''))
        el.coin.textContent = String(t.coin)
        el.expr.textContent =
          t.idx < 0 ? `${t.coin} > ${step.a} 跳过` : `dp[${t.idx}]+1 = ${fmt(t.value)}`
      })
    } else if (step.phase === 'trace') {
      capText.textContent = `前驱链已锁定：`
      trialEls.forEach((el, i) => {
        const v = step.picked[i]
        if (v === undefined) {
          el.g.style.display = 'none'
          return
        }
        el.g.style.display = ''
        el.g.setAttribute('class', 'ccv-trial is-win')
        el.coin.textContent = String(v)
        el.expr.textContent = `第 ${i + 1} 枚`
      })
    } else {
      capText.textContent = ''
      trialEls.forEach((el) => { el.g.style.display = 'none' })
    }

    // 横幅
    if (step.phase === 'fill') {
      const parts = step.trials
        .filter((t) => t.idx >= 0)
        .map((t) => `dp[${t.idx}]+1=${fmt(t.value)}`)
      banner.textContent = `dp[${step.a}] = min(${parts.join(', ')}) = ${fmt(step.dp[step.a])}`
      banner.setAttribute('class', 'ccv-banner__text' + (step.fromCoin !== null ? ' is-ok' : ''))
    } else if (step.phase === 'trace') {
      banner.textContent = `回溯：dp[${step.a}] = dp[${step.sourceIdx}] + 1 = ${fmt(step.dp[step.sourceIdx])} + 1 = ${fmt(step.dp[step.a])}`
      banner.setAttribute('class', 'ccv-banner__text is-ok')
    } else if (step.phase === 'done') {
      banner.textContent =
        step.result === -1
          ? `答案 = -1：dp[${amount}] = ∞，任何组合都凑不出`
          : `答案 = ${step.result}：${step.combination.join(' + ')} = ${amount}`
      banner.setAttribute('class', 'ccv-banner__text' + (step.result === -1 ? '' : ' is-ok'))
    } else {
      banner.textContent = `开局：dp[0] = 0，其余全是 ∞`
      banner.setAttribute('class', 'ccv-banner__text')
    }

    // 面板
    aNum.textContent = step.a < 0 ? '—' : String(step.a)
    dpNum.textContent = step.a < 0 ? fmt(step.dp[amount]) : fmt(step.dp[step.a])
    dpNum.setAttribute(
      'class',
      'ccv-panel__num' +
        (step.a >= 0 && step.dp[step.a] !== INF ? ' is-fresh' : '') +
        (step.a >= 0 && step.dp[step.a] === INF ? ' is-dead' : '') +
        (step.phase === 'done' && step.result !== -1 ? ' is-final' : ''),
    )
    fromNum.textContent = step.phase === 'fill' ? (step.fromCoin === null ? '—' : String(step.fromCoin)) : step.traceCoin === null ? '—' : String(step.traceCoin)
    resNum.textContent = String(step.result)
    resNum.setAttribute('class', 'ccv-panel__num' + (step.phase === 'done' ? (step.result === -1 ? ' is-dead' : ' is-final') : ''))

    // 底部状态行
    if (step.phase === 'init') phaseText.textContent = 'dp[x] = 凑出金额 x 的最少硬币枚数'
    else if (step.phase === 'fill') {
      phaseText.textContent = step.fromCoin === null ? '这枚金额此刻还凑不出 → 保持 ∞' : `dp[${step.a}] 由硬币 ${step.fromCoin} 从 dp[${step.sourceIdx}] 转移而来`
    } else if (step.phase === 'trace') phaseText.textContent = '顺 chosen 前驱表走回 dp[0]，路径就是最优组合'
    else phaseText.textContent = step.result === -1 ? '∞ 在 min 里一路沉底，最后原样返回' : '只记枚数还原不出组合 —— 前驱表才带得回硬币'

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
      delete host.dataset.coinchangeMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
