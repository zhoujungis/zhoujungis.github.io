/**
 * trappingRainWaterSteps.js — 「接雨水」(LeetCode 42) **双指针解法** 推演的状态机
 * （纯函数，不碰 DOM）。
 *
 * ── 算法 ──────────────────────────────────────────────────────────────────
 *
 *     def trap(height):
 *         l, r = 0, len(height) - 1
 *         left_max = right_max = 0
 *         ans = 0
 *         while l < r:
 *             if height[l] < height[r]:
 *                 left_max = max(left_max, height[l])
 *                 ans += left_max - height[l]
 *                 l += 1
 *             else:
 *                 right_max = max(right_max, height[r])
 *                 ans += right_max - height[r]
 *                 r -= 1
 *         return ans
 *
 * ── 这题的全部内容，其实只有一句话 ──────────────────────────────────────
 *
 *     water[i] = max(0, min(左最高, 右最高) - height[i])
 *
 * 也就是**木桶原理**：水会从矮的一边漏出去，能留住的高度取决于两侧里**较矮**的那根。
 *
 * 所以四种解法的区别，根本不在"算法不同"，而在
 * **「怎么拿到每个位置的左右最高」**：
 *
 * | 解法 | 怎么拿到 | 时间 | 空间 |
 * |---|---|---|---|
 * | 暴力 | 每个位置左右各扫一遍 | O(n²) | O(1) |
 * | 动态规划 | 预处理两个数组（前缀最大 / 后缀最大） | O(n) | O(n) |
 * | **双指针（本文件）** | **边走边维护，只在"确定安全"的一侧结算** | O(n) | **O(1)** |
 * | 单调栈 | 换个视角：横向按"凹槽"整段结算 | O(n) | O(n) |
 *
 * ── 双指针唯一真正的难点：为什么"较矮的那一端"可以立刻结算 ──────────────
 *
 * 关键在于：**此刻的 `left_max` / `right_max` 是"到目前为止见过的最高"，
 * 不是全局的左侧最高 / 右侧最高。** 那凭什么敢拿它当水位？
 *
 * 以 `height[l] < height[r]`、结算左端为例（**这就是本题的核心论证**）：
 *
 *   1. `l` 的右边至少有一根高度 `>= height[r]` 的柱子（就是 `r` 自己那根），
 *      而 `height[r] > height[l]` —— 所以 `l` 的"右侧最高"一定严格大于它自己的高度。
 *   2. 假设反过来了：`left_max > 真正的水位`（即左侧那根高柱才是短板之外的那一边）。
 *      那么 `left_max` 来自 `[0..l]` 里的某根高柱 `k`。
 *      当左指针还停在 `k` 的时候，`height[k]` 比当时右边所有已扫过的柱子都高，
 *      于是判据 `height[l] < height[r]` **不成立**，算法会一直去结算右侧；
 *      直到右侧也长出更高的柱子（把 `right_max` 抬到 `> left_max`），或者指针相遇。
 *   3. 所以**当算法真的来结算 `l` 的这一刻，`right_max` 已经不可能低于 `left_max`** ——
 *      短板只能是左边，而 `left_max` 是我们一路扫过来已经确切知道的数。
 *
 * 一句话记法：
 * **矮的那一端，它的"外侧上界"已经由对面的柱子保证了；
 * 对侧不可能是短板，所以可以放心用已知的这一侧定水位。**
 *
 * ── 一个容易写错的地方：`left_max` 要先更新再结算 ──────────────────────
 *
 *     left_max = max(left_max, height[l])      # ① 先更新
 *     ans += left_max - height[l]              # ② 再结算
 *
 * 顺序反过来的话：当 `height[l]` 是新高时，`left_max - height[l]` 会是**负数**，
 * 把总量往回扣。写成更新 + 结算，新高时两项相消刚好得 `0`，不用写 `if`。
 *
 * ── 一个 step 长这样 ─────────────────────────────────────────────────────
 *   {
 *     phase: 'init' | 'settle-l' | 'settle-r' | 'done',
 *     desc:  string,
 *     height: number[],          // 柱高（静态）
 *     water: number[],           // 每个位置**已结算**的水量（逐格累加）
 *     l: number, r: number,      // 双指针
 *     leftMax: number,
 *     rightMax: number,
 *     side: 'l' | 'r' | null,    // 本帧结算的是哪一侧
 *     idx: number|null,          // 本帧结算的下标
 *     gained: number,            // 本帧新增的水量（0 = 这格是新高，存不住水）
 *     total: number,             // 累计水量
 *     done: boolean,
 *   }
 *
 * ⚠️ 官方示例 1 `[0,1,0,2,1,0,1,3,2,1,2,1]` 的答案是 **6**（不是 9）；
 *    9 是示例 2 `[4,2,0,3,2,5]` 的答案。两个别串。
 *
 * ── 变体 ─────────────────────────────────────────────────────────────────
 *
 * 单调栈解法见 trappingRainStackSteps.js（视角完全不同，单独一个状态机）。
 * 三维版 LC 407 见文章（优先队列 + BFS，本质是"到边界的最小瓶颈路径"）。
 */

const DEFAULT_HEIGHT = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]

/**
 * 构造推演步骤。
 *
 * @param {{
 *   height?: number[],
 *   maxSteps?: number,
 * }} [options]
 * @returns {object[]}
 */
export function buildTrappingRainWaterSteps(options = {}) {
  // ⚠️ 空数组是**合法输入**（答案是 0），守卫用 Array.isArray，不能用 .length。
  const height = Array.isArray(options.height) ? options.height : DEFAULT_HEIGHT
  const n = height.length
  const maxSteps = Number.isInteger(options.maxSteps) ? options.maxSteps : 400

  const base = {
    height: [...height],
    water: new Array(n).fill(0),
    l: 0,
    r: n - 1,
    leftMax: 0,
    rightMax: 0,
    side: null,
    idx: null,
    gained: 0,
    total: 0,
  }

  // 少于 3 根柱子接不住任何水
  if (n < 3) {
    return [
      {
        ...base,
        r: n === 0 ? -1 : n - 1,
        phase: 'done',
        desc:
          `只有 \`${n}\` 根柱子 —— 少于三根就围不出凹槽，` +
          `**接不住任何水**，答案是 \`0\`。`,
        done: true,
      },
    ]
  }

  const steps = []
  const water = new Array(n).fill(0)
  let l = 0
  let r = n - 1
  let leftMax = 0
  let rightMax = 0
  let total = 0
  let guard = 0

  /** 拍一帧。 */
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      ...base,
      water: [...water],
      l,
      r,
      leftMax,
      rightMax,
      total,
      phase,
      desc,
      done: phase === 'done',
      ...extra,
    })
  }

  // ── 帧 1：立公式 ────────────────────────────────────────────────────────
  snap(
    'init',
    `给出了 \`${n}\` 根柱子的高度图 \`[${height.join(', ')}]\`。` +
      `先想清楚一件事：**位置 \`i\` 能存多少水，只取决于它左边最高的柱子和右边最高的柱子** —— ` +
      `水会从矮的那一边漏出去，能留住的高度是两者的**短板**，` +
      `也就是 \`water[i] = max(0, min(左最高, 右最高) - height[i])\`。` +
      `所以整题其实只在问一句话：**每个位置的"左右最高"分别是多少？** ` +
      `后面四种解法的全部区别，就是"怎么拿到这两个数"。` +
      `双指针的做法是：**两端各派一个指针往中间夹**，一边走一边记录"这一侧到目前为止见过的最高"` +
      `（\`leftMax\` 和 \`rightMax\`），**谁矮就先结算谁**。`,
  )

  while (l < r) {
    guard += 1
    if (guard > maxSteps) break

    const hl = height[l]
    const hr = height[r]

    if (hl < hr) {
      // ── 结算左端 ──
      const prevMax = leftMax
      leftMax = Math.max(leftMax, hl)
      const gained = leftMax - hl // 新高时为 0，见文件头"容易写错的地方"
      total += gained
      water[l] = gained

      snap(
        'settle-l',
        `\`l = ${l}\`、\`r = ${r}\`。比较两端：\`height[${l}] = ${hl}\` **<** \`height[${r}] = ${hr}\` —— ` +
          `**左端更矮，结算左边这一格**。` +
          `为什么敢现在就定它的水位？因为 \`${l}\` 的右边至少有一根高度 \`>= ${hr}\` 的柱子` +
          `（就是 \`r\` 自己那根），而 \`${hr} > ${hl}\` —— ` +
          `它的"右侧最高"一定严格大于它自己的高度，**右边不可能成为短板**；` +
          `真正决定水位的只可能是左侧，而 \`leftMax\` 是我们一路扫过来已经确切知道的数。` +
          `结算：\`leftMax = max(${prevMax}, ${hl}) = ${leftMax}\`，` +
          `这一格的水 = \`${leftMax} - ${hl} = ${gained}\`` +
          (gained === 0
            ? `（**它是目前左边最高的柱子**，自己就是边界，存不住水）。`
            : `。`),
        { side: 'l', idx: l, gained, leftMax, total },
      )
      l += 1
    } else {
      // ── 结算右端 ──
      const prevMax = rightMax
      rightMax = Math.max(rightMax, hr)
      const gained = rightMax - hr
      total += gained
      water[r] = gained

      snap(
        'settle-r',
        `\`l = ${l}\`、\`r = ${r}\`。比较两端：\`height[${l}] = ${hl}\` **>=** \`height[${r}] = ${hr}\` —— ` +
          `**右端更矮（或一样高），结算右边这一格**。` +
          `道理是对称的：\`${r}\` 的左边至少有一根高度 \`>= ${hl}\` 的柱子（就是 \`l\` 自己那根），` +
          `而 \`${hl} >= ${hr}\` —— 它的"左侧最高"不会成为短板，` +
          `水位只能由右侧决定，而 \`rightMax\` 是我们从右扫过来已经确切知道的数。` +
          `结算：\`rightMax = max(${prevMax}, ${hr}) = ${rightMax}\`，` +
          `这一格的水 = \`${rightMax} - ${hr} = ${gained}\`` +
          (gained === 0
            ? `（**它是目前右边最高的柱子**，自己就是边界，存不住水）。`
            : `。`),
        { side: 'r', idx: r, gained, rightMax, total },
      )
      r -= 1
    }
  }

  // ── 收尾 ────────────────────────────────────────────────────────────────
  // ⚠️ 收尾帧保留语义字段的**真实值**（l、r 就是指针相遇的位置），
  // 不去复写它们 —— 这样逐帧不变量在收尾帧依然成立，单测不用开例外。
  const wetIdx = water.map((w, i) => (w > 0 ? i : -1)).filter((i) => i >= 0)
  snap(
    'done',
    (total === 0
      ? `扫描结束，**一滴水都接不住**（没有形成任何凹槽）。`
      : `扫描结束。**答案 = \`${total}\`** 单位的水，落在下标 \`[${wetIdx.join(', ')}]\` 这几格上。`) +
      ` 回头看这趟：\`l\` 和 \`r\` 从两端往中间走，` +
      `**每一次只动一个指针，两个指针合计最多走 \`n\` 步** —— 所以是 \`O(n)\` 时间。` +
      `全程只用了 \`l\`、\`r\`、\`leftMax\`、\`rightMax\`、\`ans\` 五个变量 —— ` +
      `**\`O(1)\` 空间**，比动态规划那两个数组的版本还省。` +
      `它为什么能省掉那两个数组？因为**它根本不需要知道"每个位置的两侧最高"** —— ` +
      `它只在"较矮的那一端"结算，而那一端的水位恰好已经确定。`,
    { side: null, idx: null, gained: 0, done: true },
  )

  return steps
}
