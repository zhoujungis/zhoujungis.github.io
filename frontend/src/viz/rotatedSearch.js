/**
 * rotatedSearch.js — 「搜索旋转排序数组」(LC 33) 的 SVG 渲染层。
 *
 * 与 rotatedMin.js 同一形态（柱状图 + 断崖 + 三指针），差异：
 *   - target 水平虚线横贯画面（值轴参照）；
 *   - 帧的 ordered/range 高亮"有序的那半"（淡金底）；
 *   - done：命中柱子金环 / miss：横幅 -1。
 *
 * 帧 l / r = 本帧决策时的区间（收缩前），live = 本帧收缩后 —— 存活区画 live。
 * 通用坑：A / K / X / 红线 4。
 */

import { buildRotatedSearchSteps } from './rotatedSearchSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'rsearch-styles'

const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const PIN_ROW = 158
const TRI_TOP = 178
const CELL_TOP = 206
const CELL_MAX_H = 130
const AXIS_Y = 356

const LABEL_X = 26
const AVAIL = 604
const PLAY_MS = 1250

const STYLES = `
.rsearch {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rsearch__svg { width: 100%; height: auto; display: block; }

.rsearch-note {
  fill: var(--rs-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rsearch-banner__box {
  fill: var(--rs-banner, #f4f3ef);
  stroke: var(--rs-line, #c3c9c2);
  stroke-width: 1.5;
}
.rsearch-banner__seg {
  fill: var(--rs-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rsearch-banner__ans {
  fill: var(--rs-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rsearch-banner__ans.is-miss {
  fill: var(--rs-hot, #a45f45);
}

.rsearch-cell__box {
  fill: var(--rs-fill, #ffffff);
  stroke: var(--rs-line, #c3c9c2);
  stroke-width: 1.5;
}
.rsearch-cell__val {
  fill: var(--rs-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rsearch-cell__idx {
  fill: var(--rs-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rsearch-cell.is-out .rsearch-cell__box {
  fill: var(--rs-dim-fill, #f0efea);
  stroke-dasharray: 4 3;
}
.rsearch-cell.is-out .rsearch-cell__val { fill: var(--rs-dim, #b9b9b3); }
/* 有序半：淡金底（通道一） */
.rsearch-cell.is-ordered .rsearch-cell__box { fill: var(--rs-gold-fill, #fdf3e3); }

.rsearch-pin--l { fill: var(--rs-ok, #3f6b57); }
.rsearch-pin--m { fill: var(--rs-hot, #a45f45); }
.rsearch-pin--r { fill: var(--rs-cmp, #5a7ea6); }
.rsearch-pin__tag { fill: inherit; }
.rsearch-pin__text {
  fill: var(--rs-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* target 水平虚线 */
.rsearch-target__line {
  stroke: var(--rs-gold, #c2872f);
  stroke-width: 1.5;
  stroke-dasharray: 6 4;
}
.rsearch-target__text {
  fill: var(--rs-gold, #c2872f);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rsearch-hit__ring {
  fill: none;
  stroke: var(--rs-gold, #c2872f);
  stroke-width: 3;
}
.rsearch-hit__text {
  fill: var(--rs-gold, #c2872f);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rsearch-empty__text {
  fill: var(--rs-muted, #657168);
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
 * @param {{ nums?: number[], target?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountRotatedSearch(host, options = {}) {
  if (!host || host.dataset.rsMounted === '1') return { destroy() {} }
  host.dataset.rsMounted = '1'
  ensureStyles()

  const steps = buildRotatedSearchSteps(options)
  const autoplay = options.autoplay !== false
  const nums0 = steps[0].nums
  const target0 = steps[0].target
  const n = nums0.length

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz rsearch'
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
    const s0 = mk('svg', { class: 'viz__svg rsearch__svg', viewBox: '0 0 620 120', role: 'img' })
    const t0 = mk('text', { class: 'rsearch-empty__text', x: 310, y: 60 })
    t0.textContent = '空输入 —— 返回 -1'
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
        delete host.dataset.rsMounted
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

  const maxV = Math.max(...nums0, target0)
  const scale = CELL_MAX_H / maxV
  const yOf = (v) => CELL_TOP + CELL_MAX_H - v * scale
  const height = AXIS_Y + 16
  const BANNER_W = width - LABEL_X * 2

  const svgRoot = mk('svg', {
    class: 'viz__svg rsearch__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '搜索旋转排序数组 推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', { class: 'rsearch-cells' })
  const markLayer = mk('g', { class: 'rsearch-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'rsearch-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = 'mid 把区间切两半，至少一半有序 —— 在有序半查值域，就知道 target 在哪边'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'rsearch-banner__box', x: LABEL_X, y: BANNER_TOP, width: BANNER_W, height: BANNER_H, rx: 9 }),
  )
  const segLive = mk('text', { class: 'rsearch-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'rsearch-banner__seg', x: LABEL_X + 240, y: BANNER_TOP + BANNER_H / 2 })
  const ansVal = mk('text', { class: 'rsearch-banner__ans', x: width - LABEL_X - 18, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segLive)
  markLayer.appendChild(segAct)
  markLayer.appendChild(ansVal)

  const cellEls = []
  for (let i = 0; i < n; i += 1) {
    const g = mk('g', { class: 'rsearch-cell' })
    const h = Math.max(14, nums0[i] * scale)
    const box = mk('rect', {
      class: 'rsearch-cell__box',
      x: cx(i) - cellW / 2,
      y: CELL_TOP + CELL_MAX_H - h,
      width: cellW,
      height: h,
      rx: 5,
    })
    g.appendChild(box)
    const val = mk('text', { class: 'rsearch-cell__val', x: cx(i), y: CELL_TOP + CELL_MAX_H - h + 14 })
    val.textContent = String(nums0[i])
    g.appendChild(val)
    const idx = mk('text', { class: 'rsearch-cell__idx', x: cx(i), y: AXIS_Y + 8 })
    idx.textContent = String(i)
    g.appendChild(idx)
    cellLayer.appendChild(g)
    cellEls.push({ g })
  }

  const pins = {}
  for (const key of ['l', 'm', 'r']) {
    const g = mk('g', { class: `rsearch-pin rsearch-pin--${key}` })
    const tag = mk('rect', { class: 'rsearch-pin__tag', x: 0, y: PIN_ROW, width: 22, height: 20, rx: 5 })
    const tri = mk('path', { class: 'rsearch-pin__tag', d: 'M 0 0 L 0 0 L 0 0' })
    const text = mk('text', { class: 'rsearch-pin__text', x: 0, y: PIN_ROW + 10 })
    text.textContent = key
    g.appendChild(tag)
    g.appendChild(tri)
    g.appendChild(text)
    markLayer.appendChild(g)
    pins[key] = { g, tag, tri, text }
  }

  // target 水平虚线
  const tLine = mk('line', { class: 'rsearch-target__line', x1: LEFT - 10, y1: 0, x2: LEFT + rowW + 10, y2: 0 })
  const tText = mk('text', { class: 'rsearch-target__text', x: 0, y: 0 })
  tText.textContent = `target = ${target0}`
  markLayer.appendChild(tLine)
  markLayer.appendChild(tText)

  // 命中金环
  const hitRing = mk('circle', { class: 'rsearch-hit__ring', cx: 0, cy: 0, r: 0 })
  const hitText = mk('text', { class: 'rsearch-hit__text', x: 0, y: 0 })
  markLayer.appendChild(hitRing)
  markLayer.appendChild(hitText)

  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const isDone = step.phase === 'done'
    const live = step.live ?? (step.l !== null ? [step.l, step.r] : null)

    // 有序半（本帧决策依据）
    const orderedSet = new Set()
    if (step.ordered === 'left' && step.mid !== null) {
      for (let i = step.l; i <= step.mid; i += 1) orderedSet.add(i)
    } else if (step.ordered === 'right' && step.mid !== null) {
      for (let i = step.mid; i <= step.r; i += 1) orderedSet.add(i)
    }

    cellEls.forEach((el, i) => {
      const cls = ['rsearch-cell']
      if (live && (i < live[0] || i > live[1])) cls.push('is-out')
      else if (orderedSet.has(i)) cls.push('is-ordered')
      el.g.setAttribute('class', cls.join(' '))
    })

    const place = (key, i) => {
      const p = pins[key]
      if (i === null || i === undefined || i < 0 || i >= n) {
        p.g.style.opacity = '0'
        return
      }
      const x = cx(i)
      p.tag.setAttribute('x', x - 11)
      p.tri.setAttribute('d', `M ${x - 6} ${TRI_TOP} L ${x + 6} ${TRI_TOP} L ${x} ${TRI_TOP + 9} z`)
      p.text.setAttribute('x', x)
      p.g.style.opacity = '1'
    }
    place('l', step.l)
    place('m', isDone ? null : step.mid)
    place('r', isDone ? null : step.r)

    // target 虚线（柱高 ≤ CELL_MAX_H，恒在画面内）
    const ty = yOf(target0)
    tLine.setAttribute('y1', ty)
    tLine.setAttribute('y2', ty)
    tText.setAttribute('x', LEFT + rowW + 12)
    tText.setAttribute('y', ty)

    // 命中 / miss
    if (step.foundIdx !== null && step.foundIdx >= 0) {
      const x = cx(step.foundIdx)
      const h = Math.max(14, nums0[step.foundIdx] * scale)
      hitRing.setAttribute('cx', x)
      hitRing.setAttribute('cy', CELL_TOP + CELL_MAX_H - h / 2)
      hitRing.setAttribute('r', Math.max(16, cellW / 2 + 6))
      hitText.setAttribute('x', x)
      hitText.setAttribute('y', CELL_TOP + CELL_MAX_H - h - 22)
      hitText.textContent = `下标 ${step.foundIdx}`
      hitRing.style.opacity = '1'
      hitText.style.opacity = '1'
    } else {
      hitRing.style.opacity = '0'
      hitText.style.opacity = '0'
    }

    // 横幅
    segLive.textContent = live ? `存活区间 [${live[0]}, ${live[1]}]` : '存活区间 -'
    if (step.phase === 'init') {
      segAct.textContent = `在 ${step.nums.length} 个数里找 target = ${target0}`
    } else if (step.ordered === 'left') {
      segAct.textContent = `左半 [${step.l}, ${step.mid}] 有序，值域 [${step.range[0]}, ${step.range[1]})`
    } else if (step.ordered === 'right') {
      segAct.textContent = `右半 [${step.mid}, ${step.r}] 有序，值域 (${step.range[0]}, ${step.range[1]}]`
    } else if (isDone && step.foundIdx !== null && step.foundIdx >= 0) {
      segAct.textContent = '命中'
    } else if (isDone) {
      segAct.textContent = '区间空了，不存在'
    } else {
      segAct.textContent = ''
    }
    const miss = isDone && (step.foundIdx === null || step.foundIdx < 0)
    ansVal.textContent = miss ? '-1' : step.foundIdx !== null && step.foundIdx >= 0 ? `下标 ${step.foundIdx}` : '?'
    ansVal.setAttribute('class', miss ? 'rsearch-banner__ans is-miss' : 'rsearch-banner__ans')

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
      delete host.dataset.rsMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
