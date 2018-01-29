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
│   ├── router                             # 路由配置
│   │    ├── index.js                      # 路由初始化
│   │    └── maps.js                       # 路由映射
│   ├── utils                              # 公用工具配置
│   │    ├── cookie.js                     # cookie的增删改查
│   │    ├── requestAnimationFrame.js      # 动画兼容性配置
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
- constants文件夹：一些常量的声明统一放在该目录下```(如PI)```。
  - config.js中进行路径声明;
  - api.js中进行接口声明。
- config文件夹：在该文件夹下api.js中把constants文件夹api.js中定义的接口引入拼接补全后，并声明接口调用函数。这样，可以对数据接口进行集中的管理，结构更加清晰且方便维护。
- filters文件夹：后台的数据并不总是可以直接显示在页面上的，所以很多时候我们需要对获取的数据通过过滤器进行一些加工，来获取我们所需要数据。而该文件夹就是用来集中管理这些公用的过滤器的。
- plugins文件夹：在开发过程中，我们为了开发效率考虑会使用各种各样插件。而有些插件需要注入到vue中才可以使用，我们可以在该文件夹下，统一地将配置好的插件注入到vue中。
- router文件夹：路由的映射和配置在该文件夹下进行。
  - 在index.js中进行vue-router进行配置;
  - 在maps.js中进行路由组件的映射。
- utils文件夹：一些公用的函数放在该目录下。
  - cookie.js里包含了对cookie进行增删改查的函数;
  - requestAnimationFrame.js是requestAnimationFrame的兼容性处理;
  - requester.js中是axios的初始化以及拦截器的设置。
- view文件夹：页面视图组件全部放在该目录下，根据业务需求应该具有一定的层级结构
- vuex文件夹：vuex的逻辑编写基本全是在该目录下完成的。该目录下有4个文件：
  - store.js：vuex的仓库文件，初始化配置是在该文件中进行的;
  - mutations.js：vuex的状态state以及mutations是在该文件下配置的;
  - getters.js：通过getters来获取state的值，并且可以对数据进行过滤;
  - action.js：异步或批量提交mutations时在该文件里设置。
- .eslintrc：对于一些引入的全局变量，eslint会报错，可以在这里进行设置
- App.vue：入口组件，view里的组件会被插入此组件中，此组件再插入index.html文件里，形成单页面应用。公用样式和路由设置主要是在该文件里设置的。
- main.js：入口js文件，影响全局，作用是引入全局使用的库以及方法等。

>为了使开发者更加快速地上手，本章节下面将从入口文件、路由配置以及store状态管理三方面大致梳理工程架构。

### (一) 入口文件

入口组件App.vue的部分代码如下：

```javascript
<template>
  <div class="app-container">
    <!-- 路由视口 -->
    <router-view></router-view>
  </div>
</template>

<style lang="scss" src="#/styles/reset.scss"></style>

<script>
  export default {
    name: 'app'
  }
</script>
```

可以看出，我们在入口组件主要是设置了路由视口```<router-view></router-view>```以及引入公用样式。入口组件应尽量保持简洁，不要有太多的业务代码。

入口js文件main.js的部分代码如下：

```javascript
//引入自调函数来解决requestAnimationFrame函数的兼容性问题
import './utils/requestAnimationFrame'
import Vue from 'vue'
import router from './router'
import { sync } from 'vuex-router-sync'
import requester from './plugins/requester'
import App from './App.vue'
import store from './vuex/store'
import * as filters from './filters'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 将router放到state中
sync(store, router)
// 引入ElementUI库
Vue.use(ElementUI)
// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 引入插件
const plugins = [requester]
plugins.forEach(plugin => {
  Vue.use(plugin)
})
// 创建Vue的实例对象app
const app = new Vue({
  router,
  store,
  ...App,
  render: h => h(App)
})
// 将app挂载在id为MOUNT_NODE的dom节点下
app.$mount('#MOUNT_NODE')
```

入口js文件主要作用是引入全局使用的库以及方法等，然后实例化Vue对象，并挂载在dom树上。同样的，该文件中也不应该有太多的业务代码。

### (二) 路由配置

用Vue.js + vue-router创建单页应用，是非常简单的。使用Vue.js ，我们已经可以通过组合组件来组成应用程序，当把vue-router添加进来，我们需要做的是，将组件(components)映射到路由(routes)，然后通过路由视口router-view告诉vue-router在哪里渲染它们。

在本框架中，我们将路由的初始化和路由映射放在src目录下的router文件夹下的index.js和maps.js中管理。maps.js中的代码示例如下：

```javascript
// 引入Login和Redirect组件
import Login from '@/Login'
import Redirect from '@/Redirect'
// 路由映射
export default [{
  path: '/login',
  component: Login
}, {
  path: '/redirect',
  component: Redirect
}, {
  path: '*',
  redirect: '/redirect'
}]
```

index.js中的代码示例如下：

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import routeMap from './maps'
// 引入Router
Vue.use(Router)
// 实例化Router对象
const vueRouter = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: routeMap
})
// 路由守卫
vueRouter.afterEach((to, from) => {
  window.scrollTo(0, 0)
})
// 暴露vueRouter
export default vueRouter
```

这样，我们就可以十分简单地构建单页应用。当然，关于vue-router一些更为细致的配置以及应用技巧，请查看[Vue-Router.js](https://router.vuejs.org/zh-cn/)

### (三) store状态管理

当我们的项目做得越来越大型，结构越来越复杂，组件之间的数据交互也会变得复杂且难以控制。这时候，我们应该将这些数据放在一起进行集中的管理，而本框架就是借助Vuex来实现的。Vuex是一个专为Vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

> 虽然 Vuex 可以帮助我们管理共享状态，但也附带了更多的概念和框架。这需要对短期和长期效益进行权衡。如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。确实是如此——如果您的应用够简单，您最好不要使用 Vuex。一个简单的global event bus就足够您所需了。但是，如果您需要构建是一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。

如上所述，尽管Vuex并不是必要的。但是，我们使用框架来进行开发时，大部分都是开发中大型的应用程序。使用Vuex虽然会增加学习成本，但是同时也能使组件间的数据流向变得更为清晰和有迹可循。所以，本框架中集成了Vuex来进行状态管理，我们在src目录中vuex文件夹下进行配置。下面简单地介绍vuex文件夹下的4个js文件：

store.js文件：

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import { state, mutations } from './mutations'
import * as actions from './actions'
import * as getters from './getters'
// 引入Vuex
Vue.use(Vuex)
// 是否处于开发模式
const debug = process.env.NODE_ENV !== 'production'
// 初始化插件
let plugins = []
// 在开发模式下装载插件
if (debug && !window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  const logger = createLogger({
    collapsed: false,
    transformer (state) {
      return state
    },
    mutationTransformer (mutation) {
      return mutation
    }
  })
  plugins = [logger]
}
// 抛出实例化的Vuex仓库
export default new Vuex.Store({
  plugins,
  state,
  mutations,
  getters,
  actions,
  strict: debug
})
```

>Vuex仓库store的初始化。

mutations.js文件：

```javascript
// state定义，数据都存放在这里
export const state = {
  loginState: false,
  userName: '未命名'
}
// mutations定义，数据通过mutation提交
export const mutations = {
  login (state, val) {
    state.loginState = true
    state.userName = val || '未命名'
  },

  logout (state, val) {
    state.loginState = false
    state.userName = '未命名'
  }
}
```

>state以及mutations的定义，数据都存放在state中，需要更改数据则通过mutations来实现。

getters.js文件：

```javascript
export const loginState = state => state.loginState
export const loginUserName = state => state.userName
export const routePath = state => state.route.fullPath
```

>getters的定义，组件想要获取state中的数据，都要通过getters实现，且可以在getters中实现数据过滤。

actions.js文件：

```javascript
export const login = ({ commit }, value) => {
  commit('login', value)
}
export const logout = ({ commit }) => {
  commit('logout')
}
```

>actions的定义，很多数据操作都是异步的，而mutations只能提交同步的数据操作，这个时候，就需要通过actions来提交数据。而且actions可以批量提交mutations。

上面关于Vuex，本章节只介绍了本框架内如何去管理Vuex的一些基本操作。实际上Vuex中涉及了较多的新概念，而官方的说明文档更加详细易懂。如需使用，建议详细阅读[Vuex.js](https://vuex.vuejs.org/zh-cn/)