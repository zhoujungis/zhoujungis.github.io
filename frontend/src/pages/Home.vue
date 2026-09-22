<template>
  <div class="page page-landing">
    <!-- ── 刊头 Masthead ── -->
    <header class="masthead">
      <div class="masthead__main">
        <p class="masthead__kicker">ZhouJun · 深圳</p>
        <h1 class="masthead__name">代码与生活</h1>
        <p class="masthead__sub">写字、写码、写日常。</p>
        <div class="masthead__lede">
          <p class="lede__lead">代码的世界非黑即白，生活的画布斑驳陆离。</p>
          <p>我习惯在逻辑与语法的缝隙里敲下项目的迭代，让一行行冰冷的字符在编译中苏醒，长出骨骼与灵魂；也习惯在字里行间打捞生活的琐碎与诗意，将那些转瞬即逝的感动，揉进咖啡的余温和晚霞的褶皱里。</p>
          <p>世界很大，潮汐来去，我想把这些亲历的创造与感动，妥帖地存放于此。这里没有宏大的叙事，只有一行行代码的生长，和一个普通灵魂在尘世里，认真生活的痕迹。</p>
        </div>
      </div>
      <aside class="masthead__aside" aria-label="站点信息">
        <div class="aside-stat">
          <span class="aside-stat__value">{{ loading ? '…' : totalCount }}</span>
          <span class="aside-stat__label">篇文章</span>
        </div>
        <div v-if="lastUpdated" class="aside-stat">
          <span class="aside-stat__value aside-stat__value--date">{{ lastUpdated }}</span>
          <span class="aside-stat__label">最近更新</span>
        </div>
        <div class="aside-stat">
          <span class="aside-stat__value aside-stat__value--stack">Vue 3 × Django</span>
          <span class="aside-stat__label">技术栈</span>
        </div>
      </aside>
      <div class="masthead__bar">
        <router-link to="/articles" class="mast-cta">
          阅读文章
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </router-link>
        <nav class="masthead__nav" aria-label="更多入口">
          <a href="https://github.com/zhoujungis" target="_blank" rel="noopener" class="mast-nav-link">GitHub</a>
          <a href="mailto:no-reply@gmail.com" class="mast-nav-link">Email</a>
          <a href="https://zhoujun123.pythonanywhere.com/rss.xml" class="mast-nav-link">RSS</a>
        </nav>
      </div>
    </header>

    <!-- ── 头版：最新文章 ── -->
    <section class="front-section" aria-label="最新文章">
      <header class="section-head">
        <h2 class="section-title">最新文章</h2>
        <router-link to="/articles" class="section-more">
          全部文章
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </router-link>
      </header>

      <p v-if="cacheNotice && !loading" class="cache-notice" role="status">{{ cacheNotice }}</p>

      <div v-if="loading" class="front-skeleton" aria-hidden="true">
        <div class="front-skeleton__lead">
          <div class="sk sk-cover" />
          <div class="sk sk-line w-40" />
          <div class="sk sk-line w-90" />
          <div class="sk sk-line w-70" />
        </div>
        <div class="front-skeleton__list">
          <div v-for="i in 4" :key="i" class="sk-row">
            <div class="sk sk-line w-20" />
            <div class="sk sk-line w-80" />
          </div>
        </div>
      </div>

      <div v-else-if="loadError" class="front-plain">
        <p>{{ loadError }}</p>
        <button class="plain-retry" @click="fetchLatest">重试</button>
      </div>

      <div v-else-if="latestArticles.length" class="front-grid">
        <router-link :to="'/article/' + featured.slug" class="lead-story">
          <div v-if="featured.cover_image && !coverBroken[featured.slug]" class="lead-story__media">
            <img
              :src="featured.cover_image"
              :alt="featured.title"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              @error="coverBroken[featured.slug] = true"
            />
          </div>
          <div class="lead-story__body">
            <div class="story-meta">
              <span class="story-meta__date">{{ formatDate(featured.created_at) }}</span>
              <span v-if="featured.category" class="story-meta__sep" aria-hidden="true">·</span>
              <span v-if="featured.category" class="story-meta__cat">{{ catLabel(featured.category) }}</span>
              <span v-if="featured.reading_time" class="story-meta__sep" aria-hidden="true">·</span>
              <span v-if="featured.reading_time" class="story-meta__time">{{ featured.reading_time }} 分钟</span>
            </div>
            <h3 class="lead-story__title">{{ featured.title }}</h3>
            <p v-if="featured.excerpt" class="lead-story__excerpt">{{ featured.excerpt }}</p>
            <div v-if="featuredTags(featured).length" class="story-tags">
              <span v-for="t in featuredTags(featured).slice(0, 3)" :key="t" class="story-tag">{{ t }}</span>
            </div>
            <span class="read-line">阅读全文
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </div>
        </router-link>

        <ol class="index-list">
          <li v-for="article in restArticles" :key="article.slug || article.id" class="index-item">
            <router-link :to="'/article/' + article.slug" class="index-item__link">
              <time class="index-item__date">{{ formatDate(article.created_at) }}</time>
              <div class="index-item__main">
                <h3 class="index-item__title">
                  {{ article.title }}
                  <span v-if="article.is_top" class="index-item__pin">置顶</span>
                </h3>
                <p v-if="article.excerpt" class="index-item__excerpt">{{ article.excerpt }}</p>
              </div>
              <span class="index-item__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </router-link>
          </li>
        </ol>
      </div>

      <div v-else class="front-plain">
        <p>还没有发布文章，敬请期待</p>
      </div>
    </section>

    <!-- ── 专栏：最新项目 ── -->
    <section class="column-section" aria-label="最新项目">
      <header class="section-head">
        <h2 class="section-title">最新项目</h2>
        <a href="https://github.com/zhoujungis?tab=repositories" target="_blank" rel="noopener" class="section-more">
          GitHub
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
      </header>

      <div class="column-rows">
        <a v-for="(project, i) in projects" :key="project.slug" :href="project.url" target="_blank" rel="noopener" class="column-row">
          <span class="column-row__no">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="column-row__media">
            <img :src="project.cover" :alt="project.alt" loading="lazy" decoding="async" />
          </span>
          <span class="column-row__body">
            <span class="column-row__name">{{ project.name }}</span>
            <span class="column-row__strong">{{ project.strong }}</span>
            <span class="column-row__desc">{{ project.desc }}</span>
            <span class="column-row__meta">{{ project.meta }}</span>
          </span>
        </a>
      </div>
    </section>

    <!-- ── 封底导航 ── -->
    <nav class="colophon-nav" aria-label="快速浏览">
      <router-link to="/articles" class="colophon-link">
        <span class="colophon-link__index">01</span>
        <span class="colophon-link__text"><strong>技术文章</strong><small>AI、开发与工程实践</small></span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </router-link>
      <router-link to="/footprints" class="colophon-link">
        <span class="colophon-link__index">02</span>
        <span class="colophon-link__text"><strong>旅行足迹</strong><small>在地图上收藏见闻</small></span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </router-link>
      <router-link to="/photos" class="colophon-link">
        <span class="colophon-link__index">03</span>
        <span class="colophon-link__text"><strong>照片墙</strong><small>光影里的生活片段</small></span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { getArticles } from '@/api/articles'
import { resolveListFallback, saveListCache, cacheNoticeText } from '@/utils/articleCache'
import { catLabel, tagLabel } from '@/utils/labels'

const latestArticles = ref([])
const totalCount = ref(0)
const loading = ref(true)
const loadError = ref(null)
const cacheNotice = ref('')
const coverBroken = reactive({})

const featured = computed(() => latestArticles.value[0] || null)
const restArticles = computed(() => latestArticles.value.slice(1))

const lastUpdated = computed(() => {
  const first = latestArticles.value[0]
  if (!first?.created_at) return ''
  const d = new Date(first.created_at)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`
})

const projects = [
  {
    slug: 'block-world-3d',
    name: 'Block World 3D',
    url: 'https://block-world-3d.pages.dev/',
    cover: '/projects/block-world-3d.webp',
    alt: 'Block World 3D 游戏画面预览',
    strong: '把技术变成可以亲手进入的空间。',
    desc: '这是一个在浏览器里打开的 3D 方块世界。它不急着把所有功能解释清楚，而是先让人移动、观察、靠近和发现：空间关系本身就是反馈，视角变化本身就是交互。这个项目把注意力放在实时渲染、相机控制和空间感上，也是在尝试回答一个很简单的问题：网页除了展示内容，能不能直接变成一个可探索的地方？',
    meta: '体验关键词：空间感、即时交互、可探索 · 入口 block-world-3d.pages.dev',
  },
  {
    slug: 'devbox',
    name: 'DevBox',
    url: 'https://devbox-492.pages.dev/',
    cover: '/projects/devbox.webp',
    alt: 'DevBox 程序员工具箱界面预览',
    strong: '把日常用得上的小工具集中到一个页面。',
    desc: '这是一个面向程序员的工具箱，收录了四十多个开箱即用的小工具：编码、加密、网络、文本处理、生成器和速查表。所有计算默认在浏览器本地完成，数据不出机器。对我来说，它练习的是单页应用的即时反馈、键盘优先的交互方式，以及“零后端也能做完整产品”的边界。',
    meta: '体验关键词：快、免费、隐私优先 · 入口 devbox-492.pages.dev',
  },
]

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
  cacheNotice.value = ''
  try {
    const res = await getArticles({ page: 1, page_size: 20 })
    const list = res.data?.results || res.data || []
    totalCount.value = typeof res.data?.count === 'number' ? res.data.count : list.length
    const sorted = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    latestArticles.value = sorted.filter((a) => !a.is_top).slice(0, 5)
    saveListCache(list, totalCount.value)
  } catch (e) {
    // Backend down — fall back to the build-time snapshot / last cache so
    // the home page never renders an empty skeleton-only state.
    const fallback = await resolveListFallback({ page: 1, page_size: 20 })
    if (fallback?.results?.length) {
      const sorted = [...fallback.results].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      )
      totalCount.value = fallback.count
      latestArticles.value = sorted.filter((a) => !a.is_top).slice(0, 5)
      cacheNotice.value = cacheNoticeText[fallback.source] || ''
    } else {
      loadError.value = e?.response?.data?.detail || e.message || '加载失败'
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchLatest)
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

// 编辑刊物风：颜色全部走主题变量（明暗两套自动适配），
// 卡片全部拆除，用 hairline 细线与字号层级组织版面。
$serif: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', 'SimSun', serif;

.page-landing {
  width: min(100% - 48px, 1000px);
  margin-inline: auto;
  padding: 24px 0 12px;
}

// ── 刊头 ──
.masthead {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0 48px;
  align-items: stretch;
  padding-top: 20px;
  border-top: 4px solid var(--text-primary);
  animation: reveal 0.45s ease both;
}

.masthead__aside {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 0;
  padding-left: 32px;
  border-left: 1px solid var(--glass-border);
  text-align: right;
}

.aside-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  width: 100%;
  padding: 12px 0;
  border-bottom: 1px solid var(--glass-border);
  &:first-child { padding-top: 4px; }
  &:last-child { border-bottom: 0; padding-bottom: 4px; }
}

.aside-stat__value {
  color: var(--text-primary);
  font-family: $serif;
  font-size: 2.3rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.01em;
}

.aside-stat__value--date {
  font-family: $font-mono;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.aside-stat__value--stack {
  font-family: $font-mono;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.aside-stat__label {
  color: var(--text-secondary);
  font-family: $font-mono;
  font-size: 0.62rem;
  letter-spacing: 0.14em;
}

.masthead__kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--glass-border);
  color: var(--accent-secondary);
  font-family: $font-mono;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
}

.masthead__name {
  margin: 12px 0 0;
  color: var(--text-primary);
  font-family: $serif;
  font-size: clamp(1.9rem, 4vw, 2.9rem);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.01em;
}

.masthead__sub {
  margin: 8px 0 0;
  color: var(--accent-secondary);
  font-family: $serif;
  font-size: clamp(1.05rem, 2.2vw, 1.4rem);
  font-weight: 700;
  letter-spacing: 0.3em;
}

// 自述三句：题记式排版。
// 左侧一道向下渐隐的竖线做视觉锚点，首句用衬线 + 主色提上来当题眼，
// 后两句退成次级色，形成 1 + 2 的节奏，避免三行同重灰字糊成一片。
// max-width 用 em（≈633px）而不是原来的 56ch —— 56ch 对中文只有 ~412px，
// 最长那句 39 字会被折断；每句独占一行才是作者写下的节奏。
.masthead__lede {
  position: relative;
  max-width: 44em;
  margin: 20px 0 0;
  padding-left: 18px;
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.85;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 5px;
    bottom: 5px;
    width: 3px;
    background: linear-gradient(
      to bottom,
      var(--accent-secondary) 0%,
      var(--accent-secondary) 42%,
      transparent 100%
    );
  }

  p { margin: 0; }
  p + p { margin-top: 4px; }

  .lede__lead {
    margin-bottom: 9px;
    color: var(--text-primary);
    font-family: $serif;
    font-size: 1.06rem;
    font-weight: 700;
    line-height: 1.7;
    letter-spacing: 0.02em;
  }
}

.masthead__bar {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 26px;
  padding: 10px 0;
  border-top: 1px solid var(--glass-border);
  border-bottom: 1px solid var(--glass-border);
}

.masthead__nav {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.mast-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
  transition: color $transition-fast, border-color $transition-fast;
  svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.8; transition: transform $transition-fast; }
  &:hover {
    color: var(--accent);
    border-bottom-color: var(--accent);
    svg { transform: translateX(2px); }
  }
}

.mast-cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 22px;
  color: var(--page-bg);
  background: var(--accent);
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-decoration: none;
  transition: background $transition-fast, transform $transition-fast;
  svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.8; transition: transform $transition-fast; }
  &:hover {
    background: var(--accent-secondary);
    transform: translateY(-1px);
    svg { transform: translateX(3px); }
  }
}

// ── 版块标题 ──
.front-section {
  margin-top: 56px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 3px solid var(--text-primary);
}

.section-title {
  margin: 0;
  color: var(--text-primary);
  font-family: $serif;
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: 0.02em;
}

.section-more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
  transition: color $transition-fast, border-color $transition-fast;
  svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.8; transition: transform $transition-fast; }
  &:hover {
    color: var(--accent-secondary);
    border-bottom-color: var(--accent-secondary);
    svg { transform: translateX(2px); }
  }
}

// ── 头版头条 + 刊目 ──
.front-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 0 36px;
  align-items: start;
  animation: reveal 0.45s ease both;
}

.lead-story {
  display: block;
  margin-top: 20px;
  text-decoration: none;
  color: inherit;
}

.lead-story__media {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border: 1px solid var(--glass-border);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }
  &:hover img { transform: scale(1.03); }
}

.lead-story__body { padding-top: 14px; }

.story-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-family: $font-mono;
  font-size: 0.68rem;
  color: var(--text-secondary);
}
.story-meta__sep { opacity: 0.5; }
.story-meta__cat {
  color: var(--accent-secondary);
  font-weight: 700;
  letter-spacing: 0.06em;
}

.lead-story__title {
  margin: 8px 0 0;
  color: var(--text-primary);
  font-family: $serif;
  font-size: 1.45rem;
  font-weight: 900;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color $transition-fast;
}

.lead-story__excerpt {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 0.86rem;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.story-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }

.story-tag {
  padding: 1px 8px;
  color: var(--text-secondary);
  border: 1px solid var(--glass-border);
  font-family: $font-mono;
  font-size: 0.62rem;
  letter-spacing: 0.04em;
}

.read-line {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 12px;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 650;
  svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.8; transition: transform $transition-fast; }
}

.lead-story:hover {
  .lead-story__title { color: var(--accent); }
  .read-line svg { transform: translateX(3px); }
}

// 刊目：细线分隔的无卡片列表
.index-list {
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.index-item {
  border-top: 1px solid var(--glass-border);
  &:last-child { border-bottom: 1px solid var(--glass-border); }
}

.index-item__link {
  display: grid;
  grid-template-columns: 76px 1fr auto;
  gap: 12px;
  align-items: baseline;
  padding: 13px 4px;
  text-decoration: none;
  color: inherit;
  transition: background $transition-fast;
  &:hover { background: var(--surface-muted); }
  &:hover .index-item__title { color: var(--accent); }
  &:hover .index-item__arrow svg { transform: translateX(3px); }
}

.index-item__date {
  color: var(--text-secondary);
  font-family: $font-mono;
  font-size: 0.66rem;
  letter-spacing: 0.02em;
}

.index-item__title {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color $transition-fast;
}

.index-item__pin {
  display: inline-block;
  margin-left: 6px;
  padding: 0 6px;
  color: var(--accent-secondary);
  border: 1px solid var(--accent-secondary);
  font-size: 0.6rem;
  font-weight: 700;
  vertical-align: 2px;
}

.index-item__excerpt {
  margin: 4px 0 0;
  color: var(--text-secondary);
  font-size: 0.76rem;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.index-item__arrow {
  align-self: center;
  svg {
    display: block;
    width: 15px;
    height: 15px;
    fill: none;
    stroke: var(--text-secondary);
    stroke-width: 1.8;
    transition: transform $transition-fast, stroke $transition-fast;
  }
}

// ── 专栏：项目行 ──
.column-section {
  margin-top: 56px;
}

.column-rows {
  animation: reveal 0.45s ease both;
}

.column-row {
  display: grid;
  grid-template-columns: 56px 300px 1fr;
  gap: 20px;
  align-items: center;
  padding: 26px 0;
  border-top: 1px solid var(--glass-border);
  text-decoration: none;
  color: inherit;
  &:last-child { border-bottom: 1px solid var(--glass-border); }
  &:hover .column-row__name { color: var(--accent); }
  &:hover .column-row__media img { transform: scale(1.03); }
  &:hover .column-row__no { color: var(--accent); }
}

.column-row__no {
  color: var(--accent-secondary);
  font-family: $font-mono;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
  transition: color $transition-fast;
}

.column-row__media {
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border: 1px solid var(--glass-border);
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
}

.column-row__body {
  display: block;
  min-width: 0;
}

.column-row__name {
  display: block;
  color: var(--text-primary);
  font-family: $serif;
  font-size: 1.2rem;
  font-weight: 900;
  line-height: 1.2;
  transition: color $transition-fast;
}

.column-row__strong {
  display: block;
  margin-top: 6px;
  color: var(--text-primary);
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.5;
}

.column-row__desc {
  display: block;
  margin-top: 5px;
  color: var(--text-secondary);
  font-size: 0.82rem;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.column-row__meta {
  display: block;
  margin-top: 8px;
  color: var(--text-secondary);
  font-family: $font-mono;
  font-size: 0.64rem;
  letter-spacing: 0.03em;
  opacity: 0.9;
}

// ── 封底导航 ──
.colophon-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 64px;
  border-top: 3px solid var(--text-primary);
}

.colophon-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 14px;
  color: var(--text-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--glass-border);
  border-right: 1px solid var(--glass-border);
  transition: background $transition-fast;
  &:last-child { border-right: 0; }
  &:hover { background: var(--surface-muted); color: var(--accent); }
  &:hover svg { transform: translateX(3px); }
  svg { width: 15px; height: 15px; margin-left: auto; fill: none; stroke: currentColor; stroke-width: 1.8; transition: transform $transition-fast; flex-shrink: 0; }
}

.colophon-link__index {
  color: var(--accent-secondary);
  font-family: $font-mono;
  font-size: 0.64rem;
}

.colophon-link__text {
  strong { display: block; font-size: 0.86rem; }
  small { display: block; margin-top: 2px; color: var(--text-secondary); font-size: 0.68rem; }
}

// ── 提示 / 空态 / 错误 ──
.cache-notice {
  margin-top: 16px;
  padding: 8px 14px;
  color: var(--text-secondary);
  border-left: 3px solid var(--accent-secondary);
  font-size: 0.78rem;
  background: var(--surface-muted);
}

.front-plain {
  margin-top: 20px;
  padding: 26px 18px;
  text-align: center;
  color: var(--text-secondary);
  border: 1px dashed var(--glass-border);
}

.plain-retry {
  margin-top: 10px;
  padding: 6px 16px;
  color: var(--accent);
  background: none;
  border: 1px solid var(--accent);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: color $transition-fast, border-color $transition-fast;
  &:hover { color: var(--accent-secondary); border-color: var(--accent-secondary); }
}

// ── 骨架屏 ──
.front-skeleton {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 0 36px;
  margin-top: 20px;
}
.front-skeleton__lead, .front-skeleton__list { display: flex; flex-direction: column; gap: 10px; }
.sk {
  border-radius: 3px;
  background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-hi) 50%, var(--skeleton-base) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.sk-cover { height: 210px; }
.sk-line { height: 12px; }
.w-20 { width: 20%; } .w-40 { width: 40%; } .w-70 { width: 70%; } .w-80 { width: 80%; } .w-90 { width: 90%; }
.sk-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 13px 4px;
  border-top: 1px solid var(--glass-border);
}
.front-skeleton__list .sk-row:first-child { border-top: 0; padding-top: 0; }

@keyframes reveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

@media (prefers-reduced-motion: reduce) {
  .masthead, .front-grid, .column-rows { animation: none; }
  .sk { animation: none; }
  .lead-story__media img, .column-row__media img { transition: none; }
}

// ── 响应式 ──
@media (max-width: 899px) {
  .page-landing { width: min(100% - 32px, 720px); padding-top: 16px; }
  .masthead { grid-template-columns: 1fr; }
  .masthead__aside {
    flex-direction: row;
    justify-content: flex-start;
    align-items: baseline;
    gap: 28px;
    margin-top: 18px;
    padding-left: 0;
    border-left: 0;
    text-align: left;
  }
  .aside-stat { flex-direction: row; align-items: baseline; gap: 8px; width: auto; padding: 0; border-bottom: 0; }
  .aside-stat__value { font-size: 1.5rem; }
  .front-grid, .front-skeleton { grid-template-columns: 1fr; gap: 0; }
  .front-skeleton__list { margin-top: 10px; }
  .column-row { grid-template-columns: 40px 1fr; }
  .column-row__body { grid-column: 1 / -1; }
  .colophon-nav { grid-template-columns: 1fr; }
  .colophon-link { border-right: 0; }
  .colophon-link:last-child { border-bottom: 0; }
}

@media (max-width: 520px) {
  .page-landing { width: calc(100% - 24px); }
  // 标题字号交给上面的 clamp 统一控制，这里不再覆盖（原 2.5rem 会比 clamp 下限还大）
  .masthead__sub { letter-spacing: 0.14em; }
  .masthead__aside { gap: 20px; }
  .aside-stat__value { font-size: 1.2rem; }
  // 移动端保持单行：阅读文章 CTA 在左，GitHub/Email/RSS 在右。
  // 收窄 CTA 内边距与社交入口间距，保证 320px 宽也不换行。
  .masthead__bar { gap: 10px; }
  .masthead__nav { gap: 12px; }
  .mast-cta { padding: 8px 16px; letter-spacing: 0.04em; }
  .index-item__link { grid-template-columns: 1fr auto; }
  .index-item__date { grid-column: 1 / -1; order: -1; }
  .column-row { grid-template-columns: 1fr; gap: 12px; padding: 18px 0; }
  .column-row__no { font-size: 1.2rem; }
  .section-title { font-size: 1.25rem; }
  .lead-story__title { font-size: 1.2rem; }
}
</style>
