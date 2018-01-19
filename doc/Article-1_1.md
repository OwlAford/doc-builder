# 开发基础要求

## （一）开发基础要求一览表

开发过程中，我们需要熟练使用开发工具和配置，基本要求如下表所示：

| 内容 | 精通 | 熟练掌握 | 基本了解 |
|--------|------|:------:|:------:|
| [Node.js](http://nodejs.cn/api/) | | | √ |
| [Babel](http://babeljs.io) | | | √ |
| [ES6 / 2017](http://es6.ruanyifeng.com) | √ | | |
| [NPM](https://www.npmjs.com) | | √ | |
| [Webpack](https://doc.webpack-china.org/configuration/) | | √ | |
| [Eslint](https://eslint.org) | | √ | |
| [Vue.js](https://cn.vuejs.org/v2/guide/) | √ | | |
| [Vuex.js](https://vuex.vuejs.org/zh-cn/) | √ | | |
| [Vue-Router.js](https://router.vuejs.org/zh-cn/) | √ | | |
| [Sass](https://www.sass.hk) | √ | | | |


> 由于本文篇幅有限，不能将上述所有的内容全部展开阐述，所以每条内容都增加了官网的外部链接，可自行根据需要前往官网学习。

## （二）基础要求简析

**在上表的内容中，有一部分是规范，有一部分是框架，还有一部分是功能组件：**

- *Node.js、NPM为项目开发中核心的部分，所有的工程上的操作和命令，都要在此基础上完成。*

- *Webpack为整个项目工程的核心部分，项目所有的构建和打包工作，都要围绕着Webpack来开展。*

- *基于现在浏览器的兼容情况，ES6 / 2017很多属性和方法仍得不到支持，所以我们需要通过Babel将JS代码进行编译，使其对浏览器有更好的兼容效果。*

- *ES6 / 2017 为项目中JS代码的编写规范，原则上不建议继续使用ES5规范开进行项目开发。Eslint为项目中JS代码的书写格式规范，项目默认开启，建议不要关闭。*

- *为了更高效地编写css，通常我们在项目中会采用Sass来进行样式代码的开发，通过Webpack的加载器，以及postCSS有针对性的处理，可以输出符合我们兼容要求的css代码。*

- *剩余的部分，则为工程项目相关的核心组件或插件，需要熟练掌握。*