---
title: MySQL 聚簇索引与二级索引：回表到底贵在哪
slug: mysql-clustered-index-vs-secondary-index
category: database
tags: [MySQL, 索引, 数据库, 性能优化]
status: draft
description: 聚簇索引叶子存整行、二级索引叶子存主键，回表就是拿主键再走一次 B+ 树。本文用执行计划和 buffer pool 解释这笔随机 IO 到底贵在哪，以及覆盖索引怎么把它省掉。
---

> 结论先行：InnoDB 的表本身就是一棵聚簇索引，叶子节点存整行；二级索引的叶子只存主键。所谓「回表」，就是先在二级索引里找到主键，再拿主键去聚簇索引里查整行——**多一次 B+ 树查找，而且大概率是一次随机 IO**。覆盖索引之所以快，不是玄学，是它把这次查找直接省掉了。

## 为什么一张表会有两棵 B+ 树？

建一张最普通的表：

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

InnoDB 里实际存在三棵 B+ 树：

| 索引 | 叶子节点存什么 | 谁来查它 |
| --- | --- | --- |
| 聚簇索引 `PRIMARY` | 整行（id, user_id, status, amount, created_at） | 按主键查、回表 |
| 二级索引 `idx_user` | `user_id` + 主键 `id` | `WHERE user_id = ?` |
| 二级索引 `idx_status` | `status` + 主键 `id` | `WHERE status = ?` |

注意二级索引的叶子**没有行地址**，只有主键值。这是 InnoDB 的一个刻意设计，后面会讲原因。

## 回表到底发生了什么？

```sql
SELECT id, user_id, amount
FROM orders
WHERE user_id = 42;
```

执行分两步：

1. 在 `idx_user` 上找到所有 `user_id = 42` 的叶子项，拿到一批主键 `id`；
2. 对每个 `id`，回到聚簇索引再查一次，取出 `amount`。

第一步是顺序扫描一小段索引页，第二步是**按主键离散地跳**。如果这 100 个主键在聚簇索引里分布在不同页，就是 100 次随机页访问；每次没命中 buffer pool 就是一次磁盘 IO。这就是回表贵的地方——不是多了一次函数调用，而是多了一轮随机 IO。

如果查询只要索引里已有的列：

```sql
SELECT id, user_id FROM orders WHERE user_id = 42;
```

`id` 和 `user_id` 都在 `idx_user` 的叶子里，不需要回表。`EXPLAIN` 的 `Extra` 会显示 `Using index`——这就是覆盖索引。

## 二级索引为什么不直接存行地址？

早期存储引擎（比如 MyISAM）二级索引叶子存的是行地址，回表就是一次指针跳转。InnoDB 不这么做，是因为**行会移动**：

- 页分裂时记录要搬到新页；
- `OPTIMIZE TABLE`、在线 DDL 重建表会改变物理位置；
- 行地址一旦变化，所有二级索引都得跟着改。

而主键是逻辑标识，行怎么搬主键都不变。代价是回表要再走一次 B+ 树，收益是二级索引永远不用维护物理地址。页分裂的过程见 [B+ 树索引回源：页分裂长什么样](https://blog.zhoujun.dev/article/btree-page-split/)。

## 回表的成本到底高在哪？

1. **随机 IO**：主键顺序和二级索引顺序通常不一致，尤其是用 UUID 做主键时，回表几乎全是随机页。
2. **buffer pool 污染**：回表把聚簇索引的页读进内存，可能挤掉真正热点的页。
3. **放大 CPU**：每次回表都要重新走一遍 B+ 树的分支判断，行数一多，这部分开销不可忽略。

所以「加索引就快」是个错觉：索引让定位变快，但把成本从「扫全表」换成了「扫索引 + N 次回表」。当命中行数占比很高时，全表扫描反而更快，优化器有时选 `ALL` 就是这个原因。

## 哪些查询应该避免回表？

- **高频查询只取少量列** → 把这些列做进联合索引，直接覆盖。例如 `KEY idx_user_status (user_id, status)` 可以让 `WHERE user_id = ? AND status = ?` 只读索引。
- **`SELECT *`** 是最容易触发回表的写法，尤其是宽表。
- **主键越短越好**：二级索引叶子要存主键，主键是 `BIGINT` 还是 `CHAR(36)` 的 UUID，会让每个二级索引项差出几十字节，索引页能装的项数直接少一截。

## 二级索引里为什么天然包含主键？

二级索引里天然包含主键，所以下面这个查询也是覆盖索引：

```sql
SELECT id FROM orders WHERE status = 1;
```

`id` 本来就在 `idx_status` 的叶子里。很多人以为「必须把 id 也加进联合索引」，其实不用。

反过来，`ORDER BY id` 走二级索引时，同一索引页内的主键是递增的，但跨页之后主键并不全局有序（页与页之间按 `status` 排序）。所以「二级索引 + 主键排序」能不能免排序，要看执行计划里的 `Using filesort`，不要想当然。

## 小结

| 问题 | 答案 |
| --- | --- |
| 回表是什么 | 二级索引拿到主键后，再去聚簇索引取整行 |
| 为什么贵 | 多一次 B+ 树查找，通常是随机 IO |
| 怎么避免 | 覆盖索引、联合索引、避免 `SELECT *`、短主键 |
| 怎么确认 | `EXPLAIN` 看 `Extra` 是否有 `Using index` |

---

**相关阅读**

- [B+ 树索引回源：页分裂长什么样](https://blog.zhoujun.dev/article/btree-page-split/)
- [MySQL 联合索引最左前缀：为什么 (a,b) 查不了 b](https://blog.zhoujun.dev/article/mysql-composite-index-leftmost-prefix/)
- [MySQL EXPLAIN 执行计划：从 ALL 到 ref 怎么看](https://blog.zhoujun.dev/article/mysql-explain-type-all-ref-range/)
- [数据库专题](https://blog.zhoujun.dev/topics/database/)
