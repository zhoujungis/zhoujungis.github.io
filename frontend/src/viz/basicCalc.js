/**
 * basicCalc.js — 「基本计算器」(LC 224) 单栈解法的 SVG 渲染层。
 *
 * 三段布局：顶部 = 表达式 token 条（当前 token 高亮、走过的变暗）；
 * 中部 = 当前层累加器面板（result 大格子 + sign 徽章）；
 * 底部 = 括号上下文栈（每格存 {外层result, 括号sign}）。
 * close 帧把弹出的上下文画成虚线幽灵，并展示合并公式。
 *
 * 通用坑：A / K / V / W / 红线 4。
 */

import { buildBasicCalcSteps } from './basicCalcSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'basiccalc-styles'

const NOTE_Y = 40
const TOK_Y = 62
const TOK_H = 34
const TOK_W = 42
const TOK_GAP = 4
const POINTER_Y = TOK_Y + TOK_H + 12

const PANEL_TOP = 132
const PANEL_H = 64
const BASE_Y = 336
const CELL_H = 40
const CELL_W = 168
const LABEL_Y = BASE_Y + 24
const PHASE_Y = 386

const AVAIL = 604
const PLAY_MS = 1250

const STYLES = `
.bcv { display: flex; flex-direction: column; gap: 14px; }
.bcv__svg { width: 100%; height: auto; display: block; }

.bcv-note {
  fill: var(--bcv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-tok__box {
  fill: var(--bcv-fill, #ffffff);
  stroke: var(--bcv-line, #c3c9c2); stroke-width: 1.5;
}
.bcv-tok__val {
  fill: var(--bcv-ink, #1f2a24);
  font-size: 15px; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-tok.is-past .bcv-tok__box { fill: var(--bcv-past, #eef0ec); stroke: var(--bcv-past-line, #d8ddd6); }
.bcv-tok.is-past .bcv-tok__val { fill: var(--bcv-dim, #9aa39c); }
.bcv-tok.is-now .bcv-tok__box {
  fill: var(--bcv-gold-fill, #fdf3e3); stroke: var(--bcv-gold, #c2872f); stroke-width: 3;
}
.bcv-tok.is-now .bcv-tok__val { fill: var(--bcv-gold, #c2872f); }
.bcv-pointer { fill: var(--bcv-gold, #c2872f); }

.bcv-panel__box {
  fill: var(--bcv-banner, #f4f3ef); stroke: var(--bcv-line, #c3c9c2); stroke-width: 1.5;
}
.bcv-panel__label {
  fill: var(--bcv-muted, #657168); font-size: 12px; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-panel__num {
  fill: var(--bcv-ink, #1f2a24); font-size: 24px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-panel__num.is-fresh { fill: var(--bcv-gold, #c2872f); }
.bcv-panel__num.is-final { fill: var(--bcv-ok, #3f6b57); }
.bcv-panel__op {
  fill: var(--bcv-dim, #9aa39c); font-size: 16px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-panel__formula {
  fill: var(--bcv-hot, #a45f45); font-size: 12.5px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.bcv-cell__box {
  fill: var(--bcv-fill, #ffffff); stroke: var(--bcv-line, #c3c9c2); stroke-width: 1.5;
}
.bcv-cell__val {
  fill: var(--bcv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-cell.is-top .bcv-cell__box { stroke: var(--bcv-ok, #3f6b57); stroke-width: 3; }
.bcv-cell.is-fresh .bcv-cell__box {
  fill: var(--bcv-gold-fill, #fdf3e3); stroke: var(--bcv-gold, #c2872f); stroke-width: 3;
}
.bcv-cell.is-fresh .bcv-cell__val { fill: var(--bcv-gold, #c2872f); }
.bcv-cell.is-ghost .bcv-cell__box {
  fill: none; stroke: var(--bcv-hot, #a45f45); stroke-dasharray: 4 3; stroke-width: 2.5;
}
.bcv-cell.is-ghost .bcv-cell__val { fill: var(--bcv-hot, #a45f45); }

.bcv-label {
  fill: var(--bcv-muted, #657168); font-size: 12.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.bcv-floor { stroke: var(--bcv-line, #c3c9c2); stroke-width: 2; }
.bcv-phase__text {
  fill: var(--bcv-muted, #657168); font-size: 13px; font-weight: 600;
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

const sgn = (v) => (v > 0 ? '+1' : '-1')

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{ expr?: string, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountBasicCalc(host, options = {}) {
  if (!host || host.dataset.basiccalcMounted === '1') return { destroy() {} }
  host.dataset.basiccalcMounted = '1'
  ensureStyles()

  const steps = buildBasicCalcSteps(options)
  const autoplay = options.autoplay !== false
  const tokens = steps[0].tokens

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz bcv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg bcv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '基本计算器 LC224 推演动画',
  })
  stage.appendChild(svgRoot)

  const tokLayer = mk('g', {})
  const stackLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.appendChild(tokLayer)
  svgRoot.appendChild(stackLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'bcv-note', x: 26, y: NOTE_Y })
  note.textContent = '栈存的不是数字，是「外层欠账」：括号前的累计值 + 括号的符号'
  markLayer.appendChild(note)

  // token 条
  const totalW = tokens.length * (TOK_W + TOK_GAP) - TOK_GAP
  const tokX0 = Math.max(26, (width - totalW) / 2)
  const tokEls = tokens.map((t, idx) => {
    const x = tokX0 + idx * (TOK_W + TOK_GAP)
    const g = mk('g', { class: 'bcv-tok' })
    g.appendChild(mk('rect', { class: 'bcv-tok__box', x, y: TOK_Y, width: TOK_W, height: TOK_H, rx: 6 }))
    const val = mk('text', { class: 'bcv-tok__val', x: x + TOK_W / 2, y: TOK_Y + TOK_H / 2 })
    val.textContent = t
    g.appendChild(val)
    tokLayer.appendChild(g)
    return { g, x }
  })
  const pointer = mk('path', { class: 'bcv-pointer', d: '' })
  markLayer.appendChild(pointer)

  // 累加器面板
  markLayer.appendChild(mk('rect', { class: 'bcv-panel__box', x: 26, y: PANEL_TOP, width: width - 52, height: PANEL_H, rx: 9 }))
  const signLabel = mk('text', { class: 'bcv-panel__label', x: 130, y: PANEL_TOP + 16 })
  signLabel.textContent = 'sign（下一个数字的符号）'
  const signNum = mk('text', { class: 'bcv-panel__num', x: 130, y: PANEL_TOP + 40 })
  const eq = mk('text', { class: 'bcv-panel__op', x: 232, y: PANEL_TOP + 40 })
  eq.textContent = 'result ='
  const resNum = mk('text', { class: 'bcv-panel__num', x: 320, y: PANEL_TOP + 40 })
  const formula = mk('text', { class: 'bcv-panel__formula', x: width / 2 + 110, y: PANEL_TOP + 40 })
  markLayer.append(signLabel, signNum, eq, resNum, formula)

  // 上下文栈
  const STACK_CX = width / 2
  const maxDepth = Math.max(1, ...steps.map((f) => f.stack.length))
  markLayer.appendChild(mk('line', { class: 'bcv-floor', x1: STACK_CX - CELL_W / 2 - 10, y1: BASE_Y, x2: STACK_CX + CELL_W / 2 + 10, y2: BASE_Y }))
  const stackLabel = mk('text', { class: 'bcv-label', x: STACK_CX, y: LABEL_Y })
  stackLabel.textContent = '括号上下文栈 {外层result, 括号sign}'
  markLayer.appendChild(stackLabel)

  const stackEls = []
  for (let t = 0; t <= maxDepth; t += 1) {
    const g = mk('g', { class: 'bcv-cell' })
    const y = BASE_Y - (t + 1) * (CELL_H + 6)
    g.appendChild(mk('rect', { class: 'bcv-cell__box', x: STACK_CX - CELL_W / 2, y, width: CELL_W, height: CELL_H, rx: 6 }))
    const val = mk('text', { class: 'bcv-cell__val', x: STACK_CX, y: y + CELL_H / 2 })
    g.appendChild(val)
    stackLayer.appendChild(g)
    stackEls.push({ g, val })
  }

  const phaseText = mk('text', { class: 'bcv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    // token 条
    tokEls.forEach((el, idx) => {
      const cls = ['bcv-tok']
      if (step.pos === null) {
        if (step.done) cls.push('is-past')
      } else if (idx < step.pos) cls.push('is-past')
      else if (idx === step.pos) cls.push('is-now')
      el.g.setAttribute('class', cls.join(' '))
    })
    if (step.pos !== null) {
      const el = tokEls[step.pos]
      const cx = el.x + TOK_W / 2
      pointer.setAttribute('d', `M ${cx} ${POINTER_Y - 6} L ${cx - 6} ${POINTER_Y + 3} L ${cx + 6} ${POINTER_Y + 3} Z`)
      pointer.style.opacity = '1'
    } else {
      pointer.style.opacity = '0'
    }

    // 累加器
    signNum.textContent = sgn(step.sign)
    resNum.textContent = String(step.result)
    const isNum = step.phase === 'number'
    const isClose = step.phase === 'close'
    const isSign = step.phase === 'sign'
    resNum.setAttribute('class', 'bcv-panel__num' + (step.done ? ' is-final' : isNum || isClose ? ' is-fresh' : ''))
    signNum.setAttribute('class', 'bcv-panel__num' + (isSign ? ' is-fresh' : ''))
    if (isNum) formula.textContent = `${step.prev} + ${sgn(step.sign)} * ${step.value} = ${step.result}`
    else if (isClose) formula.textContent = `${step.popped.result} + ${sgn(step.popped.sign)} * (${step.inner}) = ${step.result}`
    else formula.textContent = ''

    // 上下文栈
    const st = step.stack
    const topIdx = st.length - 1
    const isOpen = step.phase === 'open'
    stackEls.forEach((el, t) => {
      const cls = ['bcv-cell']
      if (t < st.length) {
        el.val.textContent = `result=${st[t].result}  sign=${sgn(st[t].sign)}`
        if (t === topIdx) cls.push('is-top')
        if (isOpen && t === topIdx) cls.push('is-fresh')
      } else if (isClose && t === st.length) {
        el.val.textContent = `result=${step.popped.result}  sign=${sgn(step.popped.sign)}  弹出合并`
        cls.push('is-ghost')
      } else {
        el.val.textContent = ''
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    // 底部状态行
    if (step.phase === 'init') phaseText.textContent = '加减同级左结合：数字来一个结一个，不需要运算符栈'
    else if (isNum) phaseText.textContent = '数字没有资格等待 —— 符号已定，立刻结算'
    else if (isSign) phaseText.textContent = '运算符只登记符号，不动累计值'
    else if (isOpen) phaseText.textContent = '压栈「外层欠账」，进括号重启累加器'
    else if (isClose) phaseText.textContent = '括号塌缩成一个数，乘上括号外的符号并回外层'
    else phaseText.textContent = '时间 O(n)，空间 O(括号嵌套深度)'

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
      delete host.dataset.basiccalcMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
