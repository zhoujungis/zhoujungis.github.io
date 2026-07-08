/**
 * Shared helpers for extracting labels/slugs from API objects.
 * Handles both plain strings (legacy) and nested objects.
 */

export function catLabel(cat) {
  if (!cat) return ''
  return typeof cat === 'object' ? cat.name || '' : cat
}

export function catSlug(cat) {
  if (!cat) return ''
  return typeof cat === 'object' ? cat.slug || '' : ''
}

export function catCount(cat) {
  if (typeof cat === 'object' && cat.article_count !== undefined) return cat.article_count
  if (typeof cat === 'object' && cat.count !== undefined) return cat.count
  return 0
}

export function tagLabel(tag) {
  if (!tag) return ''
  return typeof tag === 'object' ? tag.name || '' : tag
}

export function tagSlug(tag) {
  if (!tag) return ''
  return typeof tag === 'object' ? tag.slug || '' : ''
}

export function authorName(author) {
  if (!author) return '匿名'
  return typeof author === 'object' ? author.name || author.username || '' : author
}
