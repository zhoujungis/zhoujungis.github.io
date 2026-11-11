const https = require('node:https')

const urls = [
  'https://blog.zhoujun.dev/photos/english-site-without-js-cover.png',
  'https://blog.zhoujun.dev/photos/sqlite-group-commit-cover.png',
  'https://blog.zhoujun.dev/photos/build-time-image-cache-cover.png',
  'https://blog.zhoujun.dev/article/english-site-without-js/',
  'https://blog.zhoujun.dev/article/sqlite-group-commit/',
  'https://blog.zhoujun.dev/article/build-time-image-cache/',
  'https://blog.zhoujun.dev/en/article/english-site-without-js/',
  'https://blog.zhoujun.dev/en/article/sqlite-group-commit/',
  'https://blog.zhoujun.dev/en/article/build-time-image-cache/',
]

function get(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let size = 0
      res.on('data', (d) => (size += d.length))
      res.on('end', () => resolve([res.statusCode, size]))
    })
    req.on('error', (e) => resolve(['ERR', e.message]))
    req.setTimeout(20000, () => {
      req.destroy()
      resolve(['TIMEOUT', 0])
    })
  })
}

;(async () => {
  for (const u of urls) {
    const [code, size] = await get(u)
    console.log(`${String(code).padEnd(8)} ${String(size).padStart(8)}  ${u}`)
  }
})()
