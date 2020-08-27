interface Context {
  left: number;
  right: number;
}

function findTarget(array: number[], left: number, right: number, targetIndex: number): number {
  let pivotIndex = left;
  let pivot = array[pivotIndex];

  for (let i = pivotIndex + 1; i <= right; i++) {
    const element = array[i];
    if (element < pivot) {
      swap(array, i, pivotIndex);
      pivotIndex += 1;
    }
  }

  if (pivotIndex === targetIndex) {
    return array[pivotIndex];
  } else if (pivotIndex < targetIndex) {
    return findTarget(array, pivotIndex + 1, right, targetIndex);
  } else {
    return findTarget(array, left, pivotIndex - 1, targetIndex);
  }
}

function findMiddle(array: number[], left = 0, right = array.length - 1) {
  if (left >= right || left < 0 || right >= array.length) {
    return array;
  }
  const len = array.length;
  const isEven = array.length % 2 === 0;
  const targetIndex = isEven ? (len / 2) - 1 : (len - 1) / 2;

  if (!isEven) {
    return findTarget(array, 0, len - 1, targetIndex);
  } else {
    const a = findTarget(array, 0, len - 1, targetIndex);
    let min = array[targetIndex + 1];
    for (let i = targetIndex + 2; i < array.length; i++) {
      const element = array[i];
      if (element < min) {
        min = element;
      }
    }
    return (a + min) / 2;
  }
}


function swap(array: number[], i: number, j: number) {
  let tmp = array[j];
  array[j] = array[i];
  array[i] = tmp;
}

it("findMiddle", () => {
  expect(findMiddle([1, 7, 2])).toBe(2);
  expect(findMiddle([1, 3, 7, 2])).toBe(2.5);
});
