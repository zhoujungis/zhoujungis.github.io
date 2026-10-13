/**
 * lc877.js — 「石子游戏」(LC 877) 的 SVG 渲染层：奇偶位站队 + 一局对弈。
 *
 * 视觉语法：偶数下标 = 绿、奇数下标 = 橙，两个「和」筹码并排，赢的那边点亮；
 * 取走的堆退化成虚线壳，里面留下 A / L 与分值。
 *
 * 通用坑：A / V / X。
 */

import { buildLc877Steps } from './lc877Steps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'lc877-styles'

const STYLES = `
.lc877 { display: flex; flex-direction: column; gap: 14px; }
.lc877__svg { width: 100%; height: auto; display: block; }

.lc877-note {
  fill: var(--lc877-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc877-banner__box {
  fill: var(--lc877-banner, #f4f3ef);
  stroke: var(--lc877-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc877-banner__seg {
  fill: var(--lc877-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc877-banner__val {
  fill: var(--lc877-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lc877-pile__box {
  fill: var(--lc877-fill, #ffffff);
  stroke: var(--lc877-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc877-pile__val {
  font-size: 24px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--lc877-ink, #1f2a24);
}
.lc877-pile__idx {
  fill: var(--lc877-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一：底色 = 奇偶站队 */
.lc877-pile.is-even .lc877-pile__box { fill: var(--lc877-ok-fill, #eef5f1); }
.lc877-pile.is-odd .lc877-pile__box { fill: var(--lc877-gold-fill, #fdf3e3); }
.lc877-pile.is-even .lc877-pile__val { fill: var(--lc877-ok, #3f6b57); }
.lc877-pile.is-odd .lc877-pile__val { fill: var(--lc877-hot, #a45f45); }
/* 通道二：取走后退化成虚线壳 */
.lc877-pile.is-taken .lc877-pile__box { fill: none; stroke-dasharray: 3 3; }
.lc877-pile.is-taken .lc877-pile__val { fill: none; }
.lc877-pile.is-taken .lc877-pile__idx { fill: none; }
.lc877-pile__mark {
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: none;
}
.lc877-pile__mark.is-on.is-alex { fill: var(--lc877-ok, #3f6b57); }
.lc877-pile__mark.is-on.is-lee { fill: var(--lc877-hot, #a45f45); }

.lc877-chip__box {
  fill: var(--lc877-fill, #ffffff);
  stroke: var(--lc877-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc877-chip__text {
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  fill: var(--lc877-muted, #657168);
}
.lc877-chip.is-win .lc877-chip__box {
  stroke: var(--lc877-gold, #c2872f);
  stroke-width: 3;
  fill: var(--lc877-gold-fill, #fdf3e3);
}
.lc877-chip.is-win .lc877-chip__text { fill: var(--lc877-gold, #c2872f); }

.lc877-score__box {
  fill: var(--lc877-banner, #f4f3ef);
  stroke: var(--lc877-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc877-score__text {
  fill: var(--lc877-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc877-score__text.is-alex { fill: var(--lc877-ok, #3f6b57); }

.lc877-ans__box {
  fill: var(--lc877-ok-fill, #eef5f1);
  stroke: var(--lc877-ok, #3f6b57);
  stroke-width: 2.5;
}
.lc877-ans__text {
  fill: var(--lc877-ok, #3f6b57);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc877-phase__text {
  fill: var(--lc877-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
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

function mount(host, options = {}) {
  if (!host || host.dataset.lc877Mounted === '1') return { destroy() {} }
  host.dataset.lc877Mounted = '1'
  ensureStyles()

  const steps = buildLc877Steps(options)
  const s0 = steps[0]
  const { n, piles } = s0

  const W = 680
  const BANNER_TOP = 38
  const BANNER_H = 40
  const ARR_Y = 118
  const ARR_H = 68
  const CHIP_Y = 212
  const CHIP_H = 40
  const SCORE_Y = 274
  const SCORE_H = 36
  const ANS_Y = 332
  const ANS_H = 38
  const PHASE_Y = ANS_Y + 48
  const height = PHASE_Y + 22

  const cw = Math.max(64, Math.min(124, (W - 120 - (n - 1) * 14) / n))
  const rowW = n * cw + (n - 1) * 14
  const LEFT = (W - rowW) / 2
  const cx = (k) => LEFT + k * (cw + 14) + cw / 2

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg lc877__svg',
    viewBox: `0 0 ${W} ${height}`,
    role: 'img',
    'aria-label': '石子游戏 奇偶位站队动画',
  })
  const markLayer = mk('g', { class: 'lc877-marks' })
  const cellLayer = mk('g', { class: 'lc877-cells' })
  svgRoot.appendChild(markLayer)
  svgRoot.appendChild(cellLayer)

  const note = mk('text', { class: 'lc877-note', x: 30, y: 22 })
  note.textContent = '偶数堆时先手必胜：开局按原始下标的奇偶站队，取和大的那一队'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'lc877-banner__box', x: 30, y: BANNER_TOP, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'lc877-banner__seg', x: 46, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'lc877-banner__seg', x: 176, y: BANNER_TOP + BANNER_H / 2 })
  const segVal = mk('text', { class: 'lc877-banner__val', x: W - 46, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(segVal)

  const pileEls = []
  for (let k = 0; k < n; k += 1) {
    const g = mk('g', { class: `lc877-pile ${k % 2 === 0 ? 'is-even' : 'is-odd'}` })
    g.appendChild(
      mk('rect', { class: 'lc877-pile__box', x: cx(k) - cw / 2, y: ARR_Y, width: cw, height: ARR_H, rx: 8 }),
    )
    const val = mk('text', { class: 'lc877-pile__val', x: cx(k), y: ARR_Y + 28 })
    val.textContent = String(piles[k])
    const idx = mk('text', { class: 'lc877-pile__idx', x: cx(k), y: ARR_Y + ARR_H - 14 })
    idx.textContent = `#${k} ${k % 2 === 0 ? '偶' : '奇'}`
    const mark = mk('text', { class: 'lc877-pile__mark', x: cx(k), y: ARR_Y + ARR_H - 14 })
    g.appendChild(val)
    g.appendChild(idx)
    g.appendChild(mark)
    cellLayer.appendChild(g)
    pileEls.push({ g, val, idx, mark })
  }

  // 两个奇偶和筹码
  const chipW = 190
  const chipGap = 30
  const chipTotal = chipW * 2 + chipGap
  const chipLeft = (W - chipTotal) / 2
  const mkChip = (x, text, isWin) => {
    const g = mk('g', { class: `lc877-chip ${isWin ? 'is-win' : ''}` })
    g.appendChild(mk('rect', { class: 'lc877-chip__box', x, y: CHIP_Y, width: chipW, height: CHIP_H, rx: 9 }))
    const t = mk('text', { class: 'lc877-chip__text', x: x + chipW / 2, y: CHIP_Y + CHIP_H / 2 })
    t.textContent = text
    g.appendChild(t)
    markLayer.appendChild(g)
    return { g, t }
  }
  const chipEven = mkChip(chipLeft, '', false)
  const chipOdd = mkChip(chipLeft + chipW + chipGap, '', false)

  const scoreBox = mk('rect', { class: 'lc877-score__box', x: 60, y: SCORE_Y, width: W - 120, height: SCORE_H, rx: 10 })
  const scoreText = mk('text', { class: 'lc877-score__text', x: W / 2, y: SCORE_Y + SCORE_H / 2 })
  markLayer.appendChild(scoreBox)
  markLayer.appendChild(scoreText)

  const ansBox = mk('rect', { class: 'lc877-ans__box', x: 60, y: ANS_Y, width: W - 120, height: ANS_H, rx: 10 })
  const ansText = mk('text', { class: 'lc877-ans__text', x: W / 2, y: ANS_Y + ANS_H / 2 })
  markLayer.appendChild(ansBox)
  markLayer.appendChild(ansText)

  const phaseText = mk('text', { class: 'lc877-phase__text', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  function paint(_index, step) {
    if (!step) return
    const { phase, moves, alex, lee, evenSum, oddSum, target } = step
    const isDone = phase === 'done'
    const showChips = phase !== 'init'

    const taken = new Map()
    for (const m of moves) taken.set(m.idx, m)

    pileEls.forEach((el, k) => {
      const cls = [`lc877-pile ${k % 2 === 0 ? 'is-even' : 'is-odd'}`]
      const m = taken.get(k)
      if (m) {
        cls.push('is-taken')
        el.mark.textContent = m.who === 'alex' ? `A ${m.val}` : `L ${m.val}`
        el.mark.setAttribute('class', `lc877-pile__mark is-on ${m.who === 'alex' ? 'is-alex' : 'is-lee'}`)
      } else {
        el.mark.textContent = ''
        el.mark.setAttribute('class', 'lc877-pile__mark')
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    chipEven.g.setAttribute('opacity', showChips ? '1' : '0')
    chipOdd.g.setAttribute('opacity', showChips ? '1' : '0')
    chipEven.t.textContent = `偶数位和 = ${evenSum}`
    chipOdd.t.textContent = `奇数位和 = ${oddSum}`
    chipEven.g.setAttribute('class', `lc877-chip ${target === 'even' ? 'is-win' : ''}`)
    chipOdd.g.setAttribute('class', `lc877-chip ${target === 'odd' ? 'is-win' : ''}`)

    scoreText.textContent = moves.length
      ? `Alex ${alex}  :  ${lee} Lee`
      : 'Alex 先手 —— 还没开局'
    ansText.textContent = isDone ? `先手必胜 —— Alex ${alex} : ${lee} Lee` : ''
    ansBox.setAttribute('class', 'lc877-ans__box')
    ansText.setAttribute('class', 'lc877-ans__text')

    if (phase === 'init') {
      segRound.textContent = '开局'
      segAct.textContent = `${n} 堆（偶数）`
      segVal.textContent = `(${piles.join(', ')})`
    } else if (phase === 'parity') {
      segRound.textContent = '站队'
      segAct.textContent = `Alex 锁定${target === 'even' ? '偶数位' : '奇数位'}`
      segVal.textContent = `第一步取${target === 'even' ? '左' : '右'}端`
    } else if (phase === 'take') {
      const last = moves[moves.length - 1]
      segRound.textContent = `${last.who === 'alex' ? 'Alex' : 'Lee'} 取${last.end === 'left' ? '左' : '右'}端`
      segAct.textContent = `原下标 ${last.idx}（${last.idx % 2 === 0 ? '偶' : '奇'}）`
      segVal.textContent = `拿到 ${last.val}`
    } else {
      segRound.textContent = '终局'
      segAct.textContent = `Alex ${alex} : ${lee} Lee`
      segVal.textContent = '先手必胜'
    }

    phaseText.textContent = isDone
      ? '堆数为偶数时这个 trick 必胜；堆数是奇数时两端奇偶不同，必须老老实实上区间 DP。'
      : phase === 'parity'
        ? '取左端 -> 只能拿原始偶数位；取右端 -> 只能拿奇数位。所以第一次取哪一端，就是选队。'
        : 'Lee 取走一端后，剩下两端必然一个是 Alex 队的下标、一个不是 —— Alex 永远有得选。'

    renderRichText(descEl, step.desc)
  }

  const descEl = makeDesc()
  const rootEl = document.createElement('div')
  rootEl.className = 'viz lc877'
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
  const player = createPlayer({ steps, controls, intervalMs: 900, onRender: paint })
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
      delete host.dataset.lc877Mounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

/**
 * 石子游戏（默认 piles = [5,3,4,5]）。
 * @param {HTMLElement} host
 * @param {{ piles?: number[], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountLc877(host, options = {}) {
  return mount(host, options)
}
