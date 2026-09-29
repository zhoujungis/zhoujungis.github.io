/**
 * rotate.js — 「轮转数组」(LC 189) 三次翻转解法的 SVG 渲染层。
 *
 * 数组格子行 + 三段区间着色（当前翻转区间淡金）+ i/j 双指针（本帧交换的两格
 * 橙色高亮）+ 结果横幅。flip 帧的两格就是刚 swap 完的 —— 读者能看到值换位。
 *
 * 通用坑：A / K / X / 红线 4。
 */

import { buildRotateSteps } from './rotateSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'rot-styles'

const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const PIN_TOP = 152
const TRI_TOP = 172
const CELL_Y = 194
const CELL_H = 52
const IDX_Y = 262
const PHASE_Y = 286

const LABEL_X = 26
const AVAIL = 604
const PLAY_MS = 1250

const STYLES = `
.rot {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rot__svg { width: 100%; height: auto; display: block; }

.rot-note {
  fill: var(--rot-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rot-banner__box {
  fill: var(--rot-banner, #f4f3ef);
  stroke: var(--rot-line, #c3c9c2);
  stroke-width: 1.5;
}
.rot-banner__seg {
  fill: var(--rot-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rot-banner__ans {
  fill: var(--rot-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rot-cell__box {
  fill: var(--rot-fill, #ffffff);
  stroke: var(--rot-line, #c3c9c2);
  stroke-width: 1.5;
}
.rot-cell__val {
  fill: var(--rot-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.rot-cell__idx {
  fill: var(--rot-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一（底色）：当前翻转区间 */
.rot-cell.is-flipping .rot-cell__box { fill: var(--rot-gold-fill, #fdf3e3); }
/* 通道二（边框）：本帧交换的两格 */
.rot-cell.is-swap .rot-cell__box {
  stroke: var(--rot-hot, #a45f45);
  stroke-width: 3;
}
.rot-cell.is-swap .rot-cell__val { fill: var(--rot-hot, #a45f45); }
/* done 帧：全部就位 */
.rot-cell.is-done .rot-cell__box {
  fill: var(--rot-ok-fill, #eef5f1);
  stroke: var(--rot-ok, #3f6b57);
  stroke-width: 2;
}
.rot-cell.is-done .rot-cell__val { fill: var(--rot-ok, #3f6b57); }

.rot-pin__tag { fill: var(--rot-hot, #a45f45); }
.rot-pin__tri { fill: var(--rot-hot, #a45f45); }
.rot-pin__text {
  fill: var(--rot-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rot-phase__text {
  fill: var(--rot-muted, #657168);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.rot-empty__text {
  fill: var(--rot-muted, #657168);
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
export function mountRotate(host, options = {}) {
  if (!host || host.dataset.rotMounted === '1') return { destroy() {} }
  host.dataset.rotMounted = '1'
  ensureStyles()

  const steps = buildRotateSteps(options)
  const autoplay = options.autoplay !== false
  const n0 = steps[0].arr.length

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz rot'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  if (n0 === 0) {
    const s0 = mk('svg', { class: 'viz__svg rot__svg', viewBox: '0 0 620 120', role: 'img' })
    const t0 = mk('text', { class: 'rot-empty__text', x: 310, y: 60 })
    t0.textContent = '空输入 —— 没有可轮转的元素'
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
        delete host.dataset.rotMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  let cellW = 58
  const need = n0 * cellW + (n0 - 1) * 6
  if (need > AVAIL) cellW = Math.max(20, Math.floor((AVAIL - (n0 - 1) * 6) / n0))
  const rowW = n0 * cellW + (n0 - 1) * 6
  const width = Math.max(660, LABEL_X * 2 + rowW)
  const LEFT = (width - rowW) / 2
  const cx = (i) => LEFT + i * (cellW + 6) + cellW / 2
  const BANNER_W = width - LABEL_X * 2
  const height = PHASE_Y + 24

  const svgRoot = mk('svg', {
    class: 'viz__svg rot__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '轮转数组 三次翻转推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', { class: 'rot-cells' })
  const markLayer = mk('g', { class: 'rot-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'rot-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = '轮转 = 两段交换位置：整体翻转让两段就位，再各自翻回内部顺序'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'rot-banner__box', x: LABEL_X, y: BANNER_TOP, width: BANNER_W, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'rot-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'rot-banner__seg', x: LABEL_X + 250, y: BANNER_TOP + BANNER_H / 2 })
  const ansVal = mk('text', { class: 'rot-banner__ans', x: width - LABEL_X - 18, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(ansVal)

  const cellEls = []
  for (let i = 0; i < n0; i += 1) {
    const g = mk('g', { class: 'rot-cell' })
    const box = mk('rect', { class: 'rot-cell__box', x: cx(i) - cellW / 2, y: CELL_Y, width: cellW, height: CELL_H, rx: 6 })
    g.appendChild(box)
    const val = mk('text', { class: 'rot-cell__val', x: cx(i), y: CELL_Y + CELL_H / 2 })
    g.appendChild(val)
    const idx = mk('text', { class: 'rot-cell__idx', x: cx(i), y: IDX_Y })
    idx.textContent = String(i)
    g.appendChild(idx)
    cellLayer.appendChild(g)
    cellEls.push({ g, box, val })
  }

  // 交换指针（i 一根即可 —— 两格都橙色高亮，i 标签指出左指针位置）
  const pinG = mk('g', { class: 'rot-pin' })
  const pinTag = mk('rect', { class: 'rot-pin__tag', x: 0, y: PIN_TOP, width: 30, height: 20, rx: 5 })
  const pinTri = mk('path', { class: 'rot-pin__tri', d: 'M 0 0 L 0 0 L 0 0' })
  const pinText = mk('text', { class: 'rot-pin__text', x: 0, y: PIN_TOP + 10 })
  pinG.appendChild(pinTag)
  pinG.appendChild(pinTri)
  pinG.appendChild(pinText)
  markLayer.appendChild(pinG)

  // 阶段行（三次翻转的进度）
  const phaseText = mk('text', { class: 'rot-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const { arr, k, n } = step
    const isDone = step.phase === 'done'

    const swapSet = new Set()
    if (step.phase === 'flip' && step.i !== null) {
      swapSet.add(step.i)
      swapSet.add(step.j)
    }
    const fr = step.flipRange

    cellEls.forEach((el, i) => {
      el.val.textContent = String(arr[i])
      const cls = ['rot-cell']
      if (isDone) cls.push('is-done')
      else if (fr && i >= fr[0] && i <= fr[1]) cls.push('is-flipping')
      if (swapSet.has(i)) cls.push('is-swap')
      el.g.setAttribute('class', cls.join(' '))
    })

    // 指针指向 i（左指针）；j 的位置由右格的橙色高亮表达
    if (step.phase === 'flip' && step.i !== null) {
      const x = cx(step.i)
      pinTag.setAttribute('x', x - 15)
      pinTri.setAttribute('d', `M ${x - 6} ${TRI_TOP} L ${x + 6} ${TRI_TOP} L ${x} ${TRI_TOP + 9} z`)
      pinText.setAttribute('x', x)
      pinText.textContent = `i=${step.i}`
      pinG.style.opacity = '1'
    } else {
      pinG.style.opacity = '0'
    }

    // 横幅
    segRound.textContent = step.round > 0 ? `第 ${step.round}/3 次 · ${step.roundName}` : `k = ${k}（mod ${n}）`
    if (step.phase === 'init') {
      segAct.textContent = '取模 → 三次原地翻转'
    } else if (step.phase === 'flip' && step.i !== null) {
      segAct.textContent = `swap(${step.i}, ${step.j})`
    } else if (step.phase === 'flip') {
      segAct.textContent = '区间长度不足 2，跳过'
    } else {
      segAct.textContent = '三次翻转完成'
    }
    ansVal.textContent = isDone ? `[${arr.join(',')}]` : `${n} 个数 · 轮转 ${k} 位`

    // 阶段进度行
    const phases = ['整体', '前 k', '后 n-k']
    const marks = phases.map((name, i) => {
      const doneMark = isDone || step.round > i || (step.round === i + 1 && step.phase === 'flip' && step.i === null)
      const activeMark = step.round === i + 1 && step.phase === 'flip'
      const prefix = doneMark ? '[x]' : activeMark ? '[>]' : '[ ]'
      return `${prefix} ${name}`
    })
    phaseText.textContent = marks.join('   ')

    renderRichText(desc, step.desc)
  }

  rootEl.appendChild(desc)
  const controls = createControls()
  rootEl.appendChild(controls.root)

  host.textContent = ''
  host.appendChild(rootEl)
  ensureChromeStyles()

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const player = createPlayer({ steps, controls, intervalMs: PLAY_MS, onRender: paint })
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
      delete host.dataset.rotMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
