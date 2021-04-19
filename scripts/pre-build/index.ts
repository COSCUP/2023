// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import generateAnnouncement from './generateAnnouncement'
import generateSession from './generateSession'
import generateSponsor from './generateSponsor'
import generateSponsorNews from './generateSponsorNews'
import generateStaff from './generateStaff'

(async () => {
  try {
    await Promise.all([
      generateAnnouncement(),
      generateSession(),
      generateSponsor(),
      generateSponsorNews(),
      generateStaff()])
  } catch (e) {
    process.exit(1)
  }
})()
