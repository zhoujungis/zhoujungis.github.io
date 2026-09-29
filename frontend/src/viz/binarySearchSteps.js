/**
 * binarySearchSteps.js — 「二分查找」(LC 704) 的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 binarySearch.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 二分不是"聪明的查找技巧"，是**维持区间不变量的艺术**：
 *   不变量：若 target 在数组里，它的下标**永远**落在闭区间 [left, right] 内。
 * 每轮探中点：nums[mid] < target → 答案必在 mid 右侧，left = mid + 1；
 * nums[mid] > target → 答案必在 mid 左侧，right = mid - 1；相等 → 当场结案。
 * 每轮排除一半、且**绝不违反不变量**；区间空了（left > right），
 * 不变量的逆否命题就给出答案：target 不在数组里，返回 -1。
 *
 * 三条铁律（都源自"闭区间 [left, right]"这一个约定，改一条全得改）：
 *   1. while (left <= right) —— 闭区间空的条件恰是 left === right + 1；
 *   2. mid = left + ((right - left) >> 1) —— Java/C++ 里 (left + right) 会爆 int；
 *   3. left = mid + 1 / right = mid - 1 —— mid 已经检查过，不能带着它继续。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'probe' | 'done'
 *   desc: string
 *   nums: number[]        // 有序数组（升序、无重复 —— 704 的前提）
 *   target: number
 *   left, right: number   // 本帧动作**之后**的搜索区间（闭区间）
 *   prevLeft, prevRight: number // 本帧动作**之前**的区间
 *   mid: number|null      // probe 帧：本轮中点
 *   value: number|null    // probe 帧：nums[mid]
 *   cmp: -1|0|1|null      // probe 帧：nums[mid] 与 target 比较的结果
 *   action: 'go_right' | 'go_left' | 'found' | null
 *   eliminated: number    // 本帧被排除出区间的元素个数
 *   result: number        // 目前的答案（未找到为 -1）
 *   found: boolean
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 回放一致：prevLeft/prevRight === 上一帧的 left/right；
 *   2. mid === prevLeft + ((prevRight - prevLeft) >> 1)，且落在区间内；
 *   3. 每帧只动一个边界：go_right 时 left === mid + 1 且 right 不变；
 *      go_left 时 right === mid - 1 且 left 不变；found 时区间不动；
 *   4. 区间严格收缩：非 found 帧的 (right - left) 严格小于上一帧；
 *   5. **不变量守恒**：target 若存在于数组中，其下标恒在 [left, right] 内
 *      （直到 found 帧命中）；
 *   6. done 帧：found 时 result === 命中下标；否则 left === right + 1 且 result === -1。
 */

const DEFAULT_NUMS = [-1, 0, 3, 5, 9, 12, 15, 20, 26, 31, 38, 44]
const DEFAULT_TARGET = 31

export function buildBinarySearchSteps(options = {}) {
  const nums =
    Array.isArray(options.nums) && options.nums.length > 0
      ? [...options.nums]
      : [...DEFAULT_NUMS]
  const target = Number.isFinite(options.target) ? options.target : DEFAULT_TARGET

  const steps = []
  let left = 0
  let right = nums.length - 1
  let result = -1
  let found = false

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      nums: [...nums],
      target,
      left,
      right,
      prevLeft: left,
      prevRight: right,
      mid: null,
      value: null,
      cmp: null,
      action: null,
      eliminated: 0,
      result,
      found,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `有序数组 \`[${nums.join(', ')}]\`，找 \`target = ${target}\`。` +
      `二分的本质不是"折半"，是**维持一条不变量**：若 target 在数组里，它的下标永远落在闭区间 \`[left, right]\` 内。` +
      `开局区间是整段 \`[0, ${nums.length - 1}]\`。每轮探中点、把**不可能的一半**整段扔掉 —— ` +
      `扔掉的前半句是"检查过 mid"，后半句是"边界必须跳过 mid"（\`left = mid + 1\` / \`right = mid - 1\`）。` +
      `三条铁律配套闭区间这一个约定：\`while (left <= right)\`、\`mid = left + ((right - left) >> 1)\`、边界收缩带 ±1。`,
    { left: 0, right: nums.length - 1, prevLeft: 0, prevRight: nums.length - 1 },
  )

  let guard = 0
  while (left <= right && guard < 64) {
    guard += 1
    const prevLeft = left
    const prevRight = right
    const mid = left + ((right - left) >> 1)
    const value = nums[mid]
    const cmp = value < target ? -1 : value > target ? 1 : 0

    if (cmp === 0) {
      found = true
      result = mid
      snap(
        'probe',
        `**第 ${steps.length} 探**：\`mid = ${prevLeft} + ((${prevRight} - ${prevLeft}) >> 1) = ${mid}\`，` +
          `\`nums[${mid}] = ${value}\` **等于** target —— 结案！` +
          `注意区间**不动**：命中即返回，二分查找（找特定值）在这一刻就结束了。` +
          `全程只探了 ${steps.length} 次 —— 每探一次砍掉一半，\`log₂(${nums.length})\` 级别。`,
        { mid, value, cmp, action: 'found', eliminated: 0 },
      )
      break
    }

    if (cmp < 0) {
      left = mid + 1
      snap(
        'probe',
        `**第 ${steps.length} 探**：\`mid = ${prevLeft} + ((${prevRight} - ${prevLeft}) >> 1) = ${mid}\`，` +
          `\`nums[${mid}] = ${value} < ${target}\` —— 升序数组里 mid **左边（含 mid）**全部比 target 小，` +
          `整段排除：\`left = mid + 1 = ${left}\`，\`right\` 不动。` +
          `一次扔掉 ${mid - prevLeft + 1} 个元素，不变量"答案若在则必在 [left, right]"依然成立。`,
        {
          mid,
          value,
          cmp,
          action: 'go_right',
          eliminated: mid - prevLeft + 1,
          left,
          right,
          prevLeft,
          prevRight,
        },
      )
    } else {
      right = mid - 1
      snap(
        'probe',
        `**第 ${steps.length} 探**：\`mid = ${prevLeft} + ((${prevRight} - ${prevLeft}) >> 1) = ${mid}\`，` +
          `\`nums[${mid}] = ${value} > ${target}\` —— mid **右边（含 mid）**全部比 target 大，` +
          `整段排除：\`right = mid - 1 = ${right}\`，\`left\` 不动。` +
          `一次扔掉 ${prevRight - mid + 1} 个元素，搜索区间从 ${prevRight - prevLeft + 1} 缩到 ${right - left + 1}。`,
        {
          mid,
          value,
          cmp,
          action: 'go_left',
          eliminated: prevRight - mid + 1,
          left,
          right,
          prevLeft,
          prevRight,
        },
      )
    }
  }

  snap(
    'done',
    found
      ? `返回 **\`${result}\`**。复盘：${steps.length - 1} 次探测把 ${nums.length} 个元素砍到命中 —— ` +
          `每次比较都**排除一半**，这就是 \`O(log n)\` 的全部秘密。` +
          `三条铁律回顾：① 闭区间 \`[left, right]\` 配 \`while (left <= right)\`；` +
          `② \`mid = left + ((right - left) >> 1)\` 防爆 int；③ 收缩必带 ±1，mid 检查过不回头。`
      : `\`left = ${left} > right = ${right}\`，闭区间**空了** —— 不变量的逆否命题：` +
          `若 target 在数组里它本该还在区间内，区间却已空，所以 target 必不在，返回 \`-1\`。` +
          `注意 \`left === right + 1\` 恰好是闭区间为空的条件 —— 这就是 \`while (left <= right)\` 的由来。`,
    { done: true, result, found, left, right },
  )

  return steps
}
