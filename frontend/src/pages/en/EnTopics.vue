<template>
  <EnShell>
    <section class="head">
      <h1>{{ ui.topics.title }}</h1>
      <p>{{ ui.topics.lead }}</p>
    </section>

    <div class="topic-list">
      <a v-for="topic in topics" :key="topic.slug" :href="enPath.topic(topic.slug)" class="topic-row">
        <span class="topic-row__name">{{ topic.name }}</span>
        <span class="topic-row__tagline">{{ topic.tagline }}</span>
        <span class="topic-row__count">{{ ui.topics.count(countOf(topic.slug)) }}</span>
      </a>
    </div>
  </EnShell>
</template>

<script setup>
import EnShell from '@/components/en/EnShell.vue'
import { EN_ARTICLES } from '@/data/en/articles'
import { EN_TOPICS, EN_UI, enPath } from '@/data/en/site'

const ui = EN_UI
const topics = EN_TOPICS
const countOf = (slug) => EN_ARTICLES.filter((a) => a.topicSlug === slug).length
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
$serif: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', serif;

.head {
  margin: 32px 0 8px;

  h1 { margin: 0; font-family: $serif; font-size: 1.7rem; font-weight: 900; }
  p { margin: 8px 0 0; color: var(--text-secondary); font-size: 0.88rem; }
}

.topic-list { border-top: 1px solid var(--glass-border); }

.topic-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 16px;
  padding: 18px 4px;
  border-bottom: 1px solid var(--glass-border);
  color: inherit;
  text-decoration: none;

  &:hover .topic-row__name { color: var(--accent); }

  &__name {
    font-family: $serif;
    font-size: 1.05rem;
    font-weight: 800;
    transition: color $transition-fast;
  }

  &__count {
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.7rem;
    align-self: center;
  }

  &__tagline {
    grid-column: 1 / -1;
    color: var(--text-secondary);
    font-size: 0.82rem;
  }
}
</style>
