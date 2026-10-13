/**
 * varPart.js — 「序列切分使方差和最大」的 SVG 渲染层（k = 2 扫描层）。
 *
 * 视觉：序列画成柱子 + 两条「段均值」横线（左段一条、右段一条）——
 * 方差就是柱子到均值线的距离平方的平均，均值线拉开得越远、
 * 各段内部越散，两段方差和越大。
 *
 * 通用坑：A / V / X。
 */

import { buildVarPartSteps } from './varPartSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'varpart-styles'

const STYLES = `
.varpart { display: flex; flex-direction: column; gap: 14px; }
.varpart__svg { width: 100%; height: auto; display: block; }

.varpart-note {
  fill: var(--varpart-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.varpart-banner__box {
  fill: var(--varpart-banner, #f4f3ef);
  stroke: var(--varpart-line, #c3c9c2);
  stroke-width: 1.5;
}
.varpart-banner__seg {
  fill: var(--varpart-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.varpart-banner__val {
  fill: var(--varpart-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.varpart-axis { stroke: var(--varpart-line, #c3c9c2); stroke-width: 1.5; }
.varpart-bar { fill: var(--varpart-dim, #9aa39c); }
.varpart-bar.is-left { fill: var(--varpart-ok, #3f6b57); }
.varpart-bar.is-right { fill: var(--varpart-hot, #a45f45); }
.varpart-bar__val {
  fill: var(--varpart-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.varpart-mean {
  stroke-width: 2.5;
  stroke-dasharray: 6 4;
  opacity: 0;
}
.varpart-mean.is-on { opacity: 1; }
.varpart-mean.is-left { stroke: var(--varpart-ok, #3f6b57); }
.varpart-mean.is-right { stroke: var(--varpart-hot, #a45f45); }
.varpart-mean__label {
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
  /* 标签会压在比均值高的柱子上 —— 白描边保证可读 */
  paint-order: stroke;
  stroke: var(--varpart-page, #ffffff);
  stroke-width: 4px;
  stroke-linejoin: round;
}
.varpart-mean__label.is-on { opacity: 1; }
.varpart-mean__label.is-left { fill: var(--varpart-ok, #3f6b57); }
.varpart-mean__label.is-right { fill: var(--varpart-hot, #a45f45); }

.varpart-cut { stroke: var(--varpart-gold, #c2872f); stroke-width: 2.5; stroke-dasharray: 5 4; opacity: 0; }
.varpart-cut.is-on { opacity: 1; }
.varpart-cut__label {
  fill: var(--varpart-gold, #c2872f);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.varpart-cut__label.is-on { opacity: 1; }

.varpart-stat__box {
  fill: var(--varpart-fill, #ffffff);
  stroke: var(--varpart-line, #c3c9c2);
  stroke-width: 1.5;
}
.varpart-stat__text {
  fill: var(--varpart-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.varpart-stat__text.is-left { fill: var(--varpart-ok, #3f6b57); }
.varpart-stat__text.is-right { fill: var(--varpart-hot, #a45f45); }
.varpart-stat.is-best .varpart-stat__box {
  stroke: var(--varpart-gold, #c2872f);
  stroke-width: 3;
  fill: var(--varpart-gold-fill, #fdf3e3);
}
.varpart-stat.is-best .varpart-stat__text { fill: var(--varpart-gold, #c2872f); }
.varpart-stat.is-off { opacity: 0.35; }

.varpart-phase__text {
  fill: var(--varpart-muted, #657168);
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

function mount(host, options = {}) {
  if (!host || host.dataset.varpartMounted === '1') return { destroy() {} }
  host.dataset.varpartMounted = '1'
  ensureStyles()

  const steps = buildVarPartSteps(options)
  const s0 = steps[0]
  const { n, seq } = s0

  const W = 680
  const BANNER_TOP = 38
  const BANNER_H = 40
  const CH_TOP = 120
  const BASE = CH_TOP + 128
  const CH_H = 128
  const STAT_Y = BASE + 44
  const STAT_H = 42
  const PHASE_Y = STAT_Y + STAT_H + 34
  const height = PHASE_Y + 22

  const maxV = Math.max(...seq.map((v) => Math.abs(v)))
  const scale = maxV === 0 ? 1 : CH_H / maxV
  const barW = Math.max(20, Math.min(64, (W - 140 - (n - 1) * 12) / n))
  const rowW = n * barW + (n - 1) * 12
  const LEFT = (W - rowW) / 2
  const bx = (k) => LEFT + k * (barW + 12)
  const cx = (k) => bx(k) + barW / 2

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg varpart__svg',
    viewBox: `0 0 ${W} ${height}`,
    role: 'img',
    'aria-label': '序列切分方差和最大 扫描动画',
  })
  const markLayer = mk('g', { class: 'varpart-marks' })
  const cellLayer = mk('g', { class: 'varpart-cells' })
  const topLayer = mk('g', { class: 'varpart-top' })
  svgRoot.appendChild(markLayer)
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(topLayer)

  const note = mk('text', { class: 'varpart-note', x: 30, y: 22 })
  note.textContent = '切成 2 段使方差和最大：枚举切点，一阶/二阶前缀和 O(1) 算每段方差'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'varpart-banner__box', x: 30, y: BANNER_TOP, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'varpart-banner__seg', x: 46, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'varpart-banner__seg', x: 186, y: BANNER_TOP + BANNER_H / 2 })
  const segVal = mk('text', { class: 'varpart-banner__val', x: W - 46, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(segVal)

  markLayer.appendChild(mk('line', { class: 'varpart-axis', x1: LEFT - 16, y1: BASE, x2: LEFT + rowW + 16, y2: BASE }))

  const barEls = []
  for (let k = 0; k < n; k += 1) {
    const h = Math.max(2, Math.abs(seq[k]) * scale)
    const y = seq[k] >= 0 ? BASE - h : BASE
    const g = mk('g', {})
    g.appendChild(mk('rect', { class: 'varpart-bar', x: bx(k), y, width: barW, height: h, rx: 3 }))
    const val = mk('text', { class: 'varpart-bar__val', x: cx(k), y: y - 11 })
    val.textContent = String(seq[k])
    g.appendChild(val)
    cellLayer.appendChild(g)
    barEls.push({ g, rect: g.firstChild, val })
  }

  // 两条段均值线 + 切点虚线
  const meanL = mk('line', { class: 'varpart-mean is-left', x1: 0, y1: 0, x2: 0, y2: 0 })
  const meanR = mk('line', { class: 'varpart-mean is-right', x1: 0, y1: 0, x2: 0, y2: 0 })
  // 均值标签会压在比均值高的柱子上 —— 先画一道白色描边副本当halo，再画彩色文字
  const mkMeanLabel = (cls) => {
    const halo = mk('text', {
      class: `varpart-mean__label ${cls}`,
      x: 0,
      y: 0,
      fill: 'none',
      stroke: '#ffffff',
      'stroke-width': 4,
      'stroke-linejoin': 'round',
    })
    const text = mk('text', { class: `varpart-mean__label ${cls}`, x: 0, y: 0 })
    topLayer.appendChild(halo)
    topLayer.appendChild(text)
    return { halo, text }
  }
  const meanLabelL = mkMeanLabel('is-left')
  const meanLabelR = mkMeanLabel('is-right')
  const cutLine = mk('line', { class: 'varpart-cut', x1: 0, y1: CH_TOP - 14, x2: 0, y2: BASE })
  const cutLabel = mk('text', { class: 'varpart-cut__label', x: 0, y: CH_TOP - 24 })
  markLayer.appendChild(meanL)
  markLayer.appendChild(meanR)
  markLayer.appendChild(cutLine)
  markLayer.appendChild(cutLabel)

  // 三个统计筹码
  const statW = 168
  const statGap = 20
  const statTotal = statW * 3 + statGap * 2
  const statLeft = (W - statTotal) / 2
  const mkStat = (x, cls) => {
    const g = mk('g', { class: `varpart-stat ${cls}` })
    g.appendChild(mk('rect', { class: 'varpart-stat__box', x, y: STAT_Y, width: statW, height: STAT_H, rx: 9 }))
    const t = mk('text', { class: `varpart-stat__text ${cls}`, x: x + statW / 2, y: STAT_Y + STAT_H / 2 })
    g.appendChild(t)
    markLayer.appendChild(g)
    return { g, t }
  }
  const statL = mkStat(statLeft, 'is-left')
  const statR = mkStat(statLeft + statW + statGap, 'is-right')
  const statSum = mkStat(statLeft + (statW + statGap) * 2, '')

  const phaseText = mk('text', { class: 'varpart-phase__text', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  function paint(_index, step) {
    if (!step) return
    const { phase, i } = step
    const isDone = phase === 'done'

    if (phase === 'scan' || isDone) {
      const cut = isDone ? step.bestI : i
      const leftEnd = bx(cut) - 6
      const rightStart = bx(cut) + barW + 6
      const meanY = (v) => BASE - v * scale
      const meanLV = isDone ? steps[step.bestI].meanL : step.meanL
      const meanRV = isDone ? steps[step.bestI].meanR : step.meanR

      barEls.forEach((el, k) => {
        const cls = []
        if (k < cut) cls.push('is-left')
        else if (k >= cut) cls.push('is-right')
        el.rect.setAttribute('class', `varpart-bar ${cls.join(' ')}`)
      })

      meanL.setAttribute('x1', LEFT - 8)
      meanL.setAttribute('x2', leftEnd)
      meanL.setAttribute('y1', meanY(meanLV))
      meanL.setAttribute('y2', meanY(meanLV))
      meanL.classList.add('is-on')
      meanR.setAttribute('x1', rightStart)
      meanR.setAttribute('x2', LEFT + rowW + 8)
      meanR.setAttribute('y1', meanY(meanRV))
      meanR.setAttribute('y2', meanY(meanRV))
      meanR.classList.add('is-on')
      // 均值标签锚在「该段最高柱子的正上方」—— 那根柱的顶端就是该段的最高点，
      // 标签放它头上永远不会被别的柱子挡住（标签按最高柱宽度反推，够放）
      const tallest = (from, to) => {
        let bi = from
        for (let k = from; k < to; k += 1) if (seq[k] > seq[bi]) bi = k
        return bi
      }
      meanLabelL.halo.setAttribute('x', cx(tallest(0, cut)))
      meanLabelL.halo.setAttribute('y', meanY(meanLV) - 13)
      meanLabelL.halo.textContent = `左段均值 ${meanLV.toFixed(2)}`
      meanLabelL.halo.classList.add('is-on')
      meanLabelL.text.setAttribute('x', cx(tallest(0, cut)))
      meanLabelL.text.setAttribute('y', meanY(meanLV) - 13)
      meanLabelL.text.textContent = `左段均值 ${meanLV.toFixed(2)}`
      meanLabelL.text.classList.add('is-on')
      meanLabelR.halo.setAttribute('x', cx(tallest(cut, n)))
      meanLabelR.halo.setAttribute('y', meanY(meanRV) - 13)
      meanLabelR.halo.textContent = `右段均值 ${meanRV.toFixed(2)}`
      meanLabelR.halo.classList.add('is-on')
      meanLabelR.text.setAttribute('x', cx(tallest(cut, n)))
      meanLabelR.text.setAttribute('y', meanY(meanRV) - 13)
      meanLabelR.text.textContent = `右段均值 ${meanRV.toFixed(2)}`
      meanLabelR.text.classList.add('is-on')

      cutLine.setAttribute('x1', bx(cut) - 6)
      cutLine.setAttribute('x2', bx(cut) - 6)
      cutLine.classList.add('is-on')
      cutLabel.setAttribute('x', bx(cut) - 6)
      cutLabel.textContent = `切点 ${cut}`
      cutLabel.classList.add('is-on')

      const varLV = isDone ? steps[step.bestI].varL : step.varL
      const varRV = isDone ? steps[step.bestI].varR : step.varR
      const totalV = isDone ? step.best : step.total
      statL.t.textContent = `左段方差 ${varLV.toFixed(2)}`
      statR.t.textContent = `右段方差 ${varRV.toFixed(2)}`
      statSum.t.textContent = `合计 ${totalV.toFixed(2)}`
      const isBestNow = isDone || (step.bestI === step.i && step.total === step.best)
      statSum.g.setAttribute('class', `varpart-stat ${isBestNow ? 'is-best' : ''}`)
      statL.g.setAttribute('class', 'varpart-stat is-left')
      statR.g.setAttribute('class', 'varpart-stat is-right')
    } else {
      barEls.forEach((el) => el.rect.setAttribute('class', 'varpart-bar'))
      meanL.classList.remove('is-on')
      meanR.classList.remove('is-on')
      meanLabelL.halo.classList.remove('is-on')
      meanLabelL.text.classList.remove('is-on')
      meanLabelR.halo.classList.remove('is-on')
      meanLabelR.text.classList.remove('is-on')
      cutLine.classList.remove('is-on')
      cutLabel.classList.remove('is-on')
      statL.t.textContent = ''
      statR.t.textContent = ''
      statSum.t.textContent = ''
    }

    if (phase === 'init') {
      segRound.textContent = '序列'
      segAct.textContent = `切成 2 段`
      segVal.textContent = `(${seq.join(', ')})`
    } else if (phase === 'scan') {
      segRound.textContent = `切点 ${i}`
      segAct.textContent = `左 ${step.meanL.toFixed(2)} / 右 ${step.meanR.toFixed(2)}`
      segVal.textContent = `合计 ${step.total.toFixed(2)}`
    } else {
      segRound.textContent = `最优切点 ${step.bestI}`
      segAct.textContent = '两段方差和最大'
      segVal.textContent = step.best.toFixed(2)
    }

    phaseText.textContent = isDone
      ? '切成 k 段就是把这个扫描叠 k 层：dp[i][j] = max_{k} dp[k][j-1] + var(k+1..i)，总复杂度 O(n^2 k)。'
      : '均值线拉得越开、各段内部越散，两段方差和越大 —— 所以最优切点常常不在「看起来最该切」的地方。'

    renderRichText(descEl, step.desc)
  }

  const descEl = makeDesc()
  const rootEl = document.createElement('div')
  rootEl.className = 'viz varpart'
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
  const player = createPlayer({ steps, controls, intervalMs: 900, onRender: paint })
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
      delete host.dataset.varpartMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

/**
 * 序列切分（默认 seq = [2,8,3,9,4,7]，k = 2）。
 * @param {HTMLElement} host
 * @param {{ seq?: number[], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountVarPart(host, options = {}) {
  return mount(host, options)
}
