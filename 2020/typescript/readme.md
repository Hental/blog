# 如何用 Typescript 写出准确的类型

## 扩展对象

合并 2 个具有相同名称的类型。

1. 在请求的 request 对象上新增一个属性。

```ts
declare module 'http' {
  interface IncomingMessage {
    myRequestProp: number;
  }

  interface ServerResponse {
    myResponseProp: string;
  }
}
```

2. 全局对象（比如 window、global）增加属性。

```ts
declare global {
  namespace NodeJS {
    interface Global {
      myGlobalProp: boolean;
    }
  }

  interface Window {
    myWindowProp: () => void;
  }

  type MyGlobalType = {};
}
```

3. 扩张原型对象。

```ts
// class.ts
export class MyClass {
  doSome(): string {
    return '';
  };

  async doAsync(): Promise<void> {};
}

// extension.ts
import { MyClass } from './class';

declare module './class' {
  interface MyClass {
    extendFn(arg: number): number;
  }
}

MyClass.prototype.extendFn = v => v;

// test.ts
import { MyClass } from './class';
import './extension';

const ins = new MyClass();

ins.extendFn
```

## 类型推导

### typeof

### keyof

### infer

### 帮助类型

## 模板字符串类型
