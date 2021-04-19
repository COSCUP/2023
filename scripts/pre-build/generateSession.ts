/* eslint-disable camelcase */
import axios from 'axios'
import { saveJSON } from './utils'

export default async function run () {
  const { data } = await axios.get('https://coscup.org/2020/json/session.json')
  saveJSON('session', data)
}
