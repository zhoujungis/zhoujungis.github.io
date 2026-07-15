<template>
  <div class="page page-about">
    <div class="about-layout">
      <div class="about-main">
        <div class="profile-avatar">
          <div class="avatar-circle">
            <picture v-if="getPictureSources('/PIC.png')">
              <source
                :srcset="getPictureSources('/PIC.png').avif"
                type="image/avif"
              />
              <source
                :srcset="getPictureSources('/PIC.png').webp"
                type="image/webp"
              />
              <img
                :src="getPictureSources('/PIC.png').fallback"
                alt="Zhou Jun"
                class="avatar-image"
              />
            </picture>
            <img
              v-else
              src="/PIC.png"
              alt="Zhou Jun"
              class="avatar-image"
            />
          </div>
        </div>

        <h1 class="profile-name">Zhou Jun</h1>
        <p class="profile-tagline">一个热爱技术与科学的人</p>

        <div class="bio-card glass-card">
          <p class="bio-text">
            你好！我是 Zhou Jun，一个热爱技术与科学的开发者。喜欢旅行和摄影，对遥感与地理信息系统充满热情。
          </p>
          <p class="bio-text">
            这个博客是我分享技术心得、项目经验和学习笔记的地方。内容涵盖 AI 编程、大模型评测、全栈开发等领域。
          </p>
        </div>

        <div class="skills-section glass-card">
          <h3 class="section-title">技术栈</h3>
          <div class="skills-tags">
            <span v-for="s in skills" :key="s" class="skill-tag">{{ s }}</span>
          </div>
        </div>

        <div class="interests-section glass-card">
          <h3 class="section-title">技术兴趣</h3>
          <div class="interest-grid">
            <div class="interest-item" v-for="item in interests" :key="item.field">
              <span class="interest-icon">{{ item.icon }}</span>
              <div>
                <strong class="interest-field">{{ item.field }}</strong>
                <p class="interest-desc">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside class="about-sidebar">
        <div class="contact-card glass-card">
          <h3 class="contact-heading">联系我</h3>

          <div class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <a href="https://github.com/zhoujungis" target="_blank" rel="noopener noreferrer" class="contact-link">github.com/zhoujungis</a>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { getPictureSources } from '@/utils/imageSource'

const skills = [
  'Python', 'JavaScript', 'TypeScript', 'Vue 3',
  'Django', 'Django REST', 'PostgreSQL', 'SQLite',
  'Docker', 'Git', 'GIS', 'Remote Sensing',
]

const interests = [
  { icon: '🛰️', field: '遥感', desc: '图像分类、变化检测、大模型遥感应用' },
  { icon: '🗺️', field: 'GIS', desc: '空间分析、地图可视化、WebGIS' },
  { icon: '🤖', field: 'AI / 大模型', desc: 'LLM 应用、Agent 开发、模型评测' },
  { icon: '💻', field: '全栈开发', desc: 'Vue 3 + Django 前后端分离架构' },
]
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-about {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.about-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;

  @media (max-width: 767px) {
    flex-direction: column;
  }
}

.about-main {
  flex: 1;
  min-width: 0;
}

.about-sidebar {
  width: 300px;
  flex-shrink: 0;

  @media (max-width: 767px) {
    width: 100%;
  }
}

.profile-avatar {
  text-align: center;
  margin-bottom: 20px;
}

.avatar-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-secondary;
  border: 3px solid $accent-pink;
  box-shadow: 0 0 15px rgba(255, 133, 162, 0.3);
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.profile-name {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  color: $accent-pink;
  margin-bottom: 8px;
}

.profile-tagline {
  text-align: center;
  font-size: 0.9rem;
  color: $text-secondary;
  margin-bottom: 32px;
}

.bio-card {
  max-width: 600px;
  margin: 0 auto 24px;
}

.bio-text {
  font-size: 0.95rem;
  color: $text-secondary;
  line-height: 1.8;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.skills-section {
  max-width: 600px;
  margin: 0 auto 24px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: $accent-pink;
  margin-bottom: 16px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  background: rgba(255, 133, 162, 0.08);
  border: 1px solid rgba(255, 133, 162, 0.2);
  color: $accent-pink;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 133, 162, 0.15);
    border-color: $accent-pink;
    transform: translateY(-2px);
  }
}

.interests-section { margin-top: 20px; }
.interest-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.interest-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(255,255,255,0.03);
  border-radius: $radius-md;
  border: 1px solid $glass-border;
}
.interest-icon { font-size: 1.3rem; flex-shrink: 0; }
.interest-field { font-size: 0.9rem; color: $text-primary; }
.interest-desc { font-size: 0.8rem; color: $text-secondary; margin: 2px 0 0; }

.contact-card {
  position: sticky;
  top: 80px;
}

.contact-heading {
  font-size: 1rem;
  font-weight: 700;
  color: $accent-pink;
  margin-bottom: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  font-size: 0.85rem;
  color: $text-secondary;

  svg {
    flex-shrink: 0;
    opacity: 0.6;
    color: $accent-pink;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.contact-link {
  color: $text-secondary;
  text-decoration: none;
  transition: color $transition-fast;
  word-break: break-all;

  &:hover {
    color: $accent-pink;
  }
}
</style>
