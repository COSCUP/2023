// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'
import plugins from '@/utils/markdown/plugins'
import 'prismjs/components'

function createMarkdownIt () {
  const options: MarkdownIt.Options = {
    html: true,
    xhtmlOut: false,
    breaks: true,
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
    highlight (text, lang) {
      if (lang) {
        try {
          return `<pre class="code-block" data-lang="${lang}"><code>${Prism.highlight(text, Prism.languages[lang], lang)}</code></pre>`
        } catch (__) {
          return `<pre class="code-block"><code>${MarkdownIt().utils.escapeHtml(text)}</code></pre>`
        }
      }
      return `<pre class="code-block"><code>${MarkdownIt().utils.escapeHtml(text)}</code></pre>`
    }
  }
  const markdownIt = new MarkdownIt(options)
  markdownIt.use(plugins)

  return markdownIt
}

function createRenderMarkdownFunction () {
  const md = createMarkdownIt()
  return (markdownContent: string) => {
    return md.render(markdownContent)
  }
}

export default createRenderMarkdownFunction()
