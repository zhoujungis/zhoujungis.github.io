/**
 * Insert the Garden Defense (PvZ) English edition into
 * frontend/src/data/en/articles.js.
 *
 * Idempotent: if the slug already exists the script replaces that entry instead
 * of appending a duplicate. Reading time is computed the way the site does it
 * (Chinese chars + English words, /250, ceil) from the HTML body after stripping
 * tags and code, so the number in the data file is the number readers see.
 */
import fs from 'node:fs'

const DATA = 'frontend/src/data/en/articles.js'

const entry = {
  slug: 'pvz-vanilla-js-canvas-engine',
  zhSlug: 'pvz-vanilla-js-canvas-engine',
  topicSlug: 'projects',
  title: 'Garden Defense: a Plants-vs-Zombies engine in 3,700 lines of vanilla JS',
  excerpt:
    'One 3,731-line game.js, an IIFE, and zero dependencies: 146 functions, 60 levels, 24 plants, 16 zombies, 4 modes, 16 Playwright suites. The hard parts are frame-level: cap dt so a dropped frame cannot clip zombies through a wall-nut; fall back from GIF to PNG to hand-drawn code; carry water, fog, and a sloped roof on one grid; schedule waves that escalate yet rotate every type in by the finale; and migrate old saves into new chapters.',
  date: '2026-11-25',
  file: 'tools/en_pvz.html',
}

if (!entry || !entry.slug) throw new Error('no entry')

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
