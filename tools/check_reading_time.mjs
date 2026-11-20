/**
 * Reproduce the site's own reading-time logic (frontend/src/utils/readingTime.js)
 * against the two new article sources, so the published number is the same one
 * readers see. Code blocks are stripped, so this is stricter than a raw count.
 */
import fs from 'node:fs'

function stripMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
    .replace(/[#*>`~\-+|_:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getReadingTime(text) {
  if (!text) return 1
  const chineseChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length
  const total = chineseChars + englishWords
  return Math.max(1, Math.ceil(total / 250))
}

function stripFrontmatter(md) {
  return md.replace(/^---\n[\s\S]*?\n---\n/, '').trim()
}

for (const file of process.argv.slice(2)) {
  const raw = stripFrontmatter(fs.readFileSync(file, 'utf8'))
  const prose = stripMarkdown(raw)
  const zh = (prose.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length
  const en = (prose.match(/[a-zA-Z]+/g) || []).length
  console.log(`${file}`)
  console.log(`  raw chars      ${raw.length}`)
  console.log(`  prose units    ${zh + en}  (zh=${zh} en=${en})`)
  console.log(`  reading time   ${getReadingTime(prose)} min`)
}
