/**
 * islandsUf.js — 「岛屿数量」(LC 200) 并查集视角的 SVG 渲染层。
 *
 * 布局：左侧 = 网格（每块陆地按其**根**着色、格子上写它当前的根坐标；
 * 当前格金框、合并的邻居绿框）；右上 = 连通块计数；
 * 右下 = 本步的合并状态；横幅 + 底部状态行。
 *
 * 与 coinChange.js 骨架一致：模块级 STYLE_ID + ensureStyles()，
 * dataset 幂等守卫，createPlayer + jumpTo，IntersectionObserver 自动播放。
 */

import { buildIslandsUfSteps } from './islandsUfSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'islandsuf-styles'

const NOTE_Y = 28
const GRID_X = 30
const GRID_Y = 74
const CELL = 40
const CGAP = 6
const RIGHT_X = 300
const RIGHT_W = 334
const COUNT_Y = 74
const COUNT_H = 76
const STATUS_Y = 162
const STATUS_H = 90
const CAPTION_Y = 268
const BANNER_Y = 292
const BANNER_H = 40
const PHASE_Y = 360

const PLAY_MS = 1150

/** 集合分组配色（自然色系）。 */
const GROUP_COLORS = ['#79a892', '#c2872f', '#8aa0c0', '#b08fb0', '#a4b06a', '#c08a8a']

const STYLES = `
.ufv { display: flex; flex-direction: column; gap: 14px; }
.ufv__svg { width: 100%; height: auto; display: block; }

.ufv-note {
  fill: var(--ufv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-note--r { text-anchor: end; }

.ufv-lbl {
  fill: var(--ufv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.ufv-cell__box { stroke: var(--ufv-line, #c3c9c2); stroke-width: 1.5; }
.ufv-cell--water .ufv-cell__box { fill: var(--ufv-water, #eef2ee); stroke: var(--ufv-line, #d8ded6); }
.ufv-cell.is-cur .ufv-cell__box { stroke: var(--ufv-gold, #c2872f); stroke-width: 3.5; }
.ufv-cell.is-nbr .ufv-cell__box { stroke: var(--ufv-ok, #3f6b57); stroke-width: 3; }
.ufv-cell__val {
  fill: var(--ufv-ink, #1f2a24); font-size: 9px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-cell--water .ufv-cell__val { fill: var(--ufv-dim, #b3bbb3); }

.ufv-box {
  fill: var(--ufv-fill, #ffffff); stroke: var(--ufv-line, #c3c9c2); stroke-width: 1.5;
}
.ufv-count__label {
  fill: var(--ufv-muted, #657168); font-size: 11.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-count__num {
  fill: var(--ufv-ok, #3f6b57); font-size: 30px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-count__num.is-bumped { fill: var(--ufv-gold, #c2872f); }

.ufv-status__t {
  fill: var(--ufv-ink, #1f2a24); font-size: 12px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-status__t.is-ok { fill: var(--ufv-ok, #3f6b57); font-weight: 700; }
.ufv-status__t.is-muted { fill: var(--ufv-muted, #657168); }

.ufv-caption {
  fill: var(--ufv-muted, #657168); font-size: 11px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ufv-banner__box {
  fill: var(--ufv-banner, #f4f3ef); stroke: var(--ufv-line, #c3c9c2); stroke-width: 1.5;
}
.ufv-banner__text {
  fill: var(--ufv-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ufv-banner__text.is-ok { fill: var(--ufv-ok, #3f6b57); }

.ufv-phase__text {
  fill: var(--ufv-muted, #657168); font-size: 13px; font-weight: 600;
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
export function mountIslandsUf(host, options = {}) {
  if (!host || host.dataset.islandsUfMounted === '1') return { destroy() {} }
  host.dataset.islandsUfMounted = '1'
  ensureStyles()

  const steps = buildIslandsUfSteps(options)
  const autoplay = options.autoplay !== false
  const { grid, m, n } = steps[0]

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz ufv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg ufv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '岛屿数量 LC200 并查集推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(cellLayer, markLayer)

  const note = mk('text', { class: 'ufv-note', x: 26, y: NOTE_Y })
  note.textContent = '每块陆地自成集合，与上/左相邻陆地合并：合并一次 count−1'
  markLayer.appendChild(note)
  const goal = mk('text', { class: 'ufv-note ufv-note--r', x: width - 26, y: NOTE_Y })
  goal.textContent = `${m} × ${n} 网格`
  markLayer.appendChild(goal)

  const cellEls = []
  for (let r = 0; r < m; r += 1) {
    const rowEls = []
    for (let c = 0; c < n; c += 1) {
      const x = GRID_X + c * (CELL + CGAP)
      const y = GRID_Y + r * (CELL + CGAP)
      const g = mk('g', { class: 'ufv-cell' })
      const box = mk('rect', { class: 'ufv-cell__box', x, y, width: CELL, height: CELL, rx: 6 })
      const val = mk('text', { class: 'ufv-cell__val', x: x + CELL / 2, y: y + CELL / 2 })
      g.append(box, val)
      cellLayer.appendChild(g)
      rowEls.push({ g, box, val })
    }
    cellEls.push(rowEls)
  }

  // 计数盒
  markLayer.appendChild(mk('rect', { class: 'ufv-box', x: RIGHT_X, y: COUNT_Y, width: RIGHT_W, height: COUNT_H, rx: 9 }))
  const countLbl = mk('text', { class: 'ufv-count__label', x: RIGHT_X + RIGHT_W / 2, y: COUNT_Y + 18 })
  countLbl.textContent = '连通块数 count'
  const countNum = mk('text', { class: 'ufv-count__num', x: RIGHT_X + RIGHT_W / 2, y: COUNT_Y + 50 })
  markLayer.append(countLbl, countNum)

  // 状态盒
  markLayer.appendChild(mk('rect', { class: 'ufv-box', x: RIGHT_X, y: STATUS_Y, width: RIGHT_W, height: STATUS_H, rx: 9 }))
  const statusTitle = mk('text', { class: 'ufv-lbl', x: RIGHT_X + 12, y: STATUS_Y + 18 })
  statusTitle.textContent = '本步'
  markLayer.appendChild(statusTitle)
  const statusL1 = mk('text', { class: 'ufv-status__t', x: RIGHT_X + 12, y: STATUS_Y + 44 })
  const statusL2 = mk('text', { class: 'ufv-status__t', x: RIGHT_X + 12, y: STATUS_Y + 68 })
  markLayer.append(statusL1, statusL2)

  // 图注
  const caption = mk('text', { class: 'ufv-caption', x: GRID_X, y: CAPTION_Y + 9 })
  caption.textContent = '同色的陆地 = 同一个根（同一座岛）；格子里是它当前的根坐标'
  markLayer.appendChild(caption)

  // 横幅
  markLayer.appendChild(mk('rect', { class: 'ufv-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'ufv-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  const phaseText = mk('text', { class: 'ufv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  const rootOf = (parent, k) => {
    let x = k
    while (parent[x] !== undefined && parent[x] !== x) x = parent[x]
    return x
  }

  function paint(_index, step) {
    if (!step) return
    const parent = step.parent
    // 先收集根，按首次出现顺序配色（只统计**已加入并查集**的陆地）
    const colorOf = new Map()
    for (let r = 0; r < m; r += 1) {
      for (let c = 0; c < n; c += 1) {
        const k = `${r},${c}`
        if (step.grid[r][c] !== 1 || parent[k] === undefined) continue
        const rt = rootOf(parent, k)
        if (!colorOf.has(rt)) colorOf.set(rt, GROUP_COLORS[colorOf.size % GROUP_COLORS.length])
      }
    }

    const curKey = step.cur ? `${step.cur[0]},${step.cur[1]}` : null
    const nbrKey = step.neighbor ? `${step.neighbor[0]},${step.neighbor[1]}` : null

    for (let r = 0; r < m; r += 1) {
      for (let c = 0; c < n; c += 1) {
        const el = cellEls[r][c]
        const isLand = step.grid[r][c] === 1
        const key = `${r},${c}`
        const cls = ['ufv-cell']
        if (!isLand) {
          cls.push('ufv-cell--water')
          el.val.textContent = ''
          el.box.setAttribute('fill', '')
        } else if (parent[key] === undefined) {
          // 还没扫到 / 还没加入并查集的陆地：中性色，不显示根
          el.box.setAttribute('fill', '#dbe7df')
          el.val.textContent = ''
        } else {
          const rt = rootOf(parent, key)
          el.box.setAttribute('fill', colorOf.get(rt) || '#79a892')
          el.val.textContent = rt
        }
        if (nbrKey === `${r},${c}`) cls.push('is-nbr')
        if (curKey === `${r},${c}`) cls.push('is-cur')
        el.g.setAttribute('class', cls.join(' '))
      }
    }

    countNum.textContent = String(step.count)
    countNum.setAttribute('class', 'ufv-count__num' + (step.phase === 'add' ? ' is-bumped' : ''))

    // 状态
    if (step.phase === 'init') {
      statusL1.textContent = 'parent = { }'
      statusL1.setAttribute('class', 'ufv-status__t is-muted')
      statusL2.textContent = '每块陆地一个集合'
      statusL2.setAttribute('class', 'ufv-status__t is-muted')
    } else if (step.phase === 'add') {
      statusL1.textContent = `新增集合 (${step.cur[0]},${step.cur[1]})`
      statusL1.setAttribute('class', 'ufv-status__t is-ok')
      statusL2.textContent = `count += 1 → ${step.count}`
      statusL2.setAttribute('class', 'ufv-status__t')
    } else if (step.phase === 'union') {
      const a = rootOf(parent, `${step.cur[0]},${step.cur[1]}`)
      const b = rootOf(parent, `${step.neighbor[0]},${step.neighbor[1]}`)
      statusL1.textContent = `根 ${a}  vs  根 ${b}`
      statusL1.setAttribute('class', 'ufv-status__t')
      statusL2.textContent = step.merged ? `根不同 → 合并，count − 1 → ${step.count}` : '已同根 → 不合并'
      statusL2.setAttribute('class', 'ufv-status__t' + (step.merged ? ' is-ok' : ' is-muted'))
    } else {
      statusL1.textContent = `最终 count = ${step.count}`
      statusL1.setAttribute('class', 'ufv-status__t is-ok')
      statusL2.textContent = '= 岛屿数'
      statusL2.setAttribute('class', 'ufv-status__t is-muted')
    }

    // 横幅
    if (step.phase === 'init') {
      banner.textContent = '并查集：每块陆地一个集合，相邻陆地就合并'
      banner.setAttribute('class', 'ufv-banner__text')
    } else if (step.phase === 'add') {
      banner.textContent = `新增陆地 (${step.cur[0]}, ${step.cur[1]})　count = ${step.count}`
      banner.setAttribute('class', 'ufv-banner__text')
    } else if (step.phase === 'union') {
      banner.textContent = step.merged
        ? `合并 (${step.cur[0]},${step.cur[1]}) + (${step.neighbor[0]},${step.neighbor[1]})　count = ${step.count}`
        : `(${step.cur[0]},${step.cur[1]}) 与 (${step.neighbor[0]},${step.neighbor[1]}) 已同根，跳过`
      banner.setAttribute('class', 'ufv-banner__text' + (step.merged ? ' is-ok' : ''))
    } else {
      banner.textContent = `答案 = ${step.count} 座岛（连通块数）`
      banner.setAttribute('class', 'ufv-banner__text is-ok')
    }

    // 状态行
    if (step.phase === 'init') phaseText.textContent = '无递归、无栈：并查集把"连通"变成"合并集合"'
    else if (step.phase === 'add') phaseText.textContent = '每加一块陆地 count += 1，先假定它是一座孤岛'
    else if (step.phase === 'union') phaseText.textContent = step.merged ? '成功合并一次，连通块数 -1' : '根已相同 —— 并查集天然去重，不需要 visited'
    else phaseText.textContent = 'count = 陆地数 − 成功合并数；动态加陆地时（LC 305）可增量维护'

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
      delete host.dataset.islandsUfMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
