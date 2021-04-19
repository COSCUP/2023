// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import axios from 'axios'
import { saveJSON } from './utils'

export default async function run () {
  const { data } = await axios.get('https://raw.githubusercontent.com/COSCUP/2020/master/src/assets/json/announcement.json')
  saveJSON('announcement', data)
}
