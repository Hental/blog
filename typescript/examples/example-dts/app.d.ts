import { EventEmitter } from 'events';

declare class MyFn extends EventEmitter {
  on(name: 'my-event', cb: (count: number) => void): void;
  on(name: 'other-event', cb: (arg1: string, arg2: boolean) => void): void;

  wrapper<T>(fn: T): T;
}

export = MyFn;
