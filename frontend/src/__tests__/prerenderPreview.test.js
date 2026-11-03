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

/** 模拟 prerender.mjs 产出的直连文章页：#app 里是静态 fallback。 */
function mountPage({ withMeta = true, withBody = true } = {}) {
  document.body.innerHTML = ''
  document.getElementById('prerender-article')?.remove()

  if (withMeta) {
    const meta = document.createElement('script')
    meta.id = 'prerender-article'
    meta.type = 'application/json'
    meta.textContent = JSON.stringify(META)
    document.head.appendChild(meta)
  }

  const app = document.createElement('div')
  app.id = 'app'
  if (withBody) app.innerHTML = BODY
  document.body.appendChild(app)
}

beforeEach(() => {
  document.body.replaceChildren()
  document.getElementById('prerender-article')?.remove()
})

describe('readPrerenderedArticle', () => {
  it('rebuilds the article from the static #app fallback', () => {
    mountPage()
    const article = readPrerenderedArticle('hello')
    expect(article).toMatchObject({
      slug: 'hello',
      title: '你好',
      views_count: 7,
      html_content: '<p>正文段落</p>',
    })
    expect(article.tags).toEqual(['a'])
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

  it('returns null when the static body is missing', () => {
    mountPage({ withBody: false })
    expect(readPrerenderedArticle('hello')).toBeNull()
  })

  it('tolerates a corrupt metadata payload', () => {
    mountPage()
    document.getElementById('prerender-article').textContent = '{oops'
    expect(readPrerenderedArticle('hello')).toBeNull()
  })
})
