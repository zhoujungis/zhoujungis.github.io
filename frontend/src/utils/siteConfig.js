/**
 * siteConfig.js — constants shared by the runtime app and by the build-time
 * pre-renderer (scripts/prerender.mjs).
 *
 * Keeping them in one place is what guarantees three things line up:
 *   - the <title>/<meta> a crawler reads in the static HTML,
 *   - the ones the SPA sets after hydration,
 *   - the URLs the generated sitemap advertises.
 */

export const SITE_NAME = '尘世栈帧'
export const SITE_AUTHOR = 'Stack Frame'
export const SITE_DESCRIPTION = '尘世栈帧 — 技术、编程、AI 与科学'
export const SITE_ORIGIN = 'https://zhoujungis.github.io'

/**
 * List pages that get a real static HTML file at exactly this path.
 *
 * The trailing slash is deliberate: prerender.mjs writes
 * `dist/<path>/index.html`, and GitHub Pages answers `/articles/` with that
 * file while 301-redirecting the bare `/articles` to it. Canonical URLs and
 * sitemap entries therefore use the slashed form — the one that returns 200.
 *
 * Every entry here MUST be written by the build; the sitemap is generated
 * from this same list, so a page can never be advertised without existing.
 */
export const LIST_PAGES = [
  {
    path: '/articles/',
    title: '全部文章',
    description: `${SITE_NAME}的全部技术文章 — 算法题解、Django 后端、分布式系统与性能优化。`,
  },
  {
    path: '/archives/',
    title: '归档',
    description: `${SITE_NAME}文章归档，按年月浏览全部文章。`,
  },
  {
    path: '/categories/',
    title: '分类',
    description: `${SITE_NAME}的文章分类，按主题浏览技术文章。`,
  },
  {
    path: '/tags/',
    title: '标签',
    description: `${SITE_NAME}的文章标签，按关键词检索技术文章。`,
  },
]

/**
 * Route meta for a prerendered list page — spread into the route record so the
 * router title and the static page title come from the same string.
 */
export function listPageMeta(path) {
  const page = LIST_PAGES.find((p) => p.path === path)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
    canonical: page.path,
  }
}
