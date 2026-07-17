# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/` a pure landing page (no articles, zero network) and move the existing article listing into a new `/articles` route, while updating the header nav (new 「文章」 link + logo text 「个人博客」).

**Architecture:** One-route add (`/articles`), one-route transform (`/` → landing), one-component migrate (Home.vue logic → Articles.vue), one-component patch (AppHeader nav+logo). No store, no API, no dependency changes. Landing is fully self-contained; `/articles` is a 1:1 migration of the old Home.vue template + script (store-driven, unchanged) so the bug surface is zero.

**Tech Stack:** Vue 3 (`<script setup>`), Vue Router 4, Pinia 3 (existing), SCSS (variables only — no new tokens), Vitest + @vue/test-utils (existing), Vite 8.

---

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-17-homepage-redesign-design.md` (committed `f9381ef`).
- Variables: use existing SCSS `$accent-pink`, `$accent-purple`, `$accent-mint`, `$bg-card`, `$text-secondary`, `$font-mono`, `$transition-fast`, `$transition-base` — **no new SCSS color/font tokens**.
- Avatar source: `frontend/public/PIC.svg` (existing per `2026-07-17-avatar-style-replacement`).
- One commit per task. Conventional-commit prefix (`docs/`, `feat/`, `style/`, `test/`, `chore/`).
- Don't touch: `articleStore`, `ArticleCard`, `SidePanel`, `AppFooter`, `ParticleBg`, `Live2DWidget`, `BackToTop`, `ThemeToggle`, `LoadingScreen`, `ReadingProgress`, `ArticleDetail`, `Archives/Categories/Tags/Search/Photos/Friends/Footprints/About/Admin` pages.
- Not in scope: SEO redirects for old `/?category=...&tag=...&page=...` URLs (per spec § Step 6).

---

## File Structure

| Path | Responsibility | Action |
|---|---|---|
| `frontend/src/pages/Articles.vue` | New article listing page (1:1 migration of old Home) | Create |
| `frontend/src/router/index.js` | Register `/articles` route | Modify (1 line) |
| `frontend/src/pages/Home.vue` | Pure Landing (zero network, no articles) | Modify (full rewrite) |
| `frontend/src/components/AppHeader.vue` | Add nav 「文章」, change logo text to 「个人博客」 | Modify (~3 lines) |
| `frontend/src/__tests__/Articles.spec.js` | Asserts /articles renders articles grid | Create |
| `frontend/src/__tests__/Landing.spec.js` | Asserts / does NOT render ArticleCard; renders .landing__name etc. | Create |

`frontend/src/styles/variables.scss`, `frontend/src/stores/article.js`, `frontend/src/components/ArticleCard.vue`, `frontend/src/components/SidePanel.vue`: **untouched**.

---

### Task 1: Migrate Home.vue → Articles.vue + register route

**Files:**
- Create: `frontend/src/pages/Articles.vue` (from `frontend/src/pages/Home.vue`, 1:1 with `page-header` tweak)
- Modify: `frontend/src/router/index.js:6-22` (insert `/articles` route)
- Create: `frontend/src/__tests__/Articles.spec.js`

**Interfaces:**
- Consumes: `articleStore.fetchArticles(params)` → `{ data: { results, count } }` (existing, unchanged)
- Produces: route `name: 'Articles'`; component `default export { template, script, style }` rendering `.page-articles` with `.article-grid` containing `ArticleCard`.

- [ ] **Step 1: Write the failing test for Articles.vue**

Create `frontend/src/__tests__/Articles.spec.js`:

```js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import Articles from '../pages/Articles.vue'
import { useArticleStore } from '../stores/article'

// Stub ArticleCard to avoid pulling in heavy deps
vi.mock('../components/ArticleCard.vue', () => ({
  default: { name: 'ArticleCard', props: ['article'], template: '<div class="stub-card" />' },
}))
// Stub SidePanel to avoid pulling in heavy deps
vi.mock('../components/SidePanel.vue', () => ({
  default: { name: 'SidePanel', template: '<div class="stub-side" />' },
}))

describe('Articles page', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders page-articles root container', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/articles', component: Articles }] })
    await router.push('/articles'); await router.isReady()
    const wrapper = mount(Articles, { global: { plugins: [router] } })
    expect(wrapper.find('.page-articles').exists()).toBe(true)
  })

  it('shows page-header with title 文章', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/articles', component: Articles }] })
    await router.push('/articles'); await router.isReady()
    const wrapper = mount(Articles, { global: { plugins: [router] } })
    expect(wrapper.find('.page-title').text()).toBe('文章')
  })

  it('renders article-grid when store has results', async () => {
    const store = useArticleStore()
    store.articles = [{ id: 1, slug: 'a', is_top: false }]
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/articles', component: Articles }] })
    await router.push('/articles'); await router.isReady()
    const wrapper = mount(Articles, { global: { plugins: [router] } })
    expect(wrapper.find('.article-grid').exists()).toBe(true)
    expect(wrapper.findAll('.stub-card').length).toBe(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- Articles.spec.js`
Expected: FAIL — `Cannot find module '../pages/Articles.vue'`.

- [ ] **Step 3: Copy Home.vue → Articles.vue with rename + page-header**

```bash
cp frontend/src/pages/Home.vue frontend/src/pages/Articles.vue
```

Then edit `frontend/src/pages/Articles.vue`:
- Change `<div class="page page-home">` → `<div class="page page-articles">`
- Insert at the very top of `<div class="home-layout">` (i.e. before `<div class="home-main">`):

```html
<header class="page-header">
  <h1 class="page-title neon-text-cyan">文章</h1>
  <p class="page-subtitle">
    所有文章按时间倒序排列,共 {{ articleStore.pagination.count }} 篇
  </p>
</header>
```

- Rename CSS class `.page-home` → `.page-articles` in the `<style>` block (also adjust any descendant `.home-main`, `.home-layout` references — search & replace whole tokens; they remain unchanged but the root class joins `.page-articles`).
- In `<script setup>`, the existing `pinnedArticles`, `regularArticles`, `totalPages`, `visiblePages`, `loadArticles()`, `goToPage()`, `clearFilter()`, `watch(route.query)`, `onMounted()` — **all kept verbatim from Home.vue**.

- [ ] **Step 4: Register /articles route in router**

Modify `frontend/src/router/index.js`, insert immediately after line 7 (`ArticleDetail` route):

```js
  { path: '/articles', name: 'Articles', component: () => import('../pages/Articles.vue') },
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd frontend && npm test -- Articles.spec.js`
Expected: PASS — all 3 tests green.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/Articles.vue frontend/src/router/index.js frontend/src/__tests__/Articles.spec.js
git commit -m "feat(articles): migrate Home content to /articles, register route"
```

---

### Task 2: Patch AppHeader — add 「文章」 nav + change logo 「个人博客」

**Files:**
- Modify: `frontend/src/components/AppHeader.vue:4` (logo), `:37-47` (navLinks)
- Create: `frontend/src/__tests__/AppHeader.spec.js`

**Interfaces:**
- Consumes: existing component (`<AppHeader>`)
- Produces: rendered nav contains `<a>` with text 「文章」 pointing to `/articles`; logo `<a>` text is 「个人博客」.

- [ ] **Step 1: Write the failing test for AppHeader**

Create `frontend/src/__tests__/AppHeader.spec.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'

function withRouter() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'Home', component: { template: '<div />' } },
      { path: '/articles', name: 'Articles', component: { template: '<div />' } },
    ],
  })
  return router
}

describe('AppHeader', () => {
  it('renders logo text as 「个人博客」', async () => {
    const router = withRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(AppHeader, { global: { plugins: [router] } })
    expect(wrapper.find('.logo').text()).toBe('个人博客')
  })

  it('renders nav link 「文章」 pointing to /articles', async () => {
    const router = withRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(AppHeader, { global: { plugins: [router] } })
    const articleLink = wrapper.findAll('.nav-link').find(a => a.text() === '文章')
    expect(articleLink).toBeTruthy()
    expect(articleLink.attributes('href')).toBe('/articles')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- AppHeader.spec.js`
Expected: FAIL — logo is `ZhouJun`, nav has no `文章` link.

- [ ] **Step 3: Edit AppHeader.vue logo text (line 4)**

Change:
```html
    <router-link to="/" class="logo">ZhouJun</router-link>
```
to:
```html
    <router-link to="/" class="logo">个人博客</router-link>
```

- [ ] **Step 4: Edit AppHeader.vue navLinks (line ~37, second entry)**

Change navLinks array to insert `{ path: '/articles', label: '文章' }` as the **second** entry (right after 首页):

```js
const navLinks = [
  { path: '/', label: '首页' },
  { path: '/articles', label: '文章' },
  { path: '/archives', label: '归档' },
  { path: '/categories', label: '分类' },
  { path: '/tags', label: '标签' },
  { path: '/photos', label: '照片墙' },
  { path: '/friends', label: '友链' },
  { path: '/footprints', label: '足迹' },
  { path: '/about', label: '关于' },
  { path: '/search', label: '搜索' },
]
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd frontend && npm test -- AppHeader.spec.js`
Expected: PASS — both tests green.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/AppHeader.vue frontend/src/__tests__/AppHeader.spec.js
git commit -m "feat(header): add nav 「文章」 link, change logo to 「个人博客」"
```

---

### Task 3: Rewrite Home.vue as pure Landing (TDD)

**Files:**
- Modify: `frontend/src/pages/Home.vue` (full content replacement — template, script, style)
- Create: `frontend/src/__tests__/Landing.spec.js`

**Interfaces:**
- Consumes: zero (no store, no fetch)
- Produces: route `name: 'Home'` resolves to a `<div class="page page-landing">` containing `.landing__name`, primary CTA `<a class="cta cta--primary" href="/articles">`. DOM contains **no** `.article-grid` and **no** `ArticleCard`.

- [ ] **Step 1: Write the failing test for Landing**

Create `frontend/src/__tests__/Landing.spec.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import Home from '../pages/Home.vue'

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
    expect(wrapper.find('.landing__name').text()).toBe('Zhou Jun')
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

  it('does NOT mount SidePanel', async () => {
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    expect(wrapper.findComponent({ name: 'SidePanel' }).exists()).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- Landing.spec.js`
Expected: FAIL — Landing.spec.js's "does NOT render any article card" passes (because stubs aren't registered), but "renders .landing__name" fails because Home.vue still has `.pinned-heading` and no `.landing__name`. At least 1 failure.

- [ ] **Step 3: Replace Home.vue template + script + style wholesale**

Overwrite `frontend/src/pages/Home.vue` with this exact content (replace the entire file):

```vue
<template>
  <div class="page page-landing">
    <article class="landing">
      <!-- Avatar column -->
      <section class="avatar-zone">
        <div class="avatar-frame">
          <div class="avatar-frame__inner">
            <img
              src="/PIC.svg"
              alt="Zhou Jun"
              class="avatar-image"
              loading="eager"
              fetchpriority="high"
              @error="onAvatarError"
            />
            <div class="avatar-fallback" v-if="avatarFailed">Z</div>
          </div>
          <span class="avatar-status" :class="{ 'avatar-status--hidden': avatarFailed }" title="在线" />
        </div>
        <p class="avatar-handle">@zhoujun · 📍上海</p>
      </section>

      <!-- Intro column -->
      <section class="intro-zone">
        <h1 class="landing__name">Zhou Jun</h1>
        <p class="landing__tagline">探索代码 · 写作 · 光影</p>

        <p class="landing__bio">
          工程师 · 写作者。用代码构建工具,用文字记录思考,
          用脚步丈量世界。👋 欢迎来到我的角落。
        </p>

        <div class="landing__cta">
          <router-link to="/articles" class="cta cta--primary">
            📖 读文章 →
          </router-link>
          <router-link to="/about" class="cta cta--secondary">
            关于我
          </router-link>
        </div>

        <ul class="landing__social">
          <li><a href="https://github.com/zhoujungis" target="_blank" rel="noopener">🐙 GitHub</a></li>
          <li><a href="mailto:hi@zhoujun.cn">📮 Email</a></li>
          <li><a href="https://zhoujun123.pythonanywhere.com/rss.xml">📡 RSS</a></li>
        </ul>
      </section>
    </article>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const avatarFailed = ref(false)
function onAvatarError() {
  avatarFailed.value = true
}
// No fetches. Landing is fully zero-network.
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-landing {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  padding: 32px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.landing {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 64px;
  align-items: center;
  width: 100%;
}

// Avatar column
.avatar-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-frame {
  width: 240px;
  height: 240px;
  position: relative;
  padding: 4px;
  border-radius: 50%;
  background: linear-gradient(135deg, $accent-pink, $accent-purple);
  box-shadow: 0 8px 32px rgba(255, 133, 162, 0.30), 0 0 0 1px rgba(255, 255, 255, 0.4);
  transition: transform $transition-base;
}
.avatar-frame:hover { transform: translateY(-4px) rotate(-2deg); }
.avatar-frame__inner {
  width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
  background: $bg-card; position: relative;
}
.avatar-image {
  width: 100%; height: 100%; display: block;
  border-radius: 50%; object-fit: cover;
}
.avatar-fallback {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 6rem; font-weight: 700;
  background: linear-gradient(135deg, $accent-pink, $accent-purple);
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}
.avatar-status {
  position: absolute; right: 18px; bottom: 18px;
  width: 16px; height: 16px; border-radius: 50%;
  background: $accent-mint;
  box-shadow: 0 0 0 4px $bg-card, 0 0 12px rgba(129, 212, 196, 0.6);
  animation: pulse 2s infinite;
}
.avatar-status--hidden { display: none; }
.avatar-handle {
  margin-top: 18px; font-size: .9rem;
  color: $text-secondary; letter-spacing: .04em;
  text-align: center;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px $bg-card, 0 0 12px rgba(129, 212, 196, 0.6); }
  50%      { box-shadow: 0 0 0 6px $bg-card, 0 0 18px rgba(129, 212, 196, 0.9); }
}

// Intro column
.intro-zone { animation: slideIn 0.6s ease 0.1s both; }
@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.landing__name {
  font-size: clamp(2.4rem, 4vw, 3.4rem);
  font-weight: 700; line-height: 1.1;
  background: linear-gradient(135deg, $accent-pink, $accent-purple);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  margin: 0;
}
.landing__tagline {
  font-family: $font-mono;
  letter-spacing: .15em;
  color: $accent-pink;
  font-size: .92rem;
  text-transform: uppercase;
  margin-top: 12px;
}
.landing__bio {
  font-size: 1.05rem; line-height: 1.85;
  color: $text-secondary;
  max-width: 540px;
  margin: 24px 0 36px;
}
.landing__cta {
  display: flex; gap: 12px; flex-wrap: wrap;
}
.cta {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 12px 26px; border-radius: 10px;
  text-decoration: none; font-weight: 600; font-size: 1rem;
  transition: transform $transition-fast, box-shadow $transition-fast, background $transition-fast;
  cursor: pointer; border: 0;
}
.cta--primary {
  background: $accent-pink; color: #fff;
  box-shadow: 0 4px 16px rgba(255, 133, 162, 0.30);
}
.cta--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 133, 162, 0.45);
}
.cta--secondary {
  background: transparent;
  border: 1.5px solid $accent-pink;
  color: $accent-pink;
}
.cta--secondary:hover { background: rgba(255, 133, 162, 0.06); }

.landing__social {
  display: flex; gap: 24px;
  margin-top: 36px; list-style: none; padding: 0;
}
.landing__social a {
  display: inline-flex; align-items: center; gap: 8px;
  color: $text-secondary; text-decoration: none;
  font-size: .92rem;
  transition: color $transition-fast, transform $transition-fast;
}
.landing__social a:hover {
  color: $accent-pink; transform: translateY(-2px);
}

// Responsive
@media (max-width: 1023px) {
  .landing { grid-template-columns: 1fr; gap: 32px; text-align: center; }
  .avatar-frame { width: 180px; height: 180px; }
  .landing__bio { max-width: none; margin-left: auto; margin-right: auto; }
  .landing__cta { justify-content: center; }
  .landing__social { justify-content: center; }
}
@media (max-width: 767px) {
  .page-landing { padding: 24px 16px; }
  .avatar-frame { width: 120px; height: 120px; }
  .avatar-fallback { font-size: 3rem; }
  .landing__name { font-size: 2rem; }
  .landing__tagline { font-size: .8rem; }
}
@media (prefers-reduced-motion: reduce) {
  .avatar-status, .intro-zone { animation: none !important; }
}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- Landing.spec.js`
Expected: PASS — all 5 tests green.

- [ ] **Step 5: Run full test suite**

Run: `cd frontend && npm test`
Expected: PASS — all existing tests still pass, plus 3 new specs (Articles, AppHeader, Landing).

- [ ] **Step 6: Build to verify no compile errors**

Run: `cd frontend && npm run build`
Expected: Exit 0. `frontend/dist/index.html` and assets emitted. No SCSS compile errors.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/pages/Home.vue frontend/src/__tests__/Landing.spec.js
git commit -m "feat(home): rewrite Home.vue as pure Landing (no articles, zero network)"
```

---

### Task 4: End-to-end smoke + deploy

**Files:** none (smoke-only)

- [ ] **Step 1: Start dev server**

Run (background): `cd frontend && npm run dev`
Expected: Vite dev server starts on http://localhost:5173 (or similar).

Wait for "ready in" line.

- [ ] **Step 2: Manual smoke checklist**

Open browser, verify each item:
- [ ] `/` shows avatar, name "Zhou Jun", tagline, bio, two CTAs — **no article cards**
- [ ] Click 「📖 读文章 →」 → navigates to `/articles`, articles grid visible
- [ ] `/articles` shows pinned section, grid, pagination, SidePanel — visually identical to old Home
- [ ] Logo top-left reads 「个人博客」
- [ ] Nav: 首页 / 文章 (highlighted when on /articles) / 归档 / 分类 / ...
- [ ] Dark mode toggle: avatar border + name gradient + CTA primary render OK in both themes
- [ ] Resize to 375px: single column, avatar 120px, content centered
- [ ] DevTools Network tab on `/`: zero business requests (only static assets)

- [ ] **Step 3: Stop dev server**

Stop the background dev server.

- [ ] **Step 4: Final production build + deploy**

Run: `cd frontend && npm run build && bash frontend/deploy.sh`
Expected: `frontend/deploy.sh` posts the built `frontend/dist/` to GitHub Pages. Confirm via `git log --oneline -1` after deploy shows a new `deploy:` commit.

---

## Self-Review

**1. Spec coverage** — every requirement has a task:

| Spec requirement | Task |
|---|---|
| Step 1: Create Articles.vue (migrate Home content) | Task 1 |
| Step 2: Register `/articles` route | Task 1 |
| Step 3: Add 「文章」 nav, change logo to 「个人博客」 | Task 2 |
| Step 4: Rewrite Home.vue as Landing | Task 3 |
| Step 5: Dark mode via existing tokens | Task 3 (no new tokens) |
| Step 6: Old link compatibility — deferred per spec | Not implemented (deferred) |
| Acceptance: `/` shows no `.article-grid` | Task 3 test |
| Acceptance: `/articles` functional parity | Task 1 test |
| Acceptance: Nav order + logo text | Task 2 test |
| Acceptance: Dark mode | Task 4 manual smoke |
| Acceptance: Mobile ≤767 single column | Task 3 styles + Task 4 smoke |
| Acceptance: Build passes | Task 3 Step 6 |
| Performance: Landing zero HTTP | Task 4 Step 2 manual |

**2. Placeholder scan:** No "TBD"/"TODO"/"add appropriate"/"handle edge cases" anywhere. Every code step shows full code.

**3. Type / name consistency:**
- Route name: `Articles` (consistent in router Step 4, test imports Task 1).
- Class names: `.page-articles`, `.page-landing`, `.landing__name`, `.cta--primary` — match between template, test, and spec.
- Component imports: `ArticleCard` / `SidePanel` stubbed identically in Tasks 1 & 3.
