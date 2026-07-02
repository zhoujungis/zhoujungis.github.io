<template>
  <div class="page page-categories">
    <header class="page-header">
      <h1 class="page-title neon-text-cyan">分类</h1>
      <p class="page-subtitle">按主题浏览文章</p>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="skeleton-grid">
      <div v-for="i in 6" :key="i" class="skeleton-card">
        <div class="skeleton-body">
          <div class="skeleton-line w-60" />
          <div class="skeleton-line w-30" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-message">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="loadCategories">重试</button>
    </div>

    <!-- Empty -->
    <div v-else-if="!categories.length" class="state-message">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
      <p>暂无分类</p>
    </div>

    <!-- Category grid -->
    <div v-else class="category-grid">
      <router-link
        v-for="cat in categories"
        :key="catLabel(cat)"
        :to="{ path: '/', query: { category: catSlug(cat) || catLabel(cat) } }"
        class="category-card"
      >
        <div class="card-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <h3 class="category-name">{{ catLabel(cat) }}</h3>
        <span class="category-count">{{ catCount(cat) }} 篇文章</span>
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

const categories = computed(() => articleStore.categories || [])

function catLabel(cat) {
  if (!cat) return ''
  return typeof cat === 'object' ? cat.name || '' : cat
}

function catSlug(cat) {
  if (!cat) return ''
  return typeof cat === 'object' ? cat.slug || '' : ''
}

function catCount(cat) {
  if (typeof cat === 'object' && cat.article_count !== undefined) return cat.article_count
  if (typeof cat === 'object' && cat.count !== undefined) return cat.count
  return 0
}

async function loadCategories() {
  loading.value = true
  error.value = null
  try {
    await articleStore.fetchCategories()
  } catch (e) {
    error.value = e?.response?.data?.detail || e.message || '加载分类失败'
  } finally {
    loading.value = false
  }
}

onMounted(loadCategories)
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-categories {
  max-width: 1200px;
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

// ---- Category Grid ----
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 20px;
  background: $bg-card;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid $glass-border;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition:
    transform $transition-base,
    box-shadow $transition-base,
    border-color $transition-base;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba($neon-cyan, 0.3);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 0 20px rgba($neon-cyan, 0.08);
  }
}

.card-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba($neon-cyan, 0.06);
  border: 1px solid rgba($neon-cyan, 0.15);
  color: $neon-cyan;
  margin-bottom: 16px;
  transition: background $transition-fast, box-shadow $transition-fast;

  .category-card:hover & {
    background: rgba($neon-cyan, 0.12);
    box-shadow: 0 0 16px rgba($neon-cyan, 0.15);
  }
}

.category-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 8px;
  transition: color $transition-fast;

  .category-card:hover & {
    color: $neon-cyan;
    text-shadow: 0 0 7px rgba($neon-cyan, 0.4);
  }
}

.category-count {
  font-size: 0.8rem;
  color: $text-secondary;
  padding: 2px 12px;
  border: 1px solid $glass-border;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
}

// ---- Skeleton ----
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.skeleton-card {
  background: $bg-card;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid $glass-border;
  padding: 32px 20px;
}

.skeleton-body {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.w-60 { width: 60%; }
.w-30 { width: 30%; }

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
