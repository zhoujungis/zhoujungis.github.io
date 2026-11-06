<template>
  <EnShell>
    <section class="head">
      <h1>{{ ui.articles.title }}</h1>
      <p>{{ ui.articles.lead }}</p>
    </section>
    <EnPostList :articles="articles" :empty="ui.home.emptyNote" />
  </EnShell>
</template>

<script setup>
import EnShell from '@/components/en/EnShell.vue'
import EnPostList from '@/components/en/EnPostList.vue'
import { EN_ARTICLES } from '@/data/en/articles'
import { EN_UI } from '@/data/en/site'

const ui = EN_UI
const articles = EN_ARTICLES
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
$serif: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', serif;

.head {
  margin: 32px 0 8px;

  h1 {
    margin: 0;
    font-family: $serif;
    font-size: 1.7rem;
    font-weight: 900;
  }

  p {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 0.88rem;
  }
}
</style>
