/**
 * lcs1Walk.js — 「允许一个错误的最长公共连续子序列」走位对照的 SVG 渲染层。
 *
 * 对应文章里的「动画二」：占位符 algo-viz--lcs1walk。
 * 一组输入走两条路径：
 *   正解路径（次对角线，格格全等）→ 绿
 *   错法路径（主对角线，格格不等却一路 +1）→ 红
 * 视觉四段：
 *   1. 顶部横幅：路径 / 当前步 / 当前 g 值
 *   2. 两串字符条：当前对齐位置高亮
 *   3. 走位迷你网格：已走过的格按路径着色
 *   4. 对照结论：正解 vs 错法
 *
 * 通用坑：A（CSS 变量字面量兜底）/ K（标记层后挂）/ X（横幅多段固定偏移）。
 */

import { buildLcs1WalkSteps } from './lcs1WalkSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'lc1w-styles'
const PLAY_MS = 1000

const STYLES = `
.lc1w { display: flex; flex-direction: column; gap: 14px; }
.lc1w__svg { width: 100%; height: auto; display: block; }

.lc1w-note {
  fill: var(--lc1w-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1w-banner__box {
  fill: var(--lc1w-banner, #f4f3ef);
  stroke: var(--lc1w-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc1w-banner__seg {
  fill: var(--lc1w-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1w-banner__val {
  font-size: 16px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1w-banner__val.is-ok { fill: var(--lc1w-green, #3f6b57); }
.lc1w-banner__val.is-bug { fill: var(--lc1w-red, #b3452f); }

/* ---- 字符条 ---- */
.lc1w-ch__box {
  fill: var(--lc1w-fill, #ffffff);
  stroke: var(--lc1w-line, #c3c9c2);
  stroke-width: 1.3;
}
.lc1w-ch__v {
  fill: var(--lc1w-ink, #1f2a24);
  font-size: 18px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1w-ch.is-s .lc1w-ch__v { fill: var(--lc1w-hi, #3d6a8f); }
.lc1w-ch.is-t .lc1w-ch__v { fill: var(--lc1w-low, #3f6b57); }
.lc1w-ch.is-ok .lc1w-ch__box {
  fill: var(--lc1w-green-fill, #eaf3ee);
  stroke: var(--lc1w-green, #3f6b57);
  stroke-width: 2.6;
}
.lc1w-ch.is-bug .lc1w-ch__box {
  fill: var(--lc1w-red-fill, #f9ece8);
  stroke: var(--lc1w-red, #b3452f);
  stroke-width: 2.6;
}
.lc1w-ch.is-rest .lc1w-ch__box { stroke-dasharray: 3 3; }
.lc1w-ch.is-off .lc1w-ch__box { opacity: 0.25; }
.lc1w-slabel {
  fill: var(--lc1w-dim, #9aa39c);
  font-size: 11px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 迷你网格 ---- */
.lc1w-g__box {
  fill: var(--lc1w-fill, #ffffff);
  stroke: var(--lc1w-line, #c3c9c2);
  stroke-width: 1;
}
.lc1w-g.is-off .lc1w-g__box { stroke-dasharray: 2 3; }
.lc1w-g.is-ok .lc1w-g__box {
  fill: var(--lc1w-green-fill, #eaf3ee);
  stroke: var(--lc1w-green, #3f6b57);
  stroke-width: 1.6;
}
.lc1w-g.is-bug .lc1w-g__box {
  fill: var(--lc1w-red-fill, #f9ece8);
  stroke: var(--lc1w-red, #b3452f);
  stroke-width: 1.6;
}
.lc1w-g__v {
  fill: var(--lc1w-muted, #657168);
  font-size: 10px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1w-g.is-ok .lc1w-g__v { fill: var(--lc1w-green, #3f6b57); }
.lc1w-g.is-bug .lc1w-g__v { fill: var(--lc1w-red, #b3452f); }
.lc1w-grid-label {
  fill: var(--lc1w-muted, #657168);
  font-size: 11px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 结论对照 ---- */
.lc1w-verdict__box {
  fill: var(--lc1w-fill, #ffffff);
  stroke: var(--lc1w-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc1w-verdict__main {
  font-size: 22px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
.lc1w-verdict__label {
  fill: var(--lc1w-muted, #657168);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
}
.lc1w-verdict.is-ok .lc1w-verdict__box {
  fill: var(--lc1w-green-fill, #eaf3ee);
  stroke: var(--lc1w-green, #3f6b57);
  stroke-width: 2.6;
}
.lc1w-verdict.is-ok .lc1w-verdict__main { fill: var(--lc1w-green, #3f6b57); }
.lc1w-verdict.is-bug .lc1w-verdict__box {
  fill: var(--lc1w-red-fill, #f9ece8);
  stroke: var(--lc1w-red, #b3452f);
  stroke-width: 2.6;
}
.lc1w-verdict.is-bug .lc1w-verdict__main { fill: var(--lc1w-red, #b3452f); }
.lc1w-verdict.is-idle { opacity: 0.45; }

.lc1w-phasetext {
  fill: var(--lc1w-muted, #657168);
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
const STR_Y = 96
const CH_W = 52
const CH_H = 28
const CH_GAP = 10
const GRID_LABEL_Y = 186
const GRID_Y = 196
const G_CELL = 24
const G_COLW = 30
const VERDICT_LABEL_Y = 362
const VERDICT_Y = 372
const VERDICT_W = 240
const VERDICT_H = 60
const PHASE_Y = 456
const H = 474

export function mountLcs1Walk(host, options = {}) {
  if (!host || host.dataset.lc1wMounted === '1') return { destroy() {} }
  host.dataset.lc1wMounted = '1'
  ensureStyles()

  const steps = buildLcs1WalkSteps(options)
  const s0 = steps[0]
  const { s, t, n, m } = s0

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg lc1w__svg',
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    'aria-label': '公共连续子串两条走位路径对照：正确路径与错误配额重复消耗的错法',
  })
  const cellLayer = mk('g', { class: 'lc1w-cells' })
  const markLayer = mk('g', { class: 'lc1w-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer) // 标记层后挂 = 永远压在图形上（坑 K）

  const note = mk('text', { class: 'lc1w-note', x: 30, y: NOTE_Y })
  note.textContent = `s = ${s} · t = ${t} · 公共连续子串只能沿对角线走，一格一格不能跳`
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'lc1w-banner__box', x: 30, y: BANNER_Y, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segPhase = mk('text', { class: 'lc1w-banner__seg', x: 46, y: BANNER_Y + BANNER_H / 2 })
  const segAct = mk('text', { class: 'lc1w-banner__seg', x: 200, y: BANNER_Y + BANNER_H / 2 })
  const segVal = mk('text', { class: 'lc1w-banner__val', x: W - 46, y: BANNER_Y + BANNER_H / 2 })
  markLayer.append(segPhase, segAct, segVal)

  // ── 字符条 ──
  const strW = n * CH_W + (n - 1) * CH_GAP
  const strLeft = (W - strW) / 2
  const charEls = []
  for (let row = 0; row < 2; row += 1) {
    const str = row === 0 ? s : t
    const y = STR_Y + row * (CH_H + CH_GAP)
    const label = mk('text', { class: 'lc1w-slabel', x: strLeft - 10, y: y + CH_H / 2 })
    label.textContent = row === 0 ? 's' : 't'
    markLayer.appendChild(label)
    for (let i = 0; i < n; i += 1) {
      const x = strLeft + i * (CH_W + CH_GAP)
      const g = mk('g', { class: `lc1w-ch ${row === 0 ? 'is-s' : 'is-t'}` })
      g.appendChild(
        mk('rect', { class: 'lc1w-ch__box', x, y, width: CH_W, height: CH_H, rx: 6 }),
      )
      const v = mk('text', { class: 'lc1w-ch__v', x: x + CH_W / 2, y: y + CH_H / 2 })
      v.textContent = str[i]
      g.appendChild(v)
      cellLayer.appendChild(g)
      charEls.push({ g, row, i })
    }
  }

  // ── 走位迷你网格（行 = s，列 = t） ──
  const gridLabel = mk('text', { class: 'lc1w-grid-label', x: 30, y: GRID_LABEL_Y })
  gridLabel.textContent = '走过的格（行 = s，列 = t）：绿 = 正解 · 红 = 错法'
  markLayer.appendChild(gridLabel)

  const gridW = m * G_COLW
  const gridLeft = (W - gridW) / 2
  const gridEls = []
  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j <= m; j += 1) {
      const x = gridLeft + (j - 1) * G_COLW
      const y = GRID_Y + (i - 1) * G_CELL
      const g = mk('g', { class: 'lc1w-g is-off' })
      g.appendChild(
        mk('rect', { class: 'lc1w-g__box', x, y, width: G_COLW - 5, height: G_CELL - 4, rx: 4 }),
      )
      const v = mk('text', { class: 'lc1w-g__v', x: x + (G_COLW - 5) / 2, y: y + (G_CELL - 4) / 2 })
      g.appendChild(v)
      cellLayer.appendChild(g)
      gridEls.push({ g, v, i, j })
    }
  }

  // ── 结论对照 ──
  const verdictLabel = mk('text', { class: 'lc1w-verdict__label', x: W / 2, y: VERDICT_LABEL_Y })
  verdictLabel.textContent = '收尾对照'
  markLayer.appendChild(verdictLabel)

  const vLeft = Math.floor((W - VERDICT_W * 2 - 40) / 2)
  const makeVerdict = (x, label) => {
    const g = mk('g', { class: 'lc1w-verdict is-idle' })
    g.appendChild(
      mk('rect', { class: 'lc1w-verdict__box', x, y: VERDICT_Y, width: VERDICT_W, height: VERDICT_H, rx: 9 }),
    )
    const l = mk('text', { class: 'lc1w-verdict__label', x: x + VERDICT_W / 2, y: VERDICT_Y + 17 })
    l.textContent = label
    const m = mk('text', { class: 'lc1w-verdict__main', x: x + VERDICT_W / 2, y: VERDICT_Y + 40 })
    g.append(l, m)
    cellLayer.appendChild(g)
    return { g, m }
  }
  const vOk = makeVerdict(vLeft, '正解（额度从 f 接）')
  const vBug = makeVerdict(vLeft + VERDICT_W + 40, '错法（额度从 g 接）')

  const phaseText = mk('text', { class: 'lc1w-phasetext', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  // done 帧要同时展示两条路径：从步序列里各取最后一步的累积 cells
  const okPathAll = steps.filter((x) => x.phase === 'walk' && x.path === 'ok').map((x) => x.cells[x.cells.length - 1])
  const bugPathAll = steps.filter((x) => x.phase === 'walk' && x.path === 'bug').map((x) => x.cells[x.cells.length - 1])

  function paint(_index, step) {
    if (!step) return
    const path = step.path // 'ok' | 'bug' | null
    const cells = step.cells || []
    const showBoth = step.phase === 'done'

    // 字符条：按路径实际下标点亮（正解路径 i = j + 1，所以 s 起点比 t 晚一格）
    charEls.forEach(({ g, row, i }) => {
      const cls = ['lc1w-ch', row === 0 ? 'is-s' : 'is-t']
      if (path === null) {
        cls.push(showBoth ? 'is-rest' : 'is-off')
        g.setAttribute('class', cls.join(' '))
        return
      }
      const hit = cells.some(([ci, cj]) => (row === 0 ? ci - 1 : cj - 1) === i)
      if (hit) cls.push(path === 'ok' ? 'is-ok' : 'is-bug')
      else cls.push('is-rest')
      g.setAttribute('class', cls.join(' '))
    })

    // 迷你网格：done 帧同时画两条路径
    gridEls.forEach(({ g, v, i, j }) => {
      const hitOk = cells.find(([ci, cj]) => ci === i && cj === j)
      const allOk = showBoth ? okPathAll.find(([ci, cj]) => ci === i && cj === j) : null
      const hitBug = cells.find(([ci, cj]) => ci === i && cj === j)
      const allBug = showBoth ? bugPathAll.find(([ci, cj]) => ci === i && cj === j) : null
      let cls = 'lc1w-g'
      let val = ''
      if (path === 'ok') {
        if (hitOk) {
          cls += ' is-ok'
          val = String(hitOk[2])
        } else cls += ' is-off'
      } else if (path === 'bug') {
        if (hitBug) {
          cls += ' is-bug'
          val = String(hitBug[2])
        } else cls += ' is-off'
      } else if (showBoth) {
        if (allOk) {
          cls += ' is-ok'
          val = String(allOk[2])
        } else if (allBug) {
          cls += ' is-bug'
          val = String(allBug[2])
        } else cls += ' is-off'
      } else cls += ' is-off'
      g.setAttribute('class', cls)
      v.textContent = val
    })

    // 结论：走完对应路径就点亮；走位途中显示当前累计最大值，done 才给终值
    const okDone = path === 'ok' || step.phase === 'done'
    const bugDone = path === 'bug' || step.phase === 'done'
    const maxSoFar = (list) => (list.length ? Math.max(...list.map((c) => c[2])) : 0)
    vOk.g.setAttribute('class', `lc1w-verdict ${okDone ? 'is-ok' : 'is-idle'}`)
    vOk.m.textContent = okDone
      ? String(showBoth || path === 'bug' ? step.bestOk : maxSoFar(cells))
      : '?'
    vBug.g.setAttribute('class', `lc1w-verdict ${bugDone ? 'is-bug' : 'is-idle'}`)
    vBug.m.textContent = bugDone
      ? String(showBoth || path === 'ok' ? step.bestBug : maxSoFar(cells))
      : '?'

    // 横幅
    if (step.phase === 'init') {
      segPhase.textContent = '准备'
      segAct.textContent = '两条路径，一条对一条错'
      segVal.textContent = ''
      segVal.setAttribute('class', 'lc1w-banner__val')
    } else if (step.phase === 'done') {
      segPhase.textContent = '对照收尾'
      segAct.textContent = `正解 ${step.bestOk} vs 错法 ${step.bestBug}`
      segVal.textContent = `差 ${step.bestBug - step.bestOk}`
      segVal.setAttribute('class', 'lc1w-banner__val is-bug')
    } else {
      const isOk = path === 'ok'
      segPhase.textContent = isOk ? '正解路径（次对角线）' : '错法路径（主对角线）'
      segAct.textContent = `(${step.i}, ${step.j}) '${step.charS}' vs '${step.charT}'`
      segVal.textContent = `g = ${step.value}`
      segVal.setAttribute('class', `lc1w-banner__val ${isOk ? 'is-ok' : 'is-bug'}`)
    }

    phaseText.textContent =
      step.phase === 'init'
        ? '正解只从干净的 f 接过错误额度；错法让同一个字符反复消耗额度，答案一路虚涨。'
        : step.phase === 'done'
          ? `正解 ${step.bestOk} 对应 "bcdef"（0 处错）；错法 ${step.bestBug} 把 6 个不等位置当成一次错误串了起来。`
          : ''

    renderRichText(descEl, step.desc)
  }

  const descEl = makeDesc()
  const rootEl = document.createElement('div')
  rootEl.className = 'viz lc1w'
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
      delete host.dataset.lc1wMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
