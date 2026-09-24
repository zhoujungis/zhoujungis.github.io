/**
 * threeSumSteps.js — 「三数之和」(LeetCode 15) 推演的状态机
 * （纯函数，不碰 DOM）。
 *
 * ── 算法 ──────────────────────────────────────────────────────────────────
 *
 *     def threeSum(nums):
 *         nums.sort()                                  # ① 先排序
 *         res = []
 *         for i in range(len(nums) - 2):
 *             if nums[i] > 0:                          # ② 剪枝：最小的都 > 0
 *                 break
 *             if i > 0 and nums[i] == nums[i - 1]:     # ③ 第一处去重：跳过整轮
 *                 continue
 *             l, r = i + 1, len(nums) - 1
 *             while l < r:
 *                 s = nums[i] + nums[l] + nums[r]
 *                 if s < 0:
 *                     l += 1                           # 和太小 → 换个更大的
 *                 elif s > 0:
 *                     r -= 1                           # 和太大 → 换个更小的
 *                 else:
 *                     res.append([nums[i], nums[l], nums[r]])
 *                     while l < r and nums[l] == nums[l + 1]:   # ④ 第二处去重
 *                         l += 1
 *                     while l < r and nums[r] == nums[r - 1]:
 *                         r -= 1
 *                     l += 1
 *                     r -= 1
 *         return res
 *
 * ── 本题唯一真正的难点：去重，而且**只有两处** ──────────────────────────
 *
 * 双指针本身是"两数之和 II"（LC 167）的老套路，看一眼就会。
 * 三数之和的全部难点在"答案不能重复"，而去重恰好只有两处，缺一不可：
 *
 *   ③ 外层 i 的去重（`continue`）
 *      `nums[i] == nums[i - 1]` 说明这一轮的**起点和上一轮完全一样**，
 *      上一轮已经把"以这个值为最小数"的所有三元组找完了 → 整轮跳过，不用跑内层。
 *
 *   ④ 命中后双指针的去重（`while` 跳过 + 各走一步）
 *      `nums[l]` 和 `nums[l + 1]` 相同的话，用 l 和用 l+1 当左指针会产出
 *      **值完全相同**的三元组 → 命中一次后必须把重复值一次性跳过去。
 *
 * **两处的形态不一样，别写混**：
 *   · ③ 是"**事后**跳过" —— 命中之后才知道要往哪跳，所以是 `while`；
 *   · ③ 是"**事前**跳过" —— 内层还没开始就知道这轮无意义，所以是 `continue`。
 *
 * ── 为什么"排序"是这一切的前提 ──────────────────────────────────────────
 *
 * 排序的收益**不是"查找更快"**（这题根本没有查找），而是
 * **让相同的数挨在一起**。有了这个性质：
 *   · "值重复"退化成"和前一个值相不相等"（一处 O(1) 比较）；
 *   · 双指针的单调性成立 —— 和太小就右移 l（只会更大）、和太大就左移 r（只会更小）。
 *
 * 这也是"三数之和**不能**直接抄两数之和的哈希解法"的原因：
 * 哈希能找出和为 0 的三元组，但它**回答不了"这一组是不是已经出现过了"** ——
 * 你只能在最后把结果塞进 set 去重，写起来又长又容易错。
 *
 * ── 两个容易写错的地方 ──────────────────────────────────────────────────
 *
 *   · `i > 0` 不能省。`i = 0` 时 `nums[i - 1]` 会**绕到数组末尾**去
 *     （Python 的负索引特性，JS 里是 `undefined`）—— 两种情况都错。
 *   · `while l < r` 里的 `l < r` 不能省。只写 `nums[l] == nums[l + 1]` 会越界读；
 *     而且 `l` 有可能被推过 `r`，把本该保留的组合跳掉。
 *
 * ── 一个 step 长这样 ─────────────────────────────────────────────────────
 *   {
 *     phase: 'init' | 'pick-i' | 'skip-i' | 'prune' | 'squeeze' | 'hit' | 'dedup' | 'done',
 *     desc:  string,
 *     arr:   number[],            // **排序后**的数组（指针都以此为坐标系）
 *     original: number[],         // 原始数组（init 帧讲"排序"用）
 *     i: number,                  // 外层下标（-1 = 还没选）
 *     l: number, r: number,       // 内层双指针（squeeze / dedup 帧里是**移动后**的值）
 *     sum: number|null,           // 本帧算出的三数之和
 *     sumL: number|null,          // ↑ 这个和用的是哪两个内层下标
 *     sumR: number|null,          //   （和 squeeze 帧的 l / r 可能不同：先算后移）
 *     lFrom: number|null,         // 本帧 l 从哪来（没动 = null）
 *     rFrom: number|null,
 *     dedupL: {from, to}|null,    // L 侧去重跳过的下标区间（含两端）
 *     dedupR: {from, to}|null,
 *     hit: number[]|null,         // 本帧新记录的三元组（值）
 *     results: number[][],        // 累计结果（深拷贝）
 *     roundOver: boolean,         // 本帧结束后，内层这一轮是否收尾
 *     done: boolean,
 *   }
 *
 * ── 变体 ─────────────────────────────────────────────────────────────────
 *
 * 16（最接近三数之和，`abs(s - target)` 取最小）/ 18（四数之和，外面再套一层）
 * / 259（较小三数之和，要求 `sum < target` 的组数）/ 611（有效三角形个数，
 * 条件换成两边之和大于第三边）/ 923（三数之和的多种可能，改成计数）——
 * 都是"排序 + 固定前几个 + 双指针收尾"的同一条路线。
 * 形态差别明显，文章里用代码讲，不给状态机开 mode。
 */

const DEFAULT_NUMS = [-1, 0, 1, 2, -1, -4]

/**
 * 构造推演步骤。
 *
 * @param {{
 *   nums?: number[],
 *   maxSteps?: number,
 * }} [options]
 * @returns {object[]}
 */
export function buildThreeSumSteps(options = {}) {
  // ⚠️ 少于 3 个数是**合法输入**（答案就是空列表），守卫用 Array.isArray。
  const raw = Array.isArray(options.nums) ? options.nums : DEFAULT_NUMS

  // ⚠️ ① 必须先拷贝再排序 —— 直接 sort 会就地改掉调用方传进来的数组。
  // ⚠️ ② 必须给比较函数。JS 的 Array.prototype.sort 默认按**字符串**比较：
  //        [10, 2, 1].sort() → [1, 10, 2]；
  //        本例 [-1, 0, 1, 2, -1, -4] 排出来会变成 [-1, -1, -4, 0, 1, 2]，
  //        后面所有双指针判断全部失效。算法不关心排序怎么实现，
  //        但在 JS 里写错这一行，整题就废了。
  const arr = [...raw].sort((a, b) => a - b)
  const n = arr.length
  const maxSteps = Number.isInteger(options.maxSteps) ? options.maxSteps : 400

  const base = {
    i: -1,
    l: -1,
    r: -1,
    sum: null,
    sumL: null,
    sumR: null,
    lFrom: null,
    rFrom: null,
    dedupL: null,
    dedupR: null,
    hit: null,
    results: [],
    roundOver: false,
  }

  // 凑不出三个数
  if (n < 3) {
    return [
      {
        ...base,
        arr: [...arr],
        original: [...raw],
        phase: 'done',
        desc:
          `数组只有 \`${n}\` 个数，**凑不出三个**，直接返回空列表。` +
          `题目虽然不会这么给，但状态机要有安静的出口。`,
        roundOver: true,
        done: true,
      },
    ]
  }

  const steps = []
  const results = []
  let guard = 0

  const fmt = (t) => `[${t.join(', ')}]`
  const fmtResults = () => (results.length === 0 ? '[]' : `[${results.map(fmt).join(', ')}]`)
  // 负数加括号，算式才读得下去：`(-4) + (-1) + 2` 而不是 `-4 + -1 + 2`
  const fmtTerm = (v) => (v < 0 ? `(${v})` : `${v}`)

  /** 拍一帧。 */
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      ...base,
      arr: [...arr],
      original: [...raw],
      results: results.map((t) => [...t]),
      phase,
      desc,
      done: phase === 'done',
      ...extra,
    })
  }

  let i = 0
  let l = 0
  let r = 0
  let stage = 'outer' // 'outer' | 'inner' | 'dedup'

  // ── 帧 1：排序 ──────────────────────────────────────────────────────────
  snap(
    'init',
    `要在 \`${fmt(raw)}\` 里找出**所有**和为 \`0\` 的三元组，而且结果里**不能有重复**。` +
      `暴力枚举三个下标是 \`O(n³)\`；` +
      `直接照搬"两数之和"那套哈希表也不好使 —— 哈希能找出和为 0 的组合，` +
      `但它回答不了"这一组是不是早就出现过了"，去重无处下手。` +
      `标准路线只有一条：**先排序，再固定一个数，用双指针夹逼另外两个**。` +
      `排序后数组是 \`${fmt(arr)}\`。` +
      `这里要点破一个误解：**排序的收益不是"查找更快"**（这题压根没有查找），` +
      `而是**让相同的数挨在一起** —— 后面两处去重全靠这一点才写得出来。`,
  )

  while (guard < maxSteps) {
    guard += 1

    // ══ 外层：挑选固定的那个数 ══════════════════════════════════════════
    if (stage === 'outer') {
      if (i >= n - 2) break
      const v = arr[i]

      // ② 剪枝：最小的数都 > 0，后面不可能凑出 0
      if (v > 0) {
        snap(
          'prune',
          `\`i = ${i}\`，\`nums[${i}] = ${v} > 0\`。` +
            `数组已经是升序的，\`i\` 后面的数只会**更大** —— 三个正数加起来不可能等于 \`0\`。` +
            `所以这里直接 \`break\`，外层循环整体结束，不用再往后看了。`,
          { i },
        )
        break
      }

      // ③ 第一处去重：起点和上一轮一样，整轮跳过
      if (i > 0 && arr[i] === arr[i - 1]) {
        snap(
          'skip-i',
          `\`i = ${i}\`，\`nums[${i}] = ${v}\` 和上一轮的 \`nums[${i - 1}] = ${arr[i - 1]}\` **完全相同**。` +
            `上一轮已经把"以 \`${v}\` 为最小数"的所有三元组找完了，` +
            `这一轮只会把同样的答案**原样再找一遍**。` +
            `所以**直接跳过整个内层循环**（\`continue\`）—— 这是第一处去重，` +
            `注意它的形态是"**事前跳过**"：内层还没开始跑，就知道它毫无意义。` +
            `另外判断条件里的 \`i > 0\` 不能省：\`i = 0\` 时 \`nums[i - 1]\` 会绕到数组末尾` +
            `（Python 的负索引特性），比的根本不是"前一个"。`,
          { i, roundOver: true },
        )
        i += 1
        continue
      }

      // 正式开始这一轮
      l = i + 1
      r = n - 1
      snap(
        'pick-i',
        `外层固定 \`i = ${i}\`，\`nums[${i}] = ${v}\` —— 它就是这一轮三元组里**最小的那个数**。` +
          `左指针 \`l = ${l}\`、右指针 \`r = ${r}\`，` +
          `接下来要在 \`nums[${l}..${r}]\` 里找两个数，` +
          `使它们的和刚好等于 \`${-v}\`（这样再加上 \`${v}\` 就是 \`0\`）。`,
        { i, l, r },
      )
      stage = 'inner'
      continue
    }

    // ══ 内层：双指针夹逼 ════════════════════════════════════════════════
    if (stage === 'inner') {
      if (l >= r) {
        i += 1
        stage = 'outer'
        continue
      }

      const sumL = l
      const sumR = r
      const s = arr[i] + arr[sumL] + arr[sumR]
      const head =
        `\`nums[${i}] + nums[${sumL}] + nums[${sumR}]\` = ` +
        `\`${fmtTerm(arr[i])} + ${fmtTerm(arr[sumL])} + ${fmtTerm(arr[sumR])} = ${s}\`，`

      if (s < 0) {
        l += 1
        snap(
          'squeeze',
          head +
            `**和太小了**。\`i\` 已经固定、\`r\` 又是当前能取到的最大值，` +
            `唯一能做的就是**把 \`l\` 往右挪一格**，去够一个更大的数。` +
            (l >= r ? ` 挪完 \`l = ${l}\` 已经碰到 \`r\` —— **这一轮结束**。` : ''),
          { i, l, r, sum: s, sumL, sumR, lFrom: sumL, roundOver: l >= r },
        )
        continue
      }

      if (s > 0) {
        r -= 1
        snap(
          'squeeze',
          head +
            `**和太大了**。\`i\` 已经固定、\`l\` 又是当前能取到的最小数，` +
            `唯一能做的就是**把 \`r\` 往左挪一格**，去够一个更小的数。` +
            (l >= r ? ` 挪完 \`r = ${r}\` 已经碰到 \`l\` —— **这一轮结束**。` : ''),
          { i, l, r, sum: s, sumL, sumR, rFrom: sumR, roundOver: l >= r },
        )
        continue
      }

      // s === 0：命中
      const hit = [arr[i], arr[l], arr[r]]
      results.push(hit)
      snap(
        'hit',
        head +
          ` **正好是 \`0\` —— 命中！** 记录一组 \`${fmt(hit)}\`。` +
          `但别急着移动指针：\`l\` 的右边、\`r\` 的左边，可能还贴着**和它们一模一样的值**，` +
          `用那些位置当指针会产出和 \`${fmt(hit)}\` 完全相同的三元组。` +
          `所以下一步必须先**去重**，再各向内走一格。`,
        { i, l, r, sum: 0, sumL: l, sumR: r, hit },
      )
      stage = 'dedup'
      continue
    }

    // ══ 命中之后：第二处去重 ════════════════════════════════════════════
    const l0 = l
    const r0 = r
    // ④ 第二处去重：把重复值一次性跳过去（边界必须带 l < r）
    while (l < r && arr[l] === arr[l + 1]) l += 1
    while (l < r && arr[r] === arr[r - 1]) r -= 1
    const dedupL = l !== l0 ? { from: l0, to: l } : null
    const dedupR = r !== r0 ? { from: r, to: r0 } : null
    l += 1
    r -= 1

    const parts = []
    if (dedupL) {
      parts.push(
        `\`l\` 从 \`${l0}\` 一路跳到 \`${l}\` —— \`nums[${l0}..${l}]\` 是同一个值 \`${arr[l0]}\`，` +
          `换哪个当下标都是同一个答案。`,
      )
    } else {
      parts.push(
        `\`l\` 右边是 \`nums[${l0 + 1}] = ${arr[l0 + 1]}\`，和 \`nums[${l0}] = ${arr[l0]}\` 不同，不需要跳。`,
      )
    }
    if (dedupR) {
      parts.push(
        `\`r\` 从 \`${r0}\` 一路退到 \`${r}\` —— \`nums[${r}..${r0}]\` 是同一个值 \`${arr[r0]}\`。`,
      )
    } else {
      parts.push(
        `\`r\` 左边是 \`nums[${r0 - 1}] = ${arr[r0 - 1]}\`，和 \`nums[${r0}] = ${arr[r0]}\` 不同，不需要跳。`,
      )
    }

    snap(
      'dedup',
      `**第二处去重**：` + parts.join('') +
        ` 然后左右各向内走一格，\`l = ${l}\`、\`r = ${r}\`。` +
        (l >= r ? ` 此时 \`l\` 和 \`r\` 已经交叉 —— **这一轮结束**，\`i\` 前进一格。` : '') +
        ` 这处去重的形态和上一处相反：它是"**事后跳过**" —— ` +
        `必须先把答案记下来，才知道该从哪个位置开始跳。`,
      { i, l, r, lFrom: l0, rFrom: r0, dedupL, dedupR, roundOver: l >= r },
    )
    stage = 'inner'
  }

  // ── 收尾 ────────────────────────────────────────────────────────────────
  // ⚠️ 收尾帧**保留语义字段的真实值**（i / l / r 都是最后那一刻的真实位置），
  // 只额外补一个"结束"标记 —— 这样每帧的不变量在收尾帧依然成立，
  // 单测里一个 done 例外都不用开。（LC 124 的"总结性复写"教训，见 SKILL。）
  const k = results.length
  snap(
    'done',
    (k === 0
      ? `扫描结束，**没有任何**三元组的和为 \`0\`，返回空列表。`
      : `扫描结束。答案 = \`${fmtResults()}\`，一共 **${k} 组**，且两两不重复。`) +
      ` 回头看这趟是怎么走完的：外层 \`i\` 从 \`0\` 推进到 \`${Math.min(i, n - 3)}\`，` +
      `每一轮里 \`l\` 和 \`r\` 从两端往中间夹、两者合计最多走 \`n\` 步，` +
      `所以内层是 \`O(n)\`，乘上外层就是 **\`O(n²)\`**；` +
      `再加上开头那次排序 \`O(n log n)\`，总量级仍然是 \`O(n²)\`。空间 \`O(1)\`（不计结果本身）。` +
      `对比暴力三重循环的 \`O(n³)\`：**多花一个 \`O(n log n)\` 的排序，` +
      `把内层从 \`O(n²)\` 压到 \`O(n)\`，这笔买卖非常划算**。` +
      `而且排序顺带把"去重"变成了两处 \`O(1)\` 的值比较 —— ` +
      `**相同的数挨在一起，跳过重复就退化成"跟前一个比一比"。**`,
    { i: Math.min(i, n - 1), l, r, roundOver: true, done: true },
  )

  return steps
}
