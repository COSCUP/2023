// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import { origin } from '../package.json'
import { publicPath } from '../vue.config.js'
import { generateSessions, generateSessionPopupData, fixedTimeZoneDate } from '@/services/agenda/utils'
import { availableLanguageTypes } from '@/services/language'
import { MetaDomSetterSet, defaultMetaValues, createMetaService } from '@/services/meta'
import { GeneralPopupContentData } from '@/services/popup'

declare module 'events' {
  export type Listener = (...args) => void
}

function createCheerioMetaDomSetterSet ($: cheerio.Root) {
  const cheerioMetaDomSetterSet: MetaDomSetterSet = {
    title: (value) => {
      const title: string = (value.length === 0 || value === defaultMetaValues.title)
        ? (defaultMetaValues.title)
        : (`${value} - ${defaultMetaValues.title}`)

      $('title').html(title)
      $('meta[property="og:title"]').attr('content', title)
    },
    description: (value) => {
      $('meta[name="description"]').attr('content', value)
      $('meta[property="og:description"]').attr('content', value)
    },
    ogUrl: (value) => { $('meta[property="og:url"]').attr('content', value) },
    ogImage: (value) => { $('meta[property="og:image"]').attr('content', value) },
    ogType: (value) => { $('meta[property="og:type"]').attr('content', value) },
    ogSiteName: (value) => { $('meta[property="og:site_name"]').attr('content', value) }
  }
  return cheerioMetaDomSetterSet
}

async function run () {
  process.env.VUE_APP_PRODUCTION_ORIGIN = origin
  process.env.BASE_URL = publicPath

  const rawData = await import(path.join(__dirname, '../public/json/session.json'))

  await Promise.all(availableLanguageTypes
    .map((languageType) => {
      const languageData = {
        languageType: languageType,
        languageTypeAlias: (languageType === 'zh-TW' ? 'zh' : 'en') as 'zh' | 'en',
        outputHtmlDir: path.join(__dirname, `../dist/2020/${languageType}/agenda/`),
        templateHtml: fs.readFileSync(path.join(__dirname, `../dist/2020/${languageType}/agenda/template.html`)).toString()
      }
      return languageData
    })
    .map(async (languageData) => {
      const timeZoneOffsetMinutes = -480
      const fixedTimeZone = (date: Date | string) => fixedTimeZoneDate(date, timeZoneOffsetMinutes)
      const datas = await Promise.all(
        generateSessions(rawData, fixedTimeZone)
          .map(async (session) => {
            return {
              sessionId: session.id,
              popupData: await generateSessionPopupData(session, languageData.languageTypeAlias)
            }
          })
      )

      datas.forEach((data) => {
        const $ = cheerio.load(languageData.templateHtml, { _useHtmlParser2: true })
        const metaService = createMetaService(createCheerioMetaDomSetterSet($))
        metaService.setMeta(data.popupData.metaOptions)
        $('#session-detail').replaceWith((data.popupData.contentData as GeneralPopupContentData).html)
        fs.writeFileSync(path.join(languageData.outputHtmlDir, `${data.sessionId}.html`), $.html())
        fs.mkdirSync(path.join(languageData.outputHtmlDir, data.sessionId))
        fs.writeFileSync(path.join(languageData.outputHtmlDir, data.sessionId, 'index.html'), $.html())
      })
    })
  )

  availableLanguageTypes.forEach((languageType) => {
    const outputHtmlPath = path.join(__dirname, `../dist/2020/${languageType}/agenda/`)
    const templateHtmlPath = path.join(outputHtmlPath, 'template.html')
    fs.existsSync(outputHtmlPath) && fs.rmdirSync(path.join(outputHtmlPath, '/template/'), {
      recursive: true
    })
    fs.existsSync(templateHtmlPath) && fs.unlinkSync(templateHtmlPath)
  })
}

run()
