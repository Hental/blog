const globalThis = new Function('return this;')();

globalThis.__exports = 'hello';

console.log('effect in import:', globalThis);

export function hello(name) {
  return 'say hello: ' + name;
}
