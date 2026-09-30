/**
 * wordBreakSeg.js — 「单词拆分」(LC 139) 第二视角的 SVG 渲染层：
 * **表算好之后，怎么把 s 真的切成词**。
 *
 * 上面一行是算好的 dp 布尔表（pos 金框、切分点 j 绿框），
 * 中间是字符串 s 的字符格 —— 已锁定的段染绿、正在试的候选段描金/虚线，
 * 每锁定一段就在下面挂一个 `"apple"` 这样的词标签；最下面一条 pos 游标。
 * 从 n 往左走，走到 0 就切完了。
 */

import { buildWordBreakSegSteps } from './wordBreakSegSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'wordbreakseg-styles'

const NOTE_Y = 28
const DP_LBL_Y = 46
const DP_Y = 54
const DP_H = 34
const STR_LBL_Y = 104
const STR_Y = 112
const STR_H = 46
const SEG_LBL_Y = 172
const BANNER_Y = 186
const BANNER_H = 44
const PANEL_Y = 244
const PANEL_H = 54
const PHASE_Y = 320

const AVAIL = 604
const PLAY_MS = 1250

const STYLES = `
.wbs { display: flex; flex-direction: column; gap: 14px; }
.wbs__svg { width: 100%; height: auto; display: block; }

.wbs-note {
  fill: var(--wbs-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-note--r { text-anchor: end; }
.wbs-lbl {
  fill: var(--wbs-muted, #657168); font-size: 11px;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-seg {
  fill: var(--wbs-ok, #3f6b57); font-size: 11px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.wbs-cell__box {
  fill: var(--wbs-fill, #ffffff); stroke: var(--wbs-line, #c3c9c2); stroke-width: 1.5;
}
.wbs-cell__val {
  fill: var(--wbs-ink, #1f2a24); font-size: 13px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-cell__idx {
  fill: var(--wbs-dim, #9aa39c); font-size: 9px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-cell.is-true .wbs-cell__box { fill: var(--wbs-ok-fill, #eef5f1); stroke: var(--wbs-ok, #3f6b57); stroke-width: 2; }
.wbs-cell.is-true .wbs-cell__val { fill: var(--wbs-ok, #3f6b57); }
.wbs-cell.is-dead .wbs-cell__val { fill: var(--wbs-dim, #9aa39c); font-weight: 500; }
.wbs-cell.is-target .wbs-cell__box {
  fill: var(--wbs-gold-fill, #fdf3e3); stroke: var(--wbs-gold, #c2872f); stroke-width: 3;
}
.wbs-cell.is-target .wbs-cell__val { fill: var(--wbs-gold, #c2872f); }
.wbs-cell.is-from .wbs-cell__box {
  fill: var(--wbs-ok-fill, #eef5f1); stroke: var(--wbs-ok, #3f6b57); stroke-width: 3;
}
.wbs-cell.is-from .wbs-cell__val { fill: var(--wbs-ok, #3f6b57); }

.wbs-ch {
  fill: var(--wbs-fill, #ffffff); stroke: var(--wbs-line, #c3c9c2); stroke-width: 1.5;
}
.wbs-ch__val {
  fill: var(--wbs-ink, #1f2a24); font-size: 17px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-ch.is-ahead { fill: var(--wbs-past, #eef0ec); stroke-dasharray: 3 3; }
.wbs-ch.is-ahead + .wbs-ch__val { fill: var(--wbs-dim, #9aa39c); }
.wbs-ch.is-try {
  fill: var(--wbs-try, #f6f2ea); stroke: var(--wbs-muted, #657168); stroke-width: 1.5;
  stroke-dasharray: 4 3;
}
.wbs-ch.is-try + .wbs-ch__val { fill: var(--wbs-muted, #657168); }
.wbs-ch.is-locked { fill: var(--wbs-ok-fill, #eef5f1); stroke: var(--wbs-ok, #3f6b57); stroke-width: 2; }
.wbs-ch.is-locked + .wbs-ch__val { fill: var(--wbs-ok, #3f6b57); }
.wbs-ch.is-word { fill: var(--wbs-gold-fill, #fdf3e3); stroke: var(--wbs-gold, #c2872f); stroke-width: 3; }
.wbs-ch.is-word + .wbs-ch__val { fill: var(--wbs-gold, #c2872f); }

.wbs-cursor { stroke: var(--wbs-gold, #c2872f); stroke-width: 2; }
.wbs-cursor__cap {
  fill: var(--wbs-gold, #c2872f); font-size: 11px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}

.wbs-banner__box {
  fill: var(--wbs-banner, #f4f3ef); stroke: var(--wbs-line, #c3c9c2); stroke-width: 1.5;
}
.wbs-banner__text {
  fill: var(--wbs-hot, #a45f45); font-size: 13.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-banner__text.is-ok { fill: var(--wbs-ok, #3f6b57); }

.wbs-panel__box {
  fill: var(--wbs-fill, #ffffff); stroke: var(--wbs-line, #c3c9c2); stroke-width: 1.5;
}
.wbs-panel__label {
  fill: var(--wbs-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-panel__num {
  fill: var(--wbs-ink, #1f2a24); font-size: 17px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.wbs-panel__num.is-ok { fill: var(--wbs-ok, #3f6b57); }
.wbs-panel__num.is-dead { fill: var(--wbs-dim, #9aa39c); }
.wbs-panel__num.is-fresh { fill: var(--wbs-gold, #c2872f); }

.wbs-phase__text {
  fill: var(--wbs-muted, #657168); font-size: 13px; font-weight: 600;
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
export function mountWordBreakSeg(host, options = {}) {
  if (!host || host.dataset.wordbreaksegMounted === '1') return { destroy() {} }
  host.dataset.wordbreaksegMounted = '1'
  ensureStyles()

  const steps = buildWordBreakSegSteps(options)
  const autoplay = options.autoplay !== false
  const { s, words, n } = steps[0]

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz wbs'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg wbs__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '单词拆分 LC139 切分还原动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(cellLayer, markLayer)

  const note = mk('text', { class: 'wbs-note', x: 26, y: NOTE_Y })
  note.textContent = 'dp 只回答"能不能"；从 n 往左走，才把 s 切成词'
  markLayer.appendChild(note)
  const tgt = mk('text', { class: 'wbs-note wbs-note--r', x: width - 26, y: NOTE_Y })
  tgt.textContent = `s = "${s}" · 字典 [${words.map((w) => `"${w}"`).join(', ')}]`
  markLayer.appendChild(tgt)

  const total = n + 1
  const gap = 5
  const cw = Math.min(46, Math.floor((AVAIL - (total - 1) * gap) / total))
  const rowW = total * cw + (total - 1) * gap
  const x0 = (width - rowW) / 2
  const dpX = (k) => x0 + k * (cw + gap)
  const charX = (k) => x0 + (k + 0.5) * (cw + gap)

  // dp 行
  const dpLbl = mk('text', { class: 'wbs-lbl', x: 26, y: DP_LBL_Y })
  dpLbl.textContent = '算好的 dp 表（T = 这一段前缀拼得出）'
  markLayer.appendChild(dpLbl)

  const dpEls = []
  for (let x = 0; x <= n; x += 1) {
    const px = dpX(x)
    const g = mk('g', { class: 'wbs-cell' })
    g.appendChild(mk('rect', { class: 'wbs-cell__box', x: px, y: DP_Y, width: cw, height: DP_H, rx: 5 }))
    const val = mk('text', { class: 'wbs-cell__val', x: px + cw / 2, y: DP_Y + DP_H / 2 - 3 })
    g.appendChild(val)
    const idxEl = mk('text', { class: 'wbs-cell__idx', x: px + cw / 2, y: DP_Y + DP_H - 6 })
    idxEl.textContent = String(x)
    g.appendChild(idxEl)
    cellLayer.appendChild(g)
    dpEls.push({ g, val })
  }

  // 字符串行
  const strLbl = mk('text', { class: 'wbs-lbl', x: 26, y: STR_LBL_Y })
  strLbl.textContent = '把 s 逐段切出来：绿 = 已锁定，金 = 正在试，虚线 = 还没切到'
  markLayer.appendChild(strLbl)

  const chEls = s.split('').map((ch, k) => {
    const px = charX(k)
    const g = mk('g', {})
    const box = mk('rect', { class: 'wbs-ch', x: px, y: STR_Y, width: cw, height: STR_H, rx: 6 })
    const val = mk('text', { class: 'wbs-ch__val', x: px + cw / 2, y: STR_Y + STR_H / 2 })
    val.textContent = ch
    g.append(box, val)
    cellLayer.appendChild(g)
    return { box }
  })

  // 每个锁定段的词标签
  const segLabels = s.split('').map(() => {
    const t = mk('text', { class: 'wbs-seg', x: 0, y: SEG_LBL_Y })
    markLayer.appendChild(t)
    return t
  })

  // pos 游标
  const cursor = mk('line', { class: 'wbs-cursor', x1: 0, y1: DP_Y, x2: 0, y2: STR_Y + STR_H + 4 })
  const cursorCap = mk('text', { class: 'wbs-cursor__cap', x: 0, y: STR_Y + STR_H + 16 })
  markLayer.append(cursor, cursorCap)

  // 横幅
  markLayer.appendChild(mk('rect', { class: 'wbs-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'wbs-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  // 统计面板
  markLayer.appendChild(mk('rect', { class: 'wbs-panel__box', x: 26, y: PANEL_Y, width: width - 52, height: PANEL_H, rx: 9 }))
  const mkStat = (label, cx) => {
    const l = mk('text', { class: 'wbs-panel__label', x: cx, y: PANEL_Y + 15 })
    l.textContent = label
    const v = mk('text', { class: 'wbs-panel__num', x: cx, y: PANEL_Y + 37 })
    markLayer.append(l, v)
    return v
  }
  const posNum = mkStat('pos', width / 2 - 230)
  const jNum = mkStat('j', width / 2 - 115)
  const dpJNum = mkStat('dp[j]', width / 2)
  const segNum = mkStat('s[j:pos]', width / 2 + 115)
  const resNum = mkStat('结果', width / 2 + 230)

  const phaseText = mk('text', { class: 'wbs-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const isScan = step.phase === 'scan'
    const pos = step.pos
    const j = step.j
    const cur = isScan && step.hit ? { start: j, end: pos } : null

    // dp 行
    dpEls.forEach((el, x) => {
      const cls = ['wbs-cell']
      if (isScan && x === j) cls.push('is-from')
      else if (isScan && x === pos) cls.push('is-target')
      cls.push(step.dp[x] ? 'is-true' : 'is-dead')
      el.g.setAttribute('class', cls.join(' '))
      el.val.textContent = step.dp[x] ? 'T' : 'F'
    })

    // 字符串行
    const inLocked = (k) => step.locked.some((r) => k >= r.start && k < r.end)
    chEls.forEach((el, k) => {
      let cls = 'wbs-ch'
      if (cur && k >= cur.start && k < cur.end) cls += ' is-word'
      else if (inLocked(k)) cls += ' is-locked'
      else if (isScan && k >= j && k < pos) cls += ' is-try'
      else cls += ' is-ahead'
      el.box.setAttribute('class', cls)
    })

    // 段标签
    const sorted = [...step.locked].sort((a, b) => a.start - b.start)
    segLabels.forEach((el, idx) => {
      const r = sorted[idx]
      if (!r) {
        el.textContent = ''
        return
      }
      const left = charX(r.start)
      const right = charX(r.end - 1) + cw
      el.setAttribute('x', String((left + right) / 2))
      el.textContent = `"${r.word}"`
    })

    // pos 游标
    if (pos >= 0) {
      const px = dpX(pos) + cw / 2
      cursor.setAttribute('x1', String(px))
      cursor.setAttribute('x2', String(px))
      cursor.setAttribute('opacity', '1')
      cursorCap.setAttribute('x', String(px))
      cursorCap.textContent = `pos=${pos}`
      cursorCap.setAttribute('opacity', '1')
    } else {
      cursor.setAttribute('opacity', '0')
      cursorCap.setAttribute('opacity', '0')
    }

    // 横幅
    if (isScan) {
      banner.textContent = `dp[${j}] = ${step.dpJ ? 'true' : 'false'} && s[${j}:${pos}] = "${step.seg}" ${step.inDict ? '∈' : '∉'} dict → ${step.hit ? '锁定这一段' : '作废'}`
      banner.setAttribute('class', 'wbs-banner__text' + (step.hit ? ' is-ok' : ''))
    } else if (step.phase === 'done') {
      banner.textContent = step.result ? `切分：${step.segments.join(' | ')}` : `返回 false：dp[${n}] 始终为 false`
      banner.setAttribute('class', 'wbs-banner__text' + (step.result ? ' is-ok' : ''))
    } else {
      banner.textContent = `dp[i] = OR( dp[j] && s[j:i] ∈ dict )　dp[${n}] = true`
      banner.setAttribute('class', 'wbs-banner__text is-ok')
    }

    // 面板
    posNum.textContent = pos < 0 ? '—' : String(pos)
    jNum.textContent = isScan ? String(j) : '—'
    dpJNum.textContent = isScan ? (step.dpJ ? 'true' : 'false') : '—'
    dpJNum.setAttribute('class', 'wbs-panel__num' + (isScan ? (step.dpJ ? ' is-ok' : ' is-dead') : ''))
    segNum.textContent = isScan ? `"${step.seg}"` : '—'
    segNum.setAttribute('class', 'wbs-panel__num' + (isScan && step.inDict ? ' is-fresh' : ''))
    resNum.textContent = String(step.result)
    resNum.setAttribute(
      'class',
      'wbs-panel__num' + (step.phase === 'done' ? (step.result ? ' is-ok' : ' is-dead') : ''),
    )

    // 底部状态行
    if (step.phase === 'init') {
      phaseText.textContent = 'dp 表已经算好；现在从 n 往左，一段一段把 s 切出来'
    } else if (isScan) {
      phaseText.textContent = step.hit
        ? '命中：这一段就是最后一个词，把 pos 左移到它的起点'
        : '这一段接不上（词不在字典里，或前缀 dp[j] 为假）'
    } else {
      phaseText.textContent = step.result
        ? 'dp 表 + 贪心回溯就够切出一条合法方案；要枚举所有方案就是 LC 140'
        : 'dp[n] 为 false，从最后一步就迈不出去'
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
      delete host.dataset.wordbreaksegMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
