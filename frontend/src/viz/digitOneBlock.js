/**
 * digitOneBlock.js — 「1~n 中数字 1 出现的个数」的第二个 SVG 渲染层：数轴周期块动画。
 *
 * 对应文章里的「动画二」：占位符 algo-viz--lc233block。
 * 视觉：0 ~ n 的数字网格（每行 10 个），当前数位为 1 的格子烫金高亮，
 * 下方一本「账本」把高亮拆成 完整循环 × 每循环贡献 + 零头。
 *
 * 这个动画回答「公式从哪来」：个位是散点（每 10 个 1 个），十位是整块
 * （每 100 个连出 10 个）。两种形状对应同一个账本结构，也就是三件套公式的原型。
 *
 * 通用坑：A / K / X。
 */

import { buildDigitOneBlockSteps } from './digitOneBlockSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'd1b-styles'
const PLAY_MS = 1050

const STYLES = `
.d1b { display: flex; flex-direction: column; gap: 14px; }
.d1b__svg { width: 100%; height: auto; display: block; }

.d1b-note {
  fill: var(--d1b-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-banner__box {
  fill: var(--d1b-banner, #f4f3ef);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1b-banner__seg {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-banner__val {
  fill: var(--d1b-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1b-seclabel {
  fill: var(--d1b-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 数字网格 ---- */
.d1b-cell__box {
  fill: var(--d1b-fill, #ffffff);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.2;
}
.d1b-cell__val {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1b-cell.is-one .d1b-cell__box {
  fill: var(--d1b-gold-fill, #fdf3e3);
  stroke: var(--d1b-gold, #c2872f);
  stroke-width: 2.2;
}
.d1b-cell.is-one .d1b-cell__val { fill: var(--d1b-gold, #c2872f); font-weight: 700; }
.d1b-cell.is-zero .d1b-cell__val { fill: var(--d1b-dim, #9aa39c); }

/* ---- 账本面板 ---- */
.d1b-ledger__box {
  fill: var(--d1b-fill, #ffffff);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1b-ledger__title {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-ledger__line {
  fill: var(--d1b-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-ledger__sum {
  fill: var(--d1b-gold, #c2872f);
  font-size: 14px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.d1b-ledger.is-idle .d1b-ledger__line { fill: var(--d1b-dim, #9aa39c); }

/* ---- 累计 chips + 合计 ---- */
.d1b-chip__box {
  fill: var(--d1b-fill, #ffffff);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.4;
}
.d1b-chip__top {
  fill: var(--d1b-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1b-chip__val {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1b-chip.is-new .d1b-chip__box { stroke: var(--d1b-gold, #c2872f); stroke-width: 2.4; }
.d1b-chip.is-new .d1b-chip__val { fill: var(--d1b-gold, #c2872f); }
.d1b-chip.is-off { opacity: 0; }
.d1b-total__box {
  fill: var(--d1b-fill, #ffffff);
  stroke: var(--d1b-line, #c3c9c2);
  stroke-width: 1.4;
}
.d1b-total__label {
  fill: var(--d1b-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1b-total__val {
  fill: var(--d1b-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1b-total.is-on .d1b-total__box { fill: var(--d1b-gold-fill, #fdf3e3); stroke: var(--d1b-gold, #c2872f); stroke-width: 2.6; }
.d1b-total.is-on .d1b-total__label { fill: var(--d1b-gold, #c2872f); }
.d1b-total.is-on .d1b-total__val { fill: var(--d1b-gold, #c2872f); }

.d1b-phasetext {
  fill: var(--d1b-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
`

// ── 布局常量 ──────────────────────────────────────────────────────────────
const W = 680
const NOTE_Y = 20
const BANNER_Y = 36
const BANNER_H = 40
const GRID_LABEL_Y = 96
const GRID_TOP = 106
const CELL_W = 44
const CELL_GAP = 6
const CELL_H = 32
const ROW_GAP = 8
const COLS = 10
const LEDGER_GAP = 22
const LEDGER_H = 100
const TOTAL_GAP = 16
const TOTAL_H = 46

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

export function mountDigitOneBlock(host, options = {}) {
  if (!host || host.dataset.d1bMounted === '1') return { destroy() {} }
  host.dataset.d1bMounted = '1'
  ensureStyles()

  const steps = buildDigitOneBlockSteps(options)
  const s0 = steps[0]
  const { n, posCount } = s0

  const rows = Math.ceil((n + 1) / COLS)
  const gridH = rows * CELL_H + (rows - 1) * ROW_GAP
  const gridW = COLS * CELL_W + (COLS - 1) * CELL_GAP
  const gridLeft = (W - gridW) / 2
  const LEDGER_TOP = GRID_TOP + gridH + LEDGER_GAP
  const TOTAL_TOP = LEDGER_TOP + LEDGER_H + TOTAL_GAP
  const PHASE_Y = TOTAL_TOP + TOTAL_H + 26
  const H = PHASE_Y + 18

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg d1b__svg',
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    'aria-label': '1 到 n 中数字 1 出现次数 数轴周期块动画',
  })
  const cellLayer = mk('g', { class: 'd1b-cells' })
  const markLayer = mk('g', { class: 'd1b-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  // ── 顶部说明 + 横幅 ──
  const note = mk('text', { class: 'd1b-note', x: 30, y: NOTE_Y })
  note.textContent = `数轴视角：0 ~ ${n}，看 1 长什么样（烫金 = 当前数位为 1）`
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'd1b-banner__box', x: 30, y: BANNER_Y, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segPos = mk('text', { class: 'd1b-banner__seg', x: 46, y: BANNER_Y + BANNER_H / 2 })
  const segAct = mk('text', { class: 'd1b-banner__seg', x: 236, y: BANNER_Y + BANNER_H / 2 })
  const segVal = mk('text', { class: 'd1b-banner__val', x: W - 46, y: BANNER_Y + BANNER_H / 2 })
  markLayer.append(segPos, segAct, segVal)

  const gridLabel = mk('text', { class: 'd1b-seclabel', x: 30, y: GRID_LABEL_Y })
  gridLabel.textContent = `0 ~ ${n}（每行 10 个，0 没有 1，永远不高亮）`
  markLayer.appendChild(gridLabel)

  // ── 数字网格 ──
  const cellEls = []
  for (let v = 0; v <= n; v += 1) {
    const row = Math.floor(v / COLS)
    const col = v % COLS
    const x = gridLeft + col * (CELL_W + CELL_GAP)
    const y = GRID_TOP + row * (CELL_H + ROW_GAP)
    const g = mk('g', { class: 'd1b-cell' })
    g.appendChild(
      mk('rect', { class: 'd1b-cell__box', x, y, width: CELL_W, height: CELL_H, rx: 6 }),
    )
    const val = mk('text', { class: 'd1b-cell__val', x: x + CELL_W / 2, y: y + CELL_H / 2 })
    val.textContent = String(v)
    g.appendChild(val)
    cellLayer.appendChild(g)
    cellEls.push({ g, v })
  }

  // ── 账本面板 ──
  markLayer.appendChild(
    mk('rect', { class: 'd1b-ledger__box', x: 30, y: LEDGER_TOP, width: W - 60, height: LEDGER_H, rx: 9 }),
  )
  const ledgerG = mk('g', { class: 'd1b-ledger' })
  const ledgerTitle = mk('text', { class: 'd1b-ledger__title', x: 46, y: LEDGER_TOP + 22 })
  const ledgerL1 = mk('text', { class: 'd1b-ledger__line', x: 46, y: LEDGER_TOP + 46 })
  const ledgerL2 = mk('text', { class: 'd1b-ledger__line', x: 46, y: LEDGER_TOP + 68 })
  const ledgerSum = mk('text', { class: 'd1b-ledger__sum', x: 46, y: LEDGER_TOP + 88 })
  ledgerG.append(ledgerTitle, ledgerL1, ledgerL2, ledgerSum)
  markLayer.appendChild(ledgerG)

  // ── 累计 chips + 合计 ──
  const CHIP_GAP = 12
  const CHIP_W = 120
  const TOTAL_W = 150
  const rowW = posCount * CHIP_W + (posCount - 1) * CHIP_GAP + 16 + TOTAL_W
  const rowLeft = (W - rowW) / 2
  const chipEls = []
  for (let k = 0; k < posCount; k += 1) {
    const x = rowLeft + k * (CHIP_W + CHIP_GAP)
    const g = mk('g', { class: 'd1b-chip is-off' })
    g.appendChild(
      mk('rect', { class: 'd1b-chip__box', x, y: TOTAL_TOP, width: CHIP_W, height: TOTAL_H, rx: 8 }),
    )
    const top = mk('text', { class: 'd1b-chip__top', x: x + CHIP_W / 2, y: TOTAL_TOP + 14 })
    const val = mk('text', { class: 'd1b-chip__val', x: x + CHIP_W / 2, y: TOTAL_TOP + 32 })
    g.append(top, val)
    cellLayer.appendChild(g)
    chipEls.push({ g, top, val })
  }
  const totalX = rowLeft + posCount * (CHIP_W + CHIP_GAP) - CHIP_GAP + 16
  const totalG = mk('g', { class: 'd1b-total' })
  totalG.appendChild(
    mk('rect', { class: 'd1b-total__box', x: totalX, y: TOTAL_TOP, width: TOTAL_W, height: TOTAL_H, rx: 8 }),
  )
  const totalLabel = mk('text', { class: 'd1b-total__label', x: totalX + TOTAL_W / 2, y: TOTAL_TOP + 15 })
  totalLabel.textContent = '合计'
  const totalVal = mk('text', { class: 'd1b-total__val', x: totalX + TOTAL_W / 2, y: TOTAL_TOP + 33 })
  totalG.append(totalLabel, totalVal)
  cellLayer.appendChild(totalG)

  const phaseText = mk('text', { class: 'd1b-phasetext', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  function paint(_index, step) {
    if (!step) return
    const { phase, posName, weight, cycle, fullBlocks, runLen, positionTotal, total } = step
    const oneSet = new Set(step.highlighted)

    cellEls.forEach(({ g, v }) => {
      const cls = ['d1b-cell']
      if (oneSet.has(v)) cls.push('is-one')
      else if (v === 0) cls.push('is-zero')
      g.setAttribute('class', cls.join(' '))
    })

    // 账本：只有 count 帧出完整账；pattern / init 帧给一句提示
    ledgerG.setAttribute('class', `d1b-ledger ${phase === 'count' ? '' : 'is-idle'}`)
    if (phase === 'count') {
      ledgerTitle.textContent = `${posName}账本`
      ledgerL1.textContent = `完整循环：${fullBlocks} 个 × 每个 ${weight} 个 = ${fullBlocks * weight}`
      const start = fullBlocks * cycle
      ledgerL2.textContent =
        runLen > 0
          ? runLen === weight
            ? `零头 ${start} ~ ${n}：1 那一截整块都在，数出 ${runLen} 个`
            : `零头 ${start} ~ ${n}：数出 ${runLen} 个`
          : `零头 ${start} ~ ${n}：还没走到 1 那一截`
      ledgerSum.textContent = `${posName}合计 = ${positionTotal}`
    } else if (phase === 'done') {
      ledgerTitle.textContent = '总账本'
      ledgerL1.textContent = step.positions.map((p) => `${p.posName} ${p.positionTotal}`).join(' + ')
      ledgerL2.textContent = `0 ~ ${n} 里每一个数字 1 都数到了，没有遗漏也没有重复。`
      ledgerSum.textContent = `合计 = ${total}`
    } else {
      ledgerTitle.textContent = '账本'
      ledgerL1.textContent = '先把当前数位为 1 的格子看出来（烫金），再记账。'
      ledgerL2.textContent = ''
      ledgerSum.textContent = ''
    }

    // 累计 chips
    chipEls.forEach((el, k) => {
      const p = step.positions[k]
      const cls = ['d1b-chip']
      if (!p) cls.push('is-off')
      else if (phase === 'count' && k === step.positions.length - 1) cls.push('is-new')
      el.g.setAttribute('class', cls.join(' '))
      if (p) {
        el.top.textContent = p.posName
        el.val.textContent = String(p.positionTotal)
      }
    })
    totalG.setAttribute('class', `d1b-total ${phase === 'done' ? 'is-on' : ''}`)
    totalVal.textContent = String(total)

    // 横幅
    if (phase === 'init') {
      segPos.textContent = '准备'
      segAct.textContent = '先看分布，再记账'
      segVal.textContent = `0 ~ ${n}`
    } else if (phase === 'done') {
      segPos.textContent = `${posCount} 位全部看完`
      segAct.textContent = '合计'
      segVal.textContent = String(total)
    } else {
      segPos.textContent = `${posName} · 每 ${cycle} 个数一次`
      segAct.textContent = phase === 'pattern' ? '看分布' : '记账本'
      segVal.textContent = phase === 'pattern' ? '?' : String(positionTotal)
    }

    phaseText.textContent =
      phase === 'init'
        ? '0 本身没有 1，放进来只是让每一行凑整 —— 它永远不高亮。'
        : phase === 'pattern'
          ? weight === 1
            ? '个位：每 10 个数循环一次，一个循环里个位是 1 的只有 1 个 —— 所以是散点。'
            : `${posName}：每 ${cycle} 个数循环一次，一个循环里有连续 ${weight} 个数的${posName}是 1 —— 所以是整块。`
          : phase === 'count'
            ? '每个数位的账本都是同一句话：完整循环数 × 每循环贡献 + 零头里那一截。'
            : '把这句话翻译成代码，就是下一个动画里的 higher / cur / lower 三件套。'

    renderRichText(descEl, step.desc)
  }

  const descEl = makeDesc()
  const rootEl = document.createElement('div')
  rootEl.className = 'viz d1b'
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
      delete host.dataset.d1bMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
