/**
 * rand10UniformSteps.js — 「Rand10 的均匀性证明」推演状态机（LC 470 动画二）。
 *
 * 纯函数，不碰 DOM。渲染层是 rand10Uniform.js。
 *
 * ── 它在证明什么 ──────────────────────────────────────────────────────────
 * 49 个等概率状态（(a-1)*7+b = 1..49）里，接受区是 1..40。把 40 个状态
 * **按输出归档**：输出 k 对应 {v : (v-1) % 10 + 1 = k}，每个输出恰好
 * **4 个**状态（40 = 4 × 10）—— 逐组点亮这 40 格，最后一格不差：
 *     每组 4 个状态 ⇒ P(输出 = k | 接受) = 4/40 = 1/10。
 * 剩下 9 格是被拒绝的状态（41..49），它们会触发重掷，不产生输出。
 *
 * 帧设计：
 *   init      —— 全暗，说明 49 个等概率状态
 *   reveal k  —— 点亮输出 k 的全部 4 个前像格（k = 1..10）
 *   done      —— 汇总：40 格均分 10 组（每组 4 格）、9 格拒绝，直方图打平
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'reveal' | 'done'
 *   desc, from, to, size, acceptLimit, perOutput
 *   revealed: number             // 已点亮的输出组数（0..to）
 *   counts: number[]             // 每组已点亮的格子数（reveal k 后第 k-1 项 = perOutput）
 *   done
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 每个输出在全部 size 个状态里的前像数 === perOutput（逐格扫描验证）；
 *   2. reveal k 帧恰好点亮 perOutput 格，且它们都落在接受区；
 *   3. 拒绝格数 === size − acceptLimit；
 *   4. 变体参数（如 5 → 7）同样成立：21 = 3 × 7，每个输出 3 个前像。
 */

function normalize(options = {}) {
  const from = Number.isInteger(options.from) && options.from >= 2 ? options.from : 7
  const size = from * from
  const to =
    Number.isInteger(options.to) && options.to >= 2 && options.to <= size ? options.to : 10
  return { from, to, size }
}

/** 由参数推出的 49 格映射（供渲染层复用）。 */
export function buildRand10Board(from, to) {
  const size = from * from
  const acceptLimit = Math.floor(size / to) * to
  const board = []
  for (let r = 0; r < from; r += 1) {
    const row = []
    for (let c = 0; c < from; c += 1) {
      const value = r * from + c + 1
      const accepted = value <= acceptLimit
      row.push({
        value,
        accepted,
        output: accepted ? ((value - 1) % to) + 1 : null,
      })
    }
    board.push(row)
  }
  return { size, acceptLimit, perOutput: acceptLimit / to, board }
}

export function buildRand10UniformSteps(options = {}) {
  const { from, to, size } = normalize(options)
  const { acceptLimit, perOutput, board } = buildRand10Board(from, to)

  const steps = []
  const snap = (phase, desc, revealed) => {
    const counts = new Array(to).fill(0)
    for (let r = 0; r < from; r += 1) {
      for (let c = 0; c < from; c += 1) {
        const cell = board[r][c]
        if (cell.output !== null && cell.output <= revealed) counts[cell.output - 1] += 1
      }
    }
    steps.push({
      phase,
      desc,
      from,
      to,
      size,
      acceptLimit,
      perOutput,
      revealed,
      counts,
      done: phase === 'done',
    })
  }

  snap(
    'init',
    `证明的目标：**每个输出 1..${to} 的概率恰好是 1/${to}**。盘面上是 ${from} × ${from} = ${size} 个` +
      `等概率状态（每个格子是 (a, b) 掷出的一对值，概率都是 1/${size}）。` +
      `接受区是 1..${acceptLimit}（绿色底），被拒绝的是 ${acceptLimit + 1}..${size}（灰色）。` +
      `下面按输出 1..${to} 逐组点亮它们的光源格。`,
    0,
  )

  for (let k = 1; k <= to; k += 1) {
    snap(
      'reveal',
      `输出 \`${k}\` 对应哪些状态？解 \`(v-1) % ${to} + 1 = ${k}\` 且 \`v ≤ ${acceptLimit}\`：` +
        `恰好 **${perOutput} 个**（v = ${Array.from({ length: perOutput }, (_, i) => k + i * to).join(', ')}）。` +
        `点亮它们 —— 记住这个数：**每个输出都是 ${perOutput} 个**，一个不多一个不少。`,
      k,
    )
  }

  snap(
    'done',
    `${to} 组全部点亮：接受区共 ${acceptLimit} 格被**均分**给 ${to} 个输出，每组恰好 ${perOutput} 格；` +
      `中间 0 格重叠、0 格遗漏。于是给定「接受」：` +
      `\`P(输出 = k | 接受) = ${perOutput}/${acceptLimit} = 1/${to}\`，**均匀性得证**。` +
      `拒绝的 ${size - acceptLimit} 格（灰色）会触发重掷 —— 重掷与上一轮独立，` +
      `「第一次落进接受区」的那一轮仍然服从同样的分布，所以拒绝不影响均匀，只影响期望次数。`,
    to,
  )

  return steps
}
