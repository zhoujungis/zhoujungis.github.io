<template>
  <EnShell>
    <article v-if="article" class="post">
      <p class="post__eyebrow">
        <a href="/en/articles/">Articles</a>
        <template v-if="topic"> / {{ topic.name }}</template>
      </p>
      <h1>{{ article.title }}</h1>
      <p class="post__meta">{{ article.date }} · {{ article.readingTime }} min read · Stack Frame</p>
      <div class="markdown-body" v-html="article.html" />
      <nav class="post__foot">
        <a href="/en/articles/">← All English posts</a>
        <a v-if="article.zhSlug" :href="`/article/${article.zhSlug}/`" hreflang="zh-CN">
          Read in Chinese →
        </a>
      </nav>
    </article>

    <p v-else class="missing">
      No English edition for this post yet. <a href="/en/articles/">Back to the list</a>.
    </p>
  </EnShell>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import EnShell from '@/components/en/EnShell.vue'
import { EN_BY_SLUG } from '@/data/en/articles'
import { enTopic } from '@/data/en/site'

const route = useRoute()
const article = computed(() => EN_BY_SLUG.get(route.params.slug))
const topic = computed(() => (article.value?.topicSlug ? enTopic(article.value.topicSlug) : null))
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
$serif: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', serif;

.post {
  margin-top: 32px;

  &__eyebrow {
    margin: 0 0 8px;
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.68rem;
    letter-spacing: 0.06em;

    a { color: var(--accent); text-decoration: none; }
  }

  h1 {
    margin: 0 0 0.35em;
    font-family: $serif;
    font-size: clamp(1.6rem, 3.6vw, 2rem);
    font-weight: 900;
    line-height: 1.3;
  }

  &__meta {
    margin: 0 0 2em;
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.7rem;
  }

  &__foot {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 48px;
    padding-top: 14px;
    border-top: 1px solid var(--glass-border);
    font-size: 0.82rem;

    a { color: var(--accent); text-decoration: none; }
  }
}

.missing {
  margin-top: 32px;
  color: var(--text-secondary);
  a { color: var(--accent); }
}
</style>
