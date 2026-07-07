/**
 * Estimate reading time based on content length.
 * Chinese text: ~300 chars/min | English: ~200 words/min
 */
export function getReadingTime(text) {
  if (!text) return 1
  // Count Chinese characters (each is ~1 word)
  const chineseChars = (text.match(/[一-鿿㐀-䶿]/g) || []).length
  // Count English words
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length
  // Chinese: ~300 chars/min, English: ~200 words/min, mixed average ~250 units/min
  const total = chineseChars + englishWords
  const minutes = Math.max(1, Math.ceil(total / 250))
  return minutes
}

/**
 * Strip markdown syntax for plain-text reading time estimation.
 */
export function stripMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/```[\s\S]*?```/g, '')  // code blocks
    .replace(/`[^`]*`/g, '')          // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')   // images
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1') // links → text
    .replace(/[#*>`~\-+|_:]/g, ' ')    // markdown syntax → space
    .replace(/\s+/g, ' ')
    .trim()
}
