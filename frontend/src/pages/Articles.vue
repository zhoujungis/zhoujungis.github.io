<template>
  <div class="page page-articles">
    <header class="page-header">
      <p class="page-eyebrow">WRITING</p>
      <h1 class="page-title">文章</h1>
      <p class="page-subtitle">
        所有文章按时间倒序排列,共 {{ articleStore.pagination.count }} 篇
      </p>
    </header>
    <p v-if="articleStore.fromCache && articleStore.cacheNotice" class="cache-notice" role="status">
      {{ articleStore.cacheNotice }}
    </p>
    <div class="articles-list">
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

        <!-- Filter switch: 维度切换 + 滑动药丸 chips -->
        <div class="filter-switch" aria-label="筛选文章">
          <div class="filter-dims" role="tablist" aria-label="筛选维度">
            <span class="dim-pill" :style="dimPillStyle" aria-hidden="true" />
            <button
              class="filter-dim"
              :class="{ active: dim === 'category' }"
              role="tab"
              :aria-selected="dim === 'category'"
              @click="dim = 'category'"
            >分类</button>
            <button
              class="filter-dim"
              :class="{ active: dim === 'tag' }"
              role="tab"
              :aria-selected="dim === 'tag'"
              @click="dim = 'tag'"
            >标签</button>
          </div>

          <div class="filter-chips" ref="chipsEl">
            <span class="chip-pill" :class="{ ready: chipPill.w > 0 }" :style="chipPillStyle" aria-hidden="true" />
            <button
              class="filter-chip"
              :class="{ active: !activeFilter }"
              @click="clearFilter"
            >全部</button>
            <button
              v-for="item in dimItems"
              :key="item.slug"
              class="filter-chip"
              :class="{ active: isChipActive(item) }"
              @click="applyFilter(item)"
            >{{ item.name }}<small v-if="item.count">{{ item.count }}</small></button>
          </div>
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
          <span class="page-info">第 {{ currentPage }}/{{ totalPages }} 页</span>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { catLabel, catSlug, tagLabel, tagSlug } from '@/utils/labels'
import ArticleCard from '@/components/ArticleCard.vue'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

// M13: page is part of the URL — read initial value from query, sync on change
function parsePageFromQuery(query) {
  const p = Number(query?.page)
  return Number.isFinite(p) && p >= 1 ? Math.floor(p) : 1
}
const currentPage = ref(parsePageFromQuery(route.query))
const error = ref(null)
const activeFilter = computed(() => route.query.category || route.query.tag || null)
const filterType = computed(() => route.query.category ? 'category' : route.query.tag ? 'tag' : null)

// ── 筛选切换栏：分类/标签两个维度 + 滑动药丸 chips ──
const dim = ref(filterType.value === 'tag' ? 'tag' : 'category')
const chipsEl = ref(null)
const chipPill = ref({ x: 0, y: 0, w: 0, h: 0 })

const dimItems = computed(() => {
  const source = dim.value === 'category' ? articleStore.categories : articleStore.tags
  return (source || [])
    .map((entry) => ({
      slug: dim.value === 'category' ? catSlug(entry) : tagSlug(entry),
      name: dim.value === 'category' ? catLabel(entry) : tagLabel(entry),
      count: entry?.article_count ?? entry?.count ?? 0,
    }))
    .filter((entry) => entry.slug)
})

function isChipActive(item) {
  if (filterType.value !== dim.value) return false
  const current = dim.value === 'category' ? route.query.category : route.query.tag
  return current === item.slug
}

function applyFilter(item) {
  if (!item?.slug) return
  router.replace({
    query: dim.value === 'category' ? { category: item.slug } : { tag: item.slug },
  })
}

const activeChipIndex = computed(() => {
  if (!activeFilter.value || filterType.value !== dim.value) return 0
  const idx = dimItems.value.findIndex((item) => isChipActive(item))
  return idx >= 0 ? idx + 1 : 0 // +1：0 号是「全部」
})

const chipPillStyle = computed(() => ({
  width: `${chipPill.value.w}px`,
  height: `${chipPill.value.h}px`,
  transform: `translate(${chipPill.value.x}px, ${chipPill.value.y}px)`,
}))

const dimPillStyle = computed(() => ({
  transform: `translateX(${dim.value === 'category' ? 0 : 100}%)`,
}))

// 量测激活 chip 的位置/尺寸，药丸用 transform 滑过去（等宽 0.28s 缓动）
async function updateChipPill() {
  await nextTick()
  const el = chipsEl.value?.querySelectorAll('.filter-chip')[activeChipIndex.value]
  if (!el) return
  chipPill.value = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }
}

// URL 上的筛选变化（深链 / 前进后退）同步维度页签；
// 切到与当前筛选不同维度时清掉筛选，保证屏上必有激活 chip 与药丸对应。
watch(filterType, (type) => {
  if (type) dim.value = type
})
watch(dim, (next, prev) => {
  if (activeFilter.value && filterType.value !== next) clearFilter()
  if (next !== prev) updateChipPill()
})
watch([activeChipIndex, dimItems], updateChipPill)

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

// H3: monotonic guard — only commit if this request is still the latest
let loadSeq = 0

async function loadArticles(queryOverride) {
  const seq = ++loadSeq
  error.value = null
  try {
    // Pin to the value at call time so concurrent calls don't see a
    // mid-flight currentPage.value mutation.
    const page = currentPage.value
    const params = { page }
    const q = queryOverride || route.query
    if (q.category) params.category__slug = q.category
    else if (q.tag) params.tags__slug = q.tag
    await articleStore.fetchArticles(params)
    if (seq !== loadSeq) return // superseded by a newer request
  } catch (e) {
    if (seq !== loadSeq) return
    error.value = e?.response?.data?.detail || e.message || '加载文章失败'
  }
}

function goToPage(page) {
  if (typeof page !== 'number' || page < 1 || page > totalPages.value) return
  // Update URL — the route.query watcher below is the single source of
  // truth for fetching, so we don't call loadArticles here. Setting
  // currentPage.value is purely cosmetic (button highlight + initial state
  // before the watcher fires).
  currentPage.value = page
  router.replace({
    query: { ...route.query, page: page > 1 ? page : undefined },
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearFilter() {
  const { category: _c, tag: _t, page: _p, ...rest } = route.query
  router.replace({ query: rest })
}

// Single watcher = single source of truth for fetching on any URL change.
// Covers: page clicks, filter clicks, browser back/forward, refresh, deep
// links. The previous onBeforeRouteUpdate + two watch() combo had subtle
// ordering bugs (first click landed on page 1, second click worked).
watch(
  () => ({ ...route.query }),
  (newQuery, oldQuery) => {
    const newPage = parsePageFromQuery(newQuery)
    const filterChanged =
      newQuery.category !== oldQuery?.category || newQuery.tag !== oldQuery?.tag

    // Sync local state from URL — handles back/forward, deep links, refresh
    currentPage.value = filterChanged ? 1 : newPage

    // Always refetch when the URL changes; the loadSeq guard inside
    // loadArticles protects against double-fires if multiple sources
    // (e.g. click + watcher) trigger the same URL change.
    loadArticles(newQuery)
  },
)

onMounted(() => {
  loadArticles()
  articleStore.fetchCategories()
  articleStore.fetchTags()
  updateChipPill()
  window.addEventListener('resize', updateChipPill)
  // 字体晚到会让药丸量测偏移，字体就绪后补量一次
  document.fonts?.ready?.then(() => updateChipPill())
})

onUnmounted(() => {
  window.removeEventListener('resize', updateChipPill)
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/skeleton' as *;

.page-articles {
  max-width: 1160px;
  margin: 0 auto;
  padding: 52px 20px 24px;
}

.page-header {
  max-width: 720px;
  margin-bottom: 36px;
}

.page-eyebrow {
  margin-bottom: 8px;
  color: $accent-purple;
  font-family: $font-mono;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.page-title {
  margin: 0 0 7px;
  color: $text-primary;
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.2;
}

.page-subtitle {
  color: $text-secondary;
  font-size: 0.88rem;
}

// 缓存提示走首页门面：左侧色条 + 弱底，替代粉底圆角胶囊
.cache-notice {
  margin: 0 0 16px;
  padding: 8px 14px;
  color: $text-secondary;
  background: var(--surface-muted);
  border-left: 3px solid var(--accent-secondary);
  font-size: 0.8rem;
}

// 筛选切换栏：分段维度页签（分类/标签）+ 圆角 chips，
// 激活态由共享药丸滑动到位，替代原「徽标 + 清除」静态条。
.filter-switch {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.filter-dims {
  position: relative;
  display: inline-flex;
  padding: 3px;
  background: var(--surface-muted);
  border: 1px solid var(--glass-border);
  border-radius: 999px;
}

.dim-pill {
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc((100% - 6px) / 2);
  height: calc(100% - 6px);
  background: var(--accent);
  border-radius: 999px;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-dim {
  position: relative;
  z-index: 1;
  padding: 5px 16px;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: color $transition-fast;

  &.active { color: var(--page-bg); }
}

.filter-chips {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-pill {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--accent);
  border-radius: 999px;
  opacity: 0;
  pointer-events: none;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease;

  &.ready { opacity: 1; }
}

.filter-chip {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.78rem;
  cursor: pointer;
  transition: color $transition-fast, border-color $transition-fast, background $transition-fast;

  small {
    font-family: $font-mono;
    font-size: 0.62rem;
    opacity: 0.75;
  }

  &:hover:not(.active) {
    color: var(--accent);
    border-color: var(--accent-line);
    background: var(--accent-soft);
  }

  &.active {
    color: var(--page-bg);
    border-color: transparent;
    font-weight: 600;
    small { opacity: 0.9; }
  }
}

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
  border-color: rgba($neon-pink, 0.28);
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
}

.skeleton-card {
  background: $bg-card;
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid $glass-border;
}

// 骨架占位与真实封面同为 16:9，加载完成时不再跳版
.skeleton-image {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  @include skeleton-shimmer;
}

.skeleton-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  @include skeleton-line;

  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.3s; }
}

.w-75 { width: 75%; }
.w-50 { width: 50%; }
.w-100 { width: 100%; }
.w-60 { width: 60%; }

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
  font-size: 0.8rem;
  font-family: inherit;
  color: #fff;
  background: $accent-pink;
  border: 1px solid $accent-pink;
  border-radius: $radius-md;
  cursor: pointer;
  transition: background $transition-fast, border-color $transition-fast;

  &:hover {
    background: #315544;
    border-color: #315544;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 40px;
  padding-bottom: 24px;
}

.page-info {
  font-size: 0.8rem;
  color: $text-secondary;
  margin-right: 12px;
  white-space: nowrap;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  font-size: 0.8rem;
  font-family: inherit;
  color: $text-secondary;
  background: $bg-card;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
  cursor: pointer;
  transition: color $transition-fast, border-color $transition-fast, background $transition-fast;

  &:hover:not(:disabled) {
    color: $accent-pink;
    border-color: rgba($accent-pink, 0.4);
    background: $bg-secondary;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &.active {
    color: #fff;
    border-color: $accent-pink;
    box-shadow: none;
    background: $accent-pink;
  }
}

.page-ellipsis {
  color: $text-secondary;
  font-size: 0.8rem;
  padding: 0 4px;
  letter-spacing: 2px;
}

@media (max-width: 767px) {
  .page-articles {
    padding: 32px 14px 16px;
  }
  .page-header { margin-bottom: 28px; }
  .page-title { font-size: 2rem; }
  .pagination {
    justify-content: flex-start;
    gap: 4px;
    overflow-x: auto;
    padding: 0 2px 20px;
  }
  .page-info { margin-right: 6px; }
}
</style>
