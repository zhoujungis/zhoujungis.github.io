/**
 * 「算法解读」专栏的题单。
 *
 * 为什么单独放一个文件而不是塞进 Home.vue：这是一个会持续加题的专栏，
 * 和「最新项目」那种一次写死的列表不同。加一道题 = 在这里加一条 + 写一篇
 * article/<slug>.md + 用 tools/publish_*.py 发布，不用动页面代码。
 *
 * 字段说明：
 *   id          LeetCode 题号（纯数字，展示时拼成 "LC 206"）
 *   slug        对应 article/<slug>.md 与线上 /article/<slug>/ 的 slug，必须一致
 *   title       题名（用 LeetCode 中文站的官方译名）
 *   difficulty  '简单' | '中等' | '困难'，决定徽章颜色
 *   companies   高频考察的公司；没有可靠来源就留空数组，别编
 *   summary     一句话说清这道题讲什么、以及它连考哪道题
 *   date        解读发布日（YYYY-MM-DD）
 *   published   文章是否已经发布到后端。
 *               false 时首页/题解页渲染成不可点的行 + 「待发布」徽章 ——
 *               因为后端还没有这篇文章，做成链接点进去只会是 404 错误页。
 *               发布之后把它改成 true（或删掉这一行，默认视为已发布）。
 *
 * 排序即展示顺序 —— 新题加在数组最前面。
 */
export const ALGORITHMS = [
  {
    id: 206,
    slug: 'lc-206-reverse-linked-list',
    title: '反转链表',
    difficulty: '简单',
    companies: ['字节', '腾讯', '美团'],
    summary: '三指针迭代、递归两种写法，再连考 K 个一组反转（LC 25）—— 从「指针为什么会丢」讲起。',
    date: '2026-09-21',
    published: true,
  },
]

export default ALGORITHMS
