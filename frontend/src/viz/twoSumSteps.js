/**
 * twoSumSteps.js — 「两数之和」(LeetCode 1) 推演的状态机
 * （纯函数，不碰 DOM）。
 *
 * ── 算法 ──────────────────────────────────────────────────────────────────
 *
 *     def twoSum(nums, target):
 *         seen = {}                              # 值 -> 它的下标
 *         for i, x in enumerate(nums):
 *             need = target - x
 *             if need in seen:                   # ① 先在我**左边**找
 *                 return [seen[need], i]
 *             seen[x] = i                        # ② 再把自己记进去
 *
 * 暴力是"选一个 i，再往后一个个试 j"，O(n²)。
 * 这里把它反过来想：**站在 i 的位置，问"我需要的那个数，之前出现过吗？"**
 * 一次遍历，边查边存，O(n)。
 *
 * ── 本题唯一真正的难点：「先查再存」不能颠倒 ──────────────────────────────
 *
 * 把两句调换顺序，代码看起来一样"合理"，但它会**把当前元素自己算进去**：
 *
 *     for i, x in enumerate(nums):
 *         seen[x] = i                            # ❌ 先存
 *         if target - x in seen:
 *             return [seen[target - x], i]       # 当 target == 2 * x 时，
 *                                                # 查到的是**自己**，返回 [i, i]
 *
 * 反例 `nums = [3, 3], target = 6`：
 *   ❌ 先存再查 → i = 0 时 seen = {3: 0}，`target - 3 = 3` 命中，返回 `[0, 0]`
 *                —— **同一个元素用了两次**，直接违反题目约束。
 *   ✅ 先查再存 → i = 0 时表还是空的，找不到；存下 {3: 0}；
 *                i = 1 时才命中下标 0，返回 `[0, 1]`。正确。
 *
 * **为什么"先查再存"就天然满足了"同一元素不能重复使用"？**
 * 因为查表发生在"把自己放进去"之前 —— 那一瞬间表里装的**只有当前元素左边的**元素。
 * 所以任何命中的下标必然 `< i`，不可能是自己。
 *
 * 一句话记法：**先问"前面有我要的吗"，再把自己登记进去。**
 *
 * ── 另一个前提：「每种输入只有一个答案」 ──────────────────────────────────
 *
 * 题目保证"只存在一个有效答案"，所以**找到就能立刻返回**。
 * 如果要找出所有满足条件的下标对，就不能提前 return，得把整表跑完
 *（而且 `seen` 只能存"值 -> 下标列表"，不能只存一个下标，否则会漏掉重复值）。
 * 这个前提不是装饰品 —— 它决定了"能不能早退"。
 *
 * ── 一个 step 长这样 ─────────────────────────────────────────────────────
 *   {
 *     phase: 'init' | 'miss' | 'put' | 'hit' | 'verify' | 'done',
 *     desc:  string,
 *     i: number,                  // 这一帧在处理的下标（-1 表示还没开始）
 *     x: number|null,             // nums[i]
 *     need: number|null,          // target - nums[i]，也就是"我想要的那个数"
 *     hitIdx: number|null,        // need 在表里的下标（非 null 表示命中）
 *     seen: {[value]: index},     // 值 -> 下标（当前快照）
 *     answer: [number, number]|null,
 *     done: boolean,
 *   }
 *
 * ── 变体 ─────────────────────────────────────────────────────────────────
 *
 * 167（有序数组）用**双指针**，O(1) 空间 —— 和本题是"同一题在有序前提下的另一种解法"，
 * 文章第九节做了逐项对照。170（数据结构设计）/ 653（BST）/ 15（三数）/ 18（四数）
 * / 454（四数组）都在那边用代码讲，不给状态机开 mode（形态差别明显）。
 */

/**
 * 构造推演步骤。
 *
 * @param {{
 *   nums?: number[],
 *   target?: number,
 *   maxSteps?: number,
 * }} [options]
 * @returns {object[]}
 */
export function buildTwoSumSteps(options = {}) {
  // ⚠️ 空数组是**合法输入**（题目保证有解，但状态机要能安全处理），
  // 所以守卫用 Array.isArray，不能用 nums.length —— 空数组会被默认值顶掉。
  const nums = Array.isArray(options.nums) ? options.nums : [2, 7, 11, 15]
  const target = Number.isInteger(options.target) ? options.target : 9
  const n = nums.length

  const maxSteps = Number.isInteger(options.maxSteps) ? options.maxSteps : 400

  const base = {
    i: -1,
    x: null,
    need: null,
    hitIdx: null,
    seen: {},
    answer: null,
  }

  // 空数组：题目不会这么给，但状态机不能崩
  if (n === 0) {
    return [
      {
        ...base,
        phase: 'done',
        desc: `**空数组** —— 没有任何元素，凑不出两个数。题目保证有解，所以这不会发生，` +
          `但状态机要有安静的出口。`,
        done: true,
      },
    ]
  }

  const steps = []
  const seen = {}              // 值 -> 下标
  let answer = null
  let guard = 0

  const has = (v) => Object.prototype.hasOwnProperty.call(seen, v)
  const fmtSeen = () =>
    Object.keys(seen).length === 0
      ? '{}'
      : `{${Object.entries(seen).map(([k, v]) => `${k}→${v}`).join(', ')}}`

  /** 拍一帧。 */
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      i: -1,
      x: null,
      need: null,
      hitIdx: null,
      seen: { ...seen },
      answer: answer ? [...answer] : null,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `要在 \`[${nums.join(', ')}]\` 里找出**两个数**，使它们的和等于 \`target = ${target}\`，` +
      `返回它们的**下标**。` +
      `暴力做法是"选一个 i 再往后试每个 j"，O(n²)。` +
      `换个方向想：**站在 i 的位置，问一句"我需要的那个数 \`${target} - x\`，之前出现过吗？"** ——` +
      `那就在遍历时顺手用一张表记下"见过的值和它的下标"。` +
      `**顺序很关键：先查表，再把自己登记进去**（原因见后面第 3 轮）。`,
  )

  for (let i = 0; i < n; i += 1) {
    guard += 1
    if (guard > maxSteps) break

    const x = nums[i]
    const need = target - x
    const hit = has(need)
    const hitIdx = hit ? seen[need] : null

    if (hit) {
      // ── 命中：先查就查到了 ──────────────────────────────────────────────
      answer = [hitIdx, i]
      snap(
        'hit',
        `\`i = ${i}\`，当前元素 \`x = ${x}\`。我想要的那个数是 \`${target} - ${x} = ${need}\`。` +
          `**去表里查一下 —— 找到了！** \`${need}\` 在下标 \`${hitIdx}\`（表里当时是 \`${fmtSeen()}\`）。` +
          `于是 ` +
          `\`nums[${hitIdx}] + nums[${i}] = ${need} + ${x} = ${target}\` ✓。` +
          `注意 \`${hitIdx} < ${i}\` —— **命中位置一定在当前元素左边**，` +
          `因为查表发生在"把自己放进去"之前，表里根本还没有自己。` +
          `这正是"同一元素不能重复使用"这条约束被自动满足的原因。`,
        { i, x, need, hitIdx },
      )
      break
    }

    // ── 没命中：查完再登记自己 ────────────────────────────────────────────
    snap(
      'miss',
      `\`i = ${i}\`，当前元素 \`x = ${x}\`。我想要的那个数是 \`${target} - ${x} = ${need}\`。` +
        `**去表里查一下 —— 没有。**` +
        (Object.keys(seen).length === 0
          ? `表此刻还是空的（前面没有任何元素），所以必然查不到。`
          : `表里现在装的是 \`${fmtSeen()}\`，没有 \`${need}\`。`) +
        ` 那就**再把自己登记进去**，供后面的元素来查。`,
      { i, x, need },
    )

    seen[x] = i
    snap(
      'put',
      `把 \`${x} → ${i}\` 存进表，表变成 \`${fmtSeen()}\`。` +
        `**注意这一步必须在"查表"之后** —— 如果反过来先登记自己，` +
        `当 \`target = 2 × x\` 时就会查到**自己**，返回一个 \`[i, i]\` 这种把同一个位置用了两次的假答案。` +
        `（文章第三节用 \`[3, 3]\` 配 \`target = 6\` 演了这件事。）`,
      { i, x, need },
    )
  }

  // ── 验证 + done ──────────────────────────────────────────────────────────
  if (answer) {
    const [a, b] = answer
    snap(
      'verify',
      `验证一遍：\`nums[${a}] + nums[${b}] = ${nums[a]} + ${nums[b]} = ${nums[a] + nums[b]}\`，` +
        `正好等于 \`target = ${target}\` ✓。返回 **\`[${a}, ${b}]\`**。` +
        `整个过程只扫了一遍数组，每个元素做 O(1) 的查表 + 登记 —— 所以是 **O(n) 时间**、` +
        `**O(n) 空间**（最坏情况整张表都要装下来）。`,
      { i: b, x: nums[b] },
    )
  }

  snap(
    'done',
    answer
      ? `**答案 = \`[${answer[0]}, ${answer[1]}]\`**。` +
        `回头看这题的两句关键代码：\`if need in seen\` 和 \`seen[x] = i\` —— ` +
        `**先查再存，顺序不能反。** 它一次就同时解决了两件事：` +
        `"用哈希把查找降到 O(1)"和"保证不重复使用同一个元素"。` +
        `另外提醒一句：题目给的前提是"**只存在一个有效答案**"，所以这里可以命中就立刻返回；` +
        `如果要求**所有**满足条件的下标对，就不能提前 return，而且表里要存"值 → 下标列表"。`
      : `扫描结束，**没有找到**任何一对和为 \`${target}\` 的数。` +
        `（题目保证有解，所以这不会发生在合法输入上。）`,
    { i: n - 1, x: nums[n - 1], done: true },
  )

  return steps
}
