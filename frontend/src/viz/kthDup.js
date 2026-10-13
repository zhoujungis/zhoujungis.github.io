/**
 * kthDup.js — 只为离线出图（viz-shot）开的入口。
 *
 * viz-shot 取模块里「第一个以 mount 开头的导出」，而 kthLarge.js 同时导出两种
 * 口径 —— 单独一个模块名指向「去重口径」那一套：
 *
 *   node scripts/viz-shot.mjs kthLarge .shots ...   # 不去重（答案 16）
 *   node scripts/viz-shot.mjs kthDup   .shots ...   # 去重（答案 8）
 */

export { mountKthLargeDup } from './kthLarge'
