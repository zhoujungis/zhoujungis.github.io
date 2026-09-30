/**
 * editDistance.js — 「编辑距离」(LC 72) 的 SVG 渲染层，两种画法共用一条帧流。
 *
 *   mountEditDistGrid —— lc72     完整二维表，逐格点亮，三个邻居按「三种操作」分色
 *   mountEditDistRoll —— lc72roll 同一张表淡化 + 只留一行（滚动数组）+ 存下来的 prev
 *
 * 第二种画法是「空间压缩」这件事本身的可视化：淡化的是同一张表，被逐格擦掉的是
 * 上一行，被逐格点亮的是这一行 —— 唯一不在数组里的邻居就是对角，所以必须提前存。
 *
 * 通用坑：A（CSS 变量一律带字面量兜底）/ V（互斥状态在 JS 里选好，不交给层叠顺序）
 * / X（横幅多段文字的 x 一律从左往右数）。
 */

import { buildEditDistanceSteps } from './editDistanceSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'editdist-styles'
const PLAY_MS = 880

const OP_TEXT = { match: '相同', replace: '替换', delete: '删除', insert: '插入' }
const OP_TAG = { match: 'ok', replace: 'sub', delete: 'del', insert: 'ins' }
/** 三种操作 -> 分色类名（这就是本动画的语法：颜色 = 操作） */
const OP_CLS = { replace: 'is-sub', delete: 'is-del', insert: 'is-ins' }
const opCls = (op) => OP_CLS[op] || 'is-sub'

const STYLES = `
.ed { display: flex; flex-direction: column; gap: 14px; }
.ed__svg { width: 100%; height: auto; display: block; }

.ed-note {
  fill: var(--ed-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ed-banner__box {
  fill: var(--ed-banner, #f4f3ef);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.5;
}
.ed-banner__seg {
  fill: var(--ed-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-banner__val {
  fill: var(--ed-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ed-hdr__text {
  fill: var(--ed-ink, #1f2a24);
  font-size: 14px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-hdr__idx {
  fill: var(--ed-dim, #9aa39c);
  font-size: 10px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-colhdr__text {
  fill: var(--ed-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-colhdr__idx {
  fill: var(--ed-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.ed-cell__box {
  fill: var(--ed-fill, #ffffff);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.5;
}
.ed-cell__val {
  fill: var(--ed-ink, #1f2a24);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-cell__op {
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-cell__op.is-sub { fill: var(--ed-diag, #c2872f); }
.ed-cell__op.is-del { fill: var(--ed-up, #3f6b57); }
.ed-cell__op.is-ins { fill: var(--ed-left, #a45f45); }
.ed-cell__op.is-ok { fill: var(--ed-ok, #3f6b57); }

/* ---- 通道一：底色（边界 / 本帧要填的格子） ---- */
.ed-cell.is-boundary .ed-cell__box {
  fill: var(--ed-dim-fill, #f6f5f1);
  stroke-dasharray: 4 3;
}
.ed-cell.is-boundary .ed-cell__val { fill: var(--ed-muted, #657168); }
/* 还没轮到的格子 */
.ed-cell.is-ghost .ed-cell__box {
  fill: none;
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.ed-cell.is-ghost .ed-cell__val { fill: var(--ed-dim, #9aa39c); }
/* 通道二：边框 —— 以下是本帧的主角与三个邻居，写在边界规则之后 = 故意覆盖 */
.ed-cell.is-cur .ed-cell__box {
  stroke: var(--ed-hot, #a45f45);
  stroke-width: 3;
}
.ed-cell.is-fresh .ed-cell__box {
  fill: var(--ed-gold-fill, #fdf3e3);
  stroke: var(--ed-gold, #c2872f);
  stroke-width: 3;
}
.ed-cell.is-match .ed-cell__box {
  fill: var(--ed-ok-fill, #eef5f1);
  stroke: var(--ed-ok, #3f6b57);
  stroke-width: 3;
}
/* 三个邻居按三种操作分色（本动画的语法） */
.ed-cell.is-nb-diag .ed-cell__box { stroke: var(--ed-diag, #c2872f); stroke-width: 2.5; }
.ed-cell.is-nb-up .ed-cell__box { stroke: var(--ed-up, #3f6b57); stroke-width: 2.5; }
.ed-cell.is-nb-left .ed-cell__box { stroke: var(--ed-left, #a45f45); stroke-width: 2.5; }
/* 胜出的那一项：再加粗 + 外环 */
.ed-cell.is-best .ed-cell__box { stroke-width: 4; }
/* 相同字符时，上方/左方完全不用看 */
.ed-cell.is-off { opacity: 0.4; }

.ed-ring {
  fill: none;
  stroke: var(--ed-gold, #c2872f);
  stroke-width: 2;
  stroke-dasharray: 5 4;
  opacity: 0;
}
.ed-ring.is-on { opacity: 1; }

.ed-legend__text {
  fill: var(--ed-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed-phase__text {
  fill: var(--ed-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---------- 画法二：滚动数组 ---------- */
.ed2-cell__box {
  fill: var(--ed-fill, #ffffff);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.2;
}
.ed2-cell__val {
  fill: var(--ed-ink, #1f2a24);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-cell.is-blank .ed2-cell__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1; }
.ed2-cell.is-blank .ed2-cell__val { fill: none; }
.ed2-cell.is-gone { opacity: 0.2; }
/* 上一行里已经被覆盖掉的部分 */
.ed2-cell.is-wiped { opacity: 0.4; }
.ed2-cell.is-wiped .ed2-cell__box { stroke-dasharray: 3 3; }
/* 对角是本画法的主角：虽然已被覆盖，也要从灰堆里跳出来（写在 is-wiped 之后 = 故意覆盖透明度） */
.ed2-cell.is-diag { opacity: 0.92; }
/* 还活在数组里的部分：上一行没被覆盖的 + 本行已写入的 */
.ed2-cell.is-alive .ed2-cell__box { fill: var(--ed-gold-fill, #fdf3e3); }
.ed2-cell.is-new .ed2-cell__box { fill: var(--ed-ok-fill, #eef5f1); }
/* 被覆盖掉的那一格就是对角 —— 本画法的主角 */
.ed2-cell.is-diag .ed2-cell__box { stroke: var(--ed-diag, #c2872f); stroke-width: 2.4; }
.ed2-cell.is-cur .ed2-cell__box { stroke: var(--ed-hot, #a45f45); stroke-width: 2.8; }

.ed2-buf__box {
  fill: var(--ed-fill, #ffffff);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.5;
}
.ed2-buf__val {
  fill: var(--ed-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-buf__idx {
  fill: var(--ed-dim, #9aa39c);
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-buf.is-old .ed2-buf__box { fill: var(--ed-dim-fill, #f6f5f1); }
.ed2-buf.is-old .ed2-buf__val { fill: var(--ed-muted, #657168); }
.ed2-buf.is-new .ed2-buf__box { fill: var(--ed-ok-fill, #eef5f1); }
.ed2-buf.is-cur .ed2-buf__box { stroke: var(--ed-hot, #a45f45); stroke-width: 3; }

.ed2-tag {
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-tag.is-left { fill: var(--ed-left, #a45f45); }
.ed2-tag.is-up { fill: var(--ed-up, #3f6b57); }

.ed2-term__box {
  fill: var(--ed-banner, #f4f3ef);
  stroke: var(--ed-line, #c3c9c2);
  stroke-width: 1.4;
}
.ed2-term__box.is-sub { stroke: var(--ed-line, #c3c9c2); }
.ed2-term__main {
  fill: var(--ed-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-term__tag {
  font-size: 12px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.ed2-term__tag.is-sub { fill: var(--ed-diag, #c2872f); }
.ed2-term__tag.is-del { fill: var(--ed-up, #3f6b57); }
.ed2-term__tag.is-ins { fill: var(--ed-left, #a45f45); }
.ed2-term__note {
  fill: var(--ed-muted, #657168);
  font-size: 10.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular, Consolas, monospace';
}
/* 本帧取值范围里的那一项 */
.ed2-term.is-best .ed2-term__box { fill: var(--ed-gold-fill, #fdf3e3); }
.ed2-term.is-best.is-sub .ed2-term__box { stroke: var(--ed-diag, #c2872f); stroke-width: 2; }
.ed2-term.is-best.is-del .ed2-term__box { stroke: var(--ed-up, #3f6b57); stroke-width: 2; }
.ed2-term.is-best.is-ins .ed2-term__box { stroke: var(--ed-left, #a45f45); stroke-width: 2; }
/* 真正被选中的那一项（打平时可能有多项都最小） */
.ed2-term.is-pick .ed2-term__box { stroke-width: 3.4; }
.ed2-term.is-off { opacity: 0.42; }
.ed2-term.is-hidden { opacity: 0; }
`

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLES
  document.head.appendChild(style)
}

function makeDesc() {
  const p = document.createElement('p')
  p.className = 'viz__desc'
  p.setAttribute('aria-live', 'polite')
  return p
}

/** 某一格在本帧是否已经算出来了（dp 里 0 也是合法值，只能按帧语义推，不能按值判断）。 */
function makeFilled(phase, i, j) {
  return (r, c) => {
    if (phase === 'init') return r === 0
    if (phase === 'done') return true
    if (r < i) return true
    if (r === i) return c <= j
    return false
  }
}

function clampFont(w, per, min, max) {
  return Math.max(min, Math.min(max, Math.round(w / per)))
}

/** 估算一段中英混排文本的像素宽度（只用来摆图例，不追求精确）。 */
function textW(s, cjk = 12, ascii = 7) {
  let w = 0
  for (const ch of s) w += /[\u3000-\u303f\u4e00-\u9fff\uff00-\uffef]/.test(ch) ? cjk : ascii
  return w
}

/** 本帧胜出的那一格（相同字符时只有对角）。 */
function bestOf(step) {
  if (step.match || step.op === 'replace') return [step.i - 1, step.j - 1]
  if (step.op === 'delete') return [step.i - 1, step.j]
  if (step.op === 'insert') return [step.i, step.j - 1]
  return null
}

/* ==================================================================== */
/* 画法一：完整二维表                                                    */
/* ==================================================================== */

function buildGrid(steps, descEl) {
  const s0 = steps[0]
  const { m, n, word1: a, word2: b } = s0
  const nRows = m + 1
  const nCols = n + 1
  const W = 680
  const CGAP = 6
  const RGAP = 5

  let cw = 118
  if (nCols * cw + (nCols - 1) * CGAP > W - 160) {
    cw = Math.max(26, Math.floor((W - 160 - (nCols - 1) * CGAP) / nCols))
  }
  let ch = 38
  if (nRows * ch + (nRows - 1) * RGAP > 300) {
    ch = Math.max(18, Math.floor((300 - (nRows - 1) * RGAP) / nRows))
  }
  const gridW = nCols * cw + (nCols - 1) * CGAP
  const gridH = nRows * ch + (nRows - 1) * RGAP

  const BANNER_TOP = 38
  const BANNER_H = 40
  const GRID_TOP = 120
  const gridBottom = GRID_TOP + gridH
  const LEGEND_Y = gridBottom + 20
  const PHASE_Y = LEGEND_Y + 30
  const height = PHASE_Y + 22
  // 左侧留出行头的位置
  const LEFT = Math.max(68, (W - gridW) / 2 + 8)

  const colX = (j) => LEFT + j * (cw + CGAP)
  const rowY = (i) => GRID_TOP + i * (ch + RGAP)
  const valFont = clampFont(cw, 7.5, 9, 15)
  const opFont = clampFont(ch, 4.2, 7, 9)
  const showOp = ch >= 34

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg ed__svg',
    viewBox: `0 0 ${W} ${height}`,
    role: 'img',
    'aria-label': '编辑距离 二维动态规划推演动画',
  })

  const markLayer = mk('g', { class: 'ed-marks' })
  const cellLayer = mk('g', { class: 'ed-cells' })
  svgRoot.appendChild(markLayer)
  svgRoot.appendChild(cellLayer)

  const note = mk('text', { class: 'ed-note', x: 30, y: 22 })
  note.textContent = 'dp[i][j] = a 的前 i 个字符 变成 b 的前 j 个字符 的最少操作数'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', {
      class: 'ed-banner__box',
      x: 30,
      y: BANNER_TOP,
      width: W - 60,
      height: BANNER_H,
      rx: 9,
    }),
  )
  const segRound = mk('text', { class: 'ed-banner__seg', x: 46, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'ed-banner__seg', x: 218, y: BANNER_TOP + BANNER_H / 2 })
  const segVal = mk('text', { class: 'ed-banner__val', x: W - 46, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(segVal)

  // 列头：b 的字符 + 列号
  for (let c = 0; c <= n; c += 1) {
    const t = mk('text', { class: 'ed-colhdr__text', x: colX(c) + cw / 2, y: GRID_TOP - 22 })
    t.textContent = c === 0 ? '""' : b[c - 1]
    const idx = mk('text', { class: 'ed-colhdr__idx', x: colX(c) + cw / 2, y: GRID_TOP - 8 })
    idx.textContent = c === 0 ? 'j=0' : `j=${c}`
    markLayer.appendChild(t)
    markLayer.appendChild(idx)
  }

  // 行头：a 的字符 + 行号
  for (let r = 0; r <= m; r += 1) {
    const t = mk('text', { class: 'ed-hdr__text', x: LEFT - 16, y: rowY(r) + ch / 2 })
    t.textContent = r === 0 ? '""' : a[r - 1]
    const idx = mk('text', { class: 'ed-hdr__idx', x: LEFT - 44, y: rowY(r) + ch / 2 })
    idx.textContent = r === 0 ? 'i=0' : `i=${r}`
    markLayer.appendChild(t)
    markLayer.appendChild(idx)
  }

  // 单元格
  const cells = []
  for (let r = 0; r <= m; r += 1) {
    const row = []
    for (let c = 0; c <= n; c += 1) {
      const g = mk('g', { class: 'ed-cell' })
      g.appendChild(
        mk('rect', {
          class: 'ed-cell__box',
          x: colX(c),
          y: rowY(r),
          width: cw,
          height: ch,
          rx: 6,
        }),
      )
      const val = mk('text', {
        class: 'ed-cell__val',
        x: colX(c) + cw / 2,
        y: showOp ? rowY(r) + ch / 2 - 6 : rowY(r) + ch / 2,
        style: `font-size: ${valFont}px`,
      })
      g.appendChild(val)
      const op = mk('text', {
        class: 'ed-cell__op',
        x: colX(c) + cw / 2,
        y: rowY(r) + ch - 9,
        style: `font-size: ${opFont}px`,
      })
      if (showOp) g.appendChild(op)
      cellLayer.appendChild(g)
      row.push({ g, val, op })
    }
    cells.push(row)
  }

  const ring = mk('rect', { class: 'ed-ring', x: 0, y: 0, width: cw + 10, height: ch + 10, rx: 9 })
  markLayer.appendChild(ring)

  // 图例：把颜色和三种操作绑死
  const legend = [
    { color: '--ed-diag, #c2872f', text: '替换 = 对角' },
    { color: '--ed-up, #3f6b57', text: '删除 = 上方' },
    { color: '--ed-left, #a45f45', text: '插入 = 左方' },
  ]
  const LEGEND_GAP = 34
  const legendW = legend.reduce((acc, it) => acc + 17 + textW(it.text) + LEGEND_GAP, 0) - LEGEND_GAP
  let lx = (W - legendW) / 2
  for (const it of legend) {
    markLayer.appendChild(
      mk('rect', {
        x: lx,
        y: LEGEND_Y - 5.5,
        width: 11,
        height: 11,
        rx: 3,
        style: `fill: none; stroke: var(${it.color}); stroke-width: 2.5;`,
      }),
    )
    const tx = mk('text', { class: 'ed-legend__text', x: lx + 17, y: LEGEND_Y })
    tx.textContent = it.text
    markLayer.appendChild(tx)
    lx += 17 + textW(it.text) + LEGEND_GAP
  }

  const phaseText = mk('text', { class: 'ed-phase__text', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  function paint(_index, step) {
    if (!step) return
    const { phase, i, j, m: mm, n: nn, dp } = step
    const isDone = phase === 'done'
    const isCell = phase === 'cell'
    const filled = makeFilled(phase, i, j)
    const bestCell = isCell ? bestOf(step) : null

    cells.forEach((row, r) => {
      row.forEach((el, c) => {
        const cls = ['ed-cell']
        const isFilled = filled(r, c)
        const boundary = r === 0 || c === 0
        if (!isFilled) cls.push('is-ghost')
        else if (boundary) cls.push('is-boundary')

        // 互斥判断全在 JS 里做完，不交给 CSS 层叠顺序
        if (phase === 'init' && r === 0) cls.push('is-fresh')
        else if (phase === 'col' && r === i && c === 0) cls.push('is-cur')
        else if (isCell && r === i && c === j) cls.push(step.match ? 'is-match' : 'is-fresh')
        else if (isDone && r === mm && c === nn) cls.push('is-fresh')

        if (isCell) {
          const isDiag = r === i - 1 && c === j - 1
          const isUp = r === i - 1 && c === j
          const isLeft = r === i && c === j - 1
          if (isDiag) cls.push('is-nb-diag')
          else if (isUp) cls.push('is-nb-up')
          else if (isLeft) cls.push('is-nb-left')
          // 字符相同：只有对角参与，另外两个邻居直接压暗
          if (step.match && (isUp || isLeft)) cls.push('is-off')
          if (bestCell && bestCell[0] === r && bestCell[1] === c) cls.push('is-best')
        }
        el.g.setAttribute('class', cls.join(' '))
        el.val.textContent = isFilled ? String(dp[r][c]) : ''
        if (showOp) {
          const isMe = isCell && r === i && c === j
          el.op.textContent = isMe ? OP_TAG[step.op] || '' : ''
          el.op.setAttribute('class', `ed-cell__op ${isMe ? opCls(step.op) : ''}`)
        }
      })
    })

    if (bestCell) {
      ring.classList.add('is-on')
      ring.setAttribute('x', colX(bestCell[1]) - 5)
      ring.setAttribute('y', rowY(bestCell[0]) - 5)
    } else {
      ring.classList.remove('is-on')
    }

    if (phase === 'init') {
      segRound.textContent = '第 0 行'
      segAct.textContent = '空串长成 b 的前 j 个字符'
      segVal.textContent = 'dp[0][j] = j'
    } else if (phase === 'col') {
      segRound.textContent = `i = ${i} · 第 0 列`
      segAct.textContent = `a 的前 ${i} 个字符 缩成空串`
      segVal.textContent = `dp[${i}][0] = ${i}`
    } else if (isCell) {
      segRound.textContent = `i = ${i} · j = ${j}`
      segAct.textContent = step.match
        ? `'${step.charA}' = '${step.charB}' -> 抄对角`
        : `'${step.charA}' 对 '${step.charB}' -> 取${OP_TEXT[step.op]}`
      segVal.textContent = `dp[${i}][${j}] = ${step.value}`
    } else {
      segRound.textContent = '右下角那一格'
      segAct.textContent = `dp[${mm}][${nn}] 就是答案`
      segVal.textContent = `答案 = ${step.answer}`
    }

    if (phase === 'init') {
      phaseText.textContent =
        '第 0 行 / 第 0 列不是算出来的，是语义规定的：空串变成 j 个字符 = 插入 j 次。'
    } else if (phase === 'col') {
      phaseText.textContent = `第 ${i} 行先把左边界补上 —— a 的前 ${i} 个字符要缩成空串，代价就是 ${i}。`
    } else if (isCell) {
      phaseText.textContent = step.match
        ? `对角 dp[${i - 1}][${j - 1}] = ${step.diag} 直接抄，不收钱 —— 另外两个邻居至少大 1，不用看。`
        : `对角 ${step.diag}+1 / 上方 ${step.up}+1 / 左方 ${step.left}+1 —— 取${OP_TEXT[step.op]}，dp[${i}][${j}] = ${step.value}。`
    } else {
      phaseText.textContent = '时间 O(m·n)、空间 O(m·n) —— 追问多半接着来：能不能只留一行？'
    }

    renderRichText(descEl, step.desc)
  }

  return { svgRoot, paint }
}

/* ==================================================================== */
/* 画法二：滚动数组（空间压缩到 O(n)）                                    */
/* ==================================================================== */

function buildRoll(steps, descEl) {
  const s0 = steps[0]
  const { m, n, word1: a, word2: b, buf: buf0 } = s0
  const nRows = m + 1
  const nCols = n + 1
  const W = 680
  const G2 = 4
  const RG2 = 4
  const COL_AREA = 304

  let cw = 62
  if (nCols * cw + (nCols - 1) * G2 > COL_AREA) {
    cw = Math.max(20, Math.floor((COL_AREA - (nCols - 1) * G2) / nCols))
  }
  let ch = 24
  if (nRows * ch + (nRows - 1) * RG2 > 192) {
    ch = Math.max(13, Math.floor((192 - (nRows - 1) * RG2) / nRows))
  }
  const gridH = nRows * ch + (nRows - 1) * RG2

  const BANNER_TOP = 38
  const BANNER_H = 40
  const GRID_TOP = 118
  const gridBottom = GRID_TOP + gridH
  const GLEFT = 78

  const PANEL_X = 356
  const PANEL_W = W - PANEL_X - 30
  const TERM_H = 46
  const TERM_GAP = 11

  const BUF_TOP = gridBottom + 46
  const BUF_H = 48
  const TAG_Y = BUF_TOP + BUF_H + 16
  const PHASE_Y = BUF_TOP + BUF_H + 40
  const height = PHASE_Y + 22

  const colX = (c) => GLEFT + c * (cw + G2)
  const rowY = (r) => GRID_TOP + r * (ch + RG2)
  const bufX = (k) => GLEFT + k * (cw + G2)

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg ed__svg',
    viewBox: `0 0 ${W} ${height}`,
    role: 'img',
    'aria-label': '编辑距离 滚动数组 O(n) 空间推演动画',
  })

  const markLayer = mk('g', { class: 'ed2-marks' })
  const cellLayer = mk('g', { class: 'ed2-cells' })
  const panelLayer = mk('g', { class: 'ed2-panel' })
  const bufLayer = mk('g', { class: 'ed2-bufs' })
  svgRoot.appendChild(markLayer)
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(panelLayer)
  svgRoot.appendChild(bufLayer)

  const note = mk('text', { class: 'ed-note', x: 30, y: 22 })
  note.textContent =
    '同一张表，但只需要留一行 —— 每个格子只依赖「上一行」和「本行左邻」，唯一被覆盖掉的就是对角。'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', {
      class: 'ed-banner__box',
      x: 30,
      y: BANNER_TOP,
      width: W - 60,
      height: BANNER_H,
      rx: 9,
    }),
  )
  const segRound = mk('text', { class: 'ed-banner__seg', x: 46, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'ed-banner__seg', x: 218, y: BANNER_TOP + BANNER_H / 2 })
  const segVal = mk('text', { class: 'ed-banner__val', x: W - 46, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(segVal)

  // 列头 / 行头
  for (let c = 0; c <= n; c += 1) {
    const t = mk('text', { class: 'ed-colhdr__text', x: colX(c) + cw / 2, y: GRID_TOP - 12 })
    t.textContent = c === 0 ? '""' : b[c - 1]
    markLayer.appendChild(t)
  }
  for (let r = 0; r <= m; r += 1) {
    const t = mk('text', { class: 'ed-hdr__text', x: GLEFT - 14, y: rowY(r) + ch / 2 })
    t.textContent = r === 0 ? '""' : a[r - 1]
    markLayer.appendChild(t)
  }

  // 淡化的二维表
  const cells = []
  for (let r = 0; r <= m; r += 1) {
    const row = []
    for (let c = 0; c <= n; c += 1) {
      const g = mk('g', { class: 'ed2-cell' })
      g.appendChild(
        mk('rect', { class: 'ed2-cell__box', x: colX(c), y: rowY(r), width: cw, height: ch, rx: 4 }),
      )
      const val = mk('text', { class: 'ed2-cell__val', x: colX(c) + cw / 2, y: rowY(r) + ch / 2 })
      g.appendChild(val)
      cellLayer.appendChild(g)
      row.push({ g, val })
    }
    cells.push(row)
  }

  // 右侧三个邻居卡
  const terms = [
    { op: 'replace', tag: '替换' },
    { op: 'delete', tag: '删除' },
    { op: 'insert', tag: '插入' },
  ]
  terms.forEach((t, k) => {
    const y = GRID_TOP + k * (TERM_H + TERM_GAP)
    const g = mk('g', { class: `ed2-term ${opCls(t.op)}` })
    const box = mk('rect', {
      class: 'ed2-term__box',
      x: PANEL_X,
      y,
      width: PANEL_W,
      height: TERM_H,
      rx: 8,
    })
    const main = mk('text', { class: 'ed2-term__main', x: PANEL_X + 14, y: y + 17 })
    const tag = mk('text', { class: `ed2-term__tag ${opCls(t.op)}`, x: PANEL_X + PANEL_W - 14, y: y + 17 })
    tag.textContent = t.tag
    const noteT = mk('text', { class: 'ed2-term__note', x: PANEL_X + 14, y: y + 34 })
    g.appendChild(box)
    g.appendChild(main)
    g.appendChild(tag)
    g.appendChild(noteT)
    panelLayer.appendChild(g)
    t.g = g
    t.main = main
    t.noteT = noteT
  })

  // 滚动数组本体
  const bufEls = []
  for (let k = 0; k <= n; k += 1) {
    const g = mk('g', { class: 'ed2-buf is-old' })
    g.appendChild(
      mk('rect', { class: 'ed2-buf__box', x: bufX(k), y: BUF_TOP, width: cw, height: BUF_H, rx: 6 }),
    )
    const val = mk('text', { class: 'ed2-buf__val', x: bufX(k) + cw / 2, y: BUF_TOP + BUF_H / 2 - 6 })
    g.appendChild(val)
    const idx = mk('text', { class: 'ed2-buf__idx', x: bufX(k) + cw / 2, y: BUF_TOP + BUF_H - 11 })
    idx.textContent = `#${k}`
    g.appendChild(idx)
    bufLayer.appendChild(g)
    bufEls.push({ g, val })
  }

  const bufLabel = mk('text', { class: 'ed-note', x: GLEFT, y: BUF_TOP - 14 })
  bufLabel.textContent = `buf —— 只留一行（长度 n+1 = ${n + 1}）`
  markLayer.appendChild(bufLabel)

  // 数组下方两枚来源标签
  const leftTag = mk('text', { class: 'ed2-tag is-left', x: 0, y: TAG_Y, opacity: 0 })
  leftTag.textContent = '左方'
  const upTag = mk('text', { class: 'ed2-tag is-up', x: 0, y: TAG_Y, opacity: 0 })
  upTag.textContent = '上方'
  markLayer.appendChild(leftTag)
  markLayer.appendChild(upTag)

  // prev 芯片
  markLayer.appendChild(
    mk('rect', {
      class: 'ed2-term__box',
      x: PANEL_X,
      y: BUF_TOP,
      width: PANEL_W,
      height: BUF_H,
      rx: 8,
    }),
  )
  const prevMain = mk('text', { class: 'ed2-term__main', x: PANEL_X + 14, y: BUF_TOP + 18 })
  const prevNote = mk('text', { class: 'ed2-term__note', x: PANEL_X + 14, y: BUF_TOP + 35 })
  markLayer.appendChild(prevMain)
  markLayer.appendChild(prevNote)

  const phaseText = mk('text', { class: 'ed-phase__text', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  /** init/col/done 帧：只留第一张卡，改写成当时的说明。 */
  function onlyFirst(main, note) {
    terms.forEach((t, k) => {
      t.g.setAttribute('class', k === 0 ? `ed2-term ${opCls(t.op)} is-best is-pick` : 'ed2-term is-hidden')
      if (k === 0) {
        t.main.textContent = main
        t.noteT.textContent = note
      }
    })
  }

  function paint(_index, step) {
    if (!step) return
    const { phase, i, j, m: mm, n: nn, dp, buf } = step
    const isDone = phase === 'done'
    const isCell = phase === 'cell'
    const filled = makeFilled(phase, i, j)

    cells.forEach((row, r) => {
      row.forEach((el, c) => {
        const cls = ['ed2-cell']
        const isFilled = filled(r, c)
        let state = 'blank'
        if (isFilled) {
          if (phase === 'init') state = 'alive'
          else if (isDone) state = r === mm ? 'alive' : 'gone'
          else if (r < i) state = r < i - 1 ? 'gone' : c < j ? 'wiped' : 'alive'
          else state = 'new'
        }
        if (state !== 'blank') cls.push(`is-${state}`)
        // 被覆盖掉的那一格就是对角 —— 本画法的主角
        if (isCell && r === i - 1 && c === j - 1) cls.push('is-diag')
        if ((isCell || phase === 'col') && r === i && c === j) cls.push('is-cur')
        el.g.setAttribute('class', cls.join(' '))
        el.val.textContent = isFilled ? String(dp[r][c]) : ''
      })
    })

    // 缓冲行：k <= j 是本行已经写过的部分，k > j 还是上一行
    bufEls.forEach((el, k) => {
      const cls = ['ed2-buf']
      if (isDone || phase === 'init') cls.push(isDone ? 'is-new' : 'is-old')
      else cls.push(k <= j ? 'is-new' : 'is-old')
      if (isCell && k === j) cls.push('is-cur')
      el.g.setAttribute('class', cls.join(' '))
      el.val.textContent = String(buf[k])
    })

    // 「左方」「上方」的来源标签
    if (isCell) {
      leftTag.setAttribute('x', bufX(j - 1) + cw / 2)
      upTag.setAttribute('x', bufX(j) + cw / 2)
      leftTag.setAttribute('opacity', '1')
      upTag.setAttribute('opacity', '1')
    } else {
      leftTag.setAttribute('opacity', '0')
      upTag.setAttribute('opacity', '0')
    }

    // 右侧三个邻居卡
    if (isCell) {
      const vals = { replace: step.diag, delete: step.up, insert: step.left }
      const src = {
        replace: `dp[${i - 1}][${j - 1}]`,
        delete: `dp[${i - 1}][${j}]`,
        insert: `dp[${i}][${j - 1}]`,
      }
      const notes = {
        replace: step.match ? '字符相同 —— 就是它' : '旧值已被覆盖，靠 prev 留了一份',
        delete: step.match ? '不用看（至少大 1）' : '写之前还躺在 buf[j] 里',
        insert: step.match ? '不用看（至少大 1）' : '本行刚写进 buf[j-1]',
      }
      for (const t of terms) {
        const tied = step.match ? t.op === 'replace' : step.ties.includes(t.op)
        const cls = ['ed2-term', opCls(t.op)]
        if (tied) cls.push('is-best')
        if (tied && t.op === step.op) cls.push('is-pick')
        if (step.match && t.op !== 'replace') cls.push('is-off')
        t.g.setAttribute('class', cls.join(' '))
        t.main.textContent = `${src[t.op]} = ${vals[t.op]}`
        t.noteT.textContent = notes[t.op]
      }
      prevMain.textContent = `prev = ${step.saved}`
      prevNote.textContent = '上一行的对角，数组里那一格已经被覆盖'
    } else if (phase === 'init') {
      onlyFirst(`buf 初值 = [${buf0.join(', ')}]`, '第 0 行直接当 buf 的初值 —— 不用算')
      prevMain.textContent = 'prev 还没意义'
      prevNote.textContent = '第一行开始时才从 buf[0] 取出来'
    } else if (phase === 'col') {
      onlyFirst(`buf[0] 改成 ${i}`, `dp[${i - 1}][0] = ${step.saved} 先被取出来存进 prev`)
      prevMain.textContent = `prev = ${step.saved}`
      prevNote.textContent = '第一格的对角已经拿到手了'
    } else {
      onlyFirst(`buf[${nn}] = ${step.answer}`, '整个表只用了 n+1 个格子')
      prevMain.textContent = `答案 = buf[${nn}]`
      prevNote.textContent = '左上那一角被丢掉了，答案还是对的'
    }

    // 横幅
    if (phase === 'init') {
      segRound.textContent = '第 0 行'
      segAct.textContent = '直接就是 buf 的初值'
      segVal.textContent = `buf = [${buf0.join(', ')}]`
    } else if (phase === 'col') {
      segRound.textContent = `i = ${i} · 第 0 列`
      segAct.textContent = 'buf[0] 更新，旧的先存进 prev'
      segVal.textContent = `buf[0] = ${i}`
    } else if (isCell) {
      segRound.textContent = `i = ${i} · j = ${j}`
      segAct.textContent = step.match
        ? `'${step.charA}' 相同 -> 用 prev`
        : `取${OP_TEXT[step.op]} -> ${step.value}`
      segVal.textContent = `buf[${j}] = ${step.value}`
    } else {
      segRound.textContent = '跑完了'
      segAct.textContent = 'buf 就是最后一行'
      segVal.textContent = `答案 = ${step.answer}`
    }

    if (phase === 'init') {
      phaseText.textContent = '滚动数组的初值就是第 0 行 —— 空间从 m·n 个格子直接砍到 n+1 个。'
    } else if (phase === 'col') {
      phaseText.textContent = '每行开头都有一个坑：buf[0] 要先备份给 prev，改完就再也取不到旧值了。'
    } else if (isCell) {
      phaseText.textContent = step.match
        ? `对角 dp[${i - 1}][${j - 1}] 已经不在数组里了 —— prev = ${step.saved} 就是它。`
        : `上方在本行 buf[${j}] 里、左方是刚写的 buf[${j - 1}] —— 只有对角必须靠 prev。`
    } else {
      phaseText.textContent =
        '结论：只要推进顺序是「一行一行从左往右」，n+1 个格子就够 —— 答案还是 buf[n]。'
    }

    renderRichText(descEl, step.desc)
  }

  return { svgRoot, paint }
}

/* ==================================================================== */

function mount(host, options, mode) {
  if (!host || host.dataset.edMounted === '1') return { destroy() {} }
  host.dataset.edMounted = '1'
  ensureStyles()

  const steps = buildEditDistanceSteps(options)
  const s0 = steps[0]

  const rootEl = document.createElement('div')
  rootEl.className = 'viz ed'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const descEl = makeDesc()

  if (s0.m === 0 && s0.n === 0) {
    const mk = svgEl
    const svg0 = mk('svg', { class: 'viz__svg ed__svg', viewBox: '0 0 620 120', role: 'img' })
    const t0 = mk('text', {
      x: 310,
      y: 60,
      style: 'fill: var(--ed-muted, #657168); font-size: 14px; text-anchor: middle;',
    })
    t0.textContent = '两个都是空串 —— 一个操作都不用做，答案是 0'
    svg0.appendChild(t0)
    stage.appendChild(svg0)
    rootEl.appendChild(descEl)
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    ensureChromeStyles()
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.edMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  const built = mode === 'grid' ? buildGrid(steps, descEl) : buildRoll(steps, descEl)
  stage.appendChild(built.svgRoot)

  rootEl.appendChild(descEl)
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
    onRender: (index, step) => built.paint(index, step),
  })
  player.jumpTo(Math.trunc(options.initialStep) || 0)

  let observer = null
  if (options.autoplay !== false && !reduced && typeof IntersectionObserver === 'function') {
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
      delete host.dataset.edMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

/**
 * 完整二维表。
 * @param {HTMLElement} host
 * @param {{ word1?: string, word2?: string, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountEditDistGrid(host, options = {}) {
  return mount(host, options, 'grid')
}

/**
 * 滚动数组（O(n) 空间）。
 * @param {HTMLElement} host
 * @param {{ word1?: string, word2?: string, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountEditDistRoll(host, options = {}) {
  return mount(host, options, 'roll')
}
