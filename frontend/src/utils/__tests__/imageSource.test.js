import { describe, it, expect } from 'vitest'
import { getPictureSources } from '../imageSource.js'

describe('getPictureSources', () => {
  it('PNG 路径返回 avif/webp/fallback', () => {
    expect(getPictureSources('/photos/tibet-2026.png')).toEqual({
      avif: '/photos/tibet-2026.avif',
      webp: '/photos/tibet-2026.webp',
      fallback: '/photos/tibet-2026.png',
    })
  })

  it('JPG 路径同样工作', () => {
    expect(getPictureSources('/img/foo.jpg')).toEqual({
      avif: '/img/foo.avif',
      webp: '/img/foo.webp',
      fallback: '/img/foo.jpg',
    })
  })

  it('远程 URL 返回 null', () => {
    expect(getPictureSources('https://example.com/foo.png')).toBeNull()
  })

  it('data URL 返回 null', () => {
    expect(getPictureSources('data:image/png;base64,xxx')).toBeNull()
  })

  it('SVG 返回 null(不转码)', () => {
    expect(getPictureSources('/icon.svg')).toBeNull()
  })

  it('空字符串返回 null', () => {
    expect(getPictureSources('')).toBeNull()
    expect(getPictureSources(null)).toBeNull()
  })

  it('无扩展名路径返回 null', () => {
    expect(getPictureSources('/api/img')).toBeNull()
  })
})