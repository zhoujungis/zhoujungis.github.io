/**
 * minStack.js — 「最小栈」(LC 155) 辅助栈解法的 SVG 渲染层。
 *
 * 两列竖直栈并排：左 = 主栈（底→顶向上画），右 = 辅助栈（每层记"这一刻的全栈最小值"）。
 * 顶部横幅显示当前操作与返回值；弹出不画消失、画成虚线幽灵格（看得见"历史"）。
 *
 * 通用坑：A / K / V / W / 红线 4。
 */

import { buildMinStackSteps } from './minStackSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'minstack-styles'

const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const BASE_Y = 336 // 栈底基准线
const CELL_H = 46
const CELL_W = 84
const CELL_GAP = 6

const LABEL_Y = BASE_Y + 26
const PHASE_Y = 388

const AVAIL = 604
const PLAY_MS = 1250

const STYLES = `
.msv {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.msv__svg { width: 100%; height: auto; display: block; }

.msv-note {
  fill: var(--msv-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.msv-banner__box {
  fill: var(--msv-banner, #f4f3ef);
  stroke: var(--msv-line, #c3c9c2);
  stroke-width: 1.5;
}
.msv-banner__op {
  fill: var(--msv-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.msv-banner__ret {
  fill: var(--msv-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.msv-cell__box {
  fill: var(--msv-fill, #ffffff);
  stroke: var(--msv-line, #c3c9c2);
  stroke-width: 1.5;
}
.msv-cell__val {
  fill: var(--msv-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.msv-cell__sub {
  fill: var(--msv-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 栈顶（当前可读）：绿框 */
.msv-cell.is-top .msv-cell__box {
  stroke: var(--msv-ok, #3f6b57);
  stroke-width: 3;
}
.msv-cell.is-top .msv-cell__val { fill: var(--msv-ok, #3f6b57); }
/* 本帧新压入：金框 */
.msv-cell.is-fresh .msv-cell__box {
  fill: var(--msv-gold-fill, #fdf3e3);
  stroke: var(--msv-gold, #c2872f);
  stroke-width: 3;
}
.msv-cell.is-fresh .msv-cell__val { fill: var(--msv-gold, #c2872f); }
/* 本帧弹出：虚线幽灵（留在原高度上方，看得见"历史"） */
.msv-cell.is-ghost .msv-cell__box {
  fill: none;
  stroke: var(--msv-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 2.5;
}
.msv-cell.is-ghost .msv-cell__val { fill: var(--msv-hot, #a45f45); }
.msv-cell.is-ghost .msv-cell__sub { fill: var(--msv-hot, #a45f45); }
/* 辅助栈里被同步弹出的幽灵 */
.msv-cell.is-minghost .msv-cell__box {
  fill: none;
  stroke: var(--msv-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.5;
}
.msv-cell.is-minghost .msv-cell__val { fill: var(--msv-dim, #9aa39c); }

.msv-label {
  fill: var(--msv-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.msv-floor {
  stroke: var(--msv-line, #c3c9c2);
  stroke-width: 2;
}
.msv-arrow {
  stroke: var(--msv-hot, #a45f45);
  stroke-width: 2;
  fill: none;
}
.msv-arrow__head { fill: var(--msv-hot, #a45f45); stroke: none; }
.msv-arrow__text {
  fill: var(--msv-hot, #a45f45);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.msv-phase__text {
  fill: var(--msv-muted, #657168);
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
 * @param {{ ops?: {op: string, val?: number}[], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountMinStack(host, options = {}) {
  if (!host || host.dataset.minstackMounted === '1') return { destroy() {} }
  host.dataset.minstackMounted = '1'
  ensureStyles()

  const steps = buildMinStackSteps(options)
  const autoplay = options.autoplay !== false
  const s0 = steps[0]
  const ops = s0.ops

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz msv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  // 最大深度决定列高
  const maxMain = Math.max(1, ...steps.map((f) => f.main.length))
  const maxMins = Math.max(1, ...steps.map((f) => f.mins.length))
  const maxDepth = Math.max(maxMain, maxMins)

  const width = 660
  const MAIN_CX = width / 2 - 110
  const MIN_CX = width / 2 + 110
  const height = PHASE_Y + 24

  const svgRoot = mk('svg', {
    class: 'viz__svg msv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '最小栈 辅助栈推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', { class: 'msv-cells' })
  const markLayer = mk('g', { class: 'msv-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'msv-note', x: 26, y: NOTE_Y })
  note.textContent = '最小值是历史：辅助栈每层记「这一刻全栈的最小值」—— pop 后自动恢复过去'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'msv-banner__box', x: 26, y: BANNER_TOP, width: width - 52, height: BANNER_H, rx: 9 }),
  )
  const bannerOp = mk('text', { class: 'msv-banner__op', x: 44, y: BANNER_TOP + BANNER_H / 2 })
  const bannerRet = mk('text', { class: 'msv-banner__ret', x: width - 44, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(bannerOp)
  markLayer.appendChild(bannerRet)

  // 栈底基准线 + 列标签
  markLayer.appendChild(mk('line', { class: 'msv-floor', x1: MAIN_CX - CELL_W / 2 - 10, y1: BASE_Y, x2: MAIN_CX + CELL_W / 2 + 10, y2: BASE_Y }))
  markLayer.appendChild(mk('line', { class: 'msv-floor', x1: MIN_CX - CELL_W / 2 - 10, y1: BASE_Y, x2: MIN_CX + CELL_W / 2 + 10, y2: BASE_Y }))
  const mainLabel = mk('text', { class: 'msv-label', x: MAIN_CX, y: LABEL_Y })
  mainLabel.textContent = 'main 主栈'
  const minLabel = mk('text', { class: 'msv-label', x: MIN_CX, y: LABEL_Y })
  minLabel.textContent = 'mins 辅助栈'
  markLayer.appendChild(mainLabel)
  markLayer.appendChild(minLabel)

  // 每列预建 maxDepth 个格子槽（含顶上一格幽灵槽）
  const buildColumn = (cx, n) => {
    const els = []
    for (let t = 0; t <= n; t += 1) {
      const g = mk('g', { class: 'msv-cell' })
      const y = BASE_Y - (t + 1) * (CELL_H + CELL_GAP)
      const box = mk('rect', { class: 'msv-cell__box', x: cx - CELL_W / 2, y, width: CELL_W, height: CELL_H, rx: 6 })
      g.appendChild(box)
      const val = mk('text', { class: 'msv-cell__val', x: cx, y: y + CELL_H / 2 - 5 })
      g.appendChild(val)
      const sub = mk('text', { class: 'msv-cell__sub', x: cx, y: y + CELL_H - 9 })
      g.appendChild(sub)
      cellLayer.appendChild(g)
      els.push({ g, val, sub })
    }
    return els
  }
  const mainEls = buildColumn(MAIN_CX, maxMain)
  const minEls = buildColumn(MIN_CX, maxMins)

  // 同步箭头（push 压辅助栈 / pop 同步弹出时出现）
  const arrowG = mk('g', { class: 'msv-sync' })
  const arrowLine = mk('line', { class: 'msv-arrow', x1: MAIN_CX + CELL_W / 2 + 6, y1: 0, x2: MIN_CX - CELL_W / 2 - 14, y2: 0 })
  const arrowHead = mk('path', { class: 'msv-arrow__head', d: '' })
  const arrowText = mk('text', { class: 'msv-arrow__text', x: (MAIN_CX + MIN_CX) / 2, y: 0 })
  arrowG.appendChild(arrowLine)
  arrowG.appendChild(arrowHead)
  arrowG.appendChild(arrowText)
  markLayer.appendChild(arrowG)

  const phaseText = mk('text', { class: 'msv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paintColumn(els, values, topIdx, freshIdx, ghostIdx, ghostLabel) {
    els.forEach((el, t) => {
      const cls = ['msv-cell']
      if (t < values.length) {
        el.val.textContent = String(values[t])
        el.sub.textContent = t === 0 ? 'bottom' : `#${t}`
        if (t === topIdx) cls.push('is-top')
        if (t === freshIdx) cls.push('is-fresh')
      } else if (t === ghostIdx) {
        el.val.textContent = ghostLabel
        el.sub.textContent = '弹出'
        cls.push('is-ghost')
      } else {
        el.val.textContent = ''
        el.sub.textContent = ''
        cls.push('is-minghost')
      }
      el.g.setAttribute('class', cls.join(' '))
    })
  }

  function paint(_index, step) {
    if (!step) return
    const main = step.main
    const mins = step.mins
    const mTop = main.length - 1
    const nTop = mins.length - 1

    const isPush = step.phase === 'push'
    const isPop = step.phase === 'pop'

    // 主栈
    paintColumn(
      mainEls,
      main,
      mTop,
      isPush ? mTop : -1,
      isPop ? main.length : -1,
      isPop ? String(step.popped) : '',
    )
    // 辅助栈
    paintColumn(
      minEls,
      mins,
      nTop,
      isPush && step.minPushed ? nTop : -1,
      isPop && step.minPopped !== null ? mins.length : -1,
      isPop && step.minPopped !== null ? String(step.minPopped) : '',
    )

    // 同步箭头：push 压入辅助栈、pop 同步弹出时出现
    const showArrow = (isPush && step.minPushed) || (isPop && step.minPopped !== null)
    if (showArrow) {
      const ay = BASE_Y - (mins.length + (isPush ? 0 : 1)) * (CELL_H + CELL_GAP) + CELL_H / 2
      arrowLine.setAttribute('y1', ay)
      arrowLine.setAttribute('y2', ay)
      arrowLine.setAttribute('x2', MIN_CX - CELL_W / 2 - 10)
      arrowHead.setAttribute('d', `M ${MIN_CX - CELL_W / 2 - 4} ${ay} L ${MIN_CX - CELL_W / 2 - 13} ${ay - 5} L ${MIN_CX - CELL_W / 2 - 13} ${ay + 5} Z`)
      arrowText.setAttribute('y', ay - 12)
      arrowText.textContent = isPush ? '同步压入' : '同步弹出'
      arrowG.style.opacity = '1'
    } else {
      arrowG.style.opacity = '0'
    }

    // 横幅
    const op = step.opIdx !== null ? ops[step.opIdx] : null
    if (step.phase === 'init') {
      bannerOp.textContent = '最小栈：getMin 要求 O(1)'
      bannerRet.textContent = ''
    } else if (step.phase === 'done') {
      bannerOp.textContent = `${ops.length} 个操作完成`
      bannerRet.textContent = `min=${mins.length > 0 ? mins[mins.length - 1] : '∅'}`
    } else if (op) {
      bannerOp.textContent = op.op === 'push' ? `push(${op.val})` : `${op.op}()`
      if (step.result !== null && step.result !== undefined) bannerRet.textContent = `→ ${step.result}`
      else if (isPop) bannerRet.textContent = `弹 ${step.popped}${step.minPopped !== null ? ' · 同步弹 min' : ''}`
      else bannerRet.textContent = ''
    }

    // 底部状态行
    if (isPush) {
      phaseText.textContent = step.minPushed
        ? 'x <= 当前最小值 → 辅助栈同步压入，记录这一刻的历史'
        : 'x > 当前最小值 → 辅助栈留空档，历史没变化'
    } else if (isPop) {
      phaseText.textContent = step.minPopped !== null
        ? '弹出的是当前最小值 → 两栈同步弹，旧最小值自动恢复'
        : '弹出的不是最小值 → 辅助栈不动，最小值不变'
    } else if (step.phase === 'getMin') {
      phaseText.textContent = 'getMin = 读辅助栈顶 —— O(1)，不扫主栈'
    } else if (step.phase === 'top') {
      phaseText.textContent = 'top = 读主栈顶 —— 栈的本职工作'
    } else if (step.phase === 'init') {
      phaseText.textContent = '栈只见栈顶，最小值却在任意一层 —— 所以按层存'
    } else {
      phaseText.textContent = '四个操作全 O(1) —— 用辅助栈的 O(n) 空间换「记住历史」'
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
      delete host.dataset.minstackMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
