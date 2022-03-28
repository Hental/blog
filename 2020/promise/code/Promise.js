const PromiseStatus = {
  PENDING: Symbol("pending"),
  RESOLVE: Symbol("resolve"),
  REJECT: Symbol("reject"),
};

const onNextTick = (cb) => {
  setTimeout(cb, 0);
};

const defer = (cb) => (val) => onNextTick(() => cb(val));

class MyPromise {
  constructor(task) {
    if (!(this instanceof MyPromise)) {
      throw new Error("must new");
    }

    this.status = PromiseStatus.PENDING;
    this.handlers = [];

    const resolve = (value) => {
      if (this.status !== PromiseStatus.PENDING) {
        return;
      }

      this.status = PromiseStatus.RESOLVE;
      this.value = value;

      onNextTick(() => {
        this.handlers.forEach((h) => {
          h[0]?.(value);
        });
      });
    };

    const reject = (reason) => {
      if (this.status !== PromiseStatus.PENDING) {
        return;
      }

      this.status = PromiseStatus.REJECT;
      this.value = reason;

      onNextTick(() => {
        this.handlers.forEach((h) => {
          h[1]?.(reason);
        });
      });
    };

    try {
      task(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onfulfilled, onrejected) {
    const nextPromise = new MyPromise((resolve, reject) => {
      const onPrevResolve = (value) => {
        try {
          if (typeof onfulfilled !== "function") {
            resolve(value);
            return;
          }

          const result = onfulfilled(value);

          if (isThenablePromise(result)) {
            result.then(resolve);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      };

      const onPrevReject = (reason) => {
        if (typeof onrejected !== "function") {
          reject(reason);
          return;
        }

        try {
          const result = onrejected(reason);

          if (isThenablePromise(result)) {
            result.then(resolve);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      };

      switch (this.status) {
        case PromiseStatus.PENDING:
          this.handlers.push([onPrevResolve, onPrevReject]);
          break;
        case PromiseStatus.REJECT:
          onNextTick(() => onPrevReject(this.value));
          break;
        case PromiseStatus.RESOLVE:
          onNextTick(() => onPrevResolve(this.value));
          break;
      }
    });

    return nextPromise;
  }

  catch(onrejected) {
    return this.then(undefined, onrejected);
  }
}

function isThenablePromise(result) {
  return (
    typeof result === "object" &&
    result !== null &&
    typeof result.then === "function"
  );
}

exports.MyPromise = MyPromise;
