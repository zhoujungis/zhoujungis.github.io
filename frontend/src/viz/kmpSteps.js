/**
 * kmpSteps.js — 「KMP 求 next 数组」的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 kmp.js。
 *
 * ── 一、定义（面试第一坑：先确认用哪种）─────────────────────────────────────
 * 本文用**前缀函数**（真前后缀表）定义：
 *     next[i] = p[0..i] 的最长相等**真**前后缀的长度
 * 「真」= 不含子串本身，于是天然 next[0] = 0。
 * 对 p = "abacaba"：next = [0,0,1,0,1,2,3]。
 *
 * 另一种等价定义（严蔚敏《数据结构》风格）把首项记作 -1：
 *     next[0] = -1，且 next[i] = p[0..i-1] 的最长相等真前后缀长度
 * 对同一条串得 [-1,0,0,1,0,1,2]。两者关系：
 *     B = [-1] + A[0..n-2]
 * 面试时**先说用哪种**，再作答；本文默认 A。
 *
 * ── 二、怎么算：自己跟自己做匹配 ────────────────────────────────────────────
 *   next[0] = 0; j = 0
 *   for i = 1 .. n-1:
 *       while j > 0 and p[i] != p[j]:  j = next[j-1]     # 回退到更短候选
 *       if p[i] == p[j]:               j = j + 1         # 候选再长一位
 *       next[i] = j
 * j 有双重身份：既是「已匹配的前缀长度」，也是「下一个要和 p[i] 比的下标」。
 * 关键不变量：进入比较前，p[0..j-1] 与 p[i-j..i-1] 逐字相等 —— j 就是「当前
 * 最长的、能接下去的前缀」的长度。回退用 next[j-1]，是因为 p[0..j-1] 自身的
 * 最长相等前后缀（长度 next[j-1]）正是「接得上、又更短」的那个候选。
 *
 * ── 三、帧字段 ──────────────────────────────────────────────────────────────
 *   phase: 'init' | 'compare' | 'retreat' | 'assign' | 'done'
 *   desc: string
 *   p: string, n: number
 *   i: number                       // 当前下标（init/done 为 -1）
 *   jBefore/jAfter: number          // 本帧动作前后的 j
 *   chI/chJ: string                 // 参与比较的两字符（retreat 帧是 p[i]/p[from]）
 *   match: boolean                  // 比较帧：p[i] === p[j]
 *   prevNext/next: number[]         // 本帧动作前/后的 next
 *   retreats/comparisons: number    // 累计回退 / 比较次数
 *   knownCount: number              // 已定下的 next 前缀长度（next[0] 恒已知，初值 1）
 *   done: boolean
 *
 * ── 四、逐帧不变量（单测钉死）──────────────────────────────────────────────
 *   1. 回放一致：frame[k].prevNext === frame[k-1].next；init/done 帧 prevNext === next。
 *   2. compare 帧：jAfter === jBefore（j 不动，留给 assign 帧），next 不变，
 *      match === (p[i] === p[jBefore])，comparisons 比上一帧多 1。
 *   3. retreat 帧：jBefore > 0，jAfter === prevNext[jBefore-1]，next 不变，
 *      retreats 比上一帧多 1；且回退帧前必有一个失败 compare。
 *   4. assign 帧：next[i] === jAfter，jAfter - jBefore 属于 {0,1}，差 1 当且仅当
 *      match；除 next[i] 外其余 next 项与 prevNext 逐项相等；knownCount === i+1。
 *   5. 默认 p = "abacaba"：16 帧 = init + 14 + done，next = [0,0,1,0,1,2,3]，
 *      comparisons = 7，retreats = 1。
 *   6. next 与独立参考解（对每个 i 暴力枚举最长相等真前后缀）逐项一致。
 */

export const KMP_DEFAULT_P = 'abacaba'

function normalize(options = {}) {
  const p = typeof options.p === 'string' && options.p.length >= 1 ? options.p : KMP_DEFAULT_P
  return { p, n: p.length }
}

export function buildKmpSteps(options = {}) {
  const { p, n } = normalize(options)
  const next = new Array(n).fill(0)
  let j = 0
  let retreats = 0
  let comparisons = 0
  let knownCount = 1
  const steps = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      p,
      n,
      i: -1,
      jBefore: j,
      jAfter: j,
      chI: '',
      chJ: '',
      match: false,
      prevNext: next.slice(),
      next: next.slice(),
      retreats,
      comparisons,
      knownCount,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `p = "${p}"（${n} 个字符）。定义：\`next[i]\` = \`p[0..i]\` 这个子串的**最长相等真前后缀**长度 —— ` +
      `「真」指不含子串本身，所以 \`next[0] = 0\` **恒成立**。求法一句话：**自己跟自己匹配**。 ` +
      `维护 \`j\` = 已匹配的前缀长度（也是下一个要和 \`p[i]\` 比的 p 下标），从 \`i = 1\` 起：` +
      `先 \`while j > 0 且 p[i] != p[j]\` 就 \`j = next[j-1]\` 回退，再 \`if p[i] == p[j]\` 就 \`j += 1\`，` +
      `最后 \`next[i] = j\`。另有把首项记作 \`-1\` 的定义（严蔚敏《数据结构》），与本文的关系是 ` +
      `\`B = [-1] + A[0..n-2]\` —— **面试先确认用哪种**，本文默认前者（前缀函数）。`,
  )

  for (let i = 1; i < n; i += 1) {
    let advanced = false

    while (j > 0) {
      const ci = p[i]
      const cj = p[j]
      const match = ci === cj
      comparisons += 1
      snap(
        'compare',
        `比较 \`p[${i}] = '${ci}'\` 与 \`p[${j}] = '${cj}'\`：**${match ? '相等' : '不等'}**。` +
          `进入比较前有一步不变量：\`p[0..${j - 1}]\` 与 \`p[${i - j}..${i - 1}]\` **逐字相等** —— ` +
          `\`j\` 正是「当前最长的、能接下去的前缀」的长度。`,
        { i, jBefore: j, jAfter: j, chI: ci, chJ: cj, match },
      )
      if (match) {
        advanced = true
        break
      }
      const from = j
      const to = next[from - 1]
      retreats += 1
      snap(
        'retreat',
        `\`p[${i}]\` 与 \`p[${from}]\` 对不上，把 \`j\` 从 ${from} 回退到 \`next[${from - 1}] = ${to}\`。` +
          `**回退不是退步**：它换的是「更短但仍接得上的前后缀」，靠的正是 \`next[j-1]\` 记着 ` +
          `\`p[0..${from - 1}]\` 自身的最长相等前后缀（长度 ${to}）。`,
        { i, jBefore: from, jAfter: to, chI: p[i], chJ: p[from], match: false },
      )
      j = to
    }

    if (!advanced) {
      const ci = p[i]
      const cj = p[0]
      const match = ci === cj
      comparisons += 1
      snap(
        'compare',
        `比较 \`p[${i}] = '${ci}'\` 与 \`p[0] = '${cj}'\`：**${match ? '相等' : '不等'}**。` +
          (match
            ? `前缀可以再长一位。`
            : `而 \`j\` 已是 0，没有更短的候选可退 —— 只能 \`next[${i}] = 0\`。`),
        { i, jBefore: 0, jAfter: 0, chI: ci, chJ: cj, match },
      )
      if (match) advanced = true
    }

    const jBefore = j
    const jAfter = advanced ? j + 1 : j
    const before = next.slice()
    next[i] = jAfter
    j = jAfter
    knownCount = i + 1
    snap(
      'assign',
      `定下 \`next[${i}] = ${jAfter}\`，\`j\` 更新为 ${jAfter}` +
        (advanced ? `（比较相等，\`j\` 前进一位）` : `（比较不等且 \`j\` 已是 0，停在 0）`) +
        (i + 1 < n ? `。下一步 \`i\` 走到 ${i + 1}。` : `。`),
      {
        i,
        jBefore,
        jAfter,
        chI: p[i],
        chJ: p[jBefore],
        match: advanced,
        prevNext: before,
        next: next.slice(),
        knownCount,
      },
    )
  }

  const altNext = [-1, ...next.slice(0, Math.max(0, n - 1))]
  snap(
    'done',
    `循环走完，**next = [${next.join(',')}]**（p = "${p}"）。每个 \`next[i]\` 都等于 ` +
      `\`p[0..i]\` 的最长相等真前后缀长度。把首项记作 \`-1\` 的那种定义（严蔚敏版）写作 ` +
      `\`[${altNext.join(',')}]\`，与本文只差一次整体移位。求 next 是 **O(n)**：\`j\` 每次最多自增 1、` +
      `回退总量不超过自增总量，均摊线性。拿到 next 之后，用它做 KMP 匹配也是 \`O(n + m)\`。`,
    { i: -1, jBefore: j, jAfter: j, knownCount: n, done: true },
  )

  return steps
}
