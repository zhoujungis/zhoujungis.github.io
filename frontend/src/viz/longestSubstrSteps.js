/**
 * longestSubstrSteps.js — 「无重复字符的最长子串」(LeetCode 3) 推演的状态机
 * （纯函数，不碰 DOM）。
 *
 * ── 算法 ──────────────────────────────────────────────────────────────────
 *
 *     def lengthOfLongestSubstring(s):
 *         last = {}                      # 字符 -> 它最后出现的下标
 *         left = ans = 0
 *         for right, ch in enumerate(s):
 *             if ch in last and last[ch] >= left:   # ← 关键条件
 *                 left = last[ch] + 1               # 把它挤出窗口
 *             last[ch] = right
 *             ans = max(ans, right - left + 1)
 *         return ans
 *
 * 「滑动窗口」的入门模板：**右指针一路扩张，遇到窗口内重复就收缩左指针。**
 * 两个指针都只往右走，所以整体 O(n)。
 *
 * ── 本题唯一真正的难点 ────────────────────────────────────────────────────
 *
 * **收缩条件不是"这个字符出现过"，而是"它上次出现的位置还在窗口里"。**
 *
 *       last[ch] >= left     ← 这才是判据
 *
 * 如果漏掉 `>= left` 这一半，写成"只要出现过就把 left 挪过去"：
 *
 *       left = last[ch] + 1          # ❌ 漏了"是否还在窗口内"
 *
 * 那么当某个字符上次出现的位置**已经滑到窗口左边之外**时，
 * `left` 会被拽回去 —— 而左指针一旦倒退，窗口里就会重新混进已经排除掉的字符。
 * 经典反例是 `"abba"`：
 *
 *   下标 3 的 'a'，last['a'] = 0，而此刻 left 已经是 2。
 *   ❌ left = 0 + 1 = 1   → 倒退！窗口变成 [1,3] = "bba"，里面有两个 b
 *   ✅ left 保持 2        → 窗口 [2,3] = "ba"，正确
 *
 * 另一种等价的常见写法是把保护藏进 `max`：
 *
 *       if ch in last:
 *           left = max(left, last[ch] + 1)     # max 就是那个"不许倒退"
 *
 * 两种写法完全等价。**状态机采用前一种（显式写 `>= left`）**，
 * 因为它把"为什么是这条件"直接摆在代码里，不用读者自己去推 `max` 的作用。
 *
 * ── 为什么 left 不能倒退 ──────────────────────────────────────────────────
 *
 * 滑动窗口的正确性建立在一个不变量上：
 *
 *       **窗口 [left, right] 内永远没有重复字符。**
 *
 * 左指针后退意味着把"之前为了去重而挤出去"的字符又放了回来 ——
 * 不变量当场破掉，后续所有长度都会算大。
 *
 * ── 编码 ─────────────────────────────────────────────────────────────────
 *
 * 用 `Array.from(s)` 拆字符，**不要用 `s.split('')` 或 `s[i]`** ——
 * 后两者按 UTF-16 码元切，遇到 emoji / 生僻字会把一个字符拆成两半，
 * 于是"两个不同的代理项"被当成两个不同字符，答案反而偏大。
 * `Array.from` 按码点切，一个字就是一个元素。
 *
 * 一个 step 长这样：
 *   {
 *     phase: 'init' | 'expand' | 'slide' | 'done',
 *     desc:  string,
 *     right: number,              // 这一步处理的字符下标
 *     left:  number,              // 窗口左边界（处理完之后）
 *     prevLeft: number|null,      // slide 帧里 left 的旧值（用于讲"挪了多远"）
 *     ch: string|null,            // 这一步的字符
 *     hitIdx: number|null,        // 它上次出现的下标（在窗口内才非 null）
 *     outsideWindow: boolean,     // 出现过、但已经在窗口左边之外（不构成重复）
 *     lastSeen: {[ch]: number},   // 字符 -> 最后出现下标
 *     windowLen: number,          // 当前窗口长度 = right - left + 1
 *     ans: number,                // 目前为止的最长长度
 *     bestRange: [number, number]|null,   // 产生 ans 的那个窗口（终帧高亮用）
 *     done: boolean,
 *   }
 *
 * ── 变体 ─────────────────────────────────────────────────────────────────
 *
 * 159 / 340（至多 K 个不同字符）把判据从"无重复"换成"窗口内不同字符数 ≤ K"，
 * 收缩改成 while 循环；424（替换后最长重复字符）改成"窗口长度 - 出现最多的字符数 ≤ K"；
 * 76（最小覆盖子串）方向反过来 —— 求的是"最短的满足条件的窗口"。
 * 形态差别见文章第九节，不给状态机开 mode。
 */

/**
 * 构造推演步骤。
 *
 * @param {{
 *   values?: string,
 *   maxSteps?: number,
 * }} [options]
 * @returns {object[]}
 */
export function buildLongestSubstrSteps(options = {}) {
  // ⚠️ 空串是**合法输入**（答案 0），所以守卫必须用 typeof 判断类型，
  // 不能写 `options.values || 'abcabcbb'` —— 那样空串会被默认值顶掉。
  const s = typeof options.values === 'string' ? options.values : 'abcabcbb'

  // 按码点拆字符（见文件头「编码」一节）
  const chars = Array.from(s)
  const n = chars.length

  const maxSteps = Number.isInteger(options.maxSteps) ? options.maxSteps : 400

  const base = {
    right: -1,
    left: 0,
    prevLeft: null,
    ch: null,
    hitIdx: null,
    outsideWindow: false,
    lastSeen: {},
    windowLen: 0,
    ans: 0,
    bestRange: null,
  }

  // 空串：一帧收工
  if (n === 0) {
    return [
      {
        ...base,
        phase: 'done',
        desc: '**空串** —— 一个字符都没有，最长无重复子串的长度是 `0`。',
        done: true,
      },
    ]
  }

  const steps = []
  const lastSeen = {}          // 字符 -> 最后出现下标
  let left = 0
  let ans = 0
  let bestRange = null
  let guard = 0

  /** 拍一帧。 */
  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      right: -1,
      left,
      prevLeft: null,
      ch: null,
      hitIdx: null,
      outsideWindow: false,
      lastSeen: { ...lastSeen },
      windowLen: 0,
      ans,
      bestRange: bestRange ? [...bestRange] : null,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `要在 \`${s}\`（${n} 个字符）里找**最长的不含重复字符的子串**。` +
      `用**滑动窗口**：\`right\` 一路往右扩张，把字符一个个吃进窗口；` +
      `一旦吃进来的字符**在窗口内已经出现过**，就让 \`left\` 跳到"那个旧位置 + 1"，` +
      `把它挤出窗口。两个指针都只往右走，所以整体是 O(n)。` +
      `维护一张表 \`lastSeen\`，记每个字符最后出现在哪 —— 这就是"一眼看出重不重复"的依据。`,
  )

  for (let right = 0; right < n; right += 1) {
    guard += 1
    if (guard > maxSteps) break

    const ch = chars[right]
    const prev = lastSeen[ch]
    const outsideWindow = prev !== undefined && prev < left

    if (prev !== undefined && prev >= left) {
      // ── 窗口内重复：左指针跳过去 ──────────────────────────────────────
      const prevLeft = left
      left = prev + 1
      lastSeen[ch] = right
      const len = right - left + 1
      const updated = len > ans
      if (updated) {
        ans = len
        bestRange = [left, right]
      }
      snap(
        'slide',
        `\`right\` 走到 \`${right}\`，字符是 **\`${ch}\`**。它上次出现在下标 \`${prev}\`，` +
          `**而这个位置还在窗口里**（\`${prev} >= left = ${prevLeft}\`）—— 构成重复。` +
          `于是 \`left\` 从 \`${prevLeft}\` 跳到 \`${prev} + 1 = ${left}\`，` +
          `把旧的 \`${ch}\` 挤出窗口。` +
          `注意 **\`left\` 只会往右跳，绝不会退回去** —— 这是滑动窗口正确性的根基。` +
          `现在窗口是 \`[${left}, ${right}]\`，长度 \`${len}\`` +
          (updated ? `，**刷新了答案 → \`ans = ${ans}\`**。` : `，没超过当前的 \`ans = ${ans}\`。`),
        {
          right,
          left,
          prevLeft,
          ch,
          hitIdx: prev,
          windowLen: len,
        },
      )
      continue
    }

    // ── 没构成重复：正常扩张 ────────────────────────────────────────────
    lastSeen[ch] = right
    const len = right - left + 1
    const updated = len > ans
    if (updated) {
      ans = len
      bestRange = [left, right]
    }
    snap(
      'expand',
      `\`right\` 走到 \`${right}\`，字符是 **\`${ch}\`**。` +
        (outsideWindow
          ? `它**出现过**（下标 \`${prev}\`），但那个位置**已经在窗口左边之外**了` +
            `（\`${prev} < left = ${left}\`）—— 它早就被挤出窗口，现在再遇到**不算重复**，` +
            `所以 \`left\` 原地不动。` +
            `**这一步就是"只看位置是否还在窗口内"这个判据的价值所在**：` +
            `如果这里无脑写 \`left = ${prev} + 1\`，左指针就会倒退回 \`${prev + 1}\`。`
          : `它还没在窗口里出现过，直接吃进来。`) +
        ` 现在窗口是 \`[${left}, ${right}]\`，长度 **\`${len}\`**` +
        (updated ? `，**刷新了答案 → \`ans = ${ans}\`**。` : `，没超过当前的 \`ans = ${ans}\`。`),
      {
        right,
        left,
        ch,
        hitIdx: outsideWindow ? prev : null,
        outsideWindow,
        windowLen: len,
      },
    )
  }

  // ── done ─────────────────────────────────────────────────────────────────
  const best = bestRange ? chars.slice(bestRange[0], bestRange[1] + 1).join('') : ''
  snap(
    'done',
    `扫描结束。**答案 = \`${ans}\`**，对应的窗口是 \`[${bestRange?.[0]}, ${bestRange?.[1]}]\`，` +
      `内容 \`"${best}"\`。` +
      `回头看整条链路：\`right\` 一共推进了 ${n} 次，\`left\` 也从头到尾**只往右走、从不后退**，` +
      `两个指针加起来总移动量不超过 \`2n\` —— 所以是**严格的 O(n)**，` +
      `而不是"外层枚举左端点 × 内层枚举右端点"的 O(n²)。` +
      `空间是 O(min(n, 字符集大小))：\`lastSeen\` 每个不同字符只占一条。`,
    // ⚠️ 收尾帧**不要**复写 left / right / windowLen（LC 124 在那里踩过：
    // 复写之后那一帧的逐帧不变量全部失效，测试只好到处排除 done）。
    // 这里换个做法：left / right / windowLen 一律保留**最后一步的真实值**，
    // "最优窗口"单独由 bestRange 表达，渲染层在 done 帧改用它来画窗口。
    // 好处是「left 单调不减」「lastSeen 的位置 <= right」「windowLen = right-left+1」
    // 这些不变量在 done 帧依然成立，测试不用开例外。
    {
      left,
      right: n - 1,
      windowLen: n - left,
      done: true,
    },
  )

  return steps
}
