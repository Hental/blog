const promisesAplusTests = require("promises-aplus-tests");
const { MyPromise } = require("./Promise");

const adapter = {
  deferred() {
    let resolve, reject;
    let promise = new MyPromise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {
      promise,
      resolve,
      reject,
    };
  },
};

promisesAplusTests(
  adapter,
  {
    bail: true,
  },
  function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
    console.error(err);
  }
);
