---
title: LSM-Tree 与 B+Tree：一次写入到底写了几遍盘
slug: lsm-vs-btree-amplification
category: database
tags: [LSM-Tree, B+树, RocksDB, SQLite, 存储引擎, 写放大]
status: draft
description: 同一份 100 万条数据，SQLite 随机写入要 200 秒、写盘 12.8 GB，RocksDB 只要 4 秒、写盘 0.6 GB；但顺序写入两者几乎一样快。本文拆开 B+ 树的页分裂与 WAL 全页镜像、LSM 的 memtable 与 compaction，用实测数字算清写放大、读放大和空间放大的账。
---

> 适用读者：写过 KV 存储或正在选型的人；被「LSM 写得快、B+ 树读得快」这类一句话结论说服过、但没看过账本的人；在 SQLite、RocksDB、LevelDB、InnoDB 之间做技术决策，想知道代价到底落在哪一层的人
> 结论先行：B+ 树把随机写摊成「随机页写」，LSM 把随机写变成「顺序追加 + 后台重写」。前者的写放大取决于每个事务碰了多少页，后者的写放大取决于 compaction 重写了几层。两者没有免费的午餐，只有把成本放在写路径、读路径还是后台线程的选择。
> 阅读时间：约 28 分钟 | 难度：进阶 | 收获：一组可复现的 100 万条实测数据、写放大公式与逐项拆解、B+ 树随机写为什么能放大到 100 倍、LSM 的 compaction 账单、以及一张按负载选型的决策表

**目录**

- 一、两个反直觉的现象
- 二、实验设置与指标口径
- 三、B+ 树的写路径：页、分裂与全页 WAL
- 四、LSM 的写路径：memtable、SST 与 compaction
- 五、写放大公式：钱到底花在哪一层
- 六、读路径：树高、Bloom Filter 与读放大
- 七、更新与删除：原地改与墓碑
- 八、空间放大：文件大小不会说谎
- 九、什么时候选 LSM，什么时候选 B+ 树
- 十、源码地图：从一次 put 到一次 fsync
- 十一、复现实验：脚本、参数与踩坑
- 十二、小结：把问题问对

## 一、两个反直觉的现象

先看第一组数字。100 万条记录，key 是 24 字节的 `user:%016d`，value 是 100 字节不可压缩随机数据，合计约 124 MB 逻辑数据。以随机顺序写入，每 500 条提交一次：

| 引擎 | 写入耗时 | 逻辑吞吐 | 进程写盘 | 写放大 | 数据库大小 |
|------|---------|---------|---------|--------|-----------|
| SQLite（B+ 树，WAL） | 201.6 s | 0.62 MB/s | 12822.9 MB | 103.4× | 149.9 MB |
| RocksDB（LSM） | 4.0 s | 30.7 MB/s | 584.7 MB | 4.7× | 116.4 MB |

同样一份数据，SQLite 慢了约 50 倍，写盘量是逻辑数据的 103 倍；RocksDB 只写了 4.7 倍。但第二组数字会立刻打破「LSM 全面更快」的印象：把写入顺序改成从小到大顺序追加，SQLite 只需要 4.7 秒，写放大降到 2.9 倍，和 RocksDB 的 2.8 秒、2.0 倍几乎在同一量级。

第三个现象更微妙：随机读 5 万次，SQLite 的 p50 是 25.2 µs、p99 是 135 µs；RocksDB 的 p50 是 29.7 µs、p99 是 119 µs。读延迟几乎没有差别，尽管 LSM 理论上要查更多层。

这三个现象指向同一个结论：**性能差异不在「树」这个名字上，而在写路径把随机性放在了哪里，以及日志记录的是整页还是变更。** 下面把账拆开算。

## 二、实验设置与指标口径

先把可复现的条件写清楚。所有数字来自一台 Windows 11（build 26200）机器：Intel Core 5 210H，8 核 12 线程，15.5 GB 内存，NTFS 文件系统；Python 3.13.14，SQLite 3.50.4，RocksDB 通过 `rocksdict` 0.3.29 调用，进程 I/O 用 `psutil` 7.2.2 采集。

负载是同一个生成器：

```python
import hashlib, random

N = 1_000_000
keys = list(range(N))
random.shuffle(keys)          # 或保持 0..N-1 做顺序对照
keys = [f'user:{i:016d}'.encode() for i in keys]

def value(k):
    return hashlib.shake_128(k).digest(100)   # 100 字节不可压缩
```

写入时每 500 条一个事务。SQLite 使用 `WITHOUT ROWID` 表，确保只有一棵以 key 为聚簇键的 B+ 树；参数是 `journal_mode=WAL`、`synchronous=NORMAL`、`page_size=4096`、`cache_size=256 MB`。RocksDB 使用默认压缩，`write_buffer_size=4 MB`、`max_write_buffer_number=3`、`target_file_size_base=8 MB`、`max_background_jobs=4`；把 memtable 调小是为了在 124 MB 数据量下也能看到多层 compaction，而不是让所有数据停在一个巨大的 memtable 里。

三个指标的定义必须说清：

- **写放大 WA**：进程写入的字节数 ÷ 逻辑字节数。进程写字节包含 WAL、数据文件、compaction 输出，不包含文件系统元数据。它比「看数据库文件涨了多少」更接近真实写路径，但也不是磁盘颗粒层面的物理写入。
- **读放大 RA**：一次点查平均从存储读了多少字节。由于没有管理员权限清空操作系统页缓存，这个数字会受缓存影响，只用于同机对照，不用于跨机器比较。
- **空间放大 SA**：数据库文件总大小 ÷ 逻辑数据大小。它回答「同样的数据要占多少盘」。

局限也先说：单线程客户端、单机、Windows、值不可压缩、SQLite 的 WAL 记录整页镜像、RocksDB 开启了块压缩。尤其最后两点决定了：**下面的 103 倍不能直接外推到 InnoDB**。InnoDB 的 redo 以页内变更记录为主，不是每个事务把每个脏页的 16 KB 新镜像都写一遍；它的写路径更接近「记录改了哪些字节」，而不是 SQLite WAL 的「记录整页新样子」。文章后半会单独说明这一点。

## 三、B+ 树的写路径：页、分裂与全页 WAL

B+ 树的写路径可以压缩成一句话：**找到 key 应该落在的叶子页，改它；如果页满了，分裂；所有改动先写日志，再在 checkpoint 时回写数据文件。**

SQLite 的页大小是 4096 字节。一个叶子页除去页头、单元格指针和空闲空间，大约能放二三十条 124 字节的记录。100 万条记录最终形成约 3.6 万个叶子页，加上内部节点，数据库文件约 150 MB，和实测的 149.9 MB 对得上。

随机写入时，500 条 key 几乎落在 500 个不同的叶子页上。一个事务提交，WAL 需要为**每一个被修改的页**追加一帧：24 字节帧头加一整页 4096 字节的新镜像。SQLite 的 WAL 格式在官方文档里写得很清楚：帧头包含页号、提交后的数据库页数、salt 和校验和，页数据就是完整的一页。恢复时单次顺序扫描 WAL，逐帧校验，遇到第一个坏校验和就停止。这个设计让 WAL 的写入非常直接，也让它对随机小事务极其不友好。

做一个不算精细但足够说明问题的估算：每个事务触碰约 500 个叶子页，加上分裂产生的新页、父节点更新、freelist 页，保守按 600 页计算，每页 4 KB，一个事务写 2.4 MB；2000 个事务就是 4.8 GB。实际观测是 12.8 GB，多出来的部分来自页分裂（一次分裂会新增页并改写父页）、checkpoint 把 WAL 回填到主库时的重复写，以及 WAL 自身的多轮复用。量级完全对得上。

这也解释了顺序写入为什么快：key 单调递增，每次只改最右边的叶子页和少量内部页，一个事务的脏页数从 500 降到个位数。实测写放大从 103.4 倍降到 2.9 倍，耗时从 201 秒降到 4.7 秒。**B+ 树并不怕写，它怕的是「一个事务里随机碰很多页」。**

把这件事写成公式：

```text
WA_btree ≈ (每个事务平均触碰的不同页数 × 页大小)
           ÷ (每个事务写入的逻辑字节数)
```

随机 500 条：`500 × 4096 / (500 × 124) ≈ 33`，再叠加分裂与 checkpoint 的重复写，到 100 倍并不奇怪。顺序 500 条：`2 × 4096 / (500 × 124) ≈ 0.13`，此时 WAL 的帧头、提交开销和 checkpoint 成为主要成本，整体落在 3 倍左右。

如果换成 InnoDB，公式里的「页大小」还是 16 KB，但「每个事务触碰的页数」会被 buffer pool 和 change buffer 改写：二级索引的随机插入可以先记在 change buffer 里，等页被读入时再合并；redo 记录的是页内变更，而不是每事务整页镜像。所以 InnoDB 的随机写放大通常远低于 SQLite WAL 的 100 倍。**这是实现差异，不是 B+ 树的理论下限。**

## 四、LSM 的写路径：memtable、SST 与 compaction

LSM 的写路径同样可以压缩成一句话：**所有写入先追加 WAL，再进内存 memtable；memtable 满了就冻结、顺序刷成 L0 的 SST 文件；后台 compaction 再把 L0 一层层往下合并。**

以 LevelDB 为例，几个关键常量决定了形状：L0 文件数达到 4 个触发 compaction，写入积压到 8 个开始减速、12 个直接停写；每层容量按 10 倍递增；SST 目标大小 2 MB。RocksDB 的默认值更大（memtable 64 MB、目标文件 64 MB、底层容量 256 MB），但机制相同。我们为了在 124 MB 数据上看到 compaction，把 memtable 调到了 4 MB。

LSM 的写放大可以拆成三段：

```text
WA_lsm = WA_wal + WA_flush + WA_compaction
```

- **WAL**：每条记录追加一次，约等于 1 倍逻辑字节（加上帧头开销）。
- **flush**：memtable 写满后整体写成 L0 文件，约 1 倍。
- **compaction**：L0 与下一层合并，输出新文件；下一层再与更下一层合并。每条记录在每一层被重写一次。

如果层容量按 T 倍增长，每层 compaction 的摊薄写放大约为 `1 / (1 - 1/T)`；T=10 时约 1.11。数据跨 L 层，compaction 总写放大大致是 `L × T/(T-1)`。数据量越大、层数越多，这部分越贵。

本次实测（随机写入）：

| 组成 | RocksDB 统计 |
|------|-------------|
| WAL | 0.12 GB |
| flush | 0.109 GB |
| compaction 写 | 0.43–0.50 GB |
| 进程总写盘 | 0.58–0.66 GB |
| 逻辑数据 | 0.124 GB |
| 实测 WA | 4.7–5.3 |

顺序写入时，compaction 几乎没有读放大：新写入的 key 已经按顺序排好，L0 文件之间没有重叠，合并只需要把文件搬下去。实测 compaction 写从 0.43 GB 降到 0.11 GB，总 WA 从 4.7 降到 2.0。**LSM 的顺序写优势来自「没有随机页」；它的随机写优势来自「把随机性推迟到后台 compaction」，而不是消灭了随机性。**

## 五、写放大公式：钱到底花在哪一层

把两种引擎放在同一张账单上看：

| 成本项 | B+ 树（SQLite WAL） | LSM（RocksDB） |
|--------|--------------------|----------------|
| 日志 | 每个脏页一整页 4 KB | 每条记录追加 |
| 数据落盘 | checkpoint 回写脏页 | memtable 顺序刷 L0 |
| 额外重写 | 页分裂、checkpoint 重复 | compaction 逐层重写 |
| 随机写的代价 | 每事务脏页数 × 页大小 | 后台 compaction 的带宽与 CPU |
| 顺序写的代价 | 很小 | 很小 |
| 延迟表现 | 写延迟直接受脏页数影响 | 写延迟平稳， compaction 可能造成毛刺 |

一个容易被忽略的点是：**写放大不只是「费盘」**。它同时消耗 page cache、文件系统写回带宽和 SSD 的写入寿命。SQLite 那次 12.8 GB 的写入里，真正需要保留的新数据只有 124 MB；其余都是同一批页在不同时刻的不同版本。对读多写少的博客数据库，这不是问题；对每秒几千次随机写入的采集服务，这就是寿命和成本。

反过来，LSM 的 compaction 也不是免费的。它占用后台线程和磁盘带宽，可能和前台读竞争；L0 文件堆积会触发写停顿；层数越深，一次 compaction 要重写的字节越多。RocksDB 提供 `max_background_jobs`、`level_zero_slowdown_writes_trigger`、`max_bytes_for_level_base` 等参数，本质都是在「写放大、读放大、空间放大、尾延迟」之间调平衡。

## 五点五、两个旋钮：提交批量与 value 大小

写放大不是一个固定常数，它会被两个很日常的参数显著改变：一次提交多少条、每条 value 多大。很多人调优时只盯着引擎参数，却忽略了这两件事。

先看提交批量。固定 10 万条随机 key、100 字节 value，只改每批提交条数：

| 每批条数 | SQLite 写放大 | SQLite 吞吐 | RocksDB 写放大 | RocksDB 吞吐 |
|---------|--------------|------------|---------------|-------------|
| 1 | 95.8× | 1.56 MB/s | 3.04× | 10.75 MB/s |
| 10 | 94.5× | 1.74 MB/s | 2.91× | 35.38 MB/s |
| 100 | 86.5× | 2.05 MB/s | 2.89× | 43.04 MB/s |
| 1000 | 59.0× | 2.68 MB/s | 2.89× | 51.91 MB/s |

SQLite 的写放大从 95.8 倍降到 59.0 倍，但**没有数量级变化**。原因还是那句话：决定成本的是「一个事务碰了多少个不同页」，不是「一个事务有多少条记录」。随机 key 即使一次提交 1000 条，也会碰到近千个叶子页，每页仍要写一整帧。批量提交减少的是提交次数、WAL 帧头和同步开销，吞吐提升有限。

RocksDB 的写放大几乎不变（2.89–3.04 倍），吞吐却从 10.75 MB/s 涨到 51.91 MB/s。因为 LSM 的写路径本来就是顺序追加，批量提交主要省掉每次写入的固定开销；compaction 的工作量由数据量决定，不由提交次数决定。

再看 value 大小。固定 20 万条、每批 500 条，只改 value 长度：

| value 大小 | SQLite 写放大 | SQLite 空间放大 | RocksDB 写放大 | RocksDB 空间放大 |
|-----------|--------------|----------------|---------------|-----------------|
| 10 B | 163.1× | 1.22× | 1.64× | 0.58× |
| 100 B | 83.8× | 1.21× | 3.42× | 0.94× |
| 1000 B | 27.4× | 4.58× | 4.55× | 1.00× |

小 value 把 SQLite 的写放大推到 163 倍：一条 34 字节的记录也要占一个 4 KB 页帧，WAL 的页头开销是记录本身的百倍。value 变大后，单页能装的记录变少、每个事务碰到的页数下降，写放大反而降低；但 1000 字节的随机插入让 B+ 树分裂得更碎，空间放大冲到 4.58 倍——数据库文件 938 MB，逻辑数据只有 205 MB。这是「写放大降低、空间放大升高」的典型交换。

RocksDB 的趋势相反：value 越大，compaction 重写的字节越多，写放大从 1.64 升到 4.55；但 SST 的空间利用率稳定在 1 倍左右，没有出现 SQLite 那样的碎片膨胀。两者的曲线方向不同，调优时不能只看一个指标。

## 六、读路径：树高、Bloom Filter 与读放大

B+ 树的点查是一次从根到叶的下降。100 万条记录、每页约 30 条，树高大约是 4 层（根、两层内部节点、叶子）。如果 buffer pool 命中上层节点，实际只需要 1 次叶子页读取；最坏情况是 4 次页读取。范围扫描更占优势：叶子页之间有链表，顺序读下去即可。

LSM 的点查要先查 memtable，再查 immutable memtable，再查 L0 的多个文件，最后在每一层做二分查找。没有 Bloom Filter 时，一次不存在的 key 可能要读很多文件；有 Bloom Filter 时，大多数文件可以被一次内存查询排除。RocksDB 默认给每个 SST 建 Bloom Filter，LevelDB 需要显式配置 `FilterPolicy`。

实测读 5 万次随机存在的 key：

| 引擎 | p50 | p99 | 总读盘 | 每次点查读盘 |
|------|-----|-----|--------|-------------|
| SQLite（随机写后的库） | 25.2 µs | 135.0 µs | 115.6 MB | 2.3 KB |
| RocksDB（随机写后的库） | 29.7 µs | 119.4 µs | 414.2 MB | 8.3 KB |
| SQLite（顺序写后的库） | 19.0 µs | 106.7 µs | 114.9 MB | 2.3 KB |
| RocksDB（顺序写后的库） | 15.3 µs | 57.6 µs | 189.6 MB | 3.8 KB |

这张表最值得看的是「每次点查读盘」：B+ 树每次约 2.3 KB，基本就是一页；LSM 随机写后是 8.3 KB，约等于两页多一点，说明 Bloom Filter 挡掉了大部分文件，但仍有少量文件需要真正读取。p99 反而没有明显劣势，因为 LSM 的层数不深、块缓存命中率不低；真正的读放大体现在「读的字节数」和「CPU 花在合并迭代器上」，而不是单次延迟。

范围扫描是另一回事。B+ 树在叶子链表上顺序前进，预读友好；LSM 要同时打开多个层的迭代器做归并，CPU 开销更高，但顺序 I/O 仍然不差。对「按时间范围拉一批事件」的负载，LSM 往往表现很好，因为数据按 key 有序、范围连续。

## 七、更新与删除：原地改与墓碑

更新是两种引擎差距最容易反转的地方。B+ 树通常是原地更新：找到记录，改值，标脏页。LSM 不原地改，它追加一条新版本；旧版本要等 compaction 合并到更深层时才会被丢弃。删除同理，LSM 写一条墓碑（tombstone），直到 compaction 把它和旧值一起清掉。

在 100 万条随机写入之后，再做 20 万次随机更新（每次更新 100 字节 value，每 500 次提交）：

| 引擎 | 更新耗时 | 更新吞吐 | 更新写盘 | 更新写放大 |
|------|---------|---------|---------|-----------|
| SQLite（WAL） | 21.04 s | 1.18 MB/s | 1621.7 MB | 65.4× |
| RocksDB | 0.75 s | 33.21 MB/s | 169.7 MB | 6.8× |

SQLite 的更新写放大比插入还高，因为每次更新都触碰一个已有的叶子页，WAL 要写整页新镜像；500 次更新可能触碰 500 个页，一个事务就是 2 MB 的 WAL。RocksDB 的更新先写新版本，再由 compaction 合并；写入路径很快，但 compaction 会在后台把包含旧版本的文件重写一遍。**LSM 的更新不是「不写」，而是「把写推迟并批量做」。**

这里再次强调实现差异：InnoDB 的更新会写 undo 记录、修改聚簇索引页，redo 记录页内变更；二级索引的随机更新还可以走 change buffer。它的更新写放大不会像 SQLite WAL 这样直接等于「脏页数 × 16 KB」。拿本文的 SQLite 数字去论证「所有 B+ 树更新都慢 30 倍」，是错误的外推。

## 八、空间放大：文件大小不会说谎

| 指标 | SQLite | RocksDB |
|------|--------|---------|
| 逻辑数据 | 124.0 MB | 124.0 MB |
| 数据库大小 | 149.9 MB | 116.4 MB |
| 空间放大 | 1.21× | 0.94× |

SQLite 的 1.21 倍来自页内空闲空间、页分裂后的半满页和 B+ 树的内部节点。随机插入会让页填充率下降；顺序插入的库是 146.5 MB，略小一点，但没有本质差别。`VACUUM` 可以重建数据库、回收碎片，但需要额外的空间和时间。

RocksDB 的 116.4 MB 比逻辑数据还小，原因是块压缩（即使 value 是不可压缩随机数，key、块头和索引仍可压缩）以及 SST 的紧凑编码。LSM 的空间放大不是恒定的：compaction 进行中会同时存在输入文件和输出文件，瞬时空间可能接近 2 倍；删除多、更新多的库，在 compaction 追上之前，旧版本会一直占着空间。RocksDB 用 `max_background_jobs` 和 compaction 优先级控制这个窗口，但无法消除。

一个常被忽略的账是**空间放大会反过来影响读放大**：文件越多、层数越深，点查要探测的文件越多。LSM 的调优本质上是三个放大之间的三角交换，不能只盯一个。

## 九、什么时候选 LSM，什么时候选 B+ 树

把结论写成一张表，前提是「同一套硬件、同一份数据、单机嵌入式或单实例」：

| 负载特征 | 更合适 | 原因 |
|---------|--------|------|
| 高频随机写、写多于读 | LSM | 追加写 + 后台 compaction，前台延迟平稳 |
| 只追加的日志、事件、时序数据 | LSM | 顺序写路径最短，compaction 可按时间分区 |
| 读多写少、点查为主 | B+ 树 | 一次树下降，读放大稳定 |
| 复杂范围查询、排序、连接 | B+ 树 | 叶子链表、有序扫描、优化器成熟 |
| 强事务、多表一致性 | B+ 树（InnoDB） | 行锁、MVCC、undo、外键生态完整 |
| 写吞吐优先、能接受后台抖动 | LSM | compaction 可调，写停顿可观测 |
| 运维人力有限、数据量不大 | B+ 树 | 没有 compaction 调参和写停顿 |
| 需要可预测的 p99 | 取决于调优 | LSM 的 p99 受 compaction 影响，B+ 树的 p99 受 checkpoint 影响 |

几个常见误区：

1. **「LSM 一定比 B+ 树写得快」**：只在随机写、批量提交、value 不太大时成立。顺序写时两者接近；小事务单条提交时，WAL 的 fsync 才是主导。
2. **「B+ 树读一定更快」**：点查延迟取决于缓存和树高，LSM 有 Bloom Filter 后差距很小；范围扫描 B+ 树更稳，但 LSM 的顺序 I/O 也不差。
3. **「写放大只影响 SSD 寿命」**：它还影响写吞吐、checkpoint 毛刺和备份窗口。103 倍的写放大意味着同样的逻辑写入要占用 103 倍的写带宽。
4. **「拿 SQLite 的数字代表 InnoDB」**：SQLite WAL 的全页镜像是实现选择，不是 B+ 树的必然后果。选型时要看具体引擎的日志格式、buffer pool 和 change buffer。

## 九点五、三个真实负载的选型演练

抽象地比较「LSM vs B+ 树」很容易，落到具体系统就没那么非黑即白。下面用三个典型负载走一遍决策过程，数据仍然来自前面的实测。

**场景一：每分钟写入 20 万条监控事件，按时间范围查询最近一小时。**

写入是追加式的，key 基本单调，value 几十到几百字节；查询是时间范围扫描，偶尔按标签过滤。这种负载对 LSM 非常友好：顺序写路径最短，compaction 可以按时间分区，范围扫描沿着有序 key 走。用 B+ 树也能做，但随机的主键或时间索引仍然会产生页分裂；如果每批事件分散在多个索引页上，SQLite 式的全页 WAL 会把写放大推到几十倍。

选 LSM 时要注意两点：一是 compaction 要和查询错峰，否则后台重写会抢 I/O；二是保留时间窗口之外的旧数据要及时 TTL，否则 compaction 会一直为历史数据做无用功。用 B+ 树时则要关注分区/分表和索引维护，避免单表无限增长。

**场景二：用户资料 KV，读远多于写，要求 p99 稳定。**

典型操作是 `GET user:<id>`，写入是偶发的资料更新，读多写少，value 几 KB。这种负载更适合 B+ 树：一次树下降就能拿到记录，读放大稳定；更新是原地改，不会在后台积累大量旧版本。InnoDB 的 buffer pool 会把热点页留在内存里，二级索引更新还能走 change buffer。

如果非要用 LSM，必须把 Bloom Filter 配好、块缓存给足，并且接受「读的字节数更多」这件事。对 p99 极端敏感的服务，LSM 的 compaction 抖动需要用限速和优先级压住；否则一次大 compaction 就可能把读延迟拉高。

**场景三：订单库，强事务、多表关联、需要按状态和日期做复杂查询。**

这类负载几乎没有悬念：选支持完整事务和成熟优化器的 B+ 树引擎，通常是 InnoDB 或 PostgreSQL。不是因为 B+ 树天生更快，而是因为行锁、MVCC、undo、外键、join、子查询这些能力需要长期工程积累。LSM 可以做 KV 和单表事务，但复杂查询和跨行一致性不是它的主场。

真正需要警惕的是：不要因为「写入量变大了」就把订单库迁到 LSM，却忽略了事务语义、二级索引和报表查询。写入瓶颈有很多种解法——批量提交、分区、异步化、加缓存——迁移存储引擎往往是成本最高、回滚最难的一种。

三个场景的共同点是：**先确定读怎么写、事务边界在哪、p99 预算多少，再谈引擎。** 引擎选型是最后一步，不是第一步。

## 十、源码地图：从一次 put 到一次 fsync

如果只想记住几个入口，可以按这张地图读：

**SQLite（B+ 树）**

- `btree.c`：`sqlite3BtreeInsert` 找到游标位置并写入单元格；页满时 `balance_nonroot` 做分裂与重分配。
- `pager.c`：`pager_write` 把页标脏，`sqlite3PagerCommitPhaseOne` 在提交阶段写日志；回滚模式写 journal，WAL 模式把脏页交给 WAL。
- `wal.c`：`sqlite3WalFrames`/`walFrames` 把每个脏页写成「24 字节帧头 + 整页」；提交帧在帧头里记录数据库页数。
- 恢复：单次扫描 WAL，逐帧校验，遇到第一个坏校验和停止；`mxFrame` 取最后一个有效提交帧。

**LevelDB / RocksDB（LSM）**

- `DBImpl::Write`：写 WAL、写 memtable；`MakeRoomForWrite` 在 memtable 满时冻结并触发 flush。
- `VersionSet::PickCompaction`：按 L0 文件数、每层字节数、文件重叠度选择 compaction。
- `DBImpl::BackgroundCompaction`：归并输入文件，写出下一层 SST；`TableBuilder` 负责块与索引。
- Bloom Filter：LevelDB 的 `FilterPolicy`、RocksDB 的 `FullFilterBlockBuilder`，把「key 不在这个文件」的判断压到内存里。

**InnoDB（作为对照，不把本文数字外推）**

- 聚簇索引即表，二级索引叶子存主键；更新写 undo，redo 记录页内变更；change buffer 缓冲二级索引的随机写。
- 崩溃恢复：tablespace discovery → redo apply → 回滚未提交事务 → change buffer merge → purge。官方文档明确说，回滚一个中断事务的时间可能是事务执行时间的三到四倍。
- 半页写由 doublewrite 保护：页先顺序写入 doublewrite 区域并 fsync，再写到数据文件；恢复时用完整副本修复半页。

## 十一、复现实验：脚本、参数与踩坑

核心脚本不长，关键是把「写入」和「测量」分开：

```python
import hashlib, os, random, sqlite3, time
import psutil
from rocksdict import Rdict, Options, WriteBatch

N, BATCH = 1_000_000, 500
keys = [f'user:{i:016d}'.encode() for i in range(N)]
random.shuffle(keys)

def value(k):
    return hashlib.shake_128(k).digest(100)

def io_write():
    return psutil.Process().io_counters().write_bytes

# SQLite
con = sqlite3.connect('bench.db')
con.execute('PRAGMA journal_mode=WAL')
con.execute('PRAGMA synchronous=NORMAL')
con.execute('PRAGMA page_size=4096')
con.execute('CREATE TABLE kv(k TEXT PRIMARY KEY, v BLOB) WITHOUT ROWID')
start, t0 = io_write(), time.perf_counter()
for i in range(0, N, BATCH):
    con.executemany('INSERT INTO kv(k,v) VALUES(?,?)',
                    [(k, value(k)) for k in keys[i:i+BATCH]])
    con.commit()
con.execute('PRAGMA wal_checkpoint(TRUNCATE)')
print('sqlite', time.perf_counter()-t0, io_write()-start)

# RocksDB
opt = Options()
opt.set_write_buffer_size(4 * 1024 * 1024)
opt.set_max_write_buffer_number(3)
opt.set_target_file_size_base(8 * 1024 * 1024)
db = Rdict('bench-rocks', options=opt)
start, t0 = io_write(), time.perf_counter()
for i in range(0, N, BATCH):
    wb = WriteBatch()
    for k in keys[i:i+BATCH]:
        wb[k] = value(k)
    db.write(wb)
db.flush()
print('rocks', time.perf_counter()-t0, io_write()-start)
```

三个踩过的坑：

1. **值必须不可压缩**。第一次实验用 `sha256(k)` 重复拼接成 100 字节，RocksDB 的块压缩把 124 MB 压到 45 MB，写放大和空间放大全部失真。改成 `shake_128(k).digest(100)` 后数字才可比。
2. **进程 I/O 计数不是磁盘物理写入**。它统计的是进程发出的读写字节，包含 WAL、数据文件和 compaction，但不包含文件系统元数据和 SSD 内部写放大。用它做同机对照可靠，做绝对容量规划要留余量。
3. **必须等 compaction 稳定**。RocksDB 写完就立刻读计数器，会把后台还在跑的 compaction 漏掉。脚本里轮询 `rocksdb.stats` 的 compaction 行，连续两次不变才取数。

另外，SQLite 的随机写耗时在不同运行间波动很大（本次 140–202 秒）。原因是 Windows 的写回、杀毒软件扫描和磁盘缓存状态都会影响结果；写放大稳定在 103 倍左右，耗时看趋势即可，不要把它当成精确基准。

## 十二、小结：把问题问对

回到开头的问题：一次写入到底写了几遍盘？

- **B+ 树 + 全页 WAL**：一个事务碰了多少页，就写多少页；随机小事务会把写放大推到几十到上百倍。
- **LSM**：每条记录先顺序写一遍 WAL，再刷 L0，再在 compaction 中逐层重写；写放大取决于层数和 compaction 策略。
- **读**：B+ 树一次下降，读放大稳定；LSM 靠 Bloom Filter 把大多数文件挡在内存里，但读的字节数仍然更多。
- **空间**：B+ 树有页内碎片，LSM 有旧版本和 compaction 临时文件；两者都需要维护。

所以真正该问的不是「LSM 和 B+ 树谁更快」，而是：

1. 我的写入是随机的还是顺序的？事务大小是多少？
2. 我更能接受前台写延迟抖动，还是后台 compaction 抖动？
3. 我的读是点查多还是范围扫描多？p99 的预算是多少？
4. 我用的是哪个具体引擎？它的日志记录整页还是变更？有没有 buffer pool、change buffer、doublewrite？
5. 我能不能监控写放大、读放大、空间放大，并在它们失控前调参？

把这五个问题答完，选型基本就确定了。至于「哪个更先进」，那是论文里的问题，不是生产环境的问题。
