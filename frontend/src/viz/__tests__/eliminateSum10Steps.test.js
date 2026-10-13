/**
 * eliminateSum10Steps.test.js — 腾讯面经「相邻和为 10 消除」栈模拟状态机单测。
 *
 * 交叉验证：状态机（栈）vs 独立参考解（反复找最左可消对、删掉、从串首重扫）。
 * 逐帧钉死五条不变量：栈下标递增、len(stack) === i+1-2*pops、
 * 栈字符 === 前缀独立约化、栈内无相邻互补对、gone ∪ stack === 已处理下标。
 * 另加合流性专例：最左 / 最右 / 随机顺序三种消法必须同果。
 */
import { describe, it, expect } from 'vitest'
import { buildEliminateSum10Steps } from '../eliminateSum10Steps.js'

// ── 参考解 1：最左可消对 → 删掉 → 从串首重扫（和栈完全不同的实现）──
function refReduce(s) {
  let cur = s
  for (;;) {
    let idx = -1
    for (let i = 0; i + 1 < cur.length; i += 1) {
      if (Number(cur[i]) + Number(cur[i + 1]) === 10) {
        idx = i
        break
      }
    }
    if (idx < 0) return cur
    cur = cur.slice(0, idx) + cur.slice(idx + 2)
  }
}

// ── 参考解 2：最右优先 / 随机顺序（验证顺序无关）──
function refReducePick(s, pick, rng) {
  let cur = s
  for (;;) {
    const pairs = []
    for (let i = 0; i + 1 < cur.length; i += 1) {
      if (Number(cur[i]) + Number(cur[i + 1]) === 10) pairs.push(i)
    }
    if (pairs.length === 0) return cur
    const at = pick(pairs, rng)
    cur = cur.slice(0, at) + cur.slice(at + 2)
  }
}

const isIrreducible = (s) =>
  Array.from(s).every((ch, i) => i === 0 || Number(s[i - 1]) + Number(ch) !== 10)

// mulberry32：低位质量足够，避免 LCG 取模造成的可见偏斜
function mulberry32(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const randString = (rng, n) => Array.from({ length: n }, () => String(1 + Math.floor(rng() * 9))).join('')

const CASES = ['', '5', '55', '555', '5512', '55128921', '1289', '123456789', '0505', '19191', '999999']

const resultOf = (s) => buildEliminateSum10Steps({ s }).at(-1).result

describe('buildEliminateSum10Steps — 结果正确性（参考解交叉）', () => {
  it('手动示例：5512 -> 12、55128921 -> 21、1289 -> 空串', () => {
    expect(resultOf('5512')).toBe('12')
    expect(resultOf('55128921')).toBe('21')
    expect(resultOf('1289')).toBe('')
    expect(resultOf('0505')).toBe('0505')
  })

  it('穷举 1~9 上长度 <= 4 的全部 7381 个串', () => {
    let count = 0
    for (let n = 0; n <= 4; n += 1) {
      const total = 9 ** n
      for (let v = 0; v < total; v += 1) {
        let s = ''
        let x = v
        for (let k = 0; k < n; k += 1) {
          s = String(1 + (x % 9)) + s
          x = Math.floor(x / 9)
        }
        expect(resultOf(s), `s=${s}`).toBe(refReduce(s))
        count += 1
      }
    }
    expect(count).toBe(7381)
  })

  it('随机长串（长度 <= 80，200 条）', () => {
    const rng = mulberry32(10)
    for (let t = 0; t < 200; t += 1) {
      const s = randString(rng, Math.floor(rng() * 81))
      expect(resultOf(s), `s=${s}`).toBe(refReduce(s))
    }
  })

  it('合流性：最左 / 最右 / 随机顺序三种消法同果（200 条随机串）', () => {
    const rng = mulberry32(470)
    for (let t = 0; t < 200; t += 1) {
      const s = randString(rng, Math.floor(rng() * 41))
      const left = refReducePick(s, (p) => p[0], rng)
      const right = refReducePick(s, (p) => p[p.length - 1], rng)
      const rand = refReducePick(s, (p) => p[Math.floor(rng() * p.length)], rng)
      expect(left, `s=${s}`).toBe(right)
      expect(right, `s=${s}`).toBe(rand)
      expect(rand, `s=${s}`).toBe(resultOf(s))
    }
  })
})

describe('buildEliminateSum10Steps — 默认主例帧结构', () => {
  const steps = buildEliminateSum10Steps({})
  it('init + 8 个字符 + done = 10 帧', () => {
    expect(steps.length).toBe(10)
    expect(steps[0].phase).toBe('init')
    expect(steps.at(-1).phase).toBe('done')
    expect(steps.filter((f) => f.phase === 'push').length).toBe(5)
    expect(steps.filter((f) => f.phase === 'pop').length).toBe(3)
  })
  it('每帧 desc 的 ** 成对（markdown 安全）', () => {
    for (const f of steps) {
      expect(((f.desc.match(/\*\*/g) || []).length) % 2).toBe(0)
    }
  })
  it('done 帧给出结果与消除对数', () => {
    const last = steps.at(-1)
    expect(last.result).toBe('21')
    expect(last.pops).toBe(3)
    expect(last.stack).toEqual([6, 7])
  })
  it('pop 帧记录"被消掉的两个下标"，且其中一个正是前一帧的栈顶', () => {
    const pops = steps.filter((f) => f.phase === 'pop')
    expect(pops.map((f) => f.eliminated)).toEqual([[0, 1], [3, 4], [2, 5]])
    expect(pops.map((f) => f.topIdx)).toEqual([0, 3, 2])
  })
})

describe('buildEliminateSum10Steps — 逐帧不变量（所有用例）', () => {
  CASES.forEach((s, ci) => {
    it(`case ${ci}: ${s || '(空串)'}`, () => {
      const steps = buildEliminateSum10Steps({ s })
      const chars = steps[0].chars
      for (const f of steps) {
        // 1. 栈下标严格递增
        for (let t = 1; t < f.stack.length; t += 1) {
          expect(f.stack[t]).toBeGreaterThan(f.stack[t - 1])
        }
        if (f.i === null) continue
        // 2. 长度关系：处理了 i+1 个字符，每消一对少 2 个
        expect(f.stack.length).toBe(f.i + 1 - 2 * f.pops)
        // 3. 栈字符 === 该前缀独立约化的结果
        const prefix = chars.slice(0, f.i + 1).join('')
        expect(f.stack.map((k) => chars[k]).join('')).toBe(refReduce(prefix))
        // 4. 栈内不存在相邻互补对（不可再约）
        expect(isIrreducible(f.stack.map((k) => chars[k]).join(''))).toBe(true)
        // 5. gone ∪ stack === 已处理的下标集合
        expect(f.gone.length).toBe(2 * f.pops)
        expect([...f.gone, ...f.stack].sort((a, b) => a - b)).toEqual(
          Array.from({ length: f.i + 1 }, (_, k) => k),
        )
      }
      // gone 只增
      for (let t = 1; t < steps.length; t += 1) {
        expect(steps[t].gone.length).toBeGreaterThanOrEqual(steps[t - 1].gone.length)
      }
    })
  })
})

describe('buildEliminateSum10Steps — 跨帧一致性', () => {
  CASES.forEach((s, ci) => {
    it(`case ${ci}: push 帧栈 = 上一帧 + 新下标；pop 帧只减一`, () => {
      const steps = buildEliminateSum10Steps({ s })
      for (let t = 1; t < steps.length; t += 1) {
        const prev = steps[t - 1]
        const f = steps[t]
        if (f.phase === 'push') {
          expect(f.stack).toEqual([...prev.stack, f.i])
          expect(f.eliminated).toBeNull()
        }
        if (f.phase === 'pop') {
          expect(f.stack).toEqual(prev.stack.slice(0, -1))
          expect(f.topIdx).toBe(prev.stack[prev.stack.length - 1])
          expect(f.eliminated).toEqual([f.topIdx, f.i])
          expect(Number(f.topCh) + Number(f.ch)).toBe(10)
        }
      }
    })
  })
})

describe('buildEliminateSum10Steps — 边界与输入卫生', () => {
  it('空串：只有 init + done，结果是空串', () => {
    const steps = buildEliminateSum10Steps({ s: '' })
    expect(steps.length).toBe(2)
    expect(steps.at(-1).result).toBe('')
  })
  it('全 5：两两相消，栈深永远是 1', () => {
    const steps = buildEliminateSum10Steps({ s: '555555' })
    expect(Math.max(...steps.map((f) => f.stack.length))).toBe(1)
    expect(steps.at(-1).result).toBe('')
  })
  it('无可消对：12345678 原样留下', () => {
    expect(resultOf('12345678')).toBe('12345678')
  })
  it('非 1~9 的字符（如 0）永远不参与消除', () => {
    expect(resultOf('0505')).toBe('0505')
    expect(resultOf('55') ).toBe('')
  })
  it('不修改传入的 s', () => {
    const s = '55128921'
    buildEliminateSum10Steps({ s })
    expect(s).toBe('55128921')
  })
})
