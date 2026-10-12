/**
 * rotOrangeDist.js — 「腐烂的橘子」(LC 994) 时间戳 / 距离场视角的 SVG 渲染层。
 *
 * 布局：左侧 = 网格（空白 = 非橘子，`—` = 还在等待，数字 = 腐烂时刻，
 * 源格带小圆点）；右侧 = 当前盖章分钟、最大时间戳 + 剩余新鲜、
 * 本轮盖章格子；图例行 + 动作横幅 + 底部状态行。
 *
 * 与 rotOrange.js / islands.js 骨架一致：模块级 STYLE_ID + ensureStyles()，
 * dataset 幂等守卫，createPlayer + jumpTo，IntersectionObserver 自动播放。
 */

import { buildRotOrangeDistSteps } from './rotOrangeDistSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'rotorangedist-styles'

const NOTE_Y = 28
const GRID_X = 34
const GRID_Y = 76
const CELL = 46
const CGAP = 8
const RIGHT_X = 214
const RIGHT_W = 412
const MINUTE_Y = 76
const MINUTE_H = 76
const MAX_Y = 162
const MAX_H = 50
const STAMP_Y = 222
const STAMP_H = 90
const LEGEND_Y = 248
const BANNER_Y = 326
const BANNER_H = 40
const PHASE_Y = 392

const PLAY_MS = 1150

const STYLES = `
.rod { display: flex; flex-direction: column; gap: 14px; }
.rod__svg { width: 100%; height: auto; display: block; }

.rod-note {
  fill: var(--rod-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-note--r { text-anchor: end; }

.rod-lbl {
  fill: var(--rod-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.rod-cell__box { stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5; }
.rod-cell--blank .rod-cell__box { fill: var(--rod-blank, #eef2ee); stroke: var(--rod-line, #d8ded6); }
.rod-cell--wait .rod-cell__box { fill: var(--rod-wait, #77a58c); }
.rod-cell--stamped .rod-cell__box { fill: var(--rod-stamped, #c2872f); }
.rod-cell.is-new .rod-cell__box {
  fill: var(--rod-new-fill, #f6ecd8); stroke: var(--rod-ok, #3f6b57); stroke-width: 3.5;
}
.rod-cell__val {
  fill: var(--rod-ink, #1f2a24); font-size: 15px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-cell--blank .rod-cell__val { fill: var(--rod-dim, #b3bbb3); font-weight: 500; }
.rod-cell--wait .rod-cell__val { fill: var(--rod-wait-ink, #24402f); }
.rod-cell--stamped .rod-cell__val { fill: var(--rod-stamped-ink, #3d2a0e); }
.rod-cell.is-new .rod-cell__val { fill: var(--rod-gold, #8a5a1c); }
.rod-src { fill: var(--rod-src, #a45f45); }

.rod-box {
  fill: var(--rod-fill, #ffffff); stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5;
}
.rod-min__label {
  fill: var(--rod-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-min__num {
  fill: var(--rod-ink, #1f2a24); font-size: 30px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-min__num.is-running { fill: var(--rod-gold, #c2872f); }
.rod-min__num.is-neg { fill: var(--rod-hot, #a45f45); }

.rod-max__t {
  fill: var(--rod-ink, #1f2a24); font-size: 13px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-max__t.is-ok { fill: var(--rod-ok, #3f6b57); font-weight: 700; }
.rod-max__num { font-weight: 800; }

.rod-chip__box { fill: var(--rod-fill, #ffffff); stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5; }
.rod-chip__val {
  fill: var(--rod-ink, #1f2a24); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-chip.is-new .rod-chip__box { fill: var(--rod-new-fill, #f6ecd8); stroke: var(--rod-ok, #3f6b57); stroke-width: 2.5; }
.rod-chip.is-new .rod-chip__val { fill: var(--rod-ok, #3f6b57); font-weight: 700; }
.rod-stamp__empty {
  fill: var(--rod-dim, #9aa39c); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.rod-swatch { stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5; }
.rod-legend { fill: var(--rod-muted, #657168); font-size: 11px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rod-banner__box {
  fill: var(--rod-banner, #f4f3ef); stroke: var(--rod-line, #c3c9c2); stroke-width: 1.5;
}
.rod-banner__text {
  fill: var(--rod-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rod-banner__text.is-ok { fill: var(--rod-ok, #3f6b57); }

.rod-phase__text {
  fill: var(--rod-muted, #657168); font-size: 13px; font-weight: 600;
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
export function mountRotOrangeDist(host, options = {}) {
  if (!host || host.dataset.rotOrangeDistMounted === '1') return { destroy() {} }
  host.dataset.rotOrangeDistMounted = '1'
  ensureStyles()

  const steps = buildRotOrangeDistSteps(options)
  const autoplay = options.autoplay !== false
  const { grid, m, n, sources } = steps[0]

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz rod'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg rod__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '腐烂的橘子 LC994 时间戳距离场推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(cellLayer, markLayer)

  const note = mk('text', { class: 'rod-note', x: 26, y: NOTE_Y })
  note.textContent = '每个格子盖「腐烂时刻」的章：数值 = 到最近源的距离'
  markLayer.appendChild(note)
  const goal = mk('text', { class: 'rod-note rod-note--r', x: width - 26, y: NOTE_Y })
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
      const g = mk('g', { class: 'rod-cell' })
      g.appendChild(mk('rect', { class: 'rod-cell__box', x, y, width: CELL, height: CELL, rx: 7 }))
      const val = mk('text', { class: 'rod-cell__val', x: x + CELL / 2, y: y + CELL / 2 })
      g.appendChild(val)
      if (srcSet.has(`${r},${c}`)) {
        g.appendChild(mk('circle', { class: 'rod-src', cx: x + 10, cy: y + 10, r: 4 }))
      }
      cellLayer.appendChild(g)
      rowEls.push({ g, val })
    }
    cellEls.push(rowEls)
  }

  // ── 分钟盒 ──
  markLayer.appendChild(mk('rect', { class: 'rod-box', x: RIGHT_X, y: MINUTE_Y, width: RIGHT_W, height: MINUTE_H, rx: 9 }))
  const minuteLbl = mk('text', { class: 'rod-min__label', x: RIGHT_X + RIGHT_W / 2, y: MINUTE_Y + 18 })
  minuteLbl.textContent = '盖章分钟 minute'
  const minuteNum = mk('text', { class: 'rod-min__num', x: RIGHT_X + RIGHT_W / 2, y: MINUTE_Y + 50 })
  markLayer.append(minuteLbl, minuteNum)

  // ── 最大时间戳 + 剩余新鲜 ──
  markLayer.appendChild(mk('rect', { class: 'rod-box', x: RIGHT_X, y: MAX_Y, width: RIGHT_W, height: MAX_H, rx: 9 }))
  const maxText = mk('text', { class: 'rod-max__t', x: RIGHT_X + 16, y: MAX_Y + MAX_H / 2 })
  markLayer.appendChild(maxText)

  // ── 本轮盖章盒 ──
  markLayer.appendChild(mk('rect', { class: 'rod-box', x: RIGHT_X, y: STAMP_Y, width: RIGHT_W, height: STAMP_H, rx: 9 }))
  const stampTitle = mk('text', { class: 'rod-lbl', x: RIGHT_X + 12, y: STAMP_Y + 16 })
  markLayer.appendChild(stampTitle)
  const stampEmpty = mk('text', { class: 'rod-stamp__empty', x: RIGHT_X + RIGHT_W / 2, y: STAMP_Y + STAMP_H / 2 + 8 })
  stampEmpty.textContent = '（本轮没有新盖章）'
  markLayer.appendChild(stampEmpty)

  const chipW = 64
  const chipH = 24
  const chipGap = 8
  const chipX0 = RIGHT_X + 12
  const chipY0 = STAMP_Y + 30
  const PER_ROW = Math.floor((RIGHT_W - 24 + chipGap) / (chipW + chipGap))
  const ROWS = 2
  const chips = []
  for (let i = 0; i < PER_ROW * ROWS; i += 1) {
    const x = chipX0 + (i % PER_ROW) * (chipW + chipGap)
    const y = chipY0 + Math.floor(i / PER_ROW) * (chipH + chipGap)
    const g = mk('g', { class: 'rod-chip' })
    g.appendChild(mk('rect', { class: 'rod-chip__box', x, y, width: chipW, height: chipH, rx: 5 }))
    const val = mk('text', { class: 'rod-chip__val', x: x + chipW / 2, y: y + chipH / 2 })
    g.appendChild(val)
    markLayer.appendChild(g)
    chips.push({ g, val })
  }

  // ── 图例 ──
  const legend = [
    { fill: '#c2872f', text: '已盖章' },
    { fill: '#77a58c', text: '待盖' },
    { fill: '#eef2ee', text: '空' },
  ]
  let lx = GRID_X
  for (const item of legend) {
    markLayer.appendChild(mk('rect', { class: 'rod-swatch', x: lx, y: LEGEND_Y, width: 18, height: 18, rx: 4, fill: item.fill }))
    const t = mk('text', { class: 'rod-legend', x: lx + 24, y: LEGEND_Y + 9 })
    t.textContent = item.text
    markLayer.appendChild(t)
    lx += 24 + item.text.length * 13 + 12
  }
  markLayer.appendChild(mk('circle', { class: 'rod-src', cx: GRID_X + 8, cy: LEGEND_Y + 26, r: 4 }))
  const srcLegend = mk('text', { class: 'rod-legend', x: GRID_X + 24, y: LEGEND_Y + 35 })
  srcLegend.textContent = '圆点 = 源（章 = 0）'
  markLayer.appendChild(srcLegend)

  // ── 横幅 ──
  markLayer.appendChild(mk('rect', { class: 'rod-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'rod-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  const phaseText = mk('text', { class: 'rod-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const newSet = new Set(step.stamped.map((p) => `${p[0]},${p[1]}`))

    // 网格
    cellEls.forEach((rowEls, r) => {
      rowEls.forEach((el, c) => {
        const key = `${r},${c}`
        const v = step.grid[r][c]
        const st = step.stamp[r][c]
        const cls = ['rod-cell']
        if (v === 0) {
          cls.push('rod-cell--blank')
          el.val.textContent = ''
        } else if (st === null) {
          cls.push('rod-cell--wait')
          el.val.textContent = '—'
        } else {
          cls.push('rod-cell--stamped')
          el.val.textContent = String(st)
        }
        if (step.phase === 'stamp' && newSet.has(key)) cls.push('is-new')
        el.g.setAttribute('class', cls.join(' '))
      })
    })

    // 分钟
    let shownMinute = step.minute
    let running = false
    if (step.phase === 'stamp') {
      running = true
    } else if (step.phase === 'done' && step.answer === -1) {
      shownMinute = '−1'
    } else if (step.phase === 'done') {
      shownMinute = step.answer
    }
    minuteNum.textContent = String(shownMinute)
    minuteNum.setAttribute(
      'class',
      'rod-min__num' + (step.phase === 'done' && step.answer === -1 ? ' is-neg' : running ? ' is-running' : ''),
    )

    // 最大时间戳 + 剩余新鲜
    maxText.textContent = `最大时间戳 max(stamp) = ${step.maxStamp} · 剩余新鲜 fresh = ${step.fresh}`
    maxText.setAttribute('class', 'rod-max__t' + (step.fresh === 0 ? ' is-ok' : ''))

    // 本轮盖章
    const stamped = step.stamped
    stampTitle.textContent = `本轮盖章（第 ${step.minute} 分钟）· ${stamped.length} 个`
    stampEmpty.style.display = step.phase === 'stamp' ? 'none' : ''
    const shown = Math.min(stamped.length, chips.length)
    chips.forEach((chip, i) => {
      if (i >= shown) {
        chip.g.style.display = 'none'
        return
      }
      chip.g.style.display = ''
      const p = stamped[i]
      chip.val.textContent = `(${p[0]},${p[1]}) → ${step.minute}`
      chip.g.setAttribute('class', 'rod-chip is-new')
    })

    // 横幅
    if (step.phase === 'init') {
      banner.textContent = '源盖章 0；其余格子由 BFS 第一次访问时盖章'
      banner.setAttribute('class', 'rod-banner__text')
    } else if (step.phase === 'stamp') {
      banner.textContent = `第 ${step.minute} 分钟：给 ${step.stamped.length} 个格子盖上 ${step.minute}`
      banner.setAttribute('class', 'rod-banner__text' + (step.fresh === 0 ? ' is-ok' : ''))
    } else if (step.answer === -1) {
      banner.textContent = `返回 −1：有新鲜橘子始终没盖上章（够不到）`
      banner.setAttribute('class', 'rod-banner__text')
    } else {
      banner.textContent = `答案 = 最大时间戳 = ${step.answer}`
      banner.setAttribute('class', 'rod-banner__text is-ok')
    }

    // 状态行
    if (step.phase === 'init') phaseText.textContent = '时间戳 = 到最近源的距离 —— 这就是多源 BFS 的不变量'
    else if (step.phase === 'stamp') phaseText.textContent = '第一次访问即定章、之后不再改（BFS 先到的一定最近）'
    else if (step.answer === -1) phaseText.textContent = '还有格子盖不上章 → fresh 不为 0 → 返回 −1'
    else phaseText.textContent = '答案 = fresh 清零时的最大时间戳；源自己的 0 不参与取 max'

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
      delete host.dataset.rotOrangeDistMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
