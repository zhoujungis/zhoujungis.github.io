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
      <h2>{{ status === 404 ? '文章不存在' : '加载失败' }}</h2>
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

              <!-- Share to WeChat -->
              <button class="share-wechat-btn" @click.stop="showWechatQr = true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.11.24-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .178-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/>
                </svg>
                分享到微信
              </button>
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

      <!-- WeChat share modal -->
      <div v-if="showWechatQr" class="wechat-share-overlay" @click.self="showWechatQr = false">
        <div class="wechat-share-modal">
          <h3 class="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.11.24-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .178-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/>
            </svg>
            分享到微信
          </h3>
          <img :src="qrCodeUrl" alt="微信扫码阅读" class="qr-image" />
          <p class="modal-desc">打开微信"扫一扫"，即可在微信中阅读并转发</p>
          <button class="modal-close-btn" @click="showWechatQr = false">关闭</button>
        </div>
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
const showWechatQr = ref(false)

const qrCodeUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`
})

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

// ============ WeChat share ============
.share-wechat-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  font-size: 0.78rem;
  font-family: inherit;
  color: #07c160;
  background: rgba(7, 193, 96, 0.06);
  border: 1px solid rgba(7, 193, 96, 0.25);
  border-radius: 999px;
  cursor: pointer;
  transition: background $transition-fast, border-color $transition-fast, box-shadow $transition-fast;

  &:hover {
    background: rgba(7, 193, 96, 0.12);
    border-color: rgba(7, 193, 96, 0.45);
    box-shadow: 0 0 8px rgba(7, 193, 96, 0.15);
  }
}

.wechat-share-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.wechat-share-modal {
  background: #fff;
  border-radius: 16px;
  padding: 32px 40px 24px;
  text-align: center;
  max-width: 360px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #07c160;
  margin-bottom: 20px;
}

.qr-image {
  width: 200px;
  height: 200px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 16px;
}

.modal-desc {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.modal-close-btn {
  display: inline-block;
  padding: 8px 32px;
  font-size: 0.85rem;
  font-family: inherit;
  color: #999;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background $transition-fast, color $transition-fast;

  &:hover {
    background: #e8e8e8;
    color: #666;
  }
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
