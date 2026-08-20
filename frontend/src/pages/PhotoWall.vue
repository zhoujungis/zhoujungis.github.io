<template>
  <div class="page page-photo-wall">
    <header class="page-header">
      <h1 class="page-title neon-text-cyan">照片墙</h1>
      <p class="page-subtitle">记录生活的美好瞬间</p>
    </header>

    <!-- Loading skeleton -->
    <div v-if="loading" class="skeleton-grid">
      <div
        v-for="i in 9"
        :key="i"
        class="skeleton-photo"
        :style="{ gridRowEnd: 'span ' + (1 + (i % 3)) }"
      >
        <div class="skeleton-image" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-message">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="loadPhotos">重试</button>
    </div>

    <!-- Empty -->
    <div v-else-if="!photos.length" class="state-message">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <p>照片墙即将上线，敬请期待 📸</p>
    </div>

    <!-- Photo grid -->
    <div v-else class="photo-grid" :class="{ 'photo-grid--single': isSingle }">
      <div
        v-for="(photo, idx) in photos"
        :key="photo.id || idx"
        class="photo-item"
        :class="{ 'photo-tall': !isSingle && (idx % 5 === 0 || idx % 7 === 0) }"
        @click="openLightbox(photo)"
      >
        <picture v-if="resolveImageUrl(photo)">
          <source
            :srcset="resolveImageUrl(photo).avif"
            type="image/avif"
          />
          <source
            :srcset="resolveImageUrl(photo).webp"
            type="image/webp"
          />
          <img
            :src="resolveImageUrl(photo).fallback"
            :alt="photo.title || photo.alt || 'Photo'"
            loading="lazy"
            decoding="async"
            class="photo-img"
          />
        </picture>
        <img
          v-else
          :src="resolveImageUrl(photo, true)"
          :alt="photo.title || photo.alt || 'Photo'"
          loading="lazy"
          decoding="async"
          class="photo-img"
        />
        <div v-if="photo.title" class="photo-overlay">
          <span class="photo-title">{{ photo.title }}</span>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <transition name="lightbox">
      <div
        v-if="lightboxVisible"
        ref="lightboxRef"
        class="lightbox-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="lightboxPhoto?.title || '照片预览'"
        tabindex="-1"
        @click.self="closeLightbox"
      >
        <button ref="lightboxCloseRef" class="lightbox-close" @click="closeLightbox" aria-label="关闭预览">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <picture v-if="resolveImageUrl(lightboxPhoto)">
          <source
            :srcset="resolveImageUrl(lightboxPhoto).avif"
            type="image/avif"
          />
          <source
            :srcset="resolveImageUrl(lightboxPhoto).webp"
            type="image/webp"
          />
          <img
            :src="resolveImageUrl(lightboxPhoto).fallback"
            :alt="lightboxPhoto?.title || 'Photo'"
            decoding="async"
            class="lightbox-img"
          />
        </picture>
        <img
          v-else-if="resolveImageUrl(lightboxPhoto, true)"
          :src="resolveImageUrl(lightboxPhoto, true)"
          :alt="lightboxPhoto?.title || 'Photo'"
          decoding="async"
          class="lightbox-img"
        />
        <p v-if="lightboxPhoto?.title" class="lightbox-caption">
          {{ lightboxPhoto.title }}
        </p>
      </div>
    </transition>

    <!-- Load-more for API photos (M22) -->
    <div v-if="hasMore" class="load-more-wrap">
      <button class="load-more-btn" :disabled="loadingMore" @click="loadMore">
        {{ loadingMore ? '加载中...' : '加载更多' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { getPhotos } from '@/api/articles'
import { getPictureSources } from '@/utils/imageSource'
import { useScrollLock } from '@/composables/useScrollLock'

const scrollLock = useScrollLock()

const photos = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const error = ref(null)
const lightboxVisible = ref(false)
const lightboxPhoto = ref(null)
const lightboxRef = ref(null)
const lightboxCloseRef = ref(null)
// Remember what had focus before the dialog opened so we can restore it.
let previouslyFocused = null

// Single photo → show as a full-width banner instead of a lonely left-aligned tile.
const isSingle = computed(() => photos.value.length === 1)

// M22: pagination state for API photos (default 10 per page)
const apiPage = ref(1)
const apiTotal = ref(0)
const apiPageSize = 10
const hasMore = computed(() => photos.value.filter((p) => !p.local).length < apiTotal.value)

function openLightbox(photo) {
  lightboxPhoto.value = photo
  lightboxVisible.value = true
  scrollLock.acquire()
  // Accessibility: remember the trigger and move focus into the dialog.
  previouslyFocused = document.activeElement
  nextTick(() => {
    lightboxCloseRef.value?.focus()
  })
}

function closeLightbox() {
  lightboxVisible.value = false
  lightboxPhoto.value = null
  scrollLock.release()
  // Restore focus to whichever element opened the lightbox.
  nextTick(() => {
    previouslyFocused?.focus?.()
    previouslyFocused = null
  })
}

function handleKeydown(e) {
  if (!lightboxVisible.value) return
  if (e.key === 'Escape') {
    closeLightbox()
    return
  }
  // Focus trap: the only interactive control is the close button, so keep
  // Tab / Shift+Tab cycles on it instead of letting focus escape behind
  // the modal overlay.
  if (e.key === 'Tab') {
    e.preventDefault()
    lightboxCloseRef.value?.focus()
  }
}

// M12: single source of truth for image URL resolution — handles all known
// field names so grid and lightbox never disagree on what to display.
function pickUrl(photo) {
  if (!photo) return null
  return photo.image || photo.image_url || photo.thumbnail_url || photo.url || null
}

function resolveImageUrl(photo, rawOnly = false) {
  const url = pickUrl(photo)
  if (!url) return rawOnly ? '' : null
  if (rawOnly) return url
  return getPictureSources(url)
}

// Curated photos committed to the site itself (served from GitHub Pages,
// under /photos/). Shown alongside any dynamic photos from the backend API,
// so the wall works even if the backend media host is unavailable.
const localPhotos = [
  { id: 'tibet-2026', image: '/photos/tibet-2026.png', local: true },
]

async function fetchApiPhotos(page, append = false) {
  if (append) loadingMore.value = true
  else loading.value = true
  try {
    const response = await getPhotos({ page, page_size: apiPageSize })
    const list = (response.data.results || response.data || []).map((p) => ({
      ...p,
      local: false,
    }))
    if (append) photos.value = [...photos.value, ...list]
    else photos.value = [...localPhotos, ...list]
    apiTotal.value = response.data.count ?? list.length
    apiPage.value = page
  } catch (e) {
    // Backend is optional — still show the curated local photos.
    if (!append) photos.value = [...localPhotos]
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function loadPhotos() {
  fetchApiPhotos(1, false)
}

function loadMore() {
  fetchApiPhotos(apiPage.value + 1, true)
}

onMounted(() => {
  loadPhotos()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-photo-wall {
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

// ---- Photo Grid (masonry-ish with CSS grid) ----
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  grid-auto-rows: 220px;
}

.photo-item {
  position: relative;
  border-radius: $radius-md;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid $glass-border;
  transition:
    transform $transition-base,
    box-shadow $transition-base,
    border-color $transition-base;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba($accent-pink, 0.4);
    box-shadow: $card-shadow-hover;
    z-index: 2;
  }
}

.photo-tall {
  grid-row: span 2;
}

// ---- Single photo: full-width banner, natural aspect, no crop ----
.photo-grid--single {
  display: block;
  grid-auto-rows: initial;

  .photo-item {
    height: auto;
    max-width: 960px;
    margin: 0 auto;

    &:hover {
      transform: none; // no scale — it's already large
    }
  }

  .photo-img {
    height: auto;
    object-fit: contain;
  }
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
  opacity: 0;
  transition: opacity $transition-base;
}

.photo-item:hover .photo-overlay {
  opacity: 1;
}

.photo-title {
  font-size: 0.85rem;
  color: #fff;
  font-weight: 600;
}

// ---- Skeleton ----
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  grid-auto-rows: 220px;
}

.skeleton-photo {
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid $glass-border;
}

.skeleton-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-hi) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

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

// ---- Lightbox ----
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 40px;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: background $transition-fast;
  z-index: 2001;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.lightbox-img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
}

.lightbox-caption {
  margin-top: 16px;
  font-size: 0.95rem;
  color: $text-secondary;
  text-align: center;
}

// Lightbox transitions
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity $transition-base;

  .lightbox-img {
    transition: transform $transition-base;
  }
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;

  .lightbox-img {
    transform: scale(0.9);
  }
}

// ---- Mobile ----
@media (max-width: 767px) {
  .page-photo-wall { padding: 32px 14px 16px; }
  .page-title { font-size: 2rem; }
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 160px;
    gap: 8px;
  }

  .photo-tall {
    grid-row: span 1;
  }

  .lightbox-overlay {
    padding: 16px;
  }
}
</style>
