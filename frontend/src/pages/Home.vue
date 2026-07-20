<template>
  <div class="page page-landing">
    <article class="landing">
      <!-- Avatar column -->
      <section class="avatar-zone">
        <div class="avatar-frame">
          <div class="avatar-frame__inner">
            <img
              :src="avatarUrl"
              alt="Zhou Jun"
              class="avatar-image"
              loading="eager"
              fetchpriority="high"
              @error="onAvatarError"
            />
            <div class="avatar-fallback" v-if="avatarFailed">Z</div>
          </div>
          <span class="avatar-status" :class="{ 'avatar-status--hidden': avatarFailed }" title="在线" />
        </div>
        <p class="avatar-handle">@zhoujun · 📍上海</p>
      </section>

      <!-- Intro column -->
      <section class="intro-zone">
        <h1 class="landing__name">Zhou Jun</h1>
        <p class="landing__tagline">探索代码 · 写作 · 光影</p>

        <p class="landing__bio">
          工程师 · 写作者。用代码构建工具,用文字记录思考,
          用脚步丈量世界。👋 欢迎来到我的角落。
        </p>

        <div class="landing__cta">
          <router-link to="/articles" class="cta cta--primary">
            📖 读文章 →
          </router-link>
          <router-link to="/about" class="cta cta--secondary">
            关于我
          </router-link>
        </div>

        <ul class="landing__social">
          <li><a href="https://github.com/zhoujungis" target="_blank" rel="noopener">🐙 GitHub</a></li>
          <li><a href="mailto:hi@zhoujun.cn">📮 Email</a></li>
          <li><a href="https://zhoujun123.pythonanywhere.com/rss.xml">📡 RSS</a></li>
        </ul>
      </section>
    </article>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Use BASE_URL so the public asset works in production; the `import.meta.env`
// access happens at runtime (not SFC compile time), so Vite's imagemin plugin
// doesn't try to resolve `/PIC.svg` as a transformable file when tests run.
const avatarUrl = `${import.meta.env.BASE_URL}PIC.svg`

const avatarFailed = ref(false)
function onAvatarError() {
  avatarFailed.value = true
}
// No fetches. Landing is fully zero-network.
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-landing {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  padding: 32px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.landing {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 64px;
  align-items: center;
  width: 100%;
}

// Avatar column
.avatar-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-frame {
  width: 240px;
  height: 240px;
  position: relative;
  padding: 4px;
  border-radius: 50%;
  background: linear-gradient(135deg, $accent-pink, $accent-purple);
  box-shadow: 0 8px 32px rgba(255, 133, 162, 0.30), 0 0 0 1px rgba(255, 255, 255, 0.4);
  transition: transform $transition-base;
}
.avatar-frame:hover { transform: translateY(-4px) rotate(-2deg); }
.avatar-frame__inner {
  width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
  background: $bg-card; position: relative;
}
.avatar-image {
  width: 100%; height: 100%; display: block;
  border-radius: 50%; object-fit: cover;
}
.avatar-fallback {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 6rem; font-weight: 700;
  background: linear-gradient(135deg, $accent-pink, $accent-purple);
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}
.avatar-status {
  position: absolute; right: 18px; bottom: 18px;
  width: 16px; height: 16px; border-radius: 50%;
  background: $accent-mint;
  box-shadow: 0 0 0 4px $bg-card, 0 0 12px rgba(129, 212, 196, 0.6);
  animation: pulse 2s infinite;
}
.avatar-status--hidden { display: none; }
.avatar-handle {
  margin-top: 18px; font-size: .9rem;
  color: $text-secondary; letter-spacing: .04em;
  text-align: center;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px $bg-card, 0 0 12px rgba(129, 212, 196, 0.6); }
  50%      { box-shadow: 0 0 0 6px $bg-card, 0 0 18px rgba(129, 212, 196, 0.9); }
}

// Intro column
.intro-zone { animation: slideIn 0.6s ease 0.1s both; }
@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.landing__name {
  font-size: clamp(2.4rem, 4vw, 3.4rem);
  font-weight: 700; line-height: 1.1;
  background: linear-gradient(135deg, $accent-pink, $accent-purple);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  margin: 0;
}
.landing__tagline {
  font-family: $font-mono;
  letter-spacing: .15em;
  color: $accent-pink;
  font-size: .92rem;
  text-transform: uppercase;
  margin-top: 12px;
}
.landing__bio {
  font-size: 1.05rem; line-height: 1.85;
  color: $text-secondary;
  max-width: 540px;
  margin: 24px 0 36px;
}
.landing__cta {
  display: flex; gap: 12px; flex-wrap: wrap;
}
.cta {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 12px 26px; border-radius: 10px;
  text-decoration: none; font-weight: 600; font-size: 1rem;
  transition: transform $transition-fast, box-shadow $transition-fast, background $transition-fast;
  cursor: pointer; border: 0;
}
.cta--primary {
  background: $accent-pink; color: #fff;
  box-shadow: 0 4px 16px rgba(255, 133, 162, 0.30);
}
.cta--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 133, 162, 0.45);
}
.cta--secondary {
  background: transparent;
  border: 1.5px solid $accent-pink;
  color: $accent-pink;
}
.cta--secondary:hover { background: rgba(255, 133, 162, 0.06); }

.landing__social {
  display: flex; gap: 24px;
  margin-top: 36px; list-style: none; padding: 0;
}
.landing__social a {
  display: inline-flex; align-items: center; gap: 8px;
  color: $text-secondary; text-decoration: none;
  font-size: .92rem;
  transition: color $transition-fast, transform $transition-fast;
}
.landing__social a:hover {
  color: $accent-pink; transform: translateY(-2px);
}

// Responsive
@media (max-width: 1023px) {
  .landing { grid-template-columns: 1fr; gap: 32px; text-align: center; }
  .avatar-frame { width: 180px; height: 180px; }
  .landing__bio { max-width: none; margin-left: auto; margin-right: auto; }
  .landing__cta { justify-content: center; }
  .landing__social { justify-content: center; }
}
@media (max-width: 767px) {
  .page-landing { padding: 24px 16px; }
  .avatar-frame { width: 120px; height: 120px; }
  .avatar-fallback { font-size: 3rem; }
  .landing__name { font-size: 2rem; }
  .landing__tagline { font-size: .8rem; }
}
@media (prefers-reduced-motion: reduce) {
  .avatar-status, .intro-zone { animation: none !important; }
}
</style>
