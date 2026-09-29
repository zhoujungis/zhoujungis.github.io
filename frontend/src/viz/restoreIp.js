/**
 * restoreIp.js — 「复原 IP 地址」(LC 93) 分段回溯的 SVG 渲染层。
 *
 * 一行字符格子 + 分隔标记：已切段之间画橙色实竖线，try 的暂定分隔画灰虚线；
 * try 段区间淡金（ok）/ 灰虚格（剪枝）；下方答案收集区逐行亮出。
 *
 * 通用坑：A / K / W / X / 红线 4。
 */

import { buildRestoreIpSteps } from './restoreIpSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'rip-styles'

const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const CELL_Y = 176
const CELL_H = 46
const DIV_TOP = 164
const DIV_BOT = 234

const ANS_TITLE_Y = 272
const ANS_LINE_Y0 = 296
const ANS_DY = 24

const PHASE_Y = 344

const LABEL_X = 26
const AVAIL = 604
const PLAY_MS = 1150

const STYLES = `
.rip {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rip__svg { width: 100%; height: auto; display: block; }

.rip-note {
  fill: var(--rip-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rip-banner__box {
  fill: var(--rip-banner, #f4f3ef);
  stroke: var(--rip-line, #c3c9c2);
  stroke-width: 1.5;
}
.rip-banner__seg {
  fill: var(--rip-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rip-banner__ans {
  fill: var(--rip-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rip-cell__box {
  fill: var(--rip-fill, #ffffff);
  stroke: var(--rip-line, #c3c9c2);
  stroke-width: 1.5;
}
.rip-cell__box.is-dashed {
  fill: none;
  stroke: var(--rip-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.rip-cell__val {
  fill: var(--rip-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rip-cell__idx {
  fill: var(--rip-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：try 段 ok → 淡金；剪 → 灰 */
.rip-cell.is-try-ok .rip-cell__box { fill: var(--rip-gold-fill, #fdf3e3); }
.rip-cell.is-try-ok .rip-cell__val { fill: var(--rip-hot, #a45f45); }
.rip-cell.is-try-bad .rip-cell__box {
  fill: none;
  stroke: var(--rip-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.rip-cell.is-try-bad .rip-cell__val { fill: var(--rip-dim, #9aa39c); }
/* done：全部正常白格 */

.rip-div-fixed {
  stroke: var(--rip-hot, #a45f45);
  stroke-width: 3;
  stroke-linecap: round;
}
.rip-div-try {
  stroke: var(--rip-dim, #9aa39c);
  stroke-width: 2;
  stroke-dasharray: 4 3;
}

.rip-ans__title {
  fill: var(--rip-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rip-ans__row {
  fill: var(--rip-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rip-ans__row.is-fresh { fill: var(--rip-gold, #c2872f); font-weight: 700; }
.rip-ans__empty {
  fill: var(--rip-dim, #9aa39c);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rip-phase__text {
  fill: var(--rip-muted, #657168);
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
export function mountRestoreIp(host, options = {}) {
  if (!host || host.dataset.ripMounted === '1') return { destroy() {} }
  host.dataset.ripMounted = '1'
  ensureStyles()

  const steps = buildRestoreIpSteps(options)
  const autoplay = options.autoplay !== false
  const s0 = steps[0]
  const chars = s0.chars
  const n = s0.n

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz rip'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  let cellW = 46
  const need = n * cellW + (n - 1) * 8
  if (need > AVAIL) cellW = Math.max(22, Math.floor((AVAIL - (n - 1) * 8) / n))
  const gap = 8
  const rowW = n * cellW + (n - 1) * gap
  const width = Math.max(660, LABEL_X * 2 + rowW)
  const LEFT = (width - rowW) / 2
  const cx = (i) => LEFT + i * (cellW + gap) + cellW / 2
  // 缝隙 x：字符 i 与 i+1 之间
  const gapX = (i) => LEFT + (i + 1) * (cellW + gap) - gap / 2
  const BANNER_W = width - LABEL_X * 2
  const maxAnsRows = Math.max(1, ...steps.map((s) => s.ans.length))
  const ansBlockH = ANS_LINE_Y0 + (maxAnsRows - 1) * ANS_DY - (ANS_TITLE_Y - 16) + 8
  const height = Math.max(PHASE_Y + 24, ANS_TITLE_Y + 24 + ansBlockH)

  const svgRoot = mk('svg', {
    class: 'viz__svg rip__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '复原 IP 地址 分段回溯推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', { class: 'rip-cells' })
  const markLayer = mk('g', { class: 'rip-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'rip-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = '分段回溯：每段切 1-3 位，剪枝两层 —— 段合法性（前导零 / >255）+ 可行性（剩余位数）'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'rip-banner__box', x: LABEL_X, y: BANNER_TOP, width: BANNER_W, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'rip-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'rip-banner__seg', x: LABEL_X + 175, y: BANNER_TOP + BANNER_H / 2 })
  const ansVal = mk('text', { class: 'rip-banner__ans', x: width - LABEL_X - 18, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(ansVal)

  const cellEls = []
  for (let i = 0; i < n; i += 1) {
    const g = mk('g', { class: 'rip-cell' })
    const box = mk('rect', { class: 'rip-cell__box', x: cx(i) - cellW / 2, y: CELL_Y, width: cellW, height: CELL_H, rx: 6 })
    g.appendChild(box)
    const val = mk('text', { class: 'rip-cell__val', x: cx(i), y: CELL_Y + CELL_H / 2 })
    val.textContent = chars[i]
    g.appendChild(val)
    const idx = mk('text', { class: 'rip-cell__idx', x: cx(i), y: CELL_Y - 8 })
    idx.textContent = String(i)
    markLayer.appendChild(idx)
    cellLayer.appendChild(g)
    cellEls.push({ g, box, val })
  }

  // 分隔线：n-1 条缝隙，每条一根（实/虚 + 显隐由帧控制）
  const divEls = []
  for (let i = 0; i < n - 1; i += 1) {
    const line = mk('line', {
      class: 'rip-div-fixed',
      x1: gapX(i),
      y1: DIV_TOP,
      x2: gapX(i),
      y2: DIV_BOT,
    })
    line.style.opacity = '0'
    markLayer.appendChild(line)
    divEls.push(line)
  }

  // 答案收集区
  const ansTitle = mk('text', { class: 'rip-ans__title', x: LABEL_X, y: ANS_TITLE_Y })
  ansTitle.textContent = 'answers'
  markLayer.appendChild(ansTitle)
  const ansRows = []
  for (let r = 0; r < maxAnsRows; r += 1) {
    const t = mk('text', { class: 'rip-ans__row', x: width / 2, y: ANS_LINE_Y0 + r * ANS_DY })
    t.style.opacity = '0'
    markLayer.appendChild(t)
    ansRows.push(t)
  }
  const ansEmpty = mk('text', { class: 'rip-ans__empty', x: width / 2, y: ANS_LINE_Y0 })
  ansEmpty.textContent = '（还没有答案 —— 切满 4 段且恰好用完全部数字才会收下）'
  markLayer.appendChild(ansEmpty)

  const phaseText = mk('text', { class: 'rip-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const isDone = step.phase === 'done'
    const isTry = step.phase === 'try'
    const isAnswer = step.phase === 'answer'

    // 分隔线：path 的段边界 = 实线；try 的暂定边界 = 虚线
    divEls.forEach((line, i) => {
      const gapAfter = i + 1 // 分隔在字符 i 与 i+1 之间 → 边界位置 i+1
      const cutPos = step.path.slice(0, -0).length
      // 已确认段边界：path 各段长度累加
      let acc = 0
      let isFixed = false
      for (const seg of step.path) {
        acc += seg.length
        if (acc === gapAfter) {
          isFixed = true
          break
        }
      }
      const isTryBoundary = (isTry || isAnswer) && step.trySeg !== null && step.pos === gapAfter
      const isTryEnd = (isTry || isAnswer) && step.trySeg !== null && step.pos + step.trySeg.length === gapAfter
      if (isFixed) {
        line.setAttribute('class', 'rip-div-fixed')
        line.style.opacity = '1'
      } else if (isTryBoundary || isTryEnd) {
        line.setAttribute('class', 'rip-div-try')
        line.style.opacity = '1'
      } else {
        line.style.opacity = '0'
      }
    })

    // 格子：try 段区间高亮
    const tryStart = step.pos
    const tryEnd = step.trySeg !== null ? step.pos + step.trySeg.length - 1 : -1
    cellEls.forEach((el, i) => {
      const cls = ['rip-cell']
      el.box.classList.remove('is-dashed')
      if (isTry && i >= tryStart && i <= tryEnd) {
        cls.push(step.verdict === 'ok' || step.verdict === 'answer' ? 'is-try-ok' : 'is-try-bad')
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    // 答案区
    const ans = step.ans
    if (ans.length === 0) {
      ansEmpty.style.opacity = '1'
    } else {
      ansEmpty.style.opacity = '0'
    }
    ansRows.forEach((t, r) => {
      if (r < ans.length) {
        t.textContent = `"${ans[r]}"`
        t.setAttribute('class', 'rip-ans__row' + (isAnswer && r === ans.length - 1 ? ' is-fresh' : ''))
        t.style.opacity = '1'
      } else {
        t.style.opacity = '0'
      }
    })

    // 横幅
    const segNo = step.path.length + 1
    if (isTry || isAnswer) {
      segRound.textContent = `切第 ${isAnswer ? 4 : segNo} 段`
      const v = step.verdict
      const vName = v === 'ok' ? '合法，深入' : v === 'answer' ? '收下答案' : v === 'lead-zero' ? '前导零' : v === 'range' ? '超出 255' : '长度不可行'
      segAct.textContent = step.trySeg === null
        ? `末尾只剩 ${step.n - step.pos} 位，不够切 ${step.segLen} 位`
        : `try "${step.trySeg}" → ${vName}`
    } else if (step.phase === 'init') {
      segRound.textContent = '分段回溯'
      segAct.textContent = '在缝隙里选 3 个切点（每段 1-3 位）'
    } else {
      segRound.textContent = '搜索结束'
      segAct.textContent = `${step.ans.length} 个答案`
    }
    ansVal.textContent = isDone ? `${step.ans.length} 个` : `${step.ans.length} 个答案`

    // 底部状态行
    if (isTry || isAnswer) {
      const base = step.path.length > 0 ? step.path.join('.') : '(空)'
      const tryNote = isTry && step.trySeg !== null ? ` + 尝试 "${step.trySeg}"` : ''
      phaseText.textContent = `path: ${base}${tryNote} · pos=${step.pos} · 剩余 ${step.n - step.pos} 位`
    } else if (step.phase === 'init') {
      phaseText.textContent = '长度不在 [4, 12] 直接无解；每层最多 3 个分支、只有 4 层'
    } else {
      phaseText.textContent = '可行性剪枝：剩余 segs 段时，剩余位数必须落在 [segs, segs × 3]'
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
      delete host.dataset.ripMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
