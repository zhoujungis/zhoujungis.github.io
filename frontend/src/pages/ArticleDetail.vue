<template>
  <div class="page page-article-detail">
    <!-- Top reading progress bar -->
    <div
      class="reading-progress-bar"
      :style="{ width: scrollPercent + '%' }"
      aria-hidden="true"
    />
    <!-- Loading skeleton -->
    <div v-if="loading" class="detail-skeleton">
      <div class="skeleton-header">
        <div class="skeleton-line w-80 skeleton-lg" />
        <div class="skeleton-meta-row">
          <div class="skeleton-line w-20" />
          <div class="skeleton-line w-15" />
          <div class="skeleton-line w-10" />
        </div>
      </div>
      <div class="skeleton-body">
        <div class="skeleton-line w-100" />
        <div class="skeleton-line w-100" />
        <div class="skeleton-line w-90" />
        <div class="skeleton-line w-100" />
        <div class="skeleton-line w-70" />
      </div>
    </div>

    <!-- Error / 404 state -->
    <div v-else-if="error" class="error-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h2>{{ httpStatus === 404 ? '文章不存在' : '加载失败' }}</h2>
      <p>{{ error }}</p>
      <router-link to="/articles" class="back-link">返回首页</router-link>
    </div>

    <!-- Article content -->
    <template v-else-if="article">
      <div class="detail-layout">
        <article class="detail-main">
          <!-- Article header -->
          <header class="article-header">
            <h1 class="article-title">{{ article.title }}</h1>

            <div class="article-meta">
              <!-- Author -->
              <span class="meta-item meta-author">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {{ authorName }}
              </span>

              <!-- Date -->
              <span class="meta-item meta-date">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {{ formattedDate }}
              </span>

              <!-- Category — 有对应专题时直接链到聚合页，给专题页导权重 -->
              <router-link
                v-if="article.category && topic"
                :to="topicPath(topic.slug)"
                class="meta-item meta-category"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                {{ categoryName }}
              </router-link>
              <span v-else-if="article.category" class="meta-item meta-category">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                {{ categoryName }}
              </span>

              <!-- Reading time -->
              <span class="meta-item meta-reading-time">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                约 {{ readingTime }} 分钟
              </span>

              <!-- Views -->
              <span class="meta-item meta-views">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {{ article.views_count || 0 }}
              </span>
            </div>

            <!-- Tags -->
            <div v-if="tagList.length" class="article-tags">
              <span
                v-for="(tag, idx) in tagList"
                :key="idx"
                class="tag-pill"
              >{{ tag }}</span>
            </div>
          </header>

          <!-- Cover image -->
          <div v-if="article.cover_image" class="article-cover">
            <img :src="article.cover_image" :alt="article.title" />
          </div>

          <!-- Markdown body. `title` lets MarkdownView drop a leading <h1>
               that just repeats .article-title above. -->
          <MarkdownView
            :html="article.html_content || article.content || ''"
            :title="article.title"
          />

          <!-- Prev / Next navigation -->
          <nav v-if="article.prev_article || article.next_article" class="article-nav">
            <router-link
              v-if="article.prev_article"
              :to="'/article/' + (article.prev_article.slug || article.prev_article)"
              class="nav-link prev-link"
            >
              <span class="nav-direction">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                上一篇
              </span>
              <span class="nav-title">{{ article.prev_article.title || article.prev_article }}</span>
            </router-link>

            <router-link
              v-if="article.next_article"
              :to="'/article/' + (article.next_article.slug || article.next_article)"
              class="nav-link next-link"
            >
              <span class="nav-direction">
                下一篇
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>
              <span class="nav-title">{{ article.next_article.title || article.next_article }}</span>
            </router-link>
          </nav>

          <!-- Share + Like -->
          <div class="article-actions">
            <ShareButtons :title="article.title" :url="currentUrl" />
            <button
              class="like-btn"
              :class="{ liked }"
              :disabled="liking"
              @click="handleLike"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span>{{ article.likes_count || 0 }}</span>
            </button>
          </div>

          <!-- 专题入口：把单篇文章的权重导向对应的聚合页（Cluster Page） -->
          <router-link v-if="topic" :to="topicPath(topic.slug)" class="topic-cta">
            <span class="topic-cta-kicker">{{ topic.en }}</span>
            <strong class="topic-cta-name">{{ topic.name }}</strong>
            <span class="topic-cta-desc">{{ topic.tagline }}</span>
            <span class="topic-cta-arrow">查看专题 →</span>
          </router-link>

          <!-- Related Articles -->
          <RelatedArticles :articles="article.related_articles || []" />

          <!-- 算法题解 → 硬核专题：题解是站点目前唯一能被搜到的入口，把
               这部分流量显式导向 AI Agent / 数据库内核的聚合页。 -->
          <div v-if="topic?.slug === 'leetcode'" class="deep-dive">
            <p class="deep-dive-kicker">读完题解，往生产环境走一步</p>
            <p class="deep-dive-copy">
              BFS / DFS / 动态规划只是起点。想看清并发、状态与持久化在真实系统里怎么落地，可以接着读：
            </p>
            <div class="deep-dive-links">
              <router-link
                v-for="t in deepDiveTopics"
                :key="t.slug"
                :to="topicPath(t.slug)"
                class="deep-dive-link"
              >
                <span class="deep-dive-en">{{ t.en }}</span>
                <strong class="deep-dive-name">{{ t.name }}</strong>
                <span class="deep-dive-desc">{{ t.tagline }}</span>
              </router-link>
            </div>
          </div>

          <!-- Comment section -->
          <section class="comment-section">
            <CommentList :article-slug="article.slug" :key="commentKey" />
            <CommentForm :article-slug="article.slug" @submitted="commentKey++" />
          </section>
        </article>

        <!-- Desktop TOC sidebar (hidden below 1024px — no TOC on mobile) -->
        <aside class="detail-sidebar">
          <TocNav :html="article.html_content || article.content || ''" />
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import MarkdownView from '@/components/MarkdownView.vue'
import CommentList from '@/components/CommentList.vue'
import CommentForm from '@/components/CommentForm.vue'
import TocNav from '@/components/TocNav.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import RelatedArticles from '@/components/RelatedArticles.vue'
import { useSEO, SITE_AUTHOR } from '@/utils/seo'
import { getReadingTime, stripMarkdown } from '@/utils/readingTime'
import { catLabel, tagLabel, authorName as getAuthorName } from '@/utils/labels'
import { readPrerenderedArticle } from '@/utils/prerenderPreview'
import { loadDetailCache } from '@/utils/articleCache'
import { findTopic, topicPath, TOPICS } from '@/data/topics'
import client from '@/api/client'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

const article = ref(null)
const loading = ref(true)
const error = ref(null)
const httpStatus = ref(null) // 404 vs generic error
const commentKey = ref(0)

// Monotonic request id — only commit if it's still the latest when the
// response arrives. Prevents A→B fast-switch from binding A to B's URL.
let fetchSeq = 0

/**
 * 首屏取内容的优先级：预渲染直出（本页 <noscript> 正文 + #prerender-article
 * 元数据）→ localStorage 详情缓存 → 骨架屏。
 *
 * 拿到任一份就立刻渲染并撤掉 loading，网络回来后原地替换（stale-while-
 * revalidate）。反过来「先抹掉正文再等 API」正是内容闪烁的来源。
 */
function showInstant(slug) {
  const instant =
    article.value?.slug === slug
      ? article.value
      : readPrerenderedArticle(slug) || loadDetailCache(slug)
  if (instant) {
    article.value = instant
    loading.value = false
    return true
  }
  loading.value = true
  article.value = null
  return false
}

// setup 阶段就取一次：首帧直接是正文。放到 onMounted 才取的话，
// 组件已经按 loading=true 渲染过一帧骨架屏了。
showInstant(route.params.slug)

const formattedDate = computed(() => {
  if (!article.value?.created_at) return ''
  const d = new Date(article.value.created_at)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
})

const authorName = computed(() => getAuthorName(article.value?.author))

const categoryName = computed(() => catLabel(article.value?.category))

// 只有归入五个编辑专题的分类才有聚合页；其余（如「随笔」）保持纯文本，
// 避免链到不存在的 /topics/ 页面。
const topic = computed(() => findTopic(article.value?.category?.slug))

// 题解页末尾的「往深处读」只推荐这两个专题：它们是站点当前最想把权重
// 集中过去的硬核内容。
const deepDiveTopics = TOPICS.filter(
  (t) => t.slug === 'aiagent' || t.slug === 'database',
)

const tagList = computed(() => {
  const tags = article.value?.tags
  if (!tags || !Array.isArray(tags)) return []
  return tags.map(tagLabel).filter(Boolean)
})

const liked = ref(false)
const liking = ref(false) // M2: like button double-click guard

// M2: currentUrl derived from reactive route, not stale window.location
const currentUrl = computed(() => window.location.origin + route.fullPath)

const readingTime = computed(() => {
  if (!article.value) return 1
  // P5: prefer the backend's reading_time (single source of truth); fall back
  // to the local estimate for cached/legacy payloads without the field.
  if (article.value.reading_time) return article.value.reading_time
  const text = stripMarkdown(article.value.content || '')
  return getReadingTime(text)
})

// JSON-LD structured data
const jsonLd = computed(() => {
  if (!article.value) return ''
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.value.title,
    description: article.value.excerpt || '',
    image: article.value.cover_image || undefined,
    datePublished: article.value.created_at,
    dateModified: article.value.updated_at,
    author: { '@type': 'Person', name: SITE_AUTHOR },
    publisher: { '@type': 'Person', name: SITE_AUTHOR },
  })
})

// 这段结构化数据不能写成模板里的 <script type="application/ld+json">：
// Vue 的 DOM 编译器会**忽略并报错** ——
//   Tags with side effect (<script> and <style>) are ignored in client
//   component templates.
// 客户端组件模板里的 <script> 本来也不会执行。`vite build` 只把它当警告放过去，
// 所以线上一直没事；`vite dev` 会直接弹 HMR 错误遮罩，把整页盖住。
// 改成手动建节点塞进 <head>，行为一致（爬虫读到的还是同一段 JSON-LD），
// 也不再依赖模板能力。
let jsonLdEl = null
watch(
  jsonLd,
  (data) => {
    if (!data) {
      jsonLdEl?.remove()
      jsonLdEl = null
      return
    }
    if (!jsonLdEl) {
      jsonLdEl = document.createElement('script')
      jsonLdEl.type = 'application/ld+json'
      jsonLdEl.dataset.articleJsonLd = '1'
      document.head.appendChild(jsonLdEl)
    }
    jsonLdEl.textContent = data
  },
  { immediate: true },
)

async function handleLike() {
  if (liked.value || liking.value) return
  liking.value = true
  try {
    const res = await client.post(`/articles/${article.value.slug}/like/`)
    if (article.value) article.value.likes_count = res.data.likes_count
    liked.value = true
  } catch { /* silently ignore */ }
  finally {
    liking.value = false
  }
}

async function fetchArticle() {
  const slug = route.params.slug
  const seq = ++fetchSeq

  if (!slug) {
    error.value = '缺少文章标识'
    httpStatus.value = null
    loading.value = false
    return
  }

  // 首屏内容（预渲染直出 / 详情缓存）到位时不要抹掉再等网络 —— 那样只会
  // 多一次骨架屏闪烁；没有任何副本时才回落到骨架屏。
  showInstant(slug)
  error.value = null
  httpStatus.value = null
  // LocalStorage-backed optimistic liked state per slug
  try {
    liked.value = !!localStorage.getItem(zj_liked_)
  } catch {
    liked.value = false
  }

  try {
    // Try the store's slug-keyed cache first
    const cached = articleStore.getArticleBySlug(slug)
    if (cached) {
      if (seq !== fetchSeq) return // newer request already started
      article.value = cached
      loading.value = false
      applySeo()
      return
    }

    const fetched = await articleStore.fetchArticleBySlug(slug)
    if (seq !== fetchSeq) return // a newer fetch superseded this one
    article.value = fetched

    if (!article.value) {
      error.value = '文章不存在'
    } else {
      applySeo()
    }
  } catch (e) {
    if (seq !== fetchSeq) return
    httpStatus.value = e?.response?.status ?? null
    if (httpStatus.value === 404) {
      // 文章确实没了：本地那份预渲染副本也不能冒充在线内容。
      error.value = '文章不存在'
    } else if (article.value) {
      // 首屏正文（预渲染 / 缓存）已经在屏上，只是这次刷新失败：
      // 保留正文，别把读到一半的文章换成错误页。
      console.warn('Article refresh failed, keeping instant copy:', slug, e?.message || e)
    } else {
      error.value = e?.response?.data?.detail || e.message || '加载文章失败'
    }
  } finally {
    if (seq === fetchSeq) loading.value = false
  }
}

function applySeo() {
  if (!article.value) return
  // Canonical is always the trailing-slash form: that is the URL the
  // prerendered file lives at (and the one sitemap.xml advertises), while the
  // SPA's own URL bar shows /article/<slug>.
  useSEO({
    title: article.value.title,
    description: article.value.excerpt || '',
    image: article.value.cover_image || '',
    url: `${window.location.origin}/article/${article.value.slug}/`,
    type: 'article',
  })
}

onMounted(fetchArticle)

// Re-fetch when navigating between articles (same component, different slug)
watch(() => route.params.slug, () => {
  window.scrollTo({ top: 0, behavior: 'instant' })
  commentKey.value++
  fetchArticle()
})

// The article's title/og tags are replaced by the next route's own values —
// router.afterEach() in main.js re-applies per-route SEO, so there is no
// resetSEO() here: it ran AFTER afterEach and clobbered the incoming page's
// title with the site name.
const scrollPercent = ref(0)
function handleScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  if (scrollHeight > 0) {
    scrollPercent.value = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
  } else {
    scrollPercent.value = 0
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  jsonLdEl?.remove()
  jsonLdEl = null
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/skeleton' as *;

.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #3f6b57, #8fb29c, #d18a6f);
  z-index: 1001;
  pointer-events: none;
  transition: width 0.1s ease-out;
}

.page-article-detail {
  max-width: 1160px;
  margin: 0 auto;
  padding: 48px 20px 24px;
}

// ============ Two-column layout ============
.detail-layout {
  display: flex;
  gap: 32px;
  justify-content: space-between;
  align-items: flex-start;
}

.detail-main {
  flex: 1;
  min-width: 0;
  max-width: 800px;
}

// 目录只在桌面端以侧栏形式出现；移动端不展示目录。
// 曾经的 .mobile-toc 是 .detail-layout 的 flex 兄弟节点，其内部 .toc-nav
// 固定 240px 宽，会在窄屏右侧硬占一列，把正文挤到左边——这就是“文章右边
// 一大片空白”的根因。删掉它以后，≤1023px 只有 .detail-main 一个 flex 项。
.detail-sidebar {
  position: sticky;
  top: 80px;
  width: 240px;
  flex-shrink: 0;
  align-self: flex-start;

  @media (max-width: 1023px) {
    display: none;
  }
}

// ============ Article header ============
.article-header {
  margin-bottom: 32px;
}

.article-title {
  font-size: 2rem;
  font-weight: 700;
  color: $text-primary;
  line-height: 1.3;
  margin-bottom: 16px;

  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
}

// 元信息走等宽字 + 「·」分隔点，与卡片 card-meta 同一门面；
// 字号并入 0.68 元信息层
.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: $font-mono;
  font-size: 0.68rem;
  color: $text-secondary;
  flex-wrap: wrap;
  margin-bottom: 12px;

  > .meta-item + .meta-item::before {
    content: '·';
    margin-right: 12px;
    opacity: 0.45;
  }
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  svg {
    opacity: 0.5;
    flex-shrink: 0;
  }
}

.meta-reading-time {
  color: $accent-mint;
}

// ---- Article Actions (share + like) ----
.article-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid $glass-border;
  flex-wrap: wrap;
}

.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  font-size: 0.8rem;
  font-family: $font-mono;
  font-weight: 600;
  color: $accent-purple;
  background: rgba($accent-purple, 0.08);
  border: 1px solid rgba($accent-purple, 0.3);
  border-radius: 999px;
  cursor: pointer;
  transition: background $transition-fast, box-shadow $transition-fast, transform $transition-fast;

  &:hover { background: rgba($accent-purple, 0.15); }
  &:active { transform: scale(0.95); }
  &.liked {
    color: #fff;
    background: $accent-purple;
    border-color: $accent-purple;
    box-shadow: none;
    pointer-events: none;
  }
}

.meta-category {
  font-weight: 600;
  color: inherit;
  text-decoration: none;
  transition: color $transition-fast;

  &:hover { color: var(--accent, #3f6b57); }
}

// ============ Topic CTA ============
// 放在正文末尾、相关阅读之前：读者读完一篇后最自然的下一步是「这个专题
// 还有哪些」，同时把内链权重集中到 5 个聚合页上。
.topic-cta {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 16px;
  align-items: baseline;
  margin: 30px 0 8px;
  padding: 18px 20px;
  border: 1px solid var(--border-subtle, #dce2da);
  border-radius: 10px;
  text-decoration: none;
  transition: border-color $transition-fast, background $transition-fast;

  &:hover {
    border-color: var(--accent-line, #c9d6cc);
    background: var(--surface-muted, #f2f4ee);
  }
}

.topic-cta-kicker {
  grid-column: 1 / -1;
  font-family: var(--font-mono, 'SFMono-Regular', Consolas, monospace);
  font-size: 0.66rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.topic-cta-name {
  font-size: 1.05rem;
  color: var(--text-primary);
}

.topic-cta-arrow {
  font-size: 0.82rem;
  color: var(--accent, #3f6b57);
  white-space: nowrap;
}

.topic-cta-desc {
  grid-column: 1 / -1;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

// ============ Deep dive ============
// 只出现在算法题解页：用一句过渡文案 + 两个专题入口，把题解流量引向
// AI Agent / 数据库内核。
.deep-dive {
  margin: 26px 0 8px;
  padding: 20px 22px;
  border: 1px solid var(--border-subtle, #dce2da);
  border-radius: 10px;
  background: var(--surface-muted, #f2f4ee);
}

.deep-dive-kicker {
  margin: 0 0 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.deep-dive-copy {
  margin: 0 0 14px;
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.deep-dive-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.deep-dive-link {
  display: grid;
  gap: 2px;
  padding: 12px 14px;
  text-decoration: none;
  background: var(--bg-primary, #fff);
  border: 1px solid var(--border-subtle, #dce2da);
  border-radius: 8px;
  transition: border-color $transition-fast;

  &:hover { border-color: var(--accent-line, #c9d6cc); }
}

.deep-dive-en {
  font-family: var(--font-mono, 'SFMono-Regular', Consolas, monospace);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent, #3f6b57);
}

.deep-dive-name {
  font-size: 0.95rem;
  color: var(--text-primary);
}

.deep-dive-desc {
  font-size: 0.78rem;
  line-height: 1.55;
  color: var(--text-secondary);
}

// ============ Tags ============
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

// 与列表页卡片标签同一门面：等宽字 + 弱底胶囊
.tag-pill {
  display: inline-block;
  padding: 2px 8px;
  font-family: $font-mono;
  font-size: 0.68rem;
  letter-spacing: 0.03em;
  color: $text-primary;
  background: $bg-secondary;
  border: 1px solid transparent;
  border-radius: 999px;
  transition: background $transition-fast;

  &:hover {
    background: rgba($accent-pink, 0.12);
  }
}

// ============ Cover image ============
.article-cover {
  margin-bottom: 24px;

  img {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: $radius-md;
    box-shadow: $card-shadow;
  }
}

// ============ Article navigation (prev/next) ============
.article-nav {
  display: flex;
  gap: 16px;
  margin: 40px 0;
  padding-top: 24px;
  border-top: 1px solid $glass-border;
}

.nav-link {
  flex: 1;
  padding: 16px 20px;
  background: $bg-card;
  border: 1px solid $glass-border;
  border-radius: $glass-radius;
  text-decoration: none;
  transition: border-color $transition-base, background $transition-base;

  &:hover {
    border-color: rgba($accent-pink, 0.35);
    background: $bg-secondary;
  }
}

.next-link {
  text-align: right;
}

.nav-direction {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: $font-mono;
  font-size: 0.68rem;
  color: $text-secondary;
  margin-bottom: 6px;

  svg {
    opacity: 0.5;
  }
}

.next-link .nav-direction {
  justify-content: flex-end;
}

.nav-title {
  display: block;
  font-size: 0.88rem;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color $transition-fast;

  .nav-link:hover & {
    color: $neon-cyan;
  }
}

// ============ Comment section ============
.comment-section {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// ============ States ============
.error-state {
  text-align: center;
  padding: 80px 20px;
  color: $text-secondary;

  svg {
    margin-bottom: 16px;
    opacity: 0.4;
    stroke: $neon-pink;
  }

  h2 {
    font-size: 1.5rem;
    color: $text-primary;
    margin-bottom: 8px;
  }

  p {
    font-size: 0.88rem;
    margin-bottom: 24px;
  }
}

.back-link {
  display: inline-block;
  padding: 10px 28px;
  font-size: 0.8rem;
  font-family: $font-mono;
  color: $neon-cyan;
  background: rgba($neon-cyan, 0.08);
  border: 1px solid rgba($neon-cyan, 0.3);
  border-radius: $radius-md;
  text-decoration: none;
  transition: background $transition-fast, border-color $transition-fast;

  &:hover {
    background: rgba($neon-cyan, 0.15);
    border-color: $neon-cyan;
  }
}

// ============ Skeleton ============
.detail-skeleton {
  max-width: 800px;
  margin: 0 auto;
}

.skeleton-line {
  @include skeleton-line;

  &.skeleton-lg {
    height: 36px !important;
    margin-bottom: 20px;
  }
}

.skeleton-meta-row {
  display: flex;
  gap: 16px;
}

.skeleton-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.w-10 { width: 10%; }
.w-15 { width: 15%; }
.w-20 { width: 20%; }
.w-70 { width: 70%; }
.w-80 { width: 80%; }
.w-90 { width: 90%; }
.w-100 { width: 100%; }

// ============ Mobile ============
@media (max-width: 767px) {
  .page-article-detail {
    padding: 32px 14px 16px;
  }

  .detail-layout {
    gap: 0;
  }

  .article-nav {
    flex-direction: column;
    gap: 12px;
  }

  .nav-link {
    text-align: left;
  }

  .next-link .nav-direction {
    justify-content: flex-start;
  }
}
</style>
