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

function handler() {
  const results = new Map();

  const key = (index, max) => `${index},${max}`;

  function r(index, max) {
    const k = key(index, max);
    if (!results.get(k)) {
      const kind = kinds[index];
      if (index === 0) {
        results.set(k, kind.weight > max ? 0 : kind.price);
      }
      else if (kind.weight > max) {
        results.set(k, r(index - 1, max));
      }
      else {
        results.set(k, Math.max(r(index - 1, max), r(index - 1, max - kind.weight) + kind.price));
      }
    }

    return results.get(k);
  }

  const ret = r(kinds.length - 1, maxWeight);
  console.log(ret, results);
  return ret;
}

handler()
