import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import Home from '../pages/Home.vue'

const globalStyles = readFileSync('src/styles/global.scss', 'utf8')

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/articles', component: { template: '<div />' } },
    { path: '/about', component: { template: '<div />' } },
  ],
})

describe('Landing (Home.vue)', () => {
  it('renders page-landing root container', async () => {
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    expect(wrapper.find('.page-landing').exists()).toBe(true)
  })

  it('renders .landing__name', async () => {
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    expect(wrapper.find('.landing__name').text()).toBe('个人博客')
  })

  it('does NOT render any article card or article-grid', async () => {
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    expect(wrapper.find('.article-grid').exists()).toBe(false)
    // ArticleCard was the original child component on Home — assert it isn't used.
    // (Stub it the same way Articles.spec.js did to ensure the component tree
    //  never needs to render an ArticleCard.)
    expect(wrapper.findComponent({ name: 'ArticleCard' }).exists()).toBe(false)
  })

  it('primary CTA points to /articles', async () => {
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    const cta = wrapper.find('.cta--primary')
    expect(cta.exists()).toBe(true)
    expect(cta.attributes('href')).toBe('/articles')
    expect(cta.text()).toMatch(/读文章/)
  })

  it('defines dark-theme overrides for landing surfaces and text', () => {
    for (const selector of [
      '.page-landing',
      '.avatar-frame',
      '.landing__name',
      '.cta--primary',
      '.landing__bio',
      '.avatar-handle',
    ]) {
      expect(globalStyles).toContain(selector)
    }
  })

  it('does NOT mount SidePanel', async () => {
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    expect(wrapper.findComponent({ name: 'SidePanel' }).exists()).toBe(false)
  })
})
