/**
 * restoreIpSteps.test.js — LC 93「复原 IP 地址」状态机单测。
 *
 * 交叉验证：状态机（回溯）vs 暴力三重循环选切点参考解（不同构写法）。
 * 答案结构不变量：4 段、每段 1-3 位、无前导零、≤255、字符守恒。
 */
import { describe, it, expect } from 'vitest'
import { buildRestoreIpSteps } from '../restoreIpSteps.js'

const validSeg = (seg) => {
  if (seg.length < 1 || seg.length > 3) return false
  if (seg.length > 1 && seg[0] === '0') return false
  return Number(seg) <= 255
}

const brute = (s) => {
  const res = []
  const n = s.length
  if (n < 4 || n > 12) return res
  for (let i = 1; i <= 3; i += 1) {
    for (let j = i + 1; j <= i + 3; j += 1) {
      for (let k = j + 1; k <= j + 3; k += 1) {
        if (k >= n) continue
        const a = s.slice(0, i)
        const b = s.slice(i, j)
        const c = s.slice(j, k)
        const d = s.slice(k)
        if (validSeg(a) && validSeg(b) && validSeg(c) && validSeg(d)) {
          res.push(`${a}.${b}.${c}.${d}`)
        }
      }
    }
  }
  return res
}

const CASES = [
  '25525511135',
  '0000',
  '010010',
  '1111',
  '255255255255',
  '101023',
  '111111111111',
  '25525511135255',
  '123',
  '1111111111111',
  '0279245587303',
  '999999999',
  '100100100',
]

describe('buildRestoreIpSteps — 结果正确性（与暴力枚举参考解交叉）', () => {
  for (const s of CASES) {
    it(`"${s}"`, () => {
      const steps = buildRestoreIpSteps({ s })
      const done = steps[steps.length - 1]
      expect(done.ans).toEqual(brute(s))
    })
  }
})

describe('buildRestoreIpSteps — 答案结构不变量（所有答案逐个检查）', () => {
  for (const s of CASES) {
    it(`"${s}"：4 段 / 每段 1-3 位 / 无前导零 / ≤255 / 字符守恒`, () => {
      const steps = buildRestoreIpSteps({ s })
      const done = steps[steps.length - 1]
      for (const ip of done.ans) {
        const segs = ip.split('.')
        expect(segs.length).toBe(4)
        for (const seg of segs) {
          expect(seg.length).toBeGreaterThanOrEqual(1)
          expect(seg.length).toBeLessThanOrEqual(3)
          expect(/^\d+$/.test(seg)).toBe(true)
          if (seg.length > 1) expect(seg[0]).not.toBe('0')
          expect(Number(seg)).toBeLessThanOrEqual(255)
        }
        expect(segs.join('')).toBe(s)
      }
    })
  }
})

describe('buildRestoreIpSteps — 主例帧结构', () => {
  const steps = buildRestoreIpSteps({})
  const trys = steps.filter((s) => s.phase === 'try')
  const answers = steps.filter((s) => s.phase === 'answer')

  it('主例 25 帧：init + 21 个 try + 2 个 answer + done', () => {
    expect(steps.length).toBe(25)
    expect(trys.length).toBe(21)
    expect(answers.length).toBe(2)
    expect(steps[0].phase).toBe('init')
    expect(steps[24].phase).toBe('done')
  })

  it('主例两个答案与官方一致', () => {
    expect(steps[24].ans).toEqual(['255.255.11.135', '255.255.111.35'])
  })

  it('第一段切 "2" 是「段合法但可行性剪枝」', () => {
    const f = trys[0]
    expect(f.trySeg).toBe('2')
    expect(f.verdict).toBe('length')
  })

  it('第一层只有 "25" 和 "255" 两个可行分支', () => {
    const layer1 = trys.filter((s) => s.path.length === 0)
    expect(layer1.map((s) => s.verdict)).toEqual(['length', 'ok', 'ok'])
  })

  it('前导零与超 255 的剪枝帧都出现', () => {
    const verdicts = trys.map((s) => s.verdict)
    expect(verdicts).toContain('range')
    // 主例没有前导零可剪（数字串不含 0 开头的多段），用 "010010" 单测
  })

  it('answer 帧的 path 是完整 4 段且 ans 尾部一致', () => {
    for (const a of answers) {
      expect(a.path.length).toBe(4)
      expect(a.path.join('')).toBe(a.s)
      expect(a.ans[a.ans.length - 1]).toBe(a.path.join('.'))
    }
  })

  it('done 帧带全字段', () => {
    const d = steps[24]
    expect(d.ans.length).toBe(2)
    expect(d.s).toBe('25525511135')
  })
})

describe('buildRestoreIpSteps — 本题特有易错点', () => {
  it('"010010"：前导零剪枝（"01" 非法但 "0" 合法），2 个答案', () => {
    const steps = buildRestoreIpSteps({ s: '010010' })
    const done = steps[steps.length - 1]
    expect(done.ans).toEqual(['0.10.0.10', '0.100.1.0'])
    const trys = steps.filter((s) => s.phase === 'try')
    const leadZeros = trys.filter((s) => s.verdict === 'lead-zero')
    expect(leadZeros.length).toBeGreaterThan(0)
    for (const f of leadZeros) {
      expect(f.trySeg.length).toBeGreaterThan(1)
      expect(f.trySeg[0]).toBe('0')
    }
  })

  it('"0000" → ["0.0.0.0"]：单段 "0" 合法', () => {
    const steps = buildRestoreIpSteps({ s: '0000' })
    expect(steps[steps.length - 1].ans).toEqual(['0.0.0.0'])
  })

  it('长度 < 4 或 > 12：不进搜索，直接 done', () => {
    for (const s of ['123', '1111111111111']) {
      const steps = buildRestoreIpSteps({ s })
      expect(steps.length).toBe(3) // init + try(长度剪) + done
      expect(steps[steps.length - 1].ans).toEqual([])
    }
  })

  it('"255255255255" → 恰好 1 个答案（每段都是 255）', () => {
    const steps = buildRestoreIpSteps({ s: '255255255255' })
    expect(steps[steps.length - 1].ans).toEqual(['255.255.255.255'])
  })

  it('"101023" → 5 个答案（官方例）', () => {
    const steps = buildRestoreIpSteps({ s: '101023' })
    const done = steps[steps.length - 1]
    expect(done.ans.length).toBe(5)
    expect(done.ans).toEqual(brute('101023'))
  })

  it('每帧 path 拼回前缀一致（回溯路径与 pos 同步）', () => {
    for (const s of CASES) {
      const steps = buildRestoreIpSteps({ s })
      for (const fr of steps) {
        if (fr.phase === 'try' || fr.phase === 'answer') {
          expect(fr.path.join('')).toBe(fr.s.slice(0, fr.pos))
        }
      }
    }
  })

  it('done 帧之后没有 try 帧（搜索完整结束）', () => {
    for (const s of CASES) {
      const steps = buildRestoreIpSteps({ s })
      const doneIdx = steps.findIndex((fr) => fr.phase === 'done')
      expect(doneIdx).toBe(steps.length - 1)
    }
  })
})
