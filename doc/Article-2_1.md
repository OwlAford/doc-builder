# 基本配置详解

## webpack.base.js

#### 配置文件路径
> 设置函数，传入参数，返回绝对路径，方便import时引入地址的填写

```javascript
const resolve = dir => path.join(__dirname, '..', dir)
```

#### 入口配置(entry)

```javascript
// 根据实际情况调整项目入口文件
entry: {
  app: './src/main.js'
}
```

#### 输出配置(output)

```javascript
output: {
  path: settings.build.assetsRoot,                // 输出目录
  filename: '[name].js',                          // 输出的文件名称
  publicPath: settings[env].assetsPublicPath      // 静态文件请求路径
}
```

#### 设置不同文件的处理规则

```javascript
let rules = [{
  // 对.vue结尾的文件使用vue-loader编译
  test: /\.vue$/,
  loader: 'vue-loader',
  options: vueLoaderConfig
}, {
  // 对src和test文件夹下的js文件使用babel-loader将es6+转换成es5，使得浏览器可以识别
  test: /\.js$/,
  loader: 'babel-loader',
  include: [resolve('src'), resolve('test')]
}, {
  // 对图片的的大小进行限制，当小于10kb的时候图片被转成base64字符串写入css或html中。
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 10000,
    // 图片的存储路径和名字
    name: utils.assetsPath('img/[name].[hash:7].[ext]')
  }
}]
```

#### 判断是否开启对js和vue文件的语法检查

```javascript
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
```

#### resolve配置
> extensions: 对模块后缀进行解析，当我们引入模块的时候可以省略后缀，编译的时候会按照这个配置的顺序去匹配js，vue，json为后缀的文件，如果找不到会报错no find。
> alias: 设置文件夹别名，优化import的引入方式

```javascript
resolve: {
  extensions: ['.js', '.vue', '.json'],
  alias: {
    'vue$': 'vue/dist/vue.esm.js',
    '@': resolve('src'),
    '~': resolve('src/views'),
    '#': resolve('src/assets'),
    '^': resolve('src/components')
  }
}
```