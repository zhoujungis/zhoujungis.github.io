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
