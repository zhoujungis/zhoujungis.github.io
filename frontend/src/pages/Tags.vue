<template>
  <div class="page page-tags">
    <header class="page-header">
      <h1 class="page-title">标签</h1>
      <p class="page-subtitle">点击标签筛选文章</p>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="skeleton-cloud">
        <span
          v-for="(w, i) in skeletonWidths"
          :key="i"
          class="skeleton-tag"
          :style="{ width: w + 'px' }"
        />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-message">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="loadTags">重试</button>
    </div>

    <!-- Empty -->
    <div v-else-if="!tags.length" class="state-message">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
      <p>暂无标签</p>
    </div>

    <!-- Tag cloud -->
    <div v-else class="tag-cloud">
      <router-link
        v-for="(tag, idx) in tags"
        :key="tagLabel(tag)"
        :to="{ path: '/articles', query: { tag: tagSlug(tag) || tagLabel(tag) } }"
        class="tag-item"
        :class="`tag-item--${idx % 3}`"
      >
        {{ tagLabel(tag) }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useArticleStore } from '@/stores/article'

const articleStore = useArticleStore()

const loading = ref(false)
const error = ref(null)

// L12: precompute skeleton widths once. Previously Math.random() ran in the
// template on every reactive update, causing visible jitter as widths
// regenerated and Vue re-painted them.
const skeletonWidths = Array.from({ length: 20 }, () => 40 + Math.floor(Math.random() * 80))

// Filter out tags containing "测试" and make all tags equal size
const tags = computed(() => {
  const raw = articleStore.tags || []
  return raw.filter(t => {
    const name = tagLabel(t)
    return !name.includes('测试')
  })
})

function tagLabel(tag) {
  if (!tag) return ''
  return typeof tag === 'object' ? tag.name || '' : tag
}

function tagSlug(tag) {
  if (!tag) return ''
  return typeof tag === 'object' ? tag.slug || '' : ''
}

async function loadTags() {
  loading.value = true
  error.value = null
  try {
    await articleStore.fetchTags()
  } catch (e) {
    error.value = e?.response?.data?.detail || e.message || '加载标签失败'
  } finally {
    loading.value = false
  }
}

onMounted(loadTags)
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-tags {
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

// ---- Tag Cloud ----
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  padding: 40px 20px;
  background: $bg-card;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid $glass-border;
  border-radius: $radius-md;
}

.tag-item {
  display: inline-block;
  padding: 4px 16px;
  border: 1px solid;
  border: 1px solid $glass-border !important;
  border-radius: 999px;
  color: $accent-pink !important;
  background: $bg-primary;
  text-decoration: none;
  font-weight: 600;
  transition:
    background $transition-fast,
    box-shadow $transition-fast,
    transform $transition-fast;
  line-height: 1.4;

  &:hover {
    background: var(--skeleton-dot);
    transform: translateY(-2px);
    background: $bg-secondary;
  }
}

.tag-item--1 { color: $accent-purple !important; }
.tag-item--2 { color: $neon-purple !important; }

// ---- Skeleton ----
.loading-state {
  padding: 40px 20px;
  background: $bg-card;
  border-radius: $radius-md;
  border: 1px solid $glass-border;
}

.skeleton-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.skeleton-tag {
  height: 28px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-hi) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

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

@media (max-width: 767px) {
  .page-tags { padding: 32px 14px 16px; }
  .page-title { font-size: 2rem; }
  .tag-cloud { gap: 9px; padding: 22px 16px; }
  .tag-item { min-height: 40px; display: inline-flex; align-items: center; }
}
</style>
