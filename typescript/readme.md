# TypeScript

## 为什么需要 TypeScript

### 软件研发

一个复杂软件的常规研发流程，大致分为定义问题、需求分析、规划构建、软件架构、详细设计、编码调试、单元测试、集成测试、集成、系统测试、保障维护。构建活动（主要是编码调试）在中大型项目中的工作量占比大于50%。同时，一个中大型项目，bug由构建阶段引起的比例占到50%~75%，对于一个成功的项目来说，构建活动是必须要做的，而且是工程师更为可控的。 【代码大全】

### JavaScript 的特点（优缺点）

- 脚本语言，没有编译阶段。
- 万物都是对象。
- 宽松的对象访问控制
- 原型链
- 类型装换

优点：灵活，几乎没有访问限制，可以动态指定函数的执行语境，动态混入，动态修改原型，动态修改原型链，甚至能够修改原生对象的原型。

缺点：较高的灵活性，导致代码中的信息不足而且分散，ide 无法很好的做的智能提示，开发人员难以在开发时就发现 bug，很多 bug 都是在运行时被发现。

### 怎样解决

类型系统的定义: 类型（typing）赋予一组比特某个意义。类型通常和存储器中的数值或对象（如变量）相联系。因为在电脑中，任何数值都是以一组比特简单组成的，硬件无法区分存储器地址、脚本、字符、整数、以及浮点数。类型可以告知程序和程序设计者，应该怎么对待那些比特

TypeScript = Type(类型系统) + JavaScript，TypeScript 给 JavaScript 中的各种数据增加类型，虽然一定程度上限制了灵活性，但是增加了代码的信息，极大的增强了代码的健壮性。

- 增加可读性。加上了类型系统，对于阅读代码的人和编译器都是友好的。对阅读者来说，类型定义加上 IDE 的智能提示，增强了代码的易读型；对于编译器来说，类型定义可以让编译器揪出隐藏的bug。
- 提高开发效率。虽然需要多写一些类型定义代码，但只需写一次，相比较 JS 写完之后需要反复翻阅才能了解用法，一定程度上可以提升整体的开发效率。
- 易于维护，方便重构。有了强类型约束和静态检查，以及智能IDE的帮助下，可以在编译期提前暴露 bug，减少生产环境下的 bug 的数量，提升可维护性，而且可以更方便安全的重构。

## TypeScript 是什么

### TypeScript 的设计目标

- JavaScript 的严格超集，完全兼容 JavaScript 语法，任何现有的 JavaScript 程序都是合法的 TypeScript 程序
- 兼容 JavaScript 的生态系统，js 文件和 ts 文件在一个项目中可以共存。
- 渐进式改造
- 良好的 IDE 代码提示，代码检查

### TypeScript 简介

#### 基本语法

> 变量: type

`type` 可以不写，typescript 支持类型推导，无法推导的默认为 `any`

```ts
let x: string;
function foo(arg: boolean): void {};

let z; // any
function fn(arg) {}; // fn(arg: any): void;
[2, 3].map(v => {
  v; // number
});
```

#### 关键字

- type  声明一个新类型
- declare  仅仅声明，没有实际的
- interface  接口
- implements
- extends
- enum  枚举
- keyof  索引类型查询操作符
- typeof

#### 类型

- boolean
- number
- string
- symbol
- object
- null/undefined
- array

```ts
let numArr: number[] = [1, 2, 3];
let strArr: string[] = ['foo', 'bar'];
```

- tuple

已知元素数量和类型的数组。

```ts
let x: [number, string, boolean] = [2, 's', true];
```

- enum

`emum` 类型是对 JavaScript 类型的补充，枚举类型可以为一组数值赋予友好的名字

```ts
enum Color { Red, Green };
let color: Color = Color.Green;
console.log(color); // 1
console.log(Color) // { 0: Red, 1: Green, Red: 0, Green: 1 }
```

- any

`any` 类型表示任意类型，被标注了 `any` 类型的变量能够通过所有类型检查。

```ts
let foo: any;
foo = 1;
foo = 'bar';
foo = true;
let x: string = foo;
let y: number = foo;
```

- void/never

常用于表示函数的返回值。void 表示一个函数没有返回值， never 表示无法得到一个函数的返回值，函数总是抛出错误而无法到达终点。

```ts
function nothing(): void {
  return;
}

function error(msg: string): never {
  throw new Error(msg);
}
```

- unknow(3.0 新增)

`any` 类型的安全副本，任何类型可以赋值给 `unknow` 类型，但是 `unknow` 类型不能赋值给其他类型;

```ts
let foo: unknow;
foo = 1;
foo = 'bar';
foo = true;
let x: string = foo;  // Error
let y: number = foo;  // Error

function is(val: unknow) {
  if (typeof val === 'string') {
    val; // string
  } else if (val instanceof Error) {
    val; // Error
  }
}
```

##### 联合类型

JavaScript 中常常一个变量有多种类型，比如 ajax 获取到内容可能是 string 或者 number。联合类型则表示一个值可以是几种类型之一。

```ts
function isTrue(arg: number | string): boolean {
  if (typeof arg === 'string') {
    return arg === 'true';
  } else {
    return arg !== 0;
  }
}

function computeSize(size: 'large' | 'normal' | 'small' | number): number {
  switch (size) {
    case 'large':
      return 30;
    case 'normal':
      return 20;
    case 'small':
      return 10;
    default:
      return size;
  }
}
```

##### keyof

JavaScript 常常需要遍历对象的 property，TypeScript 提供 `keyof` 作为对象的索引类型查询。`keyof T` 看做是 `T` 的属性名称，是 `string` 的子类型。

```ts
interface Person {
    name: string;
    age: number;
    location: string;
}

type K1 = keyof Person;  // "name" | "age" | "location"
type K2 = keyof Person[];  // "length" | "push" | "pop" | "concat" | ...
type K3 = keyof { [x: string]: Person };  // string
```

##### 类型推论

不同于 Java，TypeScript 不要求一定写明类型，在有些没有明确指出类型的地方，TypeScript 会使用类型推论自动推断类型，无法推断的，默认会被处理成 `any` 类型。

- 1,一个变量被赋值（包括默认赋值），自动推断为对应的类型;
- 2,类型有多种可能是，取交集。
- 3,回调函数会依据签名自动推断上下文的类型。
- 4,无法推断，类型为 any。

```ts
let a = 2; // a: number

function run(b = '') {
  b; // string
}

[2, 'true'].forEach(v => {
  // v: string | number = String.prototype & Number.prototype
  v.toString()
  v.valueOf();
  v.substr();  // Error
  v.toFixed(2);  // Error
});

function read(file, cb: (content: string) => void) { };

read('file.name', (content) => {
  content; // string
});

let x; // any
```

##### 类型断言

对于 TypeScript 无法推断的类型，允许手动指定类型。

> <类型>变量
>
> 变量 as 类型

```ts
let x: null;
x.toFixed(2);  // Error
(x as number).toFixed(2);  // x: number
(x as any).t();  // 指定为 any 类型,TypeScript 不再检查类型
let z = <number>x;  // z: number
z.toFixed(2);
```

##### 类型别名

类型别名会给一个类型起个新名字。 类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。

```ts
type AllowHttpMehtod = 'GET' | 'POST' | 'DELETE' | 'PUT';
type ErrorCode = 101 | 102 | 103 | 104;
type Status = [boolean, string];
```

#### interface

不同于 Java,C# 的 `interface` ， TypeScript 的 `interface` 是鸭子类型。

Java 中一个类 implements 一个 interface，这个类实例化的对象拥有 interface 定义的方法，TypeScript 只需要对象包含这些定义的方法。

> “当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子“   --[Who's Sitting on Your Nest Egg?](http://books.google.com/books?id=PEoti64PICIC&pg=PA7&dq=%22James+Whitcomb+Riley%22+%22when+I+see+a+bird+that+walks+like+a+duck+and+swims+%22&ei=JsHcSejCBoToM7SKge0O)

```ts
interface Car {
  type: string;  // 属性
  readonly price: number;  // 只读属性
  name?: string;  // 可选属性
  run(): void;   // 方法
  stop: () => void;  // 方法
}

let car: Car;
car.type = 'car';  // string
car.price = 200;  // Error: Cannot assign to 'price' because it is a constant or a read-only property.
car.name;  // string | undefined
car.run();
car.stop();
```

##### 函数接口

JavaScript 中函数也是对象，TypeScript 的 `interface` 也能描述

```ts
interface SearchFn {
  (value: string): string[];
  new(value: string): { run(): string[] };
}

let Fn: SearchFn;
Fn('foo')[1] = 'foo';
let ins = new Fn('foo');
ins.run()[0] = 'foo';
```

##### 可索引的类型

对于一些 ArrayLike 的对象，能够通过索引访问属性，比如 `document.querySelectorAll` 返回的对象类似数组，可以通过 `a[0]` 获取。

```ts
interface Nodes {
  length: number;
  [key: number]: HTMLElement;
}

let list: Nodes;
list[0];  // HTMLElement

interface StringArray {
  [key: number]: string;
  [key: string]: string;
}
let arr: StringArray;
arr[1] = 'str';
arr.foo = 'str';
```

和 Java, C# 一样，`interface` 支持 `implements` 和 `extends`

```ts
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

class Circle implements Shape {
  color = 'red';
}

let square: Square;
square.color = "blue";
square.sideLength = 10;
let circle: Circle;
circle.color = 'white';
```

##### 交叉类型

#### 函数重载

TypeScript 支持一个函数有多个类型签名，不同于 Java，虽然有多个函数签名，但是实现任然只有一个，签名仅仅用作类型声明。

```ts
// 函数声明
function area(r: number): number;
function area(size: { width: number, height: number }): { area: number };

// 具体实现
function area(opt): any {
  if (typeof opt === 'number') {
    return opt * opt;
  } else {
    return opt.width * opt.height;
  }
}

let x = area(2);  // number
let y = area({ width: 1, height: 2 });
let z = area(true);  // Error
y.area = 33;
```

#### 泛型

泛型允许程序员在强类型程序设计语言中编写代码时使用一些以后才指定的类型，在实例化时作为参数指明这些类型。

```ts
// 不使用泛型
function map(arr: string[], cb: (item: string) => any): any[];
function map(arr: number[], cb: (item: number) => any): any[];
function map(arr: boolean[], cb: (item: boolean) => any): any[];

// 使用泛型
function map<T, S>(arr: T[], cb: (item: T) => S): S[];
map<string, number>(['2', '3', '4'], (v) => Number(v));
```

函数的参数可能有多种类型，具体使用哪种类型的参数由使用者指明。

`interface`,`class` 和 `type` 也支持泛型。

```ts
interface MapFn<T, S> {
  (arr: T[], cb: (item: T) => S): S[];
}

let mapStringToNumber: MapFn<string, number>;
mapStringToNumber(['2', '3', '4'], (v) => Number(v));

interface Generic<T> {
  value: T;
  add(x: T, y: T): T;
}

let generic: Generic<string> = {
  value: 'foo',
  add(x, y) {
    return x.toUpperCase() + y.toUpperCase();
  }
}
generic.add('foo', 'bar');


type List<T> = {
  length: number;
  [key: number]: T;
}

let list: List<string>;
list[1] = 'foo';
let list2: List<number>;
list2[1] = 22;


class GenericNumber<T> {
    defaultValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.defaultValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

数组也可以使用泛型表示

```ts
let arr: Array<string> = [];
// let arr: string[] = [];
arr[0] = 'foo';
```

泛型中的类型参数可以限制范围，被另一个类型参数限制。常常用在处理对象的属性上，确保该属性存在对象上。

```ts
function getProp<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
let obj = {
  name: 'x',
  age: 17
};
getProp(obj, 'name');  // string
getProp(obj, 'age');  // number
getProp(obj, 'address');  // Error: Argument of type '"address"' is not assignable to parameter of type '"name" | "age"'.
```

#### 命名空间

#### 声明合并

JavaScript 中一些设计模式下，类的定义常常分散在不同的地方，比如扩展原生数组的原型 `Array.prototype.myFunction = () => {}`，TypeScript 的“类型合并”可以把同一个名字的多个独立声明合并为单一声明，合并后的声明同时拥有原先多个声明的特性。

##### 扩展对象。

```ts
interface Staff {
  name: string;
}

let staff: Staff;

staff.name = 'waner';

interface Staff {
  age: number;
}

staff.age = 17;
```

##### 扩展类

JavaScript 并没有实际的类，`class` 本质上只是一个 `function` 也就是一个 `object`，`class` 本身具有一个命名空间，同时描述了每一个实例的接口。`class` 可以和 `namespace` 和 `interface` 合并。

```ts
class Album {
  // 静态属性
  static label: string = '';
  // 实例的方法
  names(): string[] {
    return [''];
  }
}

Album.label = 'label';
let album = new Album();
album.names();

// 扩展 Album 的静态属性
namespace Album {
  export let type: string;
}
Album.type = 'type';

// 扩展 Album 的实例的方法
interface Album {
  name(): string;
}
Album.prototype.name = () => '';
album.name();
```

##### 扩展模块

当对象的描述在不同的文件时，扩展模块非常实用。

需要扩展的必须通过 `export {name}` 导出，无法扩展通过 `export default` 导出的（这个导出的是一个匿名值）。

```ts
// app.js
export class Car {
  static type: string = 'family';
  run() {
    console.log('car run');
  }
}
export default Car;


// ext.js
import Car from './app';

declare module './app' {
  // 扩展原型
  interface Car {
    fly(): void;
  }
  // 扩展 Car 类的静态属性
  namespace Car {
    export let spec: { description: string };
  }
}

Car.prototype.fly = function fly() {
  console.log('car fly.');
}
Car.spec = {
  description: ''
};

// index.js
import Car from './app';
import './ext';

let car = new Car();
car.run();
car.fly();
Car.name;
Car.spec.description;
```

##### 全局扩展

在模块内部添加声明到全局作用域中。

```ts
// 扩展 nodejs gloabl 对象
declare global {
  // 扩展数组的方法
  interface Array<T> {
    myFn(): void;
  }
  // 扩展数组的静态属性
  interface ArrayConstructor {
    myProp: string;
  }
  namespace NodeJS {
    // 扩展 global 对象
    interface Global {
      myAttr: string;
    }
  }
}

Array.prototype.myFn = () => console.log('my fn.');
Array.myProp = '';
global.myAttr = 'some';


// 扩展 window 对象和 document 对象
interface Window {
  myWinProp: string;
  myFunc(): number;
}

interface Document {
  myDocProp: string;
}

window.myWinProp = '';
window.myFunc = () => 2;
document.myDocProp = '';
```

#### 内置函数

#### .d.ts

### TypeScript 的解决方案

## 怎样使用

TypeScript 可以通过 npm 全局安装

```shell
npm install -g typescript
npm install -g ts-node
// or
yarn gloabl add typescript
yarn gloabl add ts-node
```

新建 hello-world.ts

```ts
function main(word: string): void {
  console.log('hello ' + word);
}

main('TypeScript');
```

在命令行运行 `tsc` 的命令，编译 `.ts` 文件，生成 `hello-world.js` 并使用 `node` 运行

```shell
tsc hello-world.ts && node hello-world.js
```

或者直接使用 `ts-node` 直接运行 `hello-world.ts` (不建议生产环境使用)

```shell
ts-node hello-world.ts
```

也可以通过 `tsconfig.json` 详细配置

```json
// https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
{
  "compilerOptions": {
    "lib": [
      "esnext",
      "dom",
    ],
    "rootDir": ".",
    "outDir": "dist",
  },
  "include": [
    "src/*",
    "src/**/*"
  ]
}
```

## 我应该使用 TypeScript 吗？

## 社区生态和未来

- [deno]() deno
- [vscode]()
- [Angular]()

## Refernces

- [文档](https://www.typescriptlang.org/docs/home.html)
- [中文文档](https://www.tslang.cn/docs/home.html)
- [github](https://github.com/Microsoft/TypeScript)
- [TypeScript体系调研报告](https://juejin.im/post/59c46bc86fb9a00a4636f939)
