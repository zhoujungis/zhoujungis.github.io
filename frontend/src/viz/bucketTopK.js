/**
 * bucketTopK.js — 「前 K 个高频元素」(LeetCode 347) 桶排序解法的 SVG 渲染层。
 *
 * 逻辑全在 bucketTopKSteps.js 里，这里只负责把一帧快照画出来。要画五块：
 *
 *   1. 频率卡片行  —— 每个不同的值一张小卡片 `1 x 3`，count 帧逐张点亮
 *   2. 桶行        —— 下标 0..n 的桶格子（频率即下标），桶内列出收进来的值
 *   3. 收集指针    —— 桶行上方的橙色三角 + `f=n`，从右往左扫
 *   4. 答案格      —— 桶行下方 k 个小格，collect 帧逐个点亮
 *   5. 横幅        —— k / 进度 / 当前动作 / 答案
 *
 * ⚠️ 两条视觉通道分开用（SKILL 坑 V）：
 *   - 格子**底色** = 归属：空桶（灰）/ 刚放入（金）/ 已收集（绿）
 *   - 格子**边框** = 本帧强调：收集指针所在（橙粗）
 *
 * ⚠️ 通用坑：A（CSS 变量字面量兜底）/ K（标签最后画）/ X（横幅 x 从左往右）/
 *   红线 4（标签只用 ASCII —— 桶内用逗号分隔，不用特殊符号）。
 */

import { buildBucketTopKSteps } from './bucketTopKSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'bk-styles'

// ── 布局常量（SVG 用户单位）────────────────────────────────────────────────
const NOTE_Y = 54
const BANNER_TOP = 84
const BANNER_H = 46

const FREQ_CARD_Y = 150 // 频率卡片行
const FREQ_CARD_H = 40

const COLLECT_TAG_TOP = 214 // 收集指针标签框顶
const COLLECT_TRI_TOP = 238 // 指针三角顶 → 尖端贴桶行上沿

const BUCKET_Y = 252
const BUCKET_H = 62

const ANS_LINE_Y = 332
const ANS_TEXT_Y = 348

const LABEL_X = 26
const AVAIL = 604
const BUCKET_W_MIN = 40
const BUCKET_GAP = 5

const PLAY_MS = 1250

const STYLES = `
.bk {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.bk__svg { width: 100%; height: auto; display: block; }

.bk-note {
  fill: var(--bk-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 横幅 ─────────────────────────────────────────────────────────────── */
.bk-banner__box {
  fill: var(--bk-banner, #f4f3ef);
  stroke: var(--bk-line, #c3c9c2);
  stroke-width: 1.5;
}
.bk-banner__seg {
  fill: var(--bk-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-banner__ans {
  fill: var(--bk-gold, #c2872f);
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 频率卡片 ─────────────────────────────────────────────────────────── */
.bk-freq__box {
  fill: var(--bk-fill, #ffffff);
  stroke: var(--bk-line, #c3c9c2);
  stroke-width: 1.5;
}
.bk-freq__text {
  fill: var(--bk-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-freq.is-lit .bk-freq__box {
  fill: var(--bk-gold-fill, #fdf3e3);
  stroke: var(--bk-gold, #c2872f);
  stroke-width: 2;
}
.bk-freq.is-lit .bk-freq__text { fill: var(--bk-gold, #c2872f); }

/* ── 桶 ───────────────────────────────────────────────────────────────── */
.bk-bucket__box {
  fill: var(--bk-fill, #ffffff);
  stroke: var(--bk-line, #c3c9c2);
  stroke-width: 1.5;
}
.bk-bucket__f {
  fill: var(--bk-muted, #657168);
  font-size: 11.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-bucket__items {
  fill: var(--bk-ink, #1f2a24);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
/* 通道一（底色）：空桶 */
.bk-bucket.is-empty .bk-bucket__box {
  fill: var(--bk-dim-fill, #f0efea);
  stroke-dasharray: 4 3;
}
.bk-bucket.is-empty .bk-bucket__items { fill: var(--bk-dim, #b9b9b3); }
/* 通道一（底色）：本帧刚放入的桶 */
.bk-bucket.is-new .bk-bucket__box {
  fill: var(--bk-gold-fill, #fdf3e3);
  stroke: var(--bk-gold, #c2872f);
  stroke-width: 2;
}
.bk-bucket.is-new .bk-bucket__items { fill: var(--bk-gold, #c2872f); }
/* 通道一（底色）：已经从这只桶收过答案 */
.bk-bucket.is-collected .bk-bucket__box {
  fill: var(--bk-ok-fill, #eef5f1);
  stroke: var(--bk-ok, #3f6b57);
  stroke-width: 2;
}
.bk-bucket.is-collected .bk-bucket__items { fill: var(--bk-ok, #3f6b57); }
/* 通道二（边框）：收集指针所在 */
.bk-bucket.is-scanned .bk-bucket__box {
  stroke: var(--bk-hot, #a45f45);
  stroke-width: 3;
}

/* ── 收集指针 ─────────────────────────────────────────────────────────── */
.bk-collect__tag { fill: var(--bk-hot, #a45f45); }
.bk-collect__tri { fill: var(--bk-hot, #a45f45); }
.bk-collect__text {
  fill: var(--bk-paper, #ffffff);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ── 答案格 ───────────────────────────────────────────────────────────── */
.bk-ans__box {
  fill: var(--bk-fill, #ffffff);
  stroke: var(--bk-line, #c3c9c2);
  stroke-width: 1.5;
}
.bk-ans__text {
  fill: var(--bk-gold, #c2872f);
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-ans__label {
  fill: var(--bk-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.bk-ans.is-filled .bk-ans__box {
  fill: var(--bk-ok-fill, #eef5f1);
  stroke: var(--bk-ok, #3f6b57);
  stroke-width: 2;
}

.bk-empty__text {
  fill: var(--bk-muted, #657168);
  font-size: 14px;
  text-anchor: middle;
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
 * @param {{ nums?: number[], k?: number, autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountBucketTopK(host, options = {}) {
  if (!host || host.dataset.bkMounted === '1') return { destroy() {} }
  host.dataset.bkMounted = '1'
  ensureStyles()

  const steps = buildBucketTopKSteps(options)
  const autoplay = options.autoplay !== false

  const nums = steps[0].nums
  const n = nums.length

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz bk'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  function descEl() {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  if (n === 0) {
    const w0 = 620
    const h0 = 120
    const s0 = mk('svg', { class: 'viz__svg bk__svg', viewBox: `0 0 ${w0} ${h0}`, role: 'img' })
    const t0 = mk('text', { class: 'bk-empty__text', x: w0 / 2, y: h0 / 2 })
    t0.textContent = '空数组 —— 没有高频元素可取'
    s0.appendChild(t0)
    stage.appendChild(s0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    ensureChromeStyles()
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.bkMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  const distinct = []
  const seen = new Set()
  for (const v of nums) {
    if (!seen.has(v)) {
      seen.add(v)
      distinct.push(v)
    }
  }

  const bucketCount = n + 1

  // ── 桶宽自适应 ───────────────────────────────────────────────────────────
  let bucketW = 52
  const needW0 = bucketCount * bucketW + (bucketCount - 1) * BUCKET_GAP
  if (needW0 > AVAIL) {
    bucketW = Math.max(BUCKET_W_MIN, Math.floor((AVAIL - (bucketCount - 1) * BUCKET_GAP) / bucketCount))
  }
  const rowW = bucketCount * bucketW + (bucketCount - 1) * BUCKET_GAP
  const width = Math.max(660, LABEL_X * 2 + rowW)
  const ROW_LEFT = (width - rowW) / 2
  const bucketX = (f) => ROW_LEFT + f * (bucketW + BUCKET_GAP)
  const bucketCX = (f) => bucketX(f) + bucketW / 2

  const BANNER_W = width - LABEL_X * 2
  const height = ANS_TEXT_Y + 22

  const svgRoot = mk('svg', {
    class: 'viz__svg bk__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '前 K 个高频元素 桶排序推演动画',
  })
  stage.appendChild(svgRoot)

  // 分层：格子 → 强调线 → 标签（见坑 K）
  const cellLayer = mk('g', { class: 'bk-cells' })
  const markLayer = mk('g', { class: 'bk-marks' })
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(markLayer)

  // ── 顶部小字 + 横幅 ──────────────────────────────────────────────────────
  const note = mk('text', { class: 'bk-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = '频率天然落在 [1, n] —— 用频率当桶下标，排序就免费了'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', {
      class: 'bk-banner__box',
      x: LABEL_X,
      y: BANNER_TOP,
      width: BANNER_W,
      height: BANNER_H,
      rx: 9,
    }),
  )
  const segK = mk('text', { class: 'bk-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'bk-banner__seg', x: LABEL_X + 210, y: BANNER_TOP + BANNER_H / 2 })
  const ansVal = mk('text', {
    class: 'bk-banner__ans',
    x: LABEL_X + BANNER_W - 18,
    y: BANNER_TOP + BANNER_H / 2,
  })
  markLayer.appendChild(segK)
  markLayer.appendChild(segAct)
  markLayer.appendChild(ansVal)

  // ── 频率卡片 ─────────────────────────────────────────────────────────────
  const freqW = Math.min(72, Math.max(46, Math.floor((rowW - (distinct.length - 1) * 8) / Math.max(distinct.length, 1))))
  const freqTotalW = distinct.length * freqW + (distinct.length - 1) * 8
  const freqLeft = (width - freqTotalW) / 2
  const freqEls = distinct.map((v, i) => {
    const g = mk('g', { class: 'bk-freq' })
    const x = freqLeft + i * (freqW + 8)
    g.appendChild(mk('rect', { class: 'bk-freq__box', x, y: FREQ_CARD_Y, width: freqW, height: FREQ_CARD_H, rx: 6 }))
    const t = mk('text', { class: 'bk-freq__text', x: x + freqW / 2, y: FREQ_CARD_Y + FREQ_CARD_H / 2 })
    g.appendChild(t)
    cellLayer.appendChild(g)
    return { g, t, v }
  })

  // ── 桶行 ─────────────────────────────────────────────────────────────────
  const bucketEls = []
  for (let f = 0; f <= n; f += 1) {
    const x = bucketX(f)
    const g = mk('g', { class: 'bk-bucket' })
    g.appendChild(mk('rect', { class: 'bk-bucket__box', x, y: BUCKET_Y, width: bucketW, height: BUCKET_H, rx: 6 }))
    const fLab = mk('text', { class: 'bk-bucket__f', x: bucketCX(f), y: BUCKET_Y + 14 })
    fLab.textContent = `f=${f}`
    g.appendChild(fLab)
    const items = mk('text', { class: 'bk-bucket__items', x: bucketCX(f), y: BUCKET_Y + 40 })
    g.appendChild(items)
    cellLayer.appendChild(g)
    bucketEls.push({ g, items, f })
  }

  // ── 收集指针 ─────────────────────────────────────────────────────────────
  const cTri = mk('path', { class: 'bk-collect__tri', d: 'M 0 0 L 0 0 L 0 0' })
  const cTag = mk('rect', { class: 'bk-collect__tag', x: 0, y: COLLECT_TAG_TOP, width: 54, height: 22, rx: 6 })
  const cText = mk('text', { class: 'bk-collect__text', x: 0, y: COLLECT_TAG_TOP + 11 })
  markLayer.appendChild(cTri)
  markLayer.appendChild(cTag)
  markLayer.appendChild(cText)

  // ── 答案格 ───────────────────────────────────────────────────────────────
  const k0 = steps[0].k
  const ansW = 44
  const ansGap = 10
  const ansTotal = k0 * ansW + (k0 - 1) * ansGap
  const ansLeft = (width - ansTotal) / 2
  const ansLabel = mk('text', { class: 'bk-ans__label', x: LABEL_X, y: ANS_LINE_Y + 18 })
  ansLabel.textContent = `答案（收满 ${k0} 个停）`
  markLayer.appendChild(ansLabel)
  const ansEls = []
  for (let i = 0; i < k0; i += 1) {
    const g = mk('g', { class: 'bk-ans' })
    const x = ansLeft + i * (ansW + ansGap)
    g.appendChild(mk('rect', { class: 'bk-ans__box', x, y: ANS_LINE_Y, width: ansW, height: 36, rx: 6 }))
    const t = mk('text', { class: 'bk-ans__text', x: x + ansW / 2, y: ANS_LINE_Y + 18 })
    g.appendChild(t)
    markLayer.appendChild(g)
    ansEls.push({ g, t })
  }

  // ── 每帧重绘 ─────────────────────────────────────────────────────────────
  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const phase = step.phase
    const { buckets, freq, ans } = step

    // 频率卡片：已数出的点亮
    for (const el of freqEls) {
      const known = freq[el.v] !== undefined
      el.t.textContent = known ? `${el.v} x ${freq[el.v]}` : `${el.v} x ?`
      el.g.setAttribute('class', known ? 'bk-freq is-lit' : 'bk-freq')
    }

    // 桶行
    const collectedBuckets = new Set()
    for (const v of ans) {
      collectedBuckets.add(freq[v])
    }
    for (const el of bucketEls) {
      const f = el.f
      const list = buckets[f]
      el.items.textContent = list.length ? list.join(',') : ''
      const cls = ['bk-bucket']
      if (list.length === 0) cls.push('is-empty')
      if (collectedBuckets.has(f)) cls.push('is-collected')
      if (phase === 'bucket' && step.bucketIdx === f) cls.push('is-new')
      if (phase === 'collect' && step.collectIdx === f) cls.push('is-scanned')
      el.g.setAttribute('class', cls.join(' '))
    }

    // 收集指针
    if (phase === 'collect' && step.collectIdx !== null) {
      const cx = bucketCX(step.collectIdx)
      const tip = BUCKET_Y - 2
      cTri.setAttribute('d', `M ${cx - 7} ${tip - 12} L ${cx + 7} ${tip - 12} L ${cx} ${tip} z`)
      cTag.setAttribute('x', cx - 27)
      cText.setAttribute('x', cx)
      cText.textContent = `f=${step.collectIdx}`
      cTri.style.opacity = '1'
      cTag.style.opacity = '1'
      cText.style.opacity = '1'
    } else {
      cTri.style.opacity = '0'
      cTag.style.opacity = '0'
      cText.style.opacity = '0'
    }

    // 答案格
    for (let i = 0; i < ansEls.length; i += 1) {
      const filled = i < ans.length
      ansEls[i].t.textContent = filled ? String(ans[i]) : '?'
      ansEls[i].g.setAttribute('class', filled ? 'bk-ans is-filled' : 'bk-ans')
    }

    // 横幅
    segK.textContent = `前 ${step.k} 高频 · 已收 ${step.collected}/${step.k}`
    if (phase === 'count') {
      segAct.textContent = `计数：${step.cur} 出现 ${step.curFreq} 次`
    } else if (phase === 'bucket') {
      segAct.textContent = `${step.cur} 进桶 f=${step.bucketIdx}`
    } else if (phase === 'collect') {
      segAct.textContent =
        step.cur !== null ? `收集 f=${step.collectIdx} 里的 ${step.cur}` : `桶 f=${step.collectIdx} 是空的，跳过`
    } else if (phase === 'init') {
      segAct.textContent = '哈希计数 → 按频率入桶 → 从右往左收'
    } else {
      segAct.textContent = '收满了'
    }
    ansVal.textContent = ans.length >= step.k ? `答案 [${ans.join(', ')}]` : '答案 ?'

    renderRichText(desc, step.desc)
  }

  rootEl.appendChild(desc)
  const controls = createControls()
  rootEl.appendChild(controls.root)

  host.textContent = ''
  host.appendChild(rootEl)
  ensureChromeStyles()

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const player = createPlayer({
    steps,
    controls,
    intervalMs: PLAY_MS,
    onRender: paint,
  })
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
      delete host.dataset.bkMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
