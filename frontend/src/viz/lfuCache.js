/**
 * lfuCache.js — 「LFU 缓存」(LC 460) 的 SVG 渲染层（LRU 的追问对照）。
 *
 * 布局：节点按 freq 升序排（并列按最久未使用在前）—— **最左 = 下一个淘汰对象**，
 * 左侧有淘汰指示；节点带 freq 角标；minFreq 行 + 本步操作条 + get 返回值 chips；
 * 横幅 + 底部状态行。
 */

import { buildLfuCacheSteps } from './lfuCacheSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'lfucache-styles'

const NOTE_Y = 28
const ROW_Y = 78
const ROW_H = 46
const MINFREQ_Y = 165
const OP_Y = 240
const OP_H = 34
const RESULT_Y = 292
const BANNER_Y = 336
const BANNER_H = 40
const PHASE_Y = 400

const PLAY_MS = 1150

const NODE_W = 84
const GAP = 16
const ROW_X = 132

const STYLES = `
.lfu { display: flex; flex-direction: column; gap: 14px; }
.lfu__svg { width: 100%; height: auto; display: block; }

.lfu-note {
  fill: var(--lfu-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lfu-note--r { text-anchor: end; }
.lfu-lbl { fill: var(--lfu-muted, #657168); font-size: 11.5px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.lfu-evict-arrow { stroke: var(--lfu-hot, #a45f45); stroke-width: 2; fill: none; }
.lfu-evict-head { fill: var(--lfu-hot, #a45f45); }
.lfu-evict-text { fill: var(--lfu-hot, #a45f45); font-size: 11px; font-weight: 700; text-anchor: start;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.lfu-node__box { fill: var(--lfu-fill, #ffffff); stroke: var(--lfu-line, #b9c1b8); stroke-width: 2; }
.lfu-node--min .lfu-node__box { fill: var(--lfu-min-fill, #f7ece8); stroke: var(--lfu-hot, #a45f45); }
.lfu-node--cur .lfu-node__box { stroke: var(--lfu-gold, #c2872f); stroke-width: 3.5; }
.lfu-node--victim .lfu-node__box { stroke: var(--lfu-hot, #a45f45); stroke-width: 3.5; stroke-dasharray: 5 4; }
.lfu-node__kv { fill: var(--lfu-ink, #1f2a24); font-size: 14px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lfu-node--victim .lfu-node__kv { fill: var(--lfu-hot, #a45f45); }
.lfu-badge__circle { fill: var(--lfu-fill, #ffffff); stroke: var(--lfu-line, #b9c1b8); stroke-width: 1.5; }
.lfu-node--cur .lfu-badge__circle { fill: var(--lfu-gold-fill, #fdf3e3); stroke: var(--lfu-gold, #c2872f); stroke-width: 2; }
.lfu-badge__num { fill: var(--lfu-ink, #1f2a24); font-size: 11px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lfu-node--cur .lfu-badge__num { fill: var(--lfu-gold, #c2872f); }

.lfu-chip__box { fill: var(--lfu-fill, #ffffff); stroke: var(--lfu-line, #c3c9c2); stroke-width: 1.5; }
.lfu-chip__val { fill: var(--lfu-ink, #1f2a24); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lfu-chip.is-result .lfu-chip__box { fill: var(--lfu-ok-fill, #eef5f1); stroke: var(--lfu-ok, #3f6b57); stroke-width: 2; }
.lfu-chip.is-result .lfu-chip__val { fill: var(--lfu-ok, #3f6b57); font-weight: 700; }
.lfu-chip.is-miss .lfu-chip__box { fill: var(--lfu-hot-fill, #f7ece8); stroke: var(--lfu-hot, #a45f45); stroke-width: 2; }
.lfu-chip.is-miss .lfu-chip__val { fill: var(--lfu-hot, #a45f45); font-weight: 700; }

.lfu-op__box { fill: var(--lfu-op, #f4f3ef); stroke: var(--lfu-line, #c3c9c2); stroke-width: 1.5; }
.lfu-op__text { fill: var(--lfu-ink, #1f2a24); font-size: 12.5px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.lfu-banner__box { fill: var(--lfu-banner, #f4f3ef); stroke: var(--lfu-line, #c3c9c2); stroke-width: 1.5; }
.lfu-banner__text { fill: var(--lfu-hot, #a45f45); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lfu-banner__text.is-ok { fill: var(--lfu-ok, #3f6b57); }

.lfu-phase__text { fill: var(--lfu-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
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
 * @param {{ capacity?: number, ops?: any[][], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountLfuCache(host, options = {}) {
  if (!host || host.dataset.lfuCacheMounted === '1') return { destroy() {} }
  host.dataset.lfuCacheMounted = '1'
  ensureStyles()

  const steps = buildLfuCacheSteps(options)
  const autoplay = options.autoplay !== false
  const { capacity } = steps[0]

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz lfu'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg lfu__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': 'LFU 缓存 LC460 频率淘汰推演动画',
  })
  stage.appendChild(svgRoot)

  const nodeLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(nodeLayer, markLayer)

  const note = mk('text', { class: 'lfu-note', x: 26, y: NOTE_Y })
  note.textContent = 'freq 最小者先淘汰（并列 → 最久未使用）；get 命中会涨 freq'
  markLayer.appendChild(note)
  const goal = mk('text', { class: 'lfu-note lfu-note--r', x: width - 26, y: NOTE_Y })
  goal.textContent = `容量 = ${capacity}`
  markLayer.appendChild(goal)

  // 淘汰指示（指向整行最左）
  markLayer.appendChild(
    mk('line', { class: 'lfu-evict-arrow', x1: 34, y1: ROW_Y + ROW_H / 2, x2: ROW_X - 14, y2: ROW_Y + ROW_H / 2 }),
  )
  markLayer.appendChild(
    mk('polygon', {
      class: 'lfu-evict-head',
      points: `${ROW_X - 8},${ROW_Y + ROW_H / 2} ${ROW_X - 18},${ROW_Y + ROW_H / 2 - 5} ${ROW_X - 18},${ROW_Y + ROW_H / 2 + 5}`,
    }),
  )
  const evictText = mk('text', { class: 'lfu-evict-text', x: 34, y: ROW_Y - 16 })
  evictText.textContent = '淘汰优先 →'
  markLayer.appendChild(evictText)

  // ── 节点槽 ──
  const slotCount = Math.max(capacity + 1, 2)
  const slots = []
  for (let i = 0; i < slotCount; i += 1) {
    const x = ROW_X + i * (NODE_W + GAP)
    const g = mk('g', { class: 'lfu-node' })
    g.appendChild(mk('rect', { class: 'lfu-node__box', x, y: ROW_Y, width: NODE_W, height: ROW_H, rx: 9 }))
    const kv = mk('text', { class: 'lfu-node__kv', x: x + NODE_W / 2, y: ROW_Y + ROW_H / 2 + 6 })
    g.appendChild(kv)
    const badge = mk('g', { class: 'lfu-badge' })
    badge.appendChild(mk('circle', { class: 'lfu-badge__circle', cx: x + NODE_W - 14, cy: ROW_Y + 13, r: 11 }))
    const bnum = mk('text', { class: 'lfu-badge__num', x: x + NODE_W - 14, y: ROW_Y + 13 })
    badge.appendChild(bnum)
    g.appendChild(badge)
    nodeLayer.appendChild(g)
    slots.push({ g, kv, badge, bnum })
  }

  // ── minFreq 行 ──
  const minLabel = mk('text', { class: 'lfu-lbl', x: 26, y: MINFREQ_Y })
  minLabel.textContent = 'minFreq（淘汰目标频率）'
  const minValue = mk('text', { class: 'lfu-op__text', x: 210, y: MINFREQ_Y, 'text-anchor': 'start' })
  markLayer.append(minLabel, minValue)
  const minHint = mk('text', { class: 'lfu-lbl', x: 320, y: MINFREQ_Y })
  minHint.textContent = '＝ 所有节点 freq 的最小值；并列时看谁更久没用'
  markLayer.appendChild(minHint)

  // ── 操作条 ──
  markLayer.appendChild(mk('rect', { class: 'lfu-op__box', x: 26, y: OP_Y, width: width - 52, height: OP_H, rx: 8 }))
  const opText = mk('text', { class: 'lfu-op__text', x: width / 2, y: OP_Y + OP_H / 2 })
  markLayer.appendChild(opText)

  // ── get 返回值 ──
  const resLabel = mk('text', { class: 'lfu-lbl', x: 26, y: RESULT_Y + 12 })
  resLabel.textContent = 'get 返回'
  markLayer.appendChild(resLabel)
  const resChips = []
  for (let i = 0; i < 8; i += 1) {
    const x = 146 + i * 40
    const g = mk('g', { class: 'lfu-chip' })
    g.appendChild(mk('rect', { class: 'lfu-chip__box', x, y: RESULT_Y, width: 34, height: 24, rx: 6 }))
    const t = mk('text', { class: 'lfu-chip__val', x: x + 17, y: RESULT_Y + 12 })
    g.appendChild(t)
    markLayer.appendChild(g)
    resChips.push({ g, t })
  }

  // ── 横幅 / 状态行 ──
  markLayer.appendChild(mk('rect', { class: 'lfu-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'lfu-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)
  const phaseText = mk('text', { class: 'lfu-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return

    const ghost = step.phase === 'evict' ? step.evicted : null
    const offset = ghost ? 1 : 0

    slots.forEach((slot, i) => {
      const node = step.nodes[i - offset]
      const isGhost = ghost && i === 0
      if (!node && !isGhost) {
        slot.g.style.display = 'none'
        return
      }
      slot.g.style.display = ''
      if (isGhost) {
        slot.kv.textContent = `${ghost.key}:${ghost.value}`
        slot.bnum.textContent = String(ghost.freq)
        slot.g.setAttribute('class', 'lfu-node lfu-node--victim')
        return
      }
      slot.kv.textContent = `${node.key}:${node.value}`
      slot.bnum.textContent = String(node.freq)
      const cls = ['lfu-node']
      if (i - offset === 0) cls.push('lfu-node--min')
      if (step.cur === node.id) cls.push('lfu-node--cur')
      slot.g.setAttribute('class', cls.join(' '))
    })

    minValue.textContent = step.minFreq === null ? '—' : String(step.minFreq)

    // 操作条
    opText.textContent = step.opText

    // get 返回值
    const results = step.results
    const visible = results.slice(-resChips.length)
    resChips.forEach((chip, i) => {
      if (i >= visible.length) {
        chip.g.style.display = 'none'
        return
      }
      chip.g.style.display = ''
      chip.t.textContent = String(visible[i])
      const isLatest = i === visible.length - 1
      chip.g.setAttribute(
        'class',
        'lfu-chip' + (isLatest ? (visible[i] === -1 ? ' is-miss' : ' is-result') : ''),
      )
    })

    // 横幅
    if (step.phase === 'init') {
      banner.textContent = `空缓存，容量 ${step.capacity}：节点按 freq 从低到高从左到右排`
      banner.setAttribute('class', 'lfu-banner__text')
    } else if (step.phase === 'get-hit') {
      banner.textContent = `get 命中 → 返回 ${step.result}，freq +1（淘汰优先级跟着变）`
      banner.setAttribute('class', 'lfu-banner__text is-ok')
    } else if (step.phase === 'get-miss') {
      banner.textContent = 'get 未命中 → 返回 −1（不改频率）'
      banner.setAttribute('class', 'lfu-banner__text')
    } else if (step.phase === 'put-update') {
      banner.textContent = 'put 已存在 → 改值 + freq +1'
      banner.setAttribute('class', 'lfu-banner__text is-ok')
    } else if (step.phase === 'evict') {
      banner.textContent = `淘汰 freq 最小的 (${step.evicted.key}, ${step.evicted.value})，freq = ${step.evicted.freq}`
      banner.setAttribute('class', 'lfu-banner__text')
    } else if (step.phase === 'put-insert') {
      banner.textContent = '新节点 freq = 1（从最冷起步）'
      banner.setAttribute('class', 'lfu-banner__text is-ok')
    } else {
      banner.textContent = `完成：get 返回值 = [${step.results.join(', ')}]`
      banner.setAttribute('class', 'lfu-banner__text is-ok')
    }

    // 状态行
    if (step.phase === 'init') phaseText.textContent = 'LFU 只认「用得多少」：最左的节点就是下一个淘汰对象'
    else if (step.phase === 'get-hit') phaseText.textContent = '和 LRU 的关键分歧：get 会改频率 → 改淘汰顺序'
    else if (step.phase === 'get-miss') phaseText.textContent = '未命中：频率不变 —— 冷 key 不会因为被看空一次变热'
    else if (step.phase === 'put-update') phaseText.textContent = 'put 命中同样升频：写入也算一次使用'
    else if (step.phase === 'evict') phaseText.textContent = '并列 freq 时淘汰最久未使用的 —— 频率 + 时间的双维度'
    else if (step.phase === 'put-insert') phaseText.textContent = '新来的最冷（freq 1）；minFreq 也随之更新'
    else phaseText.textContent = '真实现场用「频率桶 + minFreq 指针」把 LFU 也做到 O(1)（LC 460 的考点）'

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
      delete host.dataset.lfuCacheMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
