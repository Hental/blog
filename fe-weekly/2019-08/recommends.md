# 周刊推荐

## 2019-08-19

[126](https://github.com/CtripFE/fe-weekly/issues/126)

### [「2019 JSConf.Hawaii - Brie.Bunge」大规模应用 TypeScript](https://zhuanlan.zhihu.com/p/78724003)

Airbnb 前端团队在全面使用 TypeScript 后，错误率下降了 15%，迁移也是逐步迁移的，值得借鉴。

### [用JavaScript带你体验V8引擎解析标识符](https://zhuanlan.zhihu.com/p/77332861)

对于 V8,即使一个简单的  `var` 字符的解析，也涉及到很多逻辑。

### [React v16.9.0 and the Roadmap Update](https://reactjs.org/blog/2019/08/08/react-v16.9.0.html)

React 16.9 发布，带来了 React.Profiler，便于性能测试; `componentWillMount`、`componentWillReceiveProps` 和 `componentWillUpdate` 添加了 unsafe 提示。

### [wallace-cli](https://github.com/bartveneman/wallace-cli)

一个可以 css 的命令行分析工具，可以显示有多少条规则、选择器、文件大小等等。

## 2019-08-12

[125](https://github.com/CtripFE/fe-weekly/issues/125)

### [抖音研发实践：基于二进制文件重排的解决方案 APP启动速度提升超15% ](https://mp.weixin.qq.com/s/Drmmx5JtjG3UtTFksL6Q8Q)

通过重排二进制文件，减少 Page Fault，获得了约 15 % 的启动时间减少。

### [JavaScrip中的“观察者模式”](https://zhuanlan.zhihu.com/p/76039838)

JavaScript 中存在大量的异步场景，非常适合“观察者模式”，[RxJS](https://cn.rx.js.org/) 便是基于观察者模式。

### [Do React Hooks Replace Redux?](https://medium.com/javascript-scene/do-react-hooks-replace-redux-210bab340672)

React Hooks 是个好东西，但是它只能管理组件的 state，而 Redux 是管理整个应用的 state。

## 2019-08-05

[124](https://github.com/CtripFE/fe-weekly/issues/124)

### [proposal-optional-chaining](https://github.com/tc39/proposal-optional-chaining) & [proposal-nullish-coalescing](https://github.com/tc39/proposal-nullish-coalescing)

optional-chaining 和 nullish-coalescing 提案已经进入 stage 3 了，带来了更方便的空值判断，不过目前虽然 babel 已经有插件支持，但是 TypeScript 暂时不支持。

### [分布式系统的负载均衡 | 架构干货](https://zhuanlan.zhihu.com/p/74497845)

只要存在调用，就需要考虑负载均衡这个因素。所以负载均衡（Load Balance）是分布式系统架构设计中必须考虑的因素之一。

### [Announcing TypeScript 3.6 Beta](https://devblogs.microsoft.com/typescript/announcing-typescript-3-6-beta/)

TypeScript 3.6 即将发布，带来了更严格的 generator 类型检验，Array(x) 被认为包含 x 个空插槽的数组，而不是 x 个 undefined，更好的 Promise 提示。

### [【深度好文】我在做前端构建过程中的思考](https://zhuanlan.zhihu.com/p/74381415)

每个人的打包需求是不一样的，webpack 满足了这些需求，却也带来了冗余，归于庞大，难以管理，而好的产品层是克制的，功能是克制的，开放度是克制的，只要轻，快，可管控，够用就行。

## 2019-07-29

[123](https://github.com/CtripFE/fe-weekly/issues/123)

### [Autocompletion with deep learning](https://tabnine.com/blog/deep)

一个基于深度学习模型的自动补全工具，[vscode 扩展](https://marketplace.visualstudio.com/items?itemName=TabNine.tabnine-vscode)

### [知乎移动端动态化方案全览](https://www.infoq.cn/article/RRvP-Kli8AwEx6TuB1aG)

不同于网页端，移动端缺乏一定的动态化能力，难以解决对于一些需要快速上线的需求，知乎通过自已定义的 DSL，动态下发布局信息，控件数据。

### [如何实现 JS 真正意义上的弱引用？](https://www.infoq.cn/article/lKsmb2tlGH1EHG0*bbYg)

WeakMap 和 WeakSet 并未完全的弱引用，需要加上 WeakRef，才能提供真正的弱引用。
