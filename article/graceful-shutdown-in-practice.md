---
title: "优雅停机：别在 SIGTERM 那一刻丢掉请求"
slug: graceful-shutdown-in-practice
cover_image: /photos/graceful-shutdown-in-practice-cover.png
date: 2026-11-04
tags: ["后端", "部署", "Kubernetes", "可靠性"]
---

> 适用读者：发版时见过 502 尖刺、但说不清是谁返回的后端工程师；正在把服务搬上 Kubernetes、发现滚动更新总会丢几条消息的人；被"定时任务跑了两遍"坑过一次的运维
> 结论先行：优雅停机不是一个开关，而是一条有时间顺序的排水流程——先让调度系统把流量摘走，再停止接受新连接，再关掉空闲的长连接，再等在途请求结束，最后才退出。这条链上任何一环缺失，SIGTERM 就只是"提前通知你要丢请求了"。SIGKILL 没有优雅可言，它连"通知"都不给。
> 阅读时间：约 28 分钟 | 难度：中级到高级 | 收获：信号的真实语义与 PID 1 的坑、HTTP/后台任务/数据库/定时任务四类停机的正确顺序、Gunicorn 与 uvicorn 三个时间参数的配合、一份可以照着写的 Python 停机骨架，以及两个能证伪自己的验证脚本

**目录**

- 前言：三次停机，三次丢数据
- 信号语义：SIGTERM、SIGINT 与 SIGKILL
- PID 1、exec form 与信号转发
- HTTP 服务停机的正确顺序
- Gunicorn 与 uvicorn：三个时间参数怎么配合
- Kubernetes 的终止窗口与 preStop
- 网关、负载均衡与长连接 draining
- 后台任务：Celery 的 warm shutdown 与 ack 语义
- 数据库：连接池、事务与迁移的顺序
- 定时任务：锁、租约与滚动更新的双跑
- Python 实现：signal handler、asyncio 与超时兜底
- 怎么验证：慢请求与半条消息
- 小结
- 相关阅读

## 前言：三次停机，三次丢数据

先摆三个场景。它们看起来是三个不同的问题，其实是同一个问题的三个面。

**第一个：滚动更新时的 502 尖刺。**一次常规发版，五个副本挨个重启。监控上错误率曲线在每次重启的位置各起一个小尖，持续十几秒。用户侧表现为"偶尔刷不出来，再刷一下就好"。查日志，网关返回 502，上游连接被重置；应用日志里没有任何异常，因为它收到 SIGTERM 之后就直接退出了，退出前那几十个正在处理的请求随着进程一起消失。没有异常栈，因为进程没来得及写。

**第二个：消费者收到一半消息就退出。**一个处理图片的任务队列，worker 收到 SIGTERM，进程退出时正在处理的那条消息已经从队列里取走并 ack 了。重启之后那条消息不会再来，用户的上传永远停在"处理中"。队列的监控显示"没有积压"，因为从队列的角度看，这条消息确实被成功消费了。

**第三个：定时任务两台机器同时跑。**发版期间新旧两个副本短暂共存，两边的定时调度器都在 02:00 触发了同一个对账任务。结果同一批订单被结算了两次。事后查代码，任务本身没有幂等；查部署，没有任何机制保证"同一时刻只有一个实例在跑"。

三个场景的共同点不是"代码写错了"，而是**没有人告诉进程"该停下来了，而且停的时候要按顺序来"**。进程退出这件事，被当成了一个瞬间动作；实际上它是一个持续几秒到几十秒的过程，中间有明确的阶段，每个阶段都有该做和不该做的事。

这篇文章按阶段拆开讲：信号怎么传、谁在接收、HTTP 怎么排水、队列怎么不丢、数据库怎么收尾、定时任务怎么不双跑，最后给出可以跑的代码和可以证伪的验证方法。

## 信号语义：SIGTERM、SIGINT 与 SIGKILL

先把三个信号的区别说死，因为后面所有的设计都建立在这个语义上。

| 信号 | 编号 | 能否捕获 | 默认行为 | 典型来源 |
| --- | --- | --- | --- | --- |
| `SIGTERM` | 15 | 能 | 终止进程 | `docker stop`、`kubectl delete pod`、systemd、运维脚本 |
| `SIGINT` | 2 | 能 | 终止进程 | 终端 `Ctrl+C` |
| `SIGKILL` | 9 | 不能 | 立即杀死，不可拦截 | `kill -9`、超出宽限期后的强制终止、OOM killer |

关键差别只有一句话：**`SIGTERM` 是一个请求，`SIGKILL` 是一个判决。**

`SIGTERM` 的语义是"请你终止"，它交给你一个 handler，你可以在里面做清理、等待、落盘。你可以选择忽略它——但这是坏主意，因为发信号的人通常会在一段宽限期后补一个 `SIGKILL`。`SIGKILL` 由内核直接执行，进程没有机会运行任何代码：不能 flush 缓冲、不能提交事务、不能 ack 消息、不能写"我正在退出"的日志。它连 `atexit` 都不会触发。

由此推出第一条工程结论：**任何依赖"退出时清理"的逻辑，都必须能在 `SIGTERM` 到达后的有限时间内完成。**因为宽限期是有限的，超时就是 `SIGKILL`。你的清理逻辑跑得比宽限期长，等于没写。

`SIGINT` 和 `SIGTERM` 在语义上几乎一样（都是可捕获的终止请求），区别只在来源：前者是终端的键盘中断，后者是系统级的终止请求。很多框架把两者都映射到同一个"优雅退出"路径，这是合理的。但要注意：在容器里，`SIGINT` 通常不会出现，因为没有人按 `Ctrl+C`；真正要处理的是 `SIGTERM`。

还有一个常被忽略的事实：**信号是异步的，handler 会在任意一条字节码边界插入执行。**这意味着 handler 里不能做复杂的事——不能分配大对象、不能拿可能已被持有的锁、不能调用非异步安全的函数。Python 的 `signal` 模块文档说得很清楚：handler 在 Python 层面执行，但它打断的是主线程的解释器循环。所以 handler 的正确写法是"只设置一个标志，让主循环去处理"，而不是"在 handler 里开始关闭数据库连接池"。

```python
import signal
import threading

shutdown_event = threading.Event()

def on_signal(signum, frame):
    # 只做一件事：置标志。真正的清理在主循环里做。
    shutdown_event.set()

signal.signal(signal.SIGTERM, on_signal)
signal.signal(signal.SIGINT, on_signal)
```

为什么不在 handler 里直接清理？两个原因。第一，清理可能阻塞（等待在途请求、关闭连接池），而 handler 阻塞会推迟后续信号的响应，也会让主线程卡在一个不可预期的位置。第二，清理代码若抛异常，异常会在一个奇怪的栈帧里冒出来，很难排查。**把 handler 缩到最小，是所有语言里通用的做法。**

## PID 1、exec form 与信号转发

这一段是容器部署里最常见的"信号根本没送到"的根源。

Linux 内核有一条特殊规则：**PID 1 对"没有安装 handler 的信号"不做默认动作。**普通进程收到 `SIGTERM` 且没有 handler 时会按默认行为终止；PID 1 不会。它必须自己安装 handler，否则这个信号会被静默忽略。

于是有两种完全不同的结局：

- 你的应用是 PID 1，且安装了 `SIGTERM` handler → 它能收到通知，走优雅退出。
- 你的应用是 PID 1，但没有安装 handler → `SIGTERM` 被忽略，进程一直跑到宽限期结束，被 `SIGKILL` 打死。表现是"每次发版都等满 30 秒，然后连接被重置"。

更常见的是第三种：**应用不是 PID 1，中间隔了一个 shell。**

Dockerfile 有两种写法：

```dockerfile
# shell form：/bin/sh -c "gunicorn app:app" 成为 PID 1
CMD gunicorn app:app

# exec form：gunicorn 直接成为 PID 1
CMD ["gunicorn", "app:app"]
```

shell form 下，`/bin/sh` 是 PID 1，`gunicorn` 是它的子进程。`docker stop` 把 `SIGTERM` 发给 PID 1，也就是那个 shell。**shell 会不会转发给子进程，取决于具体实现**：有的 shell 在 `-c` 且只有一条命令时会 `exec` 替换自身（这时反而没问题），有的会 fork 后等待，收到信号后自己不转发也不退出。结果就是 `SIGTERM` 停在 shell 那里，gunicorn 完全不知道要停机。

这条链在 Kubernetes 里还多一层：kubelet → 容器运行时 → 容器内的 PID 1。每一层都只把信号交给 PID 1，不会遍历进程树。

顺便把"进程组"说清楚。shell 启动子进程时会把它们放进同一个进程组，`kill -TERM -<pgid>`（注意那个负号）会把信号发给组内所有进程；而 `docker stop` 和 kubelet 只发给 PID 1，不遍历组。这就是为什么本地开发时 `Ctrl+C` 看起来"全都退了"——终端把 `SIGINT` 发给整个前台进程组；而容器里的同一个程序可能只退了一半。**别把本地经验搬到线上。**所以要做到三件事：

- 用 exec form，让应用直接当 PID 1。
- 如果必须用 shell（比如要在启动前做变量替换），用 `exec` 显式替换：`CMD ["sh", "-c", "exec gunicorn app:app"]`。
- 如果应用是 PID 1 但自身不处理信号，加一个极小的 init 进程（比如 `tini`）作为 PID 1，它负责转发信号和回收僵尸进程。`docker run --init` 就是启用它。

还有一个容易忽略的点：**PID 1 还要负责回收僵尸进程。**如果容器里有子进程（比如 gunicorn 的 worker、Celery 的子任务），父进程退出后没人 `wait`，它们就变成僵尸，占用进程表项。tini 这类 init 同时解决信号转发和僵尸回收两个问题，这也是 Kubernetes 文档建议在容器里用 init 进程的原因。

排查方法很直接：进容器看 PID 1 是谁。

```bash
docker exec -it <container> ps -o pid,ppid,cmd -p 1
kubectl exec -it <pod> -- cat /proc/1/comm
```

如果输出的不是你的应用名，信号八成到不了它手里。

## HTTP 服务停机的正确顺序

HTTP 服务的停机是一条流水线，顺序错了，前面所有努力都会白费。正确顺序是五步：

1. **先摘流量**：让健康检查失败，把本实例从负载均衡的可用后端列表里移除。
2. **停止接受新连接**：关闭监听 socket，或者让 accept 循环退出。
3. **关闭空闲的 keep-alive 连接**：这些连接上没有在途请求，但它们还占着客户端的连接池，不关掉会让客户端继续往这个正在退出的实例上发请求。
4. **等待在途请求完成**：已经在处理的请求必须跑完，并且把响应完整写回。
5. **超时后强制退出**：如果等不完，就在宽限期内主动退出，而不是等别人 `SIGKILL`。

**第一步为什么必须最先做？**因为"摘流量"是唯一一个依赖外部系统的动作，它需要时间传播。你把 readiness 置为失败之后，Service 的 endpoints 更新、kube-proxy 或 ingress 感知、客户端连接池刷新，这一圈走完可能是几秒到几十秒。在这段时间里，仍然会有新请求打到这个实例上。如果你先停监听、后摘流量，那些打进来的请求会直接连接失败——这就是 502 的来源。

**第三步为什么容易被漏掉？**因为 keep-alive 让"连接"和"请求"解耦了。一个连接上可能刚刚完成一个请求，正处于空闲等待状态，客户端认为它可用，下一个请求还会走这条连接。如果你只等在途请求，然后直接退出，那条空闲连接会被 RST，客户端看到的是"连接被重置"，重试之后才成功。用户感知是一次抖动，监控上是一次 5xx 或超时。

处理方式有两种：

- 主动关闭空闲连接。关闭时最好先发一个 `Connection: close` 响应头（如果还有机会写响应），让客户端知道不要再复用。
- 更简单也更稳的做法：**在停机开始时，对所有新响应加上 `Connection: close`。**这样客户端处理完当前请求就会关掉连接，不会再有新的请求复用进来。等一小段时间，空闲连接自然清空。

**第四步的"等待"要有上限。**没有上限的等待等于把自己交给客户端——一个卡住的请求可以让进程永远不退出，最后被 `SIGKILL`，连带其他已经完成的请求一起丢掉。上限应该小于外部宽限期，留出余量给"退出前的收尾"。

一个具体的骨架：

```python
import asyncio

class HttpServer:
    def __init__(self, app):
        self.app = app
        self.draining = False
        self.inflight = 0
        self.idle = asyncio.Event()
        self.idle.set()

    async def handle(self, reader, writer):
        if self.draining:
            writer.write(b"HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\n\r\n")
            await writer.drain()
            writer.close()
            return
        self.inflight += 1
        self.idle.clear()
        try:
            await self.serve_one(reader, writer)
        finally:
            self.inflight -= 1
            if self.inflight == 0:
                self.idle.set()

    async def drain(self, timeout: float):
        self.draining = True
        await self.close_listener()
        try:
            await asyncio.wait_for(self.idle.wait(), timeout)
        except asyncio.TimeoutError:
            pass
```

这段代码里的顺序和上面的五步是对应的：先置 `draining`（配合健康检查实现第一步），再关监听，再等在途归零，最后带超时返回。注意 `draining` 判断在 `handle` 的最前面——它同时挡住了那些"已经建立了连接但还没发请求"的客户端。

## Gunicorn 与 uvicorn：三个时间参数怎么配合

框架层面的停机行为，最终都落到几个时间参数上。这几个参数名字相似、语义不同，混用是事故的常见来源。

**Gunicorn 的 `timeout`** 是"worker 多久没有响应就被杀掉"，默认 30 秒。它的作用对象是**正常运行期间**的 worker：一个 sync worker 处理一个 40 秒的请求，30 秒时 master 认为它卡死了，直接 `SIGKILL`。这就是很多人遇到的"为什么我的长请求总在 30 秒断掉"。Gunicorn docs 把它定义为 worker 静默超时，不是停机参数。

**Gunicorn 的 `graceful_timeout`** 才是停机参数：master 向 worker 发 `SIGTERM` 后，等这么久还没退出就 `SIGKILL`，默认 30 秒。它约束的是"排水阶段"。

**Gunicorn 的 `max_requests` / `max_requests_jitter`** 控制 worker 的定期重启。每次重启都是一次小规模的优雅停机，所以 `graceful_timeout` 也约束它。`jitter` 的作用是打散重启时间，避免所有 worker 同时进入排水。

配置上的关系是：

```python
# gunicorn.conf.py
timeout = 120            # 必须大于你最慢的正常请求
graceful_timeout = 30    # 排水窗口，要小于外部宽限期
keepalive = 5            # 空闲 keep-alive 连接的存活时间
max_requests = 2000
max_requests_jitter = 200
workers = 4
```

三个约束必须同时满足，否则总有一个环节先断：

```
最慢请求耗时 < timeout
排水窗口 graceful_timeout < 容器宽限期 terminationGracePeriodSeconds
keepalive < graceful_timeout（否则空闲连接还没自然过期，进程就退出了）
```

第三条最容易被忽略。`keepalive` 是 Gunicorn 保留空闲连接的时间，如果它是 5 秒，而 `graceful_timeout` 是 30 秒，排水阶段有足够时间让空闲连接自然关闭；反过来，`keepalive=75` 配 `graceful_timeout=30`，排水时那些连接还活着，进程退出时它们就被硬断。

**uvicorn 的参数是 `--timeout-graceful-shutdown`**，语义是"等待正在处理的连接与任务结束的最长时间"。它的默认值是不设上限（等待自然结束），这在容器里很危险：一个卡住的连接会让进程一直不退，最后被 `SIGKILL`。所以生产上应该显式设一个值，并且让它小于 Kubernetes 的宽限期。

uvicorn 收到 `SIGTERM` 后的动作顺序，和上一节那五步基本一致：停止接受新连接、等待现有连接关闭、触发 lifespan 的 shutdown、退出。它对 WebSocket 的处理是等连接自己关闭——如果你的 WebSocket 是长活连接，必须自己实现"收到停机信号后主动发 close 帧"，否则 uvicorn 只能等到超时。

**Django 的 ASGI lifespan** 这里要特别小心。很多人以为在 `AppConfig.ready()` 里注册的清理函数一定会在停机时被调用，实际上不一定：`ready()` 是启动钩子，不是关机钩子；Django 的 ASGI handler 在较长一段时间里并没有完整实现 lifespan 协议，社区要用 `django-asgi-lifespan` 这类包来补上 shutdown 回调。所以正确的做法是**不依赖框架的钩子**：

- 用 `signal` handler 作为唯一可靠的入口（它一定被调用，只要信号送达）。
- 把清理逻辑写成幂等的函数，`signal` handler、lifespan shutdown、`atexit` 都可以调用它，重复调用无副作用。
- 不要假设"进程退出时 Django 会帮你关连接池"——显式关。

这一点在 Gunicorn + UvicornWorker 的组合下更明显：停机信号由 Gunicorn 的 master 发出，worker 进程收到后走 uvicorn 的路径，Django 的 lifespan 是否参与取决于 worker 实现。**依赖越少，停机越可控。**

## Kubernetes 的终止窗口与 preStop

Kubernetes 的终止流程有一个明确的时间轴，理解它才能知道每个参数在约束什么。

当 Pod 被删除（滚动更新、缩容、`kubectl delete`），kubelet 做这几件事：

1. 把 Pod 标记为 Terminating。
2. 同时开始从 Service 的 Endpoints 中移除这个 Pod（这一步是异步的，由 endpoints controller 处理）。
3. 执行 `preStop` hook（如果配置了）。**它在 `SIGTERM` 之前执行，并且是同步阻塞的。**
4. 向容器内的 PID 1 发送 `SIGTERM`。
5. 等待 `terminationGracePeriodSeconds`（默认 30 秒，从进入 Terminating 开始计时，包含 preStop 的时间）。
6. 超时后发送 `SIGKILL`。

两个关键事实：

- **`terminationGracePeriodSeconds` 是整个窗口，不是"发完 SIGTERM 后再等这么久"。**preStop 花掉的时间要从里面扣。如果 preStop sleep 20 秒，宽限期 30 秒，那应用只剩 10 秒排水。
- **endpoint 移除与 SIGTERM 几乎同时发生，但传播不同步。**kubelet 发出 SIGTERM 的瞬间，iptables 规则、ingress 的 upstream 列表、客户端连接池可能都还没更新。

这就是 `preStop` 里那个 sleep 的来源。它常被嘲笑为"用 sleep 掩盖问题"，但它解决的是一个真实的时间差：**在应用开始拒绝新请求之前，先给流量调度系统一点时间把你的地址摘掉。**

```yaml
spec:
  terminationGracePeriodSeconds: 45
  containers:
    - name: api
      image: registry.example.com/article-api:2026.11.04
      lifecycle:
        preStop:
          exec:
            command: ["sh", "-c", "sleep 10"]
      readinessProbe:
        httpGet:
          path: /healthz/ready
          port: 8000
        periodSeconds: 5
        failureThreshold: 2
```

三个数字的关系应该是：

```
preStop sleep + 应用排水时间 ≤ terminationGracePeriodSeconds
terminationGracePeriodSeconds ≤ 网关的连接超时 + 重试窗口
```

第一行是硬约束。第二行的意思是：如果一个请求在客户端看来允许重试 3 次、每次超时 30 秒，那你的宽限期不该短到让客户端还在重试时后端已经换了一茬。

`readinessProbe` 的配置也有讲究。它需要**先失败**，才能让 endpoint 被摘掉。默认 `periodSeconds: 10`、`failureThreshold: 3`，意味着最长要 30 秒才判定不健康——这比很多人的宽限期还长。所以要么把探测调密（5 秒一次、2 次失败），要么用 preStop 的 sleep 覆盖这段传播时间，两者配合。

一个更主动的做法是**让应用自己先失败**：收到 `SIGTERM` 后立刻把 `/healthz/ready` 的返回改成 503，同时继续服务在途请求。这样即使 preStop 没配、探测间隔很长，只要有一次探测踩到，endpoint 就会被摘。代价是"摘流量"依赖探测周期，最坏情况仍要等一个周期。

还有一个反向的坑：**不要把 `terminationGracePeriodSeconds` 设得很大。**它只影响"这个 Pod 多久才真正消失"，不影响应用行为。设成 300 秒，一次卡住的发版会挂 5 分钟，而且 `kubectl rollout status` 会一直等。合理值是"最长请求耗时 + 排水余量 + 一点缓冲"，通常 30 到 60 秒。

## 网关、负载均衡与长连接 draining

应用侧做完了，还要看它前面那一层。因为"客户端看到的连接"往往终止在网关，而不是你的进程。

**连接 draining 的基本动作**是：从可用后端列表里移除目标 → 停止向它转发新请求 → 等待它上面的在途请求结束 → 关闭连接。不同实现的参数名不一样，但语义一致：

- Nginx 的 upstream 没有内建的"优雅摘除"，通常靠改配置 + `nginx -s reload`，配合 `keepalive_timeout` 让空闲连接自然过期。
- AWS ALB 有 target deregistration delay（默认若干秒），实例从目标组摘除后，ALB 会在这段时间内继续把已建立的连接上的请求转发完。
- Kubernetes 的 Service 依赖 endpoint 更新，传播延迟取决于 kube-proxy 的同步周期和 ingress controller 的 watch 实现。

Nginx 这一侧有两个参数值得明确：

```nginx
upstream article_api {
    server 10.0.1.11:8000;
    server 10.0.1.12:8000;
    keepalive 32;
    keepalive_timeout 60s;
}

server {
    location /api/ {
        proxy_pass http://article_api;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_read_timeout 60s;
    }
}
```

`keepalive` 是 Nginx 到上游的空闲连接池大小，`keepalive_timeout` 是这些空闲连接保留多久。**这两个值决定了"应用退出后，网关还会不会拿着旧连接去发请求"**。如果它们大于应用的排水时间，网关会在应用已经关闭监听之后继续复用旧连接，得到 connection reset，然后返回 502 给客户端。所以要么让网关的空闲连接短于排水窗口，要么在应用侧对旧连接发 `Connection: close`。

**WebSocket 是另一个问题，不能靠"等在途请求"解决。**一个 WebSocket 连接可能持续几小时，它不是"在途请求"，它是"长活连接"。停机的正确处理是：

1. 停止接受新的升级请求。
2. 对现有连接发送 close 帧（标准关闭码 1001 "going away" 表示服务端要下线）。
3. 等客户端回应 close，或者等一个短超时后强制关闭。
4. 如果业务需要，让客户端重连到其他实例——这要求客户端有重连逻辑和退避。

关键点是**不能让连接无声地断掉**。直接断 TCP，客户端看到的是异常关闭，很多前端库会把它当成网络故障，进入一个不确定的重试状态；发 close 帧，客户端能区分"服务端主动让我走"，可以立刻重连而不用退避很久。

长轮询（long polling）的接口也要单独处理：一个请求可能挂 25 秒等数据。它属于"在途请求"，但它的耗时远大于普通请求。**要么在停机时立刻返回一个"请重试"的响应，要么把它纳入排水窗口的上限计算。**否则排水窗口会被这一个请求撑满，最后超时。

## 后台任务：Celery 的 warm shutdown 与 ack 语义

后台任务的停机比 HTTP 更难，因为它没有"客户端"来告诉你"这个请求已经完成"。它的状态在队列里，而队列的语义由 ack 时机决定。

Celery 对信号的处理是明确的：

- `SIGTERM` → **warm shutdown**：worker 不再接收新任务，把正在执行的任务跑完，然后退出。
- `SIGQUIT`（或再次收到终止信号）→ **cold shutdown**：立刻终止正在执行的任务。

所以"用 `kill -9` 杀 worker"是最坏的选择：它跳过 warm shutdown，正在跑的任务被硬切，而且如果 ack 已经发出，那条消息就永久消失。

消息会不会丢，取决于 `task_acks_late`：

```python
app.conf.task_acks_late = True
app.conf.task_reject_on_worker_lost = True
app.conf.worker_prefetch_multiplier = 1
```

- `task_acks_late = False`（默认）：worker 收到消息就 ack。之后无论任务成功、失败还是进程被杀，消息都不会重投。**停机时正在跑的那条消息，会随进程一起消失。**
- `task_acks_late = True`：任务执行完才 ack。进程被杀时消息没有 ack，broker 会在连接断开后把它重新投递。代价是**同一个任务可能被执行两次**——一次是进程被杀前跑到一半的那次，一次是重投之后的那次。
- `worker_prefetch_multiplier = 1`：减少预取。默认预取是 `multiplier × concurrency`，意味着 worker 手里攥着一批还没开始的消息；进程退出时这些消息要等连接断开才会被重投，重投延迟更长，而且顺序可能乱。

所以"优雅停机"在队列世界里的完整答案是三个条件同时成立：

```
acks_late = True            消息不丢
任务幂等                    重投不产生副作用
warm shutdown 有足够时间     在途任务能跑完，减少重投次数
```

第一条和第二条必须成对出现。只开 `acks_late` 不开幂等，是把"丢消息"换成了"重复执行"——对于扣款、发券、发邮件这类操作，重复执行可能比丢失更糟。

Redis 作为 broker 时还有一个隐蔽的参数：`visibility_timeout`（默认 3600 秒）。它的语义是"消息被取走后，超过这么久还没 ack，就认为消费者死了，重新投递"。如果一个任务跑了 70 分钟，它会在第 60 分钟被重投给另一个 worker，于是**同一个任务同时在两个 worker 上跑**。这不是停机问题，但它和停机问题长得一模一样，都是"一条消息被处理了两次"。所以任务的最长执行时间必须小于 `visibility_timeout`，或者显式调大它。

停机窗口的计算也要跟着改：

```
warm shutdown 窗口 ≥ 单个任务的最长执行时间
容器宽限期 ≥ warm shutdown 窗口 + 收尾时间
```

如果单个任务可能跑 5 分钟，而容器宽限期是 30 秒，那 warm shutdown 永远等不到任务结束，最后还是 `SIGKILL`。这种场景的正确做法不是在停机时硬等，而是**把任务拆小**，或者让任务支持"检查点续跑"：停机时保存进度，重投后从断点继续。停机时间不应该成为任务粒度的约束。

## 数据库：连接池、事务与迁移的顺序

应用退出前，数据库这一侧有三件事要按顺序做完：停止发起新事务、等待在途事务提交、关闭连接池。

顺序反了会怎样？如果在还有事务在跑的时候关闭连接池，那个事务的连接被强制断开，数据库侧看到的是客户端异常断开，未提交的修改回滚。用户看到的是"操作失败"，而实际数据没有变化——这种不一致比直接报错更难排查。

Python 侧的骨架：

```python
async def close_database(pool, timeout: float):
    # 1. 先停止新的取连接请求
    pool.stop_accepting()
    # 2. 等待借出的连接归还，最多等 timeout
    await pool.wait_idle(timeout)
    # 3. 逐个关闭，Django 里是 connections.close_all()
    await pool.close()
```

Django 的对应做法是 `django.db.connections.close_all()`。注意 `CONN_MAX_AGE` 只控制连接复用时长，不负责停机关闭；连接最终还是要在进程退出前显式关掉，否则数据库侧要等到 TCP 超时才发现对端没了，这段时间里连接数一直占着。

**事务的边界要用 `atomic` 明确。**一个请求里如果有多个 `atomic` 块，停机时可能停在两个块之间——前一个已提交，后一个没开始。这在业务上通常是可接受的（每个块是独立的业务动作），但如果你假设"整个请求要么全成要么全败"，那这个假设在停机场景下不成立。**停机不会给你额外的事务保证，它只会让"部分完成"更容易发生。**

**迁移与停机的顺序**是另一条独立的规则，和优雅停机配合，但不属于它：

1. 迁移必须先于新代码上线，且必须是**向后兼容**的（加列、加索引、加表；不删列、不改类型、不改语义）。
2. 新旧代码共存期间，两边都要能读写同一份 schema——这叫 expand-contract：先扩展（加新结构），等所有实例都切到新代码，再收缩（删旧结构）。
3. 删列、改类型这类破坏性操作，要放在**下一个**发版周期，且确认旧代码已经完全下线。
4. 迁移本身不要在滚动更新中间跑。用独立的 Job，在更新开始前完成。

如果顺序反了——新代码先上、迁移后跑——新代码会访问不存在的列，报错；如果迁移先跑但删了旧列，旧副本还在读那一列，同样报错。**滚动更新的本质是"两个版本的代码同时存在"，任何 schema 变更都必须对两个版本都成立。**

另外，停机时如果有长事务在跑（比如一个批量更新），它会拖住排水。数据库侧可以设 `statement_timeout` 或 `idle_in_transaction_session_timeout` 作为兜底，避免一个卡住的事务让进程永远等不到连接归还。

## 定时任务：锁、租约与滚动更新的双跑

定时任务的问题不在停机本身，而在**停机期间"同一时刻有两个实例"**。滚动更新时，新旧副本会共存几十秒；如果定时器在每一台机器上都跑，这段时间里同一个任务可能被触发两次。

三种解决方式，从弱到强：

**第一种：让任务幂等。**这是最基本的要求，也是唯一不依赖外部协调的方案。对账任务按"日期 + 批次"做唯一键，重复执行时第二次直接跳过或者覆盖写。幂等不能解决"两次都产生副作用"的情况（比如两次都发了一封邮件），只能解决"两次写同一份结果"。

**第二种：分布式锁。**Redis 的 `SET key value NX PX ttl` 是最常用的形式：

```python
import redis, uuid

def acquire_lock(conn, name, ttl_ms):
    token = uuid.uuid4().hex
    ok = conn.set(f"lock:{name}", token, nx=True, px=ttl_ms)
    return token if ok else None
```

三个细节不能省：

- **锁要带过期时间**，否则持锁进程崩了，锁永远不释放。
- **释放要校验 token**，用 Lua 脚本做"比较后删除"，避免删掉别人的锁（自己的锁已过期、别人又拿到了）。
- **过期时间要大于任务最长执行时间**，否则任务还在跑，锁已经过期，第二个实例就能进来。任务可能超时的话，要有续租机制（看门狗）。

分布式锁有一个根本限制：它依赖 Redis 的可用性，而 Redis 主从切换时可能丢锁。对"绝对不能双跑"的任务（比如资金结算），单靠 Redis 锁不够，需要数据库唯一约束或状态机做最后一道防线。

**第三种：租约（lease）。**在数据库里维护一张"任务租约表"，字段是 `task_name`、`owner`、`expires_at`。抢租约用一条带条件的 `UPDATE`：

```sql
UPDATE task_lease
SET owner = 'pod-a', expires_at = NOW() + INTERVAL '5 minutes'
WHERE task_name = 'daily_reconcile'
  AND expires_at < NOW()
RETURNING owner;
```

返回行就说明抢到了，没返回就说明别人还在持有。租约的好处是它和业务数据在同一个事务里，不需要额外组件；坏处是要自己处理续租和时钟。

**Kubernetes 的 CronJob 有一个专门的参数**：`concurrencyPolicy: Forbid`。它保证同一个 CronJob 不会并发执行——上一次没结束时，这一次直接跳过（不是排队）。这能解决"同一个 Job 的两次调度重叠"，但解决不了"两个不同来源的调度器同时触发"。如果你的定时任务是从应用进程里起的（比如 APScheduler 跑在每个副本里），`concurrencyPolicy` 完全管不到，必须用锁或租约。

顺带说一个常见的错误做法：**"只在某一个副本上启用定时任务"**，靠环境变量区分。这在一开始有效，但那个副本一旦重启到另一台机器，或者副本数变化，标记就错了。而且滚动更新时，新旧副本的标记可能同时为真。**用锁，不要用"谁是主"的静态假设。**

## Python 实现：signal handler、asyncio 与超时兜底

把前面几节的约束拼成一个可以照着写的骨架。它要满足四个条件：handler 只置标志、清理逻辑幂等、有总超时、超时后能真正退出。

```python
import asyncio
import logging
import os
import signal

log = logging.getLogger(__name__)

class GracefulShutdown:
    def __init__(self, app, drain_timeout: float = 20.0, hard_timeout: float = 25.0):
        self.app = app
        self.drain_timeout = drain_timeout
        self.hard_timeout = hard_timeout
        self.stop = asyncio.Event()

    def install(self):
        loop = asyncio.get_running_loop()
        for sig in (signal.SIGTERM, signal.SIGINT):
            loop.add_signal_handler(sig, self.stop.set)

    async def run(self):
        self.install()
        server = await self.app.start()
        await self.stop.wait()
        log.info("shutdown requested, draining")

        # 第一阶段：先让健康检查失败，再停止接受新连接
        self.app.readiness = False
        await server.stop_accepting()
        await asyncio.sleep(0)   # 让出一次，给正在 accept 的连接一个边界

        # 第二阶段：等在途请求，最多 drain_timeout
        try:
            await asyncio.wait_for(server.wait_idle(), self.drain_timeout)
        except asyncio.TimeoutError:
            log.warning("drain timeout, %d requests still in flight", server.inflight)

        # 第三阶段：关闭连接池、消息通道等资源
        await self.app.close_resources()

    def force_exit_after(self):
        # 最后一道防线：宽限期之前主动退出，避免被 SIGKILL
        loop = asyncio.get_running_loop()
        loop.call_later(self.hard_timeout, self._hard_exit)

    def _hard_exit(self):
        log.error("hard timeout reached, exiting now")
        logging.shutdown()
        os._exit(1)
```

几个设计点的取舍：

- **`loop.add_signal_handler` 比 `signal.signal` 更适合 asyncio。**前者把信号回调排进事件循环，回调在循环线程里执行，可以直接 `set()` 一个 `asyncio.Event`；后者在解释器的信号处理路径里执行，无法安全地操作循环对象。注意 `add_signal_handler` 只在 Unix 上可用，Windows 上要退回 `signal.signal` + `loop.call_soon_threadsafe`。
- **`os._exit` 的取舍。**它会跳过 `atexit`、跳过缓冲刷新、跳过所有清理，是"我宁可脏退出也不要被 SIGKILL"的选择。什么时候用？当你的清理已经超时、进程可能卡在一个不响应的状态时，主动 `os._exit` 至少能保证退出码可控、日志（如果已经 flush）落盘。什么时候不用？正常路径绝对不要用，因为它会跳过文件缓冲，可能丢日志。所以 `_hard_exit` 里先 `logging.shutdown()` 手动 flush，再 `os._exit`。
- **不要在 handler 里 `sys.exit()`。**`SystemExit` 只在主线程有效，在子线程里抛它不会结束进程；而且它会在一个随机的栈帧里展开，可能跳过 `finally`。
- **线程安全标志。**如果应用是多线程的（比如 WSGI worker），用 `threading.Event`；如果还在用 `signal.signal`，注意 handler 只在主线程执行，子线程收不到信号。多线程场景下更稳的写法是"主线程 handler 置标志，工作线程轮询标志"。
- **幂等。**`close_resources()` 要能被调用两次而不报错——因为 `signal` handler、lifespan shutdown、异常路径都可能触发它。用一个 `closed` 标志位守住。

还有一个顺序细节：**先置 readiness 失败，再关监听。**如果反过来，中间那一小段时间里会有新连接进来，而你已经开始拒客，客户端拿到的是连接失败而不是"服务暂时不可用"。虽然最终都是失败，但后者带一个明确的 503 和 `Retry-After`，客户端能正确重试而不是把它当成网络故障。

## 怎么验证：慢请求与半条消息

停机逻辑最危险的地方是"看起来对"。它平时不执行，只在发版时执行几十秒，出问题也只是一小撮请求失败。所以必须用能证伪的方式验证，而不是读代码。

**验证一：在途请求必须返回 200。**

```python
import asyncio, os, signal, httpx

async def slow_request_then_sigterm(pid: int):
    async with httpx.AsyncClient(timeout=30.0) as client:
        task = asyncio.create_task(client.get("http://127.0.0.1:8000/slow?seconds=8"))
        await asyncio.sleep(1.0)          # 确保请求已经在处理中
        os.kill(pid, signal.SIGTERM)      # 期间发停机信号
        resp = await task
        assert resp.status_code == 200, resp.status_code
        assert resp.text.endswith("done"), resp.text[-64:]
```

三个断言点：

- 状态码是 200，不是 502、503 或连接错误。
- 响应体完整（用结束标记校验，防止"头返回了但 body 被截断"）。
- 请求耗时接近 8 秒，说明它真的被等完了，而不是被快速失败。

再加一条：**在同一个测试里，停机之后立刻发一个新请求，断言它被拒绝或连接到别处。**这验证了"停止接受新连接"真的生效，而不是"还在接但都失败"。

**验证二：滚动更新期间 502 计数为零（或不超过预期）。**

这个要在网关侧统计，而不是应用侧——应用已经退出的请求不会在应用日志里留下痕迹。做法是发版前后各取一段 `upstream_status` 的计数，看 `502`、`504` 有没有尖刺。如果没有网关指标，至少看客户端的错误率曲线。

**验证三：消费者中途停机，消息不丢。**

```python
def test_consumer_no_message_loss():
    produced = list(range(200))
    consume_until(produced, stop_after=100)   # 消费 100 条后发 SIGTERM
    remaining = queue_depth()                 # 队列里剩余的条数
    processed = set(load_processed_ids())     # 从结果表读已完成的 id
    assert processed | set(range(100, 200)) >= set(produced)
    assert len(processed & set(range(100, 200))) >= 0
```

断言的核心不是"处理了多少"，而是**"每一条消息最终都被处理过，且没有一条只处理了一半"**。后者要靠幂等键或状态字段来校验：如果任务写了"开始"但没写"完成"，就说明它在中途被切了。

**验证四：定时任务不双跑。**

在测试环境起两个实例，把锁的 TTL 设成很短（比如 5 秒），让任务跑 6 秒，观察第二个实例是否抢到了锁并重复执行。这个测试的目的不是"证明锁有效"，而是"证明锁失效时会发生什么"——如果锁过期而任务还在跑，你至少知道自己需要续租。

四组验证的共同点是：**它们都制造了"停机发生在工作中"的状态**。最没用的验证是"发个 SIGTERM 看进程有没有退出"——那只能证明信号送达了，证明不了请求没丢。

## 小结

把整条链压成一张表：

| 阶段 | 该做的 | 做错的后果 |
| --- | --- | --- |
| 信号送达 | exec form、PID 1 装 handler、必要时用 tini | SIGTERM 被忽略，等满宽限期后被 SIGKILL |
| 摘流量 | readiness 先失败、preStop 留传播时间 | 新请求仍打到旧实例，502 尖刺 |
| 停新连接 | 关监听、拒绝新 accept | 连接被拒，客户端看到 reset |
| 清空闲连接 | 响应加 `Connection: close`、keepalive 短于排水窗口 | 复用旧连接，出现零星 5xx |
| 等在途 | 有上限的等待，上限小于宽限期 | 卡住的请求拖垮整个进程 |
| 关资源 | 等在途事务、关连接池、停消费者 | 事务回滚、消息丢失 |
| 定时任务 | 锁/租约 + 幂等 | 同一任务跑两遍 |

五条可以直接拿去用的结论：

1. **`SIGTERM` 是请求，`SIGKILL` 是判决。**所有清理逻辑都必须能在宽限期内完成，否则等于没写。
2. **PID 1 不会替你做默认动作。**容器里第一件事是确认 PID 1 是谁、handler 装了没有。
3. **先摘流量，再停服务。**顺序反了，前面所有排水都白做。
4. **`acks_late` 必须配幂等。**否则你只是把"丢消息"换成了"重复执行"。
5. **验证要制造"停机发生在工作中"。**只验证"进程能退出"没有任何意义。

## 相关阅读

- [Django 部署到 PythonAnywhere：一次完整的上线记录](/article/django-pythonanywhere-deploy/)
- [特性开关与渐进式发布：让发版变成一次实验](/article/feature-flag-progressive-delivery/)
- [接口幂等：重复请求为什么比重试更可怕](/article/api-idempotency-deep-dive/)
- [消息队列可靠投递：ack、重投与至少一次语义](/article/mq-reliable-delivery-deep-dive/)
