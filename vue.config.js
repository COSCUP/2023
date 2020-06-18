/* eslint-disable @typescript-eslint/no-var-requires */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProduction = process.env.NODE_ENV === 'production'
const needBundleAnalysis = process.argv.includes('--analyze')

process.env.VUE_APP_PRODUCTION_ORIGIN = 'https://coscup.org'

module.exports = {
  publicPath: isProduction ? '/2020/' : '/2020/',

  chainWebpack: config => {
    if (isProduction && needBundleAnalysis) {
      config.plugin('analyzer').use(new BundleAnalyzerPlugin())
    }
  },

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/2020/'
      ],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true
    }
  }
}
