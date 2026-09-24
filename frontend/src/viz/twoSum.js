/**
 * twoSum.js — 「两数之和」(LeetCode 1) 推演动画的 SVG 渲染层。
 *
 * 逻辑全在 twoSumSteps.js 里，这里只负责把一帧快照画出来。要画四块：
 *
 *   1. 数组格子行    —— 每个格子是 `值`；**已登记进表**的淡绿底，
 *                        **当前元素**橙色粗边，**答案的两元素**绿色粗边 + 外环
 *   2. 答案连线      —— 命中时，在两个答案格子下方画一条弧线把它们连起来
 *   3. 哈希表        —— 值 → 下标 的卡片表（这就是"边查边存"的那张表）
 *   4. 结果横幅 + 说明 + 控制条
 *
 * ⚠️ 通用坑（系列里踩过，这里直接规避）：
 *   A. 所有 CSS 变量都带字面量兜底 —— viz-shot.mjs 单独序列化 SVG 时，
 *      外层 div 上的变量解析不了，不带兜底整条样式失效。
 *   K. 分层绘制：底（弧线）→ 格子 → 标签文字，别让后画的色块盖住先画的文字。
 *   Q. 格子宽度按数组长度自适应，长数组要缩小而不是溢出画布。
 */

import { buildTwoSumSteps } from './twoSumSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'ts-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const CELL_H = 56
const CELL_W_MAX = 76
const CELL_GAP_MAX = 8

const CELL_Y = 130
const I_PIN_DY = 20          // i 指针在格子上方多高
const IDX_DY = 16            // 下标在格子下方多高

const ARC_Y = 214            // 答案弧线起笔的 y
const ARC_APEX_DY = 26       // 拱顶再往下多少

const TABLE_TITLE_Y = 272
const CARD_Y = 288
const CARD_H = 48

const LABEL_X = 26
const BANNER_H = 52
const BANNER_GAP = 36

const PLAY_MS = 1400         // 这题帧数少（6 帧），单帧停久一点才看得清

const AVAIL = 604            // 格子行可用的最大宽度

const STYLES = `
.ts {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ts__svg { width: 100%; height: auto; display: block; }

/* ── 数组格子 ─────────────────────────────────────────────────────────── */
.ts-cell__box {
  fill: var(--ts-fill, #ffffff);
  stroke: var(--ts-line, #c3c9c2);
  stroke-width: 1.5;
}
.ts-cell__value {
  fill: var(--ts-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-cell__idx {
  fill: var(--ts-muted, #657168);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 已经登记进哈希表 */
.ts-cell.is-seen .ts-cell__box {
  fill: var(--ts-ok-fill, #eef5f1);
  stroke: var(--ts-ok, #3f6b57);
  stroke-width: 1.5;
}
/* 当前正在处理的元素 */
.ts-cell.is-cur .ts-cell__box {
  fill: var(--ts-hot-fill, #fdf1ec);
  stroke: var(--ts-hot, #a45f45);
  stroke-width: 3;
}
.ts-cell.is-cur .ts-cell__value {
  fill: var(--ts-hot, #a45f45);
}
/* 答案的两个元素 */
.ts-cell.is-answer .ts-cell__box {
  fill: var(--ts-gold-fill, #fdf6e8);
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 3;
}
.ts-cell.is-answer .ts-cell__value {
  fill: var(--ts-gold, #c2872f);
}
.ts-cell__ring {
  fill: none;
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 2;
  opacity: 0;
}
.ts-cell.is-answer .ts-cell__ring { opacity: 1; }

/* ── i 指针 ───────────────────────────────────────────────────────────── */
.ts-ipin__tri { fill: var(--ts-hot, #a45f45); }
.ts-ipin__text {
  fill: var(--ts-hot, #a45f45);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 答案连线 ─────────────────────────────────────────────────────────── */
.ts-arc {
  fill: none;
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 2.5;
  stroke-dasharray: 6 4;
}

/* ── 哈希表 ───────────────────────────────────────────────────────────── */
.ts-table__title {
  fill: var(--ts-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-card__box {
  fill: var(--ts-fill, #ffffff);
  stroke: var(--ts-line, #c3c9c2);
  stroke-width: 1.5;
}
.ts-card__key {
  fill: var(--ts-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-card__val {
  fill: var(--ts-muted, #657168);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 这一帧刚存进去的那张卡 */
.ts-card.is-new .ts-card__box {
  fill: var(--ts-ok-fill, #eef5f1);
  stroke: var(--ts-ok, #3f6b57);
  stroke-width: 2.5;
}
.ts-card.is-new .ts-card__key { fill: var(--ts-ok, #3f6b57); }
/* 被查中的那张卡 */
.ts-card.is-hit .ts-card__box {
  fill: var(--ts-gold-fill, #fdf6e8);
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 3;
}
.ts-card.is-hit .ts-card__key { fill: var(--ts-gold, #c2872f); }
.ts-card.is-hit .ts-card__val {
  fill: var(--ts-gold, #c2872f);
  font-weight: 700;
}
.ts-table__empty {
  fill: var(--ts-dim, #b9b9b3);
  font-size: 13px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.ts-banner__box {
  fill: var(--ts-banner-fill, #f4f2ec);
  stroke: var(--ts-line, #c3c9c2);
  stroke-width: 1.5;
}
.ts-banner__box.is-answer {
  fill: var(--ts-gold-fill, #fdf6e8);
  stroke: var(--ts-gold, #c2872f);
  stroke-width: 2;
}
.ts-banner__lead {
  fill: var(--ts-ink, #1f2a24);
  font-size: 15.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-banner__label {
  fill: var(--ts-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ts-banner__ans {
  fill: var(--ts-gold, #c2872f);
  font-size: 21px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ts-empty__text {
  fill: var(--ts-muted, #657168);
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
 *   nums?: number[],
 *   target?: number,
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 */
export function mountTwoSum(host, options = {}) {
  if (!host || host.dataset.tsMounted === '1') return { destroy() {} }
  host.dataset.tsMounted = '1'
  ensureStyles()

  const steps = buildTwoSumSteps(options)
  const autoplay = options.autoplay !== false

  const nums = Array.isArray(options.nums) ? options.nums : [2, 7, 11, 15]
  const target = Number.isInteger(options.target) ? options.target : 9
  const n = nums.length

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz ts'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  // ── 空数组 ───────────────────────────────────────────────────────────────
  if (n === 0) {
    const w0 = 620
    const h0 = 120
    const s0 = mk('svg', { class: 'viz__svg ts__svg', viewBox: `0 0 ${w0} ${h0}`, role: 'img' })
    const t0 = mk('text', { class: 'ts-empty__text', x: w0 / 2, y: h0 / 2 })
    t0.textContent = '空数组 —— 凑不出两个数'
    s0.appendChild(t0)
    stage.appendChild(s0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.tsMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  // ── 格子尺寸自适应 ───────────────────────────────────────────────────────
  let cellW = CELL_W_MAX
  let cellGap = CELL_GAP_MAX
  let cellFont = 20
  const needW0 = n * cellW + (n - 1) * cellGap
  if (needW0 > AVAIL) {
    const k = AVAIL / needW0
    cellW = Math.max(28, Math.floor(cellW * k))
    cellGap = Math.max(4, Math.floor(cellGap * k))
    cellFont = Math.max(12, Math.round(cellFont * k))
  }
  const rowW = n * cellW + (n - 1) * cellGap

  const PAD = 34
  const width = Math.max(660, LABEL_X * 2 + rowW + PAD * 2)
  const ROW_LEFT = (width - rowW) / 2
  const cellX = (i) => ROW_LEFT + i * (cellW + cellGap)

  const CELL_BOTTOM = CELL_Y + CELL_H
  const BANNER_TOP = CARD_Y + CARD_H + BANNER_GAP
  const BANNER_W = Math.min(620, width - LABEL_X * 2)
  const height = BANNER_TOP + BANNER_H + 26

  const svgRoot = mk('svg', {
    class: 'viz__svg ts__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '两数之和推演动画',
  })
  stage.appendChild(svgRoot)

  // 分层：弧线 → 格子 → 指针与标签（见文件头坑 K）
  const arcLayer = mk('g', { class: 'ts-arcs' })
  const cellLayer = mk('g', { class: 'ts-cells' })
  const markLayer = mk('g', { class: 'ts-marks' })
  svgRoot.appendChild(arcLayer)
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  // ── 答案连线 ─────────────────────────────────────────────────────────────
  const answerArc = mk('path', { class: 'ts-arc', d: 'M 0 0' })
  arcLayer.appendChild(answerArc)

  // ── 数组格子 ─────────────────────────────────────────────────────────────
  const cellEls = []
  for (let i = 0; i < n; i += 1) {
    const x = cellX(i)
    const g = mk('g', { class: 'ts-cell' })
    g.appendChild(
      mk('rect', { class: 'ts-cell__ring', x: x - 5, y: CELL_Y - 5, width: cellW + 10, height: CELL_H + 10, rx: 11 }),
    )
    g.appendChild(
      mk('rect', { class: 'ts-cell__box', x, y: CELL_Y, width: cellW, height: CELL_H, rx: 8 }),
    )
    const v = mk('text', {
      class: 'ts-cell__value',
      x: x + cellW / 2,
      y: CELL_Y + CELL_H / 2,
      style: `font-size:${cellFont}px`,
    })
    v.textContent = String(nums[i])
    g.appendChild(v)
    const idx = mk('text', { class: 'ts-cell__idx', x: x + cellW / 2, y: CELL_BOTTOM + IDX_DY })
    idx.textContent = String(i)
    g.appendChild(idx)
    cellLayer.appendChild(g)
    cellEls.push({ g, id: i })
  }

  // ── i 指针 ───────────────────────────────────────────────────────────────
  const iTri = mk('path', { class: 'ts-ipin__tri', d: 'M 0 0 L 0 0 L 0 0' })
  const iText = mk('text', { class: 'ts-ipin__text', x: 0, y: 0 })
  iText.textContent = 'i'
  markLayer.appendChild(iTri)
  markLayer.appendChild(iText)

  // ── 哈希表 ───────────────────────────────────────────────────────────────
  const tableTitle = mk('text', { class: 'ts-table__title', x: LABEL_X, y: TABLE_TITLE_Y })
  tableTitle.textContent = 'seen：见过的值 → 它的下标'
  markLayer.appendChild(tableTitle)

  const tableEmpty = mk('text', { class: 'ts-table__empty', x: LABEL_X, y: CARD_Y + CARD_H / 2 })
  tableEmpty.textContent = '（表还是空的）'
  markLayer.appendChild(tableEmpty)

  // 表里最多装 n 个条目 —— 预留够位置，按需显示
  const cardGap = n > 8 ? 6 : 10
  const cardW = Math.max(40, Math.min(74, Math.floor((AVAIL - (Math.max(1, n) - 1) * cardGap) / Math.max(1, n))))
  const cardEls = []
  for (let i = 0; i < n; i += 1) {
    const x = LABEL_X + i * (cardW + cardGap)
    const g = mk('g', { class: 'ts-card' })
    g.appendChild(mk('rect', { class: 'ts-card__box', x, y: CARD_Y, width: cardW, height: CARD_H, rx: 8 }))
    const k = mk('text', { class: 'ts-card__key', x: x + cardW / 2, y: CARD_Y + 17 })
    g.appendChild(k)
    const val = mk('text', { class: 'ts-card__val', x: x + cardW / 2, y: CARD_Y + 35 })
    g.appendChild(val)
    markLayer.appendChild(g)
    cardEls.push({ g, k, val })
  }

  // ── 结果横幅 ─────────────────────────────────────────────────────────────
  const bannerBox = mk('rect', {
    class: 'ts-banner__box',
    x: LABEL_X,
    y: BANNER_TOP,
    width: BANNER_W,
    height: BANNER_H,
    rx: 9,
  })
  svgRoot.appendChild(bannerBox)
  const bannerLead = mk('text', {
    class: 'ts-banner__lead',
    x: LABEL_X + 16,
    y: BANNER_TOP + BANNER_H / 2,
  })
  svgRoot.appendChild(bannerLead)
  const bannerLabel = mk('text', {
    class: 'ts-banner__label',
    x: LABEL_X + BANNER_W - 84,
    y: BANNER_TOP + BANNER_H / 2,
  })
  bannerLabel.textContent = '答案下标'
  svgRoot.appendChild(bannerLabel)
  const bannerAns = mk('text', {
    class: 'ts-banner__ans',
    x: LABEL_X + BANNER_W - 16,
    y: BANNER_TOP + BANNER_H / 2,
  })
  bannerAns.textContent = '—'
  svgRoot.appendChild(bannerAns)

  // ── 每帧重绘 ─────────────────────────────────────────────────────────────
  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const seen = step.seen ?? {}
    const answer = step.answer
    const cur = step.i
    const answerSet = new Set(answer ? [answer[0], answer[1]] : [])
    const seenVals = new Set(Object.keys(seen).map(Number))

    // ── 格子状态 ──
    for (const el of cellEls) {
      const { g, id } = el
      const cls = ['ts-cell']
      if (seenVals.has(nums[id])) cls.push('is-seen')
      if (id === cur && step.phase !== 'done') cls.push('is-cur')
      if (answerSet.has(id)) cls.push('is-answer')
      g.setAttribute('class', cls.join(' '))
    }

    // ── i 指针 ──
    if (cur >= 0 && cur < n && step.phase !== 'done') {
      const cx = cellX(cur) + cellW / 2
      const top = CELL_Y - I_PIN_DY
      iTri.setAttribute('d', `M ${cx - 6} ${top - 10} L ${cx + 6} ${top - 10} L ${cx} ${top} z`)
      iText.setAttribute('x', cx)
      iText.setAttribute('y', top - 20)
      iText.textContent = `i=${cur}`
      iTri.style.opacity = '1'
      iText.style.opacity = '1'
    } else {
      iTri.style.opacity = '0'
      iText.style.opacity = '0'
    }

    // ── 答案连线：把命中的两个格子连起来 ──
    if (answer) {
      const x1 = cellX(answer[0]) + cellW / 2
      const x2 = cellX(answer[1]) + cellW / 2
      const my = (x1 + x2) / 2
      answerArc.setAttribute('d', `M ${x1} ${ARC_Y} Q ${my} ${ARC_Y + ARC_APEX_DY} ${x2} ${ARC_Y}`)
      answerArc.style.opacity = '1'
    } else {
      answerArc.style.opacity = '0'
    }

    // ── 哈希表卡片 ──
    const entries = Object.entries(seen)
    if (entries.length === 0) {
      tableEmpty.style.opacity = '1'
    } else {
      tableEmpty.style.opacity = '0'
    }
    cardEls.forEach((card, idx) => {
      const e = entries[idx]
      if (e === undefined) {
        card.g.style.opacity = '0'
        return
      }
      const [k, v] = e
      card.g.style.opacity = '1'
      card.k.textContent = k
      card.val.textContent = `↓${v}`
      const isNew = step.phase === 'put' && Number(k) === step.x && v === step.i
      const isHit = step.hitIdx !== null && Number(v) === step.hitIdx && step.phase === 'hit'
      card.g.setAttribute(
        'class',
        `ts-card${isHit ? ' is-hit' : isNew ? ' is-new' : ''}`,
      )
    })

    // ── 横幅 ──
    bannerBox.setAttribute('class', answer ? 'ts-banner__box is-answer' : 'ts-banner__box')
    bannerAns.textContent = answer ? `[${answer[0]}, ${answer[1]}]` : '—'

    if (step.phase === 'init') {
      bannerLead.textContent = `nums = [${nums.join(', ')}]，target = ${target}`
    } else if (step.phase === 'miss') {
      bannerLead.textContent = `需要 ${target} - ${step.x} = ${step.need}，查表：没有`
    } else if (step.phase === 'put') {
      bannerLead.textContent = `把 ${step.x} → ${step.i} 登记进表`
    } else if (step.phase === 'hit') {
      bannerLead.textContent = `需要 ${target} - ${step.x} = ${step.need}，查表：命中下标 ${step.hitIdx}`
    } else if (step.phase === 'verify') {
      bannerLead.textContent =
        `验证 ${nums[answer[0]]} + ${nums[answer[1]]} = ${target} ✓`
    } else {
      bannerLead.textContent = answer
        ? `完成：nums[${answer[0]}] + nums[${answer[1]}] = ${target}`
        : '没有找到任何一对'
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
      delete host.dataset.tsMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
