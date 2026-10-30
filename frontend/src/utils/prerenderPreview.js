/**
 * prerenderPreview.js —— 文章详情页的「零等待首屏」。
 *
 * 背景：scripts/prerender.mjs 为每个 /article/<slug>/ 写了两份构建期产物
 *   1. <noscript> 里的完整正文 —— 给不跑 JS 的爬虫和读者；
 *   2. <script type="application/json" id="prerender-article"> 里的元数据
 *      （不含正文，正文只存一份，避免页面体积翻倍）。
 *
 * 脚本开启时浏览器把 <noscript> 当纯文本，JS 用户看不到它；这份产物对 Vue
 * 就成了「已下载但未展示」的正文。本模块在详情页挂载前把它读回来拼成 article
 * 对象，让首帧就有内容可渲染 —— 骨架屏只剩「既无预渲染又无缓存」时才出现。
 *
 * 非直连（SPA 内部跳转）拿不到本页的预渲染数据，返回 null，由调用方退回
 * localStorage 详情缓存（utils/articleCache.js）。
 */

const PREVIEW_META_ID = 'prerender-article'

/**
 * @param {string} slug 当前路由的文章标识
 * @returns {object|null} 与 API 详情同形的 article 对象，拿不到时 null
 */
export function readPrerenderedArticle(slug) {
  if (!slug || typeof document === 'undefined') return null
  try {
    const dataEl = document.getElementById(PREVIEW_META_ID)
    if (!dataEl) return null
    const meta = JSON.parse(dataEl.textContent || '')
    // 静态产物只属于初次加载的那一页：SPA 跳到别的文章时 slug 对不上，直接放弃。
    if (!meta || meta.slug !== slug) return null

    const html = readNoscriptBody()
    if (!html) return null

    return { ...meta, html_content: html, content: '' }
  } catch {
    return null
  }
}

/**
 * 取出 <noscript> 里 .ns-article .markdown-body 的 innerHTML。
 *
 * 两种 DOM 形态都要认：
 *   - 脚本开启（真实浏览器）：noscript 的子节点是一个文本节点，内容是原始
 *     HTML 源码，必须自己 parse；
 *   - 脚本关闭 / jsdom：子节点已经是解析好的元素，直接读。
 */
function readNoscriptBody() {
  const noscript = [...document.querySelectorAll('noscript')].find((el) =>
    (el.textContent || '').includes('ns-article'),
  )
  if (!noscript) return null

  const nested = noscript.querySelector('.ns-article')
  const source = nested ? noscript.innerHTML : noscript.textContent
  if (!source) return null

  const parsed = new DOMParser().parseFromString(source, 'text/html')
  return parsed.querySelector('.ns-article .markdown-body')?.innerHTML || null
}
