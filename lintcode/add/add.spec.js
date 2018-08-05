const fn = require('./add');
const faker = require('faker');

const { random } = faker;

describe('a + b', () => {
  it('basic', () => {
    const a = random.number(1000), b = random.number(1000);
    expect(fn(a, b)).toBe(a + b);
  });
});
