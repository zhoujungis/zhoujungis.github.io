/**
 * greatestSumDiv3Steps.js — 「可被三整除的最大和」(LC 1262) 的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 greatestSumDiv3.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 给数组 nums（**元素全为正**），求一个子集，使其和被 3 整除且最大。
 * 因为元素都正，**全选的和 S 是上界**，唯一手段是"扔掉最少的一小撮"：
 *     S = sum(nums)，r = S % 3
 *     r == 0 → 直接返回 S（全选即最优）
 *     r == 1 → 削「一个余 1」或「两个余 2」，取代价小者
 *     r == 2 → 削「一个余 2」或「两个余 1」，取代价小者
 *     两种都凑不齐 → 返回 0（空集）
 *
 * 三个必须讲清的点：
 *   1. **只按余数分桶**：余 0 的元素永远不扔；只在 m1、m2 里动手。
 *   2. **为什么只有两种形状**：余数世界里 1+1≡2、2+2≡1、1+2≡0 —— 三同类抵消、
 *      一混合白扔、多削只会更亏（元素为正）。所以"最小代价"必是
 *      「最小的一个 m_r」或「最小的两个 m_{3-r}」。
 *   3. **取每桶最小的一个/两个**：桶必须升序，越靠后的元素越亏，轮不到。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'sum' | 'bucket' | 'candidate' | 'done'
 *   desc: string
 *   nums: number[]        // 原数组（拷贝）
 *   n: number
 *   idx: number           // sum 帧：正在累加的下标（其余为 -1）
 *   runningSum: number    // sum 帧：累到 idx 的和
 *   rems: number[]        // 每个元素对 3 的余数
 *   total: number         // 全部元素之和
 *   r: number             // total % 3
 *   m0, m1, m2: number[]  // 三个桶的**值**（升序）
 *   m0i, m1i, m2i: number[] // 三个桶的**原始下标**（与值一一对应）
 *   candOne: number|null  // "削一个 m_r"的代价（不够则为 null）
 *   candOneIdx: number[]  // 该候选用到的原始下标
 *   candTwo: number|null  // "削两个 m_{3-r}"的代价（不够则为 null）
 *   candTwoIdx: number[]
 *   active: 'one'|'two'|null  // candidate 帧：当前高亮的卡片
 *   chosen: 'one'|'two'|'none'
 *   drop: number|null     // 选中的代价（无解为 null）
 *   result: number
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 回放一致：只有 sum 帧的 runningSum 在增长，其余字段自 bucket 帧起冻结；
 *   2. sum 帧恰有 n 个，idx 依次 0..n-1，最后一帧 runningSum === total；
 *   3. m0/m1/m2 升序，且三者下标并集 === {0..n-1}（一次划分）；
 *   4. candOne === (r!=0 且桶 r 非空) ? 桶 r 最小值 : null；
 *      candTwo === (r!=0 且桶 3-r 至少两个) ? 桶 3-r 最小两值之和 : null；
 *   5. candidate 帧恰在 r != 0 时出现，共 2 帧，active 依次 'one'、'two'；
 *   6. done：result === r==0 ? total : (drop===null ? 0 : total-drop)，
 *      且 result 与"枚举全部子集"的暴力参考解一致。
 */

const DEFAULT_NUMS = [3, 6, 5, 1, 8]

/** 供测试与渲染层复用的默认题面。 */
export const GREATEST_SUM_DIV3_DEFAULT_NUMS = DEFAULT_NUMS

/** 把外部入参收敛成合法整数数组：非整数一律丢弃，空则回退默认。 */
function normalize(options = {}) {
  const raw = Array.isArray(options.nums) ? options.nums : []
  const nums = raw.filter((v) => Number.isInteger(v))
  return { nums: nums.length > 0 ? nums : [...DEFAULT_NUMS] }
}

/** 按余数分桶：返回 {value, index} 列表，值升序、值相同时按下标升序。 */
function bucketize(nums, rem) {
  return nums
    .map((v, i) => ({ v, i, m: ((v % 3) + 3) % 3 }))
    .filter((e) => e.m === rem)
    .sort((a, b) => (a.v - b.v) || (a.i - b.i))
}

export function buildGreatestSumDiv3Steps(options = {}) {
  const { nums } = normalize(options)
  const n = nums.length
  const rems = nums.map((v) => ((v % 3) + 3) % 3)
  const total = nums.reduce((s, v) => s + v, 0)
  const r = ((total % 3) + 3) % 3

  const b0 = bucketize(nums, 0)
  const b1 = bucketize(nums, 1)
  const b2 = bucketize(nums, 2)
  const m0 = b0.map((e) => e.v)
  const m1 = b1.map((e) => e.v)
  const m2 = b2.map((e) => e.v)
  const m0i = b0.map((e) => e.i)
  const m1i = b1.map((e) => e.i)
  const m2i = b2.map((e) => e.i)

  // r == 1：削一个 m1 或两个 m2；r == 2：削一个 m2 或两个 m1。
  const oneBucket = r === 1 ? b1 : r === 2 ? b2 : []
  const twoBucket = r === 1 ? b2 : r === 2 ? b1 : []
  const candOne = r !== 0 && oneBucket.length >= 1 ? oneBucket[0].v : null
  const candOneIdx = candOne === null ? [] : [oneBucket[0].i]
  const candTwo = r !== 0 && twoBucket.length >= 2 ? twoBucket[0].v + twoBucket[1].v : null
  const candTwoIdx = candTwo === null ? [] : [twoBucket[0].i, twoBucket[1].i]

  let chosen = 'none'
  let drop = null
  if (r === 0) {
    chosen = 'none'
    drop = 0
  } else if (candOne === null && candTwo === null) {
    chosen = 'none'
    drop = null
  } else if (candOne !== null && (candTwo === null || candOne <= candTwo)) {
    chosen = 'one'
    drop = candOne
  } else {
    chosen = 'two'
    drop = candTwo
  }
  const result = r === 0 ? total : drop === null ? 0 : total - drop

  const steps = []
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      nums: [...nums],
      n,
      idx: -1,
      runningSum: total,
      rems: [...rems],
      total,
      r,
      m0: [...m0],
      m1: [...m1],
      m2: [...m2],
      m0i: [...m0i],
      m1i: [...m1i],
      m2i: [...m2i],
      candOne,
      candOneIdx: [...candOneIdx],
      candTwo,
      candTwoIdx: [...candTwoIdx],
      active: null,
      chosen,
      drop,
      result,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `数组 \`[${nums.join(', ')}]\`，求一个**子集**使其和能被 3 整除且最大。` +
      `注意是**任意个**元素（不是"恰好三个"）—— 约束只有"和 ≡ 0 (mod 3)"。` +
      `因为元素全为**正数**，\`sum(nums) = ${total}\` 是所有子集和的**上界**：` +
      `想被 3 整除，唯一手段是**扔掉最少的一小撮**，让剩下的和回到 \`≡ 0\`。` +
      `先求和，再看它对 3 的余数 \`r = ${total} % 3\`。`,
    { idx: -1, runningSum: 0 },
  )

  // 逐个元素累加，展示 total / r 是怎么来的
  let acc = 0
  for (let i = 0; i < n; i += 1) {
    acc += nums[i]
    const last = i === n - 1
    const remNow = ((acc % 3) + 3) % 3
    snap(
      'sum',
      `把 \`nums[${i}]\`（= ${nums[i]}）加进来：当前和 \`${acc}\`，对 3 的余数 \`${remNow}\`。` +
        (last
          ? `加完全部元素，\`total = ${total}\`、余数 \`r = ${r}\`。`
          : `继续累加，最后再统一看余数。`),
      { idx: i, runningSum: acc },
    )
  }

  snap(
    'bucket',
    `按**余数**分三桶：\`m0 = [${m0.join(', ')}]\`（余 0，永远不扔）、` +
      `\`m1 = [${m1.join(', ')}]\`、\`m2 = [${m2.join(', ')}]\`，每桶**升序**。` +
      (r === 0
        ? `\`r = 0\`：\`${total}\` 本身就被 3 整除 —— **全选即最优**，根本不用动桶。`
        : `\`r = ${r}\`：需要在 \`m${r === 1 ? 1 : 2}\`、\`m${r === 1 ? 2 : 1}\` 里削掉一小撮来修正余数。`),
  )

  if (r !== 0) {
    const oneClass = r
    const twoClass = 3 - r
    snap(
      'candidate',
      `候选 A：削**一个余 ${oneClass}**（\`m${oneClass}\` 里最小的那个）—— ` +
        (candOne === null
          ? `但 \`m${oneClass}\` 是空的，这条路走不通，代价记作 \`∞\`。`
          : `代价 \`${candOne}\`（取该桶最小的一个）。`),
      { active: 'one' },
    )
    snap(
      'candidate',
      `候选 B：削**两个余 ${twoClass}**（\`2 + 2 ≡ 1\`、\`1 + 1 ≡ 2\`，所以两个 \`余 ${twoClass}\` 恰好修正余数）—— ` +
        (candTwo === null
          ? `但 \`m${twoClass}\` 不足两个元素，凑不出两个，代价记作 \`∞\`。`
          : `取该桶最小的两个，代价 \`${candTwo}\`。`),
      { active: 'two' },
    )
  }

  const dropText =
    r === 0
      ? `不需要削任何元素`
      : drop === null
        ? `两种候选都凑不齐（\`m${r}\` 为空、\`m${3 - r}\` 不足两个）`
        : chosen === 'one'
          ? `候选 A 更小：削一个余 ${r}，代价 \`${drop}\``
          : `候选 B 更小：削两个余 ${3 - r}，代价 \`${drop}\``

  snap(
    'done',
    r === 0
      ? `返回 **${total}**：\`total = ${total}\` 已被 3 整除，全选就是答案。` +
        `记住判据 \`r == 0\` 先短路，别去动桶。`
      : drop === null
        ? `返回 **0**：没有任何子集能被 3 整除，只能选**空集**（和为 0）。`
        : `返回 **${result}**：${dropText}，于是 \`${total} − ${drop} = ${result}\`。` +
          `保留的元素和 ${result} 恰好 \`≡ 0 (mod 3)\`。` +
          `复盘：余数世界里 \`1+1≡2\`、\`2+2≡1\`、\`1+2≡0\` —— 三个同类抵消、一混合白扔、` +
          `多削只会更亏，所以最小代价必是「最小的一个 \`m${r}\`」或「最小的两个 \`m${3 - r}\`」。`,
    { done: true },
  )

  return steps
}
