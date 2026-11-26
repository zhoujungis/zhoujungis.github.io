/**
 * Render the English DevBox edition (Markdown) into the HTML body stored in
 * frontend/src/data/en/articles.js, and insert/replace its entry.
 *
 * Idempotent: if the slug already exists the script replaces that entry.
 * Reading time is computed the way the site does it (Chinese chars + English
 * words / 250, code stripped) so the number readers see matches.
 */
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const DATA = 'frontend/src/data/en/articles.js'
const SRC_MD = 'article/devbox-registry-driven-toolbox-en.md'
const RENDERED = 'tools/en_devbox.html'

const entry = {
  slug: 'devbox-registry-driven-toolbox',
  zhSlug: 'devbox-registry-driven-toolbox',
  topicSlug: 'projects',
  title: 'DevBox: making 42 browser tools one maintainable product instead of 42 pages',
  excerpt:
    'A Vue 3 + TypeScript + Vite toolbox: 42 tools, 8 categories, 34 processors, 31 unit-test files, all local, no accounts, no backend database. The hard part is not the 42 algorithms; it is four engineering boundaries. Adding a tool means filling in one ToolDefinition, from which routes, search, categories, favorites, recents, and the sitemap all derive. Data flow lives in the type system (local / external / mixed), so the page cannot forget to warn you. Every input has a ceiling: nested quantifiers are rejected, source analysis caps at one million characters, CIDR rejects prefix 33. And local by default — only three tools make external requests, each naming its destination. Includes the registry, lazy loading, the ReDoS guard, RFC 6238 vector tests, the AES payload layout, the heuristic scorer, CodeMirror reconfiguration, and the CSP, plus honest limits: HTTP Ping is not ICMP, AI detection cannot prove authorship, and connect-src had to open.',
  date: '2026-11-26',
  file: RENDERED,
}

// Render Markdown -> the exact HTML shape the EN module stores.
execFileSync(
  'backend/venv/Scripts/python.exe',
  ['tools/render_article_html.py', SRC_MD, RENDERED],
  { stdio: 'inherit' }
)

function readingTime(html) {
  const text = html
    .replace(/<pre[\s\S]*?<\/pre>/g, ' ')
    .replace(/<code[\s\S]*?<\/code>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
  const chinese = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length
  const english = (text.match(/[a-zA-Z]+/g) || []).length
  return Math.max(1, Math.ceil((chinese + english) / 250))
}

function block(entry) {
  const rawHtml = fs.readFileSync(entry.file, 'utf8').trim()
  const minutes = readingTime(rawHtml)
  console.log(`${entry.slug}: ${rawHtml.length} chars, ~${minutes} min`)
  const html = rawHtml.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
  return `  {
    slug: '${entry.slug}',
    zhSlug: '${entry.zhSlug}',
    topicSlug: '${entry.topicSlug}',
    title: ${JSON.stringify(entry.title)},
    excerpt:
      ${JSON.stringify(entry.excerpt)},
    date: '${entry.date}',
    readingTime: ${minutes},
    html: \`${html}\`,
  },
`
}

let source = fs.readFileSync(DATA, 'utf8')

const marker = `slug: '${entry.slug}',`
const existing = source.indexOf(marker)
if (existing !== -1) {
  const start = source.lastIndexOf('  {', existing)
  const end = source.indexOf('\n  },', existing) + '\n  },\n'.length
  source = source.slice(0, start) + block(entry) + source.slice(end)
  console.log('  replaced existing entry')
} else {
  const anchor = source.match(/\r?\n\]\r?\n\r?\n\/\/ 列表页/)
  if (!anchor) throw new Error('could not find array terminator')
  const at = anchor.index
  source = source.slice(0, at) + '\n' + block(entry).replace(/\n/g, '\r\n') + source.slice(at)
  console.log('  appended')
}

fs.writeFileSync(DATA, source)
console.log('wrote', DATA)
