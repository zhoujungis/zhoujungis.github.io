---
title: "ECHO SPACE：在 Cloudflare 边缘做一个带登录、去重统计与自由组歌的沉浸式播放器"
slug: echo-space-immersive-audio-player
cover_image: /photos/echo-space-immersive-audio-player-cover.png
date: 2026-11-25
tags: [Cloudflare, D1, SQLite, 安全, 实时, 项目实战]
---

> 适用读者：想把一个「能用的产品」完整地放到边缘上跑、却又不想被框架和服务器绑架的前端工程师；正在用 Cloudflare Pages Functions 和 D1 做小产品、被认证、限流、统计口径和并发写入反复咬到的人；以及任何写过一个播放器、然后发现「播放」只占整件事两成的人。
> 结论先行：ECHO SPACE 是一个部署在 Cloudflare Pages 上的沉浸式音频播放器，前端是零依赖的原生 HTML/CSS/JS，后端是 Pages Functions 加 D1。它真正难的地方不是把音频放出来，而是四类边界：认证要在一万次 PBKDF2 迭代里兼顾边缘 CPU 预算；播放时长要用 `currentTime` 差值而不是定时器，否则拖动进度条会虚增统计；同一段播放要能被去重成一条记录，这是 `sessionId` + UPSERT + 部分唯一索引三件套；自由组歌要把「训练总时长」精确地切成歌曲段、休息段和热身拉伸，一行不能多也一行不能少。文章会给出 7 条 API 路由、4 次 D1 迁移、4 张表的真实实现，也会把「限流只在 isolate 内」「旧历史无法精确去重」「服务端信任前端提交的曲名」这些边界逐一定位到文件。
> 阅读时间：约 50 分钟 | 难度：进阶 | 收获：一套可以直接照抄的边缘应用骨架 + 会话级统计去重的完整做法 + 一份把「时间预算」写成纯函数的排程器

**目录**

- 这不是一个播放器 Demo
- 整体拓扑：静态资源、Pages Functions 与 D1
- 前端为什么不用框架，也不留构建产物
- 认证：PBKDF2、16 字节盐与 10000 次迭代
- 会话：Cookie 标志、30 天有效期与概率清扫
- 限流：单 isolate 内存桶与 LRU 驱逐
- 请求体上限：Content-Length 不可信，流式读取兜底
- 播放口径：用 currentTime 差值，而不是 setInterval
- 会话去重：sessionId、UPSERT 与部分唯一索引
- 数据库迁移：给旧历史表加列而不重写数据
- 统计聚合：按会话去重、14 天日历与 UTC+14 的坑
- 自由组歌：把训练计划写成纯函数
- 排程规则：跳绳、跑步、爬山三种休息模型
- 时长索引：不下载整首歌也能知道它多长
- 执行器：250ms tick、卡顿补偿与阶段切换
- 静默场景：呼吸引导与计时器
- 在线音源：JOOX 代理、临时 URL 与 5 分钟刷新
- 云端歌单：乐观锁与 rev 冲突
- 安全头与 CSP：一个页面需要的六条策略
- 检查与测试：Node 内置测试加资源校验
- 已知限制：一份诚实的清单
- 如果重写，我会先改这五件事
- 小结：边缘应用的复杂度都在边界

---

## 这不是一个播放器 Demo

大多数「音乐/音频播放器」项目的归宿是一样的：一个 HTML 文件，一个 `<audio>` 标签，一段从公开接口拉歌单的 JS。它能出声，但它不是产品，因为没有人回答下面六个问题：

- 用户不登录也能播放，那他听了多久、听了什么，存在哪里？
- 同一首歌按了暂停、又恢复、又刷新页面，历史里会留下几条记录？
- 拖动进度条往前跳 60 秒，这 60 秒算收听时长吗？
- 两个标签页同时保存歌单，谁覆盖谁？
- 「跳绳 30 分钟，每首歌后休息 30 秒」，这个计划谁负责保证总时长刚好 1800 秒？
- 部署在一万台边缘机器上的限流，到底限的是谁？

ECHO SPACE 是围绕这六个问题长出来的。它的规模并不夸张：前端是 `public/` 下一组原生模块，后端是 `functions/api/` 下 7 个处理函数，数据落在 D1 的 4 张表里。它没有 framework、没有 bundler、没有毫秒级的构建产物；打开页面就是一次静态 HTML 请求，加几次 `/api/*`。但它的复杂度不在代码量，而在边界：认证的 CPU 预算、会话 Cookie 的生命周期、播放口径的定义、去重的主键、迁移的兼容性、限流的物理位置。

先把结论摆出来，后面逐条拆：

- 认证用 PBKDF2-SHA-256，随机 16 字节盐，**固定 10000 次迭代**——不是为了最强，而是为了不撞 Pages Functions 的 CPU 上限。
- 会话是存在 D1 里的 `echo_sessions` 行，Cookie 是 `HttpOnly; Secure; SameSite=Lax`，有效期 30 天，过期靠「登录时删一批 + 访问时按 2% 概率清扫」。
- 播放时长**绝不**用 `setInterval` 累加，而是用 `audio.currentTime` 的真实差值，并对「单次差值大于 5 秒」的跳变直接丢弃。
- 一次播放会话生成一个 `sessionId`，写入走 `INSERT ... ON CONFLICT DO UPDATE`，配合 `(username, session_id)` 的部分唯一索引，把重复的网络重试折叠成一行。
- 自由组歌的核心 `buildPlan()` 是纯函数，输入歌曲时长和总秒数，输出一个「所有段秒数之和严格等于总时长」的分段数组——这是可以用单元测试钉死的。
- 限流是 isolate 内存里的 Map，只能算边缘层的 best-effort，这一点在 README 里被明确写成「已知限制」，而不是藏在注释里。

这篇文章会把每一处都落到文件、函数和常量上。先把「为什么值得写」讲清楚，再讲「怎么做的」。

## 整体拓扑：静态资源、Pages Functions 与 D1

ECHO SPACE 的全部基础设施只有三样东西：

```text
浏览器
  |
  |-- 静态资源 ------------------> Cloudflare Pages
  |                                 public/index.html
  |                                 public/js/*.js
  |                                 public/styles.css
  |                                 public/audio/*
  |
  |-- /api/* ---------------------> Pages Functions
                                    functions/api/*.js
                                      |
                                      `--> Cloudflare D1: echo-space-db
```

`wrangler.toml` 里只有很短一段配置决定了这个拓扑：

```toml
name = "echo-space-run"
compatibility_date = "2026-08-27"
pages_build_output_dir = "./public"

[[d1_databases]]
binding = "DB"
database_name = "echo-space-db"
database_id = "788e722f-9aea-48d2-89ad-f449ed393aa2"
```

`pages_build_output_dir` 指向 `public/`，意味着 Pages 会把这个目录整体当作静态站点；`binding = "DB"` 让每个 Function 通过 `env.DB` 拿到 D1。没有单独的 API 服务器，没有容器，没有需要保活的进程——这正是边缘应用最迷人的地方，也是它最容易被误判的地方。

误判在于：很多人以为「静态资源 + Functions」意味着「没有状态」。恰恰相反，状态全在 D1 里，而 D1 是一个**地域分布的 SQLite**。你写的 `INSERT`、`UPDATE`、唯一索引、事务批处理，行为和本机 SQLite 高度一致，但它的并发模型、延迟和「每次调用都是一个新 isolate」的性质，会反过来塑造你的 API 设计。后面关于会话、限流、去重、乐观锁的每一节，本质上都是在回答同一个问题：在一个没有常驻进程、每次请求都可能落到不同 isolate 的环境里，怎么把状态写对。

## 前端为什么不用框架，也不留构建产物

`public/` 里的前端是原生 HTML/CSS/JS，没有 React、没有 Vue、没有 Vite。目录长这样：

```text
public/
├── index.html          # 页面骨架：场景卡片、播放器、登录弹窗、个人页
├── styles.css          # 深色主题、场景配色、响应式、动画、无障碍焦点
├── free-mode.js        # 自由组歌的纯函数排程器（可单元测试）
├── tracks-data.js      # 场景目录与本地曲目元数据
├── durations-data.js   # 构建前生成的音频时长索引
├── _headers            # Pages 的缓存与安全响应头
├── audio/              # 实际音频文件
└── js/
    ├── main.js         # 入口：初始化、路由、事件绑定
    ├── core.js         # 全局 state、audio 元素、SCENE_META、工具函数
    ├── auth.js         # 登录/注册弹窗与本地登录态
    ├── player.js       # 播放、暂停、切歌、拖动、音量、媒体键
    ├── scene.js        # 场景切换、列表渲染、播放顺序、下一首
    ├── stats.js        # 播放时长统计与会话 flush
    ├── free-training.js# 自由组歌执行器（250ms tick）
    ├── library.js      # JOOX 在线搜索与云端歌单
    ├── profile.js      # 个人页与统计渲染
    ├── timer.js        # 静默场景的呼吸引导与计时器
    ├── views.js        # 视图切换与 hero 同步
    ├── settings.js     # 设置页与分组 tab
    └── dialog.js       # toast、焦点陷阱、背景 inert
```

不用框架的理由不是「炫技」，而是三条很具体的约束：

1. **首屏只要两次请求。** 静态 HTML + 一次 CSS，剩下的 JS 都是原生 `import`，浏览器自己就能缓存和并行。没有 bundle 也就没有 hydration，没有「先白屏再填充」。
2. **音频播放需要接近底层的控制。** `audio.currentTime`、`timeupdate`、`seeked`、`Media Session API`、`sendBeacon`——这些都得直接摸 DOM。框架的响应式在这里只增加一层「什么时候该同步」的心智负担。
3. **可测试的纯函数要能脱离框架跑。** 自由组歌的排程逻辑放在 `public/free-mode.js` 里，用 `vm.runInNewContext` 就能在 Node 里测，不需要 jsdom、不需要组件挂载。

代价也很诚实：没有组件系统，就意味着「播放按钮的图标和 aria 状态」这种逻辑容易散落在四个音频事件处理器里。作者后来专门在 `player.js` 里收敛成一个函数：

```js
// player.js —— 播放/暂停图标 + aria 状态的唯一入口
export function syncPlayButton(active, label = "播放 / 暂停") {
  $("ic-play").classList.toggle("hidden", active);
  $("ic-pause").classList.toggle("hidden", !active);
  const button = $("btn-play");
  button.setAttribute("aria-pressed", String(active));
  button.setAttribute("aria-label", label);
}
```

`core.js` 里则集中了全局状态和场景元数据，避免每个模块各自维护一份：

```js
// core.js —— 单一状态源
const SCENE_META = {
  silence: { name: "静默", en: "SILENCE", list: "白噪音 · 冥想" },
  jump:    { name: "跳绳", en: "JUMP ROPE", list: "DJ 节奏歌单" },
  run:     { name: "跑步", en: "RUNNING", list: "步频歌单" },
  hike:    { name: "爬山", en: "HIKING", list: "山野歌单" },
};

const state = {
  scene: null,
  tracks: [],
  idx: -1,
  playing: false,
  shuffle: false,
  loop: "all",
  volume: readVolume(),
  seeking: false,
};
```

这里有一个容易被忽视的设计点：`SCENE_COLORS` 也被放在 `core.js`，让「个人页的统计条染色」和「最近播放记录的小圆点」用同一份颜色，而不是在两个组件里各写一套十六进制。原生前端没有 props 传递，`state` 和这些常量就是事实上的「共享上下文」，所以它们必须唯一。

## 认证：PBKDF2、16 字节盐与 10000 次迭代

先看密码存储的形状。`functions/api/_auth.js` 里，盐和哈希是这样生成的：

```js
export const PASSWORD_ITERATIONS = 10000;

export function createPasswordSalt() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
}

export async function hashPassword(password, saltHex, iterations = PASSWORD_ITERATIONS) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: hexToBytes(saltHex),
      iterations,
      hash: "SHA-256",
    },
    material,
    256,
  );
  return bytesToHex(new Uint8Array(derived));
}
```

这里有三个值得停下来看的选择。

**第一，为什么是 PBKDF2 而不是 Argon2 或 scrypt。** 因为有 Web Crypto。Pages Functions 跑在 Workers runtime 里，`crypto.subtle.deriveBits` 是原生支持的，而 Argon2 需要 WASM 或额外的 CPU 时间，在一个每次调用都有 CPU 预算的环境里不划算。PBKDF2 不是最强的密码派生函数，但它是「能在一万次迭代里稳定跑完」的那个。

**第二，为什么是 10000 次，而不是 OWASP 推荐的几十万次。** 这是整篇文章里最「反直觉」的一个决定，而代码里的注释写得很明白：

```js
// Keep this below the Pages Functions CPU budget. Raising it can make auth
// requests time out at the edge.
export const PASSWORD_ITERATIONS = 10000;
```

在自建服务器上，你当然应该把迭代次数拉到 600000。但 Pages Functions 的免费/低配层对单次请求的 CPU 时间有硬上限，PBKDF2 是纯 CPU 密集型运算，迭代次数一高，登录请求就会在边缘超时。作者选择了「让登录能用」，而不是「让哈希理论最优」——这是一个真实的工程取舍，而且它被明确写进了代码和 README 的已知限制，而不是悄悄埋着。

**第三，为什么盐用 16 字节、哈希用 256 位。** 16 字节（128 位）的随机盐足够抵抗彩虹表，也足够便宜；`deriveBits(..., 256)` 让输出是 256 位，用十六进制表示就是 64 个字符，正好落在 `TEXT` 里。这两件事都不需要「更大」，因为在边缘上的每一毫秒都要算账。

登录校验本身是常量时间之外的一个小细节：`hashPassword(password, account.password_salt)` 算出来的哈希和数据库里的 `password_hash` 直接字符串比较。这里没有用 `timingSafeEqual`，因为两边都是服务端派生的十六进制串，且比较的结果不直接暴露给攻击者（错误信息统一是「账号或密码不正确」）。这是一个可以接受、但也值得知道的边界。

## 会话：Cookie 标志、30 天有效期与概率清扫

认证通过后，服务端并不发 JWT，而是发一个存在 D1 里的随机会话 token：

```js
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
export const SESSION_COOKIE = "echo_token";

export function sessionCookie(token) {
  return [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ].join("; ");
}
```

四个标志各有分工：`HttpOnly` 让 JavaScript 读不到 token，XSS 偷不走；`Secure` 只在 HTTPS 上发送，边缘默认就是 HTTPS；`SameSite=Lax` 挡住绝大多数跨站请求伪造，同时不破坏从外部链接点进来的正常导航；`Max-Age` 让浏览器 30 天后自动丢弃。会话 token 本身是 `crypto.randomUUID()`，135 位随机性，不存在被猜中的问题。

真正有意思的是「过期会话怎么清」。Pages Functions 没有 cron trigger，你没法每天凌晨跑一个清理任务。所以作者用了两段逻辑。第一段在 `authenticatedUsername()` 里——当某个用户带着 token 来访问时，如果这条 session 已经过期，就顺手删掉它：

```js
export async function authenticatedUsername(request, env) {
  const token = sessionToken(request);
  if (!token) return null;
  const session = await env.DB.prepare(
    "SELECT username, expires_at FROM echo_sessions WHERE token = ?",
  ).bind(token).first();
  if (!session || session.expires_at <= Date.now()) {
    if (session) await env.DB.prepare("DELETE FROM echo_sessions WHERE token = ?").bind(token).run();
    return null;
  }
  // 2% 概率做一次全局清扫：清掉所有已过期的 session
  if (Math.random() < SESSION_SWEEP_PROBABILITY) {
    try {
      await env.DB.prepare("DELETE FROM echo_sessions WHERE expires_at <= ?").bind(Date.now()).run();
    } catch {}
  }
  return session.username;
}
```

第二段是这 2% 的概率清扫。它的思路是：既然没有定时任务，就把清理工作摊到正常请求上——平均每 50 次认证请求，就有一个会顺手执行一次 `DELETE FROM echo_sessions WHERE expires_at <= ?`。这样过期数据不会无限堆积，而单个请求最多多一次轻量 DELETE。`try {} catch {}` 是刻意的：清扫失败不能影响这次请求的正常返回。

这个设计不完美，但它诚实地承认了边缘环境没有定时器的现实。真正的改进方向是把清扫放进 Durable Object 的 alarm，或者用 Cloudflare 的 Cron Trigger 定期调用一个 `/_sweep` 端点——这两条都写在了「如果重写」的清单里。

## 限流：单 isolate 内存桶与 LRU 驱逐

限流器是 `_auth.js` 里最值得单独讲的一段代码。它的接口很小：

```js
export function createRateLimiter({ windowMs, max, maxBuckets = 10000 }) {
  const buckets = new Map();
  return {
    check(key) { /* ... */ },
    clear(key) { buckets.delete(key); },
  };
}

const authLimiter = createRateLimiter({ windowMs: 5 * 60 * 1000, max: 10 });
```

意思是「同一个 key，在 5 分钟内最多 10 次」。`check()` 的实现有三层防御，值得逐层看。

**第一层：惰性过期。** 没有定时器扫 Map，而是在每次 `check()` 时比较 `now - bucket.startedAt >= windowMs`，过期就重置。这是 token bucket / sliding window 的常见写法。

**第二层：容量上限。** `maxBuckets = 10000` 是为了防止「攻击者用无数个 key 把内存撑爆」。当 Map 超过上限时，先把所有已过期的桶删掉；如果删完还超，就用「Map 的插入顺序」当作近似 LRU，从最早插入的开始驱逐：

```js
if (buckets.size > maxBuckets) {
  for (const [bucketKey, bucketValue] of buckets) {
    if (now - bucketValue.startedAt >= windowMs) buckets.delete(bucketKey);
  }
  // 若所有桶都还活跃，就淘汰最老的，避免攻击者控制的 key 无限增长内存
  while (buckets.size > maxBuckets) buckets.delete(buckets.keys().next().value);
}
```

**第三层：登录成功就清零。** `login.js` 和 `register.js` 在成功后都会调用 `clearAuthRateLimit(request)`，把当前来源地址的桶删掉。这样「连续输错几次密码、然后终于输对」不会继续占用配额。

现在说清楚它的**物理边界**，这也是 README 里明确写下的：

> 当前限流 Map 存储在 Pages Functions isolate 内，只能作为边缘层的 best-effort 防护。若需要强抗攻击能力，应在 Cloudflare WAF、Rate Limiting Rules 或 Durable Objects 中增加分布式限流。

这句话非常关键。Cloudflare 的边缘有成千上万个 isolate，每个 isolate 各自持有自己的 Map。攻击者只要让请求落到不同 isolate，就能绕过「单 isolate 10 次」的限制。所以这个限流器的真实作用不是「挡住分布式暴力破解」，而是「挡住单个连接/单个用户的快速重试」，以及降低你的 D1 写入压力。把这句话藏在代码注释里是失职，写成文档里的「已知限制」才是对读者负责。

## 请求体上限：Content-Length 不可信，流式读取兜底

所有写接口都限制请求体大小，默认 8 KiB。最直觉的做法是看 `Content-Length`：

```js
export function requestExceedsLimit(request, maxBytes = 8192) {
  const length = Number(request.headers.get("content-length"));
  return Number.isFinite(length) && length > maxBytes;
}
```

但 `Content-Length` 是可选的：分块传输（chunked）的请求可以不带它。所以真正的防线是边读边数：

```js
export async function readJson(request, maxBytes = 8192) {
  if (requestExceedsLimit(request, maxBytes)) throw tooLarge();
  if (!request.body) return request.json();
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw tooLarge();
    }
    chunks.push(value);
  }
  reader.releaseLock();
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
```

这一段的价值不在「能拒绝大包」，而在「不能通过省略 header 绕过限制」。`reader.cancel()` 会尽快断开上游，避免继续把数据读进内存；`releaseLock()` 保证流被正确释放。任何接受 JSON 的接口只要走 `readJson`，就同时获得了「大小上限」和「合法 JSON」两件事，调用方不需要重复写 try/catch。

歌单接口是个例外，它需要更大的上限，所以显式传了 `MAX_LIBRARY_BYTES + 1024`：

```js
const libraryJson = await readJson(request, MAX_LIBRARY_BYTES + 1024);
```

多出来的 1024 字节是给 JSON 外壳（字段名、括号、引号）留的余量，因为 `validateLibrary()` 之后还会对序列化后的字节数再做一次精确判断。

## 播放口径：用 currentTime 差值，而不是 setInterval

这是整篇文章里最容易被写错、也最容易被忽略的一节。几乎所有「统计收听时长」的初级实现都是这样的：

```js
// 反例：不要这样写
setInterval(() => { if (playing) totalSeconds += 1; }, 1000);
```

它有三个致命问题：第一，定时器在后台标签页会被节流，累计的秒数和真实收听对不上；第二，用户拖动进度条往后跳 3 分钟，你不会知道；第三，暂停时如果定时器没清干净，会继续加。

ECHO SPACE 用的是「真实媒体时间的差值」。核心在 `public/js/stats.js`：

```js
export function recordAudioProgress() {
  if (!seg) return;
  const current = audio.currentTime;
  if (!Number.isFinite(current)) return;
  const previous = seg.mediaTime;
  if (state.playing && !state.seeking && Number.isFinite(previous)) {
    const delta = current - previous;
    // 忽略拖动和浏览器的时间跳变；正常 timeupdate 的间隔远小于 5 秒
    if (delta > 0 && delta <= 5) seg.acc += delta;
  }
  seg.mediaTime = current;
}
```

这段逻辑有四个关键判断，每一个都对应一个真实故障：

1. **`state.playing` 为真才累计。** 暂停时不加，避免「暂停了还在涨」。
2. **`!state.seeking` 才累计。** 拖动进度条时，`input` 事件把 `state.seeking` 设为 true，累计暂停；`change` 事件（真正落点）再调用 `syncMediaTime()` 把锚点重置到新的 `currentTime`，这样「跳过去的那一段」不会被算进收听。
3. **`delta > 0`。** 用户往回调，差值可能是负的，不累计。
4. **`delta <= 5`。** 这是最重要的一条。后台标签页恢复、系统休眠唤醒、网络缓冲都会让两次 `timeupdate` 之间的差值突然变成几十秒甚至几分钟；正常播放时这个差值通常是 0.25～1 秒。把「大于 5 秒的跳变」当作异常丢弃，是这套口径能成立的关键。

配套还有三个时机点。`timeupdate` 只负责调用 `recordAudioProgress()`；每 30 秒的定时器负责「累计到 5 秒以上就 flush 一次，但保持会话不关」：

```js
setInterval(() => {
  if (!seg || !state.playing) return;
  recordAudioProgress();
  if (seg.acc >= 5) flushSegment({ keepOpen: true });
}, 30000);
```

而页面关闭时，用的是 `sendBeacon`——因为 `fetch` 在 `pagehide` 之后可能被浏览器取消：

```js
window.addEventListener("pagehide", () => {
  if (!seg || !getMe()) return;
  recordAudioProgress();
  const seconds = Math.round(seg.acc);
  if (seconds < 5) return;
  const body = JSON.stringify({ sessionId: seg.id, scene: seg.scene, title: seg.title, artist: seg.artist, seconds });
  try {
    navigator.sendBeacon("/api/history", new Blob([body], { type: "application/json" }));
  } catch {
    sendHistory({ sessionId: seg.id, scene: seg.scene, title: seg.title, artist: seg.artist, seconds });
  }
});
```

`sendBeacon` 的语义是「把数据交给浏览器，即使页面卸载也尽力发出去」，正好匹配「关页面时最后兜一次」的需求。加上前面 5 秒的门槛，用户只点开听了两秒就关掉，不会产生一条垃圾记录。

## 会话去重：sessionId、UPSERT 与部分唯一索引

播放统计最难的问题不是「怎么计时」，而是「怎么不重复」。用户按了暂停又恢复、每 30 秒 checkpoint 一次、页面关闭再发一次 beacon——同一次收听会产生很多次网络写入。如果每次 `POST /api/history` 都 `INSERT` 一行，历史里就会出现几十条同一首歌的记录。

解决办法是给每一次「连续播放」分配一个 `sessionId`：

```js
export function startPlaybackSession(track) {
  if (!track || !state.scene) return;
  seg = {
    id: crypto.randomUUID(),   // 一次播放会话的唯一 id
    scene: state.scene,
    title: track.t,
    artist: track.a,
    acc: 0,
    mediaTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
  };
}
```

暂停时 `flushSegment()` 会先把 `seg` 置空（`keepOpen: false`），恢复播放时 `playTrack` 又会 `startPlaybackSession()` 生成一个新的 `sessionId`。所以「暂停再恢复」在语义上是两次会话，这是产品层面的选择——它让「听了 3 分钟、暂停、又听 2 分钟」和「连续听 5 分钟」在统计里可以区分。

真正把重复写入折叠成一行的，是服务端这条语句：

```sql
INSERT INTO echo_history (username, session_id, updated_at, scene, title, artist, seconds, played_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT DO UPDATE SET
  updated_at = excluded.updated_at,
  seconds = MAX(echo_history.seconds, excluded.seconds)
```

`ON CONFLICT DO UPDATE` 需要一个冲突目标，而这里没有显式写 `ON CONFLICT (username, session_id)`，是因为表上有一个**部分唯一索引**：

```sql
CREATE UNIQUE INDEX idx_history_user_session
  ON echo_history(username, session_id)
  WHERE session_id IS NOT NULL;
```

这个部分唯一索引是整套设计的枢纽，有三个细节：

- **`(username, session_id)` 而不是单独的 `session_id`。** `sessionId` 是客户端用 `crypto.randomUUID()` 生成的，理论上可能撞车；加上 `username` 之后，唯一性约束的语义变成「同一个用户的同一个会话」，即使两个用户生成了一样的 UUID 也不冲突。
- **`seconds = MAX(echo_history.seconds, excluded.seconds)`。** 后到的请求只会把秒数往大了更新，不会把之前累计的时长改小。这样即使网络乱序、beacon 晚到，历史也不会缩水。
- **`WHERE session_id IS NOT NULL`。** 旧数据没有 `session_id`，这个部分索引把它们排除在外，所以历史表可以同时容纳「新的会话级记录」和「旧的逐条记录」，迁移时不需要回填。

写入之前还有两道校验。`sessionId` 必须匹配 `^[A-Za-z0-9_-]{16,80}$`，防止注入奇怪字符或超长 key；`seconds` 必须满足 `0 < seconds <= 3 * 3600`，小于等于 0 或超过 3 小时直接返回 `{ ok: true, skipped: true }`——注意它返回的是成功，而不是错误，因为「这次没记」不是客户端的错。

## 数据库迁移：给旧历史表加列而不重写数据

第 4 个迁移文件是理解这套 schema 演进的钥匙：

```sql
-- 0002_history_sessions.sql
ALTER TABLE echo_history ADD COLUMN session_id TEXT;
ALTER TABLE echo_history ADD COLUMN updated_at INTEGER;
CREATE UNIQUE INDEX IF NOT EXISTS idx_history_user_session
  ON echo_history(username, session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_history_user_updated ON echo_history(username, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON echo_sessions(expires_at);
```

这里的顺序很重要：先 `ADD COLUMN`，再建部分唯一索引。SQLite（以及 D1）允许给已有表加列，新列默认是 `NULL`；因为索引带了 `WHERE session_id IS NOT NULL`，所有旧行的 `session_id` 都是 `NULL`，所以它们不会进入这个唯一索引，也不会互相冲突。换句话说，**迁移没有重写任何旧数据**，旧记录继续以「每条一个 id」的方式存在，新记录以「每个会话一个 session_id」的方式存在。

`echo_history` 的完整字段（来自 `schema.sql`）是这样的：

```sql
CREATE TABLE IF NOT EXISTS echo_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  session_id TEXT,
  updated_at INTEGER,
  scene TEXT NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  seconds INTEGER NOT NULL DEFAULT 0,
  played_at INTEGER NOT NULL
);
```

注意 `updated_at` 和 `played_at` 是两回事：`played_at` 是**首次写入时间**，不会变；`updated_at` 是**最近一次 checkpoint 时间**，每次 UPSERT 都会更新。这个区分在统计聚合里非常关键——「最近播放」应该按 `updated_at` 排，而「14 天活跃日历」应该按 `played_at` 归属日期。

迁移一共四个，节奏很清楚：

| 迁移文件 | 做了什么 | 为什么单独拆出来 |
| --- | --- | --- |
| `0001_init.sql` | 建 `echo_users`、`echo_sessions`、`echo_history` 与基础索引 | 初始结构 |
| `0002_history_sessions.sql` | 给历史表加 `session_id`、`updated_at`，建部分唯一索引 | 支持会话级去重，不动旧数据 |
| `0003_libraries.sql` | 建云端歌单表 `echo_libraries` | 新增功能 |
| `0004_library_rev.sql` | 给歌单表加 `rev` 乐观锁字段 | 并发写入冲突检测 |

这种「每个迁移只做一件事」的纪律，比「一个大 schema.sql 反复执行」可靠得多。README 里也明确写了：线上库不要直接跑 `schema.sql` 里的 `ALTER`，要走 `npm run db:migrate`，因为迁移系统会记录哪些文件已经执行过。

## 统计聚合：按会话去重、14 天日历与 UTC+14 的坑

`GET /api/history` 是整个后端里最复杂的一个 handler。它要在一个请求里返回四组数据：总量、按场景分布、最近 14 天、最近 50 条。四条 SQL 用 `Promise.all` 并发，然后拼装。

**总量：按会话去重。** 这里的关键是 `COUNT(DISTINCT COALESCE(session_id, 'legacy:' || id))`：

```sql
SELECT COUNT(DISTINCT COALESCE(session_id, 'legacy:' || id)) AS plays,
       COALESCE(SUM(seconds), 0) AS seconds,
       MIN(played_at) AS first_at
FROM echo_history WHERE username = ?
```

`COALESCE(session_id, 'legacy:' || id)` 的意思是：新数据用 `session_id` 作为「一次播放」的身份，旧数据没有 `session_id`，就用 `'legacy:' || id` 合成一个唯一值。这样 `COUNT(DISTINCT ...)` 既能正确统计新的会话级播放，也能兼容旧的逐条记录。`SUM(seconds)` 则直接累加——因为同一会话的 UPSERT 已经把秒数收敛成一行，不会重复加。

**按场景分布：** 同样的 `COUNT(DISTINCT ...)`，只是加了 `GROUP BY scene`，结果被拼成一个对象：

```js
const byScene = {};
for (const row of bySceneRows.results || []) {
  byScene[row.scene] = { plays: row.plays, seconds: row.seconds };
}
```

**14 天日历：这里有一个真正的坑。** 前端要的是「最近 14 天，每天听了多少秒」，横轴是日期标签。直觉写法是「取今天，往前推 13 天，生成 14 个日期字符串」。但如果只按服务器所在的时区算，UTC+12 到 UTC+14 的用户会看到日期整体错位一天。作者的处理方式是：在**请求要求的时区**里确定「今天」，再用 UTC 的锚点生成 14 个日历日期：

```js
const dayKey = (ts) => toDateKey(new Date(ts), formatter);
const todayParts = Object.fromEntries(
  formatter.formatToParts(new Date()).map((p) => [p.type, p.value]),
);
// 用 UTC 的正午作为锚点生成 14 个标签；再用 UTC 格式化，
// 避免在 UTC+12..+14 的时区里把日期整体推后一天。
for (let i = 13; i >= 0; i--) {
  const anchor = new Date(
    Date.UTC(Number(todayParts.year), Number(todayParts.month) - 1, Number(todayParts.day) - i, 12),
  );
  days.push({ date: toDateKey(anchor, utcFormatter), seconds: 0 });
}
```

注释里那句「用 UTC 正午作锚点」是精髓。如果直接用本地零点，UTC+14 的「今天」和 UTC 的「今天」会差一天；用正午作锚点，再统一用 UTC 格式化，就能让日期标签在不同时区下都稳定。这个坑甚至有一个专门的测试（`tests/history.test.mjs`），用 `Pacific/Kiritimati`（UTC+14）验证最后一天就是用户本地的今天：

```js
test("history day labels keep the requested UTC+14 calendar date", async () => {
  const request = new Request("https://example.test/api/history?tz=Pacific%2FKiritimati", {
    headers: { cookie: "echo_token=test-token" },
  });
  const response = await onRequestGet({ request, env: { DB: fakeDb() } });
  const body = await response.json();
  assert.equal(body.days.length, 14);
  assert.equal(body.days.at(-1).date, /* 本地今天 */);
});
```

**最近 50 条：** 按 `COALESCE(updated_at, played_at)` 倒序，这样刚刚 checkpoint 过的会话会排到最前面，而不是按首次播放时间沉底：

```sql
SELECT scene, title, artist, seconds, COALESCE(updated_at, played_at) AS played_at
FROM echo_history WHERE username = ?
ORDER BY COALESCE(updated_at, played_at) DESC LIMIT 50
```

至于 `tz` 参数本身，也不是直接信任：`requestedTimeZone()` 会先用 `Intl.DateTimeFormat` 试着格式化一次，非法时区就回退到 `UTC`。这比白名单更宽容，也比不校验更安全。

## 自由组歌：把训练计划写成纯函数

自由组歌是 ECHO SPACE 里最像「产品」的功能：你选一个训练总时长（10～180 分钟），系统把它切成「歌曲段 + 休息段 + 热身 + 拉伸」，并且保证**所有段的秒数之和严格等于你选的总时长**。这个保证不是靠 UI 拼出来的，而是靠一个纯函数 + 单元测试钉死的。

核心在 `public/free-mode.js` 的 `buildPlan()`。它的签名很朴素：

```js
function buildPlan(scene, tracks, durations, totalSeconds, order) { /* ... */ }
```

输入是场景、曲目列表、每首的时长、总秒数和播放顺序，输出是一个 `segments` 数组。开头先算「热身 + 拉伸」各占多少：

```js
function guidedPhaseSeconds(totalSeconds) {
  const total = Math.max(0, Math.round(Number(totalSeconds) || 0));
  // 热身/拉伸最多各 3 分钟，且不超过总时长的 20%
  return Math.min(GUIDED_PHASE_MAX_SECONDS, Math.floor(total * 0.2));
}
```

然后主循环只做一件事：从剩余时间里不断切出「当前这首歌的一段」，直到剩余归零。关键的一行是：

```js
const seconds = Math.min(duration, remaining);
```

这一行保证了「最后一首歌不会因为自身时长超过剩余时间而把训练拉长」。比如总共只剩 12 秒，而下一首歌有 4 分钟，那这一段的秒数就是 12 秒，而不是 240 秒。循环结束后还会兜底：

```js
if (remaining > 0) {
  segments.push({ type: "work", trackIndex: null, title: "训练结束前的缓冲", seconds: remaining });
  remaining = 0;
}
```

正常情况下 `remaining` 一定归零；这层兜底是为了「空歌单或异常输入」时不丢秒数。最终的返回对象里带上了 `totalSeconds`、`workSeconds`、`restSeconds` 和 `segments`，其中 `totalSeconds` 是用户选择的原值，而 `segments` 的秒数之和必须等于它——这条不变式被测试直接断言：

```js
test("buildPlan keeps requested duration exact", () => {
  const tracks = [{ t: "A", a: "x" }, { t: "B", a: "y" }];
  const plan = free.buildPlan("run", tracks, [120, 120], 1800, [0, 1]);
  assert.equal(plan.segments.reduce((sum, s) => sum + s.seconds, 0), 1800);
  assert.equal(plan.totalSeconds, 1800);
});
```

除了 `buildPlan`，还有 `buildSelectedPlan()` 处理「用户手动选了某几首歌」的场景。它和 `buildPlan` 的区别是：不按总时长截断，而是按选中顺序完整排完；热身/拉伸按「实际歌曲总时长」的 20% 计算，而不是用户选的时长。还有一个 `estimateSelectedTotal()`，在用户还没生成计划时，先根据时长索引估一个「预计总时长（含休息）」显示在按钮上。这三个函数的共同点是：都不碰 DOM、不读全局状态、只依赖入参——所以它们能在 Node 里被 `vm.runInNewContext` 直接加载测试。

## 排程规则：跳绳、跑步、爬山三种休息模型

三种运动场景的休息规则，被抽成一个 `PROFILES` 表：

```js
const PROFILES = {
  silence: { restEvery: 0, restSeconds: 0, label: "连续播放" },
  jump:    { restEvery: 1, restSeconds: 30, label: "每首歌后休息 30 秒" },
  run:     { restEvery: 4, restSeconds: 45, label: "每 4 首后休息 45 秒" },
  hike:    { restEvery: 0, restSeconds: 300, label: "每 30 分钟休息 5 分钟", isTimeBased: true, intervalOptions: HIKE_INTERVALS },
};
```

这里有三种模型，分别对应三种运动节奏：

- **跳绳（jump）：按「首数」触发。** `restEvery: 1`，每唱完一首就休息 30 秒。跳绳是间歇性高强度，一首歌一个循环刚好。
- **跑步（run）：按「首数」触发，但更稀。** `restEvery: 4`，每 4 首休息 45 秒，歌曲之间默认连续播放。跑步需要的是稳定的步频，频繁打断反而破坏节奏。
- **爬山（hike）：按「时间」触发。** `isTimeBased: true`，`restEvery` 是 0，休息不是按首数而是按累计工作时长：`accWork += seconds; if (accWork >= intervalSeconds) { rest }`。间隔由用户在 `HIKE_INTERVALS = [15, 30, 45, 60, 90, 120]` 里选，默认 30 分钟。爬山是低强度长时间，按时间休息更符合体力曲线。

代码里有一个细节值得注意：休息段如果剩余时间不足 5 秒，就直接跳过（`if (rest < 5) continue;`）。这不是为了省事，而是因为「休息 3 秒」在体验上没有意义，还会让计划里出现大量碎片段。跳过这几秒不会导致总时长不准，因为后续的歌曲段会把剩余的秒数吃掉。

`buildSelectedPlan()` 里还有一处针对「时间制」和「首数制」的分支。时间制在累计工作时长达到间隔时插入休息，且最后一首歌之后不休息；首数制在 `workCount % restEvery === 0` 时插入休息，且最后一首之后也不休息。这样「训练结束时」永远是干净的收尾，而不是「先休息再结束」。

## 时长索引：不下载整首歌也能知道它多长

自由组歌需要知道每首歌多长，但音频文件动辄几 MB，而且很多是 MP3。你不能为了排一个 30 分钟的计划，把 10 首歌全下载下来读时长。`tools/generate-durations.mjs` 解决的就是这个问题：它在**部署前**读每个音频文件的容器头部，解析出时长，写成一个静态索引 `public/durations-data.js`。

关键约束是「只读 4 MB」：

```js
// 容器头和 Xing 元数据通常都在文件前部；
// 避免为了读时长把整个几 MB 的音频都加载进内存。
const length = Math.min(size, 4 * 1024 * 1024);
```

MP4/M4A 走的是解析 `mvhd` atom：找到 `mvhd` 标记，读版本号，版本 0 读 32 位的 timescale/duration，版本 1 读 64 位的，然后 `duration / timescale` 就是秒数。MP3 走的是解析帧头：跳过 ID3v2，找到第一个合法的帧头，读出码率和采样率；如果帧头后面跟着 `Xing` 或 `Info` 标记，就直接读「总帧数 × 每帧采样数 / 采样率」，这比按码率估算更准。

还有一个容错：有些 MP4 把 `moov` atom 放在文件末尾（没有做 faststart）。前 4 MB 里找不到 `mvhd` 时，脚本会再读一段尾部窗口：

```js
if (headDuration || size <= length) return headDuration;
// 有些 MP4 把 moov 放在 EOF，读一段有界的尾部窗口再试
const tailOffset = size - length;
const tail = Buffer.alloc(length);
```

这个「读头 + 读尾」的组合，既避免了加载整文件，又覆盖了绝大多数容器布局。生成出来的索引长这样：

```js
window.ECHO_DURATIONS = { silence: [612.4, 533.1, ...], jump: [...], ... };
```

前端 `core.js` 的 `durationHint()` 会按「在线曲目自带时长 → 静态索引 → 从标题里解析『分钟』→ 默认 210 秒」的顺序取值。这个多级回退保证了「即使索引缺失，计划也能生成」，只是估算会粗一点。

## 执行器：250ms tick、卡顿补偿与阶段切换

计划生成只是纸面，执行器才是真正在跑的东西。`public/js/free-training.js` 维护一个 `freeSession`，每 250ms tick 一次：

```js
freeTicker = setInterval(tickFreeTraining, 250);
```

`tickFreeTraining()` 面对两种段，处理方式不同。

**歌曲段（work）：以音频的真实播放进度为准。** 它比较 `audio.currentTime` 和这一段的 `seconds`，接近末尾就切下一段：

```js
if (segment.type === "work" && !freeSession.internal) {
  const cur = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
  if (cur >= segment.seconds - 0.25) {
    advanceFreeSegment();
    return;
  }
}
```

这里有一个「卡顿补偿」的机制，非常值得学。如果音频因为缓冲卡住了（`audio.paused` 或 `currentTime` 不走），而倒计时还在按墙上时钟走，用户就会看到「音乐没放完，倒计时先到」。所以当检测到卡顿时，执行器会把这一段的结束时间和总结束时间**往后推**：

```js
const stalled = audio.paused || Math.abs(cur - freeLastMedia) < 0.001;
if (stalled) {
  const delay = Math.max(0, now - (freeSession.lastTick || now));
  freeSession.phaseEndAt += delay;
  freeSession.totalEndAt += delay;
  stopMetro();
}
```

这样「卡了 3 秒」就等于「训练整体顺延 3 秒」，而不是「少听了 3 秒」。这个补偿只作用于歌曲段；休息段和热身/拉伸本来就是纯计时，不需要补偿。

**非歌曲段（休息/热身/拉伸）：以墙上时钟为准。** 它们没有音频进度可依赖，所以直接用 `phaseEndAt`：

```js
if (segment.type !== "work" && now >= freeSession.phaseEndAt) advanceFreeSegment();
```

阶段切换 `advanceFreeSegment()` 有一个 `transitioning` 锁，防止 250ms tick 和音频事件（`ended`/`timeupdate`）同时触发导致「连续切两段」。每次切换都会 `index += 1`，然后 `beginFreeSegment()` 重新设置 `phaseEndAt`、重置 `freeLastMedia`，并对不同段做不同的事：歌曲段调 `playTrack()` 起音频，休息段 `audio.pause()` 并触发语音播报。

还有一个 0.18～0.25 秒的「提前量」。为什么不是精确等于 `seconds` 才切？因为音频事件和定时器都有几十毫秒的抖动，如果严格等 `cur >= seconds`，可能等不到（音频实际长度比计划短几毫秒）而卡在最后一段。留一个提前量，既保证一定切得动，又几乎听不出差别。

`pauseFreeTraining()` / `resumeFreeTraining()` 负责暂停恢复。暂停时记录「当前段还剩多少秒」和「总剩余多少秒」，恢复时按墙上时钟重新算 `phaseEndAt`/`totalEndAt`，并重新 `audio.play()`。这里用了一个 `internal` 标志：执行器内部主动调用 `audio.pause()` 时，不要触发「用户暂停」的逻辑，否则会递归。

## 静默场景：呼吸引导与计时器

静默场景不参与自由组歌，它有两个独立的东西：呼吸视觉引导和专注计时器，都在 `public/js/timer.js`。

呼吸引导是一组 CSS 动画（吸气放大、呼气缩小），由 `startBreathVisual()` / `stopBreathVisual()` 控制开关，只在静默场景播放时启动。它不涉及任何计时逻辑，纯粹是视觉陪伴。

计时器则是 15/30/45/60 分钟的专注倒计时。它和自由组歌的执行器共享同一个 `AudioContext`（`core.js` 里的 `ensureAudioCtx()`），因为浏览器对 AudioContext 的数量有限制，而且用户手势激活后复用同一个上下文更稳。计时结束会播放一个提示音并停止音频。

这里有一个容易被忽略的细节：静默场景的计时器用的是**墙上时钟**（`Date.now()` 差值），而不是音频进度。因为白噪音音频可能是循环播放的，`currentTime` 会重置，不能用来做倒计时。这也反过来证明了「播放时长统计」和「专注计时」是两套不同的时间口径，不能混用。

## 在线音源：JOOX 代理、临时 URL 与 5 分钟刷新

跳绳/跑步/爬山三个场景的歌曲来自在线搜索（JOOX），而静默场景用本地音频。在线音源带来三个问题：跨域、密钥、临时 URL。

跨域和密钥都由服务端的 `functions/api/search.js` 代理解决：

```js
const JOOX_ENDPOINT = "https://apicx.asia/api/joox_music";
const MAX_UPSTREAM_BYTES = 512 * 1024;
const searchLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 30 });
const searchIpLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 120 });
```

这个代理有五个保护：只接受同源登录请求；按用户限流 30 次/分钟；按 IP 限流 120 次/分钟；上游响应超过 512 KiB 直接拒绝；上游请求 9 秒超时（`AbortController`）。`readLimitedText()` 和 `readJson()` 是同一个思路——边读边数，不能只信 `Content-Length`。token 从 `env.JOOX_TOKEN` 读，缺失时返回 503 而不是崩掉。

临时 URL 的问题在前端。JOOX 返回的 `audioUrl` 是有时效的，不能长期存在歌单里。所以 `library.js` 的 `fetchJooxDetails()` 会在播放前即时拉取，而 `player.js` 用一个 5 分钟窗口判断「要不要刷新」：

```js
function needsOnlineRefresh(track) {
  return Boolean(track && isOnlineScene(state.scene) && track.source === "joox"
    && (!track.audioUrl || Date.now() - (track.audioFetchedAt || 0) > 5 * 60 * 1000));
}
```

配合 `playbackGeneration` 计数器，异步拉取过程中如果用户又切了歌，旧的请求会被 `AbortController` 取消，避免「拉到一半的旧结果覆盖新歌」。这是一个非常典型的「异步竞态」处理：自增一个 generation，异步返回后比对 generation，不一致就丢弃。

## 云端歌单：乐观锁与 rev 冲突

云端歌单 `PUT /api/library` 要解决的是「两个标签页同时保存，谁覆盖谁」。方案是乐观锁，而不是悲观锁（边缘环境没有长事务）。表上有一个 `rev` 字段：

```sql
ALTER TABLE echo_libraries ADD COLUMN rev INTEGER NOT NULL DEFAULT 1;
```

客户端读取歌单时拿到当前的 `rev`，保存时把它回传。服务端的更新是一条带条件的 UPSERT：

```sql
INSERT INTO echo_libraries (username, library_json, updated_at, rev)
VALUES (?, ?, ?, 1)
ON CONFLICT(username) DO UPDATE SET
  library_json = excluded.library_json,
  updated_at = excluded.updated_at,
  rev = echo_libraries.rev + 1
WHERE echo_libraries.rev = ?
```

如果 `WHERE echo_libraries.rev = ?` 不成立（说明另一个标签页先写了，rev 已经变了），这条语句就**不会更新任何行**。服务端通过 `result.meta.changes` 判断，0 就返回 409，并把当前 `rev` 一起带给客户端：

```js
if (!result?.meta?.changes) {
  const row = await env.DB.prepare("SELECT rev FROM echo_libraries WHERE username = ?")
    .bind(auth.username).first();
  return json({ ok: false, code: "CONFLICT", rev: row?.rev ?? 1 }, 409);
}
```

客户端收到 409 后可以选择「用服务端的新版本」或「强制覆盖」。这个设计比「最后写入者获胜」好得多，因为后者会静默丢掉另一个标签页的编辑。

歌单数据本身也做了严格清洗。`validateLibrary()` 限制收藏 2000 首、歌单 200 个、单歌单 2000 首、序列化后不超过 1 MB；每个曲目只保留稳定标识（`uid`、`source`、`title`、`artist`、`songMid` 等），JOOX 的临时 `audioUrl` **一律丢弃**，只有 `local-fallback` 的本地路径允许保留，而且还要过一条严格的正则（不允许 `..`、不允许 URL 编码的斜杠/点）：

```js
if (output.source === "local-fallback"
    && /^audio\/(?:meditation|jumping|running|hiking)\/[^/?#\\]{1,500}$/.test(track.audioUrl)
    && !track.audioUrl.includes("..")
    && !/%2e|%2f|%5c/i.test(track.audioUrl)) {
  output.audioUrl = track.audioUrl.slice(0, 500);
}
```

这段代码是「信任边界」的教科书式写法：即使 `audioUrl` 来自客户端，也只允许它落在一个受控的路径模式下，并且显式挡住目录穿越的两种编码。

## 安全头与 CSP：一个页面需要的六条策略

`public/_headers` 是 Pages 的静态响应头配置文件。它做了两件事：给音频和脚本设置缓存策略，给所有路径设置安全头。

缓存策略很克制：音频缓存 30 天并允许 `stale-while-revalidate`；JS、CSS、`tracks-data.js`、`durations-data.js`、`free-mode.js` 全部 `max-age=0, must-revalidate`。后者是刻意的——这些是「代码」，一改就该立刻生效，不能因为 CDN 缓存让用户跑到旧版本。

安全头则是六条：

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
  media-src 'self' https: blob:; connect-src 'self'; img-src 'self' data:;
  object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

逐条看：

- `nosniff` 禁止浏览器「猜」MIME 类型，防止把 JSON 当脚本执行。
- `Referrer-Policy` 只在同源时发送完整 referrer，跨站只发域名。
- `X-Frame-Options: DENY` + CSP 的 `frame-ancestors 'none'` 双重禁止被 iframe 嵌入，防点击劫持。
- HSTS 强制一年 HTTPS。
- COOP/CORP 把页面和资源隔离到自己的源，减少跨源泄漏面。
- `Permissions-Policy` 直接关掉摄像头、麦克风、定位——这个播放器一个都不需要。
- CSP 的 `media-src` 允许 `https:` 和 `blob:`，是因为在线音源和本地录音都可能用 blob URL；`style-src` 的 `'unsafe-inline'` 是原生内联样式的必要妥协，但 `script-src 'self'` 仍然禁止任何内联脚本。

这套头的价值在于：即使某天有人往 `index.html` 里塞了一段恶意内联脚本，CSP 也会挡住它。安全不是「相信代码写对了」，而是「假设代码写错了，还能兜住」。

## 检查与测试：Node 内置测试加资源校验

ECHO SPACE 的测试策略很轻，但覆盖了最容易出错的三块。

**第一块：纯函数排程。** `tests/free-mode.test.mjs` 用 `vm.runInNewContext` 把 `free-mode.js` 加载进一个假的 `window`，然后直接测 `buildPlan`、`buildSelectedPlan`、`estimateSelectedTotal`。四个测试分别钉住：总时长精确、选中顺序保留 + 跳绳休息、爬山 5 分钟恢复、重复/非法索引被忽略。

**第二块：时区统计。** `tests/history.test.mjs` 用一个假的 D1（返回固定行）驱动 `onRequestGet`，验证 UTC+14 的日历标签不偏移。这个测试不需要真的数据库，因为 handler 只依赖 `env.DB.prepare(...).bind(...).first()/all()` 这几个接口。

**第三块：资源与语法。** `tools/check.mjs` 做四件事：递归检查 `public/` 与 `functions/api/` 下所有 `.js` 文件的语法与相对导入；加载 `tracks-data.js` 确认格式；检查每首曲目对应的音频文件存在；检查 `public/audio/` 里有没有未登记的文件。它输出的成功信息长这样：

```text
OK: 20 JS files, 10 tracks, all audio files mapped
```

这套检查的价值在于「部署前就能发现断链」。音频文件缺失、`tracks-data.js` 里写错文件名、JS 里 import 了一个不存在的模块——这些如果等到线上 404 才发现，成本高得多。

`.github/workflows/check.yml` 会在 push 和 PR 时用 Node 18 和 22 各跑一遍 `npm run check` 和 `npm test`。注意它**不**跑部署，也**不**验证 D1 迁移，因为迁移需要线上凭据；部署前的迁移和冒烟测试仍然要手动做。这是一个合理的分工：CI 管「代码本身对不对」，部署管「线上环境对不对」。

## 已知限制：一份诚实的清单

一个项目成熟与否，往往看它敢不敢把自己的短板写成文档。ECHO SPACE 的 README 里有一节「已知限制」，我把它整理成下面这张表，并补上代码位置的印证：

| 限制 | 具体表现 | 代码/配置位置 |
| --- | --- | --- |
| 限流只在 isolate 内 | 跨 isolate 的分布式攻击可绕过 | `_auth.js` 的 `createRateLimiter` |
| 无邮箱验证与找回密码 | 注册只校验格式，不验证归属 | `register.js` |
| 旧历史无法精确去重 | 旧行没有 `session_id`，按 `legacy:id` 计数 | `history.js` 的 `COALESCE` |
| 每日统计按首次写入归属 | 跨午夜长播放会算在开始那天 | `played_at` 语义 |
| 服务端信任曲名/作者 | 历史写入不校验歌曲是否真实存在 | `history.js` POST |
| 密码迭代次数受 CPU 限制 | 10000 次，低于通用推荐 | `PASSWORD_ITERATIONS` |
| 用户名大小写不统一 | 按数据库原值处理 | `echo_users.username` |

其中「服务端信任曲名/作者」和「限流只在 isolate 内」是最需要说清楚的两条。前者意味着：一个已登录用户理论上可以伪造一条「听了某首歌」的历史；要堵住它，需要在服务端维护一份曲目清单并校验。后者意味着：限流只是「挡快速重试」，不是「挡分布式爆破」。

这份清单本身就是一个很好的产品文档范例——它不假装完美，而是把「为什么这样取舍」和「代价是什么」一起交给读者。

## 如果重写，我会先改这五件事

如果让我基于这个仓库重做一版，我会按优先级改五件事。

**第一，把限流搬到能跨实例的地方。** 用 Cloudflare 的 Rate Limiting Rules，或者用一个 Durable Object 做全局计数器，或者至少把 `Map` 换成 D1 里的固定窗口表。isolate 内存桶的问题不是「写得不好」，而是「物理上到不了全局」。

**第二，给历史写入加服务端曲目校验。** 现在 `POST /api/history` 会接受客户端给的 `title`/`artist`。更稳的做法是：历史只存 `trackId`，标题和作者在读取时从服务端曲目清单 join 出来。这样伪造历史就无从谈起。

**第三，把过期 session 清扫交给 Cron 或 Durable Object alarm。** 2% 概率清扫很聪明，但它意味着「没人访问就不会清」。一个每天跑一次的 Cron Trigger 会干净得多。

**第四，统一用户名大小写策略。** 现在注册时原样存、登录时 `username` 和 `email.toLowerCase()` 一起查，中文用户名没问题，但英文用户名会出现 `Alice` 和 `alice` 两个账号。要么注册时统一小写，要么在查询时 `COLLATE NOCASE`。

**第五，把「跨午夜归属」从近似改成精确。** 每日统计现在按 `played_at` 归属，一次从 23:50 听到 00:20 的播放会全算在第一天。如果要精确，需要在 checkpoint 时按「本次新增的秒数落在哪个日期」拆分——这会增加写入复杂度，但对「14 天活跃」这种指标更真实。

这五条都不是「重写才能做」的事，而是「下一版应该优先做」的事。一个好的项目文档，应该让人一眼看出「哪些是刻意的取舍，哪些是暂时的欠账」。

## 小结：边缘应用的复杂度都在边界

把 ECHO SPACE 从头看到尾，你会发现它几乎没有「算法难题」。没有一个函数需要你推半天公式，没有一段 SQL 需要你优化执行计划。它的复杂度全部集中在边界上：

- **CPU 边界**：PBKDF2 只能跑 10000 次，否则登录超时。
- **状态边界**：没有常驻进程，session 清理只能靠「登录时删 + 2% 概率扫」。
- **时间边界**：播放时长必须用 `currentTime` 差值，且要丢掉大于 5 秒的跳变。
- **唯一性边界**：同一段播放要折叠成一行，靠的是 `sessionId` + UPSERT + 部分唯一索引。
- **时区边界**：14 天日历要在 UTC+14 也不偏一天。
- **并发边界**：两个标签页保存歌单，靠 `rev` 乐观锁而不是长事务。
- **安全边界**：CSP、请求体上限、同源校验、路径穿越过滤，一层都不能少。

这些边界没有一个是「框架能自动帮你解决」的。React 不会替你决定 PBKDF2 迭代几次，Vue 不会替你判断两次 `timeupdate` 之间的 8 秒是不是拖动，任何 ORM 都不会自动给你一个「按会话去重」的部分唯一索引。真正的边缘应用工程，就是把每一条边界都想清楚，然后写进代码、写进测试、写进文档。

ECHO SPACE 值得学的地方，不是它「用 Cloudflare 做了个播放器」，而是它把「一个播放器要成为产品，需要回答哪些问题」完整地摆了出来，并且对每一个问题都给出了一个诚实、可验证、带取舍的答案。这比任何「最佳实践清单」都更有参考价值。
