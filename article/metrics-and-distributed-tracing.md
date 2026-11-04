---
title: "指标与链路追踪：从 RED 到 OpenTelemetry"
slug: metrics-and-distributed-tracing
cover_image: /photos/metrics-and-distributed-tracing-cover.png
date: 2026-11-04
tags: ["后端", "可观测性", "指标", "链路追踪"]
---

> 适用读者：已经有一堆日志、但每次排障仍然靠猜的后端工程师；准备给服务接 Prometheus 与 OpenTelemetry，却不确定先做哪一步的负责人
> 结论先行：日志记录事件，指标记录趋势，追踪记录单次请求的路径。三者不是替代关系。指标告诉你「有多糟、多常见」，追踪告诉你「糟在哪一段」，日志告诉你「那一段里发生了什么」。只有平均值没有分位数，你会低估长尾；只有分位数没有 exemplar，你知道 P99 高却不知道是哪一条请求；只有 trace 没有日志，你知道哪一段慢却不知道它带了什么参数。
> 阅读时间：约 30 分钟 | 难度：中级到高级 | 收获：四种指标类型的取舍、P95/P99 的算法含义与样本量下限、label 基数的估算公式、W3C traceparent 的字节结构、head/tail 采样的盲区算法，以及一套能落地的 Python 埋点方式

**目录**

- 前言：P99 涨了三倍，日志里每行都是 200
- 三种信号的分工：事件、趋势、路径
- 四种指标类型，与延迟为什么必须用 Histogram
- 平均值、分位数与 P99 的真实含义
- Prometheus 的拉模型、命名与 label 基数
- exemplar：把指标钉到一条具体的 trace 上
- RED、USE、四个黄金信号与 SLO
- 追踪模型：trace、span 与 W3C traceparent
- 采样：head、tail 与固定比例的盲区
- OpenTelemetry：从 API 到 OTLP 再到 Python 落地
- 一次真实排查：从 P99 到那条 SQL
- 存储与成本：基数、采样率与保留期
- 小结
- 相关阅读

## 前言：P99 涨了三倍，日志里每行都是 200

先把一个足够典型的场景摆在桌上。数字是示意，形状来自很多次值班里反复出现的那一类事故。

某个内容站点的信息流接口 `/api/articles/feed`，平时 P50 大约 60 毫秒，P99 大约 120 毫秒。某天下午开始，P99 爬到 400 毫秒以上，P50 只从 60 涨到 68。错误率没有变化，5xx 仍然是零。用户投诉开始出现，说"有时候要等一下才出来"。

值班的人打开日志。每条请求一行：方法、路径、状态码 200、总耗时 68 毫秒、用户 ID。翻了几百行，全是 200，耗时都在 70 毫秒上下。于是有人说"日志看着挺正常，可能是客户端网络问题"。

第二个人去看指标，指标里只有一个 `http_request_duration_seconds` 的平均值，画出来是一条几乎平的线，从 60 毫秒微涨到 68 毫秒。他得出"服务没变慢"。

第三个人怀疑数据库，去翻慢查询日志，阈值设的是 200 毫秒，一条都没有。

三个人都看了数据，三个人都得出了错的结论。因为三个人手上的工具都只能回答它们各自能回答的那一个问题，而这个问题不是"慢在哪一段"。

- 日志回答的是"发生了什么事件"。它记下了"这个请求返回了 200，总共 68 毫秒"。它没有记"这 68 毫秒花在哪"。你要它回答分段耗时，它答不了，除非你在每一段都打一行日志——那是另一个成本问题。
- 平均值回答的是"整体水平"。它把 99 个 60 毫秒和 1 个 400 毫秒混在一起，算出来 63.4 毫秒。这个数字在数学上没错，在判断上是有害的。
- 慢查询日志回答的是"超过阈值的那条 SQL"。但它只覆盖数据库这一段，而且阈值是 200 毫秒——一条 180 毫秒的 SQL 会安静地溜过去，四条串行就凑出 720 毫秒。

真正的问题出在一次批量取作者信息：信息流一页 20 条，代码对每条单独查一次作者，20 次串行的小查询，每次 15 到 20 毫秒，加起来 300 多毫秒。每一次单独看都不算慢，日志里也不会有一条"慢查询"，指标里也只表现为"总耗时变长了一点"。这个形状——**多个小段串行叠加，单段都不触发任何阈值**——恰好是平均值、慢查询日志、单行请求日志三种工具共同盲区的交集。

这篇文章要做的，就是把三种信号的边界划清楚，然后给出每一层该用什么数据结构、什么标签、什么采样策略。顺序是：先指标（发现趋势），再追踪（定位到段），再日志（确认细节）。

## 三种信号的分工：事件、趋势、路径

先给一张不会过时的对照表。

| 维度 | 日志 | 指标 | 追踪 |
| --- | --- | --- | --- |
| 记录单位 | 一条离散事件 | 一个预聚合的数值时间序列 | 一次请求的一棵 span 树 |
| 回答的问题 | 发生了什么，带了什么参数 | 多慢、多常见、趋势如何 | 慢在哪一段，调用了谁 |
| 数据结构 | 追加写的文本或 JSON | 带标签的数值 + 时间戳 | trace_id 聚合的 span 列表 |
| 成本随什么增长 | 请求数 × 每请求日志条数 | 时间序列数（label 基数） | span 数 × 采样率 × 保留期 |
| 典型失效模式 | 量大、缺关联、schema 漂移 | 高基数、平均值骗人、丢桶 | 采样丢错误、上下文断链、span 过细 |
| 查询方式 | 全文检索 + 字段过滤 | PromQL 聚合 | 按 trace_id 拉取整棵树 |

最后一行最容易被忽略：日志查询是扫描加过滤，能回答任意问题，代价随数据量线性增长；指标查询是找序列加窗口聚合，极快，但只能回答预先定义过维度的问题；追踪查询按 trace_id 取整棵树，精确，但你得先知道那个 id。

所以正确的排查顺序是固定的，而且顺序不能颠倒：

1. **指标先回答"是不是真的变慢了，影响多大"**。没有这一步，你连"这是个问题"都无法确认。P99 从 120 涨到 400，影响的是 1% 的请求，在 100 QPS 下就是每秒 1 个用户，一小时 3600 次。
2. **追踪回答"在哪一段"**。指标告诉你 400 毫秒，追踪告诉你其中 300 毫秒在 20 次串行的作者查询上，而不是在 Redis，也不是在模板渲染。
3. **日志回答"为什么是这 20 次"**。trace 的 span 上写着 `db.statement` 是 `SELECT ... FROM author WHERE id = ?`，重复了 20 次；日志里那行 `feed.build` 的 `author_ids` 字段确认这一页里确实有 20 个不同作者——于是"批量查询"这个改法就有了依据，而不是拍脑袋。

反过来做会怎样？先看日志，你会被海量的 200 淹没；先看 trace，你不知道该抓哪一条请求——一天几百万条 trace，随机抽到的多半是正常的那 99%。

这里必须和站内那篇讲结构化日志的文章划清分工。那篇讲的是"日志怎么写得便宜、怎么用 request-id 把一次请求的几行串起来"，解决的是"事件层"的问题。这一篇讲的是"事件之上还有两层"：一层是把事件压成数值趋势，一层是把一次请求展开成树。**request-id 是 trace_id 的穷人版**——它能做到"把同一个请求的行聚在一起"，但做不到"自动记录每一段的开始结束时间和父子关系"。所以这两篇是阶梯，不是替代。

## 四种指标类型，与延迟为什么必须用 Histogram

Prometheus 的指标模型只有四种类型，选错了类型，后面所有的查询都会别扭。

**Counter（计数器）**：单调递增的累积值。它只回答"从进程启动到现在一共发生了多少次"。注意"单调"这个词——进程重启会归零，所以你不能直接对它求差值，必须用 `rate()` 或 `increase()`，这两个函数会处理归零（counter reset）。命名惯例是加 `_total` 后缀，比如 `http_requests_total`。

**Gauge（瞬时值）**：可增可减的当前值。正在处理的请求数、队列长度、连接池占用、内存使用量。它没有"累积"语义，所以不能对它求 rate，只能看当前值或 `avg_over_time`。

**Histogram（直方图）**：客户端按预设的桶边界把观测值累加进一组累积计数器。它输出三样东西：每个桶的累积计数 `_bucket{le="0.1"}`、总和 `_sum`、总次数 `_count`。

**Summary（摘要）**：客户端自己计算分位数，输出一组带 `quantile` 标签的 gauge，比如 `{quantile="0.99"}`。

现在说关键结论：**延迟这类指标，必须用 Histogram，不能用 Summary，更不能用平均值。**

理由不是"Histogram 更准"，而是"Histogram 可聚合"。这是两种类型在数学结构上的差别：

- Summary 在**客户端**算分位数。一个进程算出自己的 P99，另一个进程也算出自己的 P99，你把两个 P99 平均，得到的不是整体的 P99。因为分位数不是可加量——它依赖整个分布的排序，而排序不能跨集合合并。
- Histogram 在**客户端**只做分桶计数。桶计数是可加的：两个实例的 `le="0.1"` 桶加起来，就是两实例合并后小于 100 毫秒的请求数。所以你可以先把所有实例、所有时间片聚合，再在聚合结果上用 `histogram_quantile()` 算分位数。

所以在有多个 Pod 的服务里，Summary 基本没有用——你真正想知道的是整个集群的 P99，而不是"某个 Pod 的 P99"。

Python 客户端里长这样：

```python
from prometheus_client import Counter, Gauge, Histogram

HTTP_REQUESTS = Counter(
    "http_requests_total",
    "HTTP 请求总数",
    ["method", "route", "status_class"],
)

INFLIGHT = Gauge(
    "http_inflight_requests",
    "正在处理的请求数",
)

HTTP_DURATION = Histogram(
    "http_request_duration_seconds",
    "HTTP 请求耗时",
    ["method", "route"],
    buckets=(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0),
)

with HTTP_DURATION.labels(method="GET", route="/api/articles/feed").time():
    render_feed(request)
```

`Histogram.time()` 是一个上下文管理器，进出各打一次时间戳，把差值塞进对应的桶。

## 平均值、分位数与 P99 的真实含义

先把平均值的欺骗性算清楚。假设 100 个请求：99 个用 10 毫秒，1 个用 10 秒。

```
算术平均 = (99 × 10ms + 1 × 10000ms) / 100 = (990 + 10000) / 100 = 109.9ms
```

平均值 109.9 毫秒——看起来"还好"，比 120 毫秒的 SLO 还低一点。但那个用户等了 10 秒。更糟的是，如果这个接口一天被调用一百万次，就有 1 万个用户等了 10 秒。

平均值的问题不是"算错了"，而是它**把两个完全不同的群体混成了一个数**。它假设分布是对称的单峰，而延迟分布几乎从来不是：它长尾、常常双峰（缓存命中一峰、缓存未命中一峰）、还会随流量呈现周期性。

分位数解决的是"尾部有多重"。P99 = 第 99 百分位 = 把样本从小到大排序后，第 99% 位置的那个值。它的准确表述是：**99% 的请求耗时不超过这个值，1% 的请求比它更慢。**它**不是**"最慢的 1% 的平均耗时"——这两者差得很远，最慢的 1% 里可能有一个 30 秒的请求把平均值拉得很高。

三个常被混用的分位数：

- P50（中位数）：一半请求比它快。它对长尾不敏感，适合看"典型用户体验"。
- P95：5% 的请求比它慢。常用于内部性能目标。
- P99：1% 的请求比它慢。常用于面向用户的 SLO，因为"1% 的用户"在百万级日活下就是一万个人。

这里有个必须说清楚的统计问题：**分位数的可信度取决于样本量**。P99 意味着你要把它上面的 1% 数出来，如果一分钟只有 100 个样本，那 1% 就是 1 个请求——这一个请求的耗时稍微抖一下，P99 就跟着跳。工程上的经验下限是：**估计 P99 至少需要几百个样本，想让它在分钟级窗口稳定，需要上千个**。这就是为什么低 QPS 的接口不适合看分钟级 P99——不是指标坏了，是样本不够。

用 PromQL 查询时，Histogram 的分位数是这样算的：

```text
histogram_quantile(0.99,
  sum by (le) (rate(http_request_duration_seconds_bucket{route="/api/articles/feed"}[5m])
))
```

注意两个细节。第一，必须先 `sum by (le)` 把各实例的桶加起来，再算分位——顺序反了就退化成"平均各实例的 P99"。第二，`histogram_quantile` 在桶内做**线性插值**：它假设落在 `(0.25, 0.5]` 这个桶里的样本在 0.25 到 0.5 之间均匀分布，然后按比例估一个值出来。这意味着：

- 桶越宽，插值误差越大。你的 P99 可能落在 0.25 到 0.5 秒这个桶里，桶宽 250 毫秒，那么报出来的 P99 有几百毫秒的不确定度。
- 如果 P99 落在 `+Inf` 桶里（所有桶都装不下），`histogram_quantile` 会返回该桶的上界之外的估计值，实际上等于"不知道"。这就是为什么桶的上界必须高于你的 SLO。

所以桶的设计规则是：**在你关心的阈值附近加密，在远离阈值的地方放粗。**比如 SLO 是"P99 小于 300 毫秒"，那就在 0.1、0.2、0.3、0.4、0.5 附近设桶，而不是均匀地每 0.5 秒一个。

## Prometheus 的拉模型、命名与 label 基数

Prometheus 采用**拉模型**（pull）：它按 `scrape_interval` 周期性地向每个目标的 `/metrics` 发 HTTP GET，把返回的文本解析成时间序列。配置长这样：

```yaml
scrape_configs:
  - job_name: article-api
    scrape_interval: 15s
    scrape_timeout: 10s
    metrics_path: /metrics
    static_configs:
      - targets:
          - "10.0.1.11:8000"
          - "10.0.1.12:8000"
    metric_relabel_configs:
      - source_labels: [__name__]
        regex: "go_.*"
        action: drop
```

拉模型与推模型（StatsD、Graphite 那种客户端上报）的差别不只是方向，它带来三个结构性好处：

1. **目标的存活本身就是信号。**抓取失败会生成 `up == 0`，你不需要额外的心跳指标就知道这个实例挂了。
2. **采集节奏由服务端控制。**客户端不需要知道"多久上报一次"，也不会在流量高峰时把上报请求堆在自己身上。
3. **成本可预算。**时间序列数乘以抓取频率，就是服务端的写入负载，可以提前算。

代价是：**生命周期短于一个抓取周期的任务抓不到。**一个跑 3 秒的批处理，可能一次都没被 scrape 到。这类任务的官方答案是 Pushgateway，但它有个众所周知的坑——保留最后一次推送的值，任务结束后指标不会自动消失，会一直挂着，直到你主动删除或配置过期。

命名规范相对简单：`<namespace>_<subsystem>_<name>_<unit>`，单位用基本单位后缀（秒用 `_seconds`，字节用 `_bytes`，不要用 `_ms`、`_mb`），Counter 加 `_total`。

接下来是**label 基数**。指标系统的成本几乎全部由时间序列数决定，而时间序列数由标签的取值组合决定。上界公式是：

```
序列数 ≤ 指标数 × Π(每个标签的取值个数)
```

举个具体的例子。一个信息流接口，标签是 `method`（5 个取值）、`route`（200 个路由）、`status_class`（8 个）、`instance`（20 个实例）：

```
5 × 200 × 8 × 20 = 160,000 条序列
```

如果这个 Histogram 有 12 个桶，每个桶都是一条序列，那还要乘以桶数：

```
160,000 × 12 = 1,920,000 条序列
```

接近两百万条。每条序列在内存里要占 head chunk、series 索引、label 集合，量级是几 KB。两百万条就是几个 GB 的内存，而且每次抓取要序列化这么多行文本。这就是为什么"加一个标签"看起来很便宜，实际上是乘以一个系数。

三类绝对不能做标签的东西：

- **user_id**。一百万用户就是一百万倍。哪怕你只对 1% 的用户启用，也是 10,000 倍。
- **原始 URL**。`/api/articles/12345` 和 `/api/articles/12346` 是两个不同的标签值。一个带 ID 的路径，基数等于资源总数。
- **request_id / trace_id**。这是**每一行日志、每一个 span** 的字段，不是指标的维度。指标的语义是"聚合"，而 request_id 的语义是"唯一"——把唯一值放进标签，等于把指标系统当成日志系统用，它的成本结构会立刻崩掉。

治理手段有四个，按代价从低到高：

1. **路由模板化。**把 `/api/articles/12345` 归一成 `/api/articles/:id`。Django 里可以直接用 URL resolver 匹配出来的 `route`，而不是 `request.path`。
2. **状态码归并。**用 `status_class`（2xx/3xx/4xx/5xx）而不是精确状态码，除非你确实要区分 401 和 403。
3. **在采集端丢弃。**`metric_relabel_configs` 里 drop 掉不需要的指标，或者用 `labeldrop` 去掉高基数标签。
4. **recording rules 降维。**把高基数的原始指标预聚合成低基数的结果，长期只保留聚合后的。

观测手段：Prometheus 自己暴露 `prometheus_tsdb_head_series`，这个数字就是你当前的时间序列总数。它持续上涨而流量没涨，基本就是某个标签的取值在膨胀——最常见的是路由模板漏了，把 ID 带进去了。

## exemplar：把指标钉到一条具体的 trace 上

到这里有个断层。指标告诉你 P99 是 400 毫秒，但指标是聚合的，它不知道那 400 毫秒属于哪一条请求。你打开追踪系统，一天几百万条 trace，随机抽一条，多半是 60 毫秒的正常请求。**指标和追踪之间缺一根针。**

exemplar 就是这根针。它是 OpenMetrics 文本格式里的一个扩展：在直方图的桶那一行后面，附一个样本值和时间戳，再附一组标签，通常就是 `trace_id`。

```text
http_request_duration_seconds_bucket{le="0.5",route="/api/articles/feed"} 8421
# {trace_id="4bf92f3577b34da6a3ce929d0e0e4736"} 0.481 1756000000.123
http_request_duration_seconds_bucket{le="1.0",route="/api/articles/feed"} 8426
```

注意 `#` 开头那行是注释语法——这是 OpenMetrics 的兼容设计，老版本的解析器会把它当注释跳过，新版本会把它读成 exemplar。Prometheus 需要显式开启 exemplar 存储（启动参数 `--enable-feature=exemplar-storage`），存储量有上限，不是全量保留。

它的价值在于：Grafana 里那条 P99 曲线上，会散落着一些小圆点，每个点就是一条具体的 trace。你点一下，直接跳到追踪系统的那棵 span 树。**从"P99 是 400 毫秒"到"这条请求的 400 毫秒花在哪"，中间不需要任何手工猜测。**

三个限制必须知道：

- exemplar 是**抽样**的，不是每条请求都记。存储有限，通常每个桶每次抓取只保留少数几个。所以它能给你"一个样本"，不能给你"这个桶里所有请求的列表"。
- 它只对 Histogram 和 Counter 有意义。Gauge 上挂 exemplar 没有语义。
- `trace_id` 作为 exemplar 标签是可以的（它只在该样本上存在，不进时间序列的标签维度），但长度要控制——32 个 hex 字符，别把整个 traceparent 塞进去。

它和"不要把 trace_id 放 label"不矛盾：label 会创造长期存在的时间序列，exemplar 只是样本上的附注，跟着样本过期就消失。

## RED、USE、四个黄金信号与 SLO

有了工具还要有方法，防止"指标很多但不知道看哪个"。

**RED** 面向服务（请求驱动的东西）：

- **Rate**：每秒请求数。`sum(rate(http_requests_total[5m]))`。
- **Errors**：失败请求的比例。注意要区分"返回 5xx"和"业务失败但返回 200"——前者指标能看见，后者必须自己埋点。
- **Duration**：请求耗时的分布。用 Histogram 的分位数，不要用平均值。

**USE** 面向资源（CPU、内存、磁盘、连接池、队列）：

- **Utilization**：资源被占用的时间比例。CPU 利用率、连接池占用率。
- **Saturation**：排队程度。运行队列长度、等待连接的请求数、消息积压量。
- **Errors**：资源层面的错误计数。丢包、磁盘写失败、连接超时。

USE 的关键在于 Saturation——它是唯一能在"还没变慢"时提前报警的信号。CPU 利用率 70% 时延迟通常还正常，但运行队列开始变长；连接池占用 90% 时 P99 已经开始翘尾。**Utilization 告诉你"还剩多少"，Saturation 告诉你"已经在排队了"。**

**四个黄金信号**（Google SRE 书里的提法）是上面两套的上位概括：Latency、Traffic、Errors、Saturation。它有个重要细节常被漏掉：**延迟要区分成功请求和失败请求**。失败请求往往很快（直接返回 500），把它们混进延迟统计里，会让错误率上升时的平均延迟"变好看"——这是一个真实的观测陷阱。

**SLO** 是把这些信号变成可计算的承诺。三个概念要分清：

- **SLI**（指标）：`成功请求数 / 有效请求数`，按什么算成功由你定义（状态码 200 且耗时小于 300 毫秒？还是只要不是 5xx？）。
- **SLO**（目标）：比如"99.9% 的请求在 300 毫秒内成功"。
- **SLA**（合同）：带赔偿条款的外部承诺，通常比内部 SLO 松。

99.9% 换算成时间是：

```
30 天 = 2,592,000 秒
不可用预算 = 2,592,000 × 0.001 = 2,592 秒 = 43 分 12 秒
99.95% → 1,296 秒 = 21 分 36 秒
99.99% → 259.2 秒 = 4 分 19 秒
```

这个数字的用处是错误预算：没用完可以继续发版，用完了就该停下来修稳定性。比"P99 超过 300 毫秒就报警"更成熟的做法是燃尽率告警：一小时的错误率是允许值的十几倍时，这个月的预算会在几天内烧光，那才值得叫醒人。单点越线的告警只会淹没在噪声里。

最后是业务指标。HTTP 200 只说明"服务器没有崩"，不说明"用户得到了他想要的东西"。信息流的"首屏渲染成功率"、下单链路的"支付转化率"、搜索的"零结果率"，这些指标必须自己埋，而且要和方法层指标放在同一块看板上。**技术指标解释"为什么"，业务指标解释"值不值得修"**——两者缺一，你要么在修一个没人用的功能，要么在为一个没人发现的故障加班。

## 追踪模型：trace、span 与 W3C traceparent

追踪的数据模型只有三个概念，但每一个的概念边界都很重要。

**trace（追踪）**：一次完整请求的逻辑链路，用 `trace_id` 标识。一个 trace 是一棵 span 树。

**span（跨度）**：树上的一个节点，代表一个有开始和结束的操作。它包含：

- `trace_id`：属于哪条链路。
- `span_id`：自己的 ID，16 个 hex 字符。
- `parent_span_id`：父节点的 ID。根 span 没有父节点。
- `name`：操作名，比如 `GET /api/articles/feed`、`SELECT author`。
- `kind`：`server`、`client`、`producer`、`consumer`、`internal`。这个字段决定了它在瀑布图里怎么画，也决定了语义——一个 `client` span 应该有一个对应的远端 `server` span。
- 开始与结束时间戳。
- attributes：键值对。`http.method`、`db.system`、`db.statement`、`messaging.destination`。
- events：span 生命周期内的瞬时事件，比如 `exception`、`cache.miss`。
- status：`Unset`、`Ok`、`Error`。注意 `Unset` 不等于成功，它只是"没有显式设置"。

四个 ID 的关系可以用一个例子说透：网关收到请求，生成 trace_id `T`，创建 span `S1`（网关自己的 server span）；网关调内容服务，创建 client span `S2`，`parent=S1`；内容服务收到请求，从 header 里读到 `T` 和 `S2`，创建自己的 server span `S3`，`parent=S2`；内容服务查数据库，创建 client span `S4`，`parent=S3`。整棵树以 `T` 聚合。

这里有一个常见误解：**`parent_span_id` 指的是"调用我的那个 span"，不是"我上一个 span"**。所以跨服务时，下游的根 span 的 parent 是上游的 client span，不是上游的 server span。这保证了瀑布图能把网络传输时间也画出来——上游 client span 的结束时间减去下游 server span 的开始时间，就是网络加排队的耗时。

**baggage** 是第四个概念，容易和 trace 混。它是随请求传播的一组键值对，W3C Baggage 规范定义，走独立的 `baggage` header，格式是 `key1=value1,key2=value2`（值需要百分号编码）。它的用途是业务上下文：租户 ID、灰度分组、实验桶。它**不是** trace 的一部分，不会出现在 span 的 attributes 里，除非你手动读出来。

关于 baggage 有一条安全铁律：**它是客户端可控的，不能用于鉴权或权限判断。**任何从 baggage 里读出来的"用户角色"都可能是伪造的，因为它的源头是一个 HTTP header。它的正确用法是"传递提示信息"，比如让下游知道该查哪个分库。

然后是 W3C Trace Context 的 `traceparent`，格式固定为四段，用 `-` 分隔：

```text
00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
 │  └────────── 32 hex ──────────┘ └── 16 hex ──┘ └flags┘
version          trace-id                  parent-id     trace-flags
```

- `version`：两位。`00` 是当前规范版本。未来版本可能加字段，解析时要"遇到不认识的版本就丢弃整条 header"，而不是猜。
- `trace-id`：32 个 hex 字符，128 bit。全零是非法值。
- `parent-id`：16 个 hex 字符，64 bit。它就是"调用方那个 span 的 span_id"。全零也是非法值。
- `trace-flags`：8 bit，目前只用最低位表示"是否采样"。`01` 表示采样，`00` 表示不采样。

解析时要做的校验和容错：

```python
def parse_traceparent(value: str):
    parts = value.split("-")
    if len(parts) != 4:
        return None
    version, trace_id, parent_id, flags = parts
    if version != "00":
        return None
    if len(trace_id) != 32 or len(parent_id) != 16:
        return None
    if trace_id == "0" * 32 or parent_id == "0" * 16:
        return None
    try:
        int(trace_id, 16)
        int(parent_id, 16)
        flag_bits = int(flags, 16)
    except ValueError:
        return None
    return trace_id, parent_id, flag_bits & 0x01
```

关键的一条：**header 非法时，生成一个新的 trace，但不要拒绝这个请求。**追踪是观测设施，不是业务校验；因为一个格式错误的 header 返回 400，是把可观测性问题升级成了可用性问题。规范明确要求"invalid traceparent 应当被忽略"。

还有 `tracestate`，用于厂商扩展（比如某个 APM 厂商的采样标记），格式是逗号分隔的 `key=value`，长度有上限。它和 baggage 的区别是：tracestate 是给追踪系统自己用的，baggage 是给业务代码用的。

跨服务传播的载体不止 HTTP header：消息队列要写进消息属性（Kafka headers、RabbitMQ headers、SQS message attributes），gRPC 走 metadata。**只要有一个环节没传，链路就在那里断成两棵树。**

## 采样：head、tail 与固定比例的盲区

全量追踪的成本是很多人低估的。一个请求 20 个 span，10 QPS 看着不多，一天就是：

```
20 × 10 × 86,400 = 17,280,000 个 span/天
```

每个 span 含 name、时间戳、若干 attributes，序列化后量级是几百字节到几 KB。按 1 KB 算，一天就是 17 GB，一个月 500 GB。所以采样不是"优化"，是"能不能上线"的前提。

**head sampling（头部采样）** 在链路入口做一次决定，把结果写进 `trace-flags` 的最低位，全链路复用。优点是成本几乎为零——决定一次，后续所有服务读 header 就知道采不采，不需要缓冲。缺点是**决定得太早**：请求刚进来时，你还不知道它会不会失败、会不会慢。

**tail sampling（尾部采样）** 在收集端做。所有 span 先上报到 collector，collector 按 trace_id 缓冲整棵树，等 trace 结束后再根据完整信息决定"留还是丢"。策略通常是"错误全留、慢请求全留、其余按比例"。这恰好补上了 head sampling 的盲区。

固定比例采样的盲区可以算出来。设错误率 `p`，采样率 `r`，请求数 `N`，那么被采到的错误 trace 期望数量是：

```
E[错误样本] = N × p × r
```

要让这个期望值达到 1，需要的请求数是：

```
N = 1 / (p × r)
```

代进去看：

- 错误率 1%，采样率 1% → 需要 10,000 个请求才能看到 1 条错误 trace。
- 错误率 0.1%，采样率 1% → 需要 100,000 个请求。
- 错误率 0.01%（也就是 99.99% 可用性），采样率 1% → 需要 1,000,000 个请求。

最后一行是关键。**你的 SLO 越严，固定比例采样越看不见违反 SLO 的那些请求。**因为违反 SLO 的本来就是极少数，你再按比例削一刀，样本就没了。这就是"随机丢 1%，你丢了 98% 的错误"在追踪领域的同一个形状。

tail sampling 的代价是结构性的：

1. **collector 要缓冲整棵树**，内存随"每秒 trace 数 × 平均 trace 存活时间"增长。
2. **同一个 trace 的所有 span 必须到同一个 collector 实例**。否则每个实例只看到一部分 span，判断不准，而且存下来的树是残缺的。做法是在网关或负载均衡层按 `trace_id` 做一致性哈希路由。
3. **决定被推迟到 trace 结束**，所以从请求结束到 trace 可查之间有一个延迟。

实际生产里通常是两者组合：head sampling 做粗筛（比如先采 10% 把量降下来），tail sampling 做兜底（在这 10% 里把错误和慢请求全部留下）。错误保留率接近 100%，总成本是原来的 10% 加上一点缓冲开销。

## OpenTelemetry：从 API 到 OTLP 再到 Python 落地

OpenTelemetry（下称 OTel）解决的问题是"接口标准"。在它之前，每个 APM 厂商有自己的 SDK，换厂商要重埋一遍；OTel 把这件事拆成三层：

- **API**：定义 `Tracer`、`Span`、`Meter` 这些抽象，业务代码只依赖这一层。没有实现时是空操作（no-op），不会报错也不会拖慢。
- **SDK**：API 的实现，负责采样、上下文传播、批量导出。
- **Exporter**：把数据送出去。OTLP 是标准协议，gRPC 端口 4317，HTTP 端口 4318。

好处很实际：业务代码只 import API，将来换后端只改 SDK 初始化与 exporter 配置。

几个核心对象的关系：

- `TracerProvider` 是全局单例，进程启动时创建一次，配置 sampler、exporter、resource（服务名、版本、实例 ID）。
- `Tracer` 从 provider 拿，通常按模块命名（`get_tracer("article.feed")`）。
- `Span` 从 tracer 创建，可以是 `start_as_current_span`（自动设为当前 span，退出时结束）或 `start_span`（手动管理）。
- `Attribute` 是 span 上的键值对，要遵守语义约定（`http.request.method`、`db.system`、`db.namespace`）。自己发明 `my_sql_time` 这种名字，数据就没法和别人的看板对齐。
- `Event` 是 span 内的瞬时事件，带时间戳。
- `Status` 是 `Ok` / `Error`，设置 `Error` 时应该同时 `record_exception()`。

**自动埋点与手动 span 的边界**，是落地时最容易做错的地方。原则是：

- **自动埋点负责框架边界**：HTTP server 收请求、HTTP client 发请求、数据库驱动执行语句、消息队列收发。这些是"任何业务都一样"的边界，用 `opentelemetry-instrumentation-django`、`-httpx`、`-psycopg` 这类库，一个 `instrument()` 调用就全覆盖，而且它们自动处理上下文注入和提取。
- **手动 span 负责业务语义**：`feed.rank`（排序）、`feed.hydrate`（补作者信息）、`risk.check`（风控校验）。这些是"你的系统独有"的阶段，自动埋点看不见。

反面做法是"给每个函数加一个 span"。后果有三：span 数量爆炸（成本）、瀑布图上几十层嵌套（噪声）、以及大部分 span 的耗时都是微秒级（无信息）。**一个有用的经验法则：只有当一个阶段可能占据总耗时 5% 以上，或者它可能独立失败时，才值得一个 span。**

Python 落地的四个位置，逐个说。

第一，Django/DRF 中间件。自动埋点已经会给每个请求创建 server span，但如果你想加业务属性，用中间件补充：

```python
from opentelemetry import trace

tracer = trace.get_tracer("article.api")

class FeedSpanMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        span = trace.get_current_span()
        span.set_attribute("feed.page", request.GET.get("page", "1"))
        span.set_attribute("feed.user_tier", getattr(request, "tier", "anon"))
        with tracer.start_as_current_span("feed.hydrate") as child:
            child.set_attribute("hydrate.strategy", "batch")
            response = self.get_response(request)
            child.set_attribute("hydrate.authors", getattr(request, "author_count", 0))
        return response
```

注意 `trace.get_current_span()` 拿到的是自动埋点创建的那个 span，`start_as_current_span` 创建的是它的子 span。**不要在这里重新创建根 span**——那会把链路切断成两棵树。

第二，给 `httpx` / `requests` 注入上下文。如果用了 `opentelemetry-instrumentation-httpx`，注入是自动的。手动注入的做法是：

```python
from opentelemetry.propagate import inject
import httpx

headers = {}
inject(headers)          # 把当前 span 的 traceparent 写进 dict
resp = httpx.get("http://author-svc/internal/authors", headers=headers)
```

`inject` 读的是当前的 context（`contextvars`），写的是 W3C 格式的 header。接收端用 `extract` 还原。**这两个函数是跨服务不丢链路的唯一正确做法**——手写 `headers["traceparent"] = ...` 很容易漏掉 tracestate，或者在异步上下文里拿错 span。

第三，给数据库查询加 span。自动埋点会给每次 execute 创建 span，但 SQL 里的参数默认不会记录（有隐私和体积问题）。如果你需要定位"哪条 SQL 慢"，可以手动包一层，只记录语句模板和表名：

```python
from opentelemetry import trace

tracer = trace.get_tracer("article.db")

def fetch_authors(conn, author_ids):
    with tracer.start_as_current_span("db.author.batch") as span:
        span.set_attribute("db.system", "postgresql")
        span.set_attribute("db.operation", "SELECT")
        span.set_attribute("db.collection.name", "author")
        span.set_attribute("db.query.ids_count", len(author_ids))
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, name FROM author WHERE id = ANY(%s)",
                (author_ids,),
            )
            return cur.fetchall()
```

`db.query.ids_count` 这个属性是排查的关键——它让你在瀑布图上直接看到"这次批量查了 20 个 ID"，而不是"一次查询"。

第四，异步上下文。这是最容易出问题的地方。OTel 的 Python SDK 用 `contextvars` 存当前 span，所以在 `async def` 里是对的；但如果你用 `run_in_executor` 把工作丢进线程池，`contextvars` 不会自动传过去，必须显式复制：

```python
import asyncio, contextvars

ctx = contextvars.copy_context()

async def handle():
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, ctx.run, blocking_work)
    return result
```

不这么做，线程里的 span 会是"没有父节点"的新根——链路在那里断掉，而且断得很安静，你只会觉得"这个下游服务的 trace 怎么总是单独的"。

最后是 exporter 配置。生产上必须用 `BatchSpanProcessor`，不要用 `SimpleSpanProcessor`：

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource

provider = TracerProvider(
    resource=Resource.create({
        "service.name": "article-api",
        "service.version": "2026.11.04",
        "deployment.environment": "prod",
    })
)
provider.add_span_processor(
    BatchSpanProcessor(
        OTLPSpanExporter(endpoint="http://otel-collector:4317", insecure=True),
        max_queue_size=2048,
        schedule_delay_millis=5000,
    )
)
trace.set_tracer_provider(provider)
```

`BatchSpanProcessor` 会攒一批再发，队列满了丢 span 并计数，但不阻塞业务线程。这个取舍是对的：观测不能拖垮业务。前提是你知道它在丢，否则会把"丢 span"误读成"这段时间没流量"。

## 一次真实排查：从 P99 到那条 SQL

回到开头那个场景，假设你已经有了 Histogram、exemplar、OTel 和带 trace_id 的日志。

**第一步，指标确认形状。**查询 P50 和 P99 的对比：

```text
histogram_quantile(0.50, sum by (le) (rate(http_request_duration_seconds_bucket{route="/api/articles/feed"}[5m]))
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket{route="/api/articles/feed"}[5m]))
```

结果是 P50 从 60 涨到 68，P99 从 120 涨到 410。**这两个数字一起看，结论立刻不同**：如果是"整体变慢"，P50 会跟着涨；P50 基本不动而 P99 涨了三倍，说明是**一部分请求**变慢了，而且这部分占比不大（小于 5%，否则 P95 也会动）。这一步就把"服务整体退化"和"长尾问题"分开了。

**第二步，看 P99 桶的分布有没有移动。**如果 P99 落在的桶从 `(0.1, 0.25]` 移到了 `(0.25, 0.5]`，说明慢的这部分是"多花了两三百毫秒"，而不是"卡住几十秒"。这个量级和"多查了十几次数据库"是吻合的，和"下游超时"不吻合（超时通常是秒级）。

**第三步，从 exemplar 拿一条 trace_id。**Grafana 上点那个落在高桶里的 exemplar 点，跳到追踪系统。瀑布图长这样：

```text
GET /api/articles/feed                 410ms  server
├── feed.query_articles                 22ms  internal
├── feed.rank                           18ms  internal
├── feed.hydrate                       355ms  internal
│   ├── SELECT author (id=1)            17ms  client
│   ├── SELECT author (id=2)            16ms  client
│   ├── ... 共 20 次 ...
│   └── SELECT author (id=20)           18ms  client
└── render.template                     14ms  internal
```

一眼就能看出 355 毫秒里有 20 次串行的 `SELECT author`，每次 16 到 18 毫秒。**"单次不慢，串行很多次"**——这正是开头说的那个形状。

**第四步，属性定位。**点开任意一个 `SELECT author` span，属性里有 `db.system=postgresql`、`db.operation=SELECT`、`db.collection.name=author`、`db.query.ids_count=1`。注意最后这个属性：**如果它显示 1，说明代码是逐条查询；如果显示 20，说明已经是批量查询但批量本身慢**。这一个属性就把"要不要改成批量"这个决策变成了事实判断。

**第五步，日志确认参数。**用 trace_id 去日志系统里捞：

```text
trace_id=4bf92f3577b34da6a3ce929d0e0e4736
```

捞到的几行里，`feed.build` 那行有 `author_ids=[1,2,...,20]` 和 `page_size=20`。到这里，"这一页有 20 个不同作者，代码给每个作者单独查了一次"这个事实链就完整了。修复方案是 `WHERE id = ANY(%s)` 一次查完，20 次往返变成 1 次。

这个链路里，每一步都不可或缺：

- 没有指标，你不会知道"是长尾还是整体"，也不知道该抓哪类请求。
- 没有 exemplar，你只能随机抽 trace，抽到的概率是 99% 的正常请求。
- 没有 trace，你知道 410 毫秒，但不知道 355 在 hydrate。
- 没有 span 属性，你知道 hydrate 慢，但不知道是"20 次单查"还是"1 次批量查得慢"。
- 没有日志，你知道查了 20 次，但不知道这 20 个 ID 是从哪来的、是不是分页参数被人改大了。

**日志和 trace 的缝合**，就在最后一步。做法很简单，在 logging 的 filter 里把当前 span 的上下文写进 record：

```python
import logging
from opentelemetry import trace

class TraceContextFilter(logging.Filter):
    def filter(self, record):
        ctx = trace.get_current_span().get_span_context()
        if ctx.is_valid:
            record.trace_id = format(ctx.trace_id, "032x")
            record.span_id = format(ctx.span_id, "016x")
        else:
            record.trace_id = "-"
            record.span_id = "-"
        return True

logging.getLogger().addFilter(TraceContextFilter())
```

然后 formatter 里加 `%(trace_id)s`。日志系统（Loki、ELK、CloudWatch）都能按这个字段建索引或过滤。**这里的顺序很重要：先有 trace_id，日志才有聚合维度；如果只有 request_id，你在追踪系统里搜不到它。**

一个容易被忽略的点：**日志里写的 trace_id 必须是"当前 span"的，不是"根 span"的。**如果你在 hydrate 的子 span 里打日志，写根 trace_id 是对的（聚合用），但写根 span_id 就丢了"这行日志属于哪个阶段"。两个都写：`trace_id` 用于聚合，`span_id` 用于在瀑布图上对齐。

## 存储与成本：基数、采样率与保留期

最后一节算账。因为可观测性系统的账单，通常不是"买不起"，而是"不知道怎么涨上去的"。

**指标的存储成本由时间序列数决定，不由样本数决定。**Prometheus 的本地 TSDB 每 2 小时切一个 block，每个 block 里按 2 小时的时间窗存样本。一条序列只要存在，就至少占一份索引和 chunk 的开销；抓取间隔从 15 秒改成 5 秒，样本数变 3 倍，但序列数不变。所以：

```
总成本 ≈ 序列数 × 单序列开销 + 样本数 × 单样本开销
```

序列数由上一节那个乘积公式决定。所以降基数是唯一有效的手段：删掉一个高基数标签可能省掉九成成本，而把抓取间隔翻倍只省一半样本存储。

保留期的配置是 `--storage.tsdb.retention.time`（比如 15 天）和 `--storage.tsdb.retention.size`（比如 100 GB），两个都设，谁先到谁生效。本地 TSDB 不适合长期保留——它不是为多年归档设计的。长期方案是 `remote_write` 到 Thanos、Mimir、VictoriaMetrics 这类系统，本地只留几天做快速查询。

**追踪的存储成本由三个因子相乘决定：**

```
span 数/天 × 采样率 × 平均 span 体积 × 保留天数
```

三个因子分别对应三种治理手段：

1. **span 数**：控制 span 粒度。别给每个函数加 span，别把每个 SQL 参数塞进 attribute。一个 span 的 attributes 从 5 个涨到 50 个，体积可能涨 10 倍。
2. **采样率**：head 粗筛 + tail 兜底。错误和慢请求保留 100%，正常请求保留 1% 到 10%。
3. **保留期**：错误 trace 留 30 天，正常 trace 留 3 天。按"错误/正常"分不同的存储后端，是很常见的做法。

隐形成本还有 attribute 的基数：`db.statement` 带完整 SQL、`http.url` 带 query string，都会让压缩率崩掉。记语句模板和参数个数，参数值走日志。

治理清单，按投入产出排序：

- 先量基数。`prometheus_tsdb_head_series` 和每个指标的序列数，是判断"要不要治理"的唯一依据。
- 把 `request.path` 换成路由模板。这一条通常能砍掉一个数量级。
- 检查所有 Histogram 的桶数。20 个桶 × 160,000 条序列 = 320 万条，桶边界不是越密越好。
- 给 attribute 设白名单。自动埋点默认收集的东西往往比你需要的多。
- 采样策略写成配置，不要写死在代码里，事故期间要能临时调高采样率。

## 小结

把这篇的结论压成一张表：

| 问题 | 工具 | 关键约束 |
| --- | --- | --- |
| 有多慢、多常见 | Histogram + P95/P99 | 桶要覆盖 SLO；样本量要够；先 sum by (le) 再算分位 |
| 慢在哪一段 | trace 的 span 树 | 上下文必须跨服务传播；span 粒度要克制 |
| 那一段里发生了什么 | 日志 + trace_id | trace_id 要写进日志；参数才在日志里 |
| 是哪一条请求 | exemplar | 只对 Histogram 有意义；是抽样不是全量 |
| 成本为什么涨 | label 基数 / span 数 / 保留期 | 基数是一切成本的乘数 |

三句话收尾：

1. **平均值不是延迟指标，是延迟的谎言。**延迟分布长尾且多峰，任何把分布压成一个数的做法都会隐藏你要找的东西。
2. **指标、追踪、日志是三个不同的答案，不是一个答案的三种存法。**先指标确认规模，再追踪定位段落，最后日志确认参数——顺序反了，成本会翻几倍。
3. **采样必须对错误和慢请求例外。**固定比例采样的盲区可以用 `1/(p×r)` 算出来：你的 SLO 越严，这个盲区越大，而它恰好盖住了你最需要看的那部分请求。

## 相关阅读

- [300 行日志里，只有 6 行是你的](/article/structured-logging-tracing-deep-dive/)
- [超时、重试与熔断：三个参数之间的相互陷害](/article/resilience-timeout-retry-circuit-breaker-deep-dive/)
- [排队论与容量规划：QPS 涨一倍，延迟涨几倍](/article/queueing-theory-capacity-planning/)
- [限流算法：令牌桶、漏桶与滑动窗口的边界](/article/rate-limit-algorithms-deep-dive/)
