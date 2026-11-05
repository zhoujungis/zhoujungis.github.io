/**
 * friends.js — 友情链接的兜底数据。
 *
 * 页面数据主要来自后端 GET /friends/。这个数组只在接口不可用或返回空列表时
 * 使用，运行时（pages/FriendLinks.vue）与构建期预渲染（scripts/prerender.mjs
 * 写的 /friends/ 静态快照）共用同一份 —— 否则接口挂掉时静态快照和页面会显示
 * 两份不同的链接。
 */
export const FRIEND_FALLBACK = [
  { name: 'GitHub', url: 'https://github.com', description: '代码托管与开源项目' },
  { name: 'ChatGPT', url: 'https://chatgpt.com/', description: '对话式 AI 助手' },
]
