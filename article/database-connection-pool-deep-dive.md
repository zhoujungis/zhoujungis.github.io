---
title: "数据库连接池：为什么 100 个连接比 20 个更慢"
slug: database-connection-pool-deep-dive
cover_image: /photos/database-connection-pool-deep-dive-cover.png
date: 2026-11-04
tags: ["后端", "数据库", "性能优化", "Django"]
---

> 适用读者：遇到数据库慢、第一反应是「把连接池调大」的后端工程师；正在算 gunicorn 该开几个 worker、pgbouncer 该配多少连接的人；被 `too many connections` 和 `server has gone away` 反复打扰的运维同学
> 结论先行：连接池不是越大越好，它是一个限流阀。数据库的吞吐上限由 CPU 核数、查询耗时和锁竞争决定，不由 Web 线程数决定。池子超过数据库能同时高效服务的并发数之后，多出来的连接只会在数据库内部排队，把单次查询拖慢，进而让每个请求占用连接更久。用 Little's Law 算「需要多少并发」，再用数据库容量算「能承受多少并发」，取小的那个，才是池大小。
> 阅读时间：约 26 分钟 | 难度：进阶 | 收获：一套可复算的连接数公式、Django 与 PostgreSQL/MySQL 的配置边界、pgbouncer 与 HikariCP 的取舍、连接泄漏与陈旧连接的定位方法

**目录**

- 开场：把池子从 20 调到 100，P99 反而更高
- 连接为什么贵：一个连接不只是一条 TCP
- 用 Little's Law 算需要多少并发
- 池参数：每一个都在解决一个具体问题
- Django：CONN_MAX_AGE 与 workers 乘 pool_size 的账
- PostgreSQL：max_connections 与 pgbouncer 的三种模式
- MySQL：max_connections、wait_timeout 与 thread_cache_size
- HikariCP：10 个连接为什么能服务上千 RPS
- 连接泄漏：四种最常见的漏法
- 异步连接池：一条连接不能同时给两个 task
- 故障切换后的陈旧连接
- 观测：active、idle、pending 与等待时间
- 小结
- 相关阅读

---

## 开场：把池子从 20 调到 100，P99 反而更高

故事通常是这样开始的：监控显示某个接口的 P99 在涨，数据库的 CPU 也高，但还没到 100%。有人翻了一遍配置，说连接池只有 20，太小了，加到 100 试试。发布之后，P99 没降，反而更高；数据库 CPU 被打满，日志里开始出现 `too many connections`；再过一会儿，一部分请求直接超时，错误率上升。

这时候很容易得出一个相反的结论：是不是连接池不能调大？其实两个结论都不完整。连接池从 20 调到 100，改变的不是「并发能力」，而是「同时涌向数据库的请求数」。如果数据库在 20 个并发时已经接近饱和，那么第 21 到第 100 个连接不会让查询变快，只会让它们在数据库内部排队，等待 CPU 时间片、等待行锁、等待共享缓冲区。每个查询的实际耗时被拉长，而每个请求占用连接的时间等于查询耗时，于是连接被占得更久。池子越大，同时在跑的查询越多，单次查询越慢，连接占用越久，这是一个正反馈。

监控上看到的是三件事同时发生：数据库活跃连接数上升、单条 SQL 的平均耗时上升、应用侧的获取连接等待时间上升。三者互为因果。真正的瓶颈可能在某个没走索引的查询，也可能在锁竞争，还可能只是连接数超过了数据库的物理核数，上下文切换把 CPU 吃掉了。调大池子只是把「应用侧排队」搬到了「数据库侧排队」，总量没有变，甚至更差。

所以这篇文章不讨论「池子该设多大」这一个数字，而是讨论这个数字由什么决定。连接为什么贵、并发怎么算、池参数各自防什么、Django 和 PostgreSQL/MySQL 的账怎么对、以及怎么看出连接泄漏。把这些拼起来，那个数字会自己浮出来。

## 连接为什么贵：一个连接不只是一条 TCP

很多人对连接成本的直觉来自「HTTP 连接也能复用，为什么数据库连接不能多开」。区别在于，数据库连接不是一条被动传输的管道，它背后有一个活的服务端执行单元。

PostgreSQL 的架构是「一个连接一个后端进程」。客户端连上来，主进程 fork 一个 backend，这个 backend 负责解析、执行、返回结果，直到连接断开才退出。MySQL 类似，只是把进程换成了线程，一个连接对应一个线程。SQLite 没有网络连接的概念，但每次打开文件也意味着独立的连接对象和事务状态。

这条连接的成本至少包括：

- 进程或线程本身的栈、句柄、调度开销。PostgreSQL 每个 backend 还有自己的内存上下文、catalog 缓存、执行器状态。
- 认证与传输安全。TLS 握手要做密钥交换，SCRAM 认证要做多轮挑战；每个新连接都要重来一遍，不能像 HTTP 那样把 TLS 会话复用到所有请求。
- 会话状态。每个连接有自己的 `search_path`、时区、事务隔离级别、临时表、prepared statement、advisory lock、`LISTEN` 订阅。这些状态不会因为「连接被池化」而消失，反而要求池在借出和归还时做清理。
- 服务端资源配额。`max_connections` 是一个硬上限，超过就是 `FATAL: sorry, too many clients already`，不是排队，是直接拒绝。数据库还要为每个连接保留槽位和共享内存，连接数越多，可用于缓存和排序的内存越紧张。

所以「多开连接」不是免费的并行，而是「多开几个执行单元去抢同一批 CPU 核、同一把锁、同一块共享内存」。当并发数超过核数，操作系统要做上下文切换；当多个事务改同一行，数据库要做锁等待；当每个连接都在跑大查询，共享缓冲区被反复换入换出。这些成本不会出现在「连接数」这个指标上，只会出现在查询延迟和 CPU 的 system 时间里。

这也是为什么连接池的第一个作用不是「提高并发」，而是「复用连接创建成本」。池子里的连接已经完成认证、已经建好会话，借出时省掉握手和 fork。这个收益是真实的，但它有上限：连接创建成本只在你频繁开关连接时才是主要矛盾。一旦连接被复用，池子大小决定的就是并发压力，而不是创建成本。

## 用 Little's Law 算需要多少并发

连接池大小的第一层约束是「业务到底需要多少并发查询」。这件事可以用 Little's Law 算，不需要压测。

Little's Law 的形式是：

```text
L = λ × W
```

`L` 是系统里同时存在的请求数，`λ` 是到达速率，也就是每秒请求数，`W` 是每个请求在系统里停留的平均时间。放到数据库连接上：如果应用每秒发起 500 次查询，每次查询平均耗时 8 毫秒，那么平均同时进行的查询数是 `500 × 0.008 = 4`。也就是说，理论上 4 个连接就能承接这个负载，20 个已经有很多余量。

这个公式有一个容易误用的地方：`W` 必须是「查询在数据库里的时间」，不是「HTTP 请求的总时间」。一个请求在应用里跑了 200 毫秒，其中 8 毫秒在数据库、192 毫秒在调用外部 API，那么它占用数据库连接的时间只有 8 毫秒。拿 HTTP 延迟去算连接数，会算出一个大得多的值，然后你会觉得「连接不够」，其实是连接被别的事情占着没还。

第二个容易误用的地方是「平均值」。P99 查询可能是平均值的几十倍，瞬时到达也可能是平均值的几倍。容量规划通常用「峰值 QPS × P99 查询耗时」做上界，再留一点余量，而不是用月平均。比如峰值 1000 QPS、P99 查询 50 毫秒，那么瞬时并发上界约 50；如果平均查询只有 5 毫秒，平均值算出来只有 5。两个数差十倍，池子该按哪个设，取决于你更怕「平时浪费」还是「峰值排队」。

但 Little's Law 只回答「需要多少」，不回答「数据库能不能承受」。第二层约束是数据库的服务能力。单条查询的服务时间 `S` 决定了单个连接的理论吞吐上限 `1/S`；`N` 个连接的理论上限是 `N/S`，但这是 100% 利用率下的天花板。排队论里，利用率 `ρ = λ × S / N`，当 `ρ` 接近 1，等待时间会急剧上升，不是线性增长。M/M/1 的等待时间近似是 `S / (1 - ρ)`，`ρ` 从 0.5 涨到 0.9，等待时间会翻好几倍。

所以池大小的合理区间是：

```text
需要的并发 = 峰值 QPS × P99 查询耗时
数据库能高效服务的并发 ≈ 核数 × (1 / 单查询服务时间) × 目标利用率
pool_size = min(需要的并发 + 余量, 数据库能高效服务的并发)
```

这个公式里的「核数」不是唯一因素。如果查询大量走磁盘、大量等锁，数据库的有效并行度会低于核数；如果查询全是内存命中，有效并行度可能接近核数。目标利用率通常留在 70% 到 80% 以下，给突发和后台任务留空间。具体数字要靠观测，不靠拍脑袋。

还有一点：**池大小不该由 Web 线程数决定。** 一个 8 worker、每 worker 4 线程的服务，最多有 32 个请求同时进来，但不代表 32 个请求同时都在查数据库。大部分时间他们在解析参数、调缓存、等下游。按线程数配连接，等于假设「每个请求全程都在查库」，这个假设通常错得离谱，而且会把数据库的连接数推到一个没必要的量级。

## 池参数：每一个都在解决一个具体问题

不同语言的池实现名字不一样，参数语义却高度相似。逐个看它们防的是什么。

`max_size` 是池的上限，也是并发查询的准入控制。它应该由上一节的公式决定，而不是「数据库最大连接数减掉一点」。设得太大，数据库被压垮；设得太小，请求在应用侧排队。它是唯一一个真正决定「同时有多少查询在跑」的参数。

`min_idle` 是最小空闲连接数。它的作用是避免冷启动：流量低谷时池子缩到零，第一个高峰到来时所有请求都要先建连接，延迟尖峰。代价是空闲连接一直占着数据库槽位和内存。对延迟敏感的服务可以设一个不大不小的值；对连接数紧张的环境，宁可让它缩。

`acquire_timeout` 是借连接的等待上限。它必须存在，而且必须小于上游的请求超时。没有它，请求会无限期挂在池上，线程被占满，最后整个服务不可用；有了它，至少能在超时后快速失败，把错误暴露出来。这个值不是越长越好：等 30 秒才拿到连接，通常意味着即使拿到也已经来不及了。

`idle_timeout` 是空闲连接被回收的时间。它必须小于数据库的 `wait_timeout`，也要小于中间设备的空闲断连时间，否则池以为连接还活着，数据库已经把它杀了，借出去就是 `server has gone away`。

`max_lifetime` 是连接的最大寿命。它的作用是定期换掉旧连接，避免长期积累的会话状态、内存碎片、以及故障切换后指向旧节点的连接。它应该小于数据库或负载均衡器允许的最长连接时间，并且要加抖动，避免所有连接在同一秒被一起换掉。

`validation` 或健康检查决定「借出前要不要验一下」。`SELECT 1`、`is_valid`、`Connection.isValid()` 都是这个思路。它增加一点延迟，但能避免把死连接交给业务。更好的做法是「借出时快速检查 + 空闲时定期检查」，而不是每次都跑一条完整查询。

`leak_detection` 是泄漏检测。HikariCP 的 `leakDetectionThreshold` 会在连接被借出超过阈值时打印堆栈；SQLAlchemy 可以通过池事件记录 checkout 时间和调用栈。它不是万能的，但它是唯一能在「连接只借不还」时告诉你「是谁借的」的工具。

这些参数有一个共同的排序原则：**先保证不把数据库压死，再保证请求不无限等待，最后才优化冷启动和回收。** 很多配置事故是把顺序倒过来了：为了降低冷启动延迟把 `min_idle` 设得很大，为了「不报错」把 `acquire_timeout` 设得很长，结果数据库先被空闲连接占满，高峰期又没有余量。

## Django：CONN_MAX_AGE 与 workers 乘 pool_size 的账

Django 的数据库连接管理和「池」是两套东西，很多人会混在一起。

默认情况下，`CONN_MAX_AGE = 0`，Django 在每个请求结束时关闭连接。这看起来「没有池」，实际上连接创建成本被摊到了每个请求上。把 `CONN_MAX_AGE` 设成一个正数，比如 60，或设为 `None`，连接会在请求结束后保留，供同一个线程后续请求复用。Django 文档把这种机制叫持久连接，它复用的是「每个线程一条连接」，不是一个共享池。

关键点是：**Django 的同步 ORM 连接是线程局部的。** 一个 gunicorn worker 进程里，每个线程各自持有一条连接。8 个 sync worker、每个 1 个线程，最多 8 条连接；如果换成 gthread、每个 worker 4 个线程，最多 32 条。再乘以实例数，才是这个服务对数据库的连接总量。这个账不乘，`max_connections` 一定会被算错。

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "shop",
        "CONN_MAX_AGE": 60,
        "CONN_HEALTH_CHECKS": True,
        "OPTIONS": {
            "connect_timeout": 5,
        },
    }
}
```

`CONN_HEALTH_CHECKS = True` 从 Django 4.1 起可用，会在复用持久连接前做一次健康检查，检查失败就丢弃并重建。它解决的是「连接在两次请求之间被数据库或网络断掉」的问题，代价是每次复用多一次往返。对于 `CONN_MAX_AGE` 大于几分钟的服务，这个开关通常值得开。

Django 6 的 PostgreSQL 后端还支持真正的连接池，但条件和上面不同：需要 psycopg 3 和 `psycopg_pool`，并且 `CONN_MAX_AGE` 必须为 0，因为池和持久连接不能同时启用。配置长这样：

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "shop",
        "CONN_MAX_AGE": 0,
        "CONN_HEALTH_CHECKS": True,
        "OPTIONS": {
            "pool": {
                "min_size": 2,
                "max_size": 10,
                "timeout": 5,
                "max_lifetime": 1800,
                "max_idle": 300,
            },
        },
    }
}
```

这里的 `max_size` 是「每个进程一个池」的上限。8 个 worker 就是 8 个池，每个池最多 10 条，总上限 80。pgbouncer 在前面的架构里，Django 连的是 pgbouncer，不是数据库，所以这 80 条是 pgbouncer 的客户端连接，不等于数据库连接。这个区别后面会展开。

还有一个隐藏的连接持有者：`ATOMIC_REQUESTS = True`。它把整个请求包在一个事务里，连接从请求开始一直被占到请求结束。如果请求中间调用了慢外部 API，连接就在那里空等。此时连接数需求不是「查询耗时 × QPS」，而是「请求总耗时 × QPS」，池子会以肉眼可见的速度被占满。

## PostgreSQL：max_connections 与 pgbouncer 的三种模式

PostgreSQL 默认 `max_connections = 100`，`superuser_reserved_connections = 3`。后者的意思是：普通用户最多用 97 个，剩下的 3 个留给超级用户做紧急维护。这个设计是为了防止「连接被打满之后连 DBA 都进不去」。

把这个上限分给谁，要先列清单：应用 A、应用 B、定时任务、迁移脚本、监控采集、复制槽、备份工具、以及你自己的 `psql`。每一类都要预留。不是「数据库有 100，我就用 90」。连接数打满时，报错是 `FATAL: sorry, too many clients already`，应用侧看到的是连接被拒绝，不是查询变慢。

每个 PostgreSQL 连接对应一个 backend 进程，这是它和 MySQL 最大的不同。连接数越多，进程数越多，共享内存、锁表、快照管理的竞争越明显。PostgreSQL 官方 wiki 的 Number Of Database Connections 一文明确建议：连接数应该少，更多连接不会带来更多吞吐，反而会增加上下文切换和内存压力。真正要提高并发，应该用连接池，而不是加 `max_connections`。

pgbouncer 是应用和 PostgreSQL 之间的轻量连接池。它有三种 `pool_mode`。

`session` 模式：客户端连上 pgbouncer 后，整个会话期间绑定一个服务端连接，直到客户端断开才归还。行为最接近直连，兼容性最好，但池化收益最小，因为客户端连接数仍然等于服务端连接数。

`transaction` 模式：服务端连接只在事务期间绑定，事务结束就归还。多个客户端可以分时复用同一批服务端连接。收益最大，也是大多数 Web 应用的默认选择。代价是「会话级状态」不再可靠。

`statement` 模式：每条语句结束就归还。它最激进，只适合纯 SQL、无事务、无多语句交互的场景。大多数 ORM 都不适合，因为一个业务操作通常由多条语句组成，需要事务边界。

transaction 模式的坑，几乎都围绕「会话状态」：

- prepared statement。服务端 prepared statement 是绑定在连接上的，连接被换给另一个客户端后，原来的 statement 名字可能不存在，或者指向错误的语句。pgbouncer 新版本通过 `max_prepared_statements` 提供有限支持，但这会增加内存和配置复杂度。Django 6 的 PostgreSQL 后端默认把 `prepare_threshold` 设为 `None`，也是为了不和连接池冲突。
- 会话级 `SET`。`SET search_path`、`SET TIME ZONE`、`SET application_name` 只对当前连接生效，事务结束连接被归还后，下一个客户端可能继承这些设置，或者你的设置已经丢失。不要把「每个请求设置一次会话变量」当成可靠机制；需要时用事务级 `SET LOCAL`，它在事务结束时自动失效。
- 临时表、`LISTEN/NOTIFY`、会话级 advisory lock、`WITH HOLD` 游标。这些都与连接生命周期绑定，transaction 模式下不能依赖。
- 服务端游标。Django 的 `DISABLE_SERVER_SIDE_CURSORS` 在 transaction pooling 下应设为 `True`，因为服务端游标跨事务存活，而连接在事务结束时已经还回去了。

一个典型的 pgbouncer 配置片段：

```ini
[databases]
shop = host=127.0.0.1 port=5432 dbname=shop

[pgbouncer]
listen_port = 6432
pool_mode = transaction
max_client_conn = 200
default_pool_size = 20
min_pool_size = 5
reserve_pool_size = 5
server_idle_timeout = 300
server_lifetime = 1800
server_check_query = select 1
server_check_delay = 30
```

这里的 `default_pool_size = 20` 才是真正面向数据库的连接数；`max_client_conn = 200` 是面向应用的连接数。应用可以开 200 条到 pgbouncer 的连接，但同一时刻只有 20 条会真正落到 PostgreSQL。这就是「应用连接数」和「数据库连接数」解耦的地方，也是 pgbouncer 最大的价值。代价是应用侧可能排队，所以 `query_wait_timeout` 之类的等待上限要配好，不能让请求无限挂。

## MySQL：max_connections、wait_timeout 与 thread_cache_size

MySQL 默认 `max_connections = 151`。和 PostgreSQL 一样，它不是「建议值」，是硬上限。超过之后客户端收到 `ERROR 1040 (HY000): Too many connections`。MySQL 会为拥有 `CONNECTION_ADMIN` 权限的账号保留一个额外连接，避免管理员被锁在门外，但这不是给应用用的。

MySQL 的连接模型是「一个连接一个线程」。线程本身有栈，连接还有自己的会话状态、排序缓冲区、临时表空间。连接数多，线程调度和内存压力都会上升。`thread_cache_size` 的作用是缓存「已经断开但线程还没销毁」的线程，供新连接复用，减少频繁创建销毁线程的成本。它不限制同时连接数，也不解决「连接太多」的问题。把 `thread_cache_size` 调大，不会让 500 个并发连接变得更快，只会让连接断开后重建便宜一点。

`wait_timeout` 和 `interactive_timeout` 控制空闲连接多久被服务器断开。`wait_timeout` 作用于非交互连接，也就是应用连接；`interactive_timeout` 作用于交互式客户端，比如 `mysql` 命令行。两者默认都是 28800 秒，也就是 8 小时。很多应用池的 `idle_timeout` 是 10 分钟，远小于 `wait_timeout`，所以连接会在池里被主动回收，不会撞上服务器断连。反过来，如果池的 `idle_timeout` 大于 `wait_timeout`，池里就会出现「看起来还活着、实际已经被服务器杀掉」的连接。

这个不匹配的典型症状是：低峰期过后，第一批请求报 `MySQL server has gone away` 或 `Lost connection to MySQL server during query`。修法不是把 `wait_timeout` 调成无限，而是让池的 `idle_timeout` 和 `max_lifetime` 小于它，并在借出时做一次轻量校验。

MySQL 还有 `max_user_connections`，限制单个账号的连接数。多租户或一个账号被多个服务共用时，这个值会比 `max_connections` 先撞上。排查「连接数没到上限却连不上」时，要同时看这两个。

`SHOW PROCESSLIST` 能看当前连接在干什么，`Threads_connected` 是当前连接数，`Threads_running` 是正在执行查询的线程数。后者比前者更能说明压力：100 个连接里只有 2 个在跑，说明池子大部分是空闲的；100 个连接里 80 个在跑，说明数据库真的在满负荷。`Max_used_connections` 是历史峰值，用来判断「是不是曾经打满」。

## HikariCP：10 个连接为什么能服务上千 RPS

HikariCP 是 Java 生态里最常用的连接池，它的默认值值得单独说，因为很多人就是被默认值「坑」或者「救了」。

`maximumPoolSize` 默认 10，`minimumIdle` 默认与最大值相同。`connectionTimeout` 默认 30 秒，`idleTimeout` 默认 10 分钟，`maxLifetime` 默认 30 分钟，`leakDetectionThreshold` 默认 0，也就是关闭。这些默认值背后的判断是：大多数应用的数据库并发并不需要很大，10 条连接足够；瓶颈通常在查询本身，不在连接数量。

「10 个连接能服务上千 RPS」这句话经常被当成鸡汤，其实它是 Little's Law 的直接结果。如果一条查询平均 1 毫秒，一个连接在 100% 利用率下每秒能做 1000 次查询；10 个连接的理论上限是每秒 10000 次。实际当然到不了 100%，因为还有事务、锁、网络往返、应用侧处理。但只要平均查询在毫秒级，10 条连接服务几千 RPS 是有算术依据的。反过来，如果一条查询要 100 毫秒，一个连接每秒只能做 10 次，10 条连接的上限就是 100 RPS，这时候该做的不是加连接，而是优化查询。

HikariCP 的文档里给过一个经验公式，源自 PostgreSQL wiki 的 About Pool Sizing：

```text
connections = ((core_count × 2) + effective_spindle_count)
```

对一个 4 核、无独立磁盘阵列的机器，这个公式给出 9 左右，接近默认的 10。它的意思不是「10 是魔法数字」，而是「连接数应该和数据库的并行服务能力同量级，而不是和 Web 线程数同量级」。核数越多、I/O 并行度越高，可以适当增加；但增加的理由是数据库能并行，不是应用想并发。

`connectionTimeout` 是借连接的等待上限。HikariCP 默认 30 秒，很多团队会调到 2 到 5 秒，因为 30 秒的等待通常已经超过上游请求超时，等到了也没有意义。`idleTimeout` 只对 `minimumIdle` 之外的空闲连接生效，`maxLifetime` 则对所有连接生效；后者要小于数据库或网络设备的连接寿命，并加随机抖动。

`leakDetectionThreshold` 是最值得开的诊断项之一。它不阻止泄漏，但会在连接被借出超过阈值时打印一条带堆栈的日志，告诉你「这个连接是在哪里借的、借了多久没还」。生产环境可以设成「正常请求最大耗时 + 一点余量」，比如 30 秒或 60 秒。阈值太小会误报，太大就失去意义。

HikariCP 还有一个 `keepaliveTime`，定期给空闲连接发一个轻量探测，防止被防火墙或数据库断掉。它不是必需的，但在有 NAT、负载均衡、或数据库 `wait_timeout` 比较短的环境里，比「借出时才发现连接死了」更平滑。

## 连接泄漏：四种最常见的漏法

连接泄漏的定义不是「连接没关」，而是「连接被借出后，没有在所有路径上归还」。池子里 active 数只增不减，最终 `acquire_timeout` 开始报错，但数据库侧的连接数可能还没到上限，因为泄漏发生在应用侧的池里。

第一种，异常路径没有 `finally`。代码在拿到连接后做了一堆事，中间抛异常，控制流直接跳到上层，`close()` 没执行。Python 的 `with`、Java 的 try-with-resources、Go 的 `defer` 都是为了解决这个，但前提是写代码的人真的用了。手写 `conn = pool.getconn()` 再手动 `putconn()` 的代码，几乎一定会在某个分支漏掉。

第二种，流式响应。查询返回一个游标，业务边读边写 HTTP 响应，连接在响应结束前不能归还。如果客户端断开、生成器没有被正确关闭，连接就留在那里。Django 的 `StreamingHttpResponse`、SQLAlchemy 的 `stream_results`、asyncpg 的游标都有这个问题。写法上要把「读游标」放在 `with` 块里，并确保生成器被消费完或显式关闭。

第三种，ORM 懒加载。查询返回对象，关联字段在模板渲染或序列化时才触发 SQL。如果这时候连接已经被归还，ORM 会重新借一条；如果外层还持有事务或游标，连接可能被占用到渲染结束。更隐蔽的是在事务里做 N+1 查询：每一条懒加载都在同一个连接上排队，事务时间被拉长，连接被占住。这类问题表面看是「连接不够」，实际是查询次数太多。

第四种，事务没关闭。手动 `BEGIN` 之后，业务逻辑抛异常，没有 `ROLLBACK`，连接回到池里时仍然处于事务中。下一次借出时，池以为它是干净的，实际上它带着上次的锁和未提交状态。PostgreSQL 的 `idle in transaction` 状态就是这种连接；它会持有锁、阻止 vacuum，还会让后续请求看到意想不到的数据。Django 的 `transaction.atomic()` 会在异常时回滚，但如果你在 `atomic` 块里捕获了异常继续执行，事务可能已经进入「需要回滚」的状态，后续查询会报 `TransactionManagementError`。

定位泄漏，先看池的 active 数是否随时间单调上升，再看 `pending` 是否长期大于零。HikariCP 的泄漏日志会给出借出 stack；SQLAlchemy 可以挂 `checkout` 和 `checkin` 事件，记录时间戳和调用栈；Django 没有内置池指标时，可以查 PostgreSQL 的 `pg_stat_activity`，看哪些连接长期处于 `idle in transaction`，再对照应用的线程栈。

```sql
SELECT pid, usename, application_name, state,
       now() - state_change AS state_age,
       left(query, 80) AS query
FROM pg_stat_activity
WHERE datname = 'shop'
ORDER BY state_change;
```

`state = 'idle in transaction'` 且 `state_age` 很大，基本就是事务没关。`state = 'active'` 且 query 是同一条慢 SQL，说明是查询本身的问题，不是泄漏。两者要分开处理。

## 异步连接池：一条连接不能同时给两个 task

异步框架里，连接池的语义和同步不一样。同步代码里，一个线程借一条连接，用完归还，天然不会有两个执行流同时用同一条连接。异步代码里，多个 task 跑在同一个事件循环上，一个 `await` 就可能让出控制权；如果两个 task 共享同一条连接，它们的 SQL 会交错，事务边界会混在一起。

asyncpg 的写法是：

```python
import asyncpg

pool = await asyncpg.create_pool(
    dsn="postgresql://app@db/shop",
    min_size=2,
    max_size=10,
    timeout=5,
    max_inactive_connection_lifetime=300,
)

async def fetch_orders(user_id):
    async with pool.acquire() as conn:
        async with conn.transaction():
            return await conn.fetch(
                "SELECT id, amount FROM orders WHERE user_id = $1", user_id
            )
```

关键在 `async with pool.acquire()`：连接在块内只属于这个 task，块结束才归还。不要把 `conn` 存到全局变量或跨 task 传递。SQLAlchemy 的异步引擎也是同样的道理，`AsyncSession` 绑定一个连接，多个 task 共用一个 session 会出问题；每个 task 用自己的 session，session 关闭时连接归还。

异步池的大小仍然由 Little's Law 和数据库容量决定，不会因为「异步」就变大。异步的好处是等待连接时不占线程，可以把更多请求挂在池上；但这会把压力更集中地传给数据库。如果池子只有 10 条，事件循环里挂 1000 个 task 等连接，前 10 个在跑，其余 990 个在等，数据库看到的并发仍然是 10。这不是缺点，这是限流。真正危险的是「每个 task 自己开一条连接」，那会把数据库直接打穿。

还有一个细节：异步池的超时通常有两层，`pool.acquire` 的等待超时和单条查询的执行超时。前者防止请求无限等连接，后者防止一条慢查询占住连接。两层都要设，不能只设一个。只设查询超时，慢查询会把池占满；只设获取超时，慢查询会一直跑，连接一直不还。

## 故障切换后的陈旧连接

数据库做主从切换、重启、或者网络设备掐断空闲连接之后，池里会留下一批「TCP 看起来还开着，实际已经不可用」的连接。应用借到这种连接，第一次查询就报错，严重时整个服务在切换后的一段时间内持续 500。

这类问题的根因是「池不知道连接已经死了」。TCP 连接在双方没有流量时不会立刻感知对端消失，尤其是中间有 NAT 或防火墙时，映射表可能已经过期。等应用真正发查询，才发现写不出去或读不到响应。

处理办法分三层。

第一层是借出时校验。Django 的 `CONN_HEALTH_CHECKS`、HikariCP 的 `Connection.isValid()`、pgbouncer 的 `server_check_query`、SQLAlchemy 的 `pool_pre_ping`，都是在借出前做一次轻量探测。`pool_pre_ping` 会在每次 checkout 时发一条 `SELECT 1`，失败就丢弃并重建。它增加一次往返，但能挡住大部分陈旧连接。

第二层是生命周期上限。`max_lifetime` 让连接在达到寿命后被替换，避免一条连接活过两次数据库切换。寿命要加抖动，否则所有连接会在同一时刻集中重建，形成一个小高峰。

第三层是应用侧的重试。即使有校验，切换瞬间仍可能借到一条刚失效的连接。对于幂等的读操作，捕获「连接类错误」后重试一次是合理的；对于写操作，重试必须配合幂等键，不能盲目重放。重试策略要有上限、有退避、只对可重试错误生效。

需要区分「连接错误」和「业务错误」。`OperationalError`、`InterfaceError`、`ConnectionResetError` 通常可以重试；`IntegrityError`、`DataError` 重试也没用。把所有异常都重试一遍，会把一个确定性的 bug 放大成多次副作用。

## 观测：active、idle、pending 与等待时间

连接池的指标不多，但每一个都要看得懂。

`active` 是当前被借出的连接数。它接近 `max_size` 且持续不降，说明池子不够或者连接被长时间占用。`idle` 是空闲连接数。它长期等于 `max_size`，说明池子开得太大，白白占着数据库槽位。`pending` 是等待借连接的请求数。它大于零，说明应用侧已经在排队，这才是「池子不够」的直接证据。`pending` 长期为零、`active` 却很高，问题不在池子大小，在连接持有时间。

获取连接的等待时间要做成直方图，不只看平均值。P99 等待时间突然上升，通常比「连接数打满」更早暴露问题。`acquire_timeout` 的次数要单独计数：它代表「已经等不及了」的请求，不是普通错误。

数据库侧要看的指标不同。PostgreSQL 看 `pg_stat_activity` 里的连接状态分布：`active`、`idle`、`idle in transaction`。`idle in transaction` 多，说明事务没关；`active` 多且 query 是慢 SQL，说明查询本身有问题；`idle` 多，说明池子里的连接在空转。pgbouncer 用 `SHOW POOLS` 看每个池的 `cl_active`、`cl_waiting`、`sv_active`、`sv_idle`，用 `SHOW STATS` 看请求数和等待时间。

MySQL 看 `Threads_connected`、`Threads_running`、`Max_used_connections`、`Aborted_connects`。`Threads_running` 高而 `Threads_connected` 不高，说明连接在满负荷跑；`Aborted_connects` 高，说明连接在建立阶段就失败，可能是认证、网络或 `max_connections` 的问题。

HikariCP 通过 Micrometer 暴露 `hikaricp_connections_active`、`hikaricp_connections_idle`、`hikaricp_connections_pending`、`hikaricp_connections_acquire`、`hikaricp_connections_timeout` 等指标。Django 的 psycopg 池可以读 `pool.get_stats()`，但更常见的是把 `pg_stat_activity` 和应用侧的超时计数拼起来看。

告警阈值不要只看绝对值。连接数 100 在 A 服务是灾难，在 B 服务可能只是正常水位。更有意义的告警是「active 持续 5 分钟超过池大小的 80%」「pending 持续 1 分钟大于 0」「acquire 超时率超过某个比例」「idle in transaction 超过 10 个」。这些指标对应的是「池子正在排队」「事务没关」这些具体故障，而不是一个孤立的数字。

## 小结

回到开头那个问题：为什么 100 个连接比 20 个更慢？因为 20 个连接时，数据库还有余量，每个查询很快，连接周转也快；100 个连接时，数据库的 CPU、锁、共享缓冲区被同时争抢，每个查询变慢，连接被占得更久，应用侧开始等连接，数据库侧开始等 CPU。池子变大没有创造新的处理能力，只是把排队位置从应用挪到了数据库。

可以压缩成四句话：

- 连接的贵不在 TCP，而在服务端执行单元、认证、会话状态和数据库连接槽位。
- 需要多少并发用 Little's Law 算：峰值 QPS 乘以查询耗时；能承受多少并发由数据库容量决定，取小的那个。
- 池参数先保证不压垮数据库，再保证请求不无限等待，最后才优化冷启动和回收。
- 应用连接数和数据库连接数是两笔账；Django 的 `workers × 线程数`、pgbouncer 的 `max_client_conn` 与 `default_pool_size`、MySQL 的 `max_connections` 与 `max_user_connections`，都要分别对账。

最后一句：调大连接池之前，先看 `pending` 是不是真的在涨、单条查询是不是真的在变慢。如果 `pending` 为零，池子不是瓶颈；如果单条查询在变慢，加连接只会让它更慢。先修查询，再调池子。

## 相关阅读

- [索引建了，为什么排序还是没用上？——慢查询实战](/article/django-slow-query-index-tuning/)
- [从 21 条 SQL 到 2 条：三次 N+1 查询围剿实录](/article/django-n1-query-kill/)
- [下游只抖了 3 秒，我的服务被拖死 5 秒——超时、重试、熔断、降级实战](/article/resilience-timeout-retry-circuit-breaker-deep-dive/)
- [事务回滚了，邮件照样发出去——Django 事务深水区](/article/django-transaction-atomic-on-commit/)
