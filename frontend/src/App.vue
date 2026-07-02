<script setup>
import AppHeader from './components/AppHeader.vue'
import Live2DWidget from './components/Live2DWidget.vue'
import BackToTop from './components/BackToTop.vue'
import LoadingScreen from './components/LoadingScreen.vue'
</script>

<template>
  <LoadingScreen />
  <AppHeader />
  <main class="main-content">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <Live2DWidget />
  <BackToTop />
</template>

<style lang="scss">
.main-content {
  padding-top: 56px; // match header height
  min-height: 100vh;
}

// Page transition
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
