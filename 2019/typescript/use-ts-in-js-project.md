# 在 JavaScript 项目里面使用 TypeScript

typescript 提供了很强大的类型能力，除了能够有效的增强项目代码的可靠性，也能够帮助 vscode 有更好的类型提示，但是现有的许多项目是使用 JavaScript，为了在 JavaScript 项目里面使用上 TypeScript 的类型提示。

## JSDOC

我们可以在 JSDOC 的注释里面使用 TypeScript 的语法，目前，支持

- @type
- @param (or - @arg or - @argument)
- @returns (or - @return)
- @template（泛型，暂不支持 bound generics）
- @typedef
- @callback
- @class (or - @constructor)
- @extends (or - @augments)
- @this
- @enum

函数可以使用 @param，@return 和 @template，类可以使用 @extends，任何的类型赋值都可以使用 @type。

```js
/**
 * @template T, K
 * @param {T} obja
 * @param {K} objb
 * @returns {T & K}
 */
function assign(obja, objb) {
    return {
      ...obja,
      ...objb,
    };
}

// 等同于
/** @type {<T, K>(a: T, b: K) => T & K } */
const assign2 = (obja, objb)  => ({ ...obja, ...objb, });
```

## import & .d.ts

## jsconfig.json & typings

## typeof & []

## infer
