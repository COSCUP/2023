import { library } from '@fortawesome/fontawesome-svg-core'
import { faBlogger, faFacebook, faFlickr, faTwitter, faYoutube, faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faPlurk } from '../fontAwesome/ext'
import { faBullhorn, faExternalLinkAlt, faAngleLeft, faAngleRight, faBars } from '@fortawesome/free-solid-svg-icons'

export type FontAwesomeSource = 'fontAwesome'
export interface FontAwesomeIconData {
  source: FontAwesomeSource;
  name: string;
  value: [string, string];
}

library.add(faBlogger, faFacebook, faFlickr, faTwitter, faYoutube, faTelegram, faPlurk, faBullhorn, faExternalLinkAlt, faAngleLeft, faAngleRight, faBars)

export const fontAwesomeIcons: FontAwesomeIconData[] = [
  {
    source: 'fontAwesome',
    name: 'blogger',
    value: ['fab', 'blogger']
  },
  {
    source: 'fontAwesome',
    name: 'facebook',
    value: ['fab', 'facebook']
  },
  {
    source: 'fontAwesome',
    name: 'flickr',
    value: ['fab', 'flickr']
  },
  {
    source: 'fontAwesome',
    name: 'plurk',
    value: ['ext', 'plurk']
  },
  {
    source: 'fontAwesome',
    name: 'twitter',
    value: ['fab', 'twitter']
  },
  {
    source: 'fontAwesome',
    name: 'youtube',
    value: ['fab', 'youtube']
  },
  {
    source: 'fontAwesome',
    name: 'telegram',
    value: ['fab', 'telegram']
  },
  {
    source: 'fontAwesome',
    name: 'bullhorn',
    value: ['fas', 'bullhorn']
  },
  {
    source: 'fontAwesome',
    name: 'external-link-alt',
    value: ['fas', 'external-link-alt']
  },
  {
    source: 'fontAwesome',
    name: 'angle-left',
    value: ['fas', 'angle-left']
  },
  {
    source: 'fontAwesome',
    name: 'angle-right',
    value: ['fas', 'angle-right']
  },
  {
    source: 'fontAwesome',
    name: 'bars',
    value: ['fas', 'bars']
  }
]
