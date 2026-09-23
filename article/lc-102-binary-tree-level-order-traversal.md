---
title: "【LC 102】二叉树的层序遍历：为什么必须先把队列长度存下来"
slug: "lc-102-binary-tree-level-order-traversal"
category_id: null
tags: ["算法", "二叉树", "LeetCode", "面试"]
status: "draft"
cover_image: "https://zhoujungis.github.io/photos/lc-102-cover.png"
---

# 【LC 102】二叉树的层序遍历：为什么必须先把队列长度存下来

> **适用读者**：会写二叉树前中后序遍历（递归），但这题一写就把所有层吐成一维数组的人
> **技术栈**：Python 为主，附 Java 版
> **难度**：中等偏易（代码 10 行），但它是 103 / 199 / 107 / 429 一整个家族的地基
> **收获**：`size = len(queue)` 这一行的必要性，以及一个种子怎么写三个变体

## 题目

给你二叉树的根节点 `root`，返回其节点值的 **层序遍历**（即逐层地，从左到右访问所有节点）。

```
输入：root = [3,9,20,null,null,15,7]
输出：[[3],[9,20],[15,7]]

输入：root = [1]
输出：[[1]]

输入：root = []
输出：[]
```

注意输出的**嵌套结构**：不是 `[3,9,20,15,7]`，而是 `[[3],[9,20],[15,7]]`。

单看题目，这就是 BFS 走一遍。但面试里它几乎不会裸考 —— 带出来的是这一串：

| 变体 | 题号 | 要求 |
|---|---|---|
| **锯齿形层序遍历** | LC 103 | 奇数层从左到右，偶数层从右到左 |
| **二叉树的右视图** | LC 199 | 只输出每层最右边的节点 |
| **自底向上的层序遍历** | LC 107 | 结果整体上下翻转 |
| **N 叉树的层序遍历** | LC 429 | 儿子列表换成 `node.children` |

> 出处备注：华为 2025 暑期面经的**原题就是"之字形层序遍历"**，腾讯、阿里也高频。这题被选中的原因很直接：它只有一层窗口（队列）和两个循环，20 行以内能写完，但**分层的写法对不对，一眼就看得出来**。

节点的定义，沿用前几篇：

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

> **顺带说一句输入格式**：`[3,9,20,null,null,15,7]` 是 LeetCode 的层序数组编码，不是随便排的。下标 `i` 的节点，左孩子在 `2i+1`、右孩子在 `2i+2`，空缺位置用 `null` **占着位**。所以 `9` 没有孩子（`3,4` 两位是 `null`），而 `20` 的两个孩子在 `5,6`，对应 `15` 和 `7`。这篇后面画的树就是按这个规则还原的。

---

## 一、BFS 三行就能写出"访问顺序"，但分层输出是另一回事

### 1.1 不带分层的 BFS：先确认你已经会了

```python
from collections import deque

def bfs(root):
    if not root:
        return []
    q = deque([root])
    out = []
    while q:
        node = q.popleft()          # 出队
        out.append(node.val)        # 访问
        if node.left:
            q.append(node.left)     # 左孩子入队
        if node.right:
            q.append(node.right)    # 右孩子入队
    return out
```

跑一下 `[3,9,20,null,null,15,7]`，得到 `[3, 9, 20, 15, 7]` —— 这个顺序是**对的**，层序遍历要的就是它。

问题是：**这五個数字之间的"层边界"在哪？** 光看这个一维数组，你分不清哪几个是同一层的。

### 1.2 队列里天然就分了层，问题是怎么"切"出来

关键在于队列的一个物理性质：

> **同一层的节点，在队列里一定是挨在一起的；而且它们一定比下一层的节点先出队。**

推进过程是这样的：

```
初始        q = [3]
出队 3      q = [9, 20]         ← 第 1 层整批进来了
出队 9      q = [20]            ← 9 没有孩子，不产生新节点
出队 20     q = [15, 7]         ← 第 2 层整批进来了
出队 15     q = []
出队 7      q = []
```

看第二行：`9` 和 `20` 是**连续**排在一起的，中间没有 `15`、`7` 插进来。这不是巧合 —— 因为入队的顺序严格是"第 0 层出队时把第 1 层全部入队"，第 1 层出队时才轮到第 2 层。**FIFO 天然保证了这一点。**

所以分层的信息**本来就在队列里**，只是上面那段代码每轮只出队一个、出完就没了。要做的是：**在一层开始的时候，先记下这一层有几个节点。**

### 1.3 那一行：`size = len(queue)`

```python
while q:
    size = len(q)          # ★ 进这一层之前，先把当前队列长度存下来
    level = []
    for _ in range(size):  # ★ 只出队 size 次
        node = q.popleft()
        level.append(node.val)
        if node.left:
            q.append(node.left)
        if node.right:
            q.append(node.right)
    res.append(level)
```

**为什么必须用 `size`，不能直接写 `while q`？**

因为内层那个 `for` 循环是**一边出队、一边入队**的。`9` 和 `20` 出队的同一轮里，`15` 和 `7` 已经被推进队列了。如果不先把长度存下来，而是拿**实时长度**当循环条件：

```python
for _ in range(len(q)):    # ✗ 错的：len(q) 每一轮都在变
```

那么第 0 层出队 `3` 之后 `len(q)` 变成 2，`9` 和 `20` 出队时 `len(q)` 又涨回去 —— 循环会一直把**下一层**的节点也卷进来，层就分不开了。

把 `len(q)` 取快照存进 `size`，这一行同时给了三样东西：

1. **分层**：`size` 就是"这一层有几个节点"；
2. **循环次数**：`for _ in range(size)` 精确出队这么多次；
3. **变体的抓手**：后面 103 / 199 全都挂在这个 `size` 上。

> 一句话记法：**进 while 的那一刻先把队列长度存下来。** 存完之后，内层怎么进出队都不影响这一层的边界了。

### 1.4 完整代码

```python
from collections import deque
from typing import List, Optional

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []

        res = []
        q = deque([root])

        while q:
            size = len(q)              # ★ 这一层的节点数，快照
            level = []
            for _ in range(size):      # 只处理这一层
                node = q.popleft()
                level.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            res.append(level)          # 封层

        return res
```

**十行，主流程就这些。** 下面几节全部是在这一副骨架上换皮。

---

## 二、动画：看着 size 把层"框"住

下面这个动画把 `[3,9,20,null,null,15,7]` 的全程拆成 15 帧。留意三件事：

- **队列条上那个绿色的括号**：它标的就是 `size` —— 左边是队首（`head`），括号框住的是"当前这一层还剩几个没出队"。每出队一个，括号就缩短一格；缩到 0 就说明这一层结束了；
- **橙色的节点是正在出队的那个**，出完变绿；**绿色实心的是刚入队的**（它们是下一层的成员，此刻正排在队尾）；
- **结果区逐行长出来**：每次"封层"（`close` 帧）才追加一行，所以它长出来的节奏是 `[3]` → 两行 → 三行，跟树的层一一对应。

<div class="algo-viz algo-viz--lc102"></div>

看动画时可以专门盯住第 4 帧和第 9 帧（两个 `close` 帧）：**只有在 `size` 个节点全部出队之后，结果区才会多出一行。** 这就是"分层"在画面上最直接的体现。

---

## 三、完整推演表

用动画里的例子：

```
层序数组下标: 0=3  1=9  2=20  3=null  4=null  5=15  6=7
树：
        3
      /   \
     9     20
          /  \
        15    7
```

| 帧 | phase | 队列（队首在左） | 层 | size | 已出队 | 动作 | 结果 |
|---|---|---|---|---|---|---|---|
| 0 | init | `[]` → `[3]` | — | — | — | 根节点入队 | `[]` |
| 1 | **enter** | `[3]` | 0 | **1** | 0 | **快照 `size = 1`** | `[]` |
| 2 | consume | `[]` | 0 | 1 | 1 | 出队 `3`，收集 `3` | `[]` |
| 3 | enqueue | `[9,20]` | 0 | 1 | 1 | `9`、`20` 入队，**排到队尾** | `[]` |
| 4 | **close** | `[9,20]` | 0 | 1 | 1 | 封层 → **`[3]`** | `[[3]]` |
| 5 | **enter** | `[9,20]` | 1 | **2** | 0 | **快照 `size = 2`** | `[[3]]` |
| 6 | consume | `[20]` | 1 | 2 | 1 | 出队 `9`，收集 `9`（无孩子） | `[[3]]` |
| 7 | consume | `[]` | 1 | 2 | 2 | 出队 `20`，收集 `20` | `[[3]]` |
| 8 | enqueue | `[15,7]` | 1 | 2 | 2 | `15`、`7` 入队 | `[[3]]` |
| 9 | **close** | `[15,7]` | 1 | 2 | 2 | 封层 → **`[9,20]`** | `[[3],[9,20]]` |
| 10 | **enter** | `[15,7]` | 2 | **2** | 0 | **快照 `size = 2`** | `[[3],[9,20]]` |
| 11 | consume | `[7]` | 2 | 2 | 1 | 出队 `15`，收集 `15`（无孩子） | `[[3],[9,20]]` |
| 12 | consume | `[]` | 2 | 2 | 2 | 出队 `7`，收集 `7` | `[[3],[9,20]]` |
| 13 | **close** | `[]` | 2 | 2 | 2 | 封层 → **`[15,7]`** | `[[3],[9,20],[15,7]]` |
| 14 | **done** | `[]` | — | — | — | 队列空，返回 | **`[[3],[9,20],[15,7]]`** |

三个 `enter` 帧的 `size` 分别是 `1 / 2 / 2` —— 正好是树三层的节点数。**这就是"分层"的全部秘密，剩下的都是 BFS。**

> 注意第 3 帧和第 8 帧：这两帧的 `size` 都没有变化（还是 1 和 2），因为**入队不改变"这一层有几个节点"这件事**。`size` 只是快照，全程不重算。

> 另外看第 4 帧和第 5 帧、第 9 帧和第 10 帧：`close` 和紧接着的 `enter` 帧里队列内容完全一样。不同的是 `levelIndex` 加一了、`consumed` 归零了、`levelValues` 清空了 —— **一个在收尾，一个在开新的一层**。

---

## 四、变体一：LC 103 锯齿形层序遍历

**要求**：奇数层从左到右，偶数层从右到左。`[3,9,20,null,null,15,7]` 的答案从 `[[3],[9,20],[15,7]]` 变成 **`[[3],[20,9],[15,7]]`**。

（注：这里的"奇数层 / 偶数层"是按 LeetCode 的说法，`root` 记为**第 1 层**。换成 0 起的下标就是"第 1、3、5…（下标奇数）层反向"。）

### 4.1 常见写法：先正常收集，再 reverse

```python
res.append(level[::-1] if len(res) % 2 else level)      # 事后翻转
```

能过，但有两种小毛病：一是"反"这件事发生在事后，跟"入队顺序"这个真正的机制没有对应关系；二是有的面试官会追问"能不能一边收集一边就放对位置"。

### 4.2 换一只头：头插代替事后翻转

层内节点的**出队顺序永远是左→右**（因为入队一直是 `left` 先 `right` 后），这一点不能动。变的是**值往 `level` 的哪一头放**：

```python
reversed_layer = (level_index % 2 == 1)     # 0 起下标，奇数层要反

for _ in range(size):
    node = q.popleft()
    if reversed_layer:
        level.insert(0, node.val)   # ★ 头插：等价于右→左
    else:
        level.append(node.val)      # 尾插：左→右
    if node.left:
        q.append(node.left)         # ★ 入队顺序永远 left → right
    if node.right:
        q.append(node.right)
```

**头插的法子好在哪**：`9` 先出队，头插进去是 `[9]`；`20` 后出队，头插进去把它顶到前面变成 `[20, 9]` —— 一个插入动作同时完成了"收集"和"排序"，不需要第二次遍历。

> ⚠️ 最容易写错的点：**队列本身的左右入队顺序永远是 `left → right`，锯齿只改变"值放进结果的哪一头"。**
>
> `20` 的孩子 `15`、`7` 在锯齿模式下依然按 `15 → 7` 入队。如果把入队顺序也跟着层数反转，第 2 层（原序）就会变成 `[7, 15]`，答案直接错。**要反的是输出，不是遍历。**

### 4.3 完整代码

```python
class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []

        res = []
        q = deque([root])

        while q:
            size = len(q)
            level = []
            reverse = len(res) % 2 == 1        # 偶数层（下标奇数）要反
            for _ in range(size):
                node = q.popleft()
                if reverse:
                    level.insert(0, node.val)
                else:
                    level.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            res.append(level)

        return res
```

跟 LC 102 的 diff 只有三处：多一个 `reverse` 变量、`append` 变成条件二选一、其余不动。**`size` 快照那行完全没碰。**

> 复杂度：`list.insert(0, ...)` 在 Python 里是 `O(k)`（k 是当前层节点数），所以最坏情况（完全偏斜、每层 1 个节点）摊还下来整体仍是 `O(n)`，但树很宽的时候常数项不如"先 append 再 reverse"。要追求稳定，用 `collections.deque` 的两端操作或者事后 `level.reverse()` 更稳。**面试时能主动说出这一层，是加分项。**

---

## 五、变体二：LC 199 二叉树的右视图

**要求**：想象你站在树的右侧，返回从上到下能看到的节点值。也就是**每层最右边那个**。

`[3,9,20,null,null,15,7]` 的答案是 **`[3, 20, 7]`**：第 0 层看 `3`，第 1 层看 `20`，第 2 层看 `7`。

### 5.1 不要为它单写一套逻辑

这题的诱惑是"再造一个状态机专门算右视图"。但注意：**"每层最后一个"这个信息，在封层那一刻恰好就是 `level` 的末位元素。** 所以只要在主流程里搭一行就够了：

```python
while q:
    size = len(q)
    level = []
    for _ in range(size):
        node = q.popleft()
        level.append(node.val)
        if node.left:
            q.append(node.left)
        if node.right:
            q.append(node.right)
    res.append(level)
    right_view.append(level[-1])     # ★ 就这一行：封层时取末位
```

**复杂度没变、循环结构没变，加一行就出结果。**

### 5.2 完整代码

```python
class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []

        right_view = []
        q = deque([root])

        while q:
            size = len(q)
            for i in range(size):
                node = q.popleft()
                if i == size - 1:            # 这一层的最后一个
                    right_view.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)

        return right_view
```

`i == size - 1` 和 `level[-1]` 是同一件事，前者省了一个 `level` 数组 —— 只要右视图的话用这个更省。

### 5.3 ⚠️ 锯齿 + 右视图会打架

如果一道题同时要求锯齿输出和右视图（面经里出现过），**别指望复用同一个"最后"**：

| 模式 | 第 1 层结果 | 右视图应取 |
|---|---|---|
| 普通（左→右） | `[9, 20]` | 末位 `20` ✅ |
| **锯齿（右→左）** | **`[20, 9]`** | 末位变成 `9` ❌，应该还是 `20` |

动画里能直接验证这一点：切到锯齿模式后，第 9 帧结果区第二行长成 `[20, 9]`，同时右视图那一栏显示的是 `9` —— **因为右视图是"从 `levelValues` 取末位"算出来的，不是单独遍历树。** 真要两个同时要，右视图得单独按普通顺序算一遍（或者取锯齿结果的**首位**）。

> 这是"变体套变体"最典型的坑：**每个变体都寄生在同一个 `size` 上，但它们之间不保证正交。** 面试里同时问两个，先问清楚"右视图是按树的左右算，还是按输出顺序算"。

---

## 六、再顺手带两个

### 6.1 LC 107 自底向上：结果翻一下就行

```python
return res[::-1]        # 或者层级遍历时 res.insert(0, level)
```

**注意**：只翻**层与层之间**的顺序，每层内部的左右顺序**不动**。`[[3],[9,20],[15,7]]` → `[[15,7],[9,20],[3]]`。把每层内部也反了，就变成 103 了。

### 6.2 LC 429 N 叉树：把"两个孩子"换成"孩子列表"

```python
while q:
    size = len(q)
    level = []
    for _ in range(size):
        node = q.popleft()
        level.append(node.val)
        for child in node.children:      # ★ 唯一改动
            q.append(child)
    res.append(level)
```

N 叉树节点没有 `left`/`right`，只有一个 `children` 列表。**`size` 快照那一行照抄。**

---

## 七、Java 版

```java
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;

        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);

        while (!q.isEmpty()) {
            int size = q.size();                    // ★ 快照
            List<Integer> level = new ArrayList<>(size);
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }
}
```

锯齿版（Java 比 Python 还干净，`LinkedList` 两头都能插）：

```java
while (!q.isEmpty()) {
    int size = q.size();
    LinkedList<Integer> level = new LinkedList<>();
    boolean reverse = res.size() % 2 == 1;
    for (int i = 0; i < size; i++) {
        TreeNode node = q.poll();
        if (reverse) level.addFirst(node.val);      // 头插
        else         level.addLast(node.val);       // 尾插
        if (node.left != null) q.offer(node.left);
        if (node.right != null) q.offer(node.right);
    }
    res.add(level);
}
```

Java 里两个提醒：

- **`int size = q.size()` 必须取出来**，别在 `for` 条件里写 `i < q.size()` —— 那样每轮都会重算，直接踩坑；
- **`ArrayDeque` 不允许放 `null`**（`LinkedList` 可以，但没必要）。这题的入队都带 `if` 判空，不会踩到。

---

## 八、边界情况

| 输入 | 结果 | 说明 |
|---|---|---|
| `[]` | `[]` | `root` 为空，直接返回空列表（**别返回 `[[]]`**） |
| `[1]` | `[[1]]` | `size = 1`，一层一个节点 |
| `[1,2]` | `[[1],[2]]` | 只有左孩子，第 1 层只有 1 个节点（`size = 1`） |
| `[1,null,2]` | `[[1],[2]]` | 只有右孩子，结果和上面一样 —— **位置不同但值序列相同** |
| `[1,2,3]` | `[[1],[2,3]]` | 标准满二叉树两层 |
| `1→2→3→...`（完全右偏） | `[[1],[2],[3],...]` | 每层只有 1 个节点，层数 = 节点数 |
| `[1,2,null,3]` | `[[1],[2],[3]]` | 左偏 + 空位占槽，深度 3 |
| `[1,1,1]` | `[[1],[1,1]]` | 值相同不影响结构，仍按位置分层 |

两个容易错的：

- **`[]` 返回 `[]` 不是 `[[]]`**。写 `while q` 之前没有 `if not root` 守卫，`deque([None])` 会先入队一个 `None`，然后 `node.val` 直接 `AttributeError`；
- **`[1,2]` 和 `[1,null,2]` 结果相同**。这说明这题只看**值序列和分层**，不区分左右。但如果换成"返回每层的节点对象"或者考 199 右视图，两者就分开了 —— 做变体时别把这个直觉带过去。

---

## 九、复杂度

- **时间 `O(n)`**：每个节点恰好入队一次、出队一次。内层的 `for _ in range(size)` 加起来总共执行 `n` 次，不是嵌套的独立遍历 —— 这一点和 LC 82 里"内层 while 推的是同一个 `curr`"是同一类论证；
- **空间 `O(n)`**：队列最宽的时候（最底层）会同时持有约 `n/2` 个节点；结果数组本身也要装 `n` 个值。所以是 `O(n)`，不是 `O(1)`。

> 面试加分点：**能主动区分"队列空间"和"结果空间"。** 队列的峰值是"最宽一层的宽度"，对完全二叉树是 `O(n)`，但对完全偏斜的树退化成 `O(1)`。这个观察能直接引出"为什么 BFS 在宽树上更吃内存、DFS 在深树上更吃栈"的讨论。

---

## 十、常见坑

**1. 拿实时 `len(q)` 当循环条件。**

```python
while q:
    for _ in range(len(q)):    # ✗ 层会串在一起
        ...
```

这是这题唯一真正的坑，也是最常见的失分点。**必须 `size = len(q)` 先存下来。**

**2. 忘了 `if not root` 守卫。**

```python
q = deque([root])              # ✗ root 可能是 None
while q:
    node = q.popleft()
    level.append(node.val)     # ✗ AttributeError
```

**3. 结果返回 `[[]]` 而不是 `[]`。**

空树时如果先 `res.append(level)` 再判断，就会得到一个只含空列表的结果。所以守卫要放在最开头。

**4. 锯齿模式下把入队顺序也反了。**

```python
if reverse:
    if node.right: q.append(node.right)   # ✗ 错的！队列顺序不能跟着反
    if node.left:  q.append(node.left)
```

**入队永远 `left → right`，只反输出的那一头。**

**5. 用 `list.pop(0)` 当出队。**

```python
q = [root]
node = q.pop(0)                # ✗ O(n) 的删除，整体退化成 O(n²)
```

Python 里用 `collections.deque.popleft()`，Java 里用 `ArrayDeque.poll()`。**这个坑在大数据量用例上会超时。**

**6. 把"右视图"直接当成"每层最后一个"套到锯齿模式上。**

上一节 5.3 说过：锯齿下 `level` 的末位是左边那个。**两个变体共用 `size`，但语义不共用。**

**7. 把输入数组的 `null` 当节点。**

`[3,9,20,null,null,15,7]` 里的 `null` 是**占位符**，代表"这个位置没有节点"。自己手动还原树的时候，`9` 的两个孩子位是 `null`，不能给它造出 `None` 值的孩子节点 —— 那会让第 1 层的 `size` 变成 4 而不是 2。

---

## 十一、面试怎么答

**开口 30 秒给思路**（别一上来就写代码）：

> 用 BFS。关键是分层：进 `while` 循环的第一件事是把当前队列长度存成 `size`，因为内层要一边出队一边把下一层节点入队，队列长度一直在变，不存快照就没法确定这一层的边界。然后 `for` 循环跑 `size` 次，每次出队一个、收集它的值、把左右孩子按顺序入队。循环结束就是一层结束，把这一层的结果追加到答案里。时间 O(n)，空间 O(n)。

**然后主动交代两个变体怎么改**：

1. **锯齿（103）**：加一个 `reverse` 判断，`append` 换成"偶数层头插、奇数层尾插"。**队列的入队顺序永远不变，只反输出那一头**；
2. **右视图（199）**：封层时取 `level[-1]`，一行就够，不用单独遍历。

**追问应对**：

- *"为什么一定要 `size`？我直接 `while q` 一轮轮处理不行吗？"* —— 不行。因为第 0 层出队时会立刻把第 1 层入队，队列里同时混着两层。不做快照的话，第 1 层的节点会在同一轮里被一起出掉，层就分不开了。
- *"内层的 `for` 不会让复杂度变成嵌套吗？"* —— 不会。外层 `while` 的每一轮对应一层，`for` 的次数加起来正好是 `n`（每个节点只出队一次），摊还是 `O(n)`。
- *"锯齿能不能用递归 + 层号奇偶判断？"* —— 能，DFS 带一个 `depth` 参数，首次到达某层时先建空数组，然后按 `depth` 奇偶决定 `append` 还是 `insert(0)`。但 BFS 更贴题，而且天然是按层顺序的。
- *"为什么用 deque 不用 list？"* —— `list.pop(0)` 是 `O(n)`，整个算法会退化成 `O(n²)`。`deque.popleft()` 是 `O(1)`。
- *"空间为什么是 O(n)？"* —— 队列峰值是最宽那一层，最坏（完全二叉树）约 `n/2`；结果数组本身也要存 `n` 个值。
- *"199 的右视图能不能不用 level 数组？"* —— 能，`if i == size - 1` 直接收集，省掉中间数组。

---

## 结语

把树系列串起来看，这题的位置是这样的：

| 题 | 核心动作 | 和本题的关系 |
|---|---|---|
| **LC 144 / 94 / 145** 前中后序 | 递归 / 显式栈（DFS） | 深度优先的另一半版图 |
| **LC 102** 层序遍历 | `size = len(q)` 快照分层 | 本文，整个家族的**地基** |
| **LC 103** 锯齿形 | 头插 / 尾插二选一 | 只改"值放哪一头" |
| **LC 199** 右视图 | 封层取末位 | 只加一行 |
| **LC 107** 自底向上 | `res[::-1]` | 只翻层间顺序 |
| **LC 429** N 叉树 | `for child in node.children` | 只换入队的来源 |

这题值得带走的不是那十行代码，而是这个反射：

> **看到"要按层处理"，先想队列；看到"要分出层的边界"，先把 `len(queue)` 存下来。**

`size` 快照这一行，是 102 / 103 / 199 / 107 / 429 五道题的**公共祖先**。记住它，剩下的是换皮；记不住它，每一道都得重新想一遍分层。

```
q = [3]              ← 进 while 前：size = 1
   ↓ 出队 3，入队 9、20
q = [9, 20]          ← 下一轮进 while 前：size = 2
   ↓ 出队 9、20，入队 15、7
q = [15, 7]          ← 再下轮：size = 2
```

**`size` 就是每一层的边界线。** 它是在进 `while` 的那一刻被拍下来的快照，拍完之后队列里怎么翻江倒海，都跟这一层无关了。
