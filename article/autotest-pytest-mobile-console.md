---
title: "AutoTest：把 pytest 手机自动化装进一个可远程遥控的控制台"
slug: autotest-pytest-mobile-console
cover_image: /photos/autotest-pytest-mobile-console-cover.png
date: 2026-11-23
tags: [pytest, Appium, Vue, Node.js, 自动化测试, 项目实战]
---

> 适用读者：写过 pytest 但没把测试跑成「服务」的人；负责内部工具、测试平台、设备农场的工程师；正在用 Appium 做 Android 自动化、被 adb、session 和报告格式反复折磨的人
> 结论先行：AutoTest 把三件事接成一条远程流水线：开发机只负责选脚本，测试服务器用 SSE 逐行回传 stdout，每个脚本单独起一个 pytest 进程，整批结束只发一封汇总邮件。真正的难点不是让 Appium 点下去，而是 Python 解释器发现、单批互斥、子报告合并、日报 ID 与发信去重这四类边界。文章会给出 10 条 HTTP 路由、4 个 SSE 事件、3 张配置表的真实实现，也会把 3 个隐性故障、5 个未声明的依赖、1 个没有后端的停止按钮逐一定位到文件与行。
> 阅读时间：约 53 分钟 | 难度：进阶 | 收获：一套可复用的远程测试控制台骨架 + 进程/文件/邮件三重边界的处理方式 + 一份可以直接照着改的踩坑清单

**目录**

- 这不是一个 pytest 脚本合集
- 两条机器，一条代理：整体拓扑
- 开发机只做三件事：扫描、排队、显示
- 测试服务器：把 HTTP 变成进程
- SSE 的四个事件与一次批次的完整时序
- 为什么每个脚本单独起一个 pytest 进程
- 单批互斥：一把布尔锁挡住四种竞态
- Python 解释器发现：从文件到 PATH 的五级回退
- 报告目录与 ID：看起来按天，其实是全局计数
- 子报告合并：nodeid 是唯一的主键
- 日志挂载：把 stdout 贴到每一条用例上
- 汇总邮件：从 N 封到 1 封
- 邮件编码：主题、NUL 与代理对
- 配置不落文件：三张表、一次 DELETE 加 INSERT
- 动态 SQL：表白名单挡不住列名
- Pretest：三个检查，一个安装入口
- Appium 1.x 的 /wd/hub：一行 URL 决定的 404
- adb 设备发现：先 connect，再 devices，最后对 udid
- Appium 进程管理：为什么不用 CREATE_NEW_CONSOLE
- 循环压测：重建 session 而不重启服务
- 重启手机：adb reboot 与 boot_completed
- 测试脚本的约定：PLATFORM、fixture 与全局邮件
- 报告阅读侧：5 秒轮询、3 秒轮询与 v-html
- 我在阅读代码时发现的三个隐性故障
- 依赖清单与可移植性：五个未声明的 import
- 停止按钮：一个没有后端的 POST
- 安全边界：这个工具不该暴露在公网
- 如果重写，我会先改这五件事
- 小结：把测试变成服务，成本在边界

---

## 这不是一个 pytest 脚本合集

大多数团队里的「自动化测试」最终会长成同一个样子：`tests/` 目录下几十个 `test_*.py`，一个人在自己电脑上跑，跑完把日志截图发到群里。它当然能发现 bug，但它不是系统，因为没有人回答下面四个问题：

- 谁能在不装 Python、不连手机的情况下发起一次测试？
- 一次批次跑到一半，第二个人又点了一次运行，会发生什么？
- 十个脚本跑完，结果在哪里看？失败的那一条，日志属于哪个脚本？
- 三个人同时点运行，收件箱里会收到几封邮件？

AutoTest 是一个内部测试平台，围绕这四个问题长出来的。它的规模并不夸张：控制台有 7 个 Vue 组件，`server.js` 约 25 KB、实现了 10 条路由，测试目录里目前有 3 个 `test_*.py`，配置落在 3 张 PostgreSQL 表里。但它的复杂度不在代码量，而在边界：Python 进程从哪里来、SSE 怎么收尾、报告怎么合并、邮件怎么只发一封、配置怎么在没有迁移的情况下演进。

先给结论，后面逐条拆：

```text
角色          运行位置              负责
写脚本的人     任意                  写 tests/debug 或 tests/release
开发机         Vite :5173            扫描本地脚本、排队、看日志
测试服务器      Node :3000            起 pytest、写报告、发邮件、存配置
```

这四类角色里，真正难的是「测试服务器」：它要把一个 HTTP 请求变成一个受控的子进程，再把子进程的输出、文件、退出码重新组装成人和机器都能读的东西。Appium 只是这个子进程里的一部分。

## 两条机器，一条代理：整体拓扑

AutoTest 默认按「开发机 + 测试服务器」拆分。开发机不需要 Python、Appium、Android SDK，甚至不需要连手机；它只跑一个 Vite 前端。真正的执行环境在测试服务器上，由 `AUTOTEST_REMOTE_SERVER` 指定：

```text
┌─────────────────────────┐         ┌──────────────────────────────┐
│  开发机 (Vite :5173)     │  proxy  │  测试服务器 (Node :3000)      │
│  · 扫描本地 tests/ 脚本   │ ──────► │  · 执行 pytest (SSE 流式输出)  │
│  · Testbed / 配置 / 报告 UI│         │  · 读写 reports/              │
│                         │         │  · PostgreSQL 配置存储         │
│                         │         │  · Pretest 环境检查            │
└─────────────────────────┘         └──────────────────────────────┘
```

Vite 的代理表是这个拓扑的关键。它把「读脚本列表」留在本机，把「执行、报告、配置、环境检查」转到远端：

```js
// pytest-vue/vite.config.js
const REMOTE_SERVER =
  env.AUTOTEST_REMOTE_SERVER || process.env.AUTOTEST_REMOTE_SERVER || 'http://127.0.0.1:3000'

server: {
  proxy: {
    '/api/log': { target: REMOTE_SERVER, changeOrigin: true,
      rewrite: (p) => p.replace(/^\/api\/log/, '/log') },
    '/api/reports': { target: REMOTE_SERVER, changeOrigin: true },
    '/api/report': { target: REMOTE_SERVER, changeOrigin: true },
    '/run-tests-stream': { target: REMOTE_SERVER, changeOrigin: true },
    '/stop-tests': { target: REMOTE_SERVER, changeOrigin: true },
    '/api/pretest': { target: REMOTE_SERVER, changeOrigin: true },
    '/api/config': { target: REMOTE_SERVER, changeOrigin: true },
  },
  host: true,
  port: 5173,
}
```

这里有一个很容易被忽略的细节：`/api/log` 必须单独 rewrite，而且放在更具体的路径上。原因是后端的真实路由叫 `/log`，前端为了统一走 `/api/*` 加了一层前缀；如果代理只写一条 `/api` 前缀规则，`/api/log` 会被原样转发到 `/api/log`，然后 404。代理表的顺序在 Vite 里不是装饰，它是路由。

另一个细节是 `host: true`。它让 Vite 监听局域网地址，于是同事可以直接用 `http://192.168.x.x:5173` 打开控制台，而不需要每台机器都装一套 Node 依赖。代价是它默认没有鉴权，这一点在第 27 节展开。

## 开发机只做三件事：扫描、排队、显示

开发机的脚本列表不是从远端拿的，而是由 Vite 的一个中间件在本机扫：

```js
// vite.config.js
function localScriptsPlugin() {
  return {
    name: 'local-scripts',
    configureServer(server) {
      server.middlewares.use('/api/scripts', (req, res, next) => {
        if (req.method !== 'GET') return next()
        const url = new URL(req.url || '/', 'http://localhost')
        const mode = url.searchParams.get('mode') === 'test' ? 'release' : 'debug'
        const dirPath = path.resolve(__dirname, '..', 'tests', mode)
        const files = fs.readdirSync(dirPath)
          .filter(f => f.startsWith('test_') && f.endsWith('.py'))
          .map(f => ({ name: f, path: path.join(dirPath, f) }))
        sendJson(res, 200, files)
      })
    }
  }
}
```

这个设计有一个明确的好处：写脚本的人在本地新增一个 `test_xxx.py`，刷新控制台就能看到，不需要部署到测试服务器。同一个 `/api/scripts` 在 `server.js` 里也有一份实现，逻辑几乎一样，只是根目录不同。两份实现的同步靠人，未来应该抽成共享模块。

Testbed 页面的交互也刻意做得很窄：

- 左侧是脚本列表，支持搜索；输入关键词按回车，会把匹配的脚本批量加入右侧待运行列表。
- 右侧是一个可拖拽排序的表格，顺序就是执行顺序，因为 `server.js` 是按 `scripts` 参数的顺序 `forEach` 启动子进程的。
- Debug / Test 两个模式分别对应 `tests/debug` 与 `tests/release`。
- 顶栏只有六个动作：运行、停止、Pretest、结果、实时报告、三个配置页。

运行按钮最终只做一件事，拼一个 EventSource：

```js
// Testbed.vue
const params = new URLSearchParams()
params.set('mode', mode.value)               // debug | test
params.set('scripts', selectedScripts.value.map(s => s.name).join(','))
evtSource = new EventSource(`/run-tests-stream?${params.toString()}`)

evtSource.addEventListener('stdout', (e) => appendStreamLine(e.data))
evtSource.addEventListener('stderr', (e) => appendStreamLine(e.data))
evtSource.addEventListener('report', (e) => { /* 记录 reportId */ })
evtSource.addEventListener('close',   (e) => { /* 结束 */ })
```

注意 `scripts` 只传文件名，不传路径，也不传对象。这是一个很小但很关键的决定：如果传对象，URL 里会出现 `[object Object]`；如果传绝对路径，服务器就获得了一个任意文件读取入口。只允许 `test_*.py` 的文件名，等于在协议层做了一次白名单。

## 测试服务器：把 HTTP 变成进程

`server.js` 是一个单文件 Express 服务，依赖很少：`express`、`cors`、`pg`、`tcp-port-used`，以及 Node 内置的 `child_process`、`fs`、`readline`。它实现了 10 条路由：

| 方法 | 路径 | 作用 |
|------|------|------|
| GET | `/api/scripts?mode=debug\|test` | 远端脚本列表（与本地中间件同构） |
| GET | `/run-tests-stream` | SSE 执行测试 |
| GET | `/api/reports` | 报告列表（含 running/finished） |
| GET | `/api/report/:reportId` | 单份合并报告 |
| GET | `/log?reportId=&nodeid=` | 单条用例详情与日志 |
| GET/POST | `/api/config?table=` | 读/写三张配置表 |
| GET | `/api/pretest` | 数据库、Appium、Python 依赖检查 |
| POST | `/api/pretest/install` | 安装缺失的 pip 包 |
| GET | `/test-results-json` | 旧版总览文件（历史遗留） |

这份路由表里没有 `/stop-tests`，但前端会 POST 它。第 26 节会专门讲这个缺口。

从工程角度看，这个服务只做三件事：

1. 把配置读写委托给 PostgreSQL，自己不保存业务状态。
2. 把一次运行变成 N 个子进程，并把 stdout/stderr 变成 SSE 事件。
3. 把每个子进程的 pytest JSON 报告合并成一个批次报告，并在结束时触发一次发信。

它没有队列、没有任务表、没有 worker。批次状态只存在于一个布尔变量和磁盘目录里。这是它简单的地方，也是它脆弱的地方。

## SSE 的四个事件与一次批次的完整时序

`/run-tests-stream` 是整个系统唯一的长连接。它先写 SSE 头，然后按顺序做五件事：

```js
res.setHeader('Content-Type', 'text/event-stream')
res.setHeader('Cache-Control', 'no-cache')
res.setHeader('Connection', 'keep-alive')

reportId = generateDailyId()                       // 20261123-000123
reportDir = path.join(REPORTS_BASE, reportId)
fs.mkdirSync(reportDir, { recursive: true })

// 先写一个空壳，前端立刻能打开「实时报告」
fs.writeFileSync(reportFile, JSON.stringify({
  tests: [], collectors: [], summary: {},
  status: 'running', created: now, updatedAt: now,
  duration: 0, exitcode: 0, root: __dirname, environment: {},
}, null, 2))

res.write(`event: report\ndata: ${JSON.stringify({ reportId, status: 'running' })}\n\n`)
```

之后的每个脚本都会独立启动，并行执行（`scripts.forEach`，不是串行等待）。事件只有四种：

| 事件 | 数据 | 谁消费 |
|------|------|--------|
| `report` | `{ reportId, status }` | 前端记录 reportId，打开实时报告 |
| `stdout` | `{ script, line, type }` | 控制台逐行显示 |
| `stderr` | `{ script, line, type }` | 控制台逐行显示；busy/init 错误也走这里 |
| `close` | `{ script, code, reportId, label }` 或 `{ code, message }` | 单脚本结束或整批失败 |

整批结束时不是发一个 `close`，而是每个脚本各发一个 `close`；当 `scriptsRemaining` 归零时才：

```js
scriptsRemaining -= 1
if (scriptsRemaining === 0) {
  markReportFinished(reportFile, batchMailExit)  // status: finished
  spawnFinishMail(batchMailExit)                 // 只发一封
  runTestsStreamBusy = false                     // 释放批锁
}
```

前端对 `onerror` 的处理值得注意：EventSource 在连接正常关闭时也可能触发 `onerror`，所以它先判断 `running`，避免把「跑完了」误报成「连接中断」。这是一个很小的细节，但如果没有它，用户会在每次成功结束时看到一条红色错误。

## 为什么每个脚本单独起一个 pytest 进程

一个更自然的写法是：把所有选中的脚本作为参数传给一个 pytest 进程，`pytest -v a.py b.py c.py --json-report`。AutoTest 没有这么做，而是每个脚本一个进程：

```js
const proc = spawnPythonModule(
  'pytest',
  ['-v', scriptPath, '--json-report', `--json-report-file=${subReportFile}`],
  { env: spawnEnvWithPython(deferMailEnv), cwd: AUTOTEST_ROOT,
    stdio: ['ignore', 'pipe', 'pipe'] }
)
```

原因有三个：

第一，隔离崩溃。Appium 测试经常会把 session 跑到不可用；一个脚本把 driver 跑死，不应该让后面的脚本全部失败。独立进程意味着一个脚本 `segfault`、`sys.exit` 或 Python 解释器崩溃，只影响它自己。

第二，隔离 session 级 fixture。`app_driver` 是 `scope="module"`，一个 pytest 进程里它会复用；如果十个脚本在同一个进程里跑，第一个脚本创建的 Appium session 会被后面的脚本继承（或者需要显式 teardown）。独立进程强制每个脚本重新初始化，状态不会串。

第三，报告天然分片。每个脚本写自己的 `<script>.json`，失败时只丢一片，不会污染整批。服务器再按 nodeid 合并。

代价也很直接：每个脚本都要重新 import、重新启动 Appium session，启动开销从「一次」变成「N 次」；如果脚本很短，启动成本会超过测试本身。AutoTest 的取舍是「可诊断性优先于总耗时」，对一个内部平台来说这是合理的。

还有一个隐藏成本：因为每个脚本一个进程，`pytest_sessionfinish` 会执行 N 次，而它默认会发邮件。这就引出了下一节的批量邮件问题。

## 单批互斥：一把布尔锁挡住四种竞态

`server.js` 里有一个很不起眼的变量：

```js
/** 禁止两批 /run-tests-stream 并行（避免 .daily_counter、报告目录与发信读配置竞态） */
let runTestsStreamBusy = false
```

它挡住的不是一种竞态，而是四种：

1. `.daily_counter.json` 的读-改-写。两个批次同时进来，可能生成同一个 reportId，第二个批次会覆盖第一个批次的目录。
2. 报告目录的创建与合并。两个批次同时写 `reports/<id>/`，合并逻辑会互相踩。
3. 发信时读取 `test_config`。一个批次正在跑，管理员改了收件邮箱，邮件的收件人可能对不上。
4. Appium 端口 4723。两个批次同时启动 Appium，后一个会杀掉前一个的进程。

锁的实现很直接：如果 busy，就不排队，直接回一个 `stderr` + `close`：

```js
if (runTestsStreamBusy) {
  res.write(`event: stderr\ndata: ${JSON.stringify({
    line: '已有测试批次在执行，请等待当前批次全部结束后再运行。', type: 'busy'
  })}\n\n`)
  res.write(`event: close\ndata: ${JSON.stringify({ code: -2, message: 'busy' })}\n\n`)
  return res.end()
}
runTestsStreamBusy = true
```

这个设计的选择是「快速失败」而不是「排队」：内部平台的使用者是人，人能看懂「现在有批次在跑」，排队反而会让第二次点击的人不知道什么时候开始。

但它有一个明确的边界：这是进程内锁。如果 `server.js` 用 `pm2` 起了两个实例，或者前面有一层多 worker 的反向代理，这把锁就不存在了。正确的做法是文件锁（`proper-lockfile`）或 PostgreSQL advisory lock。对于一个单实例内网工具，布尔锁够用；对于任何要横向扩展的版本，它不够。

## Python 解释器发现：从文件到 PATH 的五级回退

这是整个项目里最「不优雅但最实用」的一段。Node 进程的 PATH 往往和用户 CMD 的 PATH 不一样：用户在终端里能跑 `python`，不代表 `node server.js` 的子进程能找到。AutoTest 用了五级回退：

```text
1. configs/python_path.txt        第一行非注释内容
2. AUTOTEST_PYTHON                环境变量
3. where python / python3         PATH
4. py -3                          Windows launcher
5. 扫描 LOCALAPPDATA/Program Files 下的 Python 安装
```

关键不是顺序，而是每一步都真的执行一次验证：

```js
function verifyPythonExe(exe) {
  if (!exe || !fs.existsSync(exe)) return false
  const r = spawnSync(exe, ['-c', 'import sys; print(sys.executable)'], {
    encoding: 'utf8', env: PYTHON_ENV_FOR_AUTOTEST, timeout: 20000,
    windowsHide: true,
  })
  return r.status === 0
}
```

`fs.existsSync` 只能证明文件存在，不能证明它能跑；一个损坏的 venv、一个需要许可证的解释器、一个被杀毒软件锁住的 exe，都会在真正 `spawn` 时才报错。提前跑一次 `-c "import sys"` 把故障从「运行测试时」提前到「服务启动时」。

找到解释器之后，还要把它周围的 PATH 补齐：

```js
function spawnEnvWithPython(baseEnv) {
  const env = { ...baseEnv }
  const { cmd } = resolvePythonLaunch()
  if (cmd.toLowerCase().endsWith('.exe')) {
    const dir = path.dirname(cmd)
    const scripts = path.join(dir, 'Scripts')
    env.PATH = `${dir}${path.delimiter}${env.PATH || ''}`
    if (fs.existsSync(scripts)) {
      env.PATH = `${scripts}${path.delimiter}${env.PATH}`
    }
  }
  return env
}
```

为什么需要这一步？因为 `python.exe` 和 `pip.exe`、`appium.cmd` 通常不在同一个目录；而且子进程里执行的 `appium` 命令需要能解析到全局 npm 目录。AutoTest 的做法是把解释器目录和 `Scripts` 目录都塞进 PATH，再用 `python -m pip` 而不是 `pip`，绕开 PATH 的不确定性。

这段代码还有一个容易被忽略的全局变量：

```js
const PYTHON_ENV_FOR_AUTOTEST = withAndroidSdkEnv({
  ...process.env,
  PYTHONUNBUFFERED: '1',       // 否则 SSE 要等缓冲区满才吐行
  PYTHONIOENCODING: 'utf-8',   // 否则 Windows 默认 cp936 会把中文日志写成乱码
  PYTHONPATH: [AUTOTEST_ROOT, process.env.PYTHONPATH || ''].join(path.delimiter),
})
```

`PYTHONUNBUFFERED=1` 是 SSE 流式输出的前提。没有它，pytest 的 stdout 会在缓冲区里攒到几 KB 才一次性吐出，用户看到的是「卡住很久，然后刷屏」。`PYTHONPATH` 则保证 `python -m core.finish_report_mail` 能 import 到项目根下的包。

## 报告目录与 ID：看起来按天，其实是全局计数

报告 ID 的格式是 `YYYYMMDD-NNNNNN`，例如 `20260520-000084`。第一眼看上去像「每天从 1 开始」，但实现不是：

```js
const COUNTER_FILE = path.join(REPORTS_BASE, '.daily_counter.json')

function generateDailyId() {
  const now = new Date()
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`

  let counter = 0
  if (fs.existsSync(COUNTER_FILE)) {
    counter = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf-8')).counter || 0
  }
  counter += 1
  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ counter }, null, 2), 'utf-8')

  return `${ymd}-${String(counter).padStart(6, '0')}`
}
```

变量名和文件名都叫 `daily`，但计数器从来不在午夜归零。这意味着：

- ID 的日期部分是「这次运行的日期」，序号部分是「这个部署历史上一共跑过多少次」。
- 跨天后的第一条报告，序号不会回到 1；它会继续增长。
- 如果 `.daily_counter.json` 被删除，序号会从 1 重新开始，可能和已有目录冲突。

这不是一个会导致测试失败的问题，但它会让报告 ID 的语义变得含混。更糟的是，`finish_report_mail.py` 依赖这个计数器去反查报告目录：

```python
def _find_report_id_for_counter(counter: int) -> str | None:
    suffix = f"-{counter:06d}"
    names = [
        p.name for p in _REPORTS_ROOT.iterdir()
        if p.is_dir() and _REPORT_DIR_RE.match(p.name) and p.name.endswith(suffix)
    ]
    return max(names) if names else None
```

一旦计数器与实际目录不同步（手工删了目录、恢复备份、并发批次），邮件里的「本次报告」链接就会指向错误或不存在的位置。正确的做法是把 reportId 直接传给发信子进程，而不是让它猜；或者把计数器改成按日结构 `{ date, counter }`，并在日期变化时归零。更彻底的做法是 ULID：单调、可按时间排序、不需要锁。

## 子报告合并：nodeid 是唯一的主键

每个脚本写一份 pytest JSON 报告，服务器在脚本结束时把它合并进批次总报告：

```js
function mergeSubReportToTotal(totalFile, subFile) {
  const total = JSON.parse(fs.readFileSync(totalFile, 'utf-8'))
  const sub = JSON.parse(fs.readFileSync(subFile, 'utf-8'))

  sub.tests.forEach(test => {
    const exists = total.tests.find(t => t.nodeid === test.nodeid)
    if (exists) {
      exists.call = exists.call || { log: [] }
      exists.call.log = exists.call.log.concat(test.call?.log || [])
      exists.outcome = test.outcome
      exists.setup = test.setup
      exists.teardown = test.teardown
    } else {
      total.tests.push(test)
    }
  })

  total.collectors = total.collectors.concat(sub.collectors || [])
  total.summary = sub.summary || total.summary
  total.exitcode = sub.exitcode || total.exitcode
  total.updatedAt = Date.now() / 1000
  fs.writeFileSync(totalFile, JSON.stringify(total, null, 2), 'utf-8')
}
```

选择 `nodeid` 作为去重键是对的。pytest 的 nodeid 形如 `tests/debug/test_binding.py::test_device_bind_loop`，包含文件路径、类名、方法名，跨脚本不会重复；如果同一脚本被选中两次，第二次的日志会合并进同一条，而不是产生两条重复记录。

但最后三行有两个问题：

- `total.summary = sub.summary` 是覆盖，不是累加。合并完成后，总报告顶部的 `passed/failed/skipped` 只反映最后一个脚本的统计，而不是整批。前端 TestTable 读的是 `json.tests`，自己重新计数，所以页面上的数字是对的；但任何直接读 `summary` 的消费者（邮件、脚本、未来的 API）都会得到错的。
- `total.exitcode = sub.exitcode || total.exitcode` 只在子报告 exitcode 为真时更新；0 是假值，所以「最后一个脚本成功」不会把整批 exitcode 写成 0。批次结果实际上由 `batchMailExit` 单独维护。

修法不复杂：合并时重新遍历 `total.tests` 计算 summary，exitcode 用 `Math.max` 或显式的「有失败即 1」。但这两个 bug 很典型：**合并函数写成了「最后一次写入者获胜」，而不是「聚合」**。

## 日志挂载：把 stdout 贴到每一条用例上

pytest 的 JSON 报告本身包含 `call.log`，但在 `-v` 模式下，pytest 的进度输出和 `logging` 的 stdout 并不一定都进入每个用例的 `call.log`。AutoTest 的做法是手工补：

```js
function appendLogToSubReport(subReportFile, line) {
  line = line.trim()
  if (!line) return

  let subReport = { tests: [] }
  if (fs.existsSync(subReportFile)) {
    subReport = JSON.parse(fs.readFileSync(subReportFile, 'utf-8'))
  }
  if (!Array.isArray(subReport.tests)) subReport.tests = []

  // 关键：没有 tests 就直接返回
  if (subReport.tests.length === 0) return

  subReport.tests.forEach((test) => {
    test.call = test.call || { log: [] }
    test.call.log = test.call.log || []
    test.call.log.push({
      name: test.nodeid.split('::')[0] || 'unknown',
      msg: line, args: null, levelname: 'INFO', levelno: 20,
    })
  })

  fs.writeFileSync(subReportFile, JSON.stringify(subReport, null, 2), 'utf-8')
}
```

这段代码有三个明确的后果，按严重程度排列：

第一，**收集阶段的日志会丢**。pytest 在真正开始跑用例之前，会先做 collection：import 模块、解析 fixture、执行 `conftest.py`。如果 import 失败、fixture 报错、语法错误，这些恰恰是最需要看的日志，而此时 `subReport.tests` 还是空数组，函数直接 `return`。用户看到的是「报告里什么都没有」，但控制台里明明有 traceback。

第二，**多用例脚本的日志会重复 N 份**。每一行 stdout 被 push 到该脚本的每一条 test 的 `call.log`。一个文件里有 5 条用例，同一行日志就会出现 5 次。日志页按用例展示时还能接受，但如果有人把整份报告导出去做统计，就会被放大。

第三，**每一行都重写整个 JSON 文件**。`appendLogToSubReport` 对每个 stdout 行执行一次「读文件 → `JSON.parse` → push → `JSON.stringify` → 写文件」。一个跑 5,000 行的脚本，就是 5,000 次全量读写；报告越大，后面的行越慢。这是典型的 O(行数 × 报告大小) I/O。

正确的做法是把两件事分开：

- **进程级日志**写一个 `run.log`，按行 append，SSE 同时转发。它不属于任何一条用例，但完整、便宜。
- **用例级日志**用 pytest hook 关联，例如 `pytest_runtest_logreport(report)` 里把 `report.capstdout` 挂到对应的 nodeid；collect 阶段的错误用 `pytest_collectreport` 单独存。

AutoTest 当前的做法是「能看就行」的折中，对内部工具可以接受；但只要有人开始用报告做质量趋势，这三个问题就会变成数据问题。

## 汇总邮件：从 N 封到 1 封

`conftest.py` 里有一段默认行为：

```python
def pytest_sessionfinish(session, exitstatus):
    if os.environ.get("AUTOTEST_DEFER_SESSION_MAIL") == "1":
        return
    from core.finish_report_mail import send_finish_mail
    send_finish_mail(exitstatus)
```

本地单跑一个脚本时，行为很自然：pytest 结束，发一封邮件。但通过 Testbed 批量跑时，每个脚本一个进程，如果什么都不做，十次运行会发十封邮件。AutoTest 的解法是一个环境变量：

```js
// 每个子进程都带这个变量
const deferMailEnv = { ...PYTHON_ENV_FOR_AUTOTEST, AUTOTEST_DEFER_SESSION_MAIL: '1' }

// 整批结束时，由 server 启动一个独立的发信进程
function spawnFinishMail(batchExitForMailBody) {
  const mailProc = spawnPythonModule(
    'core.finish_report_mail', [String(batchExitForMailBody)],
    { cwd: AUTOTEST_ROOT, env: PYTHON_ENV_FOR_AUTOTEST,
      stdio: ['ignore', 'pipe', 'pipe'] }
  )
}
```

这个设计有两个好处：

- 发信逻辑只存在于 Python 一处，本地单跑和批量跑共用，不需要在 Node 里再写一套 SMTP。
- 发信失败不会影响测试结果：子进程的退出码被单独记录（0 成功、2 未发信或失败），测试批次的 `batchExit` 不受影响。

但它也有明确的失败模式：

- 如果 `server.js` 在最后一个脚本结束前崩溃，`spawnFinishMail` 永远不会执行，批次邮件丢失。
- 如果最后一个 pytest 子进程卡死（例如 driver 在 `quit()` 里挂住），`scriptsRemaining` 不会归零，整批既不结束也不发信。
- 如果 `.daily_counter.json` 与报告目录不同步，邮件里的报告链接会错（见上一节）。

更稳的做法是把「批次结束」也当成一个可恢复的状态：把 reportId 和 batchExit 写进一个 `batch.json`，发信进程失败后可以重试；或者用一个最小的任务表，让「发信」成为一条待办，而不是一次性的 `spawn`。

## 邮件编码：主题、NUL 与代理对

邮件正文是 HTML，里面拼了测试人员、项目名、报告路径和链接。这些字段来自配置表，理论上可以是任意字符串。`finish_report_mail.py` 在处理它们时做了三层防御：

```python
def _sanitize_subject(subject: str) -> str:
    s = (subject or "").replace("\r", " ").replace("\n", " ").replace("\t", " ")
    s = "".join(ch for ch in s if ord(ch) >= 32 or ch in "\t")
    s = " ".join(s.split()).strip()
    if len(s) > 200:
        s = s[:197] + "..."
    return s or "【自动化测试】通知"

def _sanitize_html_body(html_body: str) -> str:
    s = (html_body or "").replace("\x00", "")
    return "".join(ch for ch in s if not (0xD800 <= ord(ch) <= 0xDFFF))
```

为什么要专门处理这些字符？因为邮件协议对头部有严格限制：

- 主题里的 `\r\n` 会被某些网关解释为头部注入（header injection），轻则拒收，重则伪造出额外的 `Bcc`。
- NUL 和 UTF-16 代理对（`0xD800–0xDFFF`）在 MIME 编码时可能触发异常，尤其是在 Windows 上从文件或剪贴板读进来的字符串。
- 过长的主题会被截断或拒收，RFC 建议远小于 998 字节；这里保守地截到 200 个字符。

正文使用 `EmailMessage` + `send_message`，并且先 plain 后 html：

```python
msg = EmailMessage()
msg["From"] = _sender_email        # 必须与 SMTP 登录账号一致
msg["To"] = to_email
msg["Subject"] = subject
msg.set_content(plain, charset="utf-8", subtype="plain")
msg.add_alternative(content_html, charset="utf-8", subtype="html")
```

`From` 必须等于登录账号，这是阿里企业邮的硬要求；用「显示名 + 地址」的形式会被 440 拒绝。收件人也必须属于 `@glazero.com`，代码里是显式检查的。这两个限制让这个模块天然绑定在公司邮箱上，换供应商时要改代码。

还有两个实际问题：

1. **硬编码凭据**。`_smtp_host`、`_sender_email`、`_smtp_password` 直接写在文件顶部。任何拿到仓库的人都能发信。正确做法是读环境变量或密钥管理，仓库里只留 `.env.example`。本文不复述具体值，但这个模式必须改。
2. **报告链接默认指向 localhost**。`TEST_REPORT_BASE_URL` 的默认值是 `http://localhost:5173`，如果部署时没有设置，收件人点「本次报告」会打开自己的 localhost，等于打不开。这是一个典型的「开发默认值泄漏到生产」的问题。

## 配置不落文件：三张表、一次 DELETE 加 INSERT

配置没有用 JSON/YAML，而是放在 PostgreSQL 的三张表里：

```sql
CREATE TABLE IF NOT EXISTS device_config (
    product TEXT, product_sn TEXT, product_name TEXT,
    serial_port TEXT, serial_baud_rate TEXT, device_view TEXT,
    ssid TEXT, password TEXT
);

CREATE TABLE IF NOT EXISTS test_config (
    test_name TEXT, user_name TEXT, email TEXT,
    retry_count INTEGER, timeout INTEGER
);

CREATE TABLE IF NOT EXISTS phone_config (
    android_remote_ip TEXT, android_remote_port INTEGER,
    android_sdk_path TEXT, android_version INTEGER,
    android_device_name TEXT, android_udid TEXT,
    android_adb_connect TEXT, android_automation_name TEXT,
    android_app_fullpath TEXT, android_app_package TEXT,
    android_app_activity TEXT,
    ios_remote_ip TEXT, ios_remote_port INTEGER,
    ios_version INTEGER, ios_automation_name TEXT,
    ios_device_name TEXT, ios_app_fullpath TEXT
);
```

三张表都没有主键，因为设计上永远只有一行。写入逻辑是「先清空，再插入一条」：

```js
await pool.query(`DELETE FROM ${tableName}`)
const fields = Object.keys(data)
const placeholders = fields.map((_, i) => `$${i + 1}`)
const sql = `INSERT INTO ${tableName} (${fields.join(',')})
             VALUES (${placeholders.join(',')}) RETURNING *`
const result = await pool.query(sql, values)
```

这个设计的好处是「加配置项不用写迁移」：前端多一个字段，`req.body` 多一个 key，SQL 自动带上。对于一个配置项经常变的内部工具，这确实省事。

代价也很清楚：

- 没有历史。改错了只能靠记忆恢复。
- 没有并发控制。两个人同时保存，后写的覆盖先写的，而且中间有一个「表为空」的瞬间；如果此时有 pytest 进程在读配置，会读到空对象。
- 没有类型约束。所有业务字段都是 TEXT/INTEGER，枚举、范围、必填都靠前端。
- 密码、WiFi 密码、邮箱都是明文。数据库备份即凭据泄漏。

更好的折中是「单行 + JSONB」：一张 `config` 表，`id` 固定为 1，`data JSONB` 存全部配置，写入用 `INSERT ... ON CONFLICT (id) DO UPDATE`。这样既保留 schema 的灵活性，又避免「DELETE 后 INSERT」的空窗，还能加 `updated_at` 做乐观锁。

## 动态 SQL：表白名单挡不住列名

配置接口有一个表名白名单：

```js
const TABLES = {
  device_config: 'device_config',
  test_config: 'test_config',
  phone_config: 'phone_config',
}
```

这段代码挡住的是「表名注入」，但挡不住列名。`fields` 直接来自 `Object.keys(req.body)`，被拼进 SQL 的列名位置；`values` 虽然走了参数化，列名没有。也就是说，只要请求体里出现一个带引号或 SQL 片段的 key，就能改变语句结构。典型的攻击形态不是 `DROP TABLE`（PostgreSQL 的 `pool.query` 默认不允许一次执行多条语句），而是：

- 用不存在的列名制造 500，探测表结构；
- 用特殊列名触发语法错误，把数据库错误信息回显到前端；
- 在未来某个版本引入多语句执行时，升级为更严重的问题。

现实风险取决于暴露面：如果这个服务只在 127.0.0.1 或内网，攻击者需要先拿到内网访问权；但第 27 节会说明，它默认监听 `0.0.0.0` 且 CORS 全开。一个更稳妥的写法是每张表维护固定的列白名单：

```js
const COLUMNS = {
  device_config: ['product', 'product_sn', 'product_name', ...],
  test_config: ['test_name', 'user_name', 'email', 'retry_count', 'timeout'],
  phone_config: ['android_remote_ip', ...],
}
const fields = Object.keys(data).filter(k => COLUMNS[tableKey].includes(k))
```

或者更简单：整张表只存一个 JSONB 字段，列名根本不进入 SQL。

顺带一提，`test_config` 里的 `retry_count` 和 `timeout` 两个字段，在 `server.js` 和 `pytest` 里都没有被读取。它们出现在配置页上，会让人以为「重试」和「超时」生效了，实际上没有。这是配置表最常见的腐烂方式：字段加上了，消费端没跟上。

## Pretest：三个检查，一个安装入口

Pretest 是 AutoTest 里最实用的设计之一。它把「环境问题」从「点了运行之后看报错」提前到「运行之前点一下检查」：

```js
app.get('/api/pretest', async (req, res) => {
  const db = await checkPostgres()      // SELECT 1
  const appium = await checkAppium()    // TCP 127.0.0.1:4723，1 秒超时
  const pyDeps = await checkPythonDeps()// pip list --format=json
  res.json({ db, appium, python: pyDeps })
})
```

三个检查各自对应一类最常见的失败：

| 检查 | 方法 | 失败时的真实含义 |
|------|------|------------------|
| 数据库 | `SELECT 1` | PostgreSQL 没起、库名/密码错、连接池耗尽 |
| Appium | TCP connect 4723 | Appium 没启动，或端口被别的进程占用 |
| Python 依赖 | `pip list --format=json` | 缺 `pytest`、`appium-python-client`、`poco` |

Python 依赖检查只看了三个包，但实际运行还需要 `pytest-json-report`、`psutil`、`requests`、`selenium` 等。这是一个「检查清单小于真实依赖」的问题：Pretest 全绿，运行仍可能失败。更好的做法是让 `pip install -r requirements.txt` 成为唯一真相，然后检查 `pip check` 和关键 import，而不是硬编码三个名字。

同一个文件里还有一个安装入口：

```js
app.post('/api/pretest/install', (req, res) => {
  const { packages } = req.body
  const { cmd, args } = pythonModuleExecArgs('pip', ['install', ...packages])
  execFile(cmd, args, { env: PYTHON_ENV_FOR_AUTOTEST }, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr || err.message })
    res.json({ message: stdout })
  })
})
```

它很方便，也是一个远程执行入口：任何能访问 3000 端口的人，都能让服务器执行 `pip install <任意包>`。这在个人机器上没问题，在内网共享机器上就是一个供应链入口。最低限度要加鉴权、包名白名单、以及「只允许安装 Pretest 报告里缺失的包」。

## Appium 1.x 的 /wd/hub：一行 URL 决定的 404

`build_appium_url` 只有六行，但它决定了整个项目能不能连上 Appium：

```python
def build_appium_url(host, port):
    """
    Appium 1.x（如 1.18）会话地址必须为 http://host:port/wd/hub。
    若只连 http://host:port，会 404：The URL '/session' did not map to a valid resource。
    """
    host = str(host or "127.0.0.1").strip()
    port = int(port or 4723)
    base = f"http://{host}:{port}".rstrip("/")
    if not base.endswith("/wd/hub"):
        base = f"{base}/wd/hub"
    return base
```

Appium 1.x 的 WebDriver 端点是 `/wd/hub/session`；Appium 2.x 移除了 `/wd/hub`，直接用 `/session`。这个项目选择支持 1.x（错误提示里甚至写着 `npm install -g appium@1.18.3`），所以所有初始化都走这个函数。

问题在于，并不是所有地方都走了它。`restart_phone()` 在手机重启后重建 driver 时写的是：

```python
self.driver = webdriver.Remote("http://127.0.0.1:4723", options=self.options)
```

没有 `/wd/hub`，也没有用配置里的 host/port。如果 Appium 是 1.x，这一行会在重启后 404；如果 Appium 是 2.x，初始化那一行反而会 404。整个项目被钉在 1.x 上，而 1.x 已经停止维护。

更好的做法是把 path 也做成配置：`appium_path=/wd/hub`，初始化前探测 `/status`，根据版本决定。这样升级 Appium 时只需要改配置，不需要改三处代码。

## adb 设备发现：先 connect，再 devices，最后对 udid

Appium 报 `Could not find a connected Android device` 时，真正的原因通常不在 Appium，而在 adb。`ensure_adb_device` 把这段排错知识写进了代码：

```python
def ensure_adb_device(phone_cfg: dict) -> str | None:
    adb = _adb_executable()
    connect_addr = str(phone_cfg.get("android_adb_connect") or "").strip()
    if connect_addr:
        subprocess.run([adb, "connect", connect_addr], capture_output=True,
                       text=True, timeout=20, check=False)

    result = subprocess.run([adb, "devices"], capture_output=True,
                            text=True, timeout=20, check=False)
    devices = [
        line.split()[0]
        for line in (result.stdout or "").splitlines()
        if line.strip() and not line.startswith("List of devices")
        and len(line.split()) >= 2 and line.split()[1] == "device"
    ]
    if not devices:
        raise RuntimeError(
            "adb 未检测到可用的 Android 设备（Appium 报错: Could not find a connected Android device）。\n"
            "请检查：\n"
            "  1) 真机：USB 调试已开，执行 adb devices 状态为 device\n"
            "  2) 模拟器/MuMu/夜神：先启动模拟器，在手机配置填 android_adb_connect，如 127.0.0.1:7555\n"
            "  3) 执行 adb kill-server && adb start-server 后重试\n"
        )

    want = str(phone_cfg.get("android_udid") or "").strip()
    if want and want not in devices:
        raise RuntimeError(f"手机配置 android_udid={want} 不在 adb 列表中，当前设备: {devices}")
    return want or devices[0]
```

这段代码有三个值得学的点：

1. **先 `adb connect`，再 `adb devices`**。MuMu、夜神这类模拟器不会自动出现在 adb 列表里，必须先 connect 到 `127.0.0.1:7555` 之类的地址。把这一步放进配置，而不是让用户记命令。
2. **错误信息里带修复步骤**。它不是简单抛 `RuntimeError("no device")`，而是把三种最常见的原因和对应命令写进异常。对于内部工具，这比日志级别更重要。
3. **多设备时显式选择**。如果 adb 列表里有多台设备，而配置没有指定 `android_udid`，默认取第一台并打 warning。这避免了「跑到了别人的手机上」这种最难查的事故。

它的边界是：`adb devices` 的输出解析依赖 `device` 这个状态；`offline`、`unauthorized` 都会被过滤掉，错误信息里只会说「没有可用设备」，不会告诉用户「有一台未授权」。可以把原始输出一起带进异常（代码里确实拼了 `output.strip()` 的一部分），但还可以更明确。

## Appium 进程管理：为什么不用 CREATE_NEW_CONSOLE

`tools/appium_server.py` 负责启动、检测和关闭 Appium。它解决的是 Windows 上几个很具体的问题：

```python
def build_appium_popen_cmd(port: int, appium_cmd: str) -> tuple[list[str], str]:
    node = _where_executable("node")
    main_js = _appium_main_js_near(appium_cmd)
    if node and main_js:
        return [node, main_js, "-p", str(port)], f"{node} {main_js} -p {port}"
    if os.name == "nt":
        return ["cmd.exe", "/c", appium_cmd, "-p", str(port)], f"cmd /c {appium_cmd} -p {port}"
    return [appium_cmd, "-p", str(port)], f"{appium_cmd} -p {port}"
```

优先用 `node main.js` 而不是 `appium.cmd`，原因是后者会经过 `cmd.exe`，在某些环境下会弹出一个新控制台窗口，父进程拿不到正确的句柄，误以为启动失败。`build_appium_popen_cmd` 里还有一行注释：

```python
# 不用 CREATE_NEW_CONSOLE：.cmd 会在另一窗口跑，父进程以为启动失败
popen_kw["creationflags"] = subprocess.CREATE_NO_WINDOW
```

启动流程是「先探端口，再决定」：

```text
is_port_listening(127.0.0.1, 4723)
  ├─ 已监听 → 复用，跳过启动
  └─ 未监听 → kill 旧的 appium 进程 → 启动 → 等待端口最多 60 秒
```

这个流程的好处是幂等：重复调用不会起多个 Appium；坏处是 `kill()` 的匹配条件很宽：

```python
for proc in psutil.process_iter(["pid", "name"]):
    if "node" in (proc.info["name"] or "").lower():
        cmdline = " ".join(proc.cmdline())
        if "appium" in cmdline.lower() and str(self.port) in cmdline:
            proc.kill()
```

任何命令行里同时包含 `appium` 和端口号的 node 进程都会被杀掉，包括用户手动开的调试实例、其他项目的 Appium、甚至一个恰好参数里带 4723 的无关进程。更稳的做法是按 PID 文件或 `psutil` 的 `create_time` 校验，只杀自己启动的那个。

另外，`AppiumServer.start()` 会直接改写 `os.environ`：

```python
for key in ("ANDROID_HOME", "ANDROID_SDK_ROOT", "PATH"):
    if key in run_env:
        os.environ[key] = run_env[key]
```

这是一个库函数修改全局状态的典型例子。它在当前进程里长期生效，可能影响后续其他逻辑；应该只把 `run_env` 传给子进程，而不是写回 `os.environ`。

## 循环压测：重建 session 而不重启服务

手机自动化的常见需求不是「跑一遍」，而是「循环跑一百遍」。Appium session 跑久了会泄漏、会卡、会丢上下文，但重启整个 Appium 服务又太慢。`reconnect_appium` 选了一个中间层：

```python
def reconnect_appium(self, phone_cfg=None):
    """循环压测时重建 Appium session（不重启 Appium 服务）。"""
    phone_cfg = phone_cfg or load_config("phone_config")
    if self.driver:
        try:
            self.driver.quit()
        except Exception as exc:
            logging.warning("关闭旧 session: %s", exc)
    udid = ensure_adb_device(phone_cfg)
    if udid and self.options:
        self.options.udid = udid
    url = build_appium_url(
        phone_cfg.get("android_remote_ip"),
        phone_cfg.get("android_remote_port"),
    )
    self.driver = webdriver.Remote(url, options=self.options)
    return self.driver
```

它做了三件事：关闭旧 session（忽略关闭失败）、重新确认 adb 设备（手机可能掉线）、用同一个 `options` 建新 session。Appium 服务本身不动，所以启动成本被省掉了。

这个分层很值得借鉴：

- `restart_app()`：只杀应用、重开应用，适合应用状态污染；
- `reconnect_appium()`：重建 session，适合 driver 状态污染；
- `restart_phone()`：重启手机，适合系统级问题；
- `AppiumServer.kill()/start()`：重启服务，适合 Appium 进程本身卡死。

四级递进，按成本从低到高。很多团队的脚本只有「重启手机」这一招，结果一次小问题要等三分钟。

## 重启手机：adb reboot 与 boot_completed

`restart_phone()` 是一个典型的「把 shell 脚本写进 Python」的函数。它先发 `adb reboot`，然后轮询设备是否回来：

```python
def wait_for_device_online(self, timeout=180, check_interval=5):
    while time.time() - start_time < timeout:
        result = subprocess.run("adb devices", shell=True, capture_output=True, text=True)
        device_lines = [line for line in result.stdout.split("\n") if udid in line]
        if device_lines:
            device_status = device_lines[0].split("\t")[-1].strip()
            if device_status == "device":
                boot_check = subprocess.run(
                    f"adb -s {udid} shell getprop sys.boot_completed",
                    shell=True, capture_output=True, text=True,
                )
                if boot_check.returncode == 0 and boot_check.stdout.strip() == "1":
                    return True
        time.sleep(check_interval)
    return False
```

它检查了两层：`adb devices` 里的状态是 `device`（不是 `offline`/`unauthorized`），以及 `sys.boot_completed` 为 `1`（系统真的启动完成，而不只是 adb 守护进程起来了）。这是正确的顺序；只等 `adb devices` 会在锁屏界面就返回，后面的 `activate_app` 会失败。

但重启后的重建有一个明确的 bug：

```python
self.driver = webdriver.Remote("http://127.0.0.1:4723", options=self.options)
```

这里没有走 `build_appium_url`，也没有用配置里的 IP/端口。如果 Appium 是 1.x，重启后必然 404；如果手机是通过网络连接的，`127.0.0.1` 也不对。这是「同一个概念在多处实现」的典型后果：初始化走了一个函数，重启走了另一条路。

另外，`adb reboot` 用 `shell=True` 拼接命令，`udid` 来自配置/`adb devices`，理论上有命令注入面；虽然这个场景里 udid 通常是设备序列号，风险不高，但用 `subprocess.run([adb, "-s", udid, "reboot"])` 更干净。

## 测试脚本的约定：PLATFORM、fixture 与全局邮件

平台对测试脚本的约定只有三条：

```python
# 1) 文件名必须是 test_*.py，放在 tests/debug 或 tests/release
# 2) 模块级必须声明平台
PLATFORM = "Android"   # 或 "iOS"

# 3) 用 conftest.py 提供的 fixture
def test_example(app_driver):
    ...
```

`conftest.py` 里 `app_driver` 是 `scope="module"`：

```python
@pytest.fixture(scope="module")
def app_driver(request):
    platform = getattr(request.module, "PLATFORM", None)
    if platform is None:
        raise ValueError("请在测试脚本里定义 PLATFORM = 'iOS' 或 'Android'")

    driver = AppControl()
    driver.init_log()
    driver.init_appium(platform)
    yield driver
    driver.quit()
```

模块级 fixture 意味着「一个文件一个 session」。配合「一个脚本一个 pytest 进程」，最终就是「一个脚本一个 session」，符合前面说的隔离目标。

但这里有一个值得注意的设计：`PLATFORM` 是模块级变量，由 `request.module` 读取。如果脚本里写错了（拼写、大小写），`init_appium` 会走到 `else: raise UnknownObjectException`，错误信息很不友好。可以改成 `Literal["Android", "iOS"]` 校验并给出明确提示。

另一个问题是 `dut` fixture：

```python
@pytest.fixture(scope="module")
def dut():
    try:
        dut = Device()
        yield dut
    except Exception as e:
        print('初始化dut失败.')
```

它在异常时只打印一行，然后没有 `yield`，pytest 会报「fixture did not yield」。而且 `Device()` 目前只是一个空壳。这个 fixture 更像是历史遗留：测试脚本 `test_binding.py` 同时请求 `dut` 和 `app_driver`，但真正干活的只有后者。

`test_binding.py` 里还有一组常量，值得单独看：

```python
NUM_CYCLES = 10
RESTART_APP_EVERY = 50
RESTART_PHONE_EVERY = 50
WAIT_BETWEEN_CYCLES = 5
```

循环 10 次，但「每 50 轮重启应用」和「每 50 轮重启手机」两个分支永远不会触发。这不是语法错误，而是配置不一致：常量是从更长的压测脚本里抄过来的，循环上限被改小了，重启阈值没改。更稳的写法是用 `NUM_CYCLES` 推导，或者加一个断言：

```python
assert RESTART_APP_EVERY <= NUM_CYCLES or RESTART_APP_EVERY == 0
```

## 报告阅读侧：5 秒轮询、3 秒轮询与 v-html

前端把「报告列表」和「单份报告」分成两个页面，轮询策略不同：

- 报告列表 `Result.vue`：`LIST_POLL_MS = 5000`，只有存在 `running` 报告时才轮询，全部完成就停。README 写的是「每 3 秒自动刷新」，实际代码是 5 秒；这是文档与实现的又一次漂移。
- 单份报告 `TestTable.vue`：`POLL_MS = 3000`，只要 `status === 'running'` 或 URL 带 `live=1` 就轮询，完成后停止。

这种「只在需要时轮询」的写法比「永远 setInterval」好，用户关掉页面或批次结束后不再产生请求。它还处理了一个边界：`live=1` 是「我强制要看实时」，即使后端已经标记 finished，也允许再拉一次。

单份报告用 Chart.js 画饼图：

```js
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(PieController, ArcElement, Tooltip, Legend)
```

但 `pytest-vue/package.json` 的依赖里没有 `chart.js`。同样，`Testbed.vue` 里的 `import draggable from 'vuedraggable'` 也没有在 `package.json` 声明。这说明当前环境依赖的是「历史上装过、但没写进清单」的 node_modules。在一台干净的机器上 `npm ci` 会直接失败。第 25 节会集中讲这个问题。

日志页 `TestLog.vue` 有一个更严肃的问题：

```html
<span v-html="highlightErrorKeywords(line)"></span>
```

```js
function highlightErrorKeywords(line) {
  if (!line) return ''
  const keywords = ['NameError', 'TypeError', 'AttributeError', 'IndexError', 'KeyError']
  let highlighted = line
  keywords.forEach(key => {
    const regex = new RegExp(`(${key})`, 'g')
    highlighted = highlighted.replace(regex, '<span class="error-keyword">$1</span>')
  })
  return highlighted
}
```

`v-html` 会把字符串当 HTML 渲染，而 `line` 来自设备/测试输出。如果某一行日志里包含 `<img src=x onerror=...>`，或者应用把用户输入打进了日志，这段代码就会执行它。正确做法是先 `escapeHtml(line)`，再替换关键字；或者用文本节点 + CSS 高亮，完全不用 `v-html`。内部工具的日志通常被认为「可信」，但日志恰恰是最容易混入外部输入的地方。

## 我在阅读代码时发现的三个隐性故障

这三个问题不是「设计取舍」，而是读代码时能直接定位的 bug。它们共同说明一件事：一个能跑起来的内部工具，和一份可维护的代码之间，差距往往在异常路径上。

**故障一：`bind_device_ByBle` 的第一行就会抛异常。**

```python
def bind_device_ByBle(self):
    ssid = self.config.get("wifi", {}).get("ssid")
    password = self.config.get("wifi", {}).get("password")
```

`self.config` 在 `AppControl.__init__` 里从未赋值，整个 `app_base.py` 里也没有第二处赋值。也就是说，这个方法只要被调用，第一行就会 `AttributeError`。而 `test_binding.py` 的循环体用 `try/except Exception` 把每一轮都包住，所以表现是「每轮立刻失败、日志里一行 AttributeError、循环继续」。如果只看控制台，很容易以为是设备问题。

修法很直接：在 `__init__` 里从 `device_config` 读取 WiFi 信息，或者把 `ssid`/`password` 作为参数传进来。更重要的是，不要在循环里用裸 `except Exception` 吞掉编程错误；至少区分「设备异常」和「代码异常」。

**故障二：`devices_sn` 是字符串，却被当成集合迭代。**

```python
self.devices_sn = load_config("device_config")["product_sn"]
self.device_num = len(self.devices_sn)
...
for device_sn in self.devices_sn:
```

数据库里 `product_sn` 是 `TEXT`。如果配置页填的是一个 SN，`len()` 得到的是字符数，`for` 得到的是每个字符。于是 `unbind_device()` 的循环次数变成「SN 字符数 + 2」，绑定循环会拿单个字符去匹配 `SN: x`。除非配置里存的是 JSON 数组字符串（而代码没有 `json.loads`），否则这段逻辑不成立。

修法：明确 `product_sn` 的格式（逗号分隔或 JSON 数组），在读配置时解析成 `list[str]`，并对空值/单值做兼容。

**故障三：合并报告的 `summary` 是覆盖，不是聚合。**

前面已经拆过。它在页面看不太出来（前端自己计数），但会让邮件、脚本和未来的 API 读到错的统计。修法是合并后重新计算：

```js
const counts = { passed: 0, failed: 0, skipped: 0, total: total.tests.length }
for (const t of total.tests) {
  if (t.outcome in counts) counts[t.outcome] += 1
}
total.summary = counts
```

这三个故障有一个共同点：它们都发生在「异常/边界路径」上，正常走一遍 UI 很难发现。这也是为什么内部工具需要 code review，而不只是「能跑就行」。

## 依赖清单与可移植性：五个未声明的 import

AutoTest 的依赖清单和实际 import 之间有明显缺口。

**前端 `pytest-vue/package.json`** 声明了：

```json
"dependencies": {
  "axios": "^1.16.0",
  "body-parser": "^2.2.2",
  "cors": "^2.8.6",
  "express": "^5.2.1",
  "pg": "^8.20.0",
  "tcp-port-used": "^1.0.2",
  "vue": "^3.5.32",
  "vue-router": "^4.6.4"
}
```

但代码里还 import 了：

- `vuedraggable`（`Testbed.vue` 的拖拽排序）；
- `chart.js`（`TestTable.vue` 的饼图）。

这两个都不在 `package.json` 里。在一台干净机器上 `npm ci` 之后，构建会报 `Could not resolve "vuedraggable"` / `"chart.js"`。

**Python `requirements.txt`** 只有一行：

```text
appium-python-client==5.3.1
```

而代码实际需要 `pytest`、`pytest-json-report`、`psutil`、`requests`、`selenium`（`appium-python-client` 会带上 selenium，但 pytest 和 pytest-json-report 不会）。`server.js` 的 Pretest 也只检查三个包，所以「Pretest 全绿但 pytest 起不来」是可能的。

**大小写问题**：`router.js` 里写的是

```js
import TestBed from '@/components/TestBed.vue'
```

而实际文件名是 `Testbed.vue`（小写 b）。Windows 的文件系统不区分大小写，所以本机没问题；Linux 和 macOS 的默认文件系统区分大小写，CI 或容器里构建会直接失败。这是「只在一台 Windows 机器上能跑」的最典型症状。

这三个问题都可以用 CI 一次性挡住：

```bash
npm ci                    # 依赖清单必须完整
npm run build             # 在 Linux runner 上跑，暴露大小写
python -m pytest --collect-only   # 暴露 pytest/pytest-json-report 缺失
```

## 停止按钮：一个没有后端的 POST

Testbed 顶栏有一个「停止测试」按钮，它的实现是：

```js
async function stopTests() {
  if (!running.value) return
  try {
    await fetch('/stop-tests', { method: 'POST' })
    output.value += '\n===== 测试已停止 =====\n'
    running.value = false
    if (evtSource) {
      evtSource.close()
      evtSource = null
    }
  } catch (err) {
    console.error(err)
  }
}
```

Vite 也把 `/stop-tests` 代理到了测试服务器。但 `server.js` 里没有任何 `/stop-tests` 路由。这一 POST 会 404，`fetch` 不会抛异常（404 是有效响应），于是前端仍然执行后面的代码：把 `running` 设为 false、关闭 EventSource、打印「测试已停止」。

真实情况是：**pytest 子进程还在跑，Appium 还在点，批次锁 `runTestsStreamBusy` 仍然是 true**。用户在界面上看到「已停止」，但下一个人点运行会收到「已有测试批次在执行」。这是一个非常典型的「前端乐观更新 + 后端缺接口」的合成 bug。

要真正实现停止，服务器至少需要：

1. 保存当前批次的子进程引用（`Set<ChildProcess>`）；
2. 提供 `POST /stop-tests`，对每个子进程发 `SIGTERM`，超时后 `SIGKILL`；
3. 在 `settleChild` 里把「被主动停止」记成一个明确的 `label`，并释放批次锁；
4. 前端只在收到 `close` 事件后才把 `running` 设为 false。

在当前的「快速失败」模型里，最诚实的做法反而是：把按钮改成「断开输出」而不是「停止测试」，或者直接删掉。一个看起来能停止、实际停不掉的按钮，比没有按钮更危险。

## 安全边界：这个工具不该暴露在公网

把 AutoTest 的所有安全相关问题列出来，会得到一张很长的单子：

- `app.use(cors())` 允许任意来源；
- `app.listen(3000, '0.0.0.0')` 监听所有网卡；
- 所有接口没有鉴权；
- 配置表里有 WiFi 密码、邮箱、测试人员；
- `/api/pretest/install` 能执行 `pip install` 任意包；
- `TestLog.vue` 用 `v-html` 渲染日志；
- `finish_report_mail.py` 硬编码 SMTP 凭据；
- `adb reboot` 用 `shell=True` 拼接命令。

这些单看都能解释（内网工具、单人维护、快速交付），但它们叠加起来意味着：**任何能访问 3000 端口的人，都能读走 WiFi 密码、让服务器装任意包、并以公司邮箱发信。**

最低限度的加固顺序：

1. **监听地址**改成 `127.0.0.1`，需要局域网访问时前面放 Nginx/Caddy，加 Basic Auth 或公司 SSO。
2. **关掉或白名单** `/api/pretest/install`；如果保留，只允许 Pretest 报告里缺失的包。
3. **凭据**从源码移到环境变量/密钥管理，轮换已经泄漏的授权码。
4. **日志渲染**先转义再高亮，不用 `v-html`。
5. **CORS**从 `*` 改成明确的前端 origin。

一句话：它是一个内网工具，不要把它放到公网。如果一定要放，先把它当成一个「能执行命令、能读公司配置」的服务来设计。

## 如果重写，我会先改这五件事

如果明天要从零重写 AutoTest，我会保留「开发机 + 测试服务器 + SSE」的整体形状，但先改这五处：

**一、给批次一个可取消的进程表。**

用一个 `Map<reportId, Set<ChildProcess>>` 保存当前批次的子进程，提供 `POST /stop-tests`，并在进程退出时统一走 `settleChild`。停止不是「关前端连接」，而是「发信号、等退出、写报告、释放锁」。

**二、把进程日志和用例日志分开。**

`reports/<id>/run.log` 按行 append，SSE 直接 tail 它；用例日志用 `pytest_runtest_logreport` 的 `capstdout` 关到 nodeid。这样 collect 阶段的错误不会丢，多用例脚本不会重复 N 份，也不会每行重写整个 JSON。

**三、报告 ID 改成 ULID，summary 改成聚合。**

ULID 单调、可按时间排序、不需要 `.daily_counter.json`，也不会有「日期是运行日、序号是历史总量」的歧义。summary 在合并后重新遍历 tests 计算，exitcode 用显式的「有失败即 1」。

**四、配置表加列白名单，写入用 UPSERT + JSONB。**

表名白名单不够，列名也要白名单；或者干脆一张 `config(id, data JSONB, updated_at)`，用 `ON CONFLICT` 更新，避免 DELETE 空窗。凭据加密存储，至少不要明文。

**五、把依赖和大小写放进 CI。**

`npm ci && npm run build` 在 Linux runner 上跑；`python -m pytest --collect-only` 在干净 venv 里跑；`import` 的文件名大小写用 lint 或构建直接暴露。内部工具最容易死在「只在我电脑上能跑」。

这五件事都不涉及 Appium 的业务逻辑，但它们决定了这个工具能不能被第二个人接手。

## 小结：把测试变成服务，成本在边界

AutoTest 的价值不在于「点一个按钮跑 pytest」——那只是一个 shell 包装。它的价值在于把四类隐形劳动显式化了：

- **进程边界**：每个脚本一个 pytest 进程，Python 路径、编码、缓冲、Android SDK 都要在启动前解决；
- **文件边界**：报告目录、子报告合并、日志挂载、计数器，任何一处不一致都会让结果不可信；
- **人的边界**：批次互斥、只发一封邮件、Pretest、可读的错误信息，让「第二个人」也能用；
- **安全边界**：无鉴权、CORS 全开、可执行 pip、硬编码凭据，决定了它只能待在局域网里。

如果只记三句话：

1. 把测试跑起来靠 Appium，把测试跑成服务靠进程管理。
2. 报告不是「pytest 的输出」，而是「你自己定义的数据契约」；合并函数必须是聚合，不是最后一次写入。
3. 内部工具最容易忽略的是异常路径：停止按钮、collection 失败、跨天计数、Windows 大小写，这些才是第二个人接手时最先踩到的坑。

代码在 [github.com/zhoujungis/AutoTest](https://github.com/zhoujungis/AutoTest)。它不是一个可以直接对外发布的平台，但它把「远程跑手机自动化」这件事的骨架搭完整了；上面列的每一个坑，都是这个骨架真实承重的地方。

**相关阅读**

- [NanoQA：一套测试管理系统的四道硬边界](/article/nanoqa-versioned-quality-loop/)
- [NanoSSH：13 MB 的 Windows SSH 客户端怎么做](/article/nanoss-windows-ssh-client/)
- [InterviewAtlas：3 万条面经的自动采集与 LLM 归纳](/article/interviewatlas-daily-crawl-llm-analysis/)
