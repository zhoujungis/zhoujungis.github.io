<template>
  <aside class="side-panel">
    <!-- Mini About -->
    <section class="panel-section">
      <div class="mini-about">
        <div class="avatar">
          <span class="avatar-text">ZJ</span>
        </div>
        <h3 class="about-name neon-text-cyan">Zhou Jun</h3>
        <p class="about-bio">热爱技术与科学</p>
        <div class="social-links">
          <a
            href="https://github.com/zhoujun"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            title="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          <a
            href="https://twitter.com/zhoujun"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            title="Twitter"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
      </div>
    </section>

    <div class="section-divider" />

    <!-- Categories -->
    <section class="panel-section">
      <router-link to="/categories" class="section-title section-title-link">
        分类
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </router-link>
      <div v-if="categories.length" class="category-list">
        <router-link
          v-for="cat in categories"
          :key="catLabel(cat)"
          :to="{ path: '/', query: { category: catSlug(cat) || catLabel(cat) } }"
          class="category-item"
        >
          <span class="category-name">{{ catLabel(cat) }}</span>
          <span class="category-count">{{ cat.count || catCount(cat) || 0 }}</span>
        </router-link>
      </div>
      <p v-else class="panel-empty">暂无分类</p>
    </section>

    <div class="section-divider" />

    <!-- Tags -->
    <section class="panel-section">
      <router-link to="/tags" class="section-title section-title-link">
        标签
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </router-link>
      <div v-if="tags.length" class="tag-cloud">
        <router-link
          v-for="(tag, idx) in tags"
          :key="tagLabel(tag)"
          :to="{ path: '/', query: { tag: tagSlug(tag) || tagLabel(tag) } }"
          class="tag-item"
          :style="{ borderColor: neonColors[idx % neonColors.length], color: neonColors[idx % neonColors.length] }"
        >
          {{ tagLabel(tag) }}
        </router-link>
      </div>
      <p v-else class="panel-empty">暂无标签</p>
    </section>

    <div class="section-divider" />

    <!-- Friend Links -->
    <section class="panel-section">
      <h4 class="section-title">友链</h4>
      <div v-if="friendLinks.length" class="friend-links">
        <a
          v-for="link in friendLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="friend-link"
        >{{ link.name }}</a>
      </div>
      <p v-else class="panel-empty">暂无友链</p>
    </section>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useArticleStore } from '@/stores/article'

const articleStore = useArticleStore()

const neonColors = ['#00e5ff', '#ff0080', '#7b2fff', '#00e5ff', '#ff0080']

const categories = computed(() => articleStore.categories || [])

const tags = computed(() => {
  const raw = articleStore.tags || []
  return raw.filter(t => {
    const name = tagLabel(t)
    return !name.includes('测试')
  })
})

function catLabel(cat) {
  if (!cat) return ''
  return typeof cat === 'object' ? cat.name || '' : cat
}

function tagLabel(tag) {
  if (!tag) return ''
  return typeof tag === 'object' ? tag.name || '' : tag
}

function catSlug(cat) {
  if (!cat) return ''
  return typeof cat === 'object' ? cat.slug || '' : ''
}

function tagSlug(tag) {
  if (!tag) return ''
  return typeof tag === 'object' ? tag.slug || '' : ''
}

function catCount(cat) {
  if (typeof cat === 'object' && cat.article_count !== undefined) return cat.article_count
  if (typeof cat === 'object' && cat.count !== undefined) return cat.count
  return 0
}

const friendLinks = [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'ChatGPT', url: 'https://chatgpt.com/' },
]
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.side-panel {
  width: 300px;
  flex-shrink: 0;

  @media (max-width: 767px) {
    display: none;
  }
}

.panel-section {
  padding: 8px 0;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: $text-secondary;
  margin-bottom: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.section-title-link {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  text-decoration: none;
  transition: color $transition-fast;

  &:hover {
    color: $neon-cyan;
  }
}

.section-divider {
  height: 1px;
  background: $glass-border;
  margin: 4px 0;
}

.panel-empty {
  font-size: 0.8rem;
  color: $text-secondary;
  font-style: italic;
}

// ---- Mini About ----
.mini-about {
  text-align: center;
  padding: 4px 0 8px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid $neon-cyan;
  box-shadow: 0 0 10px rgba($neon-cyan, 0.3), 0 0 20px rgba($neon-cyan, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  background: $bg-secondary;
  overflow: hidden;
}

.avatar-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: $neon-cyan;
  text-shadow: 0 0 7px rgba($neon-cyan, 0.6);
}

.about-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.about-bio {
  font-size: 0.8rem;
  color: $text-secondary;
  margin-bottom: 12px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: $text-secondary;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid $glass-border;
  transition: color $transition-fast, background $transition-fast, border-color $transition-fast;
  text-decoration: none;

  &:hover {
    color: $neon-cyan;
    background: rgba($neon-cyan, 0.08);
    border-color: rgba($neon-cyan, 0.3);
  }
}

// ---- Categories ----
.category-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 6px;
  text-decoration: none;
  color: $text-primary;
  font-size: 0.85rem;
  transition: background $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }
}

.category-name {
  color: $text-secondary;
  transition: color $transition-fast;

  .category-item:hover & {
    color: $neon-cyan;
  }
}

.category-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 20px;
  padding: 0 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: $neon-purple;
  border: 1px solid rgba($neon-purple, 0.3);
  border-radius: 999px;
  background: rgba($neon-purple, 0.06);
}

// ---- Tag Cloud ----
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-item {
  display: inline-block;
  padding: 2px 10px;
  font-size: 0.75rem;
  border: 1px solid;
  border-radius: 999px;
  text-decoration: none;
  transition: opacity $transition-fast, background $transition-fast;

  &:hover {
    opacity: 0.8;
    background: rgba(255, 255, 255, 0.04);
  }
}

// ---- Friend Links ----
.friend-links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.friend-link {
  display: inline-block;
  padding: 4px 10px;
  font-size: 0.78rem;
  color: $text-secondary;
  border: 1px solid $glass-border;
  border-radius: 6px;
  text-decoration: none;
  transition: color $transition-fast, border-color $transition-fast;

  &:hover {
    color: $neon-cyan;
    border-color: rgba($neon-cyan, 0.3);
  }
}
</style>
