---
title: "300 个并发只该打 1 次库：穿透、击穿与雪崩"
slug: "cache-trio-deep-dive"
category_id: null
tags: ["Redis", "缓存", "后端", "性能优化"]
status: "published"
cover_image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80&auto=format&fit=crop"
---

# 300 个并发只该打 1 次库：穿透、击穿与雪崩

> 适用读者：已经给接口加过 Redis 缓存、知道"缓存空值/互斥锁/TTL 抖动"这三个名词，但在真实流量面前还是心里没底的后端工程师
> 技术栈：Redis 7 + Python 3.13；原理与并发模型不绑定语言，Go / Java 同样适用
> 阅读时间：约 25 分钟 | 难度：中高级 | 收获：布隆过滤器的参数推导与内存账、singleflight 的并发合并、热点 key 探测与三层防线
> 前置阅读：《[先删缓存还是先删库？——缓存一致性与穿透/击穿/雪崩实战](/article/cache-consistency-deep-dive/)》——那篇讲的是"三兄弟是什么、三种常规解法"；这一篇假设你已经知道那些，只讲**上线之后才会遇到的那部分**

## 前言：基础题会做，不代表线上不出事

上一篇文章里，穿透用"缓存空值"或"布隆过滤器"、击穿用"互斥锁"、雪崩用"TTL 抖动"——每个问题都能在五分钟内背出答案。

但线上事故从来不按教科书出题。它长这样：

- 你给不存在的 ID 缓存了空值，攻击者换成**每天几百万个不同的随机 UUID**，每个只查一次，空值缓存全是一批只读一次的垃圾，内存被撑爆，而且**一次都没挡住穿透**；
- 你给热点 key 加了互斥锁，流量高峰时 300 个线程全在等同一把锁，锁带来了新问题：**等待队列把线程池占满**，接口整体超时；
- 你给所有缓存加了 ±10% 的 TTL 抖动，看起来已经分散了，结果 Redis 主从切换花了 40 秒，**整个缓存层直接消失**，抖动再随机也没用。

这篇是进阶篇，只讲四件基础篇没讲透的事：

**目录**

- 两起事故复盘：防护措施为什么失效
- 布隆过滤器一次讲透：误判率、内存账、能不能删
- 空值缓存的进阶治理：和布隆过滤器打组合拳
- singleflight：把 300 次并发回源压成 1 次
- 热点 key：探测手段与四种治理方案
- 雪崩进阶：TTL 抖动只是第一层
- 三层防线与监控指标
- FAQ

---

## 1. 两起事故复盘：防护措施为什么失效

### 1.1 事故一：空值缓存被"一次性 UUID"撑爆

某详情页接口，QPS 平时 800。上线时按教科书做了防护：

```python
def get_item(item_id):
    key = f"item:{item_id}"
    cached = redis.get(key)
    if cached is not None:
        return json.loads(cached)
    item = Item.objects.filter(id=item_id).first()
    if item is None:
        redis.set(key, "NULL", ex=60)      # 缓存空值，防穿透
        return None
    redis.set(key, json.dumps(serialize(item)), ex=300)
    return serialize(item)
```

事故当天，攻击者用随机 UUID 刷 `/api/items/<uuid>/`：

```
GET /api/items/7f3a9c1e-.../   → 404，写入 item:7f3a9c1e-... = "NULL"
GET /api/items/2b8d0f44-.../   → 404，写入 item:2b8d0f44-... = "NULL"
...
```

**每个 key 只被查一次，永远不会有第二次命中。** 空值缓存不但没挡住请求（每次都是 miss，每次都查库），还额外付出了两个代价：

| 代价 | 具体表现 |
|---|---|
| 内存 | 每个 key + value + Redis 对象开销约 100 字节，300 万次请求 ≈ 300 MB，全是垃圾 |
| 淘汰 | 大量一次性 key 挤占内存，触发了 **volatile-lru 淘汰，把正常业务的热点 key 一起挤出去了** |

事后看，**空值缓存防的是"重复查同一个不存在的 ID"，防不住"查不存在且永不重复的 ID"**。前者是爬虫翻页，后者是攻击者。两种流量形态，需要两种武器——这就是布隆过滤器要出场的地方（第 2 章）。

### 1.2 事故二：互斥锁把线程池占满了

第二个事故更隐蔽。热点商品缓存加了互斥锁重建：

```python
def get_product(pid):
    cached = redis.get(f"product:{pid}")
    if cached:
        return json.loads(cached)
    if redis.set(f"lock:product:{pid}", 1, nx=True, ex=5):     # 抢到锁的才回源
        try:
            data = load_product(pid)                            # 慢查询，80ms
            redis.set(f"product:{pid}", json.dumps(data), ex=300)
            return data
        finally:
            redis.delete(f"lock:product:{pid}")
    time.sleep(0.05)                                            # 没抢到，睡一会儿再重试
    return get_product(pid)                                     # 递归重试
```

结果：缓存过期瞬间，300 个请求同时进来，1 个回源、299 个进入 `sleep(0.05)` 后递归。这批线程在等待期间**仍然占用 Web 容器的线程/worker**，而 `load_product` 因为数据库此时被打满，从 80ms 涨到 800ms。

递归重试 + sleep 的最坏情况是一个请求重试十几次，线程迟迟不释放，**后续所有请求（包括不需要缓存的接口）都排不上队**——这就是典型的"用锁做击穿防护，结果把击穿变成了雪崩"。

这个案例的正确解法不是"把锁的过期时间调短"，而是**进程内合并（singleflight）**：等待的请求不需要"轮询重试"，而是**直接挂起在第一个请求的结果上**，结果出来一次性唤醒，不消耗轮询。第 4 章给实现。

### 1.3 事故三（半起）：抖动做好了，Redis 挂了

第三个案例没有真的出大事，因为验证过降级。批量预热脚本在凌晨 3 点刷新 20 万个缓存 key，TTL 都是 30 分钟固定值——理论上 3:30 会集体过期。加了随机抖动后，过期点被摊平在 3:00–4:00。

**看起来问题解决了。** 但做压测时发现另一种雪崩：`redis-cli DEBUG SLEEP 30` 模拟 Redis 阻塞 30 秒，缓存层整体不可用——此时**不管 TTL 抖得多均匀，所有请求都会穿透到 DB**，抖动完全没有意义。

所以雪崩要分两种形态治理：**key 集体过期用抖动**，**Redis 整体不可用用多级缓存 + 熔断降级**。第 6 章展开。

---

## 2. 布隆过滤器一次讲透：误判率、内存账、能不能删

### 2.1 原理：一次"可能不存在"的快速判断

布隆过滤器的结构简单到可以在面试里手画：

```
m 位的位数组（全部初始为 0）：
  [0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0]

add("alice")，用 k=3 个哈希算出 3 个位置 1、5、11：
  [0][1][0][0][0][1][0][0][0][0][0][1][0][0][0][0]
      1           5              11

add("bob")，哈希到 5、9、14：
  [0][1][0][0][0][1][0][0][0][1][0][1][0][0][1][0]
      1           5         9    11      14

查询 "carol"，哈希到 5、9、11 —— 三位都是 1 → "可能存在"
查询 "dave"， 哈希到 2、9、14 —— 第 2 位是 0 → "一定不存在" ✅
```

两条铁律：

1. **说不存在，一定不存在**（假阴性率为 0）——这是它能当防护的前提；
2. **说存在，可能不存在**（有假阳性，即误判）——误判只是让请求多走一次缓存/DB，不影响正确性。

这就是它和"缓存空值"的本质区别：**布隆过滤器用一个几 MB 的位数组，覆盖了整个 ID 空间**。攻击者的随机 UUID 也一样会被判定为"一定不存在"直接挡掉，**不需要为每个不存在的 ID 存一个 key**——第 1.1 节的事故从根上不会发生。

### 2.2 参数推导：误判率和内存怎么换算

设：

- `n` = 预计要放的元素个数
- `m` = 位数组位数
- `k` = 哈希函数个数

插入 n 个元素后，某一位仍为 0 的概率是 `(1 - 1/m)^(kn) ≈ e^(-kn/m)`，因此查询时 k 位**都被误置为 1** 的概率是：

```
p ≈ (1 - e^(-kn/m))^k
```

**固定 p 和 n，最优的两个参数：**

```
m = -n · ln(p) / (ln 2)²        # 位数组大小
k = (m / n) · ln 2              # 哈希个数
```

代入最优解还有个漂亮的结论：**每个元素只需要 `-ln(p)/ln2 ≈ 1.44·log2(1/p)` 位**，且**无论 n 和 p 怎么变，最优时位数组恰好有一半是 1**（`k = m/n·ln2` 时 `e^(-kn/m) = 1/2`）。

这个公式值多少钱？算一笔账：

| 目标误判率 p | 每元素位数 m/n | 最优 k | 100 万元素的位数组 | 100 万请求的误判量 |
|---|---|---|---|---|
| 5% | 6.2 | 4 | 0.78 MB | 5 万 |
| 1% | 9.6 | 7 | 1.20 MB | 1 万 |
| 0.1% | 14.4 | 10 | 1.80 MB | 1000 |

**100 万个 ID 用 1.2 MB 就能买到 99% 的准确率。** 对比第 1.1 节的空值缓存方案：300 万个空值要 300 MB，还防不住。这个数量级的差距，就是"业界为什么都上布隆过滤器"的全部理由。

### 2.3 实测：理论值和实测值差多少

上面是理论。我在本机跑了一遍验证（`tools/bench_cache_trio.py`，n = 10 万，双重哈希 `h1 + i·h2`）：

```
── E2  bloom filter: n = 100,000 items ──
    target p   m (bits)   m/n   k   memory    measured FP   theoretical
      0.050     623,523    6.2   4    0.08MB      5.0270%      5.0269%
      0.010     958,506    9.6   7    0.12MB      1.0220%      1.0039%
      0.001   1,437,759   14.4  10    0.18MB      0.1030%      0.1000%
```

实测误判率和理论值几乎完全吻合（0.1% 那一档实测 0.1030%，理论 0.1000%）。这说明**公式可以直接拿来算容量**，不需要打余量到夸张的程度——但工程上仍然建议**按预期元素数的 1.3–2 倍配位数组**，因为：

- n 超配后误判率是**非线性上升**的（插入超过设计容量后，位数组越来越满，p 会迅速恶化）；
- 线上元素数很难预估准，尤其是"用户 ID 空间"这种会自然增长的量。

### 2.4 生产四问

**问题一：误判了会怎样？**

误判 = 一个不存在的 ID 被判定为"可能存在"。这时的行为是：**继续走正常的缓存/DB 查询路径，最后返回空**——和没有布隆过滤器时的行为完全一样。也就是说：

> **布隆过滤器的误判不会导致错误结果，只会让 1% 的请求多打一次库。**

它把"100% 的恶意流量穿透"降级为"p 比例的流量穿透"，剩下的由缓存空值兜底——这就是下面第 3 章讲的组合拳。

**问题二：标准布隆过滤器能删元素吗？**

**不能。** 位数组里一位可能被多个元素共享，把某一位清 0 会**误伤其他元素**，产生假阴性——而假阴性意味着"把存在的数据判断为不存在"，这是正确性事故。

需要删的场景有两条路：

| 方案 | 原理 | 代价 | 适用 |
|---|---|---|---|
| 计数布隆过滤器 Counting Bloom | 每位换成计数器（通常 4 bit） | 内存 ×4，计数溢出仍需处理 | 删除频繁、量不大 |
| 布谷鸟过滤器 Cuckoo Filter | 存指纹，支持删除 | 实现复杂，装填率上限 ~95% | 新项目、需要删除 |
| **定期整体重建（推荐）** | 数据删除后，用 DB 全量重新灌一次 | 需要双缓冲 | **绝大多数业务** |

绝大多数业务里，"ID 被删了但布隆过滤器里还在"根本无所谓——被删的 ID 查询时只是多打一次库返回空，比引入计数布隆的复杂度划算得多。真要删，用**版本化 + 定期重建**：

```python
def rebuild_bloom(model, version):
    """全量重建到新 key，再原子切换指针。老 key 保留 TTL 后由 Redis 自动清理。"""
    bloom = BloomFilter(expected_items=count_rows(model) * 2, fp_rate=0.01)
    for pk in model.objects.values_list("pk", flat=True).iterator(chunk_size=5000):
        bloom.add(str(pk))
    redis.set(f"bloom:{model.__name__}:v{version}", bloom.dumps(), ex=86400)
    redis.set(f"bloom:{model.__name__}:current", version)      # 原子切换
```

**问题三：怎么和写路径保持一致？**

布隆过滤器的"存在集合"必须覆盖数据库里所有合法 ID。三条路径：

1. **写数据库的同时 `add`**（同步，最常见）；
2. **消费 binlog 异步 `add`**（和缓存失效同一套管道，见旧文 2.5 节）；
3. **冷启动/重建时全量灌**。

顺序上有个安全原则：**先写库，后 add 到布隆**。反过来的话，如果 add 成功而写库失败，布隆里会多一个不存在的 ID——后果只是白白放过一次穿透，是安全的失败方向；而如果写库成功、add 失败（漏了一个合法 ID），会导致**正常数据被判定为不存在**，这是要避免的。所以重建/补偿任务必须能容忍"布隆略滞后于库"。

**问题四：Redis 没有 RedisBloom 模块怎么办？**

用 bitmap 手写，本质就是 `SETBIT` / `GETBIT`：

```python
def bloom_add(r, key, item):
    for idx in bloom_indexes(item, m, k):
        r.setbit(key, idx, 1)

def bloom_might_contain(r, key, item):
    return all(r.getbit(key, idx) for idx in bloom_indexes(item, m, k))
```

代价是 k 次 `GETBIT` 就是 k 次网络往返（k=7 时挺贵）。两个优化：

- **本地缓存一版布隆过滤器**（内存几 MB，QPS 高时收益极大，第 5 章讲本地缓存的统一做法）；
- 用 **Lua 脚本**把多次 `GETBIT` 合成一次往返；
- 或者直接用 **RedisBloom 模块**的 `BF.ADD` / `BF.EXISTS`，它内部用 C 实现，还支持 `BF.RESERVE` 指定误判率和扩容行为。

### 2.5 一份可以抄的实现

```python
import hashlib
import math


class BloomFilter:
    """标准布隆过滤器：double hashing（Kirsch–Mitzenmacher）。"""

    def __init__(self, expected_items: int, fp_rate: float):
        self.m = math.ceil(-expected_items * math.log(fp_rate) / (math.log(2) ** 2))
        self.k = max(1, round(self.m / expected_items * math.log(2)))
        self.bits = bytearray((self.m + 7) // 8)

    def _indexes(self, item: str) -> list[int]:
        digest = hashlib.sha256(item.encode()).digest()
        h1 = int.from_bytes(digest[:8], "big")
        h2 = int.from_bytes(digest[8:16], "big") | 1     # 保证 h2 为奇数
        return [(h1 + i * h2) % self.m for i in range(self.k)]

    def add(self, item: str) -> None:
        for idx in self._indexes(item):
            self.bits[idx >> 3] |= 1 << (idx & 7)

    def might_contain(self, item: str) -> bool:
        return all(self.bits[idx >> 3] >> (idx & 7) & 1 for idx in self._indexes(item))
```

用双重哈希构造 k 个哈希函数（`h1 + i·h2`），比真的算 k 次 SHA256 快一个数量级，误判率与理论值的偏差可以忽略——第 2.3 节的实测就是这份实现跑出来的。

---

## 3. 空值缓存的进阶治理：和布隆过滤器打组合拳

布隆过滤器解决"不存在的 ID"，但有一类数据它管不了：**业务上合法存在、只是当前没有数据**的场景（比如"这个用户今天还没有签到记录"）。这类请求会绕过布隆（ID 在集合里），仍然需要空值缓存。

空值缓存的两个坑，在第 1.1 节已经见过，这里给解法：

**坑一：一次性 key 撑爆内存。** 对策不是禁止缓存空值，而是**给空值设更短的 TTL + 在网关层做形态校验**：

```python
def get_item(item_id: str):
    if not UUID_RE.match(item_id):           # 形态先校验，随机字符串直接挡掉
        return None
    if not bloom.might_contain(item_id):     # 不存在的 ID 挡在布隆层
        return None
    key = f"item:{item_id}"
    cached = redis.get(key)
    if cached is not None:
        return json.loads(cached)
    item = Item.objects.filter(id=item_id).first()
    if item is None:
        redis.set(key, "NULL", ex=30)        # 空值 TTL 要短（30s，不是 60s+）
        return None
    redis.set(key, json.dumps(serialize(item)), ex=300)
    return serialize(item)
```

注意三层防护的顺序和各自的 TTL 设计：

| 层 | 挡什么 | TTL / 成本 |
|---|---|---|
| 参数形态校验 | 明显非法的输入 | 几乎零成本，最优先 |
| 布隆过滤器 | 不存在的 ID（含随机 ID） | 固定内存，7 次 GETBIT 或本地版零成本 |
| 空值缓存 | 合法但暂无数据 | 短 TTL（30s），给数据"补上"的机会 |

**坑二：内存被空值污染。** 如果 Redis 实例容量有限，建议把空值 key 放到**独立实例或独立 DB**，让淘汰策略只影响空值集合，不会把业务热点 key 挤出去。这个隔离很便宜，但能避免"防护措施引发二次事故"。

---

## 4. singleflight：把 300 次并发回源压成 1 次

### 4.1 互斥锁方案的三个代价

回到第 1.2 节。用锁 + 轮询做击穿防护，代价有三：

1. **轮询浪费**：299 个线程反复 `sleep` + `GET`，每次都在消耗 CPU 和 Redis QPS；
2. **线程占用**：等锁期间请求线程被占着，线程池打满会拖垮整个服务；
3. **雪上加霜**：回源变慢时，轮询次数反而增加，压力正反馈。

核心问题是：**等待者明明可以"直接拿到第一个请求的结果"，却选择了一遍遍去问"好了没"。**

### 4.2 进程内合并：singleflight

Go 的 `golang.org/x/sync/singleflight` 是标准解法。Python 里没有官方版本，但自己写只要 40 行：

```python
import threading


class _Flight:
    __slots__ = ("event", "value", "error")

    def __init__(self):
        self.event = threading.Event()
        self.value = None
        self.error = None


class FlightGroup:
    """并发合并：同一 key 的同时刻回源只有一个真正执行，其余共享它的结果。"""

    def __init__(self):
        self._mu = threading.Lock()
        self._inflight: dict[str, _Flight] = {}

    def run(self, key: str, loader):
        with self._mu:
            flight = self._inflight.get(key)
            leader = flight is None
            if leader:
                flight = _Flight()
                self._inflight[key] = flight

        if not leader:                      # 追随者：挂起等领导者的结果
            flight.event.wait()
            if flight.error is not None:
                raise flight.error          # 错误也共享（error sharing）
            return flight.value

        try:
            flight.value = loader()         # 领导者：只有我回源
            return flight.value
        except Exception as e:
            flight.error = e
            raise
        finally:
            with self._mu:
                self._inflight.pop(key, None)
            flight.event.set()              # 先发布结果，再唤醒追随者
```

接进缓存读取路径：

```python
flights = FlightGroup()

def get_product(pid):
    key = f"product:{pid}"
    cached = redis.get(key)
    if cached is not None:
        return json.loads(cached)

    def load():
        data = load_product(pid)                      # 300 个请求，这里只跑 1 次
        redis.set(key, json.dumps(data), ex=300 + random.randint(0, 60))
        return data

    return flights.run(key, load)
```

### 4.3 实测：300 个并发，DB 调用从 300 次变成 2 次

```
── E1  singleflight: 300 concurrent misses, DB latency 20 ms ──
    no singleflight (naive)  DB calls:   300  wall time:     66.1 ms  amplification: x1.00
    singleflight             DB calls:     2  wall time:     50.9 ms  amplification: x0.01
```

**并发度 ×300 的重复回源被压到了 2 次**，墙钟时间基本不变（50.9ms vs 66.1ms，就是那次真回源的耗时）。墙钟时间不变很关键：说明省下的是**纯浪费**的那 299 次，而不是把请求变得更慢。

**为什么是 2 次而不是 1 次？** 这是个值得讲清的细节：领导者在 `finally` 里先 `pop` 掉 flight，再 `event.set()`。在这**两个语句之间的微秒级窗口**里，一个新到的请求没看到 in-flight，于是自己当领导者又发起了一次回源。

这个"多出来的 1 次"不是 bug，而是 singleflight 的固有边界：**它合并的是"同一时刻已经在等待的请求"，不是"一段时间窗口内的所有请求"**。想彻底合并可以加双检缓存（`load()` 里先再 `GET` 一次再回源），但对生产来说，把它当"放大倍数从 300 降到 2"理解就足够了。

### 4.4 两层防线：本地合并 + 分布式锁

singleflight 是**进程级**的：一台机器上 300 个请求合并成 1 次，但 10 台机器就是 10 次回源。所以生产上通常是两层：

```
请求 → 进程内 singleflight（合并本机并发）
     → 仍未命中 → Redis 分布式锁（跨机器合并，见旧文）
     → 拿到锁 → 回源 + 回填
     → 没拿到锁 → 短暂等待后读缓存（不要无脑轮询）
```

两层各自的职责要说清楚：

| 层 | 合并范围 | 失败时的降级 |
|---|---|---|
| singleflight | 单进程内并发 | 无锁无竞争，纯内存操作 |
| Redis 分布式锁 | 跨进程 | 拿不到锁直接读缓存/返回旧值 |

还有一点容易踩：**singleflight 里要加超时**。如果领导者的回源卡住（DB 慢查询 30 秒），299 个追随者会一起挂在那里。给 `flight.event.wait()` 传超时（比如 500ms），超时后走降级路径返回旧值或默认值：

```python
if not leader:
    if not flight.event.wait(timeout=0.5):     # 超时不再傻等
        raise CacheMissTimeout(key)
```

---

## 5. 热点 key：探测手段与四种治理方案

### 5.1 危害：不是 Redis 被打满，而是"单个分片"被打满

热点 key 的真正麻烦在于 **Redis Cluster 按 key 哈希分片**：一个爆款商品的 key 会固定落在某一个分片上，**整个集群 32 个分片，扛住的是其中 1 个**。表现是"集群总 CPU 只有 30%，但 p99 已经飞了"——因为那一个分片的 CPU 是 100%。

同理还有 **Redis 单线程模型**：所有命令串行执行，单个 key 的 5 万 QPS 会把所有其他命令排队在它后面。

### 5.2 探测：三种手段

| 手段 | 做法 | 优缺点 |
|---|---|---|
| 客户端埋点统计 | 在缓存客户端里按 key 前缀计数，定期上报 | 最准、能看到 key 名；需要改客户端 |
| `redis-cli --hotkeys` | 基于 LFU 的采样统计 | 零改造；需要 `maxmemory-policy allkeys-lfu`，采样有偏差 |
| 代理层统计（如代理/自研网关） | 在 Redis 代理上按 key 聚合 | 对业务透明；多一层组件 |

生产推荐 **客户端 top-N 上报**：按 key 前缀聚合（`product:*`、`user:*`），每分钟输出 Top 20，落监控看板。**光有探测不够，一定要配告警**——热点是"提前不知道，事后才知道"的典型。

### 5.3 治理一：本地缓存（收益最大、最通用）

既然热点 key 就那几个，把它们放进**进程内 LRU**，一次 Redis 都不用查。E3 实测（1 万次请求、1000 个 key、幂律分布、Redis 1ms）：

```
── E3  local cache: 10,000 requests over 1,000 keys (skewed popularity), Redis latency 1.0 ms ──
    no local cache                   Redis ops:   10,000  Redis time:     10000 ms  p95 latency:  1.820 ms  L1 hit-rate: 0.0%
    with L1 (cap 10% keys, TTL 1s)   Redis ops:    4,770  Redis time:      4770 ms  p95 latency:  1.938 ms  L1 hit-rate: 52.3%
```

**只用 10% 的 key 空间（100 个 key）就拦掉了 52% 的 Redis 请求**——因为分布是长尾的，头部 key 贡献了绝大部分流量。代码就是一个带 TTL 的 LRU：

```python
from cachetools import TTLCache

l1 = TTLCache(maxsize=10_000, ttl=1.0)      # 1 秒足够，越短越安全


def get_product(pid):
    key = f"product:{pid}"
    hit = l1.get(key)
    if hit is not None:
        return hit                            # 零次 Redis 往返
    value = load_from_redis_or_db(key)
    l1[key] = value
    return value
```

本地缓存的**代价是一致性**：进程内这份数据的过期时间最多滞后 L1 TTL。所以：

- L1 TTL 要**远小于** Redis TTL（比如 L1 = 1s，Redis = 300s）；
- 对**绝对不能脏读**的数据（余额、库存扣减）不要放 L1；秒杀这类"读多写少但必须准"的，用"L1 只放元数据、真实库存走 Redis 原子操作"。

### 5.4 治理二：key 打散（写多份）

读多写少的热点，本地缓存就够了。**写热点**（点赞数、计数）则需要把 key 拆成 N 份，随机读写：

```python
def incr_hot_counter(key: str, n_shards: int = 8):
    redis.incr(f"{key}#{random.randrange(n_shards)}")     # 均匀散到 8 个 key


def read_hot_counter(key: str, n_shards: int = 8):
    return sum(int(redis.get(f"{key}#{i}") or 0) for i in range(n_shards))
```

这会带来两个新的取舍：**读要聚合 N 次**（N 越大读越贵），**计数不再是精确的单一值**（如果读的时候有并发写，会读到跨分片的不一致快照）。所以打散只用于**可以容忍最终一致、且读不频繁**的计数场景。

### 5.5 治理三&四：逻辑过期与只读副本

- **逻辑过期**：key 永不物理过期，value 里带 `expire_at`，读到已过期的数据时**直接返回旧值**，同时异步触发刷新。适合"数据可以短暂陈旧，但绝不能有回源抖动"的场景（首页榜单）。
- **读写分离 + 多副本**：热点 key 复制到多个 Redis 副本，读请求随机打到副本上。这是**代理层方案**（如 Redis 集群代理），业务无感，但引入复制延迟。

### 5.6 一张表选完

| 场景 | 首选方案 | 理由 |
|---|---|---|
| 读热点、可容忍 1s 陈旧 | 本地缓存 L1 | 收益最大、改造成本最低 |
| 读热点、必须实时 | 逻辑过期 + 异步刷新 | 不回源、不抖动 |
| 写热点计数 | key 打散 | 把单分片写压力摊到 N 个分片 |
| 极端热点、读多写多 | 代理层多副本/自研网关 | 对业务透明，代价是组件复杂度 |

---

## 6. 雪崩进阶：TTL 抖动只是第一层

### 6.1 形态一：key 集体过期——抖动幅度怎么定

TTL 抖动的标准写法（旧文有）是给基础 TTL 加随机量。但**抖多少**是有讲究的：

```python
def ttl_with_jitter(base: int) -> int:
    return base + random.randint(0, max(1, base // 4))    # +0 ~ +25%
```

原则：

- **抖动幅度 ≥ 回源能承受的恢复时间**。如果 20 万个 key 在 60 秒内陆续过期，回源峰值是 `20万×QPS/key / 60s`，要让 DB 扛得住；
- **抖动的基准要按 key 分组错开**，比如"用户维度缓存"按 `user_id % 8` 分成 8 个批次，每批落在不同的分钟段；
- 对**批量预热**的 key，不要让预热脚本用同一时刻的 TTL，**在预热时就写入抖动后的过期时间**。

最狠的一招是**错峰预热**：把预热任务从"一次性刷 20 万个 key"改成"分批 + 带抖动 TTL"，让过期曲线天然平滑，从源头消灭集体失效。

### 6.2 形态二：Redis 整体不可用——这是另一种雪崩

这是第 1.3 节提到的形态：抖动只管"过期时间分布"，管不了"缓存层整体消失"。此时要做三件事：

**一、多级缓存（L1 本地 + L2 Redis）。** 第 5.3 节的本地缓存在这里变成**救命层**：Redis 挂的 30 秒里，L1 命中率越高，穿透到 DB 的流量越少。这也是为什么"能上 L1 的业务就上 L1"——它同时治热点和治雪崩。

**二、熔断降级（必须做，且必须演练）。** Redis 不可用时，调用方要有明确的降级策略，而不是无限等待：

```python
def get_product(pid):
    try:
        return redis_get_product(pid)
    except (RedisTimeout, ConnectionError):
        breaker.record_failure()
        if breaker.is_open():
            return fallback_product(pid)       # 兜底：静态数据 / 旧值 / 默认值
        raise
```

**三、客户端超时要短。** Redis 客户端默认超时往往是秒级，Redis 阻塞时这会让请求线程全部挂起。**Redis 超时设 50–100ms**，快速失败快速降级，这是最容易漏掉但也最救命的一行配置。

### 6.3 兜底数据：给"最坏情况"准备一份答案

降级路径要返回什么，必须在**上线前**定好，而不是事故时临时拍：

| 数据 | 降级返回值 |
|---|---|
| 商品详情 | 缓存过的旧值（长 TTL 的兜底 key） |
| 首页榜单 | 静态化的榜单快照（每 5 分钟刷一次到本地文件/配置中心） |
| 用户个性化 | 非个性化默认列表 |
| 强一致数据（库存/余额） | 直接失败（返回"系统繁忙"），**不要返回可能错误的数** |

最后一行是重点：**降级不是所有数据都返回默认值**。像库存这种，返回 0 会让用户下单失败，返回旧值会导致超卖——正确做法是**明确拒绝服务**，把错误暴露出来，而不是用错误数据掩盖。

---

## 7. 三层防线与监控指标

把全文的防护按"请求经过的层"重新排一遍，这是上线时真正要核对的东西：

| 层 | 防穿透 | 防击穿 | 防雪崩 |
|---|---|---|---|
| 接入层 | 参数形态校验、限流、黑白名单 | 热点请求限流 | 全局限流保护下游 |
| 应用层 | 布隆过滤器、空值缓存（短 TTL） | singleflight、分布式锁 + 超时 | 熔断、降级、L1 本地缓存 |
| 缓存层 | — | 逻辑过期、热点不倒扣 | TTL 抖动、错峰预热、多副本/集群 |
| 数据层 | — | 回源接口自身的兜底超时 | 连接池限流、只读副本 |

**必须配的五个监控指标：**

| 指标 | 为什么看它 | 报警线参考 |
|---|---|---|
| 缓存命中率（按 key 前缀） | 命中率骤降 = 穿透或大面积失效 | 相对基线下降 20% |
| 回源 QPS / DB QPS | 缓存防护是否失效的直接信号 | 超过基线 3 倍 |
| Redis 慢查询 & 单分片 CPU | 热点 key 的典型特征 | 单分片 > 70% 持续 1 分钟 |
| Redis 连接超时数 | Redis 阻塞/故障的早期信号 | 非零即报 |
| 布隆过滤器误判率（抽样统计） | 容量不足的前兆 | 超过设计值 2 倍 |

**上线 Checklist（进阶版）：**

- [ ] 不存在 ID 的流量形态确认过：是"翻页重复"还是"随机不重复"？（决定空值缓存够不够）
- [ ] 布隆过滤器容量按预期元素的 1.3–2 倍配置，重建路径演练过
- [ ] 热点 key 的读取路径有 singleflight 或 L1，且 `wait()` 有超时
- [ ] 缓存重建的分布式锁有兜底（拿不到锁不等死）
- [ ] TTL 抖动幅度经过回源能力估算，不是随手写的 `random(0, 60)`
- [ ] Redis 客户端超时 ≤100ms，并有对应降级分支
- [ ] Redis 挂掉/latency 抖动 30 秒的演练做过，降级返回值语义确认过
- [ ] 上面五个监控指标在告警系统里都配了

---

## 8. FAQ

**Q1：布隆过滤器的误判会导致数据不一致吗？**
不会。误判只是让请求多走一次缓存/DB，最终结果和没有它时一致。它唯一的影响是"少挡了一部分流量"。

**Q2：为什么不用布隆过滤器替代空值缓存？**
两者解决不同问题：布隆管"ID 不存在"，空值管"ID 合法但当前没数据"（比如今天还没签到）。布隆不能表达"这个 key 暂时没有数据"，所以两者是组合而非替代。

**Q3：singleflight 和分布式锁是不是重复了？**
不重复，作用域不同：singleflight 合并**单进程**并发（零成本），分布式锁合并**跨进程**回源。生产上通常是 singleflight 在前、分布式锁在后，前者拦掉 99% 的重复。

**Q4：本地缓存 L1 会不会把一致性搞坏？**
会引入"最多滞后 L1 TTL"的窗口。所以 L1 TTL 要显著小于 Redis TTL（1s vs 300s），并且绝对不允许脏读的数据（余额、库存扣减）不进 L1。

**Q5：热点 key 探测有没有低成本方案？**
先用 `redis-cli --hotkeys`（需 LFU 策略）零改造看一轮；确认有热点后，再决定要不要在客户端做 top-N 上报。不要一上来就上自研代理层。

**Q6：TTL 抖动会不会导致缓存命中率下降？**
会有轻微下降（过期点被打散，某时刻总有更多 key 处于待过期状态），但相对"整点集体失效"的代价可以忽略。真正要调的是抖动幅度和批次划分，而不是取消抖动。

**Q7：文章里的实测脚本在哪？**
`tools/bench_cache_trio.py`，跑 `python tools/bench_cache_trio.py` 即可复现 E1/E2/E3 的全部数字——它在进程内模拟 Redis 与 DB 的延迟，不依赖真实 Redis，因为这里测量的（回源放大倍数、误判率、命中率）是并发与概率性质，跟具体存储无关。

---

## 结语

回头看，基础篇和进阶篇的区别不是"知不知道布隆过滤器"，而是三件事：

1. **知道每种方案的边界在哪**——空值缓存防不住随机 ID，抖动防不住 Redis 整体挂，互斥锁会把线程池占满；
2. **能算账**——布隆过滤器 100 万 ID 只要 1.2MB，本地缓存用 10% 的 key 空间能拦 52% 的流量，这些是可以拿公式和实测算出来的，不是"感觉够了"；
3. **有兜底**——所有防护都会失效，失效时返回什么数据，必须在事故前就写好。

如果你想从这份材料里只带走一句话：**缓存的每一层防护都在做"用一点点可接受的错误，换巨大的吞吐"——误判率 1%、数据陈旧 1 秒、放大倍数从 300 降到 2，都是这个交易的不同标价。**
