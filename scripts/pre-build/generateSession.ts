/* eslint-disable camelcase */
import axios from 'axios'
import md5 from 'js-md5'
import { saveJSON } from './utils'
require('dotenv').config()
const pretalxOptions = { headers: { Authorization: `Token ${process.env.PRETALX_TOKEN}`} }
function genResult (talks, rooms, speakers) {
  const resRooms = rooms.results.map(r => {
    return {
      id: r.name.en.split(' ')[0],
      zh: {
        name: r.name['zh-tw']
      },
      en: {
        name: r.name.en
      }
    }
  })

  const resSpeakers = speakers.results.map(s => {
    return {
      id: s.code,
      avatar: s.avatar || `https://www.gravatar.com/avatar/${md5(s.email)}?s=1024&d=https://coscup.org/2020/img/speaker/avatar/default.png&r=g`,
      zh: {
        name: s.name,
        bio: s.biography || ''
      },
      en: {
        name: (s.answers.find((a :any) => a.question.id === 468) || {}).answer || s.name,
        bio: (s.answers.find((a :any) => a.question.id === 469) || {}).answer || s.biography || ''
      }
    }
  })

  const tracks = talks.results.map(s => s.track).filter((t, i, s) => i === s.findIndex(tt => tt['zh-tw'] === t['zh-tw'] && tt.en === t.en))
  const resSessionTypes = tracks.map(t => {
    return {
      id: Math.random().toString(36).substring(2, 8),
      zh: {
        name: t['zh-tw'] || t.en
      },
      en: {
        name: t.en || t['zh-tw']
      }
    }
  })

  const resTags = [
    {
      id: 'Beginner',
      zh: {
        name: '入門'
      },
      en: {
        name: 'Beginner'
      }
    },
    {
      id: 'Skilled',
      zh: {
        name: '中階'
      },
      en: {
        name: 'Skilled'
      }
    },
    {
      id: 'Advance',
      zh: {
        name: '進階'
      },
      en: {
        name: 'Advance'
      }
    }
  ]

  const resSessions = talks.results.map((s :any) => {
    return {
      id: s.code,
      type: resSessionTypes.find((t :any) => s.track['zh-tw'] === t.zh.name || s.track.en === t.en.name).id,
      room: s.slot.room.en.split(' ')[0],
      start: s.slot.start,
      end: s.slot.end,
      language: s.content_locale === 'zh-tw' ? '漢語' : 'English',
      zh: {
        title: s.title,
        description: s.abstract + '\n\n---\n\n' + s.description
      },
      en: {
        title: (s.answers.find((a :any) => a.question.id === 465) || {}).answer || s.title,
        description: ((s.answers.find((a :any) => a.question.id === 466) || {}).answer || s.abstract) +
          '\n\n---\n\n' + ((s.answers.find((a :any) => a.question.id === 467) || {}).answer || s.description)
      },
      speakers: s.speakers.map(ss => ss.code),
      tags: s.answers.find(a => a.question.id === 413) !== undefined ? [s.answers.find(a => a.question.id === 413).options[0].answer.en] : [],
      co_write: s.answers.find(a => a.question.id === 550) !== undefined ? s.answers.find(a => a.question.id === 550).answer : null,
      slide: s.answers.find(a => a.question.id === 566) !== undefined ? s.answers.find(a => a.question.id === 566).answer : null,
      record: s.answers.find(a => a.question.id === 567) !== undefined ? s.answers.find(a => a.question.id === 567).answer : null
    }
  })
  let data = JSON.stringify({
    sessions: resSessions,
    speakers: resSpeakers,
    // eslint-disable-next-line @typescript-eslint/camelcase
    session_types: resSessionTypes,
    rooms: resRooms,
    tags: resTags
  })
  console.log(data)
  saveJSON('session', {
    sessions: resSessions,
    speakers: resSpeakers,
    // eslint-disable-next-line @typescript-eslint/camelcase
    session_types: resSessionTypes,
    rooms: resRooms,
    tags: resTags
  })
}

export default async function run () {
  Promise.all([
    axios.get('https://pretalx.com/api/events/coscup-2021/talks/?limit=1000', pretalxOptions),
    axios.get('https://pretalx.com/api/events/coscup-2021/rooms/?limit=1000', pretalxOptions),
    axios.get('https://pretalx.com/api/events/coscup-2021/speakers/?limit=1000', pretalxOptions)
  ])
    .then(results => {
      genResult(results[0].data, results[1].data, results[2].data)
    })
}
