# 开发环境搭建

### node.js的安装
  从官网：https://nodejs.org/en/ 下载node安装包进行安装。

### 安装淘宝镜像
  由于npm仓库是国外服务器这里推荐利用淘宝npm镜像安装相关依赖。在命令行中输入： ```npm install -g cnpm --registry=https://registry.npm.taobao.org```  。详细教程见：淘宝镜像地址： http://npm.taobao.org/ 。如图：

![cnpm](images/cnpm.png)

### 安装依赖包
  1. 启动命令行工具，在命令行中cd切换到项目根目录或者在项目文件夹中按住shift+鼠标右键选择在此处打开命令行。
  2. 命令窗口启动后在命令行中输入```cnpm install``` 进行包的安装，由于安装所需时间较长，请耐心等待，不要中途断开网络或关闭命令行工具。
  3. 如果出现安装失败的情况，建议将项目目录文件夹中的node_modules文件夹删除后，重新运行 ```cnpm install``` 命令进行安装，确保所有依赖包能够一次性安装成功。
![安装依赖](images/npm-install.png)
![安装依赖](images/npm-install_b.png)

  4. 安装完成之后，会在我们的项目目录文件夹中多出一个node_modules文件夹，这里边就是我们项目需要的依赖包资源。如图：

![安装依赖完成后](images/node_modules.png)

### 基础配置的修改
  对settings文件夹下的core.js进行修改，目录如下：

![配置文件目录](images/setting-book.png)

  core.js中的配置分为两部分：
    1. dev开发模式（本地开发中使用）。
    2. build生产模式（代码打包后部署到服务器时使用）。

#### dev中的参数如下：

  > 
```javascript
dev: {
  env: env.dev,
  extCSS: [
    'https://cdn.bootcss.com/Swiper/3.4.2/css/swiper.min.css'
  ],
  extJS: [
    'https://cdn.bootcss.com/axios/0.17.1/axios.min.js',
    'https://cdn.bootcss.com/echarts/3.8.5/echarts.simple.min.js'
  ],
  port: 3000,
  lint: true,
  autoOpenBrowser: true,
  projectName: '',
  assetsSubDir: '',
  assetsPublicPath: '/',
  proxyTable: {
    '/sjyMobileServer': {
      target: 'http://60.191.59.19:443',
      changeOrigin: true
    }
  },
  isMobile: true,
  cssSourceMap: true
}
```

  > ##### dev中的属性配置介绍
  > 
| 属性 | 说明 | 默认值 | 建议 |
| ---|:---:|:---:|:---:|
| extCSS | css的cdn地址(第三方或部署在服务器中的样式文件) | '' | 根据需要自定义 |
| extJS | js的cdn地址(比如echart，axios等第三方库) | '' | 根据需要自定义 |
| port | 本地服务器端口 | 5000 | 根据需要自定义 |
| autoOpenBrowser | 是否自动打开浏览器 | true | 不建议更改 |
| projectName | 浏览器中的显示名 | '' | 根据需要自定义 |
| assetsSubDir | 静态资源所放置的文件夹 | 'static' | 根据需要自定义 |
| assetsPublicPath | 发布路径 | '' | 根据需要自定义 |
| proxyTable | 代理配置表,在这里可以配置特定的请求代理到对应的API接口 | '/sjyMobileServer/' | 按后台接口更改 |
| isMobile | 是否是移动端 | true | 按需求自定义 |
| cssSourceMap | 是否开启cssSourceMap | true | 不建议更改 |

#### build中的参数如下：
  > 
```javascript
build: {
  env: env.prod,
  extCSS: [
    'https://cdn.bootcss.com/Swiper/3.4.2/css/swiper.min.css'
  ],
  extJS: [
    'https://cdn.bootcss.com/axios/0.17.1/axios.min.js',
    'https://cdn.bootcss.com/echarts/3.8.5/echarts.simple.min.js',
    'https://cdn.bootcss.com/Swiper/3.4.2/js/swiper.min.js'
  ],
  index: resolve('dist/index.html'),
  assetsRoot: resolve('dist'),
  assetsSubDir: '',
  assetsPublicPath: '/sjyMobileServer/',
  projectName: '',
  productionSourceMap: false,
  lint: false,
  gzip: false,
  distServerPort: 3001,
  distServerPath: 'dist',
  gzipExtensions: ['js', 'css'],
  isMobile: true
}
```

  > ##### build中的属性配置介绍
  > 
| 属性 | 说明 | 默认值 | 建议 |
| ---|:---:|:---:|:---:|
| extCSS | css的cdn地址(第三方或部署在服务器中的样式文件) | '' | 根据需要自定义 |
| extJS | js的cdn地址(比如echart，axios等第三方库) | '' | 根据需要自定义 |
| index | html入口文件 | path.resolve(__dirname, '../dist/index.html') | 不建议更改 |
| assetsRoot | 产品文件的存放路径（打包后的文件夹） | path.resolve(__dirname, '../dist') | 不建议更改 |
| assetsSubDir | 静态资源所放置的文件夹（打包文件夹下的文件夹） | 'static' | 根据需要自定义 |
| assetsPublicPath | 发布路径 | '' | 根据需要自定义 |
| projectName | 浏览器中的显示名 | '' | 根据需要自定义 |
| productionSourceMap | 是否使用source-map | false | 不建议更改 |
| lint | 是否开启语法验证 | true | 不建议更改 |
| gzip | 是否开启gzip压缩 | false | 不建议更改 |
| isMobile | 是否是移动端 | true | 按需求自定义 |

#### 特别说明

> 当引入外部js时，比如引入echarts时，在extJS中设置echarts的cdn地址如下：

```javascript
extJS: [
  'https://cdn.bootcss.com/echarts/3.8.5/echarts.simple.min.js'
]
```

> 然后我们对src目录下的.eslintrc文件进行配置。配置如下：

```javascript
{
  "globals": {
    "echarts": true
  }
}
```

> 配置以后就可以在vue或js文件中减少import导入模块的步骤而直接使用，在eslintrc的globals中增加全局变量，使得在vue或js中使用的时候不用声明变量也不会提示错误。使用如下：

```javascript
<script>
  export default {
    methods: {
      initEchart () {
        let myechart = echarts.init(echart) //详细使用方法查看echarts的api(http://echarts.baidu.com/echarts2/doc/example.html)
      }
    }
  }
</script>
```

#### 图片的配置

> 配置文件在config文件夹中的webpack.base.js中。可以设置limit的值即图片的大小，当小于设置值时，图片会转换成base64字符串嵌入css文件或html页面中。配置文件如下：

```javascript
{
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 10000,
    name: utils.assetsPath('img/[name].[hash:7].[ext]')
  }
}
```

#### 文件夹别名配置

> 配置文件在config文件夹中的webpack.base.js中。在```module.exports```中设置文件夹的别名：

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

  设置别名可以简化内部文件的引入路径，如：

  未设置别名时:
  ```javascript
    import './src/components/footer/footer'
  ```
  
  设置别名后:
  ```javascript
    import '^/footer/footer'
  ```
