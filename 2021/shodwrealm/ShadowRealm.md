# ShadowRealm

## ShadowRealm 是什么

[ShadowRealm](https://github.com/tc39/proposal-shadowrealm) 是一个 TC39 提案，目标是提供一个完全独立的轻量的 JavaScript 执行上下文，可以用来安全的动态执行 JavaScript 代码，目前在 stage 3 阶段。

```js
declare class ShadowRealm {
    constructor();
    importValue(specifier: string, bindingName: string): Promise<PrimitiveValueOrCallable>;
    evaluate(sourceText: string): PrimitiveValueOrCallable;
}

const realm = new ShadowRealm();
const result = realm.evaluate(`1 + 1`);
console.log(result); // 2

/**
 * foo.js
 * export const bar = () => 'foobar';
 **/
const bar = realm.import('path/to/foo.js', 'bar');
bar(); // foobar 
```

### 和 eval 的区别是什么

1. ShadowRealm 有独立的上下文。ShadowRealm 是执行在另外一个独立的上下文，和 iframe 类似，不会影响当前上下文。

2. 有限制的访问。eval 没有限制和检查，能访问所有可以访问的 Api，但是 ShadowRealm 和 worker 类似，没有 DOM 对象，只能访问 ECMAScript 提供的 api。

## 如何实现一个 shim

仓库地址：[Agoric/realms-shim](https://github.com/Agoric/realms-shim)

> 由于提案有变动，这个仓库实现的 api 和提案的 api 并不一致，仅参考下实现思路

### 1. 生成一个独立的 JavaScript 运行时上下文

在浏览器，目前我们是无法直接创建一个 JavaScript 运行时上下文，可以通过创建一个同域下的 iframe 获取一个独立的 JavaScript 运行时上下文。

> 在 nodejs 环境下，可以通过 [vm](https://nodejs.org/api/vm.html) 模块直接创建一个上下文。 `vm.runInNewContext`

```ts
function getUnsafeGlobalFromIframe() {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  const unsafeGlobal = iframe.contentWindow.eval("this;");
  return unsafeGlobal;
}
```

### 2. 隔离 DOM 对象，只能访问 ECMAScript 定义的标准 Api

在 ShadowRealm 中应该只能访问 ECMAScript 提供的 [Standard built-in Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)，无法使用由浏览器提供的 Object。解决的思路很简单，构建一个只包含标准 Api 的对象。

```ts
const buildInObject =  [
  'NaN',
  'undefined',
  'isFinite',
  'parseInt',
  // ...etc
];

function createSafeGlobalThis(unsafeGlobal) {
  const descriptors = {};
  buildInObject.forEach(key => {
    const desc = Object.getOwnPropertyDescriptor(unsafeGlobal, key);
    descriptors[key] = {
      value: desc.value,
      writable: false,
      enumerable: false,
      configurable: false,
    }
  });
  const safeGlobal = Object.create(unsafeGlobal.Object.prototype, descriptors);
  return safeGlobal;
}
```

### 3. 构造安全的 eval

因为 eval 自身是没有限制，可以访问任何 api，为了限制 scope，保证执行的代码只能访问 safeGlobal，可以通过 `with` + `proxy` 的方式构造一个完全受控制的 scope。

[with](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with)：with 会在当前执行的代码块增加一层 scope。

```js
function demo(customScope) {
  with (customScope) { // 创建一个额外的 scope，内容是 customScope
    return foo + bar;
  }
}

const result = demo({ foo: 'foo', bar: 'bar' });
console.log(result); // foobar
```

[proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)：proxy 可以创建一个被代理和控制的对象。

```js
const hiddenObject = { foo: 'bar' };
const proxy = new Proxy({}, {
  get(obj, key) {
    return hiddenObject[key];
  },

  has(prop) {
    return true;
  },
});

console.log(proxy.foo); // 'bar'
console.log('bar' in proxy); // true
```

```ts
function buildScopeHandler(
  unsafeRec,
  safeGlobal,
) {
  const { unsafeGlobal, unsafeEval } = unsafeRec;
  
  const scopeHandler = {
    get(_, prop) {
      // 标记使用了 eval 函数
      if (prop === 'eval') {
        return unsafeEval;
      }
      return Reflect.get(safeGlobal, prop);
    },

    set(_, prop, val) {
      return Reflect.set(safeGlobal, prop, value, safeGlobal);
    },

    has() {
      // 保证 with 只能访问这个对象，避免访问外层的上下文，比如 DOM 对象。
      return true;
    }
  };

  return scopeHandler;
}

function stringifyFunction(fn) {
  let src = `'use strict'; (${fn})`;
  return src;
}

function createEvalFactory(unsafeRec, safeGlobal) {
  const { unsafeEval, unsafeFunction } = unsafeRec;

  function factory(code) {
    // 在 realm 新的上下文中构造函数
    const scopedEvaluatorFactory = unsafeFunction(`
      // with proxy handler
      with (arguments[0]) {
        return function() {
          'use strict';
          return eval(arguments[0]);
        };
      }
    `);

    const scopeHandler = unsafeEval(stringifyFunction(buildScopeHandler))(unsafeRec, safeGlobal);
    const scopeProxyRevocable = Proxy.revocable({}, scopeHandler);
    // 绑定 proxy handlers 到 scopedEvaluatorFactory 的 with 上下文上
    const scopeEvaluator = Reflect.apply(scopedEvaluatorFactory, safeGlobal, [scopeProxyRevocable.proxy]);
    
    try {
      // eval code
      return Reflect.apply(scopeEvaluator, safeGlobal, [code]);
    } catch (e) {
      throw e;
    }
  } 

  return factory;
}
```

### 4.检查 sourceText

为了防止一些攻击，我们需要检查 `sourceText`。因此引入 pipeline 机制，在执行 sourceText 前检查 sourceText 是否正确。

```ts
const someDirectEvalPattern = /\beval\s*(?:\(|\/[/*])/;
function rejectSomeDirectEvalExpressions(s) {
  const index = s.search(someDirectEvalPattern);
  if (index !== -1) {
    const linenum = s.slice(0, index).split('\n').length; // more or less
    throw new SyntaxError(
      `possible direct eval expression rejected around line ${linenum}`
    );
  }
}

const defaultRejectDangerousSourcesTransform = [
  rejectSomeDirectEvalExpressions,
];

function applyTransform(sourceText, transforms) {
  let output = sourceText;

  output = transforms.reduce((ctx, acc) => {
    // 依次电影 transform，传入 sourceText 
    return acc(ctx) || ctx;
  }, output);

  return output;
}

function valid(sourceText) {
  applyTransform(sourceText, defaultRejectDangerousSourcesTransform);
}
```

### 5. 实现 shim

```js
function initShadowRealm() {
  const unsafeGlobal = getUnsafeGlobalFromIframe(); 
  const safeGlobal = createSafeGlobalThis(unsafeGlobal);
  const unsafeRec = createUnsafeRec(unsafeGlobal); 
  const evaluate = createEvalFactory(unsafeRec, safeGlobal);
  
  return {
    evaluate,
  }
}

function createRealm(BaseRealm) {
  const { initShadowRealm } = BaseRealm;

  class ShadowRealm {
    #evaluate;
    #modules; 
    
    constructor() {
      this.#evaluate = initShadowRealm().evaluate;
      this.#modules = {};
    }

    evaluate(sourceText) {
      return this.#evaluate(sourceText);
    }

    async importValue(specifier, bindingName) {
      const modExports = await this.#evaluate(`import("${specifier}")`);
      this.#modules[specifier] = modExports;
      return this.#modules[specifier][bindingName];
    }
  }

  return ShadowRealm;
}

const ShadowRealm = createRealm({
  initShadowRealm,
});

window.ShadowRealm = ShadowRealm;
```

## 和 iframe 的区别

> ShadowRealms execute code with the same JavaScript heap as the surrounding context where the ShadowRealm is created. Code runs synchronously in the same thread.

ShadowRealm 比 iframe 更轻量。ShadowRealm 执行的代码是在同一个 JavaScript 堆上，而 iframe 设计初衷是提供一个完整的 DOM 环境。在需要执行第三方代码的时候，比如建站 DSL 里面执行 state 表达式的时候使用这个 api 更好用。

## 其他提案: [Error Cause](https://github.com/tc39/proposal-error-cause)

`Error Cause`提案是第一个有中国主导并且进入到 stage 4 的提案。

## 引用

- [tc39/proposal-shadowrealm)](https://github.com/tc39/proposal-shadowrealm)
- [explainer](https://github.com/tc39/proposal-shadowrealm/blob/main/explainer.md)
- [realms-shim](https://github.com/Agoric/realms-shim)
- [near-membrane](https://github.com/salesforce/near-membrane)
