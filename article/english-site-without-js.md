---
title: "从 3 秒到毫秒首屏：英文站去 JS 化"
slug: "english-site-without-js"
category_id: null
tags: ["性能优化", "静态站点", "前端架构", "构建"]
status: "published"
cover_image: "https://zhoujungis.github.io/photos/english-site-without-js-cover.png"
---

# 从 3 秒到毫秒首屏：英文站去 JS 化

> 适用读者：手上有一个 SPA 站点，知道它"首屏慢"但说不清慢在哪的人
> 技术栈：Vue 3 + Vite 构建的 SPA，GitHub Pages 托管；英文站单独走预渲染静态壳
> 阅读时间：约 18 分钟 | 难度：中等 | 收获：一份可复算的首屏字节账、一次把 220 KB JS 降到 0 的改造、以及"哪些页面可以静态化"的判断标准

## 前言：3 秒白屏，但每个文件都不大

英文站上线后收到一条反馈：**打开要等三秒以上**。

第一反应是 CDN 慢。于是先量产物：HTML 22.9 KB、CSS 30.5 KB(gzip 6.0 KB)、入口 JS 79.9 KB(gzip 30.2 KB)……单看每个文件都很正常，没有任何一个"异常大"。

问题在**它们是一串必须按顺序执行的步骤**：

```
HTML → 30 KB CSS → 79.9 KB 入口 JS → 63.5 KB Vue 运行时 → 45.6 KB 客户端
     → 路由 chunk → Vue 清空 #app 重新渲染 → 页面才出现
```

六个请求、220 KB 原始字节（gzip 后 78.3 KB），每一步都要等上一步完成。**首屏时间不是最大的那个文件的下载时间，是这条链路的总和。**

这篇文章只做一件事：把这条链路拆成可复算的字节账，然后证明英文站根本不需要它。

## 一、先算账：一次首屏到底下载和执行了什么

我用一个 100 行的脚本（`tools/bench_static_shell.cjs`）直接读构建产物，不猜、不估：

```
== SPA 首屏引导（中文站同构） ==
files 5 | raw 220.1 KB | gzip 78.3 KB
   /assets/index-DQvGHmaK.js                    79.9 KB | gzip 30.2 KB
   /assets/_plugin-vue_export-helper-tRUQJj3d.js 63.5 KB | gzip 24.6 KB
   /assets/rolldown-runtime-QTnfLwEv.js          0.7 KB | gzip  0.4 KB
   /assets/client-DDSzq_-U.js                   45.6 KB | gzip 17.1 KB
   /assets/index.DnfPoa2_.css                   30.5 KB | gzip  6.0 KB
```

五个文件、六个请求（HTML 也算一个）。**这还只是首屏**——路由 chunk 在 JS 执行后才会被 `import()` 拉下来。

再看解析 + 编译成本。用 `vm.SourceTextModule` 只编译不执行，跑 7 次取中位数：

```
entry bundle /assets/index-DQvGHmaK.js 79.9 KB -> 3.4 ms
inline shell inline 0.8 KB -> 0.01 ms
```

3.4 ms 听起来不多——**因为它只是"编译"，不含下载、执行、DOM 构建、样式计算、广告脚本**。真实设备上一次首屏是三段相加：

| 阶段 | 决定因素 | 这次改造的影响 |
|---|---|---|
| 下载 | 220 KB / 带宽，6 个 RTT | 降到 12.9 KB gzip、2 个请求 |
| 解析编译 | JS 字节数 | 3.4 ms → 0.01 ms |
| 执行 + 渲染 | Vue 挂载、路由匹配、接口请求 | 整段消失 |

按 1 Mbps 的冷启动估算，光传输就是 78.3 KB × 8 / 1024 ≈ **0.61 s**，再加上六个串行 RTT、Vue 挂载、以及当时还有的 AdSense 脚本和一次后端 `preconnect`——**3 秒不奇怪，1 秒才奇怪**。

关键结论：**这不是"某个文件太大"，是"这个页面根本不该用 SPA 渲染"。**

## 二、判断标准：哪些页面可以静态化

英文站的页面有一个特征：**内容在构建期就完全确定**。

- 文章列表：来自构建时读取的文章注册表，不会在运行时新增；
- 文章详情：正文是构建期生成的 HTML，没有评论框、没有编辑器；
- 专题页、分页：全部由同一份数据推导。

也就是说，这些页面**没有任何运行时状态**。唯一需要 JS 的三件事其实很小：

1. 主题切换（读 `localStorage.theme`，切一个 class）；
2. 移动端菜单（切一个布尔值）；
3. 分页/导航（构建期就能生成静态链接，根本不需要 JS）。

反过来说，中文站不能这么砍：它有搜索、评论、后台入口、Live2D、动态路由。**判断标准不是"想不想快"，而是"这个页面有没有非构建期才能确定的内容"。**

## 三、改法：一个 23 行的静态壳

改造后的英文站首页，构建产物是这样的：

```
== /en/ 静态壳 ==
html raw 22.9 KB | gzip 6.9 KB
external scripts 0 | external css 1
inline js bytes 792 | lines 23
css /assets/index.DfnPoa2_.css 30.5 KB | gzip 6.0 KB
```

**外部脚本 0 个**。全站只剩三个文件：HTML、CSS、以及 HTML 里内联的 792 字节 JS。

内联脚本只做两件事——恢复主题、绑定菜单按钮，并且**与 Vue 的 ThemeToggle 共用同一个 `localStorage` key**，否则用户在两个站之间来回切会出现主题跳变：

```html
<script>
  // 1) 首帧之前定主题，避免闪白
  (function () {
    var t = localStorage.getItem('theme')
    if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.dataset.theme = 'dark'
    }
  })()
  // 2) 菜单开关：一个 class + aria-expanded
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-menu-toggle]')
    if (btn) {
      var nav = document.querySelector('[data-nav]')
      var open = nav.classList.toggle('is-open')
      btn.setAttribute('aria-expanded', open ? 'true' : 'false')
    }
  })
</script>
```

三条纪律：

1. **脚本放在 `<head>` 里同步执行**，且只碰 `documentElement` 的 class——如果等 DOMContentLoaded 再定主题，用户会先看到一帧白底再变黑；
2. **不引入任何模块系统**，`type="module"` 也会带来一次额外的调度与 CORS 语义，能不用就不用；
3. **不挂载任何框架**：一旦挂载，Vue 会清空 `#app` 重建，首屏内容等于"白等一次"。

## 四、连带删掉的东西，比删 JS 更值钱

改造时一起清掉的还有三类"看起来无害"的东西，它们对首屏的影响不比 JS 小：

| 删掉的 | 原来的代价 |
|---|---|
| `modulepreload` 预加载 | 提前抢占带宽，且预加载的是首屏根本用不到的 chunk |
| AdSense 自动广告 | 第三方脚本 + 若干子请求，且加载时机不受控 |
| 后端 `preconnect` | 英文站首屏根本不请求 API，等于白建一条连接 |

第三条尤其典型：**`preconnect` 是"我马上要用"的承诺**，留着它相当于让浏览器为一个永远不会发生的请求提前握手。

## 五、分页必须回到构建期

静态化的直接后果：**所有列表必须提前存在**。英文站的分页是 12 篇一页，共 7 页，产物长这样：

```
/en/articles/
/en/articles/page/2/ … /en/articles/page/7/
```

三条规则写死在构建脚本里：

1. 每页独立 `canonical` 指向自己（第 2 页**不能**指回第 1 页，否则第 2 页永远进不了索引）；
2. 首页之外的页码写进 `<title>`（`Articles, page 3 | Stack Frame`），避免 7 个页面标题完全一样；
3. 分页 URL 全部进 sitemap——否则爬虫只能靠翻页链接发现它们。

这一条是静态化最容易漏的地方：**SPA 时代分页是"状态"，静态化之后分页是"页面"。**

## 六、代价：评论没法挂载了

诚实地说，静态化不是免费的。

英文文章页原本挂着一个 Vue 评论组件，静态化之后 `#app` 不再被挂载，评论框自然消失。我选的方案不是"再塞一个轻量评论区"，而是在文章末尾放一行说明：

> Comments live on the Chinese edition — 去中文站讨论

理由很直接：**评论是低频互动，首屏是高频路径。** 为 1% 的交互把 100% 的用户拖回 220 KB JS，账算不过来。

如果哪天一定要在英文站加评论，正确的做法是**按需加载**：先渲染一个静态按钮，点击时才 `import()` 评论 bundle。它在首屏之外，不影响这里的任何数字。

## 七、实测对照

| 指标 | 改造前（SPA） | 改造后（静态壳） | 变化 |
|---|---|---|---|
| 首屏 JS | 220.1 KB（5 文件） | 0.8 KB（内联） | **≈ 0** |
| 首屏请求数 | 6 | 2 | −67% |
| 首屏 gzip 字节 | 78.3 KB | 12.9 KB | −84% |
| JS 解析 + 编译 | 3.4 ms | 0.01 ms | 两个数量级 |
| Vue 挂载 / 路由匹配 | 有 | 无 | 整段消失 |

复现：

```bash
node --experimental-vm-modules tools/bench_static_shell.cjs
```

（`--experimental-vm-modules` 只是为了能构造 `SourceTextModule` 做"只编译不执行"的测量，不需要它也能跑字节统计。）

## 八、上线 Checklist

- [ ] 首屏 HTML 里没有任何外部 `<script src>`（除确有必要的第三方）
- [ ] 主题脚本在 `<head>` 同步执行，且与框架侧共用同一个 `localStorage` key
- [ ] 静态壳的导航链接全部是构建期生成的真实 URL，不依赖 JS 路由
- [ ] 分页每页独立 canonical，页码进 `<title>`
- [ ] 分页 URL 全部进 sitemap
- [ ] 删掉不再需要的 `preconnect` / `modulepreload` / 第三方广告
- [ ] 用无 JS 模式（或 `curl`）验证首屏内容完整
- [ ] 与框架站对照一次主题切换，确认没有闪白

## 九、高频 FAQ

**Q：静态化之后还能搜索吗？**
A：英文站没有搜索。真要加，加载 10 KB 的客户端索引比恢复整个 SPA 便宜得多。

**Q：为什么不干脆把中文站也静态化？**
A：中文站有编辑器、评论、后台和动态路由，静态化等于重写一遍产品。**能静态化的是"内容页"，不是"应用页"。**

**Q：`inline JS` 会不会破坏 CSP？**
A：会。当前站点没有严格 CSP；如果将来加，需要给这段脚本一个 `nonce` 或 `hash`。

**Q：为什么不用 `defer` / `async`？**
A：这段脚本必须在样式计算前决定主题，`defer` 会晚一帧导致闪白。

**Q：这样改对中文站有收益吗？**
A：有间接收益：英文站不再加载 Vue 运行时，两个站共用同一份 CSS，缓存在切换站点时能命中。

## 写在最后

这次改造真正的转折点不是"会写静态 HTML"，而是**接受一个反直觉的事实：首屏慢不是把某个文件变小就能解决的**。

220 KB JS 分散在五个文件里，每一个都不"大"；但它们构成一条必须串行执行的链，链的长度就是白屏的长度。要让首屏变成"HTML + CSS 就够"，只能把这条链整段删掉——而不是把它优化得更短。
