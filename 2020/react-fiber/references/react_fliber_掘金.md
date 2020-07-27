# React Fiber

[React Fiber](https://juejin.im/post/5ab7b3a2f265da2378403e57)

## 权重

1. 低优先级任务由requestIdleCallback处理；
2. 高优先级任务，如动画相关的由requestAnimationFrame处理；
3. requestIdleCallback可以在多个空闲期调用空闲期回调，执行任务；
4. requestIdleCallback方法提供deadline，即任务执行限制时间，以切分任务，避免长时间执行，阻塞UI渲染而导致掉帧；

## work loop

workInProgressTree

追踪 2 个东西

1. 下一个工作单元（下一个待处理的fiber）;
2. 当前还能占用主线程的时间

### get update state

通常我们现在在调用setState传入的是一个对象，但在使用fiber conciler时，必须传入一个函数，函数的返回值是要更新的state。react从很早的版本就开始支持这种写法了，不过通常没有人用。在之后的react版本中，可能会废弃直接传入对象的写法。
