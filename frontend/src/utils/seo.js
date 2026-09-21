/**
 * Site name used as the title suffix and og:site_name.
 * Single source of truth — keep in sync with:
 *   - index.html (<title>, og:title, og:site_name, twitter:title, RSS title)
 *   - public/manifest.json ("name" / "short_name")
 *   - scripts/prerender.mjs (SITE_NAME)
 */
export const SITE_NAME = '个人博客Blog'

const SITE_DESCRIPTION = 'Zhou Jun 的个人博客 — 技术、编程、AI 与科学'

/**
 * Set SEO meta tags dynamically.
 * Usage: useSEO({ title: '...', description: '...', image: '...', url: '...' })
 */
export function useSEO(options = {}) {
  const {
    title = SITE_NAME,
    description = SITE_DESCRIPTION,
    image = '',
    url = window.location.href,
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
  setMeta('og:type', 'article')
  setMeta('twitter:card', image ? 'summary_large_image' : 'summary')
  setMeta('twitter:title', fullTitle)
  setMeta('twitter:description', description)
  setMeta('twitter:image', image)
  setLink('canonical', url)
}

/**
 * Reset SEO meta tags to site defaults.
 * Call on unmount or when leaving a page that called useSEO().
 * Prevents the previous page's title/og from leaking onto the next page.
 */
export const DEFAULT_SEO = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  image: '',
  url: '',
}

export function resetSEO() {
  useSEO({ ...DEFAULT_SEO, url: window.location.origin + '/' })
  // og:type back to website (article → website)
  let ogType = document.querySelector('meta[property="og:type"]')
  if (ogType) ogType.setAttribute('content', 'website')
  // Drop canonical — let pages set their own
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) canonical.setAttribute('href', window.location.origin + '/')
}
