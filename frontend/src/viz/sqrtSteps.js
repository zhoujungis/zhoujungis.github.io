/**
 * sqrtSteps.js — 「x 的平方根」(LC 69) 二分解法的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 sqrt.js。
 *
 * ── 本题的灵魂：把 704 的模板再走一步 ─────────────────────────────────────
 * 69 没有数组 —— **整数区间 [0, x] 本身就是那个"有序数组"**，
 * 谓词 P(k) := (k*k <= x)。k 越大 k² 越大，所以 P 长这样：
 *   true true ... true | false ... false
 * 求"算术平方根的整数部分" = 求**最后一个 true 的下标** —— 这叫**边界二分**，
 * 和 704 的"命中二分"只有一个动作之差：
 *   704：nums[mid] == target → **当场返回**（找特定值）；
 *   69： P(mid) == true → **记候选 ans = mid，继续向右**（找边界，右边可能还有 true）。
 * 区间空时，ans 就是最后一个 true，即 floor(sqrt(x))。
 *
 * ⚠️ 溢出是本题的"隐藏考点"：Java/C++ 里 `mid * mid` 会爆 int
 *   （x = 2147395599 时 mid ≈ 46339，mid² ≈ 2.1e9 > 2³¹-1）。
 *   对策：`mid <= x / mid`（除法）或先升 long。JS 的 number 到 2⁵³，天然免疫。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'probe' | 'done'
 *   desc: string
 *   x: number             // 被开方数（>= 0）
 *   lo, hi: number        // 本帧动作**之后**的候选区间（闭区间）
 *   prevLo, prevHi: number // 本帧动作**之前**的区间
 *   mid: number|null      // probe 帧：本轮中点
 *   sq: number|null       // probe 帧：mid * mid
 *   le: boolean|null      // probe 帧：谓词 P(mid) = (sq <= x)
 *   action: 'record_right' | 'go_left' | null
 *   ans: number           // 目前记录的最优候选（满足 P 的最大 k），初始 0
 *   prevAns: number       // 本帧动作之前的 ans
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 回放一致：prevLo/prevHi/prevAns === 上一帧的 lo/hi/ans；
 *   2. mid === prevLo + ((prevHi - prevLo) >> 1)，且落在区间内；
 *   3. 每帧只动一个边界：record_right 时 lo === mid + 1 且 ans === mid；
 *      go_left 时 hi === mid - 1 且 ans 不变；
 *   4. ans 单调不减，且 **P(ans) 恒真**（ans*ans <= x）—— 记下的必是合法候选；
 *   5. 真解恒在 [ans, hi + 1]：对每个 go_left 帧，真解 < mid；
 *   6. done 帧：lo === hi + 1 且 ans === Math.floor(Math.sqrt(x))。
 */

const DEFAULT_X = 8

export function buildSqrtSteps(options = {}) {
  const x =
    Number.isInteger(options.x) && options.x >= 0 ? options.x : DEFAULT_X

  const steps = []
  let lo = 0
  let hi = x
  let ans = 0

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      x,
      lo,
      hi,
      prevLo: lo,
      prevHi: hi,
      mid: null,
      sq: null,
      le: null,
      action: null,
      ans,
      prevAns: ans,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `求 \`√${x}\` 的整数部分。69 没有数组 —— 但**整数区间 \`[0, ${x}]\` 就是那个有序数组**：` +
      `定义谓词 \`P(k) = (k * k <= ${x})\`，k 越大 k² 越大，P 必是"前真后假"：` +
      `\`true true … true | false … false\`。` +
      `算术平方根 = **最后一个 true 的下标** —— 这是"边界二分"，和 704 的"命中二分"只差一个动作：` +
      `P(mid) 成立时**不收工**，记下 \`ans = mid\` 当候选，然后 \`lo = mid + 1\` 继续向右找更大的。`,
    { lo: 0, hi: x, prevLo: 0, prevHi: x, ans: 0, prevAns: 0 },
  )

  let guard = 0
  while (lo <= hi && guard < 64) {
    guard += 1
    const prevLo = lo
    const prevHi = hi
    const prevAns = ans
    const mid = lo + ((hi - lo) >> 1)
    const sq = mid * mid
    const le = sq <= x

    if (le) {
      ans = mid
      lo = mid + 1
      snap(
        'probe',
        `**第 ${steps.length} 探**：\`mid = ${prevLo} + ((${prevHi} - ${prevLo}) >> 1) = ${mid}\`，` +
          `\`mid² = ${sq} <= ${x}\` —— 谓词成立。但这是**边界**不是命中：` +
          `mid 右边可能还有更大的合法 k，所以**记候选** \`ans = ${mid}\`，\`lo = mid + 1 = ${lo}\` **继续向右**。` +
          `这就是 69 与 704 的分岔口：704 相等即返回，69 成立仍不停。`,
        { mid, sq, le, action: 'record_right', lo, hi, prevLo, prevHi, ans, prevAns },
      )
    } else {
      hi = mid - 1
      snap(
        'probe',
        `**第 ${steps.length} 探**：\`mid = ${prevLo} + ((${prevHi} - ${prevLo}) >> 1) = ${mid}\`，` +
          `\`mid² = ${sq} > ${x}\` —— 谓词不成立，mid 及右边全是 false，整段排除：` +
          `\`hi = mid - 1 = ${hi}\`，\`ans = ${ans}\` 不动。` +
          `真解被压进 \`[${ans}, ${hi}]\`，每探一次候选区间减半。`,
        { mid, sq, le, action: 'go_left', lo, hi, prevLo, prevHi, ans, prevAns },
      )
    }
  }

  snap(
    'done',
    `\`lo = ${lo} > hi = ${hi}\`，区间空 —— 最后一个记下的候选就是答案：` +
      `**\`⌊√${x}⌋ = ${ans}\`**（校验：\`${ans}² = ${ans * ans} <= ${x}\` 且 \`(${ans} + 1)² = ${(ans + 1) * (ans + 1)} > ${x}\`）。` +
      `复盘模板：和 704 同一套闭区间三件套，只把"命中返回"换成"成立记候选再向右" —— ` +
      `**答案不在数组里，答案在谓词的边界上**。`,
    { done: true, lo, hi, ans, prevAns: ans },
  )

  return steps
}
