<template>
  <div class="page page-topic">
    <template v-if="topic">
      <header class="topic-header">
        <router-link to="/topics/" class="back-link">← 全部专题</router-link>
        <p class="topic-kicker">{{ topic.en }}</p>
        <h1 class="topic-title">{{ topic.name }}</h1>
        <p class="topic-tagline">{{ topic.tagline }}</p>
        <div class="topic-intro">
          <p v-for="(paragraph, i) in topic.intro" :key="i">{{ paragraph }}</p>
        </div>
      </header>

      <section class="topic-list">
        <div v-if="loading" class="skeleton-list">
          <div v-for="i in 4" :key="i" class="skeleton-card" />
        </div>

        <div v-else-if="error" class="state-message">
          <p>{{ error }}</p>
          <button class="retry-btn" @click="load">重试</button>
        </div>

        <div v-else-if="!articles.length" class="state-message">
          <p>这个专题还没有文章。</p>
        </div>

        <template v-else>
          <p class="list-count">共 {{ articles.length }} 篇</p>
          <ArticleCard v-for="article in articles" :key="article.slug" :article="article" />
        </template>
      </section>
    </template>

    <div v-else class="state-message">
      <p>这个专题不存在。</p>
      <router-link to="/topics/" class="retry-btn">返回全部专题</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findTopic, topicPath } from '@/data/topics'
import { getArticlesByCategory } from '@/api/articles'
import { useSEO } from '@/utils/seo'
import { SITE_ORIGIN } from '@/utils/siteConfig'
import ArticleCard from '@/components/ArticleCard.vue'

const route = useRoute()
const articles = ref([])
const loading = ref(false)
const error = ref(null)

const topic = computed(() => findTopic(route.params.slug))

async function load() {
  const slug = route.params.slug
  // 不存在的 slug 直接呈现「专题不存在」，而不是兜底到某个专题页——
  // 后者会让 /topics/foo/ 和 /topics/leetcode/ 变成两份重复内容。
  if (!topic.value) {
    articles.value = []
    loading.value = false
    error.value = null
    return
  }
  loading.value = true
  error.value = null
  // 专题页的 title/description 由这里统一写入口语化的介绍，而不是交给
  // applyRouteSeo 的通用文案——聚合页的排名靠的就是这段主题描述。
  useSEO({
    title: topic.value.name,
    description: `${topic.value.name}专题：${topic.value.tagline}。${topic.value.keywords}`,
    url: `${SITE_ORIGIN}${topicPath(slug)}`,
  })
  try {
    articles.value = await getArticlesByCategory(slug)
  } catch (e) {
    error.value = e?.response?.data?.detail || '加载专题文章失败'
    articles.value = []
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, load, { immediate: true })
</script>

<style lang="scss" scoped>
.page-topic {
  max-width: 820px;
  margin: 0 auto;
  padding: 56px 20px 24px;
}

.topic-header {
  margin-bottom: 40px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--border-subtle, #dce2da);
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  font-size: 0.82rem;
  color: var(--text-secondary);
  text-decoration: none;

  &:hover { color: var(--accent, #3f6b57); }
}

.topic-kicker {
  font-family: var(--font-mono, 'SFMono-Regular', Consolas, monospace);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent, #3f6b57);
  margin-bottom: 8px;
}

.topic-title {
  font-size: 2.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.topic-tagline {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.topic-intro {
  display: grid;
  gap: 12px;
  font-size: 0.94rem;
  line-height: 1.85;
  color: var(--text-primary);
}

.list-count {
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  margin-bottom: 18px;
}

.topic-list {
  display: grid;
  gap: 22px;
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
  margin-top: 14px;
  padding: 8px 22px;
  font: inherit;
  font-size: 0.84rem;
  color: var(--accent, #3f6b57);
  background: transparent;
  border: 1px solid var(--accent-line, #c9d6cc);
  border-radius: 999px;
  cursor: pointer;

  &:hover { background: var(--accent-soft, #ecefe8); }
}

@media (max-width: 640px) {
  .page-topic { padding: 36px 14px 16px; }
  .topic-title { font-size: 1.7rem; }
}
</style>
