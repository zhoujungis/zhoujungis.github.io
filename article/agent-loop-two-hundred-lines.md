---
title: "Agent 的本质：一个两百行的循环"
slug: agent-loop-two-hundred-lines
cover_image: /photos/agent-loop-cover.png
date: 2026-10-22
tags: [Agent, Agent 工程, Rust, 架构设计]
---

> 适用读者：写过业务代码、想自己实现一个 coding agent 的工程师；被各种「规划、记忆、多智能体」名词绕晕、想看清运行时骨架的人；准备读 NanoHermes 源码但不知道从哪个函数开始的人
> 结论先行：把 Agent 的所有名词剥掉，剩下的就是一个循环——把消息发给模型，模型要么回文本，要么回工具调用；执行工具，把结果塞回消息列表，再发一次。NanoHermes 的 `Agent::run` 本体 109 行，加上 `complete`、`execute`、`assistant_message` 与 `compact`，去掉注释和空行，核心大约两百行。这两百行里有五个判定、四个变量和三道闸，本文逐行拆开
> 阅读时间：约 32 分钟 | 难度：进阶 | 收获：一份可照抄的 Agent 主循环骨架 + 一份「哪些东西不该写进循环」的边界清单 + 一份流式工具调用、并发执行、步骤边界中断的实现细节

**目录**

- 前言：为什么第一篇写循环
- 一句话：Agent = 模型 + 工具 + 循环
- 拆掉名词之后，只剩五个要素
- 一个用户轮次的完整时序
- 主循环骨架：109 行的 `Agent::run`
- 循环里的四个变量
- 第一步：先检索记忆，再把用户消息放进历史
- 系统提示词：短是设计，不是偷懒
- 第二步：组装工具清单
- 第三步：发一次模型请求
- 请求体里每个字段都在回答一个问题
- 重试与降级：只认五种错误
- 流式解析：一行一行读 SSE
- 工具调用是拼出来的，不是读出来的
- `assistant_message`：为什么空 content 要写 `null`
- 第四步：执行工具
- 三道闸：权限、参数、钩子
- 工具结果一律是字符串
- 回灌历史：`tool_call_id` 是配对的锚
- 第五步：循环从哪里出去
- 并发工具调用：作用域线程与按序回收
- 中断：Ctrl-C 只在步骤边界生效
- 迭代上限：40 次到底在数什么
- 上下文压缩：12 万字符与最近 10 条
- 会话持久化：每轮结束落盘
- 记忆沉淀：只从完整结束的轮次里提炼
- token 账本：为什么上报的是增量
- 两百行的边界：什么故意不写进循环
- 十个常见实现陷阱
- 收尾：下一篇讲上下文
- 参考

---

## 前言：为什么第一篇写循环

Agent 这个领域最不缺名词。

规划、反思、记忆、检索、工具使用、多智能体协作、任务分解、自我修正……每一个名词都能单独写一篇文章，每一个名词背后都有一堆论文和框架。第一次接触的人很容易产生一种错觉：Agent 是一个很复杂的系统，必须先选一个框架，再往里填配置。

但如果你把一个 Agent 的进程暂停在任意一个时刻，看它正在做什么，答案通常朴素得过分：**它在等一次 HTTP 响应，或者在跑一条 shell 命令。**

模型本身是无状态的。它不记得上一轮说过什么，也不知道自己刚才调用过哪个工具。所谓「多轮对话」，是客户端每一轮都把完整历史重新发一遍；所谓「工具调用」，是模型输出一段 JSON，客户端照着 JSON 去执行，再把执行结果作为下一条消息发回去。Agent 的全部魔法，就发生在这个「发出去、拿回来、执行、再发出去」的循环里。

NanoHermes 把这件事做得非常直白。`agent/src/agent.rs` 里的 `Agent::run` 本体是 109 行，从 `pub fn run` 到右花括号，包含注释和空行。加上它直接调用的 `complete`、`execute`、`assistant_message` 和 `compact`，去掉注释与空行，核心大约两百行。

这两百行里没有异步运行时，没有状态机生成器，没有中间件管线。只有五个判定、四个变量、三道闸，以及一个 `for` 循环。

这个系列的第一篇就讲这两百行。原因很简单：**后面的上下文、记忆、工具、并发、安全、多体、观测，全都是挂在这个循环上的。** 循环看不懂，后面的每一篇都会变成背名词。

---

## 一句话：Agent = 模型 + 工具 + 循环

先把定义压到最短：

> **Agent 是一个循环：把消息和工具清单发给模型；模型返回文本或工具调用；如果有工具调用，执行它们，把结果追加进消息列表，再发一次；直到模型不再调用工具。**

这句话里有三个组成部分，缺一不可。

| 组成 | 职责 | 没有它会怎样 |
| --- | --- | --- |
| 模型 | 读消息、决定下一步、输出文本或工具调用 | 没有决策来源，只能按固定规则跑脚本 |
| 工具 | 真正读文件、改代码、跑命令、查网页 | 模型只能「说」，不能「做」，输出止于聊天框 |
| 循环 | 把模型输出变成动作，把动作结果变成模型输入 | 一次问答就结束，无法完成多步任务 |

很多人把「工具」理解成插件市场里的东西，其实工具的最小定义只是一个**有名字、有 JSON Schema、能被模型点名调用的函数**。它可以是 `read_file`，也可以是一次 HTTP 请求，甚至可以是另一个 Agent。模型不需要理解工具内部怎么实现，它只需要知道工具叫什么、参数长什么样、返回什么。

同样，循环也不需要理解模型怎么推理。它只做四件事：拼消息、发请求、执行调用、判断是否继续。把这四件事写清楚，一个 Agent 就成立了。

---

## 拆掉名词之后，只剩五个要素

把「规划」「记忆」「RAG」这些词先放到一边，一个能跑的最小 Agent 只需要五个要素。

| 要素 | 在 NanoHermes 里的对应物 | 代码位置 |
| --- | --- | --- |
| 消息列表 | `Vec<Value>`，OpenAI 的 `messages` 格式 | `Agent.messages` |
| 工具声明 | 19 个内置工具 + Skill + MCP + 子代理 | `tools::specs()`、`Agent::build_tools` |
| 一次模型调用 | 阻塞 HTTP，可选 SSE 流式 | `llm::chat` |
| 一次工具执行 | 权限检查、参数解析、钩子、分发 | `Agent::execute` |
| 终止条件 | 不再调用工具 / 被中断 / 达到迭代上限 | `Agent::run` 的三个出口 |

这五个要素里，真正容易写错的不是「怎么发 HTTP」，而是**消息列表的状态管理**。

模型是无状态的，但它对消息格式有严格假设：一条带 `tool_calls` 的 assistant 消息，后面必须跟齐每个调用的 `tool` 消息，且 `tool_call_id` 一一对应。少一条、多一条、顺序错了，API 都会拒绝。所以 Agent 的循环本质上是一个状态机：它必须保证每一轮结束后，历史仍然是一个合法的消息序列。

后面的「中断只在步骤边界生效」「工具错误也要变成结果」「并发执行但按序回填」，全部是为了守住这一条不变量。

---

## 一个用户轮次的完整时序

在贴代码之前，先看一次真实的用户轮次。假设用户说「把 README 里的安装命令改成 pnpm」。

| 步骤 | 动作 | 发生位置 | 失败时 |
| --- | --- | --- | --- |
| 1 | 按当前指令检索长期记忆，替换系统消息里的注入块 | `memory::retrieve_block`、`set_memory_block` | 静默跳过，不影响本轮 |
| 2 | 把用户消息追加到 `messages` | `Agent::run` | 不会失败 |
| 3 | 检查中断标志 | `interrupt::take()` | 直接退出循环 |
| 4 | 发一次模型请求 | `complete` → `llm::chat` | 返回 `Err`，整轮中止 |
| 5 | 累计 token 用量 | `UsageTotals` | 不会失败 |
| 6 | 把 assistant 消息追加到 `messages` | `assistant_message` | 不会失败 |
| 7 | 没有工具调用？结束 | `turn.tool_calls.is_empty()` | 正常返回 |
| 8 | 有工具调用？并发执行 | `execute` + `thread::scope` | 每个工具的错误变成字符串 |
| 9 | 把每个结果以 `role=tool` 追加 | `tool_call_id` 配对 | 不会失败 |
| 10 | 检查上下文是否超预算，必要时压缩 | `compact` | 摘要失败则退化为截断提示 |
| 11 | 回到步骤 3，继续下一轮 | `for` 循环 | 最多 `max_iterations` 次 |

这张表值得多看几眼，因为它暴露了几个设计选择：

- **记忆检索在用户消息入历史之前**。检索的 query 就是这一轮的用户输入，而不是上一轮的残留。
- **中断检查在循环顶部**。它不会在工具执行到一半时打断，只在「上一轮已经完全收尾、下一轮还没开始」的位置生效。
- **工具执行和结果回填是分开的两步**。先并发跑完所有工具，再按调用顺序逐个写回历史。这样模型看到的顺序永远和它请求的顺序一致。
- **压缩在工具结果回填之后**。压缩的对象是「已经完整的一轮」，不会把一条 assistant 工具调用和它的结果拆开。

---

## 主循环骨架：109 行的 `Agent::run`

把 UI 输出、记忆沉淀、持久化这些旁路去掉，循环骨架大概是这样。

```rust
pub fn run(&mut self, content: Value) -> Result<String, String> {
    let _guard = InterruptGuard::new();

    let user_text = memory::content_text(&content);
    if let Some(dir) = self.ctx.memory_dir.clone() {
        let block = memory::retrieve_block(&dir, &user_text);
        self.set_memory_block(&block);
    }
    self.messages.push(json!({ "role": "user", "content": content }));

    let mut completed = false;
    let mut interrupted = false;
    let mut had_tools = false;
    let mut final_text = String::new();

    for _ in 0..self.cfg.max_iterations {
        if crate::interrupt::take() {
            interrupted = true;
            break;
        }

        let turn = self.complete()?;
        self.usage.requests += 1;
        self.usage.prompt_tokens += turn.usage.prompt_tokens;
        self.usage.completion_tokens += turn.usage.completion_tokens;

        final_text = turn.content.clone();
        self.messages.push(assistant_message(&turn));

        if turn.tool_calls.is_empty() {
            completed = true;
            break;
        }
        had_tools = true;

        let results = self.run_tool_calls(&turn.tool_calls);
        for (call, result) in turn.tool_calls.iter().zip(results) {
            self.messages.push(json!({
                "role": "tool",
                "tool_call_id": call.id,
                "content": result,
            }));
        }
        self.compact();
    }

    if interrupted {
        self.style.warn("interrupted — the conversation was kept");
    } else if !completed {
        self.style.warn(&format!(
            "reached the {} iteration limit without finishing",
            self.cfg.max_iterations
        ));
    }

    self.persist();
    Ok(final_text)
}
```

这段代码为了篇幅做了两处合并：把并发执行收进了 `run_tool_calls`，把 UI 输出删掉了。原版里并发执行是内联的 `std::thread::scope`，后面单独讲。

即便如此，骨架已经完整了。你可以看到它没有任何「规划」阶段，也没有「反思」阶段。模型如果想规划，它会自己调用 `todo_write`；如果想反思，它会在下一轮看到工具结果后改变主意。**规划不是循环的一个阶段，而是模型在循环里的行为。**

这是理解 Agent 的第一个坎：不要把人类的工作流硬编码成阶段。循环只提供「行动—观察」的节奏，具体怎么行动由模型决定。

---

## 循环里的四个变量

`run` 里声明了四个可变变量，它们分别回答四个问题。

| 变量 | 类型 | 回答的问题 | 谁会给它赋值 |
| --- | --- | --- | --- |
| `completed` | `bool` | 模型是否主动停止了工具调用？ | `turn.tool_calls.is_empty()` |
| `interrupted` | `bool` | 用户是否按了 Ctrl-C？ | 循环顶部的 `interrupt::take()` |
| `had_tools` | `bool` | 这一轮是否真的执行过工具？ | 第一次进入工具分支时置 `true` |
| `final_text` | `String` | 最后一条 assistant 文本是什么？ | 每次模型响应后覆盖 |

前三个变量决定循环结束后怎么收尾，第四个决定 `run` 返回什么。

`final_text` 有一个容易忽略的细节：它每一轮都被覆盖，而不是只在结束时赋值。这意味着如果循环因为达到迭代上限而退出，返回的是**最后一次模型响应里的文本**，可能是一句「我准备继续修改」，也可能为空。调用方拿到空字符串是正常的，不代表出错。

`had_tools` 只服务于一个旁路：对话结束后是否值得提炼长期记忆。纯寒暄的轮次没有工具调用，不值得让模型再花一次请求去总结；只有真正干了活的轮次才进入提炼流程。这个变量不参与循环控制，但它是「记忆沉淀」这个功能的门槛。

`interrupted` 和 `completed` 的优先级也值得注意：中断优先。如果用户在最后一轮工具执行完之后按了 Ctrl-C，循环顶部会捕获到，`interrupted = true`，即使模型本来下一轮就会结束，也会走中断分支。这是符合直觉的：用户说停，就停。

---

## 第一步：先检索记忆，再把用户消息放进历史

循环开始之前，`run` 做了两件事：检索长期记忆，追加用户消息。

顺序很重要。检索用的 query 是 `memory::content_text(&content)`，也就是这一轮用户输入里提取出的纯文本。多模态消息（文本 + 图片）会被拆成文本部分，图片不会参与检索。然后 `retrieve_block` 返回一段已经排好版的记忆块，`set_memory_block` 把它写进系统消息。

```rust
fn set_memory_block(&mut self, block: &str) {
    if let Some(system) = self.messages.first_mut() {
        if system.get("role").and_then(|r| r.as_str()) == Some("system") {
            if let Some(text) = system.get("content").and_then(|c| c.as_str()) {
                let updated = memory::set_block(text, block);
                system["content"] = json!(updated);
            }
        }
    }
}
```

这段代码的关键不是「写进去」，而是「替换」。

系统消息里有一个带标记的记忆区块。每次检索后，新块会替换旧块，而不是追加。原因很实际：如果不替换，第二轮注入一次，第三轮再注入一次，系统提示词会随着轮次线性增长，很快就吃掉整个上下文预算。按标记整体替换，保证记忆块的大小只和检索结果有关，和对话跑了多久无关。

空块代表删除。如果这一轮没有检索到相关记忆，`set_block` 会把旧块清掉，而不是留着上一轮的残留。这也是「按当前指令检索」的题中之义：记忆应该跟着当前任务走，而不是跟着会话走。

`memory_dir` 为 `None` 时，整个记忆功能关闭，连工具层都不会暴露可用的 `memory_save` / `memory_search`（虽然声明还在，调用会返回「long-term memory is disabled」）。这一段是系列第三篇的主题，这里只需要记住：**记忆是循环的前置钩子，不是循环的一部分。**

---

## 系统提示词：短是设计，不是偷懒

`run` 不负责拼系统提示词，那是 `prompt::system_prompt` 的事。但系统提示词的形状直接影响循环的成本，所以必须在这篇讲清楚。

NanoHermes 的基础提示词很短，核心就是身份、工具使用规则、工作区路径三段。

```rust
pub fn system_prompt(cfg: &Config) -> String {
    let mut out = format!(
        r#"You are NanoHermes, a lightweight terminal coding agent working inside the user's workspace.

You help with software engineering tasks: reading and understanding code, editing files,
running commands, searching the codebase, and answering questions about the project.

Operating rules:
- You have tools. Use them to inspect the code instead of guessing about file contents or command output.
- Always read a file before editing it. Never rewrite a file you have not read.
- Prefer targeted edits (edit_file) over whole-file rewrites; keep changes minimal and focused.
- Do not add features, refactors, or "improvements" beyond what the user asked for.
- Prefer non-interactive commands (pass auto-confirm flags) since this terminal has no TTY.
- Briefly explain what you are doing, then act. Do not over-narrate.
- After each tool result, decide the next step. When the task is complete, reply with a
  concise summary and stop calling tools.

Workspace root: {root}
"#,
        root = cfg.workspace.display()
    );
    // 权限模式提示、用户人设、AGENTS.md 依次追加
    ...
}
```

这段提示词里没有「你是一个资深工程师」「你要先制定计划」这类话。不是漏了，是刻意不写。原因有三条。

**第一，提示词每轮都要重发。** 系统消息不是只发一次，它在每一次模型请求里都排在最前面。如果基础提示词是 2,000 token，跑 20 轮就是 40,000 token 的输入成本，而且每一轮都要重新计费。提示词越长，循环的边际成本越高。

**第二，长提示词会稀释工具规则。** 模型对上下文的注意力不是均匀的。把「先读再改」埋在三千字的人设后面，效果不如放在前十行。NanoHermes 把最重要的六条规则放在身份之后，就是为了让它们始终在显眼位置。

**第三，项目约定应该由项目自己提供。** 「这个仓库用 pnpm」「提交前跑 cargo fmt」这类信息不该硬编码在 Agent 里，而应该放在 `AGENTS.md`。NanoHermes 会从文件系统根目录一路读到工作区，把每一层的 `AGENTS.md` 拼起来，最后读到的（最具体的）排在最后，自然形成优先级。

系统消息的五个来源可以列成一张表。

| 来源 | 内容 | 上限 / 条件 |
| --- | --- | --- |
| 内置提示词 | 身份、六条工作规则、工作区路径 | 固定，约 30 行 |
| 权限模式提示 | Goal / Debug / Plan 各自的一行行为约束 | 仅非 Default / AcceptEdits 时追加 |
| 用户人设 | `system_prompt` 配置里的额外指令 | 非空才追加，不替换基础规则 |
| `AGENTS.md` | 全局 `~/.nanohermes/AGENTS.md` + 祖先目录逐层 | 合计 20,000 字符封顶 |
| `NANOHERMES.md` | 工作区根目录的项目上下文 | 非空才追加 |
| Skills 清单 | 可用技能的名字与一句话描述 | 发现到技能才追加 |

注意最后两行不在 `prompt.rs` 里：`NANOHERMES.md` 和 Skills 清单由 `agent.rs` 的 `system_content` 追加。分层的理由是「谁负责发现，谁负责注入」——项目文件属于工作区，技能属于运行时。

还有一个细节：`AGENTS.md` 会被 `canonicalize` 去重。同一个文件通过符号链接或多路径到达时，只读一次。拼接过长时按字符边界截断，并追加一行 `project guidance truncated`。这些处理都不复杂，但它们决定了「提示词不会因为仓库里有巨型文档而失控」。

---

## 第二步：组装工具清单

模型不会凭空知道有哪些工具。每一轮请求都要带上工具声明，声明是 JSON Schema，模型据此决定调用谁、传什么参数。

NanoHermes 的工具清单由四个来源拼成。

| 来源 | 内容 | 加入条件 |
| --- | --- | --- |
| 内置工具 | 读写文件、补丁、目录、grep、glob、shell、后台任务、网页、todo、git、记忆 | 始终存在 |
| `skill` | 按名字加载某个技能的完整说明 | 工作区里发现了技能 |
| MCP 工具 | 每个 MCP 服务器暴露的工具 | 配置了 MCP 服务器 |
| MCP 辅助工具 | `mcp_list_resources`、`mcp_read_resource`、`mcp_list_prompts`、`mcp_get_prompt` | 配置了 MCP 服务器 |
| 子代理 | `subagent`、`agent_list` | 配置了子代理定义 |

拼完之后还有一道过滤：

```rust
fn build_tools(&self) -> Value {
    let mut list = tools::specs().as_array().cloned().unwrap_or_default();
    if !self.ctx.skills.is_empty() {
        list.push(skill_tool_spec());
    }
    if let Some(m) = &self.mcp {
        list.extend(m.all_tools());
        list.extend(mcp_aux_tools());
    }
    list.retain(|t| {
        let name = t.get("function")
            .and_then(|f| f.get("name"))
            .and_then(|n| n.as_str())
            .unwrap_or("");
        self.cfg.check_tool(name).is_ok()
    });
    if !self.cfg.subagents.is_empty() {
        list.push(subagent_tool_spec());
        list.push(agent_list_tool_spec());
    }
    Value::Array(list)
}
```

`check_tool` 的规则是三道，按优先级从高到低：

1. **权限模式的硬封锁**：Plan 模式封掉所有写操作和 `run_command`，Debug 模式封掉写操作但允许跑命令。
2. **deny 列表**：显式禁止的工具永远不能执行。
3. **allow 列表**：一旦配置了 allow 列表，只有列表里的工具能执行。

| 权限模式 | 硬封锁的工具 | 适用场景 |
| --- | --- | --- |
| Default | 无 | 日常使用，按 `auto_approve` 决定是否确认 shell |
| AcceptEdits | 无，但 shell 始终要确认 | 想让文件编辑免确认、命令仍需把关 |
| Plan | `write_file`、`edit_file`、`apply_patch`、`run_command`、`git_commit` | 只读分析，产出方案 |
| Goal | 无，且永不确认 | 无人值守，跑到目标完成 |
| Debug | `write_file`、`edit_file`、`apply_patch`、`git_commit` | 允许复现问题，但不许改坏现场 |

这里有一个实现上的小不对称：`subagent` 和 `agent_list` 是在 `retain` 之后追加的，所以构建清单时它们没经过 `check_tool`。但真正执行时，`execute` 会再过一次 `check_tool`，所以安全性不受影响。清单只是「广告」，执行才是「闸门」。这也解释了一个设计原则：**工具声明可以宽，执行必须严。**

工具声明的顺序也有影响。模型在同等条件下倾向于先看到、先选择靠前的工具。NanoHermes 把最常用的读写、搜索、shell 放在前面，把记忆、git、后台任务放在后面。这不是玄学，是减少模型在长清单里的选择成本。

---

## 第三步：发一次模型请求

`complete` 是循环里最短的函数之一，它只做两件事：取工具清单，按输出格式选择回调。

```rust
fn complete(&self) -> Result<AssistantTurn, String> {
    let style = self.style.clone();
    let tools = self.build_tools();
    match self.cfg.output_format {
        OutputFormat::StreamJson => {
            llm::chat(&self.cfg, &self.messages, &tools, |delta| {
                if !delta.is_empty() {
                    println!("{}", json!({ "delta": delta }));
                }
            })
        }
        _ => llm::chat(&self.cfg, &self.messages, &tools, |delta| {
            style.stream(delta)
        }),
    }
}
```

输出格式在这里分叉：普通文本模式把增量交给终端渲染器；`stream-json` 模式把每个增量包成一个 JSON 对象打到 stdout，方便管道处理。两者的 HTTP 请求完全一样，区别只在「增量到达时怎么处理」。

真正的请求在 `llm::chat` 里。它构造请求体、处理重试、选择流式或非流式读取，最后返回一个 `AssistantTurn`：

```rust
pub struct AssistantTurn {
    pub content: String,
    pub tool_calls: Vec<ToolCall>,
    pub usage: Usage,
}
```

这个结构是循环的「输入」。`content` 是模型说的话，`tool_calls` 是模型想做的动作，`usage` 是这次请求的 token 消耗。循环只关心前两个，第三个进账本。

---

## 请求体里每个字段都在回答一个问题

`llm::chat` 的 `build_body` 很短，但每个字段都对应一个实际约束。

| 字段 | 值 | 回答的问题 |
| --- | --- | --- |
| `model` | 当前配置或 fallback | 用哪个模型 |
| `messages` | 完整历史 | 模型需要看到什么 |
| `temperature` | 默认 `0.0` | 要不要随机性 |
| `max_tokens` | 默认 `4096` | 单次响应最多多长 |
| `stream` | 默认 `true` | 要不要边生成边显示 |
| `tools` | 工具声明数组 | 模型能调用什么 |
| `tool_choice` | `"auto"` | 让模型自己决定是否调用 |
| `reasoning_effort` | `"high"` | 是否开启扩展思考 |
| `stream_options` | `{"include_usage": true}` | 流式响应里要不要带用量 |

```rust
let build_body = |model: &str| {
    let mut body = json!({
        "model": model,
        "messages": messages,
        "temperature": cfg.temperature,
        "max_tokens": cfg.max_tokens,
        "stream": cfg.stream,
    });
    if has_tools {
        body["tools"] = tools.clone();
        body["tool_choice"] = "auto".into();
    }
    if cfg.thinking {
        body["reasoning_effort"] = "high".into();
    }
    if cfg.stream {
        body["stream_options"] = json!({ "include_usage": true });
    }
    body
};
```

几个选择值得解释。

**`temperature` 默认 0.0。** coding agent 不是创意写作，代码修改需要可复现。温度越高，同一份上下文产生的 diff 越随机，调试成本越高。NanoHermes 把默认值设成 0，需要发散时再通过配置调高。

**`max_tokens` 默认 4096。** 这不是模型的上限，是单次响应的预算。工具调用本身很短，4096 足够容纳一次「解释 + 多个工具调用」。太大的值会让模型倾向于写长回复，反而拖慢循环。

**`tool_choice` 只在有工具时出现。** 没有工具还传 `"auto"`，有些 API 会直接报错。`has_tools` 这个布尔值就是为了避免这种低级错误。

**`stream_options.include_usage` 是流式用量的来源。** 默认的 SSE 流不会在最后带 usage，必须显式要求。NanoHermes 需要这个字段才能在没有非流式响应的情况下记账。

**没有 `top_p`、`seed`、`presence_penalty`。** 不是这些参数没用，而是它们对 coding agent 的收益太低，传了只会增加兼容性风险。不同厂商的 OpenAI 兼容层对这些字段的支持程度不一样，少传一个就少一个「某家 API 不认」的故障点。

---

## 重试与降级：只认五种错误

网络请求会失败。Agent 的循环不能因为一次 429 就整轮崩掉，所以 `llm::chat` 外面套了一个重试循环。

```rust
let mut attempt: u32 = 0;
loop {
    match chat_with_model(cfg, build_body(&cfg.model), &mut on_text) {
        Ok(turn) => return Ok(turn),
        Err(e) => {
            if is_retryable_error(&e) && attempt < cfg.max_retries {
                attempt += 1;
                let delay = backoff_ms(cfg.retry_base_ms, attempt);
                eprintln!("note: retrying in {delay}ms (attempt {attempt}/{})", cfg.max_retries);
                std::thread::sleep(Duration::from_millis(delay));
                continue;
            }
            if let Some(fallback) = &cfg.fallback_model {
                if is_retryable_error(&e) {
                    return chat_with_model(cfg, build_body(fallback), &mut on_text);
                }
            }
            return Err(e);
        }
    }
}
```

`is_retryable_error` 的判断非常朴素：错误字符串里包含 `HTTP 429`、`HTTP 500`、`HTTP 502`、`HTTP 503` 或 `HTTP 504`。

| 错误 | 是否重试 | 理由 |
| --- | --- | --- |
| HTTP 429 | 是 | 限流，等一会儿可能恢复 |
| HTTP 500 | 是 | 服务端内部错误，可能瞬时 |
| HTTP 502 / 503 / 504 | 是 | 网关或上游暂时不可用 |
| HTTP 400 / 401 / 403 | 否 | 请求格式、鉴权、权限问题，重试无用 |
| JSON 解析失败 | 否 | 响应结构不对，重试大概率一样 |
| 连接超时 | 否 | 错误字符串不匹配，直接失败 |

退避公式是 `base * 2^(attempt-1)`，上限 30 秒。默认 `base = 500ms`、`max_retries = 2`，所以最多等 500ms、1000ms 两次，总共 1.5 秒。这个量级适合交互式 CLI：用户还在等，不能睡太久。

```rust
fn backoff_ms(base_ms: u64, attempt: u32) -> u64 {
    base_ms
        .saturating_mul(2u64.saturating_pow(attempt.saturating_sub(1)))
        .min(30_000)
}
```

重试耗尽后，如果配置了 `fallback_model`，会用备用模型再试一次。注意这次不再重试，只试一次。备用模型的意义是「主模型限流时还能干活」，不是「无限续命」。

这里有一个诚实但容易被忽略的代价：**流式请求如果在吐出部分文本后失败，重试会再次触发 `on_text`，界面上可能出现重复文本。** NanoHermes 没有做增量去重，因为绝大多数可重试错误发生在建立连接或首帧阶段；真正的中途断流属于少数情况，去重逻辑的复杂度不值得。知道这个边界，比假装它不存在更好。

---

## 流式解析：一行一行读 SSE

流式响应是 `text/event-stream`，格式是一行一行的 `data: {...}`。NanoHermes 没有引入 SSE 库，而是直接用 `BufReader::lines()` 读。

```rust
fn read_stream(resp: ureq::Response, on_text: &mut impl FnMut(&str))
    -> Result<AssistantTurn, String>
{
    let mut turn = AssistantTurn::default();
    let reader = BufReader::new(resp.into_reader());

    for l in reader.lines() {
        let l = match l {
            Ok(l) => l,
            Err(e) => return Err(format!("stream read error: {e}")),
        };
        let l = l.trim_end_matches(['\r', '\n']);
        if l.is_empty() || l.starts_with(':') {
            continue;
        }
        let data = match l.strip_prefix("data:") {
            Some(d) => d.trim(),
            None => continue,
        };
        if data == "[DONE]" {
            break;
        }
        let v: Value = match serde_json::from_str(data) {
            Ok(v) => v,
            Err(_) => continue,
        };
        if let Some(err) = v.get("error") {
            return Err(format!("API error: {err}"));
        }
        if v.get("usage").is_some() {
            turn.usage = usage_from_value(&v);
        }
        let Some(delta) = v.get("choices").and_then(|c| c.get(0))
            .and_then(|c| c.get("delta")) else { continue };
        if let Some(text) = delta.get("content").and_then(|c| c.as_str()) {
            if !text.is_empty() {
                turn.content.push_str(text);
                on_text(text);
            }
        }
        accumulate_tool_calls(delta.get("tool_calls"), &mut turn.tool_calls);
    }
    Ok(turn)
}
```

这段代码处理了六种帧。

| 帧类型 | 处理方式 | 为什么 |
| --- | --- | --- |
| 空行 | 跳过 | SSE 用空行分隔事件 |
| 以 `:` 开头 | 跳过 | 注释或 keep-alive |
| `data: [DONE]` | 结束循环 | 流的终止标记 |
| `data: {...}` 带 `error` | 返回 `Err` | 服务端在流里报错 |
| `data: {...}` 带 `usage` | 更新用量 | 流式用量在末尾单独一帧 |
| `data: {...}` 带 `delta` | 累积文本 / 工具调用 | 正常增量 |
| 无法解析的 JSON | 跳过 | 容忍半帧或厂商扩展 |

「无法解析就跳过」看起来危险，其实是流式解析的必要妥协。网络分帧不保证每次 `read` 都拿到完整 JSON；`lines()` 已经按行切了，但某些厂商会在 `data:` 里放非标准字段。跳过坏帧，比整轮失败更划算。真正的错误会通过 `error` 字段或 HTTP 状态暴露，不会只藏在坏帧里。

非流式路径的 `read_json` 更简单：解析整个响应体，取 `choices[0].message`，读 `content`、`tool_calls`、`usage`。如果响应里没有 `choices`，会返回一个带截断响应体的错误，方便排查兼容层返回了什么。

---

## 工具调用是拼出来的，不是读出来的

非流式响应里，`tool_calls` 是一个完整的数组。流式响应里不是。

OpenAI 的流式工具调用是**增量拼接**的：每个 delta 带一个 `index`，表示这是第几个调用；`id` 和 `function.name` 通常只在第一帧出现；`function.arguments` 是一段一段的字符串片段，需要按顺序追加。

```rust
fn accumulate_tool_calls(tcs: Option<&Value>, out: &mut Vec<ToolCall>) {
    let Some(arr) = tcs.and_then(|t| t.as_array()) else { return };
    for tc in arr {
        let idx = tc.get("index").and_then(|i| i.as_u64()).unwrap_or(0) as usize;
        if out.len() <= idx {
            out.resize(idx + 1, ToolCall::default());
        }
        let slot = &mut out[idx];
        if let Some(id) = tc.get("id").and_then(|i| i.as_str()) {
            if !id.is_empty() {
                slot.id = id.to_string();
            }
        }
        if let Some(f) = tc.get("function") {
            if let Some(name) = f.get("name").and_then(|n| n.as_str()) {
                if !name.is_empty() {
                    slot.name = name.to_string();
                }
            }
            if let Some(args) = f.get("arguments").and_then(|a| a.as_str()) {
                slot.arguments.push_str(args);
            }
        }
    }
}
```

假设模型要同时读两个文件，流可能是这样的。

| 帧 | `index` | 内容 | 累积结果 |
| --- | --- | --- | --- |
| 1 | 0 | `id=call_a, name=read_file` | 槽 0：名字就位，参数为空 |
| 2 | 0 | `arguments={"path":"a` | 槽 0：参数字符串前半段 |
| 3 | 0 | `.rs"}` | 槽 0：参数拼接完成 |
| 4 | 1 | `id=call_b, name=read_file` | 槽 1：第二个调用出现 |
| 5 | 1 | `arguments={"path":"b.rs"}` | 槽 1：参数拼接完成 |

这里有三个必须写对的点。

**第一，`arguments` 必须是 `push_str`，不能是赋值。** 写成 `slot.arguments = args` 会只保留最后一段，模型收到的 JSON 永远是残缺的，工具会报「invalid JSON arguments」。

**第二，`id` 和 `name` 只在非空时覆盖。** 后续帧里这两个字段通常是 `null` 或空字符串。如果无条件赋值，槽里的名字会被清空。

**第三，槽位要按 `index` 扩容。** 模型可能先发 `index=1` 再发 `index=0`，也可能跳过某个 index。`resize(idx + 1, default)` 保证槽位存在，最后按顺序执行时不会越界。

拼接完成后，`AssistantTurn.tool_calls` 是一个有序数组。循环按这个顺序执行，也按这个顺序回填结果。模型看到的 `tool_call_id` 顺序和它请求的顺序一致，这是后面配对的前提。

---

## `assistant_message`：为什么空 content 要写 `null`

模型返回的 `AssistantTurn` 不能直接塞回 `messages`。OpenAI 的消息格式要求 assistant 消息里的工具调用是另一种结构：

```rust
fn assistant_message(turn: &AssistantTurn) -> Value {
    let content = if turn.content.is_empty() {
        Value::Null
    } else {
        Value::String(turn.content.clone())
    };
    if turn.tool_calls.is_empty() {
        return json!({ "role": "assistant", "content": content });
    }
    let calls: Vec<Value> = turn.tool_calls.iter().map(|c| {
        let args = if c.arguments.trim().is_empty() { "{}" } else { &c.arguments };
        json!({
            "id": c.id,
            "type": "function",
            "function": { "name": c.name, "arguments": args }
        })
    }).collect();
    json!({ "role": "assistant", "content": content, "tool_calls": calls })
}
```

三个细节。

**空 content 写 `null`，不写空字符串。** 有些兼容层对 `content: ""` 和 `content: null` 的处理不一样。当一条 assistant 消息只包含工具调用时，标准做法是 `content: null`。写空字符串在部分厂商那里会被当成「模型说了空话」，甚至触发校验错误。

**空参数写 `{}`。** 模型有时会发出 `arguments: ""`，表示这个工具没有参数。直接原样回传，历史里会留下一个空字符串，下一轮 API 可能拒绝。统一补成 `{}`，让历史始终是合法 JSON。

**`tool_calls` 只在非空时出现。** 纯文本响应不需要这个字段。多写一个空数组，有些 API 会认为「模型声明了工具调用但没给内容」，行为不确定。

这些都不是「洁癖」，而是跨厂商兼容的生存技巧。OpenAI 兼容层不是标准，每个厂商都有自己的宽容度。Agent 的历史会被反复重发，任何一处不合法都会在下一轮放大成 400。

---

## 第四步：执行工具

`execute` 是循环里最像「安全边界」的函数。它不直接分发，而是先过三道检查。

```rust
fn execute(&self, call: &llm::ToolCall) -> String {
    if let Err(reason) = self.cfg.check_tool(&call.name) {
        return format!("ERROR: {reason}");
    }

    let args: Value = if call.arguments.trim().is_empty() {
        json!({})
    } else {
        match serde_json::from_str(&call.arguments) {
            Ok(v) => v,
            Err(e) => return format!("ERROR: invalid JSON arguments for `{}`: {e}", call.name),
        }
    };

    for hook in self.cfg.hooks.iter()
        .filter(|h| h.event == HookEvent::PreToolUse && h.matches(&call.name))
    {
        match hooks::run(hook, &call.name, &args, &self.cfg.workspace) {
            Ok(o) if o.ok() => {}
            Ok(o) => return format!(
                "ERROR: `{}` blocked by PreToolUse hook (exit {}):\n{}",
                call.name, o.code, o.output
            ),
            Err(e) => return format!("ERROR: PreToolUse hook failed: {e}"),
        }
    }

    let mut result = self.run_tool(&call.name, &args);

    for hook in self.cfg.hooks.iter()
        .filter(|h| h.event == HookEvent::PostToolUse && h.matches(&call.name))
    {
        match hooks::run(hook, &call.name, &args, &self.cfg.workspace) {
            Ok(o) if o.ok() => {}
            Ok(o) => result.push_str(&format!(
                "\n[PostToolUse hook exited {}]\n{}", o.code, o.output
            )),
            Err(e) => result.push_str(&format!("\n[PostToolUse hook failed: {e}]")),
        }
    }
    result
}
```

把这个函数拆开看，它其实是一条流水线：

1. **权限检查**：这个工具在当前模式、allow/deny 列表下能不能跑。
2. **参数解析**：模型给的 JSON 是不是合法。不合法就返回错误字符串，不 panic。
3. **执行前钩子**：用户可以挂自己的脚本，非零退出直接否决这次调用。
4. **分发执行**：交给 `run_tool`。
5. **执行后钩子**：不能否决，只能追加警告。

最值得注意的是第 2 步和第 3 步的失败处理：**它们返回的是字符串，不是 `Err`，更不是 panic。** 这意味着参数写错的工具调用不会中止整轮对话，模型会在下一条 `tool` 消息里看到「你的 JSON 不合法」，然后自己重试。

这是 Agent 和普通程序的一个重要区别：**错误是模型的输入，不是程序的终止信号。** 普通函数遇到非法参数会抛异常，Agent 的工具层要把异常翻译成模型能读懂的一句话。

---

## 三道闸：权限、参数、钩子

把三道闸分开看，各自的职责和失败语义不一样。

| 闸门 | 检查内容 | 失败时模型看到什么 | 能否恢复 |
| --- | --- | --- | --- |
| 权限闸 | 模式封锁、deny 列表、allow 列表 | `ERROR: tool ... is not available in Plan mode` | 换模式或换工具 |
| 参数闸 | `arguments` 是否为合法 JSON | `ERROR: invalid JSON arguments for ...` | 重新生成参数 |
| 前置钩子 | 用户脚本的退出码 | `ERROR: ... blocked by PreToolUse hook` | 改命令或绕过 |
| 后置钩子 | 用户脚本的警告 | 结果末尾追加 `[PostToolUse hook exited N]` | 不影响结果 |

权限闸的语义最强：它在工具清单构建时已经过滤过一次，执行时又检查一次。为什么重复？因为清单是给模型看的，模型可能凭记忆调用一个已经被过滤掉的工具；执行时的检查才是真正的安全边界。

参数闸的语义最弱：它只保证「是合法 JSON」，不保证「符合工具的 Schema」。`read_file` 要求 `path` 是字符串，模型传了数字，`fs::read_file` 里的 `req_str` 会返回错误，同样变成字符串结果。Schema 校验没有单独做，是因为每个工具自己最清楚参数该怎么解释，集中校验反而容易和实现脱节。

钩子闸是唯一允许「一票否决」的外部扩展点。`PreToolUse` 非零退出，工具就不会执行；`PostToolUse` 非零退出，工具已经执行完了，只能追加警告。这个设计把「阻止」和「提醒」分开，避免后置钩子产生「已经改了文件但假装没改」的错觉。

---

## 工具结果一律是字符串

`run_tool` 负责真正的分发，它的返回类型是 `String`，不是 `Result<String, String>`。

```rust
fn run_tool(&self, name: &str, args: &Value) -> String {
    if name == "subagent" {
        let sname = args.get("name").and_then(|n| n.as_str()).unwrap_or("");
        let task = args.get("task").and_then(|t| t.as_str()).unwrap_or("");
        return match self.run_subagent(sname, task) {
            Ok(s) => s,
            Err(e) => format!("ERROR: {e}"),
        };
    }

    match tools::dispatch(name, args, &self.ctx) {
        Ok(s) => s,
        Err(e) => {
            if e.contains("unknown tool") {
                if let Some(m) = &self.mcp {
                    if let Some(result) = m.call(name, args) {
                        return match result {
                            Ok(s) => s,
                            Err(err) => format!("ERROR: {err}"),
                        };
                    }
                }
            }
            format!("ERROR: {e}")
        }
    }
}
```

`tools::dispatch` 自己返回 `Result<String, String>`，每个工具实现也返回同样的类型。到了 `run_tool` 这一层，错误被统一翻译成 `ERROR: ...` 字符串。成功的内置工具结果也不会原样回灌：`dispatch` 最后一行是 `r.map(|s| clamp(s, ctx.max_output))`，默认 `max_output = 20_000`；超过上限时按字符边界截断，并注明省略了多少。注意这个上限按字节长度算，不是 token 数。

这个设计有一个直接后果：**模型永远能看到工具失败的原因。**

| 失败类型 | 工具层返回 | 模型下一轮会做什么 |
| --- | --- | --- |
| 文件不存在 | `ERROR: path: No such file or directory` | 换路径或先 `list_dir` |
| `old_string` 找不到 | `ERROR: old_string not found ... read the file and match it exactly` | 重新读文件 |
| `old_string` 多处匹配 | `ERROR: occurs N times ... pass replace_all=true` | 补上下文或加 `replace_all` |
| 文件超过 4 MB | `ERROR: ... read it in chunks with offset/limit` | 带 `offset` / `limit` 重读 |
| 命令被用户拒绝 | `Command denied by the user. Do not retry it; ask what to do instead.` | 停下来问用户 |
| shell 非零退出 | 正常结果，包含 `exit code: N` 和 stderr | 分析错误并修正 |
| 未知工具 | `ERROR: unknown tool ...` | 换工具 |

注意「命令被用户拒绝」这一行：它不是 `ERROR:` 开头，而是一句明确的指令 `Do not retry it; ask what to do instead.`。这是有意为之。模型对 `ERROR:` 的默认反应是「重试或换个参数」，但对用户拒绝，正确的反应是停下来。错误文案本身就是行为引导。

还有一层：`tools::dispatch` 返回「unknown tool」时，`run_tool` 会再去 MCP 服务器里找同名工具。这是内置工具和 MCP 工具的统一入口。内置工具先匹配，匹配不到才走 MCP，避免 MCP 服务器覆盖内置工具的行为。

---

## 回灌历史：`tool_call_id` 是配对的锚

工具执行完之后，结果要回到 `messages`。这一步看起来只是三行 `json!`，其实是最容易破坏历史不变量的一步。

```rust
for (call, result) in turn.tool_calls.iter().zip(results) {
    self.style.tool_call(&call.name, &summarize(&call.name, &call.arguments), &result);
    self.messages.push(json!({
        "role": "tool",
        "tool_call_id": call.id,
        "content": result,
    }));
}
```

一条工具结果消息只包含三个字段：角色是 `tool`，`tool_call_id` 指向 assistant 消息里的某个调用，`content` 是结果字符串。没有 `name` 字段，没有时间戳，没有结构化 JSON。

为什么这么简单？因为 API 只认这个形状。`tool_call_id` 是配对的唯一锚点，模型靠它把「我刚才请求的第三个调用」和「这条结果」对应起来。如果 id 写错、写空、或者顺序错乱，模型会收到一组对不上的结果，轻则答非所问，重则 API 直接 400。

一次带两个工具调用的轮次，历史长这样。

| 序号 | role | 关键字段 | 说明 |
| --- | --- | --- | --- |
| 1 | system | `content` | 系统提示词 + 记忆块 |
| 2 | user | `content` | 用户指令 |
| 3 | assistant | `content: null`, `tool_calls: [call_a, call_b]` | 模型请求两个工具 |
| 4 | tool | `tool_call_id: call_a` | 第一个工具的结果 |
| 5 | tool | `tool_call_id: call_b` | 第二个工具的结果 |
| 6 | assistant | `content: "已经改好了"` | 模型看到结果后的总结 |

这个序列必须严格保持。尤其注意第 3 条：assistant 消息里的 `tool_calls` 顺序是 `[call_a, call_b]`，第 4、5 条的顺序也必须一致。NanoHermes 用 `zip` 保证这一点：`turn.tool_calls` 和 `results` 按同一顺序配对，即使 `call_b` 先执行完，`call_a` 的结果仍然排在前面。

---

## 第五步：循环从哪里出去

循环有三个出口，每个出口对应一种收尾方式。

| 出口 | 触发条件 | `run` 返回 | 历史状态 | 提示 |
| --- | --- | --- | --- | --- |
| 正常完成 | `turn.tool_calls.is_empty()` | 最后一条 assistant 文本 | 完整，最后一条是 assistant | 无 |
| 用户中断 | 循环顶部 `interrupt::take()` 为真 | 最后一次 assistant 文本 | 完整，最后一条是工具结果 | 保留上下文，可 `/undo` |
| 迭代上限 | `for` 跑满 `max_iterations` | 最后一次 assistant 文本 | 完整，最后一条是工具结果 | 警告「未完成」 |

三个出口都保证历史是合法的。这是循环设计里最重要的一条不变量。

为什么中断和上限退出时，历史最后一条是工具结果而不是 assistant 工具调用？因为检查点放在循环顶部。上一轮的工具结果已经全部回填，`compact` 也跑完了，下一轮还没发请求。在这个位置退出，历史停在「工具调用 + 全部结果」的完整状态，模型下次接着跑不会缺配对。

如果中断检查放在工具执行中间，就可能出现「assistant 请求了三个工具，只回填了一个结果」的状态。下一次请求会直接被 API 拒绝，而且用户看不出原因。这个坑很隐蔽，后面「十个陷阱」里会再提一次。

正常完成时，最后一条 assistant 消息没有 `tool_calls`，只有文本。`final_text` 就是这条文本。如果模型在最后一轮既说了话又调用了工具，循环会继续，不会把「说话」当成结束。**只有「不再调用工具」才是完成信号。**

---

## 并发工具调用：作用域线程与按序回收

模型经常在一次响应里请求多个工具。比如「读三个文件」「同时跑测试和 lint」。串行执行会让总延迟等于各工具延迟之和，所以 NanoHermes 在工具调用多于一个时并发执行。

```rust
let results: Vec<String> = if turn.tool_calls.len() == 1 {
    vec![self.execute(&turn.tool_calls[0])]
} else {
    let this: &Agent = self;
    std::thread::scope(|s| {
        let handles: Vec<_> = turn.tool_calls.iter()
            .map(|call| s.spawn(move || this.execute(call)))
            .collect();
        handles.into_iter()
            .map(|h| h.join().unwrap_or_else(|_| {
                "ERROR: tool thread panicked".to_string()
            }))
            .collect()
    })
};
```

这里用的是 `std::thread::scope`，不是 `tokio::spawn`，也不是线程池。每个工具调用一个线程，跑完就回收。

| 方案 | 延迟 | 复杂度 | 适用场景 |
| --- | --- | --- | --- |
| 串行执行 | 各工具之和 | 最低 | 工具之间强依赖、调用数少 |
| 每次一个线程 | 最慢的那个 | 低 | 调用数少、工具是阻塞 IO |
| 线程池 | 受池大小限制 | 中 | 高频短任务 |
| async 运行时 | 最慢的那个 | 高 | 大量并发、需要取消 |

NanoHermes 选第二个，理由和它的整体纲领一致：**一次响应里的工具调用通常只有 1–5 个，为这个量级引入线程池或异步运行时，收益远小于复杂度。**

`thread::scope` 的好处是生命周期由编译器保证：线程借用的 `&Agent` 一定活到 `join` 结束，不需要 `Arc`，也不需要 `'static`。代价是 `Agent` 必须实现 `Sync`——这反过来约束了 `Ctx` 里的共享状态（任务管理器、todo 列表、子代理任务板、并发门）必须用内部可变性 + 同步原语，而不是 `&mut`。这是一个「类型系统逼着你把共享状态设计对」的例子。

结果回收用 `zip` 保证顺序。`join` 按 `handles` 的顺序调用，所以即使第三个工具最先完成，`results[0]` 仍然是第一个调用的结果。线程 panic 不会让整个进程崩溃，`join` 返回 `Err`，被翻译成一条 `ERROR: tool thread panicked` 结果。模型会看到「这个工具挂了」，而不是进程退出。

并发也带来一个新的问题：**副作用可能交错。** 两个 `write_file` 同时写同一个文件，结果取决于谁先落盘；一个 `git_commit` 和一个 `edit_file` 同时跑，提交的内容不确定。NanoHermes 没有做工具级的互斥，因为模型很少主动请求这种冲突组合，而且真实冲突应该由工具自己处理（比如 git 的锁）。这是一个「把复杂度留给必要的地方」的取舍。

---

## 中断：Ctrl-C 只在步骤边界生效

终端 Agent 必须能被中断。但「中断」不是简单地把进程杀掉，否则会话历史会停在半截，下次恢复直接坏掉。

NanoHermes 的做法是：Ctrl-C 不杀进程，只置一个原子标志；循环在步骤边界检查这个标志。

```rust
struct InterruptGuard;

impl InterruptGuard {
    fn new() -> Self {
        crate::interrupt::take();
        crate::interrupt::install();
        InterruptGuard
    }
}

impl Drop for InterruptGuard {
    fn drop(&mut self) {
        crate::interrupt::restore_default();
    }
}
```

`run` 的第一行是 `let _guard = InterruptGuard::new();`。这个 guard 在 `run` 结束时自动 `Drop`，恢复默认的 SIGINT 行为。即使用户在工具执行期间按了 Ctrl-C，信号处理器也只是把标志置位，不会终止进程。

循环顶部的检查是唯一的消费点：

```rust
for _ in 0..self.cfg.max_iterations {
    if crate::interrupt::take() {
        interrupted = true;
        break;
    }
    // ...
}
```

这个位置保证了中断不会发生在「工具执行到一半」。用户按下 Ctrl-C 后，当前工具会继续跑完，结果照常回填，`compact` 照常执行，然后下一轮开始时才发现标志，退出循环。

| 中断时机 | 行为 | 历史状态 |
| --- | --- | --- |
| 模型请求过程中 | 请求继续，响应到达后回填 | 完整 |
| 工具执行过程中 | 当前工具跑完，结果回填 | 完整 |
| 工具结果回填后、下一轮前 | 立即退出 | 完整 |
| 多工具并发执行中 | 所有线程 join 完再退出 | 完整 |

代价是「停止」不够即时。如果一个 `run_command` 要跑 120 秒，用户按下 Ctrl-C 后最多还要等 120 秒。这是有意的取舍：宁可慢一点，也不要把历史弄坏。真要立即杀，应该用后台任务 + `task_kill`，而不是中断整个轮次。

`InterruptGuard` 的注释里还提到「引用计数」，让嵌套轮次（比如工具里又跑了一个子代理轮次）不会拆掉外层的处理器。这个细节保证了中断语义在嵌套场景下仍然一致。

中断之后，`run` 会打印一句提示，告诉用户对话已保留，可以输入新指令或 `/undo` 回退。`/undo` 的实现是 `rewind`：从最后一条 user 消息往前找，删掉整个轮次。它和中断是两套机制，一个是「停」，一个是「退」。

---

## 迭代上限：40 次到底在数什么

`max_iterations` 的默认值是 40。这个数字经常被误解成「最多调用 40 次工具」，其实不是。

它数的是**模型往返回合数**。一次合回 = 一次 `complete()` = 一次 HTTP 请求 + 该响应里的所有工具调用。如果模型一次响应请求了 5 个工具，那仍然只算 1 次迭代。

| 场景 | 典型迭代数 | 说明 |
| --- | --- | --- |
| 回答一个概念问题 | 1 | 模型直接回复，不调用工具 |
| 读一个文件并解释 | 2–3 | 读文件、可能再读一次、总结 |
| 修一个明确的 bug | 4–8 | 读、改、跑测试、再改 |
| 实现一个小功能 | 8–20 | 探索、多文件修改、验证 |
| 长任务 / 重构 | 20–40 | 容易触顶 |
| 死循环 | 40 | 模型反复调用同一个失败工具 |

40 是一个很宽松的上限。它的作用不是「限制正常任务」，而是「兜住模型卡死」。没有这个上限，模型可能在一个永远失败的命令上无限重试，烧掉大量 token。

循环跑满时会打印 `reached the 40 iteration limit without finishing`。注意措辞是「未完成」，不是「出错」。达到上限不是异常，是一个正常的资源边界。

上限也和成本直接相关。假设每轮输入 8,000 token、输出 500 token，40 轮就是 320,000 输入 token 加 20,000 输出 token。对于按量计费的 API，这是一笔不能忽略的钱。`max_iterations` 是成本控制的第一道闸，第二道是上下文压缩，第三道是工具输出上限。

---

## 上下文压缩：12 万字符与最近 10 条

循环跑得越久，`messages` 越大。每一轮请求都要把完整历史发一遍，历史越大，输入 token 越多，延迟越高，最终会超过模型的上下文窗口。

NanoHermes 的压缩策略是「超预算就把旧消息换成一段摘要」。

```rust
fn compact_with(&mut self, force: bool) -> usize {
    let size: usize = self.messages.iter().map(|m| m.to_string().len()).sum();
    if !force && (size <= CONTEXT_CHAR_BUDGET || self.messages.len() <= KEEP_RECENT + 1) {
        return 0;
    }

    let mut start = self.messages.len().saturating_sub(KEEP_RECENT);
    while start < self.messages.len() && self.messages[start]["role"] == "tool" {
        start += 1;
    }
    if start <= 1 {
        return 0;
    }

    let dropped: Vec<Value> = self.messages.drain(1..start).collect();
    let note = match self.summarize_messages(&dropped) {
        Some(summary) => format!("[Earlier conversation summary]\n{summary}"),
        None => "[Earlier conversation was omitted to keep the context small]".to_string(),
    };
    self.messages.insert(1, json!({ "role": "system", "content": note }));
    self.style.note(&format!("compacted: {} messages", dropped.len()));
    dropped.len()
}
```

参数和边界如下。

| 参数 | 值 | 作用 |
| --- | --- | --- |
| `CONTEXT_CHAR_BUDGET` | `120_000` | 触发压缩的字符预算（序列化后的 JSON 长度） |
| `KEEP_RECENT` | `10` | 永远保留的最近消息条数 |
| 摘要长度 | 最多 300 词 | `llm::summarize` 的提示词约束 |
| 压缩位置 | `messages[1]` | 系统消息之后插入摘要 |
| 失败回退 | 一行占位说明 | 摘要请求失败时不让历史缺口无声消失 |

几个细节值得展开。

**预算按字符算，不按 token 算。** 精确 token 数需要 tokenizer，引入 tokenizer 会破坏「三个依赖 crate」的纲领。字符数是近似值，对中英文混排的误差在可接受范围内。120,000 字符大约对应 30,000–60,000 token，取决于语言比例。

**保留最近 10 条，而不是最近 10 轮。** 一条工具结果也算一条。一次带 5 个工具调用的轮次会占 7 条（user、assistant、5 个 tool）。这样做的目的是保证「最近一次工具交互」一定还在上下文里，模型不会刚拿到结果就忘了。

**切点不能落在 tool 消息中间。** `while start < len && messages[start]["role"] == "tool"` 把切点往后推，直到不是工具结果。否则会出现「assistant 的工具调用被摘要掉了，但 tool 结果还在」的非法序列。

**摘要失败要留痕。** 如果摘要请求失败，插入一行 `[Earlier conversation was omitted ...]`，而不是什么都不插。模型需要知道「有一段历史被省略了」，否则它会以为自己一直只有这么点上下文。

**压缩是同步的。** 它会在工具结果回填之后、下一轮请求之前阻塞执行。摘要本身就是一次模型请求，所以压缩那一轮的实际延迟会多一次模型往返。这是不可避免的成本，但只在超预算时发生。

`/compact` 命令可以强制压缩，走的是 `compact_with(true)`，忽略预算检查。它返回被摘要掉的消息数，用户可以据此判断压缩有没有生效。

---

## 会话持久化：每轮结束落盘

`run` 的最后一步是 `self.persist()`，把 `messages` 写进会话文件（如果配置了 `--session`）。写盘用「临时文件 + rename」，避免写到一半崩溃留下截断的 JSON。

```rust
pub fn save_session_file(path: &Path, messages: &[Value]) -> Result<(), String> {
    let body = serde_json::to_string_pretty(messages).map_err(|e| e.to_string())?;
    let tmp = path.with_extension("tmp");
    std::fs::write(&tmp, body).map_err(|e| e.to_string())?;
    std::fs::rename(&tmp, path).map_err(|e| e.to_string())?;
    Ok(())
}
```

启动时，`load_session_file` 读取这个文件，然后 `refresh_system` 用当前配置重新生成系统消息，替换掉文件里的旧版本。

| 时机 | 动作 | 目的 |
| --- | --- | --- |
| 启动 + 有会话文件 | 读 JSON，刷新系统消息 | 恢复历史，但使用最新配置 |
| 每轮结束 | 写临时文件，rename 覆盖 | 崩溃安全 |
| 加载失败 | 打印警告，使用全新会话 | 不让坏文件阻塞启动 |
| `reset` | 清空历史，保留系统消息 | 开新话题 |
| `rewind` | 删除最后 N 个用户轮次 | 撤销最近的指令 |

为什么系统消息要刷新而不是原样恢复？因为系统消息是配置，不是对话。用户的工具列表、人设、权限模式、AGENTS.md 都可能变。如果原样恢复旧提示词，会话会带着过期的规则跑，出现「明明改了配置但不生效」的诡异现象。

持久化也有边界：`self.complete()?` 失败时，`run` 提前返回，`persist()` 不会执行。此时内存里的 `messages` 已经多了一条 user 消息，但磁盘上还是上一轮的状态。下次启动会丢掉这条失败的指令。这个行为可以接受——失败的请求本来就没有产生有效回复——但它提醒我们，`?` 在循环里是一个「跳过收尾」的出口。

---

## 记忆沉淀：只从完整结束的轮次里提炼

循环结束后，如果这一轮正常完成、开启了记忆功能、并且真的用过工具，`distill_memories` 会让模型从对话里提炼几条长期记忆。

```rust
if completed && self.cfg.memory {
    self.distill_memories(&user_text, had_tools);
}
```

门槛有三层：

1. **必须 `completed`**。中断或超限的半截对话不提炼，因为结论还没形成。
2. **必须 `cfg.memory`**。记忆功能关闭时直接跳过。
3. **必须通过 `worth_distilling`**。寒暄、短指令、没用过工具的轮次不值得再花一次模型请求。

提炼时取最近 6000 字符的对话摘录，让模型输出若干条 `(kind, text)`，`kind` 是 lesson / preference / correction / fact 之一。每一条通过 `memory::remember` 写入，返回是否真的新增（去重）。最后如果写入了至少一条，打印一句 `已从本次对话沉淀 N 条长期记忆`。

这个设计把「记忆」放在循环之外，而不是循环之内。循环不负责决定记什么，它只负责在正确的时间点触发一次提炼。这样循环保持简单，记忆策略可以独立演化。

---

## token 账本：为什么上报的是增量

`UsageTotals` 只有三个字段：

| 字段 | 含义 |
| --- | --- |
| `requests` | 这个会话发过多少次模型请求 |
| `prompt_tokens` | 累计输入 token |
| `completion_tokens` | 累计输出 token |

每次 `complete()` 返回后，`run` 把这一轮的用量累加进去，然后调用 `style.usage(1, prompt, completion)`。注意第一个参数是 `1`，表示「本次请求数」，而不是累计请求数。

```rust
self.usage.requests += 1;
self.usage.prompt_tokens += turn.usage.prompt_tokens;
self.usage.completion_tokens += turn.usage.completion_tokens;
self.style.usage(1, turn.usage.prompt_tokens, turn.usage.completion_tokens);
```

为什么上报增量而不是累计值？因为同一个 `Agent` 实例可能服务多个隔离的会话。daemon 模式下，云端任务通过 `replace_messages` 切换消息向量，复用同一个 Agent。如果 UI 收到的是累计值，它会把这些互不相关的任务加在一起，算出一个没有意义的总额。上报增量，客户端可以按任务自己累加，本地模式下增量相加也正好等于累计值。

这是一个典型的「接口形状由部署形态决定」的例子。单机 CLI 用累计值更省事，但 daemon 必须用增量。NanoHermes 选择了对两种形态都正确的那个。

---

## 两百行的边界：什么故意不写进循环

「两百行」不是一个代码高尔夫的成绩，而是一条边界。它说明哪些东西属于循环，哪些不属于。

| 模块 | 在循环里吗 | 为什么 |
| --- | --- | --- |
| HTTP 请求、重试、代理 | 否 | `llm::chat` 的职责，循环只拿到 `AssistantTurn` |
| SSE 解析、工具调用拼接 | 否 | 传输层细节，循环不关心帧 |
| 系统提示词构建 | 否 | 配置与项目文件的事，循环只消费结果 |
| 工具实现 | 否 | 每个工具自己处理参数、边界、错误 |
| 权限与钩子 | 是（调用点） | 必须在执行前拦截，不能下放给工具 |
| 上下文压缩 | 是（调用点） | 必须知道完整历史，工具看不到 |
| 记忆检索 / 沉淀 | 是（调用点） | 需要当前用户文本与完整对话 |
| 会话持久化 | 是（调用点） | 只有循环知道一轮何时结束 |
| 并发调度 | 是（内联） | 需要知道本轮所有工具调用 |
| UI 渲染 | 否 | 通过 `Style` / `UiSink` 注入，循环只发事件 |
| MCP 协议 | 否 | `McpManager` 的职责，循环只看到工具名 |
| 子代理编排 | 部分 | `subagent` 是一个工具，但任务板与门控在 `Ctx` 里 |

这张表解释了为什么循环能这么短：**它只保留「必须知道完整一轮」的逻辑。** 凡是单个工具自己能处理的，全部下放；凡是传输层能封装的，全部上移。循环退化成一个协调者，而不是一个什么都干的上帝对象。

这也是判断一个 Agent 架构是否健康的标准：如果主循环里出现了「解析 SSE」「拼 URL」「判断文件类型」这类代码，说明分层漏了。

---

## 十个常见实现陷阱

下面这些坑，几乎每一个手写 Agent 的人都会踩至少三个。

| 陷阱 | 症状 | 正确做法 |
| --- | --- | --- |
| 工具结果不带 `tool_call_id` | 下一轮 API 400，提示 tool 消息缺少 id | 每条 tool 消息都带对应调用的 id |
| 流式 `arguments` 用赋值 | 工具收到残缺 JSON，报参数错误 | 用 `push_str` 按 `index` 追加 |
| 中断在工具执行中间生效 | 历史里 assistant 有 3 个调用，只有 1 个结果 | 只在循环顶部检查中断 |
| 没有迭代上限 | 模型卡在失败命令上无限重试，账单暴涨 | 设 `max_iterations` 并明确提示 |
| 工具输出无上限 | 一次 `cat` 大文件把上下文撑爆 | 工具层统一截断，读文件设硬上限 |
| 工具错误直接 panic | 一个路径写错导致整个进程退出 | 错误翻译成字符串结果 |
| 空 content 写空字符串 | 某些兼容层拒绝只有工具调用的 assistant 消息 | 写 `null` |
| 压缩切在 tool 消息中间 | 历史出现孤立的工具结果 | 切点后移到非 tool 消息 |
| 每轮追加记忆块 | 系统提示词随轮次线性增长 | 按标记整体替换 |
| 把规划写成循环阶段 | 模型被迫走固定流程，简单任务也绕一圈 | 规划交给模型，用工具表达 |

再补充三个更细的：

- **并发结果按完成顺序回填**。`join` 的顺序必须和 `tool_calls` 一致，不能按「谁先完成」排序，否则模型看到的结果和请求对不上。
- **`tool_choice` 在没有工具时也传**。部分 API 会直接报错，必须用 `has_tools` 包一层。
- **系统消息在恢复会话时原样保留**。配置改了却不生效，排查半天以为是模型问题。

这些坑的共同点是：**它们都不会在第一次运行时暴露。** 单轮问答看起来一切正常，跑到第三轮、第五轮、第十轮才炸。Agent 的调试难度主要来自这种「状态累积型」故障。

---

## 收尾：下一篇讲上下文

回到开头那句话：Agent 的本质是一个循环。

模型负责决策，工具负责行动，循环负责把两者接起来。规划、记忆、反思、多智能体，都是在这个循环上长出来的行为，不是循环之外的另一套系统。理解了两百行，后面的东西就有了挂载点。

这一篇刻意只讲了「怎么转」。还有一半问题没回答：**转起来之后，历史里该留什么、该丢什么？**

上下文是 Agent 最稀缺的资源。工具结果、文件内容、错误信息、历史对话都在争夺同一块窗口。留得太多，模型抓不住重点、成本飙升；丢得太多，模型忘了自己在干什么。NanoHermes 用「12 万字符预算 + 最近 10 条 + 摘要替换」处理这个问题，但真正的难点在于：**摘要该保留什么。**

下一篇《Agent 上下文：留什么，丢什么》会拆开 `compact`、`summarize` 和工具输出上限，讨论一个更本质的问题：什么样的信息值得跨轮携带。

系列其余篇目：

| 篇号 | 标题 | 主题 |
| --- | --- | --- |
| 01 | Agent 的本质：一个两百行的循环 | 主循环、消息状态、并发、中断 |
| 02 | Agent 上下文：留什么，丢什么 | 压缩、摘要、输出上限 |
| 03 | Agent 记忆：不接向量库也能长期记忆 | 本地检索、注入、沉淀 |
| 04 | Agent 工具设计：为什么输出都要有上限 | Schema、错误语义、截断 |
| 05 | Agent 并发：不用 async 运行时怎么并行 | 作用域线程、门控 |
| 06 | Agent 安全：让它跑命令而不失控 | 审批、沙箱、钩子 |
| 07 | Agent 多体：子代理、任务板与限流 | 委派、并发门、任务板 |
| 08 | Agent 观测：给每个轮次记一本账 | 用量、日志、可观测性 |

---

## 参考

- `agent/src/agent.rs`：`Agent::run`、`complete`、`execute`、`assistant_message`、`compact_with`
- `agent/src/llm.rs`：`chat`、`read_stream`、`read_json`、`accumulate_tool_calls`、`backoff_ms`
- `agent/src/tools/mod.rs`：`specs`、`dispatch`、`Ctx`
- `agent/src/config.rs`：`Config`、`PermissionMode`、`ApprovalPolicy`
- `agent/src/prompt.rs`：`system_prompt`、`project_docs`
- `agent/src/tools/fs.rs`、`shell.rs`：文件与命令的输出上限

仓库：`D:\NanoHermes`（Rust 2021，`agent` crate 无 async 运行时）
