/**
 * widgetChrome.js — 文章里那些交互式动画的公共外壳。
 *
 * 抽出来的原因：第二个动画（LC 21）出现时，容器 / 说明文字 / 控制条 / 按钮样式
 * 会和第一个（LC 206）几乎逐字重复约 90 行。这些是"外壳"，不是"图形"，
 * 所以放一份共用；每个动画只负责自己那块 SVG 的样式。
 *
 * 里面有三样东西：
 *   1. CHROME_STYLES —— 外壳 CSS，用站点 CSS 变量取色，亮/暗主题自动跟随
 *   2. ensureChromeStyles() —— 幂等注入，两个动画共用同一个 <style>
 *   3. renderRichText() / createControls() —— 说明文字与控制条的构建
 *
 * 注意：注入的 CSS 用 `.viz*` 前缀，各动画自己的图形用各自的前缀
 * （LC 206 是 `.llv*`，LC 21 是 `.mtl*`），互不干扰。
 */

const STYLE_ID = 'viz-chrome-styles'

const SVG_NS = 'http://www.w3.org/2000/svg'

/** 建一个 SVG 元素并设属性。 */
export function svgEl(tag, attrs) {
  const node = document.createElementNS(SVG_NS, tag)
  if (attrs) {
    for (const key in attrs) node.setAttribute(key, attrs[key])
  }
  return node
}

/**
 * 一条带箭头的水平连线：直线 + 手画的三角箭头。
 * 用 marker 也行，但 marker 的 `context-stroke` 支持度不齐，手画最省心。
 * dir = 1 向右，dir = -1 向左。
 */
export function svgArrow(fromX, toX, y, dir, className = 'viz-arrow') {
  const head = 9
  const g = svgEl('g', { class: className })
  const tipX = dir > 0 ? toX : fromX
  const tailX = dir > 0 ? fromX : toX
  g.appendChild(
    svgEl('line', {
      class: `${className}__line`,
      x1: tailX,
      y1: y,
      x2: tipX - dir * head,
      y2: y,
    }),
  )
  g.appendChild(
    svgEl('path', {
      class: `${className}__head`,
      d: `M ${tipX} ${y} L ${tipX - dir * head} ${y - 5.5} L ${tipX - dir * head} ${y + 5.5} Z`,
    }),
  )
  return g
}

const CHROME_STYLES = `
.viz {
  margin: 1.6em 0;
  padding: 16px 16px 12px;
  background: var(--surface-muted, #ecefe8);
  border: 1px solid var(--glass-border, #dce2da);
  border-radius: 10px;
}
.viz__stage {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}
.viz__svg {
  display: block;
  width: 100%;
  height: auto;
  font-family: inherit;
}
.viz__desc {
  margin: 14px 0 0;
  padding: 0;
  min-height: 3.2em;
  color: var(--text-primary, #1f2a24);
  font-size: 0.9rem;
  line-height: 1.75;
}
.viz__desc code {
  padding: 1px 5px;
  background: rgba(101, 113, 104, 0.16);
  border-radius: 4px;
  font-size: 0.85em;
}
.viz__desc strong { color: var(--accent, #3f6b57); font-weight: 700; }
.viz__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--glass-border, #dce2da);
}
.viz__btn {
  padding: 7px 14px;
  color: var(--text-primary, #1f2a24);
  background: var(--surface, #fff);
  border: 1px solid var(--glass-border, #dce2da);
  border-radius: 7px;
  font-size: 0.82rem;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
}
.viz__btn:hover:not(:disabled) {
  color: var(--accent, #3f6b57);
  border-color: var(--accent, #3f6b57);
}
.viz__btn:disabled { opacity: 0.4; cursor: not-allowed; }
.viz__btn--play {
  color: #fff;
  background: var(--accent, #3f6b57);
  border-color: var(--accent, #3f6b57);
  font-weight: 600;
}
.viz__btn--play:hover:not(:disabled) { color: #fff; opacity: 0.88; }
.viz__count {
  margin-left: auto;
  color: var(--text-secondary, #657168);
  font-size: 0.78rem;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-variant-numeric: tabular-nums;
}
@media (max-width: 560px) {
  .viz { padding: 12px 10px 10px; }
  .viz__desc { font-size: 0.85rem; }
  .viz__count { width: 100%; margin-left: 0; text-align: right; }
}
@media (prefers-reduced-motion: reduce) {
  .viz__btn { transition: none; }
}
`

/** 幂等注入：两个动画共用同一个 <style>，重复调用不会叠加。 */
export function ensureChromeStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = CHROME_STYLES
  document.head.appendChild(style)
}

export function removeChromeStyles() {
  document.getElementById(STYLE_ID)?.remove()
}

/**
 * 把说明文字里的 `反引号片段` 渲染成等宽 <code>，**双星片段** 渲染成 <strong>。
 *
 * 为什么不用 innerHTML：desc 里会拼进 values，虽然眼下都是数字，但
 * 一个能被外部数据影响、又直接喂给 innerHTML 的地方就是隐患。手动切分后
 * 逐个建节点，成本很低，也彻底堵掉这类问题。
 */
export function renderRichText(container, text) {
  container.textContent = ''
  const source = String(text ?? '')
  const TOKEN = /(`[^`]*`|\*\*[^*]+\*\*)/g
  let last = 0
  for (const match of source.matchAll(TOKEN)) {
    if (match.index > last) {
      container.appendChild(document.createTextNode(source.slice(last, match.index)))
    }
    const token = match[0]
    const isCode = token.startsWith('`')
    const el = document.createElement(isCode ? 'code' : 'strong')
    el.textContent = token.slice(isCode ? 1 : 2, isCode ? -1 : -2)
    container.appendChild(el)
    last = match.index + token.length
  }
  if (last < source.length) {
    container.appendChild(document.createTextNode(source.slice(last)))
  }
}

/**
 * 控制条：上一步 / 播放 / 下一步 / 重置 + 步数。
 * 返回各元素引用，由调用方决定行为（各动画的播放节奏不一样）。
 */
export function createControls({ playLabel = '播放', pauseLabel = '暂停' } = {}) {
  const mk = (text, extra) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = extra ? `viz__btn ${extra}` : 'viz__btn'
    b.textContent = text
    return b
  }
  const root = document.createElement('div')
  root.className = 'viz__bar'
  const prev = mk('上一步')
  const play = mk(playLabel, 'viz__btn--play')
  const next = mk('下一步')
  const reset = mk('重置')
  const count = document.createElement('span')
  count.className = 'viz__count'
  root.append(prev, play, next, reset, count)

  const setPlaying = (playing) => {
    play.textContent = playing ? pauseLabel : playLabel
  }

  return { root, prev, play, next, reset, count, setPlaying }
}

/**
 * 通用播放器：步进 / 回退 / 重置 / 定时播放，各动画共用。
 *
 * onRender(index) 由调用方提供，负责把第 index 步画出来。
 */
export function createPlayer({ steps, controls, intervalMs = 1150, onRender }) {
  let index = 0
  let timer = null

  const stop = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    controls.setPlaying(false)
  }

  const render = () => {
    onRender(index, steps[index])
    controls.count.textContent = `第 ${index + 1} / ${steps.length} 步`
    controls.prev.disabled = index === 0
    controls.next.disabled = index === steps.length - 1
    controls.reset.disabled = index === 0 && !timer
  }

  const play = () => {
    if (timer) return
    if (index === steps.length - 1) index = 0
    controls.setPlaying(true)
    timer = setInterval(() => {
      if (index >= steps.length - 1) {
        stop()
        render()
        return
      }
      index += 1
      render()
    }, intervalMs)
    render()
  }

  const goTo = (delta) => {
    stop()
    index = Math.min(steps.length - 1, Math.max(0, index + delta))
    render()
  }

  const reset = () => {
    stop()
    index = 0
    render()
  }

  const jumpTo = (target) => {
    stop()
    index = Math.min(steps.length - 1, Math.max(0, target))
    render()
  }

  const toggle = () => (timer ? stop() : play())

  // 命名好的 handler 引用，卸载时才能精确摘掉（别用 cloneNode 那套，会丢引用）
  const handlers = {
    prev: () => goTo(-1),
    next: () => goTo(1),
    reset,
    play: toggle,
  }
  controls.prev.addEventListener('click', handlers.prev)
  controls.next.addEventListener('click', handlers.next)
  controls.reset.addEventListener('click', handlers.reset)
  controls.play.addEventListener('click', handlers.play)

  const destroy = () => {
    stop()
    controls.prev.removeEventListener('click', handlers.prev)
    controls.next.removeEventListener('click', handlers.next)
    controls.reset.removeEventListener('click', handlers.reset)
    controls.play.removeEventListener('click', handlers.play)
  }

  return { render, play, stop, reset, jumpTo, destroy, get index() { return index } }
}
