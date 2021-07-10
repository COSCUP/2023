/* eslint-disable camelcase */
import axios from 'axios'
import md5 from 'js-md5'
import { saveJSON } from './utils'
require('dotenv').config()
const pretalxOptions = { headers: { Authorization: `Token ${process.env.PRETALX_TOKEN}` } }
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
      avatar: s.avatar || `https://www.gravatar.com/avatar/${md5(s.email)}?s=1024&d=identicon&r=g`,
      zh: {
        name: (s.answers.find((a :any) => a.question.id === 863 && a.person === s.code) || {}).answer || s.name,
        bio: (s.answers.find((a :any) => a.question.id === 866 && a.person === s.code) || {}).answer || s.biography || ''
      },
      en: {
        name: (s.answers.find((a :any) => a.question.id === 861 && a.person === s.code) || {}).answer || s.name,
        bio: (s.answers.find((a :any) => a.question.id === 862 && a.person === s.code) || {}).answer || s.biography || ''
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
        description: (s.answers.find((a :any) => a.question.id === 865) || {}).answer || s.description || ''
      },
      en: {
        title: (s.answers.find((a :any) => a.question.id === 859) || {}).answer || s.title,
        description: (s.answers.find((a :any) => a.question.id === 860) || {}).answer || (s.answers.find((a :any) => a.question.id === 865) || {}).answer || ''
      },
      speakers: s.speakers.map(ss => ss.code),
      speakerZhName: (s.answers.find((a :any) => a.question.id === 863) || {}).answer || '',
      speakerEnName: (s.answers.find((a :any) => a.question.id === 861) || {}).answer || '',
      speakerZhBio: (s.answers.find((a :any) => a.question.id === 866) || {}).answer || '',
      speakerEnBio: (s.answers.find((a :any) => a.question.id === 862) || {}).answer || '',
      speakerAvatar: (s.answers.find((a :any) => a.question.id === 977) || {}).answer_file || '',
      tags: s.answers.find(a => a.question.id === 876) !== undefined ? [s.answers.find(a => a.question.id === 876).options[0].answer.en] : [],
      co_write: s.answers.find(a => a.question.id === 550) !== undefined ? s.answers.find(a => a.question.id === 550).answer : null,
      slide: s.answers.find(a => a.question.id === 566) !== undefined ? s.answers.find(a => a.question.id === 566).answer : null,
      record: s.answers.find(a => a.question.id === 567) !== undefined ? s.answers.find(a => a.question.id === 567).answer : null
    }
  })

  return {
    sessions: resSessions,
    speakers: resSpeakers,
    session_types: resSessionTypes,
    rooms: resRooms,
    tags: resTags
  }
}

export default async function run () {
  let data = {}
  try {
    const results = await Promise.all([
      axios.get('https://pretalx.com/api/events/coscup-2021/talks/?limit=1000', pretalxOptions),
      axios.get('https://pretalx.com/api/events/coscup-2021/rooms/?limit=1000', pretalxOptions),
      axios.get('https://pretalx.com/api/events/coscup-2021/speakers/?limit=1000', pretalxOptions)
    ])
    data = genResult(results[0].data, results[1].data, results[2].data)
  } catch (e) {
    const { data: d } = await axios.get('https://coscup.org/2021/json/session.json')
    data = d
  }
  saveJSON('session', data)
}
