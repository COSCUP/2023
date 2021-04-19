// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import axios from 'axios'
import { saveJSON } from './utils'

export default async function run () {
  const { data } = await axios.get('https://coscup.org/2020/json/staff.json')
  saveJSON('staff', data)
}
