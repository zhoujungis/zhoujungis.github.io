<template>
  <div class="not-found">
    <p class="not-found__eyebrow">PAGE NOT FOUND</p>
    <h1 class="not-found__code">404</h1>
    <p class="not-found__message">这页内容可能已经搬走了。</p>
    <router-link to="/" class="not-found__link">返回首页</router-link>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100svh - 180px);
  padding: 48px 20px;
  text-align: center;
}

.not-found__eyebrow {
  color: $accent-purple;
  font-family: $font-mono;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.not-found__code {
  margin: 10px 0 0;
  color: $text-primary;
  font-size: clamp(5rem, 15vw, 9rem);
  font-weight: 750;
  line-height: 1;
  letter-spacing: 0;
}

.not-found__message {
  margin: 12px 0 26px;
  color: $text-secondary;
  font-size: 1rem;
}

.not-found__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 20px;
  color: #fff;
  background: $accent-pink;
  border: 1px solid $accent-pink;
  border-radius: $radius-md;
  font-weight: 600;
}

.not-found__link:hover { color: #fff; background: #315544; }
</style>
