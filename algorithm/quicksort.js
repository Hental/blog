const array = [7, 12, 6, 78, 22, 23, 11, 0, 8, 22, 99, 10, 33];

function quickSort(origin) {
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

  return r([...origin]);
}

function quickSort2(origin) {
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
        arr[i] = arr[lessIndex];
        arr[lessIndex] = element;
        lessIndex++;
      }
    }

    [arr[lessIndex], arr[pivotIndex]] = [arr[pivotIndex], arr[lessIndex]];

    pivotIndex = lessIndex;

    r(arr, startIndex, pivotIndex);
    r(arr, pivotIndex + 1, endIndex);
  }

  const targrt = [...origin];
  r(targrt, 0, targrt.length);
  return targrt;
}

// console.log(quickSort(array));
console.log(quickSort2(array));

