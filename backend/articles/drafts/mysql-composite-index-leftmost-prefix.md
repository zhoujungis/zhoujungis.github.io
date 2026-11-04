---
title: MySQL 联合索引最左前缀：为什么 (a,b) 查不了 b
slug: mysql-composite-index-leftmost-prefix
category: database
tags: [MySQL, 索引, 数据库, 性能优化]
status: draft
description: 联合索引不是把两列拼在一起，而是按 (a,b) 的顺序建了一棵 B+ 树。本文从 B+ 树的排序规则解释最左前缀、范围查询之后为什么失效、以及联合索引的列顺序该怎么排。
---

> 适用读者：建过 `INDEX(a, b)` 却发现查 `b` 走全表的人；被 `key_len` 数字绕晕的人；想知道联合索引列顺序到底该按什么排的人
> 结论先行：`INDEX(a, b)` 不是「给 a 和 b 各建一棵树」，而是按「先 a 后 b」的字典序建了一棵 B+ 树。想让 b 起作用，必须先能用 a 把扫描范围收窄——这就是最左前缀。它不是优化器的限制，是 B+ 树的物理结构决定的。
> 阅读时间：约 18 分钟 | 难度：进阶 | 收获：从记录排序规则推出最左前缀、用 `key_len` 反推用了几列、六种 WHERE 写法的可用性矩阵、以及一套列顺序决策法

**目录**

- 前言：一条「明明建了索引」的慢查询
- 联合索引在磁盘上是一棵怎样的树
- 最左前缀的严格定义
- 六种 WHERE 写法逐个验证
- 范围查询之后为什么断了
- `key_len`：用了几列的直接证据
- ORDER BY、GROUP BY、DISTINCT 能不能蹭索引
- 索引下推、覆盖索引与最左前缀的关系
- 列顺序怎么排：四步决策
- 前缀索引与函数索引
- Index Skip Scan：8.0 的例外
- 联合索引与多个单列索引怎么选
- 索引不是免费的
- 实战：从一条慢 SQL 到一条索引
- 五个常见误区
- 小结

## 前言：一条「明明建了索引」的慢查询

线上有一条查询：

```sql
SELECT id, uid, kind, ts
FROM events
WHERE kind = 2 AND ts >= '2026-01-01';
```

表上明明有 `INDEX idx_uid_kind_ts (uid, kind, ts)`，但 `EXPLAIN` 显示 `type = ALL`、`key = NULL`。开发者的第一反应通常是「索引没生效」或者「统计信息过期」。

真实原因更简单：这条 SQL 没有给 `uid`。而这棵索引的第一排序键就是 `uid`，没有 `uid` 就无法把扫描范围收窄到一个连续区间，优化器只能退化成全表扫描。

这就是最左前缀。下面从磁盘上的排序规则开始，把它推一遍。

## 联合索引在磁盘上是一棵怎样的树

建一张事件表：

```sql
CREATE TABLE events (
    id      BIGINT PRIMARY KEY AUTO_INCREMENT,
    uid     BIGINT NOT NULL,
    kind    TINYINT NOT NULL,
    ts      DATETIME NOT NULL,
    payload JSON,
    KEY idx_uid_kind_ts (uid, kind, ts)
) ENGINE=InnoDB;
```

`idx_uid_kind_ts` 的叶子项不是「三个独立的键」，而是把三列的值按定义顺序拼成一个复合键，然后按这个复合键排序。排序规则是字典序：

```
先比 uid
uid 相同，再比 kind
kind 相同，再比 ts
```

假设表里有这些记录，叶子链表大致是这样的：

```
(uid=1, kind=1, ts=10:00) → (uid=1, kind=1, ts=10:05)
→ (uid=1, kind=2, ts=09:00) → (uid=1, kind=2, ts=09:30)
→ (uid=2, kind=1, ts=08:00) → (uid=2, kind=3, ts=11:00)
→ ...
```

注意中间那一行：`uid=1, kind=2, ts=09:00` 排在 `uid=1, kind=1, ts=10:05` 后面，尽管它的 `ts` 更早。因为排序先看 `kind`，`kind=2` 整体排在 `kind=1` 之后。

这张图就是最左前缀的全部来源：

- 给定 `uid`，这一段记录在叶子链表上是连续的，能二分定位；
- 只给 `kind`，`kind=2` 的记录散落在每个 `uid` 段里，不连续，没法定位；
- 给 `uid` 和 `ts`、跳过 `kind`，`ts` 只在每个 `kind` 段内有序，跨段无序，也没法定位。

## 最左前缀的严格定义

最左前缀不是「必须用第一列」，而是：

> 从索引的第一列开始，连续匹配若干列；一旦跳过某一列，后面的列都不能再用于「定位」。

这里要区分两个动作：

- **定位（seek）**：用 B+ 树的分支判断把扫描起点收窄到某个叶子区间；
- **过滤（filter）**：在已经读到的记录上逐条判断条件是否成立。

最左前缀约束的是定位，不是过滤。跳过的列仍然可以参与过滤，只是它不能帮你少读页。

对 `INDEX(a, b, c)` 来说：

| WHERE 条件 | 能用于定位的列 | 说明 |
| --- | --- | --- |
| `a = 1` | `a` | 定位到 `a=1` 的连续段 |
| `a = 1 AND b = 2` | `a, b` | 定位到 `(1,2)` 的连续段 |
| `a = 1 AND b = 2 AND c = 3` | `a, b, c` | 精确定位 |
| `a = 1 AND c = 3` | `a` | `c` 只能过滤，因为 `b` 断了 |
| `b = 2` | 无 | 只能全表扫或走别的索引 |
| `a = 1 AND b > 2 AND c = 3` | `a, b` | `c` 在范围扫描后无序，只能过滤 |

## 六种 WHERE 写法逐个验证

还是用 `idx_uid_kind_ts (uid, kind, ts)`。

### 全等值

```sql
SELECT * FROM events
WHERE uid = 1 AND kind = 2 AND ts = '2026-01-01 10:00:00';
```

三列都能定位，`key_len` 是完整长度，`type` 通常是 `ref` 或 `const`（如果三列组合唯一）。

### 前缀等值

```sql
SELECT * FROM events WHERE uid = 1 AND kind = 2;
```

能定位到 `(1,2)` 段。`ts` 没用到，但 `key_len` 会停在 `kind` 的字节数上。

### 只用第一列

```sql
SELECT * FROM events WHERE uid = 1;
```

能定位到 `uid=1` 段，`kind` 和 `ts` 都不能用于定位。

### 跳过中间列

```sql
SELECT * FROM events
WHERE uid = 1 AND ts = '2026-01-01 10:00:00';
```

只能用 `uid` 定位。`ts` 可能出现在 `Extra` 的 `Using index condition` 里，表示它被下推到索引层做过滤，减少了回表次数，但**依然要扫完 `uid=1` 的全部记录**。

很多人在这里产生错觉：看到 `Using index condition` 就以为 `ts` 用上了索引。它确实被用上了，但只是用于过滤，不是用于定位。

### 范围条件

```sql
SELECT * FROM events WHERE uid = 1 AND kind > 1;
```

`uid` 等值 + `kind` 范围，能定位到 `uid=1` 段里 `kind>1` 的起点，然后顺序扫到段尾。`type` 是 `range`。

如果再加 `ts`：

```sql
SELECT * FROM events
WHERE uid = 1 AND kind > 1 AND ts = '2026-01-01 10:00:00';
```

`ts` 不能定位，因为 `kind` 是范围，扫描输出在 `ts` 维度上不再有序。它最多作为 ICP 过滤条件。

### `IN` 与 `OR`

```sql
SELECT * FROM events WHERE uid IN (1, 2) AND kind = 2;
```

`IN` 在优化器里通常被展开成多个等值区间，仍然能用 `uid, kind` 定位，`type` 可能是 `range`。

```sql
SELECT * FROM events WHERE uid = 1 OR uid = 2;
```

同一列上的 `OR` 可以合并成 `IN` 式的范围，仍然能用索引。

```sql
SELECT * FROM events WHERE uid = 1 OR kind = 2;
```

不同列上的 `OR`，单棵联合索引无法同时满足两个分支，优化器可能选 `index_merge`。但 `index_merge` 在实践里经常不如一条合适的联合索引稳定，不要把它当成常规方案。

## 范围查询之后为什么断了

这是最容易被忽略的一条规则。原因还是排序：

对 `INDEX(a, b, c)` 来说，只有在 `a` 的取值被「钉死」之后，`b` 才在整个扫描区间内有序；只有在 `b` 也被钉死之后，`c` 才有序。

一旦 `b` 变成范围（`b > 2`、`b BETWEEN 1 AND 5`、`b LIKE 'abc%'`），扫描输出里 `b` 取了多个值，`c` 在这些 `b` 值之间不再全局有序。B+ 树没法用 `c` 做二分定位，只能逐条比较。

这条规则直接决定列顺序：

> 等值列放前面，范围列放最后。

如果业务里 `ts` 的等值查询也很常见，可以考虑把索引改成 `(uid, ts, kind)`。此时 `uid = 1 AND ts = ?` 能精确定位，`kind` 退化为过滤；而原来的 `(uid, kind, ts)` 在 `uid = 1 AND kind = ?` 下更精确。两条查询谁更常见，就优先照顾谁。

## `key_len`：用了几列的直接证据

`EXPLAIN` 的 `key_len` 表示「本次实际用到的索引字节数」。它不能直接告诉你用了哪几列，但结合列类型可以反推。

常见类型的字节数：

| 类型 | 字节数 | 备注 |
| --- | --- | --- |
| `TINYINT` | 1 | |
| `SMALLINT` | 2 | |
| `MEDIUMINT` | 3 | |
| `INT` | 4 | |
| `BIGINT` | 8 | |
| `DATE` | 3 | |
| `DATETIME` | 5 | 有小数秒时每 1-2 位加 1 字节 |
| `TIMESTAMP` | 4 | 同上 |
| `CHAR(n)` utf8mb4 | `4n` | 可空再 +1 |
| `VARCHAR(n)` utf8mb4 | `4n + 2` | 2 字节存变长长度；可空再 +1 |
| 任意可空列 | 额外 +1 | NULL 标志位 |

对 `idx_uid_kind_ts (uid BIGINT NOT NULL, kind TINYINT NOT NULL, ts DATETIME NOT NULL)`：

- 只用到 `uid`：`key_len = 8`；
- 用到 `uid, kind`：`key_len = 9`；
- 三列全用：`key_len = 14`。

如果 `key_len` 比你预期的小，通常只有三种原因：后面的列没写进 `WHERE`、列顺序不满足最左前缀、或者中间出现了范围条件。

`key_len` 有一个坑：它统计的是「索引键的字节数」，不包含主键后缀。二级索引叶子虽然带主键，但 `key_len` 不会把主键算进去。所以不要用 `key_len` 去推断「二级索引项的总大小」。

## ORDER BY、GROUP BY、DISTINCT 能不能蹭索引

索引本身就是有序的，所以排序、分组、去重都有机会免掉额外操作。

### ORDER BY

```sql
-- 能用索引顺序，免 filesort
SELECT * FROM events WHERE uid = 1 ORDER BY kind, ts;

-- 不行：跳过了 kind
SELECT * FROM events WHERE uid = 1 ORDER BY ts;

-- 不行：uid 是范围，kind 不再全局有序
SELECT * FROM events WHERE uid > 1 ORDER BY kind;
```

规则和 `WHERE` 一样：`ORDER BY` 的列必须是索引列的「最左前缀的延续」，并且前面的列必须是等值条件。如果 `Extra` 出现 `Using filesort`，说明排序没蹭上索引，只能先取出结果再排。

方向也有讲究：

- `ORDER BY kind ASC, ts ASC` 可以正向扫；
- `ORDER BY kind DESC, ts DESC` 可以反向扫，`EXPLAIN` 里可能显示 `Backward index scan`；
- `ORDER BY kind ASC, ts DESC` 方向混用，普通索引不行，需要 MySQL 8.0 的降序索引：`KEY idx (uid, kind ASC, ts DESC)`。

### GROUP BY

```sql
SELECT kind, COUNT(*) FROM events
WHERE uid = 1 GROUP BY kind;
```

如果 `GROUP BY` 的列顺序与索引一致，优化器可以用「松散索引扫描」（`Using index for group-by`）或「紧凑索引扫描」，避免建临时表。否则 `Extra` 会出现 `Using temporary`。

### DISTINCT

```sql
SELECT DISTINCT kind FROM events WHERE uid = 1;
```

`DISTINCT` 本质上也是分组，能蹭索引时不会出现 `Using temporary`。

## 索引下推、覆盖索引与最左前缀的关系

这三个概念经常被混在一起，实际是三件不同的事：

| 机制 | 解决的问题 | 是否还需要回表 |
| --- | --- | --- |
| 最左前缀 | 能不能用索引定位 | 取决于是否覆盖 |
| 索引条件下推（ICP） | 把过滤条件下沉到索引层，减少回表次数 | 需要 |
| 覆盖索引 | 查询所需列都在索引里 | 不需要 |

ICP 由 `optimizer_switch` 里的 `index_condition_pushdown` 控制，默认开启。

一个组合例子：

```sql
SELECT id, uid FROM events
WHERE uid = 1 AND kind = 2 AND ts >= '2026-01-01';
```

- `uid, kind` 用于定位，`ts` 用于范围收窄；
- `Extra` 可能是 `Using index condition`，因为 `ts` 条件下推；
- 如果 `SELECT` 只要 `id, uid`，并且 `ts` 也在索引里，那么整条查询是覆盖的，`Extra` 会同时出现 `Using index`。

注意：**覆盖索引不要求最左前缀**。即使 `WHERE kind = 2` 用不上这棵索引，只要优化器愿意全扫这棵较小的索引，也可能出现 `Using index`。但那是「扫整棵索引」，不是「定位」，性能是另一回事。

## 列顺序怎么排：四步决策

不要按建表字段顺序排索引，按查询形态排。一个可执行的顺序：

1. **先把等值列放最前**：几乎每个查询都会带、且选择性高的列，比如 `tenant_id`、`uid`、`status`；
2. **再把排序列放进来**：如果某个 `ORDER BY` 很稳定，放在等值列之后、范围列之前；
3. **范围列放最后**：`ts`、`amount > ?`、`LIKE 'abc%'`；
4. **最后考虑覆盖列**：把高频 `SELECT` 里的少量列追加到末尾，换 `Using index`。

举两个具体的取舍：

```sql
-- 查询 A：WHERE uid = ? AND kind = ? ORDER BY ts
-- 查询 B：WHERE uid = ? AND ts >= ? AND ts < ?
```

如果 A 远多于 B，用 `(uid, kind, ts)`；如果 B 更多，用 `(uid, ts)` 或 `(uid, ts, kind)`。不要试图用一条索引同时完美服务两种形态，通常会让两边都退化。

区分度（selectivity）不是第一优先级。区分度再高，如果列不在最左且不能被定位，也用不上。正确顺序是：先满足查询形态，再在同等条件下优先高区分度。

查看区分度可以用：

```sql
SELECT COUNT(DISTINCT uid) / COUNT(*) AS uid_sel,
       COUNT(DISTINCT kind) / COUNT(*) AS kind_sel
FROM events;
```

`SHOW INDEX FROM events` 里的 `Cardinality` 是优化器的估算值，不是精确值。大批量导入或频繁增删后，先 `ANALYZE TABLE events` 再观察。

## 前缀索引与函数索引

### 前缀索引

```sql
ALTER TABLE users ADD KEY idx_email (email(20));
```

它只对 `email` 的前 20 个字符建索引，适合超长字符串。代价是：

- 只能用于前缀匹配（`LIKE 'abc%'`、等值查询的定位仍然可以）；
- 不能覆盖：索引里只有前 20 个字符，要返回完整 `email` 仍然要回表；
- `ORDER BY email` 不一定能完全走索引，因为前缀有序不等于全值有序。

选择前缀长度的常用办法是比较「前缀区分度」与「全值区分度」：

```sql
SELECT COUNT(DISTINCT LEFT(email, 20)) / COUNT(*) AS prefix_sel,
       COUNT(DISTINCT email) / COUNT(*) AS full_sel
FROM users;
```

前缀区分度接近全值区分度时，再短一点也可以。

### 函数索引

MySQL 8.0.13 起支持函数索引：

```sql
ALTER TABLE events ADD KEY idx_ts_date ((DATE(ts)));
```

这样 `WHERE DATE(ts) = '2026-01-01'` 就能走索引，而不必把函数写到 `WHERE` 里再失效。函数索引的表达式必须被查询逐字匹配，写法不一致时仍然用不上。

## Index Skip Scan：8.0 的例外

MySQL 8.0.13 引入了 Index Skip Scan，用于「联合索引的第一列没出现在条件里」的场景。它的大致思路是：既然第一列的不同值不多，就把第一列每个值都当作一个虚拟前缀，分别去查第二列。

```sql
-- 索引 (uid, kind, ts)
SELECT * FROM events WHERE kind = 2;
```

在满足条件时，`EXPLAIN` 可能显示 `Using index for skip scan`。

但它有几个限制：

- 第一列的基数必须较低（不同值不能太多），否则虚拟前缀的数量会爆炸；
- 第一列不能已经有等值或范围条件；
- 需要 `optimizer_switch` 里的 `skip_scan` 开启，默认是开的；
- 它只是「让原本不可用的索引变得勉强可用」，通常仍然不如直接建一条 `(kind, ...)` 的索引。

所以正确的态度是：知道它存在，但不要把它当成「最左前缀失效了」的兜底方案。

## 联合索引与多个单列索引怎么选

假设有两条查询：`WHERE uid = ?` 和 `WHERE kind = ?`。可以建两个单列索引，也可以建一个 `(uid, kind)`。怎么选？

| 方案 | 优点 | 缺点 |
| --- | --- | --- |
| 两个单列索引 | 两条查询各自精确 | 索引数量多，写放大；同时查两列时可能走 `index_merge` |
| 一条 `(uid, kind)` | 同时查两列时最优；`uid` 单独查也能用 | `kind` 单独查用不上 |

判断依据是查询形态的分布，不是「索引越少越好」。如果两条查询频率接近，两个单列索引可能更合适；如果 `WHERE uid = ? AND kind = ?` 是主流，一条联合索引更划算。

`index_merge` 的三种形态在 `Extra` 里表现为：

- `Using intersect(...)`：多个索引结果取交集；
- `Using union(...)`：取并集；
- `Using sort_union(...)`：并集但需要排序。

实践里 `index_merge` 经常被优化器误选，可以用 `optimizer_switch` 关闭它做对比，但关闭是全局行为，不建议在生产环境长期这么干。

## 索引不是免费的

每个二级索引都是一棵独立的 B+ 树，写入时要同步维护：

- `INSERT` 要往每棵索引里插一条；
- `UPDATE` 改了索引列要删旧插新；
- `DELETE` 要在每棵树里标记删除；
- 页分裂、buffer pool、redo/undo 都会被放大。

索引越多，写入越慢，buffer pool 越紧张，DDL 越重。正确的做法不是「为每个查询建一条索引」，而是：

1. 先用慢查询日志和 `performance_schema` 找出真正的慢 SQL；
2. 用 `EXPLAIN` 确认它缺的是定位、覆盖还是排序；
3. 只为高频、明确的查询建索引；
4. 定期用 `sys.schema_unused_indexes` 找从未被使用的索引。

## 实战：从一条慢 SQL 到一条索引

回到开头那条：

```sql
SELECT id, uid, kind, ts
FROM events
WHERE kind = 2 AND ts >= '2026-01-01';
```

### 第一步：确认现状

```sql
EXPLAIN SELECT id, uid, kind, ts
FROM events
WHERE kind = 2 AND ts >= '2026-01-01';
```

如果 `key = NULL`、`type = ALL`，说明没有可用索引。

### 第二步：判断查询形态

- `kind` 是等值；
- `ts` 是范围；
- `uid` 没出现，所以原来的 `(uid, kind, ts)` 用不上。

### 第三步：设计候选索引

```sql
ALTER TABLE events ADD KEY idx_kind_ts (kind, ts);
```

等值列 `kind` 在前，范围列 `ts` 在后，符合规则。

### 第四步：验证

```sql
EXPLAIN SELECT id, uid, kind, ts
FROM events
WHERE kind = 2 AND ts >= '2026-01-01';
```

预期 `type = range`、`key = idx_kind_ts`、`key_len` 等于 `kind` 加 `ts` 的字节数。再对比 `rows` 与 `filtered`，确认扫描量级符合预期。

### 第五步：考虑覆盖

如果这条查询频率很高，并且 `SELECT` 只取 `id, uid, kind, ts`，可以把 `uid` 追加到末尾：

```sql
ALTER TABLE events ADD KEY idx_kind_ts_uid (kind, ts, uid);
```

这样 `id`（主键）和 `uid` 都在索引里，查询可以变成覆盖索引。代价是索引更大、写入更慢，需要用写入量换读取量。

## 五个常见误区

误区一：「`(a, b)` 建了，查 `b` 也能用」。不能。要么建 `(b, a)`，要么单独建 `(b)`。

误区二：「把区分度最高的列放最左一定最好」。区分度只影响筛掉多少行；如果不满足最左前缀，再高的区分度也用不上。

误区三：「在索引列上做运算也能用索引」。`WHERE DATE(ts) = '2026-01-01'`、`WHERE uid + 1 = 2` 都会让普通索引失效。改成范围查询，或者建函数索引。

误区四：「隐式转换只会影响性能，不会影响结果」。`WHERE varchar_col = 123` 会把列转成数字，索引失效；某些边界值还可能产生意外的匹配结果。类型要显式对齐。

误区五：「`Using index condition` 说明索引列全用上了」。它只说明有条件下推，不代表最左前缀完整。

## 小结

- 联合索引是一棵按列顺序排序的树，最左前缀由物理顺序决定；
- 范围列之后的列不能用于定位，只能用于过滤；
- 列顺序 = 等值列 → 排序列 → 范围列 → 覆盖列；
- `key_len` 是「用了几列」的直接证据，但要记得 `VARCHAR` 的 2 字节长度和可空列的 1 字节；
- 用 `EXPLAIN`、`EXPLAIN ANALYZE` 和 `performance_schema` 验证，别靠感觉。

---

**相关阅读**

- [MySQL 聚簇索引与二级索引：回表到底贵在哪](https://blog.zhoujun.dev/article/mysql-clustered-index-vs-secondary-index/)
- [B+ 树索引回源：页分裂长什么样](https://blog.zhoujun.dev/article/btree-page-split/)
- [MySQL EXPLAIN 执行计划：从 ALL 到 ref 怎么看](https://blog.zhoujun.dev/article/mysql-explain-type-all-ref-range/)
- [索引建了，为什么排序还是没用上？——慢查询实战](https://blog.zhoujun.dev/article/django-slow-query-index-tuning/)
- [数据库专题](https://blog.zhoujun.dev/topics/database/)
