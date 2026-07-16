<template>
  <nav class="toc-nav" :class="{ 'toc-empty': !headings.length }">
    <h4 class="toc-title">目录</h4>

    <div v-if="headings.length" class="toc-list-wrapper">
      <ul class="toc-list">
        <li
          v-for="item in headings"
          :key="item.id"
          class="toc-item"
          :class="[
            `toc-depth-${item.tag}`,
            { 'toc-active': activeId === item.id },
          ]"
        >
          <a
            :href="'#' + item.id"
            class="toc-link"
            :title="item.text"
            @click.prevent="scrollTo(item.id)"
          >
            <span class="toc-dot" />
            <span class="toc-text">{{ item.text }}</span>
          </a>
        </li>
      </ul>
    </div>

    <div v-else class="toc-empty-state">
      <p>无目录</p>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  html: {
    type: String,
    default: '',
  },
})

const headings = ref([])
const activeId = ref(null)

let observer = null
let headingElements = []

function parseHeadings() {
  if (!props.html) {
    headings.value = []
    return
  }

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(props.html, 'text/html')
    const items = []

    doc.querySelectorAll('h2, h3, h4').forEach((el, index) => {
      const id = el.id || `toc-heading-${index}`
      items.push({
        id,
        tag: el.tagName.toLowerCase(),
        text: el.textContent || '',
      })
    })

    headings.value = items
  } catch {
    headings.value = []
  }
}

// M21: when the parsed HTML didn't have explicit IDs, mirror the synthetic
// IDs onto the actual headings in the live DOM so scrollIntoView + observer
// can find them.
function assignIdsToRenderedHeadings() {
  if (!headings.value.length) return
  // Walk the article container for h2/h3/h4 in order and pair them up.
  const container = document.querySelector('.markdown-body')
  if (!container) return
  const live = container.querySelectorAll('h2, h3, h4')
  live.forEach((el, idx) => {
    const item = headings.value[idx]
    if (item && !el.id) el.id = item.id
  })
}

function setupObserver() {
  // Clean up previous observer
  if (observer) {
    observer.disconnect()
    observer = null
  }

  headingElements = []

  if (!headings.value.length) return

  observer = new IntersectionObserver(
    (entries) => {
      // Find the first visible heading
      const visible = entries.filter((entry) => entry.isIntersecting)
      if (visible.length) {
        // Use the first visible heading
        activeId.value = visible[0].target.id
      } else {
        // If none visible (scrolled past all), keep last
        // Or if we're at the top, clear
        const scrollY = window.scrollY
        if (scrollY < 100) {
          activeId.value = headings.value[0]?.id || null
        }
      }
    },
    {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    }
  )

  // Observe actual heading elements in the DOM
  nextTick(() => {
    headings.value.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) {
        observer.observe(el)
        headingElements.push(el)
      }
    })
  })
}

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeId.value = id
  }
}

// Re-parse and re-observe when HTML changes
watch(
  () => props.html,
  () => {
    parseHeadings()
    nextTick(() => {
      assignIdsToRenderedHeadings()
      setupObserver()
    })
  }
)

onMounted(() => {
  parseHeadings()
  nextTick(() => {
    assignIdsToRenderedHeadings()
    setupObserver()
  })
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.toc-nav {
  width: 240px;
  flex-shrink: 0;
}

.toc-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: $neon-cyan;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid $glass-border;
}

.toc-list-wrapper {
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  scrollbar-width: thin;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 2px 0;
}

.toc-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  font-size: 0.82rem;
  line-height: 1.4;
  color: $text-secondary;
  text-decoration: none;
  border-radius: 6px;
  transition: color $transition-fast, background $transition-fast, padding-left $transition-fast;

  &:hover {
    color: $text-primary;
    background: rgba(255, 255, 255, 0.04);
  }
}

.toc-dot {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: $text-secondary;
  flex-shrink: 0;
  transition: background $transition-fast, box-shadow $transition-fast;
}

.toc-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// ---- Depth indentation ----
.toc-depth-h3 .toc-link {
  padding-left: 20px;
  font-size: 0.78rem;
}

.toc-depth-h4 .toc-link {
  padding-left: 32px;
  font-size: 0.76rem;
}

// ---- Active state ----
.toc-active {
  > .toc-link {
    color: $neon-cyan;
    background: rgba(0, 229, 255, 0.06);

    .toc-dot {
      background: $neon-cyan;
      box-shadow: 0 0 6px $neon-cyan;
    }
  }
}

// ---- Empty state ----
.toc-empty-state {
  padding: 20px 0;
  text-align: center;

  p {
    font-size: 0.8rem;
    color: $text-secondary;
    opacity: 0.5;
  }
}

// ---- Hide when no headings ----
.toc-empty {
  display: none;
}
</style>
