---
title: "NanoDB：Go 嵌入式文档数据库"
slug: nanodb
cover_image: /photos/nanodb-cover.png
date: 2026-10-26
tags: ["Go", "数据库", "存储引擎", "项目实战"]
---

> 适用读者：想弄清「一个数据库从 WAL 到事务是怎么串起来」的后端工程师；准备自己写 toy DB 或嵌入式存储的人；在 SQLite / LevelDB 系 / MongoDB 之间纠结选型的人
> 结论先行：NanoDB 是一个**零第三方依赖**的 Go 嵌入式文档数据库——JSON 文档模型、快照 + WAL 持久化、二级/文本/地理索引、乐观事务、原子批量、SQL 只读子集，全部装进 34 个 Go 文件：源码 6,592 行、测试 3,199 行，合计 9,791 行。它把「数据库的每个部件都可以很朴素」这件事演示得非常清楚：WAL 就是 JSON Lines 文件，事务就是集合快照加版本号校验，查询规划就是「挑候选集最小的索引」。读完这篇文章，你会知道这些部件各自的取舍在哪、坑在哪、什么场景下够用
> 阅读时间：约 38 分钟 | 难度：进阶 | 收获：一份可运行的架构地图 + 六个关键实现的源码级拆解 + 一张诚实的限制清单与选型对照表

**目录**

- 前言：为什么还值得写一个数据库
- 项目速览：它到底是什么
- 五分钟上手：三种入口与 Go 嵌入
- 架构与代码地图
- 数据模型：文档、集合与 `_id`
- 持久化核心：快照 + WAL
- 查询执行：一条 `find` 的流水线
- 索引系统：从二分定位到二元组分词
- 事务：集合粒度的乐观可串行化
- 原子批量：一条 WAL 记录装下一整批
- SQL 只读子集与聚合管道
- HTTP 服务：token、角色与事务会话
- 性能实测：数字与优化点
- 测试与工程质量
- 横向对比：它在坐标系的哪个位置
- 已知限制（诚实清单）
- 适用与不适用场景
- 结语

## 前言：为什么还值得写一个数据库

SQLite 有两百万行，LevelDB 是精巧的 LSM 教科书，MongoDB 是分布式系统的庞然大物。一个 2026 年的项目再写一个「数据库」，听起来像重复造轮子。

但造轮子的目的从来不是轮子本身。NanoDB 这个项目回答的是一组非常具体的问题：

- 一个支持事务的数据库，**最短路径**有多短？
- 「崩溃后不丢已提交数据」这件事，去掉所有工程黑话之后，剩下多少行代码？
- 文档模型 + 二级索引 + 乐观并发控制，这三者如何在一个内存数据结构上咬合在一起？

答案是：约一万行 Go，零第三方依赖，`go build` 一次就能跑。更重要的是，它的每个部件都可以被单个读者在一小时内读完——这在真实数据库里几乎不可能。读完 SQLite 的 pager 层需要多久？读完 RocksDB 的 compaction 又需要多久？

所以这篇文章的读法是双重的：**既把它当一个可用的工具看，也把它当一份「数据库部件解剖标本」看**。前者告诉你什么时候能用它，后者告诉你如果你自己要写，应该先写什么、后写什么、哪里必须一次做对。

## 项目速览：它到底是什么

NanoDB 是一个用 Go 编写的轻量级**嵌入式文档数据库**（NoSQL），当前版本 0.1.0。「嵌入式」意味着它没有独立的守护进程协议——它就是你进程里的一个库，同时附带 CLI、交互式 shell 和 REST 服务三种包装。

| 维度 | 情况 |
|---|---|
| 语言与版本 | Go 1.22+，`go.mod` 单模块 `nanodb` |
| 第三方依赖 | 0 个（纯标准库，无 cgo） |
| 代码规模 | 34 个 `.go` 文件、9,791 行（源码 6,592 + 测试 3,199，实测统计） |
| 数据模型 | 集合 → JSON 文档，`_id` 为非空字符串 |
| 持久化 | `snapshot.json`（全量）+ `wal.log`（增量，JSON Lines） |
| 并发 | 单进程多 goroutine 安全；数据目录操作系统级独占锁 |
| 入口 | 一次性 CLI 命令、交互式 shell、REST 服务 |
| 测试 | `engine` / `server` 覆盖率约 80%，`cmd` 约 75% |
| 定位 | 中小规模数据、工具类项目、桌面/边缘场景 |

一句话概括它的取舍：**把「单机、内存驻留、JSON 原生」做到位，明确放弃分布式**。不支持副本、分片、集群，同一数据目录同一时间只允许一个进程打开——这些不是没做完，是划在边界外的东西，README 的「已知限制」一节把它们全部列了出来。

一个容易被忽略但很能说明气质的细节：`go build -o bin/nanodb ./cmd/nanodb` 不需要网络，因为它没有任何依赖需要下载。在一个依赖树动辄几百 MB 的时代，这件事本身就值得写进简介。

## 五分钟上手：三种入口与 Go 嵌入

### 一次性 CLI

```bash
go build -o bin/nanodb ./cmd/nanodb

# 插入（自动生成 _id）
./bin/nanodb -db ./data put users '{"name":"Alice","age":30}'

# 条件查询 + 排序 + 分页
./bin/nanodb -db ./data find users '{"age":{"$gte":18}}' -sort age:-1 -limit 10

# 更新、统计、删除
./bin/nanodb -db ./data update users u2 '{"$inc":{"age":1}}'
./bin/nanodb -db ./data count users '{"age":{"$gt":20}}'
./bin/nanodb -db ./data delete users u2
```

所有命令成功时把结果以缩进 JSON 打到 stdout，失败时退出码为 1、错误以 `错误:` 前缀写 stderr——脚本里可以直接判断。

### 交互式 shell

不指定子命令就进入 shell，事务模式下提示符变成 `nano(tx)>`，直接退出或 EOF 会自动回滚未提交事务：

```text
$ ./bin/nanodb -db ./data
NanoDB 0.1.0 交互式 shell。JSON 参数请用单引号包裹。
nano> begin
事务已开始
nano(tx)> put users '{"name":"Bob"}'
nano(tx)> commit
事务已提交
```

### REST 服务

```bash
./bin/nanodb -db ./data serve -addr :8080 -token secret
curl -H 'X-NanoDB-Token: secret' localhost:8080/v1/users
```

三个入口共享同一套引擎能力，不是三套实现——`cmd/nanodb/main.go`（722 行）只做参数分发，`server/server.go`（764 行）只做路由与鉴权，真正的逻辑全部在 `engine/` 包里。这是第一个值得记住的架构决策：**入口很薄，引擎唯一**。

### Go 嵌入（本体用法）

对嵌入式数据库来说，CLI 和 REST 都是外挂，真正的本体是库调用：

```go
db, err := engine.Open("./data", &engine.Options{
    Sync:             true,        // 每次写入 fsync
    CompactThreshold: 4 << 20,     // WAL 超 4 MiB 自动压缩
})
if err != nil {
    panic(err)
}
defer db.Close()

doc, _ := db.Insert("users", map[string]any{"name": "Alice", "age": 30})
fmt.Println(doc["_id"])

docs, _ := db.Find("users", engine.Query{
    Filter: map[string]any{"age": map[string]any{"$gte": 18}},
    Sort:   []engine.SortField{{Field: "age", Desc: true}},
    Limit:  10,
})
fmt.Println(len(docs))
```

API 是平铺的方法表：`Insert / InsertMany / Get / Find / Count / Replace / Update / UpdateMany / Delete / DeleteMany / Batch / Aggregate / QuerySQL / CreateIndex / DropIndex / Compact / Stats / Close`，与 CLI 子命令一一对应。两个使用注意：

- 传 `nil`（或不传 Options）得到默认行为 `Sync: true`；显式传 `&engine.Options{}` 反而意味着**你选了** `Sync: false`——Go 的零值语义在这里有个小陷阱，README 特意点了出来。
- 一切读写返回副本，改返回值不会回写数据库；要改就走 `Update`/`Replace`。

## 架构与代码地图

```text
NanoDB/
├── cmd/nanodb/
│   └── main.go              # CLI 参数、命令分发、shell、serve、user 管理（722 行）
├── server/
│   ├── server.go            # REST 路由、事务会话（764 行）
│   ├── auth.go              # 鉴权、角色与集合白名单
│   └── users.go             # users.json 账号存储
├── engine/                  # 全部核心逻辑
│   ├── db.go                # 存储引擎、CRUD、WAL、快照、压缩（928 行）
│   ├── query.go             # 过滤编译、排序、Top-N、投影（585 行）
│   ├── index.go             # 单字段/复合索引、查询计划（804 行）
│   ├── text.go / geo.go     # 文本倒排索引、地理索引
│   ├── sql.go               # SQL 只读子集的词法、语法与执行（624 行）
│   ├── aggregate.go         # 聚合管道
│   ├── tx.go                # 显式事务
│   ├── batch.go             # 原子批量写入
│   ├── lock*.go             # 目录独占锁（Windows LockFileEx / Unix flock）
│   └── id.go / copy.go      # _id 生成、文档深拷贝
└── docs/
    └── transaction-isolation.md   # 事务隔离级别完整说明
```

依赖方向只有一条：`cmd` 和 `server` 依赖 `engine`，`engine` 不依赖任何人。没有接口层的抽象森林——`collection`、`index`、`Tx` 都是具体类型，因为只有一个实现，为「未来可能的第二个实现」预留接口是过度设计。

| 模块 | 行数 | 职责一句话 |
|---|---:|---|
| `engine/db.go` | 928 | 内存数据结构 + WAL + 快照压缩 + 目录锁 |
| `engine/index.go` | 804 | 索引结构与查询计划选择 |
| `server/server.go` | 764 | REST 路由与 HTTP 事务会话 |
| `cmd/nanodb/main.go` | 722 | CLI 与 shell |
| `engine/sql.go` | 624 | SQL 只读子集的三段式实现 |
| `engine/query.go` | 585 | 过滤编译、匹配、排序、分页、投影 |

## 数据模型：文档、集合与 `_id`

数据目录里只有几个文件：

```text
data/
├── snapshot.json   # 某一时刻的全量数据与索引定义
├── wal.log         # 快照之后的增量操作（JSON Lines）
├── LOCK            # 进程独占锁（空文件，操作系统加锁）
└── users.json      # 可选：HTTP 账号
```

层级是「集合 → 文档」，集合类似表但没有固定结构。规则不多，但每条都有讲究：

- 文档必须是 JSON 对象；`_id` 必须是非空字符串，没提供就自动生成：**13 位十六进制毫秒时间戳 + 12 位随机字符**——时间前缀让生成的 ID 天然近似有序，插入时不会把索引写成完全随机的形态。
- 写入会深拷贝，调用方之后改原对象不影响数据库；读取返回的也是副本。这条规则消灭了一整类「共享 map 被意外改写」的并发 bug，代价是每次读写都要拷贝——对内存驻留的中小数据集，这是划算的保险。
- 字段名支持点号路径（`profile.city`）用于查询、排序、投影和索引，但文档本身保持自由嵌套。
- 以 `$` 开头的字段名会被当成操作符——这是兼容 MongoDB 习惯带来的历史约束，README 明确提醒不要用 `$` 做普通字段名。
- CLI / HTTP 写入的数字统一解码为 `float64`，Go 嵌入传 `int` 则保留原类型，比较时统一按数值处理——跨入口的类型行为被显式定义过，而不是留给你撞。

字段值与三类能力的支持矩阵（README 原表的浓缩版）：

| JSON 类型 | 存储 | 过滤/排序 | 可建索引 |
|---|---|---|---|
| 字符串 | 支持 | 等值、正则、字典序 | 支持 |
| 数字 | 支持 | 按数值比较 | 支持 |
| 布尔 | 支持 | 等值 | 支持 |
| `null` | 支持 | 仅 `$eq: null` / `$exists` | 不写入索引 |
| 数组 | 支持 | multikey（任意元素命中） | 元素逐个索引 |
| 对象 | 支持 | 整体等值匹配 | 不写入索引 |

「null 和对象不进索引」这条尤其容易被忽略：索引里没有它们，靠索引取候选集就可能漏掉文档。后面会看到，NanoDB 用一个 `incomplete` 标记和「候选集只作为过滤前置、仍做全量匹配」的组合来兜住这类问题的变体。

## 持久化核心：快照 + WAL

这是整个项目最核心的一节。所有数据库的持久化问题归根结底是同一个问题：**写到一半断电了怎么办？** NanoDB 的答案由三层构成，每层都不超过几十行代码。

### 记录长什么样：JSON Lines

`wal.log` 每行一条完整记录，顺序即写入顺序：

```text
{"op":"put","coll":"users","doc":{"_id":"u1","name":"Alice","age":30}}
{"op":"delete","coll":"users","id":"u2"}
{"op":"index.create","coll":"users","field":"age","unique":true}
{"op":"batch","ops":[{"op":"put","coll":"users","doc":{"_id":"u3"}}]}
{"op":"drop","coll":"users"}
```

操作类型一共七种：`put`（插入/覆盖，更新也写成覆盖式 `put`）、`delete`、`drop`、`batch`、`tx`、`index.create`、`index.drop`。批量和事务各是一条父记录、`ops` 里装子操作——这保证了「一整批要么全在要么全不在」在恢复时也是原子的。

JSON Lines 的取舍非常直白：可读、可 grep、一行即一条完整记录，代价是比二进制格式占更多空间、解析更慢。对一个目标场景是中小数据量的库，这个交换是合理的——而且它让「崩溃恢复」的实现退化成了「逐行解析，坏行截断」。

### 第一层：撕裂记录截断

进程在写一行的中途崩溃，文件末尾会留下半行。`engine/db.go` 的 `replay` 返回「有效前缀长度」，`openWAL` 据此截断：

```go
// replay 顺序重放 WAL，返回有效前缀长度。
func (db *DB) replay(data []byte) (int, error) {
    offset := 0
    for offset < len(data) {
        nl := bytes.IndexByte(data[offset:], '\n')
        if nl < 0 {
            return offset, nil   // 没有换行符：末尾是半行，截断点
        }
        ...
        if err := json.Unmarshal(line, &rec); err != nil {
            return 0, fmt.Errorf("nanodb: corrupt wal near byte %d: %w", offset, err)
        }
        ...
    }
    return offset, nil
}
```

注意两种错误被区别对待：**末尾没有换行**是正常撕裂，截断即可，之前已提交的数据不受影响；**中间某行解析失败**是真正的损坏，直接报错拒绝打开——静默跳过中间的坏行会把「丢数据」伪装成「成功恢复」，这是恢复逻辑里最不能让步的边界。

### 第二层：写失败自己也要回退

光有恢复还不够，写入方必须保证不会把半条记录留在文件里等下次恢复。`appendRecord` 里有一段容易被跳过、但注释写得极其到位的代码：

```go
n, err := db.wal.Write(data)
if err != nil || n != len(data) {
    // 写失败可能在文件尾部留下半条记录，必须回退到上一个完整记录，
    // 否则后续追加会与残缺字节拼成一条非法记录，导致重启后无法打开。
    db.rollbackWALLocked()
    ...
}
```

`rollbackWALLocked` 就是 `Truncate(walBytes) + Seek`——`walBytes` 始终记录最后一个完整记录的末尾位置，它同时是内存计数和恢复锚点。同样的回退也挂在 `fsync` 失败上。

还有一个藏在 `openWAL` 里的 Windows 坑，值得原样引用：

```go
// 不使用 O_APPEND：Windows 下该标志会移除 GENERIC_WRITE，导致后续 Truncate 报 Access is denied。
// 写入均由 db.mu 串行化，显式 Seek 到末尾即可保持追加语义。
f, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, filePerm)
```

「文档里说跨平台，实际只在 Linux 测过」是很多项目的通病，而这里的选择（不用 `O_APPEND`、靠锁串行化 + 显式 Seek 换取 Truncate 能力）是只有真在 Windows 上跑过才会做出的修正。跨平台不是口号，是这类具体到一个 flag 的决定。

### 第三层：gen 代数防压缩窗口期崩溃

快照 + WAL 结构固有的危险窗口是：压缩时「快照已重命名、WAL 还没清空」的瞬间崩溃，重放会把已经进快照的旧记录**再叠加一遍**——对普通 `put` 无害，对唯一索引就是一次假冲突，对 `delete` 后又插入的场景甚至可能复活数据。

NanoDB 用「代数」解决：快照里记 `gen`（WAL 代数），每次压缩递增，每条 WAL 记录也带写入时的代数。重放规则只有一行：

```go
// 早于当前快照代数的记录已经被快照覆盖，直接跳过。
if rec.Gen < db.walGen {
    offset += nl + 1
    continue
}
```

于是那个危险窗口被彻底关掉了：无论崩溃发生在压缩的哪一步，旧代记录要么被跳过、要么快照还是旧代照常重放，两种状态都是自洽的。这是一个很小的机制（一个 `uint64` 字段加一个比较），但它是「设计出来的正确」和「碰巧没出事」的分界线。

压缩本身的顺序也讲究：**先写临时快照 → `fsync` → 原子重命名 → 再清空 WAL**。任何时刻崩溃，磁盘上都至少存在一份完整的旧或新快照。另外 `maybeCompactLocked` 被放在事务提交、批量完成等「内存状态已全部应用」的位置，注释写明了原因——如果在 `appendRecord` 内部压缩，快照可能早于尚未应用的删除/建索引操作。

### 目录独占锁：单进程语义的物理保证

「同一数据目录同一时间只能被一个进程打开」如果只靠约定，迟早会出现两个进程同时写。NanoDB 用操作系统级文件锁把它变成物理事实：`lock_windows.go` 用 `LockFileEx`，`lock_unix.go` 用 `flock`，第二个进程打开直接返回 `ErrLocked`，进程异常退出时系统自动释放锁——不会留下「上次崩溃导致永久锁死」的僵尸状态。两个平台各自几十行、通过构建标签选择，是 Go 里处理这类问题的教科书姿势。

## 查询执行：一条 `find` 的流水线

一次 `db.Find(coll, q)` 在 `queryCollection`（`engine/db.go`）里走过五步，每步都有一个明确的优化动机：

```text
planCandidates（索引选候选集）
    → compileFilter（过滤条件预编译）
    → 逐文档匹配
    → Top-N / 全量排序
    → skip/limit 截断 → 投影拷贝
```

### 第一步：挑候选集最小的索引

```go
// planCandidates 从过滤条件中挑选候选集最小的索引，返回 nil 表示走全表扫描。
func (c *collection) planCandidates(filter map[string]any) map[string]struct{} {
    ...
    conds := make(map[string][]any, len(filter))
    collectConditions(filter, conds)
    ...
    consider := func(ids map[string]struct{}) {
        if ids == nil { return }
        if best == nil || len(ids) < len(best) { best = ids }
    }
    for _, ix := range c.indexes { consider(ix.lookup(conds)) }
    for _, tx := range c.texts    { consider(tx.lookup(conds["$text"])) }
    for field, gx := range c.geos { consider(gx.lookup(conds[field])) }
    return best
}
```

没有代价模型、没有统计信息、没有 histogram——就是「每个能用的索引都问一遍，谁的候选集最小用谁」。对单机内存库，这是性价比最高的规划器：索引查找本身是 `O(log n + 命中数)`，问三四个索引的开销远小于选错索引扫全表的开销。

`collectConditions` 的注释同样值得引用：**「收集顶层与 `$and` 中的字段条件；`$or`/`$not` 无法安全地取候选集」**。`$or` 的候选集是各分支的并集，取小了会漏文档——所以这里宁可不用索引也不冒险。查询规划器最重要的品质不是聪明，是**知道自己什么时候不该聪明**。选中索引后拿到的也只是候选集，最终仍要过一遍完整过滤，双保险。

### 第二步：过滤器只编译一次

朴素实现里，每匹配一条文档都要重新遍历 filter map、遇到 `$regex` 重新编译正则。`compileFilter` 把这件事提到扫描之前：

```go
// compileFilter 把过滤条件转成切片，避免在逐文档匹配时反复分配 map 迭代器。
// 同时预编译正则条件，避免扫描时每篇文档都重新编译同一条正则。
func compileFilter(filter map[string]any) []filterClause { ... }
```

非法正则被编译为 `re = nil` 直接视为不命中，而不是每条文档报一次错。10 万条文档的扫描里，这两条决定了分配次数是 2,012 还是几十万——性能表里「等值查询全表扫描 12 ms / 2,012 次分配」的 `allocs/op` 基本就是预编译的成果。

### 第四步：带 limit 的排序走 Top-N 堆

```go
if len(q.Sort) > 0 {
    if q.Limit > 0 {
        k := len(out)
        if q.Skip < len(out) && q.Limit < len(out)-q.Skip {
            k = q.Skip + q.Limit
        }
        out = topNSortDocs(out, q.Sort, k)   // 大小为 k 的最大堆
    } else {
        sortDocs(out, q.Sort)
    }
}
```

只取前 50 条时，用大小为 `skip + limit` 的最大堆扫一遍，堆顶永远是「当前前 k 条里最靠后的那条」，最后对 k 条小数组排一次序。复杂度从 `O(n log n)` 降到 `O(n log k)`，实测在 10 万条随机序数据上是 **6.5 ms 对 85.3 ms——十三倍差距**。另一个配套优化是排序键预抽取：先把每条文档的排序字段取出来存成键，避免每次比较都回表取嵌套字段。

`skip` 的处理也有个细节：`k = skip + limit` 意味着先取到「跳过之后还够用」为止，而不是排完整个结果集再切片。

## 索引系统：从二分定位到二元组分词

### 二级索引与 `incomplete` 标记

索引结构是「有序键 → 文档 ID 集合」，支持单字段、复合（`"a,b"`）、唯一约束和数组 multikey（数组元素逐个进索引，任意元素命中即命中）。范围查询用二分定位边界：

```go
// spanFor 按首字段的范围条件二分定位条目区间。
func (ix *index) spanFor(op string, val any) (entrySpan, bool)
```

于是范围查询复杂度是 `O(log n + 命中数)`，不再从头扫到尾——这是性能表里「范围查询 索引 3.1 ms vs 全表 27.3 ms」的来源。

复合索引有一个诚实的设计：含数组字段的文档无法按 tuple 语义进入复合索引，此时索引被标记 `incomplete`，`lookup` 对不完整索引直接返回 `nil`（表示不可用），查询规划回退全表扫描。**宁可慢，不可错**——一个「部分可见」的索引如果被当成完整索引用，结果会静默丢文档，这比慢一个数量级严重得多。

### 文本索引：没有词典的中文搜索

全文索引覆盖文档内所有字符串，用 `$text` 查询。分词逻辑核心只有三十行：

```go
// tokenizeText 按字母/数字切成词元；纯汉字片段额外生成二元组，
// 这样中文查询无需分词词典也能按片段匹配。
func tokenizeText(s string) []string {
    ...
    if han && len(word) > 1 {
        for i := 0; i < len(word)-1; i++ {
            out = append(out, string(word[i:i+2]))   // 「数据库」→ 数据/据库
        }
    } else {
        out = append(out, strings.ToLower(string(word)))
    }
    ...
}
```

汉字二元组（bigram）是一个经典的无词典方案：「数据库」切成「数据」「据库」，查询侧同样切片后做 AND 匹配，不需要任何分词词典就能支持中文。代价在「已知限制」里写得很清楚：没有停用词、词干、同义词，没有相关度评分，多词是纯 AND，结果不按相关度排序——它是**能用的检索，不是搜索引擎**。但对一个内嵌数据库来说，这个定位是准确的：多数场景只需要「把含这几个词的文档捞出来」。

### 地理索引：经度有序 + haversine

地理索引按经度有序存储，支持 `$geoWithin` 的 `$box`（矩形）与米制 `$circle`（圆）。圆判定用 haversine 球面距离：

```go
// haversineMeters 计算两点间的球面距离（米）。
func haversineMeters(lon1, lat1, lon2, lat2 float64) float64
```

矩形先用有序结构收窄候选、圆再逐点算距离，把昂贵的三角函数调用限制在小候选集上。限制同样是诚实的：不支持多边形与 GeoJSON 的 `Polygon`/`LineString`，不处理跨 180° 经线，`$geoWithin` 结果不按距离排序。

## 事务：集合粒度的乐观可串行化

NanoDB 的事务没有锁等待、没有死锁、没有 MVCC 的 undo 链——它用的是最朴素也最适配「内存 + 单进程」的方案：**集合快照 + 版本号校验**。

`Tx` 的结构（`engine/tx.go`）一眼就能看懂：

```go
type Tx struct {
    mu       sync.Mutex
    db       *DB
    snap     map[string]*collection // 事务内集合快照
    versions map[string]uint64      // 各集合首次访问时的版本
    writes   map[string]bool        // 事务内发生过写入的集合
    walOps   []walRecord
    done     bool
}
```

工作流程是：

1. **Begin 不持任何数据库锁**，只是空手开张。
2. **首次访问某集合时**，`db.mu.RLock` 下记录版本号并深拷贝整个集合——此后读写全部基于这份快照，天然可重复读，也能看到自己未提交的写入。
3. **Commit 时**一次性拿写锁，校验整个读集：

```go
// 校验事务访问过的整个读集，避免丢失更新与不可重复读；
// 只读事务同样校验快照一致性。
for name, ver := range tx.versions {
    if tx.db.versions[name] != ver {
        tx.finishLocked()
        return fmt.Errorf("%w: collection %q changed during transaction", ErrConflict, name)
    }
}
```

4. 校验通过 → 整批改动**只写一条** `{"op":"tx","ops":[...]}` WAL 记录 → 替换受影响集合 → 版本号 +1。校验失败 → 返回 `ErrConflict`、改动全部丢弃，调用方重新 `Begin` 重试。

这个设计的含义需要展开说：

- **冲突粒度是集合**。事务期间只要有人改了你读过的任何一个集合（哪怕改的是另一条文档），提交就失败——这就是注释里承认的「假冲突」。集合级校验比文档级便宜得多（一个 `uint64` 比较 vs 每文档一条记录），对低冲突场景这是对的取舍，对热点集合的高并发写则会产生大量无谓重试。
- **不会死锁**。没有锁等待，唯一的同步点是 Commit 时短暂的写锁，冲突的结局是立刻返回错误而不是排队。`Begin` 到 `Commit` 之间数据库完全可被其他写入使用。
- **只读事务也要 `Commit()`**——它用来认证「我读到的跨集合视图是一致的」。省掉这一步，跨集合的快照一致性就没有裁判。
- 事务方法可被多个 goroutine 并发调用（内部一把 `tx.mu`），事务结束后任何方法返回 `ErrTxDone`，`defer tx.Rollback()` 幂等。

一个转账例子（README 的标准片段）：

```go
tx, err := db.Begin()
if err != nil { return err }
defer tx.Rollback() // 幂等；提交后调用返回 ErrTxDone

if _, err := tx.Update("accounts", from, map[string]any{"$inc": map[string]any{"balance": -100}}); err != nil {
    return err
}
if _, err := tx.Update("accounts", to, map[string]any{"$inc": map[string]any{"balance": 100}}); err != nil {
    return err
}
if err := tx.Commit(); err != nil {
    if errors.Is(err, engine.ErrConflict) {
        // 事务期间相关集合被其他写入修改，需重新 Begin 后重试
    }
    return err
}
```

完整的隔离级别对照、语义细节与重试建议在 `docs/transaction-isolation.md`——把「事务语义」单独成文档而不是散在代码注释里，是这个项目文档质量的一个缩影。

## 原子批量：一条 WAL 记录装下一整批

事务解决「多步 + 可回滚」，批量解决「一次性、无中间状态」的写入。`batch` 的实现策略是**克隆暂存**：

- 整批写操作先在涉及集合的克隆上执行，任何一步失败（重复 `_id`、唯一索引冲突、非法更新表达式、目标文档不存在）就整批作废，正式数据完全没碰过。
- 成功时所有改动作为一个 `batch` 父记录写入——**一条** WAL 记录，恢复时整批重放，不存在半提交。
- 可以跨集合操作；`update` 目标不存在算错误，`delete` 目标不存在不算错误（结果里 `deleted: false`）——两个方向的语义都按「调用方最可能的意图」定义过。

「克隆上暂存」的代价是批量期间的内存峰值（多出几个集合的拷贝），换来的是**原子性不需要回滚逻辑**——失败路径只要把克隆扔掉，没有「撤销做了一半的索引维护」这种最难写对的代码。这与事务复用同一套快照机制，属于同一个设计家族。

批量还能从标准输入灌入（`batch -`），配合「成功只写一条 WAL 记录」，导入十万条数据就是一次 `fsync` 而不是十万次——批量写入在 WAL 结构下的收益是乘性的。

## SQL 只读子集与聚合管道

### SQL：手写三段式，复用同一引擎

`engine/sql.go`（624 行）是一个手写的 SQL 只读子集：词法 → 语法 → 执行，支持 `SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT/OFFSET` 与 `COUNT(*)`。

关键在于它**不带自己的执行引擎**：解析结果被翻译成与 REST / CLI 完全相同的 `Query` 结构（filter、sort、limit、skip、fields），然后走同一套 `compileFilter`、同一套索引规划、同一套 Top-N 排序。所以「SQL 查询和 find 查询性能一致」不是巧合，是它们根本就是同一条流水线的两种入口。

代价是能力边界明确：没有 JOIN、GROUP BY、HAVING、DISTINCT、子查询、UNION、列别名，聚合只支持 `COUNT(*)`，`LIKE` 大小写敏感。对一个嵌入式库的查询糖来说，这个子集覆盖了「从脚本里捞数据」的绝大多数动作。

### 聚合管道

八个阶段：`$match`、`$group`、`$sort`、`$skip`、`$limit`、`$project`、`$unwind`、`$count`，累加器支持 `$sum/$avg/$min/$max/$first/$last/$push`。语义对齐 MongoDB 的命名，让熟悉 Mongo 的人零学习成本。限制也照旧诚实：没有 `$lookup`、`$facet`、窗口函数、`$out`/`$merge`，且**聚合不使用索引**（`$match` 在管道最前面时可以依赖调用方把过滤下推，但聚合自身不做索引规划）。

## HTTP 服务：token、角色与事务会话

`server/` 把引擎包成 REST：

- **基础路由**：`/healthz`、`/v1/<collection>` 的 CRUD、查询参数承载 `filter`/`sort`/`limit`/`skip`/`fields`/`count`、`/v1/admin/compact` 等管理端点。
- **鉴权**：`-token` 为空表示不鉴权；设置后请求需带 `X-NanoDB-Token` 头。共享 token 是 admin 入口，还可以按用户发放 token，限制 `admin/write/read` 三种角色与集合白名单（精确匹配）。
- **HTTP 事务**：`POST /v1/transactions` 开事务拿 `tx_id`，在 `/v1/transactions/$TX/...` 下读写，最后 `commit` 或 `rollback`。事务会话存在**服务端内存**中，30 分钟未使用自动回滚，服务停机时回滚所有未提交事务——长事务不会把快照内存无限期钉住。
- **防御性细节**：单请求体上限 8 MiB（大导入改用 CLI `batch -`）、参数校验、统一错误码、请求体解析失败不半开连接。

值得注意的是 HTTP 事务与 Go 事务**共享同一套 `Tx` 实现**，session 层只负责 `tx_id → *Tx` 的映射与超时回收。这是「入口薄、引擎唯一」的又一次体现。

## 性能实测：数字与优化点

10 万条文档、等值/范围查询命中 1000 条时的参考值（Windows 本机实测，项目 README 提供，随机器与负载波动较大）：

| 场景 | 耗时 | 分配次数/op |
|---|---:|---:|
| 等值查询 · 索引 | 3.0 ms | 2,037 |
| 等值查询 · 全表扫描 | 12.0 ms | 2,012 |
| 范围查询 · 索引 | 3.1 ms | 2,037 |
| 范围查询 · 全表扫描 | 27.3 ms | 2,012 |
| 投影查询 · 索引 | 3.1 ms | 2,037 |
| 排序 + 分页（1 万命中，skip 500 / limit 50） | 12.9 ms | 208 |
| 随机序排序 Top-50（10 万命中） | 6.5 ms | 6 |
| 随机序全量排序（10 万命中） | 85.3 ms | 6 |

从这张表能读出四件事：

1. **索引的收益是 4–9 倍**（等值 3.0 vs 12.0，范围 3.1 vs 27.3），范围查询的差距更大——全表扫描每个文档都要重新比较，索引是二分加遍历命中段。
2. **Top-N 是十三倍**（6.5 vs 85.3）——只取前 N 条时永远不要全量排序。
3. **`allocs/op` 比耗时更可信**。README 特别注明连续跑基准会触发 CPU 降频、绝对耗时波动可能超过 30%，横向对比以分配次数为准——这是一个被基准测试毒打过的团队才会写下的提醒。
4. 排序 + 分页只有 208 次分配，因为排序键预抽取 + Top-N 堆把「比较」和「回表」解耦了。

对应的调优建议也都是这篇文章讲过的机制的使用说明：高频过滤字段建索引但别建太多；只要部分字段就用 `fields` 投影（边拷贝边投影，分配数与不投影一致）；只要前 N 条就同时给 `sort` 和 `limit`；能接受掉电丢最近写入就用 `-no-sync` 换吞吐；写入密集就调大 `CompactThreshold` 减少压缩次数（代价是重启重放变长）。

## 测试与工程质量

```bash
go vet ./...
go test ./...
go test -cover ./...
go test -race ./...        # 需要 CGO 与 C 编译器，Windows 需装 gcc
go test ./engine -run '^$' -bench Benchmark -benchmem
```

实测 `go test ./...` 三个包全部通过（`cmd` 0.87s、`engine` 1.08s、`server` 1.58s）。覆盖率 engine 80%、server 80%、cmd 75%。

覆盖面清单能看出测试的重点放在哪：

- **引擎**：CRUD、查询操作符、排序/分页/投影、四类索引与唯一约束、聚合、SQL 解析执行、批量原子性、事务隔离与冲突、**WAL 重放、压缩、目录锁**、关闭后行为、更新错误路径。
- **server**：鉴权、角色与集合白名单、账号存储、路由、405、参数校验、错误码、事务会话与超时回收、请求体上限。
- **CLI**：参数解析、一次性命令全链路、shell 事务与 EOF 回滚、serve 启停。

值得表扬的是把「WAL 重放」「压缩」「目录锁」「EOF 自动回滚」这类**崩溃与边界场景**写进了常规测试，而不是只测 happy path——持久化项目的事故几乎全部发生在这些地方。基准测试统一用 10 万条文档，`BenchmarkSortRandom*` 做随机序数据上的全量排序与 Top-N 的 A/B，对应上面性能表的第 7、8 行。

另外从 git 历史能看到工程流程本身也在被维护：CI 每次提交自动生成语义版本 tag 与 Release、统一 LF 换行、显式处理 Go module cache——一个 0.1.0 项目把发布链路先铺好，说明它是打算长期维护的。

## 横向对比：它在坐标系的哪个位置

| 维度 | NanoDB | SQLite | LevelDB / BadgerDB | MongoDB |
|---|---|---|---|---|
| 形态 | 嵌入式，单进程 | 嵌入式，单进程 | 嵌入式 KV | 独立服务，分布式 |
| 数据模型 | JSON 文档 + 集合 | 关系表 + SQL | 字节 KV | JSON 文档 |
| 查询语言 | 类 Mongo 查询 + 只读 SQL + 聚合 | 完整 SQL | 无（键/迭代器） | Mongo 查询 + 聚合 |
| 事务 | 显式事务、集合粒度乐观 | 单库 ACID（SQLite 级） | 无 / Badger 有受限 MVCC | 多文档事务（4.0+） |
| 二级索引 | 有，含文本/地理 | 有 B-tree | 需自建（二级索引模式） | 有，含各类 |
| 持久化 | 快照 + JSON Lines WAL | pager + WAL | LSM + WAL | WiredTiger + WAL |
| 依赖 | 0 | 0（C） | 0 | 服务端 + 驱动 |
| 数据规模 | 内存可容纳 | TB 级磁盘 | TB 级磁盘 | 集群级 |

定位差异的本质：

- **vs SQLite**：SQLite 是关系型 + 完整 SQL + 磁盘分页，数据量可以远超内存；NanoDB 是文档模型 + 内存驻留，卖点是 JSON 原生与 Go 嵌入的零摩擦。要 SQL 分析大量数据，选 SQLite；要在 Go 服务里塞一个即用即走的 JSON 存储，NanoDB 更顺手。
- **vs LevelDB 系**：那是 KV 引擎，没有查询语言、没有二级索引抽象，用它做文档存储要自己写整层。NanoDB 卖的就是上面那一整层。
- **vs MongoDB**：Mongo 是网络协议 + 副本集 + 分片的完整系统，运维成本和心智负担完全不是一个量级。NanoDB 没有任何分布式野心，它就是进程里的一百多 KB 数据文件。

## 已知限制（诚实清单）

这一节直接来自项目的自我陈述——**一个数据库项目最值得信任的信号，是它把限制写得比特性还细**：

- **内存驻留**：文档与索引都在内存，数据规模受内存限制；WAL 是 JSON Lines，存储开销高于二进制格式。
- **无分布式**：不支持副本、分片、集群；同一目录同一时间单进程。
- **事务能力边界**：隔离级别固定不可配置、冲突粒度是集合（有假冲突）；不支持 Savepoint、事务内 DDL（`drop`、`index create/drop`、`compact`）、跨进程事务。
- **文本检索是近似方案**：二元组分词，无停用词/词干/同义词/相关度评分，多词 AND，索引字段固定为 `*`（查询可用 `$path` 限定）。
- **地理查询受限**：仅 `$box` 与 `$circle`，无多边形与 GeoJSON 几何，不处理跨 180° 经线，`$geoWithin` 不按距离排序。
- **SQL 是只读子集**：无 JOIN / GROUP BY / HAVING / DISTINCT / 子查询 / UNION，聚合仅 `COUNT(*)`。
- **聚合不走索引**：无 `$lookup`、`$facet`、窗口函数、`$out`/`$merge`。
- **复合索引遇数组回退**：含数组字段的文档不进复合索引，该索引的查询规划回退全表扫描。
- **权限粒度粗**：集合白名单是精确匹配，无通配符与字段级权限；HTTP 单请求体 8 MiB。
- **数组插入（POST 数组）非原子**：需要原子性时用批量或事务。

## 适用与不适用场景

**适合**：

- Go 工具/服务里的本地存储：配置、任务队列、爬虫状态、桌面应用的资料库——不想为了「存几万条 JSON」引一个数据库服务。
- 中小规模、数据量能放进内存的读多写少场景，配合索引与 Top-N 有毫秒级响应。
- 教学与二次开发：一万行、零依赖、部件齐全，想改 WAL 格式、加一种索引、练习事务实现，都是绝佳的起点。
- 边缘/单机部署：没有 cgo、没有外部服务，一个二进制走天下。

**不适合**：

- 数据量超出内存、或需要 TB 级持久化——那是 SQLite / LSM 系的领域。
- 多进程并发写同一目录、需要多节点高可用——项目明确放弃。
- 高并发热点集合的重事务——集合级乐观冲突会带来大量重试。
- 需要全文检索相关度排序、复杂 SQL 分析、地理位置精确计算的生产需求。

## 结语

回到开头的三个问题：

1. **支持事务的数据库最短路径有多短？** `Tx` 结构体加一个版本号校验循环——`engine/tx.go` 整个文件就是「集合快照 + 提交时读集校验」，没有锁管理器、没有 undo 日志，却给出了可重复读与丢失更新防护，冲突时明确报 `ErrConflict` 让调用方重试。
2. **「崩溃后不丢已提交数据」还剩多少行代码？** 三层：`replay` 识别有效前缀并截断撕裂记录，`appendRecord` 写失败回退到上一条完整记录，`gen` 代数让压缩窗口期的崩溃自我消解。核心不到一百行——难的不是代码量，是想清楚每个崩溃点的状态。
3. **文档模型 + 索引 + 并发如何咬合？** 写入路径统一经过 `collection.add` 同步维护四类索引，事务通过克隆集合快照把索引一起带上，查询规划只在候选集层面「选最小」、最终仍全量过滤兜底。

NanoDB 不会取代 SQLite，也不打算取代 MongoDB。它的价值在于把数据库的黑箱拆开摆在桌面上：**WAL 是带换行的 JSON，事务是比较版本号，查询规划是挑候选集最少的那个**。这些机制朴素到几乎能背下来——而朴素正是它们可信的原因。

如果你曾想「自己写个数据库试试」，这个项目给出的答案是：可以，而且不用太多行。下一步不是读更多论文，是 `git clone` 之后把 `replay`、`Commit` 和 `planCandidates` 这三个函数各改坏一次，看看测试是不是还亮着——那会是比任何文章都快的入门方式。
