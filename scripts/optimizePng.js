/* eslint-disable @typescript-eslint/no-var-requires */
const { promisify } = require('util')
const { execFile } = require('child_process')
const optipng = require('optipng-bin')
const find = require('find')
const path = require('path')
const ora = require('ora')

const execFileP = promisify(execFile)

const optimizeOne = async (file) => {
  const spinner = ora(`Optimizing PNG: ${file}...`).start()
  const { stderr } = await execFileP(optipng, ['-o9', file])

  if (stderr && !['already optimized'].some((reason) => stderr.includes(reason))) {
    spinner.fail(`Error when optimizing PNG: ${file}`)
    console.log(stderr)
  } else {
    spinner.succeed(`Optimized PNG: ${file}!`)
  }
}

// const delay = () => new Promise(resolve => setTimeout(resolve, 300))

async function run () {
  const files = find.fileSync(/\.png$/, path.join(__dirname, '..'))
    .filter((file) => !['/node_modules/', '/dist/'].some((ignore) => file.includes(ignore)))

  for (const file of files) {
    await optimizeOne(file)
  }
  console.log('Done!')
}

run()
