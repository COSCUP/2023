// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { readdirSync, readFileSync } from 'fs'
import { writeFile, rm, mkdir } from 'fs/promises'
import { join } from 'path'
import { generateSessionMetaOptions, generateSessionPopupContentHtml, transformRawData } from '@/modules/session/logic'
import { TIMEZONE_OFFSET, ROOM_ORDER } from '@/modules/session'
import { Locale } from '@/modules/i18n'
import sessionJSON from '@/assets/json/session.json'

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
          const content = generateSessionPopupContentHtml(session, locale as Locale)
          const result = template
            .replace('@{TEMPLATE_META_TITLE}', title ?? '')
            .replace('@{TEMPLATE_META_DESCRIPTION}', description ?? '')
            .replace('@{TEMPLATE_META_OG_URL}', ogUrl ?? '')
            .replace('@{TEMPLATE_META_OG_IMAGE}', ogImage ?? '')
            .replace('@{TEMPLATE_CONTENT_HTML}', content)
          await writeFile(output1Path, result)
          await mkdir(output2DirPath, { recursive: true })
          await writeFile(output2Path, result)
        }))
      await rm(templatePath)
    }))
}
