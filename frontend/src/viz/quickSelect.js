/**
 * quickSelect.js — 「数组中的第 K 个最大元素」(LeetCode 215) 推演动画的 SVG 渲染层。
 *
 * 逻辑全在 quickSelectSteps.js 里，这里只负责把一帧快照画出来。要画六块：
 *
 *   1. 数组格子行   —— 每格一个值 + 一个小下标（原地重排，所以值会跟着帧变）
 *   2. i 游标       —— 格子上方，绿色三角 + `i=n`，指向"<= 区"的下一个空位
 *   3. j 游标       —— 格子下方，橙色三角 + `j=n`，指向当前扫描位置
 *   4. 格子配色     —— 区间外灰掉 / "<= 区"淡绿 / 枢轴淡金 / 交换中的两格橙色
 *   5. 目标位标记   —— 格子下方一条金色虚线 + `目标位 n-k`（全程固定，是动画的靶心）
 *   6. 横幅         —— 第 k 大 / 目标位 / 轮次 / 区间 / 枢轴 / 答案
 *
 * ⚠️ **两条视觉通道分开用**（SKILL 坑 V 的推荐解法），避免状态打架：
 *   - 格子**底色** = 归属：区间外（灰）/ "<= 区"（绿）/ 枢轴（金）
 *   - 格子**边框** = 本帧强调：交换中（橙）/ 命中答案（金粗）
 *   fill 与 stroke 天然正交，不需要任何互斥代码。
 *
 * ⚠️ 通用坑（系列里踩过，这里直接规避）：
 *   A. 所有 CSS 变量都带字面量兜底。
 *   K. 分层绘制：格子 → 强调线 → 指针与标签（标签在最上层，绝不被压）。
 *   Q. 格宽按数组长度自适应。
 *   X. 横幅多段文字的 x 统一从左往右固定偏移，只有最右那段右对齐。
 *   4. 标签只用 ASCII —— `↔` `∅` 这类符号在 Consolas 里可能是豆腐块。
 */

import { buildQuickSelectSteps } from './quickSelectSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'qs-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const I_TAG_TOP = 152 // i 标签框顶（框高 22）
const I_TRI_TOP = 176 // i 三角顶 → 尖端 192 = CELL_Y - 6

const CELL_Y = 198
const CELL_H = 56
const CELL_BOTTOM = CELL_Y + CELL_H

const J_TRI_TOP = CELL_BOTTOM // j 三角（尖朝上）
const J_TAG_TOP = 272 // j 标签框顶

const TARGET_LINE_Y = 304
const TARGET_TEXT_Y = 322

const CELL_W_MAX = 58
const CELL_GAP = 6
const LABEL_X = 26
const AVAIL = 604

const PLAY_MS = 1250

const STYLES = `
.qs {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.qs__svg { width: 100%; height: auto; display: block; }

.qs-note {
  fill: var(--qs-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.qs-banner__box {
  fill: var(--qs-banner, #f4f3ef);
  stroke: var(--qs-line, #c3c9c2);
  stroke-width: 1.5;
}
.qs-banner__seg {
  fill: var(--qs-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qs-banner__ans {
  fill: var(--qs-gold, #c2872f);
  font-size: 19px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 格子 ─────────────────────────────────────────────────────────────── */
.qs-cell__box {
  fill: var(--qs-fill, #ffffff);
  stroke: var(--qs-line, #c3c9c2);
  stroke-width: 1.5;
}
.qs-cell__value {
  fill: var(--qs-ink, #1f2a24);
  font-size: 18px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qs-cell__idx {
  fill: var(--qs-dim, #9aa39c);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：已被淘汰出搜索区间 */
.qs-cell.is-outside .qs-cell__box {
  fill: var(--qs-dim-fill, #f0efea);
  stroke: var(--qs-line, #c3c9c2);
  stroke-dasharray: 4 3;
}
.qs-cell.is-outside .qs-cell__value { fill: var(--qs-dim, #9aa39c); }
.qs-cell.is-outside .qs-cell__idx { fill: var(--qs-dim, #9aa39c); }

/* 通道一（底色）：枢轴左边的"<= 区" */
.qs-cell.is-lezone .qs-cell__box {
  fill: var(--qs-ok-fill, #eef5f1);
}
/* 通道一（底色）：枢轴所在格 */
.qs-cell.is-pivot .qs-cell__box {
  fill: var(--qs-gold-fill, #fdf3e3);
}
.qs-cell.is-pivot .qs-cell__value { fill: var(--qs-gold, #c2872f); }

/* 通道二（边框）：本帧正在交换的两格 */
.qs-cell.is-swap .qs-cell__box {
  stroke: var(--qs-hot, #a45f45);
  stroke-width: 3;
}
.qs-cell.is-swap .qs-cell__value { fill: var(--qs-hot, #a45f45); }

/* 通道二（边框）：命中的答案格 */
.qs-cell.is-found .qs-cell__box {
  stroke: var(--qs-gold, #c2872f);
  stroke-width: 3.5;
}
.qs-cell.is-found .qs-cell__value { fill: var(--qs-gold, #c2872f); }

/* ── i / j 游标 ───────────────────────────────────────────────────────── */
.qs-i__tag { fill: var(--qs-ok, #3f6b57); }
.qs-i__tri { fill: var(--qs-ok, #3f6b57); }
.qs-i__text {
  fill: var(--qs-paper, #ffffff);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.qs-j__tag { fill: var(--qs-hot, #a45f45); }
.qs-j__tri { fill: var(--qs-hot, #a45f45); }
.qs-j__text {
  fill: var(--qs-paper, #ffffff);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 目标位标记 ───────────────────────────────────────────────────────── */
.qs-target__line {
  stroke: var(--qs-gold, #c2872f);
  stroke-width: 2;
  stroke-dasharray: 5 3;
}
.qs-target__tri { fill: var(--qs-gold, #c2872f); }
.qs-target__text {
  fill: var(--qs-gold, #c2872f);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.qs-empty__text {
  fill: var(--qs-muted, #657168);
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
 * @param {{ nums?: number[], k?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountQuickSelect(host, options = {}) {
  if (!host || host.dataset.qsMounted === '1') return { destroy() {} }
  host.dataset.qsMounted = '1'
  ensureStyles()

  const steps = buildQuickSelectSteps(options)
  const autoplay = options.autoplay !== false

  const arr0 = steps[0].arr
  const n = arr0.length

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz qs'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  if (n === 0) {
    const w0 = 620
    const h0 = 120
    const s0 = mk('svg', { class: 'viz__svg qs__svg', viewBox: `0 0 ${w0} ${h0}`, role: 'img' })
    const t0 = mk('text', { class: 'qs-empty__text', x: w0 / 2, y: h0 / 2 })
    t0.textContent = '空数组 —— 没有第 k 大'
    s0.appendChild(t0)
    stage.appendChild(s0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    ensureChromeStyles()
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.qsMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  // ── 格宽自适应 ───────────────────────────────────────────────────────────
  let cellW = CELL_W_MAX
  const needW0 = n * cellW + (n - 1) * CELL_GAP
  if (needW0 > AVAIL) {
    cellW = Math.max(16, Math.floor((AVAIL - (n - 1) * CELL_GAP) / n))
  }
  const rowW = n * cellW + (n - 1) * CELL_GAP
  const width = Math.max(660, LABEL_X * 2 + rowW)
  const ROW_LEFT = (width - rowW) / 2
  const cellX = (i) => ROW_LEFT + i * (cellW + CELL_GAP)
  const cellCX = (i) => cellX(i) + cellW / 2

  const BANNER_W = width - LABEL_X * 2
  const height = TARGET_TEXT_Y + 22

  const svgRoot = mk('svg', {
    class: 'viz__svg qs__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '第 K 大元素 快速选择推演动画',
  })
  stage.appendChild(svgRoot)

  // 分层：格子 → 强调线 → 指针与标签（标签在最上层，见坑 K）
  const cellLayer = mk('g', { class: 'qs-cells' })
  const markLayer = mk('g', { class: 'qs-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  // ── 顶部小字 + 横幅 ──────────────────────────────────────────────────────
  const note = mk('text', { class: 'qs-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = '第 k 大 = 升序第 n-k 位 —— 快速选择只递归一边，所以是 O(n) 不是 O(n log n)'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', {
      class: 'qs-banner__box',
      x: LABEL_X,
      y: BANNER_TOP,
      width: BANNER_W,
      height: BANNER_H,
      rx: 9,
    }),
  )
  // ⚠️ 四段文字的 x 统一从左往右（见坑 X），只有最右那段 text-anchor: end
  const segK = mk('text', { class: 'qs-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segRound = mk('text', { class: 'qs-banner__seg', x: LABEL_X + 200, y: BANNER_TOP + BANNER_H / 2 })
  const segPivot = mk('text', { class: 'qs-banner__seg', x: LABEL_X + 380, y: BANNER_TOP + BANNER_H / 2 })
  const ansVal = mk('text', {
    class: 'qs-banner__ans',
    x: LABEL_X + BANNER_W - 18,
    y: BANNER_TOP + BANNER_H / 2,
  })
  markLayer.appendChild(segK)
  markLayer.appendChild(segRound)
  markLayer.appendChild(segPivot)
  markLayer.appendChild(ansVal)

  // ── 格子 ──────────────────────────────────────────────────────────────────
  const cellEls = []
  for (let i = 0; i < n; i += 1) {
    const x = cellX(i)
    const g = mk('g', { class: 'qs-cell' })
    g.appendChild(mk('rect', { class: 'qs-cell__box', x, y: CELL_Y, width: cellW, height: CELL_H, rx: 6 }))
    const v = mk('text', { class: 'qs-cell__value', x: cellCX(i), y: CELL_Y + 22 })
    g.appendChild(v)
    const idx = mk('text', { class: 'qs-cell__idx', x: cellCX(i), y: CELL_Y + 42 })
    idx.textContent = String(i)
    g.appendChild(idx)
    cellLayer.appendChild(g)
    cellEls.push({ g, v, id: i })
  }

  // ── i 游标（上方，绿）────────────────────────────────────────────────────
  const iTri = mk('path', { class: 'qs-i__tri', d: 'M 0 0 L 0 0 L 0 0' })
  const iTag = mk('rect', { class: 'qs-i__tag', x: 0, y: I_TAG_TOP, width: 54, height: 22, rx: 6 })
  const iText = mk('text', { class: 'qs-i__text', x: 0, y: I_TAG_TOP + 11 })
  markLayer.appendChild(iTri)
  markLayer.appendChild(iTag)
  markLayer.appendChild(iText)

  // ── j 游标（下方，橙）────────────────────────────────────────────────────
  const jTri = mk('path', { class: 'qs-j__tri', d: 'M 0 0 L 0 0 L 0 0' })
  const jTag = mk('rect', { class: 'qs-j__tag', x: 0, y: J_TAG_TOP, width: 54, height: 22, rx: 6 })
  const jText = mk('text', { class: 'qs-j__text', x: 0, y: J_TAG_TOP + 11 })
  markLayer.appendChild(jTri)
  markLayer.appendChild(jTag)
  markLayer.appendChild(jText)

  // ── 目标位标记（全程固定）─────────────────────────────────────────────────
  const targetLine = mk('line', {
    class: 'qs-target__line',
    x1: 0,
    y1: CELL_BOTTOM + 2,
    x2: 0,
    y2: TARGET_LINE_Y,
  })
  const targetTri = mk('path', { class: 'qs-target__tri', d: 'M 0 0 L 0 0 L 0 0' })
  const targetText = mk('text', { class: 'qs-target__text', x: 0, y: TARGET_TEXT_Y })
  markLayer.appendChild(targetLine)
  markLayer.appendChild(targetTri)
  markLayer.appendChild(targetText)

  // ── 每帧重绘 ─────────────────────────────────────────────────────────────
  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const { arr, left, right, target, k, round } = step
    const phase = step.phase
    const isDone = phase === 'done'
    const found = step.found

    // 交换中的两格：**只有 scan 帧**标出来。
    // place 帧那次交换是"枢轴归位"，用枢轴的金色高亮表达就够了 —— 再叠橙色会打架。
    const swapSet = new Set()
    if (phase === 'scan' && step.swapPair && step.swapPair[0] !== step.swapPair[1]) {
      swapSet.add(step.swapPair[0])
      swapSet.add(step.swapPair[1])
    }

    for (const el of cellEls) {
      const id = el.id
      el.v.textContent = String(arr[id])
      const cls = ['qs-cell']
      // 通道一（底色）：归属
      if (id < left || id > right) cls.push('is-outside')
      else if (step.i !== null && id < step.i && id >= left) cls.push('is-lezone')
      if (step.pivotIdx !== null && id === step.pivotIdx && step.pivotValue !== null) {
        cls.push('is-pivot')
      }
      // 通道二（边框）：本帧强调
      if (swapSet.has(id)) cls.push('is-swap')
      if (found !== null && id === step.foundIdx) cls.push('is-found')
      el.g.setAttribute('class', cls.join(' '))
    }

    // ── i 游标 ──
    if (!isDone && step.i !== null && step.i >= 0 && step.i < n) {
      const cx = cellCX(step.i)
      const tip = CELL_Y - 6
      iTri.setAttribute('d', `M ${cx - 7} ${tip - 14} L ${cx + 7} ${tip - 14} L ${cx} ${tip} z`)
      iTag.setAttribute('x', cx - 27)
      iText.setAttribute('x', cx)
      iText.textContent = `i=${step.i}`
      iTri.style.opacity = '1'
      iTag.style.opacity = '1'
      iText.style.opacity = '1'
    } else {
      iTri.style.opacity = '0'
      iTag.style.opacity = '0'
      iText.style.opacity = '0'
    }

    // ── j 游标 ──
    if (!isDone && step.j !== null && step.j >= 0 && step.j < n) {
      const cx = cellCX(step.j)
      const tip = CELL_BOTTOM + 2
      jTri.setAttribute('d', `M ${cx - 7} ${tip + 14} L ${cx + 7} ${tip + 14} L ${cx} ${tip} z`)
      jTag.setAttribute('x', cx - 27)
      jText.setAttribute('x', cx)
      jText.textContent = `j=${step.j}`
      jTri.style.opacity = '1'
      jTag.style.opacity = '1'
      jText.style.opacity = '1'
    } else {
      jTri.style.opacity = '0'
      jTag.style.opacity = '0'
      jText.style.opacity = '0'
    }

    // ── 目标位标记 ──
    const tx = cellCX(target)
    targetLine.setAttribute('x1', tx)
    targetLine.setAttribute('x2', tx)
    targetTri.setAttribute('d', `M ${tx - 7} ${TARGET_LINE_Y - 12} L ${tx + 7} ${TARGET_LINE_Y - 12} L ${tx} ${TARGET_LINE_Y} z`)
    targetText.setAttribute('x', tx)
    targetText.textContent = `目标位 ${target}`

    // ── 横幅 ──
    segK.textContent = `第 ${k} 大 · 目标位 ${target}`
    segRound.textContent = round > 0 ? `第 ${round} 轮 · 区间 [${left}, ${right}]` : `区间 [${left}, ${right}]`
    if (found !== null) {
      segPivot.textContent = `枢轴归位 ${step.pivotIdx}`
    } else if (phase === 'scan' && step.swapPair && step.swapPair[0] !== step.swapPair[1]) {
      segPivot.textContent = `swap(${step.swapPair[0]}, ${step.swapPair[1]})`
    } else if (step.pivotValue !== null) {
      segPivot.textContent = `枢轴 ${step.pivotValue}`
    } else {
      segPivot.textContent = ''
    }
    ansVal.textContent = found === null ? '答案 ?' : `答案 ${found}`

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
      delete host.dataset.qsMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
