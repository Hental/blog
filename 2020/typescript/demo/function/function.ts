let add: (x: number, y: number) => number = (x, y) => x + y;

function addFn(x: number, y: number): number {
  return x + y;
};

interface Add {
  (x: number, y: number): number
}
let myAdd: Add = (x, y) => x + y;
myAdd(1, 3);


// component
interface MyComponent {
  (props: { text: string }): null;
  displayName?: string;
}
let comp: MyComponent = () => null;
comp.displayName = 'foo';


// overload
type Option = { method: string };
export function request(url: string, opt: Option): Promise<any>;
export function request(opt: Option & { url: string }): Promise<any>;
export function request(optOrUrl: string | Option & { url: string }, opt?: Option): Promise<any> {
  return Promise.resolve();
};
request('', { method: 'GET' });
request({ method: 'GET', url: '' });
