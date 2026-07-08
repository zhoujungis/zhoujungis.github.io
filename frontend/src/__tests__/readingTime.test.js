import { describe, it, expect } from 'vitest'
import { getReadingTime, stripMarkdown } from '../utils/readingTime'

describe('getReadingTime', () => {
  it('returns 1 for empty input', () => {
    expect(getReadingTime('')).toBe(1)
    expect(getReadingTime(null)).toBe(1)
    expect(getReadingTime(undefined)).toBe(1)
  })

  it('estimates ~1 min for short text', () => {
    const text = '这是一段中文测试文本，大约二十个汉字左右的内容要判断一下阅读时间。'
    expect(getReadingTime(text)).toBe(1)
  })

  it('returns higher value for longer text', () => {
    const longText = 'hello world '.repeat(500)
    expect(getReadingTime(longText)).toBeGreaterThan(1)
  })

  it('handles mixed Chinese and English', () => {
    const mixed = 'Vue 是一个用于构建用户界面的 JavaScript 框架。'.repeat(50)
    const time = getReadingTime(mixed)
    expect(time).toBeGreaterThanOrEqual(1)
  })
})

describe('stripMarkdown', () => {
  it('returns empty string for falsy input', () => {
    expect(stripMarkdown('')).toBe('')
    expect(stripMarkdown(null)).toBe('')
  })

  it('removes code blocks', () => {
    const md = 'hello\n```js\nconst x = 1\n```\nworld'
    const result = stripMarkdown(md)
    expect(result).not.toContain('const')
    expect(result).toContain('hello')
    expect(result).toContain('world')
  })

  it('removes image syntax', () => {
    const md = 'text ![alt](url) more'
    const result = stripMarkdown(md)
    expect(result).not.toContain('![alt]')
    expect(result).not.toContain('url')
  })

  it('extracts link text', () => {
    const md = 'click [here](https://example.com) for more'
    const result = stripMarkdown(md)
    expect(result).toContain('here')
    expect(result).not.toContain('https://example.com')
  })
})
