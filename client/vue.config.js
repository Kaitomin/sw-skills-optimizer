module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    output: {
      path: '/',
      filename: '[name]-[contenthash].js', 
      chunkFilename: '[name]_[contenthash].js',
    },
  }
};