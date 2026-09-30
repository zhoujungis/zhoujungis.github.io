/**
 * climbOverflow.js — 只为离线出图（viz-shot）开的入口。
 *
 * viz-shot 取模块里「第一个以 mount 开头的导出」，而 climb.js 同时导出两套
 * 画法 —— 单独一个模块名指向「int32 溢出」那一套：
 *
 *   node scripts/viz-shot.mjs climb         .shots ...   # n=10 填表
 *   node scripts/viz-shot.mjs climbOverflow .shots ...   # n=50 溢出条
 *   node scripts/viz-shot.mjs climbRec      .shots ...   # 递归树
 */

export { mountClimbOverflow } from './climb'
