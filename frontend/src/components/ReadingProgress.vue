<template>
  <div class="reading-progress" :style="{ width: progress + '%' }" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

function update() {
  const h = document.documentElement
  const total = h.scrollHeight - h.clientHeight
  progress.value = total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0
}

onMounted(() => window.addEventListener('scroll', update, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', update))
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
