/**
 * restoreIpSteps.js — 「复原 IP 地址」(LC 93) 分段回溯解法的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 restoreIp.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 把字符串切成 4 段 = 选 3 个切点。每段 1-3 位，所以每层最多 3 个分支、
 * 只有 4 层 —— 搜索空间天生有界（C(n-1, 3) ≤ C(11, 3) = 165）。
 * 「回溯」在这里就是**用递归写的组合枚举**，真正的设计点是剪枝分两层：
 *
 *   1. **段合法性**（切下来的这一段行不行）：前导零（"0" 合法、"01" 非法）
 *      + 数值 ≤ 255；
 *   2. **可行性**（这条路往下还走不走得通）：剩余位数必须恰好够剩余段 ——
 *      剩 segs 段时，剩余位数 ∈ [segs, segs × 3]，否则整棵子树剪掉。
 *
 * 可行性剪枝是本题效率的关键：它常在段还没验完时就整枝砍掉
 * （如 "25525511135" 的第一段切 "2"：段本身合法，但剩余 10 位装不进 3 段）。
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'try' | 'answer' | 'done'
 *   desc: string
 *   s: string, chars: string[], n
 *   path: string[]          // 已切好的段
 *   pos: number             // 下一段的起点（try/answer 帧有意义）
 *   segLen: number|null     // 本帧尝试切的位数（1-3）
 *   trySeg: string|null     // 本帧尝试的段
 *   verdict: null | 'ok' | 'answer' | 'lead-zero' | 'range' | 'length'
 *   ans: string[]           // 已收集的完整答案
 *   done: boolean
 *
 * ⚠️ 每帧 = 恰好一次「切段尝试」；answer 帧 = 第 4 段恰好用完全部剩余位。
 * 逐帧校验：path + trySeg 拼回原串前缀、verdict 与段属性互洽。
 */

const DEFAULT_S = '25525511135'

export function buildRestoreIpSteps(options = {}) {
  const s = typeof options.s === 'string' && options.s.length > 0 ? options.s : DEFAULT_S
  const chars = Array.from(s)
  const n = chars.length

  const steps = []

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      s,
      chars,
      n,
      path: [],
      pos: 0,
      segLen: null,
      trySeg: null,
      verdict: null,
      ans: [],
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `给了只含数字的串 \`${s}\`（\`${n}\` 位）。复原 IP = 切成 4 段、中间插 3 个点：` +
      `每段 1-3 位、数值 0-255、无前导零（\`"0"\` 合法、\`"01"\` 非法）。` +
      `等价于在 \`${n - 1}\` 个缝隙里选 3 个切点 —— 搜索空间天生有界（\`C(${n - 1}, 3)\`）。` +
      `回溯每层切一段：尝试切 1 / 2 / 3 位，**剪枝分两层** —— ` +
      `段合法性（前导零、\`>255\`）与可行性（剩余位数 \`[segs, segs × 3]\` 才走得通）。`,
  )

  const ans = []

  /** 一次切段尝试，返回 verdict 并产出帧。 */
  const trySegAt = (pos, segLen, path) => {
    const remainSegs = 4 - path.length
    // 切出了字符串末端
    if (pos + segLen > n) {
      return { verdict: 'length', seg: null, detail: `末尾不够切 ${segLen} 位` }
    }
    const seg = s.slice(pos, pos + segLen)
    // 层一：段合法性
    if (seg.length > 1 && seg[0] === '0') {
      return { verdict: 'lead-zero', seg, detail: `"${seg}" 有前导零（"0" 合法，"0…" 非法）` }
    }
    if (Number(seg) > 255) {
      return { verdict: 'range', seg, detail: `${seg} > 255` }
    }
    // 层二：可行性 —— 剩余位数要装得进剩余段
    const rest = n - pos - segLen
    const segs = remainSegs - 1
    if (segs > 0) {
      if (rest < segs || rest > segs * 3) {
        const why = rest < segs ? `剩余 ${rest} 位 < 剩余 ${segs} 段最少需要的 ${segs} 位` : `剩余 ${rest} 位 > 剩余 ${segs} 段最多能装 ${segs * 3} 位`
        return { verdict: 'length', seg, detail: why }
      }
      return { verdict: 'ok', seg, detail: `段合法且剩余 ${rest} 位可装进 ${segs} 段，深入` }
    }
    // 第 4 段：必须恰好用完全部剩余位
    if (rest !== 0) {
      return { verdict: 'length', seg, detail: `第 4 段切完还剩 ${rest} 位没进任何段 —— 4 段必须恰好用完全部 ${n} 位` }
    }
    return { verdict: 'answer', seg, detail: '第 4 段恰好用完全部剩余位 —— 收下一个答案' }
  }

  const dfs = (pos, path) => {
    if (path.length === 4) return
    for (const segLen of [1, 2, 3]) {
      const { verdict, seg, detail } = trySegAt(pos, segLen, path)
      const isAnswer = verdict === 'answer'
      if (isAnswer) {
        const full = [...path, seg]
        ans.push(full.join('.'))
      }
      const segsLeft = 4 - path.length
      const parts = []
      parts.push(`**切第 \`${path.length + 1}\` 段（试 ${segLen} 位）：**`)
      parts.push(seg === null ? `末尾只剩 \`${n - pos}\` 位，不够切。` : `试切 \`"${seg}"\``)
      if (verdict === 'ok') {
        parts.push(` —— ${detail}。`)
      } else if (verdict === 'answer') {
        parts.push(` —— ${detail}：**"${[...path, seg].join('.')}"**。`)
      } else if (verdict === 'length') {
        parts.push(` —— 剪：${detail}（可行性 —— 整棵子树都不可行，这条分支到此为止）。`)
      } else if (verdict === 'lead-zero') {
        parts.push(` —— 剪：${detail}。`)
      } else if (verdict === 'range') {
        parts.push(` —— 剪：${detail}。`)
      }
      if (verdict === 'ok') {
        parts.push(`回溯后继续试 ${segLen < 3 ? `切 ${segLen + 1} 位` : '下一条分支'}。`)
      }

      snap('try', parts.join(''), {
        path: path.slice(),
        pos,
        segLen,
        trySeg: seg,
        verdict,
        ans: ans.slice(),
      })

      if (verdict === 'ok') {
        dfs(pos + segLen, [...path, seg])
      } else if (verdict === 'answer') {
        snap('answer', `第 \`${ans.length}\` 个答案：**"${ans[ans.length - 1]}"**。回溯继续找。`, {
          path: [...path, seg],
          pos: pos + segLen,
          segLen,
          trySeg: seg,
          verdict: 'answer',
          ans: ans.slice(),
        })
      }
    }
  }

  if (n >= 4 && n <= 12) {
    dfs(0, [])
  } else {
    snap('try', `长度 \`${n}\` 不在 \`[4, 12]\` 内（4 段至少 4 位、至多 12 位）—— 直接无解，连搜都不用搜。`, {
      pos: 0,
      segLen: null,
      trySeg: null,
      verdict: 'length',
    })
  }

  snap(
    'done',
    ans.length > 0
      ? `搜索结束，共 **${ans.length} 个答案**：${ans.map((a) => `"${a}"`).join('、')}。` +
        `整棵树最多 3^4 = 81 条路径、只有 4 层 —— 回溯在这里是常数级的；` +
        `可行性剪枝把 "段合法但走不通" 的分支（如第一段切 \`"2"\`）在层顶就砍掉。`
      : `搜索结束，**没有答案**（长度 ${n} 无法切成 4 个合法段）。`,
    { ans: ans.slice(), done: true },
  )

  return steps
}
