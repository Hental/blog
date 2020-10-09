type AvailableAresURL<Manifest> = {
  [Alias in keyof Manifest]: Alias extends string
    ? keyof Manifest[Alias] extends string
    ? `module://${Alias}/${keyof Manifest[Alias]}`
    : never
    : never;
}[keyof Manifest];

export interface GetUrl<Manifest = Record<string, Record<string, string>>> {
  <P extends AvailableAresURL<Manifest>>(path: P): string;
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
