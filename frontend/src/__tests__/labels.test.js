import { describe, it, expect } from 'vitest'
import { catLabel, catSlug, catCount, tagLabel, tagSlug, authorName } from '../utils/labels'

describe('catLabel', () => {
  it('returns empty string for falsy values', () => {
    expect(catLabel(null)).toBe('')
    expect(catLabel(undefined)).toBe('')
    expect(catLabel('')).toBe('')
  })

  it('returns plain string directly', () => {
    expect(catLabel('JavaScript')).toBe('JavaScript')
  })

  it('extracts name from object', () => {
    expect(catLabel({ name: 'Python', slug: 'python' })).toBe('Python')
  })

  it('returns empty string for object without name', () => {
    expect(catLabel({ slug: 'unknown' })).toBe('')
  })
})

describe('catSlug', () => {
  it('returns slug from object', () => {
    expect(catSlug({ name: 'Python', slug: 'python' })).toBe('python')
  })

  it('returns empty string when slug is missing', () => {
    expect(catSlug({ name: 'Python' })).toBe('')
  })
})

describe('catCount', () => {
  it('returns article_count from object', () => {
    expect(catCount({ name: 'Python', article_count: 5 })).toBe(5)
  })

  it('falls back to count property', () => {
    expect(catCount({ name: 'Python', count: 3 })).toBe(3)
  })

  it('returns 0 for plain string', () => {
    expect(catCount('Python')).toBe(0)
  })
})

describe('tagLabel', () => {
  it('extracts name from object', () => {
    expect(tagLabel({ name: 'vue', id: 1 })).toBe('vue')
  })

  it('returns plain string', () => {
    expect(tagLabel('react')).toBe('react')
  })
})

describe('tagSlug', () => {
  it('extracts slug from object', () => {
    expect(tagSlug({ name: 'vue', slug: 'vue-js' })).toBe('vue-js')
  })
})

describe('authorName', () => {
  it('returns "匿名" for missing author', () => {
    expect(authorName(null)).toBe('匿名')
    expect(authorName(undefined)).toBe('匿名')
  })

  it('returns name from object', () => {
    expect(authorName({ name: 'Zhou Jun' })).toBe('Zhou Jun')
  })

  it('returns username as fallback', () => {
    expect(authorName({ username: 'zhoujun' })).toBe('zhoujun')
  })

  it('returns plain string directly', () => {
    expect(authorName('Zhou Jun')).toBe('Zhou Jun')
  })
})
