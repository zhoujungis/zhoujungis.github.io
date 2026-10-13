/**
 * kthLarge.js — 「重复元素数组找第 K 大」的 SVG 渲染层，两种口径共用一套渲染。
 *
 *   mountKthLarge      —— lc-kthlarge  不去重口径（答案 16）
 *   mountKthLargeDup   —— lc-kthdup    去重口径（答案 8）
 *
 * 视觉：输入行（当前 / 已进堆 / 被拒 三态）+ size-k 最小堆行（堆顶金 = 当前第 K 大，
 * sift 路径上的格子高亮）+ 答案条。
 *
 * 通用坑：A / V / K / X。
 */

import { buildKthLargeSteps } from './kthLargeSteps.js'
import {
  createControls,
  createPlayer,
  ensureChromeStyles,
  renderRichText,
  svgEl,
} from './widgetChrome'

const STYLE_ID = 'kth-styles'
const PLAY_MS = 780

const STYLES = `
.kth { display: flex; flex-direction: column; gap: 14px; }
.kth__svg { width: 100%; height: auto; display: block; }

.kth-note {
  fill: var(--kth-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-banner__box {
  fill: var(--kth-banner, #f4f3ef);
  stroke: var(--kth-line, #c3c9c2);
  stroke-width: 1.5;
}
.kth-banner__seg {
  fill: var(--kth-ink, #1f2a24);
  font-size: 14.5px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-banner__val {
  fill: var(--kth-gold, #c2872f);
  font-size: 16.5px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 输入行 ---- */
.kth-cell__box {
  fill: var(--kth-fill, #ffffff);
  stroke: var(--kth-line, #c3c9c2);
  stroke-width: 1.5;
}
.kth-cell__val {
  fill: var(--kth-ink, #1f2a24);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 三态互斥，在 JS 里选好，不交给层叠顺序（坑 V） */
.kth-cell.is-ghost .kth-cell__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1.2; }
.kth-cell.is-ghost .kth-cell__val { fill: var(--kth-dim, #9aa39c); }
.kth-cell.is-out .kth-cell__box { fill: var(--kth-dim-fill, #f6f5f1); stroke: var(--kth-dim, #9aa39c); }
.kth-cell.is-out .kth-cell__val { fill: var(--kth-dim, #9aa39c); }
.kth-cell.is-cur .kth-cell__box { stroke: var(--kth-hot, #a45f45); stroke-width: 3; }
.kth-cell.is-cur .kth-cell__val { fill: var(--kth-hot, #a45f45); }
.kth-cell.is-in .kth-cell__box { fill: var(--kth-ok-fill, #eef5f1); stroke: var(--kth-ok, #3f6b57); stroke-width: 2; }
.kth-cell.is-in .kth-cell__val { fill: var(--kth-ok, #3f6b57); }

/* ---- 堆行 ---- */
.kth-heap__box {
  fill: var(--kth-fill, #ffffff);
  stroke: var(--kth-ok, #3f6b57);
  stroke-width: 2;
}
.kth-heap__val {
  fill: var(--kth-ok, #3f6b57);
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-heap__idx {
  fill: var(--kth-dim, #9aa39c);
  font-size: 9.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 堆顶 = 当前第 K 大 */
.kth-heap.is-top .kth-heap__box {
  fill: var(--kth-gold-fill, #fdf3e3);
  stroke: var(--kth-gold, #c2872f);
  stroke-width: 3;
}
.kth-heap.is-top .kth-heap__val { fill: var(--kth-gold, #c2872f); }
/* sift 路径 */
.kth-heap.is-sift .kth-heap__box { stroke: var(--kth-hot, #a45f45); stroke-width: 3; }
.kth-heap.is-sift .kth-heap__val { fill: var(--kth-hot, #a45f45); }
.kth-heap.is-ghost .kth-heap__box { fill: none; stroke-dasharray: 3 3; stroke-width: 1.2; }
.kth-heap.is-ghost .kth-heap__val { fill: none; }
.kth-heap.is-ghost .kth-heap__idx { fill: none; }

.kth-label {
  fill: var(--kth-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-hint {
  fill: var(--kth-muted, #657168);
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.kth-hint.is-hot { fill: var(--kth-hot, #a45f45); }

.kth-ans__box {
  fill: var(--kth-gold-fill, #fdf3e3);
  stroke: var(--kth-gold, #c2872f);
  stroke-width: 2.5;
  opacity: 0;
}
.kth-ans__box.is-on { opacity: 1; }
.kth-ans__box.is-none { fill: var(--kth-dim-fill, #f6f5f1); stroke: var(--kth-dim, #9aa39c); }
.kth-ans__text {
  fill: var(--kth-gold, #c2872f);
  font-size: 15.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.kth-ans__text.is-on { opacity: 1; }
.kth-ans__text.is-none { fill: var(--kth-muted, #657168); }

.kth-phase__text {
  fill: var(--kth-muted, #657168);
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

function makeDesc() {
  const p = document.createElement('p')
  p.className = 'viz__desc'
  p.setAttribute('aria-live', 'polite')
  return p
}

function mountMode(host, options, dedupe, datasetKey) {
  if (!host || host.dataset[datasetKey] === '1') return { destroy() {} }
  host.dataset[datasetKey] = '1'
  ensureStyles()

  const steps = buildKthLargeSteps({ ...options, dedupe })
  const s0 = steps[0]
  const { n, k } = s0

  const W = 680
  const BANNER_TOP = 38
  const BANNER_H = 40
  const ARR_Y = 118
  const ARR_H = 50
  const HEAP_Y = 218
  const HEAP_H = 52
  const HINT_Y = 296
  const ANS_Y = 320
  const ANS_H = 38
  const PHASE_Y = ANS_Y + 42
  const height = PHASE_Y + 22

  // 输入行：18 格以内
  const aGap = n > 16 ? 3 : 5
  const aW = Math.max(16, Math.min(30, (W - 90 - (n - 1) * aGap) / n))
  const aRowW = n * aW + (n - 1) * aGap
  const AL = (W - aRowW) / 2
  const ax = (i) => AL + i * (aW + aGap) + aW / 2

  // 堆行：k 格
  const hGap = 6
  const hW = Math.max(24, Math.min(46, (W - 130 - (k - 1) * hGap) / k))
  const hRowW = k * hW + (k - 1) * hGap
  const HL = (W - hRowW) / 2
  const hx = (i) => HL + i * (hW + hGap) + hW / 2

  const mk = svgEl
  const svgRoot = mk('svg', {
    class: 'viz__svg kth__svg',
    viewBox: `0 0 ${W} ${height}`,
    role: 'img',
    'aria-label': '第 K 大 最小堆扫描动画',
  })
  const markLayer = mk('g', { class: 'kth-marks' })
  const cellLayer = mk('g', { class: 'kth-cells' })
  svgRoot.appendChild(markLayer)
  svgRoot.appendChild(cellLayer)

  const note = mk('text', { class: 'kth-note', x: 30, y: 22 })
  note.textContent = dedupe
    ? `去重口径：distinct 值里第 ${k} 大 —— 重复值只算一次`
    : `不去重口径：降序排列后第 ${k} 个（下标 ${k - 1}）`
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'kth-banner__box', x: 30, y: BANNER_TOP, width: W - 60, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'kth-banner__seg', x: 46, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'kth-banner__seg', x: 196, y: BANNER_TOP + BANNER_H / 2 })
  const segVal = mk('text', { class: 'kth-banner__val', x: W - 46, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(segVal)

  const arrLabel = mk('text', { class: 'kth-label', x: AL - 12, y: ARR_Y + ARR_H / 2 })
  arrLabel.textContent = '输入'
  markLayer.appendChild(arrLabel)
  const heapLabel = mk('text', { class: 'kth-label', x: HL - 12, y: HEAP_Y + HEAP_H / 2 })
  heapLabel.textContent = '堆'
  markLayer.appendChild(heapLabel)

  const arrEls = []
  for (let i = 0; i < n; i += 1) {
    const g = mk('g', { class: 'kth-cell' })
    g.appendChild(
      mk('rect', { class: 'kth-cell__box', x: ax(i) - aW / 2, y: ARR_Y, width: aW, height: ARR_H, rx: 5 }),
    )
    const val = mk('text', { class: 'kth-cell__val', x: ax(i), y: ARR_Y + ARR_H / 2 })
    val.textContent = String(s0.nums[i])
    g.appendChild(val)
    cellLayer.appendChild(g)
    arrEls.push({ g, val })
  }

  const heapEls = []
  for (let i = 0; i < k; i += 1) {
    const g = mk('g', { class: 'kth-heap' })
    g.appendChild(
      mk('rect', { class: 'kth-heap__box', x: hx(i) - hW / 2, y: HEAP_Y, width: hW, height: HEAP_H, rx: 6 }),
    )
    const val = mk('text', { class: 'kth-heap__val', x: hx(i), y: HEAP_Y + 20 })
    const idx = mk('text', { class: 'kth-heap__idx', x: hx(i), y: HEAP_Y + HEAP_H - 11 })
    idx.textContent = `#${i}`
    g.appendChild(val)
    g.appendChild(idx)
    cellLayer.appendChild(g)
    heapEls.push({ g, val })
  }

  const hintText = mk('text', { class: 'kth-hint', x: W / 2, y: HINT_Y })
  markLayer.appendChild(hintText)

  const ansBox = mk('rect', { class: 'kth-ans__box', x: 60, y: ANS_Y, width: W - 120, height: ANS_H, rx: 10 })
  const ansText = mk('text', { class: 'kth-ans__text', x: W / 2, y: ANS_Y + ANS_H / 2 })
  markLayer.appendChild(ansBox)
  markLayer.appendChild(ansText)

  const phaseText = mk('text', { class: 'kth-phase__text', x: W / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const ACTION_TEXT = {
    fill: '入堆（堆还没满）',
    accept: '挤掉堆顶，换它',
    reject: '小于堆顶，丢弃',
    dup: '重复值，丢弃',
  }

  function paint(_index, step) {
    if (!step) return
    const { phase, idx, val, action, heap, siftPath, rejected, solvable, answer } = step
    const isDone = phase === 'done'
    const isReject = phase === 'reject'
    const siftSet = new Set(siftPath)

    // 输入行三态
    arrEls.forEach((el, i) => {
      const cls = ['kth-cell']
      if (i > idx) cls.push('is-ghost')
      else if (isReject && i === idx) cls.push('is-out')
      else if (i === idx && !isDone) cls.push('is-cur')
      else if (rejected.includes(s0.nums[i]) && i < idx) cls.push('is-out')
      else cls.push('is-in')
      el.g.setAttribute('class', cls.join(' '))
    })

    // 堆行
    heapEls.forEach((el, i) => {
      const cls = ['kth-heap']
      if (i >= heap.length) cls.push('is-ghost')
      else {
        if (i === 0) cls.push('is-top')
        if (siftSet.has(i)) cls.push('is-sift')
      }
      el.g.setAttribute('class', cls.join(' '))
      el.val.textContent = i < heap.length ? String(heap[i]) : ''
    })

    hintText.textContent = isDone
      ? ''
      : `堆顶 = ${heap.length ? heap[0] : '-'}（当前第 ${k} 大） · 已丢弃 ${rejected.length} 个`
    hintText.setAttribute('class', `kth-hint ${phase === 'accept' ? 'is-hot' : ''}`)

    ansBox.setAttribute('class', `kth-ans__box ${isDone ? (solvable ? 'is-on' : 'is-on is-none') : ''}`)
    ansText.setAttribute('class', `kth-ans__text ${isDone ? (solvable ? 'is-on' : 'is-on is-none') : ''}`)
    ansText.textContent = isDone
      ? solvable
        ? `第 ${k} 大${dedupe ? '（去重）' : ''} = ${answer}`
        : `只有 ${heap.length} 个不同值，凑不齐第 ${k} 大 —— 无解`
      : ''

    if (phase === 'init') {
      segRound.textContent = '准备'
      segAct.textContent = `size-${k} 最小堆`
      segVal.textContent = `n = ${n}`
    } else if (isDone) {
      segRound.textContent = '扫完'
      segAct.textContent = solvable ? `堆顶就是答案` : '无解'
      segVal.textContent = solvable ? String(answer) : 'null'
    } else {
      segRound.textContent = `第 ${idx + 1} 个`
      segAct.textContent = ACTION_TEXT[action] || ''
      segVal.textContent = `${val} vs 堆顶 ${heap.length >= k ? heap[0] : '-'}`
    }

    phaseText.textContent = isDone
      ? `每个元素最多进出堆一次：均摊 O(n log ${k})，k 固定时就是 O(n)；空间只用一个 size-${k} 的堆。`
      : phase === 'accept'
        ? `大于堆顶才替换 —— 堆里始终是「到目前位置最大的 ${k} 个」，所以扫完堆顶就是第 ${k} 大。`
        : phase === 'reject'
          ? `小于等于堆顶，连前 ${k} 大都进不去 —— 这是堆比排序省时间的地方：大部分元素被 O(1) 丢掉。`
          : '堆没满时直接入堆并向上调整；满了之后才需要比较。'

    renderRichText(descEl, step.desc)
  }

  const descEl = makeDesc()
  const rootEl = document.createElement('div')
  rootEl.className = 'viz kth'
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
      delete host.dataset[datasetKey]
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}

/**
 * 第 K 大（不去重口径，默认 k=10）。
 * @param {HTMLElement} host
 * @param {{ nums?: number[], k?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountKthLarge(host, options = {}) {
  return mountMode(host, options, false, 'kthMounted')
}

/**
 * 第 K 大（去重口径）。
 * @param {HTMLElement} host
 * @param {{ nums?: number[], k?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountKthLargeDup(host, options = {}) {
  return mountMode(host, options, true, 'kthDupMounted')
}
