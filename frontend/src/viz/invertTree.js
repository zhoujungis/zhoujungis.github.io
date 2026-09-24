/**
 * invertTree.js — 「翻转二叉树」(LeetCode 226) 推演动画的 SVG 渲染层。
 *
 * 逻辑全在 invertTreeSteps.js 里，这里只负责把一帧快照画出来。要画三块：
 *
 *   1. 树（主体）    —— **位置是动态的**：每帧按 `step.sideOf` 算出每个节点
 *                       从根到它的路径（L/R 串），再用满二叉树槽位法定位。
 *                       交换一次 = 改一个节点的角色 → 它的 x 坐标跳到镜子里的
 *                       位置。「树在翻」这件事就是这么看出来的。
 *   2. 交换动画      —— 被互换的两个孩子之间画一条弧形双向箭头
 *   3. 说明文字 + 控制条
 *
 * 和系列里其它树动画最大的不同：**别的题树是静态的，边只是变颜色；
 * 这题的节点真的会换位置**，所以边每帧都要重算 `d`（不能只改 class）。
 * 坐标带上 CSS transition，在浏览器里就能看到节点滑过去（jsdom 截图是终态）。
 *
 * ⚠️ 通用坑：CSS 变量必须带字面量兜底（viz-shot.mjs 单独序列化 SVG 时，
 *    外层 div 上的变量解析不了）；分层绘制：边 → 节点 → 标签。
 */

import { buildInvertTreeSteps, buildTree } from './invertTreeSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'it-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NODE_R = 24
const LEVEL_GAP = 88
const TREE_TOP = 76

// 交换弧线：从节点上方这个高度起拱
const ARC_LIFT = 34
const ARC_APEX_LIFT = 68

const LABEL_X = 26
const BANNER_TOP_GAP = 42
const BANNER_H = 50

const PLAY_MS = 1150

const STYLES = `
.it {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.it__svg { width: 100%; height: auto; display: block; }

/* ── 节点（位置每帧变，所以挂 transition）───────────────────────────── */
.it-node {
  transition: transform 420ms cubic-bezier(0.4, 0, 0.2, 1);
}
.it-node__circle {
  fill: var(--it-fill, #ffffff);
  stroke: var(--it-line, #9aa39c);
  stroke-width: 2;
  transition: fill 260ms ease, stroke 260ms ease;
}
.it-node__value {
  fill: var(--it-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 当前焦点节点的强调环 */
.it-node__ring {
  fill: none;
  stroke: var(--it-hot, #a45f45);
  stroke-width: 3.5;
  opacity: 0;
}
/* 已经被翻转过的节点 */
.it-node.is-done .it-node__circle {
  fill: var(--it-ok-fill, #eef5f1);
  stroke: var(--it-ok, #3f6b57);
  stroke-width: 2.5;
}
.it-node.is-visit .it-node__circle {
  stroke: var(--it-hot, #a45f45);
  stroke-width: 3;
}
.it-node.is-visit .it-node__ring { opacity: 1; }
/* 这一帧正在被互换的两个孩子 */
.it-node.is-swapping .it-node__circle {
  fill: var(--it-hot-fill, #fdf1ec);
  stroke: var(--it-hot, #a45f45);
  stroke-width: 3.5;
}

/* ── 边（每帧重算 d，所以也要 transition）──────────────────────────── */
.it-edge {
  stroke: var(--it-edge, #8b948c);
  stroke-width: 2;
  fill: none;
  transition: d 420ms cubic-bezier(0.4, 0, 0.2, 1);
}
.it-edge.is-onstack {
  stroke: var(--it-hot, #a45f45);
  stroke-width: 3;
}

/* ── 交换弧线 ─────────────────────────────────────────────────────────── */
.it-swap__arc {
  fill: none;
  stroke: var(--it-hot, #a45f45);
  stroke-width: 2.5;
  stroke-dasharray: 6 4;
}
.it-swap__head {
  fill: var(--it-hot, #a45f45);
}
.it-swap__mark {
  fill: var(--it-hot, #a45f45);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

/* ── 状态横幅 ─────────────────────────────────────────────────────────── */
.it-banner__box {
  fill: var(--it-banner-fill, #f4f2ec);
  stroke: var(--it-line, #9aa39c);
  stroke-width: 1.5;
}
.it-banner__lead {
  fill: var(--it-hot, #a45f45);
  font-size: 16px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.it-banner__box.is-done {
  fill: var(--it-ok-fill, #eef5f1);
  stroke: var(--it-ok, #3f6b57);
  stroke-width: 2;
}
.it-banner__count {
  fill: var(--it-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.it-banner__count.is-done {
  fill: var(--it-ok, #3f6b57);
}

.it-empty__text {
  fill: var(--it-muted, #657168);
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
export function mountInvertTree(host, options = {}) {
  if (!host || host.dataset.itMounted === '1') return { destroy() {} }
  host.dataset.itMounted = '1'
  ensureStyles()

  const steps = buildInvertTreeSteps(options)
  const autoplay = options.autoplay !== false

  const values = Array.isArray(options.values) ? options.values : [4, 2, 7, 1, 3, 6, 9]
  const { nodes, root } = buildTree(values)
  const valueOf = (id) => (id === null || id === undefined || !nodes[id] ? null : nodes[id].value)

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz it'
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
    const s0 = mk('svg', { class: 'viz__svg it__svg', viewBox: `0 0 ${w0} ${h0}`, role: 'img' })
    const t0 = mk('text', { class: 'it-empty__text', x: w0 / 2, y: h0 / 2 })
    t0.textContent = '空树 —— 没什么可翻的，直接返回 None'
    s0.appendChild(t0)
    stage.appendChild(s0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.itMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  // ── 几何常量（层级不变，所以这些是静态的）───────────────────────────────
  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0)
  // 叶子层步长：让整棵树宽度落在 470px 左右最好读。
  // ⚠️ 不能写死 —— 官方例只有 3 层，写死 58 会让树挤在画布中间一小块；
  // 而 4 层的满二叉树用 58 又刚好。所以按层数反推，再夹在 [58, 120] 里。
  const LEAF_STEP = Math.min(120, Math.max(58, Math.round(470 / 2 ** maxDepth)))
  const slotUnit = (d) => LEAF_STEP * 2 ** Math.max(0, maxDepth - d)
  const treeWidth = 2 ** maxDepth * LEAF_STEP
  const PAD = 34
  const width = Math.max(660, LABEL_X + treeWidth + PAD * 2)
  const TREE_LEFT = (width - treeWidth) / 2

  const rowCy = (depth) => TREE_TOP + depth * LEVEL_GAP

  /**
   * 按当前左右角色，算出节点位置。
   * 路径 = 沿 parent 链往上收集每个节点的 'L'/'R'（根那层是最高位），
   * 再当二进制读成列号。
   *
   * ⚠️ 这里从**子往父**走，所以最深那一位是**最低位**，必须用递增权重累加。
   * 初版写成 `col = col * 2 + bit`，等于把最深那一位当成了最高位 ——
   * 节点 6（路径 R→L，期望列号 0b10 = 2）会被算成 0b01 = 1，
   * 整棵树左右错位。（纯逻辑测试用 sideOf 推路径，测不出这个错，
   * 只有渲染层截图才能暴露 —— 所以写完渲染层必须出图看一眼。）
   */
  const posWith = (side, id) => {
    let col = 0
    let weight = 1
    let cur = id
    while (nodes[cur].parent !== -1) {
      if (side[cur] === 'R') col += weight
      weight *= 2
      cur = nodes[cur].parent
    }
    return { x: TREE_LEFT + (col + 0.5) * slotUnit(nodes[id].depth), y: rowCy(nodes[id].depth) }
  }

  const treeBottom = TREE_TOP + maxDepth * LEVEL_GAP + NODE_R
  const BANNER_TOP = treeBottom + BANNER_TOP_GAP
  const BANNER_W = Math.min(620, width - LABEL_X * 2)
  const height = BANNER_TOP + BANNER_H + 26

  const svgRoot = mk('svg', {
    class: 'viz__svg it__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '翻转二叉树推演动画',
  })
  stage.appendChild(svgRoot)

  const edgeLayer = mk('g', { class: 'it-edges' })
  const nodeLayer = mk('g', { class: 'it-nodes' })
  const swapLayer = mk('g', { class: 'it-swap' })
  svgRoot.appendChild(edgeLayer)
  svgRoot.appendChild(swapLayer)
  svgRoot.appendChild(nodeLayer)

  // ── 边（每帧重算 d） ─────────────────────────────────────────────────────
  const edgeEls = new Map()
  for (const node of nodes) {
    if (node.parent === -1) continue
    const el = mk('path', { class: 'it-edge', d: 'M 0 0 L 0 0' })
    edgeLayer.appendChild(el)
    edgeEls.set(node.id, el)
  }

  // ── 节点 ─────────────────────────────────────────────────────────────────
  const nodeEls = []
  for (const node of nodes) {
    const g = mk('g', { class: 'it-node' })
    g.appendChild(mk('circle', { class: 'it-node__ring', r: NODE_R + 7 }))
    g.appendChild(mk('circle', { class: 'it-node__circle', cx: 0, cy: 0, r: NODE_R }))
    const v = mk('text', { class: 'it-node__value', x: 0, y: 0 })
    v.textContent = String(node.value)
    g.appendChild(v)
    nodeLayer.appendChild(g)
    nodeEls.push({ g, value: node.value, id: node.id })
  }

  // ── 交换弧线（最多一条） ─────────────────────────────────────────────────
  const swapArc = mk('path', { class: 'it-swap__arc', d: 'M 0 0' })
  const swapHeadL = mk('path', { class: 'it-swap__head', d: 'M 0 0' })
  const swapHeadR = mk('path', { class: 'it-swap__head', d: 'M 0 0' })
  const swapMark = mk('text', { class: 'it-swap__mark', x: 0, y: 0 })
  swapMark.textContent = '⇄'
  swapLayer.appendChild(swapArc)
  swapLayer.appendChild(swapHeadL)
  swapLayer.appendChild(swapHeadR)
  swapLayer.appendChild(swapMark)

  // ── 横幅 ─────────────────────────────────────────────────────────────────
  const bannerBox = mk('rect', {
    class: 'it-banner__box',
    x: LABEL_X,
    y: BANNER_TOP,
    width: BANNER_W,
    height: BANNER_H,
    rx: 9,
  })
  svgRoot.appendChild(bannerBox)
  const bannerLead = mk('text', {
    class: 'it-banner__lead',
    x: LABEL_X + 16,
    y: BANNER_TOP + BANNER_H / 2,
  })
  svgRoot.appendChild(bannerLead)
  const bannerCount = mk('text', {
    class: 'it-banner__count',
    x: LABEL_X + BANNER_W - 16,
    y: BANNER_TOP + BANNER_H / 2,
  })
  svgRoot.appendChild(bannerCount)

  // ── 每帧重绘 ─────────────────────────────────────────────────────────────
  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const side = step.sideOf ?? {}
    const pos = (id) => posWith(side, id)

    const curId = step.current
    const swappedSet = new Set(step.swapped ?? [])
    const swapPair = step.swapPair ?? []
    const swapSet = new Set(swapPair.filter((x) => x !== null && x !== undefined))

    // 当前递归路径上的边
    const onStack = new Set()
    for (let i = 0; i + 1 < step.stack.length; i += 1) onStack.add(step.stack[i + 1].id)

    // ── 节点：位置 + 配色 ──
    for (const el of nodeEls) {
      const { id, g } = el
      const p = pos(id)
      g.setAttribute('transform', `translate(${p.x} ${p.y})`)

      const cls = ['it-node']
      if (swappedSet.has(id)) cls.push('is-done')
      // done 帧不再高亮任何节点 —— 那是"收工"帧，画面上所有节点都该是"已翻转"的样子
      if (id === curId && step.phase !== 'done') cls.push('is-visit')
      if (swapSet.has(id)) cls.push('is-swapping')
      g.setAttribute('class', cls.join(' '))
    }

    // ── 边：两端位置都按当前角色重算 ──
    for (const node of nodes) {
      if (node.parent === -1) continue
      const a = pos(node.parent)
      const b = pos(node.id)
      const el = edgeEls.get(node.id)
      el.setAttribute('d', `M ${a.x} ${a.y + NODE_R} L ${b.x} ${b.y - NODE_R}`)
      el.setAttribute('class', onStack.has(node.id) ? 'it-edge is-onstack' : 'it-edge')
    }

    // ── 交换弧线：把这一帧互换的两个孩子连起来 ──
    const pair = swapPair.filter((x) => x !== null && x !== undefined)
    if (step.phase === 'swap' && pair.length === 2) {
      const a = pos(pair[0])
      const b = pos(pair[1])
      const y0 = a.y - NODE_R - ARC_LIFT
      const midX = (a.x + b.x) / 2
      const apexY = a.y - NODE_R - ARC_APEX_LIFT
      swapArc.setAttribute('d', `M ${a.x} ${y0} Q ${midX} ${apexY} ${b.x} ${y0}`)
      swapArc.style.opacity = '1'
      // 两端箭头（指向彼此，表示"互换"）
      swapHeadL.setAttribute('d', `M ${a.x} ${y0} l 9 -4 l 0 8 z`)
      swapHeadR.setAttribute('d', `M ${b.x} ${y0} l -9 -4 l 0 8 z`)
      swapHeadL.style.opacity = '1'
      swapHeadR.style.opacity = '1'
      swapMark.setAttribute('x', midX)
      // `⇄` 放在弧顶**上方**，别压在弧线上（初版放 apexY + 6，正好和弧线叠住）
      swapMark.setAttribute('y', apexY - 9)
      swapMark.style.opacity = '1'
    } else {
      swapArc.style.opacity = '0'
      swapHeadL.style.opacity = '0'
      swapHeadR.style.opacity = '0'
      swapMark.style.opacity = '0'
    }

    // ── 横幅 ──
    const nonLeaf = nodes.filter((n) => n.left !== null || n.right !== null).length
    if (step.phase === 'init') {
      bannerLead.textContent = `从根 ${valueOf(root)} 开始，逐层交换两个孩子`
    } else if (step.phase === 'swap') {
      bannerLead.textContent =
        pair.length === 2
          ? `交换 ${valueOf(pair[0])} 和 ${valueOf(pair[1])}`
          : `单侧孩子移位：${valueOf(pair[0] ?? pair[1])}`
    } else if (step.phase === 'leaf') {
      bannerLead.textContent = `${valueOf(curId)} 是叶子，交换空操作 → 直接返回`
    } else {
      bannerLead.textContent = `继续递归进子树 ${valueOf(curId)}`
    }
    if (step.phase === 'done') {
      bannerLead.textContent = `翻转完成 —— 每个节点的路径都逐位取反过了`
      bannerBox.setAttribute('class', 'it-banner__box is-done')
      bannerCount.setAttribute('class', 'it-banner__count is-done')
    } else {
      bannerBox.setAttribute('class', 'it-banner__box')
      bannerCount.setAttribute('class', 'it-banner__count')
    }
    bannerCount.textContent = `已换 ${step.swapped.length}/${nonLeaf} 个非叶节点`

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
      delete host.dataset.itMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
