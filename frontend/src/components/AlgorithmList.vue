<template>
  <ol class="algo-list">
    <li v-for="algo in items" :key="algo.slug" class="algo-item">
      <!-- 未发布的题目渲染成 div 而不是链接：文章还没上后端，做成链接点进去
           只会是 404 错误页。见 src/data/algorithms.js 的 published 字段。 -->
      <component
        :is="algo.published ? 'router-link' : 'div'"
        :to="algo.published ? '/article/' + algo.slug : undefined"
        class="algo-item__link"
        :class="{ 'is-pending': !algo.published }"
      >
        <span class="algo-item__id">LC&nbsp;{{ algo.id }}</span>
        <span class="algo-item__body">
          <span class="algo-item__head">
            <strong class="algo-item__title">{{ algo.title }}</strong>
            <span class="algo-item__level" :class="'is-' + levelKey(algo.difficulty)">
              {{ algo.difficulty }}
            </span>
            <span v-if="!algo.published" class="algo-item__pending">待发布</span>
          </span>
          <span class="algo-item__summary">{{ algo.summary }}</span>
          <span v-if="algo.companies && algo.companies.length" class="algo-item__companies">
            <span class="algo-item__companies-label">高频考察</span>
            <span v-for="company in algo.companies" :key="company" class="algo-item__company">
              {{ company }}
            </span>
          </span>
        </span>
        <span class="algo-item__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
      </component>
    </li>
  </ol>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
})

// 难度 → CSS 类名。用映射而不是直接把中文塞进类名，避免中文字符出现在
// class 里（选择器写起来麻烦，也容易在压缩/转义时出问题）。
const LEVEL_KEYS = { 简单: 'easy', 中等: 'medium', 困难: 'hard' }
function levelKey(difficulty) {
  return LEVEL_KEYS[difficulty] || 'medium'
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

$serif: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'STSong', 'SimSun', serif;

.algo-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.algo-item {
  border-top: 1px solid var(--glass-border);
  &:last-child { border-bottom: 1px solid var(--glass-border); }
}

.algo-item__link {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr) 22px;
  gap: 20px;
  align-items: center;
  padding: 20px 0;
  color: inherit;
  text-decoration: none;
  transition: background $transition-fast;

  &:not(.is-pending):hover {
    .algo-item__title { color: var(--accent); }
    .algo-item__arrow { transform: translateX(4px); color: var(--accent); }
  }
  // 未发布：整行降低存在感，但信息仍然可读
  &.is-pending { cursor: default; opacity: 0.72; }
}

.algo-item__id {
  color: var(--accent-secondary);
  font-family: $font-mono;
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.algo-item__body { display: block; min-width: 0; }

.algo-item__head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
}

.algo-item__title {
  color: var(--text-primary);
  font-family: $serif;
  font-size: 1.18rem;
  font-weight: 900;
  line-height: 1.25;
  transition: color $transition-fast;
}

.algo-item__level {
  padding: 2px 9px;
  border: 1px solid currentColor;
  border-radius: 999px;
  font-family: $font-mono;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.04em;
  &.is-easy { color: var(--accent); }
  &.is-medium { color: #c89a46; }
  &.is-hard { color: $accent-purple; }
}

.algo-item__pending {
  padding: 2px 9px;
  color: var(--text-secondary);
  background: var(--surface-muted);
  border-radius: 999px;
  font-family: $font-mono;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.06em;
}

.algo-item__summary {
  display: block;
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.7;
}

.algo-item__companies {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 9px;
  font-family: $font-mono;
  font-size: 0.64rem;
}

.algo-item__companies-label {
  color: var(--text-secondary);
  letter-spacing: 0.06em;
  opacity: 0.75;
}

.algo-item__company {
  padding: 2px 8px;
  color: var(--text-secondary);
  background: var(--surface-muted);
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.algo-item__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: transform $transition-fast, color $transition-fast;
  svg { width: 17px; height: 17px; fill: none; stroke: currentColor; stroke-width: 1.8; }
}

// 窄屏把 LC 编号提到自己一行，标题不再被 88px 的列挤窄
@media (max-width: 520px) {
  .algo-item__link { grid-template-columns: minmax(0, 1fr) 22px; gap: 12px; padding: 16px 0; }
  .algo-item__id { grid-column: 1 / -1; font-size: 0.78rem; }
  .algo-item__title { font-size: 1.05rem; }
}
</style>
