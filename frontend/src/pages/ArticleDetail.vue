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
      <h2>文章不存在</h2>
      <p>{{ error }}</p>
      <router-link to="/" class="back-link">返回首页</router-link>
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

          <!-- Comment section -->
          <section class="comment-section">
            <CommentList :article-slug="article.slug" />
            <CommentForm :article-slug="article.slug" />
          </section>
        </article>

        <!-- Desktop TOC sidebar -->
        <aside class="detail-sidebar">
          <TocNav :html="article.html_content || article.content || ''" />
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import MarkdownView from '@/components/MarkdownView.vue'
import CommentList from '@/components/CommentList.vue'
import CommentForm from '@/components/CommentForm.vue'
import TocNav from '@/components/TocNav.vue'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

const article = ref(null)
const loading = ref(true)
const error = ref(null)

const formattedDate = computed(() => {
  if (!article.value?.created_at) return ''
  const d = new Date(article.value.created_at)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
})

const authorName = computed(() => {
  const author = article.value?.author
  if (!author) return '匿名'
  return typeof author === 'object' ? author.name || author.username || '' : author
})

const categoryName = computed(() => {
  const cat = article.value?.category
  if (!cat) return ''
  return typeof cat === 'object' ? cat.name || '' : cat
})

const tagList = computed(() => {
  const tags = article.value?.tags
  if (!tags || !Array.isArray(tags)) return []
  return tags.map((t) => (typeof t === 'object' ? t.name || '' : t)).filter(Boolean)
})

async function fetchArticle() {
  const slug = route.params.slug
  if (!slug) {
    error.value = '缺少文章标识'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null
  article.value = null

  try {
    // Try to use the store first if already loaded
    if (articleStore.currentArticle && articleStore.currentArticle.slug === slug) {
      article.value = articleStore.currentArticle
      loading.value = false
    } else {
      await articleStore.fetchArticleBySlug(slug)
      article.value = articleStore.currentArticle
    }

    if (!article.value) {
      error.value = '文章不存在'
    } else {
      document.title = article.value.title || '文章详情'
    }
  } catch (e) {
    const status = e?.response?.status
    if (status === 404) {
      error.value = '文章不存在'
    } else {
      error.value = e?.response?.data?.detail || e.message || '加载文章失败'
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchArticle)
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-article-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
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
  font-weight: 800;
  color: $neon-cyan;
  line-height: 1.3;
  margin-bottom: 16px;
  text-shadow:
    0 0 7px rgba($neon-cyan, 0.3),
    0 0 10px rgba($neon-cyan, 0.1);

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
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid $glass-border;
  border-radius: $glass-radius;
  text-decoration: none;
  transition: border-color $transition-base, background $transition-base;

  &:hover {
    border-color: rgba($neon-cyan, 0.2);
    background: rgba(20, 20, 30, 0.8);
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

.skeleton-header {
  margin-bottom: 32px;
}

.skeleton-lg {
  height: 36px !important;
  margin-bottom: 20px;
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

.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02) 25%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0.02) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.w-10 { width: 10%; }
.w-15 { width: 15%; }
.w-20 { width: 20%; }
.w-70 { width: 70%; }
.w-80 { width: 80%; }
.w-90 { width: 90%; }
.w-100 { width: 100%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// ============ Mobile ============
@media (max-width: 767px) {
  .page-article-detail {
    padding: 16px 12px;
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
