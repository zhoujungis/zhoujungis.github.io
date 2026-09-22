/**
 * mergeKDCLists.js — 「合并 K 个升序链表」**分治两两合并**解法的推演动画。
 *
 * 和 mergeKLists.js（小顶堆版）是一对：同一个问题，两种解法，两张图。
 * 正文占位符：<div class="algo-viz algo-viz--lc23dc"></div>
 *
 * 结构分工：
 *     ./mergeKDCSeps.js   纯状态机，产出每一轮的快照（有单测）
 *     ./widgetChrome.js   公共外壳
 *     本文件              只负责把快照画成 SVG
 *
 * 画面是一叠横排的「层」，一层就是一轮：
 *
 *     输入   [7] [2] [5] [1] [8] [3] [6] [4]      8 条
 *              ╲╱      ╲╱      ╲╱      ╲╱
 *     第 1 轮 [2 7]  [1 5]  [3 8]  [4 6]          4 条
 *                ╲───╱      ╲───╱
 *     第 2 轮 [1 2 5 7]   [3 4 6 8]                2 条
 *                  ╲───────╱
 *     第 3 轮 [1 2 3 4 5 6 7 8]                    1 条
 *
 * 为什么每层的宽度几乎一样：**每层的节点总数都是 N**，只是分组的粒度在变粗
 * （1 个一组 → 2 个一组 → 4 个一组）。这个"宽度不变、条数减半"的画面，
 * 就是「轮数 = ⌈log₂K⌉」最直观的样子。
 *
 * 用法：
 *     import { mountMergeKDCLists } from '@/viz/mergeKDCLists'
 *     const handle = mountMergeKDCLists(host, { lists: [[7],[2],[5],[1],[8],[3],[6],[4]] })
 *     handle.destroy()
 */

import { buildMergeKDCSeps } from './mergeKDCSeps'
import {
  ensureChromeStyles,
  removeChromeStyles,
  renderRichText,
  createControls,
  createPlayer,
  svgEl as svg,
} from './widgetChrome'

const STYLE_ID = 'mkc-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NODE_W = 44
const NODE_H = 36
const INNER_GAP = 18 // 同一条链表内部，节点间距
const LIST_GAP = 38 // 两条链表之间（要比 INNER_GAP 明显，否则读不出分组）
const LABEL_W = 68 // 左侧行标签列宽
const ROW_PITCH = 76 // 层与层之间的间距（要留出配对连线的空间）
const TOP = 34
const RIGHT_PAD = 54 // 右侧「8 条」注释
const EMPTY_W = 30 // 空链表占位宽度

const PLAY_MS = 1400

let instances = 0

const STYLES = `
.mkc {
  --mkc-lv1: #3f6b57;
  --mkc-lv2: #a45f45;
  --mkc-lv3: #3f5f8a;
  --mkc-lv4: #7a5a9c;
  --mkc-edge: var(--text-secondary, #657168);
  --mkc-accent: var(--accent, #3f6b57);
}
html.theme-dark .mkc {
  --mkc-lv1: #8fb29c;
  --mkc-lv2: #d18a6f;
  --mkc-lv3: #8ab0d8;
  --mkc-lv4: #b79ad6;
}
.mkc__svg { min-width: 560px; }

/* 每一层一个色系：输入层是中性灰，之后逐轮换色，方便对着连线读 */
.mkc-lv0 { --c: var(--mkc-edge); --c-bg: transparent; }
.mkc-lv1 { --c: var(--mkc-lv1); --c-bg: rgba(63, 107, 87, 0.16); }
.mkc-lv2 { --c: var(--mkc-lv2); --c-bg: rgba(164, 95, 69, 0.16); }
.mkc-lv3 { --c: var(--mkc-lv3); --c-bg: rgba(63, 95, 138, 0.16); }
.mkc-lv4 { --c: var(--mkc-lv4); --c-bg: rgba(122, 90, 156, 0.16); }

.mkc-row-label {
  fill: var(--c, var(--mkc-edge));
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
}
.mkc-row-count {
  fill: var(--mkc-edge);
  font-size: 11.5px;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mkc-row.is-hidden { opacity: 0; }
.mkc-row { transition: opacity 0.32s ease; }
/* 本步刚出现的那一层：右侧「N 条」跟着层色亮起来 */
.mkc-row.is-active .mkc-row-count { fill: var(--c); font-weight: 700; }

.mkc-node__box {
  fill: var(--surface, #fff);
  stroke: var(--c, var(--glass-border, #dce2da));
  stroke-width: 1.6;
  transition: stroke 0.26s ease, fill 0.26s ease, stroke-width 0.26s ease;
}
.mkc-node__value {
  fill: var(--text-primary, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.mkc-lv0 .mkc-node__box { fill: var(--surface, #fff); }
.mkc-node { transition: opacity 0.3s ease; }
/* 刚合并出来的那一层：整层做一次入场（下沉淡入） */
.mkc-node.is-new {
  opacity: 0;
  animation: mkc-pop 0.36s ease forwards;
}
@keyframes mkc-pop {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 配对连线 */
.mkc-link__line {
  stroke: var(--mkc-edge);
  stroke-width: 1.4;
  fill: none;
  opacity: 0.35;
  transition: opacity 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease;
}
.mkc-link.is-on .mkc-link__line {
  stroke: var(--mkc-accent);
  stroke-width: 2;
  opacity: 0.85;
}
.mkc-link { transition: opacity 0.3s ease; }
.mkc-link.is-hidden { opacity: 0; }

.mkc-null__ring {
  fill: none;
  stroke: var(--mkc-edge);
  stroke-width: 1.3;
  stroke-dasharray: 4 3;
}
.mkc-null__text {
  fill: var(--mkc-edge);
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

@media (prefers-reduced-motion: reduce) {
  .mkc-node.is-new { animation: none; opacity: 1; }
  .mkc-row, .mkc-link, .mkc-link__line, .mkc-node__box { transition: none; }
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

const levelClass = (r) => `mkc-lv${Math.min(r, 4)}`

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{
 *   lists?: Array<Array<number|string>>,
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 * @returns {{ destroy: () => void }}
 */
export function mountMergeKDCLists(host, options = {}) {
  if (!host || host.dataset.mkcMounted === '1') {
    return { destroy() {} }
  }
  host.dataset.mkcMounted = '1'
  ensureStyles()
  instances += 1

  const lists =
    Array.isArray(options.lists) && options.lists.length
      ? options.lists
      : [[7], [2], [5], [1], [8], [3], [6], [4]]
  const autoplay = options.autoplay !== false

  const steps = buildMergeKDCSeps(lists)
  // 最后一步包含全部层 —— 一次性建好，之后只切显隐
  const finalLevels = steps[steps.length - 1].levels

  // ── 每一层的横向布局 ─────────────────────────────────────────────────────
  const layout = finalLevels.map((level) => {
    const items = []
    let x = LABEL_W
    for (const values of level.lists) {
      const w = values.length
        ? values.length * NODE_W + (values.length - 1) * INNER_GAP
        : EMPTY_W
      items.push({ x, w, values })
      x += w + LIST_GAP
    }
    return { items, width: items.length ? x - LIST_GAP : LABEL_W, top: TOP }
  })
  layout.forEach((lv, r) => {
    lv.top = TOP + r * ROW_PITCH
  })

  const contentW = layout.reduce((m, lv) => Math.max(m, lv.width), LABEL_W)
  const width = contentW + RIGHT_PAD
  const height = TOP + (layout.length - 1) * ROW_PITCH + NODE_H + 26

  const centerOf = (r, i) => {
    const it = layout[r].items[i]
    return it ? it.x + it.w / 2 : LABEL_W
  }

  // ── 建 SVG ───────────────────────────────────────────────────────────────
  const root = document.createElement('div')
  root.className = 'viz mkc'

  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  root.appendChild(stage)

  const svgRoot = svg('svg', {
    class: 'viz__svg mkc__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': `合并 ${lists.length} 个升序链表的分治推演动画`,
  })
  stage.appendChild(svgRoot)

  // 配对连线先画（压在节点下面）
  const linkGroups = []
  for (let r = 1; r < layout.length; r += 1) {
    const from = finalLevels[r].from || []
    from.forEach((pair, k) => {
      const [i, j] = pair
      const srcY = layout[r - 1].top + NODE_H
      const dstY = layout[r].top
      const dstX = centerOf(r, k)
      const g = svg('g', { class: `mkc-link ${levelClass(r)}` })
      if (j < 0) {
        // 轮空：原样往下走一条竖线
        g.appendChild(
          svg('line', {
            class: 'mkc-link__line',
            x1: centerOf(r - 1, i),
            y1: srcY,
            x2: dstX,
            y2: dstY,
          }),
        )
      } else {
        for (const src of [i, j]) {
          const sx = centerOf(r - 1, src)
          g.appendChild(
            svg('path', {
              class: 'mkc-link__line',
              d: `M ${sx} ${srcY} C ${sx} ${srcY + 22}, ${dstX} ${dstY - 22}, ${dstX} ${dstY}`,
            }),
          )
        }
      }
      svgRoot.appendChild(g)
      linkGroups.push({ g, level: r })
    })
  }

  // 每一层：行标签 + 条数注释 + 节点
  const rowGroups = []
  layout.forEach((lv, r) => {
    const g = svg('g', { class: `mkc-row ${levelClass(r)}` })
    const cy = lv.top + NODE_H / 2

    const label = svg('text', { class: 'mkc-row-label', x: LABEL_W - 16, y: cy })
    label.textContent = r === 0 ? '输入' : `第 ${r} 轮`
    g.appendChild(label)

    const count = svg('text', { class: 'mkc-row-count', x: lv.width + 14, y: cy })
    count.textContent = `${lv.items.length} 条`
    g.appendChild(count)

    const nodeGroups = []
    lv.items.forEach((item) => {
      if (!item.values.length) {
        g.appendChild(
          svg('circle', {
            class: 'mkc-null__ring',
            cx: item.x + EMPTY_W / 2,
            cy,
            r: 11,
          }),
        )
        const t = svg('text', { class: 'mkc-null__text', x: item.x + EMPTY_W / 2, y: cy })
        t.textContent = '∅'
        g.appendChild(t)
        return
      }
      item.values.forEach((v, k) => {
        const left = item.x + k * (NODE_W + INNER_GAP)
        const nodeG = svg('g', { class: 'mkc-node' })
        nodeG.appendChild(
          svg('rect', {
            class: 'mkc-node__box',
            x: left,
            y: lv.top,
            width: NODE_W,
            height: NODE_H,
            rx: 7,
          }),
        )
        const t = svg('text', {
          class: 'mkc-node__value',
          x: left + NODE_W / 2,
          y: cy,
        })
        t.textContent = String(v)
        nodeG.appendChild(t)
        g.appendChild(nodeG)
        nodeGroups.push(nodeG)
      })
    })

    svgRoot.appendChild(g)
    rowGroups.push({ g, nodes: nodeGroups, countEl: count, level: r })
  })

  // ── 说明文字 + 控制条 ────────────────────────────────────────────────────
  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')
  root.appendChild(desc)

  const controls = createControls()
  root.appendChild(controls.root)

  host.textContent = ''
  host.appendChild(root)

  let observer = null

  function paint(_index, step) {
    const visible = step.levels.length

    rowGroups.forEach((row) => {
      row.g.classList.toggle('is-hidden', row.level >= visible)
      row.g.classList.toggle('is-active', row.level === step.activeLevel)
      // 只有"本步刚出现"的那一层做入场动画
      row.nodes.forEach((n) => {
        n.classList.toggle('is-new', row.level === step.activeLevel && step.phase !== 'init')
      })
      if (row.level < visible) {
        row.countEl.textContent = `${step.levels[row.level].lists.length} 条`
      }
    })

    linkGroups.forEach((link) => {
      link.g.classList.toggle('is-hidden', link.level >= visible)
      link.g.classList.toggle('is-on', link.level === step.activeLevel)
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
      delete host.dataset.mkcMounted
      instances -= 1
      if (instances <= 0) {
        document.getElementById(STYLE_ID)?.remove()
        removeChromeStyles()
      }
    },
  }
}

export default mountMergeKDCLists
