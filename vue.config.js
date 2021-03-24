/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const languages = require(path.join(__dirname, 'languages/languages.json'))
const minify = require('html-minifier').minify

const isProduction = process.env.NODE_ENV === 'production'
const publicPath = isProduction ? '/2020/' : '/2020/'
const needBundleAnalysis = process.argv.includes('--analyze')
const gaTempHTML = minify(fs.readFileSync(path.join(__dirname, './template/ga.html')).toString())

process.env.VUE_APP_PRODUCTION_ORIGIN = require('./package.json').origin
process.env.__VUE_OPTIONS_API__ = require('./package.json').origin

const renderRoutes = (() => {
  const routes = [
    '/',
    '/agenda',
    '/agenda/template',
    '/room',
    '/venue',
    '/map',
    '/sponsor',
    '/staff'
  ].map((route) => route.replace(/\/$/, ''))

  routes.push(...routes.map((route) => `${route}/`))

  Array.from(languages)
    .map((language) => {
      return routes.map((route) => path.join(publicPath, language, route))
    })
    .forEach((languageRoutes) => {
      routes.push(...languageRoutes)
    })

  return routes
})()

module.exports = {
  publicPath,

  chainWebpack: config => {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    const { DefinePlugin } = require('webpack')
    if (isProduction && needBundleAnalysis) {
      config
        .plugin('analyzer')
        .use(new BundleAnalyzerPlugin())
    }

    config
      .plugin('defined')
      .use(DefinePlugin, [{
        __VUE_OPTIONS_API__: JSON.stringify(false),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
      }])
  },

  pluginOptions: {
    prerenderSpa: {
      renderRoutes,
      registry: undefined,
      useRenderEvent: true,
      headless: true,
      onlyProduction: true,
      postProcess: route => {
        // Auto inject GA template
        route.html = route.html
          .replace('<noscript>{{{ %GA_TEMPLATE% }}}</noscript>', gaTempHTML)
        return route
      },
      customRendererConfig: {
        async consoleHandler (route, message) {
          console.log(`\nRoute: ${route}\n`)
          // serialize my args the way I want
          const args = await message.args()
          args.forEach(async (arg) => {
            const val = await arg.jsonValue()
            // value is serializable
            if (JSON.stringify(val) !== JSON.stringify({})) console.log(val)
            // value is unserializable (or an empty oject)
            else {
              const { type, subtype, description } = arg._remoteObject
              console.log(`type: ${type}, subtype: ${subtype}, description:\n ${description}`)
            }
          })
        }
      }
    }
  }
}
