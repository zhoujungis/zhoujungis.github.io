<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import BackToTop from './components/BackToTop.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import LoginModal from './components/LoginModal.vue'

// Split out of the main bundle. The widget is pure decoration that only mounts
// on wide screens, and it drags a vendored Cubism engine behind it — no reason
// for it to be in the chunk every visitor downloads for first paint.
const Live2DWidget = defineAsyncComponent(() => import('./components/Live2DWidget.vue'))

const route = useRoute()
// M24: 60fps canvas + Live2D model load add no value on admin pages —
// they're CPU heavy and make login/dashboard sluggish, especially on phones.
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <ReadingProgress />
  <AppHeader v-if="!isAdmin" />
  <main class="main-content" :class="{ 'main-content--admin': isAdmin }">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <AppFooter v-if="!isAdmin" />
  <Live2DWidget v-if="!isAdmin" />
  <BackToTop v-if="!isAdmin" />
  <ThemeToggle v-if="isAdmin" floating />
  <LoginModal />
</template>

<style lang="scss">
.main-content {
  padding-top: 68px;
  min-height: calc(100vh - 120px);
}

.main-content--admin {
  padding-top: 0;
  min-height: 100vh;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from { opacity: 0; transform: translateY(12px); }
.page-leave-to { opacity: 0; transform: translateY(-12px); }

@media (max-width: 899px) {
  .main-content { padding-top: 62px; }
}
</style>
