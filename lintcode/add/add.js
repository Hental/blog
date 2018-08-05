const add = (a, b) => {
  const val = a ^ b;
  const ab = a & b;

  if (ab !== 0) {
    return add(val, ab << 1);
  }

  return val;
};

module.exports = add;
