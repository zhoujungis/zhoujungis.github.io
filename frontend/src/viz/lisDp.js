/**
 * lisDp.js — 「最长递增子序列」(LC 300) O(n^2) 动态规划的 SVG 渲染层。
 *
 * 一排 nums 格子（值 + 下标）+ i 徽标在上、j 徽标在下 + 对应的 dp 行
 * （每格是「以它结尾」的长度）+ 答案行。链上的格子用金色填充，
 * 最优前驱用金框 + 外环。
 *
 * 通用坑：A / K / L / V / W。
 */

import { buildLisDpSteps } from './lisDpSteps.js'
import { createControls, createPlayer, ensureChromeStyles, renderRichText, svgEl } from './widgetChrome'

const STYLE_ID = 'lisdp-styles'

const NOTE_Y = 26
const BANNER_TOP = 44
const BANNER_H = 44
const I_BADGE_Y = 112
const ARR_Y = 124
const ARR_H = 52
const J_BADGE_Y = 200
const DP_Y = 212
const DP_H = 34
const ANS_Y = 260
const ANS_H = 32
const PHASE_Y = 316

const LABEL_X = 30
const AVAIL = 604
const PLAY_MS = 950

const STYLES = `
.lisdp {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.lisdp__svg { width: 100%; height: auto; display: block; }

.lisdp-note {
  fill: var(--lisdp-muted, #657168);
  font-size: 12.5px;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisdp-banner__box {
  fill: var(--lisdp-banner, #f4f3ef);
  stroke: var(--lisdp-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisdp-banner__seg {
  fill: var(--lisdp-ink, #1f2a24);
  font-size: 15px;
  font-weight: 600;
  text-anchor: start;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisdp-banner__val {
  fill: var(--lisdp-gold, #c2872f);
  font-size: 17px;
  font-weight: 700;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisdp-cell__box {
  fill: var(--lisdp-fill, #ffffff);
  stroke: var(--lisdp-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisdp-cell__val {
  fill: var(--lisdp-ink, #1f2a24);
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisdp-cell__sub {
  fill: var(--lisdp-dim, #9aa39c);
  font-size: 10.5px;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

/* ---- 通道一：底色（可接 / 链上）。is-chain 写在后面，同权重时覆盖 is-cand ---- */
.lisdp-cell.is-cand .lisdp-cell__box { fill: var(--lisdp-ok-fill, #eef5f1); }
.lisdp-cell.is-chain .lisdp-cell__box { fill: var(--lisdp-gold-fill, #fdf3e3); }
/* ---- 通道二：边框 ---- */
.lisdp-cell.is-cur .lisdp-cell__box {
  stroke: var(--lisdp-hot, #a45f45);
  stroke-width: 3;
}
.lisdp-cell.is-cur .lisdp-cell__val { fill: var(--lisdp-hot, #a45f45); }
.lisdp-cell.is-better .lisdp-cell__box {
  stroke: var(--lisdp-gold, #c2872f);
  stroke-width: 3;
}
.lisdp-cell.is-better .lisdp-cell__val { fill: var(--lisdp-gold, #c2872f); }
.lisdp-cell.is-dead .lisdp-cell__box {
  stroke: var(--lisdp-dim, #9aa39c);
  stroke-dasharray: 4 3;
  stroke-width: 2;
}
.lisdp-cell.is-dead .lisdp-cell__val { fill: var(--lisdp-dim, #9aa39c); }
.lisdp-cell.is-scan .lisdp-cell__box {
  stroke: var(--lisdp-ok, #3f6b57);
  stroke-width: 2.5;
}
.lisdp-cell.is-scan .lisdp-cell__val { fill: var(--lisdp-ok, #3f6b57); }
.lisdp-cell.is-ghost .lisdp-cell__box {
  fill: none;
  stroke: var(--lisdp-dim, #9aa39c);
  stroke-dasharray: 3 3;
  stroke-width: 1.2;
}
.lisdp-cell.is-ghost .lisdp-cell__val { fill: var(--lisdp-dim, #9aa39c); }
.lisdp-cell.is-growing .lisdp-cell__box {
  fill: var(--lisdp-gold-fill, #fdf3e3);
  stroke: var(--lisdp-hot, #a45f45);
  stroke-dasharray: 5 3;
  stroke-width: 2.5;
}
.lisdp-cell.is-growing .lisdp-cell__val { fill: var(--lisdp-hot, #a45f45); }
.lisdp-cell.is-fresh .lisdp-cell__box {
  fill: var(--lisdp-gold-fill, #fdf3e3);
  stroke: var(--lisdp-gold, #c2872f);
  stroke-width: 3;
}
.lisdp-cell.is-fresh .lisdp-cell__val { fill: var(--lisdp-gold, #c2872f); }

.lisdp-ring {
  fill: none;
  stroke: var(--lisdp-gold, #c2872f);
  stroke-width: 2;
  stroke-dasharray: 5 4;
  opacity: 0;
}
.lisdp-ring.is-on { opacity: 1; }

.lisdp-badge__box {
  fill: var(--lisdp-hot, #a45f45);
  opacity: 0;
}
.lisdp-badge__box.is-on { opacity: 1; }
.lisdp-badge__text {
  fill: #ffffff;
  font-size: 11.5px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
  opacity: 0;
}
.lisdp-badge__text.is-on { opacity: 1; }

.lisdp-label {
  fill: var(--lisdp-muted, #657168);
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.lisdp-ans__box {
  fill: var(--lisdp-banner, #f4f3ef);
  stroke: var(--lisdp-line, #c3c9c2);
  stroke-width: 1.5;
}
.lisdp-ans__box.is-hot {
  fill: var(--lisdp-gold-fill, #fdf3e3);
  stroke: var(--lisdp-gold, #c2872f);
  stroke-width: 2;
}
.lisdp-ans__text {
  fill: var(--lisdp-ink, #1f2a24);
  font-size: 14px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: central;
  font-family: 'SFMono-Regular', Consolas, monospace;
}
.lisdp-ans__text.is-hot { fill: var(--lisdp-gold, #c2872f); }

.lisdp-phase__text {
  fill: var(--lisdp-muted, #657168);
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

/** 从 endIdx 沿 parent 回溯，得到「最优链」上的下标集合。 */
function chainOf(step, endIdx) {
  const set = new Set()
  if (endIdx === null || endIdx === undefined || endIdx < 0) return set
  let cur = endIdx
  let guard = 0
  while (cur >= 0 && guard < 128) {
    set.add(cur)
    const next = step.parent && step.parent[cur] !== undefined ? step.parent[cur] : -1
    cur = next
    guard += 1
  }
  return set
}

/**
 * 挂载动画。
 * @param {HTMLElement} host
 * @param {{ nums?: number[], autoplay?: boolean, initialStep?: number }} [options]
 */
export function mountLisDp(host, options = {}) {
  if (!host || host.dataset.lisdpMounted === '1') return { destroy() {} }
  host.dataset.lisdpMounted = '1'
  ensureStyles()

  const steps = buildLisDpSteps(options)
  const autoplay = options.autoplay !== false
  const s0 = steps[0]
  const nums = s0.nums
  const n = s0.n

  const mk = svgEl

  const rootEl = document.createElement('div')
  rootEl.className = 'viz lisdp'
  const stage = document.createElement('div')
  stage.className = 'viz__stage'
  rootEl.appendChild(stage)

  const descEl = () => {
    const p = document.createElement('p')
    p.className = 'viz__desc'
    p.setAttribute('aria-live', 'polite')
    return p
  }

  if (n === 0) {
    const svg0 = mk('svg', { class: 'viz__svg lisdp__svg', viewBox: '0 0 620 120', role: 'img' })
    const t0 = mk('text', {
      x: 310,
      y: 60,
      style: 'fill: var(--lisdp-muted, #657168); font-size: 14px; text-anchor: middle;',
    })
    t0.textContent = '数组为空 —— 没有子序列，答案是 0'
    svg0.appendChild(t0)
    stage.appendChild(svg0)
    rootEl.appendChild(descEl())
    rootEl.appendChild(createControls().root)
    host.textContent = ''
    host.appendChild(rootEl)
    ensureChromeStyles()
    return {
      destroy() {
        host.textContent = ''
        delete host.dataset.lisdpMounted
        document.getElementById(STYLE_ID)?.remove()
      },
    }
  }

  const gap = 8
  let cellW = 56
  const need = n * cellW + (n - 1) * gap
  if (need > AVAIL) cellW = Math.max(24, Math.floor((AVAIL - (n - 1) * gap) / n))
  const rowW = n * cellW + (n - 1) * gap
  const width = Math.max(660, LABEL_X * 2 + rowW)
  const LEFT = (width - rowW) / 2
  const cx = (i) => LEFT + i * (cellW + gap) + cellW / 2
  const BANNER_W = width - LABEL_X * 2
  const height = PHASE_Y + 22

  const svgRoot = mk('svg', {
    class: 'viz__svg lisdp__svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': '最长递增子序列 动态规划推演动画',
  })
  stage.appendChild(svgRoot)

  const markLayer = mk('g', { class: 'lisdp-marks' })
  const cellLayer = mk('g', { class: 'lisdp-cells' })
  const labelLayer = mk('g', { class: 'lisdp-labels' })
  svgRoot.appendChild(markLayer)
  svgRoot.appendChild(cellLayer)
  svgRoot.appendChild(labelLayer)

  const note = mk('text', { class: 'lisdp-note', x: LABEL_X, y: NOTE_Y })
  note.textContent = 'dp[i] = 以 nums[i] 结尾的最长递增子序列长度 —— 答案是整个 dp 的最大值'
  markLayer.appendChild(note)

  markLayer.appendChild(
    mk('rect', { class: 'lisdp-banner__box', x: LABEL_X, y: BANNER_TOP, width: BANNER_W, height: BANNER_H, rx: 9 }),
  )
  const segRound = mk('text', { class: 'lisdp-banner__seg', x: LABEL_X + 18, y: BANNER_TOP + BANNER_H / 2 })
  const segAct = mk('text', { class: 'lisdp-banner__seg', x: LABEL_X + 210, y: BANNER_TOP + BANNER_H / 2 })
  const segVal = mk('text', { class: 'lisdp-banner__val', x: width - LABEL_X - 18, y: BANNER_TOP + BANNER_H / 2 })
  markLayer.appendChild(segRound)
  markLayer.appendChild(segAct)
  markLayer.appendChild(segVal)

  const arrLabel = mk('text', { class: 'lisdp-label', x: LEFT - 14, y: ARR_Y + ARR_H / 2 })
  arrLabel.textContent = 'nums'
  markLayer.appendChild(arrLabel)
  const dpLabel = mk('text', { class: 'lisdp-label', x: LEFT - 14, y: DP_Y + DP_H / 2 })
  dpLabel.textContent = 'dp'
  markLayer.appendChild(dpLabel)

  // nums 行
  const arrEls = []
  for (let i = 0; i < n; i += 1) {
    const g = mk('g', { class: 'lisdp-cell' })
    g.appendChild(
      mk('rect', { class: 'lisdp-cell__box', x: cx(i) - cellW / 2, y: ARR_Y, width: cellW, height: ARR_H, rx: 6 }),
    )
    const val = mk('text', { class: 'lisdp-cell__val', x: cx(i), y: ARR_Y + ARR_H / 2 - 7 })
    val.textContent = String(nums[i])
    g.appendChild(val)
    const sub = mk('text', { class: 'lisdp-cell__sub', x: cx(i), y: ARR_Y + ARR_H - 11 })
    sub.textContent = `#${i}`
    g.appendChild(sub)
    cellLayer.appendChild(g)
    arrEls.push({ g })
  }

  // dp 行
  const dpEls = []
  for (let i = 0; i < n; i += 1) {
    const g = mk('g', { class: 'lisdp-cell' })
    g.appendChild(
      mk('rect', { class: 'lisdp-cell__box', x: cx(i) - cellW / 2, y: DP_Y, width: cellW, height: DP_H, rx: 6 }),
    )
    const val = mk('text', { class: 'lisdp-cell__val', x: cx(i), y: DP_Y + DP_H / 2 })
    g.appendChild(val)
    cellLayer.appendChild(g)
    dpEls.push({ g, val })
  }

  // 最优前驱外环
  const rings = []
  for (let i = 0; i < n; i += 1) {
    const r = mk('rect', {
      class: 'lisdp-ring',
      x: cx(i) - cellW / 2 - 5,
      y: ARR_Y - 5,
      width: cellW + 10,
      height: ARR_H + 10,
      rx: 9,
    })
    markLayer.appendChild(r)
    rings.push(r)
  }

  // i / j 徽标
  const makeBadge = (label, y) => {
    const g = mk('g', { class: 'lisdp-badge' })
    const box = mk('rect', { class: 'lisdp-badge__box', x: cx(0) - 10, y: y - 9, width: 20, height: 18, rx: 5 })
    const text = mk('text', { class: 'lisdp-badge__text', x: cx(0), y })
    text.textContent = label
    g.appendChild(box)
    g.appendChild(text)
    markLayer.appendChild(g)
    return { g, box, text }
  }
  const iBadge = makeBadge('i', I_BADGE_Y)
  const jBadge = makeBadge('j', J_BADGE_Y)

  // 答案行
  const ansBox = mk('rect', { class: 'lisdp-ans__box', x: LEFT, y: ANS_Y, width: rowW, height: ANS_H, rx: 8 })
  markLayer.appendChild(ansBox)
  const ansText = mk('text', { class: 'lisdp-ans__text', x: LEFT + rowW / 2, y: ANS_Y + ANS_H / 2 })
  markLayer.appendChild(ansText)

  const phaseText = mk('text', { class: 'lisdp-phase__text', x: width / 2, y: PHASE_Y })
  markLayer.appendChild(phaseText)

  const desc = descEl()

  function paint(_index, step) {
    if (!step) return
    const phase = step.phase
    const isScan = phase === 'scan'
    const isSettle = phase === 'settle'
    const isDone = phase === 'done'
    const i = step.i
    const j = step.j
    const cands = step.cands || []
    const candSet = new Set(cands)
    const endIdx = isDone ? step.bestEnd : i
    const chainSet = chainOf(step, endIdx)
    const answer = step.answer

    // nums 行：多种状态在 JS 里就选好，不交给 CSS 层叠顺序
    arrEls.forEach((el, k) => {
      const cls = ['lisdp-cell']
      if (chainSet.has(k)) cls.push('is-chain')
      if (candSet.has(k)) cls.push('is-cand')
      if (i !== null && !isDone && k === i) cls.push('is-cur')
      else if (isScan && k === j) cls.push(step.ok ? 'is-scan' : 'is-dead')
      if (!isDone && step.bestJ !== null && step.bestJ >= 0 && k === step.bestJ && k !== i) {
        cls.push('is-better')
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    // dp 行
    const settled = step.settled || 0
    dpEls.forEach((el, k) => {
      const cls = ['lisdp-cell']
      if (i !== null && k === i && settled === i) {
        cls.push('is-growing')
        el.val.textContent = String(step.best ?? '')
      } else if (k < settled) {
        el.val.textContent = String(step.dp[k])
        if (isSettle && k === i) cls.push('is-fresh')
        else if (chainSet.has(k)) cls.push('is-chain')
      } else {
        el.val.textContent = ''
        cls.push('is-ghost')
      }
      el.g.setAttribute('class', cls.join(' '))
    })

    // 最优前驱外环（done 帧收起 —— 那时用整条金链说话）
    const ringOn = !isDone && step.bestJ !== null && step.bestJ >= 0 && i !== null && step.bestJ < i
    rings.forEach((r, k) => {
      r.classList.toggle('is-on', ringOn && k === step.bestJ)
    })

    // i / j 徽标
    const placeBadge = (badge, idx, on) => {
      badge.box.classList.toggle('is-on', on)
      badge.text.classList.toggle('is-on', on)
      if (on) {
        badge.box.setAttribute('x', cx(idx) - 10)
        badge.text.setAttribute('x', cx(idx))
      }
    }
    placeBadge(iBadge, i ?? 0, i !== null && !isDone)
    placeBadge(jBadge, j ?? 0, isScan && j !== null)

    // 答案行：与上一帧比，涨了就点亮（用下标推导，不依赖调用顺序）
    ansText.textContent = `目前最长递增子序列长度 = ${answer}`
    const prevAnswer = _index > 0 ? steps[_index - 1].answer : 0
    const grew = answer > prevAnswer
    ansBox.classList.toggle('is-hot', grew || isDone)
    ansText.classList.toggle('is-hot', grew || isDone)

    // 横幅
    if (isScan || isSettle) {
      segRound.textContent = `i = ${i} · 值 ${nums[i]}`
      if (isScan) {
        const acts = [`看 j = ${j}`]
        if (!step.ok) acts.push(`${nums[j]} 接不上`)
        else if (step.better) acts.push(`接上 dp[${j}] → ${step.best}`)
        else acts.push(`接上不如当前`)
        segAct.textContent = acts.join(' · ')
      } else {
        segAct.textContent =
          step.bestJ >= 0 ? `定型 dp[${i}] = ${step.best}（前驱 j = ${step.bestJ}）` : `定型 dp[${i}] = 1（单独成串）`
      }
      segVal.textContent = isSettle ? `dp[${i}] = ${step.dp[i]}` : `dp[${i}] = ${step.best}`
    } else if (isDone) {
      segRound.textContent = `${n} 个位置全部定型`
      segAct.textContent = '答案是 max(dp)，不是 dp[n-1]'
      segVal.textContent = `答案 = ${answer}`
    } else {
      segRound.textContent = '第一次接触？'
      segAct.textContent = 'dp[i] = 以 nums[i] 结尾的最长递增'
      segVal.textContent = '答案是 max(dp)'
    }

    // 底部状态行
    if (isScan) {
      if (!step.ok) {
        phaseText.textContent = `nums[${j}] >= nums[${i}] —— 递增要求严格更大，这个 j 接不上`
      } else if (step.better) {
        phaseText.textContent = `dp[${j}] + 1 = ${step.best} 更长 —— dp[${i}] 刷新，最优前驱记成 j = ${j}`
      } else {
        phaseText.textContent = `dp[${j}] + 1 = ${step.dp[j] + 1} 不比当前好 —— 保持不动，继续往回看`
      }
    } else if (isSettle) {
      phaseText.textContent =
        step.bestJ >= 0
          ? `dp[${i}] 定型为 ${step.best}：把 ${nums[i]} 接在 j = ${step.bestJ} 那条链尾巴上`
          : `dp[${i}] 定型为 1：前面没有更小的元素，只能自己单独成串`
    } else if (isDone) {
      phaseText.textContent = `时间 O(n^2)、空间 O(n) —— 想更快，要把「以 i 结尾」换成「按长度记账」`
    } else {
      phaseText.textContent = 'dp[i] 的「以 i 结尾」是锚 —— 有了它，才能只知道「我接在谁后面」'
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
      delete host.dataset.lisdpMounted
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
