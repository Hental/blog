const fiber = require('./fiber');

describe('fiber question', () => {
  const fiberRecords = {
    0: 0,
    1: 1,
    2: 1,
    3: 2,
    4: 3,
    5: 5,
    6: 8,
    37: 24157817,
    77: 5527939700884757,
    100: 354224848179262000000,
  }

  it('dynamtic programming', () => {
    Object.entries(fiberRecords).forEach(([arg, ret]) => {
      expect(fiber(Number(arg))).toBe(ret);
    });
  });

  it('recursion', () => {
    const fn = fiber.recursion;
    Object.entries(fiberRecords).forEach(([arg, ret]) => {
      const v = Number(arg);
      if (v < 50) expect(fiber(v)).toBe(ret);
    });
  });
});
