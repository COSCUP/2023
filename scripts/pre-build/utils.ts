// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export function saveJSON (name: string, data: any) {
  mkdirSync(join(__dirname, '../../public/json/'), { recursive: true })
  writeFileSync(join(__dirname, `../../public/json/${name}.json`), JSON.stringify(data))
  mkdirSync(join(__dirname, '../../src/assets/json/'), { recursive: true })
  writeFileSync(join(__dirname, `../../src/assets/json/${name}.json`), JSON.stringify(data))
}
