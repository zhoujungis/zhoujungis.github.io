---
title: "分布式事务：本地消息表、Outbox、Saga 与 TCC 的边界"
slug: distributed-transaction-outbox-saga-tcc
cover_image: /photos/distributed-transaction-outbox-saga-tcc-cover.png
date: 2026-11-04
tags: ["后端", "分布式事务", "消息队列", "架构设计"]
---

> 适用读者：正在把单体拆成微服务、第一次遇到「两张表要一起改」的后端工程师；被 2PC、事务消息、Saga、TCC 这几个名词绕晕，想知道它们各自到底承诺什么的人
> 结论先行：没有一种方案能同时拿到 ACID 的全部四条。本地消息表与 Outbox 用「同库同事务写入 + 至少一次投递 + 消费端幂等」换最终一致；Saga 用「可补偿步骤 + 反向执行」换长流程的可用性，但没有隔离性；TCC 用「预留资源」换接近强一致的隔离，代价是每个参与者都要写三个接口。选型的关键不是选最强的，而是选你能承受哪一种中间态。
> 阅读时间：约 28 分钟 | 难度：进阶 | 收获：一张可直接用的 outbox 表、relay 与 CDC 两条投递路径、Saga 的补偿设计、TCC 三个经典异常的成因与修法，以及一组真正能报警的观测指标

**目录**

- 开场：钱扣了，订单没建
- 为什么 2PC 和 XA 在微服务里不好用
- 本地消息表与 Outbox：同一张表，两种叫法
- 写入路径：业务事务和消息必须同库同事务
- 投递路径：轮询 relay、SKIP LOCKED 与 CDC
- 至少一次投递，消费端必须幂等
- Saga：编排、协同与补偿的边界
- 没有隔离性，Saga 会露出哪些中间态
- TCC：Try、Confirm、Cancel 与三个经典异常
- 四种方案对比与选型
- 观测：积压、重试、死信与卡住的 Saga
- 常见误区：事务消息、ACID 与顺序
- 小结
- 相关阅读

---

## 开场：钱扣了，订单没建

对账是在月底做的。财务发现一批支付流水显示「成功」，订单库里却查不到对应订单。数量不大，几十笔，但每一笔都意味着用户的钱已经离开账户，而履约系统根本不知道这笔交易存在。

把时间线倒回去，代码是这样的：

```python
def create_order(user_id, sku_id, amount):
    order = Order.objects.create(
        user_id=user_id, sku_id=sku_id, amount=amount, status="pending"
    )
    resp = requests.post(PAYMENT_URL, json={
        "order_id": order.id, "amount": str(amount), "user_id": user_id,
    }, timeout=3)
    if resp.status_code == 200:
        Order.objects.filter(id=order.id).update(status="paid")
        publish_order_paid(order.id)
    else:
        order.delete()
```

这段代码里其实有三笔独立的本地事务：订单库写订单、支付库扣款、订单库改状态。它们各自都能成功，也各自都能失败，中间隔着两次网络调用。事故发生的那次，支付服务已经提交扣款并返回 200，订单服务在 `update(status="paid")` 之前被发布流程的 `kill -9` 打断了。重启之后没有任何补偿任务知道这笔支付对应的订单该不该补建。

更常见的一种变体是「订单建了，钱没扣」：订单先落库，调用支付超时，客户端重试，支付服务第二次请求才成功；订单库里却出现了两条订单，或者一条订单被扣了两次。反过来也有「消息发了，本地事务回滚了」：`publish_order_paid` 在 `transaction.atomic()` 内部被调用，消息已经进了 MQ，后面一个校验失败导致事务回滚，下游收到一条指向不存在订单的事件。

这三个方向看起来是三种 bug，本质是同一个：**两个本地事务之间不存在原子性，而中间的远程调用又不可回滚。** 你不能用「调用返回 200」推断「对方已经提交」，也不能用「我这边提交成功」推断「消息已经送达」。任何一个两步操作，只要中间有网络，就有窗口。

所以分布式事务要解决的从来不是「怎么让两个数据库一起提交」，而是「在一个窗口无法消除的系统里，怎么让最终结果可控」。下面四套方案，是四种不同的「可控」定义。

## 为什么 2PC 和 XA 在微服务里不好用

2PC 是最容易想到的答案：既然两个库不能一起提交，那就找一个协调者，先让所有参与者 prepare，全部成功后再一起 commit。协议本身没有问题，问题在于它假设的运行时环境。

先区分两个概念。2PC 是协议，描述 prepare 与 commit 两个阶段；XA 是 X/Open 定义的一套接口标准，让数据库、消息队列把「准备」和「提交」暴露给外部事务管理器。数据库里的 `xa_start`、`xa_end`、`xa_prepare`、`xa_commit`、`xa_rollback`、`xa_recover` 就是这套接口。2PC 可以不走 XA，XA 也只是 2PC 的一种实现载体。

在单体应用、同一个机房、两三个都支持 XA 的资源之间，它确实能工作。但搬到微服务里，会撞上四堵墙。

第一堵是同步阻塞。参与者 prepare 成功之后，必须持有资源锁直到 commit。这段时间里，行锁不放、连接不还、undo 不能清理。跨服务调用的事务持续时间等于「网络往返 + 下游业务耗时 + 重试等待」，没人能保证它是毫秒级。一个下游抖三秒，上游所有相关事务的连接就被按住三秒。

第二堵是协调者单点。prepare 之后协调者崩溃，参与者会停在 prepared 状态，既不能自己提交也不能自己回滚，只能等协调者恢复后读日志重放。协调者放在哪里？做成一个独立服务，它自己又成了需要高可用的单点；放进某个业务服务里，这个服务重启就会把一批 prepared 事务挂住。

第三堵是参与者长时间持锁。微服务里参与者往往不是数据库，而是一个 HTTP 服务。你很难让一个 HTTP 服务「prepare 一下，先别提交，等我通知」，除非它自己实现了一套事务管理器。而它一旦这么做，这个服务就不再是自治的，它的数据库连接、行锁、幂等状态都要为跨服务事务让路。

第四堵是异构资源。支付渠道、短信网关、对象存储、Redis，大多不支持 XA。你无法让第三方支付「prepare 后等待 commit」。即使只差一个参与者，整个 2PC 也退化成「大部分能锁、一个锁不住」，最后仍然要靠补偿。

还有一个经常被忽略的结果：commit 阶段如果部分参与者失败，系统会进入「混合结果」（heuristic outcome）。协调者只能记录，不能自动修复。这不是实现缺陷，是协议在分区下的必然。CAP 面前，2PC 选择一致性，代价就是可用性和恢复复杂度。

所以在微服务里，2PC 适合的场景非常窄：参与者少、事务短、同机房、全部支持 XA、并且你能接受协调者故障时的人工介入。绝大多数「下单扣库存发券」的长流程，都不在这个范围里。

## 本地消息表与 Outbox：同一张表，两种叫法

本地消息表这个名字在国内出现得早，Outbox 是英文语境里的叫法，DDD 与 microservices.io 的 Transactional Outbox 模式说的都是它。Debezium 的文档里还有一个 Outbox Event Router，专门把这张表的变化转成事件。三个名字，一张表。

它的核心只有一句话：**把「待发布的事件」和业务数据写进同一个数据库、同一个事务。** 业务事务提交，事件一定在表里；业务事务回滚，事件一定不在。至于什么时候发出去，是另一个独立的、可以失败可以重试的动作。

这张表归业务服务所有，不归消息队列。它不是一个「消息暂存区」，而是业务库的一部分，和订单表、账户表享受同样的备份、迁移、权限和事务语义。MQ 只是传输通道，换 RabbitMQ、Kafka、RocketMQ 都不影响 outbox 的存在。

这一点和 RocketMQ 的「事务消息」不一样。事务消息把半消息存在 broker，生产者执行本地事务后向 broker 确认 commit 或 rollback；outbox 把待发事件存在业务库，broker 完全不参与本地事务。两者要解决的问题相同，都是让「本地写库」和「发消息」具有原子性，但信任的存储不同。事务消息依赖 broker 的可靠性，outbox 依赖你自己的数据库。对已经有成熟数据库运维的团队，后者的故障域更熟悉。

需要提前说清楚边界：**outbox 只保证事件不丢，不保证事件只被消费一次。** 投递器可能重复发送，消费者可能重复处理。后面会单独讲幂等，这里先记住「至少一次」是这套方案的设计目标，不是缺陷。

表结构可以长这样：

```sql
CREATE TABLE outbox_event (
    id              BIGSERIAL PRIMARY KEY,
    event_id        UUID NOT NULL UNIQUE,
    aggregate_type  TEXT NOT NULL,
    aggregate_id    TEXT NOT NULL,
    event_type      TEXT NOT NULL,
    schema_version  INT NOT NULL DEFAULT 1,
    payload         JSONB NOT NULL,
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    available_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    status          TEXT NOT NULL DEFAULT 'pending',
    attempts        INT NOT NULL DEFAULT 0,
    last_error      TEXT NOT NULL DEFAULT '',
    locked_at       TIMESTAMPTZ,
    locked_by       TEXT
);

CREATE INDEX outbox_ready_idx
    ON outbox_event (status, available_at, id);

CREATE INDEX outbox_aggregate_idx
    ON outbox_event (aggregate_type, aggregate_id, id);
```

`event_id` 是给消费端做幂等用的，必须在生产端生成，不能等消费端自己造。`aggregate_id` 决定分区键和顺序边界。`available_at` 让重试退避不需要额外的调度表。`schema_version` 是给未来留的退路：事件格式一定会变，消费端需要知道自己在读第几版。

## 写入路径：业务事务和消息必须同库同事务

写入的要点不是「写两张表」，而是「两张表在同一个事务里，且这个事务里不做任何外部 IO」。Django 里可以这样：

```python
from django.db import transaction
from django.utils import timezone
import uuid


class OutboxEvent(models.Model):
    event_id = models.UUIDField(default=uuid.uuid4, unique=True)
    aggregate_type = models.CharField(max_length=64)
    aggregate_id = models.CharField(max_length=64)
    event_type = models.CharField(max_length=64)
    schema_version = models.PositiveIntegerField(default=1)
    payload = models.JSONField()
    occurred_at = models.DateTimeField(auto_now_add=True)
    available_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=16, default="pending")
    attempts = models.PositiveIntegerField(default=0)
    last_error = models.TextField(blank=True)
    locked_at = models.DateTimeField(null=True, blank=True)
    locked_by = models.CharField(max_length=64, blank=True)


def create_order(user_id, sku_id, amount):
    with transaction.atomic():
        order = Order.objects.create(
            user_id=user_id, sku_id=sku_id, amount=amount, status="pending"
        )
        OutboxEvent.objects.create(
            aggregate_type="order",
            aggregate_id=str(order.pk),
            event_type="order.created",
            payload={
                "order_id": order.pk,
                "user_id": user_id,
                "sku_id": sku_id,
                "amount": str(amount),
                "currency": "CNY",
            },
        )
    return order
```

如果外层已经有一个 `transaction.atomic()`，或者开了 `ATOMIC_REQUESTS`，内层的 outbox 写入会自动加入外层事务，不需要额外处理。反过来，如果你在事务里调用支付、发短信、写 Redis，那么事务的持续时间就被这些 IO 拉长，行锁和连接被一起拖住。**outbox 的写入应该尽量靠近事务末尾，并且事务里只做数据库操作。**

这里有一个很容易踩的坑：用 `transaction.on_commit` 发消息。`on_commit` 解决的是「事务提交后才执行副作用」，它确实能避免「事务回滚了消息却发出去」。但它不能避免「事务提交了，回调还没执行，进程就崩了」。回调只存在于当前进程的内存里，进程一死，消息就是丢了。`on_commit` 适合发邮件、清缓存这类丢了可以接受的副作用；不适合作为跨服务事件的唯一通道。

payload 也有几条纪律。不要把 ORM 对象、文件句柄、datetime 对象直接塞进去，JSON 序列化会失败或者产生不可控的格式；金额用字符串或整数分，不要用浮点；事件里只放消费端真正需要的字段，不要把整行数据复制过去，否则上游加一列、下游的 schema 就炸。事件是契约，不是数据库快照。

## 投递路径：轮询 relay、SKIP LOCKED 与 CDC

投递器（relay）是一个独立进程，负责把 outbox 里的 pending 行发到 MQ。它需要解决三件事：多实例不重复抢同一行、发送失败可重试、进程崩溃后能恢复。

轮询版本可以用 `FOR UPDATE SKIP LOCKED`。这是 PostgreSQL 9.5 引入、MySQL 8.0 也支持的语法：每个 relay 实例锁住自己抓到的那批行，其他实例直接跳过被锁的行，不会互相阻塞。

```sql
WITH picked AS (
    SELECT id
    FROM outbox_event
    WHERE status = 'pending'
      AND available_at <= now()
    ORDER BY id
    FOR UPDATE SKIP LOCKED
    LIMIT 100
)
UPDATE outbox_event o
SET status = 'sending',
    locked_at = now(),
    locked_by = :worker_id
FROM picked p
WHERE o.id = p.id
RETURNING o.id, o.event_id, o.event_type, o.payload;
```

对应的 Python 伪代码：

```python
def relay_once(worker_id, batch_size=100):
    with transaction.atomic():
        rows = list(
            OutboxEvent.objects.select_for_update(skip_locked=True)
            .filter(status="pending", available_at__lte=timezone.now())
            .order_by("id")[:batch_size]
        )
        ids = [row.id for row in rows]
        if not ids:
            return 0
        OutboxEvent.objects.filter(id__in=ids).update(
            status="sending",
            locked_at=timezone.now(),
            locked_by=worker_id,
        )

    for row in rows:
        try:
            body = dict(row.payload)
            body["event_id"] = str(row.event_id)
            producer.send(
                topic="order-events",
                key=row.aggregate_id,
                value=body,
            )
            OutboxEvent.objects.filter(id=row.id).update(status="sent")
        except Exception as exc:
            attempts = row.attempts + 1
            delay = min(pow(2, attempts), 3600)
            OutboxEvent.objects.filter(id=row.id).update(
                status="pending",
                attempts=attempts,
                last_error=str(exc)[:500],
                available_at=timezone.now() + timedelta(seconds=delay),
            )
    return len(rows)
```

注意这里的崩溃窗口：事务提交了 `status='sending'`，进程在 `producer.send` 之前被杀，这一行就永远停在 sending。修法是租约：`locked_at` 超过一个阈值（比如五分钟）就视为过期，由一个清理任务把它改回 pending。代价是可能重复发送，但这正是「至少一次」的含义。你也可以把发送放在事务内，但那样会在持有行锁的同时等网络，并且一旦发送成功、事务回滚，消息就变成了幽灵。两害相权，重复发送比丢消息便宜。

轮询的延迟由轮询间隔决定，吞吐由「每批行数 / 每轮耗时」决定。如果事件到达速率是每秒 λ 条，单轮处理 b 条、耗时 t 秒，那么 relay 的服务率大约是 b/t；要保证积压不增长，必须让 b/t 明显大于 λ，并留出余量给下游抖动。这个估算不需要压测，用小学除法就够了，但它能提前告诉你「batch=10、每秒轮询一次」在峰值时一定会堆积。

CDC 是另一条路径。Debezium 的 PostgreSQL connector 通过 logical decoding 读 WAL，MySQL connector 读 binlog，把 outbox 表的每一行变化转成事件。业务代码不用写 relay，延迟接近实时，也不需要在数据库上反复扫表。

```json
{
  "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
  "database.hostname": "postgres",
  "database.dbname": "shop",
  "table.include.list": "public.outbox_event",
  "transforms": "outbox",
  "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
  "transforms.outbox.table.field.event.id": "event_id",
  "transforms.outbox.table.field.event.key": "aggregate_id",
  "transforms.outbox.table.field.event.type": "event_type",
  "transforms.outbox.table.field.event.payload": "payload"
}
```

CDC 的代价转移到了运维：复制槽会保留 WAL，connector 停的时间越长，磁盘涨得越快；表结构变更要同步到 connector 的配置；connector 重启后可能重复投递，消费端仍然要幂等；你还得监控 connector 的 lag，而不是 outbox 表的积压。它适合已经有 Kafka Connect 和 Debezium 运维能力的团队，不适合把它当成「免运维的 relay」。

两条路径有一个共同点：**顺序只能按分区保证。** 多个 relay 实例用 `SKIP LOCKED` 抢行，谁先发出去没有保证；即使 outbox 表按 id 排序，并发发送也会乱序。要让同一个订单的事件有序，必须用 `aggregate_id` 作为 MQ 的 key，让同一聚合根的事件进同一个分区，并且每个分区只有一个消费者。跨聚合根的全局顺序，本来就不该是业务依赖的东西。

## 至少一次投递，消费端必须幂等

outbox 把「消息不丢」做成了数据库事务的一部分，但重复仍然会发生：relay 发送成功后、标记 sent 之前崩溃；CDC connector 重启；消费者处理完业务、提交 offset 之前崩溃；网络超时导致上游重发。这些都不是异常路径，是正常运行的一部分。

所以消费端必须回答一个问题：同一条事件送到两次，业务结果是否和一次相同？

最直接的做法是建一张去重表，`event_id` 唯一，插入成功才执行业务：

```python
class ProcessedEvent(models.Model):
    event_id = models.UUIDField(unique=True)
    consumer = models.CharField(max_length=64)
    processed_at = models.DateTimeField(auto_now_add=True)


def handle_order_created(event):
    with transaction.atomic():
        _, created = ProcessedEvent.objects.get_or_create(
            event_id=event["event_id"],
            defaults={"consumer": "inventory-service"},
        )
        if not created:
            return
        Inventory.objects.filter(sku_id=event["sku_id"]).update(
            reserved=F("reserved") + 1
        )
```

`get_or_create` 内部会处理唯一键冲突：先查，查不到就插，插入撞唯一键就再查一次。它把「检查」和「写入」放在同一个事务里，但并发下仍可能两个请求都走到插入，其中一个拿到 IntegrityError 后重新查询，最终只有一个 `created=True`。这比「先查再写」的两段式可靠，因为两段式在查和写之间有窗口。

如果业务表本身就有天然唯一键，可以不用去重表。比如「支付成功」事件要改订单状态：

```sql
UPDATE "order"
SET status = 'paid', paid_at = now()
WHERE id = :order_id AND status = 'pending';
```

这条语句的 `rowcount` 就是幂等信号：第一次执行返回 1，重复执行返回 0。把状态机迁移本身当成幂等键，比额外维护一张表更省事，但它要求所有写入都走条件更新，不能有人绕过状态机直接 `UPDATE status='paid'`。

去重表会一直增长。保留多久取决于重投窗口：MQ 的最长重试时间、relay 的租约时间、CDC 的重放范围。超过这个窗口的重复基本不会发生，可以按 `processed_at` 定期归档。不要用「永远保留」来换安全感，那张表最终会比业务表还大。

还有一点：**消费端的 offset 提交必须在业务事务之后。** 如果先提交 offset 再处理业务，进程崩溃就永久丢消息；如果处理完业务、offset 还没提交就崩溃，消息会重投，由幂等兜住。Kafka 的手动提交、RabbitMQ 的手动 ack 都是这个顺序。更强的一种做法是把 offset 和业务结果写进同一个数据库事务，代价是消费者与消息中间件的耦合变深。

## Saga：编排、协同与补偿的边界

Saga 不是「分布式事务框架」的同义词。它 1987 年由 Garcia-Molina 和 Salem 提出，原始定义是：一个长活事务由一系列本地事务组成，每个本地事务都有一个补偿动作；如果某一步失败，就按相反顺序执行已经完成步骤的补偿。

举一个下单流程：

```text
1. 创建订单（status=pending）       补偿：取消订单
2. 锁定库存                         补偿：释放库存
3. 锁定优惠券                       补偿：解锁优惠券
4. 支付扣款                         补偿：退款
5. 发送发货通知                     补偿：无法撤销
```

前四步都能写一个语义上的反向操作，第五步不能。所以第五步必须放在最后，并且只在前面全部成功后才执行。这就是「不可补偿步骤放最后」的全部理由：不是它不重要，而是它一旦执行，就没有自动恢复的路。

「支付扣款」看起来可补偿，退款是另一笔交易，可能失败、可能延迟、可能产生手续费。更稳的做法是把扣款拆成「授权冻结」和「请款」：前面冻结额度，最后请款；冻结可以撤销，请款放在流程末端。这和 TCC 的 Try/Confirm 已经很近了。

实现上有两种组织方式。

编排是一个中心化的状态机，它知道每一步的顺序、超时、重试和补偿。状态必须持久化，不能只放在内存里：

```sql
CREATE TABLE saga_instance (
    id           UUID PRIMARY KEY,
    saga_type    TEXT NOT NULL,
    business_key TEXT NOT NULL,
    state        TEXT NOT NULL,
    current_step TEXT,
    payload      JSONB NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (saga_type, business_key)
);

CREATE TABLE saga_step (
    saga_id    UUID REFERENCES saga_instance(id),
    step_name  TEXT NOT NULL,
    seq        INT NOT NULL,
    state      TEXT NOT NULL,
    attempts   INT NOT NULL DEFAULT 0,
    last_error TEXT,
    PRIMARY KEY (saga_id, step_name)
);
```

每一步执行前先把状态改成 executing，执行后记录 done 或 failed；补偿也一样。进程崩溃后，恢复任务扫描「state=running 且 updated_at 超过阈值」的实例，从 `current_step` 继续。每一步的业务接口必须用 `(saga_id, step_name)` 做幂等键，否则恢复时会把同一步做两遍。

协同没有中心状态机，各个服务监听事件、执行本地事务、再发下一个事件。订单服务发 `order.created`，库存服务扣减后发 `inventory.reserved`，支付服务收到后扣款。补偿也走事件：`order.cancelled` 触发库存释放。它的优点是服务之间松耦合，没有单点；缺点是全局状态不可见，出问题时你不知道整条 Saga 卡在哪，只能沿着事件日志一段一段拼。步骤少、团队边界清晰时它很好用；步骤多、补偿关系复杂时，编排更容易维护。

补偿动作有几个必须写进设计里的性质。它是语义补偿，不是数据库回滚：取消订单是把状态改成 cancelled，不是 `DELETE`；释放库存是加回去，不是把行删掉。它必须幂等，因为补偿也会重试。它可能失败，失败后要重试并告警，不能假设「补偿一定成功」。它还要考虑「补偿覆盖别人写入」的问题，这一点下一节展开。

## 没有隔离性，Saga 会露出哪些中间态

Saga 的论文里说它提供 ACD，不提供 I。原子性靠补偿，一致性靠业务约束，持久性靠本地事务，唯独隔离性没有。因为每一步都是独立提交的，其他事务能在步骤之间看到中间状态。

最直观的一种：订单已经创建、库存还没锁定，用户刷新页面看到「待支付」，客服系统看到「待履约」，仓储系统看到「待出库」。三个系统对同一笔订单的理解不一致。如果仓储系统只按 `status='pending'` 过滤，它可能开始拣货；如果用户此时取消，Saga 进入补偿，仓库已经把货发出去了。

第二种更隐蔽，是「脏读导致业务误判」。假设库存只剩 1 件：

```text
Saga A: 锁定库存 1 件 -> 库存变为 0 -> 后续步骤失败 -> 准备补偿
Saga B: 此时读到库存 0，判定无货，拒绝用户下单
Saga A: 补偿执行，库存回到 1
```

从最终结果看，库存没有被永久占用，A 的补偿也是对的。但 B 的拒绝是基于一个即将被撤销的中间态做出的。用户看到「没货」，而实际上货还在。这类问题不会出现在对账里，只会出现在用户投诉里。

第三种是补偿覆盖别人的写入。如果补偿写成绝对值：

```sql
UPDATE inventory SET available = 10 WHERE sku_id = 'SKU-1';
```

而在这条补偿执行之前，另一个 Saga 已经扣掉了 2 件，那么这次补偿会把别人的扣减一起抹掉。正确写法是增量：

```sql
UPDATE inventory
SET available = available + 1
WHERE sku_id = 'SKU-1';
```

增量补偿是可交换的，顺序不影响结果；绝对值补偿不是。这个区别在单测里很难发现，因为单测通常只有一个 Saga。

缓解手段有几种，按成本从低到高：

- 语义锁。中间态对外不可见，比如订单只有 `status='confirmed'` 才允许履约，`pending` 只是内部状态。读模型过滤掉中间态，用户就不会基于半成品做决策。
- 状态机约束。只允许合法迁移，`pending -> paid -> shipped`，禁止从 `pending` 直接发货；补偿也只能走 `cancelled`，不能删行。
- 按聚合根串行。同一个订单、同一个库存 SKU 的 Saga 进同一个分区，同一时刻只有一个在跑。这会牺牲吞吐，但能消掉大部分交错。
- 对关键资源改用 TCC 或数据库短事务。库存、余额这类「检查与扣减必须原子」的资源，本来就不适合用 Saga 的「先扣再补」来模拟。
- 给 Saga 设超时。卡住的状态比错误的状态更危险，因为没人知道它还会不会继续。

## TCC：Try、Confirm、Cancel 与三个经典异常

TCC 把一次资源操作拆成三个阶段。Try 做资源预留和业务检查，Confirm 把预留转为正式扣减，Cancel 释放预留。它和 Saga 的区别在于：Saga 的中间态是「已经扣了，等会儿可能加回来」，TCC 的中间态是「额度被冻住，还没真正扣」。后者对其他事务可见，并且能被正确拒绝，所以 TCC 在资源层面提供了隔离。

代价是业务侵入。每个参与方都要实现三个接口，而且这三个接口都必须处理「顺序错乱、重复调用、从未调用」的情况。TCC 的经典异常就三个。

空回滚：Try 没有执行，请求超时或者根本没到参与者，但协调者判定失败，发出了 Cancel。Cancel 如果直接报「找不到记录」，协调者会一直重试，或者把这笔标记为失败；正确做法是 Cancel 要能「无中生有」地记一条「已取消」的墓碑，然后正常返回。

幂等：Confirm 或 Cancel 因为超时被重试了多次。如果 Cancel 每次都把库存加回去，一次预留会被释放多次，库存虚增，最终超卖。必须用业务主键做唯一约束，让同一笔的 Cancel 只生效一次。

悬挂：Cancel 先到，Try 后到。典型原因是网络乱序或协调者超时后重试。Cancel 已经把资源标记为取消，稍后到达的 Try 如果还老老实实去预留，就会留下一笔永远不会被 Confirm 或 Cancel 的冻结额度。Try 必须先看状态，发现已经取消就拒绝预留。

这三个异常可以用一张参与方状态表统一处理：

```sql
CREATE TABLE tcc_record (
    business_id TEXT NOT NULL,
    participant TEXT NOT NULL,
    state       TEXT NOT NULL,
    amount      NUMERIC(18, 2),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (business_id, participant)
);
```

Try 写成「插入或读取」：

```sql
INSERT INTO tcc_record (business_id, participant, state, amount)
VALUES (:business_id, :participant, 'TRIED', :amount)
ON CONFLICT (business_id, participant) DO NOTHING;
```

插入成功，说明第一次 Try，去冻结额度；插入返回 0 行，说明已经有记录，再查状态：如果是 `CANCELLED`，说明 Cancel 先到了，直接拒绝这次 Try，这就是防悬挂；如果是 `TRIED` 或 `CONFIRMED`，按幂等成功返回。

Cancel 写成「插入墓碑或条件更新」：

```sql
INSERT INTO tcc_record (business_id, participant, state)
VALUES (:business_id, :participant, 'CANCELLED')
ON CONFLICT (business_id, participant)
DO UPDATE SET state = 'CANCELLED'
WHERE tcc_record.state = 'TRIED';
```

如果插入成功，说明之前没有 Try，这就是空回滚，记墓碑后返回成功；如果冲突且原状态是 `TRIED`，释放冻结额度并置为 `CANCELLED`；如果已经是 `CANCELLED` 或 `CONFIRMED`，直接返回成功，这就是幂等。关键点是释放额度这一步必须和状态迁移在同一个事务里，用条件更新保证只有一行能成功，不能先释放再改状态。

Confirm 只允许 `TRIED -> CONFIRMED`。如果记录不存在，说明 Try 没成功，不能凭空确认；如果已经是 `CONFIRMED`，幂等返回。Confirm 失败要重试，不能直接放弃，因为资源已经被预留，不确认也不取消就会一直冻着。

这套状态机就是业务 fencing：用数据库的唯一约束和条件更新，把「谁先到」变成「谁的状态迁移合法」。它比在应用层加锁可靠，因为锁会随着进程崩溃消失，而状态行不会。

## 四种方案对比与选型

把四种方案放在一张表里，差异会清楚很多。注意「一致性」这一列不是「强 vs 弱」的道德判断，而是「什么时候对谁可见」。

| 方案 | 一致性 | 隔离性 | 业务侵入 | 失败处理 | 适用场景 |
| --- | --- | --- | --- | --- | --- |
| 2PC / XA | 提交前强一致，提交后可能混合结果 | 有，靠锁 | 低，依赖中间件 | 协调者恢复、人工介入 | 同库多资源、短事务、参与者都支持 XA |
| 本地消息表 / Outbox | 最终一致 | 无 | 中，建表加 relay | 重试、退避、死信、消费幂等 | 异步解耦、事件驱动、允许秒级到分钟级延迟 |
| Saga | 最终一致 | 无，只有语义锁 | 中高，补偿接口加状态机 | 补偿重试、人工兜底 | 长流程、跨多个服务、参与者无法预留 |
| TCC | Confirm 后最终一致 | 资源预留级隔离 | 高，每个参与者三个接口 | 空回滚、幂等、防悬挂 | 资金、库存等不能超卖的关键资源 |

选型时先问五个问题，而不是先问「哪个最强」。

第一，能接受多长的中间态？如果业务要求「用户点完支付就必须立刻看到已支付」，outbox 的异步延迟可能就不能接受，需要在同步链路上做更强的约束。如果下游只是发积分、发通知，几秒的延迟完全无所谓。

第二，参与方你能不能改？TCC 要求每个参与者都提供 Try/Confirm/Cancel，第三方支付、外部 ERP 通常给不了。给不了就只能用 Saga 的补偿，或者把外部调用放到最后。

第三，流程有多长？两步的流程用 outbox 就够了，十步的流程需要一个持久化的 Saga 状态机，否则恢复逻辑会散落在各个服务里。

第四，中间态会不会被别的业务读到并据此行动？如果会，就必须加语义锁或 TCC；如果所有读模型都只读终态，Saga 的隔离性问题就被业务设计掩盖了。

第五，失败后谁来兜底？所有方案都需要一个「补偿失败」的人工队列。没有这个队列，再漂亮的自动补偿也会在某个凌晨卡住。

实际系统里经常混用。比如下单用 Saga 编排，每个步骤内部用本地事务加 outbox 发事件；库存和余额用 TCC 预留；对外部支付用「授权 + 请款」把不可补偿动作推到末端。方案不是互斥的，边界在于「哪一段需要隔离，哪一段只需要最终一致」。

## 观测：积压、重试、死信与卡住的 Saga

分布式事务的故障很少是「啪一下全挂」，更多是「慢慢堆积，直到超过某个阈值」。所以观测要看年龄和速率，不只看数量。

outbox 最先要看的是「最老的一条 pending 有多老」：

```sql
SELECT status, count(*) AS rows, min(occurred_at) AS oldest
FROM outbox_event
GROUP BY status;

SELECT count(*) AS stuck
FROM outbox_event
WHERE status = 'pending'
  AND available_at < now() - interval '5 minutes';
```

只看 pending 数量会被吞吐量误导：每秒一万条的系统，积压一千条可能只意味着 0.1 秒；每秒十条的系统，积压一千条已经是几分钟的延迟。用 `now() - min(occurred_at)` 做告警阈值，才和用户体验对得上。

relay 的吞吐要用「到达速率 vs 服务速率」比较。服务速率的粗估是 `batch_size / 单轮耗时`，单轮耗时包含抢锁、发送、更新状态。若到达速率接近服务速率，积压会线性增长；要留出余量给下游抖动。还可以看 `attempts` 的分布：如果大量事件停在 `attempts=5` 以上，说明下游有持续故障，不是偶发抖动。

死信要有独立的计数和年龄。不要把「重试到最大次数」当成处理完成，那只是把问题从 outbox 挪到了没人看的地方。死信队列的告警应该和业务告警同级，因为它意味着有一笔业务永远没有完成。

消费端看三个指标：消费 lag、去重命中数、业务失败数。去重命中数突然升高，通常意味着上游在重投，或者 relay 在重复发送；业务失败数升高，可能是事件 schema 变了，也可能是下游依赖挂了。

Saga 看「按状态分组的实例数」和「最老的 running 实例年龄」：

```sql
SELECT state, count(*), min(updated_at) AS oldest
FROM saga_instance
GROUP BY state;

SELECT id, saga_type, current_step, updated_at
FROM saga_instance
WHERE state = 'running'
  AND updated_at < now() - interval '10 minutes';
```

一个 running 超过十分钟的 Saga，要么是某一步在无限重试，要么是补偿卡住了。补偿失败数要单独计数，因为它和正向失败的处理方式不同：正向失败可以重试，补偿失败往往需要人工确认资源到底有没有释放。

TCC 还要看空回滚次数和悬挂拒绝次数。空回滚偶尔出现是正常的，Try 超时就会发生；持续上涨说明 Try 的超时设置或网络有问题；悬挂拒绝次数出现，说明 Cancel 跑到了 Try 前面，协调者的超时和重试策略需要检查。

## 常见误区：事务消息、ACID 与顺序

第一个误区是把「事务消息」当万能。RocketMQ 的事务消息解决的是「本地事务和发送消息的原子性」，它不解决消费端幂等，也不解决下游业务失败后的补偿。消费者收到两次照样会重复扣款，下游服务挂了照样需要重试和死信。它本质上是一个 broker 侧的 outbox，换了个存储位置，边界没有变。

第二个误区是把 Saga 当 ACID。Saga 没有隔离性，中间态会被看见；补偿不是回滚，它可能失败、可能产生新副作用；补偿完成也不等于「什么都没发生」，退款记录、取消记录都留下了。用它之前，先确认业务能接受这些痕迹。

第三个误区是 TCC 的 Cancel 不幂等。Cancel 被重试是常态，不是异常。如果每次 Cancel 都执行「库存加一」，一次预留会被释放多次。修法不是「让协调者别重试」，而是让 Cancel 本身具备幂等性：唯一键、状态机、条件更新，三选一，最好都用上。

第四个误区是相信 outbox 表里的顺序等于消息顺序。表按 id 递增，不代表发送按 id 递增；多个 relay 实例并发发送，顺序一定会乱。MQ 只能保证分区内有序，所以顺序需求要落到 `aggregate_id` 这个分区键上，并且消费端每个分区只能有一个消费者。跨分区谈全局顺序，是在跟物理约束较劲。

第五个误区是 outbox 表只写不清理。sent 的行会一直占着索引，relay 的扫描范围越来越大，备份越来越慢。按时间归档或删除，保留窗口覆盖审计和重放需求即可。清理任务本身也要幂等，避免和 relay 抢同一批行。

第六个误区是重试没有上限、没有退避。下游一挂，所有 relay 同时重试，把下游打得更挂。指数退避加抖动、最大尝试次数、死信队列，这三件套不是可选项。重试是恢复手段，不是免费的。

## 小结

回到开头那笔「钱扣了、订单没建」。如果当时用的是 outbox，支付成功后会有一条 `payment.succeeded` 事件落在支付库的 outbox 表里，订单服务消费这条事件时用 `payment_id` 做幂等键建单；即使订单服务当时崩了，事件还在，重启后继续消费。它不能保证「钱和订单同时一致」，但能保证「只要支付成功，订单最终会被创建」，并且重复消费不会建出两条订单。

四套方案的边界可以压缩成一句话：2PC 用锁换强一致，但锁的代价在微服务里放大了；outbox 用一张同库表换「事件不丢」，再用消费幂等换「重复无害」；Saga 用补偿换长流程的可用性，但把中间态暴露给了世界；TCC 用预留换隔离，代价是三个接口和三个异常。

真正要设计的不是「选哪个框架」，而是「这笔业务能接受哪种失败形态」。能接受延迟，就 outbox；能接受中间态，就 Saga；不能接受超卖，就 TCC；只能在同一个数据库里短事务，才考虑 2PC。选了之后，把幂等、补偿、死信、观测这四件事补齐，方案才算落地。

## 相关阅读

- [消息凭空消失排查记：MQ 可靠投递实测](/article/mq-reliable-delivery-deep-dive/)
- [用户只是双击了一下，订单多了 7 条——接口幂等](/article/api-idempotency-deep-dive/)
- [先删缓存还是先删库？——缓存一致性实战](/article/cache-consistency-deep-dive/)
- [事务回滚了，邮件照样发出去——Django 事务深水区](/article/django-transaction-atomic-on-commit/)
