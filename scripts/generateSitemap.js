/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const SitemapGenerator = require('sitemap-generator')
const serve = require('koa-static-server')
const app = new (require('koa'))()
const port = 3000
const origin = require('../package.json').origin
const sitemapPath = path.join(__dirname, '../dist/sitemap.xml')
const spinner = require('ora')('Generating sitemap.xml...')
let serverOnServe = () => { throw new Error('Promise is not init') }
const waitForServer = new Promise((resolve) => {
  serverOnServe = resolve
})

app.use(serve({ rootDir: path.join(__dirname, '../dist'), rootPath: '/2020' }))

const server = app.listen(port, serverOnServe)
const generator = SitemapGenerator(`http://localhost:${port}/2020/`, {
  filepath: sitemapPath,
  maxEntriesPerFile: 50000,
  stripQuerystring: false,
  priorityMap: [1.0, 0.8, 0.64, 0.4, 0.2, 0],
  lastMod: true
})

generator.on('error', (error) => {
  console.log(error)
  // => { code: 404, message: 'Not found.', url: 'http://example.com/foo' }
})

generator.on('done', () => {
  server.close()
  const content = fs.readFileSync(sitemapPath).toString()
  fs.writeFileSync(sitemapPath, content.replace(new RegExp(`http://localhost:${port}`, 'g'), origin))
  spinner.succeed('sitemap.xml generated.')
})

generator.on('add', (url) => {
  spinner.text = `Add ${origin}${url.split(`http://localhost:${port}`)[1]}`
})

waitForServer
  .then(() => {
    spinner.start()
    generator.start()
  })
