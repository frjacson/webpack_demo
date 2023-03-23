const webpackCommonConfig = require('./webpack.common.js')('development');

module.exports = {
  devServer: {
    host: "localhost",
    port: 8081,
    open: true,
    historyApiFallback: true,
    hot: true,
    compress: true,
    https: false,
    proxy: {
      '/api': 'www.baidu.com',
    },
  },
  ...webpackCommonConfig
}