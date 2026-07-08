<template>
  <div class="reading-progress" :style="{ width: progress + '%' }" />
</template>

<script setup>
import { computed } from 'vue'
import { useScroll } from '@/composables/useScroll'

const { scrollY } = useScroll()

const progress = computed(() => {
  const h = document.documentElement
  const total = h.scrollHeight - h.clientHeight
  return total > 0 ? Math.min(100, (scrollY.value / total) * 100) : 0
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: linear-gradient(90deg, $neon-cyan, $neon-pink);
  z-index: 1001;
  transition: width 0.1s linear;
}
</style>
