/* eslint-disable camelcase */
import axios from 'axios'
import { saveJSON } from './utils'

export default async function run () {
  let data = {}
  try {
    const results = await Promise.all([axios.get('https://coscup.org/2021-static/link.json')])
    data = results[0].data
  } catch (e) {
    const { data: d } = await axios.get('https://coscup.org/2021/json/ytLink.json')
    data = d
  }
  saveJSON('ytLink', data)
  // console.log(data)
}
