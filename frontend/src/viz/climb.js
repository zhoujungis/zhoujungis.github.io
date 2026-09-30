/**
 * climb.js — 「爬楼梯」(LC 70) 的 SVG 渲染层，一条帧流两种画法。
 *
 *   mountClimb        —— lc70      n=10 填表：格子 + 两条「来路」弧线汇入当前格
 *   mountClimbOverflow —— lc70over  n=50 溢出条：int32 从第 46 格起装不下（红）
 *
 * 通用坑：A（CSS 变量一律带字面量兜底）/ V（互斥状态在 JS 里选好）/ X（横幅从左往右）。
 */

import { buildClimbSteps } from './climbSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'climb-styles'

const STYLES = `
.climb { display: flex; flex-direction: column; gap: 14px; }
.climb__svg { width: 100%; height: auto; display: block; }

.climb-note {
  fill: var(--climb-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climb-banner__box {
  fill: var(--climb-banner, #f4f3ef);
  stroke: var(--climb-line, #c3c9c2);
  stroke-width: 1.5;
}
.climb-banner__seg {
  fill: var(--climb-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-banner__val {
  fill: var(--climb-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-banner__val.is-bad { fill: var(--climb-bad, #b3452e); }

.climb-cell__box {
  fill: var(--climb-fill, #ffffff);
  stroke: var(--climb-line, #c3c9c2);
  stroke-width: 1.5;
}
.climb-cell__val {
  fill: var(--climb-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-cell__idx {
  fill: var(--climb-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-cell.is-ghost .climb-cell__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1.2; }
.climb-cell.is-ghost .climb-cell__val { fill: none; }
.climb-cell.is-cur .climb-cell__box { stroke: var(--climb-hot, #a45f45); stroke-width: 3; }
.climb-cell.is-fresh .climb-cell__box {
  fill: var(--climb-gold-fill, #fdf3e3);
  stroke: var(--climb-gold, #c2872f);
  stroke-width: 3;
}
.climb-cell.is-fresh .climb-cell__val { fill: var(--climb-gold, #c2872f); }
.climb-cell.is-over .climb-cell__box {
  fill: var(--climb-bad-fill, #f9ece8);
  stroke: var(--climb-bad, #b3452e);
  stroke-width: 2.5;
}
.climb-cell.is-over .climb-cell__val { fill: var(--climb-bad, #b3452e); }

.climb-arc {
  fill: none;
  stroke-width: 2.5;
  opacity: 0;
}
.climb-arc.is-on { opacity: 1; }
.climb-arc.is-one { stroke: var(--climb-ok, #3f6b57); }
.climb-arc.is-two { stroke: var(--climb-hot, #a45f45); }
.climb-arc__label {
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.climb-arc__label.is-on { opacity: 1; }
.climb-arc__label.is-one { fill: var(--climb-ok, #3f6b57); }
.climb-arc__label.is-two { fill: var(--climb-hot, #a45f45); }

.climb-sum {
  fill: var(--climb-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-sum.is-hot { fill: var(--climb-gold, #c2872f); }

.climb-limit {
  stroke: var(--climb-bad, #b3452e);
  stroke-width: 2;
  stroke-dasharray: 5 4;
}
.climb-limit__label {
  fill: var(--climb-bad, #b3452e);
  font-size: 12px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climb-readout {
  font-size: 21px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--climb-ok, #3f6b57);
}
.climb-readout.is-bad { fill: var(--climb-bad, #b3452e); }
.climb-readout-sub {
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--climb-muted, #657168);
}
.climb-readout-sub.is-bad { fill: var(--climb-bad, #b3452e); }

.climb-phase__text {
  fill: var(--climb-muted, #657168);
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

function finish(rootEl, host, descEl, steps, paint, options, datasetKey) {
  rootEl.appendChild(descEl)
  const controls = createControls()
  rootEl.appendChild(controls.root)
  host.textContent = ''
  host.appendChild(rootEl)
  ensureChromeStyles()

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const player = createPlayer({
    steps,
    controls,
    intervalMs: options.intervalMs || 880,
    onRender: (index, step) => paint(index, step),
  })
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

/* ==================================================================== */
/* 画法一：n=10 填表（两条来路弧线汇入当前格）                            */
/* ==================================================================== */

function buildFill(steps, descEl) {
  const s0 = steps[0]
  const { n } = s0
  const W = 680
  const nCells = n + 1
  let cw = 48
  if (nCells * cw + (nCells - 1) * 6 > W - 56) {
    cw = Math.max(22, Math.floor((W - 56 - (nCells - 1) * 6) / nCells))
  }
  const GAP = nCells > 12 ? 4 : 6
  const rowW = nCells * cw + (nCells - 1) * GAP
  const LEFT = (W - rowW) / 2
  const ARR_Y = 128
  const ARR_H = 56
  const arcY = ARR_Y + ARR_H
  const valFont = Math.max(9, Math.min(17, Math.round(cw / 3.4)))
  const showIdx = cw >= 34

  const BANNER_TOP = 38
  const BANNER_H = 40
  const SUM_Y = arcY + 96
  const PHASE_Y = SUM_Y + 32
  const height = PHASE_Y + 22

  const cx = (k) => LEFT + k * (cw + GAP) + cw / 2

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg climb__svg',
    viewBox: `0 0 ${W} ${height}`,
    role: 'img',
    'aria-label': '爬楼梯 动态规划填表动画',
  })
  const markLayer = mk('g', { class: 'climb-marks' })
  const cellLayer = mk('g', { class: 'climb-cells' })
  svgRoot.appendChild(markLayer)
  svgRoot.appendChild(cellLayer)

  const note = mk('text', { class: 'climb-note', x: 30, y: 22 })
  note.textContent = 'dp[i] = dp[i-1] + dp[i-2] —— 最后一步只有「迈 1 阶」「迈 2 阶」两种来路'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'climb-banner__box', x: 30, y: BANNER_TOP, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'climb-banner__seg', x: 46, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'climb-banner__seg', x: 190, y: BANNER_TOP + BANNER_H / 2 })
  const segVal = mk('text', { class: 'climb-banner__val', x: W - 46, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(segVal)

  const cells = []
  for (let k = 0; k <= n; k += 1) {
    const g = mk('g', { class: 'climb-cell' })
    g.appendChild(
      mk('rect', { class: 'climb-cell__box', x: cx(k) - cw / 2, y: ARR_Y, width: cw, height: ARR_H, rx: 6 }),
    )
    const val = mk('text', {
      class: 'climb-cell__val',
      x: cx(k),
      y: showIdx ? ARR_Y + 22 : ARR_Y + ARR_H / 2,
      style: `font-size: ${valFont}px`,
    })
    g.appendChild(val)
    if (showIdx) {
      const idx = mk('text', { class: 'climb-cell__idx', x: cx(k), y: ARR_Y + ARR_H - 11 })
      idx.textContent = `#${k}`
      g.appendChild(idx)
    }
    cellLayer.appendChild(g)
    cells.push({ g, val })
  }

  // 两条「来路」弧线（从 i-1 / i-2 汇入 i）
  const mkArc = (cls, label, depth, labelDy) => {
    const p = mk('path', { class: `climb-arc ${cls}`, d: '' })
    const t = mk('text', { class: `climb-arc__label ${cls}`, x: 0, y: 0 })
    t.textContent = label
    markLayer.appendChild(p)
    markLayer.appendChild(t)
    return {
      path: p,
      label: t,
      draw(fromIdx, toIdx) {
        const x1 = cx(fromIdx)
        const x2 = cx(toIdx)
        const y0 = arcY + 4
        p.setAttribute('d', `M ${x1} ${y0} Q ${(x1 + x2) / 2} ${y0 + depth * 2} ${x2} ${y0}`)
        t.setAttribute('x', (x1 + x2) / 2)
        t.setAttribute('y', y0 + depth + labelDy)
      },
    }
  }
  const arc1 = mkArc('is-one', '', 26, 8)
  const arc2 = mkArc('is-two', '', 62, 8)

  const sumText = mk('text', { class: 'climb-sum', x: W / 2, y: SUM_Y })
  markLayer.appendChild(sumText)

  const phaseText = mk('text', { class: 'climb-phase__text', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  function paint(_index, step) {
    if (!step) return
    const { phase, i, from, dp, n: nn } = step
    const isDone = phase === 'done'
    const isSettle = phase === 'settle'

    cells.forEach((el, k) => {
      const cls = ['climb-cell']
      const computed = phase === 'init' ? k <= Math.min(1, nn) : isDone ? true : k <= i - 1
      if (!computed) cls.push('is-ghost')
      if (isSettle && k === i) cls.push('is-fresh')
      else if ((phase === 'from1' || phase === 'from2') && k === i) cls.push('is-cur')
      else if (isDone && k === nn) cls.push('is-fresh')
      if (phase === 'from1' && k === from) cls.push('is-cur')
      if (phase === 'from2' && k === from) cls.push('is-cur')
      el.g.setAttribute('class', cls.join(' '))
      el.val.textContent = computed ? String(dp[k]) : ''
    })

    // 弧线
    const show1 = phase === 'from1' || phase === 'from2' || isSettle
    const show2 = phase === 'from2' || isSettle
    arc1.path.classList.toggle('is-on', show1)
    arc1.label.classList.toggle('is-on', show1)
    arc2.path.classList.toggle('is-on', show2)
    arc2.label.classList.toggle('is-on', show2)
    if (show1) {
      arc1.draw(i - 1, i)
      arc1.label.textContent = `迈 1 阶 · 带来 dp[${i - 1}] = ${dp[i - 1]}`
    }
    if (show2) {
      arc2.draw(i - 2, i)
      arc2.label.textContent = `迈 2 阶 · 带来 dp[${i - 2}] = ${dp[i - 2]}`
    }

    sumText.textContent =
      isSettle || isDone
        ? `两类互斥且完备 -> 相加：dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`
        : '按「最后一步的迈法」分类 —— 互斥且完备，所以是加法原理'
    sumText.classList.toggle('is-hot', isSettle || isDone)

    if (phase === 'init') {
      segRound.textContent = '起点'
      segAct.textContent = 'dp[0] = 1（不动也算一种）· dp[1] = 1'
      segVal.textContent = ''
    } else if (phase === 'from1') {
      segRound.textContent = `第 ${i} 阶`
      segAct.textContent = '来路一：从第 ' + (i - 1) + ' 阶迈 1 阶'
      segVal.textContent = `dp[${i - 1}] = ${dp[i - 1]}`
    } else if (phase === 'from2') {
      segRound.textContent = `第 ${i} 阶`
      segAct.textContent = '来路二：从第 ' + (i - 2) + ' 阶迈 2 阶'
      segVal.textContent = `dp[${i - 2}] = ${dp[i - 2]}`
    } else if (isSettle) {
      segRound.textContent = `第 ${i} 阶`
      segAct.textContent = '两类相加'
      segVal.textContent = `dp[${i}] = ${dp[i]}`
    } else {
      segRound.textContent = `${nn} 阶楼梯`
      segAct.textContent = '每一阶都只由前两阶决定'
      segVal.textContent = `答案 = ${step.answer}`
    }

    phaseText.textContent = isDone
      ? `dp[n] 就是斐波那契数 —— ways(n) = Fib(n+1)。想知道 O(log n) 的算法，用矩阵快速幂。`
      : isSettle
        ? `dp[${i}] 定型。注意 dp[i] 之前的值再也不会被用到两次以上 —— 每个格子只算一次。`
        : `「无后效性」：第 ${i} 阶之后的走法不会改变前面的计数 —— 所以可以从左往右一路填。`

    renderRichText(descEl, step.desc)
  }

  return { svgRoot, paint }
}

/* ==================================================================== */
/* 画法二：n=50 溢出条（int32 从第 46 格起装不下）                        */
/* ==================================================================== */

function buildOverflow(steps, descEl) {
  const s0 = steps[0]
  const { n, limit } = s0
  const W = 680
  const nCells = n + 1
  const GAP = 2
  const cw = Math.max(5, Math.floor((W - 72 - (nCells - 1) * GAP) / nCells))
  const rowW = nCells * cw + (nCells - 1) * GAP
  const LEFT = (W - rowW) / 2
  const STRIP_Y = 118
  const STRIP_H = 34

  const BANNER_TOP = 38
  const BANNER_H = 40
  const READOUT_Y = 208
  const SUB_Y = 240
  const PHASE_Y = 292
  const height = PHASE_Y + 22

  const cx = (k) => LEFT + k * (cw + GAP) + cw / 2

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg climb__svg',
    viewBox: `0 0 ${W} ${height}`,
    role: 'img',
    'aria-label': '爬楼梯 int32 溢出演示动画',
  })
  const markLayer = mk('g', { class: 'climb-marks' })
  const cellLayer = mk('g', { class: 'climb-cells' })
  svgRoot.appendChild(markLayer)
  svgRoot.appendChild(cellLayer)

  const note = mk('text', { class: 'climb-note', x: 30, y: 22 })
  note.textContent = '每一格是一阶楼梯的走法数 —— 颜色 = 这个数装不装得进 int32'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'climb-banner__box', x: 30, y: BANNER_TOP, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'climb-banner__seg', x: 46, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'climb-banner__seg', x: 168, y: BANNER_TOP + BANNER_H / 2 })
  const segVal = mk('text', {
    class: 'climb-banner__val',
    x: W - 46,
    y: BANNER_TOP + BANNER_H / 2,
  })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(segVal)

  const cells = []
  for (let k = 0; k <= n; k += 1) {
    const g = mk('g', { class: 'climb-cell' })
    g.appendChild(
      mk('rect', {
        class: 'climb-cell__box',
        x: cx(k) - cw / 2,
        y: STRIP_Y,
        width: cw,
        height: STRIP_H,
        rx: 2,
      }),
    )
    cellLayer.appendChild(g)
    cells.push({ g })
  }

  // int32 上限红线（画在最后一个装得下的格子与第一个爆掉的格子之间）
  // 注意：不能用 s0.dp（init 帧只填了两格），要用 done 帧的终表
  const finalDp = steps[steps.length - 1].dp
  let lastOkIdx = 0
  for (let k = 0; k <= n; k += 1) {
    if (finalDp[k] <= limit) lastOkIdx = k
  }
  const limitX = LEFT + (lastOkIdx + 1) * (cw + GAP) - GAP / 2
  markLayer.appendChild(
    mk('line', { class: 'climb-limit', x1: limitX, y1: STRIP_Y - 12, x2: limitX, y2: STRIP_Y + STRIP_H + 10 }),
  )
  const limitLabel = mk('text', { class: 'climb-limit__label', x: limitX - 8, y: STRIP_Y - 24 })
  limitLabel.textContent = `int32 上限 ${limit} —— 左边装得下，右边爆`
  markLayer.appendChild(limitLabel)

  const readout = mk('text', { class: 'climb-readout', x: W / 2, y: READOUT_Y })
  markLayer.appendChild(readout)
  const readoutSub = mk('text', { class: 'climb-readout-sub', x: W / 2, y: SUB_Y })
  markLayer.appendChild(readoutSub)

  const phaseText = mk('text', { class: 'climb-phase__text', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  function paint(_index, step) {
    if (!step) return
    const { phase, i, dp } = step
    const isDone = phase === 'done'

    cells.forEach((el, k) => {
      const cls = ['climb-cell']
      const computed = phase === 'init' ? k <= 1 : k <= (isDone ? n : i - 1)
      if (computed) {
        cls.push(dp[k] > limit ? 'is-over' : 'is-fresh')
      } else {
        cls.push('is-ghost')
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    const cur = isDone ? n : i
    const v = dp[cur]
    const bad = v > limit
    readout.textContent = `ways(${cur}) = ${v}`
    readout.setAttribute('class', `climb-readout ${bad ? 'is-bad' : ''}`)
    readoutSub.textContent = bad
      ? `> int32 上限 ${limit} —— Java 的 int 在这一阶就已经是负数了`
      : `<= int32 上限 ${limit}，还装得下`
    readoutSub.setAttribute('class', `climb-readout-sub ${bad ? 'is-bad' : ''}`)

    if (phase === 'init') {
      segRound.textContent = '起点'
      segAct.textContent = 'ways(0)=1 · ways(1)=1'
      segVal.textContent = ''
    } else if (isDone) {
      segRound.textContent = `${n} 阶`
      segAct.textContent = 'int64 也只能撑到 ways(91)'
      segVal.textContent = `ways(${n}) = ${v}`
    } else {
      segRound.textContent = `第 ${cur} 阶`
      segAct.textContent = bad ? '装不下了' : '还能装下'
      segVal.textContent = `ways(${cur}) = ${v}`
    }
    segVal.setAttribute('class', `climb-banner__val ${bad ? 'is-bad' : ''}`)

    phaseText.textContent = isDone
      ? 'int64 撑到 ways(91)；ways(92) 就爆 —— JS 的 Number 更早，ways(78) 起丢整数精度。'
      : '增长是乘性的（约 1.618 倍每阶）—— 类型宽度是线性的，追不上。'

    renderRichText(descEl, step.desc)
  }

  return { svgRoot, paint }
}

/* ==================================================================== */

function mountClimbMode(host, options, mode, datasetKey) {
  if (!host || host.dataset[datasetKey] === '1') return { destroy() {} }
  host.dataset[datasetKey] = '1'
  ensureStyles()

  const steps = buildClimbSteps(options)
  const rootEl = document.createElement('div')
  rootEl.className = 'viz climb'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)
  const descEl = makeDesc()

  const built = mode === 'fill' ? buildFill(steps, descEl) : buildOverflow(steps, descEl)
  stage.appendChild(built.svgRoot)

  return finish(rootEl, host, descEl, steps, (index, step) => built.paint(index, step), options, datasetKey)
}

/**
 * dp 填表（默认 n=10）。
 * @param {HTMLElement} host
 * @param {{ n?: number, autoplay?: boolean, initialStep?: number, intervalMs?: number }} [options]
 */
export function mountClimb(host, options = {}) {
  return mountClimbMode(host, options, 'fill', 'climbMounted')
}

/**
 * int32 溢出演示（n=50）。
 * @param {HTMLElement} host
 * @param {{ autoplay?: boolean, initialStep?: number, intervalMs?: number }} [options]
 */
export function mountClimbOverflow(host, options = {}) {
  return mountClimbMode(host, { n: 50, int32Limit: 2147483647, ...options }, 'overflow', 'climbOverMounted')
}
