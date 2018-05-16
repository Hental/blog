function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

exports.bubble = (arr, asc = true) => {
  for (let i = 0; i < arr.length; i += 1) {
    let prev = arr[i];
    for (let j = i + 1; j < arr.length; j += 1) {
      let cur = arr[j];

      if ((asc && cur < prev) || (!asc && cur < prev)) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        prev = arr[i];
      }
    }
  }
  return arr;
}

exports.quick = require('./quicksort').quickSort3;

exports.insert = arr => {
  for (let i = 1; i < arr.length; i += 1) {
    let toInserted = arr[i];
    let j;

    for (j = i; j > 0 && arr[j - 1] > toInserted; j -= 1) {
      arr[j] = arr[j - 1];
    }

    arr[j] = toInserted;
  }
  return arr;
};