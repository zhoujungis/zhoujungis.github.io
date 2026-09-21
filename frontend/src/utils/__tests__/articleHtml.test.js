import { describe, it, expect } from 'vitest'
import { stripLeadingDuplicateTitle } from '../articleHtml.js'

const TITLE = '加到 8 台反而更慢：排队论与容量规划'

describe('stripLeadingDuplicateTitle', () => {
  it('删掉与标题重复的首个 h1', () => {
    const html = `<h1>${TITLE}</h1>\n<h2>1. 前言</h2>\n<p>正文</p>`
    expect(stripLeadingDuplicateTitle(html, TITLE)).toBe('<h2>1. 前言</h2>\n<p>正文</p>')
  })

  it('标题不同就保留（文章自带的小标题不能被误删）', () => {
    const html = '<h1>一个更具体的副标题</h1>\n<p>正文</p>'
    expect(stripLeadingDuplicateTitle(html, TITLE)).toBe(html)
  })

  it('首个 h1 之外的其他 h1 一律保留', () => {
    const html = `<p>前言</p>\n<h1>${TITLE}</h1>`
    expect(stripLeadingDuplicateTitle(html, TITLE)).toBe(html)
  })

  it('没有 h1 时原样返回', () => {
    const html = '<h2>标题</h2><p>正文</p>'
    expect(stripLeadingDuplicateTitle(html, TITLE)).toBe(html)
  })

  it('标题里有行内标签也能匹配（比较前先剥标签）', () => {
    const html = '<h1>关于 <code>N</code> 的说明</h1>\n<p>x</p>'
    expect(stripLeadingDuplicateTitle(html, '关于 N 的说明')).toBe('<p>x</p>')
  })

  it('标题或正文为空时不做任何事', () => {
    const html = `<h1>${TITLE}</h1><p>x</p>`
    expect(stripLeadingDuplicateTitle(html, '')).toBe(html)
    expect(stripLeadingDuplicateTitle('', TITLE)).toBe('')
    expect(stripLeadingDuplicateTitle(null, TITLE)).toBe('')
  })

  it('h1 带 class/属性时也能删', () => {
    const html = `<h1 class="x" id="y">${TITLE}</h1><p>正文</p>`
    expect(stripLeadingDuplicateTitle(html, TITLE)).toBe('<p>正文</p>')
  })
})
