<template>
  <div class="page page-friend-links">
    <header class="page-header">
      <h1 class="page-title neon-text-cyan">友情链接</h1>
      <p class="page-subtitle">我的朋友们</p>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="skeleton-grid">
      <div v-for="i in 6" :key="i" class="skeleton-card">
        <div class="skeleton-body">
          <div class="skeleton-icon" />
          <div class="skeleton-line w-60" />
          <div class="skeleton-line w-90" />
          <div class="skeleton-line w-70" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-message">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="loadFriends">重试</button>
    </div>

    <!-- Empty -->
    <div v-else-if="!friends.length" class="state-message">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <p>暂无友情链接</p>
    </div>

    <!-- Friend Links Grid -->
    <div v-else class="friend-grid">
      <a
        v-for="link in friends"
        :key="link.name || link.id"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="friend-card glass-card"
      >
        <div class="card-header">
          <div class="favicon-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <h3 class="friend-name">{{ link.name }}</h3>
          <div class="arrow-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </div>
        </div>
        <p v-if="link.description" class="friend-desc">{{ link.description }}</p>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFriends } from '@/api/articles'

const DEFAULT_FRIENDS = [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'ChatGPT', url: 'https://chatgpt.com/' },
]

const friends = ref([])
const loading = ref(true)
const error = ref(null)

async function loadFriends() {
  loading.value = true
  error.value = null
  try {
    const response = await getFriends()
    const apiFriends = response.data.results || response.data || []
    if (apiFriends.length) {
      friends.value = apiFriends
    } else {
      friends.value = [...DEFAULT_FRIENDS]
    }
  } catch (e) {
    friends.value = [...DEFAULT_FRIENDS]
  } finally {
    loading.value = false
  }
}

onMounted(loadFriends)
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-friend-links {
  max-width: 1160px;
  margin: 0 auto;
  padding: 52px 20px 24px;
}

.page-header {
  text-align: left;
  margin-bottom: 32px;
}

.page-title {
  color: $text-primary;
  font-size: 2.4rem;
  font-weight: 750;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 0.95rem;
  color: $text-secondary;
}

// ---- Friend Grid ----
.friend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
}

.friend-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  padding: 24px;
  transition:
    transform $transition-base,
    border-color $transition-base,
    box-shadow $transition-base;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba($neon-cyan, 0.2);
    box-shadow: $card-shadow-hover;

    .friend-name {
      color: $neon-cyan;
    }

    .arrow-icon {
      transform: translate(2px, -2px);
      opacity: 1;
    }

    .favicon-placeholder {
      border-color: rgba($neon-cyan, 0.3);
      color: $neon-cyan;
    }
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.favicon-placeholder {
  width: 44px;
  height: 44px;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid $glass-border;
  color: $text-secondary;
  flex-shrink: 0;
  transition: border-color $transition-fast, color $transition-fast;
}

.friend-name {
  flex: 1;
  font-size: 1.05rem;
  font-weight: 700;
  color: $text-primary;
  transition: color $transition-fast;
}

.arrow-icon {
  flex-shrink: 0;
  color: $neon-cyan;
  opacity: 0.4;
  transition: transform $transition-base, opacity $transition-base;
}

.friend-desc {
  font-size: 0.85rem;
  color: $text-secondary;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// ---- Skeleton ----
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.skeleton-card {
  background: $bg-card;
  border: 1px solid $glass-border;
  border-radius: $radius-md;
  overflow: hidden;
  padding: 24px;
}

.skeleton-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-icon {
  width: 44px;
  height: 44px;
  border-radius: $radius-md;
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-hi) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-hi) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  &:nth-child(3) {
    animation-delay: 0.1s;
  }
  &:nth-child(4) {
    animation-delay: 0.2s;
  }
}

.w-60 { width: 60%; }
.w-90 { width: 90%; }
.w-70 { width: 70%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// ---- States ----
.state-message {
  text-align: center;
  padding: 80px 20px;
  color: $text-secondary;

  svg {
    margin-bottom: 16px;
    opacity: 0.5;
  }

  p {
    font-size: 1rem;
  }
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 24px;
  font-size: 0.85rem;
  font-family: inherit;
  color: $neon-cyan;
  background: transparent;
  border: 1px solid rgba($neon-cyan, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: background $transition-fast, border-color $transition-fast;

  &:hover {
    background: rgba($neon-cyan, 0.08);
    border-color: $neon-cyan;
  }
}

@media (max-width: 767px) {
  .page-friend-links { padding: 32px 14px 16px; }
  .page-title { font-size: 2rem; }
  .friend-grid,
  .skeleton-grid { gap: 12px; }
}
</style>
