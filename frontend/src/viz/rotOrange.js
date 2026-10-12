/**
 * rotOrange.js — 「腐烂的橘子」(LC 994) 多源 BFS 分层扩散的 SVG 渲染层。
 *
 * 布局：左侧 = 网格（0 空 / 1 新鲜 / 2 腐烂，源格带小圆点；本层金框、
 * 刚腐烂格绿框）；右侧 = 分钟数、剩余新鲜 fresh、队列（待扩散格）三个面板；
 * 图例行 + 动作横幅 + 底部状态行。
 *
 * 与 islands.js 骨架一致：模块级 STYLE_ID + ensureStyles()，
 * dataset 幂等守卫，createPlayer + jumpTo，IntersectionObserver 自动播放。
 */

import { buildRotOrangeSteps } from './rotOrangeSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'rotorange-styles'

const NOTE_Y = 28
const GRID_X = 34
const GRID_Y = 76
const CELL = 46
const CGAP = 8
const RIGHT_X = 214
const RIGHT_W = 412
const MINUTE_Y = 76
const MINUTE_H = 76
const FRESH_Y = 162
const FRESH_H = 50
const QUEUE_Y = 222
const QUEUE_H = 90
const LEGEND_Y = 248
const BANNER_Y = 326
const BANNER_H = 40
const PHASE_Y = 392

const PLAY_MS = 1150

const STYLES = `
.rov { display: flex; flex-direction: column; gap: 14px; }
.rov__svg { width: 100%; height: auto; display: block; }

.rov-note {
  fill: var(--rov-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-note--r { text-anchor: end; }

.rov-lbl {
  fill: var(--rov-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.rov-cell__box { stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5; }
.rov-cell--empty .rov-cell__box { fill: var(--rov-empty, #eef2ee); stroke: var(--rov-line, #d8ded6); }
.rov-cell--fresh .rov-cell__box { fill: var(--rov-fresh, #77a58c); }
.rov-cell--rot .rov-cell__box { fill: var(--rov-rot, #c2872f); }
.rov-cell.is-layer .rov-cell__box { stroke: var(--rov-gold, #8a5a1c); stroke-width: 3.5; }
.rov-cell.is-new .rov-cell__box {
  fill: var(--rov-new-fill, #f6ecd8); stroke: var(--rov-ok, #3f6b57); stroke-width: 3.5;
}
.rov-cell.is-processed .rov-cell__box { stroke: var(--rov-dim, #9aa39c); stroke-width: 2.5; }
.rov-cell__val {
  fill: var(--rov-ink, #1f2a24); font-size: 15px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-cell--empty .rov-cell__val { fill: var(--rov-dim, #b3bbb3); font-weight: 500; }
.rov-cell--rot .rov-cell__val { fill: var(--rov-rot-ink, #3d2a0e); }
.rov-src { fill: var(--rov-src, #a45f45); }

.rov-box {
  fill: var(--rov-fill, #ffffff); stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5;
}
.rov-min__label {
  fill: var(--rov-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-min__num {
  fill: var(--rov-ink, #1f2a24); font-size: 30px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-min__num.is-running { fill: var(--rov-gold, #c2872f); }
.rov-min__num.is-neg { fill: var(--rov-hot, #a45f45); }

.rov-fresh__t {
  fill: var(--rov-ink, #1f2a24); font-size: 13px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-fresh__t.is-zero { fill: var(--rov-ok, #3f6b57); font-weight: 700; }
.rov-fresh__num { font-weight: 800; }

.rov-chip__box { fill: var(--rov-fill, #ffffff); stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5; }
.rov-chip__val {
  fill: var(--rov-ink, #1f2a24); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-chip.is-front .rov-chip__box { fill: var(--rov-gold-fill, #fdf3e3); stroke: var(--rov-gold, #c2872f); stroke-width: 2.5; }
.rov-chip.is-front .rov-chip__val { fill: var(--rov-gold, #c2872f); font-weight: 700; }
.rov-queue__empty {
  fill: var(--rov-dim, #9aa39c); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.rov-swatch { stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5; }
.rov-legend { fill: var(--rov-muted, #657168); font-size: 11px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rov-banner__box {
  fill: var(--rov-banner, #f4f3ef); stroke: var(--rov-line, #c3c9c2); stroke-width: 1.5;
}
.rov-banner__text {
  fill: var(--rov-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rov-banner__text.is-ok { fill: var(--rov-ok, #3f6b57); }

.rov-phase__text {
  fill: var(--rov-muted, #657168); font-size: 13px; font-weight: 600;
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
 * @param {{ grid?: (number|string)[][], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountRotOrange(host, options = {}) {
  if (!host || host.dataset.rotOrangeMounted === '1') return { destroy() {} }
  host.dataset.rotOrangeMounted = '1'
  ensureStyles()

  const steps = buildRotOrangeSteps(options)
  const autoplay = options.autoplay !== false
  const { grid, m, n, sources } = steps[0]

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz rov'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg rov__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '腐烂的橘子 LC994 多源 BFS 推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(cellLayer, markLayer)

  const note = mk('text', { class: 'rov-note', x: 26, y: NOTE_Y })
  note.textContent = '所有腐烂橘子同时入队，每分钟向外扩一圈（多源 BFS）'
  markLayer.appendChild(note)
  const goal = mk('text', { class: 'rov-note rov-note--r', x: width - 26, y: NOTE_Y })
  goal.textContent = `${m} × ${n} 网格`
  markLayer.appendChild(goal)

  // ── 网格 ──
  const srcSet = new Set(sources.map((p) => `${p[0]},${p[1]}`))
  const cellEls = []
  for (let r = 0; r < m; r += 1) {
    const rowEls = []
    for (let c = 0; c < n; c += 1) {
      const x = GRID_X + c * (CELL + CGAP)
      const y = GRID_Y + r * (CELL + CGAP)
      const g = mk('g', { class: 'rov-cell' })
      g.appendChild(mk('rect', { class: 'rov-cell__box', x, y, width: CELL, height: CELL, rx: 7 }))
      const val = mk('text', { class: 'rov-cell__val', x: x + CELL / 2, y: y + CELL / 2 })
      g.appendChild(val)
      if (srcSet.has(`${r},${c}`)) {
        g.appendChild(
          mk('circle', { class: 'rov-src', cx: x + 10, cy: y + 10, r: 4 }),
        )
      }
      cellLayer.appendChild(g)
      rowEls.push({ g, val })
    }
    cellEls.push(rowEls)
  }

  // ── 分钟盒 ──
  markLayer.appendChild(mk('rect', { class: 'rov-box', x: RIGHT_X, y: MINUTE_Y, width: RIGHT_W, height: MINUTE_H, rx: 9 }))
  const minuteLbl = mk('text', { class: 'rov-min__label', x: RIGHT_X + RIGHT_W / 2, y: MINUTE_Y + 18 })
  minuteLbl.textContent = '分钟 minute'
  const minuteNum = mk('text', { class: 'rov-min__num', x: RIGHT_X + RIGHT_W / 2, y: MINUTE_Y + 50 })
  markLayer.append(minuteLbl, minuteNum)

  // ── 剩余新鲜盒 ──
  markLayer.appendChild(mk('rect', { class: 'rov-box', x: RIGHT_X, y: FRESH_Y, width: RIGHT_W, height: FRESH_H, rx: 9 }))
  const freshText = mk('text', { class: 'rov-fresh__t', x: RIGHT_X + 16, y: FRESH_Y + FRESH_H / 2 })
  markLayer.appendChild(freshText)

  // ── 队列盒 ──
  markLayer.appendChild(mk('rect', { class: 'rov-box', x: RIGHT_X, y: QUEUE_Y, width: RIGHT_W, height: QUEUE_H, rx: 9 }))
  const queueTitle = mk('text', { class: 'rov-lbl', x: RIGHT_X + 12, y: QUEUE_Y + 16 })
  markLayer.appendChild(queueTitle)
  const queueEmpty = mk('text', { class: 'rov-queue__empty', x: RIGHT_X + RIGHT_W / 2, y: QUEUE_Y + QUEUE_H / 2 + 8 })
  queueEmpty.textContent = '（队列空）'
  markLayer.appendChild(queueEmpty)

  const chipW = 64
  const chipH = 24
  const chipGap = 8
  const chipX0 = RIGHT_X + 12
  const chipY0 = QUEUE_Y + 30
  const PER_ROW = Math.floor((RIGHT_W - 24 + chipGap) / (chipW + chipGap))
  const ROWS = 2
  const chips = []
  for (let i = 0; i < PER_ROW * ROWS; i += 1) {
    const x = chipX0 + (i % PER_ROW) * (chipW + chipGap)
    const y = chipY0 + Math.floor(i / PER_ROW) * (chipH + chipGap)
    const g = mk('g', { class: 'rov-chip' })
    g.appendChild(mk('rect', { class: 'rov-chip__box', x, y, width: chipW, height: chipH, rx: 5 }))
    const val = mk('text', { class: 'rov-chip__val', x: x + chipW / 2, y: y + chipH / 2 })
    g.appendChild(val)
    markLayer.appendChild(g)
    chips.push({ g, val })
  }

  // ── 图例 ──
  const legend = [
    { fill: '#77a58c', text: '新鲜' },
    { fill: '#c2872f', text: '腐烂' },
    { fill: '#eef2ee', text: '空' },
  ]
  let lx = GRID_X
  for (const item of legend) {
    markLayer.appendChild(mk('rect', { class: 'rov-swatch', x: lx, y: LEGEND_Y, width: 18, height: 18, rx: 4, fill: item.fill }))
    const t = mk('text', { class: 'rov-legend', x: lx + 24, y: LEGEND_Y + 9 })
    t.textContent = item.text
    markLayer.appendChild(t)
    lx += 24 + item.text.length * 13 + 20
  }
  // 源点图例
  markLayer.appendChild(mk('circle', { class: 'rov-src', cx: GRID_X + 8, cy: LEGEND_Y + 26, r: 4 }))
  const srcLegend = mk('text', { class: 'rov-legend', x: GRID_X + 24, y: LEGEND_Y + 35 })
  srcLegend.textContent = '圆点 = 初始腐烂（源）'
  markLayer.appendChild(srcLegend)

  // ── 横幅 ──
  markLayer.appendChild(mk('rect', { class: 'rov-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'rov-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  const phaseText = mk('text', { class: 'rov-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const layerSet = new Set(step.layer.map((p) => `${p[0]},${p[1]}`))
    const newSet = new Set(step.newlyRotted.map((p) => `${p[0]},${p[1]}`))
    const doneSet = new Set(step.processed.map((p) => `${p[0]},${p[1]}`))

    // 网格
    cellEls.forEach((rowEls, r) => {
      rowEls.forEach((el, c) => {
        const key = `${r},${c}`
        const v = step.grid[r][c]
        const cls = ['rov-cell', v === 0 ? 'rov-cell--empty' : v === 1 ? 'rov-cell--fresh' : 'rov-cell--rot']
        if (step.phase === 'layer' && layerSet.has(key)) cls.push('is-layer')
        if (step.phase === 'rot' && doneSet.has(key)) cls.push('is-processed')
        if (step.phase === 'rot' && newSet.has(key)) cls.push('is-new')
        el.g.setAttribute('class', cls.join(' '))
        el.val.textContent = String(v)
      })
    })

    // 分钟
    let shownMinute = step.minute
    let running = false
    if (step.phase === 'layer') {
      shownMinute = step.minute + 1
      running = true
    } else if (step.phase === 'done' && step.answer === -1) {
      shownMinute = '−1'
    } else if (step.phase === 'done') {
      shownMinute = step.answer
    }
    minuteNum.textContent = String(shownMinute)
    minuteNum.setAttribute(
      'class',
      'rov-min__num' + (step.phase === 'done' && step.answer === -1 ? ' is-neg' : running ? ' is-running' : ''),
    )

    // 剩余新鲜
    freshText.textContent = `剩余新鲜 fresh = ${step.fresh}`
    freshText.setAttribute('class', 'rov-fresh__t' + (step.fresh === 0 ? ' is-zero' : ''))

    // 队列
    const frontier = step.queue
    queueTitle.textContent = `队列（待扩散）· 长度 ${frontier.length}`
    queueEmpty.style.display = frontier.length === 0 ? '' : 'none'
    const shown = Math.min(frontier.length, chips.length)
    chips.forEach((chip, i) => {
      if (i >= shown) {
        chip.g.style.display = 'none'
        return
      }
      chip.g.style.display = ''
      const p = frontier[i]
      chip.val.textContent = `(${p[0]},${p[1]})`
      const isFront = step.phase === 'layer' && i === 0
      chip.g.setAttribute('class', 'rov-chip' + (isFront ? ' is-front' : ''))
    })

    // 横幅
    if (step.phase === 'init') {
      banner.textContent = '多源 BFS：所有腐烂橘子一起入队，第 0 分钟'
      banner.setAttribute('class', 'rov-banner__text')
    } else if (step.phase === 'layer') {
      banner.textContent = `第 ${step.minute + 1} 分钟：本层 ${step.layer.length} 个格子同时扩散`
      banner.setAttribute('class', 'rov-banner__text')
    } else if (step.phase === 'rot') {
      banner.textContent =
        step.newlyRotted.length > 0
          ? `第 ${step.minute} 分钟：新腐烂 ${step.newlyRotted.length} 个 · fresh = ${step.fresh}`
          : `第 ${step.minute} 分钟：无新腐烂 —— 队列即将断流`
      banner.setAttribute('class', 'rov-banner__text' + (step.fresh === 0 ? ' is-ok' : ''))
    } else if (step.answer === -1) {
      banner.textContent = `返回 −1：还有 ${step.fresh} 个新鲜橘子够不到`
      banner.setAttribute('class', 'rov-banner__text')
    } else {
      banner.textContent = `答案 = ${step.answer} 分钟`
      banner.setAttribute('class', 'rov-banner__text is-ok')
    }

    // 状态行
    if (step.phase === 'init') phaseText.textContent = '初始就把「所有」腐烂橘子入队 —— 它们是第 0 分钟同时出发的多个源'
    else if (step.phase === 'layer') phaseText.textContent = '整层弹出、统一扩散：同一分钟内的格子互不插队'
    else if (step.phase === 'rot') phaseText.textContent = '入队即标记（变 2 并立刻入队），每个格子最多腐烂一次'
    else if (step.answer === -1) phaseText.textContent = '−1 的判据：BFS 结束后 fresh 仍大于 0，而不是「队列空了」本身'
    else phaseText.textContent = '分钟数在整层扩散完后才 +1；fresh 清零就直接结束'

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
      delete host.dataset.rotOrangeMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
