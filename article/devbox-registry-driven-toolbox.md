---
title: "DevBox：把 42 个在线工具做成一个可维护的产品，而不是 42 个页面"
slug: devbox-registry-driven-toolbox
cover_image: /photos/devbox-registry-driven-toolbox-cover.png
date: 2026-11-26
tags: [Vue, TypeScript, 前端架构, 隐私, 项目实战]
---

> 适用读者：写过几个「小工具页面」，然后发现它们要么各写一套布局、要么三个月后没人敢加第 10 个功能的前端工程师；正在用 Vue 3 + Vite 做一个多入口、多路由站点，却不想让首页 bundle 越滚越大的人；以及任何被「在线工具站」这类项目低估过的人——42 个工具的集合，难点从来不是那 42 个算法。
> 结论先行：DevBox 是一个 Vue 3 + TypeScript + Vite 的浏览器端开发者工具箱，42 个工具、8 个分类、34 个 processor、31 份单元测试，全部在浏览器本地完成，零账号、零后端数据库。它真正解决的问题不是「怎么写 JSON 格式化」，而是四个工程边界：**新增工具必须靠填一张表，而不是改五处代码**——路由、搜索索引、分类页、收藏、最近使用、sitemap 全部从同一份 `ToolDefinition` 派生；**数据流向必须进类型系统**——`processing: 'local' | 'external' | 'mixed'` 不是一个徽章，是决定页面要不要警告你「这会把输入发给第三方」的唯一开关；**每一种输入都必须有上限**——正则要拦嵌套量词，源码分析要卡 100 万字符，CIDR 要拦前缀 33；**默认不上传**——只有 3 个工具会发外部请求，且页面必须明写目标域名。文章会给出注册表、懒加载、ReDoS 防护、RFC 6238 向量测试、AES 载荷格式、启发式评分器、CodeMirror 重配置与 CSP 的真实实现，也会把「HTTP Ping 不是 ICMP」「AI 检测不能证明作者」「CSP 被迫放开 connect-src」这些边界写清楚。
> 阅读时间：约 56 分钟 | 难度：进阶 | 收获：一套可以直接照抄的「工具注册表 + 懒加载 + 隐私分级」骨架 + 一份把不可信输入挡在 UI 之外的 processor 契约 + 一套把「不能证明」也写成测试的验证方法

**目录**

- 这不是"一堆在线工具"的合集
- 一份 ToolDefinition，定义整个产品的骨架
- 路由、搜索、sitemap 都从同一份注册表派生
- 一个工具一个目录，除了两个文件没有别的约定
- processor 契约：纯函数、返回结果、不向 UI 抛异常
- 隐私要写进类型：local / external / mixed
- 懒加载：首页不该加载 CodeMirror
- ReDoS：正则工具是唯一会被用户打穿的工具
- TOTP：拿 RFC 6238 的官方向量当测试
- AES-GCM：把 salt、iv、密文打成一个载荷
- JWT：解码不等于验签
- Base64 的三道校验
- CIDR：位运算、前缀边界与 /31
- DNS over HTTPS：浏览器里能做的和不能做的
- HTTP Ping：浏览器发不出 ICMP，那就别假装能
- AI 代码检测：一个诚实的启发式评分器
- 给"不能证明"写测试
- CodeMirror 6：三个 Compartment 和一次竞态
- 主题闪烁：在 bundle 之前就决定
- 搜索：焦点、aria 和 Tab 陷阱
- localStorage 会坏，所以每个读都要校验
- CSP：connect-src https: 是唯一的妥协
- SSG 与 PWA：两套缓存别打架
- 已知边界：一份诚实的清单
- 如果重写，我会先改这五件事
- 小结：工具站的复杂度在"第 43 个工具"

---

## 这不是"一堆在线工具"的合集

你在搜索引擎里搜"JSON 格式化"，会得到几十个结果。它们的第一个版本几乎都长一个样：一个 `<textarea>`，一个按钮，一段 `JSON.stringify(JSON.parse(x), null, 2)`。半小时能写完，也确实能用。

问题出在第二个工具开始。

你要加 Base64，于是复制一份 HTML，改掉标题和逻辑。你要加 JWT，于是复制第二份。等到第 10 个工具，你有了 10 份互相不认识的页面：10 套颜色、10 种按钮位置、10 处各自实现（或没实现）的错误提示、10 个只在某一个页面存在的复制按钮。搜索框没有，因为搜索需要一张"所有工具"的清单，而这张清单从来没有存在过。暗色模式没有，因为改 10 个文件才能加一个 class。移动端更别提——某个页面的两栏布局在 375px 宽下把输出框挤成了一条线。

这就是 DevBox 要绕开的陷阱：**工具站的复杂度不在工具，而在第 43 个工具**。前 3 个你靠体力能撑住，第 20 个开始，每加一个功能都在还技术债。

所以这个项目的第一个决定不是"用什么框架写 JSON 格式化"，而是"工具这个概念的边界在哪"。答案落在一个接口上：

```ts
export interface ToolDefinition {
  id: string
  name: string
  nameZh: string
  description: string
  category: string
  icon: string
  keywords: string[]
  path: string
  component: () => Promise<Component>
  featured?: boolean
  processing?: 'local' | 'external' | 'mixed'
}
```

十行。这十行决定了后面所有事情：一个工具之所以是工具，是因为它在注册表里有一条记录，而这条记录同时是它的路由、它的搜索索引、它的 SEO 元数据、它的收藏键、它的隐私声明。没有第二条真相源。

先把结论摆出来，后面逐条拆：

- **注册表即路由**：`routes` 数组不是手写的，是 `tools.map()` 出来的。加工具不改路由文件。
- **懒加载是类型强制的**：`component` 的类型是 `() => Promise<Component>`，写成立即 import 就编译不过。首页不可能意外打包 42 个工具。
- **隐私是枚举，不是文案**：`processing` 只有三个值，`ToolLayout` 只根据它决定显示绿灯还是黄灯。漏标就是漏警告，改不动。
- **输入上限是 processor 的职责**：UI 不做长度校验，`testRegex()` 自己拦。这样测试能直接覆盖"恶意输入"。
- **纯函数可测**：34 个 processor 里有 31 个配了 `.test.ts`，因为 processor 不碰 DOM、不碰 Vue、不碰 `this`。

下面从注册表开始。

## 一份 ToolDefinition，定义整个产品的骨架

打开 `src/data/tools.ts`，第一条记录是这样的：

```ts
{
  id: 'json-formatter',
  name: 'JSON Formatter',
  nameZh: 'JSON 格式化',
  description: '格式化、压缩和校验 JSON 数据',
  category: 'developer',
  icon: 'Braces',
  keywords: ['json', 'format', 'beautify', 'pretty', '格式化', '压缩', '校验'],
  path: '/tools/json-formatter',
  component: () => import('@/tools/json-formatter/JsonFormatter.vue'),
  featured: true
}
```

这 42 条记录加起来 16,595 字节，是整个项目里最"重"的文件：它被路由、搜索、首页、分类页、收藏页、sitemap 生成脚本同时读取。看起来是耦合，实际上是刻意的单点。

**为什么字段是这些。** 逐个看：

- `id` 是稳定键，用于收藏和最近使用的 localStorage。它必须永远不变——用户收藏的是 `jwt-decoder`，你改 slug 可以，改 id 就丢收藏。
- `path` 是 URL，和 `id` 分开是因为两者语义不同：`id` 是持久化键，`path` 是可改的对外地址。
- `name` 和 `nameZh` 并存，而不是做 i18n。这是一个取舍：42 个工具的中英文名都是专有名词（"JSON Formatter"/"JSON 格式化"），走 locale 文件只会让搜索需要合并两种语言的索引；直接双字段，`searchTools()` 一次 `includes` 就能同时命中。
- `keywords` 是搜索的补充弹药。用户搜"美化"要能找到 JSON 格式化，但 `nameZh` 里没有"美化"这两个字。所以关键词里塞了 `beautify`、`pretty`、`压缩`、`校验`。
- `icon` 是字符串，不是组件。这让注册表可以在 Node 环境里被 import（sitemap 脚本需要它），而不必拖进 Vue 运行时。
- `featured` 控制首页"热门工具"。16 条记录标了 `true`，首页只取前 6 个。
- `processing` 默认 `undefined`，按 `local` 处理。这是刻意的默认值方向：**忘记标注的后果是"少了一个警告"，而不是"多了个假警告"**——但反过来说，这也意味着标错方向的风险由开发者承担，所以只有 4 处显式标注（3 个 `external` + 1 个 `mixed`）。

注册表末尾导出了三个查询函数和一个搜索函数：

```ts
export function getToolById(id: string) {
  return tools.find(t => t.id === id)
}
export function getToolByPath(path: string) {
  return tools.find(t => t.path === path)
}
export function getToolsByCategory(cat: string) {
  return tools.filter(t => t.category === cat)
}
export function searchTools(query: string) {
  const q = query.toLowerCase().trim()
  if (!q) return tools
  return tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.nameZh.includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.keywords.some(k => k.toLowerCase().includes(q)) ||
    t.category.toLowerCase().includes(q)
  )
}
```

`getToolByPath` 是这里最值得注意的一个。它不是"再查一遍路由参数"，而是让 `ToolLayout` 能从当前 URL 反推出这是哪个工具——因为 `ToolLayout` 是一个布局组件，它拿不到路由的 props，只能拿到 `useRoute()`。用 `path` 反查 `id`，布局就能在不知道调用者是谁的情况下渲染面包屑、收藏按钮和隐私徽章。

**搜索的排序问题。** `searchTools` 没有排序，按注册表顺序返回。这是一个已知的粗糙点：输入 `json` 会依次命中 json-formatter、json-viewer、json-diff、csv-json（因为 csv-json 的 keywords 里有 json）。对一个本地过滤来说够用，但如果工具涨到 200 个，就得引入权重——名称完全匹配 > 名称前缀匹配 > 关键词 > 描述。这条写在"已知边界"里。

## 路由、搜索、sitemap 都从同一份注册表派生

这是整个架构最省事的一处。`src/router/index.ts` 只有 817 字节：

```ts
export const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/views/Home.vue'), meta: { title: 'DevBox · 程序员工具箱' } },
  { path: '/favorites', component: () => import('@/views/Favorites.vue'), meta: { title: '我的收藏 - DevBox' } },
  { path: '/category/:id', component: () => import('@/views/Category.vue'), meta: { title: '分类 - DevBox' } },
  { path: '/cheatsheet', component: () => import('@/views/Cheatsheet.vue'), meta: { title: '速查表 - DevBox' } },
  ...tools.map(t => ({
    path: t.path,
    component: t.component,
    meta: { title: `${t.nameZh} - ${t.name} | DevBox`, toolId: t.id }
  })),
  { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
]
```

`meta.toolId` 是给 `App.vue` 用的：它读 `route.meta.toolId`，从注册表里取回整条记录，然后把 `description` 和 `keywords` 喂给 `@unhead/vue` 的 `useHead()`。于是每个工具页的 `<title>`、`description`、`keywords`、OG 标签全部自动生成，不需要任何页面自己写 SEO。

对比一下没有注册表的世界：加一个工具要改 6 个地方——新建页面、加路由、加搜索清单、加分类页、加 sitemap、加 SEO。注册表把 6 处压成 1 处，代价是 `tools.ts` 会越来越长。这个交换在任何工具超过 10 个的项目里都划算。

**sitemap 也是派生的。** `scripts/generate-sitemap.mjs` 直接 import 注册表：

```js
import { tools } from '../src/data/tools.ts'
import { categories } from '../src/data/categories.ts'

const SITE_URL = process.env.SITE_URL
if (!SITE_URL) {
  console.error('Please set SITE_URL, e.g.: SITE_URL=https://your-domain.com npm run sitemap')
  process.exit(1)
}

const paths = [
  '/',
  '/favorites',
  '/cheatsheet',
  ...categories.map(c => `/category/${c.id}`),
  ...tools.map(t => t.path)
]
```

注意两个细节。第一，它 import 的是 `.ts` 文件——靠 Node 的类型擦除直接读 TypeScript 源码，不需要先编译。这就是为什么 `icon` 必须是字符串而不是组件：一个 `lucide-vue-next` 的图标组件在 Node 里 import 会炸。第二，`SITE_URL` 缺失时直接 `process.exit(1)`，而不是回退到一个占位域名。一个把 `localhost:5173` 写进 sitemap 然后提交给搜索引擎的项目，比没有 sitemap 更糟。

`vite.config.ts` 里还有第三处派生。SSG（`vite-ssg`）需要知道所有静态路由，而 `/category/:id` 是动态的：

```ts
const ssgOptions = {
  includedRoutes(_paths, routes) {
    return routes.flatMap(r => {
      if (r.path === '/category/:id') return categories.map(c => `/category/${c.id}`)
      if (r.path.includes(':pathMatch')) return []
      return r.path
    })
  }
}
```

两件事同时发生：动态分类路由被展开成 8 个真实路径，而 `:pathMatch(.*)*` 的 404 兜底被排除——否则 SSG 会试图给"任意路径"生成静态文件。

三处派生、一个数据源。这才是"注册表"的价值：不是少写代码，是**不可能出现不一致**。你删掉一个工具，sitemap 少一条、路由少一条、搜索少一条、分类页数字减一，四处同步，零人工。

## 一个工具一个目录，除了两个文件没有别的约定

`src/tools/` 下有 42 个目录，一个工具一个：

```text
src/tools/json-formatter/
├── JsonFormatter.vue      # UI：布局、输入输出、按钮
├── processor.ts           # 纯逻辑：格式化、校验、错误定位
└── processor.test.ts      # 单测：正常、空、非法、边界
```

只有三条约定，但每条都是有原因的。

**约定一：逻辑必须在 `processor.ts`。** 以 JSON 格式化为例，UI 只有 3,362 字节，逻辑 1,304 字节。为什么分开？因为逻辑要在 Vitest 里跑，而 Vitest 跑 Vue 组件需要 `happy-dom`、需要挂载、需要等待 nextTick；跑一个纯函数只要 `expect(formatJson(x)).toEqual(y)`。31 份 processor 测试加起来几十毫秒，这套反馈速度才让人愿意在改代码前先写测试。

**约定二：processor 导出的函数返回结果对象，不抛异常。** 看 `formatJson`：

```ts
export interface JsonFormatResult {
  formatted: string
  minified: string
  valid: boolean
  error?: string
  line?: number
  column?: number
}

export function formatJson(input: string, indent: number = 2): JsonFormatResult {
  if (!input.trim()) return { formatted: '', minified: '', valid: true }
  try {
    const parsed = JSON.parse(input)
    const formatted = JSON.stringify(parsed, null, indent)
    const minified = JSON.stringify(parsed)
    return { formatted, minified, valid: true }
  } catch (e: any) {
    const msg = e?.message || 'Unknown error'
    let line: number | undefined
    let col: number | undefined
    const posMatch = msg.match(/position (\d+)/)
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10)
      const before = input.slice(0, pos)
      line = before.split('\n').length
      col = before.split('\n').pop()!.length + 1
    }
    return { formatted: '', minified: '', valid: false, error: msg, line, column: col }
  }
}
```

这里有三个设计点值得说。

第一，**空输入是合法的**，`valid: true` + 空字符串。因为用户刚打开页面时输入框就是空的，此时显示一个红叉是骚扰。空输入不是错误，是"还没开始"。

第二，**行号列号是从 `position` 反推出来的**。V8 的 JSON 错误信息形如 `Unexpected token } in JSON at position 15`，只有字符偏移，没有人看的行列。`input.slice(0, pos)` 之后数换行得到行号，取最后一段长度加一得到列号。这是把机器信息翻译成人能用的定位。

第三，**`catch` 捕获所有东西，包括 `string`**。`catch (e: any)` 加 `e?.message || 'Unknown error'` 是因为 `JSON.parse` 理论上可以抛出非 Error（虽然实践中不会），而 `e.message` 在 `e` 是 `undefined` 时会二次崩溃。一次崩溃发生在错误处理器里，用户看到的就是白屏。

## processor 契约：纯函数、返回结果、不向 UI 抛异常

沿着上面的三条约定，可以抽出 processor 的完整契约。它没有写成文档，但 34 个文件都遵守：

| 约定 | 反面 | 为什么 |
| --- | --- | --- |
| 不访问 DOM | `document.createElement` | 否则测试要 DOM，Node 里跑不了 |
| 不访问 Vue | `useToast()`、`ref()` | 否则逻辑和框架绑死，换框架要重写 |
| 不读全局状态 | `localStorage`、`window.location` | 否则测试之间互相污染 |
| 输入做上限校验 | 直接 `new RegExp(input)` | 否则用户能打穿页面 |
| 返回结果对象 | `throw new Error(...)` | 否则 UI 每个调用点都要 try/catch |
| 不做格式化 | 在 processor 里拼中文提示 | 提示属于 UI，processor 只给 code |

最后一条值得展开。processor 返回的 `error` 是**技术信息**（`e.message`），而 UI 决定怎么呈现。`JsonFormatter.vue` 拿到 `line`/`column` 后渲染成"第 12 行，第 8 列"，再加一句"请检查附近的括号、引号或逗号"。同一条 `Unexpected token` 在命令行里应该原样打印，在网页上应该翻译成人话——这是两个职责。

有意思的是 `ai-code-detector` 违反了"不做格式化"这一条：它的 `signals` 里直接是中文（`'解释性注释偏多'`、`'模板化注释'`）。为什么它可以是例外？因为这个工具的产出本身就是一段解释性文本，"哪些信号命中了"是这个工具的核心输出，不是 UI 装饰。让 processor 直接给中文，比自己造一套 signal code 再在 UI 里映射一次更诚实——后者只会让两边都变难读。

**测试的写法也跟着契约走。** 看 `regex/processor.test.ts` 的全部内容：

```ts
describe('regex', () => {
  it('matches global', () => {
    const r = testRegex('a', 'g', 'aaa')
    expect(r.matches.length).toBe(3)
  })
  it('invalid', () => {
    const r = testRegex('[', 'g', 'test')
    expect(r.isValid).toBe(false)
  })
  it('limits input sizes', () => {
    expect(testRegex('a'.repeat(MAX_PATTERN_LENGTH + 1), 'g', 'x').isValid).toBe(false)
    expect(testRegex('a', 'g', 'x'.repeat(MAX_TEXT_LENGTH + 1)).isValid).toBe(false)
  })
  it('rejects common nested-quantifier backtracking patterns', () => {
    expect(testRegex('(a+)+$', '', 'a'.repeat(100)).isValid).toBe(false)
  })
})
```

`MAX_PATTERN_LENGTH` 和 `MAX_TEXT_LENGTH` 是从 processor 导出的常量，测试直接引用而不是硬编码 1000 和 200000。这样上限调整时测试同步，不会出现"测试过了但线上还是旧值"。

## 隐私要写进类型：local / external / mixed

绝大多数"在线工具站"的隐私说明是一段写在 About 页面的文字，和实际行为毫无关系。DevBox 选择了另一条路：把数据流向变成类型的一部分。

```ts
processing?: 'local' | 'external' | 'mixed'
```

只有 4 条记录标了值：

```ts
{ id: 'dns',          processing: 'external' }   // → Cloudflare DNS over HTTPS
{ id: 'ip-lookup',    processing: 'external' }   // → ipwho.is
{ id: 'ping',         processing: 'external' }   // → 目标地址本身
{ id: 'ai-code-detector', processing: 'mixed' }  // 本地分析；网页/GitHub 导入时访问外部
```

42 减 4，剩下 38 个的 `processing` 是 `undefined`，`ToolLayout` 里一行代码把它兜成 `local`：

```ts
const processingMode = computed(() => tool.value?.processing || 'local')
const usesExternalService = computed(() => processingMode.value === 'external')
const hasOptionalExternalService = computed(() => processingMode.value === 'mixed')
```

然后是徽章：

```html
<p class="text-xs ..." :class="usesExternalService || hasOptionalExternalService
     ? 'bg-amber-50 ... text-amber-700' : 'bg-green-50 ... text-green-700'">
  <span class="w-2 h-2 rounded-full" :class="usesExternalService || hasOptionalExternalService
        ? 'bg-amber-500' : 'bg-green-500 animate-pulse'"></span>
  {{ usesExternalService ? '包含外部请求 · 请注意隐私'
   : hasOptionalExternalService ? '默认本地 · 可选外部请求'
   : '本地处理 · 隐私优先' }}
</p>
```

三种状态对应三句话。这不是装饰：用户在处理一个真实 JWT 或一份客户数据库的 JSON 时，需要知道这一页会不会把内容发出去。

**页面底部的说明也是从同一份数据生成的**，而不是每个工具各写一段：

```html
<h3 class="font-semibold">关于 {{ tool.nameZh }}</h3>
<p>{{ tool.description }}。{{ usesExternalService
     ? '此工具会向第三方服务发送查询请求，请勿输入敏感信息，并以服务返回结果为准。'
     : hasOptionalExternalService
     ? '代码分析在浏览器本地完成；使用网页或 GitHub 导入时会访问对应外部服务，请勿输入敏感信息。'
     : '所有处理均在浏览器本地完成，不会上传到服务器，适合处理敏感数据。' }}</p>
```

42 个工具共用这三句话，意味着**说错了会立刻在 38 个页面上同时说错**。但这个风险方向是对的：宁可一处改错、一处能修，也不要 42 处各自漂移、无从审计。

**这套设计的真正约束在代码审查时。** 任何人给某个工具加一个 `fetch()`，只要没同时加上 `processing: 'external'`，页面就会继续显示绿灯"本地处理 · 隐私优先"。这是这个方案最大的漏洞——类型能表达意图，但表达不了"这个函数体里有没有网络调用"。如果工具涨到 100 个，正确做法是在 CI 里加一条 lint：`src/tools/*/{tool}.vue` 里出现 `fetch(` 或 `XMLHttpRequest` 而注册表没标 `external`/`mixed`，就报错。目前没有这条检查，它排在我的待办第一项。

## 懒加载：首页不该加载 CodeMirror

CodeMirror 6 不是一个轻依赖。它的 `basicSetup` 就拉进 `@codemirror/view`、`@codemirror/state`、`@codemirror/commands`、`@codemirror/language`、`@codemirror/autocomplete`、`@codemirror/lint`、`@codemirror/search` 一整串。8 个语言包（json / javascript / html / css / markdown / sql / yaml / xml）每一个都不小。如果首页把它们全打进来，首屏 JS 会翻几倍。

注册表从类型上就禁止了这件事：

```ts
component: () => Promise<Component>
```

写 `component: JsonFormatter`（立即 import）会类型报错，因为组件的类型是 `Component`，不是 `() => Promise<Component>`。写 `component: () => import(...)` 才合法。这不是代码规范文档里的一句"请使用懒加载"，是编译器强制。

于是首页只加载注册表（一个纯数据的 16KB 文件）和首页组件。用户点进 JSON 格式化，才加载 CodeMirror 和 json 语言包。

`vite.config.ts` 里再补一层手动分块：

```ts
build: {
  target: 'esnext',
  rollupOptions: isSsrBuild ? {} : {
    output: {
      manualChunks: {
        vendor: ['vue', 'vue-router', 'pinia'],
        codemirror: [
          '@codemirror/view',
          '@codemirror/state',
          '@codemirror/commands',
          '@codemirror/language'
        ]
      }
    }
  }
}
```

`isSsrBuild` 判断是必须的。SSG 构建时 Rollup 的 manualChunks 会干扰 `vite-ssg` 的预渲染输出，所以 SSR 那一轮直接给空对象。

**语言包是二次懒加载的。** 这个细节容易漏：即使组件的 chunk 已经按需加载，如果 `JsonFormatter.vue` 顶部写 `import { json } from '@codemirror/lang-json'`，json 语言包还是会被打进这个 chunk。所以 `CodeEditor.vue` 里的语言包是动态 import 的：

```ts
async function langExt(): Promise<Extension> {
  switch (props.language) {
    case 'json': return (await import('@codemirror/lang-json')).json()
    case 'javascript': return (await import('@codemirror/lang-javascript')).javascript()
    case 'html': return (await import('@codemirror/lang-html')).html()
    case 'css': return (await import('@codemirror/lang-css')).css()
    case 'markdown': return (await import('@codemirror/lang-markdown')).markdown()
    case 'sql': return (await import('@codemirror/lang-sql')).sql()
    case 'yaml': return (await import('@codemirror/lang-yaml')).yaml()
    case 'xml': return (await import('@codemirror/lang-xml')).xml()
    default: return []
  }
}
```

结果是：访问 JWT 解码页（纯文本框，不需要高亮）不会加载任何一个语言包；访问 JSON 页只加载 json；访问 SQL 格式化页只加载 sql。8 个语言包被打成 8 个独立 chunk，按需拉取。

这个设计有代价，下一节讲——它引入了竞态。

## ReDoS：正则工具是唯一会被用户打穿的工具

正则测试器是这类站点里最危险的页面。它把用户输入的正则直接编译执行，而正则引擎的回溯是**指数级**的。

```js
/(a+)+$/.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!')
```

上面这一行，在 `a` 的数量到了 30 左右就会让主线程卡死。到了 40，浏览器会问用户"页面无响应吗"。这就是 ReDoS（Regular expression Denial of Service）。对一个本地工具站来说，攻击者不需要服务器——他自己点开页面就能把自己的标签页锁死，然后给你一个一星差评。

`regex/processor.ts` 的第一道闸是长度上限：

```ts
export const MAX_PATTERN_LENGTH = 1000
export const MAX_TEXT_LENGTH = 200_000

if (!pattern) return { isValid: false, error: '请输入正则表达式', matches: [] }
if (pattern.length > MAX_PATTERN_LENGTH) {
  return { isValid: false, error: `正则表达式不能超过 ${MAX_PATTERN_LENGTH} 个字符`, matches: [] }
}
if (text.length > MAX_TEXT_LENGTH) {
  return { isValid: false, error: `测试文本不能超过 ${MAX_TEXT_LENGTH} 个字符`, matches: [] }
}
```

1000 字符的正则、20 万字符的文本。这个上限挡住的是"我拿一个 10MB 的日志来测正则"这类误用，但挡不住上面那个 30 个 `a` 的例子——因为 `(a+)+$` 只有 7 个字符。

真正的闸是第二道，一个嵌套量词的静态检测：

```ts
const NESTED_QUANTIFIER_PATTERN = /\([^)]*(?:[+*]|\{\d+,[^}]*\})[^)]*\)(?:[+*]|\{\d+,[^}]*\})/

if (NESTED_QUANTIFIER_PATTERN.test(pattern)) {
  return { isValid: false, error: '检测到可能造成大量回溯的嵌套量词，请简化表达式', matches: [] }
}
```

逐段读这个正则：`\(` 找左括号，`[^)]*` 吃掉括号内任意内容，`(?:[+*]|\{\d+,[^}]*\})` 要求括号内**至少有一个量词**（`+`、`*` 或无上界的 `{n,}`），`[^)]*` 再吃掉剩下的，`\)` 找右括号，最后再来一个量词。也就是"一个内含量词的分组，自己又被量词修饰"——`(a+)+`、`(\w*)*`、`(x{1,})+` 全部命中。

这是**启发式，不是完备检测**。它漏掉的情形至少有三种：分组嵌套两层以上（`((a+)+)+` 的第一层会命中，能拦住，但 `(a|aa)+` 这种交替回溯拦不住）；用字符类绕开（`([a-z]+)+` 能拦，`(?:a+)+` 用非捕获组也能拦，但 `(a|b)*c` 不一定危险却可能误报）；以及 `\1` 反向引用造成的回溯。它在"拦住最常见的一类"和"不误伤正常表达式"之间选了保守。

**为什么不开 Worker。** 一个显然的替代方案是把正则执行放进 Web Worker，超时就 terminate。这个方案更好，但成本是：每次按键都要发消息、序列化输入输出、维护 Worker 生命周期、处理 `Transferable` 之外的复制开销。对一个小工具来说，静态检测加长度上限已经挡住了 95% 的误伤，而 Worker 会让"实时高亮"变得不流畅。这条取舍写进了 README 的"已知限制"。

顺带说一个测试细节。`testRegex` 在全局模式下有个容易写错的地方：

```ts
if (flags.includes('g')) {
  let m: RegExpExecArray | null
  const re2 = new RegExp(pattern, flags)
  while ((m = re2.exec(text)) !== null) {
    matches.push({ match: m[0], index: m.index, groups: m.slice(1) })
    if (m[0].length === 0) re2.lastIndex++
    if (matches.length > 1000) break
  }
}
```

两处保护。`if (m[0].length === 0) re2.lastIndex++` 处理零宽匹配（`/x*/g` 在空字符串上会无限匹配空串，不推进 `lastIndex` 就是死循环）。`if (matches.length > 1000) break` 是第二道闸——即使正则本身不慢，20 万字符配上 `/a/g` 也能产生 20 万个匹配，渲染 20 万个高亮 span 一样会卡死。上限 1000 条，够用，且不会让 DOM 爆炸。

## TOTP：拿 RFC 6238 的官方向量当测试

TOTP 生成器是我在写这个项目时最想验证的一个：如果我实现的算法有 bug，用户拿到的是**错的验证码**，然后去怀疑自己的账号被盗了。这种 bug 的代价比"JSON 格式化缩进不对"高两个数量级。

所以它不靠"我点了两下看起来对"来验证，而是靠 RFC 6238 附录里的官方测试向量。

先看实现。TOTP 的输入是 Base32 编码的共享密钥，第一步是解码：

```ts
const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function base32Decode(input: string): Uint8Array {
  const clean = input.toUpperCase().replace(/[\s=-]/g, '')
  let bits = 0
  let value = 0
  const out: number[] = []
  for (const ch of clean) {
    const idx = B32_ALPHABET.indexOf(ch)
    if (idx === -1) throw new Error(`无效的 Base32 字符: ${ch}`)
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Uint8Array.from(out)
}
```

逐步走一遍。Base32 每个字符 5 bit，所以每读一个字符就把 `value` 左移 5 位、或上索引、`bits += 5`。一旦攒够 8 bit，就取出最高的那 8 位（`value >>> (bits - 8)`）、掩掉溢出部分、`bits -= 8`。注意 `value << 5` 在 JS 里是 32 位有符号运算，但因为我们每次取完就消耗掉高位，`value` 的有效位宽始终小于 8+5=13 位，永远不会溢出 32 位。这是个容易写出 bug 的地方——如果用 `Number` 累加再 `parseInt`，很长的密钥就会丢精度。

然后是核心：

```ts
export async function totpAt(
  secretB32: string,
  timestampMs: number,
  opts: { digits?: number; period?: number; algo?: TotpAlgo } = {}
): Promise<string> {
  const { digits = 6, period = 30, algo = 'SHA-1' } = opts
  const keyBytes = base32Decode(secretB32)
  const counter = Math.floor(timestampMs / 1000 / period)
  const buf = new ArrayBuffer(8)
  const view = new DataView(buf)
  view.setUint32(4, counter)
  const key = await crypto.subtle.importKey('raw', keyBytes as BufferSource, { name: 'HMAC', hash: algo }, false, ['sign'])
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, buf))
  const offset = sig[sig.length - 1] & 0x0f
  const code = ((sig[offset] & 0x7f) << 24) | (sig[offset + 1] << 16) | (sig[offset + 2] << 8) | sig[offset + 3]
  return (code % 10 ** digits).toString().padStart(digits, '0')
}
```

四个关键点：

**时间步长计数器是 8 字节大端**。`new DataView(buf)` 之后 `setUint32(4, counter)` 只写后 4 字节，前 4 字节留零。这是因为规范要求 8 字节计数器，而 32 位在 136 年后才溢出——写后 4 字节、前 4 字节默认零，就是正确的大端 64 位表示。

**动态截断（dynamic truncation）**。`sig[sig.length - 1] & 0x0f` 取最后字节的低 4 位作为偏移（0-15），然后从那里取 4 字节。这是 RFC 4226 规定的方式，目的就是让截断位置由签名本身决定。

**符号位必须掩掉**。`(sig[offset] & 0x7f)` 这一句不能少。HMAC 的输出是随机的，最高位有一半概率是 1；如果不掩掉，`<< 24` 之后得到一个负的 32 位数，再对 10 的 `digits` 次方取模，在负数上结果是负数，`toString()` 出来带减号，验证码就多了个 `-`。

**`crypto.subtle` 是异步的**。所以 `totpAt` 返回 `Promise<string>`，UI 每次 tick 都要 await。这不是可优化项——`crypto.subtle` 只提供异步 API，同步实现 HMAC-SHA1 就要自己写 SHA-1，那是两千行而且更可能错。

现在，怎么证明它对？用 RFC 6238 的向量。RFC 里那张表的测试密钥是 ASCII 的 `12345678901234567890`，转成 Base32 是 `GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ`，而 `GEZDGNBV` 正好解码成 `[0x31, 0x32, 0x33, 0x34, 0x35]`，也就是字符串 `"12345"`。测试把这个链条整个验证了一遍：

```ts
const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'

it('base32 decode', () => {
  expect(Array.from(base32Decode('GEZDGNBV'))).toEqual([0x31, 0x32, 0x33, 0x34, 0x35])
  expect(Array.from(base32Decode('gezd gnbv-'))).toEqual([0x31, 0x32, 0x33, 0x34, 0x35])
})
it('RFC 6238 SHA-1 vectors (8 digits)', async () => {
  expect(await totpAt(RFC_SECRET, 59 * 1000, { digits: 8 })).toBe('94287082')
  expect(await totpAt(RFC_SECRET, 1111111109 * 1000, { digits: 8 })).toBe('07081804')
  expect(await totpAt(RFC_SECRET, 1234567890 * 1000, { digits: 8 })).toBe('89005924')
})
it('6 digits default', async () => {
  const code = await totpAt(RFC_SECRET, 59 * 1000)
  expect(code).toMatch(/^\d{6}$/)
  expect(code).toBe('287082')
})
```

第二个 `base32Decode` 断言是我加的小心思：`'gezd gnbv-'` 是官方密钥的小写、带空格、带填充破折号的形态。真实用户从 Google Authenticator 里复制密钥时，经常是 `gezd gnbv gy3t qojq` 这种每 4 位一个空格的格式，甚至带尾部 `-`（有些服务用 `-` 做填充）。`replace(/[\s=-]/g, '')` 这一句必须吃掉它们，否则用户会看到"无效的 Base32 字符: "——错误信息里那个空格会让人完全不知道发生了什么。

`94287082` 和 `287082` 的关系也值得注意：8 位向量的后 6 位就是 6 位向量的结果。这是规范的必然——取模那一步在 `digits = 6` 时得到的就是后 6 位。测试同时断言两者，等于顺带验证了取模没写反。

**剩余秒数的计算也有个陷阱**：

```ts
export function remainingSeconds(timestampMs: number, period = 30): number {
  return period - Math.floor(timestampMs / 1000) % period
}
```

看起来应该返回 1 到 30。测试断言 `remainingSeconds(59 * 1000, 30)` 是 1（59 秒处在第二个 30 秒窗口的第 29 秒，还剩 1 秒），`remainingSeconds(60 * 1000, 30)` 是 30（刚好进入下一个窗口，倒数 30 秒）。这两个值都正确，但如果时间戳恰好在整 30 秒上，公式给出 30 而不是 0——这是对的，因为"还剩 30 秒"比"还剩 0 秒"更符合用户的直觉（环形进度条要满格）。

## AES-GCM：把 salt、iv、密文打成一个载荷

AES 工具的定位很明确：给一段文本、一个密码，得到一个能复制到微信里发给自己的密文。它不需要密钥管理、不需要用户系统，只需要"正确"。

正确的前提是每次加密都用新的 salt 和 iv，而且解密方要知道它们。所以输出不能只是密文，必须是一个自包含的载荷：

```ts
export async function encryptText(plaintext: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const ct = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    new TextEncoder().encode(plaintext)
  ))
  const payload = new Uint8Array(salt.length + iv.length + ct.length)
  payload.set(salt, 0)
  payload.set(iv, salt.length)
  payload.set(ct, salt.length + iv.length)
  return toBase64(payload)
}
```

载荷格式是 `salt(16) || iv(12) || ciphertext(...)`，整体做 Base64。三段拼接而不是包成 JSON，原因是：JSON 会膨胀 30% 以上，而且把二进制塞进 JSON 字符串还要再编码一次；直接拼字节，Base64 之后大约是原大小的 1.37 倍，一个短语加密完还是几十个字符，能直接发出去。

**为什么 iv 是 12 字节。** AES-GCM 的标准 nonce 长度就是 96 位。用 16 字节也能跑（GCM 内部会做 GHASH 派生），但那是给已有系统的兼容路径，不是推荐用法。12 字节是唯一不需要额外处理的长度。

**为什么 salt 是 16 字节、迭代 15 万次。** 密钥不是直接用密码，而是 `PBKDF2(password, salt, 150000, SHA-256) → AES-256-GCM`：

```ts
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 150000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}
```

15 万次迭代是现代浏览器里一个折中值：慢到让离线暴力破解的每次尝试付出约 100ms，快到让用户在点"加密"后等不到半秒。salt 的意义是让同一个密码在不同次加密里派生出不同密钥——否则同样的明文加同样的密码会得到同样的密文，攻击者一眼就能看出"这两条消息内容相同"。

还有两个参数值得解释。`importKey(..., false, ['deriveKey'])` 的第三个参数 `false` 表示密钥**不可导出**——即使页面被 XSS，`exportKey()` 也拿不到原始字节。`deriveKey(..., false, ['encrypt','decrypt'])` 同理。这是 Web Crypto 提供的一道防线，用了不亏。

解密侧：

```ts
export async function decryptText(payloadB64: string, password: string): Promise<string> {
  const payload = fromBase64(payloadB64.trim())
  if (payload.length < 29) throw new Error('payload too short')
  const salt = payload.slice(0, 16)
  const iv = payload.slice(16, 28)
  const ct = payload.slice(28)
  const key = await deriveKey(password, salt)
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, ct as BufferSource)
  return new TextDecoder().decode(pt)
}
```

**这里有一个我自己写下的边界，值得诚实标出来**：`if (payload.length < 29)` 这个检查偏松。AES-GCM 的密文包含 16 字节认证标签，所以合法载荷的最小长度其实是 `16 + 12 + 16 = 44`，不是 29。29 只能挡住"明显是垃圾"的输入，挡不住"44 字节以下但不是垃圾"的输入。它不会造成安全问题——`crypto.subtle.decrypt` 会对任何畸形输入抛错，而抛错被 UI 变成"解密失败，请检查密码或密文"——但它确实是一个"数字没算对"的小 bug。正确写法是 `< 44`。

密码错误的处理也值得说。AES-GCM 是认证加密（AEAD），密码错、载荷被改一个字节、或者 iv 被截断，`decrypt` 都会抛同一个 `OperationError`。这是设计使然：GCM 不告诉你"是密码错了还是数据被篡改了"，因为区分这两者本身就是信息泄露。所以 UI 只能显示一句模糊的话，这也正是它该显示的。

## JWT：解码不等于验签

JWT 解码器有一个 99% 的实现都会犯的错：把 Base64URL 解码出来的 JSON 显示给用户，然后让用户以为"这个 token 是有效的"。

不是。**解码只证明了它是合法 Base64URL 编码的 JSON，不证明任何签名。**

`jwt-decoder/processor.ts` 的解码部分很朴素：

```ts
function b64urlDecode(str: string): string {
  const pad = str.length % 4
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + (pad ? '='.repeat(4 - pad) : '')
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}
```

三个细节。第一，Base64URL 用 `-` 和 `_` 代替 `+` 和 `/`，必须换回来才能给 `atob`。第二，Base64URL 通常去掉尾部 `=` 填充，而 `atob` 要求长度是 4 的倍数，所以按 `str.length % 4` 补回来。第三，`new TextDecoder('utf-8', { fatal: true })` 里的 `fatal: true` 很关键——默认的 `TextDecoder` 遇到非法 UTF-8 会静默替换成 `�`，那样一个二进制垃圾会被"解码"成含替换字符的字符串，然后 `JSON.parse` 报一个莫名其妙的错。`fatal: true` 让它直接抛错，错误信息更接近真实原因。

然后 `decodeJwt` 把 `iat` 和 `exp` 翻译成人能读的时间：

```ts
const issuedAt = typeof payload.iat === 'number' && Number.isFinite(payload.iat)
  ? new Date(payload.iat * 1000).toLocaleString() : undefined
const expiration = typeof payload.exp === 'number' && Number.isFinite(payload.exp)
  ? new Date(payload.exp * 1000).toLocaleString() : undefined
```

`typeof === 'number'` 和 `Number.isFinite()` 两个检查都不能省。JWT 的 payload 是用户可控的 JSON，`exp` 可以是字符串 `"1234567890"`（很多手写 token 就是这样），可以是 `NaN`（JSON 里写不出来，但可以是 `null`），可以是 `1e400`（解析成 `Infinity`）。`new Date(Infinity * 1000)` 是 `Invalid Date`，`toLocaleString()` 会返回 `"Invalid Date"` 字符串——那会显示在页面上，看起来像程序崩了。

**真正有意思的是验签部分**，因为它同时解决了"能不能验证"和"怎么安全比较"两个问题：

```ts
const HS_ALGOS: Record<string, 'SHA-256' | 'SHA-384' | 'SHA-512'> = {
  HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512'
}

export async function verifyJwtHs(token: string, secret: string): Promise<{ verified: boolean; error?: string }> {
  const parts = token.trim().split('.')
  if (parts.length !== 3) return { verified: false, error: 'JWT 格式错误' }
  let header: any
  try { header = JSON.parse(b64urlDecode(parts[0])) } catch (e: any) { return { verified: false, error: e.message } }
  const algo = HS_ALGOS[header?.alg]
  if (!algo) return { verified: false, error: `不支持的算法: ${header?.alg}（此处仅支持 HS256/HS384/HS512 对称密钥验证）` }
  if (!secret) return { verified: false, error: '请输入密钥' }
  try {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: algo }, false, ['sign'])
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${parts[0]}.${parts[1]}`))
    const computed = b64urlEncode(new Uint8Array(sig))
    if (computed.length !== parts[2].length) return { verified: false }
    let diff = 0
    for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ parts[2].charCodeAt(i)
    return diff === 0 ? { verified: true } : { verified: false }
  } catch (e: any) {
    return { verified: false, error: e.message }
  }
}
```

**算法白名单，而不是黑名单。** `HS_ALGOS[header.alg]` 只认三个键。这挡住了著名的 `alg: "none"` 攻击（攻击者把 alg 改成 none、签名为空，某些库会直接跳过验证）以及 `alg` 混淆攻击（把 RS256 改成 HS256，用公钥当 HMAC 密钥）。这里的查表方式让任何未列出的 `alg` 立刻返回错误，包括 `none`。

**签名输入是 `header.payload`，不是整个 token。** `${parts[0]}.${parts[1]}` 这个拼接顺序很重要：JWT 的签名覆盖的是"头部点载荷"这串字节，不包含第三段。拼错方向（比如加上后缀点）会得到永远不匹配的结果。

**比较用异或累加，而不是 `===`。** 这是防时序攻击的经典写法：

```ts
let diff = 0
for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ parts[2].charCodeAt(i)
return diff === 0
```

`===` 在第一个不同字符处就返回，比较耗时会泄露"前 N 个字符匹配"的信息。理论上，一个能精确测量微秒级差异的攻击者可以一个字符一个字符地把签名试出来。`diff |=` 的写法保证**无论哪里不同、有几个不同，循环都跑满全程**，耗时恒定。

先比长度 `if (computed.length !== parts[2].length) return { verified: false }` 是一个补充保护：长度不同的字符串比较一定不等，提前返回既正确又能避免越界。

在浏览器里做时序攻击的现实难度极高（网络抖动远大于微秒差），但这个工具是给别人"学习 JWT 怎么验签"的地方。展示正确的写法比展示"能用但原理上有缺陷"的写法更有价值——读者会抄走它。

## Base64 的三道校验

Base64 看起来是最简单的工具：`btoa` / `atob`，一行一个。但 `atob` 有两个陷阱。

陷阱一：它只接受 Latin-1。`btoa('中文')` 直接抛 `InvalidCharacterError`，因为 `btoa` 的输入必须是每字符 0-255 的字符串。

陷阱二：它非常宽容。`atob` 会忽略非法字符、会接受错误的填充，甚至在有些实现里会解析出"看起来合理"的垃圾。

所以编码要先用 `TextEncoder` 转字节：

```ts
export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  bytes.forEach(byte => { binary += String.fromCharCode(byte) })
  return btoa(binary)
}
```

`TextEncoder` 把字符串转成 UTF-8 字节（中文一个字 3 字节，emoji 4 字节），然后逐字节塞进 Latin-1 字符串，再交给 `btoa`。这是浏览器里编码 Unicode 到 Base64 的标准路径。

解码要严得多，三道校验：

```ts
export function decodeBase64(input: string): { text: string; error?: string } {
  const s = input.trim().replace(/\s+/g, '')
  try {
    if (!s || s.length % 4 === 1 || !/^[A-Za-z0-9+/]*={0,2}$/.test(s)) throw new Error('Base64 格式错误')
    const bin = atob(s)
    const bytes = Uint8Array.from(bin, char => char.charCodeAt(0))
    return { text: new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
  } catch (e: any) { return { text: '', error: 'Base64 格式错误: ' + e.message } }
}
```

第一道：`s.length % 4 === 1`。Base64 用 4 个字符表示 3 个字节，所以长度模 4 只能是 0、2、3（1 是不可能的——3 个字符里剩下的 1 个字符不足 6 bit）。这个检查抓的是"少复制了几个字符"。

第二道：`/^[A-Za-z0-9+/]*={0,2}$/`。只允许标准字符集和最多两个尾部填充。这挡住了换行、空格、URL-safe 的 `-`/`_`（那是另一种编码，需要先转换）、以及中间出现的 `=`。

第三道：`new TextDecoder('utf-8', { fatal: true })`。**这一步最容易被漏掉**。一段合法的 Base64 完全可能解出非法的 UTF-8 字节——比如 `atob('//8=')` 得到两个 `0xFF`，那不是一个字符串。如果不用 `fatal: true`，你会得到 `"\uFFFD\uFFFD"`，用户复制走之后以为是自己的数据损坏了。用 `fatal: true`，直接报"Base64 格式错误"，用户知道是输入不对。

**为什么要把 `\s+` 全删掉。** 用户从邮件、终端、日志里复制的 Base64 经常带软换行（每 76 个字符一个 `\n`，这是 MIME 的规矩）。`replace(/\s+/g, '')` 让粘贴即用，是一个纯粹的体验改进，不影响正确性。

`isValidBase64` 是同一个逻辑的"只判断不返回数据"版本，给 UI 做实时合法性提示用。它和 `decodeBase64` 有重复，但刻意没抽公共函数——抽取会让两边都多一层间接，而这段逻辑只有 8 行且不会变。这是"三行重复好过一个过早的抽象"的具体例子。

## CIDR：位运算、前缀边界与 /31

CIDR 计算器看起来是个纯数学题，但它有三个真实的坑。

先看实现：

```ts
function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0) >>> 0
}
function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
}

export function calcCidr(input: string): CidrResult {
  const m = input.trim().match(/^(\d+\.\d+\.\d+\.\d+)\/(\d{1,2})$/)
  if (!m) return { valid: false, error: '格式应为 192.168.1.0/24' }
  const ip = m[1], prefix = parseInt(m[2], 10)
  if (prefix < 0 || prefix > 32) return { valid: false, error: '前缀长度 0-32' }
  const octs = ip.split('.').map(Number)
  if (octs.some(o => o < 0 || o > 255 || isNaN(o))) return { valid: false, error: 'IP 非法' }
  const ipInt = ipToInt(ip)
  const maskInt = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0
  const networkInt = ipInt & maskInt
  const broadcastInt = networkInt | (~maskInt >>> 0)
  const total = Math.pow(2, 32 - prefix)
  const usable = prefix >= 31 ? total : total - 2
  return {
    valid: true,
    network: intToIp(networkInt),
    broadcast: intToIp(broadcastInt),
    first: total > 2 ? intToIp(networkInt + 1) : intToIp(networkInt),
    last: total > 2 ? intToIp(broadcastInt - 1) : intToIp(broadcastInt),
    total, usable, mask: intToIp(maskInt), cidr: `${intToIp(networkInt)}/${prefix}`
  }
}
```

**坑一：`>>> 0` 不能省。** JS 的位运算是 32 位**有符号**。`192.168.1.1` 转成整数是 `0xC0A80101`，最高位是 1，所以在 JS 里它是**负数** `-1062731519`。不 `>>> 0` 转成无符号，`& maskInt` 和 `| ~maskInt` 的结果会带上符号位，`intToIp` 里 `>>>` 虽然能救回来，但中间的 `networkInt + 1` 之类运算会在负数上出错。这一行是这类计算器最常见的 bug 源。

**坑二：`prefix === 0` 是特例。** `0xFFFFFFFF << 32` 在 JS 里不是"全零"，而是 `<< 0`——移位量对 32 取模。所以 `/0` 掩码会变成全 1，`/0` 的"网络地址"会变成 `255.255.255.255`。必须显式特判。

**坑三：`/31` 和 `/32` 没有网络地址和广播地址。** 传统教材说"每个网段减 2 是可用地址"，那是 `/24` 及以下的规矩。`/31` 是点对点链路（RFC 3021），两个地址都可用，`/32` 是单主机路由，一个地址可用。所以：

```ts
const usable = prefix >= 31 ? total : total - 2
```

以及"第一个/最后一个可用地址"也要跟着变：

```ts
first: total > 2 ? intToIp(networkInt + 1) : intToIp(networkInt),
last: total > 2 ? intToIp(broadcastInt - 1) : intToIp(broadcastInt),
```

不处理这两个特例的计算器，输入 `10.0.0.0/31` 会告诉你"可用地址 -1 个"或"0 个"。这在配 VPN 点对点链路时会让人怀疑人生。

**测试只覆盖了一个用例**。`cidr/processor.test.ts` 一共 294 字节，全部内容就是：

```ts
describe('cidr', () => {
  it('calc /24', () => {
    const r = calcCidr('192.168.1.0/24')
    expect(r.valid).toBe(true)
    expect(r.network).toBe('192.168.1.0')
    expect(r.broadcast).toBe('192.168.1.255')
  })
})
```

它验证了最普通的一条路径，而上面那三个坑一个都没碰到：`/0`、`/31`、`/32`、`0.0.0.0/0`、`255.255.255.255/32` 全都没有测试。这是整个项目测试覆盖最薄的地方，那三段特判代码是我读代码时发现的，不是测试发现的。这一点后面在"已知边界"里点名。

## DNS over HTTPS：浏览器里能做的和不能做的

浏览器里查询 DNS，唯一可行的路是 DNS over HTTPS。它把 DNS 查询包成 HTTPS 请求发给一个支持 DoH 的解析器。Cloudflare 的端点接受 JSON 格式：

```ts
export async function queryDns(
  domainInput: string,
  recordType: DnsRecordType,
  signal?: AbortSignal
): Promise<DnsResult> {
  const domain = normalizeDomain(domainInput)
  if (!isValidDomain(domain)) return { valid: false, error: '请输入有效的域名，例如 example.com', answers: [] }
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${TYPE_CODES[recordType]}`
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/dns-json' },
      signal,
      cache: 'no-store'
    })
    if (!response.ok) return { valid: false, error: `DNS 服务返回 HTTP ${response.status}`, answers: [] }
    const data = await response.json() as { Status?: number; Answer?: DnsAnswer[]; Authority?: DnsAnswer[] }
    return {
      valid: true,
      status: data.Status,
      answers: data.Answer || data.Authority || [],
      canonicalName: data.Answer?.find(a => a.type === TYPE_CODES.CNAME)?.data,
      queriedAt: Date.now()
    }
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'DNS 查询失败', answers: [] }
  }
}
```

四个细节：

`accept: 'application/dns-json'` 是这个端点返回 JSON 而不是二进制 DNS 报文的开关。不带这个头，你会得到一个 `application/dns-message` 的二进制流，需要自己解析 DNS 协议——那是另一篇文章。

`signal` 透传是必须的。DNS 查询可能挂起很久，用户切走页面或者改了输入，旧请求应该被 `AbortController` 取消。UI 侧的做法是每次查询前 abort 上一个，只保留最新一次。

`data.Answer || data.Authority` 处理 NXDOMAIN 和"No Answer"两种情况。很多域名查 `MX` 时 `Answer` 是空的，真实信息在 `Authority` 段的 SOA 记录里（说明"这个域名存在但没有 MX"）。只读 `Answer` 会显示"没有结果"，让用户以为查询失败了。

`cache: 'no-store'` 是因为"我刚改了 DNS 记录，现在查一下生效了没"是高频场景。让浏览器缓存 5 分钟会让人怀疑工具坏了。

**域名校验是这里最值得看的部分**：

```ts
export function normalizeDomain(input: string): string {
  return input.trim().replace(/^https?:\/\//i, '').split('/')[0].split('?')[0].replace(/\.$/, '')
}

export function isValidDomain(input: string): boolean {
  const domain = normalizeDomain(input)
  return domain.length > 0 && domain.length <= 253 &&
    !domain.includes('..') &&
    domain.split('.').every(label =>
      label.length > 0 && label.length <= 63 &&
      /^[a-z0-9-]+$/i.test(label) &&
      !label.startsWith('-') && !label.endsWith('-'))
}
```

`normalizeDomain` 让用户可以直接粘一个 URL（`https://example.com/path?x=1`），剥掉协议、路径、查询串和尾部点。尾部点（`example.com.`）是 DNS 里的"完全限定域名"写法，技术上合法但不该发给 DoH。

`isValidDomain` 的四条规则来自 DNS 规范：总长不超过 253，每个标签不超过 63，标签只能含字母数字和连字符，标签不能以连字符开头或结尾。**这个校验的真正目的是防止把任意垃圾塞进 `encodeURIComponent`**——虽然 `encodeURIComponent` 已经防了注入，但一个 5000 字符的"域名"发出去也是浪费。

**必须诚实的一条**：这个工具的 `processing` 标的是 `external`，因为域名会发给 Cloudflare。页面底部明写"此工具会向第三方服务发送查询请求，请勿输入敏感信息"。你不应该用这个工具查公司内网域名——那个查询会记录在 Cloudflare 的日志里。这条警告不是法律免责，是技术事实。

## HTTP Ping：浏览器发不出 ICMP，那就别假装能

这个功能的名字在 UI 上叫"Ping 延迟检测"，但代码里它发的是 HTTP `HEAD`：

```ts
export async function pingHttp(
  input: string,
  count = 4,
  timeoutMs = 8000,
  onSample?: (sample: PingSample) => void
): Promise<{ url?: string; samples: PingSample[]; error?: string }> {
  const url = normalizeHttpUrl(input)
  if (!url) return { samples: [], error: '请输入有效的 HTTP 或 HTTPS 地址' }
  const samples: PingSample[] = []
  for (let i = 0; i < count; i++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const started = performance.now()
    try {
      const response = await fetch(url, {
        method: 'HEAD', mode: 'no-cors', cache: 'no-store',
        credentials: 'omit', signal: controller.signal
      })
      const sample = {
        ok: true,
        ms: Math.round(performance.now() - started),
        status: response.type === 'opaque' ? undefined : response.status
      }
      samples.push(sample)
      onSample?.(sample)
    } catch (error) {
      const sample = {
        ok: false,
        ms: Math.round(performance.now() - started),
        error: error instanceof Error && error.name === 'AbortError' ? '请求超时' : '请求失败'
      }
      samples.push(sample)
      onSample?.(sample)
    } finally {
      clearTimeout(timer)
    }
  }
  return { url, samples }
}
```

**为什么是 HEAD 而不是 GET。** HEAD 只请求响应头，不下载体。测延迟不需要内容，而且对一个 100MB 的视频文件发 GET 是一种暴力。

**为什么是 `mode: 'no-cors'`。** 跨域请求默认会被 CORS 拦住。`no-cors` 让请求能发出去，但响应变成"不透明"（opaque）——你拿不到状态码和响应体，只能拿到"成功了"。测延迟只需要时间戳，不需要状态码，所以这个交换是合适的。

**为什么要处理 `response.type === 'opaque'`。** 这就是上面那个代价：不透明响应的 `status` 永远是 `0`。如果不判断，页面会显示"状态 0"，看起来很吓人。判断之后显示"成功"但不显示具体状态码，是诚实的。

**为什么 `credentials: 'omit'`。** 不带 cookie。一个测延迟的请求没有理由携带用户的登录态，尤其它可能是发往一个用户随手输入的第三方地址。

**为什么 `setTimeout` + `AbortController`，而不是 `AbortSignal.timeout()`。** `AbortSignal.timeout(ms)` 更简洁，但它抛出的错误 `name` 是 `TimeoutError`，而 `controller.abort()` 抛的是 `AbortError`。两者都能区分，但前者在旧版 Safari 上支持不全。手动定时器兼容性更好，代价是 `finally` 里必须 `clearTimeout`——漏了就是内存泄漏加上一个可能在页面卸载后还在跑的定时器。

**这个工具有一个"诚实的设计"：`icmp` 是一个独立的工具页，内容主要是解释为什么做不到。** 它的 description 直接写"了解 ICMP Ping 的浏览器限制，并获取本地命令示例"。页面里给 Windows / macOS 的命令行示例，让用户去本地跑。有两种做假的方式：把 HTTP 延迟标成"ICMP 延迟"（数据是错的），或者干脆不提供这个功能（用户不知道原因）。DevBox 选了第三种：提供功能、标清它是什么、并解释为什么不能是那个。

## AI 代码检测：一个诚实的启发式评分器

这个工具是整个项目里最容易变成骗局的一个。"检测代码是不是 AI 写的"听起来像一个能用机器学习解决的问题，实际上任何号称准确的检测器都在夸大。

所以它的做法是：不假装准确，而是把**判断依据摊开给你看**。

评分器从一个基准分开始，然后按命中的信号加减：

```ts
let score = 18
const signals: DetectionSignal[] = []

if (commentRatio >= 0.35 && punctuationComments >= 2) {
  score += 18
  signals.push({ label: '解释性注释偏多', detail: `注释占非空行 ${Math.round(commentRatio * 100)}%，且多为完整句子`, impact: 'positive' })
} else if (commentRatio >= 0.2) {
  score += 7
  signals.push({ label: '包含较多注释', detail: `注释占非空行 ${Math.round(commentRatio * 100)}%`, impact: 'positive' })
}
```

先看两个条件为什么是 AND。`commentRatio >= 0.35` 是"注释占比超三成"，`punctuationComments >= 2` 是"至少两行注释以句号、感叹号、问号结尾"。单个条件都会误伤：一个 SDK 示例文件可能注释很多但都是 `// init` 这种短语；一段代码可能只有两句注释但每句都是完整的话。两个同时成立，才接近"AI 写的解释性注释"这个特征——因为模型倾向于写完整句子（"Initialize an empty map for grouped values."），而人类倾向于写短语（"init map"）。

接着是模板化注释和回答式文本：

```ts
const GENERIC_COMMENT_PATTERN = /\b(?:todo|fixme|generated|auto-generated|implementation|initialize|returns?|parameters?|根据|实现|初始化|返回|参数)\b/i
const AI_BOILERPLATE_PATTERN = /\b(?:here(?:'|’s)|note that|please note|as an ai|certainly|in conclusion|overall)\b|下面是|以下代码|希望这能帮助/i

const genericComments = lines.filter(line => COMMENT_PATTERN.test(line) && GENERIC_COMMENT_PATTERN.test(line)).length
if (genericComments >= 2) {
  score += Math.min(16, genericComments * 4)
  signals.push({ label: '模板化注释', detail: `发现 ${genericComments} 行常见说明式注释`, impact: 'positive' })
}

const boilerplateMatches = code.match(AI_BOILERPLATE_PATTERN) || []
if (boilerplateMatches.length) {
  score += Math.min(15, boilerplateMatches.length * 5)
  signals.push({ label: '回答式文本混入代码', detail: '发现类似解释、总结或对话式措辞', impact: 'positive' })
}
```

`AI_BOILERPLATE_PATTERN` 里最值钱的是 `as an ai`、`certainly`、`here's`、`note that` 这几个：它们是模型在"回答"而不是"写代码"时才会用的措辞。一段代码里出现 `// Here's the implementation:` 几乎必然是复制粘贴的产物——不管来源是不是 AI，都说明这段注释不是给维护者写的。

**`Math.min` 的上限很重要**。没有上限，一段含 20 个 TODO 的代码会加 80 分，直接冲顶。有了上限，任何一个信号最多贡献 18 分，总分的可解释性就保住了——你可以指着评分说"这 18 分来自注释比例，这 12 分来自行长度规律"，而不是"不知道，模型说的"。

然后是行为特征：

```ts
const lineLengthVariance = lengths.length > 1
  ? lengths.reduce((sum, length) => sum + Math.abs(length - averageLineLength), 0) / lengths.length
  : 0

if (lengths.length >= 8 && lineLengthVariance <= 8) {
  score += 12
  signals.push({ label: '行长度规律性较高', detail: '非空代码行长度变化较小，呈现较强格式规律', impact: 'positive' })
}
```

这是"平均绝对偏差"而非标准差的简化版。选它的原因是：标准差会被单个超长行（比如一行 300 字符的 URL）拉爆，而平均绝对偏差对离群点更鲁棒。阈值 8 意味着"每行长度平均偏离均值不到 8 个字符"——人类手写的代码很少这么整齐，因为人会写一行长表达式、然后写一行 `}`。

重复行检测抓的是"批量生成"的味道：

```ts
const repeatedLines = new Set<string>()
const lineCounts = new Map<string, number>()
nonBlank.forEach(line => {
  const normalized = line.trim().replace(/\s+/g, ' ')
  lineCounts.set(normalized, (lineCounts.get(normalized) || 0) + 1)
})
lineCounts.forEach((count, line) => {
  if (count >= 3 && line.length > 12) repeatedLines.add(line)
})
if (repeatedLines.size >= 2) {
  score += 8
  signals.push({ label: '重复模板片段', detail: `发现 ${repeatedLines.size} 组重复行，可能来自批量生成或复制模板`, impact: 'positive' })
}
```

`normalized` 把行内连续空白压成一个空格，所以缩进不同但内容相同的两行会被认成重复。`count >= 3` 要求同一行出现三次以上——两次太常见（真的有两处需要同样的初始化）。`line.length > 12` 排除了 `}`、`);`、`return;` 这些必然重复的行。

**负向信号才是这个评分器诚实的地方**：

```ts
if (todoCount > 0) {
  score -= 8
  signals.push({ label: '保留 TODO/FIXME', detail: `发现 ${todoCount} 个待办标记，更接近持续迭代中的代码`, impact: 'negative' })
}

if (commentRatio === 0 && functionCount > 0) {
  score -= 5
  signals.push({ label: '没有注释', detail: '样本中未发现注释；这不是人工编写的证明', impact: 'negative' })
}
```

`TODO` 减分是因为：模型生成的代码倾向于"完成态"——它不会给你留 `// TODO: handle the edge case`，因为它在回答一个已经问完的问题。人在实际写代码时会留 TODO。这是一个弱信号，但方向是对的。

第二句 detail 里那句"这不是人工编写的证明"是刻意写的。它防止用户把"没有注释 = 人工"当成结论。

最后是分级和一个中性的兜底信号：

```ts
score = Math.max(0, Math.min(100, Math.round(score)))
const level: AiDetectionResult['level'] = score >= 65 ? 'high' : score >= 38 ? 'medium' : 'low'
const label = level === 'high' ? 'AI 风格倾向较高' : level === 'medium' ? '存在部分 AI 风格特征' : 'AI 风格倾向较低'
signals.push({ label: '仅供参考', detail: '风格特征会受到格式化工具、团队规范和个人习惯影响', impact: 'neutral' })
```

注意 label 用词：**"AI 风格倾向"而不是"AI 生成"**。这是整个工具有没有诚信的分界。倾向是一个描述，生成是一个断言。前者可以从代码风格推出来，后者不能。

模型来源标记那段是同类里最容易变成谣言的地方：

```ts
const modelMarkers = [
  { name: 'ChatGPT / OpenAI', pattern: /chatgpt|openai|gpt-[234o]/i },
  { name: 'GitHub Copilot', pattern: /github\s+copilot|copilot/i },
  { name: 'Claude / Anthropic', pattern: /claude|anthropic/i },
  { name: 'Gemini / Google AI', pattern: /google\s+gemini|gemini/i },
  { name: 'Cursor', pattern: /cursor\s+(?:ai|editor)|generated\s+by\s+cursor/i },
  { name: 'Codeium / Windsurf', pattern: /codeium|windsurf/i }
]
const modelMarker = modelMarkers.find(marker => marker.pattern.test(code))
const modelHint = modelMarker
  ? `发现"${modelMarker.name}"相关文字，仅代表源码中有来源标记，不能证明由该工具生成`
  : '未发现可验证的模型来源标记，无法判断具体是哪一个 AI'
```

`cursor` 的正则要求 `cursor ai`、`cursor editor` 或 `generated by cursor`，而不是裸的 `cursor`。原因很实际：`cursor` 是数据库编程里的通用词（`db.cursor()`），裸匹配会在任何访问数据库的代码里命中。

`modelHint` 的措辞是重点。"发现了 Claude 字样"和"由 Claude 生成"之间隔着一个巨大的鸿沟——那个字样可能是：
- 真的模型署名（`// Generated by Claude`）
- 一个叫 Claude 的同事
- 一个 Claude 相关的项目名
- 用户自己在测试这个检测器（就像上面的测试用例那样）

所以 `modelHint` 明确写"仅代表源码中有来源标记，不能证明由该工具生成"。这不是免责声明，这是事实陈述。

## 给"不能证明"写测试

上面那套设计的最大风险是：后来的人（包括三个月后的我）会觉得这些限定词太啰嗦，然后删掉。

所以限定词被写成了测试断言。这是这个项目里我最满意的一个实践：

```ts
it('does not treat TODO markers as proof of human authorship', () => {
  const result = analyzeCode('function run() {\n  // TODO: replace this later\n  return 1\n}\n')
  expect(result.valid).toBe(true)
  expect(result.metrics.todoCount).toBe(1)
  expect(result.signals.some(signal => signal.label === '保留 TODO/FIXME')).toBe(true)
})

it('only reports model names as unverified source markers', () => {
  const result = analyzeCode('// Generated by Claude\nexport function add(a: number, b: number) { return a + b }')
  expect(result.modelHint).toContain('Claude')
  expect(result.modelHint).toContain('不能证明')
})
```

第二个测试的 `expect(result.modelHint).toContain('不能证明')` 是全项目最好的一条断言。它把"必须保留这句免责"变成了 CI 的一部分。任何人把 `modelHint` 改成 `已检测到 Claude 生成`，这个测试立刻挂。

第一个测试同样有价值，但它断言的是两件不同的事：
- `metrics.todoCount === 1`：检测到 TODO 计数正确
- `signals.some(s => s.label === '保留 TODO/FIXME')`：TODO 被算作**负向**信号

第二句是重点。如果哪天有人觉得"TODO 说明是人工写的，应该加信任分"，于是把 `score -= 8` 改成 `score += 8`，这个测试会照样通过（因为它只检查信号存在）。所以这条测试保护的是"存在性"不是"方向性"。更严格的写法应该同时断言 `impact === 'negative'` 和 `score < 18`（低于基准分）。这是这个测试的不足，也是我在"如果重写"里列的改进项。

再看样本过短的处理，它有两层：

```ts
const sampleNote = codeLines >= 40
  ? '样本达到 40 行以上，更适合观察代码风格；仍不代表作者身份结论。'
  : `当前只有 ${codeLines} 行代码，样本偏短，结果可靠性有限；建议结合更完整的提交记录。`
```

以及更早的一道硬门：

```ts
if (code.trim().length < 20) {
  return {
    valid: false,
    error: '请至少输入 20 个字符的代码，再进行分析',
    score: 0,
    level: 'low',
    label: '代码太短',
    caveat: '样本过短时，任何风格判断都没有统计意义。',
    modelHint,
    sampleNote,
    metrics,
    signals: []
  }
}
```

20 个字符和 40 行是两个不同的门槛，对应两个不同的含义：20 字符以下根本不做判断（直接 `valid: false`），40 行以下做判断但明确降级提示。这个分层是有意的——用户输入 `const x = 1` 时，得到的不该是"AI 倾向低"这个结论，而是"太短了，不分析"。

测试同时覆盖了两层：

```ts
it('rejects samples that are too short to analyze', () => {
  const result = analyzeCode('const x = 1')
  expect(result.valid).toBe(false)
  expect(result.error).toContain('20')
})
it('returns an explainable result for a code sample', () => {
  const result = analyzeCode(sampleCode())
  expect(result.valid).toBe(true)
  expect(result.score).toBeGreaterThanOrEqual(0)
  expect(result.score).toBeLessThanOrEqual(100)
  expect(result.metrics.codeLines).toBeGreaterThan(0)
  expect(result.signals.length).toBeGreaterThan(0)
  expect(result.sampleNote).toContain('当前只有')
})
```

最后一条 `expect(result.sampleNote).toContain('当前只有')` 很有意思：它断言的是"这个样本被判定为短样本"。`sampleCode()` 返回的是一段约 10 行的 `groupBy` 函数，确实不到 40 行。如果哪天有人把阈值从 40 改成 5，这个测试会挂——提醒他"你改了语义，去看看提示文案对不对"。

还有一个上限测试：

```ts
it('rejects oversized sources before scoring', () => {
  const result = analyzeCode('x'.repeat(MAX_SOURCE_LENGTH + 1))
  expect(result.valid).toBe(false)
  expect(result.error).toContain('不能超过')
})
```

`MAX_SOURCE_LENGTH = 1_000_000`。这个数字的选择理由：GitHub 单文件上限是 100MB，但源码里没有 1MB 以上的单个文件（会自动生成的文件除外，而那些也不该做风格分析）。1MB 的字符串在浏览器里做正则扫描大约几十毫秒，可接受；10MB 就会卡顿。

## CodeMirror 6：三个 Compartment 和一次竞态

编辑器是整个项目里唯一"重量级"的组件。3,834 字节的 `CodeEditor.vue` 封装了 CodeMirror 6，对外只暴露一个 `v-model` 和几个 props。

CodeMirror 6 的架构是"状态 + 扩展"，扩展一旦创建就不可变，要改只能重新配置。`Compartment` 就是为这个设计的：它把一组扩展包成一个可替换的槽位。

```ts
let languageCompartment: Compartment
let themeCompartment: Compartment
let readonlyCompartment: Compartment
```

三个槽位，对应三种运行时会变的东西：语言（用户切换工具页）、主题（用户在暗色/亮色间切换）、只读（输出框 vs 输入框）。

创建时把当前值装进槽位：

```ts
const extensions: Extension[] = [
  basicSetup,
  languageCompartment.of(language),
  updateListener,
  EditorView.lineWrapping,
  themeCompartment.of(themeExt()),
  readonlyCompartment.of(EditorState.readOnly.of(props.readonly)),
]
if (props.placeholder) extensions.push(cmPlaceholder(props.placeholder))
const state = EditorState.create({ doc: props.modelValue, extensions })
view = new EditorView({ state, parent: editorRef.value })
```

`EditorView.lineWrapping` 不在任何 Compartment 里，因为它永远不变——软换行是这类工具的唯一正确选择（横向滚动在输出框里几乎无法阅读）。

主题跟着 `document.documentElement` 的 `dark` class 走，用 `MutationObserver` 监听：

```ts
mo = new MutationObserver(() => {
  if (view) view.dispatch({ effects: themeCompartment.reconfigure(themeExt()) })
})
mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
```

`attributeFilter: ['class']` 是性能细节。不加它，观察器会对该元素的**所有**属性变化回调——包括 `style`、`data-*`、甚至 CodeMirror 自己可能加的属性。加了之后只关心 class。

**现在讲那个竞态。** 语言包是动态 import 的，而用户可能在 import 完成前就切换了工具。如果一个 React 式的 `await` 回来被告知"你过时了"，会发生什么？

`createEditor` 里有一个 `editorToken`：

```ts
let editorToken = 0

async function createEditor() {
  if (!editorRef.value) return
  const token = ++editorToken
  const language = await langExt()
  if (token !== editorToken || !editorRef.value) return
  // ...继续创建
}
```

每次调用先自增 token 并记下自己的值，`await` 回来后检查"我还是最新的吗"。不是就静默退出。没有这道闸，用户快速切换语言时，先发出的 import 可能后完成，于是 SQL 编辑器被 json 语言包配置——一个很难复现的 bug。

语言切换的 watcher 同样有这道闸：

```ts
watch(() => props.language, async () => {
  const token = ++editorToken
  const language = await langExt()
  if (view && token === editorToken) view.dispatch({ effects: languageCompartment.reconfigure(language) })
})
```

**`modelValue` 的同步有个反向保护**：

```ts
watch(() => props.modelValue, v => {
  if (view && v !== view.state.doc.toString()) {
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: v } })
  }
})
```

`v !== view.state.doc.toString()` 这个判断必须加。因为用户打字时：编辑器内部状态变了 → `updateListener` emit → 父组件更新 `modelValue` → watcher 触发 → 如果无条件 dispatch，就会把用户刚打的字再"设置"一遍，光标跳到开头。这是 v-model 封装里最经典的 bug。

`onBeforeUnmount` 里两件事：`editorToken++` 让所有在途的 async 操作失效，`view?.destroy()` 释放 CodeMirror 占用的 DOM 和定时器，`mo?.disconnect()` 断开观察器。少任何一件都会在 SPA 里累积内存。

## 主题闪烁：在 bundle 之前就决定

这是所有暗色主题站点都会遇到的一个问题：用户偏好暗色 → 页面加载 → 先是白底 → 然后 JS 执行 → 变暗色。那一下白闪（FOUC，Flash of Unstyled Content）在夜里非常刺眼。

根因是执行顺序：CSS 阻塞渲染，但 `<script type="module">` 是 defer 的，要等 HTML 解析完才跑。所以主题 class 一定晚于首次绘制。

解法是放一个同步的内联脚本，在 `<head>` 里、在任何 CSS 生效之前：

```js
(function () {
  try {
    var t = localStorage.getItem('theme')
    var dark = t === 'dark' || ((!t || t === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    if (dark) document.documentElement.classList.add('dark')
  } catch (e) {}
})()
```

这个文件是 `public/theme-init.js`（265 字节），被 `index.html` 用普通 `<script>`（不是 module）引入，所以它是**阻塞**的——在它跑完之前不会绘制。

三行逻辑的每一步都有原因：

`var t = localStorage.getItem('theme')` 直接读原始字符串，不 `JSON.parse`。因为这是全项目唯一一个"不能失败"的代码路径，而 `JSON.parse` 会抛异常（如果值被写坏了）。用原始字符串存，读取只有 `===` 比较，永不抛错。

`t === 'dark'` 处理显式暗色。`(!t || t === 'system') && matchMedia(...)` 处理"没设置过"和"选了跟随系统"。两个条件合并成一个 `dark` 布尔值。

`try/catch` 是必须的。Safari 的隐私模式、某些企业策略、以及跨域 iframe 里，`localStorage` 的访问本身就会抛 `SecurityError`。如果这里抛了而没捕，整个脚本终止——不只是主题不生效，后面的代码全不跑。空的 `catch (e) {}` 在这里是正确的，因为失败后果只是"用默认浅色"。

**Store 侧的写法要和它一致**，否则会出现两套逻辑：

```ts
export const useSettingsStore = defineStore('settings', () => {
  const storedTheme = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null
  const theme = ref<'light'|'dark'|'system'>(
    storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system' ? storedTheme : 'system'
  )
  function applyTheme() {
    if (typeof window === 'undefined') return
    const isDark = theme.value === 'dark' ||
      (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
    window.localStorage.setItem('theme', theme.value)
  }
  watch(theme, applyTheme, { immediate: true })
  // ...
})
```

注意 `storedTheme` 的三值校验：只有 `'light'`、`'dark'`、`'system'` 才被接受，其它任何值（包括被用户手动改坏的）都回退到 `'system'`。这和 `theme-init.js` 的默认值一致——两处都认为"没有有效偏好"等于"跟随系统"。

`typeof window !== 'undefined'` 两个检查是为了 SSG。`vite-ssg` 在 Node 里执行组件，那时没有 `window` 也没有 `localStorage`，不加判断会直接崩在构建阶段。

`watch(theme, applyTheme, { immediate: true })` 的 `immediate` 让它在 store 初始化时跑一次，把 `theme-init.js` 已经设好的 class 和 store 状态对齐。

系统的 prefers-color-scheme 变化也要监听：

```ts
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme.value === 'system') applyTheme()
  })
}
```

`if (theme.value === 'system')` 是关键：用户显式选了浅色，系统变暗时不该跟着变。

**这里有一个真实的小 bug 值得承认**：`applyTheme()` 无条件 `localStorage.setItem('theme', theme.value)`，包括在 `immediate: true` 的首次执行里。这意味着一个从没设置过主题的用户，第一次打开页面就被写入了 `'system'`。功能上无害（`'system'` 就是默认值），但它抹掉了"用户从未表达过偏好"这个信息。如果将来要加一个"首次访问时提示选择主题"的功能，这个区分就没有了。正确做法是首次执行不写存储。

## 搜索：焦点、aria 和 Tab 陷阱

搜索弹窗（Ctrl+K）只有 5,237 字节，但它包含了一个可用对话框的几乎全部要素。

**打开时保存焦点，关闭时归还**：

```ts
let restoreFocus: HTMLElement | null = null

watch(() => props.open, async v => {
  document.body.classList.toggle('overflow-hidden', v)
  if (v) {
    restoreFocus = document.activeElement as HTMLElement | null
    query.value = ''
    selected.value = 0
    await nextTick()
    inputRef.value?.focus()
  } else {
    restoreFocus?.focus()
  }
})
```

`document.activeElement` 在打开前记下来，关闭后 `focus()` 回去。这让键盘用户按 Esc 后还在原来的位置，而不是被丢回页面顶部。

`await nextTick()` 之后才 `focus()` 是因为：弹窗是 `v-if` 渲染的，元素在同一个 tick 里还不存在。`nextTick` 等 DOM 更新完，再 focus。

`overflow-hidden` 挂在 `body` 上防背景滚动。`onBeforeUnmount` 里也要移除它——否则如果组件在打开状态下被卸载（比如路由跳转），整个页面会永久无法滚动。这是一个非常常见的 bug。

**键盘导航**：

```ts
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); selected.value = Math.min(selected.value + 1, results.value.length - 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); selected.value = Math.max(0, selected.value - 1) }
  else if (e.key === 'Enter') { const t = results.value[selected.value]; if (t) go(t.path) }
  else if (e.key === 'Escape') { close() }
  else if (e.key === 'Tab') {
    const focusables = [...(dialogRef.value?.querySelectorAll<HTMLElement>('button, input') ?? [])]
      .filter(el => !el.hasAttribute('disabled'))
    if (focusables.length) {
      const index = focusables.indexOf(document.activeElement as HTMLElement)
      const next = focusables[(index + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length]
      e.preventDefault()
      next.focus()
    }
  }
}
```

`e.preventDefault()` 在箭头键上是必须的——不拦，输入框里的光标会跟着移动，用户按↓想选下一项，结果只是光标跳到了文本末尾。

**Tab 陷阱**是实现里最精巧的一段。`(index + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length` 这个取模写法同时处理了两件事：向前/向后循环，以及"当前焦点不在列表里"（`index === -1`）时能落到正确位置——`-1 + 1 = 0`（第一项），`-1 - 1 + n = n - 2`（倒数第二项）。如果不用取模而用 `if` 判断边界，代码会长三倍而且更容易错。

`e.preventDefault(); next.focus()` 组合起来让焦点在弹窗内部循环，永远不会跑到背景页面。这是 `aria-modal="true"` 的**实际要求**——模态语义宣称"背景不可交互"，如果 Tab 能跑出去，就是欺骗辅助技术。

**aria 的完整性**：

```html
<div ref="dialogRef" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title" ...>
  <span id="search-dialog-title" class="sr-only">搜索工具</span>
  <input ref="inputRef" v-model="query" role="combobox" aria-controls="search-results"
         :aria-activedescendant="results[selected]?.id ? `search-${results[selected].id}` : undefined"
         aria-autocomplete="list" ... />
  <kbd>ESC</kbd>
  ...
  <div id="search-results" role="listbox" ...>
    <button v-for="(t,i) in results" :key="t.id" :id="`search-${t.id}`" role="option"
            :aria-selected="i===selected" ...>
```

四个角色各司其职：`dialog` + `aria-modal` 声明这是一个模态；`combobox` + `aria-autocomplete="list"` 声明输入框会过滤一个列表；`listbox`/`option` 声明结果列表；`aria-activedescendant` 把"当前选中项"关联到输入框上——这样屏幕阅读器在焦点仍在输入框时就能读出"当前选中 JSON 格式化"。

`aria-activedescendant` 而不是把焦点移到选项上，是组合框的标准做法。焦点移动会让输入框失焦，用户就没法继续打字了。

`aria-selected="i===selected"` 是视觉高亮和语义的同步。注意视觉上用的是一个左侧渐变条加背景色，这两个都是纯装饰，语义完全靠 `aria-selected`。

**结果数量上限**：`searchTools(query.value).slice(0, 12)`。12 是个经验值——一屏能放下的项目数。加载 42 个对搜索没帮助，只让用户多滚两下。

循环 `watch(results, value => { selected.value = Math.min(selected.value, Math.max(0, value.length - 1)) })` 处理"用户选了第 10 项，然后继续打字让结果只剩 3 项"的情形。不夹紧的话，`selected` 指向一个不存在的索引，按 Enter 什么都不会发生，看起来像功能坏了。

## localStorage 会坏，所以每个读都要校验

`localStorage` 在这个项目里有四个用途：主题、收藏、最近使用、以及将来可能的设置。它看起来像"一个简单的键值存储"，实际上是一个**能被任意损坏**的外部输入。

原因有四个：用户可以在 DevTools 里改；同一域名下的其它页面（比如一个遗留的子路径）可能写同名键；隐私模式的配额可能是 0，`setItem` 抛 `QuotaExceededError`；以及 SPA 里旧版本的代码可能写过不同格式的值。

所以所有读写都走一层包装：

```ts
export function safeGet<T>(key: string, fallback: T, isValid?: (value: unknown) => value is T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback
    const v = localStorage.getItem(key)
    if (!v) return fallback
    const parsed: unknown = JSON.parse(v)
    return isValid && !isValid(parsed) ? fallback : parsed as T
  } catch {
    return fallback
  }
}
export function safeSet(key: string, val: unknown) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(key, JSON.stringify(val)) } catch { void 0 }
}
export function safeRemove(key: string) {
  try { if (typeof localStorage !== 'undefined') localStorage.removeItem(key) } catch { void 0 }
}
```

`safeGet` 的第三个参数是类型守卫，这是关键设计。它不是一个普通的类型断言，而是一个**运行时验证函数**：

```ts
const favorites = ref<string[]>(
  safeGet<string[]>('favorites', [], (value): value is string[] =>
    Array.isArray(value) && value.every(item => typeof item === 'string')
  )
)
```

`Array.isArray(value) && value.every(item => typeof item === 'string')` 检查了两层：外层是数组，且每个元素都是字符串。只检查外层是不够的——如果存储里是 `[1, 2, 3]`，那么 `favorites.value.includes('json-formatter')` 永远返回 `false`，收藏功能静默失效，用户在页面上点收藏按钮能看到反馈但刷新后消失。

`value is string[]` 这个返回类型注解让 TypeScript 在通过检查后**收窄类型**：`safeGet` 的返回值是 `string[]` 而不是 `unknown`。这是类型守卫相对类型断言的价值——断言是你告诉编译器"相信我"，守卫是函数自己证明。

`catch { return fallback }` 兜住 `JSON.parse` 的异常。一个被写坏的值（比如 `"favorites": "not json"`）会让 `JSON.parse` 抛错，不捕就是整个 store 初始化失败，页面白屏。

`safeSet` 里的 `catch { void 0 }` 是刻意吞掉错误。`setItem` 在配额满时会抛 `QuotaExceededError`，而"收藏一个工具时配额满了"不应该让页面崩溃——最多是这次收藏没存上。`void 0` 是让 lint 知道"我知道这里吞了异常，是故意的"。

**容量的问题值得单独说。** `localStorage` 通常是 5MB（按 UTF-16 字符算，实际能存 2.5MB 左右）。最近使用的上限是 20 个 id：

```ts
function push(id: string) {
  recent.value = [id, ...recent.value.filter(x => x !== id)].slice(0, 20)
}
```

`[id, ...filter(x => x !== id)]` 先把旧位置删掉再放到最前，所以重复访问同一个工具不会让它出现两次。`.slice(0, 20)` 截断到 20 条。20 个短字符串大约 400 字节，离配额极远。

这个设计的好处是"最近使用"的语义正确：不是"最近 20 次访问"，而是"最近 20 个不同的工具"。用户反复用 JSON 格式化，它稳定在第一格，不会占满 20 个位置。

**为什么不用 IndexedDB。** 设计文档里提过 IndexedDB 用于"工具历史"（保存每次格式化的输入）。这个功能最终没做，原因很实在：所有工具都在处理敏感数据（JWT、密码、客户 JSON），把输入持久化到磁盘是这个项目**最不该做**的功能。一次"保存历史"的勾选，可能让一个 token 在磁盘上躺三个月。localStorage 只存工具 id 和主题，不存任何用户输入——这是一个安全决策，不只是容量决策。

## CSP：connect-src https: 是唯一的妥协

一个纯本地工具站的 CSP 应该很严。`public/_headers` 里是这样的：

```text
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https:; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

逐条看，每条都有具体理由：

`X-Frame-Options: DENY` 和 CSP 的 `frame-ancestors 'none'` 是同一件事的两代写法。前者给老浏览器，后者是新标准。两个都写是因为没有成本。

`X-Content-Type-Options: nosniff` 阻止浏览器"猜"内容类型。没有它，一个被上传的 `.txt` 如果内容是 HTML，某些情况下会被当 HTML 执行。

`Referrer-Policy: strict-origin-when-cross-origin` 保证跳转到外部时只发送 origin（`https://devbox.example`），不发送完整路径。用户的工具页 URL 可能包含搜索词，不该泄漏。

`Permissions-Policy` 把摄像头、麦克风、地理位置全部关掉。这个网站一个都不需要，显式关闭能防止将来某个第三方脚本请求它们。

`script-src 'self'` 没有 `'unsafe-inline'`，也没有 `'unsafe-eval'`。这意味着行内 `<script>` 和 `eval` 都不能用。**这直接影响了架构**：`theme-init.js` 必须是独立文件而不是内联脚本（前面那一节的原因），而 CodeMirror 和 Vue 的运行时都不能依赖 `eval`（Vue 的运行时编译版本需要 `eval`，所以只能用预编译的 SFC）。

`style-src 'self' 'unsafe-inline'` 里的 `'unsafe-inline'` 是必须的。Vue 的 `<style scoped>` 在运行时注入 `<style>` 标签，而 CodeMirror 通过 `element.style` 设置内联样式（比如光标位置、行高）。没有这个豁免，整个编辑器会没有样式。这是一个明确的取舍：样式注入的风险（CSS 注入）远低于脚本注入，而且这个站点不渲染用户提供的 HTML（Markdown 预览有 DOMPurify）。

`img-src 'self' data: blob:` 三个来源各有用途。`data:` 是 Base64 图片工具的预览（`data:image/png;base64,...`）；`blob:` 是图片压缩和 EXIF 预览（`URL.createObjectURL(file)`）；`'self'` 是 favicon。

`font-src 'self' data:` 允许字体内联为 data URL，这是某些打包方式需要的。

`worker-src 'self' blob:` 是为将来把重活挪进 Worker 预留的（`new Worker(URL.createObjectURL(new Blob([...])))` 需要 `blob:`）。目前没用上，但加上不影响安全。

**`connect-src 'self' https:` 是唯一的明显妥协。** 严格来说，这个站点只需要连三个域名：`cloudflare-dns.com`（DoH）、`ipwho.is`（IP 查询）、以及用户输入的目标地址（HTTP Ping）。

那为什么不写死？

因为第三个没法写死。HTTP Ping 的核心功能就是"测用户输入的任何地址"，如果 CSP 只允许三个域名，这个工具就废了。

`https:` 这个 scheme 级授权意味着"任何 HTTPS 地址都可以连"。它比 `*` 好（至少禁了 HTTP 和 `ws:`），比白名单差（XSS 之后可以往任意 HTTPS 端点外传数据）。

一个折中方案是给 Ping 工具单独一个页面，用更严的 CSP —— 但静态托管（Cloudflare Pages）的 `_headers` 是按路径匹配的，不是按查询参数，而 Ping 的路径是固定的 `/tools/ping`。理论上可以给这个路径单独写一个 `connect-src *`，其它路径写严格版。**这个改进没做，是懒，不是不能做。**

值得说清的是：`connect-src` 的放宽只影响"脚本能往哪发请求"。它不影响 `script-src 'self'`——攻击者即使能发请求，也没法加载外部脚本。所以最坏情况是数据外传，不是代码执行。这个区分在评估风险时很重要。

## SSG 与 PWA：两套缓存别打架

这个项目同时做了静态生成（SSG）和 PWA，这两套东西都和"缓存"有关，而它们的缓存逻辑完全相反。

**SSG 的目标是"每个 URL 都有真实 HTML"。** `vite-ssg` 在构建时把每个路由渲染成静态 HTML，好处是：
- 爬虫拿到完整内容（不需要执行 JS）
- 首屏更快（HTML 里已经有内容）
- 每个页面有自己的 `<title>` 和 meta

`generate-sitemap.mjs` 配合 SSG 工作：它列出所有路径，和 SSG 实际生成的文件一一对应。这个"一一对应"是 sitemap 能信的前提——如果 sitemap 列了一个 SSG 没生成的路径，搜索引擎会拿到 404，反而降低信任度。

**PWA 的目标是"离线也能用"。** `VitePWA` 注册一个 Service Worker，把构建产物缓存起来：

```ts
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'favicon.svg', 'robots.txt', 'theme-init.js', 'icons/*.png'],
  manifest: {
    name: 'DevBox · 程序员工具箱',
    short_name: 'DevBox',
    description: '快速、免费、隐私优先的程序员在线工具箱，包含开发、编码、安全、网络诊断和 AI 代码风格分析工具',
    theme_color: '#0f172a',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    icons: [
      { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' as any }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
  }
})
```

`registerType: 'autoUpdate'` 意味着新版本部署后，用户下次打开会自动用新版。代价是**用户可能在一次会话中途被更新**——如果新版本改了某个 chunk 的 hash，正在加载的旧页面会拿不到旧 chunk。Workbox 的默认策略是"激活后清理旧缓存"，这可以在大多数情况下避免问题，但不是绝对。

`globPatterns` 里的 `html` 很关键。SSG 生成的每个 `/tools/json-formatter/index.html` 都要被缓存，否则离线访问工具页会 404。但这也意味着**HTML 被缓存了**——用户离线时看到的是上次的 HTML 快照，可能和当前注册表不一致。对一个工具站来说这是可接受的（工具本身在 JS 里），但它是一个真实的边界。

`purpose: 'any maskable'` 里的 `as any` 是一个类型补丁。`vite-plugin-pwa` 的类型定义里 `purpose` 只允许 `'any' | 'maskable' | 'monochrome'`，但规范允许用空格分隔的多个值。这个 `as any` 是在绕过库的类型限制，不是绕过浏览器。

**两套缓存最容易打架的地方是更新时机。** 假设用户上周打开过页面，SW 缓存了旧版 chunk。这周部署了新版本。用户再打开时：
1. HTML 从网络取（`index.html` 的缓存策略是 network-first，或者被 `globPatterns` 缓存但下次更新时替换）
2. HTML 里引用新的 chunk hash
3. 新 chunk 不在缓存里，从网络取
4. 成功

这个流程能跑通是因为 chunk 文件名带 hash——新版本的 HTML 永远不会引用旧版本的 chunk。但如果 HTML 被缓存成永不过期，用户就会一直看到旧版。Workbox 的默认行为是 `index.html` 走 "NetworkFirst"，所以这个问题被规避了。

**一个具体的小心机**：`includeAssets` 里显式列了 `theme-init.js`。这个文件不在 Vite 的模块图里（它是 `public/` 下的原样拷贝），所以 Workbox 的 `globPatterns` 会自动包含它（匹配所有 `.js`）。但显式列出来让意图更清楚：这个文件必须离线可用，因为它是防闪烁的第一道闸。

`icons/icon-512x512.png` 出现两次，一次 `purpose: 'any'` 一次 `purpose: 'maskable'`。这是 Android 的要求：maskable 图标会被裁成圆形/圆角/水滴形，内容必须留出安全边距。同一个文件当两种用途不理想（maskable 需要更小的内容比例），但这是"先用起来"的选择——正确的做法是画一张专门的 maskable 图标，四周留 20% 边距。

## 已知边界：一份诚实的清单

写到这里，该把"这个项目做不到什么"列清楚了。每一条都是我在写代码时做的取舍，不是疏忽。

**一、AI 检测不能证明作者。** 它是一个风格启发式评分器。样本短、经过格式化、遵循团队模板、或者人工模仿 AI 风格的代码，都可能误判。`modelHint` 里的模型名称只是未验证的字符串匹配。这是这个工具最重要的边界，前面已经用测试锁住了措辞。

**二、HTTP Ping 不是 ICMP Ping。** 它测的是 HTTP 请求的往返时间，受 CORS、CDN、缓存、防火墙和 HTTP 服务状态影响。一个禁用了 HEAD 的服务器会"超时"，但 ICMP 可能是通的。页面标题写"Ping 延迟检测"是不精确的，但"HTTP HEAD 往返时间检测"没人搜得到。

**三、ReDoS 防护不完整。** 嵌套量词检测是正则层面的启发式，拦不住交替回溯（`(a|aa)+`）、反向引用、以及多层嵌套。长度上限 1000/200000 只管住规模，管不住结构。真正的解法是 Web Worker + 超时 terminate，代价是实时性。

**四、CIDR 测试覆盖薄。** `cidr/processor.test.ts` 只有 294 字节，覆盖 `/24` 的正常路径。`/0`、`/31`、`/32`、`255.255.255.255/32` 这些需要特判的边界都没有测试。代码里那三个特判（`prefix === 0`、`prefix >= 31`、`total > 2`）是靠读代码发现的，不是测试。IPv6 完全没实现。

**五、CSP 的 `connect-src https:` 是授权过宽。** 任何 HTTPS 地址都可以连。按路径分别配置 `_headers` 可以改善，但没做。

**六、隐私标注靠自觉。** 给一个工具加 `fetch()` 而不标 `processing: 'external'`，页面会继续显示"本地处理"。类型系统表达不了"函数体里有没有网络调用"，需要 CI 层的静态检查。

**七、AES 解密的最小长度检查偏松。** `payload.length < 29` 应该是 `< 44`（16 salt + 12 iv + 16 tag）。不影响安全（`decrypt` 会拒绝畸形输入），但它是一个算错的数字。

**八、搜索没有权重排序。** 按注册表顺序返回，输入 `json` 会先给 json-formatter、json-viewer、json-diff，然后才是 csv-json。这是"碰巧合理"，不是"设计合理"。

**九、没有 i18n。** 中英文名并存是双字段，不是 locale 系统。要支持第三种语言，`name`/`nameZh` 的结构就得改。

**十、单文件组件里的样式不共享。** 42 个工具各自的 `.vue` 里可能写重复的按钮样式。`src/style.css` 提供了 `.btn-primary`、`.btn-ghost`、`.card`、`.icon-chip` 等工具类，但没有任何机制强制使用它们。这个项目的样式一致性依赖自觉，不依赖约束。

**十一、主题首次访问会被写入存储。** `applyTheme()` 在 `immediate: true` 的首次执行里也 `setItem`，抹掉了"用户从未表达偏好"的状态。

**十二、没有 E2E 测试。** 31 份测试全部是 processor 的单元测试。没有一个测试验证"打开 JSON 页、输入垃圾、看到错误提示"这条完整路径。`README` 里提到的 Playwright 回归是手工跑过的，不在 CI 里。

这份清单不短，但每一条都是"知道，且选择了接受"。一个不敢列边界的项目，通常是因为从来没想过自己的边界在哪。

## 如果重写，我会先改这五件事

按优先级排：

**第一，给隐私标注加 CI 检查。** 一条 lint 规则：扫描 `src/tools/*/` 下所有 `.vue` 和 `.ts`，出现 `fetch(`、`XMLHttpRequest`、`navigator.sendBeacon`、`WebSocket` 而注册表里对应工具的 `processing` 不是 `external`/`mixed`，就 fail。这比任何文档都有效——文档会被忽略，CI 不会。

**第二，把正则执行挪进 Worker。** 静态检测拦住 80%，Worker + 1 秒超时拦住剩下的 20%。实现上要注意：Worker 里不能直接 `import` CodeMirror，要保持它只依赖 processor；消息传递用 `postMessage` + `structuredClone`，输入输出都是字符串所以开销可控。实时高亮的流畅度会受影响，折中方案是"输入后 300ms 防抖再算"。

**第三，给 CIDR 补全边界测试。** `/0`、`/1`、`/31`、`/32`、`0.0.0.0/0`、`128.0.0.0/1`、`255.255.255.255/32`，每个断言网络地址、广播地址、可用数量、掩码四个字段。再补 IPv6（用 `BigInt` 而不是 `number`，因为 128 位超出 JS 的 53 位安全整数）。

**第四，把 `ToolDefinition` 拆成两层。** 现在是"元数据 + 组件引用"混在一起，导致 Node 环境 import 注册表时会看到 `() => import(...)` 这样的函数——虽然 `generate-sitemap.mjs` 只读 `path` 和 `id` 所以不会执行它们，但这是靠"恰好没调用"而不是靠结构。正确做法是 `tools.meta.ts`（纯数据，Node 安全）和 `tools.components.ts`（组件映射，只在浏览器加载）分两个文件。

**第五，把主题的首次写入修掉。** `applyTheme` 加一个 `persist` 参数，`immediate` 那次传 `false`。十行改动，但能让"从未选择"这个状态存在。

还有一个"想做但想不清楚"的：**工具之间的数据流转**。比如在 JWT 解码页看到 payload 是一段 Base64，能不能一键跳到 Base64 解码页并带上数据？这个功能很诱人，但它需要一个"跨工具的临时数据"通道，而这个通道本身就是隐私风险（数据在页面间传递，可能被 forgot 在 localStorage 里）。所以它一直在待办列表的最底部。

## 小结：工具站的复杂度在"第 43 个工具"

回头看这个项目，42 个工具里没有一个是算法难题。JSON 格式化、Base64、JWT 解码、UUID 生成、时间戳转换——每一个的独立实现都不超过 100 行。

真正花时间的是那些"不写就会在第 43 个工具上爆炸"的东西：

**一份注册表**，让路由、搜索、分类、收藏、最近使用、sitemap、SEO 七处派生自同一份数据。加一个工具是填一条记录，不是改七个文件。

**一个 processor 契约**，让逻辑离开框架。31 份测试能在几十毫秒里跑完，是因为它们不碰 DOM、不碰 Vue、不碰 `this`。

**一个隐私枚举**，让"数据会不会发出去"变成类型的一部分，而不是 About 页面的一段散文。

**一组输入上限**，让不可信输入在进入 UI 之前就被挡住。1000 字符的正则、20 万字符的文本、100 万字符的源码、0-32 的 CIDR 前缀、1-100 条的批量生成。

**一套诚实的分级**，让"AI 风格倾向较高"和"AI 生成"之间保持距离，并且用测试锁住这个距离。

**一个不假装的能力边界**，让"HTTP Ping"页明说它不是 ICMP，"AI 检测"页明说它不能证明作者，"DNS 查询"页明说域名会发给 Cloudflare。

这些东西加起来不到项目代码的三成，但它们决定了这个项目能不能活过第 43 个工具。

如果说这篇文章有一个可迁移的结论，那就是：**做工具集合类产品时，先设计"工具"这个概念的边界，再写第一个工具。** 前三个工具用手写页面也能交付，但第 20 个工具会让你为前 19 个还债。一份十行的接口定义，能省掉后面几十次重构——这不是架构洁癖，这是在时间上做正确的投资。

代码在 [github.com/zhoujungis/devtools](https://github.com/zhoujungis/devtools)。42 个工具全部在浏览器本地运行，没有一个需要登录。
