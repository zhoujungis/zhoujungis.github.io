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
      <ArticleCard
        v-for="article in results"
        :key="article.slug || article.id"
        :article="article"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { getArticles } from '@/api/articles'
import ArticleCard from '@/components/ArticleCard.vue'

const query = ref('')
const results = ref([])
const loading = ref(false)
const inputRef = ref(null)

let debounceTimer = null

async function performSearch(keyword) {
  if (!keyword.trim()) {
    results.value = []
    loading.value = false
    return
  }

  loading.value = true
  try {
    const response = await getArticles({ search: keyword.trim() })
    results.value = response.data.results || response.data || []
  } catch {
    results.value = []
  } finally {
    loading.value = false
  }
}

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    performSearch(query.value)
  }, 300)
}

function clearSearch() {
  query.value = ''
  results.value = []
  if (debounceTimer) clearTimeout(debounceTimer)
  nextTick(() => {
    inputRef.value?.focus()
  })
}

onMounted(() => {
  nextTick(() => {
    inputRef.value?.focus()
  })
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-search {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
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
</style>
