/**
 * Shared helpers for extracting labels/slugs from API objects.
 * Handles both plain strings (legacy) and nested objects.
 */
import { SITE_AUTHOR } from './siteConfig'

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
  // The backend's article serializers have no `author` field, so every post
  // falls through to this value. It used to be the literal '匿名'.
  if (!author) return SITE_AUTHOR
  return typeof author === 'object'
    ? author.name || author.username || SITE_AUTHOR
    : author
}
