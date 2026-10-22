---
title: "NanoHermes 不养 async"
slug: nanohermes-rust-coding-agent
cover_image: /photos/nanohermes-cover.png
date: 2026-10-22
tags: [Rust, Agent, MCP, Tauri, 桌面应用]
---

> 适用读者：想自己写一个 coding agent、但不想背一整套 Node/Python 依赖与异步运行时的后端与工具链工程师；关心「一个 agent 到底需要多少代码」的人；对 Landlock 沙箱、MCP 传输层、本地 BM25 检索这些具体实现好奇的人
> 结论先行：NanoHermes 的技术密度不在功能清单上，而在三条约束纪律——**没有 async 运行时**（阻塞 HTTP + 作用域线程）、**只有三个依赖 crate**（连 `libc` 都不用，裸系统调用自己写）、**所有输出都有上限**（工具结果 20 KB、命令输出每路 256 KB、读文件 4 MB 硬拒）。外加一个 Tauri 桌面壳，把同一套 agent 塞进四栏 GUI，或者塞进 1 GB VPS 上的 systemd 服务
> 阅读时间：约 30 分钟 | 难度：进阶 | 收获：一份完整的 agent 主循环拆解 + 一份「不用 async 怎么并发」的答案 + 一份依赖极简主义的代价清单 + 沙箱/审批/记忆/子代理四套机制的一手实现细节

**目录**

- 前言：第 N 个 coding agent，凭什么值得写
- 一分钟认识 NanoHermes
- 三条设计纲领
- 技术栈、依赖清单与 release profile
- 仓库结构：一个 workspace，两个 crate
- 核心技术一：没有 async 运行时的 agent 主循环
- 核心技术二：并发工具调用靠的是作用域线程
- 核心技术三：连 libc 都不依赖——一个 30 行的裸系统调用 shim
- 核心技术四：19 个内置工具与「输出有界」纪律
- 核心技术五：上下文压缩——老对话换成一段摘要
- 核心技术六：长期记忆——本地 BM25 加中文二元切分
- 核心技术七：MCP 客户端——两种传输，一个极简实现
- 核心技术八：Skills 与渐进式披露
- 核心技术九：子代理任务板与并发门控
- 核心技术十：生命周期钩子，能一票否决工具调用
- 核心技术十一：安全模型——Landlock 沙箱与三级审批
- 核心技术十二：Ctrl-C 不杀进程，`/undo` 能回退
- 桌面端：Tauri GUI 的四栏外壳与流式隔离
- daemon 模式与 VPS 部署
- 会话持久化与多模态输入
- 测试矩阵
- 已知限制与我的判断
- 参考链接

---

## 前言：第 N 个 coding agent，凭什么值得写

2026 年的 coding agent 已经不缺了。Claude Code、Codex、Trae、Cursor 各有各的生态位，开源的复刻版本每周都在冒新的。它们的共同点是：**都很重**。Node 或 Python 运行时、几百个传递依赖、一个 tokio 或 asyncio 事件循环、动辄几百 MB 的安装体积、空转时几百 MB 的常驻内存。

NanoHermes 反过来问了一个很小的工程问题：

**如果我只要一个能读文件、改代码、跑命令、连 MCP 的终端 agent，最小能有多小？**

它的回答是一整套取舍：单二进制（设计目标约 2 MB）、常驻内存只跟上下文长度有关、依赖清单只有三个 crate、没有异步运行时、连 `libc` 都不依赖，并且能跑在 1 GB 内存的 Debian VPS 上当一个常驻 HTTP 服务。

这篇文章不吹概念，只拆实现。它的技术密度集中在几个地方：**一个不用 async 的 agent 主循环怎么组织**、**并发工具调用用什么原语**、**Landlock 沙箱和 SIGINT 接管如何在不引入 `libc` 的前提下完成**、**长期记忆如何在不接任何嵌入服务的前提下做中文检索**、**一个 agent 的上下文如何被逐层加上限**。这几件事每一件都有「不读源码猜不到」的细节，下面逐个展开。

---

## 一分钟认识 NanoHermes

一句话定义：**一个 Rust 写的、OpenAI 兼容的终端编码 agent，加一个 Tauri 桌面外壳，加一个可部署的 HTTP daemon。**

它是一次代码写成、三种形态分发：

| 形态 | 产物 | 用途 |
| --- | --- | --- |
| CLI / REPL | `agent`（crate 名，release 产物 `target/release/agent`） | 一次性任务、交互式 REPL、stdin 管道、`--json` / `--stream-json` 输出 |
| 桌面应用 | `NanoHermes`（Tauri v2，`gui/` + `ui/`） | 四栏 GUI，每个任务独立会话/权限/模型/人格 |
| HTTP 服务 | `agent --daemon` | VPS 上的常驻服务，桌面端以「云端任务」接入 |

能做的事，按「多久能感觉到」排序：

- **真工具**：读/写/编辑文件、打补丁、列目录、`grep`、`glob`、跑 shell、抓网页、搜网页、维护 todo、操作 git、管理后台任务。
- **规划与记忆**：`todo_write` / `todo_read` 让模型自己排计划并跨轮跟踪；长期记忆把经验、偏好、纠正、事实沉淀到本地文件，下一轮按相关度检索注入。
- **可扩展**：MCP 服务器（stdio 与 streamable HTTP 两种传输）、Skills（`.nanohermes/skills/<name>/SKILL.md`）、子代理（并行委派）、生命周期钩子（能否决工具调用）。
- **安全**：三级审批策略 + Linux Landlock 文件系统沙箱。
- **桌面外壳**：四栏布局、虚拟滚动transcript、增量 Markdown、停靠式结果面板、命令面板、三套主题。

其中有一条容易被忽略的事实：**整个桌面端的前端是 React 19 + TypeScript + Vite，Rust 侧是一个 72 KB 的单文件 `gui/src/main.rs`**——没有插件、没有胶水框架、没有状态机生成器。Tauri 命令就是普通函数，加上属性宏。

---

## 三条设计纲领

在深入代码之前，先把三条纲领摆出来，因为后面几乎所有细节都从它们长出来。

**纲领一：没有 async 运行时。** HTTP 用阻塞的 `ureq`；工具调用并发使用 `std::thread::scope` 的作用域线程；每个 MCP 服务器一个专用读取线程。没有 tokio，也就没有每任务状态机、线程池和运行时内存开销。

**纲领二：依赖极简到近乎偏执。** `agent` crate 的依赖只有三个：`serde_json`、`ureq`（带 TLS）、`base64`。连 `serde` 的派生宏都没有——所有值按 `serde_json::Value` 处理。连 `libc` 都没有——Landlock 沙箱和 SIGINT 接管绕道一个自己写的裸系统调用模块。

**纲领三：一切输出都有上限。** 工具结果统一裁到 20 KB；命令输出每路 256 KB；读文件超过 4 MB 直接拒绝；网页响应体裁到 2 MB；`grep` 最多 200 条；`glob` 最多 500 个文件；项目指引和技能正文各限 20 KB。上下文与进程内存都被这些数字兜住。

这三条纲领共同定义了这个项目的性格：**把复杂度压在「必须写、且值得自己写」的那一层，其余的一律砍掉。**

---

## 技术栈、依赖清单与 release profile

workspace 的 `Cargo.toml` 是单一事实来源，两个 crate 都继承 `version` / `edition` / `license`：

```toml
[workspace]
resolver = "2"
members = ["agent", "gui"]

[workspace.package]
version = "0.1.0"
edition = "2021"
license = "MIT"

[profile.release]
opt-level = "z"    # 为体积优化
lto = true         # 链接期优化
codegen-units = 1  # 牺牲编译速度换更激进的优化
panic = "abort"    # 不要 unwind 表
strip = true       # 剥符号
```

`agent` 的依赖表短到可以整段贴出来，注释本身就是在陈述设计目标：

```toml
# Minimal dependency footprint is a design goal:
#  - no async runtime (no tokio) => no per-task state machines / thread pools
#  - one blocking HTTP client (ureq) instead of reqwest/hyper
#  - serde_json only (no serde derive proc-macro)
[dependencies]
serde_json = "1"
ureq = { version = "2", features = ["json", "tls"] }
base64 = "0.22"
```

`gui` 侧同样克制，而它复用的正是 agent 那一套阻塞 HTTP 客户端——注释里写明了原因：

```toml
[dependencies]
agent = { path = "../agent" }
tauri = { version = "2", features = [] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
# Same blocking HTTP client the agent uses; "tls" keeps https (Caddy-fronted) daemons reachable.
ureq = { version = "2", features = ["json", "tls"] }
```

前端栈（`ui/package.json`）也刻意保持窄：运行时依赖只有 `@tauri-apps/api`、`highlight.js`、`marked`、`react`、`react-dom`；工具链是 Vite 6、Vitest 5、TypeScript 5.7、jsdom 30。

Tauri 的窗口配置很朴素，值得注意的只有两点：`withGlobalTauri: true`（前端直接拿全局 `window.__TAURI__`，不需要额外的注入包）和 `decorations: false`（去掉系统标题栏，标题栏由前端自绘）。

---

## 仓库结构：一个 workspace，两个 crate

| 路径 | 是什么 |
| --- | --- |
| `agent/` | coding agent 本体：CLI、agent 主循环、工具集、MCP 客户端、daemon 模式 |
| `gui/` | 桌面壳：`tauri.conf.json`、`src/main.rs`、`icons/`、`capabilities/` |
| `ui/` | 桌面前端：Vite + React 19 + TypeScript |
| `scripts/` | `deploy-debian.sh`：一条命令把 daemon 装到 Debian/Ubuntu |
| `target/` | 整个 workspace 共享的构建输出 |

`agent/src` 一共约 9,200 行 Rust，模块划分相当细。按体积排下来，最大的三个是 `agent.rs`（主循环，52 KB）、`main.rs`（CLI 与 REPL，58 KB）、`mcp.rs`（MCP 客户端，38 KB）——也就是说，**一个 agent 的核心逻辑、一个终端 UI、一个协议客户端就占了大半**，其余全是工具实现。

`ui/src` 约 8,800 行 TypeScript，其中最大的是 `lib/store.ts`（45 KB，全局状态与 IPC 粘合层）、`components/SettingsPage.tsx`（33 KB）、`styles/shell.css`（65 KB）和 `App.e2e.test.tsx`（26 KB）。

---

## 核心技术一：没有 async 运行时的 agent 主循环

主循环在 `agent/src/agent.rs` 的 `Agent::run` 里，一共一百多行，把一个「用户轮次」从开始跑到结束。它的骨架是这样的：

```rust
pub fn run(&mut self, content: Value) -> Result<String, String> {
    // A Ctrl-C during this turn sets a flag instead of killing the process.
    let _guard = InterruptGuard::new();
    // 跨会话记忆：按当前指令检索相关记忆，整体替换系统消息里的注入块
    let user_text = memory::content_text(&content);
    if let Some(dir) = self.ctx.memory_dir.clone() {
        let block = memory::retrieve_block(&dir, &user_text);
        self.set_memory_block(&block);
    }
    self.messages.push(json!({ "role": "user", "content": content }));

    for _ in 0..self.cfg.max_iterations {
        // Abort only at a step boundary so the history never keeps an
        // assistant tool-call without its matching tool result.
        if crate::interrupt::take() { interrupted = true; break; }
        let turn = self.complete()?;
        // ... 累计 token 用量、推送 assistant 消息
        if turn.tool_calls.is_empty() { completed = true; break; }
        // ... 并发执行工具、按调用顺序回填 tool 消息
        self.compact();
    }
    // 只有完整结束的轮次才沉淀记忆
    if completed && self.cfg.memory { self.distill_memories(&user_text, had_tools); }
    self.persist();
    Ok(final_text)
}
```

值得逐个说的有四件事。

**第一，中断点被放在「步骤边界」而不是「随时」。** 循环开头那句 `crate::interrupt::take()` 是唯一的打断位置。注释把原因说得很清楚：如果在一个 tool call 发出后、结果回填前打断，历史里就会留下一个没有匹配结果的 assistant tool-call，下一次请求会被 API 判为非法。所以中断只会落在两次「模型往返」之间，代价是响应延迟最多一个步骤。

**第二，长期记忆是每轮重新检索、整体替换的。** `set_memory_block` 不是往系统消息后面追加，而是按固定标记把旧块整体换掉。这样对话轮回一百次，注入块也还是那一块，不会越积越多——这是注入式记忆最容易踩的坑。

**第三，token 用量上报的是「增量」而不是「累计总数」。** 源码里有一段注释解释得很实在：云端的 daemon 用一个 agent 服务很多会话，累计总数是跨越所有会话的，客户端拿到没法用；上报每次请求的增量，客户端才能自己算出正确的「每任务总数」，而本地场景下增量累加本来就等于总数。

**第四，记忆提炼有硬门槛。** 只有 `completed` 为真（正常跑完、不是被中断也不是撞到迭代上限）才提炼；提炼失败只静默降级，不影响对话结果。半截对话不会被当成经验写进记忆库。

主循环之外，模型侧的一次往返被封装在 `complete()` 里，最终落到 `llm::chat`。它处理的东西不少：构造请求体、按需挂 `tools` 与 `tool_choice`、`thinking` 打开时写 `reasoning_effort: "high"`、流式时加 `stream_options.include_usage` 以便在流里拿到 token 统计，然后进入重试循环：

```rust
fn backoff_ms(base_ms: u64, attempt: u32) -> u64 {
    base_ms
        .saturating_mul(2u64.saturating_pow(attempt.saturating_sub(1)))
        .min(30_000)
}
```

退避是 `base * 2^(attempt-1)`、封顶 30 秒；可重试的判据只看 HTTP 状态码（429、500、502、503、504）；重试次数耗尽后，如果配了 `--fallback-model`，会用备用模型再发一次。默认 `--max-retries 2`、`--retry-base-ms 500`。

---

## 核心技术二：并发工具调用靠的是作用域线程

模型一个回合里返回多个 `tool_calls` 时，NanoHermes 会并发执行它们。没有 tokio，用的是 `std::thread::scope`：

```rust
let results: Vec<String> = if turn.tool_calls.len() == 1 {
    vec![self.execute(&turn.tool_calls[0])]
} else {
    // Reborrow as `&Agent` so the scoped threads can share it
    // (`execute` takes `&self`, and `Agent` is `Sync`).
    let this: &Agent = self;
    std::thread::scope(|s| {
        let handles: Vec<_> = turn.tool_calls.iter()
            .map(|call| s.spawn(move || this.execute(call)))
            .collect();
        handles.into_iter()
            .map(|h| h.join().unwrap_or_else(|_| "ERROR: tool thread panicked".to_string()))
            .collect()
    })
};
```

这里有四个设计细节：

- **单次调用走直路，不付线程开销。** 只有 `len() > 1` 才铺开线程，绝大多数回合其实是单工具调用。
- **结果按调用顺序回收。** `join` 的顺序就是 `tool_calls` 的顺序，所以哪个线程先跑完都不影响 `tool_call_id` 与结果的配对。
- **`Agent` 必须是 `Sync`。** 这是整个并发方案的前置条件。MCP 侧的做法是把 `Child` 进程和读取线程的 `JoinHandle` 一起塞进 `Mutex<Server>`，于是 `Manager`（进而 `Agent`）满足 `Sync`。
- **线程 panic 不会带崩整轮。** 单个工具线程 panic 时，`join` 返回 `Err`，被转成一条看起来像工具错误的字符串交回模型——模型会当成一次失败的工具调用继续往下走。

MCP 工具的并发粒度是另一层的：同一个服务器的调用在它的 stdin 锁上串行（协议就是单连接请求-响应），不同服务器之间并行。这个边界画得很准。

---

## 核心技术三：连 libc 都不依赖——一个 30 行的裸系统调用 shim

`sandbox.rs` 和 `interrupt.rs` 都需要 Rust 标准库不暴露的系统调用：Landlock 系列，以及 `rt_sigaction`。正常做法是加 `libc` 依赖，NanoHermes 的做法是自己写 `agent/src/sys.rs`：

```rust
#[cfg(target_arch = "x86_64")]
pub mod nr {
    pub const CLOSE: usize = 3;
    pub const RT_SIGACTION: usize = 13;
    pub const OPENAT: usize = 257;
    pub const PRCTL: usize = 157;
}
```

两个架构各写一份系统调用号表（x86_64 与 aarch64 的 `openat` 是 257 对 56、`prctl` 是 157 对 167），再给一个最多六个参数的 `syscall()`，x86_64 用 `asm!` 发 `syscall` 指令、aarch64 用 `svc 0`，寄存器分配各不相同。

整个模块不到 75 行，带 `#![cfg(all(target_os = "linux", any(target_arch = "x86_64", target_arch = "aarch64")))]` 门控，非 Linux 平台编译时整个消失。**这是「依赖极简」纲领最贵的一笔代价：把可移植性和一部分安全审计负担换成了 30 行汇编。** 反过来看也合理——这两个特性本来就只在 Linux 上有意义。

---

## 核心技术四：19 个内置工具与「输出有界」纪律

内置工具分四类，一共 19 个，加上条件工具后最多 28 个（未配 MCP 时不会出现 `mcp_*` 四个）：

| 类别 | 工具 |
| --- | --- |
| 文件 | `read_file`、`write_file`、`edit_file`、`apply_patch`、`list_dir` |
| 检索 | `grep`、`glob` |
| 执行 | `run_command`、`task_output`、`task_list`、`task_kill` |
| 网络 | `web_fetch`、`web_search` |
| Git | `git_status`、`git_diff`、`git_log`、`git_commit` |
| 规划 | `todo_write`、`todo_read` |
| 条件 | `skill`、`subagent`、`agent_list`、`memory_save`、`memory_search`、`mcp_list_resources`、`mcp_read_resource`、`mcp_list_prompts`、`mcp_get_prompt` |

分发是一个朴素的 `match`，所有错误都变成字符串交回模型当工具结果——不 panic、不中断循环。分发末尾的一行是重点：

```rust
r.map(|s| clamp(s, ctx.max_output))
```

**每一个工具结果都被统一裁到 `max_output`（20 KB）。** 这行代码是「输出有界」纲领的执行点：不管哪个工具、不管模型传了什么参数，回到模型上下文里的一条工具结果永远不会超过 20 KB。

每个工具自己还有第二层上限，这些数字是刻意选的：

| 位置 | 上限 | 理由 |
| --- | --- | --- |
| 工具结果 | 20 KB | 兜住上下文 |
| 命令 stdout / stderr | 每路 256 KB | 编译日志爆炸时不撑爆内存 |
| `read_file` | 单文件 4 MB 硬拒 | 强制模型用 `offset` / `limit` 分块读 |
| `web_fetch` 响应体 | 2 MB | 网页不可信，先裁再解析 |
| `grep` | 200 条匹配 | 一屏能读完 |
| `glob` | 500 个文件 | 同上 |
| `todo_write` | 50 项 | 计划不必无限长 |
| AGENTS.md / 技能正文 | 各 20 KB | 提示词也要有预算 |

还有一个安全相关的细节：命令 stdout/stderr 的读取用了 `read_capped`——**边读边裁**，而不是读完再切。否则一条 `yes` 或者失控的构建脚本会先把内存吃掉。

`apply_patch` 也有个值得说的取舍：补丁按**内容**匹配而不是按行号，所以源码有少量漂移时仍然能打上。

---

## 核心技术五：上下文压缩——老对话换成一段摘要

上下文管理在 `agent/src/agent.rs` 的 `compact_with` 里，两个常量定调：

```rust
const CONTEXT_CHAR_BUDGET: usize = 120_000;
const KEEP_RECENT: usize = 10;
```

超过 12 万字符（或消息条数超过「保留数 + 1」）时开始压缩。流程是：从倒数第 10 条往前找一个安全起点，把更老的一段 `drain` 出来交给模型做摘要，再把摘要作为一条 `system` 消息插回索引 1 的位置。

三个细节避免了常见事故：

- **不会切在工具调用链中间。** 起点如果落在 `role == "tool"` 的消息上就往后推，直到不是 tool 消息——否则会出现「摘要里丢了 assistant 的 tool_call，但 tool 结果还留着」的错位。
- **摘要失败也不丢数据。** 摘要调用失败时退化成一句 `[Earlier conversation was omitted to keep the context small]`，而不是直接报错或静默丢失。
- **可手动触发。** `/compact` 强制压缩一次，绕过体积判断。

`KEEP_RECENT = 10` 这个数是个经验取舍：最近 10 条足够覆盖「当前正在改的文件 + 上一条工具结果」，再老的对话对延续任务的价值快速衰减。

---

## 核心技术六：长期记忆——本地 BM25 加中文二元切分

长期记忆是 `agent/src/memory.rs` 的职责，落盘在 `~/.nanohermes/memory.json`。它要解决的问题很实际：**不接任何嵌入服务，怎么做中文检索？**

答案是两段式——先分词，再 BM25。

分词器 `tokenize()` 同时处理中英混排：

- ASCII 字母数字的连续段当英文单词，转小写，**长度小于 2 的直接丢弃**（消掉 `a`、`is` 这类噪声）。
- CJK 连续段做**二元切分**（`windows(2)`），单字段落保留单字。所以「上下文压缩」会变成「上下」「下文」「文压」「压缩」。
- CJK 的判定覆盖了汉字、假名、谚文和兼容区，不只统一表意区。

打分是标准 BM25，`k1 = 1.2`、`b = 0.75`：

```rust
let idf = (1.0 + (n - n_q + 0.5) / (n_q + 0.5)).ln();
score += idf * (f * (k1 + 1.0))
       / (f + k1 * (1.0 - b + b * len / avg_len.max(1.0)));
```

两个细节超出了教科书写法：

- **类别词也参与匹配。** 每条记忆有 `kind`（`lesson` / `preference` / `correction` / `fact`），分词时把它的中文标签和英文标识一起并进文档词袋，于是「我之前纠正过什么」这种查询能直接命中 `correction` 类条目。
- **零分条目直接过滤。** 没有共同词的条目根本不进排序，避免无关记忆挤占 top-k。

条目数有限，所以是逐条算分、不做倒排索引——一个 `Vec` 加一个 `HashMap` 就够了。检索结果是**每轮重新计算**的，注入方式和前面说的记忆块替换共用同一套标记机制。

写入侧还有两道闸：`memory_save` 遇到同文本条目直接跳过（去重），以及每轮结束时的自动提炼只发生在完整结束的回合。所以记忆库不会被寒暄和半截对话污染。

---

## 核心技术七：MCP 客户端——两种传输，一个极简实现

MCP 支持在 `agent/src/mcp.rs`，两种传输都实现了。

**stdio 传输**走的是 LSP 风格的帧：`Content-Length: N\r\n\r\n` 加 JSON 体，一字不差：

```rust
let frame = format!("Content-Length: {}\r\n\r\n", body.len());
```

**streamable HTTP 传输**是同步 POST，请求头 `Accept: application/json, text/event-stream`，服务端返回的 `Mcp-Session-Id` 会被记住并在后续请求里带回去。响应体可能是 JSON，也可能是 SSE 形式的 `event: message` + `data: {...}`，客户端两种都能解。

握手序列是标准三步：`initialize`（`protocolVersion: "2024-11-05"`）→ `notifications/initialized` → `tools/list`。拿到的工具声明会被转换成 OpenAI function-calling 格式并入 agent 的工具表，之后按名字自动分发——也就是说 **MCP 工具对模型来说和内置工具没有区别**，模型的调用体验是一致的。

除了工具，还有四个辅助工具把 MCP 的 resources 与 prompts 也暴露出来：`mcp_list_resources`、`mcp_read_resource`、`mcp_list_prompts`、`mcp_get_prompt`。这几个只在配了 MCP 服务器时出现。

配置就是一个 JSON 文件，`command` 走 stdio、`url` 走 HTTP，两种写法在同一个 `servers` 对象里并存。

---

## 核心技术八：Skills 与渐进式披露

Skills 是「可复用的指令包」，一个目录一份 `SKILL.md`，支持 YAML frontmatter 声明 `name` 和 `description`。

搜索顺序是 workspace 优先：先扫 `<workspace>/.nanohermes/skills/`，再扫 `~/.nanohermes/skills/`，同名时工作区的覆盖全局的（`discover_in` 里用一个 `HashSet` 做去重，目录列表排序后按序处理）。

关键在于**它不进上下文**：

```rust
const MAX_BODY_CHARS: usize = 20_000;

/// A discovered skill. `body` is read lazily so startup only pays for parsing
/// the frontmatter.
```

启动时只解析 frontmatter，正文惰性读取。系统提示词里只出现每个 skill 的**名字和描述**；模型需要时再调 `skill` 工具把正文（上限 20 KB）拉进来。这就是渐进式披露——**技能库可以很大，但基础提示词永远是小的**。

frontmatter 缺失时有兜底：目录名当名字，正文第一行当描述。

---

## 核心技术九：子代理任务板与并发门控

子代理配置在 `--subagents` 指定的 JSON 里，每个子代理可以有自己的 prompt、模型和 `allowed_tools` 白名单。配好之后出现 `subagent`（委派）和 `agent_list`（查任务板）两个工具。

`agent/src/board.rs` 里有两种机制：

**任务板 `Board`** 记录每个委派任务：自增序号生成 id（格式 `agent-N`）、名字、任务描述、状态（`running` / `done` / `failed`）、耗时、结果预览。结果在板上只留 500 字符预览：

```rust
const RESULT_PREVIEW: usize = 500;
```

预览裁剪还专门处理了 UTF-8 边界——`while end > 0 && !flat.is_char_boundary(end)`——避免把一个多字节字符劈成两半 panic。完整结果仍然作为工具结果回给模型，板上留个摘要只是为了 `agent_list` 读起来清爽。

**并发门控 `Gate`** 是个教科书式的 `Mutex` + `Condvar` 计数信号量：`acquire()` 在满额时 `cv.wait`，返回的 `GateGuard` 在 `Drop` 里减一并 `notify_one`。上限由 `MAX_PARALLEL_SUBAGENTS = 4` 定死，也就是最多 4 个并发委派。为什么需要它？因为主循环是「一个工具调用一个线程」，而一个回合完全可能同时发出好几个委派——没有门控就会瞬间炸出十几个并发 LLM 请求。

---

## 核心技术十：生命周期钩子，能一票否决工具调用

钩子定义在配置文件里，是 `PreToolUse` / `PostToolUse` 两类 shell 命令，`matcher` 支持 `*`（全部）或逗号分隔的工具名列表。

运行方式在 `agent/src/hooks.rs`：`sh -c` 执行，工作目录是 workspace 根，工具调用以 JSON 写到钩子的 stdin：

```rust
let payload = json!({ "tool": tool, "event": event, "arguments": args }).to_string();
```

同时导出 `NANOHERMES_TOOL_NAME` 与 `NANOHERMES_HOOK_EVENT` 两个环境变量，不用解析 stdin 也能分支。

两个实现细节值得抄：

- **两条管道各起一个线程去排空。** stdout 和 stderr 分别在独立线程里 `read_capped`——如果只在一处读，另一个管道写满 64 KB 缓冲区就会死锁，而「话多的钩子」恰恰是常见情况。
- **钩子必须快，慢了就当失败。** `HOOK_TIMEOUT_SECS = 30`，超时杀掉进程并返回 `-2`（`-1` 表示被信号杀死）。注释写得很直白：钩子只是快检查和通知，卡住的钩子不能把 agent 永久拖住。

语义上两者是有差别的：`PreToolUse` 返回非零会**阻止**这次工具调用，并把钩子输出交回模型；`PostToolUse` 返回非零只能给工具结果**追加一条警告**，没法撤销已发生的事。这个不对称是刻意的——想拦就在执行前拦。

---

## 核心技术十一：安全模型——Landlock 沙箱与三级审批

两个互相独立的开关，一个管「问不问」，一个管「能做什么」。

**审批策略**决定什么时候需要用户确认：

| 策略 | 行为 |
| --- | --- |
| `never` | 任何命令都不问（默认，`-y` 也是它） |
| `on-request` | 只问那些**不是**公认只读命令的 |
| `untrusted` | 全部都要问，只读命令也不例外 |

只读命令的识别逻辑（`is_trusted_command`）比想象中严格。第一道闸就是元字符——只要出现 `|`、`&`、`;`、`<`、`>`、反引号、`$`、括号或换行，**无论开头是什么程序都直接判为不可信**：

```rust
if cmd.chars().any(|c| matches!(c, '|' | '&' | ';' | '<' | '>' | '`' | '$' | '(' | ')' | '\n')) {
    return false;
}
```

过了这一关，才做白名单匹配：先跳过前置的 `KEY=VALUE` 环境变量赋值，再去掉路径前缀，最后查 `TRUSTED_BINARIES`（`ls`、`cat`、`grep`、`rg`、`stat`、`jq`、`tree` 等纯只读程序）。`git` 单独走 `git_subcommand_is_read_only()`：它会跳过 `-C`、`-c`、`--git-dir`、`--work-tree`、`--namespace` 这些**吃下一个 token 作值**的全局参数，再看子命令是否在白名单里。

**沙箱模式**用 Linux Landlock 限制被 spawn 命令的文件系统视野：

| 模式 | 行为 |
| --- | --- |
| `off` | 不限制（默认） |
| `read-only` | 可以读、可以执行，完全不能写 |
| `workspace-write` | 可以读、可以执行，只能在 workspace 下写 |

实现上最有意思的一点是**它拒绝降级**：Landlock 通过 `Command::pre_exec` 安装——也就是在 `fork` 之后、`exec` 之前，因此限制天然覆盖命令派生出的所有子进程。如果内核不暴露 Landlock（或外层沙箱挡掉了），NanoHermes **拒绝执行该命令**，而不是悄悄以无沙箱方式跑掉。注释里的理由说得对：一门心思「优雅降级」的安全机制，等于没有。

而这一切仍然走前面那个裸系统调用 shim，不引入任何外部 crate。

---

## 核心技术十二：Ctrl-C 不杀进程，`/undo` 能回退

交互式使用时，Ctrl-C 的语义被改写了：它**不是**杀掉进程，而是翻转一个标志位，让当前轮次在下一个步骤边界干净退出，对话上下文完整保留。

`agent/src/interrupt.rs` 的实现有一处很妙的时序设计：**处理器只在轮次运行期间安装**。

```rust
static INTERRUPTED: AtomicBool = AtomicBool::new(false);
/// Nesting depth of active turns; the handler is installed at 0 -> 1 and
/// removed at 1 -> 0.
static DEPTH: AtomicUsize = AtomicUsize::new(0);
```

引用计数保证嵌套轮次（比如子代理在工具调用里跑起来）只有一个处理器，而最外层退出时恢复 `SIG_DFL` 默认动作——于是**空闲时按 Ctrl-C 仍然照常退出**，只有忙碌时才变成「停止当前轮次」。一个信号，两种语义，靠的是「安装/卸载的时机」而不是判断标志位。

另外一个工程细节：x86_64 上的内核**拒绝投递被捕获的信号，除非调用方提供一个会执行 `rt_sigreturn`（系统调用 15）的 restorer**。这就是整个项目里唯一一段手写汇编除了 `syscall` 指令之外还存在的原因：

```rust
core::arch::global_asm!(
    ".globl nanohermes_sigrestorer",
    ".hidden nanohermes_sigrestorer",
    "nanohermes_sigrestorer:",
    "mov rax, 15",
    "syscall",
);
```

桌面端没有 SIGINT 可发，所以另有一个 `request()` 直接翻同一个标志位：**GUI 的「停止」按钮和终端的 Ctrl-C 走的是同一条路径**，agent 循环不需要知道调用者是谁。

配套的是 `/undo [n]`：把最近 n 个完整用户轮次（该轮用户消息及其之后的一切）从历史里删掉并持久化。它和「中断保留上下文」是一对——**中断是保留，回退是撤销**，两种都需要，因为「跑歪了想接着改」和「跑歪了想当没发生」是两种真实需求。

---

## 桌面端：Tauri GUI 的四栏外壳与流式隔离

`gui/` 把同一个 agent 包成桌面应用，四栏布局：

| 栏 | 内容 |
| --- | --- |
| 标题栏 | 自绘（不是系统边框）：品牌、模型/位置胶囊、任务列表与结果面板开关、设置、窗口按钮 |
| 任务列表（左，可折叠） | 每个任务的执行位置与累计 token；搜索、置顶、重命名、删除、导出 |
| 对话（中） | 任务栏（标题、状态、token、导出、清空上下文）+ 流式 Markdown transcript |
| 结果（右，可折叠） | 工作区文件树、本任务产物（全部/改动/读取）、只读文件预览、带词级高亮的 diff |

权限模式有五档，语义差别比名字看起来大：

| 模式 | UI 标签 | 行为 |
| --- | --- | --- |
| `default` | Agent | 全工具可用，改文件和跑命令都不问 |
| `accept-edits` | Accept | 文件编辑自动批准，命令仍要过闸 |
| `plan` | Plan | 只读：不写、不跑命令 |
| `goal` | Goal | 无人值守：每个工具都跑，直到任务完成 |
| `debug` | Debug | 可以读文件和跑命令来复现问题，但绝不写入 |

`plan` / `goal` / `debug` 这三档除了工具闸门，还会往系统提示词里塞一句模式指引——源码里的注释说明了原因：**让模型按启动方式行事，而不只是依赖工具被禁用**。被禁的工具模型还会反复尝试，写了指引它就会自己换策略。

GUI 侧的性能取舍写在 README 的「Desktop performance notes」里，四条都是踩过坑的结论：

- **不允许阻塞式 Tauri 命令。** 同步的 `#[tauri::command]` 跑在窗口主线程上，任何磁盘或网络操作都会把整个 UI 冻住一整轮。所以所有碰文件系统、开进程、发 HTTP 的命令都是 `async fn` 并交给 `tauri::async_runtime::spawn_blocking`；只有 `get_settings` 和 `stop_task` 这两个纯内存操作保持同步。设置页的并发写入还用了一个静态互斥锁串行化，防止两次 flush 乱序落盘。
- **流式文本不进全局 store。** 增量走一条专用订阅通道，只有正在写入的那个气泡订阅它；每个阶段（工具调用、轮次结束）才提交一次到 transcript。所以长回答不会连累侧边栏、结果面板和标题栏重渲染。事件在 `nanohermes://delta|tool|note|usage` 通道上按 40 毫秒批量下发。
- **transcript 虚拟化。** 只有视口内（和附近）的消息被挂载；最后一个气泡还在增长时跳过高度测量；「贴底滚动」由流式通道驱动，不触发 React 渲染。
- **增量 Markdown。** 流式期间按代码围栏外的空行切块：已经稳定的块只渲染一次就保留，未闭合的围栏只更新它那个 `code` 文本节点，语法高亮在轮次结束后逐代码块做，而不是对整篇回答做一次。

整个 GUI 的 IPC 面是 16 个命令：`get_settings`、`save_settings_cmd`、`new_task`、`open_task`、`reset_task`、`delete_task`、`set_mode`、`list_workspace_files`、`read_file_preview`、`file_diff`、`stop_task`、`export_task`、`list_dirs`、`model_health`、`cloud_health`、`run_task`。另外有两条 stream 读取路径——`read_ndjson` 解 NDJSON 增量，`cloud_read_stream` 读远端 daemon 的流——都写在一个 72 KB 的文件里。

---

## daemon 模式与 VPS 部署

`agent --daemon` 把 agent 变成一个常驻 HTTP 服务，接口小到只有两个端点：

| 端点 | 方法 | 鉴权 | 说明 |
| --- | --- | --- | --- |
| `/` | POST | Bearer（设了 token 时） | `{"prompt": "..."}` → `{"response": "...", "session": "<id>"}` |
| `/health` | GET | 无 | `{"status":"ok","sessions":N}`，给存活探针用 |

会话隔离靠一个请求头：带上 `X-Session-Id` 就切到那个会话，不同 id 永不共享上下文，不带就用 `default`。每个会话独立落盘成一个 JSON 文件。

桌面端把「云端任务」接到它：每个云任务带自己的 `X-Session-Id`，于是**同一个 daemon 能同时服务多个桌面任务而不串味**。代价是云任务的配置由 daemon 启动参数决定——模型、人格、温度、权限模式都不从桌面端下发，而且**云轮次无法中途取消**（请求整个握在 daemon 手里）。

部署脚本 `scripts/deploy-debian.sh` 把该做的都做了：

| 步骤 | 内容 |
| --- | --- |
| 安装 | 二进制 `/opt/nanohermes/nanohermes`，工作区 `/opt/nanohermes/workspace`，会话目录权限 700 |
| 令牌 | `openssl rand -hex 24` 生成到 `/opt/nanohermes/.daemon_token`，重跑时复用 |
| 服务 | 写 systemd unit：`--daemon --daemon-port 8787 -C <workspace> --session <dir>/default.json --sandbox workspace-write`，`Restart=always` |
| 加固 | `NoNewPrivileges` + `ProtectSystem=strict` 配 `ReadWritePaths` |
| 启动 | `systemctl enable --now`，然后 curl `/health` 打印 token |

有一个坑在文档里被点出来了：`ProtectSystem=strict` 会挡住 `~/.nanohermes/memory.json` 的写入，所以开了长期记忆就必须在 drop-in 里加 `ReadWritePaths=/root/.nanohermes`。另外 1 GB 实例要先加 swap——**编译是唯一吃内存的步骤**。

对外暴露的方式给了三种：SSH 隧道（不开放任何端口）、Caddy 反代（443 被占就用 8443，注意 Let's Encrypt 的 HTTP-01 仍要 80）、Cloudflare Tunnel。文档里那句警告值得原样引用：**永远不要把 8787 直接暴露出去**——唯一的凭证就是那个 Bearer token，而流量是明文的。

---

## 会话持久化与多模态输入

会话文件是一个 OpenAI 风格消息的 JSON 数组，写盘方式是原子的：**先写同目录的 `.tmp` 兄弟文件，再 rename**。所以写一半崩溃不会把会话截断成半截。保存时机是每个完成的轮次之后以及 `/clear` 之后；启动时读失败会退回全新对话并打印警告，而不是拒绝启动。

多模态输入对视觉模型开放：一次性用 `-i`，REPL 里用 `/image`，桌面端可以粘贴截图、拖拽文件或从选择器挑。约束是每轮最多 4 张、长边缩到 1024 px、非可解码图片或超过 12 MB 会被拒绝并给出原因。传输方式是 data URL，所以模型必须支持 vision。

---

## 测试矩阵

Rust 侧是「每个模块自带 `#[cfg(test)]`」加一个真正的端到端套件，一条 `cargo test --workspace` 全跑。`agent/tests/e2e_mock_llm.rs` 起一个**只依赖标准库、不联网**的本地 mock OpenAI 服务，用它驱动真实的 `Agent`，覆盖：工具调用往返、流式与非流式回复、一次瞬时 5xx 后的重试、以及硬性 API 错误。MCP 侧另有 `agent/tests/mock_mcp_server.py` 这个 mock stdio 服务器。

单元测试覆盖的清单相当能说明「哪些地方被当成真会出问题的地方」：补丁应用（简单/多 hunk/插入/上下文缺失报错）、glob 匹配、MCP 资源与提示词的列出和读取、MCP 工具自动分发、streamable HTTP 握手与调用、MCP 并发安全（混合并发请求与压力突发）、`execute()` 并发（内置工具、内置与 MCP 混合）、HTML 转文本与搜索结果解析、会话任务列表、git 工具往返、token 用量解析与退避计算、多模态内容组装、会话存取往返、AGENTS.md 注入（含关闭）、技能发现（frontmatter、兜底命名、工作区覆盖）、钩子执行（退出码、工具名匹配、stdin 载荷）、子代理任务板顺序与并发门控、审批策略判定与可信命令识别、**Landlock 的工作区边界强制**、SIGINT 标志位的置位与清除、长期记忆（中文二元分词、BM25 排序、去重、提炼门槛）。

前端是 Vitest + jsdom，覆盖纯逻辑（主题解析与持久化、store 状态迁移、Markdown 清洗、图片附件处理、会话内查找、diff 块）加组件测试（设置页、命令面板、结果面板、快捷键面板），再加一个 `App.e2e.test.tsx`：**对着被 mock 的 Tauri IPC 桥渲染真实的 store 和组件**，验证长 transcript 的虚拟滚动、跨屏消息的查找、diff 变更跳转、以及运行中/停止中的输入区状态。

顺带一提，GUI 侧还有一个回归测试专门断言「长时间运行的命令永远不在主线程上同步执行」——这类性能约定最容易在后续改动里被悄悄破坏，所以值得一条测试盯着。

---

## 已知限制与我的判断

把限制写清楚，比把功能写清楚更有价值：

- **沙箱与 SIGINT 接管是 Linux 专属。** 两者都建立在裸系统调用上，Windows/macOS 编译时整块消失。也就是说桌面端在 Windows 上跑的是「无沙箱 + 系统默认 Ctrl-C 处理」。
- **云轮次不可取消。** 请求整个握在 daemon 手里，桌面端只能等；本地任务才能在步骤边界停止。
- **daemon 以 root 运行，token 是唯一凭证。** 谁拿到 token 谁就能在 workspace 里读写执行——这是文档里反复强调不要裸暴露端口的根本原因。
- **没有 async 的代价是真实的。** 一个卡住的 HTTP 请求会占住一个线程直到超时（默认 120 秒）。在 CLI 和 GUI 场景下这完全可接受，但如果有人想把它塞进一个高并发网关，架构假设就不成立了。
- **Windows 安装包未签名**，首次运行会触发 SmartScreen 警告。

我的判断是：NanoHermes 值得读的地方**不是功能清单，而是约束纪律**。同为 coding agent，功能集大同小异；它把「不用 async 运行时」「只用三个 crate」「不依赖 libc」「所有输出都有上限」这四条约束坚持到底，才长出了这些实现——裸系统调用 shim、作用域线程并发、逐层钳制的输出上限、零依赖的中文 BM25。

这几条约束换来的是：一个设计目标约 2 MB 的单个二进制，常驻内存主要跟上下文长度相关，却能同时当 CLI、当桌面应用、当 VPS 上的 systemd 服务。**在一个大家都往上堆依赖的方向上，往回收也是一种工程能力。**

---

## 参考链接

- 项目仓库：`D:\NanoHermes`（workspace 根 `Cargo.toml`、`agent/`、`gui/`、`ui/`、`scripts/`）
- 主循环与上下文压缩：`agent/src/agent.rs`
- LLM 调用与重试：`agent/src/llm.rs`
- 长期记忆与 BM25：`agent/src/memory.rs`
- MCP 客户端：`agent/src/mcp.rs`
- 沙箱与审批：`agent/src/sandbox.rs`
- 中断接管：`agent/src/interrupt.rs`
- 裸系统调用 shim：`agent/src/sys.rs`
- 子代理任务板：`agent/src/board.rs`
- 钩子：`agent/src/hooks.rs`
- 桌面壳 IPC：`gui/src/main.rs`

---

*本文所有实现细节均核对自仓库源码，未使用二手资料。*
