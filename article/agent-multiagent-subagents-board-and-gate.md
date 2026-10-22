---
title: "Agent 多体：子代理、任务板与限流"
slug: agent-multiagent-subagents-board-and-gate
cover_image: /photos/agent-multiagent-cover.png
date: 2026-11-04
tags: [Agent, Agent 工程, 多代理, 架构设计]
---

> 适用读者：已经让单个 agent 跑起来、现在想让它「分头干活」的人；被「四个子代理同时改同一个文件」坑过的人；想知道任务板和限流门到底该由谁持有的人
> 结论先行：多体的难点从来不是并行，而是**责任边界**——任务板、限流门、工具上下文这三样东西是共享的，而提示词、消息历史、模型选择是个体的。NanoHermes 把这两组东西切得很清楚，但切完之后留了三个洞：防嵌套只挡了工具清单没挡执行、限流门不检查中断也不可重入、任务板跨会话不清空
> 阅读时间：约 58 分钟 | 难度：进阶 | 收获：子代理的完整构造过程 + 任务板与限流门的实现细节 + 七个多体失效模式 + 七处可加固点

**目录**

- 前言：多体不是把主循环复制四份
- 结论先行：三个共享对象与它们的责任边界
- 一个子代理是什么：提示词、工具白名单、可选模型
- 配置即契约：subagents.json 的形状
- 按名字查找：不存在的子代理会发生什么
- 子代理的工具清单是怎么裁出来的
- 防嵌套只挡住了广告位，没挡住执行
- 子代理内部为什么是串行的
- 子代理继承了什么：sub_cfg 与父配置的差异面
- 子代理不注入记忆，也不沉淀记忆
- 子代理共享 Ctx：三个被忽视的副作用
- 任务板：一个只追加的观测结构
- 任务 id 是 agent-N：单调递增与跨会话累积
- 结果预览 500 字符：板上是摘录，模型手里是全量
- duration 测的是哪一段时间
- 门：一个手写计数信号量的四个细节
- 排队也显示 running：登记发生在 acquire 之前
- 门不检查中断：Ctrl-C 卡在等槽位
- 门不重入：嵌套子代理可能自我死锁
- 限流只限了并发数，没限请求速率
- 重试风暴：四份退避曲线没有抖动
- fallback 模型：降级是静默的
- 为什么是 4：一个常识上限的代价
- agent_list 会不会真的被模型用起来
- 子代理的中间过程在终端里是静默的
- 钩子分不出父子：没有 NANOHERMES_AGENT
- 权限模式对多体的语义
- 七个多体的失效模式
- 怎么把多体测出来
- 七处可以加固的地方
- 小结：多体先要分清谁的责任

## 前言：多体不是把主循环复制四份

把 agent 拆成多个角色的直觉通常是：既然一个循环能干活，那就跑四个循环。这个直觉在代码上很容易实现——起四个线程，每个线程一份消息历史，各自调工具，最后汇总。

但它会立刻撞上三个问题：

- 四个子代理各自调 `edit_file` 改同一个文件，谁的改动算数
- 每个子代理都想在终端上打印进度，输出会交叉成乱码
- 如果每个子代理再派一个子代理，谁来保证不会指数爆炸

这三个问题的共同点是：**它们不是并行问题，而是「什么东西该共享、什么东西该独立」的问题**。改文件冲突是共享了文件系统；输出乱码是共享了 stdout；指数爆炸是共享了「派发能力」这件事却没有共享配额。

NanoHermes 的做法是把多体拆成三块：子代理定义（配置层的契约）、任务板（观测层的共享状态）、限流门（资源层的配额）。前两块加起来不到两百行，第三块只有三十行。本文按「个体 → 共享 → 配额」的顺序把它们走一遍，然后专门拆解三处「切得不够干净」留下的洞。

05 讲的是「几件事同时做」，06 讲的是「这些事能做什么」，07 要把两者合起来——当四个子代理同时跑、每个都能在你机器上执行命令时，责任边界画在哪里。

## 结论先行：三个共享对象与它们的责任边界

一次 `subagent` 调用的全貌：

| 层次 | 对象 | 归属 | 子代理能用吗 |
| --- | --- | --- | --- |
| 个体 | 系统提示词 | `def.prompt`，每个子代理独立 | 是自己的 |
| 个体 | 消息历史 | 局部 `messages`，从零开始 | 只装任务描述 |
| 个体 | 模型与采样参数 | `sub_cfg`，可被 `def.model` 覆盖 | 可以不同 |
| 共享 | 任务板 `board` | `Ctx`，父代理持有 | 读写，登记自己的任务 |
| 共享 | 限流门 `gate` | `Ctx`，父代理持有 | 必须拿许可 |
| 共享 | 工具上下文 `Ctx` | 根路径、审批、沙箱、待办、后台任务、记忆目录 | 全部共享 |

这张表最下面三行是本文的重点。共享本身是对的——如果每个子代理都有独立的待办清单，用户会看到五份互不相干的计划；如果每个子代理都有独立的后台任务表，`task_kill` 就变成了盲盒。但共享的代价是：**子代理能做的破坏，不止是改文件，还包括改状态**。

判断一个多体实现是否健康，有个简单的问法：子代理能不能把父代理的状态搞乱？如果答案是能，那么这些状态应该被拆成「只读共享」和「可写独立」两份，或者至少加一层归属标记。

## 一个子代理是什么：提示词、工具白名单、可选模型

`SubAgentDef` 只有四个字段：

```rust
pub struct SubAgentDef {
    pub name: String,
    pub prompt: String,
    /// If non-empty, only these tools are available to the sub-agent.
    pub allowed_tools: Vec<String>,
    /// Optional model override for this sub-agent.
    pub model: Option<String>,
}
```

这是一个很克制的设计。它没有给子代理独立的：
- 迭代上限（继承父代理的 `max_iterations`）
- 权限模式（继承）
- 审批策略（继承）
- 沙箱设置（继承）

克制的好处是配置简单，坏处是「子代理」这个抽象比它看起来弱得多。它本质上是一个**换了提示词、换了工具清单、可能换了模型的同一套 Agent**——而不是一个受独立约束的新角色。

`allowed_tools` 的语义要精确理解：注释写的是「只有这些工具对子代理可用」，但实现里它作用于**给模型看的工具清单**，不作用于执行期的权限检查。这个区别后面第 6、7 节展开。

`model` 的语义同样要精确：它只改 `sub_cfg.model`，也就是只改发给模型 API 的那个模型名。它不改 `max_tokens`、不改 `temperature`、不改 `timeout_secs`。所以「用一个便宜模型跑子代理省钱」是成立的，但「用一个小模型限制子代理的输出长度」不成立——那要靠 `max_tokens`，而它没有暴露。

## 配置即契约：subagents.json 的形状

子代理定义从一个独立 JSON 文件加载，路径由 `--subagents` 指定：

```json
{
  "subagents": {
    "reviewer": {
      "prompt": "You review Rust code for correctness and security. Read the diff, then list concrete defects with file:line.",
      "allowed_tools": ["read_file", "list_dir", "grep", "glob", "git_diff"],
      "model": "gpt-4o"
    },
    "verifier": {
      "prompt": "You run the test suite and report failures. Never modify source files.",
      "allowed_tools": ["run_command", "read_file"]
    }
  }
}
```

三个加载细节值得注意。

**第一，`prompt` 是必填的，缺了就整体失败。**

```rust
let prompt = spec
    .get("prompt")
    .and_then(|p| p.as_str())
    .ok_or_else(|| format!("sub-agent `{name}` missing `prompt`"))?
    .to_string();
```

**第二，`allowed_tools` 是「没写就等于全给」。**

```rust
let allowed_tools = spec
    .get("allowed_tools")
    .and_then(|a| a.as_array())
    .map(|arr| arr.iter().filter_map(|x| x.as_str().map(|s| s.to_string())).collect())
    .unwrap_or_default();
```

空 `Vec` 在裁剪处被解释成「不限制」（见下节）。所以一份只写了 `prompt` 的子代理配置，拿到的是和主代理一样的全部能力。这和 06 里 `allowed_tools: []` 的语义陷阱是同一个方向——安全失败（fail closed）在这里表现为「你以为限制了，其实没有」。

**第三，加载失败只警告不退出。**

```rust
match config::SubAgentDef::load_all(path) {
    Ok(defs) => { /* ... */ cfg.subagents = defs; },
    Err(e) => eprintln!("warning: sub-agents config {}: {e}", path.display()),
}
```

JSON 写错一个逗号，结果是「没有子代理」而不是「启动失败」。随后 `build_tools` 又靠 `subagents.is_empty()` 决定要不要挂 `subagent` 工具，于是模型看不到这个工具，用户看到的是「它好像不会委派」——而真正的原因（配置文件解析失败）只在被淹没的 stderr 警告里出现过一次。

## 按名字查找：不存在的子代理会发生什么

`subagent` 工具的两个参数是 `name` 和 `task`，都必填。名字查找是线性扫描：

```rust
let def = self
    .cfg
    .subagents
    .iter()
    .find(|s| s.name == name)
    .ok_or_else(|| format!("unknown sub-agent `{name}`"))?;
```

失败路径是有价值的：错误会经 `finish_err` 记到任务板上，状态是 `failed`，预览里是那句 `unknown sub-agent`。也就是说模型可以自己发现「我记错了名字」。

但它也有一个盲点：**没有可发现性输入**。`subagent` 工具的 JSON schema 里，`name` 只是一个 `string`，描述是「要调用的子代理名字」，没有任何 enum 或默认值列出可用名字。模型能知道有哪些子代理，唯一的途径是系统提示词里写了——而 `prompt.rs` 里根本没有拼装子代理名单这回事（`system_prompt` 只处理模式提示、persona、`AGENTS.md`）。子代理名字对模型是隐形的。

实践中这意味着：要么用户在自己的 persona 里手写名单，要么模型只能靠猜。而猜错的成本是一次失败的 LLM 往返（它得先决定调用，拿到 `unknown sub-agent` 才知道错了，再猜一次）。

## 子代理的工具清单是怎么裁出来的

裁剪分三步，顺序不能换：

```rust
// 1. 先拿父代理的完整清单（已经过权限模式和黑白名单过滤）
let all_tools = self.build_tools();
// 2. 如果子代理声明了白名单，按名字过滤
let tool_list: Vec<Value> = if !def.allowed_tools.is_empty() {
    all_tools.as_array().cloned().unwrap_or_default()
        .into_iter()
        .filter(|t| {
            let tname = /* ... name ... */;
            def.allowed_tools.iter().any(|a| a == tname)
        })
        .collect()
} else {
    all_tools.as_array().cloned().unwrap_or_default()
};
// 3. 排除 `subagent` 自己，防止无限嵌套
let tool_list: Vec<Value> = tool_list.into_iter()
    .filter(|t| /* name */ != Some("subagent"))
    .collect();
```

第一步是关键的：**子代理的工具清单是父代理清单的子集**。这意味着 06 里的五道闸门对子代理仍然有效——`plan` 模式下的子代理也拿不到 `write_file`，`disallowed_tools` 里的工具也一样不在。这一点比「给子代理独立的权限配置」要安全得多，因为它保证了子代理不可能比父代理更能干。

第二步的匹配是精确字符串比较，没有通配。写 `"read_*"` 不会匹配 `read_file`——shim 一个也没有，就是字面量 `find`。这和 06 里钩子的 `matches()` 支持通配形成了对比：同一个配置体系里，两处匹配规则不同，是容易踩的。

第三步用名字排除 `subagent`。这个做法在「防止模型看到这个工具」这个目标上是有效的，但它的作用域仅限于此（下节展开）。

还有一个容易忽略的点：`agent_list` **没有**被排除。所以子代理可以看到任务板上所有任务，包括父代理自己的、以及兄弟们的结果预览。对「让子代理了解全局进度」这是优点；对「子代理被裁掉了大部分工具但仍能读到别人的产出」这是信息面被意外放宽——一个只允许 `read_file` 的审查子代理，可以通过 `agent_list` 看到另一个子代理的完整结果摘要（500 字符）。如果那个摘要里含敏感内容，`allowed_tools` 的限制就被绕过了。

## 防嵌套只挡住了广告位，没挡住执行

那行 `!= Some("subagent")` 的注释写得很明确：「防止无限嵌套」。它确实防住了最常见的一条路径：子代理看不到 `subagent` 工具，所以不会主动调用它。

但它防的不是全部。理由在 `execute` 的检查链上：

```rust
if let Err(reason) = self.cfg.check_tool(&call.name) { return format!("ERROR: {reason}"); }
```

`check_tool` 查三样东西：模式封禁、黑名单、非空白名单。`subagent` 不在任何模式的 `blocked_tools` 里，也不在默认的黑名单里，而默认白名单是空的——所以**执行期没有任何一层会拒绝 `subagent`**。拒绝只发生在「模型看不见它」这一步。

于是只要模型输出里出现了一次 `"name": "subagent"` 的工具调用，链路就通了：`run_tool` 里的分支是纯字符串比较。

```rust
if name == "subagent" {
    let sname = args.get("name").and_then(|n| n.as_str()).unwrap_or("");
    let task = args.get("task").and_then(|t| t.as_str()).unwrap_or("");
    return match self.run_subagent(sname, task) { /* ... */ };
}
```

这种调用从哪来？

- 模型幻觉出一个不存在的工具名（少见，但 `subagent` 是它在父代理上下文里见过的名字，属于记忆污染）
- 会话是从父代理继承的消息历史里恢复的，历史里有 `subagent` 的调用样例
- 用户通过 MCP 或 persona 明确要求「即使工具清单里没有也试着调用」

第三条不成立——模型不会执行「清单外」的指令。但第二条成立：`replace_messages` 会把一份含 `subagent` 调用记录的会话装进来，模型看得见它曾经用过这个工具。这时候工具清单里没有它，模型的合规概率很高，但推不出必然。

所以正确的说法是：**防嵌套是一道「广告位过滤」，不是一道「执行期闸门」**。要让它是闸门，应该在 `check_tool` 里加一条「子代理上下文禁止 `subagent`」，或者给 `Ctx` 加一个 `depth: usize` 并在 `run_subagent` 入口断言 `depth == 0`。后者更彻底：它同时防住了嵌套过深（比如允许两层、禁止三层）。

## 子代理内部为什么是串行的

子代理循环里，工具调用是一个 `for` 而不是 `thread::scope`：

```rust
for _ in 0..sub_cfg.max_iterations {
    let turn = llm::chat(&sub_cfg, &messages, &tools, |_| {})?;
    result = turn.content.clone();
    messages.push(assistant_message(&turn));
    if turn.tool_calls.is_empty() { break; }
    // Execute sub-agent tool calls sequentially (sub-agents are bounded).
    for call in &turn.tool_calls {
        let out = self.execute(call);
        messages.push(json!({ "role": "tool", "tool_call_id": call.id, "content": out }));
    }
}
```

注释给的理由是「子代理是有界的」。这个理由站得住：父代理的并行是为了让四个不相关的工具调用重叠，而子代理的数量本来就被门限在 4，再往下并行会让实际并发数变成 4 × N，门的语义就失真了。

但这个选择和 05 里讲的另一件事冲突：父代理的并行工具调用走 `thread::scope`，子代理串行。也就是说**「同一套 `execute` 在两个不同的编排策略下被调用」**。后果是 05 里那个「同文件并发 `edit_file` 丢失更新」的缺陷，在子代理内部不存在（串行天然不冲突），但父代理的四个并行子代理之间仍然存在——它们各自串行，四者并行，最后一起写同一个文件。

换句话说，串行只消除了「一层内的冲突」，没有消除「跨层的冲突」。真正需要的是文件级锁或是「同一文件不允许两个子代理同时写」的调度约束。

还有一处更细的差别：子代理循环里**没有调用 `compact()`**。父代理每轮结束都会：

```rust
self.compact();
```

子代理则是跑满 `max_iterations` 也不压缩。40 轮 × 每轮最多 20,000 字符的工具结果（`max_output`），最坏情况接近 800k 字符留在局部 `messages` 里——而父代理的预算是 120,000。子代理没有自己的预算，也没有借用父代理的。

## 子代理继承了什么：sub_cfg 与父配置的差异面

`sub_cfg` 是父配置的克隆，改动只有两处：

```rust
let mut sub_cfg = self.cfg.clone();
if let Some(m) = &def.model { sub_cfg.model = m.clone(); }
// Sub-agents never stream (we want the full response to return).
sub_cfg.stream = false;
```

完整差异表：

| 配置项 | 子代理的值 | 说明 |
| --- | --- | --- |
| `model` | `def.model` 或父值 | 唯一的能力差异点 |
| `stream` | 强制 false | 要完整响应 |
| `max_iterations` | 父值（默认 40） | 一个子代理可以跑满 40 轮 |
| `temperature` | 父值（默认 0.0） | 不可为子代理单独调 |
| `max_tokens` | 父值（默认 4096） | 同上 |
| `timeout_secs` | 父值（默认 120） | 单次请求超时 |
| `max_retries` | 父值（默认 2） | 重试次数 |
| `permission_mode` | 父值 | 子代理不会比父代理更宽 |
| `allowed_tools` | 父值（**不是** `def.allowed_tools`） | 关键差异，见下 |
| `hooks` | 父值 | 钩子对子代理生效 |

表里那个加粗的行是本文第二重要的发现：

**执行期的权限检查用的是 `self.cfg`，不是 `sub_cfg`。**

```rust
fn run_subagent_inner(&self, name: &str, task: &str) -> Result<String, String> {
    // ...
    for call in &turn.tool_calls {
        let out = self.execute(call);   // <- self.execute，内部用 self.cfg.check_tool
    }
}
```

`self.cfg.allowed_tools` 是父代理的允许列表。如果用户给它配了 `["read_file", "grep"]`，那么子代理的所有工具调用都会被这个列表卡住——包括那些在 `def.allowed_tools` 里明确允许的。反过来，如果父代理的 `allowed_tools` 是空的（默认），那么 `def.allowed_tools` 就**完全不参与执行检查**。

结论要写清楚：`def.allowed_tools` 是一个「广告位过滤」，执行期真正生效的是父代理的 `allowed_tools`。两者叠加的效果是「交集，但只在对父代理收紧时收紧」。所以：

- 想让子代理只会读 → 靠 `def.allowed_tools`，工具清单里就没有写工具，模型基本不会去调
- 想保证子代理不可能写 → 必须在 `check_tool` 层面收紧，而不是靠 `def.allowed_tools`

05 里把这条记成了「子代理的 `allowed_tools` 不参与执行检查」，07 补上了另一半：它不仅不参与，还会被父代理的列表**反向覆盖**。

## 子代理不注入记忆，也不沉淀记忆

03 里讲过，父代理每一轮开头都会重检索记忆并整体替换系统消息里的注入块：

```rust
let user_text = memory::content_text(&content);
if let Some(dir) = self.ctx.memory_dir.clone() {
    let block = memory::retrieve_block(&dir, &user_text);
    self.set_memory_block(&block);
}
```

子代理没有这一步。它的消息向量是手搓的两条：

```rust
let mut messages: Vec<Value> = vec![
    json!({ "role": "system", "content": def.prompt }),
    json!({ "role": "user", "content": task }),
];
```

于是子代理的视野里只有三样东西：自己的提示词、父代理给的任务描述、以及自己调工具的结果。它不知道用户上周提过什么偏好，也不知道这个仓库的历史约定。

这个设计有两个真实的后果。

**第一，任务描述必须自包含。** 父代理写 `task` 的时候，不能写「按之前说的那个方式改」——子代理看不到「之前」。它得把上下文压进 task 字符串里，而 task 字符串本身没有长度限制检查（`clamp` 只作用于工具返回值，不作用于入参）。一段 10k 字符的 task 会原样进到子代理的第一次请求里。

**第二，子代理的产出不会沉淀成记忆。** `distill_memories` 只在父代理的 `run()` 收尾被调用：

```rust
if completed && self.cfg.memory {
    self.distill_memories(&user_text, had_tools);
}
```

子代理跑完不提炼。这是对的——否则四个子代理会各自往记忆库里塞四条近似的记录，而 03 里讲的去重阈值（12 字节）不足以合并它们。代价是：如果子代理是唯一看到某个关键结论的角色（比如它读了一个父代理没读的文件），那个结论只存在于它返回的那段文本里，父代理转述时可能丢细节。

## 子代理共享 Ctx：三个被忽视的副作用

`Ctx` 里的东西全部被父子共享，因为 `run_subagent` 走的是 `self.execute`，而 `self.ctx` 只有一个。三个副作用：

**副作用一：待办清单会被覆盖。** `todo_write` 的实现是整体替换：

```rust
pub fn replace(&self, items: Vec<Todo>) -> String {
    let mut guard = self.items.lock().unwrap();
    *guard = items;
    render(&guard)
}
```

一个子代理写自己的三步步计划，父代理刚建的五步计划就没了。`MAX_ITEMS = 50` 也不能阻止这件事——它是替换不是追加。所以「让子代理自己规划」这件事在多体下是不安全的，除非待办清单加上归属字段（`owner`）并按 owner 过滤。

**副作用二：后台任务会被杀掉。** `TaskManager` 同样是 `Ctx` 里的一个字段，子代理的 `task_kill` 能杀父代理起的后台服务。而 `task_list` 会列出所有任务，包括不是它起的。06 讲的「工具名不是能力边界」在这里有一个多体版本：**「谁起的任务」这个信息在任务表里不存在**，所以没有任何一层能阻止跨角色操作。

**副作用三：记忆目录是共享的。** 子代理可以调 `memory_save` 往父代理的记忆库里写。子代理的 `def.prompt` 里如果写了「把你发现的重要事实存入记忆」，它会照做，而这些记录没有「由哪个子代理写入」的标记。03 讲的四类记忆里，`fact` 类是可以跨会话再被检索回来的——一条子代理写的、写错的「事实」，会污染后续所有会话。

这三个副作用的共同修法是同一个：**给共享状态加归属**。`Todo { owner }`、`Task { owner }`、`Memory { source }`，然后在工具层按当前角色过滤。改动不大，但需要先承认「共享」是有代价的。

## 任务板：一个只追加的观测结构

任务板是这篇文章里最完整的部分。它的结构只有两个锁：

```rust
pub struct Board {
    jobs: Mutex<Vec<Job>>,
    seq: Mutex<u64>,
}
```

`Job` 记录了七个字段：

```rust
pub struct Job {
    pub id: String,
    pub name: String,
    pub task: String,
    pub status: JobStatus,
    pub result: String,
    pub duration: Option<Duration>,
    started: Instant,
}
```

三个设计点：

**第一，`started` 是私有的，`duration` 是公开的。** 外部只能看到「跑了多久」，看不到「什么时候开始」。这避免了时间戳时钟漂移带来的困惑，但也意味着「两个任务是不是同时跑的」这个问题在板子上回答不了——只有 `list()` 的顺序（登记顺序）和每个任务的耗时，没有区间重叠信息。

**第二，状态只有三种：`Running`、`Done`、`Failed`。**

```rust
pub enum JobStatus { Running, Done, Failed }
```

没有 `Cancelled`、没有 `Queued`、没有 `TimedOut`。第七节会讲 `Queued` 的缺失为什么是一个真实问题（排队中的任务显示成 running）。

**第三，只追加，不清理。** 没有 `remove`、没有 `clear`、没有容量上限。`jobs` 会一直长，`seq` 会一直涨。

`finish` 用 id 查找，找不到就静默返回：

```rust
fn finish(&self, id: &str, status: JobStatus, result: &str) {
    let mut jobs = self.jobs.lock().unwrap();
    if let Some(job) = jobs.iter_mut().find(|j| j.id == id) {
        job.status = status;
        job.duration = Some(job.started.elapsed());
        job.result = preview(result);
    }
}
```

「找不到就静默返回」在这里是安全的，因为 id 是从 `start` 拿到的、不可能凭空出现。但如果将来加了板子的清理逻辑，这个静默就会变成「任务永远停在 running」——所以「只追加」和「静默 finish」是一对必须同时成立的设计。改一个就得改另一个。

## 任务 id 是 agent-N：单调递增与跨会话累积

id 的生成是「先拿 seq 锁、自增、拼字符串、再拿 jobs 锁、push」：

```rust
pub fn start(&self, name: &str, task: &str) -> String {
    let mut seq = self.seq.lock().unwrap();
    *seq += 1;
    let id = format!("agent-{seq}");
    self.jobs.lock().unwrap().push(Job { id: id.clone(), /* ... */ });
    id
}
```

先 seq 后 jobs 的锁顺序是一致的，没有反向获取，所以不存在死锁。代价是这两个锁可以合并成一个（用一个 `Mutex<BoardInner>` 同时装 `jobs` 和 `seq`），但拆开的好处是 `list()` 只锁 `jobs`，不需要等 seq 锁——在读多写少的场景下这是划算的。

id 的可读性值得一提：`agent-1`、`agent-2`。它比 UUID 更好用（人能读、能口头引用、能排序），代价是它只在一个 `Board` 实例内唯一。

这个「只在一个实例内唯一」在多体下有个真实的后果，因为守护进程模式是**一个 Agent 服务所有会话**：

```rust
pub fn replace_messages(&mut self, msgs: Vec<Value>) -> Vec<Value> {
    std::mem::replace(&mut self.messages, msgs)
}
```

`replace_messages` 只换 `messages`。`Ctx` 里的 `board`、`todos`、`tasks` 都不换。所以：

- 会话 A 起了三个子代理，id 是 `agent-1..3`
- 会话 B 接到请求，第一个子代理的 id 是 `agent-4`
- 会话 B 的模型调 `agent_list`，看到的是六个任务，包括 A 的

而 `agent_list` 工具的描述写的是「List the sub-agent delegations started in this session」——**这句话在守护进程模式下是不成立的**。这是本文第三重要的发现：一个观测工具的语义在两种运行模式下不同，而它的描述只描述了其中一种。

修法有两种：

```rust
// 方案一：给 Job 加 session 字段，agent_list 只返回当前会话的
pub struct Job { /* ... */ pub session: String }

// 方案二：会话切换时清空板子
pub fn clear(&self) { self.jobs.lock().unwrap().clear(); }
```

方案一保留了「跨会话审计」的可能性，方案二更简单但会丢掉历史。对一个把任务板当观测工具（而不是审计日志）的实现，方案一更合适。

## 结果预览 500 字符：板上是摘录，模型手里是全量

`RESULT_PREVIEW = 500`，预览的做法是先把换行压成空格、再按字符边界截断、最后补一个省略号：

```rust
const RESULT_PREVIEW: usize = 500;

fn preview(text: &str) -> String {
    let flat = text.replace('\n', " ");
    if flat.len() <= RESULT_PREVIEW { return flat; }
    let mut end = RESULT_PREVIEW;
    while end > 0 && !flat.is_char_boundary(end) { end -= 1; }
    format!("{}…", &flat[..end])
}
```

三个细节都对：按字节比较但按字符边界回退（中文不会切碎）、换行替换让每行预览天然是一行（`render_agent_board` 不用再做处理）、超长才补省略号。

但要注意一个不对称：**板子上是 500 字符的摘录，模型手里是完整的工具返回值。** `finish_ok` 存的是 `preview(result)`，而 `run_subagent` 返回给 `run_tool` 的是原始 `result`：

```rust
let result = self.run_subagent_inner(name, task);
match &result {
    Ok(text) => self.ctx.board.finish_ok(&id, text),
    Err(err) => self.ctx.board.finish_err(&id, err),
}
result
```

这个不对称是对的——模型需要完整结果，板子只需要可读摘要。但它意味着**板子不是审计日志**：想知道子代理到底说了什么，得回看会话历史，而会话历史会被 `compact()` 压缩掉。03 讲的「压缩是不可逆的」在这里又出现一次：压缩之后，一个已完成子代理的完整产出可能只剩下一句话的摘要，而板子上只有前 500 字符。

还有一个更细的问题：`preview` 的长度是 500 **字节**还是 500 字符？看代码，`flat.len()` 是字节长度，`is_char_boundary(end)` 也是字节下标——所以是 500 字节。中文环境下 500 字节只有约 166 个汉字。命名里那个 `PREVIEW` 没有标明单位，和 04 里 `clamp` 注释写 chars 实为字节是同一类问题。

## duration 测的是哪一段时间

`duration` 在 `finish` 里算：

```rust
job.duration = Some(job.started.elapsed());
```

`started` 是 `Instant::now()`，在 `start` 里赋值。而 `start` 发生在 `acquire` 之前：

```rust
let id = self.ctx.board.start(name, task);
let _permit = self.ctx.gate.acquire();
let result = self.run_subagent_inner(name, task);
```

所以 `duration` 里包含：等待槽位的时间 + 实际执行的时间。这又是那个「登记在拿许可之前」的设计的第二个后果（第一个是状态显示问题，下一节讲）。

对观测来说，这个口径是错的。用户看到 `agent-7 [done] reviewer (12.3s)`，想知道的是「审查花了 12.3 秒」，实际含义是「从父代理决定派发到审查结束一共 12.3 秒」，其中可能有 8 秒在排队。

正确的做法是记两个时间点——`queued_at` 和 `started_at`——或者干脆在 `acquire` 之后才登记：

```rust
let _permit = self.ctx.gate.acquire();
let id = self.ctx.board.start(name, task);  // 拿到槽位才算开始
```

但这样做的代价是：排队中的任务在板子上不可见，用户看到的是「什么都没有」，然后突然出现四个任务。所以更完整的修法是保留登记位置，同时把状态拆成 `Queued` 和 `Running`：

```rust
pub enum JobStatus { Queued, Running, Done, Failed }
```

这需要 `Gate` 在拿到槽位后回调板子改状态，或者让 `acquire` 返回一个「我拿到槽位了」的时刻。改动不大，但它把「排队」这个真实存在的状态显式化了。

## 门：一个手写计数信号量的四个细节

`Gate` 只有三十行，但每一行都有取舍：

```rust
pub struct Gate {
    active: Mutex<usize>,
    cv: Condvar,
    max: usize,
}

impl Gate {
    pub fn new(max: usize) -> Self {
        Gate { active: Mutex::new(0), cv: Condvar::new(), max: max.max(1) }
    }

    pub fn acquire(&self) -> GateGuard<'_> {
        let mut active = self.active.lock().unwrap();
        while *active >= self.max {
            active = self.cv.wait(active).unwrap();
        }
        *active += 1;
        GateGuard { gate: self }
    }
}

impl Drop for GateGuard<'_> {
    fn drop(&mut self) {
        let mut active = self.gate.active.lock().unwrap();
        *active = active.saturating_sub(1);
        self.gate.cv.notify_one();
    }
}
```

**细节一：`max.max(1)`。** 一个 0 的配额会让所有 `acquire` 永久阻塞。用 `max(1)` 兜住，是「宁可放一个过去，也不能整体卡死」的选择。它对，但只在「配额是从配置来的」这个前提下对——如果配额将来从环境变量或服务端下发，`max(1)` 会把一个配置错误静默转成一个比预期宽松的策略，而不是报错。更明确的做法是让 `new` 返回 `Result`，0 直接拒绝。

**细节二：`while` 而不是 `if`。** 这是条件变量的标准要求：被唤醒之后条件可能已经不成立（另一个线程抢先拿走了槽位）。用 `if` 会超发。

**细节三：`notify_one` 而不是 `notify_all`。** 一次释放腾出一个槽位，唤醒一个等待者就够了。用 `notify_all` 会让所有等待者醒来抢锁、然后除一个以外全部重新睡下——惊群。

**细节四：计数放在 `GateGuard` 的 `Drop` 里。** 这是 RAII：即使 `run_subagent_inner` 提前返回（`?` 传播错误），槽位也会释放。05 里讲 `InterruptGuard` 时提过同一个模式，这是这套代码里第二次出现，说明作者对这件事有意识。

但 `notify_one` 和 `saturating_sub` 组合起来有一个隐含假设：**没有降级路径**。`saturating_sub` 让计数永远不为负，代价是「多释放一次」不会报错，只会静默地少放一个槽位过去。如果哪天加了一条不走 `GateGuard` 的释放路径（比如手动 `release()`），计数就会和真实并发数脱钩，而且没有任何断言会发现。

测试覆盖得不错：

```rust
#[test]
fn gate_caps_concurrency() {
    let gate = Arc::new(Gate::new(2));
    // 6 个线程抢 2 个槽位，记录峰值
    assert!(peak.load(Ordering::SeqCst) <= 2, "peak was {}", peak.load(Ordering::SeqCst));
    assert_eq!(*gate.active.lock().unwrap(), 0, "all permits released");
}
```

第二句断言是关键——它同时验证了「不超过上限」和「全部归还」。但 `gate.active` 是私有字段，测试在同一个模块里所以能访问；这个断言值得升级成一个公开的 `available()` 方法，好让外部也能检查「是否有泄漏」。

## 排队也显示 running：登记发生在 acquire 之前

把这两个函数并排看：

```rust
fn run_subagent(&self, name: &str, task: &str) -> Result<String, String> {
    let id = self.ctx.board.start(name, task);   // 状态 = Running
    let _permit = self.ctx.gate.acquire();       // 可能在这里等很久
    // ...
}
```

`start` 把状态写成 `Running`，然后才可能阻塞在 `acquire`。所以第 5 个任务会以 `running` 的状态出现在板上，持续到某个槽位空出来。

`agent_list` 的渲染是直白的：

```rust
out.push_str(&format!(
    "- {} [{}] {} ({}) — {}\n",
    job.id, job.status.as_str(), job.name, duration, job.task
));
```

`duration` 在未完成时显示 `…`：

```rust
let duration = match job.duration {
    Some(d) => format!("{:.1}s", d.as_secs_f64()),
    None => "…".to_string(),
};
```

所以一个排队中的任务显示成 `- agent-5 [running] verifier (…) — run the tests`。用户体验上是「五个任务在跑，其实只有四个」，而在一个 4 并发、每个任务跑两分钟的场景里，这个误报能持续几分钟。

这个问题的严重性取决于谁来读板子。如果只有用户读，它是显示瑕疵；如果模型读（它有 `agent_list` 工具），它会影响决策——模型可能因为「五个都在跑」而放弃派发更多任务，实际还有空位；也可能反过来，因为看到任务在跑而重复派发。

修法就是上一节说的：`Queued` 状态 + 拿到槽位后改状态。或者更简单——把 `start` 移到 `acquire` 之后，接受「排队不可见」。

## 门不检查中断：Ctrl-C 卡在等槽位

`Gate::acquire` 是一个无超时的阻塞等待：

```rust
while *active >= self.max {
    active = self.cv.wait(active).unwrap();
}
```

它没有任何退出条件，除了「有槽位空出来」。这意味着两件事：

**第一，中断标志在这里不起作用。** 父代理的中断检查只在步骤边界：

```rust
for _ in 0..self.cfg.max_iterations {
    if crate::interrupt::take() { interrupted = true; break; }
    // ...
}
```

用户按 Ctrl-C，标志被设上，但主线程正阻塞在 `execute` → `run_subagent` → `gate.acquire()` 里面，看不到标志。要等到某个子代理跑完、`run()` 回到下一轮循环的开头，中断才生效。而一个子代理最长可以跑 40 轮，每轮一次 LLM 往返——120 秒超时 × 40 轮的最坏情况是 80 分钟。

**第二，等待是不可取消的。** 即使把中断检查加到 `acquire` 里，`Condvar::wait` 本身也不返回中断状态；需要的是 `wait_timeout` 配合轮询：

```rust
pub fn acquire(&self, interrupt: &AtomicBool) -> Option<GateGuard<'_>> {
    let mut active = self.active.lock().unwrap();
    while *active >= self.max {
        if interrupt.load(Ordering::SeqCst) { return None; }
        let (guard, _timeout) = self.cv.wait_timeout(active, Duration::from_millis(200)).unwrap();
        active = guard;
    }
    *active += 1;
    Some(GateGuard { gate: self })
}
```

轮询间隔是这类问题的常用解法：它把「无限期等待」变成「最长 200ms 的响应延迟」，代价是每 200ms 一次虚假唤醒。在四个槽位的规模下，这个代价可以忽略。

值得注意的是这个缺陷和 05 里「子代理不检查中断」是同一类问题的两个位置：中断这件事需要**在每一个可能长时间阻塞的地方**都检查一次，只在一处检查等于没检查。

## 门不重入：嵌套子代理可能自我死锁

这是本文唯一一个会导致**永久卡死**的发现。它的前提是上一节讲的「防嵌套只挡广告位」：只要模型输出了 `subagent` 调用，嵌套就会发生。而嵌套会再走一遍 `run_subagent`：

```rust
fn run_subagent(&self, name: &str, task: &str) -> Result<String, String> {
    let id = self.ctx.board.start(name, task);
    let _permit = self.ctx.gate.acquire();   // 内层在这里等
    // ...
}
```

外层子代理**已经持有一个许可**，它在整个 `run_subagent_inner` 期间不释放（`_permit` 活到函数结束）。所以：

- 4 个槽位，父代理派了 4 个外层子代理，全部许可被占
- 每个外层子代理各调一次 `subagent`，4 个内层调用并发进入 `acquire`
- 内层的 4 个线程都在 `wait`，等外层释放；外层在等内层返回
- 环闭合，永久阻塞

`Condvar::wait` 没有超时，所以这不是「卡一会儿」，是「一直到进程被杀」。

有意思的是这个场景需要满足几个条件才会真的发生：模型得在工具清单里没有 `subagent` 的情况下仍然输出这个调用。概率不高，但它的后果是灾难级的（整个 turn 永久挂起，用户看到的是 agent 不动了，Ctrl-C 也不一定救得回来——因为 Ctrl-C 只设标志，而标志在这个等待里不被检查）。

正确的修法有两条，建议同时做：

```rust
// 1. 执行期闸门：把「子代理不可再派子代理」变成 check_tool 的硬规则
//    Ctx 加 depth，run_subagent 入口断言
if ctx.depth > 0 { return Err("nested sub-agents are not supported".into()); }

// 2. 让门可重入：许可数 >= 1 时，同一执行链的重复获取直接通过
//    或者在嵌套时不再 acquire（外层已经代表这条链占了位）
```

第一条是根治：不允许的调用直接报错，报错会记在任务板上（`failed`），模型能看懂。第二条是把配额语义从「线程数」改成「执行链条数」——也就是「一个子代理算一个单位的预算，它内部再怎么嵌套都不额外占位」。两者选一即可，但必须选一个：现在的实现是「既不禁止嵌套，也不让门重入」，这是唯一会死锁的组合。

## 限流只限了并发数，没限请求速率

`Gate` 限的是「同时有几个子代理在跑」，这是一个**并发度**限制。它不限制：

- 每秒发多少次 LLM 请求
- 总共发多少次
- 单个子代理能跑多少轮

四个槽位、每个子代理 40 轮，一轮一次请求，那么一个 turn 最多产生 160 次 LLM 请求。如果父代理自己也在跑（40 轮），总共 200 次。这些请求全部在几分钟内打出去，而 API 侧的限流是按 token 或请求/分钟计的。

这是一个语义错配：**本地的并发控制解决不了远端的速率限制**。门做得再好，远端返回 429 的时候还是得退避。

真正需要的是一层「预算」——不是「同时几个」，而是「一共多少」。这在多体场景下尤其重要，因为子代理的轮数是不可预测的（它不会因为「这次任务很简单」而少跑几轮，它跑满到模型不再调工具为止）。

一个务实的做法是给 `Ctx` 加一个共享的计数器和上限：

```rust
pub struct Budget {
    remaining: Mutex<usize>,   // 剩余请求数
}
```

父代理和所有子代理从同一个预算里扣。扣完了子代理就返回「预算耗尽」而不是继续跑。这让「一个 turn 最多花多少钱」变成一个可配置的量，而不是「4 × 40 × 单次成本」这个上限。

## 重试风暴：四份退避曲线没有抖动

失败重试的逻辑在 `llm::chat` 里：

```rust
if is_retryable_error(&e) && attempt < cfg.max_retries {
    attempt += 1;
    let delay = backoff_ms(cfg.retry_base_ms, attempt);
    eprintln!("note: request failed ({e}); retrying in {delay}ms (attempt {attempt}/{})", ...);
    std::thread::sleep(Duration::from_millis(delay));
    continue;
}
```

退避函数是纯指数的：

```rust
fn backoff_ms(base_ms: u64, attempt: u32) -> u64 {
    base_ms
        .saturating_mul(2u64.saturating_pow(attempt.saturating_sub(1)))
        .min(30_000)
}
```

默认参数：`max_retries = 2`、`retry_base_ms = 500`。所以第一次失败等 500ms，第二次等 1000ms，然后放弃（走 fallback 模型或不走）。

`is_retryable_error` 只认两类：

```rust
fn is_retryable_error(e: &str) -> bool {
    e.contains("HTTP 429") || /* 5xx */
}
```

注意它是**字符串匹配**，而不是状态码解析。`e.contains("HTTP 429")` 依赖错误消息的格式恰好包含这个子串——如果真的改了错误格式（比如换成 `status: 429`），重试就会静默失效。04 里讲 `clamp` 的单位标注问题时提过同一个模式：错误字符串是接口，但它的形状没有被测试固定下来。

回到多体。四份退避曲线完全没有随机化，所以如果 API 在某一刻对这四个子代理同时返回 429（比如同一个 key 的配额被打满），它们的重试是**同步的**：四个线程都在 500ms 后重试，然后都在 1000ms 后重试。这就是教科书里的惊群重试（thundering herd），只不过规模从「上千个客户端」缩小到「四个子代理」。

修法是标准的三件套：

```rust
// 1. 加抖动：delay = base * 2^(n-1) * (0.5 + rand*0.5)
// 2. 尊重 Retry-After 响应头
// 3. 在共享层做退避：一个子代理被 429 之后，其他子代理也暂停一会儿
```

第三条在多体场景下比前两条更重要——因为「四个子代理打同一个 API key」这个事实，只有共享层知道。

顺带说一句：退避的重试是**阻塞的 `thread::sleep`**。四个子代理各睡 500ms 不影响别的线程（它们是独立线程），但父代理自己的重试会阻塞整个 turn。这个设计本身没问题，只是要知道代价：一次 429 会让那条时间线静默 500ms 到 30 秒。

## fallback 模型：降级是静默的

重试耗尽之后还有一层：

```rust
if let Some(fallback) = &cfg.fallback_model {
    if is_retryable_error(&e) {
        eprintln!("note: primary model failed ({e}); retrying with fallback model `{fallback}`");
        return chat_with_model(cfg, build_body(fallback), &mut on_text);
    }
}
return Err(e);
```

三个观察。

**第一，fallback 是「换模型重试一次」，不是「换到备用通道」。** 它对 429 和 5xx 都触发，但前提是主模型已经重试过 `max_retries` 次。

**第二，它只对「重试耗尽的错误」生效。** 一个 401（鉴权失败）既不重试也不 fallback，直接返回错误。这个分类是对的：鉴权问题换模型也解决不了。

**第三，降级的可见性很低。** 那行 `eprintln!` 是唯一提示。用户如果用的是 JSON 输出模式或者守护进程模式，这行 note 会混在 stderr 里。而**子代理的降级对父代理完全不可见**——子代理的两次 `llm::chat` 都可能降级到 fallback 模型，父代理拿到的只是最终文本，不知道这份结果是哪个模型产出的。

这在成本核算上是真实的问题：一个 turn 里四个子代理全降级到 fallback（可能贵得多或便宜得多），用量统计只记得总 token 数，不记得模型。`UsageTotals` 记得 `requests` / `prompt_tokens` / `completion_tokens`，没有 `model` 维度。

## 为什么是 4：一个常识上限的代价

```rust
const MAX_PARALLEL_SUBAGENTS: usize = 4;
```

这个 4 是硬编码的，不可配置。它的合理性论证大概是：写代码的工作很少真正需要超过 4 个并发子任务；4 个并发的 LLM 请求对大部分 API 套餐是安全的；4 个并行的 `run_command` 对本地机器也不会打满。

但它带来三个代价。

**代价一：它也是「父代理并行工具调用的并发度上限」**。因为父代理的工具调用是「一个工具一个线程」，如果父代理一次性发出 8 个 `subagent` 调用（模型完全可以这么做），那么 4 个拿许可、4 个排队——而排队的 4 个线程**各自占着一个工具线程**。工具线程没有上限（05 讲过），所以这里不会崩，只是 4 个线程白占着。

**代价二：它不可配置意味着不能按机器和套餐调整。** 一台 64 核机器上跑 4 个子代理是浪费，一个只有 2 个并发的 API 套餐上跑 4 个会一直在 429。这个数字应该来自配置，和 `max_iterations` 一样。

**代价三：它和「一个 turn 能派多少子代理」是两个独立的事。** 模型的工具 schema 没有限制 `subagent` 在同一个 turn 里出现几次，所以模型可以一次派 20 个。20 个任务全部登记在板上（`Running`），4 个在跑，16 个在排队——每个排队任务都显示成 running（第 17 节）。

把这三条合起来看，比「4 太小」更有价值的问题是：**这个数字在代码里的位置决定了它的语义模糊**。它在 `agent.rs` 里作为一个模块常量，看起来是「主循环的行为参数」；实际它是「资源配额」，属于 `Ctx` 或配置层。位置一变，可配置和可测试都会自然解决。

## agent_list 会不会真的被模型用起来

`agent_list` 的工具描述和参数都极简：

```rust
fn agent_list_tool_spec() -> Value {
    json!({
        "type": "function",
        "function": {
            "name": "agent_list",
            "description": "List the sub-agent delegations started in this session (id, status, name, task, result preview).",
            "parameters": { "type": "object", "properties": {}, "required": [] }
        }
    })
}
```

它的输出是逐行文本：

```rust
let mut out = String::from("Sub-agent jobs:\n");
for job in jobs {
    out.push_str(&format!("- {} [{}] {} ({}) — {}\n",
        job.id, job.status.as_str(), job.name, duration, job.task));
    if !job.result.is_empty() {
        out.push_str(&format!("  result: {}\n", job.result));
    }
}
```

有个细节：`result` 那行用的是「两空格缩进」，但上一行已经用 `— ` 引了 task，所以一个带结果的条目实际占两行，视觉上是一组。这是可读的。

更值得讨论的是「模型会不会用它」。在父代理的工作流里，`agent_list` 的用途是：

- 派了子代理之后，等它跑完再看结果（但 `subagent` 本身是阻塞的，派出去就等返回，所以这条不成立）
- 检查刚才派了什么（模型记不住的时候）
- 看历史的失败原因

第一条不成立这件事值得展开。`subagent` 是**同步阻塞**的——父代理调用它，就等在那儿直到子代理返回。这和多体直觉里的「派出去，回来拿结果」不同。所以在这个实现里：

- 模型无法「先派 4 个，再去看谁的进度」
- 一个 turn 内的 4 个 `subagent` 调用是**并行但都阻塞**的（靠父代理的 `thread::scope`），所以它们确实重叠执行
- 但 `agent_list` 在父代理这边只能在别的工具调用里顺带看一眼，它的价值主要是「事后审计」而不是「进度跟踪」

换句话说，`agent_list` 的价值在异步派发的架构里会大得多。在当前架构里，它更像一个「可观测性兜底」：出问题的时候，模型和用户能回头看看发生了什么。

## 子代理的中间过程在终端里是静默的

父代理的工具调用会经过 `Style::tool_call` 打印：

```rust
for (call, result) in turn.tool_calls.iter().zip(results) {
    self.style.tool_call(&call.name, &summarize(&call.name, &call.arguments), &result);
    // ...
}
```

而子代理的循环里是：

```rust
for call in &turn.tool_calls {
    let out = self.execute(call);
    messages.push(json!({ "role": "tool", "tool_call_id": call.id, "content": out }));
}
```

**没有 `style.tool_call`。** 所以子代理调用的每一个工具在终端上都是不可见的——用户看到的是「派了 reviewer，等了两分钟，回来一段文字」，中间那次 `read_file`、那次 `run_command`、那条命令的输出，全都没有显示。

在守护进程模式下这个更明显：守护进程会把 `UiSink` 装上让工具调用流到客户端（`stream_turn` 的注释写了这一点），但子代理的内部调用不走这条路径，因为它们压根不调 `style` 的方法。

这是一个明确的可用性缺口。修法有两种：

```rust
// 方案一：直接打印，但加上角色前缀
self.style.tool_call(&format!("{}:{}", name, call.name), &summarize(...), &out);

// 方案二：给 Style 加一层缩进/前缀上下文
```

方案一的代价是输出会交叉——四个子代理的调用会交错打印，没有归属就仍然读不懂。所以真正需要的是「带角色标签的样式」，也就是 05 讲「并发审批共用 stdin」时暴露的同一类问题：**多体需要一层「谁在说话」的表达能力，而现在这一层不存在**。

## 钩子分不出父子：没有 NANOHERMES_AGENT

06 讲过钩子通过环境变量拿到工具名和事件名：

```rust
// hooks::run 里设置的环境变量
NANOHERMES_TOOL_NAME
NANOHERMES_HOOK_EVENT
```

子代理的每次工具调用也会走 `execute`，所以 `PreToolUse` 钩子**对子代理同样生效**——这是好消息：06 里那道「用户自定义否决」的闸门在多体下没有失效。

但它拿到的信息里没有「这是谁发起的调用」：

- `NANOHERMES_TOOL_NAME=write_file` —— 父代理写的还是 reviewer 子代理写的？
- 钩子无法根据调用者做不同策略
- 钩子也无法记录「子代理 A 一共改了几个文件」

环境变量里缺一个 `NANOHERMES_AGENT`（父代理为空、子代理为名字）、`NANOHERMES_AGENT_ID`（`agent-7`）。加上它之后，钩子就能实现「子代理只能读、父代理可以写」这类策略——而这正是多体最需要的粒度。

顺带说，加了这两个变量还能同时解决另一个问题：钩子的输出会原样回到模型，如果钩子打印了 `[agent-7]` 前缀，模型就能知道那条否决意见是谁触发的。

## 权限模式对多体的语义

06 讲的五种权限模式在多体下需要重新理解一遍。因为子代理继承父代理的模式，所以模式的分层是「父代理决定、子代理跟随」。逐一看：

| 模式 | 父代理能派子代理吗 | 子代理能做什么 |
| --- | --- | --- |
| `default` | 能 | 和父代理一样 |
| `accept-edits` | 能 | 文件改动免问（`auto_approve` 不影响文件工具），命令仍问 |
| `plan` | 能 | 派发本身允许，但写工具被封，命令被封 |
| `goal` | 能 | 全放开，没有人可以问 |
| `debug` | 能 | 能跑命令复现，不能改文件 |

两个值得注意的地方。

**第一，`plan` 模式允许派子代理。** `blocked_tools` 里没有 `subagent`，所以 Plan 模式下模型可以派子代理，子代理也继承 Plan 模式从而被封住写工具。结果是「派了 4 个子代理，它们什么都不能改」。这个组合没有安全隐患（写不了就是写不了），但它会消耗四次 LLM 往返去得到一个「我做不到」的结论。合理的行为是在 `plan` 模式下直接把 `subagent` 从工具清单里去掉——因为纯分析任务不需要委派。

**第二，`goal` 模式和子代理的组合是最危险的。** `goal` 强制 `auto_approve = true` 且 `ApprovalPolicy::Never`。四条并行的子代理、每条都能跑命令、没有人被问过——06 讲的「`goal` 是唯一主动放弃人类监督的模式」在多体下被放大了四倍。这不一定是错的（无人值守场景就是要这个），但它意味着 `goal` + 多体的风险面是乘法关系而不是加法关系，配置文档应该写清楚这一点。

还有一个更微妙的：`PermissionMode` 是按「这一轮的意图」设计的，而子代理是「这一轮里的一个子角色」。把同一个模式原样继承下去，等于假设「这一轮的意图对所有角色都成立」。多数情况下成立，但 `debug` 模式是个反例——父代理在 debug 模式下不能改文件，而一个修 bug 的子代理可能恰恰需要改文件。这时候只能退出 debug 模式，没有「父代理 debug、子代理 default」这种组合。

## 七个多体的失效模式

把前面各节的现象按后果分级：

| 严重度 | 失效模式 | 根源 | 可否修 |
| --- | --- | --- | --- |
| 致命 | 嵌套子代理 + 门不可重入 → 永久死锁 | 防嵌套只过滤工具清单 | 能，入口加 depth 断言 |
| 高 | 中断在门等待中失效，Ctrl-C 最长等 80 分钟 | 只在步骤边界检查中断 | 能，`wait_timeout` 轮询 |
| 高 | 共享待办清单被子代理整体覆盖 | `todo_write` 是替换语义 | 能，加 owner 字段 |
| 高 | 共享后台任务可被子代理杀掉 | 任务表无归属信息 | 能，加 owner 字段 |
| 中 | 子代理能通过 `agent_list` 读到其他任务的结果摘要 | `agent_list` 不排除、也只按名字裁工具 | 能，按角色过滤 |
| 中 | `duration` 含排队时间，观测口径错误 | 登记早于 `acquire` | 能，拆两个时间点 |
| 中 | 排队任务显示成 running | 缺 `Queued` 状态 | 能，加枚举值 |

分级依据是「会不会造成不可恢复的后果」。死锁是不可恢复的（要靠杀进程）；其余都是可恢复的（重试、刷新、手动清理）。

有一条容易漏掉但没有列进来：`def.allowed_tools` 不参与执行检查。它不列在里面是因为它本身不产生错误行为——它只是让「用户以为的隔离」比「实际的隔离」更严。这类问题不会以故障形式出现，而是以「某天发现子代理改了不该改的文件」的形式出现。它属于安全审查项，不属于失效模式。

## 怎么把多体测出来

多体的测试难点是「并发 + 阻塞 + 时间」。四个可以直接写的测试：

**测试一：门上限不被突破。** 现成的 `gate_caps_concurrency` 就是模板：N 个线程抢 M 个槽位，记录峰值、断言 `peak <= M`，最后断言计数归零。断言计数归零这一条比断言峰值更重要——它证明没有泄漏。

**测试二：板子的状态迁移完整。** 现成的 `board_records_jobs_in_order` 覆盖了 `Running → Done` 和 `Running → Failed`。值得补的是「同一 id 重复 finish」和「finish 一个不存在的 id」，前者应该幂等（当前实现是：第二次 finish 会用第二次的 result 覆盖第一次，状态也被覆盖），后者应该静默。

**测试三：嵌套被拒绝。** 当前没有这个测试，因为当前也没有这个功能——但这是最容易写的一条：

```rust
#[test]
fn nested_subagents_are_refused() {
    // 在 depth = 1 的上下文里调 subagent，期望 Err
}
```

写这个测试的价值不在覆盖率，而在把「防嵌套靠工具清单」这个隐式设计变成显式契约。测试写了，`depth` 字段就会被加上。

**测试四：中断能打断等待。** 用 `wait_timeout` 版本的门，一个线程持有许可不放，另一个线程设上中断标志后 `acquire`，断言它在 200ms 内返回 `None`。这条测试会失败在当前实现上，这正是它的价值。

还有一条不好写但值得讨论的：**怎么验证「不会死锁」**。经典做法是压力测试——用比槽位多的线程反复 acquire/release 几千次；如果实现里有锁顺序问题，它会在某个时刻卡住。但卡住的表现是「测试不结束」，需要外部超时。所以压力测试必须配一个 watchdog：

```rust
// 主线程 join 带超时；超时则打印所有线程的状态并 abort
// Rust 标准库没有 join_timeout，常用做法是用 channel + recv_timeout
```

这条测试能覆盖锁顺序和计数泄漏两类问题，但对「嵌套死锁」覆盖不到——因为嵌套死锁需要模型配合。所以嵌套那条必须靠单元测试，不能靠压力测试。

## 七处可以加固的地方

按「投入产出比」排序：

**一、给 `Ctx` 加 `depth`，在 `run_subagent` 入口断言。** 三行代码，消除唯一一个致命失效模式。同时它让「以后支持两层嵌套」变成一个显式的数值改动（`if depth >= max_depth`）而不是结构性重写。

**二、`Gate::acquire` 改成可中断 + 带超时。** `wait_timeout` 轮询 200ms，同时检查中断标志。它同时解决「Ctrl-C 卡住」和「死锁不可恢复」两个问题——即使嵌套死锁真的发生，中断也能把它打破。

**三、`JobStatus` 加 `Queued`，并把 `duration` 拆成排队时长和执行时长。** 改动涉及 `board.rs` 和 `render_agent_board` 两处，但观测口径会立刻变准。

**四、`SubAgentDef` 加 `max_iterations`。** 子代理继承父代理的 40 轮是个危险的默认值——一个「跑测试并报告」的子代理不该有 40 轮预算。加一个可选字段、默认取一个比父代理小的值（比如 10），能让多体的成本可控。

**五、把 `MAX_PARALLEL_SUBAGENTS` 从常量变成配置。** 移进 `Config`，加 CLI flag 和 JSON 字段。这条改动是「让 4 变成可调」，但它真正的价值是让「配额」这个概念在代码里有正确的位置。

**六、给共享状态加归属。** `Todo { owner }`、`Task { owner }`、`Memory { source }`，工具层按角色过滤。这是列表中改动面最大的一条，也是唯一能根治「子代理搞乱父代理状态」的一条。

**七、给 `def.allowed_tools` 加执行期检查。** 在 `run_subagent_inner` 里包一层：把子代理上下文的 `check_tool` 换成「父代理允许 × 子代理允许」的交集。做法是给 `execute` 传一个可选的额外过滤集，或者在子代理期间用一个 `sub_cfg` 构造一个临时检查函数。

前三条改动都很小、收益明确，是「今天就能做」的。后四条里第四条和第五条属于配置层，第六条和第七条属于权限层，都需要先想清楚语义——比如 `owner` 用什么标识（`agent-7`？还是父代理给的 `def.name`？）——再动手。

## 小结：多体先要分清谁的责任

把 07 讲的东西压成三句话。

**第一，多体的抽象比它看起来弱。** `SubAgentDef` 只有四个字段，子代理本质上是「换了提示词、换了工具清单、可能换了模型的同一个 Agent」。这意味着很多你以为隔离了的东西其实没隔离：待办清单、后台任务、记忆目录、钩子可见性，全部是共享的。

**第二，共享本身不是缺陷，无归属的共享才是。** 任务板、限流门、`Ctx` 都该共享——否则用户看到五份互不相干的计划，`task_kill` 变成盲盒。问题在于共享的对象上没有「这是谁的」这个字段，于是任何角色都能改任何状态。加 owner 是这类问题的通用解。

**第三，三个切得不干净的地方有共同的形状：把「广告位过滤」当成了「执行期闸门」。** 防嵌套靠工具清单、子代理的工具限制靠工具清单、可用子代理名字靠系统提示词——三处都是「让模型看不见」而不是「让调用不成立」。这个区别在单代理场景下无关紧要（模型看不见就不会调），在多体场景下会放大成死锁、越权和信息泄漏。

NanoHermes 在多体上的实现有一处特别值得肯定：`GateGuard` 的 `Drop` 归还、`while` 重检条件、`notify_one` 而非 `notify_all`，这三个细节说明作者对手写信号量的坑是清楚的，测试里那句「all permits released」的断言也证明他知道要验证泄漏。真正的问题不在门的实现，而在门的**语义边界**——它管的是「同时几个」，而多体真正需要的是「谁的预算、谁的配额、谁的可见范围」。

下一篇进入观测：给每个轮次记一本账。07 讲的是「一次委派发生了什么」，08 要讲的是「怎么把这些事记下来、算清楚、看清楚」——用量统计、日志、以及一个 turn 的成本应该怎么归集到发起它的人身上。
