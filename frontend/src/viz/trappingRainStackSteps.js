/**
 * trappingRainStackSteps.js — 「接雨水」(LeetCode 42) **单调栈解法** 推演的状态机
 * （纯函数，不碰 DOM）。
 *
 * ⚠️ 这是接雨水的**第二个**动画，和 trappingRainWaterSteps.js（双指针）是
 * **同一个问题的两种切法**，不是一个问题的两种优化 —— 所以刻意分成两个状态机、
 * 两个占位符，不给 mode 参数（数据结构完全不同：一个是两个游标，一个是一个栈）。
 *
 * ── 算法 ──────────────────────────────────────────────────────────────────
 *
 *     def trap(height):
 *         stack = []                       # 存**下标**，对应高度单调递减
 *         ans = 0
 *         for i in range(len(height)):
 *             while stack and height[i] > height[stack[-1]]:
 *                 top = stack.pop()        # 槽底
 *                 if not stack:
 *                     break                # 只有右边界、没有左边界 → 围不出凹槽
 *                 width = i - stack[-1] - 1
 *                 bounded = min(height[i], height[stack[-1]]) - height[top]
 *                 ans += width * bounded
 *             stack.append(i)
 *         return ans
 *
 * ── 视角：横着切，一次填满一层 ────────────────────────────────────────────
 *
 * 双指针 / 动态规划都是**竖着切**：站在位置 `i`，问"我头顶能存多少水"，一次算完一整列。
 * 单调栈是**横着切**：不问每一列，而是**找到一个凹槽就结算一整层**。
 *
 *     宽 = 右边界 - 左边界 - 1
 *     高 = min(左边界高度, 右边界高度) - 槽底高度
 *     水量 += 宽 × 高
 *
 * **最直观的差别**：同一个位置的水可能**被分几次加上**（一次一层）。
 * 官方例里下标 5 的 2 单位水就是这么来的 —— `i = 6` 时加 1 层，`i = 7` 时再加 1 层。
 * 这是"按层累加"最硬的证据，也是本动画最值得看的一帧。
 *
 * ── 为什么栈里要保持"高度递减" ────────────────────────────────────────────
 *
 * 栈里存的是**还没找到右边界的、高度一路下降的那些柱子**。
 * 一旦遇到一根**比栈顶更高**的柱子，说明凹槽的右边界出现了 ——
 * 栈顶就是槽底，弹出后的新栈顶是左边界，当前这根是右边界，可以结算一层。
 *
 * 注意弹栈是 `while`：一根高的右边界可能同时**盖住好几层**
 * （官方例 `i = 7` 那根高度 3 的柱子，一口气结算了三层）。
 *
 * ── 一个 step 长这样 ─────────────────────────────────────────────────────
 *   {
 *     phase: 'init' | 'push' | 'settle' | 'done',
 *     desc:  string,
 *     height: number[],          // 柱高（静态）
 *     water: number[],           // 每个位置**已累计**的水量（逐格，取 max）
 *     i: number,                 // 当前扫描到的下标
 *     stack: number[],           // 栈内下标（栈底 → 栈顶）
 *     bottom: number|null,       // settle 帧：槽底下标
 *     leftBound: number|null,    // settle 帧：左边界下标
 *     rightBound: number|null,   // settle 帧：右边界下标（= i）
 *     width: number|null,        // settle 帧：这一层的宽度
 *     layerH: number|null,       // settle 帧：这一层的高度
 *     level: number|null,        // settle 帧：水位 = min(左边界高, 右边界高)
 *     gained: number,            // 本帧新增水量
 *     total: number,
 *     done: boolean,
 *   }
 *
 * ⚠️ 官方示例 1 `[0,1,0,2,1,0,1,3,2,1,2,1]` 的答案是 **6**（不是 9）；
 *    9 是示例 2 `[4,2,0,3,2,5]` 的答案。
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
export function buildTrappingRainStackSteps(options = {}) {
  // ⚠️ 空数组是**合法输入**（答案是 0），守卫用 Array.isArray，不能用 .length。
  const height = Array.isArray(options.height) ? options.height : DEFAULT_HEIGHT
  const n = height.length
  const maxSteps = Number.isInteger(options.maxSteps) ? options.maxSteps : 400

  const base = {
    height: [...height],
    water: new Array(n).fill(0),
    i: -1,
    stack: [],
    bottom: null,
    leftBound: null,
    rightBound: null,
    width: null,
    layerH: null,
    level: null,
    gained: 0,
    total: 0,
  }

  if (n < 3) {
    return [
      {
        ...base,
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
  const stack = []
  let total = 0
  let guard = 0

  /** 拍一帧。 */
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      ...base,
      water: [...water],
      stack: [...stack],
      total,
      phase,
      desc,
      done: phase === 'done',
      ...extra,
    })
  }

  // ── 帧 1：换视角 ────────────────────────────────────────────────────────
  snap(
    'init',
    `还是这排柱子 \`[${height.join(', ')}]\`，但**换一种切法**。` +
      `前面两种解法（暴力 / 动态规划 / 双指针）都是**竖着切**：站在位置 \`i\` 上问"我头顶能存多少水"，一次算完一整列。` +
      `单调栈是**横着切**：不问每一列，而是**找到一个凹槽就结算一整层**。` +
      `做法是：用一个栈存**下标**，并让这些下标对应的高度**单调递减**。` +
      `一旦遇到一根**比栈顶更高**的柱子，就说明凹槽的右边界出现了 —— ` +
      `栈顶那个是槽底，弹出后的新栈顶是左边界，当前这根是右边界，于是可以算这一层：` +
      `\`宽 = 右边界 - 左边界 - 1\`，\`高 = min(左边界高, 右边界高) - 槽底高\`，\`水量 += 宽 × 高\`。` +
      `**这个视角最直观的差别是：同一个位置的水可能被分几次加上**（一次一层）。` +
      `官方例里下标 5 那 2 单位的水就是这么来的 —— 留意它。`,
  )

  for (let i = 0; i < n; i += 1) {
    guard += 1
    if (guard > maxSteps) break

    const h = height[i]

    // ── 弹栈：一根高的右边界可能同时盖住好几层 ──
    while (stack.length > 0 && h > height[stack[stack.length - 1]]) {
      const bottom = stack.pop()
      const hb = height[bottom]

      if (stack.length === 0) {
        // 只有右边界、没有左边界 → 围不出凹槽
        snap(
          'settle',
          `\`i = ${i}\`，\`height[${i}] = ${h}\` **>** 栈顶 \`height[${bottom}] = ${hb}\` —— 右边界出现了。` +
            `弹出槽底 \`${bottom}\`，可此时栈**空了** —— ` +
            `**只有右边界、没有左边界，围不出凹槽**，这一层结算为 \`0\`。` +
            `（这就是代码里 \`if not stack: break\` 那一行的意思。）`,
          { i, bottom, gained: 0, width: 0, layerH: 0, level: 0 },
        )
        break
      }

      const lb = stack[stack.length - 1] // 弹出后的新栈顶 = 左边界
      const hl = height[lb]
      // ⚠️ 这一层的水位由**两边较矮的那根**决定 —— 又是木桶原理
      const level = Math.min(h, hl)
      const layerH = level - hb
      const width = i - lb - 1
      if (layerH > 0) {
        for (let k = lb + 1; k < i; k += 1) {
          water[k] = Math.max(water[k], level - height[k])
        }
      }
      const gained = width * layerH
      total += gained

      snap(
        'settle',
        `\`i = ${i}\`，\`height[${i}] = ${h}\` **>** 栈顶 \`height[${bottom}] = ${hb}\` —— 右边界出现了。` +
          `弹出槽底 \`${bottom}\`（高度 \`${hb}\`）；弹出后的新栈顶 \`${lb}\`（高度 \`${hl}\`）就是**左边界**，` +
          `当前这根 \`${i}\`（高度 \`${h}\`）是**右边界**。` +
          `这一层的水位由两边**较矮的那根**决定：\`min(${h}, ${hl}) = ${level}\`。` +
          `于是 \`高 = ${level} - ${hb} = ${layerH}\`，\`宽 = ${i} - ${lb} - 1 = ${width}\`，` +
          `水量 += \`${width} × ${layerH} = ${gained}\`。`,
        {
          i,
          bottom,
          leftBound: lb,
          rightBound: i,
          width,
          layerH,
          level,
          gained,
        },
      )
    }

    // ── 入栈 ──
    stack.push(i)
    snap(
      'push',
      `\`i = ${i}\`，\`height[${i}] = ${h}\`。` +
        (stack.length > 1
          ? `它不高于栈顶 \`height[${stack[stack.length - 2]}] = ${height[stack[stack.length - 2]]}\`，`
            + `栈内高度保持**递减**，直接压入。`
          : `栈是空的，直接压入。`) +
        ` 栈 = \`[${stack.join(', ')}]\`。`,
      { i },
    )
  }

  // ── 收尾 ────────────────────────────────────────────────────────────────
  // ⚠️ 收尾帧保留语义字段的**真实值**（stack 就是最后那一刻的栈），不复写。
  const wetIdx = water.map((w, k) => (w > 0 ? k : -1)).filter((k) => k >= 0)
  snap(
    'done',
    (total === 0
      ? `扫描结束，**一滴水都接不住**。`
      : `扫描结束。**答案 = \`${total}\`** 单位的水，落在下标 \`[${wetIdx.join(', ')}]\` 这几格上。`) +
      ` 和双指针那边的答案**一模一样** —— 它们只是**切法不同**：` +
      `双指针是竖着切（一次算完一整列），单调栈是横着切（一次填满一层）。` +
      `回头看下标 5 那格：它的 \`2\` 单位水是**分两次**加上的 —— ` +
      `\`i = 6\` 时加了 1 层，\`i = 7\` 时又加了 1 层。这就是"按层累加"最硬的证据。` +
      `复杂度：每个下标**恰好入栈一次、出栈一次**，\`while\` 的总执行次数不超过 \`n\` —— 所以是 \`O(n)\` 时间、` +
      `**\`O(n)\` 空间**（栈最坏能装下全部下标）。`,
    { i: n - 1, done: true },
  )

  return steps
}
