// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import axios from 'axios'
import { saveJSON } from './utils'

export default async function run () {
  const { data: { data } } = await axios.get('https://volunteer.coscup.org/api/members?pid=2022')
  saveJSON('staff', data)
}
