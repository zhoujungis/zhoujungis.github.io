# GPT-6 Astra 发布：OpenAI 喊出“欢迎来到 AGI 时代”，开发者需要知道的八件事

![GPT-6 Astra 发布海报](https://images.ctfassets.net/kftzwdyauwt9/H9Mf4UPiWGb0N25sLJHUu/6d971b8e12cbab3db48c94617d703b5d/poster.webp?w=1920&q=80&fm=webp)

> **发布时间：2026 年 9 月 3 日（美西）/ 9 月 4 日（北京时间）**。OpenAI 总裁 Greg Brockman 在发布会结尾说出 **“Welcome to the AGI era.”** 本文基于 OpenAI 官方博文《GPT-6 Astra: A new generation of intelligence》、API 文档、System Card 以及 Bloomberg、量子位、The Decoder 等信源整理，数据截点为 2026-09-04。

---

## 先说结论：GPT-6 Astra 是什么

一句话：**GPT-6 Astra 是 OpenAI 面向“完整任务交付”而非“单轮问答”的新一代旗舰模型，也是首个被 OpenAI 官方称为“最智能、最对齐（most intelligent and aligned）”并单方面宣布进入 AGI 时代的模型。**

| 维度 | 关键信息 |
|---|---|
| **定位** | 取代 GPT-5.6 Sol 的旗舰，强调 Computer Use / Browser Use / 软件工程 / 网络安全 / 科学 / 专业办公六项全能 |
| **发布时间** | 2026-09-03 美西首发，限量企业客户即日可用；未来数日向 ChatGPT Plus / Pro / Business / Enterprise 全量开放 |
| **API 名称** | `gpt-6-astra`，同步上架 OpenAI API 与 AWS Bedrock，支持 Zero Data Retention（ZDR） |
| **上下文** | 输入最高 922,000 tokens，输出最高 128,000 tokens，知识截点 2026-04-30 |
| **定价（Standard）** | 输入 $10 / 百万 tokens，输出 $50；缓存命中 $1，缓存写入 $12.5；>272K 长输入按 2× 输入 / 1.5× 输出计费；Fast 模式 2×；Batch/Flex 5 折 |
| **口号** | Welcome to the AGI era |

> Astra 不是简单的“GPT-5.7”——OpenAI 在博文中明确称其集成了多年在 **预训练、强化学习、对齐** 上的“大赌注（big bets）”。但“AGI 时代”目前仍是 OpenAI 单方面的叙事，学术界与评测社区更关注可复现的基准。

---

## 一、为什么叫 Astra，和 GPT-5.6 Sol 是什么关系

* **Sol → Astra**：Sol（太阳）是 GPT-5.6 的代号，Astra（星群）被定位为下一代“能持续执行完整任务”的智能体。官方表述是：从“回答、生成、调工具”进化到“持续执行完整任务（continuously execute full tasks）”。
* **不是 10 万亿参数神话**：发布前 X 上曾流传“Astra 10 万亿参数”“代号 Doug 年底再发”等爆料，官方未证实任何参数规模，本文不采信。
* **替代关系**：GPT-6 Astra 在所有内部对比中均以 GPT-5.6 Sol 为基线（API 版 Sol），创业公司可在 API 中直接把 `gpt-5.6-sol` 替换为 `gpt-6-astra` 对比。

---

## 二、能力新标杆：六个维度的 SOTA 在哪里

OpenAI 给出的对比表以 **GPT-5.6 Sol / Claude Fable 5.1 / Claude Fable 5 / Claude Opus 5 / Gemini 3.8 Flash** 为对照，以下摘录核心数据（*最高 effort 下的最大分，官方研究环境运行*）：

### 1. 电脑操作（Computer Use）——最大的跃进

| 评测 | GPT-6 Astra | GPT-5.6 Sol | 说明 |
|---|---|---|---|
| **OSWorld 2.0** (offline subset) | **72.6%** | 65.7% | 离线网页+桌面操作，Astra 平均用时约 40 分钟 vs Sol 75 分钟，快 47% |
| **ScreenSpot-Pro**（无工具） | **92.7%** | 76.9% | 纯视觉定位控件 |
| **Agents' Last Exam** | **59.3%** | 53.6% | 财务建模、工程、媒体制作等真实软件任务 |

**这意味着什么**：填表、更新 CRM、排日历、做线上调研、分析科学数据并出图、搭网站并做前端 QA、自主安装调试软件——这些“脏活累活”现在是 Astra 的主战场。配合 Codex harness 1.9× 加速，在 Mind2Web 上体感更快。

> 案例：OpenAI 演示了 15 秒浓缩回放——Astra 在 KiCad 中完成 PCB 布局，将电路原理图转为可制造的电路板；以及在 Blender 建模后导入 Unreal Engine 5 生成可行走场景。

### 2. 专业办公（Professional Work）

| 评测 | Astra | Sol | 亮点 |
|---|---|---|---|
| **AutomationBench** | **41.4%** | 18.1% | 跨应用自动化 |
| **BenchCAD** | **95.9%** | 83.3% | 多视图还原 3D CAD 代码 |
| **Internal Design / Data Science** | 50.0% / 40.9% | 47.4% / 30.5% | 模板遵循与图表提炼 |

能力点：**模板对齐的幻灯片/文档/表格**——给几张公司模板，Astra 能拉齐语气与版式，只提炼必要上下文，不再把所有历史信息都塞进输出。结合 ChatGPT 内的 [Sites](https://learn.chatgpt.com/docs/sites?surface=app) 可直接从 prompt 建站并托管。

### 3. 编程（Coding）

| 评测 | Astra | Sol | Claude Fable 5.1 | 节选解读 |
|---|---|---|---|---|
| **Terminal-Bench 4.0** | **57.9%** | 37.3% | 55.8% | 终端级软件工程，成本比 Sol 低 9% |
| **FrontierCode 1.1 Extended** | **64.5%** | 60.6% | 63.6% | 长程生成 |
| **Internal DB Migration** | **63.9%** | 42.7% | 57.8% | 真实库迁移任务 |

两处工程改进值得开发者关注：

1. **跨上下文记忆**：Astra 在 Codex 中引入实验性的 `config.toml` 配置——用“笔记”替代“压缩摘要”来跨窗口保留上下文，旧窗口仍可检索，未捕获的失败原因不会丢失。数周后将成为默认。
2. **沟通更易跟随**：Jane Street、Lovable 的早期评测均提到“更高 effort = 更多次全新构建+浏览器验证，代码更接近可合入质量”。

### 4. 科学、数学与健康

| 评测 | Astra | Sol |
|---|---|---|
| **FrontierMath Tier 4 v2** | **97.6%** | 83.0% |
| **GPQA Diamond** | **96.0%** | 94.6% |
| **Terminal-Bench Science 0.1** | **64.6%** | 22.4% |
| **HealthBench Professional** | **63.4%** | 60.5% |

最出圈的是 **两项素数间隔新证明**（与 UIUC 的 Julia Stadlmann 合作）：

* **短间隔**：将“无穷多对素数间隔 ≤246”这一保持十多年的界，推进到 **186**；
* **长间隔**：改进了一个 80 余年未动的长间隔上界中的关键项。

两篇证明与删节版思维链已公开。这也是 Astra “在数学上既能解题也能助证”的例证。

### 5. 网络安全——首次触及 Critical 阈值

这是 Astra 最受争议也最受关注的部分。OpenAI 在 [Path to Astra](https://openai.com/index/path-to-astra/) 中承认：**Astra 在 Preparedness Framework 下达到 Cybersecurity 的 Critical 级别**，即可在无防护条件下开发零日漏洞利用。

| 评测 | Astra | Sol | 备注 |
|---|---|---|---|
| **ExploitBench** | **100%** | 78.5% | 将已知漏洞转为可用 exploit |
| **ExploitGym** | **42.4%** | 30.3% | 且输出 token 更少 |
| **ExploitBench (June–Aug 2026 新题)** | **39.0%** | 11.5% | 20 个近 3 个月高危 V8 漏洞，Astra 还**发现并利用了 2 个未知零日**（已披露给厂商） |
| **SRE-Bench**（逆向） | **88.0%** 单次 / 99.2% 四次内 | 55.9% / 68.7% | 无源码逆向理解逻辑 |
| **SEC-Bench Pro** | **85.4%** | 79.1% |  |

**对攻防的双刃性**：Astra 能帮防守方做代码审计、补丁生成，但在无防护研究配置下也能对加固浏览器实现任意代码执行、对加固操作系统提权。OpenAI 的策略是：

* 首发版本**拒绝**生成漏洞 PoC；
* 通过 [OpenAI Daybreak](https://openai.com/daybreak/) 在未来数周向可信防守方开放更宽松的 PoC 验证、恶意软件分析等能力；
* 强化抗越狱与运行时监测。

### 6. 对齐（Alignment）——最“听话”的一代，但监测变难

| 对齐评测 | Astra | Sol | 说明 |
|---|---|---|---|
| 内部电脑操作安全基准（越低越好） | **2.4%** | 22.0% | 引入额外安全措施后 Astra 降至 1.8% |
| ExploigGym 蜜罐（误触陷阱） | **0.0%** | 48.2% |  |
| 绕过 Auto-Review 尝试 | **0.00%** | 0.29% | 即使 Auto-Review 被故意配成可绕过，Astra 也从未尝试绕过 |
| 能力幻觉 | **4.2%** | 12.2% | 谎称自己能做什么 |

但 OpenAI 也坦诚两点退步：

* **可监测性下降**：Astra 的书面推理更难被监测模型捕捉，部分原因是它能用更少步骤解题；
* **并非绝对对齐**：对齐训练是核心，运行时监测（misalignment monitoring）只是兜底，额外检查会偶发暂停/打断合法任务。

---

## 三、开发者最关心的 API 变化

### 定价与计费

```text
Text tokens（Standard）
  Input          $10 / 1M
  Cached input   $1  / 1M
  Cache writes   $12.5 / 1M
  Output         $50 / 1M

长上下文：输入 >272K 时，全请求按 2× 输入/缓存价、1.5× 输出计费
Batch / Flex：5 折
Fast 模式：2× Standard 价格，速度最高 2×
```

> 对比：GPT-5.6 时代的输入/输出价即便未公开调整，Astra 的绝对单价不低。OpenAI 强调其 **token 效率**——在多数评测中 Astra 用更少输出 token 拿到更高分，部分任务成本反而比 Sol 低 20%–40%。

### 上下文与推理

* **922K 输入 / 128K 输出 / 2026-04-30 截点**，`reasoning_effort` 分级可用（低/中/高 effort 对应不同迭代与验证深度）；
* **100 万上下文实测**：OpenAI MRCR v2 8-needle 256K–512K 达 100%，512K–1M 为 96.3%（Sol 分别为 91.5% / 73.8%）；
* **抽象推理**：ARC-AGI-3 达 **99.9% [T7]**（Sol 仅 7.8%），ARC-AGI-2 95.0%——官方说明使用了 Responses API 的两项设置以更贴近真实表现。

### 可用性与合规

* **发布节奏**：限量企业即日，数日后全量 Plus/Pro/Business/Enterprise；API 与 Bedrock 同步；
* **额度**：计入现有订阅额度，超出可购 credit；Pro/Business/Enterprise 额外获得 **GPT-6 Astra Pro**；
* **企业管控**：默认关闭，需管理员显式启用；
* **隐私**：合规 API 客户支持 ZDR，并试点 **Private Safety Processing**（在保留隐私前提下做安全监测）。

---

## 四、价格与选型：现在该切到 Astra 吗

| 场景 | 推荐 | 理由 |
|---|---:|---|
| **需要电脑/浏览器自动化、长程办公流** | **直接上 Astra** | OSWorld、BenchCAD、AutomationBench 均领先一代，效率与对齐双提升 |
| **重度代码与长程重构** | **Astra 优先，Claude Fable 5.1 作备选** | Terminal-Bench Astra 领先，但 Claude 在 Artificial Analysis Coding Agent Index 上仍有 67.2 vs 67.0 的微弱优势 |
| **成本敏感的批量执行** | **评估后再切** | Astra 单价高；若任务可用小模型或缓存命中，DeepSeek/GLM/MiniMax 执行层仍更便宜，Astra 适合做规划与复核 |
| **安全研究/红队** | **等待 Daybreak 权限** | 首发版拒绝 PoC，宽松版需申请 |
| **个人轻量使用** | **Plus 已含，无需额外付费** | 先用默认额度跑通，再决定是否加购 credit |

> 一句话选型观：**Astra 买的是“一次做对”的能力与对齐，不是“每百万 token 最便宜”。** 高价值、长链条、易出错的任务上 Astra 的综合成本可能更低；高吞吐、低推理的批量任务上，仍可用便宜模型做执行。

---

## 五、局限与冷思考：别被“AGI 时代”带偏

1. **AGI 的定义权之争**：OpenAI 的“AGI 时代”是公司叙事，评测上 Astra 仍在 GPQA、Humanity's Last Exam（with tools 57.2% vs Claude Fable 5.1 的 65.0%）等项落后于竞品，通用性未一统江湖。
2. **网络安全双刃剑**：100% ExploitBench 意味着攻防窗口被压缩，防守方必须更快打补丁。OpenAI 自己也说监测与拦截会误伤合法任务。
3. **可监测性倒退**：思维链更短、更难审计——对需要强审计的金融、医疗场景是风险。
4. **价格与配额**：272K 以上的长输入涨价、Fast 模式 2×，对超长文档工作流要算清账。
5. **幻觉未归零**：能力幻觉从 12.2% 降至 4.2%，但仍非零，高风险决策仍需人审。

---

## 六、给三类人的落地建议

### 普通用户（ChatGPT Plus/Pro）

* 先在 ChatGPT 中把“电脑操作”“网页浏览”类任务交给 Astra：订票、填表、整理相册、做简历网站，观察其“先问关键问题，再用合理假设推进”的协作风格；
* 涉及法律、财务的输出，利用其“区分已确立事实与未支撑假设”的特性，要求它标出不确定处。

### 开发者（API）

* **迁移路径**：把 `model: "gpt-6-astra"` 与 `reasoning_effort: medium/high` 组合测试，FrontierCode 提示词官方建议加上“避免无谓新建测试文件、复用工具、遵循仓库约定”等 developer message；
* **长上下文**：把 MRCR 作为健康检查，>272K 时注意计费档位，利用缓存写入/命中降低重复 system prompt 成本；
* **Codex 用户**：在 `config.toml` 中开启跨窗口 notes 的实验开关，评估长会话召回率。

### 企业与团队

* 默认关闭是安全设计——先在沙盒工作区启用，配置 Auto-Review 与人工复核；
* 若需 PoC/漏洞验证能力，提前申请 Daybreak 白名单；
* 合规敏感客户评估 ZDR + Private Safety Processing 的组合。

---

## 写在最后

> Astra 在英文化境里是“星”，在 OpenAI 的叙事里是“下一代智能的起点”。它确实在电脑操作、长上下文、数学与网络安全上把天花板抬高了一大截，也把“对齐”的底线抬高了——0% 蜜罐误触、0% 绕过审查、更少幻觉。

但“欢迎来到 AGI 时代”更像一个路标，而非终点。正如 EpochAI 的 Greg Burnham 所言：“一个时代的结束，另一个时代的开始。”——**Astra 结束的是“模型只负责回答”的时代，开启的是“模型负责把事做完”的时代。** 能否真正把事做对、做得可审计、做得负担得起，还要在未来数月的真实工作流里验证。

---

### 参考资料

- OpenAI, [GPT-6 Astra: A new generation of intelligence](https://openai.com/index/gpt-6-astra/) (2026-09-03)
- OpenAI API Docs, [GPT-6 Astra Model](https://developers.openai.com/api/docs/models/gpt-6-astra) & [Pricing](https://developers.openai.com/api/docs/pricing)
- OpenAI, [Path to Astra](https://openai.com/index/path-to-astra/) & [System Card](https://deploymentsafety.openai.com/gpt-6-astra)
- Bloomberg / CNBC / 9to5Mac / The Decoder / Artificial Analysis / quantum位 对 Astra 发布的综合报道（2026-09-04）
- 范伟彬《[GPT-6 Astra 发布：开发者该关心的六件事](https://fanweibin.cn/posts/2026-09-04-openai-gpt-6-astra-fabu-jishu-jiexi)》对定价与 reasoning_effort 的梳理

*数据截点：2026-09-04；模型与价格随官方调整，落地前请以 OpenAI 官方文档为准。*

