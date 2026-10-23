---
title: "Agent 观测：给每个轮次记一本账"
slug: agent-observability-turn-ledger
cover_image: /photos/agent-observability-cover.png
date: 2026-11-06
tags: [Agent, Agent 工程, 可观测性, 架构设计]
---

> 适用读者：跑过几天 agent、开始关心「这次任务到底花了多少」的人；被「重启之后成本归零」骗过的人；做过多体、发现子代理的花费无处可查的人
> 结论先行：观测不是往代码里撒日志，而是让每一笔消耗都能落到一行可审计的账上——**谁发起的、做了什么、花了多少、什么时候**。NanoHermes 有观测的零件（`UsageTotals`、`UiEvent::Usage`、任务板的 `duration`），但没有账本：用量只活在进程内存里、三处内部模型调用完全不进账、子代理的花费在数据结构上就没有位置
> 阅读时间：约 60 分钟 | 难度：进阶 | 收获：一份完整的观测面清单 + 五类错账的成因 + 一个可落地的三层账本模型 + 七处加固点

**目录**

- 前言：能打日志，为什么还是答不出「花了多少」
- 结论先行：一本账要有四个字段，错账有三种
- 先把 NanoHermes 的观测面列全
- `UsageTotals`：三个字段与一个接口
- `Copy` 的代价：账本没有共享句柄
- 用量是从响应里抠出来的
- 只读两个字段：缓存与思维链在账上是免费的
- 流式下的用量靠一帧：`include_usage`
- 流断在中途，那一轮的用量一起丢
- 记账点写在 `?` 之后：失败轮次不计入
- 重试与 fallback：一次成功掩盖 N 次请求
- 账本上没有「模型」这个维度
- 三处内部调用完全不进账
- 压缩的账：摘要是一次完整的模型请求
- 记忆提炼的账：每轮收尾的一次隐藏调用
- 子代理的账为什么结构上记不上
- 任务板只有时间没有钱
- `duration` 测的是排队加执行
- 工具调用在账本上是空的
- 终端与 GUI 两套消费者，一个语义漂移
- daemon 的差分记账：`saturating_sub`
- 失败轮次的 token 去了哪里
- 流式 daemon 只有增量，没有总计
- 会话文件里没有账：重启即清零
- `/status` 与 `/cost`：进程级仪表盘
- 唯一可导出的账：json 与 stream-json
- 观测的现状是 `eprintln!`
- 一次委派在日志里串不起来
- 钩子是观测点，但钩子自己不被观测
- 五类错账的失效模式
- 正确的账本模型：三张表
- 五个口径必须先定死
- 一个六十行的 `Ledger`
- 怎么测账本：三条不变量
- 七处可以加固的地方
- 小结：观测的终点是能对账
- 系列收束：八篇讲了一个什么样的 Agent
- 参考

## 前言：能打日志，为什么还是答不出「花了多少」

一个能跑任务的 agent，通常很快就会有三种日志：工具调用的横幅、错误信息、以及「context compacted」这类状态提示。它们都能证明「发生过什么」，但都不能回答三个最基本的问题：

- 这次任务一共发了多少次模型请求，其中几次是重试
- 这次任务烧掉的 token 里，有多少是子代理烧的
- 昨天下午那次跑了四十分钟的任务，成本记在哪个会话上

这三个问题都指向同一件事：**日志是事件流，账本是表**。事件流的每一行都只描述「此刻发生了一件事」，它不负责累加、不负责归属、也不负责跨进程存活。要做账，你得先决定表长什么样。

NanoHermes 在这件事上的状态很典型：它有观测的零件，但没有账本。`UsageTotals` 只有三个字段，`UiEvent::Usage` 只有一种增量语义，任务板只记时间不记钱，而真正花掉大部分 token 的三处内部调用（压缩、记忆提炼、子代理）连一个字都不记。这不是作者疏忽——每个零件单看都够用，问题出在它们没有被同一个数据模型串起来。

本文先把这些零件一个个拆开，看清每个零件的口径；再指出五类错账分别在哪儿发生；最后给一个三层账本模型（turn / span / totals）和七处加固点。08 是这个系列的最后一篇，所以结尾会把八篇收在一起。

## 结论先行：一本账要有四个字段，错账有三种

判断一个 agent 有没有账本，不看它有没有日志，看它能不能对下面四个字段给出答案：

| 字段 | 含义 | NanoHermes 的现状 |
| --- | --- | --- |
| who | 谁发起的这次消耗 | 只有「主代理」一个身份，子代理记不上 |
| what | 做了什么（模型请求、工具、压缩、提炼） | 只有模型请求被计数 |
| how much | token 数、请求数、耗时 | token 有，耗时只在子代理与后台任务上有 |
| when | 发生在哪个会话、哪一轮 | 没有时间戳，也没有 turn id |

缺字段的后果不是「数据不好看」，而是三类具体的错账：

**漏账**：花了但没记。重试的请求、失败的请求、压缩用的那次摘要调用、记忆提炼的调用、子代理内部的全部调用，都属于这一类。

**串账**：记到了别人头上。daemon 用一个 Agent 服务多个会话，用量是进程级累加，靠 `before/after` 差分把某一段切给某个会话；一旦这段里有失败轮次，那部分 token 就既不在前一个请求的账上，也不在后一个请求的账上。

**糊涂账**：记了，但口径不清。`requests` 到底算「HTTP 请求」还是「成功的模型轮次」？`prompt_tokens` 含不含缓存命中？子代理的 token 算不算进主任务？这些没定死，同一个数字两个人能算出两个结论。

三类错账里，漏账最容易修，糊涂账最难修——因为它不是代码问题，是定义问题。下面从零件开始。

## 先把 NanoHermes 的观测面列全

在没有账本之前，可观测的东西其实不少，只是分散在五种载体里：

| 观测面 | 载体 | 粒度 | 粒度内的单位 | 跨进程存活 |
| --- | --- | --- | --- | --- |
| 会话用量 | `Agent::usage` | 进程累计 | token / 请求数 | 否 |
| 单次用量 | `UiEvent::Usage` | 一次模型请求 | 增量 | 即时投递 |
| 对话历史 | `messages` 数组 | 一条消息 | role + content | 是（session 文件） |
| 子代理任务 | `Board::jobs` | 一次委派 | 状态 + 耗时 + 结果预览 | 否 |
| 后台命令 | `TaskManager` | 一个进程 | 状态 + 启动时刻 + 输出 | 否 |
| 错误与提示 | `eprintln!` / `Style::note` | 一行文本 | 无结构 | 否 |

这张表里最值得注意的是最后两列的对比：**唯一跨进程存活的是对话历史，而它是一个纯文本结构**。`save_session_file` 写出去的就是 `messages` 数组，`assistant_message` 只塞 `role`、`content`、`tool_calls` 三样东西，没有时间戳、没有用量、没有 turn id。

换句话说，NanoHermes 的「持久化」和「观测」是两条互不相交的路：能活下来的东西不含账，含账的东西活不下来。

## `UsageTotals`：三个字段与一个接口

整本账的起点是二十行代码：

```rust
/// Cumulative token usage across every model request in the session.
#[derive(Default, Clone, Copy, Debug)]
pub struct UsageTotals {
    pub requests: u64,
    pub prompt_tokens: u64,
    pub completion_tokens: u64,
}

impl UsageTotals {
    pub fn total_tokens(&self) -> u64 {
        self.prompt_tokens + self.completion_tokens
    }
}
```

三个字段，一个派生方法，两种读取方式：

- `Agent::usage()` 返回一份 `UsageTotals` 拷贝，供 `/cost`、`--output-format json`、daemon 的差分使用
- `Style::usage(1, prompt, completion)` 每完成一次请求就投递一次增量，供 GUI 与流式 daemon 使用

`total_tokens` 是加法，看起来无害，但它藏了一个口径问题：当服务端把 `prompt_tokens` 里的一部分算作缓存命中时，`prompt_tokens + completion_tokens` 和账单上的 `total_tokens` 可能不是一回事。这一点后面单说。

## `Copy` 的代价：账本没有共享句柄

`UsageTotals` 派生了 `Copy`。这个选择在单线程记账时很舒服——传参不用引用，读总数不会挡写。但它同时决定了账本的形状：**没有共享句柄，就没有第二个写入方**。

`run()` 拿的是 `&mut self`，所以能写 `self.usage`；而 `run_subagent` 的签名是：

```rust
fn run_subagent(&self, name: &str, task: &str) -> Result<String, String>
```

`&self` 写不了 `self.usage`。子代理在内部跑了一到四十轮模型请求，这些请求的 token 有去无回。想让子代理记账，`UsageTotals` 就不能是 `Copy` 的值，而得变成 `Arc<Ledger>` 这样一个共享句柄，让每个执行路径都能往里加一行。

这就是 08 和前面几篇的分水岭：01 到 07 的共享状态（待办、任务板、限流门）都是为了**协作**；账本的共享是为了**归属**。前者关心「谁能改」，后者关心「改的时候署谁的名」。

## 用量是从响应里抠出来的

用量不是 agent 自己算的，是从服务端响应里读的。`read_json` 在解析完 `choices` 之后补一行：

```rust
turn.usage = usage_from_value(&v);
```

而 `usage_from_value` 的实现只有一个动作——按 key 取值，取不到就当 0：

```rust
pub fn usage_from_value(v: &Value) -> Usage {
    let u = v.get("usage");
    let get = |k: &str| {
        u.and_then(|u| u.get(k))
            .and_then(|x| x.as_u64())
            .unwrap_or(0)
    };
    Usage {
        prompt_tokens: get("prompt_tokens"),
        completion_tokens: get("completion_tokens"),
    }
}
```

「取不到就当 0」是这一整段里最重要的设计决定。它让字段缺失不会炸掉整轮对话——这对兼容各种 OpenAI 风格的端点来说是必要的。但它也意味着**账本无法区分「真的用了 0 个 token」和「服务端没告诉我们」**。测试里那句断言把这个语义写得很清楚：

```rust
// Missing usage (e.g. a stream delta) counts as zero, not an error.
assert_eq!(
    usage_from_value(&json!({ "choices": [] })),
    Usage::default()
);
```

一个能对账的系统，这里应该是一个三态：`Some(0)`、`Some(n)`、`None`。`None` 要单独计数，让「本次任务的用量未知」成为一个可见的事实，而不是悄悄变成 0。

## 只读两个字段：缓存与思维链在账上是免费的

`Usage` 结构只有两个字段：

```rust
pub struct Usage {
    pub prompt_tokens: u64,
    pub completion_tokens: u64,
}
```

对比主流服务端的 `usage` 对象，至少有三类信息被丢掉了：

| 响应字段 | 含义 | 丢掉的后果 |
| --- | --- | --- |
| `total_tokens` | 服务端自己的合计 | 无法校验本地加法与服务端是否一致 |
| `prompt_tokens_details.cached_tokens` | 命中前缀缓存的 token | 缓存省钱这件事在账上看不出来 |
| `completion_tokens_details.reasoning_tokens` | 思维链消耗 | 开 `--thinking` 之后成本涨幅无法解释 |

第三条尤其值得注意，因为 NanoHermes 是有 `--thinking` 的：

```rust
if cfg.thinking {
    body["reasoning_effort"] = "high".into();
}
```

打开思维链之后，`completion_tokens` 会明显上升，但账本里没有任何字段能说明「这里面有多少是推理」。用户看到的只是一个变大的数字，然后去猜是模型变笨了、上下文变长了，还是推理费变贵了。观测的价值恰恰在于把这种猜测变成可查证的事实。

这里也有个反面的公平话：`cached_tokens` 属于 `prompt_tokens_details`，不是所有兼容端点都返回它。读它要写成「有则记、无则标未知」，而不是 `unwrap_or(0)`——后者会把「不支持」伪装成「没命中缓存」，比不记更误导。

## 流式下的用量靠一帧：`include_usage`

非流式请求的用量在响应体里。流式请求里没有响应体——只有一串 `data:` 行，正文是增量 delta，用量通常藏在最后单独一帧。所以 `chat` 会在流式时多要一个参数：

```rust
if cfg.stream {
    // Ask for a trailing usage frame so token counts work while streaming.
    body["stream_options"] = json!({ "include_usage": true });
}
```

对应的解析在 `read_stream`：

```rust
if v.get("usage").is_some() {
    turn.usage = usage_from_value(&v);
}
```

注意这里是「覆盖」而不是「累加」。这是对的：用量帧只有一帧，覆盖即赋值。但它同时暴露了一个隐含假设——**只可能有一帧**。如果某个端点把用量拆成两帧发（比如增量式上报），后一帧会覆盖前一帧，账就少了一半。要稳妥，应该判断 `total_tokens` 是否单调，或者干脆把每帧用量都记进一个 span，让求和发生在账本层。

## 流断在中途，那一轮的用量一起丢

`read_stream` 是整个文件里唯一一处「读失败就整体报错」的地方：

```rust
let l = match l {
    Ok(l) => l,
    Err(e) => return Err(format!("stream read error: {e}")),
};
```

问题在于：`turn` 是函数内的局部变量，`Err` 返回时它被一起丢掉。如果流已经读到第 900 个 chunk、服务端已经算完了 3 万 prompt token，然后在最后一帧之前断开，这一轮的用量就凭空消失了——不仅没进账本，连「有个失败请求花了钱」这件事也不会出现在任何地方。

这是一个「错误路径不携带数据」的经典形状：函数的返回类型是 `Result<AssistantTurn, String>`，`Err` 只能带一句字符串。要保住这部分数据，返回类型得改成 `Result<AssistantTurn, (AssistantTurn, String)>` 之类，或者把 `turn` 通过 `&mut` 传进来，让调用方在失败时仍能看见已经累积的部分。

顺带说一句同文件里的 `truncate`：

```rust
fn truncate(s: &str, max: usize) -> String {
    ...
    format!("{}… ({} bytes truncated)", &s[..end], s.len() - end)
}
```

错误详情被截到 800 字节。这个上限对「别把一整页 HTML 塞进终端」是合理的，但对观测来说意味着：**服务端返回的长错误在账上永远只剩开头**。当你要排查一次诡异的 400 时，被截掉的那段往往才是关键。错误应当按「终端显示截断、账本全文留存」两个口径分别处理。

## 记账点写在错误返回之后：失败轮次不计入

主循环里的记账只有四行，位置很关键：

```rust
let turn = match self.complete() {
    Ok(turn) => turn,
    Err(e) => {
        self.persist();
        return Err(e);
    }
};
self.usage.requests += 1;
self.usage.prompt_tokens += turn.usage.prompt_tokens;
self.usage.completion_tokens += turn.usage.completion_tokens;
```

错误分支在记账之前。`complete()` 返回 `Err` 时，`persist()` 之后直接向上返回，记账那四行一行都不会执行。这意味着整个账本的口径其实是「**成功的模型请求**」，而不是「发生过的模型请求」。

在单人、网络稳定的场景下这个差别很小。但在真实使用里，失败并不罕见：超时、429、5xx、流中断、JSON 形状不对。这些失败大多数不产生计费（429 通常在服务端就被挡住），所以「不计入」在钱上未必错；但它在**可靠性观测**上是错的——你看不出「这次任务重试了 7 次才成功」，也看不出「这个端点的失败率是 30%」。

一个健康的账本应该把「失败的请求」和「失败的轮次」分开记：请求失败但轮次最终成功，是一次重试；轮次最终失败，是一次丢单。两者都要有行，只是 `outcome` 字段不同。

## 重试与 fallback：一次成功掩盖 N 次请求

重试逻辑不在 `agent.rs`，而在 `llm::chat` 里：

```rust
let mut attempt: u32 = 0;
loop {
    match chat_with_model(cfg, build_body(&cfg.model), &mut on_text) {
        Ok(turn) => return Ok(turn),
        Err(e) => {
            if is_retryable_error(&e) && attempt < cfg.max_retries {
                attempt += 1;
                let delay = backoff_ms(cfg.retry_base_ms, attempt);
                eprintln!(
                    "note: request failed ({e}); retrying in {delay}ms (attempt {attempt}/{})",
                    cfg.max_retries
                );
                std::thread::sleep(Duration::from_millis(delay));
                continue;
            }
            if let Some(fallback) = &cfg.fallback_model {
                if is_retryable_error(&e) {
                    eprintln!("note: primary model failed ({e}); retrying with fallback model `{fallback}`");
                    return chat_with_model(cfg, build_body(fallback), &mut on_text);
                }
            }
            return Err(e);
        }
    }
}
```

`chat` 返回的是**最后一次成功**的 `AssistantTurn`，里面只有最后一次请求的用量。前面 `max_retries` 次失败请求的耗时、以及 fallback 模型这次请求，全都没有出现在返回值里。

于是主循环看到的永远是「1 次请求」，账本永远不知道中间发生过三次 503 和一次降级。重试次数唯一的痕迹是那行 `eprintln!`——在终端里滚过去就没了，在 daemon 里直接写进服务端日志，客户端一个字都收不到。

更麻烦的是 fallback：**账本上没有模型维度**。一次请求用的是 `gpt-4o` 还是降级后的 `gpt-4o-mini`，价格可能差十倍，但 `UsageTotals` 只有 token 数。要想算钱，账本的行里必须带 `model` 字段；否则再准的 token 也换不出成本。

## 账本上没有「模型」这个维度

把上一条摊开说。`Config` 里 `--model` 可以在 REPL 里用 `/model` 随时切：

```rust
pub fn set_model(&mut self, model: &str) {
    self.cfg.model = model.to_string();
}
```

子代理还可以用自己的 `def.model` 覆盖：

```rust
let mut sub_cfg = self.cfg.clone();
if let Some(m) = &def.model {
    sub_cfg.model = m.clone();
}
```

同一个 `UsageTotals` 里，可能混着两三个不同模型的 token，而账本上只有一个总数。这就像把人民币、美元、欧元加在一起报一个「总金额」——数字是对的，含义是错的。

修法不复杂：`UsageTotals` 不该是三个标量，而该是 `HashMap<ModelId, Usage>`，或者退一步，每次请求记一行带 `model` 的 span，汇总时再按模型分组。前者的查询快、后者的审计强，选哪个取决于你要的是仪表盘还是账本。对一个要回答「这个月花了多少」的系统，后者更合适——因为价格表会变，历史行必须带当时的模型名。

## 三处内部调用完全不进账

除了主循环，agent 里还有三处会调用模型，三处都不经过 `complete()`：

| 调用点 | 入口函数 | 触发时机 | 账本 |
| --- | --- | --- | --- |
| 上下文压缩 | `summarize_messages` → `llm::summarize` | 超过 12 万字符 | 无 |
| 记忆提炼 | `distill_memories` → `memory::distill` | 每轮收尾且通过门槛 | 无 |
| 子代理 | `run_subagent_inner` → `llm::chat` | 模型调用 `subagent` 工具 | 无 |

它们的共同点是都直接调 `crate::llm::chat`，拿到的 `AssistantTurn` 只取 `.content`，`usage` 被就地丢弃：

```rust
pub fn summarize(cfg: &Config, text: &str) -> Result<String, String> {
    let mut summarizer_cfg = cfg.clone();
    summarizer_cfg.stream = false;
    ...
    let turn = chat(&summarizer_cfg, &messages, &Value::Array(vec![]), |_| {})?;
    Ok(turn.content.trim().to_string())
}
```

这不是「忘了记账」，而是结构上没有地方记：这三个函数都不持有 `&mut Agent`，`UsageTotals` 又是值类型。要让它们记账，只能把账本提升成一个独立对象，作为参数传进去，或者塞进 `Config`（不推荐，配置是只读契约，不该承担可变状态）。

## 压缩的账：摘要是一次完整的模型请求

`compact_with` 的流程值得单独算一笔账：

```rust
let dropped: Vec<Value> = self.messages.drain(1..start).collect();
let note = match self.summarize_messages(&dropped) {
    Some(summary) => format!("[Earlier conversation summary]\n{summary}"),
    None => "[Earlier conversation was omitted to keep the context small]".to_string(),
};
```

把被丢弃的消息原样拼成一个摘录（这里没有逐条截断，只有整个摘要请求的输入），发给模型要一段不超过 300 词的总结。这次请求的 prompt 可能有好几万 token——因为它塞的就是半个上下文。

对一个 40 轮的长任务，压缩可能触发好几次。每次都是一次实打实的大请求，但账本上只多了一行 `context compacted: N older message(s) replaced by a summary` 的 note，没有一个 token。

更微妙的是一笔「看不见的收益」：压缩之后，后续每次请求的 `prompt_tokens` 都会下降。也就是压缩是「一次性花钱、长期省钱」的操作。没有账本，你无法判断这笔投资划不划算——比如压缩花了 3 万 token，省下的后续请求一共省了 2 万，那就是亏的。这个判断完全依赖账本，而现在的账本恰好缺这一块。

## 记忆提炼的账：每轮收尾的一次隐藏调用

`distill_memories` 的门槛是 `worth_distilling`：

```rust
pub fn worth_distilling(user_text: &str, had_tools: bool) -> bool {
    if had_tools {
        return true;
    }
    ...
    text.chars().count() >= 24
}
```

只要这一轮调用过工具，就一定会提炼。提炼的输入是 `excerpt_from(&self.messages, 6000)`——最近 6000 字符的对话；输出是一个 JSON 数组。这次调用同样没有记账，而且它的触发条件是「有过工具调用」，也就是**在大多数真实任务里都会发生**。

所以一个典型的 coding 任务，每轮的模型请求数实际是：

| 来源 | 每轮次数 | 是否计入 `requests` |
| --- | --- | --- |
| 主循环（模型 + 工具往返） | 1 到 40 | 是 |
| 记忆提炼 | 1（有工具调用时） | 否 |
| 上下文压缩 | 0 到若干 | 否 |
| 子代理 | 0 到 4，每个 1 到 40 | 否 |

`/cost` 里显示的 `requests`，可能只有真实请求数的一半。这个偏差不是小数点级别的，是数量级级别的。

## 子代理的账为什么结构上记不上

这是 08 最难的一块，也是 07 结尾留下的引子。

一次委派在 `run_subagent_inner` 里是这样跑的：

```rust
let mut result = String::new();
for _ in 0..sub_cfg.max_iterations {
    let turn = llm::chat(&sub_cfg, &messages, &tools, |_| {})?;
    result = turn.content.clone();
    messages.push(assistant_message(&turn));
    if turn.tool_calls.is_empty() {
        break;
    }
    ...
}
Ok(result)
```

注意三件事：

**第一，子代理最多跑 `sub_cfg.max_iterations` 轮**，而 `sub_cfg` 是从父配置克隆的——默认 40。07 已经指出这是个危险的默认值；从账本角度看，它意味着一次 `subagent` 工具调用背后最多藏着 40 次模型请求，全部不可见。

**第二，`turn.usage` 被就地丢弃**，和压缩、提炼一模一样。

**第三，也是结构性的：整条路径没有返回值能带回用量。** `run_subagent` 的返回类型是 `Result<String, String>`，用量的唯一出口是 `Ok(text)` 里那段文本。想记账只能在文本里塞一行「used N tokens」——那是把账本降级成注释。

正确的形状应该让委派返回一个结构：

```rust
struct Delegation {
    text: String,
    usage: Usage,
    requests: u32,
    elapsed: Duration,
}
```

然后由父代理在收口处把它记成一行 `who = agent-7` 的子账，再决定怎么汇总。这样 `agent_list` 才能回答「哪个子代理最贵」，而不只是「哪个子代理最慢」。

## 任务板只有时间没有钱

`Job` 的字段是：

```rust
pub struct Job {
    pub id: String,
    pub name: String,
    pub task: String,
    pub status: JobStatus,
    pub result: String,
    /// Wall-clock time the job took, once it has finished.
    pub duration: Option<Duration>,
    started: Instant,
}
```

七个字段里，只有 `duration` 是「量」，`result` 是截到 500 字符的预览，其余都是标识与状态。没有 `usage`，没有 `requests`，也没有 `model`。

`render_agent_board` 的输出也因此只能是：

```text
Sub-agent jobs:
- agent-1 [done] reviewer (12.3s) — review auth.rs
  result: looks fine
- agent-2 [running] explorer (…) — map the repo
```

这份输出对「谁在干什么」够用，对「这次任务的钱花在哪」完全不够。07 说过任务板是「一个只追加的观测结构」；从账本的角度看，它更像一个**只记了时长的事件表**——事件表能还原顺序，但不能求和。

## `duration` 测的是排队加执行

`Board::start` 里设置了 `started`：

```rust
self.jobs.lock().unwrap().push(Job {
    id: id.clone(),
    ...
    duration: None,
    started: Instant::now(),
});
```

而 `run_subagent` 的调用顺序是：

```rust
let id = self.ctx.board.start(name, task);
let _permit = self.ctx.gate.acquire();
let result = self.run_subagent_inner(name, task);
```

登记的时机在 `acquire` 之前。所以 `finish` 里算出来的 `duration` 是 `job.started.elapsed()`——**包含排队时间**。

这件事在 07 里是用「排队也显示 running」来讲的；在 08 里它变成一条账本口径问题：如果一次委派排队等了 20 秒、真正执行了 3 秒，账上写的是 23 秒。这个数字用来判断「子代理慢不慢」是错的，因为它把限流门的等待算进了子代理的工作时间。

修复的方式在 07 的加固清单里已经写过：`JobStatus` 加 `Queued`，`duration` 拆成 `queued` 与 `ran` 两段。对账本来说，这不仅是显示问题——**排队时间是「被配额拖住」的证据**。如果你发现某天平均排队 15 秒，那说明 4 个槽位不够，而不是模型变慢了。这两者要分开记，才能分别对症。

## 工具调用在账本上是空的

`execute` 从头到尾没有一个 `Instant`：

```rust
fn execute(&self, call: &llm::ToolCall) -> String {
    if let Err(reason) = self.cfg.check_tool(&call.name) {
        return format!("ERROR: {reason}");
    }
    ...
    let mut result = self.run_tool(&call.name, &args);
    ...
    result
}
```

结果回到主循环之后，只做了一件事：

```rust
self.style.tool_call(&call.name, &summarize(&call.name, &call.arguments), &result);
```

也就是说，一次工具调用在账本上留下的信息是「名字 + 参数摘要 + 结果文本」，没有开始时刻、没有耗时、没有输出字节数。而工具恰恰是 agent 里最不可控的一段：`run_command` 可能跑满 120 秒超时，`web_fetch` 可能卡在网络，`grep` 可能在几十万个文件里扫。

链路上其实有 `Instant`，但都只为超时服务：`shell::run_command` 的 `start` 用来判断是否超过 `timeout_secs`，`hooks::run` 的 `start` 用来判断是否超过 `HOOK_TIMEOUT_SECS`。超时判断是「到点就杀」，它不需要、也不保留「实际用了多久」。

一个能对账的工具记录应该长这样：

| 字段 | 用途 |
| --- | --- |
| name | 哪个工具 |
| start_ms / end_ms | 什么时候、多久 |
| args_bytes | 参数多大 |
| result_bytes / truncated | 结果多大、有没有被 `clamp` 截断 |
| exit_code | 命令类工具的成功失败 |
| tool_call_id | 与消息历史里的调用配对 |

其中 `truncated` 特别值得记：`clamp` 把超长输出截到 20000 字符，这是 04 讲过的预算设计。但从账本看，「这次工具输出被截了多少」是判断「工具设计是否合理」的关键指标——如果一个工具的输出连续十次被截断，说明它的输出粒度太粗，该改工具而不是改预算。

## 终端与 GUI 两套消费者，一个语义漂移

`UiEvent::Usage` 的注释是这样写的：

```rust
/// Cumulative token usage after a model request, so a GUI can show what the
/// task has cost so far. `requests` counts the model calls this update added
/// (normally 1), so a client showing a per-task total simply sums the values
/// it receives — which also works when the numbers come from a shared daemon.
Usage {
    requests: u64,
    prompt_tokens: u64,
    completion_tokens: u64,
},
```

第一行说「Cumulative（累计）」，最后一行说「客户端把这些值加起来」，也就是「增量」。同一段注释里出现了两个相反的口径。实际发送方是主循环：

```rust
self.style.usage(1, turn.usage.prompt_tokens, turn.usage.completion_tokens);
```

第一个参数硬编码为 `1`，所以**实现是增量**，注释的头一行是错的。

这种漂移在只有一两个消费者时不会出事，但它是「糊涂账」的种子：下一个接这个事件的人如果按「累计」理解，就会把最后一次的值当成总数，得到一个偏小的结果，而且看不出错在哪。

顺带一提终端的行为：`Style::usage` 在终端模式下什么都不打印——

```rust
pub fn usage(&self, requests: u64, prompt_tokens: u64, completion_tokens: u64) {
    self.emit(UiEvent::Usage { ... });
}
```

`emit` 在没有 sink 时返回 `false`，函数就结束了。注释里说「终端已经有 `/cost`」，这个理由成立，但它意味着**终端的实时观测能力为零**：你只能在轮次结束后敲一次 `/cost`，中间发生了什么完全看不见。一个跑 20 分钟的轮次，中途没有任何用量反馈。

## daemon 的差分记账：`saturating_sub`

daemon 用一个 Agent 服务多个会话。因为 `usage` 是进程级累加，单个请求的用量只能靠前后差分：

```rust
let before = agent.usage();
let result = agent.run(user_content(&prompt, &images));
let after = agent.usage();

let resp = match result {
    Ok(response) => json!({
        "response": response,
        "session": session_id,
        "usage": {
            "requests": after.requests.saturating_sub(before.requests),
            "prompt_tokens": after.prompt_tokens.saturating_sub(before.prompt_tokens),
            "completion_tokens": after.completion_tokens.saturating_sub(before.completion_tokens),
            "total_tokens": after.total_tokens().saturating_sub(before.total_tokens()),
        }
    }),
    Err(e) => json!({ "error": e, "session": session_id }),
}
```

`saturating_sub` 是个体贴的细节：万一计数回绕或被人为清零，订单不会变成天文数字。差分法本身在串行服务下也是对的——daemon 一次只处理一个请求，两个快照之间不会有别的写入。

但它有一个前提：**这两个快照之间发生的所有增长都属于这一次请求**。这个前提在 `compact`、`distill`、`subagent` 也记账之后会立刻失效（因为它们也在这段时间里，但那确实属于这个请求，所以还算对）；真正失效的场景是并发——只要哪天 daemon 改成多线程处理，差分就把别人的账算到你头上。

差分法真正的问题在下一节。

## 失败轮次的 token 去了哪里

看 `Err` 分支：只返回 `{"error", "session"}`，**没有 `usage` 字段**。

而失败之前，`agent.usage` 已经涨过了——凡是成功返回的模型请求都已经累加进去了（失败的那一次因为 `?` 没记）。于是这一段增长：

- 不在本请求的响应里（因为响应没带 usage）
- 也不在下一个请求的响应里（因为下一个请求的 `before` 是在这段增长之后取的）
- 只在进程总量里，而进程总量没有任何接口能按会话查

结果就是：**失败轮次烧掉的 token 变成了一笔无主账**。它存在于内存里的某个计数器上，但没有任何一条响应、任何一个文件、任何一次 `/cost` 能把它归到某个会话。

修法有两种，各有取舍：

| 做法 | 优点 | 缺点 |
| --- | --- | --- |
| 失败响应也带 `usage` | 改动最小，账不丢 | 客户端要处理「有 usage 也有 error」的组合 |
| 账本按 turn 行记账 | 任何结果都有行，可审计 | 需要引入账本对象，改动面大 |

第一种是「补丁」，第二种是「重建」。如果你只想知道钱去哪了，第一种够用；如果你想回答「这个会话一共失败了几次、失败花了多少钱」，只有第二种能给你。

## 流式 daemon 只有增量，没有总计

`stream_turn` 走的是另一条路。它装上 sink，让 `UiEvent::Usage` 直接写成 NDJSON 行：

```rust
UiEvent::Usage { requests, prompt_tokens, completion_tokens } => json!({
    "type": "usage",
    "requests": requests,
    "prompt_tokens": prompt_tokens,
    "completion_tokens": completion_tokens,
}),
```

然后收尾时写一行 `done`：

```rust
Ok(response) => write_event(
    &out,
    &json!({ "type": "done", "response": response, "session": session_id }),
),
```

`done` 行里**没有累计用量**。客户端要自己把前面收到的所有 `usage` 行加起来——这恰好是 `UiEvent` 注释里承诺的用法，所以不算错，但它把「求和」这件事推给了每一个客户端。三个客户端就得写三遍求和，其中两个可能写错。

更麻烦的是错误路径：

```rust
Err(e) => write_event(&out, &json!({ "type": "error", "error": e })),
```

一个跑到第 5 轮才失败的流式任务，客户端拿到了 5 行 usage、1 行 error，没有总计。如果客户端是「收到 done 才记账」的实现，这 5 行的花费就丢了；如果它边收边记，那它记的是「部分用量」，而它无从知道这是部分。

一个更稳的协议是让 `done` 和 `error` 都带 `total_usage`——这样客户端只需要在两种终结行上读同一个字段，中间行纯属进度展示。**终结行是对账的唯一锚点**，这句话值得写进任何 agent 的协议设计里。

## 会话文件里没有账：重启即清零

`persist()` 的内容是：

```rust
fn persist(&self) {
    if let Some(path) = &self.session {
        if let Err(e) = save_session_file(path, &self.messages) {
            eprintln!("warning: could not save session {}: {e}", path.display());
        }
    }
}
```

`save_session_file` 写的就是 `messages` 的 pretty JSON。没有 header，没有 meta，没有用量。

而 `Agent::with_mcp` 构造时：

```rust
Agent {
    ...
    usage: UsageTotals::default(),
}
```

即使 `--session` 加载了昨天的对话，`usage` 也是从零开始。于是 `agent -c` 之后敲 `/cost`，看到的是「本次进程的用量」，而不是「这个会话的用量」。任务连续跑了三天、每天重启一次，账本每天清零三次。

这个坑在单人使用时不容易被发现，因为你会默认「今天这次任务」就是「这个进程」。但只要有 `-c`、有 daemon 的多会话、有 GUI 的「继续上次任务」，这个假设就破了。

修法很直接：会话文件从「messages 数组」升级成「带 meta 的对象」：

```json
{
  "version": 2,
  "messages": [ ... ],
  "usage": { "requests": 12, "prompt_tokens": 34000, "completion_tokens": 5100 },
  "turns": [ ... ]
}
```

代价是向后兼容：旧文件是裸数组，新代码读到数组要当成「v1，无账」处理。`load_session_file` 现在只接受数组：

```rust
let arr = v
    .as_array()
    .ok_or_else(|| "session file does not contain a JSON array".to_string())?;
```

改的时候要同时接受对象形态，否则所有老会话都会加载失败——而加载失败会退回默认消息，用户会以为「历史丢了」。

## `/status` 与 `/cost`：进程级仪表盘

两个 REPL 命令，一个是身份卡，一个是计数器：

```text
> /status
  messages: 42
  model:    claude-sonnet-4
  mode:     default
  format:   text
  tools:    24
  workspace: /home/me/project

> /cost
  requests:          18
  prompt tokens:     214,033
  completion tokens: 12,880
  total tokens:      226,913
```

`/status` 五行里没有一行是「量」——`messages` 是结构大小，不是消耗。`/cost` 四行是纯计数，没有时间、没有按模型拆分、没有按来源拆分（主循环 / 压缩 / 提炼 / 子代理）。

这两个命令合起来，能回答「现在是什么状态」和「这堆数字是多少」，但回答不了「钱花在哪」。仪表盘和账本的区别就在这里：仪表盘告诉你当前值，账本告诉你每一笔的来龙去脉。

## 唯一可导出的账：json 与 stream-json

真正能拿去做二次处理的，只有 `--output-format json` 的收尾块：

```rust
config::OutputFormat::Json => {
    let u = agent.usage();
    let out = json!({
        "response": response,
        "usage": {
            "requests": u.requests,
            "prompt_tokens": u.prompt_tokens,
            "completion_tokens": u.completion_tokens,
            "total_tokens": u.total_tokens(),
        }
    });
    println!("{}", serde_json::to_string_pretty(&out).unwrap_or_default());
}
```

这是整个项目里唯一一份「结构化、可管道、可入库」的账。它有三个局限：

- 只有一次 one-shot 的账，没有按轮拆分
- 只有三个原始计数，没有来源、模型、时间
- 只在 `Json` / `StreamJson` 两种格式下存在，默认的 `Text` 什么都没有

但它的方向是对的：**把账做成数据，而不是做成打印**。想再往前一步，不需要加字段，只需要把 `usage` 从三个标量改成一组行：

```json
{
  "response": "...",
  "turns": [
    { "turn": 1, "who": "main", "model": "claude-sonnet-4", "requests": 3,
      "prompt_tokens": 18200, "completion_tokens": 940, "ms": 4210 }
  ],
  "usage": { "requests": 3, "prompt_tokens": 18200, "completion_tokens": 940 }
}
```

外层 `usage` 保留，是为了不让现有消费者（脚本、`jq` 管道）断掉；`turns` 是新账，供需要审计的人用。这种「加字段不改语义」的演进方式，比推倒重来安全得多。

## 观测的现状是 `eprintln!`

`agent/src` 里一共三十多处 `eprintln!`，光 `main.rs` 就有 28 处。它们大致分成四类：

| 类别 | 例子 | 有没有结构 |
| --- | --- | --- |
| 启动配置 | `sub-agents: loaded 3 from ...`、`MCP: loaded 12 tool(s)` | 无 |
| 请求重试 | `note: request failed (...); retrying in 500ms (attempt 1/2)` | 半结构化（人可读） |
| 会话读写 | `warning: could not save session ...` | 无 |
| daemon 错误 | `daemon request error from 1.2.3.4: ...` | 无 |

它们都写 stderr，没有级别、没有时间戳、没有 trace id、没有 JSON 形态。这意味着：

- 想做「最近一小时的失败率」，只能全文 grep
- 想关联「这个错误属于哪个请求」，只能靠时间先后猜
- 想在 GUI 里展示「服务端刚重试了一次」，做不到——`eprintln!` 不会进 sink

最后一条最可惜：`Style` 已经有一套完整的 `UiEvent` 通道了，`warn` / `note` 都能投递到 GUI，但 `llm::chat` 不持有 `Style`，重试只能打印。于是「终端能看到重试、GUI 看不到」——同一次请求，两套客户端看到的信息量不同。

## 一次委派在日志里串不起来

假设你看到日志里有三行：

```text
sub-agents: loaded 2 from subagents.json
note: request failed (HTTP 503 from API: ...); retrying in 1000ms (attempt 1/2)
sub-agent `reviewer` finished in 41.2s
```

你能确定这三行属于同一次委派吗？不能。第二行可能来自主代理，也可能来自另一个子代理；第一行是启动期，第三行甚至不存在——因为子代理完成时根本不打印。

能串起一条链路的东西应该是一个 id，从发起到结束一路传下去：

| 层 | 现在有什么 | 缺什么 |
| --- | --- | --- |
| 会话 | `session_id`（仅 daemon） | — |
| 轮次 | 无 | `turn_id` |
| 委派 | `agent-7`（仅在任务板内） | 进日志 |
| 请求 | 无 | `request_id` |
| 工具 | `tool_call_id`（仅消息历史） | 进日志 |

有意思的是，`tool_call_id` 是有的——`assistant_message` 把它写进了消息，`execute` 拿到的 `ToolCall` 也带着它。但它从来没有出现在任何一行日志里。数据不缺，缺的是把它带出去的那一步。

对钩子来说这条链更值得补。钩子能拿到 `NANOHERMES_TOOL_NAME` 和 `NANOHERMES_HOOK_EVENT`：

```rust
.env("NANOHERMES_TOOL_NAME", tool)
.env("NANOHERMES_HOOK_EVENT", event)
```

07 已经指出缺 `NANOHERMES_AGENT`，所以钩子分不出父子。同一个问题在观测上的版本是：钩子分不出「这是本轮第几次调用同一个工具」，于是它没法做「同一个文件被改第三次就告警」这类策略。

## 钩子是观测点，但钩子自己不被观测

钩子的返回值只有两个字段：

```rust
pub struct HookOutcome {
    /// Process exit code (`-1` if killed by a signal, `-2` if we timed it out).
    pub code: i32,
    /// Combined stdout + stderr, trimmed.
    pub output: String,
}
```

调用方拿它做两件事：`ok()` 判断是否放行，失败时把 output 拼进 tool result 字符串。然后——就没有然后了。

这意味着：

- 一个钩子每天跑 500 次、其中 200 次超时，账本上看不出来
- 一次 30 秒超时的钩子会让一整轮变慢 30 秒，但耗时不属于任何统计
- 钩子阻断了一整次工具调用（`PreToolUse` 返回非 0 时 `execute` 直接返回 ERROR），这次「被拦下」的调用不计入任何指标

`HOOK_TIMEOUT_SECS` 是 30 秒，这个值本身是个观测信号：它意味着单个钩子最长能把一轮拖慢 30 秒，而 `max_iterations` 是 40，最坏情况是 40 × 30 秒 = 20 分钟纯粹耗在钩子上。

一个把钩子当观测点的设计，应该把钩子本身也记成 span：`event`、`tool`、`exit_code`、`ms`、`timed_out`。这样「钩子是不是拖慢了我的 agent」才是一个能查的问题。

## 五类错账的失效模式

把前面拆出来的问题收成一张表，方便对照自己的实现：

| 错账类型 | 具体表现 | 根因 | 后果 |
| --- | --- | --- | --- |
| 漏账·失败 | 请求失败不计入 | 记账点在 `?` 之后 | 失败率不可见、重试不可见 |
| 漏账·内部调用 | 压缩 / 提炼 / 子代理不进账 | 直接调 `llm::chat`，没有账本句柄 | `requests` 只有真实值的一半 |
| 漏账·流中断 | 流读到一半失败，用量一起丢 | `Err` 只带字符串 | 大请求的花费凭空消失 |
| 串账·差分 | 失败轮次 token 无主 | 进程级累计 + 差分切分 | 成本永久挂空 |
| 糊涂账·口径 | 注释说累计、实现是增量 | 文档与代码漂移 | 客户端汇总结果偏小 |
| 糊涂账·维度 | 多模型混在一个总数里 | 账本只有三个标量 | 有 token 也算不出钱 |
| 糊涂账·时序 | 排队时间算进执行时间 | `started` 在 `acquire` 之前 | 误判「子代理慢」 |

七条里有四条属于「结构上没有位置记」，两条属于「口径没定死」，一条属于「错误路径不携带数据」。这三类问题的修法完全不同：

- 结构问题要引入账本对象，改的是数据流
- 口径问题要写文档和测试，改的是约定
- 错误路径问题要改返回类型，改的是函数签名

先分类再动手，比一上来就加日志有效得多——因为加日志解决不了后两类。

## 正确的账本模型：三张表

一个够用的 agent 账本，三张表就够。它们不是数据库表，是内存里的三个结构，但字段要按表来设计。

**第一张：turn 表**，一次 `run()` 一行。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| turn_id | u64 | 单调递增，进程内唯一 |
| session_id | String | daemon 的会话标识，CLI 用默认值 |
| who | Who | Main / SubAgent(id) / Compact / Distill |
| started_ms / ended_ms | u128 | 墙钟时间，用于算时长与对齐日志 |
| requests | u32 | 发起过多少次请求（含失败） |
| retries | u32 | 其中重试了多少次 |
| usage | Usage | prompt / completion / cached / reasoning |
| outcome | Ok / Interrupted / IterLimit / Error(String) | 轮次终态 |

**第二张：span 表**，一次外部交互一行（模型请求或工具调用）。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| span_id | u64 | 自增 |
| turn_id | u64 | 外键，指回 turn 表 |
| parent | Option<u64> | 子代理的 span 挂在发起它的工具调用下 |
| kind | Model / Tool / Hook | 三类 |
| name | String | 工具名或模型名 |
| model | Option<String> | 模型请求才有 |
| start_ms / end_ms | u128 | 单次耗时，不受排队污染 |
| usage | Option<Usage> | 失败时记「已累积的部分」 |
| status | Ok / Failed(String) | 失败也留行 |

**第三张：totals 视图**，不是表，是对前两张的聚合：

```text
按 who 聚合：主代理 X token / 子代理 Y token / 内部调用 Z token
按 model 聚合：模型 A n 次 m token / 模型 B ...
按 kind 聚合：模型请求耗时 / 工具耗时 / 钩子耗时
```

三张表的关系是 `turn 1 → N span`，与 open tracing 的 trace/span 同构。之所以要分成 turn 和 span 两层，是因为这两层的语义不一样：turn 是「用户感知到的一次操作」，span 是「系统内部的一次外部依赖」。用户问「这次任务花了多少」问的是 turn，运维问「哪个工具最慢」问的是 span。

顺带说一句存储。账本要不要落盘，取决于你要回答的问题：

| 需求 | 存储方案 | 代价 |
| --- | --- | --- |
| 重启后还能看会话成本 | 追加写到会话文件旁边 | 写放大、需要轮转 |
| 跨会话统计 | SQLite 一行一个 span | 引入依赖 |
| 只想看当前进程 | 内存够了 | 重启即丢 |

NanoHermes 现在的选择是第三条，这是它「低依赖」哲学的一部分。所以本文的重点不是「它应该上一个数据库」，而是「它的内存账本连内存里该有的行都没记全」。

## 五个口径必须先定死

账本做完之后，最容易吵起来的不是实现，是定义。下面五个口径，必须在写第一行代码之前定死，并且写进文档和测试。

**一、`requests` 算 HTTP 请求还是成功的模型轮次？**
建议：分开两个字段，`requests` 算所有发出的请求（含失败与重试），`successful` 算成功的。否则「重试」这个事实没有位置放。

**二、`prompt_tokens` 含不含缓存命中的部分？**
建议：结构上拆成 `prompt_tokens` 与 `cached_tokens` 两个字段，且 `cached_tokens` 允许为「未知」。含不含取决于服务端口径，本地不要替它猜。

**三、子代理的 token 算不算进主任务的账？**
建议：算，但要能分开看。turn 表里父 turn 的 `usage` 是自身 + 子 span 之和，同时每个子代理有自己的 span，可以单独出报表。这就是「可加性」：父 = 自身 + 子之和，永远成立。

**四、重试的失败请求算不算 token？**
建议：算，但单独标 `unbilled`。大多数 429 不计费，但客户端不应该假设这一点——服务端说了算。

**五、时间算不算排队？**
建议：不算。排队时间单独记 `queued_ms`。这是 07 那条加固建议在观测侧的对应物。

五个问题里，前四个都跟「token」有关，只有最后一个跟「时间」有关。这不是巧合：token 是计费单位，时间是体验单位，两者都要，但不能混在一个字段里。

## 一个六十行的 `Ledger`

如果现在就要动手，最小的可用账本大约是这样：

```rust
use std::sync::Mutex;
use std::time::{Duration, Instant};

#[derive(Clone, Copy, Debug, Default)]
pub struct Usage {
    pub prompt_tokens: u64,
    pub completion_tokens: u64,
    /// None 表示服务端没有报告，而不是 0。
    pub cached_tokens: Option<u64>,
}

#[derive(Clone, Debug)]
pub enum Who {
    Main,
    SubAgent(String), // agent-7
    Compact,
    Distill,
}

#[derive(Clone, Debug)]
pub struct TurnRecord {
    pub turn_id: u64,
    pub who: Who,
    pub model: String,
    pub requests: u32,
    pub retries: u32,
    pub usage: Usage,
    pub elapsed: Duration,
    pub outcome: String, // ok / interrupted / iteration-limit / error:...
}

/// 账本只增不改；所有执行路径共享同一个 Arc<Ledger>。
#[derive(Default)]
pub struct Ledger {
    inner: Mutex<Vec<TurnRecord>>,
}

impl Ledger {
    pub fn record(&self, rec: TurnRecord) {
        self.inner.lock().unwrap().push(rec);
    }

    pub fn snapshot(&self) -> Vec<TurnRecord> {
        self.inner.lock().unwrap().clone()
    }

    /// 父账 = 自身 + 子账之和，这条不变量在测试里断言。
    pub fn totals(&self) -> Usage {
        let all = self.inner.lock().unwrap();
        Usage {
            prompt_tokens: all.iter().map(|r| r.usage.prompt_tokens).sum(),
            completion_tokens: all.iter().map(|r| r.usage.completion_tokens).sum(),
            cached_tokens: if all.iter().all(|r| r.usage.cached_tokens.is_some()) {
                Some(all.iter().filter_map(|r| r.usage.cached_tokens).sum())
            } else {
                None
            },
        }
    }
}
```

关键在于三处：

- `Usage.cached_tokens` 是 `Option<u64>`，把「未知」和「0」分开
- `Who` 是个枚举，子代理的账有身份，不是匿名的
- `record` 只追加，没有「更新某一行」的接口——失败的行也要留在里面

把它接到 agent 上，改动点只有四个：`Run` 里给每次 `complete()` 记一行、`summarize` / `distill` 各记一行、`run_subagent_inner` 结束时记一行、`persist` 时把账本序列化进会话文件。四处加起来不到四十行。

真正的工作量不在代码，在把 `Ledger` 从 `&self` 能拿到的地方传下去。`run_subagent` 拿的是 `&self`，所以 `Ledger` 必须是 `Arc`，且内部用 `Mutex`——这与 `Board`、`Gate` 的模式一致，NanoHermes 已经有这个习惯了。

## 怎么测账本：三条不变量

账本的正确性没法靠「看着对」来验证，得靠不变量。三条就够：

**一、求和一致。** 所有 span 的用量之和等于 totals。这条能抓住「记了但没汇总」和「汇总时漏了一类」。

```rust
#[test]
fn totals_equal_the_sum_of_every_span() {
    let ledger = Ledger::default();
    ledger.record(turn(1, Who::Main, 100, 20));
    ledger.record(turn(2, Who::Compact, 5000, 100));
    ledger.record(turn(3, Who::SubAgent("agent-7".into()), 800, 40));
    assert_eq!(ledger.totals().prompt_tokens, 5900);
}
```

**二、父子可加。** 父 turn 的用量等于「自身 + 所有子 span」。这条能抓住「子代理的钱记了但没挂到父上」。

**三、失败也有行。** 构造一个必定失败的请求（比如 mock 服务端返回 500），断言账本里有一行的 `outcome` 是错误、且 `requests` 大于零。这条能抓住本文最关心的那类漏账。

第三条最有价值，因为它反过来要求你把失败路径的用量带出来——也就是前文说的「改返回类型」。测试先行会逼着结构改对。

顺带说一句：这三条都不需要真实 API。用一个返回固定 JSON 的本地模拟端点就行，`agent/tests/e2e_mock_llm.rs` 已经有这个基础设施了，加几个账本断言是顺手的事。

## 七处可以加固的地方

按投入产出比排序。

**一、把记账移到 `?` 之前。** 最小改动：先记「发出了一次请求」，成功后再补 token。这样失败也有行，`requests` 变成「真实发出数」，`successful` 另计。三行代码，消除最基础的漏账。

**二、让 `Usage` 带上 `cached_tokens: Option<u64>` 与 `reasoning_tokens: Option<u64>`。** 两个 `Option` 字段，`usage_from_value` 多读两行。从此「缓存省钱」和「推理费钱」可查。

**三、把 `summarize` / `distill` / `run_subagent_inner` 的 `turn.usage` 收起来。** 三处各加一行记录，前提是先有 `Ledger`。这是「requests 只有一半」这个偏差的唯一解。

**四、`run_subagent` 返回结构体而不是 `String`。** `Delegation { text, usage, requests, elapsed }`，板上的 `Job` 同步加 `usage` 字段。`agent_list` 于是能显示「最贵的子代理」。

**五、会话文件升级到带 meta 的对象。** 加载时兼容裸数组（当 v1 处理），保存时写 v2。这一条让 `-c` 之后的 `/cost` 不再是零。

**六、把重试与降级从 `eprintln!` 挪进事件通道。** `llm::chat` 加一个回调（或者把 `Style` 传进来），重试时发一个 `UiEvent::Note`。终端与 GUI 从此看到同样的信息，日志也能进账本。

**七、`done` 与 `error` 两种终结行都带 `total_usage`。** 一行协议改动，让所有流式客户端不用自己求和，也不会在失败时丢掉部分用量。

前三条是「补漏」，第四、五条是「建结构」，第六、七条是「统一口径」。如果只能做一条，做第一条；如果能做三条，做一、五、七——它们分别覆盖漏账、串账、糊涂账各一类。

## 小结：观测的终点是能对账

把 08 压成三句话。

**第一，日志和账本不是一回事。** 日志是事件流，回答「发生了什么」；账本是表，回答「谁花了多少」。NanoHermes 有前者（三十多处 `eprintln!`、一套 `UiEvent`），但没有后者——`UsageTotals` 三个标量活在进程内存里，重启即清零。

**第二，漏账不是因为忘了写，是因为结构上没有位置。** 压缩、提炼、子代理三处内部调用都直接调 `llm::chat`，都没有 `&mut Agent`，`UsageTotals` 又是 `Copy` 值。要让它们记账，得先把账本从「一个字段」升级成「一个共享对象」。这和 07 的结论是同一件事的两面：共享状态要有归属，归属要有地方写。

**第三，观测的价值在于能对账，不在于能打印。** 一个能回答「这次任务花了多少、花在哪、为什么失败」的系统，不需要很花哨的 UI，只需要每一笔消耗都有一行带 who / what / how much / when 的记录，且这行能活过进程重启。

写这个系列的过程中，我反复回到同一个判断标准：**一个 agent 的工程质量，取决于它把哪些东西当成了一等公民**。01 把循环当成一等公民，02 把上下文预算当成一等公民，03 把记忆的写入与检索当成一等公民，04 把输出上限当成一等公民，05 把线程与配额当成一等公民，06 把权限闸门当成一等公民，07 把责任边界当成一等公民。08 想说：**账本也该是一等公民**——不是事后加的日志，而是从第一天就参与数据流的结构。

## 系列收束：八篇讲了一个什么样的 Agent

八篇拆的是同一个项目 `NanoHermes`，但每篇都在回答一个更一般的问题：

| 篇号 | 标题 | 拆的是什么 | 留下的判断标准 |
| --- | --- | --- | --- |
| 01 | Agent 的本质：一个两百行的循环 | 主循环、消息状态、并发、中断 | 循环之外没有第二套系统 |
| 02 | Agent 上下文：留什么，丢什么 | 压缩、摘要、输出上限 | 上下文是工作集，不是仓库 |
| 03 | Agent 记忆：不接向量库也能长期记忆 | 本地检索、注入、沉淀 | 记忆是索引，不是存储 |
| 04 | Agent 工具设计：为什么输出都要有上限 | Schema、错误语义、截断 | 工具的边界就是 Agent 的边界 |
| 05 | Agent 并发：不用 async 运行时怎么并行 | 作用域线程、门控 | 并发是预算问题，不是语法问题 |
| 06 | Agent 安全：让它跑命令而不失控 | 审批、沙箱、钩子 | 闸门要在执行层，不在清单层 |
| 07 | Agent 多体：子代理、任务板与限流 | 委派、并发门、任务板 | 共享必须有归属 |
| 08 | Agent 观测：给每个轮次记一本账 | 用量、日志、可观测性 | 观测的终点是能对账 |

如果把这八篇再压成一句：**一个可靠的 agent，是在循环、上下文、记忆、工具、并发、安全、多体、观测这八个方向上，都做了显式取舍的系统。** 每个方向都有一个「默认值会害你」的地方——默认不压缩上下文、默认信任工具输出、默认共享状态、默认用日志代替账本。NanoHermes 的价值不在于它每个方向都做对了，而在于它的取舍是**可读的**：两百行主循环、一个 `memory.json`、三十行限流门、三个标量的账本——每一处都能在半小时内读完，然后你就能指出它哪里会坏。

这也解释了为什么这个系列几乎每篇都以「七处可以加固的地方」结尾。不是为了让读者去改 NanoHermes，而是想说明一件事：**看懂一个系统最有效的方式，是找出它在什么条件下会失效。** 能列出失效模式，才算真的读懂了。

---

## 参考

- `agent/src/agent.rs`：`UsageTotals`、`Agent::run`、`complete`、`run_subagent`、`run_subagent_inner`、`compact_with`、`summarize_messages`、`distill_memories`、`persist`
- `agent/src/llm.rs`：`Usage`、`usage_from_value`、`AssistantTurn`、`chat`、`chat_with_model`、`read_stream`、`truncate`、`summarize`
- `agent/src/ui.rs`：`UiEvent::Usage`、`UiSink`、`Style::usage`、`Style::note`
- `agent/src/main.rs`：`/status`、`/cost`、`handle_daemon_request`、`stream_turn`、`write_event`、`save_session_file`
- `agent/src/board.rs`：`Job`、`JobStatus`、`Board::start`、`finish`、`Gate::acquire`
- `agent/src/memory.rs`：`distill`、`excerpt_from`、`worth_distilling`
- `agent/src/hooks.rs`：`HookOutcome`、`HOOK_TIMEOUT_SECS`
- `agent/src/tools/mod.rs`：`clamp`、`render_agent_board`、`Ctx`
