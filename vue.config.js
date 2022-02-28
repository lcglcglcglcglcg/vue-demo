const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-demo/' : '/',
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,

  configureWebpack: config => {
    // 生产环境取消 console.log
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }

    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'source-map'
    }

    // 增加cesium使用loader
    config.module.rules.push(
      // OrbitControls.js库使用
      {
        test: require.resolve('three/examples/js/controls/OrbitControls'),
        use: 'imports-loader?THREE=three',
      },
      {
        test: require.resolve('three/examples/js/controls/OrbitControls'),
        use: 'exports-loader?THREE.OrbitControls',
      },
      // TextGeometry库使用
      // {
      //   test: require.resolve('three/examples/js/controls/TextGeometry'),
      //   use: 'imports-loader?THREE=three',
      // },
      // {
      //   test: require.resolve('three/examples/js/controls/TextGeometry'),
      //   use: 'exports-loader?THREE.TextGeometry',
      // },
      // CSS2DRenderer.js库使用
      {
        test: require.resolve('three/examples/js/renderers/CSS2DRenderer.js'),
        use: 'imports-loader?THREE=three',
      },
      {
        test: require.resolve('three/examples/js/renderers/CSS2DRenderer.js'),
        use: 'exports-loader?THREE.CSS2DRenderer',
      },
      // OBJLoader.js库使用
      {
        test: require.resolve('three/examples/js/loaders/OBJLoader.js'),
        use: 'imports-loader?THREE=three',
      },
      {
        test: require.resolve('three/examples/js/loaders/OBJLoader.js'),
        use: 'exports-loader?THREE.OBJLoader',
      }
    )
  },
  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src')).set('@api', resolve('src/api'))

    // 生产环境，开启js\css压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin').use(
        new CompressionPlugin({
          test: /\.js$|\.css|\.less/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: true, // 不删除源文件
        })
      )
    }

    // 配置 webpack 识别 markdown 为普通的文件
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use()
      .loader('file-loader')
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
        target: 'http://localhost:8080', // 请求本地 需要jeecg-boot后台项目
        ws: false,
        changeOrigin: true,
      },
    },
  },
}
