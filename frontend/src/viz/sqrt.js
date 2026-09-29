/**
 * sqrt.js — 「x 的平方根」(LC 69) 二分解法的 SVG 渲染层。
 *
 * 三段布局：顶部 = 候选格子行 0..x（每格上排 k、下排 k²，
 * 谓词 k²<=x 为真的格子淡绿、为真的灰 —— "前真后假"一眼可见），
 * mid 指针在上、lo/hi 指针在下，ans 绿框；
 * 中部 = 谓词横幅（mid² ? x → 记候选向右 / 向左收缩）；
 * 底部 = ans 候选面板。
 *
 * 通用坑：A / K / V / W / 红线 4。
 */

import { buildSqrtSteps } from './sqrtSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'sqrt-styles'

const NOTE_Y = 34
const MID_LBL_Y = 62
const CELL_Y = 76
const CELL_H = 52
const PTR_Y = CELL_Y + CELL_H + 14
const PTR_LBL_Y = PTR_Y + 16

const BANNER_Y = 178
const BANNER_H = 46
const PANEL_Y = 238
const PANEL_H = 56
const PHASE_Y = 316

const AVAIL = 604
const PLAY_MS = 1400

const STYLES = `
.sqv { display: flex; flex-direction: column; gap: 14px; }
.sqv__svg { width: 100%; height: auto; display: block; }

.sqv-note {
  fill: var(--sqv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-note--r { text-anchor: end; }

.sqv-cell__box {
  fill: var(--sqv-true-fill, #eef5f1); stroke: var(--sqv-line, #c3c9c2); stroke-width: 1.5;
}
.sqv-cell__val {
  fill: var(--sqv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-cell__sub {
  fill: var(--sqv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-cell.is-false .sqv-cell__box { fill: var(--sqv-past, #eef0ec); stroke: var(--sqv-past-line, #d8ddd6); }
.sqv-cell.is-false .sqv-cell__val { fill: var(--sqv-dim, #9aa39c); }
.sqv-cell.is-out .sqv-cell__box { stroke-dasharray: 3 3; }
.sqv-cell.is-mid .sqv-cell__box {
  fill: var(--sqv-gold-fill, #fdf3e3); stroke: var(--sqv-gold, #c2872f); stroke-width: 3;
}
.sqv-cell.is-mid .sqv-cell__val { fill: var(--sqv-gold, #c2872f); }
.sqv-cell.is-ans .sqv-cell__box { stroke: var(--sqv-ok, #3f6b57); stroke-width: 3; }

.sqv-ptr { font-size: 11px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.sqv-ptr--l { fill: var(--sqv-ok, #3f6b57); }
.sqv-ptr--r { fill: var(--sqv-hot, #a45f45); }
.sqv-ptr--m { fill: var(--sqv-gold, #c2872f); }
.sqv-tri--l { fill: var(--sqv-ok, #3f6b57); }
.sqv-tri--r { fill: var(--sqv-hot, #a45f45); }
.sqv-tri--m { fill: var(--sqv-gold, #c2872f); }

.sqv-banner__box {
  fill: var(--sqv-banner, #f4f3ef); stroke: var(--sqv-line, #c3c9c2); stroke-width: 1.5;
}
.sqv-banner__text {
  fill: var(--sqv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-banner__text.is-ok { fill: var(--sqv-ok, #3f6b57); }

.sqv-panel__box {
  fill: var(--sqv-fill, #ffffff); stroke: var(--sqv-line, #c3c9c2); stroke-width: 1.5;
}
.sqv-panel__label {
  fill: var(--sqv-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-panel__num {
  fill: var(--sqv-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.sqv-panel__num.is-fresh { fill: var(--sqv-gold, #c2872f); }
.sqv-panel__num.is-final { fill: var(--sqv-ok, #3f6b57); }
.sqv-panel__note {
  fill: var(--sqv-muted, #657168); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.sqv-phase__text {
  fill: var(--sqv-muted, #657168); font-size: 13px; font-weight: 600;
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
 * @param {{ x?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountSqrt(host, options = {}) {
  if (!host || host.dataset.sqrtMounted === '1') return { destroy() {} }
  host.dataset.sqrtMounted = '1'
  ensureStyles()

  const steps = buildSqrtSteps(options)
  const autoplay = options.autoplay !== false
  const x = steps[0].x

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz sqv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg sqv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': 'x 的平方根 LC69 推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'sqv-note', x: 26, y: NOTE_Y })
  note.textContent = '谓词 P(k) = k² <= x：前真后假，求最后一个真'
  markLayer.appendChild(note)
  const tgt = mk('text', { class: 'sqv-note sqv-note--r', x: width - 26, y: NOTE_Y })
  tgt.textContent = `x = ${x}`
  markLayer.appendChild(tgt)

  // 候选格子行 0..x
  const n = x + 1
  const cw = Math.min(52, Math.floor((AVAIL - (n - 1) * 4) / Math.max(1, n)))
  const gap = 4
  const totalW = n * cw + (n - 1) * gap
  const x0 = (width - totalW) / 2
  const cellEls = []
  for (let k = 0; k <= x; k += 1) {
    const cx = x0 + k * (cw + gap)
    const g = mk('g', { class: 'sqv-cell' })
    g.appendChild(mk('rect', { class: 'sqv-cell__box', x: cx, y: CELL_Y, width: cw, height: CELL_H, rx: 6 }))
    const val = mk('text', { class: 'sqv-cell__val', x: cx + cw / 2, y: CELL_Y + CELL_H / 2 - 9 })
    val.textContent = String(k)
    g.appendChild(val)
    const sub = mk('text', { class: 'sqv-cell__sub', x: cx + cw / 2, y: CELL_Y + CELL_H / 2 + 11 })
    sub.textContent = `${k * k <= 999 ? k * k : '…'}`
    g.appendChild(sub)
    const sub2 = mk('text', { class: 'sqv-cell__sub', x: cx + cw / 2, y: CELL_Y + CELL_H / 2 + 22 })
    sub2.textContent = 'k²'
    g.appendChild(sub2)
    cellLayer.appendChild(g)
    cellEls.push({ g, cx: cx + cw / 2 })
  }

  // mid 指针（上）与 lo/hi 指针（下）
  const midTri = mk('path', { class: 'sqv-tri sqv-tri--m', d: '' })
  const midLbl = mk('text', { class: 'sqv-ptr sqv-ptr--m', x: 0, y: MID_LBL_Y })
  midLbl.textContent = 'mid'
  const lTri = mk('path', { class: 'sqv-tri sqv-tri--l', d: '' })
  const lLbl = mk('text', { class: 'sqv-ptr sqv-ptr--l', x: 0, y: PTR_LBL_Y })
  lLbl.textContent = 'lo'
  const rTri = mk('path', { class: 'sqv-tri sqv-tri--r', d: '' })
  const rLbl = mk('text', { class: 'sqv-ptr sqv-ptr--r', x: 0, y: PTR_LBL_Y })
  rLbl.textContent = 'hi'
  markLayer.append(midTri, midLbl, lTri, lLbl, rTri, rLbl)

  // 谓词横幅
  markLayer.appendChild(mk('rect', { class: 'sqv-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'sqv-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  // ans 面板
  markLayer.appendChild(mk('rect', { class: 'sqv-panel__box', x: 26, y: PANEL_Y, width: width - 52, height: PANEL_H, rx: 9 }))
  const mkStat = (label, cx) => {
    const l = mk('text', { class: 'sqv-panel__label', x: cx, y: PANEL_Y + 15 })
    l.textContent = label
    const v = mk('text', { class: 'sqv-panel__num', x: cx, y: PANEL_Y + 37 })
    markLayer.append(l, v)
    return v
  }
  const loNum = mkStat('lo', width / 2 - 180)
  const hiNum = mkStat('hi', width / 2 - 60)
  const ansNum = mkStat('ans（候选）', width / 2 + 60)
  const chkNote = mk('text', { class: 'sqv-panel__note', x: width / 2 + 195, y: PANEL_Y + 37 })
  markLayer.append(chkNote)

  const phaseText = mk('text', { class: 'sqv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    // 格子：谓词真/假底色 + 区间外虚线 + mid 金框 + ans 绿框
    cellEls.forEach((el, k) => {
      const cls = ['sqv-cell']
      const isMid = step.mid !== null && k === step.mid
      if (k * k > x) cls.push('is-false')
      if ((k < step.lo || k > step.hi) && !isMid) cls.push('is-out')
      if (isMid) cls.push('is-mid')
      else if (k === step.ans && step.ans * step.ans <= x) cls.push('is-ans')
      el.g.setAttribute('class', cls.join(' '))
    })

    // 指针
    const tri = (cx, y, dir) =>
      dir === 'down'
        ? `M ${cx - 6} ${y - 8} L ${cx + 6} ${y - 8} L ${cx} ${y + 1} Z`
        : `M ${cx - 6} ${y + 8} L ${cx + 6} ${y + 8} L ${cx} ${y - 1} Z`
    if (step.mid !== null) {
      const mcx = cellEls[step.mid].cx
      midTri.setAttribute('d', tri(mcx, CELL_Y - 4, 'down'))
      midLbl.setAttribute('x', mcx)
      midTri.style.opacity = '1'; midLbl.style.opacity = '1'
    } else { midTri.setAttribute('d', ''); midTri.style.opacity = '0'; midLbl.style.opacity = '0' }
    const lcx = step.lo <= x ? cellEls[step.lo].cx : cellEls[x].cx + cw + gap
    const hcx = step.hi >= 0 ? cellEls[step.hi].cx : cellEls[0].cx - cw - gap
    lTri.setAttribute('d', tri(lcx, PTR_Y, 'up')); lLbl.setAttribute('x', lcx)
    rTri.setAttribute('d', tri(hcx, PTR_Y, 'up')); rLbl.setAttribute('x', hcx)
    lLbl.textContent = step.lo > step.hi ? 'lo>hi' : 'lo'

    // 横幅
    if (step.phase === 'probe') {
      const sign = step.le ? '<=' : '>'
      const act = step.le
        ? `记 ans = ${step.mid}，lo = ${step.lo} 继续向右`
        : `hi = ${step.hi}（mid 及右边全 false）`
      banner.textContent = `${step.mid}² = ${step.sq} ${sign} ${x}  →  ${act}`
      banner.setAttribute('class', 'sqv-banner__text' + (step.le ? ' is-ok' : ''))
    } else if (step.phase === 'done') {
      banner.textContent = `区间空 → ⌊√${x}⌋ = ${step.ans}`
      banner.setAttribute('class', 'sqv-banner__text is-ok')
    } else {
      banner.textContent = `候选区间 [0, ${x}]：绿色=满足 k²<=${x}，灰色=不满足`
      banner.setAttribute('class', 'sqv-banner__text')
    }

    // 面板
    loNum.textContent = String(step.lo)
    hiNum.textContent = String(step.hi)
    loNum.setAttribute('class', 'sqv-panel__num' + (step.action === 'record_right' ? ' is-fresh' : ''))
    hiNum.setAttribute('class', 'sqv-panel__num' + (step.action === 'go_left' ? ' is-fresh' : ''))
    ansNum.textContent = String(step.ans)
    ansNum.setAttribute(
      'class',
      'sqv-panel__num' + (step.done ? ' is-final' : step.action === 'record_right' ? ' is-fresh' : ''),
    )
    chkNote.textContent = `校验 ${step.ans}² = ${step.ans * step.ans} <= ${x}，(${step.ans}+1)² = ${(step.ans + 1) * (step.ans + 1)} > ${x}？`

    // 底部状态行
    if (step.phase === 'init') phaseText.textContent = '答案不在数组里，答案在谓词的边界上'
    else if (step.action === 'record_right') phaseText.textContent = '成立不收工：记候选，继续向右找更大的'
    else if (step.action === 'go_left') phaseText.textContent = '不成立：mid 及右边整段出局'
    else phaseText.textContent = '区间空 → ans 即最后一个真 = ⌊√x⌋'

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
      delete host.dataset.sqrtMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
