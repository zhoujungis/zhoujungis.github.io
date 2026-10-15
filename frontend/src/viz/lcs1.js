/**
 * lcs1.js — 「允许一个错误的最长公共连续子序列」的 SVG 渲染层：双状态 DP 表格。
 *
 * 对应文章里的「动画一」：占位符 algo-viz--lcs1。
 * 视觉分四段：
 *   1. 顶部横幅：阶段 / 动作 / 当前最大 best
 *   2. 两串字符条（与表格列对齐）
 *   3. DP 表格：每格大数字 = g（至多一处错），左上角小数字 = f（全程相等）；
 *      当前行高亮、当前讲解格烫金、mismatch 格描红
 *   4. 转移规则面板 + 底部结论行
 *
 * 通用坑：A（CSS 变量字面量兜底）/ K（标记层后挂）/ X（横幅多段固定偏移）。
 */

import { buildLcs1Steps } from './lcs1Steps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'lc1-styles'
const PLAY_MS = 1300

const STYLES = `
.lc1 { display: flex; flex-direction: column; gap: 14px; }
.lc1__svg { width: 100%; height: auto; display: block; }

.lc1-note {
  fill: var(--lc1-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-banner__box {
  fill: var(--lc1-banner, #f4f3ef);
  stroke: var(--lc1-line, #c3c9c2);
  stroke-width: 1.5;
}
.lc1-banner__seg {
  fill: var(--lc1-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-banner__val {
  fill: var(--lc1-gold, #c2872f);
  font-size: 16px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 字符条 ---- */
.lc1-ch__box {
  fill: var(--lc1-fill, #ffffff);
  stroke: var(--lc1-line, #c3c9c2);
  stroke-width: 1.3;
}
.lc1-ch__v {
  fill: var(--lc1-ink, #1f2a24);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1-ch.is-s .lc1-ch__box { stroke: var(--lc1-hi, #3d6a8f); }
.lc1-ch.is-s .lc1-ch__v { fill: var(--lc1-hi, #3d6a8f); }
.lc1-ch.is-t .lc1-ch__box { stroke: var(--lc1-low, #3f6b57); }
.lc1-ch.is-t .lc1-ch__v { fill: var(--lc1-low, #3f6b57); }
.lc1-ch.is-cur .lc1-ch__box {
  fill: var(--lc1-cur-fill, #f8ece5);
  stroke: var(--lc1-cur, #a45f45);
  stroke-width: 2.6;
}
.lc1-ch.is-cur .lc1-ch__v { fill: var(--lc1-cur, #a45f45); }
.lc1-slabel {
  fill: var(--lc1-dim, #9aa39c);
  font-size: 11px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- DP 表格 ---- */
.lc1-cell__box {
  fill: var(--lc1-fill, #ffffff);
  stroke: var(--lc1-line, #c3c9c2);
  stroke-width: 1.1;
}
.lc1-cell__g {
  fill: var(--lc1-dim, #9aa39c);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1-cell__f {
  fill: var(--lc1-line, #c3c9c2);
  font-size: 9.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1-cell.is-filled .lc1-cell__g { fill: var(--lc1-ink, #1f2a24); }
.lc1-cell.is-filled .lc1-cell__f { fill: var(--lc1-muted, #657168); }
/* 顺序即优先级：is-row（当前行浅底） < is-best（最优格绿） < is-cur（讲解格金） */
.lc1-cell.is-row .lc1-cell__box { fill: var(--lc1-banner, #f4f3ef); }
.lc1-cell.is-best .lc1-cell__box {
  fill: var(--lc1-green-fill, #eaf3ee);
  stroke: var(--lc1-green, #3f6b57);
  stroke-width: 1.8;
}
.lc1-cell.is-best .lc1-cell__g { fill: var(--lc1-green, #3f6b57); }
.lc1-cell.is-cur .lc1-cell__box {
  fill: var(--lc1-gold-fill, #fdf3e3);
  stroke: var(--lc1-gold, #c2872f);
  stroke-width: 2.8;
}
.lc1-cell.is-cur .lc1-cell__g { fill: var(--lc1-gold, #c2872f); font-size: 17px; }
.lc1-cell.is-off .lc1-cell__box { stroke-dasharray: 2 3; }

.lc1-head {
  fill: var(--lc1-muted, #657168);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lc1-legend {
  fill: var(--lc1-muted, #657168);
  font-size: 11px;
  text-anchor: start;
  dominant-baseline: central;
}

/* ---- 规则面板 ---- */
.lc1-rule__box {
  fill: var(--lc1-fill, #ffffff);
  stroke: var(--lc1-line, #c3c9c2);
  stroke-width: 1.4;
}
.lc1-rule.is-on .lc1-rule__box {
  fill: var(--lc1-gold-fill, #fdf3e3);
  stroke: var(--lc1-gold, #c2872f);
  stroke-width: 2.4;
}
.lc1-rule__head {
  fill: var(--lc1-muted, #657168);
  font-size: 11.5px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-rule.is-on .lc1-rule__head { fill: var(--lc1-gold, #c2872f); font-weight: 700; }
.lc1-rule__eq {
  fill: var(--lc1-ink, #1f2a24);
  font-size: 13px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-rule__warn {
  fill: var(--lc1-red, #b3452f);
  font-size: 12px;
  text-anchor: start;
  dominant-baseline: central;
}
.lc1-rule__warn.is-off { opacity: 0; }

.lc1-phasetext {
  fill: var(--lc1-muted, #657168);
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
const STR_Y = 100
const CH_H = 26
const CH_GAP = 8
const HEAD_Y = 150
const HEAD_H = 22
const TABLE_Y = 172
const CELL_W = 72
const CELL_H = 32
const RULE_Y = 396
const RULE_H = 62
const PHASE_Y = 484
const H = 502

export function mountLcs1(host, options = {}) {
  if (!host || host.dataset.lc1Mounted === '1') return { destroy() {} }
  host.dataset.lc1Mounted = '1'
  ensureStyles()

  const steps = buildLcs1Steps(options)
  const s0 = steps[0]
  const { s, t, n, m } = s0

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg lc1__svg',
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    'aria-label': '允许一处错误的最长公共连续子串：双状态 DP 动画',
  })
  const cellLayer = mk('g', { class: 'lc1-cells' })
  const markLayer = mk('g', { class: 'lc1-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer) // 标记层后挂 = 永远压在图形上（坑 K）

  const note = mk('text', { class: 'lc1-note', x: 30, y: NOTE_Y })
  note.textContent = `s = ${s} · t = ${t} · 大数字 = g（至多一处不等） · 左上小数字 = f（全程相等）`
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'lc1-banner__box', x: 30, y: BANNER_Y, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segPhase = mk('text', { class: 'lc1-banner__seg', x: 46, y: BANNER_Y + BANNER_H / 2 })
  const segAct = mk('text', { class: 'lc1-banner__seg', x: 190, y: BANNER_Y + BANNER_H / 2 })
  const segVal = mk('text', { class: 'lc1-banner__val', x: W - 46, y: BANNER_Y + BANNER_H / 2 })
  markLayer.append(segPhase, segAct, segVal)

  // ── 字符条（与表格列对齐） ──
  const tableW = CELL_W * (m + 1)
  const tableLeft = (W - tableW) / 2
  const colX = (j) => tableLeft + j * CELL_W

  const sLabel = mk('text', { class: 'lc1-slabel', x: tableLeft - 8, y: STR_Y + CH_H / 2 })
  sLabel.textContent = 's'
  const tLabel = mk('text', { class: 'lc1-slabel', x: tableLeft - 8, y: STR_Y + CH_H + CH_GAP + CH_H / 2 })
  tLabel.textContent = 't'
  markLayer.append(sLabel, tLabel)

  const charEls = []
  for (let j = 1; j <= m; j += 1) {
    for (const [row, str, cls] of [
      [0, s, 'is-s'],
      [1, t, 'is-t'],
    ]) {
      const y = STR_Y + row * (CH_H + CH_GAP)
      const g = mk('g', { class: `lc1-ch ${cls}` })
      g.appendChild(
        mk('rect', {
          class: 'lc1-ch__box',
          x: colX(j) + 8,
          y,
          width: CELL_W - 16,
          height: CH_H,
          rx: 6,
        }),
      )
      const v = mk('text', { class: 'lc1-ch__v', x: colX(j) + CELL_W / 2, y: y + CH_H / 2 })
      v.textContent = str[j - 1]
      g.appendChild(v)
      cellLayer.appendChild(g)
      charEls.push({ g, j, row })
    }
  }

  // ── 表头 ──
  for (let j = 1; j <= m; j += 1) {
    const hd = mk('text', { class: 'lc1-head', x: colX(j) + CELL_W / 2, y: HEAD_Y + HEAD_H / 2 })
    hd.textContent = `t${j - 1}`
    markLayer.appendChild(hd)
  }

  // ── DP 表格 ──
  const cellEls = []
  for (let i = 1; i <= n; i += 1) {
    const y = TABLE_Y + (i - 1) * CELL_H
    const rowLabel = mk('text', { class: 'lc1-head', x: tableLeft - 8, y: y + CELL_H / 2 })
    rowLabel.textContent = `s${i - 1}`
    markLayer.appendChild(rowLabel)
    for (let j = 1; j <= m; j += 1) {
      const x = colX(j)
      const g = mk('g', { class: 'lc1-cell is-off' })
      g.appendChild(
        mk('rect', { class: 'lc1-cell__box', x, y, width: CELL_W, height: CELL_H, rx: 5 }),
      )
      const gv = mk('text', { class: 'lc1-cell__g', x: x + CELL_W / 2, y: y + CELL_H / 2 + 1 })
      const fv = mk('text', { class: 'lc1-cell__f', x: x + 5, y: y + 10 })
      g.append(gv, fv)
      cellLayer.appendChild(g)
      cellEls.push({ g, gv, fv, i, j })
    }
  }

  // ── 规则面板 ──
  const ruleG = mk('g', { class: 'lc1-rule' })
  ruleG.appendChild(
    mk('rect', { class: 'lc1-rule__box', x: 30, y: RULE_Y, width: W - 60, height: RULE_H, rx: 9 }),
  )
  const ruleHead = mk('text', { class: 'lc1-rule__head', x: 48, y: RULE_Y + 17 })
  const ruleEq = mk('text', { class: 'lc1-rule__eq', x: 48, y: RULE_Y + 37 })
  const ruleWarn = mk('text', { class: 'lc1-rule__warn', x: 48, y: RULE_Y + 53 })
  ruleG.append(ruleHead, ruleEq, ruleWarn)
  cellLayer.appendChild(ruleG)

  const phaseText = mk('text', { class: 'lc1-phasetext', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const PHASE_TEXT = {
    init: '「连续」= 子串：对齐时只能沿对角线一格一格走，不能像普通 LCS 那样跳格。',
    row: '每格算两遍：f 记干净后缀，g 记至多一处不等的后缀。答案取全表最大的 g。',
    done: '答案 = 全表最大的 g。时间 O(n × m)，滚动数组可压到 O(min(n, m)) 空间。',
  }

  function paint(_index, step) {
    if (!step) return
    const cur = step.phase === 'row' ? step.cell : null
    const curI = cur ? step.i : -1
    const curJ = cur ? cur.j : -1

    // 字符条：当前行/列的字符高亮
    charEls.forEach(({ g, j, row }) => {
      const cls = ['lc1-ch', row === 0 ? 'is-s' : 'is-t']
      if (cur && (j === curJ || (row === 0 && j === curI) || (row === 1 && j === curJ))) cls.push('is-cur')
      g.setAttribute('class', cls.join(' '))
    })

    // 表格：只填已完成的行，重算一遍保证与状态机同源
    let bestCell = null // 当前最大 g 所在格（不等于当前格时点亮）
    if (step.phase !== 'init') {
      const f = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
      const g = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
      for (let i = 1; i <= Math.min(n, step.filled); i += 1) {
        for (let j = 1; j <= m; j += 1) {
          if (s[i - 1] === t[j - 1]) {
            f[i][j] = f[i - 1][j - 1] + 1
            g[i][j] = g[i - 1][j - 1] + 1
          } else {
            f[i][j] = 0
            g[i][j] = Math.max(f[i - 1][j - 1] + 1, 1)
          }
          if (g[i][j] > 0 && (!bestCell || g[i][j] > g[bestCell[0]][bestCell[1]])) bestCell = [i, j]
        }
      }
      cellEls.forEach(({ gv, fv, i, j }) => {
        gv.textContent = String(g[i][j])
        fv.textContent = String(f[i][j])
      })
    }

    // 四层配色：未填（虚线）/ 当前行（浅底）/ 最优格（绿）/ 当前讲解格（金）
    cellEls.forEach(({ g, i, j }) => {
      const filled = i <= step.filled
      const inCurRow = curI === i
      const isCurCell = inCurRow && curJ === j
      const isBest = filled && bestCell && bestCell[0] === i && bestCell[1] === j
      const cls = ['lc1-cell']
      if (!filled) cls.push('is-off')
      else {
        cls.push('is-filled')
        if (inCurRow) cls.push('is-row')
        if (isBest) cls.push('is-best')
      }
      if (isCurCell) cls.push('is-cur')
      g.setAttribute('class', cls.join(' '))
    })

    // 规则面板
    if (cur) {
      ruleG.setAttribute('class', 'lc1-rule is-on')
      ruleHead.textContent = `第 ${step.i} 行 · 讲解格 (${step.i}, ${cur.j})：s[${step.i - 1}]=${s[step.i - 1]} 对 t[${cur.j - 1}]=${t[cur.j - 1]}`
      ruleEq.textContent = cur.equal
        ? `相等 → f = ${cur.fDiag} + 1 = ${cur.f}，g = g 左上 ${cur.gDiag} + 1 = ${cur.g}（不消耗额度）`
        : `不等 → f 断成 0，g = f 左上 ${cur.fDiag} + 1 = ${cur.g}（额度只能从 f 接）`
      const inflated = !cur.equal && cur.gDiag + 1 !== cur.g
      ruleWarn.setAttribute('class', `lc1-rule__warn ${inflated ? '' : 'is-off'}`)
      ruleWarn.textContent = inflated ? `若误用 g 左上 + 1 = ${cur.gDiag + 1}，答案虚高` : ''
    } else {
      ruleG.setAttribute('class', 'lc1-rule')
      ruleHead.textContent = step.phase === 'done' ? `全表扫完：最大 g = ${step.best}` : '转移规则'
      ruleEq.textContent =
        step.phase === 'done'
          ? '答案取全表最大的 g —— 至多一处不等的最长公共连续子串'
          : '相等：f/g 都沿对角 +1；不等：f 归 0，g = f 左上 + 1'
      ruleWarn.setAttribute('class', 'lc1-rule__warn is-off')
    }

    // 横幅 + 底部
    if (step.phase === 'init') {
      segPhase.textContent = '准备'
      segAct.textContent = '两行状态 f / g'
      segVal.textContent = `${n} × ${m}`
    } else if (step.phase === 'done') {
      segPhase.textContent = '扫完整表'
      segAct.textContent = '最大 g'
      segVal.textContent = String(step.best)
    } else {
      segPhase.textContent = `第 ${step.i} / ${n} 行`
      segAct.textContent = cur.equal ? '对角续上' : '不等 · 断 f 接 g'
      segVal.textContent = `best ${step.best}`
    }
    phaseText.textContent = PHASE_TEXT[step.phase] || ''

    renderRichText(descEl, step.desc)
  }

  const descEl = makeDesc()
  const rootEl = document.createElement('div')
  rootEl.className = 'viz lc1'
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
      delete host.dataset.lc1Mounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
