<template>
  <div class="page page-topics">
    <header class="page-header">
      <p class="page-kicker">TOPICS</p>
      <h1 class="page-title">按专题深入</h1>
      <p class="page-subtitle">
        不再按时间散着读。五个专题，各自是一条可以顺着往下走的线。
      </p>
    </header>

    <div class="topic-grid">
      <router-link
        v-for="(topic, index) in topics"
        :key="topic.slug"
        :to="topicPath(topic.slug)"
        class="topic-card"
      >
        <span class="topic-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <div class="topic-main">
          <h2 class="topic-name">{{ topic.name }}</h2>
          <p class="topic-en">{{ topic.en }}</p>
          <p class="topic-tagline">{{ topic.tagline }}</p>
        </div>
        <span class="topic-count">{{ countOf(topic.slug) }} 篇</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { TOPICS, topicPath } from '@/data/topics'
import { useArticleStore } from '@/stores/article'

const topics = TOPICS
const articleStore = useArticleStore()

const counts = computed(() => {
  const map = {}
  for (const cat of articleStore.categories || []) {
    const slug = typeof cat === 'object' ? cat.slug : ''
    if (slug) map[slug] = cat.article_count ?? cat.count ?? 0
  }
  return map
})

function countOf(slug) {
  return counts.value[slug] ?? '—'
}

onMounted(() => {
  // 数量只是装饰信息，取不到就显示「—」，不该让整页进入错误态。
  articleStore.fetchCategories().catch(() => {})
})
</script>

<style lang="scss" scoped>
.page-topics {
  max-width: 1060px;
  margin: 0 auto;
  padding: 56px 20px 24px;
}

.page-header {
  margin-bottom: 36px;
}

.page-kicker {
  font-family: var(--font-mono, 'SFMono-Regular', Consolas, monospace);
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.page-title {
  font-size: 2.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.page-subtitle {
  max-width: 640px;
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.topic-grid {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--border-subtle, #dce2da);
}

.topic-card {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 20px;
  align-items: baseline;
  padding: 26px 4px;
  border-bottom: 1px solid var(--border-subtle, #dce2da);
  color: inherit;
  text-decoration: none;
  transition: background 0.18s ease, padding-left 0.18s ease;

  &:hover {
    background: var(--surface-muted, #f2f4ee);
    padding-left: 12px;
  }
}

.topic-index {
  font-family: var(--font-mono, 'SFMono-Regular', Consolas, monospace);
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.topic-name {
  font-size: 1.35rem;
  font-weight: 650;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.topic-en {
  font-family: var(--font-mono, 'SFMono-Regular', Consolas, monospace);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent, #3f6b57);
  margin-bottom: 8px;
}

.topic-tagline {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-secondary);
}

.topic-count {
  font-size: 0.78rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .page-topics { padding: 36px 14px 16px; }
  .page-title { font-size: 1.7rem; }
  .topic-card {
    grid-template-columns: 32px 1fr;
    gap: 12px;
  }
  .topic-count {
    grid-column: 2;
  }
}
</style>
