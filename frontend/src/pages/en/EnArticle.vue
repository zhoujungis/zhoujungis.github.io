<template>
  <div class="en-page">
    <header class="en-top">
      <a class="en-brand" href="/en/">
        <span class="en-brand__name">Stack Frame</span>
        <span class="en-brand__sub">Code &amp; Life · Journal</span>
      </a>
      <nav class="en-nav">
        <a v-if="article?.zhSlug" :href="`/article/${article.zhSlug}/`">中文</a>
        <a href="/en/">All English posts</a>
        <a href="https://blog.zhoujun.dev/rss.xml">RSS</a>
      </nav>
    </header>

    <article v-if="article" class="en-article">
      <h1>{{ article.title }}</h1>
      <p class="en-meta">{{ article.date }} · {{ article.readingTime }} min read · Stack Frame</p>
      <div class="markdown-body" v-html="article.html" />
    </article>

    <p v-else class="en-missing">
      This post has no English edition yet. <a href="/en/">Back to the English index</a>.
    </p>

    <footer class="en-foot">
      <a href="/en/">← All English posts</a>
      <a v-if="article?.zhSlug" :href="`/article/${article.zhSlug}/`">Read in Chinese →</a>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { EN_BY_SLUG } from '@/data/en/articles'

const route = useRoute()
const article = computed(() => EN_BY_SLUG.get(route.params.slug))
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

$serif: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', serif;

.en-page {
  width: min(100% - 48px, 760px);
  margin-inline: auto;
  padding: 96px 0 64px;
  color: var(--text-primary);
  line-height: 1.85;
}

.en-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
  padding-bottom: 12px;
  border-bottom: 3px solid var(--text-primary);
}

.en-brand {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;

  &__name {
    font-family: $serif;
    font-size: 1.35rem;
    font-weight: 900;
  }

  &__sub {
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.66rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }
}

.en-nav {
  display: flex;
  gap: 16px;

  a {
    color: var(--accent);
    font-size: 0.82rem;
    font-weight: 600;
    text-decoration: none;

    &:hover { text-decoration: underline; }
  }
}

.en-article {
  margin-top: 32px;

  h1 {
    margin: 0 0 0.4em;
    font-family: $serif;
    font-size: 1.9rem;
    font-weight: 900;
    line-height: 1.3;
  }
}

.en-meta {
  margin: 0 0 2em;
  color: var(--text-secondary);
  font-family: $font-mono;
  font-size: 0.72rem;
}

.en-missing {
  margin-top: 32px;
  color: var(--text-secondary);

  a { color: var(--accent); }
}

.en-foot {
  display: flex;
  justify-content: space-between;
  margin-top: 48px;
  padding-top: 14px;
  border-top: 1px solid var(--glass-border);
  font-size: 0.82rem;

  a {
    color: var(--accent);
    text-decoration: none;
  }
}
</style>
