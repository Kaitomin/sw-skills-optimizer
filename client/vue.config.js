const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  productionSourceMap: false,
  configureWebpack: {
    output: {
      filename: '[name]-[contenthash].js', 
      chunkFilename: '[name]_[contenthash].js',
    },
  },
  publicPath: '/'
})