/**
 * nim.js — 「Nim 博弈」的 SVG 渲染层。
 *
 * 一排石子堆 + 一行「异或累计」+ 制胜一手指位。颜色语义：
 *   金 = 本帧要动的那一堆 / 胜出
 *   绿 = 异或非 0（先手必胜）
 *   红 = 异或为 0（必败态）
 *
 * 通用坑：A（CSS 变量一律带字面量兜底）/ V（互斥状态在 JS 里选好）/ X（横幅从左往右）。
 */

import { buildNimSteps } from './nimSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'nim-styles'

const STYLES = `
.nim { display: flex; flex-direction: column; gap: 14px; }
.nim__svg { width: 100%; height: auto; display: block; }

.nim-note {
  fill: var(--nim-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-banner__box {
  fill: var(--nim-banner, #f4f3ef);
  stroke: var(--nim-line, #c3c9c2);
  stroke-width: 1.5;
}
.nim-banner__seg {
  fill: var(--nim-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-banner__val {
  fill: var(--nim-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.nim-pile__box {
  fill: var(--nim-fill, #ffffff);
  stroke: var(--nim-line, #c3c9c2);
  stroke-width: 1.5;
}
.nim-pile__val {
  fill: var(--nim-ink, #1f2a24);
  font-size: 24px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-pile__bin {
  fill: var(--nim-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-pile.is-ghost .nim-pile__box { fill: none; stroke-dasharray: 3 3; }
.nim-pile.is-ghost .nim-pile__val { fill: none; }
.nim-pile.is-ghost .nim-pile__bin { fill: none; }
.nim-pile.is-target .nim-pile__box {
  stroke: var(--nim-gold, #c2872f);
  stroke-width: 3.5;
  fill: var(--nim-gold-fill, #fdf3e3);
}
.nim-pile.is-target .nim-pile__val { fill: var(--nim-gold, #c2872f); }
.nim-pile.is-done .nim-pile__box {
  stroke: var(--nim-ok, #3f6b57);
  stroke-width: 2.5;
  fill: var(--nim-ok-fill, #eef5f1);
}
.nim-pile.is-done .nim-pile__val { fill: var(--nim-ok, #3f6b57); }

.nim-run__box {
  fill: var(--nim-banner, #f4f3ef);
  stroke: var(--nim-line, #c3c9c2);
  stroke-width: 1.2;
}
.nim-run__val {
  fill: var(--nim-ok, #3f6b57);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-run.is-zero .nim-run__val { fill: var(--nim-bad, #b3452e); }
.nim-run.is-off .nim-run__box { fill: none; stroke-dasharray: 3 3; }
.nim-run.is-off .nim-run__val { fill: none; }

.nim-move__box {
  fill: var(--nim-gold-fill, #fdf3e3);
  stroke: var(--nim-gold, #c2872f);
  stroke-width: 2;
}
.nim-move__text {
  fill: var(--nim-ink, #1f2a24);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-move__text.is-bad { fill: var(--nim-bad, #b3452e); }
.nim-move.is-off { opacity: 0; }

.nim-ans__box {
  fill: var(--nim-ok-fill, #eef5f1);
  stroke: var(--nim-ok, #3f6b57);
  stroke-width: 2.5;
}
.nim-ans__text {
  fill: var(--nim-ok, #3f6b57);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.nim-ans.is-lose .nim-ans__box {
  fill: var(--nim-bad-fill, #f9ece8);
  stroke: var(--nim-bad, #b3452e);
}
.nim-ans.is-lose .nim-ans__text { fill: var(--nim-bad, #b3452e); }

.nim-phase__text {
  fill: var(--nim-muted, #657168);
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
  if (!host || host.dataset.nimMounted === '1') return { destroy() {} }
  host.dataset.nimMounted = '1'
  ensureStyles()

  const steps = buildNimSteps(options)
  const s0 = steps[0]
  const { n, piles } = s0

  const W = 680
  const BANNER_TOP = 38
  const BANNER_H = 40
  const ARR_Y = 116
  const ARR_H = 70
  const RUN_Y = 208
  const RUN_H = 36
  const MOVE_Y = 262
  const MOVE_H = 52
  const ANS_Y = 338
  const ANS_H = 38
  const PHASE_Y = ANS_Y + 54
  const height = PHASE_Y + 22

  const cw = Math.max(56, Math.min(132, (W - 120 - (n - 1) * 12) / n))
  const rowW = n * cw + (n - 1) * 12
  const LEFT = (W - rowW) / 2
  const cx = (k) => LEFT + k * (cw + 12) + cw / 2

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg nim__svg',
    viewBox: `0 0 ${W} ${height}`,
    role: 'img',
    'aria-label': 'Nim 博弈 先手必胜判定动画',
  })
  const markLayer = mk('g', { class: 'nim-marks' })
  const cellLayer = mk('g', { class: 'nim-cells' })
  svgRoot.appendChild(markLayer)
  svgRoot.appendChild(cellLayer)

  const note = mk('text', { class: 'nim-note', x: 30, y: 22 })
  note.textContent = 'Nim 博弈：把所有堆异或起来 —— 非 0 先手必胜，0 先手必败'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'nim-banner__box', x: 30, y: BANNER_TOP, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'nim-banner__seg', x: 46, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'nim-banner__seg', x: 196, y: BANNER_TOP + BANNER_H / 2 })
  const segVal = mk('text', { class: 'nim-banner__val', x: W - 46, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(segVal)

  const pileLabel = mk('text', { class: 'nim-note', x: LEFT - 14, y: ARR_Y + ARR_H / 2 })
  pileLabel.textContent = '各堆'
  markLayer.appendChild(pileLabel)

  const pilesEls = []
  for (let k = 0; k < n; k += 1) {
    const g = mk('g', { class: 'nim-pile' })
    g.appendChild(
      mk('rect', { class: 'nim-pile__box', x: cx(k) - cw / 2, y: ARR_Y, width: cw, height: ARR_H, rx: 8 }),
    )
    const val = mk('text', { class: 'nim-pile__val', x: cx(k), y: ARR_Y + 28 })
    val.textContent = String(piles[k])
    const bin = mk('text', { class: 'nim-pile__bin', x: cx(k), y: ARR_Y + ARR_H - 14 })
    bin.textContent = piles[k].toString(2).padStart(4, '0')
    g.appendChild(val)
    g.appendChild(bin)
    cellLayer.appendChild(g)
    pilesEls.push({ g, val, bin })
  }

  // 异或累计行
  const runLabel = mk('text', { class: 'nim-note', x: LEFT - 14, y: RUN_Y + RUN_H / 2 })
  runLabel.textContent = '累计异或'
  markLayer.appendChild(runLabel)
  const runEls = []
  for (let k = 0; k < n; k += 1) {
    const g = mk('g', { class: 'nim-run is-off' })
    g.appendChild(
      mk('rect', { class: 'nim-run__box', x: cx(k) - cw / 2, y: RUN_Y, width: cw, height: RUN_H, rx: 7 }),
    )
    const val = mk('text', { class: 'nim-run__val', x: cx(k), y: RUN_Y + RUN_H / 2 })
    g.appendChild(val)
    cellLayer.appendChild(g)
    runEls.push({ g, val })
  }

  // 制胜一面板
  const moveBox = mk('rect', {
    class: 'nim-move__box nim-move',
    x: 60,
    y: MOVE_Y,
    width: W - 120,
    height: MOVE_H,
    rx: 10,
  })
  const moveText = mk('text', { class: 'nim-move__text', x: W / 2, y: MOVE_Y + MOVE_H / 2 })
  markLayer.appendChild(moveBox)
  markLayer.appendChild(moveText)

  // 答案条
  const ansBox = mk('rect', { class: 'nim-ans__box', x: 60, y: ANS_Y, width: W - 120, height: ANS_H, rx: 10 })
  const ansText = mk('text', { class: 'nim-ans__text', x: W / 2, y: ANS_Y + ANS_H / 2 })
  markLayer.appendChild(ansBox)
  markLayer.appendChild(ansText)

  const phaseText = mk('text', { class: 'nim-phase__text', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  function paint(_index, step) {
    if (!step) return
    const { phase, x, move, result, answer } = step
    const isDone = phase === 'done'

    pilesEls.forEach((el, k) => {
      const cls = ['nim-pile']
      if (move && k === move.idx && (phase === 'pick' || phase === 'take' || isDone)) cls.push('is-target')
      if (result && (phase === 'take' || isDone)) cls.push('is-done')
      el.g.setAttribute('class', cls.join(' '))
      // take / done 帧：格子显示新值 + 旧值删除线（画三道横线）
      el.val.textContent = result && (phase === 'take' || isDone) && k === move.idx ? String(result[k]) : String(piles[k])
      el.bin.textContent = (result && (phase === 'take' || isDone) ? result : piles)[k]
        .toString(2)
        .padStart(4, '0')
    })

    // 异或累计行：第 k 格 = 前 k+1 堆异或后的值；xor 帧只亮到当前格
    runEls.forEach((el, k) => {
      const cls = ['nim-run']
      const filled = phase === 'xor' ? k <= step.i : phase !== 'init'
      if (filled) {
        cls.push('is-on')
        el.val.textContent = String(steps[k + 1].run)
      } else {
        cls.push('is-off')
        el.val.textContent = ''
      }
      if (k === n - 1 && x !== null && x === 0) cls.push('is-zero')
      el.g.setAttribute('class', cls.join(' '))
    })

    if (move) {
      moveBox.classList.remove('is-off')
      moveText.classList.remove('is-off')
      moveText.textContent =
        phase === 'take' || isDone
          ? `制胜一手：第 ${move.idx + 1} 堆 ${piles[move.idx]} 个 取走 ${piles[move.idx] - move.newVal} 个 -> 剩 ${move.newVal} 个，异或回到 0`
          : `制胜一手：取 x 的最高位 bit ${move.bit}，第 ${move.idx + 1} 堆 ${piles[move.idx]} 改成 ${move.newVal}`
      moveText.setAttribute('class', 'nim-move__text')
    } else {
      moveBox.classList.add('is-off')
      moveText.classList.add('is-off')
      moveText.textContent = ''
    }

    const win = answer === true
    ansText.textContent = isDone
      ? win
        ? `先手必胜 —— 异或 ${x} 非 0，一定有一手把局面变成必败态`
        : '先手必败 —— 异或为 0，后手镜像应战即可'
      : ''
    ansBox.setAttribute('class', `nim-ans__box ${isDone && !win ? 'is-lose' : ''}`)
    ansText.setAttribute('class', `nim-ans__text ${isDone && !win ? 'is-lose' : ''}`)

    if (phase === 'init') {
      segRound.textContent = '开局'
      segAct.textContent = `${n} 堆石子`
      segVal.textContent = `(${piles.join(', ')})`
    } else if (phase === 'xor') {
      segRound.textContent = `异或第 ${step.i + 1} 堆`
      segAct.textContent = `${piles[step.i]} = ${piles[step.i].toString(2)}`
      segVal.textContent = `累计 = ${step.run}`
    } else if (phase === 'pick') {
      segRound.textContent = `x = ${x}`
      segAct.textContent = `最高置位 bit ${move.bit}`
      segVal.textContent = `改第 ${move.idx + 1} 堆`
    } else if (phase === 'take') {
      segRound.textContent = '取石子'
      segAct.textContent = `第 ${move.idx + 1} 堆 -> ${move.newVal}`
      segVal.textContent = `异或 = 0`
    } else {
      segRound.textContent = win ? '结论' : '结论'
      segAct.textContent = win ? '先手必胜' : '先手必败'
      segVal.textContent = win ? `x = ${x}` : 'x = 0'
    }

    phaseText.textContent = isDone
      ? win
        ? '异或非 0 -> 有制胜一手；异或为 0 -> 任何一步都送给对手非 0。归纳即得 Bouton 定理。'
        : '后手的策略：每次把先手刚动过的那堆，改成让全场异或回到 0。'
      : phase === 'xor'
        ? '异或的妙处：它把 N 堆压成一个数，而「能不能一步走到 0」只看这一个数。'
        : '制胜一手的找法是构造性的 —— 不是搜索，是直接算。'

    renderRichText(descEl, step.desc)
  }

  const descEl = makeDesc()
  const rootEl = document.createElement('div')
  rootEl.className = 'viz nim'
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
      delete host.dataset.nimMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

/**
 * Nim 博弈（默认 piles = [3,4,5]）。
 * @param {HTMLElement} host
 * @param {{ piles?: number[], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountNim(host, options = {}) {
  return mount(host, options)
}
