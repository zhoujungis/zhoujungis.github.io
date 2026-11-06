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
  TAG_PAGE_MIN_ARTICLES,
  tagPath,
} from '../src/utils/siteConfig.js'
// Same travel data the /footprints page renders, so its no-JS snapshot can't
// drift from the live map.
import { FOOTPRINT_CITIES, FOOTPRINT_REGIONS } from '../src/data/footprints.js'
// 关于/隐私政策/免责声明的正文：与 pages/SitePage.vue 共用同一份数据，
// 静态快照与运行时页面因此不可能写出两套不同的措辞。
import { getSitePage } from '../src/data/sitePages.js'
// 五个编辑专题：聚合页正文与运行时页面同源，sitemap 也只列这些真实存在
// 的路径。
import {
  TOPICS,
  topicPath,
  categoryPath,
  findTopic,
  seriesOrder,
  SERIES_MIN_MINUTES,
} from '../src/data/topics.js'
// 首页刊头文案与项目列表：运行时 Home.vue 与首页静态快照共用这一份，
// 快照里的自述不会和页面上显示的写成两套。
import { HOME_MASTHEAD, HOME_SUMMARY, HOME_PROJECTS } from '../src/data/home.js'
// 英文版文章（手写英文稿，不是机翻）。静态页与运行时共用同一份数据。
import { EN_ARTICLES, EN_BY_SLUG } from '../src/data/en/articles.js'
// 英文站导航与专题文案：与 pages/en/* 同源，静态快照不会和界面写成两套。
import { EN_UI, EN_TOPICS, EN_HOME, EN_PROJECTS, EN_CONTACT } from '../src/data/en/site.js'
// 英文版合规页正文：与 pages/en/EnPage.vue 同源。
import { EN_PAGES } from '../src/data/en/pages.js'

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

// 首页静态快照列出的文章条数。审核方判断「内容量」看的是落地页本身，只列
// 十来篇文章名会让一个有 100+ 篇存量的站点看起来像目录页；50 条带摘要的
// 条目约 20KB，一次请求的成本可以忽略，但首屏就能看出站点确实在持续写作。
const HOME_ARTICLE_COUNT = 50

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

// 结构化数据与 meta description 都要纯文本：去标签、解常见实体、压空白。
function plainText(html) {
  return String(html ?? '')
    .replace(/<script[\s\S]*?<\/script\s*>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

// 中文 SERP 大约 70–90 个汉字最稳。优先在句末标点收尾，避免把句子截成
// 半句；确实没有标点时才硬截并补省略号。
function metaDescription(text, fallback = '', max = 90) {
  const source = plainText(text) || String(fallback || '')
  if (source.length <= max) return source
  const window = source.slice(0, max)
  const cut = Math.max(
    window.lastIndexOf('。'),
    window.lastIndexOf('！'),
    window.lastIndexOf('？'),
    window.lastIndexOf('；'),
  )
  if (cut >= 60) return window.slice(0, cut + 1)
  // 没有句末标点时硬截；若正好切断英文单词，退回到最近的空格。
  let hard = window.slice(0, max - 1)
  if (/[A-Za-z0-9]$/.test(hard)) {
    const space = hard.lastIndexOf(' ')
    if (space >= 60) hard = hard.slice(0, space)
  }
  return `${hard.trim()}…`
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

// Minimal typography for the static #app fallback — the markdown-body styles
// live in a lazy-loaded chunk CSS that the shell doesn't include.
const NOSCRIPT_STYLE = `
<style>
.ns-article{max-width:780px;margin:96px auto 64px;padding:0 20px;line-height:1.85;color:var(--text-primary,#1f2a24);font-family:'PingFang SC','Hiragino Sans GB','Noto Sans SC','Microsoft YaHei','Segoe UI',sans-serif}
.ns-article .ns-breadcrumb{font-size:.8rem;line-height:1.6;margin-bottom:.8em;color:#657168}
.ns-article .ns-breadcrumb a{color:#3f6b57;text-decoration:none}
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
.ns-article .ns-taxonomy{font-size:.82rem;line-height:1.9;color:#657168;margin:1.2em 0}
.ns-article .ns-taxonomy a{color:#3f6b57;text-decoration:none;margin-right:.6em}
.ns-article .ns-series{margin:1.4em 0;padding:14px 16px;background:#f2f4ee;border-radius:8px;font-size:.9rem}
.ns-article .ns-series ol{margin:.6em 0;padding-left:1.4em}
.ns-article .ns-topic{margin:2em 0;padding:16px;border:1px solid #dce2da;border-radius:8px}
.ns-article .ns-topic a{color:#3f6b57}
.ns-article .ns-pager,.ns-article .ns-related{margin-top:2em;padding-top:1em;border-top:1px solid #dce2da;font-size:.9rem}
.ns-article .ns-pager a,.ns-article .ns-related a{color:#3f6b57;text-decoration:none}
.ns-article .ns-pager li,.ns-article .ns-related li{margin:.4em 0}
.ns-article .ns-site-nav{margin-top:2em;padding-top:1em;border-top:1px solid #dce2da;font-size:.88rem;line-height:2}
.ns-article .ns-site-nav a{color:#3f6b57;text-decoration:none;margin-right:.9em}
.ns-home-list{max-width:780px;margin:96px auto 64px;padding:0 20px;line-height:1.8;font-family:'PingFang SC','Hiragino Sans GB','Noto Sans SC','Microsoft YaHei','Segoe UI',sans-serif}
.ns-home-list h1{font-size:1.6rem;margin:0 0 .5em}
.ns-home-list h2{font-size:1.12rem;margin:2em 0 .5em;padding-bottom:.35em;border-bottom:1px solid #dce2da}
.ns-home-list ul{padding-left:1.2em}
.ns-home-list li{margin:.4em 0}
.ns-home-list a{color:#3f6b57}
.ns-home-list .ns-sub{color:#3f6b57;font-size:.95rem;font-weight:700;letter-spacing:.18em;margin:.3em 0 .9em}
.ns-home-list .ns-lede{font-size:1rem;font-weight:700;margin:.6em 0}
.ns-home-list .ns-meta,.ns-home-list .ns-date{color:#657168;font-size:.82rem}
.ns-home-list .ns-excerpt{color:#657168;font-size:.85rem;line-height:1.7;margin:.25em 0 1em}
.ns-home-list .ns-more{color:#657168;font-size:.88rem}
.ns-home-list .ns-nav{margin-top:2.5em;padding-top:1em;border-top:1px solid #dce2da;font-size:.88rem;line-height:2}
.ns-home-list .ns-nav a{margin-right:.9em}
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

// 数据库里早期录入的封面写死了 https://zhoujungis.github.io/...，域名迁移后
// 每张封面都要先撞一次旧域名的跨域 301。快照里统一降成站点根相对路径，
// 由承载页面自己决定协议与域名（换域名也不用重跑数据）。
const SITE_HOST = new URL(SITE_ORIGIN).hostname

function normalizeCover(url) {
  if (!url) return url
  try {
    const parsed = new URL(url, SITE_ORIGIN)
    if (parsed.hostname === SITE_HOST || parsed.hostname === 'zhoujungis.github.io') {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch {
    // 非法 URL 原样保留
  }
  return url
}

// og:image / JSON-LD 要求绝对地址，站内相对路径在这里补全。
function absoluteUrl(url) {
  return new URL(url, SITE_ORIGIN).href
}

function renderArticlePage(
  template,
  article,
  { lastmod, seriesTopic, seriesItems = [], neighbors = {}, related = [], tagPageSlugs = new Set() } = {},
) {
  const url = `${SITE_ORIGIN}/article/${article.slug}/`
  const title = `${article.title} | ${SITE_NAME}`
  const categoryName = CATEGORY_NAME(article)
  const keywords = tagNames(article)
  const description = metaDescription(
    article.excerpt || article.html_content,
    `${article.title}${categoryName ? `，${categoryName}` : ''} · 尘世栈帧`,
  )
  const isoDate = article.created_at || ''
  // Same value the sitemap publishes — see pickLastmod() for why updated_at
  // alone can't be trusted.
  const modifiedDate = lastmod || article.updated_at || isoDate
  const cover = absoluteUrl(article.cover_image || '/og-image.jpg')
  const authorName =
    (article.author && (article.author.name || article.author)) || SITE_AUTHOR
  const bodyText = plainText(article.html_content || '')
  const wordCount =
    (bodyText.match(/[\u4e00-\u9fff]/g) || []).length +
    (bodyText.match(/[A-Za-z0-9]+/g) || []).length

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
  html = upsertMeta(html, 'property', 'og:image:secure_url', cover)
  html = upsertMeta(html, 'property', 'og:image:alt', `${article.title} 封面`)
  html = upsertMeta(html, 'name', 'twitter:title', article.title)
  html = upsertMeta(html, 'name', 'twitter:description', description)
  html = upsertMeta(html, 'name', 'twitter:image', cover)
  html = upsertMeta(html, 'name', 'author', authorName)
  html = upsertMeta(html, 'property', 'article:section', categoryName)

  const articleLd = {
    '@type': 'Article',
    '@id': `${url}#article`,
    url,
    headline: article.title,
    description,
    image: cover,
    datePublished: isoDate || undefined,
    dateModified: modifiedDate || undefined,
    author: {
      '@type': 'Person',
      '@id': `${SITE_ORIGIN}/#person`,
      name: authorName,
    },
    publisher: { '@id': `${SITE_ORIGIN}/#publisher` },
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: categoryName || undefined,
    keywords: keywords.join(', ') || undefined,
    inLanguage: 'zh-CN',
    wordCount: wordCount || undefined,
  }

  const breadcrumbLd = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE_ORIGIN}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: '文章',
        item: `${SITE_ORIGIN}/articles/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: url,
      },
    ],
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [articleLd, breadcrumbLd],
  }

  const tagMeta = keywords
    .map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}" />`)
    .join('\n    ')

  // JS 用户的「零等待首屏」元数据。#app 里的静态正文在 Vue mount 前会被
  // src/utils/prerenderPreview.js 读回来渲染；这里只带元数据、不重复搬运
  // 正文，页面体积只多约 1 KB。
  // 正文/标题里出现 </script> 会提前终结这个标签，所以 `<` 一律写成 JSON 的
  // 六位 Unicode 转义（小写 u + 4 位十六进制），JSON.parse 时会原样还原。
  const previewMeta = {
    slug: article.slug,
    title: article.title || '',
    created_at: isoDate,
    updated_at: article.updated_at || '',
    author: article.author ?? null,
    category: article.category ?? null,
    tags: article.tags ?? [],
    cover_image: article.cover_image || '',
    excerpt: (article.excerpt || '').slice(0, 160),
    reading_time: article.reading_time ?? null,
    views_count: article.views_count || 0,
    likes_count: article.likes_count || 0,
    prev_article: article.prev_article ?? null,
    next_article: article.next_article ?? null,
  }
  const previewTag =
    `<script type="application/json" id="prerender-article">` +
    `${JSON.stringify(previewMeta).replaceAll('<', '\\u003c')}</script>`

  // 双语互指：有英文版时，中文页与英文页互相声明 hreflang，Google 才不会
  // 把两个语言版本当成重复内容。x-default 指向中文版（默认受众）。
  const enEdition = EN_BY_SLUG.get(article.slug)
  const alternates = enEdition
    ? `    <link rel="alternate" hreflang="zh-CN" href="${url}" />\n` +
      `    <link rel="alternate" hreflang="en" href="${SITE_ORIGIN}/en/article/${enEdition.slug}/" />\n` +
      `    <link rel="alternate" hreflang="x-default" href="${url}" />\n`
    : ''

  const headExtras =
    `${NOSCRIPT_STYLE}\n` +
    alternates +
    `    <meta property="og:type" content="article" />\n` +
    `    ${isoDate ? `<meta property="article:published_time" content="${isoDate}" />\n    ` : ''}` +
    `    ${modifiedDate ? `<meta property="article:modified_time" content="${modifiedDate}" />\n    ` : ''}` +
    `    ${tagMeta ? `${tagMeta}\n    ` : ''}` +
    `<script type="application/ld+json" data-article-jsonld="1">${JSON.stringify(jsonLd)}</script>\n` +
    `    ${previewTag}`

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
  // 系列目录也写进 no-JS 快照：这是爬虫能看到的站内互链，不依赖前端接口。
  const seriesNav =
    seriesTopic && seriesItems.length >= 3
      ? `<nav class="ns-series"><p><strong>本系列 · ${escapeHtml(seriesTopic.name)}</strong>（${seriesItems.length} 篇）</p><ol>` +
        seriesItems
          .map((a) =>
            a.slug === article.slug
              ? `<li><strong>${escapeHtml(a.title)}</strong>（当前）</li>`
              : `<li><a href="${SITE_ORIGIN}/article/${a.slug}/">${escapeHtml(a.title)}</a></li>`,
          )
          .join('') +
        `</ol><p><a href="${SITE_ORIGIN}${topicPath(seriesTopic.slug)}">查看${escapeHtml(seriesTopic.name)}专题</a></p></nav>`
      : ''

  // 分类 / 标签是爬虫能看到的横向内链，直接写进静态正文。标签落地页只对
  // 达到薄内容阈值的标签存在，所以低篇数标签保持纯文本，不产生死链。
  const topic = findTopic(article.category?.slug)
  const taxonomyParts = []
  if (article.category) {
    const catHref = article.category.slug
      ? `${SITE_ORIGIN}${categoryPath(article.category.slug)}`
      : ''
    taxonomyParts.push(
      `分类：${
        catHref
          ? `<a href="${catHref}">${escapeHtml(categoryName)}</a>`
          : escapeHtml(categoryName)
      }`,
    )
  }
  const articleTags = tagEntries(article)
  if (articleTags.length) {
    taxonomyParts.push(
      '标签：' +
        articleTags
          .map((t) =>
            tagPageSlugs.has(t.slug)
              ? `<a href="${SITE_ORIGIN}${tagPath(t.slug)}">${escapeHtml(t.name)}</a>`
              : escapeHtml(t.name),
          )
          .join(' '),
    )
  }
  const taxonomy = taxonomyParts.length
    ? `<p class="ns-taxonomy">${taxonomyParts.join(' · ')}</p>`
    : ''

  const topicCta = topic
    ? `<p class="ns-topic">专题：<a href="${SITE_ORIGIN}${topicPath(topic.slug)}"><strong>${escapeHtml(topic.name)}</strong></a> — ${escapeHtml(topic.tagline)}</p>`
    : ''

  const pagerItems = []
  if (neighbors.prev) {
    pagerItems.push(
      `<li>上一篇：<a href="${SITE_ORIGIN}/article/${neighbors.prev.slug}/">${escapeHtml(neighbors.prev.title)}</a></li>`,
    )
  }
  if (neighbors.next) {
    pagerItems.push(
      `<li>下一篇：<a href="${SITE_ORIGIN}/article/${neighbors.next.slug}/">${escapeHtml(neighbors.next.title)}</a></li>`,
    )
  }
  const pager = pagerItems.length
    ? `<nav class="ns-pager"><p><strong>继续阅读</strong></p><ul>${pagerItems.join('')}</ul></nav>`
    : ''

  const relatedNav = related.length
    ? `<nav class="ns-related"><p><strong>相关文章</strong></p><ul>` +
      related
        .map(
          (a) =>
            `<li><a href="${SITE_ORIGIN}/article/${a.slug}/">${escapeHtml(a.title)}</a></li>`,
        )
        .join('') +
      `</ul></nav>`
    : ''

  // 静态正文直接放进 #app，而不是 <noscript>：
  // 百度、Bing 等不执行 JS 的爬虫也能读到完整段落与内链；Vue 在 #app 上
  // mount 时会清空并替换这段 fallback，JS 用户不会看到两份内容。
  // 每个文章页都带一条站内页脚：AdSense 审核要求全站能走到隐私政策，
  // 而审核爬虫可能只落到某一篇文章上，不能指望它先回首页再找页脚。
  const siteNav =
    `<nav class="ns-site-nav">` +
    `<a href="${SITE_ORIGIN}/">首页</a> ` +
    `<a href="${SITE_ORIGIN}/articles/">全部文章</a> ` +
    `<a href="${SITE_ORIGIN}/topics/">专题</a> ` +
    `<a href="${SITE_ORIGIN}/about/">关于本站</a> ` +
    `<a href="${SITE_ORIGIN}/privacy/">隐私政策</a> ` +
    `<a href="${SITE_ORIGIN}/disclaimer/">免责声明</a>` +
    `</nav>`

  const staticBody =
    `<div class="ns-article">` +
    `<nav class="ns-breadcrumb"><a href="${SITE_ORIGIN}/">首页</a> / ` +
    `<a href="${SITE_ORIGIN}/articles/">文章</a> / ` +
    `<span>${escapeHtml(article.title)}</span></nav>` +
    `<h1>${escapeHtml(article.title)}</h1>` +
    `<div class="ns-meta">${isoDate ? escapeHtml(new Date(isoDate).toLocaleDateString('zh-CN')) : ''} · ${escapeHtml(SITE_AUTHOR)}</div>` +
    taxonomy +
    seriesNav +
    `<div class="markdown-body">${safeBody}</div>` +
    topicCta +
    pager +
    relatedNav +
    siteNav +
    `</div>`
  html = html.replace('<div id="app"></div>', literal(`<div id="app">${staticBody}</div>`))

  return html
}

// ── 首页静态快照 ──────────────────────────────────────────────────────────
// 为什么这份快照要写这么多正文：首页是审核爬虫（AdSense、Bing 等不执行或
// 延迟执行 JS 的抓取器）看到的第一屏。原来的快照只有标题 + 10 个文章名，
// 约 450 字可见文本 —— 对「内容量」判定来说接近空壳。现在把刊头自述、站点
// 定位、五个专题简介、最近 50 篇文章（各带摘要）与项目介绍一起写进去，
// 首屏就是可判定主题与体量的真实内容。
//
// 正文仍然放进 #app：Vue 在 #app 上 mount 时会整体替换这段 fallback，JS
// 用户不会看到两份。
const homeDate = (iso) => {
  const d = new Date(iso || '')
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('zh-CN')
}

function renderHomePage(template, articles) {
  const sorted = [...articles]
    .filter((a) => a?.slug && a?.title)
    .sort((a, b) => timeOf(b.created_at) - timeOf(a.created_at))
  if (!sorted.length) return template

  const lede = HOME_MASTHEAD.lede
    .map((p, i) => `<p${i === 0 ? ' class="ns-lede"' : ''}>${escapeHtml(p)}</p>`)
    .join('\n')

  const stats = [
    `共 ${sorted.length} 篇文章`,
    homeDate(sorted[0].created_at) ? `最近更新 ${homeDate(sorted[0].created_at)}` : '',
    '技术栈 Vue 3 × Django',
  ]
    .filter(Boolean)
    .join(' · ')

  const summary = HOME_SUMMARY.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n')

  // 专题条目：名字 + 英文名 + 一句话定位 + 首段简介。这段简介与 /topics/<slug>/
  // 的静态聚合页同源（data/topics.js），两处措辞不会分叉。
  const topicItems = TOPICS.map(
    (topic) =>
      `<li><a href="${SITE_ORIGIN}${topicPath(topic.slug)}">${escapeHtml(topic.name)}</a>` +
      ` <span class="ns-date">${escapeHtml(topic.en)} · ${escapeHtml(topic.tagline)}</span>` +
      `<p class="ns-excerpt">${escapeHtml(topic.intro?.[0] || topic.tagline)}</p></li>`,
  ).join('\n')

  // 文章条目带摘要：只靠标题的一串链接构不成「内容」，摘要才是审核方与
  // 读者据以判断站点主题的文本。列表接口给的 excerpt 已经截到 160 字。
  const listedArticles = sorted.slice(0, HOME_ARTICLE_COUNT)
  const articleItems = listedArticles
    .map((a) => {
      const meta = [
        homeDate(a.created_at),
        CATEGORY_NAME(a),
        a.reading_time ? `${a.reading_time} 分钟` : '',
      ]
        .filter(Boolean)
        .join(' · ')
      const excerpt = plainText(a.excerpt || a.html_content || '').slice(0, 120)
      return (
        `<li><a href="${SITE_ORIGIN}/article/${escapeHtml(a.slug)}/">${escapeHtml(a.title)}</a>` +
        ` <span class="ns-date">${escapeHtml(meta)}</span>` +
        (excerpt ? `<p class="ns-excerpt">${escapeHtml(excerpt)}</p>` : '') +
        `</li>`
      )
    })
    .join('\n')

  const projectItems = HOME_PROJECTS.map(
    (p) =>
      `<li><a href="${escapeHtml(p.url)}">${escapeHtml(p.name)}</a>` +
      ` — ${escapeHtml(p.strong)}<p class="ns-excerpt">${escapeHtml(p.desc)}</p></li>`,
  ).join('\n')

  const nav = LIST_PAGES.filter((p) => !p.noindex)
    .map((p) => `<a href="${SITE_ORIGIN}${p.path}">${escapeHtml(p.title)}</a>`)
    .join('\n')

  const staticBody =
    `<div class="ns-home-list">` +
    `<header class="ns-masthead">` +
    `<h1>${escapeHtml(SITE_NAME)} · ${escapeHtml(HOME_MASTHEAD.title)}</h1>` +
    `<p class="ns-sub">${escapeHtml(HOME_MASTHEAD.sub)}</p>\n` +
    `${lede}\n` +
    `<p class="ns-meta">${escapeHtml(stats)}</p>` +
    `</header>\n` +
    `<section><h2>本站写什么</h2>\n${summary}\n</section>\n` +
    `<section><h2>精选专题</h2>\n<ul>\n${topicItems}\n</ul>\n</section>\n` +
    `<section><h2>最新文章</h2>\n` +
    `<p class="ns-more">共 ${sorted.length} 篇，下面按发布时间列出最近 ${listedArticles.length} 篇：</p>\n` +
    `<ul>\n${articleItems}\n</ul>\n` +
    `<p class="ns-more">更多：<a href="${SITE_ORIGIN}/articles/">全部文章</a> · ` +
    `<a href="${SITE_ORIGIN}/archives/">按年月归档</a> · ` +
    `<a href="${SITE_ORIGIN}/topics/">全部专题</a> · ` +
    `<a href="${SITE_ORIGIN}/rss.xml">RSS 订阅</a></p></section>\n` +
    `<section><h2>最新项目</h2>\n<ul>\n${projectItems}\n</ul>\n</section>\n` +
    `<nav class="ns-nav">\n${nav}\n</nav>` +
    `</div>`

  // 与文章页一致：静态正文放进 #app，Vue mount 时替换。
  return template.replace(
    '<div id="app"></div>',
    literal(`${NOSCRIPT_STYLE}\n    <div id="app">${staticBody}</div>`),
  )
}

// ── 英文版 ────────────────────────────────────────────────────────────────
// /en/ 与 /en/article/<slug>/：手写英文稿的静态快照。页面不套中文站的壳，
// 正文复用中文快照的排版类（ns-article / ns-list），无 JS 时也是可读正文。
function renderEnPage(template, { title, description, url, alternates = '', body }) {
  let html = template
  html = html.replace(/<title>.*?<\/title>/, literal(`<title>${escapeHtml(title)}</title>`))
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    literal(`<link rel="canonical" href="${url}" />`),
  )
  html = upsertMeta(html, 'name', 'description', description)
  html = upsertMeta(html, 'property', 'og:title', title)
  html = upsertMeta(html, 'property', 'og:description', description)
  html = upsertMeta(html, 'property', 'og:url', url)
  html = upsertMeta(html, 'property', 'og:locale', 'en_US')
  html = upsertMeta(html, 'name', 'twitter:title', title)
  html = upsertMeta(html, 'name', 'twitter:description', description)
  // 英文页不应被当成中文站的一部分：html lang 与正文语言一致。
  html = html.replace('<html lang="zh-CN">', '<html lang="en">')
  html = html.replace('</head>', literal(`${NOSCRIPT_STYLE}\n${alternates}  </head>`))
  return html.replace('<div id="app"></div>', literal(`<div id="app">${body}</div>`))
}

const EN_HOME_URL = `${SITE_ORIGIN}/en/`

function enAlternates(article) {
  if (!article) {
    return (
      `    <link rel="alternate" hreflang="zh-CN" href="${SITE_ORIGIN}/" />\n` +
      `    <link rel="alternate" hreflang="en" href="${EN_HOME_URL}" />\n` +
      `    <link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/" />\n`
    )
  }
  const zhUrl = `${SITE_ORIGIN}/article/${article.zhSlug}/`
  const enUrl = `${EN_HOME_URL}article/${article.slug}/`
  return (
    `    <link rel="alternate" hreflang="zh-CN" href="${zhUrl}" />\n` +
    `    <link rel="alternate" hreflang="en" href="${enUrl}" />\n` +
    `    <link rel="alternate" hreflang="x-default" href="${zhUrl}" />\n`
  )
}

const EN_BASE = `${SITE_ORIGIN}/en`

function enPostItems(articles) {
  if (!articles.length) return `<p class="ns-more">${escapeHtml(EN_UI.home.emptyNote)}</p>`
  return (
    `<ul>\n` +
    articles
      .map(
        (a) =>
          `<li><a href="${EN_BASE}/article/${a.slug}/">${escapeHtml(a.title)}</a>` +
          ` <span class="ns-date">${escapeHtml(a.date)} · ${a.readingTime} min</span>` +
          `<p class="ns-excerpt">${escapeHtml(a.excerpt)}</p></li>`,
      )
      .join('\n') +
    `\n</ul>`
  )
}

function enNav() {
  return (
    `<nav class="ns-nav">` +
    `<a href="${EN_BASE}/">Home</a>` +
    `<a href="${EN_BASE}/articles/">Articles</a>` +
    `<a href="${EN_BASE}/topics/">Topics</a>` +
    `<a href="${EN_BASE}/about/">About</a>` +
    `<a href="${EN_BASE}/privacy/">Privacy</a>` +
    `<a href="${EN_BASE}/disclaimer/">Disclaimer</a>` +
    `<a href="${SITE_ORIGIN}/rss.xml">RSS</a>` +
    `<a href="${SITE_ORIGIN}/" hreflang="zh-CN">中文</a>` +
    `</nav>`
  )
}

// 英文合规页：与中文 /about/ /privacy/ /disclaimer/ 一一对应，互相声明 hreflang。
function renderEnContentPage(template, page) {
  const zhPath = `/${page.key}/`
  const body =
    `<div class="ns-list">` +
    `<h1>${escapeHtml(page.title)}</h1>` +
    `<p class="ns-lead">${escapeHtml(page.subtitle)}</p>\n` +
    page.sections
      .map((section) => {
        const paragraphs = (section.paragraphs || [])
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join('\n')
        const items = (section.items || []).length
          ? `<ul>\n` +
            section.items
              .map((item) =>
                item.href
                  ? `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.text)}</a></li>`
                  : `<li>${escapeHtml(item.text)}</li>`,
              )
              .join('\n') +
            `\n</ul>`
          : ''
        return `<h2>${escapeHtml(section.heading)}</h2>\n${paragraphs}${items ? `\n${items}` : ''}`
      })
      .join('\n') +
    `\n${enNav()}</div>`

  return renderEnPage(template, {
    title: `${page.title} | Stack Frame`,
    description: page.description,
    url: `${SITE_ORIGIN}${page.path}`,
    alternates:
      `    <link rel="alternate" hreflang="zh-CN" href="${SITE_ORIGIN}${zhPath}" />\n` +
      `    <link rel="alternate" hreflang="en" href="${SITE_ORIGIN}${page.path}" />\n` +
      `    <link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${zhPath}" />\n`,
    body,
  })
}

function renderEnIndexPage(template) {
  const topics = EN_TOPICS.map(
    (t) =>
      `<li><a href="${EN_BASE}/topics/${t.slug}/">${escapeHtml(t.name)}</a>` +
      ` — ${escapeHtml(t.tagline)}</li>`,
  ).join('\n')

  const latest = EN_ARTICLES.slice(0, 6)
  const projects = EN_PROJECTS.map(
    (p) =>
      `<li><a href="${escapeHtml(p.url)}">${escapeHtml(p.name)}</a>` +
      ` <span class="ns-date">${escapeHtml(p.meta)}</span>` +
      `<p class="ns-excerpt">${escapeHtml(p.blurb)}</p>` +
      (p.post
        ? `<a class="ns-more" href="${SITE_ORIGIN}${escapeHtml(p.post)}">Read the teardown</a>`
        : '') +
      `</li>`,
  ).join('\n')

  const body =
    `<div class="ns-home-list">` +
    `<h1>${escapeHtml(EN_UI.home.title)}</h1>` +
    `<p class="ns-sub">${escapeHtml(EN_UI.home.sub)}</p>\n` +
    EN_UI.home.lede.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n') +
    `\n<p class="ns-meta">${EN_ARTICLES.length} English post(s) · full archive in Chinese</p>` +
    `<section><h2>${escapeHtml(EN_HOME.summaryTitle)}</h2>\n` +
    EN_HOME.summary.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n') +
    `</section>` +
    `<section><h2>${escapeHtml(EN_UI.home.topicsTitle)}</h2>\n<ul>\n${topics}\n</ul></section>` +
    `<section><h2>${escapeHtml(EN_UI.home.postsTitle)}</h2>` +
    `<p class="ns-more">${escapeHtml(EN_HOME.latestNote(latest.length, EN_ARTICLES.length))}</p>` +
    `${enPostItems(latest)}</section>` +
    `<section><h2>${escapeHtml(EN_HOME.projectsTitle)}</h2>` +
    `<p class="ns-more">${escapeHtml(EN_HOME.projectsNote)}</p><ul>\n${projects}\n</ul></section>` +
    `<section><h2>${escapeHtml(EN_HOME.contactTitle)}</h2>` +
    `<p>${escapeHtml(EN_HOME.contactNote)}</p><ul>` +
    `<li>Email: <a href="mailto:${escapeHtml(EN_CONTACT.email)}">${escapeHtml(EN_CONTACT.email)}</a></li>` +
    `<li>GitHub: <a href="${escapeHtml(EN_CONTACT.github)}">github.com/zhoujungis</a></li>` +
    `<li>RSS: <a href="${SITE_ORIGIN}${escapeHtml(EN_CONTACT.rss)}">${SITE_ORIGIN}${escapeHtml(EN_CONTACT.rss)}</a></li>` +
    `</ul></section>` +
    enNav() +
    `</div>`

  return renderEnPage(template, {
    title: 'Code & Life | Stack Frame',
    description:
      'Selected English posts about small desktop tools, embedded databases and AI agents.',
    url: `${EN_HOME_URL}`,
    alternates: enAlternates(null),
    body,
  })
}

function renderEnArticlesPage(template) {
  const body =
    `<div class="ns-list">` +
    `<h1>${escapeHtml(EN_UI.articles.title)}</h1>` +
    `<p class="ns-lead">${escapeHtml(EN_UI.articles.lead)}</p>\n` +
    `${enPostItems(EN_ARTICLES)}\n` +
    enNav() +
    `</div>`

  return renderEnPage(template, {
    title: 'Articles | Stack Frame',
    description: EN_UI.articles.lead,
    url: `${EN_BASE}/articles/`,
    alternates: enAlternates(null),
    body,
  })
}

function renderEnTopicsPage(template) {
  const items = EN_TOPICS.map(
    (t) =>
      `<li><a href="${EN_BASE}/topics/${t.slug}/">${escapeHtml(t.name)}</a>` +
      ` — ${escapeHtml(t.tagline)}` +
      `<p class="ns-excerpt">${escapeHtml(t.intro)}</p></li>`,
  ).join('\n')

  const body =
    `<div class="ns-list">` +
    `<h1>${escapeHtml(EN_UI.topics.title)}</h1>` +
    `<p class="ns-lead">${escapeHtml(EN_UI.topics.lead)}</p>\n<ul>\n${items}\n</ul>\n` +
    enNav() +
    `</div>`

  return renderEnPage(template, {
    title: 'Topics | Stack Frame',
    description: EN_UI.topics.lead,
    url: `${EN_BASE}/topics/`,
    alternates: enAlternates(null),
    body,
  })
}

function renderEnTopicPage(template, topic) {
  const posts = EN_ARTICLES.filter((a) => a.topicSlug === topic.slug)
  const body =
    `<div class="ns-list">` +
    `<h1>${escapeHtml(topic.name)}</h1>` +
    `<p class="ns-lead">${escapeHtml(topic.tagline)}</p>\n` +
    `<p>${escapeHtml(topic.intro)}</p>\n` +
    `${enPostItems(posts)}\n` +
    enNav() +
    `</div>`

  return renderEnPage(template, {
    title: `${topic.name} | Stack Frame`,
    description: topic.tagline,
    url: `${EN_BASE}/topics/${topic.slug}/`,
    alternates:
      `    <link rel="alternate" hreflang="zh-CN" href="${SITE_ORIGIN}/topics/${topic.slug}/" />\n` +
      `    <link rel="alternate" hreflang="en" href="${EN_BASE}/topics/${topic.slug}/" />\n` +
      `    <link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/topics/${topic.slug}/" />\n`,
    body,
  })
}

function renderEnArticlePage(template, article) {
  const url = `${EN_HOME_URL}article/${article.slug}/`

  const body =
    `<div class="ns-article">` +
    `<h1>${escapeHtml(article.title)}</h1>` +
    `<div class="ns-meta">${escapeHtml(article.date)} · ${article.readingTime} min · Stack Frame</div>` +
    `<div class="markdown-body">${article.html}</div>` +
    `<nav class="ns-site-nav"><a href="${EN_HOME_URL}">All English posts</a>` +
    (article.zhSlug
      ? `<a href="${SITE_ORIGIN}/article/${escapeHtml(article.zhSlug)}/">中文版</a>`
      : '') +
    `<a href="mailto:${escapeHtml(EN_CONTACT.email)}">Email</a>` +
    `<a href="${escapeHtml(EN_CONTACT.github)}">GitHub</a></nav>` +
    `</div>`

  return renderEnPage(template, {
    title: `${article.title} | Stack Frame`,
    description: article.excerpt,
    url,
    alternates: enAlternates(article),
    body,
  })
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
function renderSitemap(articles, { bulkEdits = new Set(), collections } = {}) {
  const published = articles.filter((a) => a?.slug)
  const pages = collections || collectionPages(articles)
  // 聚合页的 lastmod 取该页最新一篇文章的时间——它就是这一页内容真正
  // 发生变化的时间点。
  const lastmodOfCollection = (c) =>
    isoOrEmpty(
      Math.max(0, ...c.posts.map((p) => timeOf(pickLastmod(p, bulkEdits)))),
    )
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
    // 英文版：只在真的有英文稿时列出，避免 sitemap 指向不存在的页面。
    ...(EN_ARTICLES.length
      ? [
          entry({
            loc: `${EN_BASE}/`,
            lastmod: isoOrEmpty(newestIso),
            changefreq: 'weekly',
            priority: '0.7',
          }),
          entry({
            loc: `${EN_BASE}/articles/`,
            lastmod: isoOrEmpty(newestIso),
            changefreq: 'weekly',
            priority: '0.6',
          }),
          entry({
            loc: `${EN_BASE}/topics/`,
            lastmod: isoOrEmpty(newestIso),
            changefreq: 'weekly',
            priority: '0.5',
          }),
          ...EN_TOPICS.map((t) =>
            entry({
              loc: `${EN_BASE}/topics/${t.slug}/`,
              lastmod: isoOrEmpty(newestIso),
              changefreq: 'weekly',
              priority: '0.5',
            }),
          ),
          ...EN_ARTICLES.map((a) =>
            entry({
              loc: `${EN_BASE}/article/${a.slug}/`,
              lastmod: isoOrEmpty(a.date),
              changefreq: 'monthly',
              priority: '0.6',
            }),
          ),
          ...EN_PAGES.map((p) =>
            entry({
              loc: `${SITE_ORIGIN}${p.path}`,
              lastmod: isoOrEmpty(p.updated),
              changefreq: 'monthly',
              priority: '0.3',
            }),
          ),
        ]
      : []),
    // 专题聚合页：站点最想被收录的入口，优先级高于单篇文章。
    ...TOPICS.map((topic) =>
      entry({
        loc: `${SITE_ORIGIN}${topicPath(topic.slug)}`,
        lastmod: isoOrEmpty(newestIso),
        changefreq: 'weekly',
        priority: '0.9',
      }),
    ),
    // 标签 / 分类落地页：文章页的横向内链终点。标签数量多、单页权重低，
    // 优先级压在 0.4；无专题的分类是真正的导航页，给 0.5。
    ...pages.tags.map((c) =>
      entry({
        loc: `${SITE_ORIGIN}${collectionPath(c)}`,
        lastmod: lastmodOfCollection(c),
        changefreq: 'weekly',
        priority: '0.4',
      }),
    ),
    ...pages.categories.map((c) =>
      entry({
        loc: `${SITE_ORIGIN}${collectionPath(c)}`,
        lastmod: lastmodOfCollection(c),
        changefreq: 'weekly',
        priority: '0.5',
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

/** 分类的 slug；后端早期数据可能把 category 写成纯字符串。 */
const CATEGORY_SLUG = (a) =>
  (a?.category && (typeof a.category === 'object' ? a.category.slug : '')) || ''

function tagNames(a) {
  return (Array.isArray(a?.tags) ? a.tags : [])
    .map((t) => (t && (t.name || t)) || '')
    .filter(Boolean)
}

/** 标签的 { name, slug } 列表；没有 slug 的条目无法生成落地页链接。 */
function tagEntries(a) {
  return (Array.isArray(a?.tags) ? a.tags : [])
    .map((t) => ({
      name: (t && (t.name || t)) || '',
      slug: (t && typeof t === 'object' ? t.slug : '') || '',
    }))
    .filter((t) => t.name && t.slug)
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

/**
 * Group articles into `{ heading, href, items }` sections.
 *
 * `entriesOf(article)` returns `[{ key, label }]`; `hrefOf({ key, count })`
 * decides whether the heading itself links to a landing page (tags below the
 * thin-content threshold stay plain text).
 */
function groupSections(articles, entriesOf, emptyLabel, hrefOf = () => '') {
  const groups = new Map()
  for (const a of sortedByDate(articles)) {
    const entries = entriesOf(a)
    const list = entries.length ? entries : [{ key: emptyLabel, label: emptyLabel }]
    for (const entry of list) {
      if (!groups.has(entry.key)) {
        groups.set(entry.key, { key: entry.key, label: entry.label, items: [] })
      }
      groups.get(entry.key).items.push(a)
    }
  }
  return [...groups.values()]
    .sort((a, b) => b.items.length - a.items.length || a.label.localeCompare(b.label, 'zh-CN'))
    .map((g) => ({
      heading: `${g.label}（${g.items.length} 篇）`,
      href: hrefOf({ key: g.key, label: g.label, count: g.items.length }),
      items: g.items.map(articleListItem),
    }))
}

function renderSections(sections) {
  const parts = []
  for (const section of sections) {
    if (!section) continue
    const level = section.level || 2
    const heading = escapeHtml(section.heading)
    parts.push(
      `<h${level}>` +
        (section.href ? `<a href="${escapeHtml(section.href)}">${heading}</a>` : heading) +
        `</h${level}>`,
    )
    if (section.subsections?.length) parts.push(renderSections(section.subsections))
    // 段落：合规页（隐私政策等）的正文主体，无 JS 读者也要读得到全文
    if (section.paragraphs?.length) {
      parts.push(section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n'))
    }
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
      // 标题本身就是分类落地页的入口：没有专题的分类走 /categories/<slug>/，
      // 有专题的直接落到 /topics/<slug>/（见 data/topics.js categoryPath）。
      return groupSections(
        articles,
        (a) => {
          const slug = CATEGORY_SLUG(a)
          return slug ? [{ key: slug, label: CATEGORY_NAME(a) }] : []
        },
        '未分类',
        ({ key }) => `${SITE_ORIGIN}${categoryPath(key)}`,
      )
    case 'topics':
      // 专题总览：直接列出五个聚合页，no-JS 读者也能顺着点进去。
      return [
        {
          heading: '五个专题',
          items: TOPICS.map((topic) => ({
            href: `${SITE_ORIGIN}${topicPath(topic.slug)}`,
            text: `${topic.name} — ${topic.tagline}`,
          })),
        },
      ]
    case 'tags':
      // 与运行时 /tags 页一致：隐藏含「测试」的标签；低于薄内容阈值的标签
      // 没有落地页，标题保持纯文本，避免爬虫点到 404。
      return groupSections(
        articles,
        (a) =>
          tagEntries(a)
            .filter((t) => !t.name.includes('测试'))
            .map((t) => ({ key: t.slug, label: t.name })),
        '未分类',
        ({ key, count }) =>
          count >= TAG_PAGE_MIN_ARTICLES ? `${SITE_ORIGIN}${tagPath(key)}` : '',
      )
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
    // 合规页：正文完全来自 src/data/sitePages.js（与页面组件同源），
    // 所以快照里有全文而不只是标题。
    case 'site-page': {
      const doc = getSitePage(page.sitePageKey)
      if (!doc) return []
      return doc.sections.map((section) => ({
        heading: section.heading,
        paragraphs: section.paragraphs || [],
        items: (section.items || []).map((item) => ({
          text: item.text,
          href: item.href,
        })),
      }))
    }
    // /search 的结果只在带查询参数时才存在，没有可内联的正文：它拿到真实的
    // 200、页级 <title>、自己的 meta 与同栏目互链，但不进 sitemap
    // （见 LIST_PAGES 的 noindex 标记）。
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
  html = upsertMeta(html, 'name', 'twitter:title', title)
  html = upsertMeta(html, 'name', 'twitter:description', page.description)
  html = upsertMeta(html, 'property', 'og:image:alt', `${page.title} — ${SITE_NAME}`)
  // noindex 必须写进静态 HTML：SPA 里路由 meta 的 noindex 要等 JS 起来才会
  // 生效，而不执行 JS 的抓取器读到的就是这份文件本身。
  if (page.noindex) {
    html = upsertMeta(html, 'name', 'robots', 'noindex, follow')
  }
  // 中文合规页与英文版互指，两个语言版本不会被判重复内容。
  if (page.sitePageKey) {
    const en = EN_PAGES.find((p) => p.key === page.sitePageKey)
    if (en) {
      html = html.replace(
        '</head>',
        literal(
          `    <link rel="alternate" hreflang="zh-CN" href="${url}" />\n` +
            `    <link rel="alternate" hreflang="en" href="${SITE_ORIGIN}${en.path}" />\n` +
            `    <link rel="alternate" hreflang="x-default" href="${url}" />\n  </head>`,
        ),
      )
    }
  }

  // Cross-links so crawlers (and no-JS readers) can reach the sibling pages
  // without going back through the app shell.
  const nav = LIST_PAGES.filter((p) => p.path !== page.path && !p.noindex)
    .map((p) => `<a href="${SITE_ORIGIN}${p.path}">${escapeHtml(p.title)}</a>`)
    .join('\n')

  const staticBody =
    `<div class="ns-list">` +
    `<h1>${escapeHtml(page.title)}</h1>` +
    `<p class="ns-lead">${escapeHtml(page.description)}</p>\n` +
    `${renderSections(sections)}\n` +
    `<p class="ns-nav"><a href="${SITE_ORIGIN}/">首页</a>\n${nav}</p>` +
    `</div>`

  html = html.replace(
    '<div id="app"></div>',
    literal(`${NOSCRIPT_STYLE}\n    <div id="app">${staticBody}</div>`),
  )
  return html
}

// ── 专题聚合页 ────────────────────────────────────────────────────────────
// /topics/<slug>/ 在运行时是 TopicDetail.vue（按 category 拉文章）。这里写一份
// 静态快照：专题简介 + 该专题下所有文章的链接。Google 把这种「一个主题页 +
// 有序内链」的结构当作集群（Cluster Page），比零散单篇更容易建立主题权威度。
function renderTopicPage(template, topic, articles) {
  const url = `${SITE_ORIGIN}${topicPath(topic.slug)}`
  const title = `${topic.name}专题：${topic.tagline} | ${SITE_NAME}`
  const description = `${topic.name}专题（${topic.en}）：${topic.tagline}。${topic.keywords}`.slice(0, 160)
  // 专题是学习路径，不是时间流：静态快照必须与运行时 TopicDetail.vue 一致，
  // 先按 data/topics.js 的推荐顺序，未列入顺序的文章再按日期倒序补在后面。
  const inTopic = articles.filter(
    (a) => a?.slug && (a.category?.slug || a.category) === topic.slug,
  )
  const order = seriesOrder(topic.slug)
  const bySlug = new Map(inTopic.map((a) => [a.slug, a]))
  const ordered = order.map((slug) => bySlug.get(slug)).filter(Boolean)
  const rest = inTopic
    .filter((a) => !order.includes(a.slug))
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
  const posts = [...ordered, ...rest]

  let html = template
  html = html.replace(/<title>.*?<\/title>/, literal(`<title>${escapeHtml(title)}</title>`))
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    literal(`<link rel="canonical" href="${url}" />`),
  )
  html = upsertMeta(html, 'name', 'description', description)
  html = upsertMeta(html, 'property', 'og:title', title)
  html = upsertMeta(html, 'property', 'og:description', description)
  html = upsertMeta(html, 'property', 'og:url', url)
  html = upsertMeta(html, 'property', 'og:type', 'website')
  html = upsertMeta(html, 'name', 'twitter:title', title)
  html = upsertMeta(html, 'name', 'twitter:description', description)
  html = upsertMeta(html, 'property', 'og:image:alt', `${topic.name}专题 — ${SITE_NAME}`)

  // 专题页是「主题集群」入口：CollectionPage 说明这是什么页面，ItemList
  // 把该专题下的文章按推荐顺序交给搜索引擎。
  const collectionLd = {
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: `${topic.name}专题`,
    description,
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    inLanguage: 'zh-CN',
    mainEntity: { '@id': `${url}#itemlist` },
  }
  const itemListLd = {
    '@type': 'ItemList',
    '@id': `${url}#itemlist`,
    name: `${topic.name}专题文章`,
    numberOfItems: posts.length,
    itemListElement: posts.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_ORIGIN}/article/${a.slug}/`,
      name: a.title,
    })),
  }
  const breadcrumbLd = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE_ORIGIN}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: '专题',
        item: `${SITE_ORIGIN}/topics/`,
      },
      { '@type': 'ListItem', position: 3, name: topic.name, item: url },
    ],
  }
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [collectionLd, itemListLd, breadcrumbLd],
  }
  html = html.replace(
    '</head>',
    literal(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`),
  )

  const siblings = TOPICS.filter((t) => t.slug !== topic.slug)
    .map((t) => `<a href="${SITE_ORIGIN}${topicPath(t.slug)}">${escapeHtml(t.name)}</a>`)
    .join('\n')

  const intro = topic.intro.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n')
  const list = posts.length
    ? renderSections([
        {
          heading: `共 ${posts.length} 篇`,
          items: posts.map(articleListItem),
        },
      ])
    : '<p>这个专题还在整理中。</p>'

  const staticBody =
    `<div class="ns-list">` +
    `<h1>${escapeHtml(topic.name)}专题</h1>` +
    `<p class="ns-lead">${escapeHtml(topic.en)} · ${escapeHtml(topic.tagline)}</p>\n` +
    `${intro}\n${list}\n` +
    `<p class="ns-nav"><a href="${SITE_ORIGIN}/topics/">全部专题</a>\n${siblings}\n` +
    `<a href="${SITE_ORIGIN}/">首页</a></p>` +
    `</div>`

  html = html.replace(
    '<div id="app"></div>',
    literal(`${NOSCRIPT_STYLE}\n    <div id="app">${staticBody}</div>`),
  )
  return html
}

// ── 标签 / 分类落地页 ─────────────────────────────────────────────────────
// /tags/<slug>/ 与 /categories/<slug>/：把同一标签/分类下的文章聚成一个
// 可被搜索引擎索引的入口，同时给文章页制造一条横向内链。
//
// 分类页只给「没有对应编辑专题」的分类建页——有专题的分类直接落到
// /topics/<slug>/（见 data/topics.js categoryPath），避免重复内容。
// 标签页只给达到 TAG_PAGE_MIN_ARTICLES 的标签建页，其余保持在 /tags/ 总览。

function collectionPath({ kind, slug }) {
  return kind === 'tag' ? tagPath(slug) : categoryPath(slug)
}

function collectionPages(articles) {
  const tagMap = new Map()
  const categoryMap = new Map()
  for (const a of articles) {
    if (!a?.slug) continue
    const categorySlug = CATEGORY_SLUG(a)
    if (categorySlug && !findTopic(categorySlug)) {
      if (!categoryMap.has(categorySlug)) {
        categoryMap.set(categorySlug, {
          kind: 'category',
          slug: categorySlug,
          name: CATEGORY_NAME(a),
          posts: [],
        })
      }
      categoryMap.get(categorySlug).posts.push(a)
    }
    for (const tag of tagEntries(a)) {
      if (tag.name.includes('测试')) continue
      if (!tagMap.has(tag.slug)) {
        tagMap.set(tag.slug, {
          kind: 'tag',
          slug: tag.slug,
          name: tag.name,
          posts: [],
        })
      }
      tagMap.get(tag.slug).posts.push(a)
    }
  }
  const byCount = (a, b) =>
    b.posts.length - a.posts.length || a.name.localeCompare(b.name, 'zh-CN')
  return {
    tags: [...tagMap.values()]
      .filter((t) => t.posts.length >= TAG_PAGE_MIN_ARTICLES)
      .sort(byCount),
    categories: [...categoryMap.values()].sort(byCount),
  }
}

function renderCollectionPage(template, collection, siblings = []) {
  const { kind, slug, name } = collection
  const kindName = kind === 'tag' ? '标签' : '分类'
  const indexPath = kind === 'tag' ? '/tags/' : '/categories/'
  const url = `${SITE_ORIGIN}${collectionPath(collection)}`
  const posts = sortedByDate(collection.posts)
  const title = `${name} ${kindName} | ${SITE_NAME}`
  const headline = posts.slice(0, 3).map((a) => a.title)
  // 与运行时 CollectionDetail.vue 的 description 同源：标签/分类名 + 篇数
  // + 前三篇标题，让 SERP 上能看出这一页到底有什么。
  const rawDescription =
    `${SITE_NAME}「${name}」${kindName}下的 ${posts.length} 篇文章` +
    (headline.length ? `：${headline.join('、')}。` : '。')
  const description = metaDescription(rawDescription, `${SITE_NAME}${kindName}：${name}`, 160)

  let html = template
  html = html.replace(/<title>.*?<\/title>/, literal(`<title>${escapeHtml(title)}</title>`))
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    literal(`<link rel="canonical" href="${url}" />`),
  )
  html = upsertMeta(html, 'name', 'description', description)
  html = upsertMeta(html, 'property', 'og:title', title)
  html = upsertMeta(html, 'property', 'og:description', description)
  html = upsertMeta(html, 'property', 'og:url', url)
  html = upsertMeta(html, 'property', 'og:type', 'website')
  html = upsertMeta(html, 'name', 'twitter:title', title)
  html = upsertMeta(html, 'name', 'twitter:description', description)
  html = upsertMeta(html, 'property', 'og:image:alt', `${name} ${kindName} — ${SITE_NAME}`)

  const collectionLd = {
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: `${name} ${kindName}`,
    description,
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    inLanguage: 'zh-CN',
    mainEntity: { '@id': `${url}#itemlist` },
  }
  const itemListLd = {
    '@type': 'ItemList',
    '@id': `${url}#itemlist`,
    name: `${name} ${kindName}下的文章`,
    numberOfItems: posts.length,
    itemListElement: posts.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_ORIGIN}/article/${a.slug}/`,
      name: a.title,
    })),
  }
  const breadcrumbLd = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE_ORIGIN}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: kindName,
        item: `${SITE_ORIGIN}${indexPath}`,
      },
      { '@type': 'ListItem', position: 3, name, item: url },
    ],
  }
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [collectionLd, itemListLd, breadcrumbLd],
  }
  html = html.replace(
    '</head>',
    literal(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`),
  )

  const siblingLinks = siblings
    .filter((c) => !(c.kind === kind && c.slug === slug))
    .map(
      (c) =>
        `<a href="${SITE_ORIGIN}${collectionPath(c)}">${escapeHtml(c.name)}</a>`,
    )
    .join('\n')

  const list = posts.length
    ? renderSections([
        {
          heading: `共 ${posts.length} 篇`,
          items: posts.map(articleListItem),
        },
      ])
    : '<p>这个' + kindName + '下还没有文章。</p>'

  const staticBody =
    `<div class="ns-list">` +
    `<h1>${escapeHtml(name)}</h1>` +
    `<p class="ns-lead">${escapeHtml(kindName)} · ${escapeHtml(description)}</p>\n` +
    `${list}\n` +
    `<p class="ns-nav"><a href="${SITE_ORIGIN}/">首页</a>\n` +
    `<a href="${SITE_ORIGIN}${indexPath}">全部${kindName}</a>\n` +
    `<a href="${SITE_ORIGIN}/articles/">全部文章</a>\n` +
    `${siblingLinks}</p>` +
    `</div>`

  html = html.replace(
    '<div id="app"></div>',
    literal(`${NOSCRIPT_STYLE}\n    <div id="app">${staticBody}</div>`),
  )
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
    articles = (await fetchAllArticles()).map((a) =>
      a && a.cover_image ? { ...a, cover_image: normalizeCover(a.cover_image) } : a,
    )
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

  // 系列目录的静态版：按主题的推荐顺序取同簇文章，过滤掉篇幅过短的条目。
  // 运行时 ArticleDetail 用的是同一份 seriesOrder + SERIES_MIN_MINUTES。
  const articlesBySlug = new Map(articles.map((a) => [a.slug, a]))
  function seriesFor(article) {
    const categorySlug = article.category?.slug
    const topic = TOPICS.find((t) => t.slug === categorySlug)
    const order = seriesOrder(categorySlug)
    if (!topic || !order.length) return {}
    return {
      seriesTopic: topic,
      seriesItems: order
        .map((slug) => articlesBySlug.get(slug))
        .filter(Boolean)
        .filter(
          (a) =>
            a.slug === article.slug || (a.reading_time || 0) >= SERIES_MIN_MINUTES,
        ),
    }
  }

  // 标签 / 分类落地页的清单。文章页只给这些标签建链接，低篇数标签保持
  // 纯文本，爬虫不会点到不存在的页面。
  const collections = collectionPages(articles)
  const tagPageSlugs = new Set(collections.tags.map((t) => t.slug))

  // 上一篇/下一篇按发布时间推导（静态快照只给爬虫看，JS 用户仍用接口
  // 返回的 prev_article / next_article）。
  const byDate = sortedByDate(articles.filter((a) => a?.slug))
  const dateIndex = new Map(byDate.map((a, i) => [a.slug, i]))
  function neighborsFor(article) {
    const i = dateIndex.get(article.slug)
    if (i === undefined) return {}
    return { prev: byDate[i + 1], next: byDate[i - 1] }
  }

  // 相关文章：同分类权重 2，每个共同标签权重 1，取分数最高的 5 篇。
  function relatedFor(article) {
    const tagSlugs = new Set(tagEntries(article).map((t) => t.slug))
    const categorySlug = article.category?.slug
    return articles
      .filter((a) => a?.slug && a.slug !== article.slug)
      .map((a) => ({
        article: a,
        score:
          (categorySlug && a.category?.slug === categorySlug ? 2 : 0) +
          tagEntries(a).filter((t) => tagSlugs.has(t.slug)).length,
      }))
      .filter((x) => x.score > 0)
      .sort(
        (x, y) =>
          y.score - x.score || timeOf(y.article.created_at) - timeOf(x.article.created_at),
      )
      .slice(0, 5)
      .map((x) => x.article)
  }

  let written = 0
  for (const article of articles) {
    if (!article?.slug) continue
    const dir = join(DIST, 'article', article.slug)
    mkdirSync(dir, { recursive: true })
    writeFileSync(
      join(dir, 'index.html'),
      renderArticlePage(template, article, {
        lastmod: lastmods.get(article.slug),
        ...seriesFor(article),
        neighbors: neighborsFor(article),
        related: relatedFor(article),
        tagPageSlugs,
      }),
      'utf8',
    )
    written += 1
  }
  console.log(`[prerender] wrote ${written} static article page(s) into dist/article/.`)

  // 英文版：/en 首页、文章列表、专题列表与每个专题页、每篇英文稿。
  // 没有英文稿时整块跳过，不留空目录页。
  if (EN_ARTICLES.length) {
    let enWritten = 0
    try {
      const writeEn = (segments, html) => {
        const dir = join(DIST, 'en', ...segments)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), html, 'utf8')
        enWritten += 1
      }
      writeEn([], renderEnIndexPage(template))
      writeEn(['articles'], renderEnArticlesPage(template))
      writeEn(['topics'], renderEnTopicsPage(template))
      for (const topic of EN_TOPICS) {
        writeEn(['topics', topic.slug], renderEnTopicPage(template, topic))
      }
      for (const article of EN_ARTICLES) {
        writeEn(['article', article.slug], renderEnArticlePage(template, article))
      }
      for (const page of EN_PAGES) {
        writeEn([page.key], renderEnContentPage(template, page))
      }
      console.log(`[prerender] wrote ${enWritten} English page(s).`)
    } catch (e) {
      console.warn(`[prerender] could not write English pages: ${e?.message || e}`)
    }
  }

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

  // 专题聚合页（/topics/<slug>/）：主题集群入口，同时进 sitemap。
  let topicWritten = 0
  for (const topic of TOPICS) {
    try {
      const dir = join(DIST, 'topics', topic.slug)
      mkdirSync(dir, { recursive: true })
      writeFileSync(
        join(dir, 'index.html'),
        renderTopicPage(template, topic, articles),
        'utf8',
      )
      topicWritten += 1
    } catch (e) {
      console.warn(`[prerender] could not write /topics/${topic.slug}/: ${e?.message || e}`)
    }
  }
  console.log(`[prerender] wrote ${topicWritten} static topic page(s).`)

  // 标签 / 分类落地页。分类只包含「没有对应专题」的那几个，标签只包含
  // 达到薄内容阈值的，和 sitemap、站内链接用的是同一份 collections。
  let collectionWritten = 0
  for (const collection of [...collections.tags, ...collections.categories]) {
    try {
      const dir = join(
        DIST,
        collectionPath(collection).replace(/^\/|\/$/g, ''),
      )
      mkdirSync(dir, { recursive: true })
      const siblings =
        collection.kind === 'tag'
          ? collections.tags.slice(0, 12)
          : collections.categories
      writeFileSync(
        join(dir, 'index.html'),
        renderCollectionPage(template, collection, siblings),
        'utf8',
      )
      collectionWritten += 1
    } catch (e) {
      console.warn(
        `[prerender] could not write ${collectionPath(collection)}: ${e?.message || e}`,
      )
    }
  }
  console.log(
    `[prerender] wrote ${collectionWritten} static tag/category page(s) ` +
      `(${collections.tags.length} tags, ${collections.categories.length} categories).`,
  )

  // sitemap.xml — same origin as the site, listing only what was just written.
  try {
    writeFileSync(
      join(DIST, 'sitemap.xml'),
      renderSitemap(articles, { bulkEdits, collections }),
      'utf8',
    )
    console.log(
      `[prerender] wrote sitemap.xml (` +
        `${
          lastmods.size +
          LIST_PAGES.filter((p) => !p.noindex).length +
          TOPICS.length +
          collections.tags.length +
          collections.categories.length +
          (EN_ARTICLES.length ? EN_ARTICLES.length + 6 + EN_TOPICS.length : 0) +
          1
        } URLs).`,
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
  HOME_ARTICLE_COUNT,
  escapeHtml,
  sanitizeHtml,
  wrapTables,
  upsertMeta,
  renderArticlePage,
  renderHomePage,
  renderEnPage,
  renderEnIndexPage,
  renderEnArticlePage,
  enAlternates,
  toSnapshotList,
  findBulkEdits,
  pickLastmod,
  renderSitemap,
  renderRssFeed,
  renderListPage,
  sectionsForPage,
  renderTopicPage,
  collectionPath,
  collectionPages,
  renderCollectionPage,
  tagEntries,
}

if (!process.env.VITEST_WORKER_ID) {
  main().catch((e) => {
    // Never fail the build because of pre-rendering.
    console.warn('[prerender] unexpected error, skipping:', e?.message || e)
  })
}