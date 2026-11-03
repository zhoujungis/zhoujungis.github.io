/**
 * topics.js — 五个编辑专题（聚合页）的唯一数据源。
 *
 * 运行时（/topics 与 /topics/:slug）和构建期（scripts/prerender.mjs 写的静态
 * 聚合页、sitemap）都从这里读，所以页面正文与爬虫看到的快照不会出现两套措辞。
 *
 * `slug` 必须与后端 Category.slug 一致 —— 专题页正是用
 * `GET /articles/?category__slug=<slug>` 取文章的。
 */
export const TOPICS = [
  {
    slug: 'leetcode',
    name: '算法题解',
    en: 'Algorithms',
    tagline: '从暴力解推到最优解，写清每一步为什么',
    keywords: 'LeetCode 题解, 算法, 动态规划, 贪心, 图, 并查集, 滑动窗口, 面试',
    intro: [
      '这里按题型整理算法题解：贪心、动态规划、图与并查集、滑动窗口、链表与二叉树、堆与二分。每篇都从暴力解出发，逐步推到时间与空间最优，并给出可直接运行的代码和复杂度分析。',
      '比起背结论，更在意「哪一步可以省、为什么能省」——把面试里真正会被追问的边界条件和反例写清楚，让题解能迁移到没见过的题上。',
    ],
  },
  {
    slug: 'aiagent',
    name: 'AI Agent',
    en: 'Agent Engineering',
    tagline: '多智能体、提示注入防御、上下文工程与可观测性',
    keywords: 'AI Agent, 多智能体, Multi-Agent, 提示词注入, 上下文工程, MCP, LLM 推理, 模型评测',
    intro: [
      '这个专题讨论把大模型真正接进生产系统的工程问题：多智能体如何拆分职责、子代理之间怎么通信、任务板与限流如何避免级联失败，以及提示注入这类「谁说的话算指令」的信任边界。',
      '也包括上下文工程、工具调用（MCP / Skills）、推理框架与国产模型横评——目标不是复述概念，而是给出可落地的架构与踩坑记录。',
    ],
    series: [
      'agent-loop-two-hundred-lines',
      'agent-context-keep-or-drop',
      'agent-memory-without-vector-db',
      'agent-tool-design-output-budgets',
      'agent-concurrency-without-async',
      'agent-multiagent-subagents-board-and-gate',
      'agent-security-run-commands-safely',
      'agent-prompt-injection-boundary',
      'agent-observability-turn-ledger',
      'agent-token-economics',
      'agent-evaluation-not-a-benchmark',
    ],
  },
  {
    slug: 'backend',
    name: '后端架构',
    en: 'Backend',
    tagline: 'Django、并发、限流、灰度与线上部署',
    keywords: 'Django, DRF, 后端架构, 并发, 限流, 缓存, 灰度发布, 部署, 性能优化',
    intro: [
      '后端专题覆盖从接口设计到线上运维的完整链路：Django / DRF 的工程实践、限流与熔断、幂等设计、缓存与消息队列，以及把服务真正部署上线时绕不开的域名、HTTPS、CDN 与云主机选型。',
      '文章大多来自这个博客自己的运行经验——包括 PythonAnywhere、GitHub Pages 这类小规模部署里真实踩到的坑。',
    ],
  },
  {
    slug: 'database',
    name: '数据库内核',
    en: 'Database Internals',
    tagline: 'B+ 树、WAL、MVCC 与存储引擎的实现细节',
    keywords: '数据库内核, B+树, 页分裂, WAL, 预写日志, MVCC, 存储引擎, Redis, NanoDB',
    intro: [
      '数据库内核专题只关心一件事：数据到底是怎么被写下去、又怎么被读回来的。B+ 树页分裂与回源、WAL 的预写顺序、MVCC 的版本链、LSM 与 B 树的取舍，都会配图拆到具体页和具体字段。',
      '也包括从零实现一个嵌入式文档数据库（NanoDB）的过程记录，以及 Redis、PostgreSQL 在实际项目里的用法与限制。',
    ],
    series: [
      'btree-page-split',
      'wal-deep-dive',
      'nanodb',
      'mysql-clustered-index-vs-secondary-index',
      'mysql-composite-index-leftmost-prefix',
      'mysql-explain-type-all-ref-range',
    ],
  },
  {
    slug: 'projects',
    name: '项目实战',
    en: 'Projects',
    tagline: '从零实现：浏览器协议、零运行时 Agent、音乐与小游戏',
    keywords: '项目实战, 开源项目, NanoBrowser, CDP, Rust, 音乐应用, 小游戏, 智能家居',
    intro: [
      '专题收录完整的开源项目拆解：手写进程内 CDP 协议的 NanoBrowser、零运行时的 Rust Agent、多音源在线音乐应用、24 款零框架小游戏，以及智能家居从开发到认证的全过程。',
      '重点不在「做了什么」，而在设计取舍：为什么不用某个框架、哪些抽象被删掉了、性能与可维护性在哪里换了一次。',
    ],
    series: [
      'nanobrowser-tauri-webview2',
      'nanohermes-rust-coding-agent',
      'aidevops-terminal-client',
      'halo-music-square-architecture',
      'happy-games-24-games-zero-framework-guide',
      'google-matter-smart-home-dev-guide',
    ],
  },
]

/**
 * `series` 是专题内的推荐阅读顺序（不是时间顺序）。只有成体系写作的专题
 * 才配置，题解 55 篇、后端 30 篇这种散点集合不配，避免顶部出现一个几十项
 * 的目录。文章页的「本系列目录」和预渲染快照都按这个顺序排。
 *
 * 未发布/已被删除的 slug 会在运行时被过滤掉，不需要提前删。
 */
export const SERIES_MIN_MINUTES = 8


/** 按 slug 查专题；找不到返回 undefined（路由/构建脚本据此判断是否兜底）。 */
export function findTopic(slug) {
  return TOPICS.find((topic) => topic.slug === slug)
}

/** 专题页的路径（带尾斜杠，与 prerender 写出的真实静态文件一致）。 */
export function topicPath(slug) {
  return `/topics/${slug}/`
}

/**
 * 分类的落地页路径。
 *
 * 有对应编辑专题的分类（leetcode / aiagent / backend / database / projects）
 * 直接落到 /topics/<slug>/，避免同一批文章在两个 URL 上重复；没有专题的
 * 分类（如「随笔」）才走 /categories/<slug>/ 的通用落地页。
 */
export function categoryPath(slug) {
  return findTopic(slug) ? topicPath(slug) : `/categories/${encodeURIComponent(String(slug))}/`
}

/** 该专题的推荐阅读顺序；没有配置系列的专题返回空数组。 */
export function seriesOrder(topicSlug) {
  return findTopic(topicSlug)?.series || []
}
