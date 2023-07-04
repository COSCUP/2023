// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { writeFileSync, mkdirSync } from 'fs'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { join, dirname } from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

import type { SheetName, SheetIdMap, SheetRow } from './types'

export function saveJSON (name: string, data: any) {
  mkdirSync(join(dirname(fileURLToPath(import.meta.url)), '../../public/json/'), { recursive: true })
  writeFileSync(join(dirname(fileURLToPath(import.meta.url)), `../../public/json/${name}.json`), JSON.stringify(data))
  mkdirSync(join(dirname(fileURLToPath(import.meta.url)), '../../src/assets/json/'), { recursive: true })
  writeFileSync(join(dirname(fileURLToPath(import.meta.url)), `../../src/assets/json/${name}.json`), JSON.stringify(data))
}

export async function getLoadedSpreadsheetDocument () {
  dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../../.env.local') })
  const API_KEY = process.env.SPREADSHEET_API_KEY

  if (!API_KEY) return null

  const SPREADSHEET_ID = '1mioOkTnkXUCuMqQN_07Q-ebB_wHxSGrsozMNTSJfby4'
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
    youtube: '2044734677',
    community: '630267390',
    partner: '1143151750',
    topics: '1543410901',
    booths: '784303307'
  }

  const sheetId = sheetIdMap[sheetName]
  const sheet = doc.sheetsById[sheetId]
  const rows = await sheet.getRows() as unknown as SheetRow<typeof sheetName>[]
  return rows
}
