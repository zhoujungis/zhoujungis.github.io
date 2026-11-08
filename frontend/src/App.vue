<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import BackToTop from './components/BackToTop.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import LoginModal from './components/LoginModal.vue'
import { isEnglishPath } from './utils/locale'

// Split out of the main bundle. The widget is pure decoration that only mounts
// on wide screens, and it drags a vendored Cubism engine behind it — no reason
// for it to be in the chunk every visitor downloads for first paint.
const Live2DWidget = defineAsyncComponent(() => import('./components/Live2DWidget.vue'))

const route = useRoute()
// M24: 60fps canvas + Live2D model load add no value on admin pages —
// they're CPU heavy and make login/dashboard sluggish, especially on phones.
const isAdmin = computed(() => route.path.startsWith('/admin'))
// 英文版自带页头页脚（含中英切换），不套中文站的壳，否则 /en 里会混进中文导航。
// 判断必须同时看路径：首帧时路由组件还在异步加载，route.meta.lang 还是空的，
// 只看 meta 会让中文页头先渲染一帧再被换掉 —— 每次整页跳转都闪一下。
const isEn = computed(() => {
  // 路由还没解析出任何匹配（首帧、组件 chunk 未到）时用地址栏兜底，
  // 解析完成后一律以 route.path 为准，避免 SPA 内部跳到中文页仍套英文壳。
  const path = route.matched.length ? route.path : window.location.pathname
  return route.meta.lang === 'en' || isEnglishPath(path)
})
</script>

<template>
  <ReadingProgress v-if="!isEn" />
  <AppHeader v-if="!isAdmin && !isEn" />
  <main class="main-content" :class="{ 'main-content--admin': isAdmin, 'main-content--en': isEn }">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <AppFooter v-if="!isAdmin && !isEn" />
  <Live2DWidget v-if="!isAdmin && !isEn" />
  <BackToTop v-if="!isAdmin && !isEn" />
  <ThemeToggle v-if="isAdmin" floating />
  <LoginModal v-if="!isAdmin" />
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

// 英文版自带页头，不需要给固定的中文页头留出 68px。
.main-content--en {
  padding-top: 0;
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
