import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import Home from '../pages/Home.vue'

const globalStyles = readFileSync('src/styles/global.scss', 'utf8')

vi.mock('@/api/articles', () => ({
  getArticles: vi.fn(() => Promise.resolve({ data: { results: [] } })),
  getArticleBySlug: vi.fn(),
  getCategories: vi.fn(() => Promise.resolve({ data: [] })),
  getTags: vi.fn(() => Promise.resolve({ data: [] })),
}))

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Home },
      { path: '/articles', component: { template: '<div />' } },
      { path: '/article/:slug', component: { template: '<div />' } },
    ],
  })
}

describe('Landing (Home.vue)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders page-landing root container', async () => {
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    expect(wrapper.find('.page-landing').exists()).toBe(true)
  })

  it('renders masthead with kicker, name and subtitle', async () => {
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    expect(wrapper.find('.masthead__kicker').text()).toBe('ZhouJun · 深圳')
    expect(wrapper.find('.masthead__name').text()).toBe('代码与生活')
    expect(wrapper.find('.masthead__sub').text()).toBe('写字、写码、写日常。')

    // 自述三句，一句一行
    const lede = wrapper.findAll('.masthead__lede p').map((p) => p.text())
    expect(lede).toHaveLength(3)
    expect(lede[0]).toBe('代码的世界非黑即白，生活的画布斑驳陆离。')
    expect(lede[2]).toBe('世界很大，我想把这些亲历的创造与感动，妥帖地存放于此。')
  })

  it('renders latest-section with header and view-all link', async () => {
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    await flushPromises()
    const front = wrapper.find('.front-section')
    expect(front.exists()).toBe(true)
    // Scope to the section: 刊头之后还有「算法解读」，它也有自己的 .section-title，
    // 不限定作用域的话断言会取到第一个区块的标题。
    expect(front.find('.section-title').text()).toBe('最新文章')
    const more = front.find('.section-more')
    expect(more.exists()).toBe(true)
    expect(more.attributes('href')).toBe('/articles')
  })

  it('renders 算法解读 section below 最新文章', async () => {
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    await flushPromises()

    const algo = wrapper.find('.algo-section')
    expect(algo.exists()).toBe(true)
    expect(algo.find('.section-title').text()).toBe('算法解读')
    // 区块右侧是「全部题解 →」/algo
    expect(algo.find('.section-more').attributes('href')).toBe('/algo')

    // 题单是静态数据，API 挂掉也照样显示
    const items = algo.findAll('.algo-item')
    expect(items.length).toBeGreaterThan(0)

    const first = items[0]
    expect(first.find('.algo-item__id').text().replace(/\s+/g, ' ')).toBe('LC 206')
    expect(first.find('.algo-item__title').text()).toBe('反转链表')
    expect(first.find('.algo-item__level').text()).toBe('简单')

    // 位置：必须在「最新文章」之后
    const order = wrapper.findAll('.front-section, .algo-section')
    expect(order[0].classes()).toContain('front-section')
    expect(order[1].classes()).toContain('algo-section')
  })

  it('首页最多只放两条算法题，未发布的渲染成不可点的行', async () => {
    const { ALGORITHMS } = await import('@/data/algorithms')
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    await flushPromises()

    const items = wrapper.findAll('.algo-item')
    expect(items.length).toBeLessThanOrEqual(2)

    // published: false 时不能是链接 —— 后端还没这篇文章，点进去只会 404
    const first = items[0]
    expect(first.find('.algo-item__link').attributes('href')).toBeUndefined()
    if (!ALGORITHMS[0].published) {
      expect(first.find('.algo-item__pending').exists()).toBe(true)
      expect(first.find('.algo-item__link').classes()).toContain('is-pending')
    }
  })

  it('shows featured + list when latest articles are returned', async () => {
    const { getArticles } = await import('@/api/articles')
    getArticles.mockResolvedValueOnce({
      data: {
        results: [
          { slug: 'a1', title: 'Article One', excerpt: 'excerpt one', created_at: '2026-01-01T00:00:00Z', category: { name: '技术' }, tags: [], reading_time: 3, cover_image: '' },
          { slug: 'a2', title: 'Article Two', excerpt: 'excerpt two', created_at: '2026-01-02T00:00:00Z', category: null, tags: [], reading_time: 2, cover_image: '' },
          { slug: 'a3', title: 'Article Three', excerpt: '', created_at: '2026-01-03T00:00:00Z', category: null, tags: [], reading_time: 1, cover_image: '' },
          { slug: 'a4', title: 'Article Four', excerpt: '', created_at: '2026-01-04T00:00:00Z', category: null, tags: [], reading_time: 1, cover_image: '' },
          { slug: 'a5', title: 'Article Five', excerpt: '', created_at: '2026-01-05T00:00:00Z', category: null, tags: [], reading_time: 1, cover_image: '' },
        ],
      },
    })
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.find('.lead-story').exists()).toBe(true)
    // sorted newest-first, so 2026-01-05 (Article Five) is featured
    expect(wrapper.find('.lead-story__title').text()).toBe('Article Five')
    expect(wrapper.findAll('.index-item').length).toBe(4)
  })

  it('primary CTA points to /articles', async () => {
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    const cta = wrapper.find('.mast-cta')
    expect(cta.exists()).toBe(true)
    expect(cta.attributes('href')).toBe('/articles')
    expect(cta.text()).toMatch(/阅读文章/)
  })

  it('keeps dark-theme override for the landing surface', () => {
    expect(globalStyles).toContain('.page-landing')
  })
})
