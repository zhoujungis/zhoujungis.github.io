---
title: "Z Bot：本地优先的私人 AI 助理怎么搭"
slug: z-bot-local-first-ai-assistant
cover_image: /photos/z-bot-local-first-ai-assistant-cover.png
date: 2026-11-05
tags: [Electron, TypeScript, AI Agent, SQLite, 桌面应用]
---

> 适用读者：想把 AI 助理放到自己电脑上、又不想把聊天记录和文件路径交给云端的人；正在用 Electron 做桌面 Agent、被权限、路径和打包问题缠住的人；想看清楚一个本地优先产品在哪些地方必须妥协的人
> 结论先行：Z Bot 的核心不是「接一个大模型」，而是把模型关进一个由主进程管理的盒子里：数据库、密钥、工具执行和系统能力都留在主进程，Renderer 只有一层白名单 API；每次有副作用的动作都要先拿到权限；记忆先用 SQLite FTS5 而不是向量库；提醒、上下文、重试都设了硬上限
> 阅读时间：约 55 分钟 | 难度：进阶 | 收获：一套 Electron 桌面 Agent 的进程边界与权限模型 + 上下文和记忆的预算算法 + 十几个在 Windows 上真实踩过的坑

**目录**

- 为什么做一个本地优先的私人助理
- 架构总览：主进程与六个核心包
- 进程边界：Renderer 能做什么，不能做什么
- IPC 契约：白名单、Zod 与脱敏
- 权限系统：先声明，再逐次确认
- 路径安全：授权目录不是字符串前缀
- Agent 循环：什么时候直答，什么时候动手
- 上下文预算：72k 字符怎么花
- 模型层：流式、重试与 fallback 的边界
- 记忆：不上向量库，先用 FTS5
- 提醒调度：setTimeout 的天花板
- 主动提醒与任务恢复
- Windows 集成：通知、OCR 与托盘
- 测试与打包：32 个单测和 2 个 E2E 之后
- 小结
- 相关阅读

---

## 为什么做一个本地优先的私人助理

云端聊天产品的能力已经足够强，但「私人助理」和「通用问答」是两种不同的产品。通用问答不需要知道你的项目目录、上周的待办、你习惯的写作语气；私人助理必须知道，而且这些信息天然不适合离开本机。Z Bot 的出发点很朴素：把个人上下文、长期记忆、任务与提醒放在本地 SQLite 里，模型只负责推理和生成，文件读取、网页抓取、提醒创建这些动作由本机执行，并且每一次都经过用户授权。

这个定位带来三个硬约束。第一，数据必须可解释、可备份、可删除，不能出现「记忆在云端某张表里，用户看不见也删不掉」的状态。第二，模型可以换，OpenAI、OpenAI-compatible、Anthropic、Google、Ollama 都能接，产品不能把用户锁死在某一家。第三，助理要常驻，要能在关闭窗口后继续待命，要能发系统通知，要能读本地文件，因此它必须是一个桌面应用，而不是一个网页。

Z Bot 不是 Coding Agent。它的主循环是「理解、记住、推理、帮忙、行动、学习」，重点在个人上下文和日常事务，而不是在仓库里改代码。仓库 README 明确说，复杂软件开发可以交给 NanoHermes 一类专业 Agent，Z Bot 负责理解需求、派发工作、接收结果并提醒用户。这个边界很重要：一旦把自己当成通用 Coding Agent，工具集、权限模型和上下文预算都会迅速失控。

本地优先也有代价。它没有多设备同步，没有服务端推送，换一台电脑就要重新配置模型和授权目录；提醒只在进程活着时可靠，完全退出后不会补发；本地 OCR 的能力上限取决于 Windows 自带的识别引擎。这些代价在后面的章节里会反复出现。先把产品边界说清楚，后面的技术选择才有依据。

## 架构总览：主进程与六个核心包

技术栈是 Electron 45、React 19、TypeScript 6，数据库用 Node 内置的 `node:sqlite`，检索用 FTS5。仓库是 pnpm workspace，核心代码拆成 `shared`、`database`、`model`、`memory`、`tools`、`bot-core` 六个包，桌面端放在 `apps/desktop`。测试规模是 32 个单元测试加 2 个 E2E，覆盖路径守卫、记忆去重、提醒重复规则、Provider 归一化、运行时和项目停滞提醒等关键分支。

分层很直接。`shared` 放类型、Zod schema、IPC 频道常量和默认设置；`database` 放 `node:sqlite` 封装、迁移和各个 store；`model` 把五类 Provider 收敛成统一的流式事件；`memory` 负责记忆的写入、去重、检索和提示词格式化；`tools` 是工具注册表、路径守卫、网页安全策略和具体工具；`bot-core` 是运行时、上下文管理、权限管理、意图路由和 Agent 循环。`apps/desktop` 的 Electron 主进程把这些包组装起来，并独占数据库、密钥、工具执行和系统能力。

一次对话的数据流可以这样理解：Renderer 通过 preload 调用 `chat.send`，主进程的 IPC 层先用 Zod 校验入参，然后 `BotRuntime.startChat` 立刻把用户消息和一条空的 assistant 消息写入数据库，创建 `requestId` 和 `AbortController`，再异步执行。执行时先做意图判断，直答走单次模型调用，多步任务进入 Agent 循环。模型产生的 `text-delta`、`tool-call`、`finish`、`error` 被归一成 `ChatEvent`，通过 `chat.event` 推回 Renderer。工具调用前先经过权限管理，执行结果再追加到消息数组，最后把 assistant 消息落库。

数据库这边有两个值得单独说的选择。`node:sqlite` 的好处是免原生编译，安装包不需要面对 `node-gyp` 和 ABI 问题；坏处是它是同步 API，所有查询都压在主进程的同一个事件循环上。Z Bot 的处理是把事务做短、把迁移串行化，并在打开数据库时设置 WAL、`synchronous=NORMAL`、5 秒 busy timeout，退出前执行 `wal_checkpoint(TRUNCATE)`，迁移前如果版本落后就整库复制一份备份。它没有把数据库搬到 worker 线程，所以长查询仍然会卡住窗口和 IPC。

### 问题一：同步数据库压在主进程

现象：迁移、批量查询或 checkpoint 期间，窗口事件和 IPC 响应可能被同一个线程占住，界面表现为短暂无响应。

原因：`node:sqlite` 的 `DatabaseSync` 是同步接口，Z Bot 又刻意让主进程独占数据库，没有引入 worker 或独立数据库进程。

解决：用 WAL 提升读写并发，`synchronous=NORMAL` 降低每次提交的 fsync 成本，打开时设 5 秒 busy timeout，迁移用 `BEGIN IMMEDIATE` 串行化，退出前 `wal_checkpoint(TRUNCATE)`；升级前按 `user_version` 判断并整库备份。

代价与遗留：同步 API 的根问题没有消失，只是被约束在「短事务」里。未来如果做全库导出、批量重建索引或大模型日志检索，仍然需要 worker 线程；当前版本选择用简单换稳定。

## 进程边界：Renderer 能做什么，不能做什么

Electron 安全的第一原则是不要把 Node 交给页面。Z Bot 的窗口配置是 `contextIsolation: true`、`nodeIntegration: false`、`sandbox: true`，Renderer 里没有 `require`、没有 `process`、没有文件系统。页面能加载的资源也被 CSP 收窄：默认只允许 `self` 和自定义的 `zbot-media:`，不放开任意 `https:`；所有 Web 权限请求默认拒绝，摄像头、麦克风、地理位置、通知这类能力不会因为页面一句请求就打开。

附件在保存前限制单个 25MB、每次最多 6 个，避免一次对话把本地存储和后续请求撑爆。附件图片通过自定义协议 `zbot-media://attachment/<id>` 读取。主进程注册这个 scheme 时只接受 `hostname === 'attachment'`，路径部分当作附件 id 去数据库和附件目录里查，找不到就返回 404，响应头还带 `default-src 'none'` 的 CSP。也就是说，Renderer 拿不到任意本地路径，只能拿到「已经存进附件表的那张图」。这个设计比直接暴露 `file://` 安全得多，但也意味着附件必须先经过主进程保存，不能随手把任意路径塞进 `<img>`。

preload 是唯一的桥。它用 `contextBridge.exposeInMainWorld('zbot', api)` 暴露一个 `ZBotApi`，大约 40 个方法，按 `app`、`chat`、`conversations`、`memory`、`settings`、`providers`、`webSearch`、`projects`、`roots`、`tasks`、`todos`、`reminders`、`home`、`permissions`、`clipboard`、`screenshot`、`events` 分组。它没有把裸 `ipcRenderer` 丢给页面，页面无法自己拼频道名，也无法监听任意事件。

事件订阅也做了收口。`chat.onEvent`、`events.onNavigate`、`events.onScreenshot`、`events.onTheme` 都返回一个退订函数，内部把监听器包一层再 `removeListener`。这看起来只是 API 美观，实际解决的是 React 组件卸载后的监听泄漏：调用方拿到返回值就能在 `useEffect` 的 cleanup 里退订，不需要记住当初传进去的是哪个函数引用。

这套边界不是「配置一次就永远安全」。只要有人在 preload 里加一个 `invoke(channel, ...args)` 的通用方法，白名单就形同虚设；只要有人在主进程里给 Renderer 开一个 `shell.openPath` 的直通口，路径守卫也会被绕过。Z Bot 的做法是把所有 IPC 都收在 `register.ts` 里，用统一的 `handle()` 包装，逐个挂 schema；但仓库里仍有几个漏网之鱼，后面会单独讲。

## IPC 契约：白名单、Zod 与脱敏

主进程的 IPC 注册有一个统一的 `handle` 包装：频道名、处理函数、可选 schema。每次调用先 `schema.parse(raw)`，Zod 的 `.strict()` 会拒绝多余字段，避免 Renderer 塞进未预期的属性；解析失败时把 `ZodError.issues` 拼成可读的中文错误；处理函数抛出的异常先经过 `redactErrorMessage`，再把脱敏后的消息回给 Renderer。日志里也会记一条 `ipc request failed`，但不把原始密钥、token、cookie 写进去。

```ts
ipcMain.handle(channel, async (_event, raw: unknown) => {
  try {
    const input = schema ? schema.parse(raw) : raw;
    return await handler(input);
  } catch (error) {
    logger.warn({ channel, error: redactErrorMessage(error) }, 'ipc request failed');
    throw new Error(redactErrorMessage(error));
  }
});
```

这段代码的价值在于「默认安全」。新增一个频道时，开发者必须显式决定要不要 schema；不挂 schema 的调用会留在代码里，review 时看得见。它也有一个明显的缺口：`handle` 的第三个参数是可选的，于是 `app:open-path` 和 `web-search:set-key` 就真的没挂 schema。前者只做了「必须在数据目录内」的字符串包含判断，后者直接把 `value` 当字符串用。它们不是最危险的频道，但说明「统一包装」不等于「统一校验」。

### 问题二：IPC 暴露面与校验不一致

现象：`app:open-path` 和 `web-search:set-key` 没有挂 Zod schema；`clipboard:read-text` 和 `screenshot:capture` 通过 IPC 直接执行，没有权限确认，而同名的工具调用却会走 `PermissionManager`。更微妙的是，Renderer 目前并没有调用这两个 IPC，它们属于「存在但未使用」的高权限面。

原因：IPC 是给 UI 用的快捷通道，工具是给模型用的受控通道，两条路径各自演化，权限模型只覆盖了后者。`handle` 的 schema 参数可选，也让漏挂成为可能。

解决：`app:open-path` 用 `path.relative` 判断目标是否在数据目录内，而不是裸字符串比较；密钥类 IPC 只接受字符串并由 ProviderService 走 `safeStorage`；日志和错误消息统一脱敏。工具侧的剪贴板、截图则完整走权限确认，并在权限描述里写清风险。

代价与遗留：未使用的高权限 IPC 仍然留在攻击面上。正确的做法是删掉不需要的频道，或者给它们补上 schema 和权限确认；仓库当前选择了保留，因为未来 UI 可能要用。这是一个明确的待办，不是已经解决的问题。

### 问题三：密钥落盘与日志脱敏

现象：模型 API Key 和网页搜索 Key 都是敏感信息，一旦落盘明文或进入日志，本地应用也会泄露。

原因：桌面应用需要持久化密钥，但 `safeStorage` 在部分 Windows 环境不可用；日志、错误消息、IPC 返回值都可能带上配置对象。

解决：`SecretService.encrypt` 在 `safeStorage.isEncryptionAvailable()` 为 false 时直接抛错，拒绝明文保存；数据库里存的是 `encrypted_api_key`；对外 DTO 剥掉 `encryptedApiKey`，只告诉 UI「已配置」；日志用 pino 的 redact 列表遮掉 `apiKey`、`password`、`cookie`、`encryptedApiKey` 及其嵌套字段，再对错误消息做正则脱敏。

代价与遗留：`safeStorage` 依赖系统凭据服务，换机器或系统配置异常时旧密钥解不开，只能让用户重新输入；日志脱敏是字段名和正则的双重防线，仍然无法保证任意拼接进字符串的密钥一定被识别。对本地应用来说，这是可接受的折中，但不能当成绝对安全。

## 权限系统：先声明，再逐次确认

工具不是「注册了就能跑」。每个工具在执行前先调用 `getPermission()`，产出一个 `ToolPermissionSpec`，里面包含标题、描述、风险级别、作用域和操作列表。`PermissionManager.authorize()` 拿到 spec 后先查持久化规则：命中 `allow` 就直接放行，命中 `deny` 就直接拒绝；只有未命中才创建 `PermissionRequest`，通过 `chat.permission` 事件推给 UI，然后 `await` 用户的决定。

```text
tool.run()
  -> getPermission() -> ToolPermissionSpec
  -> PermissionManager.authorize(spec)
       -> 规则 allow / deny
       -> 未命中：chat.permission -> 等待 UI
       -> AbortSignal 取消 -> cancelForChat
```

用户有四种选择：拒绝、仅本次允许、按作用域允许、取消任务。`allow_once` 故意不落库，下一次同样操作还要再问；`allow_scope` 以「工具名 + 作用域」为键持久化，作用域通常是授权目录或操作类型；`deny` 不会执行工具，只把 `Permission denied by user. The operation was not executed: ...` 作为工具结果回灌给模型，让模型知道这条路被堵住，而不是让整个对话崩掉。取消则通过 `AbortSignal` 和 `cancelForChat` 把挂起的 Promise 全部 reject，避免权限弹窗永远悬着。

这个模型的关键是「拒绝不是异常」。很多 Agent 实现在工具被拒时直接抛错，结果模型看不到拒绝原因，下一轮还会重试同一个动作。Z Bot 把拒绝变成一条普通的工具结果，模型可以改走别的路径，或者向用户解释为什么没做。代价是模型可能反复请求同一权限；当前没有「本次对话内不要再问」的软拒绝，只有持久化的 deny 规则。

权限作用域也有粒度问题。`allow_scope` 绑定的是工具和 scope，不是具体参数；一旦用户允许了某个目录的写入，该目录下后续的写入都不会再弹窗。这符合「减少打扰」的产品目标，但对高风险工具仍然依赖 scope 设计得足够窄。Z Bot 把文件写入、删除、批量移动分别建模，删除走 Recycle Bin，批量操作先展示预览，就是在用工具设计弥补权限粒度的不足。

任务和权限还会互相影响。Agent 执行中如果卡在权限等待，任务状态会置为 `waiting_permission`；应用退出时，`markInterrupted()` 把 `running` 和 `pending` 改成 `paused`，重启后不会自动重放可能产生副作用的中断任务。这个选择牺牲了「重启后自动继续」的便利，换来了「不会在用户不知情时重复删除或移动文件」。

## 路径安全：授权目录不是字符串前缀

文件工具的第一道门是 `resolveAuthorizedPath`。它不接受相对路径，不接受磁盘根目录，不接受设备路径和 UNC 共享路径，路径长度上限 4096，含空字节直接拒绝；然后把目标规范化为真实路径，再和每个授权根的真实路径做「是否在目录内」的判断。写入还要求对应根开了 `allowWrite`，`mustExist` 会检查读写权限，`expected` 会校验目标到底是文件还是目录。

「是否在目录内」不能用 `startsWith`。`C:\Users\me\Documents` 和 `C:\Users\me\Documents-evil` 只差一个后缀，字符串前缀会误判；Z Bot 用 `path.relative` 计算相对路径，拒绝 `..` 和绝对路径逃逸，Windows 下还统一转小写再比较。这个细节在跨平台代码里很容易漏，漏了就是一个目录穿越漏洞。

### 问题四：Windows 8.3 短路径让测试断言失败

现象：测试里用 `mkdtemp` 创建临时目录，再拿 `realpath` 的结果做断言，两者不相等，测试在 Windows 上失败。仓库有过两次修测试的提交，分别是 `f4cf8a8` 和 `b9b45de`。

原因：Windows 会为长文件名生成 8.3 短路径，临时目录和真实路径可能以不同形式返回；测试直接比较字符串，生产代码却做了 `realpath` 归一，导致「测试以为产品错了，其实是断言没归一」。

解决：测试侧先对期望值做同样的规范化；生产侧 `path-guard.ts` 逐级 `realpath`，把父级真实路径和缺失部分拼回去，再统一小写比较。

代价与遗留：路径规范化是「尽力而为」，不是密码学意义上的等价。短路径、大小写、 junction 都可能让两个字符串看起来不同或相同；测试必须跟着平台行为走，不能假设 POSIX 语义。

### 问题五：符号链接逃逸与「目标还不存在」

现象：如果只对目标做 `realpath`，一个尚未创建的写入目标会直接 `ENOENT`；如果目标是指向授权目录外的 junction 或 symlink，`realpath` 之后会跑到根外。两种情况的失败方式完全不同，一个是误报，一个是漏报。

原因：写入操作的目标往往还不存在，不能要求它必须可解析；而符号链接可以在解析后把路径带出授权范围，必须在解析前后都检查。

解决：`canonicalizePotentialPath` 从目标开始向上找最近存在的父级，最多 64 层，把缺失的路径段收集起来，解析到存在的父级后再按原顺序拼回；授权根也做 `realpath`；`expected` 检查在 `lstat` 之后显式拒绝 `isSymbolicLink()`。另外维护一份 Windows 系统目录黑名单，拒绝 `SystemRoot`、`Program Files` 等位置。

```ts
for (let index = 0; index < 64; index += 1) {
  try {
    const canonical = await realpath(current);
    return resolve(canonical, ...missing.reverse());
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT' && code !== 'ENOTDIR') throw error;
    missing.push(basename(current));
    current = dirname(current);
  }
}
```

代价与遗留：检查和使用之间仍有 TOCTOU 窗口，攻击者可以在 `realpath` 之后、真正写入之前把父目录换成链接；64 层上限会拒绝极深路径；系统目录黑名单依赖环境变量，环境变量缺失时保护会变弱。路径守卫能挡住常见误操作和朴素攻击，但不是内核级沙箱。

## Agent 循环：什么时候直答，什么时候动手

`startChat` 的第一步不是调模型，而是落库。它先确认或创建会话，写入用户消息，更新会话标题，再写入一条内容为空的 assistant 消息；然后创建 `requestId` 和 `AbortController`，发出 `chat.started`，最后异步执行。这个顺序保证即使模型调用失败，用户消息和失败占位也在数据库里，前端不会出现「消息发了但历史里没有」的状态。

入口还有两个短路。第一层是显式记忆正则：以「记住」「记一下」「remember」开头的句子直接走记忆写入，不进入模型；第二层是意图路由，短句、问候、问句走 `direct`，待办、提醒、文件、网页、长句走 `agent`。路由结果不是语义分类器，而是一组按优先级排列的正则；它便宜、可测试、无需额外模型调用，但也会误判。

直答模式只调一次模型，适合「解释一下这个概念」「帮我写一句文案」；Agent 模式进入循环：模型输出文本和工具调用，工具执行结果追加到消息数组，再请求模型，直到模型不再调用工具或触到上限。循环最多 20 步、30 次工具调用，整体 5 分钟超时；每次模型调用的 usage 和 retries 会累计到任务记录里。工具结果如果 `verification` 不通过，任务步骤判失败，而不是假装成功。

### 问题六：正则意图路由的边界

现象：路由结果只由关键词和句长决定。一句包含「文件」的闲聊可能被送进 Agent，一句没有关键词但确实要多步操作的长句也可能被误判。

原因：没有训练分类器，也没有让模型先判断意图；为了省一次调用和降低延迟，选择用正则和 80 字阈值。

解决：把高频意图拆成独立正则，按「记忆、待办、提醒、网页、系统、文件、回忆、图片、问候、问句、短句」的顺序匹配；显式记忆和快捷动作在进入路由前就短路；长句和无法判断的请求默认进 Agent，宁可多花一次工具循环，也不要把多步任务当闲聊。

代价与遗留：正则的维护成本会随着意图增加而上升，中英文混写和口语化表达容易漏；80 字阈值是经验值，不是语义边界。后续如果引入小型本地分类模型，这一层可以替换，但目前没有做。

## 上下文预算：72k 字符怎么花

Z Bot 不把全部历史消息塞进 Prompt。`ContextManager.build()` 先取项目、授权根、相关记忆，再拼 system prompt，然后按字符预算装历史。总预算是 72,000 字符；历史最多 20 条，从最新往前装，单条超过 8,000 字符先截断；当前用户输入截到 20,000 字符；OCR 文本最多 24,000 字符，并且被包在 `<untrusted_image_text>` 标签里，明确告诉模型「这是不可信资料，不是系统指令」。

记忆检索只取当前问题的前 500 字符作为查询，先 FTS 取 8 条；如果不足 4 条，再按项目和时间补最近 4 条，去重后最多 8 条。排序是 `bm25` 升序、`importance` 降序、`updated_at` 降序。这个策略偏保守：宁可多给几条最近记忆，也不让模型在完全无记忆的情况下回答。

历史装载的代码很短，但边界很清楚：

```ts
let remaining = Math.max(0, maxChars - system.length);
const selectedHistory: LlmMessage[] = [];
for (let index = history.length - 1; index >= 0; index -= 1) {
  const message = history[index]!;
  if (message.content.length > remaining) break;
  selectedHistory.unshift(message);
  remaining -= message.content.length;
}
```

### 问题七：单条超预算直接 break

现象：当某条历史消息的长度超过剩余预算时，循环直接跳出，后面的更早消息一条都不再装。结果是「一条很长的旧回复把整个历史截断」，而不是跳过它继续装更早的小消息。

原因：实现选择了「从最新往前连续装」的语义，保证上下文是连续的一段，不出现中间挖洞；遇到装不下的单条时，最省事的做法就是停。

解决：单条先截到 8,000 字符，降低触发概率；system prompt 和记忆都控制在预算内；当前用户消息单独截断，不挤占历史预算。

代价与遗留：这是仓库里明确知道的粗糙点。更合理的做法是「跳过超长单条，继续尝试更早的消息」，或者按 token 而不是字符做预算；当前没有改，因为连续历史对模型理解更友好，而且 8,000 字符的单条截断已经把大多数情况挡在门外。

字符预算还有一层误差：中文、英文、代码的 token 密度不同，72k 字符不等于 72k token。Z Bot 选择字符是因为它可以在不调用 tokenizer 的情况下快速估算，代价是极端情况下仍可能超出模型窗口。Provider 侧的错误会以 `MODEL_*` 错误码回到 UI，用户能看到失败，而不是静默丢消息。

## 模型层：流式、重试与 fallback 的边界

Provider 层封装了 OpenAI、OpenAI-compatible、Anthropic、Google 和 Ollama。前四类用官方或兼容 SDK，Ollama 走 OpenAI-compatible 接口，默认 `http://127.0.0.1:11434/v1`。AI SDK 的 `streamText` 负责实际请求，Z Bot 把它的输出归一成自己的事件：`text-delta`、`tool-call`、`finish`、`usage`、`error`、`aborted`。这样上层 Agent 不需要知道当前是哪一家 Provider，也不需要处理各家的流式格式差异。

重试策略是每个 Provider 最多 3 次尝试，退避 500ms、1000ms、2000ms；Provider 侧把 AI SDK 的 `maxRetries` 设为 0，避免 SDK 内部再重试一层。只有可重试错误才重试，`MODEL_KEY_MISSING`、`MODEL_BASE_URL_MISSING` 这类配置错误直接失败。fallback 模型在 primary 的所有尝试都失败后才会启用，且一旦已经输出过文本，就不再 fallback。

```ts
const retryable = normalized instanceof ModelRequestError ? normalized.retryable : true;
if (!retryable || attemptNumber >= maxAttempts || textEmittedRef.value) {
  break;
}
retries += 1;
await delay(500 * 2 ** (retries - 1), signal);
```

### 问题八：重试造成前端重复文本

现象：流式响应已经吐出几个字，请求在中途失败，重试后模型从头再答一遍，前端就看到「前半段 + 完整回答」的重复文本。

原因：重试逻辑只关心「请求失败了」，没有关心「失败前是否已经产生可见增量」；AI SDK 自身还可能在内层再重试，放大问题。

解决：用一个 `textEmittedRef` 记录本次尝试是否已经发出 `text-delta`；只要为 true，就禁止当前 Provider 重试，也禁止切到 fallback；Provider 侧 `maxRetries: 0`，把重试收敛到 `streamModel` 这一层。

代价与遗留：已经输出的半截文本不会自动撤回，用户可能看到一句不完整的话后接错误提示；极端情况下，模型在工具调用之后失败，重试也会被禁止，任务只能判失败。这个策略换的是「不重复」而不是「一定成功」，对聊天体验更重要。

整体 5 分钟超时是另一道闸。它覆盖整个对话，不只是单次模型请求；超时后 `AbortController` 触发，正在进行的流、权限等待和工具执行都会收到取消信号。取消会写入 `cancelled` 状态，不会把半截文本当成成功结果。

## 记忆：不上向量库，先用 FTS5

Z Bot 的记忆分五类：`user`、`project`、`event`、`task`、`global`。它们存在 `memories` 表里，表是 `STRICT` 的，字段包括内容、类型、项目 id、重要度、置信度、过期时间、归档时间；标签单独放在 `memory_tags`，用外键级联删除。检索用 `memories_fts` 这张 FTS5 虚拟表，`content='memories'`、`content_rowid='rowid'`，三个触发器负责插入、更新、删除的同步。

中文检索是这里最容易被低估的问题。FTS5 默认的 `unicode61` 分词不会把中文切成有意义的词，整句中文往往被当成一个 token，查询「发布流程」匹配不到「发布流程要先 dry-run」以外的内容。Z Bot 把 tokenizer 改成 `trigram`，按三字符滑窗建索引，这样中文短语可以被部分匹配；查询短于 3 个字符时 FTS 无法工作，降级为 `instr(lower(content), lower(query))` 做子串扫描。

```sql
CREATE VIRTUAL TABLE memories_fts USING fts5(
  content,
  content='memories',
  content_rowid='rowid',
  tokenize='trigram'
);
```

### 问题九：FTS5 默认分词不切中文

现象：英文关键词能搜到，中文整句搜不到；把 tokenizer 换到 `trigram` 后，两个字的查询又完全匹配不上。

原因：FTS5 的默认分词面向空格分隔的语言，中文没有空格；`trigram` 的最小匹配单位是三个字符，短查询没有足够的 n-gram。

解决：建表时用 `trigram`；查询长度大于等于 3 时走 `MATCH`，用双引号包住查询并转义内部引号；长度小于 3 时走 `instr(lower(...))`。测试里用「简洁」这个两字词专门覆盖降级路径。

代价与遗留：`trigram` 索引比默认分词大，写入和更新成本更高；两字查询退化为全表扫描，记忆量大时会慢；没有同义词、没有拼音、没有语义召回，「上线」和「发布」仍然连不上。v0.1 接受这些限制，把向量库留到以后。

记忆写入只有两个入口：入口正则识别「记住……」并直接写入，或者模型在对话中主动调用 `remember` 工具。后者受 `memory.autoExtract` 开关约束，关掉之后模型不能自动写。仓库没有「对话结束后统一抽取」的后置流程，这是一个有意的取舍：后置抽取需要额外模型调用、需要处理重复和幻觉，v0.1 先把「用户明确说记住」做可靠。

去重是规范化后的精确相等：同 type、同 project，`lower(trim(content))` 相等才算重复；命中后取 importance 和 confidence 的较大值，合并 tags。没有语义去重，没有衰减打分；过期只做 `expiresAt -> archivedAt` 的归档，不做按时间衰减的排序。检索排序是 `bm25`、importance、updated_at 三层，简单、可解释，也足够快。

这套记忆系统更像「索引」而不是「大脑」。它不会自动总结对话，也不会因为某条记忆很久没用就降低权重；它的优势是每一条都能在 UI 里看到、编辑、删除，用户能解释为什么模型提到了某件事。对私人助理来说，可解释性比召回率更重要。

## 提醒调度：setTimeout 的天花板

Scheduler 的实现很轻：每条启用的提醒一个 `setTimeout`，启动或提醒变更时 `refresh()` 清空全部定时器再重排。提醒触发后写一条 `reminder.triggered` 事件，按设置发 Windows 通知，然后用 `nextReminderTrigger` 计算下一次触发时间；一次性提醒把 `enabled` 置 0，重复提醒推进到下一个未来时刻。

问题在于 `setTimeout` 的上限。Node 的定时器延迟超过 2 的 31 次方减 1 毫秒（约 24.8 天）会溢出，表现为立即触发。Z Bot 把上限钳到 `2_147_000_000` 毫秒，超过就只睡这一段，醒来后重新读取提醒并再次排程，形成链式重排。

```ts
const MAX_TIMEOUT = 2_147_000_000;
const delay = reminder.triggerAt - Date.now();
if (delay > MAX_TIMEOUT) {
  const timer = setTimeout(() => {
    this.timers.delete(reminder.id);
    this.schedule(this.reminders.get(reminder.id) ?? reminder);
  }, MAX_TIMEOUT);
  timer.unref?.();
  this.timers.set(reminder.id, timer);
  return;
}
```

### 问题十：超长提醒定时器溢出

现象：设置一个一个月后的提醒，应用却在启动后立刻弹出通知。

原因：`setTimeout` 的延迟参数是 32 位有符号整数，超过 `2^31-1` 毫秒会回绕成负数或 0，定时器立即执行。

解决：超过上限时只排一段 24.8 天的定时器，回调里重新读取提醒并再次排程；负延迟按 0 处理，保证已经过期的提醒立即触发一次；一次性提醒触发后禁用，重复提醒用 `nextReminderTrigger` 推进，不补发历史多次。

代价与遗留：链式重排意味着应用必须一直活着；如果进程完全退出，定时器不存在，错过的提醒不会补发。README 明确承认这一点。它没有使用 Windows 任务计划程序，也没有在启动时扫描「过去 24 小时本应触发但没触发」的提醒，因为补发策略涉及「补一次还是补全部」的产品决策，v0.1 选择不做。

还有一个小边界：启动时如果 `delay` 为负，代码按 0 立即触发一次。对一次性提醒，这会把「已经过期但没触发」的提醒补出来；对重复提醒，它只触发当前这一次，然后推进到下一个未来时刻，不会把过去错过的每一天都补一遍。这个语义是对的，但用户如果期望「开机后把错过的都补上」，会觉得少了一条。

## 主动提醒与任务恢复

Proactive 服务负责项目停滞提醒。它启动 10 秒后做第一次检查，之后每 6 小时一次；`running` 标志防止重入，检查期间不会叠加第二次。每次取 400 条事件，按项目找最近一条 `project.inactivity`，如果这条通知的时间晚于项目最新活动时间，就跳过；否则按阈值判断是否提醒。阈值默认 7 天，只有项目目录在授权范围内时，才把目录 `mtime` 算作活动。

这个去重逻辑解决的是「每次检查都重复提醒同一个停滞项目」。它把「上次提醒时间」和「最新活动时间」放在一起比较：只要项目在提醒之后有过活动，就应该重新计时；如果提醒之后一直没有活动，就不再重复。代价是事件表要保留足够久，400 条是一个经验上限，事件量大时旧记录会被挤掉，可能导致重复提醒。

任务恢复是另一半。应用退出时，`markInterrupted()` 把 `running` 和 `pending` 改成 `paused`，重启后不会自动继续。Agent 任务可能有副作用：写文件、移动文件、删除到回收站、发通知。如果重启后自动重放，用户可能看到重复删除或重复移动，这比「任务停在暂停状态」危险得多。

### 问题十一：重启后任务副作用重放

现象：任务执行到一半应用被关闭，重启后如果按原状态继续，工具调用可能再执行一次。

原因：任务状态和工具调用记录是持久化的，但「执行到哪一步」和「副作用是否已经发生」没有事务级关联；模型重放时可能重复调用同一个工具。

解决：启动时调用 `markInterrupted()`，把 `running`、`pending` 改成 `paused`；权限等待中的任务置为 `waiting_permission`；任务不会自动恢复，用户需要手动确认后重新发起。工具侧还有幂等设计：写入带内容哈希，移动和删除有预览，删除走 Recycle Bin。

代价与遗留：用户失去了「重启后自动继续」的便利，长任务被中断后要重新描述需求；`paused` 任务没有一键恢复，只能重新发起。这是安全优先的选择，不是完整体验。

托盘常驻、关闭最小化、单实例、开机启动是这套常驻能力的基础。单实例用 `requestSingleInstanceLock()`，第二次启动直接退出并把已有窗口唤到前面；关闭窗口默认最小化到托盘，只有显式退出才真正结束进程。这个行为让「提醒」和「主动检查」有地方跑，但也让用户容易误以为应用已经退出。

## Windows 集成：通知、OCR 与托盘

Windows 通知是桌面助理的刚需，也是最容易「代码没错但不弹」的地方。Z Bot 在启动时调用 `app.setAppUserModelId('com.zbot.desktop')`，这是 Windows 通知的前置条件；发送前用 `Notification.isSupported()` 兜底，不支持就返回 false，不抛异常。通知点击可以导航到指定页面，比如提醒跳到 Home，项目停滞跳到 Memory。

### 问题十二：Windows 通知不弹

现象：提醒到点了，日志显示 `reminder fired`，但桌面没有出现通知。

原因：Windows 的通知需要正确的 App User Model ID，否则系统不知道是哪个应用在发；专注助手、通知权限关闭、托盘进程未运行也会让通知被静默拦截。

解决：主进程启动时设置 `setAppUserModelId`；`NotificationService.show` 先检查 `isSupported()`；README 把排查步骤写清楚，包括检查系统通知设置、专注助手、应用是否在托盘运行。

代价与遗留：`isSupported()` 只能判断平台能力，不能判断用户是否关了通知；应用没有做「通知失败后回退到应用内横幅」的兜底，用户可能错过提醒。这是当前版本的空白。

OCR 的路径更能说明「方案会变」。仓库最终用 Windows 自带的 `Windows.Media.Ocr`，通过 PowerShell 子进程调用：`-NoProfile`、`-NonInteractive`、`-ExecutionPolicy Bypass`、`windowsHide`，30 秒超时，1MB 输出缓冲；识别结果写到临时文件，读回后截到 20,000 字符，失败返回 `null`，由 Vision 模型兜底。

### 问题十三：OCR 从 Tesseract 迁到系统 OCR

现象：最初用 Tesseract，构建配置里还残留复制 `@tesseract.js-data` 的插件，但运行时代码已经不再引用它。

原因：Tesseract 需要额外语言数据和原生依赖，体积、启动速度和中文识别效果都不理想；Windows 10/11 自带 OCR 引擎，系统和语言包已经安装，直接调用更轻。

解决：改成 PowerShell 子进程调 `Windows.Media.Ocr`，把脚本作为资源打包；失败返回 `null`，让上层走 Vision 模型；子进程隐藏窗口、限制超时和输出大小，避免卡死主进程。

代价与遗留：PowerShell 子进程有启动开销，30 秒超时对超大图可能不够；依赖 Windows 语言包，非中文系统识别中文可能失败；构建配置里的 Tesseract 残留没有清理，属于技术债，不影响运行但会误导后来的人。

托盘和快捷键是最后一块。托盘菜单提供显示、快捷提问、退出；`Ctrl+Space` 唤起 Quick Ask，`Ctrl+Shift+Z` 截主屏并附加到 Chat。单实例和开机启动让这些入口稳定存在，但也意味着应用生命周期比普通窗口应用长，退出时要记得 `scheduler.stop()`、`proactive.stop()`、`database.close()` 和 `wal_checkpoint` 的顺序。

## 测试与打包：32 个单测和 2 个 E2E 之后

32 个单元测试覆盖的是「容易错且错了不容易发现」的地方：路径守卫的短路径和符号链接、记忆的精确去重、提醒的重复规则、Provider 的事件归一化、运行时的权限拒绝、项目停滞提醒的去重。2 个 E2E 覆盖真实窗口的启动和基本对话流程。测试规模不大，但每个用例都对应一个真实的坑，这比追求覆盖率数字更有价值。

打包是另一类坑。仓库的自动发布只出 portable 和 MSI，NSIS 安装包的卸载器会被杀毒软件锁定，因此没有进入发布产物。Windows 未签名安装包会触发 SmartScreen，用户需要多点一次「仍要运行」。`playwright` 和 `jsdom` 被列在运行时依赖里，会抬高安装包体积；仓库没有实测体积数字，所以这里不编具体大小，只说这是一个已知的成本项。

### 问题十四：NSIS 被锁与运行时依赖膨胀

现象：NSIS 安装包没有进入自动发布产物，只保留 portable 和 MSI；安装包体积比预期大。

原因：NSIS 卸载器在构建或扫描阶段被杀毒软件占用/锁定；`playwright`、`jsdom` 这类本应只在测试或工具链里用的包被写进了 `dependencies`，打包器会把它们当运行时依赖收进去。

解决：发布脚本改成 `electron-builder --win portable msi`，绕过 NSIS；`asar` 开启；签名问题在文档里说明，不假装已经解决；依赖问题留待后续把测试依赖移到 `devDependencies` 或做 bundler 排除。

代价与遗留：没有 NSIS 就没有传统的安装向导和开始菜单卸载项，用户只能拿到便携版或 MSI；未签名导致 SmartScreen 警告；依赖膨胀没有实测数字，无法判断具体收益。这三件事都还没有闭环。

## 小结

Z Bot 的实现思路可以压缩成四句话。第一，把危险能力收在主进程：数据库、密钥、工具、系统调用都不进 Renderer，preload 只暴露白名单方法。第二，把权限做成流程而不是开关：工具先声明 spec，规则命中才放行，未命中就等用户，拒绝变成工具结果而不是异常。第三，把预算写死：上下文 72k 字符、历史 20 条、记忆 8 条、Agent 20 步、30 次工具、5 分钟、提醒定时器 24.8 天，这些数字是可以被审查的。第四，把记忆做成可解释的索引：FTS5 加 trigram，精确去重，过期归档，不上向量库。

它的价值不在于「功能多」，而在于每个功能都有一条可追溯的边界：哪一步在主进程、哪一步要授权、哪一步会失败、失败后用户看到什么。它也有明确的粗糙点：单条超预算直接 break、IPC 还有未校验的暴露面、OCR 构建配置残留、NSIS 和签名没有闭环、完全退出后提醒不补发。把这些写出来，比假装它们不存在更有用。

如果你也在做桌面 Agent，建议先抄这三件事：主进程独占 + 白名单 preload、工具权限的「声明-查规则-等待」流程、路径守卫的 realpath 归一。剩下的上下文预算、记忆检索和调度器，可以按你的产品形态再调。

## 相关阅读

- [Agent 记忆：不接向量库也能长期记忆](/article/agent-memory-without-vector-db/)
- [Agent 的提示词注入边界怎么划](/article/agent-prompt-injection-boundary/)
- [不靠 async 的 Agent 并发控制](/article/agent-concurrency-without-async/)
- [指标与分布式追踪：从埋点到排障](/article/metrics-and-distributed-tracing/)
- [用 Rust 写一个 Coding Agent](/article/nanohermes-rust-coding-agent/)
