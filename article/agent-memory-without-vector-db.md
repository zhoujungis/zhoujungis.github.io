---
title: "03 Agent 记忆：不接向量库也能长期记忆"
slug: agent-memory-without-vector-db
cover_image: /photos/agent-memory-cover.png
date: 2026-10-23
tags: [Agent, Agent 工程, 记忆系统, 架构设计]
---

> 适用读者：已经让 Agent 跨会话工作、却发现它「每次都像第一次见你」的人；正在纠结要不要上向量库的人；想给记忆加淘汰、去重、预算，但不想引入新服务的人
> 结论先行：长期记忆的难点不在「存」，而在「下一次用得上」。NanoHermes 用 500 行不到的 `memory.rs` 做完了这件事：一个 `memory.json`、四个类别、500 条上限、BM25 检索、每轮注入 4 条且不超过 2,400 字符。没有 embedding，没有向量库，没有后台进程
> 阅读时间：约 50 分钟 | 难度：进阶 | 收获：一套可落地的记忆数据模型 + 写入与检索的完整链路 + 六个上限的取值理由 + 八个会悄悄让记忆失效的陷阱

**目录**

- 前言：记忆不是仓库，是索引
- 结论先行：记住四个数字
- 三个容易混淆的东西：上下文、会话、记忆
- 不接向量库：四个现实约束
- 全景：一次对话里的四个动作
- 存储：一个 JSON 文件与四个字段
- 四个类别：分桶是为了淘汰时有依据
- 写入路径一：模型主动 `memory_save`
- 写入路径二：轮次结束自动提炼
- 提炼门槛：一句 `contains` 省下一次模型调用
- 提炼提示词：四条硬约束
- 摘录怎么拼：system 丢掉，工具结果截到 1200 字
- 摘录的盲区：只取开头 6000 字符
- 解析：模型不听话时的四层兜底
- 去重：normalize 之后比「包含」，但 12 是字节
- 上限与淘汰：500 条、400 字与一个顺位表
- 一个真实的偏差：注释说丢最旧，代码丢最新
- 检索：为什么是 BM25 而不是余弦相似度
- 分词：英文按词，中文按二元
- 二元切分的假阳性
- 类别词也进索引：查「偏好」能直接命中
- BM25 公式：五个变量与一次排序
- Top-K 与字符预算：4 条、2400 字符
- 注入：一对标记与整体替换
- 每轮重检索：用当前这句话当查询
- 记忆与上下文压缩如何共存
- 失败语义：三条静默降级与一条隐患
- 并发写入：没有锁的 read-modify-write
- 子代理与多会话：工具共享，注入不共享
- 关闭记忆之后会发生什么
- 九个单元测试在守什么
- 八个常见记忆陷阱
- 怎么验证你的记忆真的在工作
- 小结：记忆是索引，不是仓库

## 前言：记忆不是仓库，是索引

人记住一件事，往往不是因为「存下来了」，而是因为「下次遇到相似场景时想起来了」。Agent 也一样：把用户说过的每一句话都存进数据库，并不能让它更懂你；真正起作用的是，在下一个任务开始时，它能不能从几百条旧信息里挑出三条真正相关的，塞进本次请求。

这件事看起来需要语义检索：用户上次说「发布脚本要先 dry-run」，这次问「怎么上线文章」，两句话没有共同词，向量相似度能连上，BM25 连不上。于是很多项目第一反应就是上向量库。但向量库只解决召回的一半问题，另一半——写什么、写多长、什么时候丢、注入多少——它一点都帮不上。而且它会把一个「单二进制、离线可用、好测试」的 Agent，变成一个需要模型服务、索引文件和重建流程的系统。

NanoHermes 走的是另一条路：不接向量库，用本地 BM25 加中日文二元切分做近似语义检索。整个 Agent 记忆模块 `agent/src/memory.rs` 不到 500 行，配上 `agent.rs` 里三处调用，就把「跨会话记住偏好与教训」跑通了。本文按数据流拆开：一条记忆怎么被写进来、怎么被去重、怎么被淘汰、怎么被检索、怎么被注入，以及这套做法在哪些地方会失效。

## 结论先行：记住四个数字

| 常量 | 值 | 管什么 | 失效后的症状 |
| --- | --- | --- | --- |
| `MAX_ENTRIES` | 500 | 记忆库总条数 | 文件无限膨胀，检索变慢，旧噪音淹没新结论 |
| `MAX_TEXT` | 400 | 单条记忆字符数 | 一条记忆占掉半个注入预算，摘要变成流水账 |
| `INJECT_TOP_K` | 4 | 每轮注入条数 | 注入太多，系统提示词被旧记忆挤占 |
| `INJECT_CHAR_BUDGET` | 2,400 | 每轮注入字符数 | 记忆反过来挤爆上下文窗口 |

四个数字之外还有三个：提炼摘录最多 6000 字符、单条消息摘录截到 1200 字符、去重的包含判定阈值是 12 字节。它们分别控制「读多少」「写多长」「算不算同一条」。

这四个上限不是拍脑袋定的，而是互相咬合的：单条最多 400 字，注入 4 条，理论上限是 1,600 字，加上每条 `- [经验] ` 这样的前缀和标题行，刚好落在 2,400 字符预算内。也就是说，正常情况下 `INJECT_TOP_K` 先生效，字符预算只是最后一道保险；只有当日志行变长、标签变多时，预算才会先触发。

记忆库总量也能算出来：500 条 × 400 字，最坏情况 20 万字；中文按 UTF-8 三字节算约 600 KB，中英混合通常三四百 KB。对一个本地 Agent 来说，这个体积可以直接整文件读进内存做线性扫描，不需要索引。

## 三个容易混淆的东西：上下文、会话、记忆

| 概念 | 存在哪 | 生命周期 | 谁在管 | 清空后影响什么 |
| --- | --- | --- | --- | --- |
| 上下文 | 本次请求的 `messages` 数组 | 一次请求 / 一个轮次 | `compact_with` | 只影响当前对话的连续性 |
| 会话 | `--session` 指定的 JSON 文件 | 可以跨进程恢复 | `persist` / `load_session_file` | 丢掉对话历史，但记不住的东西还在记忆里 |
| 记忆 | `~/.nanohermes/memory.json` | 跨会话、跨项目（默认目录共享） | `memory.rs` | 所有会话都失去长期偏好与教训 |

三者是独立演化的。02 讲的压缩只动 `messages`，不会碰 `memory.json`；清空会话（`reset`）只重置消息数组，记忆库原封不动；反过来，关掉记忆功能也不会影响会话恢复。

这个边界很重要。很多人把「记忆」和「会话历史」混为一谈，于是做出一种东西：把所有历史都塞进上下文，然后在超长时做摘要。那不是长期记忆，那只是更长的上下文。长期记忆的判据是：换一个新会话、换一个任务，它还在，并且能被检索出来。

还有一层：默认情况下记忆目录是全局的（`~/.nanohermes`），不按项目隔离。这意味着在 A 项目学到的「部署前先跑测试」会出现在 B 项目的系统提示词里。对通用偏好是好事，对项目特有的路径约定可能是噪音。需要隔离时只能通过 `memory_dir` 配置换目录，代码里没有按 workspace 自动分库。

## 不接向量库：四个现实约束

先说结论：不是向量检索不好，而是它解决的那部分问题，在这个项目里排不到前三。

| 维度 | 向量库 | 本地 BM25 |
| --- | --- | --- |
| 依赖 | 需要 embedding 模型（本地几百 MB 或联网 API） | 纯 Rust 标准库 + 一个 JSON 文件 |
| 运维 | 索引文件、重建、版本迁移 | 读文件、线性扫描 |
| 隐私 | 记忆文本要发给 embedding 服务 | 全部留在本机 |
| 可解释性 | 只能给出相似度分数 | 能打印命中了哪些词、每项得分多少 |
| 更新成本 | 新增/修改要重新算向量 | 写入即生效 |
| 同义词召回 | 强（「发布」能连上「上线」） | 弱（没有共同词就是零分） |
| 冷启动 | 需要模型加载 | 毫秒级 |
| 可测试性 | 依赖模型输出，结果不稳定 | 纯函数，断言稳定 |

四个现实约束是：

1. 项目目标是「小二进制、低内存、无 async 运行时」。引入 embedding 模型会把二进制和内存占用推高一个量级，和设计目标直接冲突。
2. 记忆默认开启，用户可能完全离线。联网 embedding 会让「离线可用」变成一句空话。
3. 记忆里会出现文件路径、内部接口名、甚至半截代码。把这些发给第三方 embedding API，是额外的隐私面。
4. 记忆只有几百条。几百条文本做线性 BM25，每轮耗时可忽略；为这个规模上向量索引，是典型的过度设计。

代价也要说清楚：BM25 是词袋模型，不理解同义改写。用户上次说「上线」，这次问「部署」，如果记忆里只有「上线」两个字，就检索不到。缓解办法不是加向量库，而是写记忆时把两种说法都写进去，或者写得更具体（「上线 = 部署到 GitHub Pages」），让未来的查询更容易命中。这是写法问题，不是检索器问题。

## 全景：一次对话里的四个动作

```
写入（轮次结束）
  user_text ──► worth_distilling? ──► excerpt_from(6000)
             ──► llm::distill ──► parse_distill
             ──► normalize ──► dedupe ──► trim(500) ──► memory.json

写入（轮次中，模型主动）
  memory_save(kind, text) ──► remember ──► 同一条链路

读取（下一轮开始）
  user_text ──► tokenize ──► BM25(search) ──► top 4
            ──► render_block(≤2400) ──► set_block(system)
```

四个动作对应四个函数入口：`distill_memories`（自动写）、`save_tool`（主动写）、`retrieve_block`（读）、`set_block`（注入）。它们共享同一个 `memory.json`，没有缓存，也没有守护进程。

值得注意的顺序：读取发生在用户消息入队之前（`Agent::run` 开头），写入发生在轮次完整结束之后。也就是说，本轮新提炼出的记忆不会立刻影响本轮，只会影响下一轮或下一个会话。这个延迟是故意的：提炼本身要额外调用一次模型，如果放在轮次中间，会把延迟叠加到用户等待上。

## 存储：一个 JSON 文件与四个字段

```rust
pub struct Entry {
    pub kind: Kind,
    pub text: String,
    /// 来源：`auto`（自动提炼）、`tool`（模型主动记录）或任务标识。
    pub source: String,
    /// 写入时间（Unix 秒）。
    pub ts: u64,
}
```

落盘格式就是一个对象包一个数组：

```json
{
  "entries": [
    {
      "kind": "correction",
      "text": "部署脚本默认先 dry-run，确认后再真正执行",
      "source": "auto",
      "ts": 1761200000
    }
  ]
}
```

四个字段各有用途：

| 字段 | 用途 | 缺失/异常时 |
| --- | --- | --- |
| `kind` | 决定注入标签与淘汰顺位 | 解析失败整条丢弃 |
| `text` | 检索与注入的唯一正文 | 空字符串整条丢弃 |
| `source` | 区分自动提炼与主动写入，便于排查 | 默认空串 |
| `ts` | 去重时刷新、淘汰时排序 | 默认 0（会被当成最旧） |

存储位置默认是 `~/.nanohermes/memory.json`，由 `default_dir()` 从 `HOME` 或 `USERPROFILE` 推导；`memory_dir` 配置可以覆盖。读取函数 `load` 的设计非常保守：

```rust
pub fn load(dir: &Path) -> Vec<Entry> {
    let Ok(data) = std::fs::read_to_string(store_path(dir)) else {
        return Vec::new();
    };
    let Ok(v) = serde_json::from_str::<Value>(&data) else {
        return Vec::new();
    };
    // ...
}
```

文件不存在、没有权限、JSON 损坏，一律返回空列表。好处是记忆永远不阻塞对话；坏处是「空列表」和「真的没有记忆」无法区分——这条我们放到失败语义一节展开。

还有一个细节：`save` 用的是 `std::fs::write`，先 `create_dir_all` 再整文件覆盖，没有临时文件加原子重命名。进程在写入中途被杀，文件就可能留下半截 JSON；下一次 `load` 返回空，下一次 `save` 又会用新内容覆盖掉这半截文件。也就是说，损坏的后果不是「读不出来」，而是「静默清零」。

## 四个类别：分桶是为了淘汰时有依据

`Kind` 只有四个值，但每个都有明确语义，并且参与两件事：注入时显示中文标签，淘汰时决定谁先被丢。

| 类别 | 含义 | 典型例子 | 注入标签 | 淘汰顺位 |
| --- | --- | --- | --- | --- |
| `Preference` | 稳定的用户偏好 | 回复用中文、不要 emoji、UI 要简洁 | 偏好 | 0（最后丢） |
| `Correction` | 用户否定过的做法与给出的正确做法 | 「不要单独弹窗，停靠在窗口右侧」 | 纠正 | 1 |
| `Lesson` | 踩过的坑、验证有效的做法 | 「WSL 里 git push 会缺凭据管理器」 | 经验 | 2 |
| `Fact` | 长期成立的项目/环境事实 | 「前端用 Vite + React，后端 Django」 | 事实 | 3（最先丢） |

顺位数字越大越先被淘汰。理由很直白：偏好和纠正代表用户的稳定意图，重复写错代价最高；事实和具体经验容易过期，也容易从代码里重新发现。

`Kind::parse` 还接受一批别名，方便模型和外部脚本写入：

| 输入 | 解析结果 |
| --- | --- |
| `lesson` / `lesson-learned` / `experience` / `lesson_learned` | `Lesson` |
| `preference` / `pref` | `Preference` |
| `correction` / `feedback` | `Correction` |
| `fact` / `project` | `Fact` |
| 其他任何值 | `None`（工具报错；自动提炼时归为 `Fact`） |

注意最后一行：主动写入时非法类别直接失败，自动提炼时非法类别降级成事实。一个严格、一个宽松，因为自动提炼的输出不可控，不能因为模型写错一个枚举值就丢掉整条记忆。

## 写入路径一：模型主动 `memory_save`

工具声明很直白：让模型把「值得跨任务记住」的东西写进来，参数是类别加一句自包含的话。

```rust
pub fn save_tool(args: &Value, dir: &Path) -> Result<String, String> {
    let kind = args
        .get("kind")
        .and_then(|k| k.as_str())
        .and_then(Kind::parse)
        .ok_or("kind 必须是 lesson / preference / correction / fact 之一")?;
    let text = args
        .get("text")
        .and_then(|t| t.as_str())
        .ok_or("缺少 text")?;
    let added = remember(dir, kind, text, "tool")?;
    let n = load(dir).len();
    Ok(if added {
        format!("已记下（{kind:?}），当前记忆共 {n} 条")
    } else {
        format!("与已有记忆重复，未新增；当前记忆共 {n} 条")
    })
}
```

返回值里带了总数，是为了让模型知道记忆库的规模；重复写入时明确说「未新增」，避免模型以为写成功了而反复重试。`source` 固定为 `tool`，事后可以区分这条记忆是模型主动记的，还是轮次结束自动提炼的。

什么时候该主动写？提示词里写的是：用户偏好、对你行为的纠正、付出代价换来的经验、稳定的项目事实。不该写的东西同样重要：一次性的文件状态、当前任务的临时决定、能从代码里直接读到的信息。这些写进去只会稀释检索。

工具层还有一道开关。`Ctx` 里的 `memory_dir` 是 `Option<PathBuf>`：

```rust
"memory_save" => match &ctx.memory_dir {
    Some(dir) => crate::memory::save_tool(args, dir),
    None => Err("long-term memory is disabled (settings)".to_string()),
},
```

关闭记忆时工具仍然出现在工具列表里，只是调用会返回错误。这个不对称后面会单独说。

## 写入路径二：轮次结束自动提炼

主动写入依赖模型自觉，覆盖率不稳定。所以还有一条兜底：每个完整结束的轮次，让模型从这段对话里提炼一次。

```rust
if completed && self.cfg.memory {
    self.distill_memories(&user_text, had_tools);
}
```

`completed` 这个条件很关键：被 Ctrl-C 中断、或者撞到最大迭代次数的半截对话，不提炼。理由是被中断的轮次往往停在工具调用中间，结论还没出来，提炼出来的多半是过程噪音。

`distill_memories` 本身只有二十来行：

```rust
fn distill_memories(&mut self, user_text: &str, had_tools: bool) {
    let dir = match self.ctx.memory_dir.clone() {
        Some(d) => d,
        None => return,
    };
    if !memory::worth_distilling(user_text, had_tools) {
        return;
    }
    let excerpt = memory::excerpt_from(&self.messages, 6000);
    let items = match memory::distill(&self.cfg, &excerpt) {
        Ok(items) => items,
        Err(_) => return,
    };
    let mut saved = 0usize;
    for (kind, text) in items {
        if memory::remember(&dir, kind, &text, "auto").unwrap_or(false) {
            saved += 1;
        }
    }
    if saved > 0 {
        self.style
            .note(&format!("已从本次对话沉淀 {saved} 条长期记忆"));
    }
}
```

三个失败点全部静默：目录没配、门槛没过、模型调用失败。记忆是加分项，不能因为它挂掉就让一次已经成功的对话报错。成功时给一行提示，让用户知道「刚才那次对话被记住了」，而不是完全无感。

## 提炼门槛：一句 `contains` 省下一次模型调用

自动提炼的成本是每轮一次额外模型请求。如果用户只是说「继续」「好的」，这次请求就纯属浪费。所以有一个廉价预判：

```rust
pub fn worth_distilling(user_text: &str, had_tools: bool) -> bool {
    if had_tools {
        return true;
    }
    const MARKERS: [&str; 8] = ["不对", "错了", "不是", "不要", "别", "应该", "重新", "以后"];
    let text = user_text.trim();
    if MARKERS.iter().any(|m| text.contains(m)) {
        return true;
    }
    text.chars().count() >= 24
}
```

规则只有三条：

| 条件 | 结果 | 理由 |
| --- | --- | --- |
| 本轮调用过工具 | 一定提炼 | 有工具往返，通常意味着有可复用的操作经验 |
| 含纠正类关键词 | 一定提炼 | 纠正与偏好恰恰是最该沉淀的内容，哪怕只有四个字 |
| 用户消息 ≥ 24 字符 | 提炼 | 长消息通常包含目标、约束或背景 |
| 其余（短寒暄） | 跳过 | 「继续」「好的」「收到」不含可跨会话的信息 |

这条门槛有一个粗糙的地方：关键词用的是 `contains`，没有词边界。「别」会命中「特别」，「不是」会命中「是不是」。中文本来就没有空格分词，做精确匹配要引入分词器，成本比收益高；最终选择接受假阳性——多提炼一次只是多一次模型调用，漏掉一次纠正才是真正的损失。

`had_tools` 直接放行也有类似的取舍：一次只读文件的轮次可能什么经验都没有，但仍然会提炼。所以提炼提示词里必须有一条「没有可长期保留的就返回空数组」，把判断权交回模型。

## 提炼提示词：四条硬约束

提炼用的是独立提示词，和主对话完全隔离：

```rust
const DISTILL_SYSTEM: &str = "\
You extract durable long-term memories for a coding assistant from a finished conversation turn.
Return ONLY a JSON array (no prose, no markdown fences). Each item is
{\"kind\": \"lesson|preference|correction|fact\", \"text\": \"...\"} where:
- lesson:     an experience or lesson learned (a pitfall to avoid, or an approach that worked);
- preference: a stable user preference (style, workflow, deliverable format);
- correction: something the user rejected and the right way they gave instead;
- fact:       a durable project/environment convention.
Rules: each text is ONE self-contained sentence in the conversation's language, at most 200 characters;
it must hold up in future unrelated sessions (no task-local details like dates or one-off file states);
dedupe near-identical items; if nothing is durable, return [].";
```

拆开看，硬约束有四条：

| 约束 | 目的 | 违反后的后果 |
| --- | --- | --- |
| 一句自包含的话 | 脱离原对话也能读懂 | 「把那个改一下」这类记忆永远检索不到也用不上 |
| 不超过 200 字符 | 控制注入预算 | 一条记忆占满 2,400 字符预算 |
| 必须在未来无关会话里成立 | 过滤一次性状态 | 「当前分支是 fix-123」下周就是垃圾 |
| 近似重复要合并 | 控制总量 | 同一偏好写十遍，挤掉其他记忆 |

这里有个前后不一致：提示词要求 200 字符，代码里的 `MAX_TEXT` 是 400 字符。模型守规矩时没问题；模型写长了，`remember` 会在 400 字处静默截断，可能把一句话切成半截。宽松的上限是给主动调用 `memory_save` 留的余量，但对自动提炼来说，200 和 400 之间那段空白其实是风险区。

提示词还允许返回空数组。这是整套设计里最容易被忽略的一句：没有可记的东西，比硬凑一条更正确。一个只会写「用户让我改代码」的记忆库，检索价值是零。

## 摘录怎么拼：system 丢掉，工具结果截到 1200 字

提炼不是把整个对话原样发过去，而是先拼一段摘录：

```rust
pub fn excerpt_from(messages: &[Value], max_chars: usize) -> String {
    let mut out = String::new();
    for m in messages {
        let role = m.get("role").and_then(|r| r.as_str()).unwrap_or("");
        let body = match role {
            "system" => continue,
            "tool" => format!("[tool result] {}", content_text(m.get("content").unwrap_or(&Value::Null))),
            "assistant" => {
                if m.get("tool_calls").is_some() && m.get("content").and_then(|c| c.as_str()).unwrap_or("").trim().is_empty() {
                    continue;
                }
                content_text(m.get("content").unwrap_or(&Value::Null))
            }
            _ => content_text(m.get("content").unwrap_or(&Value::Null)),
        };
        let body = body.trim();
        if body.is_empty() {
            continue;
        }
        let body: String = body.chars().take(1200).collect();
        out.push_str(&format!("[{role}] {body}\n"));
        if out.chars().count() >= max_chars {
            break;
        }
    }
    out
}
```

处理规则可以列成一张表：

| 消息类型 | 处理 | 理由 |
| --- | --- | --- |
| `system` | 整条跳过 | 系统提示词是配置，不是对话内容 |
| `tool` | 加 `[tool result]` 前缀，正文截 1200 字 | 工具输出常常几万字节，全发会挤掉真正的结论 |
| `assistant` 只有 `tool_calls` 没有正文 | 整条跳过 | 这类消息只有函数名和参数，对提炼没帮助 |
| `assistant` 有正文 | 保留，截 1200 字 | 结论、计划、解释都在这里 |
| `user` | 保留，截 1200 字 | 目标、约束、纠正都在这里 |
| 多模态数组 | 只取 `text` 部分 | 图片对文本提炼没有用，而且 base64 会爆长度 |

注意截断发生在单条消息上，不是整体截断：每条最多 1200 字，总长度到 6000 就停止追加。所以一次提炼最多看到五条满长消息，或者更多短消息。

还有一个隐含信息：工具结果被保留，而不是被丢弃。这一点和「上下文压缩」不同——压缩时工具结果最容易被丢，因为它们通常很长；但提炼经验时，工具结果恰恰是「什么命令有效、报了什么错」的证据。同一份历史，两个消费者，两种取舍。

## 摘录的盲区：只取开头 6000 字符

`excerpt_from` 是从 `messages[0]` 开始往后遍历的。这意味着摘录取的是对话的开头，而不是结尾。

```rust
for m in messages {
    // ...
    if out.chars().count() >= max_chars {
        break;
    }
}
```

在一个短轮次里这没问题：6000 字符足够覆盖全部消息。但在一个长轮次里——比如用户让它读十个文件、跑五次命令、最后给结论——摘录会在前五六条消息处就用完预算，真正的结论、最后的纠正、最终确认的方案，全部落在 6000 字符之外。提炼出来的记忆于是偏向「任务开始时说了什么」，而不是「任务结束时得出了什么」。

更麻烦的是，这个盲区没有任何提示：模型不会知道自己只看到了前半段，它会根据前半段自信地提炼。结果是记忆库里多了一条「用户在开头提到的初步想法」，少了一条「最后确认的做法」。

有两个改法，代价都很低：

| 改法 | 做法 | 代价 |
| --- | --- | --- |
| 取尾部 | 反向遍历，或先算总长再从后往前收集 | 丢掉任务目标，可能提炼出没有上下文的结论 |
| 首尾各一半 | 前 3000 字符 + 后 3000 字符，中间省略 | 实现多十几行，但目标和结论都能保住 |

如果历史已经被压缩过，情况会好一些：`messages[1]` 是一条摘要，正好概括了被丢掉的中段，而摘录从索引 1 开始就会优先包含它。但这只是碰巧缓解，不能替代「取尾部」的修正。

## 解析：模型不听话时的四层兜底

提炼要求「只返回 JSON 数组」，但模型经常会加围栏、加前言、或者包一层对象。解析器为此做了四层容错：

```rust
pub fn parse_distill(text: &str) -> Vec<(Kind, String)> {
    let trimmed = text.trim();
    let json_part = if let (Some(a), Some(b)) = (trimmed.find('['), trimmed.rfind(']')) {
        trimmed[a..=b].to_string()
    } else if let (Some(a), Some(b)) = (trimmed.find('{'), trimmed.rfind('}')) {
        trimmed[a..=b].to_string()
    } else {
        trimmed.to_string()
    };
    let Ok(v) = serde_json::from_str::<Value>(&json_part) else {
        return Vec::new();
    };
    let arr = match v {
        Value::Array(a) => a,
        Value::Object(_) => v
            .get("memories")
            .or_else(|| v.get("entries"))
            .and_then(|x| x.as_array())
            .cloned()
            .unwrap_or_default(),
        _ => Vec::new(),
    };
    // ...
}
```

| 模型输出 | 解析结果 |
| --- | --- |
| `[{"kind":"lesson","text":"..."}]` | 正常解析 |
| 前面有「好的，这是提炼结果：」 | 截取第一个 `[` 到最后一个 `]`，正常解析 |
| JSON 代码围栏包裹 | 方括号截取会跳过围栏，正常解析 |
| `{"memories":[...]}` 或 `{"entries":[...]}` | 取内层数组 |
| `{"foo":[...]}` 或纯文本 | 返回空列表 |
| `kind` 写了 `weird` | 归为 `Fact` |
| `text` 为空或缺失 | 丢弃该条 |

一个测试直接锁住了前三行和最后两行的行为。这种「宽松解析」不是偷懒，而是把模型的不可控性挡在记忆库之外：解析失败最多是这一轮没有新记忆，绝不会写进半条脏数据。

## 去重：normalize 之后比「包含」，但 12 是字节

模型很爱重复。同一句「回复用中文」，可能在十个轮次里被提炼十次。如果不去重，500 条上限很快就被同一句话占满。`remember` 的去重逻辑是：先归一化，再比相等或包含。

```rust
fn normalize(text: &str) -> String {
    text.to_lowercase()
        .chars()
        .filter(|c| !c.is_whitespace() && !"，。！？；：、,.!?;:()（）「」\"'“”【】…—-·*#`>~".contains(*c))
        .collect()
}
```

```rust
let key = normalize(&text);
for e in entries.iter_mut() {
    let old = normalize(&e.text);
    if old == key || (key.len() >= 12 && old.contains(&key)) || (old.len() >= 12 && key.contains(&old)) {
        e.ts = now();
        e.source = source.to_string();
        save(dir, &entries)?;
        return Ok(false);
    }
}
```

判定矩阵：

| 新记忆 | 已有记忆 | 结果 |
| --- | --- | --- |
| 「测试前先跑 cargo test」 | 完全相同 | 不新增，刷新时间戳 |
| 「测试前先跑 cargo test！」 | 去标点后相同 | 不新增 |
| 「测试前先跑 cargo test」 | 「测试前先跑 cargo test 避免回归」 | 短的被长的包含，且长度 ≥ 12 字节，不新增 |
| 「用中文」 | 「回复一律用中文」 | 新记忆只有 9 字节，不满足阈值，新增（可能重复） |
| 「回复用中文」 | 同文本但类别不同 | 不新增，类别保持不变 |

这里最容易看错的是 `12`。`String::len()` 返回的是 UTF-8 字节数，不是字符数。对中文来说，12 字节只有 4 个字；对英文来说，12 字节是 12 个字符。所以「用中文」（3 个字，9 字节）不会触发包含判定，而「不要用 emoji」（约 15 字节）会。这个阈值实际上偏向英文和长句，短中文偏好更容易重复堆积。

去重命中时，只刷新 `ts` 和 `source`，不改 `kind` 也不改 `text`。这带来一个副作用：如果先写了一条 `fact`，后来同一句话被当成 `preference` 写入，类别仍然是 `fact`，淘汰顺位也不会更新。想改类别只能先删掉旧条目——而代码里没有删除单条记忆的工具。

## 上限与淘汰：500 条、400 字与一个顺位表

写入前会先把文本截到 400 字，再追加，再 `trim`：

```rust
let text: String = text.chars().take(MAX_TEXT).collect();
// ...
entries.push(Entry { kind, text, source: source.to_string(), ts: now() });
trim(&mut entries);
save(dir, &entries)?;
```

`trim` 的写法值得单独看：

```rust
fn trim(entries: &mut Vec<Entry>) {
    while entries.len() > MAX_ENTRIES {
        let victim = entries
            .iter()
            .enumerate()
            .max_by_key(|(_, e)| (e.kind.eviction_rank(), e.ts))
            .map(|(i, _)| i)
            .unwrap_or(0);
        entries.remove(victim);
    }
}
```

逐条解释：

1. 先按类别顺位排序：`Fact` 3、`Lesson` 2、`Correction` 1、`Preference` 0。
2. 顺位相同时，按 `ts` 取最大值。
3. 删掉这一条，直到总数回到 500。

设计意图写在注释里：先丢经验与事实，偏好与纠正最后才动。理由前面说过，用户的稳定意图比一次性事实更值钱。

但 `max_by_key` 在顺位相同时取的是最大的 `ts`，也就是最新写入的那条。这和第 2 步的意图相反。

## 一个真实的偏差：注释说丢最旧，代码丢最新

`trim` 上方的注释是「超出上限时淘汰：先丢最旧的经验/事实」。而代码在类别顺位相同时选择 `ts` 最大的条目，也就是最新的一条。于是实际行为变成：当记忆库满 500 条、且最该淘汰的类别里有多个条目时，被删掉的是最近刚写的那条，而不是最旧的那条。

这会造成一种反直觉的现象：用户刚纠正过一次，系统提炼出一条新的 `Lesson`；如果此时库里已经有 500 条且 `Fact`/`Lesson` 占多数，这条新记忆可能刚写进去就被淘汰。偏好和纠正因为顺位低，暂时不受影响。

修法只需要把时间比较反过来：

```rust
let victim = entries
    .iter()
    .enumerate()
    .max_by_key(|(_, e)| (e.kind.eviction_rank(), std::cmp::Reverse(e.ts)))
    .map(|(i, _)| i)
    .unwrap_or(0);
```

`Reverse` 让「最大」在时间维度上变成「最小」，于是先按类别顺位、再按最旧排序。或者拆成两步：先筛出最高顺位的候选集，再在里面找 `min_by_key(|e| e.ts)`。

为什么这个偏差一直没被发现？因为对应的测试只断言了「偏好条目活下来」，没有断言「同类别里丢的是最旧的」：

```rust
#[test]
fn trims_oldest_lessons_before_touching_preferences() {
    let mut entries = vec![entry(Kind::Preference, "用户偏好简洁的中文回复")];
    for i in 0..MAX_ENTRIES {
        entries.push(entry(Kind::Lesson, &format!("经验{i}：某个只对本次有意义的细节")));
    }
    trim(&mut entries);
    assert_eq!(entries.len(), MAX_ENTRIES);
    assert!(entries.iter().any(|e| e.kind == Kind::Preference));
}
```

测试名里写着 `oldest`，断言里却只有「偏好还在」。这是一个很典型的测试盲区：测试名描述了意图，断言只验证了其中一半。如果补一句「最后一条 `Lesson` 仍然存在」，这个偏差当场就会暴露。

把这件事写进文章，不是为了挑刺，而是想说明一个工程事实：注释、测试名、实现三者不一致，是长期记忆这种「低频、难观察」的模块最容易积累的债务。记忆淘汰错了，用户不会收到报错，只会觉得「它怎么又忘了」。

## 检索：为什么是 BM25 而不是余弦相似度

BM25 是信息检索里的经典打分函数，本质是「词频 × 逆文档频率 × 长度归一化」。它不产生向量，只比较词是否重叠、重叠多少次、这个词有多稀有。

| 特性 | 对记忆检索的意义 |
| --- | --- |
| 词袋匹配 | 查询和记忆必须有共同词，结果可解释 |
| IDF 加权 | 「的」「是」这类高频词几乎不加分，罕见词权重高 |
| 长度归一化 | 长记忆不会因为词多就天然占优 |
| 无训练 | 新增记忆立即生效，不需要重建索引 |
| 确定性 | 同样的库和查询，分数完全一致，方便写测试 |

不足也明确：没有共同词就是零分，同义改写、跨语言、代词指代全部接不住。所以 `search` 直接过滤掉零分条目，宁可返回空，也不返回一堆不相关的结果。

还有两个隐含行为：

1. 没有时间衰减。一条三年前的偏好和昨天刚写的偏好，只要词频一样，得分就一样。`ts` 只用于去重刷新和淘汰排序，不参与打分。
2. 没有类别权重。`Preference` 不会因为「更重要」而加分，类别只通过标签词进入索引。

这两点在几百条规模下可以接受：库里大部分是近期写的内容，时间衰减的收益不明显；类别权重则可能引入新的调参负担。

## 分词：英文按词，中文按二元

BM25 的前提是「词」。英文有空格，中文没有，所以 `tokenize` 用了两套规则：

```rust
let flush_word = |buf: &mut String, out: &mut Vec<String>| {
    if buf.chars().count() >= 2 {
        out.push(buf.to_lowercase());
    }
    buf.clear();
};
let flush_cjk = |cjk: &mut String, out: &mut Vec<String>| {
    let chars: Vec<char> = cjk.chars().collect();
    if chars.len() == 1 {
        out.push(chars[0].to_string());
    } else {
        for w in chars.windows(2) {
            out.push(w.iter().collect());
        }
    }
    cjk.clear();
};
```

| 输入片段 | 输出 token |
| --- | --- |
| `NanoHermes` | `nanohermes` |
| `Vite` | `vite` |
| `a` | 丢弃（ASCII 单词少于 2 字符） |
| `120_000` | `120`、`000`（下划线是分隔符） |
| `前端用` | `前端`、`端用` |
| `构建` | `构建` |
| `好` | `好`（单字段落保留单字） |

规则总结：

1. ASCII 字母数字连续段做小写单词，少于 2 个字符直接丢掉。
2. CJK 连续段做二元切分：n 个字产生 n-1 个 token；只有一个字时保留这个单字。
3. 其他字符（空格、标点、下划线、符号）都是分隔符，同时冲刷两边的缓冲区。

二元切分的好处是「不需要词典」：任何中文串都能切，生僻词、专有名词、代码里的中文注释都不怕。坏处是会产生跨词的假 token，也会让单字查询变得很弱。

## 二元切分的假阳性

以「前端用 Vite 构建」为例，CJK 段「前端用」被切成「前端」和「端用」。「端用」不是词，但它会进入索引，也会进入查询。后果有两类：

| 现象 | 例子 | 影响 |
| --- | --- | --- |
| 跨词假 token | 「前端用」产生「端用」 | 查询「端用」会误命中这段文本，但这种查询几乎不存在 |
| 单字噪音 | 「好」保留为单字 | 查询含「好」时，所有含「好」的记忆都得分 |
| 同义不匹配 | 记忆写「上线」，查询写「部署」 | 零分，检索不到 |
| 语序不敏感 | 「A 调用 B」与「B 调用 A」token 相同 | 方向关系丢失，可能召回错误经验 |

真正影响体验的是后两类：同义不匹配和语序丢失。第一类假 token 大多无害，因为没人会去搜「端用」。

缓解手段不在检索器，而在写入侧：

1. 写记忆时把关键同义词一起写进去：「上线（部署）前先跑 dry-run」。
2. 尽量写具体名词和路径，而不是代词：「发布脚本」而不是「那个脚本」。
3. 一条记忆只讲一件事，避免长句里塞多个主语，降低语序歧义。

这也解释了一个看似奇怪的设计选择：`MAX_TEXT` 是 400 字，但提示词要求 200 字。短句更容易被检索，也更不容易在注入时挤占预算。

## 类别词也进索引：查「偏好」能直接命中

构建文档词频时，除了正文，还会把类别标签和英文类别名加进去：

```rust
let docs: Vec<Vec<String>> = entries
    .iter()
    .map(|e| {
        let mut t = tokenize(&e.text);
        // 类别词也参与匹配：「偏好」「纠正」这样的查询能直接命中对应条目。
        t.extend(tokenize(e.kind.label()));
        t.push(e.kind.as_str().to_string());
        t
    })
    .collect();
```

于是三种查询都能工作：

| 查询 | 命中的内容 |
| --- | --- |
| 「部署流程」 | 正文含「部署」的记忆 |
| 「偏好」 | 所有 `Preference` 条目（标签词「偏好」匹配） |
| 「preference」 | 所有 `Preference` 条目（英文类别名匹配） |

这相当于给记忆加了一个免费的「类型过滤器」，用户或模型不用记 slug，直接用中文类别词就能翻出某一类。

副作用是类别词会抬高该类条目的长度和词频。`df` 是在包含标签词的文档集合上统计的，所以「偏好」这个词的 `df` 等于偏好类条目数，IDF 会相应降低；这是合理的——类别词本来就应该比具体名词更常见、更不值钱。

## BM25 公式：五个变量与一次排序

核心只有两行：

```rust
let idf = (1.0 + (n - n_q + 0.5) / (n_q + 0.5)).ln();
score += idf * (f * (k1 + 1.0)) / (f + k1 * (1.0 - b + b * len / avg_len.max(1.0)));
```

| 符号 | 含义 | 取值/来源 |
| --- | --- | --- |
| `n` | 记忆总条数 | `docs.len()` |
| `n_q` | 含该词的条数（文档频率） | 遍历 docs 统计 |
| `f` | 该词在当前条目中的词频 | 逐条统计 |
| `len` | 当前条目的 token 数（含类别词） | `d.len()` |
| `avg_len` | 所有条目的平均 token 数 | 总和除以 n |
| `k1` | 词频饱和系数 | 1.2 |
| `b` | 长度归一化强度 | 0.75 |

三个部分的作用：

1. IDF：一个词越稀有，命中它越有区分度。「部署」比「的」值钱。
2. 词频饱和：`f` 从 1 涨到 10 时分数涨得快，从 10 涨到 100 时几乎不涨，避免一条记忆靠重复关键词刷分。
3. 长度归一化：`b = 0.75` 表示「长度影响占七成五」，长文档需要更高的词频才能拿到同样分数。

算完之后过滤零分、按分数降序、截断到 `top_k`：

```rust
let mut ranked: Vec<(f64, usize)> = scores
    .into_iter()
    .enumerate()
    .filter(|(_, s)| *s > 0.0)
    .map(|(i, s)| (s, i))
    .collect();
ranked.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap_or(std::cmp::Ordering::Equal));
ranked.truncate(top_k);
```

复杂度是 O(条目数 × 查询词数)，500 条约等于几千次哈希查找，每轮一次，完全不需要倒排索引。这也是「不接向量库」在工程上成立的根本原因：规模小到可以暴力。

## Top-K 与字符预算：4 条、2400 字符

注入侧有两个限制：条数和字符数。`retrieve_block` 先取前 4 条，再交给 `render_block` 排版：

```rust
pub fn retrieve_block(dir: &Path, query: &str) -> String {
    let entries = load(dir);
    let hits = search(&entries, query, INJECT_TOP_K);
    let picked: Vec<&Entry> = hits.iter().map(|(_, i)| &entries[*i]).collect();
    render_block(&picked)
}
```

`render_block` 逐条累加，超过预算就停止：

```rust
let line = format!("\n- [{}] {}", e.kind.label(), e.text);
if used + line.chars().count() > INJECT_CHAR_BUDGET {
    break;
}
used += line.chars().count();
out.push_str(&line);
```

算一笔账：

| 条目 | 每条最大长度 | 累计 |
| --- | --- | --- |
| 1 | 400 字正文 + 约 10 字前缀 | 约 410 |
| 2 | 同上 | 约 820 |
| 3 | 同上 | 约 1,230 |
| 4 | 同上 | 约 1,640 |

四条满长记忆也只有 1,640 字符，离 2,400 还有 760 的余量。所以预算通常不会先触发，`top_k = 4` 才是实际约束。预算真正起作用的情况是：标签文本变长、未来引入更长的类别名、或者在 `render_block` 里加了额外的说明行。

顺序也有影响：命中按分数降序排列，预算一旦不够，被丢掉的一定是分数最低的那条，而不是随机一条。这保证「最相关的先注入」。

## 注入：一对标记与整体替换

注入块用一对固定标记包起来：

```rust
pub const BLOCK_START: &str = "=== Long-term memory (retrieved from past sessions) ===";
pub const BLOCK_END: &str = "=== End long-term memory ===";
```

渲染出来的样子是：

```
=== Long-term memory (retrieved from past sessions) ===
以下是从过往会话中检索到的相关记忆（由对话自动提炼，仅供参考；用户当前指令优先）：

- [偏好] 回复使用中文，代码注释也用中文
- [纠正] 部署脚本默认先 dry-run，确认后再执行
- [经验] WSL 里 git push 会缺凭据管理器，改用 PowerShell
- [事实] 前端用 Vite + React，后端 Django

=== End long-term memory ===
```

替换逻辑是「先删旧块，再追加新块」：

```rust
pub fn set_block(system: &str, block: &str) -> String {
    let mut base = system.to_string();
    if let Some(start) = base.find(BLOCK_START) {
        let end = base[start..]
            .find(BLOCK_END)
            .map(|i| start + i + BLOCK_END.len())
            .unwrap_or(base.len());
        base.replace_range(start..end, "");
    }
    let base = base.trim_end().to_string();
    if block.is_empty() {
        base
    } else if base.is_empty() {
        block.to_string()
    } else {
        format!("{base}\n\n{block}")
    }
}
```

两个关键点：

1. 整体替换，不是追加。每轮都先删旧块，所以块不会随着轮次线性增长。
2. 新块为空时删除旧块。这一条常被忽略：如果本轮查询没有命中任何记忆，上一轮的注入块会被清掉，而不是继续留在系统提示词里。

第二点是有意的：记忆应该跟着当前任务走，而不是永久占位。但它的副作用是——如果用户这轮只说了「继续」，检索不到任何东西，记忆块就消失了。

注入块放在系统提示词末尾，属于「稳定前缀」的尾部。02 讲过前缀缓存：系统提示词越靠前越稳定，缓存命中率越高。把每轮都会变的记忆块放在最后，改动只影响尾部，不会让整段前缀失效。这是两个模块之间一个没有写在注释里、但很重要的配合。

## 每轮重检索：用当前这句话当查询

`Agent::run` 的开头，先取当前用户消息的纯文本，再检索、再注入：

```rust
let user_text = memory::content_text(&content);
if let Some(dir) = self.ctx.memory_dir.clone() {
    let block = memory::retrieve_block(&dir, &user_text);
    self.set_memory_block(&block);
}
self.messages
    .push(json!({ "role": "user", "content": content }));
```

注意执行顺序：检索发生在用户消息入队之前，所以查询里不包含本轮消息本身，也不包含之前的对话。查询就是这一句话。

这样做的好处是「意图对齐」：用户这轮说「部署脚本怎么改」，就检索部署相关的记忆；下一轮说「前端样式」，就换成前端相关的记忆。坏处是「短指令失忆」：

| 用户消息 | 查询 token | 可能结果 |
| --- | --- | --- |
| 「部署脚本怎么改」 | 部署 / 署脚 / 脚本 / 怎么 / 么改 | 命中部署相关记忆 |
| 「前端样式再调一下」 | 前端 / 端样 / 样式 / 再调 / 调一 / 一下 | 命中前端偏好 |
| 「继续」 | 继续 | 很可能零命中，注入块被清空 |
| 「好的，就按这个来」 | 好的 / 的就 / 就按 / 按这 / 这个 / 个来 | 很可能零命中 |

于是出现一个体验落差：用户认真描述需求时，Agent 记得他的偏好；用户说「继续」时，Agent 反而把记忆丢了。这不是 bug，而是「用当前消息做查询」这个设计的直接后果。

如果要修，有两个方向：

1. 查询拼接最近几条用户消息，而不只是当前这条。代价是相关性被稀释，旧话题会污染新话题。
2. 短消息（比如少于 8 个字符）时沿用上一轮的注入块，不做替换。代价是需要额外的状态，且可能把过时记忆留在窗口里。

NanoHermes 选择了最简单的版本：每轮独立检索，零命中就清空。对「一次说清需求」的使用习惯来说，这个取舍是成立的。

## 记忆与上下文压缩如何共存

02 讲过压缩：超过 120,000 字符时，保留最近 10 条，把更早的消息换成一条摘要，插在 `messages[1]`。记忆块住在 `messages[0]` 的系统消息里，两条链路互不干扰：

| 动作 | 动谁 | 会不会动记忆块 |
| --- | --- | --- |
| `compact_with` | `messages[1..start]` | 不会，索引 0 永远保留 |
| `set_memory_block` | `messages[0].content` | 只替换块本身 |
| `refresh_system` | 重建 `messages[0]` | 会丢掉旧块，下一轮重新检索 |
| `reset` | 重建整个 `messages` | 会丢掉旧块，但 `memory.json` 不变 |
| `persist` | 写会话文件 | 会把当前块一起写进文件 |

有两个细节值得记：

1. 压缩产生的摘要插在索引 1，而记忆块在索引 0 的正文里。两者不会互相覆盖，因为 `set_block` 只认 `BLOCK_START` 和 `BLOCK_END` 之间的内容。
2. 会话恢复时，`refresh_system` 会用当前配置重建系统提示词，旧块被丢弃；第一轮对话开始时重新检索。这保证恢复出来的会话不会带着上一个环境的记忆。

换句话说：记忆是「每轮重新取用的外部资料」，压缩是「本轮历史的内部整理」。一个在系统消息里，一个在消息数组的中段，生命周期完全不同。

## 失败语义：三条静默降级与一条隐患

记忆模块的每个失败点都做了处理，但处理方式不一样：

| 失败点 | 处理 | 用户能感知吗 |
| --- | --- | --- |
| `memory.json` 不存在 | 返回空列表 | 不能，等同于「还没有记忆」 |
| `memory.json` 损坏 | 返回空列表 | 不能，所有旧记忆静默消失 |
| 写入磁盘失败 | 工具调用返回 `ERROR`，自动提炼忽略 | 主动写入能感知，自动提炼不能 |
| 提炼模型调用失败 | 直接返回，不写任何东西 | 不能 |
| 提炼输出不是 JSON | 解析为空列表 | 不能 |
| 注入时没有命中 | 删除旧块 | 不能 |

这套设计的总体原则是「记忆永远不阻塞主流程」，方向是对的。但「损坏即空」这一条留下了一个隐患：

1. `load` 发现 JSON 坏了，返回空列表。
2. 下一轮提炼成功，`remember` 在空列表上追加一条。
3. `save` 整文件覆盖，原来的损坏内容被彻底替换。
4. 用户失去全部旧记忆，而且没有任何提示。

更稳妥的做法是：`load` 解析失败时先把原文件重命名为 `memory.json.broken`，再返回空列表；或者 `save` 走临时文件加 `rename` 的原子写入，避免产生半截文件。两者都不改变正常路径的行为，只把「静默清零」变成「保留证据」。

主动写入的失败是可见的：`save_tool` 把 `remember` 的错误原样返回，模型会看到 `ERROR`，可以决定重试或告诉用户。自动提炼则用 `unwrap_or(false)` 吞掉错误，因为它在轮次结束后运行，没有交互机会。

## 并发写入：没有锁的 read-modify-write

整个存储层没有文件锁，每次写入都是「读全量 → 改内存 → 写全量」：

```rust
let mut entries = load(dir);
// ... 查重或追加 ...
save(dir, &entries)?;
```

单线程下没问题。但 `Agent::run` 会把同一轮里的多个工具调用放到独立线程里并发执行：

```rust
let this: &Agent = self;
std::thread::scope(|s| {
    let handles: Vec<_> = turn
        .tool_calls
        .iter()
        .map(|call| s.spawn(move || this.execute(call)))
        .collect();
    // ...
});
```

如果模型在一轮里同时调用两次 `memory_save`，两个线程会各自 `load` 到同一份旧列表，各自追加一条，再先后 `save`。后写的那次覆盖先写的那次，结果是只留下一条记忆。

同样的问题也会出现在 daemon 模式：多个会话共享同一个 `memory_dir`，各自的轮次结束后都会自动提炼，写入时间重叠就会丢更新。

| 场景 | 是否可能并发写 | 后果 |
| --- | --- | --- |
| 单轮单个工具调用 | 否 | 安全 |
| 单轮多个 `memory_save` | 是 | 后写覆盖先写，丢一条 |
| 多个会话同时结束轮次 | 是 | 同上 |
| 主动写入与自动提炼重叠 | 是 | 同上 |

彻底修需要跨进程文件锁，成本不低。轻量一点的方案是「追加日志」：每次写入往文件末尾追加一行 JSON，读取时按序合并去重，避免整文件覆盖。NanoHermes 目前选了最简单的整文件方案，在「模型很少并行写记忆」的假设下可以接受，但这个假设并没有在代码里强制。

## 子代理与多会话：工具共享，注入不共享

子代理有自己的循环，系统提示词是配置里写死的 `def.prompt`，不经过 `Agent::run`：

```rust
let mut messages: Vec<Value> = vec![
    json!({ "role": "system", "content": def.prompt }),
    json!({ "role": "user", "content": task }),
];
```

所以子代理不会检索记忆，也不会在结束时提炼记忆。但它的工具调用走的是父代理的 `self.execute`，共享同一个 `Ctx`，因此 `memory_save` 和 `memory_search` 仍然可用，写入的也是同一个库。

| 能力 | 主代理 | 子代理 |
| --- | --- | --- |
| 每轮检索并注入记忆 | 是 | 否（系统提示词固定） |
| 轮次结束自动提炼 | 是 | 否（用的是自己的循环） |
| 调用 `memory_save` / `memory_search` | 是 | 是（共享 `Ctx`） |
| 写入同一个 `memory.json` | 是 | 是 |

这个设计有利有弊：好处是子代理可以主动查记忆、写记忆，不用把记忆块塞进它有限的上下文；坏处是子代理不知道用户的长期偏好，除非父代理在任务描述里显式带上。

daemon 模式的隔离则是另一层：每个会话 id 对应一个独立的消息数组，通过 `replace_messages` 切换。记忆库不按会话隔离，所有会话共享。这符合「长期记忆是用户的，不是会话的」这个直觉，但也意味着一个会话写进去的临时教训，会出现在另一个会话的检索结果里。

## 关闭记忆之后会发生什么

配置里 `memory` 默认是 `true`。关掉之后，`Ctx.memory_dir` 被置为 `None`：

```rust
memory_dir: if cfg.memory {
    cfg.memory_dir.clone().or_else(memory::default_dir)
} else {
    None
},
```

于是三件事同时发生：

| 行为 | 关闭后的表现 |
| --- | --- |
| 每轮检索注入 | `Agent::run` 里的 `if let Some(dir)` 不成立，跳过 |
| 轮次结束提炼 | `completed && self.cfg.memory` 不成立，跳过 |
| 记忆工具 | 仍然出现在工具列表里，调用返回 `long-term memory is disabled (settings)` |

第三点是一个不对称：工具声明没有按 `memory_dir` 过滤，`build_tools` 只按权限模式过滤。模型可能看到一个可用工具，调用后却收到错误。更一致的做法是在关闭记忆时把两个工具从列表里去掉，避免模型浪费一次调用。

这个不对称也解释了为什么关闭记忆不会删除任何数据：`memory.json` 原封不动，重新打开后旧记忆立刻恢复。开关控制的是「读写行为」，不是「存储生命周期」。

## 九个单元测试在守什么

`memory.rs` 自带九个测试，全部是纯函数或临时目录，不依赖网络和模型：

| 测试 | 守住的约束 |
| --- | --- |
| `tokenize_handles_cjk_bigrams_and_ascii_words` | 英文小写成词、中文二元切分 |
| `round_trips_through_the_store_and_dedupes` | 写入、读回、标点差异去重、包含去重 |
| `trims_oldest_lessons_before_touching_preferences` | 满 500 条时偏好不被淘汰 |
| `bm25_ranks_relevant_entries_first` | 相关条目排第一、无关条目不出现 |
| `block_round_trip_replaces_instead_of_accumulating` | 注入块替换而不是累加、空块删除旧块 |
| `parses_distill_output_tolerantly` | 围栏、废话、对象包装、未知类别、空输出 |
| `distill_gate_skips_small_talk_but_keeps_corrections` | 寒暄跳过、纠正放行、工具轮次放行 |
| `tools_save_and_search_work_against_a_store` | 主动写入、重复提示、检索命中、空结果 |
| `excerpt_skips_system_and_images` | 跳过系统消息与图片、保留文本 |

覆盖的空白也很清楚：

1. 没有测试淘汰顺序（这正是上一节那个偏差没被发现的原因）。
2. 没有测试并发写入。
3. 没有测试损坏文件的处理路径。
4. 没有测试摘录只取开头导致的长对话盲区。

这四条都不是「写不出测试」，而是「没人想到会坏」。对一个低频、静默、跨会话的模块来说，这恰恰是最该补的四类测试。

顺带说一个可测试性上的优点：因为检索是纯函数，测试可以直接构造三条记忆、查一个词、断言第一条命中。如果换成向量检索，同样一条断言就要依赖模型版本和浮点误差，稳定性和可读性都会差很多。这是「不接向量库」在测试层面的隐形收益。

## 八个常见记忆陷阱

| 陷阱 | 表现 | 修法 |
| --- | --- | --- |
| 把记忆当聊天记录 | 每条用户消息都写进去，库里全是过程 | 只写跨会话成立的结论，过滤一次性状态 |
| 写「那个文件」 | 检索不到，注入也没用 | 写具体路径、命令、接口名 |
| 只写结论不写触发条件 | 「要小心」这种记忆无法执行 | 写成「做 X 之前先做 Y」 |
| 依赖同义词召回 | 记「上线」，查「部署」零命中 | 写入时带上同义表达 |
| 用「继续」追问 | 查询无命中，记忆块被清空 | 重要偏好提前写在任务描述里 |
| 以为写了就会注入 | 4 条上限 + 零分过滤 + 预算截断 | 把最关键的偏好写得短而具体 |
| 并发写记忆 | 后写覆盖先写，丢条目 | 避免一轮里多次 `memory_save`，或改用追加日志 |
| 文件损坏后继续写 | 旧记忆静默清零 | 备份损坏文件、原子写入 |

这八条里有三条属于「检索器解决不了、只能靠写入质量」的问题。这也是为什么本文花了很多篇幅讲提示词和摘录，而不是只讲 BM25：记忆系统的效果，七成取决于写进去什么，三成取决于怎么检索。

## 怎么验证你的记忆真的在工作

一套可操作的检查清单：

| 步骤 | 命令/操作 | 预期 |
| --- | --- | --- |
| 看库 | 打开 `~/.nanohermes/memory.json` | 有 `entries` 数组，每条四个字段 |
| 看条数 | 数一下数组长度 | 不超过 500 |
| 看长度 | 检查每条 `text` | 不超过 400 字 |
| 写入 | 让 Agent 记住一个偏好 | 工具返回「已记下」，文件新增一条 |
| 重复写 | 同一句话再写一次 | 返回「与已有记忆重复，未新增」，条数不变 |
| 检索 | `memory_search` 查关键词 | 返回带分数的相关条目 |
| 注入 | 新开会话，说一句相关需求 | 会话文件的系统消息里出现 `BLOCK_START` |
| 零命中 | 说「继续」 | 注入块被删除，而不是保留旧内容 |
| 淘汰 | 临时把 `MAX_ENTRIES` 调小跑测试 | 偏好条目仍在，条数等于上限 |
| 损坏 | 把文件改成非法 JSON 再对话 | 对话不报错，但记忆为空（这是隐患，不是特性） |

最后一行值得单独强调：它验证的是「容错」，同时也暴露了「静默清零」。如果你的项目不能接受这种静默，应该先改 `load` 的失败路径，再谈其他优化。

## 小结：记忆是索引，不是仓库

把这篇的结论压缩成四句话：

1. 记忆的价值在检索，不在存储。存了 500 条但一条都用不上，不如存 20 条条条命中。
2. 写入质量决定上限。类别、长度、自包含、跨会话成立，这四条比任何检索算法都重要。
3. 上限必须存在。条数、单条长度、注入条数、注入字符，四个数字互相咬合，缺一个就会在某个场景下失控。
4. 简单方案有明确边界。BM25 接不住同义词，整文件写入接不住并发，损坏即空接不住数据安全——知道边界在哪，比假装没有边界更重要。

NanoHermes 的记忆模块只有几百行，却把「跨会话记住偏好与教训」这件事跑通了。它不完美：摘录取开头、淘汰顺序有偏差、并发会丢更新、损坏会清零。但这些缺陷都是具体的、可定位的、可以逐个修掉的。相比之下，「上向量库」带来的复杂度是弥散的：模型版本、索引重建、隐私边界、离线可用性，每一项都要长期维护。

对个人项目和小团队来说，先用一个 JSON 文件加 BM25 把闭环跑起来，等记忆真的涨到几千条、同义词问题真的成为瓶颈，再考虑向量检索，通常是更划算的顺序。

下一篇进入 04《Agent 工具设计：为什么输出都要有上限》。记忆解决的是「跨会话记住什么」，工具解决的是「单轮里拿回多少」——两者最终都落在同一个预算问题上。
