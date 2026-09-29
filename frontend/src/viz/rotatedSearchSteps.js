/**
 * rotatedSearchSteps.js — 「搜索旋转排序数组」(LeetCode 33) 推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 rotatedSearch.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 旋转数组有两段各自上升的折线。**每次二分，mid 把区间切成的两半里，
 * 至少有一半是完全有序的** —— 这是旋转数组对二分的全部馈赠：
 *
 *   - 判据：`nums[l] <= nums[mid]` → **左半有序**（注意等号：l === mid 时
 *     只有一个元素，也算有序）；否则**右半有序**；
 *   - 拿到有序的那半，就可以用一次值域判断决定去哪边：
 *     target 落在有序半的值域内 → 进有序半；否则进另一半。
 *
 * ── 和 LC 153 的判据对照（文章骨架）──────────────────────────────────────
 * 153（找最小值）和 **nums[r]** 比 —— 因为它要的是"mid 在断崖的哪一边"，
 * 和 right 比没有歧义；33（搜 target）和 **nums[l]** 比 —— 因为它要的是
 * "哪一半有序"，mid 把区间切成两半，左半有序当且仅当 nums[l] <= nums[mid]。
 * **同一个断崖，两道题，比较对象正好相反。**
 *
 * ── 两个坑 ────────────────────────────────────────────────────────────────
 * 1. **有序判断的等号**：`nums[l] <= nums[mid]`，l === mid（区间剩一两个元素）
 *    时必须判"有序"，写 `<` 会把单元素区间误判成右半有序、方向错乱；
 * 2. **值域判断的边界**：target 在左有序半的条件是
 *    `nums[l] <= target < nums[mid]`（target === nums[mid] 已在前面返回）；
 *    在右有序半是 `nums[mid] < target <= nums[r]` —— 两端一开一闭，
 *    写错任何一端都会在 target 恰好是端点值时丢解。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'probe' | 'goLeft' | 'goRight' | 'found' | 'miss' | 'done'
 *   desc: string
 *   nums, target
 *   l, r, mid
 *   midVal: number|null
 *   ordered: 'left' | 'right' | null   // 哪半有序
 *   range: [number, number]|null       // 有序半的值域（target 的判断区间）
 *   foundIdx: number|null
 *   done: boolean
 *
 * ⚠️ done 帧带全渲染层要用的字段（SKILL 坑 Z 强制流程第 4 条）。
 */

const DEFAULT_NUMS = [4, 5, 6, 7, 0, 1, 2]
const DEFAULT_TARGET = 0

export function buildRotatedSearchSteps(options = {}) {
  const raw = Array.isArray(options.nums) ? options.nums : DEFAULT_NUMS
  const nums = raw.slice()
  const n = nums.length
  const target = Number.isInteger(options.target) ? options.target : DEFAULT_TARGET

  const steps = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      nums,
      target,
      l: null,
      r: null,
      live: null,
      mid: null,
      midVal: null,
      ordered: null,
      range: null,
      foundIdx: null,
      done: phase === 'done',
      ...extra,
    })
  }

  if (n === 0) {
    snap('done', '输入是空的，返回 -1。', { foundIdx: -1 })
    return steps
  }

  snap(
    'init',
    `在旋转数组 \`[${nums.join(', ')}]\` 里搜 \`${target}\`，要求 \`O(log n)\` —— 不能先旋转回来再搜。` +
      `旋转数组的馈赠是：**mid 把区间切成的两半里，至少有一半完全有序**。` +
      `所以每一步三连问：mid 是不是答案？哪一半有序？target 在有序的那半的值域里吗？` +
      `在 → 进有序半；不在 → 目标只可能在另一半。`,
  )

  let l = 0
  let r = n - 1
  let guard = 0

  while (l <= r && guard < 100) {
    guard += 1
    const l0 = l
    const r0 = r
    const mid = Math.floor((l0 + r0) / 2)
    const midVal = nums[mid]

    if (midVal === target) {
      snap(
        'probe',
        `\`mid = ${mid}\`，\`nums[${mid}] = ${midVal}\` —— **正好是 target，命中**。`,
        { l: l0, r: r0, live: [l0, r0], mid, midVal, foundIdx: mid },
      )
      snap(
        'done',
        `**target ${target} 的下标 = ${mid}**。这趟每一步都是"判有序半 → 查值域 → 进对的那半"，` +
          `\`O(log n)\`，和普通二分一样的复杂度 —— 旋转只是把"哪半有序"换了个位置，判断框架一个字没变。`,
        { l: l0, r: r0, live: [l0, r0], mid, midVal, foundIdx: mid },
      )
      return steps
    }

    if (nums[l0] <= midVal) {
      // 左半 [l0, mid] 有序
      if (target >= nums[l0] && target < midVal) {
        r = mid - 1
        snap(
          'probe',
          `\`mid = ${mid}\`（值 \`${midVal}\`，不是 target）。\`nums[l] = ${nums[l0]} <= nums[mid]\` —— ` +
            `**左半 \`[${l0}, ${mid}]\` 有序**，值域 \`[${nums[l0]}, ${midVal})\`。` +
            `target \`${target}\` 在值域内 → 进左半 → \`r = ${mid - 1}\`。`,
          { l: l0, r: r0, live: [l0, mid - 1], mid, midVal, ordered: 'left', range: [nums[l0], midVal] },
        )
      } else {
        l = mid + 1
        snap(
          'probe',
          `\`mid = ${mid}\`（值 \`${midVal}\`，不是 target）。\`nums[l] = ${nums[l0]} <= nums[mid]\` —— ` +
            `**左半有序**，值域 \`[${nums[l0]}, ${midVal})\`。` +
            `target \`${target}\` 不在值域内 → 它只可能在**右半**（哪怕右半是断崖那侧）→ \`l = ${mid + 1}\`。`,
          { l: l0, r: r0, live: [mid + 1, r0], mid, midVal, ordered: 'left', range: [nums[l0], midVal] },
        )
      }
    } else {
      // 右半 [mid, r0] 有序
      if (target > midVal && target <= nums[r0]) {
        l = mid + 1
        snap(
          'probe',
          `\`mid = ${mid}\`（值 \`${midVal}\`，不是 target）。\`nums[l] = ${nums[l0]} > nums[mid]\` —— ` +
            `**右半 \`[${mid}, ${r0}]\` 有序**，值域 \`(${midVal}, ${nums[r0]}]\`。` +
            `target \`${target}\` 在值域内 → 进右半 → \`l = ${mid + 1}\`。`,
          { l: l0, r: r0, live: [mid + 1, r0], mid, midVal, ordered: 'right', range: [midVal, nums[r0]] },
        )
      } else {
        r = mid - 1
        snap(
          'probe',
          `\`mid = ${mid}\`（值 \`${midVal}\`，不是 target）。\`nums[l] = ${nums[l0]} > nums[mid]\` —— ` +
            `**右半有序**，值域 \`(${midVal}, ${nums[r0]}]\`。` +
            `target \`${target}\` 不在值域内 → 只可能在左半 → \`r = ${mid - 1}\`。`,
          { l: l0, r: r0, live: [l0, mid - 1], mid, midVal, ordered: 'right', range: [midVal, nums[r0]] },
        )
      }
    }
  }

  snap(
    'done',
    guard >= 100
      ? `异常退出（步数上限），正常输入不会走到这里。`
      : `\`l > r\`，区间空了 —— **target \`${target}\` 不在数组里，返回 -1**。` +
          `注意这趟每一步的"哪半有序"判断都没有出过错：二分在旋转数组上依然是对的，` +
          `只要每一步都确认"要去的那半真的包含答案"。`,
    { l, r, live: [l, r], foundIdx: -1 },
  )

  return steps
}
