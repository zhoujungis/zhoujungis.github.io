/**
 * threeSum.js — 「三数之和」(LeetCode 15) 推演动画的 SVG 渲染层。
 *
 * 逻辑全在 threeSumSteps.js 里，这里只负责把一帧快照画出来。要画五块：
 *
 *   1. 顶部小字      —— 原数组 + 「已排序」
 *   2. 数组格子行    —— 每格一个值；`i` 锚点橙色、`L` 绿色、`R` 蓝紫、
 *                        本帧命中的三格金色、被去重跳过的格子灰虚线
 *   3. 三指针        —— `i` 在上方（三角朝下），`L` / `R` 在下方两行
 *                        （⚠️ 分两行是刻意的：`L` 和 `R` 相邻时同一行会撞在一起）
 *   4. 三数之和横幅  —— `(-1) + (-1) + 2 = 0` 加右侧判定
 *   5. 结果区        —— 已收集的三元组，横向 chips
 *
 * ⚠️ 通用坑（系列里踩过，这里直接规避）：
 *   A. 所有 CSS 变量都带字面量兜底 —— viz-shot.mjs 单独序列化 SVG 时，
 *      外层 div 上的变量解析不了，不带兜底整条样式失效。
 *   K. 分层绘制：底 → 格子 → 指针与标签，别让后画的色块盖住先画的文字。
 *   L. 「指针指向的位置」和「被强调的答案」是两种状态，样式必须分开
 *      （LC 124 把 is-apex / is-onpath 合并后，真正的拱顶反而被淹没）。
 *   Q. 格子宽度按数组长度自适应，长数组要缩小而不是溢出画布。
 */

import { buildThreeSumSteps } from './threeSumSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'tz-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const CELL_H = 56
const CELL_W_MAX = 76
const CELL_GAP_MAX = 8

const NOTE_Y = 66             // 顶部小字
const CELL_Y = 128
const I_PIN_DY = 26           // i 指针三角离格子上沿

const L_TAG_TOP = 196         // L 标签（第一行）
const R_TAG_TOP = 234         // R 标签（第二行）—— 和 L 错开，避免相邻时相撞
const TAG_H = 22
// ⚠️ 宽度按最长标签反推：`L=R=5`（l 和 r 落到同一格时会合并成这个）有 5 个字符，
// 按 12.5px 等宽算约 38px，再留左右各 8px 内边距 → 54 才不裁字。
const TAG_W = 54

const BANNER_TOP = 284
const BANNER_H = 48

const LIST_TITLE_Y = 358
const CHIP_TOP = 368
const CHIP_H = 40

const LABEL_X = 26
const AVAIL = 604             // 格子行可用的最大宽度

const PLAY_MS = 1180          // 15 帧，节奏比 LC 1 快一点

const STYLES = `
.tz {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.tz__svg { width: 100%; height: auto; display: block; }

/* ── 顶部小字 ─────────────────────────────────────────────────────────── */
.tz-note {
  fill: var(--tz-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 数组格子 ─────────────────────────────────────────────────────────── */
.tz-cell__box {
  fill: var(--tz-fill, #ffffff);
  stroke: var(--tz-line, #c3c9c2);
  stroke-width: 1.5;
}
.tz-cell__value {
  fill: var(--tz-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-cell__ring {
  fill: none;
  stroke: var(--tz-gold, #c2872f);
  stroke-width: 2;
  opacity: 0;
}
/* 外层锚点 i */
.tz-cell.is-i .tz-cell__box {
  fill: var(--tz-hot-fill, #fdf1ec);
  stroke: var(--tz-hot, #a45f45);
  stroke-width: 3;
}
.tz-cell.is-i .tz-cell__value { fill: var(--tz-hot, #a45f45); }
/* 左指针 L */
.tz-cell.is-l .tz-cell__box {
  fill: var(--tz-ok-fill, #eef5f1);
  stroke: var(--tz-ok, #3f6b57);
  stroke-width: 3;
}
.tz-cell.is-l .tz-cell__value { fill: var(--tz-ok, #3f6b57); }
/* 右指针 R */
.tz-cell.is-r .tz-cell__box {
  fill: var(--tz-cool-fill, #eef1f7);
  stroke: var(--tz-cool, #4a5f8a);
  stroke-width: 3;
}
.tz-cell.is-r .tz-cell__value { fill: var(--tz-cool, #4a5f8a); }
/* 本帧命中的三个数（金色 + 外环）—— 注意和上面的"指针状态"分开，见坑 L */
.tz-cell.is-hit .tz-cell__box {
  fill: var(--tz-gold-fill, #fdf6e8);
  stroke: var(--tz-gold, #c2872f);
  stroke-width: 3;
}
.tz-cell.is-hit .tz-cell__value { fill: var(--tz-gold, #c2872f); }
.tz-cell.is-hit .tz-cell__ring { opacity: 1; }
/* 被去重跳过的格子（虚化） */
.tz-cell.is-dup .tz-cell__box {
  fill: var(--tz-dim-fill, #f4f3ef);
  stroke: var(--tz-dim, #b9b9b3);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.tz-cell.is-dup .tz-cell__value { fill: var(--tz-dim, #b9b9b3); }

/* ── 指针标签 ─────────────────────────────────────────────────────────── */
.tz-pin__tag {
  fill: var(--tz-hot, #a45f45);
}
.tz-pin__tag.is-l { fill: var(--tz-ok, #3f6b57); }
.tz-pin__tag.is-r { fill: var(--tz-cool, #4a5f8a); }
.tz-pin__text {
  fill: var(--tz-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-pin__tick {
  stroke: var(--tz-hot, #a45f45);
  stroke-width: 2;
}
.tz-pin__tick.is-l { stroke: var(--tz-ok, #3f6b57); }
.tz-pin__tick.is-r { stroke: var(--tz-cool, #4a5f8a); }

/* ── 三数之和横幅 ─────────────────────────────────────────────────────── */
.tz-banner__box {
  fill: var(--tz-banner-fill, #f4f2ec);
  stroke: var(--tz-line, #c3c9c2);
  stroke-width: 1.5;
}
.tz-banner__box.is-neg { fill: var(--tz-ok-fill, #eef5f1); stroke: var(--tz-ok, #3f6b57); }
.tz-banner__box.is-pos { fill: var(--tz-cool-fill, #eef1f7); stroke: var(--tz-cool, #4a5f8a); }
.tz-banner__box.is-zero { fill: var(--tz-gold-fill, #fdf6e8); stroke: var(--tz-gold, #c2872f); stroke-width: 2; }
.tz-banner__expr {
  fill: var(--tz-ink, #1f2a24);
  font-size: 16px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-banner__verdict {
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--tz-ink, #1f2a24);
}
.tz-banner__verdict.is-neg { fill: var(--tz-ok, #3f6b57); }
.tz-banner__verdict.is-pos { fill: var(--tz-cool, #4a5f8a); }
.tz-banner__verdict.is-zero { fill: var(--tz-gold, #c2872f); }

/* ── 结果 chips ───────────────────────────────────────────────────────── */
.tz-list__title {
  fill: var(--tz-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-chip__box {
  fill: var(--tz-gold-fill, #fdf6e8);
  stroke: var(--tz-gold, #c2872f);
  stroke-width: 1.5;
}
.tz-chip__text {
  fill: var(--tz-gold, #c2872f);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.tz-list__empty {
  fill: var(--tz-dim, #b9b9b3);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.tz-empty__text {
  fill: var(--tz-muted, #657168);
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

/** 负数加括号，算式才读得下去。 */
const fmtTerm = (v) => (v < 0 ? `(${v})` : `${v}`)

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{
 *   nums?: number[],
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 */
export function mountThreeSum(host, options = {}) {
  if (!host || host.dataset.tzMounted === '1') return { destroy() {} }
  host.dataset.tzMounted = '1'
  ensureStyles()

  const steps = buildThreeSumSteps(options)
  const autoplay = options.autoplay !== false

  // 坐标系一律以**排序后**的数组为准（状态机排好序后放在每帧的 arr 里）
  const arr = steps[0].arr
  const original = steps[0].original
  const n = arr.length

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz tz'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  // ── 少于 3 个数：只有一个 done 帧 ────────────────────────────────────────
  if (n < 3) {
    const w0 = 620
    const h0 = 120
    const s0 = mk('svg', { class: 'viz__svg tz__svg', viewBox: `0 0 ${w0} ${h0}`, role: 'img' })
    const t0 = mk('text', { class: 'tz-empty__text', x: w0 / 2, y: h0 / 2 })
    t0.textContent = `数组只有 ${n} 个数，凑不出三元组`
    s0.appendChild(t0)
    stage.appendChild(s0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.tzMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  // ── 格子尺寸自适应 ───────────────────────────────────────────────────────
  let cellW = CELL_W_MAX
  let cellGap = CELL_GAP_MAX
  const needW0 = n * cellW + (n - 1) * cellGap
  if (needW0 > AVAIL) {
    const k = AVAIL / needW0
    cellW = Math.max(26, Math.floor(cellW * k))
    cellGap = Math.max(3, Math.floor(cellGap * k))
  }
  // 字号跟着格子宽度走，长数字不溢出
  const longest = arr.reduce((m, v) => Math.max(m, String(v).length), 1)
  const cellFont = Math.max(11, Math.min(20, Math.floor((cellW - 12) / Math.max(longest, 3)) + 6))

  const rowW = n * cellW + (n - 1) * cellGap
  const width = Math.max(660, LABEL_X * 2 + rowW)
  const ROW_LEFT = (width - rowW) / 2
  const cellX = (i) => ROW_LEFT + i * (cellW + cellGap)
  const cellCX = (i) => cellX(i) + cellW / 2

  const CELL_BOTTOM = CELL_Y + CELL_H
  const BANNER_W = width - LABEL_X * 2
  const height = CHIP_TOP + CHIP_H + 22

  const svgRoot = mk('svg', {
    class: 'viz__svg tz__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '三数之和推演动画',
  })
  stage.appendChild(svgRoot)

  // 分层：顶部小字 → 格子 → 指针/标签/横幅/结果（见文件头坑 K）
  const noteLayer = mk('g', { class: 'tz-notes' })
  const cellLayer = mk('g', { class: 'tz-cells' })
  const markLayer = mk('g', { class: 'tz-marks' })
  svgRoot.appendChild(noteLayer)
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  // ── 顶部小字 ─────────────────────────────────────────────────────────────
  const note = mk('text', { class: 'tz-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = `原数组 [${original.join(', ')}] · 已排序 → [${arr.join(', ')}]`
  noteLayer.appendChild(note)

  // ── 数组格子 ─────────────────────────────────────────────────────────────
  const cellEls = []
  for (let i = 0; i < n; i += 1) {
    const x = cellX(i)
    const g = mk('g', { class: 'tz-cell' })
    g.appendChild(
      mk('rect', {
        class: 'tz-cell__ring',
        x: x - 5,
        y: CELL_Y - 5,
        width: cellW + 10,
        height: CELL_H + 10,
        rx: 11,
      }),
    )
    g.appendChild(mk('rect', { class: 'tz-cell__box', x, y: CELL_Y, width: cellW, height: CELL_H, rx: 8 }))
    const v = mk('text', {
      class: 'tz-cell__value',
      x: cellCX(i),
      y: CELL_Y + CELL_H / 2,
      style: `font-size:${cellFont}px`,
    })
    v.textContent = String(arr[i])
    g.appendChild(v)
    cellLayer.appendChild(g)
    cellEls.push({ g, id: i })
  }

  /** 画一个指针标签 + 一条引线。anchorY = 标签顶边；fromY = 引线起点。 */
  function makePin(cls) {
    const tick = mk('line', { class: `tz-pin__tick ${cls}`, x1: 0, y1: 0, x2: 0, y2: 0 })
    const tag = mk('rect', { class: `tz-pin__tag ${cls}`, x: 0, y: 0, width: TAG_W, height: TAG_H, rx: 6 })
    const text = mk('text', { class: 'tz-pin__text', x: 0, y: 0 })
    markLayer.appendChild(tick)
    markLayer.appendChild(tag)
    markLayer.appendChild(text)
    return { tick, tag, text }
  }

  // i 指针：标签在格子上方，三角朝下指向格子
  const iTri = mk('path', { class: 'tz-pin__tag', d: 'M 0 0 L 0 0 L 0 0' })
  const iTag = mk('rect', { class: 'tz-pin__tag', x: 0, y: 0, width: TAG_W, height: TAG_H, rx: 6 })
  const iText = mk('text', { class: 'tz-pin__text', x: 0, y: 0 })
  markLayer.appendChild(iTri)
  markLayer.appendChild(iTag)
  markLayer.appendChild(iText)

  const lPin = makePin('is-l')
  const rPin = makePin('is-r')

  // ── 三数之和横幅 ─────────────────────────────────────────────────────────
  const bannerBox = mk('rect', {
    class: 'tz-banner__box',
    x: LABEL_X,
    y: BANNER_TOP,
    width: BANNER_W,
    height: BANNER_H,
    rx: 9,
  })
  const bannerExpr = mk('text', { class: 'tz-banner__expr', x: LABEL_X + 16, y: BANNER_TOP + BANNER_H / 2 })
  const bannerVerdict = mk('text', {
    class: 'tz-banner__verdict',
    x: LABEL_X + BANNER_W - 16,
    y: BANNER_TOP + BANNER_H / 2,
  })
  markLayer.appendChild(bannerBox)
  markLayer.appendChild(bannerExpr)
  markLayer.appendChild(bannerVerdict)

  // ── 结果 chips ───────────────────────────────────────────────────────────
  const listTitle = mk('text', { class: 'tz-list__title', x: LABEL_X, y: LIST_TITLE_Y })
  markLayer.appendChild(listTitle)
  const listEmpty = mk('text', { class: 'tz-list__empty', x: LABEL_X, y: CHIP_TOP + CHIP_H / 2 })
  listEmpty.textContent = '（还没有找到任何一组）'
  markLayer.appendChild(listEmpty)

  // chip 宽度按最长的那组算，保证不裁字
  const chipFontSize = 15
  const chipTextW = steps
    .flatMap((s) => s.results)
    .reduce((m, t) => Math.max(m, `[${t.join(', ')}]`.length), 0)
  const chipW = Math.min(150, Math.max(74, Math.round(chipTextW * chipFontSize * 0.62) + 26))
  const chipGap = 10
  const maxChips = Math.max(1, Math.floor((AVAIL + chipGap) / (chipW + chipGap)))
  const chipEls = []
  for (let k = 0; k < maxChips; k += 1) {
    const x = LABEL_X + k * (chipW + chipGap)
    const g = mk('g', { class: 'tz-chip' })
    g.appendChild(mk('rect', { class: 'tz-chip__box', x, y: CHIP_TOP, width: chipW, height: CHIP_H, rx: 8 }))
    const t = mk('text', {
      class: 'tz-chip__text',
      x: x + chipW / 2,
      y: CHIP_TOP + CHIP_H / 2,
      style: `font-size:${chipFontSize}px`,
    })
    g.appendChild(t)
    markLayer.appendChild(g)
    chipEls.push({ g, t })
  }

  // 结果多于 maxChips 时的省略提示
  const chipMore = mk('text', {
    class: 'tz-list__empty',
    x: LABEL_X + maxChips * (chipW + chipGap),
    y: CHIP_TOP + CHIP_H / 2,
  })
  markLayer.appendChild(chipMore)

  // ── 每帧重绘 ─────────────────────────────────────────────────────────────
  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const i = step.i
    const l = step.l
    const r = step.r
    const phase = step.phase
    // 收尾帧把指针和高亮全部收起，让画面聚焦在"结果"上。
    // （⚠️ 状态机的 done 帧仍然保留 i / l / r 的**真实值** —— 那是给单测用的，
    //   渲染层怎么画是另一回事。见 SKILL 里 LC 3 的收尾帧约定。）
    const isDone = phase === 'done'
    // L 和 R 落到同一格时（内层即将收尾），标签合并成 `L=R=n`，否则会重叠
    const lrSame = l >= 0 && l === r

    // 本帧被强调的三个格子（命中帧用 sumL / sumR，因为 l / r 是移动后的值）
    const hitSet = new Set()
    if (phase === 'hit' && step.sumL !== null) {
      hitSet.add(step.i)
      hitSet.add(step.sumL)
      hitSet.add(step.sumR)
    }
    // 被去重跳过的格子（整段，含两端）
    const dupSet = new Set()
    if (step.dedupL) {
      for (let k = step.dedupL.from; k <= step.dedupL.to; k += 1) dupSet.add(k)
    }
    if (step.dedupR) {
      for (let k = step.dedupR.from; k <= step.dedupR.to; k += 1) dupSet.add(k)
    }
    // i 去重跳过的那一格：这一格的语义是「整个被跳过了」，
    // 所以只画灰虚线，不再叠橙色锚点（锚点靠上方的 `i=` 标签指示）。
    const skipI = phase === 'skip-i' ? step.i : null

    for (const el of cellEls) {
      const { g, id } = el
      if (isDone) {
        g.setAttribute('class', 'tz-cell')
        continue
      }
      const cls = ['tz-cell']
      if (dupSet.has(id) || id === skipI) cls.push('is-dup')
      // 指针状态（命中强调和 i 锚点优先级最高）
      if (hitSet.has(id)) cls.push('is-hit')
      if (id === l && l >= 0) cls.push('is-l')
      if (id === r && r >= 0 && !lrSame) cls.push('is-r')
      if (id === i && i >= 0 && id !== skipI) cls.push('is-i')
      g.setAttribute('class', cls.join(' '))
    }

    // ── i 指针（上方）──
    if (!isDone && i >= 0 && i < n) {
      const cx = cellCX(i)
      const triTip = CELL_Y - 2
      const triTop = triTip - 11
      iTri.setAttribute('d', `M ${cx - 7} ${triTop} L ${cx + 7} ${triTop} L ${cx} ${triTip} z`)
      iTri.style.opacity = '1'
      iTag.setAttribute('x', cx - TAG_W / 2)
      iTag.setAttribute('y', triTop - TAG_H - 5)
      iText.setAttribute('x', cx)
      iText.setAttribute('y', triTop - TAG_H / 2 - 5)
      iText.textContent = `i=${i}`
      iTag.style.opacity = '1'
      iText.style.opacity = '1'
    } else {
      iTri.style.opacity = '0'
      iTag.style.opacity = '0'
      iText.style.opacity = '0'
    }

    // ── L / R 指针（下方两行）──
    const pin = (p, idx, top, label) => {
      if (idx < 0 || idx >= n) {
        p.tick.style.opacity = '0'
        p.tag.style.opacity = '0'
        p.text.style.opacity = '0'
        return
      }
      const cx = cellCX(idx)
      p.tick.setAttribute('x1', cx)
      p.tick.setAttribute('x2', cx)
      p.tick.setAttribute('y1', CELL_BOTTOM + 3)
      p.tick.setAttribute('y2', top - 3)
      p.tick.style.opacity = '1'
      p.tag.setAttribute('x', cx - TAG_W / 2)
      p.tag.setAttribute('y', top)
      p.text.setAttribute('x', cx)
      p.text.setAttribute('y', top + TAG_H / 2)
      p.text.textContent = `${label}=${idx}`
      p.tag.style.opacity = '1'
      p.text.style.opacity = '1'
    }
    if (isDone) {
      pin(lPin, -1, L_TAG_TOP, 'L')
      pin(rPin, -1, R_TAG_TOP, 'R')
    } else if (lrSame) {
      // 同格时只画一个标签，写成 `L=R=5`（同 LC 3 的单格窗口处理）
      pin(lPin, l, L_TAG_TOP, 'L=R')
      pin(rPin, -1, R_TAG_TOP, 'R')
    } else {
      pin(lPin, l, L_TAG_TOP, 'L')
      pin(rPin, r, R_TAG_TOP, 'R')
    }

    // ── 三数之和横幅 ──
    let boxCls = 'tz-banner__box'
    let verdictCls = 'tz-banner__verdict'
    if (step.sum === null) {
      bannerExpr.textContent =
        phase === 'init'
          ? `等待开始 · 共 ${n} 个数`
          : phase === 'pick-i'
            ? `固定 nums[${i}] = ${arr[i]}，在 [${l}..${r}] 里找和为 ${-arr[i]} 的两个数`
            : phase === 'skip-i'
              ? `nums[${i}] = ${arr[i]} 与上一轮同值 —— 整轮跳过`
              : phase === 'prune'
                ? `nums[${i}] = ${arr[i]} > 0 —— 外层提前结束`
                : step.results.length === 0
                  ? '没有和为 0 的三元组'
                  : `结束 · 共 ${step.results.length} 组答案`
      bannerVerdict.textContent =
        phase === 'pick-i' ? '双指针夹逼' : phase === 'done' ? `${step.results.length} 组` : ''
    } else {
      bannerExpr.textContent =
        `${fmtTerm(arr[i])} + ${fmtTerm(arr[step.sumL])} + ${fmtTerm(arr[step.sumR])} = ${step.sum}`
      if (step.sum < 0) {
        boxCls += ' is-neg'
        verdictCls += ' is-neg'
        bannerVerdict.textContent = '< 0 · 左指针右移'
      } else if (step.sum > 0) {
        boxCls += ' is-pos'
        verdictCls += ' is-pos'
        bannerVerdict.textContent = '> 0 · 右指针左移'
      } else {
        boxCls += ' is-zero'
        verdictCls += ' is-zero'
        bannerVerdict.textContent = '= 0 · 命中'
      }
    }
    bannerBox.setAttribute('class', boxCls)
    bannerVerdict.setAttribute('class', verdictCls)

    // ── 结果 chips ──
    const got = step.results
    listTitle.textContent = `已收集的三元组（${got.length} 组）`
    listEmpty.style.opacity = got.length === 0 ? '1' : '0'
    chipEls.forEach((chip, k) => {
      const t = got[k]
      if (t === undefined) {
        chip.g.style.opacity = '0'
        return
      }
      chip.g.style.opacity = '1'
      chip.t.textContent = `[${t.join(', ')}]`
    })
    if (got.length > maxChips) {
      chipMore.textContent = `+${got.length - maxChips}`
      chipMore.style.opacity = '1'
    } else {
      chipMore.style.opacity = '0'
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
      delete host.dataset.tzMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
