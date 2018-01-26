# 3.项目构建打包发布详解

本项目构建打包发布的相关配置主要集中在项目目录 `bin` 文件夹下的 `production.js` 及 `config` 文件夹下的 `webpack.prod.js` 内。

本节会针对这两个文件进行阐述主要配置项的作用。

## production.js

开发人员执行 `npm run build` 打包命令行的时候其实执行的是 `production.js` 文件，以该文件为入口再去执行 `webpack.prod.js` 文件，从而进行整体项目的构建打包。

在`production.js` 文件内会引入 `webpack.prod.js`

```javascript
const webpackConfig = require('../config/webpack.prod')
```

之后再根据 `webpack.prod.js` 里面的配置项进行打包，完成之后会在终端输出构建完成的相关信息，如果打包过程中出错则会输出报错信息并退出程序。且打包之前会删除目录中此前配置中指定的存放静态资源文件的 `dist` 文件夹，删除完成后才开始webpack构建打包。

```javascript
// 首先将整个dist文件夹以及里面的内容删除，以免遗留旧的没用的文件
// 删除完成后才开始webpack构建打包
rm(path.join(settings.assetsRoot, settings.assetsSubDir), err => {
  if (err) throw err
  // 执行webpack构建打包，完成之后在终端输出构建完成的相关信息或者输出报错信息并退出程序
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,        // 让打包的时候有颜色
      modules: false,      // 去掉内置模块信息
      children: false,     // 去掉子模块
      chunks: false,       // 增加包信息（设置为 false 能允许较少的冗长输出）
      chunkModules: false  // 去除包里内置模块的信息
    }) + '\n')
  })
})
```

**说明：**

 >- *本项目webpack编译之后的静态资源文件会输出到配置里面指定的目标文件夹 dist内；删除目标文件夹之后再创建是为了去除旧的内容，以免产生不可预测的影响。*

#### webpack.prod.js

`webpack.prod.js` 在 `webpack.base.js` 的基础上进行了扩展，增加了一些更为细致的打包规则。

##### 规定了webpack打包输出的路径和命名规则

```javascript
output: {
  path: settings.assetsRoot,  // 打包后的文件输出路径

  //以文件内容的MD5生成Hash名称，用于处理浏览器缓存
  filename: utils.assetsPath('js/[name].[chunkhash:8].js'),
  chunkFilename: utils.assetsPath('js/[name].[chunkhash:8].js')
},
```

##### 主要插件的介绍及作用

生成HTML模板。

```javascript
// 生成html页面
new HtmlWebpackPlugin({
  extJS: settings.extJS || [],
  title: settings.projectName,
  isMobile: settings.isMobile,
  filename: isTest ? 'index.html' : settings.index,
  favicon: resolve('static/favicon.ico'),
  template: resolve('static/index.ejs'),
  inject: true,                // 将所有的 javascript 资源将被放置到 body 元素的底部
  minify: {
    removeComments: true,        // 删除html页面中的注释
    collapseWhitespace: true,    // 删除html页面中的空格
    removeAttributeQuotes: true  // 删除各种html标签属性值的双引号
  },
  // 在chunk被插入到html之前，你可以控制它们的排序
  // 允许的值 ‘none’ | ‘auto’ | ‘dependency’ | {function} 默认为‘auto’
  // 'dependency'为按照不同文件的依赖关系来排序
  chunksSortMode: 'dependency'
}),
```

抽取库文件，将所有从node_modules中引入的js提取到vendor.js中。

```javascript
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: ({ resource }) => 
  resource && resource.indexOf(path.join(__dirname, '../node_modules')) >= 0
}),
```

把webpack的runtime代码和module manifest代码提取到manifest文件中，防止修改了代码但是没有修改第三方库文件导致第三方库文件也打包的问题。

```javascript
new webpack.optimize.CommonsChunkPlugin({
  name: 'manifest',
  chunks: ['vendor']
})
```

##### 判断是否开启gzip压缩

如果开启了产品gzip压缩，则利用插件将构建后的产品文件进行压缩。

```javascript
if (settings.gzip) {
  // 一个用于压缩的webpack插件
  const CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      // 压缩算法
      algorithm: 'gzip',
      test: new RegExp(`\\.(${settings.gzipExtensions.join('|')})$`),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
```

##### 判断是否启动了report

判断启动打包命令行时是否添加了关键参数 `--report` ，若有，则通过插件给出webpack构建打包后的产品文件分析报告，并设置输出路径及文件名。

```javascript
if (process.env.npm_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: `../data/reports/${Date.now()}.html`
  }))
}
```


