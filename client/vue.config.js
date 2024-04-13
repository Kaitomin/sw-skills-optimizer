module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    output: {
      filename: '[name]-[contenthash].js', 
      chunkFilename: '[name]_[contenthash].js',
    },
  }
};