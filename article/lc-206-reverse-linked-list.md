---
title: "【LC 206】反转链表：指针一改就断链，问题到底出在哪"
slug: "lc-206-reverse-linked-list"
category_id: null
tags: ["算法", "链表", "LeetCode", "面试"]
status: "draft"
cover_image: "https://zhoujungis.github.io/photos/lc-206-cover.png"
---

# 【LC 206】反转链表：指针一改就断链，问题到底出在哪

> **适用读者**：刷题刷到链表就卡壳、或者能背出解法但说不清为什么的人
> **技术栈**：Python 为主，迭代解法与 LC 25 附 Java 版
> **难度**：简单（但追问可以一路问到「困难」）
> **收获**：一套「先记住、再掉头、后前移」的固定套路，以及它为什么能同时解决 LC 92、LC 25、LC 24

## 题目

给你单链表的头节点 `head`，请你反转链表，并返回反转后的链表。

```
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

链表节点的定义（后面所有代码都用它）：

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
```

这道题在 LeetCode 上标着「简单」，在面试里出现频率又高得离谱——字节、腾讯、美团、快手，几乎每家的链表题都从它开始。但它之所以被反复考，**不是因为答案难，而是因为它能精确地筛出「你到底是理解了指针，还是背了代码」**。

背下来的版本，面试官稍微一改（改成反转前 n 个、反转区间、K 个一组）就散了。理解了的版本，这些变体只是同一件事换个边界。

所以这篇不急着给答案。我们先把「反转」这两个字翻译成指针操作，再让动画一步步演给你看。

---

## 一、先把「反转」翻译成指针操作

### 1.1 链表和数组，差在哪

数组里反转很简单：两个下标从两头往中间走，交换 `a[i]` 和 `a[n-1-i]`，走完就完了。因为数组里**位置是连续的**，你知道第 5 个元素在哪。

链表不是。链表的节点在内存里可以散得到处都是，**每个节点只知道「我的下一个是谁」，不知道「我前面是谁」，也不知道自己是第几个**。

这就是一切麻烦的根源：你手里只有 `head` 一根线头，拽着它才能摸到整条链子。

### 1.2 反转 = 把每个节点的 next 掉个头

假设原来的链表是：

```
1 → 2 → 3 → 4 → 5 → ∅
```

反转之后要变成：

```
∅ ← 1 ← 2 ← 3 ← 4 ← 5
```

换个方向看，其实就是：

```
5 → 4 → 3 → 2 → 1 → ∅
```

所以「反转链表」这四个字，翻译成指针操作只有一句话：

> **把每个节点的 `next` 从「指向后面那个」改成「指向前面那个」。**

一共 5 个节点，就要改 5 次 `next`。听起来毫无难度——**难的是改的时机**。

### 1.3 一个生活化的比喻

把链表想成一排人蒙着眼睛手拉手，每个人只知道自己右手拉着谁。

现在你要让整排人转过身去，变成反方向站。问题来了：**当你松开右手、准备去拉左边那个人的时候，你原来右边是谁，你就永远不知道了。** 因为你的全部记忆就是「右手拉着的那个人」。

所以正确做法只有一条：

1. **先记住**：右手拉的是谁（`next = curr.next`）；
2. **再转身**：改成左手去拉原来左边的人（`curr.next = prev`）；
3. **再移动**：两个人各往前站一步，处理下一个。

漏掉第 1 步，链子当场断掉——这就是标题里说的「指针一改就断链」。

---

## 二、动画：看着指针一步步掉头

道理讲完了，但指针这种东西，光看文字很难在脑子里转起来。下面这个动画把 `[1,2,3,4,5]` 的完整推演过程拆成了 16 步，可以单步前进/后退，也可以直接播放。

留意三件事：

- **三个指针的位置**：`prev` 永远在 `curr` 后面一格，`next` 只是临时记住的位置；
- **箭头的方向**：每处理完一个节点，它和前面那个节点之间的箭头就翻一次；
- **两个 ∅ 的位置**：一开始空指针在链表最右边（`5` 的后面），全部反转完之后，空指针跑到了最左边（`1` 的前面）——因为原来的头节点变成了尾节点。

<div class="algo-viz algo-viz--lc206"></div>

看完动画你应该能发现：**整个过程里，任何一个时刻都没有「断链」的瞬间**。`next` 指针的作用就是在你要改 `curr.next` 之前，先把通往后面的路留个记号。

> 想自己走一遍的话，拿张纸画五个方格，标上 1~5，然后严格按 ①②③ 三步走。纸上推一遍，比看十遍代码有用。

---

## 三、迭代解法：三个指针

### 3.1 三个指针各管什么

| 指针 | 含义 | 初始值 | 循环结束时的值 |
|---|---|---|---|
| `prev` | 已经反转好的那一段的**头** | `None` | 新链表的头（答案） |
| `curr` | 正在处理的节点 | `head` | `None` |
| `next` | 临时存放 `curr` 原本的下一个 | `None` | `None` |

记住一句话：**`prev` 和 `curr` 之间，永远隔着一道「已反转 / 未反转」的分界线。**

```
        prev          curr
         ↓             ↓
∅ ← 4 ← 3        1 → 2 → 3 → 4 → 5
     └─ 已反转 ─┘  └──── 未反转 ────┘
```

每次循环，分界线往右挪一格，直到 `curr` 走出链表。

### 3.2 逐行拆解

```python
def reverseList(head):
    prev = None          # 反转后的尾节点，它的 next 必须是空
    curr = head          # 从原头节点开始

    while curr:          # curr 走到 None 就结束
        nxt = curr.next  # ① 先记住下一个
        curr.next = prev # ② 掉头
        prev = curr      # ③ prev 前移
        curr = nxt       # ④ curr 前移

    return prev          # 注意：返回 prev，不是 curr
```

逐行说清楚：

**`prev = None`** —— 为什么不是 `prev = head`？因为反转之后，原来的头节点 `1` 会变成**尾节点**，而尾节点的 `next` 必须是空。所以 `prev` 一开始就站在「空」的位置上，等第一次 `curr.next = prev` 执行时，`1.next` 自然就被改成了空。

**`nxt = curr.next`（① 先记住）** —— 整个算法的命门。因为下一行就要把 `curr.next` 改掉了，不先存下来，后面的节点就永远找不到了。

**`curr.next = prev`（② 掉头）** —— 真正干活的一行。`curr` 的箭头从「指向后面」改成「指向前面」。

**`prev = curr`（③ 前移）** —— 注意顺序！必须先执行 ② 再执行 ③。如果反过来先移动 `prev`，那 ② 里用到的 `prev` 就已经是错的值了。

**`curr = nxt`（④ 前移）** —— 用 ① 存下的值前进，不能用 `curr.next`（它已经被改过了，现在指向后面）。

**`return prev`** —— 循环结束时 `curr` 是 `None`，`prev` 停在原链表的最后一个节点上，而它正是反转后的头节点。**这里写错是最高频的低级错误。**

### 3.3 完整推演表

拿 `[1,2,3,4,5]` 走一遍：

| 轮次 | ① `curr` | ① `nxt` 记住 | ② `curr.next` 改成 | ③ `prev` | ④ `curr` |
|---|---|---|---|---|---|
| 初始 | 1 | — | — | ∅ | 1 |
| 第 1 轮 | 1 | 2 | ∅ | 1 | 2 |
| 第 2 轮 | 2 | 3 | 1 | 2 | 3 |
| 第 3 轮 | 3 | 4 | 2 | 3 | 4 |
| 第 4 轮 | 4 | 5 | 3 | 4 | 5 |
| 第 5 轮 | 5 | ∅ | 4 | 5 | ∅ |

第 5 轮结束后 `curr` 变成 `∅`，循环退出，返回 `prev = 5`。此时整条链是 `5 → 4 → 3 → 2 → 1 → ∅`。

### 3.4 边界情况

| 输入 | 过程 | 返回 |
|---|---|---|
| `head = None` | `while` 一次都不进 | `prev = None`，正确 |
| `head = [7]`（单节点） | 循环 1 次：`7.next = None`，`prev = 7`，`curr = None` | `7`，正确 |
| `head = [1,2]` | 循环 2 次 | `2 → 1`，正确 |

**这三种情况都不需要单独写 `if`。** 这是迭代解法比递归解法舒服的地方——递归必须显式处理空和单节点，迭代天然覆盖。

### 3.5 Java 版

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nxt = curr.next;  // ① 先记住
            curr.next = prev;          // ② 掉头
            prev = curr;               // ③ 前移
            curr = nxt;                // ④ 前移
        }
        return prev;
    }
}
```

Java 里 `nxt` 必须声明在循环体内（每次新建一个引用），如果提到循环外面复用同一个变量，逻辑上没错但可读性会差一些。另外注意：Java 没有 Python 的元组赋值，所以这四行**不能像 Python 那样压成一行**——顺序是真的有讲究。

---

## 四、递归解法

### 4.1 换个角度：先让后面的人转过身

迭代是「从头往后」，递归可以反过来想：

> 假设 `reverseList(head.next)` 已经帮你把**后面那一整段**反转好了，并且返回了新的头节点。你现在只需要处理 `head` 这一个节点——把它接到反转后那段的**末尾**去。

这里有个关键点要想清楚：`reverseList(head.next)` 返回的是**新的头**（也就是原链表的尾节点），而 `head.next` 这个节点，在反转之后变成了那一段的**尾**。

所以：

- `head.next.next = head` —— 让「反转后那段的尾」指向 `head`；
- `head.next = None` —— `head` 成为新的尾节点，它的 `next` 必须清空。

### 4.2 调用栈推演

以 `[1,2,3]` 为例，把递归的展开和回收完整写出来：

```
reverseList(1)
  │ head.next = 2，不是终止条件 → 先不管自己，去问 reverseList(2)
  │
  ├─ reverseList(2)
  │    │ head.next = 3，不是终止条件 → 去问 reverseList(3)
  │    │
  │    └─ reverseList(3)
  │         └─ head.next == None → 终止，返回 3
  │            ★ 这个 3 就是整个链表反转后的新头，一路原样传回去
  │
  │  ★ 回到 reverseList(2)：newHead = 3
  │    head.next.next = head   →  3.next = 2
  │    head.next = None        →  2.next = ∅
  │    返回 3                   此时链是 3 → 2 → ∅
  │
★ 回到 reverseList(1)：newHead = 3
  head.next.next = head        →  2.next = 1
  head.next = None             →  1.next = ∅
  返回 3                         此时链是 3 → 2 → 1 → ∅
```

两个容易看错的地方：

1. **`newHead` 从头到尾都是同一个节点**（原链表的尾节点）。每一层递归只是把它原样往上抛，真正干活的是 `head.next.next = head` 这两行。
2. **递归是「先走到最深处，再从最深处往回改指针」**。所以指针的修改顺序和迭代是反的：迭代先改 `1.next`，递归最后才改 `1.next`。

### 4.3 代码

```python
def reverseList(head):
    # 终止条件：空链表，或者只剩一个节点
    if not head or not head.next:
        return head

    new_head = reverseList(head.next)  # 先把后面整段反转好
    head.next.next = head              # 让后面的尾节点指向自己
    head.next = None                   # 自己成为新的尾节点
    return new_head                    # 新头节点一路原样传回去
```

**终止条件为什么是 `if not head or not head.next`？**

- `not head`：处理空链表。没有这个判断，下一行的 `head.next` 会直接抛 `AttributeError`。
- `not head.next`：只剩一个节点，它自己就是反转后的结果，直接返回。

这两个条件是「或」的关系，缺一不可。只写 `not head.next`，输入 `None` 时会崩；只写 `not head`，单节点链表会多递归一层（虽然也能跑对，但会多一次无意义的调用）。

### 4.4 Java 版

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode newHead = reverseList(head.next);
        head.next.next = head;
        head.next = null;
        return newHead;
    }
}
```

### 4.5 递归的代价

递归写法更短、更「优雅」，但面试里如果你只写递归，通常会被追问一句：**「空间复杂度是多少？」**

答案是 **O(n)**——不是因为你开了数组，而是因为**函数调用栈**。`n` 个节点就会压 `n` 层栈帧。

所以：

- 链表长度只有几万时，Python 默认递归深度（1000）就会先炸掉，报 `RecursionError`；
- Java 默认栈大约能撑几千到一万层，也会 `StackOverflowError`；
- 真实工程里处理长链表，**必须用迭代**。

面试时标准答法是：**「递归 O(n) 空间，迭代 O(1) 空间；如果没有特别要求，我写迭代。」**

---

## 五、追问：K 个一组反转（LC 25）

面试官问完递归，下一句大概率是：

> 「那如果改成每 K 个一组反转，不足 K 个保持原样呢？」

对应 LeetCode 25 题，难度直接从「简单」跳到「困难」。但如果你已经理解了 206，这题其实只是**把 206 做了三件事**。

### 5.1 把大问题拆成三个动作

以 `head = [1,2,3,4,5]`，`k = 2` 为例，答案是 `[2,1,4,3,5]`。

```
原链表： 1 → 2 → 3 → 4 → 5 → ∅

第一组 [1,2] 反转：  2 → 1
第二组 [3,4] 反转：  4 → 3
剩下的 [5] 不足 2 个：保持原样

拼起来： 2 → 1 → 4 → 3 → 5 → ∅
```

所以整件事拆成三个动作：

1. **数够 K 个**：从当前位置往后数 `k` 个，如果中途遇到 `None`，说明剩下不足 K 个，**直接返回，不再处理**；
2. **组内反转**：把这一段的 `next` 掉头——和 206 一模一样；
3. **接回去**：让上一组的尾节点指向这一组的新头，再让这一组的尾节点（原来的组头）指向下一组的头。

难点全在 **第 3 步的连接**，因为反转之后「头变尾、尾变头」，指针很容易接反。

### 5.2 哑结点：为什么必须有

第一组反转之后，`head` 指向的节点不再是链表的头了。如果没有一个「站在链表外面」的锚点，你没法优雅地把第一组的新头接上去。

所以引入**哑结点（dummy node）**：

```python
dummy = ListNode(0, head)   # 哑结点指向原来的头
```

它不参与反转，只是提供一个固定的起点。最后返回 `dummy.next` 就是答案。

这也是链表题的一个通用技巧：**只要涉及「头节点可能被换掉」，就先加一个哑结点。** 它能把「改头」和「改中间」这两种情况统一成一种。

### 5.3 迭代实现

```python
def reverseKGroup(head, k):
    dummy = ListNode(0, head)
    group_prev = dummy          # 上一组的尾节点（也是这一组头节点的前驱）

    while True:
        # ── 1. 数够 k 个 ──
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if kth is None:
                # 剩下不足 k 个，保持原样，直接结束
                return dummy.next

        group_next = kth.next   # 下一组的头节点

        # ── 2. 组内反转 ──
        # prev 的初值设成 group_next，这样反转完，这一组的尾节点
        # 天然就接上了下一组，不需要额外处理。
        prev, curr = group_next, group_prev.next
        while curr is not group_next:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt

        # ── 3. 接回去 ──
        # 反转后：kth 成了这一组的头，group_prev.next（原来的组头）成了这一组的尾
        group_tail = group_prev.next
        group_prev.next = kth   # 上一组 → 这一组的新头
        group_prev = group_tail # 这一组的尾，成为下一组的 group_prev
```

第 2 步里 `prev` 初值设成 `group_next` 是个很妙的细节：这样反转完之后，这一组原来的头节点（现在的尾节点）的 `next` 已经指向下一组的头了，**第 3 步的连接工作省掉一半**。

推演一遍 `[1,2,3,4,5]`、`k=2`：

| 轮次 | `group_prev` | 找到的 `kth` | `group_next` | 反转后 | 整条链 |
|---|---|---|---|---|---|
| 初始 | `dummy` | — | — | — | `d → 1 → 2 → 3 → 4 → 5` |
| 第 1 轮 | `d` | `2` | `3` | `2 → 1` | `d → 2 → 1 → 3 → 4 → 5` |
| 第 2 轮 | `1` | `4` | `5` | `4 → 3` | `d → 2 → 1 → 4 → 3 → 5` |
| 第 3 轮 | `3` | 数不到 2 个 | — | 直接返回 | 返回 `d.next` = `2 → 1 → 4 → 3 → 5` |

### 5.4 递归实现

递归版本更好背，也更能看出「分组」这个结构：

```python
def reverseKGroup(head, k):
    # 1. 先确认这一组够 k 个；不够就原样返回
    node = head
    for _ in range(k):
        if node is None:
            return head
        node = node.next

    # 2. 反转这一组的前 k 个节点
    prev, curr = None, head
    for _ in range(k):
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    # 此时：prev 是这一组的新头，head 是这一组的尾，curr 是下一组的头

    # 3. 这一组的尾，接上「后面剩下的部分」递归处理的结果
    head.next = reverseKGroup(curr, k)

    return prev
```

第 3 步是整段代码的关键：`head` 现在是这一组的尾节点，让它指向「后面所有组处理完之后的结果」。

### 5.5 Java 版

```java
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head);
        ListNode groupPrev = dummy;

        while (true) {
            // 1. 数够 k 个
            ListNode kth = groupPrev;
            for (int i = 0; i < k; i++) {
                kth = kth.next;
                if (kth == null) return dummy.next;
            }
            ListNode groupNext = kth.next;

            // 2. 组内反转
            ListNode prev = groupNext;
            ListNode curr = groupPrev.next;
            while (curr != groupNext) {
                ListNode nxt = curr.next;
                curr.next = prev;
                prev = curr;
                curr = nxt;
            }

            // 3. 接回去
            ListNode groupTail = groupPrev.next;
            groupPrev.next = kth;
            groupPrev = groupTail;
        }
    }
}
```

### 5.6 边界：为什么是「不足 K 个保持原样」

这是题目明确要求的，也是最容易写错的地方。两种错误写法：

```python
# ❌ 错误 1：不足 k 个也反转了
for _ in range(k):
    kth = kth.next          # 中途 kth 变成 None，下一轮直接 AttributeError

# ❌ 错误 2：忘记检查，把剩下的当成完整一组处理
kth = group_prev
for _ in range(k):
    kth = kth.next
# 如果 kth 是 None，下面 group_next = kth.next 直接崩
```

正确写法必须**在循环里检查**，一碰到 `None` 就返回，不能等循环结束再检查。

---

## 六、复杂度对比

| 解法 | 时间 | 空间 | 适用场景 |
|---|---|---|---|
| 206 迭代 | O(n) | **O(1)** | 首选，任何长度都安全 |
| 206 递归 | O(n) | O(n) 调用栈 | 代码短，但长链表会爆栈 |
| 25 迭代 | O(n) | **O(1)** | 首选 |
| 25 递归 | O(n) | O(n/k) 调用栈 | 每 k 个一组，栈深是组数 |

时间都是 O(n) 很好理解：每个节点恰好被访问一次、`next` 恰好被改一次。空间差异才是面试的考点。

---

## 七、常见坑

按踩到的频率排序：

**1. 忘了先存 `next`，链子直接断**

```python
# ❌ 反例
curr.next = prev
curr = curr.next   # 这里 curr 已经是 prev 了，整条链丢了
```

**2. 返回 `curr` 而不是 `prev`**

循环结束时 `curr` 是 `None`，返回它就返回了个空链表。

**3. 递归里漏掉 `head.next = None`**

```python
# ❌ 漏了这一行
head.next.next = head
return new_head
```

后果是形成**环**：`1 → 2` 变成 `2 → 1`，而 `1` 的 `next` 还指着 `2`。这时链表是 `2 → 1 → 2 → 1 → ...` 无限循环，打印的时候会死循环。

**4. 递归终止条件写不全**

- 只写 `if not head.next` → 输入 `None` 时崩；
- 只写 `if not head` → 单节点链表会多递归一层。

**5. LC 25 里把「不足 k 个」的判断放在循环外面**

必须一碰到 `None` 就返回，不能等数完再判断。

**6. LC 25 里接错指针**

记住反转后的对应关系：**原来的组头变成组尾，原来的第 k 个变成组头。**

---

## 八、面试怎么答

如果面试官直接甩出 206，不要上来就写代码。推荐这个顺序：

1. **先确认输入输出**：「输入是头节点，返回反转后的头节点，对吗？空链表返回空？」
2. **说出核心思路**：「用三个指针，`prev` 指向已反转段的头，`curr` 指向待处理节点，每轮先存 `next` 再掉头。」
3. **主动提边界**：「空链表和单节点都不用特判，循环天然覆盖。」
4. **写完再讲复杂度**：「时间 O(n)，空间 O(1)。」
5. **主动抛追问**：「如果要求 K 个一组反转，思路是把 206 重复做，加一个哑结点处理组间连接——要展开吗？」

第 5 步是关键。面试官问「递归怎么写」，其实是在看你能不能把同一个问题换个角度重新表述；问「K 个一组」，是在看你能不能把复杂问题拆成已知问题的组合。

**这道题考的不是链表，是你能不能把「指针操作」这件事讲清楚。**

---

## 结语

把三道题放在一起看，会发现它们其实是同一件事：

| 题目 | 变化的部分 | 不变的部分 |
|---|---|---|
| 206 反转链表 | 从头反到尾 | 先记住 → 再掉头 → 后前移 |
| 92 反转链表 II | 只反一段，前后要接上 | 同上 + 哑结点 |
| 25 K 个一组反转 | 分段反，段间要接上 | 同上 + 哑结点 + 数够 k 个 |

**变化的是边界，不变的是那三步。**

所以下次再遇到链表反转的变体，先别慌着写代码。问自己两个问题：

1. 这次要反转的是**哪一段**？
2. 反转完之后，**这一段的前后要接谁**？

把这两个问题回答清楚，代码自然就出来了。

---

> 本文的推演动画是页面里的交互组件，可以单步回放。如果你想照着它手推一遍，拿张纸画五个格子就行——**在纸上推一遍，胜过看十遍代码。**
