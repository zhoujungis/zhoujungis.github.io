#!/usr/bin/env node
/**
 * prerender.mjs — build-time SEO pre-render for article detail pages.
 *
 * Why: the site is a pure CSR SPA on GitHub Pages. Crawlers that don't run
 * JS (most social-card bots, some search engines) only see the app shell, and
 * every deep link historically answered HTTP 404 via the fallback hack.
 *
 * What it does (runs after `vite build`, from package.json "build" script):
 *   1. Fetches all published articles from the backend API (paginated).
 *   2. Fetches each article detail with a bounded-concurrency pool and a
 *      local file cache (`.cache/prerender-details.json`) so rebuilds only
 *      refetch articles whose `updated_at` changed.
 *   3. For each article, writes dist/article/<slug>/index.html — a copy of
 *      the SPA shell enriched with:
 *        - per-article <title>, meta description, OG/Twitter tags, canonical
 *          (REPLACED in place — never appended, so no duplicate SEO tags)
 *        - JSON-LD Article structured data
 *        - the full article body inside <noscript> so no-JS crawlers and
 *          readers still get the content (JS users hydrate the SPA as usual;
 *          Vue replaces #app on mount, so there is no visual regression)
 *   4. Writes dist/articles.json — a lightweight snapshot of the article
 *      list that the SPA uses as a static fallback when the API is down
 *      (backend outage / cold start). See frontend/src/utils/articleCache.js.
 *   5. Injects a <noscript> "latest articles" list into dist/index.html so
 *      the home page has crawlable/static content even with JS disabled.
 *
 * Fails soft: if the API is unreachable the build still succeeds — the site
 * just ships without pre-rendered pages (same as before this script existed).
 * If a stale articles.json exists from a previous build it is kept as-is.
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(__dirname, '../dist')
const CACHE_DIR = resolve(__dirname, '../.cache')
const CACHE_FILE = join(CACHE_DIR, 'prerender-details.json')
const API_BASE =
  process.env.PRERENDER_API_BASE ||
  'https://zhoujun123.pythonanywhere.com/api/'
const SITE_ORIGIN = process.env.PRERENDER_ORIGIN || 'https://zhoujungis.github.io'
// Site name — keep in sync with src/utils/seo.js (SITE_NAME), index.html and
// public/manifest.json.
const SITE_NAME = '一蓑烟雨任平生'
// Bounded concurrency for detail fetches — PythonAnywhere is a small host,
// so stay polite. Override with PRERENDER_CONCURRENCY if needed.
const CONCURRENCY = Math.max(
  1,
  parseInt(process.env.PRERENDER_CONCURRENCY || '5', 10) || 5,
)

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/**
 * Build-time sanitizer for backend-provided HTML.
 *
 * Trust boundary: the backend is expected to clean article HTML (bleach),
 * but the prerendered <noscript> copy is shipped as a static file and served
 * to every visitor — including no-JS ones. Defense in depth: strip anything
 * executable here too, so a backend sanitizer regression can't turn every
 * pre-rendered page into stored XSS.
 *
 * No new dependency on purpose (this runs in CI with plain node): removes
 * <script>/<style>/<iframe>/<object>/<embed>/<form>, event-handler
 * attributes (on*), and javascript:/data:text/html URLs in href/src/action.
 */
function sanitizeHtml(html) {
  let out = String(html ?? '')
  // Remove executable/embedded elements with their content.
  out = out.replace(/<script[\s\S]*?<\/script\s*>/gi, '')
  out = out.replace(/<style[\s\S]*?<\/style\s*>/gi, '')
  out = out.replace(/<iframe[\s\S]*?(?:<\/iframe\s*>|\/>)/gi, '')
  out = out.replace(/<(object|embed|form|base|meta|link)[\s\S]*?(?:<\/\1\s*>|\/>|>)/gi, (m) =>
    // Keep legitimate <link>/<meta> out of scope: only strip when the tag
    // is object/embed/form/base, or a link/meta carrying event handlers.
    /^\s*<(object|embed|form|base)\b/i.test(m) ? '' : m,
  )
  // Remove event-handler attributes: onload=..., onclick='...', etc.
  out = out.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  // Neutralize javascript:/data:text/html:/vbscript: URLs in href/src/action.
  out = out.replace(
    /\s(href|src|action|xlink:href)\s*=\s*("|')\s*(javascript|vbscript|data\s*:\s*text\/html)[\s\S]*?\2/gi,
    ' $1="#"',
  )
  return out
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
.ns-home-list{max-width:780px;margin:96px auto 64px;padding:0 20px;line-height:1.8;font-family:'PingFang SC','Hiragino Sans GB','Noto Sans SC','Microsoft YaHei','Segoe UI',sans-serif}
.ns-home-list h1{font-size:1.6rem;margin:0 0 .5em}
.ns-home-list ul{padding-left:1.2em}
.ns-home-list li{margin:.4em 0}
.ns-home-list a{color:#3f6b57}
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
  await fillArticleDetails(articles)
  return articles
}

// ── Detail cache ──────────────────────────────────────────────────────────
// Persists per-slug { updated_at, html_content } across builds so unchanged
// articles are not refetched. Cache key includes updated_at from the list
// endpoint: a changed article misses the cache and is refetched.
function loadDetailCache() {
  try {
    if (!existsSync(CACHE_FILE)) return {}
    return JSON.parse(readFileSync(CACHE_FILE, 'utf8')) || {}
  } catch {
    return {}
  }
}

function saveDetailCache(cache) {
  try {
    mkdirSync(CACHE_DIR, { recursive: true })
    writeFileSync(CACHE_FILE, JSON.stringify(cache), 'utf8')
  } catch (e) {
    console.warn(`[prerender] could not write detail cache: ${e?.message || e}`)
  }
}

// The list endpoint omits html_content (payload size); fetch each detail so
// the <noscript> body has real content for no-JS crawlers. Bounded
// concurrency pool + file cache keep build times reasonable as the blog grows.
async function fillArticleDetails(articles) {
  const cache = loadDetailCache()
  let cacheDirty = false
  let cursor = 0

  async function worker() {
    while (cursor < articles.length) {
      const article = articles[cursor++]
      if (!article?.slug) continue
      const cached = cache[article.slug]
      if (
        cached &&
        cached.updated_at === article.updated_at &&
        typeof cached.html_content === 'string'
      ) {
        article.html_content = cached.html_content
        continue
      }
      try {
        const detail = await fetchArticleDetail(article.slug)
        article.html_content = detail.html_content || ''
        cache[article.slug] = {
          updated_at: article.updated_at || detail.updated_at || null,
          html_content: article.html_content,
        }
        cacheDirty = true
      } catch (e) {
        console.warn(`[prerender] could not fetch detail for ${article.slug}: ${e?.message || e}`)
        article.html_content =
          cached?.html_content || article.html_content || ''
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, articles.length) }, worker),
  )
  if (cacheDirty) saveDetailCache(cache)
}

// Replace-or-insert a <meta name|property="key" content="..."> tag: if the
// shell already has one, swap its content in place; otherwise insert before
// </head>. Guarantees exactly one tag per key — no duplicate SEO tags.
function upsertMeta(html, attr, key, content) {
  const re = new RegExp(
    `<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`,
  )
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function renderArticlePage(template, article) {
  const url = `${SITE_ORIGIN}/article/${article.slug}/`
  const title = `${article.title} | ${SITE_NAME}`
  const description = (article.excerpt || article.title).slice(0, 160)
  const isoDate = article.created_at || ''
  const cover = article.cover_image || `${SITE_ORIGIN}/og-image.jpg`

  let html = template
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
  // Canonical: REPLACE the shell's site-root canonical in place.
  // (Appending a second <link rel="canonical"> confuses search engines —
  // this was the duplicate-canonical bug.)
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${url}" />`,
  )
  html = upsertMeta(html, 'name', 'description', description)
  html = upsertMeta(html, 'property', 'og:title', article.title)
  html = upsertMeta(html, 'property', 'og:description', description)
  html = upsertMeta(html, 'property', 'og:url', url)
  html = upsertMeta(html, 'property', 'og:image', cover)
  html = upsertMeta(html, 'name', 'twitter:title', article.title)
  html = upsertMeta(html, 'name', 'twitter:description', description)
  html = upsertMeta(html, 'name', 'twitter:image', cover)

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
    `    <meta property="og:type" content="article" />\n` +
    `    ${isoDate ? `<meta property="article:published_time" content="${isoDate}" />\n    ` : ''}` +
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`

  // Replace the shell's generic og:type=website with the article one above.
  html = html.replace(/<meta property="og:type" content="website" \/>\s*\n?/, '')
  html = html.replace('</head>', `${headExtras}\n  </head>`)

  // No-JS fallback content, sanitized at build time (defense in depth — see
  // sanitizeHtml). Vue mounts on #app and replaces it for JS users, so this
  // is never double-rendered on screen.
  const safeBody = sanitizeHtml(article.html_content || '')
  const noscript =
    `<noscript><div class="ns-article">` +
    `<h1>${escapeHtml(article.title)}</h1>` +
    `<div class="ns-meta">${isoDate ? escapeHtml(new Date(isoDate).toLocaleDateString('zh-CN')) : ''} · Zhou Jun</div>` +
    `<div class="markdown-body">${safeBody}</div>` +
    `</div></noscript>`
  html = html.replace('<div id="app"></div>', `<div id="app"></div>\n    ${noscript}`)

  return html
}

// Inject a crawlable <noscript> latest-articles list into the home shell so
// the index page has static content even when JS/API is unavailable.
function renderHomePage(template, articles) {
  const sorted = [...articles]
    .filter((a) => a?.slug && a?.title)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10)
  if (!sorted.length) return template
  const items = sorted
    .map(
      (a) =>
        `<li><a href="${SITE_ORIGIN}/article/${escapeHtml(a.slug)}/">${escapeHtml(a.title)}</a>` +
        (a.created_at
          ? ` — ${escapeHtml(new Date(a.created_at).toLocaleDateString('zh-CN'))}`
          : '') +
        `</li>`,
    )
    .join('\n')
  const noscript =
    `<noscript><div class="ns-home-list"><h1>${escapeHtml(SITE_NAME)}</h1>` +
    `<p>最新文章（静态快照，完整体验请启用 JavaScript）：</p><ul>\n${items}\n</ul></div></noscript>`
  let html = template
  // The shell is a build artifact reused across builds, so on every rebuild
  // after the first one it ALREADY contains a previously injected block.
  // Replace that block in place — otherwise the home page's static article
  // list stays frozen at whatever the first build produced, forever.
  const existing = /<noscript>[\s\S]*?ns-home-list[\s\S]*?<\/noscript>/
  if (existing.test(html)) {
    html = html.replace(existing, noscript)
  } else {
    html = html.replace(
      '<div id="app"></div>',
      `<div id="app"></div>\n    ${NOSCRIPT_STYLE}\n    ${noscript}`,
    )
  }
  return html
}

// Lightweight list snapshot for the SPA's offline/API-down fallback.
function toSnapshotList(articles) {
  return articles
    .filter((a) => a?.slug)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      // Cards/SEO only ever show the first ~160 chars; full excerpts
      // (often multi-KB) would bloat the SW-precached snapshot.
      excerpt: (a.excerpt || '').slice(0, 160),
      cover_image: a.cover_image || '',
      category: a.category ?? null,
      tags: a.tags ?? [],
      created_at: a.created_at || '',
      updated_at: a.updated_at || '',
      reading_time: a.reading_time ?? null,
      views_count: a.views_count ?? 0,
      likes_count: a.likes_count ?? 0,
      is_top: !!a.is_top,
    }))
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

  // Static snapshot for API-down fallback (frontend fetches /articles.json).
  try {
    const snapshot = {
      generated_at: new Date().toISOString(),
      count: articles.length,
      results: toSnapshotList(articles),
    }
    writeFileSync(join(DIST, 'articles.json'), JSON.stringify(snapshot), 'utf8')
    console.log(`[prerender] wrote articles.json snapshot (${articles.length} articles).`)
  } catch (e) {
    console.warn(`[prerender] could not write articles.json: ${e?.message || e}`)
  }

  // Home static content.
  try {
    writeFileSync(shellPath, renderHomePage(template, articles), 'utf8')
    console.log('[prerender] injected <noscript> latest-articles into dist/index.html.')
  } catch (e) {
    console.warn(`[prerender] could not patch home page: ${e?.message || e}`)
  }
}

// Exported for unit tests (see src/__tests__/prerender.spec.js). The build
// entrypoint stays `main()` below — guarded so importing the module in
// vitest never triggers network/dist side effects.
export {
  escapeHtml,
  sanitizeHtml,
  upsertMeta,
  renderArticlePage,
  renderHomePage,
  toSnapshotList,
}

if (!process.env.VITEST_WORKER_ID) {
  main().catch((e) => {
    // Never fail the build because of pre-rendering.
    console.warn('[prerender] unexpected error, skipping:', e?.message || e)
  })
}