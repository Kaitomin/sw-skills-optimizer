module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    output: {
      output: '/',
      filename: '[name]-[contenthash].js', 
      chunkFilename: '[name]_[contenthash].js',
    },
  }
};