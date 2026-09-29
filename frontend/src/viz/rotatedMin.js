/**
 * rotatedMin.js — 「寻找旋转排序数组中的最小值」(LC 153) 的 SVG 渲染层。
 *
 * 柱状图呈现"两段上升 + 断崖"；l / m / r 三根指针在柱子上方；
 * 存活区间外的柱子灰化；done 帧给最小值柱子戴金环。
 *
 * 帧 l / r = 本帧决策时的区间（收缩前），live = 本帧收缩后 —— 存活区画 live。
 * 通用坑：A / K / X / 红线 4。
 */

import { buildRotatedMinSteps } from './rotatedMinSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'rmin-styles'

const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const PIN_ROW = 158 // 指针标签行
const TRI_TOP = 178
const CELL_TOP = 206
const CELL_MAX_H = 130
const AXIS_Y = 356

const LABEL_X = 26
const AVAIL = 604
const PLAY_MS = 1250

const STYLES = `
.rmin {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rmin__svg { width: 100%; height: auto; display: block; }

.rmin-note {
  fill: var(--rmin-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rmin-banner__box {
  fill: var(--rmin-banner, #f4f3ef);
  stroke: var(--rmin-line, #c3c9c2);
  stroke-width: 1.5;
}
.rmin-banner__seg {
  fill: var(--rmin-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rmin-banner__ans {
  fill: var(--rmin-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rmin-cell__box {
  fill: var(--rmin-fill, #ffffff);
  stroke: var(--rmin-line, #c3c9c2);
  stroke-width: 1.5;
}
.rmin-cell__val {
  fill: var(--rmin-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rmin-cell__idx {
  fill: var(--rmin-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 存活区外的柱子灰化 */
.rmin-cell.is-out .rmin-cell__box {
  fill: var(--rmin-dim-fill, #f0efea);
  stroke-dasharray: 4 3;
}
.rmin-cell.is-out .rmin-cell__val { fill: var(--rmin-dim, #b9b9b3); }
/* mid 比较基准的柱子给个淡金底 */
.rmin-cell.is-base .rmin-cell__box { fill: var(--rmin-gold-fill, #fdf3e3); }

/* 指针 */
.rmin-pin--l { fill: var(--rmin-ok, #3f6b57); }
.rmin-pin--m { fill: var(--rmin-hot, #a45f45); }
.rmin-pin--r { fill: var(--rmin-cmp, #5a7ea6); }
.rmin-pin__tag { fill: inherit; }
.rmin-pin__text {
  fill: var(--rmin-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 最小值金环 */
.rmin-min__ring {
  fill: none;
  stroke: var(--rmin-gold, #c2872f);
  stroke-width: 3;
}
.rmin-min__text {
  fill: var(--rmin-gold, #c2872f);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rmin-empty__text {
  fill: var(--rmin-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
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
 * @param {{ nums?: number[], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountRotatedMin(host, options = {}) {
  if (!host || host.dataset.rminMounted === '1') return { destroy() {} }
  host.dataset.rminMounted = '1'
  ensureStyles()

  const steps = buildRotatedMinSteps(options)
  const autoplay = options.autoplay !== false
  const nums0 = steps[0].nums
  const n = nums0.length

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz rmin'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  if (n === 0) {
    const s0 = mk('svg', { class: 'viz__svg rmin__svg', viewBox: '0 0 620 120', role: 'img' })
    const t0 = mk('text', { class: 'rmin-empty__text', x: 310, y: 60 })
    t0.textContent = '空输入 —— 没有最小值'
    s0.appendChild(t0)
    stage.appendChild(s0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    ensureChromeStyles()
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.rminMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  let cellW = 58
  const need = n * cellW + (n - 1) * 6
  if (need > AVAIL) cellW = Math.max(20, Math.floor((AVAIL - (n - 1) * 6) / n))
  const rowW = n * cellW + (n - 1) * 6
  const width = Math.max(660, LABEL_X * 2 + rowW)
  const LEFT = (width - rowW) / 2
  const cx = (i) => LEFT + i * (cellW + 6) + cellW / 2

  const maxV = Math.max(...nums0)
  const scale = CELL_MAX_H / maxV
  const heightOf = (v) => Math.max(14, v * scale)

  const height = AXIS_Y + 16
  const BANNER_W = width - LABEL_X * 2

  const svgRoot = mk('svg', {
    class: 'viz__svg rmin__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '寻找旋转排序数组中的最小值 推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', { class: 'rmin-cells' })
  const markLayer = mk('g', { class: 'rmin-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'rmin-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = '只问一句：nums[mid] 和 nums[right] 谁大 —— 断崖在哪边，最小值就在哪边'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'rmin-banner__box', x: LABEL_X, y: BANNER_TOP, width: BANNER_W, height: BANNER_H, rx: 9 }),
  )
  const segLive = mk('text', { class: 'rmin-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'rmin-banner__seg', x: LABEL_X + 230, y: BANNER_TOP + BANNER_H / 2 })
  const ansVal = mk('text', { class: 'rmin-banner__ans', x: width - LABEL_X - 18, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segLive)
  markLayer.appendChild(segAct)
  markLayer.appendChild(ansVal)

  // 柱子
  const cellEls = []
  for (let i = 0; i < n; i += 1) {
    const g = mk('g', { class: 'rmin-cell' })
    const h = heightOf(nums0[i])
    const box = mk('rect', {
      class: 'rmin-cell__box',
      x: cx(i) - cellW / 2,
      y: CELL_TOP + CELL_MAX_H - h,
      width: cellW,
      height: h,
      rx: 5,
    })
    g.appendChild(box)
    const val = mk('text', { class: 'rmin-cell__val', x: cx(i), y: CELL_TOP + CELL_MAX_H - h + 14 })
    val.textContent = String(nums0[i])
    g.appendChild(val)
    const idx = mk('text', { class: 'rmin-cell__idx', x: cx(i), y: AXIS_Y + 8 })
    idx.textContent = String(i)
    g.appendChild(idx)
    cellLayer.appendChild(g)
    cellEls.push({ g })
  }

  // 指针（l / m / r 三根）
  const pins = {}
  for (const key of ['l', 'm', 'r']) {
    const g = mk('g', { class: `rmin-pin rmin-pin--${key}` })
    const tag = mk('rect', { class: 'rmin-pin__tag', x: 0, y: PIN_ROW, width: 22, height: 20, rx: 5 })
    const tri = mk('path', { class: 'rmin-pin__tag', d: 'M 0 0 L 0 0 L 0 0' })
    const text = mk('text', { class: 'rmin-pin__text', x: 0, y: PIN_ROW + 10 })
    text.textContent = key
    g.appendChild(tag)
    g.appendChild(tri)
    g.appendChild(text)
    markLayer.appendChild(g)
    pins[key] = { g, tag, tri, text }
  }

  // 最小值金环
  const minRing = mk('circle', { class: 'rmin-min__ring', cx: 0, cy: 0, r: 0 })
  const minText = mk('text', { class: 'rmin-min__text', x: 0, y: 0 })
  markLayer.appendChild(minRing)
  markLayer.appendChild(minText)

  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const isDone = step.phase === 'done'
    const live = step.live ?? (step.l !== null ? [step.l, step.r] : null)

    cellEls.forEach((el, i) => {
      const cls = ['rmin-cell']
      if (live && (i < live[0] || i > live[1])) cls.push('is-out')
      // 比较基准柱（nums[r]）
      if (!isDone && step.r !== null && i === step.r) cls.push('is-base')
      el.g.setAttribute('class', cls.join(' '))
    })

    // 指针位置
    const pinX = (i) => cx(i)
    const place = (key, i) => {
      const p = pins[key]
      if (i === null || i === undefined || i < 0 || i >= n) {
        p.g.style.opacity = '0'
        return
      }
      const x = pinX(i)
      p.tag.setAttribute('x', x - 11)
      p.tri.setAttribute('d', `M ${x - 6} ${TRI_TOP} L ${x + 6} ${TRI_TOP} L ${x} ${TRI_TOP + 9} z`)
      p.text.setAttribute('x', x)
      p.g.style.opacity = '1'
    }
    place('l', step.l)
    place('m', isDone ? null : step.mid)
    place('r', isDone ? null : step.r)

    // done：最小值金环
    if (isDone && step.minIdx !== null) {
      const x = cx(step.minIdx)
      const h = heightOf(nums0[step.minIdx])
      minRing.setAttribute('cx', x)
      minRing.setAttribute('cy', CELL_TOP + CELL_MAX_H - h / 2)
      minRing.setAttribute('r', Math.max(16, cellW / 2 + 6))
      minText.setAttribute('x', x)
      minText.setAttribute('y', CELL_TOP + CELL_MAX_H - h - 22)
      minText.textContent = `min = ${nums0[step.minIdx]}`
      minRing.style.opacity = '1'
      minText.style.opacity = '1'
    } else {
      minRing.style.opacity = '0'
      minText.style.opacity = '0'
    }

    // 横幅
    segLive.textContent = live ? `存活区间 [${live[0]}, ${live[1]}]` : '存活区间 -'
    if (step.phase === 'init') {
      segAct.textContent = 'mid 和 nums[right] 比：断崖在哪边，最小值就在哪边'
    } else if (step.cmp === '>') {
      segAct.textContent = `${step.midVal} > ${step.rightVal} → mid 在第一段，去右边`
    } else if (step.cmp === '<') {
      segAct.textContent = `${step.midVal} < ${step.rightVal} → mid 在第二段，r = mid`
    } else if (isDone) {
      segAct.textContent = 'l 与 r 相遇'
    } else {
      segAct.textContent = ''
    }
    ansVal.textContent = isDone && step.minIdx !== null ? `min ${step.nums[step.minIdx]}` : 'min ?'

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
      delete host.dataset.rminMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
