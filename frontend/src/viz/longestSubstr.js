/**
 * longestSubstr.js — 「无重复字符的最长子串」(LeetCode 3) 推演动画的 SVG 渲染层。
 *
 * 逻辑全在 longestSubstrSteps.js 里，这里只负责把一帧快照画出来。
 * 这是系列里第一个**字符串**题（前面都是链表和二叉树），所以形态也是新的：
 *
 *   1. 字符格子（一行）  —— 窗口**内**的格子淡绿底、窗口**外**的灰掉，
 *                           当前处理的字符（right 指向）橙色高亮
 *   2. 窗口条（格子下方）—— 一条色带横跨 [left, right]，
 *                           两端标出 L / R；另有一条金色细线标"当前最优窗口"
 *   3. lastSeen 表       —— 字符 → 它最后出现的位置（滑窗的判据来源）
 *   4. 结果横幅 + 说明 + 控制条
 *
 * ⚠️ 通用坑（系列里踩过，这里直接规避）：
 *   A. 所有 CSS 变量都带字面量兜底 —— viz-shot.mjs 单独序列化 SVG 时，
 *      外层 div 上的变量解析不了，不带兜底整条样式失效。
 *   K. 分层绘制：底 → 主体 → 标签文字，别让后画的色块盖住先画的文字。
 */

import { buildLongestSubstrSteps } from './longestSubstrSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'ls-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const CELL_H = 54
const CELL_W_MAX = 52
const CELL_GAP_MAX = 6

const STR_Y = 136            // 字符格子顶部
const R_PIN_DY = 22          // right 指针在格子上方多高
const BEST_Y = 196           // "当前最优窗口"金色下划线（紧贴格子底）
const BAR_Y = 206            // 当前窗口色带顶部
const BAR_H = 9
const PIN_TEXT_Y = 242       // L / R 标签文字中心

const TABLE_TITLE_Y = 282
const CARD_Y = 296
const CARD_H = 46

const LABEL_X = 26
const BANNER_H = 50
const BANNER_GAP = 34

const PLAY_MS = 1150

const AVAIL = 604            // 格子行可用的最大宽度

const STYLES = `
.ls {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ls__svg { width: 100%; height: auto; display: block; }

/* ── 字符格子 ─────────────────────────────────────────────────────────── */
.ls-cell__box {
  fill: var(--ls-fill, #ffffff);
  stroke: var(--ls-line, #c3c9c2);
  stroke-width: 1.5;
}
.ls-cell__text {
  fill: var(--ls-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 在窗口里 */
.ls-cell.is-in .ls-cell__box {
  fill: var(--ls-ok-fill, #eef5f1);
  stroke: var(--ls-ok, #3f6b57);
  stroke-width: 2;
}
/* 已经被 left 挤出窗口（还在右边等着被重新吃进来） */
.ls-cell.is-out .ls-cell__box {
  fill: var(--ls-dim-fill, #f2f2ef);
  stroke: var(--ls-dim, #c9cdc7);
}
.ls-cell.is-out .ls-cell__text {
  fill: var(--ls-dim, #b9b9b3);
}
/* 这一帧正在处理的字符 */
.ls-cell.is-cur .ls-cell__box {
  fill: var(--ls-hot-fill, #fdf1ec);
  stroke: var(--ls-hot, #a45f45);
  stroke-width: 3;
}
.ls-cell.is-cur .ls-cell__text {
  fill: var(--ls-hot, #a45f45);
}

/* ── 窗口条 ───────────────────────────────────────────────────────────── */
.ls-win__bar {
  fill: var(--ls-ok-fill, #eef5f1);
  stroke: var(--ls-ok, #3f6b57);
  stroke-width: 1.5;
}
.ls-win__best {
  stroke: var(--ls-gold, #c2872f);
  stroke-width: 3;
}
/* L / R 的引出线用和标签同色的实线 —— 初版和"最优窗口"共用金色虚线样式，
 * 结果两种线在画面上分不清谁是谁。 */
.ls-win__tick {
  stroke: var(--ls-hot, #a45f45);
  stroke-width: 1.5;
}
.ls-win__tick.is-r {
  stroke: var(--ls-ok, #3f6b57);
}
.ls-win__pin {
  fill: var(--ls-hot, #a45f45);
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-win__pin.is-r {
  fill: var(--ls-ok, #3f6b57);
}
.ls-win__empty {
  fill: var(--ls-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── right 指针 ───────────────────────────────────────────────────────── */
.ls-rpin__tri {
  fill: var(--ls-hot, #a45f45);
}
.ls-rpin__text {
  fill: var(--ls-hot, #a45f45);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── lastSeen 表 ──────────────────────────────────────────────────────── */
.ls-table__title {
  fill: var(--ls-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-card__box {
  fill: var(--ls-fill, #ffffff);
  stroke: var(--ls-line, #c3c9c2);
  stroke-width: 1.5;
}
.ls-card__ch {
  fill: var(--ls-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-card__idx {
  fill: var(--ls-muted, #657168);
  font-size: 13px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 这一帧的字符对应的卡片 */
.ls-card.is-hit .ls-card__box {
  fill: var(--ls-hot-fill, #fdf1ec);
  stroke: var(--ls-hot, #a45f45);
  stroke-width: 2.5;
}
.ls-card.is-hit .ls-card__ch {
  fill: var(--ls-hot, #a45f45);
}
.ls-card.is-hit .ls-card__idx {
  fill: var(--ls-hot, #a45f45);
  font-weight: 700;
}
/* 被高亮的"旧位置"数字（讲清楚它就在这儿） */
.ls-card.is-hit .ls-card__idx.is-old {
  fill: var(--ls-gold, #c2872f);
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.ls-banner__box {
  fill: var(--ls-banner-fill, #f4f2ec);
  stroke: var(--ls-line, #c3c9c2);
  stroke-width: 1.5;
}
.ls-banner__lead {
  fill: var(--ls-ink, #1f2a24);
  font-size: 15px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-banner__label {
  fill: var(--ls-muted, #657168);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ls-banner__ans {
  fill: var(--ls-ok, #3f6b57);
  font-size: 24px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ls-empty__text {
  fill: var(--ls-muted, #657168);
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
 *   values?: string,
 *   autoplay?: boolean,
 *   initialStep?: number,
 * }} [options]
 */
export function mountLongestSubstr(host, options = {}) {
  if (!host || host.dataset.lsMounted === '1') return { destroy() {} }
  host.dataset.lsMounted = '1'
  ensureStyles()

  const steps = buildLongestSubstrSteps(options)
  const autoplay = options.autoplay !== false

  const s = typeof options.values === 'string' ? options.values : 'abcabcbb'
  const chars = Array.from(s)
  const n = chars.length

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz ls'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  // ── 空串 ─────────────────────────────────────────────────────────────────
  if (n === 0) {
    const w0 = 620
    const h0 = 120
    const s0 = mk('svg', { class: 'viz__svg ls__svg', viewBox: `0 0 ${w0} ${h0}`, role: 'img' })
    const t0 = mk('text', { class: 'ls-empty__text', x: w0 / 2, y: h0 / 2 })
    t0.textContent = '空串 —— 没有字符，答案是 0'
    s0.appendChild(t0)
    stage.appendChild(s0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.lsMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  // ── 格子尺寸自适应（长串就缩窄） ─────────────────────────────────────────
  let cellW = CELL_W_MAX
  let cellGap = CELL_GAP_MAX
  let cellFont = 17
  const needW = n * cellW + (n - 1) * cellGap
  if (needW > AVAIL) {
    const k = AVAIL / needW
    cellW = Math.max(20, Math.floor(cellW * k))
    cellGap = Math.max(3, Math.floor(cellGap * k))
    cellFont = Math.max(11, Math.round(cellFont * k))
  }
  const strW = n * cellW + (n - 1) * cellGap

  const PAD = 34
  const width = Math.max(660, LABEL_X * 2 + strW + PAD * 2)
  const STR_LEFT = (width - strW) / 2
  const cellX = (i) => STR_LEFT + i * (cellW + cellGap)

  const STR_BOTTOM = STR_Y + CELL_H
  const BANNER_TOP = CARD_Y + CARD_H + BANNER_GAP
  const BANNER_W = Math.min(620, width - LABEL_X * 2)
  const height = BANNER_TOP + BANNER_H + 26

  const svgRoot = mk('svg', {
    class: 'viz__svg ls__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '无重复字符的最长子串推演动画',
  })
  stage.appendChild(svgRoot)

  // 分层：色带/底 → 格子 → 指针与标签（见文件头坑 K）
  const bandLayer = mk('g', { class: 'ls-bands' })
  const cellLayer = mk('g', { class: 'ls-cells' })
  const markLayer = mk('g', { class: 'ls-marks' })
  svgRoot.appendChild(bandLayer)
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  // ── 窗口色带 ─────────────────────────────────────────────────────────────
  const winBar = mk('rect', {
    class: 'ls-win__bar',
    x: 0,
    y: BAR_Y,
    width: 0,
    height: BAR_H,
    rx: 4,
  })
  bandLayer.appendChild(winBar)
  const bestLine = mk('line', {
    class: 'ls-win__best',
    x1: 0,
    y1: BEST_Y,
    x2: 0,
    y2: BEST_Y,
  })
  bandLayer.appendChild(bestLine)

  // 色带两端的 L / R 标签 + 竖线
  const lPinText = mk('text', { class: 'ls-win__pin', x: 0, y: PIN_TEXT_Y })
  const rPinText = mk('text', { class: 'ls-win__pin is-r', x: 0, y: PIN_TEXT_Y })
  const lPinTick = mk('line', { class: 'ls-win__tick', x1: 0, y1: BAR_Y + BAR_H, x2: 0, y2: PIN_TEXT_Y - 8 })
  const rPinTick = mk('line', { class: 'ls-win__tick is-r', x1: 0, y1: BAR_Y + BAR_H, x2: 0, y2: PIN_TEXT_Y - 8 })
  markLayer.appendChild(lPinTick)
  markLayer.appendChild(rPinTick)
  markLayer.appendChild(lPinText)
  markLayer.appendChild(rPinText)

  const emptyNote = mk('text', { class: 'ls-win__empty', x: LABEL_X, y: PIN_TEXT_Y })
  emptyNote.textContent = '窗口还没开始滑动 —— 按播放看 right 怎么一步步往右吃字符'
  markLayer.appendChild(emptyNote)

  // ── right 指针（格子上方） ───────────────────────────────────────────────
  const rTri = mk('path', { class: 'ls-rpin__tri', d: 'M 0 0 L 0 0 L 0 0' })
  const rText = mk('text', { class: 'ls-rpin__text', x: 0, y: 0 })
  rText.textContent = 'right'
  markLayer.appendChild(rTri)
  markLayer.appendChild(rText)

  // ── 字符格子 ─────────────────────────────────────────────────────────────
  const cellEls = []
  for (let i = 0; i < n; i += 1) {
    const x = cellX(i)
    const g = mk('g', { class: 'ls-cell' })
    g.appendChild(
      mk('rect', { class: 'ls-cell__box', x, y: STR_Y, width: cellW, height: CELL_H, rx: 7 }),
    )
    const t = mk('text', {
      class: 'ls-cell__text',
      x: x + cellW / 2,
      y: STR_Y + CELL_H / 2,
      style: `font-size:${cellFont}px`,
    })
    t.textContent = chars[i]
    g.appendChild(t)
    cellLayer.appendChild(g)
    cellEls.push({ g, id: i })
  }

  // ── lastSeen 表 ──────────────────────────────────────────────────────────
  // 表里最多会出现多少张卡片：直接按字符串的去重字符数算
  const distinct = new Set(chars).size
  const cardGap = distinct > 10 ? 5 : 8
  const cardW = Math.max(28, Math.min(56, Math.floor((AVAIL - (distinct - 1) * cardGap) / distinct)))
  const tableW = distinct * cardW + (distinct - 1) * cardGap
  const TABLE_LEFT = (width - tableW) / 2

  const tableTitle = mk('text', { class: 'ls-table__title', x: TABLE_LEFT, y: TABLE_TITLE_Y })
  tableTitle.textContent = 'lastSeen：每个字符最后出现在哪个下标'
  markLayer.appendChild(tableTitle)

  const cardEls = []
  for (let i = 0; i < distinct; i += 1) {
    const x = TABLE_LEFT + i * (cardW + cardGap)
    const g = mk('g', { class: 'ls-card' })
    g.appendChild(
      mk('rect', { class: 'ls-card__box', x, y: CARD_Y, width: cardW, height: CARD_H, rx: 7 }),
    )
    const chT = mk('text', { class: 'ls-card__ch', x: x + cardW / 2, y: CARD_Y + 15 })
    g.appendChild(chT)
    const idxT = mk('text', { class: 'ls-card__idx', x: x + cardW / 2, y: CARD_Y + 33 })
    g.appendChild(idxT)
    markLayer.appendChild(g)
    cardEls.push({ g, chT, idxT, x })
  }

  // ── 结果横幅 ─────────────────────────────────────────────────────────────
  const banner = mk('g', { class: 'ls-banner' })
  banner.appendChild(
    mk('rect', {
      class: 'ls-banner__box',
      x: LABEL_X,
      y: BANNER_TOP,
      width: BANNER_W,
      height: BANNER_H,
      rx: 9,
    }),
  )
  const bannerLead = mk('text', {
    class: 'ls-banner__lead',
    x: LABEL_X + 16,
    y: BANNER_TOP + BANNER_H / 2,
  })
  banner.appendChild(bannerLead)
  const bannerLabel = mk('text', {
    class: 'ls-banner__label',
    x: LABEL_X + BANNER_W - 74,
    y: BANNER_TOP + BANNER_H / 2,
  })
  bannerLabel.textContent = 'ans'
  banner.appendChild(bannerLabel)
  const bannerAns = mk('text', {
    class: 'ls-banner__ans',
    x: LABEL_X + BANNER_W - 16,
    y: BANNER_TOP + BANNER_H / 2,
  })
  banner.appendChild(bannerAns)
  svgRoot.appendChild(banner)

  // ── 每帧重绘 ─────────────────────────────────────────────────────────────
  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const bestRange = step.bestRange
    // done 帧改用**最优窗口**来画 —— 状态机里 left / right 保留的是最后一步的真实值
    //（这样逐帧不变量在收尾帧依然成立），"停在最优解上"这件事由渲染层负责。
    const showBest = step.phase === 'done' && bestRange
    const left = showBest ? bestRange[0] : step.left
    const right = showBest ? bestRange[1] : step.right
    const lastSeen = step.lastSeen ?? {}

    // ── 格子状态 ──
    for (const el of cellEls) {
      const { g, id } = el
      const cls = ['ls-cell']
      if (right >= 0 && id >= left && id <= right) cls.push('is-in')
      else if (right >= 0 && id < left) cls.push('is-out')
      else if (step.phase !== 'init') cls.push('is-out')
      if (id === right) cls.push('is-cur')
      g.setAttribute('class', cls.join(' '))
    }

    // ── 窗口色带 ──
    const hasWindow = right >= 0
    if (hasWindow) {
      const x1 = cellX(left)
      const x2 = cellX(right) + cellW
      winBar.setAttribute('x', x1)
      winBar.setAttribute('width', Math.max(4, x2 - x1))
      winBar.style.opacity = '1'

      const lx = cellX(left) + cellW / 2
      const rx = cellX(right) + cellW / 2
      lPinTick.setAttribute('x1', lx)
      lPinTick.setAttribute('x2', lx)
      lPinText.setAttribute('x', lx)
      lPinTick.style.opacity = '1'
      lPinText.style.opacity = '1'

      if (left === right) {
        // ⚠️ 窗口只有一个格子时，L 和 R 落在同一列，两个标签会完全叠在一起
        //（初版就是这样，屏幕上只看得到 "R=0"）。合并成一个。
        lPinText.textContent = `L=R=${left}`
        rPinText.style.opacity = '0'
        rPinTick.style.opacity = '0'
      } else {
        lPinText.textContent = `L=${left}`
        rPinTick.setAttribute('x1', rx)
        rPinTick.setAttribute('x2', rx)
        rPinText.setAttribute('x', rx)
        rPinText.textContent = `R=${right}`
        rPinText.style.opacity = '1'
        rPinTick.style.opacity = '1'
      }
      emptyNote.style.opacity = '0'
    } else {
      winBar.style.opacity = '0'
      lPinTick.style.opacity = '0'
      rPinTick.style.opacity = '0'
      lPinText.style.opacity = '0'
      rPinText.style.opacity = '0'
      emptyNote.style.opacity = '1'
    }

    // ── 当前最优窗口（金色虚线） ──
    if (bestRange) {
      bestLine.setAttribute('x1', cellX(bestRange[0]))
      bestLine.setAttribute('x2', cellX(bestRange[1]) + cellW)
      bestLine.style.opacity = '1'
    } else {
      bestLine.style.opacity = '0'
    }

    // ── right 指针 ──
    if (hasWindow) {
      const cx = cellX(right) + cellW / 2
      const top = STR_Y - R_PIN_DY
      rTri.setAttribute('d', `M ${cx - 6} ${top - 10} L ${cx + 6} ${top - 10} L ${cx} ${top} z`)
      rText.setAttribute('x', cx)
      rText.setAttribute('y', top - 20)
      rTri.style.opacity = '1'
      rText.style.opacity = '1'
    } else {
      rTri.style.opacity = '0'
      rText.style.opacity = '0'
    }

    // ── lastSeen 表 ──
    const keys = Object.keys(lastSeen)
    const curCh = step.ch
    cardEls.forEach((card, i) => {
      const key = keys[i]
      if (key === undefined) {
        card.g.style.opacity = '0'
        return
      }
      card.g.style.opacity = '1'
      card.chT.textContent = key
      const isHit = key === curCh && step.phase !== 'done'
      const useOld =
        isHit && step.hitIdx !== null && (step.phase === 'slide' || step.outsideWindow === true)
      card.idxT.textContent = String(useOld ? step.hitIdx : lastSeen[key])
      card.g.setAttribute('class', isHit ? 'ls-card is-hit' : 'ls-card')
      // 显示旧位置时把数字标成金色 —— 读者一眼能对上 desc 里说的那个下标
      card.idxT.setAttribute('class', useOld ? 'ls-card__idx is-old' : 'ls-card__idx')
    })

    // ── 横幅 ──
    if (step.phase === 'init') {
      bannerLead.textContent = `字符串 "${s}"，共 ${n} 个字符`
    } else if (step.phase === 'done') {
      const best = bestRange ? chars.slice(bestRange[0], bestRange[1] + 1).join('') : ''
      bannerLead.textContent = `最长无重复子串 "${best}"`
    } else {
      const inner = chars.slice(left, right + 1).join('')
      bannerLead.textContent = `窗口 [${left}, ${right}] = "${inner}"  长度 ${step.windowLen}`
    }
    bannerAns.textContent = String(step.ans)

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

  void STR_BOTTOM

  return {
    destroy() {
      if (observer) {
        observer.disconnect()
        observer = null
      }
      player.destroy()
      host.textContent = ''
      delete host.dataset.lsMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
