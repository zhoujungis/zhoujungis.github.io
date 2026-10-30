<template>
  <div class="page page-site-page">
    <header class="page-header">
      <p class="page-eyebrow">{{ doc.eyebrow }}</p>
      <h1 class="page-title">{{ doc.title }}</h1>
      <p class="page-subtitle">{{ doc.subtitle }}</p>
      <p class="page-updated">最近更新：{{ doc.updated }}</p>
    </header>

    <nav v-if="doc.sections.length > 3" class="doc-toc" aria-label="本页目录">
      <a
        v-for="(section, i) in doc.sections"
        :key="'toc' + i"
        :href="'#' + anchorOf(section.heading)"
        class="doc-toc__link"
      >{{ section.heading }}</a>
    </nav>

    <article class="doc">
      <section
        v-for="(section, i) in doc.sections"
        :key="i"
        :id="anchorOf(section.heading)"
        class="doc-section"
      >
        <h2 class="doc-section__heading">{{ section.heading }}</h2>
        <p v-for="(para, j) in section.paragraphs || []" :key="'p' + j" class="doc-section__para">
          {{ para }}
        </p>
        <ul v-if="section.items && section.items.length" class="doc-list">
          <li v-for="(item, k) in section.items" :key="'i' + k">
            <a v-if="item.href" :href="item.href" target="_blank" rel="noopener noreferrer">{{ item.text }}</a>
            <template v-else>{{ item.text }}</template>
          </li>
        </ul>
      </section>
    </article>

    <nav class="doc-foot" aria-label="相关页面">
      <router-link
        v-for="page in siblings"
        :key="page.key"
        :to="page.path"
        class="doc-foot__link"
      >{{ page.title }}</router-link>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { SITE_PAGES, getSitePage } from '@/data/sitePages'

const route = useRoute()

// 三条路由共用这一个组件，文档由路由 meta 里的 sitePage key 决定；
// key 缺失时退化成 about，避免整页白屏。
const doc = computed(() => getSitePage(route.meta.sitePage) || SITE_PAGES[0])

const siblings = computed(() => SITE_PAGES.filter((p) => p.key !== doc.value.key))

// 标题 → 锚点。中文标题保留原字符（浏览器支持），只把空白换成连字符；
// 与预渲染快照里生成的 id 规则保持一致，深链才能直接落到对应小节。
function anchorOf(heading) {
  return (
    'sec-' +
    String(heading || '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\p{L}\p{N}-]/gu, '')
      .toLowerCase()
  )
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-site-page {
  max-width: 1160px;
  margin: 0 auto;
  padding: 52px 20px 24px;
}

.page-header {
  max-width: 720px;
  margin-bottom: 28px;
}

.page-eyebrow {
  margin-bottom: 8px;
  color: var(--accent);
  font-family: $font-mono;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.page-title {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.2;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 0.92rem;
  line-height: 1.7;
}

.page-updated {
  margin-top: 10px;
  color: var(--text-secondary);
  font-family: $font-mono;
  font-size: 0.72rem;
  opacity: 0.75;
}

// 页内目录：横向 chips，长文档（隐私政策 11 节）也能一眼看到结构
.doc-toc {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 760px;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--glass-border);
}

.doc-toc__link {
  padding: 4px 11px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  font-size: 0.76rem;
  text-decoration: none;
  transition: color $transition-fast, border-color $transition-fast, background $transition-fast;

  &:hover {
    color: var(--accent);
    background: var(--accent-soft);
    border-color: var(--accent-line);
  }
}

.doc {
  max-width: 760px;
}

.doc-section {
  margin-bottom: 34px;
  scroll-margin-top: 92px; // 固定导航挡住的锚点位置

  &:last-child { margin-bottom: 0; }
}

.doc-section__heading {
  margin: 0 0 12px;
  padding-left: 12px;
  color: var(--text-primary);
  border-left: 3px solid var(--accent);
  font-size: 1.12rem;
  font-weight: 700;
  line-height: 1.5;
}

.doc-section__para {
  margin: 0 0 12px;
  color: var(--text-secondary);
  font-size: 0.94rem;
  line-height: 1.85;

  &:last-child { margin-bottom: 0; }
}

.doc-list {
  margin: 4px 0 0;
  padding-left: 20px;
  color: var(--text-secondary);
  font-size: 0.94rem;
  line-height: 1.85;

  li { margin-bottom: 8px; }
  li:last-child { margin-bottom: 0; }

  a {
    color: var(--accent);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;

    &:hover { text-decoration-thickness: 2px; }
  }
}

.doc-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-width: 760px;
  margin-top: 44px;
  padding-top: 24px;
  border-top: 1px solid var(--glass-border);
}

.doc-foot__link {
  padding: 7px 15px;
  color: var(--text-secondary);
  background: var(--surface-muted);
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  font-size: 0.8rem;
  text-decoration: none;
  transition: color $transition-fast, border-color $transition-fast;

  &:hover { color: var(--accent); border-color: var(--accent-line); }
}

@media (max-width: 767px) {
  .page-site-page { padding: 36px 16px 20px; }
  .page-title { font-size: 1.9rem; }
}
</style>
