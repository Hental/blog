type AvailableAresURL<T> = {
  [Alias in keyof T]: Alias extends string
    ? keyof T[Alias] extends string
    ? `module://${Alias}/${keyof T[Alias]}`
    : never
    : never;
}[keyof T];

export interface GetUrl<M = Record<string, Record<string, string>>> {
  <P extends AvailableAresURL<M>>(path: P): string;
}


//  test
type MyAresManifest = {
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

let getUrl: GetUrl<MyAresManifest> = (() => { }) as any;
let url = getUrl('module://moduleA/path/to/css');
