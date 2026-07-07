#!/usr/bin/env python
"""
Standalone script — run directly:
  source venv/bin/activate && python publish_ai_coding_article.py
"""
import os, sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_api.settings')
import django
django.setup()

from articles.models import Article, Category, Tag
from datetime import datetime, timezone, timedelta

CONTENT = """## 引言：AI 编程工具的"百家争鸣"

2024 年以来，AI 编程工具进入了爆发期。从 GitHub Copilot 的一家独大，到如今 Claude Code、Cursor、Windsurf、Aider 等工具百花齐放——开发者面临的已经不是"用不用 AI"，而是"**选哪个 AI**"。

这篇文章将从实际开发体验出发，帮你找到最适合自己的 AI 编程搭档。

![AI Coding Tools Landscape](https://miro.medium.com/v2/resize:fit:1400/1*AI-coding-tools-comparison-2024.png)

---

## 主流 AI 编程工具全景图

### 第一梯队：全能型选手

| 工具 | 形态 | 核心优势 | 适合人群 | 价格 |
|------|------|----------|----------|------|
| **Claude Code** | CLI 终端 | Skills 工作流、深度理解大型代码库、子代理并行 | 全栈开发者、复杂项目 | Pro $18/月 |
| **Cursor** | IDE 编辑器 | 原生 AI 集成、Tab 补全、Composer 模式 | 习惯 GUI 的开发者 | Pro $20/月 |
| **GitHub Copilot** | IDE 插件 | 生态最成熟、插件覆盖广、Copilot Workspace | VS Code / JetBrains 用户 | $10/月 |

### 第二梯队：专项型选手

| 工具 | 核心优势 | 适合人群 |
|------|----------|----------|
| **Windsurf** | Cascade 自动上下文分析，一体化 AI IDE | 偏好原生 AI IDE 的团队 |
| **Aider** | 开源、本地模型支持、Git 原生集成 | 隐私敏感 / 开源爱好者 |
| **Cline** | MCP 协议、多模型灵活切换 | 工具体系需要高度定制的开发者 |

### 第三梯队：轻量级选手

| 工具 | 形态 | 适合场景 |
|------|------|----------|
| **ChatGPT Canvas** | Web | 快速原型、代码片段问答 |
| **v0 / bolt.new** | Web | 前端页面快速搭建、UI 生成 |
| **Replit Agent** | Web | 在线全栈开发、编程教学场景 |

---

## 五大维度深度对比

### 1. 代码理解能力

这是 AI 编程工具最核心的能力——它能否真正理解你的项目，而不仅仅是补全代码。

```
理解深度排名（基于实际使用体验）：

Claude Code  ★★★★★
  200K token 上下文，能一次性消化整个中小型项目
  Skills 机制让它在特定场景下有更深层的理解力

Cursor       ★★★★☆
  .cursorrules 提供项目级上下文，理解力不错
  但上下文窗口在复杂项目中仍有局限

Aider        ★★★★☆
  通过 map-reduce 架构处理大型代码库
  需要搭配能力较强的模型才能发挥最佳效果

Copilot      ★★★☆☆
  主要依赖当前文件和相邻 Tab 的内容
  跨文件理解是明显的短板
```

### 2. 工作流集成能力

AI 工具不应该只是一个"聊天窗口"——它需要深度融入开发流程。

| 能力 | Claude Code | Cursor | Copilot | Windsurf |
|------|:---:|:---:|:---:|:---:|
| **终端原生支持** | ✅ 原生终端 | ⚠️ 内置终端 | ❌ 依赖外部 | ⚠️ 内置终端 |
| **Git 操作** | ✅ 自动 commit | ⚠️ 手动操作 | ⚠️ 手动操作 | ⚠️ 手动操作 |
| **子代理/并行执行** | ✅ Skills 机制 | ❌ 不支持 | ❌ 不支持 | ❌ 不支持 |
| **自动测试运行** | ✅ verify 机制 | ❌ 不支持 | ⚠️ Chat 中 | ❌ 不支持 |
| **图片/截图理解** | ✅ 原生支持 | ✅ 支持 | ❌ 不支持 | ⚠️ 部分支持 |
| **MCP 协议扩展** | ✅ 完整支持 | ⚠️ 有限 | ❌ 不支持 | ❌ 不支持 |

### 3. 模型灵活性

```
锁定单一模型的工具              可切换模型的工具
     │                                │
  Cursor       ────────────────  Claude Code（Claude 系列模型）
  Copilot      ────────────────  Cline（Anthropic / OpenAI / 本地）
  Windsurf     ────────────────  Aider（支持 20+ 模型）
     │                                │
  优点：开箱即用体验好            优点：不被供应商锁定
  缺点：模型升级被动              缺点：需要一定调参经验
```

**关键洞察：** Claude 系列模型目前在代码理解和生成方面处于领先地位，但不同模型在不同场景下有各自的优势。能自由切换模型的工具给了你更多选择权。

### 4. 学习曲线

```
新手友好度（柱状越短越容易上手）：

Copilot        ██░░░░░░░░  几乎零配置，安装即用
Cursor         ███░░░░░░░  熟悉 IDE 的开发者约 10 分钟上手
Windsurf       ███░░░░░░░  与 Cursor 类似的体验
Claude Code    █████░░░░░  需要适应终端操作 + 命令模式
Aider          ████████░░  需要理解架构 + 命令行思维
Cline          ███████░░░  需要配置 MCP + 选择合适的模型
```

### 5. 代码质量与安全性

这是企业选型最关心的问题：

| 维度 | Claude Code | Cursor | Copilot |
|------|:---:|:---:|:---:|
| **代码审查集成** | ✅ 内置 Code Review | ⚠️ 依赖第三方插件 | ⚠️ Copilot Review |
| **隐私保护** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **代码溯源能力** | ✅ 可追溯 | ❌ 不支持 | ❌ 不支持 |
| **许可证合规** | 清晰透明 | 需额外注意 | 需额外注意 |
| **自托管选项** | ❌ 暂不支持 | ❌ 暂不支持 | ⚠️ Enterprise 版 |

---

## 选型决策树

```
你的工作方式是什么样的？
│
├─ 「我在终端里工作，习惯命令行」
│   ├─ 需要深度代码理解和自动化 → Claude Code ✅
│   └─ 需要开源 + 本地模型        → Aider ✅
│
├─ 「我习惯 VS Code / JetBrains IDE」
│   ├─ 只需轻量补全，不想切换习惯    → Copilot ✅
│   ├─ 想要更智能的 AI 原生 IDE 体验 → Cursor ✅
│   └─ 需要高度可定制的 AI 工作流    → Cline ✅
│
├─ 「我主要做前端，需要快速出 UI」
│   ├─ 从零搭建项目 → v0 / bolt.new ✅
│   └─ 在现有项目中 → Cursor + Claude Code ✅
│
└─ 「我是 Tech Lead，要为团队选型」
    ├─ 代码安全第一              → Claude Code ✅
    ├─ 团队上手快最重要           → Copilot / Cursor ✅
    └─ 需要自定义团队工作流       → Claude Code + Skills ✅
```

---

## 我的实践：组合使用才是最优解

经过大量实践，我发现**没有单一工具能覆盖所有场景**。最佳策略是组合使用：

### 推荐组合：Claude Code + Cursor

```
╔═══════════════════════════════════════════════════════╗
║                    开发工作流                          ║
╠══════════════╦══════════════╦════════════════════════╣
║   Cursor     ║  Claude Code ║      两者配合           ║
║              ║              ║                        ║
║  • 日常编码  ║  • 架构设计  ║  • Cursor 负责写代码    ║
║  • Tab 补全  ║  • 代码审查  ║  • Claude 负责审代码    ║
║  • 快速重构  ║  • 复杂调试  ║  • 迭代中互相优化       ║
║  • 小修改    ║  • 多文件重构║  • 关键决策互相验证     ║
╚══════════════╩══════════════╩════════════════════════╝
```

### 具体场景速查表

| 场景 | 推荐工具 | 原因 |
|------|----------|------|
| 🐛 调试复杂 Bug | **Claude Code** | 系统化调试流程，子代理并行排查 |
| 🏗️ 新功能从零开发 | **Claude Code** | Skills 确保规划-实现-验证完整链路 |
| ✏️ 日常小修改 | **Cursor** | 快速、轻量、不打断思路 |
| 🔍 代码审查 | **Claude Code** | 多维度交叉验证，安全+正确性 |
| 🎨 UI / 前端页面 | **Cursor** | 可视化预览，即时反馈 |
| 📦 项目初始化 | **v0 / bolt** | 快速搭建脚手架 |
| 🔒 敏感项目 | **Aider + 本地模型** | 代码不出本地 |

---

## 避坑指南

### 1. 不要过度依赖自动补全

Tab 补全很爽，但每接受一段 AI 代码后，花 30 秒理解它做了什么。**你提交的每一行代码，最终责任都是你的。**

### 2. 上下文管理是门艺术

AI 的上下文窗口是有限的。好的做法是：
- 每次对话聚焦于一个任务
- 使用 `.cursorrules` / `CLAUDE.md` 提供项目级上下文
- 复杂任务拆分成小步骤逐个击破

### 3. 代码安全不可忽视

- 不要在 AI 对话中粘贴密钥、Token 或密码
- AI 生成的配置（如 CORS、权限设置）务必额外审查
- 使用 verification-before-completion 机制做最终确认

### 4. 保持批判性思维

AI 有时会"一本正经地胡说八道"。遇到以下情况要警惕：
- 生成了你没要求的功能代码
- 使用了过时的 API 或已废弃的库
- 代码能跑起来但隐藏安全隐患
- 测试覆盖了 happy path 却遗漏了边界情况

---

## 总结

选择 AI 编程工具，核心是回答三个问题：

> 1. **我的工作方式是什么？**（终端 vs IDE，独立开发 vs 团队协作）
> 2. **我的项目需求是什么？**（复杂度、规模、安全要求）
> 3. **我的学习投入意愿？**（开箱即用 vs 愿意定制）

没有完美的工具，但有最适合你的**组合**。

对于我个人而言，**Claude Code 做主将 + Cursor 做副手**的搭配，在当前阶段是最优解。前者负责深度思考和质量保障，后者负责日常编码的流畅体验。

AI 编程的赛道还在快速进化中，保持开放心态，持续尝试新工具，才是最好的策略。🚀"""

TITLE = "AI编程工具怎么选？2024-2025 主流工具全面对比与选型指南"
SLUG = "how-to-choose-ai-coding-tools"

# 1. Category
cat, cat_created = Category.objects.get_or_create(
    name="AI编程", defaults={"slug": "ai-coding"}
)
print(f"Category: {'CREATED' if cat_created else 'EXISTS'} id={cat.id} {cat.name}")

# 2. Tags
tags_info = [
    ("AI编程", "ai-coding"),
    ("Claude Code", "claude-code"),
    ("Cursor", "cursor"),
    ("GitHub Copilot", "github-copilot"),
    ("开发工具", "dev-tools"),
    ("效率", "productivity"),
]
tag_objs = []
for name, slug in tags_info:
    t, t_created = Tag.objects.get_or_create(name=name, defaults={"slug": slug})
    tag_objs.append(t)
    print(f"Tag: {'CREATED' if t_created else 'EXISTS'} id={t.id} {t.name}")

# 3. Article
article, art_created = Article.objects.update_or_create(
    slug=SLUG,
    defaults={
        "title": TITLE,
        "content": CONTENT,
        "category": cat,
        "status": "published",
        "is_top": False,
    },
)
article.tags.set(tag_objs)
article.save()  # re-render markdown

# 4. Backdate to 2026/7/5 10:00 CST
cst = timezone(timedelta(hours=8))
target = datetime(2026, 7, 5, 10, 0, 0, tzinfo=cst)
Article.objects.filter(id=article.id).update(created_at=target, updated_at=target)
article.refresh_from_db()

print()
print(f"Article: {'CREATED' if art_created else 'UPDATED'} id={article.id}")
print(f"  Title: {article.title}")
print(f"  Slug: {article.slug}")
print(f"  Created: {article.created_at}")
print(f"  Status: {article.status}")
print(f"  Category: {article.category.name}")
print(f"  Tags: {[t.name for t in article.tags.all()]}")
print(f"  Content: {len(article.content)} chars")
print()
print("DONE! Backdated to 2026-07-05. Now reload the PythonAnywhere web app.")
