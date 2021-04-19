/* eslint-disable no-eval */
const { spawnSync } = require('child_process')
const { rmSync } = require('fs')
const [file, ...argv] = process.argv.slice(2)

const outfile = file.replace('.ts', '.js')

require('esbuild').build({
  platform: 'node',
  entryPoints: [file],
  bundle: true,
  outfile
})
  .then(() => {
    spawnSync('node', [outfile, ...argv], { stdio: 'inherit' })
    rmSync(outfile)
  })
