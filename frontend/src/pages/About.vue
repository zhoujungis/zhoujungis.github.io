<template>
  <div class="page page-about">
    <div class="about-layout">
      <!-- Left: Profile -->
      <div class="about-main">
        <!-- Avatar -->
        <div class="profile-avatar">
          <div class="avatar-circle">
            <span class="avatar-initials">ZJ</span>
          </div>
        </div>

        <!-- Name -->
        <h1 class="profile-name neon-text-cyan">Zhou Jun</h1>
        <p class="profile-tagline">热爱技术与科学 / 全栈开发者 / 地理信息研究者</p>

        <!-- Bio -->
        <div class="bio-card glass-card">
          <h2 class="section-title neon-text-pink">关于我</h2>
          <p class="bio-text">
            你好！我是 Zhou Jun，一名热爱技术与科学的全栈开发者和地理信息研究者。
            我专注于 Web 开发、GIS 应用、遥感数据处理和深度学习等领域。
          </p>
          <p class="bio-text">
            这个博客是我分享技术心得、项目经验和学习笔记的地方。
            希望通过文字能够帮助到更多对技术和科学感兴趣的朋友。
          </p>
          <p class="bio-text">
            工作之余，我喜欢摄影、旅行和探索新技术。我相信持续学习是保持进步的关键，
            也乐于与志同道合的人交流与合作。
          </p>
        </div>

        <!-- Skills -->
        <div class="skills-section glass-card">
          <h2 class="section-title neon-text-pink">技能</h2>
          <div class="skills-list">
            <div
              v-for="skill in skills"
              :key="skill.name"
              class="skill-item"
            >
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-percent">{{ skill.percent }}%</span>
              </div>
              <div class="skill-bar">
                <div
                  class="skill-fill"
                  :style="{ width: skill.percent + '%' }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Experience Timeline -->
        <div class="experience-section glass-card">
          <h2 class="section-title neon-text-pink">经历</h2>
          <div class="exp-timeline">
            <div
              v-for="(exp, idx) in experiences"
              :key="idx"
              class="exp-entry"
            >
              <div class="exp-dot" />
              <div class="exp-content">
                <time class="exp-date">{{ exp.date }}</time>
                <h3 class="exp-title">{{ exp.title }}</h3>
                <p class="exp-org">{{ exp.organization }}</p>
                <p class="exp-desc">{{ exp.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Contact sidebar -->
      <aside class="about-sidebar">
        <div class="contact-card glass-card">
          <h3 class="contact-heading neon-text-cyan">联系方式</h3>

          <div class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <a href="mailto:zhoujun@example.com" class="contact-link">zhoujun@example.com</a>
          </div>

          <div class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <a href="https://github.com/zhoujun" target="_blank" rel="noopener noreferrer" class="contact-link">github.com/zhoujun</a>
          </div>

          <div class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span class="contact-text">中国 · 北京</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
const skills = [
  { name: 'Python', percent: 90 },
  { name: 'JavaScript', percent: 85 },
  { name: 'Vue.js', percent: 80 },
  { name: 'Django', percent: 85 },
  { name: 'GIS', percent: 75 },
  { name: 'Remote Sensing', percent: 70 },
  { name: 'Deep Learning', percent: 65 },
]

const experiences = [
  {
    date: '2023 - 至今',
    title: '全栈开发者',
    organization: '自由职业 / 独立开发',
    description: '从事 Web 应用开发，专注于 Vue.js + Django 全栈项目。',
  },
  {
    date: '2020 - 2023',
    title: 'GIS 研究员',
    organization: '某地理信息研究机构',
    description: '从事遥感数据处理、空间分析和地理信息系统开发工作。',
  },
  {
    date: '2018 - 2020',
    title: '硕士 · 地理信息科学',
    organization: '某大学',
    description: '研究方向包括遥感图像处理和深度学习在地学中的应用。',
  },
  {
    date: '2014 - 2018',
    title: '本科 · 地理信息科学',
    organization: '某大学',
    description: '学习地理信息系统、遥感技术和计算机科学基础知识。',
  },
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

// ---- Profile Avatar ----
.profile-avatar {
  text-align: center;
  margin-bottom: 20px;
}

.avatar-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-secondary;
  border: 3px solid $neon-pink;
  box-shadow:
    0 0 15px rgba($neon-pink, 0.4),
    0 0 30px rgba($neon-pink, 0.15),
    0 0 60px rgba($neon-pink, 0.08);
}

.avatar-initials {
  font-size: 4rem;
  font-weight: 800;
  color: $neon-pink;
  text-shadow:
    0 0 10px rgba($neon-pink, 0.6),
    0 0 20px rgba($neon-pink, 0.3);
}

// ---- Profile Name ----
.profile-name {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.profile-tagline {
  text-align: center;
  font-size: 0.9rem;
  color: $text-secondary;
  margin-bottom: 40px;
}

// ---- Section Title ----
.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 20px;
}

// ---- Bio Card ----
.bio-card {
  margin-bottom: 24px;
}

.bio-text {
  font-size: 0.9rem;
  color: $text-secondary;
  line-height: 1.8;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

// ---- Skills ----
.skills-section {
  margin-bottom: 24px;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: $text-primary;
}

.skill-percent {
  font-size: 0.78rem;
  color: $text-secondary;
}

.skill-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, $neon-cyan, $neon-purple);
  box-shadow: 0 0 8px rgba($neon-cyan, 0.3);
  transition: width 0.8s ease;
}

// ---- Experience Timeline ----
.experience-section {
  margin-bottom: 24px;
}

.exp-timeline {
  position: relative;
  padding-left: 24px;

  &::before {
    content: '';
    position: absolute;
    left: 6px;
    top: 4px;
    bottom: 4px;
    width: 2px;
    background: linear-gradient(to bottom, $neon-purple, rgba($neon-purple, 0.1));
    border-radius: 2px;
  }
}

.exp-entry {
  position: relative;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.exp-dot {
  position: absolute;
  left: -19px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: $neon-cyan;
  border: 2px solid $bg-primary;
  box-shadow: 0 0 6px rgba($neon-cyan, 0.5);
  z-index: 1;
}

.exp-content {
  padding-bottom: 4px;
}

.exp-date {
  display: inline-block;
  font-size: 0.75rem;
  color: $neon-purple;
  margin-bottom: 4px;
  padding: 1px 8px;
  border: 1px solid rgba($neon-purple, 0.3);
  border-radius: 4px;
  background: rgba($neon-purple, 0.06);
}

.exp-title {
  font-size: 1rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 2px;
}

.exp-org {
  font-size: 0.82rem;
  color: $text-secondary;
  margin-bottom: 6px;
}

.exp-desc {
  font-size: 0.82rem;
  color: $text-secondary;
  line-height: 1.6;
}

// ---- Contact Card ----
.contact-card {
  position: sticky;
  top: 80px;
}

.contact-heading {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 20px;
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
    color: $neon-cyan;
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
    color: $neon-cyan;
  }
}

.contact-text {
  color: $text-secondary;
}
</style>
