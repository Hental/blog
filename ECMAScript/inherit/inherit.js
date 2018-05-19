function newFun(fn, ...args) {
  const obj = Object.create(null);
  const ret = fn.apply(obj, args);

  if (ret) {
    return ret;
  } else {
    Object.setPrototypeOf(obj, fn.prototype);
    return obj;
  }
}

function inherit(SubClass, SuperClass) {
  Object.setPrototypeOf(SubClass, SuperClass);
  Object.setPrototypeOf(subClass.prototype, superClass.prototype);
}

function inherit2(SubClass, SuperClass) {
  const origin = SubClass.prototype;
  SubClass.prototype = Object.create(SuperClass.prototype);
  SubClass.prototype.constructor = SubClass;

  for (let key in origin) {
    SubClass.prototype[key] = origin[key];
  }

  Object.setPrototypeOf
    ? Object.setPrototypeOf(SubClass, SuperClass)
    : SubClass.__proto__ = SuperClass;
}

function inherit3(SubClass, SuperClass) {
  const origin = SubClass.prototype;
  SubClass.prototype = new SuperClass();

  for (let key in SubClass.prototype) {
    delete SubClass.prototype[key];
  }

  SubClass.prototype.constructor = SubClass;

  for (let key in origin) {
    SubClass.prototype[key] = origin[key];
  }

  Object.setPrototypeOf
    ? Object.setPrototypeOf(SubClass, SuperClass)
    : SubClass.__proto__ = SuperClass;
}

module.exports = {
  inherit,
  inherit2,
  inherit3,
};
