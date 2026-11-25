/**
 * Insert the ECHO SPACE English edition into frontend/src/data/en/articles.js.
 *
 * Idempotent: if the slug already exists the script replaces that entry instead
 * of appending a duplicate. Reading time is computed the way the site does it
 * (Chinese chars + English words, /250, ceil) from the HTML body after stripping
 * tags and code, so the number in the data file is the number readers see.
 */
import fs from 'node:fs'

const DATA = 'frontend/src/data/en/articles.js'

const entry = {
  slug: 'echo-space-immersive-audio-player',
  zhSlug: 'echo-space-immersive-audio-player',
  topicSlug: 'projects',
  title: 'ECHO SPACE: an immersive audio player at the edge that does its own accounting',
  excerpt:
    'A Cloudflare Pages + D1 audio player with a dependency-free frontend. The hard part is four boundaries: authentication squeezed into 10,000 PBKDF2 iterations, listening time measured from currentTime deltas instead of a timer, one playback collapsed into one row with sessionId + UPSERT + a partial unique index, and a pure-function free-mode scheduler whose segments sum to exactly the chosen duration. Seven API routes, four D1 migrations, and an honest list of what an in-isolate rate limiter cannot do.',
  date: '2026-11-25',
  file: 'tools/en_echo_space.html',
}

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
