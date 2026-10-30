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
import { mountRemoveDups2 } from '@/viz/removeDups2'
import { mountLevelOrder } from '@/viz/levelOrder'
import { mountLca } from '@/viz/lca'
import { mountMaxPathSum } from '@/viz/maxPathSum'
import { mountMaxDepth } from '@/viz/maxDepth'
import { mountInvertTree } from '@/viz/invertTree'
import { mountLongestSubstr } from '@/viz/longestSubstr'
import { mountTwoSum } from '@/viz/twoSum'
import { mountThreeSum } from '@/viz/threeSum'
import { mountTrappingRainWater } from '@/viz/trappingRainWater'
import { mountTrappingRainStack } from '@/viz/trappingRainStack'
import { mountKadane } from '@/viz/kadane'
import { mountQuickSelect } from '@/viz/quickSelect'
import { mountBucketTopK } from '@/viz/bucketTopK'
import { mountMergeIntervals } from '@/viz/mergeIntervals'
import { mountRotatedSearch } from '@/viz/rotatedSearch'
import { mountRotatedMin } from '@/viz/rotatedMin'
import { mountRotate } from '@/viz/rotate'
import { mountAddStrings } from '@/viz/addStrings'
import { mountCompareVersion } from '@/viz/compareVersion'
import { mountLongestPal } from '@/viz/longestPal'
import { mountRestoreIp } from '@/viz/restoreIp'
import { mountBrackets } from '@/viz/brackets'
import { mountSlidingMax } from '@/viz/slidingMax'
import { mountLisDp } from '@/viz/lisDp'
import { mountLisBinary } from '@/viz/lisBinary'
import { mountEditDistGrid, mountEditDistRoll } from '@/viz/editDistance'
import { mountClimb, mountClimbOverflow } from '@/viz/climb'
import { mountClimbRec } from '@/viz/climbRec'
import { mountNim } from '@/viz/nim'
import { mountLc877 } from '@/viz/lc877'
import { mountVarPart } from '@/viz/varPart'
import { mountSpiral, mountSpiralCcw } from '@/viz/spiral'
import { mountKthLarge, mountKthLargeDup } from '@/viz/kthLarge'
import { mountDigitOne } from '@/viz/digitOne'
import { mountDigitOneBlock } from '@/viz/digitOneBlock'
import { mountPokerStraight } from '@/viz/pokerStraight'
import { mountPokerStraightBug } from '@/viz/pokerStraightBug'
import { mountLcs1 } from '@/viz/lcs1'
import { mountLcs1Walk } from '@/viz/lcs1Walk'
import { mountBitmap } from '@/viz/bitmap'
import { mountBitmapTwoBit } from '@/viz/bitmapTwoBit'
import { mountMinStack } from '@/viz/minStack'
import { mountQueueViaStacks } from '@/viz/queueViaStacks'
import { mountBasicCalc } from '@/viz/basicCalc'
import { mountCalcIII } from '@/viz/calcIII'
import { mountBinarySearch } from '@/viz/binarySearch'
import { mountSqrt } from '@/viz/sqrt'
import { mountStockI } from '@/viz/stockI'
import { mountStockII } from '@/viz/stockII'
import { mountCoinChange } from '@/viz/coinChange'
import { mountCoinChangeOrder } from '@/viz/coinChangeOrder'
import { mountWordBreak } from '@/viz/wordBreak'
import { mountWordBreakSeg } from '@/viz/wordBreakSeg'
import { mountGreatestSumDiv3 } from '@/viz/greatestSumDiv3'
import { mountGreatestSumDiv3Dp } from '@/viz/greatestSumDiv3Dp'
import { mountIslands } from '@/viz/islands'
import { mountIslandsUf } from '@/viz/islandsUf'
import { mountRotOrange } from '@/viz/rotOrange'
import { mountRotOrangeDist } from '@/viz/rotOrangeDist'
import { mountCourseSchedule } from '@/viz/courseSchedule'
import { mountCourseScheduleDfs } from '@/viz/courseScheduleDfs'
import { mountLruCache } from '@/viz/lruCache'
import { mountLfuCache } from '@/viz/lfuCache'
import { mountRand10 } from '@/viz/rand10'
import { mountRand10Uniform } from '@/viz/rand10Uniform'
import { mountEliminateSum10 } from '@/viz/eliminateSum10'
import { mountEliminateSum10Order } from '@/viz/eliminateSum10Order'
import { mountLc1928 } from '@/viz/lc1928'
import { mountLc1928Path } from '@/viz/lc1928Path'
import { mountKmp } from '@/viz/kmp'
import { mountKmpMatch } from '@/viz/kmpMatch'
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

    // Detect language badge from pre or code class
    const codeEl = pre.querySelector('code') || pre
    const classList = Array.from(codeEl.classList).concat(Array.from(pre.classList))
    const langMatch = classList.find(c => c.startsWith('language-') || c.startsWith('lang-'))
    let lang = ''
    if (langMatch) {
      lang = langMatch.replace(/^(language-|lang-)/, '').toUpperCase()
      if (lang === 'CPP') lang = 'C++'
      if (lang === 'JS') lang = 'JavaScript'
      if (lang === 'TS') lang = 'TypeScript'
      if (lang === 'PY') lang = 'Python'
    }

    // Top terminal bar with dots & optional language
    const topBar = document.createElement('div')
    topBar.className = 'code-top-bar'
    topBar.innerHTML = '<span class="code-dots"><i class="dot dot-r"></i><i class="dot dot-y"></i><i class="dot dot-g"></i></span>' +
      (lang ? '<span class="code-lang">' + lang + '</span>' : '')
    wrapper.appendChild(topBar)

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
  'algo-viz--lc82': mountRemoveDups2,
  'algo-viz--lc102': mountLevelOrder,
  'algo-viz--lc236': mountLca,
  'algo-viz--lc124': mountMaxPathSum,
  'algo-viz--lc104': mountMaxDepth,
  'algo-viz--lc226': mountInvertTree,
  'algo-viz--lc3': mountLongestSubstr,
  'algo-viz--lc1': mountTwoSum,
  'algo-viz--lc15': mountThreeSum,
  'algo-viz--lc42': mountTrappingRainWater,
  'algo-viz--lc42stack': mountTrappingRainStack,
  'algo-viz--lc53': mountKadane,
  'algo-viz--lc215': mountQuickSelect,
  'algo-viz--lc347': mountBucketTopK,
  'algo-viz--lc56': mountMergeIntervals,
  'algo-viz--lc33': mountRotatedSearch,
  'algo-viz--lc153': mountRotatedMin,
  'algo-viz--lc189': mountRotate,
  'algo-viz--lc415': mountAddStrings,
  'algo-viz--lc165': mountCompareVersion,
  'algo-viz--lc5': mountLongestPal,
  'algo-viz--lc93': mountRestoreIp,
  'algo-viz--lc20': mountBrackets,
  'algo-viz--lc239': mountSlidingMax,
  'algo-viz--lc300dp': mountLisDp,
  'algo-viz--lc300binary': mountLisBinary,
  'algo-viz--lc72': mountEditDistGrid,
  'algo-viz--lc72roll': mountEditDistRoll,
  'algo-viz--lc70': mountClimb,
  'algo-viz--lc70over': mountClimbOverflow,
  'algo-viz--lc70rec': mountClimbRec,
  'algo-viz--nim': mountNim,
  'algo-viz--lc877': mountLc877,
  'algo-viz--varpart': mountVarPart,
  'algo-viz--spiral': mountSpiral,
  'algo-viz--spiralccw': mountSpiralCcw,
  'algo-viz--kthlarge': mountKthLarge,
  'algo-viz--kthdup': mountKthLargeDup,
  'algo-viz--lc233': mountDigitOne,
  'algo-viz--lc233block': mountDigitOneBlock,
  'algo-viz--poker61': mountPokerStraight,
  'algo-viz--poker61bug': mountPokerStraightBug,
  'algo-viz--lcs1': mountLcs1,
  'algo-viz--lcs1walk': mountLcs1Walk,
  'algo-viz--bitmap': mountBitmap,
  'algo-viz--bitmap2bit': mountBitmapTwoBit,
  'algo-viz--lc155': mountMinStack,
  'algo-viz--lc232': mountQueueViaStacks,
  'algo-viz--lc224': mountBasicCalc,
  'algo-viz--lc772': mountCalcIII,
  'algo-viz--lc704': mountBinarySearch,
  'algo-viz--lc69': mountSqrt,
  'algo-viz--lc121': mountStockI,
  'algo-viz--lc122': mountStockII,
  'algo-viz--lc322': mountCoinChange,
  'algo-viz--lc322order': mountCoinChangeOrder,
  'algo-viz--lc139': mountWordBreak,
  'algo-viz--lc139seg': mountWordBreakSeg,
  'algo-viz--lc1262': mountGreatestSumDiv3,
  'algo-viz--lc1262dp': mountGreatestSumDiv3Dp,
  'algo-viz--lc200': mountIslands,
  'algo-viz--lc200uf': mountIslandsUf,
  'algo-viz--lc994': mountRotOrange,
  'algo-viz--lc994dist': mountRotOrangeDist,
  'algo-viz--lc207': mountCourseSchedule,
  'algo-viz--lc207dfs': mountCourseScheduleDfs,
  'algo-viz--lc146': mountLruCache,
  'algo-viz--lc146lfu': mountLfuCache,
  'algo-viz--lc470': mountRand10,
  'algo-viz--lc470uni': mountRand10Uniform,
  'algo-viz--txelim': mountEliminateSum10,
  'algo-viz--txorder': mountEliminateSum10Order,
  'algo-viz--lc1928': mountLc1928,
  'algo-viz--lc1928path': mountLc1928Path,
  'algo-viz--kmp': mountKmp,
  'algo-viz--kmpmatch': mountKmpMatch,
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
  // 标题层级并入字号阶梯 1.5 / 1.2 / 1.05 / 0.88，
  // h4-h6 不再各自造一个新字号，靠字重与颜色区分
  :deep(h1) { font-size: 1.8rem; border-bottom: 2px solid rgba($accent-pink, 0.18); padding-bottom: 0.4em; }
  :deep(h2) { font-size: 1.5rem; }
  :deep(h3) { font-size: 1.2rem; }
  :deep(h4) { font-size: 1.05rem; }
  :deep(h5) { font-size: 1.05rem; }
  :deep(h6) { font-size: 0.88rem; }

  :deep(p) { margin: 0.8em 0; }

  // Code block wrapper — Mac Terminal 沉浸式极客风格
  :deep(.code-block-wrapper) {
    position: relative;
    margin: 1.4em 0;
    border-radius: $radius-md;
    overflow: hidden;
    background: #141a17;
    border: 1px solid rgba(237, 241, 238, 0.09);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);

    .code-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 34px;
      padding: 0 14px;
      background: #18201c;
      border-bottom: 1px solid rgba(237, 241, 238, 0.06);
      user-select: none;
    }

    .code-dots {
      display: inline-flex;
      align-items: center;
      gap: 6px;

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        &.dot-r { background: #ff5f56; }
        &.dot-y { background: #ffbd2e; }
        &.dot-g { background: #27c93f; }
      }
    }

    .code-lang {
      font-family: $font-mono;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: #8fb29c;
      text-transform: uppercase;
      opacity: 0.85;
    }

    pre {
      margin: 0;
      border: none;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      color: #e5ece7;
      padding: 16px 20px;
      padding-right: 50px;
    }

    .copy-btn {
      position: absolute;
      top: 3px;
      right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 5px;
      cursor: pointer;
      color: #aeb9b1;
      opacity: 0.6;
      transition: opacity 0.2s, color 0.2s, background 0.2s;

      &:hover {
        opacity: 1;
        color: #edf1ee;
        background: rgba(255, 255, 255, 0.15);
      }

      &.copied {
        opacity: 1;
        color: #27c93f;
        background: rgba(39, 201, 63, 0.15);
        border-color: rgba(39, 201, 63, 0.4);
      }
    }

    &:hover .copy-btn {
      opacity: 0.85;
    }
  }

  // Code blocks
  :deep(pre) {
    overflow-x: auto;
    font-family: $font-mono;
    font-size: 0.88rem;
    line-height: 1.65;

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

  // Blockquote / Callout — 优雅的侧边高光与圆角卡片
  :deep(blockquote) {
    border-left: 4px solid $accent-purple;
    background: rgba($accent-purple, 0.08);
    padding: 14px 20px;
    margin: 1.2em 0;
    border-radius: 4px $radius-md $radius-md 4px;
    color: $text-secondary;
    line-height: 1.7;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    p { margin: 0; }
  }

  // Tables — 带有渐隐滚动阴影（Scroll Hint）的优雅横向滚动容器
  :deep(.table-scroll) {
    margin: 1.2em 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
    border-radius: $radius-md;
    background: linear-gradient(to right, white 30%, rgba(255, 255, 255, 0)),
                linear-gradient(to right, rgba(255, 255, 255, 0), white 70%) 0 100%,
                radial-gradient(farthest-side at 0% 50%, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0)),
                radial-gradient(farthest-side at 100% 50%, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0)) 0 100%;
    background-repeat: no-repeat;
    background-color: transparent;
    background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
    background-position: 0 0, 100% 0, 0 0, 100% 0;
    background-attachment: local, local, scroll, scroll;
  }
  // Display math
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
