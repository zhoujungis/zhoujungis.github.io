/**
 * lruCache.js — 「LRU 缓存」(LC 146) 的 SVG 渲染层。
 *
 * 布局：上方 = 双向链表（H/T 哨兵 + 节点，队首最左 = 最近使用，队尾最右 =
 * 淘汰对象；节点显示 k:v 与节点号）；中部 = 哈希表 chips（key → 节点号）；
 * 下方 = 本步操作条 + get 返回值 chips；横幅 + 底部状态行。
 *
 * 与其他动画骨架一致：模块级 STYLE_ID + ensureStyles()，dataset 幂等守卫，
 * createPlayer + jumpTo，IntersectionObserver 自动播放。
 */

import { buildLruCacheSteps } from './lruCacheSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'lrucache-styles'

const NOTE_Y = 28
const CHAIN_Y = 78
const CHAIN_H = 46
const MAP_Y = 182
const OP_Y = 240
const OP_H = 34
const RESULT_Y = 292
const BANNER_Y = 336
const BANNER_H = 40
const PHASE_Y = 400

const PLAY_MS = 1150

const NODE_W = 66
const SENT_W = 34
const GAP = 22

const STYLES = `
.lru { display: flex; flex-direction: column; gap: 14px; }
.lru__svg { width: 100%; height: auto; display: block; }

.lru-note {
  fill: var(--lru-muted, #657168);
  font-size: 12.5px; text-anchor: start; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lru-note--r { text-anchor: end; }
.lru-lbl { fill: var(--lru-muted, #657168); font-size: 11.5px; dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace; }

.lru-sent__box { fill: var(--lru-sent, #e8ebe6); stroke: var(--lru-line, #b9c1b8); stroke-width: 2; }
.lru-sent__val { fill: var(--lru-muted, #657168); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.lru-node__box { fill: var(--lru-fill, #ffffff); stroke: var(--lru-line, #b9c1b8); stroke-width: 2; }
.lru-node--front .lru-node__box { fill: var(--lru-front, #eef5f1); stroke: var(--lru-ok, #3f6b57); }
.lru-node--cur .lru-node__box { stroke: var(--lru-gold, #c2872f); stroke-width: 3.5; }
.lru-node--victim .lru-node__box { stroke: var(--lru-hot, #a45f45); stroke-width: 3.5; stroke-dasharray: 5 4; }
.lru-node__kv { fill: var(--lru-ink, #1f2a24); font-size: 14px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lru-node--victim .lru-node__kv { fill: var(--lru-hot, #a45f45); }
.lru-node__id { fill: var(--lru-dim, #9aa39c); font-size: 9.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.lru-link { stroke: var(--lru-line, #b9c1b8); stroke-width: 2; fill: none; }
.lru-link-head { fill: var(--lru-line, #b9c1b8); }

.lru-micro { fill: var(--lru-dim, #8d968e); font-size: 10.5px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.lru-chip__box { fill: var(--lru-fill, #ffffff); stroke: var(--lru-line, #c3c9c2); stroke-width: 1.5; }
.lru-chip__val { fill: var(--lru-ink, #1f2a24); font-size: 11px; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lru-chip.is-cur .lru-chip__box { fill: var(--lru-gold-fill, #fdf3e3); stroke: var(--lru-gold, #c2872f); stroke-width: 2.5; }
.lru-chip.is-cur .lru-chip__val { fill: var(--lru-gold, #c2872f); font-weight: 700; }
.lru-chip.is-result .lru-chip__box { fill: var(--lru-ok-fill, #eef5f1); stroke: var(--lru-ok, #3f6b57); stroke-width: 2; }
.lru-chip.is-result .lru-chip__val { fill: var(--lru-ok, #3f6b57); font-weight: 700; }
.lru-chip.is-miss .lru-chip__box { fill: var(--lru-hot-fill, #f7ece8); stroke: var(--lru-hot, #a45f45); stroke-width: 2; }
.lru-chip.is-miss .lru-chip__val { fill: var(--lru-hot, #a45f45); font-weight: 700; }

.lru-op__box { fill: var(--lru-op, #f4f3ef); stroke: var(--lru-line, #c3c9c2); stroke-width: 1.5; }
.lru-op__text { fill: var(--lru-ink, #1f2a24); font-size: 12.5px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }

.lru-banner__box { fill: var(--lru-banner, #f4f3ef); stroke: var(--lru-line, #c3c9c2); stroke-width: 1.5; }
.lru-banner__text { fill: var(--lru-hot, #a45f45); font-size: 13px; font-weight: 700; text-anchor: middle;
  dominant-baseline: central; font-family: 'SFMono-Regular', Consolas, monospace; }
.lru-banner__text.is-ok { fill: var(--lru-ok, #3f6b57); }

.lru-phase__text { fill: var(--lru-muted, #657168); font-size: 13px; font-weight: 600; text-anchor: middle;
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
export function mountLruCache(host, options = {}) {
  if (!host || host.dataset.lruCacheMounted === '1') return { destroy() {} }
  host.dataset.lruCacheMounted = '1'
  ensureStyles()

  const steps = buildLruCacheSteps(options)
  const autoplay = options.autoplay !== false
  const { capacity } = steps[0]

  const mk = svgEl
  const rootEl = document.createElement('div')
  rootEl.className = 'viz lru'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const width = 660
  const height = PHASE_Y + 22
  const svgRoot = mk('svg', {
    class: 'viz__svg lru__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': 'LRU 缓存 LC146 双向链表与哈希表推演动画',
  })
  stage.appendChild(svgRoot)

  const listLayer = mk('g', {})
  const markLayer = mk('g', {})
  svgRoot.append(listLayer, markLayer)

  const note = mk('text', { class: 'lru-note', x: 26, y: NOTE_Y })
  note.textContent = '哈希表按 key 找节点；链表按使用顺序排 —— 队首 = 最近使用，队尾 = 淘汰对象'
  markLayer.appendChild(note)
  const goal = mk('text', { class: 'lru-note lru-note--r', x: width - 26, y: NOTE_Y })
  goal.textContent = `容量 = ${capacity}`
  markLayer.appendChild(goal)

  // ── 链表：H + N 个节点槽 + T（居中排布） ──
  const slotCount = Math.max(capacity, 1)
  const totalW = 2 * SENT_W + slotCount * NODE_W + (slotCount + 1) * GAP
  const x0 = (width - totalW) / 2

  const sentH = mk('g', {})
  sentH.appendChild(
    mk('rect', { class: 'lru-sent__box', x: x0, y: CHAIN_Y, width: SENT_W, height: CHAIN_H, rx: 8 }),
  )
  const sentHV = mk('text', { class: 'lru-sent__val', x: x0 + SENT_W / 2, y: CHAIN_Y + CHAIN_H / 2 })
  sentHV.textContent = 'H'
  sentH.appendChild(sentHV)
  listLayer.appendChild(sentH)

  const nodeSlots = []
  for (let i = 0; i < slotCount; i += 1) {
    const x = x0 + SENT_W + GAP + i * (NODE_W + GAP)
    const g = mk('g', { class: 'lru-node' })
    g.appendChild(mk('rect', { class: 'lru-node__box', x, y: CHAIN_Y, width: NODE_W, height: CHAIN_H, rx: 9 }))
    const kv = mk('text', { class: 'lru-node__kv', x: x + NODE_W / 2, y: CHAIN_Y + CHAIN_H / 2 + 4 })
    const id = mk('text', { class: 'lru-node__id', x: x + NODE_W / 2, y: CHAIN_Y + 12 })
    g.append(kv, id)
    listLayer.appendChild(g)
    nodeSlots.push({ g, kv, id })
  }

  const sentT = mk('g', {})
  const tx = x0 + SENT_W + GAP + slotCount * (NODE_W + GAP)
  sentT.appendChild(mk('rect', { class: 'lru-sent__box', x: tx, y: CHAIN_Y, width: SENT_W, height: CHAIN_H, rx: 8 }))
  const sentTV = mk('text', { class: 'lru-sent__val', x: tx + SENT_W / 2, y: CHAIN_Y + CHAIN_H / 2 })
  sentTV.textContent = 'T'
  sentT.appendChild(sentTV)
  listLayer.appendChild(sentT)

  // 连接线（H-节点-T 顺次 + 双箭头）
  const linkXs = []
  for (let i = 0; i <= slotCount; i += 1) {
    const left = x0 + SENT_W + i * (NODE_W + GAP) - GAP
    linkXs.push([left, left + GAP])
  }
  for (const [a, b] of linkXs) {
    const line = mk('line', { class: 'lru-link', x1: a + 4, y1: CHAIN_Y + CHAIN_H / 2, x2: b - 4, y2: CHAIN_Y + CHAIN_H / 2 })
    const headL = mk('polygon', { class: 'lru-link-head', points: `${a},${CHAIN_Y + CHAIN_H / 2} ${a + 5},${CHAIN_Y + CHAIN_H / 2 - 4} ${a + 5},${CHAIN_Y + CHAIN_H / 2 + 4}` })
    const headR = mk('polygon', { class: 'lru-link-head', points: `${b},${CHAIN_Y + CHAIN_H / 2} ${b - 5},${CHAIN_Y + CHAIN_H / 2 - 4} ${b - 5},${CHAIN_Y + CHAIN_H / 2 + 4}` })
    listLayer.append(line, headL, headR)
  }

  const microH = mk('text', { class: 'lru-micro', x: x0 + SENT_W / 2, y: CHAIN_Y + CHAIN_H + 16 })
  microH.textContent = '队首 · 最近使用'
  const microT = mk('text', { class: 'lru-micro', x: tx + SENT_W / 2, y: CHAIN_Y + CHAIN_H + 16 })
  microT.textContent = '队尾 · 淘汰'
  markLayer.append(microH, microT)

  // ── 哈希表 chips ──
  const mapLabel = mk('text', { class: 'lru-lbl', x: 26, y: MAP_Y + 12 })
  mapLabel.textContent = '哈希表 key → 节点'
  markLayer.appendChild(mapLabel)
  const chipW = 62
  const chipH = 24
  const chipX0 = 146
  const mapChips = []
  for (let i = 0; i < 4; i += 1) {
    const x = chipX0 + i * (chipW + 8)
    const g = mk('g', { class: 'lru-chip' })
    g.appendChild(mk('rect', { class: 'lru-chip__box', x, y: MAP_Y, width: chipW, height: chipH, rx: 6 }))
    const t = mk('text', { class: 'lru-chip__val', x: x + chipW / 2, y: MAP_Y + chipH / 2 })
    g.appendChild(t)
    markLayer.appendChild(g)
    mapChips.push({ g, t })
  }
  const mapEmpty = mk('text', { class: 'lru-micro', x: chipX0, y: MAP_Y + 12 })
  mapEmpty.setAttribute('text-anchor', 'start')
  mapEmpty.textContent = '（空）'
  markLayer.appendChild(mapEmpty)

  // ── 操作条 ──
  markLayer.appendChild(mk('rect', { class: 'lru-op__box', x: 26, y: OP_Y, width: width - 52, height: OP_H, rx: 8 }))
  const opText = mk('text', { class: 'lru-op__text', x: width / 2, y: OP_Y + OP_H / 2 })
  markLayer.appendChild(opText)

  // ── get 返回值 chips ──
  const resLabel = mk('text', { class: 'lru-lbl', x: 26, y: RESULT_Y + 12 })
  resLabel.textContent = 'get 返回'
  markLayer.appendChild(resLabel)
  const resChips = []
  for (let i = 0; i < 8; i += 1) {
    const x = chipX0 + i * 40
    const g = mk('g', { class: 'lru-chip' })
    g.appendChild(mk('rect', { class: 'lru-chip__box', x, y: RESULT_Y, width: 34, height: chipH, rx: 6 }))
    const t = mk('text', { class: 'lru-chip__val', x: x + 17, y: RESULT_Y + chipH / 2 })
    g.appendChild(t)
    markLayer.appendChild(g)
    resChips.push({ g, t })
  }

  // ── 横幅 / 状态行 ──
  markLayer.appendChild(mk('rect', { class: 'lru-banner__box', x: 26, y: BANNER_Y, width: width - 52, height: BANNER_H, rx: 9 }))
  const banner = mk('text', { class: 'lru-banner__text', x: width / 2, y: BANNER_Y + BANNER_H / 2 })
  markLayer.appendChild(banner)
  const phaseText = mk('text', { class: 'lru-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = document.createElement('p')
  desc.className = 'viz__desc'
  desc.setAttribute('aria-live', 'polite')

  function paint(_index, step) {
    if (!step) return

    // 链表槽位
    const curKey = step.mapEntries.find((e) => e.id === step.cur)?.key ?? null
    nodeSlots.forEach((slot, i) => {
      const node = step.order[i]
      if (!node) {
        slot.g.style.display = 'none'
        return
      }
      slot.g.style.display = ''
      slot.kv.textContent = `${node.key}:${node.value}`
      slot.id.textContent = `#${node.id}`
      const cls = ['lru-node']
      if (i === 0) cls.push('lru-node--front')
      if (step.cur === node.id) cls.push('lru-node--cur')
      slot.g.setAttribute('class', cls.join(' '))
    })

    // 被淘汰的节点：在队尾位置显示一个虚线幽灵槽（如果容量未满则借最后一个空槽）
    const ghostIndex = step.phase === 'evict' ? step.order.length : -1
    if (ghostIndex >= 0 && ghostIndex < nodeSlots.length) {
      const slot = nodeSlots[ghostIndex]
      slot.g.style.display = ''
      slot.kv.textContent = `${step.evicted.key}:${step.evicted.value}`
      slot.id.textContent = `#${step.evicted.id} 淘汰`
      slot.g.setAttribute('class', 'lru-node lru-node--victim')
    }

    // 哈希表
    const entries = step.mapEntries
    mapEmpty.style.display = entries.length === 0 ? '' : 'none'
    mapChips.forEach((chip, i) => {
      if (i >= entries.length) {
        chip.g.style.display = 'none'
        return
      }
      chip.g.style.display = ''
      chip.t.textContent = `${entries[i].key} → #${entries[i].id}`
      chip.g.setAttribute('class', 'lru-chip' + (curKey === entries[i].key ? ' is-cur' : ''))
    })

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
        'lru-chip' + (isLatest ? (visible[i] === -1 ? ' is-miss' : ' is-result') : ''),
      )
    })

    // 横幅
    if (step.phase === 'init') {
      banner.textContent = `空缓存，容量 ${step.capacity}：哈希表与链表都为空`
      banner.setAttribute('class', 'lru-banner__text')
    } else if (step.phase === 'get-hit') {
      banner.textContent = `get 命中 → 返回 ${step.result}，节点移到队首`
      banner.setAttribute('class', 'lru-banner__text is-ok')
    } else if (step.phase === 'get-miss') {
      banner.textContent = 'get 未命中 → 返回 −1（结构不动）'
      banner.setAttribute('class', 'lru-banner__text')
    } else if (step.phase === 'put-update') {
      banner.textContent = 'put 已存在的 key → 改值 + 移到队首（也算使用）'
      banner.setAttribute('class', 'lru-banner__text is-ok')
    } else if (step.phase === 'evict') {
      banner.textContent = `容量满 → 淘汰队尾 (${step.evicted.key}, ${step.evicted.value})`
      banner.setAttribute('class', 'lru-banner__text')
    } else if (step.phase === 'put-insert') {
      banner.textContent = '新节点插到队首'
      banner.setAttribute('class', 'lru-banner__text is-ok')
    } else {
      banner.textContent = `完成：get 返回值 = [${step.results.join(', ')}]`
      banner.setAttribute('class', 'lru-banner__text is-ok')
    }

    // 状态行
    if (step.phase === 'init') phaseText.textContent = 'O(1) 的来源：哈希表定位 + 链表搬运，两件事都是常数时间'
    else if (step.phase === 'get-hit') phaseText.textContent = '命中：先查表，再把节点从链表中间摘下来插到队首'
    else if (step.phase === 'get-miss') phaseText.textContent = '未命中：什么都不做 —— 不在缓存里的 key 不会「占位」'
    else if (step.phase === 'put-update') phaseText.textContent = '漏掉「移到队首」= 把一个热 key 误判成冷 key，面试扣分点'
    else if (step.phase === 'evict') phaseText.textContent = '淘汰 = 链表摘尾 + 哈希表删除，两处必须同步'
    else if (step.phase === 'put-insert') phaseText.textContent = '插入 = 新节点加到队首 + 哈希表登记，同样是 O(1)'
    else phaseText.textContent = 'get 与 put 都 O(1)：没有一次遍历，只有常数次指针操作'

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
      delete host.dataset.lruCacheMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
