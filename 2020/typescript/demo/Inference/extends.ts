/**
 * wrap async function
 * log error when catch error
 * @param fn
 */
function wrapAsyncFunction<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return function wrapper(...args: any[]) {
    return fn.apply(this, args)
      .catch(err => {
        console.error(err);
        throw err;
      });
  } as T;
}

let wrapped = wrapAsyncFunction(() => Promise.resolve(''));
let wrapped2 = wrapAsyncFunction(() => ''); // error: Type 'string' is not assignable to type 'Promise<any>'


// SpyOn
type FnKey<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => any ? P : never;
}[keyof T];

type MockFunction<R, Args extends any[]> = {
  (...args: Args): R;
  mock: any;
  mockImplementation(impl: (...args: Args) => R): void;
  mockResolveValue(val: R): void;
  calls: Array<Args>;
}

export interface SpyOn {
  <T, K extends FnKey<T>>(target: T, key: K): MockFunction<ReturnType<T[K]>, Parameters<T[K]>>;
}

let spyOn: SpyOn;
let obj = {
  foo: 'bar',
  bool: true,
  num: 1,
  syncMethod(arg: string) { },
  async asyncMethod(arg: number) { },
}
let fn1 = spyOn(obj, 'syncMethod');
let fn2 = spyOn(obj, 'asyncMethod');
fn1('2');
fn2.calls[0][0].toFixed; // number
