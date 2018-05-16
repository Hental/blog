function fib(target) {
  const vals = [0, 1];

  function r(index) {
    if (!(index in vals)) {
      vals[index] = r(index - 1) + r(index - 2);
    }

    return vals[index];
  }

  return r(target);
}

function recursion(target) {
  if (target == 0) {
    return 0;
  } else if (target == 1) {
    return 1;
  } else {
    return recursion(target - 1) + recursion(target - 2);
  }
}

module.exports = fib;

fib.recursion = recursion;

// console.log(recursion(1))
