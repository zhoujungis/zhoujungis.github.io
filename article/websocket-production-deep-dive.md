---
title: "WebSocket 上生产：心跳、重连与水平扩展"
slug: websocket-production-deep-dive
cover_image: /photos/websocket-production-deep-dive-cover.png
date: 2026-11-04
tags: ["后端", "WebSocket", "实时通信", "架构"]
---

> 适用读者：本地用 `ws://localhost` 联调顺利、一上线就遇到断连和丢消息的工程师；准备把单机 WebSocket 服务扩到多实例的人
> 结论先行：WebSocket 的麻烦几乎都不在协议本身，而在**它要穿过一堆按「短请求」设计的中间设施**。代理有 60 秒空闲超时，负载均衡按连接分配，多实例之间没有共享广播通道，任何一个环节没配好，表现都是「连接断了」或「消息丢了」。
> 阅读时间：约 27 分钟 | 难度：进阶 | 收获：握手与帧的完整机制、Nginx/代理的正确配置、心跳与重连的可落地设计、Redis 共享订阅与连接注册表、背压与鉴权，以及 Django Channels 的生产写法

**目录**

- 前言：本地一切正常，上线六十秒断一次
- 握手：Upgrade、Sec-WebSocket-Key 与 101
- 帧、opcode 与 mask：协议的三条硬规则
- 代理为什么打断：Nginx 的 upgrade 配置
- 心跳：协议 ping/pong 与应用层心跳
- 断线重连：退避、游标与去重
- 水平扩展：粘性会话、共享订阅与连接注册表
- 背压：一个慢客户端不能拖垮广播
- 鉴权：token 放哪里，过期了怎么办
- 安全：大小、频率、压缩与跨站劫持
- Django 落地：Channels、Consumer 与 channel layer
- 观测：连接数、重连率与投递延迟
- 小结
- 相关阅读

---

## 前言：本地一切正常，上线六十秒断一次

本地开发时，前端连 `ws://localhost:8000/ws/chat/`，聊一整天都没事。上线之后，连接每隔一分钟左右断一次，前端日志里反复出现「连接已关闭，正在重连」。更奇怪的是，断的时间很规律，像有人按了秒表。

这是第一类故障，原因简单到有点无聊：Nginx 的 `proxy_read_timeout` 默认是 60 秒。它的语义是「两次从上游读到数据之间的最长时间」，不是「连接总时长」。WebSocket 空闲一分钟，代理认为上游没动静了，就把连接关掉。本地没有代理，自然看不到这个行为。

把超时调大之后，问题暂时消失。第二天服务扩到两个实例，新的问题来了：一半用户收不到别人发的消息，刷新一下可能好，也可能更糟。

这是第二类故障，原因在进程边界：Django Channels 的默认 channel layer 是进程内的内存实现。`group_send` 把消息投给本进程里加入了这个组的连接，另一个实例上的连接完全不知道。单进程时它工作得很好，多进程时它只覆盖了自己那一半。

两类故障的共同点是：**代码没有错，错的是代码所依赖的环境假设**。本地假设「没有代理、只有一个进程」，生产环境两个都不成立。

这篇文章按一条连接的生命周期往下走：怎么建立、怎么穿过代理、怎么判断它还活着、断了怎么回来、多个实例怎么协同、消息太多时怎么不把自己拖死、怎么认证和防护，最后落到 Django 的具体实现和观测。

先说结论：

| 问题 | 结论 |
| --- | --- |
| 60 秒断一次 | 代理的空闲超时，不是连接寿命；心跳间隔要小于链路中最小的空闲超时 |
| 扩容后丢消息 | 广播没有跨进程；要么共享 pub/sub，要么放弃多实例 |
| 心跳怎么做 | 浏览器不能发协议 ping，客户端必须用应用层心跳；服务端可以发协议 ping |
| 重连怎么不炸 | 指数退避加抖动，按关闭码决定是否重连，用游标补消息 |
| 慢客户端怎么办 | 每连接有界队列，满了就丢或断开，绝不无限缓冲 |

## 握手：Upgrade、Sec-WebSocket-Key 与 101

WebSocket 的起点不是一条新协议的连接，而是**一次 HTTP 请求要求「升舱」**。RFC 6455 定义的握手，客户端发出来是这样：

```bash
GET /ws/chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
Origin: https://example.com
```

服务端同意升级，就返回 101：

```bash
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

三个 Header 各有分工。`Upgrade: websocket` 声明想切换到哪个协议；`Connection: Upgrade` 是 HTTP/1.1 的 hop-by-hop 标记，告诉每一跳「这个头是给下一跳的，不要吞掉」；`Sec-WebSocket-Version: 13` 是协议版本，服务端不支持时应该回 426 并带上自己支持的版本。

`Sec-WebSocket-Key` 不是凭证，而是一个随机 nonce。服务端要把它和一串固定 GUID（`258EAFA5-E914-47DA-95CA-C5AB0DC85B11`）拼接，做 SHA-1，再 Base64，得到 `Sec-WebSocket-Accept`。这个设计的目的不是安全，而是**证明服务端真的解析了 WebSocket 握手**：一个只做 HTTP 缓存或反向代理的中间件，没法凭空算出这个值，客户端就能区分「真的升级成功」和「被代理返回了一个 200 页面」。

101 之后，这条 TCP 连接就不再是 HTTP 了。没有请求行，没有 Header，没有 Content-Length，只有帧。也正因为如此，任何按 HTTP 语义处理响应的中间件都会在这里出问题：它可能等待一个永远不会到来的响应体，也可能在升级后继续按 HTTP 超时来管理连接。

握手阶段还有几个工程细节值得记住。

第一，`Origin` 是浏览器自动带的，服务端应该校验。它不是用来防重放的，而是用来防「别的站点借用用户浏览器发起连接」——后面讲跨站劫持时会展开。

第二，`Sec-WebSocket-Protocol` 可以用来协商子协议。客户端传一个列表，服务端选一个并在响应里回显。有人拿它传 token，这不是它的设计用途，但确实能避开 URL 日志；代价是语义不标准，代理和框架未必都按你的预期处理。

第三，握手也是一个可以被滥用的入口。未认证的连接会占用内存和文件描述符，所以握手阶段的限流、连接数上限、以及「多久没认证就关闭」的定时器，都要在建立连接的那一刻就准备好。

第四，HTTP/2 上也有 WebSocket，走的是 RFC 8441 的 Extended CONNECT，不再是 101。但绝大多数生产部署仍然是「HTTP/1.1 握手 + 101 升级」，因为中间设施对它的支持最完整。知道这一点就够了，不必为了「更现代」去踩一条支持度更差的路。

## 帧、opcode 与 mask：协议的三条硬规则

101 之后传的是帧。一个帧的头部大致是：

```bash
FIN(1) | RSV1-3(3) | opcode(4) | MASK(1) | payload_len(7) | [扩展长度] | [mask key(4)] | payload
```

`FIN` 表示这是不是一条消息的最后一帧。`RSV1-3` 预留给扩展，没有协商扩展时必须为 0（`permessage-deflate` 会占用 RSV1）。`opcode` 说明这一帧是什么。`MASK` 表示负载是否被掩码。后面的长度字段分三档：7 位表示 0 到 125，7 位全 1 加 16 位表示更大，再加 64 位表示超大。

opcode 的取值不多，但每一个都有用：

| opcode | 名称 | 说明 |
| --- | --- | --- |
| 0x0 | continuation | 一条消息的后续帧 |
| 0x1 | text | UTF-8 文本 |
| 0x2 | binary | 二进制 |
| 0x8 | close | 关闭握手 |
| 0x9 | ping | 协议层心跳请求 |
| 0xA | pong | 协议层心跳应答 |

三条硬规则决定了实现的正确性。

**第一，客户端到服务端的帧必须掩码，服务端到客户端的帧必须不掩码。** 掩码是用一个 4 字节 key 对负载做 XOR。它不是加密，目的是防止中间缓存把 WebSocket 流量当成普通 HTTP 缓存起来，也增加了一点攻击者伪造数据的成本。服务端如果收到未掩码的客户端帧，按 RFC 6455 应当关闭连接（1002）；服务端如果给客户端发了带掩码的帧，客户端也应该拒绝。

**第二，控制帧不能分片，且长度不能超过 125 字节。** close、ping、pong 都是控制帧。它们必须能在一帧里读完，否则「心跳」就失去了「快速确认」的意义。控制帧也不能用 continuation opcode。

**第三，一条消息可以分片，但必须按顺序重组。** 文本或二进制消息可以被切成「首帧 + 若干 continuation 帧 + 末帧（FIN=1）」。这意味着**消息大小限制不能只看单帧长度**：攻击者可以用很多个 125 字节的帧拼出一个巨大的消息，如果你只在第一帧检查长度，限制形同虚设。正确的做法是累计同一条消息的所有分片长度，超过上限就关闭（1009，message too big）。

关闭也有讲究。关闭是一条双向的礼貌动作：一方发 close 帧（可以带关闭码和原因），另一方回 close 帧，然后双方再关 TCP。服务端不应该发完 close 就立刻 `RST`，那会让客户端看到 1006（abnormal closure），无法区分「服务端正常下班」和「网络断了」。关闭码的语义在 RFC 6455 第 7.4 节有定义：1000 正常关闭，1001 表示「服务端要走了」（比如发布重启），1002 协议错误，1007 数据格式错误，1008 策略拒绝，1009 消息过大，1011 服务端内部错误，1013 稍后再试。4000 到 4999 留给应用自定义，比如用 4001 表示「token 过期」。

知道这些不是为了手写一个 WebSocket 库，而是为了在排查时能读懂现象：客户端报 1006，说明连接被异常切断，通常是代理或网络；报 1009，说明你的大小限制在生效；报 1011，说明服务端处理消息时抛了异常。**关闭码是排查 WebSocket 问题的第一手证据**，比「连接断了」这句话有用得多。

## 代理为什么打断：Nginx 的 upgrade 配置

回到开头那个 60 秒。Nginx 要正确转发 WebSocket，需要同时满足三件事：用 HTTP/1.1 连上游、把 `Upgrade` 和 `Connection` 头传过去、把空闲超时调大。

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 443 ssl;
    server_name example.com;

    location /ws/ {
        proxy_pass http://ws_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_buffering off;
    }
}
```

逐条解释。

`proxy_http_version 1.1` 是必须的。Nginx 默认用 HTTP/1.0 连上游，而 HTTP/1.0 没有 `Upgrade` 机制。少了这一行，Nginx 会把握手请求当普通 HTTP 发出去，后端返回 200 或 400，客户端看到的是「Unexpected response code: 200」。

`proxy_set_header Upgrade $http_upgrade` 把客户端的升级意图带过去。`Connection $connection_upgrade` 用 `map` 生成：请求是 WebSocket 时填 `upgrade`，普通请求时填 `close`。很多人直接写死 `Connection "upgrade"`，在同一 `location` 下混有普通 HTTP 请求时，就会给正常请求也带上 `Connection: upgrade`，语义错误，某些后端会直接拒绝。

`proxy_read_timeout` 的默认值是 60 秒，它衡量的是「两次读之间的间隔」。WebSocket 空闲超过这个时间，Nginx 就关闭连接。把它调大能解决「固定 60 秒断」，但不能解决「连接永远不断」——调成 3600 秒只是把问题推迟到一小时后。真正稳定的做法是心跳，让链路上始终有数据流动。

`proxy_send_timeout` 同理，是向客户端写数据的空闲超时。长连接两个方向都要放。

`proxy_buffering off` 对 WebSocket 的 101 之后并不是必须的——升级后 Nginx 基本是在两个 socket 之间搬运字节，缓冲不改变帧的语义。但同一个 `location` 里如果还有 SSE 或流式响应，缓冲会把「逐条推送」变成「攒一批再发」，所以流式场景要关。这个开关不是「WebSocket 专用」，而是「流式专用」。

还要注意链路上不止一层代理。浏览器到 CDN、CDN 到云负载均衡、云负载均衡到 Nginx、Nginx 到应用，每一层都可能有自己的空闲超时。云负载均衡的空闲超时常见是 60 秒，CDN 可能更短。**心跳间隔必须小于这条链上最小的空闲超时**，否则你在 Nginx 上调好了，CDN 那一层照样断。

如果用的是别的代理，思路一样但参数不同：HAProxy 需要 `option http-server-close` 或对应的 upgrade 支持，并用 `timeout tunnel` 覆盖长连接的空闲超时；Envoy 需要在路由上配置 `upgrade_configs`，并把 `stream_idle_timeout` 调大或关闭。它们都遵循同一条原则：**把 Upgrade 当成一条需要显式允许的路径，而不是普通 HTTP**。

还有一个常被忽略的点：应用服务器自己也可能有超时。Daphne、Uvicorn 之类的 ASGI 服务器、框架里的 keepalive 设置，都可能在代理之外再切一刀。排查时要从最外层往里逐层看，找到那个「恰好 60 秒」的配置。

## 心跳：协议 ping/pong 与应用层心跳

心跳要回答两个问题：这条连接还活着吗？如果死了，谁先发现？

协议层已经提供了工具：ping 和 pong。服务端可以发 opcode 0x9 的 ping，客户端按 RFC 6455 必须回一个 0xA 的 pong。这个往返发生在协议栈里，不经过业务代码。

但浏览器环境有一个关键限制：**浏览器的 WebSocket API 不暴露发送 ping 的能力**。`new WebSocket(url)` 得到的对象只有 `send`、`close`，没有 `ping`。你也没法监听 pong 事件。服务端发来的协议 ping，浏览器会自动回 pong，但页面脚本看不见这个动作。

这导致一个常见的误解：前端定时 `ws.send("ping")`，以为自己在发心跳。实际上那是一条普通的文本消息，服务端如果没写对应的处理逻辑，它只会被当成业务数据。真正的协议 ping，前端发不出去。

所以生产上的分工通常是这样的：

- **服务端可以用协议 ping 做探活**。定时给每个连接发 ping，等 pong；连续几次没有 pong，就判定连接已死并清理。这条路不经过业务代码，开销小。
- **客户端必须用应用层心跳**。定时发一条约定格式的消息（比如 `{"type":"ping","id":...}`），服务端回 `{"type":"pong","id":...}`。客户端据此判断「服务端还活着、链路还能往返」，并在超时后主动关闭、进入重连。
- **两边都做，或者至少做客户端那一侧**。只做服务端 ping，客户端无法知道自己和服务端之间已经断开（比如 NAT 超时、Wi-Fi 切换），会一直以为自己连着，消息发出去石沉大海。

参数的核心约束是「小于链路最小空闲超时」。CDN、Nginx、云负载均衡都是 60 秒时，取 20 到 30 秒稳妥，留出两次余量。心跳太频繁也有成本：10 秒一次、十万连接就是每秒一万条消息。

判定死亡不能太激进。一次没回可能是抖动，连续两到三次、或超过两个周期没有任何数据才关闭，用 1011 或自定义码，让客户端知道这是异常。

服务端维护一个 `last_seen`，任何帧到达都更新，包括 pong 和 close。再用一个周期任务扫描，超阈值就清理。不要给每个连接挂独立定时器——十万连接就是十万个定时器，开销不划算；每秒一次的分片扫描足够用。

一个 Python 侧的实现示意：

```python
import asyncio
import time

HEARTBEAT_INTERVAL = 25
DEAD_AFTER = 70

async def heartbeat_loop(conn):
    while not conn.closed:
        await asyncio.sleep(HEARTBEAT_INTERVAL)
        if conn.closed:
            break
        if time.monotonic() - conn.last_seen > DEAD_AFTER:
            await conn.close(code=1011, reason="heartbeat timeout")
            break
        await conn.send_json({"type": "ping", "ts": int(time.time() * 1000)})
```

注意 `last_seen` 要在收到任何帧时更新，而不是在「发送成功」时更新。`send` 返回成功只能说明数据进了本地缓冲区，不能说明对方收到了。判断连接是否活着，永远要看「有没有收到东西」。

心跳还会重置代理的空闲超时，这是它存在的第二个理由。但如果间隔大于代理超时，代理会在两次心跳之间切掉连接，心跳永远等不到下一次。

还要区分：**连接活着 ≠ 身份仍有效**。心跳只证明链路通，不证明 token 没过期。

## 断线重连：退避、游标与去重

WebSocket 断开是常态，不是异常。移动网络切换、Wi-Fi 漫游、代理重启、服务端发布，都会断开连接。客户端必须把「重连」当成一等功能来设计，而不是加一个 `onclose` 里立刻 `new WebSocket()` 就完事。

立刻重连是最糟的策略。服务端刚重启，所有客户端同时重连，形成比正常流量更尖的脉冲；服务端没准备好就被再次打挂，然后大家一起重试，进入同步振荡。这和限流里的「整点突刺」同类。

正确做法是指数退避加抖动：

```python
delay = random.uniform(0, min(cap, base * pow(2, attempt)))
```

`base` 取 0.5 到 1 秒，`cap` 取 30 秒，`attempt` 是连续失败次数。full jitter 把重试时刻打散。连接稳定 30 秒后再把计数归零；不要在 `onopen` 时归零，服务端可能接受后立刻关闭。

还要按关闭码区分「该不该重连」：

| 关闭码 | 含义 | 客户端动作 |
| --- | --- | --- |
| 1000 | 正常关闭 | 如果是用户主动关，不重连；否则按策略重连 |
| 1001 | 服务端要走了 | 重连，最好重新拉一次端点列表 |
| 1006 | 异常断开（没有 close 帧） | 重连，通常意味着网络或代理问题 |
| 1008 | 策略拒绝 | 不重连，检查鉴权或权限 |
| 1011 | 服务端内部错误 | 退避后重连，避免立刻打回去 |
| 1013 | 稍后再试 | 按服务端建议等待，尊重 Retry-After 语义 |
| 4001（自定义） | token 过期 | 先刷新 token，再重连 |

「断线」之后还有一个更难的问题：**断的这段时间里，消息去哪了**。

业务允许丢（在线状态、光标位置）就直接恢复。不能丢（聊天、订单状态）就需要游标：每条事件有单调递增 ID，客户端保存最后一条，重连时带上，服务端从其后补发。

补发的前提是历史有地方存：Redis Stream、数据库表，或按房间的环形缓冲。补发必须有上限，离线三天不该重放三天，而要回「游标太旧，请拉快照」。协议上分成 `resume` 和 `resync` 两种响应。

补发和实时推送会重叠，**去重是必须的**。客户端按事件 ID 去重；服务端切换时也要不丢不重：先订阅实时通道，再读历史补发，按 ID 合并，最后切纯实时。顺序反了，补发期间的新消息会丢。

非消息状态（未读数、在线状态、正在输入）通常不靠回放，而是重连后拉一次快照。「快照 + 增量」分开，比用一套事件流解决所有问题简单。

多标签页会放大重连：开五个标签，断网恢复时五个连接同时重连。可以用 `BroadcastChannel` 或 `SharedWorker` 选一个主标签页持有连接，其他标签转发；至少让抖动更分散。连接数大时，这能明显压低重连峰值。

最后，不要在 `offline` 状态下重试。浏览器已经告诉你没网了，继续重连只是浪费电和日志。监听 `online` 事件再恢复，能把重试次数降下来。

## 水平扩展：粘性会话、共享订阅与连接注册表

单实例时，WebSocket 的一切都很简单：连接在进程内存里，广播就是遍历一个本地字典。扩到多实例，问题分成两层。

第一层是**连接落在哪**。负载均衡按连接分配，用户 A 连实例 1、B 连实例 2，A 发消息时，实例 1 只知道自己这里的连接，B 收不到。

第二层是**状态存在哪**。连接本身、订阅关系、在线状态，都是「某一台机器才知道」的状态。任何一台机器挂了，它持有的连接和状态都要有人接管。

最直接的补法是粘性会话，让同一个用户始终落到同一台。但这只解决同一用户多连接的问题，解决不了跨用户广播。它还会让扩容失效：新机器只接新用户。发布时一台下线，上面的用户全掉线，重连后可能又被粘到另一台过载机器。

真正的解法是把广播搬到进程外：引入共享发布订阅层。Redis pub/sub 最常见，`channels_redis` 就是把它封装成 channel layer。

每个实例订阅同一个逻辑通道（group）。消息发给 group，Redis 分发给所有订阅实例，每个实例再推给本地成员。**每条 group 消息的网络拷贝数是实例数，不是连接数**：十个实例、十万连接，广播在 Redis 上是十份，实例内部再扇出。但「给某个用户单独发」是每个用户一次发布，成本随用户数线性增长。

Redis pub/sub 发出去就不管：没有持久化，没有确认，订阅者不在线就收不到。做实时推送可以，不能保证送达；要可靠投递就用 Stream 或消息队列，客户端用游标补，回到上一节的设计。

还有两个现实问题。一是**顺序**：跨实例经过 Redis 不保证严格顺序，同房间的消息由不同实例并发发出时，到达顺序可能和产生顺序不同。要保证顺序，就让同一个房间走同一个发布者，或带序列号由客户端排序。聊天可以接受「差不多有序」，订单状态机不能赌。

二是**连接注册表**。你通常需要回答「用户 X 现在在线吗」「他有几个标签页」「给他所有连接推一条消息」。这需要一张跨实例的表：

```bash
ws:conn:{conn_id}  -> {user_id, node, last_seen}   (TTL 60s)
ws:user:{user_id}  -> set(conn_id, conn_id, ...)    (TTL 与连接同步)
```

连接建立写入、断开删除、心跳刷新 TTL。崩溃时来不及删，靠 TTL 兜底。在线状态不要单独存布尔值，而要从集合是否为空推导，否则会留下永远在线的幽灵用户。

多标签页天然对应多个 `conn_id`。给用户推送时遍历集合，逐个连接发；统计在线人数时按用户去重，而不是按连接计数。这两件事经常被混在一起，导致「在线人数」虚高。

## 背压：一个慢客户端不能拖垮广播

实时系统里最容易被忽略的是「写不出去」。服务端调用 `send` 时，数据通常只是进了操作系统的发送缓冲区，真正到达客户端取决于网络和客户端读得快不快。一个手机在弱网下、一个标签页被浏览器冻结、一个恶意客户端故意不读，都会让发送缓冲区填满，`send` 开始阻塞。

如果广播循环是「遍历所有连接，逐个 `await send`」，一个慢客户端就会卡住整个循环：它后面的所有连接都收不到消息，整个房间的实时性退化成一个最慢客户端的速度。这就是实时系统里的队头阻塞。

解决办法是**每个连接一个有界队列，加一个独立的发送协程**：

```python
import asyncio

MAX_QUEUE = 200

async def sender(conn):
    while True:
        item = await conn.queue.get()
        try:
            await asyncio.wait_for(conn.send_json(item), timeout=5)
        except asyncio.TimeoutError:
            conn.queue.task_done()
            await conn.close(code=1013, reason="send timeout")
            return
```

广播方只负责 `queue.put_nowait`，不直接 `await send`。这样慢连接只会让自己的队列变长，不会阻塞别人。

队列必须有界。无界队列看起来「不丢消息」，实际上是把内存当成缓冲，直到 OOM。有界之后要选一种溢出策略：

- **丢最旧的**：适合可丢的实时消息，比如光标位置、输入中提示、行情快照。用户看到的是「稍微旧一点」，但不会断。
- **丢最新的**：适合「只关心最后状态」的场景，比如在线状态更新。
- **断开连接**：适合不能丢的消息。队列满了说明这个客户端已经跟不上，继续堆积没有意义，不如用 1013 关闭，让它重连后用游标补。这比无限缓冲更安全。

选择哪种，取决于消息的语义，而不是取决于「哪种实现简单」。很多事故是把「订单状态变更」和「对方正在输入」放进同一个无界队列，结果前者被后者拖死。

还要限制单条消息大小。文本消息限制在几十 KB 比较常见；二进制消息按业务定，但一定要有上限。限制要在「重组完整消息之后」检查，而不是只看单帧。超过上限就关闭（1009），不要试图截断后继续，那会让客户端收到一条语义不完整的消息。

压缩要谨慎。`permessage-deflate` 可以省带宽，但压缩比是攻击面：一条很小的压缩数据可以解压成巨大的内容，服务端在解压时就把内存打满。如果开启压缩，必须限制解压后的字节数，或者只对可信客户端开启。关掉压缩通常是最省心的选择，除非带宽确实是瓶颈。

观测上，每个连接的队列长度是一个非常有价值的指标。队列持续增长，说明这个客户端消费不过来，或者服务端生产太快；队列长度分布的长尾，往往比平均连接数更早暴露问题。

## 鉴权：token 放哪里，过期了怎么办

WebSocket 握手是一次 HTTP 请求，所以鉴权可以发生在握手阶段。问题是用什么方式把凭证带过去，以及连接建立之后凭证过期了怎么办。

**方式一：URL 查询参数**，`wss://example.com/ws/?token=...`。最简单，但 token 会进 Nginx 日志、CDN 日志、开发者工具。长期 token 放 URL 等于写进日志系统。要用就换成一次性、30 秒有效的 ticket，用完即焚。

**方式二：子协议**，`new WebSocket(url, ["bearer", token])`。token 放进 `Sec-WebSocket-Protocol` 头，不进 URL；服务端要回显选中的子协议。它比 URL 干净，但某些代理仍会记录 Header，而且语义是协商协议不是传凭证，框架支持参差。

**方式三：首帧认证**。连接建立后，客户端在很短时间内（比如 5 秒）发一条认证消息，服务端验证通过后才允许加入 group、订阅频道。在此之前，连接只能做认证这一件事。这个方式最干净：token 不进入 URL，也不依赖 Header 日志；代价是握手成功不等于身份有效，服务端要维护一个「已认证」状态，并且要防止未认证连接占用资源。

**方式四：Cookie**。握手会自动带上同站 Cookie，最省事，但引入跨站 WebSocket 劫持：别的站点让用户浏览器向你建连，Cookie 自动带上，攻击者就能读推送。`SameSite` 只能缓解，浏览器行为不一致。用 Cookie 必须校验 `Origin`，最好再加 CSRF token 之类的二次凭证。

认证通过之后，还有一个时间维度的问题：**JWT 通常 15 分钟过期，而连接可能活几个小时**。握手时验证通过，不代表一小时后还应该被信任。

三种处理方式：

1. **到期关闭**。记录 token 的 `exp`，到点前用 4001 关闭，客户端刷新后重连。简单明确，代价是一次重连。
2. **重认证帧**。先提示即将过期，客户端发 `reauth`，服务端验证后更新身份。连接不断，但多一套协议。
3. **按操作校验**。连接保持，每次敏感操作检查 token。只适合低频操作，不适合高频消息。

推荐「到期关闭 + 静默刷新」，把连接生命周期和凭证生命周期解耦，逻辑最简，也不会出现「连接活着但权限失效」。

`Origin` 校验要单独强调。浏览器的 WebSocket 握手会带 `Origin`，服务端应该只允许自己的域名（以及明确受信的合作方）。非浏览器客户端可能不带 `Origin`，这时要有单独的策略：要么拒绝，要么要求它走另一种认证方式。把「没有 Origin」当成「同源」，是一个很常见的错误。

最后，认证和授权要分开。认证回答「你是谁」，授权回答「你能订阅哪个房间」。一个已登录用户不应该能订阅别人的私聊房间；`group_add` 之前必须校验房间归属，不能只依赖房间名的随机性。

## 安全：大小、频率、压缩与跨站劫持

WebSocket 的安全问题和 HTTP 有一半重合，另一半是它特有的。

**消息大小**。限制要按「重组后的完整消息」算。单帧 125 字节、一千帧拼起来就是 125 KB，只在帧层面限制等于没限制。文本建议限制在 64 KB 以内，超出用 1009 关闭。二进制按业务定，但一定要有数字。

**频率**。一条连接可以每秒发几千条消息。如果没有每连接限流，一个客户端就能打满一个 CPU 核，还能把广播放大给所有人。每连接一个令牌桶，限制消息速率；同时对「建连速率」也限流，防止有人反复建连消耗握手成本。这两层限流和 HTTP 接口的限流是同一套思路，只是计量单位从「请求」变成了「消息」和「连接」。

**压缩炸弹**。`permessage-deflate` 的压缩比可以非常高，几 KB 的压缩数据解压出几百 MB。防御方式有三种：不开启压缩；限制解压后的总字节；限制压缩比。三者选其一即可，叠加更好。不要因为「带宽看起来省了」就默认开启，解压发生在你的进程里，内存是你付。

**跨站 WebSocket 劫持（CSWSH）**。攻击者在自己的页面里执行 `new WebSocket("wss://victim.com/ws")`，浏览器会带上 victim 的 Cookie，握手成功，攻击者的脚本就能读到后续推送。它和 CSRF 是同一类问题，只是通道从 HTTP 请求变成了长连接。防御的核心是 `Origin` 白名单；Cookie 的 `SameSite` 是辅助，不是替代。只靠「握手需要登录态」是不够的，因为浏览器会自动把登录态送过去。

**输入与输出**。WebSocket 传的还是用户内容，XSS、注入、日志注入一样存在。消息进数据库前要校验，推到前端前要按上下文转义。不要因为「这是 WebSocket 不是 HTML」就跳过净化。

**传输**。生产只开 `wss`，不要在 TLS 终止点之后再用 `ws` 跨公网。TLS 可以在 Nginx 或云负载均衡上终止，内网那段也要评估是否需要加密，尤其是多租户。

**连接数**。每个连接占内存、占文件描述符、占一个进程内的数据结构。一个 IP 或一个用户能建多少连接，要有上限。否则一个脚本就能把连接表打满，让正常用户连不进来。这和「消息频率」是两个不同的维度，都要限。

这些措施听起来琐碎，但它们共同回答一个问题：**当对手控制了一个客户端，他能对你的服务做多大的破坏**。答案应该被限制在「他自己那条连接」的范围内，而不是整个进程。

## Django 落地：Channels、Consumer 与 channel layer

Django 本身是同步 WSGI 框架，处理不了 WebSocket 的长连接。Channels 在 Django 之上加了一层 ASGI，把「HTTP 请求」和「WebSocket 连接」都变成 `scope`，交给 consumer 处理。

最小可用的结构是这样：

```python
# routing.py
from django.urls import re_path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room>\w+)/$", ChatConsumer.as_asgi()),
]
```

```python
# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room = self.scope["url_route"]["kwargs"]["room"]
        self.group_name = f"chat_{self.room}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        payload = json.loads(text_data)
        await self.channel_layer.group_send(
            self.group_name,
            {"type": "chat.message", "payload": payload},
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["payload"]))
```

几个要点。

`connect` 里先 `group_add` 再 `accept`，还是先 `accept` 再 `group_add`，取决于鉴权策略。如果要做首帧认证，就不能在 `connect` 里直接 `accept` 并加组，而要等认证消息到达后再加。未认证就加组，等于把房间内容提前暴露。

`type` 字段是 Channels 的方法派发机制：`"chat.message"` 会被转换成 `chat_message` 方法。名字里的点会被替换成下划线，这是约定，不是魔法。写错方法名，消息会被静默丢弃。

`group_send` 是跨进程的，但前提是 channel layer 真的跨进程。默认的 `InMemoryChannelLayer` 只在本进程内有效。生产配置要换成 Redis：

```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("redis.internal", 6379)],
            "capacity": 1500,
            "expiry": 10,
        },
    },
}
```

`capacity` 是每个 channel 的队列容量，`expiry` 是消息在 channel 里的存活时间。这两个值决定了「消费不过来时是排队还是丢弃」。默认值偏保守，高吞吐场景要按实际调整，但不能无限调大——那只是把内存问题推迟。

从同步代码（比如 HTTP view、Celery task）里发消息，要用 `async_to_sync` 包一层：

```python
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

channel_layer = get_channel_layer()
async_to_sync(channel_layer.group_send)(
    "chat_lobby",
    {"type": "chat.message", "payload": {"text": "hello"}},
)
```

同步上下文不能直接 `await`，必须先包一层；`get_channel_layer()` 拿到的就是配置里的那个 Redis layer。

Consumer 里访问数据库要小心。`AsyncWebsocketConsumer` 运行在事件循环里，直接调用同步 ORM 会阻塞整个循环。用 `database_sync_to_async` 包一层，或者只用异步驱动。一个常见的性能事故是：在 `receive` 里直接 `User.objects.get(...)`，单连接时看不出问题，几百连接时整个进程的延迟都上去了。

部署方面，WSGI 服务器不能跑 WebSocket。Gunicorn 的同步 worker 只处理 HTTP 请求-响应，拿到 Upgrade 请求也没法转成 ASGI 的 scope。要用 ASGI 服务器：Daphne、Uvicorn，或者 Gunicorn 配 Uvicorn worker。Channels 官方文档的部署示例是 Nginx + Daphne，Uvicorn 也完全可用。

进程数与连接数要分开算。每个连接占内存（consumer 实例、channel、缓冲区），一个进程能扛多少取决于单连接内存和可用内存。不要只按 CPU 核数定进程数，连接上限要单独压测；Nginx 到 Daphne 之间也要设上限，防止单实例被打爆。

最后，channel layer 的 Redis 本身也是单点。它挂了，跨进程广播就断了。要么做 Redis 高可用，要么接受「降级为单机广播」，并在监控上把这条链路当成核心依赖。

## 观测：连接数、重连率与投递延迟

WebSocket 的监控和 HTTP 很不一样。HTTP 看 QPS、延迟、错误率；WebSocket 看的是「连接的生命周期」和「消息的旅程」。

必须有的几个指标：

| 指标 | 类型 | 说明 |
| --- | --- | --- |
| 活跃连接数 | Gauge | 按实例、按房间统计；突降通常意味着发布或代理故障 |
| 建连速率 | Counter | 每秒新连接；异常升高可能是重连风暴 |
| 关闭码分布 | Counter | 1006 多说明网络/代理；1011 多说明服务端异常 |
| 握手失败率 | Counter | 401/403/426；鉴权或 Origin 配置问题 |
| 消息速率 | Counter | 入站、出站分开；出站远大于入站是广播放大 |
| 投递延迟 | Histogram | 从入队到发送完成；P99 决定实时性 |
| 每连接队列长度 | Gauge/Histogram | 长尾说明慢消费者 |
| 心跳超时数 | Counter | 死连接清理量；持续偏高说明链路有问题 |
| 重连率 | Counter | 客户端上报；没有它就无法区分「用户关页」和「连接抖动」 |

「重连率」这个指标只能由客户端提供。服务端看到的只是「新连接」，分不清是新用户还是老用户重连。客户端在建立连接时带上一个稳定的匿名 ID 和「第几次重连」，服务端才能算出真实的重连率。没有这个数据，你会把「重连风暴」误判成「用户增长」。

投递延迟要定义清楚：是「产生到入队」，还是「入队到写进 socket」，还是「客户端确认收到」？服务端能测前两段，端到端要靠回执或心跳时间戳。至少要测「入队到发送完成」，它最能暴露背压。

排查「一半消息收不到」时，顺序应该是：

1. 看连接分布：两个实例各占多少？严重偏斜先查负载均衡和粘性。
2. 看广播路径：`group_send` 之后，另一个实例的 consumer 有没有收到？在 `chat_message` 里打日志。
3. 看 channel layer：还在用内存实现吗？Redis 连接正常吗？
4. 看订阅关系：`group_add` 是否失败？`disconnect` 是否漏了 `group_discard`，堆了幽灵 channel。

排查「固定时间断连」时，顺序是：

1. 记录关闭码。1006 通常是被中间设施切断，1000/1001 是正常关闭。
2. 对齐时间。把所有层的空闲超时列出来，找和断开周期吻合的值。
3. 看心跳是否在跑。日志里有没有 ping/pong，间隔是否小于最小超时。
4. 看是否只在某个网络环境复现，那说明是链路中间的问题。

一个容易忽略的点是「连接年龄分布」。所有连接都在 60 秒左右消失，几乎可以确定是超时；分布很分散，更像客户端行为或网络抖动。做成直方图比只看总数有用。

## 小结

| 问题 | 答案 |
| --- | --- |
| 60 秒断一次 | 代理的 `proxy_read_timeout` 默认值；心跳要小于链路最小空闲超时 |
| 握手的关键 | `Upgrade`/`Connection` 要透传，101 之后不再是 HTTP |
| 帧的关键 | 客户端掩码、控制帧不超过 125 字节、消息大小按重组后计算 |
| 浏览器能发协议 ping 吗 | 不能；客户端用应用层心跳，服务端可用协议 ping 探活 |
| 重连策略 | 指数退避加抖动，按关闭码区分是否重连，稳定后才重置计数 |
| 消息不丢 | 游标补发 + 去重 + 快照重建；pub/sub 本身不保证投递 |
| 多实例广播 | 共享 channel layer（Redis），不是粘性会话 |
| 慢客户端 | 每连接有界队列，满了丢或断开，绝不无限缓冲 |
| 鉴权 | 首帧认证最干净；token 到期主动关闭并重连；校验 Origin |
| Django | Channels + ASGI 服务器 + Redis channel layer；WSGI 不支持 WebSocket |

WebSocket 上生产的难点，几乎都能归结成一句话：**它是一条长得像 HTTP 请求、但活得像 TCP 连接的东西**。中间设施按请求设计，框架按请求设计，而它需要的是长寿命、双向、有状态的管理方式。

把这条连接的每个阶段都想清楚——怎么建立、怎么穿过代理、怎么证明还活着、断了怎么回来、多实例怎么协同、写不出去时怎么办——故障就会从「玄学断连」变成一个个可以定位的配置和代码问题。

## 相关阅读

- [负载均衡：轮询、最少连接与一致性哈希的代价](/article/load-balancing-algorithms-in-practice/)
- [API 网关实战：认证、限流与路由的统一入口](/article/api-gateway-deep-dive/)
- [Redis 分布式锁：从 SETNX 到 Redlock 的边界](/article/redis-distributed-lock-deep-dive/)
- [Django JWT 双 Token 认证：访问令牌与刷新令牌](/article/django-jwt-dual-token-auth/)
