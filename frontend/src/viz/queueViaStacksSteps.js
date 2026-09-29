/**
 * queueViaStacksSteps.js — 「用栈实现队列」(LC 232) 双栈解法的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 queueViaStacks.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 栈是 LIFO，队列要 FIFO —— 方向正好相反。而"相反"翻两次就是原样：
 * 元素进 `in` 栈被**倒一次**（后来的压先来的上面），搬进 `out` 栈再**倒一次**
 * （out 顶变成最早来的）—— **两次反转 = 正序**，FIFO 就这么来的。
 *
 * 正确性的钉子：**只有 `out` 空了才搬运**。搬运必须把 `in` **整摞**翻过去 ——
 * 中途只搬一半，out 里就会出现"新的压在旧的上面"，顺序就坏了。
 * `out` 没空就再搬，等于把还没消费完的旧顺序插进新来的人 —— 必错。
 *
 * 均摊 O(1) 的账：每个元素一生**最多被搬一次**（in 进 1 次 + 搬 1 次 + out 出 1 次
 * = 至多 3 次栈操作）。单次 pop 最坏 O(n)（触发搬运），但 n 次操作总花费 O(n)。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'push' | 'transfer' | 'pop' | 'peek' | 'done'
 *   desc: string
 *   ops: [{op, val?}]       // 操作序列（默认示例）
 *   opIdx: number|null      // 本帧所属操作下标
 *   inn: number[]           // in 栈，底 → 顶
 *   out: number[]           // out 栈，底 → 顶（顶 = 最早入队的未消费元素）
 *   moved: number|null      // transfer 帧：本帧从 in 顶翻到 out 顶的元素；
 *                           //   一次搬运的第一帧是「触发帧」（moved=null，快照为搬运前）
 *   result: number|null     // pop / peek 帧的返回值
 *   queueOut: number[]      // 已被 pop 消费的元素（按出队顺序）
 *   transfers: number       // 截至本帧的搬运次数（均摊账本）
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 元素守恒：inn + out + queueOut 恰好是已 push 元素的多重集；
 *   2. 顺序不变量：out 里每个元素的入队时刻都早于 in 里所有元素
 *      （out 是"旧的一摞"，in 是"新的一摞"，绝不交叉）；
 *   3. 搬运只在 out 为空时发生（transfer 帧的快照里 out 搬运前必为空）；
 *   4. 每个元素至多被搬一次（transfers 总数 <= push 总数）。
 */

const DEFAULT_OPS = [
  { op: 'push', val: 1 },
  { op: 'push', val: 2 },
  { op: 'push', val: 3 },
  { op: 'pop' },
  { op: 'peek' },
  { op: 'pop' },
  { op: 'push', val: 4 },
  { op: 'pop' },
  { op: 'pop' },
]

const OP_LABEL = {
  push: (v) => `push(${v})`,
  pop: () => 'pop()',
  peek: () => 'peek()',
  empty: () => 'empty()',
}

export function buildQueueViaStacksSteps(options = {}) {
  const ops = Array.isArray(options.ops) && options.ops.length > 0
    ? options.ops.map((o) => ({ ...o }))
    : DEFAULT_OPS.map((o) => ({ ...o }))

  const steps = []

  const inn = []
  const out = []
  const queueOut = []
  let transfers = 0

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      ops,
      opIdx: null,
      inn: inn.slice(),
      out: out.slice(),
      moved: null,
      result: null,
      queueOut: queueOut.slice(),
      transfers,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `用两个栈实现队列：支持 \`push\` / \`pop\` / \`peek\`，要求 FIFO。` +
      `栈是 LIFO，方向正好相反 —— 但"相反"翻**两次**就是原样：` +
      `进 \`in\` 栈倒一次，整摞翻进 \`out\` 栈再倒一次，\`out\` 顶就是最早来的。` +
      `正确性的钉子：**只有 \`out\` 空了才搬运** —— 搬一半的顺序是坏的。` +
      `操作序列：\`${ops.map((o) => OP_LABEL[o.op](o.val)).join(' → ')}\`。`,
  )

  for (let i = 0; i < ops.length; i += 1) {
    const o = ops[i]

    if (o.op === 'push') {
      const x = Number(o.val)
      inn.push(x)
      snap(
        'push',
        `**\`push(${x})\`**：直接压进 \`in\` 栈顶 —— \`O(1)\`，\`out\` 不动。` +
          `此时 \`in\`（底→顶）\`[${inn.join(', ')}]\`，\`out\` \`[${out.join(', ')}]\`。` +
          (out.length > 0
            ? `注意 \`out\` 里还留着旧的 \`${out.join('、')}\` —— 它们**先于** ${x} 入队，` +
              `必须等 \`out\` 清空才轮到新元素，所以现在**绝不能搬**。`
            : `（\`out\` 为空，新元素排在队尾。）`),
        { opIdx: i },
      )
      continue
    }

    if (o.op === 'pop' || o.op === 'peek') {
      const isPop = o.op === 'pop'
      if (inn.length === 0 && out.length === 0) {
        snap(isPop ? 'pop' : 'peek', `**\`${o.op}()\`**：队列已空，返回 \`null\`。`, { opIdx: i, result: null })
        continue
      }

      // 搬运阶段：out 为空才把 in 整摞翻过来（每个元素一帧）
      if (out.length === 0) {
        snap(
          'transfer',
          `**\`${o.op}()\`** 要取队首，但 \`out\` 空了 —— 触发搬运：` +
            `把 \`in\` 整摞 \`[${inn.join(', ')}]\`（顶在右）逐个弹出、压进 \`out\`。` +
            `翻完之后 \`out\` 顶就是**最早入队**的元素 —— 两次反转，方向转正。`,
          { opIdx: i },
        )
        while (inn.length > 0) {
          const x = inn.pop()
          out.push(x)
          transfers += 1
          snap(
            'transfer',
            `搬运：\`in\` 弹出 \`${x}\` → 压入 \`out\`。` +
              `此刻 \`in\` \`[${inn.join(', ')}]\`，\`out\` \`[${out.join(', ')}]\`（顶 = \`${out[out.length - 1]}\` = 队首）。` +
              `这是 \`${x}\` 一生**唯一一次**搬运。`,
            { opIdx: i, moved: x },
          )
        }
      }

      const result = out[out.length - 1]
      if (isPop) {
        out.pop()
        queueOut.push(result)
      }
      snap(
        isPop ? 'pop' : 'peek',
        `**\`${o.op}()\` → \`${result}\`**：${isPop ? `\`out\` 弹出栈顶 \`${result}\`，记入出队序列 \`[${queueOut.join(', ')}]\`` : `读 \`out\` 栈顶 \`${result}\`，**不弹出** —— 它就是队首`}。` +
          (out.length > 0
            ? ` \`out\` 还剩 \`[${out.join(', ')}]\`（顶 \`${out[out.length - 1]}\` 是下一个队首）—— ` +
              `消费只动 \`out\`，\`in\` 里新来的元素**插不了队**。`
            : ` \`out\` 空了 —— 下次 \`pop\` 再触发搬运（或队列真的空了）。`) +
          ` 单次 \`O(1)\`（搬运已提前付掉）。`,
        { opIdx: i, result },
      )
      continue
    }

    if (o.op === 'empty') {
      snap('pop', `**\`empty()\` → \`${inn.length === 0 && out.length === 0}\`**：两栈皆空即队列空。`, { opIdx: i })
      continue
    }

    snap('push', `未知操作 \`${o.op}\`，跳过。`, { opIdx: i })
  }

  const pushOrder = ops.filter((o) => o.op === 'push').map((o) => o.val).join(',')
  snap(
    'done',
    `${ops.length} 个操作走完，出队序列 \`[${queueOut.join(', ')}]\` —— 正好是入队顺序 \`${pushOrder}\`，FIFO 成立。` +
      `账本：\`${queueOut.length}\` 次 pop 总共只搬了 \`${transfers}\` 次 —— ` +
      `每个元素**一生最多被搬一次**，所以 \`n\` 次操作总花费 \`O(n)\`，**均摊 \`O(1)\`**` +
      `（单次最坏 \`O(n)\`：那一次恰好触发搬运）。` +
      `两个钉子：① 搬运必须**整摞**翻，且只在 \`out\` 空时发生；` +
      `② \`pop\`/\`peek\` 只动 \`out\` —— 旧的一摞没消费完，新的一摞绝不插队。`,
    { done: true },
  )

  return steps
}
