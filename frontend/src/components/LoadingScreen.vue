<template>
  <transition name="fade-out">
    <div v-if="loading" class="loading-screen">
      <div class="loading-content">
        <div class="loading-mark">ZJ</div>
        <h1 class="logo-text">Zhou Jun</h1>
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
  const MIN_DISPLAY_MS = 300
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
  background: $bg-primary;
}

.loading-content {
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
}

.loading-mark {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  color: #fff;
  background: $accent-pink;
  border-radius: 50%;
  font-family: $font-mono;
  font-size: 0.9rem;
  font-weight: 700;
}

.logo-text {
  font-size: 1.45rem; font-weight: 700;
  color: $text-primary; margin: 0; letter-spacing: 0;
}

.dots {
  display: flex; gap: 8px;
}

.dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: $accent-pink;
  animation: bounce-dot 0.8s ease-in-out infinite;
}

.dot:nth-child(1) { background: $accent-pink; }
.dot:nth-child(2) { background: $accent-yellow; }
.dot:nth-child(3) { background: $accent-purple; }

@keyframes bounce-dot {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(-5px); opacity: 0.45; }
}

.fade-out-leave-active { transition: opacity 0.5s ease; }
.fade-out-leave-to { opacity: 0; }
</style>
