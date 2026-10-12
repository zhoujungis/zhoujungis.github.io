// @vitest-environment node
// Reads the SCSS source off disk, so it needs a real Node environment — the
// jsdom environment used by the component specs externalizes node: builtins.
//
// These assertions used to live in Landing.spec.js, where the `node:fs` import
// made the whole suite fail to load (silently, since the failure was at import
// time). Relocated rather than deleted: they are the only thing guarding the
// landing surface's styles, which are easy to lose in a theme refactor.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

const globalStyles = readFileSync('src/styles/global.scss', 'utf8')

describe('global.scss', () => {
  it('keeps the dark-theme override for the landing surface', () => {
    expect(globalStyles).toContain('.page-landing')
  })

  it('allows pinch-zoom instead of blocking it (WCAG 1.4.4)', () => {
    expect(globalStyles).toContain('touch-action: pan-x pan-y pinch-zoom')
    expect(globalStyles).not.toContain('touch-action: pan-x pan-y;')
  })
})
