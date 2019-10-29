# Vue3 源码导读 - reactivity

Vue3 使用 TypeScript 重构，基于 function base 设计 api，目前源代码不多，适合阅读。

## 设计目标

Reactivity 的目标是实现一套数据响应系统，能够自动追踪数据的使用和流向。

## example

```ts
import { effect, reactive, computed } from '@vue/reactivity';

const reactiveValue = reactive({ data: 1 });

// 当 reactiveValue 的 data 改变时，触发该回调
effect(() => {
    console.log(reactiveValue.data);
});

// 当 reactiveValue 的 data 改变时，重新计算
const computedValue = computed(() => reactiveValue.data);

// 当 computedValue 改变时，触发该回调
effect(() => {
    console.log(computedValue.value);
});

// 改变了 reactiveValue.data
// => 自动触发第一个 effect， 重新计算 computedValue
// => 触发第二个 effect
reactiveValue.data = 2;
console.log(computedValue.value); // 2
```

## Api

### reactive

创建一个

```ts
export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
```

### effect

### computed

### ref

## implement

### Object.defineProperty

