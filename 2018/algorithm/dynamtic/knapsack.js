function handler(kinds, maxWeight) {
  const resultsMap = new Map();

  const key = (len, max) => `${len},${max}`;

  function r(len, max) {
    const k = key(len, max);

    if (!resultsMap.has(k)) {
      const kind = kinds[len - 1] || {};
      const { weight = 0, price = 0 } = kind;
      if (len === 0) {
        resultsMap.set(k, 0);
      }
      else if (weight > max) {
        resultsMap.set(k, r(len - 1, max));
      }
      else {
        resultsMap.set(k, Math.max(r(len - 1, max), r(len - 1, max - weight) + price));
      }
    }

    return resultsMap.get(k);
  }

  return r(kinds.length, maxWeight);
}

module.exports = handler;
