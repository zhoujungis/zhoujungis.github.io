/**
 * islands.js — 「岛屿数量」(LC 200) 染色法（DFS）的 SVG 渲染层。
 *
 * 布局：左侧 = 网格（陆地深色 / 水浅色 / 已访问染灰，当前格金框、新压栈格绿框）；
 * 右上 = 岛屿计数；右下 = 显式栈（底 → 顶，栈顶在右，标注当前深度）；
 * 图例行 + 动作横幅 + 底部状态行。
 *
 * 与 coinChange.js 骨架一致：模块级 STYLE_ID + ensureStyles()，
 * dataset 幂等守卫，createPlayer + jumpTo，IntersectionObserver 自动播放。
 */

import { buildIslandsSteps } from './islandsSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'islands-styles'

const NOTE_Y = 28
const GRID_X = 30
const GRID_Y = 74
const CELL = 40
const CGAP = 6
const RIGHT_X = 300
const RIGHT_W = 334
const COUNT_Y = 74
const COUNT_H = 76
const STACK_Y = 162
const STACK_H = 90
const LEGEND_Y = 268
const BANNER_Y = 292
const BANNER_H = 40
const PHASE_Y = 360

const PLAY_MS = 1150

const STYLES = `
.giv { display: flex; flex-direction: column; gap: 14px; }
.giv__svg { width: 100%; height: auto; display: block; }

.giv-note {
  fill: var(--giv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-note--r { text-anchor: end; }

.giv-lbl {
  fill: var(--giv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.giv-cell__box { stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5; }
.giv-cell--land .giv-cell__box { fill: var(--giv-land, #79a892); }
.giv-cell--water .giv-cell__box { fill: var(--giv-water, #eef2ee); stroke: var(--giv-line, #d8ded6); }
.giv-cell--seen .giv-cell__box { fill: var(--giv-seen, #c7cfc8); }
.giv-cell.is-pushed .giv-cell__box { stroke: var(--giv-ok, #3f6b57); stroke-width: 3; }
.giv-cell.is-cur .giv-cell__box { stroke: var(--giv-gold, #c2872f); stroke-width: 3.5; }
.giv-cell__val {
  fill: var(--giv-ink, #1f2a24); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-cell--water .giv-cell__val { fill: var(--giv-dim, #aab2ab); font-weight: 500; }

.giv-box {
  fill: var(--giv-fill, #ffffff); stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5;
}
.giv-count__label {
  fill: var(--giv-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-count__num {
  fill: var(--giv-ok, #3f6b57); font-size: 30px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-count__num.is-bumped { fill: var(--giv-gold, #c2872f); }

.giv-chip__box { fill: var(--giv-fill, #ffffff); stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5; }
.giv-chip.is-top .giv-chip__box {
  fill: var(--giv-gold-fill, #fdf3e3); stroke: var(--giv-gold, #c2872f); stroke-width: 2.5;
}
.giv-chip__val {
  fill: var(--giv-ink, #1f2a24); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-chip.is-top .giv-chip__val { fill: var(--giv-gold, #c2872f); font-weight: 700; }
.giv-stack__empty {
  fill: var(--giv-dim, #9aa39c); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.giv-swatch { stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5; }
.giv-legend { fill: var(--giv-muted, #657168); font-size: 11px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.giv-banner__box {
  fill: var(--giv-banner, #f4f3ef); stroke: var(--giv-line, #c3c9c2); stroke-width: 1.5;
}
.giv-banner__text {
  fill: var(--giv-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.giv-banner__text.is-ok { fill: var(--giv-ok, #3f6b57); }

.giv-phase__text {
  fill: var(--giv-muted, #657168); font-size: 13px; font-weight: 600;
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
export function mountIslands(host, options = {}) {
  if (!host || host.dataset.islandsMounted === '1') return { destroy() {} }
  host.dataset.islandsMounted = '1'
  ensureStyles()

  const steps = buildIslandsSteps(options)
  const autoplay = options.autoplay !== false
  const { grid, m, n } = steps[0]

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz giv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg giv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '岛屿数量 LC200 染色推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(cellLayer, markLayer)

  const note = mk('text', { class: 'giv-note', x: 26, y: NOTE_Y })
  note.textContent = '扫描网格，遇到未访问的陆地就 +1 并染色（显式栈）'
  markLayer.appendChild(note)
  const goal = mk('text', { class: 'giv-note giv-note--r', x: width - 26, y: NOTE_Y })
  goal.textContent = `${m} × ${n} 网格`
  markLayer.appendChild(goal)

  // ── 网格 ──
  const cellEls = []
  for (let r = 0; r < m; r += 1) {
    const rowEls = []
    for (let c = 0; c < n; c += 1) {
      const x = GRID_X + c * (CELL + CGAP)
      const y = GRID_Y + r * (CELL + CGAP)
      const g = mk('g', { class: 'giv-cell' })
      g.appendChild(mk('rect', { class: 'giv-cell__box', x, y, width: CELL, height: CELL, rx: 6 }))
      const val = mk('text', { class: 'giv-cell__val', x: x + CELL / 2, y: y + CELL / 2 })
      g.appendChild(val)
      cellLayer.appendChild(g)
      rowEls.push({ g, val })
    }
    cellEls.push(rowEls)
  }

  // ── 计数盒 ──
  markLayer.appendChild(mk('rect', { class: 'giv-box', x: RIGHT_X, y: COUNT_Y, width: RIGHT_W, height: COUNT_H, rx: 9 }))
  const countLbl = mk('text', { class: 'giv-count__label', x: RIGHT_X + RIGHT_W / 2, y: COUNT_Y + 18 })
  countLbl.textContent = '岛屿数 count'
  const countNum = mk('text', { class: 'giv-count__num', x: RIGHT_X + RIGHT_W / 2, y: COUNT_Y + 50 })
  markLayer.append(countLbl, countNum)

  // ── 栈盒 ──
  markLayer.appendChild(mk('rect', { class: 'giv-box', x: RIGHT_X, y: STACK_Y, width: RIGHT_W, height: STACK_H, rx: 9 }))
  const stackTitle = mk('text', { class: 'giv-lbl', x: RIGHT_X + 12, y: STACK_Y + 16 })
  markLayer.appendChild(stackTitle)
  const stackEmpty = mk('text', { class: 'giv-stack__empty', x: RIGHT_X + RIGHT_W / 2, y: STACK_Y + STACK_H / 2 + 8 })
  stackEmpty.textContent = '（栈空）'
  markLayer.appendChild(stackEmpty)

  const chipW = 60
  const chipH = 24
  const chipGap = 8
  const chipY = STACK_Y + STACK_H - chipH - 12
  const STACK_SLOTS = Math.floor((RIGHT_W - 20 + chipGap) / (chipW + chipGap))
  const stackChips = []
  for (let i = 0; i < STACK_SLOTS; i += 1) {
    const x = RIGHT_X + 10 + i * (chipW + chipGap)
    const g = mk('g', { class: 'giv-chip' })
    g.appendChild(mk('rect', { class: 'giv-chip__box', x, y: chipY, width: chipW, height: chipH, rx: 5 }))
    const val = mk('text', { class: 'giv-chip__val', x: x + chipW / 2, y: chipY + chipH / 2 })
    g.appendChild(val)
    markLayer.appendChild(g)
    stackChips.push({ g, val })
  }

  // ── 图例 ──
  const legend = [
    { fill: '#79a892', text: '陆地' },
    { fill: '#c7cfc8', text: '已访问' },
    { fill: '#eef2ee', text: '水' },
  ]
  let lx = GRID_X
  for (const item of legend) {
    markLayer.appendChild(mk('rect', { class: 'giv-swatch', x: lx, y: LEGEND_Y, width: 18, height: 18, rx: 4, fill: item.fill }))
    const t = mk('text', { class: 'giv-legend', x: lx + 24, y: LEGEND_Y + 9 })
    t.textContent = item.text
    markLayer.appendChild(t)
    lx += 24 + item.text.length * 13 + 20
  }

  // ── 横幅 ──
  markLayer.appendChild(mk('rect', { class: 'giv-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'giv-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  const phaseText = mk('text', { class: 'giv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const curKey = step.cur ? `${step.cur[0]},${step.cur[1]}` : null
    const pushedSet = new Set(step.pushed.map((p) => `${p[0]},${p[1]}`))

    // 网格
    cellEls.forEach((rowEls, r) => {
      rowEls.forEach((el, c) => {
        const cls = ['giv-cell']
        cls.push(step.grid[r][c] === 1 ? 'giv-cell--land' : 'giv-cell--water')
        if (step.visited[r][c]) cls.push('giv-cell--seen')
        if (pushedSet.has(`${r},${c}`)) cls.push('is-pushed')
        if (curKey === `${r},${c}`) cls.push('is-cur')
        el.g.setAttribute('class', cls.join(' '))
        el.val.textContent = String(step.grid[r][c])
      })
    })

    // 计数
    countNum.textContent = String(step.count)
    countNum.setAttribute(
      'class',
      'giv-count__num' + (step.phase === 'seed' ? ' is-bumped' : ''),
    )

    // 栈（底 → 顶，栈顶在右）
    const frontier = step.frontier
    stackTitle.textContent = `显式栈（底 → 顶）· 深度 ${step.depth}`
    stackEmpty.style.display = frontier.length === 0 ? '' : 'none'
    const shown = Math.min(frontier.length, STACK_SLOTS)
    stackChips.forEach((chip, i) => {
      if (i >= shown) {
        chip.g.style.display = 'none'
        return
      }
      chip.g.style.display = ''
      const p = frontier[i]
      chip.val.textContent = `(${p[0]},${p[1]})`
      const isTop = i === shown - 1 && frontier.length === shown
      chip.g.setAttribute('class', 'giv-chip' + (isTop ? ' is-top' : ''))
    })

    // 横幅
    if (step.phase === 'init') {
      banner.textContent = '数岛屿 = 数连通块　遇到新陆地：count += 1 再染色'
      banner.setAttribute('class', 'giv-banner__text')
    } else if (step.phase === 'seed') {
      banner.textContent = `新岛：(${step.cur[0]}, ${step.cur[1]}) → count = ${step.count}`
      banner.setAttribute('class', 'giv-banner__text is-ok')
    } else if (step.phase === 'pop') {
      banner.textContent =
        `弹出 (${step.cur[0]}, ${step.cur[1]})` +
        (step.pushed.length ? `　压入 ${step.pushed.map((p) => `(${p[0]},${p[1]})`).join(' ')}` : '　无新入栈')
      banner.setAttribute('class', 'giv-banner__text')
    } else {
      banner.textContent = `答案 = ${step.count} 座岛`
      banner.setAttribute('class', 'giv-banner__text is-ok')
    }

    // 状态行
    if (step.phase === 'init') phaseText.textContent = '只对「未访问的陆地」计数；水和已访问的陆地直接跳过'
    else if (step.phase === 'seed') phaseText.textContent = 'seed：一座岛只在此刻 +1，之后它的陆地都会被染色'
    else if (step.phase === 'pop') phaseText.textContent = 'pop：弹栈顶、把四邻未访问的陆地标记并压栈（栈深度 = 递归版深度）'
    else phaseText.textContent = '每座岛只 +1 一次；递归版在此处最坏占 O(m·n) 调用栈 → 会爆栈'

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
      delete host.dataset.islandsMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
