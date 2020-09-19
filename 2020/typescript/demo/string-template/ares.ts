type AvailableAresUrl<T> = {
  [Alias in keyof T]: Alias extends string
  ? keyof T[Alias] extends string
  ? `module://${Alias}/${keyof T[Alias]}`
  : never
  : never;
}[keyof T];

interface GetUrl<M = Record<string, Record<string, string>>> {
  <P extends AvailableAresUrl<M>>(path: P): string;
}


//  test
type MyAresManifest2 = {
  moduleA: {
    'path/to/imag': 'xxx.png',
    'path/to/js': 'xx.js',
    'path/to/css': 'xx.css',
  };
  moduleB: {
    'path/to/font': 'xxx.woff',
    'path/to/svg': 'xx.svg',
  };
};

let getUrl0: GetUrl<MyAresManifest2> = (() => { }) as any;
let url0 = getUrl0('module://moduleA/path/to/css');

