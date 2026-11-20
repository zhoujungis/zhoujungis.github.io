/**
 * Insert the two English editions into frontend/src/data/en/articles.js.
 *
 * Idempotent: if the slug already exists the script replaces that entry instead
 * of appending a duplicate. Reading time is computed the way the site does it
 * (Chinese chars + English words, /250, ceil) from the HTML body after stripping
 * tags, so the number in the data file is the number readers see.
 */
import fs from 'node:fs'

const DATA = 'frontend/src/data/en/articles.js'

const entries = [
  {
    slug: 'nanoqa-versioned-quality-loop',
    zhSlug: 'nanoqa-versioned-quality-loop',
    topicSlug: 'projects',
    title: 'NanoQA: four hard boundaries in a test management system',
    excerpt:
      'Twenty-six models, 67 routes, 232 backend tests. The hard part is not moving Excel into a browser: test cases must be versioned, execution results must bind a version snapshot, concurrent edits must be detected, and audit must commit with the business write. The costs are just as explicit — no permission cache, O(n²) duplicate detection at 55.5 seconds for 800 cases, and a mock-only AI layer.',
    date: '2026-11-20',
    file: 'tools/en_nanoqa.html',
  },
  {
    slug: 'routewise-ai-geo-constrained-itinerary',
    zhSlug: 'routewise-ai-geo-constrained-itinerary',
    topicSlug: 'projects',
    title: 'Routewise AI: making a model emit an itinerary that survives a map',
    excerpt:
      'Getting gpt-5.6-luna to produce an itinerary you can plot on a real map is not a prompt problem. It is four stacked constraints: a fixed city schedule, four-day chunks requested in parallel, a forced JSON shape validated against four geographic rules, and one retry that feeds the exact rejection back into the prompt. 1,101 lines of TypeScript, no server. The validator only understands distance, not meaning, and 22–25 km is a blind spot.',
    date: '2026-11-20',
    file: 'tools/en_routewise.html',
  },
]

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
  // The html field is a template literal, so backticks and ${ must be escaped.
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

for (const entry of entries) {
  const marker = `slug: '${entry.slug}',`
  const existing = source.indexOf(marker)
  if (existing !== -1) {
    // Replace the whole object: back up to the "  {\n" that opens it, and
    // forward to the matching "  },\n".
    const start = source.lastIndexOf('  {', existing)
    const end = source.indexOf('\n  },', existing) + '\n  },\n'.length
    source = source.slice(0, start) + block(entry) + source.slice(end)
    console.log(`  replaced existing entry`)
    continue
  }

  const anchor = source.match(/\r?\n\]\r?\n\r?\n\/\/ 列表页/)
  if (!anchor) throw new Error('could not find array terminator')
  const at = anchor.index
  source = source.slice(0, at) + '\n' + block(entry).replace(/\n/g, '\r\n') + source.slice(at)
  console.log(`  appended`)
}

fs.writeFileSync(DATA, source)
console.log('wrote', DATA)
