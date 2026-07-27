# 从 vLLM 到 SGLang：LLM 推理框架的终极内卷

![LLM 推理框架演进](https://images.unsplash.com/photo-1620712943543-bcc967d681bf?w=1600&q=80&auto=format&fit=crop)

> 当训练框架的竞争逐渐收敛，战火正在向推理侧全面转移。一篇论文、一个 PR、一次 commit，都可能让某个框架在一夜之间吞吐翻倍——这就是 2025–2026 年 LLM 推理生态的日常。本文把 vLLM、SGLang、TensorRT-LLM、TGI、LMDeploy 放在同一张桌子上，看清它们各自押注的是什么，又在"内卷"什么。

---

## 引言：推理框架为何成了"兵家必争之地"

过去三年，大模型的故事是"**炼**"出来的：谁的参数大、谁的数据多、谁的卡多，谁就赢。但当 Scaling Law 把训练成本推到亿万美金量级，行业的注意力开始转向另一个战场——**推理**。

三个变化让推理框架一夜之间成了核心赛道：

1. **模型变得巨胖**：GPT-4o、DeepSeek V4、Kimi K2、GLM-5.2 动辄数百乃至千亿 MoE 参数，单个 token 的算力开销随专家数线性膨胀；
2. **调用频次爆炸**：Agent 范式让一次"对话"变成几十上百次往返，推理 QPS 比 ChatGPT 早期高出几个数量级；
3. **端到端成本倒挂**：训练是一次性投入，推理是持续支出——按 Gartner 的口径，大模型全生命周期里 70%–80% 的算力花在推理。

一句话：**训练决定能不能上场，推理决定能活多久。** 这就是为什么 vLLM 背后的公司从一块白板变成几十人团队、SGLang 不到两年圈走数亿美金融资、英伟达每代 TensorRT-LLM 都要重写一次内核。

---

## 一、推理框架到底在"卷"什么

把所有口号去掉，推理框架要回答的其实是三个问题：

| 维度 | 通俗解释 | 为什么难 |
|------|---------|---------|
| **吞吐（Throughput）** | 一台机器一秒钟能吐多少 token | 直接决定单卡 ROI |
| **延迟（Latency）** | 用户按下回车到看到第一个字要等多久 | 直接决定产品体验 |
| **显存（Memory）** | 一张 H100 能同时侍候多少请求 | 显存是 HBM 物理馈赠，省一寸是一寸 |

吞吐和延迟天然是一对矛盾：批越大、吞吐越高，但每个请求都要等批凑齐，延迟就涨。所有框架的"工程内卷"，本质上都是在这三者的三角关系里寻找新的 Pareto 前沿——把别人认为不可能的折中点，变成可能。

下面看五家是怎么各自出招的。

---

## 二、vLLM：用 PagedAttention 开山的那一刀

**vLLM** 出现之前，KV Cache 浪费是推理框架的"房间里的大象"。

传统做法按"最长可能序列"为每个请求预分配一块连续显存。真实请求长度天差地别——10% 长请求吃掉 80% 预留显存、短请求留下一堆空洞。结果就是：**显存碎片化 + 利用率不到 40%**，一台 80G H100 撑死的并发数被显存先卡死。

vLLM 的贡献是把操作系统的**分页虚拟内存**搬进了 GPU：

- KV Cache 被切成固定大小的 **block**（通常 16 token 一块）；
- 一个逻辑序列由一张 **block table** 指向物理块，物理块可以离散、可以共享、可以按需分配；
- 类似 OS 的 page，逻辑相邻 ≠ 物理相邻，碎片被自然消解。

配合 **PagedAttention** 的 kernel 重写，让 attention 的 K/V 直接从离散 block 读取——这是工程上最硬的一刀。

> vLLM 在 2023 年的论文里报告：**吞吐相比 HuggingFace Transformers 提升 2–24 倍**。关键词："**Continuous Batching**"——动态把新请求塞进正在跑的 batch，不让 GPU 因为某个请求早结束而空转。

**vLLM 的位置**：通用、易用、生态最厚。几乎所有开源模型发布当天都有 vLLM 适配。代价是：在结构化生成、长上下文、离散批处理等窄场景，它不是最快的那一个。

---

## 三、SGLang：RadixAttention 与"结构化生成"的新范式

**SGLang** 由 LMSYS 团队（Vicuna、Chatbot Arena 的同一拨人）2024 年发布，瞄准的不是"通用推理"，而是一个被忽视的场景——**结构化输出**。

诚实点说：让 LLM 生成一个合法 JSON、一段 SQL、一个 tool call 的 schema，传统框架做得很糟。原因有三：

1. **约束解码**（constrained decoding）每一步要 mask 掉非法 token，开销不小；
2. **共享前缀**没被复用——10 个请求都从"你是一个翻译助手"开头，框架却把这同一个前缀算 10 遍；
3. **分支生成**天然浪费——一次"多候选答案 / 多个 tool 调用"要起多个独立 KV Cache。

SGLang 的招数是把 KV Cache 组织成一棵 **Radix Tree（基数树）**：

- 树的每条边对应一段 token，节点存这段 token 的 KV；
- 共享前缀的多个请求自动复用同一棵子树——**前缀缓存第一次有了数据结构层面的 native 支持**；
- 结构化生成的多候选分支（"给我 3 条不同的翻译"）直接挂在树上，分支节点共享根，重复计算被消除。

配合 **Zero-Overhead Scheduler** 和 **压缩有限状态机（Compressed FSM）**，SGLang 在 JSON/SQL/函数调用场景报告：**比 vLLM 快 3–7 倍**，端到端平均 5 倍提升。

> SGLang 的真正杀手锏不是单点速度，而是把"**生成是有结构的、可重用的**"这件事写进了底层抽象。一旦你的应用是 Agent / 工作流 / 多轮工具调用，SGLang 的优势会被指数放大。

**SGLang 的位置**：长上下文、结构化输出、共享前缀、多分支生成——所有 vLLM 不擅长的窄场景，SGLang 在重新定义基线。

---

## 四、横向对比：五个主流框架怎么选

把五个常被点名的框架放在同一张表格里看：

| 框架 | 阵营 | 核心技术 | 最强场景 | 短板 |
|------|------|---------|---------|------|
| **vLLM** | UC Berkeley / 资本独立 | PagedAttention + Continuous Batching | 通用开源模型、易部署、生态最厚 | 结构化生成、长上下文不是最强 |
| **SGLang** | LMSYS / 商业化 | RadixAttention + 压缩 FSM + 零开销调度 | 结构化输出、共享前缀、Agent 工作流 | 通用起步略晚，社区比 vLLM 小 |
| **TensorRT-LLM** | 英伟达 | 算子融合 + In-flight Batching + INT8/FP8 | 英伟达硬件、极致延迟、企业 RAG | 绑卡、改 kernel 难、非 NV 硬件用不上 |
| **TGI** | Hugging Face | Continuous Batching + 量化 | HF 生态、Dock 化部署、欧洲市场 | 性能常落后 vLLM 半个版本，迭代慢 |
| **LMDeploy** | OpenMMLab / 上海 AI 实验室 | TurboMind kernel + KV 量化 | 国产硬件适配、量化、中文社区 | 国际生态薄，模型覆盖不如 vLLM |

> 三句话定性：
> - 想最快 deploy 起来 → **vLLM**
> - 写 Agent / tool calling 大量 → **SGLang**
> - 必须把延迟压到个位数 ms 且只跑 NV 卡 → **TensorRT-LLM**

下面把"内卷"的四个焦点技术拆开看，因为这五家卷的就是这四件事。

---

## 五、内卷焦点之一：KV Cache 管理

KV Cache 是推理显存里的大头——序列越长占得越多、batch 越大占得越多。

| 方案 | 代表 | 思路 | 代价 |
|------|------|------|------|
| **PagedAttention** | vLLM | OS 式分页 + block table，离散分配消除碎片 | kernel 需要重写 |
| **RadixAttention** | SGLang | KV 组织成基数树，前缀天然复用 | 写入路径更复杂 |
| **PagedAttention-MoE / Cache 池化** | 英伟达 / 工业实践 | 跨请求、跨 expert 复用 KV | 需要硬件一致性支持 |

值得单独说的行业趋势是 **Prefix Cache**——把系统提示词、长文档前缀的 KV 持久化在显存或 host memory，跨请求复用。vLLM 在 2024 年底加上了 `--enable-prefix-caching`，SGLang 从 day 1 就把这写进了数据结构。在 RAG、tool calling、长 system prompt 场景，**Prefix Cache 能直接把首 token 延迟砍掉 60% 以上**，这是当前最热的优化方向之一。

---

## 六、内卷焦点之二：Continuous Batching 与调度器

传统 batch 是静态的——凑齐 N 个请求才开始，跑完才放下一批，GPU 大量"等批"时间。

**Continuous Batching** 让正在进行的 batch 可以动态进出：

- 一个请求生成完毕立刻退出，释放显存；
- 新请求立刻被塞进剩余 slot，GPU 几乎不空转；
- 配合 iteration-level 调度，Prefill（首遍算 KV）和 Decode（逐 token 生成）甚至可以混批。

```text
传统批处理：
  [A,B,C] ──────────── 等齐 ────────────► [done]   [D,E] ───►
       ↑ 长尾请求 C 拖累整批，GPU 空闲区段多

连续批处理：
  [A,B,C      ] ─► [A,B,C,D] ─► [  B,D,E,F] ─► [     D,E,F]
       A 提前结束 → D 立刻顶上 → E,F 顺次进入 → GPU 利用率逼近上限
```

更深一卷的方向是 **Disaggregated Prefill / Decode**——把 Prefill 和 Decode 分到不同 GPU/集群：

- Prefill 是 compute-bound，适合"猛算"卡；
- Decode 是 memory-bandwidth-bound，适合"高带宽"卡；
- 分开后两类卡各跑最擅长的活，整体吞吐再上一个台阶。vLLM、SGLang、TRT-LLM 都在 2025–2026 跟进了这条路。

---

## 七、内卷焦点之三：投机解码与推测采样

LLM 自回归每个 token 都要把整个模型前向一遍，**算力浪费在"猜一个字"上**。投机解码的思路是：

1. 用一个小模型（draft model）快速"猜"K 个 token；
2. 用大模型一次性并行验证这 K 个 token（一次前向 = K 个候选）；
3. 猜对的直接采纳，猜错的回退重算。

**收益**：在分布接近的 draft/target 配对下，2–3 倍端到端加速。

| 变体 | 思路 | 代表实现 |
|------|------|---------|
| **Vanilla Speculative Decoding** | 小模型猜、大模型验 | vLLM、TGI、TRT-LLM 都已支持 |
| **N-gram / Prompt Lookup** | 不用小模型，直接从 prompt 里 n-gram 查找候选 | vLLM `--speculative-model "[ngram]"` |
| **EAGLE-2 / EAGLE-3** | 用特征向量层的 draft，接受率拉到 60%+ | SGLang、vLLM 社区集成 |
| **Medusa** | 加多个 head 并行猜多 token | TRT-LLM |

> 投机解码是当前最有"性价比"的加速手段：不动模型权重、不改训练、只在推理侧加几行调度，吞吐就能翻倍。这也是为什么**几乎所有主流框架在 2025 年都把"支持某种投机解码"列入了 release notes 的第一行**。

---

## 八、内卷焦点之四：量化

量化的本质是用更少的位宽表示同一份权重和激活，把显存喝干喝净。

| 量化方案 | 位宽 | 是否需要校准 | 精度损失 | 谁支持得最好 |
|---------|------|------------|---------|------------|
| **GPTQ / AWQ** | INT4/INT8 | 是 | 中等 | vLLM、LMDeploy、TGI |
| **SmoothQuant** | INT8 | 是 | 小 | TRT-LLM、LMDeploy |
| **FP8**（H100 后） | E4M3 / E5M2 | 否 | 极小 | TRT-LLM、vLLM 0.6+ |
| **INT4 GEMM (W4A16)** | INT4 权 / FP16 激 | 是 | 中等 | TRT-LLM、LMDeploy TurboMind |

值得单独强调的是 **FP8**：

- H100 / H200 原生支持 FP8 Tensor Core，**算力密度比 FP16 高 2 倍**；
- 几乎无需校准、精度损失在评测误差内；
- 2025 年起成了"**基础设施级**"的默认选项——vLLM 0.6+ 一行参数开启，TRT-LLM 直接做默认。

一句话：FP8 之前的量化是"省显存但不一定快"，FP8 之后是"**既快又省**"。这是英伟达硬件对推理生态送的一份大礼。

---

## 九、选型建议：什么场景该押哪张牌

| 你的场景 | 推荐框架 | 理由 |
|---------|---------|------|
| 通用 chat / 兼容所有 HuggingFace 模型 | **vLLM** | 生态最厚、模型覆盖最全、社区响应最快 |
| Agent / tool calling / 大量 JSON 输出 | **SGLang** | RadixAttention 复用前缀，结构化生成快 3–7 倍 |
| 长上下文 RAG + 共享系统提示 | **SGLang 或 vLLM + Prefix Cache** | KV 复用直接把首 token 延迟砍一半 |
| 全英伟达集群、企业 SLA、要个位数 ms | **TensorRT-LLM** | 算子融合 + FP8 是延迟的下限 |
| 国产卡（华为 / 沐曦 / 壁仞 / 燧原） | **LMDeploy / vLLM** | LMDeploy 国产适配最齐，vLLM 开放生态广 |
| 多模态 / LLaVA / Qwen-VL | **vLLM** | 多模态分支和模型接入最快 |

> 一个经验法则：**先 vLLM 跑通，再问业务瓶颈在哪**。
> - 瓶颈在"长上下文 / system prompt 重复" → 上 Prefix Cache 或换 SGLang；
> - 瓶颈在"延迟无法再降" → 投机解码 + FP8，再不行上 TRT-LLM；
> - 瓶颈在"显存" → 量化 + PagedAttention，必要时 Prefill / Decode 解耦。

---

## 十、终极内卷的方向：从"框架"变"基础设施"

把上面所有"内卷"叠在一起看，会发现一个共同趋势——推理框架正在褪掉"框架"的外壳，变成**一类基础设施**：

1. **从单机到集群**：过去的推理框架管的是单机几张卡；现在要管的是跨机的请求路由、KV 迁移、prefill/decode 分离、专家路由调度；
2. **从通用到场景化**：vLLM 不再是"任意模型任意场景"，SGLang 也不再只是"结构化生成"——每个框架都在长出**自己的领域语言**（vLLM 的 `LLMEngine`、SGLang 的 `@function`、TRT-LLM 的 builder DSL）；
3. **从软件到软硬协同**：FP8、CPO、IBGDA、NVLink C2C——硬件的每一步演进都在改写软件的优化空间。当 RDMA 把跨节点延迟砍半，Prefill/Decode 解耦的工程收益就又升一档；
4. **从推理到"推理+训练"**：DeepEP、NCCL、SGLang 的训练侧探索——让框架既懂推理也懂训练的人，未来才握得住"调度"这件事。

> 所以这场"内卷"的本质不是谁更快，而是**谁先成为大模型时代基础设施的默认选项**。vLLM 押注的是"通用统治"，SGLang 押注的是"结构化与 Agent",TRT-LLM 押注的是"英伟达全栈"，LMDeploy 押注的是"国产与量化"。

---

## 写在最后

> *推理框架的终极内卷，不是把吞吐再提高 10%，而是让"一把卡当两把卡用"成为物理馈赠之外的另一种馈赠。*

回到一开始的三个问题——吞吐、延迟、显存，过去三年的工程实践给出了这些答案：

- 当 **PagedAttention** 把显存碎片扫干净，一台机器能容纳的并发第一次有了量级跃迁；
- 当 **Continuous Batching** 让 GPU 不空转，吞吐基线被再画一次；
- 当 **RadixAttention** 把前缀写进数据结构，结构化生成从"凑合能用"变成"原生高效"；
- 当 **FP8 / 投机解码 / Prefill-Decode 解耦** 三者叠加，单 token 的边际成本被压到三年前不可想象的低位；
- 当 **生态共建** 把训练 / 通信 / 推理 / 调度拢到一个抽屉里，推理框架第一次具备了成为"基础设施"的资格。

这五件事每件都不算改写历史，但叠加在一起，已经让 2026 年部署一个千亿 MoE 模型的成本，比 2023 年部署一个 7B 模型还低。这才是这场"内卷"留给行业最有价值的遗产。

下一个三年，推理框架的故事会从"**谁更快**"转向"**谁是默认**"。至于谁能赢得那张入场券——vLLM、SGLang、还是某匹尚未冒头的黑马——这不是一篇技术文章能回答的问题。但有一件事是确定的：**单点优化已经不够，谁能把吞吐、延迟、显存、生态押在同一张牌上，谁才有可能留在这张桌子上。**

---

> 📚 **延伸阅读**
> - vLLM 论文：*Efficient Memory Management for Large Language Model Serving with PagedAttention* (SOSP 2023)
> - SGLang 论文：*SGLang: Efficient Execution of Structured Language Model Programs* (NeurIPS 2024)
> - DeepSeek-V3 技术报告：投机解码 + FP8 训练侧实践
> - 英伟达 TensorRT-LLM 官方文档与 in-flight batching 设计
>
> *本文为技术综述，引用数据来自各框架公开论文与 release notes，随版本迭代可能存在时效偏差。*