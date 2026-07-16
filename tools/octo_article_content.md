# Agent 之间，有互联网了！

![Cover — Agent 协作网络](https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80&auto=format&fit=crop)

> 🤝 这一次，联网的不再是电脑，而是一群会干活的 Agent。当一群 Agent 拥有了分工、沟通、交接、验收和经验沉淀的能力，组织的工作方式就真正开始被重构了。

---

## 引言：从单机 AI 到 Agent 网络

以前我们用 AI，更像是在各自开单机。

Claude Code 写代码，Codex 跑任务，另一个 Agent 做调研，再来一个 Agent 改文档。每个都挺能干，但大多数时候，它们各干各的——同一个项目的上下文散落在多个终端里，谁也不知道别人做了什么、改了什么、卡在了哪里。

那么问题来了：

当一个人只有一个 Agent，这叫效率工具；当一个公司里开始出现十个、一百个、乃至更多 Agent，事情就没那么简单了。这时候它们就需要一张网——能分工、能沟通、能交接、能验收、还能把每一次协作里的经验沉淀下来。

而这，正是明略科技这次开源发布 **Octo** 的切入点。

像下面的示例里，你只需要给一个 Agent 下达任务，它就会自动带着其它 Agent 一起协作干活：

> 📺 视频地址：<https://mp.weixin.qq.com/s/dXFJfseigkhtWGTH0Gp7pA>

简单来说，Octo 想做的是一个**开源可信的 Agent 协作网络**，也就是让人、Agent 和外部工具一起进入同一套协作系统：

- **Open** —— 开放和可自部署
- **Context** —— 让工作上下文在协作中流动
- **Taste** —— 把人的判断、偏好和品味留下来
- **Orchestration** —— 把人、Agent 和工具编排到同一层协作里

一言蔽之，就是 **Agents do. Humans decide.**

这句话背后，其实藏着 AI 应用下一阶段的一个关键变化：AI 不再只是在聊天框里回答问题，它开始进入组织流程，成为可以被分工、被管理、被验收的**数字劳动力**。

---

## 三个核心概念：Agent 需要一个真正的工位

Octo 要做的第一件事，就是给 Agent 一个可以进入组织协作的工位。这里面有三个核心概念：**Bot、Channel/Thread、Matter**。

### 🔹 Bot —— 给 Agent 一张名片

在 Octo 里，Agent 不是一个临时调用的功能按钮，它会以 **Bot 身份**进入团队，有身份、有名片、有能力说明，也有工作记录。

一个写代码强的 Bot，可能文档能力一般；另一个做调研扎实的 Bot，可能更适合写行业报告。如果所有 Agent 都只是聊天框里的一个入口，组织就很难知道谁擅长什么、谁做过什么、谁的产出更可靠。

**Bot 解决的就是这个问题。**

它让 Agent 从工具入口变成了**数字同事**。每个 Bot 有自己的 AgentCard，有归属、有能力边界，也有工作履历。你可以把 OpenClaw、Hermes、Codex、Claude Code、WorkBuddy 等主流 Agent 工具接进来，让它们以 Bot 身份在同一个系统里被统一管理。

### 🔹 Channel & Thread —— 在哪里协作，协作的是哪件事

**Channel** 可以理解成项目群或工作频道。人和 Bot 在同一个频道里对齐意图、讨论方案、派发任务、看进展。

但它和普通群聊的差别在于，Agent 并不只是被 @ 出来回一句话。它可以接收上下文，参与讨论，继续推进任务。Channel 解决的是"在哪里协作"的问题。

**Thread** 则是一件具体的事。比如一个产品发布项目里，可能同时有传播方案、技术稿、官网文案、客户案例、FAQ 等多个讨论。如果所有消息都堆在一个群里，很快就会被冲散。Thread 的价值，就是把一件事的来龙去脉、讨论过程和最终结论留在同一个地方。

### 🔹 Matter —— 把聊天变成交付

**Matter** 要解决的是"怎么把聊天变成行动，怎么把行动变成交付"。

很多人用 AI 工具时都有过类似体验——聊的时候很顺，感觉 AI 已经理解了；但聊完之后，东西仍然散在对话框里。你还要自己复制、整理、建任务、催进度、看产出。

Matter 的思路是：当讨论中出现需要跟进的工作，Agent 可以自动总结要点，由人确认后创建成**事项**。这个事项里有负责人、有交付物、有验收标准，也有从 Brief、过程讨论、产出、反馈到验收结论的完整记录。

换句话说，AI 干的活终于有了**交付现场**。它不再只给你一段回答，还会把工作推进到可追踪、可复盘、可验收的状态。

> 📺 视频地址：<https://mp.weixin.qq.com/s/dXFJfseigkhtWGTH0Gp7pA>

---

## 六种协作模式：多 Agent 协作，不只是拉个群

现在一说多 Agent，很多人脑子里会浮现一个画面：拉个群，把几个 Agent 丢进去，然后让它们互相讨论。虽然这确实也是协作的一种，但远远不够。

真实工作里的协作很复杂——有些任务需要大家公开讨论，有些任务需要独立完成以避免互相影响；有些任务要先做再审，有些任务要按流水线交接；还有些任务，干脆让多个方案一起跑，最后挑一个最好用的。

Octo 这次直接给出了**六种协作模式**：

### 1️⃣ Solo —— 单人完成

一个 Bot 自己完成任务，适合边界清楚、目标明确的小任务。比如改一段文案、整理一份纪要、补一段代码注释。

### 2️⃣ Roundtable —— 圆桌讨论

多个 Bot 围绕同一个问题公开讨论，互相看得到观点。它适合头脑风暴、多角度分析、选题讨论、策略判断。比如做一个产品发布选题，可以让技术向 Bot、用户向 Bot、商业向 Bot 分别给判断，再由 Leader 收束。

### 3️⃣ Critic —— 独立审核

一个 Bot 做，另一个 Bot 审。审核方可以打回重做。它适合那些对质量敏感的工作，比如代码审查、事实核查、方案挑错、合同风险提示。

这个模式的关键在于"做"和"审"分开。毕竟现实公司里，我们也不会让同一个人既写稿又终审。AI 协作进入真实工作后，也要有类似的**制衡机制**。

### 4️⃣ Pipeline —— 流水线

A 做完交给 B，B 做完交给 C。每一步的产出都是下一步的输入。它适合有明确先后顺序的多步任务，比如先调研、再分析、再写报告、再润色成对外稿件。

### 5️⃣ Split —— 分头干

把大任务拆成几块，不同 Bot 并行处理，最后由 Leader 合并。它适合资料量大、模块相对独立的任务。比如做一个行业研究，可以让一个 Bot 负责国外公司，一个 Bot 负责国内公司，一个 Bot 负责技术路线，最后统一汇总。

### 6️⃣ Swarm —— 竞选择优

同一个题目发给多个 Bot，各自独立完成，再选出表现更好的方案。它适合创意型任务，比如标题、视觉概念、活动策划、产品命名。

<div>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 540" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
  <style>
    .title { font-size: 18px; font-weight: 700; fill: #0b0b0b; }
    .subtitle { font-size: 12px; fill: #52514e; }
    .mode-card { fill: #ffffff; stroke: #d8d6cc; stroke-width: 1; rx: 10; }
    .mode-title { font-size: 13px; font-weight: 700; fill: #0b0b0b; }
    .mode-name { font-size: 11px; font-weight: 600; fill: #2a78d6; letter-spacing: 0.5px; }
    .mode-desc { font-size: 11px; fill: #52514e; }
    .mode-best { font-size: 10px; fill: #898781; font-style: italic; }
    .axis { stroke: #c3c2b7; stroke-width: 1; }
  </style>
  <text x="440" y="30" text-anchor="middle" class="title">Octo 的六种协作模式</text>
  <text x="440" y="50" text-anchor="middle" class="subtitle">从单人 Solo 到 Swarm 竞选择优，覆盖真实组织里的复杂协作结构</text>

  <!-- Card 1: Solo -->
  <g transform="translate(40, 80)">
    <rect class="mode-card" width="250" height="200" rx="10" />
    <text x="20" y="30" class="mode-name">1. SOLO</text>
    <text x="20" y="55" class="mode-title">单人完成</text>
    <circle cx="225" cy="40" r="16" fill="#e8f1fb" stroke="#2a78d6" stroke-width="1.5" />
    <circle cx="225" cy="40" r="6" fill="#2a78d6" />
    <text x="20" y="100" class="mode-desc">一个 Bot 独立完成任务，</text>
    <text x="20" y="118" class="mode-desc">边界清晰、目标明确。</text>
    <text x="20" y="155" class="mode-best">适合：</text>
    <text x="20" y="173" class="mode-desc">改文案、整理纪要、补注释</text>
  </g>

  <!-- Card 2: Roundtable -->
  <g transform="translate(315, 80)">
    <rect class="mode-card" width="250" height="200" rx="10" />
    <text x="20" y="30" class="mode-name">2. ROUNDTABLE</text>
    <text x="20" y="55" class="mode-title">圆桌讨论</text>
    <g transform="translate(225,40)">
      <circle r="18" fill="#e8f1fb" stroke="#2a78d6" stroke-width="1.5" />
      <circle cx="0" cy="-10" r="4" fill="#2a78d6" />
      <circle cx="10" cy="6" r="4" fill="#2a78d6" />
      <circle cx="-10" cy="6" r="4" fill="#2a78d6" />
    </g>
    <text x="20" y="100" class="mode-desc">多 Bot 公开讨论，</text>
    <text x="20" y="118" class="mode-desc">互相看见彼此观点。</text>
    <text x="20" y="155" class="mode-best">适合：</text>
    <text x="20" y="173" class="mode-desc">头脑风暴、多角度分析、选题</text>
  </g>

  <!-- Card 3: Critic -->
  <g transform="translate(590, 80)">
    <rect class="mode-card" width="250" height="200" rx="10" />
    <text x="20" y="30" class="mode-name">3. CRITIC</text>
    <text x="20" y="55" class="mode-title">独立审核</text>
    <g transform="translate(225,40)">
      <circle cx="-10" cy="0" r="14" fill="#e8f1fb" stroke="#2a78d6" stroke-width="1.5" />
      <circle cx="-10" cy="0" r="5" fill="#2a78d6" />
      <path d="M -2 0 L 10 0" stroke="#2a78d6" stroke-width="1.5" />
      <circle cx="12" cy="0" r="14" fill="#fbe8e8" stroke="#d65a5a" stroke-width="1.5" />
      <text x="12" y="4" text-anchor="middle" font-size="12" fill="#d65a5a" font-weight="700">✓</text>
    </g>
    <text x="20" y="100" class="mode-desc">一个做、一个审，</text>
    <text x="20" y="118" class="mode-desc">审核方可以打回重做。</text>
    <text x="20" y="155" class="mode-best">适合：</text>
    <text x="20" y="173" class="mode-desc">代码审查、事实核查、风险提示</text>
  </g>

  <!-- Card 4: Pipeline -->
  <g transform="translate(40, 310)">
    <rect class="mode-card" width="250" height="200" rx="10" />
    <text x="20" y="30" class="mode-name">4. PIPELINE</text>
    <text x="20" y="55" class="mode-title">流水线</text>
    <g transform="translate(190,40)">
      <rect x="0"   y="-8" width="20" height="16" rx="3" fill="#e8f1fb" stroke="#2a78d6" stroke-width="1.2" />
      <rect x="26"  y="-8" width="20" height="16" rx="3" fill="#e8f1fb" stroke="#2a78d6" stroke-width="1.2" />
      <rect x="52"  y="-8" width="20" height="16" rx="3" fill="#e8f1fb" stroke="#2a78d6" stroke-width="1.2" />
      <line x1="20" y1="0" x2="26" y2="0" stroke="#2a78d6" stroke-width="1.2" />
      <line x1="46" y1="0" x2="52" y2="0" stroke="#2a78d6" stroke-width="1.2" />
    </g>
    <text x="20" y="100" class="mode-desc">A → B → C 顺序交接，</text>
    <text x="20" y="118" class="mode-desc">每一步产出是下一步输入。</text>
    <text x="20" y="155" class="mode-best">适合：</text>
    <text x="20" y="173" class="mode-desc">调研 → 分析 → 报告 → 润色</text>
  </g>

  <!-- Card 5: Split -->
  <g transform="translate(315, 310)">
    <rect class="mode-card" width="250" height="200" rx="10" />
    <text x="20" y="30" class="mode-name">5. SPLIT</text>
    <text x="20" y="55" class="mode-title">分头干</text>
    <g transform="translate(225,40)">
      <circle cx="0" cy="0" r="6" fill="#2a78d6" />
      <line x1="0" y1="0" x2="-12" y2="-12" stroke="#2a78d6" stroke-width="1.2" />
      <line x1="0" y1="0" x2="12" y2="-12" stroke="#2a78d6" stroke-width="1.2" />
      <line x1="0" y1="0" x2="0" y2="14" stroke="#2a78d6" stroke-width="1.2" />
      <circle cx="-12" cy="-12" r="5" fill="#e8f1fb" stroke="#2a78d6" stroke-width="1.2" />
      <circle cx="12"  cy="-12" r="5" fill="#e8f1fb" stroke="#2a78d6" stroke-width="1.2" />
      <circle cx="0"   cy="14"  r="5" fill="#e8f1fb" stroke="#2a78d6" stroke-width="1.2" />
    </g>
    <text x="20" y="100" class="mode-desc">任务拆分、并行处理，</text>
    <text x="20" y="118" class="mode-desc">最后由 Leader 合并。</text>
    <text x="20" y="155" class="mode-best">适合：</text>
    <text x="20" y="173" class="mode-desc">行业研究、多区域资料汇总</text>
  </g>

  <!-- Card 6: Swarm -->
  <g transform="translate(590, 310)">
    <rect class="mode-card" width="250" height="200" rx="10" />
    <text x="20" y="30" class="mode-name">6. SWARM</text>
    <text x="20" y="55" class="mode-title">竞选择优</text>
    <g transform="translate(225,40)">
      <circle cx="0"  cy="-8" r="6" fill="#e8f1fb" stroke="#2a78d6" stroke-width="1.2" />
      <circle cx="-8" cy="6"  r="6" fill="#e8f1fb" stroke="#2a78d6" stroke-width="1.2" />
      <circle cx="8"  cy="6"  r="6" fill="#e8f1fb" stroke="#2a78d6" stroke-width="1.2" />
      <path d="M -6 -10 L 0 14" stroke="#2a78d6" stroke-width="1.5" stroke-dasharray="2 2" />
      <path d="M 6 -10 L 0 14" stroke="#2a78d6" stroke-width="1.5" stroke-dasharray="2 2" />
      <polygon points="-4,16 4,16 0,22" fill="#d65a5a" />
    </g>
    <text x="20" y="100" class="mode-desc">同一题目多 Bot 并行，</text>
    <text x="20" y="118" class="mode-desc">选出表现最好的方案。</text>
    <text x="20" y="155" class="mode-best">适合：</text>
    <text x="20" y="173" class="mode-desc">标题、视觉、命名等创意型任务</text>
  </g>
</svg>

</div>

我们可以从下面这个**四个 Agent 在一个群聊里、从找 bug 到上线产品**的例子中，感受一下全程无人干预的情况下，Agent 们的协作方式：

> 📺 视频地址：<https://mp.weixin.qq.com/s/dXFJfseigkhtWGTH0Gp7pA>

这六种模式合在一起，说明 Octo 想解决的不是让 Agent 聊天这么简单。它真正处理的是**组织协作里的结构问题**——谁能看什么信息，谁负责哪一步，谁来审核，谁来合并，什么情况下需要人拍板。

在以前，这些规则主要靠人来维持；到了 Agent 越来越多的时代，协作系统本身就要把规则写进去。这也是 Octo 和传统 IM 工具的差异。

飞书、Slack、钉钉这样的工具，主要为人和人设计——它们擅长消息沟通、会议协同、文档流转。但当 Agent 也变成工作主体，系统就需要额外处理 AI 身份管理、AI 任务追踪、AI 协作模式这些新问题。旧工具当然可以加 AI 能力，但如果 Agent 数量持续增加，只在聊天框旁边挂一个 AI 入口，迟早会不够用。

---

## 四个端：让 Octo 出现在工作发生的地方

一个协作平台想真正被用起来，光有理念不行。它得进入人的日常工作场景。

Octo 在产品形态上覆盖 **Web App、移动端（iOS/Android）、浏览器插件与 CLI** 几个入口。人在哪里工作，Agent 就应该在哪里出现。

### 🌐 Web App —— 完整的协作工作台

Channel、Matter、Bot 工作记录、项目进展，都可以在这里集中管理。适合推进复杂项目，也适合管理多个 Bot 组成的数字团队。

### 📱 移动端 —— 反馈与验收

很多 AI 任务不一定需要你全程盯着，但关键节点需要你拍板。比如 Bot 交回一个阶段成果，你在手机上看一眼，觉得可以就通过，不行就打回补充。这类轻量判断，很适合在移动端完成。

### 🧩 浏览器插件 —— 在工作现场呼出 Agent

浏览器插件的价值不是让你把飞书文档、GitHub Issue、网页报告都搬进 Octo。它要做的是在你已经工作的页面旁边，**直接呼出 Agent，并把当前页面上下文带进去**。

比如你正在看一篇行业报告，选中一段内容，让 Bot 帮你总结、翻译、改写；你正在看 GitHub Issue，让 Bot 基于当前问题拆解修复思路；你在文档里卡住了，可以直接呼出 Bot 帮你续写一版。

这件事的好处就是**工作流不被打断**。AI 工具过去常常要求用户切换窗口、复制上下文、重新描述任务。浏览器插件把这一步缩短了——你在哪儿工作，Agent 就在哪儿待命。

### ⌨️ CLI —— 面向开发者与 Agent 原生操作

对开发者来说，很多任务本来就发生在终端里。通过 CLI，Agent 任务可以和命令行工作流接起来，尤其适合代码、自动化、运行环境相关的场景。

所以 Octo 的产品思路，不是让组织把现有系统全部推倒重来。它更像在文档、代码平台、项目管理工具、浏览器页面和终端之间，加了一层**人和 Agent 共同协作的连接层**。

这也解释了为什么它要强调开源和私有化部署。对于企业来说，真正有价值的 AI 资产，往往不是某一次回答本身，而是回答背后的**业务上下文、协作记录、偏好判断和工作方法**。这些东西如果沉淀在第三方平台里，企业很难真正掌握；如果能沉淀在自己的环境里，就可能变成长期资产。

> 📺 视频地址：<https://mp.weixin.qq.com/s/dXFJfseigkhtWGTH0Gp7pA>

---

## 协作方式，在 Agent 时代被重构

Octo 背后还有一个更大的判断。

AI 时代被重构的，不只是单个工具，还有**协作方式**。过去的组织协作，主要发生在人与人之间；未来很可能同时发生在人与人、人与 Agent、Agent 与 Agent 之间。

这会带来一个很现实的问题——**人到底该站在哪里？**

如果把 AI 当成一个更聪明的搜索框，人依然要自己拆任务、组织过程、检查结果，AI 只是更快给答案。但如果把 Agent 当成数字劳动力，人的角色就会发生变化——人不一定要亲自做每一步执行，却必须在关键节点给方向、定标准、做判断、看结果。

这就是 **"Agents do. Humans decide."** 这句话的意思。

Agent 负责思考、分析、生成、执行、调度；人负责判断什么是对的，什么是好的，什么是符合业务取舍的。

你发起任务，Bot 推进执行；Bot 交回阶段成果，你验收；不满意，打回；满意，通过；你的每一次批注、打回、偏好选择，都会继续影响 Bot 下一次干活。

这就形成了一个**飞轮**：派发任务 → 验收反馈 → 沉淀偏好与技能 → 下次更高效。在 Octo 里，每次协作会沉淀三类资产：

- **Context**（上下文）—— 包括项目背景、历史决策、讨论记录。新成员或新 Bot 加入时，不用从零对齐。
- **Taste**（偏好）—— 每次验收、打回、批注、风格选择，都在记录你和团队到底喜欢什么、认可什么、排斥什么。
- **Skill**（技能）—— 比如写代码用什么规范、做报告按什么结构、复盘用什么模板，这些做事方法可以在组织内部复用。

这也是我们刚才提到的 **O.C.T.O.** 四个字母的含义——**Open、Context、Taste、Orchestration**。

这四个维度串起来，Octo 想做的就不只是一个 AI 办公工具。它更像 **PrivateAI 时代的一层组织基础设施**。

因为当 AI 开始真正参与工作，企业关心的也不只是"这个模型聪不聪明"。更关键的是：

- 我的数据在哪里？
- 我的协作经验能不能沉淀？
- 我的组织风格会不会随着模型更换而丢失？
- 我的 Agent 能不能越用越懂业务？

从这个角度看，Octo 开源的意义，也不只在于让开发者多了一个项目可以试。它代表了一个趋势——**AI 应用正在从"个人效率工具"往"组织协作网络"迁移**。

---

## 结语：让 Agent 成为同事，而不只是助手

一个强 Agent，可以帮一个人提高效率。一群 Agent 能在同一套规则下协作，才可能改变一个组织的工作方式。

互联网让计算机彼此连接，才真正释放出网络效应。到了 Agent 时代，类似的问题又出现了——当每个人、每个团队、每个业务流程里都有 Agent，谁来把它们连接起来？

Octo 给出的答案，是**先把 Agent 放进组织协作里**。让它们有身份、有工位、有任务、有验收、有记录，也有逐步积累下来的偏好和技能。

说到底，Agent 真正进入公司，不是因为它能在聊天框里多说几句漂亮话，而是因为它可以**把活接下来，把事往前推，把结果交回来，并且在一次次反馈里越来越懂这个组织**。

当 Agent 不再单打独斗，AI 才真的有机会从**助手**变成**同事**。