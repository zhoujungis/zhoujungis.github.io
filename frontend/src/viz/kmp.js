/**
 * kmp.js — 「KMP 求 next 数组」主视角的 SVG 渲染层。
 *
 * 布局：上方 = 模式串 p 的格子行（每格一个字符 + 下标），下面紧挨着 next 数组行
 * （`next[i]` 的取值，未算出的格子画成灰色的 "·"）；
 * p 行下方两个 chip 分别指向本帧的 `i`（下要和谁比）与 `j`（已匹配前缀长度）；
 * 比较帧把 `p[i]`、`p[j]` 描橙框（相等则染绿），并把「已匹配的相等前后缀」
 * （`p[0..j-1]` 与 `p[i-j..i-1]`）标成绿色；回退帧把 `p[j]` 与它要读的
 * `next[j-1]` 用虚线连起来；assign 帧把 `next[i]` 染金。
 * 下方 = 横幅 + 统计面板（i / j / 比较次数 / 回退次数 / 已定 next）+ 状态行。
 *
 * 骨架同 lc1928.js / editDistance.js：模块级 STYLE_ID + ensureStyles()，
 * dataset 幂等守卫，createPlayer + jumpTo（**必须接 options.initialStep**），
 * IntersectionObserver 自动播放，以及 **stage.appendChild(svgRoot)**。
 */

import { buildKmpSteps } from './kmpSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'kmp-styles'
const PLAY_MS = 1000

const W = 680
const NOTE_Y = 22
const IDX_Y = 44
const PY = 52
const PH = 46
const PCHIP_I_Y = PY + PH + 15
const PCHIP_J_Y = PY + PH + 33
const NY = PY + PH + 54
const NH = 42
const BANNER_Y = NY + NH + 22
const BANNER_H = 44
const PANEL_Y = BANNER_Y + BANNER_H + 14
const PANEL_H = 58
const PHASE_Y = PANEL_Y + PANEL_H + 18
const HEIGHT = PHASE_Y + 22

const STYLES = `
.lk { display: flex; flex-direction: column; gap: 14px; }
.lk__svg { width: 100%; height: auto; display: block; }

.lk-note {
  fill: var(--lk-muted, #657168); font-size: 12.5px; text-anchor: start;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-note--r { text-anchor: end; }
.lk-side {
  fill: var(--lk-dim, #9aa39c); font-size: 11px; text-anchor: end;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-idx {
  fill: var(--lk-dim, #9aa39c); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.lk-cell__box {
  fill: var(--lk-fill, #ffffff);
  stroke: var(--lk-line, #c3c9c2);
  stroke-width: 1.6;
}
.lk-cell__ch {
  fill: var(--lk-ink, #1f2a24); font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-cell.is-window .lk-cell__box { fill: var(--lk-ok-fill, #eef5f1); stroke: var(--lk-ok, #3f6b57); }
.lk-cell.is-window .lk-cell__ch { fill: var(--lk-ok, #3f6b57); }
.lk-cell.is-hot .lk-cell__box { stroke: var(--lk-hot, #a45f45); stroke-width: 3.2; }
.lk-cell.is-hot .lk-cell__ch { fill: var(--lk-hot, #a45f45); }
.lk-cell.is-match .lk-cell__box { fill: var(--lk-ok-fill, #eef5f1); stroke: var(--lk-ok, #3f6b57); }
.lk-cell.is-match .lk-cell__ch { fill: var(--lk-ok, #3f6b57); }

.lk-ncell__box {
  fill: var(--lk-muted-fill, #f7f6f2);
  stroke: var(--lk-line, #c3c9c2); stroke-width: 1.5;
}
.lk-ncell__val {
  fill: var(--lk-ink, #1f2a24); font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-ncell.is-unknown .lk-ncell__box { stroke-dasharray: 4 3; }
.lk-ncell.is-unknown .lk-ncell__val { fill: var(--lk-dim, #9aa39c); font-weight: 500; }
.lk-ncell.is-known .lk-ncell__box { fill: var(--lk-ok-fill, #eef5f1); stroke: var(--lk-ok, #3f6b57); }
.lk-ncell.is-known .lk-ncell__val { fill: var(--lk-ok, #3f6b57); }
.lk-ncell.is-newi .lk-ncell__box { fill: var(--lk-gold-fill, #fdf3e3); stroke: var(--lk-gold, #c2872f); stroke-width: 3.2; }
.lk-ncell.is-newi .lk-ncell__val { fill: var(--lk-gold, #c2872f); }
.lk-ncell.is-src .lk-ncell__box { stroke: var(--lk-hot, #a45f45); stroke-width: 3; }

.lk-chip__dot { fill: var(--lk-fill, #ffffff); stroke: var(--lk-chrome, #657168); stroke-width: 1.6; }
.lk-chip__t { fill: var(--lk-chrome, #657168); font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lk-chip--i .lk-chip__dot { stroke: var(--lk-hot, #a45f45); }
.lk-chip--i .lk-chip__t { fill: var(--lk-hot, #a45f45); }
.lk-chip--j .lk-chip__dot { stroke: var(--lk-gold, #c2872f); }
.lk-chip--j .lk-chip__t { fill: var(--lk-gold, #c2872f); }
.lk-chip--jt .lk-chip__dot { stroke: var(--lk-ok, #3f6b57); }
.lk-chip--jt .lk-chip__t { fill: var(--lk-ok, #3f6b57); }

.lk-link { stroke: var(--lk-hot, #a45f45); stroke-width: 2; fill: none; stroke-dasharray: 5 4; }

.lk-banner__box {
  fill: var(--lk-banner, #f4f3ef); stroke: var(--lk-line, #c3c9c2); stroke-width: 1.5;
}
.lk-banner__text {
  fill: var(--lk-hot, #a45f45); font-size: 13.5px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-banner__text.is-ok { fill: var(--lk-ok, #3f6b57); }
.lk-banner__text.is-gold { fill: var(--lk-gold, #c2872f); }

.lk-panel__box { fill: var(--lk-fill, #ffffff); stroke: var(--lk-line, #c3c9c2); stroke-width: 1.5; }
.lk-panel__label {
  fill: var(--lk-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-panel__num {
  fill: var(--lk-ink, #1f2a24); font-size: 16px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk-panel__num.is-gold { fill: var(--lk-gold, #c2872f); }
.lk-panel__num.is-ok { fill: var(--lk-ok, #3f6b57); }
.lk-panel__num.is-small { font-size: 12.5px; }

.lk-phase__text {
  fill: var(--lk-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
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
 * 挂载 next 数组动画。
 * @param {HTMLElement} host
 * @param {{ p?: string, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountKmp(host, options = {}) {
  if (!host || host.dataset.kmpMounted === '1') return { destroy() {} }
  host.dataset.kmpMounted = '1'
  ensureStyles()

  const steps = buildKmpSteps(options)
  const s0 = steps[0]
  const { p, n } = s0

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz lk'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const GAP = 8
  const availW = W - 56
  const cw = Math.min(64, Math.floor((availW - (n - 1) * GAP) / n))
  const rowW = n * cw + (n - 1) * GAP
  const gx0 = (W - rowW) / 2
  const colX = (k) => gx0 + k * (cw + GAP)
  const cxc = (k) => colX(k) + cw / 2
  const chFont = Math.max(15, Math.min(24, Math.round(cw / 2.3)))
  const valFont = Math.max(12, Math.min(17, Math.round(cw / 3.2)))

  const svgRoot = mk('svg', {
    class: 'viz__svg lk__svg',
    viewBox: `0 0 ${W} ${HEIGHT}`,
    role: 'img',
    'aria-label': 'KMP 求 next 数组推演动画',
  })

  const cellLayer = mk('g', {})
  const linkLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(cellLayer, linkLayer, markLayer)
  stage.appendChild(svgRoot)

  const note = mk('text', { class: 'lk-note', x: 26, y: NOTE_Y })
  note.textContent = 'next[i] = p[0..i] 的最长相等真前后缀的长度'
  markLayer.appendChild(note)
  const hint = mk('text', { class: 'lk-note lk-note--r', x: W - 26, y: NOTE_Y })
  hint.textContent = `p = "${p}" · n = ${n}`
  markLayer.appendChild(hint)

  // ── p 行：每格一个字符 + 下标 ──
  const sideLbl = (text, y) => {
    const t = mk('text', { class: 'lk-side', x: gx0 - 12, y })
    t.textContent = text
    markLayer.appendChild(t)
  }
  sideLbl('p', PY + PH / 2)
  sideLbl('next', NY + NH / 2)

  const cells = []
  for (let k = 0; k < n; k += 1) {
    const idx = mk('text', { class: 'lk-idx', x: cxc(k), y: IDX_Y })
    idx.textContent = String(k)
    markLayer.appendChild(idx)

    const g = mk('g', { class: 'lk-cell' })
    g.appendChild(mk('rect', { class: 'lk-cell__box', x: colX(k), y: PY, width: cw, height: PH, rx: 6 }))
    const ch = mk('text', {
      class: 'lk-cell__ch',
      x: cxc(k),
      y: PY + PH / 2,
      style: `font-size: ${chFont}px`,
    })
    ch.textContent = p[k]
    g.appendChild(ch)
    cellLayer.appendChild(g)
    cells.push({ g, ch })
  }

  // ── next 行 ──
  const ncells = []
  for (let k = 0; k < n; k += 1) {
    const g = mk('g', { class: 'lk-ncell' })
    g.appendChild(mk('rect', { class: 'lk-ncell__box', x: colX(k), y: NY, width: cw, height: NH, rx: 6 }))
    const val = mk('text', {
      class: 'lk-ncell__val',
      x: cxc(k),
      y: NY + NH / 2,
      style: `font-size: ${valFont}px`,
    })
    g.appendChild(val)
    cellLayer.appendChild(g)
    ncells.push({ g, val })
  }

  // ── chip 指针 ──
  const mkChip = (cls) => {
    const g = mk('g', { class: `lk-chip ${cls}` })
    g.appendChild(mk('circle', { class: 'lk-chip__dot', cx: 0, cy: 0, r: 10 }))
    const t = mk('text', { class: 'lk-chip__t', x: 0, y: 0, style: 'font-size: 12px' })
    g.append(t)
    markLayer.appendChild(g)
    return { g, t }
  }
  const iChip = mkChip('lk-chip--i')
  iChip.t.textContent = 'i'
  const jChip = mkChip('lk-chip--j')
  jChip.t.textContent = 'j'
  const jToChip = mkChip('lk-chip--jt')
  jToChip.t.textContent = 'j'
  const chipAt = (chip, x, y) => chip.g.setAttribute('transform', `translate(${x.toFixed(1)}, ${y})`)

  const link = mk('path', { class: 'lk-link', d: '' })
  linkLayer.appendChild(link)

  // ── 横幅 ──
  markLayer.appendChild(
    mk('rect', { class: 'lk-banner__box', x: 26, y: BANNER_Y, width: W - 52, height: BANNER_H, rx: 9 }),
  )
  const banner = mk('text', { class: 'lk-banner__text', x: W / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  // ── 统计面板 ──
  markLayer.appendChild(
    mk('rect', { class: 'lk-panel__box', x: 26, y: PANEL_Y, width: W - 52, height: PANEL_H, rx: 9 }),
  )
  const STAT_N = 5
  const mkStat = (label, k) => {
    const cx = W / 2 + (k - (STAT_N - 1) / 2) * 116
    const l = mk('text', { class: 'lk-panel__label', x: cx, y: PANEL_Y + 16 })
    l.textContent = label
    const v = mk('text', { class: 'lk-panel__num', x: cx, y: PANEL_Y + 40 })
    markLayer.append(l, v)
    return v
  }
  const iNum = mkStat('i', 0)
  const jNum = mkStat('j', 1)
  const cmpNum = mkStat('比较次数', 2)
  const rtrNum = mkStat('回退次数', 3)
  const knNum = mkStat('已定 next', 4)

  const phaseText = mk('text', { class: 'lk-phase__text', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const {
      phase,
      i,
      jBefore,
      jAfter,
      match,
      next,
      retreats,
      comparisons,
      knownCount,
    } = step
    const isCompare = phase === 'compare'
    const isRetreat = phase === 'retreat'
    const isAssign = phase === 'assign'
    const isInit = phase === 'init'
    const isDone = phase === 'done'

    // 本帧的"相等前后缀"窗口：jRef 是已匹配前缀长度
    let jRef = 0
    let iRef = -1
    if (isCompare || isRetreat) {
      jRef = jBefore
      iRef = i
    } else if (isAssign) {
      jRef = jAfter
      iRef = i
    }
    const prefixFrom = 0
    const prefixTo = jRef - 1
    const suffixFrom = iRef >= 0 ? iRef - jRef : -1
    const suffixTo = iRef >= 0 ? iRef - 1 : -2
    const inWindow = (k) =>
      (jRef > 0 && k >= prefixFrom && k <= prefixTo) || (jRef > 0 && k >= suffixFrom && k <= suffixTo)

    // p 行
    cells.forEach((el, k) => {
      const cls = ['lk-cell']
      if (inWindow(k)) cls.push('is-window')
      if ((isCompare || isAssign) && k === i) cls.push('is-hot')
      if (isCompare && k === jBefore) cls.push('is-hot')
      if (isRetreat && k === jBefore) cls.push('is-hot')
      if (isCompare && match && k === jBefore) cls.push('is-match')
      if (isCompare && match && k === i) cls.push('is-match')
      el.g.setAttribute('class', cls.join(' '))
    })

    // next 行
    ncells.forEach((el, k) => {
      const known = k < knownCount
      const cls = ['lk-ncell', known ? 'is-known' : 'is-unknown']
      if (isAssign && k === i) cls.push('is-newi')
      if (isRetreat && k === jBefore - 1) cls.push('is-src')
      el.g.setAttribute('class', cls.join(' '))
      el.val.textContent = known ? String(next[k]) : '·'
    })

    // chip 与连线
    const showI = i >= 0
    iChip.g.style.display = showI ? '' : 'none'
    if (showI) chipAt(iChip, cxc(i), PCHIP_I_Y)

    if (isCompare || isRetreat) {
      jChip.g.style.display = ''
      chipAt(jChip, cxc(jBefore), PCHIP_J_Y)
    } else {
      jChip.g.style.display = 'none'
    }

    if (isRetreat) {
      jToChip.g.style.display = ''
      chipAt(jToChip, cxc(jAfter), PCHIP_I_Y)
      const x1 = cxc(jBefore)
      const y1 = PY + PH
      const x2 = cxc(jBefore - 1)
      const y2 = NY
      link.setAttribute(
        'd',
        `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${x1.toFixed(1)} ${(y1 + 22).toFixed(1)}, ` +
          `${x2.toFixed(1)} ${(y2 - 22).toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`,
      )
      link.style.display = ''
    } else {
      jToChip.g.style.display = 'none'
      link.style.display = 'none'
    }
    if (isAssign) {
      // 落定后 j 挪到新位置
      jChip.g.style.display = ''
      chipAt(jChip, cxc(jAfter), PCHIP_J_Y)
    }

    // 横幅
    if (isInit) {
      banner.textContent = `next[0] = 0（定义）· j = 0 —— 从 i = 1 起「自己跟自己」比`
      banner.setAttribute('class', 'lk-banner__text')
    } else if (isCompare) {
      banner.textContent =
        `p[${i}] = '${step.chI}'  vs  p[${jBefore}] = '${step.chJ}'   →   ${match ? '相等 ✓' : '不等 ✗'}`
      banner.setAttribute('class', 'lk-banner__text' + (match ? ' is-ok' : ''))
    } else if (isRetreat) {
      banner.textContent = `p[${i}] ≠ p[${jBefore}]   →   j = next[${jBefore - 1}] = ${jAfter}（回退）`
      banner.setAttribute('class', 'lk-banner__text')
    } else if (isAssign) {
      banner.textContent = `next[${i}]  =  ${jAfter}`
      banner.setAttribute('class', 'lk-banner__text is-gold')
    } else {
      banner.textContent = `next = [${next.join(', ')}]`
      banner.setAttribute('class', 'lk-banner__text is-ok')
    }

    // 面板
    iNum.textContent = isInit ? '—' : isDone ? '—' : String(i)
    iNum.setAttribute('class', 'lk-panel__num')
    jNum.textContent = String(jAfter)
    jNum.setAttribute('class', 'lk-panel__num' + (jAfter > 0 ? ' is-gold' : ''))
    cmpNum.textContent = String(comparisons)
    cmpNum.setAttribute('class', 'lk-panel__num')
    rtrNum.textContent = String(retreats)
    rtrNum.setAttribute('class', 'lk-panel__num' + (retreats > 0 ? ' is-gold' : ''))
    knNum.textContent = `${knownCount} / ${n}`
    knNum.setAttribute('class', 'lk-panel__num is-small' + (knownCount === n ? ' is-ok' : ''))

    // 状态行
    if (isInit) {
      phaseText.textContent = 'next[0] = 0 是定义、不用算；i 从 1 开始，j 从 0 开始'
    } else if (isCompare) {
      phaseText.textContent = match
        ? '相等 → 前缀再长一位，j 前进'
        : '不等 → 该回退了（换个更短、但接得上的候选）'
    } else if (isRetreat) {
      phaseText.textContent = 'j 退到 next[j-1]：回退换的是候选前缀，不是丢掉已匹配部分'
    } else if (isAssign) {
      phaseText.textContent = 'next[i] = j 落定；j 就是新的「已匹配前缀长度」'
    } else {
      phaseText.textContent = '答案就是这张 next 表 —— 全算完，O(n)'
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
      delete host.dataset.kmpMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
