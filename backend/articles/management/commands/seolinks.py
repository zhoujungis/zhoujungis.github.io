"""给 AI Agent 系列补「正文里的上下文内链」。

背景：系列目录只能把同簇文章串在页首，读者读到「压缩是同步的」这一句时
并不会自动跳到讲上下文预算的那一篇。Google 也把正文里的锚文本当作
主题关联信号，而不是只认文末的「相关阅读」。

做法：每条映射给出「源文章 + 正文里唯一的原句 + 目标文章 + 一句承接语」，
在**原句之后**追加一句带链接的话，不替换原句、不改动任何已有措辞：

    ...按标记整体替换，保证记忆块的大小只和检索结果有关，和对话跑了多久无关。
    检索、淘汰与注入策略的完整实现见[《Agent 记忆：不接向量库也能长期记忆》](...)。

安全约束：
- 锚点必须在正文中恰好出现一次；0 次（内容被改过）或多次（会误伤）都跳过并
  打印出来，绝不猜测。
- 已经追加过承接语的条目直接跳过，重复执行是幂等的。
- 只改这 11 篇系列文章的 content；slug / 标题 / URL 不动。
- 保存时临时断开 post_save 通知信号 —— 这是内容修订，不是新发布，不该给
  订阅者再发一遍邮件。

默认预演，`--apply` 才写入。
"""

from django.core.management.base import BaseCommand
from django.db.models.signals import post_save

from articles.models import Article
from articles.signals import notify_subscribers_on_publish

# (源 slug, 正文锚点（必须唯一）, 目标 slug, 追加的承接语)
LINKS = [
    # ── 01 主循环：把「压缩 / 记忆 / 并发」三处交出去 ─────────────
    (
        "agent-loop-two-hundred-lines",
        "按标记整体替换，保证记忆块的大小只和检索结果有关，和对话跑了多久无关。",
        "agent-memory-without-vector-db",
        "检索、淘汰与注入策略的完整实现见"
        "[《Agent 记忆：不接向量库也能长期记忆》](/article/agent-memory-without-vector-db/)。",
    ),
    (
        "agent-loop-two-hundred-lines",
        "**压缩是同步的。** 它会在工具结果回填之后、下一轮请求之前阻塞执行。"
        "摘要本身就是一次模型请求，所以压缩那一轮的实际延迟会多一次模型往返。",
        "agent-context-keep-or-drop",
        "预算怎么分层、摘要该保留什么，见"
        "[《Agent 上下文：留什么，丢什么》](/article/agent-context-keep-or-drop/)。",
    ),
    (
        "agent-loop-two-hundred-lines",
        "串行执行会让总延迟等于各工具延迟之和，所以 NanoHermes 在工具调用多于一个时并发执行。",
        "agent-concurrency-without-async",
        "并行之后要处理的顺序、共享状态与中断，见"
        "[《Agent 并发：不用 async 运行时怎么并行》](/article/agent-concurrency-without-async/)。",
    ),

    # ── 02 上下文：预算 ← 工具上限 / token 换算 / 注入入口 ─────────
    (
        "agent-context-keep-or-drop",
        "**第一，压缩太晚。** 如果只在 120,000 字符时才处理，"
        "模型已经为前面那些巨型结果付过很多轮输入费了。",
        "agent-tool-design-output-budgets",
        "每个工具各自的输出上限见"
        "[《Agent 工具设计：为什么输出都要有上限》](/article/agent-tool-design-output-budgets/)。",
    ),
    (
        "agent-context-keep-or-drop",
        "精确的上下文管理应该按 token 算。每个模型有自己的 tokenizer，"
        "同样的文本在不同模型上 token 数不同。",
        "agent-token-economics",
        "字符、字节与美元之间的换算账见"
        "[《Token 经济学：同一任务十倍的差价》](/article/agent-token-economics/)。",
    ),
    (
        "agent-context-keep-or-drop",
        "`AGENTS.md` 不是只读工作区根目录的那一个。"
        "NanoHermes 会从全局配置目录开始，沿着文件系统根到工作区，逐层收集。",
        "agent-prompt-injection-boundary",
        "这条拼接链同时也是提示注入的入口，见"
        "[《Agent 提示注入：谁说的话算指令》](/article/agent-prompt-injection-boundary/)。",
    ),

    # ── 03 记忆：同一份历史的两种取舍 / 单测之外 ──────────────────
    (
        "agent-memory-without-vector-db",
        "同一份历史，两个消费者，两种取舍。",
        "agent-context-keep-or-drop",
        "压缩侧怎么切、怎么摘要，见"
        "[《Agent 上下文：留什么，丢什么》](/article/agent-context-keep-or-drop/)。",
    ),
    (
        "agent-memory-without-vector-db",
        "这四条都不是「写不出测试」，而是「没人想到会坏」。"
        "对一个低频、静默、跨会话的模块来说，这恰恰是最该补的四类测试。",
        "agent-evaluation-not-a-benchmark",
        "单测之外的端到端抽样与重复跑法，见"
        "[《Agent 评测：只跑一次的测试不算数》](/article/agent-evaluation-not-a-benchmark/)。",
    ),

    # ── 04 工具：上限的两种下游 / 审批 / 后台任务 ─────────────────
    (
        "agent-tool-design-output-budgets",
        "这不是需要立刻修的 bug——20,000 字节对绝大多数场景够用。"
        "但它是一个**必须写进文档的不一致**，"
        "因为任何基于「max_output 是字符数」的容量估算都会错。",
        "agent-token-economics",
        "这个字节口径如何放大整张账单，见"
        "[《Token 经济学：同一任务十倍的差价》](/article/agent-token-economics/)。",
    ),
    (
        "agent-tool-design-output-budgets",
        "工具的能力和危险程度不成正比。`read_file` 再怎么写也不会毁掉代码；"
        "`run_command` 一条 `rm -rf` 就够了。所以工具还要按危险程度分级管控。",
        "agent-security-run-commands-safely",
        "分级管控的五道闸门见"
        "[《Agent 安全：让它跑命令而不失控》](/article/agent-security-run-commands-safely/)。",
    ),
    (
        "agent-tool-design-output-budgets",
        "前台 `run_command` 的超时上限是 3600 秒，但即使在范围内，"
        "让模型干等一次 `cargo build` 也不划算："
        "这一轮的所有时间都花在等命令上，而模型其实可以去读代码、写文档，最后再回来收结果。",
        "agent-concurrency-without-async",
        "后台任务与前台并发之间怎么划边界，见"
        "[《Agent 并发：不用 async 运行时怎么并行》](/article/agent-concurrency-without-async/)。",
    ),

    # ── 05 并发：子代理归多体 / duration 归观测 ───────────────────
    (
        "agent-concurrency-without-async",
        "工具调用并行是「同一批里各干各的」，子代理是「同一个任务分给几个人」。"
        "两者的区别在于子代理内部还会再发起模型请求和工具调用。",
        "agent-multiagent-subagents-board-and-gate",
        "子代理的配置、工具裁剪与限流门见"
        "[《Agent 多体：子代理、任务板与限流》]"
        "(/article/agent-multiagent-subagents-board-and-gate/)。",
    ),
    (
        "agent-concurrency-without-async",
        "**第二，`duration` 把排队时间算进去了。** "
        "`Job` 里的 `started: Instant` 在 `start()` 时记录，"
        "`finish()` 里用 `job.started.elapsed()` 算时长。",
        "agent-observability-turn-ledger",
        "账本为什么要把排队和执行分开记，见"
        "[《Agent 观测：给每个轮次记一本账》](/article/agent-observability-turn-ledger/)。",
    ),

    # ── 06 多体：权限来自父代理 / 时间口径归观测 ───────────────────
    (
        "agent-multiagent-subagents-board-and-gate",
        "这一点比「给子代理独立的权限配置」要安全得多，"
        "因为它保证了子代理不可能比父代理更能干。",
        "agent-security-run-commands-safely",
        "父代理的五道闸门具体挡了什么，见"
        "[《Agent 安全：让它跑命令而不失控》](/article/agent-security-run-commands-safely/)。",
    ),
    (
        "agent-multiagent-subagents-board-and-gate",
        "对观测来说，这个口径是错的。用户看到 `agent-7 [done] reviewer (12.3s)`，"
        "想知道的是「审查花了 12.3 秒」，"
        "实际含义是「从父代理决定派发到审查结束一共 12.3 秒」，其中可能有 8 秒在排队。",
        "agent-observability-turn-ledger",
        "这类口径问题在账本上会怎么表现，见"
        "[《Agent 观测：给每个轮次记一本账》](/article/agent-observability-turn-ledger/)。",
    ),

    # ── 07 安全：封禁入口不等于封禁能力 / 钩子是新的注入面 ─────────
    (
        "agent-security-run-commands-safely",
        "工具是能力的载体，封禁工具名只是在封禁「入口」，不是封禁「能力」。",
        "agent-tool-design-output-budgets",
        "工具清单与输出预算的设计见"
        "[《Agent 工具设计：为什么输出都要有上限》](/article/agent-tool-design-output-budgets/)。",
    ),
    (
        "agent-security-run-commands-safely",
        "**第二，钩子没有沙箱。** `hooks::run` 里对 `shell_command` 只设了 "
        "`current_dir`、`NANOHERMES_TOOL_NAME` 和 `NANOHERMES_HOOK_EVENT` "
        "两个环境变量、以及三根管道，**没有调用 `sandbox::attach`**。",
        "agent-prompt-injection-boundary",
        "钩子同时也是新的注入面，见"
        "[《Agent 提示注入：谁说的话算指令》](/article/agent-prompt-injection-boundary/)。",
    ),

    # ── 08 注入：权限位置 / 记忆块的身份 ──────────────────────────
    (
        "agent-prompt-injection-boundary",
        "把仓库里的文件当成「项目约定」注入 system，"
        "等于把不可信输入放进了最高权限通道。",
        "agent-security-run-commands-safely",
        "执行层的闸门能兜住什么、兜不住什么，见"
        "[《Agent 安全：让它跑命令而不失控》](/article/agent-security-run-commands-safely/)。",
    ),
    (
        "agent-prompt-injection-boundary",
        "第三类输入是最容易被忽略的，因为它跨会话。",
        "agent-memory-without-vector-db",
        "记忆怎么检索、怎么淘汰、为什么按块整体替换，见"
        "[《Agent 记忆：不接向量库也能长期记忆》](/article/agent-memory-without-vector-db/)。",
    ),

    # ── 09 观测：漏掉的 token / 纯文本历史 / mock 升级成评测 ────────
    (
        "agent-observability-turn-ledger",
        "这不是作者疏忽——每个零件单看都够用，问题出在它们没有被同一个数据模型串起来。",
        "agent-token-economics",
        "这些没进账的 token 究竟花在哪，见"
        "[《Token 经济学：同一任务十倍的差价》](/article/agent-token-economics/)。",
    ),
    (
        "agent-observability-turn-ledger",
        "**唯一跨进程存活的是对话历史，而它是一个纯文本结构**。",
        "agent-loop-two-hundred-lines",
        "这份纯文本历史是怎么落盘的，见"
        "[《Agent 的本质：一个两百行的循环》](/article/agent-loop-two-hundred-lines/)。",
    ),
    (
        "agent-observability-turn-ledger",
        "顺带说一句：这三条都不需要真实 API。"
        "用一个返回固定 JSON 的本地模拟端点就行，"
        "`agent/tests/e2e_mock_llm.rs` 已经有这个基础设施了，加几个账本断言是顺手的事。",
        "agent-evaluation-not-a-benchmark",
        "这套 mock 怎么升级成可重复的评测，见"
        "[《Agent 评测：只跑一次的测试不算数》](/article/agent-evaluation-not-a-benchmark/)。",
    ),

    # ── 10 成本：压缩归上下文 / 轮次归循环 / 子代理归多体 ───────────
    (
        "agent-token-economics",
        "**压缩省下的全是历史，不是前缀**。",
        "agent-context-keep-or-drop",
        "压缩的触发条件与保留策略见"
        "[《Agent 上下文：留什么，丢什么》](/article/agent-context-keep-or-drop/)。",
    ),
    (
        "agent-token-economics",
        "最坏情况：40 轮 × 每轮 8 个工具结果 × 每个 20,000 字节。"
        "理论上的上下文是 6.4 MB——当然到不了，因为 120,000 字节就触发压缩了。",
        "agent-loop-two-hundred-lines",
        "40 这个数字在循环里到底数的是什么，见"
        "[《Agent 的本质：一个两百行的循环》](/article/agent-loop-two-hundred-lines/)。",
    ),
    (
        "agent-token-economics",
        "把子代理拆开算。每个子代理自带一份 system prompt"
        "（继承父配置的模型、工具、系统提示），所以它的 `S` 和主代理接近；"
        "但它没有父代理的历史，它的 `H_t` 从零开始。",
        "agent-multiagent-subagents-board-and-gate",
        "一次委派会同时启动几个子代理、它们在哪儿排队，见"
        "[《Agent 多体：子代理、任务板与限流》]"
        "(/article/agent-multiagent-subagents-board-and-gate/)。",
    ),

    # ── 11 评测：成本指标归成本文 / 线上观测归账本 ─────────────────
    (
        "agent-evaluation-not-a-benchmark",
        "上一篇把成本拆成「前缀 × 历史 × 轮数」。这三个量都应该进评测报表。",
        "agent-token-economics",
        "这三个量各自怎么算，见"
        "[《Token 经济学：同一任务十倍的差价》](/article/agent-token-economics/)。",
    ),
    (
        "agent-evaluation-not-a-benchmark",
        "这两件事经常被混为一谈，但它们的样本、口径、时效完全不同。",
        "agent-observability-turn-ledger",
        "线上观测的数据怎么落成账本，见"
        "[《Agent 观测：给每个轮次记一本账》](/article/agent-observability-turn-ledger/)。",
    ),
]


class Command(BaseCommand):
    help = "给 Agent 系列正文补上下文内链（默认预演，--apply 才写入）"

    def add_arguments(self, parser):
        parser.add_argument(
            "--apply",
            action="store_true",
            help="真正写入；缺省只打印将要插入的句子",
        )
        parser.add_argument(
            "--slug",
            help="只处理某一篇源文章（调试用）",
        )

    def handle(self, *args, **options):
        apply_changes = options["apply"]
        only_slug = options.get("slug")
        prefix = "" if apply_changes else "[dry-run] "

        # 内容修订不是新发布：临时断开订阅通知，避免把 11 篇老文章当成新文章群发。
        post_save.disconnect(notify_subscribers_on_publish, sender=Article)
        inserted = 0
        skipped = []
        articles = {}
        try:
            for source, anchor, target, note in LINKS:
                if only_slug and source != only_slug:
                    continue
                if source not in articles:
                    articles[source] = Article.objects.filter(slug=source).first()
                article = articles[source]
                if article is None:
                    skipped.append((source, target, "源文章不存在"))
                    continue

                new_sentence = f"{anchor}{note}"
                if new_sentence in article.content:
                    skipped.append((source, target, "已存在，跳过"))
                    continue

                occurrences = article.content.count(anchor)
                if occurrences == 0:
                    skipped.append((source, target, "锚点未命中（正文被改过）"))
                    continue
                if occurrences > 1:
                    skipped.append((source, target, f"锚点出现 {occurrences} 次，无法确定位置"))
                    continue

                article.content = article.content.replace(anchor, new_sentence, 1)
                inserted += 1
                self.stdout.write(f"{prefix}{source} → {target}")
                self.stdout.write(f"    + {note}")

                if apply_changes:
                    article.save()

            if apply_changes and inserted:
                self.stdout.write(self.style.SUCCESS(f"写入 {inserted} 条内链。"))

            if skipped:
                self.stdout.write("")
                self.stdout.write("跳过：")
                for source, target, reason in skipped:
                    self.stdout.write(f"  - {source} → {target}: {reason}")

            self.stdout.write("")
            self.stdout.write(
                f"{prefix}共 {len(LINKS)} 条映射，"
                f"{'写入' if apply_changes else '可写入'} {inserted} 条，跳过 {len(skipped)} 条。"
            )
        finally:
            post_save.connect(notify_subscribers_on_publish, sender=Article)
