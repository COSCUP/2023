import axios from 'axios'
import { faker } from '@faker-js/faker'
import { getSheetRows, saveJSON } from './utils'

import type { TopicsRow } from './types'
import type { GoogleSpreadsheet } from 'google-spreadsheet'

async function fetchRemoteTopicsData () {
  const { data } = await axios.get<unknown[]>('https://coscup.org/2023/json/topics.json')
    .catch((e) => {
      console.log(e)
      return { data: [] as unknown[] }
    })
  return data
}

function transformTopicsMap (rows: TopicsRow[]) {
  const fallbackImageId = ['education', 'career', 'martech', 'ai', 'healing', 'world', 'misc']

  return Object.fromEntries(rows
    .map((r) => [
      r.id,
      {
        id: r.id,
        image: `https://coscup.org/2023/images/community/${fallbackImageId.includes(r.id) ? 'coscup' : r.id}.png`,
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

function transformData (topicsRows: TopicsRow[]) {
  const topicsMap = transformTopicsMap(topicsRows)

  const topicsData = Object.values(topicsMap)
  return topicsData
}

function createFakeData () {
  const topicsRows: TopicsRow[] = [...Array(4).keys()].map((_, i) => ({
    id: `${String.fromCharCode(65 + i)}-${i}`,
    'name:en': faker.company.name(),
    'name:zh-TW': faker.company.name(),
    'intro:en': faker.lorem.paragraphs(2),
    'intro:zh-TW': faker.lorem.paragraphs(2),
    link: faker.internet.url(),
    image: `https://picsum.photos/600/400?random=${Math.random()}`
  }))

  return transformData(topicsRows)
}

export default async function generateTopics (doc: GoogleSpreadsheet | null, fake = false) {
  let topicsData: unknown
  if (fake) {
    topicsData = createFakeData()
  } else if (doc === null) {
    topicsData = await fetchRemoteTopicsData()
  } else {
    const topicsRow = await getSheetRows(doc, 'topics')
    topicsData = {
      tipics: transformData(topicsRow)
    }
  }
  saveJSON('topics', topicsData)
}
