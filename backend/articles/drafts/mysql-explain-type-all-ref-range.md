---
title: MySQL EXPLAIN 执行计划：从 ALL 到 ref 怎么看
slug: mysql-explain-type-all-ref-range
category: database
tags: [MySQL, 索引, 数据库, 性能优化]
status: draft
description: type 是访问类型，不是性能评分。本文按从好到差的顺序解释 system/const/eq_ref/ref/range/index/ALL，讲清 key_len、rows、filtered 和 Extra 里几个真正有用的信号。
---

> 适用读者：每天都在 `EXPLAIN` 但只看 `type` 的人；被 `rows` 估算和实际差十倍坑过的人；想搞清楚 `key_len`、`filtered`、`Extra` 到底该信哪个人
> 结论先行：`EXPLAIN` 的 `type` 描述的是「这张表怎么被访问」，不是「快不快」。`ALL` 不一定是坏消息（小表全扫本来就该全扫），`ref` 也不一定快（回表几十万行照样慢）。真正要盯的是：**`key` 是否为 NULL、`rows` 乘起来有多大、`Extra` 有没有 `Using filesort` / `Using temporary`**。
> 阅读时间：约 18 分钟 | 难度：进阶 | 收获：一张列速查表、type 的完整阶梯、`key_len` 的逐字节算法、`Extra` 信号字典、以及一套拿到慢 SQL 后的排查顺序

**目录**

- 前言：EXPLAIN 不是性能评分
- 先把列名认全
- type 的完整阶梯
- const 与 system：最好的一档
- eq_ref：JOIN 里的唯一匹配
- ref 与 ref_or_null：最常见的「好」
- range：索引上的范围扫描
- index 与 ALL：全扫的两种形态
- index_merge：三个索引凑一个答案
- 子查询里的 unique_subquery 与 index_subquery
- `key_len` 的逐字节算法
- `rows` 与 `filtered`：估算的估算
- `Extra` 信号字典
- `EXPLAIN FORMAT=JSON` 能多看什么
- `EXPLAIN ANALYZE`：让估算和实际对账
- 五种常见误判
- 拿到一条慢 SQL 的排查顺序
- 小结

## 前言：EXPLAIN 不是性能评分

很多人把 `type` 当成性能评分：`const` 是 100 分，`ref` 是 80 分，`ALL` 是 0 分。这个理解会导致两类错误：

- 看到 `ALL` 就急着加索引，结果小表全扫本来比走索引更快；
- 看到 `ref` 就放心，结果 `rows` 是 80 万，回表把 buffer pool 洗了一遍。

`EXPLAIN` 回答的是「优化器打算怎么执行」，不是「执行要多久」。它给出的每个字段都是估算值或结构描述，真正的耗时要靠 `EXPLAIN ANALYZE`、慢查询日志和 `performance_schema`。

本文按「列 → type → key_len → rows/filtered → Extra → 扩展格式 → 排查顺序」的顺序拆一遍。

## 先把列名认全

```sql
EXPLAIN SELECT * FROM users WHERE tenant_id = 7;
```

输出是一张表，常见列如下：

| 列 | 含义 | 怎么用 |
| --- | --- | --- |
| `id` | 查询块编号 | 同一 `id` 内从上到下执行；`id` 越大越先执行 |
| `select_type` | 查询类型 | `SIMPLE`、`PRIMARY`、`SUBQUERY`、`DERIVED`、`UNION` |
| `table` | 访问的表或派生表 | 派生表显示为 `<derivedN>` |
| `partitions` | 命中的分区 | 分区表才有关注价值 |
| `type` | 访问类型 | 本文的重点 |
| `possible_keys` | 可能用到的索引 | 用来判断「有没有候选」 |
| `key` | 实际选用的索引 | `NULL` 表示没用到索引 |
| `key_len` | 实际用到的索引字节数 | 反推用了几列 |
| `ref` | 与索引比较的值或列 | 常量、列名、函数结果 |
| `rows` | 预计扫描行数 | 估算值，不是实际值 |
| `filtered` | 预计通过剩余条件的比例 | 百分比 |
| `Extra` | 额外操作信息 | 信息量最大的一列 |

先记住一条：`possible_keys` 有值而 `key` 为 `NULL`，说明「有索引可用但优化器没选」，这比「压根没有索引」更值得深挖。

## type 的完整阶梯

MySQL 文档给出的顺序，大致从「定位最精确」到「扫描最粗」：

```
system
const
eq_ref
ref
fulltext
ref_or_null
index_merge
unique_subquery
index_subquery
range
index
ALL
```

这个顺序是「访问方式的精确度」，不是严格的性能排序。下面逐档解释。

## const 与 system：最好的一档

`WHERE` 里是主键或唯一索引的等值查询，优化器在编译期就能确定只有一行：

```sql
SELECT * FROM users WHERE id = 1;
SELECT * FROM users WHERE email = 'a@example.com';
```

`type` 为 `const`。如果这张表本身只有一行，`type` 会进一步变成 `system`。

`const` 的前提是「唯一」且「非空」：

- 主键天然唯一非空；
- 唯一索引如果允许 `NULL`，多行 `NULL` 不违反唯一约束，优化器不能保证只有一行，可能退化成 `ref`。

还有一个细节：如果 `WHERE` 里的值在表里不存在，`Extra` 会显示 `no matching row in const table`，`rows` 为 0。这不是错误，是优化器提前知道「查不到」。

## eq_ref：JOIN 里的唯一匹配

`eq_ref` 出现在 JOIN 里：被驱动的表通过**唯一索引**匹配，每行驱动数据只对应一行。

```sql
SELECT o.id, u.email
FROM orders o
JOIN users u ON u.id = o.user_id;
```

如果 `users.id` 是主键，`u` 这一行的 `type` 是 `eq_ref`。如果 `u.id` 不是唯一索引，就会退化成 `ref`。

`eq_ref` 和 `const` 的区别在于「驱动源」：`const` 的匹配值是编译期常量，`eq_ref` 的匹配值来自另一张表的当前行。所以 `eq_ref` 是「每读一行驱动表，就做一次唯一查找」。

## ref 与 ref_or_null：最常见的「好」

普通二级索引的等值查询，可能命中多行：

```sql
SELECT * FROM users WHERE tenant_id = 7;
```

`type = ref`，`key = idx_tenant_status`。这是最常见的「好」状态。但注意：`ref` 只代表能用索引定位，命中多少行要看 `rows`。

`ref_or_null` 是 `ref` 的变体，出现在：

```sql
SELECT * FROM users WHERE tenant_id = 7 OR tenant_id IS NULL;
```

优化器需要同时扫描「等于 7」的区间和「NULL」的区间。它比 `ref` 多一次 NULL 区间扫描，通常不是大问题，但如果 NULL 行很多，`rows` 会明显上升。

## range：索引上的范围扫描

索引上的范围条件：

```sql
SELECT * FROM users WHERE tenant_id = 7 AND status > 1;
SELECT * FROM users WHERE created_at BETWEEN '2026-01-01' AND '2026-02-01';
SELECT * FROM users WHERE email LIKE 'abc%';
```

`type = range`。范围越小越好；如果范围覆盖了大半张表，优化器可能直接选 `ALL`。

`range` 的 `key_len` 通常只覆盖到「范围列」为止。范围列之后的列不能用于定位，只能用于过滤或索引条件下推。这一点在 [MySQL 联合索引最左前缀](https://blog.zhoujun.dev/article/mysql-composite-index-leftmost-prefix/) 里有详细推导。

## index 与 ALL：全扫的两种形态

`index` 是「扫整棵索引」，不是扫表：

```sql
SELECT tenant_id FROM users ORDER BY tenant_id;
```

如果 `Extra` 是 `Using index`，说明只读索引、不回表。`type = index` 常见于「覆盖索引 + 排序」，但如果索引很大，依然很慢。

`ALL` 是全表扫描：

```sql
SELECT * FROM users WHERE status = 1;
```

`status` 没有单独索引（它在联合索引的第二位，不满足最左前缀），只能全表扫。小表（几百行）出现 `ALL` 完全正常；百万行表出现 `ALL` 才需要处理。

两者都可能很快，也都可能很慢。判断依据是「要扫多少页」，不是「名字看起来谁更高级」。

## index_merge：三个索引凑一个答案

当一个 `WHERE` 同时命中多个索引、又没有一条联合索引能覆盖时，优化器可能把多个索引的结果合并：

```sql
SELECT * FROM users WHERE tenant_id = 7 OR email = 'a@example.com';
```

`Extra` 里会出现三种形态：

- `Using intersect(...)`：多个索引结果取交集，对应 `AND`；
- `Using union(...)`：取并集，对应 `OR`；
- `Using sort_union(...)`：取并集但需要排序。

`index_merge` 在实践中不稳定：它要分别扫多个索引，再做集合运算，CPU 和内存开销都不低。通常不如一条设计良好的联合索引。可以用 `optimizer_switch` 关闭它做对比，但不建议在生产环境长期关闭。

## 子查询里的 unique_subquery 与 index_subquery

这两档出现在 `IN` 子查询里：

```sql
SELECT * FROM orders
WHERE user_id IN (SELECT id FROM users WHERE status = 1);
```

- 如果子查询的列是主键或唯一索引，`type` 可能是 `unique_subquery`；
- 如果是普通索引，`type` 可能是 `index_subquery`；
- 如果子查询无法用索引，可能退化成 `ALL` 或物化成派生表。

MySQL 8.0 对子查询做了较多优化（半连接、物化、`derived_merge`），实际计划可能和 5.7 不同。看 `EXPLAIN` 时不要拿旧版本的经验硬套。

## `key_len` 的逐字节算法

`key_len` 是「本次实际用到的索引字节数」。它不能直接告诉你用了哪几列，但结合列类型可以反推。

常见类型的字节数：

| 类型 | 字节数 | 备注 |
| --- | --- | --- |
| `TINYINT` | 1 | |
| `SMALLINT` | 2 | |
| `MEDIUMINT` | 3 | |
| `INT` | 4 | |
| `BIGINT` | 8 | |
| `DATE` | 3 | |
| `DATETIME` | 5 | 小数秒每 1-2 位加 1 字节 |
| `TIMESTAMP` | 4 | 同上 |
| `CHAR(n)` utf8mb4 | `4n` | 可空再 +1 |
| `VARCHAR(n)` utf8mb4 | `4n + 2` | 2 字节存变长长度；可空再 +1 |
| 前缀索引 `col(k)` | `4k + 2` | 只索引前 k 个字符 |
| 任意可空列 | 额外 +1 | NULL 标志位 |

对 `idx_tenant_status (tenant_id BIGINT NOT NULL, status TINYINT NOT NULL)`：

- 只用到 `tenant_id`：`key_len = 8`；
- 两列都用到：`key_len = 9`。

如果两列都可空，`key_len` 会变成 `10`（每列各加 1 字节的 NULL 标志）。

`key_len` 偏小通常意味着三种情况之一：后面的列没写进 `WHERE`、列顺序不满足最左前缀、或者中间出现了范围条件。

还有一个容易踩的坑：`key_len` 只统计索引键本身，不包含 InnoDB 二级索引自动追加的主键。所以不能用它来估算「一条二级索引记录占多少字节」。

## `rows` 与 `filtered`：估算的估算

- `rows`：优化器估算「这次访问要扫描多少行」；
- `filtered`：这些行里预计有多少比例能通过 `WHERE` 的剩余条件。

两者相乘才是「预计真正参与后续计算的行数」。JOIN 时把每张表的 `rows × filtered` 串起来，就能看出这条 SQL 的量级。

估算依赖统计信息。以下几种情况会让 `rows` 严重失真：

- 刚导入大批数据，还没 `ANALYZE TABLE`；
- 表频繁增删，统计信息更新滞后；
- 等值条件太多，超过了 `eq_range_index_dive_limit`，优化器改用统计信息抽样；
- 数据分布倾斜，直方图没有覆盖到。

MySQL 8.0 可以用 `ANALYZE TABLE users UPDATE HISTOGRAM ON status` 生成直方图，改善倾斜列的估算。

## `Extra` 信号字典

`Extra` 是信息量最大的一列。常见的值：

| Extra | 含义 | 要不要处理 |
| --- | --- | --- |
| `Using index` | 覆盖索引，不回表 | 好事 |
| `Using index condition` | 索引条件下推（ICP），减少回表 | 一般好事 |
| `Using where` | 服务器层还要过滤 | 看 `rows` 大小 |
| `Using filesort` | 排序没蹭上索引顺序 | 数据量大时要处理 |
| `Using temporary` | 用了临时表（`GROUP BY` / `DISTINCT` / `UNION`） | 数据量大时要处理 |
| `Using join buffer (Block Nested Loop)` | JOIN 没走索引 | 通常要补索引 |
| `Using join buffer (hash join)` | 8.0.20+ 的哈希连接 | 大表 JOIN 时未必差 |
| `Using index for skip scan` | 8.0.13+ 的索引跳跃扫描 | 知道即可，别当常规方案 |
| `Using index for group-by` | 松散索引扫描，`GROUP BY` 蹭上索引 | 好事 |
| `Backward index scan` | 反向扫描索引 | 正常 |
| `Range checked for each record (index map: N)` | 每行都重新选索引 | 通常要处理 |
| `Select tables optimized away` | 优化器直接算出结果，不用扫表 | 好事 |
| `Impossible WHERE` | 条件恒假，直接返回空 | 正常 |
| `no matching row in const table` | 常量在唯一索引里不存在 | 正常 |
| `Distinct` | 优化器用索引去重 | 好事 |
| `Not exists` | 半连接提前终止 | 好事 |
| `Start temporary` / `End temporary` | 物化临时表参与 JOIN | 看数据量 |

`Using filesort` 不代表一定有磁盘排序，小结果集在内存里排也很快；但 `rows` 很大时，它就是明显的 CPU 和内存开销。

`Using temporary` 也不一定落盘。MySQL 8.0.16 起，内部临时表默认使用 `TempTable` 引擎，超过 `temptable_max_ram` 才会转成磁盘上的 InnoDB 临时表。判断是否落盘要看 `Created_tmp_disk_tables` 计数器。

## `EXPLAIN FORMAT=JSON` 能多看什么

普通 `EXPLAIN` 是表格，信息被压缩过。`FORMAT=JSON` 会给出更细的代价与条件：

```sql
EXPLAIN FORMAT=JSON
SELECT id, uid FROM events
WHERE uid = 1 AND kind = 2;
```

重点看这几项：

- `access_type`：等价于表格里的 `type`；
- `possible_keys` / `key`：候选与实际选择；
- `used_key_parts`：**实际用到了索引的哪几列**，比 `key_len` 更直观；
- `key_length`：等价于 `key_len`；
- `ref`：与索引比较的值；
- `rows_examined_per_scan` / `rows_produced_per_join`：扫描行数与产出行数；
- `filtered`：过滤比例；
- `attached_condition`：被下推或附加的条件；
- `used_columns`：这条查询实际需要读的列；
- `cost_info`：`read_cost`、`eval_cost`、`prefix_cost`、`query_cost`。

`used_key_parts` 是最值得记住的字段。比如 `INDEX(a, b, c)` 上执行 `WHERE a = 1 AND c = 3`，它会明确显示只用了 `["a"]`，比盯着 `key_len` 猜要快得多。

`query_cost` 是优化器估算的总代价，单位是「任意的代价单位」，不是毫秒。它只能用来横向比较两个计划，不能用来预测真实耗时。

## `EXPLAIN ANALYZE`：让估算和实际对账

MySQL 8.0.18 起支持：

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE tenant_id = 7;
```

它会**真正执行**这条 SQL，并输出每个算子的：

- `actual time`：实际耗时（毫秒级）；
- `rows`：实际产出的行数；
- `loops`：该算子被执行的次数；
- `estimated rows`：优化器的估算值。

最常见的用法是对账：

```
-> Index lookup on users using idx_tenant_status (tenant_id=7)
   (cost=... rows=3) (actual time=0.05..0.06 rows=1200 loops=1)
```

估算 3 行、实际 1200 行，说明统计信息或代价模型有问题。先 `ANALYZE TABLE`，再看是否需要用直方图。

注意两点：

- `EXPLAIN ANALYZE` 会执行查询，对 `SELECT` 安全，对写操作要谨慎；
- 它展示的是「这一次执行」的实际情况，缓存冷热、并发负载都会影响结果，不要拿一次采样当定论。

## 五种常见误判

### 隐式类型转换

```sql
-- tenant_id 是 BIGINT，字符串会被转成数字，索引通常仍可用
WHERE tenant_id = '7'

-- email 是 VARCHAR，数字会把整列转成数字，索引失效
WHERE email = 123
```

规则是：转换发生在「常量」上时通常安全，发生在「列」上时索引失效。类型要显式对齐。

### 统计信息过期

刚导入大批数据、或频繁增删的表，`rows` 可能严重失真。先 `ANALYZE TABLE`，再看 `EXPLAIN`。

### 优化器主动放弃索引

命中行数占比太高时，回表成本超过全表扫描，优化器选 `ALL` 是合理的，不是 bug。可以用 `FORCE INDEX` 强行验证一次：如果强行后变快，说明统计信息或代价模型有问题；如果更慢，就接受优化器的选择。

### 索引存在但没被选

`possible_keys` 有值、`key` 为 `NULL`，常见原因有：

- 列顺序不满足最左前缀；
- 条件里对列做了函数运算；
- 隐式类型转换；
- 优化器估算回表成本过高；
- `index_merge` 或 `skip_scan` 抢了选择。

### 把 `LIMIT` 当成万能优化

```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

有索引时很快；没有索引时，`Using filesort` 要先排完整个结果集再取前 10 行。`LIMIT` 不会让排序变便宜，只会让传输变少。

## 拿到一条慢 SQL 的排查顺序

按这个顺序看，基本不会漏：

1. **表有多大**：`SHOW TABLE STATUS` 或 `information_schema.TABLES` 看行数与数据量；
2. **`type` 与 `key`**：有没有 `ALL` / `index`，`key` 是否为 `NULL`；
3. **`rows × filtered`**：量级是否和业务预期差一个数量级；
4. **`Extra`**：有没有 `Using filesort` / `Using temporary` / `Using join buffer`；
5. **`used_key_parts`**：用 `FORMAT=JSON` 确认索引到底用了几列；
6. **对账**：用 `EXPLAIN ANALYZE` 看估算与实际行数；
7. **再改**：加索引、改 SQL、改列顺序，改完再用同样流程对比。

顺手可以打开优化器追踪，看它为什么选了这个计划：

```sql
SET optimizer_trace = 'enabled=on';
SELECT * FROM users WHERE tenant_id = 7;
SELECT TRACE FROM information_schema.OPTIMIZER_TRACE;
SET optimizer_trace = 'enabled=off';
```

`TRACE` 是一段很长的 JSON，里面有每个候选索引的代价估算。它适合排查「为什么没选那条看起来更好的索引」，不适合日常阅读。

## 小结

- `type` 看访问方式，`rows` 看规模，`Extra` 看额外操作，三者一起看才有意义；
- `const` / `eq_ref` / `ref` / `range` 是可用区间，`index` / `ALL` 要看表大小；
- `key_len` 是联合索引用了几列的直接证据，`FORMAT=JSON` 的 `used_key_parts` 更直观；
- `rows` 和 `filtered` 都是估算，必要时用 `EXPLAIN ANALYZE` 对账；
- 加索引前先 `EXPLAIN`，加完再 `EXPLAIN` 对比，不要凭感觉。

---

**相关阅读**

- [MySQL 聚簇索引与二级索引：回表到底贵在哪](https://blog.zhoujun.dev/article/mysql-clustered-index-vs-secondary-index/)
- [MySQL 联合索引最左前缀：为什么 (a,b) 查不了 b](https://blog.zhoujun.dev/article/mysql-composite-index-leftmost-prefix/)
- [索引建了，为什么排序还是没用上？——慢查询实战](https://blog.zhoujun.dev/article/django-slow-query-index-tuning/)
- [B+ 树索引回源：页分裂长什么样](https://blog.zhoujun.dev/article/btree-page-split/)
- [数据库专题](https://blog.zhoujun.dev/topics/database/)
