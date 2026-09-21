/**
 * linkedListReverse.js — 「反转链表」(LeetCode 206) 的交互式推演动画。
 *
 * 为什么是 vanilla JS 而不是 .vue 组件
 * ────────────────────────────────────
 * 文章正文要经过三道清洗才到浏览器：后端 Python-Markdown → bleach → 前端
 * DOMPurify。bleach 的白名单（backend/articles/models.py）里没有 svg / style /
 * script，div / span 也只保留 class 属性。所以动画没法写在 markdown 里，只能
 * 在客户端用 JS 现场构建 —— 文章里只留一个占位符：
 *
 *     <div class="algo-viz algo-viz--lc206"></div>
 *
 * 做成零依赖模块（而不是 Vue 组件）还有个好处：脱离 Vue 也能单独跑，
 * 本地预览和文章页共用同一份实现。
 *
 * 用法
 * ────
 *     import { mountLinkedListReverse } from '@/viz/linkedListReverse'
 *     const handle = mountLinkedListReverse(document.querySelector('.algo-viz--lc206'))
 *     handle.destroy()   // 卸载时记得调，否则定时器/观察器会漏
 *
 * 样式由模块自己注入（<style id="llv-styles">），用站点的 CSS 变量取色，
 * 所以亮/暗主题自动跟随，也不受 Vue scoped 样式的影响。
 */

import { buildSteps } from './linkedListSteps'
import {
  ensureChromeStyles,
  removeChromeStyles,
  renderRichText,
  createControls,
  createPlayer,
  svgEl as svg,
  svgArrow,
} from './widgetChrome'

const STYLE_ID = 'llv-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NODE_W = 72
const NODE_H = 52
const GAP = 44
const PAD = 68
const NODE_TOP = 96
const NODE_CY = NODE_TOP + NODE_H / 2 // 122
const NEXT_CY = 48 // next 指针放在节点上方，避免和 prev/curr 撞位置
const PREV_CY = 200
const CURR_CY = 240
const CHIP_W = 62
const CHIP_H = 26
const HEIGHT = 276
const NULL_PAD = 26 // 左右两端 ∅ 标记距画布边缘的距离

// 自动播放间隔（毫秒）
const PLAY_MS = 1150

let instances = 0

/** 一条带箭头的连线，只是给共用的 svgArrow 起个短名字 */
const edgeGroup = (fromX, toX, y, dir) => svgArrow(fromX, toX, y, dir, 'llv-edge')

const STYLES = `
/* 只有这块 SVG 的样式是 LC 206 专属的；容器 / 说明 / 控制条在外壳里
   （widgetChrome.js 的 .viz*），两个动画共用。 */
.llv {
  --llv-prev: var(--accent, #3f6b57);
  --llv-curr: var(--accent-secondary, #a45f45);
  --llv-next: #c89a46;
  --llv-edge: var(--text-secondary, #657168);
}
html.theme-dark .llv {
  --llv-next: #d9b063;
}
.llv__svg { min-width: 460px; }
.llv-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.26s ease, stroke-width 0.26s ease, fill 0.26s ease;
}
.llv-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 19px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.llv-node.is-flipped .llv-node__box { stroke: var(--llv-prev); }
.llv-node.is-curr .llv-node__box {
  stroke: var(--llv-curr);
  stroke-width: 3;
}
.llv-node.is-next .llv-node__box { stroke: var(--llv-next); stroke-dasharray: 5 3; }
.llv-edge {
  opacity: 0;
  transition: opacity 0.26s ease;
}
.llv-edge.is-on { opacity: 1; }
.llv-edge__line {
  stroke: var(--llv-edge);
  stroke-width: 1.8;
  stroke-linecap: round;
}
.llv-edge__head { fill: var(--llv-edge); }
.llv-edge.is-flipped .llv-edge__line { stroke: var(--llv-prev); }
.llv-edge.is-flipped .llv-edge__head { fill: var(--llv-prev); }
.llv-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.llv-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}
.llv-tick {
  stroke: var(--text-secondary, #657168);
  stroke-width: 1;
  stroke-dasharray: 3 3;
  opacity: 0.65;
}
.llv-chip { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.llv-chip__box { rx: 13; ry: 13; }
.llv-chip__text {
  font-size: 12.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.llv-chip--prev .llv-chip__box { fill: var(--llv-prev); }
.llv-chip--prev .llv-chip__text { fill: #fff; }
.llv-chip--curr .llv-chip__box { fill: var(--llv-curr); }
.llv-chip--curr .llv-chip__text { fill: #fff; }
.llv-chip--next .llv-chip__box { fill: var(--llv-next); }
.llv-chip--next .llv-chip__text { fill: #2a2113; }
@media (prefers-reduced-motion: reduce) {
  .llv-chip, .llv-edge, .llv-node__box { transition: none; }
}
`

function ensureStyles() {
  ensureChromeStyles() // 容器 / 说明 / 控制条，和别的动画共用
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLES
  document.head.appendChild(style)
}

/**
 * 挂载动画。
 * @param {HTMLElement} host 占位元素（会被填满）
 * @param {{
 *   values?: number[],
 *   autoplay?: boolean,    // 滚动到可见时自动播一次；生成封面截图时要关掉
 *   initialStep?: number,  // 从第几步开始（0 = 初始状态）
 * }} [options]
 * @returns {{ destroy: () => void }}
 */
export function mountLinkedListReverse(host, options = {}) {
  if (!host || host.dataset.llvMounted === '1') {
    return { destroy() {} }
  }
  host.dataset.llvMounted = '1'
  ensureStyles()
  instances += 1

  const values = Array.isArray(options.values) && options.values.length
    ? options.values
    : [1, 2, 3, 4, 5]
  const autoplay = options.autoplay !== false

  const steps = buildSteps(values)
  const n = values.length
  // 每个节点「原本」的 next，用来判断它有没有被翻过。
  // 注意最后一个节点原本就指向 null，不能拿 `nextOf[i] !== i + 1` 判断 ——
  // 那样它在第 0 步就会被误标成「已翻转」。
  const originalNext = Array.from({ length: n }, (_, i) => (i + 1 < n ? i + 1 : null))

  const width = 2 * PAD + n * NODE_W + Math.max(0, n - 1) * GAP
  const nodeLeft = (i) => PAD + i * (NODE_W + GAP)
  const nodeCenter = (i) => nodeLeft(i) + NODE_W / 2
  const nullLeftX = NULL_PAD
  const nullRightX = width - NULL_PAD

  // ── 一次性把 SVG 骨架建好，之后只改属性/类名，这样 CSS 过渡才能生效 ──────
  const root = document.createElement('div')
  root.className = 'viz llv'

  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  root.appendChild(stage)

  const svgRoot = svg('svg', {
    class: 'viz__svg llv__svg',
    viewBox: `0 0 ${width} ${HEIGHT}`,
    role: 'img',
    'aria-label': `反转链表推演动画：${values.join(' → ')}`,
  })
  stage.appendChild(svgRoot)

  // 左右两端的 ∅ 标记
  for (const cx of [nullLeftX, nullRightX]) {
    svgRoot.appendChild(
      svg('circle', { class: 'llv-null__ring', cx, cy: NODE_CY, r: 15 }),
    )
    const t = svg('text', { class: 'llv-null__text', x: cx, y: NODE_CY })
    t.textContent = '∅'
    svgRoot.appendChild(t)
  }

  // 指针 chip 的引线（画在节点下层，免得盖住节点边框）
  const tickNext = svg('line', { class: 'llv-tick' })
  const tickPrev = svg('line', { class: 'llv-tick' })
  const tickCurr = svg('line', { class: 'llv-tick' })
  svgRoot.append(tickNext, tickPrev, tickCurr)

  // 相邻节点之间的箭头：正向（→）和反向（←）各一条，靠透明度切换
  const gapEdges = []
  for (let g = 0; g < n - 1; g += 1) {
    const from = nodeLeft(g) + NODE_W
    const to = nodeLeft(g + 1)
    const fwd = edgeGroup(from, to, NODE_CY, 1)
    const bwd = edgeGroup(from, to, NODE_CY, -1)
    svgRoot.append(fwd, bwd)
    gapEdges.push({ fwd, bwd })
  }
  // 两端指向 ∅ 的箭头
  const tailRight = edgeGroup(nodeLeft(n - 1) + NODE_W, nullRightX - 15, NODE_CY, 1)
  const tailLeft = edgeGroup(nullLeftX + 15, nodeLeft(0), NODE_CY, -1)
  svgRoot.append(tailRight, tailLeft)

  // 节点
  const nodeGroups = []
  for (let i = 0; i < n; i += 1) {
    const g = svg('g', { class: 'llv-node' })
    g.appendChild(
      svg('rect', {
        class: 'llv-node__box',
        x: nodeLeft(i),
        y: NODE_TOP,
        width: NODE_W,
        height: NODE_H,
        rx: 9,
      }),
    )
    const t = svg('text', {
      class: 'llv-node__value',
      x: nodeCenter(i),
      y: NODE_CY,
    })
    t.textContent = String(values[i])
    g.appendChild(t)
    svgRoot.appendChild(g)
    nodeGroups.push(g)
  }

  // 指针 chip
  function makeChip(kind, label) {
    const g = svg('g', { class: `llv-chip llv-chip--${kind}` })
    g.appendChild(
      svg('rect', {
        class: 'llv-chip__box',
        x: -CHIP_W / 2,
        y: -CHIP_H / 2,
        width: CHIP_W,
        height: CHIP_H,
      }),
    )
    const t = svg('text', { class: 'llv-chip__text', x: 0, y: 0 })
    t.textContent = label
    g.appendChild(t)
    return g
  }
  const chipNext = makeChip('next', 'next')
  const chipPrev = makeChip('prev', 'prev')
  const chipCurr = makeChip('curr', 'curr')
  svgRoot.append(chipNext, chipPrev, chipCurr)

  // 说明文字 + 控制条（外壳见 widgetChrome.js）
  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')
  root.appendChild(desc)

  const controls = createControls()
  root.appendChild(controls.root)

  host.textContent = ''
  host.appendChild(root)

  let observer = null

  function setChip(chip, tick, x, cy, show, tickTopY, tickBottomY) {
    chip.style.transform = `translate(${x}px, ${cy}px)`
    chip.style.opacity = show ? '1' : '0'
    if (show) {
      tick.setAttribute('x1', x)
      tick.setAttribute('x2', x)
      tick.setAttribute('y1', tickTopY)
      tick.setAttribute('y2', tickBottomY)
      tick.style.opacity = '0.65'
    } else {
      tick.style.opacity = '0'
    }
  }

  function paint(index, step) {
    // 节点高亮
    for (let i = 0; i < n; i += 1) {
      const g = nodeGroups[i]
      g.classList.toggle('is-flipped', step.nextOf[i] !== originalNext[i])
      g.classList.toggle('is-curr', step.curr === i)
      g.classList.toggle('is-next', step.next === i)
    }

    // 相邻间隙的箭头方向
    for (let g = 0; g < n - 1; g += 1) {
      const forward = step.nextOf[g] === g + 1
      const backward = step.nextOf[g + 1] === g
      gapEdges[g].fwd.classList.toggle('is-on', forward)
      gapEdges[g].bwd.classList.toggle('is-on', backward)
      gapEdges[g].bwd.classList.toggle('is-flipped', backward)
    }

    // 两端指向 ∅ 的箭头
    const endsRight = step.nextOf[n - 1] === null
    const endsLeft = step.nextOf[0] === null
    tailRight.classList.toggle('is-on', endsRight)
    tailLeft.classList.toggle('is-on', endsLeft)
    tailLeft.classList.toggle('is-flipped', endsLeft)

    // 三个指针
    setChip(
      chipPrev,
      tickPrev,
      step.prev === null ? nullLeftX : nodeCenter(step.prev),
      PREV_CY,
      true,
      PREV_CY - CHIP_H / 2,
      NODE_TOP + NODE_H,
    )
    setChip(
      chipCurr,
      tickCurr,
      step.curr === null ? nullRightX : nodeCenter(step.curr),
      CURR_CY,
      true,
      CURR_CY - CHIP_H / 2,
      NODE_TOP + NODE_H,
    )
    setChip(
      chipNext,
      tickNext,
      step.next === null ? nullRightX : nodeCenter(step.next),
      NEXT_CY,
      step.phase !== 'init',
      NEXT_CY + CHIP_H / 2,
      NODE_TOP,
    )

    renderRichText(desc, step.desc)
  }

  const player = createPlayer({
    steps,
    controls,
    intervalMs: PLAY_MS,
    onRender: paint,
  })
  player.jumpTo(Math.trunc(options.initialStep) || 0)

  // 滚动到可见时自动播一次 —— 读者不用先找播放键
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
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
    observer.observe(root)
  }

  return {
    destroy() {
      if (observer) {
        observer.disconnect()
        observer = null
      }
      player.destroy()
      host.textContent = ''
      delete host.dataset.llvMounted
      instances -= 1
      if (instances <= 0) {
        document.getElementById(STYLE_ID)?.remove()
        removeChromeStyles()
      }
    },
  }
}

export default mountLinkedListReverse
