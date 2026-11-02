<template>
  <nav v-if="items.length >= 3" class="series-nav" aria-label="本系列目录">
    <div class="series-head">
      <div class="series-head__text">
        <span class="series-kicker">{{ topic.en }}</span>
        <strong class="series-title">本系列 · {{ topic.name }}</strong>
      </div>
      <span class="series-progress">
        第 {{ Math.max(currentIndex + 1, 1) }} / {{ items.length }} 篇
      </span>
    </div>

    <ol class="series-list">
      <li
        v-for="(item, index) in items"
        :key="item.slug"
        class="series-item"
        :class="{ 'is-current': item.slug === currentSlug }"
      >
        <span class="series-num">{{ String(index + 1).padStart(2, '0') }}</span>
        <span v-if="item.slug === currentSlug" class="series-current" aria-current="page">
          {{ item.title }}
        </span>
        <router-link v-else :to="'/article/' + item.slug" class="series-link">
          {{ item.title }}
        </router-link>
      </li>
    </ol>

    <router-link :to="topicPath(topic.slug)" class="series-more">
      查看 {{ topic.name }} 专题 →
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { topicPath } from '@/data/topics'

const props = defineProps({
  topic: { type: Object, required: true },
  items: { type: Array, default: () => [] },
  currentSlug: { type: String, default: '' },
})

const currentIndex = computed(() =>
  props.items.findIndex((item) => item.slug === props.currentSlug),
)
</script>

<style scoped>
.series-nav {
  margin: 26px 0 30px;
  padding: 18px 20px 14px;
  border: 1px solid var(--glass-border, #dce2da);
  border-radius: 10px;
  background: var(--surface-muted, #f6f7f2);
}

.series-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--glass-border, #dce2da);
}

.series-head__text {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.series-kicker {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent, #3f6b57);
}

.series-title {
  font-size: 0.92rem;
  color: var(--text-primary, #1f2a24);
  white-space: nowrap;
}

.series-progress {
  flex: none;
  font-size: 0.72rem;
  color: var(--text-secondary, #657168);
  font-variant-numeric: tabular-nums;
}

.series-list {
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
  max-height: 320px;
  overflow-y: auto;
}

.series-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 5px 0;
  font-size: 0.84rem;
  line-height: 1.55;
}

.series-num {
  flex: none;
  width: 1.6em;
  font-size: 0.72rem;
  color: var(--text-secondary, #657168);
  font-variant-numeric: tabular-nums;
}

.series-link {
  color: var(--text-primary, #1f2a24);
  text-decoration: none;
  border-bottom: 1px solid transparent;
}

.series-link:hover {
  color: var(--accent, #3f6b57);
  border-bottom-color: var(--accent, #3f6b57);
}

.series-item.is-current .series-num {
  color: var(--accent, #3f6b57);
  font-weight: 700;
}

.series-current {
  color: var(--accent, #3f6b57);
  font-weight: 600;
}

.series-more {
  display: inline-block;
  margin-top: 8px;
  font-size: 0.74rem;
  color: var(--text-secondary, #657168);
  text-decoration: none;
}

.series-more:hover {
  color: var(--accent, #3f6b57);
}

@media (max-width: 640px) {
  .series-nav {
    padding: 14px 16px 12px;
    margin: 20px 0 24px;
  }
  .series-list {
    max-height: 260px;
  }
  .series-item {
    font-size: 0.8rem;
  }
}
</style>
