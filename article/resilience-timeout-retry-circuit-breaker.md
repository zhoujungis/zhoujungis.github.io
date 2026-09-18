---
title: "下游只抖了 3 秒，我的服务被拖死 5 秒——超时、重试、熔断、降级实战（含并发实测）"
slug: "resilience-timeout-retry-circuit-breaker-deep-dive"
category_id: null
tags: ["后端", "高可用", "熔断", "降级", "高并发"]
status: "published"
cover_image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80&auto=format&fit=crop"
---

# 下游只抖了 3 秒，我的服务被拖死 5 秒——超时、重试、熔断、降级实战（含并发实测）

> 适用读者：写过 `requests.post(url, json=data)` 就上线、从没认真设过 `timeout` 的后端工程师
> 技术栈：Python 纯标准库 + 真实多线程压测；原理与语言无关，Django / Spring Boot / Go 通用
> 阅读时间：约 32 分钟 | 难度：中高级 | 收获：四件套的可运行实现 + 6 组实测数据 + 一份可直接抄的参数清单

## 前言：一次"下游 3 秒就恢复了，我们 5 分钟才缓过来"的事故

早上 9:12，监控告警：文章详情页 502，持续 5 分钟。

第一时间去看数据库——正常。CPU——正常。自己写的业务代码——当天没有任何发布。最后发现是**推荐服务**（返回"相关文章"列表的那个）挂了：一个没走索引的查询把它的 RT 从 30ms 拖到了 5s。

推荐服务 3 分钟后自己恢复了（DBA 杀掉了那个慢查询）。但我们的文章页又多瘫了两分钟才缓过来。

复盘的时候，把文章页调推荐服务的那 8 行代码翻出来，发现了**五个连环错误**，而且每一个单独看都"挺合理"：

```python
# 事故版本——五个错误全在这 8 行里
def related_articles(article_id):
    try:
        resp = requests.post(REC_URL, json={"id": article_id})   # ① 没设 timeout
    except Exception:
        for _ in range(3):                                        # ② 固定退避、③ 无脑重试
            time.sleep(0.3)
            try:
                resp = requests.post(REC_URL, json={"id": article_id})
                break
            except Exception:
                continue
        else:
            raise                                                 # ④ 没有降级
    return resp.json()                                            # ⑤ 没有熔断
```

| # | 缺失的东西 | 直接后果 |
|---|---|---|
| ① | **超时** | 20 个 worker 全被 5s 的请求占死，队列堆满 |
| ② | **抖动** | 恢复瞬间所有重试同时到达，把刚活过来的推荐服务二次打死 |
| ③ | **重试节制** | 每个用户请求变成 4 次下游调用，放大 4 倍 |
| ④ | **降级** | "相关文章"只是个装饰模块，它挂了整页就该 502 吗？ |
| ⑤ | **熔断** | 明知对面已经死了，还在每秒往上面打几百次 |

这篇文章不打算背诵四个名词的定义，而是把每一个机制**真的实现出来压测一遍**，用数据回答几个真问题：

- 为什么"没设超时"能让**下游已经恢复、你自己还在瘫**？
- 重试明明是为了提高成功率，为什么实测把我的吞吐**砍掉了 88%**？
- 抖动（jitter）到底能削掉多少峰值？
- 熔断的收益和代价各是多少——它真的没有副作用吗？

**目录**

- 先分清：限流是"入站"的，这四件套是"出站"的
- 超时：唯一没有商量余地的那一个
- 超时到底设多少：从 P99 到超时预算
- 重试：唯一能把故障放大的机制
- 重试的前提：幂等，以及"值得重试"的错误
- 退避与抖动：把同步的重试波打散
- 重试预算：给重试装一个总闸门
- 熔断：别再往一个已经死了的依赖上打
- 降级：熔断之后，你到底给用户什么
- 舱壁隔离：别让一个慢依赖拖死另一个健康依赖
- 四件套组合：一条链路的完整配置表
- 上线 Checklist + 高频 FAQ

---

## 1. 先分清：限流是"入站"的，这四件套是"出站"的

聊之前先划清地盘，因为它们经常被混为一谈：

| 机制 | 方向 | 管的是谁 | 触发后做什么 |
|---|---|---|---|
| 限流 Rate Limiting | **入站** | 别人打我 | 拒绝 / 排队 |
| 超时 Timeout | **出站** | 我打别人 | 放弃等待，释放线程 |
| 重试 Retry | **出站** | 我打别人 | 再试一次（**会放大流量**） |
| 熔断 Circuit Breaker | **出站** | 我打别人 | 直接不打，快速失败 |
| 降级 Degradation | **出站** | 我打别人 | 用兜底数据替代 |
| 舱壁 Bulkhead | 出站 | 我打别人 | 限制单个依赖占用的资源 |

一句话区分：**限流防的是"别人把你打死"，这四件套防的是"你被自己的依赖拖死"。**

一个系统可以限流做得很好（挡住了外部洪峰），却在第一个下游抖动时全线崩溃——因为它的出站调用是裸奔的。反过来也一样：出站治理做得再好，一个爬虫就能把你打挂。

特别提醒：本系列的[限流算法实测](/article/rate-limit-algorithms-deep-dive/)那篇管的是入站，这篇管出站，两者正交，都需要。

---

## 2. 超时：唯一没有商量余地的那一个

### 2.1 实验 A：不设超时，下游恢复了你也缓不过来

先看实测。场景设计得很克制——**下游只劣化 3 秒**，不是永久宕机：

```
服务：20 个 worker 线程（模拟 gunicorn sync worker / Tomcat 线程池）
压测：60 个并发客户端闭环打，共 8 秒
下游：t < 3s 时 RT = 5s（近乎挂死），t ≥ 3s 时 RT = 30ms（完全恢复）
```

结果：

| 配置 | 总完成 | 吞吐 | p50 | p99 | 最大延迟 | 下游峰值并发 |
|---|---|---|---|---|---|---|
| **无超时** | 2021 | 249.8/s | 92ms | **5034ms** | 5059ms | 20 |
| **超时 200ms** | 3533 | 436.8/s | 92ms | **627ms** | 640ms | **320** |

只看聚合指标的话，无超时的 p50 竟然是"漂亮的" 92ms——**因为它 100% 的分位数都被恢复后的请求稀释了**。真正的伤害要看**每秒完成数的时间线**：

```
无超时  每秒完成数: 0 / 0 / 0 / 0 / 0 / 652 / 654 / 655 / 60
超时200ms 每秒完成数: 80 / 100 / 100 / 580 / 659 / 652 / 650 / 652 / 60
                                    ↑
                              下游在 t=3s 已经恢复
```

**下游 3 秒就恢复了，无超时的服务整整 5 秒零吞吐。**

为什么会多出 2 秒？因为在 t=2.99s 发出去的那个请求，要等到 t=7.99s 才返回。下游的故障窗口是 3 秒，但**你的故障窗口是 5 秒**——故障时长被"最后一个进入队列的请求"拉长了。队列越深，这个尾巴越长。

另外一个反直觉的数据：**无超时组的下游峰值并发只有 20，超时组的峰值并发是 320（16 倍）。**

这揭示了一个很多人没意识到的事实：

> **超时不是"保护下游"，是"保护你自己"。你松手的那一刻，请求还在下游那儿算着呢。**

超时组每秒放弃 100 个请求，这 100 个请求在下游还在占用 5 秒。下游的负载一点没减，反而因为你"放弃得快、重试得快"而变得更大。这就是为什么**超时必须和重试节制、熔断配套使用**——单独加超时，只是把洪水从自己家引到了下游家。

### 2.2 超时不是一个数字，是三个

这是最常见的配置错误。`requests` 的 `timeout` 参数可以接受一个元组，绝大多数人只传了一个数：

```python
# 错误：一个数字会同时作用于 connect 和 read
requests.post(url, json=data, timeout=3)

# 正确：连接超时和读取超时是两个完全不同的东西
requests.post(url, json=data, timeout=(1.0, 3.0))
#                                       ↑     ↑
#                                   connect  read
```

| 超时类型 | 管的是 | 典型值 | 设错会怎样 |
|---|---|---|---|
| **连接超时** connect | TCP 握手 + TLS | 0.5 ~ 2s | 太长：对端黑洞（SYN 无响应）时白等 |
| **读取超时** read | 两个数据包之间的间隔 | 依赖 P99 | 太长：慢查询拖死线程池 |
| **整体超时** deadline | 整个调用的总耗时 | 由链路预算决定 | 没有它，重试 3 次可能耗时 3 倍 |

注意 read timeout 的语义：**它不是"整个响应必须在这个时间内返回"，而是"任意两个数据包之间的间隔不能超过这个值"**。一个 100MB 的文件下载，只要数据一直在流，read timeout 就不会触发。所以大文件传输不能靠 read timeout 兜底，得用整体 deadline。

第三层"整体超时"是很多人漏掉的。看这段代码：

```python
# 三次重试，每次 read timeout 3s —— 最坏情况 9 秒？不止
for i in range(3):
    try:
        return requests.post(url, json=data, timeout=(1.0, 3.0))
    except Exception:
        time.sleep(0.5)
```

单次 3s + 退避 0.5s，三次下来最坏 **10.5 秒**。如果你的网关超时是 5 秒，那么这个请求注定超时——**你花了 10.5 秒的下游资源和线程池，去做一个 5 秒后注定被丢弃的结果**。

正确做法是**整体 deadline 传递**（deadline propagation）：

```python
import time

def call_with_deadline(url, payload, total_budget, attempts=3):
    """总预算固定，每次重试只能用掉剩余预算。"""
    deadline = time.monotonic() + total_budget
    for i in range(attempts):
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            break
        try:
            # 单次超时取剩余预算和单次上限的较小值
            per_try = min(remaining, 3.0)
            return requests.post(url, json=payload, timeout=(1.0, per_try))
        except Exception:
            if i == attempts - 1:
                raise
            time.sleep(min(0.5, max(0, deadline - time.monotonic())))
    raise TimeoutError("total budget exhausted")
```

这个模式的思想来自 Google 的 SRE 实践：**超时是一个沿着调用链往下递减的预算，不是每个环节各自拍脑袋的一个常数。**

### 2.3 Python / Django 里那些"默认没有超时"的坑

值得单独列出来，因为每一个我都见过它把服务拖死：

| 组件 | 默认行为 | 正确配置 |
|---|---|---|
| `requests` / `urllib3` | **默认无超时，永久等待** | 必须显式传 `timeout=(connect, read)` |
| `httpx` | 默认 5s | 显式设置更保险 |
| `socket` | 无超时 | `socket.setdefaulttimeout(10)` |
| `redis-py` | `socket_timeout=None` | `socket_timeout=1, socket_connect_timeout=1` |
| `psycopg2` | 无 statement 超时 | `OPTIONS: {"statement_timeout": "3s"}` |
| `MySQLdb` | 无 | `SET SESSION max_execution_time=3000` |
| `gunicorn` | `timeout=30`（太长） | sync worker 建议 10~15s，且必须小于 LB 超时 |
| Celery task | 无 | `soft_time_limit` + `time_limit` |

Django 的数据库连接加 statement 超时：

```python
# settings.py
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        # ...
        "CONN_MAX_AGE": 60,
        "OPTIONS": {
            "connect_timeout": 3,
            # 单条 SQL 最多跑 3 秒，防止一个慢查询拖死整个连接池
            "options": "-c statement_timeout=3000",
        },
    }
}
```

⚠️ 注意 `statement_timeout` 是**单条 SQL** 的，不是整个事务的。事务里跑 100 条 2 秒的 SQL，总时长还是 200 秒。要限制事务总时长，得用 `idle_in_transaction_session_timeout` 加应用层 deadline。

---

## 3. 重试：唯一能把故障放大的机制

超时让你"松手"，重试让你"再来一次"。超时是纯收益（除了前面说的把压力转嫁给下游），**重试是唯一一个"本意是救命、实则可能致命"的机制**——因为它是唯一会主动增加流量的那个。

### 3.1 实验 B：重试 3 次，我的吞吐掉了 88%

场景：下游已经慢了（RT 恒定 1s，远超 150ms 超时），20 worker / 40 并发客户端 / 6 秒：

| 重试次数 | 用户请求数 | 下游调用数 | **放大倍数** | 用户吞吐 | 下游峰值并发 |
|---|---|---|---|---|---|
| 0 | 800 | 800 | ×1.00 | **128.3/s** | 140 |
| 1 | 320 | 640 | ×2.00 | 47.6/s | 113 |
| 2 | 180 | 540 | ×3.00 | 25.7/s | 100 |
| 3 | 120 | 480 | ×4.00 | **15.0/s** | 80 |

两个数字要看懂：

**第一，放大倍数是精确的 ×(n+1)。** 因为所有请求都必然超时，重试 n 次就是 n+1 次调用，无一例外。

**第二，也是最要命的——这是一笔双输的买卖。**

```
用户吞吐：128.3/s  →  15.0/s     （掉了 88.3%，8.6 倍差距）
下游调用：800      →  480        （只降了 40%）
```

你用 88% 的自身吞吐损失，只换来了下游 40% 的减载。**省下来的算力全烧在了注定失败的重试上。**

换个角度算更清楚：

| 重试次数 | 下游每做 1 次工作，能服务几个用户请求 |
|---|---|
| 0 | 1.00 |
| 3 | **0.25** |

下游每处理 4 次调用，只有 1 次对应一个真实的用户请求，其余 3 次是纯粹的重复劳动。而且这 4 次**全都失败了**——有效产出是 0。

这就是"重试风暴"的数学本质：**下游越慢 → 越多请求超时 → 越多重试 → 下游更慢**。这是一个正反馈环，只要有重试、没有节制，它一定会自我强化到崩溃。

### 3.2 不是所有请求都能重试：先问幂等

在讨论"重试几次"之前，有一个更前置的问题必须回答：**这个操作重试安全吗？**

| 操作 | 幂等 | 能直接重试吗 |
|---|---|---|
| `GET /articles/123` | ✅ 是 | 可以 |
| `PUT /articles/123`（全量覆盖） | ✅ 是 | 可以 |
| `DELETE /articles/123` | ✅ 是 | 可以 |
| `POST /orders`（创建订单） | ❌ 否 | **必须带幂等键** |
| `POST /payments`（扣款） | ❌ 否 | **必须带幂等键** |
| `PATCH /articles/123`（`inc` 类操作） | ⚠️ 视语义 | 小心 |
| 发短信 / 发邮件 | ❌ 否 | 必须带幂等键 |

关键点在于：**超时 ≠ 失败**。你看到的 `TimeoutError` 可能是：

1. 请求根本没到下游 → 重试安全
2. 请求到了，下游正在处理，只是慢 → 重试会**执行两次**
3. 请求处理完了，响应在回程丢了 → 重试会**执行两次**

对于非幂等的操作，第 2、3 种情况下的重试就是"用户只点了一次，订单生成了两笔"。这个话题展开很长，本系列的[接口幂等与防重复提交实战](/article/api-idempotency-deep-dive/)专门讲，这里只给结论：

> **非幂等接口加重试之前，先加幂等键。顺序反了就是事故。**

### 3.3 只重试"值得重试"的错误

另一个常见错误：把 `except Exception` 包住然后无脑重试。

```python
# 错误示范：400 你重试一万次也是 400
try:
    resp = requests.post(url, json=data, timeout=(1, 3))
    resp.raise_for_status()
except Exception:
    retry()
```

**值得重试的（瞬时故障）：**

- 连接超时、连接被拒绝、连接重置
- 读取超时（**仅限幂等操作**）
- 5xx 中的 `502 / 503 / 504`
- `429 Too Many Requests`（且遵守 `Retry-After`）

**绝对不该重试的（永久故障）：**

- `400 Bad Request` / `401` / `403` / `404` / `422` —— 重试一万次还是同样的结果
- 业务错误码（余额不足、库存不够、参数非法）
- 序列化失败、代码 Bug

```python
RETRYABLE_STATUS = {408, 429, 500, 502, 503, 504}

def is_retryable(exc):
    if isinstance(exc, (requests.ConnectionError, requests.Timeout)):
        return True
    if isinstance(exc, requests.HTTPError) and exc.response is not None:
        return exc.response.status_code in RETRYABLE_STATUS
    return False
```

顺带一提，`429` 和 `503` 的响应里如果有 `Retry-After` 头，**优先尊重它**，别用自己算的退避时间。下游明确告诉你"3 秒后再来"，比你自己猜准得多。

### 3.4 退避与抖动：实验 C

就算该重试，也不该"立刻重试"。立刻重试 = 用同样的力度再撞一次墙。

**指数退避**：第 n 次重试等待 `base × 2^(n-1)`。base=300ms 时：300ms、600ms、1200ms。

但指数退避有个致命缺陷——**如果所有客户端同时失败，它们会同时退避、同时重试**。这就是惊群（thundering herd）。

实测（120 个同步的客户端，下游 t∈[1s,5s] 宕机，退避基数 300ms，最多重试 3 次），统计**恢复之后**每 100ms 窗口的下游调用数：

```
固定退避:   26  0  0  0  55  39  0   2 118  0   0 120  0   0 120  0   0  19 101
全抖动:     25 28 23 24  35  31 17  41  40  22  36  45  30  31  47  35  28  46  37
```

| 策略 | 恢复后峰值 QPS | 恢复后均值 QPS | 突刺比 | 变异系数 CV |
|---|---|---|---|---|
| 固定退避 | **1200/s** | 357/s | ×3.36 | **1.43** |
| 全抖动 | **520/s** | 361/s | ×1.44 | **0.23** |

看那行固定退避的数字：**118 / 0 / 0 / 120 / 0 / 0 / 120**——下游被三轮整齐的重试波反复冲击，波谷是 0，波峰是 1200 QPS。真实世界的下游在这种波形下，刚恢复就会再次被峰值打死，然后进入"恢复→被打死→恢复→被打死"的震荡。

全抖动把峰值从 1200 压到 **520（-57%）**，变异系数从 1.43 降到 **0.23（-84%）**，而**平均负载几乎不变（357 vs 361）**。

**平均负载不变，峰值砍半——这就是抖动的全部价值：把集中的冲击摊平成均匀的负载。**

三种抖动策略：

```python
import random

def backoff_delay(base, attempt, strategy="full"):
    raw = base * (2 ** (attempt - 1))
    if strategy == "none":
        return raw                                  # 无抖动：会惊群
    if strategy == "equal":
        return raw / 2 + random.uniform(0, raw / 2)  # 半抖动：有下限，尾部仍较集中
    if strategy == "full":
        return random.uniform(0, raw)                # 全抖动：AWS 推荐，削峰最好
    if strategy == "decorrelated":
        return random.uniform(base, raw * 3)         # 去相关抖动：退避期望更长
    return raw
```

AWS 的官方建议是**全抖动（full jitter）**，实测也确实削峰最狠。它的代价是**平均等待时间变长**（期望是 raw/2 而不是 raw），也就是说单次请求的成功延迟会略高一点。在你更关心"下游别被二次打死"的场景，这个交换非常划算。

顺便说个坑：**`random` 要用每个客户端独立的实例，不要用全局 random。** 全局 `random` 在多线程下有锁竞争，而且如果你给所有线程用同一个种子，它们会算出**完全相同的退避序列**——抖动就白加了。

### 3.5 重试预算：给重试装一个总闸门

退避解决"什么时候重试"，重试预算解决"总共能重试多少"。

思路（来自 Google SRE）：**重试次数不按单请求算，而按全局比例算——重试量不得超过近期成功量的某个百分比。** 比如 20%：每 100 次成功请求，最多只允许 20 次重试。

实测，场景分两段：

**第一段：下游 30% 概率随机失败（部分降级，不是全挂）**

| 配置 | 放大倍数 | 真实成功率 | 预算拒绝 |
|---|---|---|---|
| 不设预算 | ×1.45 | 99.0% | 0 |
| 预算 50% | ×1.45 | 98.9% | 2 |
| 预算 20% | ×1.29 | **88.1%** | 150 |

结论很有意思：**错误率不高时，预算几乎不生效**（50% 档只拒绝了 2 次）。这是设计使然，也是它的优点——**它不干扰正常运维，只在真正出事时才起作用**。

预算 20% 那档成功率掉到 88.1%，看起来很糟。但请注意这个前提：**重试被拒绝 ≠ 请求失败**，它应该走降级路径（返回兜底数据）。如果你的降级真的只能返回错误，那就别把预算压这么低。

**第二段：同一套配置，下游彻底不可用（100% 超时）**

| 配置 | 用户吞吐 | 下游调用 | 放大倍数 |
|---|---|---|---|
| 不设预算 | **26.7/s** | 640 | **×4.00** |
| 预算 20% | **97.0/s** | 603 | **×1.04** |

这组数字是全文最反直觉的：**给重试加限制之后，我自己的吞吐反而涨了 3.6 倍。**

为什么？因为不设预算时，每个 worker 有 3/4 的时间在做注定失败的重试；砍掉这些无效劳动后，同样的 20 个 worker 能服务 3.6 倍的用户请求——虽然其中一部分只能拿到兜底数据，但**至少是立刻拿到**，而不是转圈 10 秒后拿一个 502。

> **重试预算不只是保护下游的善举，它是保护你自己的算术。**

一个简化实现：

```python
import threading
import time

class RetryBudget:
    """全局重试闸门：窗口内重试次数 <= ratio * 成功次数。"""

    def __init__(self, ratio=0.2, window=1.0, clock=time.monotonic, floor=10):
        self.ratio = ratio
        self.window = window
        self.clock = clock
        self.floor = floor          # 成功数为 0 时仍允许的最小重试量（用于探测）
        self.lock = threading.Lock()
        self.success = 0
        self.retries = 0
        self.window_start = clock()
        self.denied = 0

    def allow(self):
        with self.lock:
            now = self.clock()
            if now - self.window_start >= self.window:
                self.success *= 0.5   # 衰减而不是硬清零，避免边界突刺
                self.retries = 0
                self.window_start = now
            if self.retries <= self.ratio * max(self.success, self.floor):
                self.retries += 1
                return True
            self.denied += 1
            return False

    def record_success(self):
        with self.lock:
            self.success += 1
```

两个细节：

- **`floor` 参数**：成功数为 0 时（下游全挂），仍然允许每窗口 `ratio × floor` 次重试。否则预算会把自己锁死，永远探测不到下游恢复。
- **衰减而非硬清零**：窗口切换时成功数减半而不是归零，避免"窗口刚切换 → 预算瞬间归零 → 又瞬间放开"的锯齿。

---

## 4. 熔断：别再往一个已经死了的依赖上打

超时让你"等太久就松手"，重试预算让你"别一直重试"，但它们都不回答一个问题：

> **如果我已经知道下游死了，为什么还要发第一个请求？**

熔断器的答案：**不发。直接失败，直接降级。**

### 4.1 三态状态机

```
        ┌──────────────────────────────────────┐
        │                                      │
        ▼                                      │
   ┌─────────┐  失败率超阈值    ┌────────┐  冷却到期  ┌───────────┐
   │ CLOSED  │ ───────────────▶ │  OPEN  │ ────────▶ │ HALF-OPEN │
   │ 正常放行 │                  │ 全部拒绝 │           │  放探针   │
   └─────────┘ ◀───────────────  └────────┘           └───────────┘
        ▲          探测成功            ▲                     │
        └──────────────────────────────┴─────────────────────┘
                                          探测失败
```

| 状态 | 行为 | 目的 |
|---|---|---|
| **CLOSED** | 正常放行，统计失败率 | 常态 |
| **OPEN** | 立即失败（**不发出请求**） | 停止踩踏，给下游喘息时间 |
| **HALF-OPEN** | 放行有限个探针请求 | 探测下游是否恢复 |

最容易写错的是 HALF-OPEN：很多人实现成"冷却时间到就直接全部放行"，结果下游没真恢复的话，瞬间的全量流量会**立刻**把它再次打死。正确做法是**放有限个探针**（比如 3 个），探针成功才关闸，失败就重新计时。

### 4.2 一个可用的实现

```python
import threading
import time
from collections import deque

class CircuitBreaker:
    """滑动窗口失败率熔断器，带半开探测。进程内实现，多实例需各自统计。"""

    def __init__(self, name, window=10.0, min_calls=20, threshold=0.5,
                 cooldown=5.0, probes=3, clock=time.monotonic):
        self.name = name
        self.window = window        # 统计窗口（秒）
        self.min_calls = min_calls  # 窗口内最少调用数，低于此值不判定（防低流量误熔）
        self.threshold = threshold  # 失败率阈值
        self.cooldown = cooldown    # 熔断后冷却多久进入半开
        self.probes = probes        # 半开状态放几个探针
        self.clock = clock
        self.lock = threading.Lock()
        self.events = deque()       # (timestamp, ok)
        self.state = "closed"
        self.opened_at = 0.0
        self.probe_left = 0
        self.open_count = 0
        self.rejected = 0

    def _prune(self, now):
        cut = now - self.window
        while self.events and self.events[0][0] < cut:
            self.events.popleft()

    def allow(self):
        with self.lock:
            now = self.clock()
            self._prune(now)
            if self.state == "open":
                if now - self.opened_at >= self.cooldown:
                    self.state = "half-open"
                    self.probe_left = self.probes
                else:
                    self.rejected += 1
                    return False
            if self.state == "half-open":
                if self.probe_left <= 0:
                    self.rejected += 1
                    return False
                self.probe_left -= 1
            return True

    def record(self, ok):
        with self.lock:
            now = self.clock()
            self.events.append((now, bool(ok)))
            self._prune(now)
            if self.state == "half-open":
                if ok:
                    self.state = "closed"
                    self.events.clear()
                else:
                    self.state = "open"
                    self.opened_at = now
                    self.open_count += 1
                return
            if len(self.events) >= self.min_calls:
                fails = sum(1 for _, ok_ in self.events if not ok_)
                if fails / len(self.events) >= self.threshold:
                    self.state = "open"
                    self.opened_at = now
                    self.open_count += 1
                    self.events.clear()
```

三个参数值得单独解释：

- **`min_calls`（最小调用数）**：窗口内不足 20 次调用就不判定熔断。没有它，凌晨 3 点流量低的时候，3 个请求失败 2 个就直接熔断了——**低流量下的误熔断是个经典事故**。
- **`threshold`（失败率阈值）**：0.5 是常见起点。对于"宁可慢也不能错"的依赖调到 0.7~0.8；对于非核心依赖可以压到 0.3。
- **`cooldown`（冷却时间）**：太短会导致频繁试探、下游反复被打；太长会导致下游恢复了半天你还在降级。**5s 起步，根据下游的恢复时间调。**

### 4.3 实验 D：熔断的收益与代价

开环定速 150 req/s，服务 25 worker + 队列 40（队列满即 503），下游 t∈[1s,6s] RT=2s，超时 150ms，2 次重试：

| 配置 | 成功 | 降级 | 失败 | **拒绝(503)** | 故障期 p50 | 下游调用 | 恢复探测 |
|---|---|---|---|---|---|---|---|
| 无熔断（超时+2 重试） | 807 | 0 | 150 | **543 (36.2%)** | **774ms** | 1296 | **32ms** |
| 有熔断 + 降级兜底 | 643 | 804 | 0 | **53 (3.5%)** | **0ms** | **723** | 731ms |

**收益（三条，全是硬指标）：**

1. **拒绝率 36.2% → 3.5%**。没有熔断时，25 个 worker 每个都被 774ms 的请求占死，队列打满，超过 1/3 的用户连响应都拿不到。有熔断时只有 3.5% 被拒。
2. **故障期用户等待 774ms → 0ms**。熔断后请求在微秒级返回兜底，用户感知是"页面秒开，只是相关文章那块显示的是热门文章"。
3. **下游调用 1296 → 723（-44%）**。熔断期间你一次都没去打扰那个正在垂死挣扎的下游。

**代价（必须诚实写出来）：**

1. **恢复探测延迟从 32ms 变成 731ms**。没有熔断时，下游一恢复你立刻就知道；有熔断时，得等冷却期结束 + 探针成功。这 700ms 里用户看到的还是兜底数据。**这是熔断的固有代价，无法消除，只能通过调小 `cooldown` 来缓解——但调小又会增加下游被二次打死的风险。**
2. 本次实验中熔断触发了 4 次（说明出现了"半开→探测失败→重新熔断"的震荡）。生产环境要监控这个指标：**频繁开合说明 `cooldown` 或 `threshold` 配得不对**。

所以熔断不是免费的。它的本质是**用"恢复慢一点"换"故障期间不雪崩、用户始终有响应"**。对于核心依赖，这个交换非常值；对于一分钟能挂十次的抖动型依赖，你可能更需要的是重试预算而不是熔断。

### 4.4 熔断 vs 重试预算：怎么选

| 维度 | 熔断 | 重试预算 |
|---|---|---|
| 判定依据 | 失败率 | 重试占比 |
| 动作 | 全量拒绝 | 按比例拒绝重试 |
| 适合 | 长时间、明确的故障 | 短时间、轻微的抖动 |
| 恢复速度 | 慢（等冷却 + 探针） | 快（每个请求都在试） |
| 误伤 | 高（一刀切） | 低（细粒度） |

**两个都要。** 它们解决的是不同时间尺度的问题：重试预算处理秒级的抖动（不误伤、恢复快），熔断处理分钟级的故障（保护彻底、停止踩踏）。成熟的客户端库（Envoy、Sentinel、Resilience4j、Hystrix）都是两者一起实现。

---

## 5. 降级：熔断之后，你到底给用户什么

熔断只是一个开关。开关合上之后，**你给用户返回什么**，才是真正决定用户体验的部分。

看实验 D 的数据：有熔断组有 804 个请求走了降级。如果降级 = 返回 500，那这 804 个用户和没熔断时一样惨，**熔断就白做了**。

### 5.1 降级不是错误，是"次优答案"

回到开头的例子：文章详情页的"相关文章"模块挂了。合理的降级是什么？

```python
from django.core.cache import cache

def related_articles(article_id, limit=6):
    """相关文章：四级降级链。"""
    breaker = breakers["recommend"]

    # ① 正常路径
    if breaker.allow():
        try:
            data = call_recommend(article_id, limit)   # 带 timeout + deadline
            breaker.record(True)
            cache.set(f"rec:{article_id}", data, 3600)  # 顺手缓存，作为后续降级源
            return data, "realtime"
        except Exception:
            breaker.record(False)

    # ② 上次成功的缓存快照（哪怕过期）——最常用、最有效
    stale = cache.get(f"rec:{article_id}")
    if stale:
        return stale, "stale_cache"

    # ③ 全局热门文章（与本文无关，但至少是个像样的列表）
    hot = cache.get("global_hot_articles")
    if hot:
        return hot[:limit], "global_hot"

    # ④ 最后兜底：同分类最新文章（本地 DB 查询，不依赖任何外部服务）
    from blog.models import Article
    fallback = list(
        Article.objects.filter(
            category_id=Article.objects.get(id=article_id).category_id
        ).exclude(id=article_id).values("id", "title")[:limit]
    )
    return fallback, "same_category"
```

关键在于返回值的第二个元素——**降级标记**。它有两个用处：

1. **前端可以据此 UI 降级**（比如"相关文章"模块标题改成"热门文章"，或者干脆隐藏这个模块）。
2. **监控可以统计降级率**。降级率是比错误率更敏感的健康指标——它会在错误率还是 0 的时候就开始上涨。

### 5.2 四种降级策略怎么选

| 策略 | 适用场景 | 优点 | 风险 |
|---|---|---|---|
| **返回缓存快照**（可过期） | 读多写少、容忍短暂陈旧 | 数据仍与用户相关，体验最好 | 要有"上次成功"的缓存才可用 |
| **返回通用兜底** | 个性化推荐、广告位 | 永远可用 | 与用户无关，体验一般 |
| **关闭该功能** | 非核心装饰模块 | 最诚实 | 功能缺失 |
| **异步补 / 排队** | 写操作（发券、入账） | 不丢数据 | 复杂度高，需要消息队列表 |

写操作的降级（同步转异步）要格外小心：它把"立刻失败"变成"稍后成功"，用户看到的反馈必须相应调整（"处理中"而不是"成功"）。而且它依赖消息队列的可靠性——本系列的[MQ 可靠投递实测](/article/mq-reliable-delivery-deep-dive/)讲过这里面的坑。

### 5.3 一条铁律：降级路径本身不能再有外部依赖

**降级路径上不能调任何可能失败的东西。** 我见过最离谱的 bug：降级逻辑里查了一次数据库，数据库也慢，于是降级路径比主路径还慢。

```python
# 错误：降级路径依赖了 Redis
def get_user_level(uid):
    try:
        return call_risk_api(uid)
    except Exception:
        return cache.get(f"level:{uid}") or "normal"   # Redis 挂了怎么办？

# 正确：降级路径只用进程内常量
_DEFAULT_LEVEL = "normal"

def get_user_level(uid):
    try:
        return call_risk_api(uid)
    except Exception:
        return _DEFAULT_LEVEL
```

如果兜底数据确实需要定期更新，那就**后台异步刷新到进程内变量**，而不是在降级路径上同步读。

---

## 6. 舱壁隔离：别让一个慢依赖拖死另一个健康依赖

前面所有机制都假设"只有一个下游"。真实服务通常有一堆：数据库、Redis、推荐服务、风控服务、支付网关……

如果它们共享一个线程池，那么**任何一个变慢，都会把整个池子占满，拖死所有其他依赖**——哪怕其他依赖全都健康。

### 6.1 实验 F

场景：A（慢依赖，RT 1s）和 B（健康依赖，RT 30ms），各 25 个并发客户端，6 秒：

| 配置 | A（慢）p95 | **B（健康）p50** | B p95 | **B 吞吐** |
|---|---|---|---|---|
| 共享线程池（20） | 820ms | **436ms** | 477ms | **61.4/s** |
| 隔离线程池（10+10） | 1232ms | **76ms** | 92ms | **283.5/s** |

**本来 30ms 的健康依赖 B，在共享池下被拖到 436ms——慢了 14.5 倍。吞吐从 283.5 掉到 61.4，跌了 78%。**

隔离之后：B 的 p50 回到 76ms（略高于 30ms 是因为 10 个 worker 也有排队），吞吐 4.6 倍。

**代价**：A 自己的吞吐从 277 降到 165（-40%），因为它分到的资源从"抢到的 20 个"变成了"固定的 10 个"。

这个代价是**完全正确**的——舱壁的设计哲学就是：**牺牲已经不健康的依赖，保住健康的依赖。** 在资源有限时，让慢的依赖少占一点、让快的依赖跑满，总吞吐一定更高。

### 6.2 怎么实现

三个层次，从重到轻：

**① 进程级隔离（最彻底）**：不同依赖用不同的微服务/容器。成本最高，隔离最干净。

**② 线程池隔离（中等）**：每个依赖一个独立线程池。

```python
from concurrent.futures import ThreadPoolExecutor

POOLS = {
    "recommend": ThreadPoolExecutor(max_workers=10, thread_name_prefix="rec"),
    "risk":      ThreadPoolExecutor(max_workers=10, thread_name_prefix="risk"),
    "payment":   ThreadPoolExecutor(max_workers=20, thread_name_prefix="pay"),
}

def call_isolated(dep, fn, *args, **kwargs):
    try:
        return POOLS[dep].submit(fn, *args, **kwargs).result(timeout=3.0)
    except Exception:
        raise DependencyError(dep)
```

**③ 信号量隔离（最轻量）**：共用一个池，但用信号量限制每个依赖的并发数。开销最小，但不能防止"线程被慢调用占住"的问题（只能限制数量）。

```python
import threading

LIMITS = {
    "recommend": threading.Semaphore(10),
    "risk":      threading.Semaphore(10),
    "payment":   threading.Semaphore(20),
}

def call_with_limit(dep, fn, *args, **kwargs):
    sem = LIMITS[dep]
    if not sem.acquire(blocking=False):
        raise DependencyBusy(dep)      # 立刻失败，不排队
    try:
        return fn(*args, **kwargs)
    finally:
        sem.release()
```

选型建议：**核心依赖（支付、风控）用线程池隔离，非核心依赖（推荐、统计）用信号量隔离。** 信号量隔离在超限时不排队、直接失败，正好符合"非核心功能该让路"的语义。

---

## 7. 四件套组合：一条链路的完整配置表

单个机制都会配了，难点在于**把它们配成一个自洽的系统**。最常见的错误是各配各的，结果出现"网关 5s 超时，服务 10s 超时，DB 30s 超时"这种**下游比上游还能等**的荒唐配置。

### 7.1 超时预算：从上往下递减

原则：**每一层的超时必须严格小于它的调用方，且留出重试和降级的余量。**

假设用户可接受的页面加载上限是 2 秒：

| 层级 | 超时 | 说明 |
|---|---|---|
| 浏览器 / App | 2000ms | 用户可感知上限 |
| CDN / 网关 | 1800ms | 留 200ms 网络抖动 |
| 应用服务（整体 deadline） | 1500ms | 留 300ms 给网关返回 |
| ├─ 数据库查询 | 300ms | 单条 SQL |
| ├─ Redis | 50ms | 本地缓存，必须极快 |
| ├─ 推荐服务（非核心） | 300ms，1 次重试 | 超时即降级 |
| └─ 风控服务（核心） | 500ms，不重试 | 非幂等，且失败要人工介入 |

配的时候记住一条：**下游超时 ≥ 上游超时 是配置错误**。因为上游已经放弃了，下游还在算，白白浪费资源——这正是实验 A 里"下游峰值并发 320 vs 20"的成因。

### 7.2 按依赖重要度分类配置

| 依赖类型 | 超时 | 重试 | 熔断 | 降级 | 舱壁 |
|---|---|---|---|---|---|
| **核心读**（用户资料、商品详情） | P99×2 | 1 次，带抖动 | 阈值 0.7（谨慎） | 缓存快照 | 线程池 |
| **核心写**（下单、支付） | P99×3 | **0 次**（除非有幂等键） | 阈值 0.8 | 转异步 | 线程池 |
| **非核心读**（推荐、广告） | 300ms（硬上限） | 1 次 | 阈值 0.3（激进） | 通用兜底 / 隐藏模块 | 信号量 |
| **旁路**（埋点、统计） | 100ms | **0 次** | 阈值 0.5 | **直接丢弃** | 信号量 |

两个容易忽略的点：

- **旁路依赖（埋点、日志上报）永远不该重试，也不该阻塞主流程。** 它挂了不影响用户，但重试会放大流量。用信号量限制并发，超了直接丢。
- **核心写的重试次数是 0，除非配了幂等键。** 宁可让用户看到"下单失败，请重试"，也不要静默生成两笔订单。

### 7.3 一个组装示例

```python
# resilience.py —— 把四件套串起来
import logging
import random
import time

log = logging.getLogger(__name__)


def resilient_call(dep, fn, *, fallback=None, timeout=0.3, retries=1,
                   base_backoff=0.1, breaker=None, budget=None, pool=None):
    """出站调用的统一入口：超时 + deadline + 重试 + 抖动 + 预算 + 熔断 + 降级。"""
    deadline = time.monotonic() + timeout * (retries + 1)   # 整体预算

    for attempt in range(retries + 1):
        if attempt > 0:
            # ① 抖动退避（仅在预算允许时）
            if budget is not None and not budget.allow():
                log.warning("dep=%s retry denied by budget", dep)
                break
            time.sleep(random.uniform(0, base_backoff * (2 ** (attempt - 1))))

        # ② 熔断：明知死了就不打
        if breaker is not None and not breaker.allow():
            break

        remaining = deadline - time.monotonic()
        if remaining <= 0:
            break

        try:
            # ③ 超时：单次不超过剩余预算
            if pool is not None:
                result = pool.submit(fn).result(timeout=min(remaining, timeout))
            else:
                result = fn()
            if breaker is not None:
                breaker.record(True)
            if budget is not None:
                budget.record_success()
            return result, "ok"
        except Exception as exc:
            if breaker is not None:
                breaker.record(False)
            log.warning("dep=%s attempt=%s failed: %s", dep, attempt, exc)

    # ④ 降级
    if fallback is not None:
        return (fallback() if callable(fallback) else fallback), "degraded"
    raise DependencyError(dep)
```

这个函数不到 40 行，但把本文所有机制串起来了。重点是**顺序**：先问预算 → 再问熔断 → 才发请求 → 带上剩余 deadline → 失败后走降级。顺序错了就会退化成"配了个寂寞"。

---

## 8. 上线 Checklist + 高频 FAQ

### Checklist

**超时**

- [ ] **每一个出站调用都有显式超时**——`requests`、`redis`、`psycopg2`、数据库连接全部检查一遍
- [ ] `requests` 用的是 `timeout=(connect, read)` 元组，不是一个数字
- [ ] 有整体 deadline，重试 N 次的总耗时不会超过上游超时
- [ ] 超时值满足"下游 < 上游"的递减关系，不存在下游比上游还能等的配置
- [ ] Django 配了 `statement_timeout`，gunicorn `timeout` 小于负载均衡超时

**重试**

- [ ] 非幂等接口要么不重试，要么带了幂等键
- [ ] 只重试瞬时故障（`408/429/5xx`、连接错误），`4xx` 业务错误不重试
- [ ] 退避带**全抖动**，且每个客户端用独立的随机源
- [ ] 配了重试预算（建议 10%~20%），且有 `floor` 防止锁死
- [ ] 尊重响应里的 `Retry-After` 头

**熔断**

- [ ] 有 `min_calls` 下限，防止低流量误熔断
- [ ] 半开状态放的是**有限探针**，不是直接全量放行
- [ ] 熔断状态有监控和告警（开合次数、当前状态、拒绝数）
- [ ] 每个依赖独立熔断，不是一个 breaker 管所有

**降级**

- [ ] 每个非核心依赖都有降级路径，且**降级路径本身没有外部依赖**
- [ ] 降级返回带标记，前端能据此调整 UI
- [ ] 降级率有监控——它比错误率更早发现问题

**舱壁**

- [ ] 核心依赖与非核心依赖不共享线程池
- [ ] 旁路依赖（埋点、统计）用信号量隔离且超限即丢弃

**演练**

- [ ] 做过一次真实的故障注入演练（关掉一个依赖，看服务是否还活着）
- [ ] 知道每个依赖的 P99，超时值是基于数据而不是拍脑袋

### FAQ

**Q：超时到底设多少合适？**

A：从**依赖的 P99** 出发，取 P99 的 2~3 倍。比如依赖 P99 是 80ms，超时设 200~250ms。设成 P99 的 1 倍会误杀正常请求（P99 意味着 1% 的请求本来就超过这个时间），设成 10 倍就失去了保护意义。然后**用整体 deadline 反推校正**：如果链路总预算是 1.5s，某个依赖分到 300ms 但它的 P99 是 500ms，那说明这个依赖不适合放在同步链路里，应该改成异步或预计算。

**Q：重试会让请求变慢，用户能接受吗？**

A：**重试不应该让用户感知到。** 只有在"单次超时远小于用户可感知阈值"时重试才有意义。如果单次调用 1s、重试 3 次就是 4s，用户早就关页面了——这种情况下重试毫无价值，应该直接降级。经验法则：**只有当 `单次超时 × (重试次数+1)` 仍小于用户可接受延迟的 1/3 时，重试才是划算的。**

**Q：熔断和降级是不是一回事？**

A：不是。熔断是**决策**（判断要不要调下游），降级是**结果**（不调的时候给用户什么）。只做熔断不做降级，等于把 502 换成了更快的 502——实验 D 里那 804 个降级请求如果返回的是错误，熔断的收益就只剩"下游减载 44%"了。

**Q：多实例部署时，熔断状态要共享吗？**

A：**不要。** 每个实例维护自己的熔断器更好。原因有三：(1) 熔断器是本地快速判断，引入 Redis 会让它变成一个新的依赖，而这个依赖挂了熔断器就废了；(2) 各实例观察到的下游状态本来就不同（网络分区、灰度批次）；(3) 全局状态需要原子操作，增加复杂度和延迟。代价是各实例的熔断时机不一致，但这通常无害——反正熔断是"宁可多熔一个，不可少熔一个"。

**Q：已经有了限流，还需要这些吗？**

A：需要，它们管的方向相反。限流管"别人打我"，这四件套管"我打别人"。一个常见的错误认知是"我限流了所以很安全"——但限流挡不住"你的 100 个请求全部卡在同一个慢依赖上"。反过来，出站治理也替代不了限流。**两者都要。**

**Q：单体应用（没有微服务）需要这些吗？**

A：**需要，而且更需要。** 单体应用同样要调数据库、Redis、对象存储、第三方 API。你的数据库就是一个"下游"，一个慢查询就能拖死整个连接池——这正是"没设超时"的经典场景。实际上本文实验 A 的模型（20 worker + 慢依赖）在单体应用里完全适用，把"推荐服务"换成"一条没走索引的 SQL"，结论一模一样。

**Q：熔断的 `cooldown` 设多长？**

A：从**依赖的典型恢复时间**出发。如果一个依赖通常是 30 秒内自愈，`cooldown` 设 5~10s；如果是需要人工介入的故障，可以设 60s。判断依据看监控：**如果熔断频繁开合（实验中出现了 4 次），说明 `cooldown` 太短**——下游还没恢复你就去探测，探测失败又熔上，白白消耗资源。

**Q：这些都要自己写吗？有现成库吗？**

A：有，而且优先用现成的。Java 有 Resilience4j / Sentinel / Hystrix；Go 有 `gobreaker` / `sony/gobreaker`；Python 有 `tenacity`（重试）、`pybreaker`（熔断）、`aiobreaker`。如果用了服务网格（Istio / Envoy），超时、重试、熔断、舱壁可以**全部在 Sidecar 层配置**，业务代码一行都不用写——这是最理想的方案，因为配置集中、语言无关、可热更新。本文的手写实现是为了把原理讲透，**生产环境优先用 Envoy 或成熟库**。

---

## 小结

回到开头那次事故。整篇文章可以压缩成一张对照表：

| 机制 | 回答的问题 | 不加会怎样 | 实测代价 |
|---|---|---|---|
| **超时** | 等多久算太久？ | 下游恢复了你还瘫着 | 5 秒零吞吐（下游只抖 3 秒） |
| **重试** | 失败要不要再来一次？ | 成功率提升，但会放大故障 | 放大 ×4，**自身吞吐 -88%** |
| **抖动** | 什么时候重试？ | 恢复瞬间惊群，二次打死下游 | 峰值 1200 vs 520 QPS |
| **重试预算** | 总共能重试多少？ | 无效重试吃光线程池 | 加预算后自身吞吐 **×3.6** |
| **熔断** | 明知死了还打吗？ | 持续踩踏 + 队列打满 | 拒绝率 36.2% vs 3.5% |
| **降级** | 不打的话给用户什么？ | 熔断白做，还是 502 | 804 个请求能否被救回 |
| **舱壁** | 一个慢依赖能占多少资源？ | 健康依赖被陪葬 | B 延迟 436ms vs 76ms |

如果只记三句话：

1. **超时是唯一没有商量余地的。** 没设超时的出站调用就是一颗定时炸弹，它不爆只是因为下游还没抖过。而且记住——超时保护的是你自己，不是下游。

2. **重试是唯一会放大流量的机制，所以它必须被节制。** 加抖动（削峰 57%）和加预算（放大 ×4 → ×1.04，自身吞吐 ×3.6）这两件事，成本极低，收益极大。而且重试的前提永远是幂等。

3. **熔断的收益是"用户始终有响应"，代价是"恢复慢一点"。** 它必须和降级配对使用——没有降级的熔断，只是把慢 502 变成了快 502。

最后说一个容易被忽略的事实：**这套机制在平时 100% 的时间里都是"没用"的。** 它不像缓存能提速、不像索引能省钱，它在风平浪静时完全隐形。所以它的价值只在故障发生的那几分钟体现——而那几分钟，往往决定了用户对你这个系统的全部印象。

---

*本文的全部实测数据均可复现：压测脚本在 `tools/bench_resilience.py`（Python 纯标准库，真实多线程 + 真实 sleep，无第三方依赖）。六个实验各自独立，可用 `--only A|B|C|D|E|F` 单独运行。文中所有代码均为可运行的简化实现，用于说明原理；生产环境建议改用 Envoy / Resilience4j / Sentinel 等成熟组件。*
