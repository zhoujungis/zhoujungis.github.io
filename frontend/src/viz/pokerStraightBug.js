/**
 * pokerStraightBug.js — 「扑克牌顺子」bug 对照的 SVG 渲染层。
 *
 * 对应文章里的「动画二」：占位符 algo-viz--poker61bug。
 * 三行反例，每行：牌面（5 张迷你牌）+ 正解判定（红 ✗）+ 错法判定（绿 ✓）+
 * 一句「错在哪」。三个错法全部朝同一个方向错 —— 把不是顺子的放过去，
 * 而两组官方样例在三个错法下都返回 true，一声不响。
 *
 * 通用坑：A（CSS 变量字面量兜底）/ K（标记层后挂）/ X（横幅多段固定偏移）。
 */

import { buildPokerStraightBugSteps } from './pokerStraightBugSteps.js'
import { cardName } from './pokerStraightSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'p61b-styles'
const PLAY_MS = 1250

const STYLES = `
.p61b { display: flex; flex-direction: column; gap: 14px; }
.p61b__svg { width: 100%; height: auto; display: block; }

.p61b-note {
  fill: var(--p61b-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-banner__box {
  fill: var(--p61b-banner, #f4f3ef);
  stroke: var(--p61b-line, #c3c9c2);
  stroke-width: 1.5;
}
.p61b-banner__seg {
  fill: var(--p61b-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-banner__val {
  fill: var(--p61b-gold, #c2872f);
  font-size: 15px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
}

/* ---- 反例行 ---- */
.p61b-row__box {
  fill: var(--p61b-fill, #ffffff);
  stroke: var(--p61b-line, #c3c9c2);
  stroke-width: 1.3;
}
.p61b-row__label {
  fill: var(--p61b-ink, #1f2a24);
  font-size: 13.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-row__bannerum {
  fill: var(--p61b-gold, #c2872f);
  font-size: 12px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-row.is-cur .p61b-row__box {
  stroke: var(--p61b-gold, #c2872f);
  stroke-width: 2.4;
}
.p61b-row.is-dim { opacity: 0.45; }

/* 迷你牌 */
.p61b-card__box {
  fill: var(--p61b-fill, #ffffff);
  stroke: var(--p61b-line, #c3c9c2);
  stroke-width: 1.4;
}
.p61b-card__val {
  fill: var(--p61b-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.p61b-card.is-joker .p61b-card__box {
  fill: var(--p61b-gold-fill, #fdf3e3);
  stroke: var(--p61b-gold, #c2872f);
  stroke-width: 2;
}
.p61b-card.is-joker .p61b-card__val { fill: var(--p61b-gold, #c2872f); }
.p61b-card.is-dup .p61b-card__box {
  stroke: var(--p61b-red, #b3452f);
  stroke-width: 2.4;
}
.p61b-card.is-dup .p61b-card__val { fill: var(--p61b-red, #b3452f); }

/* 判定丸 */
.p61b-pill__box {
  fill: var(--p61b-fill, #ffffff);
  stroke: var(--p61b-line, #c3c9c2);
  stroke-width: 1.4;
}
.p61b-pill__head {
  fill: var(--p61b-muted, #657168);
  font-size: 11px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-pill__main {
  fill: var(--p61b-dim, #9aa39c);
  font-size: 14.5px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-pill__sub {
  fill: var(--p61b-muted, #657168);
  font-size: 11.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.p61b-pill.is-no .p61b-pill__box {
  fill: var(--p61b-red-fill, #f9ece8);
  stroke: var(--p61b-red, #b3452f);
  stroke-width: 2.2;
}
.p61b-pill.is-no .p61b-pill__main { fill: var(--p61b-red, #b3452f); }
.p61b-pill.is-yes .p61b-pill__box {
  fill: var(--p61b-green-fill, #eaf3ee);
  stroke: var(--p61b-green, #3f6b57);
  stroke-width: 2.2;
}
.p61b-pill.is-yes .p61b-pill__main { fill: var(--p61b-green, #3f6b57); }
.p61b-pill.is-wrong .p61b-pill__box {
  fill: var(--p61b-green-fill, #eaf3ee);
  stroke: var(--p61b-red, #b3452f);
  stroke-width: 2.2;
  stroke-dasharray: 5 3;
}
.p61b-pill.is-wrong .p61b-pill__main { fill: var(--p61b-green, #3f6b57); }
.p61b-pill.is-wrong .p61b-pill__head { fill: var(--p61b-red, #b3452f); font-weight: 700; }
.p61b-pill.is-pending { opacity: 0.5; }
.p61b-pill.is-pending .p61b-pill__main { fill: var(--p61b-dim, #9aa39c); font-weight: 400; }

.p61b-why {
  fill: var(--p61b-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

.p61b-phasetext {
  fill: var(--p61b-muted, #657168);
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

// ── 布局常量（纵向逐段推，坑 E） ────────────────────────────────────────────
const W = 680
const NOTE_Y = 20
const BANNER_Y = 36
const BANNER_H = 40
const ROW_Y0 = 96
const ROW_H = 134
const PHASE_Y = ROW_Y0 + 3 * ROW_H + 22
const H = PHASE_Y + 24

const MINI_W = 50
const MINI_H = 42
const MINI_GAP = 8
const PILL_W = 150
const PILL_H = 56
const PILL_GAP = 10

// 每条原因拆两行画（单行会超出画布右边被裁掉）
const ROW_REASON = [
  [
    '错在只问「跨度够不够小」，忘了问「有没有重复」。顺子是 5 个互不相同的数 ——',
    '王能填缺失的数，填不了已经出现过的数，重复出现时再多王也无解。',
  ],
  [
    '错在把边界写宽了。5 张无王的牌要连续，跨度必须恰好是 4；写成 ≤ 5，',
    '跨度 5 的牌（中间差着一个数）就被放了进去，而手里一张王都没有。',
  ],
  [
    '错在遍历的起点。从下标 1 开始会把「王-王」这对也算成相邻对：0 - 0 - 1 = -1，',
    '两张王贡献 -2 的负 gap，把真正的洞抵掉了 —— 需要补 3 个洞，账上却只有 1 个。',
  ],
]

export function mountPokerStraightBug(host, options = {}) {
  if (!host || host.dataset.p61bMounted === '1') return { destroy() {} }
  host.dataset.p61bMounted = '1'
  ensureStyles()

  const steps = buildPokerStraightBugSteps()
  // 每组恰好一个 hand 帧 —— 用它收集组元数据，
  // 不能 filter(s => s.group)（hand + verdict 各一份会建出 6 行）
  const groups = steps.filter((s) => s.phase === 'hand').map((s) => s.group)
  const groupCount = groups.length

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg p61b__svg',
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    'aria-label': '扑克牌顺子三个经典错误与正解对照动画',
  })
  const cellLayer = mk('g', { class: 'p61b-cells' })
  const markLayer = mk('g', { class: 'p61b-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer) // 标记层后挂 = 永远压在图形上（坑 K）

  const note = mk('text', { class: 'p61b-note', x: 30, y: NOTE_Y })
  note.textContent = '两组官方样例 [1,2,3,4,5] 与 [0,0,1,2,5] 在三个错法下全部返回 true —— 一声不响'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'p61b-banner__box', x: 30, y: BANNER_Y, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segPhase = mk('text', { class: 'p61b-banner__seg', x: 46, y: BANNER_Y + BANNER_H / 2 })
  const segAct = mk('text', { class: 'p61b-banner__seg', x: 190, y: BANNER_Y + BANNER_H / 2 })
  const segVal = mk('text', { class: 'p61b-banner__val', x: W - 46, y: BANNER_Y + BANNER_H / 2 })
  markLayer.append(segPhase, segAct, segVal)

  // ── 三行反例 ──
  const cardsLeft = 36
  const pillX1 = 348
  const pillX2 = pillX1 + PILL_W + PILL_GAP

  const rowEls = groups.map((g, gi) => {
    const top = ROW_Y0 + gi * ROW_H
    const rowG = mk('g', { class: 'p61b-row is-dim' })
    rowG.appendChild(
      mk('rect', { class: 'p61b-row__box', x: 22, y: top, width: W - 44, height: ROW_H - 12, rx: 10 }),
    )
    const label = mk('text', { class: 'p61b-row__label', x: cardsLeft, y: top + 18 })
    label.textContent = `反例 ${gi + 1}：`
    const cardsText = mk('tspan', { class: 'p61b-row__bannerum' })
    cardsText.textContent = ` ${g.cards.map(cardName).join(', ')}`
    label.appendChild(cardsText)
    const bugText = mk('tspan', { class: 'p61b-row__bannerum' })
    bugText.textContent = `  · 错法「${g.bugName}」`
    label.appendChild(bugText)
    rowG.appendChild(label)

    // 迷你牌
    g.sorted.forEach((c, i) => {
      const x = cardsLeft + i * (MINI_W + MINI_GAP)
      const cg = mk('g', { class: `p61b-card${c === 0 ? ' is-joker' : ''}` })
      cg.appendChild(
        mk('rect', { class: 'p61b-card__box', x, y: top + 30, width: MINI_W, height: MINI_H, rx: 6 }),
      )
      const v = mk('text', { class: 'p61b-card__val', x: x + MINI_W / 2, y: top + 30 + MINI_H / 2 })
      v.textContent = cardName(c)
      cg.appendChild(v)
      rowG.appendChild(cg)
    })

    // 判定丸：正解 / 错法
    const pill = (x, head, main, sub, state) => {
      const pg = mk('g', { class: `p61b-pill is-pending` })
      pg.appendChild(
        mk('rect', { class: 'p61b-pill__box', x, y: top + 30, width: PILL_W, height: PILL_H, rx: 8 }),
      )
      const h = mk('text', { class: 'p61b-pill__head', x: x + 10, y: top + 42 })
      h.textContent = head
      const m = mk('text', { class: 'p61b-pill__main', x: x + 10, y: top + 60 })
      m.textContent = main
      const s = mk('text', { class: 'p61b-pill__sub', x: x + 10, y: top + 76 })
      s.textContent = sub
      pg.append(h, m, s)
      rowG.appendChild(pg)
      return { g: pg, h, m, s }
    }
    const correctPill = pill(pillX1, '正解', '?', '', '')
    const bugPill = pill(pillX2, `错法 · ${g.bugName}`, '?', '', '')

    // 原因（两行）
    ROW_REASON[gi].forEach((line, li) => {
      const why = mk('text', { class: 'p61b-why', x: cardsLeft, y: top + 100 + li * 17 })
      why.textContent = line
      rowG.appendChild(why)
    })

    cellLayer.appendChild(rowG)
    return { g: rowG, correctPill, bugPill, label }
  })

  const phaseText = mk('text', { class: 'p61b-phasetext', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  function paint(_index, step) {
    if (!step) return

    rowEls.forEach((el, gi) => {
      const g = groups[gi]
      const isCur = step.groupIndex === gi
      const cls = ['p61b-row']
      if (isCur) cls.push('is-cur')
      else cls.push('is-dim')
      el.g.setAttribute('class', cls.join(' '))

      // 渐进揭示：verdict#N 揭示第 0..N 行，之后保持；done 全部揭示。
      // 否则 verdict#N 会把后面几行的判定提前亮出来，hand#N+1 又藏回去，闪跳。
      const revealed =
        step.phase === 'done'
          ? true
          : step.phase === 'verdict'
            ? gi <= step.groupIndex
            : gi < step.groupIndex
      const cp = el.correctPill
      const bp = el.bugPill
      if (revealed) {
        cp.g.setAttribute('class', `p61b-pill ${g.correct ? 'is-yes' : 'is-no'}`)
        cp.m.textContent = g.correct ? '✓ 是顺子' : '✗ 不是顺子'
        cp.s.textContent = g.correctReason
        const wrong = g.bugVerdict !== g.correct
        bp.g.setAttribute('class', `p61b-pill ${wrong ? 'is-wrong' : g.bugVerdict ? 'is-yes' : 'is-no'}`)
        bp.m.textContent = g.bugVerdict ? '✓ 判成顺子' : '✗ 判成不是'
        bp.s.textContent = wrong ? '判错了 ✗' : '碰巧一致'
      } else if (step.phase === 'hand' && isCur) {
        cp.g.setAttribute('class', 'p61b-pill')
        cp.m.textContent = '正解怎么判？'
        cp.s.textContent = ''
        bp.g.setAttribute('class', 'p61b-pill')
        bp.m.textContent = '错法怎么判？'
        bp.s.textContent = ''
      } else {
        cp.g.setAttribute('class', 'p61b-pill is-pending')
        cp.m.textContent = '?'
        cp.s.textContent = ''
        bp.g.setAttribute('class', 'p61b-pill is-pending')
        bp.m.textContent = '?'
        bp.s.textContent = ''
      }
    })

    if (step.phase === 'init') {
      segPhase.textContent = '三个错法'
      segAct.textContent = '官方样例全部失声'
      segVal.textContent = '各配一个最小反例'
    } else if (step.phase === 'done') {
      segPhase.textContent = '共性'
      segAct.textContent = '只盯跨度，忘了不重复和王只补缺失'
      segVal.textContent = '方向一致：放水'
    } else {
      const g = step.group
      segPhase.textContent = `反例 ${step.groupIndex + 1}/${groupCount}`
      segAct.textContent = step.phase === 'hand' ? `${g.bugCode}` : '正解 vs 错法'
      segVal.textContent = step.phase === 'hand' ? '先看牌' : g.silent ? '样例抓不住' : ''
    }

    phaseText.textContent =
      step.phase === 'init'
        ? '下面三组牌，正解全部判「不是顺子」，三个错法全部判「是顺子」—— 而且官方样例一个都抓不到。'
        : step.phase === 'done'
          ? '测顺子题，这三组反例 [1,2,2,3,4] / [1,2,3,4,6] / [0,0,1,2,6] 应当常备 —— 每一个都精准打在一条被忽略的约束上。'
          : ''

    renderRichText(descEl, step.desc)
  }

  const descEl = makeDesc()
  const rootEl = document.createElement('div')
  rootEl.className = 'viz p61b'
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
  if (!reduced && typeof IntersectionObserver === 'function') {
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
      delete host.dataset.p61bMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
