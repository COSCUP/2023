// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { dirname, join } from 'path'
import copy from 'recursive-copy'
import { fileURLToPath } from 'url'

(async () => {
  await copy(
    join(dirname(fileURLToPath(import.meta.url)), '../../dist/zh-TW/'),
    join(dirname(fileURLToPath(import.meta.url)), '../../dist/'),
    {
      overwrite: true
    }
  )
  await copy(
    join(dirname(fileURLToPath(import.meta.url)), '../../dist/index.html'),
    join(dirname(fileURLToPath(import.meta.url)), '../../dist/404.html'),
    {
      overwrite: true
    }
  )
})()
