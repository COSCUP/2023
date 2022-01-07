import axios from 'axios'
import { company, internet, lorem } from 'faker'
import { getSheetRows, saveJSON } from './utils'

import type { SponsorLevelTuple, SponsorLevel, SponsorLevelRow, SponsorRow, SponsorNewsRow } from './types'
import type { GoogleSpreadsheet } from 'google-spreadsheet'

async function fetchRemoteSponsorData () {
  const { data } = await axios.get<unknown[]>('https://coscup.org/2022/json/sponsor.json')
    .catch((e) => {
      console.log(e)
      return { data: [] as unknown[] }
    })
  return data
}

async function fetchRemoteSponsorNewsData () {
  const { data } = await axios.get<unknown[]>('https://coscup.org/2022/json/sponsor-news.json')
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
      r.id,
      {
        id: r.id,
        level: r.level,
        image: `https://coscup.org/2022-static/images/sponsor/${r.id}.png`,
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
    .filter((r) => !!sponsorMap[r.sponsorId])
    .map((r) => ({
      id: r.newsId,
      sponsor: r.sponsorId,
      image: {
        vertical: `https://coscup.org/2022-static/images/sponsor-news/${r.sponsorId}-${r.newsId}-vertical.png`,
        horizontal: `https://coscup.org/2022-static/images/sponsor-news/${r.sponsorId}-${r.newsId}-horizontal.png`
      },
      description: r.description,
      link: r.link,
      level: sponsorMap[r.sponsorId].level,
      weight: (r.specialWeight.length === 0 || isNaN(Number(r.specialWeight)))
        ? sponsorLevelMap[sponsorMap[r.sponsorId].level].basicWeight
        : Number(r.specialWeight)
    }))
}

function transformData (sponsorLevelRows: SponsorLevelRow[], sponsorRows: SponsorRow[], sponsorNewsRows: SponsorNewsRow[]) {
  const sponsorLevelMap = transformSponsorLevelMap(sponsorLevelRows)
  const sponsorMap = transformSponsorMap(sponsorRows)
  const sponsorNews = transformSponsorNews(sponsorNewsRows, sponsorLevelMap, sponsorMap)

  const sponsorData = Object.values(sponsorMap)
  const sponsorNewsData = sponsorNews
  return [sponsorData, sponsorNewsData] as const
}

function createFakeData () {
  const sponsorLevelRows: SponsorLevelRow[] = [
    {
      level: 'titanium',
      basicWeight: '64'
    },
    {
      level: 'diamond',
      basicWeight: '32'
    },
    {
      level: 'gold',
      basicWeight: '16'
    },
    {
      level: 'silver',
      basicWeight: '8'
    },
    {
      level: 'bronze',
      basicWeight: '4'
    },
    {
      level: 'special-thanks',
      basicWeight: '2'
    },
    {
      level: 'co-organizer',
      basicWeight: '1'
    },
    {
      level: 'friend',
      basicWeight: '0'
    }
  ]
  const sponsorRows: SponsorRow[] = (() => {
    const numOfSponsorsMap: Record<SponsorLevel, number> = {
      titanium: 3,
      diamond: 5,
      gold: 8,
      silver: 4,
      bronze: 13,
      'special-thanks': 3,
      'co-organizer': 2,
      friend: 3
    }
    const sponsorRowsMap =
      Object.fromEntries((['titanium', 'diamond', 'co-organizer', 'gold', 'bronze', 'silver', 'special-thanks', 'friend'] as SponsorLevelTuple)
        .map((level) => {
          const entry: [SponsorLevel, SponsorRow[]] = [
            level as SponsorLevel,
            Array.from(Array(numOfSponsorsMap[level]), (_, i): SponsorRow => ({
              id: `${level}-${i}`,
              level,
              'name:en': company.companyName(),
              'name:zh-TW': company.companyName(),
              'intro:en': lorem.paragraphs(2),
              'intro:zh-TW': lorem.paragraphs(2),
              link: internet.url(),
              image: `https://picsum.photos/600/400?random=${Math.random()}`,
              canPublish: 'Y'
            }))
          ]
          return entry
        })
      ) as Record<SponsorLevel, SponsorRow[]>
    return Object.values(sponsorRowsMap).flat()
  })()
  const sponsorNewsRows: SponsorNewsRow[] = (() => {
    return sponsorRows
      .map((r): SponsorNewsRow => {
        return {
          sponsorId: r.id,
          newsId: lorem.word(),
          'image:vertical': `https://picsum.photos/200/800?random=${Math.random()}`,
          'image:horizontal': `https://picsum.photos/1440/400?random=${Math.random()}`,
          description: lorem.paragraph(4),
          link: internet.url(),
          specialWeight: '',
          canPublish: 'Y'
        }
      })
  })()

  return transformData(sponsorLevelRows, sponsorRows, sponsorNewsRows)
}

export default async function generateSponsor (doc: GoogleSpreadsheet | null, fake = false) {
  let sponsorData: unknown
  let sponsorNewsData: unknown
  if (fake) {
    const [d1, d2] = createFakeData()
    sponsorData = d1
    sponsorNewsData = d2
  } else if (doc === null) {
    sponsorData = await fetchRemoteSponsorData()
    sponsorNewsData = await fetchRemoteSponsorNewsData()
  } else {
    const [sponsorLevelRows, sponsorRows, sponsorNewsRows] = await Promise.all([
      getSheetRows(doc, 'sponsorLevel'),
      getSheetRows(doc, 'sponsor'),
      getSheetRows(doc, 'sponsorNews')
    ])
    const [d1, d2] = transformData(sponsorLevelRows, sponsorRows, sponsorNewsRows)
    sponsorData = d1
    sponsorNewsData = d2
  }
  saveJSON('sponsor', sponsorData)
  saveJSON('sponsor-news', sponsorNewsData)
}
