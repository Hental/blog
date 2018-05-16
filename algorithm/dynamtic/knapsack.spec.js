const knapsack = require('./knapsack');

const kinds = [
  {
    weight: 12,
    price: 4,
  },
  {
    weight: 2,
    price: 2,
  },
  {
    weight: 1,
    price: 1,
  },
  {
    weight: 1,
    price: 2,
  },
  {
    weight: 4,
    price: 10,
  }
]

const maxWeight = 15;

describe('knapsack question', () => {
  it('dynamtic programming', () => {
    expect(knapsack(kinds, 15)).toBe(15);
  });
});
