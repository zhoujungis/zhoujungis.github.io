<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="logo" aria-label="Zhou Jun 博客首页" @click="closeMenus">
        <span class="logo-mark">ZJ</span>
        <span class="logo-copy">
          <strong>Zhou Jun</strong>
          <small>FIELD NOTES</small>
        </span>
      </router-link>

      <nav class="nav-desktop" aria-label="主导航">
        <router-link v-for="link in primaryLinks" :key="link.path" :to="link.path" class="nav-link">
          {{ link.label }}
        </router-link>

        <div class="nav-more">
          <button
            class="nav-link nav-more__button"
            :class="{ 'is-active': moreOpen || isExploreRoute }"
            aria-haspopup="true"
            :aria-expanded="moreOpen"
            @click="moreOpen = !moreOpen"
          >
            探索
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
          </button>
          <transition name="menu">
            <div v-if="moreOpen" class="more-menu">
              <router-link v-for="link in exploreLinks" :key="link.path" :to="link.path" class="more-menu__link" @click="closeMenus">
                <span>{{ link.label }}</span>
                <small>{{ link.note }}</small>
              </router-link>
            </div>
          </transition>
        </div>
      </nav>

      <div class="header-actions">
        <router-link to="/search" class="icon-button search-button" title="搜索" aria-label="搜索">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
          </svg>
        </router-link>
        <ThemeToggle class="desktop-theme" />
        <button
          class="hamburger"
          :class="{ active: drawerOpen }"
          :aria-label="drawerOpen ? '关闭菜单' : '打开菜单'"
          :aria-expanded="drawerOpen"
          @click="drawerOpen = !drawerOpen"
        >
          <span /><span /><span />
        </button>
      </div>
    </div>

    <transition name="fade">
      <button v-if="drawerOpen" class="drawer-overlay" aria-label="关闭菜单" @click="drawerOpen = false" />
    </transition>

    <transition name="slide">
      <aside v-if="drawerOpen" class="drawer" aria-label="移动端导航">
        <div class="drawer-head">
          <div>
            <strong>浏览博客</strong>
            <p>技术、旅行与日常记录</p>
          </div>
          <ThemeToggle />
        </div>
        <nav class="drawer-nav">
          <router-link v-for="link in allLinks" :key="link.path" :to="link.path" class="drawer-link" @click="closeMenus">
            <span>{{ link.label }}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </router-link>
        </nav>
        <div class="drawer-foot">
          <a href="https://github.com/zhoujungis" target="_blank" rel="noopener">GitHub</a>
          <a href="mailto:no-reply@gmail.com">Email</a>
          <a href="https://zhoujun123.pythonanywhere.com/rss.xml">RSS</a>
        </div>
      </aside>
    </transition>
  </header>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useScrollLock } from '@/composables/useScrollLock'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
const drawerOpen = ref(false)
const moreOpen = ref(false)
const scrollLock = useScrollLock()

const primaryLinks = [
  { path: '/', label: '首页' },
  { path: '/articles', label: '文章' },
  { path: '/archives', label: '归档' },
  { path: '/footprints', label: '足迹' },
  { path: '/about', label: '关于' },
]

const exploreLinks = [
  { path: '/categories', label: '分类', note: '按主题阅读' },
  { path: '/tags', label: '标签', note: '快速筛选内容' },
  { path: '/photos', label: '照片墙', note: '旅行与光影' },
  { path: '/friends', label: '友链', note: '值得访问的站点' },
]

const allLinks = [...primaryLinks, ...exploreLinks, { path: '/search', label: '搜索' }]
const isExploreRoute = computed(() => exploreLinks.some((link) => route.path.startsWith(link.path)))

function closeMenus() {
  drawerOpen.value = false
  moreOpen.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape') closeMenus()
}

watch(drawerOpen, (open) => {
  if (open) scrollLock.acquire()
  else scrollLock.release()
})

watch(() => route.fullPath, closeMenus)
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.app-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 1000;
  height: 68px;
  background: rgba(247, 247, 242, 0.92);
  border-bottom: 1px solid rgba(63, 107, 87, 0.14);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.header-inner {
  width: min(100% - 40px, 1160px);
  height: 100%;
  margin-inline: auto;
  display: flex;
  align-items: center;
  gap: 28px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: max-content;
  margin-right: auto;
  color: $text-primary;
  text-decoration: none;
}

.logo-mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  color: #fff;
  background: $accent-pink;
  border-radius: 50%;
  font-family: $font-mono;
  font-size: 0.76rem;
  font-weight: 700;
}

.logo-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.05;

  strong { color: inherit; font-size: 0.98rem; font-weight: 700; }
  small { margin-top: 5px; color: $text-secondary; font-family: $font-mono; font-size: 0.56rem; letter-spacing: 0.12em; }
}

.nav-desktop {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  color: $text-secondary;
  background: transparent;
  border: 0;
  border-radius: $radius-sm;
  font-size: 0.88rem;
  text-decoration: none;
  cursor: pointer;
  transition: color $transition-fast, background $transition-fast;

  &::after {
    content: '';
    position: absolute;
    right: 12px;
    bottom: 2px;
    left: 12px;
    height: 2px;
    background: transparent;
  }

  &:hover { color: $text-primary; background: rgba($accent-pink, 0.06); }
  &.router-link-exact-active,
  &.is-active {
    color: $accent-pink;
    font-weight: 600;
  }
  &.router-link-exact-active::after { background: $accent-pink; }
}

.nav-more { position: relative; }
.nav-more__button {
  gap: 3px;
  svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 2; }
}

.more-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 230px;
  padding: 8px;
  background: $bg-card;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
  box-shadow: $card-shadow-hover;
}

.more-menu__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 11px;
  color: $text-primary;
  border-radius: $radius-sm;
  font-size: 0.9rem;

  small { color: $text-secondary; font-size: 0.72rem; }
  &:hover { color: $accent-pink; background: $bg-secondary; }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.icon-button,
.hamburger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  padding: 0;
  color: $text-secondary;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;

  &:hover { color: $accent-pink; background: $bg-secondary; border-color: $glass-border; }
}

.icon-button svg { width: 18px; height: 18px; }
.hamburger { display: none; flex-direction: column; gap: 4px; }
.hamburger span {
  display: block;
  width: 18px;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transition: transform $transition-base, opacity $transition-base;
}
.hamburger.active span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background: rgba(23, 32, 27, 0.42);
  border: 0;
}

.drawer {
  position: fixed;
  inset: 0 0 0 auto;
  z-index: 999;
  width: min(360px, calc(100vw - 28px));
  height: 100svh;
  overflow-y: auto;
  padding: 24px 20px calc(24px + env(safe-area-inset-bottom));
  background: $bg-card;
  border-left: 1px solid $glass-border;
  box-shadow: -16px 0 40px rgba(31, 42, 36, 0.16);
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 64px;
  padding-bottom: 18px;
  border-bottom: 1px solid $glass-border;

  strong { color: $text-primary; font-size: 1.05rem; }
  p { margin-top: 3px; color: $text-secondary; font-size: 0.78rem; }
}

.drawer-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 20px 0;
}

.drawer-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 0 13px;
  color: $text-primary;
  background: $bg-primary;
  border: 1px solid transparent;
  border-radius: $radius-md;
  font-size: 0.92rem;

  svg { width: 15px; height: 15px; fill: none; stroke: $text-secondary; stroke-width: 2; }
  &:hover,
  &.router-link-exact-active { color: $accent-pink; background: $bg-secondary; border-color: $glass-border; }
}

.drawer-foot {
  display: flex;
  gap: 20px;
  padding-top: 18px;
  border-top: 1px solid $glass-border;
  font-size: 0.82rem;
}

.menu-enter-active,
.menu-leave-active,
.fade-enter-active,
.fade-leave-active { transition: opacity $transition-fast, transform $transition-fast; }
.menu-enter-from,
.menu-leave-to { opacity: 0; transform: translateY(-6px); }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
.slide-enter-active,
.slide-leave-active { transition: transform $transition-base; }
.slide-enter-from,
.slide-leave-to { transform: translateX(100%); }

@media (max-width: 899px) {
  .app-header { height: 62px; }
  .header-inner { width: calc(100% - 24px); gap: 10px; }
  .nav-desktop,
  .desktop-theme { display: none; }
  .hamburger { display: inline-flex; }
  .logo-mark { width: 34px; height: 34px; }
  .logo-copy small { display: none; }
  .search-button { display: none; }
}

@media (max-width: 420px) {
  .drawer-nav { grid-template-columns: 1fr; }
}
</style>
