---
title: "用户只是双击了一下，订单多了 7 条——接口幂等"
slug: "api-idempotency-deep-dive"
category_id: null
tags: ["后端", "数据库", "并发", "幂等"]
status: "published"
cover_image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80&auto=format&fit=crop"
---

# 用户只是双击了一下，订单多了 7 条——接口幂等

> 适用读者：写过下单/支付/表单接口，被"用户双击""回调重发""MQ 重复消费"坑过的后端工程师
> 技术栈：Python + SQL（SQLite 实测）；方案不绑定框架，Django / Spring Boot / Go 通用
> 阅读时间：约 25 分钟 | 难度：中高级 | 收获：四层幂等防线 + 支付回调/MQ/表单三个场景的组合拳 + 上线 Checklist

## 前言：一个重复发货的事故

用户在结算页点了"提交订单"，网络卡了一秒，他又点了一下。第二天仓库打出两份快递，客服收到投诉，你在数据库里看到：

```
SELECT * FROM orders WHERE user_id = 1001;
id=4242  user=1001  product=88  created_at=10:23:01.204
id=4243  user=1001  product=88  created_at=10:23:01.219   ← 15ms 后的"双击"
```

你翻出代码，明明写了判重：

```python
def create_order(request):
    if not Order.objects.filter(user=request.user, product_id=pid).exists():
        Order.objects.create(user=request.user, product_id=pid)
```

为什么还是有重复？因为**"先查后插"在并发下永远有窗口**——两个请求都通过了 `exists()` 检查，然后各自插入。我在本机实测：8 个并发提交同一笔订单，这种写法会**生成 8 条订单**（见第 2 章）。

这类问题的学名叫**幂等（Idempotency）**：

> **f(f(x)) = f(x)** —— 同一个操作执行一次和执行多次，结果相同。

它是分布式系统的地基设定，因为**重复请求根本防不住**，来源至少有四个：

| 重复来源 | 场景 | 频率 |
|---|---|---|
| 用户手抖 | 双击、提交后刷新页面重发表单 | 每天 |
| 客户端重试 | 超时自动重试（axios-retry / OkHttp interceptor） | 常见 |
| 网关/负载均衡重试 | Nginx `proxy_next_upstream`、Feign 重试 | 隐藏且致命 |
| MQ / 回调重投 | 至少一次（at-least-once）投递是消息系统的默认语义 | 一定会发生 |

**结论先行：既然重复无法阻止，就只能让接口"重复执行也无害"。** 这篇文章按"先复现事故 → 四层防线逐个拆 → 三个场景组合出拳"的顺序展开。

**目录**

- 幂等到底是什么：天然幂等与非幂等
- 事故复现：为什么 `if not exists` 防不住
- 防线一：数据库唯一约束，最硬的兜底
- 防线二：幂等表 + 幂等键，Stripe 同款
- 防线三：状态机 + 条件更新
- 防线四：防抖 Token，体验层优化
- 幂等、去重、分布式锁：一次说清边界
- 三个真实场景的组合拳
- 并发实测汇总
- 上线 Checklist + 高频 FAQ

---

## 1. 幂等到底是什么：天然幂等与非幂等

先分清哪些操作**天生**幂等，哪些**必须设计**：

| 操作 | 幂等性 | 原因 |
|---|---|---|
| `GET /articles/1` | ✅ 天然幂等 | 只读，执行多少次结果都一样 |
| `PUT /articles/1`（全量更新） | ✅ 天然幂等 | 重复 PUT 同一份内容，终态不变 |
| `DELETE /articles/1` | ✅ 天然幂等 | 第一次删成功，第二次 404，但"文章不存在"这个终态没变 |
| `POST /orders`（创建） | ❌ 非幂等 | 每执行一次多一条记录 |
| `POST /balance/deduct`（扣款） | ❌ 非幂等 | 每执行一次扣一次钱，最危险 |
| `PATCH /articles/1`（增量） | ❌ 非幂等 | `views += 1` 执行两次加两次 |

两个常见误区：

**误区一："HTTP 方法幂等，所以我的接口就幂等。"** 方法语义只是约定，`PUT /articles/1` 的 handler 里写 `views = views + 1`，它照样不幂等。**幂等看的是服务端状态变化，不是方法名。**

**误区二："前端加个按钮置灰就完事了。"** 前端防抖只改善体验，防不了重试、重放、绕过浏览器直接调 API 的脚本。**安全边界必须在服务端。**

还有一个必须刻进 DNA 的事实：**消息系统和回调系统几乎都是 at-least-once**。RocketMQ/Kafka 的重平衡、支付网关的"收不到应答就重发"，都意味着**你的接口一定会被重复调用**，区别只是今天还是大促那天。

---

## 2. 事故复现：为什么 `if not exists` 防不住

先把这个 bug 跑出来。完整脚本在 `tools/bench_idempotency.py`，8 个线程同时提交 user=1 的同一笔订单，业务逻辑耗时 10ms（模拟校验、计价），标准库 sqlite3 + WAL 模式：

```
E1 用户双击竞态：8 线程同时提交 user=1 的同一笔订单
  A 无防护（查-插）           订单   8 条  ← 期望 1 条，多出 7 条重复
```

**8 个请求，8 条订单。** 时序推演一下就明白：

```
时刻   线程 1                     线程 2                     … 线程 8
────────────────────────────────────────────────────────────────────
t1    SELECT exists → False
t2                                SELECT exists → False
t3    …（所有线程在 10ms 窗口内全部通过了检查）
t4    INSERT order ✅
t5                                INSERT order ✅
t6    …（8 条全部插进去了）
```

这就是教科书上的 **TOCTOU（Time-of-Check to Time-of-Use）**：检查和使用之间有时间差，并发请求全部挤进了这个窗口。窗口有多宽？取决于检查和写入之间的业务耗时——**只要中间有校验、计价、调库存，窗口就一定存在**。

> **关键认知：应用层的"先查后插"是信息，不是约束。它能告诉你"刚才没有"，不能阻止"别人同时插入"。真正的互斥必须交给数据库——它是唯一能看到"此刻"的地方。**

那"加个事务"行不行？我在《[事务回滚了，邮件照样发出去](/article/django-transaction-atomic-on-commit/)》里实测过：SQLite 的默认隔离级别下，`atomic + 先查后插`照样丢重复（读-改-写竞态）；`SELECT ... FOR UPDATE` 在 MySQL 上能锁住，但 SQLite 直接不支持（`has_select_for_update=False`）。**把希望寄托在事务隔离级别上，是这最容易踩的坑。**

下面开始上防线。

---

## 3. 防线一：数据库唯一约束，最硬的兜底

### 3.1 怎么写

把"业务上不该重复的东西"直接声明成**唯一约束**，让数据库替你把关：

```python
# Django
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "product"], name="uniq_user_product"
            ),
        ]
```

```sql
-- 裸 SQL
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    amount TEXT NOT NULL,
    UNIQUE (user_id, product_id)          -- ← 约束在这里
);
```

然后**捕获冲突**，而不是先查再插：

```python
from django.db import IntegrityError

def create_order(request):
    try:
        order = Order.objects.create(user=request.user, product_id=pid, amount=amt)
        return JsonResponse({"order_id": order.id})
    except IntegrityError:
        # 已经有人创建了：查出那条返回
        order = Order.objects.get(user=request.user, product_id=pid)
        return JsonResponse({"order_id": order.id})
```

### 3.2 实测

```
  B 唯一约束兜底              订单   1 条  | 7 个请求被 IntegrityError 拦下
```

8 个并发请求，1 条订单，7 个被数据库当场拒绝。**这是唯一在数据库层面"物理不可能重复"的防线**——不管你的代码写得多烂、并发多高，约束都在。

### 3.3 业务键怎么选

唯一约束的成败全在**业务键**的选择：

| 场景 | 业务键 | 说明 |
|---|---|---|
| 秒杀下单 | `(user_id, activity_id)` | 一人一单 |
| 普通电商下单 | ❌ 没有 | 用户可以合法买多单，见防线二 |
| 支付流水 | `out_trade_no`（商户单号） | 渠道回调靠它判重 |
| 点赞 | `(user_id, article_id)` | 我在《[点赞按钮背后的五层防刷](/article/django-anon-like-dedup/)》用的就是它 |
| 短信验证码 | `(phone, code, scene)` | 防重发 |

### 3.4 局限（必须诚实）

- **只能防"相同业务键"**：用户改一下收货地址再提交，键就变了，约束管不着；
- **要求业务上真的唯一**：普通商城"一人只能买一次"是错的，这种场景唯一约束根本没法建——这正是防线二存在的理由；
- **冲突后的返回值**要自己处理（`IntegrityError` 之后查出已有记录返回，保证响应也一致）。

> 一句话：**能建唯一约束的场景，闭眼建。它是你所有上层设计的最后兜底。**

---

## 4. 防线二：幂等表 + 幂等键，Stripe 同款

### 4.1 思路

既然"业务键"不是所有场景都有，那就**自己造一个键**：客户端每次"意图提交"时带一个唯一 ID（幂等键），服务端见过的键就拒绝/复用，没见过的才执行。

这就是 Stripe 的 `Idempotency-Key` 设计——所有写接口都支持这个 header，官方文档明确说：**"重试同一个 key，返回同一次执行的结果，不会重复扣款。"**

表结构：

```sql
CREATE TABLE idempotency (
    idem_key      TEXT PRIMARY KEY,   -- 幂等键（客户端生成，UUID）
    request_hash  TEXT NOT NULL,      -- 请求体指纹（防 key 被换内容复用）
    status        TEXT NOT NULL,      -- PROCESSING / SUCCESS / FAILED
    response      TEXT,               -- 成功后的响应缓存（JSON）
    created_at    TIMESTAMP
);
```

核心逻辑是**"先抢占位"**：

```python
def create_order(request):
    key = request.headers.get("Idempotency-Key")
    body_hash = sha256(request.body).hexdigest()[:16]

    # 1. 抢占：插入成功 = 拿到执行权（原子，靠主键约束）
    with transaction.atomic():
        try:
            Idempotency.objects.create(
                idem_key=key, request_hash=body_hash, status="PROCESSING"
            )
        except IntegrityError:
            # 2. 键已存在：要么复用结果，要么拒绝
            rec = Idempotency.objects.get(idem_key=key)
            if rec.request_hash != body_hash:
                return err(422, "该幂等键已绑定其他请求体")     # 防串台
            if rec.status == "SUCCESS":
                return JsonResponse(json.loads(rec.response))   # 直接回放缓存
            return err(409, "上一请求仍在处理中，请稍后")        # PROCESSING

    # 3. 抢到的那个请求执行业务
    order = do_create_order(request)                            # 里面仍有唯一约束兜底

    # 4. 缓存响应
    Idempotency.objects.filter(idem_key=key).update(
        status="SUCCESS", response=json.dumps({"order_id": order.id})
    )
    return JsonResponse({"order_id": order.id})
```

三个细节，每个都是坑点：

**细节一：靠 `INSERT` 抢占，不要靠 `SELECT`。** "先查有没有这个键"又是 TOCTOU；`INSERT` 碰主键约束是数据库原子的，8 个并发只有一个能插进去。

**细节二：`request_hash` 防串台。** 同一个 key 配不同的 body（用户改参数后拿旧 key 重试），必须拒绝——否则用户"改了地址重试"会拿到第一次那单旧地址的缓存结果。实测见第 8 章 E3。

**细节三：`PROCESSING` 状态的后来者怎么办？** 抢占失败的请求有三种处理：等待轮询（同 E1-C）、直接 409、返回旧结果。秒杀场景选 409（快速失败），普通表单选等待。

### 4.2 实测

```
  C 幂等表（先抢占位）        订单   1 条  | 8 个请求拿到的 order_id 完全一致 (1)
```

比防线一更强的地方在**响应一致性**：8 个并发请求全部拿到**同一个 order_id**——用户双击的两下，界面显示的是同一单，而不是"第二下报错"。

### 4.3 幂等键从哪来

| 方案 | 做法 | 适用 |
|---|---|---|
| 前端进页领取 | 打开表单页时 `GET /idempotency-key` 领一个 UUID，提交时带上 | 表单、H5 |
| 前端本地生成 | `crypto.randomUUID()` | 现代浏览器 |
| 内容寻址 | 用业务语义拼：`pay:out_trade_no:{单号}` | 支付回调 |
| 不用前端 | 服务端按"用户+接口+参数指纹"自动生成 | 兜底，粒度粗 |

### 4.4 清理

幂等表会一直涨，需要定期清理：成功的记录保留 24 小时（足够覆盖重试窗口）后删除。Stripe 的窗口也是 24 小时。**别把幂等表当流水账存。**

---

## 5. 防线三：状态机 + 条件更新

### 5.1 思路

很多重复不是"创建重复"，而是**"同一个单据被处理多次"**：支付回调对同一笔订单发了 5 次"已支付"，每次都执行了发短信、记账、扣库存。

朴素写法：

```python
# ❌ 无条件更新：回调 5 次，副作用执行 5 次
Payment.objects.filter(order_no=no).update(status="PAID", paid_at=now())
send_sms(...)      # 5 条短信
```

正确写法是**把"当前状态"写进 WHERE**，用影响行数判断"是不是我处理的"：

```python
# ✅ 条件更新：只允许 PENDING → PAID 这一条边
updated = Payment.objects.filter(
    order_no=no, status="PENDING"            # ← 状态机守卫
).update(status="PAID", paid_at=now())

if updated == 0:
    # 影响行数为 0：要么已处理过（幂等跳过），要么状态不对（非法跳转）
    current = Payment.objects.get(order_no=no).status
    if current == "PAID":
        return ok("已处理，幂等返回")          # 重放，安全
    return err(409, f"非法状态跳转: {current} → PAID")

# 只有抢到的那一次走到这里
send_sms(...)      # 1 条短信
```

`UPDATE ... WHERE status='PENDING'` 是**原子的读-改-写**：数据库保证只有一个事务能把行从 PENDING 改走，其余事务的影响行数是 0。这正是我在《[事务深水区](/article/django-transaction-atomic-on-commit/)》里推的 `F()` 表达式同一思想——**把判断压进一条 SQL，而不是先读后写**。

### 5.2 实测

```
E2 支付回调重放：同一条「已支付」回调投递 5 次
  A 无条件更新    「支付成功」逻辑执行了 5 次（含发短信/记账） | 终态 PAID
  B 条件更新      「支付成功」逻辑执行了 1 次（其余幂等跳过）   | 终态 PAID
  C 非法跳转      已发货订单再收「支付」回调 → 被拒绝 ✅
```

三个行为全部符合预期：重放被幂等跳过、**非法跳转（已发货又收到"支付"）被状态机拒绝**——后者是唯一约束和幂等表都防不住的，只有状态机能防。

### 5.3 状态机的完整形态

```
PENDING ──支付成功──► PAID ──发货──► SHIPPED ──签收──► DONE
   │                    │
   └──超时关单──► CLOSED └──退款──► REFUNDED
```

用一张"状态转移表"约束所有跳变：

```python
ALLOWED = {
    ("PENDING", "PAID"), ("PENDING", "CLOSED"),
    ("PAID", "SHIPPED"), ("PAID", "REFUNDED"),
    ("SHIPPED", "DONE"),
}

def transition(order_no, to_status):
    from_status = Payment.objects.get(order_no=order_no).status
    if (from_status, to_status) not in ALLOWED:
        raise IllegalTransition(f"{from_status} → {to_status}")
    updated = Payment.objects.filter(
        order_no=order_no, status=from_status
    ).update(status=to_status)
    return updated == 1
```

### 5.4 和乐观锁（version 字段）的关系

乐观锁是状态机的泛化：把"状态"换成"版本号"，`WHERE version=5 ... SET version=6`。对比：

| | 状态机 | 乐观锁 version |
|---|---|---|
| 表达能力 | 业务语义（非法跳转可枚举） | 只知道"变了没有" |
| 冲突处理 | 天然幂等（0 行 = 已处理） | 冲突后要重读重试 |
| 适用 | 单据流转（订单/支付/工单） | 并发编辑（文档/库存行） |

**单据类场景用状态机，编辑类场景用乐观锁。** 别混着用。

---

## 6. 防线四：防抖 Token，体验层优化

最后一层最弱，但用户体验最好：**提交前先领票，提交时核销**。

```
1. 打开表单页 → GET /api/order/token → 服务端 SETNX order:token:{uuid} 1 EX 600 → 返回 uuid
2. 提交订单   → POST /api/orders + header: X-Token: uuid
3. 服务端     → DEL order:token:{uuid} 成功（key 存在）= 第一次提交，放行
              → DEL 返回 0（key 不存在）= 重复提交，拒绝
```

`SETNX` + `DEL` 的核销是原子的（这把"一次性票"正是《[Redis 分布式锁](/article/redis-distributed-lock-deep-dive/)》V2 的变体）。Django 里大约 15 行：

```python
def issue_token(request):
    token = uuid.uuid4().hex
    cache.add(f"order:token:{token}", 1, timeout=600)   # add = SETNX
    return JsonResponse({"token": token})

def create_order(request):
    token = request.headers.get("X-Token")
    if not token or not cache.delete(f"order:token:{token}"):  # 核销
        return err(409, "请勿重复提交")
    ...  # 真正的业务
```

**为什么说它是最弱的防线：**

- 用户可以不领票直接调接口（脚本、老版本客户端）；
- Token 会过期（600 秒后领的票失效，用户第二次提交反而被拒）；
- Redis 挂了票就全废。

**所以定位要摆正：防抖 Token 是体验层（拦住 99% 的手抖），数据库唯一约束是安全层（拦住剩下的 1%）。** 只有 Token 没有唯一约束的接口，等于裸奔。

---

## 7. 幂等、去重、分布式锁：一次说清边界

写到这必须停下来掰扯三个高频混用的概念——面试和方案评审里，一半的争论来自没分清它们：

| 概念 | 解决什么问题 | 生效层面 | 失效后果 | 对应文章 |
|---|---|---|---|---|
| **幂等** | 重复**执行**也无害 | 写路径的固有设计 | 重复下单、重复扣款 | 本文 |
| **去重** | 重复**数据**不落库 | 数据层（唯一键/指纹） | 脏数据、统计失真 | 《[点赞按钮的五层防刷](/article/django-anon-like-dedup/)》 |
| **分布式锁** | 重复**进入**临界区 | 运行时协调 | 并发写坏共享资源 | 《[Redis 分布式锁](/article/redis-distributed-lock-deep-dive/)》 |

三者的关系：

1. **锁是"事前挡"，幂等是"挡不住也没事"。** 锁会过期（TTL）、会丢（Redis 主从切换）、会假醒（GC 停顿）——我在锁那篇的 6.1 节专门论证过：**任何基于 TTL 的锁都防不住进程停顿**。所以锁永远不能当唯一防线，幂等才是。
2. **去重是幂等的子集。** 去重只保证"数据只有一条"（唯一约束就够了），幂等还要求"响应一致、副作用一致、状态流转正确"。能去重 ≠ 幂等：重复请求被唯一约束拦下时报 500，数据是没了，但用户看到的是报错——幂等要求他看到第一单的结果。
3. **组合才有完整答案**：锁管体验（并发请求排队而非报错），幂等管安全（排队失败也不重复）。支付回调那套四层防线，本质就是"不依赖锁，纯幂等"的设计——因为它面对的是跨进程、跨时间、跨系统的重复，锁的时效性根本罩不住。

最后给一个"这个接口要不要做幂等"的快速判断：

```
写接口自问：这个 handler 被调 2 次，会发生什么？
├─ 只读 / 纯覆盖写        → 天然幂等，收工
├─ 多一条记录 / 多扣一次钱 → 必须幂等：唯一约束（能建）+ 幂等表（建不了）
├─ 状态被改两次           → 状态机条件更新
└─ 副作用是对外发消息      → 外部系统也要幂等（短信、记账、第三方 API）
副作用越贵（钱 > 短信 > 日志），防线层数越多。
```

---

## 8. 三个真实场景的组合拳

单用一层防线都有漏洞，生产上是**按场景组合**：

### 8.1 支付回调（最高危）

```
渠道回调 → 1.验签（伪造请求直接挡）
         → 2.幂等表（out_trade_no 做键）      ← 重放在这里被挡
         → 3.状态机（PENDING → PAID 条件更新）← 并发在这里被串行化
         → 4.唯一约束（流水表 uniq out_trade_no）← 终极兜底
```

四层各司其职：重放挡在 2，并发挡在 3，就算前两层全漏了，4 保证账不会错。**支付场景少一层都睡不着觉。**

### 8.2 MQ 消费（最隐蔽）

最常见的错误答案是"用消息 ID 判重"——**消息 ID 不可靠**：重平衡后消息会重投（新 ID，旧内容），生产端重发也是新 ID。正确做法是**用业务键建唯一约束**：

```python
def on_message(msg):
    try:
        with transaction.atomic():
            PaymentFlow.objects.create(       # uniq: out_trade_no
                out_trade_no=msg["out_trade_no"], ...
            )
    except IntegrityError:
        return Ack                             # 已处理过，直接确认
    return Ack
```

注意**消费端的 Ack 策略**：处理失败要重试，但 `IntegrityError` 这类"已处理"要直接 Ack，否则消息会无限重投。

### 8.3 表单提交（最常见）

```
前端：按钮防抖 + 提交后置灰 + 进页领幂等键
后端：幂等表（体验一致）+ 唯一约束（兜底）
```

用户双击的两下，第二下拿到第一下的缓存结果，界面无感。

| 场景 | 必选防线 | 可选增强 |
|---|---|---|
| 支付回调 | 唯一约束 + 状态机 + 幂等表 | 验签、金额核对 |
| MQ 消费 | 业务键唯一约束 | 消费日志、死信队列 |
| 表单提交 | 唯一约束（能建就建） | 幂等键、防抖 Token |
| 扣款/余额 | 条件更新（`WHERE balance >= x`） | 乐观锁 + 对账 |

---

## 9. 并发实测汇总

三个实验全部出自 `tools/bench_idempotency.py`（标准库 sqlite3 + WAL，临时库跑完自删，8 线程，业务逻辑耗时 10ms 模拟真实窗口）：

```
E1 用户双击竞态：8 线程同时提交 user=1 的同一笔订单
  A 无防护（查-插）           订单   8 条  ← 期望 1 条，多出 7 条重复
  B 唯一约束兜底              订单   1 条  | 7 个请求被 IntegrityError 拦下
  C 幂等表（先抢占位）        订单   1 条  | 8 个请求拿到的 order_id 完全一致 (1)

E2 支付回调重放：同一条「已支付」回调投递 5 次
  A 无条件更新    「支付成功」逻辑执行了 5 次（含发短信/记账） | 终态 PAID
  B 条件更新      「支付成功」逻辑执行了 1 次（其余幂等跳过）   | 终态 PAID
  C 非法跳转      已发货订单再收「支付」回调 → 被拒绝 ✅

E3 幂等键 + 请求指纹：同 key 打 100 次，body 不同会怎样
  同 key + 同 body   ×100: 业务执行 1 次 | 99 次复用缓存 | 响应全部一致 ✅
  同 key + 不同 body ×1 : REJECTED: key 已被其他请求体占用（改参重试被识别，避免结果串台）
```

三个最值得记住的读数：

1. **A：8 并发 = 8 条订单。** "先查后插"的重复率不是概率问题，是必然——所有请求都挤进了检查窗口；
2. **C：8 个请求同一个 order_id。** 幂等表不仅防重复，还保证了**响应一致性**（双击的两下看到同一单），这是唯一约束做不到的；
3. **E3：同 key 不同 body 被拒绝。** 请求指纹防止"改参数重试"拿到旧结果的缓存——没有这一层，幂等键反而会制造数据错乱。

---

## 10. 上线 Checklist + 高频 FAQ

**Checklist（12 项）**

- [ ] 所有"创建类"接口：能建唯一约束的**闭眼建**，冲突时 `IntegrityError` → 查回已有记录返回
- [ ] 建不了唯一约束的（可重复购买类）：上幂等表，幂等键由客户端生成
- [ ] 幂等表有 `request_hash` 字段，同 key 不同 body 返回 422
- [ ] 幂等表有清理任务（成功记录 24h 后删除）
- [ ] 单据流转（订单/支付/工单）用状态机：`UPDATE ... WHERE status=当前态`，按影响行数分流
- [ ] 非法状态跳转显式拒绝并告警，不是静默 500
- [ ] MQ 消费用**业务键**判重，不用消息 ID
- [ ] 消费端区分"处理失败要重试"和"已处理要 Ack"
- [ ] 支付回调四层齐上：验签 → 幂等表 → 状态机 → 唯一约束
- [ ] 前端防抖只是体验层，**后端一定有数据库层兜底**
- [ ] 压测过"双击并发""回调重放""改参重试"三种场景（直接跑 bench 脚本）
- [ ] 对账任务存在且真的在跑（最后一道人工防线）

**FAQ**

**Q1：幂等键存 Redis 行不行，为什么还要建表？**
A：Redis 快但会丢（重启/淘汰），丢单后果严重的场景必须落库。折中：Redis 做第一道快速判断，数据库幂等表做真相源。

**Q2：`IntegrityError` 之后查回来的记录，和刚创建的语义一样吗？**
A：响应一样（同一单），但要区分"我创建的"和"并发者创建的"需要记录归属。绝大多数场景不需要区分。

**Q3：PATCH 增量更新怎么幂等？**
A：改全量语义（PUT 化），或带版本号（`If-Match: version=5`），冲突返回 409 让客户端重读。

**Q4：幂等键的 TTL 设多久？**
A：覆盖客户端最长重试窗口即可，24 小时是业界惯例（Stripe 同款）。别设永久——存储会爆。

**Q5：先抢占位后，业务执行失败了怎么办？**
A：幂等记录标 `FAILED` 并删除（或允许同 key 重试），别把失败的 key 留成死锁。失败路径一定要在压测里覆盖。

**Q6：状态机在 Django 里怎么写得优雅？**
A：把 `ALLOWED` 转移表提到类属性，`transition()` 收敛到一个方法，视图层只调用不实现。别在每个视图里散写 `filter(status=...)`。

**Q7：扣款场景 `WHERE balance >= 100` 也算幂等吗？**
A：不算幂等，算**正确性**——重复执行第二次会因余额不足失败，天然防了重复扣款。但用户可能被误报"余额不足"，体验上还是要配幂等键。

**Q8：网关重试和我服务端的幂等，责任怎么分？**
A：网关只重试"没收到响应"的请求，幂等是服务端的义务。**永远假设网关会重试。** Nginx 默认 `proxy_next_upstream error timeout`，POST 也在重试范围内，检查你的配置。

---

## 结语

幂等设计就三句话：

> 1. **兜底在数据库**：唯一约束是物理防线，应用层检查只是信息，`先查后插`必然有窗口。
> 2. **一致靠幂等表**：抢占位 + 请求指纹 + 响应缓存，让重复请求拿到同一个结果，而不是报错。
> 3. **流转靠状态机**：条件更新把"读-改-写"压成一条 SQL，重放幂等跳过，非法跳转拒绝。

回到开头那个双击：如果订单表建了 `(user, product)` 唯一约束，如果提交带幂等键，如果支付状态机只认 `PENDING`——那个工单根本不会出现。

**"用户只提交了一次"是前端的世界观；"接口一定会被调用多次"才是后端的世界观。** 下次有人跟你说"这个接口不会重复调的"，把这篇的实测甩给他：8 个并发 8 条订单，5 次重放 5 条短信，100 次重试 1 次执行——三个数字看完，再去写代码。
