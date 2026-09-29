/**
 * calcIII.js — 「基本计算器 III」(LC 772) 双栈调度场的 SVG 渲染层。
 *
 * 布局：顶部 = token 条（当前高亮）；其下 = 结算横幅（本帧依次弹出的算式）；
 * 主体 = 左 nums 数值栈 / 右 ops 运算符栈（含 '(' 挡板），竖直向上生长。
 * 新压入画金格，被结算/弹掉画虚线幽灵，栈顶绿框。
 *
 * 通用坑：A / K / V / W / 红线 4。
 */

import { buildCalcIIISteps } from './calcIIISteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'calciii-styles'

const NOTE_Y = 40
const TOK_Y = 58
const TOK_H = 28
const TOK_W = 29
const TOK_GAP = 2
const POINTER_Y = TOK_Y + TOK_H + 11

const BAN_TOP = 116
const BAN_H = 38

const BASE_Y = 352
const CELL_H = 38
const CELL_W = 128
const CELL_GAP = 5
const LABEL_Y = BASE_Y + 24
const PHASE_Y = 398

const PLAY_MS = 1150

const STYLES = `
.c3v { display: flex; flex-direction: column; gap: 14px; }
.c3v__svg { width: 100%; height: auto; display: block; }

.c3v-note {
  fill: var(--c3v-muted, #657168); font-size: 12.5px; text-anchor: start;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-tok__box {
  fill: var(--c3v-fill, #ffffff); stroke: var(--c3v-line, #c3c9c2); stroke-width: 1.5;
}
.c3v-tok__val {
  fill: var(--c3v-ink, #1f2a24); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-tok.is-past .c3v-tok__box { fill: var(--c3v-past, #eef0ec); stroke: var(--c3v-past-line, #d8ddd6); }
.c3v-tok.is-past .c3v-tok__val { fill: var(--c3v-dim, #9aa39c); }
.c3v-tok.is-now .c3v-tok__box {
  fill: var(--c3v-gold-fill, #fdf3e3); stroke: var(--c3v-gold, #c2872f); stroke-width: 3;
}
.c3v-tok.is-now .c3v-tok__val { fill: var(--c3v-gold, #c2872f); }
.c3v-pointer { fill: var(--c3v-gold, #c2872f); }

.c3v-ban__box {
  fill: var(--c3v-banner, #f4f3ef); stroke: var(--c3v-line, #c3c9c2); stroke-width: 1.5;
}
.c3v-ban__text {
  fill: var(--c3v-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.c3v-cell__box {
  fill: var(--c3v-fill, #ffffff); stroke: var(--c3v-line, #c3c9c2); stroke-width: 1.5;
}
.c3v-cell__val {
  fill: var(--c3v-ink, #1f2a24); font-size: 15px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-cell__sub {
  fill: var(--c3v-dim, #9aa39c); font-size: 9.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-cell.is-top .c3v-cell__box { stroke: var(--c3v-ok, #3f6b57); stroke-width: 3; }
.c3v-cell.is-top .c3v-cell__val { fill: var(--c3v-ok, #3f6b57); }
.c3v-cell.is-fresh .c3v-cell__box {
  fill: var(--c3v-gold-fill, #fdf3e3); stroke: var(--c3v-gold, #c2872f); stroke-width: 3;
}
.c3v-cell.is-fresh .c3v-cell__val { fill: var(--c3v-gold, #c2872f); }
.c3v-cell.is-ghost .c3v-cell__box {
  fill: none; stroke: var(--c3v-hot, #a45f45); stroke-dasharray: 4 3; stroke-width: 2.5;
}
.c3v-cell.is-ghost .c3v-cell__val { fill: var(--c3v-hot, #a45f45); }
.c3v-cell.is-ghost .c3v-cell__sub { fill: var(--c3v-hot, #a45f45); }
.c3v-cell.is-final .c3v-cell__box { stroke: var(--c3v-ok, #3f6b57); stroke-width: 3.5; }

.c3v-label {
  fill: var(--c3v-muted, #657168); font-size: 12.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.c3v-floor { stroke: var(--c3v-line, #c3c9c2); stroke-width: 2; }
.c3v-phase__text {
  fill: var(--c3v-muted, #657168); font-size: 13px; font-weight: 600;
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
 * @param {{ expr?: string, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountCalcIII(host, options = {}) {
  if (!host || host.dataset.calciiiMounted === '1') return { destroy() {} }
  host.dataset.calciiiMounted = '1'
  ensureStyles()

  const steps = buildCalcIIISteps(options)
  const autoplay = options.autoplay !== false
  const tokens = steps[0].tokens

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz c3v'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg c3v__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '基本计算器 III LC772 双栈调度场动画',
  })
  stage.appendChild(svgRoot)

  const tokLayer = mk('g', {})
  const stackLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.appendChild(tokLayer)
  svgRoot.appendChild(stackLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'c3v-note', x: 26, y: NOTE_Y })
  note.textContent = '新运算符来临：栈顶优先级 >= 它的先结账（>= 即左结合），再压自己'
  markLayer.appendChild(note)

  // token 条
  const totalW = tokens.length * (TOK_W + TOK_GAP) - TOK_GAP
  const tokX0 = Math.max(16, (width - totalW) / 2)
  const tokEls = tokens.map((t, idx) => {
    const x = tokX0 + idx * (TOK_W + TOK_GAP)
    const g = mk('g', { class: 'c3v-tok' })
    g.appendChild(mk('rect', { class: 'c3v-tok__box', x, y: TOK_Y, width: TOK_W, height: TOK_H, rx: 5 }))
    const val = mk('text', { class: 'c3v-tok__val', x: x + TOK_W / 2, y: TOK_Y + TOK_H / 2 })
    val.textContent = t
    g.appendChild(val)
    tokLayer.appendChild(g)
    return { g, x }
  })
  const pointer = mk('path', { class: 'c3v-pointer', d: '' })
  markLayer.appendChild(pointer)

  // 结算横幅
  markLayer.appendChild(mk('rect', { class: 'c3v-ban__box', x: 26, y: BAN_TOP, width: width - 52, height: BAN_H, rx: 8 }))
  const banText = mk('text', { class: 'c3v-ban__text', x: width / 2, y: BAN_TOP + BAN_H / 2 })
  markLayer.appendChild(banText)

  // 双栈
  const NUMS_CX = width / 2 - 150
  const OPS_CX = width / 2 + 150
  const maxNums = Math.max(1, ...steps.map((f) => f.nums.length))
  const maxOps = Math.max(1, ...steps.map((f) => f.ops.length))

  markLayer.appendChild(mk('line', { class: 'c3v-floor', x1: NUMS_CX - CELL_W / 2 - 8, y1: BASE_Y, x2: NUMS_CX + CELL_W / 2 + 8, y2: BASE_Y }))
  markLayer.appendChild(mk('line', { class: 'c3v-floor', x1: OPS_CX - CELL_W / 2 - 8, y1: BASE_Y, x2: OPS_CX + CELL_W / 2 + 8, y2: BASE_Y }))
  const numsLabel = mk('text', { class: 'c3v-label', x: NUMS_CX, y: LABEL_Y })
  numsLabel.textContent = 'nums 数值栈'
  const opsLabel = mk('text', { class: 'c3v-label', x: OPS_CX, y: LABEL_Y })
  opsLabel.textContent = 'ops 运算符栈（含挡板）'
  markLayer.append(numsLabel, opsLabel)

  const buildColumn = (cx, n) => {
    const els = []
    for (let t = 0; t <= n; t += 1) {
      const g = mk('g', { class: 'c3v-cell' })
      const y = BASE_Y - (t + 1) * (CELL_H + CELL_GAP)
      g.appendChild(mk('rect', { class: 'c3v-cell__box', x: cx - CELL_W / 2, y, width: CELL_W, height: CELL_H, rx: 6 }))
      const val = mk('text', { class: 'c3v-cell__val', x: cx, y: y + CELL_H / 2 - 4 })
      g.appendChild(val)
      const sub = mk('text', { class: 'c3v-cell__sub', x: cx, y: y + CELL_H - 8 })
      g.appendChild(sub)
      stackLayer.appendChild(g)
      els.push({ g, val, sub })
    }
    return els
  }
  const numsEls = buildColumn(NUMS_CX, maxNums)
  const opsEls = buildColumn(OPS_CX, maxOps)

  const phaseText = mk('text', { class: 'c3v-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paintColumn(els, values, freshIdx, ghostIdx, ghostLabel, finalIdx) {
    const topIdx = values.length - 1
    els.forEach((el, t) => {
      const cls = ['c3v-cell']
      if (t < values.length) {
        el.val.textContent = String(values[t])
        el.sub.textContent = t === 0 ? 'bottom' : `#${t}`
        if (t === topIdx) cls.push('is-top')
        if (t === freshIdx) cls.push('is-fresh')
        if (t === finalIdx) cls.push('is-final')
      } else if (t === ghostIdx) {
        el.val.textContent = ghostLabel
        el.sub.textContent = '结算/弹出'
        cls.push('is-ghost')
      } else {
        el.val.textContent = ''
        el.sub.textContent = ''
      }
      el.g.setAttribute('class', cls.join(' '))
    })
  }

  function paint(_index, step) {
    if (!step) return
    // token 条
    tokEls.forEach((el, idx) => {
      const cls = ['c3v-tok']
      if (step.pos === null) {
        if (step.done || step.phase === 'flush') cls.push('is-past')
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

    // 结算横幅
    if (step.applies.length > 0) {
      banText.textContent = '结算：' + step.applies.map((a) => `${a.a} ${a.op} ${a.b} = ${a.res}`).join('  →  ')
    } else if (step.phase === 'init') {
      banText.textContent = 'nums 攒操作数 · ops 靠优先级决定谁先结账'
    } else if (step.phase === 'done') {
      banText.textContent = `答案：${step.result}`
    } else {
      banText.textContent = '本帧无结算 —— 继续攒'
    }

    // 双栈
    const isNum = step.phase === 'number'
    const isOp = step.phase === 'operator'
    const hasApply = step.applies.length > 0
    const isDone = step.phase === 'done'
    // nums 顶是"本帧新值"或"最后一次结算的结果"时画金格
    const numsFresh = isNum || hasApply ? step.nums.length - 1 : -1
    paintColumn(numsEls, step.nums, numsFresh, -1, '', isDone ? 0 : -1)
    // ops：operator 帧新压入画金格；有结算/弹挡板时栈顶上方画幽灵
    const ghostLabel = step.phase === 'close' ? '(' : hasApply ? step.applies.at(-1).op : null
    paintColumn(
      opsEls,
      step.ops,
      isOp ? step.ops.length - 1 : -1,
      hasApply || step.phase === 'close' ? step.ops.length : -1,
      ghostLabel ?? '',
      -1,
    )

    // 底部状态行
    if (step.phase === 'init') phaseText.textContent = '优先级不统一 → "来一个结一个"失效 → 双栈调度场'
    else if (isNum) phaseText.textContent = '数字只进 nums：什么时候算，是运算符的事'
    else if (step.phase === 'open') phaseText.textContent = "'(' 压进 ops 当挡板 —— 后面的运算符在它面前停下"
    else if (step.phase === 'close') phaseText.textContent = "')' 结算到挡板：括号塌缩成 nums 顶上的一个数"
    else if (step.phase === 'flush') phaseText.textContent = '栈形不变量保证：从顶到底结算 === 正确运算顺序'
    else if (isOp) phaseText.textContent = hasApply ? '高优先级的先走，我排队' : '栈顶优先级更低（或被挡板挡住）→ 直接压栈等待'
    else phaseText.textContent = '时间 O(n)，空间 O(n) —— 双栈各存各的'

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
      delete host.dataset.calciiiMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
