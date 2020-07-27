# React Fiber 源码解读

## 设计

### 目标(Features)

- 暂停更新，并在稍后的时间更新 pause work and come back to it later.
- 合并不同工作的权重 assign priority to different types of work.
- 重复利用之前完成的工作 reuse previously completed work.
- 中断一些不在需要的工作 abort work if it's no longer needed.

### 现有的实现和问题

现有的 React 更新机制是递归遍历 React 组件树，同步更新完所有的组件。

## 概念

1. Render & Commit
2. UpdateQueue & Effect

### Fiber Object

```ts
interface Fiber {
  // 标记不同类型的 fiber
  // @see ReactWorkTags.js
  tag: WorkTag;

  key: string;
  
  // ReactElement.type，也就是我们调用`createElement`的第一个参数
  elementType: any;

  // 异步组件resolved之后返回的内容，一般是`function`或者`class`
  type: string;

  // 对组件实例或宿主元素实例（浏览器环境就是 DOM 节点）或者其他 React element 类型实例的引用
  stateNode: any;

  /**
    function Parent() {
      return [<Child1 />, <Child2 />]
    }
    Parent 的 child 指向 Child1
    Child1 的 sibling 指向 Child2
    Child1 和 Child2 的 return 指向 Parent
  */
  // 子节点
  child: Fiber;
  // 原地节点
  sibling: Fiber;
  // 父节点
  return: Fiber;
  index: number;

  // 更新组件带来的新的 props
  pendingProps: any;
  // 在上一个渲染期间的 props
  memoizedProps: any;

  // Effect 记录执行的任务（update, delete, replace, etc）
  // Effect 类型
  // @see ReactSideEffectTags.js
  effectTag: SideEffectTag;
  // Singly linked list fast path to the next fiber with side-effects.
  nextEffect: Fiber | null;
  // 子树中的第一个 effect
  firstEffect: Fiber | null;
  // 子树中的最后一个 effect
  lastEffect: Fiber | null;

  // 代表任务在未来的哪个时间点应该被完成
  // 不包括他的子树产生的任务
  expirationTime: ExpirationTime;
  // 值是子树中 expirationTime 最大的值
  // 用于快速确定子树中是否有不在等待的变化
  childExpirationTime: ExpirationTime;

  // React 维护了 2 个 Fiber 树，2个 Fiber 树上每一个节点互相对应
  // current <===> workInProgress
  // 渲染完成后互相交换位置
  // @see https://juejin.im/post/5ab7b3a2f265da2378403e57
  // https://user-gold-cdn.xitu.io/2018/3/25/1625d95d3f8211ef?imageView2/0/w/1280/h/960/ignore-error/1
  // https://user-gold-cdn.xitu.io/2018/3/25/1625d95c7772178d?imageView2/0/w/1280/h/960/ignore-error/1
  // https://user-gold-cdn.xitu.io/2018/3/25/1625d95cfe274875?imageslim
  alternate: Fiber;

  // 下面的时间是和调试相关的，收集 Fiber 和子树的渲染时间
  // Time spent rendering this Fiber and its descendants for the current update.
  // This tells us how well the tree makes use of sCU for memoization.
  // It is reset to 0 each time we render and only updated when we don't bailout.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualDuration?: number,

  // If the Fiber is currently active in the "render" phase,
  // This marks the time at which the work began.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualStartTime?: number,

  // Duration of the most recent render time for this Fiber.
  // This value is not updated when we bailout for memoization purposes.
  // This field is only set when the enableProfilerTimer flag is enabled.
  selfBaseDuration?: number,

  // Sum of base times for all descendants of this Fiber.
  // This value bubbles up during the "complete" phase.
  // This field is only set when the enableProfilerTimer flag is enabled.
  treeBaseDuration?: number,
}
```

### FiberRoot

fiber 树的根节点的 stateNode 是 FiberRoot。
存储当前 Fiber 树的一些信息

* FiberRoot 和 Fiber 是不同的数据类型。

```ts
interface FiberRoot {
   // The type of root (legacy, batched, concurrent, etc.)
  tag: RootTag,

  // Any additional information from the host associated with this root.
  containerInfo: any,
  // Used only by persistent updates.
  pendingChildren: any,
  // The currently active root fiber. This is the mutable root of the tree.
  current: Fiber,

  pingCache:
    | WeakMap<Thenable, Set<ExpirationTime>>
    | Map<Thenable, Set<ExpirationTime>>
    | null,

  finishedExpirationTime: ExpirationTime,
  // A finished work-in-progress HostRoot that's ready to be committed.
  finishedWork: Fiber | null,
  // Timeout handle returned by setTimeout. Used to cancel a pending timeout, if
  // it's superseded by a new one.
  timeoutHandle: TimeoutHandle | NoTimeout,
  // Top context object, used by renderSubtreeIntoContainer
  context: Object | null,
  pendingContext: Object | null,
  // Determines if we should attempt to hydrate on the initial mount
  +hydrate: boolean,
  // Node returned by Scheduler.scheduleCallback
  callbackNode: *,
  // Expiration of the callback associated with this root
  callbackExpirationTime: ExpirationTime,
  // Priority of the callback associated with this root
  callbackPriority: ReactPriorityLevel,
  // The earliest pending expiration time that exists in the tree
  firstPendingTime: ExpirationTime,
  // The earliest suspended expiration time that exists in the tree
  firstSuspendedTime: ExpirationTime,
  // The latest suspended expiration time that exists in the tree
  lastSuspendedTime: ExpirationTime,
  // The next known expiration time after the suspended range
  nextKnownPendingLevel: ExpirationTime,
  // The latest time at which a suspended component pinged the root to
  // render again
  lastPingedTime: ExpirationTime,
  lastExpiredTime: ExpirationTime,
  
  // ProfilingOnlyFiberRootProperties
  interactionThreadID: number,
  memoizedInteractions: Set<Interaction>,
  pendingInteractionMap: PendingInteractionMap,
}
```

### ExpirationTime

[juejin](https://juejin.im/post/5d6a572ce51d4561fa2ec0bc)
[expirationTime 计算公式](https://react.jokcy.me/book/update/expiration-time.html)

终止时间，值越大说明优先级越高。

有个特殊值 `Sync`，说明该任务需要立即执行

```ts
// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
const MAX_SIGNED_31_BIT_INT = 1073741823;
const Sync: ExpirationTime = MAX_SIGNED_31_BIT_INT;
```

### UpdateQueue

记录当前 fiber 更新

`setState` 会保存在 shared.pending 中

```ts
// ReactUpdateQueue.js
export interface UpdateQueue<State> {
  // 当前 state
  baseState: State;

  // 当前更新队列
  baseQueue: Update<State> | null;

  // fiber 和 alternate fiber 共享的对象
  shared: null | {
    pending: Update<State>;
  };

  effects: Array<Update<State>> | null;
}

// 记录一次状态的更新
export interface Update<State> {
  // 更新的过期时间
  expirationTime: number;
  suspenseConfig: null | SuspenseConfig;

  // 0 更新
  // 1 替换
  // 2 强制更新
  // 3 捕获性的更新
  tag: 0 | 1 | 2 | 3;

  // 更新的内容，对应 setState 的第一个参数
  payload: any;

  // 对调，对应 setState 的第二个参数
  callback: (() => mixed) | null;

  // 指向下一个更新
  next: Update<State>;

  // 权重
  // DEV only
  priority?: ReactPriorityLevel;
};
```

## ClassComponent 状态更新

1. 组件挂载的时候初始化 `updateQueue`
2. `setState` 的时候创建一个 `Update`，添加到 `fiber.updateQueue.shared.pendingQueue` 队列
3. 在 render 阶段，cloneUpdateQueue 函数能把 current fiber 中的 updateQueue 复制给 work-in-progress fiber。这样就如官方注释所说，current fiber 和 work-in-progress 会持有相同的 updateQueue。cloneUpdateQueue 函数执行后，就会调用 processUpdateQueue 获取最新状态。
4. 在 commit 阶段，通过 `commitUpdateQueue` 函数执行 effects 回调。

### ExecutionContext

当前工作的上下文

```ts
// ReactFiberWorkLoop.js
type ExecutionContext = number;

let executionContext: ExecutionContext = NoContext;

// 空状态，作为初始值，可用于推断调用栈是否回到底部、或者推断 executionContext 处于那种状态
const NoContext = /*                    */ 0b000000;
// 批量执行更新任务，如调用 batchedUpdates 更新时。
const BatchedContext = /*               */ 0b000001;
// 执行更新任务，如调用 batchedEventUpdates 更新时。
const EventContext = /*                 */ 0b000010;
// 以 UserBlockingPriority 优先级执行任务，如调用 discreteUpdates 更新时。
const DiscreteEventContext = /*         */ 0b000100;
// 传统的非批量执行更新任务，如首次挂载时调用 unbatchedUpdates 更新时。
const LegacyUnbatchedContext = /*       */ 0b001000;
// 当前更新处于 render 阶段
const RenderContext = /*                */ 0b010000;
// 当前更新处于 commit 阶段
const CommitContext = /*                */ 0b100000;
```

### classComponentUpdater.enqueueSetState

```js
// ReactFiberClassComponent.js
// @example
// this.setState(newState, cb) => enqueueSetState(this, newState, cb);
function enqueueSetState(inst, payload, callback) {
  // 获取当前组件对应的 fiber 实例
  const fiber = getInstance(inst);
  // 计算终止时间
  const currentTime = requestCurrentTimeForUpdate();
  const suspenseConfig = requestCurrentSuspenseConfig();
  const expirationTime = computeExpirationForFiber(
    currentTime,
    fiber,
    suspenseConfig,
  );

  // 创建更新，绑定 payload 和 callback
  const update = createUpdate(expirationTime, suspenseConfig);
  update.payload = payload;
  if (callback !== undefined && callback !== null) {
    update.callback = callback;
  }

  // 把当前的 update 放在 fiber 的 update queue 中
  enqueueUpdate(fiber, update);
  // 开始调度当前工作
  scheduleWork(fiber, expirationTime);
}
```

```ts
// ReactFiberWorkLoop.js
// 和 scheduleWork 是同一个函数
function scheduleUpdateOnFiber(
  fiber: Fiber,
  expirationTime: ExpirationTime,
) {
  // 检查是否循环调用
  // 比如在 componentWillUpdate 里面调用 setState 方法
  checkForNestedUpdates();
  warnAboutRenderPhaseUpdatesInDEV(fiber);

  // 更新当前节点到父节点的 expirationTime & childExpirationTime
  // 获取到根节点
  const root = markUpdateTimeFromFiberToRoot(fiber, expirationTime);
  if (root === null) {
    warnAboutUpdateOnUnmountedFiberInDEV(fiber);
    return;
  }

  // 检查当前 fiber 是否高于当前正在工作的 fiber(如果存在)
  checkForInterruption(fiber, expirationTime);
  recordScheduleUpdate();

  const priorityLevel = getCurrentPriorityLevel();

  // 如果
  if (expirationTime === Sync) {
    // 第一次渲时是处于 LegacyUnbatchedContext
    if (
      // Check if we're inside unbatchedUpdates
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      // Check if we're not already rendering
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // Register pending interactions on the root to avoid losing traced interaction data.
      schedulePendingInteractions(root, expirationTime);

      // This is a legacy edge case. The initial mount of a ReactDOM.render-ed
      // root inside of batchedUpdates should be synchronous, but layout updates
      // should be deferred until the end of the batch.
      performSyncWorkOnRoot(root);
    } else {
      // 确保当前 root 节点对应的任务放在全局的 syncCallbackQueue 里面
      ensureRootIsScheduled(root);
      schedulePendingInteractions(root, expirationTime);

      // 如果当前 Context 为空，比如在 setTimeout 里面 setState
      // 会立即执行 syncCallbackQueue 里面的回调
      if (executionContext === NoContext) {
        // Flush the synchronous work now, unless we're already working or inside
        // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
        // scheduleCallbackForFiber to preserve the ability to schedule a callback
        // without immediately flushing it. We only do this for user-initiated
        // updates, to preserve historical behavior of legacy mode.
        flushSyncCallbackQueue();
      }
    }
  } else {
    ensureRootIsScheduled(root);
    schedulePendingInteractions(root, expirationTime);
  }

  if (
    (executionContext & DiscreteEventContext) !== NoContext &&
    // Only updates at user-blocking priority or greater are considered
    // discrete, even inside a discrete event.
    (priorityLevel === UserBlockingPriority ||
      priorityLevel === ImmediatePriority)
  ) {
    // This is the result of a discrete event. Track the lowest priority
    // discrete update per root so we can flush them early, if needed.
    if (rootsWithPendingDiscreteUpdates === null) {
      rootsWithPendingDiscreteUpdates = new Map([[root, expirationTime]]);
    } else {
      const lastDiscreteTime = rootsWithPendingDiscreteUpdates.get(root);
      if (lastDiscreteTime === undefined || lastDiscreteTime > expirationTime) {
        rootsWithPendingDiscreteUpdates.set(root, expirationTime);
      }
    }
  }
}
```

总结下，在更新状态的时候

1. 更新当前 fiber 树当前节点到根节点的 expirationTime。
2. 如果是第一次更新，会立即执行 `performSyncWorkOnRoot` 方法更新，否则更新方法会放在回调队列里面。
3. 如果当前 `executionContext` 为空，会立即执行回调方法更新界面（和上面的情况类型）
4. 其他情况需要宿主环境执行回调方法。

ReactDOM

```ts
/**
 * ReactDOM 调用 render 方法触发第一次渲染
 * render => legacyRenderSubtreeIntoContainer => unbatchedUpdates => updateContainer(ReactReconciler) => enqueueUpdate & scheduleWork
 */
function unbatchedUpdates(fn, a) {
 var prevExecutionContext = executionContext;
 // 移除 BatchedContext，增加 LegacyUnbatchedContext
 executionContext &= ~BatchedContext;
 executionContext |= LegacyUnbatchedContext;

 try {
  return fn(a);
 } finally {
  executionContext = prevExecutionContext;

  if (executionContext === NoContext) {
    // Flush the immediate callbacks that were scheduled during this batch
    flushSyncCallbackQueue();
  }
 }
}
```

```ts
/**
 * React DOM 事件中更新
 * dispatchDiscreteEvent =>  discreteUpdates => discreteUpdates$1
 */
function discreteUpdates$1(fn, a, b, c, d) {
  // 更新当前 executionContext 中的 DiscreteEventContext 为 true
  var prevExecutionContext = executionContext;
  executionContext |= DiscreteEventContext;

  try {
    // fn 是 dispatchEvent
    return runWithPriority$1(UserBlockingPriority$1, fn.bind(null, a, b, c, d));
  } finally {
    executionContext = prevExecutionContext;

    if (executionContext === NoContext) {
      // 如果回调中有调用 setState 方法，performSyncWorkOnRoot 会放在回调里面
      // 事件的回调函数执行完成后调用 performSyncWorkOnRoot 方法
      // Flush the immediate callbacks that were scheduled during this batch
      flushSyncCallbackQueue();
    }
  }
}
```

### performSyncWorkOnRoot

```ts
// This is the entry point for synchronous tasks that don't go
// through Scheduler
// render & commit Sync
function performSyncWorkOnRoot(root) {
  // Check if there's expired work on this root. Otherwise, render at Sync.
  // 检查此根目录上是否有过期的工作。否则，在同步时渲染。 
  const lastExpiredTime = root.lastExpiredTime;
  const expirationTime = lastExpiredTime !== NoWork ? lastExpiredTime : Sync;
  invariant(
    (executionContext & (RenderContext | CommitContext)) === NoContext,
    'Should not already be working.',
  );

  flushPassiveEffects();

  // If the root or expiration time have changed, throw out the existing stack
  // and prepare a fresh one. Otherwise we'll continue where we left off.
  // 清除上一次 work 剩下的工作并且重置
  if (root !== workInProgressRoot || expirationTime !== renderExpirationTime) {
    prepareFreshStack(root, expirationTime);
    startWorkOnPendingInteractions(root, expirationTime);
  }

  // If we have a work-in-progress fiber, it means there's still work to do
  // in this root.
  if (workInProgress !== null) {
    // 设置全局变量
    // 当前 executionContext 增加 RenderContext
    const prevExecutionContext = executionContext;
    executionContext |= RenderContext;
    const prevDispatcher = pushDispatcher(root);
    const prevInteractions = pushInteractions(root);
    startWorkLoopTimer(workInProgress);

    do {
      try {
        // 开始循环更新 fiber 树/
        workLoopSync();
        break;
      } catch (thrownValue) {
        handleError(root, thrownValue);
      }
    } while (true);

    // 重置全局变量
    resetContextDependencies();
    executionContext = prevExecutionContext;
    popDispatcher(prevDispatcher);
    if (enableSchedulerTracing) {
      popInteractions(((prevInteractions as any) as Set<Interaction>));
    }

    if (workInProgressRootExitStatus === RootFatalErrored) {
      const fatalError = workInProgressRootFatalError;
      stopInterruptedWorkLoopTimer();
      prepareFreshStack(root, expirationTime);
      markRootSuspendedAtTime(root, expirationTime);
      ensureRootIsScheduled(root);
      throw fatalError;
    }

    if (workInProgress !== null) {
      // This is a sync render, so we should have finished the whole tree.
      invariant(
        false,
        'Cannot commit an incomplete root. This error is likely caused by a ' +
          'bug in React. Please file an issue.',
      );
    } else {
      // We now have a consistent tree. Because this is a sync render, we
      // will commit it even if something suspended.
      stopFinishedWorkLoopTimer();
      root.finishedWork = (root.current.alternate: any);
      root.finishedExpirationTime = expirationTime;
      finishSyncRender(root);
    }

    // Before exiting, make sure there's a callback scheduled for the next
    // pending level.
    ensureRootIsScheduled(root);
  }

  return null;
}

function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}

function finishSyncRender() {
  // Set this to null to indicate there's no in-progress render.
  workInProgressRoot = null;
  commitRoot(root);
}
```

### performUnitOfWork

```ts
function performUnitOfWork(unitOfWork: Fiber): Fiber | null {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  const current = unitOfWork.alternate;

  startWorkTimer(unitOfWork);
  setCurrentDebugFiberInDEV(unitOfWork);

  let next;
  if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    startProfilerTimer(unitOfWork);
    next = beginWork(current, unitOfWork, renderExpirationTime);
    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
  } else {
    next = beginWork(current, unitOfWork, renderExpirationTime);
  }

  resetCurrentDebugFiberInDEV();
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    // 清楚
    next = completeUnitOfWork(unitOfWork);
  }

  ReactCurrentOwner.current = null;
  return next;
}
```

```ts
// ReactFiberBeginWork.js

// current.alternate === workInProgress
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  const updateExpirationTime = workInProgress.expirationTime;

  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasLegacyContextChanged() ||
      // Force a re-render if the implementation changed due to hot reload:
      (__DEV__ ? workInProgress.type !== current.type : false)
    ) {
      // If props or context changed, mark the fiber as having performed work.
      // This may be unset if the props are determined to be equal later (memo).
      didReceiveUpdate = true;
    } else if (updateExpirationTime < renderExpirationTime) {
      didReceiveUpdate = false;
      // This fiber does not have any pending work. Bailout without entering
      // the begin phase. There's still some bookkeeping we that needs to be done
      // in this optimized path, mostly pushing stuff onto the stack.
      switch (workInProgress.tag) {
        // 略
      }
      // 判断子树是否有更新，如果没有更新，返回 null
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderExpirationTime,
      );
    } else {
      // An update was scheduled on this fiber, but there are no new props
      // nor legacy context. Set this to false. If an update queue or context
      // consumer produces a changed value, it will set this to true. Otherwise,
      // the component will assume the children have not changed and bail out.
      didReceiveUpdate = false;
    }
  } else {
    didReceiveUpdate = false;
  }

  // Before entering the begin phase, clear pending update priority.
  // TODO: This assumes that we're about to evaluate the component and process
  // the update queue. However, there's an exception: SimpleMemoComponent
  // sometimes bails out later in the begin phase. This indicates that we should
  // move this assignment out of the common path and into each branch.
  workInProgress.expirationTime = NoWork;

  // 依据不同的 fiber 类型执行不同的 update 操作
  switch (workInProgress.tag) {
    case ClassComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime,
      );
    }
    // 其他 case 略
  }
}
```

```ts
function updateClassComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  nextProps,
  renderExpirationTime: ExpirationTime,
) {
  // Push context providers early to prevent context stack mismatches.
  // During mounting we don't know the child context yet as the instance doesn't exist.
  // We will invalidate the child context in finishClassComponent() right after rendering.
  let hasContext;
  if (isLegacyContextProvider(Component)) {
    hasContext = true;
    pushLegacyContextProvider(workInProgress);
  } else {
    hasContext = false;
  }
  prepareToReadContext(workInProgress, renderExpirationTime);

  const instance = workInProgress.stateNode;
  let shouldUpdate;
  // 第一次 render
  // 因为是先创建 workInProcess，第一次渲染完成后才会把 workInProcess 拷贝成 current/
  // 如果是第一次就初始化，如果有 instance & current 则 updateClassInstance
  if (instance === null) {
    if (current !== null) {
      // A class component without an instance only mounts if it suspended
      // inside a non-concurrent tree, in an inconsistent state. We want to
      // treat it like a new mount, even though an empty version of it already
      // committed. Disconnect the alternate pointers.
      current.alternate = null;
      workInProgress.alternate = null;
      // Since this is conceptually a new fiber, schedule a Placement effect
      workInProgress.effectTag |= Placement;
    }
    // In the initial pass we might need to construct the instance.
    // 实例化组件，在实例上挂载 updater 对象，setState 实际调用的是 updater.enqueueSetState 方法
    constructClassInstance(workInProgress, Component, nextProps);
    // 初始化 props、state、refs、context 等实例属性
    // 调用 getDerivedStateFromProps 生命周期方法
    mountClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime,
    );
    shouldUpdate = true;
  } else if (current === null) {
    // In a resume, we'll already have an instance we can reuse.
    shouldUpdate = resumeMountClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime,
    );
  } else {
    // 更新 state，调用相关生命周期方法
    shouldUpdate = updateClassInstance(
      current,
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime,
    );
  }
  // shouldUpdate 为 true, 则调用 render 方法，作为当前 fiber 的 children
  // shouldUpdate 为 false 且没有错误，则调用 bailoutOnAlreadyFinishedWork 方法判断子树
  const nextUnitOfWork = finishClassComponent(
    current,
    workInProgress,
    Component,
    shouldUpdate,
    hasContext,
    renderExpirationTime,
  );
  return nextUnitOfWork;
}
```

### processUpdateQueue

```ts
function processUpdateQueue<State>(
  workInProgress: Fiber,
  props: any,
  instance: any,
  renderExpirationTime: ExpirationTime,
): void {
  // This is always non-null on a ClassComponent or HostRoot
  const queue: UpdateQueue<State> = workInProgress.updateQueue;

  hasForceUpdate = false;

  if (__DEV__) {
    currentlyProcessingQueue = queue.shared;
  }

  // The last rebase update that is NOT part of the base state.
  let baseQueue = queue.baseQueue;

  // The last pending update that hasn't been processed yet.
  let pendingQueue = queue.shared.pending;
  if (pendingQueue !== null) {
    // We have new updates that haven't been processed yet.
    // We'll add them to the base queue.
    if (baseQueue !== null) {
      // Merge the pending queue and the base queue.
      let baseFirst = baseQueue.next;
      let pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }

    baseQueue = pendingQueue;

    queue.shared.pending = null;
    // TODO: Pass `current` as argument
    const current = workInProgress.alternate;
    if (current !== null) {
      const currentQueue = current.updateQueue;
      if (currentQueue !== null) {
        currentQueue.baseQueue = pendingQueue;
      }
    }
  }

  // These values may change as we process the queue.
  if (baseQueue !== null) {
    let first = baseQueue.next;
    // Iterate through the list of updates to compute the result.
    let newState = queue.baseState;
    let newExpirationTime = NoWork;

    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;

    if (first !== null) {
      let update = first;
      do {
        const updateExpirationTime = update.expirationTime;
        if (updateExpirationTime < renderExpirationTime) {
          // Priority is insufficient. Skip this update. If this is the first
          // skipped update, the previous update/state is the new base
          // update/state.
          const clone: Update<State> = {
            expirationTime: update.expirationTime,
            suspenseConfig: update.suspenseConfig,

            tag: update.tag,
            payload: update.payload,
            callback: update.callback,

            next: (null as any),
          };
          if (newBaseQueueLast === null) {
            newBaseQueueFirst = newBaseQueueLast = clone;
            newBaseState = newState;
          } else {
            newBaseQueueLast = newBaseQueueLast.next = clone;
          }
          // Update the remaining priority in the queue.
          if (updateExpirationTime > newExpirationTime) {
            newExpirationTime = updateExpirationTime;
          }
        } else {
          // This update does have sufficient priority.

          if (newBaseQueueLast !== null) {
            const clone: Update<State> = {
              expirationTime: Sync, // This update is going to be committed so we never want uncommit it.
              suspenseConfig: update.suspenseConfig,

              tag: update.tag,
              payload: update.payload,
              callback: update.callback,

              next: (null as any),
            };
            newBaseQueueLast = newBaseQueueLast.next = clone;
          }

          // Mark the event time of this update as relevant to this render pass.
          // TODO: This should ideally use the true event time of this update rather than
          // its priority which is a derived and not reverseable value.
          // TODO: We should skip this update if it was already committed but currently
          // we have no way of detecting the difference between a committed and suspended
          // update here.
          markRenderEventTimeAndConfig(
            updateExpirationTime,
            update.suspenseConfig,
          );

          // Process this update.
          // 更新 state
          newState = getStateFromUpdate(
            workInProgress,
            queue,
            update,
            newState,
            props,
            instance,
          );
          const callback = update.callback;
          if (callback !== null) {
            workInProgress.effectTag |= Callback;
            let effects = queue.effects;
            if (effects === null) {
              queue.effects = [update];
            } else {
              effects.push(update);
            }
          }
        }
        update = update.next;
        if (update === null || update === first) {
          pendingQueue = queue.shared.pending;
          if (pendingQueue === null) {
            break;
          } else {
            // An update was scheduled from inside a reducer. Add the new
            // pending updates to the end of the list and keep processing.
            update = baseQueue.next = pendingQueue.next;
            pendingQueue.next = first;
            queue.baseQueue = baseQueue = pendingQueue;
            queue.shared.pending = null;
          }
        }
      } while (true);
    }

    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = newBaseQueueFirst;
    }

    queue.baseState = newBaseState;
    queue.baseQueue = newBaseQueueLast;

    // Set the remaining expiration time to be whatever is remaining in the queue.
    // This should be fine because the only two other things that contribute to
    // expiration time are props and context. We're already in the middle of the
    // begin phase by the time we start processing the queue, so we've already
    // dealt with the props. Context in components that specify
    // shouldComponentUpdate is tricky; but we'll have to account for
    // that regardless.
    markUnprocessedUpdateTime(newExpirationTime);
    workInProgress.expirationTime = newExpirationTime;
    workInProgress.memoizedState = newState;
  }

  if (__DEV__) {
    currentlyProcessingQueue = null;
  }
}
```

### commitRoot

遍历所有的 effect，执行所有的 effect 和 lifecycle

```ts
function commitRootImpl(root, renderPriorityLevel) {
  do {
    // `flushPassiveEffects` will call `flushSyncUpdateQueue` at the end, which
    // means `flushPassiveEffects` will sometimes result in additional
    // passive effects. So we need to keep flushing in a loop until there are
    // no more pending effects.
    // TODO: Might be better if `flushPassiveEffects` did not automatically
    // flush synchronous work at the end, to avoid factoring hazards like this.
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);
  flushRenderPhaseStrictModeWarningsInDEV();

  const finishedWork = root.finishedWork;
  const expirationTime = root.finishedExpirationTime;
  if (finishedWork === null) {
    return null;
  }
  root.finishedWork = null;
  root.finishedExpirationTime = NoWork;

  // commitRoot never returns a continuation; it always finishes synchronously.
  // So we can clear these now to allow a new callback to be scheduled.
  root.callbackNode = null;
  root.callbackExpirationTime = NoWork;
  root.callbackPriority = NoPriority;
  root.nextKnownPendingLevel = NoWork;

  startCommitTimer();

  // Update the first and last pending times on this root. The new first
  // pending time is whatever is left on the root fiber.
  const remainingExpirationTimeBeforeCommit = getRemainingExpirationTime(
    finishedWork,
  );
  markRootFinishedAtTime(
    root,
    expirationTime,
    remainingExpirationTimeBeforeCommit,
  );

  if (root === workInProgressRoot) {
    // We can reset these now that they are finished.
    workInProgressRoot = null;
    workInProgress = null;
    renderExpirationTime = NoWork;
  } else {
    // This indicates that the last root we worked on is not the same one that
    // we're committing now. This most commonly happens when a suspended root
    // times out.
  }

  // Get the list of effects.
  let firstEffect;
  if (finishedWork.effectTag > PerformedWork) {
    // A fiber's effect list consists only of its children, not itself. So if
    // the root has an effect, we need to add it to the end of the list. The
    // resulting list is the set that would belong to the root's parent, if it
    // had one; that is, all the effects in the tree including the root.
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // There is no effect on the root.
    firstEffect = finishedWork.firstEffect;
  }

  if (firstEffect !== null) {
    const prevExecutionContext = executionContext;
    executionContext |= CommitContext;
    const prevInteractions = pushInteractions(root);

    // Reset this to null before calling lifecycles
    ReactCurrentOwner.current = null;

    // The commit phase is broken into several sub-phases. We do a separate pass
    // of the effect list for each phase: all mutation effects come before all
    // layout effects, and so on.

    // The first phase a "before mutation" phase. We use this phase to read the
    // state of the host tree right before we mutate it. This is where
    // getSnapshotBeforeUpdate is called.
    startCommitSnapshotEffectsTimer();
    prepareForCommit(root.containerInfo);
    nextEffect = firstEffect;
    do {
        try {
          // 调用 `getSnapshotBeforeUpdate` 生命周期
          commitBeforeMutationEffects();
        } catch (error) {
          invariant(nextEffect !== null, 'Should be working on an effect.');
          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
    } while (nextEffect !== null);
    stopCommitSnapshotEffectsTimer();

    if (enableProfilerTimer) {
      // Mark the current commit time to be shared by all Profilers in this
      // batch. This enables them to be grouped later.
      recordCommitTime();
    }

    // The next phase is the mutation phase, where we mutate the host tree.
    startCommitHostEffectsTimer();
    nextEffect = firstEffect;
    do {
      try {
        // 依据不同的 effectTag，执行不同的 commit 方法
        commitMutationEffects(root, renderPriorityLevel);
      } catch (error) {
        invariant(nextEffect !== null, 'Should be working on an effect.');
        captureCommitPhaseError(nextEffect, error);
        nextEffect = nextEffect.nextEffect;
      }
    } while (nextEffect !== null);
    stopCommitHostEffectsTimer();
    resetAfterCommit(root.containerInfo);

    // The work-in-progress tree is now the current tree. This must come after
    // the mutation phase, so that the previous tree is still current during
    // componentWillUnmount, but before the layout phase, so that the finished
    // work is current during componentDidMount/Update.
    root.current = finishedWork;

    // The next phase is the layout phase, where we call effects that read
    // the host tree after it's been mutated. The idiomatic use case for this is
    // layout, but class component lifecycles also fire here for legacy reasons.
    startCommitLifeCyclesTimer();
    nextEffect = firstEffect;
    do {
      try {
        // 调用 componentDidMount 生命周期
        commitLayoutEffects(root, expirationTime);
      } catch (error) {
        invariant(nextEffect !== null, 'Should be working on an effect.');
        captureCommitPhaseError(nextEffect, error);
        nextEffect = nextEffect.nextEffect;
      }
    } while (nextEffect !== null);
    stopCommitLifeCyclesTimer();

    nextEffect = null;

    // Tell Scheduler to yield at the end of the frame, so the browser has an
    // opportunity to paint.
    requestPaint();

    if (enableSchedulerTracing) {
      popInteractions(prevInteractions);
    }
    executionContext = prevExecutionContext;
  } else {
    // No effects.
    root.current = finishedWork;
    // Measure these anyway so the flamegraph explicitly shows that there were
    // no effects.
    // TODO: Maybe there's a better way to report this.
    startCommitSnapshotEffectsTimer();
    stopCommitSnapshotEffectsTimer();
    if (enableProfilerTimer) {
      recordCommitTime();
    }
    startCommitHostEffectsTimer();
    stopCommitHostEffectsTimer();
    startCommitLifeCyclesTimer();
    stopCommitLifeCyclesTimer();
  }

  stopCommitTimer();

  const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

  if (rootDoesHavePassiveEffects) {
    // This commit has passive effects. Stash a reference to them. But don't
    // schedule a callback until after flushing layout work.
    rootDoesHavePassiveEffects = false;
    rootWithPendingPassiveEffects = root;
    pendingPassiveEffectsExpirationTime = expirationTime;
    pendingPassiveEffectsRenderPriority = renderPriorityLevel;
  } else {
    // We are done with the effect chain at this point so let's clear the
    // nextEffect pointers to assist with GC. If we have passive effects, we'll
    // clear this in flushPassiveEffects.
    nextEffect = firstEffect;
    while (nextEffect !== null) {
      const nextNextEffect = nextEffect.nextEffect;
      nextEffect.nextEffect = null;
      nextEffect = nextNextEffect;
    }
  }

  // Check if there's remaining work on this root
  const remainingExpirationTime = root.firstPendingTime;
  if (remainingExpirationTime !== NoWork) {
    if (enableSchedulerTracing) {
      if (spawnedWorkDuringRender !== null) {
        const expirationTimes = spawnedWorkDuringRender;
        spawnedWorkDuringRender = null;
        for (let i = 0; i < expirationTimes.length; i++) {
          scheduleInteractions(
            root,
            expirationTimes[i],
            root.memoizedInteractions,
          );
        }
      }
      schedulePendingInteractions(root, remainingExpirationTime);
    }
  } else {
    // If there's no remaining work, we can clear the set of already failed
    // error boundaries.
    legacyErrorBoundariesThatAlreadyFailed = null;
  }

  if (enableSchedulerTracing) {
    if (!rootDidHavePassiveEffects) {
      // If there are no passive effects, then we can complete the pending interactions.
      // Otherwise, we'll wait until after the passive effects are flushed.
      // Wait to do this until after remaining work has been scheduled,
      // so that we don't prematurely signal complete for interactions when there's e.g. hidden work.
      finishPendingInteractions(root, expirationTime);
    }
  }

  if (remainingExpirationTime === Sync) {
    // Count the number of times the root synchronously re-renders without
    // finishing. If there are too many, it indicates an infinite update loop.
    if (root === rootWithNestedUpdates) {
      nestedUpdateCount++;
    } else {
      nestedUpdateCount = 0;
      rootWithNestedUpdates = root;
    }
  } else {
    nestedUpdateCount = 0;
  }

  onCommitRoot(finishedWork.stateNode, expirationTime);

  // Always call this before exiting `commitRoot`, to ensure that any
  // additional work on this root is scheduled.
  ensureRootIsScheduled(root);

  if (hasUncaughtError) {
    hasUncaughtError = false;
    const error = firstUncaughtError;
    firstUncaughtError = null;
    throw error;
  }

  if ((executionContext & LegacyUnbatchedContext) !== NoContext) {
    // This is a legacy edge case. We just committed the initial mount of
    // a ReactDOM.render-ed root inside of batchedUpdates. The commit fired
    // synchronously, but layout updates should be deferred until the end
    // of the batch.
    return null;
  }

  // If layout work was scheduled, flush it now.
  flushSyncCallbackQueue();
  return null;
}
```
