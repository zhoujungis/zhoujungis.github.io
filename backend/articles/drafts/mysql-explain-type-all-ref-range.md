---
title: MySQL EXPLAIN 执行计划：从 ALL 到 ref 怎么看
slug: mysql-explain-type-all-ref-range
category: database
tags: [MySQL, 索引, 数据库, 性能优化]
status: draft
description: type 是访问类型，不是性能评分。本文按从好到差的顺序解释 system/const/eq_ref/ref/range/index/ALL，讲清 key_len、rows、filtered 和 Extra 里几个真正有用的信号。
---

> 结论先行：`EXPLAIN` 的 `type` 描述的是「这张表怎么被访问」，不是「快不快」。`ALL` 不一定是坏消息（小表全扫本来就该全扫），`ref` 也不一定快（回表几十万行照样慢）。真正要盯的是：**`key` 是否为 NULL、`rows` 乘起来有多大、`Extra` 有没有 `Using filesort` / `Using temporary`**。

## 先看一张表

```sql
CREATE TABLE users (
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    email      VARCHAR(120) NOT NULL,
    tenant_id  BIGINT NOT NULL,
    status     TINYINT NOT NULL,
    created_at DATETIME NOT NULL,
    UNIQUE KEY uk_email (email),
    KEY idx_tenant_status (tenant_id, status)
) ENGINE=InnoDB;
```

以下例子都基于这张表。

## EXPLAIN 的 type 有哪些，哪个最好？

### const / system

`WHERE` 里是主键或唯一索引的等值查询，优化器在编译期就能确定只有一行：

```sql
SELECT * FROM users WHERE id = 1;
SELECT * FROM users WHERE email = 'a@example.com';
```

`type` 为 `const`。这是最好的一档，代价基本可以忽略。

### eq_ref

出现在 JOIN 里：被驱动的表通过**唯一索引**匹配，每行驱动数据只对应一行：

```sql
SELECT o.id, u.email
FROM orders o
JOIN users u ON u.id = o.user_id;
```

`u` 这一行的 `type` 是 `eq_ref`。如果 `u.id` 不是唯一索引，就会退化成 `ref`。

### ref

普通二级索引的等值查询，可能命中多行：

```sql
SELECT * FROM users WHERE tenant_id = 7;
```

`type = ref`，`key = idx_tenant_status`。这是最常见的「好」状态。注意 `ref` 只代表能用索引定位，命中多少行要看 `rows`。

### range

索引上的范围扫描：

```sql
SELECT * FROM users WHERE tenant_id = 7 AND status > 1;
SELECT * FROM users WHERE created_at BETWEEN '2026-01-01' AND '2026-02-01';
```

`type = range`。范围越小越好；如果范围覆盖了大半张表，优化器可能直接选 `ALL`。

### index

「扫整棵索引」，不是扫表。比 `ALL` 好一点，因为索引页通常比数据页小：

```sql
SELECT tenant_id FROM users ORDER BY tenant_id;
```

如果 `Extra` 是 `Using index`，说明只读索引、不回表。`type = index` 常见于「覆盖索引 + 排序」，但如果索引很大，依然很慢。

### ALL

全表扫描：

```sql
SELECT * FROM users WHERE status = 1;
```

`status` 没有单独索引（它在联合索引的第二位，不满足最左前缀），只能全表扫。小表（几百行）出现 `ALL` 完全正常；百万行表出现 `ALL` 才需要处理。

### 中间还有两档

- `index_merge`：优化器把多个索引的结果合并（`UNION` / `INTERSECT`），实践里不稳定，通常不如一条合适的联合索引；
- `ref_or_null`：`WHERE col = ? OR col IS NULL` 时出现。

## key_len 怎么看出用了几列索引？

`key_len` 是「本次实际用到的索引字节数」，可以反推用到了几列。常见类型的字节数：

| 类型 | 字节数 |
| --- | --- |
| `TINYINT` | 1 |
| `INT` | 4 |
| `BIGINT` | 8 |
| `DATETIME`（无小数秒） | 5 |
| `VARCHAR(n)` utf8mb4 | 4 × n |
| 可空列 | 额外 +1 |

对 `idx_tenant_status (tenant_id BIGINT, status TINYINT)`：

- 只用到 `tenant_id`：`key_len = 8`；
- 两列都用到：`key_len = 9`。

如果 `key_len` 比你预期的小，说明后面的列没被用上——通常是范围查询或列顺序不满足最左前缀。细节见 [MySQL 联合索引最左前缀](https://blog.zhoujun.dev/article/mysql-composite-index-leftmost-prefix/)。

## rows 和 filtered 分别代表什么？

- `rows`：优化器估算要扫描多少行；
- `filtered`：这些行里预计有多少比例能通过 `WHERE` 剩余条件。

`rows × filtered` 才是「预计真正参与后续计算的行数」。JOIN 时把每张表的 `rows` 乘起来，就能看出这条 SQL 的量级。估算依赖统计信息，跑了很久没 `ANALYZE TABLE` 的表可能偏差很大。

MySQL 8.0.18+ 可以用 `EXPLAIN ANALYZE`，它会真正执行并给出每步的实际耗时和行数——排查「估算 10 行、实际 10 万行」这类问题非常有用。

## Extra 里哪些信号需要处理？

| Extra | 含义 | 要不要处理 |
| --- | --- | --- |
| `Using index` | 覆盖索引，不回表 | 好事 |
| `Using index condition` | 索引条件下推（ICP），减少回表 | 一般好事 |
| `Using where` | 服务器层还要过滤 | 看 `rows` 大小 |
| `Using filesort` | 排序没蹭上索引顺序 | 数据量大时要处理 |
| `Using temporary` | 用了临时表（GROUP BY / DISTINCT / UNION） | 数据量大时要处理 |
| `Using join buffer` | JOIN 没走索引，用了连接缓冲 | 通常要补索引 |

`Using filesort` 不代表一定有磁盘排序，小结果集在内存里排也很快；但 `rows` 很大时，它就是明显的 CPU 和内存开销。

## 拿到一条慢 SQL 应该按什么顺序排查？

拿到一条慢 SQL，按这个顺序看：

1. `type` 里有没有 `ALL` 或 `index`，表有多大；
2. `key` 是不是 `NULL`，是的话为什么（函数、类型不匹配、最左前缀、隐式转换）；
3. `rows` 和 `filtered` 的量级，是否和业务预期差一个数量级；
4. `Extra` 有没有 `Using filesort` / `Using temporary`；
5. 最后才考虑加索引，加完用 `EXPLAIN` 对比 `key` 和 `rows`。

## 哪些情况会让 EXPLAIN 误判？

- **隐式类型转换**：`WHERE tenant_id = '7'` 里字符串会转数字，通常还能用索引；反过来 `WHERE email = 123` 会把 `email` 转成数字，索引直接失效。
- **统计信息过期**：刚导入大批数据、或频繁增删的表，`rows` 可能严重失真，先 `ANALYZE TABLE`。
- **优化器主动放弃索引**：命中行数占比太高时，回表成本超过全表扫描，优化器选 `ALL` 是合理的，不是 bug。
- **索引存在但没被选**：用 `FORCE INDEX` 强行验证一次，如果强行后变快，说明统计信息或代价模型有问题；如果更慢，就接受优化器的选择。

## 小结

- `type` 看访问方式，`rows` 看规模，`Extra` 看额外操作，三者一起看才有意义；
- `const`/`eq_ref`/`ref`/`range` 是可用区间，`index`/`ALL` 要看表大小；
- `key_len` 是联合索引用了几列的直接证据；
- 加索引前先 `EXPLAIN`，加完再 `EXPLAIN` 对比，不要凭感觉。

---

**相关阅读**

- [MySQL 聚簇索引与二级索引：回表到底贵在哪](https://blog.zhoujun.dev/article/mysql-clustered-index-vs-secondary-index/)
- [MySQL 联合索引最左前缀：为什么 (a,b) 查不了 b](https://blog.zhoujun.dev/article/mysql-composite-index-leftmost-prefix/)
- [索引建了，为什么排序还是没用上？——慢查询实战](https://blog.zhoujun.dev/article/django-slow-query-index-tuning/)
- [数据库专题](https://blog.zhoujun.dev/topics/database/)
