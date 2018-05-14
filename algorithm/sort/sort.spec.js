const sort = require('./sort');

describe('sort', () => {
  const arr = [7, 12, 6, 78, 22, 23, 11, 0, 8, 22, 99, 10, 33];
  const sortedArr = [0, 6, 7, 8, 10, 11, 12, 22, 22, 23, 33, 78, 99];

  it('bubble sort', () => {
    expect(sort.bubble(arr)).toEqual(sortedArr);
  });
})