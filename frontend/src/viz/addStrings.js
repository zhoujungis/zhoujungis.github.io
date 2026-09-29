/**
 * addStrings.js — 「字符串相加」(LC 415) 竖式加法的 SVG 渲染层。
 *
 * 竖式布局：num1 行 + num2 行（右对齐、空缺列灰虚格）+ 横线 + 结果行
 * （多一格容纳进位溢出）。i/j 两根指针各占一行（垂直错开，见 SKILL 坑 W）。
 * digit 帧：当前列淡金底，补零格灰字，结果行最新写出的格子橙描边。
 * done 帧：结果行整体变绿，溢出格有进位则显 1。
 *
 * 通用坑：A / K / W / X / 红线 4。
 */

import { buildAddStringsSteps } from './addStringsSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'addstr-styles'

const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const CARRY_Y = 150
const PIN1_TOP = 162
const TRI1_TOP = 184
const NUM1_Y = 194
const CELL_H = 46

const PIN2_TOP = 252
const TRI2_TOP = 274
const NUM2_Y = 284

const RULE_Y = 346
const RES_Y = 360
const IDX_Y = 424
const PHASE_Y = 450

const LABEL_X = 26
const AVAIL = 604
const PLAY_MS = 1300

const STYLES = `
.addstr {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.addstr__svg { width: 100%; height: auto; display: block; }

.addstr-note {
  fill: var(--addstr-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.addstr-banner__box {
  fill: var(--addstr-banner, #f4f3ef);
  stroke: var(--addstr-line, #c3c9c2);
  stroke-width: 1.5;
}
.addstr-banner__seg {
  fill: var(--addstr-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.addstr-banner__ans {
  fill: var(--addstr-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.addstr-carry {
  fill: var(--addstr-hot, #a45f45);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.addstr-cell__box {
  fill: var(--addstr-fill, #ffffff);
  stroke: var(--addstr-line, #c3c9c2);
  stroke-width: 1.5;
}
.addstr-cell__box.is-dashed {
  fill: none;
  stroke: var(--addstr-dim, #9aa39c);
  stroke-dasharray: 4 4;
  stroke-width: 1.2;
}
.addstr-cell__val {
  fill: var(--addstr-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.addstr-cell__val.is-zero { fill: var(--addstr-dim, #9aa39c); }
.addstr-cell__idx {
  fill: var(--addstr-dim, #9aa39c);
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* 通道一（底色）：当前处理列 */
.addstr-cell.is-active .addstr-cell__box { fill: var(--addstr-gold-fill, #fdf3e3); }
/* 通道二（边框）：结果行最新写出的格子 */
.addstr-cell.is-fresh .addstr-cell__box {
  stroke: var(--addstr-hot, #a45f45);
  stroke-width: 3;
}
.addstr-cell.is-fresh .addstr-cell__val { fill: var(--addstr-hot, #a45f45); }
/* done 帧：结果整体就位 */
.addstr-cell.is-done .addstr-cell__box {
  fill: var(--addstr-ok-fill, #eef5f1);
  stroke: var(--addstr-ok, #3f6b57);
  stroke-width: 2;
}
.addstr-cell.is-done .addstr-cell__val { fill: var(--addstr-ok, #3f6b57); }

.addstr-rule {
  stroke: var(--addstr-ink, #1f2a24);
  stroke-width: 2;
}

.addstr-pin__tag { fill: var(--addstr-hot, #a45f45); }
.addstr-pin__tri { fill: var(--addstr-hot, #a45f45); }
.addstr-pin__text {
  fill: var(--addstr-paper, #ffffff);
  font-size: 12.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.addstr-phase__text {
  fill: var(--addstr-muted, #657168);
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
 * @param {{ num1?: string, num2?: string, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountAddStrings(host, options = {}) {
  if (!host || host.dataset.addstrMounted === '1') return { destroy() {} }
  host.dataset.addstrMounted = '1'
  ensureStyles()

  const steps = buildAddStringsSteps(options)
  const autoplay = options.autoplay !== false
  const s0 = steps[0]
  const num1 = s0.num1
  const num2 = s0.num2
  const maxLen = s0.maxLen

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz addstr'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  // 列宽自适应：结果行 maxLen+1 格
  let cellW = 58
  const need = (maxLen + 1) * cellW + maxLen * 6
  if (need > AVAIL) cellW = Math.max(26, Math.floor((AVAIL - maxLen * 6) / (maxLen + 1)))
  const gap = 6
  const resRowW = (maxLen + 1) * cellW + maxLen * gap
  const numRowW = maxLen * cellW + (maxLen - 1) * gap
  const width = Math.max(660, LABEL_X * 2 + resRowW)
  const RIGHT = width - LABEL_X
  const resLeft = RIGHT - resRowW
  const numLeft = RIGHT - numRowW
  const cxCol = (col) => numLeft + col * (cellW + gap) + cellW / 2
  const cxRes = (r) => resLeft + r * (cellW + gap) + cellW / 2
  const BANNER_W = width - LABEL_X * 2
  const height = PHASE_Y + 24

  const svgRoot = mk('svg', {
    class: 'viz__svg addstr__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '字符串相加 竖式加法推演动画',
  })
  stage.appendChild(svgRoot)

  const cellLayer = mk('g', { class: 'addstr-cells' })
  const markLayer = mk('g', { class: 'addstr-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  const note = mk('text', { class: 'addstr-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = '竖式加法：从个位起，每位算「两位数字 + 低位进位」，写下个位、进位带上'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'addstr-banner__box', x: LABEL_X, y: BANNER_TOP, width: BANNER_W, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'addstr-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'addstr-banner__seg', x: LABEL_X + 210, y: BANNER_TOP + BANNER_H / 2 })
  const ansVal = mk('text', { class: 'addstr-banner__ans', x: width - LABEL_X - 18, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(ansVal)

  // 行标签（num1 / num2 / 结果）
  const rowLabel = (y, text) => {
    const t = mk('text', {
      x: resLeft - 14,
      y,
      style: 'fill: var(--addstr-muted, #657168); font-size: 12px; text-anchor: end; dominant-baseline: central; font-family: Consolas, monospace;',
    })
    t.textContent = text
    markLayer.appendChild(t)
  }

  // 进位小字行（竖式顶上的小 1）
  const carryMarks = []
  for (let col = 0; col < maxLen; col += 1) {
    const t = mk('text', { class: 'addstr-carry', x: cxCol(col), y: CARRY_Y })
    t.style.opacity = '0'
    markLayer.appendChild(t)
    carryMarks.push(t)
  }

  function makeRow(y, cols) {
    const els = []
    for (let c = 0; c < cols; c += 1) {
      const g = mk('g', { class: 'addstr-cell' })
      const box = mk('rect', { class: 'addstr-cell__box', x: cxCol(c) - cellW / 2, y, width: cellW, height: CELL_H, rx: 6 })
      g.appendChild(box)
      const val = mk('text', { class: 'addstr-cell__val', x: cxCol(c), y: y + CELL_H / 2 })
      g.appendChild(val)
      cellLayer.appendChild(g)
      els.push({ g, box, val })
    }
    return els
  }

  const row1 = makeRow(NUM1_Y, maxLen)
  const row2 = makeRow(NUM2_Y, maxLen)

  // 横线 + 结果行（maxLen+1 格，格子 0 是进位溢出位）
  const rule = mk('line', { class: 'addstr-rule', x1: resLeft, y1: RULE_Y, x2: RIGHT, y2: RULE_Y })
  markLayer.appendChild(rule)
  const resRow = []
  for (let r = 0; r <= maxLen; r += 1) {
    const g = mk('g', { class: 'addstr-cell' })
    const box = mk('rect', { class: 'addstr-cell__box', x: cxRes(r) - cellW / 2, y: RES_Y, width: cellW, height: CELL_H, rx: 6 })
    g.appendChild(box)
    const val = mk('text', { class: 'addstr-cell__val', x: cxRes(r), y: RES_Y + CELL_H / 2 })
    g.appendChild(val)
    cellLayer.appendChild(g)
    resRow.push({ g, box, val })
  }

  // 列号（结果行下方）
  for (let r = 1; r <= maxLen; r += 1) {
    const idx = mk('text', { class: 'addstr-cell__idx', x: cxRes(r), y: IDX_Y })
    idx.textContent = String(r - 1)
    markLayer.appendChild(idx)
  }

  // 指针（i 在 num1 上方、j 在 num2 上方，两行错开）
  function makePin(tagTop, triTop) {
    const g = mk('g', { class: 'addstr-pin' })
    const tag = mk('rect', { class: 'addstr-pin__tag', x: 0, y: tagTop, width: 34, height: 20, rx: 5 })
    const tri = mk('path', { class: 'addstr-pin__tri', d: 'M 0 0 L 0 0 L 0 0' })
    const text = mk('text', { class: 'addstr-pin__text', x: 0, y: tagTop + 10 })
    g.appendChild(tag)
    g.appendChild(tri)
    g.appendChild(text)
    markLayer.appendChild(g)
    return { g, tag, tri, text }
  }
  const pin1 = makePin(PIN1_TOP, TRI1_TOP)
  const pin2 = makePin(PIN2_TOP, TRI2_TOP)

  const phaseText = mk('text', { class: 'addstr-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  rowLabel(NUM1_Y + CELL_H / 2, 'num1')
  rowLabel(NUM2_Y + CELL_H / 2, 'num2')
  rowLabel(RES_Y + CELL_H / 2, 'res')

  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const isDone = step.phase === 'done'
    const isDigit = step.phase === 'digit'

    // 进位小字：本帧 carryOut > 0 时标在下一列（当前列的左邻）上方
    carryMarks.forEach((t, c) => {
      const show = isDigit && step.carryOut > 0 && c === step.col - 1
      t.textContent = '1'
      t.style.opacity = show ? '1' : '0'
    })

    // num1 / num2 行
    const paintNumRow = (els, str, idx, isActiveCol) => {
      const len = str.length
      els.forEach((el, c) => {
        const hasDigit = c >= maxLen - len
        const cls = ['addstr-cell']
        el.val.classList.remove('is-zero')
        if (hasDigit) {
          el.box.classList.remove('is-dashed')
          el.val.textContent = str[c - (maxLen - len)]
          if (isDigit && c === step.col) cls.push('is-active')
        } else {
          // 空缺列：虚线空格；当前列且本帧该侧补零 → 显示灰 0
          el.box.classList.add('is-dashed')
          if (isDigit && isActiveCol && c === step.col) {
            el.val.textContent = '0'
            el.val.classList.add('is-zero')
          } else {
            el.val.textContent = ''
          }
        }
        el.g.setAttribute('class', cls.join(' '))
      })
    }
    paintNumRow(row1, num1, step.i, isDigit && step.zeroA)
    paintNumRow(row2, num2, step.j, isDigit && step.zeroB)

    // 结果行：resLow[t]（10^t 位）画在格子 maxLen - t
    const written = step.resLow.length
    resRow.forEach((el, r) => {
      const cls = ['addstr-cell']
      el.val.classList.remove('is-zero')
      el.box.classList.remove('is-dashed')
      if (isDone) {
        // done：格子 r 对应 10^(maxLen-r) 位，值就是 resLow[maxLen - r]（resLow 低位在前）
        const t = maxLen - r
        if (t < written) {
          el.val.textContent = String(step.resLow[t])
          cls.push('is-done')
        } else {
          el.box.classList.add('is-dashed')
          el.val.textContent = ''
        }
      } else if (isDigit) {
        const t = maxLen - r
        if (t < written) {
          el.val.textContent = String(step.resLow[t])
          if (t === written - 1) cls.push('is-fresh')
        } else {
          el.box.classList.add('is-dashed')
          el.val.textContent = ''
        }
      } else {
        el.box.classList.add('is-dashed')
        el.val.textContent = ''
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    // 指针
    // 指针：串内下标 → 列号要加偏移（短串右侧对齐，col = idx + (maxLen - len)）
    const placePin = (pin, idx, len, tagTop, triTop, label) => {
      const col = idx + (maxLen - len)
      if (isDigit && idx >= 0 && col >= 0 && col < maxLen) {
        const x = cxCol(col)
        pin.tag.setAttribute('x', x - 17)
        pin.tri.setAttribute('d', `M ${x - 6} ${triTop} L ${x + 6} ${triTop} L ${x} ${triTop + 9} z`)
        pin.text.setAttribute('x', x)
        pin.text.textContent = label
        pin.g.style.opacity = '1'
      } else {
        pin.g.style.opacity = '0'
      }
    }
    placePin(pin1, step.i, num1.length, PIN1_TOP, TRI1_TOP, 'i')
    placePin(pin2, step.j, num2.length, PIN2_TOP, TRI2_TOP, 'j')

    // 横幅
    const posName = (col) => {
      const fromRight = maxLen - 1 - col
      return ['个位', '十位', '百位', '千位'][fromRight] || `10^${fromRight} 位`
    }
    if (isDigit) {
      segRound.textContent = `第 ${maxLen - step.col}/${maxLen} 位 · ${posName(step.col)}`
    } else if (step.phase === 'init') {
      segRound.textContent = '竖式对齐'
    } else {
      segRound.textContent = `${maxLen} 列处理完`
    }
    if (isDigit) {
      const aTxt = step.zeroA ? '0+' : `${step.digitA}+`
      const bTxt = step.zeroB ? '0+' : `${step.digitB}+`
      segAct.textContent = `${aTxt}${bTxt}${step.carryIn}=${step.sum} → 写 ${step.out} 进 ${step.carryOut}`
    } else if (step.phase === 'init') {
      segAct.textContent = '双指针从个位出发'
    } else {
      segAct.textContent = '进位 0 · 终止'
    }
    ansVal.textContent = isDone ? `"${step.result}"` : `"${num1}" + "${num2}"`

    // 阶段行
    if (isDigit) {
      phaseText.textContent = `已写 ${step.resLow.length} 位 · i=${step.i} j=${step.j} carry=${step.carryOut}`
    } else if (step.phase === 'init') {
      phaseText.textContent = '循环条件 i >= 0 || j >= 0 || carry > 0'
    } else {
      phaseText.textContent = '答案 = reverse(resLow).join("") · O(max(m,n)) 时间 O(1) 空间'
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
      delete host.dataset.addstrMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
