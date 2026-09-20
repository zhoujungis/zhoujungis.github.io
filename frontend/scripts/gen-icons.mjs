// gen-icons.mjs — Rasterize the brand favicon.svg into the PWA / touch icon set.
//
// Usage: node scripts/gen-icons.mjs   (run from frontend/, after editing public/favicon.svg)
//
// Outputs (all to public/icons/):
//   icon-192.png           — green circle on transparent, 192x192
//   icon-512.png           — green circle on transparent, 512x512
//   apple-touch-icon.png   — full-bleed green square (iOS fills transparency with black), 180x180
//   icon-maskable-512.png  — full-bleed green square, letter shrunk into the 80% safe zone, 512x512

import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(here, '../public/icons')

const letterPath = `M15 12 H27 A6 6 0 0 1 27 24 H15 Z M27 14.8 A3.2 3.2 0 1 0 27 21.2 A3.2 3.2 0 1 0 27 14.8 Z M15 24 H27.5 A6 6 0 0 1 27.5 36 H15 Z M27.5 26.6 A3.4 3.4 0 1 0 27.5 33.4 A3.4 3.4 0 1 0 27.5 26.6 Z`

// Circle version — same geometry as public/favicon.svg (48x48 grid).
const circleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="24" fill="#3f6b57"/>
  <path fill="#ffffff" fill-rule="evenodd" d="${letterPath}"/>
</svg>`

// Full-bleed square version. `scale` shrinks the letter artwork into the
// maskable safe zone (inner 80% of the canvas) when needed.
const squareSvg = (scale = 1) => {
  const s = 48 * scale
  const t = (48 - s) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" fill="#3f6b57"/>
  <g transform="translate(${t} ${t}) scale(${scale})">
    <path fill="#ffffff" fill-rule="evenodd" d="${letterPath}"/>
  </g>
</svg>`
}

const jobs = [
  { svg: () => circleSvg, file: 'icon-192.png', size: 192 },
  { svg: () => circleSvg, file: 'icon-512.png', size: 512 },
  { svg: () => squareSvg(1), file: 'apple-touch-icon.png', size: 180 },
  { svg: () => squareSvg(0.62), file: 'icon-maskable-512.png', size: 512 },
]

for (const { svg, file, size } of jobs) {
  await sharp(Buffer.from(svg()), { density: 300 })
    .resize(size, size)
    .png()
    .toFile(path.join(outDir, file))
  console.log(`generated ${file} (${size}x${size})`)
}
