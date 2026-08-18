# 国内大模型集体涨价？普通用户该何去何从

> **数据截点：2026 年 8 月 18 日。** 本文比较的是个人开发者最常买的网页会员、Coding Plan 和 API 入口，不是企业合同价。美元价格只做横向参考，人民币粗略换算按 1 美元≈6.8 元，未计税费、支付渠道费和地区差异。模型、额度和限流都可能调整，购买前应再打开官方页面确认。

![国内大模型订阅价格与性能对比封面](https://zhoujungis.github.io/photos/ai-subscription-price-2026-08-18.png)

## 先说结论

- **预算在 50 元左右、主要在国内写代码：选 GLM Lite。** 价格低、中文工具链和支付门槛友好，但它是 Coding Plan，不是通用 API，额度按 5 小时和每周刷新。
- **预算约 10 美元、愿意用终端：OpenCode Go 是当前最灵活的编程入口。** 它不是一个模型，而是把 GLM、Kimi、MiniMax、DeepSeek 等经过筛选的模型装进一个订阅；代价是每个模型有不同的消耗速度，不能理解成“所有模型无限用”。
- **日常办公、写作、搜索、图片和代码都要：ChatGPT Plus 或 Claude Pro 更省心。** Plus 的工具整合更完整；Claude Pro 对复杂代码和长任务更有吸引力，但两者都不会公布一个可以精确换算成 token 的固定月额度。
- **需要大量文本/代码调用：MiniMax Plus 的账面额度最大，DeepSeek Flash 的单位价仍低，但 DeepSeek 8 月调价后已经不再是无条件的最低价。** 稳定复用长前缀、能把任务放在低峰时段，才吃得到 DeepSeek 的成本优势。
- **追求最强一次成功率：Claude Opus 5 和 GPT-5.6 Sol 仍在第一梯队。** Opus 更适合深度代码审查和长程执行，GPT 的速度、工具和办公生态更完整；二者都不适合作为“便宜的无限 API”。

## 一张表看懂价格和用量

下表把“订阅价格”和“实际可用量”放在同一张表里。不同产品的计量单位不同，不能直接拿一次 prompt 与一百万 token 做除法，所以“用量”保留官方原始口径。

| 产品/入口 | 月费 | 官方用量口径（截至 8 月 18 日） | 能用什么 | 适合谁 |
|---|---:|---|---|---|
| **DeepSeek API** | 无月包，按量 | V4 Flash：缓存命中/未命中/输出，低峰 **$0.007/$0.22/$0.66**，高峰 **$0.014/$0.44/$1.32**；V4 Pro：**$0.022/$0.66/$1.98**，高峰 **$0.044/$1.32/$3.96**（每百万 token） | V4 Flash、V4 Pro，1M 上下文 | 自己接应用、能控制缓存和时段的人 |
| **GLM Coding Plan** | Lite ¥49；Pro ¥149；Max ¥469 | 5 小时积分：2,000/12,000/28,000；每周：10,000/60,000/140,000。GLM-5.3 在 90.9% 缓存命中率下约为 **0.43–0.87 亿、2.63–5.26 亿、6.13–12.26 亿 token/周** | GLM-5.3、GLM-5-Turbo、GLM-4.7；支持 OpenCode、Claude Code、Cursor 等指定工具 | 国内 Coding Agent、中文项目、想固定预算的人 |
| **Kimi 会员** | Moderato $19；Allegretto $39；Allegro $99；Vivace $199 | Agent 额度 60/150/360/720；Kimi Code 为 1×/5×/15×/30×；所有功能共用额度池，另有 Kimi Code 的 5 小时/每周速率限制 | K2.6 聊天免费不扣额度；K3、Kimi Code、Work、Deep Research、PPT、Claw 等 | 长文档、研究、中文办公和 Agent 工作流 |
| **MiniMax Token Plan** | Plus $20；Max $50；Ultra $120 | M3 参考额度约 **17 亿/51 亿/125 亿 token/月**；并发 Agent 约 3–4/4–5/6–7；文字、图片、语音、音乐共享额度 | M3、M2.7、图像、语音、音乐；Max/Ultra 另含每日视频 | 高频代码加多模态，能接受共享额度的人 |
| **OpenCode Go** | 首月 $5，之后 $10 | 全局 5 小时价值上限 $12、每周 $30、每月 $60；示例：5 小时内 GLM-5.2 约 880 次、Kimi K3 110 次、MiniMax M3 3,200 次、DeepSeek V4 Flash 31,650 次 | 经过验证的一组开源/开放模型，可接 OpenCode 或其他 Agent | 想在多个模型间切换的编程用户 |
| **ChatGPT Plus / Pro** | Plus $20；Pro $100（5×）或 $200（20×） | Plus 是扩展额度；Pro 按 Plus 的 5×或 20×给额度。文本聊天在合理使用政策下可持续使用，但高级模型、Codex、深度研究都有独立限制 | GPT-5.6 系列、Codex、深度研究、文件、图像、桌面 Work 等 | 一站式办公、研究、代码和多模态 |
| **Claude Pro / Max（Opus）** | Pro $20（月付；年付折合 $17）；Max 5× $100；Max 20× $200 | Pro 为标准用量；Max 是每个 5 小时窗口的 5×或 20×，另有周限额。Opus 5 在 Pro/Max 可用，具体消息数随上下文和模型动态变化 | Claude Opus 5、Sonnet 5、Claude Code、Research、Cowork 等 | 复杂代码、审查、长程 Agent 和高可靠输出 |

官方页面： [DeepSeek 价格](https://api-docs.deepseek.com/quick_start/pricing)、[GLM Coding Plan](https://docs.bigmodel.cn/cn/coding-plan/overview)、[Kimi 价格](https://www.kimi.ai/zh-hans/help/membership/membership-pricing)、[MiniMax Token Plan](https://platform.minimax.io/subscribe/token-plan?tab=individual__monthly)、[OpenCode Go](https://opencode.ai/docs/go/)、[ChatGPT 定价](https://chatgpt.com/pricing/)、[Claude 定价](https://claude.com/pricing)。

## DeepSeek：涨价之后，便宜仍然成立吗？

DeepSeek 现在更像一个**低价 API 供应商**，而不是一个有明确月额度的会员产品。V4 Flash 和 V4 Pro 都是 1M 上下文，缓存命中、缓存未命中和输出分开计费；这意味着 Coding Agent 的真实账单取决于三个变量：系统提示是否稳定、上下文能否命中缓存、请求发生在峰时还是低峰。

8 月 17 日起生效的价目，把之前的低价促销与正式价区分开。以每百万 token 计，V4 Pro 低峰是输入缓存命中 $0.022、未命中 $0.66、输出 $1.98；高峰全部翻倍。V4 Flash 低峰为 $0.007、$0.22、$0.66。缓存命中价的涨幅最夸张，但它原本也低得不寻常；对一个没有长前缀复用的短问答应用，真正需要关注的是未命中输入和输出。

一个社区用户把 7 月 19 日至 8 月 16 日的 **40.2 亿 token、18,445 次请求**按新价重算：原来约 $53.38；全部低峰约 $130.48，全天平均约 $168.53，全部高峰约 $260.95。这个案例不是官方承诺，而是说明“价格涨了多少”不能只看某一行：缓存率和时间分布会决定最终账单。[重算数据与公式](https://www.reddit.com/r/DeepSeek/comments/1vqm15m/deepseek_v4_pricing_change_repricing_28_days_of/)

**性能上怎么用？** V4 Pro 更适合规划、复杂推理和审查；V4 Flash 更适合执行、批量改文件和高并发。独立的 Revelo Code Index 小样本测试中，V4 Flash 在四项代码任务的综合通过率高于 V4 Pro，但这不代表 Flash 在所有问题上都更聪明，而是它更快、更便宜，且测试 harness、模型版本和上下文设置都会影响结果。[Revelo Code Index](https://research.revelo.com/code-index/)

我的判断是：**DeepSeek 仍适合做“便宜执行层”，不适合在不看账单的情况下承担所有长上下文 Agent。** 能安排低峰、能稳定命中缓存，或者通过 OpenCode Go 使用，性价比仍然很高；否则 GLM Lite、OpenCode Go 甚至 MiniMax Plus 都可能更容易做预算。

## GLM：涨价后的 Coding Plan，买的是额度和本地体验

GLM 的变化不是单纯把月费乘以一个系数，而是重新设计了档位、模型和额度。当前国内版为 Lite ¥49、Pro ¥149、Max ¥469；旧用户迁移、首购优惠和海外 Z.AI 价格不能混在一起比较。所有套餐支持 GLM-5.3、GLM-5-Turbo、GLM-4.7，历史模型调用会自动切到新版本。[官方套餐说明](https://docs.bigmodel.cn/cn/coding-plan/overview)

GLM 采用 **5 小时滚动额度 + 每周额度**。更容易被忽略的是高峰时段：工作日 14:00–18:00（UTC+8）按基础积分扣除，非高峰按 50% 抵扣。因此 Lite 的“每周 token 参考值”不是一个固定数字，而是 0.43–0.87 亿；Pro 和 Max 也有同样的双倍区间。套餐用完后不会自动从普通 API 余额继续扣，而要等下一个 5 小时周期恢复。

这套设计对国内开发者有三个优点：人民币支付、国内网络和中文仓库工具支持；缺点也很明确：**它只能在官方指定工具中使用，不能把 Coding Plan Key 当作普通 API Key 分发给自己的 SaaS。** 如果你每天只改一个中小型仓库，Lite 足够；连续跑多个 Agent 或大型单体项目，Pro 的额度更合理；Max 只有在每天都把 5 小时和周额度吃满时才有经济意义。

在性能上，GLM-5.2 的公开结果仍是判断 GLM-5.3 的最好基线：智谱官方报告给出的 Terminal-Bench 2.1 为 81.0，接近 Opus 4.8 的 85.0；但这是厂商测试，不能直接当成第三方排行榜。Revelo 的独立小样本中，GLM-5.2 综合通过率约 30.8%，低于 Kimi K3，但成本也低很多。**GLM 的价值不是“每项都第一”，而是中文需求理解、工具接入和固定月费的综合平衡。**

## Kimi：功能最全，但“额度池”比价格更重要

Kimi 的四档会员已经从单纯聊天会员变成工作空间订阅：Moderato $19、Allegretto $39、Allegro $99、Vivace $199。Agent、PPT、深度研究、Kimi Code、Work、Claw 和其他功能共用一个额度池；K2.6 在聊天中对所有用户免费且不扣额度，K3 则从 Moderato 起可用，Allegretto 才解锁 1M 上下文。[Kimi 方案概览](https://www.kimi.ai/zh-hans/help/membership/membership-overview)

因此 Kimi 的“60/150/360/720 Agent 额度”只是典型任务的折算，不是固定请求次数。一次复杂研究报告、一次网页部署和一次代码 Agent 可能消耗完全不同的 token；Kimi Claw 的云主机还会持续消耗一部分额度。若你主要聊天，免费 K2.6 已经能覆盖很多需求；若你需要研究、文档和代码来回切换，Allegretto $39 是比较均衡的档位；只为纯代码买 Vivace，通常不如 OpenCode Go 或 Claude Code 划算。

Kimi K3 的特点是超大规模、1M 上下文和长程工程任务。独立测试里，它的综合通过率和成本位于“中间档”：比 GLM-5.2、MiniMax M3 更强，但速度偏慢；厂商自己的对比也承认不同 harness 会改变结果。它更适合**长上下文、中文知识工作和需要多轮 Agent 记忆的项目**，不适合只看每美元能发多少次请求的用户。

## MiniMax：M3 的额度很大，但多模态会抢同一口“水池”

MiniMax M3 时代的 Token Plan 是 Plus $20、Max $50、Ultra $120。官方按 M3 使用量给出约 17 亿、51 亿、125 亿 token/月的参考值，且文字、图像、语音、音乐共享同一个额度池；Max 和 Ultra 还包含每日视频生成，Agent 并发分别约 3–4、4–5、6–7。[MiniMax 官方月付套餐](https://platform.minimax.io/subscribe/token-plan?tab=individual__monthly)

MiniMax 的账面 token 远超多数聊天会员，但不能把它当成“125 亿 token 随便调用”：官方同时设置 5 小时滚动和每周窗口，高峰时段会动态限流，未使用额度不结转；复杂 Agent 的一次请求还会包含多轮工具调用。也就是说，**只做代码时 Plus 很便宜，代码、图片、语音、音乐混用时，额度会比想象中更快消失。**

M3 的优势是长上下文、Agent 并发和多模态一体化。Revelo 测试里它的代码通过率落后于 Kimi K3、GLM-5.2 和 DeepSeek Flash，但单次成本更低；它更像“高吞吐执行模型”，不是每个高难度规划任务的首选。对做 OpenClaw、自动化脚本和多模态原型的人，Max 是比 Ultra 更合理的甜点位；Ultra 只有在并发和视频额度都确实需要时才值得。

## OpenCode：不是模型，是把价格和模型拆开的渠道

OpenCode 有两条容易混淆的产品线：

1. **OpenCode Zen** 是按请求/按 token 付费的模型网关，官方会测试模型与供应商组合，用户也可以自带 OpenAI、Anthropic 或国内厂商的 Key。
2. **OpenCode Go** 是 $10/月订阅（首月 $5），给一组开源模型统一的使用上限：5 小时价值 $12、每周 $30、每月 $60。[Go 的官方额度说明](https://opencode.ai/docs/go/)

Go 的用量不是“每个模型各有一份额度”。官方示例显示，5 小时内 GLM-5.2 约 880 次、Kimi K3 约 110 次、MiniMax M3 约 3,200 次、DeepSeek V4 Flash 约 31,650 次。贵模型的请求数少，是因为额度按模型的美元成本折算；达到上限后可以切换免费模型，或打开 Zen 余额继续付费。

这解释了为什么 OpenCode Go 的性价比很高：你用 $10 买到的是一个**可切换的模型篮子、稳定的 Agent 接入和统一的账单上限**，而不是某一个模型的无限量。主要写代码、愿意在规划模型和执行模型之间切换，Go 是本次比较的第一推荐；只想要一款中文模型，直接买 GLM Lite 更简单。

## ChatGPT 与 Claude Opus：贵在“产品完成度”，不是 token 单价

### ChatGPT

ChatGPT Plus 为 $20/月；Pro 分为 $100（Plus 的 5 倍用量）和 $200（20 倍用量）。Plus/Pro 的核心价值包括 GPT-5.6 系列、Codex、深度研究、文件和图像工具、项目与任务，而不是一个公开的 API token 包。[OpenAI Pro 档位说明](https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers) [ChatGPT 定价页](https://chatgpt.com/pricing/)

如果你每天要写邮件、读 PDF、做表格、查资料、生成图，再偶尔改代码，Plus 的综合性价比很高。若你的主要工作是持续跑 Codex，Plus 的高级工具限制会比网页聊天更快触顶，Pro $100 是更合适的升级；$200 只有在并行项目、长时间深度研究和高强度 Codex 都是日常工作时才合理。ChatGPT 的限制按产品、模型和时间窗口分别计算，不能用“无限文本聊天”推导出 Codex 无限。

### Claude Opus

这里的 Opus 是模型，不是独立订阅。Claude Pro 月付 $20（年付折合 $17），Max 5× 为 $100，Max 20× 为 $200；Max 的 5×/20×是相对于 Pro 的每个 5 小时会话容量，且有周限额。[Claude Max 官方说明](https://support.claude.com/en/articles/11049741-what-is-the-max-plan) [Claude 计划比较](https://claude.com/pricing)

在产品体验上，Claude Code 的终端工作流、代码审查、跨文件修改和长任务稳定性仍是 Opus 的强项。Revelo 的 80 任务综合测试中，Claude Opus 5 通过率 57.1%，GPT-5.6 Sol 为 51.2%；但 Opus 每个任务平均成本约 $6.44，GPT 约 $2.05，Kimi K3 约 $1.12。这个结果说明 Opus 的优势是成功率和可靠性，不是便宜。[Revelo Code Index 的方法和结果](https://research.revelo.com/code-index/)

如果只偶尔让 Claude 帮忙，Pro $20 已经能体验 Opus；如果它是每天工作的主 Agent，Max 5× $100 是最低的“不断流”档位。Claude API 的 Opus 5 标准价格为输入 $5、输出 $25/百万 token，和月费订阅是两套账，不能混算。[Anthropic 模型价格](https://claude.com/pricing)

## 性能不能只看一张排行榜

截至 8 月 18 日，一个比较有参考价值的独立代码测试是 Revelo Code Index：80 个任务、四个子基准、每个任务三次试跑。其综合结果如下：

| 模型 | 综合通过率 | 单任务平均成本 | 读法 |
|---|---:|---:|---|
| Claude Opus 5 | 57.1% | $6.44 | 成功率最高，价格也最高 |
| GPT-5.6 Sol | 51.2% | $2.05 | 速度和成本更均衡 |
| Kimi K3 | 39.6% | $1.12 | 长任务和中文较强，速度较慢 |
| GLM-5.2 | 30.8% | $1.86 | Coding Plan 里更适合中文工具链 |
| DeepSeek V4 Flash 0731 | 30.4% | $0.14 | 执行层性价比突出 |
| MiniMax M3 | 17.9% | $0.76 | 多模态/并发价值高于纯代码得分 |
| DeepSeek V4 Pro | 19.6% | $1.52 | 更重的推理并没有在该测试中转化为更高通过率 |

这张表有三个限制：第一，GLM-5.3、DeepSeek 8 月新版本和 Opus 5 的服务端配置仍在变化；第二，不同模型使用了各自官方推荐的 Agent harness；第三，代码通过率不能代表写作、事实问答、视觉、中文表达或企业合规。因此本文把它当作**成本—代码成功率的一个坐标系**，不是“谁永远第一”的宣判。

## 按场景给出购买方案

### 1. 学生、个人博客、轻量编程

首选 **GLM Lite ¥49** 或 **OpenCode Go 首月 $5**。前者适合国内环境和中文仓库，后者适合尝试多个模型。DeepSeek API 可以作为零月费补充，设置余额上限并把重复前缀缓存起来。

### 2. 每天写代码，但预算控制在 150 元以内

推荐 **OpenCode Go + DeepSeek Flash/GLM 执行与规划分工**。规划用 GLM 或 Kimi，执行用 Flash/MiniMax；不要把所有请求都丢给 Kimi K3 或 DeepSeek Pro。若不想折腾模型切换，直接 GLM Pro ¥149。

### 3. 写代码之外还要研究、表格、图片和会议材料

推荐 **ChatGPT Plus $20**。它的价值在工具整合和跨任务上下文，而不是单项代码榜第一。Google AI Pro 同样是 $19.99/月，适合已经深度使用 Gmail、Docs、Drive、NotebookLM 的用户，但中国大陆的可用性和支付方式要单独确认。[Google AI Pro 官方说明](https://one.google.com/about/plans)

### 4. 大型仓库、复杂重构、代码审查

推荐 **Claude Pro $20 起步，频繁使用再升 Max 5× $100**；若希望把规划、执行、审查拆给不同模型，选择 OpenCode Zen 按量付费更灵活。Opus 的单次成功率更值得为高风险代码买单，但不应把它当成高吞吐批处理模型。

### 5. 多模态和 Agent 并发

推荐 **MiniMax Plus/Max**。它把 M3、图像、语音、音乐和视频放进一个额度池，适合原型和自动化；如果 90% 的工作只是文本代码，MiniMax 的多模态权益会变成你付费却用不到的“附赠品”。

## 最终排序：按“性价比”而不是按“最强”

1. **纯编程、低预算：OpenCode Go**
2. **国内中文编程：GLM Lite / Pro**
3. **通用生产力：ChatGPT Plus**
4. **复杂代码可靠性：Claude Pro，重度再上 Max 5×**
5. **多模态 Agent：MiniMax Plus / Max**
6. **长文档和中文研究：Kimi Allegretto**
7. **API 批量调用：DeepSeek Flash 低峰；复杂任务只在必要时用 Pro**

一句话总结：**8 月 18 日以后，最优解不是“买最强的一个”，而是用固定月费控制 Agent 的上限，用便宜模型执行，用 GLM/Kimi/ChatGPT/Opus 做规划和复核。** DeepSeek 的涨价提醒了所有人：缓存、峰谷时段、上下文长度和工具调用，才是 AI 账单里真正需要计算的变量。

### 参考资料

- [DeepSeek Models & Pricing](https://api-docs.deepseek.com/quick_start/pricing)
- [DeepSeek V4 技术与模型说明](https://api-docs.deepseek.com/news/news260424/)
- [智谱 GLM Coding Plan 套餐概览](https://docs.bigmodel.cn/cn/coding-plan/overview)
- [Kimi 会员价格详情](https://www.kimi.ai/zh-hans/help/membership/membership-pricing)
- [MiniMax Token Plan 月付价格](https://platform.minimax.io/subscribe/token-plan?tab=individual__monthly)
- [OpenCode Go 用量限制](https://opencode.ai/docs/go/)
- [OpenAI ChatGPT Pro 档位](https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers)
- [Anthropic Claude 计划与模型价格](https://claude.com/pricing)
- [Revelo Code Index](https://research.revelo.com/code-index/)
