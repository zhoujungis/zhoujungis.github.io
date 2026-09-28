/**
 * bucketTopKSteps.js — 「前 K 个高频元素」(LeetCode 347) 桶排序解法的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 bucketTopK.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 题目要求"优于 O(n log n)"，先哈希计数（O(n)）之后，剩下一个问题：
 * **按频率挑出前 k 个值。** 两条路：
 *
 *   - 小根堆：O(n log k)。通用，频率什么范围都行；
 *   - **桶排序：O(n)。** 用频率直接当数组下标 —— 因为一个元素的出现频率
 *     **天然落在 [1, n] 里**（最多也就出现 n 次），所以"按频率分桶"
 *     根本不需要比较排序，建 n+1 个桶、扫一遍丢进去就行。
 *     收集时从高频端（下标 n）往低频端扫，收满 k 个停。
 *
 * 桶排序的这步"用值域当下标"和计数排序是同一个思想 ——
 * **当你发现要排序的键恰好是一个很小的整数范围，排序就可以免费。**
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'count' | 'bucket' | 'collect' | 'done'
 *   desc: string
 *   nums: number[]         // 原数组（不会被修改）
 *   n, k
 *   freq: Object           // { 值: 频率 }（键是字符串化的值）
 *   buckets: number[][]    // buckets[f] = 频率恰好为 f 的值列表（下标 0..n）
 *   cur: number|null       // count / bucket 帧正在处理的值
 *   curFreq: number|null   // 该值的频率
 *   bucketIdx: number|null // bucket 帧：放入的桶下标
 *   collectIdx: number|null// collect 帧：正在扫的桶下标
 *   ans: number[]          // 已收集的答案（收集顺序 = 频率从高到低）
 *   collected: number      // 已收集个数
 *   done: boolean
 *
 * ⚠️ 收尾帧保留语义字段的真实值（SKILL 坑 J），ans 就是最终答案本身。
 *
 * ⚠️ 题目保证答案唯一（不会有频率并列卡在边界上的歧义），
 *    所以收集时"一个桶收完还不够就继续往左"不会产生歧义。
 *    如果某桶内多个元素导致超出 k，本题数据保证不会发生 —— 不做截断。
 */

const DEFAULT_NUMS = [1, 1, 1, 2, 2, 3]
const DEFAULT_K = 2

export function buildBucketTopKSteps(options = {}) {
  const nums = Array.isArray(options.nums) ? options.nums : DEFAULT_NUMS
  const n = nums.length
  const rawK = Number.isInteger(options.k) ? options.k : DEFAULT_K
  const k = Math.min(Math.max(rawK, 1), Math.max(n, 1))

  const steps = []
  const freq = {}
  const buckets = Array.from({ length: n + 1 }, () => [])
  const ans = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      nums,
      n,
      k,
      freq: { ...freq },
      buckets: buckets.map((b) => b.slice()),
      cur: null,
      curFreq: null,
      bucketIdx: null,
      collectIdx: null,
      ans: ans.slice(),
      collected: ans.length,
      done: phase === 'done',
      ...extra,
    })
  }

  if (n === 0) {
    snap('done', '数组是空的，没有高频元素可取。')
    return steps
  }

  snap(
    'init',
    `给了 \`${n}\` 个数 \`[${nums.join(', ')}]\`，要返回**出现频率前 \`${k}\` 高的元素**，` +
      `而且题目卡死了复杂度：**必须优于 O(n log n)** —— 也就是不允许"哈希计数完再整体排序"这种偷懒写法。` +
      `思路分三步：先一遍扫描数出每个值出现的**频率**（O(n)）；` +
      `再按频率把值**分进桶里**（频率天然在 \`[1, ${n}]\` 之间，直接当数组下标用，不用比较）；` +
      `最后**从高频端往低频端收集**，收满 \`${k}\` 个停。全程没有一次两两比较，总计 O(n)。`,
  )

  // ── 第一步：计数 ──
  const order = []
  for (const v of nums) {
    if (freq[v] === undefined) {
      freq[v] = 1
      order.push(v)
    } else {
      freq[v] += 1
    }
  }
  for (const v of order) {
    snap(
      'count',
      `数完了：值 \`${v}\` 出现了 **\`${freq[v]}\` 次**。` +
        `一张哈希表从左到右扫一遍就够，每个值 O(1)，这一步 \`${nums.length}\` 个数共 O(n)。` +
        `接下来所有的功夫都花在"怎么按频率挑前 \`${k}\` 个"上。`,
      { cur: v, curFreq: freq[v] },
    )
  }

  // ── 第二步：按频率入桶 ──
  for (const v of order) {
    const f = freq[v]
    buckets[f].push(v)
    snap(
      'bucket',
      `把 \`${v}\` 放进**下标为 \`${f}\` 的桶** —— 频率是多少，就进哪个桶。` +
        `这一步是桶排序的灵魂：一个元素最多出现 \`${n}\` 次，所以频率天然落在 \`[1, ${n}]\` 里，` +
        `**键的值域就是数组的下标范围**，建 \`${n + 1}\` 个桶直接丢，一次比较都不用做。` +
        `对比小根堆方案：堆每插一个元素要 \`O(log k)\`，这里每个元素是实打实的 \`O(1)\`。`,
      { cur: v, curFreq: f, bucketIdx: f },
    )
  }

  // ── 第三步：从高频端往低频端收集 ──
  for (let f = n; f >= 1; f -= 1) {
    if (ans.length >= k) break
    if (buckets[f].length === 0) {
      snap(
        'collect',
        `桶 \`${f}\` 是**空的** —— 没有值恰好出现 \`${f}\` 次，跳过，继续往左。` +
          `收集指针从最右端（频率 \`${n}\`）一路往左扫，这就是"从高频到低频"的字面意思。`,
        { collectIdx: f },
      )
      continue
    }
    for (const v of buckets[f]) {
      if (ans.length >= k) break
      ans.push(v)
      snap(
        'collect',
        `桶 \`${f}\` 里有值 \`${v}\`（出现了 \`${f}\` 次），收进答案。` +
          `已收集 \`${ans.length}/${k}\`${ans.length >= k ? ' —— **收满了，停**。' : '，还没够，继续往左扫。'}` +
          `题目保证答案唯一，所以桶内顺序不影响结果。`,
        { collectIdx: f, cur: v, curFreq: f },
      )
      if (ans.length >= k) break
    }
  }

  snap(
    'done',
    `结束。**前 \`${k}\` 个高频元素 = [${ans.join(', ')}]**。` +
      `回头看这三步：计数 O(n)、入桶 O(n)、收集最多扫 \`${n}\` 个桶也是 O(n) —— **总计 O(n)**，` +
      `比题目划的红线 O(n log n) 还低。代价是那 \`${n + 1}\` 个桶的 **O(n) 额外空间**，` +
      `以及一个小前提：**频率是整数、且范围已知**（这题天然满足）。` +
      `如果频率范围没这种保证（比如要按"距离"挑前 k 个），桶就没了，那才轮到堆或快速选择出场。`,
  )

  return steps
}
