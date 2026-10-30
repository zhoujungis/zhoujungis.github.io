import { describe, it, expect, beforeEach } from 'vitest'
import { readPrerenderedArticle } from '../utils/prerenderPreview'

const META = {
  slug: 'hello',
  title: '你好',
  created_at: '2026-01-01T00:00:00+08:00',
  tags: ['a'],
  views_count: 7,
}
const BODY =
  '<div class="ns-article"><h1>你好</h1>' +
  '<div class="markdown-body"><p>正文段落</p></div></div>'

/**
 * 模拟 prerender.mjs 产出的直连文章页。
 * noscriptMode: 'text'   → 真实浏览器（脚本开启，noscript 内容是原始 HTML 文本）
 * noscriptMode 'element' → 脚本关闭 / jsdom 的默认解析结果（子节点是元素）
 */
function mountPage({ withMeta = true, noscriptMode = 'text' } = {}) {
  document.body.innerHTML = ''
  document.getElementById('prerender-article')?.remove()

  if (withMeta) {
    const meta = document.createElement('script')
    meta.id = 'prerender-article'
    meta.type = 'application/json'
    meta.textContent = JSON.stringify(META)
    document.head.appendChild(meta)
  }

  const noscript = document.createElement('noscript')
  if (noscriptMode === 'text') noscript.textContent = BODY
  else noscript.innerHTML = BODY
  document.body.appendChild(noscript)
}

beforeEach(() => {
  document.body.replaceChildren()
  document.getElementById('prerender-article')?.remove()
})

describe('readPrerenderedArticle', () => {
  it('rebuilds the article from the noscript text (scripting enabled)', () => {
    mountPage({ noscriptMode: 'text' })
    const article = readPrerenderedArticle('hello')
    expect(article).toMatchObject({
      slug: 'hello',
      title: '你好',
      views_count: 7,
      html_content: '<p>正文段落</p>',
    })
    expect(article.tags).toEqual(['a'])
  })

  it('also reads an already-parsed noscript (scripting disabled / jsdom)', () => {
    mountPage({ noscriptMode: 'element' })
    expect(readPrerenderedArticle('hello')?.html_content).toBe('<p>正文段落</p>')
  })

  it('refuses a payload built for a different slug', () => {
    mountPage()
    // SPA 跳到别的文章时，页面里的预渲染产物不能被当成那一篇的内容。
    expect(readPrerenderedArticle('another-slug')).toBeNull()
  })

  it('returns null when the metadata tag is missing', () => {
    mountPage({ withMeta: false })
    expect(readPrerenderedArticle('hello')).toBeNull()
  })

  it('returns null when the noscript body is missing', () => {
    mountPage()
    document.querySelector('noscript').remove()
    expect(readPrerenderedArticle('hello')).toBeNull()
  })

  it('tolerates a corrupt metadata payload', () => {
    mountPage()
    document.getElementById('prerender-article').textContent = '{oops'
    expect(readPrerenderedArticle('hello')).toBeNull()
  })
})
