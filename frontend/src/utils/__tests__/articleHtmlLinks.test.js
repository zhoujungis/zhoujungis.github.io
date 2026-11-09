import { describe, it, expect } from 'vitest'
import { canonicalizeInternalLinks } from '../articleHtml.js'

describe('canonicalizeInternalLinks', () => {
  it('补上页面路由的尾斜杠', () => {
    expect(canonicalizeInternalLinks('<a href="/article/x">a</a>')).toBe(
      '<a href="/article/x/">a</a>',
    )
    expect(canonicalizeInternalLinks('<a href="/about">a</a>')).toBe('<a href="/about/">a</a>')
  })

  it('查询串和锚点保留在斜杠之后', () => {
    expect(canonicalizeInternalLinks('<a href="/articles?category=algorithm">a</a>')).toBe(
      '<a href="/articles/?category=algorithm">a</a>',
    )
    expect(canonicalizeInternalLinks('<a href="/article/x#sec-2">a</a>')).toBe(
      '<a href="/article/x/#sec-2">a</a>',
    )
  })

  it('已经规范的链接原样返回（幂等）', () => {
    const html = '<a href="/article/x/">a</a><a href="/tags/redis/">b</a>'
    expect(canonicalizeInternalLinks(html)).toBe(html)
  })

  it('不碰外链、静态资源与根路径', () => {
    const html =
      '<a href="https://example.com/about">a</a><img src="/photos/x.png"><a href="/">home</a><a href="/rss.xml">rss</a>'
    expect(canonicalizeInternalLinks(html)).toBe(html)
  })

  it('不把文件当路由补斜杠', () => {
    expect(canonicalizeInternalLinks('<a href="/docs/guide.pdf">d</a>')).toBe(
      '<a href="/docs/guide.pdf">d</a>',
    )
  })

  it('空输入安全', () => {
    expect(canonicalizeInternalLinks(null)).toBe('')
    expect(canonicalizeInternalLinks(undefined)).toBe('')
    expect(canonicalizeInternalLinks('')).toBe('')
  })
})
