// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import MarkdownIt from 'markdown-it'
import pluginSub from 'markdown-it-sub'
import pluginSup from 'markdown-it-sup'
import pluginFootnote from 'markdown-it-footnote'
import pluginDeflist from 'markdown-it-deflist'
import pluginAbbr from 'markdown-it-abbr'
import pluginEmoji from 'markdown-it-emoji'
import pluginContainer from 'markdown-it-container'
import pluginIns from 'markdown-it-ins'
import pluginMark from 'markdown-it-mark'
import pluginExternalLinks from 'markdown-it-external-links'
import pluginAnchor from 'markdown-it-anchor'
import pluginTOC from 'markdown-it-toc-done-right'
import pluginImsize from 'markdown-it-imsize'
import pluginLazyLoadImg from '@/utils/markdown/plugins/lazyLoadImg'
import { getFullUrl } from '@/utils/common'

function allPlugins (md: MarkdownIt) {
  md.use(pluginSub)
    .use(pluginSup)
    .use(pluginFootnote)
    .use(pluginDeflist)
    .use(pluginAbbr)
    .use(pluginEmoji)
    .use(pluginLazyLoadImg)
    .use(pluginImsize)
    .use(pluginContainer, 'info')
    .use(pluginContainer, 'warning')
    .use(pluginContainer, 'error')
    .use(pluginContainer, 'success')
    .use(pluginIns)
    .use(pluginMark)
    .use(pluginExternalLinks, {
      internalDomains: [getFullUrl().split('/')[2]],
      externalTarget: '_blank',
      externalRel: 'noopener noreferrer'
    })
    .use(pluginAnchor, {
      level: [1, 2, 3],
      permalink: true,
      permalinkBefore: true
    })
    .use(pluginTOC, {
      containerClass: 'toc',
      level: [1, 2, 3],
      listType: 'ul'
    })
}

export default allPlugins
