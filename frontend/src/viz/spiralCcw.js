/**
 * spiralCcw.js — 只为离线出图（viz-shot）开的入口。
 *
 * viz-shot 取模块里「第一个以 mount 开头的导出」，而 spiral.js 同时导出两套
 * 方向顺序 —— 单独一个模块名指向「真逆时针（下、右、上、左）」那一套：
 *
 *   node scripts/viz-shot.mjs spiral    .shots ...   # 右、下、左、上
 *   node scripts/viz-shot.mjs spiralCcw .shots ...   # 下、右、上、左
 */

export { mountSpiralCcw } from './spiral'
