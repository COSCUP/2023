// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import generateSessionPages from './generateSessionPages'

if (process.env.BUILD_SESSION === 'true') {
  generateSessionPages()
}
