/**
 * spiral.js — 「螺旋填数」的 SVG 渲染层，两种方向顺序共用一套渲染。
 *
 *   mountSpiral    —— lc-spiral   mode 'rdlu'（右、下、左、上；面经里的"逆时针"）
 *   mountSpiralCcw —— lc-spiralccw mode 'drul'（下、右、上、左；几何上的真逆时针）
 *
 * 视觉：网格（已填格显示数字、未填格虚线空壳）+ 当前格外侧的方向箭头 +
 * 本圈边界虚线框；右侧面板列方向序列、当前方向、已填数、四个边界值。
 *
 * 通用坑：A（CSS 变量字面量兜底）/ V（互斥状态在 JS 里选好）/ K（分层绘制）/ X（横幅从左往右）。
 */

import { buildSpiralSteps, MODE_DIRS, DIR_LABEL } from './spiralSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'spiral-styles'
const PLAY_MS = 760

const STYLES = `
.spiral { display: flex; flex-direction: column; gap: 14px; }
.spiral__svg { width: 100%; height: auto; display: block; }

.spiral-note {
  fill: var(--spiral-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-banner__box {
  fill: var(--spiral-banner, #f4f3ef);
  stroke: var(--spiral-line, #c3c9c2);
  stroke-width: 1.5;
}
.spiral-banner__seg {
  fill: var(--spiral-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-banner__val {
  fill: var(--spiral-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 网格 ---- */
.spiral-cell__box {
  fill: var(--spiral-fill, #ffffff);
  stroke: var(--spiral-line, #c3c9c2);
  stroke-width: 1.5;
}
.spiral-cell__val {
  fill: var(--spiral-ink, #1f2a24);
  font-size: 20px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-cell.is-ghost .spiral-cell__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1.2; }
.spiral-cell.is-ghost .spiral-cell__val { fill: none; }
.spiral-cell.is-fresh .spiral-cell__box {
  fill: var(--spiral-gold-fill, #fdf3e3);
  stroke: var(--spiral-gold, #c2872f);
  stroke-width: 3;
}
.spiral-cell.is-fresh .spiral-cell__val { fill: var(--spiral-gold, #c2872f); }
.spiral-cell.is-cur .spiral-cell__box { stroke: var(--spiral-hot, #a45f45); stroke-width: 3.5; }
.spiral-cell.is-cur .spiral-cell__val { fill: var(--spiral-hot, #a45f45); }

/* 本圈边界虚线框 */
.spiral-ring {
  fill: none;
  stroke: var(--spiral-ok, #3f6b57);
  stroke-width: 2;
  stroke-dasharray: 6 4;
  opacity: 0;
}
.spiral-ring.is-on { opacity: 0.85; }

/* 方向箭头 */
.spiral-arrow {
  fill: var(--spiral-hot, #a45f45);
  opacity: 0;
}
.spiral-arrow.is-on { opacity: 1; }

/* ---- 右侧面板 ---- */
.spiral-panel__box {
  fill: var(--spiral-banner, #f4f3ef);
  stroke: var(--spiral-line, #c3c9c2);
  stroke-width: 1.5;
}
.spiral-panel__title {
  fill: var(--spiral-muted, #657168);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-panel__row {
  fill: var(--spiral-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-dir {
  fill: var(--spiral-fill, #ffffff);
  stroke: var(--spiral-line, #c3c9c2);
  stroke-width: 1.5;
}
.spiral-dir__text {
  fill: var(--spiral-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.spiral-dir.is-cur .spiral-dir__box {
  fill: var(--spiral-hot, #a45f45);
  stroke: var(--spiral-hot, #a45f45);
}
.spiral-dir.is-cur .spiral-dir__text { fill: #ffffff; }
.spiral-dir.is-done .spiral-dir__box { fill: var(--spiral-ok-fill, #eef5f1); }
.spiral-dir.is-done .spiral-dir__text { fill: var(--spiral-ok, #3f6b57); }

.spiral-ans__box {
  fill: var(--spiral-ok-fill, #eef5f1);
  stroke: var(--spiral-ok, #3f6b57);
  stroke-width: 2.5;
  opacity: 0;
}
.spiral-ans__box.is-on { opacity: 1; }
.spiral-ans__text {
  fill: var(--spiral-ok, #3f6b57);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.spiral-ans__text.is-on { opacity: 1; }
.spiral-phase__text {
  fill: var(--spiral-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
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

function makeDesc() {
  const p = document.createElement('p')
  p.className = 'viz__desc'
  p.setAttribute('aria-live', 'polite')
  return p
}

function mountMode(host, options, mode, datasetKey) {
  if (!host || host.dataset[datasetKey] === '1') return { destroy() {} }
  host.dataset[datasetKey] = '1'
  ensureStyles()

  const steps = buildSpiralSteps({ ...options, mode })
  const s0 = steps[0]
  const { rows, cols } = s0

  const W = 680
  const BANNER_TOP = 38
  const BANNER_H = 40
  const GRID_TOP = 112
  const GRID_MAX_H = 296
  const GRID_AREA_L = 46
  const GRID_AREA_W = 356
  const GAP = 8

  // 格子同时受宽、高约束
  const cell = Math.max(
    20,
    Math.min(88, (GRID_AREA_W - (cols - 1) * GAP) / cols, (GRID_MAX_H - (rows - 1) * GAP) / rows),
  )
  const gridW = cols * cell + (cols - 1) * GAP
  const gridH = rows * cell + (rows - 1) * GAP
  const GL = GRID_AREA_L + Math.max(0, (GRID_AREA_W - gridW) / 2)
  const GT = GRID_TOP + Math.max(0, (GRID_MAX_H - gridH) / 2)
  const cx = (c) => GL + c * (cell + GAP) + cell / 2
  const cy = (r) => GT + r * (cell + GAP) + cell / 2

  const PANEL_X = 432
  const PANEL_W = W - PANEL_X - 30
  const gridBottom = GT + gridH
  const PHASE_Y = Math.max(gridBottom, 112 + GRID_MAX_H) + 46
  const height = PHASE_Y + 22

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg spiral__svg',
    viewBox: `0 0 ${W} ${height}`,
    role: 'img',
    'aria-label': '螺旋填数推演动画',
  })
  // 三层：边界框 -> 格子 -> 箭头/标签（坑 K）
  const ringLayer = mk('g', { class: 'spiral-rings' })
  const cellLayer = mk('g', { class: 'spiral-cells' })
  const topLayer = mk('g', { class: 'spiral-top' })
  svgRoot.appendChild(ringLayer)
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(topLayer)

  const note = mk('text', { class: 'spiral-note', x: 30, y: 22 })
  note.textContent = `方向顺序：${MODE_DIRS[mode].map((d) => DIR_LABEL[d]).join(' -> ')}`
  topLayer.appendChild(note)

  topLayer.appendChild(
    mk('rect', { class: 'spiral-banner__box', x: 30, y: BANNER_TOP, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'spiral-banner__seg', x: 46, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'spiral-banner__seg', x: 176, y: BANNER_TOP + BANNER_H / 2 })
  const segVal = mk('text', { class: 'spiral-banner__val', x: W - 46, y: BANNER_TOP + BANNER_H / 2 })
  topLayer.appendChild(segRound)
  topLayer.appendChild(segAct)
  topLayer.appendChild(segVal)

  // 本圈边界虚线框
  const ring = mk('rect', { class: 'spiral-ring', x: 0, y: 0, width: 0, height: 0, rx: 6 })
  ringLayer.appendChild(ring)

  // 格子
  const cells = []
  for (let r = 0; r < rows; r += 1) {
    const row = []
    for (let c = 0; c < cols; c += 1) {
      const g = mk('g', { class: 'spiral-cell' })
      g.appendChild(
        mk('rect', { class: 'spiral-cell__box', x: cx(c) - cell / 2, y: cy(r) - cell / 2, width: cell, height: cell, rx: 6 }),
      )
      const val = mk('text', { class: 'spiral-cell__val', x: cx(c), y: cy(r) })
      g.appendChild(val)
      cellLayer.appendChild(g)
      row.push({ g, val })
    }
    cells.push(row)
  }

  // 方向箭头（当前格外侧）
  const arrow = mk('path', { class: 'spiral-arrow', d: '' })
  topLayer.appendChild(arrow)
  const drawArrow = (dir, cur) => {
    const { r, c } = cur
    const x = cx(c)
    const y = cy(r)
    const d = 7
    const off = cell / 2 + 9
    let pts
    if (dir === 'right') pts = `${x + off},${y} ${x + off - d},${y - d} ${x + off - d},${y + d}`
    else if (dir === 'left') pts = `${x - off},${y} ${x - off + d},${y - d} ${x - off + d},${y + d}`
    else if (dir === 'down') pts = `${x},${y + off} ${x - d},${y + off - d} ${x + d},${y + off - d}`
    else pts = `${x},${y - off} ${x - d},${y - off + d} ${x + d},${y - off + d}`
    arrow.setAttribute('d', `M ${pts} Z`)
    arrow.classList.add('is-on')
  }

  // ---- 右侧面板 ----
  const panelBox = mk('rect', { class: 'spiral-panel__box', x: PANEL_X, y: GRID_TOP, width: PANEL_W, height: 232, rx: 10 })
  topLayer.appendChild(panelBox)

  const pTitle = mk('text', { class: 'spiral-panel__title', x: PANEL_X + 14, y: GRID_TOP + 18 })
  pTitle.textContent = '方向序列（本轮循环）'
  topLayer.appendChild(pTitle)

  // 四个方向小方块，2x2 排布
  const dW = 84
  const dH = 30
  const dGap = 10
  const dirEls = {}
  MODE_DIRS[mode].forEach((d, i) => {
    const x = PANEL_X + 14 + (i % 2) * (dW + dGap)
    const y = GRID_TOP + 32 + Math.floor(i / 2) * (dH + dGap)
    const g = mk('g', { class: 'spiral-dir' })
    g.appendChild(mk('rect', { class: 'spiral-dir__box', x, y, width: dW, height: dH, rx: 7 }))
    const t = mk('text', { class: 'spiral-dir__text', x: x + dW / 2, y: y + dH / 2 })
    t.textContent = DIR_LABEL[d]
    g.appendChild(t)
    topLayer.appendChild(g)
    dirEls[d] = { g, t }
  })

  const rowDir = mk('text', { class: 'spiral-panel__row', x: PANEL_X + 14, y: GRID_TOP + 128 })
  const rowFilled = mk('text', { class: 'spiral-panel__row', x: PANEL_X + 14, y: GRID_TOP + 152 })
  const rowBounds = mk('text', { class: 'spiral-panel__row', x: PANEL_X + 14, y: GRID_TOP + 176 })
  const rowBounds2 = mk('text', { class: 'spiral-panel__row', x: PANEL_X + 14, y: GRID_TOP + 200 })
  topLayer.appendChild(rowDir)
  topLayer.appendChild(rowFilled)
  topLayer.appendChild(rowBounds)
  topLayer.appendChild(rowBounds2)

  // 答案条
  const ansBox = mk('rect', { class: 'spiral-ans__box', x: PANEL_X, y: GRID_TOP + 246, width: PANEL_W, height: 38, rx: 10 })
  const ansText = mk('text', { class: 'spiral-ans__text', x: PANEL_X + PANEL_W / 2, y: GRID_TOP + 246 + 19 })
  topLayer.appendChild(ansBox)
  topLayer.appendChild(ansText)

  const phaseText = mk('text', { class: 'spiral-phase__text', x: W / 2, y: PHASE_Y })
  topLayer.appendChild(phaseText)

  function paint(_index, step) {
    if (!step) return
    const { phase, cur, dir, grid, bounds, filled, total } = step
    const isDone = phase === 'done'
    const isFill = phase === 'fill'

    cells.forEach((row, r) => {
      row.forEach((el, c) => {
        const cls = ['spiral-cell']
        if (grid[r][c] === 0) cls.push('is-ghost')
        else if (isFill && cur && cur.r === r && cur.c === c) cls.push('is-cur')
        el.g.setAttribute('class', cls.join(' '))
        el.val.textContent = grid[r][c] === 0 ? '' : String(grid[r][c])
      })
    })

    // 本圈边界框
    if (isFill || phase === 'init') {
      const b = bounds
      if (b.top <= b.bottom && b.left <= b.right) {
        ring.classList.add('is-on')
        ring.setAttribute('x', cx(b.left) - cell / 2 - 5)
        ring.setAttribute('y', cy(b.top) - cell / 2 - 5)
        ring.setAttribute('width', (b.right - b.left) * (cell + GAP) + cell + 10)
        ring.setAttribute('height', (b.bottom - b.top) * (cell + GAP) + cell + 10)
      }
    } else {
      ring.classList.remove('is-on')
    }

    if (isFill && dir) drawArrow(dir, cur)
    else arrow.classList.remove('is-on')

    for (const d of Object.keys(dirEls)) {
      const cls = ['spiral-dir']
      if (isFill && d === dir) cls.push('is-cur')
      else if (isDone) cls.push('is-done')
      dirEls[d].g.setAttribute('class', cls.join(' '))
    }

    rowDir.textContent = isFill ? `方向：${DIR_LABEL[dir]}` : '方向：待开始'
    rowFilled.textContent = `已填 ${filled} / ${total}`
    rowBounds.textContent = `上 ${bounds.top}  下 ${bounds.bottom}`
    rowBounds2.textContent = `左 ${bounds.left}  右 ${bounds.right}`

    ansText.textContent = isDone ? `完成：${total} 格全部填满` : ''
    ansBox.setAttribute('class', `spiral-ans__box ${isDone ? 'is-on' : ''}`)
    ansText.setAttribute('class', `spiral-ans__text ${isDone ? 'is-on' : ''}`)

    if (phase === 'init') {
      segRound.textContent = '开局'
      segAct.textContent = `${rows} x ${cols} 矩阵，从 1 开始`
      segVal.textContent = '方向序列见右'
    } else if (isFill) {
      segRound.textContent = `第 ${step.value} 个数`
      segAct.textContent = `填在 (${cur.r}, ${cur.c}) · ${DIR_LABEL[dir]}`
      segVal.textContent = `${filled} / ${total}`
    } else {
      segRound.textContent = '填完'
      segAct.textContent = `${total} 次写入，无重复无遗漏`
      segVal.textContent = `O(${rows} x ${cols})`
    }

    phaseText.textContent = isDone
      ? '四边界收缩：每圈走完把对应边界内推一格；第三、四条边的守卫是防非方阵重复的关键。'
      : isFill
        ? `当前格 (${cur.r}, ${cur.c})。撞到未填区域的边缘就按方向序列转向 —— 四个方向循环一轮就是一圈。`
        : '每一格只填一次，所以 O(M x N) 就是下限；边界收缩法额外空间 O(1)。'

    renderRichText(descEl, step.desc)
  }

  const descEl = makeDesc()
  const rootEl = document.createElement('div')
  rootEl.className = 'viz spiral'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  stage.appendChild(svgRoot)
  rootEl.appendChild(stage)
  rootEl.appendChild(descEl)
  const controls = createControls()
  rootEl.appendChild(controls.root)
  host.textContent = ''
  host.appendChild(rootEl)
  ensureChromeStyles()

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const player = createPlayer({ steps, controls, intervalMs: PLAY_MS, onRender: paint })
  player.jumpTo(Math.trunc(options.initialStep) || 0)

  let observer = null
  if (options.autoplay !== false && !reduced && typeof IntersectionObserver === 'function') {
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
      delete host.dataset[datasetKey]
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

/**
 * 螺旋填数（默认 3x3，方向顺序 右、下、左、上）。
 * @param {HTMLElement} host
 * @param {{ rows?: number, cols?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountSpiral(host, options = {}) {
  return mountMode(host, options, 'rdlu', 'spiralMounted')
}

/**
 * 螺旋填数（真逆时针：方向顺序 下、右、上、左）。
 * @param {HTMLElement} host
 * @param {{ rows?: number, cols?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountSpiralCcw(host, options = {}) {
  return mountMode(host, options, 'drul', 'spiralCcwMounted')
}
