/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs'
import path from 'path'
import SitemapGenerator from 'sitemap-generator'
import ora from 'ora'
import dotenv from 'dotenv'
import { serve } from './utils.js'
import { fileURLToPath } from 'url'
const { parsed } = dotenv.config()

const spinner = ora('Generating sitemap.xml...')

const PORT = 3001
const ORIGIN = parsed.VITE_ORIGIN
const BASE_URL = parsed.VITE_BASE_URL
const isLocal = process.argv[2] === '--local'
const sitemapPath = path.join(path.dirname(fileURLToPath(import.meta.url)), `../../${isLocal ? 'dist' : 'public'}/sitemap.xml`)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const siteUrl = isLocal ? `http://localhost:${PORT}${BASE_URL}` : `${ORIGIN}${BASE_URL}`
const generator = SitemapGenerator(siteUrl, {
  filepath: sitemapPath,
  maxEntriesPerFile: 50000,
  stripQuerystring: false,
  priorityMap: [1.0, 0.8, 0.64, 0.4, 0.2, 0],
  lastMod: true
})

async function setupGeneratorForLocal (generator) {
  let onReady = () => { throw new Error('Promise is not init') }
  const waitForServer = new Promise((resolve) => {
    onReady = resolve
  })

  const server = serve(onReady)

  generator.on('error', (error) => {
    console.log(error)
    // => { code: 404, message: 'Not found.', url: 'http://example.com/foo' }
  })

  generator.on('done', () => {
    server.close()
    const content = fs.readFileSync(sitemapPath).toString()
    fs.writeFileSync(sitemapPath, content.replace(new RegExp(`http://localhost:${PORT}`, 'g'), ORIGIN) + '\n')
    spinner.succeed('sitemap.xml generated.')
  })

  generator.on('add', (url) => {
    spinner.text = `Add ${ORIGIN}${url.split(`http://localhost:${PORT}`)[1]}`
  })

  await waitForServer
}

async function setupGeneratorForOnline (generator) {
  generator.on('error', (error) => {
    console.log(error)
    // => { code: 404, message: 'Not found.', url: 'http://example.com/foo' }
  })

  generator.on('done', () => {
    spinner.succeed('sitemap.xml generated.')
  })

  generator.on('add', (url) => {
    spinner.text = `Add ${url}`
  })
}

async function generateSitemap () {
  await (isLocal ? setupGeneratorForLocal : setupGeneratorForOnline)(generator)
  console.log(`Generate from ${isLocal ? 'local' : 'online'}`)
  spinner.start()
  generator.start()
}

generateSitemap()
