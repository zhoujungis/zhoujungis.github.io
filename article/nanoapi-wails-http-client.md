---
title: "NanoAPI：用 Go + Wails 造一个够用的 Postman"
slug: nanoapi-wails-http-client
cover_image: /photos/nanoapi-wails-http-client-cover.png
date: 2026-11-05
tags: [Go, Wails, HTTP, 桌面应用, cURL]
---

> 适用读者：想用 Go 写桌面工具、又不愿意背 Electron 的工程师；需要一个轻量 HTTP 调试客户端的开发者；对 Wails v2、WebView2 与 net/http 细节感兴趣的人
> 结论先行：NanoAPI 的取舍是「复用系统 WebView2 + 自建最小 HTTP 引擎 + 单 JSON 存储」；真正难的不是把请求发出去，而是把超时、重定向、Windows 路径、multipart 边界和落盘可靠性逐一对齐
> 阅读时间：约 30 分钟 | 难度：进阶 | 收获：一条 Go 后端的请求执行链路 + 十二个真实问题的现象、原因、解法与代价 + 一份明确的能力边界

**目录**

- 为什么是「够用的 Postman」
- 整体架构：前端编辑，后端执行
- 一次请求的完整链路
- HTTP 引擎：自建而不是封装
- 变量插值：一层解析，三层递归
- cURL 互转：词法、映射与告警
- 上传与下载：文件如何进出
- 存储：一个 JSON 文件的可靠性设计
- 批量编辑与备份：纯前端逻辑与导入合并
- 问题清单（一）：网络语义的四个坑
- 问题清单（二）：Windows 与 cURL 的四个坑
- 问题清单（三）：桌面应用工程化的四个坑
- 构建与发布：单 exe 的代价
- 已知限制与未解决的问题
- 小结
- 相关阅读

---

## 为什么是「够用的 Postman」

Postman 很强，但它的强建立在体积、账号体系、云同步、插件生态和遥测之上。对于一个只需要「填 URL、选方法、加几个 Header、看返回 JSON」的开发者来说，这些能力多数时候是背景噪音。NanoAPI 把目标压成一句话：做一个够用的 HTTP 调试客户端，单文件 exe，双击就能跑，数据只存在本机。

它的「够用」不是形容词，而是一组可核对的约束。仓库的 `go.mod` 里只有一个直接依赖：`github.com/wailsapp/wails/v2 v2.17.0`。前端没有 npm 依赖，也没有构建步骤，原生 ES Module 直接由 `go:embed` 打进可执行文件。发布资产 `NanoAPI-0.1.0-x64.exe` 为 11,341,824 字节，约 10.8 MiB；同一版本的 NSIS 安装包约 6.3 MB，MSI 约 4.5 MB。作为对比，一个 Electron 应用的安装包通常要以百 MB 计。

这些数字不是靠「砍功能」硬压出来的，而是靠选择：渲染交给系统 WebView2，网络与文件交给 Go 标准库，前端只保留浏览器自带的 DOM、Fetch 之外的少量能力。于是整个应用没有 Chromium 副本、没有 Node 运行时、没有第三方 HTTP 客户端、没有数据库。它甚至没有自动更新和崩溃上报。

边界也必须说清楚：NanoAPI 只支持自己的备份格式 `nanoapi-bundle` v1，兼容裸的 `nanoapi.json`，但不兼容 Postman、Bruno、OpenAPI 或 HAR 导入。全仓检索不到这些格式的解析代码。这不是遗漏，而是范围控制：格式适配器会立刻把「一个周末能维护完的项目」变成「一个永远追不完的兼容层」。需要迁移时，用户可以走 cURL 这条通用通道，或者手工整理 JSON。

## 整体架构：前端编辑，后端执行

项目是典型的 Wails v2 两层结构。`main.go` 负责窗口与 `go:embed`，`app.go` 把 `App` 结构体绑定给前端；`internal/` 下按职责拆成 `proxy`、`interp`、`curl`、`store`、`bundle`、`model` 六个包。前端在 `frontend/dist` 下，`index.html` 加一组 ESM 模块，没有 `node_modules`，也没有 Vite。

Wails 在运行时把绑定方法挂到 `window.go.main.App` 上。`bridge.js` 做了一层很薄的 Promise 封装，把同步异常统一转成 rejected promise，避免调用方漏写 `.catch`：

```javascript
function call(method, ...args) {
  try {
    return Promise.resolve(backend()[method](...args));
  } catch (err) {
    return Promise.reject(err);
  }
}
```

这条边界决定了职责划分。前端负责标签页、集合树、请求编辑器、响应渲染、右键菜单和快捷键；后端负责 URL 合并、变量插值、认证、multipart、TLS、重定向、超时、耗时采集、响应读取、文件保存、备份导入导出。前端不直接调用 `fetch`，因此不存在「两套网络规则」的问题。

绑定的方法覆盖数据加载、三类保存、标签页、历史、Cookie、备份、cURL、发送、文件选择和响应保存。每个方法都返回 Promise，前端用 `await` 或 `.catch` 处理。因为所有 I/O 都在 Go 侧，前端不需要处理跨域、证书、Cookie 或文件系统权限，WebView2 只负责界面。

这个分工也解释了为什么响应体不落盘：Wails 绑定传输的是 JSON 序列化后的字符串，大响应穿过这条边界一次已经足够，再持久化一份只会放大内存和磁盘开销。需要留存时，用户显式点「保存响应体」，走系统保存对话框。

前端状态保存在标签页对象里，每个标签页拥有独立的请求与响应。响应体只留在内存和标签页状态中，不写数据文件；重启后恢复标签页和未保存的编辑内容，但不会恢复上一次的响应。这个选择让数据文件保持小而稳定，也避免了把可能很大的响应体反复序列化。

启动时先检查 `window.go` 是否存在；后端未就绪就直接显示错误页，而不是让用户面对一个空白窗口。`loadAll` 失败会 toast，但界面仍会继续初始化，避免一次读取异常阻断整个应用。

## 一次请求的完整链路

发送按钮的入口在前端 `app.js`。它先用 `state.sending` 做防重入，记录发起时的 `tabKey`，然后在异步返回后按 `tabKey` 找回标签页，把结果写回发起者。这样即使用户在等待期间切到别的标签页，结果也不会串到当前页面：

```javascript
async function send() {
  if (state.sending) return;
  const tabKey = state.activeTabKey;
  state.sending = true;
  try {
    const res = await bridge.sendRequest(tab.request, state.activeEnvId, {
      timeoutMs: state.settings.timeoutMs,
      followRedirects: state.settings.followRedirects,
      insecureTls: state.settings.insecureTls,
    });
    const target = state.tabs.find((t) => t.key === tabKey);
    if (target) target.result = res;
  } finally {
    state.sending = false;
  }
}
```

后端 `SendRequest` 是一条单向流水线：`Store.Snapshot()` 取当前数据副本，`buildVars` 组装变量表，`resolveRequest` 在请求副本上做插值，`buildBody` 生成字节与 Content-Type，组装 `proxy.Options`，最后交给 `Client.Send`。网络层错误不会作为 Go error 返回，而是写入 `Result.Error` 与 `Result.ErrorKind`；只有「存储不可用」这类程序状态才会走 Go error。前端因此能把「请求失败」和「程序缺陷」分开显示。

`SendOptions` 的布尔字段用指针，是为了区分「前端没有指定，沿用全局设置」和「显式关闭」。`pickInt` 与 `pickBool` 依次回退到设置值和默认值，超时、跟随重定向、跳过 TLS 三项都按这个顺序决定。这样单次请求可以覆盖设置，而不会反过来改写全局配置。

如果 `buildBody` 读文件失败，函数不会返回 Go error，而是构造一个带 `ErrorKind: file` 的 Result，照常写历史。前端因此能显示「文件读取失败」，而不是弹出一个未处理的异常。这个错误模型贯穿整条链路：只要请求曾经尝试发出，失败就以 Result 的形式回来。

历史记录写入的是原始请求 `req`，不是插值后的 `resolved`。这意味着历史里保留的是 `{{token}}` 这样的占位符，而不是解析后的密钥。响应体、耗时、响应头都不会落盘，只记录状态码、大小、时间和错误摘要。历史上限 200 条，超过后从尾部丢弃。成功和失败都会调用 `recordHistory`，所以历史里既有 200 也有超时和 DNS 失败；状态码为 0 时，前端仍能按错误种类展示。

## HTTP 引擎：自建而不是封装

NanoAPI 没有引入第三方 HTTP 客户端，而是在 `internal/proxy/proxy.go` 里直接使用 `net/http`。原因很实际：它需要完全掌控 TLS 校验、重定向策略、超时、连接关闭和分段耗时，而这些能力在高层封装里往往被抹平。

第一层是 URL 合并。`BuildURL` 先把裸域名补成 `http://`，再解析原查询串，把参数表合并进去；同名键覆盖原值，其余保持顺序；Query 形式的 API Key 追加到末尾。这里有一个容易被忽略的细节：`?flag` 这种没有等号的参数必须保留「无值」状态，不能被改写成 `?flag=`。实现用 `kvPair{hasValue bool}` 记住这一点，发送与 cURL 导出共用同一个函数，避免两套 URL 规则漂移。

举个具体例子：原 URL 是 `https://api.example.com/users?page=1&flag`，参数表新增 `size=20` 并覆盖 `page=2`，最终查询串会变成 `page=2&flag&size=20`。`flag` 没有等号，不能被补成 `flag=`；参数值的空格会被编码成 `+`，中文会被百分号编码。

第二层是请求构造。超时与 `httptrace` 必须先挂到 context，再创建请求：

```go
ctx, cancel := context.WithTimeout(ctx, timeout)
defer cancel()
ctx = httptrace.WithClientTrace(ctx, &httptrace.ClientTrace{ /* DNS/Connect/TLS/TTFB */ })
req, err := http.NewRequestWithContext(ctx, method, finalURL, bodyReader)
```

顺序反过来，`http.Request` 会持有一个没有截止时间的父 context，超时设置就形同虚设。这个顺序问题后面会单独展开。

第三层是传输。每个请求都从 `http.DefaultTransport.(*http.Transport).Clone()` 取一份独立 Transport，设置 `InsecureSkipVerify`（如果用户关闭了证书校验），并在 `defer` 里调用 `CloseIdleConnections()`。Go 的 `http.Client` 自己处理重定向，`CheckRedirect` 里做两件事：未开启跟随时返回 `http.ErrUseLastResponse`，让 3xx 原样返回；开启跟随时最多 10 跳，并把每一跳的 URL 与状态码记进 `Hop`。

第四层是响应读取。`io.LimitReader(resp.Body, max+1)` 读 20 MB 加 1 字节，超出就把数据截到 20 MB 并置 `Truncated`。这样既不会把内存打爆，也能区分「刚好 20 MB」和「被截断」。随后按 Content-Type、UTF-8 有效性和空字节判断是否为二进制；二进制转 Base64，文本原样返回。Cookie 由一个共享的 `cookiejar` 保存，`ClearCookies` 直接换一个新 jar，而不是逐个删除。

请求头写入时有一个特例：`Host` 不放进 `Header`，而是赋给 `req.Host`，因为 Go 的 Header 不参与主机名的实际选择。认证在请求头之后应用：Basic 用 `SetBasicAuth`，Bearer 写 `Authorization`，API Key 按 `AddTo` 决定写 Header，还是留给 `BuildURL` 拼进查询串。

`Result` 里的 `Proto`、`RemoteAddr`、`Redirects` 和分段耗时都不是装饰。它们让用户能看出慢在 DNS、TCP、TLS 还是首字节，也能看出 302 跳到了哪个地址。网络失败时，这些已经采集到的耗时仍会保留，前端会提示「以上为已采集到的耗时」。

状态文本从 `resp.Status` 里切出空格后的部分，协议字段记录 HTTP/1.1 或 HTTP/2；响应头保持多值 map，前端表格按值换行展示，不把同名头合并成一行。

## 变量插值：一层解析，三层递归

变量语法是 `{{name}}`，正则 `\{\{\s*([^{}]*?)\s*\}\}`。`interp.Resolve` 最多递归 3 层，每一层替换命中的键；如果某一层替换后字符串没有变化，提前退出；三层之后仍未命中的占位符保持原样。这样既能处理 `{{baseUrl}}/{{path}}` 和变量套变量，也不会因为 `a={{b}}`、`b={{a}}` 这样的循环引用而死循环。

变量表的优先级很明确：先把所有 `IsGlobal` 环境的值合并进来，再用当前选中的 `envID` 覆盖同名变量。因此全局变量是兜底，环境变量是覆盖。禁用的行和空 key 会被跳过。

例如全局变量 `baseUrl=https://dev.example.com`、`token=global-token`，当前环境把 `baseUrl` 覆盖成 `https://staging.example.com`，那么 `{{baseUrl}}/users` 会走 staging，而 `{{token}}` 仍取全局值。多个全局环境里出现同名 key 时，后合并的那个生效，这个顺序由环境列表顺序决定。

三层递归的边界也要说清楚：`a={{b}}`、`b={{c}}`、`c=value` 能解析到 value；如果链条更长，第四层之后的占位符会保留下来并进入未解析列表，而不是无限展开。这是防循环的硬上限，不是「尽量多解析几次」。

解析只发生在请求副本上。`cloneRequestForResolve` 复制了 Params、Headers、Body.Form、Body.Files 这些会被改写的切片，URL、正文和认证字段则按值复制。解析范围覆盖 URL、参数键值、请求头值、Body 的 raw/form/files、Basic 用户名密码、Bearer、API Key 键值；方法、Body 类型这些枚举字段不参与插值。

未命中的变量不会让请求失败，而是原样发出，并在 `Result.UnresolvedVars` 里回传。前端在响应区用红字提示「以下变量未被解析，已按原样发送」。这是一种有意的降级：调试阶段经常需要先看到服务端如何回应一个未填的路径，而不是被客户端直接拦住。

## cURL 互转：词法、映射与告警

cURL 导入没有调用 shell，而是自己写了一个小词法器。它要处理单引号、双引号、反斜杠续行、cmd 的 `^` 续行、`$` 前缀和 `curl.exe`。词法结果是一组 token，随后按参数表解析。

支持的范围覆盖日常调试：`-X/--request`、`-H/--header`、`-d/--data`、`--data-raw`、`--data-binary`、`--json`、`-F/--form`、`-u/--user`、`--oauth2-bearer`、`-b/--cookie`、`-A/--user-agent`、`-e/--referer`、`-G`、`-I`。未知参数不会被静默吞掉，而是进入 `Warnings`，前端在导入结果里展示。

方法推断按 curl 的习惯：显式 `-X` 优先；`-I` 得到 HEAD；有 `-F` 或 `-d` 得到 POST；`-G` 把 `-d` 内容挪到查询串并改回 GET。`--json` 除了设置 JSON 正文，还会补一个 `Accept: application/json`。如果显式方法和推断结果冲突，显式方法获胜。

几个关键映射：

- `-d @file` 和 `--data-binary @file` 会读文件内容，上限 20 MB，且要求 UTF-8 文本；`--data-raw @x` 则保留字面量，不读文件。
- 多个 `-d` 用 `&` 拼成一个请求体，符合 curl 的表单拼接行为。
- 有 `-F` 时按 multipart 处理；文件字段的 `;type=`、`;filename=` 等附加选项会被剥离并告警，因为 NanoAPI 的文件字段只有 key 和 path。
- `-k/--insecure` 不会写进请求，只会提示「请在设置中关闭 TLS 证书校验」。
- `-x/--proxy` 只告警并忽略，项目没有代理配置界面。
- `-T/--upload-file`、`-K/--config`、客户端证书等也只告警，不假装支持。

导出走另一条路径，但复用 `proxy.BuildURL` 和同一套 Header/Auth 去重规则。导出的是 Bash 风格命令，字符串用单引号包裹，内部单引号替换为 `'\''`。Basic 认证输出 `-u`，Bearer 和 Header 形式的 API Key 输出 `-H`，multipart 输出 `--form-string` 与 `-F key=@path`。被去重的包括 `Content-Length`、`Transfer-Encoding`、multipart 下手写的 `Content-Type`，以及与认证重复的 `Authorization` 或 API Key 头。

multipart 文本字段特意用 `--form-string`，避免值里的 `@` 或 `<` 被 curl 当成文件引用；文件字段用 `-F key=@path`，路径原样交给 shell 引号处理。HEAD 方法导出为 `-I` 而不是 `-X HEAD`，因为后者可能让客户端一直等待响应体。`shellQuote` 只保证 Bash 下的安全，不保证 cmd 下可用，导出结果面向 Bash、WSL 或 Git Bash，这是一个明确的平台假设。

这套实现不是完整的 cURL。它的目标是「把常见的调试命令带进来」，而不是「解释所有 curl 语法」。因此告警策略很重要：不能识别就明确告诉用户，而不是悄悄生成一个看起来正确、实际不同的请求。比如 `curl.exe -X POST 'https://api.example.com/users' -H 'Content-Type: application/json' -d '{"name":"张三"}'`，词法器不会把 JSON 里的双引号当成命令边界；引号未闭合时直接返回错误，而不是猜测用户意图。

## 上传与下载：文件如何进出

上传在 Go 侧组装 multipart。文本字段用 `WriteField`，文件字段先 `os.Stat`，拒绝目录，单文件上限 20 MB，累计上限 50 MB，然后 `CreateFormFile` 写入 `filepath.Base(path)`。所有文件读进内存后再拼成 buffer，因此上限必须存在，否则一个大文件就能把进程拖垮。文件字段的路径也参与变量插值，所以可以写成 `{{fixturesDir}}/avatar.png`；解析发生在发送前，路径不存在时返回 `file` 类错误。

发送前还有一个关键动作：如果 Body 是 multipart，删掉用户手写的 `Content-Type`。原因是 boundary 在本次请求生成，手写的 boundary 必然对不上；保留它只会让服务端解析失败。导入 cURL 时如果看到 `-F` 和手写 `Content-Type`，也会移除并告警；导出时同样跳过 multipart 的 Content-Type。

下载是反方向。保存响应体时，文件名按优先级取：`Content-Disposition` 里的文件名、最终响应 URL 的最后一段、请求名。`Content-Disposition` 同时支持普通 `filename=` 和 RFC 5987 的 `filename*=UTF-8''`。拿到名字后只取 basename，替换 `<>:"/\|?*` 和控制字符，去掉末尾的点和空格，按 120 个 rune 截断。前端和后端各有一份清理逻辑，前端负责建议名，后端负责最终兜底。图片预览还有一道 8 MB 的上限，超过或已被截断时退回 Base64 展示，避免把巨大的 data URL 塞进 DOM。

二进制响应在前端以 Base64 展示，保存时由后端解码回原始字节。图片类型的响应在未截断且体积不大时可以直接预览；其他二进制显示为 Base64 文本。这样响应查看器不需要为每种格式写渲染器，也不会把二进制内容塞进文本高亮器。

## 存储：一个 JSON 文件的可靠性设计

数据文件固定在 `%APPDATA%\NanoAPI\nanoapi.json`，由 `os.UserConfigDir()` 推导。里面是集合、环境、全局变量、设置、历史和打开的标签页。没有数据库，没有 schema version，也没有迁移框架。如果取不到用户配置目录，`NewApp` 会退回系统临时目录，至少保证应用能启动；这时数据不会跨重启保留。

读取时不做整体校验，只做字段级补齐：超时小于等于 0 就回默认值，主题为空就回默认值，集合、环境、历史、标签页为 nil 就换成空切片。这样某个字段异常不会连带丢掉用户已经选好的主题。JSON 解析失败时，把原文件改名为 `nanoapi.json.corrupt-<时间戳>.json`，然后以空数据启动。文件没有被删除，用户仍有机会手工修复或从备份恢复。

写入用 300 ms 防抖，避免每次输入都落盘。真正写盘时先在同目录创建临时文件，写入后 `Sync`，关闭，再 `Rename` 覆盖目标。这样即使进程在写入中途退出，也不会留下半截 JSON。`Snapshot` 返回切片副本，避免调用方在序列化期间修改底层数据。这个复制看似琐碎，却是并发安全的关键：HTTP 请求在后台执行时，前端可能同时在改集合或环境，序列化必须基于稳定副本。

`Close` 只做最后一次 Flush；窗口关闭前还会触发前端的标签页保存。两条路径都走同一个原子写，因此不存在「关闭时用另一套写入逻辑」的风险。历史记录上限 200 条；响应体和计时结果不落盘。这个设计让文件通常只有几十 KB，也意味着「重启后还能看到上一次响应」不是它的能力。需要留存响应时，用户应显式保存到文件。

## 批量编辑与备份：纯前端逻辑与导入合并

环境变量的批量编辑是纯前端逻辑，放在 `envbulk.js`。输入是 `.env` 风格的 `KEY=value` 文本，解析时跳过空行和 `#` 注释，去掉 `export` 前缀，支持单双引号，双引号内解析 `\n`、`\r`、`\t`、`\"`、`\\`。同名 key 以最后一行为准，非法行只计数不阻断。已有同名变量会保留原来的 `enabled` 与 `desc`，避免一次批量粘贴把用户精心写的说明清空。

格式化是反向过程：有换行、制表符、首尾空格或本身被引号包裹的值会加双引号并转义。前端测试覆盖了「解析再格式化」的往返一致性，这比只测单行解析更能发现引号与转义边界的问题。

例如输入 `export BASE_URL=https://api.example.com`、`TOKEN="line1\nline2"`、`# comment` 和一行缺少等号的 `BROKEN`，解析结果是两条变量加一条非法行计数；`TOKEN` 里的转义换行会被还原成真正的两行。重复的 `KEY` 后一行覆盖前一行，但前一行已有的 `enabled` 和 `desc` 会保留。

备份只有自有格式 `nanoapi-bundle` v1，导出集合与环境，不包含历史、设置和标签页；导入上限 32 MB，同时兼容裸的 `nanoapi.json`。导入不是覆盖，而是追加合并：集合树递归生成新 ID，避免与现有节点冲突；环境也生成新 ID，重名自动加「（导入）」，再重名加「（导入 2）」；全局变量只有一份，已存在时按 key 合并，现有值优先，跳过重复 key 并给出统计告警。

再次强调：这套导入不识别 Postman Collection、Bruno、OpenAPI 或 HAR。它没有做格式嗅探，也没有做字段映射。用户如果手里是 Postman 导出文件，正确路径是先导出 cURL，再用 NanoAPI 的 cURL 导入；或者手工转换 JSON。这是产品边界，不是待办事项。

## 问题清单（一）：网络语义的四个坑

### 问题 1：超时设置看起来完全失效

现象：把超时设为 200 ms，请求一个延迟 2 秒的接口，客户端仍然等满 2 秒才返回，错误也不是超时。

原因：最初的代码先 `http.NewRequestWithContext(ctx, ...)`，之后才给 context 加 `WithTimeout` 和 `httptrace`。`http.Request` 保存的是创建时那个没有截止时间的 context，后面再派生新 context 不会影响已经构造好的请求。计时器也没有挂到真正被执行的链路上。

解决：调整顺序，先 `context.WithTimeout`，再 `httptrace.WithClientTrace`，最后 `NewRequestWithContext`。新增 `TestTimeoutIsReported`，用 200 ms 超时打一个睡 2 秒的 `httptest` 服务，断言 `ErrorKind == timeout`。

代价：每个请求都要创建并取消一个 context，代码路径更啰嗦；超时是「整条请求」的截止时间，包含 DNS、连接、TLS、等待首字节和读响应体，不是单纯的连接超时。用户如果想区分阶段，只能看耗时面板，不能给每个阶段单独设阈值。

### 问题 2：重定向次数错误被通用网络错误覆盖

现象：跟随重定向到一个无限 302 的地址，界面显示「网络错误」，而不是「重定向超过 10 次」。内部的 `ErrorKind` 也变成了 `network`。

原因：`CheckRedirect` 在发现超过 10 跳时先写入了 `res.Error` 和 `ErrTooManyRedirects`，并返回一个错误。`client.Do` 随后把这个错误包成 `*url.Error` 返回，外层统一错误处理又用 `translateError` 和 `classify` 覆盖了 `res` 的字段。更具体的错误被更笼统的错误盖掉。

解决：在 `client.Do` 的错误分支里先判断 `res.ErrorKind` 是否已经是 `ErrTooManyRedirects`，是就保留，不再覆盖。新增 `TestTooManyRedirectsKeepsSpecificError`，断言错误种类和中文提示都保留。

代价：错误处理里出现了一个针对特定错误种类的分支，`CheckRedirect` 与外层错误处理产生了耦合。未来如果增加更多「回调里先写入结果」的错误类型，都要记得在覆盖前做保护。

### 问题 3：Windows 的连接错误文案对不上

现象：连接一个未开放的端口，Linux 上能识别为「连接被拒绝」，Windows 上却落入通用「网络错误」。同一个错误码，两个平台的文案不同。

原因：错误分类最初只匹配 `connection refused` 这类 Linux 常见字符串。Windows 的 `WSAECONNREFUSED` 常表现为 `actively refused` 或 `no connection could be made`，字符串匹配自然失效。底层错误又被 `*net.OpError` 和 `*url.Error` 层层包裹，直接看最外层文案并不可靠。

解决：先 `errors.As` 取出 `*net.OpError`，再尝试取出 `syscall.Errno`，用 `ECONNREFUSED`、`ECONNRESET`、`ETIMEDOUT` 这些错误码判断；错误码不可用时，再对小写文案做多语言兜底，覆盖 `actively refused` 和 `no connection could be made`。

代价：字符串兜底天然脆弱，系统语言或 Go 版本变化都可能让它失效；它也可能把某些包含 `connection reset` 字样的非网络错误误分类。错误码路径是主路径，字符串只是保险。

### 问题 4：自签证书错误被当成普通网络错误

现象：访问自签 HTTPS 服务，界面提示「网络错误」，用户不知道应该去设置里关闭证书校验。

原因：TLS 错误类型在不同 Go 版本里有变化，除了 `x509.UnknownAuthorityError`，还有 `tls.CertificateVerificationError`、`x509.HostnameError`，并且常被 `url.Error` 包裹。只判断一种类型会漏掉大部分证书问题。

解决：在 `classify` 里按 `errors.As` 依次匹配 `tls.CertificateVerificationError`、`x509.HostnameError`、`x509.UnknownAuthorityError`，最后再用 `certificate`、`tls` 字符串兜底，统一归到 `ErrTLS`。前端把 `ErrTLS` 显示为「TLS 证书错误」。

代价：字符串兜底可能把包含 `tls` 的服务端业务错误误判为证书问题；项目没有客户端证书、CA 证书导入或证书链查看能力，遇到企业内网的双向 TLS 只能绕开或改用其他工具。

## 问题清单（二）：Windows 与 cURL 的四个坑

### 问题 5：Windows 路径被 shell 词法吃掉

现象：导入 `-F "file=@C:\Users\me\a.txt"`，文件路径里的反斜杠消失，最终提示找不到文件。

原因：词法器按 shell 规则把反斜杠当作转义符。原本用于处理 `\ `、`\"`、`\\` 的规则，遇到 `\U`、`\m` 这类非特殊字符时，如果直接吞掉反斜杠，Windows 路径就会被破坏。而 Windows 用户经常不额外加引号或双反斜杠。

解决：只对空格、制表符、单双引号、`\\`、`$`、反引号这些特殊字符做转义；遇到其他字符时保留反斜杠本身。对应代码在 `curl.go` 的非特殊分支，新增 `TestSplitCurlCommandKeepsWindowsPaths` 固定这一行为。

代价：这套词法同时兼容 POSIX shell 和 Windows 习惯，语义上不可能完全一致。未加引号且包含空格的路径仍会被拆成多个 token；`\n` 在双引号内仍按换行处理，不能作为普通路径片段。

### 问题 6：cmd 的 `^` 续行无法识别

现象：从 cmd 窗口复制多行 cURL 命令，行尾是 `^`，粘贴进导入框后参数错位或整条命令解析失败。

原因：词法器如果只认反斜杠续行和普通换行，就认不出 cmd 的 `^`。同时 Windows 文本可能带 CRLF，`^\r\n` 这种组合没有被当作一个续行符。

解决：在 `^` 分支里同时处理 `\n` 和 `\r\n`，把它们当作续行；单独的 `^` 仍保留为普通字符。顺带支持 `$` 前缀和 `curl.exe`，覆盖 PowerShell 复制出来的命令。

代价：只实现了续行，不是完整的 cmd 转义语义。`%VAR%` 展开、`&` 分段、`^` 对其他字符的转义都没有模拟；遇到复杂批处理命令仍会告警或解析偏差。

### 问题 7：cURL 参数同名不同义

现象：用户以为 `-d @payload.json` 和 `--data-raw @payload.json` 都会读文件，结果后者把字面量 `@payload.json` 发了出去；或者以为 `-k` 会关闭证书校验，结果导入后设置没变。

原因：cURL 本身就有这些语义差异。`-d` 与 `--data-binary` 对 `@` 做文件读取，`--data-raw` 明确保留字面量；`-k` 是 curl 运行时的 TLS 选项，而 NanoAPI 的证书校验是全局设置，导入一个命令不应该悄悄改全局状态。

解决：按参数名分流。`data` 与 `data-binary` 读文件，限制 20 MB 且要求 UTF-8；`data-raw` 原样保留；`-k/--insecure` 只产生告警，提示用户去设置里改；`--data-urlencode` 原样导入并告警说明没有做 URL 编码。

代价：参数语义靠查表维护，新增参数需要同步更新长短选项表；不支持从 stdin 读取、不支持 `-K` 配置文件、不支持客户端证书和代理。用户看到告警后仍可能忽略，尤其在批量粘贴时。

### 问题 8：手写 multipart boundary 与服务端冲突

现象：在请求头里手动写 `Content-Type: multipart/form-data; boundary=xxx`，再选 multipart 上传，服务端返回解析失败或收不到字段。

原因：boundary 由 `multipart.NewWriter` 在发送时生成，用户手写的 boundary 与请求体里实际使用的 boundary 不是同一个值。HTTP 头与 body 不一致，任何严格的服务端都会拒绝。

解决：后端在构建请求体之后、发送之前，如果 Body 是 multipart，直接从请求头副本里删掉 `Content-Type`，用 `w.FormDataContentType()` 返回的自动值。cURL 导入检测到 `-F` 加手写 Content-Type 时也移除并告警；导出时跳过 multipart 的 Content-Type。

代价：用户失去了自定义 multipart Content-Type 的能力，例如无法手工指定 `charset`。这是有意的取舍：让错误配置不可能生效，比保留一个大概率出错的自由度更重要。

## 问题清单（三）：桌面应用工程化的四个坑

### 问题 9：每请求独立 Transport 放弃 keep-alive

现象：连续发多个请求时，每个请求都要重新建连；压测或批量调试时总耗时明显高于预期。另一方面，如果共享 Transport 又不主动关闭，已建立的空闲连接会一直悬挂到超时。

原因：项目需要按请求切换 `InsecureSkipVerify`，而 TLS 配置属于 Transport，不能安全地在一个共享 Transport 上反复改。共享 Transport 还会让不同请求的 TLS 策略互相污染，因此每个请求都要有自己的 Transport；一旦独立，连接复用也就不存在了。

解决：每个请求从 `DefaultTransport.Clone()` 取独立 Transport，设置自己的 TLS 配置，并在 `defer` 里 `CloseIdleConnections()`。这样连接生命周期与请求绑定，不会悬挂，也不会把不同请求的 TLS 策略混在一起。

代价：放弃了 keep-alive 带来的复用收益，连续请求会反复 DNS、TCP、TLS。对于调试工具这是可接受的，对高频批量调用则不理想。要同时要复用和逐请求 TLS，需要按「TLS 策略」分组维护 Transport 池，复杂度会明显上升。

### 问题 10：大响应把 WebView 卡住

现象：请求一个几 MB 的 JSON，响应区长时间无响应，输入框也变卡；请求体很大时，每敲一个字符都触发 JSON 校验，同样会卡。

原因：渲染层默认对整个响应体做 `JSON.parse`、格式化和语法高亮；请求体的实时校验也在每次输入时执行。数据量一大，字符串处理和 DOM 构建的成本就压到主线程。

解决：三道阈值。响应读取最多 20 MB，超出截断并提示；响应体超过 1 MB 跳过美化和高亮，按原始文本展示；请求体超过 512 KB 跳过实时校验，并把校验防抖到 200 ms。截断状态会传到保存对话框，保存时提示「已截断」。

代价：超过 20 MB 的响应永远拿不到完整内容，保存下来的也是截断后的部分；超过 1 MB 的 JSON 只能看原始文本，没有折叠和着色；超过 512 KB 的请求体不再提示语法错误，错误要等服务端返回。

### 问题 11：进程中断留下半截 JSON

现象：应用在写数据时被强制结束，重启后 `nanoapi.json` 解析失败，集合和环境全部消失。

原因：直接覆盖目标文件不是原子操作。进程在写入中途退出，就会留下不完整的 JSON；如果读取端遇到解析失败又没有恢复策略，用户看到的就是空数据。

解决：写临时文件，`Write`、`Sync`、`Close` 后再 `Rename` 覆盖；读取失败时把原文件改名为 `.corrupt-<时间戳>.json`，以空数据启动；字段级补齐默认值，避免一个坏字段拖垮整份配置。测试覆盖「每次 Flush 后文件都是合法 JSON」「不残留临时文件」「损坏文件被备份并可恢复」。

代价：没有 schema version，字段升级只能靠「缺什么补什么」和「未知字段忽略」，无法做真正的迁移；损坏恢复是「保文件、丢数据」，用户需要手工修复；300 ms 防抖意味着极端情况下最后几百毫秒的编辑可能没落盘，窗口关闭时会强制 Flush 作为补偿。

### 问题 12：导入后 ID、重名与全局变量冲突

现象：把备份导入两次，集合树出现重复节点，删一个却影响另一个；环境列表出现两个同名项，无法区分；全局变量被整份覆盖，原有值丢失。

原因：备份里的节点带着原始 ID，直接追加会和现有数据撞 ID；环境名没有唯一约束；全局变量在设计上只应该有一份，如果按普通环境追加，就会出现第二份。

解决：集合树递归生成新 ID，请求节点同时补默认方法、Body 类型、认证类型；环境也生成新 ID，重名追加「（导入）」并递增序号；全局变量只保留一份，已存在时按 key 合并，现有值优先，重复 key 跳过并汇总告警。

代价：导入是追加而不是去重，同一份备份导入两次仍会产生两套集合，只是 ID 不冲突；环境重命名会改变用户看到的名称；全局变量「现有值优先」意味着备份里的新值可能被静默忽略，只留下一条统计告警。

## 构建与发布：单 exe 的代价

构建命令刻意绕开了前端工具链：

```powershell
wails build -platform windows/amd64 -s -skipbindings -webview2 browser
```

`-s` 跳过前端构建，`-skipbindings` 跳过生成 wailsjs 绑定，前端直接通过运行时 `window.go` 调用。前端文件由 `go:embed` 打进 exe，所以最终产物是一个可执行文件，不需要旁边放一个 `frontend/dist` 目录。发布脚本再分别调用 Wails 的 NSIS 模板和 WiX 生成安装包，输出便携 exe、NSIS 安装包和 MSI 三个产物。

发布脚本先把版本写进 `wails.json` 的 `info`，构建后再恢复；便携 exe 通过 `-ldflags -X main.appVersion=...` 注入版本，安装包的元数据则来自 `wails.json`。两条版本来源必须同步，否则设置页显示和文件属性会对不上。三个产物的定位也不同：便携 exe 适合随手运行，NSIS 负责开始菜单、桌面快捷方式和 WebView2 兜底安装，MSI 面向域部署和静默安装。

以 0.1.0 为例，便携 exe 为 11,341,824 字节，NSIS 约 6.3 MB，MSI 约 4.5 MB。三个文件解决的是三种分发场景，而不是三个功能版本。

这条路也带来两个典型的 Windows 工程问题。其一是行尾：仓库在 Windows runner 上跑 `gofmt -l`，CRLF 会让格式化检查失败，提交 `a16b158` 增加 `.gitattributes` 统一 LF 后才稳定。其二是 MSI 快捷方式：WiX 对快捷方式的组件归属有 ICE43/ICE57 校验，最初的定义不满足，提交 `bd8208e` 修正了组件与快捷方式的组织方式。

代价还包括分发层面的现实：当前没有代码签名，Windows SmartScreen 会提示未知发布者；MSI 要求机器已安装 WebView2，NSIS 会在缺失时尝试安装；版本号要同时同步 `wails.json` 与 `-ldflags` 注入的 `appVersion`。单 exe 的简洁，换来的是构建链上更多手工约束。

## 已知限制与未解决的问题

第一，压缩编码没有自己处理。Go 的 Transport 只有在它自己添加 `Accept-Encoding` 时才会自动解压；如果用户在请求头里手写 `Accept-Encoding: gzip`，Transport 不会代理解压，NanoAPI 也没有 br、deflate 的解码器，响应区会显示压缩后的字节。这不是「不支持 gzip」，而是「不要手写这个头，让 Transport 自己协商」。这也是为什么 README 没有把「支持 gzip」写成卖点：默认协商是安全的，手工覆盖请求头则可能拿到无法阅读的压缩字节。

第二，重定向的敏感头沿用 `net/http` 默认策略。跨域跳转时 `Authorization` 会被丢弃，NanoAPI 没有自行重放，也没有在界面上明确提示「认证头已因跨域跳转被移除」。同源或同域跳转通常不受影响，但跨域调试时容易出现「第一次能通、跳转后 401」的困惑。

第三，代理是隐式继承。因为 Transport 来自 `DefaultTransport.Clone()`，`ProxyFromEnvironment` 仍然生效，`HTTP_PROXY`、`HTTPS_PROXY`、`NO_PROXY` 会影响请求。项目没有代理配置界面，cURL 的 `-x/--proxy` 也只告警忽略。用户在系统环境变量里设过代理时，可能得到与预期不同的出口。

第四，导入格式只有 `nanoapi-bundle` v1 和裸 `nanoapi.json`。不兼容 Postman、Bruno、OpenAPI、HAR。没有格式嗅探，没有字段映射，也没有迁移向导。

第五，没有 schema version。数据文件升级靠字段级补齐和忽略未知字段，无法表达「这个字段从哪个版本开始有意义」，也无法安全地做破坏性迁移。未来如果真要改结构，需要先补一套版本与迁移机制。

第六，能力边界还包括：不支持客户端证书与自定义 CA；multipart 不允许自定义 Content-Type；响应超过 20 MB 必然截断；历史只保留 200 条且不保存响应体。这些都是明确的取舍，不是隐藏的缺陷。

还有一个容易被忽略的边界：历史里保存的是原始请求，变量占位符不会落成明文密钥，但如果用户直接把 token 写进 URL 或 Header，它仍会以明文进入 `nanoapi.json`。工具没有做字段级加密，也不承诺对抗本机读取。

这些遗留项的共同点是都需要额外的基础设施：解压要引入编码库，认证重放要自己实现重定向策略，代理要加配置界面，格式兼容要维护适配器，schema version 要设计迁移框架。它们都不是「加一行代码」能解决的。

## 小结

NanoAPI 的实现思路可以压缩成三句话：把渲染交给系统 WebView2，把网络和文件交给 Go 标准库，把前端压到零依赖的原生 ESM。它没有试图成为 Postman 的替代品，而是把「日常调试最常用的那条路径」做扎实：请求构造、变量、cURL、上传下载、响应查看、单文件存储。

真正决定质量的，不是功能列表，而是那些不显眼的失败路径。超时必须在正确的 context 上挂载；重定向的具体错误不能被通用错误覆盖；Windows 的连接错误和路径需要单独处理；multipart 的 boundary 不能让用户手写；落盘必须原子，损坏必须留证据；大响应必须在读、渲染和校验三个层面分别设限。

它也有清楚的遗留：没有 br/deflate 解压，跨域重定向不重放认证头，代理隐式继承环境变量，导入格式封闭，数据文件没有 schema version。把这些写在明面上，比假装「全都支持」更有价值。一个够用的工具，应该让用户知道它在哪里够用、在哪里不够用。

这些结论不是靠读代码猜出来的。超时、重定向、路径、存储与导入都有对应的单元测试或可复现的 mock 服务，改坏其中任何一条，测试会先失败。

## 相关阅读

- [NanoBrowser 拆解：手写进程内 CDP](/article/nanobrowser-tauri-webview2/)：同样是 WebView2 桌面壳，但把浏览器协议与 DevTools 做进了进程内，可以和本文对照看「复用系统内核」的两种用法。
- [文件上传的生产级细节](/article/file-upload-production-deep-dive/)：从 multipart、边界、临时文件到对象存储，补齐本文只写到「组装请求体」为止的那一半。
- [WebSocket 生产级实践](/article/websocket-production-deep-dive/)：如果要把调试工具从一次性 HTTP 扩展到长连接，连接管理、心跳与重连是下一层必须补的课。
- [MicroMD：3 MB 的 Markdown 阅读器](/article/micromd-3mb-markdown-reader/)：另一个把「单文件、小体积、无重型运行时」作为硬约束的桌面项目，取舍思路与本文相近。
