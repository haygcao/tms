// vue.config.js https://github.com/vuejs/vue-cli/blob/dev/docs/config.md
module.exports = {
  lintOnSave: true,
  baseUrl:'/',
  configureWebpack: config => {
    {
      output: {
        publicPath: './'
      }
      // assetsDir: './src/assets'
      // baseUrl:'/'
      // devtool:'source-map'
    }
  },
  // configure webpack-dev-server behavior
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8801,
    https: false,
    hotOnly: false,
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    proxy: null, // string | Object
    before: app => { }
  }
}