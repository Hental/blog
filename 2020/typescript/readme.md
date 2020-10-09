# 如何用 Typescript 写出准确的类型

## 扩展对象

合并 2 个具有相同名称的类型。

1. 在请求的 request 对象上新增一个属性。

[shark-js-sdk](http://git.dev.sh.ctripcorp.com/shark/shark-js-sdk/blob/master/index.d.ts)

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

2. 扩展全局对象（比如 window、global）。

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

3. 扩展原型对象。

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

// test.ts
import { MyClass } from './class';
import './extension';

const ins = new MyClass();

ins.extendFn

const arr = [];
arr.mySort();
```

## 函数

### Function Type

```ts
let add: (x: number, y: number) => number = (x, y) => x + y;

function addFn(x: number, y: number): number {
  return x + y;
};
```

### Function Interface

除了使用 `type`，还可以使用 `interface`。

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

### 函数重载

函数重载适用于有多种函数入参。

`request` 函数有 2 种入参，一种是传入 `url` 和 `option`，一种是只传入 `option`。

> TypeScript 的函数重载不同于 Java，实际的函数实现只有 1 个而不是多个，函数重载只是更好的类型描述。

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

## 类型保护

当一个值有多种类型，在不同的 `if/else` 的分支下处理时可以依据 *type guard* 把类型收缩到某个确定的类型。

### typeof & instanceof

```ts
// typeof
function createArray(input: number | { length: number }): any[] {
  if (typeof input === 'number') {
    // 在这个分支下，input 的类型确定为 number 类型
    return Array(input);
  }

  if (typeof input === 'object') {
    // 在这个分支下，input 的类型确定为 { length: number } 类型
    return Array(input.length);
  }
}
```

```ts
// instanceof
class Car {
  ride(): void {};
}

class Bike {
  run(): void {};
}

function doSome(item: Car | Bike) {
  if (item instanceof Car) {
    // 在这个分支下，item 的类型确定为 Car 类型
    item.ride();
  }

  if (item instanceof Bike) {
    // 在这个分支下，item 的类型确定为 Bike 类型
    item.run();
  }
}
```

### union type

Case: 接口返回不同类型的数据

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

Case: 多种状态

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

## 类型推导

### 泛型

1. 动态类型。
2. 无法提前定义。
3. 类型可以重复利用。
4. 对类型进行编程。

Example: 比如有 2 个接口，一个获取用户信息，一个获取酒店信息。

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

另外一个例子：`Array.prototype.map` 函数。
在 `map` 函数定义里 `T` 和 `U` 都是一个抽象类型，只有在调用的时候编译器依据传入的参数确定它的类型。

```ts
interface Array<T> {
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[];
}
```

React 的组件类型也使用到了泛型。

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

Table 组件也适合使用泛型。

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

### extends

泛型可以表示一个待定的类型，extends 可以用来约束类型范围。

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

### infer

infer 可以在 extends 条件语句中表示待推断的类型变量。

```ts
export type Awaited<T> = T extends Promise<infer R> ? Awaited<R> : T;
type Test1 = Awaited<Promise<Promise<string>>>;


type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Test2 = ReturnType<(...args: any[]) => { foo: 'bar' }>;


type ArgumentsType<T> = T extends (...args: infer R) => any ? R : never;
type Test3 = ArgumentsType<(foo: string, bar: number, opt: { enable: boolean }) => any>;
```

## 模板字符串类型

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

Case: ares

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

Case: replace

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

## 帮助类型

[doc](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## Tool

1. [soa-type](http://npm.release.ctripcorp.com/package/@ctrip/soa-type)

## References

1. [handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
2. [深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/)
3. [Template String Type](https://github.com/microsoft/TypeScript/pull/40336)
4. [infer](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types)
5. [Type Gymnastics](https://github.com/g-plane/type-gymnastics)
