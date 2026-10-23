---
title: "Agent 评测：只跑一次的测试不算数"
slug: agent-evaluation-not-a-benchmark
cover_image: /photos/agent-evaluation-cover.png
date: 2026-11-11
tags: [Agent, Agent 工程, 评测, 架构设计]
---

> 适用读者：把「跑一次 demo 成功了」当成结论的人；CI 全绿却总被用户第一个问题打脸的人；准备给 agent 加评测却不知道从哪下手的人
> 结论先行：一次通过只是抽样，不是结论。Agent 的输出是「模型 × 工具 × 环境」的联合分布，跑一次只采到一个点。评测要有分母（重复次数）、要有口径（什么叫成功）、要有过程断言（它到底发了什么请求）。NanoHermes 有 90 个单元测试和 5 个端到端用例，但 mock 把请求读出来就丢掉——把 `build_tools()` 改成返回空数组，五个 e2e 仍然全绿
> 阅读时间：约 57 分钟 | 难度：进阶 | 收获：一套四层断言模型 + 通过率的统计口径 + 七个可举证的测试缺口 + 一个能直接照抄的评测目录

**目录**

- 前言：CI 全绿，用户第一次用就崩
- 结论先行：一次通过只是抽样
- 测试、评测、基准不是一回事
- 只跑一次漏掉了什么
- 复合成功率：二十步的 0.95 只剩 0.36
- 通过率需要一个分母
- 十次全过能说明什么
- 零失败只能证明一个上界
- pass@1 与 pass@k 不是同一个数
- flaky 只能靠重复发现
- 评测的最小闭环
- 口径先行：什么叫成功
- 四层断言：字节、过程、结果、成本
- 给 NanoHermes 做一次体检
- 测试盘点：293 个用例的分布
- e2e mock 是怎么搭的
- 它做对了四件事
- 缺口一：请求读出来又丢掉
- 缺口二：测试配置关掉了生产路径
- 缺口三：审批与沙箱被短路
- 缺口四：`Ok` 不等于「完成」
- 缺口五：条件跳过冒充通过
- 缺口六：名字里的断言没落地
- 缺口七：压缩与并发批次没有用例
- 一条恒真断言是怎么写出来的
- 体检结论表：证据、后果、补法
- 补法一：把 mock 变成记录器
- 补法二：三个黄金请求断言
- 补法三：把固定脚本换成状态机
- 补法四：故障注入矩阵
- 补法五：给「完成」一个类型
- 补法六：评测集从事故倒推
- 样本的五个字段
- 评分不是布尔
- 重复怎么跑：次数、种子、并行
- 去 flaky 的六个隔离手段
- 重试只能用来发现，不能用来掩盖
- 成本也是评测指标
- 归因：五类失败与二分法
- 离线评测与线上观测的分工
- 线上采样只存结构，不存内容
- 回归门禁：CI、夜间、人工
- 一个可照抄的目录与命令
- 三个一天能做完的实验
- 五个常见的评测陷阱
- 小结
- 参考

## 前言：CI 全绿，用户第一次用就崩

上一篇结尾留了一个问题：有了账本、懂了成本，下一个问题是「你怎么知道改动让它变好了」。

答案通常被写成「跑个测试看看」。于是就有了下面这一幕：仓库里 95 个 Rust 测试全绿，CI 徽章亮着，发布说明写着「覆盖工具调用往返、流式与非流式回复、瞬时 5xx 重试与硬错误」。用户装上之后，第一句话就让它读一个文件，它读了；第二句让它改，它改错了地方；第三句它开始重复第一句。三轮之后，任务没完成，账单先到了。

问题不在于「测试没用」，而在于**测试回答的问题和用户问的不是同一个**。测试问的是「这条路径会不会崩」，用户问的是「在我这堆输入上，它把事做成的概率是多少」。

这两个问题的差距，就是评测要填的坑。

## 结论先行：一次通过只是抽样

把这句话拆成三句，就是全文的骨架。

第一，Agent 的一次运行只是联合分布里的一个样本。温度、工具返回、文件状态、网络时序、遍历顺序，任何一项变化都会换一条路径。跑一次得到的是「这条路能走通」，不是「这类任务能做成」。

第二，没有分母的通过率不是通过率。10 次里过 10 次，和 10 次里过 7 次，是两种完全不同的系统，但「跑一次，过了」把它们抹成同一个结论。

第三，只看最终答案的测试，看不见 agent 最典型的失效方式：多调了一次工具、少做了一次确认、把整段历史重发了一遍、把失败的那一轮从账本里漏掉。这些都发生在过程里，而过程在请求体里。

所以本文要做的不是「多写几个测试」，而是把「跑一次」升级成「可重复、有口径、能归因」的评测。

## 测试、评测、基准不是一回事

这三个词经常被混用，混用的代价是：你以为自己在做评测，其实只是在做冒烟测试。

| 形态 | 回答的问题 | 样本 | 口径 | 重复 | 典型产物 |
| --- | --- | --- | --- | --- | --- |
| 单元测试 | 这个函数在边界上对不对 | 手写的输入 | 断言相等 | 一次 | 绿色勾 |
| 集成测试 | 这几个模块接起来通不通 | 固定的脚本 | 断言副作用 | 一次 | 绿色勾 |
| 评测 | 这类任务做成的概率是多少 | 一批真实任务 | 通过率 + 过程指标 | N 次 | 分数与区间 |
| 基准 | 两个版本谁更好 | 固定题集 | 相对差值 | 多次 | 排名与差值 |
| 线上观测 | 真实用户遇到了什么 | 全量流量 | 分布与分位数 | 持续 | 看板与告警 |

这张表最重要的一列是「重复」。前三行里只有评测和基准带重复，因为只有它们关心「分布」而不是「这一次」。

第二重要的一列是「口径」。单元测试的口径是编译器给的（相等、不 panic），评测的口径要你自己定：什么算成功，部分成功算不算，超时算不算失败，成本超了算不算失败。口径没定，分数就没有意义。

## 只跑一次漏掉了什么

一次运行会同时掩盖三件事，而且这三件事的掩盖方式不一样。

| 掩盖 | 机制 | 后果 | 只有重复能发现 |
| --- | --- | --- | --- |
| 偶然通过 | 模型这次恰好走了对的路 | 上线后失败率暴露 | 是 |
| 偶然失败 | 环境抖动、端口冲突、时序 | 工程师学会「重跑一次」 | 是 |
| 根本没执行 | 条件跳过、断言恒真、mock 替身太理想 | 绿灯但零覆盖 | 否，靠审计断言 |

第三类最危险，因为它连「偶尔失败」都不会给你，它永远绿。后文会给出这种测试的具体例子：一个在 Windows CI 上永远跳过的沙箱测试，一个两边恒真的断言。

第二类则会训练出一种坏习惯：看到红就重跑。重跑三次取多数，本质上是在用人力做重试策略，而且把「不稳定」这个信号擦掉了。不稳定本身是信息，不该被擦掉。

## 复合成功率：二十步的 0.95 只剩 0.36

Agent 的任务是串行的：读文件、改一处、跑测试、看输出、再改一处。每一步都成功，任务才成功。所以任务成功率是每步成功率的乘积。

| 步数 | 每步 0.99 | 0.98 | 0.95 | 0.90 |
| --- | --- | --- | --- | --- |
| 10 | 0.904 | 0.817 | 0.599 | 0.349 |
| 20 | 0.818 | 0.668 | 0.358 | 0.122 |
| 30 | 0.740 | 0.545 | 0.215 | 0.042 |
| 40 | 0.669 | 0.446 | 0.129 | 0.015 |

这张表解释了一件很反直觉的事：**把单步成功率从 0.90 提到 0.95，二十步任务的成功率是从 12% 提到 36%，翻了三倍**。而把它从 0.95 提到 0.98，是从 36% 到 67%。单步的几个百分点，在任务层是几倍。

它也解释了为什么「跑一次成功」几乎不能说明什么：一次 20 步的成功，在单步 0.95 的系统上本来就有 36% 的概率发生。你观察到的可能只是那 36%。

所以评测的第一个动作不是加样本，而是**数一数这个任务有多少步**。步数决定了你需要多高的单步可靠性，也决定了你应该把重复次数花在哪里。

## 通过率需要一个分母

「通过率 90%」这句话本身不完整。完整的写法至少要有四个字段：

```text
pass_rate = 通过的运行次数 / 总运行次数
任务数     = 12 个真实任务
每任务次数 = 5 次
总运行次数 = 60
通过判定   = 文件内容匹配 + 退出码 0 + 轮数 <= 8
```

换成一句话：**分子是什么、分母是什么、判定是什么、跑了几次**。缺任何一个，这个数字都可以被解释成任意结论。

常见的三种缺分母写法：

- 「我跑了三个 case，都过了」——分母是 3，没有统计意义，但作为冒烟测试是合格的
- 「我们的 eval 是 87 分」——分子分母都不清楚，87 分可能来自 100 个 case 的加权，也可能来自 10 个 case 的主观打分
- 「提升后从 80% 到 85%」——如果各跑了 10 次，这个 5 个点的差值完全在噪声里

最后一条最需要警惕。两个版本的差值，必须和置信区间一起看。

## 十次全过能说明什么

用 Wilson 区间算一下。假设真实通过率未知，你跑了 n 次全部通过，95% 置信区间的下界是这样的：

| 运行次数 n | 全过时的下界 | 换句话说 |
| --- | --- | --- |
| 10 | 72.2% | 真实通过率可能只有七成 |
| 20 | 83.9% | 仍然可能不到九成 |
| 50 | 92.9% | 才开始像「九成以上」 |
| 100 | 96.3% | 可以说「大概率九成五以上」 |

计算用的是 Wilson 分数区间，`z = 1.96`，全通过时下界简化为 `1 / (1 + z²/n)`。这个式子很好记：**分母里的 `z²/n` 就是「样本不够」的罚项**。

所以「跑了十次都过」的正确结论是「失败率大概率低于 26%」，而不是「它很稳」。这个区别在决策时很要命：26% 的失败率意味着每四个用户就有一个踩坑。

## 零失败只能证明一个上界

如果一次失败都没看到，你唯一能说的是「失败率不高于某个值」。这个上界的经典估法是「三倍法则」：n 次零失败，95% 置信上界约为 `3/n`。

| 零失败的次数 | 失败率上界 | 适用结论 |
| --- | --- | --- |
| 10 | 26% | 只能证明「不是必崩」 |
| 30 | 9.5% | 可以接受一个内部工具 |
| 60 | 4.9% | 可以对小范围用户开放 |
| 300 | 1.0% | 才够谈「稳定」 |

反过来，如果你想用 ±5% 的精度估计一个 95% 的通过率，需要多少次？按正态近似 `n ≈ z²p(1-p)/e²`，代入 `p=0.95`、`e=0.05`，得到约 73 次。

这两个数字放在一起，就能回答一个很实际的问题：**你的评测预算够不够支撑你想说的那句话**。如果只跑 10 次，就别在周报里写「通过率 95%」。

## pass@1 与 pass@k 不是同一个数

同一个模型，同一个任务，跑 k 次，只要有一次成功就算过，这叫 pass@k；每次都必须成功，那是 pass@1 的 k 次平均。两者可以差很远。

| 指标 | 定义 | 分母 | 回答的问题 |
| --- | --- | --- | --- |
| pass@1 | 单次运行成功率 | 运行次数 | 用户第一次用会怎样 |
| pass@k | k 次里至少成功一次的比例 | 任务数 | 给用户 k 次机会会怎样 |
| flaky rate | 同一版本上既过又挂的任务占比 | 被重复的任务数 | 系统稳不稳 |
| 完成率 | 明确标记为完成的运行占比 | 运行次数 | 它有没有把事做完 |
| 平均轮数 | 每任务模型请求次数 | 运行次数 | 效率与成本 |

对 agent 来说，最有用的往往不是 pass@1，而是 **pass@1 和完成率的差值**。因为 agent 有一种特有的失败：它「答了」，但没「做完」。后文会看到，NanoHermes 的 `run()` 在轮次耗尽时仍然返回 `Ok`，所以只看返回值，你分不出「做完了」和「跑到上限了」。

pass@k 也不是越高越好。如果一个任务需要 5 次才能成功一次，那它对用户来说仍然是不可用的，因为用户不会跑 5 次。pass@k 适合用来判断「模型有没有这个能力」，不适合用来判断「产品能不能上线」。

## flaky 只能靠重复发现

不稳定（flaky）的定义是：**同一份代码、同一个任务，多次运行结果不同**。这个定义本身就说明，它不可能被单次运行发现。

发现它需要三个条件：同一 commit、重复运行、逐次记录。缺了任何一个，你看到的都只是「这次挂了」或者「这次过了」。

一个可操作的判定：

```text
对每个 case 跑 N=5 次
  5/5 通过        -> stable pass
  0/5 通过        -> stable fail（真 bug）
  1..4/5 通过     -> flaky（最该修的一类）
```

第三类是评测里最有价值的数据。它既不是「功能坏了」，也不是「功能好了」，而是「功能取决于运气」。运气在本地是随机的，在线上是随负载变化的，所以它会在最忙的时候集中爆发。

## 评测的最小闭环

一个能用的评测，最少有六个环节。少一个，它就会退化成「跑一次看看」。

| 环节 | 输入 | 输出 | 常见缺失 |
| --- | --- | --- | --- |
| 采样 | 真实任务或事故 | 一批 case | 只用自己编的玩具任务 |
| 执行 | case + 被测版本 | 每次运行的轨迹 | 只存最终答案 |
| 断言 | 轨迹 + 期望 | 通过 / 降级 / 失败 | 只断言字符串相等 |
| 记账 | 每次运行的指标 | 分子分母、成本 | 不记轮数与字节 |
| 归因 | 失败轨迹 | 失败类别 | 所有失败都叫「模型不行」 |
| 回归 | 基线与新版本 | 门禁结论 | 靠人肉比对 |

「执行」这一环最容易被做薄。多数人只存一个最终字符串，而 agent 的轨迹里有请求体、工具调用序列、每次的 usage、重试次数、耗时。这些不存，后面的归因就无从下手。

## 口径先行：什么叫成功

在写第一行评测代码之前，先把「成功」写成一句可以判定的规则。对 agent 来说，至少要回答四个问题。

第一，**结果对不对**。文件内容是否匹配、命令退出码是否为 0、答案是否包含关键结论。

第二，**过程对不对**。有没有调用不该调的工具、有没有跳过该做的确认、工具调用次数是否在预算内。

第三，**有没有做完**。是正常结束，还是撞上了轮次上限，还是被中断。

第四，**代价是多少**。轮数、请求字节、耗时是否在预算内。

四问里最容易被忽略的是第三问。因为大多数 API 的返回类型只有一个 `Result<String, String>`，而「没做完」既不产生 `Err`，也不产生特殊的字符串。它就静悄悄地混在成功里。

## 四层断言：字节、过程、结果、成本

把上面的四问落成四层断言，从下往上，越往下越稳定，越往上越接近用户。

| 层 | 断言对象 | 例子 | 抓什么 | 稳定性 |
| --- | --- | --- | --- | --- |
| L1 字节层 | 请求体本身 | 请求次数、system 前缀哈希、工具清单 | 上下文膨胀、前缀抖动、工具消失 | 最高 |
| L2 过程层 | 工具调用序列 | 先读后写、没有多余的重试 | 乱序、重复动作、跳过确认 | 高 |
| L3 结果层 | 副作用与答案 | 文件内容、退出码、关键句 | 做错、没做、答偏 | 中 |
| L4 成本层 | 资源消耗 | 轮数、总字节、耗时 | 效率退化 | 高 |

为什么要分四层而不是只写 L3？因为 L3 的失败很难归因。文件内容不对，可能是模型选错了工具，可能是工具本身有 bug，可能是上一步读错了文件，也可能是上下文被压缩掉了关键信息。而 L1 和 L2 能把范围直接缩到一层。

这也是「评测」和「测试」的分水岭：测试通常只写 L3，评测必须写 L1 到 L4，因为评测的目的是**定位**，不只是判定。

## 给 NanoHermes 做一次体检

下面用这个仓库做一次实证。不是为了证明它差，而是因为它的测试写得比多数同类项目认真，正好能看出「认真做测试」和「做评测」之间还差哪几步。

先看它的 e2e 骨架。整个 mock 服务只用标准库，不引入任何依赖：

```rust
struct MockLlm {
    port: u16,
    handle: Option<thread::JoinHandle<()>>,
}

impl MockLlm {
    fn start(responses: Vec<String>) -> MockLlm {
        let listener = TcpListener::bind("127.0.0.1:0").expect("bind mock server");
        let port = listener.local_addr().unwrap().port();
        listener.set_nonblocking(true).unwrap();
        let handle = thread::spawn(move || {
            let total = responses.len();
            let deadline = Instant::now() + Duration::from_secs(15);
            let mut served = 0usize;
            while served < total {
                match listener.accept() {
                    Ok((mut stream, _)) => {
                        stream.set_nonblocking(false).ok();
                        read_full_request(&mut stream);
                        let _ = stream.write_all(responses[served].as_bytes());
                        served += 1;
                    }
                    Err(e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                        if Instant::now() > deadline { break; }
                        thread::sleep(Duration::from_millis(5));
                    }
                    Err(_) => break,
                }
            }
        });
        MockLlm { port, handle: Some(handle) }
    }
}
```

它是有想法的：端口用 0 让内核分配，避免并行测试抢端口；临时目录的名字带 pid、纳秒和原子计数，避免并行测试互相覆盖；SSE 用例把工具参数拆成两帧，专门验证增量拼接。这些都是「写得好」的地方，后文会单独列。

但注意那一行 `read_full_request(&mut stream);`。这个函数的返回值是一个 `Vec<u8>`，里面是完整的请求行、头和 JSON 请求体。**它被读出来了，然后被丢掉了。**

## 测试盘点：293 个用例的分布

| 测试层 | 数量 | 位置 | 断言对象 |
| --- | --- | --- | --- |
| Rust 单元测试 | 90 | 各模块 `#[cfg(test)]` | 函数级输入输出 |
| Rust 端到端 | 5 | `agent/tests/e2e_mock_llm.rs` | 最终答案、文件、usage |
| 前端测试 | 198 | `ui/src/**/*.test.ts(x)` | 组件行为与渲染 |
| 合计 | 293 | | |

模块分布很不均匀。工具有 23 个（`read_file`、`write_file`、`edit_file`、`apply_patch`、`list_dir`、`grep`、`glob`、`run_command`、`task_output`、`task_list`、`task_kill`、`web_fetch`、`web_search`、`todo_write`、`todo_read`、`git_status`、`git_diff`、`git_log`、`git_commit`、`skill`、`memory_save`、`memory_search`、`agent_list`），各自有 2 到 8 个单元测试；但**负责把模型给的名字路由到实现的 `tools/mod.rs` 里，一个测试都没有**。

同样没有测试的还有两个关键行为：上下文压缩 `compact_with` 没有用例；多会话守护进程的消息替换没有用例。它们都在 `run()` 的路径上，而 `run()` 本身只在 5 个 e2e 里出现。

这不是「测试少」。293 个用例不算少。问题是它们几乎全部集中在 L3 以下的函数层，而 agent 的失效大多发生在 L1 和 L2。

## e2e mock 是怎么搭的

先把它做对的部分说清楚，因为后面要补的东西必须建立在这套骨架上，而不是重写一套。

五个用例分别是：工具调用往返、纯文本流式、非流式 JSON、瞬时 500 重试、硬错误传播。它们的共同结构是「给定一串固定响应，断言最终答案」。

```rust
#[test]
fn runs_a_tool_call_then_reports_the_final_answer() {
    let ws = scratch("tool");
    let stream = sse_response(&[
        json!({ "choices": [ { "delta": { "tool_calls": [ {
            "index": 0, "id": "call_1", "type": "function",
            "function": { "name": "write_file",
                          "arguments": "{\"path\":\"hello.txt\"," } } ] } } ] }),
        json!({ "choices": [ { "delta": { "tool_calls": [ {
            "index": 0,
            "function": { "arguments": "\"content\":\"hi from test\"}" } } ] } } ] }),
        json!({ "choices": [ { "delta": {}, "finish_reason": "tool_calls" } ],
                "usage": { "prompt_tokens": 10, "completion_tokens": 5 } }),
    ]);
    let done = sse_response(&[ /* ... 纯文本收尾 ... */ ]);

    let mock = MockLlm::start(vec![stream, done]);
    let mut agent = Agent::with_mcp(cfg_for(mock.base_url(), ws.clone()), None);
    silent(&mut agent);

    let answer = agent.run(json!("write a file")).expect("turn completes");
    mock.finish();

    assert_eq!(answer, "done");
    assert_eq!(std::fs::read_to_string(&ws.join("hello.txt")).unwrap(), "hi from test");
    assert_eq!(agent.usage().requests, 2);
}
```

这段代码的断言质量其实不低：它验证了 SSE 增量拼参数、工具真的写盘、两轮请求的 usage 被累加。比「断言返回非空」强得多。

问题在所有用例都止步于此。没有任何一行代码去看「第一轮请求里到底有没有 `write_file` 这个工具」。

## 它做对了四件事

先列出值得抄走的四件事，它们决定一套评测骨架能不能长期维护。

| 做法 | 为什么重要 | 代价 |
| --- | --- | --- |
| 只依赖标准库 | 不引依赖就不会因为依赖升级而红 | 手写 HTTP 解析 |
| 绑定 `127.0.0.1:0` | 内核分配端口，并行测试不抢端口 | 无 |
| 临时目录带 pid + 纳秒 + 计数 | 并行测试不互相覆盖 | 无 |
| 把 Tauri / 终端输出注入成 sink | 测试日志干净，断言不被横幅干扰 | 需要可注入的 UI 层 |

第四条尤其值得说。`silent(&mut agent)` 把流式文本、工具横幅全部导到一个空 sink，测试输出里只剩断言失败信息。很多项目的测试难读，就是因为被测代码直接 `println!`，一跑几百行。

还有一个隐性的好设计：mock 只讲 HTTP，不讲 SDK。它验证的是协议层，换一个兼容服务端，测试仍然有效。

## 缺口一：请求读出来又丢掉

这是全文最重要的一处证据。

```rust
// agent/tests/e2e_mock_llm.rs
read_full_request(&mut stream);   // 返回值 Vec<u8> 被丢弃
let _ = stream.write_all(responses[served].as_bytes());
```

后果可以直接推导出来：五个用例里，没有任何一个能发现「请求体被改坏」。

做一个思想实验。把 `Agent::build_tools()` 改成永远返回空数组，也就是告诉模型「你没有任何工具」。会发生什么？

- 请求体里 `tools` 字段消失，模型在真实环境里将无法调用任何工具
- 但 mock 不看请求，它照着剧本返回「请调用 write_file」
- `execute()` 只按名字路由，不检查这个工具有没有被声明
- 于是文件照样被写出，`usage.requests` 照样是 2，五个用例照样全绿

同理，把 system prompt 改成空字符串、把 `max_tokens` 改成 1、把 `stream_options.include_usage` 删掉，这五个用例大概率仍然全绿，因为断言只落在「答案」和「usage」上，而 usage 来自 mock 的响应，不来自请求。

这就是「只跑一次的测试」最典型的形态：它不是没跑，而是**跑了一条不需要被测代码正确也能通过的路径**。

## 缺口二：测试配置关掉了生产路径

看 `cfg_for` 这个辅助函数：

```rust
fn cfg_for(base_url: String, workspace: PathBuf) -> Config {
    Config {
        api_key: "test-key".to_string(),
        base_url,
        model: "mock-model".to_string(),
        stream: true,
        workspace,
        auto_approve: true,
        max_retries: 0,
        retry_base_ms: 1,
        timeout_secs: 10,
        project_docs: false,
        memory: false,
        ..Config::default()
    }
}
```

每一行都有理由：`auto_approve` 避免测试卡在交互上，`memory: false` 避免碰真实用户目录，`project_docs: false` 避免读仓库里的 `AGENTS.md`。这些是为了「测试可控」而做的合理取舍。

但合起来的效果是：**e2e 跑的不是生产配置**。生产里 `project_docs` 默认开、记忆块每轮注入、审批会拦命令、沙箱会限制路径。这些路径在 e2e 里一条都没走到。

更具体地说，生产请求的 `messages[0]` 长这样：基础提示词 + 人设 + `AGENTS.md` 摘要 + 记忆块。而 e2e 里 `messages[0]` 只有基础提示词。于是「记忆块每轮重写导致前缀抖动」这个真实问题（上一篇用整节篇幅讲过），在 e2e 里根本不可能被观察到。

这不是「测试写错了」，而是「测试的配置和生产不是同一个」。评测要抓的恰恰是这种偏差：**被测对象要和上线对象一致，否则测的是另一个系统**。

## 缺口三：审批与沙箱被短路

`auto_approve: true` 会把审批路径整条跳过。沙箱默认也是关闭的，所以 e2e 里的 `run_command` 是在无约束环境下跑的。

审批策略本身有单元测试：

```rust
#[test]
fn approval_policy_decisions() {
    assert!(!needs_approval(true, ApprovalPolicy::Untrusted, "rm -rf /"));
    assert!(!needs_approval(false, ApprovalPolicy::Never, "rm -rf /"));
    assert!(needs_approval(false, ApprovalPolicy::Untrusted, "ls"));
    assert!(!needs_approval(false, ApprovalPolicy::OnRequest, "ls -la"));
    assert!(needs_approval(false, ApprovalPolicy::OnRequest, "rm -rf /"));
}
```

这个测试证明了「决策函数是对的」，但没有证明「决策被接进了执行路径」。前者是 L3，后者是 L2。中间少的那一段，正是 agent 最容易出事的地方：策略写对了，但某条分支没调用它。

评测里要补的不是再写十个 `needs_approval` 的断言，而是一条过程断言：**给定 `ApprovalPolicy::Untrusted`，模型请求 `run_command` 时，这一轮必须停下来等待确认，而不是直接执行**。这条断言需要 mock 能观察到「请求了几次」「第二次请求里有没有工具结果」，也就是需要 L1 能力。

## 缺口四：`Ok` 不等于「完成」

`run()` 的签名是 `Result<String, String>`。看它在轮次耗尽时的行为：

```rust
for _ in 0..self.cfg.max_iterations {
    // ...
}
if interrupted {
    self.style.warn("interrupted — the conversation was kept; ...");
} else if !completed {
    self.style.warn(&format!(
        "reached the {} iteration limit without finishing",
        self.cfg.max_iterations
    ));
}
self.persist();
Ok(final_text)
```

三条出口——正常完成、被中断、撞上轮次上限——返回的都是 `Ok`。区别只在于往 UI 打了一行警告。

于是 e2e 里这句：

```rust
let answer = agent.run(json!("write a file")).expect("turn completes");
```

断言的是「没有返回 Err」，而不是「任务完成了」。如果模型在第 40 轮还在调用工具，测试会拿到最后一次的文本（可能是个半截答案），然后心满意足地变绿。

这是 API 设计层面的「口径缺失」：成功和未完成共用一个返回类型，调用方无法区分。评测要做的第一件事，就是把这个区分补回来（后文给改法）。

## 缺口五：条件跳过冒充通过

有两个测试在条件不满足时会直接 `return`，而在测试框架眼里，`return` 就是通过。

```rust
#[test]
fn landlock_enforces_workspace_boundaries() {
    if !is_supported() {
        eprintln!("skipping: Landlock unavailable in this environment");
        return;
    }
    // ...
}
```

`is_supported()` 在非 Linux 平台恒为 `false`。而 CI 是 `runs-on: windows-latest`。也就是说，**这个测试在 CI 上永远跳过，永远不会红，也永远什么都没验证**。

类似地：

```rust
fn status_diff_commit_log_round_trip() {
    if !git_available() {
        eprintln!("skipping: git not installed");
        return;
    }
    // ...
}
```

git 在 GitHub 的 Windows 镜像上通常存在，所以这条多数时候会真跑。但只要环境一变，它就会安静地变成「假通过」。

还有一类更隐蔽的：整个测试被 `#[cfg(unix)]` 编译排除。`hooks.rs` 里四个行为测试都带这个属性，而 CI 只跑 Windows。于是「钩子能拿到工具名」「钩子退出码能透传」「钩子先写后读不会死锁」这三类行为，在 CI 上从未被执行过——不是跳过，是压根没编进去。

| 测试 | 在 Windows CI 上 | 实际覆盖 |
| --- | --- | --- |
| `landlock_enforces_workspace_boundaries` | 编译通过，运行时跳过 | 0 |
| `hooks::successful_hook_returns_zero` | `#[cfg(unix)]`，不编译 | 0 |
| `hooks::hook_exit_code_is_reported` | 不编译 | 0 |
| `hooks::hook_receives_tool_name_and_arguments` | 不编译 | 0 |
| `hooks::hook_that_writes_before_reading_stdin_does_not_deadlock` | 不编译 | 0 |
| `git::status_diff_commit_log_round_trip` | 视环境而定 | 0 或 1 |

正确的做法不是删掉这些测试，而是让「跳过」在报表里可见：用 `#[ignore]` 加原因、用测试框架的 skip 标记、或者在 CI 里加一个 Linux job 专门跑平台相关用例。**跳过必须是红色的另一种形态，不能是绿色的另一种形态。**

## 缺口六：名字里的断言没落地

有两个测试的名字承诺了某件事，但代码没有验证它。

第一个：

```rust
#[test]
fn surfaces_a_hard_api_error_without_hanging() {
    let result = agent.run(json!("hi"));
    let e = result.expect_err("an API error should propagate");
    assert!(e.contains("bad key"), "unexpected error: {e}");
}
```

名字里的 `without_hanging` 没有任何断言支撑。如果代码真的卡住了，测试就会一直卡着，CI job 超时——那是另一个信号，不是这条测试发出的。要兑现这个名字，至少需要 `Instant::now()` 和一句 `assert!(elapsed < Duration::from_secs(15))`。

第二个：

```rust
#[test]
fn retries_a_transient_server_error_then_succeeds() {
    // mock 只有两个响应：500 和 200
    let answer = agent.run(json!("hi")).expect("turn completes");
    assert_eq!(answer, "recovered");
}
```

它没有断言「恰好请求了两次」。如果实现里多试了一次，第三次连接会因为 mock 已经退出而失败，测试确实会红——但那是「碰巧被抓住」，不是「显式断言」。如果 mock 恰好准备了三个响应（比如为了别的用例复用），这个 bug 就漏了。

命名是给未来的人看的。名字和断言不一致，比没有这个名字更糟，因为它会让人以为覆盖已经存在。

## 缺口七：压缩与并发批次没有用例

`compact_with` 是 `run()` 每轮结束都会调用的函数，负责在上下文超过 120,000 字节时把最老的消息换成摘要。它做的事情很危险：删消息、插消息、改消息顺序。删错了会留下「有 tool_calls 没有 tool 结果」的孤儿消息，下一轮请求会被服务端直接拒绝。

这个函数没有任何测试。

同样没有测试的是 `run()` 里的并发分批：

```rust
for batch in turn.tool_calls.chunks(MAX_PARALLEL_TOOL_CALLS) {
    let handles: Vec<_> = batch.iter()
        .map(|call| s.spawn(move || this.execute(call)))
        .collect();
    // ...
}
```

现有的并发测试是直接对 `execute()` 开线程，跑 30 个调用，验证线程安全。但 `chunks(8)` 这个分批逻辑（9 个调用会分成 8 + 1 两批，顺序要保持）没有被任何一个测试覆盖。而这正是「模型一次返回 12 个工具调用」时会走的路。

还有一个更细的：`accumulate_tool_calls` 把流式工具调用的下标上限设为 64，防止恶意端点让 `resize` 申请巨量内存。这个防御没有测试——没有用例发一个 `index: 100000` 的帧，验证它被安静地丢掉。

## 一条恒真断言是怎么写出来的

`tasks.rs` 里有一条这样的断言：

```rust
let out = mgr.output(&id).expect("output");
assert!(
    start.elapsed() < Duration::from_secs(2),
    "polling a running task must not block: {out}"
);
assert!(out.contains("no output yet") || !out.is_empty());
```

第一句是有意义的：轮询一个正在跑的任务不应该阻塞超过 2 秒。这是真正的 L2 断言。

第二句两边恒真：`!out.is_empty()` 几乎总是成立（输出至少包含状态头），所以整个 `||` 永远为真。它想验证的可能是「任务刚启动时输出还没就绪」，但写成 `A || B` 之后，只要 B 成立就通过，A 的语义被吞掉了。

这类断言不是漏了 bug，而是**虚增覆盖感**：看代码的人觉得有两句断言，实际只有一句在工作。

写断言时可以用一个自查问题：**把被测函数改成永远返回空字符串，这条断言会不会红？** 不会红的断言，就是装饰。

## 体检结论表：证据、后果、补法

把七个缺口收进一张表，按「后果严重度 × 补齐成本」排序。

| 缺口 | 证据 | 后果 | 补法 | 成本 |
| --- | --- | --- | --- | --- |
| 请求被丢弃 | `read_full_request` 返回值未使用 | 前缀抖动、工具消失都测不出 | mock 记录请求体 | 低 |
| 生产路径未覆盖 | `memory: false`、`project_docs: false` | 真实 prompt 组装没测过 | 加一组 `cfg_prod()` 用例 | 低 |
| 审批被短路 | `auto_approve: true` | 策略接没接进执行路径未知 | 一条过程断言 | 中 |
| `Ok` 语义含混 | 轮次耗尽仍返回 `Ok` | 半截答案被当成完成 | 加 `TurnOutcome` | 中 |
| 条件跳过 | Landlock、`#[cfg(unix)]` | CI 绿灯但零覆盖 | 跳过可见 + Linux job | 低 |
| 名不副实 | 无耗时断言、无请求次数断言 | 卡死与多试一次漏检 | 补两句断言 | 极低 |
| 关键函数无测试 | `compact_with`、`chunks(8)` | 压缩与批量并发靠运气 | 各写两个用例 | 中 |

七项里有五项的成本是「低」或「极低」。也就是说，**这套 293 个用例的测试体系，离「能回答问题」只差几天的工程量，而不是一次重构**。

## 补法一：把 mock 变成记录器

最小改动是给 `MockLlm` 加一个共享的请求记录。不需要改被测代码一行。

```rust
use std::sync::{Arc, Mutex};

struct MockLlm {
    port: u16,
    seen: Arc<Mutex<Vec<Vec<u8>>>>,
    handle: Option<thread::JoinHandle<()>>,
}

impl MockLlm {
    fn start(responses: Vec<String>) -> MockLlm {
        let listener = TcpListener::bind("127.0.0.1:0").expect("bind");
        let port = listener.local_addr().unwrap().port();
        listener.set_nonblocking(true).unwrap();
        let seen = Arc::new(Mutex::new(Vec::new()));
        let recorded = Arc::clone(&seen);

        let handle = thread::spawn(move || {
            let mut served = 0usize;
            let deadline = Instant::now() + Duration::from_secs(15);
            while served < responses.len() {
                match listener.accept() {
                    Ok((mut stream, _)) => {
                        stream.set_nonblocking(false).ok();
                        let raw = read_full_request(&mut stream);
                        recorded.lock().unwrap().push(raw);
                        let _ = stream.write_all(responses[served].as_bytes());
                        served += 1;
                    }
                    Err(e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                        if Instant::now() > deadline { break; }
                        thread::sleep(Duration::from_millis(5));
                    }
                    Err(_) => break,
                }
            }
        });

        MockLlm { port, seen, handle: Some(handle) }
    }

    fn bodies(&self) -> Vec<Value> {
        self.seen.lock().unwrap().iter()
            .map(|raw| {
                let text = String::from_utf8_lossy(raw);
                let body = text.split("\r\n\r\n").nth(1).expect("request has a body");
                serde_json::from_str(body).expect("request body is JSON")
            })
            .collect()
    }
}
```

这段代码只多了一个 `Arc<Mutex<Vec<Vec<u8>>>>` 和一个 `bodies()`。之后所有断言都建立在真实请求体上，而不是建立在「我相信它发对了」上。

注意用的是 `split("\r\n\r\n").nth(1)` 而不是 `last()`：请求体里也可能出现这个串（比如字符串里带换行），头一定在第一段，后面的都算体。

## 补法二：三个黄金请求断言

有了 `bodies()`，先补三条性价比最高的断言。它们分别对应 L1 的三个不同侧面。

第一条，请求次数：

```rust
#[test]
fn a_two_step_task_uses_exactly_two_requests() {
    // ... 跑一个「读一次、写一次」的脚本 ...
    let bodies = mock.bodies();
    assert_eq!(bodies.len(), 2, "轮数膨胀，实际请求体：{bodies:#?}");
}
```

第二条，工具序列：

```rust
fn tool_sequence(bodies: &[Value]) -> Vec<String> {
    bodies.iter()
        .flat_map(|b| b["tools"].as_array().cloned().unwrap_or_default())
        .filter_map(|t| t["function"]["name"].as_str().map(str::to_string))
        .collect()
}

#[test]
fn the_advertised_tools_are_sorted_and_stable() {
    let bodies = mock.bodies();
    let first = tool_sequence(&bodies[0]);
    for b in &bodies[1..] {
        assert_eq!(tool_sequence(&[b.clone()]), first, "工具清单在轮次之间变了");
    }
    let mut sorted = first.clone();
    sorted.sort();
    assert_eq!(first, sorted, "工具没排序，跨会话前缀无法复用");
}
```

这条断言会直接抓住「加了个工具忘了排序」导致的缓存失效——上一篇里那个 3 到 20 倍的成本杠杆，就挂在这一点上。

第三条，前缀哈希：

```rust
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

fn prefix_hash(body: &Value) -> u64 {
    let mut h = DefaultHasher::new();
    body["messages"][0].to_string().hash(&mut h);
    body["tools"].to_string().hash(&mut h);
    h.finish()
}

#[test]
fn the_system_prefix_does_not_change_between_turns() {
    let bodies = mock.bodies();
    let first = prefix_hash(&bodies[0]);
    for (i, b) in bodies.iter().enumerate().skip(1) {
        assert_eq!(prefix_hash(b), first, "第 {i} 轮的前缀变了");
    }
}
```

这三条加起来不到四十行，覆盖的却是「成本退化」和「能力消失」两类最贵的回归。而且它们都写在测试侧，不需要改生产代码。

## 补法三：把固定脚本换成状态机

固定队列的 mock 有一个结构性问题：**它按顺序发牌，和请求内容无关**。这会让测试变得「只能演一遍」，也让并行和重试变得不可能。

改法是让响应成为请求的函数：

```rust
fn respond(req: &Value) -> String {
    let messages = req["messages"].as_array().cloned().unwrap_or_default();
    let has_tool_result = messages.iter().any(|m| m["role"] == "tool");
    let user_text = messages.iter().rev()
        .find(|m| m["role"] == "user")
        .and_then(|m| m["content"].as_str())
        .unwrap_or("");

    if user_text.contains("写") && !has_tool_result {
        sse_tool_call("write_file", r#"{"path":"hello.txt","content":"hi"}"#)
    } else if user_text.contains("写") {
        sse_text("done")
    } else {
        sse_text("ok")
    }
}
```

这变成了一个显式的状态机：状态是「有没有工具结果」，转移由请求内容决定。好处有三个：

- 不需要预先准备好响应数量，跑 3 次和跑 30 次都能用
- 可以在任意一步注入故障，因为每一步都是独立判断的
- 断言可以针对「第几次请求长什么样」，而不是「第几个响应被消费了」

代价是 mock 变复杂了。但这个复杂度换来的是「可以被重复执行」，而重复正是评测的地基。

## 补法四：故障注入矩阵

故障覆盖是评测和冒烟测试最大的分水岭。一个只测 happy path 的套件，通过率会虚高到没有参考价值。

先列矩阵，再决定测哪些。下面这张表是按 NanoHermes 的实际代码判定的。

| 故障 | 注入方式 | 期望行为 | 现状 | 有测试 |
| --- | --- | --- | --- | --- |
| 429 | 返回 429 | 退避重试 | 重试 | 间接 |
| 500 / 502 / 503 / 504 | 返回对应状态码 | 退避重试 | 重试 | 1 个用例（500） |
| 超时 | 收到请求后不响应 | 超时后重试或明确报错 | 报错但不重试 | 无 |
| 连接重置 | 直接关连接 | 明确报错 | 报错但不重试 | 无 |
| 流中断（有帧无 `[DONE]`） | 发两帧后关闭 | 明确报错 | 当成成功 | 无 |
| 空流（200 无帧） | 只发头 | 明确报错 | 报错 | 无 |
| 坏 JSON 帧 | `data: {oops` | 跳过坏帧 | 跳过 | 无 |
| 工具参数非法 | `arguments: "{x"` | 回灌 ERROR | 是 | 无 |
| 工具线程 panic | 让工具 panic | 回灌 ERROR 且不中断整轮 | 是 | 无 |
| 服务端返回 `error` 字段 | 200 + error | 抛出 | 是 | 1 个用例 |

第三行和第五行值得展开，因为它们的现状是「代码里能读出来，测试里看不到」。

先看超时。`is_retryable_error` 只认五个 HTTP 状态码：

```rust
fn is_retryable_error(e: &str) -> bool {
    e.contains("HTTP 429")
        || e.contains("HTTP 500")
        || e.contains("HTTP 502")
        || e.contains("HTTP 503")
        || e.contains("HTTP 504")
}
```

而超时在 `chat_with_model` 里被格式化成 `request failed: ...`。这个字符串一个状态码都不含，所以**即使 `max_retries` 大于 0，超时也不会重试**。更微妙的是，单元测试把这个行为固化了：

```rust
#[test]
fn retryable_errors_are_recognised() {
    assert!(is_retryable_error("HTTP 429 from API: rate limited"));
    assert!(!is_retryable_error("request failed: dns error"));
}
```

这句 `assert!(!...)` 在当时的语境里是对的（DNS 错误确实不该重试），但它同时也把「所有传输错误都不重试」写进了契约。绿灯在这里不是保障，是枷锁。

再看流中断。`read_stream` 的结束条件是读到 EOF 或者 `[DONE]`：

```rust
if !saw_done && !saw_frame {
    return Err("stream ended without any JSON events ...".to_string());
}
Ok(turn)
```

只要收到过一帧，即使连接在半路被掐断、没有 `[DONE]`，也会返回 `Ok`。对聊天来说这是「答案短了一截」，对 agent 来说这是「工具参数只拼了一半」——`accumulate_tool_calls` 会拿半个 JSON 去 `serde_json::from_str`，然后回灌一个 `invalid JSON arguments` 错误给模型。整轮不会崩，但会多烧一轮。

故障注入的代码很短：

```rust
fn stalled_response() -> String {
    // 只发头，不发体，也不关闭；让客户端的 timeout 生效
    "HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\n\r\n".to_string()
}

fn truncated_stream() -> String {
    let frame = json!({ "choices": [ { "delta": { "content": "半" } } ] });
    format!(
        "HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\n\r\n\
         data: {frame}\r\n\r\n"
    )
}
```

注意 `stalled_response` 不能真的「不关闭」——测试进程会一直挂着。正确做法是发完头之后 sleep 到客户端的 timeout 到期，或者用 `timeout_secs: 1` 把等待压到一秒。这也是评测里常见的坑：**你想测超时，但测试自己先超时了**。

## 补法五：给「完成」一个类型

前面说过，`run()` 的三种出口共用一个 `Ok`。最小的修法是加一个枚举，不动错误路径：

```rust
#[derive(Debug, PartialEq, Eq)]
pub enum TurnOutcome {
    Completed(String),
    Interrupted(String),
    IterationLimit(String),
}

impl Agent {
    pub fn run_with_outcome(&mut self, content: Value) -> Result<TurnOutcome, String> {
        // 与 run() 共用主体，只是把结尾的三个分支映射成枚举
    }
}
```

保留 `run()` 作为薄包装，返回字符串，避免影响现有调用方：

```rust
pub fn run(&mut self, content: Value) -> Result<String, String> {
    Ok(self.run_with_outcome(content)?
        .into_text())
}
```

有了这个类型，评测里就能写：

```rust
let outcome = agent.run_with_outcome(json!("fix the bug")).expect("no hard error");
assert!(
    matches!(outcome, TurnOutcome::Completed(_)),
    "任务没做完：{outcome:?}"
);
```

这一句断言的价值超过前面所有 L3 断言之和，因为它把「答了」和「做完了」分开了。而这两件事在 agent 场景里经常不一致。

`usage.requests` 只在 `complete()` 成功后才自增，失败的请求不进账本。要统计重试成本，得看 mock 记录的请求次数；两个数字的差值就是失败请求数。

## 补法六：评测集从事故倒推

评测集最容易犯的错，是编 50 个「典型任务」：需求一句话说清，环境全新，没有历史包袱。

真实的评测集应该从事故里长出来。每修一个线上问题，就问三个问题：

- 这个问题的最小复现是什么？（几条消息、几个文件、什么环境）
- 它属于哪一类？（模型、提示、工具、编排、环境）
- 如果下个版本再犯，哪条断言能抓住它？

第三个问题的答案，就是新 case 的断言部分。

| 来源 | 例子 | 转成 case 的形态 |
| --- | --- | --- |
| 线上事故 | 用户说「改错了地方」 | 多文件仓库 + 指定文件 + 断言只改那一处 |
| 回归 | 上个版本能用，这个版本不行 | 同一脚本，两个版本对比 |
| 边界 | 空文件、超长文件、非 UTF-8 | 固定 fixture |
| 成本事故 | 某任务烧了 40 轮 | 断言轮数不超过基线 |
| 安全事件 | 命令被自动执行 | 断言审批被触发 |

这样长出来的评测集有个天然优势：**每个 case 都有一个真实的故事**。当它在 CI 上红的时候，你不需要猜「这个 case 想测什么」，因为标题里就写着那次事故。

## 样本的五个字段

一个评测样本（case）最少要有五个字段。少一个，它就会在半年后变成一段没人敢删的代码。

| 字段 | 作用 | 缺了会怎样 |
| --- | --- | --- |
| `id` | 稳定标识，跨版本对比用 | 报表无法对齐 |
| `task` | 用户指令原文 | 不知道在测什么 |
| `fixture` | 初始文件与环境 | 结果不可复现 |
| `oracle` | 判定规则 | 只能人工看 |
| `severity` | 失败的影响等级 | 无法排优先级 |

写成 JSON 大概是这样：

```json
{
  "id": "edit-wrong-file-001",
  "task": "把 src/handlers/user.rs 里的 unwrap 改成显式错误处理",
  "fixture": "fixtures/edit-wrong-file-001/",
  "oracle": {
    "files_changed": ["src/handlers/user.rs"],
    "must_not_change": ["src/handlers/order.rs"],
    "max_turns": 8,
    "must_complete": true
  },
  "severity": "high",
  "source": "incident-2026-09-14"
}
```

`oracle` 里最容易被漏掉的是 `must_not_change`。只断言「改对了」不够，还要断言「没改别的地方」——agent 最典型的破坏不是没改，是改多了。`max_turns` 和 `must_complete` 是上一篇和这一篇的交汇点：成本和完成度也是判定的一部分。

`severity` 决定这个 case 红了之后要不要阻塞发布。把它写进样本，而不是写在某个人的脑子里，是为了让门禁可以自动决策。

## 评分不是布尔

「通过 / 不通过」是最粗的评分，它会把三种完全不同的结果压成一类：做对了、做了一半、做错了。

三级评分更好用：

| 等级 | 判定 | 例子 | 处置 |
| --- | --- | --- | --- |
| pass | 结果与过程都符合 | 改对文件、轮数在预算内、正常完成 | 放行 |
| degraded | 结果对，但代价超标 | 改对了，但用了 18 轮 / 改了两个文件 | 记录，看趋势 |
| fail | 结果不对，或没做完 | 改错文件、撞轮次上限、报错 | 阻塞 |

`degraded` 这一级是整张表的关键。纯布尔评分会让「改对了但花了三倍成本」和「改对了」看起来一样，于是成本退化永远不会被发现。而 agent 的成本退化恰恰是渐进的：每次加一个功能涨 5%，没有人会在某一天突然发现。

评分函数要显式写出阈值，不要藏在代码里：

```rust
fn grade(case: &Case, run: &Run) -> Grade {
    if !run.matches(&case.oracle.files_changed)
        || run.touches(&case.oracle.must_not_change) {
        return Grade::Fail;
    }
    if !run.completed {
        return Grade::Fail;
    }
    if run.turns > case.oracle.max_turns {
        return Grade::Degraded;
    }
    Grade::Pass
}
```

这个函数只有十几行，但它把「什么叫成功」变成了可审查的代码。评审时争论的就不再是「感觉还行」，而是「`max_turns` 为什么是 8」。

## 重复怎么跑：次数、种子、并行

重复不是「多按几次运行键」，要有明确的次数和编排。

| 场景 | 每个 case 次数 | 目的 | 触发 |
| --- | --- | --- | --- |
| 本地冒烟 | 1 | 快速反馈 | 保存文件 |
| PR 门禁 | 3 | 抓明显的不稳定 | 每次提交 |
| 夜间回归 | 10 | 估 flaky 率 | 每天 |
| 版本对比 | 30 | 比较两个版本 | 发版前 |

30 次看着多：20 个 case 就是 600 次运行。但 e2e 走本地 HTTP，不花模型的钱，成本只有执行时间。**只有 mock 才让「重复 30 次」在经济上可行**。

并行要注意两件事。第一，每个运行必须有独立的临时目录，NanoHermes 的 `scratch()` 已经做对了。第二，如果被测代码读环境变量（比如 `max_retries` 从 `NANOHERMES_MAX_RETRIES` 读），并行运行会互相污染。这类配置要在评测入口显式注入，而不是靠进程环境。

```text
# 伪代码：评测主循环
for case in cases:
    for i in 0..N:
        run = isolated_run(case, seed = i)
        record(case.id, i, grade(case, run), run.metrics)

report = summarize(records)
# 输出：每 case 的通过率、区间、flaky 标记、成本分位数
```

关键在最后一行。评测的产物不是「通过 / 失败」，是一张带分母的表。

## 去 flaky 的六个隔离手段

不稳定有六大来源，每一个都有对应的隔离手段。

| 来源 | 表现 | 隔离手段 |
| --- | --- | --- |
| 端口冲突 | 偶发连接失败 | 绑定 0 让内核分配 |
| 临时目录冲突 | 文件互相覆盖 | 目录名带 pid + 随机数 |
| 时钟与时区 | 日期相关断言漂移 | 注入固定时钟 |
| 遍历顺序 | 文件列表顺序不同 | 显式排序后再断言 |
| 全局状态 | 上一个用例影响下一个 | 每个用例新建进程或新实例 |
| 网络与代理 | 走了公司代理 | 显式 `NO_PROXY`，只允许回环 |

NanoHermes 的 e2e 已经做对了前两项。第四项在 `tool_sequence` 这类断言里必须自己做：工具清单如果不排序，跨轮对比就会假红。第六项也值得注意，`llm::proxy_for` 会读取 `HTTPS_PROXY`，而它恰好对 `127.0.0.1` 做了 bypass——如果没有这个 bypass，所有本地 mock 测试都会试图走代理。

隔离做到位之后，还会剩下真正的不稳定：模型采样、并发时序、工具本身的非确定性。这些才是 flaky 率应该度量的部分。把环境噪声去掉，剩下的数字才有意义。

## 重试只能用来发现，不能用来掩盖

多数测试框架都支持「失败自动重试 3 次」。这个功能在评测里是有害的。

原因很直接：重试会把「1/5 失败」变成「0/5 失败」，于是 flaky 消失了，报表变绿了，问题还在。而 flaky 恰恰是评测里最值钱的信号——它标记出那些「取决于运气」的路径，而运气在线上会随负载变化。

正确用法是反过来的：**让测试跑一次，让评测跑 N 次，把差异暴露出来**。

```text
# 不重试，直接统计
for i in 1..5; do
  cargo test --test e2e_mock_llm -- --exact "$CASE" || echo "run $i failed"
done | sort | uniq -c
```

输出会长这样：

```text
      4 
      1 run 2 failed
```

四行空、一行失败。这比「重试后通过」有用得多：它告诉你这个用例有 20% 的失败率，而这个用例覆盖的是工具调用往返。

工程上可以把重试留给「基础设施类失败」（拉镜像、装依赖），把不重试留给「被测行为」。两者的边界要写进 CI 配置，而不是靠人记。

## 成本也是评测指标

上一篇把成本拆成「前缀 × 历史 × 轮数」。这三个量都应该进评测报表。

| 指标 | 定义 | 采集位置 | 阈值示例 |
| --- | --- | --- | --- |
| 轮数 | 每任务的模型请求次数 | `usage.requests` 或 mock 记录 | <= 8 |
| 请求字节 | 每任务请求体总字节 | mock 记录 | <= 180,000 |
| 工具调用数 | 每次运行的工具调用总数 | 消息里的 tool 角色 | <= 20 |
| 前缀稳定性 | 跨轮前缀哈希是否一致 | 请求体 `messages[0]` | 全等 |
| 墙钟时间 | 端到端耗时 | 测试外层计时 | <= 60s |

这些数字和通过率放在同一张表里，才能回答「这个版本是不是又快又好」。只看通过率，会出现「通过率没降，但成本翻倍」的版本被放行；只看成本，会出现「省了钱但改错了文件」的版本被放行。

成本指标还有一个隐性作用：它能提前暴露退化。通过率是阶跃的（对就是对，错就是错），成本是连续的。连续量在退化 5% 的时候就能看见，阶跃量要等到跨过阈值才报警。

## 归因：五类失败与二分法

评测红了之后，最有价值的信息不是「红了」，是「为什么红」。把失败分成五类，每类对应不同的处置。

| 类别 | 典型信号 | 处置 |
| --- | --- | --- |
| 模型 | 同一输入多次运行结果不同，且无环境差异 | 换模型 / 调提示 / 降温度 |
| 提示 | 工具选错、格式不符、忽略约束 | 改 prompt、加示例 |
| 工具 | 错误串来自工具、文件状态不对 | 修工具、补单元测试 |
| 编排 | 轮数暴涨、重复动作、压缩后丢信息 | 改循环、改压缩策略 |
| 环境 | 只在某台机器 / 某个平台失败 | 修隔离、补平台用例 |

归因可以用二分法加速。先固定模型：把这次运行的模型响应录下来，下次回放。如果回放后仍然失败，问题在模型之外（工具、编排、环境）；如果回放后成功，问题在模型采样。

再固定工具：把工具返回值换成固定 fixture。如果仍然失败，问题在编排；如果成功，问题在工具。

两次二分就能把五类缩到一类。这比盯着日志猜快得多，也是「记录请求与响应」除了断言之外的第二个用途。

## 离线评测与线上观测的分工

这两件事经常被混为一谈，但它们的样本、口径、时效完全不同。

| 维度 | 离线评测 | 线上观测 |
| --- | --- | --- |
| 样本 | 精选的固定集 | 全部真实流量 |
| 口径 | 事先定义的 oracle | 用户行为（采纳、重试、放弃） |
| 时效 | 发布前 | 发布后持续 |
| 成本 | 可控（mock） | 真实账单 |
| 能发现 | 已知的失效模式 | 未知的失效模式 |
| 不能发现 | 长尾输入 | 根因（只有现象） |

离线评测擅长「防止退化」，线上观测擅长「发现新问题」。一个健康的循环是：线上发现新问题 → 抽成离线 case → 修 → 离线门禁防止再犯。

只有离线评测，你会一直在修已知的问题；只有线上观测，你会一直在救火，而且每次修完都不知道有没有修坏别的。

## 线上采样只存结构，不存内容

线上观测最大的顾虑是隐私。解法不是不采，是只采结构。

```rust
struct TurnTelemetry {
    turn_id: String,
    outcome: TurnOutcomeKind,   // completed / interrupted / iteration_limit
    requests: u32,
    prompt_bytes: u64,
    completion_bytes: u64,
    tool_calls: Vec<ToolStat>,  // name + duration + ok，不含参数
    elapsed_ms: u64,
    error_class: Option<String>,// 分类，不含原文
}
```

这份结构里没有任何用户文本、文件内容、命令输出。它能回答「成功率、轮数分布、哪个工具最慢、哪类错误最多」，不能回答「用户说了什么」。

需要内容才能定位的问题，走另一条路：用户主动上报，或加一个显式的「调试模式」，让用户知情并授权。默认采集应该是结构，不是内容。

## 回归门禁：CI、夜间、人工

三类检查要分开，不然要么太慢，要么太松。

| 层 | 跑什么 | 时长目标 | 门禁规则 |
| --- | --- | --- | --- |
| CI | 单元测试 + 3 次 e2e + L1 断言 | 十分钟内 | 任何新失败都阻塞 |
| 夜间 | 10 次重复 + 故障矩阵 + 成本基线 | 一小时 | flaky 率 > 2% 或成本涨 10% 报警 |
| 人工 | 真实模型 + 真实仓库任务 | 按需 | 版本对比报告 |

CI 要快而确定，不跑真实模型：延迟和费用都不适合每次提交。夜间可以更重，因为它产出的是趋势而不是阻塞。

人工这层不该被自动化替代，也不该成为主要手段。它的作用是校验口径：人工觉得明显变差而分数没动，说明 oracle 写错了。

## 一个可照抄的目录与命令

```text
evals/
  cases/
    edit-wrong-file-001/
      case.json
      fixture/
    timeout-retry-001/
      case.json
      fixture/
  harness/
    mock_llm.rs        # 记录请求的状态机 mock
    runner.rs          # 重复执行、隔离、记账
    grade.rs           # pass / degraded / fail
  baselines/
    2026-11-01.json    # 通过率、轮数、字节数
  report.md            # 每次运行的汇总
```

命令保持朴素，能进任何 CI：

```text
cargo test --workspace                     # 单元 + 快速 e2e
cargo run --bin eval -- --cases evals/cases --repeat 10 --json > report.json
jq '.cases[] | select(.flaky) | .id' report.json
```

第二行是核心：一个独立二进制，不是测试框架插件，既能进 CI，也能单跑某个 case，还能把结果喂给报表。

评测入口和测试入口分开，还有一层原因：评测失败不必阻塞编译，测试失败必须阻塞。两者语义不同，不该共用退出码。

## 三个一天能做完的实验

与其争论「要不要做评测」，不如先做三个小实验，用数据说话。

| 实验 | 做法 | 预期 | 证明什么 |
| --- | --- | --- | --- |
| 重复 5 次 | 同一个 e2e 用例跑 5 遍 | 大概率全绿 | 这套用例是确定性的，重复成本低 |
| 空工具清单 | `build_tools()` 返回空数组 | 5 个 e2e 仍全绿 | 现有断言不看请求体 |
| 超时重试 | mock 收到请求后不响应，`max_retries=2` | 只请求一次就报错 | 传输错误不在重试范围内 |

第一个实验决定「重复是否可行」：5 次里有失败，就先修隔离。

第二个实验是本文论点的可执行版本。它不改测试，只改一行生产代码，然后看绿灯还亮不亮。亮着，就说明 L1 是空的。

第三个实验揭示一个行为边界。你可以据此决定「超时也该重试」，也可以决定「保持现状但写进文档」——前提是你知道现状是什么。

三个实验不超过一天，产出三张能贴进评审会的表。

## 五个常见的评测陷阱

| 陷阱 | 表现 | 后果 | 解法 |
| --- | --- | --- | --- |
| mock 太理想 | 永远返回规范 JSON、永远秒回 | 真实世界的坏数据全漏 | 故障矩阵 |
| 断言过拟合 | 断言完整文案、完整 diff | 改一个标点就红 | 断言关键片段与结构 |
| 只测单步 | 每个工具单测都过 | 组合起来不通 | 场景级 case |
| 平均值掩盖长尾 | 平均 2 轮，P95 是 18 轮 | 少数任务烧穿预算 | 报分位数 |
| 分布脱节 | 评测任务都是自己编的 | 分数涨了用户没感觉 | 从事故倒推 |

第二个陷阱最隐蔽。断言完整文案看起来很严格，实际上把「实现细节」写进了契约，之后每次改提示词都要改测试，久而久之大家就学会了「红了我改断言」。

正确的做法是断言**结构**而不是**措辞**：文件改对了、工具序列对了、轮数在预算内、答案包含关键结论。这四类断言不会因为换了个说法而红，但会因为行为变了而红。

## 小结

把这篇压成四句话。

**第一，一次通过只是抽样，不是结论。** 二十步的任务，单步 0.95 的成功率只有 36% 的任务成功率；十次全过只能证明失败率低于 26%。

**第二，评测要有分母、有口径、有过程断言。** 没有分母的通过率不是通过率；没有口径的分数不可比较；没有过程断言的测试看不见 agent 最典型的失效方式。

**第三，NanoHermes 的测试写得好，但停在 L3。** 90 个单元测试加 5 个 e2e，mock 把请求读出来就丢掉。把工具清单改成空数组，五个 e2e 仍然全绿——这不是 bug，这是断言层次不够。

**第四，补齐的成本很低。** 记录请求体、三条黄金断言、一个状态机 mock、一张故障矩阵、一个完成状态枚举，加起来是几天的工程量。真正贵的不是写，是先想清楚「什么叫成功」。

上一篇讲怎么记账，这一篇讲怎么判断改动有没有让账变好。下一篇换个方向：当输入本身可能是攻击时，「评测通过」还意味着安全吗？——Agent 提示注入：谁说的话算指令。

---

## 参考

- `agent/src/agent.rs`：`run`、`complete`、`compact_with`、`execute`、`build_tools`、`usage`、`MAX_PARALLEL_TOOL_CALLS`、`KEEP_RECENT`、`CONTEXT_CHAR_BUDGET`
- `agent/src/llm.rs`：`chat`、`chat_with_model`、`is_retryable_error`、`read_stream`、`accumulate_tool_calls`、`backoff_ms`
- `agent/src/tools/mod.rs`：`specs`、`dispatch`（23 个内置工具的路由）
- `agent/src/sandbox.rs`：`is_supported`、`needs_approval`、`landlock_enforces_workspace_boundaries`
- `agent/src/hooks.rs`：`run`、四个 `#[cfg(unix)]` 行为测试
- `agent/src/tasks.rs`：`polling_a_running_task_returns_immediately`
- `agent/tests/e2e_mock_llm.rs`：`MockLlm`、`read_full_request`、`cfg_for`、五个 e2e 用例
- `agent/tests/mock_mcp_server.py`：JSON-RPC 与 Content-Length 分帧
- `ui/src/App.e2e.test.tsx`：jsdom 环境下的端到端（含布局替身）
- `.github/workflows/ci.yml`：`cargo test --workspace` 与 `npm --prefix ui run test`
- `agent/src/config.rs`：`max_iterations`、`max_retries`、`retry_base_ms`、`timeout_secs`
