/**
 * mergeIntervalsSteps.js — 「合并区间」(LeetCode 56) 推演动画的状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 mergeIntervals.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 合并所有重叠区间，暴力两两比较是 O(n²)。**先按左端点排序**之后，一个结构性的
 * 性质出现了：任何能和新区间重叠的区间，只可能是**当前合并区间**那一个 ——
 *
 *   - 排序后新区间的 start 是当前最大的，如果它连当前合并区间的 end 都够不着，
 *     就更够不着更早的任何区间（它们的 end 都被当前合并区间罩住了）；
 *   - 于是 O(n²) 对候选坍缩成 **每个区间只和"当前合并区间"比一次** → O(n log n)
 *     （瓶颈全在排序）。
 *
 * 一句话：**排序把"可能重叠的对"从所有对压缩成了"只比当前"。**
 *
 * ── 两个钉子 ──────────────────────────────────────────────────────────────
 * 1. **端点相触算重叠**：`[1,4]` 和 `[4,5]` 要合并成 `[1,5]`，
 *    所以比较是 `start <= curEnd`（`<=` 不是 `<`）。写成 `<`，
 *    `[1,4],[4,5]` 会被错拆成两段 —— 样例里没有相邻端点的情况，测不出来。
 * 2. **必须先排序**。不排序直接合并（如 `[[2,6],[1,3],...]`）会当场漏合并 ——
 *    上面的"只比当前"性质完全依赖左端点有序。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'sort' | 'start' | 'extend' | 'close' | 'done'
 *   desc: string
 *   intervals: number[][]   // 原始输入（init 帧展示乱序）
 *   sorted: number[][]      // 排序后的输入
 *   idx: number|null        // 当前处理的 sorted 下标
 *   curStart: number|null   // 当前合并区间的左端
 *   curEnd: number|null     // 当前合并区间的右端
 *   result: number[][]      // 已关闭（收进结果）的合并区间
 *   cmp: 'overlap' | 'gap' | null
 *   done: boolean
 *
 * ⚠️ 收尾帧保留语义字段的真实值（SKILL 坑 J）：cur 保留最后一段的真实值，
 *    result 是完整的最终答案（算法真实行为：循环结束后把 cur 也收进去）。
 */

const DEFAULT_INTERVALS = [
  [1, 3],
  [2, 6],
  [8, 10],
  [15, 18],
]

export function buildMergeIntervalsSteps(options = {}) {
  const raw = Array.isArray(options.intervals) ? options.intervals : DEFAULT_INTERVALS

  const steps = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      intervals: raw.map((iv) => iv.slice()),
      sorted: [],
      idx: null,
      curStart: null,
      curEnd: null,
      result: [],
      cmp: null,
      done: phase === 'done',
      ...extra,
    })
  }

  if (raw.length === 0) {
    snap('done', '输入是空的，直接返回空数组。')
    return steps
  }

  const sorted = raw.map((iv) => iv.slice()).sort((a, b) => a[0] - b[0] || a[1] - b[1])

  snap(
    'init',
    `给了 \`${raw.length}\` 个区间：\`[${raw.map((iv) => `[${iv[0]},${iv[1]}]`).join(', ')}]\`。` +
      `暴力做法是两两比较有没有重叠，\`O(n²)\`；` +
      `但这题有一个决定性的预处理：**先按左端点排序**。` +
      `排好序之后有一个性质 —— 新区间的 start 是当前最大的，` +
      `它如果连当前合并区间的 end 都够不着，就更够不着更早的区间（它们的 end 都被当前合并区间罩着），` +
      `所以**每个区间只需要和"当前合并区间"比一次**，重叠的候选从 \`O(n²)\` 对坍缩成线性个。` +
      `另外记住一个语义：**端点相触算重叠**，\`[1,4]\` 和 \`[4,5]\` 要合成 \`[1,5]\`。`,
  )

  snap(
    'sort',
    `按左端点排序完成：\`[${sorted.map((iv) => `[${iv[0]},${iv[1]}]`).join(', ')}]\`。` +
      `这一步 \`O(n log n)\` 是整个算法的瓶颈 —— 之后的合并扫描是严格的 O(n)。` +
      `扫描规则只有一句：看当前区间的 start 是否 \`<=\` 当前合并区间的 end，` +
      `够得着就延伸，够不着就收段、新开。`,
    { sorted: sorted.map((iv) => iv.slice()) },
  )

  let curStart = null
  let curEnd = null
  const result = []

  for (let idx = 0; idx < sorted.length; idx += 1) {
    const [s, e] = sorted[idx]
    if (curStart === null) {
      curStart = s
      curEnd = e
      snap(
        'start',
        `第一段 \`[${s},${e}]\` 直接成为当前合并区间 \`[${curStart},${curEnd}]\`。` +
          `接下来每个区间只问一句话：**你的 start 够得着我的 end 吗？**`,
        { idx, curStart, curEnd, sorted: sorted.map((iv) => iv.slice()) },
      )
      continue
    }
    if (s <= curEnd) {
      curEnd = Math.max(curEnd, e)
      snap(
        'extend',
        `\`[${s},${e}]\` 的 start \`${s} <= ${curEnd}\`（当前合并区间的 end）—— **够得着，延伸**。` +
          `当前合并区间变成 \`[${curStart},${curEnd}]\`。` +
          (e > curEnd || e === curEnd
            ? `延伸取 \`max(旧 end, ${e})\` —— 注意不能直接覆盖：新区间可能整体被当前区间罩住（比如 \`[2,3]\` 配 \`[1,6]\`）。`
            : ``),
        { idx, curStart, curEnd, cmp: 'overlap', sorted: sorted.map((iv) => iv.slice()) },
      )
    } else {
      result.push([curStart, curEnd])
      curStart = s
      curEnd = e
      snap(
        'close',
        `\`[${s},${e}]\` 的 start \`${s} > ${curEnd}\` —— **够不着，收段**。` +
          `把 \`[${result[result.length - 1][0]},${result[result.length - 1][1]}]\` 收进结果（它再也不可能被延伸了 —— ` +
          `后面区间的 start 只会更大），当前合并区间换成 \`[${s},${e}]\`。`,
        { idx, curStart, curEnd, cmp: 'gap', sorted: sorted.map((iv) => iv.slice()), result: result.map((r) => r.slice()) },
      )
    }
  }

  result.push([curStart, curEnd])
  snap(
    'done',
    `扫描结束，把最后一段 \`[${curStart},${curEnd}]\` 也收进去。` +
      `**答案 = [${result.map((r) => `[${r[0]},${r[1]}]`).join(', ')}]**，共 \`${result.length}\` 段。` +
      `回头看这趟：排序 \`O(n log n)\` + 扫描 \`O(n)\`，每个区间只和"当前合并区间"比了一次。` +
      `还有一个工程细节：结果里的区间必须是**新造的数组** —— 要是把输入区间的引用塞进结果再改它的 end，` +
      `调用方的原数据就被污染了。`,
    { idx: sorted.length - 1, curStart, curEnd, result: result.map((r) => r.slice()), sorted: sorted.map((iv) => iv.slice()) },
  )

  return steps
}
