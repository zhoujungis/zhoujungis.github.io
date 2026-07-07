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
    <div v-else class="photo-grid">
      <div
        v-for="(photo, idx) in photos"
        :key="photo.id || idx"
        class="photo-item"
        :class="{ 'photo-tall': idx % 5 === 0 || idx % 7 === 0 }"
        @click="openLightbox(photo)"
      >
        <img
          :src="photo.thumbnail_url || photo.image_url || photo.url"
          :alt="photo.title || photo.alt || 'Photo'"
          loading="lazy"
          class="photo-img"
        />
        <div v-if="photo.title" class="photo-overlay">
          <span class="photo-title">{{ photo.title }}</span>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <transition name="lightbox">
      <div v-if="lightboxVisible" class="lightbox-overlay" @click.self="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox" aria-label="Close">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <img
          :src="lightboxPhoto?.image_url || lightboxPhoto?.url"
          :alt="lightboxPhoto?.title || 'Photo'"
          class="lightbox-img"
        />
        <p v-if="lightboxPhoto?.title" class="lightbox-caption">
          {{ lightboxPhoto.title }}
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getPhotos } from '@/api/articles'

const photos = ref([])
const loading = ref(false)
const error = ref(null)
const lightboxVisible = ref(false)
const lightboxPhoto = ref(null)

function openLightbox(photo) {
  lightboxPhoto.value = photo
  lightboxVisible.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxVisible.value = false
  lightboxPhoto.value = null
  document.body.style.overflow = ''
}

function handleKeydown(e) {
  if (e.key === 'Escape') closeLightbox()
}

async function loadPhotos() {
  loading.value = true
  error.value = null
  try {
    const response = await getPhotos()
    photos.value = response.data.results || response.data || []
  } catch (e) {
    error.value = e?.response?.data?.detail || e.message || '加载照片失败'
  } finally {
    loading.value = false
  }
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
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
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid $glass-border;
  transition:
    transform $transition-base,
    box-shadow $transition-base,
    border-color $transition-base;

  &:hover {
    transform: scale(1.05);
    border-color: rgba($neon-cyan, 0.3);
    box-shadow:
      0 0 12px rgba($neon-cyan, 0.2),
      0 0 24px rgba($neon-cyan, 0.08);
    z-index: 2;
  }
}

.photo-tall {
  grid-row: span 2;
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
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid $glass-border;
}

.skeleton-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02) 25%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0.02) 75%
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
