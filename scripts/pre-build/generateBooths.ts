import axios from 'axios'
import { faker } from '@faker-js/faker'
import { getSheetRows, saveJSON } from './utils'

import type { BoothsRow } from './types'
import type { GoogleSpreadsheet } from 'google-spreadsheet'

async function fetchRemoteBoothsData () {
  const { data } = await axios.get<unknown[]>('https://coscup.org/2023/json/booths.json')
    .catch((e) => {
      console.log(e)
      return { data: [] as unknown[] }
    })
  return data
}

function transformBoothsMap (rows: BoothsRow[]) {
  return Object.fromEntries(rows
    .map((r) => [
      r.id,
      {
        id: r.id,
        community: r.community,
        image: r.image,
        link: r.link,
        name: {
          en: r['name:en'],
          'zh-TW': r['name:zh-TW']
        },
        intro: {
          en: r['intro:en'],
          'zh-TW': r['intro:zh-TW']
        }
      }
    ]))
}

function transformData (boothsRows: BoothsRow[]) {
  const boothsMap = transformBoothsMap(boothsRows)

  const boothsData = Object.values(boothsMap)
  return boothsData
}

function createFakeData () {
  const boothsRows: BoothsRow[] = [...Array(4).keys()].map((_, i) => ({
    id: `${String.fromCharCode(65 + i)}-${i}`,
    'name:en': faker.company.name(),
    'name:zh-TW': faker.company.name(),
    'intro:en': faker.lorem.paragraphs(2),
    'intro:zh-TW': faker.lorem.paragraphs(2),
    link: faker.internet.url(),
    image: `https://picsum.photos/600/400?random=${Math.random()}`,
    community: faker.company.name()
  }))

  return transformData(boothsRows)
}

export default async function generateBooths (doc: GoogleSpreadsheet | null, fake = false) {
  let boothsData: unknown
  if (fake) {
    boothsData = createFakeData()
  } else if (doc === null) {
    boothsData = await fetchRemoteBoothsData()
  } else {
    const boothsRow = await getSheetRows(doc, 'booths')
    boothsData = {
      booths: transformData(boothsRow)
    }
  }
  saveJSON('booths', boothsData)
}
