/**
 * courseSchedule.js — 「课程表」(LC 207/210) Kahn（入度表 + 队列）的 SVG 渲染层。
 *
 * 布局：上方 = 课程图（圆点 = 课程，箭头 = 先修 → 后修；节点带当前入度角标）；
 * 下方两行 = 队列（0 入度的课）与 order（已确定的修课顺序）；
 * 横幅 + 底部状态行。
 *
 * 与其他动画骨架一致：模块级 STYLE_ID + ensureStyles()，dataset 幂等守卫，
 * createPlayer + jumpTo，IntersectionObserver 自动播放。
 */

import { buildCourseScheduleSteps } from './courseScheduleSteps.js'
import { COURSE_NODE_R, edgeGeometry, layoutCourses } from './courseLayout.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'courseschedule-styles'

const NOTE_Y = 28
const CHIP_Y = 240
const ORDER_Y = 288
const BANNER_Y = 326
const BANNER_H = 40
const PHASE_Y = 392

const PLAY_MS = 1150

const STYLES = `
.csv { display: flex; flex-direction: column; gap: 14px; }
.csv__svg { width: 100%; height: auto; display: block; }

.csv-note {
  fill: var(--csv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.csv-note--r { text-anchor: end; }

.csv-lbl {
  fill: var(--csv-muted, #657168); font-size: 11.5px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.csv-edge { stroke: var(--csv-line, #c3c9c2); stroke-width: 2; fill: none; }
.csv-arrow { fill: var(--csv-line, #c3c9c2); stroke: none; }
.csv-edge.is-relaxing { stroke: var(--csv-gold, #c2872f); stroke-width: 2.5; }
.csv-arrow.is-relaxing { fill: var(--csv-gold, #c2872f); }

.csv-node__circle { stroke: var(--csv-line, #b9c1b8); stroke-width: 2; fill: var(--csv-fill, #ffffff); }
.csv-node--done .csv-node__circle { fill: var(--csv-done, #79a892); stroke: var(--csv-done-stroke, #3f6b57); }
.csv-node--queued .csv-node__circle { fill: var(--csv-queued, #fdf3e3); stroke: var(--csv-gold, #c2872f); }
.csv-node--cur .csv-node__circle { stroke: var(--csv-gold, #c2872f); stroke-width: 3.5; }
.csv-node--stuck .csv-node__circle { stroke: var(--csv-hot, #a45f45); stroke-width: 3.5; }
.csv-node__num {
  fill: var(--csv-ink, #1f2a24); font-size: 17px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.csv-node--done .csv-node__num { fill: #ffffff; }
.csv-node--queued .csv-node__num { fill: var(--csv-gold, #c2872f); }

.csv-badge__circle {
  fill: var(--csv-fill, #ffffff); stroke: var(--csv-line, #b9c1b8); stroke-width: 1.5;
}
.csv-badge--zero .csv-badge__circle { stroke: var(--csv-ok, #3f6b57); stroke-width: 2.5; }
.csv-badge--hot .csv-badge__circle { fill: var(--csv-gold-fill, #fdf3e3); stroke: var(--csv-gold, #c2872f); stroke-width: 2.5; }
.csv-badge__num {
  fill: var(--csv-ink, #1f2a24); font-size: 11px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.csv-badge--zero .csv-badge__num { fill: var(--csv-ok, #3f6b57); }
.csv-badge--hot .csv-badge__num { fill: var(--csv-gold, #c2872f); }

.csv-chip__box { fill: var(--csv-fill, #ffffff); stroke: var(--csv-line, #c3c9c2); stroke-width: 1.5; }
.csv-chip__val {
  fill: var(--csv-ink, #1f2a24); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.csv-chip.is-front .csv-chip__box { fill: var(--csv-gold-fill, #fdf3e3); stroke: var(--csv-gold, #c2872f); stroke-width: 2.5; }
.csv-chip.is-front .csv-chip__val { fill: var(--csv-gold, #c2872f); }
.csv-chip.is-done .csv-chip__box { fill: var(--csv-ok-fill, #eef5f1); stroke: var(--csv-ok, #3f6b57); stroke-width: 2; }
.csv-chip.is-done .csv-chip__val { fill: var(--csv-ok, #3f6b57); }
.csv-empty {
  fill: var(--csv-dim, #9aa39c); font-size: 12px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.csv-banner__box {
  fill: var(--csv-banner, #f4f3ef); stroke: var(--csv-line, #c3c9c2); stroke-width: 1.5;
}
.csv-banner__text {
  fill: var(--csv-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.csv-banner__text.is-ok { fill: var(--csv-ok, #3f6b57); }

.csv-phase__text {
  fill: var(--csv-muted, #657168); font-size: 13px; font-weight: 600;
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
 * @param {{ numCourses?: number, prerequisites?: number[][], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountCourseSchedule(host, options = {}) {
  if (!host || host.dataset.courseScheduleMounted === '1') return { destroy() {} }
  host.dataset.courseScheduleMounted = '1'
  ensureStyles()

  const steps = buildCourseScheduleSteps(options)
  const autoplay = options.autoplay !== false
  const { numCourses, edges } = steps[0]

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz csv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg csv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '课程表 LC207 Kahn 拓扑排序推演动画',
  })
  stage.appendChild(svgRoot)

  const edgeLayer = mk('g', {})
  const nodeLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(edgeLayer, nodeLayer, markLayer)

  const note = mk('text', { class: 'csv-note', x: 26, y: NOTE_Y })
  note.textContent = '入度表 + 队列：0 入度的课开修，修完就松开它的后继（角标 = 当前入度）'
  markLayer.appendChild(note)
  const goal = mk('text', { class: 'csv-note csv-note--r', x: width - 26, y: NOTE_Y })
  goal.textContent = `${numCourses} 门课 · ${edges.length} 条边`
  markLayer.appendChild(goal)

  // ── 布局与边 ──
  const { positions } = layoutCourses(numCourses, edges)
  const edgeEls = edges.map(([from, to]) => {
    const geo = edgeGeometry(positions[from], positions[to], COURSE_NODE_R)
    const line = mk('line', { class: 'csv-edge', x1: geo.x1, y1: geo.y1, x2: geo.x2, y2: geo.y2 })
    const head = mk('polygon', { class: 'csv-arrow', points: geo.head })
    edgeLayer.append(line, head)
    return { line, head, from }
  })

  // ── 节点 ──
  const nodeEls = []
  for (let v = 0; v < numCourses; v += 1) {
    const { x, y } = positions[v]
    const g = mk('g', { class: 'csv-node' })
    g.appendChild(mk('circle', { class: 'csv-node__circle', cx: x, cy: y, r: COURSE_NODE_R }))
    const num = mk('text', { class: 'csv-node__num', x, y })
    num.textContent = String(v)
    g.appendChild(num)
    nodeLayer.appendChild(g)

    // 入度角标（右上角）
    const badge = mk('g', { class: 'csv-badge' })
    badge.appendChild(mk('circle', { class: 'csv-badge__circle', cx: x + 19, cy: y - 19, r: 11 }))
    const badgeNum = mk('text', { class: 'csv-badge__num', x: x + 19, y: y - 19 })
    badge.appendChild(badgeNum)
    markLayer.appendChild(badge)
    nodeEls.push({ g, badgeG: badge, badgeNum })
  }

  // ── 队列 / order 行 ──
  const chipW = 34
  const chipH = 26
  const chipGap = 6
  const chipX0 = 148

  const queueLabel = mk('text', { class: 'csv-lbl', x: 26, y: CHIP_Y + chipH / 2 })
  queueLabel.textContent = '队列 queue'
  const orderLabel = mk('text', { class: 'csv-lbl', x: 26, y: ORDER_Y + chipH / 2 })
  orderLabel.textContent = '顺序 order'
  markLayer.append(queueLabel, orderLabel)

  const queueEmpty = mk('text', { class: 'csv-empty', x: chipX0, y: CHIP_Y + chipH / 2 })
  queueEmpty.textContent = '（空 —— 没有 0 入度的课了）'
  markLayer.appendChild(queueEmpty)

  const POOL = 16
  const queueChips = []
  const orderChips = []
  for (let i = 0; i < POOL; i += 1) {
    const x = chipX0 + i * (chipW + chipGap)
    const gq = mk('g', { class: 'csv-chip' })
    gq.appendChild(mk('rect', { class: 'csv-chip__box', x, y: CHIP_Y, width: chipW, height: chipH, rx: 6 }))
    const vq = mk('text', { class: 'csv-chip__val', x: x + chipW / 2, y: CHIP_Y + chipH / 2 })
    gq.appendChild(vq)
    markLayer.appendChild(gq)
    queueChips.push({ g: gq, val: vq })

    const go = mk('g', { class: 'csv-chip is-done' })
    go.appendChild(mk('rect', { class: 'csv-chip__box', x, y: ORDER_Y, width: chipW, height: chipH, rx: 6 }))
    const vo = mk('text', { class: 'csv-chip__val', x: x + chipW / 2, y: ORDER_Y + chipH / 2 })
    go.appendChild(vo)
    markLayer.appendChild(go)
    orderChips.push({ g: go, val: vo })
  }

  // ── 横幅 ──
  markLayer.appendChild(mk('rect', { class: 'csv-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'csv-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  const phaseText = mk('text', { class: 'csv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const queueSet = new Set(step.queue)
    const orderSet = new Set(step.order)
    const stuckSet = new Set(step.stuck)
    const relaxedSet = new Set(step.relaxed.map(([v]) => v))

    // 边：cur 的出边高亮（本帧被松弛的）
    edgeEls.forEach(({ line, head, from }) => {
      const isRelaxing = step.phase === 'pop' && step.cur === from
      const cls = isRelaxing ? ' is-relaxing' : ''
      line.setAttribute('class', `csv-edge${cls}`)
      head.setAttribute('class', `csv-arrow${cls}`)
    })

    // 节点
    nodeEls.forEach((el, v) => {
      const cls = ['csv-node']
      if (orderSet.has(v)) cls.push('csv-node--done')
      else if (queueSet.has(v)) cls.push('csv-node--queued')
      if (step.phase === 'pop' && step.cur === v) cls.push('csv-node--cur')
      if (step.phase === 'done' && stuckSet.has(v)) cls.push('csv-node--stuck')
      el.g.setAttribute('class', cls.join(' '))
      el.badgeNum.textContent = String(step.indegree[v])
      const bcls = ['csv-badge']
      if (step.indegree[v] === 0) bcls.push('csv-badge--zero')
      if (relaxedSet.has(v)) bcls.push('csv-badge--hot')
      el.badgeG.setAttribute('class', bcls.join(' '))
    })

    // 队列
    const frontier = step.queue
    queueEmpty.style.display = frontier.length === 0 ? '' : 'none'
    const shownQ = Math.min(frontier.length, queueChips.length)
    queueChips.forEach((chip, i) => {
      if (i >= shownQ) {
        chip.g.style.display = 'none'
        return
      }
      chip.g.style.display = ''
      chip.val.textContent = String(frontier[i])
      chip.g.setAttribute('class', 'csv-chip' + (i === 0 ? ' is-front' : ''))
    })

    // order
    const shownO = Math.min(step.order.length, orderChips.length)
    orderChips.forEach((chip, i) => {
      if (i >= shownO) {
        chip.g.style.display = 'none'
        return
      }
      chip.g.style.display = ''
      chip.val.textContent = String(step.order[i])
      chip.g.setAttribute('class', 'csv-chip is-done')
    })

    // 横幅
    if (step.phase === 'init') {
      banner.textContent = `全部 0 入度的课入队：{${step.queue.join(', ')}}`
      banner.setAttribute('class', 'csv-banner__text')
    } else if (step.phase === 'pop') {
      const relaxedText = step.relaxed.length
        ? `，后继 ${step.relaxed.map(([v, d]) => `${v}(${d})`).join('、')}`
        : ''
      banner.textContent =
        `修完第 ${step.order.length} 门：课程 ${step.cur}${relaxedText}` +
        (step.enqueued.length ? `　→ 入队 {${step.enqueued.join(', ')}}` : '')
      banner.setAttribute('class', 'csv-banner__text')
    } else if (step.answer?.possible) {
      banner.textContent = `答案 = [${step.answer.order.join(', ')}]（合法拓扑序）`
      banner.setAttribute('class', 'csv-banner__text is-ok')
    } else {
      banner.textContent = `返回 false：课程 {${step.stuck.join(', ')}} 互相等待，修不完`
      banner.setAttribute('class', 'csv-banner__text')
    }

    // 状态行
    if (step.phase === 'init') phaseText.textContent = '入度 = 还有几门「没修的先修课」；0 入度 = 现在就能修'
    else if (step.phase === 'pop') phaseText.textContent = '取出一门课 → 它的后继入度 −1，减到 0 的立刻入队'
    else if (step.answer?.possible) phaseText.textContent = '出队数量 == 课程数 ⇔ 没有环 ⇔ 能修完所有课'
    else phaseText.textContent = '出队数量 < 课程数：剩下的课在环里（或等环），返回 false'

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
      delete host.dataset.courseScheduleMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
