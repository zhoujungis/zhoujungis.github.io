"""把文学化标题改成用户在 Google 里真正会敲的搜索词。

背景：GSC 显示站点的展现几乎只来自 LeetCode 题解（lc 994、lc 102 等），
但标题写成 `【LC 994】腐烂的橘子：多源 BFS，和一张腐烂时刻表` —— 没有
「LeetCode」全称、没有官方题名格式，机器和人都很难把它和
`994. 腐烂的橘子`、`leetcode 994 bfs` 这些查询对上。

本命令只改 `title`，slug/正文/URL 全部不动（已收录链接不受影响）。
默认预演，`--apply` 才写入；重复执行是幂等的。
"""

from django.core.management.base import BaseCommand
from django.utils import timezone

from articles.models import Article

# slug → 新标题。题解统一为「LeetCode <题号>. <官方题名> - <算法>」，
# 双题合并的文章保留 121/122 这种写法；非 LeetCode 的算法文用
# 「<问题> - <算法>」的检索式标题。硬核文章把「能得到什么」写进标题。
TITLE_MAP = {
    # ── 算法题解 ───────────────────────────────────────────────
    "lc-lcs-one-mismatch": "最长公共连续子串（允许一个错）- 动态规划图解",
    "lc-bitmap-sort-dedup": "海量数据 10 亿整数排序去重 - 位图（Bitmap）实现",
    "kmp-next-array": "KMP 算法 next 数组详解 - 最长相等前后缀",
    "lc-1928-min-cost": "LeetCode 1928. 规定时间内到达终点的最小花费 - 分层图 DP",
    "lc-61-poker-straight": "剑指 Offer 61. 扑克牌中的顺子 - 5 张牌判定",
    "lc-233-number-of-digit-one": "LeetCode 233. 数字 1 的个数 - 逐位统计 O(log n)",
    "kth-largest-with-duplicates": "重复元素找第 10 大 - TopK 与计数口径",
    "spiral-matrix-fill": "螺旋矩阵填数 - 模拟与边界处理",
    "partition-variance-dp": "序列切分使方差和最大 - 前缀和优化 DP",
    "nim-stone-games": "博弈论 - 石子游戏先手必胜的异或判定",
    "tencent-eliminate-sum10": "腾讯面经 - 相邻和为 10 消除（栈模拟）",
    "lc-470-implement-rand10-using-rand7": "LeetCode 470. 用 Rand7() 实现 Rand10() - 拒绝采样",
    "lc-146-lru-cache": "LeetCode 146. LRU 缓存 - 哈希表 + 双向链表",
    "lc-207-course-schedule": "LeetCode 207. 课程表 - 拓扑排序（Kahn 与 DFS）",
    "lc-994-rotting-oranges": "LeetCode 994. 腐烂的橘子 - 多源 BFS 图解",
    "lc-200-number-of-islands": "LeetCode 200. 岛屿数量 - 染色法与防爆栈",
    "lc-1262-greatest-sum-divisible-by-three": "LeetCode 1262. 可被三整除的最大和 - 贪心与滚动 DP",
    "lc-139-word-break": "LeetCode 139. 单词拆分 - 布尔 DP 与回溯",
    "lc-322-coin-change": "LeetCode 322. 零钱兑换 - 完全背包正序与逆序",
    "lc-121-122-best-time-to-buy-and-sell-stock": "LeetCode 121/122. 买卖股票的最佳时机 I & II - 贪心与 DP",
    "lc-70-climbing-stairs": "LeetCode 70. 爬楼梯 - 递推与大数问题",
    "lc-72-edit-distance": "LeetCode 72. 编辑距离 - 二维 DP 与滚动数组",
    "lc-300-longest-increasing-subsequence": "LeetCode 300. 最长递增子序列 - O(n log n) 解法",
    "lc-704-69-binary-search-and-sqrt": "LeetCode 704/69. 二分查找 & x 的平方根 - 边界写法",
    "lc-224-772-basic-calculator": "LeetCode 224/772. 基本计算器 - 栈与优先级",
    "lc-155-232-min-stack-and-queue-via-stacks": "LeetCode 155/232. 最小栈 & 用栈实现队列",
    "lc-239-sliding-window-maximum": "LeetCode 239. 滑动窗口最大值 - 单调队列",
    "lc-20-valid-parentheses": "LeetCode 20. 有效的括号 - 栈解法",
    "lc-93-restore-ip-addresses": "LeetCode 93. 复原 IP 地址 - 分段回溯与剪枝",
    "lc-5-longest-palindromic-substring": "LeetCode 5. 最长回文子串 - 中心扩展法",
    "lc-165-compare-version-numbers": "LeetCode 165. 比较版本号 - 分段归一化比较",
    "lc-415-add-strings": "LeetCode 415. 字符串相加 - 竖式模拟",
    "lc-189-rotate-array": "LeetCode 189. 轮转数组 - 三次翻转法",
    "lc-33-153-rotated-binary-search": "LeetCode 33/153. 搜索旋转排序数组 & 找最小值",
    "lc-56-merge-intervals": "LeetCode 56. 合并区间 - 排序后一次扫描",
    "lc-347-top-k-frequent-elements": "LeetCode 347. 前 K 个高频元素 - 桶排序与堆",
    "lc-215-kth-largest-element": "LeetCode 215. 数组中的第 K 个最大元素 - 快速选择",
    "lc-53-maximum-subarray": "LeetCode 53. 最大子数组和 - Kadane 与 DP",
    "lc-42-trapping-rain-water": "LeetCode 42. 接雨水 - 四种解法对比",
    "lc-15-3sum": "LeetCode 15. 三数之和 - 排序 + 双指针与去重",
    "lc-1-two-sum": "LeetCode 1. 两数之和 - 哈希表一次遍历",
    "lc-3-longest-substring-without-repeating-characters": "LeetCode 3. 无重复字符的最长子串 - 滑动窗口",
    "lc-104-226-max-depth-and-invert-binary-tree": "LeetCode 104/226. 二叉树的最大深度 & 翻转二叉树",
    "lc-124-binary-tree-maximum-path-sum": "LeetCode 124. 二叉树中的最大路径和 - 后序 DP",
    "lc-236-lowest-common-ancestor-of-a-binary-tree": "LeetCode 236. 二叉树的最近公共祖先 - 递归",
    "lc-102-binary-tree-level-order-traversal": "LeetCode 102. 二叉树的层序遍历 - BFS 队列",
    "lc-82-remove-duplicates-from-sorted-list-ii": "LeetCode 82. 删除排序链表中的重复元素 II - dummy 结点",
    "lc-160-intersection-of-two-linked-lists": "LeetCode 160. 相交链表 - 双指针",
    "lc-234-palindrome-linked-list": "LeetCode 234. 回文链表 - 反转后半段",
    "lc-143-reorder-list": "LeetCode 143. 重排链表 - 找中点 + 反转 + 合并",
    "lc-19-remove-nth-from-end": "LeetCode 19. 删除链表的倒数第 N 个结点 - 快慢指针",
    "lc-141-142-linked-list-cycle": "LeetCode 141/142. 环形链表 I & II - 快慢指针",
    "lc-23-merge-k-sorted-lists": "LeetCode 23. 合并 K 个升序链表 - 最小堆",
    "lc-21-merge-two-sorted-lists": "LeetCode 21. 合并两个有序链表 - 递归与迭代",
    "lc-206-reverse-linked-list": "LeetCode 206. 反转链表 - 迭代与递归",
    # ── 硬核文章：把「读者能得到什么」前置 ─────────────────────
    "btree-page-split": "MySQL B+ 树索引页分裂原理图解：为什么会导致回源与性能下降",
    "wal-deep-dive": "数据库 WAL（Write-Ahead Logging）预写日志原理与 Go 源码细读",
    "nanodb": "NanoDB 架构设计：如何从零实现一个 Go 语言嵌入式文档数据库",
    "agent-multiagent-subagents-board-and-gate": (
        "Multi-Agent 多智能体系统架构：子代理通信、任务板设计与 API 动态限流"
    ),
    # ── AI Agent 系列（其余各篇）──────────────────────────────
    "agent-prompt-injection-boundary": "AI Agent 提示注入防御：系统指令、用户输入与工具返回的边界",
    "agent-evaluation-not-a-benchmark": "AI Agent 评测方法：为什么只跑一次的测试不算数",
    "agent-token-economics": "AI Agent Token 成本优化：同一任务为什么差 10 倍",
    "agent-observability-turn-ledger": "AI Agent 可观测性：按轮次记账的链路追踪设计",
    "agent-security-run-commands-safely": "AI Agent 执行 Shell 命令的安全沙箱设计",
    "agent-concurrency-without-async": "不用 async 运行时，AI Agent 如何实现底层高并发",
    "agent-tool-design-output-budgets": "AI Agent 工具设计：为什么每个工具的输出都要设上限",
    "agent-memory-without-vector-db": "AI Agent 长期记忆：不接向量数据库的实现方案",
    "agent-context-keep-or-drop": "AI Agent 上下文管理：哪些该留、哪些该丢",
    "agent-loop-two-hundred-lines": "AI Agent 核心原理：200 行代码实现一个 Agent 循环",
    # ── 后端架构 / 中间件 ─────────────────────────────────────
    "queueing-theory-capacity-planning": "排队论与容量规划：为什么加到 8 台机器反而更慢",
    "structured-logging-tracing-deep-dive": "结构化日志与链路追踪：300 行日志里只有 6 行是你的",
    "cache-trio-deep-dive": "缓存穿透、击穿与雪崩：300 个并发只该打 1 次数据库",
    "cursor-pagination-deep-dive": "MySQL 深分页优化：为什么 LIMIT 100000, 20 越来越慢",
    "api-versioning-deep-dive": "API 版本管理实战：/v1、/v2 之外的演进策略",
    "api-gateway-deep-dive": "API 网关设计：认证、限流与路由的统一入口",
    "resilience-timeout-retry-circuit-breaker-deep-dive": (
        "超时、重试与熔断实战：下游抖 3 秒为什么拖死整个服务"
    ),
    "distributed-id-deep-dive": "分布式 ID 实测：页分裂、时钟回拨与号段模式 20 万 QPS",
    "mq-reliable-delivery-deep-dive": "消息队列可靠投递：消息凭空消失的排查与实测",
    "feature-flag-progressive-delivery": "特性开关与灰度发布：灰度到 20% 为什么一半用户功能消失",
    "rate-limit-algorithms-deep-dive": "限流算法实测：固定窗口 2 倍溢出与令牌桶突刺",
    "api-idempotency-deep-dive": "接口幂等设计：用户双击一下为什么多了 7 条订单",
    "cache-consistency-deep-dive": "缓存一致性：先删缓存还是先删数据库",
    "redis-distributed-lock-deep-dive": "Redis 分布式锁：正确实现与失效边界",
    # ── Django / 前后端实战 ───────────────────────────────────
    "blog-tech-stack": "Vue 3 + Django 前后端分离博客：完整技术栈拆解",
    "django-zero-downtime-migration": "Django 零停机迁移：上线时数据库在重建整张表",
    "django-transaction-atomic-on-commit": "Django 事务与 on_commit：为什么回滚了邮件还是发出去",
    "django-slow-query-index-tuning": "MySQL 慢查询与索引优化：索引建了为什么排序还是没走",
    "django-comment-system-guide": "Django 评论系统设计：匿名评论的七层防线",
    "django-jwt-dual-token-auth": "Django + Vue 双 Token 认证：access 过期如何无感刷新",
    "drf-pagination-cache-throttle": "Django REST Framework 列表接口优化：分页、缓存与限流",
    "django-subscribe-mass-mail": "Django 邮件群发：如何避免一个坏邮箱毒死整批订阅",
    "django-n1-query-kill": "Django N+1 查询优化：从 21 条 SQL 降到 2 条",
    "django-anon-like-dedup": "Django 匿名点赞防刷：五层去重设计",
    "django-bleach-xss-defense": "Django 渲染用户 Markdown 的 XSS 防御",
    "test-manage-system-vue-django": "Vue 3 + Django 测试管理系统：从零搭建全栈项目",
    "django-pythonanywhere-deploy": "Django 部署到 PythonAnywhere 完整教程",
    "vue-github-pages-deploy": "Vue 项目部署到 GitHub Pages 完整教程",
    # ── 项目实战 ───────────────────────────────────────────────
    "nanohermes-rust-coding-agent": "NanoHermes：零运行时依赖的 Rust AI 编码 Agent 实现",
    "nanobrowser-tauri-webview2": "NanoBrowser 架构拆解：Tauri + WebView2 手写进程内 CDP",
    "aidevops-terminal-client": "aidevops 开源项目拆解：研发数据关联与可解释风险模型",
    "happy-games-24-games-zero-framework-guide": "24 款零框架小游戏：纯前端全栈实践",
    "halo-music-square-architecture": "Halo 音乐广场：多音源在线音乐应用架构拆解",
    # ── AI 行业与选型 ─────────────────────────────────────────
    "rea-reverse-engineer-anything": "REA 开源 MCP Server：让 AI Agent 逆向分析任意程序",
    "gpt-6-astra-release-2026": "GPT-6 Astra 发布：开发者需要知道的 8 件事",
    "ai-subscription-price-comparison-2026": "2026 国内大模型涨价对比：普通用户怎么选",
    "chinese-llm-august-2026-releases-preview": "2026 年 8 月国产大模型发布前瞻",
    "vllm-vs-sglang-llm-inference-framework-war": "vLLM vs SGLang：LLM 推理框架性能与选型对比",
    "ai-token-coding-plan-comparison-2026": (
        "2026 AI Token Plan / Coding Plan 对比：国内外 20+ 平台横评"
    ),
    "ibgda-domestic-gpu-rdma-demo-waic2026": "国产 GPU 直通 RDMA 实测：不依赖英伟达网卡的 IBGDA 方案",
    "agent-network-octo": "Agent 互联网：AI Agent 之间的通信网络 Octo",
    "iot-future-next-decade": "IoT 下一个十年：万物互联的行业趋势与机会",
    "how-to-use-skills-to-improve-efficiency": "Claude Skills 使用指南：如何用 Skills 提高效率",
    "2026-chinese-ai-models-comparison": "2026 国产大模型横评：GLM、DeepSeek 等八强对比",
    "how-to-choose-ai-coding-tools": "AI 编程工具怎么选：主流工具对比与选型指南",
    # ── 部署与随笔（保留原有语气，仅前置关键词）────────────────
    "cloud-deployment-guide-cn-vs-global": "国内外云部署选型：国内云服务器与海外 VPS 怎么选",
    "google-matter-smart-home-dev-guide": "Google Matter 智能家居开发指南：从入门到认证",
    "welcome": "博客开篇：代码的世界非黑即白，生活的画布斑驳陆离",
}


class Command(BaseCommand):
    help = "把文章标题改成搜索词形态（默认预演，--apply 才写入）"

    def add_arguments(self, parser):
        parser.add_argument("--apply", action="store_true", help="真正写入；缺省只打印对照")

    def handle(self, *args, **options):
        apply_changes = options["apply"]
        prefix = "" if apply_changes else "[dry-run] "
        found = Article.objects.in_bulk(list(TITLE_MAP.keys()), field_name="slug")

        missing = sorted(slug for slug in TITLE_MAP if slug not in found)
        changed = unchanged = 0
        for slug in sorted(TITLE_MAP):
            article = found.get(slug)
            if article is None:
                continue
            new_title = TITLE_MAP[slug]
            if article.title == new_title:
                unchanged += 1
                continue
            changed += 1
            self.stdout.write(f"{prefix}{slug}")
            self.stdout.write(f"    - {article.title}")
            self.stdout.write(f"    + {new_title}")
            if apply_changes:
                # 用 queryset.update 绕开 post_save：这里只改标题，不该再次
                # 触发新文章订阅通知；同时手动刷新 updated_at 表示页面改版。
                Article.objects.filter(pk=article.pk).update(
                    title=new_title, updated_at=timezone.now()
                )

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"{prefix}完成：改 {changed} 篇，已是最新 {unchanged} 篇，"
                f"未找到 {len(missing)} 篇。"
            )
        )
        if missing:
            self.stdout.write(self.style.WARNING("未找到 slug：" + ", ".join(missing)))
        if not apply_changes:
            self.stdout.write(self.style.WARNING("以上为预演，未写入。确认后加 --apply。"))
