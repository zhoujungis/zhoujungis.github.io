我一直想做一个打开浏览器就能用的音乐工具：输入歌名，多个平台同时返回结果；点一下歌曲就能播放，歌词跟着进度滚动；常听的歌曲可以收藏，也可以整理成自己的歌单。这个想法最后落成了 [HALO Music](https://github.com/zhoujungis/halo_music)，也就是我自己的 Halo 音乐广场。

这个项目的重点并不是把某一个平台的页面重新做一遍，而是把多个音源、浏览器播放器、用户数据和桌面端包装在一个轻量架构里。前端是可以直接部署到 Cloudflare Pages 的静态页面，后端使用 Pages Functions 提供 API，D1 负责账号、歌单和缓存，Electron 再把同一套 Web 应用封装成 Windows 桌面客户端。

> 项目用于学习、研究和演示。音乐内容、音频地址、歌词和封面归对应平台及原作者所有，使用时应遵守当地法律、上游平台服务条款与版权政策。

## 一、先看整体架构

项目没有单独维护一套前端和一套桌面播放器。浏览器与 Electron 都加载同一个 `index.html`，区别只在于外面是否包了一层原生窗口：

```
flowchart TB
    subgraph Client[客户端]
        Browser[浏览器]
        Electron[Electron BrowserWindow]
        UI[index.html\nHTML + CSS + runtime JS]
        Audio[HTMLAudioElement]
        Local[localStorage\n主题 / 收藏 / 歌单]
    end
    subgraph Cloudflare[Cloudflare Pages]
        Static[Pages 静态资源]
        Functions[Pages Functions\n/api/*]
        D1[(D1 SQLite)]
    end
    subgraph Sources[上游平台]
        Netease[网易云音乐]
        QQ[QQ 音乐]
        Kuwo[酷我音乐]
        Joox[JOOX / 备用解析]
        Qishui[汽水音乐歌单页]
    end
    Browser --> Static
    Electron --> UI
    Static --> UI
    UI --> Audio
    UI --> Local
    UI --> Functions
    Functions --> D1
    Functions --> QQ
    Functions --> Kuwo
    Functions --> Qishui
    UI --> Netease
    UI --> Joox
    Functions --> Joox
```

这套拆分有三个直接收益：静态资源可以交给 Pages 的 CDN；需要密钥、签名或跨域处理的请求放在 Functions；播放器状态仍然留在浏览器，播放过程不需要把音频流经过自己的服务器。

## 二、前端：一个静态入口承载完整播放器

### 1. 用原生运行时状态控制交互

为了让部署和桌面端都足够轻，当前前端没有引入大型 UI 框架，页面结构、样式和运行时逻辑集中在 `index.html`、`styles.css` 与 `app.js`。运行时用一组简单状态描述当前会话：

```js
let tracks = []
let currentIndex = 0
let currentList = tracks
let isPlaying = false
let repeatOn = true
let liked = new Set(JSON.parse(localStorage.getItem("halo-liked-tracks") || "[]"))
const audio = new Audio()
```

搜索、播放器、歌词和队列都围绕这组状态重新渲染。歌曲行、专辑卡片和播放器按钮使用事件委托，点击歌曲时只更新索引、播放上下文和 `<audio>` 的状态，不会创建第二个播放器实例。

### 2. 多音源并行搜索，再统一排序和去重

不同平台的搜索接口响应格式并不一致。客户端先在各自的适配器中提取歌曲 ID、歌名、歌手、专辑、封面和时长，再转成统一对象。当前浏览器搜索会并行执行网易云、QQ 音乐和酷我音乐请求：

```js
const results = await Promise.allSettled([
  searchNetease(keyword, limit),
  searchQQ(keyword, limit),
  searchKuwo(keyword, limit),
])

const groups = results.map((item) =>
  item.status === "fulfilled" ? item.value : [],
)
return interleave(groups)
```

这里使用 `Promise.allSettled`，是因为一个音源临时不可用时，其他音源仍然应该显示。`interleave` 按平台交错结果，避免列表前半段全部来自同一个平台；`dedupeTracks` 再用平台 ID 和“歌名 + 歌手”的规范化键去重。规范化会去掉空格、连接号和括号等差异，减少同一首歌重复出现。

项目的服务端适配器还覆盖 QQ、酷我、JOOX 等需要代理或备用解析的场景，歌单导入则额外支持网易云、汽水音乐和 QQ 音乐公开链接。这样“搜索索引”和“播放地址解析”可以分别演进，不必让一个平台的接口变化拖垮所有功能。

### 3. 延迟加载歌曲详情，播放时才解析音频

搜索结果只保存可以展示列表的元数据，QQ 和酷我歌曲的真实播放地址在用户点击播放后才获取。`ensureTrackDetails` 会根据 `track.source` 选择适配器，并用 `loadingPromise` 合并同一首歌的并发请求：

```js
async function ensureTrackDetails(track) {
  if (track.detailsLoaded && track.audioUrl) return true
  if (track.loadingPromise) return track.loadingPromise

  track.loadingPromise = resolveBySource(track)
    .finally(() => { track.loadingPromise = null })
  return track.loadingPromise
}
```

拿到地址后才设置 `audio.src` 并调用 `audio.load()`。播放失败时不会把短时效地址永久写入收藏或歌单，而是允许刷新解析、重试候选地址或切换音源。网易云路径则通过兼容解析服务获取 URL 和歌词，QQ/酷我则优先经过 `/api/music`。

### 4. LRC 歌词和播放器时间轴共用一个时钟

歌词同步没有另起定时器，而是直接使用 `<audio>` 的 `timeupdate` 事件。LRC 解析器支持一行多个时间标签，也兼容 `mm:ss.xx` 与 `mm:ss:xxx` 形式：

```js
function parseLrc(text) {
  const lines = []
  for (const line of String(text || "").split(/\r?\n/)) {
    const tags = [...line.matchAll(/\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g)]
    const content = line.replace(/\[[^\]]+\]/g, "").trim()
    if (!content) continue
    for (const tag of tags) {
      const fraction = tag[3] ? Number(`0.${tag[3].padEnd(3, "0").slice(0, 3)}`) : 0
      lines.push({ time: Number(tag[1]) * 60 + Number(tag[2]) + fraction, text: content })
    }
  }
  return lines.sort((a, b) => a.time - b.time)
}
```

渲染歌词时从后往前找到最后一个 `line.time <= audio.currentTime` 的行，给它加上 `active` 状态；点击歌词行则直接把 `audio.currentTime` 设置为该行的时间戳。因此进度条、歌词高亮和当前播放歌曲天然保持一致。

### 5. 响应式布局不是简单缩小

桌面端是“搜索 / 播放器与歌词 / 播放列表”三栏工作区；移动端改成底部导航，在“搜索、歌词、我的”之间切换。布局使用 CSS Grid、媒体查询和独立滚动容器，歌词区和队列不会把页面整体撑出视口。主题、收藏和歌单等轻量数据放在 `localStorage`，即使未登录也能先完成搜索和本地整理。

## 三、HALO Track：隔离平台差异的核心数据结构

如果每个组件都直接读取某个平台的字段，后续添加音源会迅速变成条件分支地狱。因此项目约定了统一的 HALO Track：

```js
{
  uid: "qq-歌曲标识",
  source: "qq",              // netease / qq / kuwo / joox
  title: "歌曲名",
  artist: "歌手",
  album: "专辑",
  cover: "https://...",
  songid: "平台歌曲 ID",
  quality: "lossless",
  qualityLabel: "无损",
  pay: "",
  audioUrl: null,             // 运行时字段
  lrc: null                   // 运行时字段
}
```

展示层只关心 `title`、`artist`、`album`、`cover`、`source` 等稳定字段；适配器负责把平台响应翻译成这些字段；详情层再按 `source` 补齐 `audioUrl` 和歌词。`serializeTrack()` 会过滤短时效音频 URL、歌词和详情状态，只保存可以复用的标识与展示信息，避免把已经失效的资源写进 localStorage 或 D1。

## 四、后端：Pages Functions 作为音源适配与安全边界

### 1. 文件即路由的 API

Cloudflare Pages 会把 `functions/api/` 下的文件映射成 `/api/*`。主要接口分成三组：

| 接口 | 作用 |
| --- | --- |
| `GET /api/music` | 搜索、详情、音频解析、代理与缓存 |
| `POST /api/register`、`POST /api/login`、`POST /api/logout` | 账号和会话 |
| `GET/PUT /api/library` | 读取或覆盖当前用户的收藏和歌单 |
| `POST /api/import-playlist` | 服务端解析公开歌单并转换为 HALO Track |
| `GET /api/me` | 返回当前会话对应的用户名 |

`/api/music` 用 `action` 区分 `qq_search`、`kuwo_search`、`qq_detail`、`kuwo_detail`、`qq_audio` 和 `kuwo_audio`。服务端限制关键词长度、返回数量和上游请求时间，避免某个平台响应异常时占满整个 Function 请求。

### 2. 解析地址的缓存与验证

音频解析比搜索更容易遇到短时效 URL、失效候选和上游限流，所以项目采用“候选地址 + 可播放验证 + 缓存”的策略：

1. 根据歌曲 ID、音质和时长生成缓存键。
2. 先查 Worker 进程内的 LRU，再查 D1 的共享缓存。
3. 缓存未命中时尝试主接口和备用接口。
4. 对返回地址做 HTTP、歌曲 ID 和时长等基本校验。
5. 将验证过的候选信息写入缓存；播放失败时用 `refresh=1` 强制重新解析。

内存 LRU 最多保留约 500 项，搜索缓存默认约 45 秒，D1 作为跨请求、跨 Worker 实例的二级缓存。项目只缓存可复用的解析结果，不把音频文件搬到自己的存储中，也不把临时 URL 当成永久链接。

### 3. 公开歌单在服务端导入

公开歌单导入放在 `import-playlist.js`，原因是分享链接解析、分页和上游请求更适合在服务端完成。Function 会识别网易云、汽水音乐和 QQ 音乐的公开链接，必要时先解析官方短链接，再读取页面或接口中的歌曲信息，最后统一转换成 HALO Track。

导入过程设置了明确上限：QQ 歌单最多处理前 1,200 首，网易云最多 2,000 首，汽水音乐页面读取上限为 4 MB。限制请求规模既能保护上游，也能避免超过 Pages Functions 的执行时间。

## 五、D1 数据模型与“本地优先”同步

D1 是 SQLite 数据库，当前核心表如下：

| 表 | 用途 |
| --- | --- |
| `music_users` | 用户名、密码哈希和随机 salt |
| `music_sessions` | 会话 token、用户名和过期时间 |
| `music_libraries` | 用户收藏与自建歌单 JSON |
| `music_cache` | 音频和详情共享缓存 |
| `search_cache` | 短期搜索结果缓存 |

收藏和歌单采用“localStorage 先落地、D1 异步同步”：未登录时数据只属于当前浏览器；登录后页面再把库提交到 `/api/library`，弱网下仍能继续使用本地数据。云端库目前按 JSON 保存，优点是实现简单、适合个人项目；如果未来要做协作歌单、增量同步或操作审计，再拆成歌曲、歌单和关系表会更合适。

## 六、账号安全和 Electron 安全边界

账号密码不会以明文保存。服务端使用 Web Crypto 的 PBKDF2-SHA-256，100,000 次迭代和 16 字节随机 salt，只把哈希和 salt 写入 D1。登录后用随机 UUID 生成会话 token，放进 `HttpOnly; Secure; SameSite=Lax` Cookie，默认有效期 30 天。

桌面端的安全目标是“只做窗口壳，不把 Node 权限交给网页”：

```js
webPreferences: {
  preload: path.join(__dirname, "preload.cjs"),
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: true,
}
```

`preload.cjs` 只通过 `contextBridge` 暴露最小的平台信息，窗口打开外部链接时交给系统默认浏览器处理。Electron 主进程默认创建 1440×920、最小 960×640 的窗口，也支持通过 `HALO_MUSIC_URL` 或 `--url=` 参数切换到自己的 Pages 域名。

## 七、测试、开发与部署

本地开发需要 Node.js 20 LTS 或更高版本、npm 和 Wrangler 4：

```powershell
npm install
npx wrangler d1 execute halo-music-db --local --file schema.sql
npm run dev
```

项目使用 Node 原生 `node:test`，覆盖账号会话、收藏与歌单持久化、多个平台字段归一化、歌单链接识别、QQ 签名与分页、LRC 解析、音频容器识别、播放上下文切歌，以及浏览器端内联脚本语法检查：

```powershell
npm test
```

部署时只需要把 Pages 静态文件和 Functions 一起发布，并在 `wrangler.toml` 中绑定 D1：

```toml
name = "halo-music"
compatibility_date = "2025-01-01"
pages_build_output_dir = "."

[[d1_databases]]
binding = "DB"
database_name = "halo-music-db"
database_id = "替换为你的 D1 database_id"
```

桌面端复用已经部署的 Pages 地址，不需要再启动一个本地 HTTP 服务：

```powershell
npm run desktop:dev
npm run desktop:all
npm run desktop:portable
```

Windows 安装包和便携版会输出到 `release/`，应用 ID 是 `com.halomusic.desktop`。

## 八、做完之后得到的经验

这个项目最值得记录的不是某一个平台接口，而是几个可以复用的工程决策：

1. **先统一领域模型，再接入音源。** HALO Track 把平台差异挡在适配器里，播放器和歌单逻辑不需要知道上游字段叫什么。
2. **搜索和播放解析分离。** 搜索追求并行和容错，播放解析追求校验、缓存和重试，两者的性能目标不同。
3. **临时资源不要当数据库事实。** 音频 URL 会过期，应该保存歌曲 ID 和展示信息，播放时重新解析。
4. **本地优先能降低登录和网络依赖。** localStorage 让收藏和歌单在弱网下可用，D1 再负责登录用户的跨设备同步。
5. **桌面端优先复用 Web 版本。** Electron 只提供原生窗口和安全边界，业务逻辑、播放器和后端接口保持一套实现。

项目仍然有清晰的边界：上游接口和音频地址可能随时变化，Pages Functions 的执行时间会限制大批量导入，前端主入口也可以继续拆分成模块化组件。下一步更值得投入的方向，是更细粒度的歌单数据模型、增量同步、Playwright 视觉回归，以及对各音源适配器建立更稳定的契约测试。

如果你想了解具体实现，欢迎直接阅读 [halo_music 源码](https://github.com/zhoujungis/halo_music)。这个项目从一个“能搜歌和播放”的小工具开始，逐渐长成了一个包含 Web、Serverless、SQLite 缓存和桌面壳的完整练习场。
