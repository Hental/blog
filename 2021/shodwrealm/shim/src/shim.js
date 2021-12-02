function stringifyFunction(fn) {
  let src = `'use strict'; (${fn})`;
  return src;
}

function getUnsafeGlobalFromIframe() {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  const unsafeGlobal = iframe.contentWindow.eval("this;");
  return unsafeGlobal;
}

// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
const buildInObject = [
  "NaN",
  "undefined",
  "isFinite",
  "parseInt"
  // ...etc
];

function createSafeGlobalThis(unsafeGlobal) {
  const descriptors = {};
  
  buildInObject.forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(unsafeGlobal, key);
    descriptors[key] = {
      value: desc.value,
      writable: false,
      enumerable: false,
      configurable: false
    };
  });

  const ShadowRealm = unsafeGlobal.eval(stringifyFunction(createRealm))(
    BaseRealm
  );
  descriptors.ShadowRealm = {
    writable: false,
    enumerable: false,
    configurable: false,
    value: ShadowRealm
  };

  const safeGlobal = Object.create(unsafeGlobal.Object.prototype, descriptors);
  return safeGlobal;
}

function createUnsafeRec(unsafeGlobal) {
  const unsafeEval = unsafeGlobal.eval;
  const unsafeFunction = unsafeGlobal.Function;

  return Object.freeze({
    unsafeGlobal,
    unsafeEval,
    unsafeFunction
  });
}

function buildScopeHandler(unsafeRec, safeGlobal) {
  const { unsafeGlobal, unsafeEval } = unsafeRec;

  const scopeHandler = {
    get(_, prop) {
      // 标记使用了 eval 函数
      if (prop === "eval") {
        return unsafeEval;
      }
      return Reflect.get(safeGlobal, prop);
    },

    set(_, prop, value) {
      return Reflect.set(safeGlobal, prop, value, safeGlobal);
    },

    has() {
      // 保证 with 只能访问这个对象，避免访问外层的上下文，比如 DOM 对象。
      return true;
    }
  };

  return scopeHandler;
}

function applyTransform(sourceText, transforms) {
  let output = sourceText;

  output = transforms.reduce((ctx, acc) => {
    return acc(ctx) || ctx;
  }, output);

  return output;
}

const someDirectEvalPattern = /\beval\s*(?:\(|\/[/*])/;
function rejectSomeDirectEvalExpressions(s) {
  const index = s.search(someDirectEvalPattern);
  if (index !== -1) {
    const linenum = s.slice(0, index).split("\n").length; // more or less
    throw new SyntaxError(
      `possible direct eval expression rejected around line ${linenum}`
    );
  }
}
const defaultRejectDangerousSourcesTransform = [
  rejectSomeDirectEvalExpressions
];

function createEvalFactory(unsafeRec, safeGlobal) {
  const { unsafeEval, unsafeFunction } = unsafeRec;

  function factory(code) {
    unsafeEval(stringifyFunction(applyTransform))(
      code,
      defaultRejectDangerousSourcesTransform
    );

    const scopedEvaluatorFactory = unsafeFunction(`
      // with proxy handler
      with (arguments[0]) {
        return function() {
          'use strict';
          return eval(arguments[0]);
        };
      }
    `);

    const scopeHandler = unsafeEval(stringifyFunction(buildScopeHandler))(
      unsafeRec,
      safeGlobal
    );
    const scopeProxyRevocable = Proxy.revocable({}, scopeHandler);
    // 绑定 proxy handlers 到 scopedEvaluatorFactory 的 with 上下文上
    const scopeEvaluator = Reflect.apply(scopedEvaluatorFactory, safeGlobal, [
      scopeProxyRevocable.proxy
    ]);

    try {
      // eval code
      return Reflect.apply(scopeEvaluator, safeGlobal, [code]);
    } catch (e) {
      throw e;
    }
  }

  return factory;
}

function initShadowRealm() {
  const unsafeGlobal = getUnsafeGlobalFromIframe();
  const safeGlobal = createSafeGlobalThis(unsafeGlobal);
  const unsafeRec = createUnsafeRec(unsafeGlobal);
  const evaluate = createEvalFactory(unsafeRec, safeGlobal);

  return {
    evaluate
  };
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

const BaseRealm = {
  initShadowRealm
};

const ShadowRealm = createRealm(BaseRealm);

window.ShadowRealm = ShadowRealm;
