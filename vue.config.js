const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProduction = process.env.NODE_ENV === 'production'
const needBundleAnalysis = process.argv.includes('--analyze')

module.exports = {
  publicPath: isProduction ? '/2020/' : '/2020/',
  chainWebpack: config => {
    if (isProduction && needBundleAnalysis) {
      config.plugin('analyzer').use(new BundleAnalyzerPlugin())
    }
  }
}
