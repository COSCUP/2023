/* eslint-disable @typescript-eslint/no-var-requires */
const { promisify } = require('util')
const { execFile } = require('child_process')
const optipng = require('optipng-bin')
const find = require('find')
const path = require('path')

const execFileP = promisify(execFile)

async function run () {
  const files = find.fileSync(/\.png$/, path.join(__dirname, '..'))
    .filter((file) => !file.includes('node_modules'))
  await Promise.all(files.map(async (file) => {
    const spinner = require('ora')(`Optimizing PNG: ${file}...`)
    try {
      await execFileP(optipng)
      spinner.succeed(`Optimized PNG: ${file}!`)
    } catch (_) {
      spinner.fail(`Error when optimizing PNG: ${file}`)
    }
  }))
  console.log('Done!')
}

run()
