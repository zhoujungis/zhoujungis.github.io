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
 *   6. Writes dist/<list-page>/index.html for /articles, /archives,
 *      /categories and /tags so those routes answer 200 instead of falling
 *      through to the 404.html + sessionStorage bounce.
 *   7. Writes dist/sitemap.xml and dist/rss.xml, both on the site's own
 *      origin. The sitemap lists exactly the URLs this script just emitted,
 *      so it can never advertise a dead route; the feed carries full text
 *      only for the newest few items to stay small.
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
// Shared with MarkdownView.vue so the live view and the no-JS snapshot agree.
import { stripLeadingDuplicateTitle } from '../src/utils/articleHtml.js'
// Site identity + the list pages this script must emit. Declared once for the
// SPA and the builder so a crawler and the runtime never disagree.
import {
  SITE_NAME,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_ORIGIN as SITE_ORIGIN_DEFAULT,
  LIST_PAGES,
} from '../src/utils/siteConfig.js'
// Same travel data the /footprints page renders, so its no-JS snapshot can't
// drift from the live map.
import { FOOTPRINT_CITIES, FOOTPRINT_REGIONS } from '../src/data/footprints.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(__dirname, '../dist')
const CACHE_DIR = resolve(__dirname, '../.cache')
const CACHE_FILE = join(CACHE_DIR, 'prerender-details.json')
const API_BASE =
  process.env.PRERENDER_API_BASE ||
  'https://zhoujun123.pythonanywhere.com/api/'
const SITE_ORIGIN = process.env.PRERENDER_ORIGIN || SITE_ORIGIN_DEFAULT

// Feed size control. The backend feed (articles/feeds.py) ships 20 items with
// the FULL html body of every one of them — 20 × ~50KB ≈ 1MB, which every
// subscriber re-downloads on every poll. Keep the item count, but only carry
// full text for the newest few; older items fall back to their excerpt.
const FEED_PATH = '/rss.xml'
const FEED_ITEM_COUNT = 20
const FEED_FULL_TEXT_COUNT = 5

// A burst of updates this close together is a batch job (title rewrites, mass
// re-tagging, excerpt refresh), not organic editing. Measured on this blog:
// the real batches land within 0.2–0.3 minutes of each other, while the one
// genuinely spread-out day sits at a 434-minute span — three orders of
// magnitude apart, so the cutoff is not delicate.
const BULK_EDIT_WINDOW_MS = 10 * 60 * 1000
const BULK_EDIT_THRESHOLD = 5
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
.ns-article .table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.ns-article th,.ns-article td{border:1px solid #dce2da;padding:8px 12px}
.ns-article a{color:#3f6b57}
.ns-article .ns-meta{color:#657168;font-size:.85rem;margin-bottom:1.5em}
.ns-home-list{max-width:780px;margin:96px auto 64px;padding:0 20px;line-height:1.8;font-family:'PingFang SC','Hiragino Sans GB','Noto Sans SC','Microsoft YaHei','Segoe UI',sans-serif}
.ns-home-list h1{font-size:1.6rem;margin:0 0 .5em}
.ns-home-list ul{padding-left:1.2em}
.ns-home-list li{margin:.4em 0}
.ns-home-list a{color:#3f6b57}
.ns-list{max-width:780px;margin:96px auto 64px;padding:0 20px;line-height:1.8;font-family:'PingFang SC','Hiragino Sans GB','Noto Sans SC','Microsoft YaHei','Segoe UI',sans-serif}
.ns-list h1{font-size:1.8rem;margin:0 0 .4em}
.ns-list h2{font-size:1.15rem;margin:1.6em 0 .4em;padding-bottom:.3em;border-bottom:1px solid #dce2da}
.ns-list h3{font-size:1rem;margin:1.2em 0 .3em;color:#657168}
.ns-list .ns-lead{color:#657168;font-size:.9rem;margin:0 0 1.5em}
.ns-list ul{padding-left:1.2em;margin:.3em 0}
.ns-list li{margin:.35em 0}
.ns-list a{color:#3f6b57}
.ns-list .ns-date{color:#657168;font-size:.82rem}
.ns-list .ns-nav{margin-top:2.5em;padding-top:1em;border-top:1px solid #dce2da;font-size:.9rem}
.ns-list .ns-nav a{margin-right:.8em}
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

// String.replace() pattern-scans a STRING replacement value: `$$` collapses to
// a literal `$`, `$&` to the match, and `$'`/`$\`` to the surrounding text.
// Article bodies are full of `$$...$$` display math, so injecting one with a
// plain string replacement silently rewrote every block formula into inline
// math in the prerendered snapshot (and mangled any `$` in a title or excerpt).
// A FUNCTION replacement is never pattern-scanned, so it is always literal —
// use this for every replacement that carries data.
const literal = (replacement) => () => replacement

// Replace-or-insert a <meta name|property="key" content="..."> tag: if the
// shell already has one, swap its content in place; otherwise insert before
// </head>. Guarantees exactly one tag per key — no duplicate SEO tags.
function upsertMeta(html, attr, key, content) {
  const re = new RegExp(
    `<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`,
  )
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`
  if (re.test(html)) return html.replace(re, literal(tag))
  return html.replace('</head>', literal(`    ${tag}\n  </head>`))
}

// Give every table its own horizontal scroll container. The live page does the
// same thing client-side (see MarkdownView.vue `wrapTables()`), but the
// <noscript> snapshot ships no JS at all — without this wrapper a wide table
// (9-column ones are common in the algorithm articles) pushes the whole
// document sideways for no-JS readers.
function wrapTables(html) {
  return String(html ?? '').replace(
    /<table(\s[^>]*)?>[\s\S]*?<\/table>/gi,
    (table) => `<div class="table-scroll">${table}</div>`,
  )
}

function renderArticlePage(template, article, { lastmod } = {}) {
  const url = `${SITE_ORIGIN}/article/${article.slug}/`
  const title = `${article.title} | ${SITE_NAME}`
  const description = (article.excerpt || article.title).slice(0, 160)
  const isoDate = article.created_at || ''
  // Same value the sitemap publishes — see pickLastmod() for why updated_at
  // alone can't be trusted.
  const modifiedDate = lastmod || article.updated_at || isoDate
  const cover = article.cover_image || `${SITE_ORIGIN}/og-image.jpg`

  let html = template
  html = html.replace(/<title>.*?<\/title>/, literal(`<title>${escapeHtml(title)}</title>`))
  // Canonical: REPLACE the shell's site-root canonical in place.
  // (Appending a second <link rel="canonical"> confuses search engines —
  // this was the duplicate-canonical bug.)
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    literal(`<link rel="canonical" href="${url}" />`),
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
    dateModified: modifiedDate,
    author: { '@type': 'Person', name: SITE_AUTHOR },
    publisher: { '@type': 'Person', name: SITE_AUTHOR },
    mainEntityOfPage: url,
  }

  const headExtras =
    `${NOSCRIPT_STYLE}\n` +
    `    <meta property="og:type" content="article" />\n` +
    `    ${isoDate ? `<meta property="article:published_time" content="${isoDate}" />\n    ` : ''}` +
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`

  // Replace the shell's generic og:type=website with the article one above.
  html = html.replace(/<meta property="og:type" content="website" \/>\s*\n?/, '')
  html = html.replace('</head>', literal(`${headExtras}\n  </head>`))

  // No-JS fallback content, sanitized at build time (defense in depth — see
  // sanitizeHtml). Vue mounts on #app and replaces it for JS users, so this
  // is never double-rendered on screen.
  // The block below emits its own <h1>, and the Markdown body opens with
  // `# <title>` too — strip that duplicate or the snapshot ships two identical
  // headings (same fix as MarkdownView.vue, same helper).
  const safeBody = wrapTables(
    stripLeadingDuplicateTitle(
      sanitizeHtml(article.html_content || ''),
      article.title,
    ),
  )
  const noscript =
    `<noscript><div class="ns-article">` +
    `<h1>${escapeHtml(article.title)}</h1>` +
    `<div class="ns-meta">${isoDate ? escapeHtml(new Date(isoDate).toLocaleDateString('zh-CN')) : ''} · ${escapeHtml(SITE_AUTHOR)}</div>` +
    `<div class="markdown-body">${safeBody}</div>` +
    `</div></noscript>`
  html = html.replace('<div id="app"></div>', literal(`<div id="app"></div>\n    ${noscript}`))

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
    html = html.replace(existing, literal(noscript))
  } else {
    html = html.replace(
      '<div id="app"></div>',
      literal(`<div id="app"></div>\n    ${NOSCRIPT_STYLE}\n    ${noscript}`),
    )
  }
  return html
}

// ── Dates & lastmod ───────────────────────────────────────────────────────
// Article.updated_at is `auto_now=True`: every admin PATCH rewrites it, even
// when only the title changed. A 33-title batch rewrite therefore stamped 33
// articles with the same minute, so a sitemap built from updated_at alone
// claimed a third of the blog changed that afternoon — exactly the signal
// search engines learn to ignore. Detect those bursts and fall back to the
// publication date.

const dayOf = (iso) => String(iso || '').slice(0, 10)

function timeOf(iso) {
  const t = new Date(iso || '').getTime()
  return Number.isNaN(t) ? 0 : t
}

/**
 * Slugs whose updated_at falls inside a burst of >= BULK_EDIT_THRESHOLD
 * updates within BULK_EDIT_WINDOW_MS of each other.
 *
 * Sliding window over the sorted timestamps: every article that is part of any
 * such burst is flagged. Counting per calendar day would be far too coarse —
 * on this blog five unrelated afternoon edits shared a date while 27 scripted
 * ones shared 2.5 minutes.
 */
function findBulkEdits(articles) {
  const timed = articles
    .filter((a) => a?.slug && a.updated_at)
    .map((a) => ({ slug: a.slug, t: timeOf(a.updated_at) }))
    .filter((x) => x.t)
    .sort((a, b) => a.t - b.t)

  const bulk = new Set()
  let start = 0
  for (let end = 0; end < timed.length; end += 1) {
    while (timed[end].t - timed[start].t > BULK_EDIT_WINDOW_MS) start += 1
    if (end - start + 1 >= BULK_EDIT_THRESHOLD) {
      for (let i = start; i <= end; i += 1) bulk.add(timed[i].slug)
    }
  }
  return bulk
}

function pickLastmod(article, bulkEdits = new Set()) {
  const created = article?.created_at || ''
  const updated = article?.updated_at || ''
  if (!updated) return created
  if (bulkEdits.has(article?.slug)) return created || updated
  return timeOf(updated) > timeOf(created) ? updated : created
}

const isoOrEmpty = (value) => {
  const t = timeOf(value)
  return t ? new Date(t).toISOString() : ''
}

// ── sitemap.xml ───────────────────────────────────────────────────────────
// Generated here rather than by the Django sitemap view for two reasons:
//   1. It ships on the SAME ORIGIN as the URLs it lists (a cross-host sitemap
//      is not accepted unless separately verified), and it deploys atomically
//      with the pages it points at.
//   2. Every URL below is a file this script just wrote — so the sitemap can
//      only ever list routes that actually answer 200.
function renderSitemap(articles, { bulkEdits = new Set() } = {}) {
  const published = articles.filter((a) => a?.slug)
  const lastmodOf = new Map(
    published.map((a) => [a.slug, pickLastmod(a, bulkEdits)]),
  )
  const newest = published.reduce(
    (acc, a) => Math.max(acc, timeOf(lastmodOf.get(a.slug))),
    0,
  )
  const newestIso = newest ? new Date(newest).toISOString() : ''

  const entry = ({ loc, lastmod, changefreq, priority }) =>
    [
      '  <url>',
      `    <loc>${escapeHtml(loc)}</loc>`,
      lastmod ? `    <lastmod>${escapeHtml(lastmod)}</lastmod>` : '',
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n')

  const entries = [
    entry({
      loc: `${SITE_ORIGIN}/`,
      lastmod: isoOrEmpty(newestIso),
      changefreq: 'daily',
      priority: '1.0',
    }),
    // Indexable list pages only — /search is prerendered (so a direct hit is a
    // 200 rather than a 404.html bounce) but deliberately kept out of here.
    ...LIST_PAGES.filter((p) => !p.noindex).map((p) =>
      entry({
        loc: `${SITE_ORIGIN}${p.path}`,
        lastmod: isoOrEmpty(newestIso),
        changefreq: 'weekly',
        priority: p.priority || '0.5',
      }),
    ),
    ...[...published]
      .sort((a, b) => timeOf(b.created_at) - timeOf(a.created_at))
      .map((a) =>
        entry({
          loc: `${SITE_ORIGIN}/article/${a.slug}/`,
          lastmod: isoOrEmpty(lastmodOf.get(a.slug)),
          changefreq: 'monthly',
          priority: '0.8',
        }),
      ),
  ]

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${entries.join('\n')}\n` +
    '</urlset>\n'
  )
}

// ── Static list pages ─────────────────────────────────────────────────────
// /articles, /archives, /categories and /tags used to exist only inside the
// SPA: GitHub Pages has no folder for them, so a direct hit answered 404 and
// the browser was bounced through 404.html + sessionStorage. Crawlers never
// got that far. Same technique as the article pages — the built shell with a
// per-page head and a <noscript> body — turns each into a real 200.

const sortedByDate = (articles) =>
  [...articles].sort((a, b) => timeOf(b.created_at) - timeOf(a.created_at))

function articleListItem(article) {
  const d = new Date(article.created_at || '')
  return {
    href: `${SITE_ORIGIN}/article/${article.slug}/`,
    text: article.title || article.slug,
    meta: Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('zh-CN'),
  }
}

const CATEGORY_NAME = (a) =>
  (a?.category && (a.category.name || a.category)) || '未分类'

function tagNames(a) {
  return (Array.isArray(a?.tags) ? a.tags : [])
    .map((t) => (t && (t.name || t)) || '')
    .filter(Boolean)
}

// Group into `{ heading, items }` sections. `byMonth` adds a year → month
// nesting for the archive view.
function dateSections(articles, { byMonth = false } = {}) {
  const years = new Map()
  for (const a of sortedByDate(articles)) {
    const d = new Date(a.created_at || '')
    if (Number.isNaN(d.getTime())) continue
    const year = d.getFullYear()
    if (!years.has(year)) years.set(year, new Map())
    const months = years.get(year)
    const month = byMonth ? d.getMonth() + 1 : 0
    if (!months.has(month)) months.set(month, [])
    months.get(month).push(a)
  }

  const sections = []
  for (const [year, months] of years) {
    const all = [...months.values()].flat()
    const section = { heading: `${year} 年（${all.length} 篇）` }
    if (byMonth) {
      section.subsections = [...months.entries()].map(([month, items]) => ({
        heading: `${month} 月`,
        level: 3,
        items: items.map(articleListItem),
      }))
    } else {
      section.items = all.map(articleListItem)
    }
    sections.push(section)
  }
  return sections
}

function groupSections(articles, keyOf, emptyLabel) {
  const groups = new Map()
  for (const a of sortedByDate(articles)) {
    const keys = keyOf(a)
    const list = keys.length ? keys : [emptyLabel]
    for (const key of list) {
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(a)
    }
  }
  return [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'zh-CN'))
    .map(([name, items]) => ({
      heading: `${name}（${items.length} 篇）`,
      items: items.map(articleListItem),
    }))
}

function renderSections(sections) {
  const parts = []
  for (const section of sections) {
    if (!section) continue
    const level = section.level || 2
    parts.push(`<h${level}>${escapeHtml(section.heading)}</h${level}>`)
    if (section.subsections?.length) parts.push(renderSections(section.subsections))
    if (section.items?.length) {
      const items = section.items
        .map((i) => {
          // Entries without an href are plain text (e.g. the city names on
          // /footprints — they have no page of their own to link to).
          const body = i.href
            ? `<a href="${escapeHtml(i.href)}">${escapeHtml(i.text)}</a>`
            : escapeHtml(i.text)
          return (
            `<li>${body}` +
            (i.meta ? ` <span class="ns-date">${escapeHtml(i.meta)}</span>` : '') +
            `</li>`
          )
        })
        .join('\n')
      parts.push(`<ul>\n${items}\n</ul>`)
    }
  }
  return parts.join('\n')
}

function sectionsForPage(page, articles) {
  switch (page.sections) {
    case 'articles':
      return dateSections(articles)
    case 'archives':
      return dateSections(articles, { byMonth: true })
    case 'categories':
      return groupSections(articles, (a) => [CATEGORY_NAME(a)], '未分类')
    case 'tags':
      return groupSections(articles, tagNames, '未分类')
    case 'footprints': {
      // Fully static — the travel data lives in src/data/footprints.js, so the
      // snapshot carries every city instead of just a page title.
      const provinces = new Set(FOOTPRINT_CITIES.map((c) => c.province))
      return [
        {
          heading: `共 ${FOOTPRINT_CITIES.length} 座城市 · ${provinces.size} 个省/地区`,
        },
        ...FOOTPRINT_REGIONS.map((region) => ({
          heading: `${region.emoji} ${region.name}（${region.cities.length} 座）`,
          items: region.cities.map((city) => ({ text: city })),
        })),
      ]
    }
    // /photos, /friends and /search draw their content from the backend API
    // (the photo wall and the friend list) or from a query at runtime, so the
    // build has nothing to inline. They still get a real 200, a page-level
    // <title>, their own meta and the sibling cross-links — which is what
    // fixes the direct-hit 404.
    default:
      return []
  }
}

function renderListPage(template, page, sections) {
  const url = `${SITE_ORIGIN}${page.path}`
  const title = `${page.title} | ${SITE_NAME}`

  let html = template
  html = html.replace(/<title>.*?<\/title>/, literal(`<title>${escapeHtml(title)}</title>`))
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    literal(`<link rel="canonical" href="${url}" />`),
  )
  html = upsertMeta(html, 'name', 'description', page.description)
  html = upsertMeta(html, 'property', 'og:title', title)
  html = upsertMeta(html, 'property', 'og:description', page.description)
  html = upsertMeta(html, 'property', 'og:url', url)

  // Cross-links so crawlers (and no-JS readers) can reach the sibling pages
  // without going back through the app shell.
  const nav = LIST_PAGES.filter((p) => p.path !== page.path)
    .map((p) => `<a href="${SITE_ORIGIN}${p.path}">${escapeHtml(p.title)}</a>`)
    .join('\n')

  const noscript =
    `<noscript><div class="ns-list">` +
    `<h1>${escapeHtml(page.title)}</h1>` +
    `<p class="ns-lead">${escapeHtml(page.description)}</p>\n` +
    `${renderSections(sections)}\n` +
    `<p class="ns-nav"><a href="${SITE_ORIGIN}/">首页</a>\n${nav}</p>` +
    `</div></noscript>`

  // The shell is reused across builds — replace a previously injected block
  // instead of stacking a second one (same guard as renderHomePage).
  const existing = /<noscript>[\s\S]*?ns-list[\s\S]*?<\/noscript>/
  if (existing.test(html)) {
    html = html.replace(existing, literal(noscript))
  } else {
    html = html.replace(
      '<div id="app"></div>',
      literal(`<div id="app"></div>\n    ${NOSCRIPT_STYLE}\n    ${noscript}`),
    )
  }
  return html
}

// ── rss.xml ───────────────────────────────────────────────────────────────
// A CDATA section ends at the first `]]>`. Split any occurrence across two
// sections so an article body containing it can't truncate the feed.
const cdata = (str) =>
  `<![CDATA[${String(str ?? '').replaceAll(']]>', ']]]]><![CDATA[>')}]]>`

const rfc822 = (iso) => {
  const d = new Date(iso || '')
  return Number.isNaN(d.getTime()) ? '' : d.toUTCString()
}

function renderRssFeed(articles, { buildDate = new Date().toISOString() } = {}) {
  const items = sortedByDate(articles.filter((a) => a?.slug)).slice(0, FEED_ITEM_COUNT)

  const body = items
    .map((a, i) => {
      const url = `${SITE_ORIGIN}/article/${a.slug}/`
      // A post's category is often also one of its tags — dedupe so the feed
      // doesn't repeat a <category> element.
      const categories = [...new Set([CATEGORY_NAME(a), ...tagNames(a)])].filter(Boolean)
      const withFullText = i < FEED_FULL_TEXT_COUNT && a.html_content
      return [
        '    <item>',
        `      <title>${escapeHtml(a.title)}</title>`,
        `      <link>${escapeHtml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeHtml(url)}</guid>`,
        rfc822(a.created_at) ? `      <pubDate>${rfc822(a.created_at)}</pubDate>` : '',
        `      <description>${escapeHtml((a.excerpt || '').slice(0, 160))}</description>`,
        ...categories.map((c) => `      <category>${escapeHtml(c)}</category>`),
        withFullText
          ? `      <content:encoded>${cdata(wrapTables(sanitizeHtml(a.html_content)))}</content:encoded>`
          : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    '  <channel>\n' +
    `    <title>${escapeHtml(SITE_NAME)}</title>\n` +
    `    <link>${SITE_ORIGIN}/</link>\n` +
    `    <description>${escapeHtml(SITE_DESCRIPTION)}</description>\n` +
    '    <language>zh-CN</language>\n' +
    `    <lastBuildDate>${rfc822(buildDate)}</lastBuildDate>\n` +
    `    <atom:link href="${SITE_ORIGIN}${FEED_PATH}" rel="self" type="application/rss+xml" />\n` +
    `${body}\n` +
    '  </channel>\n' +
    '</rss>\n'
  )
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

  const bulkEdits = findBulkEdits(articles)
  const published = articles.filter((a) => a?.slug)
  const lastmods = new Map(published.map((a) => [a.slug, pickLastmod(a, bulkEdits)]))
  // Three buckets worth reporting: articles that were never touched after
  // publication (lastmod == created_at either way), articles demoted to their
  // publication date because they sat in a batch, and the rest.
  const neverEdited = published.filter(
    (a) => !a.updated_at || timeOf(a.updated_at) <= timeOf(a.created_at),
  ).length
  const batchFallback = published.filter(
    (a) => bulkEdits.has(a.slug) && timeOf(a.updated_at) > timeOf(a.created_at),
  ).length
  const batchDays = [...new Set(published.filter((a) => bulkEdits.has(a.slug)).map((a) => dayOf(a.updated_at)))]
    .sort()
    .join(', ')
  console.log(
    `[prerender] lastmod: ${lastmods.size - neverEdited - batchFallback} 篇用 updated_at, ` +
      `${batchFallback} 篇因批量编辑回落 created_at, ${neverEdited} 篇从未编辑` +
      `（批量编辑批次: ${batchDays || '无'}）`,
  )

  let written = 0
  for (const article of articles) {
    if (!article?.slug) continue
    const dir = join(DIST, 'article', article.slug)
    mkdirSync(dir, { recursive: true })
    writeFileSync(
      join(dir, 'index.html'),
      renderArticlePage(template, article, { lastmod: lastmods.get(article.slug) }),
      'utf8',
    )
    written += 1
  }
  console.log(`[prerender] wrote ${written} static article page(s) into dist/article/.`)

  // Static list pages — these are what let /articles & co. answer 200 instead
  // of bouncing through 404.html, and they are the only non-article URLs the
  // sitemap is allowed to list.
  let listWritten = 0
  for (const page of LIST_PAGES) {
    try {
      const dir = join(DIST, page.path.replace(/^\/|\/$/g, ''))
      mkdirSync(dir, { recursive: true })
      writeFileSync(
        join(dir, 'index.html'),
        renderListPage(template, page, sectionsForPage(page, articles)),
        'utf8',
      )
      listWritten += 1
    } catch (e) {
      console.warn(`[prerender] could not write ${page.path}: ${e?.message || e}`)
    }
  }
  console.log(`[prerender] wrote ${listWritten} static list page(s).`)

  // sitemap.xml — same origin as the site, listing only what was just written.
  try {
    writeFileSync(
      join(DIST, 'sitemap.xml'),
      renderSitemap(articles, { bulkEdits }),
      'utf8',
    )
    console.log(
      `[prerender] wrote sitemap.xml (` +
        `${lastmods.size + LIST_PAGES.filter((p) => !p.noindex).length + 1} URLs).`,
    )
  } catch (e) {
    console.warn(`[prerender] could not write sitemap.xml: ${e?.message || e}`)
  }

  // rss.xml — full text for the newest few items, excerpts for the rest.
  try {
    const feed = renderRssFeed(articles)
    writeFileSync(join(DIST, FEED_PATH.replace(/^\//, '')), feed, 'utf8')
    console.log(
      `[prerender] wrote rss.xml (${Math.min(articles.length, FEED_ITEM_COUNT)} items, ` +
        `${FEED_FULL_TEXT_COUNT} 篇全文, ${Math.round(feed.length / 1024)} KB).`,
    )
  } catch (e) {
    console.warn(`[prerender] could not write rss.xml: ${e?.message || e}`)
  }

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

// Exported for unit tests (see src/__tests__/prerender.test.js). The build
// entrypoint stays `main()` below — guarded so importing the module in
// vitest never triggers network/dist side effects.
export {
  SITE_NAME,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_ORIGIN,
  LIST_PAGES,
  FEED_PATH,
  FEED_ITEM_COUNT,
  FEED_FULL_TEXT_COUNT,
  escapeHtml,
  sanitizeHtml,
  wrapTables,
  upsertMeta,
  renderArticlePage,
  renderHomePage,
  toSnapshotList,
  findBulkEdits,
  pickLastmod,
  renderSitemap,
  renderRssFeed,
  renderListPage,
  sectionsForPage,
}

if (!process.env.VITEST_WORKER_ID) {
  main().catch((e) => {
    // Never fail the build because of pre-rendering.
    console.warn('[prerender] unexpected error, skipping:', e?.message || e)
  })
}