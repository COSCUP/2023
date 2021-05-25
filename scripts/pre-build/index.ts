// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import ora from 'ora'
import { getLoadedSpreadsheetDocument } from './utils'
import generateAnnouncement from './generateAnnouncement'
import generateSponsor from './generateSponsor'
import generateSession from './generateSession'
import generateStaff from './generateStaff'

(async () => {
  const spinner = ora('Strart pre-building...').start()
  try {
    const doc = await getLoadedSpreadsheetDocument()
    await Promise.all([
      generateAnnouncement(doc),
      generateSponsor(doc, true),
      generateSession(),
      generateStaff()
    ])
    spinner.succeed('Done!')
  } catch (e) {
    console.log(e)
    spinner.fail('Failed!')
  }
})()
