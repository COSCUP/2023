// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

module.exports = {
  serve: (onReady = () => {}) => {
    const path = require('path')
    const dotenv = require('dotenv')
    const { parsed } = dotenv.config()
    const PORT = 3001
    const BASE_URL = parsed.VITE_BASE_URL
    const app = new (require('koa'))()
    const serve = require('koa-static-server')
    app.use(serve({ rootDir: path.join(__dirname, '../../dist'), rootPath: BASE_URL }))
    const server = app.listen(PORT, () => {
      console.log(`Serve on: http://localhost:${PORT}${BASE_URL}`)
      onReady()
    })
    return server
  }
}
