/* eslint-disable camelcase */
import axios from 'axios'
import { getSheetRows, saveJSON } from './utils'

import type { GoogleSpreadsheet } from 'google-spreadsheet'

async function fetchRemoteData () {
  const { data } = await axios.get<unknown[]>('https://coscup.org/2022/json/ytLink.json')
    .catch((e) => {
      console.log(e)
      return { data: [] as unknown[] }
    })
  return data
}

export default async function run (doc: GoogleSpreadsheet | null) {
  let data: unknown
  if (doc === null) {
    data = await fetchRemoteData()
  } else {
    const rows = await getSheetRows(doc, 'youtube')
    data = Object.fromEntries(rows.map((r) => ([
      r.room,
      /(.*?)(^|\/|v=)([a-z0-9_-]{11})(.*)?/gim.exec(r.link)?.[3] ?? null
    ])))
  }
  saveJSON('ytLink', data)
}
