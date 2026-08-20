<template>
  <div class="page page-landing">
    <article class="landing">
      <section class="intro-zone">
        <p class="landing__eyebrow">个人博客 · 深圳</p>
        <h1 class="landing__name">Zhou Jun</h1>
        <p class="landing__tagline">把技术写清楚，把生活留存下来。</p>
        <p class="landing__bio">
          我是一名工程师与写作者，关注 AI、全栈开发和地理信息技术，也记录旅行途中遇见的风景与想法。
        </p>

        <div class="landing__cta">
          <router-link to="/articles" class="cta cta--primary">
            阅读文章
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </router-link>
          <router-link to="/about" class="cta cta--secondary">认识我</router-link>
        </div>

        <ul class="landing__social" aria-label="社交链接">
          <li>
            <a href="https://github.com/zhoujungis" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.57-.3-5.27-1.29-5.27-5.69 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.47.11-3.06 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.28 5.68.42.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" /></svg>
              GitHub
            </a>
          </li>
          <li>
            <a href="mailto:zhoujunseu@163.com">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
              Email
            </a>
          </li>
          <li>
            <a href="https://zhoujun123.pythonanywhere.com/rss.xml">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="5" cy="19" r="1" fill="currentColor" /><path d="M4 11a9 9 0 0 1 9 9M4 5a15 15 0 0 1 15 15" /></svg>
              RSS
            </a>
          </li>
        </ul>
      </section>

      <section class="avatar-zone" aria-label="作者信息">
        <div class="portrait-wrap">
          <span class="portrait-accent" aria-hidden="true" />
          <div class="avatar-frame">
            <div class="avatar-frame__inner">
              <img
                :src="avatarUrl"
                alt="Zhou Jun 的插画头像"
                class="avatar-image"
                loading="eager"
                fetchpriority="high"
                @error="onAvatarError"
              />
              <div v-if="avatarFailed" class="avatar-fallback">ZJ</div>
            </div>
          </div>
          <div class="portrait-note">
            <span class="avatar-status" :class="{ 'avatar-status--hidden': avatarFailed }" />
            <span>@zhoujun</span>
            <span>Shenzhen, CN</span>
          </div>
        </div>
      </section>
    </article>

    <nav class="explore-strip" aria-label="快速浏览">
      <router-link to="/articles" class="explore-link">
        <span class="explore-link__index">01</span>
        <span><strong>技术文章</strong><small>AI、开发与工程实践</small></span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </router-link>
      <router-link to="/footprints" class="explore-link">
        <span class="explore-link__index">02</span>
        <span><strong>旅行足迹</strong><small>在地图上收藏见闻</small></span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </router-link>
      <router-link to="/photos" class="explore-link">
        <span class="explore-link__index">03</span>
        <span><strong>照片墙</strong><small>光影里的生活片段</small></span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const avatarUrl = `${import.meta.env.BASE_URL}PIC.svg`
const avatarFailed = ref(false)

function onAvatarError() {
  avatarFailed.value = true
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-landing {
  width: min(100% - 48px, 1160px);
  margin-inline: auto;
  padding: 52px 0 36px;
}

.landing {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
  align-items: center;
  gap: clamp(48px, 8vw, 112px);
  min-height: calc(100svh - 68px - 150px);
}

.intro-zone {
  max-width: 650px;
  animation: reveal 0.55s ease both;
}

.landing__eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  color: $accent-purple;
  font-family: $font-mono;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  &::before {
    content: '';
    width: 28px;
    height: 1px;
    background: currentColor;
  }
}

.landing__name {
  margin: 18px 0 14px;
  color: $text-primary;
  font-size: clamp(3.5rem, 7vw, 6.4rem);
  font-weight: 750;
  line-height: 0.95;
  letter-spacing: 0;
}

.landing__tagline {
  max-width: 560px;
  color: $text-primary;
  font-size: clamp(1.35rem, 2.2vw, 2rem);
  font-weight: 600;
  line-height: 1.35;
}

.landing__bio {
  max-width: 590px;
  margin: 24px 0 32px;
  color: $text-secondary;
  font-size: 1rem;
  line-height: 1.85;
}

.landing__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: $radius-md;
  font-size: 0.92rem;
  font-weight: 650;
  text-decoration: none;
  transition: transform $transition-fast, background $transition-fast, border-color $transition-fast, box-shadow $transition-fast;

  svg { width: 18px; height: 18px; margin-left: 10px; fill: none; stroke: currentColor; stroke-width: 1.8; }
  &:hover { transform: translateY(-2px); }
}

.cta--primary {
  color: #fff;
  background: $accent-pink;
  box-shadow: 0 8px 20px rgba($accent-pink, 0.18);

  &:hover { color: #fff; background: #315544; box-shadow: 0 10px 24px rgba($accent-pink, 0.24); }
}

.cta--secondary {
  color: $accent-pink;
  // P4: a faint fill + stronger border lifts the secondary button so it no
  // longer looks like an afterthought next to the solid primary CTA.
  background: rgba($accent-pink, 0.06);
  border-color: rgba($accent-pink, 0.4);

  &:hover { color: $accent-pink; background: rgba($accent-pink, 0.12); border-color: rgba($accent-pink, 0.6); }
}

.landing__social {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: 30px;
  list-style: none;
}

.landing__social a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 38px;
  color: $text-secondary;
  font-size: 0.82rem;
  font-weight: 550;

  svg { width: 16px; height: 16px; }
  &:hover { color: $accent-pink; }
}

.avatar-zone { min-width: 0; }

.portrait-wrap {
  position: relative;
  width: min(100%, 410px);
  margin-inline: auto;
  padding: 18px 18px 0 0;
}

.portrait-accent {
  position: absolute;
  top: 0;
  right: 0;
  width: 74%;
  height: 74%;
  background: $bg-secondary;
  border: 1px solid #d9dfd8;
  border-radius: $radius-md;
}

.avatar-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #dfe7df;
  border: 1px solid #d4ddd5;
  border-radius: $radius-md;
  box-shadow: 0 20px 45px rgba(31, 42, 36, 0.11);
}

.avatar-frame__inner,
.avatar-image {
  width: 100%;
  height: 100%;
}

.avatar-image { object-fit: cover; }

.avatar-fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: $accent-pink;
  background: $bg-secondary;
  font-family: $font-mono;
  font-size: 4rem;
  font-weight: 700;
}

.portrait-note {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: calc(100% - 18px);
  min-height: 48px;
  padding: 0 14px;
  color: $text-secondary;
  background: $bg-card;
  border: 1px solid $glass-border;
  border-top: 0;
  border-radius: 0 0 $radius-md $radius-md;
  font-family: $font-mono;
  font-size: 0.7rem;

  span:last-child { margin-left: auto; }
}

.avatar-status {
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  background: #5a936f;
  border-radius: 50%;
}
.avatar-status--hidden { display: none; }

.explore-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 40px;
  border-top: 1px solid $glass-border;
  border-bottom: 1px solid $glass-border;
}

.explore-link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  min-height: 106px;
  padding: 18px 24px;
  color: $text-primary;
  border-right: 1px solid $glass-border;

  &:last-child { border-right: 0; }
  &:hover { color: $accent-pink; background: rgba($accent-pink, 0.035); }
  > svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; transition: transform $transition-fast; }
  &:hover > svg { transform: translateX(3px); }
  strong, small { display: block; }
  strong { font-size: 0.94rem; }
  small { margin-top: 3px; color: $text-secondary; font-size: 0.72rem; }
}

.explore-link__index {
  color: $accent-purple;
  font-family: $font-mono;
  font-size: 0.7rem;
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 899px) {
  .page-landing { width: min(100% - 36px, 720px); padding-top: 36px; }
  .landing {
    grid-template-columns: 1fr;
    gap: 44px;
    min-height: 0;
  }
  .intro-zone { max-width: none; text-align: center; }
  .landing__eyebrow,
  .landing__cta,
  .landing__social { justify-content: center; }
  .landing__name { font-size: clamp(3.2rem, 13vw, 5.2rem); }
  .landing__tagline,
  .landing__bio { margin-right: auto; margin-left: auto; }
  .portrait-wrap { width: min(72vw, 390px); }
  .explore-strip { grid-template-columns: 1fr; margin-top: 52px; }
  .explore-link { min-height: 88px; border-right: 0; border-bottom: 1px solid $glass-border; }
  .explore-link:last-child { border-bottom: 0; }
}

@media (max-width: 520px) {
  .page-landing { width: calc(100% - 28px); padding: 28px 0 24px; }
  .landing { gap: 28px; }
  .landing__name { margin-top: 14px; font-size: 3.15rem; }
  .landing__tagline { font-size: 1.28rem; }
  .landing__bio { margin: 18px 0 26px; font-size: 0.94rem; line-height: 1.75; }
  .landing__cta { display: grid; grid-template-columns: 1fr 1fr; }
  .cta { width: 100%; padding-inline: 14px; }
  .landing__social { gap: 14px; margin-top: 22px; }
  .portrait-wrap { width: min(76vw, 280px); }
  .portrait-note { font-size: 0.62rem; }
  .explore-strip { margin-top: 30px; }
  .explore-link { padding: 16px 12px; }
}
</style>
