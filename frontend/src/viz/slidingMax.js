/**
 * slidingMax.js — 「滑动窗口最大值」(LC 239) 单调队列的 SVG 渲染层。
 *
 * 数组格子行（窗口色带 + 当前 i 高亮 + 本帧被淘汰的格子橙虚线）+ 队列行
 * （值 + 下标小字，最左是队首=最大）+ 答案行。
 *
 * 通用坑：A / K / V / W / 红线 4。
 */

import { buildSlidingMaxSteps } from './slidingMaxSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'slmax-styles'

const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const ARR_IDX_Y = 156
const ARR_Y = 168
const ARR_H = 46
const BAND_Y = 220

const DEQ_LABEL_Y = 250
const DEQ_Y = 240
const DEQ_H = 44
const FRONT_Y = 294

const ANS_Y = 322
const ANS_H = 40
const PHASE_Y = 386

const LABEL_X = 26
const AVAIL = 604
const PLAY_MS = 1150

const STYLES = `
.slmax {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.slmax__svg { width: 100%; height: auto; display: block; }

.slmax-note {
  fill: var(--slmax-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.slmax-banner__box {
  fill: var(--slmax-banner, #f4f3ef);
  stroke: var(--slmax-line, #c3c9c2);
  stroke-width: 1.5;
}
.slmax-banner__seg {
  fill: var(--slmax-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.slmax-banner__ans {
  fill: var(--slmax-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.slmax-band {
  fill: var(--slmax-band, #e8dcc4);
}
.slmax-band__tag {
  fill: var(--slmax-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.slmax-cell__box {
  fill: var(--slmax-fill, #ffffff);
  stroke: var(--slmax-line, #c3c9c2);
  stroke-width: 1.5;
}
.slmax-cell__val {
  fill: var(--slmax-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.slmax-cell__idx {
  fill: var(--slmax-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.slmax-cell__sub {
  fill: var(--slmax-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：窗口内 / 队列内 */
.slmax-cell.is-window .slmax-cell__box { fill: var(--slmax-gold-fill, #fdf3e3); }
.slmax-cell.is-queue .slmax-cell__box { fill: var(--slmax-gold-fill, #fdf3e3); }
/* 通道二（边框）：当前 i / 被支配 / 已出窗 */
.slmax-cell.is-cur .slmax-cell__box {
  stroke: var(--slmax-hot, #a45f45);
  stroke-width: 3;
}
.slmax-cell.is-cur .slmax-cell__val { fill: var(--slmax-hot, #a45f45); }
.slmax-cell.is-dropped .slmax-cell__box {
  stroke: var(--slmax-hot, #a45f45);
  stroke-dasharray: 4 3;
  stroke-width: 2.5;
}
.slmax-cell.is-dropped .slmax-cell__val { fill: var(--slmax-dim, #9aa39c); }
.slmax-cell.is-left .slmax-cell__box {
  stroke: var(--slmax-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.slmax-cell.is-left .slmax-cell__val { fill: var(--slmax-dim, #9aa39c); }
.slmax-cell.is-front .slmax-cell__box {
  stroke: var(--slmax-ok, #3f6b57);
  stroke-width: 3;
}
.slmax-cell.is-front .slmax-cell__val { fill: var(--slmax-ok, #3f6b57); }
.slmax-cell.is-ans .slmax-cell__box {
  fill: var(--slmax-ok-fill, #eef5f1);
  stroke: var(--slmax-ok, #3f6b57);
  stroke-width: 2;
}
.slmax-cell.is-ans .slmax-cell__val { fill: var(--slmax-ok, #3f6b57); }
.slmax-cell.is-fresh .slmax-cell__box {
  fill: var(--slmax-gold-fill, #fdf3e3);
  stroke: var(--slmax-gold, #c2872f);
  stroke-width: 3;
}
.slmax-cell.is-fresh .slmax-cell__val { fill: var(--slmax-gold, #c2872f); }
.slmax-cell.is-ghost .slmax-cell__box {
  fill: none;
  stroke: var(--slmax-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.slmax-cell.is-ghost .slmax-cell__val { fill: var(--slmax-dim, #9aa39c); }

.slmax-label {
  fill: var(--slmax-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.slmax-front {
  fill: var(--slmax-ok, #3f6b57);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.slmax-phase__text {
  fill: var(--slmax-muted, #657168);
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
 * @param {{ nums?: number[], k?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountSlidingMax(host, options = {}) {
  if (!host || host.dataset.slmaxMounted === '1') return { destroy() {} }
  host.dataset.slmaxMounted = '1'
  ensureStyles()

  const steps = buildSlidingMaxSteps(options)
  const autoplay = options.autoplay !== false
  const s0 = steps[0]
  const nums = s0.nums
  const n = s0.n
  const k = s0.k

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz slmax'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  if (n === 0 || k > n) {
    const svg0 = mk('svg', { class: 'viz__svg slmax__svg', viewBox: '0 0 620 120', role: 'img' })
    const t0 = mk('text', { x: 310, y: 60, style: 'fill: var(--slmax-muted, #657168); font-size: 14px; text-anchor: middle;' })
    t0.textContent = n === 0 ? '数组为空 —— 没有窗口' : `窗口大小 ${k} 大于数组长度 ${n} —— 无有效窗口`
    svg0.appendChild(t0)
    stage.appendChild(svg0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    ensureChromeStyles()
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.slmaxMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  const maxAns = Math.max(1, steps[steps.length - 1].ans.length)
  let cellW = 48
  const need = Math.max(n, maxAns, k) * cellW + (Math.max(n, maxAns, k) - 1) * 8
  if (need > AVAIL) cellW = Math.max(24, Math.floor((AVAIL - (Math.max(n, maxAns, k) - 1) * 8) / Math.max(n, maxAns, k)))
  const gap = 8
  const rowW = n * cellW + (n - 1) * gap
  const ansRowW = maxAns * cellW + (maxAns - 1) * gap
  const deqRowW = k * cellW + (k - 1) * gap
  const width = Math.max(660, LABEL_X * 2 + Math.max(rowW, ansRowW, deqRowW))
  const LEFT = (width - rowW) / 2
  const ALEFT = (width - ansRowW) / 2
  const DLEFT = (width - deqRowW) / 2
  const cx = (i) => LEFT + i * (cellW + gap) + cellW / 2
  const ax = (i) => ALEFT + i * (cellW + gap) + cellW / 2
  const dx = (t) => DLEFT + t * (cellW + gap) + cellW / 2
  const BANNER_W = width - LABEL_X * 2
  const height = PHASE_Y + 24

  const svgRoot = mk('svg', {
    class: 'viz__svg slmax__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '滑动窗口最大值 单调队列推演动画',
  })
  stage.appendChild(svgRoot)

  const bandLayer = mk('g', { class: 'slmax-bands' })
  const cellLayer = mk('g', { class: 'slmax-cells' })
  const markLayer = mk('g', { class: 'slmax-marks' })
  svgRoot.appendChild(bandLayer)
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'slmax-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = '单调队列：只留「还有机会当最大值」的候选，按值递减 —— 队首恒为最大'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'slmax-banner__box', x: LABEL_X, y: BANNER_TOP, width: BANNER_W, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'slmax-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'slmax-banner__seg', x: LABEL_X + 150, y: BANNER_TOP + BANNER_H / 2 })
  const ansVal = mk('text', { class: 'slmax-banner__ans', x: width - LABEL_X - 18, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(ansVal)

  // 数组行
  const arrEls = []
  for (let i = 0; i < n; i += 1) {
    const g = mk('g', { class: 'slmax-cell' })
    const box = mk('rect', { class: 'slmax-cell__box', x: cx(i) - cellW / 2, y: ARR_Y, width: cellW, height: ARR_H, rx: 6 })
    g.appendChild(box)
    const val = mk('text', { class: 'slmax-cell__val', x: cx(i), y: ARR_Y + ARR_H / 2 })
    val.textContent = String(nums[i])
    g.appendChild(val)
    const idx = mk('text', { class: 'slmax-cell__idx', x: cx(i), y: ARR_IDX_Y })
    idx.textContent = String(i)
    markLayer.appendChild(idx)
    cellLayer.appendChild(g)
    arrEls.push({ g, box, val })
  }

  // 窗口色带 + L/R 标签
  const band = mk('rect', { class: 'slmax-band', x: 0, y: BAND_Y, width: 0, height: 7, rx: 3.5 })
  bandLayer.appendChild(band)
  const bandL = mk('text', { class: 'slmax-band__tag', x: 0, y: BAND_Y + 18 })
  const bandR = mk('text', { class: 'slmax-band__tag', x: 0, y: BAND_Y + 18 })
  markLayer.appendChild(bandL)
  markLayer.appendChild(bandR)

  // 队列行
  const deqLabel = mk('text', { class: 'slmax-label', x: DLEFT - 14, y: DEQ_LABEL_Y })
  deqLabel.textContent = 'deque'
  markLayer.appendChild(deqLabel)
  const deqEls = []
  for (let t = 0; t < k; t += 1) {
    const g = mk('g', { class: 'slmax-cell' })
    const box = mk('rect', { class: 'slmax-cell__box', x: dx(t) - cellW / 2, y: DEQ_Y, width: cellW, height: DEQ_H, rx: 6 })
    g.appendChild(box)
    const val = mk('text', { class: 'slmax-cell__val', x: dx(t), y: DEQ_Y + DEQ_H / 2 - 5 })
    g.appendChild(val)
    const sub = mk('text', { class: 'slmax-cell__sub', x: dx(t), y: DEQ_Y + DEQ_H - 8 })
    g.appendChild(sub)
    cellLayer.appendChild(g)
    deqEls.push({ g, box, val, sub })
  }
  const frontMark = mk('text', { class: 'slmax-front', x: 0, y: FRONT_Y })
  frontMark.textContent = 'front (max)'
  markLayer.appendChild(frontMark)

  // 答案行
  const ansLabel = mk('text', { class: 'slmax-label', x: ALEFT - 14, y: ANS_Y + ANS_H / 2 })
  ansLabel.textContent = 'ans'
  markLayer.appendChild(ansLabel)
  const ansEls = []
  for (let t = 0; t < maxAns; t += 1) {
    const g = mk('g', { class: 'slmax-cell' })
    const box = mk('rect', { class: 'slmax-cell__box', x: ax(t) - cellW / 2, y: ANS_Y, width: cellW, height: ANS_H, rx: 6 })
    g.appendChild(box)
    const val = mk('text', { class: 'slmax-cell__val', x: ax(t), y: ANS_Y + ANS_H / 2 })
    g.appendChild(val)
    cellLayer.appendChild(g)
    ansEls.push({ g, box, val })
  }

  const phaseText = mk('text', { class: 'slmax-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const isSlide = step.phase === 'slide'
    const isRecord = step.phase === 'record'
    const isDone = step.phase === 'done'
    const winL = step.l ?? 0
    const winR = step.r ?? (isDone ? n - 1 : 0)
    const droppedSet = new Set(step.dropped || [])
    const expiredSet = new Set(step.expired || [])

    // 数组行
    arrEls.forEach((el, i) => {
      const cls = ['slmax-cell']
      if (i >= winL && i <= winR) cls.push('is-window')
      else if (winL > 0 && i < winL) cls.push('is-left')
      if (isSlide || isRecord) {
        if (droppedSet.has(i)) cls.push('is-dropped')
        else if (expiredSet.has(i)) cls.push('is-left')
        if (i === step.i && !isDone) cls.push('is-cur')
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    // 窗口色带
    if (winR >= winL && winR < n) {
      const x1 = LEFT + winL * (cellW + gap)
      const x2 = LEFT + winR * (cellW + gap) + cellW
      band.setAttribute('x', x1)
      band.setAttribute('width', Math.max(4, x2 - x1))
      band.style.opacity = '1'
      bandL.setAttribute('x', x1 + 4)
      bandL.textContent = `L=${winL}`
      bandR.setAttribute('x', x2 - 4)
      bandR.textContent = `R=${winR}`
      bandL.style.opacity = '1'
      bandR.style.opacity = '1'
    } else {
      band.style.opacity = '0'
      bandL.style.opacity = '0'
      bandR.style.opacity = '0'
    }

    // 队列行
    const dq = step.dq || []
    deqEls.forEach((el, t) => {
      const cls = ['slmax-cell']
      if (t < dq.length) {
        const idx2 = dq[t]
        el.val.textContent = String(nums[idx2])
        el.sub.textContent = `#${idx2}`
        cls.push('is-queue')
        if (t === 0) cls.push('is-front')
      } else {
        el.val.textContent = ''
        el.sub.textContent = ''
        cls.push('is-ghost')
      }
      el.g.setAttribute('class', cls.join(' '))
    })
    if (dq.length > 0) {
      frontMark.setAttribute('x', dx(0))
      frontMark.style.opacity = '1'
    } else {
      frontMark.style.opacity = '0'
    }

    // 答案行
    const ans = step.ans || []
    ansEls.forEach((el, t) => {
      const cls = ['slmax-cell']
      if (t < ans.length) {
        el.val.textContent = String(ans[t])
        cls.push(isRecord && t === ans.length - 1 ? 'is-fresh' : 'is-ans')
      } else {
        el.val.textContent = ''
        cls.push('is-ghost')
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    // 横幅
    if (isSlide || isRecord) {
      segRound.textContent = `i=${step.i} · 窗口 [${winL}, ${winR}]`
      const acts = []
      if (isSlide) {
        if (expiredSet.size > 0) acts.push(`出窗 ${[...step.expired].map((x) => nums[x]).join(',')}`)
        if (droppedSet.size > 0) acts.push(`被支配 ${[...step.dropped].map((x) => nums[x]).join(',')}`)
        acts.push(`push ${nums[step.i]}`)
      } else {
        acts.push(`记录最大值 ${step.maxVal}`)
      }
      segAct.textContent = acts.join(' · ')
    } else if (step.phase === 'init') {
      segRound.textContent = '单调队列'
      segAct.textContent = '队列只留还有机会的候选'
    } else {
      segRound.textContent = `${n} 个元素扫完`
      segAct.textContent = `${step.ans.length} 个窗口`
    }
    ansVal.textContent = isDone ? `[${step.ans.join(',')}]` : `max=${step.maxVal ?? '-'}`

    // 底部状态行
    if (isSlide) {
      const bits = []
      if (expiredSet.size > 0) bits.push('动作一：队首出窗（看下标）')
      if (droppedSet.size > 0) bits.push('动作二：队尾被支配（看值）')
      phaseText.textContent =
        bits.length > 0
          ? `${bits.join(' + ')} —— 两个动作一个看下标一个看值，互不干扰`
          : '队列仍严格递减且都在窗内 —— 无需淘汰'
    } else if (isRecord) {
      phaseText.textContent = `队首 ${step.maxVal} 就是这一窗的最大值（队列递减且在窗内，无需再扫）`
    } else if (step.phase === 'init') {
      phaseText.textContent = '队列存下标 —— 下标才能判断"还在不在窗里"'
    } else {
      phaseText.textContent = '每元素最多入队一次、出队一次 —— 均摊 O(1)，总 O(n) 时间 O(k) 空间'
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
      delete host.dataset.slmaxMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
