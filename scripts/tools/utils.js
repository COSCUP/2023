// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import path from 'path'
import dotenv from 'dotenv'
import staticServer from 'koa-static-server'
import Koa from 'koa'
import { fileURLToPath } from 'url'

export function serve (onReady = () => {}) {
  const { parsed } = dotenv.config()
  const PORT = 3001
  const BASE_URL = parsed.VITE_BASE_URL
  const app = new Koa()

  app.use(staticServer({ rootDir: path.join(path.dirname(fileURLToPath(import.meta.url)), '../../dist'), rootPath: BASE_URL }))
  const server = app.listen(PORT, () => {
    console.log(`Serve on: http://localhost:${PORT}${BASE_URL}`)
    onReady()
  })
  return server
}
