/**
 * rand10.js — 「用 Rand7() 实现 Rand10()」(LC 470) 拒绝采样的 SVG 渲染层。
 *
 * 布局：左侧 = 7×7 的 49 格状态表（行 = a、列 = b，格子里的数字是
 * (a-1)×7+b；1..40 接受区、41..49 拒绝区，命中格金框）；右侧 = 两颗骰子、
 * 合成公式、判定与输出、调用计数；横幅 + 状态行。
 *
 * 与其他动画骨架一致：模块级 STYLE_ID + ensureStyles()，dataset 幂等守卫，
 * createPlayer + jumpTo，IntersectionObserver 自动播放。
 */

import { buildRand10Steps } from './rand10Steps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'rand10-styles'

const NOTE_Y = 28
const GRID_X = 30
const GRID_Y = 76
const CELL = 40
const CGAP = 4
const RIGHT_X = 350
const RIGHT_W = 284
const BANNER_Y = 392
const BANNER_H = 40
const PHASE_Y = 456

const PLAY_MS = 1150

const STYLES = `
.rdv { display: flex; flex-direction: column; gap: 14px; }
.rdv__svg { width: 100%; height: auto; display: block; }

.rdv-note {
  fill: var(--rdv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdv-note--r { text-anchor: end; }
.rdv-lbl { fill: var(--rdv-muted, #657168); font-size: 11.5px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.rdv-cell__box { stroke: var(--rdv-line, #d8ded6); stroke-width: 1; }
.rdv-cell--accept .rdv-cell__box { fill: var(--rdv-accept, #e7f2ea); }
.rdv-cell--reject .rdv-cell__box { fill: var(--rdv-reject, #f7ece8); }
.rdv-cell.is-hit .rdv-cell__box { stroke: var(--rdv-gold, #c2872f); stroke-width: 3; fill: var(--rdv-hit, #fdf3e3); }
.rdv-cell.is-rejected .rdv-cell__box { stroke: var(--rdv-hot, #a45f45); stroke-width: 3; }
.rdv-cell__num {
  fill: var(--rdv-ink, #4a544c); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdv-cell.is-hit .rdv-cell__num { fill: var(--rdv-gold, #c2872f); font-weight: 700; }
.rdv-cell.is-rejected .rdv-cell__num { fill: var(--rdv-hot, #a45f45); font-weight: 700; }
.rdv-idx { fill: var(--rdv-dim, #9aa39c); font-size: 10px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.rdv-box { fill: var(--rdv-fill, #ffffff); stroke: var(--rdv-line, #c3c9c2); stroke-width: 1.5; }
.rdv-die__lbl { fill: var(--rdv-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-die__val {
  fill: var(--rdv-ink, #1f2a24); font-size: 26px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.rdv-die__val.is-live { fill: var(--rdv-gold, #c2872f); }

.rdv-formula { fill: var(--rdv-ink, #1f2a24); font-size: 13px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-verdict { font-size: 15px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-verdict.is-ok { fill: var(--rdv-ok, #3f6b57); }
.rdv-verdict.is-no { fill: var(--rdv-hot, #a45f45); }
.rdv-verdict.is-idle { fill: var(--rdv-dim, #9aa39c); }

.rdv-chip__box { fill: var(--rdv-fill, #ffffff); stroke: var(--rdv-line, #c3c9c2); stroke-width: 1.5; }
.rdv-chip__val { fill: var(--rdv-ink, #1f2a24); font-size: 12px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-chip.is-out .rdv-chip__box { fill: var(--rdv-ok-fill, #eef5f1); stroke: var(--rdv-ok, #3f6b57); stroke-width: 2; }
.rdv-chip.is-out .rdv-chip__val { fill: var(--rdv-ok, #3f6b57); }
.rdv-chip.is-latest .rdv-chip__box { fill: var(--rdv-gold-fill, #fdf3e3); stroke: var(--rdv-gold, #c2872f); stroke-width: 2.5; }
.rdv-chip.is-latest .rdv-chip__val { fill: var(--rdv-gold, #c2872f); }

.rdv-count { fill: var(--rdv-muted, #657168); font-size: 12px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-count b { font-weight: 700; }

.rdv-banner__box { fill: var(--rdv-banner, #f4f3ef); stroke: var(--rdv-line, #c3c9c2); stroke-width: 1.5; }
.rdv-banner__text { fill: var(--rdv-hot, #a45f45); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.rdv-banner__text.is-ok { fill: var(--rdv-ok, #3f6b57); }

.rdv-phase__text { fill: var(--rdv-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
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
 * @param {{ from?: number, to?: number, rolls?: number[], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountRand10(host, options = {}) {
  if (!host || host.dataset.rand10Mounted === '1') return { destroy() {} }
  host.dataset.rand10Mounted = '1'
  ensureStyles()

  const steps = buildRand10Steps(options)
  const autoplay = options.autoplay !== false
  const { from, to, size, acceptLimit } = steps[0]

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz rdv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg rdv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': 'Rand7 实现 Rand10 LC470 拒绝采样推演动画',
  })
  stage.appendChild(svgRoot)

  const gridLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(gridLayer, markLayer)

  const note = mk('text', { class: 'rdv-note', x: 26, y: NOTE_Y })
  note.textContent = `两次 rand${from}() 凑成 ${size} 个等概率状态：v ≤ ${acceptLimit} 接受，否则整组重掷`
  markLayer.appendChild(note)
  const goal = mk('text', { class: 'rdv-note rdv-note--r', x: width - 26, y: NOTE_Y })
  goal.textContent = `rand${from}() → rand${to}()`
  markLayer.appendChild(goal)

  // ── 状态表 ──
  const cellEls = []
  for (let r = 0; r < from; r += 1) {
    const rowEls = []
    for (let c = 0; c < from; c += 1) {
      const x = GRID_X + c * (CELL + CGAP)
      const y = GRID_Y + r * (CELL + CGAP)
      const value = r * from + c + 1
      const g = mk('g', { class: 'rdv-cell' })
      g.appendChild(mk('rect', { class: 'rdv-cell__box', x, y, width: CELL, height: CELL, rx: 5 }))
      const num = mk('text', { class: 'rdv-cell__num', x: x + CELL / 2, y: y + CELL / 2 })
      num.textContent = String(value)
      g.appendChild(num)
      gridLayer.appendChild(g)
      rowEls.push({ g })
    }
    cellEls.push(rowEls)
  }
  // 行列标号（a = 行、b = 列）
  for (let i = 0; i < from; i += 1) {
    const cx = GRID_X + i * (CELL + CGAP) + CELL / 2
    const cy = GRID_Y + i * (CELL + CGAP) + CELL / 2
    const ct = mk('text', { class: 'rdv-idx', x: cx, y: GRID_Y - 14 })
    ct.textContent = String(i + 1)
    const rt = mk('text', { class: 'rdv-idx', x: GRID_X - 14, y: cy })
    rt.textContent = String(i + 1)
    markLayer.append(ct, rt)
  }
  const axLbl = mk('text', { class: 'rdv-lbl', x: GRID_X - 14, y: GRID_Y - 32, 'text-anchor': 'middle' })
  axLbl.textContent = 'a'
  const bxLbl = mk('text', { class: 'rdv-lbl', x: GRID_X + 304 / 2, y: GRID_Y - 32 })
  bxLbl.textContent = 'b →'
  markLayer.append(axLbl, bxLbl)

  // ── 骰子 ──
  const dieW = 134
  markLayer.appendChild(mk('rect', { class: 'rdv-box', x: RIGHT_X, y: GRID_Y, width: dieW, height: 62, rx: 9 }))
  markLayer.appendChild(mk('rect', { class: 'rdv-box', x: RIGHT_X + dieW + 16, y: GRID_Y, width: dieW, height: 62, rx: 9 }))
  const dieLblA = mk('text', { class: 'rdv-die__lbl', x: RIGHT_X + dieW / 2, y: GRID_Y + 14 })
  dieLblA.textContent = `rand${from}() → a`
  const dieLblB = mk('text', { class: 'rdv-die__lbl', x: RIGHT_X + dieW + 16 + dieW / 2, y: GRID_Y + 14 })
  dieLblB.textContent = `rand${from}() → b`
  const dieA = mk('text', { class: 'rdv-die__val', x: RIGHT_X + dieW / 2, y: GRID_Y + 40 })
  const dieB = mk('text', { class: 'rdv-die__val', x: RIGHT_X + dieW + 16 + dieW / 2, y: GRID_Y + 40 })
  markLayer.append(dieLblA, dieLblB, dieA, dieB)

  // ── 公式 ──
  markLayer.appendChild(mk('rect', { class: 'rdv-box', x: RIGHT_X, y: GRID_Y + 78, width: RIGHT_W, height: 40, rx: 8 }))
  const formula = mk('text', { class: 'rdv-formula', x: RIGHT_X + RIGHT_W / 2, y: GRID_Y + 98 })
  markLayer.appendChild(formula)

  // ── 判定 ──
  markLayer.appendChild(mk('rect', { class: 'rdv-box', x: RIGHT_X, y: GRID_Y + 128, width: RIGHT_W, height: 40, rx: 8 }))
  const verdict = mk('text', { class: 'rdv-verdict is-idle', x: RIGHT_X + RIGHT_W / 2, y: GRID_Y + 148 })
  markLayer.appendChild(verdict)

  // ── 输出 chips ──
  const outLabel = mk('text', { class: 'rdv-lbl', x: RIGHT_X, y: GRID_Y + 196 })
  outLabel.textContent = 'rand10() 输出序列'
  markLayer.appendChild(outLabel)
  const chipW = 34
  const outChips = []
  for (let i = 0; i < 8; i += 1) {
    const x = RIGHT_X + i * (chipW + 6)
    const g = mk('g', { class: 'rdv-chip' })
    g.appendChild(mk('rect', { class: 'rdv-chip__box', x, y: GRID_Y + 208, width: chipW, height: 26, rx: 6 }))
    const t = mk('text', { class: 'rdv-chip__val', x: x + chipW / 2, y: GRID_Y + 221 })
    g.appendChild(t)
    markLayer.appendChild(g)
    outChips.push({ g, t })
  }

  // ── 计数 ──
  const counter = mk('text', { class: 'rdv-count', x: RIGHT_X, y: GRID_Y + 268 })
  markLayer.appendChild(counter)

  // ── 横幅 / 状态行 ──
  markLayer.appendChild(mk('rect', { class: 'rdv-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'rdv-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)
  const phaseText = mk('text', { class: 'rdv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const hitR = step.a === null ? -1 : step.a - 1
    const hitC = step.b === null ? -1 : step.b - 1
    const cellValue = step.cellValue

    cellEls.forEach((rowEls, r) => {
      rowEls.forEach((el, c) => {
        const value = r * from + c + 1
        const cls = ['rdv-cell', value <= acceptLimit ? 'rdv-cell--accept' : 'rdv-cell--reject']
        if (r === hitR && c === hitC) {
          cls.push('is-hit')
          if (step.phase === 'reject') cls.push('is-rejected')
        }
        el.g.setAttribute('class', cls.join(' '))
      })
    })

    dieA.textContent = step.a === null ? '—' : String(step.a)
    dieB.textContent = step.b === null ? '—' : String(step.b)
    dieA.setAttribute('class', 'rdv-die__val' + (step.a !== null ? ' is-live' : ''))
    dieB.setAttribute('class', 'rdv-die__val' + (step.b !== null ? ' is-live' : ''))

    formula.textContent =
      cellValue === null ? `v = (a−1) × ${from} + b` : `v = (${step.a}−1) × ${from} + ${step.b} = ${cellValue}`

    if (step.phase === 'accept') {
      verdict.textContent = `v = ${cellValue} ≤ ${acceptLimit} → 接受`
      verdict.setAttribute('class', 'rdv-verdict is-ok')
    } else if (step.phase === 'reject') {
      verdict.textContent = `v = ${cellValue} > ${acceptLimit} → 拒绝，整组重掷`
      verdict.setAttribute('class', 'rdv-verdict is-no')
    } else if (step.phase === 'roll') {
      verdict.textContent = '等定夺…'
      verdict.setAttribute('class', 'rdv-verdict is-idle')
    } else {
      verdict.textContent = '—'
      verdict.setAttribute('class', 'rdv-verdict is-idle')
    }

    const outs = step.outputs.slice(-outChips.length)
    outChips.forEach((chip, i) => {
      if (i >= outs.length) {
        chip.g.style.display = 'none'
        return
      }
      chip.g.style.display = ''
      chip.t.textContent = String(outs[i])
      const latest = i === outs.length - 1
      chip.g.setAttribute('class', 'rdv-chip is-out' + (latest ? ' is-latest' : ''))
    })

    counter.textContent = `调用 ${step.calls} 次 · 拒绝 ${step.rejects} 次 · 期望 ${step.expect.toFixed(2)} 次`

    if (step.phase === 'init') {
      banner.textContent = `49 个等概率状态：1..${acceptLimit} 绿色接受区、${acceptLimit + 1}..${size} 红色拒绝区`
      banner.setAttribute('class', 'rdv-banner__text')
    } else if (step.phase === 'roll') {
      banner.textContent = `第 ${step.attempts} 次尝试：a = ${step.a}，b = ${step.b}`
      banner.setAttribute('class', 'rdv-banner__text')
    } else if (step.phase === 'accept') {
      banner.textContent = `接受 → 输出 ${step.output}（(v−1) % ${to} + 1）`
      banner.setAttribute('class', 'rdv-banner__text is-ok')
    } else if (step.phase === 'reject') {
      banner.textContent = `拒绝 v = ${step.cellValue} —— 不产出，重掷`
      banner.setAttribute('class', 'rdv-banner__text')
    } else {
      banner.textContent = `完成：输出 [${step.outputs.join(', ')}]，共调用 ${step.calls} 次`
      banner.setAttribute('class', 'rdv-banner__text is-ok')
    }

    if (step.phase === 'init') phaseText.textContent = `一次 rand${from}() 只有 ${from} 个状态，两次独立才有 ${size} 个等概率状态`
    else if (step.phase === 'roll') phaseText.textContent = '先算 v = (a−1)×7+b：把二维的 (a,b) 拍平成一维的 1..49'
    else if (step.phase === 'accept') phaseText.textContent = '每个输出恰好 4 个来源状态（40 = 4 × 10），所以均匀'
    else if (step.phase === 'reject') phaseText.textContent = '拒绝不破坏均匀：重掷独立同分布，条件分布不变'
    else phaseText.textContent = '期望 = 2 × 49/40 = 2.45 次；信息论下界约 1.18 次'

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
      delete host.dataset.rand10Mounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
