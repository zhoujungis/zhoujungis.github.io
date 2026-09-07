# 快乐小游戏 Happy Games：24 款零框架小游戏的全栈实践与一键部署指南

![快乐小游戏 Happy Games](https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600&q=80&auto=format&fit=crop)

> 不必找游戏，直接开始一局。—— 一个纯用原生 HTML / CSS / JavaScript 写成的浏览器游戏厅，24 款游戏、零框架、零构建、零依赖，AI 从模式评分到 WebAssembly，联机靠 D1 + 轮询，叙事靠 LLM 流式生成，一键部署到 Cloudflare Pages。

**在线试玩：** [https://happygames.pages.dev](https://happygames.pages.dev) · **源码：** [github.com/zhoujungis/happy_games](https://github.com/zhoujungis/happy_games) · **作者博客：** [zhoujungis.github.io](https://zhoujungis.github.io)

---

## 引言：为什么还要做一个"小游戏合集"

市面上不缺小游戏平台，缺的是**能被完整读懂、能被一键复刻**的样本工程。Happy Games 的定位很明确：

1. **教学样本**——每个文件夹就能独立运行，没有"先装 300MB node_modules 再看懂 5 层抽象"的心智负担；
2. **技术纵深**——在"零框架"的约束下，把 AI（从启发式到 WASM 引擎）、实时联机、流式叙事、账号体系、全链路测试都做一遍；
3. **可部署**——整站就是静态文件 + Cloudflare Pages Functions + D1，没有容器、没有服务器，一条 `wrangler` 命令上线。

如果你想：

- 找一个 **"浏览器游戏"** 的入门脚手架，抄走即用；
- 研究 **"零框架如何组织大型前端"** 的真实案例；
- 学习 **Cloudflare 全家桶（Pages / Functions / D1）** 的最小可用全栈；
- 或者单纯想摸鱼 10 分钟——这篇文章就是为你写的。

---

## 一、项目速览：30 秒看懂 Happy Games

| 维度 | 关键事实 |
|------|---------|
| **游戏数** | **24 款**，分 4 板块：棋类竞技 6 / 益智解谜 6 / 娱乐天地 6 / 华夏历史 6 |
| **技术约束** | 原生 HTML / CSS / JS（ES Modules），**无框架、无构建、无依赖**，双击 HTML 即可本地打开 |
| **AI 能力** | 模式评分（五子棋）→ Alpha-Beta 剪枝（象棋）→ GNU Go 编译到 WebAssembly（围棋）→ 三档难度全家桶（斗兽棋/黑白棋） |
| **联机** | 飞行棋 2–4 人实时对战，房间+密码，D1 存档，前端轮询同步，空座 AI 托管 |
| **叙事** | 模拟人生 + 华夏大乱斗接入 OpenRouter 大模型，服务端 SSE 流式转发到浏览器 |
| **后端** | Cloudflare Pages Functions（`functions/api/**` 文件即路由）+ Cloudflare D1（SQLite 云数据库） |
| **测试** | `node --test` 跑 25 个文件 288 个用例（纯函数 AI/引擎）+ Playwright 冒烟（桌面+移动端） |
| **部署** | `npm run deploy` → `wrangler pages deploy .` 整站发布；缓存分层配置在 `_headers` |
| **设计原则** | 自包含文件夹 + 纯函数隔离 + 数据驱动首页 + 能离线 |

### 四大板块一览

| 板块 | 主题 | 6 款游戏 |
|:---:|------|---------|
| ♟️ **棋类竞技** | 方寸棋盘，纵横谋略 | 五子棋、**中国象棋**、**围棋（GNU Go WASM）**、斗兽棋、黑白棋、**飞行棋（联机）** |
| 🧩 **益智解谜** | 逻辑推理，烧脑一刻 | 规则方块、光线折射、数独、迷宫逃脱、回声行者、推箱子 |
| 🎈 **娱乐天地** | 随手把玩，偷得半日闲 | 星火割草（类吸血鬼幸存者）、**模拟人生（AI 叙事）**、跳跳鸟、模拟徒步、跳一跳、堆塔 |
| 🏯 **华夏历史** | 数风流人物，还看今朝 | 圣旨七日、华夏商旅、大唐县令、华夏帝王、**华夏大乱斗（AI 裁判）**、科举闯关 |

---

## 二、游戏全览：24 款怎么玩、亮点在哪

### ♟️ 棋类竞技

| 游戏 | 玩法一句话 | 硬核点 |
|------|-----------|--------|
| **五子棋** | 15×15 人机对战 | AI 基于 8 档棋形权重（连五 100000 / 活四 10000 / 冲四活三 1000 …）模式评分，三档难度对应不同搜索深度 |
| **中国象棋** | 人机对弈 | 移植开源 [itlwei/Chess](https://github.com/itlwei/Chess) 引擎：走法生成（bylaw）+ 9 种棋子位置价值表（马 3.5 / 车 9 / 炮 4.5 等）+ alpha-beta 搜索；服务端另有 GLM-4.7-Flash 走法代理兜底 |
| **围棋** | 人机对弈 | **GNU Go 编译成 WebAssembly（约 8.7 MB）**，在 Web Worker 异步运行，Komi 7.5，主线程通过 `{cmd:'init'/'play'/'genmove'}` 消息协议与引擎通信，含颜色归一化与崩溃走法日志 |
| **斗兽棋** | 河流与陷阱规则 | 象吃狮、鼠吃象、过河、陷阱困兽；三档 AI；棋子绘有动物 emoji |
| **黑白棋** | 八方向翻转 | 三档 AI + 悔棋 |
| **飞行棋** | 唯一联机游戏 | 2–4 人实时对战，掷骰/跳格/飞格按经典规则，人不够空座由服务端 AI 补位，随时开局 |

### 🧩 益智解谜

| 游戏 | 玩法一句话 | 亮点 |
|------|-----------|------|
| **规则方块** | 推文字改规则（"墙是停"、"水是沉" …） | 灵感来自 Baba Is You，右侧实时显示当前生效规则，多关卡 + 撤销重置；目标是让任意「你」与任意「胜」相遇 |
| **光线折射** | 旋转镜面与分光器点亮晶体 | 深色网格，45° 旋转交互，激光分光折射的物理谜题 |
| **数独** | 9×9 经典数独 | 三档难度 + 限时挑战 + 铅笔标记 + 冲突高亮；米白棋盘风格 |
| **迷宫逃脱** | 限时穿越随机迷宫 | 难度越高迷宫越大越曲折，每局地图随机生成 |
| **回声行者** | 每走 6 步旧路变回声追你 | 影子机制：收集印章、避开过去的自己，路线规划容错极低 |
| **推箱子** | 15 关手排关卡 | 由浅入深，温暖复古地板色系，经典推箱子解谜 |

### 🎈 娱乐天地

| 游戏 | 玩法一句话 | 亮点 |
|------|-----------|------|
| **星火割草** | 类吸血鬼幸存者 | 角色自动射击，击杀掉经验，三选一随机升级（射速/弹道/护甲…），build 构筑决定能撑几波 |
| **模拟人生** | 文字人生模拟 | 分配天赋（智识/体魄/财运…），AI 按属性流式生成童年→少年→青年→中年→晚年→总评六段故事，最后给出 0–100 人生评分 |
| **跳跳鸟** | 点击飞翔穿水管 | 蓝天草地配色，经典手感，越飞越远 |
| **模拟徒步** | 三条真实路线：熬太穿越/贡嘎大环线/乌孙古道 | 翻山越岭 + 补给管理 + 海拔天气，浏览器里的徒步模拟器 |
| **跳一跳** | 长按蓄力跳平台 | 正落中心有连击加分，微妙的物理引擎是精髓 |
| **堆塔** | 摆动方块精准落下 | 对齐越多层越高，精准截断、层层堆叠，心跳加速 |

### 🏯 华夏历史

| 游戏 | 玩法一句话 | 亮点 |
|------|-----------|------|
| **圣旨七日** | 七天办妥圣旨 | 每天 3 次行动机会，银两/粮食/民心/治安/士族/名望/情报七资源此消彼长，三次行动后呈报圣旨，第七日按政绩结算 |
| **华夏商旅** | 踏遍名城经营商号 | 与 3 名 AI 商人竞逐财富，商品价格与对手策略动态变化 |
| **大唐县令** | 经营县城十二季（三年） | 修农田/兴市集/处理随机事件，税收/民心/粮仓/治安多目标平衡 |
| **华夏帝王** | 猜帝王（200 余位候选） | 不限次数，前几次给常规线索，第 5 次起 50% 概率直接揭示属性对比 |
| **华夏大乱斗** | 双人轮流选将 + AI 裁判 | 穿越随机朝代，为十个职位选最合适历史人物，AI 按"朝代适配 > 职位匹配 > 实际能力 > 阵容协同"逐局评判，说书人腔调点评 |
| **科举闯关** | 县试到殿试七关三题四选一 | 经史子集 + 古代制度常识，错一题即止，殿试三甲是终极浪漫 |

---

## 三、硬核亮点拆解

### 3.1 AI 引擎：从模式评分到 WebAssembly 的四个层级

Happy Games 的 AI 不是"随机走一步"，而是横跨四个技术层级：

**① 模式评分（五子棋 `gomoku/ai.js`）**

8 个方向扫描棋形，按权重打分取最优落点：

| 棋形 | 评分 | 含义 |
|------|------|------|
| 连五 | 100000 | 已成五子，直接获胜 |
| 活四 | 10000 | 两端开放的四子，必胜 |
| 冲四 / 活三 | 1000 | 一端被堵的四子 / 两端开放的三子 |
| 冲三 / 活二 | 100 | 一端被堵的三子 / 开放的二子 |
| 冲二 | 10 |  |
| 单子 | 1 |  |

三档难度控制搜索深度：初级只看一步（会"手滑"），高级多看几步并把"堵你活三"放在"自己成冲四"之上。所有逻辑写成纯函数，`node --test` 可直接测。

**② Alpha-Beta 剪枝（中国象棋 `xiangqi/engine.js`）**

移植自 [itlwei/Chess](https://github.com/itlwei/Chess)（MIT），保留引擎核心：

- **走法生成（bylaw）**：每种棋子的合法走法规则（马腿、象眼、宫内斜走等）；
- **位置价值表**：每枚棋子在不同格子的攻防价值（如兵过河前/后、炮在不同线的价值差异）；
- **Alpha-Beta 搜索 + 局面评估**：在指数级博弈树中剪掉不可能更优的分支，只搜"有希望"的走法。

棋盘逻辑（`xiangqi/logic.js`）与 AI 引擎（`xiangqi/engine.js`）完全分离，另在服务端 `/api/xiangqi-ai` 提供基于 GLM-4.7-Flash 的 AI 走法代理作为兜底——当本地引擎因极端局面无法给出走法时，云端模型补位。

**③ GNU Go → WebAssembly（围棋 `weiqi/gnugo.js` + `weiqi/weiqi.worker.js`）**

这是项目里最硬核的一条技术路径：把开源围棋引擎 **GNU Go** 编译成 WebAssembly（`weiqi/gnugo.js` 约 8.7 MB），在 **Web Worker** 中运行，主线程与 Worker 通过消息协议通信：

```text
主线程 → Worker：  { cmd: 'init', size, seed }   初始化对局（Komi 7.5 贴目）
主线程 → Worker：  { cmd: 'play', i, j }         玩家落子
主线程 → Worker：  { cmd: 'genmove' }            引擎思考落子
Worker → 主线程：  { ok, cmd, board, last }      盘面快照（含颜色归一化）
```

Worker 里还做了三件关键事：

- **颜色归一化**：不依赖 GNU Go 内部颜色常量方向，首次落子后把"玩家色"统一映射为 1（黑）、另一色为 2（白），主线程渲染永远一致；
- **走法日志**：记录每一步 `(i,j)`，引擎崩溃时可复现对局；
- **stdout/stderr 捕获**：`Module.print / printErr` 接管 GNU Go 输出，便于诊断。

浏览器里跑世界级棋类引擎，且不卡主线程——这是"前端也能做重型 AI"的完整实践。

**④ 三档难度全家桶（斗兽棋 / 黑白棋）**

两款的 AI 都按搜索深度分三档，黑白棋额外支持悔棋。实现同样是纯函数，可单测。

---

### 3.2 飞行棋：基于 D1 的实时联机（轮询 + 服务端状态机）

飞行棋是 24 款里唯一的多人游戏，架构可拆成三层：

```
创建/加入  →  状态推进（掷骰/走子/开局）  →  轮询同步
  │                    │                        │
  ▼                    ▼                        ▼
/api/feixingqi/create  /api/feixingqi/roll    前端 1.5s（对局中）/ 2s（大厅）轮询 /api/feixingqi/state
/api/feixingqi/join    /api/feixingqi/move    服务端先 tick() 推进 AI 补位回合再返回
                       /api/feixingqi/start
```

- **房间管理**：`POST /api/feixingqi/create` 创建房间（带密码）、`POST /api/feixingqi/join` 加入房间；房间状态整体序列化为 JSON 存进 D1 `feixingqi_rooms` 表（`code/password/state(JSON)/created_at/updated_at`）；
- **状态推进**：所有走子合法性由服务端校验（防作弊），空座由服务端 AI 托管——哪怕只有一个人，也能凑齐一桌；
- **轮询同步**：前端定时 `fetch /api/feixingqi/state`，服务端在返回前先执行 `tick()` 推进 AI 玩家的回合，玩家看到的永远是"别人已经走完"的最新局面。

D1 在这里既是数据库也是缓存，简单够用，免去了 WebSocket 的运维复杂度。

---

### 3.3 AI 流式叙事：人生与战报由大模型书写

「模拟人生」与「华夏大乱斗」把大模型接进了游戏，服务端做 SSE 流式转发：

**模拟人生（`/api/life/narrate`）**

- 玩家分配出生属性后，前端 `POST /api/life/narrate {attributes}`；
- 服务端请求 OpenRouter（`inclusionai/ling-3.0-flash:free`），把 SSE 流原样转发给浏览器：`Content-Type: text/event-stream`；
- 六段人生（童年→少年→青年→中年→晚年→总评）逐字生成，像有人在屏幕那头讲故事；
- 遇 429 限流自动退避重试（最多 3 次，间隔 2.5s × attempt），提示词严格约束输出格式（每段 130–180 字、评分必须为"人生评分：NN"）。

提示词核心约束：

```text
你是中文人生模拟器的随机推演 AI。严格按六个标题输出，每个标题独占一行：
【童年】【少年】【青年】【中年】【晚年】【人生总评】
前五段各 130–180 字，必须包含该阶段具体事件、影响、如何改变下一阶段；
最后一段开头必须是"人生评分：NN。"（NN 0–100）。
```

**华夏大乱斗（`/api/battle/analyze`）**

- 双人轮流为十个职位选将（先锋、后勤…），选将完毕请求 AI 裁判；
- AI 按 **朝代适配性 > 职位匹配度 > 实际能力 > 阵容协同** 的优先级逐局评判十场对决，比分精确到 0.1 且每局总和必须为 10；
- 输出风格是"话说……""且看……"的说书人腔调，同样走 SSE 流式返回。

> 这两处是"游戏 + LLM"的轻量范式：服务端只做鉴权、限流、流转发，不存大模型状态；前端消费标准 SSE，失败不阻塞游戏主循环。

---

### 3.4 账号与管理台

- 注册 / 登录 / 退出：`POST /api/register|login|logout`，密码存储于 D1 `users` 表（`username PK + password + created_at`），会话使用随机 token + Cookie（`hg_token`）鉴权，`expires_at` 30 天过期校验；
- `GET /api/me` 供前端判断登录态：首页据此显示"用户名 · 退出"；管理员账号 `zhoujun` 自动亮出隐藏的「管理台」入口（`/adminPages/`）；
- 通用中间件在 `functions/_middleware.js`：未登录的 HTML 页面请求一律 302 跳转到 `/login.html`，静态资源与 `/api/*` 放行；管理台路径额外校验 `username === 'zhoujun'` 否则 403；
- 管理台接口：`GET /api/admin/users`（用户列表）、`GET /api/admin/game-stats`（对局与成绩统计）。

---

### 3.5 快得没有道理：缓存与体验细节

- **零依赖、零构建**：静态资源秒开，首屏无打包等待；
- **分层缓存（`_headers`）**：
  - `.css/.js/.mjs` → `max-age=300, stale-while-revalidate=86400`（5 分钟强缓存 + 24 小时过期后后台刷新）
  - `.wasm` → `max-age=604800, immutable`（7 天强缓存，GNU Go 引擎一次加载永久缓存）
  - 图片（`.png/.jpg/.webp/.svg`）→ `max-age=86400, stale-while-revalidate=604800`（1 天）
- **首页体验**：每次打开随机抽 3 款游戏做推荐位 + 「随机开一局」按钮（`sections.flatMap` 后随机取 3 + 随机跳转），选择困难症救星；
- **响应式**：`@media (max-width: 850px / 600px)` 两档断点，手机电脑皆可玩，触屏与键盘双输入适配；
- **游戏运行时**：`shared/game-runtime.js` 统一管理生命周期、分数与事件上报（见下文），失败不阻塞主循环。

---

## 四、技术栈

| 层 | 技术 | 说明 |
|---|------|------|
| 前端 | 原生 HTML / CSS / JS（ES Modules） | 无框架、无构建、无依赖；`shared/theme.css` 定义全套视觉变量（墨色 #1a1a1a / 朱红 / 金色 / 青绿等） |
| 棋盘渲染 | 手写 SVG / Canvas | 视游戏而定，纯函数预览图由 `shared/landing.js` 导出 |
| AI | GNU Go → WebAssembly（Worker） / alpha-beta 剪枝 / 模式评分 / minimax | 浏览器内运行世界级引擎 |
| 云端 AI | OpenRouter（`inclusionai/ling-3.0-flash:free` 流式叙事） / 模力方舟 Moark（GLM-4.7-Flash 象棋走法代理） | SSE 流式转发 |
| 后端 | Cloudflare Pages Functions（`functions/api/**` 文件即路由） | 按路径自动路由，无需配置 |
| 数据库 | Cloudflare D1（SQLite 云数据库，`schema.sql` 建表，`migrations/` 增量） | `users / sessions / battle_rooms / feixingqi_rooms / game_sessions / game_events / game_scores` 7 张表 |
| 测试 | Node.js 内置 test runner（`npm test`，`tests/` 25 文件 288 用例）+ Playwright 冒烟 | 纯函数可单测 + 浏览器 E2E |
| 部署 | Cloudflare Pages（`wrangler pages deploy .`） | `wrangler.toml` 配置 Pages + D1 绑定 |
| 缓存 | `_headers` 分层缓存 + `_routes.json` 排除静态资源走 Function | 细粒度控制 |

---

## 五、架构详解

### 5.1 前端架构：自包含文件夹 + 数据驱动首页

```
┌──────────────────────────────────────────────────────────────┐
│  index.html  首页：板块入口卡 + 每日推荐 + 随机开一局          │
│  /board /puzzle /fun /history  板块页：该板块游戏卡             │
│  shared/landing.js  ★ 唯一数据源：板块 + 游戏配置 + SVG 预览图 │
│  shared/game-runtime.js  生命周期、分数与反馈事件队列            │
│  shared/theme.css / cards.css / game.css  主题与卡片样式       │
├──────────────────────────────────────────────────────────────┤
│  每款游戏 = 一个自包含文件夹                                      │
│  <game>/index.html        页面骨架 + 弹窗说明                     │
│  <game>/<game>.js         交互与渲染（可含 worker）               │
│  <game>/<game>.css        独享样式                               │
│  <game>/ai.js             纯函数 AI（无 DOM，可单测）             │
│  <game>/engine.js         纯逻辑引擎（走法/规则/状态机）           │
│  <game>/logic.js          棋盘规则（如围棋提子/气）                │
│  <game>/levels.js         关卡数据（如推箱子 15 关）               │
│  └─ (worker 文件，如 weiqi/weiqi.worker.js、gnugo.js)       │
└──────────────────────────────────────────────────────────────┘
```

**三条设计纪律：**

1. **主题共享**：`shared/theme.css` 定义全套 CSS 变量（`--ink / --accent-red / --accent-gold / --border / --surface / --shadow-soft` 等），`shared/cards.css` 定义首页与板块页卡片，`shared/game.css` 定义游戏页布局与状态反馈；所有游戏复用同一套视觉语言，不各自发明颜色。

2. **数据驱动首页**：`shared/landing.js` 是全站唯一数据源。`sections` 数组定义 4 板块 × 6 游戏的 `id / name / description / href / accent / previewSvg`，`renderHome()` 渲染首页 4 个板块入口卡，`renderSection(id)` 渲染板块页 6 个游戏卡。首页的 3 个推荐位随机抽取、随机开一局按钮、板块页游戏数统计，全部从这一份配置推导——**加一款游戏只改一处**，其余自动生效。

   ```js
   // shared/landing.js 新增游戏只需加一条
   {
     id: 'mygame',
     name: '我的游戏',
     description: '一句话简介',
     href: '/mygame/',
     accent: '#2980b9',
     previewSvg: `<svg viewBox="0 0 120 120">…</svg>`,
   }
   ```

3. **自包含**：每款游戏一个文件夹，页面、样式、逻辑、AI 全在一起，互不干扰。新增游戏不碰其他游戏文件，删除游戏直接删文件夹，零耦合。

**运行时共享（`shared/game-runtime.js`）**

为每局游戏创建会话、记录关键事件、同步分数快照，并在结束/离页时提交结果。核心能力：

- `createGameRuntime({gameId, autoStart})` 工厂：`uuid()` 生成 `sessionId`，`start()` 调 `POST /api/game/sessions`，`setScore()` 去重后推 `score_snapshot`，`finish(outcome)` 调 `POST /api/game/finish` + `flush()`；
- 事件队列：`MAX_QUEUE=60 / FLUSH_SIZE=6 / FLUSH_DELAY=1600ms` 批量上报 `POST /api/game/events`，幂等 `eventId`，网络失败不阻塞游戏主循环（失败事件回队重试）；
- DOM 快照：`MutationObserver` 监听 `#score / [data-score] / .score-value / #status` 等，自动提取分数与"游戏结束/胜利/失败"关键词，触发 `finish('won'|'lost')`；
- 自定义事件：监听 `happy-game-score` / `happy-game-event`，游戏可 `dispatchEvent(new CustomEvent('happy-game-score', {detail:{score, delta}}))` 上报；
- 离页兜底：`pagehide` 时 `navigator.sendBeacon('/api/game/finish', …)` 确保成绩不丢。

> 设计哲学：**Domain 层必须与 DOM / Canvas / 网络 / 数据库解耦**。页面与渲染器只消费 Domain 快照，`game-runtime` 拥有生命周期与反馈，`ai.js / engine.js` 纯函数可在 Node 里单测。这是 `docs/architecture.md` 约定的分层边界：`page → shared UI/runtime → game domain → API client → Pages Functions → D1`。

---

### 5.2 后端 API 参考

所有接口在 `functions/api/` 下，**文件名即路由**，无需额外配置：

| 端点 | 方法 | 说明 |
|:---|:---:|------|
| `/api/register` | POST | 注册新用户（`username + password` → D1 `users`） |
| `/api/login` | POST | 登录，下发 `hg_token` Cookie（30 天过期） |
| `/api/logout` | POST | 退出登录，销毁会话 |
| `/api/me` | GET | 当前登录态（返回 `{username}` 或 401） |
| `/api/xiangqi-ai` | POST | 象棋 AI 走法代理（FEN 进、走法出，经 Moark 调 GLM-4.7-Flash） |
| `/api/life/narrate` | POST | 模拟人生：依据出生属性流式生成人生（SSE，`text/event-stream`） |
| `/api/battle/create` `join` `pick` `state` | POST/GET | 华夏大乱斗：房间、选将、状态同步 |
| `/api/battle/analyze` `analysis` | POST/GET | 华夏大乱斗：AI 裁判逐局评判（SSE 流式） |
| `/api/feixingqi/create` `join` `start` `roll` `move` `state` | POST/GET | 飞行棋：房间、开局、掷骰、走子、轮询状态 |
| `/api/admin/users` | GET | 管理台：用户列表（仅 `zhoujun`） |
| `/api/admin/game-stats` | GET | 管理台：对局与成绩统计 |
| `/api/game/sessions` | POST | 创建一局游戏会话（`game_sessions`） |
| `/api/game/events` | POST | 批量写入关键游戏事件（幂等 `event_id`，白名单校验） |
| `/api/game/finish` | POST | 结算游戏并写入最终成绩（`game_scores`） |

通用复用在 `functions/api/feixingqi/_shared.js`：`json() / parseCookie() / whoami() / loadRoom() / saveRoom()`；游戏会话复用在 `functions/api/game/_shared.js`；业务服务在 `functions/services/game-service.js`，D1 访问在 `functions/repositories/game-repository.js`——**Functions 是传输适配器，Services 拥有工作流，Repositories 拥有 SQL**，边界清晰。

---

### 5.3 数据库（D1）

`schema.sql` 定义 7 张表，增量变更放在 `migrations/`，新库执行完整 `schema.sql`，已有库按迁移顺序更新：

```sql
users            -- 用户名 PK + 密码 + 注册时间
sessions         -- token PK + 用户名 + 过期时间（idx_sessions_username）
battle_rooms     -- 大乱斗房间：code PK / password / state(JSON) / created_at / updated_at
feixingqi_rooms  -- 飞行棋房间：同上结构，state 含 seats/pieces/turn/dice/log 等
game_sessions    -- 每局游戏生命周期：id PK / game_id / username / anonymous_id / started_at / ended_at / status / score / duration_ms / metadata(JSON)
game_events      -- 受白名单约束的关键事件：id / event_id UNIQUE / session_id / game_id / event_type / score / score_delta / payload(JSON) / client_at
game_scores      -- 最终成绩：session_id PK / game_id / username / score / outcome / duration_ms / metadata(JSON)
```

房间状态整体序列化为 JSON 存在单行里（简单够用），联机走"前端轮询 + 服务端状态机推进"模型，D1 即数据库即缓存。

索引覆盖高频查询：`game_sessions(game_id, started_at)`、`game_events(session_id, created_at)`、`game_scores(game_id, score DESC)` 等。

---

## 六、快速开始：本地 3 步跑起来

**前置要求：** Node.js 18+（wrangler 与 `node --test` 都依赖它）

```bash
# 1. 克隆
git clone https://github.com/zhoujungis/happy_games.git
cd happy_games

# 2. 安装（仅 wrangler + playwright，无前端依赖）
npm install

# 3. 本地开发（同时提供静态资源与 Pages Functions）
npm run dev
# 打开 http://localhost:8788 即可游玩
```

> `wrangler pages dev .` 会读取 `wrangler.toml` 的 D1 绑定。**本地 D1** 需要先创建或同步：
>
> ```bash
> # 方式一：本地 D1（推荐开发时）
> npx wrangler d1 create happy-games-db   # 记下 database_id 填入 wrangler.toml
> npx wrangler d1 execute happy-games-db --local --file=schema.sql
>
> # 方式二：直接连远端 D1（需已在 Cloudflare Dashboard 创建）
> npx wrangler d1 execute happy-games-db --remote --file=schema.sql
> ```

### 测试

```bash
npm test          # Node 内置 test runner，跑 tests/*.test.js（25 文件 288 用例）
npm run check     # tools/check.mjs：JS 语法 + HTML charset/viewport 检查
npm run test:e2e  # Playwright 冒烟（桌面 + 移动端首页、Canvas 游戏、横向溢出）
```

之所以能在 Node 里测，是因为所有 AI / 引擎都写成**不依赖 DOM 的纯函数**（`gomoku/ai.js`、`xiangqi/engine.js`、`weiqi/logic.js`、`feixingqi/engine.js` 等），`import` 即可断言。

---

## 七、部署：从零到 https://happygames.pages.dev

Happy Games 部署在 **Cloudflare Pages**，整站直接发布（`wrangler.toml` 中 `pages_build_output_dir = "."`），无需构建步骤。完整流程分三步：

### 步骤 1：创建 D1 数据库

在 [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **D1 SQL Database** → **Create database**，命名 `happy-games-db`，创建后把 `database_id` 填入 `wrangler.toml`：

```toml
# wrangler.toml
name = "happy-games"
compatibility_date = "2025-01-01"
pages_build_output_dir = "."

[[d1_databases]]
binding = "DB"
database_name = "happy-games-db"
database_id = "3a210663-b7f3-4b40-b772-efd46c88ccb4"  # ← 替换为你的 ID
```

然后建表：

```bash
npx wrangler d1 execute happy-games-db --remote --file=schema.sql
# 若有 migrations/ 目录，按文件名顺序逐个执行
for f in migrations/*.sql; do npx wrangler d1 execute happy-games-db --remote --file="$f"; done
```

验证：

```bash
npx wrangler d1 execute happy-games-db --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
# 应看到 users / sessions / battle_rooms / feixingqi_rooms / game_sessions / game_events / game_scores
```

### 步骤 2：配置环境变量

在 Dashboard → 你的 Pages 项目 **Settings** → **Variables and Secrets** → **Environment variables** 添加：

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `OPENROUTER_KEY` | 可选 | OpenRouter API Key，用于模拟人生的流式叙事；不配置则该功能返回 503，不影响其他游戏 |

> 象棋云端代理若使用模力方舟 Moark，需另配其 API Key（见 `functions/api/xiangqi-ai.js` 顶部注释，按需配置）。

### 步骤 3：一键发布

```bash
npm run deploy
# 等价于 npx wrangler pages deploy .
```

- 首次运行会创建 `happy-games` Pages 项目；
- 后续每次 `deploy` 即增量发布，Cloudflare 自动处理域名与 HTTPS；
- 发布后访问 `https://happygames.pages.dev`（或绑定的自定义域名）。

**缓存与路由：**

- `_headers` 已配置分层缓存（见 3.5 节），无需手动设置；
- `_routes.json` 排除静态资源（`.css/.js/.wasm/.png/...`）不走 Functions，只让 `/api/*` 与 HTML 走 Function，节省调用次数：

  ```json
  {
    "version": 1,
    "include": ["/*"],
    "exclude": ["/*.css","/*.js","/*.mjs","/*.wasm","/*.png","/*.svg","/robots.txt","/rss.xml"]
  }
  ```

**自定义域名（可选）：**

Dashboard → Pages 项目 → **Custom domains** → **Set up a custom domain**，按指引添加 DNS 记录即可，Cloudflare 自动签发证书。

**常见坑位：**

| 现象 | 原因 | 解法 |
|------|------|------|
| `/api/me` 401 但已登录 | `hg_token` Cookie 未带上，检查 `credentials: 'same-origin'` 与 HTTPS | 确认通过 Pages 域名访问，非 `file://` |
| 模拟人生 503 | 未配置 `OPENROUTER_KEY` | Dashboard 添加变量后 **Retry deployment** |
| D1 报错 no such table | `schema.sql` 未在远端执行 | 重新 `wrangler d1 execute --remote --file=schema.sql` |
| `.wasm` 加载慢 | 未命中缓存 | 确认 `_headers` 中 `.wasm` 为 `immutable`，二次访问应 304/from cache |

---

## 八、新增一款游戏：改两个地方，自动全站生效

得益于数据驱动设计，新增游戏只需两步：

**1. 建文件夹**（参考 `gomoku/` 结构）

```
<game>/
├── index.html     # 页面骨架（头部 + 棋盘/画布 + 规则弹窗，引入 /shared/theme.css + /shared/game.css）
├── <game>.css     # 游戏独享样式
├── <game>.js      # 交互与渲染（可含 worker）
└── ai.js          # 纯函数 AI（可被 node --test 测试，无 DOM 依赖）
```

`index.html` 模板要点：含 `<meta charset>` / `<meta viewport>` / 棋盘容器 / 分数与状态元素（`#score` / `#status` 等供 `game-runtime` 自动快照）/ 规则弹窗；底部 `type="module"` 引入 `<game>.js` 并调用 `createGameRuntime()`。

**2. 注册配置**（在 `shared/landing.js` 对应板块的 `games` 数组中加一条）

```js
{
  id: 'mygame',           // 文件夹名，也是 /mygame/ 的路径
  name: '我的游戏',         // 卡片标题
  description: '一句话简介', // 首页与板块页卡片描述
  href: '/mygame/',        // 跳转链接（与文件夹一致）
  accent: '#2980b9',       // 卡片主题色
  previewSvg: `<svg viewBox="0 0 120 120">…</svg>`, // 120×120 预览图
}
```

**（可选）3. 后端接口**（按需放在 `functions/api/` 下，文件名即路由）

```
functions/api/leaderboard.js  →  GET/POST /api/leaderboard
```

完成。首页板块卡、板块页游戏卡、每日随机推荐、随机开一局都会自动带上新游戏，不需要改任何其他文件。这就是 **"唯一数据源"** 的威力。

> 约束：`docs/architecture.md` 要求——保持现有 URL 与静态部署行为稳定；先迁移代表性游戏再批量迁移；纯逻辑测试保持绿色；为生命周期/分数/离线/响应式补充浏览器覆盖。

---

## 九、项目结构

```
├── index.html                  # 首页：板块入口 + 每日推荐 + 随机开一局
├── login.html                  # 登录/注册页
├── adminPages/                 # 管理台（仅 zhoujun 可见）
├── board/ puzzle/ fun/ history/# 板块页（分别渲染 6 款游戏卡）
├── shared/
│   ├── theme.css               # 全局视觉变量与基础样式（墨色/朱红/金色等）
│   ├── cards.css               # 首页/板块页卡片样式
│   ├── game.css                # 游戏页公共样式（页头、弹窗、状态反馈）
│   ├── game-runtime.js          # ★ 游戏生命周期、分数与事件上报（会话/队列/快照）
│   └── landing.js              # ★ 唯一数据源：板块+游戏配置+SVG 预览图
├── functions/
│   ├── _middleware.js          # 通用中间件（登录守卫 / 管理台鉴权）
│   ├── services/                # 业务服务（game-service.js）
│   ├── repositories/            # D1 数据访问（game-repository.js）
│   └── api/
│       ├── register.js login.js logout.js me.js   # 账号体系
│       ├── xiangqi-ai.js       # 象棋 AI 走法代理
│       ├── life/narrate.js     # 模拟人生 SSE 叙事
│       ├── battle/*.js         # 华夏大乱斗房间与 AI 裁判
│       ├── feixingqi/*.js      # 飞行棋联机（_shared.js 为公共工具）
│       ├── game/*.js           # 游戏会话 / 事件 / 结算
│       └── admin/               # 管理台接口与游戏统计
├── <game>/                     # 每款游戏一个自包含文件夹（24 个）
│   ├── index.html
│   ├── <game>.js / <game>.css
│   ├── ai.js / engine.js / logic.js   # 纯函数逻辑（可单测）
│   └── (worker，如 weiqi/weiqi.worker.js、gnugo.js 约 8.7 MB)
├── schema.sql                  # D1 数据库表结构（7 张表）
├── migrations/                  # D1 增量迁移（按序执行）
├── tests/                       # Node 逻辑/API 测试（25 文件 288 用例）
├── e2e/                         # Playwright 浏览器冒烟测试
├── tools/check.mjs              # 代码质量基础检查（JS 语法 + HTML meta）
├── wrangler.toml               # Pages + D1 配置
├── _headers                    # 静态资源分层缓存策略
├── _routes.json                # 路由配置（静态资源不走 Function）
├── assets/                     # README 游戏预览图（由 landing.js 导出）
└── docs/architecture.md         # 架构边界与迁移规则
```

---

## 十、为什么坚持"零框架"

这不是复古，而是权衡后的选择：

1. **可读性优先**：24 款游戏由不同逻辑构成，React/Vue 的抽象在"每款游戏完全不同"的场景下收益有限，反而增加"先理解框架再理解游戏"的负担；原生代码让新人 10 分钟就能看懂一款游戏的完整链路。

2. **可移植性**：`ai.js / engine.js` 纯函数不依赖任何框架，Node 里 `import` 即可测试，未来要迁到小程序、Electron、甚至服务端，都只需重写渲染层。

3. **性能与离线**：无框架意味着无运行时开销、无 hydration、无打包体积；除 AI 叙事与联机外，所有游戏不依赖网络，`_headers` 缓存让二次访问接近离线体验。

4. **教学价值**：这是一个"能被完整读懂"的前端项目——没有黑盒打包器，没有 2000 行配置，整个项目就是一堆 HTML 文件，上传到 Cloudflare Pages 就能跑。**把复杂度留给游戏逻辑，把简单留给工程。**

当然，零框架不等于零规范：`shared/theme.css` 的变量体系、`shared/landing.js` 的唯一数据源、`shared/game-runtime.js` 的生命周期契约、`functions/services` 的分层边界，共同构成了项目的隐形框架——只是它们是约定的，而非依赖的。

---

## 写在最后

Happy Games 想证明一件事：**在"重前端框架"的时代，原生技术依然能做出完整、可维护、可部署的全栈产品**——只要把边界划清楚（Domain 与渲染分离、数据驱动首页、分层后端），把 AI 写成纯函数，把联机做成状态机，把部署交给 Cloudflare。

24 款游戏，每款都是一个独立的世界：你可以是棋盘上的谋略家、迷宫里的逃脱者、商道上的冒险家，也可以是七日圣旨里的朝臣、科举考场上的读书人。**不必找游戏，直接开始一局——这一刻，玩点有意思的。**

> 📚 **延伸阅读**
> - 源码与试玩：[github.com/zhoujungis/happy_games](https://github.com/zhoujungis/happy_games) · [happygames.pages.dev](https://happygames.pages.dev)
> - GNU Go 官方：[gnu.org/software/gnugo](https://www.gnu.org/software/gnugo/)
> - Cloudflare Pages Functions 与 D1 文档：[developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/) · [developers.cloudflare.com/d1](https://developers.cloudflare.com/d1/)
> - 项目架构边界：`docs/architecture.md`（`page → shared UI/runtime → game domain → API client → Pages Functions → D1`）
>
> *本文基于 `happy_games` 当前 `master` 分支（2026-09）撰写，接口与表结构以 `schema.sql` / `wrangler.toml` 为准，随版本迭代可能存在时效偏差。*

---

*作者：[Zhou Jun](https://zhoujungis.github.io) · 封面图来自 [Unsplash](https://unsplash.com/photos/photo-1511512578047-dfb367046420) · 部署于 Cloudflare Pages · 欢迎 Star 与 PR！*
