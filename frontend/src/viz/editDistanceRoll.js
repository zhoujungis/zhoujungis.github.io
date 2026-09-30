/**
 * editDistanceRoll.js — 只为离线出图（viz-shot）开的入口。
 *
 * viz-shot 取模块里「第一个以 mount 开头的导出」，而 editDistance.js 同时导出两套
 * 画法 —— 单独一个模块名指向「滚动数组」那一套，出图时才分得开：
 *
 *   node scripts/viz-shot.mjs editDistance     .shots ...   # 完整二维表
 *   node scripts/viz-shot.mjs editDistanceRoll .shots ...   # 滚动数组 O(n)
 */

export { mountEditDistRoll } from './editDistance'
