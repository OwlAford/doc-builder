# 文件目录

## 项目结构目录概览

```
.
├── bin                                    # gulp的启动文件和打包文件
├── config                                 # 项目配置文件
├── data                                   # 打包后的页面资源比重图
├── dist                                   # 打包后文件目录
├── mock                                   # 模拟数据
├── node_modules                           # 项目的依赖库
├── public                                 # JS公共库
├── settings                               # 核心配置
│   ├── core.js                            # 打包配置
│   └── env.js                             # 环境变量配置
├── src                                    # 程序源文件
│   ├── assets                             # 静态文件
│   │    ├──images                         # 图片文件
│   │    └──style                          # 样式文件
│   ├── components                         # 全局可复用的表现组件
│   ├── config                             # 数据请求接口
│   ├── constants                          # 常量声明文件
│   │    ├──api.js                         # 请求接口声明
│   │    └──config.js                      # 路径声明
│   ├── filters                            # 过滤器
│   ├── plugins                            # 插件配置
│   ├── router                             # 路由
│   │    ├── index.js                      # 路由全局配置
│   │    └── maps.js                       # 路由跳转配置
│   ├── utils                              # 公用工具配置
│   │    ├── cookie.js                     # cookie的增删改查
│   │    ├── requestAnimationFrame.js      # 动画框架配置
│   │    └── requester.js                  # axios的配置
│   ├── views                              # 页面整体布局和各页面布局
│   ├── vuex                               # vuex指定块
│   │    ├── actions.js                    # 异步改变state的值
│   │    ├── getters.js                    # 获取state的值
│   │    ├── mutations.js                  # 初始state值, 改变state的值
│   │    └── store.js                      # vuex的配置
│   ├── .eslintrc                          # 额外的全局变量设置
│   └── App.vue                            # 程序主组件
│   └── main.js                            # 程序启动和渲染（入口文件）
├── static                                 # 静态资源文件
├── .babelrc                               # babel的配置
├── .eslintignore                          # eslint忽略文件
├── .eslintrc.js                           # eslint规则配置
├── .gitignore                             # git忽略文件
├── gulpfile.js                            # gulp的配置
└── package.json                           # npm的配置
```

## src文件夹结构详解

作为开发者, 使用框架是为了更快地开发应用, 应该将主要时间花费在业务的实现上。所以, 大部分开发的都是在src目录下进行的。src文件夹的设置是灵活的, 可以根据自己的习惯安排。当然，本框架提供了一个层次分明，结构清晰的目录结构。建议初学者，使用本框架的目录结构来编写自己的代码，使自己编写的业务逻辑更加清晰，且易于维护。

下面就是src文件夹的详解：

- assets文件夹：页面中使用的样式，以及图片等静态资源应该放在该目录下进行集中管理。
- component文件夹：一些公用的，可重复的组件```(如，页头、页尾、侧边栏以及弹出框等等)```放在这个文件夹下。
- constants文件夹：一些常量的声明统一放在该目录下```(如PI)```。在该文件夹下还有两个文件：config.js中进行路径声明; api.js中进行接口声明。
- config文件夹：在该文件夹下api.js中把constants文件夹api.js中定义的接口引入拼接补全后，并声明接口调用函数。这样，可以对数据接口进行集中的管理，结构更加清晰且方便维护。
- filters文件夹：后台的数据并不总是可以直接显示在页面上的，所以很多时候我们需要对获取的数据通过过滤器进行一些加工，来获取我们所需要数据。而该文件夹就是用来集中管理这些公用的过滤器的。
- plugins文件夹：在开发过程中，我们为了开发效率考虑会使用各种各样插件。而有些插件需要注入到vue中才可以使用，我们可以在该文件夹下，统一地将配置好的插件注入到vue中。
- router文件夹：路由的映射和配置在该文件夹下进行。在index.js中进行vue-router进行配置，在maps.js中进行路由组件的映射
- utils文件夹：一些公用的函数放在该目录下。该目录下已经有三个文件：cookie.js里包含了对cookie进行增删改查的函数; requestAnimationFrame.js是requestAnimationFrame引入; requester.js中是axios的初始化以及拦截器的设置
- view文件夹：页面视图组件全部放在该目录下，根据业务需求应该具有一定的层级结构
- vuex文件夹：vuex的逻辑编写基本全是在该目录下完成的。该目录下有4个文件：
  - store.js：vuex的仓库文件，初始化配置是在该文件中进行的
  - mutations.js：vuex的状态state以及mutations是在该文件下配置的
  - getters.js：通过getters来获取state的值，并且可以对数据进行过滤
  - action.js：异步或批量提交mutations时在该文件里设置
- .eslintrc：对于一些引入的全局变量，eslint会报错，可以在这里进行设置
- App.vue：入口组件，pages里的组件会被插入此组件中，此组件再插入index.html文件里，形成单页面应用。
- main.js：入口js文件，影响全局，作用是引入全局使用的库、公共的样式和方法、设置路由等。

