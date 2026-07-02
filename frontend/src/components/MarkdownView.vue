<template>
  <div class="markdown-body" v-html="html" />
</template>

<script setup>
import 'highlight.js/styles/atom-one-dark.css'

defineProps({
  html: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/variables' as *;

.markdown-body {
  line-height: 1.8;
  font-size: 1rem;
  color: $text-primary;
  word-wrap: break-word;

  // ============ Headings ============
  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    color: $neon-cyan;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 700;
    line-height: 1.3;
  }

  :deep(h1) { font-size: 2rem; }
  :deep(h2) { font-size: 1.75rem; }
  :deep(h3) { font-size: 1.5rem; }
  :deep(h4) { font-size: 1.25rem; }
  :deep(h5) { font-size: 1.1rem; }
  :deep(h6) { font-size: 1rem; }

  :deep(h1)::before,
  :deep(h2)::before,
  :deep(h3)::before,
  :deep(h4)::before,
  :deep(h5)::before,
  :deep(h6)::before {
    content: '# ';
    color: $neon-pink;
  }

  // ============ Paragraphs ============
  :deep(p) {
    margin: 0.8em 0;
  }

  // ============ Code blocks ============
  :deep(pre) {
    background: #0d0d14;
    border-left: 3px solid $neon-pink;
    border-radius: 8px;
    padding: 16px 20px;
    overflow-x: auto;
    margin: 1.2em 0;
    font-family: $font-mono;
    font-size: 0.875rem;
    line-height: 1.6;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);

    code {
      background: transparent;
      color: inherit;
      padding: 0;
      font-size: inherit;
      font-family: inherit;
      line-height: inherit;
      border: none;
    }
  }

  :deep(code) {
    background: rgba(255, 0, 128, 0.1);
    color: $neon-pink;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 0.85em;
    font-family: $font-mono;
  }

  // ============ Blockquote ============
  :deep(blockquote) {
    border-left: 3px solid $neon-purple;
    background: rgba(123, 47, 255, 0.06);
    padding: 12px 20px;
    margin: 1em 0;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: $text-secondary;

    p {
      margin: 0;
    }
  }

  // ============ Tables ============
  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.2em 0;
    border-radius: 8px;
    overflow: hidden;
    background: $bg-card;
    border: 1px solid $glass-border;
  }

  :deep(th) {
    background: rgba(0, 229, 255, 0.08);
    color: $neon-cyan;
    font-weight: 600;
    text-align: left;
    padding: 12px 16px;
    border-bottom: 1px solid $glass-border;
    font-size: 0.9rem;
  }

  :deep(td) {
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    font-size: 0.9rem;
  }

  :deep(tr:last-child td) {
    border-bottom: none;
  }

  :deep(tr:nth-child(even)) {
    background: rgba(255, 255, 255, 0.02);
  }

  :deep(tr:hover) {
    background: rgba(0, 229, 255, 0.03);
  }

  // ============ Links ============
  :deep(a) {
    color: $neon-cyan;
    text-decoration: none;
    transition: color $transition-fast, text-shadow $transition-fast;

    &:hover {
      text-decoration: underline;
      text-shadow: 0 0 7px rgba($neon-cyan, 0.4);
    }
  }

  // ============ Images ============
  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1.5em auto;
    display: block;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transition: transform $transition-base, box-shadow $transition-base;

    &:hover {
      transform: scale(1.01);
      box-shadow: 0 6px 28px rgba(0, 0, 0, 0.4);
    }
  }

  // ============ Lists ============
  :deep(ul),
  :deep(ol) {
    padding-left: 1.5em;
    margin: 0.6em 0;
  }

  :deep(li) {
    margin: 0.3em 0;
    line-height: 1.7;
  }

  :deep(ul > li)::marker {
    color: $neon-purple;
  }

  :deep(ol > li)::marker {
    color: $neon-cyan;
  }

  // nested lists
  :deep(ul ul),
  :deep(ol ol),
  :deep(ul ol),
  :deep(ol ul) {
    margin: 0.3em 0;
  }

  // ============ Horizontal rule ============
  :deep(hr) {
    border: none;
    height: 1px;
    background: linear-gradient(to right, $neon-cyan, $neon-purple);
    margin: 2em 0;
    opacity: 0.4;
  }

  // ============ Inline elements ============
  :deep(strong) {
    color: color.adjust($text-primary, $lightness: 10%);
    font-weight: 700;
  }

  :deep(em) {
    font-style: italic;
  }

  :deep(del) {
    text-decoration: line-through;
    opacity: 0.7;
  }

  // ============ Responsive ============
  @media (max-width: 767px) {
    font-size: 0.95rem;

    :deep(h1) { font-size: 1.6rem; }
    :deep(h2) { font-size: 1.4rem; }
    :deep(h3) { font-size: 1.25rem; }
    :deep(pre) {
      padding: 12px 14px;
      font-size: 0.8rem;
    }
    :deep(table) {
      font-size: 0.85rem;
    }
  }
}
</style>
