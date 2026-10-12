/**
 * Site name used as the title suffix and og:site_name.
 * Re-exported from siteConfig.js — the single source of truth shared with
 * index.html, public/manifest.json and scripts/prerender.mjs.
 */
import { SITE_NAME, SITE_DESCRIPTION } from './siteConfig'

export { SITE_NAME, SITE_AUTHOR } from './siteConfig'

/**
 * Default social card. Used when a page has no image of its own — including
 * when navigating away from an article, so the previous article's cover does
 * not linger in og:image.
 */
const DEFAULT_OG_IMAGE = '/og-image.jpg'

/**
 * Set SEO meta tags dynamically.
 * Usage: useSEO({ title: '...', description: '...', image: '...', url: '...', type: 'article' })
 */
export function useSEO(options = {}) {
  const {
    title = SITE_NAME,
    description = SITE_DESCRIPTION,
    image = '',
    url = window.location.href,
    type = 'website',
  } = options

  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`

  // Update document title
  document.title = fullTitle

  // Helper to set or create meta tags / link tags
  const setMeta = (property, content, isName = false) => {
    if (!content) return
    const attr = isName ? 'name' : 'property'
    let el = document.querySelector(`meta[${attr}="${property}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, property)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  const setLink = (rel, href) => {
    if (!href) return
    let el = document.querySelector(`link[rel="${rel}"]`)
    if (!el) {
      el = document.createElement('link')
      el.setAttribute('rel', rel)
      document.head.appendChild(el)
    }
    el.setAttribute('href', href)
  }

  setMeta('description', description, true)
  setMeta('og:title', fullTitle)
  setMeta('og:description', description)
  setMeta('og:image', image)
  setMeta('og:url', url)
  setMeta('og:type', type)
  setMeta('twitter:card', image ? 'summary_large_image' : 'summary')
  setMeta('twitter:title', fullTitle)
  setMeta('twitter:description', description)
  setMeta('twitter:image', image)
  setLink('canonical', url)
}

/** Insert / update / remove <meta name="robots">. */
function setRobots(value) {
  const existing = document.querySelector('meta[name="robots"]')
  if (!value) {
    existing?.remove()
    return
  }
  const el = existing || document.createElement('meta')
  el.setAttribute('name', 'robots')
  el.setAttribute('content', value)
  if (!existing) document.head.appendChild(el)
}

/**
 * Apply the SEO defaults declared in the route table (`meta.title`,
 * `meta.description`, `meta.canonical`, `meta.robots`).
 *
 * Called from router.afterEach for every page except ArticleDetail, which
 * manages its own tags once the article data arrives. This is what gives
 * /articles, /archives & co. a real <title> — previously every non-article
 * route kept the site name and the previous page's og:* tags.
 *
 * `meta.canonical` exists for pages whose prerendered file is a directory
 * (GitHub Pages answers /articles/ with the static HTML and 301s /articles to
 * it), so the runtime canonical points at the URL that actually returns 200.
 */
export function applyRouteSeo(to) {
  const meta = to?.meta || {}
  const path = meta.canonical || to?.path || '/'
  useSEO({
    title: meta.title || SITE_NAME,
    description: meta.description || SITE_DESCRIPTION,
    image: window.location.origin + DEFAULT_OG_IMAGE,
    url: window.location.origin + path,
  })
  setRobots(meta.robots)
}
