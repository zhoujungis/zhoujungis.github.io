<template>
  <div class="page page-collection">
    <header class="collection-header">
      <nav class="collection-breadcrumb" aria-label="面包屑">
        <router-link to="/">首页</router-link>
        <span aria-hidden="true">/</span>
        <router-link :to="indexPath">{{ kindName }}</router-link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ label }}</span>
      </nav>

      <p class="collection-kicker">{{ kind === 'tag' ? 'TAG' : 'CATEGORY' }}</p>
      <h1 class="collection-title">{{ label }}</h1>
      <p class="collection-lead">
        <template v-if="loading">正在整理这个{{ kindName }}下的文章…</template>
        <template v-else>共 {{ articles.length }} 篇与「{{ label }}」相关的文章。</template>
      </p>
    </header>

    <section class="collection-list">
      <div v-if="loading" class="skeleton-list">
        <div v-for="i in 4" :key="i" class="skeleton-card" />
      </div>

      <div v-else-if="error" class="state-message">
        <p>{{ error }}</p>
        <button class="retry-btn" @click="load">重试</button>
      </div>

      <div v-else-if="!articles.length" class="state-message">
        <p>这个{{ kindName }}下还没有文章。</p>
        <router-link :to="indexPath" class="retry-btn">返回全部{{ kindName }}</router-link>
      </div>

      <template v-else>
        <ArticleCard v-for="article in articles" :key="article.slug" :article="article" />
        <p class="collection-nav">
          <router-link :to="indexPath">← 全部{{ kindName }}</router-link>
        </p>
      </template>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { getArticles } from '@/api/articles'
import { useSEO } from '@/utils/seo'
import { SITE_NAME, SITE_ORIGIN, tagPath } from '@/utils/siteConfig'
import { catLabel, catSlug, tagLabel, tagSlug } from '@/utils/labels'
import { categoryPath, findTopic, topicPath } from '@/data/topics'
import ArticleCard from '@/components/ArticleCard.vue'

const props = defineProps({
  kind: { type: String, default: 'tag' },
})

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

const articles = ref([])
const label = ref('')
const loading = ref(false)
const error = ref(null)

const kindName = computed(() => (props.kind === 'tag' ? '标签' : '分类'))
const indexPath = computed(() => (props.kind === 'tag' ? '/tags' : '/categories'))

/** 运行时按 slug 找展示名；接口取不到时退回 slug 本身，页面仍可读。 */
function resolveLabel(slug) {
  if (props.kind === 'tag') {
    const hit = (articleStore.tags || []).find((t) => tagSlug(t) === slug)
    return hit ? tagLabel(hit) : slug
  }
  const hit = (articleStore.categories || []).find((c) => catSlug(c) === slug)
  return hit ? catLabel(hit) : slug
}

async function load() {
  const slug = route.params.slug
  if (!slug) return

  // 有对应专题的分类不另建页面：直接跳到专题聚合页，避免同一批文章
  // 在 /categories/<slug>/ 和 /topics/<slug>/ 上出现两份重复内容。
  if (props.kind === 'category' && findTopic(slug)) {
    router.replace(topicPath(slug))
    return
  }

  loading.value = true
  error.value = null
  label.value = slug

  try {
    const indexRequest =
      props.kind === 'tag'
        ? articleStore.fetchTags()
        : articleStore.fetchCategories()
    // 名称只是标题/文案，取不到也不该把整页拖进错误态。
    await indexRequest.catch(() => {})
    label.value = resolveLabel(slug)

    const params =
      props.kind === 'tag'
        ? { tags__slug: slug, page_size: 100 }
        : { category__slug: slug, page_size: 100 }
    const res = await getArticles(params)
    const data = res.data
    articles.value = Array.isArray(data) ? data : data?.results || []

    const canonical =
      props.kind === 'tag' ? tagPath(slug) : categoryPath(slug)
    const headline = articles.value.slice(0, 3).map((a) => a.title)
    useSEO({
      title: `${label.value} ${kindName.value}`,
      description:
        `${SITE_NAME}「${label.value}」${kindName.value}下的 ${articles.value.length} 篇文章` +
        (headline.length ? `：${headline.join('、')}。` : '。'),
      url: `${SITE_ORIGIN}${canonical}`,
    })
  } catch (e) {
    error.value = e?.response?.data?.detail || '加载文章失败'
    articles.value = []
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, load, { immediate: true })
</script>

<style lang="scss" scoped>
.page-collection {
  max-width: 820px;
  margin: 0 auto;
  padding: 56px 20px 24px;
}

.collection-header {
  margin-bottom: 36px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-subtle, #dce2da);
}

.collection-breadcrumb {
  font-size: 0.8rem;
  color: var(--text-secondary, #657168);
  margin-bottom: 20px;

  a {
    color: inherit;
    text-decoration: none;

    &:hover { color: var(--accent, #3f6b57); }
  }

  span { margin: 0 0.4em; }
}

.collection-kicker {
  font-family: var(--font-mono, 'SFMono-Regular', Consolas, monospace);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  color: var(--accent, #3f6b57);
  margin-bottom: 8px;
}

.collection-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.collection-lead {
  font-size: 0.92rem;
  color: var(--text-secondary);
}

.collection-list {
  display: grid;
  gap: 22px;
}

.collection-nav {
  padding-top: 20px;
  border-top: 1px solid var(--border-subtle, #dce2da);
  font-size: 0.86rem;

  a {
    color: var(--accent, #3f6b57);
    text-decoration: none;
  }
}

.skeleton-list { display: grid; gap: 20px; }

.skeleton-card {
  height: 132px;
  border-radius: 10px;
  background: var(--surface-muted, #f2f4ee);
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.state-message {
  padding: 60px 0;
  text-align: center;
  color: var(--text-secondary);
}

.retry-btn {
  display: inline-block;
  margin-top: 14px;
  padding: 8px 22px;
  font: inherit;
  font-size: 0.84rem;
  color: var(--accent, #3f6b57);
  background: transparent;
  border: 1px solid var(--accent-line, #c9d6cc);
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;

  &:hover { background: var(--accent-soft, #ecefe8); }
}

@media (max-width: 640px) {
  .page-collection { padding: 36px 14px 16px; }
  .collection-title { font-size: 1.65rem; }
}
</style>
