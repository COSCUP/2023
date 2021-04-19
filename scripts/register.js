// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
const { spawnSync } = require('child_process')
const { rmSync } = require('fs')

const [file, ...argv] = process.argv.slice(1)
const outfile = file.replace('.ts', '.js')
require('esbuild').buildSync({
  platform: 'node',
  entryPoints: [file],
  bundle: true,
  outfile
})
spawnSync('node', [outfile, ...argv], { stdio: 'inherit' })
rmSync(outfile)
process.exit(0)
