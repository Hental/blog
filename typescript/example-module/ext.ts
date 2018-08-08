import Car from './app';

declare module './app' {
  // 扩展原型
  interface Car {
    fly(): void;
  }

  // 扩展 Car 类的静态属性
  namespace Car {
    export let spec: { description: string };
  }
}

Car.prototype.fly = function fly() {
  console.log('car fly.');
}

Car.spec = {
  description: ''
};


declare global {
  // 扩展数组的方法
  interface Array<T> {
    myFn(): void;
  }
  // 扩展数组的静态属性
  interface ArrayConstructor {
    myProp: string;
  }
  namespace NodeJS {
    // 扩展 global 对象
    interface Global {
      myAttr: string;
    }
  }
}

Array.prototype.myFn = () => console.log('my fn.');
Array.myProp = '';
global.myAttr = 'some';
