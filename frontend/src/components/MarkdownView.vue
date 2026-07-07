<template>
  <div ref="bodyRef" class="markdown-body" v-html="html" />
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import 'highlight.js/styles/github.css'

const props = defineProps({
  html: { type: String, default: '' },
})

const bodyRef = ref(null)

function attachCopyButtons() {
  if (!bodyRef.value) return
  const blocks = bodyRef.value.querySelectorAll('pre')
  blocks.forEach((pre) => {
    // Skip if already has a copy wrapper
    if (pre.parentElement?.classList.contains('code-block-wrapper')) return

    // Wrap pre in a container
    const wrapper = document.createElement('div')
    wrapper.className = 'code-block-wrapper'
    pre.parentNode.insertBefore(wrapper, pre)
    wrapper.appendChild(pre)

    // Create copy button
    const btn = document.createElement('button')
    btn.className = 'copy-btn'
    btn.title = '复制代码'
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'

    btn.addEventListener('click', () => {
      const code = pre.querySelector('code') || pre
      const text = code.textContent || ''
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied')
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
        setTimeout(() => {
          btn.classList.remove('copied')
          btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
        }, 2000)
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        btn.classList.add('copied')
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
        setTimeout(() => {
          btn.classList.remove('copied')
          btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
        }, 2000)
      })
    })

    wrapper.appendChild(btn)
  })
}

// ── Content enhancements: Mermaid, video embeds, KaTeX ──
function processEnhancements() {
  if (!bodyRef.value) return

  // Mermaid diagrams: <code class="language-mermaid"> → render with mermaid
  const mermaidBlocks = bodyRef.value.querySelectorAll('code.language-mermaid')
  if (mermaidBlocks.length && window.mermaid) {
    mermaidBlocks.forEach((block, i) => {
      const pre = block.closest('pre')
      if (!pre || pre.dataset.mermaidRendered) return
      pre.dataset.mermaidRendered = '1'
      const container = document.createElement('div')
      container.className = 'mermaid-container'
      container.textContent = block.textContent
      pre.parentNode.replaceChild(container, pre)
      window.mermaid.run({ nodes: [container] })
    })
  }

  // Video embeds: convert image links ending in .mp4/.webm or youtube/bilibili URLs
  const imgs = bodyRef.value.querySelectorAll('img')
  imgs.forEach((img) => {
    const src = img.getAttribute('src') || ''
    const alt = img.getAttribute('alt') || 'video'

    // YouTube: ![video](https://www.youtube.com/watch?v=XXX)
    const yt = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
    if (yt) {
      const wrapper = document.createElement('div')
      wrapper.className = 'video-wrapper'
      wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${yt[1]}" frameborder="0" allowfullscreen></iframe>`
      img.parentNode.replaceChild(wrapper, img)
      return
    }

    // Bilibili: ![video](https://www.bilibili.com/video/BVXXX)
    const bili = src.match(/bilibili\.com\/video\/(BV[\w]+)/)
    if (bili) {
      const wrapper = document.createElement('div')
      wrapper.className = 'video-wrapper'
      wrapper.innerHTML = `<iframe src="https://player.bilibili.com/player.html?bvid=${bili[1]}" frameborder="0" allowfullscreen></iframe>`
      img.parentNode.replaceChild(wrapper, img)
      return
    }
  })

  // KaTeX: render $$...$$ blocks
  const text = bodyRef.value.innerHTML
  if (text.includes('$$') && window.katex) {
    // Replace display math $$...$$
    bodyRef.value.innerHTML = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
      try {
        return window.katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })
      } catch { return _ }
    })
    // Replace inline math $...$
    bodyRef.value.innerHTML = bodyRef.value.innerHTML.replace(/\$(.+?)\$/g, (_, formula) => {
      try {
        return window.katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false })
      } catch { return _ }
    })
  }
}

onMounted(() => {
  nextTick(() => { attachCopyButtons(); processEnhancements() })
})

watch(() => props.html, () => {
  nextTick(() => { attachCopyButtons(); processEnhancements() })
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

  // Headings
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

  :deep(p) { margin: 0.8em 0; }

  // Code block wrapper
  :deep(.code-block-wrapper) {
    position: relative;
    margin: 1.2em 0;

    pre {
      margin: 0;
    }

    .copy-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      cursor: pointer;
      color: #888;
      opacity: 0;
      transition: opacity 0.2s, color 0.2s, background 0.2s;

      &:hover {
        color: $accent-pink;
        background: rgba(255, 255, 255, 0.9);
      }

      &.copied {
        color: #00c853;
        background: rgba(0, 200, 83, 0.08);
        border-color: rgba(0, 200, 83, 0.3);
      }
    }

    &:hover .copy-btn {
      opacity: 1;
    }
  }

  // Code blocks
  :deep(pre) {
    background: #faf5f7;
    border-left: 3px solid $accent-pink;
    border-radius: $radius-md;
    padding: 16px 20px;
    padding-right: 48px;
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

  // Video embed
  :deep(.video-wrapper) {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    margin: 1.5em 0;
    border-radius: $radius-md;
    overflow: hidden;
    iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
  }

  // Mermaid diagrams
  :deep(.mermaid-container) {
    margin: 1.5em 0;
    padding: 20px;
    background: #faf5f7;
    border-radius: $radius-md;
    border: 1px solid $glass-border;
    overflow-x: auto;
    text-align: center;
    svg { max-width: 100%; }
  }

  // Responsive
  @media (max-width: 767px) {
    font-size: 0.95rem;
    :deep(h1) { font-size: 1.5rem; }
    :deep(h2) { font-size: 1.3rem; }
    :deep(h3) { font-size: 1.15rem; }
    :deep(pre) { padding: 12px 14px; padding-right: 40px; font-size: 0.8rem; }
  }
}
</style>
