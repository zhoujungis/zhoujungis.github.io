/**
 * rotatedMinSteps.js — 「寻找旋转排序数组中的最小值」(LeetCode 153) 推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 rotatedMin.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 旋转数组 = 两段各自上升的折线，中间有一道**断崖**。最小值就在断崖右侧
 * （第二段的起点）。二分的每一步只回答一个问题：
 *
 *     **nums[mid] 和 nums[right] 谁大？**
 *
 *   - nums[mid] > nums[right] → 断崖在 mid 右边（mid 在第一段上）→ 最小值在
 *     `[mid+1, right]`，mid 自己不可能是最小值 → `l = mid + 1`；
 *   - nums[mid] < nums[right] → mid 在第二段上（断崖已在 mid 左边或就是 mid）→
 *     最小值在 `[l, mid]`，**mid 可能就是答案，不能丢** → `r = mid`；
 *   - 收敛到 l === r，那就是最小值。
 *
 * ── 为什么和 right 比，不和 left 比 ──────────────────────────────────────
 * 和 left 比有歧义：`nums[mid] > nums[left]` 时，mid 可能在第一段（断崖在右），
 * 也可能整个数组没旋转（最小值就是 nums[left]）—— 两种情况下一步方向不同，
 * 单凭这一个比较区分不了。**和 right 比没有歧义**：nums[mid] == nums[right]
 * 只在区间缩到一两个元素时才可能发生（两段内部严格递增），不影响判断。
 * （LC 33 用的却是和 left 比 —— 因为它要的是"哪半有序"，正好是这个比较。
 * 两题判据一对照，为什么不同就清楚了。）
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'probe' | 'goRight' | 'goLeft' | 'done'
 *   desc: string
 *   nums: number[]        // 输入（不修改）
 *   l, r, mid             // 二分三指针；done 后 l === r === minIdx
 *   midVal: number|null   // nums[mid]
 *   rightVal: number|null // nums[r]（比较基准）
 *   cmp: '>' | '<' | null
 *   minIdx: number|null
 *   done: boolean
 *
 * ⚠️ done 帧带全渲染层要用的字段（SKILL 坑 Z 强制流程第 4 条）。
 */

const DEFAULT_NUMS = [4, 5, 6, 7, 0, 1, 2]

export function buildRotatedMinSteps(options = {}) {
  const raw = Array.isArray(options.nums) ? options.nums : DEFAULT_NUMS
  const nums = raw.slice()
  const n = nums.length

  const steps = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      nums,
      l: null,
      r: null,
      live: null,
      mid: null,
      midVal: null,
      rightVal: null,
      cmp: null,
      minIdx: null,
      done: phase === 'done',
      ...extra,
    })
  }

  if (n === 0) {
    snap('done', '输入是空的，没有最小值。')
    return steps
  }

  snap(
    'init',
    `旋转数组 \`[${nums.join(', ')}]\`：把一段递增数组从中间切开、两段换个位置 —— ` +
      `它因此变成**两段各自上升的折线，中间一道断崖**，最小值就站在断崖右侧那段的起点上。` +
      `二分的每一步只问一个问题：**\`nums[mid]\` 和 \`nums[r]\` 谁大？** ` +
      `\`nums[mid] > nums[r]\` 说明 mid 站在断崖左边（第一段上），最小值在它右边；` +
      `\`nums[mid] < nums[r]\` 说明 mid 已经在第二段上，最小值在 \`[l, mid]\` 里 —— ` +
      `mid 自己可能就是答案，所以左边界的收缩是 \`r = mid\` 而不是 \`r = mid - 1\`。`,
  )

  let l = 0
  let r = n - 1
  let guard = 0

  while (l < r && guard < 100) {
    guard += 1
    const l0 = l
    const r0 = r
    const mid = Math.floor((l0 + r0) / 2)
    const midVal = nums[mid]
    const rightVal = nums[r0]

    if (midVal > rightVal) {
      l = mid + 1
      snap(
        'probe',
        `\`mid = ${mid}\`，\`nums[${mid}] = ${midVal} > nums[${r0}] = ${rightVal}\` —— ` +
          `mid 站在**断崖左边的第一段**上（它比末尾还大，说明它右边一定跨过了断崖、有更小的数），` +
          `最小值在 \`[${mid + 1}, ${r0}]\`，mid 自己被淘汰 → \`l = ${mid + 1}\`。`,
        { l: l0, r: r0, live: [l, r], mid, midVal, rightVal, cmp: '>' },
      )
    } else {
      r = mid
      snap(
        'probe',
        `\`mid = ${mid}\`，\`nums[${mid}] = ${midVal} < nums[${r0}] = ${rightVal}\` —— ` +
          `mid 已经站在**断崖右边的第二段**上（或者断崖就是 mid 本身），` +
          `最小值在 \`[${l0}, ${mid}]\` 里。注意 **mid 可能就是最小值，不能丢** → \`r = ${mid}\`（不是 mid-1）。`,
        { l: l0, r: r0, live: [l, r], mid, midVal, rightVal, cmp: '<' },
      )
    }
  }

  const minIdx = l
  snap(
    'done',
    l === r
      ? `\`l\` 和 \`r\` 相遇在下标 \`${l}\` —— **最小值 = \`nums[${l}] = ${nums[l]}\`**。` +
          `回头看这趟：每一步只用一次比较，就把一半的候选**确定性地**淘汰掉，` +
          `\`O(log n)\`。数组没旋转时同样成立：mid 永远 < right，一直往左缩，最后停在 nums[0] —— 退化成"找头"，但复杂度不变。`
      : `异常退出（步数上限），正常输入不会走到这里。`,
    { l, r, live: [l, r], mid: l, midVal: nums[l], rightVal: nums[r], minIdx, cmp: null },
  )

  return steps
}
