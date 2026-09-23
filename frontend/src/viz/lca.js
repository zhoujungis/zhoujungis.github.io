/**
 * lca.js — 「二叉树的最近公共祖先」(LeetCode 236) 推演动画的 SVG 渲染层。
 *
 * 逻辑全在 lcaSteps.js 里，这里只负责把一帧快照画出来。要画三块：
 *
 *   1. 树（主体）        —— 每个节点显示"当前返回值"，用颜色区分四种状态
 *   2. 递归栈（右侧）    —— 一叠调用帧，栈底在下、栈顶在上，直观展示"钻多深"
 *   3. 说明文字 + 控制条
 *
 * 树布局沿用 levelOrder.js 的「满二叉树槽位法」（见那边注释）。
 *
 * ⚠️ 所有 CSS 变量都带字面量兜底：viz-shot.mjs 会把 SVG 单独序列化，
 *    外层 div 上的变量解析不了，不带兜底整条样式会失效（系列坑 A）。
 */

import { buildLcaSteps, buildTree } from './lcaSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'lca-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NODE_R = 24
const LEVEL_GAP = 82
const TREE_TOP = 62
const LEAF_STEP = 58

const LABEL_X = 26
const STACK_TOP_GAP = 44
const STACK_ROW_H = 30
const STACK_ROW_W = 214
const STACK_ROW_GAP = 10

const PLAY_MS = 1250

// 节点状态配色（都带字面量兜底）
const C = {
  idle: '#9aa39c',   // 还没轮到
  visit: '#a45f45',  // 正在访问（栈顶）
  found: '#3f6b57',  // 返回值非空（p / q / LCA 标记）
  prune: '#b9b9b3',  // 确定返回 null（这棵子树白跑）
  hit: '#c2872f',    // 命中 p / q
}

const STYLES = `
.lca {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.lca__svg { width: 100%; height: auto; display: block; }

/* ── 节点 ─────────────────────────────────────────────────────────────── */
.lca-node__circle {
  fill: var(--lca-fill, #ffffff);
  stroke: var(--lca-line, #9aa39c);
  stroke-width: 2;
}
.lca-node__value {
  fill: var(--lca-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 树上挂的"返回值"小标签 */
.lca-node__ret {
  fill: var(--lca-paper, #f4f2ec);
  stroke: var(--lca-line, #9aa39c);
  stroke-width: 1.5;
}
.lca-node__ret-text {
  fill: var(--lca-ink, #1f2a24);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lca-node__tag {
  fill: var(--lca-hot, #a45f45);
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lca-node.is-target .lca-node__circle { stroke: var(--lca-hit, #c2872f); stroke-width: 3; }
.lca-node.is-visit .lca-node__circle { stroke: var(--lca-hot, #a45f45); stroke-width: 3; }
.lca-node.is-found .lca-node__circle { fill: var(--lca-ok-fill, #eef5f1); stroke: var(--lca-ok, #3f6b57); stroke-width: 3; }
.lca-node.is-prune .lca-node__circle { stroke: var(--lca-dim, #b9b9b3); stroke-dasharray: 3 3; }
.lca-node.is-prune .lca-node__value { fill: var(--lca-dim, #b9b9b3); }

/* 分叉点的强调环 */
.lca-node__ring {
  fill: none;
  stroke: var(--lca-hot, #a45f45);
  stroke-width: 3;
  opacity: 0;
}
.lca-node.is-answer .lca-node__ring { opacity: 1; }

/* ── 边 ───────────────────────────────────────────────────────────────── */
.lca-edge { stroke: var(--lca-edge, #8b948c); stroke-width: 2; fill: none; }
.lca-edge.is-active { stroke: var(--lca-hot, #a45f45); stroke-width: 3; }
.lca-edge.is-prune { stroke: var(--lca-dim, #b9b9b3); stroke-dasharray: 4 4; }

/* ── 递归栈 ───────────────────────────────────────────────────────────── */
.lca-stack__title {
  fill: var(--lca-muted, #657168);
  font-size: 12px;
  font-weight: 700;
  text-anchor: start;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lca-frame__box {
  fill: var(--lca-frame-fill, #ffffff);
  stroke: var(--lca-line, #9aa39c);
  stroke-width: 1.5;
}
.lca-frame__text {
  fill: var(--lca-ink, #1f2a24);
  font-size: 11.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lca-frame.is-top .lca-frame__box { stroke: var(--lca-hot, #a45f45); stroke-width: 2.5; }
.lca-frame.is-top .lca-frame__text { fill: var(--lca-hot, #a45f45); font-weight: 700; }

/* ── 返回值传送带 ─────────────────────────────────────────────────────── */
.lca-flow__box {
  fill: var(--lca-ok-fill, #eef5f1);
  stroke: var(--lca-ok, #3f6b57);
  stroke-width: 2;
}
.lca-flow__text {
  fill: var(--lca-ok, #3f6b57);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lca-empty__text {
  fill: var(--lca-muted, #657168);
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
 *   p?: number|null,
 *   q?: number|null,
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 */
export function mountLca(host, options = {}) {
  if (!host || host.dataset.lcaMounted === '1') return { destroy() {} }
  host.dataset.lcaMounted = '1'
  ensureStyles()

  const steps = buildLcaSteps(options)
  const autoplay = options.autoplay !== false

  const values = Array.isArray(options.values)
    ? options.values
    : [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]
  const { nodes, root } = buildTree(values)
  const valueOf = (id) => (id === null || id === undefined || !nodes[id] ? null : nodes[id].value)

  const svg = svgEl
  const mk = svg

  const rootEl = document.createElement('div')
  rootEl.className = 'viz lca'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  // ── 空树 ─────────────────────────────────────────────────────────────────
  if (root === -1) {
    const w0 = 620
    const h0 = 120
    const s0 = mk('svg', { class: 'viz__svg lca__svg', viewBox: `0 0 ${w0} ${h0}`, role: 'img' })
    const t0 = mk('text', { class: 'lca-empty__text', x: w0 / 2, y: h0 / 2 })
    t0.textContent = '空树 —— 直接返回 null'
    s0.appendChild(t0)
    stage.appendChild(s0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.lcaMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
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

  // ── 纵向：树 → 栈 ────────────────────────────────────────────────────────
  const treeBottom = TREE_TOP + maxDepth * LEVEL_GAP + NODE_R
  // 递归栈画在树的下方（栈底在下、栈顶在上），需要给"最深的一帧"留位置
  const maxStack = Math.max(1, ...steps.map((s) => s.stack.length))
  const STACK_TOP = treeBottom + STACK_TOP_GAP
  const STACK_BOTTOM = STACK_TOP + maxStack * (STACK_ROW_H + STACK_ROW_GAP)

  // 返回值传送带（"这一帧返回了什么"）放在栈下面
  const FLOW_TOP = STACK_BOTTOM + 22
  const FLOW_H = 34
  const height = FLOW_TOP + FLOW_H + 26

  const STACK_LEFT = LABEL_X
  const STACK_W = STACK_ROW_W

  const svgRoot = mk('svg', {
    class: 'viz__svg lca__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '最近公共祖先推演动画',
  })
  stage.appendChild(svgRoot)

  // ── 边（静态骨架，只变 class） ───────────────────────────────────────────
  const edgeEls = new Map()
  for (const node of nodes) {
    if (node.parent === -1) continue
    const a = posOf(node.parent)
    const b = posOf(node.id)
    const el = mk('path', {
      class: 'lca-edge',
      d: `M ${a.x} ${a.y + NODE_R} L ${b.x} ${b.y - NODE_R}`,
    })
    svgRoot.appendChild(el)
    edgeEls.set(node.id, el)
  }

  // ── 节点 ─────────────────────────────────────────────────────────────────
  const nodeEls = []
  for (const node of nodes) {
    const p = posOf(node.id)
    const g = mk('g', { class: 'lca-node', transform: `translate(${p.x} ${p.y})` })
    g.appendChild(mk('circle', { class: 'lca-node__ring', r: NODE_R + 7 }))
    g.appendChild(mk('circle', { class: 'lca-node__circle', cx: 0, cy: 0, r: NODE_R }))
    const v = mk('text', { class: 'lca-node__value', x: 0, y: 0 })
    v.textContent = String(node.value)
    g.appendChild(v)
    // 返回值小标签：贴在节点正上方。
    // 之前放在左上角会和"左孩子的返回值标签"撞在一起（父节点在左上方、
    // 子节点在左下方，两个标签都往左上飘就会叠）。放正上方后，标签落在
    // 两层节点之间的空当里，父边从左右两侧走，不会压到。
    const retG = mk('g', { class: 'lca-node__retg' })
    retG.appendChild(mk('rect', { class: 'lca-node__ret', x: -26, y: -NODE_R - 24, width: 52, height: 20, rx: 6 }))
    const rt = mk('text', { class: 'lca-node__ret-text', x: 0, y: -NODE_R - 14 })
    retG.appendChild(rt)
    g.appendChild(retG)
    // p / q 角标
    const tag = mk('text', { class: 'lca-node__tag', x: 0, y: NODE_R + 15 })
    g.appendChild(tag)
    svgRoot.appendChild(g)
    nodeEls.push({ g, retG, rt, tag, id: node.id })
  }

  // ── 递归栈 ───────────────────────────────────────────────────────────────
  const stackTitle = mk('text', {
    class: 'lca-stack__title',
    x: STACK_LEFT,
    y: STACK_TOP - 12,
  })
  stackTitle.textContent = '调用栈（栈底在下）'
  svgRoot.appendChild(stackTitle)

  const frameEls = []
  for (let i = 0; i < maxStack; i += 1) {
    // i = 0 是栈底 → 画最下面一行
    const y = STACK_BOTTOM - (i + 1) * (STACK_ROW_H + STACK_ROW_GAP)
    const g = mk('g', { class: 'lca-frame', transform: `translate(${STACK_LEFT} ${y})` })
    g.appendChild(mk('rect', { class: 'lca-frame__box', x: 0, y: 0, width: STACK_W, height: STACK_ROW_H, rx: 7 }))
    const t = mk('text', { class: 'lca-frame__text', x: 12, y: STACK_ROW_H / 2 })
    g.appendChild(t)
    svgRoot.appendChild(g)
    frameEls.push({ g, t })
  }

  // ── 返回值传送带 ─────────────────────────────────────────────────────────
  const flowBox = mk('rect', {
    class: 'lca-flow__box',
    x: STACK_LEFT,
    y: FLOW_TOP,
    width: Math.min(560, width - STACK_LEFT - 24),
    height: FLOW_H,
    rx: 8,
  })
  svgRoot.appendChild(flowBox)
  const flowText = mk('text', {
    class: 'lca-flow__text',
    x: STACK_LEFT + Math.min(560, width - STACK_LEFT - 24) / 2,
    y: FLOW_TOP + FLOW_H / 2,
  })
  svgRoot.appendChild(flowText)

  // ── 每帧重绘 ─────────────────────────────────────────────────────────────
  const desc = descEl()

  // 每一帧里"已经算完的节点"→ 返回值。用来决定节点配色。
  const finishedAt = (step, id) => Object.prototype.hasOwnProperty.call(step.memo, id)

  function paint(_index, step) {
    if (!step) return
    const topId = step.stack.length ? step.stack[step.stack.length - 1].id : null
    const curId = step.current
    const inStack = new Set(step.stack.map((f) => f.id))

    // 节点配色
    for (const el of nodeEls) {
      const { id, g, retG, rt, tag } = el
      const cls = ['lca-node']
      if (Array.isArray(step.found) && step.found.includes(id)) cls.push('is-target')

      const finished = finishedAt(step, id)
      const retVal = finished ? step.memo[id] : undefined

      if (finished && retVal === null) cls.push('is-prune')
      else if (finished && retVal !== null) cls.push('is-found')

      if (id === topId) cls.push('is-visit')
      if (id === step.answer) cls.push('is-answer')

      g.setAttribute('class', cls.join(' '))

      // 返回值标签：只在"算完了"时显示
      if (finished) {
        retG.style.opacity = '1'
        rt.textContent = retVal === null ? 'null' : `${valueOf(retVal)}`
        rt.setAttribute(
          'class',
          retVal === null ? 'lca-node__ret-text' : 'lca-node__ret-text',
        )
      } else {
        retG.style.opacity = '0'
      }

      // p / q 角标
      const isP = id === step.pId
      const isQ = id === step.qId
      tag.textContent = isP && isQ ? '=p=q' : isP ? 'p' : isQ ? 'q' : ''
      tag.style.opacity = isP || isQ ? '1' : '0'
    }

    // 边：两端都在栈里 → 高亮；孩子已确定返回 null → 虚化
    for (const node of nodes) {
      if (node.parent === -1) continue
      const el = edgeEls.get(node.id)
      const cls = ['lca-edge']
      const bothInStack = inStack.has(node.id) && inStack.has(node.parent)
      if (bothInStack) cls.push('is-active')
      const fin = finishedAt(step, node.id)
      if (fin && step.memo[node.id] === null) cls.push('is-prune')
      el.setAttribute('class', cls.join(' '))
    }

    // 调用栈
    frameEls.forEach((fr, i) => {
      const f = step.stack[i]
      if (!f) {
        fr.g.style.opacity = '0'
        return
      }
      fr.g.style.opacity = '1'
      const isTop = i === step.stack.length - 1
      fr.g.setAttribute('class', `lca-frame${isTop ? ' is-top' : ''}`)
      const stageName = f.stage === 'enter' ? '刚进入' : f.stage === 'left' ? '等右子树' : f.stage === 'right' ? '等返回值' : '做判断'
      fr.t.textContent = `${i} · dfs(${valueOf(f.id)}) · ${stageName}`
    })

    // 返回值传送带
    if (step.phase === 'hit' || step.phase === 'decide' || step.phase === 'return' || step.phase === 'done') {
      flowBox.style.opacity = '1'
      flowText.style.opacity = '1'
      const rv = step.returning
      if (step.returnSource === 'null') {
        flowText.textContent = step.phase === 'done' ? '递归结束：返回 null' : '返回 null（子树里什么都没找到）'
      } else if (step.phase === 'done') {
        flowText.textContent = `最终答案：${valueOf(rv)}`
      } else if (step.returnSource === 'lca') {
        flowText.textContent = `返回自己 ${valueOf(rv)}（这里就是分叉点）`
      } else {
        flowText.textContent = `向上返回 ${valueOf(rv)}（标记：${step.returnSource} 在这里）`
      }
    } else {
      flowBox.style.opacity = '0.25'
      flowText.style.opacity = '0.35'
      flowText.textContent = '（这一帧还没有返回值）'
    }

    renderRichText(desc, step.desc)
  }

  rootEl.appendChild(desc)
  const controls = createControls()
  rootEl.appendChild(controls.root)

  // 状态机里没暴露 pId/qId，这里从 options 反推（保持渲染层与题目一致）
  const idOfValue = new Map()
  for (const n of nodes) idOfValue.set(n.value, n.id)
  const pVal = options.p === undefined || options.p === null ? 6 : options.p
  const qVal = options.q === undefined || options.q === null ? 4 : options.q

  // 把 p/q 注入每一帧（纯展示用，不改状态机逻辑）
  const pId = idOfValue.get(pVal)
  const qId = idOfValue.get(qVal)
  const decorated = steps.map((s) => ({ ...s, pId, qId }))

  host.textContent = ''
  host.appendChild(rootEl)
  ensureChromeStyles()

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const player = createPlayer({
    steps: decorated,
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
      delete host.dataset.lcaMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
