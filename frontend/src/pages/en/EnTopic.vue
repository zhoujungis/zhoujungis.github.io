<template>
  <EnShell>
    <template v-if="topic">
      <section class="head">
        <p class="head__eyebrow">Topic</p>
        <h1>{{ topic.name }}</h1>
        <p class="head__tagline">{{ topic.tagline }}</p>
        <p class="head__intro">{{ topic.intro }}</p>
      </section>
      <EnPostList :articles="posts" :empty="ui.topics.empty" />
    </template>
    <p v-else class="missing">
      Unknown topic. <a href="/en/topics/">All topics</a>
    </p>
  </EnShell>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import EnShell from '@/components/en/EnShell.vue'
import EnPostList from '@/components/en/EnPostList.vue'
import { EN_ARTICLES } from '@/data/en/articles'
import { enTopic, EN_UI } from '@/data/en/site'

const route = useRoute()
const ui = EN_UI
const topic = computed(() => enTopic(route.params.slug))
const posts = computed(() =>
  EN_ARTICLES.filter((a) => a.topicSlug === route.params.slug),
)
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
$serif: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', serif;

.head {
  margin: 32px 0 8px;

  &__eyebrow {
    margin: 0 0 6px;
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.62rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
  }

  h1 { margin: 0; font-family: $serif; font-size: 1.7rem; font-weight: 900; }

  &__tagline {
    margin: 8px 0 0;
    color: var(--accent-secondary);
    font-weight: 700;
    font-size: 0.9rem;
  }

  &__intro {
    margin: 12px 0 0;
    color: var(--text-secondary);
    font-size: 0.88rem;
  }
}

.missing {
  margin-top: 32px;
  color: var(--text-secondary);
  a { color: var(--accent); }
}
</style>
