<template>
  <div class="markdown-body" v-html="html" />
</template>

<script setup>
import 'highlight.js/styles/github.css'

defineProps({
  html: { type: String, default: '' },
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/variables' as *;

.markdown-body {
  line-height: 1.9;
  font-size: 1.05rem;
  color: $text-primary;
  word-wrap: break-word;

  // Headings — no ::before (Django already renders # prefix)
  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    color: $accent-pink;
    margin-top: 1.5em; margin-bottom: 0.6em;
    font-weight: 700; line-height: 1.35;
  }
  :deep(h1) { font-size: 1.8rem; border-bottom: 2px solid rgba(255,133,162,0.2); padding-bottom: 0.4em; }
  :deep(h2) { font-size: 1.55rem; }
  :deep(h3) { font-size: 1.35rem; }
  :deep(h4) { font-size: 1.15rem; }
  :deep(h5) { font-size: 1.05rem; }
  :deep(h6) { font-size: 0.95rem; }

  // Paragraphs
  :deep(p) { margin: 0.8em 0; }

  // Code blocks — light theme
  :deep(pre) {
    background: #faf5f7;
    border-left: 3px solid $accent-pink;
    border-radius: $radius-md;
    padding: 16px 20px;
    overflow-x: auto;
    margin: 1.2em 0;
    font-family: $font-mono;
    font-size: 0.875rem;
    line-height: 1.6;
    box-shadow: 0 2px 8px rgba(255,133,162,0.08);

    code {
      background: transparent; color: inherit; padding: 0;
      font-size: inherit; font-family: inherit;
      line-height: inherit; border: none;
    }
  }

  // Inline code
  :deep(code) {
    background: rgba(255,133,162,0.1);
    color: #d4677e;
    padding: 2px 7px; border-radius: 4px;
    font-size: 0.85em; font-family: $font-mono;
  }

  // Blockquote
  :deep(blockquote) {
    border-left: 3px solid $accent-purple;
    background: rgba(201,177,255,0.08);
    padding: 12px 20px; margin: 1em 0;
    border-radius: 0 $radius-md $radius-md 0;
    color: $text-secondary;
    p { margin: 0; }
  }

  // Tables
  :deep(table) {
    width: 100%; border-collapse: collapse;
    margin: 1.2em 0; border-radius: $radius-md;
    overflow: hidden; background: $bg-card;
    border: 1px solid $glass-border;
  }
  :deep(th) {
    background: rgba(255,133,162,0.08);
    color: $accent-pink; font-weight: 600;
    text-align: left; padding: 12px 16px;
    border-bottom: 1px solid $glass-border;
    font-size: 0.9rem;
  }
  :deep(td) {
    padding: 10px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.04);
    font-size: 0.9rem;
  }
  :deep(tr:last-child td) { border-bottom: none; }
  :deep(tr:nth-child(even)) { background: rgba(255,133,162,0.03); }
  :deep(tr:hover) { background: rgba(255,133,162,0.06); }

  // Links
  :deep(a) {
    color: $accent-pink; text-decoration: none;
    transition: color $transition-fast;
    &:hover { color: color.adjust($accent-pink, $lightness: -10%); text-decoration: underline; }
  }

  // Images
  :deep(img) {
    max-width: 100%; height: auto;
    border-radius: $radius-md;
    margin: 1.5em auto; display: block;
    box-shadow: $card-shadow;
  }

  // Lists
  :deep(ul), :deep(ol) { padding-left: 1.5em; margin: 0.6em 0; }
  :deep(li) { margin: 0.3em 0; line-height: 1.7; }
  :deep(ul > li)::marker { color: $accent-pink; }
  :deep(ol > li)::marker { color: $accent-mint; }
  :deep(ul ul), :deep(ol ol), :deep(ul ol), :deep(ol ul) { margin: 0.3em 0; }

  // HR
  :deep(hr) {
    border: none; height: 1px;
    background: linear-gradient(to right, $accent-pink, $accent-purple);
    margin: 2em 0; opacity: 0.3;
  }

  // Strong / Em / Del
  :deep(strong) { font-weight: 700; color: $accent-pink; }
  :deep(em) { font-style: italic; }
  :deep(del) { text-decoration: line-through; opacity: 0.7; }

  // Responsive
  @media (max-width: 767px) {
    font-size: 0.95rem;
    :deep(h1) { font-size: 1.5rem; }
    :deep(h2) { font-size: 1.3rem; }
    :deep(h3) { font-size: 1.15rem; }
    :deep(pre) { padding: 12px 14px; font-size: 0.8rem; }
  }
}
</style>
