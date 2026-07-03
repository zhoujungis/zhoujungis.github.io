<template>
  <transition name="fade-out">
    <div v-if="loading" class="loading-screen">
      <div class="loading-content">
        <div class="heart-icon">🌸</div>
        <h1 class="logo-text">ZhouJun</h1>
        <div class="dots">
          <span class="dot" v-for="i in 3" :key="i" :style="{ animationDelay: i * 0.15 + 's' }"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)

onMounted(() => {
  const MIN_DISPLAY_MS = 600
  const startTime = Date.now()
  const hide = () => {
    const remaining = Math.max(0, MIN_DISPLAY_MS - (Date.now() - startTime))
    setTimeout(() => { loading.value = false }, remaining)
  }
  if (window.requestIdleCallback) {
    window.requestIdleCallback(hide, { timeout: 200 })
  } else {
    setTimeout(hide, 50)
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.loading-screen {
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%; z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #fff5f7 0%, #ffeef2 50%, #fef0ff 100%);
}

.loading-content {
  display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
}

.heart-icon {
  font-size: 3rem;
  animation: heart-beat 1.2s ease-in-out infinite;
}

.logo-text {
  font-size: 2.8rem; font-weight: 700;
  color: $accent-pink; margin: 0; letter-spacing: 2px;
  @media (max-width: 480px) { font-size: 2rem; }
}

.dots {
  display: flex; gap: 8px;
}

.dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: $accent-pink;
  animation: bounce-dot 0.8s ease-in-out infinite;
}

.dot:nth-child(1) { background: $accent-pink; }
.dot:nth-child(2) { background: $accent-purple; }
.dot:nth-child(3) { background: $accent-mint; }

@keyframes bounce-dot {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(-12px); opacity: 0.5; }
}

@keyframes heart-beat {
  0%, 100% { transform: scale(1); }
  15% { transform: scale(1.2); }
  30% { transform: scale(1); }
  45% { transform: scale(1.15); }
}

.fade-out-leave-active { transition: opacity 0.5s ease; }
.fade-out-leave-to { opacity: 0; }
</style>
