const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')
const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'
const CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  outputDir: 'dist',
  // publicPath: process.env.NODE_ENV === 'production' ? '/vue-demo' : '/',
  publicPath: './',
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  // productionSourceMap: false,

  configureWebpack: (config) => {
    // 生产环境取消 console.log
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true

      const plugins = []
      plugins.push(new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]))
      plugins.push(new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]))
      plugins.push(new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]))
      plugins.push(new webpack.DefinePlugin({ CESIUM_BASE_URL: JSON.stringify('./') }))
      config.plugins = [...config.plugins, ...plugins]
    }

    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'source-map'
    }

    // 增加three工具使用
    // config.module.rules.push()
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@$', resolve('src')).set('@api', resolve('src/api'))

    // 生产环境，开启js\css压缩  需要开启服务器gzip配置
    if (process.env.NODE_ENV === 'production') {
      // config.plugin('compressionPlugin').use(
      //   new CompressionPlugin({
      //     test: /\.js$|\.css|\.less/, // 匹配文件名
      //     threshold: 10240, // 对超过10k的数据压缩
      //     deleteOriginalAssets: true, // 不删除源文件
      //   })
      // )
    }

    // 配置 webpack 识别 markdown 为普通的文件
    config.module.rule('markdown').test(/\.md$/).use().loader('file-loader').end()

    //  webpack 配置 cesium
    config.module.rule('cesium').test(/.js$/).use().loader('@open-wc/webpack-import-meta-loader').end()

    config.module
      .rule('expose2')
      .test(/\.geojson$/)
      .use()
      .loader('json-loader')
      .end()
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */
          'primary-color': '#1890FF',
          'link-color': '#1890FF',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      },
    },
  },

  devServer: {
    port: 4010,
    proxy: {
      '/jeecg-boot': {
        target: 'http://d1.weather.com.cn/newwebgis/radar', // 请求本地 需要jeecg-boot后台项目
        ws: false,
        changeOrigin: true,
      },
    },
  },
}
