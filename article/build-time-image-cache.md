---
title: "构建 4 分钟，3 分半在压 94 张图"
slug: "build-time-image-cache"
category_id: null
tags: ["构建", "性能优化", "CI", "工程效率"]
status: "published"
cover_image: "https://blog.zhoujun.dev/photos/build-time-image-cache-cover.png"
---

# 构建 4 分钟，3 分半在压 94 张图

> 适用读者：本地构建越来越慢、或者 CI 每次都在重复做同一件事的人
> 技术栈：Node 脚本 + sharp，`postbuild` 钩子；思路与语言无关
> 阅读时间：约 12 分钟 | 难度：简单 | 收获：一次完整的构建耗时解剖、一个 95% 时间被浪费掉的现场、以及把 191 秒压到 21 秒的增量缓存

## 前言：构建慢，但你不知道慢在哪

这个博客的构建脚本很朴素：

```json
{
  "scripts": {
    "build": "vite build && node scripts/prerender.mjs",
    "postbuild": "node scripts/compress-images.mjs"
  }
}
```

`vite build` 打前端、`prerender.mjs` 给每篇文章生成静态页，`postbuild` 把 `public/photos` 里的 94 张封面压成 WebP + AVIF。

体感三分钟起步，而且**每次都是三分钟**——哪怕只改了一行 CSS，一张图都没动。

直觉上会说"`vite build` 慢"或"预渲染慢"。直到把三个阶段分别计时：

```
vite build     : 1.75 s
prerender      : ~16 s（146 个页面，走 API + 写文件）
image postbuild: 181.9 s (94 encoded, 0 cached)
TOTAL          : 191.3 s
```

**95% 的时间在压图**，而且压的是同一批从来没变过的文件。

## 一、先把三个阶段分开计时

不要凭感觉优化。写一个 40 行的包装脚本，把 `npm run build` 跑一遍并从输出里抽三个数字：

```js
const t0 = Date.now()
const res = spawnSync('npm', ['run', 'build'], { cwd: FRONTEND, shell: true, encoding: 'utf8' })
const total = (Date.now() - t0) / 1000

const vite = out.match(/built in ([\d.]+)s/)
const compress = out.match(/Done: (\d+) images, (\d+) encoded, (\d+) cached, ([\d.]+)s/)
```

三条信息立刻出来了：

| 阶段 | 耗时 | 占比 |
|---|---|---|
| vite build | 1.75 s | 0.9% |
| prerender（146 页） | ~16 s | 8.4% |
| 图片压缩（94 张 × 2 格式） | **181.9 s** | **95.1%** |
| 合计 | 191.3 s | 100% |

单张图 1.94 秒。这个数字本身合理——AVIF 编码本来就贵；不合理的是**为什么明明没变还要重压**。

## 二、第一版缓存为什么没用

第一反应当然是加缓存：产物存在就先跳过。我一开始把清单写在 `frontend/dist/.image-cache.json`，逻辑是"源文件 size + mtime 没变、两个产物文件也在，就跳过"。

单跑脚本是对的：

```
$ npm run precompress
Done: 94 images, 0 encoded, 94 cached, 0.1s.
```

但一放进 `npm run build` 就失效，永远 `94 encoded`。原因在 Vite 的默认行为：

```
vite build 开始 → emptyOutDir 清空 dist/ → 缓存清单和产物一起被删
```

**缓存放错了地方。** 构建产物目录本来就是"每次重建"的语义，往里塞跨构建的状态一定会被清掉。

修法很直接：缓存搬到 `frontend/.cache/images/`，dist 只作为输出的中转站。

```
frontend/
  .cache/images/            ← 跨构建的编码结果（git 忽略）
    manifest.json
    lc-1-cover.webp
    lc-1-cover.avif
  dist/photos/              ← 每次构建重新拷贝
```

## 三、增量逻辑：命中就只拷文件

每张图处理成两条路径：

```js
const hit = await cachedOutputs(src, manifest[src], srcStat)
if (hit) {
  await copy(hit.webp, distWebp)   // 命中：只拷贝，~10ms
  await copy(hit.avif, distAvif)
} else {
  await sharp(src).webp({ quality: 80 }).toFile(cacheWebp)  // 未命中：编码一次
  await sharp(src).avif({ quality: 60 }).toFile(cacheAvif)
  await copy(cacheWebp, distWebp)
  await copy(cacheAvif, distAvif)
}
```

三个判定条件缺一不可：

1. **源文件 size 相同**——挡掉"换了一张同名图"的最常见情况；
2. **源文件 mtime 相同**——挡掉"重新导出、大小恰好一样"；
3. **两个缓存产物都存在且非空**——挡掉"缓存目录被手工清过一半"。

清单里还写了 `options` 字段：

```json
{ "options": "webp80-avif60-max2400", "entries": { "frontend/public/photos/lc-1-cover.png": { ... } } }
```

**改了质量参数或最大尺寸，整张清单自动失效**——否则你会得到"新的 quality 对旧图不生效"这种极难发现的 bug。

## 四、实测：191 秒 → 21 秒

同一份内容（136 篇文章、94 张封面），冷热两次完整构建：

| 指标 | 冷缓存 | 热缓存 | 变化 |
|---|---|---|---|
| 图片压缩阶段 | **181.9 s**（94 encoded） | **0.1 s**（94 cached） | **−99.9%** |
| 完整构建 | **191.3 s** | **21.0 s** | **−89%** |
| 单张图成本 | 1.94 s | ~1 ms（拷贝） | — |

再补一个真实场景：改了一篇封面后重新构建，只有那一张重新编码，其余 93 张命中缓存，压缩阶段约 **2 秒**（一张 AVIF + WebP 的实际成本）。

冷启动仍然要 3 分钟——这是不可避免的，第一次总得压一遍。但**日常构建从"三分钟"变成"二十秒"**，这个差别直接决定了你会不会愿意为了改一个错别字重新构建。

## 五、还能更快吗

三个方向，按性价比排序。

**1. 并行编码（收益最大）**
现在是一张一张串行压。94 张图、每张 1.94 秒，开 4 个 worker 理论能到 ~50 秒。`sharp` 是 libvips 封装，本身线程安全，用 `Promise.all` 分批就能做。

**2. 只给需要的图产 AVIF**
AVIF 编码比 WebP 贵得多（大约 3–4 倍）。如果某些图只在 RSS 或归档页出现，没必要两种格式都产。

**3. 预渲染增量**
`prerender.mjs` 已经带了详情缓存（`.cache/prerender-details.json`），但每次仍会重写全部 146 个页面。改成"只重写 `updated_at` 变化的文章"能把 16 秒压到几秒——收益比不过图片，但也不难。

注意优先级：**先消灭"重复劳动"，再谈"并行"**。缓存把 95% 的重复劳动消灭掉了，并行才有意义。

## 六、上线 Checklist

- [ ] 构建缓存放在产物目录**之外**（否则 `emptyOutDir` 会删掉它）
- [ ] 缓存键包含源文件 size + mtime
- [ ] 缓存键包含**编码参数**（quality / max dimension），参数变更要整体失效
- [ ] 命中时校验产物存在且非空
- [ ] 提供 `--force` 全量重建入口（换库、换字体、怀疑缓存脏时用）
- [ ] 缓存目录进 `.gitignore`，但不进 `dist`
- [ ] CI 单独缓存 `.cache/images/`（否则 CI 永远是冷的）
- [ ] 冷启动路径仍然可用（第一次构建不能报错）

## 七、高频 FAQ

**Q：为什么不直接提交压好的 webp/avif 到仓库？**
A：可以，但 94 张 × 2 格式会往 git 里塞几百 MB 二进制，且换质量参数时要重新提交一批。缓存是"本地/CI 侧"的解法，仓库只留源图。

**Q：mtime 在 CI 上稳定吗？**
A：`git clone` 出来的 mtime 是 checkout 时间，每次都是新的 → CI 首次必然全量。所以 CI 要缓存 `.cache/images/`，而不是指望 mtime。

**Q：缓存会不会导致"改了图没更新"？**
A：size 和 mtime 同时相同、且内容不同，属于极小概率事件。真遇到就 `--force`。

**Q：为什么压缩放在 `postbuild` 而不是 `prebuild`？**
A：`prebuild` 时 dist 还没生成，压出来的文件会被 `vite build` 清掉。

**Q：`sharp` 的 AVIF 为什么这么慢？**
A：AVIF 用的是更贵的帧内编码（AV1），同等质量下体积比 WebP 小 30–50%，慢是换来的。

## 写在最后

这次优化没有改任何业务代码，只是把一个"每次都要做、但其实没变化"的步骤变成了增量。

值得记住的是那三个数字：**191.3 秒里有 181.9 秒在压同一批图。** 构建慢的时候，先别急着换工具链——把阶段拆开计时，答案往往难看到令人发笑：真正的问题从来不是"构建慢"，而是"你在重复构建同一件东西"。
