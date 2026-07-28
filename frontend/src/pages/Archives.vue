<template>
  <div class="page page-archives">
    <header class="page-header">
      <h1 class="page-title neon-text-cyan">归档</h1>
      <p class="page-subtitle">按时间线浏览所有文章</p>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="skeleton-timeline">
        <div v-for="i in 8" :key="i" class="skeleton-entry">
          <div class="skeleton-dot" />
          <div class="skeleton-line w-40" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-message">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="loadArchives">重试</button>
    </div>

    <!-- Empty -->
    <div v-else-if="!groupedArchives.length" class="state-message">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
      <p>暂无文章</p>
    </div>

    <!-- Timeline -->
    <div v-else class="timeline">
      <template v-for="(yearGroup, yi) in groupedArchives" :key="yi">
        <!-- Year heading -->
        <div class="year-heading">
          <span class="year-badge">{{ yearGroup.year }}</span>
          <span class="year-count">{{ yearGroup.count }} 篇</span>
        </div>

        <div class="year-section">
          <template v-for="(monthGroup, mi) in yearGroup.months" :key="mi">
            <!-- Month heading -->
            <div class="month-heading">{{ monthGroup.month }} 月</div>

            <!-- Entries -->
            <div
              v-for="article in monthGroup.articles"
              :key="article.slug || article.id"
              class="timeline-entry"
            >
              <div class="timeline-dot" />
              <div class="timeline-line-connector" />
              <div class="entry-content glass-card">
                <time class="entry-date">{{ formatDate(article.created_at) }}</time>
                <router-link
                  :to="'/article/' + article.slug"
                  class="entry-title"
                >
                  {{ article.title }}
                </router-link>
                <div v-if="article.tags && article.tags.length" class="entry-tags">
                  <span
                    v-for="(tag, idx) in article.tags"
                    :key="idx"
                    class="tag-pill"
                  >{{ tagLabel(tag) }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useArticleStore } from '@/stores/article'

const articleStore = useArticleStore()

const loading = ref(false)
const error = ref(null)

const groupedArchives = computed(() => {
  const articles = articleStore.articles || []
  if (!articles.length) return []

  // M15: missing/invalid timestamps get a fallback bucket so the page doesn't
  // render NaN year/month labels. Unknown-date items sort to the end.
  const unknownBucket = { year: '未知日期', count: 0, months: [{ month: '—', articles: [] }] }
  const yearsMap = new Map()

  const sorted = [...articles].sort((a, b) => {
    const ta = a?.created_at ? new Date(a.created_at).getTime() : NaN
    const tb = b?.created_at ? new Date(b.created_at).getTime() : NaN
    // Valid dates first (desc), unknowns last
    const va = Number.isFinite(ta)
    const vb = Number.isFinite(tb)
    if (va && vb) return tb - ta
    if (va) return -1
    if (vb) return 1
    return 0
  })

  for (const article of sorted) {
    const date = article?.created_at ? new Date(article.created_at) : null
    if (!date || isNaN(date.getTime())) {
      unknownBucket.months[0].articles.push(article)
      unknownBucket.count++
      continue
    }
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    if (!yearsMap.has(year)) {
      yearsMap.set(year, new Map())
    }
    const monthsMap = yearsMap.get(year)

    if (!monthsMap.has(month)) {
      monthsMap.set(month, [])
    }
    monthsMap.get(month).push(article)
  }

  // Convert to display structure
  const result = []
  const yearsSorted = [...yearsMap.keys()].sort((a, b) => b - a)

  for (const year of yearsSorted) {
    const monthsMap = yearsMap.get(year)
    const monthsSorted = [...monthsMap.keys()].sort((a, b) => b - a)

    const months = monthsSorted.map((month) => ({
      month,
      articles: monthsMap.get(month),
    }))

    const count = months.reduce((sum, m) => sum + m.articles.length, 0)

    result.push({ year, count, months })
  }

  if (unknownBucket.count > 0) result.push(unknownBucket)
  return result
})

function formatDate(dateStr) {
  if (!dateStr) return '未知日期'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '未知日期'
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function tagLabel(tag) {
  if (!tag) return ''
  return typeof tag === 'object' ? tag.name || '' : tag
}

async function loadArchives() {
  loading.value = true
  error.value = null
  try {
    // Fetch all articles with a large page size
    await articleStore.fetchArticles({ page_size: 1000 })
  } catch (e) {
    error.value = e?.response?.data?.detail || e.message || '加载归档失败'
  } finally {
    loading.value = false
  }
}

onMounted(loadArchives)
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-archives {
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

// ---- Timeline ----
.timeline {
  position: relative;
}

// Year heading
.year-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-top: 8px;
}

.year-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 16px;
  font-size: 1rem;
  font-weight: 800;
  color: $neon-purple;
  border: 1px solid rgba($neon-purple, 0.3);
  border-radius: 8px;
  background: rgba($neon-purple, 0.06);
}

.year-count {
  font-size: 0.85rem;
  color: $text-secondary;
}

// Year section with timeline line
.year-section {
  position: relative;
  padding-left: 32px;
  margin-bottom: 40px;

  &::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba($neon-purple, 0.25);
    border-radius: 2px;
  }
}

// Month heading
.month-heading {
  font-size: 0.9rem;
  font-weight: 700;
  color: $neon-cyan;
  margin-bottom: 12px;
  margin-top: 20px;

  &:first-child {
    margin-top: 0;
  }
}

// Timeline entry
.timeline-entry {
  position: relative;
  margin-bottom: 16px;
}

.timeline-dot {
  position: absolute;
  left: -27px;
  top: 18px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: $neon-cyan;
  border: 2px solid $bg-primary;
  box-shadow: 0 0 0 3px rgba($neon-cyan, 0.12);
  z-index: 1;
}

.timeline-line-connector {
  display: none;
}

// Entry content
.entry-content {
  padding: 14px 18px;
  transition: border-color $transition-fast, box-shadow $transition-fast;

  &:hover {
    border-color: rgba($neon-cyan, 0.2);
  }
}

.entry-date {
  display: block;
  font-size: 0.78rem;
  color: $text-secondary;
  margin-bottom: 4px;
}

.entry-title {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: $text-primary;
  text-decoration: none;
  line-height: 1.4;
  transition: color $transition-fast;

  .entry-content:hover & {
    color: $neon-cyan;
  }
}

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.tag-pill {
  display: inline-block;
  padding: 1px 8px;
  font-size: 0.68rem;
  color: $neon-purple;
  border: 1px solid $neon-purple;
  border-radius: 999px;
}

// ---- Skeleton ----
.loading-state {
  padding: 40px 0;
}

.skeleton-timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-entry {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-left: 16px;
}

.skeleton-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
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

.w-40 { width: 40%; }

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
  .page-archives { padding: 32px 14px 16px; }
  .page-title { font-size: 2rem; }
  .year-section { padding-left: 26px; }
  .timeline-dot { left: -22px; }
  .entry-content { padding: 13px 14px; }
}
</style>
