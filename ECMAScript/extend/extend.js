function Parent() {
}

Parent.staticVal = 'static from Parent';

Parent.prototype = {
    constructor: Parent,

    sayHi() {
        return 'this is parent';
    },

    isParent: true,
}

function Child() {
}

Child.prototype.sayHi = function sayHi() {
    return 'this is child';
}

Child.prototype.isChild = true;

class ChildByClass extends Parent {
    sayHi() {
        return 'this is child extend by class extend';
    }
}

Parent.extend = function extend(proto) {
    const parent = this;
    let child;
    let prototype;

    // check proto has constructor
    if (Object.prototype.hasOwnProperty.call(proto, 'constructor') ) {
        child = proto.constructor;
    } else {
        child = function child() {
            // super(arguments)
            return parent.apply(this, arguments);
        };
    }

    // assign static values
    Object.assign(child, parent);

    // create child prototype by parent prototype 
    prototype = Object.create(parent.prototype);
    prototype.constructor = child;

    // assign child own prototype
    Object.assign(prototype, proto);

    child.prototype = prototype;
    return child;
}

function extend(sub, parent) {
    const subProto = sub.prototype;
    const parentProto = parent.prototype;

    sub.prototype = Object.create(parentProto);
    sub.prototype.constructor = sub;

    Object.assign(sub.prototype, subProto);
    Object.assign(sub, parent);
}

const ChildByExt = Parent.extend({
    sayHi() {
        return 'this is child extend by fn';
    },
});

function isExtend(sub, parent) {
    if (sub && sub.prototype) {
        return sub.prototype instanceof parent;
    }
    return false;
}

function isInstance(ins, Parent) {
    if (!ins) return false;
    if (ins === Parent.prototype) {
        return true;
    } else {
        return isInstance(ins.__proto__, Parent);
    }
}

extend(Child, Parent);
const instanceByExt = new ChildByExt();
const instance = new Child();
const instanceByClass = new ChildByClass();
console.log(isExtend(Child, Parent), isExtend(ChildByExt, Parent));
