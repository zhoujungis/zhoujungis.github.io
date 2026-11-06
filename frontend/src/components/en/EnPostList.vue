<template>
  <ul class="en-posts">
    <li v-for="article in articles" :key="article.slug">
      <a :href="enPath.article(article.slug)">{{ article.title }}</a>
      <span class="en-posts__meta">
        {{ article.date }} · {{ article.readingTime }} min
        <template v-if="categoryOf(article)"> · {{ categoryOf(article) }}</template>
      </span>
      <p class="en-posts__excerpt">{{ article.excerpt }}</p>
    </li>
  </ul>
  <p v-if="!articles.length" class="en-posts__empty">{{ empty }}</p>
</template>

<script setup>
import { EN_ARTICLES } from '@/data/en/articles'
import { EN_TOPICS, enPath } from '@/data/en/site'

defineProps({
  articles: { type: Array, required: true },
  empty: { type: String, default: 'Nothing here yet.' },
})

// English posts don't carry a category field of their own; map the Chinese
// slug through the topic table so the list reads like the Chinese one.
const bySlug = new Map(EN_ARTICLES.map((a) => [a.slug, a]))
const topicName = new Map(EN_TOPICS.map((t) => [t.slug, t.name]))

function categoryOf(article) {
  const source = bySlug.get(article.slug)
  const topic = EN_TOPICS.find((t) => t.slug === source?.topicSlug)
  return topic ? topicName.get(topic.slug) : ''
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

$serif: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', serif;

.en-posts {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    padding: 18px 0;
    border-top: 1px solid var(--glass-border);
  }

  a {
    color: var(--text-primary);
    font-family: $serif;
    font-size: 1.02rem;
    font-weight: 800;
    text-decoration: none;

    &:hover { color: var(--accent); }
  }

  &__meta {
    display: block;
    margin-top: 4px;
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.7rem;
  }

  &__excerpt {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 0.85rem;
  }

  &__empty {
    margin-top: 16px;
    color: var(--text-secondary);
    font-size: 0.85rem;
  }
}
</style>
