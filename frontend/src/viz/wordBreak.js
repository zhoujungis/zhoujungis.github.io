/**
 * wordBreak.js — 「单词拆分」(LC 139) 主视角的 SVG 渲染层。
 *
 * 四段布局：dp 布尔格行（0..n，当前前缀 i 金框、来源切分点 j 绿框、
 * j 的搜索窗口垫底）、字符串行（s 的每个字符落在"边界 i-1 与 i 之间"，
 * 于是 s[j:i] 那段正好从 j 跨到 i，金框标出候选的最后一段）、
 * 转移横幅（`dp[i] = dp[j] && s[j:i] ∈ dict` 的现场取值）、
 * 底部面板（i / j / 跳过 / s[j:i] / 结果）。
 *
 * 与 coinChange.js 的骨架一致：模块级 STYLE_ID + ensureStyles()，
 * dataset 幂等守卫，createPlayer + jumpTo，IntersectionObserver 自动播放。
 */

import { buildWordBreakSteps } from './wordBreakSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'wordbreak-styles'

const NOTE_Y = 28
const DP_LBL_Y = 48
const DP_Y = 58
const DP_H = 40
const STR_LBL_Y = 116
const STR_Y = 124
const STR_H = 38
const BANNER_Y = 176
const BANNER_H = 44
const PANEL_Y = 234
const PANEL_H = 54
const PHASE_Y = 310

const AVAIL = 604
const PLAY_MS = 1250

const STYLES = `
.wbv { display: flex; flex-direction: column; gap: 14px; }
.wbv__svg { width: 100%; height: auto; display: block; }

.wbv-note {
  fill: var(--wbv-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-note--r { text-anchor: end; }

.wbv-lbl {
  fill: var(--wbv-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.wbv-band { fill: var(--wbv-band, #eef1ec); opacity: 0.9; }

.wbv-cell__box {
  fill: var(--wbv-fill, #ffffff); stroke: var(--wbv-line, #c3c9c2); stroke-width: 1.5;
}
.wbv-cell__val {
  fill: var(--wbv-ink, #1f2a24); font-size: 15px; font-weight: 800;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-cell__idx {
  fill: var(--wbv-dim, #9aa39c); font-size: 9px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-cell.is-true .wbv-cell__box {
  fill: var(--wbv-ok-fill, #eef5f1); stroke: var(--wbv-ok, #3f6b57); stroke-width: 2;
}
.wbv-cell.is-true .wbv-cell__val { fill: var(--wbv-ok, #3f6b57); }
.wbv-cell.is-dead .wbv-cell__box { fill: var(--wbv-past, #eef0ec); }
.wbv-cell.is-dead .wbv-cell__val { fill: var(--wbv-dim, #9aa39c); font-weight: 500; }
.wbv-cell.is-ahead .wbv-cell__box { fill: var(--wbv-fill, #ffffff); stroke-dasharray: 3 3; }
.wbv-cell.is-ahead .wbv-cell__val { fill: var(--wbv-dim, #9aa39c); font-weight: 500; }
.wbv-cell.is-from .wbv-cell__box {
  fill: var(--wbv-ok-fill, #eef5f1); stroke: var(--wbv-ok, #3f6b57); stroke-width: 3;
}
.wbv-cell.is-from .wbv-cell__val { fill: var(--wbv-ok, #3f6b57); }
.wbv-cell.is-target .wbv-cell__box {
  fill: var(--wbv-gold-fill, #fdf3e3); stroke: var(--wbv-gold, #c2872f); stroke-width: 3;
}
.wbv-cell.is-target .wbv-cell__val { fill: var(--wbv-gold, #c2872f); }
.wbv-cell.is-hit .wbv-cell__box { stroke: var(--wbv-gold, #c2872f); }

.wbv-ch {
  fill: var(--wbv-fill, #ffffff); stroke: var(--wbv-line, #c3c9c2); stroke-width: 1.5;
}
.wbv-ch__val {
  fill: var(--wbv-ink, #1f2a24); font-size: 16px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-ch.is-prefix { fill: var(--wbv-ok-fill, #eef5f1); }
.wbv-ch.is-prefix + .wbv-ch__val { fill: var(--wbv-ok, #3f6b57); }
.wbv-ch.is-ahead { fill: var(--wbv-past, #eef0ec); stroke-dasharray: 3 3; }
.wbv-ch.is-ahead + .wbv-ch__val { fill: var(--wbv-dim, #9aa39c); }
.wbv-ch.is-word {
  fill: var(--wbv-gold-fill, #fdf3e3); stroke: var(--wbv-gold, #c2872f); stroke-width: 3;
}
.wbv-ch.is-word + .wbv-ch__val { fill: var(--wbv-gold, #c2872f); }

.wbv-cut { stroke: var(--wbv-gold, #c2872f); stroke-width: 1.6; stroke-dasharray: 4 3; opacity: 0.8; }

.wbv-banner__box {
  fill: var(--wbv-banner, #f4f3ef); stroke: var(--wbv-line, #c3c9c2); stroke-width: 1.5;
}
.wbv-banner__text {
  fill: var(--wbv-hot, #a45f45); font-size: 13.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-banner__text.is-ok { fill: var(--wbv-ok, #3f6b57); }

.wbv-panel__box {
  fill: var(--wbv-fill, #ffffff); stroke: var(--wbv-line, #c3c9c2); stroke-width: 1.5;
}
.wbv-panel__label {
  fill: var(--wbv-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-panel__num {
  fill: var(--wbv-ink, #1f2a24); font-size: 17px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbv-panel__num.is-ok { fill: var(--wbv-ok, #3f6b57); }
.wbv-panel__num.is-dead { fill: var(--wbv-dim, #9aa39c); }
.wbv-panel__num.is-fresh { fill: var(--wbv-gold, #c2872f); }

.wbv-phase__text {
  fill: var(--wbv-muted, #657168); font-size: 13px; font-weight: 600;
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

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{ s?: string, words?: string[], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountWordBreak(host, options = {}) {
  if (!host || host.dataset.wordbreakMounted === '1') return { destroy() {} }
  host.dataset.wordbreakMounted = '1'
  ensureStyles()

  const steps = buildWordBreakSteps(options)
  const autoplay = options.autoplay !== false
  const { s, words, n, maxLen } = steps[0]

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz wbv'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg wbv__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '单词拆分 LC139 推演动画',
  })
  stage.appendChild(svgRoot)

  const bandLayer = mk('g', {})
  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(bandLayer, cellLayer, markLayer)

  const note = mk('text', { class: 'wbv-note', x: 26, y: NOTE_Y })
  note.textContent = '枚举"最后一个词"：s[j:i] 在字典里，且 dp[j] 为真'
  markLayer.appendChild(note)
  const tgt = mk('text', { class: 'wbv-note wbv-note--r', x: width - 26, y: NOTE_Y })
  tgt.textContent = `s = "${s}" · 字典 [${words.map((w) => `"${w}"`).join(', ')}]`
  markLayer.appendChild(tgt)

  const total = n + 1
  const gap = 5
  const cw = Math.min(46, Math.floor((AVAIL - (total - 1) * gap) / total))
  const rowW = total * cw + (total - 1) * gap
  const x0 = (width - rowW) / 2
  const dpX = (k) => x0 + k * (cw + gap)
  const charX = (k) => x0 + (k + 0.5) * (cw + gap)

  // 窗口底色带
  const band = mk('rect', { class: 'wbv-band', x: 0, y: DP_Y - 5, width: 0, height: DP_H + 10, rx: 8 })
  bandLayer.appendChild(band)

  // dp 行
  const dpLbl = mk('text', { class: 'wbv-lbl', x: 26, y: DP_LBL_Y })
  dpLbl.textContent = `dp[i] = s 的前 i 个字符能不能拼出（0 = 空串）`
  markLayer.appendChild(dpLbl)

  const dpEls = []
  for (let x = 0; x <= n; x += 1) {
    const px = dpX(x)
    const g = mk('g', { class: 'wbv-cell' })
    g.appendChild(mk('rect', { class: 'wbv-cell__box', x: px, y: DP_Y, width: cw, height: DP_H, rx: 6 }))
    const val = mk('text', { class: 'wbv-cell__val', x: px + cw / 2, y: DP_Y + DP_H / 2 - 5 })
    g.appendChild(val)
    const idxEl = mk('text', { class: 'wbv-cell__idx', x: px + cw / 2, y: DP_Y + DP_H - 8 })
    idxEl.textContent = String(x)
    g.appendChild(idxEl)
    cellLayer.appendChild(g)
    dpEls.push({ g, val })
  }

  // 字符串行（字符 k 落在边界 k 与 k+1 之间）
  const strLbl = mk('text', { class: 'wbv-lbl', x: 26, y: STR_LBL_Y })
  strLbl.textContent = 's 的字符：候选最后一段 s[j:i] 从边界 j 跨到 i'
  markLayer.appendChild(strLbl)

  const chEls = s.split('').map((ch, k) => {
    const px = charX(k)
    const g = mk('g', {})
    const box = mk('rect', { class: 'wbv-ch', x: px, y: STR_Y, width: cw, height: STR_H, rx: 6 })
    const val = mk('text', { class: 'wbv-ch__val', x: px + cw / 2, y: STR_Y + STR_H / 2 })
    val.textContent = ch
    g.append(box, val)
    cellLayer.appendChild(g)
    return { box, val }
  })

  // i 处的切割虚线
  const cutLine = mk('line', { class: 'wbv-cut', x1: 0, y1: DP_Y - 5, x2: 0, y2: STR_Y + STR_H + 5 })
  markLayer.appendChild(cutLine)

  // 转移横幅
  markLayer.appendChild(mk('rect', { class: 'wbv-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'wbv-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  // 统计面板
  markLayer.appendChild(mk('rect', { class: 'wbv-panel__box', x: 26, y: PANEL_Y, width: width - 52, height: PANEL_H, rx: 9 }))
  const mkStat = (label, cx) => {
    const l = mk('text', { class: 'wbv-panel__label', x: cx, y: PANEL_Y + 15 })
    l.textContent = label
    const v = mk('text', { class: 'wbv-panel__num', x: cx, y: PANEL_Y + 37 })
    markLayer.append(l, v)
    return v
  }
  const iNum = mkStat('i', width / 2 - 230)
  const jNum = mkStat('j', width / 2 - 115)
  const skipNum = mkStat('跳过 dp[j]=false', width / 2)
  const segNum = mkStat('s[j:i]', width / 2 + 115)
  const resNum = mkStat('结果', width / 2 + 230)

  const phaseText = mk('text', { class: 'wbv-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const isProbe = step.phase === 'probe'
    const hasJ = isProbe && step.j >= 0
    const i = step.i

    // 窗口底色带
    if (isProbe && step.hi >= step.lo) {
      band.setAttribute('x', String(dpX(step.lo) - 3))
      band.setAttribute('width', String(dpX(step.hi) + cw - (dpX(step.lo) - 3)))
    } else {
      band.setAttribute('width', '0')
    }

    // dp 行
    dpEls.forEach((el, x) => {
      const cls = ['wbv-cell']
      if (hasJ && x === step.j) {
        cls.push('is-from')
      } else if (isProbe && x === i) {
        cls.push('is-target')
        if (step.hit) cls.push('is-hit')
      } else if (!isProbe || x < i) {
        cls.push(step.dp[x] ? 'is-true' : 'is-dead')
      } else {
        cls.push('is-ahead')
      }
      el.g.setAttribute('class', cls.join(' '))
      el.val.textContent = step.dp[x] ? 'T' : 'F'
    })

    // 字符串行
    chEls.forEach((el, k) => {
      let cls = 'wbv-ch'
      if (hasJ && k >= step.j && k < i) cls += ' is-word'
      else if (step.phase === 'done' && step.result) cls += ' is-prefix'
      else if (i >= 0 && k < i) cls += ' is-prefix'
      else cls += ' is-ahead'
      el.box.setAttribute('class', cls)
    })

    // 切割虚线
    if (i >= 0) {
      cutLine.setAttribute('x1', String(dpX(i) + cw / 2))
      cutLine.setAttribute('x2', String(dpX(i) + cw / 2))
      cutLine.setAttribute('opacity', '0.8')
    } else {
      cutLine.setAttribute('opacity', '0')
    }

    // 横幅
    if (hasJ) {
      banner.textContent =
        `dp[${i}] = dp[${step.j}] && s[${step.j}:${i}] ∈ dict = ` +
        `${step.dpJ ? 'true' : 'false'} && ${step.inDict ? 'true' : 'false'} = ${step.hit ? 'true' : 'false'}`
      banner.setAttribute('class', 'wbv-banner__text' + (step.hit ? ' is-ok' : ''))
    } else if (isProbe) {
      banner.textContent = `窗口 j ∈ [${step.lo}, ${step.hi}] 内 dp[j] 全为 false → dp[${i}] = false`
      banner.setAttribute('class', 'wbv-banner__text')
    } else if (step.phase === 'done') {
      banner.textContent = step.result
        ? `答案 true：${step.segments.join(' | ')}`
        : `答案 false：dp[${n}] 始终为 false`
      banner.setAttribute('class', 'wbv-banner__text' + (step.result ? ' is-ok' : ''))
    } else {
      banner.textContent = `dp[i] = OR( dp[j] && s[j:i] ∈ dict )　dp[0] = true`
      banner.setAttribute('class', 'wbv-banner__text')
    }

    // 面板
    iNum.textContent = i < 0 ? '—' : String(i)
    jNum.textContent = hasJ ? String(step.j) : '—'
    skipNum.textContent = isProbe ? String(step.skipped) : '—'
    segNum.textContent = hasJ ? `"${step.seg}"` : '—'
    segNum.setAttribute('class', 'wbv-panel__num' + (hasJ && step.inDict ? ' is-fresh' : ''))
    resNum.textContent = String(step.result)
    resNum.setAttribute(
      'class',
      'wbv-panel__num' + (step.phase === 'done' ? (step.result ? ' is-ok' : ' is-dead') : ''),
    )

    // 底部状态行
    if (step.phase === 'init') {
      phaseText.textContent = 'dp[0] = true 是唯一底座；其余从 false 开始被"命中"翻上来'
    } else if (isProbe) {
      phaseText.textContent = step.hit
        ? `命中即短路：dp[${i}] 已为 true，本格剩下的切分点不再试`
        : hasJ
          ? '这个切分点不成立，继续试下一个 j'
          : '前一段自己都拼不出来，这一格只能停在 false'
    } else {
      phaseText.textContent = step.result
        ? '每个 true 的 dp[i] 背后都连着一条完整的切分链'
        : '布尔或全 false：没有任何一条通路能走到 n'
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
      delete host.dataset.wordbreakMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
