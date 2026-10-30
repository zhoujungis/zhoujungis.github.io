// 合规页回归：隐私政策/关于/免责声明
//
// 这三页是 AdSense 审核的硬门槛 —— 隐私政策缺了必被拒。所以这里锁三件事：
//   1. 页面正文真的渲染出来（含第三方 Cookie 声明，这是审核重点）；
//   2. 三条路由各自的标题/正文不会串（共用一个组件，最容易串）；
//   3. 页脚有可达入口（审核员从首页往下找的就是页脚）。
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import SitePage from '../pages/SitePage.vue'
import AppFooter from '../components/AppFooter.vue'
import { SITE_PAGES } from '../data/sitePages'

function makeRouter({ withHome = false } = {}) {
  const routes = SITE_PAGES.map((page) => ({
    path: page.path.replace(/\/$/, ''),
    name: page.key,
    meta: { sitePage: page.key },
    component: SitePage,
  }))
  if (withHome) routes.push({ path: '/', name: 'Home', component: { template: '<div />' } })
  return createRouter({ history: createMemoryHistory(), routes })
}

async function mountAt(key) {
  const router = makeRouter()
  const page = SITE_PAGES.find((p) => p.key === key)
  await router.push(page.path.replace(/\/$/, ''))
  await router.isReady()
  const wrapper = mount(SitePage, { global: { plugins: [router] } })
  return { wrapper, router }
}

describe('合规页', () => {
  it('隐私政策是独立页面，且明确声明第三方 Cookie 与广告用途', async () => {
    const { wrapper } = await mountAt('privacy')
    const text = wrapper.text()

    expect(wrapper.find('.page-title').text()).toBe('隐私政策')
    expect(wrapper.findAll('.doc-section').length).toBeGreaterThan(3)

    // Google AdSense 审核真正在意的几句：第三方 Cookie、广告、退出方式
    expect(text).toContain('Google AdSense')
    expect(text).toContain('Cookie')
    expect(text).toContain('Google Analytics')
    // 退出个性化广告的入口必须是可点的链接（审核项：给用户 opt-out 途径）
    const optOut = wrapper.findAll('.doc-list a').find((a) => a.attributes('href').includes('google.com/settings/ads'))
    expect(optOut).toBeTruthy()
    // 有更新日期，审核会看「是否长期未维护」
    expect(wrapper.find('.page-updated').exists()).toBe(true)
  })

  it('三条路由各自渲染自己的正文，不会互相串页', async () => {
    const about = await mountAt('about')
    const privacy = await mountAt('privacy')
    const disclaimer = await mountAt('disclaimer')

    expect(about.wrapper.find('.page-title').text()).toBe('关于本站')
    expect(privacy.wrapper.find('.page-title').text()).toBe('隐私政策')
    expect(disclaimer.wrapper.find('.page-title').text()).toBe('免责声明')

    // 「关于本站」不该出现隐私政策里的 Cookie 段落
    expect(about.wrapper.text()).not.toContain('DoubleClick DART Cookie')
    expect(privacy.wrapper.text()).toContain('DoubleClick DART Cookie')
  })

  it('页内目录锚点与各小节 id 一一对应', async () => {
    const { wrapper } = await mountAt('privacy')
    const links = wrapper.findAll('.doc-toc__link')
    expect(links.length).toBe(wrapper.findAll('.doc-section').length)

    for (const link of links) {
      const href = link.attributes('href')
      expect(wrapper.find(href).exists(), href).toBe(true)
    }
  })

  it('页脚提供关于/隐私政策/免责声明的可达入口', async () => {
    const router = makeRouter({ withHome: true })
    await router.push('/')
    await router.isReady()
    const wrapper = mount(AppFooter, { global: { plugins: [router] } })
    const links = wrapper.findAll('.footer-legal__link')

    expect(links.map((l) => l.text())).toEqual(['关于本站', '隐私政策', '免责声明'])
    expect(links.map((l) => l.attributes('href'))).toEqual(['/about', '/privacy', '/disclaimer'])
  })
})
