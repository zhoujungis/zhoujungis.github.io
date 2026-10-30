// @vitest-environment node
// prerender.mjs is a build-time Node script (node:fs / node:path), so this
// suite can't run under the jsdom environment the other tests use.
import { describe, it, expect } from 'vitest'
import {
  SITE_NAME,
  SITE_ORIGIN,
  LIST_PAGES,
  FEED_ITEM_COUNT,
  FEED_FULL_TEXT_COUNT,
  sanitizeHtml,
  wrapTables,
  upsertMeta,
  renderArticlePage,
  renderHomePage,
  toSnapshotList,
  findBulkEdits,
  pickLastmod,
  renderSitemap,
  renderRssFeed,
  renderListPage,
  sectionsForPage,
} from '../../scripts/prerender.mjs'
import { FOOTPRINT_CITIES, FOOTPRINT_REGIONS, FOOTPRINT_PROVINCES } from '../data/footprints'

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
    expect(html).toContain(`<title>Hello &lt;World&gt; | ${SITE_NAME}</title>`)
  })
})

describe('renderArticlePage zero-wait preview payload', () => {
  const payloadOf = (html) =>
    JSON.parse(html.match(/id="prerender-article">([\s\S]*?)<\/script>/)[1])

  it('emits metadata for JS users while the body lives only in <noscript>', () => {
    const html = renderArticlePage(SHELL, ARTICLE)
    expect(count(html, 'id="prerender-article"')).toBe(1)
    const meta = payloadOf(html)
    expect(meta.slug).toBe('hello-world')
    expect(meta.title).toBe('Hello <World>')
    expect(meta.cover_image).toBe('https://example.com/cover.jpg')
    // 正文不重复搬运：它已经在 <noscript> 里了
    expect(meta.html_content).toBeUndefined()
    expect(html).toContain('<p>Hello</p>')
  })

  it('escapes `<` so content containing </script> cannot cut the payload short', () => {
    const html = renderArticlePage(SHELL, {
      ...ARTICLE,
      excerpt: 'watch out </script> inside',
    })
    const raw = html.match(/id="prerender-article">([\s\S]*?)<\/script>/)[1]
    expect(raw).not.toContain('</script>')
    expect(payloadOf(html).excerpt).toBe('watch out </script> inside')
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

describe('wrapTables', () => {
  it('gives tables a scroll container', () => {
    expect(wrapTables('<table><tr><td>x</td></tr></table>')).toBe(
      '<div class="table-scroll"><table><tr><td>x</td></tr></table></div>',
    )
  })

  it('leaves other content alone', () => {
    expect(wrapTables('<p>no table</p>')).toBe('<p>no table</p>')
  })
})

describe('renderArticlePage dateModified', () => {
  it('publishes the same lastmod the sitemap uses', () => {
    const html = renderArticlePage(SHELL, ARTICLE, { lastmod: '2026-01-01T00:00:00+08:00' })
    expect(html).toContain('"dateModified":"2026-01-01T00:00:00+08:00"')
  })

  it('wraps tables for no-JS readers', () => {
    const html = renderArticlePage(SHELL, {
      ...ARTICLE,
      html_content: '<table><tr><td>x</td></tr></table>',
    })
    expect(html).toContain('<div class="table-scroll"><table>')
  })
})

describe('findBulkEdits / pickLastmod', () => {
  // Five articles written on five different days but PATCHed within four
  // minutes of each other — the signature of a batch metadata edit
  // (Article.updated_at is auto_now, so a title rewrite bumps every row).
  const at = (minutes) => `2026-10-12T16:${String(minutes).padStart(2, '0')}:00+08:00`
  const bulkArticles = Array.from({ length: 5 }, (_, i) => ({
    slug: `bulk-${i}`,
    created_at: `2026-0${i + 1}-01T10:00:00+08:00`,
    updated_at: at(20 + i),
  }))
  const single = {
    slug: 'single',
    created_at: '2026-07-01T10:00:00+08:00',
    updated_at: '2026-09-22T18:00:00+08:00',
  }
  const articles = [...bulkArticles, single]

  it('flags the articles inside a burst', () => {
    expect([...findBulkEdits(articles)].sort()).toEqual([
      'bulk-0',
      'bulk-1',
      'bulk-2',
      'bulk-3',
      'bulk-4',
    ])
  })

  it('does not flag edits spread across the day', () => {
    // The real counter-example from this blog: five edits 2 hours apart.
    const spread = Array.from({ length: 5 }, (_, i) => ({
      slug: `s${i}`,
      created_at: '2026-01-01T10:00:00+08:00',
      updated_at: `2026-09-22T${String(11 + i * 2).padStart(2, '0')}:00:00+08:00`,
    }))
    expect(findBulkEdits(spread).size).toBe(0)
  })

  it('needs at least five updates to call it a batch', () => {
    expect(findBulkEdits(bulkArticles.slice(0, 4)).size).toBe(0)
  })

  it('falls back to the publication date for batch-edited articles', () => {
    expect(pickLastmod(articles[0], findBulkEdits(articles))).toBe(
      '2026-01-01T10:00:00+08:00',
    )
  })

  it('keeps a genuine per-article update', () => {
    expect(pickLastmod(single, findBulkEdits(articles))).toBe(
      '2026-09-22T18:00:00+08:00',
    )
  })

  it('uses created_at when the article was never updated after publication', () => {
    const same = '2026-01-01T10:00:00+08:00'
    expect(pickLastmod({ created_at: same, updated_at: same })).toBe(same)
  })

  it('handles a missing updated_at', () => {
    expect(pickLastmod({ created_at: '2026-01-01T10:00:00+08:00' })).toBe(
      '2026-01-01T10:00:00+08:00',
    )
  })
})

describe('renderSitemap', () => {
  const articles = [
    { slug: 'a', created_at: '2026-08-01T10:00:00+08:00', updated_at: '2026-08-02T10:00:00+08:00' },
    { slug: 'b', created_at: '2026-07-01T10:00:00+08:00' },
  ]
  const indexable = LIST_PAGES.filter((p) => !p.noindex)

  it('lists the home page, every indexable list page and every article', () => {
    const xml = renderSitemap(articles)
    expect(count(xml, '<loc>')).toBe(1 + indexable.length + 2)
    expect(xml).toContain(`<loc>${SITE_ORIGIN}/</loc>`)
    for (const page of indexable) {
      expect(xml).toContain(`<loc>${SITE_ORIGIN}${page.path}</loc>`)
    }
    expect(xml).toContain(`<loc>${SITE_ORIGIN}/article/a/</loc>`)
    expect(xml).toContain(`<loc>${SITE_ORIGIN}/article/b/</loc>`)
  })

  it('keeps the prerendered noindex page out', () => {
    const xml = renderSitemap(articles)
    const noindex = LIST_PAGES.filter((p) => p.noindex)
    expect(noindex.length).toBeGreaterThan(0)
    for (const page of noindex) {
      expect(xml).not.toContain(`<loc>${SITE_ORIGIN}${page.path}</loc>`)
    }
    expect(xml).not.toContain(`<loc>${SITE_ORIGIN}/admin`)
  })

  it('uses the trailing-slash form GitHub Pages answers with 200', () => {
    const xml = renderSitemap(articles)
    for (const loc of xml.match(/<loc>[^<]*<\/loc>/g)) {
      expect(loc.endsWith('/</loc>')).toBe(true)
    }
  })

  it('emits full W3C datetimes, not date-only strings', () => {
    const xml = renderSitemap(articles)
    expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z<\/lastmod>/)
  })
})

describe('renderRssFeed', () => {
  const make = (i) => ({
    slug: `p${i}`,
    title: `Post ${i}`,
    excerpt: `Excerpt ${i}`,
    created_at: new Date(Date.UTC(2026, 0, i + 1)).toISOString(),
    html_content: `<p>Body ${i}</p>`,
    category: { name: 'Django', slug: 'django' },
    tags: [{ name: 'python', slug: 'python' }],
  })
  const articles = Array.from({ length: 25 }, (_, i) => make(i))

  it('caps the feed and lists newest first', () => {
    const xml = renderRssFeed(articles)
    expect(count(xml, '<item>')).toBe(FEED_ITEM_COUNT)
    expect(xml.indexOf('/article/p24/')).toBeLessThan(xml.indexOf('/article/p5/'))
    expect(xml).not.toContain('/article/p4/')
  })

  it('carries full text only for the newest few items', () => {
    const xml = renderRssFeed(articles)
    expect(count(xml, '<content:encoded>')).toBe(FEED_FULL_TEXT_COUNT)
  })

  it('gives every item a description so readers still show a summary', () => {
    const xml = renderRssFeed(articles)
    // channel description + one per item
    expect(count(xml, '<description>')).toBe(FEED_ITEM_COUNT + 1)
  })

  it('escapes XML and splits a CDATA terminator in the body', () => {
    const xml = renderRssFeed([{ ...make(0), title: 'A & B <c>', html_content: '<p>a]]>b</p>' }])
    expect(xml).toContain('<title>A &amp; B &lt;c&gt;</title>')
    expect(xml).toContain(']]]]><![CDATA[>')
    expect(xml).not.toContain('<p>a]]>b</p>')
  })

  it('points atom:link at the site\u2019s own rss.xml', () => {
    const xml = renderRssFeed(articles)
    expect(xml).toContain(`href="${SITE_ORIGIN}/rss.xml"`)
  })
})

describe('renderListPage', () => {
  const articles = [
    {
      slug: 'b',
      title: 'B post',
      created_at: '2026-08-02T00:00:00+08:00',
      category: { name: 'Django', slug: 'django' },
      tags: [{ name: 'python', slug: 'python' }],
    },
    {
      slug: 'a',
      title: 'A post',
      created_at: '2026-08-01T00:00:00+08:00',
      category: { name: 'Django', slug: 'django' },
      tags: [{ name: 'python', slug: 'python' }],
    },
  ]
  const pageFor = (path) => LIST_PAGES.find((p) => p.path === path)

  it('sets a page-level title and the slashed canonical', () => {
    const page = pageFor('/articles/')
    const html = renderListPage(SHELL, page, sectionsForPage(page, articles))
    expect(html).toContain(`<title>${page.title} | ${SITE_NAME}</title>`)
    expect(html).toContain(`<link rel="canonical" href="${SITE_ORIGIN}/articles/" />`)
    expect(count(html, 'name="description"')).toBe(1)
    expect(count(html, 'property="og:title"')).toBe(1)
    expect(count(html, 'property="og:url"')).toBe(1)
  })

  it('lists each article exactly once and is idempotent', () => {
    const page = pageFor('/articles/')
    const once = renderListPage(SHELL, page, sectionsForPage(page, articles))
    expect(count(once, '/article/b/')).toBe(1)
    expect(count(once, '/article/a/')).toBe(1)
    expect(renderListPage(once, page, sectionsForPage(page, articles))).toBe(once)
  })

  it('cross-links the sibling list pages', () => {
    const page = pageFor('/tags/')
    const html = renderListPage(SHELL, page, sectionsForPage(page, articles))
    const nav = html.match(/<p class="ns-nav">[\s\S]*?<\/p>/)[0]
    expect(nav).toContain(`href="${SITE_ORIGIN}/articles/"`)
    expect(nav).toContain(`href="${SITE_ORIGIN}/archives/"`)
    expect(nav).toContain(`href="${SITE_ORIGIN}/categories/"`)
    expect(nav).not.toContain(`href="${SITE_ORIGIN}/tags/"`)
  })

  it('groups categories with their article counts', () => {
    const page = pageFor('/categories/')
    const html = renderListPage(SHELL, page, sectionsForPage(page, articles))
    expect(html).toContain('Django（2 篇）')
  })

  it('nests archives by year and month', () => {
    const page = pageFor('/archives/')
    const html = renderListPage(SHELL, page, sectionsForPage(page, articles))
    expect(html).toContain('2026 年（2 篇）')
    expect(html).toContain('8 月')
  })

  it('renders the whole travel list on /footprints', () => {
    const page = pageFor('/footprints/')
    const html = renderListPage(SHELL, page, sectionsForPage(page, articles))
    // Static data — the snapshot doesn't depend on the article list at all.
    expect(html).toContain(`共 ${FOOTPRINT_CITIES.length} 座城市`)
    expect(html).toContain(`共 ${FOOTPRINT_CITIES.length} 座城市 · ${FOOTPRINT_PROVINCES.length} 个省/地区`)
    for (const city of FOOTPRINT_CITIES) {
      expect(html, city.name).toContain(city.name)
    }
    for (const region of FOOTPRINT_REGIONS) {
      expect(html, region.name).toContain(region.name)
    }
  })

  it('writes the full legal-page text into the no-JS snapshot', () => {
    // AdSense 审核与搜索引擎都要求隐私政策有真实正文；只写标题的快照
    // 等于把合规内容藏进必须执行 JS 才能看到的地方，这里锁住全文输出。
    for (const path of ['/about/', '/privacy/', '/disclaimer/']) {
      const page = pageFor(path)
      const html = renderListPage(SHELL, page, sectionsForPage(page, articles))
      expect(html, path).toContain(`<title>${page.title} | ${SITE_NAME}</title>`)
      expect(html, path).toContain(`<link rel="canonical" href="${SITE_ORIGIN}${path}" />`)
      // 每节至少带一个段落，而不是只有 <h2> 空壳
      expect(count(html, '<p>'), path).toBeGreaterThan(2)
    }

    const privacy = renderListPage(SHELL, pageFor('/privacy/'), sectionsForPage(pageFor('/privacy/'), articles))
    expect(privacy).toContain('Google AdSense')
    expect(privacy).toContain('Cookie')
  })

  it('gives the API-driven pages a 200 with head, lead and cross-links', () => {
    for (const path of ['/photos/', '/friends/', '/search/']) {
      const page = pageFor(path)
      const html = renderListPage(SHELL, page, sectionsForPage(page, articles))
      expect(html, path).toContain(`<title>${page.title} | ${SITE_NAME}</title>`)
      expect(html, path).toContain(`<link rel="canonical" href="${SITE_ORIGIN}${path}" />`)
      expect(html, path).toContain(`<h1>${page.title}</h1>`)
      expect(html, path).toContain('class="ns-nav"')
    }
  })
})
