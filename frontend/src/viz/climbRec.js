/**
 * climbRec.js — 「爬楼梯」(LC 70) 朴素递归树的 SVG 渲染层。
 *
 * 布局不用满二叉树槽位法（这棵树严重偏左，2^depth 会爆宽）：
 * 叶子按 DFS 遇到的先后分配列，内部节点取两个孩子的中点 —— 树宽 = 叶子数 x 步长。
 * n=6 时 13 个叶子，LEAF_STEP=48 恰好铺满 680 宽。
 *
 * 通用坑：A（CSS 变量兜底）/ K（边、圆、标签分三层画）。
 */

import { buildClimbRecSteps } from './climbRecSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'climbrec-styles'
const PLAY_MS = 620

const STYLES = `
.climbrec { display: flex; flex-direction: column; gap: 14px; }
.climbrec__svg { width: 100%; height: auto; display: block; }

.climbrec-note {
  fill: var(--climbrec-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climbrec-banner__box {
  fill: var(--climbrec-banner, #f4f3ef);
  stroke: var(--climbrec-line, #c3c9c2);
  stroke-width: 1.5;
}
.climbrec-banner__seg {
  fill: var(--climbrec-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.climbrec-banner__val {
  fill: var(--climbrec-bad, #b3452e);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climbrec-edge {
  stroke: var(--climbrec-line, #c3c9c2);
  stroke-width: 1.5;
  fill: none;
}
.climbrec-edge.is-on { stroke: var(--climbrec-dim2, #aab3ab); }

.climbrec-node__circle {
  fill: var(--climbrec-fill, #ffffff);
  stroke: var(--climbrec-line, #c3c9c2);
  stroke-width: 1.5;
  opacity: 0;
}
.climbrec-node__text {
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.climbrec-node.is-on .climbrec-node__circle { opacity: 1; }
.climbrec-node.is-on .climbrec-node__text { opacity: 1; }
/* 首次出现的值：绿 */
.climbrec-node.is-new .climbrec-node__circle {
  stroke: var(--climbrec-ok, #3f6b57);
  fill: var(--climbrec-ok-fill, #eef5f1);
}
.climbrec-node.is-new .climbrec-node__text { fill: var(--climbrec-ok, #3f6b57); }
/* 重复子问题：红 —— 这张图的主角 */
.climbrec-node.is-dup .climbrec-node__circle {
  stroke: var(--climbrec-bad, #b3452e);
  stroke-width: 2.5;
  fill: var(--climbrec-bad-fill, #f9ece8);
}
.climbrec-node.is-dup .climbrec-node__text { fill: var(--climbrec-bad, #b3452e); }
/* 本帧的主角：橙 + 外环（外环挂在 labelLayer，不在节点的 g 里，所以用 .is-on 单独控制） */
.climbrec-node.is-cur .climbrec-node__circle { stroke: var(--climbrec-hot, #a45f45); stroke-width: 3.5; }
.climbrec-node__ring {
  opacity: 0;
  fill: none;
  stroke: var(--climbrec-hot, #a45f45);
  stroke-width: 2;
  stroke-dasharray: 4 3;
}
.climbrec-node__ring.is-on { opacity: 1; }

.climbrec-stats {
  fill: var(--climbrec-ink, #1f2a24);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climbrec-stack {
  fill: var(--climbrec-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.climbrec-phase__text {
  fill: var(--climbrec-muted, #657168);
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

/** 按状态机同款前序 DFS 重建树形，叶子分配列、内部节点取孩子中点。 */
function buildGeometry(n) {
  const nodes = [] // { idx, value, depth, parent, x, y, col }
  let leafCol = 0

  const walk = (value, depth, parent) => {
    const idx = nodes.length
    nodes.push({ idx, value, depth, parent, x: 0, y: 0, col: null })
    if (value >= 2) {
      walk(value - 1, depth + 1, idx)
      walk(value - 2, depth + 1, idx)
    } else {
      nodes[idx].col = leafCol
      leafCol += 1
    }
    return idx
  }
  walk(n, 0, -1)

  // 后序一遍：内部节点的列 = 两个孩子的列中点
  const setCol = (idx) => {
    const nd = nodes[idx]
    if (nd.col !== null) return nd.col
    const kids = nodes.filter((x) => x.parent === idx)
    nd.col = (setCol(kids[0].idx) + setCol(kids[1].idx)) / 2
    return nd.col
  }
  setCol(0)

  const leafCount = leafCol
  const W = 680
  const MARGIN = 30
  const LEAF_STEP = Math.max(30, Math.min(48, (W - MARGIN * 2) / leafCount))
  const LEVEL_GAP = Math.min(70, 340 / Math.max(1, Math.max(...nodes.map((x) => x.depth))))
  const TOP = 108
  const R = Math.max(11, Math.min(17, LEAF_STEP / 2.9))

  for (const nd of nodes) {
    nd.x = MARGIN + nd.col * LEAF_STEP + LEAF_STEP / 2
    nd.y = TOP + nd.depth * LEVEL_GAP
  }
  const treeBottom = TOP + Math.max(...nodes.map((x) => x.depth)) * LEVEL_GAP + R
  return { nodes, W, R, treeBottom, leafCount, LEAF_STEP }
}

function mount(host, options = {}) {
  if (!host || host.dataset.climbRecMounted === '1') return { destroy() {} }
  host.dataset.climbRecMounted = '1'
  ensureStyles()

  const steps = buildClimbRecSteps(options)
  const s0 = steps[0]
  const geo = buildGeometry(s0.n)
  const byIdx = new Map(geo.nodes.map((nd) => [nd.idx, nd]))

  const W = geo.W
  const BANNER_TOP = 38
  const BANNER_H = 40
  const STATS_Y = geo.treeBottom + 34
  const STACK_Y = STATS_Y + 26
  const PHASE_Y = STACK_Y + 30
  const height = PHASE_Y + 22

  const rootEl = document.createElement('div')
  rootEl.className = 'viz climbrec'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)
  const descEl = makeDesc()

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg climbrec__svg',
    viewBox: `0 0 ${W} ${height}`,
    role: 'img',
    'aria-label': '爬楼梯 朴素递归树展开动画',
  })
  // 三层：边 -> 节点 -> 标签（坑 K）
  const edgeLayer = mk('g', { class: 'climbrec-edges' })
  const nodeLayer = mk('g', { class: 'climbrec-nodes' })
  const labelLayer = mk('g', { class: 'climbrec-labels' })
  svgRoot.appendChild(edgeLayer)
  svgRoot.appendChild(nodeLayer)
  svgRoot.appendChild(labelLayer)
  stage.appendChild(svgRoot)

  const note = mk('text', { class: 'climbrec-note', x: 30, y: 22 })
  note.textContent = `f(k) = f(k-1) + f(k-2)，不带记忆化 —— 前序 DFS 的真实执行顺序`
  labelLayer.appendChild(note)

  labelLayer.appendChild(
    mk('rect', { class: 'climbrec-banner__box', x: 30, y: BANNER_TOP, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'climbrec-banner__seg', x: 46, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'climbrec-banner__seg', x: 176, y: BANNER_TOP + BANNER_H / 2 })
  const segVal = mk('text', { class: 'climbrec-banner__val', x: W - 46, y: BANNER_TOP + BANNER_H / 2 })
  labelLayer.appendChild(segRound)
  labelLayer.appendChild(segAct)
  labelLayer.appendChild(segVal)

  // 边
  const edgeEls = geo.nodes.map((nd) => {
    const el = mk('path', { class: 'climbrec-edge', d: '' })
    edgeLayer.appendChild(el)
    return el
  })

  // 节点（圆 + 数字 + 当前帧外环）
  const nodeEls = geo.nodes.map((nd) => {
    const g = mk('g', { class: 'climbrec-node' })
    const circle = mk('circle', { class: 'climbrec-node__circle', cx: nd.x, cy: nd.y, r: geo.R })
    const text = mk('text', {
      class: 'climbrec-node__text',
      x: nd.x,
      y: nd.y,
      style: `font-size: ${Math.round(geo.R * 1.15)}px`,
    })
    text.textContent = String(nd.value)
    const ring = mk('circle', { class: 'climbrec-node__ring', cx: nd.x, cy: nd.y, r: geo.R + 5 })
    g.appendChild(circle)
    g.appendChild(text)
    nodeLayer.appendChild(g)
    ring.remove()
    labelLayer.appendChild(ring)
    return { g, circle, text, ring }
  })

  const statsText = mk('text', { class: 'climbrec-stats', x: W / 2, y: STATS_Y })
  labelLayer.appendChild(statsText)
  const stackText = mk('text', { class: 'climbrec-stack', x: 30, y: STACK_Y })
  labelLayer.appendChild(stackText)
  const phaseText = mk('text', { class: 'climbrec-phase__text', x: W / 2, y: PHASE_Y })
  labelLayer.appendChild(phaseText)

  function paint(_index, step) {
    if (!step) return
    const isDone = step.phase === 'done'
    const cur = step.node

    // 边：父节点已出现且孩子已出现才亮
    edgeEls.forEach((el, idx) => {
      const nd = geo.nodes[idx]
      const parentIn = nd.parent >= 0 && step.revealed.length > nd.parent
      const childIn = step.revealed.length > idx
      el.classList.toggle('is-on', parentIn && childIn)
      if (parentIn && childIn) {
        const p = byIdx.get(nd.parent)
        el.setAttribute('d', `M ${p.x} ${p.y + geo.R} L ${nd.x} ${nd.y - geo.R}`)
      }
    })

    nodeEls.forEach((el, idx) => {
      const on = step.revealed.length > idx
      const cls = ['climbrec-node']
      if (on) {
        cls.push('is-on')
        const meta = step.revealed[idx]
        cls.push(meta.dup ? 'is-dup' : 'is-new')
        if (cur && idx === cur.idx) cls.push('is-cur')
      }
      el.g.setAttribute('class', cls.join(' '))
      el.ring.classList.remove('is-on')
    })

    // 当前帧外环单独控制（ring 挂在 labelLayer，CSS 选择器够不到节点的 g）
    if (cur) nodeEls[cur.idx].ring.classList.add('is-on')

    const statsText2 = statsText
    statsText2.textContent =
      `已调用 ${step.calls} 次，其中重复 ${step.dupCalls} 次，不同的 k 只有 ${step.distinct} 个`

    // 调用栈
    if (cur) {
      const chain = [s0.n]
      let v = s0.n
      for (const side of cur.path) {
        v += side === 'L' ? -1 : -2
        chain.push(v)
      }
      stackText.textContent = `调用栈：${chain.join(' -> ')}`
      stackText.setAttribute('opacity', '1')
    } else {
      stackText.setAttribute('opacity', '0')
    }

    if (isDone) {
      segRound.textContent = `f(${s0.n}) 展开`
      segAct.textContent = `${step.calls} 个节点里只有 ${step.distinct} 个不同的 k`
      segVal.textContent = `重复 ${step.dupCalls} 次`
    } else {
      segRound.textContent = `第 ${step.calls} 次调用`
      segAct.textContent = cur && cur.dup ? `f(${cur.value}) 是重复子问题` : `f(${cur ? cur.value : ''}) 第一次出现`
      segVal.textContent = `重复 ${step.dupCalls} 次`
    }

    phaseText.textContent = isDone
      ? '加一个 memo 数组，同样的信息只需要 n+1 个格子 —— 这就是从 2^n 到 O(n) 的全部内容。'
      : '每棵重复的子树都要从头重长一遍 —— 计数是乘性的，这就是 2^n 的来源。'

    renderRichText(descEl, step.desc)
  }

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
    intervalMs: PLAY_MS,
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
      delete host.dataset.climbRecMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

/**
 * 朴素递归树（默认 n=6）。
 * @param {HTMLElement} host
 * @param {{ n?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountClimbRec(host, options = {}) {
  return mount(host, options)
}
