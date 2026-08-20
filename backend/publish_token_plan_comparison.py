#!/usr/bin/env python
"""
Standalone script — run directly:
  source venv/bin/activate && python publish_token_plan_comparison.py
"""
import os, sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_api.settings')
import django
django.setup()

from articles.models import Article, Category, Tag
from datetime import datetime, timezone, timedelta

CONTENT = r"""## 引言：2026，Token 订阅大战全面爆发

2026 年上半年，国内外 AI 平台集体进入 **"Token Plan / Coding Plan 订阅制"** 时代。从阿里百炼到百度千帆，从 Kimi 到 MiniMax，从三大运营商到 ChatGPT、Claude、Gemini——几乎每家都推出了包月/包季订阅套餐。

面对 **20+ 个平台、50+ 种套餐**，开发者到底怎么选？

本文基于 2026 年 7 月最新公开定价，对国内外 **20 款主流 AI 平台**的 Token Plan / Coding Plan 做一次**全网最全横评**。

---

## 一、什么是 Token Plan 和 Coding Plan？

```
┌─────────────────────────────────────────────────────────────────┐
│                    两种订阅模式的区别                              │
├──────────────────────────┬──────────────────────────────────────┤
│      Token Plan          │         Coding Plan                  │
├──────────────────────────┼──────────────────────────────────────┤
│  • 通用 AI 对话/推理额度   │  • 专为 AI 编程场景设计               │
│  • 按 token 消耗计量      │  • 按请求次数/Agent 任务计量           │
│  • 适用：写作、分析、翻译   │  • 适用：代码补全、Agent、重构         │
│  • 代表：百炼 Token Plan  │  • 代表：百炼 Coding Plan             │
│         MiniMax Token    │         智谱 Coding Plan              │
│         阶跃 Step Plan   │         Cursor / Copilot              │
└──────────────────────────┴──────────────────────────────────────┘
```

> 简单理解：**Token Plan 是"通用粮票"，Coding Plan 是"编程专用券"。** 如果你主要用 AI 写代码，优先选 Coding Plan；如果是通用场景，选 Token Plan。

---

## 二、国内平台全对比

### 2.1 阿里系

#### 阿里云百炼（Token Plan）

| 档位 | 月费 | 额度 | 说明 |
|------|------|------|------|
| 标准版 | **¥198/月** | 625K Credits | 通义千问全系列模型 |
| 高级版 | **¥698/月** | 2,500K Credits | 含更多高级模型调用 |
| 旗舰版 | **¥1,398/月** | 6,000K Credits | 企业级大额度 |

#### 阿里云百炼（Coding Plan）

| 档位 | 月费 | 额度 | 支持模型 |
|------|------|------|----------|
| Lite | **¥40/月** | 18,000 次请求 | 千问 Coder、DeepSeek 等 |
| Pro | **¥200/月** | 90,000 次请求 | 千问/Kimi/GLM 等顶级模型 |

> 兼容 Cursor、Claude Code、OpenCode 等主流 AI 编程工具，一个订阅多工具通用。

#### Qoder CN（原通义灵码，全家桶）

| 档位 | 月费 | Credits | 说明 |
|------|------|---------|------|
| 体验版 | **免费** | 300 Credits + 2周Pro试用 | 基础补全+有限对话 |
| Pro | **¥59/月** | 2,000 Credits | IDE + CLI + Work 全家桶共享 |
| Pro+ | **¥169/月** | 6,000 Credits | 重度用户 |
| Teams | **¥99/席位·月** | 3,000 Credits/席位 | 企业团队 |
| VPC | **¥199/席位·月** | 3,000 Credits/席位 | 私有化部署，50席位起 |

> 资源包补充：个人 ¥40/1000 Credits，企业 ¥80/2000 Credits。

---

### 2.2 Kimi（月之暗面）

| 档位 | 月费 | Agent 额度 | 亮点 |
|------|------|-----------|------|
| Adagio | **免费** | ~6 个 Agent 单元 | 基础体验 |
| Andante | **¥49/月** | ~30 个 Agent 单元 | 含 Kimi Code 额度 |
| Moderato | **¥99/月** | ~60 个 Agent 单元 | 更多并行任务 |
| Allegretto | **¥199/月** | ~150 个 Agent 单元 | 含数据库调用 |
| Allegro | **¥699/月** | ~360 个 Agent 单元 | 顶配全功能 |

> Kimi K3 支持 1M 上下文（2.8T 参数），登顶 Arena 编程榜，Coding 场景表现突出。

---

### 2.3 智谱 AI（GLM / CodeGeeX）

#### Coding Plan（按季付费）

| 档位 | 季费 | 折合月费 | 说明 |
|------|------|---------|------|
| Lite | **$30/季 (~¥216)** | ~¥72/月 | 基础编码 |
| Pro | **$90/季 (~¥648)** | ~¥216/月 | 高级模型 + 更多额度 |
| Max | **$240/季 (~¥1,728)** | ~¥576/月 | 顶配 |

#### CodeGeeX（IDE 插件）

| 档位 | 月费 | 说明 |
|------|------|------|
| 个人版 | **免费** | 基础补全+对话 |
| Pro | **¥74/月** | 高级模型+企业知识库 |

#### API 按量计费参考

| 模型 | 输入 (¥/百万token) | 输出 (¥/百万token) |
|------|:---:|:---:|
| GLM-5 | 7.2 | 23 |
| GLM-4.7 | 4.3 | 15.8 |
| GLM-4 Flash | **免费** | **免费** |

> GLM-5.2 支持 1M 上下文（744B 参数），Flash 系列永久免费。

---

### 2.4 MiniMax（海螺 AI）

| 档位 | 月费 | 说明 |
|------|------|------|
| Starter | **¥29/月** | 入门体验 |
| Plus | **¥49/月** | 覆盖开放平台所有模型 |
| Max | **¥119/月** | 3-7 个 Agent 并行 |
| Ultra | **¥469/月** | 顶配大额度 |

> 积分补充：¥7/1000 积分。支持多模态（文本+视频+语音）。

---

### 2.5 阶跃星辰（Step Plan）

| 档位 | 月费 | 说明 |
|------|------|------|
| Flash Mini | **¥49/月** | 轻量推理 |
| Plus | **¥99/月** (估) | 标准开发 |
| Pro | **¥199/月** (估) | 高级模型 |
| Max | **¥399/月** (估) | 全速推理无限制 |

> 2026年3月发布，4档方案，全档位高速推理，主打"不降速"。

---

### 2.6 百度千帆（文心一言）

#### Token Plan

| 档位 | 月费 | 说明 |
|------|------|------|
| Mini | **¥4.9起** (首购五折) | 入门体验 |
| Lite | **¥40/月** | 基础额度 |
| Pro | **¥200/月** | 大额度 |
| Max | 按需 | 企业级 |

#### Coding Plan

| 档位 | 月费 | 额度 |
|------|------|------|
| Lite | **¥40/月** | 基础编码请求 |
| Pro | **¥200/月** | 高级编码 + Agent |

> 文心大模型 4.5 系列，Token 单价低至市场价 50%。

---

### 2.7 科大讯飞（星火大模型）

| 档位 | 月费 | 说明 |
|------|------|------|
| Lite API | **永久免费** | 基础模型调用 |
| Pro | **¥39/月** | 星火 Pro/Max 模型 |
| Efficiency | **¥199/月** | 大额度 + 高级功能 |

> 2026年讯飞斥资10亿成立"词元星火"，Token 消耗成本仅为同行 1/3。星火 Lite API 永久免费。

---

### 2.8 火山引擎（字节跳动 / 豆包）

| 类型 | 档位 | 月费 | 说明 |
|------|------|------|------|
| Coding Plan | Lite | **¥40/月** | 基础编码 |
| Coding Plan | Pro | **¥200/月** | 高级编码 + Agent |
| Agent Plan | 标准 | **¥50-200/月** | 智能体任务 |

> 旗下 Trae IDE 国内版**基础功能完全免费**，用户已破 600 万。

---

### 2.9 小米（MiMo）

| 档位 | 月费 | 说明 |
|------|------|------|
| Lite | **¥39/月** | 轻量推理 |
| Standard | **¥99/月** | 标准开发 |
| Pro | **¥329/月** | 高级模型 |
| Max | **¥659/月** | 顶配 |

---

### 2.10 九章云极

| 档位 | 月费 | 说明 |
|------|------|------|
| 入门版 | **¥199/月** | 基础 Token 额度 |
| 进阶版 | **¥399/月** | 更大额度 + 多模型 |
| 旗舰版 | **¥699/月** | 企业级全功能 |

---

### 2.11 三大运营商（Token 套餐）

2026 年 6 月，三大运营商集体入局 Token 经营，主打**普惠低价**：

| 运营商 | 起步价 | 额度 | 特点 |
|--------|--------|------|------|
| **中国电信** | **¥9.9/月** | 1,000 万 Tokens | 最高 ¥299.9/月，多档位 |
| **中国移动** | **¥5/月** | 250 万 Tokens (¥9档) | 灵活省级定价，¥1=40万Token |
| **中国联通** | Lite/Pro/Max 三档 | 按档位递增 | AI 调用日均百亿级 |

> 运营商套餐适合**轻度用户和尝鲜**，模型选择相对有限，但价格确实"卷"到了地板。

---

### 2.12 DeepSeek

| 模式 | 费用 | 说明 |
|------|------|------|
| 按量付费 | ~¥33/月 (中度使用) | 无订阅，用多少付多少 |
| API | 输入 ¥1/百万token，输出 ¥4/百万token | V4 支持 1024K 上下文 |

> DeepSeek 不推订阅制，坚持按量计费，1024K 超长上下文是最大卖点。

---

## 三、海外平台全对比

### 3.1 OpenAI（ChatGPT / Codex）

| 档位 | 月费 | 说明 |
|------|------|------|
| Free | **$0** | 有限 GPT-4o 调用 |
| Plus | **$20/月** | GPT-4o + o4-mini 标准额度 |
| Pro 5x | **$100/月** | Plus 的 5 倍容量 |
| Pro 20x | **$200/月** | Plus 的 20 倍容量 |
| Codex | 含于 Plus 以上 | 云端编程 Agent |

---

### 3.2 Anthropic（Claude Code）

| 档位 | 月费 | 说明 |
|------|------|------|
| Pro | **$20/月** | 轻度编码，Claude Sonnet 4 |
| Max 5x | **$100/月** | Pro 的 5 倍容量 |
| Max 20x | **$200/月** | Pro 的 20 倍容量，含 Opus 4 |
| Team | **$30/席位·月** | 团队协作 |

> Claude Code 终端原生 Agent，代码理解深度当前最强。

---

### 3.3 Google（Gemini）

| 档位 | 月费 | 说明 |
|------|------|------|
| Free | **$0** | Gemini 2.5 Flash 有限额度 |
| Advanced | **$19.99/月** | Google One AI Premium，含 Gemini 2.5 Pro |
| Code Assist | **$19/月** | IDE 编程插件 |

> Gemini 2.5 Pro 支持 1M token 上下文，Advanced 订阅含 2TB Google One 存储。

---

### 3.4 GitHub Copilot

| 档位 | 月费 | 说明 |
|------|------|------|
| Free | **$0** | 有限 premium requests |
| Pro | **$10/月** | 标准编码助手 |
| Pro+ | **$39/月** | 更多 premium requests |
| Max | **$100/月** | 大额度 + 高级模型 |
| Business | **$19/席位·月** | 企业团队 |
| Enterprise | **$39/席位·月** | 企业级 + 知识库 |

---

### 3.5 Cursor

| 档位 | 月费 | 额度 | 说明 |
|------|------|------|------|
| Hobby | **$0** | 极有限 | 体验版 |
| Pro | **$20/月** | $20 等值 API 用量 | 主力方案 |
| Pro+ | **$60/月** | $70 等值 API 用量 | 重度用户 |
| Ultra | **$200/月** | $400 等值 API 用量 | 顶配 |
| Teams | **$40/席位·月** | — | 企业标准 |
| Teams Premium | **$120/席位·月** | — | 企业高级 |

> Cursor 3.0 支持 Agent 并行工厂 + 云端智能体。注意：重度 Agent 使用 $20 额度可能 3-5 天耗尽。

---

### 3.6 OpenCode（开源）

| 档位 | 月费 | 说明 |
|------|------|------|
| 开源版 | **免费** | 自带 API Key，完全开源 |
| Go | **$10/月** | 官方托管模型服务 |

> OpenCode 是 2026 年最火的开源 AI 编程工具（GitHub 7万+ Star），支持接入任意模型 API。搭配国内百炼/智谱 Coding Plan 使用性价比极高。

---

### 3.7 Ollama（本地模型）

| 档位 | 月费 | 说明 |
|------|------|------|
| 本地版 | **免费** | 本地运行开源模型 |
| Pro | **$20/月** | 云端托管 |
| Max | **$100/月** | 大额度云端 |

---

## 四、全景价格对比表

### 4.1 国内平台入门档（¥29-59/月区间）

| 平台 | 入门价 | 类型 | 核心卖点 |
|------|:---:|------|----------|
| 电信 Token | ¥9.9 | Token | 最便宜，1000万Token |
| MiniMax Starter | ¥29 | Token | 多模态 |
| 讯飞 Pro | ¥39 | Token | 星火Lite永久免费 |
| 小米 Lite | ¥39 | Token | 生态整合 |
| 百炼 Coding Lite | ¥40 | Coding | 兼容主流IDE工具 |
| 火山 Coding Lite | ¥40 | Coding | Trae免费+豆包模型 |
| 百度 Lite | ¥40 | Token/Coding | 首购五折 |
| Kimi Andante | ¥49 | Token | 1M上下文(K3) |
| MiniMax Plus | ¥49 | Token | 全模型覆盖 |
| 阶跃 Flash Mini | ¥49 | Token | 全档高速不降速 |
| 智谱 Lite | ~¥72 | Coding | GLM-5.2 + CodeGeeX |
| Qoder CN Pro | ¥59 | Coding | 全家桶多端共享 |

### 4.2 国内平台中高档（¥99-200/月区间）

| 平台 | 价格 | 类型 | 核心卖点 |
|------|:---:|------|----------|
| Kimi Moderato | ¥99 | Token | 60 Agent单元 |
| 小米 Standard | ¥99 | Token | — |
| 阶跃 Plus | ¥99 | Token | — |
| MiniMax Max | ¥119 | Token | Agent并行 |
| Qoder CN Pro+ | ¥169 | Coding | 6000 Credits |
| 讯飞 Efficiency | ¥199 | Token | 大额度 |
| Kimi Allegretto | ¥199 | Token | 150 Agent单元 |
| 九章 入门版 | ¥199 | Token | 企业级 |
| 百炼 Coding Pro | ¥200 | Coding | 9万次请求 |
| 火山 Coding Pro | ¥200 | Coding | Agent + 高级模型 |
| 百度 Pro | ¥200 | Token/Coding | 文心4.5 |

### 4.3 海外平台（按 $ 计价）

| 平台 | 入门 | 中档 | 高档 | 类型 |
|------|:---:|:---:|:---:|------|
| OpenCode Go | $10 | — | — | Coding (开源) |
| Copilot | $10 | $39 | $100 | Coding |
| Gemini | $19.99 | — | — | Token |
| ChatGPT | $20 | $100 | $200 | Token + Coding |
| Claude Code | $20 | $100 | $200 | Coding |
| Cursor | $20 | $60 | $200 | Coding |
| Ollama | $20 | — | $100 | Token (本地) |

---

## 五、模型编码性能基准（2026 年 7 月最新）

选订阅套餐，**底层模型的编码能力**才是核心。以下是 2026 年 7 月最新旗舰模型编码性能对比：

### 5.1 SWE-bench Verified（真实 GitHub Issue 修复通过率）

| 排名 | 模型 | 通过率 | 所属平台 | 发布时间 |
|:---:|------|:---:|------|------|
| 1 | **GPT-5.6 Sol** | **96.2%** | OpenAI (ChatGPT/Codex) | 2026.7.9 |
| 2 | Claude Mythos 5 | **95.5%** | Anthropic | 2026.5 |
| 3 | **Claude Fable 5** | **95.0%** | Anthropic (Claude Code) | 2026.6 |
| 4 | **Kimi K3** | **~90%** | Kimi (月之暗面) | 2026.7.16 |
| 5 | **Qwen3.8 Max Preview** | **~89%** | 阿里百炼 / Qoder CN | 2026.7.19 |
| 6 | DeepSeek V4 Pro Max | **80.6%** | DeepSeek / 百炼 | 2026.5 |
| 7 | **GLM-5.2** | **~80%** | 智谱 AI / CodeGeeX | 2026.7 |
| 8 | Gemini 2.5 Pro | **63.8%** | Google | 2025 |

### 5.2 SWE-bench Pro（更严格的多文件工程级测试）

| 模型 | 通过率 | 备注 |
|------|:---:|------|
| **Claude Fable 5** | **80.0%** | 编码实战公认最强 |
| GPT-5.6 Sol | 64.6% | 基准测试强，工程实战稍逊 |
| **GLM-5.2** | **62.1%** | 超越 GPT-5.5 (58.6%)，国产第一 |
| Kimi K3 | ~60% | 登顶 Arena 编程盲测榜 (1679分) |

### 5.3 最新旗舰模型参数对比

| 模型 | 参数量 | 上下文 | 核心亮点 |
|------|:---:|:---:|------|
| **Kimi K3** | **2.8T** | **1M** | 全球最大开源模型，Arena编程榜第一 |
| **Qwen3.8 Max** | **2.4T** | 256K | 自评"除Fable 5外最强"，即将开源 |
| **GLM-5.2** | **744B** | **1M** | 编码成本仅GPT-5.5的1/6 |
| GPT-5.6 Sol | 未公开 | 128K | SWE-bench Verified 第一 |
| Claude Fable 5 | 未公开 | 200K | 工程实战/Agent 公认最强 |
| DeepSeek V4 | 未公开 | **1024K** | 超长上下文，按量付费 |

```
编码性能梯队分布（2026年7月）：

T0 (95%+)  ████████████████████████████████████████  GPT-5.6 Sol / Mythos 5 / Fable 5
T1 (88-94) ████████████████████████████████████      Kimi K3 / Qwen3.8
T2 (78-85) ████████████████████████████████          DeepSeek V4 / GLM-5.2
T3 (60-70) █████████████████████████                 Gemini 2.5 Pro
```

> **关键洞察**：
> 1. **Fable 5 是编码实战最强**——虽然 SWE-bench Verified 略低于 GPT-5.6 Sol，但在更严格的 SWE-bench Pro（多文件工程级）中以 80% 大幅领先，Agent 编程体验公认第一。
> 2. **国产模型集体爆发**——Kimi K3 (2.8T) 登顶 Arena 编程盲测榜，Qwen3.8 (2.4T) 自评仅次于 Fable 5，GLM-5.2 在 SWE-bench Pro 超越 GPT-5.5。中美编码性能差距已缩小到 1-4%。
> 3. **成本差距巨大**——GLM-5.2 编码成本仅为 GPT-5.5 的 1/6，国产模型在性价比上碾压海外。

---

## 六、各平台额度与调用限制详情

### 6.1 Coding Plan 额度对比

| 平台 | 档位 | 月请求上限 | 5小时限制 | 周限制 | 上下文长度 |
|------|------|:---:|:---:|:---:|:---:|
| **百炼 Coding** | Lite | 18,000 次 | — | — | 128K |
| **百炼 Coding** | Pro | 90,000 次 | 6,000 次 | 45,000 次 | 128K |
| **智谱 Coding** | Lite | ~24,000 次 | — | — | 200K |
| **智谱 Coding** | Pro | ~60,000 次 | — | — | 200K |
| **火山 Coding** | Lite | ~18,000 次 | — | — | 128K |
| **火山 Coding** | Pro | ~90,000 次 | — | — | 128K |
| **Qoder CN** | Pro | 2,000 Credits | — | — | 128K |
| **Qoder CN** | Pro+ | 6,000 Credits | — | — | 128K |

### 6.2 Token Plan 额度对比

| 平台 | 档位 | 月额度 | 上下文 | 模型选择 |
|------|------|------|:---:|------|
| **Kimi** | Andante ¥49 | ~30 Agent单元 | 1M | Kimi K3 |
| **Kimi** | Moderato ¥99 | ~60 Agent单元 | 1M | Kimi K3 |
| **MiniMax** | Plus ¥49 | 标准积分 | 128K | 全平台模型 |
| **MiniMax** | Max ¥119 | 3-7 Agent并行 | 128K | 全平台模型 |
| **阶跃** | Flash Mini ¥49 | 基础额度 | 128K | Step 系列 |
| **讯飞** | Pro ¥39 | 标准额度 | 128K | 星火 Pro/Max |
| **电信** | ¥9.9 | 1,000万 Token | 32K | 有限模型 |
| **移动** | ¥9 | 250万 Token | 32K | 有限模型 |
| **DeepSeek** | 按量 | 无上限(按费) | **1024K** | DeepSeek V4 |

### 6.3 海外平台额度对比

| 平台 | 档位 | 额度机制 | 上下文 | 备注 |
|------|------|------|:---:|------|
| **ChatGPT** | Plus $20 | 标准容量 | 128K | GPT-4o + o4-mini |
| **ChatGPT** | Pro 5x $100 | 5倍容量 | 128K | 含 Codex Agent |
| **Claude Code** | Pro $20 | 轻度编码 | 200K | Sonnet 4 为主 |
| **Claude Code** | Max 20x $200 | 20倍容量 | 200K | 含 Opus 4 |
| **Cursor** | Pro $20 | $20 API等值 | 128K | 重度Agent 3-5天耗尽 |
| **Cursor** | Ultra $200 | $400 API等值 | 128K | 顶配 |
| **Copilot** | Pro $10 | 标准 premium req | 128K | 基础模型不消耗额度 |
| **Gemini** | Advanced $19.99 | Google One 含 | **1M** | 上下文最长 |

> ⚠️ **额度消耗提醒**：Agent 模式下 token 消耗远超普通对话。实测一句简单指令可能消耗 4.9 万 Token（运营商套餐实测数据），重度 Agent 用户月消耗可达数千万 Token。

---

## 七、获取难度与使用门槛

### 7.1 国内平台获取难度

| 平台 | 获取难度 | 说明 |
|------|:---:|------|
| **Trae 国内版** | ⭐ 极易 | 官网直接下载，免费使用，手机号注册 |
| **CodeGeeX** | ⭐ 极易 | IDE 插件商店直接安装，免费 |
| **讯飞星火 Lite** | ⭐ 极易 | 官网注册即用，API 永久免费 |
| **Kimi** | ⭐ 极易 | 官网/App 注册，付费即开通 |
| **MiniMax** | ⭐ 极易 | 官网注册，付费即开通 |
| **阶跃星辰** | ⭐ 极易 | 官网注册，付费即开通 |
| **Qoder CN** | ⭐⭐ 容易 | 阿里云账号，付费即开通 |
| **百度千帆** | ⭐⭐ 容易 | 百度云账号，首购有优惠 |
| **九章云极** | ⭐⭐ 容易 | 官网注册，企业需认证 |
| **三大运营商** | ⭐⭐ 容易 | 营业厅/App 办理，需实名 |
| **阿里百炼 Coding Pro** | ⭐⭐⭐⭐ 较难 | **每天 9:30 限量抢购**，经常秒售罄！同一账号限购1份 |
| **火山 Coding Pro** | ⭐⭐⭐ 中等 | 偶有限量，需关注补货 |

> 🚨 **百炼 Coding Plan Pro 抢购攻略**：每天 9:30 准时补货，建议提前 5 分钟进入页面。Lite 版已下架，目前仅 Pro 版（¥200/月）。抢不到可用 Token Plan 团队版或领取 7000 万免费 Token 替代。

### 7.2 海外平台获取难度（国内用户）

| 平台 | 获取难度 | 说明 |
|------|:---:|------|
| **GitHub Copilot** | ⭐⭐ 容易 | GitHub 账号 + 国际信用卡/支付宝，**无需翻墙** |
| **OpenCode** | ⭐⭐ 容易 | 开源免费，搭配国内 API 无需翻墙 |
| **Cursor** | ⭐⭐⭐ 中等 | 需翻墙下载，支付支持支付宝（虚拟卡），使用需稳定网络 |
| **ChatGPT/OpenAI** | ⭐⭐⭐⭐ 较难 | 需翻墙 + 海外手机号/虚拟号注册 + 国际支付 |
| **Claude Code** | ⭐⭐⭐⭐ 较难 | 需翻墙 + 海外支付，国内需配置代理环境变量 |
| **Gemini Advanced** | ⭐⭐⭐⭐ 较难 | 需翻墙 + Google 账号 + 部分地区不可用 |
| **Ollama** | ⭐ 极易 | 开源本地运行，无需网络，但需 GPU 硬件 |

```
获取难度总结：

国内用户无障碍：Trae / CodeGeeX / 讯飞 / Kimi / MiniMax / 阶跃 / Qoder CN / 百炼 / Copilot / OpenCode
需要一定门槛：  Cursor (翻墙+支付) / 百炼Pro (抢购)
需要较多折腾：  ChatGPT / Claude Code / Gemini (翻墙+海外注册+支付)
完全无门槛：    Ollama 本地版 (需GPU) / DeepSeek API (按量付费)
```

### 7.3 支付方式对比

| 平台 | 支付宝 | 微信 | 国际信用卡 | 其他 |
|------|:---:|:---:|:---:|------|
| 国内所有平台 | ✅ | ✅ | — | 阿里云/百度云余额 |
| GitHub Copilot | ✅ | ❌ | ✅ | — |
| Cursor | ✅ (虚拟卡) | ❌ | ✅ | 支付宝代充 |
| ChatGPT | ❌ | ❌ | ✅ | 虚拟信用卡 |
| Claude Code | ❌ | ❌ | ✅ | 虚拟信用卡 |
| Gemini | ❌ | ❌ | ✅ | Google Play 余额 |

---

## 八、性价比深度分析

### 8.1 个人开发者月费阶梯图

```
月费(¥)
 │
700│                                              ┌───┐ Kimi Allegro
   │                                              │   │
660│                                         ┌───┐│   │ 小米 Max
   │                                         │   ││   │
470│                                    ┌───┐│   ││   │ MiniMax Ultra
   │                                    │   ││   ││   │
200│         ┌───┐                 ┌───┐│   ││   ││   │ 百炼Coding Pro
   │         │   │ Qoder Pro+ ¥169│   ││   ││   ││   │
144│    ┌───┐│   │                │   ││   ││   ││   │ Cursor Pro
   │    │   ││   │  Copilot Pro   │   ││   ││   ││   │
 59│┌───┐│   ││   │  ~¥72         │   ││   ││   ││   │
   ││   ││   ││   │               │   ││   ││   ││   │
  0│┴───┴┴───┴┴───┴───────────────┴───┴┴───┴┴───┴┴───┴──
  Trae CodeGeeX Qoder Copilot  Cursor 阶跃 Kimi  MiniMax
  免费  免费   CN Pro  Pro     Pro          Allegro Ultra
```

### 8.2 性价比排名（个人编码场景）

| 排名 | 方案 | 月费 | 推荐理由 |
|:---:|------|:---:|----------|
| 1 | **Trae 国内版 + DeepSeek API** | ¥0~33 | 零成本入门，按量付费灵活 |
| 2 | **百炼 Coding Lite + OpenCode** | ¥40 | 1.8万次请求，兼容所有开源工具 |
| 3 | **Qoder CN Pro** | ¥59 | 全家桶多端共享，国产生态最完善 |
| 4 | **Copilot Pro** | ~¥72 | 生态最成熟，VS Code 无缝集成 |
| 5 | **Kimi Andante** | ¥49 | 1M 上下文(K3)，通用+编码兼顾 |
| 6 | **Cursor Pro** | ~¥144 | AI 原生 IDE 体验最佳 |
| 7 | **Claude Code Pro** | ~¥144 | 终端 Agent 深度最强 |

### 8.3 企业团队性价比（50人/月）

| 方案 | 月费总计 | 年费 | 特点 |
|------|------:|------:|------|
| Qoder CN Teams | ¥4,950 | ¥59,400 | 国产首选，私有化可选 |
| 百炼 Coding Pro × 50 | ¥10,000 | ¥120,000 | 多模型切换 |
| Copilot Business | ~¥6,840 | ~¥82,080 | 跨国团队 |
| Cursor Teams | ~¥14,400 | ~¥172,800 | IDE 体验最佳 |
| Claude Team | ~¥10,800 | ~¥129,600 | Agent 深度 |

---

## 九、选型决策树

```
你的核心需求是什么？
│
├─ 「零预算 / 学生党」
│   ├─ 日常编码 → Trae 国内版 (免费) + CodeGeeX (免费)
│   ├─ 通用AI → 讯飞星火 Lite (免费) + GLM-4 Flash (免费)
│   └─ 尝鲜 → 电信 Token ¥9.9/月 (1000万Token)
│
├─ 「个人开发者，月预算 ¥40-60」
│   ├─ 主做编码 → 百炼 Coding Lite ¥40 + OpenCode (开源)
│   ├─ 全家桶体验 → Qoder CN Pro ¥59
│   ├─ 通用+编码 → Kimi Andante ¥49
│   └─ VS Code 用户 → Copilot Pro ~¥72
│
├─ 「重度开发者，月预算 ¥100-200」
│   ├─ AI 原生 IDE → Cursor Pro ~¥144
│   ├─ 终端 Agent → Claude Code Pro ~¥144
│   ├─ 国产大额度 → 百炼 Coding Pro ¥200 (9万次)
│   └─ 通用重度 → Kimi Allegretto ¥199
│
├─ 「企业团队 (国内)」
│   ├─ 性价比优先 → Qoder CN Teams ¥99/席位
│   ├─ 安全合规 → Qoder CN VPC ¥199/席位
│   └─ 多模型需求 → 百炼 Coding Pro ¥200/人
│
└─ 「企业团队 (跨国/海外)」
    ├─ 生态成熟 → Copilot Business $19/席位
    ├─ IDE 体验 → Cursor Teams $40/席位
    └─ Agent 深度 → Claude Team $30/席位
```

---

## 十、2026 下半年趋势预判

### 10.1 行业格局

```
┌─────────────────────────────────────────────────────────────┐
│                    2026 Token 订阅市场格局                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   第一梯队 (生态型)                                          │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│   │阿里百炼  │ │ 百度千帆 │ │ 火山引擎 │ │ OpenAI  │         │
│   │+Qoder CN│ │+文心一言 │ │+Trae    │ │+Codex   │         │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│                                                             │
│   第二梯队 (模型型)                                          │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│   │  Kimi   │ │  智谱   │ │ MiniMax │ │Anthropic│         │
│   │月之暗面  │ │  GLM    │ │ 海螺AI  │ │ Claude  │         │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│                                                             │
│   第三梯队 (渠道型)                                          │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│   │中国电信  │ │中国移动  │ │中国联通  │ │  Google │         │
│   │ 天翼AI  │ │ 移动云  │ │ 联通云  │ │ Gemini  │         │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 关键趋势

1. **Coding Plan 成为标配**：百炼、智谱、百度、火山都推出了专门的 Coding Plan，与通用 Token Plan 分离计费
2. **运营商入局搅局**：电信 9.9 元/月的 Token 套餐把价格打到地板，倒逼互联网平台降价
3. **开源工具 + 订阅 API 成为主流组合**：OpenCode (7万Star) + 百炼/智谱 Coding Plan 的组合性价比碾压闭源 IDE
4. **Credits 统一化**：Qoder CN 率先打通 IDE + CLI + Work + Mobile 的 Credits 共享
5. **免费层持续扩大**：Trae、CodeGeeX、讯飞 Lite、GLM-4 Flash 永久免费，入门零门槛
6. **Agent 消耗远超预期**：一句"你好"可能消耗 4.9 万 Token，重度 Agent 用户月消耗可达数千万 Token

---

## 十一、终极推荐

| 你是谁 | 推荐方案 | 月费 |
|--------|----------|:---:|
| 学生/初学者 | Trae (免费) + 讯飞 Lite (免费) + 电信 ¥9.9 | ¥0~10 |
| 个人全栈开发者 | 百炼 Coding Lite ¥40 + OpenCode | ¥40 |
| 国产生态深度用户 | Qoder CN Pro (全家桶) | ¥59 |
| 追求极致体验 | Cursor Pro + Claude Code Pro | ~¥288 |
| 国内企业团队 | Qoder CN Teams / 百炼 Coding Pro | ¥99-200/人 |
| 跨国企业 | Copilot Business + Cursor Teams | $59/人 |
| 轻度通用用户 | Kimi Andante / MiniMax Plus | ¥49 |
| 隐私敏感/离线 | Ollama 本地 + DeepSeek API | ¥0~33 |

**一句话总结**：

> 2026 年的 AI 订阅市场，**国内选百炼/Qoder CN（生态全），海外选 Claude/Cursor（体验强），零预算选 Trae + 免费模型（够用）**。不要贪多，选 1-2 个深度使用比订阅 5 个浅尝辄止强十倍。

---

## 参考来源

- [阿里云百炼 Coding Plan 概述](https://help.aliyun.com/zh/model-studio/coding-plan-overview)
- [阿里云 Qoder CN 计费说明](https://help.aliyun.com/document_detail/2796963.html)
- [Kimi 会员收费与套餐介绍](https://www.kimi.com/zh-cn/help/membership/membership-pricing)
- [智谱 GLM 价格全解析 2026](https://vibecoding.app/blog/zh/zhipu-glm-jiage-2026)
- [MiniMax Token Plan 官方文档](https://platform.minimaxi.com/docs/guides/pricing-token-plan)
- [阶跃星辰发布 Step Plan](https://m.10jqka.com.cn/20260323/c675482569.html)
- [百度千帆 Token Plan 个人版](https://cloud.baidu.com/product/qianfan_home/token-plan-activity.html)
- [Cursor Pricing 2026](https://aiproductivity.ai/blog/cursor-pricing/)
- [GitHub Copilot 个人版计划](https://docs.github.com/zh/copilot/concepts/billing/individual-plans)
- [Claude Code 定价说明](https://www.getaiperks.com/zh/ai/claude-code-pricing)
- [2026 国内外 Coding Plan 全景对比 (GitHub)](https://github.com/xiaotiewinner/coding-plan)
- [三大运营商 Token 套餐对比](https://finance.sina.com.cn/jjxw/2026-07-21/doc-iniiqefa9311356.shtml)
- [2026 国产大模型套餐快速对比](https://www.wuaishare.cn/9478.html)
- [国内 AI 平台 Plan 订阅大横评](https://baijiahao.baidu.com/s?id=1865027244790522605)
- [2026海外AI编程套餐横评](https://watermelonwater.tech/insights/%E6%B5%B7%E5%A4%96ai%E7%BC%96%E7%A8%8B%E5%A5%97%E9%A4%90%E6%A8%AA%E8%AF%84/)

---

> 📅 数据采集于 2026 年 7 月 22 日，各平台定价可能随时调整，请以官网最新信息为准。
"""

TITLE = "2026 全网最全 AI Token Plan / Coding Plan 对比：国内外 20+ 平台横评"
SLUG = "ai-token-coding-plan-comparison-2026"

# 1. Category
cat, cat_created = Category.objects.get_or_create(
    name="AI编程", defaults={"slug": "ai-coding"}
)
print(f"Category: {'CREATED' if cat_created else 'EXISTS'} id={cat.id} {cat.name}")

# 2. Tags
tags_info = [
    ("AI编程", "ai-coding"),
    ("Token Plan", "token-plan"),
    ("Coding Plan", "coding-plan"),
    ("Qoder CN", "qoder-cn"),
    ("Cursor", "cursor"),
    ("GitHub Copilot", "github-copilot"),
    ("Claude Code", "claude-code"),
    ("Kimi", "kimi"),
    ("智谱GLM", "zhipu-glm"),
    ("MiniMax", "minimax"),
    ("阿里百炼", "ali-bailian"),
    ("定价对比", "pricing-comparison"),
]
tag_objs = []
for name, slug in tags_info:
    t, t_created = Tag.objects.get_or_create(name=name, defaults={"slug": slug})
    tag_objs.append(t)
    print(f"Tag: {'CREATED' if t_created else 'EXISTS'} id={t.id} {t.name}")

# 3. Article (update existing or create new)
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

# Also remove the old shorter version if it exists
Article.objects.filter(slug="ai-coding-token-plan-comparison-2026").delete()

# 4. Set created_at to today
cst = timezone(timedelta(hours=8))
target = datetime(2026, 7, 22, 10, 0, 0, tzinfo=cst)
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
print("DONE! Now reload the PythonAnywhere web app to go live.")
