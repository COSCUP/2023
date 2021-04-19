// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { join } from 'path'
import copy from 'recursive-copy'

(async () => {
  await copy(
    join(__dirname, '../../dist/zh-TW/'),
    join(__dirname, '../../dist/'),
    {
      overwrite: true
    }
  )
})()
