import axios from 'axios'
import { getSheetRows, saveJSON } from './utils'

import type { SponsorLevel, SponsorLevelRow, SponsorRow, SponsorNewsRow } from './types'
import type { GoogleSpreadsheet } from 'google-spreadsheet'

async function fetchRemoteSponsorData () {
  const { data } = await axios.get<unknown[]>('https://coscup.org/2021/json/sponsor.json')
    .catch((e) => {
      console.log(e)
      return { data: [] as unknown[] }
    })
  return data
}

async function fetchRemoteSponsorNewsData () {
  const { data } = await axios.get<unknown[]>('https://coscup.org/2021/json/sponsor-news.json')
    .catch((e) => {
      console.log(e)
      return { data: [] as unknown[] }
    })
  return data
}

function transformSponsorLevelMap (rows: SponsorLevelRow[]) {
  return Object.fromEntries(rows.map((r) => ([
    r.level,
    {
      level: r.level,
      basicWeight: Number(r.basicWeight)
    }
  ]))) as Record<SponsorLevel, { level: SponsorLevel; basicWeight: number; }>
}

function transformSponsorMap (rows: SponsorRow[]) {
  return Object.fromEntries(rows
    .filter((r) => r.canPublish === 'Y')
    .map((r) => [
      r.sponsor,
      {
        id: r.sponsor,
        level: r.level,
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

function transformSponsorNews (rows: SponsorNewsRow[], sponsorLevelMap: ReturnType<typeof transformSponsorLevelMap>, sponsorMap: ReturnType<typeof transformSponsorMap>) {
  return rows
    .filter((r) => r.canPublish === 'Y')
    .filter((r) => !!sponsorMap[r.sponsor])
    .map((r) => ({
      sponsor: r.sponsor,
      image: r.image,
      description: r.description,
      link: r.link,
      weight: (r.specialWeight.length === 0 || isNaN(Number(r.specialWeight)))
        ? sponsorLevelMap[sponsorMap[r.sponsor].level].basicWeight
        : Number(r.specialWeight)
    }))
}

export default async function generateSponsor (doc: GoogleSpreadsheet | null) {
  let sponsorData: unknown
  let sponsorNewsData: unknown
  if (doc === null) {
    sponsorData = await fetchRemoteSponsorData()
    sponsorNewsData = await fetchRemoteSponsorNewsData()
  } else {
    const [sponsorLevelRows, sponsorRows, sponsorNewsRows] = await Promise.all([
      getSheetRows(doc, 'sponsorLevel'),
      getSheetRows(doc, 'sponsor'),
      getSheetRows(doc, 'sponsorNews')
    ])
    const sponsorLevelMap = transformSponsorLevelMap(sponsorLevelRows)
    const sponsorMap = transformSponsorMap(sponsorRows)
    const sponsorNews = transformSponsorNews(sponsorNewsRows, sponsorLevelMap, sponsorMap)

    sponsorData = Object.values(sponsorMap)
    sponsorNewsData = sponsorNews
  }
  saveJSON('sponsor', sponsorData)
  saveJSON('sponsor-news', sponsorNewsData)
}
