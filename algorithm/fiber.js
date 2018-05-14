function fib(target) {
  const vals = [0, 1];
  let calls = 0;
  let ret;

  function r(index) {
    if (!(index in vals)) {
      calls++;
      vals[index] = r(index - 1) + r(index - 2);
    }

    return vals[index];
  }

  ret = r(target);
  console.log(target, calls);
  return ret;
}

console.log(fib(100))
