/**
 * maxDepth.js — 「二叉树的最大深度」(LeetCode 104) 推演动画的 SVG 渲染层。
 *
 * 逻辑全在 maxDepthSteps.js 里，这里只负责把一帧快照画出来。要画三块：
 *
 *   1. 树（主体）    —— 每个**已算完**的节点上方挂 `h=2` 标签（高度从这里冒上来）；
 *                       当前递归路径描粗，一眼看出"钻到哪一层了"
 *   2. 结果横幅      —— 左边是这一帧的计算式，右边是最终答案（根算完前显示 `?`）
 *   3. 说明文字 + 控制条
 *
 * ⚠️ 三个通用坑（LC 102 / 124 踩过，这里直接规避）：
 *   A. 所有 CSS 变量都带字面量兜底 —— viz-shot.mjs 单独序列化 SVG 时，
 *      外层 div 上的变量解析不了，不带兜底整条样式失效。
 *   K. 分层绘制：边 → 节点 → 标签，别按 id 顺序 append，否则后画的圆圈会盖住
 *      先画节点的标签、同层兄弟姐妹的标签还会水平相撞。
 */

import { buildMaxDepthSteps, buildTree } from './maxDepthSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'md-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NODE_R = 24
// 节点正上方要挂 `h=2` 标签（高 22），父边还得从两层之间斜穿过去 ——
// 所以行距比无标签的动画（78~82）要大。
const LEVEL_GAP = 96
const TREE_TOP = 78

const LABEL_X = 26
const BANNER_TOP_GAP = 40
const BANNER_H = 52

const PLAY_MS = 1150

// 标签宽（用于同层借位判断）
const TAG_W = 48

const STYLES = `
.md {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.md__svg { width: 100%; height: auto; display: block; }

/* ── 节点 ─────────────────────────────────────────────────────────────── */
.md-node__circle {
  fill: var(--md-fill, #ffffff);
  stroke: var(--md-line, #9aa39c);
  stroke-width: 2;
}
.md-node__value {
  fill: var(--md-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 节点正上方的高度标签：算完了才出现 */
.md-node__htag {
  fill: var(--md-paper, #f4f2ec);
  stroke: var(--md-line, #9aa39c);
  stroke-width: 1.5;
}
.md-node__htag-text {
  fill: var(--md-ink, #1f2a24);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 当前焦点节点的强调环 */
.md-node__ring {
  fill: none;
  stroke: var(--md-hot, #a45f45);
  stroke-width: 3.5;
  opacity: 0;
}

.md-node.is-done .md-node__circle {
  fill: var(--md-ok-fill, #eef5f1);
  stroke: var(--md-ok, #3f6b57);
  stroke-width: 2.5;
}
.md-node.is-done .md-node__htag {
  stroke: var(--md-ok, #3f6b57);
}
.md-node.is-done .md-node__htag-text {
  fill: var(--md-ok, #3f6b57);
}
.md-node.is-visit .md-node__circle {
  stroke: var(--md-hot, #a45f45);
  stroke-width: 3;
}
.md-node.is-visit .md-node__ring { opacity: 1; }
/* 这一帧刚刚算出高度的节点：标签换成暖色，强调"新冒出来的那个数" */
.md-node.is-fresh .md-node__htag {
  fill: var(--md-hot-fill, #fdf1ec);
  stroke: var(--md-hot, #a45f45);
  stroke-width: 2;
}
.md-node.is-fresh .md-node__htag-text {
  fill: var(--md-hot, #a45f45);
}

/* ── 边 ───────────────────────────────────────────────────────────────── */
.md-edge { stroke: var(--md-edge, #8b948c); stroke-width: 2; fill: none; }
/* 当前递归路径上的边（栈里相邻两帧之间） */
.md-edge.is-onstack {
  stroke: var(--md-hot, #a45f45);
  stroke-width: 3.5;
}

/* ── 结果横幅 ─────────────────────────────────────────────────────────── */
.md-banner__box {
  fill: var(--md-banner-fill, #f4f2ec);
  stroke: var(--md-line, #9aa39c);
  stroke-width: 1.5;
}
.md-banner__lead {
  fill: var(--md-ok, #3f6b57);
  font-size: 17px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.md-banner__answer-label {
  fill: var(--md-muted, #657168);
  font-size: 12px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.md-banner__answer {
  fill: var(--md-ink, #1f2a24);
  font-size: 24px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 根算完之前答案未知 —— 用灰色问号强调"还说不出来" */
.md-banner__answer.is-unknown {
  fill: var(--md-dim, #b9b9b3);
}

.md-empty__text {
  fill: var(--md-muted, #657168);
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
export function mountMaxDepth(host, options = {}) {
  if (!host || host.dataset.mdMounted === '1') return { destroy() {} }
  host.dataset.mdMounted = '1'
  ensureStyles()

  const steps = buildMaxDepthSteps(options)
  const autoplay = options.autoplay !== false

  const values = Array.isArray(options.values) ? options.values : [3, 9, 20, null, null, 15, 7]
  const { nodes, root } = buildTree(values)
  const valueOf = (id) => (id === null || id === undefined || !nodes[id] ? null : nodes[id].value)

  const mk = svgEl
  const total = nodes.length

  const rootEl = document.createElement('div')
  rootEl.className = 'viz md'
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
    const s0 = mk('svg', { class: 'viz__svg md__svg', viewBox: `0 0 ${w0} ${h0}`, role: 'img' })
    const t0 = mk('text', { class: 'md-empty__text', x: w0 / 2, y: h0 / 2 })
    t0.textContent = '空树 —— 深度记 0（这就是递归的出口条件）'
    s0.appendChild(t0)
    stage.appendChild(s0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.mdMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  // ── 树布局（满二叉树槽位法） ─────────────────────────────────────────────
  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0)
  // 叶子层步长按层数反推，让树宽落在 470px 左右。
  // 官方例只有 3 层，写死一个步长会让树挤在画布中间一小块；
  // 夹在 [58, 120] 里保证深树不重叠、浅树不失控。
  const LEAF_STEP = Math.min(120, Math.max(58, Math.round(470 / 2 ** maxDepth)))
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
  const BANNER_W = Math.min(620, width - LABEL_X * 2)
  const height = BANNER_TOP + BANNER_H + 26

  const svgRoot = mk('svg', {
    class: 'viz__svg md__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '二叉树最大深度推演动画',
  })
  stage.appendChild(svgRoot)

  // 分层：边 → 节点 → 标签（见文件头坑 K）
  const edgeLayer = mk('g', { class: 'md-edges' })
  const nodeLayer = mk('g', { class: 'md-nodes' })
  const labelLayer = mk('g', { class: 'md-labels' })
  svgRoot.appendChild(edgeLayer)
  svgRoot.appendChild(nodeLayer)
  svgRoot.appendChild(labelLayer)

  // ── 边 ───────────────────────────────────────────────────────────────────
  const edgeEls = new Map()
  for (const node of nodes) {
    if (node.parent === -1) continue
    const a = posOf(node.parent)
    const b = posOf(node.id)
    const el = mk('path', {
      class: 'md-edge',
      d: `M ${a.x} ${a.y + NODE_R} L ${b.x} ${b.y - NODE_R}`,
    })
    edgeLayer.appendChild(el)
    edgeEls.set(node.id, el)
  }

  // 同层相邻节点的标签在水平方向可能相撞（间距不够 TAG_W + 余量时各往外挪一半）
  const labelShift = (node) => {
    if (node.parent === -1) return 0
    const sib = node.side === 'L' ? nodes[node.parent].right : nodes[node.parent].left
    if (sib === null || sib === undefined) return 0
    const gap = Math.abs(posOf(node.id).x - posOf(sib).x)
    if (gap >= TAG_W + 8) return 0
    const need = (TAG_W + 8 - gap) / 2 + 3
    return node.side === 'L' ? -need : need
  }

  // ── 节点 + 高度标签 ──────────────────────────────────────────────────────
  const nodeEls = []
  for (const node of nodes) {
    const p = posOf(node.id)
    const g = mk('g', { class: 'md-node', transform: `translate(${p.x} ${p.y})` })
    g.appendChild(mk('circle', { class: 'md-node__ring', r: NODE_R + 7 }))
    g.appendChild(mk('circle', { class: 'md-node__circle', cx: 0, cy: 0, r: NODE_R }))
    const v = mk('text', { class: 'md-node__value', x: 0, y: 0 })
    v.textContent = String(node.value)
    g.appendChild(v)
    nodeLayer.appendChild(g)

    // 高度标签独立成层，画在所有圆圈之上
    const lg = mk('g', {
      class: 'md-node__htag-g',
      transform: `translate(${p.x + labelShift(node)} ${p.y})`,
    })
    lg.appendChild(
      mk('rect', {
        class: 'md-node__htag',
        x: -TAG_W / 2,
        y: -NODE_R - 32,
        width: TAG_W,
        height: 22,
        rx: 7,
      }),
    )
    const ht = mk('text', { class: 'md-node__htag-text', x: 0, y: -NODE_R - 21 })
    lg.appendChild(ht)
    labelLayer.appendChild(lg)

    nodeEls.push({ g, gainG: lg, gt: ht, id: node.id })
  }

  // ── 结果横幅 ─────────────────────────────────────────────────────────────
  const banner = mk('g', { class: 'md-banner' })
  banner.appendChild(
    mk('rect', {
      class: 'md-banner__box',
      x: LABEL_X,
      y: BANNER_TOP,
      width: BANNER_W,
      height: BANNER_H,
      rx: 9,
    }),
  )
  const bannerLead = mk('text', {
    class: 'md-banner__lead',
    x: LABEL_X + 16,
    y: BANNER_TOP + BANNER_H / 2,
  })
  banner.appendChild(bannerLead)
  const bannerALabel = mk('text', {
    class: 'md-banner__answer-label',
    x: LABEL_X + BANNER_W - 74,
    y: BANNER_TOP + BANNER_H / 2,
  })
  bannerALabel.textContent = '最大深度'
  banner.appendChild(bannerALabel)
  const bannerAnswer = mk('text', {
    class: 'md-banner__answer',
    x: LABEL_X + BANNER_W - 16,
    y: BANNER_TOP + BANNER_H / 2,
  })
  banner.appendChild(bannerAnswer)
  svgRoot.appendChild(banner)

  // ── 每帧重绘 ─────────────────────────────────────────────────────────────
  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const topId = step.stack.length ? step.stack[step.stack.length - 1].id : null
    const curId = step.current
    const hasH = (id) => Object.prototype.hasOwnProperty.call(step.heightOf, id)

    // 当前递归路径上的边（栈里相邻两项之间）
    const onStack = new Set()
    for (let i = 0; i + 1 < step.stack.length; i += 1) onStack.add(step.stack[i + 1].id)

    // 这一帧刚刚算出来的那个高度（只有 compute / leaf 帧才有）
    const freshId = step.height !== null ? curId : null

    // ── 节点配色 + 高度标签 ──
    for (const el of nodeEls) {
      const { id, g, gainG, gt } = el
      const cls = ['md-node']
      const done = hasH(id)

      if (done) cls.push('is-done')
      if (id === topId) cls.push('is-visit')
      if (id === freshId) cls.push('is-fresh')
      g.setAttribute('class', cls.join(' '))

      if (done) {
        gainG.style.opacity = '1'
        gt.textContent = `h=${step.heightOf[id]}`
      } else {
        gainG.style.opacity = '0'
      }
    }

    // ── 边：当前递归路径高亮 ──
    for (const node of nodes) {
      if (node.parent === -1) continue
      const el = edgeEls.get(node.id)
      el.setAttribute('class', onStack.has(node.id) ? 'md-edge is-onstack' : 'md-edge')
    }

    // ── 横幅 ──
    if (step.phase === 'init') {
      bannerLead.textContent = `从根 ${valueOf(root)} 开始，先下去问子树`
    } else if (step.phase === 'recurse') {
      bannerLead.textContent =
        step.leftH !== null
          ? `左子树回报 h=${step.leftH}，继续问右边`
          : `进入 ${valueOf(curId)}，继续往下问`
    } else if (step.phase === 'leaf') {
      bannerLead.textContent = `${valueOf(curId)} 是叶子 → h = 1 + max(0, 0) = 1`
    } else if (step.phase === 'compute') {
      bannerLead.textContent = `${valueOf(curId)}：1 + max(${step.leftH}, ${step.rightH}) = ${step.height}`
    } else {
      bannerLead.textContent =
        step.answer === 0
          ? '空树：深度记 0'
          : `根 ${valueOf(root)} 报出 h=${step.answer} —— 这就是答案`
    }

    const solved = step.answer
    if (solved === null) {
      bannerAnswer.textContent = '?'
      bannerAnswer.setAttribute('class', 'md-banner__answer is-unknown')
    } else {
      bannerAnswer.textContent = String(solved)
      bannerAnswer.setAttribute('class', 'md-banner__answer')
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

  // total 只用于可访问性描述，避免被 tree-shake 掉提示
  rootEl.setAttribute('aria-description', `共 ${total} 个节点`)

  return {
    destroy() {
      if (observer) {
        observer.disconnect()
        observer = null
      }
      player.destroy()
      host.textContent = ''
      delete host.dataset.mdMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
