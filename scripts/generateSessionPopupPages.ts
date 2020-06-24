// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import { origin } from '../package.json'
import { generateSessions, generateSessionPopupData } from '@/services/agenda'
import { availableLanguageTypes } from '@/services/language'
import { MetaDomSetterSet, MetaType, defaultMetaValues, createMetaService } from '@/services/meta'
import { GeneralPopupContentData } from '@/services/popup'

function createCheerioMetaDomSetterSet ($: CheerioStatic) {
  const cheerioMetaDomSetterSet: MetaDomSetterSet = {
    [MetaType.Title]: (value) => {
      const title: string = (value.length === 0 || value === defaultMetaValues.title)
        ? (defaultMetaValues.title)
        : (`${value} - ${defaultMetaValues.title}`)

      $('title').html(title)
      $('meta[property="og:title"]').attr('content', title)
    },
    [MetaType.Description]: (value) => {
      $('meta[name="description"]').attr('content', value)
      $('meta[property="og:description"]').attr('content', value)
    },
    [MetaType.OgUrl]: (value) => { $('meta[property="og:url"]').attr('content', value) },
    [MetaType.OgImage]: (value) => { $('meta[property="og:image"]').attr('content', value) },
    [MetaType.OgType]: (value) => { $('meta[property="og:type"]').attr('content', value) },
    [MetaType.OgSiteName]: (value) => { $('meta[property="og:site_name"]').attr('content', value) }
  }
  return cheerioMetaDomSetterSet
}

async function run () {
  process.env.VUE_APP_PRODUCTION_ORIGIN = origin

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
      const timezoneOffsetMinutes = -480
      const datas = await Promise.all(
        generateSessions(timezoneOffsetMinutes)
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
