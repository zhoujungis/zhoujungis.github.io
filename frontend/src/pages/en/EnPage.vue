<template>
  <EnShell>
    <section v-if="page" class="head">
      <h1>{{ page.title }}</h1>
      <p class="head__sub">{{ page.subtitle }}</p>
      <p class="head__updated">Last updated {{ page.updated }}</p>
    </section>

    <section v-if="page" class="body">
      <div v-for="section in page.sections" :key="section.heading" class="body__section">
        <h2>{{ section.heading }}</h2>
        <p v-for="(paragraph, i) in section.paragraphs || []" :key="i">{{ paragraph }}</p>
        <ul v-if="section.items?.length">
          <li v-for="item in section.items" :key="item.text">
            <a v-if="item.href" :href="item.href">{{ item.text }}</a>
            <span v-else>{{ item.text }}</span>
          </li>
        </ul>
      </div>
    </section>

    <p v-else class="missing">Page not found. <a href="/en/">Home</a></p>
  </EnShell>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import EnShell from '@/components/en/EnShell.vue'
import { EN_PAGE_BY_KEY } from '@/data/en/pages'

const route = useRoute()
const page = computed(() => EN_PAGE_BY_KEY.get(route.meta.enPageKey))
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
$serif: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', serif;

.head {
  margin: 32px 0 0;

  h1 { margin: 0; font-family: $serif; font-size: 1.8rem; font-weight: 900; }

  &__sub { margin: 8px 0 0; color: var(--accent-secondary); font-weight: 700; font-size: 0.92rem; }

  &__updated {
    margin: 6px 0 0;
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.68rem;
  }
}

.body {
  margin-top: 28px;

  &__section {
    padding: 20px 0;
    border-top: 1px solid var(--glass-border);

    h2 {
      margin: 0 0 0.6em;
      font-family: $serif;
      font-size: 1.08rem;
      font-weight: 800;
    }

    p {
      margin: 0.7em 0;
      color: var(--text-secondary);
      font-size: 0.88rem;
    }

    ul {
      margin: 0.6em 0;
      padding-left: 1.2em;

      li { margin: 0.4em 0; color: var(--text-secondary); font-size: 0.88rem; }
      a { color: var(--accent); }
    }
  }
}

.missing {
  margin-top: 32px;
  color: var(--text-secondary);
  a { color: var(--accent); }
}
</style>
