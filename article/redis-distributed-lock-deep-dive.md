---
title: "Redis 分布式锁：一次讲透正确姿势与失效边界"
slug: "redis-distributed-lock-deep-dive"
category_id: null
tags: ["Redis", "后端", "分布式", "并发"]
status: "published"
cover_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80&auto=format&fit=crop"
---

# Redis 分布式锁：一次讲透正确姿势与失效边界

> 适用读者：写过 CRUD、被超卖/重复下单/定时任务重复执行坑过的后端工程师
> 技术栈：Redis 7 + Python / Java 双示例，不绑定 Django，Spring Boot / Go 同样适用
> 阅读时间：约 30 分钟 | 难度：中高级 | 收获：一套生产可用的分布式锁模板 + 何时该放弃 Redis 锁的判断力

## 前言：一个被“卖超了”的优惠券

假设你写了这样一个接口：

```python
def grab_coupon(user_id):
    coupon = Coupon.objects.get(id=1)
    if coupon.stock > 0:
        coupon.stock -= 1
        coupon.save()
        Order.objects.create(user_id=user_id, coupon_id=1)
        return True
    return False
```

单机单进程时没问题。上线后你扩了 4 台机器，压测 200 并发抢 100 张券，结果：

- 数据库里 `stock` 变成了 -37；
- 订单表多了 137 条；
- 老板在群里 @ 你。

直觉反应是“加锁”。单机 `threading.Lock` / `synchronized` 锁不住 4 台机器。这时你需要的是**分布式锁**：让分布式系统里的 N 个进程，对同一资源“互斥访问”。

Redis 是最常见的分布式锁实现，但也是**被误用最多的**。这篇文章把五个版本逐个拆开：每个版本解决什么、引入什么新坑、源码层面为什么这样写。最后还会诚实地告诉你：**Redis 锁解决不了的两种场景**，以及该换什么。

**目录**

- 分布式锁的四条军规
- V1：SETNX 天真版，为什么线上必翻车
- V2：SET NX PX + 唯一值，第一个可用版本
- V3：Lua 解锁 + 看门狗续期，生产模板
- V4：Redlock，争议最大的算法
- 失效边界：Redis 锁搞不定的两种场景
- 对比选型：Redis / ZK / DB / Etcd 怎么选
- 上线 Checklist + 高频 FAQ

---

## 1. 分布式锁的四条军规

Martin Kleppmann 等人在讨论 Redlock 时总结的约束，任何分布式锁都应该满足：

| 性质 | 含义 | 反例 |
|---|---|---|
| 互斥性 Safety | 任意时刻只有一个客户端持有锁 | 两台机器同时扣减库存 |
| 无死锁 Liveness | 持有者崩溃后锁最终能释放 | 进程 kill -9 后所有请求卡死 |
| 容错性 Fault Tolerance | Redis/网络抖动时仍能达成互斥 | Redis 主从切换丢锁导致双持锁 |
| 可重入/可识别归属 | 锁只能由持有者释放，不能被别人误解 | A 超时了，B 拿到锁，A 醒来把 B 的锁删了 |

记住第 4 条，后面 80% 的坑都和它有关：**“删别人的锁”比“拿不到锁”更危险**。拿不到锁只是失败重试，删别人的锁是数据错乱。

---

## 2. V1：SETNX 天真版，为什么线上必翻车

最早的教程都这么写：

```python
# V1：错误示范，请勿抄
def acquire(lock_key):
    return redis.setnx(lock_key, 1) == 1

def release(lock_key):
    redis.delete(lock_key)
```

配合业务：

```python
if acquire("lock:coupon:1"):
    try:
        grab_coupon(user_id)
    finally:
        release("lock:coupon:1")
```

三个致命问题：

**问题 1：没有过期时间，必死锁。**

进程在 `grab_coupon` 中途崩溃（OOM、kill -9、容器被驱逐），`finally` 根本没机会执行，`lock:coupon:1` 永远留在 Redis。所有后续请求 `SETNX` 永远返回 0，优惠券再也抢不了，只能半夜起来手动 `DEL`。

有人打补丁：“加个过期不就行了？”

```python
# V1.1：依然错误
if redis.setnx(lock_key, 1) == 1:
    redis.expire(lock_key, 10)  # 两条命令，非原子
```

`SETNX` 和 `EXPIRE` 之间崩溃，同样死锁。**加锁必须是原子操作**，这是 V2 要解决的。

**问题 2：谁都能删。**

A 拿到锁，业务执行太慢（GC 停顿、慢 SQL），锁过期了。B 拿到锁开始执行。A 醒来执行 `finally: DEL`，把 B 的锁删了。C 又进来，三个人同时在临界区。这就是第 1 章说的“删别人的锁”。

**问题 3：不可重入导致的自死锁。**

同一线程嵌套调用两次 `acquire`（比如抢券逻辑里又调了需要同一把锁的发短信逻辑），第二次 `SETNX` 返回 0，直接返回失败，业务莫名其妙走不通。

> **结论：V1 只能用于单机演示，任何生产环境都不该出现。看到 `setnx + expire` 分两步写的代码，直接标红。**

---

## 3. V2：SET NX PX + 唯一值，第一个可用版本

Redis 2.6.12 起 `SET` 命令原生支持 `NX` + `PX`，一句话把“加锁+过期”变成原子操作：

```
SET lock:coupon:1 <unique_token> NX PX 30000
```

- `NX`：key 不存在才成功，相当于 SETNX；
- `PX 30000`：30 秒过期，防止死锁；
- `<unique_token>`：UUID，每个持有者唯一，用于“只能自己删自己”。

Python 正确版：

```python
import uuid
import redis

r = redis.Redis(host="127.0.0.1", port=6379, decode_responses=True)

def acquire(lock_key: str, ttl_ms: int = 30000) -> str | None:
    token = uuid.uuid4().hex
    ok = r.set(lock_key, token, nx=True, px=ttl_ms)
    return token if ok else None

def release(lock_key: str, token: str) -> bool:
    # 必须比较 token 再删，且比较+删除要原子，见 4.1 的 Lua
    if r.get(lock_key) == token:
        r.delete(lock_key)
        return True
    return False
```

Java（Jedis / Lettuce 同理，核心就是一行 SET）：

```java
String token = UUID.randomUUID().toString();
String ok = jedis.set("lock:coupon:1", token, SetParams.setParams().nx().px(30000));
boolean locked = "OK".equals(ok);
```

这个版本解决了 V1 的两个问题：

1. 原子加锁+过期，不会死锁；
2. token 归属校验，不会误删别人的锁（至少“检查”是做了，是否有竞态见下一节）。

但还剩两个坑：

**坑 A：`GET + DEL` 非原子，极端情况下依然误删。**

```python
if r.get(lock_key) == token:  # A 判断是自己的
    # ← 在这里，锁刚好过期，B SET 成功拿到锁
    r.delete(lock_key)        # A 把 B 的锁删了
```

窗口很小，但在高并发 + GC 停顿下一定会出现。修复必须用 Lua（下一章）。

**坑 B：TTL 拍脑袋。**

TTL 设 30 秒，业务 31 秒才跑完，锁提前释放，并发又进来了。TTL 设 10 分钟，进程崩溃后要 10 分钟才能恢复，故障窗口太大。这是 V3 看门狗要解决的矛盾：**TTL 既要短（快速恢复），又要长（覆盖业务）**。

> **结论：V2 是面试标准答案，生产及格线。个人博客、小后台、定时任务防重跑，用 V2 + Lua 解锁已经够了。**

---

## 4. V3：Lua 解锁 + 看门狗续期，生产模板

### 4.1 解锁必须用 Lua

把“比较 token + 删除”塞进一个 Lua 脚本，Redis 单线程执行脚本，保证原子：

```lua
-- KEYS[1] = lock_key, ARGV[1] = token
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end
```

Python 封装：

```python
UNLOCK_LUA = """
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end
"""
_unlock = r.register_script(UNLOCK_LUA)

def release_safe(lock_key: str, token: str) -> bool:
    return _unlock(keys=[lock_key], args=[token]) == 1
```

Java（Redisson 也是这个思路，只是封装得更好）：

```java
// Jedis eval 原子解锁
String lua = "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end";
jedis.eval(lua, List.of("lock:coupon:1"), List.of(token));
```

这一行是**所有 Redis 锁实现的分水岭**：没用 Lua / `EVAL` 的实现，一律按 V1 处理。

### 4.2 看门狗：TTL 短 + 自动续期

矛盾回顾：TTL 短则业务超期被踢，TTL 长则崩溃恢复慢。

Redisson 的解法是**看门狗（Watchdog）**：加锁时给一个短 TTL（默认 30 秒），后台起一个定时任务，每 10 秒检查一次“业务还没跑完且锁还是我的”，就 `PEXPIRE` 续期 30 秒。业务结束或进程崩溃，续期停止，锁最多 30 秒后自动释放。

```python
import threading
import time

class RedisLock:
    def __init__(self, client, key, ttl_ms=30000):
        self.r = client
        self.key = key
        self.ttl_ms = ttl_ms
        self.token = None
        self._stop = threading.Event()

    def acquire(self, timeout_ms=5000):
        deadline = time.time() + timeout_ms / 1000
        while time.time() < deadline:
            token = uuid.uuid4().hex
            if self.r.set(self.key, token, nx=True, px=self.ttl_ms):
                self.token = token
                threading.Thread(target=self._watchdog, daemon=True).start()
                return True
            time.sleep(0.05)
        return False

    def _watchdog(self):
        # 每 ttl/3 续期一次
        while not self._stop.wait(self.ttl_ms / 3000):
            lua = "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('PEXPIRE',KEYS[1],ARGV[2]) else return 0 end"
            if self.r.eval(lua, 1, self.key, self.token, self.ttl_ms) == 0:
                break  # 锁已丢，不再续

    def release(self):
        self._stop.set()
        if self.token:
            release_safe(self.key, self.token)
```

生产建议：**直接用 Redisson（Java）/ redis-py 的锁 + 自研看门狗，而不是手写**。Redisson 的 `RLock.lock()` 默认就带看门狗 + 可重入计数 + Pub/Sub 唤醒等待者，比上面 30 行健壮得多：

```java
RLock lock = redisson.getLock("lock:coupon:1");
lock.lock();  // 默认 30s + 看门狗续期，可重入
try {
    grabCoupon(userId);
} finally {
    lock.unlock();
}
```

### 4.3 等待策略：别用无脑 while true

上面 `acquire` 里 `sleep(50ms)` 轮询是最糙的。三个优化方向：

| 策略 | 做法 | 适用 |
|---|---|---|
| 固定退避 + 超时 | 50ms 轮询，最多等 5 秒 | 通用默认 |
| 指数退避 + 抖动 | 50ms → 100ms → 200ms…+随机 | 争抢激烈时减少 Redis 压力 |
| Pub/Sub 唤醒 | Redisson 解锁时 publish，等待者 subscribe 被唤醒再抢 | 高并发秒杀，减少空转 |

小博客/后台任务用第一种就够，秒杀再上第三种。

> **结论：V3（SET NX PX + token + Lua 解锁 + 看门狗）是单 Redis 实例下的生产标准答案。本文附带的模板可以直接抄。**

---

## 5. V4：Redlock，争议最大的算法

### 5.1 Redlock 想解决什么

V3 有一个前提：**Redis 是单实例（或主从但只写主）**。一旦用了 Redis Cluster / 哨兵主从切换，会出现丢锁：

1. A 在 Master 拿到锁 `lock:1`；
2. Master 还没同步给 Slave 就宕机；
3. Slave 升主，没有 `lock:1`；
4. B 在新 Master 拿到同一把锁，A 和 B 同时在临界区。

Redlock（Antirez 提出）的思路：准备 5 个**独立** Redis 实例，拿锁要多数派（≥3）成功，且总耗时小于 TTL 才算拿到。释放时逐个实例 Lua 删除。

```python
# 伪代码，理解思想用，生产请用 redlock-py / Redisson.RedLock
def redlock_acquire(key, token, ttl_ms, instances):
    n = 0
    start = time.time()
    for r in instances:
        try:
            if r.set(key, token, nx=True, px=ttl_ms):
                n += 1
        except Exception:
            pass
    elapsed = (time.time() - start) * 1000
    # 多数派 + 没超时 = 成功，否则回滚
    if n >= len(instances) // 2 + 1 and elapsed < ttl_ms:
        return True
    for r in instances:
        try:
            release_safe_on(r, key, token)
        except Exception:
            pass
    return False
```

### 5.2 为什么争议这么大

Martin Kleppmann 发长文炮轰 Redlock，核心两点：

1. **依赖系统时钟**：Redlock 用“总耗时 < TTL”判断有效性，假设各实例时钟大致同步。一旦某台机器时钟跳变（NTP 纠时、虚拟机暂停），锁的有效期判断就错了。而 fencing token 方案不依赖时钟。
2. **没有解决 GC 停顿导致的互斥失效**：A 拿到锁后 STW 停顿 40 秒（TTL 30 秒），锁过期被 B 拿走，A 恢复后继续执行业务，照样双写。这是**所有基于 TTL 的锁**的原罪，Redlock 也不例外。真正的解法是让资源层做 fencing（下一章）。

Antirez 的反驳：Redlock 的目标是“在 Redis 挂掉/切换时仍互斥”，不是“解决进程停顿”，两者不在一层。时钟跳变可以通过运维规范缓解。

谁对？我的生产经验：

- 90% 的团队**连单实例锁都没写对**（还在用 V1），根本轮不到操心 Redlock；
- 用了云 Redis（主从自动切换）又要求强互斥（库存、资金）的，要么上 Redlock，要么直接换 ZK/Etcd；
- 普通防重（定时任务、短信防抖），单实例 + V3 足够，别给自己加戏。

> **结论：Redlock 不是银弹，是“单实例不够用”时的备选项。先把 V3 写对，再谈 Redlock。**

---

## 6. 失效边界：Redis 锁搞不定的两种场景

这是深度长文必须有的诚实章节。

### 6.1 场景一：进程停顿超过 TTL，锁形同虚设

如 5.2 所述，任何 TTL 锁都防不住“拿到锁后长时间停顿”。解法是 **fencing token（栅栏令牌）**：

每次加锁成功返回一个单调递增的 token（如 Redis `INCR lock:fence`），业务写资源时必须带上 token，资源层拒绝旧 token 的写入：

```
1. A 拿锁，fence=10
2. A STW 40s，锁过期，B 拿锁，fence=11
3. B 写入 DB（fence=11），成功
4. A 恢复，想写入 DB（fence=10），DB 发现 10 < 11，拒绝
```

MySQL 实现骨架：

```sql
-- 资源表加 fence 列
UPDATE coupon_stock SET stock = stock - 1, fence = 11
WHERE id = 1 AND fence < 11;  -- 旧 token 写不进去
```

这就是 ZooKeeper / Etcd 顺序节点的思想：**锁只做“选主”，真正防并发靠资源层的版本号校验**。资金、库存务必加这一层。

### 6.2 场景二：锁粒度太大，系统被串行化

有人给“整个下单接口”加一把大锁，并发 1000 直接变串行，RT 从 50ms 涨到 2s。排查三问：

1. 锁的 key 能不能更细？`lock:coupon:1` 比 `lock:coupon` 好，`lock:coupon:1:user:123` 在防重复提交时更好；
2. 临界区能不能更小？只锁“查库存+扣减”，短信/日志扔出锁外异步做；
3. 能不能不用锁？库存扣减完全可以用 DB 原子操作代替：

```sql
UPDATE coupon SET stock = stock - 1 WHERE id = 1 AND stock > 0;
-- 影响行数 1 = 成功，0 = 没抢到，无需任何分布式锁
```

**能用原子操作解决的，别用锁。** 锁是最重的同步手段。

---

## 7. 对比选型：Redis / ZK / DB / Etcd 怎么选

| 方案 | 互斥强度 | 可用性 | 性能 | 复杂度 | 适合 |
|---|---|---|---|---|---|
| Redis 单实例 V3 | 中（主从切换可能丢） | 高 | 极高（万级 QPS） | 低 | 防重、定时任务、短信防抖 |
| Redlock | 中高 | 高 | 高（5 次 RTT） | 中 | 云 Redis + 库存/订单 |
| ZooKeeper / Etcd | 高（CP，ZAB/Raft） | 中（少数派存活即可） | 中（千级） | 高（需维护集群） | 选主、配置中心、强一致选主 |
| DB 唯一约束/乐观锁 | 高（靠 DB 事务） | 依赖 DB | 低 | 低 | 资金、订单去重，兜底 |
| DB `GET_LOCK` | 低（只对单 DB 有效） | 低 | 低 | 低 | 别用，纯过渡 |

我的选型口诀：

- 先问“能不能不用锁”（原子 SQL / 唯一索引去重）；
- 能，写 SQL；
- 不能，单 Redis V3；
- 云上主从切换丢过锁，再上 Redlock 或 ZK；
- 钱相关的，锁 + fencing/唯一约束双保险。

---

## 8. 上线 Checklist + 高频 FAQ

**Checklist（10 项）**

- [ ] 加锁是 `SET key token NX PX` 单命令，非 `SETNX + EXPIRE` 两步
- [ ] token 是每次随机的 UUID，解锁用 Lua 比较+删除
- [ ] TTL 按“崩溃恢复容忍”设（30s 左右），业务耗时靠看门狗续期而非调大 TTL
- [ ] 临界区只放必须互斥的代码，IO（短信/邮件/日志）扔出去
- [ ] 锁 key 带业务前缀和版本：`lock:v1:coupon:1`，大改版切 `v2`
- [ ] 获取不到锁有超时 + 退避，而非 `while True` 打爆 Redis
- [ ] 主从切换场景已评估，丢不起的上了 Redlock 或 fencing
- [ ] 资金/库存有 DB 层兜底（`WHERE stock > 0` / 唯一约束 / fence 列）
- [ ] 监控了锁等待时长和拿锁失败率，而非只监控 Redis 存活
- [ ] 本地压测过“持有者崩溃”和“业务超 TTL”两种故障，而非只测 happy path

**FAQ**

**Q1：TTL 设多少？**
A：默认 30s + 看门狗。先短后调，别一上来 10 分钟。

**Q2：Redisson 和手写哪个好？**
A：生产用 Redisson（Java）/ 成熟库。手写只用于学习和面试讲原理。

**Q3：Redis Cluster 能用 Redlock 吗？**
A：Redlock 要求 5 个**独立主节点**，不是 Cluster 分片。Cluster 用 `{hash tag}` 把锁固定到单槽位，走 V3 也行，但 failover 丢锁问题仍在。

**Q4：定时任务重复执行，用锁还是用 ShedLock？**
A：Java 直接 ShedLock（DB/Redis/JDBC 都支持），原理就是本文 V2，省得自己写。

**Q5：点了两次提交，生成两个订单，锁加哪？**
A：key 加用户维度：`lock:order:submit:{userId}:{idempotencyKey}`，前端再配按钮防抖 + 后端唯一约束，三层。

**Q6：Go / Python 没有 Redisson 怎么办？**
A：`redis-py` + 本文 V3 模板，或 `go-redsync`（Redlock 官方 Go 实现），都有看门狗等价物。

---

## 结语

Redis 分布式锁就三句话：

> 1. 加锁原子（SET NX PX），解锁原子（Lua 比 token 再删）；
> 2. TTL 短 + 看门狗续，锁粒度越细越好；
> 3. 丢不起的场景，锁只是“选主”，真正保命的是资源层的 fencing/唯一约束。

下次有人说“加个 Redis 锁就行了”，把这篇的 Checklist 甩给他：V1 的代码还在不在？Lua 解锁写了吗？TTl 多少？主从切换丢锁怎么办？资金有 DB 兜底吗？五个问题答完，才算真的“加了锁”。
