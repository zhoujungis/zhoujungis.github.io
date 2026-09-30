---
title: 【LC 139】单词拆分：一个布尔 dp，和一条把 dp 变成切分的回溯
slug: lc-139-word-break
cover_image: /photos/lc-139-cover.png
date: 2026-09-30
tags: [算法, 动态规划, LeetCode, 面试]
---

## 题目

**LC 139 单词拆分**：给你一个字符串 `s` 和一个字符串列表 `wordDict` 作为字典。请你判断是否可以利用字典中出现的单词拼接出 `s`。字典中的**单词可以重复使用**。

```
输入: s = "leetcode", wordDict = ["leet", "code"]
输出: true   （"leetcode" = "leet" + "code"）

输入: s = "applepenapple", wordDict = ["apple", "pen"]
输出: true   （"apple" + "pen" + "apple"，"apple" 用了两次）

输入: s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
输出: false
```

它是 **LC 322 零钱兑换**的布尔版：硬币换成了单词，金额换成了前缀长度，`min` 换成了逻辑或。递推式依然只有一行，真正的门槛在三处 —— **`dp[0] = true` 这个底座**、**`maxLen` 窗口剪枝**，以及**"能不能"与"怎么切"的分工**。最后一条是本文第二幕的主角：dp 表只回答能不能，要还原本来的切分，得把同一张表从右往左读一遍。

- [一、核心洞察：dp 定义与状态转移](#section-1)
- [二、为什么 `dp[0] = true` 是唯一的底座](#section-2)
- [三、动画怎么看](#section-3)
- [四、完整推演表](#section-4)
- [五、同族题：322 / 279 / 518 / 377 / 140 / 416](#section-5)
- [六、Java 版](#section-6)
- [七、边界情况](#section-7)
- [八、复杂度](#section-8)
- [九、常见坑](#section-9)
- [十、面试怎么答](#section-10)

## 一、核心洞察：dp 定义与状态转移

暴力的思路是枚举"在哪些位置下刀"。`n` 个字符之间有 `n - 1` 个缝隙，每个缝切开或不切，`2^(n-1)` 种切法，`n = 20` 就崩了。

换成**逐个前缀地逼近**：

> 不问"切成哪些词"，而问"**`s` 的前 `i` 个字符能不能拼出来**"。

于是定义：

- `dp[i]` = `s` 的前 `i` 个字符能否由字典拼出；
- `dp[0] = true`（空串天然拼得出 —— 这是唯一的底座）；
- 其余全部初始化成 `false`（先假定拼不出，拼得出再翻上来）。

递推式只有一行：

```
dp[i] = OR over j < i ( dp[j] && s[j:i] ∈ dict )
```

语义是：**把 `s[j:i]` 当作"最后一个词"去试** —— 剩下 `s[0:j]` 能不能拼已经知道（`dp[j]`），只要这一段本身是个词，`dp[i]` 就成立。`i` 从 `1` 到 `n` **正序**推进，等算 `dp[i]` 时用到的 `dp[j]`（下标更小）早就写好了。

```python
def wordBreak(s, wordDict):
    word_set = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    return dp[n]
```

三个细节决定了成败：

1. **`dp[0] = true` 而不是 `false`**：它代表"一个字符都还没拼"的初始状态。写成 `false` 的话，`"leet"` 这种**整串就是一个词**的情况（`j = 0`）直接被判死 —— 底座塌了，上面全塌。
2. **字典用 `set`**：`s[j:i] in word_set` 是哈希查找。用 `list` 逐个字符串比，最坏 `O(n)` 一次的字符串比较叠上去，直接超时。
3. **`j` 只枚举 `maxLen` 窗口内**：`j >= i - maxLen`，因为最后一个词最长就是 `maxLen`。更靠左的 `j` 长度都对不上，不必看。

## 二、为什么 `dp[0] = true` 是唯一的底座

这一格是整个算法的地基，值得单独说清。

`dp[i]` 回答的是"前 `i` 个字符能否拆成若干净词"。当 `i = 0` 时，"前 0 个字符"就是空串 —— 空串不需要任何词就能拼出，所以它是 `true`。这条定义不是凑出来的，它是递推的**起点**：任何一条完整的切分链，从右往左回溯时，最后一定落在 `dp[0]` 上。

反过来看两个"差点踩到"的写法：

```python
# 错法一：dp[0] = False —— 整串就是一个词时全盘皆输
dp[0] = False
# wordBreak("leet", ["leet"])：j = 0 时 dp[0] 是 false，dp[4] 永远起不来 → 返回 False

# 错法二：初始化成全 True —— 等于宣布"任何前缀都拼得出"
dp = [True] * (n + 1)
# 那 dp[n] 恒为 true，函数永远返回 True，字典形同虚设
```

再顺手把另外两条优化说透 —— 它们**不改语义，只剪枝**：

- **字典用 `set`（哈希）**：`dict.has(w)` 是 `O(1)` 级别的查找，而不是在 `list` 里逐个字符串比。数据量一大，这一条就是超时与通过的分界线。
- **`maxLen` 窗口**：先扫一遍字典求出最长词长 `maxLen`，内层 `j` 只从 `max(0, i - maxLen)` 枚举到 `i - 1`。因为"最后一个词"长度不可能超过 `maxLen`，更靠左的 `j` 全是无效枚举。这把内层从 `O(n)` 压到 `O(maxLen)`。

还有个容易忽略的点：**为什么要正序推进 `i`**。因为 `dp[i]` 只依赖比它小的下标 `dp[j]`，正序保证这些格子**已经算好**。这和 LC 322 里"内层金额正序 = 完全背包"是同一个道理 —— 允许"再叠一个词"（`apple | pen | apple`）。如果把 `i` 逆着推，就会读到还没算的格子，语义全乱。

一句话记住这题的骨架：

> **`dp[0] = true` 是唯一的底座，`dp[i] = OR( dp[j] && s[j:i] ∈ dict )` 是唯一的转移，`maxLen` 窗口是唯一的剪枝。**

## 三、动画怎么看

<div class="algo-viz algo-viz--lc139"></div>

<div class="algo-viz algo-viz--lc139seg"></div>

**动画一**（`algo-viz--lc139`）：最上面是 `dp[0..n]` 整行布尔格（`T` / `F`），当前前缀 `i` 描金框、切分点 `j` 描绿框，`j` 的搜索窗口垫一条浅色底带；中间是 `s` 的每个字符，**字符 `k` 落在边界 `k` 与 `k + 1` 之间**，于是候选的最后一段 `s[j:i]` 正好从 `j` 跨到 `i`，金框把它整段标出来；下面是转移横幅，写出 `dp[i] = dp[j] && s[j:i] ∈ dict` 的现场取值。盯住两件事：**只有 `dp[j] = true` 的切分点才会发一帧**（`dp[j] = false` 的会被"跳过"计数吃掉），以及**命中即短路** —— `dp[i]` 一旦翻成 `true`，本格剩下的切分点根本不再试。

**动画二**（`algo-viz--lc139seg`）：表**算完之后**，怎么把 `s` 真的切成词。上面是那张算好的 `dp` 表，中间是字符串行，已经锁定的段染绿、正在试的候选段描金或虚线，每锁定一段就在下面挂一个 `"apple"` 这样的词标签；最底下一条 `pos` 游标。`pos` 从 `n` 往左走，每次都从 `j = pos - 1` **递减**试到窗口左端 —— 也就是"最后一段**从短到长**"地试，找到 `dp[j] = true` 且 `s[j:pos]` 是词的就锁定、把 `pos` 挪到 `j`。走到 `pos = 0` 就切完了。

两个动画分工明确：动画一**填表**（枚举"最后一个词"、从左往右推进），动画二**读表**（从 `n` 往回切）。

## 四、完整推演表

**动画一**：`s = "applepenapple"`，`wordDict = ["apple", "pen"]`（与动画默认一致，`maxLen = 5`）。

| i | 前缀 `s[0:i]` | 逐个试（`j`, `s[j:i]`, 判定） | `dp[i]` |
|---|---|---|---|
| 1 | `a` | (0, `"a"`, ✗) | F |
| 2 | `ap` | (0, `"ap"`, ✗) | F |
| 3 | `app` | (0, `"app"`, ✗) | F |
| 4 | `appl` | (0, `"appl"`, ✗) | F |
| 5 | `apple` | **(0, `"apple"`, ✓)** | **T** |
| 6 | `applep` | 跳过 1–4（`dp[j] = false`）；(5, `"p"`, ✗) | F |
| 7 | `applepe` | 跳过 2–4；(5, `"pe"`, ✗) | F |
| 8 | `applepen` | 跳过 3–4；**(5, `"pen"`, ✓)** | **T** |
| 9 | `applepena` | 跳过 4；(5, `"pena"`, ✗)；跳过 6–7；(8, `"a"`, ✗) | F |
| 10 | `applepenap` | (5, `"penap"`, ✗)；跳过 6–7；(8, `"ap"`, ✗) | F |
| 11 | `applepenapp` | 跳过 6–7；(8, `"app"`, ✗) | F |
| 12 | `applepenappl` | 跳过 7；(8, `"appl"`, ✗) | F |
| 13 | `applepenapple` | **(8, `"apple"`, ✓)** | **T** |

最终 `dp = [T, F, F, F, F, T, F, F, T, F, F, F, F, T]`，返回 `true`。三处 `T` 正是三次命中：`dp[5]`（`apple`）、`dp[8]`（`apple | pen`）、`dp[13]`（`apple | pen | apple`）。顺 `cut` 表回溯：`13 → 8 → 5 → 0`，切分就是 `apple | pen | apple` —— `apple` 用了**两次**，这正是"完全背包"的语义。

**动画二**：同一组数据，看回溯怎么把 `s` 切开。

| `pos` | 从 `j = pos−1` 往左试（`j`, `s[j:pos]`, `dp[j]`, ∈dict） | 锁定 |
|---|---|---|
| 13 | (12, `"e"`, F, ✗) (11, `"le"`, F, ✗) (10, `"ple"`, F, ✗) (9, `"pple"`, F, ✗) **(8, `"apple"`, T, ✓)** | `apple` |
| 8 | (7, `"n"`, F, ✗) (6, `"en"`, F, ✗) **(5, `"pen"`, T, ✓)** | `pen` |
| 5 | (4, `"e"`, F, ✗) (3, `"le"`, F, ✗) (2, `"ple"`, F, ✗) (1, `"pple"`, F, ✗) **(0, `"apple"`, T, ✓)** | `apple` |

切到最后 `pos = 0`，锁定链 `13 → 8 → 5 → 0`，得到同一组答案。注意整个过程**没有额外的 `cut` 表** —— `dp` 表本身就是"每个位置能不能拼出"的完整信息：只要 `dp[j] = true` 且 `s[j:pos]` 是词，这一段就一定接得上。

## 五、同族题：322 / 279 / 518 / 377 / 140 / 416

139 是"完全背包的布尔版"。同一副骨架换个问法，就是一条完整的题链：

- **LC 322 零钱兑换**：`dp[x]` = 凑出金额 `x` 的**最少硬币枚数**，求 `min`；139 把 `min` 换成了**逻辑或**。两者连剪枝窗口的形状都一样。
- **LC 279 完全平方数**：硬币换成 `1, 4, 9, 16, ...`，问凑出 `n` 的最少个数 —— 与 322 逐字同构。
- **LC 518 零钱兑换 II**：完全背包但求**方案数**，转移变成 `dp[a] += dp[a-c]`，且必须外层硬币、内层金额正序 —— 这个顺序把"同一种组合的不同排列"去掉了，数的才是组合数。
- **LC 377 组合总和 IV**：同一行加法、但外层金额、内层硬币 —— 顺序反过来，数的就变成了**排列数**。377 与 518 的差别只有循环嵌套的顺序。
- **LC 140 单词拆分 II**：139 的回溯版 —— 把动画二里"找到一个就停"换成"DFS 枚举所有 `j`"、再配记忆化，就是它。**139 只问能不能，140 要列出所有切分方案。**
- **LC 416 分割等和子集**：求"能否恰好装满 `sum/2`"，但**每件元素只能用一次** —— 这是 **0-1 背包**，内层容量必须**逆序**。`LC 494 目标和`、`LC 1049 最后一块石头重量 II` 同理。

把它们排成一列看：**背包的容量维就是金额/前缀维，物品就是硬币/单词；"无限件"用正序，"每件一次"用逆序；求最值用 `min/max`，求方案数用 `+`，求可达性用 `OR`。** 139 只是这条坐标轴上的一个点。

## 六、Java 版

```java
class Solution {
    // LC 139：标准 DP —— 与推演表逐帧一致
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);   // 哈希查找，别在 list 里逐个比
        int n = s.length();
        int maxLen = 0;
        for (String w : wordDict) maxLen = Math.max(maxLen, w.length());
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;                                 // 唯一的底座：空串拼得出
        for (int i = 1; i <= n; i++) {
            int lo = Math.max(0, i - maxLen);         // 最后一词最长 maxLen
            for (int j = i - 1; j >= lo; j--) {
                if (dp[j] && dict.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;                            // 命中即短路
                }
            }
        }
        return dp[n];
    }
}
```

```java
class Solution {
    // LC 139 的另一种视角：把位置当下标、词当边，BFS 看 n 可不可达
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        int n = s.length();
        int maxLen = 0;
        for (String w : wordDict) maxLen = Math.max(maxLen, w.length());
        boolean[] seen = new boolean[n + 1];
        Deque<Integer> queue = new ArrayDeque<>();
        seen[0] = true;
        queue.addLast(0);
        while (!queue.isEmpty()) {
            int p = queue.pollFirst();
            if (p == n) return true;
            int hi = Math.min(n, p + maxLen);
            for (int end = p + 1; end <= hi; end++) {
                if (!seen[end] && dict.contains(s.substring(p, end))) {
                    seen[end] = true;
                    queue.addLast(end);
                }
            }
        }
        return false;
    }
}
```

```java
class Solution {
    // LC 140 的骨架：139 只问能不能，这里要列出所有切分（记忆化 DFS）
    public List<String> wordBreak(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        Map<Integer, List<String>> memo = new HashMap<>();
        return dfs(s, 0, dict, memo);
    }

    private List<String> dfs(String s, int p, Set<String> dict, Map<Integer, List<String>> memo) {
        if (memo.containsKey(p)) return memo.get(p);
        List<String> res = new ArrayList<>();
        if (p == s.length()) {
            res.add("");
            return res;
        }
        for (int end = p + 1; end <= s.length(); end++) {
            String w = s.substring(p, end);
            if (!dict.contains(w)) continue;
            for (String tail : dfs(s, end, dict, memo)) {
                res.add(tail.isEmpty() ? w : w + " " + tail);
            }
        }
        memo.put(p, res);
        return res;
    }
}
```

第二个写法值得单独记一笔：**把每个字符位置当作图上的点，每个字典词当作一条从 `p` 指向 `p + len` 的边**，问题就变成"从 `0` 能不能走到 `n`"的**可达性**。BFS 一遍即可，和 DP 完全等价 —— 这个视角在追问"打印一条切分路径"时特别顺手（记前驱就行）。注意从 `p` 出发，词长最多 `maxLen`，所以只需枚举到 `p + maxLen`。

## 七、边界情况

- **`s` 为空串**：`dp[0] = true`，直接返回 `true`（题面通常保证 `s` 非空，但底座语义要清楚）；
- **字典里有比 `s` 还长的词**：永远装不下，`maxLen` 窗口会把它自然排除，或先过滤掉；
- **整串就是一个词**：`"leet"` + `["leet"]` → `dp[0]` 这一格就是唯一支撑，`j = 0` 一次命中；
- **词可以重复使用**：`"applepenapple"` + `["apple","pen"]` 里 `apple` 用了两次 —— 这是"完全背包"，不是"每词一次"；
- **前缀可达但尾巴断掉**：`"catsandog"` + `["cats","dog","sand","and","cat"]`，`dp[3]`、`dp[4]`、`dp[7]` 都是 `true`，但 `dp[9]` 拼不出来 → 返回 `false`。**前缀可达 ≠ 整体可达**；
- **字典里有空串或重复词**：先 `set` 去重、过滤空串，否则 `s[j:i] = ""` 会让 `i` 原地踏步；
- **大小写**：`substring` 是精确匹配，`"Leet"` 与 `"leet"` 不是同一个词。

## 八、复杂度

| 写法 | 时间 | 空间 |
|---|---|---|
| 139 标准 DP（前缀 × 窗口） | `O(n × maxLen)` | `O(n)` |
| 139 DP（内层不剪枝，枚举全部 `j`） | `O(n²)` | `O(n)` |
| 139 BFS 可达性 | `O(n × maxLen)` | `O(n)` |
| 139 回溯还原切分（动画二） | `O(n × maxLen)` | `O(n)` |
| 140 记忆化 DFS（列出所有方案） | 输出相关，最坏指数级 | `O(n × 方案数)` |

`n` 是 `s` 的长度，`maxLen` 是字典里最长词的长度。DP 与 BFS 的时间同为 `O(n × maxLen)`：每个起点 `p` 最多往外扩 `maxLen` 个字符。剪枝的关键全在 `maxLen` 上 —— **不加窗口就是 `O(n²)`，加了就是 `O(n × maxLen)`**，而 `maxLen` 通常远小于 `n`。

## 九、常见坑

1. **`dp[0]` 写成 `false`**：`"leet"` 这种整串即一个词的情况直接判错。它是唯一的底座，必须是 `true`。
2. **`dp` 全初始化成 `true`**：等于宣布"任何前缀都拼得出"，函数永远返回 `true`。
3. **字典用 `list` 逐个比**：`s[j:i] in list` 每次都是线性扫描，数据一大就超时。先转 `set`。
4. **忘了 `maxLen` 窗口**：逻辑仍然正确，但内层退化成枚举全部 `j`，复杂度从 `O(n × maxLen)` 涨到 `O(n²)`。
5. **命中后不 `break`**：逻辑上多试几次也能得到 `true`，但白白浪费；更重要的是动画里"命中即短路"是本题的一个考点。
6. **把 139 和 140 搞混**：139 只问**能不能**（布尔或 + 短路），140 要**列出所有切分**（DFS + 记忆化）。139 的 dp 表是 140 的记忆化数组的雏形。
7. **`s[j:i]` 的边界搞反**：Python/Java 的切片都是**左闭右开**，`s[j:i]` 正好是"从 `j` 起、长度 `i - j`"的那一段，别写成 `s[j:i+1]`。
8. **误以为要"每个词只能用一次"**：139 明说**词可以重复使用**，所以是正序推进的完全背包；"每件一次"那是 LC 416 那类 0-1 背包。
9. **字典里有比 `s` 长的词**：不影响正确性（`maxLen` 窗口会排除），但会让窗口白白变宽，最好先过滤。

## 十、面试怎么答

**第一段 · 定义与转移**：`dp[i]` = `s` 的前 `i` 个字符能否由字典拼出，`dp[0] = true`、其余 `false`，`dp[i] = OR( dp[j] && s[j:i] ∈ dict )`，`i` 正序推进。说清 `dp[0]` 为什么必须是 `true`。

**第二段 · 两项优化**：字典转 `set`（哈希查找代替线性扫描），切分点 `j` 只枚举 `maxLen` 窗口内（`j >= i - maxLen`）。两条都**不改语义**，但把复杂度从 `O(n²)` 压到 `O(n × maxLen)`。**这一段是区分度所在**，能主动说出来比写对代码更值钱。

**第三段 · 换个视角**：把字符位置当图上的点、字典词当边，问题就是"`0` 能否到达 `n`"的**可达性**，BFS 一遍即可。DP 与 BFS 在这里等价 —— 这个视角在追问"打印一条切分路径"时特别顺手（记前驱）。

**追问连跳**：
- 要**列出所有切分方案** → LC 140，把"找到一个就停"换成"DFS 枚举所有 `j`" + 记忆化；
- 要**最少词数** → LC 322 / 279，把 `OR` 换成 `min`；
- 要**方案数** → LC 518（外层词、内层前缀正序）；要**排列数** → LC 377（循环顺序对调）；
- **每件只能用一次** → LC 416 / 494 / 1049，内层逆序。

一句话收尾："单词拆分只有一台机器 —— 前缀上的布尔背包，`dp[i] = OR( dp[j] && s[j:i] ∈ dict )`；区别只在方向、在 `min` 还是 `+`、在只问能不能还是要列出所有方案。"

## 结语

139 的全部难度浓缩在两处：一行初始化（`dp[0] = true`）和一条窗口（`maxLen`）。前者决定了"整串即一个词"能不能被表达，后者决定了会不会超时 —— 前者是定义问题，后者是效率问题。而 dp 表算完之后，它自己就是一张"每个位置能不能拼出"的完整地图：顺着它从右往左走一遍，就能把 `s` 真的切开，这就是 140 的入口。

下一篇见。
