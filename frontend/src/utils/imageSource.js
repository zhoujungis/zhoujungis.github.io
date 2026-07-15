/**
 * imageSource.js — 把图片 URL 转成多源 srcset 给 <picture> 标签使用。
 *
 * 例:
 *   getPictureSources('/photos/tibet-2026.png')
 *   => { avif: '/photos/tibet-2026.avif', webp: '/photos/tibet-2026.webp', fallback: '/photos/tibet-2026.png' }
 *
 * 约定:同 basename 换扩展名,产物与压缩脚本的输出一一对应。
 */
export function getPictureSources(originalUrl) {
  if (!originalUrl) return null
  // 跳过 data URL、远程 URL(无法预生成 .avif/.webp)
  if (originalUrl.startsWith('data:')) return null
  if (/^https?:\/\//.test(originalUrl)) return null

  const dotIdx = originalUrl.lastIndexOf('.')
  if (dotIdx < 0) return null
  const base = originalUrl.slice(0, dotIdx)
  const ext = originalUrl.slice(dotIdx).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null

  return {
    avif: `${base}.avif`,
    webp: `${base}.webp`,
    fallback: originalUrl,
  }
}