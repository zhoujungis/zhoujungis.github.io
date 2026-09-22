/**
 * palindromeList.js — 「回文链表」(LeetCode 234) 的交互式推演动画。
 *
 * 和系列里其它动画一样是 vanilla JS：正文要过三道清洗（Python-Markdown →
 * bleach → DOMPurify），svg/style/script 都不在白名单里，动画只能在客户端
 * 现场构建，文章里只留占位符：
 *
 *     <div class="algo-viz algo-viz--lc234"></div>
 *
 * 结构分工：
 *     ./palindromeSteps.js  纯状态机，产出每一步快照（有单测）
 *     ./widgetChrome.js     公共外壳：容器 / 说明文字 / 控制条 / svg 小工具
 *     本文件                 只负责把快照画成 SVG
 *
 * 画面上有信息量的三样东西：
 *
 * 1. **上下两行、逐列对齐**。上行是前半段，下行是反转后的后半段。第 k 列就
 *    是第 k 对（`slot k` vs `slot L-1-k`）——回文这件事的本质是"镜像"，
 *    而镜像在画面上就是"上下对齐"。配对线因此画成竖直的一条，而不是绕来绕去
 *    的弧线：看一眼就知道谁跟谁比。
 *
 * 2. **反转时整段翻面**。后半段下移一行之后，节点不是原地掉头，而是整段的
 *    左右位置互换 —— 读起来就是"这截链条被翻了个面"，翻完从左到右跟上行的
 *    前半段一模一样。
 *
 * 3. **底部判定横幅**。比较中 / ✓ 是回文 / ✗ 不是回文，随时可见。不等的那一
 *    对立刻变红并停住，把"提前返回"演出来。
 *
 * 用法：
 *     import { mountPalindromeList } from '@/viz/palindromeList'
 *     const handle = mountPalindromeList(host, { values: [1,2,2,1] })
 *     handle.destroy()
 */

import { buildPalindromeSteps } from './palindromeSteps'
import {
  ensureChromeStyles,
  renderRichText,
  createControls,
  createPlayer,
  svgEl as svg,
} from './widgetChrome'

const STYLE_ID = 'palm-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NODE_W = 64
const NODE_H = 48
const GAP = 44
const PAD = 44
const ROW1_TOP = 118
const ROW2_TOP = 236
const CHIP_DY = -26 // chip 挂在节点上方
const STAGE_CY = 44
const CHIP_W = 58
const CHIP_H = 26
const NULL_EXTRA = 62 // 右端 ∅ 标记占的额外宽度
const VERDICT_CY = ROW2_TOP + NODE_H + 66

const PLAY_MS = 1250

const STAGES = ['① 找中点', '② 反转后半段', '③ 逐对比较']

const STYLES = `
.palm {
  --palm-node: var(--text-primary, #1f2a24);
  --palm-edge: var(--text-secondary, #657168);
  --palm-a: var(--accent, #3f6b57);
  --palm-b: var(--accent-secondary, #a45f45);
  --palm-ok: var(--accent, #3f6b57);
  --palm-bad: #c0392b;
}
html.theme-dark .palm {
  --palm-a: #7fc3a4;
  --palm-b: #e0a06a;
  --palm-bad: #ff8a7a;
}
.palm__svg { min-width: 520px; }

.palm-node__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.5;
  transition: stroke 0.24s ease, fill 0.24s ease;
}
.palm-node__value {
  fill: var(--palm-node);
  font-size: 18px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.palm-node.is-paired .palm-node__box { stroke: var(--palm-ok); stroke-width: 2; }
.palm-node.is-active .palm-node__box { stroke: var(--palm-b); stroke-width: 2.5; }
.palm-node.is-bad .palm-node__box { stroke: var(--palm-bad); stroke-width: 2.5; }
.palm-node.is-bad .palm-node__value { fill: var(--palm-bad); }

/* 节点整体位移：反转的"翻面"效果全靠它 */
.palm-node { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1); }

.palm-edge__line { stroke: var(--palm-edge); stroke-width: 1.8; stroke-linecap: round; fill: none; }
.palm-edge__head { fill: var(--palm-edge); }

.palm-null__ring {
  fill: none;
  stroke: var(--text-secondary, #657168);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}
.palm-null__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 配对竖线 + ✓ / ✗ */
.palm-pair__line { stroke: var(--palm-ok); stroke-width: 2.2; fill: none; stroke-linecap: round; }
.palm-pair.is-bad .palm-pair__line { stroke: var(--palm-bad); }
.palm-pair__disc { fill: var(--palm-ok); }
.palm-pair.is-bad .palm-pair__disc { fill: var(--palm-bad); }
.palm-pair__mark {
  fill: #fff;
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.palm-pair.is-on .palm-pair__line { stroke: var(--palm-b); }
.palm-pair.is-on .palm-pair__disc { fill: var(--palm-b); }

/* 顶部阶段条 */
.palm-stage__box {
  fill: var(--surface, #fff);
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.palm-stage__text {
  fill: var(--text-secondary, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
}
.palm-stage.is-on .palm-stage__box { fill: var(--palm-ok); stroke: var(--palm-ok); }
.palm-stage.is-on .palm-stage__text { fill: #fff; }

/* 底部判定横幅 */
.palm-verdict__box {
  fill: none;
  stroke: var(--glass-border, #dce2da);
  stroke-width: 1.2;
  transition: fill 0.24s ease, stroke 0.24s ease;
}
.palm-verdict__text {
  fill: var(--text-secondary, #657168);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  transition: fill 0.24s ease;
}
.palm-verdict.is-ok .palm-verdict__box { fill: var(--palm-ok); stroke: var(--palm-ok); }
.palm-verdict.is-ok .palm-verdict__text { fill: #fff; }
.palm-verdict.is-bad .palm-verdict__box { fill: var(--palm-bad); stroke: var(--palm-bad); }
.palm-verdict.is-bad .palm-verdict__text { fill: #fff; }

.palm-chip { transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.palm-chip__box { rx: 13; ry: 13; }
.palm-chip__text {
  font-size: 12.5px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: #fff;
}
.palm-chip--slow .palm-chip__box,
.palm-chip--prev .palm-chip__box,
.palm-chip--p1 .palm-chip__box { fill: var(--palm-a); }
.palm-chip--fast .palm-chip__box,
.palm-chip--curr .palm-chip__box,
.palm-chip--p2 .palm-chip__box { fill: var(--palm-b); }
@media (prefers-reduced-motion: reduce) {
  .palm-node, .palm-chip, .palm-stage__box, .palm-node__box,
  .palm-verdict__box { transition: none; }
}
`

function ensureStyles() {
  ensureChromeStyles()
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLES
  document.head.appendChild(style)
}

/**
 * 挂载动画。
 * @param {HTMLElement} host 占位元素（会被填满）
 * @param {{ values?: number[], autoplay?: boolean, initialStep?: number }} [options]
 * @returns {{ destroy: () => void }}
 */
export function mountPalindromeList(host, options = {}) {
  if (!host || host.dataset.palmMounted === '1') {
    return { destroy() {} }
  }
  host.dataset.palmMounted = '1'
  ensureStyles()

  const values = Array.isArray(options.values) && options.values.length
    ? options.values
    : [1, 2, 2, 1]
  const autoplay = options.autoplay !== false

  const steps = buildPalindromeSteps(values)
  const L = values.length

  const cols = Math.max(L, 1)
  const colX = (i) => PAD + i * (NODE_W + GAP)
  const nodeW = 2 * PAD + cols * NODE_W + (cols - 1) * GAP
  const width = nodeW + NULL_EXTRA
  const height = VERDICT_CY + 40
  const nullX = nodeW + NULL_EXTRA / 2

  const rowCy = (top) => top + NODE_H / 2

  // ── SVG 骨架 ────────────────────────────────────────────────────────────
  const root = document.createElement('div')
  root.className = 'viz palm'

  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  root.appendChild(stage)

  const svgRoot = svg('svg', {
    class: 'viz__svg palm__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': `回文链表推演动画：${values.join(' → ')}`,
  })
  stage.appendChild(svgRoot)

  // 顶部阶段条
  const stageGs = []
  const stageW = Math.min(150, (width - 2 * PAD - 2 * 16) / 3)
  const stageGap = 16
  const stageStartX = (width - (3 * stageW + 2 * stageGap)) / 2
  STAGES.forEach((text, i) => {
    const g = svg('g', { class: 'palm-stage' })
    const x = stageStartX + i * (stageW + stageGap)
    g.appendChild(
      svg('rect', {
        class: 'palm-stage__box',
        x,
        y: STAGE_CY - 15,
        width: stageW,
        height: 30,
        rx: 15,
      }),
    )
    const t = svg('text', { class: 'palm-stage__text', x: x + stageW / 2, y: STAGE_CY })
    t.textContent = text
    g.appendChild(t)
    svgRoot.appendChild(g)
    stageGs.push(g)
  })

  // 右端 ∅
  svgRoot.appendChild(svg('circle', { class: 'palm-null__ring', cx: nullX, cy: rowCy(ROW1_TOP), r: 15 }))
  const nullText = svg('text', { class: 'palm-null__text', x: nullX, y: rowCy(ROW1_TOP) })
  nullText.textContent = '∅'
  svgRoot.appendChild(nullText)

  // 容器顺序：配对线 → 边 → 节点 → chip（保证 chip 压在最上面）
  const pairG = svg('g', { class: 'palm-pairs' })
  svgRoot.appendChild(pairG)
  const edgeG = svg('g', { class: 'palm-edges' })
  svgRoot.appendChild(edgeG)

  const nodeGs = []
  for (let i = 0; i < L; i += 1) {
    const g = svg('g', { class: 'palm-node' })
    g.appendChild(svg('rect', { class: 'palm-node__box', x: 0, y: 0, width: NODE_W, height: NODE_H, rx: 9 }))
    const t = svg('text', { class: 'palm-node__value', x: NODE_W / 2, y: NODE_H / 2 })
    t.textContent = String(values[i])
    g.appendChild(t)
    svgRoot.appendChild(g)
    nodeGs.push(g)
  }

  function makeChip() {
    const g = svg('g', { class: 'palm-chip' })
    g.appendChild(
      svg('rect', { class: 'palm-chip__box', x: -CHIP_W / 2, y: -CHIP_H / 2, width: CHIP_W, height: CHIP_H }),
    )
    const t = svg('text', { class: 'palm-chip__text', x: 0, y: 0 })
    g.appendChild(t)
    return { g, t }
  }
  const chips = [makeChip(), makeChip()]
  chips.forEach((c) => svgRoot.appendChild(c.g))

  // 底部判定横幅
  const verdictG = svg('g', { class: 'palm-verdict' })
  const vbW = 190
  const vbX = (width - vbW) / 2
  const verdictBox = svg('rect', {
    class: 'palm-verdict__box',
    x: vbX,
    y: VERDICT_CY - 18,
    width: vbW,
    height: 36,
    rx: 18,
  })
  const verdictText = svg('text', { class: 'palm-verdict__text', x: width / 2, y: VERDICT_CY })
  verdictG.appendChild(verdictBox)
  verdictG.appendChild(verdictText)
  svgRoot.appendChild(verdictG)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')
  root.appendChild(desc)

  const controls = createControls()
  root.appendChild(controls.root)

  host.textContent = ''
  host.appendChild(root)

  let observer = null

  /** 一条普通边：同行相邻走直线，其余一律从节点底部绕行（带箭头）。 */
  function drawEdge(from, to, pos) {
    const a = pos[from]
    const b = pos[to]
    const g = svg('g', { class: 'palm-edge' })
    const sameRow = a.y === b.y
    const adjacent = sameRow && Math.abs(a.x - b.x) === NODE_W + GAP
    if (adjacent) {
      const y = a.y + NODE_H / 2
      const x1 = a.x + NODE_W
      const x2 = b.x
      g.appendChild(svg('line', { class: 'palm-edge__line', x1: x1 + 3, y1: y, x2: x2 - 9, y2: y }))
      g.appendChild(
        svg('path', { class: 'palm-edge__head', d: `M ${x2} ${y} L ${x2 - 9} ${y - 5.5} L ${x2 - 9} ${y + 5.5} Z` }),
      )
    } else {
      const y1 = a.y + NODE_H
      const y2 = b.y + NODE_H
      const drop = 38
      const c1x = a.x + NODE_W / 2
      const c2x = b.x + NODE_W / 2
      g.appendChild(
        svg('path', {
          class: 'palm-edge__line',
          d: `M ${c1x} ${y1} C ${c1x} ${y1 + drop}, ${c2x} ${y2 + drop}, ${c2x} ${y2 + 8}`,
        }),
      )
      g.appendChild(
        svg('path', { class: 'palm-edge__head', d: `M ${c2x} ${y2} L ${c2x - 5.5} ${y2 + 9} L ${c2x + 5.5} ${y2 + 9} Z` }),
      )
    }
    edgeG.appendChild(g)
  }

  /** 第 k 对：竖线 + 中间的 ✓ / ✗。自比（f === b）时画节点下方的 U 形弧。
   *  配对线整体左移 18px —— 列正中间留给 next 边，两条线不打架。 */
  function drawPair(pair, pos, isActive) {
    const g = svg('g', {
      class: `palm-pair ${pair.ok ? 'is-ok' : 'is-bad'} ${isActive ? 'is-on' : ''}`,
    })
    if (pair.f === pair.b) {
      const p = pos[pair.f]
      const cx = p.x + NODE_W / 2 - 18
      const y = p.y + NODE_H
      const r = 26
      g.appendChild(
        svg('path', {
          class: 'palm-pair__line',
          d: `M ${cx - 14} ${y} C ${cx - 22} ${y + r}, ${cx + 22} ${y + r}, ${cx + 14} ${y}`,
        }),
      )
      mark(g, cx, y + r * 0.78, pair.ok)
    } else {
      const a = pos[pair.f]
      const c = pos[pair.b]
      const cx = a.x + NODE_W / 2 - 18
      const y1 = a.y + NODE_H
      const y2 = c.y
      const my = (y1 + y2) / 2
      g.appendChild(svg('line', { class: 'palm-pair__line', x1: cx, y1: y1 + 10, x2: cx, y2: my - 11 }))
      g.appendChild(svg('line', { class: 'palm-pair__line', x1: cx, y1: my + 11, x2: cx, y2: y2 - 2 }))
      mark(g, cx, my, pair.ok)
    }
    pairG.appendChild(g)
  }

  function mark(g, cx, cy, ok) {
    g.appendChild(svg('circle', { class: 'palm-pair__disc', cx, cy, r: 11 }))
    const t = svg('text', { class: 'palm-pair__mark', x: cx, y: cy })
    t.textContent = ok ? '✓' : '✗'
    g.appendChild(t)
  }

  function paint(_index, step) {
    // ── 位置：front 在上行，back 在下行，逐列对齐 ──────────────────────────
    const pos = new Array(L).fill(null)
    step.front.forEach((slot, i) => {
      pos[slot] = { x: colX(i), y: ROW1_TOP }
    })
    step.back.forEach((slot, i) => {
      pos[slot] = { x: colX(i), y: ROW2_TOP }
    })
    // 兜底：任何没被安排到的节点（init 之后不该出现）塞到上行末尾
    let spare = Math.max(step.front.length, step.back.length)
    for (let i = 0; i < L; i += 1) {
      if (!pos[i]) {
        pos[i] = { x: colX(spare), y: ROW1_TOP }
        spare += 1
      }
    }

    const pairedSlots = new Set()
    for (const p of step.pairs) {
      pairedSlots.add(p.f)
      pairedSlots.add(p.b)
    }
    const activeSlots = new Set()
    if (step.active) {
      activeSlots.add(step.active.f)
      activeSlots.add(step.active.b)
    }
    const badSlots = new Set()
    if (step.active && !step.active.ok) {
      badSlots.add(step.active.f)
      badSlots.add(step.active.b)
    }

    for (let i = 0; i < L; i += 1) {
      const p = pos[i]
      nodeGs[i].setAttribute('transform', `translate(${p.x} ${p.y})`)
      nodeGs[i].classList.toggle('is-paired', pairedSlots.has(i))
      nodeGs[i].classList.toggle('is-active', activeSlots.has(i))
      nodeGs[i].classList.toggle('is-bad', badSlots.has(i))
    }

    // ── 配对线：每帧重建 ──────────────────────────────────────────────────
    pairG.textContent = ''
    step.pairs.forEach((pair, k) => {
      const isActive = step.active && step.pairs.indexOf(step.active) === k
      drawPair(pair, pos, isActive)
    })

    // ── 边：每帧重建 ──────────────────────────────────────────────────────
    edgeG.textContent = ''
    for (let i = 0; i < L; i += 1) {
      const to = step.links[i]
      if (to === null || to === undefined) continue
      if (to < 0 || to >= L) continue
      drawEdge(i, to, pos)
    }

    // ── 阶段条 ────────────────────────────────────────────────────────────
    stageGs.forEach((g, i) => g.classList.toggle('is-on', step.stage === i + 1))

    // ── 判定横幅 ──────────────────────────────────────────────────────────
    verdictG.setAttribute('class', 'palm-verdict')
    let vText = '准备开始'
    if (step.verdict === true) {
      verdictG.classList.add('is-ok')
      vText = '✓ 是回文链表'
    } else if (step.verdict === false) {
      verdictG.classList.add('is-bad')
      vText = '✗ 不是回文链表'
    } else if (step.phase === 'cmp') {
      vText = '比较中…'
    } else if (step.phase === 'split' || step.phase === 'rev') {
      vText = '反转中…'
    } else if (step.phase === 'mid') {
      vText = '定位中点…'
    } else if (step.phase === 'init') {
      vText = '待判定'
    }
    verdictText.textContent = vText

    // ── 指针 chip ─────────────────────────────────────────────────────────
    chips.forEach((chip, i) => {
      const spec = step.chips[i]
      if (!spec) {
        chip.g.style.opacity = '0'
        return
      }
      const p = spec.slot === null ? { x: nullX - NODE_W / 2, y: ROW1_TOP } : pos[spec.slot]
      // 下行节点的 chip 挂到节点下方，避免压住配对线的 ✓ / ✗
      const chipY = p.y === ROW2_TOP && spec.slot !== null
        ? p.y + NODE_H + 14
        : p.y + CHIP_DY
      chip.g.style.opacity = '1'
      chip.g.setAttribute('class', `palm-chip palm-chip--${spec.kind}`)
      chip.t.textContent = spec.label
      chip.g.setAttribute('transform', `translate(${p.x + NODE_W / 2} ${chipY})`)
    })

    renderRichText(desc, step.desc)
  }

  const player = createPlayer({
    steps,
    controls,
    intervalMs: PLAY_MS,
    onRender: paint,
  })
  player.jumpTo(Math.trunc(options.initialStep) || 0)

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
      delete host.dataset.palmMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

export default mountPalindromeList
