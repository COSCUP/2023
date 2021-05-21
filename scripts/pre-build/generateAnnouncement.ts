// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// import axios from 'axios'
import { getSheetRows, saveJSON } from './utils'
import axios from 'axios'

import type { GoogleSpreadsheet } from 'google-spreadsheet'

async function fetchRemoteData () {
  const { data } = await axios.get<unknown[]>('https://coscup.org/2021/json/announcement.json')
    .catch((e) => {
      console.log(e)
      return { data: [] as unknown[] }
    })
  return data
}

export default async function generateAnnouncement (doc: GoogleSpreadsheet | null) {
  let data: unknown[]
  if (doc === null) {
    data = await fetchRemoteData()
  } else {
    const rows = await getSheetRows(doc, 'announcement')
    data = rows.map((r) => ({
      uuid: r.uuid,
      meta: {
        title: {
          en: r['meta:title:en'],
          'zh-TW': r['meta:title:zh-TW']
        },
        description: {
          en: r['meta:description:en'],
          'zh-TW': r['meta:description:zh-TW']
        }
      },
      content: {
        en: r['content:en'],
        'zh-TW': r['content:zh-TW']
      }
    }))
  }
  saveJSON('announcement', data)
}
