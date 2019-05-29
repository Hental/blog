function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

// 最基本的实现
exports.quickSort = function quickSort(origin) {
  function r(arr) {
    if (arr.length <= 1) {
      return arr;
    }

    const base = arr[0];
    const less = [], greater = [];

    for (let i = 1; i < arr.length; i += 1) {
      const element = arr[i];
      if (element >= base) {
        greater.push(element);
      } else {
        less.push(element);
      }
    }

    return r(less).concat(base).concat(r(greater));
  }

  return r(origin);
}

// 原地交换，空间复杂 O(nlogn) => O(1)
exports.quickSort2 = function quickSort2(origin) {
  function r(arr, startIndex, endIndex) {
    if (endIndex - startIndex <= 1) {
      return;
    }

    let pivotIndex = endIndex - 1;
    let lessIndex = startIndex;
    const pivot = arr[pivotIndex];

    for (let i = startIndex; i < endIndex - 1; i += 1) {
      const element = arr[i];
      if (element < pivot) {
        swap(arr, i, lessIndex);
        lessIndex++;
      }
    }

    swap(arr, lessIndex, pivotIndex);

    pivotIndex = lessIndex;

    r(arr, startIndex, pivotIndex);
    r(arr, pivotIndex + 1, endIndex);
  }

  r(origin, 0, origin.length);
  return origin;
}

// 优化
exports.quickSort3 = function quickSort3(origin) {
  function r(arr, head, tail) {
    if (head >= tail) {
      return;
    }

    let i = head;
    let j = tail;
    let pivotIndex = parseInt((tail + head) / 2, 10);
    const pivot = arr[pivotIndex];

    while (i < j) {
      while (arr[i] < pivot) {
        ++i;
      }
      while (arr[j] > pivot) {
        --j;
      }
      if (i < j) {
        swap(arr, i, j);
        ++i;
        --j;
      } else if (i === j) {
        ++i;
      }
    }

    r(arr, head, j);
    r(arr, i, tail);
  }

  r(origin, 0, origin.length - 1);
  return origin;
}
