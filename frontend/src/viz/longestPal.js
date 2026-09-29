/**
 * longestPal.js — 「最长回文子串」(LC 5) 中心扩展的 SVG 渲染层。
 *
 * 一行字符格子 + 当前中心标记（字符中心 = 橙框；间隙中心 = 格间竖虚线）
 * + 扩展区淡金底 + 最优回文金下划线。done 帧最优格子变绿。
 *
 * 通用坑：A / K / W / X / 红线 4。（文件名避开 LC 234 的 palindromeList.js。）
 */

import { buildLongestPalSteps } from './longestPalSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'longpal-styles'

const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const CENTER_TOP = 152
const CELL_Y = 176
const CELL_H = 50
const BEST_LINE_Y = 262
const BEST_TEXT_Y = 284
const PHASE_Y = 318

const LABEL_X = 26
const AVAIL = 604
const PLAY_MS = 1250

const STYLES = `
.longpal {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.longpal__svg { width: 100%; height: auto; display: block; }

.longpal-note {
  fill: var(--longpal-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.longpal-banner__box {
  fill: var(--longpal-banner, #f4f3ef);
  stroke: var(--longpal-line, #c3c9c2);
  stroke-width: 1.5;
}
.longpal-banner__seg {
  fill: var(--longpal-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.longpal-banner__ans {
  fill: var(--longpal-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.longpal-cell__box {
  fill: var(--longpal-fill, #ffffff);
  stroke: var(--longpal-line, #c3c9c2);
  stroke-width: 1.5;
}
.longpal-cell__box.is-dashed {
  fill: none;
  stroke: var(--longpal-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.longpal-cell__val {
  fill: var(--longpal-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.longpal-cell__idx {
  fill: var(--longpal-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：当前中心扩展出的回文区间 */
.longpal-cell.is-span .longpal-cell__box { fill: var(--longpal-gold-fill, #fdf3e3); }
/* 通道二（边框）：当前中心（字符中心格）/ 最优区间（done） */
.longpal-cell.is-center .longpal-cell__box {
  stroke: var(--longpal-hot, #a45f45);
  stroke-width: 3;
}
.longpal-cell.is-best-done .longpal-cell__box {
  fill: var(--longpal-ok-fill, #eef5f1);
  stroke: var(--longpal-ok, #3f6b57);
  stroke-width: 2.5;
}

.longpal-gapline {
  stroke: var(--longpal-hot, #a45f45);
  stroke-width: 2.5;
  stroke-dasharray: 5 4;
}

.longpal-bestline {
  stroke: var(--longpal-gold, #c2872f);
  stroke-width: 3.5;
  stroke-linecap: round;
}
.longpal-besttext {
  fill: var(--longpal-gold, #c2872f);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.longpal-phase__text {
  fill: var(--longpal-muted, #657168);
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
export function mountLongestPal(host, options = {}) {
  if (!host || host.dataset.longpalMounted === '1') return { destroy() {} }
  host.dataset.longpalMounted = '1'
  ensureStyles()

  const steps = buildLongestPalSteps(options)
  const autoplay = options.autoplay !== false
  const s0 = steps[0]
  const chars = s0.chars
  const n = s0.n

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz longpal'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  let cellW = 52
  const need = n * cellW + (n - 1) * 8
  if (need > AVAIL) cellW = Math.max(24, Math.floor((AVAIL - (n - 1) * 8) / n))
  const gap = 8
  const rowW = n * cellW + (n - 1) * gap
  const width = Math.max(660, LABEL_X * 2 + rowW)
  const LEFT = (width - rowW) / 2
  const cx = (i) => LEFT + i * (cellW + gap) + cellW / 2
  const gapX = (i) => LEFT + (i + 1) * (cellW + gap) - gap / 2 // 字符 i 与 i+1 之间
  const BANNER_W = width - LABEL_X * 2
  const height = PHASE_Y + 24

  const svgRoot = mk('svg', {
    class: 'viz__svg longpal__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '最长回文子串 中心扩展推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', { class: 'longpal-cells' })
  const markLayer = mk('g', { class: 'longpal-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'longpal-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = '中心扩展：枚举 2n-1 个中心（字符 + 间隙），向两边扩展到不能再扩'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'longpal-banner__box', x: LABEL_X, y: BANNER_TOP, width: BANNER_W, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'longpal-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'longpal-banner__seg', x: LABEL_X + 190, y: BANNER_TOP + BANNER_H / 2 })
  const ansVal = mk('text', { class: 'longpal-banner__ans', x: width - LABEL_X - 18, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(ansVal)

  const cellEls = []
  for (let i = 0; i < n; i += 1) {
    const g = mk('g', { class: 'longpal-cell' })
    const box = mk('rect', { class: 'longpal-cell__box', x: cx(i) - cellW / 2, y: CELL_Y, width: cellW, height: CELL_H, rx: 6 })
    g.appendChild(box)
    const val = mk('text', { class: 'longpal-cell__val', x: cx(i), y: CELL_Y + CELL_H / 2 })
    val.textContent = chars[i]
    g.appendChild(val)
    const idx = mk('text', { class: 'longpal-cell__idx', x: cx(i), y: CELL_Y - 8 })
    idx.textContent = String(i)
    markLayer.appendChild(idx)
    cellLayer.appendChild(g)
    cellEls.push({ g, box, val })
  }

  // 间隙中心的竖虚线（每条间隙一根）
  const gapLines = []
  for (let i = 0; i < n - 1; i += 1) {
    const line = mk('line', {
      class: 'longpal-gapline',
      x1: gapX(i),
      y1: CELL_Y - 8,
      x2: gapX(i),
      y2: CELL_Y + CELL_H + 8,
    })
    line.style.opacity = '0'
    markLayer.appendChild(line)
    gapLines.push(line)
  }

  // 最优回文下划线 + 标注
  const bestLine = mk('line', { class: 'longpal-bestline', x1: 0, y1: BEST_LINE_Y, x2: 0, y2: BEST_LINE_Y })
  const bestText = mk('text', { class: 'longpal-besttext', x: width / 2, y: BEST_TEXT_Y })
  bestLine.style.opacity = '0'
  bestText.style.opacity = '0'
  markLayer.appendChild(bestLine)
  markLayer.appendChild(bestText)

  const phaseText = mk('text', { class: 'longpal-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const isDone = step.phase === 'done'
    const isCenter = step.phase === 'center'

    // 间隙虚线：只有当前帧的 gap 中心显示
    gapLines.forEach((line, i) => {
      const show = isCenter && step.centerType === 'gap' && step.ci === i
      line.style.opacity = show ? '1' : '0'
    })

    cellEls.forEach((el, i) => {
      const cls = ['longpal-cell']
      el.box.classList.remove('is-dashed')
      if (isCenter) {
        const inSpan = step.l !== null && i >= step.l && i <= step.r
        if (inSpan) cls.push('is-span')
        if (step.centerType === 'char' && i === step.ci) cls.push('is-center')
      }
      if (isDone && step.bestL !== null && i >= step.bestL && i <= step.bestR) cls.push('is-best-done')
      el.g.setAttribute('class', cls.join(' '))
    })

    // 最优下划线
    const showBest = step.bestL !== null
    if (showBest) {
      const x1 = LEFT + step.bestL * (cellW + gap)
      const x2 = LEFT + step.bestR * (cellW + gap) + cellW
      bestLine.setAttribute('x1', x1)
      bestLine.setAttribute('x2', x2)
      bestLine.style.opacity = '1'
      bestText.textContent = `best: "${step.chars.slice(step.bestL, step.bestR + 1).join('')}" (len ${step.bestLen})`
      bestText.setAttribute('x', (x1 + x2) / 2)
      bestText.style.opacity = '1'
    } else {
      bestLine.style.opacity = '0'
      bestText.style.opacity = '0'
    }

    // 横幅
    if (isCenter) {
      segRound.textContent = `中心 ${step.centerIdx + 1}/${2 * n - 1}`
      if (step.l !== null) {
        segAct.textContent = `expand(${step.centerType === 'char' ? step.ci : `${step.ci},${step.ci + 1}`}) → [${step.l}, ${step.r}] "${step.pal}"${step.bestUpdated ? ' ← 更新' : ''}`
      } else {
        segAct.textContent = `s[${step.ci}] ≠ s[${step.ci + 1}] → 长度 0`
      }
    } else if (step.phase === 'init') {
      segRound.textContent = '中心扩展'
      segAct.textContent = `${2 * n - 1} 个中心交错枚举`
    } else {
      segRound.textContent = `${2 * n - 1} 个中心扫完`
      segAct.textContent = `最优 [${step.bestL}, ${step.bestR}]`
    }
    ansVal.textContent = isDone ? `"${step.chars.slice(step.bestL, step.bestR + 1).join('')}"` : `"${chars.join('')}"`

    // 底部状态行
    if (isCenter) {
      phaseText.textContent =
        step.len > 0
          ? `该中心最长回文 len=${step.len} · best=${step.bestLen}`
          : '偶数回文靠间隙中心 —— 漏了它们就漏了 "abba"'
    } else if (step.phase === 'init') {
      phaseText.textContent = '字符中心管奇数回文（"bab"）· 间隙中心管偶数回文（"abba"）'
    } else {
      phaseText.textContent = 'O(n^2) 时间 · O(1) 空间 —— DP 是 O(n^2) 空间，Manacher 是 O(n) 但难写'
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
      delete host.dataset.longpalMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
