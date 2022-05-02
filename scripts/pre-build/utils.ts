// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { writeFileSync, mkdirSync } from 'fs'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { join } from 'path'
import dotenv from 'dotenv'

import type { SheetName, SheetIdMap, SheetRow } from './types'

export function saveJSON (name: string, data: any) {
  mkdirSync(join(__dirname, '../../public/json/'), { recursive: true })
  writeFileSync(join(__dirname, `../../public/json/${name}.json`), JSON.stringify(data))
  mkdirSync(join(__dirname, '../../src/assets/json/'), { recursive: true })
  writeFileSync(join(__dirname, `../../src/assets/json/${name}.json`), JSON.stringify(data))
}

export async function getLoadedSpreadsheetDocument () {
  dotenv.config({ path: join(__dirname, '../../.env.local') })
  const API_KEY = process.env.SPREADSHEET_API_KEY

  if (!API_KEY) return null

  const SPREADSHEET_ID = '1DNPNGq8N6XimfuLEjv2Qzue4IiCD0kKfPvBJbr2CItY'
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
  doc.useApiKey(API_KEY)
  try {
    await doc.loadInfo()
    return doc
  } catch (e) {
    console.log(e)
    return null
  }
}

export async function getSheetRows<N extends SheetName> (doc: GoogleSpreadsheet, sheetName: N) {
  const sheetIdMap: SheetIdMap = {
    announcement: '0',
    sponsor: '178607707',
    sponsorNews: '1344636990',
    sponsorLevel: '748123789',
    youtube: '2044734677'
  }

  const sheetId = sheetIdMap[sheetName]
  const sheet = doc.sheetsById[sheetId]
  const rows = await sheet.getRows() as unknown as SheetRow<typeof sheetName>[]
  return rows
}
