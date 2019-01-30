const states = Object.freeze({
  pending: Symbol('pending'),
  fulfill: Symbol('fulfill'),
  reject: Symbol('reject'),
});

class MyPromise {
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('promise executor must be a function!');
    }

    {
      // only set once
      const allowStates = [states.reject, states.fulfill];
      Object.defineProperty(this, 'state', {
        set: v => {
          if (!allowStates.includes(v)) {
            throw new Error(`state value error! ${v} is not included ${allowStates}`);
          }
          Object.defineProperty(this, 'state', {
            value: v,
            enumerable: true,
            writable: false,
            configurable: false,
          });
        },
        get: () => states.pending,
        enumerable: true,
        configurable: true,
      });
    }

    this._value = undefined;
    this._onFullfii = undefined;
    this._onReject = undefined;
    this._resolve = this._resolve.bind(this);
    this._reject = this._reject.bind(this);
    try {
      fn(this._resolve, this._reject);
    } catch (error) {
      this._reject(error);
    }
  }

  get _setted() {
    this.state === states.fulfill || this.state === states.reject;
  }

  then(onFulfill = v => v, onReject) {
    return new MyPromise((res, rej) => {
      const _res = () => {
        try {
          res(onFulfill(this._value))
        } catch (error) {
          rej(error);
        }
      }

      const _rej = () => {
        try {
          // 如果有 handler, 则 resolve, 没有则传递 reject
          if (typeof onReject === 'function') {
            res(onReject(this._value));
          } else {
            rej(this._value);
          }
        } catch (error) {
          rej(error);
        }
      }

      switch (this.state) {
        // next event loop
        case states.fulfill:
          setTimeout(_res, 0);
          return;
        case states.reject:
          setTimeout(_rej, 0);
          return;
        case states.pending:
          this._onFullfii = _res;
          this._onReject = _rej;
          return;
      }
    });
  }

  catch(onReject) {
    return this.then(undefined, onReject);
  }

  _resolve(v) {
    if (v && typeof v.then === 'function') {
      v.then(this._resolve, this._reject);
    } else {
      this._fulfill(v);
    }
  }

  _fulfill(val) {
    this.state = states.fulfill;
    this._value = val;
    if (this._onFullfii) {
      this._onFullfii(v);
    }
  }

  _reject(err) {
    this._value = err;
    this.state = states.reject;
    if (this._onReject) {
      this._onReject(err);
    }
  }
}

module.exports = MyPromise;
