<template>
  <div ref="bodyRef" class="markdown-body" v-html="sanitizedHtml" />
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import DOMPurify from 'dompurify'
import { stripLeadingDuplicateTitle } from '@/utils/articleHtml'
import { mountLinkedListReverse } from '@/viz/linkedListReverse'
import { mountMergeTwoLists } from '@/viz/mergeTwoLists'
import { mountMergeKLists } from '@/viz/mergeKLists'
import { mountMergeKDCLists } from '@/viz/mergeKDCLists'
import { mountCycleDetect } from '@/viz/cycleDetect'
import { mountCycleEntry } from '@/viz/cycleEntry'
import { mountRemoveNthFromEnd } from '@/viz/removeNthFromEnd'
import { mountReorderList } from '@/viz/reorderList'
import { mountPalindromeList } from '@/viz/palindromeList'
import { mountIntersectLists } from '@/viz/intersectLists'
import 'highlight.js/styles/github.css'

const props = defineProps({
  html: { type: String, default: '' },
  // The template already renders the title; passing it here lets us drop a body
  // heading that merely repeats it. See utils/articleHtml.js for the numbers.
  title: { type: String, default: '' },
})

const bodyRef = ref(null)

// Defense-in-depth: backend already sanitizes html_content via bleach, but
// any existing article in the DB was stored before that. Sanitize again on
// render to neutralize any leftover <script>/onclick= before v-html executes.
// Strip the duplicate title AFTER sanitizing — bleach/DOMPurify may rewrite the
// leading tag, so matching on the raw source would be fragile.
const sanitizedHtml = computed(() =>
  stripLeadingDuplicateTitle(
    DOMPurify.sanitize(props.html, {
      ADD_ATTR: ['target', 'rel'],
      FORBID_TAGS: ['style', 'iframe', 'object', 'embed', 'form'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick'],
    }),
    props.title,
  )
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

// A wide markdown table must scroll inside its own box instead of stretching
// the page. Tables have a min-content width driven by their cells, so
// `width: 100%` does not stop a 6-column table from overflowing: measured a
// 475px table inside a 362px column → 99px of horizontal page overflow at
// 390px, which also widened the fixed header (its containing block is the
// viewport, so it grew to 489px). A scroll wrapper is the only fix that keeps
// the table layout intact — `display: block` on the table itself would drop
// `border-collapse: collapse` onto an anonymous table box.
function wrapTables() {
  if (!bodyRef.value) return
  bodyRef.value.querySelectorAll('table').forEach((table) => {
    if (table.parentElement?.classList.contains('table-scroll')) return
    const wrapper = document.createElement('div')
    wrapper.className = 'table-scroll'
    table.parentNode.insertBefore(wrapper, table)
    wrapper.appendChild(table)
  })
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

  // KaTeX: render $...$ / $$...$$ inside text nodes.
  //
  // The node is SPLIT on the delimiters rather than handed to KaTeX whole.
  // `delimiters` is an option of renderMathInElement (the auto-render contrib),
  // NOT of renderToString — passing it here is silently ignored, so KaTeX tried
  // to parse the entire node *including* the `$` signs and emitted a red
  // <span class="katex-error"> for every formula:
  //   ParseError: KaTeX parse error: Can't use function '$' in math mode
  // Inline math was worse than block: the whole surrounding sentence got
  // swallowed into the same error span, so a paragraph with one formula turned
  // red from end to end.
  //
  // Text-node walking (instead of an innerHTML rewrite of the container) keeps
  // copy-button wrappers and table markup intact.
  //
  // P1: only treat a node as math when it contains real $...$ / $$...$$
  // delimiters — a lone literal "$" (prices etc.) must not pull down KaTeX.
  const MATH_SPLIT_RE = /(\$\$[\s\S]+?\$\$|\$[^\s$](?:[^$]*[^\s$])?\$)/
  const walker = document.createTreeWalker(bodyRef.value, NodeFilter.SHOW_TEXT)
  const toProcess = []
  let node
  while ((node = walker.nextNode())) {
    if (!node.nodeValue || !MATH_SPLIT_RE.test(node.nodeValue)) continue
    // Never touch code: shell snippets and regexes are full of literal `$`.
    if (node.parentElement?.closest('pre, code')) continue
    toProcess.push(node)
  }
  if (toProcess.length) {
    try {
      const katex = await loadKatex()
      for (const textNode of toProcess) {
        const frag = document.createDocumentFragment()
        for (const part of textNode.nodeValue.split(MATH_SPLIT_RE)) {
          if (!part) continue
          const isBlock = part.startsWith('$$') && part.endsWith('$$') && part.length > 3
          const isInline = !isBlock && part.startsWith('$') && part.endsWith('$') && part.length > 2
          if (!isBlock && !isInline) {
            frag.appendChild(document.createTextNode(part))
            continue
          }
          const tex = part.slice(isBlock ? 2 : 1, isBlock ? -2 : -1)
          const span = document.createElement('span')
          span.innerHTML = katex.renderToString(tex, {
            displayMode: isBlock,
            throwOnError: false,
          })
          frag.appendChild(span)
        }
        textNode.parentNode.replaceChild(frag, textNode)
      }
    } catch (e) {
      console.warn('KaTeX failed to load/render:', e?.message || e)
    }
  }
}

// ── 算法动画占位符 ─────────────────────────────────────────────────────────
// 文章正文里写的是一个空 div：
//     <div class="algo-viz algo-viz--lc206"></div>
//
// 为什么不直接把动画写在 markdown 里：正文要过三道清洗（后端 Python-Markdown
// → bleach → 前端 DOMPurify），而 bleach 的白名单里没有 svg / style / script，
// div 也只保留 class。所以动画只能在客户端现场构建，文章里只留占位符。
//
// key 是占位符的第二个类名；值是挂载函数，返回 { destroy() }。
// 加新动画时：实现一个同签名的模块，在这里注册一行。
const VIZ_MOUNTERS = {
  'algo-viz--lc206': mountLinkedListReverse,
  'algo-viz--lc21': mountMergeTwoLists,
  'algo-viz--lc23': mountMergeKLists,
  'algo-viz--lc23dc': mountMergeKDCLists,
  'algo-viz--lc141': mountCycleDetect,
  'algo-viz--lc142': mountCycleEntry,
  'algo-viz--lc19': mountRemoveNthFromEnd,
  'algo-viz--lc143': mountReorderList,
  'algo-viz--lc234': mountPalindromeList,
  'algo-viz--lc160': mountIntersectLists,
}

let vizHandles = []

// v-html 会整块换掉 DOM，旧的动画实例必须显式销毁，否则定时器和
// IntersectionObserver 会留在后台继续跑（切文章时最明显）。
function unmountViz() {
  vizHandles.forEach((handle) => {
    try {
      handle?.destroy?.()
    } catch (e) {
      console.warn('Algo viz teardown failed:', e?.message || e)
    }
  })
  vizHandles = []
}

function mountViz() {
  if (!bodyRef.value) return
  unmountViz()
  bodyRef.value.querySelectorAll('.algo-viz').forEach((host) => {
    const key = Object.keys(VIZ_MOUNTERS).find((name) => host.classList.contains(name))
    if (!key) return
    try {
      vizHandles.push(VIZ_MOUNTERS[key](host))
    } catch (e) {
      // 动画挂了不能连累正文渲染 —— 占位符留空即可。
      console.warn('Algo viz failed to mount:', key, e?.message || e)
    }
  })
}

onMounted(() => {
  nextTick(() => { mountViz(); processEnhancements(); wrapTables(); attachCopyButtons() })
})

onBeforeUnmount(unmountViz)

watch(() => props.html, () => {
  nextTick(() => { mountViz(); processEnhancements(); wrapTables(); attachCopyButtons() })
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
    // Long unbreakable tokens in inline code (paths, identifiers, URLs) wrap
    // instead of pushing the document wider than the viewport.
    overflow-wrap: anywhere;
  }
  // Code blocks have their own scroll container — never wrap their lines.
  :deep(pre code) { overflow-wrap: normal; }

  // Blockquote
  :deep(blockquote) {
    border-left: 3px solid $accent-purple;
    background: rgba(201,177,255,0.08);
    padding: 12px 20px; margin: 1em 0;
    border-radius: 0 $radius-md $radius-md 0;
    color: $text-secondary;
    p { margin: 0; }
  }

  // Tables — the scroll wrapper carries the margin so the table can scroll
  // edge-to-edge inside it without the margin being clipped.
  :deep(.table-scroll) {
    margin: 1.2em 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  // Display math: KaTeX ships .katex-display as a centred block, but a long
  // derivation still exceeds the column width on a phone. Scroll it inside its
  // own box the same way a wide table is handled, instead of letting it widen
  // the page (and with it the fixed header — same failure as the table case).
  // Note: do NOT set font-size on .katex — KaTeX's own `font: normal 1.21em`
  // shorthand is what sizes the math, and overriding just the size shrinks it.
  :deep(.katex-display) {
    margin: 1.2em 0;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }
  :deep(table) {
    width: 100%; border-collapse: collapse;
    margin: 0; border-radius: $radius-md;
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
    // Tighter cells shrink the table's min-content width, so fewer tables
    // need to scroll at all on a phone.
    :deep(th), :deep(td) { padding: 8px 10px; font-size: 0.82rem; }
  }
}
</style>
