/**
 * eliminateSum10.js — 腾讯面经「相邻和为 10 消除」栈模拟的 SVG 渲染层。
 *
 * 上方是输入串（一行格子），下方左边是栈（底 → 顶向上画），右边是状态面板。
 * 栈顶和新数字互补时，两者一起消失：输入串里这两格变成红色虚线，栈里被弹掉的
 * 那格在上方留一个虚线幽灵格 —— 看得见"它刚才在那儿"。
 *
 * 通用坑沿用仓库惯例：颜色一律用 CSS 变量 + 字面量回退（viz-shot 会把 SVG
 * 单独序列化，外层 div 的变量取不到）；槽位高度按最大栈深自适应，不让长串溢出。
 */

import { buildEliminateSum10Steps } from './eliminateSum10Steps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'elimsum10-styles'

const NOTE_Y = 30
const BANNER_TOP = 52
const BANNER_H = 46

const STRIP_Y = 112
const CHIP = 38
const CHIP_GAP = 8

const BASE_Y = 336
const CELL_W = 88
const CELL_GAP = 6
const STACK_CX = 150

const PANEL_X = 290
const PANEL_Y = 170
const PANEL_W = 344
const PANEL_H = 150

const LABEL_Y = BASE_Y + 26
const PHASE_Y = 388

const AVAIL = 604
const PLAY_MS = 1250

const STYLES = `
.elv {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.elv__svg { width: 100%; height: auto; display: block; }

.elv-note {
  fill: var(--elv-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.elv-banner__box {
  fill: var(--elv-banner, #f4f3ef);
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 1.5;
}
.elv-banner__op {
  fill: var(--elv-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-banner__ret {
  fill: var(--elv-gold, #c2872f);
  font-size: 15px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 输入串的格子 */
.elv-chip__box {
  fill: var(--elv-fill, #ffffff);
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 1.5;
}
.elv-chip__val {
  fill: var(--elv-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-chip__idx {
  fill: var(--elv-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 当前扫到的字符：金框 */
.elv-chip.is-cur .elv-chip__box {
  fill: var(--elv-gold-fill, #fdf3e3);
  stroke: var(--elv-gold, #c2872f);
  stroke-width: 3;
}
.elv-chip.is-cur .elv-chip__val { fill: var(--elv-gold, #c2872f); }
/* 栈顶（左边最后一个还在的数字）：绿框 */
.elv-chip.is-top .elv-chip__box {
  stroke: var(--elv-ok, #3f6b57);
  stroke-width: 3;
}
.elv-chip.is-top .elv-chip__val { fill: var(--elv-ok, #3f6b57); }
/* 已被消掉：灰虚线 */
.elv-chip.is-gone .elv-chip__box {
  fill: none;
  stroke: var(--elv-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.5;
}
.elv-chip.is-gone .elv-chip__val { fill: var(--elv-dim, #9aa39c); }
/* 本帧被消掉：红虚线 */
.elv-chip.is-elim .elv-chip__box {
  fill: none;
  stroke: var(--elv-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 3;
}
.elv-chip.is-elim .elv-chip__val { fill: var(--elv-hot, #a45f45); }
.elv-chip.is-dim { opacity: 0.55; }

/* 栈格 */
.elv-cell__box {
  fill: var(--elv-fill, #ffffff);
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 1.5;
}
.elv-cell__val {
  fill: var(--elv-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-cell__sub {
  fill: var(--elv-dim, #9aa39c);
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-cell.is-top .elv-cell__box {
  stroke: var(--elv-ok, #3f6b57);
  stroke-width: 3;
}
.elv-cell.is-top .elv-cell__val { fill: var(--elv-ok, #3f6b57); }
.elv-cell.is-fresh .elv-cell__box {
  fill: var(--elv-gold-fill, #fdf3e3);
  stroke: var(--elv-gold, #c2872f);
  stroke-width: 3;
}
.elv-cell.is-fresh .elv-cell__val { fill: var(--elv-gold, #c2872f); }
.elv-cell.is-ghost .elv-cell__box {
  fill: none;
  stroke: var(--elv-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 2.5;
}
.elv-cell.is-ghost .elv-cell__val { fill: var(--elv-hot, #a45f45); }
.elv-cell.is-ghost .elv-cell__sub { fill: var(--elv-hot, #a45f45); }
.elv-cell.is-empty .elv-cell__box {
  fill: none;
  stroke: var(--elv-line, #c3c9c2);
  stroke-dasharray: 2 4;
  stroke-width: 1;
}

.elv-panel__box {
  fill: var(--elv-banner, #f4f3ef);
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 1.5;
}
.elv-panel__label {
  fill: var(--elv-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.elv-panel__value {
  fill: var(--elv-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-panel__value.is-ok { fill: var(--elv-ok, #3f6b57); }
.elv-panel__value.is-hot { fill: var(--elv-hot, #a45f45); }

.elv-label {
  fill: var(--elv-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.elv-floor {
  stroke: var(--elv-line, #c3c9c2);
  stroke-width: 2;
}
.elv-phase__text {
  fill: var(--elv-muted, #657168);
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

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{ s?: string, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountEliminateSum10(host, options = {}) {
  if (!host || host.dataset.elimsum10Mounted === '1') return { destroy() {} }
  host.dataset.elimsum10Mounted = '1'
  ensureStyles()

  const steps = buildEliminateSum10Steps(options)
  const autoplay = options.autoplay !== false
  const s0 = steps[0]
  const chars = s0.chars
  const n = s0.n

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz elv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const maxDepth = Math.max(1, ...steps.map((f) => f.stack.length))
  const slots = maxDepth + 1
  const stackTop = PANEL_Y
  const availH = BASE_Y - stackTop
  const cellH = Math.min(46, Math.floor((availH - (slots - 1) * CELL_GAP) / slots))
  const height = PHASE_Y + 24

  const svgRoot = mk('svg', {
    class: 'viz__svg elv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '相邻和为 10 消除 栈模拟动画',
  })
  stage.appendChild(svgRoot)

  const stripLayer = mk('g', { class: 'elv-strip' })
  const cellLayer = mk('g', { class: 'elv-cells' })
  const markLayer = mk('g', { class: 'elv-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(stripLayer)
  svgRoot.appendChild(markLayer)

  // 顶部注记
  const note = mk('text', { class: 'elv-note', x: 26, y: NOTE_Y })
  note.textContent = '补数配对：1↔9  2↔8  3↔7  4↔6  5↔5 —— 栈顶和新数字互补就一起消失'
  markLayer.appendChild(note)

  // 横幅
  markLayer.appendChild(
    mk('rect', { class: 'elv-banner__box', x: 26, y: BANNER_TOP, width: width - 52, height: BANNER_H, rx: 9 }),
  )
  const bannerOp = mk('text', { class: 'elv-banner__op', x: 44, y: BANNER_TOP + BANNER_H / 2 })
  const bannerRet = mk('text', { class: 'elv-banner__ret', x: width - 44, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(bannerOp)
  markLayer.appendChild(bannerRet)

  // 输入串
  const stripW = n * CHIP + Math.max(0, n - 1) * CHIP_GAP
  const stripX = Math.max(26, (width - stripW) / 2)
  const stripEls = chars.map((_, k) => {
    const x = stripX + k * (CHIP + CHIP_GAP)
    const g = mk('g', { class: 'elv-chip' })
    g.appendChild(mk('rect', { class: 'elv-chip__box', x, y: STRIP_Y, width: CHIP, height: CHIP, rx: 6 }))
    const val = mk('text', { class: 'elv-chip__val', x: x + CHIP / 2, y: STRIP_Y + CHIP / 2 - 4 })
    const idx = mk('text', { class: 'elv-chip__idx', x: x + CHIP / 2, y: STRIP_Y + CHIP - 8 })
    idx.textContent = String(k)
    g.appendChild(val)
    g.appendChild(idx)
    stripLayer.appendChild(g)
    return { g, val }
  })

  // 栈格
  const stackEls = []
  for (let t = 0; t < slots; t += 1) {
    const g = mk('g', { class: 'elv-cell' })
    const y = BASE_Y - (t + 1) * cellH - t * CELL_GAP
    g.appendChild(
      mk('rect', { class: 'elv-cell__box', x: STACK_CX - CELL_W / 2, y, width: CELL_W, height: cellH, rx: 6 }),
    )
    const val = mk('text', { class: 'elv-cell__val', x: STACK_CX, y: y + cellH / 2 - 5 })
    const sub = mk('text', { class: 'elv-cell__sub', x: STACK_CX, y: y + cellH - 9 })
    g.appendChild(val)
    g.appendChild(sub)
    cellLayer.appendChild(g)
    stackEls.push({ g, val, sub })
  }

  markLayer.appendChild(
    mk('line', { class: 'elv-floor', x1: STACK_CX - CELL_W / 2 - 10, y1: BASE_Y, x2: STACK_CX + CELL_W / 2 + 10, y2: BASE_Y }),
  )
  const stackLabel = mk('text', { class: 'elv-label', x: STACK_CX, y: LABEL_Y })
  stackLabel.textContent = '栈（底 → 顶）'
  markLayer.appendChild(stackLabel)

  // 状态面板
  markLayer.appendChild(
    mk('rect', { class: 'elv-panel__box', x: PANEL_X, y: PANEL_Y, width: PANEL_W, height: PANEL_H, rx: 10 }),
  )
  const panelRows = [
    { label: '本帧判定', y: PANEL_Y + 40, key: 'verdict' },
    { label: '已消对数', y: PANEL_Y + 76, key: 'pops' },
    { label: '剩余长度', y: PANEL_Y + 112, key: 'len' },
  ].map((row) => {
    const label = mk('text', { class: 'elv-panel__label', x: PANEL_X + 18, y: row.y })
    label.textContent = row.label
    const value = mk('text', { class: 'elv-panel__value', x: PANEL_X + PANEL_W - 18, y: row.y })
    markLayer.appendChild(label)
    markLayer.appendChild(value)
    return { ...row, value }
  })

  const phaseText = mk('text', { class: 'elv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const goneSet = new Set(step.gone)
    const elimSet = new Set(step.eliminated || [])
    const topIdx = step.stack.length > 0 ? step.stack[step.stack.length - 1] : null
    const isDone = step.phase === 'done'

    // 输入串
    stripEls.forEach((el, k) => {
      const cls = ['elv-chip']
      if (isDone) cls.push('is-dim')
      if (goneSet.has(k)) cls.push('is-gone')
      if (topIdx === k && !isDone) cls.push('is-top')
      if (step.i === k && !isDone) cls.push('is-cur')
      if (elimSet.has(k)) cls.push('is-elim')
      el.g.setAttribute('class', cls.join(' '))
      el.val.textContent = chars[k]
    })

    // 栈
    const stack = step.stack
    stackEls.forEach((el, t) => {
      const cls = ['elv-cell']
      if (t < stack.length) {
        el.val.textContent = chars[stack[t]]
        el.sub.textContent = t === 0 ? `#${stack[t]} 底` : `#${stack[t]}`
        if (t === stack.length - 1 && !isDone) cls.push('is-top')
        if (step.phase === 'push' && t === stack.length - 1) cls.push('is-fresh')
      } else if (step.phase === 'pop' && t === stack.length) {
        el.val.textContent = step.topCh
        el.sub.textContent = '弹出'
        cls.push('is-ghost')
      } else {
        el.val.textContent = ''
        el.sub.textContent = ''
        cls.push('is-empty')
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    // 横幅
    if (step.phase === 'init') {
      bannerOp.textContent = '相邻和为 10 就消除：栈顶互补就弹出'
      bannerRet.textContent = `${n} 个字符`
    } else if (isDone) {
      bannerOp.textContent = `${n} 个字符扫完`
      bannerRet.textContent = `结果 "${step.result}"`
    } else {
      bannerOp.textContent = `s[${step.i}] = "${step.ch}"`
      const sum = step.topCh === null ? null : Number(step.topCh) + Number(step.ch)
      if (step.phase === 'pop') bannerRet.textContent = `${step.topCh} + ${step.ch} = 10 → 消`
      else bannerRet.textContent = step.topCh === null ? '栈空 → 入栈' : `${step.topCh} + ${step.ch} = ${sum} ≠ 10 → 入栈`
    }

    // 面板
    const sum = step.topCh === null ? null : Number(step.topCh) + Number(step.ch)
    panelRows[0].value.textContent = isDone
      ? `"${step.result}"`
      : step.phase === 'pop'
        ? `${step.topCh} + ${step.ch} = 10`
        : step.topCh === null
          ? '栈空'
          : `${step.topCh} + ${step.ch} = ${sum}`
    panelRows[0].value.setAttribute('class', `elv-panel__value ${step.phase === 'pop' ? 'is-hot' : isDone ? 'is-ok' : ''}`)
    panelRows[1].value.textContent = String(step.pops)
    panelRows[2].value.textContent = String(stack.length)

    // 底部状态行
    if (step.phase === 'init') {
      phaseText.textContent = '每个数字只有一个补数 —— 这是"结果唯一"的根源'
    } else if (step.phase === 'pop') {
      phaseText.textContent = '两个一起消失；弹出后新栈顶就是"左边接过来的数字"'
    } else if (step.phase === 'push') {
      phaseText.textContent = '消不掉 → 入栈，成为新的栈顶（一个数字最多消一个栈顶）'
    } else {
      phaseText.textContent = `结果不可约、且与消除顺序无关 —— 所以"最短长度"就是 ${step.result.length}`
    }

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
      delete host.dataset.elimsum10Mounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
