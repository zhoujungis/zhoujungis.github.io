/**
 * lc1928.js — 「规定时间内到达终点的最小花费」(LC 1928) 主视角的 SVG 渲染层。
 *
 * 布局：上方 = **分层图**表格（行 = 时刻 t，列 = 城市 v，格 = `dp[t][v]`；
 * 行头右对齐写 `t=k`，列头写城市号 + 它的通行费，终点列垫一条竖带）；
 * 每帧一条 relax 从源格 `(t,v)` 拉一条虚线箭头到目标格 `(t+et, u)`；
 * 下方 = 转移横幅 + 统计面板（t / v→u / from→cand / 已剪枝 / 答案）+ 状态行。
 *
 * 当前最优格 `dp[bestT][target]` 套一枚金环；done 帧把回溯出的状态链整条点亮。
 *
 * 与 editDistance.js 的骨架一致（二维 DP 表逐格点亮那一类）：
 * 模块级 STYLE_ID + ensureStyles()，dataset 幂等守卫，createPlayer + jumpTo，
 * IntersectionObserver 自动播放。
 */

import { buildLc1928Steps } from './lc1928Steps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'lc1928-styles'
const PLAY_MS = 1000

const W = 680
const LBL_X = 62
const NOTE_Y = 22
const HD1_Y = 52
const HD2_Y = 66
const GRID_Y = 76
const CH = 38
const RGAP = 8
const CGAP = 8
const BANNER_H = 44
const PANEL_H = 58

const STYLES = `
.lv8 { display: flex; flex-direction: column; gap: 14px; }
.lv8__svg { width: 100%; height: auto; display: block; }

.lv8-note {
  fill: var(--lv8-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-note--r { text-anchor: end; }

.lv8-lbl {
  fill: var(--lv8-muted, #657168); font-size: 11.5px;
  text-anchor: end; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-corner {
  fill: var(--lv8-dim, #9aa39c); font-size: 10.5px;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-hd1 {
  fill: var(--lv8-ink, #1f2a24); font-size: 14px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-hd2 {
  fill: var(--lv8-dim, #9aa39c); font-size: 10px;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-hd1.is-tgt { fill: var(--lv8-gold, #c2872f); }
.lv8-hd2.is-tgt { fill: var(--lv8-gold, #c2872f); }

.lv8-band { fill: var(--lv8-gold-fill, #fdf3e3); opacity: 0.62; }

.lv8-cell__box {
  fill: var(--lv8-fill, #ffffff);
  stroke: var(--lv8-line, #c3c9c2);
  stroke-width: 1.5;
}
.lv8-cell__val {
  fill: var(--lv8-ink, #1f2a24);
  font-weight: 700; text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 还没到达的格子：虚线 + 灰 ∞ */
.lv8-cell.is-inf .lv8-cell__box {
  fill: var(--lv8-dim-fill, #f6f5f1);
  stroke-dasharray: 4 3;
}
.lv8-cell.is-inf .lv8-cell__val { fill: var(--lv8-dim, #9aa39c); font-weight: 500; }
/* 已到达：白底实值 */
.lv8-cell.is-val .lv8-cell__box { fill: var(--lv8-ok-fill, #eef5f1); stroke: var(--lv8-ok, #3f6b57); }
.lv8-cell.is-val .lv8-cell__val { fill: var(--lv8-ok, #3f6b57); }
/* 底座 dp[0][0] */
.lv8-cell.is-base .lv8-cell__box { stroke: var(--lv8-gold, #c2872f); stroke-width: 3; }
/* 本帧的源格 */
.lv8-cell.is-cur .lv8-cell__box { stroke: var(--lv8-hot, #a45f45); stroke-width: 3.4; }
/* 本帧刷新的目标格 */
.lv8-cell.is-fresh .lv8-cell__box {
  fill: var(--lv8-gold-fill, #fdf3e3);
  stroke: var(--lv8-gold, #c2872f);
  stroke-width: 3.4;
}
.lv8-cell.is-fresh .lv8-cell__val { fill: var(--lv8-gold, #c2872f); }
/* 本帧看了但没改进的目标格 */
.lv8-cell.is-dup .lv8-cell__box { stroke: var(--lv8-hot, #a45f45); stroke-width: 2.4; stroke-dasharray: 4 3; }
/* done 帧回溯出的最优链 */
.lv8-cell.is-chain .lv8-cell__box { fill: var(--lv8-gold-fill, #fdf3e3); stroke: var(--lv8-gold, #c2872f); stroke-width: 2.4; }
.lv8-cell.is-chain .lv8-cell__val { fill: var(--lv8-gold, #c2872f); }

.lv8-edge__line {
  stroke: var(--lv8-hot, #a45f45); stroke-width: 2; fill: none;
  stroke-dasharray: 5 4;
}
.lv8-edge__head { fill: var(--lv8-hot, #a45f45); }

.lv8-ring {
  fill: none; stroke: var(--lv8-gold, #c2872f); stroke-width: 2.4;
  stroke-dasharray: 5 4; opacity: 0;
}
.lv8-ring.is-on { opacity: 1; }

.lv8-banner__box {
  fill: var(--lv8-banner, #f4f3ef);
  stroke: var(--lv8-line, #c3c9c2);
  stroke-width: 1.5;
}
.lv8-banner__text {
  fill: var(--lv8-hot, #a45f45); font-size: 13.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-banner__text.is-ok { fill: var(--lv8-ok, #3f6b57); }
.lv8-banner__text.is-gold { fill: var(--lv8-gold, #c2872f); }

.lv8-panel__box {
  fill: var(--lv8-fill, #ffffff);
  stroke: var(--lv8-line, #c3c9c2);
  stroke-width: 1.5;
}
.lv8-panel__label {
  fill: var(--lv8-muted, #657168); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-panel__num {
  fill: var(--lv8-ink, #1f2a24); font-size: 16px; font-weight: 800; text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8-panel__num.is-gold { fill: var(--lv8-gold, #c2872f); }
.lv8-panel__num.is-ok { fill: var(--lv8-ok, #3f6b57); }
.lv8-panel__num.is-dead { fill: var(--lv8-dim, #9aa39c); }

.lv8-phase__text {
  fill: var(--lv8-muted, #657168); font-size: 13px; font-weight: 600;
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

const fmt = (v) => (v === Infinity ? '∞' : String(v))

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{ fees?: number[], edges?: number[][], maxTime?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountLc1928(host, options = {}) {
  if (!host || host.dataset.lc1928Mounted === '1') return { destroy() {} }
  host.dataset.lc1928Mounted = '1'
  ensureStyles()

  const steps = buildLc1928Steps(options)
  const s0 = steps[0]
  const { n, maxTime, fees, target } = s0
  const rows = maxTime + 1

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz lv8'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  // ── 版面参数 ──
  const gridAvail = W - LBL_X - 26
  const cw = Math.min(84, Math.floor((gridAvail - (n - 1) * CGAP) / n))
  const rowW = n * cw + (n - 1) * CGAP
  const gx0 = LBL_X + (gridAvail - rowW) / 2
  const colX = (v) => gx0 + v * (cw + CGAP)
  const rowY = (t) => GRID_Y + t * (CH + RGAP)
  const gridH = rows * CH + (rows - 1) * RGAP
  const gridBottom = GRID_Y + gridH
  const BANNER_Y = gridBottom + 16
  const PANEL_Y = BANNER_Y + BANNER_H + 14
  const PHASE_Y = PANEL_Y + PANEL_H + 18
  const height = PHASE_Y + 22
  const valFont = Math.max(10, Math.min(16, Math.round(cw / 7.2)))

  const svgRoot = mk('svg', {
    class: 'viz__svg lv8__svg',
    viewBox: `0 0 ${W} ${height}`,
    role: 'img',
    'aria-label': '规定时间内到达终点的最小花费 LC1928 分层图推演动画',
  })

  const bandLayer = mk('g', {})
  const cellLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(bandLayer, cellLayer, markLayer)
  stage.appendChild(svgRoot)

  const note = mk('text', { class: 'lv8-note', x: 26, y: NOTE_Y })
  note.textContent = 'dp[t][v] = 恰好在时刻 t 到达城市 v 的最小通行费'
  markLayer.appendChild(note)
  const goal = mk('text', { class: 'lv8-note lv8-note--r', x: W - 26, y: NOTE_Y })
  goal.textContent = `${n} 座城市 · maxTime = ${maxTime}`
  markLayer.appendChild(goal)

  // ── 终点列竖带 ──
  bandLayer.appendChild(
    mk('rect', {
      class: 'lv8-band',
      x: colX(target) - 3,
      y: GRID_Y - 4,
      width: cw + 6,
      height: gridH + 8,
      rx: 9,
    }),
  )

  // ── 列头：城市号 + 通行费 ──
  const corner = mk('text', { class: 'lv8-corner', x: LBL_X - 16, y: HD1_Y })
  corner.textContent = 't \\ v'
  markLayer.appendChild(corner)
  for (let v = 0; v < n; v += 1) {
    const isTgt = v === target
    const h1 = mk('text', { class: `lv8-hd1${isTgt ? ' is-tgt' : ''}`, x: colX(v) + cw / 2, y: HD1_Y })
    h1.textContent = `城市 ${v}`
    const h2 = mk('text', { class: `lv8-hd2${isTgt ? ' is-tgt' : ''}`, x: colX(v) + cw / 2, y: HD2_Y })
    h2.textContent = `费 ${fees[v]}`
    markLayer.append(h1, h2)
  }

  // ── 行头：t = k ──
  for (let t = 0; t < rows; t += 1) {
    const lbl = mk('text', { class: 'lv8-lbl', x: LBL_X, y: rowY(t) + CH / 2 })
    lbl.textContent = `t = ${t}`
    markLayer.appendChild(lbl)
  }

  // ── 单元格 ──
  const cells = []
  for (let t = 0; t < rows; t += 1) {
    const row = []
    for (let v = 0; v < n; v += 1) {
      const g = mk('g', { class: 'lv8-cell' })
      g.appendChild(
        mk('rect', { class: 'lv8-cell__box', x: colX(v), y: rowY(t), width: cw, height: CH, rx: 6 }),
      )
      const val = mk('text', {
        class: 'lv8-cell__val',
        x: colX(v) + cw / 2,
        y: rowY(t) + CH / 2,
        style: `font-size: ${valFont}px`,
      })
      g.appendChild(val)
      cellLayer.appendChild(g)
      row.push({ g, val })
    }
    cells.push(row)
  }

  // ── 转移箭头 ──
  const edgeG = mk('g', {})
  const edgePath = mk('path', { class: 'lv8-edge__line', d: '' })
  const edgeHead = mk('polygon', { class: 'lv8-edge__head', points: '' })
  edgeG.append(edgePath, edgeHead)
  edgeG.style.display = 'none'
  markLayer.appendChild(edgeG)

  // ── 金环（当前最优格） ──
  const ring = mk('rect', {
    class: 'lv8-ring',
    x: 0,
    y: 0,
    width: cw + 10,
    height: CH + 10,
    rx: 9,
  })
  markLayer.appendChild(ring)

  // ── 横幅 ──
  markLayer.appendChild(
    mk('rect', { class: 'lv8-banner__box', x: 26, y: BANNER_Y, width: W - 52, height: BANNER_H, rx: 9 }),
  )
  const banner = mk('text', { class: 'lv8-banner__text', x: W / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  // ── 统计面板 ──
  markLayer.appendChild(
    mk('rect', { class: 'lv8-panel__box', x: 26, y: PANEL_Y, width: W - 52, height: PANEL_H, rx: 9 }),
  )
  const STAT_N = 5
  const mkStat = (label, k) => {
    const cx = W / 2 + (k - (STAT_N - 1) / 2) * 116
    const l = mk('text', { class: 'lv8-panel__label', x: cx, y: PANEL_Y + 16 })
    l.textContent = label
    const v = mk('text', { class: 'lv8-panel__num', x: cx, y: PANEL_Y + 40 })
    markLayer.append(l, v)
    return v
  }
  const tNum = mkStat('t', 0)
  const vNum = mkStat('v → u', 1)
  const candNum = mkStat('from → cand', 2)
  const cutNum = mkStat('已剪枝', 3)
  const ansNum = mkStat('答案', 4)

  const phaseText = mk('text', { class: 'lv8-phase__text', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const { phase, dp, t, v, u, arr, from, cand, improved, cutCount, best, bestT, answer, chain } = step
    const isRelax = phase === 'relax'
    const isDone = phase === 'done'
    const chainSet = new Set((isDone ? chain : []).map((s) => `${s.t}:${s.v}`))

    // 单元格
    cells.forEach((row, r) => {
      row.forEach((el, c) => {
        const value = dp[r][c]
        const cls = ['lv8-cell']
        if (value === Infinity) cls.push('is-inf')
        else cls.push('is-val')
        if (r === 0 && c === 0) cls.push('is-base')
        if (isRelax && r === t && c === v) cls.push('is-cur')
        if (isRelax && r === arr && c === u) cls.push(improved ? 'is-fresh' : 'is-dup')
        if (chainSet.has(`${r}:${c}`)) cls.push('is-chain')
        el.g.setAttribute('class', cls.join(' '))
        el.val.textContent = fmt(value)
      })
    })

    // 转移箭头：从源格底边中心 → 目标格顶边中心
    if (isRelax) {
      const sx = colX(v) + cw / 2
      const sy = rowY(t) + CH
      const tx = colX(u) + cw / 2
      const ty = rowY(arr) - 1
      const dy = ty - sy
      edgePath.setAttribute(
        'd',
        `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${sx.toFixed(1)} ${(sy + dy * 0.45).toFixed(1)}, ` +
          `${tx.toFixed(1)} ${(ty - dy * 0.45).toFixed(1)}, ${tx.toFixed(1)} ${(ty - 9).toFixed(1)}`,
      )
      edgeHead.setAttribute(
        'points',
        `${tx.toFixed(1)},${ty.toFixed(1)} ${(tx - 5.5).toFixed(1)},${(ty - 9).toFixed(1)} ${(tx + 5.5).toFixed(1)},${(ty - 9).toFixed(1)}`,
      )
      edgeG.style.display = ''
    } else {
      edgeG.style.display = 'none'
    }

    // 金环：跟随当前最优格
    if (bestT >= 0 && dp[bestT][target] !== Infinity) {
      ring.setAttribute('x', String(colX(target) - 5))
      ring.setAttribute('y', String(rowY(bestT) - 5))
      ring.setAttribute('class', 'lv8-ring is-on')
    } else {
      ring.setAttribute('class', 'lv8-ring')
    }

    // 横幅
    if (isRelax) {
      banner.textContent =
        `dp[${arr}][${u}] = min( dp[${arr}][${u}] , dp[${t}][${v}] + fees[${u}] ) = ` +
        `min( ${step.old === Infinity ? '∞' : step.old} , ${from} + ${fees[u]} ) = ${fmt(dp[arr][u])}`
      banner.setAttribute('class', 'lv8-banner__text' + (improved ? ' is-gold' : ''))
    } else if (isDone) {
      banner.textContent =
        answer === -1
          ? `答案 -1：t ≤ ${maxTime} 内 dp[t][${target}] 始终是 ∞`
          : `答案 = ${answer}：dp[${bestT}][${target}] = ${answer}（t ≤ ${maxTime} 中的最小值）`
      banner.setAttribute('class', 'lv8-banner__text' + (answer === -1 ? '' : ' is-ok'))
    } else {
      banner.textContent = `dp[0][0] = fees[0] = ${fees[0]}，其余全是 ∞　→ 按 t 正序逐层松弛所有边`
      banner.setAttribute('class', 'lv8-banner__text')
    }

    // 面板
    tNum.textContent = isRelax ? String(t) : isDone ? '—' : '0'
    tNum.setAttribute('class', 'lv8-panel__num')
    vNum.textContent = isRelax ? `${v} → ${u}` : '—'
    vNum.setAttribute('class', 'lv8-panel__num')
    candNum.textContent = isRelax ? `${from} → ${cand}` : '—'
    candNum.setAttribute('class', 'lv8-panel__num' + (isRelax ? ' is-gold' : ''))
    cutNum.textContent = String(cutCount)
    cutNum.setAttribute('class', 'lv8-panel__num' + (cutCount > 0 ? ' is-dead' : ''))
    ansNum.textContent = String(answer)
    ansNum.setAttribute(
      'class',
      'lv8-panel__num' + (isDone ? (answer === -1 ? ' is-dead' : ' is-ok') : best === Infinity ? ' is-dead' : ''),
    )

    // 状态行
    if (phase === 'init') {
      phaseText.textContent = '底座只有一格：dp[0][0] = fees[0]（起点也要付自己的通行费）'
    } else if (isRelax) {
      phaseText.textContent = improved
        ? `更便宜 → 刷新 dp[${arr}][${u}] = ${cand}${u === target ? '，并把答案压到 ' + best : ''}`
        : `这一趟更晚也更贵（${cand} ≥ ${step.old === Infinity ? '∞' : step.old}），作废，格子保持原值`
    } else if (answer === -1) {
      phaseText.textContent = '时间窗内到不了终点 —— 不是"最贵"，是"无解"，返回 -1'
    } else {
      phaseText.textContent = '答案不在 dp[0][n-1]，而是 min over t ≤ maxTime of dp[t][n-1]'
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
      delete host.dataset.lc1928Mounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
