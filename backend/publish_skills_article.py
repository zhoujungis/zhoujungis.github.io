"""
Run this script on PythonAnywhere to publish the article.
Usage: python manage.py shell < publish_skills_article.py
"""
import sys
from articles.models import Article, Category, Tag

TITLE = '如何利用Skills提高效率'
SLUG = 'how-to-use-skills-to-improve-efficiency'
CONTENT = '''## 什么是 Skills？

Skills（技能）是 Claude Code 提供的一套可复用的专业化工作流模块。每个 Skill 封装了一套经过验证的最佳实践——从需求分析、架构设计到代码实现、测试验证——帮助开发者在不同场景下快速进入高效工作状态。

简单来说，Skills 就像是存储在 Claude Code 中的"专家工作手册"。当你说"帮我开发一个新功能"时，Skills 会引导整个流程：先触发头脑风暴分析需求，再制定实现计划，最后逐步执行并验证结果。

## Skills 如何提升效率？

### 1. 消除决策疲劳

日常开发中最耗时的不一定是写代码本身，而是反复思考"该怎么做"。Skills 将常见任务的处理流程标准化，你不再需要每次从零开始决定工作方式。

例如，当你说"修复这个 bug"时，`systematic-debugging` 技能会自动启动：

- 收集上下文和错误信息
- 系统性定位根因（而非盲目尝试）
- 验证修复方案的完整性
- 确保不会引入新问题

### 2. 强制"先思后行"

许多开发问题的根源在于**急于动手**。Skills 强制执行"先规划，再执行"的纪律：

- `brainstorming` 技能确保在写代码前充分探索方案空间
- `writing-plans` 技能将模糊需求转化为可执行的步骤清单
- `executing-plans` 技能按计划推进，避免遗漏和偏离

这种纪律尤其适合复杂功能开发——在纸上多花 10 分钟，可能节省数小时的返工。

### 3. 多维度质量保障

Skills 覆盖了软件开发的完整生命周期：

| 阶段 | 相关 Skills | 作用 |
|------|------------|------|
| 需求分析 | `brainstorming` | 梳理需求，探索多种方案 |
| 架构设计 | `system-design` | 设计系统架构和技术选型 |
| 代码实现 | `subagent-driven-development` | 并行执行多个子任务 |
| 代码审查 | `code-review`, `requesting-code-review` | 发现潜在缺陷和优化空间 |
| 测试 | `test-driven-development`, `test-writer` | 保证代码质量 |
| 验证 | `verification-before-completion` | 提交前最终确认 |
| 发布 | `release-notes` | 自动生成发布说明 |

### 4. 并行处理能力

`dispatching-parallel-agents` 和 `subagent-driven-development` 让 Claude Code 能够**并行处理多个独立任务**——这在传统开发中是难以做到的。

例如，同时进行代码审查的多个维度检查（正确性、安全、性能），或同时搜索多个代码库路径来定位问题，大幅缩短了等待时间。

## 实践中如何最大化效率

### 技巧一：信任流程，不要跳过

最大的效率陷阱是"这个太简单，不需要 Skill"。经验表明，简单任务常常是复杂问题的入口。Skills 的设计就是为了防止这种判断失误——宁可多一步流程，也不要少一步保障。

### 技巧二：善用 Git Worktree 隔离

`using-git-worktrees` 技能让每项任务在独立的工作目录中进行，互不干扰。这在同时处理多个功能或修复时尤其有用。

### 技巧三：让 Skills 互相配合

Skills 不是孤立的——它们可以串联使用：

> 头脑风暴 → 编写计划 → 子代理并行开发 → 代码审查 → 验证 → Git 工作流完成

这种全流程自动化是效率提升的核心。

### 技巧四：自定义你的工作流

通过 `writing-skills` 技能，你可以将团队特有的开发规范和流程封装成自定义 Skill，让 Claude Code 完全适配你的工作方式。

## 实际案例

假设你要给博客系统添加全文搜索功能。传统流程可能是：

1. 考虑如何实现（30分钟）
2. 开始写代码（2小时）
3. 发现遗漏边界情况（30分钟）
4. 调试和修复（1小时）
5. 手动测试（30分钟）

总计约 **4.5 小时**。

使用 Skills 后的流程：

1. `brainstorming` — 探索搜索方案（Elasticsearch vs 数据库全文索引 vs 前端搜索）（10分钟）
2. `writing-plans` — 将选定方案拆解为具体任务（5分钟）
3. `subagent-driven-development` — 并行实现各模块（1小时）
4. `test-writer` — 自动生成测试用例（15分钟）
5. `code-review` — 发现潜在问题（10分钟）
6. `verification-before-completion` — 最终验证（5分钟）

总计约 **1.5 小时**，且质量更高、边界情况覆盖更全面。

## 总结

Skills 的核心价值不在于"自动化写代码"，而在于**将软件工程的最佳实践内建到工作流程中**。它让你在保持高度灵活性的同时，不丢失纪律性和质量保障。

高效的程序员不是写得快，而是**做对的事，一次做对**。Skills 就是帮助你做到这一点的工具。'''

# 1. Create category
cat, created = Category.objects.get_or_create(
    name='效率工具',
    defaults={'slug': 'productivity-tools'}
)
print(f'Category: {"CREATED" if created else "EXISTS"} id={cat.id} {cat.name}')

# 2. Create tags
tags_info = [
    ('Claude Code', 'claude-code'),
    ('Skills', 'skills'),
    ('开发效率', 'dev-efficiency'),
    ('AI编程', 'ai-coding'),
]
tag_objs = []
for name, slug in tags_info:
    t, created = Tag.objects.get_or_create(name=name, defaults={'slug': slug})
    tag_objs.append(t)
    print(f'Tag: {"CREATED" if created else "EXISTS"} id={t.id} {t.name}')

# 3. Create article (or update if slug already exists)
article, created = Article.objects.update_or_create(
    slug=SLUG,
    defaults={
        'title': TITLE,
        'content': CONTENT,
        'category': cat,
        'status': 'published',
        'is_top': False,
    }
)
article.tags.set(tag_objs)
article.save()  # re-render markdown

print(f'Article: {"CREATED" if created else "UPDATED"} id={article.id}')
print(f'  Title: {article.title}')
print(f'  Slug: {article.slug}')
print(f'  Status: {article.status}')
print(f'  Category: {article.category.name}')
print(f'  Tags: {[t.name for t in article.tags.all()]}')
print(f'  Excerpt: {article.excerpt[:80]}...')
print()
print('DONE! Reload the web app on PythonAnywhere to see the changes.')
