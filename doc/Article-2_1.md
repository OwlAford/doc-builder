# 本地开发配置详解

### 指令分析
  查看package.json里面的script字段
```javascript
"scripts": {
  "dev": "gulp dev",
  "start": "gulp dev",
  "build": "gulp build",
  "clean:npm": "rimraf node_modules",
  "dist-server": "gulp dist-server",
  "lint": "eslint --ext .js,.vue src test/unit/specs"
}
```
  运行```npm run dev```的时候执行的是```gulp dev```,打开gulpfile.js文件，如下：
```javascript
gulp.task('dev', () => {
  require('./bin/dev-server')
})

gulp.task('build', () => {
  require('./bin/production')
})
```
  可以从上图知道dev任务执行的是bin/dev-server文件

### dev-server.js文件分析
  该文件主要完成以下事件：
  1. 检查node和npm的版本
  2. 创建express服务器
  3. 配置开发中间件（webpack-dev-middleware）和热加载中间件（webpack-hot-middleware）
  4. 挂载代理服务器和中间件
  5. 配置静态资源
  6. 启动服务器监听端口
  7. 自动打开浏览器并打开运行地址

```javascript
//检查node和npm版本
require('./check-versions')();

//如果node的环境变量中没有设置当前的环境，则使用setings/env中的dev环境配置作为当前的环境
const settings = require('../settings/core').dev
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(settings.env.NODE_ENV)
}

//加载插件
const ip = require('ip')
const opn = require('opn')
const path = require('path')
const chalk = require('chalk')
const express = require('express')
const webpack = require('webpack')

//http-proxy-middleware是一个express中间件，用于http请求代理到其他服务器
//例如 localhost:8080/api/xxx  -->  localhost:3000/api/xxx
const proxyMiddleware = require('http-proxy-middleware')

//根据不同的环境加载不同的配置文件
const isTest = process.env.NODE_ENV === 'testing'
const webpackConfig = isTest ? require('../config/webpack.prod') : require('../config/webpack.dev')

// 读取核心配置即settings/core文件中的port端口和浏览器是否自动打开参数。
const port = process.env.PORT || settings.port
const autoOpenBrowser = !!settings.autoOpenBrowser

//创建express服务器
const app = express()

//webpack根据配置文件开始编译代码并返回compiler对象
const compiler = webpack(webpackConfig)

//webpack-dev-middleware将编译后的文件存放在内存中而没有写入硬盘
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,  //设置访问路径,它的配置在settings/core文件中dev下的assetsPublicPath属性
  quiet: true   //设置为true后，使其不在控制台输出日志
})

//webpack-hot-middleware用于实现热加载功能的中间件
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,   //关闭控制台的日志输出
  heartbeat: 2000   //发送心跳包的频率
})

//webpack重新编译文件后，通过热加载强制页面刷新
compiler.plugin('compilation', compilation => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

//根据settings/core文件中的proxyTable配置来设置express服务器的http代理规则
Object.keys(proxyTable).forEach(context => {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  options.onProxyReq = (proxyReq, req, res) => {
    console.log(`[${chalk.gray('proxy')}]: ${chalk.yellow(proxyReq.path)}`)
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

//挂载webpack-dev-middleware中间件
app.use(devMiddleware)

//挂载热更新中间件
app.use(hotMiddleware)

//设置静态文件的请求路径
const staticPath = path.posix.join(settings.assetsPublicPath, settings.assetsSubDir)
app.use(staticPath, express.static('./public'))

//设置mock数据的请求路径
const mockPath = path.posix.join(settings.assetsPublicPath, 'mock')
app.use(mockPath, express.static('./mock'))

//生成局域网的ip地址和端口
const uri = `http://${ip.address()}:${port}`

//webpack-dev-middleware等待webpack完成所有编译后，控制台输出完成提示，并自动打开浏览器渲染页面
devMiddleware.waitUntilValid(() => {
  console.log(chalk.cyan(`> Listening at ${uri} \n`))
  if (autoOpenBrowser && !isTest && !process.env.npm_config_silence) {
    opn(uri)
  }
  _resolve()
})

//启动服务器并监听相应的端口
const server = app.listen(port)
```

### webpack.base.js文件分析
  该文件中主要为开发环境和生产环境都需要用到的配置。主要负责以下事件：
  1. 配置webpack编译的入口文件
  2. 配置webpack输出路径
  3. 配置不同文件的编译规则
  4. 在resolve中配置文件的别名

> 代码注释：

```javascript
//加载依赖插件和导入核心配置
const path = require('path')
const webpack = require('webpack')
const utils = require('./util-tools')
const vueLoaderConfig = require('./vue-loader')
const settings = require('../settings/core')

//根据不同的环境设置不同的模式
const isProd = process.env.NODE_ENV === 'production'
const env = isProd ? 'build' : 'dev'

//生成绝对路径
const resolve = dir => path.join(__dirname, '..', dir)

//设置不同模块的处理规则
let rules = [{
  //对.vue结尾的文件使用vue-loader编译
  test: /\.vue$/,
  loader: 'vue-loader',
  options: vueLoaderConfig
}, {
  test: /\.pug$/,
  loader: 'pug'
}, {
  //对src和test文件夹下的js文件使用babel-loader将es6+转换成es5，使得浏览器可以识别
  test: /\.js$/,
  loader: 'babel-loader',
  include: [resolve('src'), resolve('test')]
}, {
  //对图片的的大小进行限制，当小于10kb的时候图片被转成base64字符串写入css或html中。
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 10000,
    //图片的存储路径和名字
    name: utils.assetsPath('img/[name].[hash:7].[ext]')
  }
}, {
  //对音视频文件进行编译
  test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 10000,
      //音视频文件的存储路径和名字
    name: utils.assetsPath('media/[name].[hash:7].[ext]')
  }
}, {
  //对字体文件的编译
  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 10000,
    //设置字体文件的存储路径和名字
    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
  }
}]

//根据核心配置判断是否开启对src和test文件夹下的js和vue文件的语法检测
if (settings[env].lint && !isProd) {
  rules = [{
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
      formatter: require('eslint-friendly-formatter')
    }
  }].concat(rules)
}

//对文件夹别名进行配置，简化文件的引入
resolve: {
  extensions: ['.js', '.vue', '.json'],
  alias: {
    'vue$': 'vue/dist/vue.esm.js',
    '@': resolve('src'),
    '~': resolve('src/views'),
    '#': resolve('src/assets'),
    '^': resolve('src/components')
  }
},

```

### webpack.dev.js文件分析
  该文件为开发环境的配置，在文件中主要进行如下操作：
  1. 合并基础配置
  2. 配置样式文件
  3. 设置模板文件
  4. 开启webpack的错误提示

> 代码注释：

```javascript
const path = require('path')
const webpack = require('webpack')

//加载编译样式的模块
const utils = require('./util-tools')

//webpack配置合并插件
const merge = require('webpack-merge')

//加载核心配置中的开发配置
const settings = require('../settings/core').dev

//加载基础配置文件
const baseWebpackConfig = require('./webpack.base')

//用于生成html并且将编译后的js和css注入到html文件中的插件
const HtmlWebpackPlugin = require('html-webpack-plugin')

//webpack错误信息提示插件
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

//生成绝对路径
const resolve = dir => path.join(__dirname, '..', dir)

//将热加载的客户端代码和配置中的入口文件合并，实现热更新
Object.keys(baseWebpackConfig.entry).forEach(name => {
  baseWebpackConfig.entry[name] = ['./config/dev-client'].concat(baseWebpackConfig.entry[name])
})

//将基础配置和开发模式下的配置进行合并
module.exports = merge(baseWebpackConfig, {
  module: {
    //添加样式文件的编译规则
    rules: utils.styleLoaders({ sourceMap: settings.cssSourceMap })
  },
  //webpack的编译模式
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    //在内部添加标识相当于全局变量，在其他文件中可以直接使用process.env
    new webpack.DefinePlugin({
      'process.env': settings.env
    }),

    //开启热更新
    new webpack.HotModuleReplacementPlugin(),

    // webpack编译过程中出错的时候跳过报错阶段，不会阻塞编译，在编译结束后报错
    new webpack.NoEmitOnErrorsPlugin(),

    //设置模板文件，配置外部js和css注入模板文件中
    new HtmlWebpackPlugin({
      extJS: settings.extJS || [],
      extCSS: settings.extCSS || [],
      title: settings.projectName,
      isMobile: settings.isMobile,
      filename: 'index.html',
      favicon: resolve('static/favicon.ico'),
      template: resolve('static/index.ejs'),
      inject: true
    }),

    // 开启webpack错误信息提示
    new FriendlyErrorsPlugin()
  ]
})
```