/**
 * home.js — 首页的文案与项目列表数据。
 *
 * 单一数据源：运行时（pages/Home.vue）与构建期（scripts/prerender.mjs 写的
 * 首页静态快照）都从这里取。首页快照是 AdSense / 不执行 JS 的抓取器唯一能
 * 读到的正文，如果它靠手写复制一份刊头文案，两处措辞就会慢慢分叉。
 *
 * NOTE: 显式带 .js —— prerender.mjs 是构建期 node 脚本，直接 import 本文件，
 * Node 的 ESM 解析不补扩展名（Vite 里两种写法都能过，见 data/sitePages.js）。
 */
import { SITE_AUTHOR, SITE_NAME } from '../utils/siteConfig.js'

export const HOME_MASTHEAD = {
  kicker: 'CODE & LIFE · JOURNAL',
  title: '代码与生活',
  sub: '写字、写码、写日常。',
  // 第一段是题眼（运行时用更大的衬线字号提上来），后两段退成次级色。
  lede: [
    '代码的世界非黑即白，生活的画布斑驳陆离。',
    '我习惯在逻辑与语法的缝隙里敲下项目的迭代，让一行行冰冷的字符在编译中苏醒，长出骨骼与灵魂；也习惯在字里行间打捞生活的琐碎与诗意，将那些转瞬即逝的感动，揉进咖啡的余温和晚霞的褶皱里。',
    '世界很大，潮汐来去，我想把这些亲历的创造与感动，妥帖地存放于此。这里没有宏大的叙事，只有一行行代码的生长，和一个普通灵魂在尘世里，认真生活的痕迹。',
  ],
}

/**
 * 首页静态快照左侧正文的「本站写什么」段落。
 *
 * 这段只进静态快照、不进运行时首页 —— 它和关于页的定位说明同源，作用是让
 * 抓取器在第一屏就能读到站点主题与作者，而不是一串文章标题。
 */
export const HOME_SUMMARY = [
  `${SITE_NAME}是 ${SITE_AUTHOR} 的个人技术博客，内容集中在五个方向：算法题解与数据结构、Django 与后端架构、数据库内核（B+ 树 / WAL / MVCC）、AI Agent 工程，以及从零实现的开源项目。`,
  '文章大多来自实际做过的项目与踩过的坑：每篇尽量写清背景、取舍和结论，而不是复述文档。可以直接从下面的专题进入，也可以翻全部文章或按年月归档。',
]

/** 首页「最新项目」栏目。运行时渲染卡片，静态快照渲染成带描述的条目。 */
export const HOME_PROJECTS = [
  {
    slug: 'z-bot',
    name: 'Z Bot',
    url: 'https://github.com/zhoujungis/z-bot',
    cover: '/projects/z-bot.webp',
    alt: 'Z Bot 桌面客户端首页截图：Today、最近会话与快速提问',
    strong: '一个理解你、记住你，经明确授权后替你行动的本地私人助理。',
    desc: '这是一个运行在 Windows 电脑里的本地优先 AI 助理。它不是 Coding Agent，也不是通用聊天壳：核心是理解你、记住你、帮你处理日常事务，并在明确授权后行动——对话与模型、长期记忆、任务与提醒、工具与权限各有独立页面，高风险操作保持人在环上，不试图取代专业开发代理。桌面端用 Electron 45 + React 19 + TypeScript 6 写成，本地数据落在 node:sqlite + FTS5 上，测试基线含 32 个单元/集成用例与 2 个 Playwright Electron 端到端用例。',
    meta: '体验关键词：本地优先、长期记忆、人确认后行动 · 入口 github.com/zhoujungis/z-bot',
  },
  {
    slug: 'nanoqa',
    name: 'NanoQA',
    url: 'https://github.com/zhoujungis/NanoQA',
    cover: '/projects/nanoqa.webp',
    alt: 'NanoQA 项目概览截图：用例数、执行进度、通过率、缺陷与需求覆盖率',
    strong: '把「需求 → 用例 → 计划 → 执行 → 缺陷 → 报告」质量闭环装进一个平台。',
    desc: '这是一个 AI 原生的测试用例管理与缺陷协同平台。它围绕质量闭环组织功能：模块三级树与版本化用例、快捷键逐条执行、缺陷状态机与多维关联、ECharts 报告、CSV / XLSX 导入导出、命令面板、角色权限矩阵与审计日志；AI 生成用例走留桩设计——MockProvider 产出后必须人工审核才入库。前端是 Vue 3.5 + Element Plus + ECharts 6，后端 Django 6 + DRF + SimpleJWT，数据落 PostgreSQL 18，docker-compose 一键起全栈。',
    meta: '体验关键词：质量闭环、版本快照、可审计 · 入口 github.com/zhoujungis/NanoQA',
  },
  {
    slug: 'devbox',
    name: 'DevBox',
    url: 'https://devbox-492.pages.dev/',
    cover: '/projects/devbox.webp',
    alt: 'DevBox 程序员工具箱界面预览',
    strong: '把日常用得上的小工具集中到一个页面。',
    desc: '这是一个面向程序员的工具箱，收录了四十多个开箱即用的小工具：编码、加密、网络、文本处理、生成器和速查表。所有计算默认在浏览器本地完成，数据不出机器。对我来说，它练习的是单页应用的即时反馈、键盘优先的交互方式，以及“零后端也能做完整产品”的边界。',
    meta: '体验关键词：快、免费、隐私优先 · 入口 devbox-492.pages.dev',
  },
]
