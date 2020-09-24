type InferReducerEvent<T> = T extends (state: any, action: infer A) => any ? A : never;
type InferReducerState<T> = T extends (state: infer S, action: any) => any ? S : never;

export interface Store<S, R extends Reducer<any>> {
  subscribe(cb: () => void): void;
  dispatch(event: InferReducerEvent<R>): void;
  getState(): S;
}

export interface Reducer<S> {
  (state: S | undefined, action: { [key: string]: any }): S;
}

export function createStore<R extends Reducer<any>, S = InferReducerState<R>>(reducer: R): Store<S, R> {
  throw new Error('not implement');
}

// test
function counter(state = 0, action: { type: 'INCREMENT' } | { type: 'DECREMENT' }) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}
const store = createStore(counter);
store.subscribe(() => store.getState().toFixed);
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });

// react connect
import React from 'react';

type InferProps<C> = C extends React.ComponentType<infer P> ? P : any;
type InferStoreState<S extends Store<any, any>> = S extends Store<infer State, any> ? State : never;

// filter function type props
type EventProps<P> = {
  [K in keyof P]: P[K] extends (...args: any[]) => any ? P[K] : never;
};

// filter not function type props
type NotEventProps<P> = {
  [K in keyof P]: P[K] extends (...args: any[]) => any ? never : P[K];
};

type MergeProps<T, MapState extends Partial<T>, MapAction extends Partial<T>> = Omit<
  T,
  keyof MapState | keyof MapAction
> &
  (keyof MapState extends keyof T ? Partial<Pick<T, keyof MapState>> : never) &
  (keyof MapAction extends keyof T ? Partial<Pick<T, keyof MapAction>> : never);

type StateMapper<S extends Store<any, any>, Props> = {
  (state: InferStoreState<S>): Partial<NotEventProps<Props>>;
};

type ActionMapper<S extends Store<any, any>, Props> = {
  (dispatch: S['dispatch']): Partial<EventProps<Props>>;
};

// type Connect<S extends Store<any, any>> = {
//   <Props, MapState extends StateMapper<S, Props>, MapAction extends ActionMapper<S, Props>>(
//     mapState?: MapState,
//     mapReducer?: MapAction,
//   ): (
//     component: React.ComponentType<Props>,
//   ) => React.ComponentType<MergeProps<Props, ReturnType<MapState>, ReturnType<MapAction>>>;
// };

type Connect<S extends Store<any, any>> = {
  <Props>(component: React.ComponentType<Props>): <
    MapState extends StateMapper<S, Props>,
    MapAction extends ActionMapper<S, Props>
  >(
    mapState?: MapState,
    mapReducer?: MapAction,
  ) => React.ComponentType<MergeProps<Props, ReturnType<MapState>, ReturnType<MapAction>>>;
};

// test
type ComponentProps = {
  propA: string;
  propB: boolean;
  propC: number;
  onChange: () => void;
};
const Component: React.FC<ComponentProps> = () => null;
const connect: Connect<typeof store> = (() => {}) as any;
const WrapComponent = connect(Component)(
  state => {
    return {
      propC: state,
      // propA: '',
      // propB: state,
      // onChange: () => {},
    };
  },
  dispatch => {
    return {
      onChange: () => dispatch({ type: 'INCREMENT' }),
      // propA: '',
    };
  },
);

type WrapComponentProps = InferProps<typeof WrapComponent>;
const prop: WrapComponentProps = {
  propA: '',
  propB: true,
  // propC: 1,
};
