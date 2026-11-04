---
title: "MySQL MVCC：版本链与 Read View 是怎么判可见性的"
slug: mysql-mvcc-version-chain-read-view
cover_image: /photos/mysql-mvcc-cover.png
date: 2026-11-04
tags: ["数据库", "存储引擎", "性能优化"]
---

> 适用读者：能背出「RC 读最新、RR 读快照」但说不清快照存在哪里的人；被长事务拖慢 purge、导致磁盘暴涨的人；想知道 `SELECT ... FOR UPDATE` 为什么看到的值和普通 `SELECT` 不一样的人
> 结论先行：InnoDB 的 MVCC 不是「给每行存多个副本」，而是**一行只有一份最新记录，旧值挂在 undo log 里，用 `DB_ROLL_PTR` 串成一条版本链**。读的时候拿一个 Read View，沿着链往回走，找到第一个对当前事务可见的版本。RC 和 RR 的唯一差别，是 Read View 的创建频率：每条语句一个，还是每个事务一个。
> 阅读时间：约 18 分钟 | 难度：进阶 | 收获：隐藏列与 undo log 的物理结构、Read View 的四个字段与完整可见性规则、RC/RR 的真实差异、快照读与当前读的边界、以及长事务为什么危险

**目录**

- 前言：同一行，两个事务看到不同的值
- 隐藏列：版本链的骨架
- undo log：旧版本到底存在哪里
- 版本链怎么串起来
- Read View 的四个字段
- 可见性判断的完整规则
- RC 与 RR 的唯一差别
- 快照读与当前读
- 一条 UPDATE 之后发生了什么
- DELETE 的标记与 purge
- 长事务为什么危险
- 怎么观测版本链与历史链表
- 五个常见误区
- 小结

## 前言：同一行，两个事务看到不同的值

先摆一张只有两列的表：

```sql
CREATE TABLE account (
    id      BIGINT PRIMARY KEY,
    balance INT NOT NULL
) ENGINE=InnoDB;

INSERT INTO account VALUES (1, 100);
```

会话 A 和会话 B 同时开事务，隔离级别是 RR：

```sql
-- 会话 A
BEGIN;
SELECT balance FROM account WHERE id = 1;   -- 100

-- 会话 B
BEGIN;
UPDATE account SET balance = 200 WHERE id = 1;
COMMIT;

-- 会话 A 再读一次
SELECT balance FROM account WHERE id = 1;   -- 还是 100
```

A 明明在 B 提交之后才读，看到的却还是 100。很多人把这件事解释成「A 读的是快照」，但快照到底是什么、存在哪里、什么时候生成，往往说不清楚。

答案由三部分组成：隐藏列、undo log、Read View。

## 隐藏列：版本链的骨架

InnoDB 的聚簇索引叶子记录里，除了业务列，还有几个隐藏字段：

| 隐藏列 | 字节 | 作用 |
| --- | --- | --- |
| `DB_TRX_ID` | 6 | 最后修改这一行的事务 ID |
| `DB_ROLL_PTR` | 7 | 指向 undo log 里这条记录的上一个版本 |
| `DB_ROW_ID` | 6 | 没有主键时自动生成的行 ID |

`DB_TRX_ID` 是「谁改的」，`DB_ROLL_PTR` 是「上一个版本在哪」。这两个字段合起来，就是版本链的全部元数据。

注意 `DB_TRX_ID` 只记录**最后一次修改**的事务，不记录历史。历史版本不在聚簇索引里，而在 undo log 里。

## undo log：旧版本到底存在哪里

每次 `UPDATE` 或 `DELETE`，InnoDB 都会写一条 undo 记录。undo 记录里保存的是「被修改前的旧值」，以及指向上一个 undo 记录的指针。

undo 记录分两类：

- **insert undo**：`INSERT` 产生，只用于回滚，提交后可以很快丢弃；
- **update undo**：`UPDATE` / `DELETE` 产生，既用于回滚，也用于 MVCC 读旧版本，必须保留到没有事务再需要它为止。

一条 update undo 记录大致包含：

- 旧记录的主键；
- 被更新列的旧值；
- 指向上一条 undo 记录的 `DB_ROLL_PTR`；
- 事务 ID、undo 类型等头部信息。

于是同一个主键的所有历史版本，通过 `DB_ROLL_PTR` 串成一条单向链表，最新的在聚簇索引里，最老的在 undo log 链尾。

## 版本链怎么串起来

假设 `id = 1` 这行被三个事务依次修改：

```
trx 10: balance = 100   （初始插入）
trx 20: balance = 150
trx 30: balance = 200
```

聚簇索引里的当前记录是 `(id=1, balance=200, DB_TRX_ID=30, DB_ROLL_PTR=ptr30)`。沿着 `ptr30` 找到 undo 记录：

```
undo 30: 旧值 balance=150, 上一个版本 ptr20
undo 20: 旧值 balance=100, 上一个版本 ptr10
undo 10: 插入 undo，没有更早版本
```

读的时候，如果当前事务的 Read View 认为 `trx 30` 不可见，就沿链走到 `trx 20` 的版本；如果还不可见，再走到 `trx 10`。直到找到一个可见版本，或者链走到头（说明这行在视图创建时还不存在）。

这条链就是「版本链」。它不在数据页上，而是在数据页 + undo 页之间来回跳。

## Read View 的四个字段

Read View 是事务在某个时刻拍下的一张「活跃事务名单」。InnoDB 的 `ReadView` 类（`read0types.h`）核心字段有四个：

| 字段 | 含义 |
| --- | --- |
| `m_ids` | 创建视图时仍活跃（未提交）的事务 ID 列表 |
| `m_up_limit_id` | 活跃事务里最小的 ID |
| `m_low_limit_id` | 创建视图时系统尚未分配的下一个事务 ID |
| `m_creator_trx_id` | 创建这个视图的事务自己的 ID |

`m_ids` 是判断「这行是不是被一个还没提交的事务改过」的关键。`m_up_limit_id` 和 `m_low_limit_id` 则给出两个边界：小于 `m_up_limit_id` 的事务一定已经结束，大于等于 `m_low_limit_id` 的事务一定是在视图之后才开始的。

## 可见性判断的完整规则

对一条记录的 `DB_TRX_ID`，判断顺序如下：

1. 如果 `DB_TRX_ID == m_creator_trx_id`，可见：自己改的行，自己当然看得到；
2. 如果 `DB_TRX_ID < m_up_limit_id`，可见：这个事务比所有活跃事务都早，说明它已经提交；
3. 如果 `DB_TRX_ID >= m_low_limit_id`，不可见：这个事务在视图创建之后才开始；
4. 如果 `DB_TRX_ID` 在 `m_ids` 里，不可见：它创建视图时还活着；
5. 其余情况可见。

这套规则的直觉版本是：**视图创建时已经提交的，看得见；视图创建时还没提交的，看不见；视图创建之后才开始的，也看不见。**

如果当前版本不可见，就沿 `DB_ROLL_PTR` 找上一个版本，重复判断，直到找到可见版本或链结束。

## RC 与 RR 的唯一差别

很多人以为 RC 和 RR 是两套不同的 MVCC 实现，其实它们共用同一套版本链和可见性规则，差别只在 Read View 什么时候创建：

| 隔离级别 | Read View 创建时机 | 效果 |
| --- | --- | --- |
| `READ COMMITTED` | 每条快照读语句开始时 | 每次都能看到最新已提交数据 |
| `REPEATABLE READ` | 事务内第一次快照读时 | 整个事务复用同一个视图 |

这里有一个高频误区：RR 的视图不是 `BEGIN` 时创建的，而是**第一次真正读数据时**创建的。如果 `BEGIN` 之后先做了一堆写操作，再读，视图是在读的那一刻才拍下的。

如果想让视图在事务开始时就创建，用：

```sql
START TRANSACTION WITH CONSISTENT SNAPSHOT;
```

这个语法对 RR 有意义；在 RC 下，视图仍然是每条语句一个。

查看当前隔离级别：

```sql
SELECT @@transaction_isolation;
```

MySQL 8.0 用 `transaction_isolation`，5.7 用 `tx_isolation`。

## 快照读与当前读

MVCC 只作用于「快照读」。下面这些是快照读：

```sql
SELECT ...;                 -- 普通查询
SELECT ... FROM t WHERE ...; -- 普通查询
```

下面这些是「当前读」，会读最新版本，并且加锁：

```sql
SELECT ... FOR UPDATE;
SELECT ... FOR SHARE;       -- 8.0；5.7 写作 LOCK IN SHARE MODE
UPDATE ...;
DELETE ...;
INSERT ...;
```

当前读不走 Read View，它直接读聚簇索引里的最新记录。如果最新记录被别的事务锁住，就等待；等待超时由 `innodb_lock_wait_timeout` 控制。

这解释了一个常见现象：同一个事务里，普通 `SELECT` 看到的是旧值，`SELECT ... FOR UPDATE` 看到的是新值。不是数据不一致，是两种读的语义不同。

## 一条 UPDATE 之后发生了什么

以 `UPDATE account SET balance = 200 WHERE id = 1` 为例：

1. 当前读定位到 `id = 1` 的最新记录，加排他锁；
2. 把旧值写进 update undo，形成一条新的 undo 记录；
3. 修改聚簇索引里的记录：`balance = 200`，`DB_TRX_ID` 改成当前事务 ID，`DB_ROLL_PTR` 指向新 undo；
4. 如果 `balance` 上有二级索引，还要同步维护二级索引；
5. 事务提交后，undo 记录不会立刻删除，要等 purge 判断「没有更早的视图还需要它」。

第 5 步是长事务问题的根源。一个跑了十分钟的事务，会让它开始之后产生的所有 undo 都不能被清理。

## DELETE 的标记与 purge

`DELETE` 在 InnoDB 里通常不是立刻把记录从页里抹掉，而是给记录打一个「删除标记」（delete mark）。记录还在，版本链还在，只是对新的视图不可见。

真正的物理删除由 purge 线程完成：

- purge 扫描 undo log，找到已经没用的 update undo；
- 如果对应记录已被删除标记，且没有更早的视图需要它，就把记录从页里移除；
- 页里的记录被移除后，可能触发页合并；
- 页变空后，可能被回收进 freelist。

所以「删了数据表却没变小」是正常的：`DELETE` 只是标记，空间要等 purge 真正清完才可能回收；而页内碎片、未合并的页，还需要 `OPTIMIZE TABLE` 这类重建操作才能整理。

## 长事务为什么危险

长事务的危害不止「锁住行」，还有三笔更隐蔽的账：

- **undo 无法清理**：历史链表（history list）持续增长，undo 表空间膨胀；
- **purge 跟不上**：`innodb_max_purge_lag` 触发后，新事务可能被延迟，写入吞吐下降；
- **版本链变长**：每次读都要沿链走更多节点，CPU 成本上升；
- **复制延迟**：大事务在主库产生大量 binlog，从库回放压力集中。

观测长事务：

```sql
SELECT trx_id, trx_state, trx_started, trx_isolation_level
FROM information_schema.INNODB_TRX
ORDER BY trx_started;
```

`trx_started` 距离现在越久，越可疑。再看历史链表长度：

```sql
SHOW ENGINE INNODB STATUS\G
```

在 `TRANSACTIONS` 段里找 `History list length`。这个值持续上涨，基本就是有长事务或 purge 跟不上。

## 怎么观测版本链与历史链表

除了 `INNODB_TRX` 和 `SHOW ENGINE INNODB STATUS`，还有几个入口：

```sql
-- 当前事务与锁
SELECT * FROM performance_schema.data_locks;
SELECT * FROM performance_schema.data_lock_waits;

-- 事务事件
SELECT * FROM performance_schema.events_transactions_current;
```

`performance_schema.data_locks` 能看出当前读加了哪些锁；`events_transactions_current` 能看出事务状态与隔离级别。

想看页级细节，可以用 `innodb_ruby` 这类工具导出页结构，观察 `DB_TRX_ID`、`DB_ROLL_PTR` 和 `PAGE_GARBAGE`。生产环境不要随便跑，测试库或副本上做更安全。

## 五个常见误区

误区一：「MVCC 会给每行存多个副本」。不存。只有一份最新记录，旧版本在 undo log 里。

误区二：「RR 的视图在 `BEGIN` 时创建」。不是，在第一次快照读时创建；要提前创建得用 `WITH CONSISTENT SNAPSHOT`。

误区三：「RR 完全不会幻读」。快照读确实看不到新插入的行，但当前读（`FOR UPDATE`、`UPDATE`）会看到，并且依靠间隙锁阻止插入。快照读和当前读混用时，仍然可能出现意料之外的结果。

误区四：「`SELECT ... FOR UPDATE` 也是快照读」。不是，它是当前读，读最新版本并加锁。

误区五：「事务提交后 undo 立刻释放」。不会，要等 purge 确认没有更早的视图还需要它。长事务会把这段时间拉得很长。

## 小结

| 问题 | 答案 |
| --- | --- |
| 版本链存在哪 | 最新版本在聚簇索引，旧版本在 undo log，用 `DB_ROLL_PTR` 串起来 |
| 可见性靠什么 | `DB_TRX_ID` + Read View 的四个字段 |
| RC 与 RR 差在哪 | Read View 每条语句一个，还是每个事务一个 |
| 快照读与当前读 | 普通 `SELECT` 是快照读；`FOR UPDATE` / `UPDATE` / `DELETE` 是当前读 |
| 长事务为什么危险 | undo 不能清理、purge 跟不上、版本链变长 |
| 空间为什么不回收 | `DELETE` 只打标记，物理清除在 purge，页整理还要 `OPTIMIZE TABLE` |

---

**相关阅读**

- [MySQL 聚簇索引与二级索引：回表到底贵在哪](https://blog.zhoujun.dev/article/mysql-clustered-index-vs-secondary-index/)
- [InnoDB 锁的边界：Next-Key 与间隙锁](https://blog.zhoujun.dev/article/innodb-next-key-gap-lock-deep-dive/)
- [B+ 树索引回源：页分裂长什么样](https://blog.zhoujun.dev/article/btree-page-split/)
- [MySQL 联合索引最左前缀：为什么 (a,b) 查不了 b](https://blog.zhoujun.dev/article/mysql-composite-index-leftmost-prefix/)
- [数据库专题](https://blog.zhoujun.dev/topics/database/)
