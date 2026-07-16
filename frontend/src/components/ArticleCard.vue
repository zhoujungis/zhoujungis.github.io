<template>
  <router-link :to="'/article/' + article.slug" class="article-card">
    <!-- Cover image -->
    <div v-if="article.cover_image && !coverBroken" class="card-cover">
      <img
        :src="article.cover_image"
        :alt="article.title"
        :loading="article.is_top ? 'eager' : 'lazy'"
        :decoding="article.is_top ? 'sync' : 'async'"
        :fetchpriority="article.is_top ? 'high' : 'auto'"
        @error="coverBroken = true"
      />
      <div class="cover-gradient" />
    </div>

    <!-- Pinned badge -->
    <div v-if="article.is_top" class="top-badge">置顶</div>

    <div class="card-body">
      <h2 v-if="highlight" class="card-title">
        <template v-for="(seg, i) in titleSegments" :key="i">
          <mark v-if="seg.match" class="search-highlight">{{ seg.text }}</mark>
          <template v-else>{{ seg.text }}</template>
        </template>
      </h2>
      <h2 v-else class="card-title">{{ article.title }}</h2>

      <div class="card-meta">
        <span class="meta-date">{{ formattedDate }}</span>
        <span v-if="article.category" class="meta-category neon-text-pink">
          {{ categoryName }}
        </span>
        <span v-if="article.reading_time" class="meta-reading-time">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {{ article.reading_time }} 分钟
        </span>
        <span class="meta-views">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          {{ article.views_count || 0 }}
        </span>
      </div>

      <div v-if="article.tags && article.tags.length" class="card-tags">
        <span
          v-for="(tag, idx) in article.tags"
          :key="idx"
          class="tag-pill"
        >{{ tagLabel(tag) }}</span>
      </div>

      <p v-if="article.excerpt" class="card-excerpt">{{ article.excerpt }}</p>
    </div>
  </router-link>
</template>

<script setup>
import { computed, ref } from 'vue'
import { catLabel, tagLabel } from '@/utils/labels'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
  highlight: {
    type: String,
    default: '',
  },
})

// L13: hide the cover if the URL 404s or the host is down. Without this,
// broken-image icons litter the homepage on every stale cover link.
const coverBroken = ref(false)

function highlightText(text) {
  if (!text || !props.highlight) return [{ text, match: false }]
  const escaped = props.highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(${escaped})`, 'gi')
  const segments = []
  let lastIndex = 0
  for (const m of text.matchAll(re)) {
    if (m.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, m.index), match: false })
    }
    segments.push({ text: m[0], match: true })
    lastIndex = m.index + m[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), match: false })
  }
  return segments
}

// M1: split into match/non-match segments so the title can be rendered via
// Vue text nodes + <mark> wrappers — never concatenated into v-html, which
// was XSS-vulnerable when article.title contained <script>/onerror payloads.
const titleSegments = computed(() => highlightText(props.article.title))

const formattedDate = computed(() => {
  if (!props.article.created_at) return ''
  const d = new Date(props.article.created_at)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
})

const categoryName = computed(() => catLabel(props.article.category))
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.article-card {
  display: block;
  position: relative;
  background: $bg-card;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid $glass-border;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition:
    transform $transition-base,
    box-shadow $transition-base,
    border-color $transition-base;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 0 20px rgba($neon-purple, 0.08);
  }
}

// ---- Cover image ----
.card-cover {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .article-card:hover & img {
    transform: scale(1.05);
  }
}

.cover-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(10, 10, 15, 0.85) 0%, transparent 100%);
}

// ---- Pinned badge ----
.top-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  padding: 3px 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  background: $neon-pink;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba($neon-pink, 0.5), 0 0 20px rgba($neon-pink, 0.25);
  letter-spacing: 0.5px;
}

// ---- Card body ----
.card-body {
  padding: 20px;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: $text-primary;
  transition: color $transition-fast, text-shadow $transition-fast;

  .article-card:hover & {
    color: $neon-cyan;
    text-shadow:
      0 0 7px rgba($neon-cyan, 0.6),
      0 0 10px rgba($neon-cyan, 0.3);
  }
}

// ---- Meta row ----
.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.8rem;
  color: $text-secondary;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.meta-date {
  white-space: nowrap;
}

.meta-category {
  font-weight: 600;
  white-space: nowrap;
}

.meta-views {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  svg {
    opacity: 0.6;
  }
}

.meta-reading-time {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  color: $accent-mint;

  svg {
    opacity: 0.7;
  }
}

// ---- Tags ----
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
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

// ---- Excerpt ----
.card-excerpt {
  font-size: 0.875rem;
  color: $text-secondary;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
