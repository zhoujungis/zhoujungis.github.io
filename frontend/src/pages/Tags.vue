<template>
  <div class="page page-tags">
    <header class="page-header">
      <h1 class="page-title neon-text-cyan">标签</h1>
      <p class="page-subtitle">点击标签筛选文章</p>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="skeleton-cloud">
        <span
          v-for="i in 20"
          :key="i"
          class="skeleton-tag"
          :style="{ width: (40 + Math.random() * 80) + 'px' }"
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
        :to="{ path: '/', query: { tag: tagSlug(tag) || tagLabel(tag) } }"
        class="tag-item"
        :style="tagStyle(tag, idx)"
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

const neonColors = ['#00e5ff', '#ff0080', '#7b2fff']

// Filter out tags containing "测试" and make all tags equal size
const tags = computed(() => {
  const raw = articleStore.tags || []
  return raw.filter(t => {
    const name = tagLabel(t)
    return !name.includes('测试')
  })
})

// Find the min and max count for scaling font sizes
const countRange = computed(() => {
  const counts = tags.value.map((t) => tagCount(t))
  return {
    min: counts.length ? Math.min(...counts) : 0,
    max: counts.length ? Math.max(...counts) : 1,
  }
})

function tagLabel(tag) {
  if (!tag) return ''
  return typeof tag === 'object' ? tag.name || '' : tag
}

function tagSlug(tag) {
  if (!tag) return ''
  return typeof tag === 'object' ? tag.slug || '' : ''
}

function tagCount(tag) {
  if (typeof tag === 'object' && tag.article_count !== undefined) return tag.article_count
  if (typeof tag === 'object' && tag.count !== undefined) return tag.count
  return 1
}

function tagStyle(tag, idx) {
  const color = neonColors[idx % neonColors.length]
  return {
    fontSize: '1rem',
    borderColor: color,
    color,
  }
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
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
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

// ---- Tag Cloud ----
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 40px 20px;
  background: $bg-card;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid $glass-border;
  border-radius: 12px;
}

.tag-item {
  display: inline-block;
  padding: 4px 16px;
  border: 1px solid;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  transition:
    background $transition-fast,
    box-shadow $transition-fast,
    transform $transition-fast;
  line-height: 1.4;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 0 16px currentColor;
    transform: translateY(-2px);
  }
}

// ---- Skeleton ----
.loading-state {
  padding: 40px 20px;
  background: $bg-card;
  border-radius: 12px;
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
    rgba(255, 255, 255, 0.02) 25%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0.02) 75%
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
</style>
