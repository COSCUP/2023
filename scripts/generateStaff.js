// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios')

axios.get('https://volunteer.coscup.org/api/members?pid=2020')
  .then(({ data: { data } }) => {
    console.log(JSON.stringify(data))
  })
  .catch(() => process.exit(1))
