/**
 * bitmap.js — 「海量数据统计：10 亿整数排序去重（位图）」的 SVG 渲染层：1-bit 位图。
 *
 * 对应文章里的「动画一」：占位符 algo-viz--bitmap。
 * 视觉分五段：
 *   1. 顶部横幅：阶段 / 动作 / 关键值
 *   2. 位图阵列：2 行 × 32 列（每行 = 一个 32 位字），已置位绿、当前位橙、
 *      未置位灰；行首标 word 号，行下标 bit 刻度
 *   3. 定位等式：v = word × 32 + bit + 置位指令 words[w] |= 1 << b
 *   4. 输出区：已置位的值（升序 chips）+ 输入序列回放
 *   5. 判定 + 底部结论行
 *
 * 通用坑：A（CSS 变量字面量兜底）/ K（标记层后挂）/ X（横幅多段固定偏移）。
 */

import { buildBitmapSteps } from './bitmapSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'bm-styles'
const PLAY_MS = 900

const STYLES = `
.bm { display: flex; flex-direction: column; gap: 14px; }
.bm__svg { width: 100%; height: auto; display: block; }

.bm-note {
  fill: var(--bm-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.bm-banner__box {
  fill: var(--bm-banner, #f4f3ef);
  stroke: var(--bm-line, #c3c9c2);
  stroke-width: 1.5;
}
.bm-banner__seg {
  fill: var(--bm-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.bm-banner__val {
  fill: var(--bm-gold, #c2872f);
  font-size: 16px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm-seclabel {
  fill: var(--bm-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 位图阵列 ---- */
.bm-wordlabel {
  fill: var(--bm-muted, #657168);
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
}
.bm-ruler {
  fill: var(--bm-dim, #9aa39c);
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm-cell__box {
  fill: var(--bm-fill, #ffffff);
  stroke: var(--bm-line, #c3c9c2);
  stroke-width: 1;
}
.bm-cell.is-on .bm-cell__box {
  fill: var(--bm-green-fill, #eaf3ee);
  stroke: var(--bm-green, #3f6b57);
}
.bm-cell.is-cur .bm-cell__box {
  fill: var(--bm-cur-fill, #f8ece5);
  stroke: var(--bm-cur, #a45f45);
  stroke-width: 2.6;
}
.bm-cell.is-skip .bm-cell__box {
  fill: var(--bm-gold-fill, #fdf3e3);
  stroke: var(--bm-gold, #c2872f);
  stroke-width: 2.2;
}
.bm-cell.is-empty .bm-cell__box { stroke-dasharray: 2 2; }

/* ---- 定位等式 ---- */
/* 含 × 和中文（字/位），不能用 Consolas —— 走继承字体 */
.bm-eq {
  fill: var(--bm-ink, #1f2a24);
  font-size: 14.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.bm-eq .eq-v { fill: var(--bm-cur, #a45f45); font-weight: 700; }
.bm-eq .eq-w { fill: var(--bm-hi, #3d6a8f); font-weight: 700; }
.bm-eq .eq-b { fill: var(--bm-green, #3f6b57); font-weight: 700; }
.bm-eq.is-generic { opacity: 0.55; }

/* ---- 输出 chips ---- */
.bm-chip__box {
  fill: var(--bm-fill, #ffffff);
  stroke: var(--bm-line, #c3c9c2);
  stroke-width: 1.4;
}
.bm-chip__val {
  fill: var(--bm-green, #3f6b57);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bm-chip.is-new .bm-chip__box {
  stroke: var(--bm-gold, #c2872f);
  stroke-width: 2.4;
}
.bm-chip.is-new .bm-chip__val { fill: var(--bm-gold, #c2872f); }
.bm-chip.is-off { opacity: 0; }

/* ---- 判定 ---- */
.bm-verdict__box {
  fill: var(--bm-fill, #ffffff);
  stroke: var(--bm-line, #c3c9c2);
  stroke-width: 1.5;
}
.bm-verdict__label {
  fill: var(--bm-muted, #657168);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}
.bm-verdict__main {
  fill: var(--bm-dim, #9aa39c);
  font-size: 19px;
  font-weight: 700;
  text-anchor: start;
  dominant-baseline: central;
}
.bm-verdict__sub {
  fill: var(--bm-muted, #657168);
  font-size: 12.5px;
  text-anchor: end;
  dominant-baseline: central;
}
.bm-verdict.is-on .bm-verdict__box {
  fill: var(--bm-green-fill, #eaf3ee);
  stroke: var(--bm-green, #3f6b57);
  stroke-width: 2.6;
}
.bm-verdict.is-on .bm-verdict__main { fill: var(--bm-green, #3f6b57); }

.bm-phasetext {
  fill: var(--bm-muted, #657168);
  font-size: 12.5px;
  text-anchor: middle;
  dominant-baseline: central;
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

// ── 布局常量（纵向逐段推，坑 E） ────────────────────────────────────────────
const W = 680
const NOTE_Y = 20
const BANNER_Y = 36
const BANNER_H = 40
const BM_LABEL_Y = 100
const ROW_H = 26
const ROW_Y = [112, 144]
const CELL_W = 17
const CELL_GAP = 2
const CELLS_X = 64
const RULER_Y = 186
const EQ_Y = 216
const OUT_LABEL_Y = 250
const CHIP_Y = 260
const CHIP_H = 34
const VERDICT_Y = 336
const VERDICT_H = 50
const PHASE_Y = 424
const H = 442

const SIZE = 64
const WORDS = 2

export function mountBitmap(host, options = {}) {
  if (!host || host.dataset.bmMounted === '1') return { destroy() {} }
  host.dataset.bmMounted = '1'
  ensureStyles()

  const steps = buildBitmapSteps(options)
  const s0 = steps[0]

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg bm__svg',
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    'aria-label': '位图排序去重动画：置位、判重、扫描输出',
  })
  const cellLayer = mk('g', { class: 'bm-cells' })
  const markLayer = mk('g', { class: 'bm-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer) // 标记层后挂 = 永远压在图形上（坑 K）

  // ── 顶部说明 + 横幅 ──
  const note = mk('text', { class: 'bm-note', x: 30, y: NOTE_Y })
  note.textContent = `输入 ${s0.input.length} 个整数（${s0.input.join('、')}）· 值域 0 ~ ${SIZE - 1} · 每个整数只占 1 bit`
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'bm-banner__box', x: 30, y: BANNER_Y, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segPhase = mk('text', { class: 'bm-banner__seg', x: 46, y: BANNER_Y + BANNER_H / 2 })
  const segAct = mk('text', { class: 'bm-banner__seg', x: 150, y: BANNER_Y + BANNER_H / 2 })
  const segVal = mk('text', { class: 'bm-banner__val', x: W - 46, y: BANNER_Y + BANNER_H / 2 })
  markLayer.append(segPhase, segAct, segVal)

  // ── 位图阵列 ──
  const bmLabel = mk('text', { class: 'bm-seclabel', x: 30, y: BM_LABEL_Y })
  bmLabel.textContent = `位图：${WORDS} 个字 × 32 位（绿 = 已置位，橙 = 当前位，金 = 命中重复）`
  markLayer.appendChild(bmLabel)

  const cellEls = []
  for (let v = 0; v < SIZE; v += 1) {
    const word = v >> 5
    const col = v & 31
    const x = CELLS_X + col * (CELL_W + CELL_GAP)
    const y = ROW_Y[word]
    const g = mk('g', { class: 'bm-cell is-empty' })
    g.appendChild(
      mk('rect', {
        class: 'bm-cell__box',
        x,
        y,
        width: CELL_W,
        height: ROW_H,
        rx: 3,
      }),
    )
    cellLayer.appendChild(g)
    cellEls.push({ g, v })
  }
  // word 标签
  for (let w = 0; w < WORDS; w += 1) {
    const t = mk('text', { class: 'bm-wordlabel', x: CELLS_X - 8, y: ROW_Y[w] + ROW_H / 2 })
    t.textContent = `字 ${w}`
    markLayer.appendChild(t)
  }
  // bit 刻度（每 4 位一个）
  for (let b = 0; b < 32; b += 4) {
    const t = mk('text', {
      class: 'bm-ruler',
      x: CELLS_X + b * (CELL_W + CELL_GAP) + CELL_W / 2,
      y: RULER_Y,
    })
    t.textContent = String(b)
    markLayer.appendChild(t)
  }

  // ── 定位等式 ──
  const eq = mk('text', { class: 'bm-eq', x: W / 2, y: EQ_Y })
  markLayer.appendChild(eq)
  const eqTspan = (text, cls) => {
    const t = mk('tspan', cls ? { class: cls } : null)
    t.textContent = text
    return t
  }
  const paintEq = (s) => {
    eq.textContent = ''
    if (s.value !== null) {
      eq.appendChild(eqTspan(`${s.value} = `))
      eq.appendChild(eqTspan(`${s.word}`, 'eq-w'))
      eq.appendChild(eqTspan(` × 32 + `))
      eq.appendChild(eqTspan(`${s.bit}`, 'eq-b'))
      if (s.phase === 'act') {
        eq.appendChild(eqTspan(`   ·   words[${s.word}] ${s.already ? '>>' : '|='} `))
        eq.appendChild(eqTspan(`1 << ${s.bit}`, 'eq-b'))
      }
      eq.setAttribute('class', 'bm-eq')
    } else {
      eq.appendChild(eqTspan('v = word × 32 + bit —— 置位 words[word] |= 1 << bit'))
      eq.setAttribute('class', 'bm-eq is-generic')
    }
  }

  // ── 输出 chips ──
  const outLabel = mk('text', { class: 'bm-seclabel', x: 30, y: OUT_LABEL_Y })
  outLabel.textContent = '已置位的值（扫描位图即得，天然升序）'
  markLayer.appendChild(outLabel)

  const MAX_CHIPS = 12
  const chipW = 52
  const chipGap = 10
  const chipEls = []
  for (let i = 0; i < MAX_CHIPS; i += 1) {
    const x = 30 + (i % 6) * (chipW + chipGap)
    const y = CHIP_Y + Math.floor(i / 6) * (CHIP_H + 8)
    const g = mk('g', { class: 'bm-chip is-off' })
    g.appendChild(
      mk('rect', { class: 'bm-chip__box', x, y, width: chipW, height: CHIP_H, rx: 7 }),
    )
    const val = mk('text', { class: 'bm-chip__val', x: x + chipW / 2, y: y + CHIP_H / 2 })
    g.appendChild(val)
    cellLayer.appendChild(g)
    chipEls.push({ g, val })
  }

  // ── 判定 ──
  const verdictG = mk('g', { class: 'bm-verdict' })
  verdictG.appendChild(
    mk('rect', { class: 'bm-verdict__box', x: 30, y: VERDICT_Y, width: W - 60, height: VERDICT_H, rx: 10 }),
  )
  const verdictLabel = mk('text', { class: 'bm-verdict__label', x: 48, y: VERDICT_Y + 16 })
  verdictLabel.textContent = '进度'
  const verdictMain = mk('text', { class: 'bm-verdict__main', x: 48, y: VERDICT_Y + 34 })
  const verdictSub = mk('text', { class: 'bm-verdict__sub', x: W - 48, y: VERDICT_Y + VERDICT_H / 2 })
  verdictG.append(verdictLabel, verdictMain, verdictSub)
  cellLayer.appendChild(verdictG)

  const phaseText = mk('text', { class: 'bm-phasetext', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const PHASE_TEXT = {
    init: '整数有界 → 每个整数 1 bit。数据量再大，位图的大小只由值域决定。',
    locate: 'word = v >> 5 定第几个字，bit = v & 31 定字内第几位 —— v = word × 32 + bit。',
    act: '|= 只翻本位；写成 = 会冲掉整个字。位是 1 说明来过，跳过即去重。',
    done: '按 bit 下标从小到大扫一遍，输出天然有序 —— 排序和去重都不需要额外操作。',
  }

  function paint(_index, step) {
    if (!step) return
    const cur = step.value

    // 位图阵列
    cellEls.forEach(({ g, v }) => {
      const cls = ['bm-cell']
      const on = step.placed.includes(v)
      if (v === cur && step.phase !== 'done') cls.push(step.already ? 'is-skip' : 'is-cur')
      else if (on) cls.push('is-on')
      else cls.push('is-empty')
      g.setAttribute('class', cls.join(' '))
    })

    paintEq(step)

    // 输出 chips：distinct 升序，最新置位的烫金
    const list = step.distinct
    chipEls.forEach((el, i) => {
      if (i >= list.length) {
        el.g.setAttribute('class', 'bm-chip is-off')
        return
      }
      const isNew = step.phase === 'act' && !step.already && list[i] === cur
      el.g.setAttribute('class', `bm-chip ${isNew ? 'is-new' : ''}`)
      el.val.textContent = String(list[i])
    })

    // 判定区
    if (step.phase === 'done') {
      verdictG.setAttribute('class', 'bm-verdict is-on')
      verdictLabel.textContent = '扫描完成'
      verdictMain.textContent = `${step.input.length} 个输入 → ${step.placed.length} 个 distinct`
      verdictSub.textContent = `跳过 ${step.skipped.length} 个重复`
    } else {
      verdictG.setAttribute('class', 'bm-verdict')
      verdictLabel.textContent = '进度'
      verdictMain.textContent = `已置位 ${step.placed.length} · 已跳过 ${step.skipped.length}`
      verdictSub.textContent = `共 ${step.input.length} 个输入`
    }

    // 横幅
    if (step.phase === 'init') {
      segPhase.textContent = '准备'
      segAct.textContent = '开一片全 0 的位图'
      segVal.textContent = `${SIZE} bit`
    } else if (step.phase === 'done') {
      segPhase.textContent = '扫描输出'
      segAct.textContent = '按 bit 下标从小到大'
      segVal.textContent = `${step.placed.length} 个`
    } else if (step.phase === 'locate') {
      segPhase.textContent = `定位 ${step.value}`
      segAct.textContent = `word = ${step.value} >> 5`
      segVal.textContent = `bit = ${step.value} & 31`
    } else {
      segPhase.textContent = `${step.already ? '跳过' : '置位'} ${step.value}`
      segAct.textContent = step.already ? '这一位已经是 1' : `words[${step.word}] |= 1 << ${step.bit}`
      segVal.textContent = step.already ? '重复' : `第 ${step.bit} 位`
    }

    phaseText.textContent = PHASE_TEXT[step.phase] || ''
    renderRichText(descEl, step.desc)
  }

  const descEl = makeDesc()
  const rootEl = document.createElement('div')
  rootEl.className = 'viz bm'
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
      delete host.dataset.bmMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
