import { MyPromise } from './Promise';
import { random } from 'faker';

describe('MyPromise', () => {
  it('run fn immediately', () => {
    const fn = jest.fn();
    new MyPromise(fn);
    expect(fn.mock.calls.length).toBe(1);
  });

  it('resolve value', (done) => {
    let value = random.words();
    let promise = new MyPromise((res) => {
      res(value);
    });
    promise.then(val => {
      expect(val).toBe(value);
      done();
    });
  });

  it('reject error', (done) => {
    let error = random.words();
    let promise = new MyPromise((res, rej) => {
      rej(error);
    });
    promise.catch(err => {
      expect(err).toBe(error);
      done();
    });
  });

  it('pass error', (done) => {
    let error = random.words();
    let promise = new MyPromise((res, rej) => {
      rej(error);
    });

    let fn = jest.fn();
    promise
      .then(fn)
      .catch(err => {
        expect(err).toBe(error);
        expect(fn.mock.calls.length).toBe(0);
        done();
      });
  });

  it('allow multi then', (done) => {
    let value = random.words();
    let promise = new MyPromise((res, rej) => {
      res(value);
    });

    let fn = jest.fn();
    promise.then(fn);
    promise.then(fn);
    promise.then(fn);
    promise.then(fn);
    promise.then((res) => {
      expect(res).toBe(value);
      expect(fn.mock.calls.length).toBe(4);
      done();
    });
  });
})
