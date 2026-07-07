/**
 * Set SEO meta tags dynamically.
 * Usage: useSEO({ title: '...', description: '...', image: '...', url: '...' })
 */
export function useSEO(options = {}) {
  const {
    title = "ZhouJun's Blog",
    description = 'Zhou Jun 的个人博客 — 技术、编程、AI 与科学',
    image = '',
    url = window.location.href,
  } = options

  const fullTitle = title === "ZhouJun's Blog" ? title : `${title} | ZhouJun's Blog`

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
