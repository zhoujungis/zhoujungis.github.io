<template>
  <div class="page page-algorithms">
    <header class="page-header">
      <h1 class="page-title">算法解读</h1>
      <p class="page-subtitle">
        面试高频题，逐题拆解推演过程 —— 讲清楚「为什么」而不只是「怎么写」
      </p>
    </header>

    <div class="algo-stats">
      <span>共 <strong>{{ items.length }}</strong> 题</span>
      <span class="algo-stats__sep" aria-hidden="true">·</span>
      <span>已上线 <strong>{{ liveCount }}</strong> 题</span>
    </div>

    <AlgorithmList :items="items" />

    <p class="algo-foot">
      题单会持续更新。每道题都配一个可单步回放的推演动画，
      建议先自己手推一遍，再看代码。
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AlgorithmList from '@/components/AlgorithmList.vue'
import { ALGORITHMS } from '@/data/algorithms'
import { useSEO } from '@/utils/seo'

const items = ALGORITHMS
const liveCount = computed(() => items.filter((a) => a.published).length)

useSEO({
  title: '算法解读',
  description: 'LeetCode 高频面试题的逐题拆解：三指针、递归、K 个一组反转，配可回放的推演动画。',
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-algorithms {
  max-width: 860px;
  margin: 0 auto;
  padding: 48px 20px 64px;
}

.algo-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: -18px 0 20px;
  color: var(--text-secondary);
  font-family: $font-mono;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  strong { color: var(--accent); font-weight: 700; }
}

.algo-stats__sep { opacity: 0.5; }

.algo-foot {
  margin-top: 28px;
  padding-left: 14px;
  border-left: 3px solid var(--accent-secondary);
  color: var(--text-secondary);
  font-size: 0.82rem;
  line-height: 1.8;
}
</style>
