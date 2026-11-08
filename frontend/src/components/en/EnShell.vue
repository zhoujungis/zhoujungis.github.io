<template>
  <div class="en-shell">
    <header class="en-shell__bar">
      <router-link class="en-brand" :to="path.home">
        <span class="en-brand__name">{{ ui.brand }}</span>
      </router-link>
      <nav class="en-nav" aria-label="Primary">
        <router-link :to="path.home">{{ ui.nav.home }}</router-link>
        <router-link :to="path.articles">{{ ui.nav.articles }}</router-link>
        <router-link :to="path.topics">{{ ui.nav.topics }}</router-link>
        <router-link :to="path.about">{{ ui.nav.about }}</router-link>
        <a href="/rss.xml">{{ ui.nav.rss }}</a>
        <a href="/" hreflang="zh-CN" @click="rememberLang('zh')">{{ ui.nav.zh }}</a>
        <ThemeToggle />
      </nav>
    </header>

    <slot />

    <footer class="en-shell__foot">
      <span>{{ ui.footer.rights }}</span>
      <nav class="en-shell__legal">
        <a :href="`mailto:${contact.email}`">Email</a>
        <a :href="contact.github">GitHub</a>
        <a :href="contact.rss">RSS</a>
        <a :href="path.about">About</a>
        <a :href="path.privacy">Privacy</a>
        <a :href="path.disclaimer">Disclaimer</a>
      </nav>
      <span class="en-shell__built">{{ ui.footer.built }}</span>
    </footer>
  </div>
</template>

<script setup>
import ThemeToggle from '@/components/ThemeToggle.vue'
import { EN_CONTACT, EN_UI, enPath } from '@/data/en/site'
import { rememberLang } from '@/utils/locale'

const ui = EN_UI
const contact = EN_CONTACT
const path = enPath
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

$serif: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', serif;

.en-shell {
  width: min(100% - 48px, 900px);
  margin-inline: auto;
  padding: 28px 0 48px;
  color: var(--text-primary);
  line-height: 1.8;
}

.en-shell__bar {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px 24px;
  flex-wrap: wrap;
  padding-bottom: 6px;
  border-bottom: 3px solid var(--text-primary);
}

.en-brand {
  color: inherit;
  text-decoration: none;

  &__name {
    font-family: $serif;
    font-size: 1.4rem;
    font-weight: 900;
    line-height: 1.1;
  }
}

.en-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  line-height: 1.2;

  a {
    color: var(--text-secondary);
    font-size: 0.82rem;
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    padding-bottom: 1px;
    transition: color $transition-fast, border-color $transition-fast;

    &:hover {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }
  }
}

.en-shell__foot {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 56px;
  padding-top: 14px;
  border-top: 1px solid var(--glass-border);
  color: var(--text-secondary);
  font-size: 0.78rem;
}

.en-shell__built {
  font-family: $font-mono;
  font-size: 0.7rem;
}

.en-shell__legal {
  display: flex;
  gap: 14px;

  a {
    color: var(--text-secondary);
    text-decoration: none;

    &:hover { color: var(--accent); }
  }
}

@media (max-width: 640px) {
  .en-shell { width: calc(100% - 32px); padding-top: 24px; }
  .en-nav { gap: 12px; }
}
</style>
