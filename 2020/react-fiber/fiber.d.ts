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
  // 快速确定子树中是否有不在等待的变化
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

export interface UpdateQueue<State> {
  // 更新后的 state
  baseState: State;

  //
  baseQueue: Update<State> | null;

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

  //
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
  // priority?: ReactPriorityLevel;
};
