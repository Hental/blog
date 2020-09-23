// typeof
function createArray(input: number | { length: number }): any[] {
  if (typeof input === 'number') {
    // 在这个分支下，input 的类型确定为 number 类型
    return Array(input);
  }

  if (typeof input === 'object') {
    // 在这个分支下，input 的类型确定为 { length: number } 类型
    return Array(input.length);
  }
}


// instanceof
class Car {
  ride(): void {};
}

class Bike {
  run(): void {};
}

function doSome(item: Car | Bike) {
  if (item instanceof Car) {
    // 在这个分支下，item 的类型确定为 Car 类型
    item.ride();
  }

  if (item instanceof Bike) {
    // 在这个分支下，item 的类型确定为 Bike 类型
    item.run();
  }
}
