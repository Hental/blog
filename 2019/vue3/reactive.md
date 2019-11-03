# Vue3 源码导读 - reactivity

Vue3 使用 TypeScript 重构，基于 function base 设计 api，建议先阅读 [function api RFC](https://github.com/vuejs/rfcs/blob/function-apis/active-rfcs/0000-function-api.md)

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

## Api

核心的 Api 是 `reactive` 方法和 `effect` 方法。`reactive` 包装数据源，转化成一个可以响应的对象，`effect` 包装一个函数，函数作为消费者会在数据发生改变时候触发。

```ts
// 把原始数据转化为可响应的对象
export function reactive<T extends object>(target: T): T

// 判断是否是可响应数据
export function isReactive(value: unknown): boolean

// 讲可相应数据转化为原始数据。
export function toRaw<T>(observed: T): T

// 标记数据为不可响应。
export function markNonReactive<T>(value: T)

// 监听依赖的响应式数据，当数据发生改变时触发的回调函数。
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

先从单元测试了解 reactive 和 effect 用法

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

## 源码解析

reactivity 类似一个 EventEmitter，reactive 提供一个可以使用的数据源，effect 注册一个回调函数，在数据发生改变的时候，自动触发该回调函数。实现的关键点主要有 2 点:

1. 触发时机: 知道什么时候值发生改变
2. 消费数据: 收集所有使用该数据的消费者，在数据发生改变时通知消费者。

横向对比下 React Hooks，React Hook 提供了 `useState` api, useState 只能在组件内部使用，因此 React 能在调用该函数的时候把 state 和组件关联，函数也会返回一个 `setState` 的函数，在调用 setState 函数的时候 React 能够感知到值发生了改变。

### targetMap

```ts
// targetMap 存储的是依赖关系，key 是对象和属性，value 是相关联的副作用集合。
// The main WeakMap that stores {target -> key -> dep} connections.
// Conceptually, it's easier to think of a dependency as a Dep class
// which maintains a Set of subscribers, but we simply store them as
// raw Sets to reduce memory overhead.
export type Dep = Set<ReactiveEffect>
export type KeyToDepMap = Map<any, Dep>
export const targetMap = new WeakMap<any, KeyToDepMap>()
```

### track & trigger

targetMap 存储了数据和副作用的关系，track 函数存储了 reactive object 和 effect 的关联，收集所有使用过该数据的消费者，在数据发生改变时通知消费者，trigger 函数通过 targetMap 找到 track 收集到的所有的 effect, 循环执行。

```ts
enum OperationTypes {
  // using literal strings instead of numbers so that it's easier to inspect
  SET = 'set',
  ADD = 'add',
  DELETE = 'delete',
  CLEAR = 'clear',
  GET = 'get',
  HAS = 'has',
  ITERATE = 'iterate'
}

export function track(target: object, type: OperationTypes, key?: unknown) {
  if (!shouldTrack || effectStack.length === 0) {
    return
  }
  // 获取到当前的 effect
  const effect = effectStack[effectStack.length - 1]
  if (type === OperationTypes.ITERATE) {
    key = ITERATE_KEY
  }
  let depsMap = targetMap.get(target)
  // 判断是否存在，不存在则创建一个新的
  if (depsMap === void 0) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key!)
  if (dep === void 0) {
    depsMap.set(key!, (dep = new Set()))
  }
  if (!dep.has(effect)) {
    // 收集 effect
    dep.add(effect)
    effect.deps.push(dep)
    if (__DEV__ && effect.onTrack) {
      effect.onTrack({
        effect,
        target,
        type,
        key
      })
    }
  }
}

/**
 *
 * @param target
 * @param type
 * @param key
 * @param extraInfo
 */
export function trigger(
  target: object,
  type: OperationTypes,
  key?: unknown,
  extraInfo?: DebuggerEventExtraInfo
) {
  // 判断是否有 effect 使用该 object
  const depsMap = targetMap.get(target)
  if (depsMap === void 0) {
    // never been tracked
    return
  }
  const effects = new Set<ReactiveEffect>()
  const computedRunners = new Set<ReactiveEffect>()
  if (type === OperationTypes.CLEAR) {
    // collection being cleared, trigger all effects for target
    depsMap.forEach(dep => {
      // 收集要执行的回调函数
      addRunners(effects, computedRunners, dep)
    })
  } else {
    // schedule runs for SET | ADD | DELETE
    if (key !== void 0) {
      addRunners(effects, computedRunners, depsMap.get(key))
    }
    // also run for iteration key on ADD | DELETE
    if (type === OperationTypes.ADD || type === OperationTypes.DELETE) {
      const iterationKey = Array.isArray(target) ? 'length' : ITERATE_KEY
      addRunners(effects, computedRunners, depsMap.get(iterationKey))
    }
  }
  const run = (effect: ReactiveEffect) => {
    // 执行回调函数
    scheduleRun(effect, target, type, key, extraInfo)
  }
  // Important: computed effects must be run first so that computed getters
  // can be invalidated before any normal effects that depend on them are run.
  computedRunners.forEach(run)
  effects.forEach(run)
}
```

### reactive

reactive 中核心是 `createReactiveObject` 方法，创建一个代理对象，包装数据源。

```ts
function createReactiveObject(
  target: unknown,
  toProxy: WeakMap<any, any>,
  toRaw: WeakMap<any, any>,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
) {
  // 判断是否是对象，因为 Proxy 只支持 object
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // 避免多次实例化
  // target already has corresponding Proxy
  let observed = toProxy.get(target)
  if (observed !== void 0) {
    return observed
  }
  // target is already a Proxy
  if (toRaw.has(target)) {
    return target
  }
  // only a whitelist of value types can be observed.
  if (!canObserve(target)) {
    return target
  }
  const handlers = collectionTypes.has(target.constructor)
    ? collectionHandlers
    : baseHandlers
  // 创建 proxy 对象
  observed = new Proxy(target, handlers)
  toProxy.set(target, observed)
  toRaw.set(observed, target)
  if (!targetMap.has(target)) {
    targetMap.set(target, new Map())
  }
  return observed
}
```

baseHandlers 主要的就是数据的使用（getter）和 数据的修改（setter）, set 方法是修改数据，调用 trigger 函数，get 方法是获取数据，调用 track 函数。

```ts
function createGetter(isReadonly: boolean) {
  return function get(target: any, key: string | symbol, receiver: any) {
    // 获得结果
    const res = Reflect.get(target, key, receiver)
    // 调用 track 函数
    // 把这个对象（数据源）和真正运行的 effect 关联。
    track(target, OperationTypes.GET, key)
    // 判断get的值是否为对象，是的话将对象包装成 proxy（递归）
    return isObject(res)
      ? isReadonly
        ? // need to lazy access readonly and reactive here to avoid
          // circular dependency
          readonly(res)
        : reactive(res)
      : res
  }
}

function set(
  target: object,
  key: string | symbol,
  value: unknown,
  receiver: object
): boolean {
  value = toRaw(value)
  const oldValue = (target as any)[key]
  if (isRef(oldValue) && !isRef(value)) {
    oldValue.value = value
    return true
  }
  const hadKey = hasOwn(target, key)
  // 结果
  const result = Reflect.set(target, key, value, receiver)
  // don't trigger if target is something up in the prototype chain of original
  if (target === toRaw(receiver)) {
    /* istanbul ignore else */
    if (__DEV__) {
      const extraInfo = { oldValue, newValue: value }
      if (!hadKey) {
        // 执行关联的所有 effect 回调函数。
        trigger(target, OperationTypes.ADD, key, extraInfo)
      } else if (hasChanged(value, oldValue)) {
        trigger(target, OperationTypes.SET, key, extraInfo)
      }
    } else {
      if (!hadKey) {
        trigger(target, OperationTypes.ADD, key)
      } else if (hasChanged(value, oldValue)) {
        trigger(target, OperationTypes.SET, key)
      }
    }
  }
  return result
}
```

### effect

effect 方法只是简单的包装了回调函数。

```ts
export function effect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions = EMPTY_OBJ
): ReactiveEffect<T> {
  // 判断是否已经包装过
  if (isEffect(fn)) {
    fn = fn.raw
  }
  const effect = createReactiveEffect(fn, options)
  // computed effect 是在取值时触发
  // 默认为 false
  if (!options.lazy) {
    // 执行一次 effect 回调函数，收集依赖
    effect()
  }
  return effect
}

function createReactiveEffect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions
): ReactiveEffect<T> {
  // 包装回调函数
  const effect = function reactiveEffect(...args: unknown[]): unknown {
    return run(effect, fn, args)
  } as ReactiveEffect
  effect._isEffect = true
  effect.active = true
  effect.raw = fn
  effect.scheduler = options.scheduler
  effect.onTrack = options.onTrack
  effect.onTrigger = options.onTrigger
  effect.onStop = options.onStop
  effect.computed = options.computed
  effect.deps = []
  return effect
}
```

## summary

1. 通过 Proxy 劫持对象，基本类型通过 Ref 包装成对象。
2. 依赖关系存储在一个 targetMap 中。
3. 当获取一个 reactive 对象的值时，触发 track 函数，把当前的 effect 和该对象关联。
4. 当改变或者删除一个 reactive 对象的值时，触发 trigger 函数，调度关联的所有的 effect。
5. computed value 在 schedule 时不执行 getter，仅标记，在获取值得时候在执行 getter 函数。
