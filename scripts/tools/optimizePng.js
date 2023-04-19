/* eslint-disable @typescript-eslint/no-var-requires */
import { promisify } from 'util'
import { execFile } from 'child_process'
import optipng from 'optipng-bin'
import find from 'find'
import path from 'path'
import ora from 'ora'
import { fileURLToPath } from 'url'

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
  const files = find.fileSync(/\.png$/, path.join(path.dirname(fileURLToPath(import.meta.url)), '../', '../'))
    .filter((file) => !['/node_modules/', '/dist/'].some((ignore) => file.includes(ignore)))

  for (const file of files) {
    await optimizeOne(file)
  }
  console.log('Done!')
}

run()
