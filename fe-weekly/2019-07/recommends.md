# 周刊推荐

## 2019-07-22

[122](https://github.com/CtripFE/fe-weekly/issues/121)

### [精读《前端未来展望》](https://zhuanlan.zhihu.com/p/73765645)

前端的领域已经不局限于切图，工程化，组件化，可视化，AI，云服务，Serverless 都是前端未来的一部分。

### [科普一下 CORS 以及如何节省一次 OPTIONS 请求](https://zhuanlan.zhihu.com/p/70032617)

CORS 问题虽然可以通过 http header 解决，但是大部分情况下会发起 2 次请求，消耗掉两个 TTL，严重影响性能，ajax 服务最好和和主站部署在同一个域名下。

### [What’s Deno, and how is it different from Node.js?](https://blog.logrocket.com/what-is-deno/)

Deno 自问世以来就受到很多的关注，现在已经初步可用，但实际上 deno 和 NodeJS 的设计思路和方向是并不相同的，本文带你了解 deno 和 NodeJS 的差异。

### [轻量可嵌入的 QuickJS 引擎重磅开源，它会是下一个 V8 吗？](https://www.infoq.cn/article/Qzh19YqpqFoSS6_SOlV9) & [Facebook 发布全新 JS 引擎！专注提高 React Native 应用的性能](https://www.infoq.cn/article/8JEVNZvTrj_e1oJwo5vL)

facebook 和 FFmpeg 作者 Charlie Gordon 分别发布 2 个新的 JS 引擎，效果目前不清楚，但是多些选择总是好事。

### [BAT 程序员们常用的开发工具](https://www.infoq.cn/article/yeQU4f_BujTYCMxaXNFc)

工欲善其事必先利其器，一个优秀的程序员除了代码写得好，善于利用各种开发工具同样可以事半功倍。

## 2019-07-15

[121](https://github.com/CtripFE/fe-weekly/issues/121)

### [Lodash 库爆出严重安全漏洞，波及 400 万 + 项目](https://www.infoq.cn/article/k7C-ZvXKOHh284ToEy9K)

lodash 的 defaultsDeep， merge 方法可能修改原型链，造成原型污染，可以升级到最新版本以解决该问题。

### [A Look at JavaScript’s Future](https://www.toptal.com/javascript/predicting-javascript-future)

JavaScript 的世界仍然在高速发展，ES6、TypeScript、 WebAssembly 带来了更好的性能和更安全的代码，WebXR、Server-side JavaScript、NodeJS 让前端的领域更加广阔。

### [用JavaScript带你体验V8引擎解析字符串过程](https://zhuanlan.zhihu.com/p/73013409)

本篇文章讲解了 V8 引擎如何进行 AST，把字符转化成一个个实际的对象。

## 2019-07-08

[120](https://github.com/CtripFE/fe-weekly/issues/120)

### [The cost of JavaScript in 2019](https://v8.dev/blog/cost-of-javascript-2019)

v8 团队出品，介绍在新时代下我们如何优化我们的代码，以获得最佳的性能。

### [腾讯面试：一条SQL语句执行得很慢的原因有哪些？---不看后悔系列](https://zhuanlan.zhihu.com/p/62941196)

SQL 执行偶尔很慢可能是在同步 redo log 或者等待锁的释放，一直很慢很可能是没有很好的利用到索引。

### [Status of JavaScript(ECMAScript): 2019 & beyond.](https://medium.com/@alberto.park/status-of-javascript-ecmascript-2019-beyond-5efca6a2d233)

模块支持: 浏览器实现了原生的 ES6 module 和 dynamic import，以及 built-in Module(stage 1);
ES8: 异步迭代,对象的展开,Promise prototype 增加 finally 方法，更好的正则支持;
ES9: Array prototype 增加 flat 和 flatMap 方法, Object 增加 fromEntries 方法,通过一个 key-value 数组构建对象, String prototype 增加 trimStart 和 trimEnd 方法,去除空格,以及更好的 utf-8 支持.

## 2019-07-01

[119](https://github.com/CtripFE/fe-weekly/issues/119)

### [详解 HTML attribute 和 DOM property](https://zhuanlan.zhihu.com/p/70671215)

attribute 是 HTML 标签的特性，property 是 JS 对象的属性。

### [“字要大！用大红！”他花了5年终于解决了这一设计难题](https://zhuanlan.zhihu.com/p/68574835)

当老板谈论“字要大”时，到底是在谈论什么？

### [State of CSS 2019](https://2019.stateofcss.com/)

关于 CSS 在 2019 年的使用状况：px、%、em、仍是最常用的 CSS 长度单位，Styled Components 是最认可 CSS-in-JS 方案，预处理器中 Sass 的满意度最高。
