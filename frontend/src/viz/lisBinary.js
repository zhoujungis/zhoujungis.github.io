/**
 * lisBinary.js — 「最长递增子序列」(LC 300) O(n log n) 二分解法的 SVG 渲染层。
 *
 * 一排 nums 格子 + 一排 tails 格子（动态长度，每格是「该长度下的最小末尾」）
 * + 二分区间底色 + mid / pos 徽标 + 被替换掉的旧值（带删除线）。
 *
 * 通用坑：A / K / L / V / W。
 */

import { buildLisBinarySteps } from './lisBinarySteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'lisbin-styles'

const NOTE_Y = 26
const BANNER_TOP = 42
const BANNER_H = 44
const I_BADGE_Y = 108
const ARR_Y = 122
const ARR_H = 48
const OLD_Y = 190
const TAILS_Y = 204
const TAILS_H = 48
const BADGE_Y = 268
const RANGE_Y = 289
const LOHI_Y = 306
const ANS_Y = 324
const ANS_H = 32
const PHASE_Y = 380

const LABEL_X = 30
const AVAIL = 604
const PLAY_MS = 1000

const STYLES = `
.lisbin {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.lisbin__svg { width: 100%; height: auto; display: block; }

.lisbin-note {
  fill: var(--lisbin-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisbin-banner__box {
  fill: var(--lisbin-banner, #f4f3ef);
  stroke: var(--lisbin-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisbin-banner__seg {
  fill: var(--lisbin-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-banner__val {
  fill: var(--lisbin-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisbin-cell__box {
  fill: var(--lisbin-fill, #ffffff);
  stroke: var(--lisbin-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisbin-cell__val {
  fill: var(--lisbin-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-cell__sub {
  fill: var(--lisbin-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-cell__old {
  fill: var(--lisbin-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.lisbin-cell__old.is-on { opacity: 1; }
.lisbin-oldline {
  stroke: var(--lisbin-dim, #9aa39c);
  stroke-width: 1.2;
  opacity: 0;
}
.lisbin-oldline.is-on { opacity: 1; }

/* ---- 通道一：底色（搜索区间内 / 区间外） ---- */
.lisbin-cell.is-range .lisbin-cell__box { fill: var(--lisbin-ok-fill, #eef5f1); }
.lisbin-cell.is-out .lisbin-cell__box { fill: var(--lisbin-banner, #f4f3ef); }
.lisbin-cell.is-out .lisbin-cell__val { fill: var(--lisbin-dim, #9aa39c); }
/* ---- 通道二：边框 ---- */
.lisbin-cell.is-mid .lisbin-cell__box {
  stroke: var(--lisbin-hot, #a45f45);
  stroke-width: 3;
}
.lisbin-cell.is-mid .lisbin-cell__val { fill: var(--lisbin-hot, #a45f45); }
.lisbin-cell.is-pos .lisbin-cell__box {
  stroke: var(--lisbin-gold, #c2872f);
  stroke-width: 3;
}
.lisbin-cell.is-pos .lisbin-cell__val { fill: var(--lisbin-gold, #c2872f); }
.lisbin-cell.is-cur .lisbin-cell__box {
  stroke: var(--lisbin-hot, #a45f45);
  stroke-width: 3;
}
.lisbin-cell.is-cur .lisbin-cell__val { fill: var(--lisbin-hot, #a45f45); }
.lisbin-cell.is-fresh .lisbin-cell__box {
  fill: var(--lisbin-gold-fill, #fdf3e3);
  stroke: var(--lisbin-gold, #c2872f);
  stroke-width: 3;
}
.lisbin-cell.is-fresh .lisbin-cell__val { fill: var(--lisbin-gold, #c2872f); }
.lisbin-cell.is-ghost .lisbin-cell__box {
  fill: none;
  stroke: var(--lisbin-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}

.lisbin-badge__box {
  fill: var(--lisbin-hot, #a45f45);
  opacity: 0;
}
.lisbin-badge__box.is-on { opacity: 1; }
.lisbin-badge__box.is-gold { fill: var(--lisbin-gold, #c2872f); }
.lisbin-badge__text {
  fill: #ffffff;
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.lisbin-badge__text.is-on { opacity: 1; }

.lisbin-range-line {
  stroke: var(--lisbin-ok, #3f6b57);
  stroke-width: 2;
  opacity: 0;
}
.lisbin-range-line.is-on { opacity: 1; }

.lisbin-label {
  fill: var(--lisbin-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-info {
  fill: var(--lisbin-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisbin-ans__box {
  fill: var(--lisbin-banner, #f4f3ef);
  stroke: var(--lisbin-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisbin-ans__box.is-hot {
  fill: var(--lisbin-gold-fill, #fdf3e3);
  stroke: var(--lisbin-gold, #c2872f);
  stroke-width: 2;
}
.lisbin-ans__text {
  fill: var(--lisbin-ink, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisbin-ans__text.is-hot { fill: var(--lisbin-gold, #c2872f); }

.lisbin-phase__text {
  fill: var(--lisbin-muted, #657168);
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

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{ nums?: number[], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountLisBinary(host, options = {}) {
  if (!host || host.dataset.lisbinMounted === '1') return { destroy() {} }
  host.dataset.lisbinMounted = '1'
  ensureStyles()

  const steps = buildLisBinarySteps(options)
  const autoplay = options.autoplay !== false
  const s0 = steps[0]
  const nums = s0.nums
  const n = s0.n

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz lisbin'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const descEl = () => {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  if (n === 0) {
    const svg0 = mk('svg', { class: 'viz__svg lisbin__svg', viewBox: '0 0 620 120', role: 'img' })
    const t0 = mk('text', {
      x: 310,
      y: 60,
      style: 'fill: var(--lisbin-muted, #657168); font-size: 14px; text-anchor: middle;',
    })
    t0.textContent = '数组为空 —— 没有子序列，答案是 0'
    svg0.appendChild(t0)
    stage.appendChild(svg0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    ensureChromeStyles()
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.lisbinMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  const gap = 8
  let cellW = 56
  const need = n * cellW + (n - 1) * gap
  if (need > AVAIL) cellW = Math.max(24, Math.floor((AVAIL - (n - 1) * gap) / n))
  const rowW = n * cellW + (n - 1) * gap
  const width = Math.max(660, LABEL_X * 2 + rowW)
  const LEFT = (width - rowW) / 2
  const cx = (i) => LEFT + i * (cellW + gap) + cellW / 2
  const BANNER_W = width - LABEL_X * 2
  const height = PHASE_Y + 22

  const svgRoot = mk('svg', {
    class: 'viz__svg lisbin__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '最长递增子序列 二分 + tails 推演动画',
  })
  stage.appendChild(svgRoot)

  const markLayer = mk('g', { class: 'lisbin-marks' })
  const cellLayer = mk('g', { class: 'lisbin-cells' })
  const labelLayer = mk('g', { class: 'lisbin-labels' })
  svgRoot.appendChild(markLayer)
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(labelLayer)

  const note = mk('text', { class: 'lisbin-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = 'tails[len] = 长度为 len+1 的递增子序列里最小的末尾值 —— 答案就是 tails 的长度'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'lisbin-banner__box', x: LABEL_X, y: BANNER_TOP, width: BANNER_W, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'lisbin-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'lisbin-banner__seg', x: LABEL_X + 200, y: BANNER_TOP + BANNER_H / 2 })
  const segVal = mk('text', { class: 'lisbin-banner__val', x: width - LABEL_X - 18, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(segVal)

  const arrLabel = mk('text', { class: 'lisbin-label', x: LEFT - 14, y: ARR_Y + ARR_H / 2 })
  arrLabel.textContent = 'nums'
  markLayer.appendChild(arrLabel)
  const tailsLabel = mk('text', { class: 'lisbin-label', x: LEFT - 14, y: TAILS_Y + TAILS_H / 2 - 5 })
  tailsLabel.textContent = 'tails'
  markLayer.appendChild(tailsLabel)

  // nums 行
  const arrEls = []
  for (let i = 0; i < n; i += 1) {
    const g = mk('g', { class: 'lisbin-cell' })
    g.appendChild(
      mk('rect', { class: 'lisbin-cell__box', x: cx(i) - cellW / 2, y: ARR_Y, width: cellW, height: ARR_H, rx: 6 }),
    )
    const val = mk('text', { class: 'lisbin-cell__val', x: cx(i), y: ARR_Y + ARR_H / 2 - 6 })
    val.textContent = String(nums[i])
    g.appendChild(val)
    const sub = mk('text', { class: 'lisbin-cell__sub', x: cx(i), y: ARR_Y + ARR_H - 10 })
    sub.textContent = `#${i}`
    g.appendChild(sub)
    cellLayer.appendChild(g)
    arrEls.push({ g })
  }

  // tails 行（列 k 对应「长度 k+1 这一档」）
  const tailsEls = []
  for (let i = 0; i < n; i += 1) {
    const g = mk('g', { class: 'lisbin-cell' })
    g.appendChild(
      mk('rect', { class: 'lisbin-cell__box', x: cx(i) - cellW / 2, y: TAILS_Y, width: cellW, height: TAILS_H, rx: 6 }),
    )
    const val = mk('text', { class: 'lisbin-cell__val', x: cx(i), y: TAILS_Y + TAILS_H / 2 - 6 })
    g.appendChild(val)
    const sub = mk('text', { class: 'lisbin-cell__sub', x: cx(i), y: TAILS_Y + TAILS_H - 10 })
    g.appendChild(sub)
    cellLayer.appendChild(g)
    tailsEls.push({ g, val, sub })
  }

  // 被替换掉的旧值（带删除线）
  const oldMarks = []
  for (let i = 0; i < n; i += 1) {
    const t = mk('text', { class: 'lisbin-cell__old', x: cx(i), y: OLD_Y })
    const line = mk('line', {
      class: 'lisbin-oldline',
      x1: cx(i) - 26,
      y1: OLD_Y,
      x2: cx(i) + 26,
      y2: OLD_Y,
    })
    labelLayer.appendChild(t)
    labelLayer.appendChild(line)
    oldMarks.push({ t, line })
  }

  // 搜索区间横线（画在 tails 行下方）
  const rangeLine = mk('line', { class: 'lisbin-range-line', x1: LEFT, y1: RANGE_Y, x2: LEFT, y2: RANGE_Y })
  const rangeTickL = mk('line', { class: 'lisbin-range-line', x1: LEFT, y1: RANGE_Y - 6, x2: LEFT, y2: RANGE_Y + 6 })
  const rangeTickR = mk('line', { class: 'lisbin-range-line', x1: LEFT, y1: RANGE_Y - 6, x2: LEFT, y2: RANGE_Y + 6 })
  markLayer.appendChild(rangeLine)
  markLayer.appendChild(rangeTickL)
  markLayer.appendChild(rangeTickR)

  // mid / pos 徽标（共用一个）
  const probeBadge = mk('g', { class: 'lisbin-badge' })
  const probeBox = mk('rect', {
    class: 'lisbin-badge__box',
    x: cx(0) - 18,
    y: BADGE_Y - 9,
    width: 36,
    height: 18,
    rx: 5,
  })
  const probeText = mk('text', { class: 'lisbin-badge__text', x: cx(0), y: BADGE_Y })
  probeBadge.appendChild(probeBox)
  probeBadge.appendChild(probeText)
  markLayer.appendChild(probeBadge)

  // nums 行的 i 徽标
  const iBadge = mk('g', { class: 'lisbin-badge' })
  const iBox = mk('rect', { class: 'lisbin-badge__box', x: cx(0) - 10, y: I_BADGE_Y - 9, width: 20, height: 18, rx: 5 })
  const iText = mk('text', { class: 'lisbin-badge__text', x: cx(0), y: I_BADGE_Y })
  iText.textContent = 'i'
  iBadge.appendChild(iBox)
  iBadge.appendChild(iText)
  markLayer.appendChild(iBadge)

  const info = mk('text', { class: 'lisbin-info', x: LEFT, y: LOHI_Y })
  markLayer.appendChild(info)

  // 答案行
  const ansBox = mk('rect', { class: 'lisbin-ans__box', x: LEFT, y: ANS_Y, width: rowW, height: ANS_H, rx: 8 })
  markLayer.appendChild(ansBox)
  const ansText = mk('text', { class: 'lisbin-ans__text', x: LEFT + rowW / 2, y: ANS_Y + ANS_H / 2 })
  markLayer.appendChild(ansText)

  const phaseText = mk('text', { class: 'lisbin-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const phase = step.phase
    const isBisect = phase === 'bisect'
    const isPlace = phase === 'place'
    const isDone = phase === 'done'
    const i = step.i
    const tails = step.tails || []
    const answer = step.answer
    const lo = step.lo
    const hi = step.hi
    const mid = step.mid
    const pos = step.pos

    // nums 行（done 帧收起 i 高亮 —— 那时该看 tails 的长度）
    arrEls.forEach((el, k) => {
      const cls = ['lisbin-cell']
      if (i !== null && !isDone && k === i) cls.push('is-cur')
      el.g.setAttribute('class', cls.join(' '))
    })

    // tails 行
    const rangeCls = (k) => {
      if (isBisect) return k >= lo && k < hi ? 'is-range' : 'is-out'
      if (isPlace) return k === pos ? 'is-range' : 'is-out'
      return null
    }
    tailsEls.forEach((el, k) => {
      const cls = ['lisbin-cell']
      if (k < tails.length) {
        el.val.textContent = String(tails[k])
        el.sub.textContent = `len ${k}`
        const rc = rangeCls(k)
        if (rc) cls.push(rc)
        if (isBisect && k === mid) cls.push('is-mid')
        if (isPlace && k === pos) cls.push(step.kind === 'append' ? 'is-fresh' : 'is-pos')
      } else {
        el.val.textContent = ''
        el.sub.textContent = ''
        cls.push('is-ghost')
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    // 被替换掉的旧值
    oldMarks.forEach((m, k) => {
      const on = isPlace && step.kind === 'replace' && k === pos && step.prevVal !== null
      m.t.classList.toggle('is-on', on)
      m.line.classList.toggle('is-on', on)
      if (on) {
        m.t.textContent = `原 ${step.prevVal}`
        const w = String(step.prevVal).length * 7 + 16
        m.line.setAttribute('x1', cx(k) - w / 2)
        m.line.setAttribute('x2', cx(k) + w / 2)
      }
    })

    // 搜索区间
    const showRange = isBisect && hi > lo
    rangeLine.classList.toggle('is-on', showRange)
    rangeTickL.classList.toggle('is-on', showRange)
    rangeTickR.classList.toggle('is-on', showRange)
    if (showRange) {
      const xa = cx(lo) - cellW / 2
      const xb = cx(hi - 1) + cellW / 2
      rangeLine.setAttribute('x1', xa)
      rangeLine.setAttribute('x2', xb)
      rangeTickL.setAttribute('x1', xa)
      rangeTickL.setAttribute('x2', xa)
      rangeTickR.setAttribute('x1', xb)
      rangeTickR.setAttribute('x2', xb)
    }

    // mid / pos 徽标
    const showProbe = isBisect ? mid !== null : isPlace
    probeBox.classList.toggle('is-on', showProbe)
    probeText.classList.toggle('is-on', showProbe)
    probeBox.classList.toggle('is-gold', isPlace)
    if (showProbe) {
      const at = isBisect ? mid : pos
      probeText.textContent = isBisect ? 'mid' : 'pos'
      probeBox.setAttribute('x', cx(at) - 18)
      probeText.setAttribute('x', cx(at))
    }
    const showI = i !== null && !isDone
    iBox.classList.toggle('is-on', showI)
    iText.classList.toggle('is-on', showI)
    if (showI) {
      iBox.setAttribute('x', cx(i) - 10)
      iText.setAttribute('x', cx(i))
    }

    // 信息行
    if (isBisect) {
      info.textContent = `搜索区间 [${lo}, ${hi}) · mid = ${mid} · 找第一个 >= ${step.x} 的位置`
    } else if (isPlace) {
      info.textContent =
        step.kind === 'replace'
          ? `pos = ${pos} · 替换 tails[${pos}]：${step.prevVal} → ${step.x}（长度不变）`
          : `pos = ${pos} · 追加 ${step.x}：长度 ${pos} → ${pos + 1}`
    } else {
      info.textContent = ''
    }

    // 答案行
    ansText.textContent = `目前最长递增子序列长度 = ${answer}`
    const prevAnswer = _index > 0 ? steps[_index - 1].answer : 0
    const grew = answer > prevAnswer
    ansBox.classList.toggle('is-hot', grew || isDone)
    ansText.classList.toggle('is-hot', grew || isDone)

    // 横幅
    if (isBisect || isPlace) {
      segRound.textContent = `i = ${i} · 值 ${step.x}`
      if (isBisect) {
        segAct.textContent = `二分：tails[${mid}] = ${tails[mid]} ${step.goRight ? '<' : '>='} ${step.x}`
      } else if (step.kind === 'replace') {
        segAct.textContent = `${step.prevVal} 换成 ${step.x} —— 末尾更小`
      } else {
        segAct.textContent = `比所有末尾都大 —— 追加`
      }
      segVal.textContent = `tails 长度 = ${answer}`
    } else if (isDone) {
      segRound.textContent = `${n} 个元素处理完`
      segAct.textContent = 'tails 只是登记表，长度才是答案'
      segVal.textContent = `答案 = ${answer}`
    } else {
      segRound.textContent = '换一套记账'
      segAct.textContent = 'tails[len] = 该长度下最小的末尾'
      segVal.textContent = '答案 = tails 长度'
    }

    // 底部状态行
    if (isBisect) {
      phaseText.textContent = step.goRight
        ? `tails[${mid}] = ${tails[mid]} 太小，不可能成为「第一个 >= ${step.x}」的位置 —— 往右收`
        : `tails[${mid}] = ${tails[mid]} 已经够大，而且左边也许有 —— 往左收`
    } else if (isPlace) {
      phaseText.textContent =
        step.kind === 'replace'
          ? `替换让「长度 ${pos + 1} 这一档」的末尾从 ${step.prevVal} 降到 ${step.x} —— 后面更容易接上`
          : `追加让答案从 ${pos} 涨到 ${pos + 1} —— 这是唯一能让答案变大的动作`
    } else if (isDone) {
      phaseText.textContent = '时间 O(n log n)、空间 O(n) —— 每个元素只做一次二分'
    } else {
      phaseText.textContent = 'tails 严格递增 —— 这个性质正是能二分的前提'
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
      delete host.dataset.lisbinMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
