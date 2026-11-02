"""把每篇文章里的一部分 H2 改成用户会搜的问句。

只改标题行，不动正文、不改 slug、不改链接。默认预演，`--apply` 才写库。

为什么不是「全部 H2 都改成问句」：
- 篇均 10–20 个 H2，全改会让文章变成 FAQ，读起来支离破碎；
- 每篇保留 2–3 个问句 H2 已经足够覆盖搜索意图，其余保持叙述性标题。

改写来源分三层，优先级从高到低：
1. HEAD_MAP 里逐篇指定的精确替换（标题措辞需要结合上下文的那几篇）；
2. 通用规则：复杂度 / 常见坑 / 边界情况 / FAQ / Checklist / 参考资料等；
3. 已经是问句、只是缺问号的标题，补一个「？」。
每篇的问句 H2 总数最多 3 个（含文章原有的问句），避免把一篇长文写成问答列表；
重复运行时不会继续追加，保持幂等。
"""
import re

from django.core.management.base import BaseCommand
from django.db.models.signals import post_save

from articles.models import Article
from articles.signals import notify_subscribers_on_publish

MAX_CHANGES_PER_ARTICLE = 3

# 每篇最多改 3 个，所以这里列出的条目一般不超过 3 条。
# 键是 slug，值是 [(旧标题, 新标题)]，旧标题必须与库里的 `## ` 行完全一致。
HEAD_MAP = {
    "2026-chinese-ai-models-comparison": [
        ("2026 国产大模型版图总览", "2026 年国产大模型有哪些？"),
        ("场景化选型决策树", "不同场景该选哪个国产大模型？"),
    ],
    "agent-network-octo": [
        ("三个核心概念：Agent 需要一个真正的工位", "Agent 网络需要哪三个核心概念？"),
        ("六种协作模式：多 Agent 协作，不只是拉个群", "多 Agent 有哪六种协作模式？"),
    ],
    "chinese-llm-august-2026-releases-preview": [
        ("一、焦点之役：DeepSeek V4-Pro 正式版", "DeepSeek V4-Pro 正式版有什么值得关注？"),
        ("七、算力底座：国产芯片的量产接力", "国产芯片产能跟上了吗？"),
    ],
    "google-matter-smart-home-dev-guide": [
        ("一、Matter 协议简介", "Matter 协议是什么？"),
        ("三、开发环境搭建", "Matter 开发环境怎么搭建？"),
        ("四、Matter 数据模型详解", "Matter 数据模型包含哪些部分？"),
    ],
    "halo-music-square-architecture": [
        ("五、D1 数据模型与“本地优先”同步", "D1 数据库怎么做本地优先同步？"),
        ("六、账号安全和 Electron 安全边界", "Electron 应用怎么保证账号安全？"),
    ],
    "how-to-choose-ai-coding-tools": [
        ("主流 AI 编程工具全景图", "主流 AI 编程工具有哪些？"),
        ("五大维度深度对比", "选 AI 编程工具要看哪五个维度？"),
        ("选型决策树", "不同场景该选哪个 AI 编程工具？"),
    ],
    "ibgda-domestic-gpu-rdma-demo-waic2026": [
        ("二、国产算力的核心困境：\"单点强、系统弱\"", "国产算力为什么\"单点强、系统弱\"？"),
        ("三、IBGDA DEMO：国产 GPU 与 RDMA 网卡的深度协同", "国产 GPU 怎么和 RDMA 网卡协同？"),
    ],
    "iot-future-next-decade": [
        ("一、全球 IoT 市场全景", "全球 IoT 市场有多大？"),
        ("二、核心技术演进：四大引擎", "IoT 有哪四大技术引擎？"),
        ("五、2026–2030 五大趋势预测", "2026–2030 年 IoT 有哪五大趋势？"),
    ],
    "welcome": [
        ("代码世界的黑白分明", "代码世界为什么黑白分明？"),
        ("初入职场", "初入职场是什么体验？"),
    ],
    "blog-tech-stack": [
        ("前端技术栈详解", "前端用了哪些技术？"),
        ("后端技术栈详解", "后端用了哪些技术？"),
    ],
    "django-bleach-xss-defense": [
        ("03 第二层：bleach 白名单消毒", "bleach 白名单怎么防住 XSS？"),
        ("04 真实漏洞 ①：`data:` 协议绕过", "`data:` 协议怎么绕过过滤？"),
    ],
    "django-comment-system-guide": [
        ("2. 模型：自关联 + 审核开关", "评论模型为什么要自关联？"),
        ("3. 读接口：只给已审核，草稿一篇不漏", "评论读接口怎么做到不漏草稿？"),
    ],
    "django-jwt-dual-token-auth": [
        ("2. JWT 原理：三段式，5 分钟看懂", "JWT 的三段式结构是什么？"),
        ("3. 后端：SimpleJWT 三处配置", "SimpleJWT 需要配置哪三处？"),
    ],
    "django-transaction-atomic-on-commit": [
        ("1. 先看清你站上的事务边界", "Django 的事务边界在哪里？"),
        ("6. `transaction.on_commit` 的完整用法与三个坑", "`transaction.on_commit` 怎么用？"),
    ],
    "drf-pagination-cache-throttle": [
        ("2. 分页篇：不只是“能翻页”", "DRF 分页要注意什么？"),
        ("3. 缓存篇：PA 无 Redis 也能快 10 倍", "没有 Redis 怎么做缓存？"),
    ],
    "mq-reliable-delivery-deep-dive": [
        ("2. 生产端：发送确认与本地消息表", "生产端怎么保证消息不丢？"),
        ("3. Broker 端：持久化、刷盘与副本", "Broker 怎么保证消息持久化？"),
    ],
    "structured-logging-tracing-deep-dive": [
        ("2. JSON 比文本贵 40%，不是数量级", "JSON 日志比文本贵多少？"),
        ("3. 真正贵的不是 JSON，是时间戳", "日志开销为什么主要来自时间戳？"),
    ],
    "test-manage-system-vue-django": [
        ("二、技术栈一览", "这个系统用了哪些技术？"),
        ("五、数据库设计 —— 一张图看清表关系", "数据库表关系是怎样的？"),
    ],
    "aidevops-terminal-client": [
        ("一、它在解决什么问题：研发数据的孤岛", "研发数据孤岛问题怎么解决？"),
        ("三、数据是怎么进来的：双游标同步与幂等摄取", "研发数据是怎么同步进来的？"),
        ("六、风险引擎：10 个信号，逐条可解释", "风险引擎的 10 个信号是什么？"),
    ],
    "btree-page-split": [
        ("先看案发现场：一页到底长什么样", "B+ 树的一页到底长什么样？"),
        ("什么时候值得动手术：重组阈值与「50% 填充」的真相", "什么时候该重组索引页？"),
        ("分裂点怎么选：中点、方向与启发式", "页分裂点怎么选？"),
    ],
    "nanohermes-rust-coding-agent": [
        ("三条设计纲领", "NanoHermes 有哪三条设计纲领？"),
        ("仓库结构：一个 workspace，两个 crate", "NanoHermes 的仓库结构是怎样的？"),
        ("技术栈、依赖清单与 release profile", "NanoHermes 用了哪些技术栈？"),
    ],
    "nanobrowser-tauri-webview2": [
        ("三个反常识的技术决定", "NanoBrowser 有哪三个反常识的技术决定？"),
        ("仓库结构：一个 workspace，两个二进制", "NanoBrowser 的仓库结构是怎样的？"),
        ("安全模型：五道防线", "NanoBrowser 的安全模型有哪五道防线？"),
    ],
    "ai-token-coding-plan-comparison-2026": [
        ("二、国内平台全对比", "国内 Token Plan 有哪些平台？"),
        ("四、全景价格对比表", "各平台价格差多少？"),
        ("九、选型决策树", "不同需求该选哪个 Token Plan？"),
    ],
    "cloud-deployment-guide-cn-vs-global": [
        ("一、国内云：卷出天际的价格战", "国内云现在便宜吗？"),
        ("六、案例：本站的部署架构", "本站的部署架构是怎样的？"),
        ("七、最后的避坑清单", "部署选型有哪些坑？"),
    ],
}

QWORDS = re.compile(r"为什么|怎么|如何|什么|哪些|哪个|哪种|哪一|是否|能不能|要不要|多少|多久|区别|吗")
PREFIX = re.compile(r"^(?:[一二三四五六七八九十]+、|[0-9]+\.\s*|[0-9]{2}\s+|第[一二三四五六七八九十]+步：)")
SKIP_HEAD = re.compile(r"^(前言|引言|写在最后|结语|参考|总结|小结)")


def split_prefix(heading):
    m = PREFIX.match(heading)
    if not m:
        return "", heading
    return m.group(0), heading[m.end():]


def rule_rewrite(heading, category):
    """通用模板：只匹配语义明确的标题，避免误改。"""
    number, text = split_prefix(heading)
    if re.search(r"复杂度(分析|对比|对照)?$", text):
        if "对比" in text or "对照" in text:
            return number + "两种解法的复杂度差多少？"
        return number + "时间复杂度是多少？"
    if "常见坑" in text:
        if category == "leetcode":
            return number + "这道题有哪些常见坑？"
        return number + "有哪些常见坑？"
    if "边界情况" in text:
        return number + "边界情况有哪些？"
    if "Java 版" in text:
        return number + "Java 代码怎么写？"
    if "完整推演表" in text:
        return number + "完整推演过程是怎样的？"
    if "同族题" in text:
        return number + "还有哪些同族题？"
    if text in ("题目", "题目与语义"):
        return number + "题目要求是什么？"
    if "Checklist" in text or "检查清单" in text:
        return number + "上线前要检查什么？"
    if "FAQ" in text or "常见问题" in text:
        return number + "常见问题有哪些？"
    if "准备工作" in text:
        return number + "开始前要准备什么？"
    if text == "部署架构":
        return number + "部署架构是怎样的？"
    return None


def add_question_mark(heading):
    """已经是问句、只在句尾缺问号的标题，补一个「？」。

    问句词只出现在冒号前的短语里（「怎么测账本：三条不变量」）时不动：
    把问号插在句中会让标题不再以问句结尾，反而更不像搜索问句，
    这类标题留给 HEAD_MAP 逐篇改写。
    """
    if heading.endswith("？") or heading.endswith("?"):
        return heading
    if SKIP_HEAD.match(heading) or not QWORDS.search(heading):
        return heading
    if "：" in heading:
        before, after = heading.split("：", 1)
        if QWORDS.search(before) and not QWORDS.search(after):
            return heading
    return heading + "？"


def rewrite_content(content, slug, category="-"):
    """返回 (新正文, [(旧标题, 新标题)], 未命中的 HEAD_MAP 旧标题)。"""
    lines = content.splitlines(keepends=True)
    mapping = dict(HEAD_MAP.get(slug, []))
    applied, missed = [], []

    # 只在代码块之外处理标题，避免把代码注释里的 `## ` 当成标题。
    in_fence = False
    headings = []
    for index, line in enumerate(lines):
        if line.strip().startswith("```"):
            in_fence = not in_fence
            continue
        if not in_fence and line.startswith("## "):
            headings.append((index, line[3:].strip()))

    # 已经是问句的标题也计入上限，否则重复运行会继续把叙述性标题改成问句，
    # 既不是幂等的，也会突破「每篇只有一部分 H2 是问句」的约束。
    existing_questions = sum(
        1 for _, heading in headings if heading.endswith("？") or heading.endswith("?")
    )

    # 1) 精确映射
    for old, new in HEAD_MAP.get(slug, []):
        hit = False
        for index, heading in headings:
            if heading == old:
                lines[index] = f"## {new}\n"
                applied.append((old, new))
                hit = True
                break
        if not hit:
            missed.append(old)

    used = {old for old, _ in applied}
    changed_count = len(applied)
    budget = max(0, MAX_CHANGES_PER_ARTICLE - existing_questions)

    # 2) 通用规则（命中后重新读取标题，避免同一行被改两次）
    if changed_count < budget:
        for index, heading in headings:
            if changed_count >= budget:
                break
            if heading in used:
                continue
            new = rule_rewrite(heading, category)
            if not new or new == heading:
                continue
            lines[index] = f"## {new}\n"
            applied.append((heading, new))
            used.add(heading)
            changed_count += 1

    # 3) 补问号
    if changed_count < budget:
        for index, heading in headings:
            if changed_count >= budget:
                break
            if heading in used:
                continue
            new = add_question_mark(heading)
            if new == heading:
                continue
            lines[index] = f"## {new}\n"
            applied.append((heading, new))
            used.add(heading)
            changed_count += 1

    return "".join(lines), applied, missed


class Command(BaseCommand):
    help = "把每篇文章里 2–3 个 H2 改成搜索问句（默认预演，--apply 才写入）"

    def add_arguments(self, parser):
        parser.add_argument("--apply", action="store_true", help="真正写入；缺省只打印对照")

    def handle(self, *args, **options):
        apply_changes = options["apply"]
        prefix = "" if apply_changes else "[dry-run] "
        changed_articles = 0
        total_headings = 0
        missed_all = []

        for article in Article.objects.select_related("category").all():
            category = article.category.slug if article.category else "-"
            new_content, applied, missed = rewrite_content(
                article.content, article.slug, category
            )
            if missed:
                missed_all.append((article.slug, missed))
            if not applied:
                continue

            changed_articles += 1
            total_headings += len(applied)
            self.stdout.write(f"{prefix}{article.slug}")
            for old, new in applied:
                self.stdout.write(f"    - {old}")
                self.stdout.write(f"    + {new}")

            if apply_changes:
                article.content = new_content
                # 保存前断开新文章通知：改标题不该给订阅者群发邮件。
                post_save.disconnect(notify_subscribers_on_publish, sender=Article)
                try:
                    article.save()
                finally:
                    post_save.connect(notify_subscribers_on_publish, sender=Article)

        self.stdout.write(
            f"\n{prefix}文章 {changed_articles} 篇，改写 H2 {total_headings} 个"
        )
        if missed_all:
            self.stdout.write(self.style.WARNING("\n以下 HEAD_MAP 旧标题未命中："))
            for slug, missed in missed_all:
                for old in missed:
                    self.stdout.write(self.style.WARNING(f"  {slug} :: {old}"))
        if not apply_changes:
            self.stdout.write("预演结束；确认无误后加 --apply 写入。")
