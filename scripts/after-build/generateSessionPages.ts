// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { readdirSync, readFileSync } from 'fs'
import { writeFile, rm, mkdir } from 'fs/promises'
import { join } from 'path'
import { generateSessionMetaOptions, generateSessionPopupContentHtml, transformRawData, TIMEZONE_OFFSET, ROOM_ORDER } from '@/modules/session/logic'

import { Locale } from '@/modules/i18n'
import sessionJSON from '@/assets/json/session.json'
import communityData from '@/assets/json/community.json'
import { Session } from '@/modules/session/types'

function getCommunityFromSession (session: Session) {
  return communityData.communities.find((c) => c.track === session.type['zh-TW'].name)
}

export default async function run () {
  const { sessionsMap } = transformRawData(sessionJSON, TIMEZONE_OFFSET, ROOM_ORDER)
  await Promise.all(Array.from(readdirSync(join(__dirname, '../../locales/')))
    .map(async (locale) => {
      const templatePath = join(__dirname, `../../dist/${locale}/session/template.html`)
      const template = readFileSync(templatePath).toString()
      await Promise.all(Object.entries(sessionsMap)
        .map(async ([sessionId, session]) => {
          const output1Path = join(__dirname, `../../dist/${locale}/session/${sessionId}.html`)
          const output2DirPath = join(__dirname, `../../dist/${locale}/session/${sessionId}`)
          const output2Path = join(output2DirPath, 'index.html')

          const { title, description, ogUrl, ogImage } = generateSessionMetaOptions(session, locale as Locale)
          const content = generateSessionPopupContentHtml(session, getCommunityFromSession(session), locale as Locale)
          const result = template
            .replace(/@{TEMPLATE_META_TITLE}/g, title ?? '')
            .replace(/@{TEMPLATE_META_DESCRIPTION}/g, description ?? '')
            .replace(/@{TEMPLATE_META_OG_URL}/g, ogUrl ?? '')
            .replace(/@{TEMPLATE_META_OG_IMAGE}/g, ogImage ?? '')
            .replace(/@{TEMPLATE_CONTENT_HTML}/g, content)
          await writeFile(output1Path, result)
          await mkdir(output2DirPath, { recursive: true })
          await writeFile(output2Path, result, {
            encoding: 'utf-8'
          })
        }))
      await rm(templatePath)
    }))
}
