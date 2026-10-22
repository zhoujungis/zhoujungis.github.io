---
title: "04 Agent 工具设计：为什么输出都要有上限"
slug: agent-tool-design-output-budgets
cover_image: /photos/agent-tool-cover.png
date: 2026-10-24
tags: [Agent, Agent 工程, 工具设计, 架构设计]
---

> 适用读者：正在给 Agent 加工具、发现「加了工具反而更容易崩」的人；被一次 `cat` 大文件或一条刷屏命令撑爆上下文的人；想让工具集可维护、可审计的人
> 结论先行：工具设计有三层契约——拓扑（有哪些工具）、形状（参数与描述）、预算（输出上限）。前两层决定模型「能不能用对」，第三层决定它「用了之后会不会把上下文搞坏」。NanoHermes 的答案是：每个工具自己封顶，再加一道全局兜底 `clamp(s, 20_000)`
> 阅读时间：约 52 分钟 | 难度：进阶 | 收获：24 个工具的完整清单与三层契约 + 十三个输出上限的取值理由 + 截断的三种语义 + 工具设计的八条原则 + 九个会悄悄失效的陷阱

**目录**

- 前言：工具的边界就是 Agent 的边界
- 结论先行：三层契约
- 第一层拓扑：24 个工具从哪来
- 工具为什么会自己变多：skill、MCP、subagent
- 第二层形状：JSON schema 是唯一接口
- 描述文本也是契约：一句描述要说清三件事
- 参数校验的第一道门
- 第三层预算：为什么输出必须封顶
- 三个无限来源
- 一张总表：十三个上限
- 统一出口：dispatch 末尾的 clamp
- clamp 的注释与实现不一致：字符还是字节
- 截断的三种语义：拒绝、截断、丢弃
- read_file：4 MB 的准入门与 2000 行的窗口
- read_file 的三个细节：行号宽度、lossy 解码、二进制
- grep：200 条命中与 240 字符裁剪
- grep 没有文件数上限
- glob：500 个文件与一条假消息
- list_dir：唯一没有上限的读取工具
- run_command：256 KB × 2 与超时
- 双线程排空：为什么不能先 wait 再 read
- 后台任务：把长命令移出关键路径
- 后台任务的一个真实缺陷：stderr 从未被读走
- web_fetch：2 MB 与 20,000 字符
- skill 与项目文档：同样吃预算
- 错误即结果：Err(String) 的另一半价值
- 审批与确认：哪些工具默认要问
- 只读工具会跳过哪些目录
- 输出顺序：稳定排序为什么重要
- 工具的隐性成本：token、选择困难与误用
- 工具设计八条原则
- 九个常见陷阱
- 怎么验证你的工具真的安全
- 小结：上限是设计，不是补丁

## 前言：工具的边界就是 Agent 的边界

一个 Agent 能做什么，不取决于它的模型多聪明，而取决于它手里有哪些工具。工具集决定了能力的上界：没有 `edit_file`，它就没法改代码；没有 `run_command`，它就没法跑测试；没有 `web_fetch`，它就没法读文档。

但工具集也决定了失败的下界。一个只做读取的工具如果返回 3 MB 文本，这一轮对话就废了——不是模型答不上来，而是返回的内容把上下文挤满，后面的工具结果无处安放。这种失败比「模型答错」更隐蔽：模型会把截断后的半截内容当成全部，基于不完整的信息自信地给结论。

所以工具设计不只是「写几个函数 + 一份 JSON schema」，真正要处理的是三层问题：给模型看什么工具（拓扑）、让它怎么调用（形状）、调用回来多少数据（预算）。NanoHermes 的工具层不到 1200 行，但每一层都有明确设计，本文按这三层拆开讲。

## 结论先行：三层契约

| 层次 | 载体 | 出错后的症状 | 本文对应章节 |
| --- | --- | --- | --- |
| 拓扑 | `build_tools` 返回的数组 | 模型用了不存在的工具，或该有的能力没有 | 24 个工具从哪来 |
| 形状 | `specs()` 里的 name / description / parameters | 参数传错、描述误导、反复试错 | JSON schema 是唯一接口 |
| 预算 | 每个工具的内部上限 + `clamp` | 上下文被一次工具调用撑爆 | 十三个上限 |
| 错误 | `Result<String, String>` | 一旦出错整个轮次中断 | 错误即结果 |
| 权限 | `check_tool` + 审批策略 | 危险操作无人确认，或安全模式下改坏文件 | 审批与确认 |

五层里，只有「预算」这一层是绝大多数教程不讲、但线上事故最多的一层。因为拓扑和形状错了会立刻报错，预算错了不会报错——它只是悄悄让模型看到半截数据。

## 第一层拓扑：24 个工具从哪来

工具列表不是硬编码的一整个数组，而是拼出来的：

```rust
fn build_tools(&self) -> Value {
    let mut list = tools::specs().as_array().cloned().unwrap_or_default();
    // 只有真的发现了 skill 才把 skill 工具暴露出去。
    if !self.ctx.skills.is_empty() {
        list.push(skill_tool_spec());
    }
    if let Some(m) = &self.mcp {
        list.extend(m.all_tools());
        list.extend(mcp_aux_tools());
    }
    // 丢掉当前配置不允许的工具。
    list.retain(|t| { /* cfg.check_tool(name).is_ok() */ });
    if !self.cfg.subagents.is_empty() {
        list.push(subagent_tool_spec());
        list.push(agent_list_tool_spec());
    }
    Value::Array(list)
}
```

`specs()` 里有 21 个内置工具，按用途分成六组：

| 分组 | 工具 | 说明 |
| --- | --- | --- |
| 文件读写 | `read_file`、`write_file`、`edit_file`、`apply_patch`、`list_dir` | 五个，覆盖「看、整体写、局部改、多处改、列目录」 |
| 搜索 | `grep`、`glob` | 内容搜索与文件名搜索 |
| 执行 | `run_command`、`task_output`、`task_list`、`task_kill` | 一个前台加三个后台管理 |
| 网络 | `web_fetch`、`web_search` | 拉页面与搜结果 |
| 状态 | `todo_write`、`todo_read` | 会话内的计划列表 |
| 版本控制 | `git_status`、`git_diff`、`git_log`、`git_commit` | 三个只读加一个写入 |
| 记忆 | `memory_save`、`memory_search` | 跨会话记忆的读写 |

再加三个条件性的：`skill`（发现技能才加）、`subagent` 与 `agent_list`（配置了子代理才加）。MCP 服务器还会动态并入自己的工具，以及四个辅助工具 `mcp_list_resources`、`mcp_read_resource`、`mcp_list_prompts`、`mcp_get_prompt`。

拼装顺序是先内置、再 skill、再 MCP、最后子代理，这决定了工具在提示词里的先后，而模型对靠前的工具往往更顺手。内置排最前是合理的——它们最可靠、不依赖外部。

## 工具为什么会自己变多：skill、MCP、subagent

一个容易忽略的事实：工具数量不是常量。同一个二进制，在不同工作区、不同配置下，暴露的工具可能差出十几个。

| 来源 | 触发条件 | 增量 | 谁在控制 |
| --- | --- | --- | --- |
| 内置 | 永远 | 21 | 代码 |
| `skill` | 发现至少一个技能 | +1 | 工作区里的技能目录 |
| MCP | 配了 MCP 服务器 | +N（服务器自己声明） | `config.json` 的 mcp 段 |
| MCP 辅助 | 配了 MCP 服务器 | +4 | 代码 |
| `subagent` | 配了子代理 | +2 | `config.json` 的 subagents 段 |

这带来一个可维护性要求：工具多了，模型选错的概率上升，用户看 `/tools` 输出也会疲劳。NanoHermes 的做法是三条：

1. 条件性工具绝不无条件暴露。没发现技能就不给 `skill`，没配子代理就不给 `subagent`——避免模型去调用一个必然报错的工具。
2. 权限不允许的工具直接过滤掉（`list.retain(...)`），让模型看不到当前模式下会被拒绝的工具，不浪费一次调用去撞墙。
3. 相关能力合并成一个工具。`todo_write` 用「替换整个列表」的语义，省掉 add/update/remove/clear 四个工具；`run_command` 用 `background` 参数覆盖后台执行，而不是单独一个 `run_in_background`。

第 3 条是有争议的取舍：合并会让单个 schema 变复杂。但对模型来说，理解「带一个 `background` 布尔值的 `run_command`」比记住两个名字更省认知。

## 第二层形状：JSON schema 是唯一接口

模型看到的工具定义只有三段：名字、描述、参数 schema。这三段就是全部契约，没有任何隐式约定能被模型猜到。

```json
{
  "type": "function",
  "function": {
    "name": "read_file",
    "description": "Read a text file from the workspace. Returns content with line numbers. Use offset/limit for large files.",
    "parameters": {
      "type": "object",
      "properties": {
        "path":   { "type": "string", "description": "File path, absolute or relative to the workspace root." },
        "offset": { "type": "integer", "description": "1-based first line to read (default 1)." },
        "limit":  { "type": "integer", "description": "Maximum number of lines to read (default 2000)." }
      },
      "required": ["path"]
    }
  }
}
```

四个字段各有明确职责，缺一项就会产生一类误用：

| 字段 | 职责 | 缺失/含糊的后果 |
| --- | --- | --- |
| `name` | 模型调用的标识 | —— |
| `description` | 什么时候用它、返回什么形状 | 模型用错工具、或该用不用 |
| `properties[].description` | 参数语义与默认值 | 参数填错、猜默认值、反复试 |
| `required` | 哪些参数必须有 | 模型漏传关键参数，多一次失败往返 |

其中两句是刻意写的：`Returns content with line numbers` 告诉模型返回格式，`Use offset/limit for large files` 告诉它大文件怎么办——这直接决定了模型遇到大文件时会不会改成分页读。

反面例子：`grep` 描述里的 `Search file contents for a literal substring`，`literal` 这个词很关键，它明确说明不支持正则；否则模型可能传一个 `\d+` 或 `.*` 进来，然后得到「没有匹配」的假结论。而 `include` 说明写的 `Glob filter, e.g. '*.rs' or 'src/**/*.ts'`，用两个例子代替语法描述，对模型比抽象说明更有效。

## 描述文本也是契约：一句描述要说清三件事

把 24 个工具的 `description` 摆在一起看，能总结出一个模式：好描述 = 做什么 + 返回什么 + 边界或注意事项。

| 工具 | 描述里的关键短语 | 它解决的问题 |
| --- | --- | --- |
| `write_file` | `Prefer edit_file for small changes` | 防止模型用整文件覆盖去做小改动 |
| `edit_file` | `must match the file byte-for-byte, including indentation` | 减少「匹配不到」的失败 |
| `apply_patch` | `instead of edit_file` + `must include @@ hunks with matching context` | 划清与 `edit_file` 的边界 |
| `run_command` | `Use non-interactive flags` | 防止命令卡在等待输入 |
| `run_command` | `Set background=true for long-running tasks, then poll with task_output` | 教会两段式用法 |
| `web_search` | `Follow up with web_fetch on a result URL to read the page` | 教会组合用法 |
| `todo_write` | `Replaces any previous list` | 消除「是追加还是替换」的歧义 |
| `memory_save` | `One concise, self-contained sentence` | 保证记忆可脱离上下文理解 |
| `git_commit` | `Asks the user to confirm unless auto-approval is enabled` | 让模型预知可能被拒绝 |

最值得学的是「跨工具指路」这一类：`write_file` 指向 `edit_file`、`apply_patch` 指向 `edit_file`、`web_search` 指向 `web_fetch`、`run_command` 指向 `task_output`。它们不增加任何能力，但显著减少错误选择，工具集越大收益越高。

反面例子：`task_list` 的描述只有一句 `List all background tasks with their id, command and status (running/finished).`，正确但偏薄——没说清输出格式，模型只能靠调一次来学。对低频、低风险的只读工具可以接受；如果它经常被误用，就该补上返回示例。

## 参数校验的第一道门

schema 是给模型看的建议，不是强制的。模型完全可能少传一个字段、传错类型，或者传个空字符串。所以每个工具入口都要有自己的校验。

`fs.rs` 里有一个共用的取值助手：

```rust
fn req_str<'a>(args: &'a Value, key: &str) -> Result<&'a str, String> {
    args.get(key)
        .and_then(|v| v.as_str())
        .ok_or_else(|| format!("missing string field `{key}`"))
}
```

一行办三件事：字段不存在、类型不是字符串、值是 `null`，全部归为「missing string field」，错误里带上字段名，模型才能自己修。

可选参数统一给默认值而不是设为必填，原则是「覆盖最常见用法，且不产生危险行为」：`offset` 默认 1、`limit` 默认 2000、`timeout_secs` 默认 120、`max_chars` 默认 20000。危险值另用 `clamp` 挡住——`timeout_secs` 限在 1..3600 秒，`max_chars` 限在 500..200,000 字符，模型不能要求一个跑一整天不超时的命令，也不能一次要 100 MB 文本。

另一类是「空值防御」：

| 工具 | 拒绝的输入 | 错误文本 |
| --- | --- | --- |
| `run_command` | `command.trim().is_empty()` | `` `command` must not be empty `` |
| `grep` / `glob` | `pattern.is_empty()` | `` `pattern` must not be empty `` |
| `edit_file` | `old_string` 为空 | `` `old_string` must not be empty; use write_file to create a file `` |
| `apply_patch` | `diff.trim()` 为空 | `` `diff` must not be empty `` |
| `git_commit` | `message.trim()` 为空 | `` `message` must not be empty `` |
| `web_search` | `query.trim()` 为空 | `` `query` must not be empty `` |

这些检查看起来多余（模型为什么要传空字符串？），但挡住了两类真实情况：模型在「先占位再补」的推理中发出半成品调用；JSON 解析失败被兜成空对象，此时所有字段都是缺失。

还有一个顺序细节：`edit_file` 的空 `old_string` 检查和 `apply_patch` 的空 `diff` 检查都写在读文件之前。参数错误应该在碰到文件系统之前暴露，既省一次 IO，也避免「文件不存在」盖住「参数没填」的真实原因。

## 第三层预算：为什么输出必须封顶

前面两层讲「怎么调」，这一层讲「调完回来多少」，它最容易被忽略，也最容易出事。

反直觉的是：上下文最大的杀手往往不是用户输入，而是工具输出。用户打一行字可能几十个字符，一条 `run_command` 的输出可以是几兆。没有上限就会出三种坏结果：

1. 上下文被挤爆。单次调用就超过 120,000 字符的会话预算，触发压缩，丢掉真正的历史；而压缩摘要还要多一次模型调用。
2. 模型被噪音淹没。`ls -R` 或 `npm install` 的几千行里真正有用的可能只有三行，但模型必须读完全部。
3. 请求直接失败。很多模型服务有单请求 token 上限，超了直接报错，整轮白跑。

反过来说，上限也是一种信息压缩手段：告诉模型「你看到的不是全部」，让它意识到该分页、缩小范围或换个工具。**上限本身就是提示词的一部分。**

## 三个无限来源

工具输出的长度风险来自三个方向，每个方向的封顶位置都不一样。

| 来源 | 为什么可能无限 | 封顶的位置 |
| --- | --- | --- |
| 文件 | 用户可能有一个 500 MB 的日志文件 | `read_file` 的准入门 + `clamp` |
| 命令 | `npm install`、`cargo build`、`git log` 的输出条数不可控 | 管道读取时的捕获上限 |
| 网络 | 一个页面可以任意长，也可能是 100 MB 的压缩包 | 响应体字节上限 + 字符裁剪 |
| 目录 | 一个目录可以有十万个条目 | 读文件数上限（`grep`/`glob`）+ `clamp` |

对应到实现，封顶分四层：**枚举前过滤**（`grep` 跳过超过 1 MB 的文件）、**读取时限制**（`read_capped` 只留前 256 KB）、**产出后裁剪**（`clip` 把每行截到 240 字符）、**出口兜底**（`clamp` 统一截到 20,000 字节）。四层的顺序不能乱：枚举阶段不先按体积过滤，一个巨型文件就能拖慢整次 `grep`；读取阶段不限制，进程内存先炸，根本轮不到出口兜底。

## 一张总表：十三个上限

把散在各个文件里的常量集中起来看，会发现它们其实是一套完整的预算体系。

| 常量 | 位置 | 值 | 管什么 | 超限后的行为 |
| --- | --- | --- | --- | --- |
| `max_output` | `Ctx` | 20,000 | 所有工具的最终输出 | 截断 + 标注省略字节数 |
| `MAX_FILE_BYTES` | `tools/fs.rs` | 4 MB | 单次 `read_file` 的准入 | 直接报错，提示分块读 |
| `MAX_MATCHES` | `tools/search.rs` | 200 | `grep` 命中条数 | 停止遍历 + 一行说明 |
| `MAX_FILES` | `tools/search.rs` | 500 | `glob` 结果文件数 | 停止收集 + 一行说明 |
| `MAX_FILE_BYTES` | `tools/search.rs` | 1 MB | `grep` 单文件准入 | 静默跳过该文件 |
| `MAX_LINE_CHARS` | `tools/search.rs` | 240 | `grep` 单行长度 | 裁剪 + 省略号 |
| `CAPTURE_BYTES` | `tools/shell.rs` | 256 KB | 前台命令每个流 | 排空丢弃 + 一行说明 |
| `CAPTURE_BYTES` | `tools/tasks.rs` | 512 KB | 后台任务累计输出 | 排空丢弃 + 一行说明 |
| `MAX_RESPONSE_BYTES` | `tools/web.rs` | 2 MB | 单次下载的响应体 | 排空丢弃 + 一行说明 |
| `MAX_BODY_CHARS` | `skills.rs` | 20,000 | 单个技能正文 | 截断 |
| `MAX_PROJECT_DOCS` | `prompt.rs` | 20,000 | 拼接后的项目文档 | 截断 + 一行说明 |
| `MAX_ITEMS` | `tools/todo.rs` | 50 | 计划列表条数 | 报错，拒绝写入 |
| `RESULT_PREVIEW` | `board.rs` | 500 | 子代理结果在列表里的预览 | 截断 |

三个观察：

1. **单位不统一。** 有的按字节（`MAX_FILE_BYTES`、`CAPTURE_BYTES`、`max_output`），有的按"字符"名义但其实也是字节（见下一节），有的真的按字符（`MAX_BODY_CHARS`、`MAX_LINE_CHARS`）。对英文和代码影响不大，对中文和 emoji 差别是三倍。
2. **超限行为不统一。** 三种：报错（`read_file`、`todo_write`）、截断加标注（`clamp`、`clip`、`CAPTURE_BYTES`）、静默跳过（`grep` 跳过 1 MB 以上的文件）。
3. **数量级分层清晰。** 单次读文件最宽（4 MB），其次是网络（2 MB）、后台任务（512 KB）、前台命令（256 KB），最后统一收到 20,000 字节。这个梯度反映的是「数据从哪来」——本地文件最可信也最可控，网络最不可控。

最容易被忽略的是 `RESULT_PREVIEW = 500`：子代理结果在 `agent_list` 里的显示长度。它决定了父代理「扫一眼」任务板能看到多少，500 字符约一两句话，刚好够判断子代理是完成了还是卡住了。

## 统一出口：dispatch 末尾的 clamp

不管工具内部怎么封顶，最后还有一道统一的出口：

```rust
pub fn dispatch(name: &str, args: &Value, ctx: &Ctx) -> Result<String, String> {
    let r = match name {
        "read_file" => fs::read_file(args, ctx),
        // … 二十多个分支 …
        other => Err(format!("unknown tool `{other}`")),
    };
    r.map(|s| clamp(s, ctx.max_output))
}
```

这一行的价值在于「不可绕过」：新增工具时作者可能忘了限输出，但只要走 `dispatch`，就一定被 `clamp` 收一遍。这是典型的「默认安全」——不安全的写法需要刻意绕过，而不是刻意加上。

`clamp` 只有十行，但有两个细节：

```rust
fn clamp(s: String, max: usize) -> String {
    if s.len() <= max {
        return s;
    }
    let mut end = max;
    while end > 0 && !s.is_char_boundary(end) {
        end -= 1;
    }
    format!(
        "{}\n… output truncated ({} chars omitted)",
        &s[..end],
        s.len() - end
    )
}
```

第一个细节是**字符边界回退**。`&s[..end]` 要求 `end` 落在 UTF-8 边界上，否则直接 panic；切到第 20,000 字节时很可能正切在某个中文字符中间（中文占三字节），所以必须往前退。最多退两个字节，但少了它，Agent 会 panic 而不是截断。

第二个细节是**省略字节数**。标注 `(3600 chars omitted)` 让模型知道这里少了东西，但写的是 `chars`、算的是字节。中文场景下实际省略的字符数是标注值的三分之一。

还有一处不对称：`Result::map` 只处理 `Ok` 分支，`Err` 原样透传，所以错误信息**不**受 `max_output` 限制。理论上工具可以返回一条超长错误把上下文撑大，实践中错误都很短，但这个差别值得记住。

## clamp 的注释与实现不一致：字符还是字节

`Ctx` 里的字段声明写着：

```rust
/// Max characters of tool output fed back to the model (keeps context small).
pub max_output: usize,
```

注释说是 **characters**。而 `clamp` 用的是 `s.len()`——Rust 里 `String::len()` 返回的是**字节数**。所以 `max_output = 20_000` 实际是 20,000 字节。

这个差别在中文内容上是三倍：纯 ASCII 的 20,000 字节正好是 20,000 字符；中文（UTF-8 三字节）只有约 6,666 字；中英混排约 10,000 字符。对读中文注释、搜中文文档、拉中文页面，这个差别都会实际发生——中文内容的可比容量只有英文的三分之一。

同一份代码里还有相反的写法：`web_fetch` 的 `clip_chars`、`grep` 的 `MAX_LINE_CHARS`、技能正文的 `MAX_BODY_CHARS` 都真的按字符。所以同一个项目里有两套语义，取决于作者当时用的是 `s.len()` 还是 `chars().count()`。

这不是需要立刻修的 bug——20,000 字节对绝大多数场景够用。但它是一个**必须写进文档的不一致**，因为任何基于「max_output 是字符数」的容量估算都会错。改法很简单：把 `Ctx` 的注释从 `Max characters` 改成 `Max bytes`（零成本），或把 `clamp` 改成按 `chars()` 计数（更符合直觉，但每次都要遍历字符串）。

## 截断的三种语义：拒绝、截断、丢弃

超限之后做什么，不是一个统一的问题。三种做法各有适用场景，选错了会制造很难查的问题。

| 语义 | 实现 | 用在哪 | 优点 | 风险 |
| --- | --- | --- | --- | --- |
| 拒绝 | 返回 `Err` | `read_file` 超 4 MB、`todo_write` 超 50 条 | 模型立刻知道要换策略 | 多一次失败往返 |
| 截断加标注 | 保留前缀 + 说明省略量 | `clamp`、`clip`、`CAPTURE_BYTES` | 有信息可用，模型知道不完整 | 标注本身也占预算 |
| 静默丢弃 | 跳过，不提示 | `grep` 跳过超 1 MB 的文件 | 不打断流程 | 模型以为「没有匹配」 |

第三种最危险，来看具体位置：

```rust
let Ok(meta) = fs::metadata(path) else { return };
if meta.len() > MAX_FILE_BYTES {
    return;   // 超过 1 MB 的文件直接跳过，不报不提示
}
```

如果模型在一堆小文件里搜一个字符串，而那个字符串恰好只出现在一个大文件里，它会得到 `no matches for ...`。这个结论是错的，但模型无从判断，因为它不知道有文件被跳过了。

为什么仍然选静默跳过？因为在遍历整个目录树时，为每个超限文件输出一行提示，会让「匹配不到」这种情况返回几十行噪音，反而更糟。折中方案是在最终输出里追加一句「N 个文件因体积被跳过」——只需要一个计数器，成本极低，收益是一整类误判的消除。

同理，`read_capped` 的「排空丢弃」也是一种设计：

```rust
pub(crate) fn read_capped(mut r: impl Read) -> (Vec<u8>, usize) {
    let mut kept = Vec::new();
    let mut total = 0usize;
    loop {
        match r.read(&mut buf) {
            Ok(0) => break,
            Ok(n) => {
                total += n;
                if kept.len() < CAPTURE_BYTES {
                    let room = CAPTURE_BYTES - kept.len();
                    kept.extend_from_slice(&buf[..n.min(room)]);
                }
            }
            Err(ref e) if e.kind() == std::io::ErrorKind::Interrupted => continue,
            Err(_) => break,
        }
    }
    (kept, total)
}
```

它必须继续读完（而不是直接停止读取），否则子进程会因管道写满而阻塞。所以「丢弃」在这里是「读走但不留」，而不是「不读」。返回的 `total` 就是用来算省略量的。这个函数在三个地方被复用：`shell.rs`（前台命令）、`tasks.rs`（后台任务）、`git.rs`（git 输出），只是各自的 `CAPTURE_BYTES` 不同。

## read_file：4 MB 的准入门与 2000 行的窗口

`read_file` 是使用频率最高的工具，也是唯一一个用「拒绝」而不是「截断」来保护自己的读取工具：

```rust
let meta = fs::metadata(&full)?;
if meta.len() > MAX_FILE_BYTES {
    return Err(format!(
        "{} is {} bytes (> {}); read it in chunks with offset/limit",
        full.display(), meta.len(), MAX_FILE_BYTES
    ));
}
```

错误信息里给了明确的下一步动作：`read it in chunks with offset/limit`。这比「文件太大」有用得多——它把模型从「我该怎么办」直接引到「用 offset 和 limit」。

`MAX_FILE_BYTES = 4 MB` 这个数字怎么来的？它不是输出预算，而是**内存预算**。文件会被完整读进内存再按行切分，所以 4 MB 对应的是「单次分配 4 MB 是安全的」。真正的输出预算由后面两层管：2000 行的默认窗口，以及出口的 20,000 字节 `clamp`。

两者的关系值得算一遍。一个 3.5 MB、每行 100 字节的日志约 35,000 行；默认读前 2000 行约 200 KB，出口 `clamp` 再切到 20,000 字节，也就是约 200 行。于是模型以为自己要了 2000 行，实际只拿到 200 行加一条截断标注——不注意看标注，它就会基于前 200 行下结论。

更彻底的做法有两种：把 `limit` 默认值降到跟输出预算匹配（比如 300），让「请求的行数」和「拿到的行数」大致一致；或者在截断标注里写明「本文件共 N 行，你看到的是前 M 行」。NanoHermes 只做了后者的一半（有标注、默认值没调），代价是模型得自己换算。

窗口读的实现里还有一个易错的表达式：

```rust
let end = (offset - 1 + limit).min(total);
let width = end.to_string().len();
for (i, line) in lines[(offset - 1)..end].iter().enumerate() {
    let n = offset + i;
    out.push_str(&format!("{n:>width$}→{line}\n"));
}
```

行号右对齐的宽度取自 `end`（窗口最后一行号）而不是 `total`（文件总行数）：读第 1 到 2000 行时宽度是 4，只读第 1 到 9 行时宽度就是 1。列宽随窗口变化，不同次调用的对齐方式不一致——对模型影响很小（它读数字），但人把两次输出拼起来看 diff 时会有点干扰。

## read_file 的三个细节：行号宽度、lossy 解码、二进制

除了行号宽度，`read_file` 还有两个行为值得单独说。

**第一，是 `from_utf8_lossy` 而不是严格解码。** 如果文件里有非法 UTF-8 字节（GBK 编码的中文文本、损坏的日志、二进制混入），`lossy` 会把这些字节替换成 `U+FFFD` 而不是报错。对 Agent 来说这是对的选择：宁可让模型看到几个替换字符，也不要因为一个坏字节整个文件读不出来。

**第二，`read_file` 不做二进制检测，而 `grep` 做。**

```rust
/// Exposed for reuse by the search module.
pub fn is_binary(bytes: &[u8]) -> bool {
    bytes.iter().take(8192).any(|&b| b == 0)
}
```

这个函数只被 `grep` 调用。`read_file` 拿到一个 2 MB 的 PNG（在 4 MB 准入门之内）会照读不误，返回一大段带 `` 的乱码，然后被 `clamp` 截到 20,000 字节。模型通常能自己意识到这是二进制文件，但这一轮基本浪费了。修法只需在 `read_file` 里加同一句 `is_binary(&bytes)` 检查并返回 `Err("… looks like a binary file")`：判据是「前 8192 字节里有 NUL 字节」，对真正的文本文件零误报，对绝大多数二进制文件都能命中——一行修一个类。

## grep：200 条命中与 240 字符裁剪

`grep` 是唯一同时有四重限制的工具：

```rust
const MAX_MATCHES: usize = 200;
const MAX_FILES: usize = 500;
const MAX_FILE_BYTES: u64 = 1024 * 1024;
const MAX_LINE_CHARS: usize = 240;
```

| 限制 | 值 | 作用点 | 触发的输出 |
| --- | --- | --- | --- |
| 命中条数 | 200 | 内层循环，达标即刻停止遍历 | `… stopped after 200 matches` |
| 单文件体积 | 1 MB | 进入文件前判断 | 无提示（静默跳过） |
| 单行长度 | 240 | 匹配成功后的行裁剪 | 行尾 `…` |
| 文件数 | 500 | —— | 只在 `glob` 里用，`grep` 不用 |

命中条数的实现有一个细节值得学：

```rust
for_each_file(&base, |path, rel| {
    if truncated { return; }
    // …
    if hay.contains(&needle) {
        out.push_str(&format!("{}:{}:{}\n", rel, i + 1, clip(line)));
        hits += 1;
        if hits >= MAX_MATCHES {
            truncated = true;
            return;
        }
    }
});
```

用 `truncated` 标志而不是 `break`——因为 `for_each_file` 接收的是闭包，闭包里没法写 `break`。第一行的 `if truncated { return }` 让后续文件在闭包入口就直接返回，效果等同于提前终止遍历，但遍历本身还在走（每个剩余文件都要进一次闭包）。对大仓库来说这会多走一些空转，代价可接受。

输出格式是 `path:line:text`，路径用相对路径并把反斜杠统一换成 `/`（`replace('\\', "/")`）。统一成正斜杠让输出跨平台一致，模型不用区分两种路径风格，也不会把反斜杠和分隔冒号混在一起（虽然 Windows 盘符的 `C:` 仍有歧义）。

还有一个性能隐患：大小写不敏感搜索对每一行都做一次 `to_lowercase()`，两个分配加两次遍历，一万行的文件就是几万次小分配。更快的做法是无分配的 `eq_ignore_ascii_case` 匹配。这不影响正确性，但 `grep` 是使用频率最高的工具之一，值得优化。

## grep 没有文件数上限

`MAX_FILES = 500` 只出现在 `glob` 里。`grep` 遍历时不限制文件数——它只靠 `MAX_MATCHES` 兜底。

最坏场景是：在一个有 50 万个文件的目录树里搜一个几乎不存在的字符串。`grep` 会走遍每个文件（每个都做一次 `fs::read`），最后返回 `no matches`，中间可能耗掉几分钟。没有超时，没有文件数上限，也没有进度输出。`glob` 至少从第 501 个匹配起不再收集，虽然遍历同样继续。Agent 通常在项目根目录搜索，文件数在几千量级，所以这不是紧急问题；但如果工作区里有一个没被忽略规则覆盖的巨大生成目录，`grep` 就会变成一次「不返回的操作」。改进方向有两个：给 `for_each_file` 加已访问文件计数并提前终止；把忽略目录改成可配置。

顺带说一个设计上的优点：`grep` 的 `include` 参数走 `path_matches`，会同时尝试匹配相对路径和文件名：

```rust
fn path_matches(pattern: &str, rel: &str) -> bool {
    if glob_match(pattern, rel) { return true; }
    let name = rel.rsplit('/').next().unwrap_or(rel);
    glob_match(pattern, name)
}
```

所以 `include: "*.rs"` 能匹配 `src/main.rs`（用文件名匹配），`include: "src/**/*.ts"` 也能匹配（用相对路径匹配）。这个双路尝试让模型不用纠结「我该写相对路径还是文件名」，是一个很实用的小设计。

## glob：500 个文件与一条假消息

`glob` 的分段匹配器有三条规则：模式用完了必须路径也用完（`*.rs` 不匹配 `src/main.rs`）；`**` 可以吃零到多段（`src/**/*.rs` 能匹配 `src/main.rs`）；普通段用 `*` 和 `?` 做段内通配（`*` 不跨 `/`）。单元测试把这三条都锁住了。

`for_each_file` 用的是显式栈而不是递归：不会因深层目录栈溢出，而且「先把条目收完再下降」避免了持有 `read_dir` 句柄时同时递归的资源问题。

最后是那条假消息。截断判断用的是：

```rust
if matches.len() >= MAX_FILES {
    out.push_str(&format!("\n… capped at {MAX_FILES} files"));
}
```

条件是 `>=` 500。如果一个项目恰好有 500 个匹配文件（没有第 501 个），输出照样附上「已截断到 500 个」，模型会以为还有更多，去用别的办法继续找。正确判据应该是「是否因为达到上限而没收集到某个匹配」——在超出分支里把 `overflowed` 置真即可。差别只在边界情况，但「假截断」比「不截断」更容易误导：它让模型主动放弃已经拿到的完整结果。

## list_dir：唯一没有上限的读取工具

`list_dir` 是这套工具里唯一一个完全不做内部限制的读取工具：列出目录下所有条目，靠出口 `clamp` 兜底。后果可以推算：5000 个文件、每行约 40 字符，总输出约 200 KB，`clamp` 切到 20,000 字节后只剩约 500 行，目录的后 90% 完全不可见。

这和 `read_file` 处理大文件的方式形成对比：`read_file` 会报错让模型分块读，`list_dir` 则默默给前 500 条，而且没有分页参数（只有 `path`），模型想「看第 501 到 1000 条」只能换个更深的子目录。典型用法（看看项目有什么）没问题，但面对构建产物、数据集这类大目录时，它会给出一幅误导性的「不完整全景」。低成本改法是加一条 300 条的内部上限，结尾注明「共 N 个条目，显示前 300」。

另一个小问题是每个文件的大小用 `human_size`（`1.5 MB` 这种）输出。对人友好，但 `1048576` 变成 `1.0 MB` 后，模型想找最大的几个文件得先解析单位再比较。这不是错，是「为谁优化」的选择。

## run_command：256 KB × 2 与超时

`run_command` 是能力最强也最危险的工具。它的预算设计有四处：

```rust
const CAPTURE_BYTES: usize = 256 * 1024;
```

| 约束 | 值 | 触发后的行为 |
| --- | --- | --- |
| 每个流的捕获量 | 256 KB | 排空丢弃，报告里说明省略字节数 |
| 超时 | 默认 120s，clamp 到 1..3600 | 杀进程，报告 `command timed out after Ns and was killed` |
| 工作目录 | 默认工作区根目录 | `resolve` 到绝对路径 |
| 输出结构 | exit code + stdout 段 + stderr 段 | 空流显示 `(empty)` |

256 KB 是「每个流」，所以理论最坏是 512 KB，然后又会被出口 `clamp` 收到 20,000 字节。也就是说 `read_capped` 的 256 KB 几乎从不成为用户可见的限制——它只是防止内存被一条刷屏命令吃掉。

真正会被用户看到的是超时。超时的实现是轮询：

```rust
let exit = loop {
    match child.try_wait() {
        Ok(Some(status)) => break status.code(),
        Ok(None) => {
            if start.elapsed() >= Duration::from_secs(timeout) {
                let _ = child.kill();
                let _ = child.wait();
                timed_out = true;
                break None;
            }
            std::thread::sleep(Duration::from_millis(25));
        }
        Err(e) => return Err(format!("failed to wait for command: {e}")),
    }
};
```

25 毫秒的轮询在灵活（能实现超时）和省 CPU 之间折中，精度约 ±25 ms，对秒级超时够用。`kill()` 后紧跟 `wait()` 也是必要的：只发信号不回收会留下僵尸进程。超时时 `exit` 是 `None`，报告写成 `exit code: killed`，让模型能区分正常失败和被超时杀掉。

`run_command` 还是少数会主动调用审批的工具：

```rust
if crate::sandbox::needs_approval(ctx.auto_approve, ctx.approval, command) && !confirm(command) {
    return Ok("Command denied by the user. Do not retry it; ask what to do instead.".to_string());
}
```

这里返回的是 `Ok` 而不是 `Err`，且文本里明确写了两条指令：`Do not retry it`（别重试）和 `ask what to do instead`（问用户）。把拒绝做成「一条给模型看的指令」而不是「一个错误」，是这套设计里最聪明的几处之一——因为对模型来说，「用户拒绝」和「命令失败」需要完全不同的反应：前者要停下来问，后者可以换命令重试。如果返回 `Err` 并写成通用错误，模型很可能把被拒绝的命令换个写法再试一次，而这正是用户拒绝的意图所在。

## 双线程排空：为什么不能先 wait 再 read

`run_command` 里有一段看起来多余的代码：

```rust
let out_pipe = child.stdout.take().expect("stdout piped");
let err_pipe = child.stderr.take().expect("stderr piped");
let out_thread = std::thread::spawn(move || read_capped(out_pipe));
let err_thread = std::thread::spawn(move || read_capped(err_pipe));
```

为什么不能直接 `child.wait_with_output()`？因为那会等到进程退出才开始读输出。而管道缓冲区有上限（Linux 通常 64 KB），一个输出超过 64 KB 的子进程会在写管道时阻塞，永远不退出——于是 `wait` 永远不返回。这就是经典的管道死锁。

两个线程各读一个流，主线程只负责等待和超时判断。这样即使子进程输出几兆，管道也不会被填满（因为一直有人在读走）。注释里写得很直白：

```rust
// Drain both pipes on separate threads so a chatty child can never deadlock
// by filling the OS pipe buffer while we wait for it to exit.
```

这个模式在 `git.rs` 里被复用了一次（`git diff` 也可能输出几兆），在 `tasks.rs` 里则没有复用——这个差异正是下一节要说的缺陷。

## 后台任务：把长命令移出关键路径

前台 `run_command` 的超时上限是 3600 秒，但即使在范围内，让模型干等一次 `cargo build` 也不划算：这一轮的所有时间都花在等命令上，而模型其实可以去读代码、写文档，最后再回来收结果。

所以有 `background: true`：

```rust
if args.get("background").and_then(|v| v.as_bool()).unwrap_or(false) {
    return super::tasks::run_background(args, ctx);
}
```

后台任务的注册表住在 `Ctx` 里，被所有工具共享，用 `Mutex<HashMap<String, Task>>` 保护：

```rust
pub struct TaskManager {
    tasks: Mutex<HashMap<String, Task>>,
}
```

任务 id 是「进程 id + 纳秒时间戳」。用纳秒而不是自增计数器，是为了同一毫秒内启动多个任务时不冲突，也省掉一个全局计数器；带进程 id 则是让**跨进程**的日志能看出任务属于哪个 agent 实例。

配套的三个管理工具形成完整的生命周期：`task_list` 看有哪些任务和状态，`task_output` 收增量输出，`task_kill` 终止。`output()` 的实现是「drain 增量」而不是「返回全量」：

```rust
pub fn output(&self, task_id: &str) -> Result<String, String> {
    let mut map = self.tasks.lock().unwrap();
    let task = map.get_mut(task_id).ok_or(/* unknown task */)?;
    if let Some(child) = task.child.as_mut() {
        if let Some(mut out) = child.stdout.take() {
            let (kept, total) = read_capped(&mut out);
            task.out_buf.extend_from_slice(&kept);
            task.out_total += total;
            child.stdout = Some(out);
        }
        // …
    }
    // …
}
```

`take()` 之后又放回去，是因为 `read_capped` 按值接收 reader；写法有点绕，但避免了给 `Task` 加额外的生命周期参数。

累计输出受 `CAPTURE_BYTES = 512 KB` 限制，比前台命令的 256 KB 大一倍。理由是合理的：后台任务的输出会被多次 `task_output` 分批取走，累计量自然更大，而且它是「累计保留」而不是「单次报告」。

## 后台任务的一个真实缺陷：stderr 从未被读走

看 `TaskManager::spawn` 里的进程配置：

```rust
cmd.current_dir(cwd)
    .stdin(Stdio::null())
    .stdout(Stdio::piped())
    .stderr(Stdio::piped());
```

stdout 和 stderr 都被设成了管道。但回头看上一节的 `output()`：它只 `take()` 并读取 `child.stdout`。`Task` 结构体里也只有一个 `out_buf` 字段，没有对应的错误缓冲区。stderr 被设成管道后，**没有任何代码去读它**。

这意味着一件很严重的事：如果一个后台命令往 stderr 写超过管道缓冲区（常见是 64 KB），它会在写 stderr 时永久阻塞，进程永远不退出，`task_output` 永远显示 `running`。而模型会一直轮询一个永远不会完成的任务。

什么时候会遇到？比想象的多：

| 场景 | stderr 输出量 |
| --- | --- |
| `cargo build`（进度条、warning） | 编译警告很容易超过 64 KB |
| `npm install`（弃用警告、audit 报告） | 常见几 KB 到几十 KB |
| 任何带进度条的 CLI（pip、docker） | 进度条持续重绘，量很大 |
| 一个报了很多错的测试命令 | 无上限 |

对照组是前台 `run_command`：它用两个线程同时排空两个管道，所以同样的问题不存在。`git.rs` 的 `run_git` 也做了同样的事（两个线程）。只有后台任务这条路径漏了。

修法有两种：把 stderr 合并进 stdout（`2>&1`，但要改命令字符串，不干净），或者给 `Task` 加一个 `err_buf`，在 `output()` 里同样 drain stderr。后者更正确：

```rust
if let Some(mut err) = child.stderr.take() {
    let (kept, total) = read_capped(&mut err);
    task.err_buf.extend_from_slice(&kept);
    task.err_total += total;
    child.stderr = Some(err);
}
```

这样既解决阻塞，也让错误信息可见——现在后台任务的 stderr 内容是完全丢失的，模型只能看到 stdout。对一个 Agent 工具来说，「命令失败了但看不到错误信息」是个很糟糕的状态。

这个缺陷值得单独列出来，因为它完美展示了一类问题：**同一个项目里，两条相似路径（前台/后台）采用了不同的排空策略，其中一条是错的，而没有测试覆盖「后台命令输出大量 stderr」这个场景**。这类问题靠代码审查很难发现，因为错误路径看起来完全正常——它只是永远不结束。

## web_fetch：2 MB 与 20,000 字符

网络是三个无限来源里最不可控的。`web_fetch` 为此做了两层限制：

```rust
const MAX_RESPONSE_BYTES: usize = 2 * 1024 * 1024;

let max_chars = args
    .get("max_chars")
    .and_then(|v| v.as_u64())
    .unwrap_or(20_000)
    .clamp(500, 200_000) as usize;
```

第一层是响应体：最多留 2 MB，其余读走丢弃。第二层是文本裁剪：`clip_chars` 按**字符**裁到 `max_chars`，默认 20,000。注意这一层和出口 `clamp` 的 20,000 字节语义不同——`web_fetch` 先按字符裁到 20,000 字，如果这是中文，就是 60,000 字节，然后再被出口 `clamp` 切到 20,000 字节。两次裁剪都有用，但第二次才是最终生效的那个。

`max_chars` 被 clamp 在 500 到 200,000 之间。下限 500 防止模型要一个没用的碎片；上限 200,000 防止一次要 100 MB 文本。但上限 200,000 其实永远不会生效，因为出口 `clamp` 只有 20,000 字节——一个诚实的参数范围应该是 `clamp(500, 20_000)`，或者至少让参数上限和出口预算一致。

响应体保留量的检查也值得看：

```rust
let mut out = format!("URL: {url}\n");
if total > bytes.len() {
    out.push_str(&format!("[response truncated at {MAX_RESPONSE_BYTES} bytes]\n"));
}
out.push_str(&clip_chars(&text, max_chars));
```

`total > bytes.len()` 这个判断是「实际读到多少 vs 保留了多少」，比「响应头里的 Content-Length」可靠——因为分块传输、gzip 压缩都可能让 Content-Length 缺失或不准。这是「按实际发生的事实判断」而不是「按声明判断」，在 HTTP 场景下是唯一正确的做法。

`web_search` 只有结果条数限制（`count` 默认 5，clamp 到 1..10）。这是合理的：搜索结果结构固定（标题 + URL + 摘要），条数就是长度的唯一决定因素。但如果单个摘要特别长，输出仍可能很大——只是被出口 `clamp` 兜住。

最后注意「限制输出」不等于「限制计算量」：`html_to_text` 要遍历整个 HTML 做标签剥离、实体解码、空白折叠，最后才裁剪，所以一个 2 MB 的页面仍会被完整解析一遍。对 Agent 的调用频率无所谓，但如果把 `web_fetch` 放进循环跑几千次，瓶颈就在这里。

## skill 与项目文档：同样吃预算

两个不是「工具输出」但同样吃预算的地方也有上限。

**技能正文**：`skills.rs` 的 `MAX_BODY_CHARS = 20_000`。`skill` 工具加载一个技能时会返回完整正文，如果技能文档写得极长，就会把上下文挤满。20,000 字符和 `web_fetch` 的默认值一致，是一个「够详尽的说明文档，但不会喧宾夺主」的量级。

**项目文档**：`prompt.rs` 的 `MAX_PROJECT_DOCS = 20_000`。这里处理的是 `AGENTS.md`——全局的一份加上从仓库根目录到工作区沿途的每一份，拼接后的总量受 20,000 字符限制，超了就截断并追加 `… project guidance truncated`。

```rust
const MAX_PROJECT_DOCS: usize = 20_000;
const DOC_NAMES: [&str; 1] = ["AGENTS.md"];
```

拼接顺序是「全局 → 根目录 → … → 工作区」，并用 `canonicalize` 去重（防止符号链接让同一文件被读两次）。这里有个真实的风险：截断是从尾部切的，而排在尾部的正是**最靠近工作区、也最具体**的那份约定。仓库根目录写 15,000 字符、子目录再写 8,000 字符，总长 23,000 超限，被切掉的恰恰是子目录那份的后半部分。更合理的策略是「从工作区往上收集，总量够了就停」，保留最具体的那部分。

技能列表也占预算，但每个技能只有一行，所以影响线性且很小；真正的大头是用 `skill` 工具加载技能时的正文。这个设计是对的：**索引常驻，正文按需拉取**，和 RAG 思路一致，只是索引极简。

## 错误即结果：Err(String) 的另一半价值

工具层的所有失败都用 `Result<String, String>` 表达，错误是字符串。这个决定有三层含义。

第一层是**错误文本是给模型看的**，不是给日志看的。所以每条错误都写成了「出了什么问题 + 该怎么办」：

| 工具 | 错误文本 | 给模型的下一步 |
| --- | --- | --- |
| `read_file` | `… is N bytes (> 4194304); read it in chunks with offset/limit` | 用 offset/limit 分块读 |
| `edit_file` | `` `old_string` not found in … — read the file and match it exactly, including whitespace `` | 先读文件，注意空白 |
| `edit_file` | `` `old_string` occurs 3 times; pass replace_all=true or provide more context `` | 加参数或补充上下文 |
| `grep` | `` no matches for `xxx` `` | 换个词，或确认范围 |
| `skill` | `` unknown skill `x`; available: a, b, c `` | 从可用列表里选 |
| `subagent` | `` unknown sub-agent `x` `` | 换个名字 |
| `git` | `git status exited with 128\n…` | 附带 git 自己的报错 |

`skill` 那条把可用名字都列出来了，`git` 那条把 git 的 stderr 拼进来了。这两条都是「把模型需要的信息放在错误里」，避免了「报错 → 再查一次可用列表 → 再调用」的两轮往返。

第二层是**错误不会中断轮次**。`execute` 把错误包装成工具结果字符串，继续下一轮：

```rust
// tools::dispatch 的 Err 在 run_tool 里被格式化成 `ERROR: {e}`
```

如果工具错误直接冒泡成异常，一次拼错参数就会终止整个任务。做成字符串意味着模型看到 `ERROR: …` 之后可以自己纠正——读文件、改参数、重试。这是 Agent 和普通程序最大的差别之一：**错误是一等输入，不是例外**。

第三层是一个反直觉的推论：错误文本也应该有上限，而现在没有。`clamp` 只作用于 `Ok` 分支。如果某个工具返回一条 100 KB 的错误（比如把整个 `git diff` 当成失败信息返回），它会原样进上下文。实践中没有工具这么做，但「出口只保护成功路径」是一个应该被记住的不对称。

## 审批与确认：哪些工具默认要问

工具的能力和危险程度不成正比。`read_file` 再怎么写也不会毁掉代码；`run_command` 一条 `rm -rf` 就够了。所以工具还要按危险程度分级管控。

`check_tool` 是第一道闸门，任何工具在执行前都要过：

```rust
pub fn check_tool(&self, name: &str) -> Result<(), String> {
    if self.permission_mode.blocked_tools().contains(&name) {
        return Err(format!("tool `{name}` is not available in {:?} mode", self.permission_mode));
    }
    if self.disallowed_tools.iter().any(|t| t == name) {
        return Err(format!("tool `{name}` is disallowed by configuration"));
    }
    if !self.allowed_tools.is_empty() && !self.allowed_tools.iter().any(|t| t == name) {
        return Err(format!("tool `{name}` is not in the allowed list"));
    }
    Ok(())
}
```

顺序有讲究：模式封禁最优先（「当前场景不允许」），然后黑名单（用户明确不要的），最后白名单（只允许这些，属于「收窄」逻辑，只需在前两条都没否掉时判断）。注意被封禁的工具**根本不会出现在工具列表里**（`build_tools` 里的 `retain`），而 `check_tool` 的报错发生在调用时。前者防「模型选错」，后者防「绕过」——如果模型从历史消息里学到一个当前不可用的工具名并尝试调用，会在这里被拦住。

第二道闸门是**执行前的交互确认**，只针对命令类工具：

| 工具 | 默认是否确认 | 依据 |
| --- | --- | --- |
| `run_command` | 按 `approval` 策略 | 命令不可静态分析 |
| `git_commit` | 按 `approval` 策略 | 写历史，但可撤销 |
| `write_file` / `edit_file` / `apply_patch` | 否（除特定模式） | 文件可回滚 |

五种权限模式覆盖了主要场景：

| 模式 | 阻断的工具 | 典型用法 |
| --- | --- | --- |
| `default` | 无 | 日常使用 |
| `accept-edits` | 无（但强制保留 shell 确认） | 信任文件编辑、不信命令 |
| `plan` | `write_file`、`edit_file`、`apply_patch`、`run_command`、`git_commit` | 只读分析 |
| `debug` | `write_file`、`edit_file`、`apply_patch`、`git_commit` | 可以跑命令复现，但绝不改文件 |
| `goal` | 无（且不确认任何操作） | 无人值守 |

`plan` 和 `debug` 的区别很能说明问题：`plan` 连 `run_command` 都禁掉（计划阶段不应该有副作用），`debug` 允许跑命令复现问题，但绝不允许改文件——「不要把已经坏掉的状态弄得更坏」。

这个设计把「工具的能力」和「场景的约束」分开了：工具和 `Ctx` 都不需要知道对方，两者在一个统一的检查函数里汇合。新增工具时只需考虑两件事：名字要不要进某个模式的封禁列表，以及是否需要交互确认。

## 只读工具会跳过哪些目录

`for_each_file` 有一份硬编码的忽略目录列表：

```rust
fn is_ignored_dir(name: &str) -> bool {
    matches!(name,
        ".git" | "target" | "node_modules" | "__pycache__"
        | ".venv" | "venv" | "dist" | "build"
        | ".idea" | ".cache" | ".next" | "vendor"
        | ".tox" | ".mypy_cache" | ".ruff_cache" | ".pytest_cache"
    )
}
```

十五个名字覆盖主流生态的构建产物目录：Rust 的 `target`、Node 的 `node_modules` / `dist` / `build` / `.next`、Python 的 `__pycache__` / `.venv` / `.tox` 与各种缓存、PHP 的 `vendor`、IDE 的 `.idea`。这解决的是很实际的问题：一个中等 Node 项目的 `node_modules` 可能有十万个文件，不跳过的话「全局找一下这个名字」就会遍历十万个第三方文件。硬编码的优点是开箱即用，缺点是遇到列表外的生成目录（`out`、`bin`、`obj`、`.gradle`、`Pods`）只能改代码。

`grep` 和 `glob` 都走 `for_each_file`，共享这份列表；`list_dir` 不走它，所以列目录时能看到 `node_modules`（这通常正是用户想要的）。这个区分是对的：**搜索要过滤，列举要完整**。

## 输出顺序：稳定排序为什么重要

三个工具在返回前会排序，理由都值得记一下。

`list_dir` 把目录和文件分开排序：

```rust
dirs.sort();
files.sort();
```

先输出全部目录再输出全部文件。不排序的话顺序取决于文件系统返回顺序（Linux 上通常是 inode 顺序，看起来是随机的），模型很难判断哪些是主要目录；「目录在前、按字母序」则是人和模型都容易理解的约定。

`glob` 也排序（`matches.sort()`）。`for_each_file` 用栈（`pop` 取最后一个），收集顺序是「深度优先但逆序」，天然是乱的；排序后同一个模式两次调用返回完全一致的顺序，对缓存结果和对比差异都很重要。

`grep` **不**排序：按遍历顺序输出命中行，文件内是行号升序，跨文件是遍历顺序，但结果带 `path:line` 前缀，信息不丢失。不排序的好处是截断发生时被截掉的必然是「遍历靠后」的文件，否则得先收集全部命中才能排序。

三条规则合起来是一个原则：**凡是会「按位置截断」的输出，顺序就决定了什么会被保留**。`list_dir` 不截断，顺序只是可读性问题；`glob` 的顺序决定了 500 个文件里保留哪 500 个；`grep` 的顺序决定了 200 条命中里保留哪 200 条。后者最值得改进——按「路径 + 行号」排序再截断会让输出稳定得多，代价是多占一点内存。

## 工具的隐性成本：token、选择困难与误用

工具不是免费的。每个工具都要在每次请求里带上完整定义，24 个工具大约占 2,500 到 4,000 个 token（取决于描述长度）。按 100 轮对话算，光工具定义就是几十万 token 的输入。

更重要的成本不是钱，是**选择困难**。工具越多，模型选错的概率越高。特别容易混淆的组合有：

| 容易混淆的一对 | 区别 | 缓解手段 |
| --- | --- | --- |
| `write_file` vs `edit_file` | 整体覆盖 vs 精确替换 | `write_file` 描述里写明 `Prefer edit_file for small changes` |
| `edit_file` vs `apply_patch` | 单点替换 vs 多处改动 | `apply_patch` 描述里写明 `instead of edit_file` 与多行场景 |
| `grep` vs `glob` | 搜内容 vs 搜文件名 | 描述里分别用 `file contents` 和 `Find files by` |
| `run_command` vs `task_output` | 执行 vs 收结果 | `run_command` 描述里指明「后台执行后用 task_output 轮询」 |
| `memory_save` vs `todo_write` | 跨会话 vs 会话内 | 两者描述里都强调了各自的持久性范围 |
| `web_fetch` vs `web_search` | 读已知 URL vs 找未知 URL | `web_search` 描述里指明后续用 `web_fetch` |

第三列是最有价值的技巧：**用描述消除歧义，而不是靠模型猜**。每一对容易混淆的工具，至少有一方的描述里出现了另一方的名字。工具集越大，这条越该成为硬性要求。

另一类隐性成本是**能力重叠**：`apply_patch` 能做的 `edit_file` 基本都能做。重复不是错误，它给了模型更多选择，但要求描述足够清楚，否则模型会随手选一个，失败再换另一个试。

## 工具设计八条原则

把上面所有观察收拢，可以提炼出八条可以直接用的规则。

**一、每个输出都必须有上限，且默认生效。** 上限不是「这个工具可能会很长所以加一下」，而是「所有工具都加，然后对确实不会长的工具放宽」。默认安全，而非默认信任。

**二、上限要分层，不能只有一层。** 枚举前过滤（文件体积）、读取时限制（捕获字节数）、产出后裁剪（单行长度）、出口兜底（全局 clamp）。只有出口兜底的话，内存和耗时问题照样发生。

**三、超限必须可见。** 三种语义里，「静默丢弃」只应该用在「提示本身会造成噪音」的场景，且应该有一个计数汇总。模型不知道信息不完整，就会基于不完整信息给结论——这是最贵的失败模式。

**四、错误文本要写「下一步做什么」。** 不是 `file too large`，而是 `read it in chunks with offset/limit`。同理，拒绝要写成指令：`Do not retry it; ask what to do instead`。

**五、拒绝用 `Ok` + 指令，失败用 `Err` + 原因。** 两者对模型意味着完全不同的反应。混在一起会让模型对被拒绝的操作反复重试。

**六、默认值必须覆盖最常见用法，且不能产生危险行为。** `offset: 1`、`limit: 2000`、`timeout: 120`、`max_chars: 20000` 都是「常见且安全」。反过来，如果一个参数的危险值恰好是默认值（比如「默认删除」），设计就错了。

**七、单位要统一，或者明确标注。** 同一个项目里混用字节和字符是源头性混乱，因为它不报错、只让所有容量估算偏离。选一种，写进字段注释。

**八、用描述消除工具之间的歧义。** 每对容易混淆的工具，至少一方的描述里要点名另一方。这是投入产出比最高的一项工作。

还有一条不在这八条里但同样重要：**给相似的两条代码路径写对称的实现**。前台命令和后台任务的排空策略不一致，直接导致了 stderr 死锁。如果写后台任务时把前台的 `run_command` 打开对照一遍，这个问题五分钟就能发现。

## 九个常见陷阱

| 陷阱 | 表现 | 修法 |
| --- | --- | --- |
| 工具输出无上限 | 一次调用就把上下文挤爆，触发压缩 | 出口统一 `clamp` + 每个工具内部封顶 |
| 静默跳过不报数 | 模型把「文件被跳过」当成「没有匹配」 | 统计跳过数量，在末尾汇总一行 |
| 单位混用 | 中文内容的实际容量只有英文三分之一 | 统一字节或统一字符，写进注释 |
| 默认值与上限不匹配 | 请求 2000 行，实际拿到 200 行 | 让默认值贴近真实产出，或在标注里说明 |
| 截断标注算错单位 | 标注 `chars` 实际是字节 | 标注用实际单位，或改成正确计数 |
| 错误没有可行动信息 | 模型重试同一个错误参数 | 错误文本写明下一步动作 |
| 拒绝与失败混同 | 被拒绝的操作被换个写法重试 | 拒绝返回 `Ok` + 停止指令 |
| 只有一条管道被排空 | 命令输出到另一条流时永久阻塞 | 两个流都排空，或用重定向合并 |
| 忽略目录写死 | 项目特有的生成目录无法排除 | 支持配置追加，或至少提供覆盖开关 |

这九个里有四个（静默跳过、单位混用、单位不一致的标注、只有一条管道被排空）不会产生任何报错——它们安静地让工具变差，往往要等到某次具体事故才被发现。这也是「输出预算」这一层值得单独写一篇文章的原因：它是最不可见的一层。

## 怎么验证你的工具真的安全

一套可执行的检查清单，按发现问题的成本从低到高排列。

| 检查 | 方法 | 预期 |
| --- | --- | --- |
| 出口是否有兜底 | 读 `dispatch`（或等价的唯一出口）末尾 | 有统一截断，且对所有工具生效 |
| 每个工具是否自封顶 | 搜所有常量定义 | 每个读/执行类工具都有上限 |
| 单位是否统一 | 对比常量名与实现里的 `len()` / `chars().count()` | 一致，或注释明确 |
| 二进制文件 | 让 Agent 读一个 PNG | 明确报错，而不是返回乱码 |
| 大文件 | 让 Agent 读一个 10 MB 日志 | 报错并提示用 offset/limit |
| 巨型目录 | 让 Agent 列一个有五千文件的目录 | 有上限提示，不是静默截断 |
| 刷屏命令 | 跑一个连续输出 5 分钟的脚本 | 超时被杀，报告说明；内存不涨 |
| 双流阻塞 | 后台跑一个往 stderr 写 1 MB 的命令 | 任务能正常结束（这是最容易漏的一项） |
| 空参数 | 直接调用工具传空字符串 | 明确报错，且报错发生在 IO 之前 |
| 权限模式 | 用 `plan` 模式尝试改文件 | 工具不出现在列表里，直接调用被拒 |
| 审批 | 在默认模式下跑一条危险命令 | 出现确认提示；拒绝后模型不重试 |
| 上限触发 | 临时把 `MAX_MATCHES` 改成 3 | 输出带截断说明，条数正确 |

其中「双流阻塞」是唯一一个几乎必然发现 bug 的检查：写一个每秒往 stderr 打印一行的脚本，用后台模式跑十秒，再 `task_output` 看它能不能结束。如果它永远显示 `running`，就命中了那条死锁。

## 小结：上限是设计，不是补丁

把这篇的结论压缩成五句话：

1. 工具设计有三层：拓扑（有哪些）、形状（怎么调）、预算（回来多少）。前两层决定能不能用对，第三层决定用了之后上下文还在不在。
2. 上限必须分层且默认生效。枚举前过滤、读取时限制、产出后裁剪、出口兜底——四层缺一层，就有对应的资源问题。
3. 超限必须有痕迹。静默跳过是最贵的失败模式，因为它让模型基于不完整的信息自信地下结论。
4. 错误文本是提示词的一部分。写「下一步做什么」，比写「哪里错了」有用得多。
5. 相似路径要对称实现。前台和后台命令的排空策略不一致，直接导致了永久阻塞。

一个 Agent 的工具层，说到底是「把外部世界翻译成模型能消化的文本」的一层。翻译的质量取决于两件事：翻译得准不准（schema 与描述），以及翻译的量可不可控（预算）。绝大多数教程只讲第一件，但线上事故多来自第二件。

NanoHermes 的工具层不完美：`read_file` 不做二进制检测、`grep` 没有文件数上限、后台任务的 stderr 从不读取、`clamp` 的单位标注有误、`glob` 会报「假截断」。但这些缺陷都是可以指认、可以定位、可以逐个修掉的——它们不是「设计上没想到」，而是「实现上漏了一处」。这个差别很重要：前者需要重新架构，后者只需要补一次代码。

下一篇进入 05《Agent 并发：不用 async 运行时怎么并行》。工具解决了「单次拿回多少」，并发要解决的是「一轮里同时做几件事」——同一个哲学用两次，一次用在数据量上，一次用在时间上。
