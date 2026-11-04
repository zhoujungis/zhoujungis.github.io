---
title: MySQL 聚簇索引与二级索引：回表到底贵在哪
slug: mysql-clustered-index-vs-secondary-index
category: database
tags: [MySQL, 索引, 数据库, 性能优化]
status: draft
description: 聚簇索引叶子存整行、二级索引叶子存主键，回表就是拿主键再走一次 B+ 树。本文用执行计划和 buffer pool 解释这笔随机 IO 到底贵在哪，以及覆盖索引怎么把它省掉。
---

> 适用读者：写过 `EXPLAIN`、看到过 `Using index` 却说不清它省掉了什么的人；被「加了索引反而更慢」坑过一次的人；正在决定主键用自增 `BIGINT` 还是 UUID 的人
> 结论先行：InnoDB 的表本身就是一棵聚簇索引，叶子节点存整行；二级索引的叶子只存「索引列 + 主键」。所谓回表，就是先在二级索引里拿到主键，再拿主键去聚簇索引里查整行——**多一次 B+ 树查找，而且大概率是一次随机页访问**。覆盖索引之所以快，不是玄学，是它把这次查找整个删掉了。
> 阅读时间：约 18 分钟 | 难度：进阶 | 收获：一张表为什么有两棵树、回表的三笔成本账、主键长度如何放大所有二级索引、以及一套用 `EXPLAIN` 与 `performance_schema` 验证回表的办法

**目录**

- 前言：两条 SELECT，差在哪
- 一张表到底有几棵 B+ 树
- 聚簇索引的叶子里到底存了什么
- 二级索引的叶子里为什么一定有主键
- InnoDB 为什么不学 MyISAM 存行地址
- 回表的一次完整旅程
- 回表贵在哪：三笔账
- 主键长度如何放大所有二级索引
- 覆盖索引：把第二次查找删掉
- `Using index condition` 不是覆盖索引
- 覆盖索引的代价
- 什么时候该主动保留回表
- 怎么观测回表：四条证据
- 一张决策表与三个常见误区
- 小结

## 前言：两条 SELECT，差在哪

先看两条几乎一样的 SQL：

```sql
SELECT id, user_id FROM orders WHERE user_id = 42;
SELECT id, user_id, amount FROM orders WHERE user_id = 42;
```

两条都走 `idx_user`，都只命中几十行，区别只在于多取了一个 `amount`。但第二条在 `EXPLAIN` 的 `Extra` 里会多出一次隐式的「回表」，在高并发下可能比第一条慢一个数量级。

很多人把这件事归因为「MySQL 优化器不行」，其实不是。第二条 SQL 要求一个不在索引里的列，存储引擎只能拿着主键回到聚簇索引再取一次。这个动作有非常明确的物理成本，也有非常明确的消除办法。本文就把这条路径拆开，讲清楚回表到底贵在哪、什么时候值得消除、什么时候不该消除。

## 一张表到底有几棵 B+ 树

建一张最普通的订单表：

```sql
CREATE TABLE orders (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    status      TINYINT NOT NULL,
    amount      INT NOT NULL,
    created_at  DATETIME NOT NULL,
    KEY idx_user (user_id),
    KEY idx_status (status)
) ENGINE=InnoDB;
```

在 InnoDB 里，这张表实际对应三棵 B+ 树：

| 索引 | 叶子节点存什么 | 主要服务于 |
| --- | --- | --- |
| 聚簇索引 `PRIMARY` | 整行记录（`id, user_id, status, amount, created_at`） | 按主键定位、回表 |
| 二级索引 `idx_user` | `user_id` + 主键 `id` | `WHERE user_id = ?` |
| 二级索引 `idx_status` | `status` + 主键 `id` | `WHERE status = ?` |

三棵树共享同一套页结构：16 KB 一页，内部页存「子页的最小键 + 页号」，叶子页存真正的记录，叶子之间用双向链表串起来。区别只在叶子节点装的内容。

这也解释了一个常见疑问：为什么「表的大小」和「索引的大小」不能相加成「总数据量」。聚簇索引的叶子就是数据本身，二级索引是额外的副本，只带索引列和主键。

## 聚簇索引的叶子里到底存了什么

「叶子存整行」这句话太粗。InnoDB 的行记录（`RECORD`）在页里是分成几段的：

- 5 字节的记录头：包含 `info_bits`、`n_owned`、`heap_no`、记录类型和指向下一条记录的偏移；
- 6 字节的 `DB_TRX_ID`：最后修改这一行的事务 ID，MVCC 靠它判断可见性；
- 7 字节的 `DB_ROLL_PTR`：指向 undo log 里这条记录的旧版本；
- 列数据：先放主键列，再放其余列，中间按表的列定义顺序排列；
- 可空列的 NULL 标志位图；
- 变长列的长度数组。

所以聚簇索引的叶子不只是「业务数据」，还背着事务与回滚信息。这也是为什么聚簇索引的页通常比二级索引的页「重」：同样 16 KB，装的记录条数更少。

如果建表时没有显式主键，InnoDB 会按以下顺序选聚簇索引：

1. 有 `PRIMARY KEY`，用它；
2. 没有主键，选第一个所有列都 `NOT NULL` 的 `UNIQUE` 索引；
3. 都没有，生成一个 6 字节的隐藏列 `DB_ROW_ID`，用它建聚簇索引。

第三条很关键：没有主键的表不是「没有聚簇索引」，而是「用一个你看不见的列做聚簇索引」。这个隐藏列会同时出现在所有二级索引的叶子里，你既不能查它，也不能控制它的生成顺序。

## 二级索引的叶子里为什么一定有主键

从上面的表可以看出，二级索引叶子存的是「索引列 + 主键」，而不是「索引列 + 行地址」。这不是实现细节，而是 InnoDB 的硬约束。

在 `dict_index_t` 里，有一个字段叫 `n_uniq`，表示「能让一条索引记录唯一的字段数」。对二级索引来说，`n_uniq` 等于索引列数加上主键列数。原因是索引列本身可能重复：`user_id = 42` 可能对应几百行，B+ 树必须再补上主键，才能把每条记录排成严格的全序。

于是二级索引的排序规则变成：

```
先比 user_id，user_id 相同再比 id
```

这条规则带来两个直接后果：

- 二级索引里天然包含主键，所以 `SELECT id FROM orders WHERE user_id = 42` 是覆盖索引，不需要回表；
- 主键列越长，每个二级索引项就越大，一棵二级索引能装的项数就越少。

这两个后果在后面的「主键长度」一节会展开。

## InnoDB 为什么不学 MyISAM 存行地址

MyISAM 的二级索引叶子存的是行地址（文件偏移），回表就是一次指针跳转，看起来更省。InnoDB 不这么做，是因为**行会移动**：

- 页分裂时，记录要从满页搬到新页，物理位置变了；
- `OPTIMIZE TABLE`、`ALTER TABLE` 重建表，整张表的页序可能重排；
- 在线 DDL 重建、表空间回收，也会改变记录所在的页；
- 行本身被更新得更长时，可能触发「记录溢出」或页内重排。

如果二级索引存的是物理地址，上面每一次移动都要同步改所有二级索引，写入成本会被放大成「改一行、改全部索引」。而主键是逻辑标识：行搬到哪一页，主键都不变，二级索引不需要跟着改。

代价也很明确：回表不能靠一次指针跳转完成，必须重新走一次 B+ 树。InnoDB 选择用「读放大」换「写放大」，这是 OLTP 场景下的合理取舍。页分裂的具体过程见 [B+ 树索引回源：页分裂长什么样](https://blog.zhoujun.dev/article/btree-page-split/)。

## 回表的一次完整旅程

还是这条 SQL：

```sql
SELECT id, user_id, amount FROM orders WHERE user_id = 42;
```

执行路径可以拆成七步：

1. 在 `idx_user` 的根页开始，按 `user_id = 42` 做分支判断，一路向下；
2. 到达叶子页后，沿叶子链表横向扫描，收集所有 `user_id = 42` 的记录；
3. 每条记录里带着主键 `id`；
4. 用这个 `id` 回到聚簇索引的根页；
5. 在聚簇索引里再做一次分支判断，走到对应的叶子页；
6. 在叶子页里定位到这条记录，读出 `amount`；
7. 对下一个主键重复第 4 到第 6 步。

如果命中了 100 行，第 4 到第 6 步就要做 100 次。**每一轮都是一次独立的 B+ 树查找**，而不是「顺着链表继续读」。

更糟的是，这 100 个主键在聚簇索引里通常不连续。`idx_user` 是按 `user_id` 排的，聚簇索引是按 `id` 排的，两种顺序没有关系。于是第 4 步的落点会在聚簇索引里来回跳：这页读一下、那页读一下，每次没命中 buffer pool 就是一次磁盘随机读。

## 回表贵在哪：三笔账

### 第一笔：随机页访问

B+ 树的一次查找，成本约等于「树高次页访问」。三层树、命中 buffer pool 时是三次内存访问；没命中就是三次磁盘 IO 里的若干次。回表把「一次查找」变成「一次查找 + N 次查找」，N 是命中行数。

顺序扫描的成本是「页数 × 每页代价」，随机回表的成本是「行数 × 每次查找代价」。当命中行数占表比例很高时，后者的页访问次数会超过前者，优化器就会放弃索引改选 `ALL`——这不是优化器抽风，是它算过账。

### 第二笔：buffer pool 污染

buffer pool 是有限的热点缓存。回表会把聚簇索引的页读进来，这些页可能只被用一次就再也不用了，却把真正热点的页挤了出去。命中率一旦下降，后续所有查询都会变慢，影响面远超过这一条 SQL。

这也是为什么「偶尔跑一次的导出 SQL」能把线上拖垮：它不一定是慢在 CPU，而是慢在把 buffer pool 洗了一遍。

### 第三笔：CPU 与锁

每次回表都要重新走一遍分支判断、比较键值、解记录头。单次很便宜，乘以几十万行就不可忽略。

如果是 `SELECT ... FOR UPDATE` 或 `UPDATE`，回表还意味着要在聚簇索引的记录上加锁。锁的粒度和加锁顺序都会因此变化，死锁概率也跟着上升。锁的坐标系统见 [InnoDB 锁的边界：Next-Key 与间隙锁](https://blog.zhoujun.dev/article/innodb-next-key-gap-lock-deep-dive/)。

## 主键长度如何放大所有二级索引

二级索引的每个叶子项都带主键。主键从 8 字节的 `BIGINT` 换成 36 字节的 `CHAR(36)` UUID，每个二级索引项就多出 28 字节。这个数字要乘以：

- 每张表的二级索引数量；
- 每个索引的记录条数；
- 每次写入要维护的索引页数。

结果不是「多 28 字节」，而是「所有二级索引整体膨胀一截」。同样 16 KB 的页，能装的索引项变少，树可能从三层变四层，每次查找多一次页访问。

还有一个更隐蔽的问题：随机 UUID 作为聚簇索引键，插入位置随机落在树的各个位置，会持续触发页分裂，页的填充率下降，表空间膨胀。自增主键则总是插在最右侧，页分裂少得多。

如果业务确实需要 UUID，有两个折中：

- 用 `UUID_TO_BIN(uuid, 1)` 把时间高位调到前面，让生成的二进制值近似有序；
- 用「自增主键 + 业务唯一键」的组合，把 UUID 降级成普通唯一索引，而不是聚簇索引。

## 覆盖索引：把第二次查找删掉

如果查询需要的列全部在二级索引里，就不需要回表：

```sql
SELECT id, user_id FROM orders WHERE user_id = 42;
```

`id` 和 `user_id` 都在 `idx_user` 的叶子里，存储引擎读完索引就能返回结果。`EXPLAIN` 的 `Extra` 会显示 `Using index`。

判断「是不是覆盖索引」有一条简单规则：**把 `SELECT`、`WHERE`、`ORDER BY`、`GROUP BY` 里出现的列全部列出来，看它们是否都在同一条索引里**。注意 InnoDB 的二级索引自动带主键，所以主键不用额外加。

几个容易误判的例子：

```sql
-- 覆盖：只用到索引列和主键
SELECT id FROM orders WHERE status = 1;

-- 不覆盖：amount 不在 idx_user 里
SELECT id, amount FROM orders WHERE user_id = 42;

-- 覆盖：COUNT(*) 不需要读任何业务列
SELECT COUNT(*) FROM orders WHERE user_id = 42;
```

第三条常被误解。`COUNT(*)` 不要求读整行，只要数索引项，优化器通常会挑一棵较小的二级索引来扫，`Extra` 里能看到 `Using index`。

## `Using index condition` 不是覆盖索引

这两个词长得很像，含义完全不同：

| Extra | 含义 | 还要回表吗 |
| --- | --- | --- |
| `Using index` | 覆盖索引，所需列都在索引里 | 不需要 |
| `Using index condition` | 索引条件下推（ICP），部分条件下沉到引擎层过滤 | 需要 |

ICP 的作用是「少回表」，不是「不回表」。举例：

```sql
SELECT id, amount FROM orders
WHERE user_id = 42 AND status = 3;
```

索引是 `idx_user (user_id)`，`status` 不在索引里。没有 ICP 时，引擎会先把 `user_id = 42` 的行全部回表，再在服务器层过滤 `status`。有 ICP 时，引擎在索引上先判断 `status`，只把通过的行回表。

优化器开关是 `optimizer_switch` 里的 `index_condition_pushdown`，默认开启。可以用下面的语句确认：

```sql
SELECT @@optimizer_switch\G
```

如果某条 SQL 的 `Extra` 只有 `Using index condition` 而没有 `Using index`，说明它仍然回表，只是回表次数被压低了。

## 覆盖索引的代价

覆盖索引不是免费的，代价写在写入路径上：

- **索引变大**：把 `amount`、`created_at` 这类列塞进联合索引，索引页数上升，buffer pool 占用上升；
- **写入变慢**：每次 `INSERT` / `UPDATE` 都要多维护一列，页分裂和日志量都增加；
- **DDL 更重**：加列、改列类型要重建整棵索引；
- **优化器选择变复杂**：索引太多，优化器可能选错，`possible_keys` 列出一堆候选。

所以正确顺序是：先用 `EXPLAIN` 确认回表确实是瓶颈，再考虑把列加进索引；不要为了「看起来覆盖」把所有列都塞进去。一个宽覆盖索引的维护成本，可能比它省下的回表更贵。

## 什么时候该主动保留回表

有些场景回表反而是对的：

- **命中行数占比很高**：比如 `status = 1` 覆盖了 80% 的行，全表扫描比「扫索引 + 逐行回表」更省；
- **查询只跑一次**：报表、后台导出、离线任务，回表成本可以接受，不值得为它加一个宽索引；
- **列很少被查**：为了一个低频查询维护一个常驻索引，性价比是负的；
- **写入远多于读取**：索引的维护成本会压过读取收益。

优化的目标不是「消灭回表」，而是「让贵的回表变少，让便宜的全表扫描被允许发生」。这也是为什么 `EXPLAIN` 里出现 `ALL` 不一定是坏事，见 [MySQL EXPLAIN 执行计划：从 ALL 到 ref 怎么看](https://blog.zhoujun.dev/article/mysql-explain-type-all-ref-range/)。

## 怎么观测回表：四条证据

### 证据一：`EXPLAIN` 的 `Extra`

```sql
EXPLAIN SELECT id, user_id, amount FROM orders WHERE user_id = 42;
```

看三处：

- `key`：用了哪条索引；
- `rows`：预计扫多少行；
- `Extra`：有没有 `Using index`。

有 `Using index` 就是覆盖；只有 `Using index condition` 或 `Using where`，说明还要回表。

### 证据二：`Handler_read_*` 计数器

```sql
FLUSH STATUS;
SELECT id, user_id, amount FROM orders WHERE user_id = 42;
SHOW SESSION STATUS LIKE 'Handler_read%';
```

- `Handler_read_key`：按索引键定位的次数；
- `Handler_read_next`：沿索引顺序读下一条的次数；
- `Handler_read_rnd_next`：全表或无序读的次数。

回表会表现为 `Handler_read_key` 明显大于返回行数。这个计数器是会话级的，适合对比「改索引前后」。

### 证据三：buffer pool 命中率

```sql
SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_read%';
```

- `Innodb_buffer_pool_read_requests`：逻辑读请求数；
- `Innodb_buffer_pool_reads`：真正落到磁盘的读次数。

两个值的比值就是命中率。回表把命中率拉低时，`reads` 会明显上升。注意这是全局累计值，要取两次采样的差值，不要直接看绝对值。

### 证据四：索引使用统计

```sql
SELECT object_name, index_name, count_star, count_read
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE object_name = 'orders';
```

`count_read` 能看出每条索引到底被读了多少次。长期为 0 的索引就是纯维护成本，可以考虑下线；MySQL 8.0 还支持 `ALTER TABLE ... ALTER INDEX ... INVISIBLE`，先隐藏观察，再决定删除。

## 一张决策表与三个常见误区

| 场景 | 建议 | 理由 |
| --- | --- | --- |
| 高频查询只取少列 | 做联合覆盖索引 | 直接省掉回表 |
| 低频报表查询 | 允许回表甚至全表扫 | 加索引的维护成本更高 |
| 命中行数占比高 | 让优化器选 `ALL` | 顺序扫通常优于大量随机回表 |
| 主键是长 UUID | 换有序主键或 `UUID_TO_BIN` | 主键会放大所有二级索引 |
| 宽表 `SELECT *` | 改成显式列清单 | 减少不必要的回表与传输 |

误区一：「加了索引就一定快」。索引把「扫全表」换成了「扫索引 + N 次回表」，N 很大时会更慢。

误区二：「二级索引里没有 id，所以要手动把 id 加进联合索引」。不需要，InnoDB 二级索引叶子天然带主键。

误区三：「`Using index condition` 就是覆盖索引」。不是，它只是把过滤下推，仍然要回表。

## 小结

| 问题 | 答案 |
| --- | --- |
| 回表是什么 | 二级索引拿到主键后，再去聚簇索引取整行 |
| 为什么贵 | 多一次 B+ 树查找，通常是随机页访问 |
| 怎么避免 | 覆盖索引、合理联合索引、避免 `SELECT *`、短主键 |
| 怎么确认 | `EXPLAIN` 看 `Extra` 是否有 `Using index` |
| 什么时候别避免 | 命中行数占比高、低频查询、写入密集 |

---

**相关阅读**

- [B+ 树索引回源：页分裂长什么样](https://blog.zhoujun.dev/article/btree-page-split/)
- [MySQL 联合索引最左前缀：为什么 (a,b) 查不了 b](https://blog.zhoujun.dev/article/mysql-composite-index-leftmost-prefix/)
- [MySQL EXPLAIN 执行计划：从 ALL 到 ref 怎么看](https://blog.zhoujun.dev/article/mysql-explain-type-all-ref-range/)
- [InnoDB 锁的边界：Next-Key 与间隙锁](https://blog.zhoujun.dev/article/innodb-next-key-gap-lock-deep-dive/)
- [数据库专题](https://blog.zhoujun.dev/topics/database/)
