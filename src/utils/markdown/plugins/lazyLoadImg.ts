import MarkdownIt from 'markdown-it'
import Token from 'markdown-it/lib/token'

function plugin (md: MarkdownIt) {
  function applyRecursive (tokens: Token[]) {
    if (tokens.length === 0) return false
    tokens.forEach((token) => {
      if (token.type === 'image') {
        const src = token.attrGet('src') || ''
        token.attrSet('src', '/images/loading.gif')
        token.attrSet('data-src', src)
        token.attrJoin('class', 'loading')
      }
      applyRecursive(token.children || [])
    })
    return true
  }
  md.core.ruler.push('lazy_load_image', function (state) {
    return applyRecursive(state.tokens)
  })
}

export default plugin
