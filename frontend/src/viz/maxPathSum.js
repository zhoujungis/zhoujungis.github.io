/**
 * maxPathSum.js — 「二叉树中的最大路径和」(LeetCode 124) 推演动画的 SVG 渲染层。
 *
 * 逻辑全在 maxPathSumSteps.js 里，这里只负责把一帧快照画出来。要画三块：
 *
 *   1. 树（主体）      —— 每个节点显示"向上汇报的贡献值 gain"，
 *                         已经算完的节点用颜色区分（正贡献 / 被剪掉的负贡献）
 *   2. 最优路径横幅    —— 当前 best 对应的那条「拱形路径」高亮 + 数值
 *   3. 说明文字 + 控制条
 *
 * LC 124 和 LC 236 的画法差异：236 的重点是「递归栈有多深」，所以要画一叠栈帧；
 * 124 的重点是「每个节点同时算两个量」——向上汇报的 gain（一条胳膊）和更新答案的
 * through（两条胳膊的拱顶）。所以这里不画栈，改成：
 *   · 节点上方挂 gain 小标签（冒泡上来的贡献值）
 *   · 用一条高亮的「拱形路径」把当前 best 画出来，直观展示"拱顶"在哪
 *   · 被 max(gain, 0) 剪掉的负贡献，节点描虚线表示"此路不通"
 *
 * 树布局沿用 levelOrder.js 的「满二叉树槽位法」（见那边注释）。
 *
 * ⚠️ 所有 CSS 变量都带字面量兜底：viz-shot.mjs 会把 SVG 单独序列化，
 *    外层 div 上的变量解析不了，不带兜底整条样式会失效（系列坑 A）。
 */

import { buildMaxPathSumSteps, buildTree } from './maxPathSumSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'mps-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NODE_R = 24
// LEVEL_GAP 要比别的动画大：节点正上方挂着 gain 标签（高 21），
// 父边又要从两行之间斜着穿过去。82 的时候两侧的 gain 标签会被父边压住。
const LEVEL_GAP = 96
const TREE_TOP = 76
const LEAF_STEP = 58

const LABEL_X = 26
const BANNER_TOP_GAP = 40
const BANNER_H = 46

const PLAY_MS = 1250

// 节点状态配色（都带字面量兜底）
const C = {
  idle: '#9aa39c',   // 还没轮到
  visit: '#a45f45',  // 正在处理（栈顶）
  plus: '#3f6b57',   // 贡献值 > 0，留着往上汇报
  zero: '#8a928b',   // 贡献值 <= 0，被 max(gain,0) 剪成 0
  apex: '#c2872f',   // 路径的拱顶（最高点）
}

const STYLES = `
.mps {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.mps__svg { width: 100%; height: auto; display: block; }

/* ── 节点 ─────────────────────────────────────────────────────────────── */
.mps-node__circle {
  fill: var(--mps-fill, #ffffff);
  stroke: var(--mps-line, #9aa39c);
  stroke-width: 2;
}
.mps-node__value {
  fill: var(--mps-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 节点上方挂的「贡献值」小标签 */
.mps-node__gain {
  fill: var(--mps-paper, #f4f2ec);
  stroke: var(--mps-line, #9aa39c);
  stroke-width: 1.5;
}
.mps-node__gain-text {
  fill: var(--mps-ink, #1f2a24);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 拱顶强调环 */
.mps-node__ring {
  fill: none;
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 3.5;
  opacity: 0;
}

.mps-node.is-visit .mps-node__circle {
  stroke: var(--mps-hot, #a45f45);
  stroke-width: 3;
}
.mps-node.is-plus .mps-node__circle {
  fill: var(--mps-ok-fill, #eef5f1);
  stroke: var(--mps-ok, #3f6b57);
  stroke-width: 3;
}
.mps-node.is-zero .mps-node__circle {
  stroke: var(--mps-dim, #b9b9b3);
  stroke-dasharray: 3 3;
}
.mps-node.is-zero .mps-node__value {
  fill: var(--mps-dim, #b9b9b3);
}

/* 「在最优路径上」和「是拱顶」是两件事，必须分开画：
 * 最初把两者合并成同一个 class，结果终帧里 15 / 20 / 7 全戴上金圈，
 * 真正的拱顶 20 反而淹没在里面了。 */
.mps-node.is-onpath .mps-node__circle {
  fill: var(--mps-apex-fill, #fdf3e3);
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 2.5;
}
.mps-node.is-apex .mps-node__ring { opacity: 1; }
.mps-node.is-apex .mps-node__circle {
  fill: var(--mps-apex-fill, #fdf3e3);
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 3.5;
}

/* ── 边 ───────────────────────────────────────────────────────────────── */
.mps-edge { stroke: var(--mps-edge, #8b948c); stroke-width: 2; fill: none; }
/* 两端都在当前路径上 → 实心强调 */
.mps-edge.is-onpath {
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 4;
}
.mps-edge.is-prune { stroke: var(--mps-dim, #b9b9b3); stroke-dasharray: 4 4; }

/* ── 最优路径横幅 ─────────────────────────────────────────────────────── */
.mps-banner__box {
  fill: var(--mps-apex-fill, #fdf3e3);
  stroke: var(--mps-apex, #c2872f);
  stroke-width: 2;
}
.mps-banner__label {
  fill: var(--mps-apex, #c2872f);
  font-size: 12px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mps-banner__value {
  fill: var(--mps-ink, #1f2a24);
  font-size: 20px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mps-banner__path {
  fill: var(--mps-muted, #657168);
  font-size: 12.5px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.mps-empty__text {
  fill: var(--mps-muted, #657168);
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
 * @param {{
 *   values?: (number|null)[],
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 */
export function mountMaxPathSum(host, options = {}) {
  if (!host || host.dataset.mpsMounted === '1') return { destroy() {} }
  host.dataset.mpsMounted = '1'
  ensureStyles()

  const steps = buildMaxPathSumSteps(options)
  const autoplay = options.autoplay !== false

  const values = Array.isArray(options.values) ? options.values : [-10, 9, 20, null, null, 15, 7]
  const { nodes, root } = buildTree(values)
  const valueOf = (id) => (id === null || id === undefined || !nodes[id] ? null : nodes[id].value)

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz mps'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  // ── 空树 ─────────────────────────────────────────────────────────────────
  if (root === -1) {
    const w0 = 620
    const h0 = 120
    const s0 = mk('svg', { class: 'viz__svg mps__svg', viewBox: `0 0 ${w0} ${h0}`, role: 'img' })
    const t0 = mk('text', { class: 'mps-empty__text', x: w0 / 2, y: h0 / 2 })
    t0.textContent = '空树 —— 没有节点，路径和按 0 处理（LeetCode 保证至少一个节点）'
    s0.appendChild(t0)
    stage.appendChild(s0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.mpsMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  // ── 树布局（满二叉树槽位法） ─────────────────────────────────────────────
  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0)
  const pathOf = new Map()
  pathOf.set(root, [])
  for (const node of nodes) {
    if (node.parent === -1) continue
    pathOf.set(node.id, [...(pathOf.get(node.parent) ?? []), node.side])
  }
  const slotUnit = (d) => LEAF_STEP * 2 ** Math.max(0, maxDepth - d)
  const treeX = (node) => {
    let col = 0
    for (const side of pathOf.get(node.id) ?? []) col = col * 2 + (side === 'R' ? 1 : 0)
    return (col + 0.5) * slotUnit(node.depth)
  }
  const treeWidth = 2 ** maxDepth * LEAF_STEP
  const PAD = 34
  const width = Math.max(660, LABEL_X + treeWidth + PAD * 2)
  const TREE_LEFT = (width - treeWidth) / 2

  const rowCy = (depth) => TREE_TOP + depth * LEVEL_GAP
  const posOf = (id) => ({ x: TREE_LEFT + treeX(nodes[id]), y: rowCy(nodes[id].depth) })

  const treeBottom = TREE_TOP + maxDepth * LEVEL_GAP + NODE_R
  const BANNER_TOP = treeBottom + BANNER_TOP_GAP
  const BANNER_W = Math.min(600, width - LABEL_X * 2)
  const height = BANNER_TOP + BANNER_H + 26

  const svgRoot = mk('svg', {
    class: 'viz__svg mps__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '二叉树最大路径和推演动画',
  })
  stage.appendChild(svgRoot)

  // 分层绘制：边 → 节点 → 标签。
  // 为什么必须分三层：标签挂在节点正上方，而节点之间是相邻两行，
  // 同层的兄弟姐妹（15 和 7）标签会在水平方向撞上；按 id 顺序 append 的话，
  // 后画的节点圆圈还会盖住先画节点的标签。分三层之后，所有标签统一画在最上面，
  // 谁也不会被圆圈遮住。
  const edgeLayer = mk('g', { class: 'mps-edges' })
  const nodeLayer = mk('g', { class: 'mps-nodes' })
  const labelLayer = mk('g', { class: 'mps-labels' })
  svgRoot.appendChild(edgeLayer)
  svgRoot.appendChild(nodeLayer)
  svgRoot.appendChild(labelLayer)

  // ── 边（静态骨架，只变 class） ───────────────────────────────────────────
  const edgeEls = new Map()
  for (const node of nodes) {
    if (node.parent === -1) continue
    const a = posOf(node.parent)
    const b = posOf(node.id)
    const el = mk('path', {
      class: 'mps-edge',
      d: `M ${a.x} ${a.y + NODE_R} L ${b.x} ${b.y - NODE_R}`,
    })
    edgeLayer.appendChild(el)
    edgeEls.set(node.id, el)
  }

  // 同层左右相邻的两个节点，标签统一往各自外侧挪一点，避免水平重叠。
  // 满二叉树槽位法下，同层相邻节点的间距 = slotUnit(depth)，
  // 标签宽 64，所以只要间距不够 64 + 一点余量就得借位。
  const labelShift = (node) => {
    if (node.parent === -1) return 0
    const sib = node.side === 'L' ? nodes[node.parent].right : nodes[node.parent].left
    if (sib === null || sib === undefined) return 0
    const gap = Math.abs(posOf(node.id).x - posOf(sib).x)
    if (gap >= 76) return 0
    const need = (76 - gap) / 2 + 4
    return node.side === 'L' ? -need : need
  }

  // ── 节点 ─────────────────────────────────────────────────────────────────
  const nodeEls = []
  for (const node of nodes) {
    const p = posOf(node.id)
    const g = mk('g', { class: 'mps-node', transform: `translate(${p.x} ${p.y})` })
    g.appendChild(mk('circle', { class: 'mps-node__ring', r: NODE_R + 7 }))
    g.appendChild(mk('circle', { class: 'mps-node__circle', cx: 0, cy: 0, r: NODE_R }))
    const v = mk('text', { class: 'mps-node__value', x: 0, y: 0 })
    v.textContent = String(node.value)
    g.appendChild(v)
    nodeLayer.appendChild(g)

    // 「贡献值」小标签：贴在节点正上方居中，独立成层。
    // 参考 lca.js 的教训——放左上角会和左孩子的标签叠在一起；
    // 正上方落在两层节点之间的空当里，父边正好也走这条通道，
    // 但标签是最后画的，会压住边线（不透明底 + 描边，看起来像边从标签背后穿过）。
    const lg = mk('g', { class: 'mps-node__gaing', transform: `translate(${p.x + labelShift(node)} ${p.y})` })
    lg.appendChild(
      mk('rect', { class: 'mps-node__gain', x: -32, y: -NODE_R - 33, width: 64, height: 22, rx: 7 }),
    )
    const gt = mk('text', { class: 'mps-node__gain-text', x: 0, y: -NODE_R - 22 })
    lg.appendChild(gt)
    labelLayer.appendChild(lg)

    nodeEls.push({ g, gainG: lg, gt, id: node.id })
  }

  // ── 最优路径横幅 ─────────────────────────────────────────────────────────
  const banner = mk('g', { class: 'mps-banner' })
  banner.appendChild(
    mk('rect', { class: 'mps-banner__box', x: LABEL_X, y: BANNER_TOP, width: BANNER_W, height: BANNER_H, rx: 9 }),
  )
  const bannerLabel = mk('text', { class: 'mps-banner__label', x: LABEL_X + 16, y: BANNER_TOP + BANNER_H / 2 })
  bannerLabel.textContent = '当前最优路径和'
  banner.appendChild(bannerLabel)
  const bannerValue = mk('text', { class: 'mps-banner__value', x: LABEL_X + 136, y: BANNER_TOP + BANNER_H / 2 })
  banner.appendChild(bannerValue)
  const bannerPath = mk('text', { class: 'mps-banner__path', x: LABEL_X + BANNER_W - 16, y: BANNER_TOP + BANNER_H / 2 })
  banner.appendChild(bannerPath)
  svgRoot.appendChild(banner)

  // ── 每帧重绘 ─────────────────────────────────────────────────────────────
  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const topId = step.stack.length ? step.stack[step.stack.length - 1].id : null
    const onPath = new Set(step.bestPath ?? [])
    const prunedSet = new Set(step.pruned ?? [])
    const hasGain = (id) => Object.prototype.hasOwnProperty.call(step.gainOf, id)

    // ── 节点配色 + 贡献值标签 ──
    for (const el of nodeEls) {
      const { id, g, gainG, gt } = el
      const cls = ['mps-node']
      const done = hasGain(id)
      const gainVal = done ? step.gainOf[id] : null

      if (done) cls.push(gainVal > 0 ? 'is-plus' : 'is-zero')
      if (prunedSet.has(id)) cls.push('is-zero')
      if (id === topId) cls.push('is-visit')
      // 「在最优路径上」和「是拱顶」分开：拱顶只有一个，路径上可以有好几个
      if (onPath.has(id)) cls.push('is-onpath')
      if (id === step.bestNode) cls.push('is-apex')
      g.setAttribute('class', cls.join(' '))

      // 贡献值标签：只在"算完了"时显示
      if (done) {
        gainG.style.opacity = '1'
        gt.textContent = `gain ${gainVal}`
      } else {
        gainG.style.opacity = '0'
      }
    }

    // ── 边：两端都在 bestPath 上 → 高亮；孩子被剪掉 → 虚线 ──
    for (const node of nodes) {
      if (node.parent === -1) continue
      const el = edgeEls.get(node.id)
      const cls = ['mps-edge']
      if (onPath.has(node.id) && onPath.has(node.parent)) cls.push('is-onpath')
      if (hasGain(node.id) && step.gainOf[node.id] <= 0) cls.push('is-prune')
      el.setAttribute('class', cls.join(' '))
    }

    // ── 横幅 ──
    if (step.bestNode === null || !(step.bestPath ?? []).length) {
      bannerValue.textContent = '—'
      bannerPath.textContent = '还没算完任何一条路径'
    } else {
      bannerValue.textContent = String(step.best)
      bannerPath.textContent = (step.bestPath ?? []).map((id) => valueOf(id)).join(' → ')
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

  const player = createPlayer({
    steps,
    controls,
    intervalMs: PLAY_MS,
    onRender: paint,
  })
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
      delete host.dataset.mpsMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
