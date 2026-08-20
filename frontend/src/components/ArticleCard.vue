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
          v-for="(tag, idx) in visibleTags"
          :key="idx"
          class="tag-pill"
        >{{ tagLabel(tag) }}</span>
        <span v-if="hiddenTagCount > 0" class="tag-pill tag-pill-more">
          +{{ hiddenTagCount }}
        </span>
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

// P4: cap the tag row so a dozen tags can't stretch the card height.
const MAX_VISIBLE_TAGS = 4
const visibleTags = computed(() => (props.article.tags || []).slice(0, MAX_VISIBLE_TAGS))
const hiddenTagCount = computed(() =>
  Math.max(0, (props.article.tags || []).length - MAX_VISIBLE_TAGS),
)
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.article-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
  background: $bg-card;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition:
    transform $transition-base,
    box-shadow $transition-base,
    border-color $transition-base;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba($accent-pink, 0.4);
    box-shadow: $card-shadow-hover;
  }
}

// ---- Cover image ----
.card-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: $bg-secondary;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-slow;
  }

  .article-card:hover & img {
    transform: scale(1.025);
  }
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
  color: #fffaf5;
  background: $neon-pink;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba($neon-pink, 0.2);
  letter-spacing: 0;
}

// ---- Card body ----
.card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 21px 22px 22px;
}

.card-title {
  font-size: 1.16rem;
  font-weight: 720;
  line-height: 1.45;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: $text-primary;
  transition: color $transition-fast;

  .article-card:hover & {
    color: $accent-pink;
  }
}

// ---- Meta row ----
.card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.76rem;
  color: $text-secondary;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.meta-date {
  white-space: nowrap;
}

.meta-category {
  font-weight: 600;
  white-space: nowrap;
  color: $accent-purple;
  text-shadow: none;
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
  color: $text-secondary;

  svg {
    opacity: 0.7;
  }
}

// ---- Tags ----
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag-pill {
  display: inline-block;
  padding: 2px 8px;
  font-size: 0.7rem;
  color: #6e765f;
  background: #f2f3ec;
  border: 1px solid #e1e4d9;
  border-radius: 999px;
}

// "+N" overflow indicator
.tag-pill-more {
  color: $text-secondary;
  background: transparent;
  border-style: dashed;
}

// ---- Excerpt ----
.card-excerpt {
  margin-top: auto;
  font-size: 0.875rem;
  color: $text-secondary;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 767px) {
  .card-body { padding: 17px 16px 18px; }
  .card-title { font-size: 1.08rem; }
  .card-meta { gap: 8px; }
}
</style>
