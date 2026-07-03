<template>
  <div class="page page-home">
    <div class="home-layout">
      <!-- Main content -->
      <div class="home-main">
        <!-- Pinned articles -->
        <div v-if="pinnedArticles.length" class="pinned-section">
          <h3 class="pinned-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            置顶文章
          </h3>
          <div class="pinned-grid">
            <ArticleCard
              v-for="article in pinnedArticles"
              :key="article.slug || article.id"
              :article="article"
              class="pinned-card"
            />
          </div>
        </div>

        <!-- Active filter bar -->
        <div v-if="activeFilter" class="filter-bar">
          <span class="filter-badge">
            {{ filterType === 'category' ? '分类' : '标签' }}: {{ activeFilter }}
          </span>
          <router-link to="/" class="filter-clear" @click="clearFilter">✕ 清除筛选</router-link>
        </div>

        <!-- Loading state -->
        <div v-if="articleStore.loading && !articleStore.articles.length" class="skeleton-grid">
          <div v-for="i in 3" :key="i" class="skeleton-card">
            <div class="skeleton-image" />
            <div class="skeleton-body">
              <div class="skeleton-line w-75" />
              <div class="skeleton-line w-50" />
              <div class="skeleton-line w-100" />
              <div class="skeleton-line w-60" />
            </div>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="state-message error-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p>{{ error }}</p>
          <button class="retry-btn" @click="loadArticles">重试</button>
        </div>

        <!-- Empty state -->
        <div v-else-if="!regularArticles.length && !pinnedArticles.length" class="state-message empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
          <p>还没有文章</p>
        </div>

        <!-- Article grid -->
        <div v-else-if="regularArticles.length" class="article-grid">
          <ArticleCard
            v-for="article in regularArticles"
            :key="article.slug || article.id"
            :article="article"
          />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="page-btn"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <template v-for="(page, idx) in visiblePages" :key="idx">
            <span v-if="page === '...'" class="page-ellipsis">...</span>
            <button
              v-else
              class="page-btn"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >{{ page }}</button>
          </template>

          <button
            class="page-btn"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <!-- Sidebar -->
      <SidePanel />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import ArticleCard from '@/components/ArticleCard.vue'
import SidePanel from '@/components/SidePanel.vue'

const route = useRoute()
const articleStore = useArticleStore()

const currentPage = ref(1)
const error = ref(null)
const activeFilter = computed(() => route.query.category || route.query.tag || null)
const filterType = computed(() => route.query.category ? 'category' : route.query.tag ? 'tag' : null)

const pinnedArticles = computed(() =>
  articleStore.articles.filter((a) => a.is_top)
)

const regularArticles = computed(() =>
  articleStore.articles.filter((a) => !a.is_top)
)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(articleStore.pagination.count / articleStore.pagination.pageSize))
)

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

async function loadArticles(queryOverride) {
  error.value = null
  try {
    const params = { page: currentPage.value }
    const q = queryOverride || route.query
    if (q.category) params.category__slug = q.category
    else if (q.tag) params.tags__slug = q.tag
    await articleStore.fetchArticles(params)
  } catch (e) {
    error.value = e?.response?.data?.detail || e.message || '加载文章失败'
  }
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearFilter() {
  currentPage.value = 1
  articleStore.fetchArticles({ page: 1 })
}

onBeforeRouteUpdate((to) => {
  currentPage.value = 1
  loadArticles(to.query)
})

onMounted(() => {
  loadArticles()
  articleStore.fetchCategories()
  articleStore.fetchTags()
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.home-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.home-main {
  flex: 1;
  min-width: 0;
}

// ---- Filter Bar ----
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 10px 16px;
  background: $glass-bg;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
}

.filter-badge {
  font-size: 0.85rem;
  font-weight: 600;
  color: $accent-pink;
  padding: 4px 12px;
  background: rgba(255,133,162,0.1);
  border-radius: 999px;
}

.filter-clear {
  font-size: 0.8rem;
  color: $text-secondary;
  text-decoration: none;
  &:hover { color: $accent-pink; }
}

// ---- Pinned Section ----
.pinned-section {
  margin-bottom: 32px;
}

.pinned-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  color: $neon-pink;
  margin-bottom: 16px;
  text-shadow: 0 0 7px rgba($neon-pink, 0.4);

  svg {
    flex-shrink: 0;
  }
}

.pinned-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.pinned-card {
  border-color: rgba($neon-pink, 0.3);
  box-shadow: 0 0 12px rgba($neon-pink, 0.06);
}

// ---- Article Grid ----
.article-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
}

// ---- Skeleton Loading ----
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
}

.skeleton-card {
  background: $bg-card;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid $glass-border;
}

.skeleton-image {
  width: 100%;
  height: 180px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02) 25%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0.02) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

  &:nth-child(2) {
    animation-delay: 0.1s;
  }
  &:nth-child(3) {
    animation-delay: 0.2s;
  }
  &:nth-child(4) {
    animation-delay: 0.3s;
  }
}

.w-75 {
  width: 75%;
}

.w-50 {
  width: 50%;
}

.w-100 {
  width: 100%;
}

.w-60 {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// ---- States (error, empty) ----
.state-message {
  text-align: center;
  padding: 80px 20px;
  color: $text-secondary;

  svg {
    margin-bottom: 16px;
    opacity: 0.5;
  }

  p {
    font-size: 1rem;
  }
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 24px;
  font-size: 0.85rem;
  font-family: inherit;
  color: $neon-cyan;
  background: transparent;
  border: 1px solid rgba($neon-cyan, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: background $transition-fast, border-color $transition-fast;

  &:hover {
    background: rgba($neon-cyan, 0.08);
    border-color: $neon-cyan;
  }
}

// ---- Pagination ----
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 40px;
  padding-bottom: 24px;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  font-size: 0.85rem;
  font-family: inherit;
  color: $text-secondary;
  background: transparent;
  border: 1px solid $glass-border;
  border-radius: 8px;
  cursor: pointer;
  transition: color $transition-fast, border-color $transition-fast, background $transition-fast;

  &:hover:not(:disabled) {
    color: $neon-cyan;
    border-color: rgba($neon-cyan, 0.3);
    background: rgba($neon-cyan, 0.04);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &.active {
    color: $neon-cyan;
    border-color: $neon-cyan;
    box-shadow: 0 0 8px rgba($neon-cyan, 0.3);
    background: rgba($neon-cyan, 0.08);
  }
}

.page-ellipsis {
  color: $text-secondary;
  font-size: 0.85rem;
  padding: 0 4px;
  letter-spacing: 2px;
}

// ---- Mobile adjustments ----
@media (max-width: 767px) {
  .page-home {
    padding: 16px 12px;
  }

  .home-layout {
    gap: 0;
  }
}
</style>
