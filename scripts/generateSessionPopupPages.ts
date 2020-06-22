// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createAgendaService } from '@/services/agenda'
import { MetaDomSetterSet, MetaType, defaultMetaValues, createMetaService } from '@/services//meta'
import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import { GeneralPopupContentData } from '@/services/popup'

const zhOriginalHtmlDir = path.join(__dirname, '../dist/2020/zh-TW/agenda/')
const zhOriginalHtml = fs.readFileSync(path.join(zhOriginalHtmlDir, 'template.html')).toString()
const enOriginalHtmlDir = path.join(__dirname, '../dist/2020/en/agenda/')
const enOriginalHtml = fs.readFileSync(path.join(enOriginalHtmlDir, 'template.html')).toString()

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
  process.env.VUE_APP_PRODUCTION_ORIGIN = 'https://coscup.org'

  const agendaService = createAgendaService([
    'AU',
    'TR209', 'TR211', 'TR212', 'TR213', 'TR214',
    'TR309', 'TR313',
    'TR409-2', 'TR410', 'TR411', 'TR412-1', 'TR412-2', 'TR413-1', 'TR413-2',
    'TR510', 'TR511'
  ])

  // Force to load all sessions of days
  agendaService.days.forEach((day, index) => {
    agendaService.dayIndex = index
  })

  // load all sessions' popup data
  let datas = await Promise.all(
    Object.keys(agendaService.sessionSet)
      .map(async (sessionId) => {
        return {
          sessionId,
          popupData: await agendaService.getSessionPopupData(sessionId, 'zh')
        }
      })
  )

  datas.forEach((data) => {
    const $ = cheerio.load(zhOriginalHtml, { _useHtmlParser2: true })
    const metaService = createMetaService(createCheerioMetaDomSetterSet($))
    metaService.setMeta(data.popupData.metaOptions)
    $('#session-detail').replaceWith((data.popupData.contentData as GeneralPopupContentData).html)
    fs.writeFileSync(path.join(zhOriginalHtmlDir, `${data.sessionId}.html`), $.html())
    fs.mkdirSync(path.join(zhOriginalHtmlDir, data.sessionId))
    fs.writeFileSync(path.join(zhOriginalHtmlDir, data.sessionId, 'index.html'), $.html())
  })

  // load all sessions' popup data
  datas = await Promise.all(
    Object.keys(agendaService.sessionSet)
      .map(async (sessionId) => {
        return {
          sessionId,
          popupData: await agendaService.getSessionPopupData(sessionId, 'en')
        }
      })
  )

  datas.forEach((data) => {
    const $ = cheerio.load(enOriginalHtml, { _useHtmlParser2: true })
    const metaService = createMetaService(createCheerioMetaDomSetterSet($))
    metaService.setMeta(data.popupData.metaOptions)
    $('#session-detail').replaceWith((data.popupData.contentData as GeneralPopupContentData).html)
    fs.writeFileSync(path.join(enOriginalHtmlDir, `${data.sessionId}.html`), $.html())
    fs.mkdirSync(path.join(enOriginalHtmlDir, data.sessionId))
    fs.writeFileSync(path.join(enOriginalHtmlDir, data.sessionId, 'index.html'), $.html())
  })
}

run()
