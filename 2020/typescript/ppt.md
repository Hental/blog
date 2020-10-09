---
marp: true
paginate: true
---

# Typescript

1. 扩展对象
2. 函数
3. 类型收缩
4. 类型推导
5. 模板字符串类型

---

# 扩展对象

## Case 1: 在请求的 request 对象上新增一个属性。

```ts
import { Context, Next } from 'koa';

declare module 'http' {
  interface IncomingMessage {
    myRequestProp: number;
  }

  interface ServerResponse {
    myResponseProp: string;
  }
}

export async function middleware(ctx: Context, next: Next) {
  ctx.req.myRequestProp = 1;
  ctx.res.myResponseProp = '';
  await next();
}
```

---

```ts
import Koa from 'koa';
import { middleware } from './middleware';

const app = new Koa();

app.use(middleware);
app.use(async (ctx) => {
  console.log(ctx.req.myRequestProp);  
  console.log(ctx.res.myResponseProp);
});

```

- [shark-js-sdk](http://git.dev.sh.ctripcorp.com/shark/shark-js-sdk/blob/master/index.d.ts)
- [ts-helper](http://git.dev.sh.ctripcorp.com/ibu-plt-fe/online-home/blob/release/typings/app/service/index.d.ts)

---

## Case 2: 扩展全局对象（比如 window、global）。

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

// test
window.myWindowProp();
global.myGlobalProp;
let a: MyGlobalType;
```

---

## Case 3: 扩展原型对象。

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

declare global {
  interface Array<T> {
    mySort(): T[];
  }
}
```

---

```ts
import { MyClass } from './class';
import './extension';

const ins = new MyClass();

ins.extendFn

const arr = [];
arr.mySort();
```

[typescript lib.es2020.string.d.ts](https://github.com/microsoft/TypeScript/blob/master/lib/lib.es2020.string.d.ts)

---

# 函数

## Base Usage

```ts
let add: (x: number, y: number) => number = (x, y) => x + y;

function addFn(x: number, y: number): number {
  return x + y;
};
```

---

## Function Interface

```ts
interface Add {
  (x: number, y: number): number
}

let myAdd: Add = (x, y) => x + y;
myAdd(1, 3);
```

扩展函数对象。

```ts
interface MyComponent {
  (props: { text: string }): null;
  displayName?: string;
}

let comp: MyComponent = () => null;
comp.displayName = 'foo';
```

[React Function Component Define](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/5dff4b26f32129e7d6d71fb9fb5f2ca2ebfaf0be/types/react/index.d.ts#L546)

---

## 重载

函数重载适用于有多种函数入参。

`request` 函数有 2 种入参，一种是传入 `url` 和 `option`，一种是只传入 `option`。

```ts
type Option = { method: string };
export function request(url: string, opt: Option): Promise<any>;
export function request(opt: Option & { url: string }): Promise<any>;
export function request(optOrUrl: string | Option & { url: string }, opt?: Option): Promise<any> {
  return Promise.resolve();
};
request('', { method: 'GET' });
request({ method: 'GET', url: '' });
```

> TypeScript 的函数重载不同于 Java，实际的函数实现只有 1 个而不是多个，函数重载只是更好的类型描述。

--- 

# 类型收缩（Type Narrowing）& union type

1. 一个值有多种类型。
2. 通过 `if/else` 或者 `switch` 语句限定为其中一种类型。

---

## Case: 接口返回不同类型的数据

```ts
interface HotelItem {
  type: 'hotel';
  data: {
    hotelId: string;
    hotelName: string;
  };
}

interface FlightItem {
  type: 'flight';
  data: {
    departCityCode: string;
    arrivalCityCode: string;
  }
}

type Item = FlightItem | HotelItem;

// test
export function test(item: Item) {
  if (item.type === 'flight') {
    console.log(item.data.arrivalCityCode, item.data.departCityCode);
  }

  if (item.type === 'hotel') {
    console.log(item.data.hotelId, item.data.hotelName);
  }
}
```

---

## Case: 多种状态

```ts
type NetworkLoadingState = {
  state: "loading";
};

type NetworkFailedState = {
  state: "failed";
  code: number;
};

type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};

type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;

function handleState(state: NetworkState) {
  switch (state.state) {
    case 'failed':
      console.log(state.code);
      break;
    case 'loading':
      break;
    case 'success':
      console.log(state.response);
      break;
  }
}
```

---

# 类型推导

## 泛型

1. 动态类型。
2. 无法提前定义。
3. 类型可以重复利用。
4. 对类型进行编程。
   
---

比如有 2 个接口，一个获取用户信息，一个获取酒店信息。

```ts
export interface GetUserResponse {
  success: boolean;
  code: number;
  user: {
    username: string;
    userId: string;
  };
}

export interface GetHotelResponse {
  success: boolean;
  code: number;
  hotel: {
    hotelId: string;
    hotelName: string;
  };
}
```

---

`GetUserResponse` 和 `GetHotelResponse` 有共同的属性 `success` & `code`，可以抽象出一个 `Response` 类型。

```ts
export type Response<T> = T & {
  success: boolean;
  code: number;
}

type GetUserResponse = Response<{
  user: {
    username: string;
    userId: string;
  };
}>

type GetHotelResponse = Response<{
  hotel: {
    hotelId: string;
    hotelName: string;
  };
}>
```

---

## Case: Array map 函数

另外一个例子：`Array.prototype.map` 函数。
在 `map` 函数定义里 `T` 和 `U` 都是一个抽象类型，只有在调用的时候编译器依据传入的参数确定它的类型。

```ts
interface Array<T> {
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[];
}
```

---

## React 的组件类型也使用到了泛型。

```ts
// 简化的 react component 类型
type FunctionComponent<P> = (props: P & { children: any }) => Node;
interface ClassComponent<S, P> {
  state: S;
  props: P & { children: any };
  setState(newState: Partial<S>);
  render(): Node;
}
```

---

## Case：Table 组件

```tsx
import React from 'react';
interface TableProps<T> {
  dataSource: T[];
  renderColumn: (col: T) => React.ElementType;
}
const Table = function<T>(props: React.PropsWithChildren<TableProps<T>>) {
  return null;
};
const el = (
  <Table
    dataSource={[{ key: '1', value: 1 }, { key: '2', value: 2 }]}
    renderColumn={(col) => {
      col.key;
      col.value;
      return null;
    }}
  />);
```

---

## extends

泛型可以表示一个待定的类型，extends 则可以用来约束类型范围。

### Case：包装函数

```ts
/**
 * wrap async function
 * log error when catch error
 * @param fn
 */
function wrapAsyncFunction<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return function wrapper(...args: any[]) {
    return fn.apply(this, args)
      .catch(err => {
        console.error(err);
        throw err;
      });
  } as T;
}

let wrapped = wrapAsyncFunction(() => Promise.resolve(''));
let wrapped2 = wrapAsyncFunction(() => ''); // error: Type 'string' is not assignable to type 'Promise<any>'
```

---

## Case: spyOn 函数。

```ts
type FindFuncProperty<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => any ? P : never;
}[keyof T];

type MockFunction<R, Args extends any[]> = {
  (...args: Args): R;
  mock: any;
  mockImplementation(impl: (...args: Args) => R): void;
  mockResolveValue(val: R): void;
  calls: Array<Args>;
}

export interface SpyOn {
  <T, K extends FindFuncProperty<T>>(target: T, key: K): MockFunction<ReturnType<T[K]>, Parameters<T[K]>>;
}

let spyOn: SpyOn = () => {
  throw new Error('not implementation');
};
let obj = {
  foo: 'bar',
  bool: true,
  num: 1,
  syncMethod(arg: string) { },
  async asyncMethod(arg: number) { },
}
let fn1 = spyOn(obj, 'syncMethod');
let fn2 = spyOn(obj, 'asyncMethod');
fn1('2');
fn2.calls[0][0].toFixed; // number
```

---

# infer

infer 可以在 extends 条件语句中表示待推断的类型变量，主要配合 extends 使用。

```ts
export type Awaited<T> = T extends Promise<infer R> ? Awaited<R> : T;
type Test1 = Awaited<Promise<Promise<string>>>;


type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Test2 = ReturnType<(...args: any[]) => { foo: 'bar' }>;


type ArgumentsType<T> = T extends (...args: infer R) => any ? R : never;
type Test3 = ArgumentsType<(foo: string, bar: number, opt: { enable: boolean }) => any>;
```

---

# 总结

1. 类型表达数据结构。
2. 工具函数处理数据，对应的类型也需要表达逻辑。
3. 泛型类似一个参数，`extends` 是一个三元运算符，`infer` 可以方便的获取类型， 这 3 个组合可处理大部分 Typescript 的类型。

---

# 扩展：模板字符串类型

模板字符串类型是 Typescript 4.1 新引入的特性，类型 ES6 的 string template 语法，
可以在字面量字符串类型中嵌入泛型类型。

Example:

```ts
type EventName<T extends string> = `${T}Changed`;
type Concat<S1 extends string, S2 extends string> = `${S1}${S2}`;
type ToString<T extends string | number | boolean | bigint> = `${T}`;
type T1 = EventName<'foo' | 'bar' | 'baz'>;  // 'fooChanged' | 'barChanged' | 'bazChanged'
type T2 = Concat<'Hello', 'World'>;  // 'HelloWorld'
type T4 = ToString<'abc' | 42 | true | -1234n>;  // 'abc' | '42' | 'true' | '-1234'
```

---

# Case: ares

```ts
type AvailableAresURL<T> = {
  [Alias in keyof T]: Alias extends string
    ? keyof T[Alias] extends string
    ? `module://${Alias}/${keyof T[Alias]}`
    : never
    : never;
}[keyof T];

export interface GetUrl<M = Record<string, Record<string, string>>> {
  <P extends AvailableAresURL<M>>(path: P): string;
}

type MyAresManifest = {
  moduleA: {
    'path/to/imag': 'xxx.png',
    'path/to/js': 'xx.js',
    'path/to/css': 'xx.css',
  };
  moduleB: {
    'path/to/font': 'xxx.woff',
    'path/to/svg': 'xx.svg',
  };
};
let getUrl: GetUrl<MyAresManifest> = (() => { }) as any;
let url = getUrl('module://moduleA/path/to/css');
```

---

# Case: replace

```ts
type ParseStringParams<T extends string, Params = {}> = T extends `${infer Prefix}{${infer Param}}${infer Rest}`
  ? ParseStringParams<Rest, Merge<Params & ParamRecord<Param>>>
  : Params;

type ParamRecord<Keys extends keyof any> = {
  [P in Keys]: any;
}

type Merge<T> = {
  [P in keyof T]: T[P];
}

export interface ReplaceFn {
  <I extends string>(input: I, args: ParseStringParams<I>): string;
}

let fn: ReplaceFn = (() => { }) as any;
fn('arg {foo} + {bar}', {
  foo: 'foo',
  bar: 'bar',
});
type Test = ParseStringParams<'{foo} + {bar}'>
```

---

# Thank You