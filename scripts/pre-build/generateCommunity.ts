import axios from 'axios'
import { faker } from '@faker-js/faker'
import { getSheetRows, saveJSON } from './utils'

import type { CommunityRow, PartnerRow, BoothsRow, TopicsRow } from './types'
import type { GoogleSpreadsheet } from 'google-spreadsheet'

async function fetchRemoteCommunityData () {
  const { data } = await axios.get<unknown[]>('https://coscup.org/2023/json/community.json')
    .catch((e) => {
      console.log(e)
      return { data: [] as unknown[] }
    })
  return data
}

function transformPartnerMap (rows: PartnerRow[]) {
  return Object.fromEntries(rows
    .map((r) => [
      r.name,
      {
        name: r.name,
        email_hash: r.email_hash
      }
    ]))
}

function transformData (communityRows: CommunityRow[], topicsRows: TopicsRow[], boothsRows: BoothsRow[]) {
  return Object.fromEntries(communityRows
    .map((r) => [
      r.id,
      {
        id: r.id,
        track: r.track,
        image: `https://coscup.org/2023/images/community/${r.id}.png`,
        link: r.link,
        name: {
          en: r['name:en'],
          'zh-TW': r['name:zh-TW']
        },
        intro: {
          en: r['intro:en'],
          'zh-TW': r['intro:zh-TW']
        },
        topics: topicsRows
          .filter(value => value.community_id === r.id)
          .map(row => ({
            name: {
              en: row['name:en'],
              'zh-TW': row['name:zh-TW']
            },
            intro: {
              en: row['intro:en'],
              'zh-TW': row['intro:zh-TW']
            },
            link: row.link
          })),
        booths: boothsRows
          .filter(value => value.id === r.id)
          .map(row => ({
            name: {
              en: row['name:en'],
              'zh-TW': row['name:zh-TW']
            },
            intro: {
              en: row['intro:en'],
              'zh-TW': row['intro:zh-TW']
            },
            link: row.link
          }))
      }
    ]))
}

export default async function generateCommunity (doc: GoogleSpreadsheet | null, fake = false) {
  let communityData: unknown
  if (fake) {
    // communityData = createFakeData()
  } else if (doc === null) {
    communityData = await fetchRemoteCommunityData()
  } else {
    const communityRow = await getSheetRows(doc, 'community')
    const partnerRow = await getSheetRows(doc, 'partner')
    const boothsRow = await getSheetRows(doc, 'booths')
    const topicsRow = await getSheetRows(doc, 'topics')
    communityData = {
      communities: Object.values(transformData(communityRow, topicsRow, boothsRow)),
      partners: Object.values(transformPartnerMap(partnerRow))
    }
  }
  saveJSON('community', communityData)
}
