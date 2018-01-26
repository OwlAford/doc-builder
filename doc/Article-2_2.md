# 开发配置详解

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
  运行`npm run dev`的时候执行的是`gulp dev`,打开gulpfile.js文件，如下：
```javascript
gulp.task('dev', () => {
  require('./bin/dev-server')
})
gulp.task('build', () => {
  require('./bin/production')
})
```
  可以从上图知道dev任务执行的是bin/dev-server文件

## dev-server.js
  在该文件中我们将进行如下操作：开启本地服务，配置热更新和跨域请求处理。
#### express开启本地服务
  通过express启动本地服务器并监听对应端口

```javascript
const app = express()
const server = app.listen(port)
```

#### 使用http-proxy-middleware解决跨域问题
  http-proxy-middleware是一个express中间件，用于http请求代理到其他服务器。例如 localhost:8080/api/xxx  -->  localhost:3000/api/xxx。

```javascript
const proxyMiddleware = require('http-proxy-middleware')
// 根据settings/core文件中的proxyTable配置来设置express服务器的http代理规则
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
```

#### 托管静态资源
  进行上述配置后，我们可以通过`ip+端口+/staticPath/文件`直接访问public文件夹下的文件，如img，css，js。开发的时候需要自定义数据来模拟请求，我们可以通过`ip+端口+/mockPath/文件`请求mock下的模拟数据。
```javascript
const staticPath = path.posix.join(settings.assetsPublicPath, settings.assetsSubDir)
app.use(staticPath, express.static('./public'))
const mockPath = path.posix.join(settings.assetsPublicPath, 'mock')
app.use(mockPath, express.static('./mock'))
```

#### webpack-dev-middleware
  webpack-dev-middleware会通过watch mode，监听资源的变更，然后自动打包。编译完成后会将编译后的文件写入内存。

```javascript
// webpack-dev-middleware将编译后的文件存放在内存中而没有写入硬盘
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  // 设置访问路径,它的配置在settings/core文件中dev下的assetsPublicPath属性
  publicPath: webpackConfig.output.publicPath,
  // 设置为true后，使其不在控制台输出日志
  quiet: true   
})
// 挂载webpack-dev-middleware中间件
app.use(devMiddleware)
// webpack-dev-middleware等待webpack完成所有编译后，控制台输出完成提示，并自动打开浏览器渲染页面
devMiddleware.waitUntilValid(() => {
  console.log(chalk.cyan(`> Listening at ${uri} \n`))
  if (autoOpenBrowser && !isTest && !process.env.npm_config_silence) {
    opn(uri)
  }
  _resolve()
})
```

#### webpack-hot-middleware
  webpack-hot-middleware是用来进行页面的热重载的,和 webpack-dev-middleware 配合使用实现热替换功能。

```javascript
// webpack-hot-middleware用于实现热加载功能的中间件
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,       // 关闭控制台的日志输出
  heartbeat: 2000   // 发送心跳包的频率
})
// 挂载热更新中间件
app.use(hotMiddleware)
// webpack重新编译文件后，通过热加载强制页面刷新
compiler.plugin('compilation', compilation => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})
```

## webpack.dev.js

#### 样式文件的编译配置
  添加对sass，less，stylus文件的编译规则
```javascript
module: {
  rules: utils.styleLoaders({ sourceMap: settings.cssSourceMap })
}
```

#### html-webpack-plugin配置模板文件
  html-webpack-plugin插件的基本作用就是生成html，将 webpack中`entry`配置的相关入口和 `extract-text-webpack-plugin`抽取的css样式插入到该插件提供的`template`或者`templateContent`配置项指定的内容基础上生成一个html文件。

```javascript
new HtmlWebpackPlugin({
  extJS: settings.extJS || [],
  extCSS: settings.extCSS || [],
  title: settings.projectName,
  isMobile: settings.isMobile,
  filename: 'index.html',
  favicon: resolve('static/favicon.ico'),
  template: resolve('static/index.ejs'),
  inject: true
})
```
