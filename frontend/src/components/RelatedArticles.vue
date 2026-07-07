<template>
  <section v-if="articles.length" class="related-section">
    <h3 class="related-title">相关文章</h3>
    <div class="related-grid">
      <router-link
        v-for="a in articles"
        :key="a.slug"
        :to="'/article/' + a.slug"
        class="related-card"
      >
        <div v-if="a.cover_image" class="related-cover">
          <img :src="a.cover_image" :alt="a.title" loading="lazy" />
        </div>
        <span class="related-card-title">{{ a.title }}</span>
      </router-link>
    </div>
  </section>
</template>

<script setup>
defineProps({
  articles: { type: Array, default: () => [] },
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.related-section { margin-top: 40px; }
.related-title {
  font-size: 1.1rem; font-weight: 700;
  color: $text-primary;
  margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px;
  &::after { content: ''; flex: 1; height: 1px; background: $glass-border; }
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}
.related-card {
  text-decoration: none;
  background: $bg-card;
  border: 1px solid $glass-border;
  border-radius: $glass-radius;
  overflow: hidden;
  transition: border-color $transition-fast, transform $transition-fast;
  &:hover { border-color: rgba($neon-cyan, 0.3); transform: translateY(-2px); }
}
.related-cover {
  height: 100px; overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
}
.related-card-title {
  display: block;
  padding: 10px 12px;
  font-size: 0.85rem; font-weight: 600;
  color: $text-primary;
  line-height: 1.4;
}
</style>
