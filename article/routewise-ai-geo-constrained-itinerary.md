---
title: "Routewise AI：让模型吐出一份能落在地图上的行程"
slug: routewise-ai-geo-constrained-itinerary
cover_image: /photos/routewise-ai-geo-constrained-itinerary-cover.png
date: 2026-11-20
tags: [Cloudflare, TypeScript, SSE, LLM, 小程序]
---

> 适用读者：用大模型做结构化输出、又被「JSON 看起来对但内容不成立」折磨过的人；在 Cloudflare Pages Functions 上跑流式接口的开发者；想把一次 AI 调用做成产品级功能而不只是 Demo 的工程师
> 结论先行：Routewise AI 让 `gpt-5.6-luna` 输出一份可以直接画在真实地图上的旅行行程。它的做法不是「写更好的提示词」，而是四层约束叠起来：服务端先固定城市排期、把长行程按 4 天切块并并行请求、每块强制 JSON 结构并逐日做四类地理校验、失败时把具体拒绝原因塞回提示词重试一次。整条后端 1,101 行 TypeScript，没有服务器。代价也很明确：一次生成要 10 积分，校验器只认距离不认语义，四层约束仍然挡不住「地点名对、坐标偏 3 公里」这类错误
> 阅读时间：约 33 分钟 | 难度：进阶 | 收获：一套「让模型输出可验证结构」的完整链路 + SSE 流式与 D1 积分扣减的落地细节 + 地理校验器的实测行为（含一条真实的漏检）

**目录**

- 为什么旅行规划是最难的结构化输出
- 架构：五个 Part，一条边缘链路
- 固定城市排期，再让模型填空
- 按 4 天切块：把串行变成并行
- 提示词：把校验规则写进模型要遵守的契约
- SSE：一条流，四种事件，一根心跳
- 地理校验器：四类检查与一棵最小生成树
- 实测：校验器抓到了什么，漏掉了什么
- 积分：扣在生成之后，不是之前
- 认证：token 存哈希，IP 只能注册一次
- 邀请与积分：一张 daily reward slot 的赌桌
- 支付：Stripe 签名与 D1 的条件写入
- 用一份 mock 测出 SSE 最脏的边界
- 微信登录：一个必须由数据库解决的竞态
- 事件契约：四种事件，各自只做一件事
- 前端：从 PosterBook 到小程序的两套渲染
- 成本：一次生成的账能算到分
- 多语言：三套文案与一个运行时转换器
- 边界：为什么这些检查不能替代人工
- 定位数据：251 个城市 JSON 与一个边缘搜索代理
- 仍然存在的边界
- 小结

---

## 为什么旅行规划是最难的结构化输出

让模型写一份行程，是最容易演示、也最容易翻车的需求。

Demo 版本通常是：给它「东京 3 天」，它返回一段 Markdown，里面有 Day 1、Day 2、浅草寺、晴空塔、一兰拉面。看起来非常像真的。

然后你把它接到地图上。问题立刻出现：

- 上午在浅草（东经 139.79），下午去新宿（139.70），晚上又回银座（139.76）。文本读起来合理，地图上是一根来回折返的线。
- 坐标是 `35.68, 139.76` 这种「东京中心点」，五个景点全部落在同一点，因为模型对具体场馆的经纬度没有记忆。
- 行程说要坐新干线去京都，但 Day 2 和 Day 3 的城市还是东京，Day 4 突然变成京都。中间的转移消失了。
- 预算写「总计约 ¥8,000」，逐日加起来 ¥23,000。

这四个问题有一个共同本质：**模型的输出在语法上是对的，在语义上不成立**。JSON 能 parse，字段齐全，就是不能落地。

Routewise AI 的全部工程复杂度都在这件事上。项目规模不大：

```text
functions  18 个文件  1,101 行 TypeScript    Cloudflare Pages Functions
src        15 个文件  2,283 行 TS/TSX         Web 端 (React)
miniprogram 28 个文件                         微信小程序 (原生 WXML/JS)
public/locations 251 个城市 JSON              离线可用的定位数据
migrations  5 个 SQL 文件                     D1 数据库
```

在这 1,101 行里，`functions/api/plan.ts` 一个文件占了 491 行——它就是那条「让输出可验证」的链路。

## 架构：五个 Part，一条边缘链路

```text
 Web (React)  ─┐
               ├─▶ /api/plan (SSE) ─▶ ModelFlare gpt-5.6-luna
 小程序 WXML ──┘         │
                         ├─▶ D1：users / sessions / plans / credit_ledger
                         │
 public/locations/*.json ┘        离线城市数据（前端按需加载）
```

云资源只有两样：Pages Functions 和 D1（SQLite）。没有常驻进程，没有对象存储，没有消息队列。

请求进来先过四道关，然后再谈模型：

```typescript
const language: Language = body.language === 'zh-TW' || body.language === 'en' ? body.language : 'zh-CN'
const cities = Array.isArray(body.cities) ? body.cities.filter(...).slice(0, 8) : []
const days = Math.min(16, Math.max(2, Number(body.days) || 5))
const travelDate = /^\d{4}-\d{2}-\d{2}$/.test(body.travelDate || '') ? body.travelDate as string : new Date().toISOString().slice(0, 10)
const budget = Math.max(0, Number(body.budget) || 8000)
```

八个城市、十六天、日期格式、预算下限。这些数字在前端也有一份，在小程序的 `miniprogram/js/lib/plan.js` 里：

```javascript
export const MAX_CITIES = 8
export const MIN_DAYS = 2
export const MAX_DAYS = 16
export const PLAN_COST_CREDITS = 10 // 与后端一致，仅用于展示
```

两处都写着「与后端一致」。这种一致性靠注释维持，是这套系统的一个已知脆弱点，后面会再提。

## 固定城市排期，再让模型填空

多城市行程最容易被模型搞乱的地方不是内容，是**分配**。给它「东京、京都、大阪，7 天」，它可能分配成 2/3/2，也可能 3/2/2，还可能第一天在东京、第二天在大阪、第三天回东京。

所以这件事不让模型决定。服务端先算出一份完整的逐日城市表：

```typescript
function buildCitySchedule(cities: string[], days: number) {
  const baseDays = Math.floor(days / cities.length)
  let remaining = days % cities.length
  const schedule: string[] = []
  for (const city of cities) {
    const cityDays = baseDays + (remaining > 0 ? 1 : 0)
    if (remaining > 0) remaining -= 1
    for (let index = 0; index < cityDays; index += 1) schedule.push(city)
  }
  while (schedule.length < days) schedule.push(cities[cities.length - 1])
  return schedule.slice(0, days)
}
```

7 天 3 城 → `baseDays = 2, remaining = 1` → 东京 3 天、京都 2 天、大阪 2 天。余数优先给靠前的城市。

这份排期会被原样拼进每一块的提示词：

```text
The city allocation for the complete trip is fixed. Follow it exactly:
- Day 1 (2026-12-20): 東京
- Day 2 (2026-12-21): 東京
- Day 3 (2026-12-22): 東京
- Day 4 (2026-12-23): 京都
...
```

这一步的价值是**把不确定性从模型里拿走**。城市分配是确定性算法，模型只负责「东京这三天怎么玩」。它不需要在生成 Day 4 时记得前面已经过了三天东京——排期表直接告诉它。

日期也是同一套逻辑，用 `dateIso(travelDate, offset)` 从出发日推，不让模型算：

```typescript
function dateIso(travelDate: string, offset: number) {
  const date = new Date(`${travelDate}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + offset)
  return date.toISOString().slice(0, 10)
}
```

用 `T12:00:00Z` 而不是 `T00:00:00Z` 是有意的——避免时区导致 `setUTCDate` 跨日。中午十二点加上任何时区偏移都不会掉到前一天。

## 按 4 天切块：把串行变成并行

16 天的行程，一次生成会有两个问题：输出太长容易截断、单次等待太久。所以按每 4 天切一块：

```typescript
const chunks: number[][] = []
for (let start = 1; start <= input.days; start += 4) {
  chunks.push(Array.from({ length: Math.min(4, input.days - start + 1) }, (_, index) => start + index))
}
```

16 天 → 4 块。然后每 4 块一组并发：

```typescript
const results: Plan[] = []
for (let offset = 0; offset < chunks.length; offset += 4) {
  const group = chunks.slice(offset, offset + 4)
  const generated = await Promise.all(group.map((expectedDays) =>
    generateChunk(env, buildPrompt(input, expectedDays, citySchedule), expectedDays, onDelta),
  ))
  results.push(...generated)
}

results.sort((left, right) => left.days[0].day - right.days[0].day)
```

注意并发上限也是 4。这不是随意取的数——Pages Functions 有子请求上限，一次开十六个 fetch 是在跟平台的配额对赌。4 块一组，最多 4 个并发，是能用且不越界的折中。

每块只允许输出自己那几天：

```text
Generate ONLY Day ${firstDay} through Day ${lastDay} in this response.
Other chunks are generated separately. Keep transfers consistent with the fixed full-trip schedule.
```

「Keep transfers consistent」这句是给跨块一致性兜的底。因为第 5 天块和第 9 天块是并发跑的，彼此看不到对方的输出，唯一的共享上下文就是那份完整排期表。

最后合并时按天排序，标题类字段取第一块：

```typescript
return {
  title: input.language === 'en' ? `${routeName} · ${input.days}-day trip` : `${routeName} · ${input.days}天${input.style}之旅`,
  subtitle: first.subtitle,
  totalEstimate: first.totalEstimate,
  pace: first.pace,
  seasonalNote: first.seasonalNote,
  days: results.flatMap((result) => result.days).sort((left, right) => left.day - right.day),
}
```

标题不再问模型，直接按参数拼——这是同一个思路的延续：能用代码确定的，就不要留给模型。

## 提示词：把校验规则写进模型要遵守的契约

`buildPrompt` 有六十多行，但它其实是一份**可机检的契约**，不只是「描述意图」。三段时间线：

第一段给定死的输入：

```text
Trip requirements:
- Destinations, in preferred order: ${input.cities.join(' → ')}
- Number of days: ${input.days}
- Departure date: ${input.travelDate}
- Total budget: ${input.currency} ${input.budget}
- Travel pace: ${input.style}
```

第二段给输出结构。注意是完整的 JSON 骨架，包含一个示例 item：

```text
Return ONLY valid JSON without markdown, using exactly this structure:
{
  "title": "short trip title",
  ...
  "days": [{
    "day": 1,
    "items": [{
      "time": "08:00",
      "endTime": "09:00",
      "title": "specific activity, restaurant, train or hotel action",
      "latitude": 35.6812,
      "longitude": 139.7671,
      "type": "sight"
    }]
  }]
}
```

第三段是强制规则，每一条都对应后面某个校验或字段消费方：

```text
- Return exactly ${expectedDays.length} day objects, numbered ${expectedDays.join(', ')}.
- Give each day 5 or 6 chronological items covering breakfast or morning setup, ...
- Every item must include numeric WGS84 latitude and longitude for its named venue ...
- For intercity travel, name departure and arrival stations/airports, ...
- Plan geography before writing the itinerary: first group each day into one nearby district ...
- Within one local-area segment, keep consecutive stops within about 15 km, keep the whole segment within about 22 km, and keep meal stops within about 6 km of an adjacent activity.
- A distant day trip or a move to another city is allowed only when it is represented by a separate train item between the two areas. ...
```

倒数两条就是校验器的字面参数。这里有个重要设计：**15 / 22 / 6 这三个数字同时出现在提示词和 `geographicIssues` 里**。模型提前知道会被怎么量，校验器也不会遇到「规则从没说过、却判我不合格」的情况。

同时，提示词明确要求模型诚实：

```text
- Prices, schedules, opening hours and availability are estimates, never live-verified facts.
- For meals, ... Tell the user to verify current opening hours instead of claiming live availability.
```

这一句解决的是另一个层面的可信度问题：与其让模型声称「营业中」，不如让它承认是估算。

## SSE：一条流，四种事件，一根心跳

整个接口是一个 SSE 流，因为一次生成可能要一分多钟。客户端要看到进度，而不是对着转圈等。

服务端只发四种事件：

```typescript
async function sendSse(writer, event: string, data: unknown) {
  await writer.write(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
}
```

- `status`：开始生成
- `delta`：模型吐出的每一个文本增量
- `complete`：校验通过 + 扣积分 + 落库后的最终结果
- `error`：任意环节失败

心跳是 30 秒一次的注释帧：

```typescript
const heartbeat = setInterval(() => {
  void writer.write(encoder.encode(':keep-alive\n\n')).catch(() => undefined)
}, 30_000)
```

SSE 注释帧（以 `:` 开头）会被客户端忽略，但足以让中间层不把连接判死。

真正的活干在 `waitUntil` 里：

```typescript
const task = (async () => {
  try {
    await sendSse(writer, 'status', { message: locale.started })
    const plan = await generatePlan(env, {...}, (delta) => sendSse(writer, 'delta', { delta }))
    ...
    await sendSse(writer, 'complete', { plan, credits: user.credits - costCredits, planId })
  } catch (error) {
    try { await sendSse(writer, 'error', { error: locale.unavailable }) } catch { /* client disconnected */ }
  } finally {
    clearInterval(heartbeat)
    try { await writer.close() } catch { /* client disconnected */ }
  }
})()
context.waitUntil(task)
```

`context.waitUntil` 是这里的关键。Pages Functions 的响应返回后，运行时仍然允许这个 Promise 继续跑——否则流一交出去就被回收了。

响应头也得配合，不然会被中间层缓冲：

```typescript
headers: {
  'content-type': 'text/event-stream; charset=utf-8',
  'cache-control': 'no-cache, no-store',
  connection: 'keep-alive',
  'x-accel-buffering': 'no',
}
```

`x-accel-buffering: no` 这一条专门给 nginx 类反代看的。少了它，客户端会先收到一整块，流式变成批量。

读模型那端的 SSE 解析也是手写的，因为需要处理跨 chunk 的行边界：

```typescript
while (true) {
  const { done, value } = await reader.read()
  lineBuffer += decoder.decode(value, { stream: !done })
  let newline = lineBuffer.indexOf('\n')
  while (newline >= 0) {
    const line = lineBuffer.slice(0, newline).replace(/\r$/, '')
    lineBuffer = lineBuffer.slice(newline + 1)
    if (!line) await dispatch()
    else if (line.startsWith('data:')) eventData.push(line.slice(5).trimStart())
    newline = lineBuffer.indexOf('\n')
  }
  if (done) break
}
```

`decoder.decode(value, { stream: !done })` 的第二个参数很重要：流式解码时多字节字符可能被切断，`stream: true` 让 TextDecoder 保留不完整的字节序列，等下一块补齐。中文场景下这一点不做就会零星乱码。

## 地理校验器：四类检查与一棵最小生成树

模型返回后，服务端不直接相信。先做结构归一化，再做地理校验。

归一化负责把「看起来像」变成「确定是」：类型必须在三值白名单里，坐标必须在合法区间，缺失的给默认值，不足四天条目的直接判错：

```typescript
const itemType = itemValue.type === 'food' || itemValue.type === 'train' ? itemValue.type : 'sight'
const title = text(itemValue.title)
if (!title) throw new Error('Missing item title')
...
latitude: typeof itemValue.latitude === 'number' && itemValue.latitude >= -90 && itemValue.latitude <= 90 ? itemValue.latitude : undefined,
```

坐标超界的直接变 `undefined`，后面会被「缺坐标」那条规则抓到。这比抛错好——抛错会整块失败，变 `undefined` 只是让这一条不合格，重试时模型知道具体是哪一条。

然后是四类地理检查。这里有个关键的结构化假设：**`train` 条目是一个显式的换区分隔符**。

```typescript
// A train item is an explicit change of area. Stops on either side are checked as separate clusters.
const areas: PlanItem[][] = [[]]
for (const item of day.items) {
  if (item.type === 'train') {
    if (areas[areas.length - 1].length) areas.push([])
    continue
  }
  areas[areas.length - 1].push(item)
}
```

于是「东京上午 + 京都下午」不会被当成「相距 370 公里的两个景点」。它被切成两个独立的活动区，各自校验。没有这个假设，跨城行程永远无法通过。

四个检查，逐个看实现。

**一、相邻站点不超过 15 公里**：

```typescript
for (let index = 1; index < area.length; index += 1) {
  const kilometers = distanceKm(area[index - 1], area[index])
  if (kilometers !== null && kilometers > MAX_SAME_AREA_LEG_KM) {
    issues.push(`Day ${day.day}: adjacent stops are too far apart (${describeDistance(...)})`)
  }
}
```

距离用 haversine，手写而非依赖库：

```typescript
function distanceKm(left: PlanItem, right: PlanItem) {
  if (left.latitude === undefined || ...) return null
  const radians = Math.PI / 180
  const latitudeDelta = (right.latitude - left.latitude) * radians
  const longitudeDelta = (right.longitude - left.longitude) * radians
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(left.latitude * radians) * Math.cos(right.latitude * radians) * Math.sin(longitudeDelta / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
```

**二、单个活动区任意两点不超过 22 公里**：双重循环，O(n²)，但 n 是每天 5-6 条，无所谓。

**三、餐点距相邻活动不超过 6 公里**：只看前后邻居，取最近的一个。

**四、回头路检测**——这条最有意思。它比较「实际路线长度」和「这组点的最小生成树长度」：

```typescript
const traveled = routeDistance(area)
const minimumTree = minimumSpanningTreeDistance(area)
if (traveled !== null && minimumTree !== null && traveled > 25 && traveled > minimumTree * MAX_ROUTE_TO_MINIMUM_TREE_RATIO) {
  issues.push(`Day ${day.day}: stop order backtracks excessively (${Math.round(traveled)} km route for a roughly ${Math.round(minimumTree)} km area)`)
}
```

最小生成树回答的是「把这些点都走到，最短需要多长」。实际路线长度除以它，就是「你多绕了几倍」。比 2.2 倍且绝对长度超过 25 公里，判为折返。

最小生成树是 Prim 算法的朴素版：

```typescript
function minimumSpanningTreeDistance(items: PlanItem[]) {
  if (items.length < 2) return 0
  const reached = new Set([0])
  let total = 0
  while (reached.size < items.length) {
    let best: { index: number; kilometers: number } | null = null
    for (const left of reached) {
      for (let right = 0; right < items.length; right += 1) {
        if (reached.has(right)) continue
        const kilometers = distanceKm(items[left], items[right])
        if (kilometers !== null && (!best || kilometers < best.kilometers)) best = { index: right, kilometers }
      }
    }
    if (!best) return null
    reached.add(best.index)
    total += best.kilometers
  }
  return total
}
```

这个判据比「单条路线长度上限」聪明得多。它不关心你走了多远，只关心你走的路是不是这个区域本该走的距离的好几倍。一个 30 公里的郊区一日游可以是合理的，一个 20 公里却在城里来回折返的行程就不合理。

## 实测：校验器抓到了什么，漏掉了什么

这四个检查是纯函数，可以脱离 D1 和模型单独跑。我把 `distanceKm`、`routeDistance`、`minimumSpanningTreeDistance`、`geographicIssues` 连同常量原样抠出来，做了个基准脚本（`tools/bench_routewise_geo.mjs`），用六个真实东京坐标的行程测试：

```text
  compact (valid)
    route      3.3 km    mst  3.0 km    ratio 1.08    issues 0

  east-west ping-pong
    route     23.4 km    mst  9.5 km    ratio 2.47    issues 0

  long ping-pong (fires)
    route     26.1 km    mst 10.6 km    ratio 2.45    issues 1: stop order backtracks excessively

  train split (valid)
    route    370.3 km    mst 370.3 km   ratio 1.00    issues 0

  meal detour
    route     14.1 km    mst  7.4 km    ratio 1.91    issues 1: meal Remote lunch is 7 km from its nearest activity

  missing coords
    route      0.0 km    mst  0.0 km    ratio n/a     issues 1: Ueno Park is missing a usable coordinate
```

`train split` 那条值得单独说：路线 370.3 公里，最小生成树也是 370.3 公里，ratio 1.00。因为 `train` 把它切成两个区，东京那两点、京都那两点各自校验，跨城那段不参与计算。如果没这个切分，这一条会被判为「相距 370 公里的两个景点」。

现在看那个漏检：`east-west ping-pong` 的 ratio 是 **2.47**，超过 2.2 的阈值，却没报错。

原因是 `traveled > 25` 这个绝对长度下限。23.4 公里没到 25，所以虽然比值超标，规则不触发。我把同一形状放大（`long ping-pong`，26.1 公里）后立刻抓到了。

这是个真实的设计取舍，不是 bug：加绝对下限是为了避免「两个相邻街区走反方向」这种小尺度也被判折返——3 公里的路线用 6 公里的树走完，ratio 也是 2，但完全合理。代价是 22-25 公里这个区间成了规则的盲区。

成本方面，这四条检查便宜到可以忽略：

```text
validator cost  (10000 iterations x 6 fixtures)
  compact (valid)          mean 0.004 ms
  east-west ping-pong      mean 0.002 ms
  long ping-pong (fires)   mean 0.002 ms
  missing coords           mean 0.000 ms

worst case: 16 days x 6 items, one cluster
  mean 0.078 ms   (16 days x C(6,2)=15 pairs = 240 span checks)
```

最坏情况（16 天、每天 6 条、全部同区）0.078 毫秒。也就是说，为了挡住一次要花几十秒和 10 积分生成的行程，多花的计算成本是万分之一毫秒级——**校验器永远不该省**。

失败时的处理也很关键。不是直接报错给用户，而是带着具体原因重试一次：

```typescript
for (let attempt = 0; attempt < 2; attempt += 1) {
  ...
  const plan = normalizePlan(parseJsonText(output), expectedDays)
  const issues = geographicIssues(plan)
  if (issues.length) throw new Error(`Geographic validation failed: ${issues.join('; ')}`)
  return plan
} catch (error) {
  lastError = error
  if (attempt === 0) {
    const feedback = error instanceof Error ? error.message : 'The previous response was invalid'
    attemptPrompt = `${prompt}\n\nThe previous draft was rejected. Return a completely new JSON response that fixes this feedback, especially by using compact same-day areas and correct coordinates:\n${feedback}`
    await new Promise((resolve) => setTimeout(resolve, 1200))
  }
}
```

把 `Day 1: adjacent stops are too far apart (Ueno Park to Shinjuku Gyoen is 11 km)` 这样的原话塞回提示词，模型第二次通常能自己挪对。这是整套设计里最有 leverage 的一处：**校验器的输出直接变成下一轮的输入**。

单块超时 210 秒，重试前等 1.2 秒。等待是为了避免连续两次撞上同一个瞬时故障。

## 积分：扣在生成之后，不是之前

一次生成 10 积分。扣减的位置很讲究——放在生成成功之后，用条件 UPDATE：

```typescript
const charge = await env.DB.prepare('UPDATE users SET credits = credits - ? WHERE id = ? AND credits >= ?')
  .bind(costCredits, user.id, costCredits).run()
if (!charge.meta.changes) {
  await sendSse(writer, 'error', { error: locale.credits, credits: user.credits })
  return
}
```

`WHERE credits >= ?` 是原子性的余额检查。两个人同时点生成，余额 10 积分，只有一个人的 UPDATE 会命中——另一个 `changes` 为 0，拿到积分不足的提示。这是一个典型的「把并发控制交给数据库」的写法，比先 SELECT 再 UPDATE 安全。

然后流水和行程在同一个 batch 里写：

```typescript
await env.DB.batch([
  env.DB.prepare("INSERT INTO credit_ledger (id, user_id, delta, kind, reference) VALUES (?, ?, ?, 'plan_generation', ?)").bind(id(), user.id, -costCredits, planId),
  env.DB.prepare('INSERT INTO plans (id, user_id, request_json, response_json, cost_credits) VALUES (?, ?, ?, ?, ?)').bind(planId, user.id, JSON.stringify({...}), JSON.stringify(plan), costCredits),
])
```

D1 的 `batch` 是事务性的。所以「扣了积分但没存行程」这种最坏情况不会发生。

进入生成前的余额预检依然保留：

```typescript
if (user.credits < costCredits) return json({ error: locale.credits, credits: user.credits }, 402)
```

注意这里是 `json(...)` 而不是 SSE——连流都不开，直接 402。先拦一次省掉一次模型调用，后面那次条件 UPDATE 才是真正的防线。

`credit_ledger` 的 `kind` 是白名单约束：

```sql
kind TEXT NOT NULL CHECK (kind IN ('signup_bonus', 'plan_generation', 'recharge', 'refund'))
```

后来加邀请奖励时，这张表被重建了一次（`credit_ledger_new` → rename），因为 SQLite 不支持直接改 CHECK 约束。这个迁移写法值得记一笔：建新表、搬数据、删旧表、改名、重建索引，五步。

## 认证：token 存哈希，IP 只能注册一次

密码用 PBKDF2，10 万次迭代：

```typescript
export async function hashPassword(password: string, salt: string) {
  const source = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' },
    source, 256,
  )
  return toHex(bits)
}
```

session token 是两段 UUID 拼起来，但**数据库只存 SHA-256**：

```typescript
export async function createSession(db: D1Database, userId: string) {
  const token = `${id()}${id().replaceAll('-', '')}`
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
  await db.prepare('INSERT INTO sessions (id, token_hash, user_id, expires_at) VALUES (?, ?, ?, ?)')
    .bind(id(), await digest(token), userId, expiresAt).run()
  return token
}
```

于是库被拖走也拿不到可用 token。校验时同样先 `digest` 再查：

```typescript
const row = await db.prepare(`
  SELECT users.id, users.email, users.display_name AS displayName, users.credits, users.invite_code AS inviteCode
  FROM sessions JOIN users ON users.id = sessions.user_id
  WHERE sessions.token_hash = ? AND sessions.expires_at > ?`
).bind(await digest(token), new Date().toISOString()).first<User>()
```

过期判断放在 SQL 里（`expires_at > ?`），不是取出来再比。这样索引能用上，也不会返回过期行。

注册有一道很硬的限制——**一个 IP 只能注册一次**：

```typescript
const ipHash = ip ? await digest(`routewise-registration:${ip}`) : null
if (ipHash) {
  const existingIp = await env.DB.prepare('SELECT id FROM users WHERE registration_ip_hash = ? LIMIT 1').bind(ipHash).first()
  if (existingIp) return json({ error: '当前网络已注册过账户，每个 IP 仅限注册一次' }, 409)
}
```

`registration_ip_hash` 是 sha256，不存明文 IP。`digest` 里拼了固定前缀 `routewise-registration:`，避免和别处对同一 IP 的哈希撞上。

唯一索引在数据库层再兜一次：

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_registration_ip
  ON users(registration_ip_hash)
  WHERE registration_ip_hash IS NOT NULL;
```

`WHERE ... IS NOT NULL` 这个部分索引很重要。没有它，所有没拿到 IP 的用户（`NULL`）在唯一索引下会互相冲突——SQLite 里多个 NULL 不冲突，但显式声明更安全。

注册那段的错误映射也值得抄：

```typescript
} catch (error) {
  const message = String(error)
  if (message.includes('users.email')) return json({ error: '该邮箱已注册，请直接登录' }, 409)
  if (message.includes('registration_ip_hash') || message.includes('idx_users_registration_ip')) return json({ error: '当前网络已注册过账户，每个 IP 仅限注册一次' }, 409)
  if (message.includes('idx_referrals_daily_reward_slot')) return json({ error: '该邀请人今日奖励名额刚刚用完...' }, 429)
```

它承认了一件不优雅但真实的事：并发下预检查会漏，最终一致性由唯一约束保证。把约束名映射成用户能看懂的话，比抛一个 500 好。

## 邀请与积分：一张 daily reward slot 的赌桌

邀请奖励最容易做成刷分漏洞。这里的约束是一个唯一索引：

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_referrals_daily_reward_slot
  ON referrals(inviter_user_id, reward_day, reward_slot);
```

`reward_slot` 限定在 1-3：

```sql
reward_slot INTEGER NOT NULL CHECK (reward_slot BETWEEN 1 AND 3)
```

于是「同一邀请人、同一天、最多三次奖励」由数据库保证，而不是靠应用层数数：

```typescript
const dailyRewards = inviter
  ? await env.DB.prepare('SELECT COUNT(*) AS count FROM referrals WHERE inviter_user_id = ? AND reward_day = ?').bind(inviter.id, rewardDay).first<{ count: number }>()
  : null
const rewardSlot = (dailyRewards?.count || 0) + 1
if (inviter && rewardSlot > 3) return json({ error: '该邀请人今日奖励已达 3 次上限...' }, 429)
```

预检查是为了给出友好提示。真正的护栏是那份唯一索引——两个人同时用同一个邀请码注册、都算出 `slot = 3`，第二个人的 INSERT 会撞索引，走 catch 分支返回 429。

同一个 batch 里把四件事一起写：

```typescript
const statements = [
  env.DB.prepare('INSERT INTO users (...) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(userId, email, await hashPassword(password, salt), salt, initialCredits, userInviteCode, inviter?.id || null, ipHash),
  env.DB.prepare("INSERT INTO credit_ledger (id, user_id, delta, kind, reference) VALUES (?, ?, 10, 'signup_bonus', 'signup')").bind(id(), userId),
]
if (inviter) {
  statements.push(
    env.DB.prepare('UPDATE users SET credits = credits + 10 WHERE id = ?').bind(inviter.id),
    env.DB.prepare("INSERT INTO credit_ledger ... 10, 'referral_bonus', ?").bind(id(), inviter.id, userId),
    env.DB.prepare("INSERT INTO credit_ledger ... 10, 'referral_bonus', ?").bind(id(), userId, inviter.id),
    env.DB.prepare('INSERT INTO referrals (...) VALUES (?, ?, ?, ?, 10, ?, ?)').bind(id(), inviter.id, userId, submittedInviteCode, rewardDay, rewardSlot),
  )
}
await env.DB.batch(statements)
```

被邀请人拿 20（10 基础 + 10 奖励），邀请人拿 10。三个 ledger 条目都在同一个事务里，账永远不会出现「加了积分但没有流水」。

积分余额本身有非负约束：

```sql
credits INTEGER NOT NULL DEFAULT 10 CHECK (credits >= 0)
```

这和前面那个 `WHERE credits >= ?` 是双保险。应用层逻辑错了，约束会直接拒绝。

## 支付：Stripe 签名与 D1 的条件写入

充值有两个通道：Stripe 和微信。两者都是 webhook 回调。

Stripe 的签名校验是手写的 HMAC-SHA256：

```typescript
async function verifyStripeSignature(body: string, signature: string | null, secret: string) {
  if (!signature) return false
  const values = signature.split(',').map((part) => part.split('=', 2))
  const timestamp = values.find(([key]) => key === 't')?.[1]
  const signatures = values.filter(([key]) => key === 'v1').map(([, value]) => value)
  if (!timestamp || signatures.length === 0) return false
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const expected = toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${body}`)))
  return signatures.some((candidate) => equal(expected, candidate))
}
```

签名串里可能有多条 `v1`（Stripe 在密钥轮换期间会同时签两版），所以是 `signatures.some(...)`。比较用常数时间的 `equal`：

```typescript
function equal(a: string, b: string) {
  if (a.length !== b.length) return false
  let difference = 0
  for (let index = 0; index < a.length; index += 1)
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index)
  return difference === 0
}
```

真正的防重复支付在 `settleRechargeOrder` 里。三条 SQL 全部带 `status = 'pending'` 条件：

```typescript
if (!order || order.status !== 'pending' || order.provider !== provider) return false
if (provider === 'stripe' && order.checkout_reference !== providerReference) return false

// D1 batch is transactional. Every statement is conditional on the order still being pending.
await db.batch([
  db.prepare("INSERT INTO credit_ledger (id, user_id, delta, kind, amount_cny, reference) SELECT ?, user_id, credits, 'recharge', amount_cny, ? FROM recharge_orders WHERE id = ? AND status = 'pending'").bind(id(), providerReference, orderId),
  db.prepare("UPDATE users SET credits = credits + (SELECT credits FROM recharge_orders WHERE id = ? AND status = 'pending') WHERE id = (SELECT user_id FROM recharge_orders WHERE id = ? AND status = 'pending')").bind(orderId, orderId),
  db.prepare("UPDATE recharge_orders SET status = 'paid', provider_reference = ?, paid_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'").bind(providerReference, orderId),
])
```

注意第一条 INSERT 用的是 `SELECT ... FROM recharge_orders WHERE ... status = 'pending'`——如果订单状态已经不是 pending，它 select 出零行，ledger 也就不写。第二条同理，`credits + (SELECT ...)` 在这种情况下加的是 `NULL`，UPDATE 影响零行。

**幂等性完全由「每条语句都带 pending 条件」保证**，而不是靠应用层加锁。Stripe 重复投递同一个事件，第二次三条语句全部匹配零行，余额不变。这是 D1/SQLite 这类单机数据库上非常干净的写法。

## 用一份 mock 测出 SSE 最脏的边界

小程序端的测试比后端更值得抄，因为它盯的是 SSE 最容易被忽略的那一类 bug：**字节流被切在多字节字符中间**。

小程序的 `wx.request` 在 `enableChunked: true` 时分块回调，配合 `responseType: 'arraybuffer'` 就能拿到原始字节：

```javascript
task = wx.request({
  url: `${config.apiBase}/api/plan`,
  method: 'POST',
  data: payload,
  responseType: 'arraybuffer',
  enableChunked: true, // 基础库 2.20.1+ 支持流式接收
  header: { 'content-type': 'application/json', Accept: 'text/event-stream', ...authHeader() },
  ...
})

task.onChunkReceived(({ data }) => {
  if (settled) return
  parser.feed(decoder.decode(data, { stream: true }))
})
```

关键在 `stream: true`。分块的边界是任意的，一段中文 SSE 可能被切在多字节字符中间；`stream: true` 让解码器保留不完整序列等下一块补齐。少了这个参数，中文就会零星变成乱码。

测试构造了一个真实的跨边界切割：

```javascript
if (url.endsWith('/api/plan')) {
  // SSE 流式模拟：真实字节分片，跨 UTF-8 字符边界切割
  const encoder = new TextEncoder()
  const full =
    'event: status\ndata: {"message":"已连接 AI，正在规划详细行程"}\n\n' +
    'event: delta\ndata: {"delta":"正在生成北京"}\n\n' +
    'event: delta\ndata: {"delta":"故宫行程"}\n\n' +
    `event: complete\ndata: ${JSON.stringify({ plan: MOCK_PLAN, credits: 0, planId: 'mock-plan-1' })}\n\n`
  const bytes = encoder.encode(full)
  const cut = 100 // 第 100 字节处切割，跨越中文多字节字符
  const chunk1 = bytes.slice(0, cut)
  const chunk2 = bytes.slice(cut)
```

第 100 字节这个位置是算过的，注释里明说「跨越中文多字节字符」。然后断言不是「解析成功」，而是解析出的内容必须**逐字相等**：

```javascript
assert(deltas === 10, `delta 累计 10 字（正在生成北京 6 + 故宫行程 4），实际 ${deltas}`)
```

10 这个数字是写死的期望值。如果解码器在边界处丢了半个汉字，这里会变成 11 或者 9。一个用来测 UTF-8 边界问题的测试，自己必须不依赖「大概对」。

第二组断言测的是中断：

```javascript
const stream2 = streamPlan({ cities: ['北京'], days: 2 }, {})
stream2.abort()
await sleep(50)
assert(lastPlanTask && lastPlanTask._aborted === true, 'abort 中断底层请求')
```

而 mock 循环到 40 毫秒时才调 `opts.success(...)`，并且先查 `if (task._aborted) return`。所以这条断言真正验证的是：abort 确实把底层的 request 任务取消了，而不是只置了一个前端标志位。

第三组是回归测试，标题直接写着历史：

```javascript
console.log('\n🧪 T5 SSE 请求 401（回归：streamPlan 也要清会话）')
state.setSession('stale-token', { id: 'u1' })
mode = 'plan-401'
const s401 = await streamPlan({ cities: ['北京'], days: 2 }, {}).promise.catch((e) => e)
mode = 'normal'
assert(s401.status === 401, 'SSE 401 reject 带 status')
assert(state.token === null, 'SSE 401 后会话被清除')
assert(unauthorized === 2, 'SSE 401 触发全局回调')
```

这条测试的存在本身就是结论：**SSE 接口漏了 401 处理，是真实发生过的 bug**。JSON 请求走统一封装早就处理了 401，但 SSE 是另一条代码路径，它自己写了解析，也就自己漏了清理会话。回归测试把这个坑钉死了。

还有一条容易被忽略但很重要的断言：

```javascript
assert(lib.MAX_CITIES === 8 && lib.MIN_DAYS === 2 && lib.MAX_DAYS === 16 && lib.PLAN_COST_CREDITS === 10, '常量与后端约束一致')
```

它没法真的去比对后端（小程序测试不该联网），但它把数字写死在测试里。于是当有人改后端约束而忘了改前端时，至少测试会提醒一次「这里有一份约定」。这是前面说的那个「一致性靠注释维持」的脆弱点的部分补偿。

## 微信登录：一个必须由数据库解决的竞态

邮箱注册可以靠「先查再插」，因为用户手输邮箱不会在同一毫秒发生两次。微信登录不行：小程序调用 `wx.login` 拿 code，后端换 `openid`，然后「有用户就登录、没有就建号」。同一个用户连续点两次「登录」，两个请求会同时进入这段逻辑，同时发现「没有用户」，同时尝试插入。

代码里把这件事故意留在了 catch 分支：

```typescript
try {
  await env.DB.batch([
    env.DB.prepare(
      'INSERT INTO users (id, email, password_hash, password_salt, credits, invite_code, openid) VALUES (?, ?, ?, ?, 10, ?, ?)',
    ).bind(userId, email, passwordHash, passwordSalt, userInviteCode, openid),
    env.DB.prepare(
      "INSERT INTO credit_ledger (id, user_id, delta, kind, reference) VALUES (?, ?, 10, 'signup_bonus', 'wechat_signup')",
    ).bind(id(), userId),
  ])
  user = { id: userId, email, displayName: null, credits: 10, inviteCode: userInviteCode }
} catch (error) {
  // The same openid can arrive concurrently. Reuse the row created by the winning request.
  user = await findUser(env.DB, openid)
  if (!user) throw error
}
```

注释写得很清楚：**同一个 openid 可能并发到达，复用赢的那个请求建立的行**。第二次插入撞唯一索引失败，不去报错，而是回去读那一行。

这个写法有几个值得学的点。第一，它没有引入分布式锁或幂等键，护栏是 `openid` 上的唯一索引：

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_openid ON users(openid) WHERE openid IS NOT NULL;
```

第二，它把「并发」当成正常路径而不是异常路径。失败后不重试整个流程，只补读一次。第三，如果补读也拿不到，说明失败原因不是并发（可能是数据库真的挂了），这时才抛出原错误——`if (!user) throw error` 这一行保留了对真实故障的可见性。

微信场景还有一个绕不过去的事实：用户没有邮箱。所以插入时用基于 openid 的占位邮箱：

```sql
-- 微信用户没有邮箱，插入时使用基于 openid 的占位邮箱（wx_<hash>@wx.local）。
ALTER TABLE users ADD COLUMN openid TEXT;
```

占位邮箱走的是同一个 `users.email` 唯一约束，于是「邮箱用户」和「微信用户」共用一张表、一套积分、一套会话。`password_hash` 也填了随机值而不是留空：

```typescript
const passwordHash = await digest(`${id()}:${openid}`)
```

因为 `password_hash TEXT NOT NULL`。这两处都是同一类决定的体现：**不为微信用户单开一条通道**。代价是表里有一些语义不精确的字段，收益是所有下游逻辑（积分、充值、邀请）完全复用。

微信侧的凭证校验也保留了平台服务不可用和凭证失效两种语义：

```typescript
if (codeSession.errcode || !codeSession.openid) {
  console.warn('WeChat rejected login code', codeSession.errcode, codeSession.errmsg)
  return json({ error: '微信登录凭证已失效，请重试' }, 401)
}
```

`errcode` 是微信明确拒绝（code 已用过或过期），返回 401 让客户端重新 `wx.login`；而 fetch 失败返回 502，让客户端稍后再试。两者对用户来说都是「登录失败」，但前端可以据此决定是立刻重试还是提示稍后。把可重试和不可重试分开，是所有对接第三方平台的接口都该做的事。

## 事件契约：四种事件，各自只做一件事

SSE 的四种事件不是随意定的，它们对应客户端的四个不同反应：

| 事件 | 触发时机 | 客户端反应 |
|---|---|---|
| `status` | 接口通过校验、准备调模型 | 显示「已连接 AI」 |
| `delta` | 模型每吐一段文本 | 追加到进度区，显示已接收字数 |
| `complete` | 校验通过 + 扣积分 + 落库完成 | 用完整 plan 渲染，跳转结果页 |
| `error` | 任意环节失败 | 展示错误文案，不解锁结果页 |

关键在于 `complete` 的时机：它不是「模型生成完了」，而是「校验通过、积分扣了、行程落库了」。所以客户端收到 `complete` 时，数据一定是可复现的——刷新页面还能从 `/api/account/plans/:id` 拿到同一份。

这也是为什么扣积分放在校验之后。如果先扣积分再校验，一个被地理校验拒绝的行程会让用户付费却拿不到结果；如果扣积分在返回 `complete` 之前但校验之后，最坏情况是「模型跑完了、校验过了、扣积分时余额不足」，这时客户端收到的仍然是 `error` 而不是一个假的成功。

`delta` 的用途也需要克制。它只用来做进度展示，客户端不应该尝试解析中间态的 JSON——因为一份 JSON 被切成十段之后，任何一段单独看都不是合法 JSON。前端展示的是「已接收 N 字」，而不是尝试增量渲染行程卡片。这个约束避免了整整一类「半个 JSON 解析失败」的 bug。

顺带说一个 SSE 的实践细节：每个事件写成 `event: X\ndata: {...}\n\n`，双换行是事件分隔符。解析器必须按「空行」切事件而不是按行处理，否则 `data:` 多行续写会被错误合并。后端只有单行 data，但解析器按协议实现，未来加多行也不用改。

## 前端：从 PosterBook 到小程序的两套渲染

Web 端和小程序共用同一份后端协议，但渲染层是两套。

Web 端的地图海报是 `PosterBook.tsx`，38 KB，把行程按日着色画成 1800px 宽的海报；打印版是 `PrintDoc`，靠 `window.print()` 导出 PDF。

小程序侧则把纯逻辑单独抽出来，让页面和测试共用：

```javascript
// 规划与行程展示的纯逻辑层：payload 构造、天数校验、类型映射、行程拍平、摘要格式化
// 从原 canvas 场景中抽出，供页面（form/result）复用，且可被测试直接驱动
// 约束与后端一致：days 2-16、最多 8 城
```

`flattenPlan` 把嵌套结构拍平成「天头部 + 条目」的混合列表，视图和测试都消费同一个函数。这是小程序里值得坚持的一条：**WXML 不做逻辑**，所有可测的计算放到 `js/lib/` 里。

网络层统一封装，包括 SSE 解析：

```javascript
// 网络层：wx.request 封装（自动带 token、统一错误处理）+ SSE 流式解析
// 后端协议（与原项目 functions 一致）：
//   - JSON 接口：Authorization: Bearer <token>
//   - /api/plan：POST，SSE 流，事件 status / delta / complete / error（heartbeat 等未知事件忽略）
```

「heartbeat 等未知事件忽略」这一条与后端的 30 秒心跳对应。两端协议一致，靠的是注释和 `miniprogram/test/` 下那五个测试文件。

小程序也能真流式——`enableChunked` + `onChunkReceived` 逐块喂给解析器，和 Web 端的体验是一致的。差别只在实现：Web 端用 `response.body.getReader()`，小程序用回调。两套解析器各自手写，各自需要那份跨 UTF-8 边界的测试。

## 成本：一次生成的账能算到分

一个 AI 功能能不能上线，往往不取决于效果，而取决于「每次调用的成本能不能预测」。这套系统把成本做成了三个可算的数。

第一，积分是硬网关。一次生成 10 积分，注册送 10，邀请送 10-20。也就是说新用户免费额度是一次生成，邀请一个人多一次。

第二，模型调用是可枚举的。一次生成最多几块、每块最多重试一次——这个上界在设计时就定死了：

```typescript
const chunks: number[][] = []
for (let start = 1; start <= input.days; start += 4) {
  chunks.push(Array.from({ length: Math.min(4, input.days - start + 1) }, (_, index) => start + index))
}
```

16 天 → 4 块 → 分一组并发 → 最多 4 次模型调用。每块最多 2 次尝试，所以最坏情况 8 次调用。每次 `max_output_tokens: 18_000`。

把这三个数乘起来，任何一次生成的最坏成本在按下按钮之前就算得出来。这在做 AI 功能时非常关键，因为模型调用是按 token 计费且方差很大的东西。**一个成本不可预测的功能，运营上等于不可用。**

第三，成本超支有硬上限。每块 210 秒超时：

```typescript
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 210_000)
```

210 秒这个数字不是随手取的。它必须小于 Pages Functions 的执行上限，同时要覆盖最慢的一块（一天五六条、每条带坐标和详细说明）。超时后 `AbortController` 中断 fetch，进入 catch 分支，走重试或失败路径——不会让一个卡住的连接拖垮整个请求。

这也解释了为什么积分扣在生成成功后：一次因为模型卡住而失败的生成，用户没拿到东西，不该付钱。代价是项目承担了无效调用，所以 210 秒超时和最多 2 次尝试这两道闸必须严格。

充值侧的设计也是同一个思路。订单表同时记 `amount_cny` 和 `credits`，而不是「金额 ÷ 单价」在运行时算：

```sql
amount_cny INTEGER NOT NULL CHECK (amount_cny > 0),
credits INTEGER NOT NULL CHECK (credits > 0),
```

原因很实际：价格会变。如果按「1 元 = 10 积分」在运行时换算，涨价那天所有历史订单的积分都会跟着变，账就对不上了。把兑换率冻结在订单行里，是一张账本该有的性质。

后来加的 `charged_amount` / `charged_currency` 两列是同一个道理的延伸——Stripe 实际扣的金额和币种可能和订单标价不同（汇率、税、折扣），账本必须记「实际扣了多少」，而不是「我们以为扣了多少」。

## 多语言：三套文案与一个运行时转换器

界面支持简中、繁中、英文，但它没有做三套静态文案。做法是：只写简中和英文两份，繁中由前端在运行时转换。

```text
- 三语界面：简体中文 / 繁體中文 / English，语言偏好存 localStorage（routewise_language）
- 繁中实时转换：前端懒加载 opencc-js（cn → tw Converter），城市名与界面文案统一转换
```

这个选择的收益很直接：文案维护量从三份降到两份，而且繁中永远不会出现「某个新文案忘了翻译」的情况——它总是简中的忠实转换。代价是首屏要加载一个转换器，所以是懒加载。

后端的错误文案也是这样组织的，但它选择了另外一条路——三份写全：

```typescript
const messages: Record<Language, { login: string; invalid: string; city: string; credits: string; unavailable: string; started: string }> = {
  'zh-CN': { login: '请先登录后再规划', invalid: '请求格式无效', city: '请至少选择一个城市', ... },
  'zh-TW': { login: '請先登入後再規劃', invalid: '請求格式無效', city: '請至少選擇一個城市', ... },
  en: { login: 'Sign in before creating a plan', invalid: 'Invalid request', city: 'Choose at least one city', ... },
}
```

为什么两处不同？因为后端文案会在 SSE 事件里、在 402 响应里、在日志里出现，运行时不方便依赖一个前端库。而且它只有六个字段——三份写全的成本很低。

这里有个细节值得学：繁中和简中的差异不只是字形。`請先登入後再規劃` 和 `请先登录后再规划` 是同一句话的不同写法，不是简繁映射能生成的（「登入」vs「登录」是地区用语差异）。所以即使前端有 opencc，后端这几句也必须人手写。

币种跟着语言联动，但单位符号本地化在前端做：

```typescript
const currency: Currency = body.currency === 'TWD' || body.currency === 'USD' ? body.currency : 'CNY'
```

后端只认三个币种代码，其余一律回退 CNY。预算的千分位、符号位置、小数位全部交给前端——因为那是展示层的事，后端只需要在提示词里告诉模型「总预算 8000 CNY」。

## 边界：为什么这些检查不能替代人工

把地理校验器当成「内容正确性」的证明，是这套设计最容易被误读的地方。它实际能保证的事情很窄。

它能保证的：坐标存在、坐标合法、点与点之间的距离符合四个阈值、路线没有明显折返、跨城有显式的 `train` 条目。这五件事都是**几何事实**，不依赖任何外部知识。

它不能保证的，恰恰是旅行规划里最要紧的东西：

- 浅草寺周二是否开门、是否在修缮。
- 那家拉面店还在不在，还是不是同一个地址。
- 从 A 到 B 走路 10 分钟在雨季是否现实。
- 预算 ¥8000 在樱花季够不够。
- 某个活动是否需要提前一个月预约。

所以提示词里那句「Prices, schedules, opening hours and availability are estimates, never live-verified facts」不是免责声明，它是这套系统的性质说明。校验器管形状，模型管内容，事实核对仍然要人来做。

这也是为什么输出里保留了 `note` 字段，并且要求它写「reservations, opening-hour verification and practical warnings」。模型被要求主动告诉用户「这里需要你自己确认」，而不是给出一个看似确定的答案。

对比一下两种产品定位就很清楚：如果目标是「给用户一份可以照着走的行程」，那这套东西还不够，需要接入真实 POI 数据和营业时间；如果目标是「给用户一份可以改的初稿」，那它已经到位了——40 秒出一份结构严谨、路线合理、覆盖每天五六个节点的草稿，人只需要核对事实和调整偏好。后者才是这个规模的项目该做的事。

认清这个边界，比再堆一层校验更有价值。因为「再多校验一层」会让成本翻倍，而收益可能是零——校验器不知道的，它永远不会知道。

## 定位数据：251 个城市 JSON 与一个边缘搜索代理

城市选择要快，且要能离线。所以城市数据在构建期就生成成静态 JSON：

```text
tools/build-cities.mjs        build-world-cities.mjs
generate-locations.mjs         cn-city-coords.json
world-cities.json              world-provinces.json
```

`public/locations/` 下 251 个文件，前端按需加载。这样首屏不需要等任何一个 API。

但用户可能想搜一个不在列表里的地方。于是有一个边缘代理，转发到 Open-Meteo 的地理编码：

```typescript
const upstreamUrl = new URL("https://geocoding-api.open-meteo.com/v1/search")
upstreamUrl.searchParams.set("name", query)
upstreamUrl.searchParams.set("count", "20")
```

两个细节。第一，输入有严格长度和格式限制，避免变成开放代理：

```typescript
const query = (url.searchParams.get("q") || "").trim().slice(0, 80)
const requestedCountry = (url.searchParams.get("country") || "").toUpperCase()
const country = /^[A-Z]{2}$/.test(requestedCountry) ? requestedCountry : ""
if (query.length < 2) return json({ results: [] })
```

`country` 必须匹配两位大写字母，否则丢弃——不把它拼进任意字符串。URL 也是固定 `host + 固定 path`，不接受外部传入的地址。

第二，为了让繁中/简中界面上的地名也有英文对照，同一份查询请求两次：

```typescript
const englishRequest = language === 'en' ? null : fetch(englishUrl, { headers: { Accept: "application/json" } })
const [response, englishResponse] = await Promise.all([localizedRequest, englishRequest])
```

然后按 id 合并：

```typescript
const englishNames = new Map((englishPayload.results || []).map((place) => [place.id, place.name]))
...
sourceName: englishNames.get(place.id) || place.name,
```

一次往返拿两种语言，靠 `Promise.all` 并行。结果缓存一小时：

```typescript
headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
```

## 仍然存在的边界

把整条链路摊开后，边界也很清楚：

- **校验器只认距离，不认语义**。它不知道「浅草寺周二闭馆」，也不知道「这家店已经倒闭」。它能保证路线不折返，保证不了内容真实。
- **22-25 公里是回头路规则的盲区**。上面实测里那条 ratio 2.47 却没报错的行程就是例子。绝对下限是必要的，但边界上的形状会漏。
- **坐标与地点名的一致性没有校验**。模型给出「浅草寺」+ 新宿的坐标，两点都能通过所有距离检查——因为校验器只看点之间的距离，不知道名字对不对。
- **城市分配是均分**。3 城 7 天必然 3/2/2，不考虑「东京值得多待两天」这种偏好。
- **积分扣在生成后**，所以一次耗时的失败生成不扣分。这对用户友好，但模型的无效调用成本全由项目承担。
- **前端与后端的参数约束各写一份**。`MAX_CITIES`、`MAX_DAYS`、10 积分在 `plan.ts` 和 `miniprogram/js/lib/plan.js` 里各有一处，靠注释对齐。
- **两套 SSE 解析器**。Web 端用 `getReader()`，小程序用 `enableChunked` 回调，各自手写。逻辑等价但代码不共享，UTF-8 边界那类 bug 要在两边分别测。
- **重试只有一次**。同一块连续两次失败，整次生成报错，10 积分不扣但用户白等了两分多钟。

这些不是待办列表，是这套实现当前的形状。

## 小结

如果只记三件事：

1. **能算的不要问模型**。城市分配、日期、标题全部服务端算好。模型只负责「这三天在东京怎么玩」，其余都是确定性代码。这一条把最大的不确定性来源直接移出了模型。
2. **把校验规则写进契约**。15 / 22 / 6 公里同时出现在提示词和校验器里，模型提前知道会被怎么量。校验失败时把原话塞回去重试——校验器的输出就是下一轮的输入。
3. **不用锁的地方就不要锁**。积分扣减靠条件 UPDATE，支付幂等靠每条语句都带 `status = 'pending'`，邀请上限靠唯一索引。三次都是「把不变量交给数据库」。

至于 SSE 流式、4 天切块、最小生成树折返检测、IP 哈希限流——它们都是同一件事的不同侧面：**让一次几十秒的模型调用变成一个有进度、有验证、有账可查的产品功能**。这类功能的验收标准不是「第一次生成看起来对」，而是「生成一百次，有几次画在地图上是错的，错的那几次用户有没有被告知」。

项目地址：[github.com/zhoujungis/trip-planning](https://github.com/zhoujungis/trip-planning)。同周发布的另一篇拆解是 [NanoQA：一套测试管理系统的四道硬边界](/article/nanoqa-versioned-quality-loop/)。
