/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const SitemapGenerator = require('sitemap-generator')
const serve = require('koa-static-server')
const app = new (require('koa'))()
const port = 3000
const origin = require('../package.json').origin
const sitemapPath = path.join(__dirname, '../dist/sitemap.xml')

app.use(serve({ rootDir: path.join(__dirname, '../dist'), rootPath: '/2020' }))
const generator = SitemapGenerator(`http://localhost:${port}/2020/`, {
  filepath: sitemapPath,
  maxEntriesPerFile: 50000,
  stripQuerystring: false,
  piorityMap: [1.0, 0.8, 0.64, 0.4, 0.2, 0],
  lastMod: true
})

const server = app.listen(port, () => {
  generator.start()
})

generator.on('done', () => {
  server.close()
  fs.writeFileSync(sitemapPath, fs.readFileSync(sitemapPath).toString().replace(new RegExp(`http://localhost:${port}`, 'g'), origin))
})

generator.on('add', (url) => {
  console.log(`Add ${origin}${url.split(`http://localhost:${port}`)[1]}`)
})
