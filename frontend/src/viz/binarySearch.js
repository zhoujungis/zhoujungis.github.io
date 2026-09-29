/**
 * binarySearch.js — 「二分查找」(LC 704) 的 SVG 渲染层。
 *
 * 三段布局：顶部 = 有序数组格子行（窗口内正常 / 窗口外变灰 / mid 金框），
 * mid 指针在上方、left/right 指针在下方；
 * 中部 = 比较横幅（nums[mid] ? target → 边界怎么动）；
 * 底部 = 区间状态面板（[left, right]、大小、累计排除数）。
 *
 * 通用坑：A / K / V / W / 红线 4。
 */

import { buildBinarySearchSteps } from './binarySearchSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'binarysearch-styles'

const NOTE_Y = 34
const MID_LBL_Y = 62
const CELL_Y = 76
const CELL_H = 42
const PTR_Y = CELL_Y + CELL_H + 14
const PTR_LBL_Y = PTR_Y + 16

const BANNER_Y = 168
const BANNER_H = 46
const PANEL_Y = 228
const PANEL_H = 56
const PHASE_Y = 306

const AVAIL = 604
const PLAY_MS = 1400

const STYLES = `
.bsv { display: flex; flex-direction: column; gap: 14px; }
.bsv__svg { width: 100%; height: auto; display: block; }

.bsv-note {
  fill: var(--bsv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-note--r { text-anchor: end; }

.bsv-cell__box {
  fill: var(--bsv-fill, #ffffff); stroke: var(--bsv-line, #c3c9c2); stroke-width: 1.5;
}
.bsv-cell__val {
  fill: var(--bsv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-cell__idx {
  fill: var(--bsv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-cell.is-out .bsv-cell__box { fill: var(--bsv-past, #eef0ec); stroke: var(--bsv-past-line, #d8ddd6); }
.bsv-cell.is-out .bsv-cell__val { fill: var(--bsv-dim, #9aa39c); }
.bsv-cell.is-mid .bsv-cell__box {
  fill: var(--bsv-gold-fill, #fdf3e3); stroke: var(--bsv-gold, #c2872f); stroke-width: 3;
}
.bsv-cell.is-mid .bsv-cell__val { fill: var(--bsv-gold, #c2872f); }
.bsv-cell.is-hit .bsv-cell__box {
  fill: var(--bsv-ok-fill, #eef5f1); stroke: var(--bsv-ok, #3f6b57); stroke-width: 3;
}
.bsv-cell.is-hit .bsv-cell__val { fill: var(--bsv-ok, #3f6b57); }

.bsv-ptr { font-size: 11px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.bsv-ptr--l { fill: var(--bsv-ok, #3f6b57); }
.bsv-ptr--r { fill: var(--bsv-hot, #a45f45); }
.bsv-ptr--m { fill: var(--bsv-gold, #c2872f); }
.bsv-tri--l { fill: var(--bsv-ok, #3f6b57); }
.bsv-tri--r { fill: var(--bsv-hot, #a45f45); }
.bsv-tri--m { fill: var(--bsv-gold, #c2872f); }

.bsv-banner__box {
  fill: var(--bsv-banner, #f4f3ef); stroke: var(--bsv-line, #c3c9c2); stroke-width: 1.5;
}
.bsv-banner__text {
  fill: var(--bsv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-banner__text.is-ok { fill: var(--bsv-ok, #3f6b57); }

.bsv-panel__box {
  fill: var(--bsv-fill, #ffffff); stroke: var(--bsv-line, #c3c9c2); stroke-width: 1.5;
}
.bsv-panel__label {
  fill: var(--bsv-muted, #657168); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-panel__num {
  fill: var(--bsv-ink, #1f2a24); font-size: 19px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.bsv-panel__num.is-fresh { fill: var(--bsv-gold, #c2872f); }
.bsv-panel__num.is-final { fill: var(--bsv-ok, #3f6b57); }

.bsv-phase__text {
  fill: var(--bsv-muted, #657168); font-size: 13px; font-weight: 600;
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
 * @param {{ nums?: number[], target?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountBinarySearch(host, options = {}) {
  if (!host || host.dataset.binarysearchMounted === '1') return { destroy() {} }
  host.dataset.binarysearchMounted = '1'
  ensureStyles()

  const steps = buildBinarySearchSteps(options)
  const autoplay = options.autoplay !== false
  const nums = steps[0].nums
  const target = steps[0].target

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz bsv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg bsv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '二分查找 LC704 推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'bsv-note', x: 26, y: NOTE_Y })
  note.textContent = '不变量：target 若在数组里，下标恒在 [left, right]'
  markLayer.appendChild(note)
  const tgt = mk('text', { class: 'bsv-note bsv-note--r', x: width - 26, y: NOTE_Y })
  tgt.textContent = `target = ${target}`
  markLayer.appendChild(tgt)

  // 数组格子行
  const n = nums.length
  const cw = Math.min(46, Math.floor((AVAIL - (n - 1) * 4) / Math.max(1, n)))
  const gap = 4
  const totalW = n * cw + (n - 1) * gap
  const x0 = (width - totalW) / 2
  const cellEls = nums.map((v, idx) => {
    const x = x0 + idx * (cw + gap)
    const g = mk('g', { class: 'bsv-cell' })
    g.appendChild(mk('rect', { class: 'bsv-cell__box', x, y: CELL_Y, width: cw, height: CELL_H, rx: 6 }))
    const val = mk('text', { class: 'bsv-cell__val', x: x + cw / 2, y: CELL_Y + CELL_H / 2 - 5 })
    val.textContent = String(v)
    g.appendChild(val)
    const idxEl = mk('text', { class: 'bsv-cell__idx', x: x + cw / 2, y: CELL_Y + CELL_H / 2 + 12 })
    idxEl.textContent = String(idx)
    g.appendChild(idxEl)
    cellLayer.appendChild(g)
    return { g, cx: x + cw / 2 }
  })

  // mid 指针（上）与 left/right 指针（下）
  const midTri = mk('path', { class: 'bsv-tri bsv-tri--m', d: '' })
  const midLbl = mk('text', { class: 'bsv-ptr bsv-ptr--m', x: 0, y: MID_LBL_Y })
  midLbl.textContent = 'mid'
  const lTri = mk('path', { class: 'bsv-tri bsv-tri--l', d: '' })
  const lLbl = mk('text', { class: 'bsv-ptr bsv-ptr--l', x: 0, y: PTR_LBL_Y })
  lLbl.textContent = 'left'
  const rTri = mk('path', { class: 'bsv-tri bsv-tri--r', d: '' })
  const rLbl = mk('text', { class: 'bsv-ptr bsv-ptr--r', x: 0, y: PTR_LBL_Y })
  rLbl.textContent = 'right'
  markLayer.append(midTri, midLbl, lTri, lLbl, rTri, rLbl)

  // 比较横幅
  markLayer.appendChild(mk('rect', { class: 'bsv-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'bsv-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  // 区间状态面板
  markLayer.appendChild(mk('rect', { class: 'bsv-panel__box', x: 26, y: PANEL_Y, width: width - 52, height: PANEL_H, rx: 9 }))
  const mkStat = (label, cx) => {
    const l = mk('text', { class: 'bsv-panel__label', x: cx, y: PANEL_Y + 15 })
    l.textContent = label
    const v = mk('text', { class: 'bsv-panel__num', x: cx, y: PANEL_Y + 37 })
    markLayer.append(l, v)
    return v
  }
  const loNum = mkStat('left', width / 2 - 165)
  const hiNum = mkStat('right', width / 2 - 55)
  const sizeNum = mkStat('区间大小', width / 2 + 55)
  const elimNum = mkStat('已排除', width / 2 + 165)

  const phaseText = mk('text', { class: 'bsv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    // 格子：mid 金框（found 绿框），窗口外变灰
    cellEls.forEach((el, idx) => {
      const cls = ['bsv-cell']
      if (step.mid !== null && idx === step.mid) cls.push(step.action === 'found' ? 'is-hit' : 'is-mid')
      else if (idx < step.left || idx > step.right) cls.push('is-out')
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
    const lcx = step.left < n ? cellEls[step.left].cx : cellEls[n - 1].cx + cw + gap
    const rcx = step.right >= 0 ? cellEls[step.right].cx : cellEls[0].cx - cw - gap
    lTri.setAttribute('d', tri(lcx, PTR_Y, 'up')); lLbl.setAttribute('x', lcx)
    rTri.setAttribute('d', tri(rcx, PTR_Y, 'up')); rLbl.setAttribute('x', rcx)
    const crossed = step.left > step.right
    lLbl.textContent = crossed ? 'left>right' : 'left'
    rLbl.textContent = 'right'

    // 横幅
    if (step.phase === 'probe') {
      const sign = step.cmp < 0 ? '<' : step.cmp > 0 ? '>' : '='
      const act =
        step.action === 'found'
          ? `命中 → 返回 ${step.mid}`
          : step.action === 'go_right'
            ? `left = mid + 1 = ${step.left}（排除 ${step.eliminated} 个）`
            : `right = mid - 1 = ${step.right}（排除 ${step.eliminated} 个）`
      banner.textContent = `nums[${step.mid}] = ${step.value} ${sign} ${target}  →  ${act}`
      banner.setAttribute('class', 'bsv-banner__text' + (step.action === 'found' ? ' is-ok' : ''))
    } else if (step.phase === 'done') {
      banner.textContent = step.found ? `返回下标 ${step.result}` : `区间空 → 返回 -1`
      banner.setAttribute('class', 'bsv-banner__text' + (step.found ? ' is-ok' : ''))
    } else {
      banner.textContent = `开局：整个数组都是嫌疑区 [0, ${n - 1}]`
      banner.setAttribute('class', 'bsv-banner__text')
    }

    // 面板
    loNum.textContent = String(step.left)
    hiNum.textContent = String(step.right)
    loNum.setAttribute('class', 'bsv-panel__num' + (step.action === 'go_right' ? ' is-fresh' : ''))
    hiNum.setAttribute('class', 'bsv-panel__num' + (step.action === 'go_left' ? ' is-fresh' : ''))
    sizeNum.textContent = String(Math.max(0, step.right - step.left + 1))
    let elimTotal = 0
    for (let i = 1; i <= _index; i += 1) elimTotal += steps[i].eliminated || 0
    elimNum.textContent = String(elimTotal)

    // 底部状态行
    if (step.phase === 'init') phaseText.textContent = '每轮砍一半，但绝不误伤不变量'
    else if (step.action === 'go_right') phaseText.textContent = 'nums[mid] < target → 左半（含 mid）整段出局'
    else if (step.action === 'go_left') phaseText.textContent = 'nums[mid] > target → 右半（含 mid）整段出局'
    else if (step.action === 'found') phaseText.textContent = '找特定值：命中即返回'
    else phaseText.textContent = 'O(log n)：每探一次，嫌疑减半'

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
      delete host.dataset.binarysearchMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
