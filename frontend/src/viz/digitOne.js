/**
 * digitOne.js — 「1~n 中数字 1 出现的个数」(LC 233) 的 SVG 渲染层：逐位公式动画。
 *
 * 对应文章里的「动画一」：占位符 algo-viz--lc233。
 * 视觉分五段：
 *   1. 顶部横幅：当前数位 / 动作 / 数值
 *   2. 数位条：n 的每个数字一格，当前位橙、高于它蓝、低于它绿
 *   3. 拆分等式：n = higher × 10w + cur × w + lower，三项同色
 *   4. 三件套卡片 + 三分支表（cur = 0 / 1 / > 1，对号入座）
 *   5. 累计 chips + 合计
 *
 * 配色通道（坑 V / 坑 AB）：fill 表示「这一段属于哪一part」，
 * stroke 表示「是不是当前位」，两者正交叠加，不写互斥判断。
 *
 * 通用坑：A（CSS 变量字面量兜底）/ K（图层顺序）/ X（横幅多段坐标）。
 */

import { buildDigitOneSteps } from './digitOneSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'd1-styles'
const PLAY_MS = 950

const STYLES = `
.d1 { display: flex; flex-direction: column; gap: 14px; }
.d1__svg { width: 100%; height: auto; display: block; }

.d1-note {
  fill: var(--d1-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.d1-banner__box {
  fill: var(--d1-banner, #f4f3ef);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1-banner__seg {
  fill: var(--d1-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.d1-banner__val {
  fill: var(--d1-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-seclabel {
  fill: var(--d1-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 数位条 ---- */
.d1-cell__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1-cell__val {
  fill: var(--d1-ink, #1f2a24);
  font-size: 23px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-posname {
  fill: var(--d1-muted, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-weight {
  fill: var(--d1-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
/* 三段配色走 fill/stroke 两个通道（坑 V）：属于哪一段看填充，是不是当前位看描边 */
.d1-cell.is-hi .d1-cell__box { fill: var(--d1-hi-fill, #e9f0f6); stroke: var(--d1-hi, #3d6a8f); }
.d1-cell.is-hi .d1-cell__val { fill: var(--d1-hi, #3d6a8f); }
.d1-cell.is-low .d1-cell__box { fill: var(--d1-low-fill, #eaf3ee); stroke: var(--d1-low, #3f6b57); }
.d1-cell.is-low .d1-cell__val { fill: var(--d1-low, #3f6b57); }
.d1-cell.is-cur .d1-cell__box { fill: var(--d1-cur-fill, #f8ece5); stroke: var(--d1-cur, #a45f45); stroke-width: 3.2; }
.d1-cell.is-cur .d1-cell__val { fill: var(--d1-cur, #a45f45); }
.d1-cell.is-cur .d1-posname { fill: var(--d1-cur, #a45f45); font-weight: 700; }
.d1-cell.is-cur .d1-weight { fill: var(--d1-cur, #a45f45); }
.d1-cell.is-idle .d1-cell__val { fill: var(--d1-dim, #9aa39c); }

/* ---- 拆分等式 ---- */
/* 等号行含 × 和中文（权值），不能用 Consolas —— 走继承字体，逐字形回退 */
.d1-eq {
  fill: var(--d1-ink, #1f2a24);
  font-size: 14.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-eq.is-generic { opacity: 0.55; }
.d1-eq .eq-hi { fill: var(--d1-hi, #3d6a8f); font-weight: 700; }
.d1-eq .eq-cur { fill: var(--d1-cur, #a45f45); font-weight: 700; }
.d1-eq .eq-low { fill: var(--d1-low, #3f6b57); font-weight: 700; }

/* ---- 三件套卡片 ---- */
.d1-card__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.5;
}
.d1-card__label {
  fill: var(--d1-muted, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-card__val {
  fill: var(--d1-ink, #1f2a24);
  font-size: 21px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-card.is-hi .d1-card__box { stroke: var(--d1-hi, #3d6a8f); stroke-width: 2.2; }
.d1-card.is-hi .d1-card__val { fill: var(--d1-hi, #3d6a8f); }
.d1-card.is-cur .d1-card__box { stroke: var(--d1-cur, #a45f45); stroke-width: 2.6; fill: var(--d1-cur-fill, #f8ece5); }
.d1-card.is-cur .d1-card__val { fill: var(--d1-cur, #a45f45); }
.d1-card.is-low .d1-card__box { stroke: var(--d1-low, #3f6b57); stroke-width: 2.2; }
.d1-card.is-low .d1-card__val { fill: var(--d1-low, #3f6b57); }
.d1-card.is-idle .d1-card__box { stroke-dasharray: 4 4; }
.d1-card.is-idle .d1-card__val { fill: var(--d1-dim, #9aa39c); font-weight: 400; }

/* ---- 三分支表 ---- */
.d1-branch__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.2;
}
.d1-branch__cond {
  fill: var(--d1-muted, #657168);
  font-size: 13px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-branch__formula {
  fill: var(--d1-ink, #1f2a24);
  font-size: 13.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.d1-branch__res {
  fill: var(--d1-dim, #9aa39c);
  font-size: 14px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-branch.is-on .d1-branch__box {
  fill: var(--d1-gold-fill, #fdf3e3);
  stroke: var(--d1-gold, #c2872f);
  stroke-width: 2.4;
}
.d1-branch.is-on .d1-branch__cond { fill: var(--d1-gold, #c2872f); }
.d1-branch.is-on .d1-branch__formula { font-weight: 700; }
.d1-branch.is-on .d1-branch__res { fill: var(--d1-gold, #c2872f); font-size: 15px; }

/* ---- 累计 chips ---- */
.d1-chip__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.4;
}
.d1-chip__top {
  fill: var(--d1-muted, #657168);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-chip__val {
  fill: var(--d1-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-chip.is-new .d1-chip__box { stroke: var(--d1-gold, #c2872f); stroke-width: 2.4; }
.d1-chip.is-new .d1-chip__val { fill: var(--d1-gold, #c2872f); }
.d1-chip.is-off { opacity: 0; }
.d1-total__box {
  fill: var(--d1-fill, #ffffff);
  stroke: var(--d1-line, #c3c9c2);
  stroke-width: 1.4;
}
.d1-total__label {
  fill: var(--d1-muted, #657168);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}
.d1-total__val {
  fill: var(--d1-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.d1-total.is-on .d1-total__box { fill: var(--d1-gold-fill, #fdf3e3); stroke: var(--d1-gold, #c2872f); stroke-width: 2.6; }
.d1-total.is-on .d1-total__label { fill: var(--d1-gold, #c2872f); }
.d1-total.is-on .d1-total__val { fill: var(--d1-gold, #c2872f); }

.d1-phasetext {
  fill: var(--d1-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
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

// ── 布局常量（纵向逐段推，段高显式记账，坑 E） ──────────────────────────────
const W = 680
const NOTE_Y = 20
const BANNER_Y = 36
const BANNER_H = 40
const STRIP_LABEL_Y = 98
const BOX_Y = 108
const BOX_H = 48
const NAME_Y = BOX_Y + BOX_H + 15
const WEIGHT_Y = NAME_Y + 15
const EQ_Y = 214
const CARD_Y = 232
const CARD_H = 56
const BR_LABEL_Y = 310
const ROW_Y = 320
const ROW_H = 30
const ROW_GAP = 6
const CHIP_Y = 442
const CHIP_H = 46
const PHASE_Y = 514
const H = 532

const BOX_W = 72
const BOX_GAP = 18

const BRANCHES = [
  { key: 'zero', cond: 'cur = 0', formula: 'higher × weight' },
  { key: 'one', cond: 'cur = 1', formula: 'higher × weight + lower + 1' },
  { key: 'many', cond: 'cur > 1', formula: '(higher + 1) × weight' },
]

const BRANCH_ACTION = {
  zero: 'cur = 0，不满一个整块',
  one: 'cur = 1，踩在 1 那一截的起点',
  many: 'cur > 1，1 那一截已走完',
}

export function mountDigitOne(host, options = {}) {
  if (!host || host.dataset.d1Mounted === '1') return { destroy() {} }
  host.dataset.d1Mounted = '1'
  ensureStyles()

  const steps = buildDigitOneSteps(options)
  const s0 = steps[0]
  const { n, digits, posCount } = s0

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg d1__svg',
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    'aria-label': '1 到 n 中数字 1 出现次数 逐数位统计动画',
  })
  const cellLayer = mk('g', { class: 'd1-cells' })
  const markLayer = mk('g', { class: 'd1-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer) // 标记层后挂 = 永远压在图形上（坑 K）

  // ── 顶部说明 + 横幅 ──
  const note = mk('text', { class: 'd1-note', x: 30, y: NOTE_Y })
  note.textContent = `n = ${n} · 共 ${posCount} 个数位 · 从个位开始，一位一位地数`
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'd1-banner__box', x: 30, y: BANNER_Y, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  // 多段文字统一从左往右固定偏移，只有最右端右对齐（坑 X）
  const segPos = mk('text', { class: 'd1-banner__seg', x: 46, y: BANNER_Y + BANNER_H / 2 })
  const segAct = mk('text', { class: 'd1-banner__seg', x: 236, y: BANNER_Y + BANNER_H / 2 })
  const segVal = mk('text', { class: 'd1-banner__val', x: W - 46, y: BANNER_Y + BANNER_H / 2 })
  markLayer.append(segPos, segAct, segVal)

  // ── 数位条 ──
  const stripLabel = mk('text', { class: 'd1-seclabel', x: 30, y: STRIP_LABEL_Y })
  stripLabel.textContent = 'n 按位拆开（橙 = 当前位，蓝 = 高于它，绿 = 低于它）'
  markLayer.appendChild(stripLabel)

  const stripW = posCount * BOX_W + (posCount - 1) * BOX_GAP
  const stripLeft = (W - stripW) / 2
  const cellEls = []
  for (let j = 0; j < posCount; j += 1) {
    const i = posCount - 1 - j // 数位下标：0 = 个位
    const cx = stripLeft + j * (BOX_W + BOX_GAP) + BOX_W / 2
    const g = mk('g', { class: 'd1-cell' })
    g.appendChild(
      mk('rect', {
        class: 'd1-cell__box',
        x: cx - BOX_W / 2,
        y: BOX_Y,
        width: BOX_W,
        height: BOX_H,
        rx: 7,
      }),
    )
    const val = mk('text', { class: 'd1-cell__val', x: cx, y: BOX_Y + BOX_H / 2 })
    val.textContent = String(digits[j])
    const name = mk('text', { class: 'd1-posname', x: cx, y: NAME_Y })
    name.textContent = ['个位', '十位', '百位', '千位', '万位', '十万位', '百万位', '千万位', '亿位', '十亿位'][i]
    const weight = mk('text', { class: 'd1-weight', x: cx, y: WEIGHT_Y })
    weight.textContent = `权值 ${10 ** i}`
    g.append(val, name, weight)
    cellLayer.appendChild(g)
    cellEls.push({ g, name, weight })
  }

  // ── 拆分等式（tspan 流动排版，整体居中） ──
  const eq = mk('text', { class: 'd1-eq', x: W / 2, y: EQ_Y })
  markLayer.appendChild(eq)
  const eqTspan = (text, cls) => {
    const t = mk('tspan', cls ? { class: cls } : null)
    t.textContent = text
    return t
  }
  const paintEq = (s) => {
    eq.textContent = ''
    if (s.weight > 0) {
      eq.appendChild(eqTspan(`${s.n} = `))
      eq.appendChild(eqTspan(`${s.higher}`, 'eq-hi'))
      eq.appendChild(eqTspan(` × ${s.weight * 10} + `))
      eq.appendChild(eqTspan(`${s.cur}`, 'eq-cur'))
      eq.appendChild(eqTspan(` × ${s.weight} + `))
      eq.appendChild(eqTspan(`${s.lower}`, 'eq-low'))
    } else {
      eq.textContent = ''
      eq.appendChild(eqTspan('n = higher × (权值 × 10) + cur × 权值 + lower'))
      eq.setAttribute('class', 'd1-eq is-generic')
      return
    }
    eq.setAttribute('class', 'd1-eq')
  }

  // ── 三件套卡片 ──
  const CARD_W = 176
  const CARD_GAP = 26
  const cardsLeft = (W - (3 * CARD_W + 2 * CARD_GAP)) / 2
  const cardDefs = [
    { key: 'hi', label: '高于它的部分 higher', field: 'higher' },
    { key: 'cur', label: '当前位 cur', field: 'cur' },
    { key: 'low', label: '低于它的部分 lower', field: 'lower' },
  ]
  const cardEls = cardDefs.map((d, k) => {
    const x = cardsLeft + k * (CARD_W + CARD_GAP)
    const g = mk('g', { class: 'd1-card' })
    g.appendChild(
      mk('rect', { class: 'd1-card__box', x, y: CARD_Y, width: CARD_W, height: CARD_H, rx: 8 }),
    )
    const label = mk('text', { class: 'd1-card__label', x: x + CARD_W / 2, y: CARD_Y + 17 })
    label.textContent = d.label
    const val = mk('text', { class: 'd1-card__val', x: x + CARD_W / 2, y: CARD_Y + 39 })
    g.append(label, val)
    cellLayer.appendChild(g)
    return { g, val, def: d }
  })

  // ── 三分支表 ──
  const brLabel = mk('text', { class: 'd1-seclabel', x: 30, y: BR_LABEL_Y })
  brLabel.textContent = '三种情况，对号入座'
  markLayer.appendChild(brLabel)

  const branchEls = BRANCHES.map((b, k) => {
    const y = ROW_Y + k * (ROW_H + ROW_GAP)
    const g = mk('g', { class: 'd1-branch' })
    g.appendChild(
      mk('rect', { class: 'd1-branch__box', x: 30, y, width: W - 60, height: ROW_H, rx: 7 }),
    )
    const cond = mk('text', { class: 'd1-branch__cond', x: 46, y: y + ROW_H / 2 })
    cond.textContent = b.cond
    const formula = mk('text', { class: 'd1-branch__formula', x: 140, y: y + ROW_H / 2 })
    formula.textContent = b.formula
    const res = mk('text', { class: 'd1-branch__res', x: W - 46, y: y + ROW_H / 2 })
    g.append(cond, formula, res)
    cellLayer.appendChild(g)
    return { g, res, def: b }
  })

  // ── 累计 chips + 合计 ──
  const CHIP_GAP = 10
  const TOTAL_W = 116
  const TOTAL_GAP = 16
  const chipW = Math.max(
    64,
    Math.min(
      120,
      (W - 60 - TOTAL_W - TOTAL_GAP - (posCount - 1) * CHIP_GAP) / posCount,
    ),
  )
  const chipEls = []
  for (let k = 0; k < posCount; k += 1) {
    const x = 30 + k * (chipW + CHIP_GAP)
    const g = mk('g', { class: 'd1-chip is-off' })
    g.appendChild(
      mk('rect', { class: 'd1-chip__box', x, y: CHIP_Y, width: chipW, height: CHIP_H, rx: 8 }),
    )
    const top = mk('text', { class: 'd1-chip__top', x: x + chipW / 2, y: CHIP_Y + 14 })
    const val = mk('text', { class: 'd1-chip__val', x: x + chipW / 2, y: CHIP_Y + 32 })
    g.append(top, val)
    cellLayer.appendChild(g)
    chipEls.push({ g, top, val })
  }
  const totalX = 30 + posCount * (chipW + CHIP_GAP) - CHIP_GAP + TOTAL_GAP
  const totalG = mk('g', { class: 'd1-total' })
  totalG.appendChild(
    mk('rect', { class: 'd1-total__box', x: totalX, y: CHIP_Y, width: TOTAL_W, height: CHIP_H, rx: 8 }),
  )
  const totalLabel = mk('text', { class: 'd1-total__label', x: totalX + TOTAL_W / 2, y: CHIP_Y + 15 })
  totalLabel.textContent = '合计'
  const totalVal = mk('text', { class: 'd1-total__val', x: totalX + TOTAL_W / 2, y: CHIP_Y + 33 })
  totalG.append(totalLabel, totalVal)
  cellLayer.appendChild(totalG)

  // ── 底部结论行 ──
  const phaseText = mk('text', { class: 'd1-phasetext', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const PHASE_TEXT = {
    init: '每一位单独数：这一位上 1 的个数，只由「高于它、当前位、低于它」三个值决定。',
    split: 'higher 框住当前位之上，lower 框住当前位之下 —— 它们决定当前位能看见多少。',
    zero: 'cur = 0：当前块连 1 那一截的边都没碰到，只拿完整大块那份。',
    one: 'cur = 1：当前块正好从 1 开始，一路数到 lower，共 lower + 1 个。',
    many: 'cur > 1：1 那一截整个落在当前块内，当前块也按满额算。',
    done: '时间是 O(数位个数)，也就是 O(log n)：n 从 1304 换成 21 亿，只是从 4 轮变成 10 轮。',
  }

  const branchResult = (s) => {
    if (s.branch === 'zero') return `${s.higher} × ${s.weight} = ${s.contribution}`
    if (s.branch === 'one') return `${s.higher} × ${s.weight} + ${s.lower} + 1 = ${s.contribution}`
    return `(${s.higher} + 1) × ${s.weight} = ${s.contribution}`
  }

  function paint(_index, step) {
    if (!step) return
    const { phase, posCount: pc, posIndex, weight } = step
    const scanning = weight > 0
    const curJ = scanning ? pc - 1 - posIndex : -1

    // 数位条三段配色
    cellEls.forEach((el, j) => {
      const cls = ['d1-cell']
      if (!scanning) cls.push('is-idle')
      else if (j === curJ) cls.push('is-cur')
      else if (j < curJ) cls.push('is-hi')
      else cls.push('is-low')
      el.g.setAttribute('class', cls.join(' '))
    })

    paintEq(step)

    // 三件套卡片
    cardEls.forEach(({ g, val, def }) => {
      const cls = ['d1-card']
      if (scanning) cls.push(`is-${def.key}`)
      else cls.push('is-idle')
      g.setAttribute('class', cls.join(' '))
      val.textContent = scanning ? String(step[def.field]) : '–'
    })

    // 三分支表：只有 contribute 帧点亮当前分支
    branchEls.forEach(({ g, res, def }) => {
      const on = phase === 'contribute' && step.branch === def.key
      g.setAttribute('class', `d1-branch ${on ? 'is-on' : ''}`)
      res.textContent = on ? branchResult(step) : ''
    })

    // 累计 chips：只显示已处理完的数位，contribute 帧点亮最新一个
    chipEls.forEach((el, k) => {
      const p = step.positions[k]
      const cls = ['d1-chip']
      if (!p) cls.push('is-off')
      else if (phase === 'contribute' && k === step.positions.length - 1) cls.push('is-new')
      el.g.setAttribute('class', cls.join(' '))
      if (p) {
        el.top.textContent = `${p.posName} × ${p.weight}`
        el.val.textContent = String(p.contribution)
      }
    })
    totalG.setAttribute('class', `d1-total ${phase === 'done' ? 'is-on' : ''}`)
    totalVal.textContent = String(step.total)

    // 横幅
    if (phase === 'init') {
      segPos.textContent = '准备'
      segAct.textContent = '逐位扫描，从个位开始'
      segVal.textContent = `n = ${n}`
    } else if (phase === 'done') {
      segPos.textContent = `${pc} 位全部扫完`
      segAct.textContent = '合计'
      segVal.textContent = String(step.total)
    } else {
      segPos.textContent = `${step.posName} · 权值 ${weight}`
      segAct.textContent = phase === 'split' ? '拆三件套' : BRANCH_ACTION[step.branch]
      segVal.textContent = phase === 'split' ? '?' : String(step.contribution)
    }

    phaseText.textContent = PHASE_TEXT[phase] || PHASE_TEXT[step.branch] || ''

    renderRichText(descEl, step.desc)
  }

  const descEl = makeDesc()
  const rootEl = document.createElement('div')
  rootEl.className = 'viz d1'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  stage.appendChild(svgRoot)
  rootEl.appendChild(stage)
  rootEl.appendChild(descEl)
  const controls = createControls()
  rootEl.appendChild(controls.root)
  host.textContent = ''
  host.appendChild(rootEl)
  ensureChromeStyles()

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const player = createPlayer({ steps, controls, intervalMs: PLAY_MS, onRender: paint })
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
      delete host.dataset.d1Mounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
