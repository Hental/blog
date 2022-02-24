# ESM in Nodejs

## 背景

## ESM 和 CJS 的差异

### CommonJS

CommonJS 出现的时代很早，当时 JavaScript 并没有标准的模块系统，实现思路和 webpack 实现的模块系统思路一样，把代码包装成一个 iife 函数，注入
`module` `exports` 对象。

```plantuml
```

### ESModule

esm 是 es6 引进的 JavaScript 标准的模块系统规范，基于 `import` 和 `export` 关键字。

```plantuml
```

相比 commonjs，esm 更多的考虑 web 下的异步场景，包括 url 处理，文件加载都是异步的，并且 [nodejs 14.8 版本开始支持 top level await](https://www.stefanjudis.com/today-i-learned/top-level-await-is-available-in-node-js-modules/)。


## nodejs 中的解决方案

1. esm 引入 cjs

2. cjs 引入 esm

## 现状

### typescript support

## 参考

- [https://github.com/microsoft/TypeScript/issues/46452](https://github.com/microsoft/TypeScript/issues/46452)
- [nodejs esm](https://nodejs.org/docs/latest-v16.x/api/esm.html)
- [MDN Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [proposal-top-level-await)](https://github.com/tc39/proposal-top-level-await)
