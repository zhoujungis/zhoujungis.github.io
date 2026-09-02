<template>
  <div class="page page-landing">
    <section class="hero">
      <p class="hero__eyebrow">个人博客 · 深圳</p>
      <div class="hero__main">
        <div class="hero__stats" aria-label="站点信息">
          <div class="stat">
              <span class="stat__index">01</span>
              <span class="stat__label">Articles</span>
              <span class="stat__value">{{ loadError ? '—' : loading ? '…' : `${totalCount} 篇` }}</span>
            </div>
          <div class="stat">
            <span class="stat__index">02</span>
            <span class="stat__label">Live Builds</span>
            <span class="stat__value">GitHub Pages · PythonAnywhere</span>
          </div>
          <div class="stat">
            <span class="stat__index">03</span>
            <span class="stat__label">Stack</span>
            <span class="stat__value">Vue 3 · Django · Vite</span>
          </div>
          <div class="stat">
            <span class="stat__index">04</span>
            <span class="stat__label">Focus</span>
            <span class="stat__value">AI · 全栈 · 写作</span>
          </div>
        </div>
        <div class="hero__side">
          <div class="hero__actions">
            <router-link to="/articles" class="cta cta--primary">
              阅读文章
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </router-link>
            <router-link to="/about" class="cta cta--secondary">认识我</router-link>
          </div>
          <div class="hero__social">
            <a href="https://github.com/zhoujungis" target="_blank" rel="noopener" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.57-.3-5.27-1.29-5.27-5.69 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.47.11-3.06 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.28 5.68.42.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" /></svg>
              GitHub
            </a>
            <a href="mailto:no-reply@gmail.com" aria-label="Email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
              Email
            </a>
            <a href="https://zhoujun123.pythonanywhere.com/rss.xml" aria-label="RSS">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="5" cy="19" r="1" fill="currentColor" /><path d="M4 11a9 9 0 0 1 9 9M4 5a15 15 0 0 1 15 15" /></svg>
              RSS
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="live-section" aria-label="Live builds">
      <header class="live-head">
        <div>
          <p class="live-eyebrow">LIVE BUILDS</p>
          <h2 class="live-title">最新项目</h2>
        </div>
        <a href="https://github.com/zhoujungis?tab=repositories" target="_blank" rel="noopener" class="live-more">GitHub →</a>
      </header>
      <div class="live-grid">
        <a href="https://happy-games.pages.dev/" target="_blank" rel="noopener" class="live-card">
          <div class="live-card__head">
            <h3 class="live-card__title">01 / Happy Games</h3>
            <span class="live-card__badges">
              <img src="https://img.shields.io/badge/OPEN_LIVE-FF8066?style=flat-square&logo=googlechrome&logoColor=white" alt="Open Happy Games live demo" loading="lazy" />
              <img src="https://img.shields.io/badge/GITHUB_SOURCE-29363A?style=flat-square&logo=github&logoColor=white" alt="Open GitHub source list" loading="lazy" />
            </span>
          </div>
          <p class="live-card__strong">把“打开就玩”当作第一条产品原则。</p>
          <p class="live-card__desc">这个站点把注意力放在游戏本身，而不是复杂的入口和说明上。它更像一个持续收集中的网页游戏实验室：每一次点击都应该尽快得到反馈，每一个小玩法都可以独立成立。对我来说，它练习的是交互节奏、状态反馈和“让用户马上开始”的取舍。</p>
          <p class="live-card__meta">体验关键词：轻量、即时、可重复游玩。<br />入口：happy-games.pages.dev</p>
        </a>
        <a href="https://halo-music.pages.dev/" target="_blank" rel="noopener" class="live-card">
          <div class="live-card__head">
            <h3 class="live-card__title">02 / Halo Music</h3>
            <span class="live-card__badges">
              <img src="https://img.shields.io/badge/OPEN_LIVE-8B78B3?style=flat-square&logo=googlechrome&logoColor=white" alt="Open Halo Music live demo" loading="lazy" />
              <img src="https://img.shields.io/badge/GITHUB_SOURCE-29363A?style=flat-square&logo=github&logoColor=white" alt="Open GitHub source list" loading="lazy" />
            </span>
          </div>
          <p class="live-card__strong">让音乐成为界面里的主角。</p>
          <p class="live-card__desc">这个项目围绕“发现并听下去”来组织页面，不把音乐压缩成一排冷冰冰的文件名。视觉、播放控制和内容浏览需要互相让路：用户可以快速找到想听的内容，也可以顺着氛围继续探索。它更关注听觉内容如何决定页面节奏，以及播放器如何保持存在感但不打断体验。</p>
          <p class="live-card__meta">体验关键词：沉浸、连续、内容优先。<br />入口：halo-music.pages.dev</p>
        </a>
        <a href="https://routewise-ai.pages.dev/" target="_blank" rel="noopener" class="live-card">
          <div class="live-card__head">
            <h3 class="live-card__title">03 / Routewise AI</h3>
            <span class="live-card__badges">
              <img src="https://img.shields.io/badge/OPEN_LIVE-4B86AB?style=flat-square&logo=googlechrome&logoColor=white" alt="Open Routewise AI live demo" loading="lazy" />
              <img src="https://img.shields.io/badge/GITHUB_SOURCE-29363A?style=flat-square&logo=github&logoColor=white" alt="Open GitHub source list" loading="lazy" />
            </span>
          </div>
          <p class="live-card__strong">把一堆出行信息整理成下一步行动。</p>
          <p class="live-card__desc">路线规划真正麻烦的地方，通常不是找不到地点，而是不知道怎样把目的地、时间和个人偏好组合成一条愿意执行的路线。这个项目尝试把 AI 放在“整理和取舍”的位置：先理解用户想怎么走，再把建议变成更清晰的安排。它练习的是输入如何变成上下文、建议如何保持可解释，以及自动化和人的判断如何共同完成决策。</p>
          <p class="live-card__meta">体验关键词：降低规划摩擦、建议可执行、保留人的选择。<br />入口：routewise-ai.pages.dev</p>
        </a>
        <a href="https://block-world-3d.pages.dev/" target="_blank" rel="noopener" class="live-card">
          <div class="live-card__head">
            <h3 class="live-card__title">04 / Block World 3D</h3>
            <span class="live-card__badges">
              <img src="https://img.shields.io/badge/OPEN_LIVE-B7E36B?style=flat-square&logo=googlechrome&logoColor=172127" alt="Open Block World 3D live demo" loading="lazy" />
              <img src="https://img.shields.io/badge/GITHUB_SOURCE-29363A?style=flat-square&logo=github&logoColor=white" alt="Open GitHub source list" loading="lazy" />
            </span>
          </div>
          <p class="live-card__strong">把技术变成可以亲手进入的空间。</p>
          <p class="live-card__desc">这是一个在浏览器里打开的 3D 方块世界。它不急着把所有功能解释清楚，而是先让人移动、观察、靠近和发现：空间关系本身就是反馈，视角变化本身就是交互。这个项目把注意力放在实时渲染、相机控制和空间感上，也是在尝试回答一个很简单的问题：网页除了展示内容，能不能直接变成一个可探索的地方？</p>
          <p class="live-card__meta">体验关键词：空间感、即时交互、可探索。<br />入口：block-world-3d.pages.dev</p>
        </a>
      </div>
    </section>

    <section class="latest-section" aria-label="最新文章">
      <header class="latest-head">
        <div class="latest-head__left">
          <p class="latest-eyebrow">LATEST WRITINGS</p>
          <h2 class="latest-title">最新文章</h2>
        </div>
        <router-link to="/articles" class="latest-more">
          查看全部
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </router-link>
      </header>

      <div v-if="loading" class="latest-skeleton" aria-hidden="true">
        <div class="latest-skeleton__featured">
          <div class="sk sk-cover" />
          <div class="sk sk-line w-80" />
          <div class="sk sk-line w-60" />
        </div>
        <div class="latest-skeleton__list">
          <div v-for="i in 4" :key="i" class="sk-item">
            <div class="sk sk-line w-30" />
            <div class="sk sk-line w-90" />
          </div>
        </div>
      </div>

      <div v-else-if="loadError" class="latest-error">
        <p>{{ loadError }}</p>
        <button class="latest-retry" @click="fetchLatest">重试</button>
      </div>

      <div v-else-if="latestArticles.length" class="latest-grid">
        <router-link :to="'/article/' + featured.slug" class="latest-featured">
          <div v-if="featured.cover_image && !coverBroken[featured.slug]" class="latest-featured__cover">
            <img :src="featured.cover_image" :alt="featured.title" loading="lazy" decoding="async" @error="coverBroken[featured.slug] = true" />
          </div>
          <div class="latest-featured__body">
            <div class="latest-featured__meta">
              <span class="meta-date">{{ formatDate(featured.created_at) }}</span>
              <span v-if="featured.category" class="meta-dot" aria-hidden="true">·</span>
              <span v-if="featured.category" class="meta-category">{{ catLabel(featured.category) }}</span>
              <span v-if="featured.reading_time" class="meta-dot" aria-hidden="true">·</span>
              <span v-if="featured.reading_time" class="meta-time">{{ featured.reading_time }} 分钟</span>
            </div>
            <h3 class="latest-featured__title">{{ featured.title }}</h3>
            <p v-if="featured.excerpt" class="latest-featured__excerpt">{{ featured.excerpt }}</p>
            <div v-if="featuredTags(featured).length" class="latest-featured__tags">
              <span v-for="t in featuredTags(featured).slice(0, 3)" :key="t" class="mini-tag">{{ t }}</span>
            </div>
          </div>
        </router-link>

        <div class="latest-list">
          <router-link v-for="article in restArticles" :key="article.slug || article.id" :to="'/article/' + article.slug" class="latest-item">
            <div class="latest-item__top">
              <time class="latest-item__date">{{ formatDate(article.created_at) }}</time>
              <span v-if="article.category" class="latest-item__cat">{{ catLabel(article.category) }}</span>
              <span v-if="article.is_top" class="latest-item__pin">置顶</span>
            </div>
            <h3 class="latest-item__title">{{ article.title }}</h3>
            <p v-if="article.excerpt" class="latest-item__excerpt">{{ article.excerpt }}</p>
            <div class="latest-item__foot">
              <span v-if="article.reading_time" class="latest-item__reading">{{ article.reading_time }} 分钟</span>
              <span class="latest-item__arrow" aria-hidden="true">→</span>
            </div>
          </router-link>
        </div>
      </div>

      <div v-else class="latest-empty">
        <p>还没有发布文章，敬请期待</p>
        <router-link to="/about" class="latest-empty__link">认识作者 →</router-link>
      </div>
    </section>

    <nav class="explore-strip" aria-label="快速浏览">
      <router-link to="/articles" class="explore-link">
        <span class="explore-link__index">01</span>
        <span><strong>技术文章</strong><small>AI、开发与工程实践</small></span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </router-link>
      <router-link to="/footprints" class="explore-link">
        <span class="explore-link__index">02</span>
        <span><strong>旅行足迹</strong><small>在地图上收藏见闻</small></span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </router-link>
      <router-link to="/photos" class="explore-link">
        <span class="explore-link__index">03</span>
        <span><strong>照片墙</strong><small>光影里的生活片段</small></span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { getArticles } from '@/api/articles'
import { catLabel, tagLabel } from '@/utils/labels'

const latestArticles = ref([])
const totalCount = ref(0)
const loading = ref(true)
const loadError = ref(null)
const coverBroken = reactive({})

const featured = computed(() => latestArticles.value[0] || null)
const restArticles = computed(() => latestArticles.value.slice(1))

function featuredTags(article) {
  if (!article?.tags || !Array.isArray(article.tags)) return []
  return article.tags.map(tagLabel).filter(Boolean)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

async function fetchLatest() {
  loading.value = true
  loadError.value = null
  try {
    const res = await getArticles({ page: 1, page_size: 5, ordering: '-created_at' })
    const list = res.data?.results || res.data || []
    totalCount.value = typeof res.data?.count === 'number' ? res.data.count : list.length
    const sorted = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    latestArticles.value = sorted.slice(0, 5)
  } catch (e) {
    loadError.value = e?.response?.data?.detail || e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(fetchLatest)
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-landing {
  width: min(100% - 48px, 1160px);
  margin-inline: auto;
  padding: 16px 0 12px;
}

.hero {
  width: 100%;
  max-width: none;
  padding: 6px 0 0;
  animation: reveal 0.45s ease both;
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  color: $accent-purple;
  font-family: $font-mono;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  &::before { content: ''; width: 22px; height: 1px; background: currentColor; }
}

.landing__name {
  margin: 10px 0 8px;
  color: $text-primary;
  font-size: clamp(2.4rem, 4.5vw, 3.6rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}

.hero__tagline {
  color: $text-primary;
  font-size: clamp(1.05rem, 1.8vw, 1.35rem);
  font-weight: 600;
  line-height: 1.35;
  margin-top: 10px;
}

.hero__bio {
  margin: 8px 0 0;
  color: $text-secondary;
  font-size: 0.88rem;
  line-height: 1.65;
}

.hero__main {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 16px;
  align-items: stretch;
  margin-top: 12px;
}

.hero__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  height: 100%;
  align-content: center;
}

.hero__side {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  align-items: stretch;
  background: $bg-card;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
  overflow: hidden;
  height: 100%;
}

.hero__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 10px;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: $radius-md;
  font-size: 0.84rem;
  font-weight: 650;
  text-decoration: none;
  white-space: nowrap;
  transition: transform $transition-fast, background $transition-fast, border-color $transition-fast, box-shadow $transition-fast;
  svg { width: 16px; height: 16px; margin-left: 8px; fill: none; stroke: currentColor; stroke-width: 1.8; flex-shrink: 0; }
  &:hover { transform: translateY(-1px); }
}
.cta--primary {
  color: #fff;
  background: $accent-pink;
  box-shadow: 0 6px 14px rgba($accent-pink, 0.18);
  &:hover { color: #fff; background: #315544; }
}
.cta--secondary {
  color: $accent-pink;
  background: rgba($accent-pink, 0.06);
  border-color: rgba($accent-pink, 0.36);
  &:hover { background: rgba($accent-pink, 0.11); border-color: rgba($accent-pink, 0.5); }
}

.hero__social {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-top: 1px solid $glass-border;
  background: $bg-secondary;
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px 6px;
    color: $text-secondary;
    font-size: 0.74rem;
    font-weight: 550;
    text-decoration: none;
    white-space: nowrap;
    border-right: 1px solid $glass-border;
    &:last-child { border-right: 0; }
    svg { width: 14px; height: 14px; }
    &:hover { color: $accent-pink; background: $bg-card; }
  }
}

.stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 14px 11px;
  min-height: 84px;
  background: $bg-card;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
  min-width: 0;
}

.stat__index {
  font-family: $font-mono;
  font-size: 0.6rem;
  color: $accent-purple;
  line-height: 1;
}

.stat__label {
  font-family: $font-mono;
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  color: $text-secondary;
  text-transform: uppercase;
  line-height: 1;
}

.stat__value {
  font-size: 0.76rem;
  font-weight: 650;
  color: $text-primary;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// ── Work mode (32/68 表格重构) ──
.work-section {
  margin-top: 14px;
  border: 1px solid $glass-border;
  background: $bg-card;
  border-radius: $radius-md;
  overflow: hidden;
}

.work-head {
  padding: 14px 20px 12px;
  background: $bg-secondary;
  border-bottom: 1px solid $glass-border;
}

.work-eyebrow {
  font-family: $font-mono;
  font-size: 0.64rem;
  letter-spacing: 0.14em;
  color: $accent-purple;
  font-weight: 700;
}

.work-title {
  margin-top: 4px;
  font-size: 1.45rem;
  font-weight: 800;
  color: $text-primary;
  line-height: 1.1;
}

.work-grid {
  display: grid;
  grid-template-columns: 32% 68%;
  min-height: 220px;
}

.work-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 18px;
  background: $bg-secondary;
  border-right: 1px solid $glass-border;
}

.work-big {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: $text-primary;
  margin: 10px 0 6px;
}

.work-cn {
  font-size: 0.92rem;
  font-weight: 700;
  color: $accent-purple;
  letter-spacing: 0.12em;
  margin-bottom: 8px;
}

.work-right {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.work-kicker {
  font-family: $font-mono;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  color: $accent-purple;
  font-weight: 600;
  text-transform: uppercase;
}

.work-h3 {
  margin: 6px 0 8px;
  font-size: 0.98rem;
  font-weight: 750;
  color: $text-primary;
  line-height: 1.4;
}

.work-p {
  font-size: 0.84rem;
  line-height: 1.65;
  color: $text-secondary;
}

.work-codes {
  margin-top: 8px;
  line-height: 1.9;
  code {
    display: inline-block;
    padding: 1px 7px;
    margin: 2px 3px 2px 0;
    background: rgba($accent-pink, 0.08);
    border: 1px solid rgba($accent-pink, 0.14);
    border-radius: 999px;
    font-family: $font-mono;
    font-size: 0.66rem;
    color: $accent-pink;
  }
}

.work-sub {
  margin-top: 6px;
  font-family: $font-mono;
  font-size: 0.62rem;
  color: $text-secondary;
  opacity: 0.9;
  line-height: 1.5;
}

.work-hr {
  border: 0;
  height: 1px;
  background: $glass-border;
  margin: 14px 0;
}

// ── Live builds ──
.live-section {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid $glass-border;
}

.live-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 14px;
}

.live-eyebrow {
  font-family: $font-mono;
  font-size: 0.64rem;
  letter-spacing: 0.14em;
  color: $accent-purple;
  font-weight: 700;
}

.live-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: $text-primary;
  line-height: 1.1;
}

.live-subtitle {
  margin-top: 4px;
  font-size: 0.82rem;
  color: $text-secondary;
}

.live-more {
  flex-shrink: 0;
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid rgba($accent-pink, 0.18);
  background: rgba($accent-pink, 0.07);
  color: $accent-pink;
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  &:hover { background: rgba($accent-pink, 0.12); }
}

.live-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.live-card {
  display: block;
  padding: 14px 16px;
  background: $bg-card;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
  text-decoration: none;
  color: inherit;
  transition: transform $transition-fast, box-shadow $transition-fast, border-color $transition-fast;
  &:hover { transform: translateY(-2px); border-color: rgba($accent-pink, 0.26); box-shadow: $card-shadow-hover; }
  &:hover .live-card__title { color: $accent-pink; }
}

.live-card__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.live-card__title {
  font-size: 0.9rem;
  font-weight: 750;
  color: $text-primary;
  transition: color $transition-fast;
}

.live-card__badges {
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
  img { height: 20px; }
}

.live-card__strong {
  font-size: 0.84rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 6px;
  line-height: 1.5;
}

.live-card__desc {
  font-size: 0.82rem;
  line-height: 1.65;
  color: $text-secondary;
}

.live-card__meta {
  margin-top: 8px;
  font-family: $font-mono;
  font-size: 0.66rem;
  line-height: 1.5;
  color: $text-secondary;
  opacity: 0.9;
}

// ── Latest：紧凑上移 ──
.latest-section {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid $glass-border;
}

.latest-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.latest-eyebrow {
  color: $accent-purple;
  font-family: $font-mono;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  margin-bottom: 4px;
}

.latest-title {
  color: $text-primary;
  font-size: 1.45rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.latest-more {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  padding: 7px 12px;
  color: $accent-pink;
  background: rgba($accent-pink, 0.07);
  border: 1px solid rgba($accent-pink, 0.18);
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background $transition-fast, border-color $transition-fast, transform $transition-fast;
  svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.8; transition: transform $transition-fast; }
  &:hover { background: rgba($accent-pink, 0.12); border-color: rgba($accent-pink, 0.32); transform: translateY(-1px); }
  &:hover svg { transform: translateX(2px); }
}

.latest-grid {
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: 16px;
  align-items: start;
}

.latest-featured {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: $bg-card;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
  text-decoration: none;
  color: inherit;
  transition: transform $transition-base, box-shadow $transition-base, border-color $transition-base;
  &:hover { transform: translateY(-2px); border-color: rgba($accent-pink, 0.28); box-shadow: $card-shadow-hover; }
  &:hover .latest-featured__cover img { transform: scale(1.03); }
  &:hover .latest-featured__title { color: $accent-pink; }
}

.latest-featured__cover {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: $bg-secondary;
  img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
}

.latest-featured__body { padding: 14px 16px 16px; }

.latest-featured__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
  font-family: $font-mono;
  font-size: 0.68rem;
  color: $text-secondary;
}
.meta-dot { opacity: 0.5; }
.meta-category { color: $accent-purple; font-weight: 700; }

.latest-featured__title {
  color: $text-primary;
  font-size: 1.1rem;
  font-weight: 750;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color $transition-fast;
}

.latest-featured__excerpt {
  margin-top: 6px;
  color: $text-secondary;
  font-size: 0.84rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.latest-featured__tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
.mini-tag {
  padding: 2px 8px;
  color: #6e765f;
  background: #f2f3ec;
  border: 1px solid #e1e4d9;
  border-radius: 999px;
  font-size: 0.64rem;
}

.latest-list { display: flex; flex-direction: column; gap: 10px; }

.latest-item {
  display: block;
  padding: 12px 14px;
  background: $bg-card;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
  text-decoration: none;
  color: inherit;
  transition: border-color $transition-fast, box-shadow $transition-fast, transform $transition-fast;
  &:hover { border-color: rgba($accent-pink, 0.26); box-shadow: 0 6px 16px rgba(31, 42, 36, 0.06); transform: translateY(-1px); }
  &:hover .latest-item__title { color: $accent-pink; }
  &:hover .latest-item__arrow { transform: translateX(3px); }
}

.latest-item__top {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 6px;
  font-family: $font-mono;
  font-size: 0.66rem;
}
.latest-item__date { color: $text-secondary; }
.latest-item__cat {
  padding: 1px 7px;
  color: $accent-purple;
  background: rgba($accent-purple, 0.08);
  border: 1px solid rgba($accent-purple, 0.18);
  border-radius: 999px;
  font-weight: 700;
}
.latest-item__pin {
  padding: 1px 6px;
  color: #fff;
  background: $neon-pink;
  border-radius: 999px;
  font-weight: 700;
}

.latest-item__title {
  color: $text-primary;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color $transition-fast;
}
.latest-item__excerpt {
  margin-top: 4px;
  color: $text-secondary;
  font-size: 0.78rem;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.latest-item__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  font-family: $font-mono;
  font-size: 0.68rem;
  color: $text-secondary;
}
.latest-item__arrow { transition: transform $transition-fast; }

// skeleton / error / empty - 紧凑
.latest-skeleton { display: grid; grid-template-columns: 1.08fr 0.92fr; gap: 16px; }
.latest-skeleton__featured, .latest-skeleton__list { display: flex; flex-direction: column; gap: 10px; }
.sk {
  border-radius: 8px;
  background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-hi) 50%, var(--skeleton-base) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.sk-cover { height: 168px; }
.sk-line { height: 12px; }
.w-30 { width: 30%; } .w-60 { width: 60%; } .w-80 { width: 80%; } .w-90 { width: 90%; }
.sk-item {
  padding: 12px 14px;
  background: $bg-card;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.latest-error {
  text-align: center;
  padding: 18px;
  color: $text-secondary;
  background: $bg-card;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
}
.latest-retry {
  margin-top: 10px;
  padding: 6px 14px;
  color: $accent-pink;
  background: rgba($accent-pink, 0.08);
  border: 1px solid rgba($accent-pink, 0.22);
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: rgba($accent-pink, 0.14); }
}
.latest-empty {
  text-align: center;
  padding: 22px;
  color: $text-secondary;
  background: $bg-card;
  border: 1px dashed $glass-border;
  border-radius: $radius-md;
}
.latest-empty__link { display: inline-block; margin-top: 8px; font-weight: 600; }

// ── Explore：收紧为细条 ──
.explore-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 20px;
  border-top: 1px solid $glass-border;
  border-bottom: 1px solid $glass-border;
}
.explore-link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  min-height: 68px;
  padding: 12px 16px;
  color: $text-primary;
  border-right: 1px solid $glass-border;
  &:last-child { border-right: 0; }
  &:hover { color: $accent-pink; background: rgba($accent-pink, 0.035); }
  > svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; transition: transform $transition-fast; }
  &:hover > svg { transform: translateX(3px); }
  strong, small { display: block; }
  strong { font-size: 0.86rem; }
  small { margin-top: 2px; color: $text-secondary; font-size: 0.68rem; }
}
.explore-link__index { color: $accent-purple; font-family: $font-mono; font-size: 0.64rem; }

@keyframes reveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

@media (max-width: 899px) {
  .page-landing { width: min(100% - 32px, 720px); padding-top: 22px; }
  .hero { max-width: none; }
  .hero__main { grid-template-columns: 1fr; gap: 16px; }
  .hero__right { align-items: flex-start; width: 100%; }
  .hero__actions { justify-content: flex-start; gap: 8px; }
  .hero__social { justify-content: flex-start; }
  .hero__stats { width: 100%; }
  .work-grid { grid-template-columns: 1fr; }
  .work-left { border-right: 0; border-bottom: 1px solid $glass-border; }
  .live-grid { grid-template-columns: 1fr; }
  .latest-grid, .latest-skeleton { grid-template-columns: 1fr; }
  .latest-head { align-items: center; }
  .explore-strip { grid-template-columns: 1fr; margin-top: 18px; }
  .explore-link { min-height: 62px; border-right: 0; border-bottom: 1px solid $glass-border; }
  .explore-link:last-child { border-bottom: 0; }
}

@media (max-width: 520px) {
  .page-landing { width: calc(100% - 22px); padding: 18px 0 16px; }
  .landing__name { font-size: 2.2rem; }
  .hero__tagline { font-size: 1rem; }
  .hero__bio { font-size: 0.84rem; }
  .hero__actions { flex-wrap: wrap; }
  .cta { min-height: 36px; padding-inline: 12px; font-size: 0.8rem; }
  .hero__social { gap: 10px; }
  .latest-section { margin-top: 18px; padding-top: 16px; }
  .latest-title { font-size: 1.25rem; }
  .latest-featured__title { font-size: 1rem; }
  .explore-link { padding: 10px 12px; }
}
</style>
