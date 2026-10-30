/**
 * siteConfig.js — constants shared by the runtime app and by the build-time
 * pre-renderer (scripts/prerender.mjs).
 *
 * Keeping them in one place is what guarantees three things line up:
 *   - the <title>/<meta> a crawler reads in the static HTML,
 *   - the ones the SPA sets after hydration,
 *   - the URLs the generated sitemap advertises.
 *
 * NOTE: SITE_ORIGIN is the site's real GitHub Pages host. It is infrastructure,
 * not branding — the display name (SITE_NAME / SITE_AUTHOR) is what carries the
 * brand, and the two are deliberately independent.
 */

export const SITE_NAME = '尘世栈帧'
export const SITE_AUTHOR = 'Stack Frame'
export const SITE_DESCRIPTION = '尘世栈帧 — 技术、编程、AI 与科学'
// 自定义域名（Cloudflare 注册的 zhoujun.dev，博客挂在 blog 子域）。
// 全站 canonical / og:url / sitemap / rss / 预渲染快照都以它为准；
// 旧的 zhoujungis.github.io 由 GitHub Pages 自动 301 到此处。
export const SITE_ORIGIN = 'https://blog.zhoujun.dev'

/**
 * Pages that get a real static HTML file at exactly this path.
 *
 * The trailing slash is deliberate: prerender.mjs writes
 * `dist/<path>/index.html`, and GitHub Pages answers `/articles/` with that
 * file while 301-redirecting the bare `/articles` to it. Canonical URLs and
 * sitemap entries therefore use the slashed form — the one that returns 200.
 *
 * Fields:
 *   sections — which <noscript> body builder prerender.mjs should use.
 *   priority — sitemap <priority>.
 *   noindex  — omit from the sitemap and mark the route noindex. Used for
 *              /search: its results only exist in response to a query, so
 *              there is nothing for a crawler to index.
 *
 * Every entry here MUST be written by the build; the sitemap is generated from
 * this same list, so a page can never be advertised without existing.
 */
export const LIST_PAGES = [
  {
    path: '/articles/',
    title: '全部文章',
    description: `${SITE_NAME}的全部技术文章 — 算法题解、Django 后端、分布式系统与性能优化。`,
    sections: 'articles',
    priority: '0.6',
  },
  {
    path: '/archives/',
    title: '归档',
    description: `${SITE_NAME}文章归档，按年月浏览全部文章。`,
    sections: 'archives',
    priority: '0.6',
  },
  {
    path: '/categories/',
    title: '分类',
    description: `${SITE_NAME}的文章分类，按主题浏览技术文章。`,
    sections: 'categories',
    priority: '0.5',
  },
  {
    path: '/tags/',
    title: '标签',
    description: `${SITE_NAME}的文章标签，按关键词检索技术文章。`,
    sections: 'tags',
    priority: '0.5',
  },
  {
    path: '/footprints/',
    title: '旅行足迹',
    description: `${SITE_NAME}的旅行足迹 — 走过的城市与省份分布。`,
    sections: 'footprints',
    priority: '0.5',
  },
  {
    path: '/photos/',
    title: '照片墙',
    description: `${SITE_NAME}的照片墙 — 光影里的生活片段。`,
    sections: 'photos',
    priority: '0.4',
  },
  {
    path: '/friends/',
    title: '友情链接',
    description: `${SITE_NAME}的友情链接 — 经常访问的站点与同好。`,
    sections: 'friends',
    priority: '0.3',
  },
  {
    path: '/search/',
    title: '搜索',
    description: `搜索${SITE_NAME}的全部文章。`,
    sections: 'search',
    noindex: true,
  },
  // 合规与介绍页。AdSense 审核要求站点具备独立、可访问的隐私政策，
  // 这三页因此是「必建」而不是可选装饰：正文放 data/sitePages.js，
  // 预渲染用同一份数据写进 <noscript>，不存在两套措辞。
  {
    path: '/about/',
    title: '关于本站',
    description: `${SITE_NAME}是一个个人技术博客 — 站点定位、技术实现与联系方式。`,
    sections: 'site-page',
    sitePageKey: 'about',
    priority: '0.4',
  },
  {
    path: '/privacy/',
    title: '隐私政策',
    description: `${SITE_NAME}的隐私政策 — 信息收集范围、Cookie 与第三方服务（Google AdSense、Google Analytics）的使用方式。`,
    sections: 'site-page',
    sitePageKey: 'privacy',
    priority: '0.3',
  },
  {
    path: '/disclaimer/',
    title: '免责声明',
    description: `${SITE_NAME}的免责声明 — 内容准确性、示例代码使用风险、广告与版权说明。`,
    sections: 'site-page',
    sitePageKey: 'disclaimer',
    priority: '0.3',
  },
]

/**
 * Route meta for a prerendered page — spread into the route record so the
 * router title and the static page title come from the same string.
 */
export function listPageMeta(path) {
  const page = LIST_PAGES.find((p) => p.path === path)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
    canonical: page.path,
    // 有正文档的页面把 key 一并交给路由，页面组件据此选取正文
    ...(page.sitePageKey ? { sitePage: page.sitePageKey } : {}),
    ...(page.noindex ? { robots: 'noindex, follow' } : {}),
  }
}
