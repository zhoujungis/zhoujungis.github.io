---
title: "NanoBrowser 拆解：手写进程内 CDP"
slug: nanobrowser-tauri-webview2
cover_image: /photos/nanobrowser-cover.png
date: 2026-10-16
tags: [Rust, Tauri, WebView2, MCP, 零框架, 桌面应用]
---

> 适用读者：想知道「不打包 Chromium 能不能造浏览器」的桌面与前端工程师；想把浏览器接进 Agent 流水线的开发者；对 Tauri 2 的 child webview 能力好奇、但还没踩过坑的人
> 结论先行：NanoBrowser 的价值不在「又一个浏览器」，而在三个反常识的技术决定——不造渲染引擎、**永不开调试端口**、连 DevTools 要用的 WebSocket 服务端都手写
> 阅读时间：约 49 分钟 | 难度：进阶 | 收获：一份进程级架构拆解 + 进程内 CDP 内核的实现细节 + 停靠式 DevTools 面板的完整解法 + MCP 自动化的九个工具 + 一张「已经付过学费」的踩坑清单

**目录**

- 前言：为什么还要再造一个浏览器
- 一分钟认识 NanoBrowser
- 三个反常识的技术决定
- 技术栈、版本与 release profile
- 仓库结构：一个 workspace，两个二进制
- 核心技术一：单窗口里的 N+1 个 webview
- 核心技术二：进程内 CDP 内核
- 核心技术三：手写 WebSocket 服务端
- 核心技术四：停靠式 DevTools 面板
- 核心技术五：z-order 与「覆层」技巧
- 核心技术六：标签页引擎
- 核心技术七：零框架前端
- 核心技术八：nanoagent，一只隐形的浏览器
- 核心技术九：MCP 服务器与九个工具
- 核心技术十：抓包与捕获期脱敏
- 安全模型：五道防线
- 体积与启动账：4.52 MB 是怎么来的
- 数据落盘：原子写、上限与盘符策略
- 十四个已经付过学费的坑
- 已知限制
- 我的判断
- 参考链接

---

## 前言：为什么还要再造一个浏览器

先说清楚这个项目的坐标。NanoBrowser 是一个开源项目（仓库在 GitHub 上的 `zhoujungis/NanoBrowser`，也是本站作者自己的项目），它想回答一个很小的工程问题：

**如果我不想把整个 Chromium 打包进应用，还能不能做出一款用起来像 Chrome 的桌面浏览器？**

大多数「自己做浏览器」的方案最后都滑向同一件事：把 Chromium 或 Electron 一起打包进去，于是安装包动辄 100 MB 起步，每个应用还各自背一份内核、各自占一份内存。到了 2026 年，仍然没有人愿意为「一个能用的浏览器壳」付出这个代价。

NanoBrowser 的答案是另一条路：**不造引擎，只造壳**。渲染引擎直接用 Windows 上已经装好的 WebView2（也就是系统里那份 Chromium/Edge），应用本身只做「壳」的部分——标签页、地址栏、书签、历史、下载、查找、快捷键、主题——以及一件更硬的事：**把 DevTools 协议接进进程里**。

结果是两个二进制：可见的 GUI 浏览器 `nanobrowser.exe` 约 **4.52 MB**，无界面的自动化浏览器 `nanoagent.exe` 约 **4.24 MB**。两者共用同一个库 crate，也共用同一套进程内 DevTools 协议桥。

这篇文章不吹概念，只拆实现。它的技术密度集中在几个地方：**一个窗口里塞进三类兄弟 HWND**、**在没有调试端口的条件下说 CDP**、**手写 SHA-1 握手与 WebSocket 帧编解码**、**把官方 DevTools 前端塞进同一个窗口的子 webview 里并给它一个能拖拽的停靠面板**。这几件事每一件都有一个「不试不知道、试了才知道反常识」的细节，下面逐个展开。

---

## 一分钟认识 NanoBrowser

一句话定义：**一个 Tauri 2 写的 Chrome 式浏览器壳，加一个能被 AI 工具驱动的无界面浏览器**。

| 二进制 | 用途 | Release 体积 |
| --- | --- | --- |
| `nanobrowser.exe` | 可见的 GUI 浏览器 | 约 4.52 MB |
| `nanoagent.exe` | 无界面自动化浏览器（CLI + MCP） | 约 4.24 MB |

它能做的浏览器功能，按「多久能感觉到」排序：

- **Chrome 式标签条**：拖拽重排（带 FLIP 动画）、固定/取消固定、中键关闭、每个标签的右键菜单、溢出处理、`Ctrl+Shift+T` 重开刚关掉的标签。
- **完整浏览器外壳**：带建议下拉的地址栏、书签栏、页内查找、下载管理、历史、缩放、明/暗/跟随系统三态主题、原生窗口按钮。
- **停靠式 DevTools**：把**真正的**官方 DevTools 前端加载进同窗口的一个子 webview，可停靠到**底部**或**右侧**，有一条可拖拽的分隔条调整尺寸——不是弹窗。
- **`nano://` 内部页**：新标签页、历史、书签、下载、设置、关于。
- **无界面 agent**：一次性 CLI 命令，以及一个 stdio 上的 MCP 服务器；带脱敏的网络抓包、可信输入合成与截图。

值得注意的是：整个前端是**手写的 HTML/CSS/JS，没有任何打包器**。没有 npm、没有 Vite、没有框架。这不是标新立异，而是一个刻意的体积与复杂度取舍——后面会讲到它换来了什么、又付出了什么。

---

## 三个反常识的技术决定

在深入代码之前，先把三个「和直觉相反」的决定摆出来，因为后面所有细节都从它们长出来。

**决定一：不造引擎。** NanoBrowser 不含任何渲染引擎、反汇编器或 JS 引擎。它驱动的是系统已安装的 WebView2。代价是「Windows only」（整栈建立在 WebView2 的 COM interop 上），收益是应用体积压到个位数的 MB，并且天然共享系统的安全更新。

**决定二：永不开调试端口。** GUI 和 agent 都**不**传 `--remote-debugging-port`。所有 CDP 流量都走进程内的 `ICoreWebView2::CallDevToolsProtocolMethod`。这条决定最反常识的地方在于：DevTools 面板明明需要一个 WebSocket，但这个 socket 是**进程内自己开的 loopback 服务**，而不是浏览器暴露的调试端口——它有准入门槛、存活期跟着面板走，对进程外不可用。

**决定三：硬依赖一律手写。** 最难的那块——DevTools 用的 WebSocket 桥——是本项目自己实现的 SHA-1 握手 + base64 accept key + 文本/关闭帧编解码，没有引入 `tungstenite` 之类的现成库。

这三个决定共同定义了这个项目的性格：**尽量复用系统已有的东西，把自研面积压缩到只剩「必须自己写、且值得自己写」的那一层。**

---

## 技术栈、版本与 release profile

技术栈表（版本都写在 `Cargo.toml` 里）：

| 层 | 选择 | 版本 |
| --- | --- | --- |
| 应用框架 | Tauri | 2.12.4 |
| WebView 抽象 | wry | 0.57.0 |
| 引擎 | Microsoft Edge WebView2（Chromium） | 系统安装 |
| WebView2 COM 绑定 | `webview2-com` | 0.39.1 |
| Win32 绑定 | `windows` | 0.62.2 |
| 序列化 | `serde` / `serde_json` | 1.0.154 |
| 语言 | Rust | edition 2021 |

Tauri 启用了两个 feature，而且**两个都是必须的**：

```toml
tauri = { version = "2", features = ["unstable", "devtools"] }
```

- `unstable`：child webview 那一整套 API（`add_child`、`get_webview`、逐 webview 的 `devtools(false)`）都在它后面。没有它，这个项目的核心拓扑就不成立。
- `devtools`：暴露 `ICoreWebView2` 互操作能力，协议桥要用。

release profile 逐项为体积调优：

```toml
[profile.release]
opt-level = "s"    # 为体积优化，而非为速度
lto = true         # 链接期优化，跨 crate 内联与裁剪
codegen-units = 1  # 牺牲编译速度换取更激进的优化
strip = true       # 去掉符号
panic = "abort"    # 去掉展开（unwinding）相关的表
```

这几行合起来，是把「一个 Rust + Tauri 应用」压到 4 MB 量级的关键。注意 `panic = "abort"` 的副作用：它意味着**没有 catch-unwind 兜底**，任何 panic 都是进程级终止，所以这个项目在边界处更倾向于「返回 `Option`/`Err`」而不是「先写上去再说」。

crates 源通过 `.cargo/config.toml` 里的 `rsproxy` 镜像。

---

## 仓库结构：一个 workspace，两个二进制

```
NanoBrowser/
├─ start.bat                       # 启动器：优先 release，回退 debug
├─ .cargo/config.toml              # rsproxy 镜像
├─ ui/                             # 前端：纯 HTML/CSS/JS，无打包器
│  ├─ index.html                   # 可信外壳：标签条、工具栏、SVG 图标 sprite
│  ├─ shell.js / shell.css         # 外壳行为与样式
│  ├─ internal.css / internal.js   # 内部页共用的样式与脚本
│  ├─ ntp.html|js                  # nano://newtab   新标签页
│  ├─ history.html|js              # nano://history
│  ├─ bookmarks.html|js            # nano://bookmarks
│  ├─ downloads.html|js            # nano://downloads
│  ├─ settings.html|js             # nano://settings
│  └─ about.html                   # nano://about
└─ src-tauri/
   ├─ tauri.conf.json              # productName、frontendDist=../ui、withGlobalTauri
   ├─ capabilities/                # 逐 webview 的权限作用域
   │  ├─ default.json              # 给 "shell" webview
   │  └─ tabs.json                 # 给 "tab-*"：本地页 vs 远程页
   └─ src/
      ├─ lib.rs                    # 库 crate，导出 cdp 模块
      ├─ main.rs                   # GUI 二进制：窗口 + shell webview + 接线
      ├─ cdp.rs                    # 进程内 CDP 桥（两个二进制共用）
      ├─ state.rs                  # Settings / Profile / AppState / Tab / 常量
      ├─ profile.rs                # 数据目录、profile.json 的读取与原子保存
      ├─ tabs.rs                   # 标签生命周期、布局、下载、快捷键
      ├─ inject.rs                 # 逐标签的 init script（快捷键、favicon、查找）
      ├─ commands.rs               # `#[tauri::command]` 面
      ├─ devtools.rs               # 停靠面板 + WebSocket 桥（全项目最复杂）
      └─ bin/nanoagent/
         ├─ main.rs                # 隐藏窗口，模式分发（--mcp vs 一次性）
         ├─ browser.rs             # navigate/read/click/fill/screenshot/cookies/wait
         ├─ cli.rs                 # 一次性命令前端 + --help
         ├─ mcp.rs                 # stdio 上的 MCP 服务器
         ├─ traffic.rs             # Network.* 抓包 + 捕获期脱敏
         └─ paths.rs               # 数据目录与自动化 profile 目录
```

结构上有两个信号值得注意：

其一，**`cdp.rs` 在 `lib.rs` 里被导出为库**，`main.rs`（GUI）与 `bin/nanoagent/main.rs`（agent）都依赖它。这是「一个内核、两种入口」的物理落点——两个二进制共享同一份协议桥实现，而不是各写一份。

其二，**`devtools.rs` 被单独列出来当作最复杂模块**，README 甚至把它的设计说明单独写成了一章。这在下面的核心技术四里会展开。

---

## 核心技术一：单窗口里的 N+1 个 webview

这是整个项目的架构地基，也是理解后面一切的钥匙。

### 拓扑：三类兄弟 HWND

NanoBrowser 的整个界面**只有一个操作系统窗口**。窗口内部最多有三类**子 webview**，而每一个子 webview 都是**兄弟 HWND**（不是父子关系）：

```
┌─ main window ───────────────────────────────────────────────┐
│  shell webview  (label "shell")   ← y: 0 .. shell_h         │
│    标签条(40) + 工具栏(44) + 书签栏(28，可选)               │
├──────────────────────────┬──────────────────────────────────┤
│  page webview            │  devtools panel webview          │
│  (label "tab-<id>")      │  (label "devtools")              │
│  每个标签一个，只有当前  │  仅打开时存在；底部或右侧        │
│  可见的那个在显示        │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

- **shell**：可信的浏览器外壳（`ui/index.html`），它持有全部 IPC 命令。用 Tauri 的话说，这是唯一「被信任」的 webview。
- **`tab-<id>`**：每个标签一个子 webview，**延迟创建**，切换时隐藏/显示。所有标签 webview 共用**同一个** WebView2 user-data 目录，所以 Cookie 与登录态在标签之间是通的。
- **`devtools`**：停靠面板，首次打开时才创建（见核心技术四）。

布局在 Rust 里算（`tabs.rs::layout`），逐个用 `set_position` / `set_size` 落地到各个 webview。

### `shell_h` 的推导

外壳高度不是拍脑袋定的，是从三段 chrome 高度推出来的：

```
shell_h = STRIP_H(40) + TOOLBAR_H(44) + (bookmarks_bar ? BM_H(28) : 0)
```

也就是**不带书签栏 84 逻辑像素、带书签栏 112 逻辑像素**。页面区域是 `shell_h` 以下的全部空间。

这里用的是**逻辑像素**（Tauri 的 `LogicalSize` / `LogicalPosition`），缩放由 `scale_factor` 折算——`tabs.rs::win_size` 会读 `inner_size()` 再除以 `scale_factor`，避免在 HiDPI 屏上把窗口坐标和逻辑坐标算混。

### 状态模型

`AppState` 由**一把 `Mutex`** 守护，交给 Tauri 管理：

| 字段 | 含义 |
| --- | --- |
| `tabs: Vec<Tab>` | 活着的标签 |
| `active: Option<u32>` | 当前标签 id |
| `closed: Vec<(String, String)>` | `(url, title)` 栈，供 `Ctrl+Shift+T` |
| `shell_h: f64` | chrome 高度（见上） |
| `profile: Profile` | 持久化的设置/书签/历史/下载/会话/窗口几何 |
| `next_id: u32` | 标签 id 分配器 |
| `sys_dark: bool` | 系统深色模式标志 |
| `overlay: bool` | shell 当前是否被撑满整个窗口 |
| `devtools_open: bool` | 面板是否可见 |
| `devtools_h: f64` | 底部停靠时的面板高度 |
| `devtools_w: f64` | 右侧停靠时的面板宽度 |
| `win_save_pending: bool` | 窗口几何持久化的去抖标志 |

而一个 `Tab` 携带：`id, label, url, title, loading, pinned, icon, internal, live, zoom_idx, can_back, can_fwd, expect_internal, nav_pos, nav_total, pending_nav`，外加一个**不透明的逐标签 token**（安全模型的关键，见后）。

注意 `live` 这个字段：它表示「这个标签的真实 webview 是否已经创建」。标签可以是「逻辑存在但 webview 还没建」的——这是延迟创建的直接体现，也是会话恢复（启动时读回一堆 URL）能很快出界面的原因。

### IPC 面

shell 通过 **40 个 `#[tauri::command]`** 调 Rust（都在 `commands.rs`，在 `main.rs` 里用 `generate_handler!` 注册）。按功能分组：

- **读状态**：`get_initial_state`、`get_tabs`、`get_settings`、`get_bookmarks`、`get_history`、`get_downloads`、`get_top_sites`
- **导航**：`navigate`、`new_tab`、`activate`、`go_back`、`go_forward`、`reload`、`stop`、`internal_nav`
- **标签**：`close_tab_cmd`、`toggle_pin`、`move_tab`、`duplicate_tab`、`close_others`、`close_to_right`、`reopen_tab_cmd`
- **界面**：`zoom`、`omnibox_suggest`、`find_query`、`find_move`、`find_close`、`chrome_overlay`、`sys_theme_changed`
- **DevTools**：`toggle_devtools`、`set_devtools_size`、`set_devtools_side`、`devtools_drag_end`
- **数据**：`add_bookmark`、`remove_bookmark`、`update_bookmark`、`delete_history`、`clear_history`、`set_settings`、`open_downloads_folder`

Rust 用 Tauri 事件把状态推回前端：`tabs-state`、`omnibox-state`、`bookmarks-changed`、`theme-changed`、`sys-theme`、`find-result`、`focus-omnibox`、`open-findbar`、`dt-drag`。

一个值得学的细节：**前端不轮询，Rust 主动推**。`emit_tabs_state` 会把整个标签列表序列化成一个 `TabView` 数组推出去，`emit_omnibox` 推的是当前标签的 `url / title / loading / zoom / starred / canBack / canFwd / id`。连「窗口标题」都是在 Rust 侧拼好的：

```
title = 当前标签标题非空 ? "<标题> - NanoBrowser" : "NanoBrowser"
```

### 为什么必须知道「兄弟 HWND」

这一条是本文后面所有「反常识坑」的总源头：**子 webview 是兄弟 HWND，后创建的会盖在先创建的上面**。shell 是第一个创建的，页面 webview 是后创建的——所以在默认情况下，**页面 webview 盖在 shell 上面**。

这直接导致两个后果：

1. shell 里任何**溢出到 chrome 区域之外**的 UI（主菜单、地址栏建议下拉、标签右键菜单）都会被页面 webview 裁掉。
2. 一个子 webview **看不到自己边界之外**的鼠标移动——这会让 DevTools 面板的拖拽调整尺寸变得非常棘手。

这两条分别对应下面的核心技术五与核心技术四。

---

## 核心技术二：进程内 CDP 内核

`cdp.rs` 是这个项目的心脏，两个二进制共用。它的设计完全被 `ICoreWebView2::CallDevToolsProtocolMethod` 的两个性质塑形。

### 性质一：没有 `{"id": ...}` 信封

如果你写过基于调试端口的 CDP 客户端，你会习惯这套信封：

```json
{"id": 7, "method": "Page.navigate", "params": {"url": "..."}}
```

然后按 `id` 把回复对回去。但 `CallDevToolsProtocolMethod` **没有这一层**：你给它方法名和参数，它的完成回调只拿到**这个方法自己的结果对象**——没有 id，没有信封。

所以回复**无法按 id 关联**。项目的解法是：给每次调用打一个**递增序号**（内部用 `AtomicU64` 分配），把这个序号**烘进这次调用专属的回调闭包里**；回调触发时按序号把结果分发到对应的等待者。

### 性质二：回调跑在 WebView2（也就是 UI）线程

第二条性质更致命：**完成回调运行在 WebView2 的 UI 线程上**。如果你在这个线程上等待回调返回，那就是自己等自己——**直接死锁**。而且这个 bug 在隐藏窗口（agent）上尤其容易触发。

所以项目的调用模型是：

- **每次调用都是 fire-and-forget**：发出即返回，不等。
- **调用方永远是 worker 线程，绝不是 UI 线程**。调用方发出请求后，阻塞在一个 `Mutex` + `Condvar` 上，直到回复落进共享状态再被唤醒。
- 也就是说，`cdp.rs` 内部是 `AtomicU64 seq`（发序号）+ `Mutex<Sink>` + `Condvar`（等回复）+ `pending`（暂存回调式回复）这样一套结构。

### 两种调用风格

在此之上，暴露出两种风格，用途严格区分：

| API | 风格 | 谁在用 |
| --- | --- | --- |
| `call` / `call_raw` / `call_within` | **阻塞**等回复（默认 30 秒超时） | 自动化 agent |
| `send` | 把回复交给回调，**不阻塞** | DevTools WebSocket 桥（它必须不阻塞，要在自己的 socket 线程上应答） |

这个区分不是风格偏好，是**硬约束**：DevTools 桥的服务循环跑在自己的线程上，如果它在发 CDP 请求时阻塞等待，就会和「给面板回包」互相卡死。

默认超时 30 秒，超时的错误文案是固定的：

```
CDP <method> timed out
```

（这里的手法值得抄：把方法名放进错误信息，线上排查时一眼能看出卡在哪个协议方法上。）

### 其它必须知道的细节

- **空回复变成 `null`**。有些 CDP 方法本身没有返回值，回调里拿到的是空——项目统一把它规范成 `null`，而不是空字符串或未定义。
- **`on_event(event, cb)`** 通过 `GetDevToolsProtocolEventReceiver` 订阅事件。关键点：**一旦注册，订阅对象归 WebView2 所有**，所以回调的生命周期和 webview 一样长——你不能「取消订阅」，只能让 webview 消失。
- **`with_webview` 必须在主线程之外调用**。这是个容易踩的线程约束。
- **`Cdp::webview()` 是统一入口**：它既能解析子 webview（`"tab-<id>"`、`"devtools"`），也能解析 `WebviewWindow`（`"nanoagent"`）。一份实现同时服务 GUI 的三种子 webview和 agent 的主窗口——这就是「一个内核、两种入口」在代码上的兑现方式。

把这几点合起来看，`cdp.rs` 其实干的是同一件事：**把一个「回调式、跑在 UI 线程、没有请求 id」的 COM 接口，包装成一个「可阻塞、可从任意 worker 线程调用、按序号关联」的 Rust API**。这是整个项目里最像基础设施的一块。

---

## 核心技术三：手写 WebSocket 服务端

DevTools 前端需要一条 WebSocket 才能说话。项目没有引 `tungstenite`，而是在 `ws.rs` 里手写了服务端。

### 握手

标准的 WebSocket 升级握手，逐项自己实现：

1. 从 TCP 流里把 HTTP 请求头读出来。这里有两个自我保护：**单次读缓冲 2048 字节**，**累计请求头超过 16384 字节就放弃**——防止有人对着这个端口灌一个巨大的请求头。
2. 逐字节扫描请求头，直到找到 `\r\n\r\n` 才算「头读完」。
3. 取出 `Sec-WebSocket-Key`，按 RFC 6455 算 accept key：`base64(sha1(key + GUID))`。SHA-1 与 base64 都是**自己实现的**（`sha1`、`b64`、`accept_key`），GUID 是那个固定的 `258EAFA5-E914-47DA-95CA-C5AB0DC85B11` 魔数。
4. 回 `101 Switching Protocols`，带上 `Sec-WebSocket-Accept`。

### 帧编解码

- **收帧**（`take_frame`）：处理掩码、处理长度扩展（1/2/4 字节长度），还能处理**分片**（一个逻辑消息跨多个 TCP 读）。
- **发帧**（`encode_frame`）：按 payload 大小选择 1/2/4 字节长度编码；**服务端侧不掩码**（RFC 规定服务端发出的帧不加掩码）。
- 支持文本帧、`PONG`、`CLOSE` 三种 op。

### 服务循环的「心跳」

`Ws::accept` 在读请求头之后会做一件小事，但它决定了整条桥的形态：

```
s.set_read_timeout(25ms)
```

这不是「超时失败」，而是**把 25 毫秒当成服务循环的 tick**。服务循环靠轮询这个 socket 跑：一次读返回 `Ok(0)` 代表面板走了；返回 `WouldBlock` / `TimedOut` 代表「暂时没数据」，用 `is_idle(err)` 判定，然后继续下一轮。这样单个线程就能同时兼顾「读面板消息」和「收 CDP 事件」两件事，不需要额外的 select/epoll。

### 测试

`tests/ws_bridge.rs` 用一个**独立实现的客户端编码器**来验证服务端——刻意不拿解码器去对拍它自己的逆运算。测试覆盖的行为包括：

- 握手完成并回报自己的 session path（校验 `101` 与 `Sec-WebSocket-Accept` 的具体值）；
- **不带 session key 的连接：不返回任何响应头、不返回任何字节**——这条测试在断言「这个端口不是公开调试端口」；
- **70 KB 的大 payload 跨多次 read 后完整还原**；
- `PING` 回 `PONG`；
- `CLOSE` 回一个**空 payload** 的关闭帧。

---

## 核心技术四：停靠式 DevTools 面板

这是全项目最复杂的一块，也是最值得读的一块。README 给它单独开了一章。

### 为什么需要它

WebView2 其实**自带真正的 DevTools 前端**，但它只通过 `OpenDevToolsWindow` 暴露，而那是弹出一个**独立窗口**。想要 Chrome 那种「停靠在窗口内」的面板，就得换条路。

两条更省事的路都被否掉了：

- **`--remote-debugging-port`**：不可行。开这个端口后，**只有 shell webview 会成为 CDP target**，页面 webview 无法被官方前端 attach。
- **自己写一个极简面板**：被否掉，因为会失去 Elements / Console / Network / Sources 的完整体验。

最终路线：**官方前端 + 进程内 loopback WebSocket 桥**。

### URL 与那个反常识的 fragment 陷阱

面板加载的 URL 长这样：

```
devtools://devtools/bundled/inspector.html?ws=127.0.0.1:PORT/devtools/page/<session-id>#nanoSide=bottom|right
```

拆开看：

- `devtools://devtools/bundled/` 是 WebView2 已经编好的 DevTools bundle——不用自己打包前端。
- 它通过一条**本进程提供的 loopback WebSocket** 说 CDP。
- 停靠边（bottom/right）放在 **fragment**（`#nanoSide=...`）里，**不能放进 query string**。

最后这一条是本项目最有价值的一个「非显然约束」，值得单独强调：

> **在 `?ws=` 后面追加第二个 query key（比如 `&nanoSide=right`），会让 WebView2 的 `devtools://` handler 直接让这次加载失败**，页面显示 Chromium 的「无法访问此页面」错误页。而 fragment 由浏览器自己解析、根本不会到达那个 handler，所以是安全的。

这个坑有个更阴的后续：**调试它的时候不能相信 `webview.url()`**——错误页依然会报告你请求的那个 URL，看起来一切正常。可靠的信号是两个：**桥有没有收到客户端**、**它注册了多少个 domain**。

### 桥的准入：它不是调试端口

`devtools.rs` 跑的这条 loopback WebSocket 有三重约束：

1. 绑定到**随机 loopback 端口**；
2. **只接受本次进程为面板 URL 铸出来的那一个 session id**——请求路径必须是 `/devtools/page/<session-id>`，不匹配就不理；
3. 每一个 CDP 请求都被**转发给某个页面 webview**，走的是 `ICoreWebView2::CallDevToolsProtocolMethod`。

为什么这样就不算「开调试端口」？因为一个扫描 `localhost` 的页面会发现一个监听者，**你不带那个 id 它什么都不答**；而那个 id 只在面板存活期间存在。**进程外没有任何东西能 attach 到这两个浏览器。**这条和前面的「不传 `--remote-debugging-port`」合起来，构成了安全模型里「无调试套接字」那一层。

### 事件：一张静态表 + 惰性订阅

这里有个很典型的「协议实现不完整」的坑：

`Schema.getDomains` **报告了 35 个 domain，但一个事件名都不返回**。也就是说，**事件无法动态发现**。

项目的解法是维护一张**静态事件名表**，并且**按 domain 惰性订阅**——前端实际 enable 了哪个 domain，才去订阅那个 domain 的事件。表里覆盖的是常用域，例如：

```
Runtime       consoleAPICalled / exceptionThrown / executionContextCreated /
              executionContextDestroyed / executionContextsCleared /
              bindingCalled / inspectRequested
Debugger      scriptParsed / scriptFailedToParse / paused / resumed /
              breakpointResolved
Profiler      consoleProfileStarted / consoleProfileFinished
HeapProfiler  addHeapSnapshotChunk / heapStatsUpdate / lastSeenObjectId /
              reportHeapSnapshotProgress / resetProfiles
Console       messageAdded / messageRepeatCountUpdated / messagesCleared
Page          domContentEventFired / loadEventFired / frameNavigated /
              lifecycleEvent / javascriptDialogOpening / screencastFrame /
              downloadWillBegin / ...
```

两条稳健性设计：

- **单个事件订阅失败就跳过它，而不是整个 domain 一起放弃**。
- **`Page.startScreencast` 在 WebView2 上没有实现**（agent 的截图要另想办法，见后）。这类调用会被包装成 **CDP error 返回给前端**，而不是把桥弄崩。

桥的主循环还负责：把「空回复」规范成 `{}`（面板期待一个对象）、把错误回复包装成 JSON-RPC error、从 method 里提取 domain 并按 `(标签, domain)` 去重订阅、把事件参数为空时补 `{}` 再以 `{"method":..., "params":...}` 推给面板。

### 几何：`split` 与六个常量

面板尺寸全部在 `devtools.rs::split` 里算。它返回**页面矩形**和**面板矩形**，好处是「停靠规则可以脱离真实窗口做单测」（内部把状态当参数传进 `split_geometry`）。

六个常量：

| 常量 | 值 | 含义 |
| --- | --- | --- |
| `MIN_H` | 96 | 底部停靠时面板的最小高度 |
| `DEFAULT_H` | 320 | 底部停靠时首次打开的高度 |
| `MIN_PAGE_H` | 96 | 留给页面的最小高度 |
| `MIN_W` | 240 | 右侧停靠时面板的最小宽度 |
| `DEFAULT_W` | 480 | 右侧停靠时首次打开的宽度 |
| `MIN_PAGE_W` | 240 | 留给页面的最小宽度 |

两种停靠的矩形：

- **底部**：页面 `(content_w, content_h - h)`；面板 `(0, shell_h + page_h, content_w, h)`。
- **右侧**：页面 `(content_w - w, content_h)`；面板 `(page_w, shell_h, w, content_h)`。

`clamp_axis` 保证面板与页面**两边都不低于各自的最小值**——所以窗口再小，也不会出现「面板把页面挤没」或「页面把面板挤没」。

还有一个时序细节：`open()` 会**先把窗口布局算好、再让面板可见**，避免面板「以上一个会话的几何尺寸闪一帧」。

### grip 拖拽：子 webview 看不到界外的鼠标

面板边缘有一条「grip」（抓条）。但它有个物理限制：**子 webview 看不到自己边界之外的指针移动**。面板只有那么高/那么宽，鼠标一移出面板边界（到页面上），面板就收不到 `pointermove` 了。

项目的解法是把光标**绕道 shell**：

1. 鼠标按下时，面板让 Rust 执行 `set_overlay(true)`——shell webview 被撑满整个窗口并置顶。
2. shell 里有一个**全窗口的捕获层**（`#dt-grab`），它把 `clientX` / `clientY` 转给 `set_devtools_size`。
3. Rust 侧算新尺寸：

```
bottom:  devtools_h = clamp(window_h - clientY)
right:   devtools_w = clamp(window_w - clientX)
```

4. 鼠标松开，撤掉捕获层、恢复覆层。

注意这条链路和核心技术五的「覆层」是**同一个机制**——项目里那个 `overlay` 标志同时服务两件事：菜单不被裁、grip 能跨边界拖。

### 面板与原生之间的信令：一个不存在的域名

这是全项目最漂亮的一个技巧。面板是一个 `devtools://` 文档，在那个环境里：

- **Tauri 的 IPC 不存在**；
- **WebView2 的宿主对象 `window.chrome.webview` 也不存在**。

两条常规通道全断。于是面板只能这样跟 Rust 说话：

```js
window.open('https://nano-dt.invalid/<action>', '_blank');
```

`nano-dt.invalid` 是一个**不可能存在的域名**，永远不会真的被访问。而 Rust 侧在 `on_new_window` 里**看到了这次弹窗请求**，从路径上读出 action，然后返回：

```
NewWindowResponse::Deny
```

**什么都不导航，什么都不加载，只把那个「弹窗请求」当成一条消息。**这是「把副作用通道当信号通道用」的一个教科书式用法。

### 生命周期

- `F12`、`Ctrl+Shift+I` 和主菜单都调 `toggle_devtools` → `devtools::toggle_for`。
- `activate` / `create_tab` 调 `devtools::retarget`，让面板**跟着当前标签走**。
- `close_tab` 调 `devtools::forget`，把死标签的协议状态清掉。
- **在面板内部按 `F12` 会把面板关掉**。
- 停靠边持久化在 `settings.devtoolsSide`；**切换停靠边会重载面板**，好让 grip 出现在正确的边。
- 所有 webview——shell、页面标签、**以及面板本身**——都用了 `.devtools(false)`。

最后一条要点名：`.devtools(false)` 关掉的是**原生 DevTools 弹窗**（`AreDevToolsEnabled = false`），但它**不影响 `CallDevToolsProtocolMethod`**。所以这个项目可以「杀掉原生弹窗」的同时「保留完整的 CDP 能力」。这是 README 专门列出的坑之一，也是整个停靠方案能成立的前提。

---

## 核心技术五：z-order 与「覆层」技巧

回到核心技术一里埋的那个雷：**页面 webview 后创建，盖在 shell 上面**。这会把所有溢出的 shell UI 裁掉——主菜单、地址栏建议下拉、标签右键菜单。

解法是 `chrome_overlay` 命令 → `tabs.rs::set_overlay`：

1. 菜单/建议列表打开的期间，**把 shell webview 撑到整个窗口**，并用 `SetWindowPos(HWND_TOP)` 把它提到最上面。
2. 关闭时，把 shell 恢复成 `shell_h`。
3. **在任何标签创建/激活/关闭之后**，`ensure_shell_top` 重新确认 z-order——否则新创建的页面 webview 又会上来，把 chrome 重新盖住。

`raise_shell` 的 Win32 调用是：

```
SetWindowPos(hwnd, HWND_TOP, 0, 0, 0, 0,
             SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE | SWP_SHOWWINDOW)
```

四个标志位合起来的意思是：**只改 z 序，不动位置、不动尺寸、不抢焦点、保持可见**。这里最容易忽略的是 `SWP_NOACTIVATE`——没有它，每次开菜单都会把窗口激活一次，焦点会乱跳。

于是「撑满 + 置顶」这套组合拳被两处复用：**菜单溢出**与**面板 grip 拖拽**。一处机制，两个场景，这是这个项目里少见的「抽象刚好够用」的地方。

---

## 核心技术六：标签页引擎

`tabs.rs` 是最大的业务文件，里面塞了很多值得单独看的小算法。

### 地址栏输入解析：三分支

`parse_input` 把地址栏里的一串字变成导航目标，规则三分支：

1. 空输入 → `nano://newtab`；
2. 是内部页（`nano://...`）→ **原样使用**；
3. 「看起来像 URL」→ 必要时补 `https://`；
4. 否则 → 用配置的搜索引擎搜。

第 3 步的判定 `looks_like_url` 有精确规则：

- 以 `http://` 或 `https://` 开头 → 再 `Url::parse` 校验通过才认；
- 含空格或是空串 → **不认**（这是「用户想搜索」的强信号）；
- 否则给候选补 `https://`，再要求：
  - host 等于 `localhost`，**或**能解析成 IP，**或**至少含两个点分段（也就是「有点像域名」）；
  - 且**首字符必须是 ASCII 字母或数字**。

这几条加起来，就是在「`example.com` 应该当网址」和「`how to code` 应该当搜索」之间划一条尽量不出错的线。

### 下载：竞态安全的命名

同名文件不覆盖，而是变成 `report (1).pdf`、`report (2).pdf`……听起来简单，但有个竞态：**如果两个下载同时开始，两边都可能判断「这个路径没人占」，然后都写同一个文件。**

项目用了一个**原子占位**来消灭这个竞态：先用 `create_new` 独占创建那个文件（占位），占上了才算「这个路径归我」；WebView2 之后再往里填内容。`unique_path` 在冲突时最多尝试 1000 个候选名，`reserve` 就是那次原子创建。

> 一句话记住：**用文件系统的原子性去仲裁命名，而不是用内存里的判断。**

### favicon：把端口带上

`favicon_for` 猜图标地址时有个容易漏的细节：

```
scheme://host:port/favicon.ico
```

**端口必须带上**。因为一个跑在非默认端口上的站点，去掉端口后就会指向**另一个 origin** 的图标——猜错不只是难看，是语义错误。

### 缩放：15 档固定阶梯

`ZOOM_STEPS` 是一个 15 档的固定数组（`state.rs`）：

```
0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0
```

取值时用 `zoom_idx.min(len - 1)` 夹一下——**旧 profile 里存了一个越界索引也不能 panic**。这条在 `panic = "abort"` 的构建里尤其重要：一次越界就是整个进程没了。测试里也钉住了这一点（索引写成 999 时仍返回 3.0）。

### 快捷键：在两个世界之间分流

快捷键在两个地方被处理，取决于**当前焦点在页面里还是在外壳里**：

- **页面里**按键 → 由注入脚本 `inject.rs` 上报 → `tabs.rs::handle_shortcut` 处理；
- **外壳里**按键 → `shell.js` 直接处理。

完整映射表：

| 快捷键 | 动作 |
| --- | --- |
| `Ctrl+T` | 新建标签 |
| `Ctrl+W` | 关闭标签 |
| `Ctrl+Shift+T` | 重开最近关闭的标签 |
| `Ctrl+Tab` / `Ctrl+Shift+Tab` | 下一个 / 上一个标签 |
| `Ctrl+1` 到 `Ctrl+8` | 按序号选标签 |
| `Ctrl+9` | 选最后一个标签 |
| `Ctrl+L` | 聚焦地址栏 |
| `Ctrl+F` | 页内查找 |
| `Ctrl+D` | 收藏当前页 |
| `Ctrl+H` | 历史 |
| `Ctrl+J` | 下载 |
| `Ctrl+Shift+O` | 书签管理 |
| `Alt+←` / `Alt+→` | 后退 / 前进 |
| `Ctrl++` / `Ctrl+-` | 放大 / 缩小 |
| `Ctrl+0` | 重置缩放 |
| `F5` | 刷新（交给引擎） |
| `F11` | 切换全屏 |
| `F12` / `Ctrl+Shift+I` | 切换停靠 DevTools 面板 |

这里有一条**克制**值得注意：编辑键（`Ctrl+C/V/X/A`）以及 `Ctrl+R` / `Ctrl+P`、`Ctrl+Shift+1` 到 `Ctrl+Shift+9` 都**刻意放行给引擎**，不拦截。原因很实际：浏览器壳最怕的就是「自作聪明地吞掉网页要用的按键」。同一条约束下，`F5` 也没被拦，直接交给引擎。

---

## 核心技术七：零框架前端

前端在 `ui/`，是手写的 HTML/CSS/JS，**没有打包器、没有框架、没有 npm**。它换来的是：

- 没有构建步骤——改一行 HTML 直接生效；
- 体积几乎为零（对比一个 Electron + React 的起步体积）；
- 与 Rust 的接口面极其简单：`withGlobalTauri` 打开，页面里直接用全局的 Tauri API 调那 40 个命令。

代价也有：**没有组件复用，没有类型检查，状态和 DOM 得自己管**。所以 `shell.js` 里花了很大力气在「手动但确定」的交互实现上。

### 标签拖拽：FLIP + 一次确定性的 click 抑制

标签拖拽重排是 `shell.js` 里最精细的一段：

- 用 `pointermove` / `pointerup` / `pointercancel` 驱动，被拖的标签跟着光标走，**兄弟标签用 FLIP 过渡滑到旁边**——这样标签条**始终在预览「松手后会落到哪」**。
- 松手后调 `invoke("move_tab", ...)` 让 Rust 真正重排。
- 这里有个容易出错的地方：**拖拽结束后，浏览器还会补发一次 `click`**，如果你不去管它，就会「刚拖完就顺手点了一下标签」。项目的做法是置一个 `suppressClick` 标志，**在下一次标签按下时重置**——而不是靠「等一个 tick 再清标志」这类时序 hack。它是**确定性的**，不依赖任务队列的调度速度。

### 其它前端要点

- **建议下拉**：`suggest()` 调 `omnibox_suggest`（Rust 侧从历史 + 书签里匹配，**最多 8 条并去重**），`renderSug()` 建 DOM，`pickSug()` 处理点击与键盘选择并导航。
- **主题**：`resolvedDark()` 把「设置里的 system + 系统深色标志」解析成最终值，然后只是把 `document.documentElement.dataset.theme` 设成 `dark` / `light`。整套设计变量挂在 CSS 的 `:root` 与 `[data-theme="dark"]` 上——换主题不改任何组件的类名。
- **窗口控制图标**：控件图标是靠 JS 注入的，而**注入时 SVG 的 CSS 类必须一起带上**。这是 README 点名的坑：不带类名的话，那些靠类名定尺寸的字形（最典型是全屏的「恢复」图标）会以默认的超大尺寸渲染出来。

---

## 核心技术八：nanoagent，一只隐形的浏览器

`nanoagent` 是**同一套浏览器引擎，装进一个永远不显示的窗口**，交给 AI 工具驱动。

设计属性：

- 窗口用 `visible(false)`、`skip_taskbar(true)`、`decorations(false)` 创建，并且用**自己的** WebView2 user-data 目录（`data\automation`），和 GUI 的 profile **完全隔离**——自动化登录态和人的 Cookie 永远不混。
- 控制走**进程内** CDP 桥：**没有调试端口**。
- 一次性调用**每次起一个全新浏览器**；MCP 模式则**跨很多次工具调用保持一个热着的页面**。

### 一次性 CLI

```
nanoagent --mcp                              stdio 上说 MCP（长会话）
nanoagent <命令> [参数...]                    执行一个动作后退出

navigate <url>                               打开 URL，打印 {url,title}
read <url> [selector] [--html]               打印页面文本（或 HTML）
shot <url> <out.png>                         存一张 PNG 截图
cookies <url>                                列出该页在 profile 里的 cookie
traffic <url> [limit]                        打印记录到的请求（密钥已脱敏）
eval <url> <js>                              执行 JS，打印返回值
click <url> <selector>                       用可信鼠标事件点击
fill <url> <selector> <value>                往输入框打字
wait <url> <selector> [timeout_ms]           等某个元素出现
```

### 三个实现细节，全是坑

**其一，可信输入。** `click` 用的是 `Input.dispatchMouseEvent`（依次发 `mouseMoved` / `mousePressed` / `mouseReleased`），`fill` 用的是 `Input.insertText`。二者合起来的效果是：**网页看到的是真实的用户输入，而不是脚本直接改 DOM 的值**。这一点对「对付那些用 `isTrusted` 判别自动化的页面」很关键。

**其二，截图绕道 screencast。** WebView2 **没有实现 `Page.captureScreenshot`**。但隐藏窗口**依然在合成（composite）**，所以截图走的是 `Page.startScreencast`：订阅帧事件、缓存帧。README 还留了一条退路：**如果哪天隐藏窗口不再合成了，官方给的兜底方案是把窗口移到屏幕外，而不是设 `visible(false)`**。

**其三，就绪判定与线程纪律。** worker 会**最多轮询 600 次、每次间隔 50 毫秒**去问 `is_ready()`，因为 **webview 必须先有一个在跑的事件循环才会应答 CDP**。而等待 CDP 回复时**绝不能阻塞 UI 线程**（会死锁）——回复落进共享状态，worker 线程在条件变量上等。这两条合起来就是 `cdp.rs` 那个设计在 agent 场景下的具体收益。

---

## 核心技术九：MCP 服务器与九个工具

`--mcp` 模式在 stdin/stdout 上说 **JSON-RPC 2.0**，实现 `tools/list` 与 `tools/call`，`serverInfo.name` 是 `"nanobrowser-agent"`。

九个工具：

| 工具 | 说明 |
| --- | --- |
| `browser_navigate` | 打开 URL，返回 `{url,title}` |
| `browser_read` | 页面文本或 HTML，可选 selector |
| `browser_click` | 合成一个**可信**鼠标事件 |
| `browser_fill` | `Input.insertText` 打进某个 selector |
| `browser_wait_for` | 轮询直到 selector 存在 |
| `browser_screenshot` | PNG 字节 |
| `browser_cookies` | 自动化 profile 的 cookie |
| `browser_traffic` | 记录到的请求，已脱敏 |
| `browser_eval` | 执行 JS，返回其值 |

主循环很简单也很典型：**按行读 stdin**，解析 `method / params / id`，分发 `initialize` / `tools/list` / `tools/call`，然后把回复写回 stdout。它是纯 stdio 的——没有网络、没有端口，天然适合被本地 Agent 进程管起来。

把这九个工具和前面的能力对照一下就能看出设计意图：**navigate / read / click / fill / wait / screenshot / eval 是「手和眼」，cookies 是「会话」，traffic 是「可观测性」**。恰好覆盖了「让 Agent 操作网页」这件事的最小完备集合。

---

## 核心技术十：抓包与捕获期脱敏

`traffic.rs` 订阅 `Network.*` 事件，记录请求。它的安全设计有一个核心原则：**在捕获的那一刻脱敏，而不是在输出的时候脱敏**。

这个区别很重要：如果是「先存后脱敏」，那么**明文密钥已经躺在日志缓冲区里**了，任何一次 dump 都可能把它带走。而「捕获期脱敏」意味着**密钥从一开始就没进过缓冲区**。

脱敏规则：

- **18 个敏感键子串**（大小写不敏感）：`password, passwd, pwd, pass, token, secret, apikey, api_key, api-key, auth, cookie, session, csrf, credit, card, cvv, ssn, otp`。命中就替换成三个星号，**JSON body 与 header map 都适用**。
- `Authorization` / `Cookie` 头、以及表单 body，都被同一套规则覆盖。
- body 会被截断（`MAX_BODY = 4096`、`MAX_VALUE = 512`），缓冲区上限 `MAX_ENTRIES = 500`。
- **日志只在内存里**——不落盘。
- **脱敏不可关闭**。

还有一个「重定向覆盖」的坑：**一个重定向会复用同一个 CDP `requestId`**，如果按原始 id 存，后来的记录会**覆盖掉原始请求、丢掉它的 body**。所以条目是按**重定向链推导出来的唯一键**存的，而不是按原始 id。

---

## 安全模型：五道防线

把散落各处的安全设计收一下，一共有五层。

### 防线一：页面事件的来源校验（token）

每个标签 webview 的 init script 里嵌着一个 **Rust 铸出来的不透明随机 token**（`new_token()`，**24 位十六进制**）。它带来的性质是：

- **页面无法为另一个标签伪造事件**——因为它不知道那个标签的 token；
- Rust 用 `tab_id_by_token` 反查发送者，**从不相信页面自报的标签 id**。

也就是说，标签的身份是**由 Rust 侧铸造、注入到页面里**的，而不是页面说了算。这是「页面不可信」这条原则在工程上的具体兑现。

### 防线二：favicon 当敌意数据

favicon 由页面上报、由可信 shell 显示，所以它被当成**敌意输入**：

- 插入前**先做 HTML 转义**；
- 配一个 `<img onerror>`，加载失败就换成内置的地球图标。

结论：**页面永远无法把一个自选 URL 注入进 shell**。

### 防线三：逐 webview 的能力作用域

Tauri 的能力（capability）是**按 webview 标签**划分的：

| 能力 | 作用于 | 授予 |
| --- | --- | --- |
| `shell` | `"shell"` | `core:default` + 窗口控制/查询权限 |
| `tab-local` | 跑内部页的 `tab-*` | `core:default` + `core:event:allow-emit` → 完整应用 IPC |
| `tab-remote` | 外部 URL 上的 `tab-*` | **只有** `core:event:allow-emit`——远程页只能**上报 UI 事件**，永远不能调命令 |

这是整个安全模型里最关键的一格：**内部页（可信）拿完整 IPC，外部页（不可信）只拿「能上报事件」这一件事**。哪怕注入脚本被页面骗了，它能做的也只有 emit 一个 UI 事件。

但这里有一个反直觉的坑（README 明确点名）：**`tab-remote` 必须覆盖所有端口**（`https://*:*`、`http://*:*`，再加 `https://*/*`）。因为如果某个跑在非默认端口上的站点**没被能力声明匹配到**，它在 Tab webview 里会**一次性地失去全部注入功能**——快捷键、hover 状态、查找高亮、favicon 上报**同时**失效。这类「明明是配置问题，症状却像代码坏了」的坑，最难查。

### 防线四：没有调试套接字

两个二进制都**不传** `--remote-debugging-port`；所有 CDP 都走进程内的 `CallDevToolsProtocolMethod`。GUI 的 DevTools WebSocket 桥虽然监听 loopback，但**绑定随机端口 + 只认本次铸的 session id**（核心技术四）。所以进程外无法 attach。

### 防线五：profile 隔离

自动化浏览器用自己的 WebView2 数据目录，和 GUI 的**分开**。Cookie 与登录态**双向都不跨越这条边界**。

---

## 体积与启动账：4.52 MB 是怎么来的

把前面的决定串起来算一遍这笔账：

1. **不含渲染引擎**（复用系统 WebView2）——省掉的是最大的一块。
2. **release profile 全部向体积倾斜**（`opt-level = "s"`、`lto`、`codegen-units = 1`、`strip`、`panic = "abort"`）。
3. **不引 WebSocket 库**（手写 SHA-1 + 帧编解码）——省掉一个依赖树。
4. **前端零框架零打包器**——UI 资产接近于零。
5. **Rust + Tauri**：Tauri 本身不捆绑 WebView，比起「把 Chromium 塞进二进制」的路线，天然小一个数量级。

于是 GUI 侧 **4.52 MB**、agent 侧 **4.24 MB**，且**两者共享同一个库 crate**——协议桥只有一份代码。

启动路径也顺着这个思路：`start.bat` **优先跑 release 二进制，找不到才回退 debug**。对一个「壳」来说，冷启动时间几乎就是「创建窗口 + 加载本地 HTML」的时间，没有引擎初始化要等。

---

## 数据落盘：原子写、上限与盘符策略

### 目录

所有路径都从**可执行文件的位置**推导，并为测试留了环境变量覆盖：

| 内容 | 路径 | 环境变量 |
| --- | --- | --- |
| 数据根 | `<项目>\data` | `NANO_DATA_DIR` |
| 持久化 profile | `<项目>\data\profile.json` | 无 |
| WebView2 user-data（GUI） | `<项目>\data\webview` | 无 |
| 默认下载目录 | `<项目>\Downloads` | 无 |
| 自动化 profile | `<项目>\data\automation` | `NANOBROWSER_AGENT_DIR` |
| agent 数据根 | `<项目>\data` | `NANOBROWSER_DATA_DIR` |

这也是项目那句「一切都待在 D: 盘」的落点：**运行时数据、缓存、下载、WebView2 的 user-data 全在项目目录内，不往系统盘写东西**。

### `profile.json`

```jsonc
{
  "settings": {
    "searchEngine": "bing",        // bing | baidu | google
    "theme": "system",             // system | light | dark
    "homepage": "nano://newtab",
    "bookmarksBar": true,
    "startup": "session",          // session | ntp
    "downloadsDir": "",            // 空 -> 用默认下载目录
    "devtoolsSide": "bottom"       // bottom | right
  },
  "bookmarks": [ { "url": "...", "title": "...", "added": 0, "icon": "..." } ],
  "history":   [ { "url": "...", "title": "...", "time": 0 } ],   // 上限 500
  "downloads": [ { "url": "...", "name": "...", "path": "...", "time": 0,
                   "status": "done" } ],                          // 上限 100
  "session":   { "tabs": ["..."], "active": 0 },
  "window":    { "x": 0, "y": 0, "w": 1280, "h": 800, "maximized": false }
}
```

三条值得抄的做法：

- **原子保存**：JSON 先写成 `.profile.tmp`，再 **rename 覆盖** `profile.json`。这样**写到一半崩溃也不会把 profile 弄坏**（rename 在同一目录内是原子的）。
- **上限容错**：读的时候顺手 `history.truncate(500)`、`downloads.truncate(100)`——**旧文件被人为改大了也不至于把内存吃穿**。
- **窗口几何去抖**：`win_save_pending` 标志配合去抖，避免拖动窗口时每一帧都往磁盘写一次。

---

## 十四个已经付过学费的坑

README 专门用一节把这些「反常识约束」列了出来，这里逐条过一遍（并按主题归类），因为它们是这个项目最有价值的部分——**每一条都意味着一次真实的调试**。

**布局 / z-order**

1. 每个标签是独立 HWND，**后创建的页面 webview 会盖住 shell**，裁掉菜单与建议下拉。解法：菜单打开期间把 shell 撑满窗口并置顶，关闭时还原，并在标签创建/激活/关闭后再确认一次 z-order。
2. **子 webview 看不到自己边界之外的指针移动**，所以面板调尺寸必须把光标路由过 shell 里的全窗口捕获层。
3. **窗口控制图标是 JS 注入的，SVG 的 CSS 类必须一起带过去**，否则靠类名定尺寸的字形（如全屏恢复图标）会按默认的超大尺寸渲染。

**并发 / 下载**

4. **按索引并发关闭标签会删错邻居**——必须在锁内重新查一次标签再关。
5. **同 URL 的并发下载如果只按 URL 匹配就会互相顶掉**——改用原子 `create_new` 占位来抢路径。

**CDP**

6. **在 UI 线程上等 CDP 回复会死锁**（隐藏窗口尤其）。必须回调写共享状态 + worker 线程轮询/等待。
7. **重定向复用同一个 `requestId` 会覆盖原始请求记录、丢掉它的 body**——改用重定向链推导的唯一键。
8. **`--remote-debugging-port` 是死路**：只有 shell webview 会成为 CDP target。
9. **`Schema.getDomains` 只列 domain、不给事件名**——必须自备静态事件表 + 按 domain 惰性订阅。
10. **`AreDevToolsEnabled = false`（也就是 `.devtools(false)`）不影响 `CallDevToolsProtocolMethod`**——于是可以关掉原生弹窗，同时保留完整 CDP。

**停靠 DevTools**

11. **`devtools://` 是特权页**，`window.chrome.webview` 与 Tauri IPC 都不存在；`window.open` + `on_new_window -> Deny` 是唯一信令通道。
12. **在 `?ws=` 后加第二个 query key 会让 `devtools://` 加载整个失败**——额外数据只能放 **fragment**。而且测这个的时候**不能相信 `webview.url()`**（错误页仍报告请求的 URL）；可靠信号是「桥有没有收到客户端」与「注册了多少 domain」。
13. **grip 在朝向页面的那条边上**，光标随停靠轴变化；拖拽数学是 `panel_h = window_h - clientY`（底部）或 `panel_w = window_w - clientX`（右侧）。

**能力配置**

14. **没被能力声明匹配到的非默认端口站点，会一次性失去全部注入特性**（快捷键、hover 状态、查找高亮、favicon 上报）。

这十四条里，有好几条我建议直接记住结论：**12 是「WebView2 的 devtools URL 不接受第二个 query key」**，**10 是「关原生 DevTools 不影响进程内 CDP」**，**2 是「子 webview 是独立的，看不见外面」**。这三条最反直觉，也最容易在别的项目里重演。

---

## 已知限制

README 也老老实实列了限制，值得一并转达：

- **历史与新标签页的「热门站点」仍在猜 favicon**（按 `scheme://host/favicon.ico` 拼），而**只有书签存了页面真实上报的图标**。把两者统一到书签的逻辑上，是一个已知的后续项。
- 停靠面板**只支持底部和右侧**（没有左侧，也不支持拆成独立窗口）。
- **仅 Windows**：整栈建立在 WebView2 的 COM interop 上。
- 仓库里**除了 `tauri.conf.json` 里声明的 `nsis` 打包目标之外，没有提交任何发布流水线**。
- 仓库里**没有 LICENSE**——按 README 自己的提醒，分发前需要先补一个。

---

## 我的判断

读完这个代码库，最值得带走的三件事不是「浏览器怎么做」，而是三个更普适的工程判断：

**第一，「不造引擎」是一种能力，不是一个偷懒。** 大部分项目的默认思路是「我需要什么就实现什么」。NanoBrowser 反过来：**先问系统已经有什么**。Windows 上已经有 Chromium 了，那就只造壳。它换来了 4.5 MB 的体积、几乎为零的引擎维护成本，代价是「Windows only」——而这个代价对它的目标用户是**可接受的**。识别「哪些代价是可以接受的」，比「技术选型对比表」重要得多。

**第二，真正难的不是功能，是「宿主环境的边界」。** 这个项目里绝大部分复杂度不在「实现浏览器功能」，而在四件事：**子 webview 是兄弟 HWND**、**CDP 回调跑在 UI 线程且没有请求 id**、**`devtools://` 里没有任何常规 IPC 通道**、**`devtools://` 的 URL 不接受第二个 query key**。全都是宿主给的不变量。这类「不可协商的约束」决定了架构的形状，也决定了项目里那一长串坑。

**第三，「把副作用通道当信号通道」值得学。** 面板到原生那条 `window.open('https://nano-dt.invalid/...')` + `Deny` 的链路，是一种很干净的破局思路：当两条正规通道都被宿主断掉时，**找一个一定会被拦截的副作用，把参数挂在它上面**。它不优雅，但它**正确、可靠、且不需要宿主配合**。

最后回到那三个决定——不造引擎、不开调试端口、硬依赖手写。它们合起来其实是一句话：**把复用做到极限，把自研面积压到只剩「必须自己写、且值得自己写」的那一层。** 一个 4.5 MB 的浏览器不是省出来的，是**在每一个岔路口都选了「不重复造」**的结果。

---

## 参考链接

- 仓库：[zhoujungis/NanoBrowser](https://github.com/zhoujungis/NanoBrowser)
- 项目 README（英文）：[README.md](https://github.com/zhoujungis/NanoBrowser/blob/main/README.md)
- 项目 README（中文）：[README.zh-CN.md](https://github.com/zhoujungis/NanoBrowser/blob/main/README.zh-CN.md)
- Tauri 2 文档：[tauri.app](https://tauri.app/)
- Microsoft Edge WebView2 文档：[WebView2](https://learn.microsoft.com/microsoft-edge/webview2/)
- Chrome DevTools Protocol 规范：[CDP](https://chromedevtools.github.io/devtools-protocol/)
- Model Context Protocol 规范：[modelcontextprotocol.io](https://modelcontextprotocol.io/)
