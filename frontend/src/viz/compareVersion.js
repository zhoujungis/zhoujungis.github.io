/**
 * compareVersion.js — 「比较版本号」(LC 165) 的 SVG 渲染层。
 *
 * 两行修订号格子（原始串，含前导零）+ 列号 + 当前列高亮：
 * equal 列淡金、裁决列橙边、补零侧灰虚格显 0、done 帧裁决列变绿。
 * 剥前导零的归一化信息放横幅（"02" → 2）。
 *
 * 通用坑：A / K / W / X / 红线 4。
 */

import { buildCompareVersionSteps } from './compareVersionSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'cmpver-styles'

const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const COLIDX_Y = 156
const V1_Y = 176
const CELL_H = 46
const V2_Y = 238
const PHASE_Y = 314

const LABEL_X = 26
const AVAIL = 604
const PLAY_MS = 1350

const STYLES = `
.cmpver {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.cmpver__svg { width: 100%; height: auto; display: block; }

.cmpver-note {
  fill: var(--cmpver-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.cmpver-banner__box {
  fill: var(--cmpver-banner, #f4f3ef);
  stroke: var(--cmpver-line, #c3c9c2);
  stroke-width: 1.5;
}
.cmpver-banner__seg {
  fill: var(--cmpver-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cmpver-banner__ans {
  fill: var(--cmpver-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.cmpver-cell__box {
  fill: var(--cmpver-fill, #ffffff);
  stroke: var(--cmpver-line, #c3c9c2);
  stroke-width: 1.5;
}
.cmpver-cell__box.is-dashed {
  fill: none;
  stroke: var(--cmpver-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.cmpver-cell__val {
  fill: var(--cmpver-ink, #1f2a24);
  font-size: 15.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.cmpver-cell__val.is-zero { fill: var(--cmpver-dim, #9aa39c); }
.cmpver-cell__idx {
  fill: var(--cmpver-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：当前比较列（equal 时） */
.cmpver-cell.is-active .cmpver-cell__box { fill: var(--cmpver-gold-fill, #fdf3e3); }
/* 通道二（边框）：本列分出胜负 */
.cmpver-cell.is-hot .cmpver-cell__box {
  stroke: var(--cmpver-hot, #a45f45);
  stroke-width: 3;
}
.cmpver-cell.is-hot .cmpver-cell__val { fill: var(--cmpver-hot, #a45f45); }
/* done 帧：裁决列就位 */
.cmpver-cell.is-done .cmpver-cell__box {
  fill: var(--cmpver-ok-fill, #eef5f1);
  stroke: var(--cmpver-ok, #3f6b57);
  stroke-width: 2;
}
.cmpver-cell.is-done .cmpver-cell__val { fill: var(--cmpver-ok, #3f6b57); }

.cmpver-phase__text {
  fill: var(--cmpver-muted, #657168);
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
 * @param {{ version1?: string, version2?: string, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountCompareVersion(host, options = {}) {
  if (!host || host.dataset.cmpverMounted === '1') return { destroy() {} }
  host.dataset.cmpverMounted = '1'
  ensureStyles()

  const steps = buildCompareVersionSteps(options)
  const autoplay = options.autoplay !== false
  const s0 = steps[0]
  const rev1 = s0.rev1
  const rev2 = s0.rev2
  const cols = Math.max(rev1.length, rev2.length)

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz cmpver'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  // 列宽自适应：按最长原始修订号
  const maxRaw = Math.max(...rev1.map((r) => r.length), ...rev2.map((r) => r.length), 2)
  const cellW = Math.min(76, Math.max(46, maxRaw * 13 + 20))
  const gap = 8
  const rowW = cols * cellW + (cols - 1) * gap
  const width = Math.max(660, LABEL_X * 2 + rowW)
  const LEFT = (width - rowW) / 2
  const cx = (c) => LEFT + c * (cellW + gap) + cellW / 2
  const BANNER_W = width - LABEL_X * 2
  const height = PHASE_Y + 24

  const svgRoot = mk('svg', {
    class: 'viz__svg cmpver__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '比较版本号 逐列比较推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', { class: 'cmpver-cells' })
  const markLayer = mk('g', { class: 'cmpver-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'cmpver-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = '归一化后逐列比较：剥前导零 + 缺失补 0，先比长度再比字典序'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'cmpver-banner__box', x: LABEL_X, y: BANNER_TOP, width: BANNER_W, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'cmpver-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'cmpver-banner__seg', x: LABEL_X + 150, y: BANNER_TOP + BANNER_H / 2 })
  const ansVal = mk('text', { class: 'cmpver-banner__ans', x: width - LABEL_X - 18, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(ansVal)

  const rowLabel = (y, text) => {
    const t = mk('text', {
      x: LEFT - 14,
      y,
      style: 'fill: var(--cmpver-muted, #657168); font-size: 12px; text-anchor: end; dominant-baseline: central; font-family: Consolas, monospace;',
    })
    t.textContent = text
    markLayer.appendChild(t)
  }

  function makeRow(y, revs, len) {
    const els = []
    for (let c = 0; c < cols; c += 1) {
      const g = mk('g', { class: 'cmpver-cell' })
      const box = mk('rect', { class: 'cmpver-cell__box', x: cx(c) - cellW / 2, y, width: cellW, height: CELL_H, rx: 6 })
      g.appendChild(box)
      const val = mk('text', { class: 'cmpver-cell__val', x: cx(c), y: y + CELL_H / 2 })
      g.appendChild(val)
      cellLayer.appendChild(g)
      els.push({ g, box, val, c })
    }
    // 列号（第一行上方）
    for (let c = 0; c < cols; c += 1) {
      const idx = mk('text', { class: 'cmpver-cell__idx', x: cx(c), y: COLIDX_Y })
      idx.textContent = String(c)
      markLayer.appendChild(idx)
    }
    return els
  }

  const row1 = makeRow(V1_Y, rev1, rev1.length)
  const row2 = makeRow(V2_Y, rev2, rev2.length)

  rowLabel(V1_Y + CELL_H / 2, 'v1')
  rowLabel(V2_Y + CELL_H / 2, 'v2')

  const phaseText = mk('text', { class: 'cmpver-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const isDone = step.phase === 'done'
    const isCompare = step.phase === 'compare'

    const paintRow = (els, revs, len, isPad) => {
      els.forEach((el) => {
        const c = el.c
        const hasRev = c < len
        const cls = ['cmpver-cell']
        el.val.classList.remove('is-zero')
        el.box.classList.remove('is-dashed')
        if (hasRev) {
          el.val.textContent = revs[c]
          if (isCompare && c === step.col) cls.push(step.verdict === 'equal' ? 'is-active' : 'is-hot')
          if (isDone && c === step.col) cls.push('is-done')
        } else {
          el.box.classList.add('is-dashed')
          if (isCompare && c === step.col && isPad) {
            el.val.textContent = '0'
            el.val.classList.add('is-zero')
            cls.push(step.verdict === 'equal' ? 'is-active' : 'is-hot')
          } else {
            el.val.textContent = ''
          }
        }
        el.g.setAttribute('class', cls.join(' '))
      })
    }
    paintRow(row1, rev1, rev1.length, step.isPad1)
    paintRow(row2, rev2, rev2.length, step.isPad2)

    // 横幅
    if (isCompare) {
      segRound.textContent = `第 ${step.col + 1}/${cols} 列`
      const l = step.isPad1 ? '0(补)' : `"${step.raw1}" → ${step.val1}`
      const r = step.isPad2 ? '0(补)' : `"${step.raw2}" → ${step.val2}`
      const sign = step.verdict === 'equal' ? '=' : step.verdict === 'less' ? '<' : '>'
      segAct.textContent = `${l}  ${sign}  ${r}`
    } else if (step.phase === 'init') {
      segRound.textContent = '按 . 切开'
      segAct.textContent = '逐列归一化比较'
    } else {
      segRound.textContent = `${cols} 列比较完`
      segAct.textContent = step.result === 0 ? '全部相等' : `第 ${step.col + 1} 列分出胜负`
    }
    ansVal.textContent = isDone ? `return ${step.result}` : `"${rev1.join('.')}" vs "${rev2.join('.')}"`

    // 底部状态行
    if (isCompare) {
      phaseText.textContent =
        step.verdict === 'equal'
          ? `第 ${step.col + 1} 列相等，进下一列（短路：一旦分出胜负立即返回）`
          : `第 ${step.col + 1} 列分出胜负 → return ${step.verdict === 'less' ? -1 : 1}`
    } else if (step.phase === 'init') {
      phaseText.textContent = '剥前导零（"0002" → "2"，全零 → "0"）· 缺失修订号视为 0'
    } else {
      phaseText.textContent = '归一化比较：先比长度（长的一定大），等长再比字典序'
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
      delete host.dataset.cmpverMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
