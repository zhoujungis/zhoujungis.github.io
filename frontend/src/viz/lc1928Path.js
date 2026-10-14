/**
 * lc1928Path.js — 「规定时间内到达终点的最小花费」(LC 1928) 第二视角的 SVG 渲染层。
 *
 * 同一张图、两条路的现场对照：
 *   · **只图便宜**（不看时间，橙）—— 最便宜的城市序列，可能超时作废；
 *   · **守时间窗**（最优，绿）—— 在 maxTime 内最省的那条。
 * 下方一排 chip 是 `(t, v)` 状态链：best 帧之后逐帧沿**前驱表**从终点状态
 * 往回退（cursor 递减），把链一格一格揭开 —— 路就是这么还原出来的。
 *
 * 图的布局：从城市 0 做一次 BFS 定层（hop 距离 = 列号），列内按城市号排序，
 * 于是默认那张图刚好是 col0={0} · col1={1,3} · col2={2,4} · col3={5}。
 *
 * 与 lc1928.js 骨架一致：模块级 STYLE_ID + ensureStyles()，dataset 幂等守卫，
 * createPlayer + jumpTo，IntersectionObserver 自动播放。
 */

import { buildLc1928PathSteps } from './lc1928PathSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'lc1928path-styles'
const PLAY_MS = 1150

const W = 680
const NODE_R = 26
const NOTE_Y = 22
const GRAPH_CY = 176
const CARD_Y = 288
const CARD_H = 50
const CHIP_LBL_Y = 358
const CHIP_Y = 368
const CHIP_H = 38
const BANNER_Y = 424
const BANNER_H = 44
const PHASE_Y = 502

const STYLES = `
.lv8p { display: flex; flex-direction: column; gap: 14px; }
.lv8p__svg { width: 100%; height: auto; display: block; }

.lv8p-note {
  fill: var(--lv8p-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-note--r { text-anchor: end; }
.lv8p-lbl {
  fill: var(--lv8p-muted, #657168); font-size: 11.5px;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lv8p-edge { stroke: var(--lv8p-line, #c3c9c2); stroke-width: 2; fill: none; }
.lv8p-arrow { fill: var(--lv8p-line, #c3c9c2); stroke: none; }
.lv8p-path { stroke-width: 4; fill: none; opacity: 0; stroke-linecap: round; }
.lv8p-path.is-cheap { stroke: var(--lv8p-hot, #a45f45); }
.lv8p-path.is-best { stroke: var(--lv8p-ok, #3f6b57); }
.lv8p-path.is-on { opacity: 1; }
.lv8p-wt {
  fill: var(--lv8p-muted, #657168); font-size: 10px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lv8p-node__circle { stroke: var(--lv8p-line, #b9c1b8); stroke-width: 2; fill: var(--lv8p-fill, #ffffff); }
.lv8p-node__num {
  fill: var(--lv8p-ink, #1f2a24); font-size: 17px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-node__fee {
  fill: var(--lv8p-dim, #9aa39c); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-node.is-src .lv8p-node__circle { stroke: var(--lv8p-gold, #c2872f); stroke-width: 3.5; }
.lv8p-node.is-cheap .lv8p-node__circle { fill: #f6e6e0; stroke: var(--lv8p-hot, #a45f45); stroke-width: 3; }
.lv8p-node.is-best .lv8p-node__circle { fill: var(--lv8p-ok-fill, #eef5f1); stroke: var(--lv8p-ok, #3f6b57); stroke-width: 3; }
.lv8p-node.is-tail .lv8p-node__circle { stroke: var(--lv8p-gold, #c2872f); stroke-width: 3.5; }

.lv8p-card__box {
  fill: var(--lv8p-banner, #f4f3ef); stroke: var(--lv8p-line, #c3c9c2); stroke-width: 1.5;
}
.lv8p-card.is-hot .lv8p-card__box { stroke: var(--lv8p-hot, #a45f45); stroke-width: 2.4; }
.lv8p-card.is-ok .lv8p-card__box { stroke: var(--lv8p-ok, #3f6b57); stroke-width: 2.4; }
.lv8p-card.is-dim { opacity: 0.5; }
.lv8p-card__title {
  fill: var(--lv8p-muted, #657168); font-size: 11px; font-weight: 700;
  text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-card__main {
  fill: var(--lv8p-ink, #1f2a24); font-size: 12.5px; font-weight: 700;
  text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-card__verdict {
  font-size: 12.5px; font-weight: 800; text-anchor: end; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-card__verdict.is-hot { fill: var(--lv8p-hot, #a45f45); }
.lv8p-card__verdict.is-ok { fill: var(--lv8p-ok, #3f6b57); }
.lv8p-card__verdict.is-dead { fill: var(--lv8p-dim, #9aa39c); }

.lv8p-chip__box { fill: var(--lv8p-fill, #ffffff); stroke: var(--lv8p-line, #c3c9c2); stroke-width: 1.6; }
.lv8p-chip__t {
  fill: var(--lv8p-dim, #9aa39c); font-size: 9.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-chip__v {
  fill: var(--lv8p-ink, #1f2a24); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-chip.is-revealed .lv8p-chip__box { fill: var(--lv8p-ok-fill, #eef5f1); stroke: var(--lv8p-ok, #3f6b57); }
.lv8p-chip.is-revealed .lv8p-chip__v { fill: var(--lv8p-ok, #3f6b57); }
.lv8p-chip.is-cur .lv8p-chip__box { stroke: var(--lv8p-gold, #c2872f); stroke-width: 3; }
.lv8p-chip.is-cur .lv8p-chip__v { fill: var(--lv8p-gold, #c2872f); }
.lv8p-chip.is-hidden { opacity: 0; }

.lv8p-link__line { stroke: var(--lv8p-ok, #3f6b57); stroke-width: 1.6; stroke-dasharray: 3 3; }
.lv8p-link__head { fill: var(--lv8p-ok, #3f6b57); }

.lv8p-banner__box {
  fill: var(--lv8p-banner, #f4f3ef); stroke: var(--lv8p-line, #c3c9c2); stroke-width: 1.5;
}
.lv8p-banner__text {
  fill: var(--lv8p-hot, #a45f45); font-size: 13.5px; font-weight: 700;
  text-anchor: middle; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lv8p-banner__text.is-ok { fill: var(--lv8p-ok, #3f6b57); }

.lv8p-phase__text {
  fill: var(--lv8p-muted, #657168); font-size: 13px; font-weight: 600;
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

/** BFS 分层布局：hop 距离定列号，列内按城市号排序、纵向居中。 */
function layerLayout(n, edges) {
  const adj = Array.from({ length: n }, () => [])
  for (const [x, y] of edges) {
    adj[x].push(y)
    adj[y].push(x)
  }
  const level = new Array(n).fill(-1)
  level[0] = 0
  const queue = [0]
  for (let h = 0; h < queue.length; h += 1) {
    const v = queue[h]
    for (const to of adj[v]) {
      if (level[to] === -1) {
        level[to] = level[v] + 1
        queue.push(to)
      }
    }
  }
  let maxLevel = 0
  let maxCol = 1
  const cols = new Map()
  for (let v = 0; v < n; v += 1) if (level[v] === -1) level[v] = -2
  for (let v = 0; v < n; v += 1) {
    if (level[v] >= 0 && level[v] > maxLevel) maxLevel = level[v]
  }
  for (let v = 0; v < n; v += 1) if (level[v] === -2) level[v] = maxLevel + 1
  for (let v = 0; v < n; v += 1) {
    if (!cols.has(level[v])) cols.set(level[v], [])
    cols.get(level[v]).push(v)
  }
  for (const nodes of cols.values()) maxCol = Math.max(maxCol, nodes.length)

  const colGap = Math.min(170, Math.floor((W - 140) / Math.max(1, maxLevel)))
  const rowGap = Math.min(80, Math.floor((GRAPH_CY - 40) / Math.max(1, maxCol - 1)))
  const positions = new Array(n)
  for (const [lv, nodes] of cols) {
    nodes.sort((a, b) => a - b)
    nodes.forEach((v, i) => {
      positions[v] = {
        x: W / 2 + (lv - maxLevel / 2) * colGap,
        y: GRAPH_CY + (i - (nodes.length - 1) / 2) * rowGap,
      }
    })
  }
  return positions
}

/** 圆边缘到圆边缘的直连几何（含箭头三角点串）。 */
function edgeGeometry(from, to, radius) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const x1 = from.x + ux * radius
  const y1 = from.y + uy * radius
  const x2 = to.x - ux * (radius + 1)
  const y2 = to.y - uy * (radius + 1)
  const px = -uy
  const py = ux
  const head = 9
  const bx = x2 - ux * head
  const by = y2 - uy * head
  return {
    x1,
    y1,
    x2,
    y2,
    head: `${x2.toFixed(1)},${y2.toFixed(1)} ${(bx + px * 5).toFixed(1)},${(by + py * 5).toFixed(1)} ${(bx - px * 5).toFixed(1)},${(by - py * 5).toFixed(1)}`,
  }
}

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{ fees?: number[], edges?: number[][], maxTime?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountLc1928Path(host, options = {}) {
  if (!host || host.dataset.lc1928PathMounted === '1') return { destroy() {} }
  host.dataset.lc1928PathMounted = '1'
  ensureStyles()

  const steps = buildLc1928PathSteps(options)
  const s0 = steps[0]
  const { n, maxTime, fees, edges, target } = s0

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz lv8p'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg lv8p__svg',
    viewBox: `0 0 ${W} ${height}`,
    role: 'img',
    'aria-label': '规定时间内到达终点的最小花费 LC1928 便宜路与守时路对照动画',
  })

  const edgeLayer = mk('g', {})
  const pathLayer = mk('g', {})
  const nodeLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(edgeLayer, pathLayer, nodeLayer, markLayer)
  stage.appendChild(svgRoot)

  const note = mk('text', { class: 'lv8p-note', x: 26, y: NOTE_Y })
  note.textContent = '同一张图：只图便宜的路 vs 守住 maxTime 的路 —— 便宜 ≠ 来得及'
  markLayer.appendChild(note)
  const noteR = mk('text', { class: 'lv8p-note lv8p-note--r', x: W - 26, y: NOTE_Y })
  noteR.textContent = `maxTime = ${maxTime} · 终点 = 城市 ${target}`
  markLayer.appendChild(noteR)

  const positions = layerLayout(n, edges)

  // ── 底图：所有边（边上只有时间，标出耗时） ──
  for (const [x, y, time] of edges) {
    const geo = edgeGeometry(positions[x], positions[y], NODE_R)
    edgeLayer.appendChild(mk('line', { class: 'lv8p-edge', x1: geo.x1, y1: geo.y1, x2: geo.x2, y2: geo.y2 }))
    edgeLayer.appendChild(mk('polygon', { class: 'lv8p-arrow', points: geo.head }))
    const mx = (positions[x].x + positions[y].x) / 2
    const my = (positions[x].y + positions[y].y) / 2
    const wt = mk('text', { class: 'lv8p-wt', x: mx.toFixed(1), y: (my - 7).toFixed(1) })
    wt.textContent = `${time}分`
    markLayer.appendChild(wt)
  }

  // ── 两条高亮路（叠在底边上） ──
  const pathEls = { cheap: [], best: [] }
  for (const kind of ['cheap', 'best']) {
    for (const [x, y] of edges) {
      const geo = edgeGeometry(positions[x], positions[y], NODE_R)
      const line = mk('line', {
        class: `lv8p-path is-${kind}`,
        x1: geo.x1,
        y1: geo.y1,
        x2: geo.x2,
        y2: geo.y2,
      })
      pathLayer.appendChild(line)
      pathEls[kind].push({ el: line, a: x, b: y })
    }
  }

  // ── 节点 ──
  const nodeEls = []
  for (let v = 0; v < n; v += 1) {
    const { x, y } = positions[v]
    const g = mk('g', { class: 'lv8p-node' })
    g.appendChild(mk('circle', { class: 'lv8p-node__circle', cx: x, cy: y, r: NODE_R }))
    const num = mk('text', { class: 'lv8p-node__num', x, y })
    num.textContent = String(v)
    g.appendChild(num)
    nodeLayer.appendChild(g)
    const fee = mk('text', { class: 'lv8p-node__fee', x, y: y + NODE_R + 13 })
    fee.textContent = `费 ${fees[v]}`
    markLayer.appendChild(fee)
    nodeEls.push({ g })
  }

  // ── 两张对照卡 ──
  const CARD_W = (W - 52 - 14) / 2
  const mkCard = (cx, kind) => {
    const g = mk('g', { class: `lv8p-card is-${kind}` })
    g.appendChild(mk('rect', { class: 'lv8p-card__box', x: cx, y: CARD_Y, width: CARD_W, height: CARD_H, rx: 9 }))
    const title = mk('text', { class: 'lv8p-card__title', x: cx + 14, y: CARD_Y + 16 })
    const main = mk('text', { class: 'lv8p-card__main', x: cx + 14, y: CARD_Y + 35 })
    const verdict = mk('text', { class: 'lv8p-card__verdict', x: cx + CARD_W - 14, y: CARD_Y + 16 })
    g.append(title, main, verdict)
    markLayer.appendChild(g)
    return { g, title, main, verdict }
  }
  const cheapCard = mkCard(26, 'hot')
  const bestCard = mkCard(26 + CARD_W + 14, 'ok')
  cheapCard.title.textContent = '只图便宜 · 不看时间'
  bestCard.title.textContent = '守时间窗 · 最优'

  // ── 状态链 chip 行 ──
  const POOL = 20
  const chipLbl = mk('text', { class: 'lv8p-lbl', x: 26, y: CHIP_LBL_Y })
  chipLbl.textContent = '状态链（沿前驱表从终点往回退）'
  markLayer.appendChild(chipLbl)
  const chipGap = 8
  const chipW = Math.min(84, Math.floor((W - 52 - (POOL - 1) * chipGap) / 6))
  const chipsX0 = 26
  const chipEls = []
  for (let k = 0; k < POOL; k += 1) {
    const x = chipsX0 + k * (chipW + chipGap)
    const g = mk('g', { class: 'lv8p-chip is-hidden' })
    g.appendChild(mk('rect', { class: 'lv8p-chip__box', x, y: CHIP_Y, width: chipW, height: CHIP_H, rx: 7 }))
    const tv = mk('text', { class: 'lv8p-chip__t', x: x + chipW / 2, y: CHIP_Y + 11 })
    const vv = mk('text', { class: 'lv8p-chip__v', x: x + chipW / 2, y: CHIP_Y + 26 })
    g.append(tv, vv)
    markLayer.appendChild(g)
    chipEls.push({ g, tv, vv })
  }
  const links = []
  for (let k = 0; k < POOL - 1; k += 1) {
    const y = CHIP_Y + CHIP_H / 2
    const x1 = chipsX0 + k * (chipW + chipGap)
    const x2 = x1 + chipW
    const g = mk('g', {})
    g.appendChild(mk('line', { class: 'lv8p-link__line', x1: x2.toFixed(1), y1: y, x2: (x1 + chipW + chipGap).toFixed(1), y2: y }))
    const head = 6
    const tip = x1 + chipW + chipGap
    g.appendChild(
      mk('polygon', {
        class: 'lv8p-link__head',
        points: `${tip.toFixed(1)},${y} ${(tip - head).toFixed(1)},${(y - 3.6).toFixed(1)} ${(tip - head).toFixed(1)},${(y + 3.6).toFixed(1)}`,
      }),
    )
    g.style.display = 'none'
    markLayer.appendChild(g)
    links.push(g)
  }

  // ── 横幅 ──
  markLayer.appendChild(
    mk('rect', { class: 'lv8p-banner__box', x: 26, y: BANNER_Y, width: W - 52, height: BANNER_H, rx: 9 }),
  )
  const banner = mk('text', { class: 'lv8p-banner__text', x: W / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)

  const phaseText = mk('text', { class: 'lv8p-phase__text', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return
    const { phase, cheap, best, answer, cursor, revealedStates } = step
    const showCheap = phase !== 'init' && cheap
    const showBest = (phase === 'best' || phase === 'back' || phase === 'done') && best

    // 高亮路
    for (const kind of ['cheap', 'best']) {
      const path = kind === 'cheap' ? cheap?.cities : best?.cities
      const active = kind === 'cheap' ? showCheap : showBest
      const segs = []
      if (active && path) {
        for (let i = 0; i < path.length - 1; i += 1) segs.push([path[i], path[i + 1]])
      }
      pathEls[kind].forEach(({ el, a, b }) => {
        const on = segs.some(([x, y]) => (x === a && y === b) || (x === b && y === a))
        el.setAttribute('class', `lv8p-path is-${kind}${on ? ' is-on' : ''}`)
      })
    }

    // 节点高亮
    const cheapSet = new Set(showCheap ? cheap.cities : [])
    const bestSet = new Set(showBest ? best.cities : [])
    nodeEls.forEach((el, v) => {
      const cls = ['lv8p-node']
      if (v === 0) cls.push('is-src')
      if (v === target) cls.push('is-tail')
      if (bestSet.has(v)) cls.push('is-best')
      else if (cheapSet.has(v)) cls.push('is-cheap')
      el.g.setAttribute('class', cls.join(' '))
    })

    // 两张卡
    const fillCard = (card, data, on, kind) => {
      card.g.setAttribute('class', `lv8p-card is-${kind}${on ? '' : ' is-dim'}`)
      if (!data) {
        card.main.textContent = '—'
        card.verdict.textContent = ''
        card.verdict.setAttribute('class', 'lv8p-card__verdict')
        return
      }
      card.main.textContent = `${data.cities.join(' → ')} · 费 ${data.fee} · ${data.totalTime}分`
      if (kind === 'hot') {
        card.verdict.textContent = data.valid ? '来得及' : `超时 ${data.totalTime} > ${maxTime}`
        card.verdict.setAttribute('class', `lv8p-card__verdict ${data.valid ? 'is-ok' : 'is-hot'}`)
      } else {
        card.verdict.textContent = '最优'
        card.verdict.setAttribute('class', 'lv8p-card__verdict is-ok')
      }
    }
    fillCard(cheapCard, cheap, showCheap, 'hot')
    fillCard(bestCard, best, showBest, 'ok')

    // chip 链
    const chain = best ? best.chain : []
    const revealed = Math.max(0, revealedStates)
    chipEls.forEach((chip, k) => {
      if (k >= chain.length) {
        chip.g.setAttribute('class', 'lv8p-chip is-hidden')
        return
      }
      const cls = ['lv8p-chip']
      if (k < revealed) {
        cls.push('is-revealed')
        chip.tv.textContent = `t = ${chain[k].t}`
        chip.vv.textContent = `城市 ${chain[k].v}`
      } else {
        chip.tv.textContent = '?'
        chip.vv.textContent = '?'
      }
      if (cursor >= 0 && k === cursor) cls.push('is-cur')
      chip.g.setAttribute('class', cls.join(' '))
    })
    links.forEach((g, k) => {
      const on = k + 1 < chain.length && k + 1 < revealed
      g.style.display = on ? '' : 'none'
    })

    // 横幅
    if (phase === 'init') {
      banner.textContent = '先不守时间：只按通行费找最便宜的路，看看它会超时多少'
      banner.setAttribute('class', 'lv8p-banner__text')
    } else if (phase === 'cheap') {
      banner.textContent = cheap
        ? `贪心路 ${cheap.cities.join(' → ')}　费 ${cheap.fee}　耗时 ${cheap.totalTime} ${cheap.valid ? '≤' : '>'} ${maxTime}`
        : '只按通行费也走不到终点'
      banner.setAttribute('class', 'lv8p-banner__text' + (cheap && cheap.valid ? ' is-ok' : ''))
    } else if (phase === 'best') {
      banner.textContent = `守时最优 ${best.cities.join(' → ')}　费 ${best.fee}　耗时 ${best.totalTime} ≤ ${maxTime}`
      banner.setAttribute('class', 'lv8p-banner__text is-ok')
    } else if (phase === 'back') {
      banner.textContent = `回溯状态链：还剩 ${chain.length - revealed} 步退回 (0, 0)`
      banner.setAttribute('class', 'lv8p-banner__text is-ok')
    } else {
      banner.textContent =
        answer === -1 ? '时间窗内没有可行路 → 返回 -1' : `答案 = ${answer}（守时间窗的最小通行费）`
      banner.setAttribute('class', 'lv8p-banner__text' + (answer === -1 ? '' : ' is-ok'))
    }

    // 状态行
    if (phase === 'init') {
      phaseText.textContent = '一维 dp[v] 只记"到 v 的最少花费"，会把"第几时刻到的"整个丢掉'
    } else if (phase === 'cheap') {
      phaseText.textContent = cheap && cheap.valid
        ? '这条便宜路恰好没超时 —— 但这只是运气，本题里两件事通常冲突'
        : '便宜路超时作废 —— 若只看花费，一维 dp 会把它错当成答案'
    } else if (phase === 'best') {
      phaseText.textContent = '把时刻并进状态后，`(t, v)` 二维展开才拿得到第一条来得及的路'
    } else if (phase === 'back') {
      phaseText.textContent = '路不在 dp 值里，藏在 prev[arr][u] = (t, v)：一段一段问"我从哪来"'
    } else {
      phaseText.textContent = '可行性（来得及）与最优性（最便宜）是两问：先过时间窗，才谈最省'
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
      delete host.dataset.lc1928PathMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
