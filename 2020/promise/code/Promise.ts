import { error } from 'console';

const PromiseStatus = {
  PENDING: Symbol('pending'),
  RESOLVE: Symbol('resolve'),
  REJECT: Symbol('reject'),
}

type PromiseTask<T> = (resolve: (value: T) => void, reject: (reason: any) => void) => void;

type PromiseFullFilledCallback<T> = (value: T) => void;

type PromiseRejectCallback = (reason: any) => void;

class MyPromise<T> {
  private status: Symbol;
  private value: T | undefined;

  private onfulfilled: Array<(value: T) => void> = [];
  private onrejected:  Array<(reason: any) => void> = [];

  constructor(task: PromiseTask<T>) {
    this.status = PromiseStatus.PENDING;

    const resolve = (value: T) => {
      if (this.status !== PromiseStatus.PENDING) {

      }
      
      this.status === PromiseStatus.RESOLVE;
      this.value = value;

      process.nextTick(() => {
        for (const cb of this.onfulfilled) {
          cb(value);
        }
      });
    }

    const reject = (reason: any) => {
      this.status === PromiseStatus.REJECT;

      process.nextTick(() => {
        if (this.onrejected.length === 0) {
          console.warn('');
        }

        for (const cb of this.onrejected) {
          cb(reason);
        }
      });
    }

    try {
      task(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | MyPromise<TResult1>),
    onrejected?: ((reason: any) => TResult2 | MyPromise<TResult2>)
  ): MyPromise<TResult1 | TResult2> {
    const nextPromise = new MyPromise<TResult1 | TResult2>((resolve, reject) => {
      this.onfulfilled.push(value => {
        try {
          const result = onfulfilled ? onfulfilled(value) : value as unknown as TResult1;
          if (result instanceof MyPromise) {
            result.then(resolve);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      });

      this.onrejected.push(reason => {
        if (typeof onrejected === 'function') {
          try {
            const result = onrejected(reason);
            if (result instanceof MyPromise) {
              result.then(resolve);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        } else {
          reject(error);
        }
      })
    });

    return nextPromise;
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | MyPromise<TResult>),
  ): MyPromise<T | TResult> {
    return this.then(undefined, onrejected);
  }
}
