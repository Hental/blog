// 需要导出 class
export class Car {
  static type: string = 'family';

  run() {
    console.log('car run');
  }
}

// export default 导出的是一个匿名类，无法在 declare module {} 中合并
export default Car;
