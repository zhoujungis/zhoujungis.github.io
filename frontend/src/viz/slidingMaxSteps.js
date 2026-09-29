/**
 * slidingMaxSteps.js — 「滑动窗口最大值」(LC 239) 单调队列解法的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 slidingMax.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 队列里**只留"还有机会当最大值"的候选**，并且按值递减排列 —— 队首恒为最大。
 * 一个元素什么时候"没机会了"？当它右边出现了一个**不小于它**的元素时：
 * 只要这个新元素还在窗口里，旧元素就永远不可能成为最大值（新元素比它大、
 * 又比它晚离开窗口）—— 这就是**被支配**，可以永久淘汰，不是"临时让位"。
 *
 * 于是每来一个新元素，只有两个独立动作要维护：
 *   1. **队尾淘汰（单调性）**：while 队尾值 <= 新值 → 弹出（被支配）；
 *   2. **队首淘汰（窗口有效性）**：队首下标 < 窗口左端 → 弹出（已出窗）。
 * 维护完 push 新下标；窗口成形后（i >= k-1）队首就是这一窗的答案。
 *
 * 两个动作一个看值、一个看下标，互相独立 —— 混在一起写最容易出错。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'slide' | 'record' | 'done'
 *   desc: string
 *   nums, n, k
 *   i: number|null          // 当前元素下标
 *   l, r: number|null       // 当前窗口 [l, r]（r = i）
 *   expired: number[]       // 本帧因出窗从队首弹出的下标
 *   dropped: number[]       // 本帧因被支配从队尾弹出的下标
 *   dq: number[]            // 维护完成后的队列（存下标，值递减）
 *   maxVal: number|null     // 队首值（窗口成形时 = 本窗最大值）
 *   ans: number[]
 *   done: boolean
 *
 * ⚠️ 队列存**下标**不是值 —— 下标才能判断"还在不在窗口里"。
 */

const DEFAULT_NUMS = [1, 3, -1, -3, 5, 3, 6, 7]
const DEFAULT_K = 3

export function buildSlidingMaxSteps(options = {}) {
  const raw = Array.isArray(options.nums) ? options.nums : DEFAULT_NUMS
  const nums = raw.slice()
  const n = nums.length
  const k = Number.isInteger(options.k) && options.k > 0 ? options.k : DEFAULT_K

  const steps = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      nums,
      n,
      k,
      i: null,
      l: null,
      r: null,
      expired: [],
      dropped: [],
      dq: [],
      maxVal: null,
      ans: [],
      done: phase === 'done',
      ...extra,
    })
  }

  if (n === 0 || k > n) {
    snap(
      'done',
      n === 0 ? '数组为空 —— 没有窗口，返回空。' : `窗口大小 \`${k}\` 大于数组长度 \`${n}\` —— 无有效窗口，返回空。`,
      { done: true },
    )
    return steps
  }

  snap(
    'init',
    `给了数组 \`[${nums.join(', ')}]\`（\`${n}\` 个）和窗口大小 \`k = ${k}\`，窗口从左往右滑，` +
      `要每个窗口的最大值，要求**线性时间**。暴力每窗扫一遍是 \`O(n·k)\`；` +
      `线性做法的关键是**队列里只留"还有机会当最大值"的候选**，且按值递减 —— ` +
      `队首恒为当前窗口最大。判据：一个元素右边出现**不小于它**的新元素时，` +
      `它就被**支配**了（新元素更大、还更晚离开窗口），可以**永久淘汰**。` +
      `于是每来一个元素只维护两件事：**队尾淘汰（单调性，看值）**与` +
      `**队首淘汰（出窗，看下标）** —— 队列存的是**下标**，下标才能判断还在不在窗里。`,
  )

  const dq = [] // 存下标，对应值递减
  const ans = []

  for (let i = 0; i < n; i += 1) {
    const l = Math.max(0, i - k + 1)
    const x = nums[i]

    // 动作一：队首淘汰（出窗）
    const expired = []
    while (dq.length > 0 && dq[0] < l) {
      expired.push(dq.shift())
    }

    // 动作二：队尾淘汰（被支配）
    const dropped = []
    while (dq.length > 0 && nums[dq[dq.length - 1]] <= x) {
      dropped.push(dq.pop())
    }

    dq.push(i)

    const parts = []
    parts.push(`**\`i = ${i}\`，值 \`${x}\`，窗口 \`[${l}, ${i}]\`**：`)
    if (expired.length > 0) {
      parts.push(`队首 \`${expired.map((idx) => `${idx}(${nums[idx]})`).join('、')}\` 已滑出窗口左端 \`${l}\` —— **出队（动作一：看下标）**。`)
    }
    if (dropped.length > 0) {
      parts.push(
        `队尾 \`${dropped.map((idx) => `${idx}(${nums[idx]})`).join('、')}\` 都 \`<= ${x}\` —— ` +
          `**被 ${x} 支配，永久淘汰（动作二：看值）**：只要 \`${x}\` 还在窗里，它们永远轮不到当最大。`,
      )
    }
    if (expired.length === 0 && dropped.length === 0) {
      parts.push('没有元素需要淘汰 —— 队列仍然严格递减、且都在窗内。')
    }
    parts.push(`入队 \`${i}(${x})\`，队列（值）现在是 \`[${dq.map((idx) => nums[idx]).join(', ')}]\`，队首 \`${dq[0]}(${nums[dq[0]]})\` 就是当前最大的候选。`)

    snap('slide', parts.join(''), {
      i,
      l,
      r: i,
      expired,
      dropped,
      dq: dq.slice(),
      maxVal: nums[dq[0]],
      ans: ans.slice(), // 已收集的答案（本窗尚未记入，record 帧才记）
    })

    if (i >= k - 1) {
      ans.push(nums[dq[0]])
      snap(
        'record',
        `窗口 \`[${l}, ${i}]\` 已经装满 \`${k}\` 个 —— **队首 \`${dq[0]}(${nums[dq[0]]})\` 就是这一窗的最大值**，记入答案。` +
          `（队列严格递减且在窗内，所以队首必然是最大 —— 不需要再扫一遍窗口。）` +
          `目前答案 \`[${ans.join(', ')}]\`。`,
        {
          i,
          l,
          r: i,
          dq: dq.slice(),
          maxVal: nums[dq[0]],
          ans: ans.slice(),
        },
      )
    }
  }

  snap(
    'done',
    `\`${n}\` 个元素扫完，答案 \`[${ans.join(', ')}]\`（共 \`${ans.length}\` 个窗口）。` +
      `回头看：每个元素**最多入队一次、出队一次** —— 均摊 \`O(1)\`，总时间 \`O(n)\`，` +
      `空间 \`O(k)\`（队列最多存 k 个下标）。两个易错点：` +
      `① 队列存**下标**而不是值（存值判不了"还在不在窗里"）；` +
      `② 队首出窗要在**读答案之前**处理，否则会拿到早就滑出去的元素。`,
    { i: n - 1, l: n - k, r: n - 1, dq: dq.slice(), ans: ans.slice(), done: true },
  )

  return steps
}
