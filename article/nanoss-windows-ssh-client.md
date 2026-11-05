---
title: "NanoSSH：13 MB 的 Windows SSH 客户端怎么做"
slug: nanoss-windows-ssh-client
cover_image: /photos/nanoss-windows-ssh-client-cover.png
date: 2026-11-05
tags: [Go, Wails, SSH, 桌面应用, 协议]
---

> 适用读者：想用 Go 加 WebView 做轻量桌面工具，或正在处理终端字节流、SSH 协议细节的开发者。
> 结论先行：这个项目的关键不在功能数量，而在几处容易错的边界：IPC 的序列化方式、终端字节流的反压、PTY 参数顺序、主机密钥信任模型和 Windows 平台细节。
> 阅读时间约 30 分钟 | 难度：进阶 | 收获：一套可复用的桌面 SSH 架构，以及十二个真实问题的定位与取舍。

**目录**

- 一个刻意做窄的 Windows SSH 客户端
- 架构：把风险放在可替换的那一层
- 问题一：README 写二进制 WebSocket，实现是 base64 事件桥
- 问题二：汉字跨块变 U+FFFD
- 问题三：反压闭环与 ack 的三个坑
- 问题四：PTY 的宽高顺序
- 问题五：known_hosts 与 TOFU 的硬边界
- 问题六：Windows ssh-agent 的命名管道
- 问题七：托盘“点了没反应”
- 问题八：14 MB 体积红线
- 问题九：高 DPI 闪烁与尺寸归零
- 问题十：SFTP 与转发：复用连接，但别复用生命周期
- 问题十一：密码、旧密码与凭据自愈
- 问题十二：密钥管理的三个边界
- 小结
- 相关阅读

---

## 一个刻意做窄的 Windows SSH 客户端

NanoSSH 的定位可以先说清楚：它是 Windows 上的 SSH 客户端，只做五件事——服务器列表、终端、SFTP、本地端口转发、密钥管理。没有账号、云同步、插件市场、AI 助手，也没有自动更新。功能窄是产品主张，不是排期没做完。

技术栈是 Wails v2 加 WebView2。Go 后端分成三块：`internal/sshcore` 是纯 SSH 内核，不依赖任何 UI；`internal/shell` 是 Wails 绑定门面，负责会话、文件、转发、密钥和托盘；`internal/store` 负责本地落盘。前端是零框架的 TypeScript，DOM 由手写的 `h()` 构造，状态用 `@preact/signals-core`，终端用 xterm.js 6。整个前端运行时依赖只有 7 个，其中 6 个是 xterm 及其 addon。

构建产物是单文件可执行程序，x64 下 13.23 MB，没有外部运行时。`build.ps1` 把 14 MB 设为硬上限，超过就直接构建失败。Go 直接依赖 5 个，间接依赖 27 个。这些数字不是宣传语，而是后面许多技术选择的约束条件：拒绝 SQLite、手写托盘、不用第三方 systray、尽量不引入新的模块。

也正因为约束足够硬，这个项目里留下的问题都比较“具体”：不是“要不要支持某某功能”，而是“为什么这个汉字变成了问号”“为什么点托盘图标没反应”“为什么 vim 一打开就错行”。下面按问题展开，每个问题都写清现象、原因、解决和代价。

## 架构：把风险放在可替换的那一层

这个项目最重要的架构决定，是把 SSH 协议逻辑和 UI 外壳彻底分开。`sshcore` 不知道 Wails、WebView2、xterm 的存在，只暴露连接、会话、SFTP、转发、密钥解析这些能力。`shell` 负责把内核能力翻译成前端可调用的绑定方法，并把字节流搬进事件通道。前端再通过 `ipc/api.ts` 和 `ipc/transport.ts` 两层的封装访问后端。

这样做的好处是，风险被放在可替换的那一层。Wails 是外壳，未来如果要换成裸 WebView2 或别的窗口容器，只需要改 `main.go`、`internal/shell` 的绑定层和前端两个 IPC 文件；`sshcore` 一行不用动。反过来说，协议层的测试也不需要打开窗口，进程内的测试 sshd 就能把连接、PTY、SFTP、转发全部跑通。

后端的事件出口被抽成了一个函数类型，而不是直接写死 Wails 调用：

```go
type emitFunc func(ctx context.Context, eventName string, data ...any)
```

`App` 和 `shellSession` 都持有这个字段，生产环境赋值为 `runtime.EventsEmit`，测试里换成收集器。这个小小的间接层，是后面能把反压、主机密钥询问、传输进度放进自动化测试的前提。

落盘侧也遵循同样的窄口径：`servers.json` 是唯一的数据库，版本号为 1，读取时先做纯函数迁移，保存时先备份 `.bak`，再走临时文件、fsync、rename。`known_hosts` 用标准 OpenSSH 格式，可以直接和系统的同名文件互拷；私钥目录放标准 OpenSSH 私钥；日志单独放 `logs` 下。数据根目录默认 `%APPDATA%\NanoSSH`，测试和便携模式用 `NANOSSH_DATA_DIR` 覆盖。整个存储没有隐藏的二进制格式，出问题时可以用文本编辑器直接打开看。

窗口层还有几个与业务无关但影响体验的装配：无边框窗口的标题栏由前端自绘，Wails 保留缩放热区和投影；单实例锁保证第二次启动只唤起已有窗口，而不是再开一个进程；Mica 背景通过注册表读取 `CurrentBuildNumber`，只有 22621 及以上才启用半透明，老系统自动退回不透明，避免得到一个没有底色的透明窗口。前端通过 `MicaEnabled()` 感知这个决定，再决定标题栏和侧栏是否做成半透明表面。

前端同样有一条明确的缝。`views`、`term`、`components` 一律不直接碰 `window.go`，所有绑定调用和事件订阅都从 `api.ts` 出去。终端字节搬运单独放在 `transport.ts`，它也是整个前端里唯一与外壳强相关的模块。以后换掉 Wails 时，要重写的范围是被刻意圈定的。

## 问题一：README 写二进制 WebSocket，实现是 base64 事件桥

现象：第一次读 README 时会看到“二进制 WebSocket IPC + ack 反压”这句话，但翻遍代码，找不到自建的 WebSocket 服务，也找不到二进制帧的封装。终端数据实际走的是 Wails 的 `runtime.EventsEmit`，事件名是 `term:data:<sessionId>`。

原因：README 描述的是最初的设计意图，而实现最终选了 Wails 自带的事件桥。同一份 README 后面的架构说明又写着“Worker 解 base64”，前后并不一致。Wails 的绑定调用本身是 JSON 序列化，事件传参也一样。Go 侧的 `[]byte` 经过事件桥后，到了前端手里已经变成 base64 字符串。依赖树里确实有 `gorilla/websocket`，但它是 Wails 的间接依赖，不是这套 IPC 的实现。

解决：没有为了迎合 README 去自建 WebSocket，而是承认事件桥的能力边界，并针对它的缺点做补偿。补偿分两步：前端用 Web Worker 解码 base64，再把 `ArrayBuffer` 通过 Transferable 转移给主线程，避免解码阻塞渲染；解码后的字节直接交给 xterm 的 `write`，不在主线程做字符串拼接。

```ts
function decodeBase64(input: string): Uint8Array {
  const bin = atob(input);
  const len = bin.length;
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) out[i] = bin.charCodeAt(i);
  return out;
}

ctx.onmessage = (e: MessageEvent<string>) => {
  const buf = decodeBase64(e.data);
  ctx.postMessage(buf, [buf.buffer]);
};
```

代价与遗留：base64 让 IPC 的字节量理论上有约 33% 的膨胀，16 KiB 的终端块会变成约 21.8 KiB 的字符串；Go 侧还要做一次 JSON 序列化，WebView 侧要做一次 base64 解码。换来的好处是不用自己维护一条 WebSocket 服务、不用处理连接鉴权、不用在 Wails 之外再开一个端口。这个取舍对局域网或本机 SSH 客户端是可接受的，但 README 的表述不准确。后来正确的做法是把文档改成“Wails 事件桥 + base64 解码”，而不是继续保留一个听起来更快的名词。工程文档里，描述实现比描述愿望重要。如果未来真的改回二进制 WebSocket，Wails 的单实例、同源事件分发和无额外端口这些优势就没了，还要自己解决本地鉴权与跨进程攻击面；这也是最终没有为了文档改实现的原因。

Worker 不可用时（例如某些受限的 WebView 环境）`createDecoder` 会退回主线程同步 `atob`。这时解码会占用渲染线程，长输出更容易卡，但至少功能不缺失。每个终端会话各自持有一个 Worker，切标签不会销毁，只有关闭会话才 `terminate`；代价是会话多时内存里会多几个 Worker 实例。

## 问题二：汉字跨块变 U+FFFD

现象：终端里执行一条包含中文、韩文或 emoji 的 `echo`，偶尔会在输出中间出现 `�`。不是每次都有，输出越长、机器越慢时越容易复现。

原因：最初后端在读取远端字节后做了 `string(buf[:n])`，并按行切分再发往前端。SSH 通道的读取边界和字符边界没有任何关系，一个三字节的汉字完全可能被切在两次 `Read` 之间。把半个字符转成字符串，Go 只能补上 U+FFFD。只要中间做过一次 UTF-8 解码，后面的拼接就再也补不回来。

解决：后端全程 `[]byte` 直通。读取缓冲固定 32 KiB，读到的字节立刻复制一份送进深度为 8 的 `chunks` 通道；`pumpSession` 只做合并、攒批和发送，不做行切分，也不做解码。stdout 和 stderr 各自有独立的读取协程，但都写入同一个通道，由单一消费者输出。前端 xterm 拿到的是原始字节，由它自己完成解码和宽字符处理。

这里还要区分两条路径：交互式 shell 走 `pumpSession` 的流式读取；非交互的 `RunCommand` 则用 `limitedBuffer` 收集输出，单次上限 8 MiB，超出部分静默丢弃但不阻断远端。后者只用于探针和批处理，不能拿来做大文件读取；真正的大输出必须走 shell 或 SFTP 的流式接口。

```go
buf := make([]byte, 32<<10)
for {
    n, err := rd.Read(buf)
    if n > 0 {
        cp := make([]byte, n)
        copy(cp, buf[:n])
        select {
        case chunks <- cp:
        case <-sess.done:
            return
        }
    }
    if err != nil {
        return
    }
}
```

验证这条路径的测试是 `TestShellUTF8Passthrough`。它让远端回显 `你好，世界 한국어 日本語 emoji🙂`，然后断言整行内容与原文完全一致，并且不包含 U+FFFD。另一个测试用 40,000 字节的单行回显压过 16 KiB 的分块上限，强制走多轮 flush 与 ack，确认没有丢字节。非交互路径上还有一个 8 MiB 的 flood 命令，用来确认大输出能被连续读完。

代价与遗留：后端放弃了按行处理的能力。如果未来要做服务端的关键字过滤、日志落盘或命令审计，就不能在字节流上直接做，必须在前端或单独的解析层完成。另一个代价是每个块都要复制一次，因为读取缓冲会被下一轮 `Read` 复用；这是用少量内存拷贝换取正确的所有权语义。stdout 和 stderr 两个 reader 的顺序仍然无法严格保证，只是 PTY 会把它们合并，实际观感通常没有问题。

## 问题三：反压闭环与 ack 的三个坑

现象：如果只是“读到就发”，本地 `cat` 一个大文件时，WebView 的事件队列会越堆越长，终端先是延迟，然后整窗卡住；更糟的情况是前端已经销毁，Go 的读协程还在等一个永远不会来的回执，会话既读不动也关不掉。

原因：Wails 的事件发送没有提供“前端处理完了”的信号。xterm 的 `write` 是异步的，缓冲区里的数据没渲染完，继续灌只会让延迟无上限累积。SSH 通道本身有窗口，但窗口只覆盖到 Go 的读取端，覆盖不到 WebView 的渲染端。中间这段没有闭环，压力就堆在进程内存里。

解决：把 ack 做成显式的端到端反压。后端一次只发一段，前端在 xterm 的 `write` 回调里回执，后端收到回执才继续读。常量是三个：单次最多 16 KiB、攒批最多 8 毫秒、等回执最多 30 秒。`ackCh` 容量为 1，`AckTermData` 用 `select/default` 丢重复回执。

```go
flush := func() {
    if len(pending) == 0 {
        return
    }
    data := pending
    pending = nil
    sess.emit(sess.ctx, "term:data:"+sess.id, data)
    select {
    case <-sess.ackCh:
    case <-sess.done:
    case <-time.After(termAckTimeout):
        wruntime.LogWarning(sess.ctx, "terminal: 等待前端回执超时，放行继续读取")
    }
}
```

前端这一侧用 Promise 链把 `write` 和 `ack` 串起来，防止慢渲染时回执乱序：

```ts
this.chain = this.chain
  .then(() => this.handlers.onData(bytes))
  .then(() => (this.disposed ? undefined : backend.ackTermData(this.sessionId)))
  .catch((err) => console.error("[nanossh] 终端写入失败：", err));
```

这里有三个坑。第一，前端可能先于后端等待而回 ack，所以 `ackCh` 必须有 1 的容量，否则第一个回执会被丢掉。第二，`dispose` 时必须补一次 ack，否则后端的读协程会一直挂到 30 秒超时。第三，重复 ack 必须被安全丢弃，因为链路上任意时刻只允许一个块在飞，多出来的回执没有语义。

`flush` 里还有一个容易被忽略的细节：等待回执期间如果 `chunks` 通道被排空，计时器可能已经触发过，所以下一次进入循环前要先 `Stop` 并排掉已触发的值，否则会立刻再 flush 一次。8 毫秒的攒批不是为了省事件，而是为了把按键回显这类小包尽快送出去；如果只按 16 KiB 攒，交互会明显变钝。

这套闭环的测试里，收集器的 ack 是在事件回调里同步发出的，等价于“前端已经渲染完”的最快情况；真实浏览器还要经过 Worker 解码、Transferable 转移和 xterm 渲染，所以线上的块间隔会比测试大。

代价与遗留：吞吐上限被渲染速度锁死，这是有意的，因为终端场景要的是低延迟而不是最大带宽。ack 没有携带块序号，所以实现上只能保证“单块在飞”；如果以后要并行多个块，就必须把 ack 改成带 ID 的确认。30 秒超时是兜底而不是正常路径，它会把“前端卡死”变成“后端继续读”，可能掩盖真正的渲染故障，日志里要能看出来。测试里的收集器在收到数据后立即 ack，正好模拟了前端渲染完成的那一刻；少了这个回执，`pumpSession` 在发出第一段后就会永久等待。

## 问题四：PTY 的宽高顺序

现象：在本地终端里 `vim` 打开正常，连到 NanoSSH 后整屏错位，`htop` 的列也对不上；把窗口拉大再拉小，有时又“碰巧”正常。最初以为是 xterm 的 `fit` 算错了，查了很久才发现问题在后端。

原因：PTY 尺寸有两个互相矛盾的命名习惯。RFC 4254 的 `pty-req` 和 `window-change` 线上编码是“宽在前、高在后”，也就是先传列数再传行数；而 `golang.org/x/crypto/ssh` 的 `RequestPty(term, h, w, modes)` 和 `WindowChange(h, w)` 的参数语义是“行在前、列在后”。封装层只要照着 RFC 的字段顺序去调 x/crypto，两个值就会互换。`vim` 拿到 80 行、24 列，自然会错。

解决：项目内统一 API 一律写成 `(rows, cols)`，行在前、列在后。`sshcore.ShellOptions`、`Shell.Resize`、`shell.StartShellRequest`、前端 `resizeShell` 全部遵守这个约定，并且在注释里把 RFC 与 x/crypto 的差异写清楚。更关键的是用测试把顺序钉死：`TestStartShellPTYParamOrder` 让测试 sshd 按 RFC 原样解析 `pty-req`，断言服务端读到的是 `rows=30, cols=100`；如果封装层传反，测试会直接报“参数错位”。

```go
if err := sess.RequestPty(term, rows, cols, opts.Modes); err != nil {
    sess.Close()
    return nil, fmt.Errorf("sshcore: 请求 PTY（%dx%d）失败: %w", cols, rows, err)
}
```

注意错误文案里的 `%dx%d` 仍然是“列 x 行”，这是给人看的；真正的参数顺序是 `rows, cols`。这两个视角必须同时存在，否则读代码的人会被绕晕。

默认尺寸也有兜底：`rows` 或 `cols` 小于等于 0 时回落到 24×80，避免前端在容器尚未布局时传 0 进来。`Resize` 对非法尺寸直接报错，不允许把 0 行 0 列写到远端。前端 `fit()` 在容器还没布局完成时可能抛错，封装里直接吞掉并返回当前的 `term.rows` 与 `term.cols`，等下一次 `ResizeObserver` 再算。

代价与遗留：前端的 `fit()` 返回 `{ rows, cols }`，调用后端时必须按 `(rows, cols)` 传，代码里用注释反复提醒。`window-change` 是 `wantReply=false` 的“发后不管”，函数返回只代表字节写进了连接，不代表远端已经应用，所以测试必须轮询服务端的记录，不能立即断言。拖动窗口时还会产生大量 resize 请求，前端做了 150 毫秒去抖，代价是远端看到新尺寸会稍有延迟。

## 问题五：known_hosts 与 TOFU 的硬边界

现象：第一次连接陌生主机时应该弹指纹卡；如果主机的密钥变了，应该明确阻断，而不是给一个“忽略一次”的按钮让用户顺手点过去。真正实现时，`knownhosts` 返回的错误类型很容易被笼统处理，结果把“未知主机”和“指纹变化”混成一类。

原因：`knownhosts.New` 返回的 `KeyError` 里，`Want` 字段为空表示“这个主机没有记录”，非空表示“有记录但本次出示的密钥不匹配”。前者是 TOFU，后者是可能的中人攻击信号。另外还有独立的 `RevokedError`，对应 known_hosts 里的 `@revoked` 行，必须硬阻断，不能询问。把这三者混在一起，就会出现“指纹变了也允许仅本次”的严重漏洞。

解决：回调里先处理 `RevokedError`，直接返回错误；再判断 `KeyError.Want` 是否非空。未知主机走三档：仅本次、信任并保存、取消。指纹变化只接受“显式替换”，`HostKeyAcceptOnce` 和拒绝都会产生 `ErrHostKeyRejected`。替换时按地址匹配旧条目，写入新的公钥行。写入采用“临时文件 → fsync → rename”，权限 0600。`knownhosts.New` 要求文件存在，所以首连之前要先 `ensureFile`，创建父目录并落一个空文件；否则第一次连接还没弹指纹卡就会先报“解析 known_hosts 失败”。

```go
if len(keyErr.Want) > 0 {
    change := &HostKeyChange{Info: info}
    for _, wk := range keyErr.Want {
        change.OldFingerprints = append(change.OldFingerprints,
            ssh.FingerprintSHA256(wk.Key))
    }
    decision, perr := prompt(info, change)
    if perr != nil {
        return perr
    }
    if decision != HostKeyAcceptAndSave {
        return fmt.Errorf("%w（指纹变化）", ErrHostKeyRejected)
    }
    return writeKnownHost(knownHostsPath, hostname, key, true)
}
```

测试覆盖了三档行为：首次询问并保存、第二次不再询问、服务端轮换密钥后必须阻断且回调能拿到旧指纹；另一个测试确认“仅本次”不会落盘，两次连接都会再问。

代价与遗留：`known_hosts` 支持哈希主机名（`|1|...`），而替换逻辑无法反查哈希条目，遇到这种行只能跳过并追加新行。结果是旧的哈希记录仍留在文件里，后续连接可能继续报指纹变化，需要用户手工清理。这是一个已知边界，代码注释里写明了“哈希形式无法反查，一律视为不命中并保留”。另外，Windows 上 `0600` 只是意图，实际访问控制来自 `%APPDATA%` 继承的 ACL；这一点在密钥落盘的测试里也有说明。

## 问题六：Windows ssh-agent 的命名管道

现象：用户明明装了 Windows OpenSSH，`ssh-add` 也能列出密钥，NanoSSH 的 agent 认证却一直失败；如果机器上还装了 Git Bash，`SSH_AUTH_SOCK` 环境变量存在，但拿它去拨号同样拨不通。

原因：Windows 上没有 Unix 域套接字，Windows OpenSSH 的 agent 监听的是固定命名管道 `\\.\pipe\openssh-ssh-agent`。`SSH_AUTH_SOCK` 在 Windows 上即便存在，也可能是 Cygwin 或 MSYS 的私有格式，Go 的 `net.Dial("unix", ...)` 根本连不上。另一个问题是管道存在但所有实例都忙时，`CreateFile` 会返回 `ERROR_PIPE_BUSY`，如果直接报错，用户看到的就是“agent 不可用”。

解决：手写 `CreateFile` 加 `WaitNamedPipe` 等价逻辑，不引入 `winio`。固定管道名，3 秒截止时间，遇到 `ERROR_PIPE_BUSY` 每 50 毫秒重试一次。连接成功后用 `agent.NewClient` 包起来，并在认证前先 `List()` 一次密钥串；空列表就明确提示“请先 ssh-add”，而不是把 `no supported methods remain` 这种库内文案甩给用户。`authMethods` 返回一个 `io.Closer`，握手失败时会关闭它，连接成功则挂到 `Client` 上随连接一起关闭；这样 agent 管道不会因为一次失败握手而泄漏。

```go
deadline := time.Now().Add(agentDialTimeout)
for {
    h, err := windows.CreateFile(name, windows.GENERIC_READ|windows.GENERIC_WRITE,
        0, nil, windows.OPEN_EXISTING, 0, 0)
    if err == nil {
        return os.NewFile(uintptr(h), agentPipeName), nil
    }
    if err != windows.ERROR_PIPE_BUSY || time.Now().After(deadline) {
        return nil, fmt.Errorf("sshcore: 无法连接 ssh-agent（%s）: %w；"+
            "请确认 Windows 的「OpenSSH 身份验证代理」服务已启动", agentPipeName, err)
    }
    time.Sleep(50 * time.Millisecond)
}
```

有一条 Windows 专用测试专门断言这个路径真的被送进了管道命名空间：没有 agent 时，错误必须是 `ERROR_FILE_NOT_FOUND` 或 `ERROR_PIPE_BUSY`，不能是 `ERROR_INVALID_NAME`。这样如果哪天 Go 或 `x/sys` 对设备路径的处理变了，测试会先炸，而不是等用户报“agent 永远失败”。

代价与遗留：只支持 Windows OpenSSH 的 agent，不支持 PuTTY 的 Pageant，也不打算为了兼容再去引一套第三方协议。3 秒是硬上限，管道一直忙时宁可给出明确报错，也不让连接界面无限转圈。如果用户同时开了多个 SSH 客户端，命名管道会发生争用，重试窗口内的失败是正常的；超过 3 秒仍然拿不到句柄，才判定为不可用。这个阈值比 TCP 建连的 15 秒短，是因为 agent 是本机资源，正常情况下应当在毫秒级返回。agent 连接句柄随 SSH 连接一起关闭，避免每次连接都漏一个管道句柄。

## 问题七：托盘“点了没反应”

现象：关窗后应用缩进托盘，图标能看到，但双击没反应，右键菜单也弹不出来。日志里没有任何错误，进程还活着。

原因：Win32 的窗口消息按线程投递，消息窗口和 `GetMessage` 循环必须绑定在同一个 OS 线程上。Go 的 goroutine 在阻塞调用前后可能漂移到另一个 OS 线程，如果建窗在一个线程、`GetMessage` 在另一个线程，消息就永远收不到。这个症状非常像“图标没挂上”，但实际上是消息循环收不到回调。

解决：托盘线程在入口处调用 `runtime.LockOSThread()`，并在退出时解锁；创建消息窗口和进入 `GetMessage` 循环都在这个被锁定的线程上完成。窗口用 `HWND_MESSAGE` 的消息窗口，不占屏幕；托盘回调、气泡、右键菜单都通过自定义消息投递。创建过程是同步握手：`newTray` 阻塞等待就绪或 3 秒超时，失败就返回错误，调用方放行正常关闭，绝不留下“窗口藏起来了、图标却没挂上”的失联状态。

```go
func (t *tray) run(done chan<- error) {
    runtime.LockOSThread()
    defer runtime.UnlockOSThread()
    // 注册窗口类、创建消息窗口、Shell_NotifyIcon，然后进入 GetMessage 循环
}
```

托盘是懒创建的：窗口开着时不占通知区，只有真的要收进托盘时才挂图标。这个决定还带来一个好处：如果托盘创建失败，用户可以正常退出，而不是被迫留在一个没有出口的后台进程里。气泡提示只弹一次，用一个 `trayTipShown` 标记保证不反复打扰；右键菜单用 `TPM_RETURNCMD` 直接拿返回值，不绕 `WM_COMMAND`；退出时通过自定义消息销毁图标并结束消息循环。

代价与遗留：一个 OS 线程被长期锁定，托盘生命周期内不能做阻塞操作；回调里只做发消息和状态切换，重活都扔回主逻辑。Win32 的消息回调还必须避免 panic 穿透，项目在 `wndProc` 里对每个分支做了防御，菜单命令通过 channel 送回业务层，托盘线程本身不碰数据库和网络。项目只允许一个托盘图标，所以用包级变量绑定 `wndProc`，而不是 `SetWindowLongPtr`。手写 Win32 代码约两百行，可维护性不如第三方库，但换来了零新增依赖和更小的体积。

## 问题八：14 MB 体积红线

现象：功能加着加着，产物从 10 MB 出头涨到 13.23 MB，离 14 MB 的上限只剩不到 0.8 MB。此时任何“顺手引一个库”的决定都可能让构建直接失败。

原因：Wails 运行时本身就不小，`x/crypto` 的 SSH 实现、WebView2 加载器、前端打包产物都在里面。依赖树里还有一批 Wails 的间接依赖，比如 echo、gorilla/websocket、各种字符串和模板库，它们不一定都走到，但会进模块图。如果再用 SQLite 或第三方托盘库，体积会迅速失控。

解决：把体积从口头约定变成构建断言。`build.ps1` 固定 `GOARCH=amd64`、`CGO_ENABLED=0`，用 `wails build -ldflags "-s -w"` 剥掉符号和调试信息，然后检查 PE 头的 machine 字段必须是 `0x8664`，最后按 MB 检查产物大小，超过阈值直接 `throw`。

```powershell
$sizeMB = [math]::Round((Get-Item $exe).Length / 1MB, 2)
if ($sizeMB -gt $MaxSizeMB) {
    throw "体积超限：$sizeMB MB > $MaxSizeMB MB。定位是'极致轻'，先查依赖增量再提阈值。"
}
```

具体选型上，拒绝 SQLite：服务器数据是几十条级别，`modernc.org/sqlite` 预计会带来 4 到 6 MB 的增量，完全不划算；改用 JSON 文件，原子写加 `.bak` 备份，既小又方便手工修复。托盘不引第三方库，手写 `Shell_NotifyIconW`。前端只保留 7 个运行时依赖，不引 UI 框架。密钥、known_hosts、servers.json 全部用标准格式，不额外造二进制容器。前端产物通过 `go:embed all:frontend/dist` 直接嵌进可执行文件，没有外部资源目录；`wails.json` 驱动前端构建，`build.ps1` 只负责 Go 侧和产物断言。CI 里还跑 `govulncheck`，因为 `x/crypto` 的 advisory 需要可持续发现，不能等出问题再查。

代价与遗留：JSON 存储意味着每次保存都要整文件重写，数据量大时会变成 O(n)，但对几十条服务器可以接受；没有 SQL 查询能力，未来要做复杂检索得自己写。手写 Win32 和手写 DOM 构造器增加了维护成本。体积守卫本身也脆：换一个 Go 版本、Wails 版本或前端依赖，数字就可能跳变，阈值需要跟着复核；断言发生在 Wails 构建之后，失败时已生成的 exe 会被保留供分析，但 CI 会直接判定失败。还有一个容易忽略的点是构建机的 Go 工具链如果是 32 位发行版，默认产物会是 386，脚本必须显式钉死 `amd64`，否则会得到一个能跑但架构不对的包。

## 问题九：高 DPI 闪烁与尺寸归零

现象：窗口在 100% 和 150% 缩放的显示器之间拖动时，WebView2 会反复重绘，界面闪烁；在会话内从“终端”切到“文件”再切回来，xterm 的光标位置会按旧列宽错位，有时终端直接变成一条细线。

原因：两个问题叠在一起。第一，WebView2 在高 DPI 或多显示器切换时会收到密集的 resize 事件，如果每次 resize 都立刻重排，就会看到闪烁。第二，会话内的子视图切换用的是 `display:none`，被隐藏的 `.term-host` 尺寸归零，`ResizeObserver` 会收到 0×0 的观察值；此时调用 `fit()` 会把行列算成极小值，再切回来就错位。

解决：窗口层设置 `ResizeDebounceMS=120`，让 Wails 对 WebView2 的重绘做去抖；前端自己再做 150 毫秒的 resize 去抖，跳过宽或高小于 4 像素的观察值，并在 `requestAnimationFrame` 之后重新 `fit` 和同步尺寸。切回终端子视图时也走 `rAF`，等布局完成再量。从密钥页切回服务器页时调用 `refitAll()`，确保所有可见终端重新贴合容器。

```ts
const ro = new ResizeObserver(() => {
  for (const [id, handle] of terminals) {
    const host = hosts.get(id);
    if (!host || panes.get(id)?.hidden) continue;
    if (host.clientWidth < 4 || host.clientHeight < 4) continue;
    handle.fit();
    handle.syncSize();
  }
});
```

WebGL 渲染器也在这一层做了降级：`new WebglAddon()` 放在 `try` 里，初始化失败就保持 xterm 默认的 DOM 渲染器；上下文丢失时主动 `dispose()`，同样退回 DOM。功能不受影响，只是长输出时更吃 CPU。窗口还启用了 PerMonitorV2 DPI 感知（manifest 里声明），否则跨显示器时 WebView2 会被系统位图拉伸，文字发虚；深浅色跟随系统，Mica 只在 build 22621 以上启用，老系统走不透明背景，避免透明窗口没有底色。

代价与遗留：120 毫秒和 150 毫秒两层去抖会叠加，拖动结束后远端 PTY 要稍晚一点才拿到最终尺寸；对交互式终端来说这是可感知但不难受的延迟。跳过小于 4 像素的尺寸避免了 0×0 的坑，但也意味着极小的布局变化不会触发重算。WebGL 降级后没有提示，用户只会觉得滚动变慢；这是为了不打扰主流程做的取舍。

## 问题十：SFTP 与转发：复用连接，但别复用生命周期

现象：最初每个文件面板都新建一条 SSH 连接，转发规则也各自拨号。结果是打开文件面板会多一次握手，服务器上多一条登录记录；更糟的是关掉会话标签后，本地监听端口还被占着，因为转发对象没有跟着会话一起释放。

原因：SFTP 和端口转发在协议上都只是同一条 SSH 连接上的额外通道。SFTP 是 `sftp` 子系统通道，本地转发是每个连接一条 `direct-tcpip` 通道。它们不需要重新拨号、握手、认证。真正需要设计的是生命周期：通道挂在会话上，会话关闭时必须把通道、监听和规则一起收掉。

解决：SFTP 懒创建并缓存。第一次 `SftpOpen` 时在已有 `ssh.Client` 上开子系统，之后复用同一个 `sftp.Client`；测试断言两次打开只产生 1 条 SSH 连接和 1 个 SFTP 通道。端口转发按会话维护规则表，新增时先校验端口和主机，再监听 `127.0.0.1`；每个进来的本地连接通过 `ssh.Dial` 开一条 `direct-tcpip`，双向各用一个 32 KiB 缓冲搬运，统计活动连接、累计连接和双向字节数。会话关闭时 `dropForwards` 统一关闭监听、掐断在途连接，并推送 `removed` 状态。

```go
func (f *Forward) handle(local net.Conn) {
    remote, err := f.ssh.Dial("tcp", f.remoteAddr)
    if err != nil {
        local.Close()
        return
    }
    // 登记 pair，双向 splice；任一端关闭都会让两个方向收工
}
```

细节上还有几处补丁。SFTP 重命名优先用 `PosixRename`，服务端不支持时回退标准 `Rename`；符号链接只在“是链接且不是目录”时补一次 `Stat`，避免大目录里每条目都多一次往返；删除只做空目录，不做递归删除，因为递归一旦路径算错就是不可逆的。转发只绑 `127.0.0.1`，把服务暴露到局域网必须是显式决定；端口冲突直接报错，不留下半成品规则。传输进度事件有 120 毫秒的下限间隔，避免每 32 KiB 都推一次事件把 WebView 打满；取消通过 `context` 传递，`shuttle` 每读一块前先看 `ctx.Err()`，取消后终态是 `cancelled` 而不是 `done`。转发统计也复用同一个间隔，并且只在数值变化时推送，空闲规则不会每 120 毫秒打一次无意义的事件。

代价与遗留：所有通道共享同一条 TCP 连接，终端、SFTP、转发会争用同一条链路的带宽和 SSH 连接级资源；单个大文件传输可能让终端回显变慢。没有实现远程转发（`-R`）和动态转发（`-D`），只做本地 `-L`。下载时为了拿文件大小会先打开一次远端文件再关闭，真正传输时重新打开，多了一次往返；这是为了避免长时间持有两个句柄。递归上传和递归删除都明确不支持。

## 问题十一：密码、旧密码与凭据自愈

现象：用户改了远端密码后，NanoSSH 每次点击连接都直接失败，而且再也没有机会输入新密码；另一个方向是，用户在弹窗里手滑打错一次密码，错误的密码却被存进了凭据管理器，下次连接继续失败。

原因：如果“用户输入密码”和“保存密码”绑在同一次调用里，认证失败也会落库；如果保存的旧密码失效后不删除，前端看到 `HasPassword` 为真就不再弹框，用户被永久卡在“点了就失败”的死角。删服务器时如果只删 `servers.json` 记录，凭据管理器里会留下指向不存在主机的孤儿密码。

解决：认证成功后才保存密码；认证失败且本次没有用户输入时，删除已保存的密码，让下次连接重新询问。删除服务器时同步删除 `NanoSSH/server/<id>` 凭据。`HasPassword` 只回答“有没有”，前端据此决定直接连还是先弹框；用户也可以显式“清除已保存密码”。`HasPassword` 只看能否取回，不返回密码本身，避免把秘密带到前端；`ForgetPassword` 是幂等的，重复清除不报错。前端在密码认证且本次未提供密码时先问 `HasPassword`，有就直接连，没有才弹框，这样正常使用不会每次都被问一遍。私钥口令同理：解析失败且本地存有口令时，先删旧口令，再带 `retry` 标记询问，最多重试 3 次。

```go
if srv.Auth == sshcore.AuthPassword && req.Password != "" {
    if serr := a.secrets.Set(store.PasswordTarget(srv.ID), req.Password); serr != nil {
        wruntime.LogWarning(a.ctx, "保存服务器密码失败: "+serr.Error())
    }
}
```

凭据存进 Windows 凭据管理器，使用 `wincred` 的通用凭据，`PersistLocalMachine`，target 是 `NanoSSH/server/<id>` 或 `NanoSSH/key/<id>`。没有自研加密文件，因为那是“自研密码学”的经典陷阱；凭据管理器用 DPAPI 绑定当前用户，只有本人登录后能读回，也不会随数据目录被拷走。

代价与遗留：认证失败的自愈依赖 `strings.Contains(err.Error(), "unable to authenticate")`，这是对 `x/crypto` 错误文案的字符串匹配；库一改文案，自愈就失效。更稳的做法是识别具体的认证错误类型，但当前实现选择了简单路径。凭据绑定 Windows 账户，换机后无法解密是正确行为；用户复制 `servers.json` 和 `keys` 到新机器后，密码需要重新输一次。密码在进程内存中仍是明文，应用没有主密码或内存加密，这是桌面 SSH 客户端的常规边界。凭据管理器里的记录对同一用户的其他程序并非不可见：任何以该用户身份运行的程序都能枚举 target 并读取。这是 Windows 凭据模型的边界，不是 NanoSSH 能单独解决的；它只保证秘密不落在明文 JSON 里，以及不随数据目录被复制。

## 问题十二：密钥管理的三个边界

现象：导入一把 FIDO 安全密钥时，界面报“解析私钥失败”，看起来像文件损坏；生成 RSA 密钥时，如果默认 2048 位，又会被基线要求淘汰；删除一把仍被服务器引用的密钥，如果“顺手”改了服务器的认证方式，用户下次连接会莫名其妙失败。

原因：FIDO 密钥的私钥句柄永远留在硬件里，Go 的 `ssh` 库不支持，必须明确告诉用户“这不是文件坏了，是算法不支持”。RSA 2048 已不够，4096 生成要数秒，交互体验太慢。密钥被引用时直接删除会造成死引用，而暗改服务器配置比报错更难排查。

解决：只支持 ed25519、RSA 3072、ECDSA P256 三种算法，生成 OpenSSH 原生格式，公钥行可直接粘到 `authorized_keys`，指纹与 `ssh-keygen -lf` 一致。FIDO 的判断必须在解出的 PEM 二进制载荷里做，因为 OpenSSH 私钥把算法名作为明文字符串存在二进制体内，外层是 base64，在 PEM 文本上搜 `sk-` 是搜不到的。

```go
if block, _ := pem.Decode(pemBytes); block != nil {
    if bytes.Contains(block.Bytes, []byte("sk-ssh-ed25519")) ||
        bytes.Contains(block.Bytes, []byte("sk-ecdsa-sha2")) {
        return nil, ErrKeyFIDOUnsupported
    }
}
```

私钥文件用 ULID 命名，而不是用户取的名字：既杜绝重名和路径穿越，也让密钥可以随便改名。导入时先解析再落盘，解析成功同时证明“这确实是一把可用私钥”并且拿到了准确的公钥和指纹；解析失败不会留下“记录有了、指纹为空”的半成品。三种失败路径被刻意区分：需要口令返回 `ErrKeyEncrypted`，硬件密钥返回 `ErrKeyFIDOUnsupported`，其余才是文件本身有问题。导入时如果没给名字，默认取源文件名去掉扩展名；带口令的导入成功后顺手把口令存进凭据管理器，第一次连接就不用再问。删除密钥前扫描服务器列表，仍被引用就拒绝，并在报错里点名是哪几台服务器。删除顺序是先落盘记录、再删文件，避免“记录还在、文件没了”的死引用。

代价与遗留：不支持 FIDO 安全密钥，也不支持 agent forwarding；这两项都被明确写进错误文案，而不是静默失败。RSA 3072 的生成速度比 2048 慢，但比 4096 好得多，是一个折中。密钥目录的 `0600` 在 Windows 上同样只是意图，实际保护来自 `%APPDATA%` 的 ACL。没有密钥轮换、没有多密钥绑定，功能面刻意保持窄。

## 小结

NanoSSH 的实现价值不在“做了多少功能”，而在把几个容易错的边界钉死了。IPC 选择了 Wails 的 base64 事件桥，承认 33% 的膨胀，用 Worker 解码和 Transferable 抵消开销；终端字节流全程 `[]byte`，不做行切分和解码，用 16 KiB 分块、8 毫秒攒批和 ack 闭环把延迟压在渲染端；PTY 参数统一成 `(rows, cols)`，用测试防止 RFC 与 x/crypto 的顺序再次错位；主机密钥区分未知、变化、吊销三种情况，指纹变化只允许显式替换；Windows 平台细节则落在命名管道、`LockOSThread`、ResizeDebounce 和 14 MB 体积守卫上。

这些决定都有代价：吞吐受渲染限制、哈希 known_hosts 条目无法自动替换、JSON 存储不能查询、手写 Win32 增加维护成本、旧密码自愈依赖错误文案。项目没有试图把这些代价藏起来，而是尽量写进注释、测试和错误提示里。

测试策略也是这套架构的一部分：进程内 `testsshd` 提供真实的 SSH 服务端，`eventCollector` 替换事件出口并在收到终端数据后立即回 ack，凭据后端换成内存实现，测试绝不往真实凭据管理器写东西。于是“终端字节不丢”“PTY 顺序正确”“转发复用同一条连接”“会话关闭释放端口”这些结论都能在无窗口环境下重复验证。对同类工具来说，可复用的不是某一个函数，而是这种“先把边界写清楚，再选实现”的顺序。

## 相关阅读

- [NanoBrowser：Tauri 与 WebView2 的桌面浏览器实践](/article/nanobrowser-tauri-webview2/)：同样是轻量 WebView 外壳，可以对照看窗口层与 IPC 的取舍。
- [WebSocket 生产环境深挖](/article/websocket-production-deep-dive/)：理解为什么“看起来像 WebSocket”与“实际走什么通道”需要在文档里说清楚。
- [NanoHermes：用 Rust 写编码 Agent](/article/nanohermes-rust-coding-agent/)：另一种把协议内核与外壳分离的组织方式。
- [文件上传的生产实践](/article/file-upload-production-deep-dive/)：与 SFTP 传输的进度、取消和分块策略可以互相参照。
