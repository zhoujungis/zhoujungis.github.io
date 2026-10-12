---
title: "【LC 146】LRU 缓存：手写哈希表与双向链表"
slug: lc-146-lru-cache
cover_image: /photos/lc-146-cover.png
date: 2026-10-12
tags: [算法, 设计题, 哈希表, 链表, LeetCode, 面试]
---

## 题目

> 来源：**腾讯 123 次（断层第一）、字节 72 次** —— 手写设计题里出现频率最高的缓存题。

**LC 146 LRU 缓存**：请你设计并实现一个满足 **LRU（最近最少使用）** 缓存约束的数据结构。

- `LRUCache(int capacity)`：以正整数 `capacity` 初始化；
- `int get(int key)`：如果 key 存在，返回其值，否则返回 `-1`；
- `void put(int key, int value)`：key 存在则改值；不存在则插入；**容量满时淘汰最久未使用的那一个**；
- **`get` 和 `put` 必须都是 O(1)**。

要求**手写双向链表 + 哈希表**（禁用 `LinkedHashMap` / `OrderedDict` 这类现成结构）。追问两个：

> **追问一**：怎么改成线程安全版？
> **追问二**：和 LFU（LC 460）有什么区别？

标准用例（本文动画的默认脚本）：

```
LRUCache(2)
put(1,1); put(2,2)        → 链表: [1] → [2,1]
get(1)                    → 返回 1,  链表重排: [1,2]
put(3,3)                  → 淘汰 2,  链表: [3,1]
get(2)                    → -1
put(4,4)                  → 淘汰 1,  链表: [4,3]
get(1) → -1; get(3) → 3; get(4) → 4
```

## 一、核心洞察：O(1) 的两条腿 —— 哈希表定位 + 双向链表排队

先说清楚「为什么必须是这两样组合」：

- **只用哈希表**：`get` 是 O(1)，但「谁是最久未使用的」这件事没有结构承载 —— 每次淘汰都得扫描全部 key（O(n)），而且「使用」的顺序无法维护；
- **只用链表**：保持顺序没问题，但 `get(key)` 要先找到节点 —— 链表查找是 O(n)；
- **组合起来**：哈希表 `key → 节点` 负责「一步找到」，双向链表负责「按使用顺序排队」，两个操作各司其职：

```
队首（head 侧）= 最近使用（MRU）
队尾（tail 侧）= 最久未使用（LRU）  ← 淘汰永远从这里摘
```

两个「为什么」也是面试官爱问的：

1. **为什么双向、不单向？** `get` 命中后要把节点从链表**中间摘下来**、移到队首。单向链表摘任意节点需要它的前驱 —— 找不到前驱就得从头扫（O(n)）。双向链表有 `prev`，摘除本身是 O(1)。
2. **为什么要哨兵（dummy head / tail）？** 有了两个哨兵，任何节点的 `prev` / `next` 都非空 —— 插入和摘除**永远不需要判空**，代码少一半 `if`，也就不容易在边界（容量 1、只剩一个节点）上写错。

## 二、手写结构：三个固定动作

整份实现只有三个「零件动作」，把它们的指针顺序背下来，就再也不会写错：

- `addToFront(node)`：把节点接到哨兵 head 后面（队首）；
- `unlink(node)`：把节点从链表中摘掉（前后邻居直接牵手）；
- `moveToFront(node)` = `unlink` + `addToFront`。

Python 版（**不用 `OrderedDict`**，纯手写）：

```python
class Node:
    __slots__ = ("key", "value", "prev", "next")

    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}                    # key -> Node
        self.head = Node()                 # 哨兵：head.next 才是第一个真节点
        self.tail = Node()                 # 哨兵：tail.prev 才是最后一个真节点
        self.head.next = self.tail
        self.tail.prev = self.head

    def _add_to_front(self, node):
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def _unlink(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _move_to_front(self, node):
        self._unlink(node)
        self._add_to_front(node)

    def get(self, key: int) -> int:
        node = self.cache.get(key)
        if node is None:
            return -1
        self._move_to_front(node)          # 命中 = 使用
        return node.value

    def put(self, key: int, value: int) -> None:
        node = self.cache.get(key)
        if node is not None:
            node.value = value
            self._move_to_front(node)      # 改值也算使用！
            return
        if len(self.cache) == self.cap:    # 容量满：先淘汰队尾
            victim = self.tail.prev
            self._unlink(victim)
            del self.cache[victim.key]     # 两处都要删，漏一个就是幽灵节点
        node = Node(key, value)
        self.cache[key] = node
        self._add_to_front(node)
```

注意 `put` 的三种情形：**key 已存在**（改值 + 移到队首）、**容量未满**（直接插队首）、**容量已满**（先摘队尾双删，再插队首）—— 面试时把这三条逐个说清楚，比一句「就是 LRU 嘛」强十倍。

## 三、动画怎么看

<div class="algo-viz algo-viz--lc146"></div>

<div class="algo-viz algo-viz--lc146lfu"></div>

**动画一**（`algo-viz--lc146`）：**双向链表 + 哈希表**。上方是链表：`H` / `T` 是哨兵，**队首（最左）= 最近使用，队尾（最右）= 淘汰对象**；每个节点显示 `key:value` 和它的节点号 `#n`。中部是**哈希表**，条目形如 `key → #n` —— 盯住它们**同步变化**：插入时两处都加、淘汰时两处都删。淘汰帧里队尾会出现一个**虚线幽灵节点**（就是被摘掉的那一个）。下方两行是「本步操作」和「get 返回值」。

**动画二**（`algo-viz--lc146lfu`）：**LFU 对照**。同一套操作脚本喂给 LFU：节点按 **freq 升序**从左到右排（**最左 = 下一个淘汰对象**，左侧有「淘汰优先 →」指示），每个节点带 freq 角标，get / put 命中都会让 freq +1。看两个关键帧就够了：`put(3,3)` 时的淘汰 —— **LRU 淘汰 `(2,2)`，LFU 淘汰 `(1,1)`**。

## 四、完整推演表

**动画一（LRU）** 按默认脚本逐操作推演（链表按头 → 尾书写）：

| 操作 | 链表（头 → 尾） | 哈希表 | 返回 |
|---|---|---|---|
| init | 空 | 空 | — |
| `put(1,1)` | `1:1` | `1 → #1` | — |
| `put(2,2)` | `2:2 → 1:1` | `1 → #1, 2 → #2` | — |
| `get(1)` | `1:1 → 2:2`（移到队首） | 不变 | **1** |
| `put(3,3)` | 淘汰 `2:2` → 插入得 `3:3 → 1:1` | 删 `2`、加 `3` | — |
| `get(2)` | 不变 | 不变 | **−1** |
| `put(4,4)` | 淘汰 `1:1` → 插入得 `4:4 → 3:3` | 删 `1`、加 `4` | — |
| `get(1)` | 不变 | 不变 | **−1** |
| `get(3)` | `3:3 → 4:4`（移到队首） | 不变 | **3** |
| `get(4)` | `4:4 → 3:3`（移到队首） | 不变 | **4** |

两个「淘汰时刻」值得单独记：`put(3,3)` 淘汰 `(2,2)` —— 虽然 2 比 1 晚插入，但 `get(1)` 之后 **1 被使用过、2 没有**；`put(4,4)` 淘汰 `(1,1)` —— 1 虽然热过，但 3 插入后它就是队尾。**LRU 只看「最近有没有用」，不看「一共用了多少次」。**

**动画二（LFU 对照）**：同一串操作喂给 LFU，分岔点只有一个，但结论完全不同：

| 步骤 | 各节点 freq | 决策 |
|---|---|---|
| `put(1,1)` / `put(2,2)` | `1:1, 2:1` | 都是冷启动 |
| `get(2)` ×2 | `1:1, 2:3` | LFU 里 get **涨频率** |
| `get(1)` | `1:2, 2:3` | 1 也热了一档，但还差 |
| `put(3,3)` | 淘汰 **freq 最小的 `1`** | 对照：LRU 此刻淘汰的是 `2` |

**同一串操作、同一个容量，两台机器淘汰不同的 key** —— 这就是「LRU vs LFU」在一道题里的全部分歧。

## 五、追问二：LFU（460）的区别

| 维度 | LRU（146） | LFU（460） |
|---|---|---|
| 记住的维度 | **时间**：最近有没有用 | **频率**：一共用了多少次 |
| get 命中做什么 | 把节点移到队首（改顺序） | freq +1（**改淘汰优先级**） |
| 淘汰谁 | 链表**队尾**（最久未使用） | **freq 最小**的节点；并列时淘汰其中最久未使用的 |
| 结构 | 哈希表 + 一条双向链表 | 哈希表 + **频率桶**（freq → 双向链表）+ `minFreq` 指针 |
| O(1) 实现难度 | 低（本文三个动作） | 高（桶的增删 + minFreq 维护） |
| 典型弱点 | 一次大扫描会冲掉热点（缓存污染） | 历史热点短期「赖着不走」；新 key 极易被秒杀 |

LFU 要做到 O(1)，靠的是「**频率桶**」：每个 `freq` 值挂一条双向链表，同桶内按使用先后排；再维护一个 `minFreq` 指针指向最小频率的桶。命中时节点从 freq 桶搬到 freq+1 桶；淘汰时从 `minFreq` 桶的**桶尾**（同频最久未用）取。**LC 460 的难点从来不是 LRU 那套链表，而是桶和 minFreq 的维护。**

工程现场还有第四种答案：真实缓存（如 Caffeine）用的是 **W-TinyLFU** ——「准入窗口 + 频率素描」的组合，既抗扫描污染又不用精确维护频率桶。面试里能提一句，档次直接不一样。

## 六、追问一：线程安全版怎么做

先戳破一个错觉：**LRU 的 `get` 不是只读操作** —— 它要 `moveToFront`，会改链表。所以「读多写少用读写锁」在这里是伪命题：每一次读都可能写结构。三条路线：

- **全局锁（朴素正确版）**：Java 用 `synchronized` 包住 `get` / `put`，Python 用 `threading.Lock`。正确、简单，但所有操作串行 —— 面试里先说这个，再谈优化；
- **分段锁（工程常用）**：按 key 哈希成 N 段，每段一条独立 LRU + 一把锁。并发度上来了，代价是**容量不再精确**（每段各自淘汰，可能整体超卖/早退）。这也是 Redis 单线程模型之外、本地缓存库的常见折衷；
- **近似算法（生产现实）**：与其精确维护链表，不如用 CLOCK / W-TinyLFU 这类「近似 LRU/LFU」，把每次访问的结构修改降到常数位操作 —— 换来高并发下的可扩展性。

面试句式：「正确性上，最简单的方案是一把锁把所有操作串行化；瓶颈在于 get 也会写链表。生产里通常退一步：分段或近似算法，用淘汰精度换并发度。」

## 七、Java 版（同样手写，禁用 LinkedHashMap）

```java
class LRUCache {
    private static final class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0);   // 哨兵
    private final Node tail = new Node(0, 0);   // 哨兵

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        Node node = map.get(key);
        if (node == null) return -1;
        moveToFront(node);
        return node.value;
    }

    public void put(int key, int value) {
        Node node = map.get(key);
        if (node != null) {
            node.value = value;
            moveToFront(node);
            return;
        }
        if (map.size() == capacity) {
            Node victim = tail.prev;            // 队尾 = 最久未使用
            remove(victim);
            map.remove(victim.key);             // 双删
        }
        Node fresh = new Node(key, value);
        map.put(key, fresh);
        addToFront(fresh);
    }

    private void addToFront(Node node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void moveToFront(Node node) {
        remove(node);
        addToFront(node);
    }
}
```

一个 Java 细节：`head` / `tail` 哨兵自己不在 `map` 里，也不会被 `put` 覆盖；`remove` 之后**必须** `map.remove`，否则淘汰的 key 还留在哈希表里，下一次 `get` 会摸到一个已经脱链的「幽灵节点」。

（如果哪天笔试允许用库：Java `new LinkedHashMap<>(cap, 0.75f, true)` + 重写 `removeEldestEntry`、Python `OrderedDict` + `move_to_end` 都是一行版 —— 但**这道题考的就是不让用**。）

## 八、同族题：460 / 432 / 707 / 2296 / 面试 16.25

146 是「设计题 + 链表 + 哈希」这一族的原点：

- **LC 460 LFU 缓存**：本文第五节的对照 —— 频率桶 + minFreq，**146 的进阶连招**；
- **LC 432 全 O(1) 的数据结构**：inc / dec / getMax / getMin 全 O(1) —— 同样用「值 → 双向链表」的桶思想；
- **LC 707 设计链表**：不考缓存，只考双向链表裸操作（插入 / 删除 / 按索引找）—— 146 的手感训练；
- **LC 2296 设计文本编辑器**：双向链表 + 光标，链表的另一条经典考法；
- **面试题 16.25 LRU 缓存**：就是本题的「面试版」编号，考频同样极高；
- **LC 588 / 1166**（文件系统系列）：用「路径 → 节点」的哈希 + 树/链表的组合，思想同源。

## 九、边界与常见坑

- **`put` 已存在的 key 必须移到队首**（且改值）—— 漏掉「算一次使用」是本题第一大坑，面试官一问就是它；
- **get 未命中不能占位**：返回 -1，结构一动不动；
- **淘汰要双删**：链表摘尾的**同时** `del cache[key]`；只摘链表 → 幽灵节点；只删表 → 链表泄漏；
- **值相同也算使用**：`put(1, 5)` 遇到已经 `1:5`，仍要移到队首；
- **`capacity = 1`**：哨兵方案下不需要任何特判（这正是哨兵的价值）；
- **指针顺序**：`addToFront` 四行、`remove` 两行，顺序写反在「只有一个节点」时会把自己指成自环；
- **不要用库**：题目明确禁用 `LinkedHashMap` / `OrderedDict`，写了能过编译但面试大概率被判「没答到」；
- **Python 的 `__slots__`**：可选优化，面试里提一句显得熟练；不提也不扣分。

## 十、复杂度

| 操作 | 时间 | 说明 |
|---|---|---|
| `get` | `O(1)` 均摊 | 哈希表查找 O(1) + 链表摘除/插入各常数次指针 |
| `put` | `O(1)` 均摊 | 查找 + 至多一次淘汰（摘尾双删）+ 一次头插 |
| 空间 | `O(capacity)` | 哈希表与链表各存 capacity 个节点 |

没有一次遍历、没有一次扫描 —— 这就是「LRU 的 O(1)」的全部含义。对照 LFU：维护得当时（频率桶 + minFreq）也是 O(1)，但要维护的结构多得多。

## 十一、面试怎么答

**第一段 · 结构选型**：先讲「两条腿」——哈希表 `key → 节点` 保证 O(1) 找到，双向链表按使用顺序排队保证 O(1) 移动与淘汰；**为什么双向**（摘中间节点要前驱）、**为什么哨兵**（免判空）。这段是绝大多数人答得含糊的地方，说清楚就赢一半。

**第二段 · 手写要点**：三个固定动作 `addToFront` / `unlink` / `moveToFront`；`put` 的三种情形（改值+移到队首 / 直接插 / 先淘汰再插）；淘汰时**链表哈希表双删**。

**第三段 · 追问连跳**：线程安全 —— 点出「get 也会写链表」，给全局锁 / 分段 / 近似三层答案；LFU 区别 —— 时间维度 vs 频率维度，**同一串操作可能淘汰不同的 key**（`put(3,3)`：LRU 淘汰 2、LFU 淘汰 1），LFU 的 O(1) 靠频率桶 + minFreq。

一句话收尾：「LRU 的全部考点就是一句话 —— **哈希表负责找到，双向链表负责排队**；手写时盯住哨兵、双删和『put 命中也要移到队首』这三个细节。」

## 结语

146 是一道「没有算法、全是工程」的题：没有推导、没有边界数学，考的是你**对两个基础结构组合的掌控力** —— 哈希表给你 O(1) 的访问，双向链表给你 O(1) 的秩序。把它写对的人，再去看 LFU 的频率桶、432 的桶套桶、线程安全的分段与近似，都是在同一张图上往前走。手写一遍，比读十遍管用。

下一篇见。
