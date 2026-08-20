<template>
  <div ref="bodyRef" class="markdown-body" v-html="sanitizedHtml" />
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import DOMPurify from 'dompurify'
import 'highlight.js/styles/github.css'

const props = defineProps({
  html: { type: String, default: '' },
})

const bodyRef = ref(null)

// Defense-in-depth: backend already sanitizes html_content via bleach, but
// any existing article in the DB was stored before that. Sanitize again on
// render to neutralize any leftover <script>/onclick= before v-html executes.
const sanitizedHtml = computed(() =>
  DOMPurify.sanitize(props.html, {
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['style', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick'],
  })
)

// Copy-button icons were duplicated as raw strings four times; keep one copy.
const COPY_ICON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
const CHECK_ICON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'

function markCopied(btn) {
  btn.classList.add('copied')
  btn.innerHTML = CHECK_ICON_SVG
  setTimeout(() => {
    btn.classList.remove('copied')
    btn.innerHTML = COPY_ICON_SVG
  }, 2000)
}

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
    btn.innerHTML = COPY_ICON_SVG

    btn.addEventListener('click', () => {
      const code = pre.querySelector('code') || pre
      const text = code.textContent || ''
      navigator.clipboard.writeText(text).then(() => {
        markCopied(btn)
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
        markCopied(btn)
      })
    })

    wrapper.appendChild(btn)
  })
}

// ── Content enhancements: Mermaid, video embeds, KaTeX ──
// P1 perf: KaTeX + Mermaid were unconditionally preloaded from index.html on
// every page (hundreds of KB). They are now injected on demand, only when the
// current article actually needs them. Versions stay pinned with SRI hashes
// (defense against CDN supply-chain compromise — see C-S1).
const KATEX_VERSION = '0.16.21'
const MERMAID_VERSION = '11.4.1'

function injectStylesheet(href, integrity) {
  return new Promise((resolve, reject) => {
    // Reuse if already present (multiple renders / route changes).
    if (document.querySelector(`link[data-lib-href="${href}"]`)) return resolve()
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.integrity = integrity
    link.crossOrigin = 'anonymous'
    link.dataset.libHref = href
    link.onload = () => resolve()
    link.onerror = () => reject(new Error('Failed to load stylesheet ' + href))
    document.head.appendChild(link)
  })
}

function injectScript(src, integrity) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-lib-src="${src}"]`)) return resolve()
    const script = document.createElement('script')
    script.src = src
    script.integrity = integrity
    script.crossOrigin = 'anonymous'
    script.dataset.libSrc = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load script ' + src))
    document.head.appendChild(script)
  })
}

// Single-flight loaders: concurrent calls share one network request.
let katexPromise = null
async function loadKatex() {
  if (!katexPromise) {
    katexPromise = Promise.all([
      injectStylesheet(
        `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.css`,
        'sha384-zh0CIslj+VczCZtlzBcjt5ppRcsAmDnRem7ESsYwWwg3m/OaJ2l4x7YBZl9Kxxib',
      ),
      injectScript(
        `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.js`,
        'sha384-Rma6DA2IPUwhNxmrB/7S3Tno0YY7sFu9WSYMCuulLhIqYSGZ2gKCJWIqhBWqMQfh',
      ),
    ]).then(() => window.katex)
  }
  return katexPromise
}

let mermaidPromise = null
async function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = injectScript(
      `https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.min.js`,
      'sha384-rbtjAdnIQE/aQJGEgXrVUlMibdfTSa4PQju4HDhN3sR2PmaKFzhEafuePsl9H/9I',
    ).then(() => window.mermaid)
  }
  return mermaidPromise
}

async function processEnhancements() {
  if (!bodyRef.value) return

  // Mermaid diagrams: <code class="language-mermaid"> → render with mermaid
  const mermaidBlocks = bodyRef.value.querySelectorAll('code.language-mermaid')
  if (mermaidBlocks.length) {
    try {
      const mermaid = await loadMermaid()
      mermaidBlocks.forEach((block) => {
        const pre = block.closest('pre')
        if (!pre || pre.dataset.mermaidRendered) return
        pre.dataset.mermaidRendered = '1'
        const container = document.createElement('div')
        container.className = 'mermaid-container'
        container.textContent = block.textContent
        pre.parentNode.replaceChild(container, pre)
        mermaid.run({ nodes: [container] })
      })
    } catch (e) {
      console.warn('Mermaid failed to load/render:', e?.message || e)
    }
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

  // KaTeX: render $$...$$ blocks. Text-node walking so copy-button wrappers
  // attached afterward aren't wiped by an innerHTML rewrite.
  // P1: only treat a node as math when it contains real $...$ / $$...$$
  // delimiters — a lone literal "$" (prices etc.) must not pull down KaTeX.
  const MATH_RE = /\$\$[\s\S]+?\$\$|\$[^\s$](?:[^$]*[^\s$])?\$/
  const walker = document.createTreeWalker(bodyRef.value, NodeFilter.SHOW_TEXT)
  const toProcess = []
  let node
  while ((node = walker.nextNode())) {
    if (node.nodeValue && MATH_RE.test(node.nodeValue)) toProcess.push(node)
  }
  if (toProcess.length) {
    try {
      const katex = await loadKatex()
      for (const textNode of toProcess) {
        const html = katex.renderToString(textNode.nodeValue, {
          displayMode: false,
          throwOnError: false,
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ],
        })
        const wrapper = document.createElement('span')
        wrapper.innerHTML = html
        textNode.parentNode.replaceChild(wrapper, textNode)
      }
    } catch (e) {
      console.warn('KaTeX failed to load/render:', e?.message || e)
    }
  }
}

onMounted(() => {
  nextTick(() => { processEnhancements(); attachCopyButtons() })
})

watch(() => props.html, () => {
  nextTick(() => { processEnhancements(); attachCopyButtons() })
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
  :deep(h1) { font-size: 1.8rem; border-bottom: 2px solid rgba($accent-pink, 0.18); padding-bottom: 0.4em; }
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
    box-shadow: 0 2px 8px rgba($accent-pink, 0.08);

    code {
      background: transparent; color: inherit; padding: 0;
      font-size: inherit; font-family: inherit;
      line-height: inherit; border: none;
    }
  }

  // Inline code
  :deep(code) {
    background: rgba($accent-pink, 0.1);
    color: #315544;
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
    background: rgba($accent-pink, 0.08);
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
  :deep(tr:nth-child(even)) { background: rgba($accent-pink, 0.03); }
  :deep(tr:hover) { background: rgba($accent-pink, 0.06); }

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
