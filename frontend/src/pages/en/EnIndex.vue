<template>
  <div class="en-page">
    <header class="en-top">
      <a class="en-brand" href="/">
        <span class="en-brand__name">Stack Frame</span>
        <span class="en-brand__sub">Code &amp; Life · Journal</span>
      </a>
      <nav class="en-nav">
        <a href="/">中文</a>
        <a href="/articles/">All posts (中文)</a>
        <a href="https://blog.zhoujun.dev/rss.xml">RSS</a>
      </nav>
    </header>

    <section class="en-hero">
      <h1>Writing in English</h1>
      <p>
        Selected posts about the projects on this site — small desktop tools,
        embedded databases, AI agents and the engineering trade-offs behind
        them. The full archive is in Chinese; these are written for an English
        audience rather than machine-translated.
      </p>
      <p class="en-hero__meta">{{ articles.length }} post(s) · updated {{ updated }}</p>
    </section>

    <ul class="en-list">
      <li v-for="article in articles" :key="article.slug">
        <a :href="`/en/article/${article.slug}/`">{{ article.title }}</a>
        <span class="en-list__meta">{{ article.date }} · {{ article.readingTime }} min</span>
        <p class="en-list__excerpt">{{ article.excerpt }}</p>
      </li>
    </ul>

    <footer class="en-foot">
      <a href="/">← 中文版</a>
      <span>© Stack Frame</span>
    </footer>
  </div>
</template>

<script setup>
import { EN_ARTICLES } from '@/data/en/articles'

const articles = EN_ARTICLES
const updated = articles[0]?.date || ''
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

$serif: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', serif;

.en-page {
  width: min(100% - 48px, 760px);
  margin-inline: auto;
  padding: 96px 0 64px;
  color: var(--text-primary);
  line-height: 1.8;
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

.en-hero {
  margin-top: 32px;

  h1 {
    margin: 0 0 0.5em;
    font-family: $serif;
    font-size: 1.9rem;
    font-weight: 900;
    line-height: 1.25;
  }

  p {
    margin: 0.6em 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  &__meta {
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.04em;
  }
}

.en-list {
  list-style: none;
  margin: 36px 0 0;
  padding: 0;

  li {
    padding: 18px 0;
    border-top: 1px solid var(--glass-border);
  }

  a {
    color: var(--text-primary);
    font-family: $serif;
    font-size: 1.05rem;
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
}

.en-foot {
  display: flex;
  justify-content: space-between;
  margin-top: 48px;
  padding-top: 14px;
  border-top: 1px solid var(--glass-border);
  color: var(--text-secondary);
  font-size: 0.8rem;

  a {
    color: var(--accent);
    text-decoration: none;
  }
}
</style>
