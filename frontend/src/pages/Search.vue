<template>
  <div class="page page-search">
    <header class="page-header">
      <h1 class="page-title neon-text-cyan">搜索</h1>
      <p class="page-subtitle">查找你感兴趣的文章</p>
    </header>

    <!-- Search input -->
    <div class="search-box glass-card">
      <div class="search-input-wrapper">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          class="search-input"
          placeholder="输入关键词搜索..."
          @input="onInput"
        />
        <button v-if="query" class="clear-btn" @click="clearSearch" aria-label="Clear search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty query state -->
    <div v-if="!query && !loading" class="state-message">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <p>输入关键词搜索</p>

      <!-- P4: give the empty state something to do — popular tags as entry points -->
      <div v-if="hotTags.length" class="hot-tags">
        <span class="hot-tags-label">热门标签</span>
        <div class="hot-tags-row">
          <button
            v-for="tag in hotTags"
            :key="tag.slug || tag.name"
            class="hot-tag"
            @click="searchTag(tag)"
          >{{ tag.name }}</button>
        </div>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-else-if="loading" class="skeleton-grid">
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

    <!-- No results -->
    <div v-else-if="!results.length && query" class="state-message">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="8" y1="8" x2="14" y2="14"/>
      </svg>
      <p>未找到相关文章</p>
    </div>

    <!-- Results -->
    <div v-else-if="results.length" class="results-grid">
      <p class="results-summary">
        找到 {{ totalResults }} 篇与 "<strong>{{ query }}</strong>" 相关的文章
        <span v-if="totalResults > results.length" class="results-more">
          （当前显示前 {{ results.length }} 篇）
        </span>
      </p>
      <ArticleCard
        v-for="article in results"
        :key="article.slug || article.id"
        :article="article"
        :highlight="query"
      />
      <button
        v-if="hasMore"
        class="load-more-btn"
        :disabled="loadingMore"
        @click="loadMore"
      >
        {{ loadingMore ? '加载中...' : '加载更多' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticles, getTags } from '@/api/articles'
import ArticleCard from '@/components/ArticleCard.vue'

const route = useRoute()
const router = useRouter()

// M28: keyword lives in the URL too — shareable / refreshable / back-friendly
const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const results = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const inputRef = ref(null)

// M3: track total across pages instead of reporting just current page length
const totalResults = ref(0)
const currentPage = ref(1)
const pageSize = 10

let debounceTimer = null
// H3/M28: monotonic guard for race-free search
let searchSeq = 0

function syncQueryToUrl(value) {
  // Use replace so we don't fill history with every keystroke
  router.replace({
    query: { ...route.query, q: value || undefined },
  })
}

async function performSearch(keyword, page = 1, append = false) {
  const trimmed = (keyword || '').trim()
  if (!trimmed) {
    results.value = []
    totalResults.value = 0
    loading.value = false
    loadingMore.value = false
    return
  }

  const seq = ++searchSeq
  if (append) loadingMore.value = true
  else loading.value = true

  try {
    const response = await getArticles({
      search: trimmed,
      page,
      page_size: pageSize,
    })
    if (seq !== searchSeq) return // superseded
    const list = response.data.results || response.data || []
    results.value = append ? [...results.value, ...list] : list
    currentPage.value = page
    totalResults.value = response.data.count ?? list.length
  } catch {
    if (seq !== searchSeq) return
    if (!append) {
      results.value = []
      totalResults.value = 0
    }
  } finally {
    if (seq === searchSeq) {
      loading.value = false
      loadingMore.value = false
    }
  }
}

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    syncQueryToUrl(query.value)
    performSearch(query.value, 1, false)
  }, 300)
}

function clearSearch() {
  query.value = ''
  results.value = []
  totalResults.value = 0
  if (debounceTimer) clearTimeout(debounceTimer)
  syncQueryToUrl('')
  nextTick(() => inputRef.value?.focus())
}

function loadMore() {
  performSearch(query.value, currentPage.value + 1, true)
}

const hasMore = computed(() => results.value.length < totalResults.value)

// P4: popular tags shown in the empty state, most-used first.
const hotTags = ref([])
async function loadHotTags() {
  try {
    const res = await getTags()
    const list = res.data.results || res.data || []
    hotTags.value = [...list]
      .sort((a, b) => (b.article_count || 0) - (a.article_count || 0))
      .slice(0, 8)
  } catch {
    hotTags.value = []
  }
}

function searchTag(tag) {
  query.value = tag.name
  syncQueryToUrl(query.value)
  performSearch(query.value, 1, false)
  nextTick(() => inputRef.value?.focus())
}

// Run initial search if URL has a query on mount / route change
watch(
  () => route.query.q,
  (newQ) => {
    const next = typeof newQ === 'string' ? newQ : ''
    if (next !== query.value) {
      query.value = next
      performSearch(next, 1, false)
    }
  },
)

onMounted(() => {
  nextTick(() => inputRef.value?.focus())
  if (query.value) performSearch(query.value, 1, false)
  loadHotTags()
})

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-search {
  max-width: 960px;
  margin: 0 auto;
  padding: 52px 20px 24px;
}

.page-header {
  text-align: left;
  margin-bottom: 32px;
}

.page-title {
  color: $text-primary;
  font-size: 2.4rem;
  font-weight: 750;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 0.95rem;
  color: $text-secondary;
}

// ---- Search Box ----
.search-box {
  margin-bottom: 32px;
  padding: 4px 16px;
  border-color: $glass-border;
  transition: border-color $transition-fast, box-shadow $transition-fast;

  &:focus-within {
    border-color: $neon-cyan;
    box-shadow:
      0 0 8px rgba($neon-cyan, 0.2),
      0 0 16px rgba($neon-cyan, 0.08);
  }
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-icon {
  flex-shrink: 0;
  color: $text-secondary;
  transition: color $transition-fast;

  .search-box:focus-within & {
    color: $neon-cyan;
  }
}

.search-input {
  flex: 1;
  padding: 14px 0;
  font-size: 1.1rem;
  font-family: inherit;
  color: $text-primary;
  background: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: $text-secondary;
    opacity: 0.6;
  }
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid $glass-border;
  color: $text-secondary;
  cursor: pointer;
  transition: color $transition-fast, background $transition-fast, border-color $transition-fast;

  &:hover {
    color: $neon-pink;
    background: rgba($neon-pink, 0.08);
    border-color: rgba($neon-pink, 0.3);
  }
}

// ---- Results Grid ----
.results-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
}

// ---- Skeleton ----
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
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid $glass-border;
}

.skeleton-image {
  width: 100%;
  height: 180px;
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-hi) 50%,
    var(--skeleton-base) 75%
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
    var(--skeleton-base) 25%,
    var(--skeleton-hi) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.3s; }
}

.w-75 { width: 75%; }
.w-50 { width: 50%; }
.w-100 { width: 100%; }
.w-60 { width: 60%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// ---- States ----
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

// P4: hot tag chips in the empty state
.hot-tags {
  margin-top: 28px;
}

.hot-tags-label {
  display: block;
  font-size: 0.8rem;
  color: $text-secondary;
  margin-bottom: 12px;
  opacity: 0.8;
}

.hot-tags-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.hot-tag {
  padding: 5px 14px;
  font-size: 0.82rem;
  font-family: inherit;
  color: $neon-cyan;
  background: rgba($neon-cyan, 0.06);
  border: 1px solid rgba($neon-cyan, 0.28);
  border-radius: 999px;
  cursor: pointer;
  transition: background $transition-fast, border-color $transition-fast, transform $transition-fast;

  &:hover {
    background: rgba($neon-cyan, 0.14);
    border-color: $neon-cyan;
    transform: translateY(-1px);
  }
}

.results-summary {
  font-size: 0.85rem;
  color: $text-secondary;
  margin-bottom: 16px;
  strong { color: $accent-pink; }
}

@media (max-width: 767px) {
  .page-search { padding: 32px 14px 16px; }
  .page-title { font-size: 2rem; }
}
</style>

<style>
/* Global: keyword highlight in search results */
.search-highlight {
  background: rgba(200, 154, 70, 0.24);
  color: #725221;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 600;
}
</style>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.results-more {
  font-size: 0.78rem;
  color: $text-secondary;
  margin-left: 6px;
}

.load-more-btn {
  grid-column: 1 / -1;
  justify-self: center;
  padding: 10px 28px;
  font-family: $font-mono;
  font-size: 0.85rem;
  color: $neon-cyan;
  background: transparent;
  border: 1px solid rgba($neon-cyan, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: background $transition-fast, border-color $transition-fast;

  &:hover:not(:disabled) {
    background: rgba($neon-cyan, 0.08);
    border-color: $neon-cyan;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
