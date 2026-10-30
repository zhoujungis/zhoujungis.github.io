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
        <button
          v-if="!auth.isLoggedIn"
          class="login-btn"
          type="button"
          @click="openLogin()"
        >
          登录
        </button>
        <div v-else ref="userMenuRef" class="user-menu">
          <button
            class="user-trigger"
            type="button"
            aria-haspopup="true"
            :aria-expanded="userOpen"
            @click.stop="toggleUserMenu"
          >
            <span class="user-avatar">{{ initial }}</span>
            <span class="user-name">{{ auth.displayName }}</span>
          </button>
          <transition name="menu">
            <div v-if="userOpen" class="user-panel">
              <div v-if="!editingNickname" class="user-panel__row">
                <div class="user-panel__id">
                  <strong>{{ auth.displayName }}</strong>
                  <small>{{ auth.user?.email }}</small>
                </div>
                <button class="panel-link" type="button" @click="startEdit">修改昵称</button>
              </div>
              <form v-else class="nick-form" @submit.prevent="saveNickname">
                <input
                  v-model="nickInput"
                  class="nick-input"
                  maxlength="32"
                  placeholder="新的昵称"
                />
                <p v-if="nickError" class="nick-error">{{ nickError }}</p>
                <div class="nick-actions">
                  <button class="panel-link" type="button" @click="editingNickname = false">取消</button>
                  <button class="panel-primary" type="submit" :disabled="saving">
                    {{ saving ? '保存中…' : '保存' }}
                  </button>
                </div>
              </form>
              <button class="panel-row" type="button" :disabled="subBusy" @click="onToggleSubscribe">
                <span>订阅新文章</span>
                <small>{{ subscribed ? '已订阅 · 点击退订' : '未订阅 · 点击订阅' }}</small>
              </button>
              <button class="panel-logout" type="button" @click="onLogout">退出登录</button>
            </div>
          </transition>
        </div>
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
        <div class="drawer-account">
          <div v-if="auth.isLoggedIn" class="drawer-account__id">
            <span class="user-avatar">{{ initial }}</span>
            <div>
              <strong>{{ auth.displayName }}</strong>
              <small>{{ auth.user?.email }}</small>
            </div>
          </div>
          <button
            v-if="auth.isLoggedIn"
            class="drawer-account__btn"
            type="button"
            :disabled="subBusy"
            @click="onToggleSubscribe"
          >
            {{ subscribed ? '取消订阅邮件通知' : '订阅新文章邮件通知' }}
          </button>
          <button
            v-if="auth.isLoggedIn"
            class="drawer-account__btn"
            type="button"
            @click="onLogout"
          >
            退出登录
          </button>
          <button
            v-if="!auth.isLoggedIn"
            class="drawer-account__btn drawer-account__btn--primary"
            type="button"
            @click="openLoginFromDrawer"
          >
            登录 / 注册
          </button>
        </div>

        <div class="drawer-foot">
          <a href="https://github.com/zhoujungis" target="_blank" rel="noopener">GitHub</a>
          <a href="mailto:no-reply@blog.zhoujun.dev">Email</a>
          <a href="https://blog.zhoujun.dev/rss.xml">RSS</a>
        </div>
      </aside>
    </transition>
  </header>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLoginModal } from '@/composables/useLogin'
import { useScrollLock } from '@/composables/useScrollLock'
import { useSubscription } from '@/composables/useSubscription'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
const auth = useAuthStore()
const { openLogin } = useLoginModal()
const { subscribed, busy: subBusy, refresh: refreshSub, toggle: toggleSub, reset: resetSub } =
  useSubscription()
const drawerOpen = ref(false)
const moreOpen = ref(false)
const userOpen = ref(false)
const userMenuRef = ref(null)
const editingNickname = ref(false)
const nickInput = ref('')
const nickError = ref('')
const saving = ref(false)
// 向下滚动后收束导航底色：顶部透一点让毛玻璃呼吸，滚起来更「实」更稳
const scrolled = ref(false)
const scrollLock = useScrollLock()

const initial = computed(() => (auth.displayName || '读').charAt(0).toUpperCase())

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
  userOpen.value = false
  editingNickname.value = false
}

function openLoginFromDrawer() {
  closeMenus()
  openLogin()
}

function toggleUserMenu() {
  userOpen.value = !userOpen.value
  editingNickname.value = false
  nickError.value = ''
  // 打开菜单时拉一次最新订阅状态，避免各页面状态过期
  if (userOpen.value && auth.isLoggedIn) refreshSub()
}

async function onToggleSubscribe() {
  try {
    await toggleSub()
  } catch {
    // 失败时保持旧状态，不弹额外提示（菜单里能看到没变）
  }
}

function startEdit() {
  nickInput.value = auth.displayName
  nickError.value = ''
  editingNickname.value = true
}

async function saveNickname() {
  const value = nickInput.value.trim()
  if (!value) {
    nickError.value = '昵称不能为空'
    return
  }
  saving.value = true
  nickError.value = ''
  try {
    await auth.updateNickname(value)
    editingNickname.value = false
    userOpen.value = false
  } catch (e) {
    nickError.value = e?.response?.data?.detail || '保存失败，请稍后重试'
  } finally {
    saving.value = false
  }
}

function onLogout() {
  auth.logout()
  resetSub()
  closeMenus()
}

function onDocumentClick(event) {
  if (!userOpen.value) return
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    userOpen.value = false
    editingNickname.value = false
  }
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
  document.addEventListener('click', onDocumentClick)
  onScroll()
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDocumentClick)
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

// 登录入口：与搜索按钮同一套语言——平时只有文字，悬停才浮出淡底药丸；
// 登录后收成「头像 + 昵称」触发器，不额外引入新的视觉元素。
.login-btn {
  height: 40px;
  margin-right: 6px;
  padding: 0 14px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: color $transition-fast, background $transition-fast,
    border-color $transition-fast, transform 0.12s ease;

  &:hover {
    color: var(--accent);
    background: var(--accent-soft);
    border-color: var(--accent-line);
  }
  &:active { transform: scale(0.96); }
}

.user-menu {
  position: relative;
  margin-right: 4px;
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px 0 5px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  transition: background $transition-fast, border-color $transition-fast;

  &:hover {
    background: var(--accent-soft);
    border-color: var(--accent-line);
  }
}

.user-avatar {
  display: grid;
  place-items: center;
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  color: #fff;
  background: var(--accent);
  border-radius: 50%;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

.user-name {
  max-width: 96px;
  overflow: hidden;
  color: var(--text-primary);
  font-size: 0.85rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 248px;
  padding: 10px;
  background: var(--surface);
  border: 1px solid var(--glass-border);
  border-radius: $radius-md;
  box-shadow: $card-shadow-hover;
}

.user-panel__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 8px 10px;
  border-bottom: 1px solid var(--hairline);
}

.user-panel__id {
  display: flex;
  flex-direction: column;
  min-width: 0;

  strong {
    overflow: hidden;
    color: var(--text-primary);
    font-size: 0.9rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    overflow: hidden;
    margin-top: 3px;
    color: var(--text-secondary);
    font-size: 0.72rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.panel-link {
  flex: 0 0 auto;
  padding: 4px 6px;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  font-size: 0.76rem;
  cursor: pointer;
  transition: color $transition-fast;

  &:hover { color: var(--accent); }
}

.nick-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 8px;
  border-bottom: 1px solid var(--hairline);
}

.nick-input {
  width: 100%;
  height: 36px;
  padding: 0 10px;
  color: var(--text-primary);
  background: var(--page-bg);
  border: 1px solid var(--glass-border);
  border-radius: $radius-sm;
  font-size: 0.85rem;
  outline: none;
  transition: border-color $transition-fast;

  &:focus { border-color: var(--accent); }
}

.nick-error {
  color: #d64545;
  font-size: 0.74rem;
}

.nick-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.panel-primary {
  height: 32px;
  padding: 0 14px;
  color: #fff;
  background: var(--accent);
  border: 0;
  border-radius: $radius-sm;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled { opacity: 0.55; cursor: not-allowed; }
}

.panel-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  margin-top: 6px;
  padding: 9px 8px;
  color: var(--text-primary);
  background: transparent;
  border: 0;
  border-radius: $radius-sm;
  font-size: 0.82rem;
  cursor: pointer;
  transition: background $transition-fast;

  small { color: var(--text-secondary); font-size: 0.72rem; }
  &:hover:not(:disabled) { background: var(--surface-muted); }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
}

.panel-logout {
  width: 100%;
  margin-top: 2px;
  padding: 9px;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  border-radius: $radius-sm;
  font-size: 0.82rem;
  text-align: center;
  cursor: pointer;
  transition: color $transition-fast, background $transition-fast;

  &:hover {
    color: #d64545;
    background: var(--surface-muted);
  }
}

.drawer-account {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 0 4px;
  border-top: 1px solid var(--glass-border);
}

.drawer-account__id {
  display: flex;
  align-items: center;
  gap: 10px;

  div { display: flex; flex-direction: column; min-width: 0; }

  strong {
    color: var(--text-primary);
    font-size: 0.92rem;
  }

  small {
    overflow: hidden;
    color: var(--text-secondary);
    font-size: 0.74rem;
    text-overflow: ellipsis;
  }
}

.drawer-account__btn {
  height: 42px;
  color: var(--text-secondary);
  background: var(--page-bg);
  border: 1px solid var(--glass-border);
  border-radius: $radius-md;
  font-size: 0.88rem;
  cursor: pointer;

  &--primary {
    color: #fff;
    background: var(--accent);
    border-color: var(--accent);
    font-weight: 600;
  }
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
  // 窄屏只留头像，昵称收进下拉，避免和汉堡挤在一起
  .user-name { display: none; }
  .user-trigger { padding: 0 6px 0 4px; }
  .login-btn { height: 34px; margin-right: 2px; padding: 0 13px; font-size: 0.8rem; }
}

@media (max-width: 420px) {
  .drawer-nav { grid-template-columns: 1fr; }
}
</style>
