/**
 * greatestSumDiv3.js — 「可被三整除的最大和」(LC 1262) 贪心视角的 SVG 渲染层。
 *
 * 四段布局：顶部 = nums 原数组（值 + 对 3 的余数，sum 帧逐格点亮）；
 * 中部 = m0 / m1 / m2 三行余数桶（升序，相关桶高亮）；两张候选卡片
 * （"削一个 m_r" / "削两个 m_{3-r}"，胜者描金）；转移横幅（S / r / 代价 / 答案）；
 * 底部面板（S / r / 代价 / 答案）。
 *
 * 与 coinChange.js 的骨架一致：模块级 STYLE_ID + ensureStyles()，
 * dataset 幂等守卫，createPlayer + jumpTo，IntersectionObserver 自动播放。
 */

import { buildGreatestSumDiv3Steps } from './greatestSumDiv3Steps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'greatestsumdiv3-styles'

const NOTE_Y = 28
const NUM_LBL_Y = 52
const NUM_Y = 60
const NUM_H = 44
const BUCKET_TOP = 132
const BROW_H = 38
const CARD_Y = 258
const CARD_H = 58
const BANNER_Y = 330
const BANNER_H = 40
const PANEL_Y = 384
const PANEL_H = 50
const PHASE_Y = 452

const AVAIL = 604
const PLAY_MS = 1200

const STYLES = `
.gsv { display: flex; flex-direction: column; gap: 14px; }
.gsv__svg { width: 100%; height: auto; display: block; }

.gsv-note {
  fill: var(--gsv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-note--r { text-anchor: end; }

.gsv-lbl {
  fill: var(--gsv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.gsv-cell__box {
  fill: var(--gsv-fill, #ffffff); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-cell__val {
  fill: var(--gsv-ink, #1f2a24); font-size: 15px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-cell__sub {
  fill: var(--gsv-dim, #9aa39c); font-size: 9.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-cell.is-cur .gsv-cell__box {
  fill: var(--gsv-gold-fill, #fdf3e3); stroke: var(--gsv-gold, #c2872f); stroke-width: 3;
}
.gsv-cell.is-cur .gsv-cell__val { fill: var(--gsv-gold, #c2872f); }
.gsv-cell.is-dropped .gsv-cell__box {
  fill: var(--gsv-past, #eef0ec); stroke: var(--gsv-line, #c3c9c2);
  stroke-dasharray: 4 3; stroke-width: 1.5;
}
.gsv-cell.is-dropped .gsv-cell__val { fill: var(--gsv-dim, #9aa39c); text-decoration: line-through; }

.gsv-bucket__row { opacity: 1; transition: opacity 0.2s ease; }
.gsv-bucket.is-ahead { opacity: 0.28; }
.gsv-chip__box {
  fill: var(--gsv-fill, #ffffff); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-chip__val {
  fill: var(--gsv-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-bucket.is-hot .gsv-chip__box { stroke: var(--gsv-ok, #3f6b57); stroke-width: 2; }
.gsv-bucket.is-hot .gsv-lbl { fill: var(--gsv-ok, #3f6b57); font-weight: 700; }
.gsv-chip.is-pick .gsv-chip__box {
  fill: var(--gsv-gold-fill, #fdf3e3); stroke: var(--gsv-gold, #c2872f); stroke-width: 3;
}
.gsv-chip.is-pick .gsv-chip__val { fill: var(--gsv-gold, #c2872f); }

.gsv-card__box {
  fill: var(--gsv-fill, #ffffff); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-card.is-active .gsv-card__box { stroke: var(--gsv-ok, #3f6b57); stroke-width: 2.5; }
.gsv-card.is-win .gsv-card__box {
  fill: var(--gsv-gold-fill, #fdf3e3); stroke: var(--gsv-gold, #c2872f); stroke-width: 3;
}
.gsv-card__title {
  fill: var(--gsv-muted, #657168); font-size: 12px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-card.is-win .gsv-card__title { fill: var(--gsv-gold, #c2872f); font-weight: 700; }
.gsv-card__num {
  fill: var(--gsv-ink, #1f2a24); font-size: 22px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-card.is-win .gsv-card__num { fill: var(--gsv-gold, #c2872f); }
.gsv-card__num.is-dead { fill: var(--gsv-dim, #9aa39c); font-weight: 500; }

.gsv-banner__box {
  fill: var(--gsv-banner, #f4f3ef); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-banner__text {
  fill: var(--gsv-hot, #a45f45); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-banner__text.is-ok { fill: var(--gsv-ok, #3f6b57); }

.gsv-panel__box {
  fill: var(--gsv-fill, #ffffff); stroke: var(--gsv-line, #c3c9c2); stroke-width: 1.5;
}
.gsv-panel__label {
  fill: var(--gsv-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-panel__num {
  fill: var(--gsv-ink, #1f2a24); font-size: 18px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.gsv-panel__num.is-ok { fill: var(--gsv-ok, #3f6b57); }
.gsv-panel__num.is-fresh { fill: var(--gsv-gold, #c2872f); }
.gsv-panel__num.is-dead { fill: var(--gsv-dim, #9aa39c); }

.gsv-phase__text {
  fill: var(--gsv-muted, #657168); font-size: 13px; font-weight: 600;
  text-anchor: middle; dominant-baseline: central;
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

const fmt = (v) => (v === null || v === undefined ? '∞' : String(v))

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{ nums?: number[], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountGreatestSumDiv3(host, options = {}) {
  if (!host || host.dataset.gsdiv3Mounted === '1') return { destroy() {} }
  host.dataset.gsdiv3Mounted = '1'
  ensureStyles()

  const steps = buildGreatestSumDiv3Steps(options)
  const autoplay = options.autoplay !== false
  const { nums } = steps[0]
  const n = nums.length

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz gsv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg gsv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '可被三整除的最大和 LC1262 贪心推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(cellLayer, markLayer)

  const note = mk('text', { class: 'gsv-note', x: 26, y: NOTE_Y })
  note.textContent = '先全选：sum 是上界，只减不增'
  markLayer.appendChild(note)
  const goal = mk('text', { class: 'gsv-note gsv-note--r', x: width - 26, y: NOTE_Y })
  goal.textContent = `nums = [${nums.join(', ')}] · 目标和 ≡ 0 (mod 3)`
  markLayer.appendChild(goal)

  // nums 行
  const numLbl = mk('text', { class: 'gsv-lbl', x: 26, y: NUM_LBL_Y })
  numLbl.textContent = 'nums（每格下方是对 3 的余数）'
  markLayer.appendChild(numLbl)

  const gap = 8
  const cw = Math.min(56, Math.floor((AVAIL - (n - 1) * gap) / n))
  const rowW = n * cw + (n - 1) * gap
  const nx0 = (width - rowW) / 2
  const numEls = nums.map((v, i) => {
    const px = nx0 + i * (cw + gap)
    const g = mk('g', { class: 'gsv-cell' })
    g.appendChild(mk('rect', { class: 'gsv-cell__box', x: px, y: NUM_Y, width: cw, height: NUM_H, rx: 6 }))
    const val = mk('text', { class: 'gsv-cell__val', x: px + cw / 2, y: NUM_Y + NUM_H / 2 - 6 })
    val.textContent = String(v)
    g.appendChild(val)
    const sub = mk('text', { class: 'gsv-cell__sub', x: px + cw / 2, y: NUM_Y + NUM_H - 9 })
    sub.textContent = `≡${((v % 3) + 3) % 3}`
    g.appendChild(sub)
    cellLayer.appendChild(g)
    return { g, box: g.firstChild }
  })

  // 三个余数桶（三行）
  const bucketEls = [0, 1, 2].map((b) => {
    const y = BUCKET_TOP + b * BROW_H
    const g = mk('g', { class: 'gsv-bucket' })
    const lbl = mk('text', { class: 'gsv-lbl', x: 26, y: y + BROW_H / 2 })
    g.appendChild(lbl)
    markLayer.appendChild(g)
    return { g, lbl, y, chips: [] }
  })

  const chipW = 34
  const chipH = 26
  const chipStart = 128
  const chipGap = 6
  const CHIP_CAP = Math.floor((AVAIL - (chipStart - 26)) / (chipW + chipGap))
  for (const b of [0, 1, 2]) {
    const bucket = bucketEls[b]
    const maxChips = Math.min(CHIP_CAP, 10)
    for (let k = 0; k < maxChips; k += 1) {
      const cx = chipStart + k * (chipW + chipGap)
      const g = mk('g', { class: 'gsv-chip' })
      g.appendChild(mk('rect', { class: 'gsv-chip__box', x: cx, y: bucket.y + (BROW_H - chipH) / 2, width: chipW, height: chipH, rx: 5 }))
      const val = mk('text', { class: 'gsv-chip__val', x: cx + chipW / 2, y: bucket.y + BROW_H / 2 })
      g.appendChild(val)
      bucket.g.appendChild(g)
      bucket.chips.push({ g, val, x: cx })
    }
  }

  // 两张候选卡片
  const cardW = (AVAIL - 24) / 2
  const cardX = [26, 26 + cardW + 24]
  const cards = [0, 1].map((k) => {
    const g = mk('g', { class: 'gsv-card' })
    g.appendChild(mk('rect', { class: 'gsv-card__box', x: cardX[k], y: CARD_Y, width: cardW, height: CARD_H, rx: 9 }))
    const title = mk('text', { class: 'gsv-card__title', x: cardX[k] + cardW / 2, y: CARD_Y + 17 })
    const num = mk('text', { class: 'gsv-card__num', x: cardX[k] + cardW / 2, y: CARD_Y + 40 })
    g.append(title, num)
    markLayer.appendChild(g)
    return { g, title, num }
  })

  // 横幅
  markLayer.appendChild(mk('rect', { class: 'gsv-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'gsv-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  // 面板
  markLayer.appendChild(mk('rect', { class: 'gsv-panel__box', x: 26, y: PANEL_Y, width: width - 52, height: PANEL_H, rx: 9 }))
  const mkStat = (label, cx) => {
    const l = mk('text', { class: 'gsv-panel__label', x: cx, y: PANEL_Y + 14 })
    l.textContent = label
    const v = mk('text', { class: 'gsv-panel__num', x: cx, y: PANEL_Y + 35 })
    markLayer.append(l, v)
    return v
  }
  const sNum = mkStat('S = sum', width / 2 - 190)
  const rNum = mkStat('r = S % 3', width / 2 - 65)
  const dNum = mkStat('代价 drop', width / 2 + 65)
  const resNum = mkStat('答案', width / 2 + 190)

  const phaseText = mk('text', { class: 'gsv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  const HOT = { 0: 'm0', 1: 'm1', 2: 'm2' }
  const BUCKETS_OF = (step) => [step.m0, step.m1, step.m2]
  const IDX_OF = (step) => [step.m0i, step.m1i, step.m2i]

  function paint(_index, step) {
    if (!step) return
    const bucketsReady = step.phase === 'bucket' || step.phase === 'candidate' || step.phase === 'done'
    const isDone = step.phase === 'done'
    const r = step.r

    // nums 行：sum 帧点亮当前格；done 帧给"被削掉"的格划掉
    const dropped = new Set()
    if (isDone && step.chosen === 'one') for (const i of step.candOneIdx) dropped.add(i)
    if (isDone && step.chosen === 'two') for (const i of step.candTwoIdx) dropped.add(i)

    numEls.forEach((el, i) => {
      const cls = ['gsv-cell']
      if (step.phase === 'sum' && i === step.idx) cls.push('is-cur')
      if (dropped.has(i)) cls.push('is-dropped')
      el.g.setAttribute('class', cls.join(' '))
    })

    // 桶：bucket 帧后才亮；相关桶 / 选中的元素描色
    const hotBucket =
      step.phase === 'candidate'
        ? step.active === 'one'
          ? r
          : 3 - r
        : isDone && step.chosen === 'one'
          ? r
          : isDone && step.chosen === 'two'
            ? 3 - r
            : -1
    const pickIdx = new Set(
      isDone && step.chosen === 'one'
        ? step.candOneIdx
        : isDone && step.chosen === 'two'
          ? step.candTwoIdx
          : step.phase === 'candidate' && step.active === 'one'
            ? step.candOneIdx
            : step.phase === 'candidate' && step.active === 'two'
              ? step.candTwoIdx
              : [],
    )
    const vals = BUCKETS_OF(step)
    const idxs = IDX_OF(step)
    bucketEls.forEach((bucket, b) => {
      const cls = ['gsv-bucket']
      if (!bucketsReady) cls.push('is-ahead')
      else if (b === hotBucket) cls.push('is-hot')
      bucket.g.setAttribute('class', cls.join(' '))
      bucket.lbl.textContent = `m${b} 余${b}`
      bucket.chips.forEach((chip, k) => {
        const has = k < vals[b].length
        chip.g.style.display = has ? '' : 'none'
        if (!has) return
        chip.val.textContent = String(vals[b][k])
        chip.g.setAttribute('class', 'gsv-chip' + (idxs[b][k] !== undefined && pickIdx.has(idxs[b][k]) ? ' is-pick' : ''))
      })
    })

    // 候选卡片
    if (r === 0) {
      cards.forEach((c) => { c.g.style.display = 'none' })
    } else {
      cards.forEach((c) => { c.g.style.display = '' })
      const specs = [
        { title: `削一个 m${r}`, val: step.candOne, kind: 'one' },
        { title: `削两个 m${3 - r}`, val: step.candTwo, kind: 'two' },
      ]
      cards.forEach((c, k) => {
        const s = specs[k]
        const cls = ['gsv-card']
        if (step.phase === 'candidate' && step.active === s.kind) cls.push('is-active')
        if (isDone && step.chosen === s.kind) cls.push('is-win')
        c.g.setAttribute('class', cls.join(' '))
        c.title.textContent = r === 0 ? '' : s.title
        c.num.textContent = fmt(s.val)
        c.num.setAttribute('class', 'gsv-card__num' + (s.val === null ? ' is-dead' : ''))
      })
    }

    // 横幅
    if (step.phase === 'init') {
      banner.textContent = 'S = sum(nums)　r = S % 3'
      banner.setAttribute('class', 'gsv-banner__text')
    } else if (step.phase === 'sum') {
      banner.textContent = `S = ${step.runningSum}　（继续累加，最后再看 r）`
      banner.setAttribute('class', 'gsv-banner__text')
    } else if (step.phase === 'bucket') {
      banner.textContent =
        r === 0 ? `S = ${step.total}, r = 0 → 全选即最优` : `S = ${step.total}, r = ${r} → 需要削掉一小撮修正`
      banner.setAttribute('class', 'gsv-banner__text' + (r === 0 ? ' is-ok' : ''))
    } else if (step.phase === 'candidate') {
      banner.textContent = `min(候选 A = ${fmt(step.candOne)}, 候选 B = ${fmt(step.candTwo)})`
      banner.setAttribute('class', 'gsv-banner__text')
    } else {
      banner.textContent =
        r === 0
          ? `答案 = S = ${step.total}`
          : step.drop === null
            ? '答案 = 0（无可行子集，只能选空集）'
            : `答案 = ${step.total} − ${step.drop} = ${step.result}`
      banner.setAttribute('class', 'gsv-banner__text' + (r === 0 || step.drop !== null ? ' is-ok' : ''))
    }

    // 面板
    sNum.textContent = String(step.phase === 'sum' ? step.runningSum : step.total)
    rNum.textContent = bucketsReady ? String(r) : '—'
    rNum.setAttribute('class', 'gsv-panel__num' + (bucketsReady && r === 0 ? ' is-ok' : bucketsReady ? ' is-fresh' : ''))
    dNum.textContent = bucketsReady ? (r === 0 ? '0' : fmt(step.drop)) : '—'
    resNum.textContent = isDone ? String(step.result) : '—'
    resNum.setAttribute(
      'class',
      'gsv-panel__num' + (isDone ? (step.result > 0 ? ' is-ok' : ' is-dead') : ''),
    )

    // 底部状态行
    if (step.phase === 'init') phaseText.textContent = '元素全为正 → sum 是上界 → 只减不增'
    else if (step.phase === 'sum') phaseText.textContent = '先把总和 S 攒出来，再看它对 3 的余数'
    else if (step.phase === 'bucket') {
      phaseText.textContent =
        r === 0 ? 'r = 0，一步到位：S 本身就被 3 整除' : `余 0 的不扔；只在 m${r} 与 m${3 - r} 上动刀`
    } else if (step.phase === 'candidate') {
      phaseText.textContent = step.active === 'one' ? `候选 A：取 m${r} 最小的一个` : `候选 B：取 m${3 - r} 最小的两个`
    } else {
      phaseText.textContent =
        r === 0
          ? '全选即答案，一个元素都不用扔'
          : step.drop === null
            ? '两种候选都凑不齐 → 空集，返回 0'
            : '每桶只取最小的一个/两个：越靠后的元素越亏，轮不到'
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
      delete host.dataset.gsdiv3Mounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
