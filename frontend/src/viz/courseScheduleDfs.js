/**
 * courseScheduleDfs.js — 「课程表」(LC 207/210) DFS 三色标记的 SVG 渲染层。
 *
 * 布局：上方 = 课程图（白色 = 没访问 / 灰色 = 递归栈里 / 黑色 = 已确认安全；
 * 灰色回边描红）；下方两行 = 递归栈与后序 post；横幅 + 底部状态行。
 *
 * 与其他动画骨架一致：模块级 STYLE_ID + ensureStyles()，dataset 幂等守卫，
 * createPlayer + jumpTo，IntersectionObserver 自动播放。
 */

import { buildCourseScheduleDfsSteps } from './courseScheduleDfsSteps.js'
import { COURSE_NODE_R, edgeGeometry, layoutCourses } from './courseLayout.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'coursescheduledfs-styles'

const NOTE_Y = 28
const CHIP_Y = 240
const ORDER_Y = 288
const BANNER_Y = 326
const BANNER_H = 40
const PHASE_Y = 392

const PLAY_MS = 1150

const STYLES = `
.cdf { display: flex; flex-direction: column; gap: 14px; }
.cdf__svg { width: 100%; height: auto; display: block; }

.cdf-note {
  fill: var(--cdf-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cdf-note--r { text-anchor: end; }

.cdf-lbl {
  fill: var(--cdf-muted, #657168); font-size: 11.5px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.cdf-edge { stroke: var(--cdf-line, #c3c9c2); stroke-width: 2; fill: none; }
.cdf-arrow { fill: var(--cdf-line, #c3c9c2); stroke: none; }
.cdf-edge.is-cycle { stroke: var(--cdf-hot, #a45f45); stroke-width: 3.5; }
.cdf-arrow.is-cycle { fill: var(--cdf-hot, #a45f45); }

.cdf-node__circle { stroke: var(--cdf-line, #b9c1b8); stroke-width: 2; fill: var(--cdf-white-fill, #ffffff); }
.cdf-node--gray .cdf-node__circle { fill: var(--cdf-gray, #98a29a); stroke: var(--cdf-gray-stroke, #657168); }
.cdf-node--black .cdf-node__circle { fill: var(--cdf-ink, #1f2a24); stroke: var(--cdf-ink, #1f2a24); }
.cdf-node--cur .cdf-node__circle { stroke: var(--cdf-gold, #c2872f); stroke-width: 3.5; }
.cdf-node--cycle .cdf-node__circle { stroke: var(--cdf-hot, #a45f45); stroke-width: 3.5; }
.cdf-node__num {
  fill: var(--cdf-ink, #1f2a24); font-size: 17px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cdf-node--gray .cdf-node__num, .cdf-node--black .cdf-node__num { fill: #ffffff; }

.cdf-chip__box { fill: var(--cdf-fill, #ffffff); stroke: var(--cdf-line, #c3c9c2); stroke-width: 1.5; }
.cdf-chip__val {
  fill: var(--cdf-ink, #1f2a24); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.cdf-chip.is-gray .cdf-chip__box { fill: var(--cdf-gray, #98a29a); stroke: var(--cdf-gray-stroke, #657168); stroke-width: 2; }
.cdf-chip.is-gray .cdf-chip__val { fill: #ffffff; }
.cdf-chip.is-post .cdf-chip__box { fill: var(--cdf-ok-fill, #eef5f1); stroke: var(--cdf-ok, #3f6b57); stroke-width: 2; }
.cdf-chip.is-post .cdf-chip__val { fill: var(--cdf-ok, #3f6b57); }
.cdf-chip.is-rev .cdf-chip__box { fill: var(--cdf-gold-fill, #fdf3e3); stroke: var(--cdf-gold, #c2872f); stroke-width: 2; }
.cdf-chip.is-rev .cdf-chip__val { fill: var(--cdf-gold, #c2872f); }
.cdf-empty {
  fill: var(--cdf-dim, #9aa39c); font-size: 12px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.cdf-banner__box {
  fill: var(--cdf-banner, #f4f3ef); stroke: var(--cdf-line, #c3c9c2); stroke-width: 1.5;
}
.cdf-banner__text {
  fill: var(--cdf-hot, #a45f45); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cdf-banner__text.is-ok { fill: var(--cdf-ok, #3f6b57); }

.cdf-phase__text {
  fill: var(--cdf-muted, #657168); font-size: 13px; font-weight: 600;
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
export function mountCourseScheduleDfs(host, options = {}) {
  if (!host || host.dataset.courseScheduleDfsMounted === '1') return { destroy() {} }
  host.dataset.courseScheduleDfsMounted = '1'
  ensureStyles()

  const steps = buildCourseScheduleDfsSteps(options)
  const autoplay = options.autoplay !== false
  const { numCourses, edges } = steps[0]

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz cdf'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg cdf__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '课程表 LC207 DFS 三色标记推演动画',
  })
  stage.appendChild(svgRoot)

  const edgeLayer = mk('g', {})
  const nodeLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(edgeLayer, nodeLayer, markLayer)

  const note = mk('text', { class: 'cdf-note', x: 26, y: NOTE_Y })
  note.textContent = '白 = 没访问 · 灰 = 递归栈里 · 黑 = 已确认安全（灰色回边 = 环）'
  markLayer.appendChild(note)
  const goal = mk('text', { class: 'cdf-note cdf-note--r', x: width - 26, y: NOTE_Y })
  goal.textContent = `${numCourses} 门课 · ${edges.length} 条边`
  markLayer.appendChild(goal)

  // ── 布局与边 ──
  const { positions } = layoutCourses(numCourses, edges)
  const edgeEls = edges.map(([from, to]) => {
    const geo = edgeGeometry(positions[from], positions[to], COURSE_NODE_R)
    const line = mk('line', { class: 'cdf-edge', x1: geo.x1, y1: geo.y1, x2: geo.x2, y2: geo.y2 })
    const head = mk('polygon', { class: 'cdf-arrow', points: geo.head })
    edgeLayer.append(line, head)
    return { line, head, from, to }
  })

  // ── 节点 ──
  const nodeEls = []
  for (let v = 0; v < numCourses; v += 1) {
    const { x, y } = positions[v]
    const g = mk('g', { class: 'cdf-node' })
    g.appendChild(mk('circle', { class: 'cdf-node__circle', cx: x, cy: y, r: COURSE_NODE_R }))
    const num = mk('text', { class: 'cdf-node__num', x, y })
    num.textContent = String(v)
    g.appendChild(num)
    nodeLayer.appendChild(g)
    nodeEls.push(g)
  }

  // ── 栈 / 后序 行 ──
  const chipW = 34
  const chipH = 26
  const chipGap = 6
  const chipX0 = 148

  const stackLabel = mk('text', { class: 'cdf-lbl', x: 26, y: CHIP_Y + chipH / 2 })
  stackLabel.textContent = '递归栈 stack'
  const postLabel = mk('text', { class: 'cdf-lbl', x: 26, y: ORDER_Y + chipH / 2 })
  postLabel.textContent = '后序 post'
  markLayer.append(stackLabel, postLabel)

  const stackEmpty = mk('text', { class: 'cdf-empty', x: chipX0, y: CHIP_Y + chipH / 2 })
  stackEmpty.textContent = '（空）'
  markLayer.appendChild(stackEmpty)

  const POOL = 16
  const stackChips = []
  const postChips = []
  for (let i = 0; i < POOL; i += 1) {
    const x = chipX0 + i * (chipW + chipGap)
    const gs = mk('g', { class: 'cdf-chip is-gray' })
    gs.appendChild(mk('rect', { class: 'cdf-chip__box', x, y: CHIP_Y, width: chipW, height: chipH, rx: 6 }))
    const vs = mk('text', { class: 'cdf-chip__val', x: x + chipW / 2, y: CHIP_Y + chipH / 2 })
    gs.appendChild(vs)
    markLayer.appendChild(gs)
    stackChips.push({ g: gs, val: vs })

    const gp = mk('g', { class: 'cdf-chip is-post' })
    gp.appendChild(mk('rect', { class: 'cdf-chip__box', x, y: ORDER_Y, width: chipW, height: chipH, rx: 6 }))
    const vp = mk('text', { class: 'cdf-chip__val', x: x + chipW / 2, y: ORDER_Y + chipH / 2 })
    gp.appendChild(vp)
    markLayer.appendChild(gp)
    postChips.push({ g: gp, val: vp })
  }

  // ── 横幅 ──
  markLayer.appendChild(mk('rect', { class: 'cdf-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'cdf-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  const phaseText = mk('text', { class: 'cdf-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const stackSet = new Set(step.stack)

    // 边：cycle 帧把 回边 描红
    edgeEls.forEach(({ line, head, from, to }) => {
      const isCycle =
        step.phase === 'cycle' && step.cur === from && step.target === to
      const cls = isCycle ? ' is-cycle' : ''
      line.setAttribute('class', `cdf-edge${cls}`)
      head.setAttribute('class', `cdf-arrow${cls}`)
    })

    // 节点：颜色按快照；cur 金环；cycle 帧的 target 描红
    nodeEls.forEach((g, v) => {
      const cls = ['cdf-node']
      if (step.color[v] === 1) cls.push('cdf-node--gray')
      else if (step.color[v] === 2) cls.push('cdf-node--black')
      if ((step.phase === 'enter' || step.phase === 'finish') && step.cur === v) cls.push('cdf-node--cur')
      if (step.phase === 'cycle' && (step.cur === v || step.target === v)) cls.push('cdf-node--cycle')
      if (step.phase === 'done' && step.target === v) cls.push('cdf-node--cycle')
      g.setAttribute('class', cls.join(' '))
    })

    // 递归栈
    const stackList = step.stack
    stackEmpty.style.display = stackList.length === 0 ? '' : 'none'
    const shownS = Math.min(stackList.length, stackChips.length)
    stackChips.forEach((chip, i) => {
      if (i >= shownS) {
        chip.g.style.display = 'none'
        return
      }
      chip.g.style.display = ''
      chip.val.textContent = String(stackList[i])
      chip.g.setAttribute(
        'class',
        'cdf-chip is-gray' + (i === shownS - 1 ? ' is-rev' : ''),
      )
    })

    // 后序
    const postList = step.post
    const shownP = Math.min(postList.length, postChips.length)
    postChips.forEach((chip, i) => {
      if (i >= shownP) {
        chip.g.style.display = 'none'
        return
      }
      chip.g.style.display = ''
      chip.val.textContent = String(postList[i])
      chip.g.setAttribute('class', 'cdf-chip is-post')
    })

    // 横幅
    if (step.phase === 'init') {
      banner.textContent = '全白出发：碰到白 → 变灰压栈；碰到灰 → 环'
      banner.setAttribute('class', 'cdf-banner__text')
    } else if (step.phase === 'enter') {
      banner.textContent = `课程 ${step.cur} 白 → 灰，压栈（深度 ${step.stack.length}）`
      banner.setAttribute('class', 'cdf-banner__text')
    } else if (step.phase === 'finish') {
      banner.textContent = `课程 ${step.cur} 灰 → 黑，追加后序 → post = [${step.post.join(', ')}]`
      banner.setAttribute('class', 'cdf-banner__text')
    } else if (step.phase === 'cycle') {
      banner.textContent = `发现灰色回边：${step.cur} → ${step.target}（${step.target} 还在递归栈里）= 有环`
      banner.setAttribute('class', 'cdf-banner__text')
    } else if (step.answer?.possible) {
      banner.textContent = `后序反转 = [${step.answer.order.join(', ')}]（合法拓扑序）`
      banner.setAttribute('class', 'cdf-banner__text is-ok')
    } else {
      banner.textContent = '返回 false：出现过灰色回边，存在环'
      banner.setAttribute('class', 'cdf-banner__text')
    }

    // 状态行
    if (step.phase === 'init') phaseText.textContent = '灰 = 还没有探完邻居的节点；灰边 = 指回递归栈 = 环'
    else if (step.phase === 'enter') phaseText.textContent = '白 → 灰：开始探索这门课的后继'
    else if (step.phase === 'finish') phaseText.textContent = '灰 → 黑：后继全部安全，追加后序（反转即拓扑序）'
    else if (step.phase === 'cycle') phaseText.textContent = '灰色回边 = 环 —— 与 Kahn 的「出队数量 < 课程数」是同一件事'
    else if (step.answer?.possible) phaseText.textContent = '黑色邻居只跳过（另一条安全的路），只有灰色回边才算环'
    else phaseText.textContent = '有环 ⇒ 不存在拓扑序 ⇒ 返回 false'

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
      delete host.dataset.courseScheduleDfsMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
