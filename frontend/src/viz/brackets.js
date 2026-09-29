/**
 * brackets.js — 「有效的括号」(LC 20) 栈解法的 SVG 渲染层。
 *
 * 上行字符串格子（当前字符橙环）+ 下行栈格（左→右生长，最右是栈顶）+ 刚弹出的
 * 格子画在栈顶右侧（绿、带弹出标记）。失败帧红边，done valid 全绿。
 *
 * 通用坑：A / K / W / X / 红线 4。
 */

import { buildBracketsSteps } from './bracketsSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'brk-styles'

const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const STR_IDX_Y = 158
const STR_Y = 170
const CELL_H = 46

const STACK_LABEL_Y = 244
const STACK_Y = 256
const TOP_MARK_Y = 316
const POP_Y = 256

const PHASE_Y = 342

const LABEL_X = 26
const AVAIL = 604
const PLAY_MS = 1150

const STYLES = `
.brk {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.brk__svg { width: 100%; height: auto; display: block; }

.brk-note {
  fill: var(--brk-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.brk-banner__box {
  fill: var(--brk-banner, #f4f3ef);
  stroke: var(--brk-line, #c3c9c2);
  stroke-width: 1.5;
}
.brk-banner__seg {
  fill: var(--brk-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-banner__ans {
  fill: var(--brk-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-banner__ans.is-bad { fill: var(--brk-bad, #b3452e); }

.brk-cell__box {
  fill: var(--brk-fill, #ffffff);
  stroke: var(--brk-line, #c3c9c2);
  stroke-width: 1.5;
}
.brk-cell__val {
  fill: var(--brk-ink, #1f2a24);
  font-size: 18px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-cell__idx {
  fill: var(--brk-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：栈内 */
.brk-cell.is-instack .brk-cell__box { fill: var(--brk-gold-fill, #fdf3e3); }
/* 通道二（边框）：当前字符 / 成功 / 失败 */
.brk-cell.is-cur .brk-cell__box {
  stroke: var(--brk-hot, #a45f45);
  stroke-width: 3;
}
.brk-cell.is-cur .brk-cell__val { fill: var(--brk-hot, #a45f45); }
.brk-cell.is-ok .brk-cell__box {
  fill: var(--brk-ok-fill, #eef5f1);
  stroke: var(--brk-ok, #3f6b57);
  stroke-width: 2.5;
}
.brk-cell.is-ok .brk-cell__val { fill: var(--brk-ok, #3f6b57); }
.brk-cell.is-bad .brk-cell__box {
  fill: var(--brk-bad-fill, #fbe9e5);
  stroke: var(--brk-bad, #b3452e);
  stroke-width: 2.5;
}
.brk-cell.is-bad .brk-cell__val { fill: var(--brk-bad, #b3452e); }
.brk-cell.is-dim .brk-cell__box {
  stroke: var(--brk-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.brk-cell.is-dim .brk-cell__val { fill: var(--brk-dim, #9aa39c); }

.brk-label {
  fill: var(--brk-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-topmark {
  fill: var(--brk-hot, #a45f45);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.brk-popmark {
  fill: var(--brk-ok, #3f6b57);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.brk-phase__text {
  fill: var(--brk-muted, #657168);
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
export function mountBrackets(host, options = {}) {
  if (!host || host.dataset.brkMounted === '1') return { destroy() {} }
  host.dataset.brkMounted = '1'
  ensureStyles()

  const steps = buildBracketsSteps(options)
  const autoplay = options.autoplay !== false
  const s0 = steps[0]
  const chars = s0.chars
  const n = s0.n

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz brk'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  let cellW = 48
  const need = n * cellW + (n - 1) * 8
  if (need > AVAIL) cellW = Math.max(24, Math.floor((AVAIL - (n - 1) * 8) / n))
  const gap = 8
  const rowW = n * cellW + (n - 1) * gap
  // 栈行最多 n 格 + 弹出的 1 格，宽度按 n+1 预留
  const stackReserve = (n + 1) * cellW + n * gap
  const width = Math.max(660, LABEL_X * 2 + Math.max(rowW, stackReserve))
  const LEFT = (width - rowW) / 2
  const SLEFT = (width - stackReserve) / 2 + cellW / 2
  const cx = (i) => LEFT + i * (cellW + gap) + cellW / 2
  const sx = (i) => SLEFT + i * (cellW + gap)
  const BANNER_W = width - LABEL_X * 2
  const height = PHASE_Y + 24

  const svgRoot = mk('svg', {
    class: 'viz__svg brk__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '有效的括号 栈推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', { class: 'brk-cells' })
  const markLayer = mk('g', { class: 'brk-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'brk-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = '括号天然是栈：最近打开的必须先关闭 —— 左括号入栈，右括号问栈顶'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'brk-banner__box', x: LABEL_X, y: BANNER_TOP, width: BANNER_W, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'brk-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'brk-banner__seg', x: LABEL_X + 130, y: BANNER_TOP + BANNER_H / 2 })
  const ansVal = mk('text', { class: 'brk-banner__ans', x: width - LABEL_X - 18, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(ansVal)

  // 字符串行
  const strEls = []
  for (let i = 0; i < n; i += 1) {
    const g = mk('g', { class: 'brk-cell' })
    const box = mk('rect', { class: 'brk-cell__box', x: cx(i) - cellW / 2, y: STR_Y, width: cellW, height: CELL_H, rx: 6 })
    g.appendChild(box)
    const val = mk('text', { class: 'brk-cell__val', x: cx(i), y: STR_Y + CELL_H / 2 })
    val.textContent = chars[i]
    g.appendChild(val)
    const idx = mk('text', { class: 'brk-cell__idx', x: cx(i), y: STR_IDX_Y })
    idx.textContent = String(i)
    markLayer.appendChild(idx)
    cellLayer.appendChild(g)
    strEls.push({ g, box, val })
  }

  // 栈行（最多 n 格 + 弹出位）
  const stackLabel = mk('text', { class: 'brk-label', x: SLEFT - 14, y: STACK_Y + CELL_H / 2 })
  stackLabel.textContent = 'stack'
  markLayer.appendChild(stackLabel)

  const stackEls = []
  for (let i = 0; i < n; i += 1) {
    const g = mk('g', { class: 'brk-cell' })
    const box = mk('rect', { class: 'brk-cell__box', x: sx(i) - cellW / 2, y: STACK_Y, width: cellW, height: CELL_H, rx: 6 })
    g.appendChild(box)
    const val = mk('text', { class: 'brk-cell__val', x: sx(i), y: STACK_Y + CELL_H / 2 })
    g.appendChild(val)
    cellLayer.appendChild(g)
    stackEls.push({ g, box, val })
  }
  const popEl = (() => {
    const g = mk('g', { class: 'brk-cell' })
    const box = mk('rect', { class: 'brk-cell__box', x: sx(n) - cellW / 2, y: POP_Y, width: cellW, height: CELL_H, rx: 6 })
    g.appendChild(box)
    const val = mk('text', { class: 'brk-cell__val', x: sx(n), y: POP_Y + CELL_H / 2 })
    g.appendChild(val)
    cellLayer.appendChild(g)
    return { g, box, val }
  })()
  const popMark = mk('text', { class: 'brk-popmark', x: sx(n), y: POP_Y - 12 })
  popMark.textContent = 'popped'
  markLayer.appendChild(popMark)

  const topMark = mk('text', { class: 'brk-topmark', x: 0, y: TOP_MARK_Y })
  topMark.textContent = 'top'
  markLayer.appendChild(topMark)

  const phaseText = mk('text', { class: 'brk-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const isDone = step.phase === 'done'
    const v = step.verdict
    const fail = v === 'mismatch' || v === 'unmatched' || v === 'leftover'

    // 字符串行
    strEls.forEach((el, i) => {
      const cls = ['brk-cell']
      if (step.i !== null && i === step.i && step.phase !== 'done') {
        if (step.phase === 'match') cls.push('is-ok')
        else if (step.phase === 'mismatch' || step.phase === 'unmatched') cls.push('is-bad')
        else cls.push('is-cur')
      } else if (isDone && v === 'valid') {
        cls.push('is-ok')
      } else if (step.i !== null && i > step.i) {
        cls.push('is-dim')
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    // 栈行
    stackEls.forEach((el, i) => {
      const cls = ['brk-cell']
      if (i < step.stack.length) {
        cls.push('is-instack')
        el.val.textContent = step.stack[i]
        if (i === step.stack.length - 1) {
          if (step.phase === 'mismatch') cls.push('is-bad')
          else if (isDone && v === 'leftover') cls.push('is-bad')
          else if (isDone && v === 'valid') cls.push('is-ok')
        }
      } else {
        cls.push('is-dim')
        el.val.textContent = ''
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    // 刚弹出的格子（紧贴栈顶右侧）
    const showPop = step.phase === 'match' && step.popped !== null
    if (showPop) {
      const px = sx(step.stack.length)
      popEl.box.setAttribute('x', px - cellW / 2)
      popEl.val.setAttribute('x', px)
      popMark.setAttribute('x', px)
      popEl.val.textContent = step.popped
      popEl.g.setAttribute('class', 'brk-cell is-ok')
      popMark.style.opacity = '1'
    } else {
      popEl.val.textContent = ''
      popEl.g.setAttribute('class', 'brk-cell is-dim')
      popMark.style.opacity = '0'
    }

    // top 标记
    if (step.stack.length > 0) {
      topMark.setAttribute('x', sx(step.stack.length - 1))
      topMark.style.opacity = '1'
    } else {
      topMark.style.opacity = '0'
    }

    // 横幅
    if (step.phase === 'push') {
      segRound.textContent = `s[${step.i}] = "${step.ch}"`
      segAct.textContent = '左括号 → push（记下我在等什么）'
    } else if (step.phase === 'match') {
      segRound.textContent = `s[${step.i}] = "${step.ch}"`
      segAct.textContent = `栈顶 "${step.popped}" 配对成功 → pop`
    } else if (step.phase === 'mismatch') {
      segRound.textContent = `s[${step.i}] = "${step.ch}"`
      segAct.textContent = `栈顶 "${step.stack[step.stack.length - 1]}" 在等 "${step.expect}" —— 不匹配`
    } else if (step.phase === 'unmatched') {
      segRound.textContent = `s[${step.i}] = "${step.ch}"`
      segAct.textContent = '栈是空的，没人接这个右括号'
    } else if (step.phase === 'init') {
      segRound.textContent = '栈解法'
      segAct.textContent = '左括号入栈 · 右括号问栈顶'
    } else {
      segRound.textContent = `${step.n} 个字符扫完`
      segAct.textContent = v === 'valid' ? '栈恰好为空' : v === 'leftover' ? '栈里还留着左括号' : '提前判无效'
    }
    if (isDone) {
      ansVal.textContent = v === 'valid' ? 'true（有效）' : v === 'leftover' ? 'false（左括号未闭合）' : v === 'mismatch' ? 'false（类型不匹配）' : 'false（右括号无人接）'
      ansVal.setAttribute('class', 'brk-banner__ans' + (v === 'valid' ? '' : ' is-bad'))
    } else {
      ansVal.textContent = `stack: ${step.stack.length} 层`
      ansVal.setAttribute('class', 'brk-banner__ans')
    }

    // 底部状态行
    if (isDone) {
      phaseText.textContent =
        step.stack.length > 0
          ? `剩余未闭合：${step.stack.map((c) => `"${c}"`).join(' ')} —— 栈非空即无效`
          : '三种失败模式都没触发 + 栈为空 = 有效'
    } else if (step.phase === 'match') {
      phaseText.textContent = `配对 "${step.popped}" + "${step.ch}" 出栈 · 栈深 ${step.stack.length}`
    } else if (step.phase === 'push') {
      phaseText.textContent = `入栈 "${step.ch}" · 栈顶 = 最内层尚未闭合的那个`
    } else {
      phaseText.textContent = '后开先闭 = LIFO —— 括号的结构本身就是栈'
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
      delete host.dataset.brkMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
