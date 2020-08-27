function testSort(sortFn: (arr: number[]) => number[]) {
  const testCase = (array: number[], expectArray: number[]) => {
    const result = sortFn(array);
    console.log('sort result :', result);
    expect(result).toEqual(expectArray);
  }

  testCase([1, 3, 2, 7, 4], [1, 2, 3, 4, 7])
}

function swapArray(array: number[], i: number, j: number) {
  let tmp = array[j];
  array[j] = array[i];
  array[i] = tmp;
}

function selectSort(array: number[]) {
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    swapArray(array, i, minIndex);
  }
  return array;
}

it("selectSort", () => {
  testSort(selectSort);
});

// 冒泡
function bubbleSort(array: number[]) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      const anotherElement = array[j];
      const element = array[i];
      if (anotherElement < element) {
        swapArray(array, i, j);
      }
    }
  }
  return array;
}

it("bubbleSort", () => {
  testSort(bubbleSort);
});

function insertSort(array: number[]) {
  for (let i = 0; i < array.length; i+=1) {
    const element = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > element) {
      array[j + 1] = array[j];
      j-=1;
    }
    array[j + 1] = element;
  }
  return array;
}

it("insertSort", () => {
  testSort(insertSort);
});

function shellSort(array: number[]) {
  let gap = Math.floor(array.length / 2);

  while (gap > 0) {
    for (let i = 0; i < array.length; i += gap) {
      const element = array[i];
      let j = i - gap;
      while (j >= 0 && array[j] > element) {
        array[j + gap] = array[j];
        j -= gap;
      }
      array[j + gap] = element;
    }
    gap = Math.floor(gap / 2);
  }
  return array;
}

it("shellSort", () => {
  testSort(shellSort);
});

function quickSort(array: number[], left = 0, right = array.length - 1) {
  if (left >= right || left < 0 || right >= array.length) {
    return array;
  }

  let pivotIndex = left;
  let pivot = array[pivotIndex];

  for (let i = pivotIndex + 1; i <= right; i++) {
    const element = array[i];
    if (element < pivot) {
      swapArray(array, i, pivotIndex);
      pivotIndex += 1;
    }
  }

  quickSort(array, left, pivotIndex - 1);
  quickSort(array, pivotIndex + 1, right);
  return array;
}

it("quickSort", () => {
  testSort(quickSort);
});
