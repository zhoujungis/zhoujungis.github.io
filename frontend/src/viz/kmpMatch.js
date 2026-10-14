/**
 * kmpMatch.js — 「KMP 匹配 + 暴力对照」的 SVG 渲染层。
 *
 * 布局：上方 = 主串 text 的格子行（每格一字符 + 下标）；下面 = 模式串 p 的格子行，
 * **按 j 对齐滑到 text[i-j] 的位置** —— 于是 `p[j]` 恰好落在 `text[i]` 正下方，
 * 「已匹配前缀」整段对齐一目了然。比较帧把 `text[i]`、`p[j]` 描橙框（相等染绿），
 * 回退帧在 p 行画一条虚线从旧 j 指到新 j，并把 `text[i]` 留在原位（强调 i 不动）；
 * 命中帧把 `text[index..index+n-1]` 与整条 p 染金。
 * 下方 = 横幅 + 统计面板（i / j / KMP 比较 / 暴力比较 / 命中下标）+ 状态行。
 *
 * 骨架同 kmp.js：模块级 STYLE_ID + ensureStyles()，dataset 幂等守卫，
 * createPlayer + jumpTo（**接 options.initialStep**），IntersectionObserver 自动播放，
 * **stage.appendChild(svgRoot)**。
 */

import { buildKmpMatchSteps } from './kmpMatchSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'kmp-match-styles'
const PLAY_MS = 1000

const W = 680
const NOTE_Y = 22
const TIDX_Y = 44
const TY = 52
const TH = 44
const PY = TY + TH + 18
const PH = 44
const PIDX_Y = PY + PH + 13
const PCHIP_I_Y = PIDX_Y + 17
const PCHIP_J_Y = PCHIP_I_Y + 18
const BANNER_Y = PCHIP_J_Y + 28
const BANNER_H = 44
const PANEL_Y = BANNER_Y + BANNER_H + 14
const PANEL_H = 58
const PHASE_Y = PANEL_Y + PANEL_H + 18
const HEIGHT = PHASE_Y + 22

const STYLES = `
.lk2 { display: flex; flex-direction: column; gap: 14px; }
.lk2__svg { width: 100%; height: auto; display: block; }

.lk2-note {
  fill: var(--lk2-muted, #657168); font-size: 12.5px; text-anchor: start;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-note--r { text-anchor: end; }
.lk2-side {
  fill: var(--lk2-dim, #9aa39c); font-size: 11px; text-anchor: end;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-idx {
  fill: var(--lk2-dim, #9aa39c); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.lk2-cell__box {
  fill: var(--lk2-fill, #ffffff); stroke: var(--lk2-line, #c3c9c2); stroke-width: 1.6;
}
.lk2-cell__ch {
  fill: var(--lk2-ink, #1f2a24); font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-cell.is-window .lk2-cell__box { fill: var(--lk2-ok-fill, #eef5f1); stroke: var(--lk2-ok, #3f6b57); }
.lk2-cell.is-window .lk2-cell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-cell.is-hot .lk2-cell__box { stroke: var(--lk2-hot, #a45f45); stroke-width: 3.2; }
.lk2-cell.is-hot .lk2-cell__ch { fill: var(--lk2-hot, #a45f45); }
.lk2-cell.is-match .lk2-cell__box { fill: var(--lk2-ok-fill, #eef5f1); stroke: var(--lk2-ok, #3f6b57); stroke-width: 3.2; }
.lk2-cell.is-match .lk2-cell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-cell.is-gap .lk2-cell__box { fill: var(--lk2-muted-fill, #f7f6f2); stroke: var(--lk2-line, #c3c9c2); stroke-dasharray: 4 3; }
.lk2-cell.is-found .lk2-cell__box { fill: var(--lk2-gold-fill, #fdf3e3); stroke: var(--lk2-gold, #c2872f); stroke-width: 3.2; }
.lk2-cell.is-found .lk2-cell__ch { fill: var(--lk2-gold, #c2872f); }

.lk2-pcell__box {
  fill: var(--lk2-fill, #ffffff); stroke: var(--lk2-line, #c3c9c2); stroke-width: 1.6;
}
.lk2-pcell__ch {
  fill: var(--lk2-ink, #1f2a24); font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-pcell.is-window .lk2-pcell__box { fill: var(--lk2-ok-fill, #eef5f1); stroke: var(--lk2-ok, #3f6b57); }
.lk2-pcell.is-window .lk2-pcell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-pcell.is-hot .lk2-pcell__box { stroke: var(--lk2-hot, #a45f45); stroke-width: 3.2; }
.lk2-pcell.is-hot .lk2-pcell__ch { fill: var(--lk2-hot, #a45f45); }
.lk2-pcell.is-to .lk2-pcell__box { stroke: var(--lk2-ok, #3f6b57); stroke-width: 3.2; }
.lk2-pcell.is-to .lk2-pcell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-pcell.is-match .lk2-pcell__box { fill: var(--lk2-ok-fill, #eef5f1); stroke: var(--lk2-ok, #3f6b57); stroke-width: 3.2; }
.lk2-pcell.is-match .lk2-pcell__ch { fill: var(--lk2-ok, #3f6b57); }
.lk2-pcell.is-found .lk2-pcell__box { fill: var(--lk2-gold-fill, #fdf3e3); stroke: var(--lk2-gold, #c2872f); stroke-width: 3.2; }
.lk2-pcell.is-found .lk2-pcell__ch { fill: var(--lk2-gold, #c2872f); }

.lk2-chip__dot { fill: var(--lk2-fill, #ffffff); stroke: var(--lk2-chrome, #657168); stroke-width: 1.6; }
.lk2-chip__t { fill: var(--lk2-chrome, #657168); font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lk2-chip--i .lk2-chip__dot { stroke: var(--lk2-hot, #a45f45); }
.lk2-chip--i .lk2-chip__t { fill: var(--lk2-hot, #a45f45); }
.lk2-chip--j .lk2-chip__dot { stroke: var(--lk2-gold, #c2872f); }
.lk2-chip--j .lk2-chip__t { fill: var(--lk2-gold, #c2872f); }
.lk2-chip--jt .lk2-chip__dot { stroke: var(--lk2-ok, #3f6b57); }
.lk2-chip--jt .lk2-chip__t { fill: var(--lk2-ok, #3f6b57); }

.lk2-link { stroke: var(--lk2-hot, #a45f45); stroke-width: 2; fill: none; stroke-dasharray: 5 4; }

.lk2-banner__box { fill: var(--lk2-banner, #f4f3ef); stroke: var(--lk2-line, #c3c9c2); stroke-width: 1.5; }
.lk2-banner__text {
  fill: var(--lk2-hot, #a45f45); font-size: 13.5px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-banner__text.is-ok { fill: var(--lk2-ok, #3f6b57); }
.lk2-banner__text.is-gold { fill: var(--lk2-gold, #c2872f); }

.lk2-panel__box { fill: var(--lk2-fill, #ffffff); stroke: var(--lk2-line, #c3c9c2); stroke-width: 1.5; }
.lk2-panel__label {
  fill: var(--lk2-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-panel__num {
  fill: var(--lk2-ink, #1f2a24); font-size: 16px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lk2-panel__num.is-gold { fill: var(--lk2-gold, #c2872f); }
.lk2-panel__num.is-ok { fill: var(--lk2-ok, #3f6b57); }
.lk2-panel__num.is-dead { fill: var(--lk2-dim, #9aa39c); }

.lk2-phase__text {
  fill: var(--lk2-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
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
 * 挂载 KMP 匹配动画。
 * @param {HTMLElement} host
 * @param {{ text?: string, p?: string, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountKmpMatch(host, options = {}) {
  if (!host || host.dataset.kmpMatchMounted === '1') return { destroy() {} }
  host.dataset.kmpMatchMounted = '1'
  ensureStyles()

  const steps = buildKmpMatchSteps(options)
  const s0 = steps[0]
  const { text, p, n, m } = s0

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz lk2'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const GAP = 6
  const availW = W - 56
  const cw = Math.min(42, Math.floor((availW - (m - 1) * GAP) / m))
  const rowW = m * cw + (m - 1) * GAP
  const gx0 = (W - rowW) / 2
  const step = cw + GAP
  const colX = (k) => gx0 + k * step
  const cxc = (k) => colX(k) + cw / 2
  const chFont = Math.max(13, Math.min(20, Math.round(cw / 2.2)))

  const svgRoot = mk('svg', {
    class: 'viz__svg lk2__svg',
    viewBox: `0 0 ${W} ${HEIGHT}`,
    role: 'img',
    'aria-label': 'KMP 字符串匹配推演动画',
  })

  const cellLayer = mk('g', {})
  const pLayer = mk('g', {})
  const linkLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(cellLayer, pLayer, linkLayer, markLayer)
  stage.appendChild(svgRoot)

  const note = mk('text', { class: 'lk2-note', x: 26, y: NOTE_Y })
  note.textContent = 'KMP：text[i] 与 p[j] 比，失配只回退 j，i 永不回头'
  markLayer.appendChild(note)
  const hint = mk('text', { class: 'lk2-note lk2-note--r', x: W - 26, y: NOTE_Y })
  hint.textContent = `text = "${text}" · p = "${p}"`
  markLayer.appendChild(hint)

  const sideLbl = (t, y) => {
    const el = mk('text', { class: 'lk2-side', x: gx0 - 12, y })
    el.textContent = t
    markLayer.appendChild(el)
  }
  sideLbl('text', TY + TH / 2)
  sideLbl('p', PY + PH / 2)

  // ── 主串 text 行 ──
  const tCells = []
  for (let k = 0; k < m; k += 1) {
    const idx = mk('text', { class: 'lk2-idx', x: cxc(k), y: TIDX_Y })
    idx.textContent = String(k)
    markLayer.appendChild(idx)
    const g = mk('g', { class: 'lk2-cell' })
    g.appendChild(mk('rect', { class: 'lk2-cell__box', x: colX(k), y: TY, width: cw, height: TH, rx: 6 }))
    const ch = mk('text', {
      class: 'lk2-cell__ch',
      x: cxc(k),
      y: TY + TH / 2,
      style: `font-size: ${chFont}px`,
    })
    ch.textContent = text[k]
    g.appendChild(ch)
    cellLayer.appendChild(g)
    tCells.push({ g, ch })
  }

  // ── 模式串 p 行（整行用 translate 滑动对齐）──
  const pCells = []
  for (let k = 0; k < n; k += 1) {
    const g = mk('g', { class: 'lk2-pcell' })
    // 每格先落在自己的第 k 列，paint 时整行再统一平移 pStart 格 —— 两个位移
    // 相加才是「p[k] 正好在 text[pStart + k] 正下方」。若都画在 colX(0)，
    // 7 个格子会叠在同一列上。
    g.appendChild(mk('rect', { class: 'lk2-pcell__box', x: colX(k), y: PY, width: cw, height: PH, rx: 6 }))
    const ch = mk('text', {
      class: 'lk2-pcell__ch',
      x: colX(k) + cw / 2,
      y: PY + PH / 2,
      style: `font-size: ${chFont}px`,
    })
    ch.textContent = p[k]
    g.appendChild(ch)
    const idx = mk('text', { class: 'lk2-idx', x: colX(k) + cw / 2, y: PIDX_Y })
    idx.textContent = String(k)
    g.appendChild(idx)
    pLayer.appendChild(g)
    pCells.push({ g, ch })
  }

  // ── chip 指针 ──
  const mkChip = (cls) => {
    const g = mk('g', { class: `lk2-chip ${cls}` })
    g.appendChild(mk('circle', { class: 'lk2-chip__dot', cx: 0, cy: 0, r: 10 }))
    const t = mk('text', { class: 'lk2-chip__t', x: 0, y: 0, style: 'font-size: 12px' })
    g.append(t)
    markLayer.appendChild(g)
    return { g, t }
  }
  const iChip = mkChip('lk2-chip--i')
  iChip.t.textContent = 'i'
  const jChip = mkChip('lk2-chip--j')
  jChip.t.textContent = 'j'
  const jToChip = mkChip('lk2-chip--jt')
  jToChip.t.textContent = 'j'
  const chipAt = (chip, x, y) => chip.g.setAttribute('transform', `translate(${x.toFixed(1)}, ${y})`)

  const link = mk('path', { class: 'lk2-link', d: '' })
  linkLayer.appendChild(link)

  // ── 横幅 ──
  markLayer.appendChild(
    mk('rect', { class: 'lk2-banner__box', x: 26, y: BANNER_Y, width: W - 52, height: BANNER_H, rx: 9 }),
  )
  const banner = mk('text', { class: 'lk2-banner__text', x: W / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  // ── 统计面板 ──
  markLayer.appendChild(
    mk('rect', { class: 'lk2-panel__box', x: 26, y: PANEL_Y, width: W - 52, height: PANEL_H, rx: 9 }),
  )
  const STAT_N = 5
  const mkStat = (label, k) => {
    const cx = W / 2 + (k - (STAT_N - 1) / 2) * 116
    const l = mk('text', { class: 'lk2-panel__label', x: cx, y: PANEL_Y + 16 })
    l.textContent = label
    const v = mk('text', { class: 'lk2-panel__num', x: cx, y: PANEL_Y + 40 })
    markLayer.append(l, v)
    return v
  }
  const iNum = mkStat('i', 0)
  const jNum = mkStat('j', 1)
  const kmpNum = mkStat('KMP 比较', 2)
  const bruteNum = mkStat('暴力 比较', 3)
  const idxNum = mkStat('命中下标', 4)

  const phaseText = mk('text', { class: 'lk2-phase__text', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, stepData) {
    if (!stepData) return
    const {
      phase,
      i,
      jBefore,
      jAfter,
      match,
      matched,
      found,
      index,
      kmpComparisons,
      bruteComparisons,
    } = stepData
    const isCompare = phase === 'compare'
    const isRetreat = phase === 'retreat'
    const isFound = phase === 'found' || (phase === 'done' && found)
    const isInit = phase === 'init'
    const isDone = phase === 'done'

    const clampStart = (v) => {
      let s = v
      if (s < 0) s = 0
      if (m >= n && s + n > m) s = m - n
      return s
    }

    // p 行的对齐：p[k] 落在 text[pStart + k] 正下方
    let alignJ
    let pStart
    if (isFound) {
      alignJ = n
      pStart = clampStart(index)
    } else if (i >= 0) {
      alignJ = jBefore
      pStart = clampStart(i - jBefore)
    } else {
      alignJ = 0
      pStart = clampStart(0)
    }
    const shift = pStart * step
    pCells.forEach((el) => el.g.setAttribute('transform', `translate(${shift.toFixed(1)}, 0)`))

    // 主串
    tCells.forEach((el, k) => {
      const cls = ['lk2-cell']
      const isWindow = alignJ > 0 && k >= pStart && k <= pStart + alignJ - 1
      if (isWindow) cls.push('is-window')
      if ((isCompare || isRetreat) && k === i) cls.push('is-hot')
      if (isCompare && match && k === i) cls.push('is-match')
      if (isFound && k >= index && k <= index + n - 1) cls.push('is-found')
      el.g.setAttribute('class', cls.join(' '))
    })

    // 模式串
    pCells.forEach((el, k) => {
      const cls = ['lk2-pcell']
      if (alignJ > 0 && k <= alignJ - 1) cls.push('is-window')
      if ((isCompare || isRetreat) && k === jBefore) cls.push('is-hot')
      if (isCompare && match && k === jBefore) cls.push('is-match')
      if (isRetreat && k === jAfter) cls.push('is-to')
      if (isFound) cls.push('is-found')
      el.g.setAttribute('class', cls.join(' '))
    })

    // chip
    const showI = i >= 0
    iChip.g.style.display = showI ? '' : 'none'
    if (showI) chipAt(iChip, cxc(i), PCHIP_I_Y)

    if (isCompare || isRetreat) {
      jChip.g.style.display = ''
      chipAt(jChip, cxc(pStart + jBefore), PCHIP_J_Y)
      if (isRetreat) {
        jToChip.g.style.display = ''
        chipAt(jToChip, cxc(pStart + jAfter), PCHIP_I_Y)
        const x1 = cxc(pStart + jBefore)
        const x2 = cxc(pStart + jAfter)
        const y = PY + PH / 2
        const dip = 26
        link.setAttribute(
          'd',
          `M ${x1.toFixed(1)} ${y.toFixed(1)} Q ${((x1 + x2) / 2).toFixed(1)} ${(y + dip).toFixed(1)} ` +
            `${x2.toFixed(1)} ${y.toFixed(1)}`,
        )
        link.style.display = ''
      } else {
        jToChip.g.style.display = 'none'
        link.style.display = 'none'
      }
    } else {
      jChip.g.style.display = 'none'
      jToChip.g.style.display = 'none'
      link.style.display = 'none'
    }

    // 横幅
    if (isInit) {
      banner.textContent = '在 text 里找 p：先从上一张动画借来 next 表'
      banner.setAttribute('class', 'lk2-banner__text')
    } else if (isCompare) {
      banner.textContent =
        `text[${i}] = '${stepData.tch}'  vs  p[${jBefore}] = '${stepData.pch}'   →   ${match ? '相等 ✓' : '不等 ✗'}`
      banner.setAttribute('class', 'lk2-banner__text' + (match ? ' is-ok' : ''))
    } else if (isRetreat) {
      banner.textContent = `不等   →   j = next[${jBefore - 1}] = ${jAfter}（i 不动）`
      banner.setAttribute('class', 'lk2-banner__text')
    } else if (isFound) {
      banner.textContent = `命中！起点 index = i - n + 1 = ${index}`
      banner.setAttribute('class', 'lk2-banner__text is-gold')
    } else {
      banner.textContent = found ? `返回 ${index}：p 首次出现于下标 ${index}` : '未找到 → 返回 -1'
      banner.setAttribute('class', 'lk2-banner__text' + (found ? ' is-ok' : ''))
    }

    // 面板
    iNum.textContent = isInit || (isDone && !found) ? '—' : i >= 0 ? String(i) : '—'
    iNum.setAttribute('class', 'lk2-panel__num')
    jNum.textContent = String(matched)
    jNum.setAttribute('class', 'lk2-panel__num' + (matched > 0 ? ' is-gold' : ''))
    kmpNum.textContent = String(kmpComparisons)
    kmpNum.setAttribute('class', 'lk2-panel__num' + (isDone ? ' is-ok' : ''))
    bruteNum.textContent = String(bruteComparisons)
    bruteNum.setAttribute('class', 'lk2-panel__num is-dead')
    idxNum.textContent = index >= 0 ? String(index) : '—'
    idxNum.setAttribute(
      'class',
      'lk2-panel__num' + (isDone ? (found ? ' is-ok' : ' is-dead') : index >= 0 ? ' is-gold' : ''),
    )

    // 状态行
    if (isInit) {
      phaseText.textContent = 'j = 已匹配的模式串前缀长度；i = 主串游标'
    } else if (isCompare) {
      phaseText.textContent = match ? '相等 → j 前进，i 下一格' : '不等 → i 不动，只回退 j'
    } else if (isRetreat) {
      phaseText.textContent = 'j = next[j-1]：主串指针 i 不回退 —— 这就是 KMP 快的原因'
    } else if (isFound) {
      phaseText.textContent = 'j == n → 命中，起点 = i - n + 1'
    } else {
      phaseText.textContent = found ? '主串指针永不回头 → 总比较 O(n + m)' : '扫完未命中 → 返回 -1'
    }

    renderRichText(desc, stepData.desc)
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
      delete host.dataset.kmpMatchMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
