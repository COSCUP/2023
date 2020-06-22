/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProduction = process.env.NODE_ENV === 'production'
const publicPath = isProduction ? '/2020/' : '/2020/'
const needBundleAnalysis = process.argv.includes('--analyze')
const gaTempHTML = fs.readFileSync(path.join(__dirname, './template/ga.html')).toString()

process.env.VUE_APP_PRODUCTION_ORIGIN = 'https://coscup.org'

const renderRoutes = (() => {
  const routes = [
    '/',
    '/agenda',
    '/agenda/template',
    '/venue',
    '/staff'
  ].map((route) => route.replace(/\/$/, ''))

  const zhRoutes = routes.map((route) => path.join(publicPath, 'zh-TW', route))
  const enRoutes = routes.map((route) => path.join(publicPath, 'en', route))

  const r1 = [...zhRoutes, ...enRoutes]
  const r2 = r1.map((route) => path.join(route, '/'))

  return [...r1, ...r2]
})()

module.exports = {
  publicPath,

  chainWebpack: config => {
    if (isProduction && needBundleAnalysis) {
      config.plugin('analyzer').use(new BundleAnalyzerPlugin())
    }
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
      }
    }
  }
}
