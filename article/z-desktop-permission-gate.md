---
title: "Z Desktop：44 个本机工具怎么过闸"
slug: z-desktop-permission-gate
cover_image: /photos/z-desktop-permission-gate-cover.png
date: 2026-11-18
tags: [Rust, Tauri, Agent, 桌面应用, 安全]
---

> 适用读者：正在做 desktop agent、computer-use 或「让模型操作本机」的工程师；关心权限模型、审批交互与命令分级的人；想把安全边界放在 Rust 而不是前端 prompt 里的人
> 结论先行：Z Desktop 的 44 个工具全部只能走 `request_tool_execution()` 一个入口。五级风险里 CRITICAL 直接拦截，HIGH 永远要人确认，Always-allow 只对 MEDIUM 及以下生效；Shell 命令按 `;` `&&` `||` `|` 拆段后取最高风险，避免 `echo ok && rm -rf` 借 SAFE 白名单自动执行。真正值得复盘的，是这些规则落成代码之后仍然存在的七个缺口
> 阅读时间：约 18 分钟 | 难度：进阶 | 收获：一套可复用的五级风险 + 审批队列实现 + Shell 分段判级与路径沙箱的具体写法 + 44 个工具的分层清单 + 一份不粉饰的绕过面清单

**目录**

- 桌面 Agent 的难点不在模型，在不可逆
- 分层：循环在前端，闸门在 Rust
- 五级风险：把「能不能做」变成「谁批准」
- Shell 分级：整条命令不是一个等级
- 审批队列：`approval_required` 是返回值，不是异常
- 路径沙箱：读写不对称是刻意的
- Agent Loop 的四道刹车
- 44 个工具的分层与上限
- 停止：取消标志、流中断与进程树
- 浏览器与 UIA：为什么先找 AutomationId
- 七个仍然存在的缺口
- 小结

---

## 桌面 Agent 的难点不在模型，在不可逆

让模型读文件、列目录、查进程，这些都不难。难的是另一类调用：删除、覆盖、杀进程、关机、改注册表。它们共同的特征是不可逆，而模型对「执行完会发生什么」并没有可靠的直觉。

Z Desktop 是一个 Windows 桌面工作台：Tauri 2 + Vue 3 + Rust，44 个本机工具覆盖文件、Shell、进程、窗口、GUI 自动化、浏览器、截图和剪贴板。它把产品命题压成一句话：**模型可以规划，但每一次真正碰到机器的动作，都必须先经过 Rust 侧的判定。**

这条原则落到三处代码约束：

- 规划与状态机放在前端（`src/agent/loop.ts`），因为流式展示和 UI 状态迁移在那里最自然；
- 权限判定、路径沙箱、工具执行、进程回收全部在 `src-tauri`，前端无法绕过 `invoke` 直接调工具；
- 工具 schema 只有一份，由 Rust 的 `tool_definitions()` 提供，前端只维护展示元数据，避免双份定义漂移。

## 分层：循环在前端，闸门在 Rust

一次工具调用的完整链路是这样的：

```text
Agent Loop (Vue)
  → invoke("tool_execute", { taskId, tool, input, approvalRequestId? })
  → security::permission::decide()
      ├─ CRITICAL           → { status: "blocked" }
      ├─ 需要审批           → pending_approvals 入队
      │                       emit("approval-requested")
      │                       前端等待 approval-resolved
      │                       allow → 带 requestId 重发
      │                       deny  → 作为失败观察结果返回
      └─ 自动允许 / 已批准   → tools::registry::execute()
  → emit("activity", tool_started / completed / failed / blocked)
  → 返回 { status, result | error | reason, durationMs }
```

Rust 侧只有 20 个 Tauri 命令，大多是薄转发。真正有分量的判断集中在三个文件：`security/risk.rs` 负责「这条命令有多危险」，`security/permission.rs` 负责「这个危险等级要不要人批」，`security/sandbox.rs` 负责「这个路径能不能写」。

## 五级风险：把「能不能做」变成「谁批准」

风险等级有五个：SAFE、LOW、MEDIUM、HIGH、CRITICAL。它解决的不是「工具能不能调用」，而是「这一次调用由谁拍板」。

| 等级 | 默认行为 | 典型工具 |
| --- | --- | --- |
| SAFE | 自动允许 | 读文件、列目录、查进程、截图、读剪贴板 |
| LOW | 可配置自动 | 复制、重命名、启动应用、写剪贴板 |
| MEDIUM | 需审批（可配置自动） | 写文件、移动文件、关窗口、UI 点击、未知 Shell |
| HIGH | 每次确认 | 删除、杀进程、`git push`、安装软件 |
| CRITICAL | 默认禁止 | 格式化、关机、改 HKLM、关 Defender |

默认设置是「宽 SAFE、严其余」：`auto_approve_safe = true`，`auto_approve_low = false`，`auto_approve_medium = false`，`shell_safe_auto_exec = true`，`max_steps = 30`（可调 1–200）。这个组合意味着：读操作不打扰人，写操作默认要确认，危险操作根本没有确认入口。

工具本身的等级登记在 `state.rs::tool_risk()`：SAFE 一组、LOW 一组、MEDIUM 一组、HIGH 只有 `filesystem.delete` 与 `process.kill`，未知工具一律回落 MEDIUM。这里有一个刻意的默认值选择：**未知不等于安全**。

## Shell 分级：整条命令不是一个等级

`shell.exec` 是唯一一个不能靠工具名定级的工具。`git status` 是只读，`git clean -fdx` 会删掉未跟踪文件，它们都叫 Shell。所以最终等级由命令内容决定。

`classify_command()` 先把命令按 `;`、换行、`&&`、`||`、`|` 拆成段，再逐段判级，取最高值。这个拆分不是洁癖，而是堵一个具体的绕过：

```text
echo ok && rm -rf ./build
```

如果只看整条命令里是否出现 SAFE 关键字，`echo` 会让它通过；拆段之后，`rm -rf ./build` 会被判为 HIGH，整条命令因此必须审批。仓库里的测试把这个行为钉死了：

```rust
assert_eq!(classify_command("echo ok && rm -rf ./build"), RiskLevel::High);
assert_eq!(classify_command("git status; git clean -fdx"), RiskLevel::High);
assert_eq!(classify_command("dir | Remove-Item -Recurse"), RiskLevel::High);
assert_eq!(classify_command("dir | findstr foo"), RiskLevel::Safe);
```

判级顺序是：CRITICAL 模式（31 条）→ HIGH 模式（35 条）→ 破坏性首词 → 只读判断 → 其余 MEDIUM。CRITICAL 名单里既有 `format`、`shutdown`、`diskpart`、`vssadmin delete`，也有 `rm -rf /` 和 fork 炸弹；HIGH 名单里除了删除、杀进程、包管理器安装，还包括一组会改写历史的 git 命令：`git reset --hard`、`git clean`、`git push`、`git checkout --`。

只读判断有两个细节值得抄：

- 首 token 必须构成完整单词。`cdx.exe` 不能因为前缀是 `cd` 就判 SAFE，`catalog.exe` 不能命中 `cat`，`lsblk` 不能命中 `ls`。实现上是在前缀匹配后检查下一个字符是否为空白或 `-`。
- 只要出现重定向 `>`，就不算只读。`echo hi > out.txt` 是 MEDIUM，`echo hi` 才是 SAFE。

这也带来两个已知的误判面，后面会展开：拆段不认识引号和转义，`echo "a && b"` 会被拆开；模式匹配是词法级的，`powershell -enc <base64>` 这种编码执行可以绕过所有关键字。

## 审批队列：`approval_required` 是返回值，不是异常

需要审批时，工具不会抛错，而是返回一个结构化结果：

```json
{ "status": "approval_required", "requestId": "...", "riskLevel": "high", "reason": "需要用户审批" }
```

`request_tool_execution()` 先把请求放进 `pending_approvals`，再广播 `approval-requested`。顺序不能反：如果先广播，用户可能在事件到达后立刻点「允许」，而 `resolve_approval` 还找不到这个 requestId。

审批有三个结果：拒绝、允许一次、总是允许。它们的语义分别是：

- **拒绝**：请求立即从队列移除，前端把 `{ status: "failed", error: "用户拒绝该操作" }` 作为工具观察结果交回模型。模型可以换一条路，但不会得到异常。
- **允许一次**：请求保留到重放。重发时必须同时匹配工具名和完整输入 JSON，匹配后消费掉这条请求。这是防「批准 A、执行 B」的关键：只比对工具名不够，参数可以在两次调用之间被改掉。
- **总是允许**：写入 `approval_rules` 表，但只在 `effective_risk <= MEDIUM` 时生效。HIGH 即使命中了规则也会继续要求审批。

拒绝和取消都会清理队列。`cancel_task()` 只清理属于该任务的审批请求，并给每个残留 requestId 发一条 `approval-resolved: deny`，避免审批卡片在 UI 上挂着不动；任务正常结束时 `finish_task()` 做同样的清理。这些看起来是边角，实际是长跑应用的必需项：审批表如果只增不减，跑一天就会泄漏。

## 路径沙箱：读写不对称是刻意的

`check_path()` 只做一件事：在写入类操作（write、mkdir、copy、move、rename、delete）前，拒绝落在系统保护目录里的目标。保护目录包括：

```text
C:\Windows
C:\Program Files
C:\Program Files (x86)
C:\ProgramData\Microsoft
/bin  /boot  /etc  /lib  /lib64  /sbin  /usr  /var  /sys  /proc
```

实现上有三个细节，都是为了处理 Windows 路径的坑：

1. **先消 `..`，再 canonicalize。** 只做字符串前缀比较会被 `C:\Windows\..\Users\...` 绕过；`normalize()` 逐组件处理 `ParentDir`，`resolve_real()` 对不存在的目标逐级向上找到已存在祖先再拼接剩余部分，这样即使文件还没创建，也能识别父目录里的符号链接。
2. **去掉 `\\?\` verbatim 前缀。** 否则 `\\?\C:\Windows` 与 `C:\Windows` 比较不相等。
3. **统一分隔符再比较。** Windows 上 `/etc/passwd` 会被规范化为 `\etc\passwd`，如果不把 `\` 换成 `/`，Unix 保护目录在 Windows 上就形同虚设。

读写不对称是刻意的：`check_path()` 对 `PathOp::Read` 直接放行，只对 `PathOp::Mutate` 做保护目录检查。所以读 `C:\Windows\System32\drivers\etc\hosts` 是允许的，写它不行。这个设计的边界是「不许破坏操作系统」，不是「把 Agent 关进项目目录」——用户自己的 `D:\Downloads` 本来就应该能写。

## Agent Loop 的四道刹车

前端循环是一个显式状态机：`IDLE → THINKING → PLANNING → EXECUTING → OBSERVING → VERIFYING`，未通过或需继续时回到 `THINKING`，用户停止进 `CANCELLED`，异常进 `ERROR`。主循环在 `src/agent/loop.ts`，四道刹车都写死在那里：

| 机制 | 实现 |
| --- | --- |
| 最大步数 | 默认 30，钳制在 1–200；用尽后任务标记 failed，并提示去设置里调大 |
| LLM 重试 | 临时错误自动重试一次；重试前把失败原因写进对话，要求「从当前进度继续」 |
| 观察截断 | 单条工具结果 JSON 序列化后最长 4000 字符，超出直接截断 |
| 验证收敛 | 验证器连续两次不通过，保留最终输出并附上验证意见，不再继续循环 |

验证器本身也值得看。它只问模型一个问题：「任务是否已完成且验证通过？只回答 yes 或 no，随后用一句话说明原因。」解析时只看回答开头的第一个词，而不是全文搜索 yes/no——否则 `no, but it could be yes` 会被误判为通过。验证器调用失败时会直接采纳最终输出（fail-open），只有在用户主动停止导致的取消时才向上抛错。这是一个明确的取舍：宁可放过一次未验证的完成，也不要把任务卡在「验证器不可用」的死循环里。

## 44 个工具的分层与上限

工具清单不是越多越好，而是每一类都要有明确的上限，否则模型一次调用就能把内存或上下文打满。

| 类别 | 数量 | 关键上限 |
| --- | --- | --- |
| 文件系统 | 10 | 列目录 2000 条、深度 1–8；读默认 2 MB、硬上限 50 MB；搜索默认 200、上限 2000 |
| Shell | 1 | 默认超时 120 秒、上限 1 小时；stdout/stderr 各只留尾部 100 KB |
| 进程 | 4 | 列表默认 100、上限 1000 |
| 窗口 | 6 | 枚举、查找、聚焦、最小化、最大化、关闭 |
| UI 自动化 | 7 | 树深度默认 4、上限 10；查找超时 5000 ms |
| 浏览器 | 11 | CDP 驱动本机 Chrome/Edge；下载上限 10 MB；提取上限 20000 字符 |
| 截图 | 3 | 全屏、窗口、区域；支持多显示器与负坐标 |
| 剪贴板 | 2 | 读文本、写文本 |

几个实现细节比数量更重要：

- `filesystem.write` 把 `content` 设为必填，而不是默认空串。LLM 漏传参数时，默认空串会静默清空目标文件——这是一个真实存在过的事故模式。
- `filesystem.read` 用前 8 KB 判断二进制（是否含 `0x00`）。二进制走 base64，文本走 UTF-8 宽松解码，并返回 `truncated` 标志，让模型知道它看到的不是全部。
- `shell.exec` 的输出读取在独立线程里做，缓冲区始终只保留尾部 100 KB；进程结束、超时或取消后，用 `taskkill /PID <pid> /T /F` 终止整棵进程树，`Child::kill()` 作为兜底，防止 `wait()` 永久阻塞。
- 浏览器用 `chromiumoxide` 以带界面模式启动 Chrome/Edge，会话存在 `AppState` 里复用同一个页面；`browser.open` 第二次调用不会开新实例，只做导航。
- UIA 的定位优先级是 `AutomationId > Name > ControlType > 父子关系 > UI Tree`，点击优先走 Invoke 模式，失败才用坐标点击。坐标是最后手段，因为窗口一移动就会点错。

## 停止：取消标志、流中断与进程树

「停止」在桌面 Agent 里不是 UI 上的一个按钮，而是一条要贯穿三层的信号：

1. 前端 `requestStop()` 置 `stopRequested`，并 `abort()` 当前 LLM 流式请求；
2. 循环在每一步开头、每个工具调用前、审批等待返回后都检查取消标志；
3. Rust 侧 `cancel_task()` 置任务取消标志、清理该任务的待审批请求，并把该任务登记过的 PID 逐个 `kill_tree()`。

Shell 的超时与取消共用同一个 `wait_loop`：每 100 ms 轮询一次 `try_wait()`，超时或取消就杀进程树。完成后从两个 channel 收 stdout/stderr，最多等 2 秒；读不到就用占位文本，不让取消流程卡在管道上。

可观测性也不是事后补的：每次工具调用写 `task_steps`（输入截到 4000 字符、输出截到 8000 字符），每次状态变化写 `events` 表并广播 `activity`，任务详情页的时间线就是这两张表的投影。

## 浏览器与 UIA：为什么先找 AutomationId

GUI 自动化最容易写成「截个图，让模型猜坐标」。Z Desktop 的顺序反过来：能用控件语义就用语义，坐标只作兜底。

- `ui.inspect` 遍历 UI 树，返回每个元素的 Name、AutomationId、ControlType 和矩形；
- `ui.find` 按 `automation_id`、`name`、`control_type` 依次收窄；
- `ui.click` 优先 `UIInvokePattern`，没有 Invoke 模式才取控件中心点做鼠标点击；
- `ui.getValue` 优先 Value 模式，其次 Text 模式，最后才读 Name。

这个顺序的收益是稳定性：AutomationId 不随窗口位置和 DPI 变化，Name 会随语言变化，ControlType 只能定位到一类控件，坐标什么都不保证。代价是覆盖率——自绘控件、游戏、部分 Electron 应用根本不暴露 UIA 树，这时候仍然要退回截图和坐标。

## 七个仍然存在的缺口

把限制写清楚，比把功能写清楚更有价值。以下七条都能在源码里指到具体位置：

1. **命令拆段不认识引号和转义。** `split_segments()` 只看字符，`echo "a && b"` 会被拆成两段；PowerShell 的反引号转义、单引号包裹同样不处理。这会造成误报（把一条安全命令判成需要审批），但不会造成漏报。
2. **词法匹配无法覆盖编码执行。** `powershell -EncodedCommand <base64>`、按别名调用、下载后执行，都不会命中关键字名单。这不是名单不够长的问题，是词法方案的天花板。
3. **读没有边界，只有写有。** 沙箱只拦写入类操作。提示注入可以让 Agent 读 `C:\Users\...\.ssh\id_rsa` 再把内容写进它有权写的文件；审批卡在「工具调用」粒度，不追踪数据流。
4. **HIGH 的「总是允许」永远不生效。** 这是刻意的，但也意味着用户每天要重复批准同一批高风险操作，长期会诱导他们去改全局设置，而不是逐次确认。
5. **验证器 fail-open。** 验证器本身调用失败时，任务会被当作完成。这个选择的代价是：模型可以在验证器不可用时「蒙混过关」。
6. **任务用尽步数直接 failed。** 30 步对整理下载目录够用，对长链路重构不够；调大上限只是把问题推后，没有断点续跑。
7. **Windows 专属能力没有跨平台等价物。** `window.*`、`ui.*`、`screenshot.window` 在非 Windows 平台是返回提示的桩实现，能编译、不能干活。

还有一条不算缺口的边界：Rust 单测有 42 个，覆盖了风险分级、权限判定、路径沙箱、审批生命周期、Shell 输出截断和设置归一化；但没有一套对抗性命令语料，也没有针对提示注入的端到端测试。安全规则的测试覆盖的是「已知规则有没有写对」，不是「未知绕过存不存在」。

## 小结

Z Desktop 值得读的地方，不是 44 个工具的功能清单，而是它把「谁有权拍板」写成了可执行代码：

- 风险分级是数据，不是散落在 if 里的判断；
- Shell 命令按段判级，安全关键字不能借给危险命令；
- 审批是一次性凭证，重放必须工具名与参数完全一致；
- 路径沙箱只保护写，边界是「不破坏系统」，不是「关进项目目录」；
- 每一层输出都有上限，取消信号贯穿前端、Rust 和进程树。

这些机制没有一个能单独保证安全。它们叠在一起，把「模型可能做错」从不可控事故降成了可审批、可回放、可停止的操作。而在一个模型能力还在快速上涨的方向上，**能停、能拒、能追溯，比能做什么更重要。**

---

**参考链接**

- 项目仓库：[github.com/zhoujungis/z-desktop](https://github.com/zhoujungis/z-desktop)
- 风险分级：`src-tauri/src/security/risk.rs`
- 权限判定：`src-tauri/src/security/permission.rs`
- 路径沙箱：`src-tauri/src/security/sandbox.rs`
- 工具执行入口：`src-tauri/src/agent/mod.rs`
- 工具注册表：`src-tauri/src/tools/registry.rs`
- 前端 Agent Loop：`src/agent/loop.ts`
- 验证器：`src/agent/verifier.ts`

*本文所有实现细节均核对自仓库源码；数字与常量以 v0.1.0 为准。*
