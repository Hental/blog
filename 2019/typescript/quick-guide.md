# TypeScript 快速入门

## 项目搭建

1. `npm install typescript --save-dev` 安装 typescript 依赖。
2. `npx tsc --init` 生成 tsconfig.json 配置文件，添加配置`"include": ["src/"]`。详细配置参考: [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html), [Compiler Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
3. package.json 添加 script: `"build": "tsc"`。
4. 运行 script: `npm run build`

> 如果你使用 babel7，只需要添加 @babel/preset-typescript 就可以编译 .ts 文件，不过不会检查类型，即使类型错误也一样能够成功编译，类型检查依然需要使用 `tsc` 命令。详情参考:[@babel/preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript)

> 可以使用 [tslint](https://palantir.github.io/tslint/) 检查代码风格

> 一个在线的环境 [http://www.typescriptlang.org/play/index.html](http://www.typescriptlang.org/play/index.html)

## 编写类型

### 基本类型

JavaScript 的6种类型都有对应的类型，基本类型都是小写。

```typescript
let num: number = 0;
let str: string = '0';
let bool: boolean = true;
let nu: null = null;
let un: undefined = undefined;
let sym: symbol = Symbol();
```

除此之外，TypeScript 还有字面量类型，可以将一个特定的字符串类型或者数字当做一个类型。

```typescript
let specialStr: 'hello' = 'hello'; // specialStr 的类型只能是 'hello' 字符串
let specialNum: 1 = 1;
specialStr = 'world' // Error: 'world' 不能赋值给类型 'Hello'
```

它们本身并不是很实用，但是可以通过类型别名在一个联合类型中组合创建一个强大的（实用的）抽象：

```ts
type CustomType = 'foo' | 'bar'; // 自定义了一个类型，类型是 'foo' 或者 'bar' 字符串
function doSomethingByType(type: CustomType) {
  switch(type) {
    case 'foo':
      // do something
      break;
    case 'bar':
      // do something
      break;
    case 'other': // Error: Type '"other"' is not comparable to type 'CustomType'.
      break;
    default:
      break;
  }
}
```

### 对象

JavaScript 的世界里，除了基本类型都是对象，TypeScript 也能够描述这些对象的类型。

#### interface

最简单的对象可以通过 interface 描述。

```ts
// 描述了 Offset 对象有 4 个属性，top、left、right、bottm 且都是 number 类型。
interface Offset {
  top: number;
  left: number;
  right: number;
  bottom: number;
}
let offset: Offset = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

interface I18n {
  [key: string]: string; // 说明该对象的任意属性的类型都是 string 类型
}
let i18n: I18n;
let val: i18n.key; // string
```

#### 可选和只读

```ts
interface OffsetWithParent {
  readonly top: number; // 只读属性，不可以修改
  readonly left: number;
  readonly right: number;
  readonly bottom: number;
  parent?: OffsetWithParent; // 可选属性，parent 属性不一定存在该对象上
}

function computeOffset(offset: OffsetWithParent) {
  offset.parent.bottom; // Error: Object is possibly 'undefined'.
  offset.top = 0; // Error: Cannot assign to 'top' because it is a read-only property.
}
```

#### 泛型

在 c++，java 等静态类型语言里，泛型是一种非常常见的特性，泛型能够帮助复用类型，使用一种类型表达多种含义，比如：

```ts
interface ValueObject<T> {
  type: string;
  value: T;
}
let val1: ValueObject<number>;
let val2: ValueObject<boolean>;
val1.value; // number
val2.value; // boolean

// 数组也可以通过泛型表达
let arr: string[];
let arr2: Array<string>;
arr === arr2;
```

#### keyof 与查找类型

在 JavaScript 生态里常常会有 API 接受属性名称作为参数的情况，keyof 可以得到一个对象可能的属性名称的类型，返回一个联合类型，是 string 的子类型。

```ts
interface Person {
    name: string;
    age: number;
    location: string;
}

type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[];  // "length" | "push" | "pop" | "concat" | ...
type K3 = keyof { [x: string]: Person };  // string
```

与之对应的是索引访问类型, 也叫作查找类型 (lookup types). 语法上, 它们看起来和元素访问完全相似, 但是是以类型的形式使用的:

```ts
type P1 = Person["name"];  // string
type P2 = Person["name" | "age"];  // string | number
type P3 = Person["name"]["charAt"];  // (pos: number) => string
type P4 = Person[]["push"];  // (...items: Person[]) => number
type P5 = Person[][0];  // Person
```

通过 `keyof` 可以拿到所有的索引，通过一个简单的循环便可以对 interface 处理，得到一个映射类型：

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
type PartialPerson = Partial<Person>; // { name?: string; age?: number; location?: string }

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type PickPersonName = Pick<Person, 'name'>; // { name: string }
type PickPersonNameAndAge = Pick<Person, 'name' | 'age'>; // { name: string; age: number; }
```

#### 函数和类

在 JavaScript 的世界，类本质是一个函数，函数本质是一个对象，也可以通过 interface 描述：

```ts
interface Fn {
    (arg1: number): string;
    new (arg1: string): number;
    customProp: boolean;
  }

let fn: Fn;

let ins = new fn('1'); // number
let val = fn(1); // string
fn.customProp // boolean
```

### 函数

```ts
// named function
function add(x: number, y: number) {
  return x + y;
}

// anonymous function
let myAdd = function(x: number, y: number) { return x + y; };

// arrow function
let plus = (x: number) => x + 1;
```

#### 默认值，可选值，剩余参数和对象解构

TypeScrip 支持 ES6 的默认默认值，可选值和剩余参数，当参数是对象时也支持结构。

```ts
function buildName(firstName: string, lastName: 'Will') {
    return firstName + " " + lastName;
}
buildName('Bob'); // 'Bob Will'
buildName('Bob', 'Jack') // 'Bob Jack'

function add(...args: number[]) {
  return args.reduce((prev, cur) => prev + cur, 0);
}
add(1, 2, 3); // 6
add(1, 2); // 3

function computeArea({ width, height }: { width: number; height: number }) {
  return width * height;
}
computeArea({ width: 1, height: 1 }); // 1
```

#### 重载

函数常常接受多种类型的参数，依据不同的参数类型返回不同类型的返回值，比如：

```ts
function coverType(val: string): number;
function coverType(val: number): string;
function coverType(val: number | string): string | number {
  if (typeof val === 'number') {
    return String(val);
  } else {
    return Number(val);
  }
};
let a = coverType(1); // '1'
let b = coverType('1'); // 1
```

#### 泛型

函数也支持泛型：

```ts
interface Config {
  interval: number;
  type: string;
  enable: boolean;
}
let cfg: Partial<Config> = {};
function setConfig<T extends keyof Config>(key: T, val: Config[T]) {
  cfg[key] = val;
}
setConfig('enable', true);
setConfig('interval', 1);
setConfig('type', 'foo');
```

### 类型推导

不同于 Java，TypeScript 会依据已有的信息推导出一些类型信息，不需要每一个声明都要标注类型信息。

```ts
let num = 2; // 推导出 num 的类型是 number;
let arr = [1, 2, 3] // 推导出 arr 的类型是 number[];

let isZero = (num: number) => num === 0; // 推导出返回值是 boolean

window.onmousedown = function(mouseEvent) { // 推导出 mouseEvent 的类型是 MouseEvent
    console.log(mouseEvent.button);   //<- OK
    console.log(mouseEvent.kangaroo); //<- Error!
};
```

### infer

我们通过 `extends` 写简单的三目运算，`infer` 则可以在 `extends` 条件语句中充当一个占位符，是一个带推导的类型。

```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
type CreateSquare = (size: number) => { x: number; y: number };
type Square = ReturnType<CreateSquare>; // { x: number; y: number }

type PromiseInnerType<T extends Promise<any>> = T extends Promise<infer R> ? R : any;
type AsyncReturnType<T extends (...args: any) => Promise<any>> = PromiseInnerType<ReturnType<T>>;
type AsyncCreateSquare = (size: number) => Promise<{ x: number; y: number }>;
type AsyncSquare = AsyncReturnType<AsyncCreateSquare>; // { x: number; y: number }
```

## 第三方包的类型声明

除了自己的项目，我们常常用到一些第三方包，大部分包都是通过 JavaScript 编写，缺少类型提示，一部分可以通过 `npm install --save-dev @types/xxx`解决，一部分没有的需要自己为这些第三方包写类型声明。

在项目根目录下新建 `typings` 文件夹，在该文件夹下可以编写 TypeScript 类型文件。

```ts
declare module 'some-third-lib' {
  interface Manager {
    init(): void;
    add(item?: string): Manager;
  }
  export let manager: Manager;
  export function doSome(arg1: number, arg2: string): boolean;
}

// 扩展 window 对象
interface Window {
 jQuery: any;
 requirejs: any;
}

namespace NodeJS {
 // 扩展 global 对象
 interface Global {
   customProp: string;
 }
}

// 扩展 Array 原型
interface Array<T> {
  customFn(): string;
}

// 扩展 Array 对象
interface ArrayConstructor {
  customProp: number;
}

declare module 'koa' {
  // 扩展 koa ctx 对象
  interface Context {
    customProp: any;
  }
}

declare module 'http' {
  // 扩展 request 对象
  interface IncomingMessage {
    body: any;
  }
}
```

### 注意

1. TypeScript 的类型仅仅在编译时做类型检查，运行时并没有类型信息，对外的 api 依然需要判断空值。
2. 尽量避免 `any` 类型的使用，在确实难以表达类型时，可以使用类型断言标志类型信息，例：`(window as any).i18n`;
3. TypeScript 有 `.ts` 和 `.d.ts` 两种文件类型，`.d.ts` 仅仅描述类型信息，不包含实际的代码。
