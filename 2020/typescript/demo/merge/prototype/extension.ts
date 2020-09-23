import { MyClass } from './class';

declare module './class' {
  interface MyClass {
    extendFn(arg: number): number;
  }
}

MyClass.prototype.extendFn = v => v;

declare global {
  interface Array<T> {
    mySort(): T[];
  }
}
