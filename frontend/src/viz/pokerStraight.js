/**
 * pokerStraight.js — 「扑克牌顺子」(LC 61 / 剑指 61) 的 SVG 渲染层：排序 + 数王补洞。
 *
 * 对应文章里的「动画一」：占位符 algo-viz--poker61。
 * 视觉分五段：
 *   1. 顶部横幅：阶段 / 动作 / 关键数值
 *   2. 牌面：排序后的 5 张牌（王 = 烫金，当前相邻对 = 橙框）
 *   3. 相邻对账本：每对非王牌一枚 chip（差 1 连续 / 差 N 王补 / 重复 / 王不够）
 *   4. 拼出的顺子：已接上的连续段，王补的格子烫金标注「王→6」
 *   5. 判定 + 底部结论行
 *
 * 配色通道（坑 V）：fill 表示「这一段属于哪一part」，stroke 表示「是不是当前」。
 * 等宽字体只给纯数字用；任何含中文 / → / × 的文本走继承字体（坑：Consolas 无中文字形）。
 *
 * 通用坑：A（CSS 变量字面量兜底）/ K（标记层后挂）/ X（横幅多段固定偏移）。
 */

import { buildPokerStraightSteps, cardName } from './pokerStraightSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'p61-styles'
const PLAY_MS = 1050

const STYLES = `
.p61 { display: flex; flex-direction: column; gap: 14px; }
.p61__svg { width: 100%; height: auto; display: block; }

.p61-note {
  fill: var(--p61-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61-banner__box {
  fill: var(--p61-banner, #f4f3ef);
  stroke: var(--p61-line, #c3c9c2);
  stroke-width: 1.5;
}
.p61-banner__seg {
  fill: var(--p61-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.p61-banner__val {
  fill: var(--p61-gold, #c2872f);
  font-size: 16px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
}
.p61-seclabel {
  fill: var(--p61-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 牌面 ---- */
.p61-card__box {
  fill: var(--p61-fill, #ffffff);
  stroke: var(--p61-line, #c3c9c2);
  stroke-width: 1.5;
}
.p61-card__val {
  fill: var(--p61-ink, #1f2a24);
  font-size: 25px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-card__sub {
  fill: var(--p61-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-card.is-joker .p61-card__box {
  fill: var(--p61-gold-fill, #fdf3e3);
  stroke: var(--p61-gold, #c2872f);
  stroke-width: 2.4;
}
.p61-card.is-joker .p61-card__val { fill: var(--p61-gold, #c2872f); }
.p61-card.is-joker .p61-card__sub { fill: var(--p61-gold, #c2872f); }
.p61-card.is-cur .p61-card__box {
  stroke: var(--p61-cur, #a45f45);
  stroke-width: 3.2;
}
.p61-card.is-cur .p61-card__val { fill: var(--p61-cur, #a45f45); }
.p61-card.is-dup .p61-card__box {
  stroke: var(--p61-red, #b3452f);
  stroke-width: 3.2;
}
.p61-card.is-dup .p61-card__val { fill: var(--p61-red, #b3452f); }
.p61-card.is-dim .p61-card__box { stroke-dasharray: 4 4; }
.p61-card.is-dim .p61-card__val { fill: var(--p61-dim, #9aa39c); font-weight: 400; }

/* 相邻对之间的连接弧（当前对） */
.p61-pairlink {
  fill: none;
  stroke: var(--p61-cur, #a45f45);
  stroke-width: 2;
  stroke-dasharray: 5 4;
}

/* ---- 相邻对账本 chip ---- */
.p61-gap__box {
  fill: var(--p61-fill, #ffffff);
  stroke: var(--p61-line, #c3c9c2);
  stroke-width: 1.3;
}
.p61-gap__text {
  fill: var(--p61-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-gap.is-pending .p61-gap__box { stroke-dasharray: 4 4; }
.p61-gap.is-pending .p61-gap__text { fill: var(--p61-dim, #9aa39c); }
.p61-gap.is-cur .p61-gap__box {
  fill: var(--p61-gold-fill, #fdf3e3);
  stroke: var(--p61-gold, #c2872f);
  stroke-width: 2.4;
}
.p61-gap.is-cur .p61-gap__text { fill: var(--p61-gold, #c2872f); font-weight: 700; }
.p61-gap.is-tight .p61-gap__box { stroke: var(--p61-green, #3f6b57); }
.p61-gap.is-tight .p61-gap__text { fill: var(--p61-green, #3f6b57); }
.p61-gap.is-filled .p61-gap__box {
  fill: var(--p61-gold-fill, #fdf3e3);
  stroke: var(--p61-gold, #c2872f);
}
.p61-gap.is-filled .p61-gap__text { fill: var(--p61-gold, #c2872f); }
.p61-gap.is-bad .p61-gap__box {
  fill: var(--p61-red-fill, #f9ece8);
  stroke: var(--p61-red, #b3452f);
  stroke-width: 2.2;
}
.p61-gap.is-bad .p61-gap__text { fill: var(--p61-red, #b3452f); font-weight: 700; }

/* ---- 拼出的顺子 ---- */
.p61-slot__box {
  fill: var(--p61-fill, #ffffff);
  stroke: var(--p61-green, #3f6b57);
  stroke-width: 1.8;
}
.p61-slot__val {
  fill: var(--p61-green, #3f6b57);
  font-size: 19px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-slot__mark {
  fill: var(--p61-gold, #c2872f);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61-slot.is-joker .p61-slot__box {
  fill: var(--p61-gold-fill, #fdf3e3);
  stroke: var(--p61-gold, #c2872f);
  stroke-width: 2.4;
}
.p61-slot.is-joker .p61-slot__val { fill: var(--p61-gold, #c2872f); }
.p61-slot.is-hole .p61-slot__box {
  fill: var(--p61-red-fill, #f9ece8);
  stroke: var(--p61-red, #b3452f);
  stroke-dasharray: 4 4;
}
.p61-slot.is-hole .p61-slot__val { fill: var(--p61-red, #b3452f); }
.p61-slot.is-empty { opacity: 0; }

/* ---- 判定 ---- */
.p61-verdict__box {
  fill: var(--p61-fill, #ffffff);
  stroke: var(--p61-line, #c3c9c2);
  stroke-width: 1.5;
}
.p61-verdict__label {
  fill: var(--p61-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61-verdict__main {
  fill: var(--p61-dim, #9aa39c);
  font-size: 21px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.p61-verdict__sub {
  fill: var(--p61-muted, #657168);
  font-size: 13px;
  text-anchor: end;
  dominant-baseline: central;
}
.p61-verdict.is-yes .p61-verdict__box {
  fill: var(--p61-green-fill, #eaf3ee);
  stroke: var(--p61-green, #3f6b57);
  stroke-width: 2.6;
}
.p61-verdict.is-yes .p61-verdict__main { fill: var(--p61-green, #3f6b57); }
.p61-verdict.is-no .p61-verdict__box {
  fill: var(--p61-red-fill, #f9ece8);
  stroke: var(--p61-red, #b3452f);
  stroke-width: 2.6;
}
.p61-verdict.is-no .p61-verdict__main { fill: var(--p61-red, #b3452f); }

.p61-phasetext {
  fill: var(--p61-muted, #657168);
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
const CARDS_LABEL_Y = 98
const CARD_Y = 108
const CARD_W = 92
const CARD_H = 62
const CARD_GAP = 14
const CARD_NAME_Y = CARD_Y + CARD_H + 16
const GAP_LABEL_Y = 214
const GAP_CHIP_Y = 224
const GAP_CHIP_H = 42
const SEG_LABEL_Y = 288
const SEG_Y = 298
const SEG_H = 46
const VERDICT_Y = 372
const VERDICT_H = 54
const PHASE_Y = 456
const H = 474

const PAIR_KIND_TEXT = {
  tight: (p) => `差 1 · 天然连续`,
  filled: (p) => `差 ${p.gap} · 缺 ${p.gap - 1} 个 · 王补`,
  short: (p) => `差 ${p.gap} · 缺 ${p.gap - 1} 个 · 王不够`,
  dup: () => `重复 · 无解`,
}

export function mountPokerStraight(host, options = {}) {
  if (!host || host.dataset.p61Mounted === '1') return { destroy() {} }
  host.dataset.p61Mounted = '1'
  ensureStyles()

  const steps = buildPokerStraightSteps(options)
  const s0 = steps[0]
  const { sorted, zeros, rest } = s0

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg p61__svg',
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    'aria-label': '扑克牌顺子判断动画：排序、数大小王、逐对补洞',
  })
  const cellLayer = mk('g', { class: 'p61-cells' })
  const markLayer = mk('g', { class: 'p61-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer) // 标记层后挂 = 永远压在图形上（坑 K）

  // ── 顶部说明 + 横幅 ──
  const note = mk('text', { class: 'p61-note', x: 30, y: NOTE_Y })
  note.textContent = `输入 ${s0.input.map(cardName).join('、')} · 0 = 大小王可当任意牌 · 5 张连续即顺子`
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'p61-banner__box', x: 30, y: BANNER_Y, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  // 多段文字统一从左往右固定偏移，只有最右端右对齐（坑 X）
  const segPhase = mk('text', { class: 'p61-banner__seg', x: 46, y: BANNER_Y + BANNER_H / 2 })
  const segAct = mk('text', { class: 'p61-banner__seg', x: 168, y: BANNER_Y + BANNER_H / 2 })
  const segVal = mk('text', { class: 'p61-banner__val', x: W - 46, y: BANNER_Y + BANNER_H / 2 })
  markLayer.append(segPhase, segAct, segVal)

  // ── 牌面（排序后） ──
  const cardsLabel = mk('text', { class: 'p61-seclabel', x: 30, y: CARDS_LABEL_Y })
  cardsLabel.textContent = '排序后：王浮到最前，非王牌升序（橙框 = 当前检查的相邻对）'
  markLayer.appendChild(cardsLabel)

  const cardsW = 5 * CARD_W + 4 * CARD_GAP
  const cardsLeft = (W - cardsW) / 2
  const cardEls = sorted.map((c, i) => {
    const x = cardsLeft + i * (CARD_W + CARD_GAP)
    const g = mk('g', { class: 'p61-card' })
    g.appendChild(
      mk('rect', {
        class: 'p61-card__box',
        x,
        y: CARD_Y,
        width: CARD_W,
        height: CARD_H,
        rx: 8,
      }),
    )
    const val = mk('text', { class: 'p61-card__val', x: x + CARD_W / 2, y: CARD_Y + 25 })
    val.textContent = cardName(c)
    const sub = mk('text', { class: 'p61-card__sub', x: x + CARD_W / 2, y: CARD_Y + 47 })
    sub.textContent = c === 0 ? '大小王 · 0' : `牌面 ${c}`
    g.append(val, sub)
    cellLayer.appendChild(g)
    return { g, c, i }
  })

  // 当前相邻对的连接弧（画在两张牌上方）
  const pairLink = mk('path', { class: 'p61-pairlink' })
  markLayer.appendChild(pairLink)

  // ── 相邻对账本 ──
  const gapLabel = mk('text', { class: 'p61-seclabel', x: 30, y: GAP_LABEL_Y })
  gapLabel.textContent = '相邻非王牌逐对检查：差多少、要不要动用王'
  markLayer.appendChild(gapLabel)

  const pairList = []
  for (let i = 0; i < rest.length - 1; i += 1) {
    pairList.push({ index: pairList.length, a: rest[i], b: rest[i + 1], gap: rest[i + 1] - rest[i] })
  }
  const gapChipW = pairList.length > 0 ? Math.min(200, (W - 60 - (pairList.length - 1) * 12) / pairList.length) : 200
  const gapRowW = pairList.length * gapChipW + (pairList.length - 1) * 12
  const gapLeft = (W - gapRowW) / 2
  const gapEls = pairList.map((p) => {
    const x = gapLeft + p.index * (gapChipW + 12)
    const g = mk('g', { class: 'p61-gap is-pending' })
    g.appendChild(
      mk('rect', {
        class: 'p61-gap__box',
        x,
        y: GAP_CHIP_Y,
        width: gapChipW,
        height: GAP_CHIP_H,
        rx: 8,
      }),
    )
    const text = mk('text', { class: 'p61-gap__text', x: x + gapChipW / 2, y: GAP_CHIP_Y + 21 })
    text.textContent = `${cardName(p.a)} → ${cardName(p.b)}`
    const text2 = mk('text', { class: 'p61-gap__text', x: x + gapChipW / 2, y: GAP_CHIP_Y + 37 })
    g.append(text, text2)
    cellLayer.appendChild(g)
    return { g, text, text2, def: p }
  })

  // ── 拼出的顺子 ──
  const segLabel = mk('text', { class: 'p61-seclabel', x: 30, y: SEG_LABEL_Y })
  segLabel.textContent = '已经接上的连续段（烫金 = 王补出来的数）'
  markLayer.appendChild(segLabel)

  // 槽位按 segment 动态重建：默认 5 槽，最坏 13 槽（跨度 12）也能排下
  const MAX_SLOTS = 13
  const slotW = Math.min(56, (W - 100) / MAX_SLOTS)
  const slotGap = 8
  const slotEls = []
  for (let i = 0; i < MAX_SLOTS; i += 1) {
    const g = mk('g', { class: 'p61-slot is-empty' })
    g.appendChild(
      mk('rect', { class: 'p61-slot__box', y: SEG_Y, width: slotW, height: SEG_H, rx: 7 }),
    )
    const val = mk('text', { class: 'p61-slot__val', y: SEG_Y + SEG_H / 2 - 6 })
    const mark = mk('text', { class: 'p61-slot__mark', y: SEG_Y + SEG_H - 9 })
    g.append(val, mark)
    cellLayer.appendChild(g)
    slotEls.push({ g, val, mark })
  }

  // ── 判定 ──
  const verdictG = mk('g', { class: 'p61-verdict' })
  verdictG.appendChild(
    mk('rect', { class: 'p61-verdict__box', x: 30, y: VERDICT_Y, width: W - 60, height: VERDICT_H, rx: 10 }),
  )
  const verdictLabel = mk('text', { class: 'p61-verdict__label', x: 48, y: VERDICT_Y + 17 })
  verdictLabel.textContent = '判定'
  const verdictMain = mk('text', { class: 'p61-verdict__main', x: 48, y: VERDICT_Y + 36 })
  const verdictSub = mk('text', { class: 'p61-verdict__sub', x: W - 48, y: VERDICT_Y + VERDICT_H / 2 })
  verdictG.append(verdictLabel, verdictMain, verdictSub)
  cellLayer.appendChild(verdictG)

  // ── 底部结论行 ──
  const phaseText = mk('text', { class: 'p61-phasetext', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const PHASE_TEXT = {
    init: '顺子 = 5 个互不相同的连续数。排序之后，判断塌缩成「相邻差多少、王够不够补」。',
    sort: '王（0）小于所有牌面，排序后自动排到最前 —— 后面只关心非王牌之间的相邻差。',
    jokers: '每张王就是一次「任意填」。断档出现时填一张，王用完还不够就不是顺子。',
    gap: '相邻差 1 天然连续；差 N 就要拿 N-1 张王补中间的洞；差 0 是重复，王救不了。',
    done: '时间 O(1)（5 张牌排序是常数级），空间 O(1) —— 但这题的分数全在边界和 bug 防范上。',
  }

  const bannerFor = (s) => {
    if (s.phase === 'init') {
      return ['准备', '5 张牌，先排序', `${s0.input.map(cardName).join(' ')}`]
    }
    if (s.phase === 'sort') {
      return ['排序', '王浮到最前，非王升序', sorted.map(cardName).join(' ')]
    }
    if (s.phase === 'jokers') {
      return ['数王', zeros > 0 ? '每张王 = 一次任意填' : '没有王，必须严丝合缝', `王 × ${zeros}`]
    }
    if (s.phase === 'gap') {
      const last = s.checked[s.checked.length - 1]
      const kind = last ? last.kind : 'tight'
      const action =
        kind === 'dup'
          ? `${cardName(last.a)} 和 ${cardName(last.b)} 重复`
          : kind === 'tight'
            ? `${cardName(last.a)}→${cardName(last.b)} 差 1，连续`
            : kind === 'filled'
              ? `${cardName(last.a)}→${cardName(last.b)} 缺 ${last.gap - 1} 个，王补`
              : `${cardName(last.a)}→${cardName(last.b)} 缺 ${last.gap - 1} 个，王只剩 ${s.remaining}`
      return ['检查相邻对', action, `王剩 ${s.remaining}`]
    }
    return [
      '判定',
      s.result ? '是顺子' : '不是顺子',
      s.result ? `拼出 ${s.segment ? s.segment.filled.map((f) => cardName(f.value)).join('-') : ''}` : s.failReason === 'dup' ? '有重复' : '王不够',
    ]
  }

  function paint(_index, step) {
    if (!step) return

    // 牌面：当前相邻对的两张牌高亮
    const curPair = step.phase === 'gap' ? step.checked[step.checked.length - 1] : null
    const dupPair = curPair && curPair.kind === 'dup' ? curPair : null
    cardEls.forEach((el) => {
      const cls = ['p61-card']
      if (el.c === 0) cls.push('is-joker')
      if (dupPair && (el.c === dupPair.a || el.c === dupPair.b)) cls.push('is-dup')
      else if (curPair && (el.c === curPair.a || el.c === curPair.b)) cls.push('is-cur')
      el.g.setAttribute('class', cls.join(' '))
    })
    // 连接弧
    if (curPair && curPair.kind !== 'dup') {
      const ia = sorted.indexOf(curPair.a)
      const ib = sorted.indexOf(curPair.b)
      const ax = cardsLeft + ia * (CARD_W + CARD_GAP) + CARD_W / 2
      const bx = cardsLeft + ib * (CARD_W + CARD_GAP) + CARD_W / 2
      const midY = CARD_Y - 14
      pairLink.setAttribute('d', `M ${ax} ${CARD_Y - 4} Q ${(ax + bx) / 2} ${midY - 14} ${bx} ${CARD_Y - 4}`)
      pairLink.style.opacity = '1'
    } else {
      pairLink.style.opacity = '0'
    }

    // 相邻对账本
    gapEls.forEach(({ g, text, text2, def }) => {
      const done = step.checked.find((c) => c.index === def.index)
      const isCur = step.phase === 'gap' && step.pairIndex === def.index
      let cls = 'p61-gap'
      if (done) cls += ` is-${done.kind}`
      else if (isCur) cls += ' is-cur'
      else cls += ' is-pending'
      g.setAttribute('class', cls)
      if (done) {
        text.textContent = `${cardName(def.a)} → ${cardName(def.b)}`
        text2.textContent = PAIR_KIND_TEXT[done.kind](done)
      } else {
        text.textContent = `${cardName(def.a)} → ${cardName(def.b)}`
        text2.textContent = isCur ? '检查中…' : `差 ${def.gap}`
      }
    })

    // 拼出的顺子
    const seg = step.segment
    slotEls.forEach((el, i) => {
      if (!seg || i >= seg.filled.length) {
        el.g.setAttribute('class', 'p61-slot is-empty')
        return
      }
      const f = seg.filled[i]
      const cls = ['p61-slot', f.byJoker ? 'is-joker' : ''].join(' ').trim()
      el.g.setAttribute('class', cls)
      const n = seg.filled.length
      const rowW = n * slotW + (n - 1) * slotGap
      const x = (W - rowW) / 2 + i * (slotW + slotGap)
      el.g.querySelector('.p61-slot__box').setAttribute('x', x)
      el.val.setAttribute('x', x + slotW / 2)
      el.mark.setAttribute('x', x + slotW / 2)
      el.val.textContent = cardName(f.value)
      el.mark.textContent = f.byJoker ? '王补' : ''
    })

    // 判定
    const vcls = ['p61-verdict']
    if (step.phase === 'done') vcls.push(step.result ? 'is-yes' : 'is-no')
    verdictG.setAttribute('class', vcls.join(' '))
    if (step.phase === 'done') {
      verdictMain.textContent = step.result ? '是顺子' : '不是顺子'
      verdictSub.textContent = step.result
        ? `补 ${step.need} 个洞 · 王用 ${zeros - step.remaining}/${zeros} 张`
        : step.failReason === 'dup'
          ? '非王牌有重复'
          : `需补 ${step.need} 个洞 · 王只有 ${zeros} 张`
    } else {
      verdictMain.textContent = step.failReason ? '不是顺子' : '检查中…'
      verdictSub.textContent = `王还剩 ${step.remaining} 张 · 已接上 ${seg ? seg.filled.length : 0} 张`
    }

    // 横幅 + 底部
    const [bp, ba, bv] = bannerFor(step)
    segPhase.textContent = bp
    segAct.textContent = ba
    segVal.textContent = bv
    phaseText.textContent = PHASE_TEXT[step.phase] || ''

    renderRichText(descEl, step.desc)
  }

  const descEl = makeDesc()
  const rootEl = document.createElement('div')
  rootEl.className = 'viz p61'
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
      delete host.dataset.p61Mounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
