import axios from 'axios'
import { company, internet, lorem } from 'faker'
import { getSheetRows, saveJSON } from './utils'

import type { CommunityRow, PartnerRow } from './types'
import type { GoogleSpreadsheet } from 'google-spreadsheet'

async function fetchRemoteCommunityData () {
  const { data } = await axios.get<unknown[]>('https://coscup.org/2023/json/community.json')
    .catch((e) => {
      console.log(e)
      return { data: [] as unknown[] }
    })
  return data
}

function transformCommunityMap (rows: CommunityRow[]) {
  return Object.fromEntries(rows
    .filter((r) => r.canPublish === 'Y')
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
        }
      }
    ]))
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

function transformData (communityRows: CommunityRow[]) {
  const communityMap = transformCommunityMap(communityRows)

  const communityData = Object.values(communityMap)
  return communityData
}

function createFakeData () {
  const communityRows: CommunityRow[] = [...Array(4).keys()].map((_, i) => ({
    id: `${String.fromCharCode(65 + i)}-${i}`,
    track: '',
    'name:en': company.companyName(),
    'name:zh-TW': company.companyName(),
    'intro:en': lorem.paragraphs(2),
    'intro:zh-TW': lorem.paragraphs(2),
    link: internet.url(),
    image: `https://picsum.photos/600/400?random=${Math.random()}`,
    canPublish: 'Y'
  }))

  return transformData(communityRows)
}

export default async function generateCommunity (doc: GoogleSpreadsheet | null, fake = false) {
  let communityData: unknown
  if (fake) {
    communityData = createFakeData()
  } else if (doc === null) {
    communityData = await fetchRemoteCommunityData()
  } else {
    const communityRow = await getSheetRows(doc, 'community')
    const partnerRow = await getSheetRows(doc, 'partner')
    communityData = {
      communities: transformData(communityRow),
      partners: Object.values(transformPartnerMap(partnerRow))
    }
  }
  saveJSON('community', communityData)
}
