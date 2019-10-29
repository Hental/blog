# Vue3 源码导读 - reactivity

Vue3 使用 TypeScript 重构，基于 function base 设计 api，目前源代码不多，适合阅读。

[function api RFC](https://github.com/vuejs/rfcs/blob/function-apis/active-rfcs/0000-function-api.md)

## 为什么需要

## 设计目标

Reactivity 的目标是实现一套数据响应系统，能够自动追踪数据的使用和流向。

### example

```js
import * as Api from '@vue/reactivity';

const { effect, reactive, computed } = Api

const reactiveObject = reactive({ prop: 1 })
const reactiveArray = reactive([]);

// 当 reactiveObject 的 prop 改变时，触发该回调
const objectEffectRunner = effect(() => {
  console.log('call effect one:', reactiveObject.prop)
})

// 当 reactiveArray 内容发生改变时，触发该回调
const arrayEffectRunner = effect(() => {
  console.log('call effect two:', reactiveArray[0])
})

// 依赖 reactiveObject 的 prop value
// 当使用时才计算
const computedValue = computed(() => {
  const val = reactiveObject.prop;
  console.log('call compute', val)
  return val
})

// 当 computedValue 依赖的 reactiveObject 的 prop 改变时，触发该回调
const computeEffectRunner = effect(() => {
  console.log('call effect use computed value');
  console.log('value:', computedValue.value);
})

console.log('\nstart')
// 改变了 reactiveObject.prop
// => 自动触发 objectEffectRunner 和 computeEffectRunner
// => computeEffectRunner 需要获取 computedValue，触发重新计算
reactiveObject.prop = 2

// 改变了 reactiveArray 的内容
// => 自动触发 arrayEffectRunner
reactiveArray.push({ prop: 3 });

// console result:
//
// call effect one: 1
// call effect two: undefined
// call effect use computed value
// call compute 1
// value: 1
// start
// call effect one: 2
// call effect use computed value
// call compute 2
// value: 2
// call effect two: { prop: 3 }
```

### feature

- 当改变 reactive object value 时，自动触发 effect function。
- 支持新增属性，删除属性，修改属性。
- 支持数组(Collection)操作

## Api

### reactive

```ts
// 把原始数据转化为可响应的对象
export function reactive<T extends object>(target: T): T

// 判断是否是可响应数据
export function isReactive(value: unknown): boolean

// 讲可相应数据转化为原始数据。
export function toRaw<T>(observed: T): T

// 标记数据为不可响应。
export function markNonReactive<T>(value: T)
```

spec:

- 支持嵌套

```ts
test('nested reactives', () => {
  const original = {
    nested: {
      foo: 1
    },
    array: [{ bar: 2 }]
  }
  const observed = reactive(original)
  expect(isReactive(observed.nested)).toBe(true)
  expect(isReactive(observed.array)).toBe(true)
  expect(isReactive(observed.array[0])).toBe(true)
})
```

- 支持 Array

```ts
test('Array', () => {
  const original = [{ foo: 1 }]
  const observed = reactive(original)
  expect(observed).not.toBe(original)
  expect(isReactive(observed)).toBe(true)
  expect(isReactive(original)).toBe(false)
  expect(isReactive(observed[0])).toBe(true)
  // get
  expect(observed[0].foo).toBe(1)
  // has
  expect(0 in observed).toBe(true)
  // ownKeys
  expect(Object.keys(observed)).toEqual(['0'])
})
```

### effect

监听依赖的响应式数据，当数据发生改变时触发的回调函数。

```ts
export function effect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions,
): ReactiveEffect<T>

// 判断是否是 effect method
export function isEffect(fn: any): fn is ReactiveEffect

interface ReactiveEffectOptions {
  lazy?: boolean
  computed?: boolean
  scheduler?: (run: Function) => void
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
  onStop?: () => void
}

interface ReactiveEffect<T = any> {
  (): T
  // effect 标记
  _isEffect: true
  // 是否监听依赖
  active: boolean
  // 原始函数
  raw: () => T
  // 依赖
  deps: Array<Dep>
  // 是否是计算函数
  computed?: boolean
  // 自定义当依赖改变时的行为
  scheduler?: (run: Function) => void
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
  onStop?: () => void
}
```

## spec

```ts
it('should observe basic properties', () => {
  let dummy
  const counter = reactive({ num: 0 })
  effect(() => (dummy = counter.num))

  expect(dummy).toBe(0)
  counter.num = 7
  expect(dummy).toBe(7)
})

it('should observe multiple properties', () => {
  let dummy
  const counter = reactive({ num1: 0, num2: 0 })
  effect(() => (dummy = counter.num1 + counter.num1 + counter.num2))

  expect(dummy).toBe(0)
  counter.num1 = counter.num2 = 7
  expect(dummy).toBe(21)
})

it('should handle multiple effects', () => {
  let dummy1, dummy2
  const counter = reactive({ num: 0 })
  effect(() => (dummy1 = counter.num))
  effect(() => (dummy2 = counter.num))

  expect(dummy1).toBe(0)
  expect(dummy2).toBe(0)
  counter.num++
  expect(dummy1).toBe(1)
  expect(dummy2).toBe(1)
})
```

## 实现

1. 触发时机: 知道什么时候值发生改变
2. 消费数据: 收集所有使用该数据的消费者，在数据发生改变时通知消费者。

类似于 event emitter

### Proxy

Proxy 可以劫持对象，自定义对象的行为，如属性查找，赋值，枚举，函数调用等。

## computed

计算属性是一种特殊的 effect，只有当取值的时候才计算。

```ts
export function computed<T>(getter: () => T): ComputedRef<T>
export function computed<T>(
  options: {
    get: () => T,
    set: (v: T) => void,
  }
): WritableComputedRef<T>

export interface WritableComputedRef<T> {
  _isRef: true
  value: UnwrapRef<T>
  readonly effect: ReactiveEffect<T>
}

export interface ComputedRef<T> extends WritableComputedRef<T> {
  readonly value: UnwrapRef<T>
}
```
