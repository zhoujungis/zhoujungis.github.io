#!/usr/bin/env node
/**
 * prerender.mjs — build-time SEO pre-render for article detail pages.
 *
 * Why: the site is a pure CSR SPA on GitHub Pages. Crawlers that don't run
 * JS (most social-card bots, some search engines) only see the app shell, and
 * every deep link historically answered HTTP 404 via the fallback hack.
 *
 * What it does (runs after `vite build`, from package.json "build" script):
 *   1. Fetches all published articles from the backend API.
 *   2. For each article, writes dist/article/<slug>/index.html — a copy of
 *      the SPA shell enriched with:
 *        - per-article <title>, meta description, OG/Twitter tags, canonical
 *        - JSON-LD Article structured data
 *        - the full article body inside <noscript> so no-JS crawlers and
 *          readers still get the content (JS users hydrate the SPA as usual;
 *          Vue replaces #app on mount, so there is no visual regression)
 *
 * Fails soft: if the API is unreachable the build still succeeds — the site
 * just ships without pre-rendered pages (same as before this script existed).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(__dirname, '../dist')
const API_BASE =
  process.env.PRERENDER_API_BASE ||
  'https://zhoujun123.pythonanywhere.com/api/'
const SITE_ORIGIN = process.env.PRERENDER_ORIGIN || 'https://zhoujungis.github.io'

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

// Minimal typography for the <noscript> copy — the markdown-body styles live
// in a lazy-loaded chunk CSS that the shell doesn't include.
const NOSCRIPT_STYLE = `
<style>
.ns-article{max-width:780px;margin:96px auto 64px;padding:0 20px;line-height:1.85;color:var(--text-primary,#1f2a24);font-family:'PingFang SC','Hiragino Sans GB','Noto Sans SC','Microsoft YaHei','Segoe UI',sans-serif}
.ns-article h1{font-size:1.8rem;line-height:1.4;margin:0 0 .6em}
.ns-article h2{font-size:1.4rem;margin:1.6em 0 .6em}
.ns-article h3{font-size:1.2rem;margin:1.4em 0 .5em}
.ns-article p{margin:.8em 0}
.ns-article img{max-width:100%;height:auto;border-radius:8px}
.ns-article pre{background:#faf5f7;border-left:3px solid #3f6b57;border-radius:8px;padding:14px 16px;overflow-x:auto;font-size:.85em}
.ns-article code{font-family:SFMono-Regular,'Cascadia Code',Consolas,monospace;font-size:.9em}
.ns-article table{border-collapse:collapse;margin:1em 0}
.ns-article th,.ns-article td{border:1px solid #dce2da;padding:8px 12px}
.ns-article a{color:#3f6b57}
.ns-article .ns-meta{color:#657168;font-size:.85rem;margin-bottom:1.5em}
</style>`

async function fetchArticleDetail(slug) {
  const res = await fetch(`${API_BASE}articles/${slug}/`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(30000),
  })
  if (!res.ok) throw new Error(`detail ${slug}: HTTP ${res.status}`)
  return res.json()
}

async function fetchAllArticles() {
  const articles = []
  let page = 1
  // Paginate defensively instead of relying on a huge page_size.
  while (page <= 20) {
    const res = await fetch(
      `${API_BASE}articles/?page=${page}&page_size=100`,
      { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(30000) },
    )
    if (!res.ok) throw new Error(`API responded ${res.status}`)
    const data = await res.json()
    const list = data.results || data || []
    articles.push(...list)
    const total = typeof data.count === 'number' ? data.count : articles.length
    if (!list.length || articles.length >= total) break
    page += 1
  }
  // The list endpoint omits html_content (payload size); fetch each detail so
  // the <noscript> body has real content for no-JS crawlers.
  for (const article of articles) {
    try {
      const detail = await fetchArticleDetail(article.slug)
      article.html_content = detail.html_content || ''
    } catch (e) {
      console.warn(`[prerender] could not fetch detail for ${article.slug}: ${e?.message || e}`)
      article.html_content = article.html_content || ''
    }
  }
  return articles
}

function renderArticlePage(template, article) {
  const url = `${SITE_ORIGIN}/article/${article.slug}/`
  const title = `${article.title} | ZhouJun's Blog`
  const description = (article.excerpt || article.title).slice(0, 160)
  const isoDate = article.created_at || ''

  let html = template
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeHtml(description)}"`,
  )
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapeHtml(article.title)}"`,
  )
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escapeHtml(description)}"`,
  )
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${url}"`,
  )
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${escapeHtml(article.title)}"`,
  )
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${escapeHtml(description)}"`,
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description,
    image: article.cover_image || undefined,
    datePublished: isoDate,
    dateModified: article.updated_at || isoDate,
    author: { '@type': 'Person', name: 'Zhou Jun' },
    publisher: { '@type': 'Person', name: 'Zhou Jun' },
    mainEntityOfPage: url,
  }

  const headExtras =
    `${NOSCRIPT_STYLE}\n` +
    `    <link rel="canonical" href="${url}" />\n` +
    `    <meta property="og:type" content="article" />\n` +
    `    ${isoDate ? `<meta property="article:published_time" content="${isoDate}" />\n    ` : ''}` +
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`

  // Replace the shell's generic og:type=website with the article one above.
  html = html.replace(/<meta property="og:type" content="website" \/>\s*\n?/, '')
  html = html.replace('</head>', `${headExtras}\n  </head>`)

  // No-JS fallback content. Vue mounts on #app and replaces it for JS users,
  // so this is never double-rendered on screen.
  const noscript =
    `<noscript><div class="ns-article">` +
    `<h1>${escapeHtml(article.title)}</h1>` +
    `<div class="ns-meta">${isoDate ? new Date(isoDate).toLocaleDateString('zh-CN') : ''} · Zhou Jun</div>` +
    `<div class="markdown-body">${article.html_content || ''}</div>` +
    `</div></noscript>`
  html = html.replace('<div id="app"></div>', `<div id="app"></div>\n    ${noscript}`)

  return html
}

async function main() {
  const shellPath = join(DIST, 'index.html')
  if (!existsSync(shellPath)) {
    console.warn('[prerender] dist/index.html not found — skipping.')
    return
  }
  const template = readFileSync(shellPath, 'utf8')

  let articles
  try {
    articles = await fetchAllArticles()
  } catch (e) {
    console.warn(`[prerender] API unavailable (${e?.message || e}) — skipping pre-render. Build continues.`)
    return
  }

  let written = 0
  for (const article of articles) {
    if (!article?.slug) continue
    const dir = join(DIST, 'article', article.slug)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), renderArticlePage(template, article), 'utf8')
    written += 1
  }
  console.log(`[prerender] wrote ${written} static article page(s) into dist/article/.`)
}

main().catch((e) => {
  // Never fail the build because of pre-rendering.
  console.warn('[prerender] unexpected error, skipping:', e?.message || e)
})
