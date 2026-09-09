import { describe, it, expect } from 'vitest'
import {
  sanitizeHtml,
  upsertMeta,
  renderArticlePage,
  renderHomePage,
  toSnapshotList,
} from '../../scripts/prerender.mjs'

const SHELL = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="Site description" />
    <link rel="canonical" href="https://zhoujungis.github.io/" />
    <meta property="og:title" content="ZhouJun's Blog" />
    <meta property="og:description" content="Site description" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://zhoujungis.github.io/" />
    <meta property="og:image" content="https://zhoujungis.github.io/og-image.jpg" />
    <meta name="twitter:title" content="ZhouJun's Blog" />
    <meta name="twitter:description" content="Site description" />
    <meta name="twitter:image" content="https://zhoujungis.github.io/og-image.jpg" />
    <title>Home</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`

const ARTICLE = {
  slug: 'hello-world',
  title: 'Hello <World>',
  excerpt: 'An excerpt for testing.',
  cover_image: 'https://example.com/cover.jpg',
  created_at: '2026-08-01T10:00:00+08:00',
  updated_at: '2026-08-02T10:00:00+08:00',
  html_content: '<p>Hello</p><script>alert(1)</script><a href="javascript:alert(2)">x</a><img src="a.jpg" onload="evil()">',
}

function count(html, pattern) {
  return (html.match(new RegExp(pattern, 'g')) || []).length
}

describe('renderArticlePage SEO tags', () => {
  it('emits exactly one canonical pointing at the article URL', () => {
    const html = renderArticlePage(SHELL, ARTICLE)
    expect(count(html, '<link rel="canonical"')).toBe(1)
    expect(html).toContain('href="https://zhoujungis.github.io/article/hello-world/"')
  })

  it('emits exactly one description / og / twitter tag each', () => {
    const html = renderArticlePage(SHELL, ARTICLE)
    expect(count(html, 'name="description"')).toBe(1)
    expect(count(html, 'property="og:title"')).toBe(1)
    expect(count(html, 'property="og:description"')).toBe(1)
    expect(count(html, 'property="og:url"')).toBe(1)
    expect(count(html, 'name="twitter:title"')).toBe(1)
    expect(count(html, 'name="twitter:description"')).toBe(1)
    // og:type=website replaced by og:type=article
    expect(count(html, 'property="og:type"')).toBe(1)
    expect(html).toContain('content="article"')
  })

  it('uses the article cover for og:image / twitter:image', () => {
    const html = renderArticlePage(SHELL, ARTICLE)
    expect(html).toContain('property="og:image" content="https://example.com/cover.jpg"')
    expect(html).toContain('name="twitter:image" content="https://example.com/cover.jpg"')
  })

  it('escapes the title in <title>', () => {
    const html = renderArticlePage(SHELL, ARTICLE)
    expect(html).toContain('<title>Hello &lt;World&gt; | ZhouJun&#39;s Blog</title>')
  })
})

describe('sanitizeHtml', () => {
  it('strips scripts, event handlers and javascript: URLs', () => {
    const out = sanitizeHtml(ARTICLE.html_content)
    expect(out).not.toContain('<script')
    expect(out).not.toContain('onload')
    expect(out).not.toContain('javascript:')
    // benign content survives
    expect(out).toContain('<p>Hello</p>')
    expect(out).toContain('src="a.jpg"')
  })

  it('strips iframes and objects', () => {
    expect(sanitizeHtml('<iframe src="https://evil.com"></iframe><p>ok</p>')).toBe('<p>ok</p>')
  })
})

describe('upsertMeta', () => {
  it('replaces in place when the tag exists', () => {
    const out = upsertMeta(SHELL, 'name', 'description', 'New')
    expect(count(out, 'name="description"')).toBe(1)
    expect(out).toContain('content="New"')
  })

  it('inserts before </head> when missing', () => {
    const out = upsertMeta(SHELL, 'name', 'author', 'Zhou Jun')
    expect(out).toContain('<meta name="author" content="Zhou Jun" />')
  })
})

describe('renderHomePage', () => {
  const articles = [
    { slug: 'b', title: 'B post', created_at: '2026-08-02T00:00:00+08:00' },
    { slug: 'a', title: 'A post', created_at: '2026-08-01T00:00:00+08:00' },
  ]

  it('injects a noscript latest list, newest first', () => {
    const html = renderHomePage(SHELL, articles)
    expect(html).toContain('<noscript>')
    expect(html.indexOf('/article/b/')).toBeLessThan(html.indexOf('/article/a/'))
  })

  it('is idempotent (no double injection)', () => {
    const once = renderHomePage(SHELL, articles)
    const twice = renderHomePage(once, articles)
    expect(count(once, '<noscript>')).toBe(1)
    expect(twice).toBe(once)
  })
})

describe('toSnapshotList', () => {
  it('keeps only the fields the offline fallback needs', () => {
    const [item] = toSnapshotList([{ ...ARTICLE, html_content: '<p>x</p>', extra: 1 }])
    expect(item.slug).toBe('hello-world')
    expect(item.html_content).toBeUndefined()
    expect(item.extra).toBeUndefined()
    expect(item.title).toBe('Hello <World>')
  })
})
