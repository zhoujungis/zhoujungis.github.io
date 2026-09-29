/**
 * queueViaStacks.js — 「用栈实现队列」(LC 232) 双栈解法的 SVG 渲染层。
 *
 * 两列竖直栈并排：左 = in 栈（push 进这里），右 = out 栈（pop/peek 从这里取）。
 * 搬运帧：in 顶弹出一个幽灵格，out 顶金格接收，中间画箭头 —— "两次反转 = 正序"。
 * 底部一行是出队序列（队列的"正面"）。
 *
 * 通用坑：A / K / V / W / 红线 4。
 */

import { buildQueueViaStacksSteps } from './queueViaStacksSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'qstacks-styles'

const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const BASE_Y = 322
const CELL_H = 44
const CELL_W = 78
const CELL_GAP = 6

const LABEL_Y = BASE_Y + 24
const Q_Y = 372
const Q_H = 40
const PHASE_Y = 440

const PLAY_MS = 1050

const STYLES = `
.qsv {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.qsv__svg { width: 100%; height: auto; display: block; }

.qsv-note {
  fill: var(--qsv-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qsv-banner__box {
  fill: var(--qsv-banner, #f4f3ef);
  stroke: var(--qsv-line, #c3c9c2);
  stroke-width: 1.5;
}
.qsv-banner__op {
  fill: var(--qsv-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qsv-banner__ret {
  fill: var(--qsv-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qsv-cell__box {
  fill: var(--qsv-fill, #ffffff);
  stroke: var(--qsv-line, #c3c9c2);
  stroke-width: 1.5;
}
.qsv-cell__val {
  fill: var(--qsv-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qsv-cell__sub {
  fill: var(--qsv-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qsv-cell.is-top .qsv-cell__box {
  stroke: var(--qsv-ok, #3f6b57);
  stroke-width: 3;
}
.qsv-cell.is-top .qsv-cell__val { fill: var(--qsv-ok, #3f6b57); }
.qsv-cell.is-fresh .qsv-cell__box {
  fill: var(--qsv-gold-fill, #fdf3e3);
  stroke: var(--qsv-gold, #c2872f);
  stroke-width: 3;
}
.qsv-cell.is-fresh .qsv-cell__val { fill: var(--qsv-gold, #c2872f); }
.qsv-cell.is-ghost .qsv-cell__box {
  fill: none;
  stroke: var(--qsv-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 2.5;
}
.qsv-cell.is-ghost .qsv-cell__val { fill: var(--qsv-hot, #a45f45); }
.qsv-cell.is-ghost .qsv-cell__sub { fill: var(--qsv-hot, #a45f45); }
.qsv-cell.is-empty .qsv-cell__box {
  fill: none;
  stroke: var(--qsv-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.qsv-cell.is-outq .qsv-cell__box {
  fill: var(--qsv-ok-fill, #eef5f1);
  stroke: var(--qsv-ok, #3f6b57);
  stroke-width: 2;
}
.qsv-cell.is-outq .qsv-cell__val { fill: var(--qsv-ok, #3f6b57); }
.qsv-cell.is-freshq .qsv-cell__box {
  fill: var(--qsv-gold-fill, #fdf3e3);
  stroke: var(--qsv-gold, #c2872f);
  stroke-width: 3;
}
.qsv-cell.is-freshq .qsv-cell__val { fill: var(--qsv-gold, #c2872f); }

.qsv-label {
  fill: var(--qsv-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qsv-floor {
  stroke: var(--qsv-line, #c3c9c2);
  stroke-width: 2;
}
.qsv-arrow {
  stroke: var(--qsv-hot, #a45f45);
  stroke-width: 2;
  fill: none;
}
.qsv-arrow__head { fill: var(--qsv-hot, #a45f45); stroke: none; }
.qsv-arrow__text {
  fill: var(--qsv-hot, #a45f45);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qsv-phase__text {
  fill: var(--qsv-muted, #657168);
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
export function mountQueueViaStacks(host, options = {}) {
  if (!host || host.dataset.qstacksMounted === '1') return { destroy() {} }
  host.dataset.qstacksMounted = '1'
  ensureStyles()

  const steps = buildQueueViaStacksSteps(options)
  const autoplay = options.autoplay !== false
  const s0 = steps[0]
  const ops = s0.ops

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz qsv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const maxIn = Math.max(1, ...steps.map((f) => f.inn.length))
  const maxOut = Math.max(1, ...steps.map((f) => f.out.length))
  const totalPop = Math.max(1, s0.queueOut.length, ...steps.map((f) => f.queueOut.length))

  const width = 660
  const IN_CX = width / 2 - 120
  const OUT_CX = width / 2 + 120
  const height = PHASE_Y + 24

  const svgRoot = mk('svg', {
    class: 'viz__svg qsv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '用栈实现队列 双栈推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', { class: 'qsv-cells' })
  const markLayer = mk('g', { class: 'qsv-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'qsv-note', x: 26, y: NOTE_Y })
  note.textContent = '两次反转 = 正序：进 in 倒一次，整摞翻进 out 再倒一次 —— out 顶就是队首'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'qsv-banner__box', x: 26, y: BANNER_TOP, width: width - 52, height: BANNER_H, rx: 9 }),
  )
  const bannerOp = mk('text', { class: 'qsv-banner__op', x: 44, y: BANNER_TOP + BANNER_H / 2 })
  const bannerRet = mk('text', { class: 'qsv-banner__ret', x: width - 44, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(bannerOp)
  markLayer.appendChild(bannerRet)

  markLayer.appendChild(mk('line', { class: 'qsv-floor', x1: IN_CX - CELL_W / 2 - 10, y1: BASE_Y, x2: IN_CX + CELL_W / 2 + 10, y2: BASE_Y }))
  markLayer.appendChild(mk('line', { class: 'qsv-floor', x1: OUT_CX - CELL_W / 2 - 10, y1: BASE_Y, x2: OUT_CX + CELL_W / 2 + 10, y2: BASE_Y }))
  const inLabel = mk('text', { class: 'qsv-label', x: IN_CX, y: LABEL_Y })
  inLabel.textContent = 'in 栈（进队）'
  const outLabel = mk('text', { class: 'qsv-label', x: OUT_CX, y: LABEL_Y })
  outLabel.textContent = 'out 栈（出队）'
  markLayer.appendChild(inLabel)
  markLayer.appendChild(outLabel)

  const buildColumn = (cx, n) => {
    const els = []
    for (let t = 0; t <= n; t += 1) {
      const g = mk('g', { class: 'qsv-cell' })
      const y = BASE_Y - (t + 1) * (CELL_H + CELL_GAP)
      const box = mk('rect', { class: 'qsv-cell__box', x: cx - CELL_W / 2, y, width: CELL_W, height: CELL_H, rx: 6 })
      g.appendChild(box)
      const val = mk('text', { class: 'qsv-cell__val', x: cx, y: y + CELL_H / 2 - 5 })
      g.appendChild(val)
      const sub = mk('text', { class: 'qsv-cell__sub', x: cx, y: y + CELL_H - 9 })
      g.appendChild(sub)
      cellLayer.appendChild(g)
      els.push({ g, val, sub })
    }
    return els
  }
  const inEls = buildColumn(IN_CX, maxIn)
  const outEls = buildColumn(OUT_CX, maxOut)

  // 搬运箭头
  const arrowG = mk('g', { class: 'qsv-transfer' })
  const arrowLine = mk('line', { class: 'qsv-arrow', x1: 0, y1: 0, x2: 0, y2: 0 })
  const arrowHead = mk('path', { class: 'qsv-arrow__head', d: '' })
  const arrowText = mk('text', { class: 'qsv-arrow__text', x: width / 2, y: 0 })
  arrowG.appendChild(arrowLine)
  arrowG.appendChild(arrowHead)
  arrowG.appendChild(arrowText)
  markLayer.appendChild(arrowG)

  // 出队序列行
  const qLabel = mk('text', { class: 'qsv-label', x: 40, y: Q_Y + Q_H / 2 })
  qLabel.textContent = '出队'
  markLayer.appendChild(qLabel)
  const qEls = []
  const QW = 54
  const qLeft = width / 2 - (totalPop * QW + (totalPop - 1) * 6) / 2
  for (let t = 0; t < totalPop; t += 1) {
    const g = mk('g', { class: 'qsv-cell' })
    const x = qLeft + t * (QW + 6)
    const box = mk('rect', { class: 'qsv-cell__box', x, y: Q_Y, width: QW, height: Q_H, rx: 6 })
    g.appendChild(box)
    const val = mk('text', { class: 'qsv-cell__val', x: x + QW / 2, y: Q_Y + Q_H / 2 })
    g.appendChild(val)
    cellLayer.appendChild(g)
    qEls.push({ g, val })
  }

  const phaseText = mk('text', { class: 'qsv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paintColumn(els, values, topIdx, freshIdx, ghostIdx, ghostLabel) {
    els.forEach((el, t) => {
      const cls = ['qsv-cell']
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
        cls.push('is-empty')
      }
      el.g.setAttribute('class', cls.join(' '))
    })
  }

  function paint(_index, step) {
    if (!step) return
    const inn = step.inn
    const out = step.out
    const isTransfer = step.phase === 'transfer'
    const isMoved = isTransfer && step.moved !== null
    const isTrigger = isTransfer && step.moved === null
    const isPop = step.phase === 'pop'
    const isPeek = step.phase === 'peek'

    // in 栈：搬运帧里 moved 画成 in 顶上方的幽灵
    paintColumn(
      inEls,
      inn,
      inn.length - 1,
      step.phase === 'push' ? inn.length - 1 : -1,
      isMoved ? inn.length : -1,
      isMoved ? String(step.moved) : '',
    )
    // out 栈：搬运接收格 = 金框；pop/peek 结果帧顶格绿框
    paintColumn(
      outEls,
      out,
      out.length - 1,
      isMoved ? out.length - 1 : -1,
      -1,
      '',
    )

    // 箭头
    if (isTransfer) {
      const ay = isMoved
        ? BASE_Y - (out.length) * (CELL_H + CELL_GAP) + CELL_H / 2
        : BASE_Y - (inn.length + 1) * (CELL_H + CELL_GAP) + CELL_H / 2
      arrowLine.setAttribute('x1', IN_CX + CELL_W / 2 + 6)
      arrowLine.setAttribute('y1', ay)
      arrowLine.setAttribute('x2', OUT_CX - CELL_W / 2 - 10)
      arrowLine.setAttribute('y2', ay)
      arrowHead.setAttribute('d', `M ${OUT_CX - CELL_W / 2 - 4} ${ay} L ${OUT_CX - CELL_W / 2 - 13} ${ay - 5} L ${OUT_CX - CELL_W / 2 - 13} ${ay + 5} Z`)
      arrowText.setAttribute('y', ay - 12)
      arrowText.textContent = isMoved ? 'in 顶 → out 顶' : '整摞翻！'
      arrowG.style.opacity = '1'
    } else {
      arrowG.style.opacity = '0'
    }

    // 出队序列
    const q = step.queueOut
    qEls.forEach((el, t) => {
      const cls = ['qsv-cell']
      if (t < q.length) {
        el.val.textContent = String(q[t])
        cls.push(isPop && step.result !== null && t === q.length - 1 ? 'is-freshq' : 'is-outq')
      } else {
        el.val.textContent = ''
        cls.push('is-empty')
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    // 横幅
    const op = step.opIdx !== null ? ops[step.opIdx] : null
    if (step.phase === 'init') {
      bannerOp.textContent = '双栈队列：栈 LIFO 翻两次 = FIFO'
      bannerRet.textContent = ''
    } else if (step.phase === 'done') {
      bannerOp.textContent = `${ops.length} 个操作完成 · 共搬运 ${step.transfers} 次`
      bannerRet.textContent = `[${step.queueOut.join(',')}]`
    } else if (op) {
      bannerOp.textContent = op.op === 'push' ? `push(${op.val})` : `${op.op}()`
      if (isTrigger) bannerRet.textContent = 'out 空 → 触发搬运'
      else if (isMoved) bannerRet.textContent = `翻 ${step.moved}`
      else if (isPop || isPeek) bannerRet.textContent = `→ ${step.result}`
      else bannerRet.textContent = ''
    }

    // 底部状态行
    if (step.phase === 'push') {
      phaseText.textContent =
        step.out.length > 0
          ? 'push 只进 in —— out 还有存货，绝不搬运（旧元素没消费完）'
          : 'push 只进 in，O(1) —— out 空，新元素排在队尾'
    } else if (isTrigger) {
      phaseText.textContent = 'out 空了才搬运 —— 且必须整摞翻，搬一半的顺序是坏的'
    } else if (isMoved) {
      phaseText.textContent = 'in 顶弹出、压入 out 顶 —— 每个元素一生最多搬这一次'
    } else if (isPop || isPeek) {
      phaseText.textContent = isPeek
        ? 'peek 只读 out 顶不弹出 —— 队首就是 out 顶'
        : 'pop 只动 out —— 旧的一摞没消费完，新的一摞绝不插队'
    } else if (step.phase === 'init') {
      phaseText.textContent = '进 in 倒一次，翻进 out 再倒一次 —— 方向转正'
    } else {
      phaseText.textContent = '出队序列 = 入队序列 —— FIFO 成立；n 次操作 O(n)，均摊 O(1)'
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
      delete host.dataset.qstacksMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
