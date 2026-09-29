/**
 * quickSelectSteps.js — 「数组中的第 K 个最大元素」(LeetCode 215) 推演动画的状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 quickSelect.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 快速选择（Quickselect）只在回答一个问题：**「我排第几？」**
 *
 * 一次分区之后，枢轴会落到它的**最终位置**上，而且这个位置就是它的排名 ——
 * 左边全 <= 它，右边全 >= 它。于是：
 *
 *   - 枢轴位置 == 目标位    → 就是答案，结束
 *   - 枢轴位置  < 目标位    → 答案在右边，左边（含枢轴）全部淘汰
 *   - 枢轴位置  > 目标位    → 答案在左边，右边（含枢轴）全部淘汰
 *
 * 快排要递归**两边**，快速选择只进**一边** —— 这就是从 O(n log n) 降到 O(n) 的全部原因。
 *
 * ── 两个必须讲清的坑 ─────────────────────────────────────────────────────
 * 1. **第 k 大 ≠ 下标 k-1。** 升序排好后第 k 大位于下标 `n - k`（0 基）。
 *    写成 `k - 1` 就变成了第 k **小** —— off-by-one 最经典的来源。
 * 2. **「第 k 大」是排序后的第 k 个位置，不是第 k 个不同的值。**
 *    官方例 2 `[3,2,3,1,2,4,5,5,6]` k=4 的答案是 **4**（降序第 4 个），
 *    而按"第 4 个不同值"算是 **3** —— 官方样例就是用来钉死这个语义的。
 *
 * ── 分区方案 ──────────────────────────────────────────────────────────────
 * 用 Lomuto 单向分区（好动画化）：pivot 取区间最右端，`i` 指向"<= 区"的
 * 下一个空位，`j` 从左扫到右。比较用 **`<=`** 而不是 `<`。
 *
 * ⚠️ 注意一个反直觉的事实：**即使用 `<=`，全部元素相同的数组依然是 Lomuto
 * 的最坏情况** —— 因为每个元素都 `<= pivot`，`i` 会一路走到右端，
 * 分区后枢轴落在原地，每轮只砍掉 1 个元素，退化为 O(n²)。
 * 这正是三路分区（荷兰国旗）存在的理由，文章里会讲。
 *
 * ── pivot 策略 ────────────────────────────────────────────────────────────
 * 默认 `pivot: 'last'`（取右端）—— 保证动画可复现。
 * 可选 `pivot: 'random'`（带种子的 LCG，同样可复现）—— 生产用它规避有序输入退化。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'pick' | 'scan' | 'place' | 'narrow' | 'found' | 'done'
 *   desc: string
 *   arr: number[]        // 当前数组（原地重排后的样子）
 *   n, k, target         // target = n - k（升序下标）
 *   left, right          // 当前搜索区间
 *   pivotValue: number|null
 *   pivotIdx: number|null   // place 之后是枢轴的最终位置
 *   i: number|null       // "<= 区"的下一个空位
 *   j: number|null       // 扫描游标
 *   swapPair: [a,b]|null // 本帧交换的两格（a === b 表示自己和自己换）
 *   cmp: 'le' | 'gt' | null
 *   found: number|null   // 答案
 *   foundIdx: number|null
 *   round: number        // 第几轮分区（从 1 开始）
 *   done: boolean
 *
 * ⚠️ 收尾帧保留所有语义字段的真实值（SKILL 坑 J）—— `foundIdx` 单独表达答案，
 *    渲染层在 found / done 帧用它来画。这样逐帧不变量在收尾帧依然成立，
 *    单测里一个 `done` 例外都不需要。
 */

const DEFAULT_NUMS = [3, 2, 1, 5, 6, 4]
const DEFAULT_K = 2

/** 带种子的线性同余，保证 'random' 策略也可复现（测试需要确定性）。 */
function makeRandom(seed) {
  let s = seed >>> 0 || 12345
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

export function buildQuickSelectSteps(options = {}) {
  const rawNums = Array.isArray(options.nums) ? options.nums : DEFAULT_NUMS
  const arr = rawNums.slice()
  const n = arr.length

  const rawK = Number.isInteger(options.k) ? options.k : DEFAULT_K
  const k = Math.min(Math.max(rawK, 1), Math.max(n, 1))

  const maxSteps = Number.isInteger(options.maxSteps) ? options.maxSteps : 400
  const strategy = options.pivot === 'random' ? 'random' : 'last'
  const rnd = makeRandom(Number.isInteger(options.seed) ? options.seed : 20240928)

  const steps = []

  // ⚠️ 第 k 大 = 升序第 n-k 位（0 基）。k 已 clamp 到 [1, n]，所以 target ∈ [0, n-1]。
  const target = n - k

  let left = 0
  let right = n - 1
  let round = 0
  let found = null
  let foundIdx = null
  let pivotValue = null
  let pivotIdx = null
  let i = null
  let j = null

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      arr: arr.slice(),
      n,
      k,
      target,
      left,
      right,
      pivotValue,
      pivotIdx,
      i,
      j,
      swapPair: null,
      cmp: null,
      found,
      foundIdx,
      round,
      done: phase === 'done',
      ...extra,
    })
  }

  if (n === 0) {
    snap('done', '数组是空的，没有第 k 大。')
    return steps
  }

  snap(
    'init',
    `给了 \`${n}\` 个数 \`[${arr.join(', ')}]\`，要找**第 \`${k}\` 大**。` +
      `先把这句话翻译成下标：升序排好之后，第 \`${k}\` 大就是**倒数第 \`${k}\` 个**，` +
      `也就是升序下标 \`n - k = ${n} - ${k} = ${target}\`。` +
      `所以题目等价于：**找出升序第 \`${target}\` 位（0 基）的那个数**。` +
      `这个换算是最容易写错的地方 —— 写成 \`k - 1\` 的话，找的就变成第 \`${k}\` **小**了。` +
      `另外先约定一件事：「第 k 大」是**排序后的第 k 个位置**，不是「第 k 个不同的值」 —— ` +
      `重复元素各占各的位置。`,
  )

  let guard = 0
  while (left <= right && guard < maxSteps) {
    guard += 1
    round += 1

    if (left === right) {
      found = arr[left]
      foundIdx = left
      pivotIdx = left
      break
    }

    // ── 选枢轴 ──
    let pivotAt = right
    if (strategy === 'random') {
      pivotAt = left + Math.floor(rnd() * (right - left + 1))
      const tmp = arr[pivotAt]
      arr[pivotAt] = arr[right]
      arr[right] = tmp
      pivotAt = right
    }
    pivotValue = arr[right]
    pivotIdx = right
    i = left
    j = null

    snap(
      'pick',
      `**第 \`${round}\` 轮分区**，当前搜索区间 \`[${left}, ${right}]\`。` +
        (strategy === 'random'
          ? `随机挑一个位置、把它换到区间最右端当枢轴 —— 随机化是为了避免"有序输入 + 固定取末尾"退化成 O(n²)。`
          : `取区间最右端的 \`${pivotValue}\` 当枢轴（pivot）。`) +
        `这一趟扫描只做一件事：把区间里**小于等于 \`${pivotValue}\` 的都挪到左边**。` +
        `游标 \`i\` 指向"小于等于区"的下一个空位，游标 \`j\` 从左往右扫。`,
    )

    // ── 扫描 ──
    for (j = left; j < right; j += 1) {
      if (guard >= maxSteps) break
      guard += 1
      const v = arr[j]
      if (v <= pivotValue) {
        const a = i
        const b = j
        const tmp = arr[a]
        arr[a] = arr[b]
        arr[b] = tmp
        const moved = a !== b
        i += 1
        snap(
          'scan',
          `\`j = ${j}\`：\`arr[${j}] = ${v}\` **<= \`${pivotValue}\`**，归入左边。` +
            (moved
              ? `交换 \`${a}\` 与 \`${b}\` 两格，\`${v}\` 被换到下标 \`${a}\`。`
              : `它本来就在 \`i\` 指向的位置上，不用换。`) +
            ` \`i\` 前进到 \`${i}\`，"小于等于区"扩大一格。`,
          { swapPair: [a, b], cmp: 'le' },
        )
      } else {
        snap(
          'scan',
          `\`j = ${j}\`：\`arr[${j}] = ${v}\` **> \`${pivotValue}\`**，**不动** —— ` +
            `它属于右边那一堆。\`j\` 继续前进，\`i\` 留在下标 \`${i}\` 等着下一个"小个子"。`,
          { cmp: 'gt' },
        )
      }
    }

    // ── 枢轴归位 ──
    const pa = i
    const pb = right
    const tmp = arr[pa]
    arr[pa] = arr[pb]
    arr[pb] = tmp
    pivotIdx = i
    j = null

    snap(
      'place',
      `扫描结束。此时 \`i\` 正好指向"大于区"的第一个位置，把枢轴 \`${pivotValue}\` 换到这里 —— ` +
        `交换 \`i = ${pa}\` 与 \`right = ${pb}\`，数组变成 \`[${arr.join(', ')}]\` ` +
        `（区间内部分）。**枢轴就此落在下标 \`${pivotIdx}\`**：它左边全 \`<= ${pivotValue}\`，` +
        `右边全 \`> ${pivotValue}\`。这个位置就是它的**最终排名** —— ` +
        `整个数组升序排好后它就在这一位。`,
      { swapPair: [pa, pb] },
    )

    // ── 收缩 ──
    if (pivotIdx === target) {
      found = arr[pivotIdx]
      foundIdx = pivotIdx
      snap(
        'found',
        `枢轴 \`${pivotValue}\` 落在下标 \`${pivotIdx}\`，**正好是目标位 \`n - k = ${target}\`** —— ` +
          `它就是第 \`${k}\` 大。此时它左边 \`${pivotIdx}\` 个元素都不比它大，` +
          `右边 \`${n - pivotIdx - 1}\` 个元素都不比它小，排名确凿，不用再比了。`,
      )
      break
    }

    if (pivotIdx < target) {
      const oldLeft = left
      left = pivotIdx + 1
      snap(
        'narrow',
        `枢轴落在 \`${pivotIdx}\`，目标位是 \`${target}\`。\`${pivotIdx} < ${target}\` —— ` +
          `**答案在枢轴右边**。左边那 \`${pivotIdx - oldLeft + 1}\` 个（含枢轴自己）` +
          `排名都比目标位靠前，全部淘汰，以后一眼都不看。` +
          `区间收缩成 \`[${left}, ${right}]\`。` +
          `**这就是省时间的全部秘密**：快排要递归两边，快速选择只进一边。`,
      )
    } else {
      const oldRight = right
      right = pivotIdx - 1
      snap(
        'narrow',
        `枢轴落在 \`${pivotIdx}\`，目标位是 \`${target}\`。\`${pivotIdx} > ${target}\` —— ` +
          `**答案在枢轴左边**。右边那 \`${oldRight - pivotIdx + 1}\` 个（含枢轴自己）` +
          `排名都比目标位靠后，全部淘汰。区间收缩成 \`[${left}, ${right}]\`。`,
      )
    }

    pivotValue = null
    i = null
  }

  snap(
    'done',
    found === null
      ? `达到步数上限 \`${maxSteps}\`，提前收尾（正常输入不会走到这里）。`
      : `结束。**第 \`${k}\` 大 = \`${found}\`**，它在升序数组里的位置是下标 \`${foundIdx}\`。` +
          `回头看这趟：一共只做了 \`${round}\` 轮分区，每轮扫描当前区间一次就把一半左右的候选淘汰掉，` +
          `总工作量是 \`n + n/2 + n/4 + … ≈ 2n\` —— 所以是**平均 O(n)** 时间，` +
          `而且全程只在原数组上交换，**O(1) 额外空间**。` +
          `但别忘了那两个字是"平均"：最坏情况（比如有序数组配固定取末尾的枢轴）` +
          `每轮只砍掉 1 个，会退化成 O(n²)。`,
  )

  return steps
}
