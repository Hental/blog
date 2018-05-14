const iterable = {
  [Symbol.iterator]() {
    const obj = { foo: 'bar', bar: 'foo' }
    const keys = Object.keys(obj)
    const len = keys.length
    let index = 0;

    const it = {
      next() {
        const key = keys[index];
        index += 1;
        return { done: key === undefined, value: [key, obj[key]] }
      }
    }
    
    return it;
  }
}

console.log([...iterable]);

