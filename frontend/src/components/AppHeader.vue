<template>
  <header class="app-header" :class="{ 'is-scrolled': scrolled }">
    <div class="header-inner">
      <router-link to="/" class="logo" aria-label="尘世栈帧 · 返回首页" @click="closeMenus">
        <img
          class="logo-mark"
          :src="logoIcon"
          alt="尘世栈帧"
          width="38"
          height="38"
          decoding="async"
        />
        <span class="logo-copy">
          <strong>尘世栈帧</strong>
          <small>Stack Frame</small>
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
          <a href="https://zhoujungis.github.io/rss.xml">RSS</a>
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
// 向下滚动后收束导航底色：顶部透一点让毛玻璃呼吸，滚起来更「实」更稳
const scrolled = ref(false)
const scrollLock = useScrollLock()

function onScroll() {
  scrolled.value = window.scrollY > 8
}

// Public asset (frontend/public/icons/icon-192.png). Kept in a binding on
// purpose: a static `src="/..."` gets rewritten by the Vue asset transform
// at compile time, which breaks `fileURLToPath` under vitest on Windows.
const logoIcon = '/icons/icon-192.png'

const primaryLinks = [
  { path: '/', label: '首页' },
  { path: '/articles', label: '文章' },
  { path: '/archives', label: '归档' },
  { path: '/footprints', label: '足迹' },
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
onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScroll)
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

// 毛玻璃导航：blur(16px) + 半透明主题底 + 发丝分割线；
// 滚动后底色收束到 --header-glass-strong 并压一层浅影，过渡是渐变的不硬切。
.app-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 1000;
  height: 68px;
  background: var(--header-glass);
  border-bottom: 1px solid var(--hairline);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  transition: background $transition-base, border-color $transition-base,
    box-shadow $transition-base;

  &.is-scrolled {
    background: var(--header-glass-strong);
    border-bottom-color: var(--hairline);
    box-shadow: 0 10px 30px rgba(31, 42, 36, 0.07);
  }
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
  color: var(--text-primary);
  text-decoration: none;
}

.logo-mark {
  display: block;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
}

.logo-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.05;

  strong { color: inherit; font-size: 0.98rem; font-weight: 700; letter-spacing: 0.02em; }
  small {
    margin-top: 5px;
    color: var(--text-secondary);
    font-family: $font-mono;
    font-size: 0.56rem;
    letter-spacing: 0.12em;
    white-space: nowrap;
  }
}

.nav-desktop {
  display: flex;
  align-items: center;
  gap: 2px;
}

// 导航项反馈统一为三段式：hover 主色弱底 + 提亮、active 按下微缩、
// 当前页主色字 + 下划线 —— 颜色全走主题 token，明暗两套自动一致。
.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  border-radius: 999px;
  font-size: 0.88rem;
  text-decoration: none;
  cursor: pointer;
  transition: color $transition-fast, background $transition-fast,
    transform 0.12s ease;

  &::after {
    content: '';
    position: absolute;
    right: 14px;
    bottom: 2px;
    left: 14px;
    height: 2px;
    background: transparent;
    border-radius: 2px;
    transition: background $transition-fast;
  }

  &:hover { color: var(--text-primary); background: var(--accent-soft); }
  &:active { transform: scale(0.96); }
  &.router-link-exact-active,
  &.is-active {
    color: var(--accent);
    font-weight: 600;
  }
  &.router-link-exact-active::after { background: var(--accent); }
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
  background: var(--surface);
  border: 1px solid var(--glass-border);
  border-radius: $radius-md;
  box-shadow: $card-shadow-hover;
}

.more-menu__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 11px;
  color: var(--text-primary);
  border-radius: $radius-sm;
  font-size: 0.9rem;
  transition: color $transition-fast, background $transition-fast;

  small { color: var(--text-secondary); font-size: 0.72rem; }
  &:hover { color: var(--accent); background: var(--surface-muted); }
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
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: color $transition-fast, background $transition-fast,
    border-color $transition-fast, transform 0.12s ease;

  &:hover {
    color: var(--accent);
    background: var(--accent-soft);
    border-color: var(--accent-line);
  }
  &:active { transform: scale(0.92); }
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
  background: var(--surface);
  border-left: 1px solid var(--glass-border);
  box-shadow: -16px 0 40px rgba(31, 42, 36, 0.16);
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 64px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--glass-border);

  strong { color: var(--text-primary); font-size: 1.05rem; }
  p { margin-top: 3px; color: var(--text-secondary); font-size: 0.78rem; }
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
  color: var(--text-primary);
  background: var(--page-bg);
  border: 1px solid transparent;
  border-radius: $radius-md;
  font-size: 0.92rem;
  transition: color $transition-fast, background $transition-fast,
    border-color $transition-fast, transform 0.12s ease;

  svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 2; transition: stroke $transition-fast; }
  &:active { transform: scale(0.97); }
  &:hover,
  &.router-link-exact-active {
    color: var(--accent);
    background: var(--surface-muted);
    border-color: var(--accent-line);
    svg { stroke: var(--accent); }
  }
}

.drawer-foot {
  display: flex;
  gap: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--glass-border);
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
  .logo-mark { flex: 0 0 34px; width: 34px; height: 34px; }
  // 移动端保留副标题（Stack Frame）——它是品牌识别的一部分，
  // 之前在这里 display:none 掉了。收窄字距以便整行放得下。
  .logo-copy small { letter-spacing: 0.06em; }
  .search-button { display: none; }
}

@media (max-width: 420px) {
  .drawer-nav { grid-template-columns: 1fr; }
}
</style>
