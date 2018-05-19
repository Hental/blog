const MyPromise = require('./promise');

describe('MyPromise', () => {
  it('basic', () => {
    const val = 1000;

    expect.assertions(1);

    new MyPromise(res => {
      setTimeout(() => res(val), 1);
    })
      .then(v => expect(v).toBe(val));
  });

  it('state only change once', () => {
    const promise = new MyPromise(res => res(22));

    expect(promise._fulfill).toThrowError();
    expect(promise._reject).toThrowError();
  });
});
