/**
 * prerenderPreview.js —— 文章详情页的「零等待首屏」。
 *
 * 背景：scripts/prerender.mjs 为每个 /article/<slug>/ 写了两份构建期产物
 *   1. #app 里的完整静态正文 —— 给不跑 JS 的爬虫和读者；
 *   2. <script type="application/json" id="prerender-article"> 里的元数据
 *      （不含正文，正文只存一份，避免页面体积翻倍）。
 *
 * 脚本开启时这段静态正文会在 Vue mount 前短暂可见；mount 会清空 #app。
 * 本模块在详情页挂载前把它读回来拼成 article 对象，让首帧就有内容可渲染
 * —— 骨架屏只剩「既无预渲染又无缓存」时才出现。
 *
 * 非直连（SPA 内部跳转）拿不到本页的预渲染数据，返回 null，由调用方退回
 * localStorage 详情缓存（utils/articleCache.js）。
 */

const PREVIEW_META_ID = 'prerender-article'

// Vue 的 mount 会先清空 #app，再执行组件 setup —— 等 ArticleDetail 里调用
// readPrerenderedArticle 时静态正文已经被删掉了。所以 main.js 必须在 mount
// 之前调用 captureStaticFallback()，把正文先抄到内存里。
let capturedBodyHtml = null

export function captureStaticFallback() {
  if (typeof document === 'undefined') return
  capturedBodyHtml =
    document.querySelector('#app .ns-article .markdown-body')?.innerHTML || null
}

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

    const html = readStaticBody()
    if (!html) return null

    return { ...meta, html_content: html, content: '' }
  } catch {
    return null
  }
}

/**
 * 取出 #app 静态 fallback 里 .ns-article .markdown-body 的 innerHTML。
 * 这段 DOM 在 Vue mount 前已经由浏览器解析好，直接读取即可。
 */
function readStaticBody() {
  if (capturedBodyHtml) return capturedBodyHtml
  const body = document.querySelector('#app .ns-article .markdown-body')
  return body?.innerHTML || null
}
