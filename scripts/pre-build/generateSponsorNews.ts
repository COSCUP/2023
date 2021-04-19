import axios from 'axios'
import { saveJSON } from './utils'

export default async function run () {
  const { data } = await axios.get('https://coscup.org/2020/json/sponsor-ads.json')
  saveJSON('sponsor-news', data.ads)
}
