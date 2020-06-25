/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const { extractSheets } = require('spreadsheet-to-json')
const token = process.env.GOOGLE_DRIVE_API_KEY

const spreadsheetKey = '19qWkvFq0l2tCpjzjVsi24t3gFj5UcoRRsdd1rE471gY'
const sheetsToExtract = ['Sponsors']

const sponsorLogoDir = path.join(__dirname, '../public/images/sponsors')

if (!token) {
  axios.get('https://coscup.org/2020/json/sponsor.json')
    .then(({ data }) => {
      console.log(JSON.stringify(data, null, 2))
    })
} else {
  extractSheets(
    {
      credentials: token,
      spreadsheetKey: spreadsheetKey,
      sheetsToExtract: sheetsToExtract
    },
    function (err, data) {
      if (err) { console.error(err) } else {
        const { Sponsors: rawSponsors } = data
        const sponsors = rawSponsors
          .filter((rawSponsor) => {
            const { level, image, 'name:en': nameEn, 'name:zh-TW': nameZh, 'intro:en': introEn, 'intro:zh-TW': introZh, canPublish } = rawSponsor
            return !!(canPublish === 'Y' && level && image && fs.existsSync(path.join(sponsorLogoDir, image)) && (nameEn || nameZh) && (introEn || introZh))
          })
          .map((rawSponsor, index) => {
            return {
              id: `sponsor-${index}`,
              level: rawSponsor.level,
              name: {
                en: rawSponsor['name:en'] || rawSponsor['name:zh-TW'],
                'zh-TW': rawSponsor['name:zh-TW'] || rawSponsor['name:en']
              },
              intro: {
                en: rawSponsor['intro:en'] || rawSponsor['intro:zh-TW'],
                'zh-TW': rawSponsor['intro:zh-TW'] || rawSponsor['intro:en']
              },
              image: rawSponsor.image,
              link: rawSponsor.link
            }
          })
        console.log(JSON.stringify(sponsors, null, 2))
      }
    }
  )
}
