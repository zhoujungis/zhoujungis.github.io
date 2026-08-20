<template>
  <div class="page page-article-detail">
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

              <!-- Category -->
              <span v-if="article.category" class="meta-item meta-category neon-text-pink">
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

          <!-- Markdown body -->
          <MarkdownView :html="article.html_content || article.content || ''" />

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

          <!-- Related Articles -->
          <RelatedArticles :articles="article.related_articles || []" />

          <!-- Newsletter in-article -->
          <NewsletterForm />

          <!-- Comment section -->
          <section class="comment-section">
            <CommentList :article-slug="article.slug" :key="commentKey" />
            <CommentForm :article-slug="article.slug" @submitted="commentKey++" />
          </section>
        </article>

        <!-- Mobile TOC (collapsible, hidden on desktop) -->
        <details class="mobile-toc">
          <summary class="mobile-toc-toggle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            目录
          </summary>
          <TocNav :html="article.html_content || article.content || ''" />
        </details>

        <!-- Desktop TOC sidebar -->
        <aside class="detail-sidebar">
          <TocNav :html="article.html_content || article.content || ''" />
        </aside>
      </div>
    </template>

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json" v-if="article" v-text="jsonLd"></script>
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
import NewsletterForm from '@/components/NewsletterForm.vue'
import { useSEO, resetSEO } from '@/utils/seo'
import { getReadingTime, stripMarkdown } from '@/utils/readingTime'
import { catLabel, tagLabel, authorName as getAuthorName } from '@/utils/labels'
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
    author: { '@type': 'Person', name: 'Zhou Jun' },
    publisher: { '@type': 'Person', name: 'Zhou Jun' },
  })
})

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

  loading.value = true
  error.value = null
  httpStatus.value = null
  article.value = null
  // M2: reset per-slug state so a quick A→B doesn't carry A's liked state
  liked.value = false

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
      error.value = '文章不存在'
    } else {
      error.value = e?.response?.data?.detail || e.message || '加载文章失败'
    }
  } finally {
    if (seq === fetchSeq) loading.value = false
  }
}

function applySeo() {
  if (!article.value) return
  useSEO({
    title: article.value.title,
    description: article.value.excerpt || '',
    image: article.value.cover_image || '',
    url: window.location.origin + route.fullPath,
  })
}

onMounted(fetchArticle)

// Re-fetch when navigating between articles (same component, different slug)
watch(() => route.params.slug, () => {
  window.scrollTo({ top: 0, behavior: 'instant' })
  commentKey.value++
  fetchArticle()
})

// M17: reset SEO on unmount so the article's title/og doesn't leak onto
// Home / Archives / Search after the user navigates away
onUnmounted(() => {
  resetSEO()
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/skeleton' as *;

.page-article-detail {
  max-width: 1160px;
  margin: 0 auto;
  padding: 48px 20px 24px;
}

// ============ Two-column layout ============
.detail-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.detail-main {
  flex: 1;
  min-width: 0;
  max-width: 800px;
}

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

// Mobile TOC (visible only on small screens)
.mobile-toc {
  display: none;
  margin-bottom: 20px;
  border: 1px solid $glass-border;
  border-radius: $glass-radius;
  background: $bg-card;

  @media (max-width: 1023px) {
    display: block;
  }
}

.mobile-toc-toggle {
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  color: $neon-cyan;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  &::-webkit-details-marker { display: none; }
}

.mobile-toc .toc-nav {
  width: 100%;
  padding: 0 16px 16px;
}

// ============ Article header ============
.article-header {
  margin-bottom: 32px;
}

.article-title {
  font-size: 2rem;
  font-weight: 750;
  color: $text-primary;
  line-height: 1.3;
  margin-bottom: 16px;

  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.8rem;
  color: $text-secondary;
  flex-wrap: wrap;
  margin-bottom: 12px;
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
  font-size: 0.9rem;
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
}

// ============ Tags ============
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-pill {
  display: inline-block;
  padding: 2px 10px;
  font-size: 0.72rem;
  color: $neon-purple;
  border: 1px solid $neon-purple;
  border-radius: 999px;
  transition: background $transition-fast;

  &:hover {
    background: rgba($neon-purple, 0.12);
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
  font-size: 0.78rem;
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
  font-size: 0.9rem;
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
    font-size: 0.95rem;
    margin-bottom: 24px;
  }
}

.back-link {
  display: inline-block;
  padding: 10px 28px;
  font-size: 0.85rem;
  font-family: $font-mono;
  color: $neon-cyan;
  background: rgba($neon-cyan, 0.08);
  border: 1px solid rgba($neon-cyan, 0.3);
  border-radius: 8px;
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
