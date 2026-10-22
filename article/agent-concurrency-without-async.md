---
title: "Agent 并发：不用 async 运行时怎么并行"
slug: agent-concurrency-without-async
cover_image: /photos/agent-concurrency-cover.png
date: 2026-10-26
tags: [Agent, Agent 工程, 并发, 架构设计]
---

> 适用读者：给 Agent 加过并行、被死锁或「结果对不上」坑过的人；不想为一个 CLI 工具拖进一整套 async 运行时的人；想知道「一轮里到底能同时跑几件事」的人
> 结论先行：NanoHermes 的并发只有两个原语——作用域线程（`std::thread::scope`）和一把计数闸门（`Mutex` + `Condvar`）。它没有 async runtime，没有取消令牌，也没有消息队列，靠的是「每轮一个 join 屏障」把并发收进一个有界的盒子里
> 阅读时间：约 52 分钟 | 难度：进阶 | 收获：线程并行的四个层次 + 六个并发约束的真实取值 + 七个可以修的缺陷 + 一套可复现的并发验证方法

**目录**

- 前言：并行不是为了快，是为了别让一轮卡死
- 结论先行：并发的四个层次
- 没有 async 的世界：线程就是原语
- 为什么不是 async：四条理由与三项代价
- 一轮的结构：join 屏障
- 一张总表：并发的七个数字
- std::thread::scope 解决了什么
- 为什么 Agent 必须是 Sync
- 共享状态清单：Ctx 里的五把锁
- Mutex 粒度：为什么 Board 用两把锁
- Condvar 与 Gate：并发门的十二行实现
- 门的位置错了：先登记后排队
- 子代理：并行的第一类真实用户
- 子代理内部为什么又是串行
- 子代理的四处越界：中断、上限、模型、白名单
- 工具线程没有上限
- 结果顺序：为什么必须按调用顺序回填
- 一个线程 panic 了会怎样
- 不是所有工具都该并行
- 并发下的审批：stdin 只有一份
- 后台任务：另一种并发
- 后台任务的第一个缺陷：stderr 从未被读走
- 后台任务的第二个缺陷：在锁里读到 EOF
- 管道背压：最容易误判成死锁的现象
- 中断：抢占点只有一个
- 中断与并发的交叉：Ctrl-C 打断的是哪一层
- 守护进程：并发为零
- 为什么单线程 daemon 仍然能用
- 七个可以修的缺陷
- 怎么验证并发真的正确
- 并发设计的六条原则
- 小结：并行是边界问题，不是性能问题

## 前言：并行不是为了快，是为了别让一轮卡死

先纠正一个常见误解：Agent 做并发，首要目标不是「跑得更快」。

一个 coding agent 的绝大多数时间花在两件事上：等模型返回，和等命令跑完。模型调用是串行的——你必须拿到这一轮的 `assistant` 消息，才知道要调哪些工具。所以真正能并行的窗口只有一个：**同一次模型回复里给出的多个工具调用**。

这个窗口很小，但它决定了体验的下限。模型一次给出四个 `read_file` 和一个 `grep`，如果串行执行，一次探索要等五倍的时间；如果其中一个 `run_command` 卡住（等一个永远不返回的服务），串行实现会把后面四个结果一起拖死。并行在这里的作用是**把最慢的那个变成整批的耗时，而不是总和**，同时让「一个慢工具」不再阻塞其他工具的结果。

但并行一旦引入，问题就从「快不快」变成「对不对」：结果顺序会不会错、共享状态会不会被踩、Ctrl-C 到底打在哪一层、一个线程挂了整轮会不会崩。NanoHermes 的答案很朴素：不用 async 运行时，就用 `std::thread::scope` 起线程，用一个 `join` 屏障收口，用一把计数门限制子代理数量。全文拆的就是这套朴素方案里每一处必须想清楚的地方。

## 结论先行：并发的四个层次

把「并行」这个词拆开，NanoHermes 里其实有四层不同的东西，混在一起谈就会得出错误结论。

| 层次 | 实现 | 并发度 | 谁在等谁 |
| --- | --- | --- | --- |
| 工具级 | `std::thread::scope` 每个 `tool_call` 一个线程 | 无上限 | 主线程等全部线程 join |
| 子代理级 | `Gate::new(4)` + `Condvar` | 最多 4 个 | 抢到许可的线程等许可 |
| 命令级 | `run_command` 两个排空线程 + 25ms 轮询 | 2 个读线程 | 主线程等子进程退出 |
| 进程级 | `listener.incoming()` 同步处理 | 1 | 下一个请求等上一个跑完 |

四层的数字完全不同：工具层没有上限，子代理层是 4，命令层是 2，进程层是 1。所以「NanoHermes 支持多少并发」这个问题没有单一答案——正确答案是「一个守护进程一次服务一个会话，一个会话一轮最多并发执行模型给出的所有工具调用，其中子代理最多 4 个同时跑」。

这四层里最容易出事的是第一层，因为它是唯一没有上限的一层。后面会专门讲。

## 没有 async 的世界：线程就是原语

整个并发实现依赖的标准库能力只有五个：

| 原语 | 用在哪 | 为什么用它 |
| --- | --- | --- |
| `std::thread::scope` | 一轮内的工具调用 | 能借用 `&Agent`，不需要 `Arc` |
| `Mutex` | `Board`、`TaskManager`、`TodoList`、MCP 管道 | 保护可变状态 |
| `Condvar` | `Gate` | 许可不足时阻塞等待 |
| `AtomicBool` | `interrupt::INTERRUPTED` | 信号处理器里只能原子写 |
| `mpsc::channel` | MCP 的请求/响应配对 | 读线程把响应投递给等待方 |

没有 `tokio`，没有 `async-std`，没有 `futures`。整个 `agent` crate 的依赖里找不到一个异步运行时。这在 2026 年看起来有点逆潮流，但对这个项目是合理选择——原因下一节讲。

代价也要说清楚：没有取消令牌，所以中断只能在「步骤边界」检查，一个跑着的工具没法被打断；没有 `select!`，所以「命令输出和超时哪个先到」要靠 25ms 轮询；没有结构化并发，所以一个线程 panic 只能靠 `join` 的返回值兜。

## 为什么不是 async：四条理由与三项代价

先讲理由，四条都是这个项目的具体约束，不是「线程更简单」这种泛泛之谈。

**第一，工具几乎全是阻塞调用。** `read_file` 是 `std::fs`，`run_command` 是 `Command::spawn` 加管道读取，`git` 是子进程，`web_fetch` 是 `ureq` 的同步 HTTP。这些操作在 async 里要么用 `spawn_blocking` 包起来（等于还是线程），要么换成异步版的库（`tokio::fs`、`reqwest`），后者会把依赖树扩大一个数量级。对一个「单二进制、零运行时、能塞进 5 MB 里」的 CLI 来说，这个交换不划算。

**第二，并发窗口天然有界。** 一次模型回复里的工具调用数量是有限的（实践中 1 到 8 个居多），而且每轮结束都要 join 全部线程才能拼消息。这意味着线程数量不会随时间累积——不存在「长连接持有线程」的问题。线程池要解决的正是「线程生命周期长于任务」的场景，这里不存在。

**第三，barrier 让状态管理变简单。** 因为每轮有一个 join 屏障，`self.messages` 在整个并行期间都是只读的。主线程在 `join` 全部返回之后才写历史。这一点极其重要：它意味着对话历史不需要任何锁。如果换成 async 加 `select!`，某个工具的 future 可能和历史写入交错，你就必须给历史加锁，或者引入更复杂的所有权设计。

**第四，编译期就能验证。** `Agent` 要能被作用域线程共享，Rust 会强制它 `Sync`。任何一个字段忘了加 `Mutex`，编译器直接报错，不会等到线上才发现数据竞争。async 方案的等价检查是 `Send`，但因为 `await` 点可以出现在任何地方，跨 `await` 持有 `MutexGuard` 这类问题编译器帮不了你。

代价同样要认：

| 代价 | 具体表现 | 缓解方式 |
| --- | --- | --- |
| 无法中途取消 | 工具跑起来就只能等它返回 | 给命令设超时（默认 120s，上限 3600s） |
| 线程栈开销 | 每个线程默认 2 MiB 虚拟栈 | 工具调用数量有界，实际 RSS 远小于峰值 |
| 阻塞门浪费线程 | 排队等许可的子代理占着一个 OS 线程 | 子代理上限 4，排队数受工具调用数限制 |

第二项值得展开：2 MiB 是虚拟地址空间，不是物理内存。Linux 上线程栈是惰性分配的，真正提交的只有实际用到的几页。所以「20 个工具线程 = 40 MB」这个算法是错的，实际 RSS 增加通常在几百 KB 量级。真正贵的不是栈，是每个线程持有的缓冲区（比如 `read_capped` 里 16 KiB 的读缓冲）。

## 一轮的结构：join 屏障

把并发塞进一轮的代码只有十几行，但每一行都有原因：

```rust
let results: Vec<String> = if turn.tool_calls.len() == 1 {
    vec![self.execute(&turn.tool_calls[0])]
} else {
    // 借用成 &Agent，让作用域线程共享（execute 取 &self，Agent 是 Sync）
    let this: &Agent = self;
    std::thread::scope(|s| {
        let handles: Vec<_> = turn
            .tool_calls
            .iter()
            .map(|call| s.spawn(move || this.execute(call)))
            .collect();
        handles
            .into_iter()
            .map(|h| {
                h.join()
                    .unwrap_or_else(|_| "ERROR: tool thread panicked".to_string())
            })
            .collect()
    })
};
```

四个设计点：

**单调用走快路径。** `tool_calls.len() == 1` 时不起线程，直接在当前线程执行。这是最常见的情况（模型一次只调一个工具），省掉线程创建和 join 的开销，也省掉一次 `Sync` 检查带来的心智负担。

**`this: &Agent = self` 这行不是多余的。** `std::thread::scope` 的闭包捕获的是 `&mut self`（因为 `self` 是 `&mut Agent`），而 `spawn` 里的闭包需要 `move`。显式重借用成 `&Agent` 之后，编译器知道移动的是共享引用而不是可变引用，`Agent` 只需要满足 `Sync`。不写这行，编译器会报「cannot move out of `self`」。

**`handles.into_iter().map(join)` 保证了顺序。** 结果向量按下标对齐 `tool_calls`，和哪个线程先跑完无关。这是下一节「结果顺序」的基础。

**`unwrap_or_else` 把 panic 变成字符串。** `join` 返回 `Result`，线程 panic 时是 `Err`。这里不 `unwrap`，而是产出一条错误结果——理由在「一个线程 panic 了会怎样」一节。

整个结构的本质是一个**每轮重建的 fork-join**：起 N 个线程，等 N 个全部结束，拿 N 个字符串，拼进历史。没有线程池，没有任务队列，没有长时间存活的 worker。这种「用完就扔」的模型牺牲了创建开销（Linux 上一个线程创建约几十微秒），换来了状态管理的极大简化。

## 一张总表：并发的七个数字

把所有和并发相关的常量集中起来，能看到一套有意为之的分层：

| 约束 | 值 | 位置 | 管什么 | 超限后 |
| --- | --- | --- | --- | --- |
| `MAX_PARALLEL_SUBAGENTS` | 4 | `agent.rs` | 同时跑几个子代理 | 阻塞排队 |
| 工具线程数 | 无上限 | `run()` 的 scope | 一轮起几个线程 | 无（由模型输出决定） |
| `max_iterations` | 40 | `Config` 默认 | 一轮最多几次模型往返 | 停止并告警 |
| `RESULT_PREVIEW` | 500 | `board.rs` | 结果在任务板的可见量 | 截断加省略号 |
| 命令超时 | 120s（1–3600） | `run_command` | 单条命令最长运行 | 杀进程并标注 |
| MCP 请求超时 | 60s | `mcp.rs` | 一次 MCP 调用等待 | 返回超时错误 |
| 守护进程并发 | 1 | `main.rs` | 同时在服务的请求 | 排队（TCP backlog） |

三个观察：

**只有子代理有并发上限。** 工具线程和守护进程都没有。前者依赖「模型给出的调用数量有限」这个经验假设，后者是明确的单线程设计。两个地方都没有硬保护。

**4 这个数字的来历是资源而不是性能。** 子代理每个都要独立发一次完整的模型请求，4 个并发意味着瞬时 4 份上下文在飞行。上下文预算是 120,000 字符（`CONTEXT_CHAR_BUDGET`），4 份就是 480,000 字符的内存峰值，加上每份都要序列化成 JSON 发出去。再高就开始和主对话抢内存与网络带宽。

**40 轮和 4 个并发叠起来是 160。** 理论上一个子代理可以跑 40 轮、每轮再发多个工具调用，四个子代理同时跑。这不是设计目标，而是上界——一个失控的子代理最多消耗 40 次模型请求，四个最多 160 次。这个上界之所以重要，是因为它给出了「一次误触发的最坏成本」。

## std::thread::scope 解决了什么

普通 `thread::spawn` 要求闭包 `'static`，也就是不能借用栈上的东西。要用 `&Agent`，就得把 `Agent` 塞进 `Arc`，然后每个工具调用都要 `Arc::clone`。`scope` 的作用是引入一个词法作用域：作用域内的线程可以借用作用域外的栈变量，作用域结束时自动 join 所有线程。

三个具体好处：

**没有 `Arc` 开销。** `Agent` 里有一个 `Vec<Value>` 的对话历史、一个 `Ctx`、一个可选的 MCP 管理器。包进 `Arc` 本身不贵，但 `Arc<Agent>` 会让每个工具都想「能不能拿可变引用」，从而诱发 `Arc<Mutex<Agent>>` 这种把整个 agent 串行化的退化设计。`scope` 强制你保持 `&Agent` 共享不可变，共享可变状态只能落在 `Ctx` 内部的锁上——这恰好是正确的粒度。

**作用域结束一定 join。** 就算中间 `?` 提前返回，`scope` 也会在退出时等所有线程结束。这保证了「不可能有线程还在写状态而主线程已经继续」。普通 `spawn` 你需要自己维护 `JoinHandle` 列表，漏一个就是悬空的后台任务。

**panic 不会泄漏线程。** 线程 panic 时 `scope` 依然会 join（拿到 `Err`），不会留下一个已崩溃但未回收的线程。

需要注意 `scope` 不提供的是：**线程数量限制**。代码里是 `turn.tool_calls.iter().map(...)`，调用几个就起几个。模型一次返回 20 个工具调用，就起 20 个线程。这是后面「工具线程没有上限」要展开的缺陷。

## 为什么 Agent 必须是 Sync

`Agent` 能不能被多个线程共享，不是设计选择，是编译器的强制要求。`scope` 里 `this: &Agent` 被 `move` 进闭包，闭包要 `Send`，因此 `&Agent` 要 `Send`，等价于 `Agent: Sync`。

`Agent` 的字段里，只有 `Ctx` 是共享可变状态的载体：

```rust
pub struct Ctx {
    pub root: PathBuf,
    pub auto_approve: bool,
    pub approval: crate::config::ApprovalPolicy,
    pub sandbox: crate::config::SandboxMode,
    pub max_output: usize,
    pub tasks: TaskManager,       // Mutex<HashMap<String, Task>>
    pub todos: TodoList,          // Mutex<Vec<Todo>>
    pub skills: Vec<Skill>,       // 只读
    pub board: Board,             // Mutex<Vec<Job>> + Mutex<u64>
    pub gate: Gate,               // Mutex<usize> + Condvar
    pub memory_dir: Option<PathBuf>,
}
```

前四个字段是不可变的（`root`、`auto_approve`、`approval`、`sandbox`），后三个是锁，`skills` 是只读。`memory_dir` 只是路径，真正的记忆库读写发生在 `memory.rs` 里，走的是文件系统——同一时刻两个线程写同一个记忆文件会有丢失更新的风险，这一点后面「不是所有工具都该并行」里还会提。

`Agent` 的其余字段——`messages`、`usage`、`style`、`session`、`mcp`——要么只在并行区之外被访问（`messages`、`usage`、`session`），要么内部自带锁（`mcp` 的 `Arc<Mutex<...>>`）。`style` 里包的 `UiSink` 是 `Arc<dyn Fn + Send + Sync>`，本身就是线程安全的。

这个字段划分直接决定了并发的安全性：**并行区里能改的东西，只有 `Ctx` 里那五把锁保护的部分**。任何需要写 `messages` 的逻辑都必须回到主线程，而主线程在 join 屏障里等着。这是「用结构换正确性」的典型做法。

## 共享状态清单：Ctx 里的五把锁

逐个看这五把锁保护什么，会发现问题不是「有没有锁」，而是「锁的粒度对不对」。

| 锁 | 保护的数据 | 典型操作 | 争用程度 |
| --- | --- | --- | --- |
| `TaskManager.tasks` | `HashMap<String, Task>` | 起任务、读输出、杀任务 | 中（每个后台工具调用） |
| `TodoList.items` | `Vec<Todo>` | 整体替换、读取 | 低 |
| `Board.jobs` | `Vec<Job>` | 登记、结算、快照 | 中（每个子代理） |
| `Board.seq` | `u64` | 自增取号 | 高（每个子代理，但极短） |
| `Gate.active` | `usize` | 取许可、还许可 | 高（每个子代理） |

争用程度最高的是后两把，但它们的临界区都只有几行——`Board::seq` 是 `*seq += 1` 加一次 `format!`，`Gate::active` 是一次比较加一次自增。真正可能长时间持有的是 `TaskManager.tasks`，因为它把「读管道」放在锁里，这一点后面专门讲。

`Board` 用两把锁而不是一把，是个值得说的细节：

```rust
pub struct Board {
    jobs: Mutex<Vec<Job>>,
    seq: Mutex<u64>,
}
```

如果合并成一把锁，`start()` 里就要持锁做 `format!("agent-{seq}")`（一次堆分配）和 `task.to_string()`（可能很长）。分成两把之后，取号和登记各自临界区极短，而且 `start()` 里两次 `lock()` 的顺序是固定的（先 `seq` 后 `jobs`），不存在反向获取路径，所以不会死锁。

代价是「取号和登记之间不是原子的」：并发 `start()` 时可能出现 `agent-3` 先被登记、`agent-2` 后被登记的顺序。`list()` 返回的是登记顺序，所以任务板上的 id 可能不是单调递增的。这是个无害的瑕疵——id 只用来标识，不用来排序。

## Mutex 粒度：为什么 Board 用两把锁

延续上一节的思路，锁粒度设计有三个层次，`Ctx` 里三种都有：

**粗粒度：一把锁保护整个集合。** `TodoList` 和 `TaskManager` 都是这种。`todo_write` 语义是「整体替换」，所以一把锁最自然——读和写都需要看到完整列表。

**中粒度：一个逻辑实体一把锁。** `Board` 把「取号」和「作业表」分开。取号是高频极短操作，作业表是低频较长操作，混在一起会让 `start()` 的临界区被 `task` 字符串的复制拖长。

**细粒度：每个条目一把锁。** NanoHermes 没有用这种。在 `TaskManager` 里，如果每个 `Task` 自带一把锁，`task_output(task1)` 就不会阻塞 `task_kill(task2)`。这正是 `TaskManager` 当前最大的问题——后面会展开。

判断粒度是否合适的标准不是「锁够不够细」，而是「**有没有一条路径会在持锁期间做阻塞 I/O**」。`Board` 的临界区全是内存操作，粒度怎么分都对；`TaskManager` 的 `output()` 在锁里调 `read()`，这时候粒度就是错的，再细也没用，必须改结构。

## Condvar 与 Gate：并发门的十二行实现

限制子代理并发的是一个手写的计数信号量，全部实现不到二十行：

```rust
pub struct Gate {
    active: Mutex<usize>,
    cv: Condvar,
    max: usize,
}

impl Gate {
    pub fn new(max: usize) -> Self {
        Gate {
            active: Mutex::new(0),
            cv: Condvar::new(),
            max: max.max(1),
        }
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
```

三个细节值得单独说。

**`while` 而不是 `if`。** `Condvar::wait` 可能被虚假唤醒（spurious wakeup），返回时条件不一定成立。用 `while` 循环重新检查是标准写法。很多教程用 `if`，在 Linux 上通常也能跑，但那是运气。

**`max.max(1)`。** 配置成 0 会被抬成 1，否则 `acquire()` 永远等不到许可，整轮死锁。这是一个「宁可多跑一个，也不要卡死」的降级选择。

**`GateGuard` 用 `Drop` 还许可。**

```rust
impl Drop for GateGuard<'_> {
    fn drop(&mut self) {
        let mut active = self.gate.active.lock().unwrap();
        *active = active.saturating_sub(1);
        self.gate.cv.notify_one();
    }
}
```

`Drop` 保证四条路径都会还许可：正常返回、`?` 提前返回、`panic` 展开、以及 `run_subagent` 里 `match` 的任一个分支。这是 RAII 在并发里最重要的价值——不需要在每条返回路径上手写 `release()`。

`notify_one` 而不是 `notify_all`：每次释放只多出一个空位，唤醒一个等待者正好。用 `notify_all` 会造成「惊群」——所有等待者醒来抢同一把锁，只有一个能拿到许可，其余重新睡回去。

## 门的位置错了：先登记后排队

`Gate` 的实现是对的，但它的**调用位置**有问题：

```rust
fn run_subagent(&self, name: &str, task: &str) -> Result<String, String> {
    let id = self.ctx.board.start(name, task);   // 先登记
    let _permit = self.ctx.gate.acquire();       // 再排队
    let result = self.run_subagent_inner(name, task);
    match &result {
        Ok(text) => self.ctx.board.finish_ok(&id, text),
        Err(err) => self.ctx.board.finish_err(&id, err),
    }
    result
}
```

`start()` 在前，`acquire()` 在后。后果有两个：

**第一，任务板上的状态是假的。** `Board::start` 把新作业登记成 `JobStatus::Running`。但如果此刻已经跑着 4 个子代理，第 5 个会卡在 `acquire()` 上——它一行代码都没执行，任务板却显示 `[running]`。模型调 `agent_list` 看到的是一排 `running`，其中有一半在排队。它无从区分「真在跑」和「在等许可」。

**第二，`duration` 把排队时间算进去了。** `Job` 里的 `started: Instant` 在 `start()` 时记录，`finish()` 里用 `job.started.elapsed()` 算时长。所以一个排队 30 秒、实际执行 2 秒的子代理，任务板会显示 32.0s。这个数字会误导任何基于任务板做的性能判断。

修法很简单：加一个 `Queued` 状态，并让 `start()` 接受状态参数。

```rust
let id = self.ctx.board.enqueue(name, task);   // 登记为 Queued
let _permit = self.ctx.gate.acquire();
self.ctx.board.mark_running(&id);              // 拿到许可再改状态
```

同时把 `started` 的赋值挪到 `mark_running` 里，`duration` 就只算执行时间。改动不超过 20 行，但让任务板从「大致对」变成「可以直接用来判断卡在哪」。

为什么原实现会写成这样？因为最自然的顺序是「先登记再干活」——你要先有 id 才能结算。而门是后来加的，加的时候就在登记的下一行插了一句 `acquire()`，没有人回头看状态机的语义。这是并发改造中最常见的错误类型：**在已有流程里插入一个阻塞点，但没有重新检查这个阻塞点上游已经做了什么**。

## 子代理：并行的第一类真实用户

工具调用并行是「同一批里各干各的」，子代理是「同一个任务分给几个人」。两者的区别在于子代理内部还会再发起模型请求和工具调用。

一个子代理的完整生命周期：

| 阶段 | 代码 | 共享状态 |
| --- | --- | --- |
| 登记 | `board.start(name, task)` | `Board.jobs`、`Board.seq` |
| 排队 | `gate.acquire()` | `Gate.active` |
| 组配置 | `self.cfg.clone()` + 模型覆盖 + 关流式 | 无（纯本地） |
| 组工具 | `build_tools()` 按 `allowed_tools` 过滤，去掉 `subagent` | 无 |
| 组消息 | 一条 system（子代理 prompt）+ 一条 user（任务） | 无 |
| 循环 | `llm::chat` → 执行工具 → 追加结果，最多 40 轮 | `Ctx` 的五把锁 |
| 结算 | `finish_ok` / `finish_err` | `Board.jobs` |

关键点在于**子代理不持有父代理的对话历史**。它只拿到两样东西：自己的 system prompt（来自配置文件的 `prompt` 字段）和一句任务描述。这是子代理能真正并行的前提——如果它要继承父对话，四个子代理就要各自复制一份 120,000 字符的历史，内存和 token 成本会立刻爆炸。

代价是信息不对称：子代理不知道父代理之前试过什么、失败了什么。所以 `subagent` 工具的描述里写着「用于评审、测试、调研，或者任何能从专注专家中获益的任务」——它适合「有明确输入输出的独立子任务」，不适合「接着上一步继续改」。

`Board` 记录了每个子代理的任务原文和结果预览（500 字符），父代理通过 `agent_list` 能看到一张进度表：

```rust
for job in jobs {
    let duration = match job.duration {
        Some(d) => format!("{:.1}s", d.as_secs_f64()),
        None => "…".to_string(),
    };
    out.push_str(&format!(
        "- {} [{}] {} ({}) — {}\n",
        job.id,
        job.status.as_str(),
        job.name,
        duration,
        job.task
    ));
}
```

这张表的设计意图是「让模型自己判断要不要继续等」。如果两个子代理都 `done`，一个还 `running` 且已经 40 秒，模型可以选择先处理已完成的结果。这是把调度权交回模型，而不是在代码里写死「等全部完成」。

## 子代理内部为什么又是串行

`run_subagent_inner` 里的工具循环是串行的，代码里还专门写了一行注释：

```rust
// 子代理的工具调用按顺序执行（子代理本身已经受限）。
for call in &turn.tool_calls {
    let out = self.execute(call);
    messages.push(json!({
        "role": "tool",
        "tool_call_id": call.id,
        "content": out,
    }));
}
```

理由有三条，都成立：

**第一，嵌套并行会指数放大线程数。** 父代理起 4 个子代理，每个子代理再起 5 个工具线程，就是 24 个线程。如果子代理还能再分子代理（代码里已经把 `subagent` 工具过滤掉了，所以不会），理论上是 4 的幂。串行是一种「在嵌套层主动降级」的策略。

**第二，子代理的工具调用数量通常很少。** 子代理是「专注专家」，它的 prompt 会把任务收窄，所以一轮里往往只有一两个工具调用。并行的收益本来就小。

**第三，也是真正的原因：子代理本身已经并行了。** 四个子代理同时跑，每个内部串行——总并发度是 4，已经吃满了这部分收益。再往内层并行，收益递减而复杂度和线程数线性增长。

代价也要认：如果一个子代理内部串行跑了 5 个各 20 秒的命令，它就要 100 秒；这四个子代理里最慢的那个决定整轮耗时。所以「子代理内部串行」这个决定，把最坏情况从「最慢的单个工具」变成了「最慢的子代理内部工具之和」。

这条注释里还藏着一个措辞问题：原文是英文 `(sub-agents are bounded)`，「bounded」指的是并发度受限，但读起来容易被理解成「子代理的工具调用数量有上限」——实际上没有。子代理的工具调用数量和父代理一样，完全由模型输出决定。注释应该写成「子代理的并发度已经由 Gate 限制，内部再并行会放大线程数」。

## 子代理的四处越界：中断、上限、模型、白名单

子代理虽然共享 `&self`，但有四处「以为继承了，其实没有」的地方，每一处都是真实的行为差异。

**第一处：中断。** 父代理的 `run()` 每轮开头检查 `crate::interrupt::take()`，但 `run_subagent_inner` 的循环里**没有任何中断检查**。这意味着 Ctrl-C 之后：

```rust
for _ in 0..sub_cfg.max_iterations {
    let turn = llm::chat(&sub_cfg, &messages, &tools, |_| {})?;   // 没有 take()
    // …执行工具…
}
```

子代理会继续把剩下的轮次跑完，最多 40 次模型请求。父代理只能等 `execute()` 返回，才能在下一轮边界看到中断标志。用户按了 Ctrl-C，界面可能还要再等几十秒。

修法：在子代理循环开头加一行 `if crate::interrupt::take() { break; }`。但要注意这会「消费」掉标志——父代理的下一轮检查就看不到了。正确做法是加一个 `peek()`（只读不清），或者让子代理在检测到中断时重新 `request()` 一次再 `break`。

**第二处：轮次上限。** 子代理用的是 `sub_cfg.max_iterations`，而 `sub_cfg` 是 `self.cfg.clone()`，也就是**父代理的 40 轮**。子代理没有独立的上限配置。这意味着「一个子代理最多跑 40 轮」是硬编码出来的，不能调。合理的做法是给 `SubAgentDef` 加一个 `max_iterations` 字段，默认取一个小得多的值（比如 10），因为专注子任务本来就不该长跑。

**第三处：模型覆盖只作用于模型调用。** `sub_cfg.model` 覆盖了模型名，但工具执行走的是 `self.execute(call)`，用的是**父代理的 `Ctx`**：同一个 `max_output`、同一个 `auto_approve`、同一个 `sandbox`、同一个任务板。这是对的——工具行为应该一致——但会导致一个反直觉的结果：子代理配置了「便宜的小模型」，但它的工具输出仍然按父代理的 20,000 字节预算返回，小模型可能根本读不完。

**第四处，也是最严重的一处：`allowed_tools` 只是广告，不是闸门。** 子代理的工具列表是这样过滤的：

```rust
let tool_list: Vec<Value> = if !def.allowed_tools.is_empty() {
    all_tools
        .as_array()
        .cloned()
        .unwrap_or_default()
        .into_iter()
        .filter(|t| { /* tname 在 def.allowed_tools 里 */ })
        .collect()
} else {
    all_tools.as_array().cloned().unwrap_or_default()
};
```

它只影响**发给模型看的工具列表**。真正的执行前检查是 `self.cfg.check_tool(&call.name)`，用的是**父代理的**允许/禁止列表，和 `def.allowed_tools` 毫无关系。所以只要模型输出了 `run_command` 这个工具名（哪怕它没被广告出去），并且父配置允许，命令就会真的执行。

模型会不会输出没被广告的工具名？正常情况下不会，但它会——历史里出现过、别的子代理用过、或者纯粹幻觉。这是个「靠模型自律」的边界，而白名单的意义正是**不靠模型自律**。

修法很直接：把 `allowed_tools` 传进执行路径。最小改动是在 `execute` 上加一个可选的白名单参数，或者给子代理包一层 `Ctx` 的子视图（把 `Ctx` 的字段变成可覆盖的）。后者更干净，但要改 `Ctx` 的结构，是几小时而不是几分钟的工作。

## 工具线程没有上限

回到第一层。这一层的并发度是 `turn.tool_calls.len()`，代码里没有任何上限：

```rust
let handles: Vec<_> = turn
    .tool_calls
    .iter()
    .map(|call| s.spawn(move || this.execute(call)))
    .collect();
```

模型一次返回几个，就起几个线程。这个数字完全由模型输出决定，而模型输出又受工具数量和上下文长度影响。理论上一个「读 30 个文件」的批量任务会让模型一次给出 30 个 `read_file` 调用。

为什么没加上限？因为实践里几乎不会发生：模型的输出长度有限，而每个工具调用都要占几十个 token 的 JSON，30 个调用就要吃掉一两千 token。大多数模型在生成这么多调用之前就会先停下来观察结果。

但这个「几乎不会发生」有个例外：**模型被提示词要求批量操作时**。比如你在 `AGENTS.md` 里写「一次性读完全部相关文件」，模型就可能真的生成 20 个调用。这时候：

| 风险 | 表现 |
| --- | --- |
| 线程数暴涨 | 20 个线程各自持有 16 KiB 读缓冲 + 文件内容 |
| 文件描述符耗尽 | 每个 `read_file` 开一个 fd，20 个并发没问题，200 个就可能触顶 |
| 输出总量失控 | 20 个结果各 20,000 字节，一次拼进历史就是 400,000 字节 |

第三项最危险，因为它和上下文预算的交互不直观：`clamp` 保证单个工具输出不超过 20,000 字节，但**没有保证一次批次的输出总量**。20 个结果拼起来可以让 `messages` 直接超过 `CONTEXT_CHAR_BUDGET (120,000)`，触发一次压缩——那次压缩又要多一次模型请求来生成摘要。

修法不是简单地给线程数设个 8，而是**给批次输出设总量预算**：

```rust
let total_budget: usize = 40_000;   // 一次批次的输出总和
let mut used = 0usize;
for (call, result) in turn.tool_calls.iter().zip(results) {
    let remain = total_budget.saturating_sub(used);
    let trimmed = clamp(result, remain);
    used += trimmed.len();
    // …
}
```

线程数上限仍然值得加（比如 16），但它防的是资源耗尽，输出预算防的是上下文爆炸。两个问题不能用一个数字解决。

## 结果顺序：为什么必须按调用顺序回填

`handles.into_iter().map(join)` 的顺序就是 `tool_calls` 的顺序，所以结果向量天然对齐。这个「天然」是设计出来的，不是巧合。

为什么必须对齐？因为回填历史时是 `zip`：

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

这里 `zip` 依赖两个向量**长度相等且顺序一致**。如果并发实现用了 `mpsc::channel` 收集结果（先完成的先投递），顺序就会变成完成顺序。后果不是「结果稍微乱一点」，而是 OpenAI 协议层面的硬错误：每条 `tool` 消息的 `tool_call_id` 必须对应上一条 `assistant` 消息里某个 `tool_calls[].id`，顺序错了模型会收到错配的结果——它以为自己在看 `read_file` 的输出，实际拿到的是 `grep` 的。

更隐蔽的后果：如果实现用了 `join` 但把结果 `filter` 掉了空值，两个向量长度不等，`zip` 会静默截断——最后一条工具调用**没有对应的 tool 消息**。下一次请求发出去就是 400，错误信息是「tool_calls must be followed by tool messages」，而这时你已经在几百行之外了。

所以这里有三条硬规则：

| 规则 | 原因 | 违反后 |
| --- | --- | --- |
| 每个 `tool_call` 恰好一条 `tool` 消息 | 协议要求成对 | 下次请求 400 |
| 顺序与 `tool_calls` 一致 | `zip` 按位置匹配 | 结果错配，模型基于错误信息推理 |
| 结果永远返回字符串，不返回空 | `zip` 会截断 | 同上 |

第三条正是 `unwrap_or_else(|_| "ERROR: tool thread panicked")` 存在的原因——panic 也要产出一条字符串，保持成对。

## 一个线程 panic 了会怎样

`join()` 返回 `Result<T, Box<dyn Any>>`，线程 panic 时是 `Err`。代码选择把它变成一条错误字符串：

```rust
h.join().unwrap_or_else(|_| "ERROR: tool thread panicked".to_string())
```

这个选择意味着：**一个工具的 panic 不会让整轮失败**。其余工具的结果照常回填，模型会看到某一条结果是「ERROR: tool thread panicked」，然后自己决定要不要重试。

这是对的设计，但有一个重要的前提：**panic 时锁不能处于中毒状态**。`std::sync::Mutex` 的语义是，持锁线程 panic 会让锁「中毒」，后续 `lock()` 返回 `Err(PoisonError)`。而代码里到处是 `.lock().unwrap()`：

```rust
let mut jobs = self.jobs.lock().unwrap();
```

一旦某个工具在持 `Board.jobs` 时 panic，之后所有 `agent_list` 调用都会 panic——从「一个工具失败」升级成「任务板永久不可用」。

好消息是这些锁的临界区都很短，而且全是纯内存操作，panic 的概率极低（`format!` 分配失败、切片越界）。真正的风险在 `TaskManager`，因为它在锁里做 I/O——一次管道读取 panic 就能毒死整个任务表。

修法有两种：把 `.unwrap()` 换成 `.unwrap_or_else(|e| e.into_inner())`（忽略中毒，继续用可能不一致的数据），或者改用 `parking_lot::Mutex`（不中毒）。前者零依赖，后者更干净。对一个「工具 panic 已经降级成字符串」的系统来说，忽略中毒是更合适的选择——数据不一致的风险远小于「整个功能永久失效」。

## 不是所有工具都该并行

并行是默认行为，但有些工具组合并行会出错。这不是实现缺陷，而是「工具语义里隐含了顺序」。

| 组合 | 问题 | 后果 |
| --- | --- | --- |
| 两个 `edit_file` 改同一个文件 | 各自读全文、改、写回 | 后写覆盖先写，丢失一处修改 |
| `write_file` + `read_file` 同一文件 | 读到的可能是旧内容 | 模型基于旧内容做判断 |
| 两个 `todo_write` | 语义是整体替换 | 后到的列表完全覆盖先到的 |
| 两个 `run_command` 同时要审批 | 共用一份 stdin | 提示交错，答案错配 |
| `git_commit` + `edit_file` | 提交的内容不确定 | 提交了半成品 |

第一项是最容易踩的。`edit_file` 的语义是「读全文 → 替换 → 写回」，两个并发调用必然产生丢失更新。而模型完全可能在一轮里给出「改 A 文件第 10 行」和「改 A 文件第 20 行」两个调用——它以为这是两个独立操作，实际上是一个读-改-写竞争。

代码层面没有任何保护：`edit_file` 里既不锁文件，也不检查 mtime。所以这不是「理论风险」，而是「只要模型这么干就一定出错」。

修法有三档：

**第一档（最省事）：在工具描述里写清约束。** `edit_file` 的描述里加一句「同一个文件的多处修改请合并成一次调用」。这依赖模型遵守，但成本为零，能消掉大部分情况。

**第二档（中等）：在 `dispatch` 层做同文件串行化。** 维护一个 `HashMap<PathBuf, Mutex<()>>`，`edit_file`/`write_file`/`apply_patch` 进入时先拿对应文件的锁。改动约 30 行，能彻底消除丢失更新。

**第三档（最彻底）：给每个 `tool_call` 标一个「资源」标签，同资源串行、异资源并行。** 这是真正正确的方案，但需要给 24 个工具都标注资源，工作量大。对一个 20 多个工具的项目，第二档是性价比最高的。

顺带说一句：`todo_write` 的「整体替换」语义在并行下还有个额外问题——两个并发的 `todo_write` 谁赢取决于调度，而模型看到的结果里两条都返回了「已写入」，它会以为自己成功更新了两次。这类「都成功但只有一个生效」的情况，是最难查的一类并发问题。

## 并发下的审批：stdin 只有一份

`run_command` 在执行前可能要求确认：

```rust
if crate::sandbox::needs_approval(ctx.auto_approve, ctx.approval, command) && !confirm(command)
{
    return Ok("Command denied by the user. Do not retry it; ask what to do instead.".to_string());
}
```

`confirm()` 的实现是读一行 stdin：

```rust
pub fn confirm(command: &str) -> bool {
    eprint!("Run this command? [y/N] {command}\n> ");
    let _ = io::stderr().flush();
    let mut line = String::new();
    if io::stdin().read_line(&mut line).is_err() {
        return false;
    }
    matches!(line.trim().to_ascii_lowercase().as_str(), "y" | "yes")
}
```

如果一轮里有两个 `run_command` 都需要确认，两个线程会同时进 `confirm()`。后果：

**提示交错。** 两个 `eprint!` 会混在一起，用户看到的是两行粘在一起的提示，分不清哪个是哪个命令。

**答案错配。** 两个线程都在 `read_line`，用户输入一个 `y`，可能被任意一个线程读走。另一个线程继续等，用户以为已经确认过了，实际上第一条命令还没跑。

**在非交互环境直接失败。** stdin 不是 TTY 时（CI、管道），`read_line` 会返回 EOF 或者读到无关数据，两条命令都被拒。

这不是一个理论问题。默认配置下 `needs_approval` 对危险命令返回 true，而模型完全可能一次给出「跑测试」和「跑构建」两个命令。

修法：把审批收到主线程。并行区里遇到需要审批的调用，先挂起（返回一个「待审批」标记），等所有线程 join 之后，主线程串行地一个个问，问完再补跑。这需要把 `execute` 拆成「可并行部分」和「需审批部分」两段，改动不小。

低成本替代方案：加一把全局的 `Mutex<()>` 把 `confirm()` 包起来。这样提示不会交错，但「等用户输入时整轮卡住」的问题还在——只是从「互相踩」变成「排队踩」。对交互式 CLI 来说这已经够用了，因为用户输入本来就是串行的。

## 后台任务：另一种并发

前面的并发都是「同时做，然后一起收」。后台任务是另一种：**先返回，稍后再收**。

```rust
pub fn spawn(&self, command: &str, cwd: &Path, sandbox: SandboxMode, workspace: &Path)
    -> Result<String, String> {
    let mut cmd = super::shell::shell_command(command);
    cmd.current_dir(cwd)
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    // …
    let child = cmd.spawn().map_err(|e| format!("failed to start shell: {e}"))?;
    // …
    self.tasks.lock().unwrap().insert(id.clone(), task);
    Ok(id)
}
```

`spawn` 立即返回一个 task id，模型可以用 `task_output` 轮询、用 `task_kill` 终止。这解决了一类具体问题：跑测试、跑构建、起开发服务器——这些命令要几十秒到几分钟，阻塞在一轮里既浪费上下文（模型只能干等），又可能超时。

但这个模块有两个真实缺陷，都是并发相关的，且都不是「理论风险」。

## 后台任务的第一个缺陷：stderr 从未被读走

`spawn` 里给 stderr 也接了管道：

```rust
.stderr(Stdio::piped());
```

但 `output()` 只排空 stdout：

```rust
// 排空 stdout。
if let Some(child) = task.child.as_mut() {
    if let Some(mut out) = child.stdout.take() {
        let (kept, total) = read_capped(&mut out);
        task.out_buf.extend_from_slice(&kept);
        task.out_total += total;
        child.stdout = Some(out);
    }
    // 检查是否结束。
    match child.try_wait() { /* … */ }
}
```

stderr 的管道从头到尾没有任何人读。后果分两步：

**第一步：stderr 写满 64 KiB 时子进程阻塞。** 管道的内核缓冲区默认 64 KiB（Linux）。子进程往 stderr 写满 64 KiB 之后，`write` 系统调用就会阻塞，直到有人读走。而没有人读，所以它永远不会解除。

**第二步：任务永远不结束，`task_output` 永远显示 running。** 而且此时 stdout 也没有新数据，`task_output` 返回 `(no output yet)`。模型会以为任务还在跑，继续等——直到轮次上限。

哪些命令会踩到？任何 stderr 输出超过 64 KiB 的：`cargo build` 的编译警告、`npm install` 的进度条、`pytest -v` 的失败堆栈。这些恰好是后台任务最常用的场景。

修法很直接：起一个线程排空 stderr，把内容追加到独立的缓冲区（或者合并到 `out_buf` 并标注来源）。

```rust
let stderr = child.stderr.take().unwrap();
let buf = Arc::clone(&shared_err_buf);
std::thread::spawn(move || {
    let (kept, _total) = read_capped(stderr);
    buf.lock().unwrap().extend_from_slice(&kept);
});
```

这正好是 `shell.rs` 对前台命令做的事——同一个问题，两处实现，一处对一处错。后台任务这里大概是「先实现最小可用版本，后来忘了补」。

## 后台任务的第二个缺陷：在锁里读到 EOF

第二个缺陷更隐蔽，因为它藏在 `read_capped` 的循环条件里：

```rust
pub fn output(&self, task_id: &str) -> Result<String, String> {
    let mut map = self.tasks.lock().unwrap();          // ← 持锁
    let task = map.get_mut(task_id).ok_or_else(…)?;
    if let Some(child) = task.child.as_mut() {
        if let Some(mut out) = child.stdout.take() {
            let (kept, total) = read_capped(&mut out); // ← 在锁里阻塞读
            // …
        }
    }
    // …
}
```

`read_capped` 的循环是「一直读到 `Ok(0)`（EOF）或者出错」。对于一个**还在运行且暂时没有输出**的后台任务，stdout 是打开的、没有数据，`read()` 会**阻塞**——它既不返回 0，也不返回错误，就一直等下去。

所以：`task_output(task-1)` 在一个安静运行的任务上会挂住（直到那个任务产生输出或退出）。而在挂住期间，`self.tasks` 的锁一直被持有，于是：

| 操作 | 结果 |
| --- | --- |
| `task_list` | 阻塞（等锁） |
| `task_kill` | 阻塞（等锁） |
| 新的 `run_command(background=true)` | 阻塞（等锁） |
| 另一个 `task_output` | 阻塞（等锁） |

一次「看一眼有没有输出」的轮询，把整个后台任务子系统冻住了。这是个典型的**在临界区里做阻塞 I/O** 的错误——锁的粒度本身没错，错的是锁里放了不该放的东西。

这也解释了为什么前台 `run_command` 没这个问题：它把读管道放在**独立线程**里（`let out_thread = std::thread::spawn(move || read_capped(out_pipe))`），主线程只做 25ms 轮询 `try_wait()`，从不阻塞在读上。同一份 `read_capped`，放在线程里就是对的，放在锁里就是错的。

修法：把「读」移到线程里，锁里只做「取缓冲区快照」。

```rust
// spawn 时就起好两个读线程，持续把数据写进 Arc<Mutex<Vec<u8>>>
// output() 只做：
let map = self.tasks.lock().unwrap();
let task = map.get(task_id).ok_or_else(…)?;
let text = task.buf.lock().unwrap().clone();
let finished = task.child.try_wait()…;
```

这样 `output()` 的临界区只有内存拷贝，不会再阻塞。

## 管道背压：最容易误判成死锁的现象

上面两个缺陷的共同根源是**管道背压**（backpressure）：管道的缓冲区有限，写满之后写方阻塞，直到读方取走数据。

这个机制在并发代码里制造了一类特别难查的现象：**程序看起来死锁了，其实是有一方在等另一方，而另一方在等一个永远不会到来的读**。

三种典型形态：

| 形态 | 表现 | 根因 |
| --- | --- | --- |
| 只读 stdout 不读 stderr | 命令卡住，stdout 无输出 | stderr 写满 64 KiB |
| 持锁读管道 | 所有任务操作卡住 | 锁被一个阻塞的 `read` 持有 |
| 先 wait 再 read | 命令永不结束 | 输出写满缓冲区，子进程无法退出 |

第三种是经典错误，也是 `shell.rs` 里那行注释存在的原因：

```rust
// 两个管道各用一个线程排空，这样喋喋不休的子进程永远不会因为写满
// OS 管道缓冲、而我们还在等它退出，造成死锁。
let out_pipe = child.stdout.take().expect("stdout piped");
let err_pipe = child.stderr.take().expect("stderr piped");
let out_thread = std::thread::spawn(move || read_capped(out_pipe));
let err_thread = std::thread::spawn(move || read_capped(err_pipe));
```

如果写成「先 `child.wait()` 拿到退出码，再读管道」，一个输出超过 64 KiB 的命令会：子进程写满缓冲区 → 阻塞在 write → 永远不退出 → `wait()` 永远返回不了 → 你永远走不到读管道那一行。循环等待，真正的死锁。

正确顺序只有一种：**先起读线程，再等退出**。`shell.rs` 做对了，`tasks.rs` 做错了两处（stderr 没读、在锁里读）。加起来是「同一模块内的两处不一致」，这也是为什么本文要用一整节讲背压——它不是边缘知识，而是这类代码的基本功。

还有一个细节值得注意：`read_capped` 在缓冲区满了之后**继续读但丢弃**：

```rust
Ok(n) => {
    total += n;
    if kept.len() < CAPTURE_BYTES {
        let room = CAPTURE_BYTES - kept.len();
        kept.extend_from_slice(&buf[..n.min(room)]);
    }
}
```

不能「读到上限就 break」，因为那会让子进程再次阻塞。必须继续读到 EOF，只是不保留。这就是为什么它返回 `(kept, total)` 两个值——`total` 用来告诉模型「还有多少没显示」。

## 中断：抢占点只有一个

并发引入后，中断的语义变得更难定义：「按 Ctrl-C 到底应该停掉什么」。

NanoHermes 的答案极其保守：**只在一个地方检查中断**。

```rust
for _ in 0..self.cfg.max_iterations {
    // 只在步骤边界中止，保证历史里不会留下「有 assistant tool_calls
    // 但没有对应 tool 结果」的半截状态。
    if crate::interrupt::take() {
        interrupted = true;
        break;
    }
    let turn = self.complete()?;
    // …执行工具…
}
```

「步骤边界」的定义是：一次模型往返加它触发的全部工具执行，整体做完之后。所以在下面这些时刻按 Ctrl-C，都要等到当前步骤结束才生效：

| 时刻 | 生效延迟 |
| --- | --- |
| 模型正在流式输出 | 等这次请求结束 |
| 工具正在跑 | 等所有工具 join |
| 子代理正在跑 | 等子代理跑完（最多 40 轮） |
| 命令正在跑 | 等命令返回或超时（默认 120s） |

这个设计的正当理由写在注释里：如果在工具执行中途中断，历史里会出现「assistant 消息里有 3 个 tool_calls，但只有 1 个 tool 结果」的状态，下一次请求直接 400。所以宁可不响应，也不能破坏历史的一致性。

代价是最坏情况下的等待时间可能是几分钟。缓解手段有两个：`run_command` 的超时（默认 120s，上限 3600s），以及子代理的 40 轮上限。两者都不是为中断设计的，但客观上限制了最坏延迟。

更好的做法是**两阶段中断**：第一次 Ctrl-C 设置标志并打印「正在完成当前步骤，再按一次强制退出」，第二次直接 `exit`。这样既保留了历史一致性，又给用户一个逃生口。实现只需要再加一个 `AtomicUsize` 计数。

顺便说一下中断机制本身：

```rust
static INTERRUPTED: AtomicBool = AtomicBool::new(false);
static DEPTH: AtomicUsize = AtomicUsize::new(0);

#[cfg(all(target_os = "linux", any(target_arch = "x86_64", target_arch = "aarch64")))]
extern "C" fn on_sigint(_sig: i32) {
    INTERRUPTED.store(true, Ordering::SeqCst);
}
```

信号处理器里只能做异步信号安全的事，`AtomicBool::store` 是安全的。`sigsuspend`、`printf`、`malloc` 都不是。这行代码看起来简单，但它必须留在「只做一次原子写」的范围内。

`DEPTH` 的引用计数解决的是嵌套问题：如果外层 `run()` 装了处理器，内层某个东西又调用 `install()`，退出时不能把外层的处理器卸掉。只在 `0 -> 1` 装、`1 -> 0` 卸。

装和卸都由一个 RAII 守卫负责，它在 `run()` 的第一行创建：

```rust
let _guard = InterruptGuard::new();   // 丢弃上一轮残留的标志，再装处理器

impl Drop for InterruptGuard {
    fn drop(&mut self) {
        crate::interrupt::restore_default();   // 引用计数减一，最外层才真的恢复
    }
}
```

这样「提前 `?` 返回」「panic 展开」两条路径都能把处理器卸干净，不会出现「REPL 已经空闲、Ctrl-C 却仍然只是设标志而不退出」的状态。`restore_default()` 里还有一个 `if prev == 0 { return; }` 的保护，防止不配对的 `leave` 把计数减到负数。

## 中断与并发的交叉：Ctrl-C 打断的是哪一层

把上一节和前面的并发层次对上，中断的实际覆盖面是这样：

| 层 | 中断是否生效 | 原因 |
| --- | --- | --- |
| 主循环 | 是（边界处） | `take()` 在每轮开头 |
| 工具线程 | 否 | `execute` 里没有检查点 |
| 子代理 | 否（间接） | 内部无检查，父线程 join 时无法打断 |
| 子进程 | 部分 | 只有超时能杀，Ctrl-C 不会传导 |

「子进程」这一项值得展开。Ctrl-C 对前台 `run_command` 的影响分平台：

**Linux 上**，SIGINT 发给整个进程组（终端驱动），所以子进程也会收到——它自己会退出。但 `run_command` 的主线程正在 25ms 轮询 `try_wait()`，会看到子进程退出，然后正常返回。所以「命令被 Ctrl-C 打断」这件事，在 Linux 上是子进程自己响应 SIGINT，不是 Agent 杀它。

**Windows 上**，`interrupt::install()` 直接返回 false（代码里非 Linux 分支就是 `false`），因为 Windows 没有 `sigaction` 那一套。Ctrl-C 会走默认处置——**整个进程被杀死**，包括 Agent 本身。所以 Windows 上按 Ctrl-C 不是「打断当前轮次」，而是「退出程序」。这是个平台差异，不是 bug，但必须在文档里写清楚，否则用户会以为对话能保住。

**桌面 GUI 上**，没有终端可以送 SIGINT，所以提供了一条进程内路径：

```rust
pub fn request() {
    INTERRUPTED.store(true, Ordering::SeqCst);
}
```

GUI 的「停止」按钮调这个函数，主循环在下一个步骤边界看到标志。所以 GUI 的停止和终端的 Ctrl-C 语义一致，都是「当前步骤做完就停」。

## 守护进程：并发为零

`run_daemon` 的主循环是这样的：

```rust
for stream in listener.incoming() {
    let mut stream = match stream {
        Ok(s) => s,
        Err(e) => { eprintln!("accept error: {e}"); continue; }
    };
    let peer = stream.peer_addr().ok();
    match handle_daemon_request(&mut agent, &mut store, &mut stream) {
        Ok(()) => {}
        Err(e) => { /* 记日志 */ }
    }
}
```

`listener.incoming()` 是一个阻塞迭代器，`handle_daemon_request` 在**当前线程同步执行**。所以：

**进程级并发是 1。** 第二个请求要等第一个处理完，才能从 backlog 里被 `accept`。

**`agent` 是 `&mut`。** 这从类型层面就禁止了并发处理——`handle_daemon_request` 需要可变借用，两个请求不可能同时持有。

**`SessionStore` 是普通 `HashMap`。** 它没有 `Mutex`，因为根本不需要。

这个设计对单用户桌面场景是合理的：你一个人用，一次跑一个任务，不需要并发。但对「多客户端共用一个 daemon」的场景就是瓶颈——两个会话不能同时跑。

为什么仍然能用？因为**真正的并行发生在 Agent 内部**。一个请求处理期间，它内部可能起 4 个子代理、8 个工具线程。所以「进程级并发 1」不等于「同时只有一件事在跑」——一个请求内部可以有很多事同时在跑，只是不能有两个请求同时在跑。

对话隔离的做法是 `X-Session-Id` 头：

| id | 消息向量 | 落盘位置 |
| --- | --- | --- |
| `default` | `store.sessions["default"]` | `--session` 指定的原路径 |
| 任意其他 id | `store.sessions[id]` | `--session` 同目录下的派生文件 |

不同 id 的对话互不可见。但因为处理是串行的，这个隔离是「时间上的隔离」而不是「并发上的隔离」——不需要锁，也不会有竞争。

要支持真并发，最小的改动是把 `for stream in incoming()` 换成每个连接起一个线程，并把 `agent` 包进 `Arc<Mutex<Agent>>`。但那样一来「一个会话一轮跑几分钟」就会阻塞其他会话的模型请求——锁的粒度会变成整个 Agent。更正确的做法是每个会话一个 `Agent` 实例（`SessionStore` 里存 `Agent` 而不是 `Vec<Value>`），这已经是重构级别的改动。

## 为什么单线程 daemon 仍然能用

上一节的结论可能让人担心「这是不是设计缺陷」。分开看：

**它不是性能瓶颈。** 一个 coding agent 的瓶颈是模型延迟（每次请求几秒到几十秒），不是 CPU。串行处理两个请求的代价是「第二个等第一个」，而如果并行处理，第二个也只是在等模型的 HTTP 响应——总时间几乎一样，只是响应顺序不同。

**它简化了状态。** `Agent` 里有一个 `messages` 向量，`style` 里有一个 `UiSink`，`session` 是一个文件路径。这些东西如果并发访问，每一个都要加锁或复制。单线程意味着这些都可以保持「一个请求从头用到尾」的模型。

**它让流式输出变简单。** `stream_turn` 把 `UiSink` 装到 Agent 上，这个 sink 会从工具线程里被调用：

```rust
let out = Arc::new(Mutex::new(out));
let sink_out = Arc::clone(&out);
agent.set_ui_sink(Arc::new(move |ev: UiEvent| {
    // 序列化成一行 NDJSON 写进 socket
}));
```

`Arc<Mutex<TcpStream>>` 让多个工具线程能并发写同一个连接，每次写一行 JSON。如果同时有两个请求共用这个 Agent，sink 就会指向错误的客户端——这是单线程模型的又一个隐性收益。

所以这个设计的真正边界是：**单用户、单任务、可以串行**。超出这个边界就要重构，但在边界内它是对的。

## 七个可以修的缺陷

把全文提到的缺陷集中起来，按「修起来值不值」排序：

| 编号 | 缺陷 | 严重度 | 修法 | 工作量 |
| --- | --- | --- | --- | --- |
| 1 | 后台任务 stderr 从未读走 | 高（任务永久卡住） | 起线程排空 stderr | 20 行 |
| 2 | `task_output` 在锁里阻塞读到 EOF | 高（冻结整个任务表） | 读移到线程，锁里只拷贝 | 40 行 |
| 3 | 子代理的 `allowed_tools` 不参与执行检查 | 高（安全边界失效） | 执行前按白名单校验 | 30 行 |
| 4 | 子代理内部不检查中断 | 中（Ctrl-C 延迟可达分钟级） | 循环开头加 `peek()` | 10 行 |
| 5 | 门在登记之后，排队状态显示成 running | 中（任务板误导） | 加 `Queued` 状态 + `mark_running` | 20 行 |
| 6 | 工具线程数无上限 | 中（资源耗尽 + 上下文爆炸） | 线程上限 + 批次输出预算 | 30 行 |
| 7 | 并发审批共用 stdin | 中（提示交错、答案错配） | 全局锁包住 `confirm()` | 5 行 |

前三个是「会在真实使用中造成可见故障」的，后四个是「在特定条件下出问题」的。

值得注意排序里第 7 项：修法只要 5 行（加一把 `Mutex<()>` 包住 `confirm`），是投入产出比最高的一项。而第 1、2 项虽然工作量也不大，但它们需要改数据结构（`Task` 里要加 `Arc<Mutex<Vec<u8>>>`），会影响 `output`、`list`、`kill` 三个方法。

还有一个不在表里的隐性缺陷：**Mutex 中毒**。所有 `.lock().unwrap()` 在持锁线程 panic 后都会连锁失败。它不在表里，因为触发概率低，但如果触发，后果是「功能永久失效」而不是「一次失败」。改法是 `.unwrap_or_else(|e| e.into_inner())`，或者换 `parking_lot`。

## 怎么验证并发真的正确

并发代码的验证不能靠「跑一遍没崩」。NanoHermes 的做法是一个专门的测试模块：

```rust
/// 并发工具调用路径的线程安全测试。`run()` 为每个 `tool_call` 起一个
/// 作用域线程，全部共享 `&Agent` 并调用 `execute()`。这些测试直接走
/// 那条路径，带 MCP 和不带 MCP 各一份。这样数据竞争会在这里暴露，
/// 而不是在生产环境。
#[cfg(test)]
mod concurrency_tests {
    // …
}
```

两个测试，覆盖两类风险：

**第一类：内置工具的共享状态。** 10 组线程，每组三个工具（`list_dir`、`glob`、`read_file`），共 30 个线程同时跑。验证的是「`Ctx` 里没有被锁保护的可变状态」。

**第二类：MCP 与内置工具混合。** 8 个并发的 MCP `echo`、3 个 MCP 辅助工具（资源、prompt）、2 个内置工具。这一组专门验证 MCP 的 `Arc<Mutex<ChildStdin>>` 和 `Arc<Mutex<HashMap<u64, Sender>>>` 在并发下是否正确配对——8 个并发请求各自期待自己的响应，任何一个 id 错配都会让 `echo-3` 拿到 `echo-7` 的结果，断言立刻失败。

第三个测试是 `Gate` 本身：

```rust
let gate = Arc::new(Gate::new(2));
let concurrent = Arc::new(AtomicUsize::new(0));
let peak = Arc::new(AtomicUsize::new(0));
// 6 个线程抢 2 个许可，记录历史峰值
assert!(peak.load(Ordering::SeqCst) <= 2, "peak was {}", peak.load(Ordering::SeqCst));
assert_eq!(*gate.active.lock().unwrap(), 0, "all permits released");
```

它验证两件事：峰值不超过上限（门有效），结束后计数归零（许可都还了）。第二条尤其重要——如果某个路径忘了还许可，测试会在最后一步失败，而不是等到线上「越跑越卡」。

这套测试的局限要说清楚：

| 局限 | 后果 | 补充手段 |
| --- | --- | --- |
| 靠运气撞竞争 | 可能全部通过但仍有竞争 | 加大线程数、循环多次 |
| 不做内存序检测 | 无法发现微弱的顺序问题 | 用 `-Z sanitizer=thread` 或 Miri |
| 不模拟 panic | 锁中毒路径未覆盖 | 专门的 panic 注入测试 |

更严格的手段是 **Loom**——它穷举所有线程交错，能在几秒钟内找到竞争。代价是要把标准库的 `Mutex`/`Condvar` 换成 Loom 的等价物（通过 `cfg` 切换），代码会变丑。对这个项目，Loom 的收益不足以抵消侵入性，但值得知道它的存在。

实用建议：把并发测试放在单独的 `mod` 里，用 `--test-threads=1` 跑一遍（串行执行测试，减少相互干扰），再用默认并发跑一遍。两遍都过，比跑一遍更有信息量。

## 并发设计的六条原则

把这篇文章的观察压缩成六条，可以直接用在别的项目上。

**第一，先划分并行区，再谈并行度。** NanoHermes 的并行区只有「一次工具批次执行」，边界清晰到可以用一个 `scope` 括起来。并行区之外的任何状态都天然安全。反过来，如果并行区边界模糊（比如「任何时候都可以并发」），你就必须给每一份状态都加锁，复杂度直接翻倍。

**第二，用 join 屏障消灭锁。** 因为主线程在屏障上等，`messages` 在整个并行期间只读，所以不需要锁。这是「用等待换简单」的交易：牺牲一点延迟（等最慢的线程），换掉一整类同步问题。

**第三，任何持锁期间的 I/O 都是错的。** `TaskManager` 的两个缺陷都是这一条的违例。锁的临界区只能有内存操作；I/O 要么放到线程里，要么改成非阻塞加轮询。

**第四，有界并发必须用 RAII 还许可。** `GateGuard` 的 `Drop` 覆盖了所有返回路径，包括 panic。手写 `release()` 一定会漏一条路径，而且漏的那条通常是异常路径——也就是最难测的那条。

**第五，中断点越少，语义越清楚。** 只在一个地方检查中断，换来的是「历史永远一致」。代价是最坏延迟，可以用超时和两阶段中断来缓解。反过来，「到处都能中断」的实现在 Agent 场景里几乎一定会在历史里留下半截状态。

**第六，上下限要分别设计。** 子代理有上限（4），工具线程没有；单个工具输出有上限（20,000 字节），批次总量没有。有上限的地方防的是资源耗尽，没上限的地方靠的是「经验上不会太多」。后者迟早会被一个提示词改动打破，所以要显式检查。

## 小结：并行是边界问题，不是性能问题

回到开头那句话：Agent 做并发，首要目标不是快。

这篇拆下来，真正有价值的不是「怎么起线程」——那只有十几行——而是**边界在哪**：

- 哪些状态可以在并行区被修改（`Ctx` 里的五把锁）
- 哪些操作有界（子代理 4 个，命令 120 秒，MCP 请求 60 秒）
- 哪些操作无界（工具线程数，批次输出总量，子代理轮次）
- 哪些语义在并行下会坏掉（同文件的两个 `edit_file`，两个 `todo_write`，两条要审批的命令）
- 哪些延迟是设计内的（中断只在步骤边界生效，最长等一个完整步骤）

NanoHermes 的实现不完美——本文列了七个可以修的缺陷，其中两个（后台任务的 stderr 和锁内阻塞读）会让功能真的卡死。但它的骨架是对的：一个清晰的并行区、一个 join 屏障、一个 RAII 计数的门、一个只检查一处的中断点。这四样东西加起来不到 60 行，却撑起了整个并发模型。

不用 async 运行时不是一个宗教立场，而是一个成本核算：对这个项目，线程加屏障的总成本（几十微秒的创建开销、一个 2 MiB 的虚拟栈、无法中途取消）远小于引入一整套异步生态的成本（依赖树、跨 `await` 的状态、`Send` 检查的复杂度）。换一个场景——比如需要维持上万条长连接——这个核算就会反过来。

下一篇进入安全：让它跑命令，而不失控。并发解决的是「几件事同时做」，安全解决的是「这几件事能做什么」——两者在 `needs_approval` 那一行代码上相交，而那正是本文第 7 个缺陷所在的位置。
