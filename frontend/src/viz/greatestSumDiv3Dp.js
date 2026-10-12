/**
 * greatestSumDiv3Dp.js — 「可被三整除的最大和」(LC 1262) 取模 dp 视角的 SVG 渲染层。
 *
 * 四段布局：顶部 = 当前处理的元素 x（及其余数）；中部 = dp[0]/dp[1]/dp[2]
 * 三个状态格（来源绿、目标金、不可达虚线灰）；来源→目标的弧线；
 * 横幅 = 转移方程现场取值；底部面板（i / x / rem / 答案）。
 *
 * 与 coinChange.js 的骨架一致：模块级 STYLE_ID + ensureStyles()，
 * dataset 幂等守卫，createPlayer + jumpTo，IntersectionObserver 自动播放。
 */

import { buildGreatestSumDiv3DpSteps, GREATEST_SUM_DIV3_NEG as NEG } from './greatestSumDiv3DpSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'greatestsumdiv3dp-styles'

const NOTE_Y = 28
const ELEM_LBL_Y = 54
const ELEM_Y = 62
const ELEM_H = 44
const DP_LBL_Y = 128
const DP_Y = 138
const DP_H = 58
const ARC_Y = 214
const BANNER_Y = 240
const BANNER_H = 40
const PANEL_Y = 294
const PANEL_H = 50
const PHASE_Y = 362

const PLAY_MS = 1250

const STYLES = `
.gdv { display: flex; flex-direction: column; gap: 14px; }
.gdv__svg { width: 100%; height: auto; display: block; }

.gdv-note {
  fill: var(--gdv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-note--r { text-anchor: end; }

.gdv-lbl {
  fill: var(--gdv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.gdv-elem__box {
  fill: var(--gdv-gold-fill, #fdf3e3); stroke: var(--gdv-gold, #c2872f); stroke-width: 3;
}
.gdv-elem__val {
  fill: var(--gdv-gold, #c2872f); font-size: 18px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-elem__sub {
  fill: var(--gdv-gold, #c2872f); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.gdv-cell__box {
  fill: var(--gdv-fill, #ffffff); stroke: var(--gdv-line, #c3c9c2); stroke-width: 1.5;
}
.gdv-cell__idx {
  fill: var(--gdv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-cell__val {
  fill: var(--gdv-ink, #1f2a24); font-size: 20px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-cell.is-unreach .gdv-cell__box { stroke-dasharray: 3 3; fill: var(--gdv-past, #eef0ec); }
.gdv-cell.is-unreach .gdv-cell__val { fill: var(--gdv-dim, #9aa39c); font-weight: 500; }
.gdv-cell.is-source .gdv-cell__box {
  fill: var(--gdv-ok-fill, #eef5f1); stroke: var(--gdv-ok, #3f6b57); stroke-width: 3;
}
.gdv-cell.is-source .gdv-cell__val { fill: var(--gdv-ok, #3f6b57); }
.gdv-cell.is-target .gdv-cell__box { stroke: var(--gdv-ok, #3f6b57); stroke-width: 2.5; }
.gdv-cell.is-updated .gdv-cell__box {
  fill: var(--gdv-gold-fill, #fdf3e3); stroke: var(--gdv-gold, #c2872f); stroke-width: 3;
}
.gdv-cell.is-updated .gdv-cell__val { fill: var(--gdv-gold, #c2872f); }

.gdv-arc { fill: none; stroke: var(--gdv-ok, #3f6b57); stroke-width: 2; opacity: 0.85; }
.gdv-arc.is-dead { stroke: var(--gdv-dim, #9aa39c); stroke-dasharray: 4 3; opacity: 0.7; }
.gdv-arc__head { fill: var(--gdv-ok, #3f6b57); opacity: 0.85; }
.gdv-arc__head.is-dead { fill: var(--gdv-dim, #9aa39c); opacity: 0.7; }

.gdv-banner__box {
  fill: var(--gdv-banner, #f4f3ef); stroke: var(--gdv-line, #c3c9c2); stroke-width: 1.5;
}
.gdv-banner__text {
  fill: var(--gdv-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-banner__text.is-ok { fill: var(--gdv-ok, #3f6b57); }

.gdv-panel__box {
  fill: var(--gdv-fill, #ffffff); stroke: var(--gdv-line, #c3c9c2); stroke-width: 1.5;
}
.gdv-panel__label {
  fill: var(--gdv-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-panel__num {
  fill: var(--gdv-ink, #1f2a24); font-size: 18px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gdv-panel__num.is-ok { fill: var(--gdv-ok, #3f6b57); }
.gdv-panel__num.is-fresh { fill: var(--gdv-gold, #c2872f); }

.gdv-phase__text {
  fill: var(--gdv-muted, #657168); font-size: 13px; font-weight: 600;
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

const fmt = (v) => (v === NEG || v === null || v === undefined ? '−∞' : String(v))

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{ nums?: number[], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountGreatestSumDiv3Dp(host, options = {}) {
  if (!host || host.dataset.gsdiv3dpMounted === '1') return { destroy() {} }
  host.dataset.gsdiv3dpMounted = '1'
  ensureStyles()

  const steps = buildGreatestSumDiv3DpSteps(options)
  const autoplay = options.autoplay !== false
  const { nums } = steps[0]

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz gdv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg gdv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '可被三整除的最大和 LC1262 取模 dp 推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(cellLayer, markLayer)

  const note = mk('text', { class: 'gdv-note', x: 26, y: NOTE_Y })
  note.textContent = 'dp[j] = 子集和 ≡ j (mod 3) 的最大和；每件只用一次（先快照 old）'
  markLayer.appendChild(note)
  const goal = mk('text', { class: 'gdv-note gdv-note--r', x: width - 26, y: NOTE_Y })
  goal.textContent = `nums = [${nums.join(', ')}]`
  markLayer.appendChild(goal)

  // 当前元素 x
  const elemLbl = mk('text', { class: 'gdv-lbl', x: 26, y: ELEM_LBL_Y })
  elemLbl.textContent = '当前元素'
  markLayer.appendChild(elemLbl)

  const ew = 96
  const ex = (width - ew) / 2
  const elemG = mk('g', {})
  elemG.appendChild(mk('rect', { class: 'gdv-elem__box', x: ex, y: ELEM_Y, width: ew, height: ELEM_H, rx: 8 }))
  const elemVal = mk('text', { class: 'gdv-elem__val', x: ex + ew / 2, y: ELEM_Y + ELEM_H / 2 - 6 })
  const elemSub = mk('text', { class: 'gdv-elem__sub', x: ex + ew / 2, y: ELEM_Y + ELEM_H - 9 })
  elemG.append(elemVal, elemSub)
  markLayer.appendChild(elemG)

  // dp 三个状态格
  const dpLbl = mk('text', { class: 'gdv-lbl', x: 26, y: DP_LBL_Y })
  dpLbl.textContent = 'dp 三格（余 0 / 余 1 / 余 2）'
  markLayer.appendChild(dpLbl)

  const cellW = 160
  const cellGap = 24
  const totalW = 3 * cellW + 2 * cellGap
  const cx0 = (width - totalW) / 2
  const cellX = (j) => cx0 + j * (cellW + cellGap)
  const cellCx = (j) => cellX(j) + cellW / 2

  const dpEls = [0, 1, 2].map((j) => {
    const px = cellX(j)
    const g = mk('g', { class: 'gdv-cell' })
    g.appendChild(mk('rect', { class: 'gdv-cell__box', x: px, y: DP_Y, width: cellW, height: DP_H, rx: 8 }))
    const idxEl = mk('text', { class: 'gdv-cell__idx', x: px + cellW / 2, y: DP_Y + 16 })
    idxEl.textContent = `dp[${j}]　余 ${j}`
    const val = mk('text', { class: 'gdv-cell__val', x: px + cellW / 2, y: DP_Y + DP_H / 2 + 8 })
    g.append(idxEl, val)
    cellLayer.appendChild(g)
    return { g, val }
  })

  // 弧线层（最多 3 条转移）
  const arcLayer = mk('g', {})
  svgRoot.appendChild(arcLayer)
  const arcs = [0, 1, 2].map(() => {
    const g = mk('g', {})
    const path = mk('path', { class: 'gdv-arc', d: '' })
    const head = mk('path', { class: 'gdv-arc__head', d: '' })
    g.append(path, head)
    arcLayer.appendChild(g)
    return { g, path, head }
  })

  // 横幅
  markLayer.appendChild(mk('rect', { class: 'gdv-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'gdv-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  // 面板
  markLayer.appendChild(mk('rect', { class: 'gdv-panel__box', x: 26, y: PANEL_Y, width: width - 52, height: PANEL_H, rx: 9 }))
  const mkStat = (label, cx) => {
    const l = mk('text', { class: 'gdv-panel__label', x: cx, y: PANEL_Y + 14 })
    l.textContent = label
    const v = mk('text', { class: 'gdv-panel__num', x: cx, y: PANEL_Y + 35 })
    markLayer.append(l, v)
    return v
  }
  const iNum = mkStat('i', width / 2 - 190)
  const xNum = mkStat('x', width / 2 - 65)
  const remNum = mkStat('x % 3', width / 2 + 65)
  const resNum = mkStat('答案 dp[0]', width / 2 + 190)

  const phaseText = mk('text', { class: 'gdv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const isFill = step.phase === 'fill'
    const trs = isFill ? step.transitions : []
    const srcSet = new Set(trs.map((t) => t.from))
    const tgtSet = new Set(trs.map((t) => t.to))
    const updSet = new Set(trs.filter((t) => t.ok).map((t) => t.to))

    // 当前元素
    elemG.style.display = isFill ? '' : 'none'
    if (isFill) {
      elemVal.textContent = String(step.x)
      elemSub.textContent = `≡${step.rem}`
    }

    // dp 三格
    dpEls.forEach((el, j) => {
      const cls = ['gdv-cell']
      if (updSet.has(j)) cls.push('is-updated')
      else if (srcSet.has(j)) cls.push('is-source')
      else if (tgtSet.has(j)) cls.push('is-target')
      if (step.dp[j] === NEG) cls.push('is-unreach')
      el.g.setAttribute('class', cls.join(' '))
      el.val.textContent = fmt(step.dp[j])
    })

    // 弧线
    arcs.forEach((arc, k) => {
      const t = trs[k]
      if (!t) {
        arc.g.style.display = 'none'
        return
      }
      arc.g.style.display = ''
      const sx = cellCx(t.from)
      const tx = cellCx(t.to)
      const y = DP_Y + DP_H
      const dip = t.from === t.to ? ARC_Y + 14 : ARC_Y
      arc.path.setAttribute('d', `M ${sx} ${y} Q ${(sx + tx) / 2} ${dip} ${tx} ${y + 1}`)
      const dir = tx > sx ? -1 : 1
      arc.head.setAttribute('d', `M ${tx} ${y + 1} L ${tx + dir * 6} ${y - 9} L ${tx - dir * 6} ${y - 9} Z`)
      const dead = !t.ok
      arc.path.setAttribute('class', 'gdv-arc' + (dead ? ' is-dead' : ''))
      arc.head.setAttribute('class', 'gdv-arc__head' + (dead ? ' is-dead' : ''))
    })

    // 横幅
    if (step.phase === 'init') {
      banner.textContent = 'dp = [0, −∞, −∞]　dp[j] = 子集和 ≡ j (mod 3) 的最大和'
      banner.setAttribute('class', 'gdv-banner__text')
    } else if (isFill) {
      banner.textContent = `dp[(j + ${step.rem}) % 3] = max(dp[...], old[j] + ${step.x})　快照 old = [${step.prevDp.map(fmt).join(', ')}]`
      banner.setAttribute('class', 'gdv-banner__text')
    } else {
      banner.textContent = `答案 = dp[0] = ${step.result}`
      banner.setAttribute('class', 'gdv-banner__text is-ok')
    }

    // 面板
    iNum.textContent = isFill ? String(step.i) : '—'
    xNum.textContent = isFill ? String(step.x) : '—'
    remNum.textContent = isFill ? String(step.rem) : '—'
    resNum.textContent = String(step.result)
    resNum.setAttribute('class', 'gdv-panel__num' + (step.phase === 'done' ? ' is-ok' : isFill && updSet.has(0) ? ' is-fresh' : ''))

    // 底部状态行
    if (step.phase === 'init') phaseText.textContent = '三格状态：dp[0]=0 是底座，余 1 / 余 2 先留 −∞'
    else if (isFill) {
      const nUpd = trs.filter((t) => t.ok).length
      phaseText.textContent = nUpd > 0 ? `本元素刷新了 ${nUpd} 个状态；更新的格子描金` : '本元素没能刷新任何状态（候选都没超过旧值）'
    } else phaseText.textContent = '余 1 / 余 2 是中间产物，被后面的数"救"回余 0'

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
      delete host.dataset.gsdiv3dpMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
