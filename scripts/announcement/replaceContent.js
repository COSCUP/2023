/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../../src/assets/json/announcement.json')

const announcement = require(filePath)
announcement.content.en = fs.readFileSync(path.join(__dirname, './en.md')).toString()
announcement.content['zh-TW'] = fs.readFileSync(path.join(__dirname, './zh-TW.md')).toString()
fs.writeFileSync(filePath, JSON.stringify(announcement, null, 2))
