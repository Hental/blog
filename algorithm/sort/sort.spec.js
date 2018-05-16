const sort = require('./sort');

describe('sort', () => {
  let arr = [];
  const sortedArr = [0, 6, 7, 8, 10, 11, 12, 22, 22, 23, 33, 78, 99];

  beforeEach(() => {
    arr = [7, 12, 6, 78, 22, 23, 11, 0, 8, 22, 99, 10, 33];
  });

  Object.entries(sort).forEach(([name, fn]) => {
    it(`${name} sort`, () => {
      expect(fn(arr)).toEqual(sortedArr);
    });
  });
})